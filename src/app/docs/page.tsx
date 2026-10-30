import type { Metadata } from "next";
import DocsLibrary from "../../components/DocsLibrary";

export const metadata: Metadata = {
  title: "Docs · Gautam | Playbooks & checklists for indie app makers",
  description:
    "Playbooks & checklists I share on Instagram — app launch guides, app store SEO, security and legal checklists for indie app makers.",
  alternates: { canonical: "/docs/" },
  // Page-level openGraph replaces the layout's whole block, so it repeats siteName and type
  openGraph: {
    title: "Playbooks to ship your app | Garoono",
    description: "What I learned building 14 apps, as short PDFs you can read in one sitting",
    url: "https://garoono.in/docs/",
    siteName: "Garoono",
    type: "website",
    images: [{ url: "/og-docs.jpg", width: 1200, height: 630, alt: "Garoono docs: playbooks for indie app makers" }],
  },
  twitter: { card: "summary_large_image", site: "@xgaroono", title: "Playbooks to ship your app | Garoono", description: "What I learned building 14 apps, as short PDFs you can read in one sitting", images: ["/og-docs.jpg"] },
};

export default function DocsPage() {
  return <DocsLibrary />;
}
