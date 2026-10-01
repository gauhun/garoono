// Landing pages at garoono.in/apps/<slug>/ for apps that used to point at Linktree.
// Copy follows the store-copy rules: no em or en dashes, no full stop at the end of a line,
// plain words, and no other companies' app names.

export type AppPage = {
  slug: string;
  productId: number; // id in products.ts (name, icon, colour, user count come from there)
  tagline: string;
  problem: string[]; // "Before" card, one line each
  result: string[]; // "After" card, one line each
  steps: { title: string; text: string }[]; // exactly 3
  benefits: { icon: string; title: string; text: string }[]; // 4 to 6
  playUrl: string;
  appStoreUrl: string;
  screenshots: string[]; // paths under /public, saved by scripts/fetch-app-shots.mjs
  category: string; // schema.org applicationCategory
  seoTitle: string;
  seoDescription: string;
};

const shots = (slug: string, count: number) => Array.from({ length: count }, (_, i) => `/apps/${slug}/shot-${i + 1}.jpg`);

export const appPages: AppPage[] = [
  {
    slug: "dress-mirror",
    productId: 12,
    tagline: "See any outfit on you before you buy it",
    problem: [
      "The outfit looked great on the model",
      "It arrives, it doesn't suit you, and the return takes a week",
      "Trial rooms mean queues, and online you are just guessing",
    ],
    result: [
      "Try any outfit on your own photo in seconds",
      "Your real face, skin tone and body stay yours",
      "Buy what suits you and skip the returns",
    ],
    steps: [
      { title: "Add your photo", text: "One clear photo of you is all it needs" },
      { title: "Pick an outfit", text: "Share a product image from any shopping app, or pick a style" },
      { title: "See it on you", text: "The outfit is fitted on your photo, with the drape and colour" },
    ],
    benefits: [
      { icon: "🥻", title: "Made for Indian fashion", text: "Sarees, lehengas, kurtis, salwar suits and anarkalis, not just t-shirts and jeans" },
      { icon: "🪞", title: "Still looks like you", text: "Keeps your real face, skin tone and body shape, never a random model" },
      { icon: "🛍️", title: "Try from anywhere", text: "Found something online? Share the image and try it on right away" },
      { icon: "🎉", title: "Every occasion", text: "Wedding looks, festive outfits, party dresses and office wear" },
      { icon: "✏️", title: "Edit with words", text: "Type a halter top or wavy hair and see the change on your photo" },
      { icon: "💸", title: "Fewer returns", text: "Know the fit and colour before you spend a rupee" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.dressmirror",
    appStoreUrl: "https://apps.apple.com/us/app/dressmirror-ai-shoot-try-on/id6781407057",
    screenshots: shots("dress-mirror", 6),
    category: "LifestyleApplication",
    seoTitle: "Dress Mirror: AI Virtual Try On for Sarees, Lehengas and More",
    seoDescription:
      "Try sarees, lehengas, kurtis and western outfits on your own photo before you buy, on Android and iPhone",
  },
];

export const appPageBySlug = (slug: string) => appPages.find((p) => p.slug === slug);
export const appPageByProduct = (productId: number) => appPages.find((p) => p.productId === productId);
