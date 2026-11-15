import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { appPageBySlug, appPath, legacyAppSlugs } from "../../data/appPages";
import { products } from "../../data/products";
import AppLanding from "./AppLanding";

// Shared with routes that give an app its own top-level URL (garoono.in/glowmetry/)
export function appMetadata(slug: string): Metadata {
  const moved = legacyAppSlugs[slug];
  if (moved)
    return {
      robots: { index: false },
      alternates: { canonical: `/apps/${moved}/` },
    };
  const page = appPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: appPath(page) },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url: appPath(page),
      images: [{ url: page.screenshots[0], width: 720, height: 1559 }],
    },
  };
}

export async function renderAppPage(slug: string) {
  const page = appPageBySlug(slug);
  const product = page && products.find((p) => p.id === page.productId);
  if (!page || !product) notFound();

  // Drawn at build time, so visitors download an SVG and no QR library
  const qrSvg = await QRCode.toString(`https://garoono.in${appPath(page)}`, {
    type: "svg",
    margin: 0,
    color: { dark: "#1A1A1A", light: "#FFFFFF00" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: product.name,
    description: page.seoDescription,
    operatingSystem: page.appStoreUrl ? "Android, iOS" : "Android",
    applicationCategory: page.category,
    url: `https://garoono.in${appPath(page)}`,
    image: `https://garoono.in${product.icon}`,
    screenshot: page.screenshots.map((s) => `https://garoono.in${s}`),
    author: {
      "@type": "Person",
      name: "Gautam Singh Rathor",
      url: "https://garoono.in",
    },
    installUrl: [page.appStoreUrl, page.playUrl].filter(Boolean),
    sameAs: [page.playUrl, page.appStoreUrl, page.websiteUrl].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLanding
        page={page}
        product={product}
        others={products.filter((p) => p.id !== product.id)}
        qrSvg={qrSvg}
      />
    </>
  );
}
