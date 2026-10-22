# Garoono Docs launch kit

Last checked: 2026-10-22. Directory rules, prices and link types change without notice, so open each submit page once more on the day you post.

Facts used here come only from `BRAND.md` and the repo (`src/data/docs.ts`, `src/lib/checkout.ts`, `src/components/AccessPanel.tsx`, `public/free-docs/`). Nothing here is a review, testimonial or made up number.

Numbers to re-check before pasting (they change as docs get added):

- Docs in the library: **30** (count of entries in `src/data/docs.ts`)
- Free docs: **5** (`crack-dev-interviews`, `html-screenshots-not-figma`, `will-your-app-get-rejected-audit`, `steal-competitor-keywords`, `failed-payments-win-back`). They download with no sign-in
- Price: **₹99 once, lifetime** (`LAUNCH_PRICE_LABEL` and `REGULAR_PRICE_LABEL` in `src/lib/checkout.ts`). Paid docs need Sign in with Google and checkout runs on Dodo Payments
- Portfolio: **14 apps, 100,000+ users** (BRAND.md)

Character counts below are plain character counts, a line break counts as 1. Some forms count emoji or ₹ differently, so leave a few characters spare when a field is tight.

---

## 1. Positioning and core copy

### Positioning

Garoono Docs is a library of short playbooks and checklists for people who build apps next to a 9 to 5. It is written by Gautam Singh Rathor, a senior software engineer who has shipped 14 apps with 100,000+ users after work. It covers the parts that eat a solo builder's evenings: store review and rejections, app store SEO, pricing and paywalls, subscriptions, analytics, the first 100 users, security and legal checks. Five docs are free with no sign-in, and the rest open with a one-time ₹99 payment. The pitch is honest and specific: what worked for one person with limited time and money, not an enterprise playbook.

### Core copy blocks (reuse everywhere)

**Name** · 12 chars
```text
Garoono Docs
```

**One-liner** · 77 chars
```text
Playbooks and checklists from 14 shipped apps, for people building after work
```

**Tagline (60 max)** · 59 chars
```text
Playbooks from 14 shipped apps, for builders with a day job
```

**Tagline, shorter backup** · 45 chars
```text
Checklists for shipping apps next to a 9 to 5
```

**Short description (260 max)** · 235 chars
```text
30 playbooks and checklists for building apps next to a day job
Store review, app store SEO, pricing, subscriptions, first users, security and legal
Written from 14 shipped apps and 100,000+ users
5 docs are free, the rest are ₹99 once
```

**Long description** · 854 chars
```text
Garoono Docs is a library of playbooks and checklists for people who build apps after their day job

I'm Gautam, a senior software engineer, and I've shipped 14 apps to the App Store and Google Play next to a full time job, with 100,000+ users across them

Every doc comes from something I had to figure out the slow way
Store review and rejections, app store SEO, pricing and paywalls, subscriptions, tracking where users drop off, your first 100 users, security checks and the legal pages you need before you submit

Each one is short and practical, made to use on a weeknight, not to read once and forget

What you get
30 docs, with more added as I ship
5 are free to read and download, no sign-in
The rest open with a one-time ₹99 payment, sign in with Google, no subscription

Made for solo builders who are short on time and money and tired of hype
```

**Doc titles you can quote** (all real, from `src/data/docs.ts`)

- Will Your App Get Rejected? The 30 Minute Audit (free)
- Steal Your Competitors' Best Keywords (free)
- Stuck at 12 Testers? Get Play Production Access
- Ship v1 in 30 Days, Next to a Day Job
- Price Your App
- 20 Security Checks Before You Launch
- Before You Submit: Legal Checklist
- Your First 100 Users

---

## 2. Assets

### What already exists

