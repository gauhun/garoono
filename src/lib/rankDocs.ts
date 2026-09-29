import { ageInDays, type SharedDoc } from "../data/docs";

export type DocStats = { views: number; downloads: number; likes: number };
export type SortKey = "top" | "latest" | "liked" | "downloaded";

export const EMPTY_STATS: DocStats = { views: 0, downloads: 0, likes: 0 };

// Engagement decays with age so fresh docs surface, but a doc people keep
// liking and downloading holds its place.
export function topScore(stats: DocStats, ageDays: number) {
  return (1 + 3 * stats.likes + 2 * stats.downloads + 0.5 * stats.views) / Math.pow(ageDays + 2, 0.8);
}

export function rankDocs(
  list: SharedDoc[],
  stats: Record<string, DocStats> | null,
  sort: SortKey,
  now = Date.now(),
): SharedDoc[] {
  const byDate = (a: SharedDoc, b: SharedDoc) => b.addedOn.localeCompare(a.addedOn);
  if (sort === "latest" || !stats) return [...list].sort(byDate);

  const s = (d: SharedDoc) => stats[d.slug] ?? EMPTY_STATS;
  const metric =
    sort === "top"
      ? (d: SharedDoc) => topScore(s(d), ageInDays(d, now))
      : sort === "liked"
        ? (d: SharedDoc) => s(d).likes
        : (d: SharedDoc) => s(d).downloads;

  return [...list].sort((a, b) => metric(b) - metric(a) || byDate(a, b));
}

// Visitors without Pro see the free docs first; order within each group is kept
export function freeFirst(list: SharedDoc[]) {
  return [...list.filter((d) => d.free), ...list.filter((d) => !d.free)];
}
