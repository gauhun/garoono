import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";

// Posts are Markdown files in content/blog, read at build time only (never shipped to the browser)
const POSTS_DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  keyword: string;
  tags: string[];
  relatedDoc: string | null; // docs.ts slug to promote inside the post
  minutes: number;
};

export type Post = PostMeta & { html: string };

// One sentence per line, so single line breaks become <br>
const marked = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href) && !href.startsWith("https://garoono.in");
      const titleAttr = title ? ` title="${title}"` : "";
      return external
        ? `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
        : `<a href="${href}"${titleAttr}>${text}</a>`;
    },
  },
});

export function readingMinutes(markdown: string) {
  const words = markdown.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

const isoDate = (value: unknown) => (value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? ""));

function readPost(slug: string, dir: string): Post | null {
  const file = path.join(dir, `${slug}.md`);
  if (!/^[a-z0-9-]+$/.test(slug) || !existsSync(file)) return null;
  const { data, content } = matter(readFileSync(file, "utf8"));
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: isoDate(data.date),
    keyword: String(data.keyword ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    relatedDoc: typeof data.relatedDoc === "string" ? data.relatedDoc : null,
    minutes: readingMinutes(content),
    html: marked.parse(content, { async: false }),
  };
}

export function getAllPosts(dir = POSTS_DIR): PostMeta[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => readPost(f.slice(0, -3), dir))
    .filter((p): p is Post => p !== null)
    .map((p): PostMeta => ({ ...p, html: undefined }) as PostMeta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string, dir = POSTS_DIR): Post | null {
  return readPost(slug, dir);
}
