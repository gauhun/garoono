"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchProSummary, timeAgo, type ProMember, type ProSummary } from "../lib/proWall";

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

// Pro count pill beside the sign-in button, with the newest members' faces
export function ProCountPill({ summary }: { summary: ProSummary | null }) {
  if (!summary || summary.count === 0) return null;
  return (
    <div className="pro-pill" title="Pro members">
      {summary.members.length > 0 && (
        <span className="pro-avatars">
          {summary.members.slice(0, 3).map((m) => (
            <span key={m.uid}>
              <Avatar member={m} size={22} />
            </span>
          ))}
        </span>
      )}
      <span>
        <strong>{summary.count.toLocaleString("en-US")}</strong> went Pro
      </span>
    </div>
  );
}
