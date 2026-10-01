import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { appPages } from "./appPages";
import { products } from "./products";

// Store-copy rules: no em/en dashes, no full stop at the end of a line
const copyOf = (p: (typeof appPages)[number]) => [
  p.tagline,
  ...p.problem,
  ...p.result,
  ...p.steps.flatMap((s) => [s.title, s.text]),
  ...p.benefits.flatMap((b) => [b.title, b.text]),
  p.seoTitle,
  p.seoDescription,
];

describe("app pages", () => {
  it("have unique slugs that match a product linking to the page", () => {
    expect(new Set(appPages.map((p) => p.slug)).size).toBe(appPages.length);
    for (const page of appPages) {
      const product = products.find((x) => x.id === page.productId);
      expect(product, page.slug).toBeDefined();
      expect(product?.link).toBe(`/apps/${page.slug}/`);
    }
  });

  it("link to Google Play, and to the App Store and website when they exist", () => {
    for (const page of appPages) {
      expect(page.playUrl).toMatch(/^https:\/\/play\.google\.com\/store\/apps\/details\?id=/);
      if (page.appStoreUrl) expect(page.appStoreUrl).toMatch(/^https:\/\/apps\.apple\.com\/[a-z]{2}\/app\/[a-z0-9-]+\/id\d+$/);
      if (page.websiteUrl) expect(page.websiteUrl).toMatch(/^https:\/\//);
    }
  });

  it("cover every app on the home page", () => {
    expect(appPages.map((p) => p.productId).sort((a, b) => a - b)).toEqual(products.map((p) => p.id).sort((a, b) => a - b));
  });

  it("ship their screenshots", () => {
    for (const page of appPages) {
      expect(page.screenshots.length).toBeGreaterThanOrEqual(3);
      for (const shot of page.screenshots) expect(existsSync(path.join(process.cwd(), "public", shot)), shot).toBe(true);
    }
  });

  it("have 3 steps and 4 to 6 benefits", () => {
    for (const page of appPages) {
      expect(page.steps).toHaveLength(3);
      expect(page.benefits.length).toBeGreaterThanOrEqual(4);
      expect(page.benefits.length).toBeLessThanOrEqual(6);
    }
  });

  it("follow the store copy rules", () => {
    for (const page of appPages) {
      for (const line of copyOf(page)) {
        expect(line, `${page.slug}: ${line}`).not.toMatch(/[–—]/);
        expect(line, `${page.slug}: ${line}`).not.toMatch(/\.\s*$/);
      }
    }
  });
});
