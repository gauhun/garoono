import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { docs, downloadUrl, isNew, latestDocs, previewOf, previewPageUrl, previewTeaserUrl, thumbUrl, viewUrl, type FreeDoc } from "./docs";

const make = (slug: string, addedOn: string): FreeDoc => ({
  slug,
  title: slug,
  blurb: "",
  free: true,
  driveId: `id-${slug}`,
  addedOn,
});

describe("docs list", () => {
  it("has unique slugs the Firestore rules accept", () => {
    const slugs = docs.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]{3,60}$/);
  });

  it("ships a free preview for every paid doc that keeps some pages locked", () => {
    const pub = (url: string) => path.join(process.cwd(), "public", url);
    for (const doc of docs.filter((d) => !d.free)) {
      const preview = previewOf(doc);
      expect(preview, `${doc.slug}: run npm run previews`).not.toBeNull();
      if (!preview) continue;
      expect(preview.shown).toBeGreaterThanOrEqual(1);
      expect(preview.shown).toBeLessThan(preview.pages);
      expect(preview.shown).toBeLessThanOrEqual(Math.ceil(preview.pages * 0.3));
      for (let page = 1; page <= preview.shown; page++) expect(existsSync(pub(previewPageUrl(doc, page))), `${doc.slug} page ${page}`).toBe(true);
      expect(existsSync(pub(previewPageUrl(doc, preview.shown + 1))), `${doc.slug} leaks a locked page`).toBe(false);
      expect(existsSync(pub(previewTeaserUrl(doc)))).toBe(true);
    }
  });

  it("ships a WebP cover for every doc", () => {
    for (const doc of docs) {
      for (const size of ["lg", "sm"] as const) expect(existsSync(path.join(process.cwd(), "public", thumbUrl(doc, size))), `${doc.slug} ${size}: run npm run web-images`).toBe(true);
    }
  });

  it("keeps exactly the chosen docs free", () => {
    expect(docs.filter((d) => d.free).map((d) => d.slug).sort()).toEqual([
      "app-store-launch-guide",
      "failed-payments-win-back",
      "legal-checklist-before-you-submit",
      "steal-competitor-keywords",
      "will-your-app-get-rejected-audit",
      "zero-budget-ways-to-get-users",
    ]);
  });

  it("has parseable dates", () => {
    for (const d of docs) expect(Number.isNaN(Date.parse(d.addedOn))).toBe(false);
  });
});

describe("drive urls", () => {
  const d = make("abc", "2026-09-29");
  it("builds view, download and thumbnail links", () => {
    expect(viewUrl(d)).toBe("https://drive.google.com/file/d/id-abc/view");
    expect(downloadUrl(d)).toBe("https://drive.google.com/uc?export=download&id=id-abc");
    expect(thumbUrl(d)).toBe("/doc-covers/abc.webp");
    expect(thumbUrl(d, "sm")).toBe("/doc-covers/abc-sm.webp");
  });
});

describe("latestDocs", () => {
  const list = [make("aaa", "2026-09-01"), make("ccc", "2026-09-20"), make("bbb", "2026-09-10")];
  it("sorts newest first without mutating the input", () => {
    expect(latestDocs(list).map((d) => d.slug)).toEqual(["ccc", "bbb", "aaa"]);
    expect(list.map((d) => d.slug)).toEqual(["aaa", "ccc", "bbb"]);
  });
  it("limits the result", () => {
    expect(latestDocs(list, 2).map((d) => d.slug)).toEqual(["ccc", "bbb"]);
  });
});

describe("isNew", () => {
  const now = Date.parse("2026-09-29T12:00:00Z");
  it("is true within 7 days and false after", () => {
    expect(isNew(make("aaa", "2026-09-23"), now)).toBe(true);
    expect(isNew(make("bbb", "2026-09-20"), now)).toBe(false);
  });
});
