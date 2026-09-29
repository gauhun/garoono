import { getLiteDb as getDb } from "./firebase";
import { EMPTY_STATS, type DocStats } from "./rankDocs";

// The only module that talks to Firestore. The SDK is imported on first use so
// pages that never count anything don't download it.

type Counter = keyof DocStats;

const COLLECTION = "docStats";

// Per-browser memory of what this visitor already counted (slug lists in localStorage)
function readSet(counter: Counter): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(`garoono.docs.${counter}`) ?? "[]"));
  } catch {
    return new Set();
  }
}

function writeSet(counter: Counter, set: Set<string>) {
  try {
    localStorage.setItem(`garoono.docs.${counter}`, JSON.stringify([...set]));
  } catch {
    // Storage blocked — this visitor may be counted again, which is acceptable
  }
}

async function bump(slug: string, counter: Counter, by: 1 | -1) {
  const db = await getDb();
  const { doc, increment, setDoc } = await import("firebase/firestore/lite");
  await setDoc(doc(db, COLLECTION, slug), { [counter]: increment(by) }, { merge: true });
}

function countOnce(slug: string, counter: "views" | "downloads") {
  const seen = readSet(counter);
  if (seen.has(slug)) return false;
  seen.add(slug);
  writeSet(counter, seen);
  bump(slug, counter, 1).catch(() => {
    // Forget it so a later click can retry
    const retry = readSet(counter);
    retry.delete(slug);
    writeSet(counter, retry);
  });
  return true;
}

export const recordView = (slug: string) => countOnce(slug, "views");
export const recordDownload = (slug: string) => countOnce(slug, "downloads");
export const isLiked = (slug: string) => readSet("likes").has(slug);

export async function toggleLike(slug: string): Promise<boolean> {
  const liked = readSet("likes");
  const next = !liked.has(slug);
  try {
    await bump(slug, "likes", next ? 1 : -1);
  } catch (e) {
    // An unlike the server refuses (count already 0) shouldn't leave the button stuck on
    if (next) throw e;
  }
  if (next) liked.add(slug);
  else liked.delete(slug);
  writeSet("likes", liked);
  return next;
}

export async function fetchAllStats(): Promise<Record<string, DocStats>> {
  const db = await getDb();
  const { collection, getDocs } = await import("firebase/firestore/lite");
  const snap = await getDocs(collection(db, COLLECTION));
  const out: Record<string, DocStats> = {};
  snap.forEach((d) => {
    const data = d.data();
    out[d.id] = {
      views: data.views ?? EMPTY_STATS.views,
      downloads: data.downloads ?? EMPTY_STATS.downloads,
      likes: data.likes ?? EMPTY_STATS.likes,
    };
  });
  return out;
}
