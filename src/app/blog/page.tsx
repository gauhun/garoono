import type { Metadata } from "next";
import Link from "next/link";
import BlogCover from "../../components/BlogCover";
import { getAllPosts } from "../../lib/blog";

export const metadata: Metadata = {
  title: "Blog · Gautam | Shipping apps solo, with real numbers",
  description:
    "Practical posts for people building apps next to a day job. App store SEO, first users, pricing, Flutter and AI tools, from 14 shipped apps and 100K+ users.",
  alternates: { canonical: "/blog/", types: { "application/rss+xml": "/blog/rss.xml" } },
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="blog-page">
      <Link href="/" className="docs-back">
        ← Gautam
      </Link>
      <header className="blog-header">
        <h1 className="font-serif docs-title">Blog</h1>
        <p className="docs-subtitle">Shipping apps solo, next to a day job. Real numbers, no fluff</p>
      </header>

      {posts.length === 0 ? (
        <p className="docs-empty">First post lands soon</p>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}/`} className="blog-card">
              <BlogCover slug={post.slug} title={post.title} className="blog-card-cover" />
              <div className="blog-card-body">
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <span className="font-mono">
                  {formatDate(post.date)} · {post.minutes} min read
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
