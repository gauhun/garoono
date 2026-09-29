import { firebaseConfig } from "./firebase";

// Unique-visitor counter over Firestore REST, so the home page loads no Firebase SDK.
// The rules only allow the count to go up by exactly one.
const DOC = `projects/${firebaseConfig.projectId}/databases/(default)/documents/publicStats/visitors`;
const API = "https://firestore.googleapis.com/v1";
const SEEN_KEY = "garoono.visited";

function alreadyCounted() {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return true; // storage blocked: don't risk counting on every visit
  }
}

function markCounted() {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // ignore
  }
}

async function readCount(): Promise<number | null> {
  const res = await fetch(`${API}/${DOC}?key=${firebaseConfig.apiKey}`);
  if (res.status === 404) return 0;
  if (!res.ok) return null;
  const data = await res.json();
  return Number(data.fields?.count?.integerValue ?? 0);
}

async function increment(): Promise<number | null> {
  const res = await fetch(`${API}/projects/${firebaseConfig.projectId}/databases/(default)/documents:commit?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      writes: [
        {
          update: { name: DOC, fields: {} },
          updateMask: { fieldPaths: [] },
          updateTransforms: [{ fieldPath: "count", increment: { integerValue: "1" } }],
        },
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Number(data.writeResults?.[0]?.transformResults?.[0]?.integerValue ?? NaN) || null;
}

// Counts this browser once, then returns the current total
export async function countVisit(): Promise<number | null> {
  try {
    if (!alreadyCounted()) {
      const total = await increment();
      if (total !== null) {
        markCounted();
        return total;
      }
    }
    return await readCount();
  } catch {
    return null;
  }
}
