import Link from "next/link";

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="legal-page">
      <Link href="/" className="docs-back">
        ← Gautam
      </Link>
      <h1 className="font-serif docs-title">{title}</h1>
      <p className="legal-updated font-mono">Last updated {updated}</p>
      <div className="legal-body">{children}</div>
    </main>
  );
}
