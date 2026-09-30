# Docs Paywall Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lock all but 3 docs behind a ₹99 lifetime Dodo purchase that buyers claim with Google sign-in, with paid PDFs served only via short-lived signed URLs.

**Architecture:** Three Cloud Functions (codebase `garoono`, `asia-south1`) own all trust decisions: `dodoWebhook` records verified payments, `claimAccess` binds a purchase to a signed-in Google account, `getDocLink` signs 10-minute URLs for PDFs in a private bucket. The static site only renders state it gets back from those functions. Pure logic lives in `functions/src/lib/` and is unit-tested.

**Tech Stack:** Next.js 15 static export, Firebase JS SDK 12 (auth, functions, firestore/lite), firebase-functions 7, firebase-admin 14, Node 22 runtime, Vitest 3, Dodo Payments static checkout links + webhooks + REST API.

Spec: `docs/superpowers/specs/2026-09-29-docs-paywall-design.md`

## Global Constraints

- Free docs: `zero-budget-ways-to-get-users`, `legal-checklist-before-you-submit`, `app-store-launch-guide`. All others `free: false`.
- Price copy: "₹99 lifetime". UI copy avoids em dashes.
- Region `asia-south1`; functions codebase `garoono`; paid bucket `baseproject-25dbe-paid-docs`.
- Secrets `DODO_API_KEY`, `DODO_WEBHOOK_SECRET` only via `defineSecret` — never in git, client, or chat.
- Clients never read or write `purchases` or `entitlements`.
- Paid PDFs never linked from site code; only `getDocLink` signed URLs (10 min).
- Callables require `request.auth.token.email_verified === true`.
- Existing `users` and `docStats` rules unchanged.
- Static export must keep building.

---

### Task 1: Doc access model + checkout URL

**Files:**
- Modify: `src/data/docs.ts`, `src/data/docs.test.ts`, `src/lib/rankDocs.test.ts`, `scripts/fetch-doc-covers.mjs`
- Create: `src/lib/checkout.ts`, `src/lib/checkout.test.ts`

**Interfaces:**
- Produces:
  - `type SharedDoc = FreeDoc | PaidDoc`; `FreeDoc = DocBase & { free: true; driveId: string }`; `PaidDoc = DocBase & { free: false }`; `DocBase = { slug; title; blurb; addedOn }`
  - `viewUrl(d: FreeDoc)`, `downloadUrl(d: FreeDoc)` (unchanged bodies)
  - `checkoutUrl(opts: { returnUrl: string; email?: string | null; uid?: string | null }, mode?: "test" | "live", productId?: string): string`
  - `LIFETIME_PRICE_LABEL = "₹99"`

- [ ] **Step 1: Failing test** — `src/lib/checkout.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { checkoutUrl } from "./checkout";

describe("checkoutUrl", () => {
  it("builds a test-mode static link with return url", () => {
    const url = new URL(checkoutUrl({ returnUrl: "https://garoono.in/docs/" }, "test", "pdt_abc"));
    expect(url.origin + url.pathname).toBe("https://test.checkout.dodopayments.com/buy/pdt_abc");
    expect(url.searchParams.get("quantity")).toBe("1");
    expect(url.searchParams.get("redirect_url")).toBe("https://garoono.in/docs/");
    expect(url.searchParams.has("email")).toBe(false);
    expect(url.searchParams.has("metadata_uid")).toBe(false);
  });

  it("adds email and uid when signed in, live host in live mode", () => {
    const url = new URL(checkoutUrl({ returnUrl: "https://garoono.in/docs/", email: "a@b.com", uid: "u1" }, "live", "pdt_live"));
    expect(url.origin).toBe("https://checkout.dodopayments.com");
    expect(url.searchParams.get("email")).toBe("a@b.com");
    expect(url.searchParams.get("metadata_uid")).toBe("u1");
  });
});
```

Run `npm test` → FAIL (`./checkout` missing).

- [ ] **Step 2: Implement** — `src/lib/checkout.ts`

```ts
// Flip DODO_MODE to "live" and fill PRODUCT_IDS.live at go-live.
export const DODO_MODE: "test" | "live" = "test";

const PRODUCT_IDS = {
  test: "<test product id from Dodo, pdt_…>",
  live: "",
};

export const LIFETIME_PRICE_LABEL = "₹99";

export function checkoutUrl(
  opts: { returnUrl: string; email?: string | null; uid?: string | null },
  mode: "test" | "live" = DODO_MODE,
  productId: string = PRODUCT_IDS[mode],
) {
  const base = mode === "live" ? "https://checkout.dodopayments.com" : "https://test.checkout.dodopayments.com";
  const query = new URLSearchParams({ quantity: "1", redirect_url: opts.returnUrl });
  if (opts.email) query.set("email", opts.email);
  // Lets the webhook unlock a signed-in buyer immediately, even if they pay with another email
  if (opts.uid) query.set("metadata_uid", opts.uid);
  return `${base}/buy/${productId}?${query}`;
}
```

(The test product id string is replaced with the real `pdt_…` Gautam sends before Task 7.)

- [ ] **Step 3: Doc types** — in `src/data/docs.ts` replace the `SharedDoc` interface with:

```ts
type DocBase = {
  slug: string; // ^[a-z0-9-]{3,60}$
  title: string;
  blurb: string;
  addedOn: string; // ISO date
};

// Free docs link straight to Drive; paid docs live in a private bucket and open via getDocLink
export type FreeDoc = DocBase & { free: true; driveId: string };
export type PaidDoc = DocBase & { free: false };
export type SharedDoc = FreeDoc | PaidDoc;
```

Add `free: true` to the 3 free entries; for the other 4 set `free: false` and delete their `driveId` lines. Change helper signatures to `viewUrl = (d: FreeDoc)` and `downloadUrl = (d: FreeDoc)`.

