// Finds each app logo's primary colour for its landing page.
// `accent` is the logo colour (shapes, tints); `ink` is the same hue darkened until text on the
// page background passes WCAG AA (4.5:1), so light logos like yellow still give readable links.
// Usage: node scripts/logo-colors.mjs   → writes src/data/appColors.json
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const toHex = (r, g, b) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s, l };
}

function hslToRgb(h, s, l) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

// Most common colourful hue (20° buckets, weighted by saturation), averaged within the bucket
export function dominantColor(rgba) {
  const buckets = new Map();
  for (let i = 0; i < rgba.length; i += 4) {
    const [r, g, b, a] = [rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]];
    if (a < 200) continue;
    const { h, s, l } = rgbToHsl(r, g, b);
    if (s < 0.3 || l < 0.12 || l > 0.92) continue;
    const key = Math.floor(h / 20);
    const bucket = buckets.get(key) ?? { w: 0, r: 0, g: 0, b: 0 };
    bucket.w += s;
    bucket.r += r * s;
    bucket.g += g * s;
    bucket.b += b * s;
    buckets.set(key, bucket);
  }
  let best = null;
  for (const bucket of buckets.values()) if (!best || bucket.w > best.w) best = bucket;
  return best ? toHex(best.r / best.w, best.g / best.w, best.b / best.w) : null;
}

const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function inkFor(color, background = "#F8F6F1") {
  const hex = color.toLowerCase();
  if (contrast(hex, background) >= 4.5) return hex;
  const { h, s, l } = rgbToHsl(...hexToRgb(hex));
  for (let light = l; light > 0; light -= 0.02) {
    const candidate = toHex(...hslToRgb(h, s, light));
    if (contrast(candidate, background) >= 4.5) return candidate;
  }
  return "#1a1a1a";
}

// CLI: read every logo listed in products.ts and write src/data/appColors.json
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { default: sharp } = await import("sharp");
  const root = new URL("../", import.meta.url);
  const source = readFileSync(new URL("src/data/products.ts", root), "utf8");
  const apps = [...source.matchAll(/id:\s*(\d+),[\s\S]*?icon:\s*"([^"]+)"[\s\S]*?color:\s*"([^"]+)"/g)];

  const colors = {};
  for (const [, id, icon, fallback] of apps) {
    const { data } = await sharp(fileURLToPath(new URL(`public${icon}`, root)))
      .resize(64, 64, { fit: "inside" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const accent = dominantColor(data) ?? fallback.toLowerCase();
    colors[id] = { accent, ink: inkFor(accent) };
    console.log(`${icon.padEnd(36)} accent ${accent}  ink ${colors[id].ink}`);
  }
  writeFileSync(new URL("src/data/appColors.json", root), `${JSON.stringify(colors, null, 2)}\n`);
}
