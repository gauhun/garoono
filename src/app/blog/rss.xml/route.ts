import { getAllPosts } from "../../../lib/blog";

export const dynamic = "force-static";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = getAllPosts()
    .map(
      (p) => `    <item>
      <title>${escape(p.title)}</title>
      <link>https://garoono.in/blog/${p.slug}/</link>
      <guid>https://garoono.in/blog/${p.slug}/</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(p.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Garoono Blog</title>
    <link>https://garoono.in/blog/</link>
    <description>Shipping apps solo, next to a day job. Real numbers, no fluff</description>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
