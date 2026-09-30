# Instagram Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a home-page marquee of the latest Instagram docs and a `/docs` page with view/download/like counts ranked by recency + engagement.

**Architecture:** Docs are a typed list in `src/data/docs.ts` baked into the static export. Shared counters live in Firestore `docStats/{slug}` on `baseproject-25dbe`, accessed only through `src/lib/docStats.ts`, which lazy-loads `firebase/firestore/lite`. Ranking is a pure function in `src/lib/rankDocs.ts`.

**Tech Stack:** Next.js 15 static export, React 18, framer-motion 11, Firebase JS SDK 12 (`firestore/lite`), Vitest 3 for unit tests.

Spec: `docs/superpowers/specs/2026-09-29-instagram-docs-design.md`

## Global Constraints

- Copy never says "free" (docs go behind a paywall later).
- Page title on `/docs` is "Docs"; subtitle "Playbooks & checklists I share on Instagram".
- Slugs match `^[a-z0-9-]{3,60}$` (enforced by deployed Firestore rules).
- Firestore writes: exactly one counter per write, +1 (likes also −1, never below 0), fields only `views`, `downloads`, `likes`.
- Home page makes no Firestore reads.
- Static export (`output: 'export'`, `trailingSlash: true`) must keep building; no server code.
- Firestore rules are already deployed — do not redeploy unless rules change.

---

### Task 1: Doc list + helpers (with Vitest setup)

**Files:**
- Modify: `package.json` (add `test` script, `vitest` devDependency)
- Create: `src/data/docs.ts`
- Test: `src/data/docs.test.ts`

**Interfaces:**
- Produces:
  - `interface SharedDoc { slug: string; title: string; blurb: string; driveId: string; addedOn: string }`
  - `docs: SharedDoc[]`
  - `viewUrl(d: SharedDoc): string`, `downloadUrl(d: SharedDoc): string`, `thumbUrl(d: SharedDoc, width?: number): string`
  - `latestDocs(list: SharedDoc[], limit?: number): SharedDoc[]`
  - `ageInDays(d: SharedDoc, now?: number): number`, `isNew(d: SharedDoc, now?: number): boolean`

- [ ] **Step 1: Install Vitest and add the script**

Run: `npm install -D vitest@^3`
Then in `package.json` `"scripts"` add: `"test": "vitest run"`

- [ ] **Step 2: Write the failing test** — `src/data/docs.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { docs, downloadUrl, isNew, latestDocs, thumbUrl, viewUrl, type SharedDoc } from "./docs";

const make = (slug: string, addedOn: string): SharedDoc => ({
  slug,
  title: slug,
  blurb: "",
  driveId: `id-${slug}`,
  addedOn,
});

describe("docs list", () => {
  it("has unique slugs the Firestore rules accept", () => {
    const slugs = docs.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]{3,60}$/);
  });

  it("has parseable dates", () => {
    for (const d of docs) expect(Number.isNaN(Date.parse(d.addedOn))).toBe(false);
  });
});

describe("drive urls", () => {
  const d = make("abc", "2026-09-29");
  it("builds view, download and thumbnail links", () => {
    expect(viewUrl(d)).toBe("https://drive.google.com/file/d/id-abc/view");
    expect(downloadUrl(d)).toBe("https://drive.google.com/uc?export=download&id=id-abc");
    expect(thumbUrl(d)).toBe("https://drive.google.com/thumbnail?id=id-abc&sz=w600");
    expect(thumbUrl(d, 64)).toBe("https://drive.google.com/thumbnail?id=id-abc&sz=w64");
  });
});

describe("latestDocs", () => {
  const list = [make("aaa", "2026-09-01"), make("ccc", "2026-09-20"), make("bbb", "2026-09-10")];
  it("sorts newest first without mutating the input", () => {
    expect(latestDocs(list).map((d) => d.slug)).toEqual(["ccc", "bbb", "aaa"]);
    expect(list.map((d) => d.slug)).toEqual(["aaa", "ccc", "bbb"]);
  });
  it("limits the result", () => {
    expect(latestDocs(list, 2).map((d) => d.slug)).toEqual(["ccc", "bbb"]);
  });
});

describe("isNew", () => {
  const now = Date.parse("2026-09-29T12:00:00Z");
  it("is true within 7 days and false after", () => {
    expect(isNew(make("aaa", "2026-09-23"), now)).toBe(true);
    expect(isNew(make("bbb", "2026-09-20"), now)).toBe(false);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./docs"`

