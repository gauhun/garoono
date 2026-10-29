# Products page + ₹199 paid calls

**Date:** 2026-10-29
**Status:** Approved design
**Builds on:** `2026-09-29-docs-paywall-design.md` (same Firebase project, Dodo account, webhook and functions codebase)

## Goal

One `/products/` page that lists everything garoono.in sells, and a `/call/` page where anyone books a paid 30 minute call with Gautam: pick a slot, it is held 15 minutes, pay ₹199 on Dodo, then a Google Calendar invite with a Meet link goes out from garoonotech@gmail.com.

## What is sold

| Product | Price | This build |
|---|---|---|
| Docs lifetime pass | ₹99 (existing) | Card links to `/docs/` |
| 1:1 call, 30 min | ₹199 / Dodo localises abroad | Full booking flow |
| Course: Ship mobile apps with Claude Code, idea to App Store | Waitlist ₹999, presale ₹1,499, launch ₹1,999, $29 flat abroad | Waitlist sign-up only; purchase + lessons are a later build |
| Kits: Rejection Playbook, Store Screenshot Kit, App Launch Checklist | ₹199 / $7 each, not in the ₹99 pass, free for course buyers | Listed as "coming soon" until each is written |

Out of scope: done-for-you services, live classes, community, subscriptions, changes to the ₹99 pass.

### Course stages

`COURSE_STAGE` in `src/data/offers.ts` is `"waitlist" | "presale" | "launch"`, switched by Gautam. Waitlist: email form. Presale/launch (later build): Dodo checkout for the course product; waitlist emails get a Dodo discount code bringing the price to ₹999. Course buyers get recorded lessons (signed URLs, like paid PDFs), the cleaned Flutter starter code and one free call.

## Calls

### Slot rules (`functions/src/lib/slots.ts`, pure, unit-tested)

- Every day, 20:00, 20:30, 21:00, 21:30 IST (UTC+05:30, no DST), 30 minutes each.
- Bookable from now + 2 h to now + 14 days.
- A slot is free when it overlaps no busy interval on garoonotech@gmail.com's primary calendar and has no live hold or booking in Firestore. Gautam blocks a day by adding a busy event.

### Flow

1. `/call/` calls `getCallSlots` → open slot ids (UTC ISO).
2. Visitor picks a slot and enters name, email, topic → `holdCallSlot` re-checks the calendar, then in a transaction on `callSlots/{slotId}` refuses if it is booked or held with `holdUntil > now`, else writes `{ status: "held", holdId, holdUntil: now + 15 min, name, email, topic }`. Returns the Dodo checkout URL for the call product with `email`, `metadata_slot`, `metadata_hold`, `redirect_url=https://garoono.in/call/`.
3. Dodo `payment.succeeded` → existing `dodoWebhook` fetches the payment from Dodo; if the cart has the call product it runs `bookCall`:
   - transaction: slot doc must still carry this `holdId` (even if the 15 min passed, as long as nobody else took it) and not be booked → `status: "booked", paymentId`. Already booked with the same `paymentId` → no-op (webhook retries).
   - otherwise → refund the full payment via Dodo `POST /refunds` with a reason, record `callBookings/{paymentId}.status = "refunded"`.
   - on success create the Calendar event (summary `Call with {name}`, topic in description, buyer as attendee, Meet via `conferenceData.createRequest`, `sendUpdates=all`) and save `eventId` + `meetLink` on `callBookings/{paymentId}`.
4. Buyer returns to `/call/?payment_id=…&status=succeeded` → "Paid. Your invite is on its way to {email}".

### Google Calendar access

garoonotech@gmail.com is a personal account, so a service account cannot invite attendees. Functions use an OAuth refresh token for that account (scopes `calendar.events`, `calendar.freebusy`) via plain REST (`oauth2.googleapis.com/token`, `calendar/v3/freeBusy`, `calendar/v3/calendars/primary/events`), no new dependency. The OAuth consent screen must be **In production** (Testing-mode refresh tokens expire after 7 days). `scripts/calendar-token.mjs` runs the loopback OAuth flow and pipes the token straight into `firebase functions:secrets:set GOOGLE_CAL_REFRESH_TOKEN --data-file -`, so it is never printed.

## Security

- Secrets: `GOOGLE_CAL_CLIENT_ID`, `GOOGLE_CAL_CLIENT_SECRET`, `GOOGLE_CAL_REFRESH_TOKEN` (Secret Manager). Param: `DODO_CALL_PRODUCT_ID`.
- Payment truth stays Dodo's API, never the webhook body or the return URL.
- `holdCallSlot` validates slot (must be a generated slot id), email, name (≤ 80), topic (≤ 500). `callSlots`, `callBookings`, `courseWaitlist` have no client access.
- Shortcut: holds need no sign-in, so someone could hold every slot for 15 min with fake emails. Upgrade to App Check or Google sign-in if that happens.

## Waitlist

`joinWaitlist({ email })` → `courseWaitlist/{normalizedEmail}` `{ email, createdAt }`, idempotent.

## Setup owned by Gautam

1. Dodo: create one-time product "1:1 Call (30 min)" ₹199, test and live. Send both ids.
2. Google Cloud (baseproject-25dbe): enable Calendar API, OAuth consent screen → External, In production; create a Desktop OAuth client. Store its id/secret with `firebase functions:secrets:set`.
3. Run `node scripts/calendar-token.mjs` and sign in as garoonotech@gmail.com.
4. Deploy functions (`--only functions:garoono`) and rules, then the site.

## Verification

- Vitest: slot generation (window, notice, horizon, busy overlap, holds), hold decision, booking decision, checkout URL.
- Dodo test mode: book → pay → invite with Meet link arrives; two holds on one slot refused; hold expired and taken by another → refund.
