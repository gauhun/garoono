"use client";

import { useModal } from "../lib/useModal";

// Gautam's own numbers, shown at the top of /docs and in the welcome dialog
export const PROOF = [
  { value: "14+", label: "apps shipped" },
  { value: "100k+", label: "installs" },
  { value: "$2k+", label: "revenue" },
];

export function ProofStats({ className = "" }: { className?: string }) {
  return (
    <ul className={`proof-stats ${className}`}>
      {PROOF.map((p) => (
        <li key={p.label}>
          <strong>{p.value}</strong> {p.label}
        </li>
      ))}
    </ul>
  );
}

const HIDE_KEY = "garoono.docs.welcome.hidden";
const SEEN_KEY = "garoono.docs.welcome.seen";

// Once per browser session, until the visitor picks "Don't show this again"
export function shouldShowWelcome() {
  try {
    return localStorage.getItem(HIDE_KEY) !== "1" && sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return false; // storage blocked: never risk showing it on every visit
  }
}

export function markWelcomeSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // ignore
  }
}

function hideWelcomeForGood() {
  try {
    localStorage.setItem(HIDE_KEY, "1");
  } catch {
    // ignore
  }
}

type Props = {
  onClose: () => void;
  onRead: () => void; // opens a free doc
};

export default function DocsWelcome({ onClose, onRead }: Props) {
  useModal(onClose);
  return (
    <div className="pro-dialog-backdrop" onClick={onClose}>
      <div className="pro-dialog welcome-dialog" role="dialog" aria-modal="true" aria-label="Why these docs" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="pro-offer">
          <strong className="pro-offer-title">What worked for my apps, written down</strong>
          <ul className="welcome-stats">
            {PROOF.map((p) => (
              <li key={p.label}>
                <strong>{p.value}</strong>
                <span>{p.label}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="doc-btn doc-btn-primary pro-offer-buy" onClick={onRead} autoFocus>
            Read a free doc
          </button>
          <button
            type="button"
            className="unlock-link"
            onClick={() => {
              hideWelcomeForGood();
              onClose();
            }}
          >
            Don&apos;t show this again
          </button>
        </div>
      </div>
    </div>
  );
}
