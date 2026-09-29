# Docs paywall — Google login + ₹99 lifetime via Dodo Payments

**Date:** 2026-09-29
**Status:** Approved design
**Builds on:** `2026-09-29-instagram-docs-design.md`

## Goal

Three docs stay free; every other doc (current and future) unlocks with a one-time ₹99 lifetime purchase through Dodo Payments. Buyers pay without an account and claim access later by signing in with Google. Paid PDFs must be unreachable without a verified purchase.

## Decisions

| Topic | Decision |
|---|---|
| Backend | Firebase Blaze on `baseproject-25dbe`: Cloud Functions (2nd gen, `asia-south1`) + Cloud Storage |
| Purchase flow | Pay first, claim later (email match, or payment ID for recovery) |
| Free docs | `free: true` flag in `docs.ts`: `zero-budget-ways-to-get-users`, `legal-checklist-before-you-submit`, `app-store-launch-guide` |
| Old public links | Docs #2–#5 copied to private Storage; their Drive files switched to Restricted; Drive IDs removed from site code |
| Price | ₹99 one-time, INR (UPI, RuPay, cards) — Dodo is merchant of record |

## Security model

- **Source of truth is Dodo's API, not the webhook body.** The webhook is only a signed trigger; the function re-fetches `GET /payments/{payment_id}` with the secret API key and checks `status == "succeeded"`, `product_cart` contains the lifetime product id, `currency == "INR"`, `total_amount >= 9900`.
- **Webhook verification (Standard Webhooks):** headers `webhook-id`, `webhook-timestamp`, `webhook-signature`; HMAC-SHA256 over `${id}.${timestamp}.${rawBody}` with the base64-decoded secret (after `whsec_`); constant-time compare against each `v1,<sig>` entry; reject timestamps more than 5 minutes from now.
- **Secrets** `DODO_API_KEY`, `DODO_WEBHOOK_SECRET` in Secret Manager via `firebase functions:secrets:set` — never in git, client code, or chat. Non-secret params (`DODO_PRODUCT_ID`, `DODO_API_BASE`) via `defineString`.
- **Paid PDFs** in Storage at `paid-docs/{slug}.pdf`. Storage rules deny all client reads/writes. Access only via `getDocLink`, which returns a V4 signed URL valid for 10 minutes.
- **Firestore** (Admin SDK in functions bypasses rules):
  - `purchases/{paymentId}` — `{ email, amount, currency, status: "paid" | "revoked", claimedBy: uid | null, createdAt, updatedAt }`. Clients: no access.
  - `entitlements/{uid}` — `{ lifetime: true, paymentId, email, grantedAt }`. Client may read only its own; no client writes.
  - Existing `docStats` and `users` rules unchanged.
- **Callable functions** require `request.auth` with `email_verified == true`.
- **Email matching** normalises: trim + lowercase. (No Gmail dot-stripping — exact mailbox after lowercasing; mismatches use payment-ID recovery.)
- **One claim per payment:** `claimedBy` set in a transaction; a payment claimed by another uid is refused.
- **Revocation:** `refund.succeeded`, `dispute.opened`, `dispute.lost` → `purchases/{payment_id}.status = "revoked"` and delete `entitlements/{claimedBy}` (if its `paymentId` matches).
- **Cost guard:** ₹100 monthly budget alert on the billing account.

## Architecture

### Cloud Functions — `functions/` (TypeScript, Node 20, `firebase-functions` v6, `firebase-admin` v13)

Pure logic in `functions/src/lib/` (unit-tested, no Firebase imports):
- `verifyWebhook(headers, rawBody, secret, nowSec) → boolean`
- `normalizeEmail(email) → string`
- `isQualifyingPayment(payment, productId) → boolean`
- `revokingEvent(type) → boolean`

