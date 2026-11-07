# Graph Report - garoono  (2026-10-13)

## Corpus Check
- Corpus is ~42,713 words - fits in a single context window. You may not need a graph.

## Summary
- 519 nodes · 1023 edges · 27 communities (22 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.88)
- Token cost: 114,435 input · 9,000 output

## Community Hubs (Navigation)
- Docs Library UI
- Docs Paywall Backend
- App Landing Pages
- Blog Content and Brand
- Blog Rendering and RSS
- Firebase Auth and Doc Stats
- Homepage Portfolio
- Functions Dependencies
- Doc Upload Scripts
- Site TS Config
- Site Package Manifest
- Checkout and Launch Offer
- Root Layout and Legal Pages
- Functions TS Config
- Site Dev Dependencies
- Logo Color Tooling
- Pro Members Wall
- npm Scripts
- Swift PDF Renderer
- Site Runtime Dependencies
- ESLint Config
- Next Config (mjs)
- PostCSS Config
- Failed Payments Guide
- Tailwind Config
- AdSense ads.txt

## God Nodes (most connected - your core abstractions)
1. `DocsLibrary()` - 28 edges
2. `Docs paywall design (Google login + Rs 99 lifetime via Dodo)` - 19 edges
3. `DocCard()` - 18 edges
4. `compilerOptions` - 16 edges
5. `next` - 15 edges
6. `docs` - 15 edges
7. `dodoWebhook` - 13 edges
8. `scripts` - 12 edges
9. `react` - 12 edges
10. `Home()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Fix the store listing before posting (search drives ~65% of downloads)` --semantically_similar_to--> `Five parallel AI chats competitor research merged in a sixth`  [INFERRED] [semantically similar]
  content/blog/how-to-get-your-first-100-app-users.md → public/free-docs/steal-competitor-keywords.pdf
- `Quick Guide 08: Will your app get rejected? 30 minute audit` --shares_data_with--> `freePdfUrl()`  [INFERRED]
  public/free-docs/will-your-app-get-rejected-audit.pdf → src/data/docs.ts
- `Dodo API as source of truth, webhook only a signed trigger` --rationale_for--> `dodoWebhook`  [INFERRED]
  docs/superpowers/specs/2026-09-29-docs-paywall-design.md → functions/src/index.ts
- `Revocation on refund and dispute events` --references--> `revocationFor()`  [INFERRED]
  docs/superpowers/specs/2026-09-29-docs-paywall-design.md → functions/src/lib/payments.ts
- `Blog topic plan (keyword queue)` --references--> `docs`  [INFERRED]
  content/blog/_topics.md → src/data/docs.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Docs paywall purchase, claim and unlock flow** — docs_superpowers_specs_2026_09_29_docs_paywall_design_pay_first_claim_later, src_lib_checkout_checkouturl, functions_src_index_dodowebhook, functions_src_index_claimaccess, functions_src_index_getdoclink, src_lib_access_openpaiddoc [EXTRACTED 1.00]
- **Daily blog publishing pipeline** — docs_blog_routine_daily_blog_routine, content_blog__topics_blog_topic_plan, brand_garoono_brand_guide, docs_blog_routine_blog_quality_gates, _github_workflows_nextjs_github_pages_static_deploy [EXTRACTED 1.00]
- **Free Garoono Quick Guide PDFs served from /free-docs** — public_free_docs_failed_payments_win_back_guide, public_free_docs_steal_competitor_keywords_guide, public_free_docs_will_your_app_get_rejected_audit_guide, src_data_docs_freepdfurl [INFERRED 0.85]

## Communities (27 total, 5 thin omitted)

### Community 0 - "Docs Library UI"
Cohesion: 0.07
Nodes (62): Instagram Docs implementation plan, Instagram docs marquee + /docs page design, Top ranking score (likes, downloads, views decayed by age), DocsPage(), metadata, AuthChip(), PaymentBanner(), useInAppBrowser() (+54 more)

### Community 1 - "Docs Paywall Backend"
Cohesion: 0.09
Nodes (41): Docs Paywall implementation plan, Docs paywall design (Google login + Rs 99 lifetime via Dodo), Private paid-docs bucket with 10 minute V4 signed URLs, Revocation on refund and dispute events, Standard Webhooks HMAC-SHA256 verification, claim(), claimAccess, db (+33 more)

### Community 2 - "App Landing Pages"
Cohesion: 0.08
Nodes (32): App landing pages design (replace Linktree), SoftwareApplication JSON-LD without ratings, qrcode, qrcode, AppPageRoute(), dynamicParams, generateMetadata(), MovedPage() (+24 more)

