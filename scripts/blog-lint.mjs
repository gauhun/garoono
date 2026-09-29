// Checks every post in content/blog against the house style. Exits 1 on any issue.
// Usage: npm run blog:lint [-- content/blog/one-post.md]
import { readdirSync, readFileSync } from "node:fs";
import matter from "gray-matter";
import { lintPost } from "./blog-rules.mjs";

const dir = new URL("../content/blog/", import.meta.url);
const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      .map((f) => new URL(f, dir).pathname);

let failed = 0;
for (const file of files) {
  const { data, content } = matter(readFileSync(file, "utf8"));
  const issues = lintPost(data, content);
  if (issues.length === 0) continue;
  failed++;
  console.error(`\n✗ ${file}`);
  for (const i of issues) console.error(`  ${i.line ? `line ${i.line}: ` : ""}[${i.rule}] ${i.message}`);
}

if (failed) {
  console.error(`\n${failed} post(s) break the house style`);
  process.exit(1);
}
console.log(`✓ ${files.length} post(s) pass the house style`);