| File | Size | Use it for |
|---|---|---|
| `public/logos/garoono-latest-logo.jpg` | 640 x 640, 27 KB | Square logo and thumbnail everywhere (Product Hunt thumbnail, Uneed, Fazier, Microlaunch, SaaSHub, Peerlist, Indie Hackers) |
| `public/og.jpg` | 1200 x 630 | Generic cover where no size is given (Peerlist cover, BetaList image). It shows the app portfolio, not the docs, so it is a fallback only |
| `public/doc-covers/<slug>.webp` | 599 x 776 each | Raw material for the gallery images below. Some forms reject WebP, export to PNG first |
| `public/free-docs/html-screenshots-template.zip` | 3 files | The thing to show on Show HN |

### What needs to be made

1. **Square logo PNG, 640 x 640** from `garoono-latest-logo.jpg` (AlternativeTo asks for PNG or SVG, 280 x 280 or bigger). One `sips -s format png` call is enough
2. **Gallery set, 4 images at 1270 x 760 PNG** (Product Hunt needs at least 2, also used for Fazier, Microlaunch, Uneed, Peerlist):
   - G1 hero: "Playbooks from 14 shipped apps" with 6 doc covers fanned out, the garoono.in pill and "14 apps · 100,000+ users" in the same style as `og.jpg`
   - G2 the `/docs` library page, real screenshot at desktop width
   - G3 a free doc open in the reader (use "Will Your App Get Rejected?")
   - G4 free vs paid: "5 free, no sign-in" next to "Everything else, ₹99 once"
   - Build them the same way as the store screenshots: one HTML page each, rendered with headless Chrome, then check every file with `sips -g pixelWidth -g pixelHeight`
3. **Screen recording, 30 to 60 seconds**, 1920 x 1080 or 1270 x 760, no voice needed:
   - 0 to 5s: garoono.in/docs loads
   - 5 to 20s: scroll the list, pause on 3 covers
   - 20 to 40s: open "Will Your App Get Rejected?", flip 3 pages, tap Download (no sign-in)
   - 40 to 55s: tap a paid doc, show the preview pages and the ₹99 lifetime offer
   - Upload to YouTube as Public or Unlisted (Product Hunt only takes YouTube links and refuses private videos). Keep the MP4 for Peerlist and Microlaunch
