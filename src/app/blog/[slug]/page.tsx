import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCover from "../../../components/BlogCover";
import { docs } from "../../../data/docs";
import { getAllPosts, getPost } from "../../../lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} · Garoono`,
    description: post.description,
    keywords: [post.keyword, ...post.tags],
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}/`,
      publishedTime: post.date,
      authors: ["Gautam Singh Rathor"],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default async function BlogPost({ params }: Params) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const related = post.relatedDoc ? docs.find((d) => d.slug === post.relatedDoc) : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: [post.keyword, ...post.tags].join(", "),
    mainEntityOfPage: `https://garoono.in/blog/${post.slug}/`,
    author: { "@type": "Person", name: "Gautam Singh Rathor", url: "https://garoono.in" },
    publisher: { "@type": "Person", name: "Gautam Singh Rathor", url: "https://garoono.in" },
  };

  return (
    <main className="blog-page blog-post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/blog/" className="docs-back">
        ← Blog
      </Link>

      <article>
        <header className="post-header">
          <p className="post-meta font-mono">
            {formatDate(post.date)} · {post.minutes} min read
          </p>
          <h1 className="font-serif post-title">{post.title}</h1>
          <p className="post-lede">{post.description}</p>
        </header>

        <BlogCover slug={post.slug} title={post.title} className="post-cover" />

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      {related && (
        <Link href={`/docs/#${related.slug}`} className="post-related">
          <span className="post-related-label">Related doc</span>
          <strong>{related.title}</strong>
          <span>{related.blurb}</span>
        </Link>
      )}

      <aside className="post-cta">
        <div>
          <strong>Grab the playbooks I share on Instagram</strong>
          <span>Launch guides, app store SEO, security and legal checklists for solo builders</span>
        </div>
        <Link href="/docs/" className="doc-btn doc-btn-primary">
          See the docs
        </Link>
      </aside>

      <footer className="post-author">
        <p>
          Written by <strong>Gautam</strong>, senior engineer by day and indie app maker by night. 14 apps shipped, 100K+ users
        </p>
      </footer>
    </main>
  );
}