- [ ] **Step 4: Implement** — `src/data/docs.ts`

```ts
// Docs shared on Instagram. Newest entries go first; `slug` keys the Firestore
// counters, so never change it once a doc is live.

export interface SharedDoc {
  slug: string; // ^[a-z0-9-]{3,60}$
  title: string;
  blurb: string;
  driveId: string; // Drive file shared as "anyone with the link"
  addedOn: string; // ISO date
}

export const docs: SharedDoc[] = [
  {
    slug: "0-10k-users-template",
    title: "0 → 10K Users Template",
    blurb: "The template I follow to take an app from zero to its first 10K users.",
    driveId: "1tEFt0mou9J2cdTuOpaE0gzswRhOD7g-R",
    addedOn: "2026-09-29",
  },
  {
    slug: "build-paid-apps-on-free-ai-models",
    title: "Build Paid Apps on Free AI Models",
    blurb: "How to ship AI features people pay for on top of free models.",
    driveId: "1cE2ASVqs39LZYVw-DzUN11Rt0f65wbj0",
    addedOn: "2026-09-28",
  },
  {
    slug: "20-security-checks-before-launch",
    title: "20 Security Checks Before Launch",
    blurb: "Twenty checks to run before your app goes live.",
    driveId: "18_z9S-_8w9zM_e9TjDaj0KAXei2bPQNx",
    addedOn: "2026-09-27",
  },
  {
    slug: "six-documents-before-you-prompt",
    title: "Six Documents Before You Prompt",
    blurb: "The six docs to write before asking AI to build your app.",
    driveId: "1vhQoMQcE3e6ZIOQFXh2uIxFosC8YJDdu",
    addedOn: "2026-09-26",
  },
  {
    slug: "app-seo-playbook",
    title: "App SEO Playbook",
    blurb: "Rank your app higher in App Store and Play Store search.",
    driveId: "14jH2SenoxtM7aJzTBmGZxIC4VEsYNjzm",
    addedOn: "2026-09-25",
  },
  {
    slug: "legal-checklist-before-you-submit",
    title: "Before You Submit: Legal Checklist",
    blurb: "Privacy policy, terms and the legal must-haves before you hit submit.",
    driveId: "1LG6h_kcYRMKfHjE_92_Ra-2Km6xlBqQA",
    addedOn: "2026-09-24",
  },
  {
    slug: "app-store-launch-guide",
    title: "Don't Get Rejected: App Store Launch Guide",
    blurb: "Dodge the common App Store rejections and launch first try.",
    driveId: "1ld5N1IWFYxdPeezwtxb3CLPZON9THdfN",
    addedOn: "2026-09-23",
  },
];

export const viewUrl = (d: SharedDoc) => `https://drive.google.com/file/d/${d.driveId}/view`;
export const downloadUrl = (d: SharedDoc) => `https://drive.google.com/uc?export=download&id=${d.driveId}`;
export const thumbUrl = (d: SharedDoc, width = 600) =>
  `https://drive.google.com/thumbnail?id=${d.driveId}&sz=w${width}`;

export function latestDocs(list: SharedDoc[], limit = list.length) {
  return [...list].sort((a, b) => b.addedOn.localeCompare(a.addedOn)).slice(0, limit);
}

const DAY_MS = 86_400_000;

export function ageInDays(d: SharedDoc, now = Date.now()) {
  return Math.max(0, (now - Date.parse(d.addedOn)) / DAY_MS);
}

export const isNew = (d: SharedDoc, now = Date.now()) => ageInDays(d, now) <= 7;
```

- [ ] **Step 5: Run tests** — `npm test` → Expected: PASS (6 tests)

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/data/docs.ts src/data/docs.test.ts
git commit -m "feat: add Instagram docs list and Drive link helpers"
```

