import previews from "./docPreviews.json";

// Docs shared on Instagram. Newest entries go first; `slug` keys the Firestore
// counters and the cover filename, so never change it once a doc is live.
// Publish or update a doc's PDF with `npm run add-doc` (cover, page images and the PDF itself).

export type SharedDoc = {
  slug: string; // ^[a-z0-9-]{3,60}$
  title: string;
  blurb: string;
  // Free docs are served from this site; paid docs live in a private bucket and open via getDocLink
  free: boolean;
  addedOn: string; // ISO date
};

export const docs: SharedDoc[] = [
  {
    slug: "find-your-niche",
    title: "Find Your Niche and Prove People Want It",
    blurb: "A data-first way to pick an app idea people search for, pay for, and can't find a good version of yet.",
    free: false,
    addedOn: "2026-10-03",
  },
  {
    slug: "build-it-fast-with-ai",
    title: "Build It Fast with AI",
    blurb: "What to write before you prompt, the order to build in, and a paywall Apple won't reject.",
    free: false,
    addedOn: "2026-10-03",
  },
  {
    slug: "first-100-users",
    title: "Your First 100 Users",
    blurb: "Without an ad budget, and without waiting for the App Store to notice you.",
    free: false,
    addedOn: "2026-10-03",
  },
  {
    slug: "ship-v1-in-30-days",
    title: "Ship v1 in 30 Days, Next to a Day Job",
    blurb: "One core feature, a fixed weekly time budget, and a build order you don't break.",
    free: false,
    addedOn: "2026-10-03",
  },
  {
    slug: "subscriptions-with-revenuecat",
    title: "Subscriptions with RevenueCat",
    blurb: "Flutter, App Store and Google Play subscriptions, set up once and done right.",
    free: false,
    addedOn: "2026-10-03",
  },
  {
    slug: "track-what-matters",
    title: "Track What Matters",
    blurb: "Firebase, PostHog and RevenueCat joined into one funnel, so you know where people drop off.",
    free: false,
    addedOn: "2026-10-03",
  },
  {
    slug: "price-your-app",
    title: "Price Your App",
    blurb: "Paywall type, plan length, trials, and what to actually charge.",
    free: false,
    addedOn: "2026-10-03",
  },
  {
    slug: "keep-the-30-percent",
    title: "Keep the 30%",
    blurb: "Web payments for iOS apps in the US: what's allowed in 2026, and how to set it up from India.",
    free: false,
    addedOn: "2026-10-03",
  },
  {
    slug: "secure-your-app-prompt",
    title: "The Prompt to Secure Your App",
    blurb: "One copy-paste prompt that makes your AI tool audit your app like a senior security engineer.",
    free: false,
    addedOn: "2026-10-03",
  },
  {
    slug: "flutter-starter-kit-blueprint",
    title: "Stop Building the Same App Twice",
    blurb: "The Flutter starter kit blueprint: build onboarding, paywall and reminders once, reuse them forever.",
    free: false,
    addedOn: "2026-10-03",
  },
  {
    slug: "slideshows-for-app-installs",
    title: "3 Slideshows a Day, Zero Filming",
    blurb: "The slideshow system that turns short-video posts into app installs, without filming.",
    free: false,
    addedOn: "2026-10-03",
  },
  {
    slug: "vibe-coded-app-cloud-bill-traps",
    title: "5 Ways Your Vibe-Coded App Can Bankrupt You Tonight",
    blurb: "Find the cloud billing traps in your app before the invoice finds you.",
    free: false,
    addedOn: "2026-10-01",
  },
  {
    slug: "free-stack-to-launch-an-app",
    title: "The Free Stack to Launch an App",
    blurb: "The tools that cost nothing until you have real users, for a Flutter app and a web app.",
    free: false,
    addedOn: "2026-09-30",
  },
  {
    slug: "grow-on-tiktok-playbook",
    title: "Grow on TikTok: Reach the US From India",
    blurb: "The setup I use to run a US-facing TikTok account, from warm-up and hooks to turning views into installs.",
    free: false,
    addedOn: "2026-09-30",
  },
  {
    slug: "stuck-at-12-testers",
    title: "Stuck at 12 Testers? Get Play Production Access",
    blurb: "Get Google Play production access on the first try, with testers who actually test.",
    free: false,
    addedOn: "2026-09-30",
  },
  {
    slug: "will-your-app-get-rejected-audit",
    title: "Will Your App Get Rejected? The 30 Minute Audit",
    blurb: "36 checks for the App Store and Google Play, with a score that tells you when to submit.",
    free: true,
    addedOn: "2026-09-30",
  },
  {
    slug: "steal-competitor-keywords",
    title: "Steal Your Competitors' Best Keywords",
    blurb: "ASO from competitor listings, 1-star reviews and real comments, researched with parallel AI chats.",
    free: true,
    addedOn: "2026-09-30",
  },
  {
    slug: "failed-payments-win-back",
    title: "They Didn't Cancel. Their Card Did.",
    blurb: "Win back the subscribers you lose to failed payments without noticing.",
    free: true,
    addedOn: "2026-09-30",
  },
  {
    slug: "before-you-spend-on-ads",
    title: "Don't Spend on Ads Until You Read This",
    blurb: "Apple Ads, the break-even math, and when paid installs actually pay you back.",
    free: false,
    addedOn: "2026-09-30",
  },
  {
    slug: "app-rating-3-9-to-4-7",
    title: "From 3.9 to 4.7 Stars",
    blurb: "Ask for reviews at the right moment, fix what 1-star reviews say, and reply like a human.",
    free: false,
    addedOn: "2026-09-30",
  },
  {
    slug: "ai-app-loses-money",
    title: "Your AI App Might Lose Money on Every User",
    blurb: "Price and build AI features so your heaviest users don't eat your profit.",
    free: false,
    addedOn: "2026-09-30",
  },
  {
    slug: "secure-your-vibe-coded-app",
    title: "Your AI-Built App Is Leaking",
    blurb: "Find the 8 holes AI leaves in Flutter and Firebase apps, before someone else does.",
    free: false,
    addedOn: "2026-09-30",
  },
  {
    slug: "build-paid-apps-on-free-ai-models",
    title: "Build Paid Apps on Free AI Models",
    blurb: "How developers turn free AI research into apps people pay for.",
    free: false,
    addedOn: "2026-09-28",
  },
  {
    slug: "20-security-checks-before-launch",
    title: "20 Security Checks Before You Launch",
    blurb: "What each check means, how to test it, and notes if you build on Firebase.",
    free: false,
    addedOn: "2026-09-27",
  },
  {
    slug: "six-documents-before-you-prompt",
    title: "Six Documents Before You Let AI Build Your App",
    blurb: "What to write down first, without wasting a weekend on paperwork.",
    free: false,
    addedOn: "2026-09-26",
  },
  {
    slug: "app-seo-playbook",
    title: "App SEO Playbook",
    blurb: "Get downloads from Google without paying for ads. What really works in 2026.",
    free: false,
    addedOn: "2026-09-25",
  },
  {
    slug: "legal-checklist-before-you-submit",
    title: "Before You Submit: Legal Checklist",
    blurb: "The 7 things stores check before approving an AI-built app, with prompts for each.",
    free: false,
    addedOn: "2026-09-24",
  },
  {
    slug: "app-store-launch-guide",
    title: "Don't Get Rejected: App Store Launch Guide",
    blurb: "The 5 reasons new apps get rejected, and the step-by-step way to ship yours.",
    free: false,
    addedOn: "2026-09-23",
  },
];

