// Docs shared on Instagram. Newest entries go first; `slug` keys the Firestore
// counters and the cover filename, so never change it once a doc is live.

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

export const docs: SharedDoc[] = [
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
    free: false,
    addedOn: "2026-09-30",
  },
  {
    slug: "steal-competitor-keywords",
    title: "Steal Your Competitors' Best Keywords",
    blurb: "ASO from competitor listings, 1-star reviews and real comments, researched with parallel AI chats.",
    free: false,
    addedOn: "2026-09-30",
  },
  {
    slug: "failed-payments-win-back",
    title: "They Didn't Cancel. Their Card Did.",
    blurb: "Win back the subscribers you lose to failed payments without noticing.",
    free: false,
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
    slug: "zero-budget-ways-to-get-users",
    title: "15 Zero Budget Ways to Get Users",
    blurb: "The channels that actually work for an indie app, ranked honestly.",
    free: true,
    driveId: "1tEFt0mou9J2cdTuOpaE0gzswRhOD7g-R",
    addedOn: "2026-09-29",
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
    free: true,
    driveId: "1yf42ZgUjGZg-P9G6Hdg0MdPoCe93XEii",
    addedOn: "2026-09-24",
  },
  {
    slug: "app-store-launch-guide",
    title: "Don't Get Rejected: App Store Launch Guide",
    blurb: "The 5 reasons new apps get rejected, and the step-by-step way to ship yours.",
    free: true,
    driveId: "1sKFieTsoMu1QBxT1ImTUE8VRqmV8DSbj",
    addedOn: "2026-09-23",
  },
];

export const viewUrl = (d: FreeDoc) => `https://drive.google.com/file/d/${d.driveId}/view`;
export const downloadUrl = (d: FreeDoc) => `https://drive.google.com/uc?export=download&id=${d.driveId}`;
// Covers are copied from Drive into public/doc-covers/ by `npm run covers` (runs before every build)
export const thumbUrl = (d: SharedDoc, size: "lg" | "sm" = "lg") =>
  `/doc-covers/${d.slug}${size === "sm" ? "-sm" : ""}.jpg`;

export function latestDocs(list: SharedDoc[], limit = list.length) {
  return [...list].sort((a, b) => b.addedOn.localeCompare(a.addedOn)).slice(0, limit);
}

const DAY_MS = 86_400_000;

export function ageInDays(d: SharedDoc, now = Date.now()) {
  return Math.max(0, (now - Date.parse(d.addedOn)) / DAY_MS);
}

export const isNew = (d: SharedDoc, now = Date.now()) => ageInDays(d, now) <= 7;