---

### Task 2: Ranking

**Files:**
- Create: `src/lib/rankDocs.ts`
- Test: `src/lib/rankDocs.test.ts`

**Interfaces:**
- Consumes: `SharedDoc`, `ageInDays` from `src/data/docs.ts`
- Produces:
  - `type DocStats = { views: number; downloads: number; likes: number }`
  - `EMPTY_STATS: DocStats`
  - `type SortKey = "top" | "latest" | "liked" | "downloaded"`
  - `topScore(stats: DocStats, ageDays: number): number`
  - `rankDocs(list: SharedDoc[], stats: Record<string, DocStats> | null, sort: SortKey, now?: number): SharedDoc[]`

- [ ] **Step 1: Write the failing test** — `src/lib/rankDocs.test.ts`

```ts
import { describe, expect, it } from "vitest";
import type { SharedDoc } from "../data/docs";
import { rankDocs, type DocStats } from "./rankDocs";

const make = (slug: string, addedOn: string): SharedDoc => ({ slug, title: slug, blurb: "", driveId: slug, addedOn });
const stat = (s: Partial<DocStats>): DocStats => ({ views: 0, downloads: 0, likes: 0, ...s });

const now = Date.parse("2026-09-29T00:00:00Z");
const oldDoc = make("old-doc", "2026-08-30"); // 30 days
const midDoc = make("mid-doc", "2026-09-19"); // 10 days
const newDoc = make("new-doc", "2026-09-29"); // 0 days
const list = [oldDoc, newDoc, midDoc];
const slugs = (docs: SharedDoc[]) => docs.map((d) => d.slug);

describe("rankDocs", () => {
  it("latest: newest first", () => {
    expect(slugs(rankDocs(list, {}, "latest", now))).toEqual(["new-doc", "mid-doc", "old-doc"]);
  });

  it("falls back to latest while stats are loading", () => {
    expect(slugs(rankDocs(list, null, "top", now))).toEqual(["new-doc", "mid-doc", "old-doc"]);
  });

  it("top: with no engagement, newer ranks higher", () => {
    expect(slugs(rankDocs(list, {}, "top", now))).toEqual(["new-doc", "mid-doc", "old-doc"]);
  });

  it("top: strong engagement lifts an older doc above an untouched new one", () => {
    const stats = { "old-doc": stat({ likes: 10, downloads: 5, views: 20 }) };
    expect(rankDocs(list, stats, "top", now)[0].slug).toBe("old-doc");
  });

  it("top: a new doc with a little engagement beats an old one with slightly more", () => {
    const stats = { "new-doc": stat({ likes: 2 }), "old-doc": stat({ likes: 3 }) };
    expect(rankDocs(list, stats, "top", now)[0].slug).toBe("new-doc");
  });

  it("liked: by likes, ties broken by date", () => {
    const stats = { "old-doc": stat({ likes: 5 }), "mid-doc": stat({ likes: 5 }) };
    expect(slugs(rankDocs(list, stats, "liked", now))).toEqual(["mid-doc", "old-doc", "new-doc"]);
  });

  it("downloaded: by downloads", () => {
    const stats = { "old-doc": stat({ downloads: 9 }), "new-doc": stat({ downloads: 1 }) };
    expect(slugs(rankDocs(list, stats, "downloaded", now))).toEqual(["old-doc", "new-doc", "mid-doc"]);
  });

  it("does not mutate the input", () => {
    rankDocs(list, {}, "latest", now);
    expect(slugs(list)).toEqual(["old-doc", "new-doc", "mid-doc"]);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm test` → FAIL, `Failed to resolve import "./rankDocs"`

- [ ] **Step 3: Implement** — `src/lib/rankDocs.ts`