- [ ] **Step 4: Test fixtures** — in `src/data/docs.test.ts` and `src/lib/rankDocs.test.ts` change `make` to return a `FreeDoc` (`free: true` added). Add to `docs.test.ts`:

```ts
  it("keeps exactly the three chosen docs free", () => {
    expect(docs.filter((d) => d.free).map((d) => d.slug).sort()).toEqual([
      "app-store-launch-guide",
      "legal-checklist-before-you-submit",
      "zero-budget-ways-to-get-users",
    ]);
  });
```

- [ ] **Step 5: Cover script** — in `scripts/fetch-doc-covers.mjs` replace the `entries` line with per-entry parsing, skipping paid docs (their covers come from `add-doc`):

```js
const entries = [...source.matchAll(/\{[^{}]*?slug:\s*"([^"]+)"[^{}]*?\}/g)]
  .map(([block, slug]) => [block, slug, block.match(/driveId:\s*"([^"]+)"/)?.[1]])
  .filter(([, , driveId]) => driveId);
```

- [ ] **Step 6: Verify & commit** — `npm test` PASS (17), `npm run lint`. Build will fail until Task 5 updates components using `viewUrl` on `SharedDoc` — that's expected; commit anyway:

```bash
git add src/data src/lib/checkout.ts src/lib/checkout.test.ts src/lib/rankDocs.test.ts scripts/fetch-doc-covers.mjs
git commit -m "feat: free/paid doc model and Dodo checkout link"
```

---

### Task 2: Pure payment logic (functions/src/lib)

**Files:**
- Create: `functions/src/lib/webhook.ts`, `functions/src/lib/payments.ts`, `functions/src/lib/webhook.test.ts`, `functions/src/lib/payments.test.ts`

**Interfaces:**
- Produces:
  - `verifyWebhook(headers: WebhookHeaders, rawBody: string, secret: string, nowSec: number, toleranceSec?: number): boolean`
  - `type WebhookHeaders = { id?: string; timestamp?: string; signature?: string }`
  - `type DodoPayment = { payment_id: string; status: string; total_amount: number; currency: string; customer?: { email?: string | null } | null; product_cart?: { product_id: string; quantity: number }[] | null; metadata?: Record<string, unknown> | null }`
  - `normalizeEmail(email: string): string`
  - `isQualifyingPayment(p: DodoPayment, productId: string): boolean`
  - `revocationFor(type: string | undefined): boolean | null` — true revoke, false restore, null ignore
  - `canClaim(purchase: { status?: string; claimedBy?: string | null } | undefined, uid: string): boolean`
  - `SLUG_RE`, `PAYMENT_ID_RE`

- [ ] **Step 1: Failing tests** — `functions/src/lib/webhook.test.ts`

```ts
import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyWebhook } from "./webhook";

const rawSecret = Buffer.from("super-secret-signing-key").toString("base64");
const secret = `whsec_${rawSecret}`;
const body = JSON.stringify({ type: "payment.succeeded", data: { payment_id: "pay_123" } });
const now = 1_790_000_000;

function sign(id: string, ts: number, payload: string, key = rawSecret) {
  const sig = createHmac("sha256", Buffer.from(key, "base64")).update(`${id}.${ts}.${payload}`).digest("base64");
  return `v1,${sig}`;
}

describe("verifyWebhook", () => {
  it("accepts a correctly signed, fresh webhook", () => {
    expect(verifyWebhook({ id: "msg_1", timestamp: String(now), signature: sign("msg_1", now, body) }, body, secret, now)).toBe(true);
  });

  it("accepts when one of several signatures matches", () => {
    const sig = `v1,bm9wZQ== ${sign("msg_1", now, body)}`;
    expect(verifyWebhook({ id: "msg_1", timestamp: String(now), signature: sig }, body, secret, now)).toBe(true);
  });

  it("rejects a tampered body", () => {
    const sig = sign("msg_1", now, body);
    expect(verifyWebhook({ id: "msg_1", timestamp: String(now), signature: sig }, body.replace("123", "999"), secret, now)).toBe(false);
  });

  it("rejects the wrong secret", () => {
    const other = Buffer.from("other-key").toString("base64");
    expect(verifyWebhook({ id: "msg_1", timestamp: String(now), signature: sign("msg_1", now, body, other) }, body, secret, now)).toBe(false);
  });

  it("rejects stale or future timestamps", () => {
    const old = now - 301;
    expect(verifyWebhook({ id: "msg_1", timestamp: String(old), signature: sign("msg_1", old, body) }, body, secret, now)).toBe(false);
    const future = now + 301;
    expect(verifyWebhook({ id: "msg_1", timestamp: String(future), signature: sign("msg_1", future, body) }, body, secret, now)).toBe(false);
  });

  it("rejects missing headers", () => {
    expect(verifyWebhook({ timestamp: String(now), signature: sign("msg_1", now, body) }, body, secret, now)).toBe(false);
    expect(verifyWebhook({ id: "msg_1", signature: sign("msg_1", now, body) }, body, secret, now)).toBe(false);
    expect(verifyWebhook({ id: "msg_1", timestamp: String(now) }, body, secret, now)).toBe(false);
  });
});
```

