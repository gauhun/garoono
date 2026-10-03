// Publishes a doc from its final PDF (exported from Google Docs). macOS only (PDFKit via swift).
//   Free: the PDF is served from this site (public/free-docs/) and the reader shows every page
//   Paid: the PDF goes to the private bucket, where only Pro members get a signed link,
//         and the reader shows the first 30%
// Renders the cover and the page images as WebP and records page counts in src/data/docPreviews.json.
// Refuses a PDF that still has an "EDIT ME" note (see scripts/render-doc.swift).
// Usage: npm run add-doc -- <file.pdf> <slug> [--free] [--allow-notes]
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const BUCKET = "gs://baseproject-25dbe-paid-docs";
const ACCOUNT = "garoonotech@gmail.com";
const MANIFEST = "src/data/docPreviews.json";

const args = process.argv.slice(2);
const [pdf, slug] = args.filter((a) => !a.startsWith("--"));
const free = args.includes("--free");

if (!pdf || !slug) {
  console.error("Usage: npm run add-doc -- <file.pdf> <slug> [--free] [--allow-notes]");
  process.exit(1);
}
if (!/^[a-z0-9-]{3,60}$/.test(slug)) {
  console.error("Slug must match ^[a-z0-9-]{3,60}$");
  process.exit(1);
}
if (!existsSync(pdf)) {
  console.error(`Not found: ${pdf}`);
  process.exit(1);
}

const tmp = mkdtempSync(path.join(tmpdir(), `doc-${slug}-`));
let result;
try {
  const render = ["scripts/render-doc.swift", pdf, tmp, free ? "free" : "paid"];
  if (args.includes("--allow-notes")) render.push("--allow-notes");
  const out = execFileSync("swift", render, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
  result = JSON.parse(out.trim().split("\n").pop());
} catch {
  rmSync(tmp, { recursive: true, force: true });
  console.error(`✗ ${slug}: not published`);
  process.exit(1);
}

const toWebp = (file, out) => sharp(path.join(tmp, file)).webp({ quality: 78 }).toFile(out);

mkdirSync("public/doc-covers", { recursive: true });
await toWebp("cover.jpg", `public/doc-covers/${slug}.webp`);
await toWebp("cover-sm.jpg", `public/doc-covers/${slug}-sm.webp`);

// Start clean so a doc that now shows fewer pages leaves none behind
const pagesDir = `public/doc-previews/${slug}`;
rmSync(pagesDir, { recursive: true, force: true });
mkdirSync(pagesDir, { recursive: true });
for (const file of readdirSync(tmp).filter((f) => /^(\d+|next)\.jpg$/.test(f))) {
  await toWebp(file, `${pagesDir}/${file.replace(/\.jpg$/, ".webp")}`);
}
rmSync(tmp, { recursive: true, force: true });

const publicPdf = `public/free-docs/${slug}.pdf`;
if (free) {
  mkdirSync("public/free-docs", { recursive: true });
  copyFileSync(pdf, publicPdf);
} else {
  rmSync(publicPdf, { force: true }); // a doc that turned paid must not stay public
  execFileSync("gcloud", ["storage", "cp", pdf, `${BUCKET}/${slug}.pdf`, "--content-type=application/pdf", `--account=${ACCOUNT}`], {
    stdio: ["ignore", "ignore", "inherit"],
  });
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
manifest[slug] = { pages: result.pages, shown: result.shown };
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`);

const left = result.notes.length ? `, EDIT ME left on page ${result.notes.join(", ")} (buyers will see it)` : "";
console.log(`✓ ${slug}: ${free ? `free, all ${result.pages}` : `paid, ${result.shown} of ${result.pages}`} pages shown${left}`);

if (!readFileSync("src/data/docs.ts", "utf8").includes(`slug: "${slug}"`)) {
  console.log(`
Add this to the top of docs in src/data/docs.ts:

  {
    slug: "${slug}",
    title: "",
    blurb: "",
    free: ${free},
    addedOn: "${new Date().toISOString().slice(0, 10)}",
  },
`);
}