```ts
import { ageInDays, type SharedDoc } from "../data/docs";

export type DocStats = { views: number; downloads: number; likes: number };
export type SortKey = "top" | "latest" | "liked" | "downloaded";

export const EMPTY_STATS: DocStats = { views: 0, downloads: 0, likes: 0 };

// Engagement decays with age so fresh docs surface, but a doc people keep
// liking and downloading holds its place.
export function topScore(stats: DocStats, ageDays: number) {
  return (1 + 3 * stats.likes + 2 * stats.downloads + 0.5 * stats.views) / Math.pow(ageDays + 2, 0.8);
}

export function rankDocs(
  list: SharedDoc[],
  stats: Record<string, DocStats> | null,
  sort: SortKey,
  now = Date.now(),
): SharedDoc[] {
  const byDate = (a: SharedDoc, b: SharedDoc) => b.addedOn.localeCompare(a.addedOn);
  if (sort === "latest" || !stats) return [...list].sort(byDate);

  const s = (d: SharedDoc) => stats[d.slug] ?? EMPTY_STATS;
  const metric =
    sort === "top"
      ? (d: SharedDoc) => topScore(s(d), ageInDays(d, now))
      : sort === "liked"
        ? (d: SharedDoc) => s(d).likes
        : (d: SharedDoc) => s(d).downloads;

  return [...list].sort((a, b) => metric(b) - metric(a) || byDate(a, b));
}
```

- [ ] **Step 4: Run tests** — `npm test` → PASS (14 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/rankDocs.ts src/lib/rankDocs.test.ts
git commit -m "feat: rank docs by recency and engagement"
```

---

### Task 3: Firestore counters module

**Files:**
- Modify: `package.json` (add `firebase` dependency)
- Create: `src/lib/firebase.ts`, `src/lib/docStats.ts`

**Interfaces:**
- Consumes: `DocStats`, `EMPTY_STATS` from `src/lib/rankDocs.ts`
- Produces:
  - `fetchAllStats(): Promise<Record<string, DocStats>>`
  - `recordView(slug: string): boolean` — true if this call counted (first time in this browser)
  - `recordDownload(slug: string): boolean` — same
  - `isLiked(slug: string): boolean`
  - `toggleLike(slug: string): Promise<boolean>` — resolves to the new liked state; rejects if a like failed to save

- [ ] **Step 1: Install** — `npm install firebase@^12`

- [ ] **Step 2: Create** `src/lib/firebase.ts`

```ts
// Public web config for the "garoono.in site" app on baseproject-25dbe.
// Web API keys are not secrets — access is governed by firestore.rules.
export const firebaseConfig = {
  apiKey: "<FIREBASE_WEB_API_KEY>",
  authDomain: "baseproject-25dbe.firebaseapp.com",
  projectId: "baseproject-25dbe",
  storageBucket: "baseproject-25dbe.firebasestorage.app",
  messagingSenderId: "1018097794451",
  appId: "1:1018097794451:web:f16edaa960e153a3087c66",
};
```

- [ ] **Step 3: Create** `src/lib/docStats.ts`

```ts
import type { Firestore } from "firebase/firestore/lite";
import { firebaseConfig } from "./firebase";
import { EMPTY_STATS, type DocStats } from "./rankDocs";

// The only module that talks to Firestore. The SDK is imported on first use so
// pages that never count anything don't download it.

type Counter = keyof DocStats;

const COLLECTION = "docStats";

let dbPromise: Promise<Firestore> | null = null;

function getDb() {
  dbPromise ??= (async () => {
    const [{ getApps, initializeApp }, { getFirestore }] = await Promise.all([
      import("firebase/app"),
      import("firebase/firestore/lite"),
    ]);
    return getFirestore(getApps()[0] ?? initializeApp(firebaseConfig));
  })();
  return dbPromise;
}

// Per-browser memory of what this visitor already counted (slug lists in localStorage)
function readSet(counter: Counter): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(`garoono.docs.${counter}`) ?? "[]"));
  } catch {
    return new Set();
  }
}

function writeSet(counter: Counter, set: Set<string>) {
  try {
    localStorage.setItem(`garoono.docs.${counter}`, JSON.stringify([...set]));
  } catch {
    // Storage blocked — this visitor may be counted again, which is acceptable
  }
}

