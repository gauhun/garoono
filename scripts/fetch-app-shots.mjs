// Saves an app's Google Play screenshots into public/apps/<slug>/ so pages never hotlink the store.
// Usage: node scripts/fetch-app-shots.mjs <slug> <play package id> [max=6]
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const [slug, pkg, maxArg] = process.argv.slice(2);
if (!slug || !pkg) {
  console.error("Usage: node scripts/fetch-app-shots.mjs <slug> <play package id> [max]");
  process.exit(1);
}
const max = Number(maxArg ?? 6);
const outDir = new URL(`../public/apps/${slug}/`, import.meta.url);
mkdirSync(outDir, { recursive: true });

const html = await (await fetch(`https://play.google.com/store/apps/details?id=${pkg}&hl=en_IN`)).text();
const bases = [
  ...new Set(
    [...html.matchAll(/(https:\/\/play-lh\.googleusercontent\.com\/[A-Za-z0-9_-]+)=w\d+-h\d+[^"]*"[^>]*alt="Screenshot image"/g)].map((m) => m[1]),
  ),
].slice(0, max);

let i = 0;
for (const base of bases) {
  i++;
  const file = new URL(`shot-${i}.jpg`, outDir);
  if (existsSync(file)) continue;
  const res = await fetch(`${base}=w720-rj`);
  if (!res.ok) {
    console.warn(`✗ shot-${i}: HTTP ${res.status}`);
    continue;
  }
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${slug}/shot-${i}.jpg`);
}
console.log(`${bases.length} screenshot(s) for ${slug}`);
