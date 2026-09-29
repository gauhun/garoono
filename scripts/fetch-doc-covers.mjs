// Downloads each doc's first-page cover from Drive into public/doc-covers/ so the
// site never hotlinks Drive (Google throttles bursts of thumbnail requests).
// Existing files are kept. Runs before every build; safe to run by hand.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../src/data/docs.ts", import.meta.url), "utf8");
const entries = [...source.matchAll(/slug:\s*"([^"]+)"[\s\S]*?driveId:\s*"([^"]+)"/g)];
const outDir = new URL("../public/doc-covers/", import.meta.url);
mkdirSync(outDir, { recursive: true });

// file suffix → Google image size (`-rj` = JPEG)
const SIZES = { "": "w600-rj", "-sm": "w64-rj" };

let missing = 0;
for (const [, slug, driveId] of entries) {
  for (const [suffix, size] of Object.entries(SIZES)) {
    const file = new URL(`${slug}${suffix}.jpg`, outDir);
    if (existsSync(file)) continue;
    try {
      const res = await fetch(`https://lh3.googleusercontent.com/d/${driveId}=${size}`);
      if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) throw new Error(`HTTP ${res.status}`);
      writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      console.log(`✓ ${slug}${suffix}.jpg`);
    } catch (e) {
      console.warn(`✗ ${slug}${suffix}.jpg — ${e.message}`);
      missing++;
    }
  }
}

if (missing) console.warn(`${missing} cover(s) missing; those docs show a placeholder icon.`);
