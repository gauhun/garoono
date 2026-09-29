import { describe, expect, it } from "vitest";
import { lintPost } from "./blog-rules.mjs";

const meta = {
  title: "How to Get Your First 100 App Users",
  description: "What actually brought my first 100 users across 14 apps, with the channels ranked by effort and return for solo builders",
  date: "2026-09-30",
  keyword: "first 100 app users",
};

const words = (n: number) => Array.from({ length: n }, () => "word").join(" ");
const body = (text: string) => `## Section\n\n${text}\n\n${words(620)}\n`;
const rules = (issues: { rule: string }[]) => issues.map((i) => i.rule);

describe("lintPost", () => {
  it("passes a clean post", () => {
    expect(lintPost(meta, body("One idea per line\nNo full stops at the end\nQuestions are fine?"))).toEqual([]);
  });

  it("flags em and en dashes anywhere", () => {
    expect(rules(lintPost(meta, body("Ship fast — then iterate")))).toContain("no-dash");
    expect(rules(lintPost({ ...meta, title: "Ship fast – iterate" }, body("ok")))).toContain("no-dash");
  });

  it("flags sentences that end with a period", () => {
    expect(rules(lintPost(meta, body("This line ends with a period.")))).toContain("no-period");
    expect(rules(lintPost(meta, body("Two sentences. On one line")))).toContain("no-period");
  });

  it("allows periods inside decimals, domains and links", () => {
    const text = "Rated 4.8 on the store\nRead more on garoono.in\nSee [the guide](https://example.com/a.b)";
    expect(rules(lintPost(meta, body(text)))).not.toContain("no-period");
  });

  it("ignores code blocks and raw HTML", () => {
    const text = "```js\nconst a = 1.\n```\n<svg><text>Done.</text></svg>";
    expect(rules(lintPost(meta, body(text)))).not.toContain("no-period");
  });

  it("flags banned and AI-sounding phrases", () => {
    expect(rules(lintPost(meta, body("This is a game-changer")))).toContain("banned-phrase");
    expect(rules(lintPost(meta, body("Let us delve into it")))).toContain("banned-phrase");
  });

  it("requires a source link on lines with stats", () => {
    expect(rules(lintPost(meta, body("Retention drops 40% after day one")))).toContain("stat-needs-source");
    expect(rules(lintPost(meta, body("Retention drops 40% after day one ([Adjust](https://adjust.com))")))).not.toContain(
      "stat-needs-source",
    );
  });

  it("checks frontmatter and length", () => {
    expect(rules(lintPost({ ...meta, description: "Too short" }, body("ok")))).toContain("description-length");
    expect(rules(lintPost({ ...meta, keyword: "" }, body("ok")))).toContain("keyword");
    expect(rules(lintPost(meta, "## Tiny\n\nshort post\n"))).toContain("min-words");
    expect(rules(lintPost(meta, `${words(700)}\n`))).toContain("needs-h2");
  });
});
