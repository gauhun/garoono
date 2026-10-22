import type { MetadataRoute } from "next";
import { appPages } from "../data/appPages";
import { docs } from "../data/docs";
import { getAllPosts } from "../lib/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://garoono.in";
  const today = new Date().toISOString().slice(0, 10); // undated pages: the build date, like usegetup.com
  const posts = getAllPosts();
  const newestDoc = docs.map((d) => d.addedOn).sort().at(-1) ?? today;
  return [
    { url: `${base}/`, lastModified: today, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/docs/`, lastModified: newestDoc, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog/`, lastModified: posts[0]?.date ?? today, changeFrequency: "daily", priority: 0.9 },
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}/`, lastModified: p.date, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...appPages.map((p) => ({ url: `${base}/apps/${p.slug}/`, lastModified: today, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${base}/privacy/`, lastModified: today, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms/`, lastModified: today, changeFrequency: "yearly", priority: 0.2 },
  ];
}