async function bump(slug: string, counter: Counter, by: 1 | -1) {
  const db = await getDb();
  const { doc, increment, setDoc } = await import("firebase/firestore/lite");
  await setDoc(doc(db, COLLECTION, slug), { [counter]: increment(by) }, { merge: true });
}

function countOnce(slug: string, counter: "views" | "downloads") {
  const seen = readSet(counter);
  if (seen.has(slug)) return false;
  seen.add(slug);
  writeSet(counter, seen);
  bump(slug, counter, 1).catch(() => {
    // Forget it so a later click can retry
    const retry = readSet(counter);
    retry.delete(slug);
    writeSet(counter, retry);
  });
  return true;
}

export const recordView = (slug: string) => countOnce(slug, "views");
export const recordDownload = (slug: string) => countOnce(slug, "downloads");
export const isLiked = (slug: string) => readSet("likes").has(slug);

export async function toggleLike(slug: string): Promise<boolean> {
  const liked = readSet("likes");
  const next = !liked.has(slug);
  try {
    await bump(slug, "likes", next ? 1 : -1);
  } catch (e) {
    // An unlike the server refuses (count already 0) shouldn't leave the button stuck on
    if (next) throw e;
  }
  if (next) liked.add(slug);
  else liked.delete(slug);
  writeSet("likes", liked);
  return next;
}

export async function fetchAllStats(): Promise<Record<string, DocStats>> {
  const db = await getDb();
  const { collection, getDocs } = await import("firebase/firestore/lite");
  const snap = await getDocs(collection(db, COLLECTION));
  const out: Record<string, DocStats> = {};
  snap.forEach((d) => {
    const data = d.data();
    out[d.id] = {
      views: data.views ?? EMPTY_STATS.views,
      downloads: data.downloads ?? EMPTY_STATS.downloads,
      likes: data.likes ?? EMPTY_STATS.likes,
    };
  });
  return out;
}
```

- [ ] **Step 4: Verify** — `npm run lint && npm test && npm run build` → all pass (module isn't imported by a page yet; build confirms it type-checks)

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/lib/firebase.ts src/lib/docStats.ts
git commit -m "feat: Firestore view/download/like counters for docs"
```

---

### Task 4: Home marquee

**Files:**
- Create: `src/components/DocsMarquee.tsx`
- Modify: `src/app/page.tsx` (import + render above `.product-grid` in `<main className="content">`)
- Modify: `src/app/globals.css` (append marquee styles)

**Interfaces:**
- Consumes: `docs`, `latestDocs`, `isNew`, `thumbUrl`, `viewUrl` (Task 1); `recordView` (Task 3)
- Produces: default export `DocsMarquee()` component

- [ ] **Step 1: Create** `src/components/DocsMarquee.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { docs, isNew, latestDocs, thumbUrl, viewUrl } from "../data/docs";
import { recordView } from "../lib/docStats";

const items = latestDocs(docs, 10);

export default function DocsMarquee() {
  // "NEW" depends on today's date, so decide it after hydration
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  return (
    <div className="docs-marquee">
      <div className="docs-marquee-viewport">
        {/* Two copies of the chips so the -50% loop is seamless */}
        <div className="docs-marquee-track">
          {[0, 1].map((copy) =>
            items.map((d) => (
              <a
                key={`${copy}-${d.slug}`}
                href={viewUrl(d)}
                target="_blank"
                rel="noopener noreferrer"
                className="doc-chip"
                aria-hidden={copy === 1 || undefined}
                tabIndex={copy === 1 ? -1 : undefined}
                onClick={() => recordView(d.slug)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumbUrl(d, 64)} alt="" width={20} height={20} className="doc-chip-thumb" loading="lazy" />
                <span>{d.title}</span>
                {now !== null && isNew(d, now) && <span className="doc-chip-new" aria-label="New" />}
              </a>
            )),
          )}
        </div>
      </div>
      <Link href="/docs/" className="doc-chip doc-chip-all">
        View all docs →
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Render it in** `src/app/page.tsx`

Add import after `import Image from "next/image";`:

```tsx
import DocsMarquee from "../components/DocsMarquee";
```

Replace:

```tsx
      <main className="content">
        <div className="product-grid">
