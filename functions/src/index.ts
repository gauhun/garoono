import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions";
import { defineSecret, defineString } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall, onRequest, type CallableRequest } from "firebase-functions/v2/https";
import { canClaim, firstName, isQualifyingPayment, normalizeEmail, PAYMENT_ID_RE, revocationFor, SLUG_RE, type DodoPayment } from "./lib/payments.js";
import { verifyWebhook } from "./lib/webhook.js";

initializeApp();
// Least-privilege runtime identity: Firestore, Auth lookups, read on the paid-docs bucket, and URL signing
setGlobalOptions({
  region: "asia-south1",
  maxInstances: 5,
  serviceAccount: "garoono-functions@baseproject-25dbe.iam.gserviceaccount.com",
});

const DODO_API_KEY = defineSecret("DODO_API_KEY");
const DODO_WEBHOOK_SECRET = defineSecret("DODO_WEBHOOK_SECRET");
const DODO_API_BASE = defineString("DODO_API_BASE");
const DODO_PRODUCT_ID = defineString("DODO_PRODUCT_ID");
const PAID_DOCS_BUCKET = defineString("PAID_DOCS_BUCKET");

const db = getFirestore();
const purchases = db.collection("purchases");
const entitlements = db.collection("entitlements");
const proWall = db.collection("proWall");
// Public counter shown on /docs; only functions write it
const proCount = db.collection("publicStats").doc("pro");

// ─── Dodo ────────────────────────────────────────────────────────────────────

async function fetchPayment(paymentId: string): Promise<DodoPayment | null> {
  const res = await fetch(`${DODO_API_BASE.value()}/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${DODO_API_KEY.value()}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Dodo API ${res.status}`);
  return (await res.json()) as DodoPayment;
}

// ─── Purchases ───────────────────────────────────────────────────────────────

// Re-checks the payment with Dodo and stores it once; never touches an existing record's status
async function recordVerifiedPayment(paymentId: string): Promise<DodoPayment | null> {
  const payment = await fetchPayment(paymentId);
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

// ─── Webhook ─────────────────────────────────────────────────────────────────

export const dodoWebhook = onRequest({ secrets: [DODO_API_KEY, DODO_WEBHOOK_SECRET] }, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const valid = verifyWebhook(
    { id: req.header("webhook-id"), timestamp: req.header("webhook-timestamp"), signature: req.header("webhook-signature") },
    req.rawBody.toString("utf8"),
    DODO_WEBHOOK_SECRET.value(),
    Math.floor(Date.now() / 1000),
  );
  if (!valid) {
    logger.warn("Rejected webhook with bad signature");
    res.status(401).end();
    return;
  }

  const event = req.body as { type?: string; data?: { payment_id?: string } };
  const paymentId = event.data?.payment_id;

  try {
    if (event.type === "payment.succeeded" && paymentId) {
      const payment = await recordVerifiedPayment(paymentId);
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