// Only free docs have a PDF on the site; paid PDFs never leave the private bucket
export const freePdfUrl = (d: SharedDoc) => `/free-docs/${d.slug}.pdf`;
export const thumbUrl = (d: SharedDoc, size: "lg" | "sm" = "lg") =>
  `/doc-covers/${d.slug}${size === "sm" ? "-sm" : ""}.webp`;

// Page images the reader shows: every page of a free doc, the first 30% of a paid one
export type DocPreview = { pages: number; shown: number };
export const previewOf = (d: SharedDoc): DocPreview | null => (previews as Record<string, DocPreview>)[d.slug] ?? null;
export const previewPageUrl = (d: SharedDoc, page: number) => `/doc-previews/${d.slug}/${page}.webp`;
// A 48px render of the first locked page, blurred behind the unlock card
export const previewTeaserUrl = (d: SharedDoc) => `/doc-previews/${d.slug}/next.webp`;

export function latestDocs(list: SharedDoc[], limit = list.length) {
  return [...list].sort((a, b) => b.addedOn.localeCompare(a.addedOn)).slice(0, limit);
}

const DAY_MS = 86_400_000;

export function ageInDays(d: SharedDoc, now = Date.now()) {
  return Math.max(0, (now - Date.parse(d.addedOn)) / DAY_MS);
}

export const isNew = (d: SharedDoc, now = Date.now()) => ageInDays(d, now) <= 7;