4. **Fazier badge** on the garoono.in footer (only if you take Fazier's free route, see below). That is a site code change, not done here
5. **Public GitHub repo of the screenshot template** (optional but best for Show HN, see section 5)

---

## 3. Directories

Link type legend: **followed** = no `nofollow`, `ugc` or `sponsored` on the main Visit link. **nofollow** = passes little or no ranking value. Where I could not inspect the page myself I say who checked and when.

---

### 3.1 Product Hunt

- **Submit:** https://www.producthunt.com/posts/new (log in, Submit, New Product, paste `https://garoono.in/docs/`)
- **Status:** Accepting. Free. Self-hunting is recommended, no hunter needed
- **Link type:** `rel="noreferrer noopener ugc"` on Visit website (HackerNoon test, 17 to 18 Sep 2026). `ugc` is a soft discount, not a full nofollow. Third-party claims disagree, so treat it as partial
- **Rules from Product Hunt's own launch guide:**
  - Personal account only, company accounts are banned. New accounts must finish onboarding first
  - Launches go live at 12:01 AM Pacific. Before 1 Nov 2026 that is 12:31 PM IST, from 1 Nov (US clocks go back) it is 1:31 PM IST. You can schedule up to 1 month ahead
  - Do not ask anyone to upvote. Ask people to visit and comment
  - Gallery needs 2 or more images before it shows. Topics: up to 3. Video: YouTube links only, full URL
  - Description: the help article says "within 260 characters", the newer launch guide says 500 max. The copy below fits 260 so it is safe under both
- **Fields:**

**Name** · 12 chars
```text
Garoono Docs
```

**Tagline** · 59 chars
```text
Playbooks from 14 shipped apps, for builders with a day job
```

**Description** · 235 chars
```text
30 playbooks and checklists for building apps next to a day job
Store review, app store SEO, pricing, subscriptions, first users, security and legal
Written from 14 shipped apps and 100,000+ users
5 docs are free, the rest are ₹99 once
```

- **Product URL:** `https://garoono.in/docs/` (no UTM, Product Hunt wants a direct link)
- **Additional links:** `https://garoono.in/`, `https://garoono.in/blog/`
- **X handle:** leave empty unless Garoono has its own
- **Makers:** your personal account
- **Pricing type:** Paid (with free options)
- **Promo code:** skip, there is no code system in checkout
- **Topics (pick 3 in the picker):** look for Developer Tools, Productivity and an education or books topic. Confirm the names in the picker, I could not open it without an account
- **Thumbnail:** `public/logos/garoono-latest-logo.jpg` (square, 240 x 240 recommended, under 3 MB, it is 27 KB)
- **Gallery:** G1 to G4 at 1270 x 760 (to make)
- **Video:** the YouTube recording (to make)

**First comment** · 942 chars
```text
Hey everyone, I'm Gautam
I'm a senior software engineer in Delhi and I build apps after work, 14 shipped so far with 100,000+ users across them

Every time I hit a wall, a store rejection, a paywall nobody tapped, a security hole an AI tool left in, I wrote down what fixed it
Those notes became Garoono Docs, 30 short playbooks and checklists

A few that are in there
Will Your App Get Rejected? The 30 Minute Audit
Stuck at 12 Testers? Get Play Production Access
Price Your App
20 Security Checks Before You Launch

5 docs are free with no sign-in, so you can judge the style before paying anything
The rest are ₹99 once for lifetime access, no subscription

It's written for people with a day job, so every doc tries to fit into one evening

I'd love honest feedback on three things
Which topic is missing for you
Whether the docs feel too short or about right
Anything that reads unclear or wrong

I'll be here all day answering questions
```

---

### 3.2 Uneed

- **Submit:** https://www.uneed.best/submit-a-tool (name and URL, then Preview my product. Account by email code)
- **Status:** Accepting. Live check of `https://www.uneed.best/api/v1/launch-dates` on 2026-10-22: free line open, next free date **2027-03-21 (150 days away)**. Paid dates open from 2026-10-23
- **Options (from Uneed's own `launch.txt`):**
  - Free waiting line: date assigned at the back of the line. On launch day you need an upvote score of 10 to stay published and **20 to keep a followed link**. Below 10 the product goes back to your dashboard and can never join the free line again
  - Fast-track, $14.99: date about 2 weeks out, always published, followed link from a score of 10
  - Skip the Waiting Line, $39.99: pick the date, permanent followed link whatever happens
  - Free accounts can have only one scheduled launch at a time
- **Link type:** followed only under the conditions above. HackerNoon (Sep 2026) saw `nofollow noopener` on the page they checked, which matches a free launch that missed the score
- **URL rule:** must be a real landing page, not a vercel.app or netlify.app address. `garoono.in/docs/` is fine
- **Fields:**

**Name** · 12 chars
```text
Garoono Docs
```

**URL**
```text
https://garoono.in/docs/
```

**One line description** · 72 chars
```text
Playbooks and checklists from 14 shipped apps, for people with a day job
```

- **Category:** Uneed auto-classifies after creation. If you can edit it, pick Products For Sale or a learning or indie making tag
- **Images:** logo `garoono-latest-logo.jpg`, then G1 to G4 if the edit page asks for screenshots. Uneed does not publish sizes
- **Long description (if the edit page shows one):** use the Long description block from section 1

---

### 3.3 Indie Hackers

- **Product page:** Products menu, Add Yours, on https://www.indiehackers.com/ (my requests got blocked by a bot check, so I could not open the form)
- **Status:** The Add Yours entry still shows in the site menu in 2026 snapshots. Could not confirm the form works
- **Link type:** `nofollow noopener` (HackerNoon, Sep 2026)
- **Value here is the audience, not the link.** Do the product page, then the post

**Product name** · 12 chars
```text
Garoono Docs
```

**Tagline** · 57 chars
```text
Playbooks from 14 shipped apps, for people with a day job
```

**Description:** Long description block from section 1. No limit is published, IH trims long text on cards, so the first line carries it

**Website:** `https://garoono.in/docs/`

**Post title** · 71 chars
```text
I turned notes from 14 apps I built after work into 30 short checklists
```

**Post body** · 1097 chars
```text
I'm a senior software engineer and I build apps next to the job
14 shipped so far, 100,000+ users across them

For years my notes lived in random files
How I got past a store rejection, how I set up subscriptions, what I check before a launch, which security holes AI tools leave in
I kept explaining the same things in my posts, so I cleaned the notes up into docs

How it's set up
30 docs on garoono.in/docs
5 are fully free, no sign-in, you can download the PDF
The other 25 show the first part as a preview, then one ₹99 payment opens all of them for life
Sign in is Google only, so there's no password to forget

Why ₹99 and not a subscription
Most people reading this are building on their own money, and I didn't want another monthly charge in anyone's life

What I'm not sure about yet
Whether the free ones should be the most useful docs or the most basic ones
Whether people outside India see ₹99 as cheap or as confusing

If you've sold docs or templates next to your apps, I'd like to hear what worked
And if a topic is missing, tell me and I'll write it next

https://garoono.in/docs/
```

---

### 3.4 SaaSHub

- **Submit:** https://www.saashub.com/services/submit (account: https://www.saashub.com/register)
- **Status:** Accepting, free. Every submission is reviewed by hand, no published wait time. Submissions with no competitors listed go to the bottom of the queue
- **Link type:** nofollow on unverified listings (seen on a live page today, and HackerNoon Sep 2026). SaaSCity checked on 7 Oct 2026 that 29 of 30 **verified** listings had a followed Visit link. Verifying is free, by an email on the product's own domain (a `@garoono.in` address) or a meta tag on the site
- **Fit risk:** SaaSHub is a software directory. A docs library may be declined, the form does not say
- **Fields:**

**Name** · 12 chars
```text
Garoono Docs
```

**Website:** `https://garoono.in/docs/`

**Tagline** · 59 chars
```text
Playbooks from 14 shipped apps, for builders with a day job
```

**Description:** Long description block from section 1

- **Categories (a few):** Developer Tools, App Development, Mobile App Development, Knowledge Base or eLearning, whichever exist in the picker
- **Competitors:** pick 2 or 3 from SaaSHub's own suggestions in the form (needed to avoid the back of the queue)
- **Logo:** `garoono-latest-logo.jpg`
- **Then:** verify the listing to get the followed link

---

### 3.5 Show HN (Hacker News)

- **Submit:** https://news.ycombinator.com/submit (account: https://news.ycombinator.com/login, Create Account section)
- **Status:** Active. Show HN posts from Sep 2026 are live
- **Link type:** checked today on `/show` and `/shownew`: new and low-score posts carry `rel="nofollow"`, posts that earn points lose it and become followed
- **Big catch:** Show HN rules say blog posts, sign-up pages, newsletters, lists and other reading material are not Show HN, and neither are landing pages. Garoono Docs is reading material behind a paywall, so posting it as Show HN would break the rules and likely get flagged
- **What fits instead:** the free HTML screenshot template (`public/free-docs/html-screenshots-template.zip`, from the free doc "Stop Making App Store Screenshots in Figma"). It is something people can run, it is free, and it needs no sign-up. Full copy in section 5
- Do not ask anyone to upvote or comment. HN calls that a voting ring

---

### 3.6 AlternativeTo

- **Submit:** https://alternativeto.net/manage-item/ (user menu, Suggest new application). Account from the same page, Create an account. Email must be verified first
- **Status:** Accepting apps. Free queue holds thousands of apps with no date. Priority review is a one-time fee (SaaSCity saw $5 on 7 Oct 2026), usually 1 to 2 business days, no promise of approval
- **Link type:** nofollow on new listings (HackerNoon Sep 2026, SaaSCity Oct 2026). Some long-standing listings are followed
- **Fit: poor, I'd skip it for the docs.** AlternativeTo's FAQ lists books, guides, tutorials, personal sites and blogs as declined content. Garoono Docs will most likely be rejected
- **If you still want a garoono.in link from it:** list one of the real apps instead, with its `garoono.in/apps/<slug>/` page as the official website. Their FAQ also declines single-purpose web tools, clones and thin AI wrappers, so pick an app that is a full product
- **Fields if you try the docs anyway** (no limits published, no links allowed in the description):

**Name** · 12 chars
```text
Garoono Docs
```

**Short description** · 77 chars
```text
Playbooks and checklists from 14 shipped apps, for people building after work
```

**Description:** Long description block from section 1, with the `garoono.in` mentions removed (links and addresses are not allowed in the text)

- **Platforms:** Online / Web
- **License:** Freemium
- **Tags:** indie-dev, app-development, checklists, mobile-development
- **Official website:** `https://garoono.in/docs/` (no UTM tags, AlternativeTo forbids them)
- **Icon:** the 640 x 640 PNG (to make)

---

### 3.7 Fazier (extra)

- **Submit:** https://fazier.com/submit (account: https://fazier.com/signup)
- **Status:** Accepting. Launches go live at 12 AM PST daily
- **Options (SaaSCity, 7 Oct 2026):**
  - Free (Basic): listed within 30 days, **only if a Fazier badge or link is on your homepage or footer**, visible without login and at least 120px wide. Fazier detects it automatically
  - Lite $29, Premium $49, Super $99, one-time. Paid ones can go live now or on a picked date
- **Link type:** followed on free and paid launches (Fazier says so, and SaaSCity checked 22 launch pages on 7 Oct 2026, none had nofollow)
- **Fields:** name, tagline, description, category, thumbnail, gallery, pricing. No limits published

**Name** · 12 chars
```text
Garoono Docs
```

**Tagline** · 59 chars
```text
Playbooks from 14 shipped apps, for builders with a day job
```

**Description:** Long description block from section 1

- **Category:** Developer Tools or Education, whichever is closest
- **Pricing:** Freemium
- **Thumbnail:** `garoono-latest-logo.jpg`. **Gallery:** G1 to G4
- **Before submitting:** add the Fazier badge to the garoono.in footer (code change, not done here)

---

### 3.8 Microlaunch (extra)

- **Submit:** https://microlaunch.net/submit (account: https://microlaunch.net/signup). Use the address without `www`, the `www` one returned an SSL error today
- **Status:** Accepting. Products are onboarded between the 1st and 15th of each month and each launch runs as a 30 day campaign. The free option only shows after you sign up and its wait is not published. Launch Pro was $39 on 7 Oct 2026 (SaaSCity)
- **Link type:** followed on free and paid pages (SaaSCity checked 69 product pages on 7 Oct 2026)
- **Fields:** logo, hero image, screenshots (5 MB each max), pricing model, ideal customer, stage, help you want, optional deal, goals (private). No limits published

**Name** · 12 chars
```text
Garoono Docs
```

**Tagline** · 59 chars
```text
Playbooks from 14 shipped apps, for builders with a day job
```

**Description:** Long description block from section 1

**Ideal customer** · 86 chars
```text
Developers and makers with a full time job who build and ship mobile apps on their own
```

**Help you want** · 78 chars
```text
Feedback on which topics are missing and whether the docs are the right length
```

- **Pricing model:** One-time (lifetime)
- **Stage:** Launched
- **Logo:** `garoono-latest-logo.jpg`. **Hero:** G1. **Screenshots:** G2 to G4

---

### 3.9 Peerlist Launchpad (extra)

- **Submit:** add the project on your profile (Work tab, New project), then on a Monday go to https://peerlist.io/launchpad and click Launch, or schedule a later week from the project page
- **Account:** https://peerlist.io/ (sign up there. Peerlist blocked my script, so I could not open the signup page)
- **Status:** Accepting. Launches run weekly, Monday 00:00 to 23:59 UTC (5:30 AM Monday to 5:29 AM Tuesday IST)
- **Rules:** individual profile only (real name and photo). One help page says the profile must be verified. The project must be 100% complete or the launch fails: name, tagline, cover image and demo link are required. No asking for upvotes in DMs or under other people's posts
- **Link type:** unknown, I could not load a project page to inspect it
- **Fields:** no limits published

**Project name** · 12 chars
```text
Garoono Docs
```

**Tagline** · 59 chars
```text
Playbooks from 14 shipped apps, for builders with a day job
```

**Description:** Long description block from section 1

- **Demo link / project URL:** `https://garoono.in/docs/`
- **Cover image:** G1 (fallback `public/og.jpg`). **Media:** G2 to G4 and the MP4 recording
- **Category / tags:** Developer Tools, Mobile Development, Education (whatever the picker has)

---

### 3.10 BetaList (extra, weakest fit of the extras)

- **Submit:** https://betalist.com/submit (account: https://betalist.com/sign_up)
- **Status:** Accepting. BetaList takes pre-launch and recently launched startups on their own domain. It rejects free hosting subdomains and direct app store links. Plans and wait times only show at the end of the form, and unselected paid submissions get an automatic refund
- **Link type:** the main Visit Site button on featured listings is followed through a BetaList 301 redirect (BetaList FAQ, and checked on a live listing today: the big button has no `rel`, only the image link is `nofollow`)
- **Fit risk:** BetaList is about startups. A docs library may not be selected
- **Fields:** icon, name, pitch, description, website, images. No limits published

**Name** · 12 chars
```text
Garoono Docs
```

**Pitch** · 45 chars
```text
Playbooks for shipping apps next to a day job
```

**Description:** Long description block from section 1

- **Website:** `https://garoono.in/docs/`
- **Icon:** `garoono-latest-logo.jpg`. **Images:** G1 to G4

---

## 4. Checklist, ordered by backlink and SEO value (highest first)

Value is a mix of link type and how strong the site is. Effort is rough, for one person, once the assets in section 2 exist.

| # | Item | Why it's here | Effort |
|---|---|---|---|
| 0 | Make the assets: 640 PNG logo, G1 to G4 at 1270 x 760, 30 to 60s recording on YouTube | Every listing below needs them | 3 to 4 h |
| 1 | Product Hunt launch | Strongest domain on the list, `ugc` link, the launch page tends to rank for the brand name, and the Daily Digest can feature it | 2 h prep + launch day replying |
| 2 | Fazier | Followed link on free launches. Free route needs the footer badge first | 30 min + badge code change |
| 3 | Microlaunch | Followed link on free and paid pages, 30 day campaign | 30 min, free wait unknown |
| 4 | Uneed | Followed link only with a launch-day score of 20 (free) or 10 (Fast-track, $14.99), or always with Skip the Line ($39.99). Free date today is 2027-03-21 | 15 min + launch day |
| 5 | BetaList | Followed link if featured, but fit is uncertain | 20 min |
| 6 | SaaSHub + verify | Followed only after verification, which needs a `@garoono.in` email or a meta tag | 30 min + verification |
| 7 | Show HN (screenshot template) | Followed only if the post earns points, mostly a traffic and credibility play, must not be the paid docs | 1 h to set up a repo + replying |
| 8 | Peerlist Launchpad | Developer audience, link type unknown | 30 min, Monday launch |
| 9 | Indie Hackers product page + post | Nofollow, but the right readers | 45 min |
| 10 | AlternativeTo | Nofollow for new listings and guides are on its declined list. Skip for the docs | 20 min if you try |

After each listing goes live, note it in a simple sheet: directory, live URL, date, and the `rel` you see on the Visit link.

Suggested order on the calendar: assets first, then Fazier, Microlaunch, SaaSHub, BetaList and Uneed early because they have queues, then Product Hunt on a weekday you can stay up for, Peerlist the following Monday, Show HN and Indie Hackers a few days after Product Hunt so you can answer comments properly.

---

## 5. Show HN

Post the free screenshot template, not the paid docs (see 3.5 for why).

**Best URL:** a public GitHub repo with the 3 template files and a short README (to make). HN readers trust a repo more than a download link. Fallback: `https://garoono.in/docs/#html-screenshots-not-figma`, where the free guide and the zip download need no sign-in.

**Title** · 78 chars (HN max is 80)
```text
Show HN: App Store screenshots as HTML pages, rendered with a headless browser
```

**Backup title** · 66 chars
```text
Show HN: A tiny template to render App Store screenshots from HTML
```

**First comment** · 1264 chars
```text
I build mobile apps after my day job, 14 shipped so far, and every release needs new store screenshots for an iPhone size and an iPad size
Doing that by hand in a design tool took me most of an evening per app, and redoing it after every UI change was worse

So now each screenshot is one HTML page
The template is 3 files, a sample page, a shared stylesheet and a small zsh script
The script opens every shot_*.html in a headless Chromium based browser at 1206x2622 for iPhone 6.3 inch and 2064x2752 for iPad 13 inch, saves PNGs, then prints the real pixel size of each file so you can catch a wrong size before upload

Same page, two sizes, the layout switches on a #iphone or #ipad hash
Text, colors and the phone frame are plain CSS, so changing a headline across 8 shots is a find and replace

Known limits
The script is macOS only right now, the browser path is hard coded and it uses sips to read image sizes
There is no frame library, you draw the device frame yourself in CSS
Fonts have to be local or the render can fire before they load, the script gives the page 3 seconds of virtual time

I also wrote up how I use it in a free guide on my site, no sign-up
Happy to hear how others handle store screenshots, and whether a Linux version would be useful
```

HN etiquette for the day:
- Post it yourself from your own account, then add the comment above right away
- Reply to every question plainly, including the critical ones
- Don't share the link asking for votes anywhere, and don't mention the paid docs unless someone asks what else is on the site
- A regular (not Show HN) submission is the right place for reading material, for example the blog post `content/blog/flutter-apps-revenue-honest-numbers.md`, if you ever want to try that

---

## 6. Accounts Gautam must create

I did not create, sign in to, or submit anything anywhere. You need these, all on your personal identity (several sites ban company accounts):

| Site | Sign up at | Notes |
|---|---|---|
| Product Hunt | https://www.producthunt.com/login | Personal account, finish onboarding well before launch day |
| Uneed | https://www.uneed.best/login | Email code login |
| Indie Hackers | https://www.indiehackers.com/sign-up | Could not load it from a script (bot check), open it in a browser |
| SaaSHub | https://www.saashub.com/register | Use a `@garoono.in` email if you have one, it verifies the listing |
| Hacker News | https://news.ycombinator.com/login | Create Account is on the same page |
| AlternativeTo | https://alternativeto.net/manage-item/ | Create an account from the sign-in page, verify your email. Optional, see 3.6 |
| Fazier | https://fazier.com/signup | |
| Microlaunch | https://microlaunch.net/signup | No `www` |
| Peerlist | https://peerlist.io/ | Individual profile with real name and photo, may need verification |
| BetaList | https://betalist.com/sign_up | |
| GitHub | https://github.com/signup | Only if you don't already have one, for the Show HN repo |
| YouTube | https://www.youtube.com/ | Only if you don't already have a channel, for the Product Hunt video |