```

with:

```tsx
      <main className="content">
        <DocsMarquee />
        <div className="product-grid">
```

- [ ] **Step 3: Append styles to** `src/app/globals.css`

```css
/* ─── Docs Marquee ───────────────────────────────────────────────── */
.docs-marquee {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.docs-marquee-viewport {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 24px, #000 calc(100% - 24px), transparent);
  mask-image: linear-gradient(to right, transparent, #000 24px, #000 calc(100% - 24px), transparent);
}

.docs-marquee-track {
  display: flex;
  width: max-content;
  animation: docs-marquee 40s linear infinite;
}

.docs-marquee-viewport:hover .docs-marquee-track,
.docs-marquee-viewport:active .docs-marquee-track,
.docs-marquee-viewport:focus-within .docs-marquee-track {
  animation-play-state: paused;
}

/* margin (not gap) keeps both copies the same width, so -50% lands exactly */
.docs-marquee-track > .doc-chip { margin-right: 8px; }

@keyframes docs-marquee {
  to { transform: translateX(-50%); }
}

.doc-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 5px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--bg-card);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.doc-chip:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-card-hover);
}

.doc-chip-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
  border: 1px solid var(--border);
  background: var(--accent-light);
}

.doc-chip-new {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

.doc-chip-all {
  flex-shrink: 0;
  padding: 5px 14px;
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.doc-chip-all:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

@media (prefers-reduced-motion: reduce) {
  .docs-marquee-track { animation: none; }
  .docs-marquee-viewport { overflow-x: auto; }
  .docs-marquee-track > [aria-hidden="true"] { display: none; }
}
```

- [ ] **Step 4: Verify** — `npm run lint && npm run build` pass; `npx next dev -p 3107` then `npx -y playwright@1.55.0 screenshot --channel chrome --viewport-size=1440,700 --wait-for-timeout=3000 http://localhost:3107/ <scratchpad>/marquee.png` and at `--viewport-size=390,844`. Expected: chip row above the cards, orange "View all docs →" pinned right, faded edges, no horizontal page scroll on mobile.

- [ ] **Step 5: Commit**

```bash
git add src/components/DocsMarquee.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: marquee of latest docs on the home page"
```

---

### Task 5: `/docs` page

**Files:**
- Create: `src/app/docs/page.tsx`, `src/components/DocsLibrary.tsx`, `src/components/DocCard.tsx`
- Modify: `src/app/globals.css` (append docs page styles)

**Interfaces:**
- Consumes: `docs`, `SharedDoc`, `viewUrl`, `downloadUrl`, `thumbUrl` (Task 1); `rankDocs`, `SortKey`, `DocStats`, `EMPTY_STATS` (Task 2); `fetchAllStats`, `recordView`, `recordDownload`, `isLiked`, `toggleLike` (Task 3)
- Produces: route `/docs/`; `DocCard` props `{ doc: SharedDoc; index: number; stats: DocStats | null; onCount: (slug: string, counter: keyof DocStats, by: number) => void }`

- [ ] **Step 1: Create** `src/components/DocCard.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { downloadUrl, thumbUrl, viewUrl, type SharedDoc } from "../data/docs";
import { isLiked, recordDownload, recordView, toggleLike } from "../lib/docStats";
import type { DocStats } from "../lib/rankDocs";

type Props = {
  doc: SharedDoc;
  index: number;
  stats: DocStats | null; // null while loading or if Firestore is unreachable
  onCount: (slug: string, counter: keyof DocStats, by: number) => void;
};

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function DocCard({ doc, index, stats, onCount }: Props) {
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  useEffect(() => setLiked(isLiked(doc.slug)), [doc.slug]);

  const count = (n: number | undefined) => (stats ? (n ?? 0).toLocaleString("en-US") : "–");

  const onView = () => {
    if (recordView(doc.slug)) onCount(doc.slug, "views", 1);
  };

  const onDownload = () => {
    if (recordDownload(doc.slug)) onCount(doc.slug, "downloads", 1);
  };

  const onLike = async () => {
    if (pending) return;
    const next = !liked;
    setPending(true);
    setLiked(next);
    onCount(doc.slug, "likes", next ? 1 : -1);
    try {
      await toggleLike(doc.slug);
    } catch {
      setLiked(!next);
      onCount(doc.slug, "likes", next ? -1 : 1);
    } finally {
      setPending(false);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05, layout: { duration: 0.35, ease: "easeOut" } }}
      className="doc-card"
    >
      <a href={viewUrl(doc)} target="_blank" rel="noopener noreferrer" onClick={onView} className="doc-cover" aria-label={`Open ${doc.title}`}>
        {thumbFailed ? (
          <div className="doc-cover-fallback">
            <DocIcon />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbUrl(doc)} alt="" loading="lazy" onError={() => setThumbFailed(true)} />
        )}
      </a>

      <div className="doc-body">
        <h2 className="doc-title">{doc.title}</h2>
        <p className="doc-blurb">{doc.blurb}</p>
        <p className="doc-date font-mono">{formatDate(doc.addedOn)}</p>

        <div className="doc-stats">
          <span title="Views">
            <EyeIcon /> {count(stats?.views)}
          </span>
          <span title="Downloads">
            <DownloadIcon /> {count(stats?.downloads)}
          </span>
          <button
            type="button"
            className={`doc-like ${liked ? "is-liked" : ""}`}
            onClick={onLike}
            disabled={pending}
            aria-pressed={liked}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <HeartIcon filled={liked} /> {count(stats?.likes)}
          </button>
        </div>

        <div className="doc-actions">
          <a href={viewUrl(doc)} target="_blank" rel="noopener noreferrer" onClick={onView} className="doc-btn">
            View
          </a>
          <a href={downloadUrl(doc)} target="_blank" rel="noopener noreferrer" onClick={onDownload} className="doc-btn doc-btn-primary">
            Download
          </a>
        </div>
      </div>
    </motion.article>
  );
}
```

- [ ] **Step 2: Create** `src/components/DocsLibrary.tsx`

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { docs } from "../data/docs";
import { fetchAllStats } from "../lib/docStats";
import { EMPTY_STATS, rankDocs, type DocStats, type SortKey } from "../lib/rankDocs";
import DocCard from "./DocCard";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "latest", label: "Latest" },
  { key: "liked", label: "Most liked" },
  { key: "downloaded", label: "Most downloaded" },
];

