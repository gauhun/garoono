import { describe, expect, it } from "vitest";
import type { FreeDoc, SharedDoc } from "../data/docs";
import { freeFirst, rankDocs, type DocStats } from "./rankDocs";

const make = (slug: string, addedOn: string): FreeDoc => ({ slug, title: slug, blurb: "", free: true, driveId: slug, addedOn });
const stat = (s: Partial<DocStats>): DocStats => ({ views: 0, downloads: 0, likes: 0, ...s });

const now = Date.parse("2026-09-29T00:00:00Z");
const oldDoc = make("old-doc", "2026-08-30"); // 30 days
const midDoc = make("mid-doc", "2026-09-19"); // 10 days
const newDoc = make("new-doc", "2026-09-29"); // 0 days
const list = [oldDoc, newDoc, midDoc];
const slugs = (docs: SharedDoc[]) => docs.map((d) => d.slug);

describe("rankDocs", () => {
  it("latest: newest first", () => {
    expect(slugs(rankDocs(list, {}, "latest", now))).toEqual(["new-doc", "mid-doc", "old-doc"]);
  });

  it("falls back to latest while stats are loading", () => {
    expect(slugs(rankDocs(list, null, "top", now))).toEqual(["new-doc", "mid-doc", "old-doc"]);
  });

  it("top: with no engagement, newer ranks higher", () => {
    expect(slugs(rankDocs(list, {}, "top", now))).toEqual(["new-doc", "mid-doc", "old-doc"]);
  });

  it("top: strong engagement lifts an older doc above an untouched new one", () => {
    const stats = { "old-doc": stat({ likes: 10, downloads: 5, views: 20 }) };
    expect(rankDocs(list, stats, "top", now)[0].slug).toBe("old-doc");
  });

  it("top: a new doc with a little engagement beats an old one with slightly more", () => {
    const stats = { "new-doc": stat({ likes: 2 }), "old-doc": stat({ likes: 3 }) };
    expect(rankDocs(list, stats, "top", now)[0].slug).toBe("new-doc");
  });

  it("liked: by likes, ties broken by date", () => {
    const stats = { "old-doc": stat({ likes: 5 }), "mid-doc": stat({ likes: 5 }) };
    expect(slugs(rankDocs(list, stats, "liked", now))).toEqual(["mid-doc", "old-doc", "new-doc"]);
  });

  it("downloaded: by downloads", () => {
    const stats = { "old-doc": stat({ downloads: 9 }), "new-doc": stat({ downloads: 1 }) };
    expect(slugs(rankDocs(list, stats, "downloaded", now))).toEqual(["old-doc", "new-doc", "mid-doc"]);
  });

  it("does not mutate the input", () => {
    rankDocs(list, {}, "latest", now);
    expect(slugs(list)).toEqual(["old-doc", "new-doc", "mid-doc"]);
  });
});

describe("freeFirst", () => {
  it("moves free docs to the front and keeps relative order", () => {
    const paid = (slug: string): SharedDoc => ({ slug, title: slug, blurb: "", free: false, addedOn: "2026-09-01" });
    const order = [paid("p1"), make("f1", "2026-09-01"), paid("p2"), make("f2", "2026-09-01")];
    expect(slugs(freeFirst(order))).toEqual(["f1", "f2", "p1", "p2"]);
  });
});
