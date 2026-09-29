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
