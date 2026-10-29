import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions";
import { defineSecret, defineString } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall, onRequest, type CallableRequest } from "firebase-functions/v2/https";
import { createHash, randomUUID } from "node:crypto";
import { FieldPath } from "firebase-admin/firestore";
import { busyIntervals, createCallEvent, type CalendarCreds } from "./lib/calendar.js";
import { canClaim, firstName, isQualifyingPayment, normalizeEmail, PAYMENT_ID_RE, revocationFor, SLUG_RE, type DodoPayment } from "./lib/payments.js";
import { bookingDecision, EMAIL_RE, generateSlots, HOLD_MS, isTaken, SLOT_MS, type SlotDoc } from "./lib/slots.js";
import { verifyWebhook } from "./lib/webhook.js";

initializeApp();
// Least-privilege runtime identity: Firestore, Auth lookups, read on the paid-docs bucket, and URL signing
setGlobalOptions({
  region: "asia-south1",
  maxInstances: 5,
  serviceAccount: "garoono-functions@baseproject-25dbe.iam.gserviceaccount.com",
});

// Live keys. The test-mode pair (DODO_API_KEY / DODO_WEBHOOK_SECRET) stays in Secret Manager for testing
const DODO_API_KEY = defineSecret("DODO_API_KEY_LIVE");
const DODO_WEBHOOK_SECRET = defineSecret("DODO_WEBHOOK_SECRET_LIVE");
const DODO_API_BASE = defineString("DODO_API_BASE");
const DODO_PRODUCT_ID = defineString("DODO_PRODUCT_ID");
const PAID_DOCS_BUCKET = defineString("PAID_DOCS_BUCKET");
const DODO_CALL_PRODUCT_ID = defineString("DODO_CALL_PRODUCT_ID");
// Calls can run on the Dodo test pair (DODO_CALL_MODE=test) while the docs pass stays live
const DODO_API_KEY_TEST = defineSecret("DODO_API_KEY");
const DODO_WEBHOOK_SECRET_TEST = defineSecret("DODO_WEBHOOK_SECRET");
const DODO_CALL_MODE = defineString("DODO_CALL_MODE", { default: "live" });
const DODO_CALL_PRODUCT_ID_TEST = defineString("DODO_CALL_PRODUCT_ID_TEST", { default: "" });
// OAuth refresh token for garoonotech@gmail.com (scripts/calendar-token.mjs)
const GOOGLE_CAL_CLIENT_ID = defineSecret("GOOGLE_CAL_CLIENT_ID");
const GOOGLE_CAL_CLIENT_SECRET = defineSecret("GOOGLE_CAL_CLIENT_SECRET");
const GOOGLE_CAL_REFRESH_TOKEN = defineSecret("GOOGLE_CAL_REFRESH_TOKEN");
const CAL_SECRETS = [GOOGLE_CAL_CLIENT_ID, GOOGLE_CAL_CLIENT_SECRET, GOOGLE_CAL_REFRESH_TOKEN];

const db = getFirestore();
const purchases = db.collection("purchases");
const entitlements = db.collection("entitlements");
const proWall = db.collection("proWall");
// Public counter shown on /docs; only functions write it
const proCount = db.collection("publicStats").doc("pro");

// ─── Dodo ────────────────────────────────────────────────────────────────────

type Dodo = { base: string; key: string };
const liveDodo = (): Dodo => ({ base: DODO_API_BASE.value(), key: DODO_API_KEY.value() });
const testDodo = (): Dodo => ({ base: "https://test.dodopayments.com", key: DODO_API_KEY_TEST.value() });

async function fetchPayment(paymentId: string, dodo = liveDodo()): Promise<DodoPayment | null> {
  const res = await fetch(`${dodo.base}/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${dodo.key}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Dodo API ${res.status}`);
  return (await res.json()) as DodoPayment;
}

// ─── Purchases ───────────────────────────────────────────────────────────────