`functions/src/lib/payments.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { canClaim, isQualifyingPayment, normalizeEmail, revocationFor, type DodoPayment } from "./payments";

const paid = (over: Partial<DodoPayment> = {}): DodoPayment => ({
  payment_id: "pay_1",
  status: "succeeded",
  total_amount: 9900,
  currency: "INR",
  customer: { email: "A@B.com" },
  product_cart: [{ product_id: "pdt_life", quantity: 1 }],
  metadata: {},
  ...over,
});

describe("normalizeEmail", () => {
  it("trims and lowercases", () => expect(normalizeEmail("  Gautam@Gmail.COM ")).toBe("gautam@gmail.com"));
});

describe("isQualifyingPayment", () => {
  it("accepts a succeeded payment for the lifetime product", () => expect(isQualifyingPayment(paid(), "pdt_life")).toBe(true));
  it("accepts a localised currency", () => expect(isQualifyingPayment(paid({ currency: "USD", total_amount: 119 }), "pdt_life")).toBe(true));
  it("rejects other statuses", () => expect(isQualifyingPayment(paid({ status: "processing" }), "pdt_life")).toBe(false));
  it("rejects other products", () => expect(isQualifyingPayment(paid(), "pdt_other")).toBe(false));
  it("rejects an empty cart", () => expect(isQualifyingPayment(paid({ product_cart: null }), "pdt_life")).toBe(false));
});

describe("revocationFor", () => {
  it("revokes on refunds and lost/opened disputes", () => {
    for (const t of ["refund.succeeded", "dispute.opened", "dispute.lost"]) expect(revocationFor(t)).toBe(true);
  });
  it("restores on a won dispute", () => expect(revocationFor("dispute.won")).toBe(false));
  it("ignores everything else", () => {
    for (const t of ["payment.succeeded", "refund.failed", undefined]) expect(revocationFor(t)).toBe(null);
  });
});

describe("canClaim", () => {
  it("allows an unclaimed paid purchase", () => expect(canClaim({ status: "paid", claimedBy: null }, "u1")).toBe(true));
  it("allows re-claiming your own", () => expect(canClaim({ status: "paid", claimedBy: "u1" }, "u1")).toBe(true));
  it("refuses someone else's", () => expect(canClaim({ status: "paid", claimedBy: "u2" }, "u1")).toBe(false));
  it("refuses revoked or missing", () => {
    expect(canClaim({ status: "revoked", claimedBy: null }, "u1")).toBe(false);
    expect(canClaim(undefined, "u1")).toBe(false);
  });
});
```

Run `npm test` → FAIL (modules missing).

- [ ] **Step 2: Implement** — `functions/src/lib/webhook.ts`

```ts
import { createHmac, timingSafeEqual } from "node:crypto";

export type WebhookHeaders = { id?: string; timestamp?: string; signature?: string };

// Standard Webhooks: HMAC-SHA256 over "id.timestamp.body", base64, header "v1,<sig> v1,<sig2>"
export function verifyWebhook(headers: WebhookHeaders, rawBody: string, secret: string, nowSec: number, toleranceSec = 300) {
  const { id, timestamp, signature } = headers;
  if (!id || !timestamp || !signature) return false;

  const ts = Number(timestamp);
  if (!Number.isInteger(ts) || Math.abs(nowSec - ts) > toleranceSec) return false;

  const key = Buffer.from(secret.startsWith("whsec_") ? secret.slice(6) : secret, "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${rawBody}`).digest();

  return signature.split(" ").some((entry) => {
    const [version, sig] = entry.split(",");
    if (version !== "v1" || !sig) return false;
    const given = Buffer.from(sig, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
```

`functions/src/lib/payments.ts`

```ts
export type DodoPayment = {
  payment_id: string;
  status: string;
  total_amount: number;
  currency: string;
  customer?: { email?: string | null } | null;
  product_cart?: { product_id: string; quantity: number }[] | null;
  metadata?: Record<string, unknown> | null;
};

export const SLUG_RE = /^[a-z0-9-]{3,60}$/;
export const PAYMENT_ID_RE = /^[A-Za-z0-9_-]{6,80}$/;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

// The product is what was bought; Dodo may localise the amount/currency for overseas buyers
export function isQualifyingPayment(p: DodoPayment, productId: string) {
  return p.status === "succeeded" && (p.product_cart ?? []).some((item) => item.product_id === productId);
}

const REVOKE = new Set(["refund.succeeded", "dispute.opened", "dispute.lost"]);
const RESTORE = new Set(["dispute.won"]);

export function revocationFor(type: string | undefined): boolean | null {
  if (!type) return null;
  if (REVOKE.has(type)) return true;
  if (RESTORE.has(type)) return false;
  return null;
}

export function canClaim(purchase: { status?: string; claimedBy?: string | null } | undefined, uid: string) {
  if (!purchase || purchase.status !== "paid") return false;
  return !purchase.claimedBy || purchase.claimedBy === uid;
}
```

- [ ] **Step 3: Verify & commit** — `npm test` → PASS (all suites). Commit:

```bash
git add functions/src/lib
git commit -m "feat: webhook verification and purchase rules for the paywall"
```

---

### Task 3: Cloud Functions

**Files:**
- Create: `functions/package.json`, `functions/tsconfig.json`, `functions/.env`, `functions/.gitignore`, `functions/src/index.ts`
- Modify: `firebase.json`, `tsconfig.json` (exclude `functions`), `firestore.rules` (explicit server-only blocks)

**Interfaces:**
- Consumes: Task 2 exports.
- Produces (deployed): `dodoWebhook` (HTTPS POST), `claimAccess` (callable `{ paymentId?: string } → { lifetime: boolean }`), `getDocLink` (callable `{ slug: string; download?: boolean } → { url: string }`), all in `asia-south1`.

- [ ] **Step 1: Package** — `functions/package.json`

```json
{
  "name": "garoono-functions",
  "private": true,
  "main": "lib/index.js",
  "engines": { "node": "22" },
  "scripts": { "build": "tsc" },
  "dependencies": {
    "firebase-admin": "^14.5.0",
    "firebase-functions": "^7.4.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0"
  }
}
```

`functions/tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "outDir": "lib",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts"]
}
```

`functions/.gitignore`: `lib/` and `node_modules/`.

`functions/.env` (non-secret params):

```
DODO_API_BASE=https://test.dodopayments.com
DODO_PRODUCT_ID=<test product id, pdt_…>
PAID_DOCS_BUCKET=baseproject-25dbe-paid-docs
```

Run: `npm --prefix functions install`.

- [ ] **Step 2: Handlers** — `functions/src/index.ts`

```ts
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions";
import { defineSecret, defineString } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall, onRequest, type CallableRequest } from "firebase-functions/v2/https";
import { canClaim, isQualifyingPayment, normalizeEmail, PAYMENT_ID_RE, revocationFor, SLUG_RE, type DodoPayment } from "./lib/payments.js";
import { verifyWebhook } from "./lib/webhook.js";

initializeApp();
setGlobalOptions({ region: "asia-south1", maxInstances: 5 });

const DODO_API_KEY = defineSecret("DODO_API_KEY");
const DODO_WEBHOOK_SECRET = defineSecret("DODO_WEBHOOK_SECRET");
const DODO_API_BASE = defineString("DODO_API_BASE");
const DODO_PRODUCT_ID = defineString("DODO_PRODUCT_ID");
const PAID_DOCS_BUCKET = defineString("PAID_DOCS_BUCKET");

const db = getFirestore();
const purchases = db.collection("purchases");
const entitlements = db.collection("entitlements");

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
    if (!canClaim(snap.data(), uid)) return false;
    tx.update(ref, { claimedBy: uid, updatedAt: FieldValue.serverTimestamp() });
    tx.set(entitlements.doc(uid), { lifetime: true, paymentId, email, grantedAt: FieldValue.serverTimestamp() });
    return true;
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
    if (!entRef) return;
    if (revoked && ent?.data()?.paymentId === paymentId) tx.delete(entRef);
    if (!revoked) tx.set(entRef, { lifetime: true, paymentId, email: data.email, grantedAt: FieldValue.serverTimestamp() });
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
      if (payment && owner) await claim(payment.payment_id, owner, normalizeEmail(payment.customer?.email ?? ""));
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
    if (await claim(paymentId, uid, email)) return { lifetime: true };
  }

  if ((await entitlements.doc(uid).get()).exists) return { lifetime: true };

  const matches = await purchases.where("email", "==", email).where("status", "==", "paid").limit(10).get();
  for (const doc of matches.docs) {
    if (await claim(doc.id, uid, email)) return { lifetime: true };
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
```

- [ ] **Step 3: Wire config** — `firebase.json`:

```json
{
  "firestore": {
    "rules": "firestore.rules"
  },
  "functions": [
    {
      "source": "functions",
      "codebase": "garoono",
      "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run build"]
    }
  ]
}
```

Root `tsconfig.json` `"exclude"`: `["node_modules", "functions"]`.

`firestore.rules`: inside `match /databases/{database}/documents`, after `docStats`, add:

```
    // Paywall records: written only by Cloud Functions (Admin SDK); no client access
    match /purchases/{paymentId} {
      allow read, write: if false;
    }
    match /entitlements/{uid} {
      allow read, write: if false;
    }
