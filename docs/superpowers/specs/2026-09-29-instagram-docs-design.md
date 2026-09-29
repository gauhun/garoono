# Instagram Docs — marquee + /docs page

**Date:** 2026-09-29
**Status:** Approved design

## Goal

Surface the PDFs Gautam shares on Instagram on garoono.in so visitors can view and download them. The home page gets a scrolling marquee of the latest docs; a new `/docs` page lists every doc as a card with view, download and like counts, ranked by a blend of recency and engagement.

Copy must never say "free" — docs will move behind a paywall later. The paywall itself is out of scope.

## Constraints

- Site is a Next.js 15 static export (`output: 'export'`) on GitHub Pages; push to `main` deploys. No server code.
- Shared counters live in Firestore on Firebase project `baseproject-25dbe`, which other apps also use.
- Visitors don't log in.

## Architecture

### `src/data/docs.ts` — the doc list (source of truth)

```ts
interface SharedDoc {
  slug: string;     // stable counter key, ^[a-z0-9-]{3,60}$ — never change once live
  title: string;
  blurb: string;    // one line
  driveId: string;  // Google Drive file id (file must be "anyone with the link")
  addedOn: string;  // ISO date, e.g. "2026-09-29"
}
```

Helpers derived from `driveId`:
- `viewUrl` → `https://drive.google.com/file/d/{id}/view`
- `downloadUrl` → `https://drive.google.com/uc?export=download&id={id}`
- `thumbUrl` → `https://drive.google.com/thumbnail?id={id}&sz=w600`

Initial docs, newest first (dates descend one day each from 2026-09-29):

| slug | title | driveId |
|---|---|---|
| 0-10k-users-template | 0 → 10K Users Template | 1tEFt0mou9J2cdTuOpaE0gzswRhOD7g-R |
| build-paid-apps-on-free-ai-models | Build Paid Apps on Free AI Models | 1cE2ASVqs39LZYVw-DzUN11Rt0f65wbj0 |
| 20-security-checks-before-launch | 20 Security Checks Before Launch | 18_z9S-_8w9zM_e9TjDaj0KAXei2bPQNx |
| six-documents-before-you-prompt | Six Documents Before You Prompt | 1vhQoMQcE3e6ZIOQFXh2uIxFosC8YJDdu |
| app-seo-playbook | App SEO Playbook | 14jH2SenoxtM7aJzTBmGZxIC4VEsYNjzm |
| legal-checklist-before-you-submit | Before You Submit: Legal Checklist | 1LG6h_kcYRMKfHjE_92_Ra-2Km6xlBqQA |
| app-store-launch-guide | Don't Get Rejected: App Store Launch Guide | 1ld5N1IWFYxdPeezwtxb3CLPZON9THdfN |

Adding a doc = one new entry in this file + push.

### `src/lib/firebase.ts` — web config

Hard-coded public web config for the "garoono.in site" web app (`1:1018097794451:web:f16edaa960e153a3087c66`) on `baseproject-25dbe`. Firebase web keys are public by design; access is governed by the rules below.

### `src/lib/docStats.ts` — the only module that touches Firestore

Lazily imports `firebase/app` + `firebase/firestore/lite` on first call, so the home page's initial bundle doesn't grow.

```ts
type DocStats = { views: number; downloads: number; likes: number };

fetchAllStats(): Promise<Record<string, DocStats>>  // one read of the docStats collection
recordView(slug): void        // +1 once per browser, fire-and-forget
recordDownload(slug): void    // +1 once per browser, fire-and-forget
isLiked(slug): boolean        // from localStorage
toggleLike(slug): Promise<boolean>  // ±1, returns new liked state
```

Writes use `setDoc(ref, { [field]: increment(n) }, { merge: true })` so the document is created on its first increment. Per-browser dedupe lives in localStorage under `garoono.docs.{views|downloads|likes}` as slug arrays; all reads/writes wrapped in try/catch.

### Firestore — `docStats/{slug}` = `{ views, downloads, likes }`

Rules (already deployed and tested, tracked in `firestore.rules`): public read; create/update only when exactly one counter changes by +1 (likes may also −1, never below 0), only those three fields exist, and the slug matches `^[a-z0-9-]{3,60}$`. The pre-existing `users/{userId}` rule is preserved.

## UI

### Home marquee (`src/components/DocsMarquee.tsx`)

- One row at the top of `<main>`, above the product grid.
- Up to 10 latest docs by `addedOn` desc. Each chip: 24px Drive thumbnail + title; accent "NEW" dot if added ≤ 7 days ago.
- Track duplicated for a seamless CSS loop; pauses on hover/touch; edges fade via mask. `prefers-reduced-motion` → static, horizontally scrollable row.
- Chip click → opens `viewUrl` in a new tab and calls `recordView`.
- Pinned (non-scrolling) accent chip on the right: "View all docs →" linking to `/docs`.
- No Firestore reads on the home page.

### `/docs` page (`src/app/docs/page.tsx` + client component)

- Header: "← Gautam" back link, title "Docs", subtitle "Playbooks & checklists I share on Instagram". Page metadata title/description set; no "free" anywhere.
- Sort tabs: **Top** (default) · Latest · Most liked · Most downloaded.
- Responsive card grid, same visual language as `.product-card`:
  - Drive thumbnail cover (4:3, top-cropped), fallback tile with a doc icon on error.
  - Title, blurb, formatted date.
  - Stats row: 👁 views · ⬇ downloads · ♡ like button with count (optimistic toggle, filled when liked).
  - Buttons: **View** (`viewUrl`, `recordView`) and **Download** (`downloadUrl`, `recordDownload`).
- Counts show "–" until loaded; Top sorts by Latest until stats arrive, then re-sorts with framer-motion `layout` animation.

## Ranking (`src/lib/rankDocs.ts`, pure)

- **Latest:** `addedOn` desc.
- **Top:** `score = (1 + 3·likes + 2·downloads + 0.5·views) / (ageDays + 2)^0.8`, desc; ties broken by `addedOn` desc.
- **Most liked / Most downloaded:** that count desc, ties by `addedOn` desc.

## Error handling

| Failure | Behaviour |
|---|---|
| Firestore unreachable / rules reject | Counts stay "–"; View/Download still open Drive; like button reverts |
| Drive thumbnail fails | Fallback tile |
| localStorage throws | Treated as "not yet counted" (may double-count; acceptable) |

## Verification

- `npm run lint` and `npm run build` pass; `/docs` exports as static HTML.
- Playwright screenshots of the marquee and `/docs` at desktop (1440px) and phone (390px) widths.
- One live view, download and like on a doc confirmed in Firestore, then those test counts removed with admin access.

## Out of scope

Paywall / locked docs, per-doc detail pages, login, admin UI.
