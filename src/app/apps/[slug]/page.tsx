import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import AppLanding from "../../../components/apps/AppLanding";
import { appPageBySlug, appPages } from "../../../data/appPages";
import { products } from "../../../data/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return appPages.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = appPageBySlug((await params).slug);
  if (!page) return {};
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: `/apps/${page.slug}/` },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url: `/apps/${page.slug}/`,
      images: [{ url: page.screenshots[0], width: 720, height: 1559 }],
    },
  };
}

export default async function AppPageRoute({ params }: Params) {
  const page = appPageBySlug((await params).slug);
  const product = page && products.find((p) => p.id === page.productId);
  if (!page || !product) notFound();

  // Drawn at build time, so visitors download an SVG and no QR library
  const qrSvg = await QRCode.toString(`https://garoono.in/apps/${page.slug}/`, {
    type: "svg",
    margin: 0,
    color: { dark: "#1A1A1A", light: "#FFFFFF00" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: page.seoDescription,
    operatingSystem: page.appStoreUrl ? "Android, iOS" : "Android",
    applicationCategory: page.category,
    url: `https://garoono.in/apps/${page.slug}/`,
    image: `https://garoono.in${product.icon}`,
    screenshot: page.screenshots.map((s) => `https://garoono.in${s}`),
    author: { "@type": "Person", name: "Gautam Singh Rathor", url: "https://garoono.in" },
    sameAs: [page.playUrl, page.appStoreUrl, page.websiteUrl].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AppLanding page={page} product={product} others={products.filter((p) => p.id !== product.id)} qrSvg={qrSvg} />
    </>
  );
}
