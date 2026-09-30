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
    driveId: "1LG6h_kcYRMKfHjE_92_Ra-2Km6xlBqQA",
    addedOn: "2026-09-24",
  },
  {
    slug: "app-store-launch-guide",
    title: "Don't Get Rejected: App Store Launch Guide",
    blurb: "The 5 reasons new apps get rejected, and the step-by-step way to ship yours.",
    free: true,
    driveId: "1ld5N1IWFYxdPeezwtxb3CLPZON9THdfN",
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
