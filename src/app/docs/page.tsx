import type { Metadata } from "next";
import DocsLibrary from "../../components/DocsLibrary";

export const metadata: Metadata = {
  title: "Docs — Gautam | Playbooks & checklists for indie app makers",
  description:
    "Playbooks & checklists I share on Instagram — app launch guides, app store SEO, security and legal checklists for indie app makers.",
  alternates: { canonical: "/docs/" },
};

export default function DocsPage() {
  return <DocsLibrary />;
}
