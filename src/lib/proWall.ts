import { getLiteDb } from "./firebase";

export type ProMember = { uid: string; name: string; photoURL: string | null; joinedAt: number | null };
export type ProSummary = { count: number; members: ProMember[] };

export async function fetchProSummary(limitTo = 30): Promise<ProSummary> {
  const [db, fs] = await Promise.all([getLiteDb(), import("firebase/firestore/lite")]);
  const [countSnap, wallSnap] = await Promise.all([
    fs.getDoc(fs.doc(db, "publicStats", "pro")),
    fs.getDocs(fs.query(fs.collection(db, "proWall"), fs.orderBy("joinedAt", "desc"), fs.limit(limitTo))),
  ]);
  return {
    count: Number(countSnap.data()?.count ?? 0),
    members: wallSnap.docs.map((d) => {
      const data = d.data();
      return {
        uid: d.id,
        name: String(data.name ?? "Pro member"),
        photoURL: (data.photoURL as string | null) ?? null,
        joinedAt: typeof data.joinedAt?.toMillis === "function" ? data.joinedAt.toMillis() : null,
      };
    }),
  };
}

export function timeAgo(ms: number | null, now = Date.now()) {
  if (!ms) return "";
  const mins = Math.floor((now - ms) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ms).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