```

- [ ] **Step 4: Verify** — `npm --prefix functions run build` → no errors; `npm test` PASS; `npm run build` for the site unaffected by `functions/` (still fails only on Task 1's `viewUrl` typing until Task 5).

- [ ] **Step 5: Commit**

```bash
git add functions/package.json functions/package-lock.json functions/tsconfig.json functions/.env functions/.gitignore functions/src/index.ts firebase.json tsconfig.json firestore.rules
git commit -m "feat: Cloud Functions for Dodo webhook, access claims and signed doc links"
```

---

### Task 4: Client auth + access

**Files:**
- Modify: `src/lib/firebase.ts`, `src/lib/docStats.ts`
- Create: `src/lib/auth.ts`, `src/lib/access.ts`, `src/lib/useAccess.ts`

**Interfaces:**
- Produces:
  - `getFirebaseApp(): Promise<FirebaseApp>`
  - `signInWithGoogle(): Promise<void>`, `signOutUser(): Promise<void>`, `watchUser(cb: (u: User | null) => void): Promise<() => void>`, `isInAppBrowser(): boolean`
  - `claimAccess(paymentId?: string): Promise<{ lifetime: boolean }>`, `openPaidDoc(slug: string, download: boolean): Promise<void>`
  - `useAccess(): Access` with `{ user, ready, lifetime, checking, justPaid, error, signIn, signOut, recover(paymentId), recheck() }`

- [ ] **Step 1:** Append to `src/lib/firebase.ts`:

```ts
import type { FirebaseApp } from "firebase/app";

let appPromise: Promise<FirebaseApp> | null = null;

// One lazily created app shared by stats, auth and functions
export function getFirebaseApp() {
  appPromise ??= import("firebase/app").then(({ getApps, initializeApp }) => getApps()[0] ?? initializeApp(firebaseConfig));
  return appPromise;
}
```

(Put the `import type` line at the top of the file.)

In `src/lib/docStats.ts` replace `getDb` body and imports:

```ts
import type { Firestore } from "firebase/firestore/lite";
import { getFirebaseApp } from "./firebase";
import { EMPTY_STATS, type DocStats } from "./rankDocs";
…
function getDb() {
  dbPromise ??= Promise.all([getFirebaseApp(), import("firebase/firestore/lite")]).then(([app, { getFirestore }]) =>
    getFirestore(app),
  );
  return dbPromise;
}
```

- [ ] **Step 2:** `src/lib/auth.ts`

```ts
import type { User } from "firebase/auth";
import { getFirebaseApp } from "./firebase";

async function authModule() {
  const [app, mod] = await Promise.all([getFirebaseApp(), import("firebase/auth")]);
  return { auth: mod.getAuth(app), mod };
}

