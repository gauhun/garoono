import { describe, expect, it } from "vitest";
import { contrast, dominantColor, inkFor } from "./logo-colors.mjs";

// Builds an RGBA buffer from [r,g,b,a,count] runs
const pixels = (...runs: [number, number, number, number, number][]) =>
  Uint8Array.from(runs.flatMap(([r, g, b, a, n]) => Array.from({ length: n }, () => [r, g, b, a]).flat()));

describe("dominantColor", () => {
  it("picks the main colourful hue and ignores white, black and grey", () => {
    const buf = pixels([255, 255, 255, 255, 500], [20, 20, 20, 255, 300], [128, 128, 128, 255, 300], [249, 115, 22, 255, 200], [37, 99, 235, 255, 50]);
    expect(dominantColor(buf)).toBe("#f97316");
  });

  it("ignores transparent pixels", () => {
    const buf = pixels([37, 99, 235, 0, 900], [220, 38, 38, 255, 100]);
    expect(dominantColor(buf)).toBe("#dc2626");
  });

  it("returns null for a logo with no colourful pixels", () => {
    expect(dominantColor(pixels([255, 255, 255, 255, 100], [0, 0, 0, 255, 100]))).toBeNull();
  });
});

describe("inkFor", () => {
  const page = "#F8F6F1";
  it("keeps a colour that is already readable", () => {
    expect(inkFor("#1d4ed8", page)).toBe("#1d4ed8");
  });
  it("darkens light colours until text passes WCAG AA", () => {
    const ink = inkFor("#facc15", page);
    expect(contrast(ink, page)).toBeGreaterThanOrEqual(4.5);
    expect(ink).not.toBe("#facc15");
  });
});