// Re-checks the payment with Dodo and stores it once; never touches an existing record's status
async function recordVerifiedPayment(paymentId: string, fetched?: DodoPayment | null): Promise<DodoPayment | null> {
  const payment = fetched === undefined ? await fetchPayment(paymentId) : fetched;
  if (!payment || !isQualifyingPayment(payment, DODO_PRODUCT_ID.value())) return null;

  const ref = purchases.doc(payment.payment_id);
  await db.runTransaction(async (tx) => {
    if ((await tx.get(ref)).exists) return;
    tx.create(ref, {
      email: normalizeEmail(payment.customer?.email ?? ""),
      amount: payment.total_amount,
      currency: payment.currency,
      status: "paid",
      claimedBy: null,
      createdAt: FieldValue.serverTimestamp(),
    });
  });
  return payment;
}

async function claim(paymentId: string, uid: string, email: string) {
  const ref = purchases.doc(paymentId);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const entRef = entitlements.doc(uid);
    const alreadyPro = (await tx.get(entRef)).exists;
    if (!canClaim(snap.data(), uid)) return false;
    tx.update(ref, { claimedBy: uid, updatedAt: FieldValue.serverTimestamp() });
    tx.set(entRef, { lifetime: true, paymentId, email, grantedAt: FieldValue.serverTimestamp() });
    if (!alreadyPro) tx.set(proCount, { count: FieldValue.increment(1) }, { merge: true });
    return true;
  });
}

// Every Pro member appears on the public wall unless they chose to hide
async function syncWall(uid: string) {
  const [ent, existing] = await Promise.all([entitlements.doc(uid).get(), proWall.doc(uid).get()]);
  if (!ent.exists || ent.data()?.hideFromWall === true || existing.exists) return;
  const user = await getAuth().getUser(uid).catch(() => null);
  await proWall.doc(uid).set({
    name: firstName(user?.displayName ?? ""),
    photoURL: user?.photoURL ?? null,
    joinedAt: ent.data()?.grantedAt ?? FieldValue.serverTimestamp(),
  });
}

async function setRevoked(paymentId: string, revoked: boolean) {
  const ref = purchases.doc(paymentId);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data();
    if (!data) return;
    const owner = data.claimedBy as string | null;
    const entRef = owner ? entitlements.doc(owner) : null;
    const ent = entRef ? await tx.get(entRef) : null;

    tx.update(ref, { status: revoked ? "revoked" : "paid", updatedAt: FieldValue.serverTimestamp() });
    if (!entRef || !owner) return;
    if (revoked && ent?.data()?.paymentId === paymentId) {
      tx.delete(entRef);
      tx.delete(proWall.doc(owner));
      tx.set(proCount, { count: FieldValue.increment(-1) }, { merge: true });
    }
    if (!revoked && !ent?.exists) {
      tx.set(entRef, { lifetime: true, paymentId, email: data.email, grantedAt: FieldValue.serverTimestamp() });
      tx.set(proCount, { count: FieldValue.increment(1) }, { merge: true });
    }
  });
}

// A buyer who is already a user (by checkout metadata or verified email) is unlocked straight away
async function findOwner(payment: DodoPayment): Promise<string | null> {
  const metaUid = payment.metadata?.uid;
  if (typeof metaUid === "string" && metaUid) {
    const user = await getAuth().getUser(metaUid).catch(() => null);
    if (user) return user.uid;
  }
  const email = payment.customer?.email;
  if (!email) return null;
  const user = await getAuth().getUserByEmail(normalizeEmail(email)).catch(() => null);
  return user?.emailVerified ? user.uid : null;
}

// ─── Paid calls ──────────────────────────────────────────────────────────────

const callSlots = db.collection("callSlots");
const callBookings = db.collection("callBookings");

