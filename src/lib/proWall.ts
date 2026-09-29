import { getLiteDb } from "./firebase";

export type ProMember = { uid: string; name: string; photoURL: string | null };
export type ProSummary = { count: number; members: ProMember[] };

export async function fetchProSummary(limitTo = 24): Promise<ProSummary> {
  const [db, fs] = await Promise.all([getLiteDb(), import("firebase/firestore/lite")]);
  const [countSnap, wallSnap] = await Promise.all([
    fs.getDoc(fs.doc(db, "publicStats", "pro")),
    fs.getDocs(fs.query(fs.collection(db, "proWall"), fs.orderBy("joinedAt", "desc"), fs.limit(limitTo))),
  ]);
  return {
    count: Number(countSnap.data()?.count ?? 0),
    members: wallSnap.docs.map((d) => ({
      uid: d.id,
      name: String(d.data().name ?? "Pro member"),
      photoURL: (d.data().photoURL as string | null) ?? null,
    })),
  };
}
