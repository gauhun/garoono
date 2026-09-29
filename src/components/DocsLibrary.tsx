"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { docs } from "../data/docs";
import { fetchAllStats } from "../lib/docStats";
import { EMPTY_STATS, rankDocs, type DocStats, type SortKey } from "../lib/rankDocs";
import { checkoutUrl } from "../lib/checkout";
import { useAccess } from "../lib/useAccess";
import { AuthChip, UnlockBanner } from "./AccessPanel";
import DocCard from "./DocCard";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "latest", label: "Latest" },
  { key: "liked", label: "Most liked" },
  { key: "downloaded", label: "Most downloaded" },
];

type StatsMap = Record<string, DocStats>;

export default function DocsLibrary() {
  const [sort, setSort] = useState<SortKey>("top");
  // `ranking` is the snapshot we sort by; `live` also reflects this visitor's
  // clicks, so a card doesn't jump away from under the cursor when liked.
  const [ranking, setRanking] = useState<StatsMap | null>(null);
  const [live, setLive] = useState<StatsMap | null>(null);

  useEffect(() => {
    fetchAllStats()
      .then((stats) => {
        setRanking(stats);
        setLive(stats);
      })
      .catch((e) => console.error("Doc stats unavailable", e));
  }, []);

  const ranked = useMemo(() => rankDocs(docs, ranking, sort), [ranking, sort]);

  const onCount = (slug: string, counter: keyof DocStats, by: number) =>
    setLive((prev) => {
      if (!prev) return prev;
      const cur = prev[slug] ?? EMPTY_STATS;
      return { ...prev, [slug]: { ...cur, [counter]: Math.max(0, cur[counter] + by) } };
    });

  const access = useAccess();
  const buy = () => {
    window.location.href = checkoutUrl({
      returnUrl: `${window.location.origin}/docs/`,
      email: access.user?.email,
      uid: access.user?.uid,
    });
  };

  return (
    <div className="docs-page">
      <Link href="/" className="docs-back">
        ← Gautam
      </Link>

      <header className="docs-header">
        <div>
          <h1 className="font-serif docs-title">Docs</h1>
          <p className="docs-subtitle">Playbooks &amp; checklists I share on Instagram</p>
        </div>
        <AuthChip access={access} />
      </header>

      <UnlockBanner access={access} onBuy={buy} />

      <div className="docs-tabs" role="tablist" aria-label="Sort docs">
        {SORTS.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={sort === s.key}
            className={`docs-tab ${sort === s.key ? "is-active" : ""}`}
            onClick={() => setSort(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="docs-grid">
        {ranked.map((d, i) => (
          <DocCard
            key={d.slug}
            doc={d}
            index={i}
            stats={live ? (live[d.slug] ?? EMPTY_STATS) : null}
            onCount={onCount}
            locked={!d.free && !access.lifetime}
            onBuy={buy}
          />
        ))}
      </div>
    </div>
  );
}