const calCreds = (): CalendarCreds => ({
  clientId: GOOGLE_CAL_CLIENT_ID.value(),
  clientSecret: GOOGLE_CAL_CLIENT_SECRET.value(),
  refreshToken: GOOGLE_CAL_REFRESH_TOKEN.value(),
});

async function refundPayment(paymentId: string, reason: string, dodo: Dodo) {
  const res = await fetch(`${dodo.base}/refunds`, {
    method: "POST",
    headers: { Authorization: `Bearer ${dodo.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ payment_id: paymentId, reason }),
  });
  if (!res.ok) throw new Error(`Dodo refund ${res.status}`);
}

// Runs on every payment.succeeded for the call product; safe to repeat on webhook retries
async function bookCall(payment: DodoPayment, dodo: Dodo) {
  const paymentId = payment.payment_id;
  const slotId = payment.metadata?.slot;
  const holdId = payment.metadata?.hold;
  const bookingRef = callBookings.doc(paymentId);

  const decision = await db.runTransaction(async (tx) => {
    const booking = (await tx.get(bookingRef)).data();
    if (booking?.status === "refunded") return "done";
    if (typeof slotId !== "string" || typeof holdId !== "string" || !slotId) {
      tx.set(bookingRef, { status: "refunding", createdAt: FieldValue.serverTimestamp() }, { merge: true });
      return "refund";
    }
    const slotRef = callSlots.doc(slotId);
    const slot = (await tx.get(slotRef)).data() as (SlotDoc & { name?: string; email?: string; topic?: string }) | undefined;
    const d = bookingDecision(slot, holdId, paymentId);
    if (d === "book") {
      tx.update(slotRef, { status: "booked", paymentId });
      tx.set(bookingRef, {
        status: "booked",
        slot: slotId,
        name: slot?.name ?? "",
        email: slot?.email ?? "",
        topic: slot?.topic ?? "",
        createdAt: FieldValue.serverTimestamp(),
      });
    } else if (d === "refund") {
      tx.set(bookingRef, { status: "refunding", slot: slotId, createdAt: FieldValue.serverTimestamp() }, { merge: true });
    }
    return d;
  });

  if (decision === "refund") {
    logger.warn("Call slot lost, refunding", { paymentId, slotId });
    await refundPayment(paymentId, "The call slot you picked was taken before your payment arrived", dodo);
    await bookingRef.update({ status: "refunded", updatedAt: FieldValue.serverTimestamp() });
    return;
  }
  if (decision === "done") return;

  const booking = (await bookingRef.get()).data();
  if (!booking || booking.eventId) return;
  const start = Date.parse(booking.slot);
  const { eventId, meetLink } = await createCallEvent(calCreds(), {
    // Calendar event ids allow 0-9a-v only; hex fits
    id: createHash("sha256").update(paymentId).digest("hex"),
    start,
    end: start + SLOT_MS,
    name: booking.name,
    email: booking.email,
    topic: booking.topic,
  });
  await bookingRef.update({ eventId, meetLink, updatedAt: FieldValue.serverTimestamp() });
}

// ─── Webhook ─────────────────────────────────────────────────────────────────

export const dodoWebhook = onRequest({ secrets: [DODO_API_KEY, DODO_WEBHOOK_SECRET, DODO_API_KEY_TEST, DODO_WEBHOOK_SECRET_TEST, ...CAL_SECRETS] }, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const headers = { id: req.header("webhook-id"), timestamp: req.header("webhook-timestamp"), signature: req.header("webhook-signature") };
  const body = req.rawBody.toString("utf8");
  const nowSec = Math.floor(Date.now() / 1000);
  const live = verifyWebhook(headers, body, DODO_WEBHOOK_SECRET.value(), nowSec);
  const test = !live && verifyWebhook(headers, body, DODO_WEBHOOK_SECRET_TEST.value(), nowSec);
  if (!live && !test) {
    logger.warn("Rejected webhook with bad signature");
    res.status(401).end();
    return;
  }

  const event = req.body as { type?: string; data?: { payment_id?: string } };
  const paymentId = event.data?.payment_id;

  try {
    if (test) {
      // Test payments only ever book calls, never open the docs pass
      const fetched = event.type === "payment.succeeded" && paymentId ? await fetchPayment(paymentId, testDodo()) : null;
      if (fetched && isQualifyingPayment(fetched, DODO_CALL_PRODUCT_ID_TEST.value())) await bookCall(fetched, testDodo());
    } else if (event.type === "payment.succeeded" && paymentId) {
      const fetched = await fetchPayment(paymentId);
      if (fetched && isQualifyingPayment(fetched, DODO_CALL_PRODUCT_ID.value())) {
        await bookCall(fetched, liveDodo());
        res.status(200).json({ received: true });
        return;
      }
      const payment = await recordVerifiedPayment(paymentId, fetched);
      const owner = payment && (await findOwner(payment));
      if (payment && owner && (await claim(payment.payment_id, owner, normalizeEmail(payment.customer?.email ?? "")))) {
        await syncWall(owner);
      }
    } else if (paymentId) {
      const revoke = revocationFor(event.type);
      if (revoke !== null) await setRevoked(paymentId, revoke);
    }
    res.status(200).json({ received: true });
  } catch (e) {
    logger.error("Webhook handling failed", { type: event.type, paymentId, error: String(e) });
    res.status(500).end(); // Dodo retries
  }
});

// ─── Callables ───────────────────────────────────────────────────────────────

function requireVerifiedUser(req: CallableRequest) {
  const uid = req.auth?.uid;
  const email = req.auth?.token.email;
  if (!uid || !email || req.auth?.token.email_verified !== true) {
    throw new HttpsError("unauthenticated", "Sign in with Google first.");
  }
  return { uid, email: normalizeEmail(email) };
}

export const claimAccess = onCall({ secrets: [DODO_API_KEY] }, async (req) => {
  const { uid, email } = requireVerifiedUser(req);
  const rawId = (req.data as { paymentId?: unknown } | undefined)?.paymentId;

  if (typeof rawId === "string" && rawId.trim()) {
    const paymentId = rawId.trim();
    if (!PAYMENT_ID_RE.test(paymentId)) throw new HttpsError("invalid-argument", "That doesn't look like a payment ID.");
    // Covers the gap between the buyer landing back and the webhook arriving
    if (!(await purchases.doc(paymentId).get()).exists) await recordVerifiedPayment(paymentId);
    if (await claim(paymentId, uid, email)) {
      await syncWall(uid);
      return { lifetime: true };
    }
  }

  if ((await entitlements.doc(uid).get()).exists) {
    await syncWall(uid);
    return { lifetime: true };
  }

  const matches = await purchases.where("email", "==", email).where("status", "==", "paid").limit(10).get();
  for (const doc of matches.docs) {
    if (await claim(doc.id, uid, email)) {
      await syncWall(uid);
      return { lifetime: true };
    }
  }
  return { lifetime: false };
});

export const getDocLink = onCall(async (req) => {
  const { uid } = requireVerifiedUser(req);
  const { slug, download } = (req.data ?? {}) as { slug?: unknown; download?: unknown };
  if (typeof slug !== "string" || !SLUG_RE.test(slug)) throw new HttpsError("invalid-argument", "Unknown doc.");

  if (!(await entitlements.doc(uid).get()).exists) {
    throw new HttpsError("permission-denied", "Lifetime access required.");
  }

  const file = getStorage().bucket(PAID_DOCS_BUCKET.value()).file(`${slug}.pdf`);
  const [exists] = await file.exists();
  if (!exists) throw new HttpsError("not-found", "Unknown doc.");

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 10 * 60 * 1000,
    responseType: "application/pdf",
    responseDisposition: download === true ? `attachment; filename="${slug}.pdf"` : "inline",
  });
  return { url };
});

// Pro members are on the wall by default; this lets them hide or come back
export const setProWall = onCall(async (req) => {
  const { uid } = requireVerifiedUser(req);
  const show = (req.data as { show?: unknown } | undefined)?.show === true;

  const entRef = entitlements.doc(uid);
  if (!(await entRef.get()).exists) {
    throw new HttpsError("permission-denied", "Lifetime access required.");
  }

  await entRef.update({ hideFromWall: !show });
  if (show) await syncWall(uid);
  else await proWall.doc(uid).delete();
  return { onWall: show };
});

// ─── Calls: slots and holds ──────────────────────────────────────────────────

async function takenSlots(now: number) {
  const snap = await callSlots.where(FieldPath.documentId(), ">=", new Date(now).toISOString()).get();
  return new Set(snap.docs.filter((d) => isTaken(d.data() as SlotDoc, now)).map((d) => d.id));
}

export const getCallSlots = onCall({ secrets: CAL_SECRETS }, async () => {
  const now = Date.now();
  const [busy, taken] = await Promise.all([busyIntervals(calCreds(), now, now + 15 * 86_400_000), takenSlots(now)]);
  return { slots: generateSlots(now, busy, taken) };
});

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// shortcut: no sign-in, so fake emails could hold every slot for 15 min; add App Check if that happens
export const holdCallSlot = onCall({ secrets: CAL_SECRETS }, async (req) => {
  const d = (req.data ?? {}) as Record<string, unknown>;
  const slot = clean(d.slot, 40);
  const name = clean(d.name, 80);
  const email = normalizeEmail(clean(d.email, 254));
  const topic = clean(d.topic, 500);
  if (!name || !EMAIL_RE.test(email) || !topic) throw new HttpsError("invalid-argument", "Add your name, email and what you want to talk about.");

  const now = Date.now();
  // Only real, still bookable slot ids get through
  if (!generateSlots(now, [], new Set()).includes(slot)) throw new HttpsError("invalid-argument", "That time is no longer available.");
  const start = Date.parse(slot);
  const busy = await busyIntervals(calCreds(), start, start + SLOT_MS);
  if (busy.length) throw new HttpsError("already-exists", "That time was just taken. Pick another one.");

  const holdId = randomUUID();
  const ref = callSlots.doc(slot);
  await db.runTransaction(async (tx) => {
    if (isTaken((await tx.get(ref)).data() as SlotDoc | undefined, now)) {
      throw new HttpsError("already-exists", "That time was just taken. Pick another one.");
    }
    tx.set(ref, { status: "held", holdId, holdUntil: now + HOLD_MS, name, email, topic });
  });

  const test = DODO_CALL_MODE.value() === "test";
  const host = test ? "https://test.checkout.dodopayments.com" : "https://checkout.dodopayments.com";
  const product = test ? DODO_CALL_PRODUCT_ID_TEST.value() : DODO_CALL_PRODUCT_ID.value();
  const query = new URLSearchParams({
    quantity: "1",
    redirect_url: "https://garoono.in/call/",
    email,
    metadata_slot: slot,
    metadata_hold: holdId,
  });
  return { url: `${host}/buy/${product}?${query}`, holdUntil: now + HOLD_MS };
});

// ─── Course waitlist ─────────────────────────────────────────────────────────

export const joinWaitlist = onCall(async (req) => {
  const email = normalizeEmail(clean((req.data as { email?: unknown } | undefined)?.email, 254));
  if (!EMAIL_RE.test(email)) throw new HttpsError("invalid-argument", "That email doesn't look right.");
  const ref = db.collection("courseWaitlist").doc(email);
  await ref.create({ email, createdAt: FieldValue.serverTimestamp() }).catch((e: { code?: number }) => {
    if (e.code !== 6) throw e; // 6 = ALREADY_EXISTS: joining twice is fine
  });
  return { ok: true };
});