Handlers in `functions/src/index.ts`:
- **`dodoWebhook`** (HTTPS `onRequest`, POST only): verify signature → on `payment.succeeded` fetch payment from Dodo → if qualifying, upsert `purchases/{id}` (idempotent) → if `metadata.uid` present or a Firebase user exists for the email, grant `entitlements/{uid}` and set `claimedBy`. On revoking events, revoke. Always 2xx after a valid signature (so Dodo stops retrying); 401 on bad signature.
- **`claimAccess`** (callable, `{ paymentId?: string }`): if `paymentId` given → load purchase (fetch from Dodo and upsert if missing — handles webhook lag) → claim for caller if unclaimed or already theirs. Else → query `purchases` where `email == normalized(caller email)` and `status == "paid"` → claim the first unclaimed/own. Returns `{ lifetime: boolean }`.
- **`getDocLink`** (callable, `{ slug: string, download?: boolean }`): slug must match `^[a-z0-9-]{3,60}$` and be in the paid-doc list shipped with functions; caller must have `entitlements/{uid}`; returns `{ url }` signed for 10 min (`responseDisposition` attachment when `download`).

### Site

- `src/data/docs.ts`: add `free: boolean`; free docs keep `driveId`; paid docs have no `driveId` (Drive IDs of #2–#5 removed).
- `src/lib/firebase.ts`: shared lazy `getApp()` used by stats, auth and functions.
- `src/lib/auth.ts`: lazy `firebase/auth`; `signInWithGoogle()` (popup, redirect fallback), `signOut()`, `onUser(cb)`; `isInAppBrowser()` (Instagram/Facebook UA).
- `src/lib/access.ts`: `readEntitlement(uid)`, `claimAccess(paymentId?)`, `openPaidDoc(slug, download)` via `firebase/functions` (`asia-south1`).
- `src/lib/checkout.ts`: `checkoutUrl({ email?, uid? })` → `https://checkout.dodopayments.com/buy/{productId}?quantity=1&redirect_url=https://garoono.in/docs/&email=…&metadata_uid=…` (test base in dev via `NEXT_PUBLIC_DODO_MODE`).
- UI: auth chip, unlock banner, payment-return banner, in-app-browser hint, locked card state, recovery box, marquee lock icon + `/docs#slug` link for locked chips.

### Adding a paid doc

`npm run add-doc -- <pdf> <slug> "<title>" "<blurb>"` (local, macOS): renders cover via `sips`, uploads PDF to `gs://<bucket>/paid-docs/<slug>.pdf` with `gcloud storage cp` (account `garoonotech@gmail.com`), prints the `docs.ts` entry and the paid-slug list update for `functions/src/paidDocs.ts`.

## Setup owned by Gautam

1. Upgrade `baseproject-25dbe` to Blaze; set ₹100 budget alert.
2. Firebase Auth → enable Google provider; authorized domains include `garoono.in`.
3. Dodo (test mode): create one-time product "Garoono Docs Lifetime" ₹99 INR; send product id. After functions deploy, add webhook endpoint (URL provided) subscribed to `payment.succeeded`, `refund.succeeded`, `dispute.opened`, `dispute.lost`.
4. Run `firebase functions:secrets:set DODO_API_KEY` and `… DODO_WEBHOOK_SECRET`.
5. After PDFs are in Storage: set Drive files #2–#5 to Restricted.

## Verification

- Vitest unit tests for the pure function logic (signature, qualification, normalisation, revocation) and site helpers.
- Live rules probes (REST, public key): `purchases` unreadable/unwritable; `entitlements` unwritable and only self-readable; Storage unreadable; `getDocLink` refuses signed-out / unpaid / bad slug.
- Dodo test-mode end-to-end: guest pay → return banner → Google sign-in → unlocked → paid doc opens → signed URL expires; pay as A, sign in as B, recover via payment ID; refund → access revoked.
- Go-live: switch to live product/secrets, one real ₹99 purchase + refund, confirm old Drive links for #2–#5 are denied.

## Out of scope

Blog (separate spec), subscriptions, coupons, admin UI, App Check.
