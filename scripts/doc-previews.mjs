// Builds the free preview (first 30% of pages) for every paid doc into
// public/doc-previews/<slug>/ and records page counts in src/data/docPreviews.json.
// Pulls missing PDFs from the private bucket into private-docs/paid/ (gitignored).
// Existing previews are kept; pass --force to redo them. macOS only (PDFKit via swift).
// Usage: npm run previews [-- --force] [-- <slug>…]
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const BUCKET = "gs://baseproject-25dbe-paid-docs";
const ACCOUNT = "garoonotech@gmail.com";
const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

const source = readFileSync("src/data/docs.ts", "utf8");
// Named slugs are rendered even before they are added to docs.ts (npm run add-doc does this)
const paid = only.length
  ? only
  : [...source.matchAll(/\{[^{}]*?slug:\s*"([^"]+)"[^{}]*?\}/g)]
      .filter(([block]) => /free:\s*false/.test(block))
      .map(([, slug]) => slug);

const manifestPath = "src/data/docPreviews.json";
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
mkdirSync("private-docs/paid", { recursive: true });

for (const slug of paid) {
  const outDir = `public/doc-previews/${slug}`;
  if (!force && manifest[slug] && existsSync(`${outDir}/1.webp`)) continue;

  const pdf = `private-docs/paid/${slug}.pdf`;
  if (!existsSync(pdf)) {
    execFileSync("gcloud", ["storage", "cp", `${BUCKET}/${slug}.pdf`, pdf, `--account=${ACCOUNT}`], { stdio: "inherit" });
  }

  rmSync(outDir, { recursive: true, force: true });
  const out = execFileSync("swift", ["scripts/render-preview.swift", pdf, outDir], { encoding: "utf8" });
  manifest[slug] = JSON.parse(out.trim().split("\n").pop());
  // PDFKit writes JPEG; the site serves WebP (about a third smaller)
  for (const file of readdirSync(outDir).filter((f) => f.endsWith(".jpg"))) {
    await sharp(`${outDir}/${file}`).webp({ quality: 78 }).toFile(`${outDir}/${file.replace(/\.jpg$/, ".webp")}`);
    rmSync(`${outDir}/${file}`);
  }
  console.log(`✓ ${slug}: ${manifest[slug].shown} of ${manifest[slug].pages} pages`);
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);
