"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { docs, isNew, latestDocs, thumbUrl } from "../data/docs";

const items = latestDocs(docs, 10);

export default function DocsMarquee() {
  // "NEW" depends on today's date, so decide it after hydration
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  return (
    <div className="docs-marquee">
      <Link href="/blog/" className="doc-chip doc-chip-blog">
        📝 Blog
      </Link>
      <div className="docs-marquee-viewport">
        {/* Two copies of the chips so the -50% loop is seamless */}
        <div className="docs-marquee-track">
          {[0, 1].map((copy) =>
            items.map((d) => (
              <a
                key={`${copy}-${d.slug}`}
                href={`/docs/#${d.slug}`}
                className="doc-chip"
                aria-hidden={copy === 1 || undefined}
                tabIndex={copy === 1 ? -1 : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumbUrl(d, "sm")} alt="" width={20} height={20} className="doc-chip-thumb" loading="lazy" />
                <span>{d.title}</span>
                {!d.free && (
                  <span className="doc-chip-lock" aria-label="Lifetime access">
                    🔒
                  </span>
                )}
                {now !== null && isNew(d, now) && <span className="doc-chip-new" aria-label="New" />}
              </a>
            )),
          )}
        </div>
      </div>
      <Link href="/docs/" className="doc-chip doc-chip-all">
        View all docs →
      </Link>
    </div>
  );
}
