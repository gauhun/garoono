"use client";

import { useCallback, useEffect, useState } from "react";
import { setProWall } from "../lib/access";
import { fetchProSummary, type ProSummary } from "../lib/proWall";
import type { Access } from "../lib/useAccess";

function headline({ count, members }: ProSummary) {
  const names = members.slice(0, 3).map((m) => m.name);
  if (names.length === 0) return `${count.toLocaleString("en-US")} ${count === 1 ? "person" : "people"} went Pro`;
  const others = count - names.length;
  const list = names.length > 1 && others <= 0 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names.join(", ");
  return others > 0 ? `${list} and ${others.toLocaleString("en-US")} other${others === 1 ? "" : "s"} went Pro` : `${list} went Pro`;
}

export default function ProWall({ access }: { access: Access }) {
  const [summary, setSummary] = useState<ProSummary | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => fetchProSummary().then(setSummary, () => setSummary(null)), []);

  useEffect(() => {
    void load();
  }, [load, access.lifetime]);

  if (!summary || (summary.count === 0 && !access.lifetime)) return null;

  const uid = access.user?.uid;
  const onWall = !!uid && summary.members.some((m) => m.uid === uid);

  const toggle = async () => {
    setBusy(true);
    try {
      await setProWall(!onWall);
      await load();
    } catch {
      alert("Couldn't update the Pro wall. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pro-wall">
      {summary.members.length > 0 && (
        <div className="pro-avatars">
          {summary.members.slice(0, 12).map((m) =>
            m.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={m.uid} src={m.photoURL} alt={m.name} title={m.name} width={28} height={28} referrerPolicy="no-referrer" />
            ) : (
              <span key={m.uid} className="pro-initial" title={m.name}>
                {m.name.charAt(0).toUpperCase()}
              </span>
            ),
          )}
        </div>
      )}
      <span className="pro-count">{headline(summary)}</span>
      {access.lifetime && (
        <button type="button" className="unlock-link" onClick={toggle} disabled={busy}>
          {busy ? "…" : onWall ? "Remove me from the wall" : "Show my photo and first name on the Pro wall"}
        </button>
      )}
    </div>
  );
}