type StatsMap = Record<string, DocStats>;

export default function DocsLibrary() {
  const [sort, setSort] = useState<SortKey>("top");
  // `ranking` is the snapshot we sort by; `live` also reflects this visitor's
  // clicks, so a card doesn't jump away from under the cursor when liked.
  const [ranking, setRanking] = useState<StatsMap | null>(null);
  const [live, setLive] = useState<StatsMap | null>(null);

  useEffect(() => {
    fetchAllStats()
      .then((stats) => {
        setRanking(stats);
        setLive(stats);
      })
      .catch((e) => console.error("Doc stats unavailable", e));
  }, []);

  const ranked = useMemo(() => rankDocs(docs, ranking, sort), [ranking, sort]);

  const onCount = (slug: string, counter: keyof DocStats, by: number) =>
    setLive((prev) => {
      if (!prev) return prev;
      const cur = prev[slug] ?? EMPTY_STATS;
      return { ...prev, [slug]: { ...cur, [counter]: Math.max(0, cur[counter] + by) } };
    });

  return (
    <div className="docs-page">
      <Link href="/" className="docs-back">
        ← Gautam
      </Link>

      <header>
        <h1 className="font-serif docs-title">Docs</h1>
        <p className="docs-subtitle">Playbooks &amp; checklists I share on Instagram</p>
      </header>

      <div className="docs-tabs" role="tablist" aria-label="Sort docs">
        {SORTS.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={sort === s.key}
            className={`docs-tab ${sort === s.key ? "is-active" : ""}`}
            onClick={() => setSort(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="docs-grid">
        {ranked.map((d, i) => (
          <DocCard key={d.slug} doc={d} index={i} stats={live ? (live[d.slug] ?? EMPTY_STATS) : null} onCount={onCount} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create** `src/app/docs/page.tsx`

```tsx
import type { Metadata } from "next";
import DocsLibrary from "../../components/DocsLibrary";

export const metadata: Metadata = {
  title: "Docs — Gautam | Playbooks & checklists for indie app makers",
  description:
    "Playbooks & checklists I share on Instagram — app launch guides, app store SEO, security and legal checklists for indie app makers.",
  alternates: { canonical: "/docs/" },
};

export default function DocsPage() {
  return <DocsLibrary />;
}
```

- [ ] **Step 4: Append styles to** `src/app/globals.css`

```css
/* ─── Docs Page ──────────────────────────────────────────────────── */
.docs-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.docs-back {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.docs-back:hover { color: var(--text-primary); }

.docs-title {
  font-size: 40px;
  font-weight: 400;
  line-height: 1.1;
  margin-top: 20px;
}

.docs-subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.docs-tabs {
  display: flex;
  gap: 6px;
  margin: 24px 0 20px;
  overflow-x: auto;
}

.docs-tab {
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--bg-card);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.docs-tab:hover { border-color: var(--border-hover); }

.docs-tab.is-active {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: #fff;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.doc-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.doc-cover {
  display: block;
  aspect-ratio: 4 / 3;
  background: var(--accent-light);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}

.doc-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.3s ease;
}

.doc-card:hover .doc-cover img { transform: scale(1.03); }

.doc-cover-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.doc-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
}

.doc-title {
  font-size: 16px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.doc-blurb {
  font-size: 13px;
  line-height: 1.4;
  color: var(--text-tertiary);
}

.doc-date {
  font-size: 11px;
  color: var(--text-tertiary);
}

.doc-stats {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: auto;
  padding-top: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text-secondary);
}

.doc-stats > span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.doc-like {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--bg-card);
  font: inherit;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.doc-like:hover { border-color: var(--border-hover); }
.doc-like:disabled { cursor: progress; }

.doc-like.is-liked {
  color: #E11D48;
  border-color: #FECDD3;
  background: #FFF1F2;
}

.doc-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}

.doc-btn {
  padding: 8px 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
}

.doc-btn:hover {
  border-color: var(--border-hover);
  background: var(--bg-card-hover);
}

.doc-btn-primary {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: #fff;
}

.doc-btn-primary:hover {
  background: #333;
  border-color: #333;
}

@media (max-width: 640px) {
  .docs-page { padding: 24px 16px 48px; }
  .docs-title { font-size: 32px; }
}
```

- [ ] **Step 5: Verify** — `npm run lint && npm test && npm run build`; build output lists `○ /docs`. Screenshot `http://localhost:3107/docs/` at 1440×1000 and 390×844 (Playwright, 3s wait). Expected: header, 4 tabs, 7 cards with Drive thumbnails, counts shown as numbers (0s) once Firestore loads.

- [ ] **Step 6: Commit**

```bash
git add src/app/docs/page.tsx src/components/DocsLibrary.tsx src/components/DocCard.tsx src/app/globals.css
git commit -m "feat: /docs page with view, download and like counts"
```

---

### Task 6: Live verification

- [ ] **Step 1:** With the dev server running, script a Playwright session (Chrome channel) on `/docs/` that clicks the like button on the first card and the View link, then reads `docStats` via REST: `curl "https://firestore.googleapis.com/v1/projects/baseproject-25dbe/databases/(default)/documents/docStats?key=<apiKey>"`. Expected: the doc has `likes: 1`, `views: 1`.
- [ ] **Step 2:** Clean up the test counts: `firebase firestore:delete docStats/<slug> --force --project baseproject-25dbe --account garoonotech@gmail.com`.
- [ ] **Step 3:** Final `npm run lint && npm test && npm run build`; push to `main` (deploys via GitHub Actions).
