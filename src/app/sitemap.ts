import type { MetadataRoute } from "next";
import { appPages } from "../data/appPages";
import { getAllPosts } from "../lib/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://garoono.in";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/docs/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog/`, changeFrequency: "daily", priority: 0.9 },
    ...getAllPosts().map((p) => ({ url: `${base}/blog/${p.slug}/`, lastModified: p.date, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...appPages.map((p) => ({ url: `${base}/apps/${p.slug}/`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${base}/privacy/`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms/`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