export async function signInWithGoogle() {
  const { auth, mod } = await authModule();
  const provider = new mod.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    await mod.signInWithPopup(auth, provider);
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
    throw e;
  }
}

export async function signOutUser() {
  const { auth, mod } = await authModule();
  await mod.signOut(auth);
}

export async function watchUser(cb: (user: User | null) => void) {
  const { auth, mod } = await authModule();
  return mod.onAuthStateChanged(auth, cb);
}

// Google blocks OAuth inside Instagram/Facebook/LinkedIn in-app browsers
export const isInAppBrowser = () => /Instagram|FBAN|FBAV|FB_IAB|LinkedInApp/i.test(navigator.userAgent);
```

- [ ] **Step 3:** `src/lib/access.ts`

```ts
import { getFirebaseApp } from "./firebase";

async function call<T>(name: string, data: unknown): Promise<T> {
  const [app, fns, auth] = await Promise.all([getFirebaseApp(), import("firebase/functions"), import("firebase/auth")]);
  auth.getAuth(app); // registers auth so the callable carries the ID token
  const fn = fns.httpsCallable(fns.getFunctions(app, "asia-south1"), name);
  return (await fn(data)).data as T;
}

export const claimAccess = (paymentId?: string) =>
  call<{ lifetime: boolean }>("claimAccess", paymentId ? { paymentId } : {});

// Opens the tab synchronously so popup blockers allow it, then points it at the signed URL
export async function openPaidDoc(slug: string, download: boolean) {
  const tab = window.open("about:blank", "_blank");
  try {
    const { url } = await call<{ url: string }>("getDocLink", { slug, download });
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      window.location.href = url;
    }
  } catch (e) {
    tab?.close();
    throw e;
  }
}
```

- [ ] **Step 4:** `src/lib/useAccess.ts`

```ts
"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { claimAccess } from "./access";
import { signInWithGoogle, signOutUser, watchUser } from "./auth";

const PENDING_KEY = "garoono.pendingPayment";