### Community 3 - "Blog Content and Brand"
Cohesion: 0.06
Nodes (34): Deploy Next.js site to Pages workflow, GitHub Pages static export deploy (garoono.in CNAME), BRAND.md garoono.in brand guide, Gautam Singh Rathor (author, indie app maker), Audience: 9-to-5 builders shipping side apps, Blog topic plan (keyword queue), Android developer verification requirement (2026 four countries, 2027 global), Android Developer Verification for Indie Developers: 2026 Guide (+26 more)

### Community 4 - "Blog Rendering and RSS"
Cohesion: 0.10
Nodes (28): marked, BlogIndex(), formatDate(), metadata, dynamic, escape(), GET(), BlogPost() (+20 more)

### Community 5 - "Firebase Auth and Doc Stats"
Cohesion: 0.17
Nodes (23): Firestore docStats view/download/like counters, firebase, call(), claimAccess(), authModule(), isInAppBrowser(), signInWithGoogle(), signOutUser() (+15 more)

### Community 6 - "Homepage Portfolio"
Cohesion: 0.15
Nodes (22): CountUp(), ExperienceAndFooter(), EyeIcon(), fadeUp, GrowthChart(), growthPath(), Home(), InstagramIcon() (+14 more)

### Community 7 - "Functions Dependencies"
Cohesion: 0.10
Nodes (19): dependencies, firebase-admin, firebase-functions, @google-cloud/firestore, @google-cloud/storage, devDependencies, typescript, engines (+11 more)

### Community 8 - "Doc Upload Scripts"
Cohesion: 0.11
Nodes (13): How to upload a new document (README), sharp, args, free, [pdf, slug], sorted, tmp, bases (+5 more)

### Community 9 - "Site TS Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "Site Package Manifest"
Cohesion: 0.12
Nodes (16): homepage, typescript, name, private, version, eslint, eslint-config-next, @fontsource/press-start-2p (+8 more)

### Community 11 - "Checkout and Launch Offer"
Cohesion: 0.23
Nodes (12): react, vitest, UnlockBanner(), LaunchCountdown(), LaunchPrice(), useLaunchOffer(), DODO_MODE, LAUNCH_ENDS_AT (+4 more)

### Community 12 - "Root Layout and Legal Pages"
Cohesion: 0.19
Nodes (8): nextConfig, next, metadata, metadata, PrivacyPage(), metadata, TermsPage(), LegalPage()

### Community 13 - "Functions TS Config"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, module, moduleResolution, outDir, rootDir, skipLibCheck, sourceMap (+4 more)

### Community 14 - "Site Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, gh-pages, postcss, sharp, tailwindcss, @types/node (+5 more)

### Community 15 - "Logo Color Tooling"
Cohesion: 0.31
Nodes (8): contrast(), dominantColor(), hexToRgb(), hslToRgb(), inkFor(), luminance(), rgbToHsl(), toHex()

### Community 16 - "Pro Members Wall"
Cohesion: 0.27
Nodes (10): Avatar(), ProCountPill(), ProRail(), RAIL_SIZE, TINTS, useProWall(), fetchProSummary(), ProMember (+2 more)

### Community 17 - "npm Scripts"
Cohesion: 0.17
Nodes (12): scripts, add-doc, blog:lint, build, deploy, dev, lint, prebuild (+4 more)

### Community 18 - "Swift PDF Renderer"
Cohesion: 0.20
Nodes (4): AppKit, PDFKit, fail(), render()

### Community 19 - "Site Runtime Dependencies"
Cohesion: 0.22
Nodes (9): dependencies, firebase, @fontsource/press-start-2p, framer-motion, gray-matter, marked, next, react (+1 more)

### Community 20 - "ESLint Config"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

### Community 23 - "Failed Payments Guide"
Cohesion: 0.67
Nodes (3): Quick Guide 15: They didn't cancel, their card did (failed payments win-back), Involuntary churn recovery (grace period, account hold, billing retry), Store win-back offers for lapsed subscribers

## Knowledge Gaps
- **30 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `@google-cloud/firestore`, `@google-cloud/storage`, `typescript` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 203 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `Checkout and Launch Offer` to `Docs Library UI`, `Docs Paywall Backend`, `App Landing Pages`, `Blog Content and Brand`, `Blog Rendering and RSS`, `Site Package Manifest`, `Logo Color Tooling`, `Pro Members Wall`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `@google-cloud/firestore` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Docs Library UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06582278481012659 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Root Layout and Legal Pages` to `Docs Library UI`, `App Landing Pages`, `Blog Rendering and RSS`, `Homepage Portfolio`, `Site Package Manifest`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Should `Docs Paywall Backend` be split into smaller, more focused modules?**
  _Cohesion score 0.08862745098039215 - nodes in this community are weakly interconnected._
- **Why does `docs` connect `Docs Library UI` to `Doc Upload Scripts`, `Docs Paywall Backend`, `Blog Content and Brand`, `Blog Rendering and RSS`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Should `App Landing Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.08383838383838384 - nodes in this community are weakly interconnected._