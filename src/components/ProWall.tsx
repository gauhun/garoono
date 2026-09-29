"use client";

import { useCallback, useEffect, useState } from "react";
import { setProWall } from "../lib/access";
import { fetchProSummary, timeAgo, type ProMember, type ProSummary } from "../lib/proWall";
import type { Access } from "../lib/useAccess";

// Right rail fills first; later members continue on the left, like TrustMRR's side columns
export const RAIL_SIZE = 8;
const TINTS = ["#E9F9EE", "#FFF3E0", "#EAF0FF", "#F3F4F6", "#FDEBF3", "#EEF6FF", "#F4EEFF", "#FFF8DB"];

export function useProWall(lifetime: boolean) {
  const [summary, setSummary] = useState<ProSummary | null>(null);
  const reload = useCallback(() => fetchProSummary().then(setSummary, () => setSummary(null)), []);
  useEffect(() => {
    void reload();
  }, [reload, lifetime]);
  return { summary, reload };
}

function Avatar({ member, size }: { member: ProMember; size: number }) {
  if (member.photoURL) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={member.photoURL} alt="" width={size} height={size} referrerPolicy="no-referrer" className="pro-avatar" />;
  }
  return (
    <span className="pro-avatar pro-initial" style={{ width: size, height: size }}>
      {member.name.charAt(0).toUpperCase()}
    </span>
  );
}

export function ProRail({ members, offset }: { members: ProMember[]; offset: number }) {
  if (members.length === 0) return null;
  return (
    <aside className="pro-rail" aria-label="Recent Pro members">
      {members.map((m, i) => (
        <div key={m.uid} className="pro-card" style={{ background: TINTS[(i + offset) % TINTS.length] }}>
          <Avatar member={m} size={44} />
          <strong>{m.name}</strong>
          <span className="font-mono">went Pro {timeAgo(m.joinedAt)}</span>
        </div>
      ))}
    </aside>
  );
}

function headline(count: number) {
  return `${count.toLocaleString("en-US")} ${count === 1 ? "person" : "people"} went Pro`;
}

// Count line, compact avatar strip for narrow screens, and the owner's hide/show toggle
export function ProSummaryBar({ access, summary, reload }: { access: Access; summary: ProSummary | null; reload: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  if (!summary || (summary.count === 0 && !access.lifetime)) return null;

  const uid = access.user?.uid;
  const onWall = !!uid && summary.members.some((m) => m.uid === uid);

  const toggle = async () => {
    setBusy(true);
    try {
      await setProWall(!onWall);
      await reload();
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
          {summary.members.slice(0, 12).map((m) => (
            <span key={m.uid} title={m.name}>
              <Avatar member={m} size={28} />
            </span>
          ))}
        </div>
      )}
      <span className="pro-count">{headline(summary.count)}</span>
      {access.lifetime && (
        <button type="button" className="unlock-link" onClick={toggle} disabled={busy}>
          {busy ? "…" : onWall ? "Hide me from the Pro wall" : "Show me on the Pro wall"}
        </button>
      )}
    </div>
  );
}
