import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import previews from "./docPreviews.json";
import { docs, freePdfUrl, isNew, latestDocs, previewOf, previewPageUrl, previewTeaserUrl, thumbUrl, type SharedDoc } from "./docs";

const make = (slug: string, addedOn: string): SharedDoc => ({ slug, title: slug, blurb: "", free: true, addedOn });

const pub = (url: string) => path.join(process.cwd(), "public", url);

// Every file under public/, as site paths ("/free-docs/abc.pdf")
function publicFiles(dir = pub("/")): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? publicFiles(path.join(dir, e.name)) : ["/" + path.relative(pub("/"), path.join(dir, e.name))],
  );
}

describe("docs list", () => {
  it("has unique slugs the Firestore rules accept", () => {
    const slugs = docs.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]{3,60}$/);
  });

  it("shows every page of a free doc and serves its PDF from the site", () => {
    for (const doc of docs.filter((d) => d.free)) {
      const preview = previewOf(doc);
      expect(preview, `${doc.slug}: run npm run add-doc`).not.toBeNull();
      if (!preview) continue;
      expect(preview.shown).toBe(preview.pages);
      for (let page = 1; page <= preview.pages; page++) expect(existsSync(pub(previewPageUrl(doc, page))), `${doc.slug} page ${page}`).toBe(true);
      expect(existsSync(pub(freePdfUrl(doc))), `${doc.slug} PDF`).toBe(true);
    }
  });

  it("shows at most 30% of a paid doc and keeps the rest private", () => {
    for (const doc of docs.filter((d) => !d.free)) {
      const preview = previewOf(doc);
      expect(preview, `${doc.slug}: run npm run add-doc`).not.toBeNull();
      if (!preview) continue;
      expect(preview.shown).toBeGreaterThanOrEqual(1);
      expect(preview.shown).toBeLessThan(preview.pages);
      expect(preview.shown).toBeLessThanOrEqual(Math.ceil(preview.pages * 0.3));
      for (let page = 1; page <= preview.shown; page++) expect(existsSync(pub(previewPageUrl(doc, page))), `${doc.slug} page ${page}`).toBe(true);
      expect(existsSync(pub(previewPageUrl(doc, preview.shown + 1))), `${doc.slug} leaks a locked page`).toBe(false);
      expect(existsSync(pub(previewTeaserUrl(doc)))).toBe(true);
    }
  });

  it("never puts a paid PDF on the site", () => {
    const allowed = docs.filter((d) => d.free).map(freePdfUrl);
    const pdfs = publicFiles().filter((f) => f.toLowerCase().endsWith(".pdf"));
    expect(pdfs.filter((f) => !allowed.includes(f))).toEqual([]);
  });

  it("ships a WebP cover for every doc", () => {
    for (const doc of docs) {
      for (const size of ["lg", "sm"] as const) expect(existsSync(pub(thumbUrl(doc, size))), `${doc.slug} ${size}: run npm run add-doc`).toBe(true);
    }
  });

  it("leaves no files behind for docs that are gone", () => {
    const slugs = new Set(docs.map((d) => d.slug));
    expect(Object.keys(previews).filter((s) => !slugs.has(s))).toEqual([]);
    expect(readdirSync(pub("/doc-previews")).filter((s) => !slugs.has(s))).toEqual([]);
    const covers = new Set(docs.flatMap((d) => [thumbUrl(d, "lg"), thumbUrl(d, "sm")]));
    expect(readdirSync(pub("/doc-covers")).map((f) => `/doc-covers/${f}`).filter((f) => !covers.has(f))).toEqual([]);
  });

  it("keeps exactly the chosen docs free", () => {
    expect(docs.filter((d) => d.free).map((d) => d.slug).sort()).toEqual([
      "failed-payments-win-back",
      "steal-competitor-keywords",
      "will-your-app-get-rejected-audit",
    ]);
  });

  it("has parseable dates", () => {
    for (const d of docs) expect(Number.isNaN(Date.parse(d.addedOn))).toBe(false);
  });
});

describe("doc urls", () => {
  const d = make("abc", "2026-09-29");
  it("builds the free PDF, cover and page links", () => {
    expect(freePdfUrl(d)).toBe("/free-docs/abc.pdf");
    expect(thumbUrl(d)).toBe("/doc-covers/abc.webp");
    expect(thumbUrl(d, "sm")).toBe("/doc-covers/abc-sm.webp");
    expect(previewPageUrl(d, 2)).toBe("/doc-previews/abc/2.webp");
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
