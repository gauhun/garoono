// Makes small WebP copies of the app logos, so pages never ship the large originals:
//   public/logos/<name>.png|jpg → public/logos/web/<name>.webp (264px, sharp at 88px on 3x screens)
// Doc covers are made as WebP by `npm run add-doc`. Existing outputs are kept.
// Runs before every build; safe to run by hand.
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import sharp from "sharp";

const jobs = [];

mkdirSync("public/logos/web", { recursive: true });
for (const file of readdirSync("public/logos")) {
  const m = file.match(/^(.+)\.(png|jpe?g)$/i);
  if (!m) continue;
  const out = `public/logos/web/${m[1]}.webp`;
  if (existsSync(out)) continue;
  jobs.push(sharp(`public/logos/${file}`).resize(264, 264, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(out).then(() => out));
}

for (const out of await Promise.all(jobs)) console.log(`✓ ${out}`);
