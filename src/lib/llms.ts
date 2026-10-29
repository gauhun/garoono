import { appPages } from "../data/appPages";
import { docs } from "../data/docs";
import { CALL, COURSE, COURSE_STAGE } from "../data/offers";
import { products } from "../data/products";
import { getAllPosts, getPost } from "./blog";

const ORIGIN = "https://garoono.in";

// llms.txt (llmstxt.org): what the site is, in plain words, with links an AI assistant can follow
export function llmsTxt() {
  const apps = appPages.map((p) => {
    const name = products.find((x) => x.id === p.productId)?.name ?? p.slug;
    const stores = [p.appStoreUrl && `[App Store](${p.appStoreUrl})`, `[Google Play](${p.playUrl})`].filter(Boolean).join(", ");
    return `- [${name}](${ORIGIN}/apps/${p.slug}/): ${p.seoDescription}. ${stores}`;
  });
  const guides = getAllPosts().map((p) => `- [${p.title}](${ORIGIN}/blog/${p.slug}/): ${p.description}`);
  const playbooks = docs.map((d) => `- [${d.title}](${ORIGIN}/docs/#${d.slug}): ${d.blurb}${d.free ? " (free PDF)" : ""}`);

  return `# Garoono

> Garoono is the site of Gautam Singh Rathor, a senior software engineer in Delhi who builds mobile apps after his 9 to 5. It lists his apps, sells playbooks and checklists for indie app makers, and has a blog about shipping apps solo next to a day job.

14 apps shipped, 100,000+ users across them, mostly Flutter. Some playbooks are free PDFs, the rest open with a one-time lifetime purchase on the docs page.

## Apps
${apps.join("\n")}

## Guides
${guides.join("\n")}

## Playbooks
${playbooks.join("\n")}

## Products
- [Products](${ORIGIN}/products/): ${COURSE.title} (course, ${COURSE.price[COURSE_STAGE]}), kits, the docs pass and 1:1 calls
- [Book a call](${ORIGIN}/call/): ${CALL.minutes} minutes with Gautam on Google Meet, ${CALL.price}, ${CALL.hours}

## Optional
- [Full text of the guides](${ORIGIN}/llms-full.txt)
- [Blog RSS](${ORIGIN}/blog/rss.xml)
- [Privacy Policy](${ORIGIN}/privacy/)
- [Terms](${ORIGIN}/terms/)
`;
}

// The same, with every guide's full text appended
export function llmsFullTxt() {
  const head = llmsTxt().split("\n## Optional")[0];
  const posts = getAllPosts().map((p) => {
    // Inline SVG figures mean nothing as text
    const md = (getPost(p.slug)?.markdown ?? "").replace(/<figure>[\s\S]*?<\/figure>\n*/g, "").trim();
    return `---\nSource: ${ORIGIN}/blog/${p.slug}/\nDate: ${p.date}\n\n# ${p.title}\n\n${md}\n`;
  });
  return `${head}\n${posts.join("\n")}`;
}
