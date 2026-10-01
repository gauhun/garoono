# App landing pages — replace Linktree links

**Date:** 2026-10-01 · **Status:** Approved

## Goal

Replace the 4 Linktree links (Dress Mirror, SnapPDF Pro, FocusOn, Shots) with pages on our own domain at `garoono.in/apps/<slug>/`. Each page explains the problem the app solves, the result, how it works and the benefits, with both store links, real screenshots and tasteful animation. Linktree pages also show other brands' ads, which this removes.

## Architecture

- One static route `src/app/apps/[slug]/page.tsx` (`generateStaticParams`, `dynamicParams = false`).
- Content in `src/data/appPages.ts`: `{ slug, productId, tagline, problem, result, steps[3], benefits[4-6], playUrl, appStoreUrl, screenshots[], accent, seoTitle, seoDescription }`.
- Assets in `public/apps/<slug>/` (icon + store screenshots, downloaded, never hotlinked).
- `products.ts`: the 4 apps' `link` becomes `/apps/<slug>/`; cards and rails open internal links in the same tab.

## Page sections

1. Hero: floating icon, name, one-line promise, real user count, Google Play + App Store buttons (visitor's platform first), phone frame cycling real screenshots over animated gradient shapes in the app's accent colour.
2. Before / after cards (problem → result).
3. How it works: 3 steps.
4. What you get: 4-6 benefit cards.
5. Screenshot strip (scrolling row).
6. Final CTA: store buttons + "scan to install" QR on desktop.
7. More apps by Gautam.

## Rules

- Copy follows the store-copy rules: no em/en dashes, no full stops at sentence ends, plain words, no AI filler, no other companies' app names. No invented ratings or reviews.
- Animations with framer-motion, disabled under `prefers-reduced-motion`.
- SEO: per-page metadata, `SoftwareApplication` JSON-LD without ratings, pages added to the sitemap.

## Verification

Unit test: every app page has both store URLs, a matching product, existing screenshot files, and copy without dashes or trailing full stops. Screenshots at desktop and phone widths. Dress Mirror first for review, then the other 3.
