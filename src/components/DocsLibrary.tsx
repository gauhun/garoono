"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { docs } from "../data/docs";
import { fetchAllStats } from "../lib/docStats";
import { EMPTY_STATS, freeFirst, rankDocs, searchDocs, type DocStats, type SortKey } from "../lib/rankDocs";
import { checkoutUrl } from "../lib/checkout";
import { useAccess } from "../lib/useAccess";
import { AuthChip, UnlockBanner } from "./AccessPanel";
import AppRails from "./AppRails";
import DocCard from "./DocCard";
import { ProCountPill, ProRail, RAIL_SIZE, useProWall } from "./ProWall";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "latest", label: "Latest" },
  { key: "liked", label: "Most liked" },
  { key: "downloaded", label: "Most downloaded" },
];

type StatsMap = Record<string, DocStats>;

export default function DocsLibrary() {
  const [sort, setSort] = useState<SortKey>("top");
  const [query, setQuery] = useState("");
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
  // Without Pro, the free docs lead the list
  const shown = searchDocs(access.lifetime ? ranked : freeFirst(ranked), query);
  const { summary: pro } = useProWall(access.lifetime);
  const members = pro?.members ?? [];
  const buy = () => {
    window.location.href = checkoutUrl({
      returnUrl: `${window.location.origin}/docs/`,
      email: access.user?.email,
      uid: access.user?.uid,
    });
  };

  return (
    <>
      <AppRails barsOnly />
    <div className={`docs-shell with-app-bars ${members.length > RAIL_SIZE ? "has-left" : ""} ${members.length > 0 ? "has-right" : ""}`}>
      <ProRail members={members.slice(RAIL_SIZE, RAIL_SIZE * 2)} offset={RAIL_SIZE} />
    <div className="docs-page">
      <Link href="/" className="docs-back">
        ← Gautam
      </Link>

      <header className="docs-header">
        <div>
          <h1 className="font-serif docs-title">Docs</h1>
          <p className="docs-subtitle">Playbooks &amp; checklists I share on Instagram</p>
        </div>
        <div className="docs-header-actions">
          {access.lifetime && <span className="pro-badge">★ You&apos;re Pro</span>}
          <ProCountPill summary={pro} />
          <AuthChip access={access} />
        </div>
      </header>

      <UnlockBanner access={access} onBuy={buy} />

      <div className="docs-toolbar">
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
        <input
          type="search"
          className="docs-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search docs…"
          aria-label="Search docs"
        />
      </div>

      {shown.length === 0 && <p className="docs-empty">No docs match &quot;{query}&quot;. Try another word.</p>}

      <div className="docs-grid">
        {shown.map((d, i) => (
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
      <ProRail members={members.slice(0, RAIL_SIZE)} offset={0} />
    </div>
    </>
  );
}
