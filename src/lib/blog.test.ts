import path from "node:path";
import { describe, expect, it } from "vitest";
import { faqOf, getAllPosts, getPost, readingMinutes } from "./blog";

const dir = path.join(__dirname, "__fixtures__/blog");

describe("blog loader", () => {
  it("lists posts newest first and skips underscore files", () => {
    expect(getAllPosts(dir).map((p) => p.slug)).toEqual(["newer-post", "older-post"]);
  });

  it("reads frontmatter", () => {
    const post = getPost("older-post", dir);
    expect(post?.title).toBe("Older Post");
    expect(post?.date).toBe("2026-09-01");
    expect(post?.relatedDoc).toBe("app-seo-playbook");
  });

  it("renders one sentence per line and opens external links in a new tab", () => {
    const html = getPost("older-post", dir)?.html ?? "";
    expect(html).toContain("First line<br>");
    expect(html).toContain('href="https://example.com" target="_blank" rel="noopener noreferrer"');
  });

  it("returns null for unknown slugs", () => expect(getPost("nope", dir)).toBeNull());

  it("estimates reading time", () => {
    expect(readingMinutes(Array.from({ length: 460 }, () => "w").join(" "))).toBe(2);
    expect(readingMinutes("short")).toBe(1);
  });

  it("reads the visible FAQ section as question and answer pairs", () => {
    const md = ["## Intro", "", "### Not a FAQ", "nope", "", "## FAQ", "", "### Is it free?", "Yes, see [the docs](/docs/)", "It costs **nothing**", "", "### Empty?", "", "## After", "x"].join("\n");
    expect(faqOf(md)).toEqual([{ question: "Is it free?", answer: "Yes, see the docs It costs nothing" }]);
    expect(faqOf("## Quick answers\n\n### Q?\nA")).toEqual([{ question: "Q?", answer: "A" }]);
    expect(faqOf("## Nothing here")).toEqual([]);
  });
});