function readPending() {
  try {
    return localStorage.getItem(PENDING_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

function writePending(paymentId: string | null) {
  try {
    if (paymentId) localStorage.setItem(PENDING_KEY, paymentId);
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    // Storage blocked: the buyer can still recover with the payment ID from their receipt
  }
}

export type Access = {
  user: User | null;
  ready: boolean;
  lifetime: boolean;
  checking: boolean;
  justPaid: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  recover: (paymentId: string) => Promise<boolean>;
  recheck: () => Promise<boolean>;
};

export function useAccess(): Access {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [lifetime, setLifetime] = useState(false);
  const [checking, setChecking] = useState(false);
  const [justPaid, setJustPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dodo sends buyers back to /docs/?payment_id=…&status=succeeded
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("payment_id");
    if (paymentId && params.get("status") === "succeeded") writePending(paymentId);
    if (paymentId) window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    if (readPending()) setJustPaid(true);
  }, []);

  const check = useCallback(async (paymentId?: string) => {
    setChecking(true);
    setError(null);
    try {
      const result = await claimAccess(paymentId);
      setLifetime(result.lifetime);
      if (result.lifetime) {
        writePending(null);
        setJustPaid(false);
      }
      return result.lifetime;
    } catch {
      setError("Couldn't check your access. Try again in a moment.");
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    watchUser((u) => {
      setUser(u);
      setReady(true);
      if (u) void check(readPending());
      else setLifetime(false);
    }).then((fn) => {
      if (cancelled) fn();
      else unsubscribe = fn;
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [check]);

  const signIn = useCallback(async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Google sign-in didn't finish. Allow popups for this site and try again.");
    }
  }, []);

  return {
    user,
    ready,
    lifetime,
    checking,
    justPaid,
    error,
    signIn,
    signOut: signOutUser,
    recover: (paymentId) => check(paymentId.trim()),
    recheck: () => check(readPending()),
  };
}
```

- [ ] **Step 5:** `npm run lint`, `npm test` → pass. Commit:

```bash
git add src/lib/firebase.ts src/lib/docStats.ts src/lib/auth.ts src/lib/access.ts src/lib/useAccess.ts
git commit -m "feat: Google sign-in and access claiming on the client"
```

---

### Task 5: Paywall UI

**Files:**
- Create: `src/components/AccessPanel.tsx`
- Modify: `src/components/DocsLibrary.tsx`, `src/components/DocCard.tsx`, `src/components/DocsMarquee.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: `useAccess`, `Access`, `openPaidDoc`, `checkoutUrl`, `LIFETIME_PRICE_LABEL`, `isInAppBrowser`, `FreeDoc`/`SharedDoc`.
- Produces: `AuthChip({ access })`, `UnlockBanner({ access, onBuy })`; `DocCard` gains props `{ locked: boolean; onBuy: () => void }`.

- [ ] **Step 1:** `src/components/AccessPanel.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import { isInAppBrowser } from "../lib/auth";
import { LIFETIME_PRICE_LABEL } from "../lib/checkout";
import type { Access } from "../lib/useAccess";

function useInAppBrowser() {
  const [inApp, setInApp] = useState(false);
  useEffect(() => setInApp(isInAppBrowser()), []);
  return inApp;
}

export function AuthChip({ access }: { access: Access }) {
  const inApp = useInAppBrowser();
  if (!access.ready) return null;

  if (!access.user) {
    if (inApp) return <span className="auth-hint">Open in your browser to sign in</span>;
    return (
      <button type="button" className="auth-chip" onClick={access.signIn}>
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="auth-chip is-user">
      {access.user.photoURL && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={access.user.photoURL} alt="" width={22} height={22} referrerPolicy="no-referrer" />
      )}
      <span className="auth-email">{access.user.email}</span>
      <button type="button" className="auth-signout" onClick={access.signOut}>
        Sign out
      </button>
    </div>
  );
}

export function UnlockBanner({ access, onBuy }: { access: Access; onBuy: () => void }) {
  const inApp = useInAppBrowser();
  const [showRecover, setShowRecover] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [recoverFailed, setRecoverFailed] = useState(false);

  if (access.lifetime) {
    return <div className="unlock-banner is-owner">✓ Lifetime access. Every doc, including future ones.</div>;
  }

  if (access.justPaid) {
    return (
      <div className="unlock-banner is-paid">
        <div className="unlock-copy">
          <strong>Payment received 🎉</strong>
          {access.user ? (
            <span>{access.checking ? "Unlocking your docs…" : "Still confirming your payment. This can take a minute."}</span>
          ) : inApp ? (
            <span>Tap ⋯ then Open in browser, and sign in with Google there to unlock.</span>
          ) : (
            <span>Sign in with Google to unlock your docs.</span>
          )}
        </div>
        {!access.user && !inApp && (
          <button type="button" className="doc-btn doc-btn-primary" onClick={access.signIn}>
            Sign in with Google
          </button>
        )}
        {access.user && !access.checking && (
          <button type="button" className="doc-btn" onClick={access.recheck}>
            Check again
          </button>
        )}
        {access.error && <p className="unlock-error">{access.error}</p>}
      </div>
    );
  }

  return (
    <div className="unlock-banner">
      <div className="unlock-copy">
        <strong>Unlock all docs · {LIFETIME_PRICE_LABEL} lifetime</strong>
        <span>One payment. Every doc I publish, forever.</span>
      </div>
      <button type="button" className="doc-btn doc-btn-primary" onClick={onBuy}>
        Get lifetime access
      </button>
      <button type="button" className="unlock-link" onClick={() => setShowRecover((v) => !v)}>
        Already bought?
      </button>

      {showRecover && (
        <div className="recover-box">
          {!access.user ? (
            <>
              <p>{inApp ? "Open this page in your browser, then sign in with Google using the email you paid with." : "Sign in with Google using the email you paid with."}</p>
              {!inApp && (
                <button type="button" className="doc-btn" onClick={access.signIn}>
                  Sign in with Google
                </button>
              )}
            </>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setRecoverFailed(!(await access.recover(paymentId)));
              }}
            >
              <p>Paid with a different email? Paste the payment ID from your Dodo receipt.</p>
              <div className="recover-row">
                <input
                  className="email-input"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder="pay_…"
                  aria-label="Payment ID"
                />
                <button type="submit" className="btn-subscribe" disabled={!paymentId.trim() || access.checking}>
                  {access.checking ? "…" : "Unlock"}
                </button>
              </div>
              {recoverFailed && <p className="unlock-error">No unclaimed purchase found for that ID.</p>}
            </form>
          )}
          {access.error && <p className="unlock-error">{access.error}</p>}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2:** `src/components/DocsLibrary.tsx` — add imports and wire access:

```tsx
import { AuthChip, UnlockBanner } from "./AccessPanel";
import { checkoutUrl } from "../lib/checkout";
import { useAccess } from "../lib/useAccess";
```

Inside the component, before `return`:

```tsx
  const access = useAccess();
  const buy = () => {
    window.location.href = checkoutUrl({
      returnUrl: `${window.location.origin}/docs/`,
      email: access.user?.email,
      uid: access.user?.uid,
    });
  };
```

Replace the `<header>…</header>` block with:

```tsx
      <header className="docs-header">
        <div>
          <h1 className="font-serif docs-title">Docs</h1>
          <p className="docs-subtitle">Playbooks &amp; checklists I share on Instagram</p>
        </div>
        <AuthChip access={access} />
      </header>

      <UnlockBanner access={access} onBuy={buy} />
```

And the card render:

```tsx
          <DocCard
            key={d.slug}
            doc={d}
            index={i}
            stats={live ? (live[d.slug] ?? EMPTY_STATS) : null}
            onCount={onCount}
            locked={!d.free && !access.lifetime}
            onBuy={buy}
          />
```

- [ ] **Step 3:** `src/components/DocCard.tsx` — props and open handlers:

```tsx
import { openPaidDoc } from "../lib/access";
import { LIFETIME_PRICE_LABEL } from "../lib/checkout";

type Props = {
  doc: SharedDoc;
  index: number;
  stats: DocStats | null;
  onCount: (slug: string, counter: keyof DocStats, by: number) => void;
  locked: boolean; // paid doc and the visitor has no lifetime access
  onBuy: () => void;
};

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
```

Replace `onView`/`onDownload` with:

```tsx
  const [opening, setOpening] = useState(false);

  // Free docs open Drive links directly; paid docs fetch a 10-minute signed link
  const openPaid = async (download: boolean) => {
    if (opening) return;
    setOpening(true);
    try {
      await openPaidDoc(doc.slug, download);
      if (download ? recordDownload(doc.slug) : recordView(doc.slug)) onCount(doc.slug, download ? "downloads" : "views", 1);
    } catch {
      alert("Couldn't open this doc. Please try again.");
    } finally {
      setOpening(false);
    }
  };

  const onView = () => {
    if (recordView(doc.slug)) onCount(doc.slug, "views", 1);
  };

  const onDownload = () => {
    if (recordDownload(doc.slug)) onCount(doc.slug, "downloads", 1);
  };
```

Cover markup:

```tsx
      {doc.free ? (
        <a href={viewUrl(doc)} target="_blank" rel="noopener noreferrer" onClick={onView} className="doc-cover" aria-label={`Open ${doc.title}`}>
          {cover}
        </a>
      ) : (
        <button type="button" className="doc-cover" onClick={() => (locked ? onBuy() : openPaid(false))} aria-label={locked ? `Unlock ${doc.title}` : `Open ${doc.title}`}>
          {cover}
          {locked && (
            <span className="doc-lock">
              <LockIcon /> Lifetime
            </span>
          )}
        </button>
      )}
```

where `cover` is the existing thumb-or-fallback JSX hoisted into a `const cover = (…)` above `return`.

Actions markup:

```tsx
        {locked ? (
          <button type="button" className="doc-btn doc-btn-primary doc-unlock" onClick={onBuy}>
            <LockIcon /> Unlock with lifetime · {LIFETIME_PRICE_LABEL}
          </button>
        ) : doc.free ? (
          <div className="doc-actions">
            <a href={viewUrl(doc)} target="_blank" rel="noopener noreferrer" onClick={onView} className="doc-btn">View</a>
            <a href={downloadUrl(doc)} target="_blank" rel="noopener noreferrer" onClick={onDownload} className="doc-btn doc-btn-primary">Download</a>
          </div>
        ) : (
          <div className="doc-actions">
            <button type="button" className="doc-btn" onClick={() => openPaid(false)} disabled={opening}>View</button>
            <button type="button" className="doc-btn doc-btn-primary" onClick={() => openPaid(true)} disabled={opening}>Download</button>
          </div>
        )}
```

Add `id={doc.slug}` to the `motion.article`.

- [ ] **Step 4:** `src/components/DocsMarquee.tsx` — paid chips link to their card:

```tsx
              <a
                key={`${copy}-${d.slug}`}
                href={d.free ? viewUrl(d) : `/docs/#${d.slug}`}
                target={d.free ? "_blank" : undefined}
                rel={d.free ? "noopener noreferrer" : undefined}
                className="doc-chip"
                aria-hidden={copy === 1 || undefined}
                tabIndex={copy === 1 ? -1 : undefined}
                onClick={d.free ? () => recordView(d.slug) : undefined}
              >
                …existing img + title…
                {!d.free && <span className="doc-chip-lock" aria-label="Lifetime access">🔒</span>}
                …existing NEW dot…
              </a>
```

- [ ] **Step 5:** Append CSS to `src/app/globals.css`:

```css
/* ─── Paywall ────────────────────────────────────────────────────── */
.docs-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.auth-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--bg-card);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
}

.auth-chip.is-user { padding: 4px 6px 4px 4px; cursor: default; }
.auth-chip img { border-radius: 50%; }
.auth-email { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }

.auth-signout {
  border: none;
  background: var(--bg-page);
  border-radius: var(--radius-btn);
  padding: 4px 10px;
  font: inherit;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}

.auth-hint { margin-top: 28px; font-size: 12px; color: var(--text-tertiary); }

.unlock-banner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 16px;
  margin-top: 20px;
  padding: 16px;
  border: 1px solid var(--accent);
  border-radius: var(--radius-card);
  background: var(--accent-light);
}

.unlock-banner .doc-btn { padding: 8px 16px; }
.unlock-banner.is-owner { border-color: var(--success); background: var(--success-bg); font-size: 14px; font-weight: 600; }
.unlock-banner.is-paid { border-color: var(--success); background: var(--success-bg); }

.unlock-copy { display: flex; flex-direction: column; flex: 1; min-width: 220px; font-size: 13px; color: var(--text-secondary); }
.unlock-copy strong { font-size: 15px; color: var(--text-primary); }

.unlock-link {
  border: none;
  background: none;
  font: inherit;
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: underline;
  cursor: pointer;
}

.recover-box { flex-basis: 100%; display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--text-secondary); }
.recover-box form { display: flex; flex-direction: column; gap: 8px; }
.recover-row { display: flex; max-width: 420px; }
.unlock-error { flex-basis: 100%; font-size: 12px; color: #B91C1C; }

button.doc-cover { position: relative; width: 100%; padding: 0; border: none; border-bottom: 1px solid var(--border); cursor: pointer; }

.doc-lock {
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-btn);
  background: rgba(26, 26, 26, 0.85);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.doc-unlock { display: inline-flex; align-items: center; justify-content: center; gap: 6px; margin-top: 8px; width: 100%; cursor: pointer; }
.doc-actions button.doc-btn { font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
.doc-actions button.doc-btn:disabled { opacity: 0.6; cursor: progress; }
.doc-card { scroll-margin-top: 24px; }
.doc-chip-lock { font-size: 11px; }
```

- [ ] **Step 6:** `npm run lint && npm test && npm run build` pass. Screenshot `/docs/` (dev server, Playwright, 1440 and 390 widths): locked cards show lock badge + unlock button; free cards unchanged; banner visible. Commit:

```bash
git add src/components src/app/globals.css
git commit -m "feat: paywall UI with Google sign-in, unlock banner and locked cards"
```

---

### Task 6: add-doc script

**Files:**
- Create: `scripts/add-doc.mjs`
- Modify: `package.json` (`"add-doc": "node scripts/add-doc.mjs"`), `.gitignore` (`/private-docs/`)

- [ ] **Step 1:** `scripts/add-doc.mjs`

```js
// Publishes a paid doc: renders its covers from page 1 and uploads the PDF to the
// private bucket. macOS only (uses sips). Usage: npm run add-doc -- <file.pdf> <slug>
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const [pdf, slug] = process.argv.slice(2);
const BUCKET = "gs://baseproject-25dbe-paid-docs";
const ACCOUNT = "garoonotech@gmail.com";

if (!pdf || !slug) {
  console.error("Usage: npm run add-doc -- <file.pdf> <slug>");
  process.exit(1);
}
if (!/^[a-z0-9-]{3,60}$/.test(slug)) {
  console.error("Slug must match ^[a-z0-9-]{3,60}$");
  process.exit(1);
}
if (!existsSync(pdf)) {
  console.error(`Not found: ${pdf}`);
  process.exit(1);
}

const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit" });

for (const [suffix, width] of [["", "600"], ["-sm", "64"]]) {
  run("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "80", "--resampleWidth", width, pdf, "--out", `public/doc-covers/${slug}${suffix}.jpg`]);
}

run("gcloud", ["storage", "cp", pdf, `${BUCKET}/${slug}.pdf`, "--content-type=application/pdf", `--account=${ACCOUNT}`]);

console.log(`
Uploaded. Add this to the top of docs in src/data/docs.ts:

  {
    slug: "${slug}",
    title: "",
    blurb: "",
    free: false,
    addedOn: "${new Date().toISOString().slice(0, 10)}",
  },
`);
```

- [ ] **Step 2:** Commit:

```bash
git add scripts/add-doc.mjs package.json .gitignore
git commit -m "feat: add-doc script for publishing paid docs"
```

---

### Task 7: Infrastructure, deploy, and test-mode run

Requires Gautam's setup: Blaze, Google provider, `gcloud auth login garoonotech@gmail.com`, Dodo test product id.

- [ ] **Step 1: Bucket + signing permission**

```bash
gcloud storage buckets create gs://baseproject-25dbe-paid-docs --project=baseproject-25dbe --location=asia-south1 --uniform-bucket-level-access --public-access-prevention --account=garoonotech@gmail.com
SA=1018097794451-compute@developer.gserviceaccount.com
gcloud iam service-accounts add-iam-policy-binding $SA --member=serviceAccount:$SA --role=roles/iam.serviceAccountTokenCreator --project=baseproject-25dbe --account=garoonotech@gmail.com
```

- [ ] **Step 2: Move #2–#5 into the bucket** (Drive still public at this point)

```bash
mkdir -p private-docs
for pair in build-paid-apps-on-free-ai-models:1cE2ASVqs39LZYVw-DzUN11Rt0f65wbj0 20-security-checks-before-launch:18_z9S-_8w9zM_e9TjDaj0KAXei2bPQNx six-documents-before-you-prompt:1vhQoMQcE3e6ZIOQFXh2uIxFosC8YJDdu app-seo-playbook:14jH2SenoxtM7aJzTBmGZxIC4VEsYNjzm; do
  slug=${pair%%:*}; id=${pair##*:}
  curl -sL "https://drive.google.com/uc?export=download&id=$id" -o private-docs/$slug.pdf
  file private-docs/$slug.pdf   # must say "PDF document"
  gcloud storage cp private-docs/$slug.pdf gs://baseproject-25dbe-paid-docs/$slug.pdf --content-type=application/pdf --account=garoonotech@gmail.com
done
curl -s -o /dev/null -w "%{http_code}\n" https://storage.googleapis.com/baseproject-25dbe-paid-docs/app-seo-playbook.pdf   # expect 403
```

- [ ] **Step 3: Fill product id** in `src/lib/checkout.ts` (`PRODUCT_IDS.test`) and `functions/.env` (`DODO_PRODUCT_ID`); commit.

- [ ] **Step 4: Deploy rules + functions**

```bash
firebase deploy --only firestore:rules,functions:garoono --project baseproject-25dbe --account garoonotech@gmail.com
```

First deploy prompts for the two secrets — Gautam enters them (or pre-sets with `firebase functions:secrets:set DODO_API_KEY` / `DODO_WEBHOOK_SECRET`). Then in Dodo (test mode) add webhook endpoint `https://asia-south1-baseproject-25dbe.cloudfunctions.net/dodoWebhook` for `payment.succeeded`, `refund.succeeded`, `dispute.opened`, `dispute.lost`, `dispute.won`; put the shown signing secret into `DODO_WEBHOOK_SECRET` and redeploy.

- [ ] **Step 5: Security probes** (public key, no auth)

```bash
K=<FIREBASE_WEB_API_KEY>; B="https://firestore.googleapis.com/v1/projects/baseproject-25dbe/databases/(default)/documents"
curl -s -o /dev/null -w "purchases read %{http_code}\n" "${B}/purchases?key=${K}"        # 403
curl -s -o /dev/null -w "entitlements read %{http_code}\n" "${B}/entitlements?key=${K}"  # 403
curl -s -o /dev/null -w "webhook unsigned %{http_code}\n" -X POST -H 'content-type: application/json' -d '{"type":"payment.succeeded","data":{"payment_id":"pay_x"}}' https://asia-south1-baseproject-25dbe.cloudfunctions.net/dodoWebhook   # 401
curl -s -X POST -H 'content-type: application/json' -d '{"data":{"slug":"app-seo-playbook"}}' https://asia-south1-baseproject-25dbe.cloudfunctions.net/getDocLink   # UNAUTHENTICATED
```

Re-run the `docStats` rule probes from the earlier session to confirm counters still behave.

- [ ] **Step 6: Test-mode purchase** (dev server or deployed site, Dodo test card/UPI): guest pay → banner "Payment received" → sign in → unlocked → open paid doc (signed URL loads; same URL 403 after 10 min) → refund in Dodo dashboard → reload → locked again. Recovery: pay with email A, sign in as B, paste payment ID → unlocked.

- [ ] **Step 7: Push** — `git push origin main` (deploys site). Gautam restricts Drive files #2–#5; confirm their old `drive.google.com/file/d/<id>/view` links no longer show the PDF to a signed-out browser.

- [ ] **Step 8: Go-live** — live product id in `checkout.ts` (`DODO_MODE = "live"`) and `functions/.env` (`DODO_API_BASE=https://live.dodopayments.com`), live secrets, live webhook endpoint; redeploy functions + push site; one real ₹99 purchase + refund.
