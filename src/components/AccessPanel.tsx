"use client";

import { useEffect, useState } from "react";
import { isInAppBrowser } from "../lib/auth";
import { DOC_PRICE_LABEL } from "../lib/checkout";
import { docs } from "../data/docs";
import type { Access } from "../lib/useAccess";

export function useInAppBrowser() {
  const [inApp, setInApp] = useState(false);
  useEffect(() => setInApp(isInAppBrowser()), []);
  return inApp;
}

export function AuthChip({ access }: { access: Access }) {
  const inApp = useInAppBrowser();
  if (!access.ready) return null;

  if (!access.user) {
    if (inApp) return <span className="auth-hint">Open in your browser to sign in</span>;
    return (
      <button type="button" className="auth-chip" onClick={access.signIn}>
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="auth-chip is-user">
      {access.user.photoURL && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={access.user.photoURL} alt="" width={22} height={22} referrerPolicy="no-referrer" />
      )}
      <span className="auth-email">{access.user.email}</span>
      <button type="button" className="auth-signout" onClick={access.signOut}>
        Sign out
      </button>
    </div>
  );
}

// Shown after checkout: while the purchase is being unlocked, then with the doc it unlocked
export function PaymentBanner({ access, onOpen }: { access: Access; onOpen: (slug: string, download: boolean) => void }) {
  const inApp = useInAppBrowser();
  const doc = docs.find((d) => d.slug === access.unlocked);

  if (doc) {
    return (
      <div className="unlock-banner is-paid">
        <div className="unlock-copy">
          <strong>Unlocked 🎉</strong>
          <span>{doc.title}</span>
        </div>
        <button type="button" className="doc-btn" onClick={() => onOpen(doc.slug, false)}>
          View
        </button>
        <button type="button" className="doc-btn doc-btn-primary" onClick={() => onOpen(doc.slug, true)}>
          Download
        </button>
        <button type="button" className="unlock-link" onClick={access.dismissUnlocked}>
          Close
        </button>
      </div>
    );
  }
  if (!access.justPaid) return null;

  return (
    <div className="unlock-banner is-paid">
      <div className="unlock-copy">
        <strong>Payment received 🎉</strong>
        {access.user ? (
          <span>{access.checking ? "Unlocking your docs…" : "Still confirming your payment. This can take a minute."}</span>
        ) : inApp ? (
          <span>Tap ⋯ then Open in browser, and sign in with Google there to unlock.</span>
        ) : (
          <span>Sign in with Google to unlock your docs.</span>
        )}
      </div>
      {!access.user && !inApp && (
        <button type="button" className="doc-btn doc-btn-primary" onClick={access.signIn}>
          Sign in with Google
        </button>
      )}
      {access.user && !access.checking && (
        <button type="button" className="doc-btn" onClick={access.recheck}>
          Check again
        </button>
      )}
      {access.error && <p className="unlock-error">{access.error}</p>}
    </div>
  );
}

// The price, and a way back in for buyers on a new device, at the bottom of the docs list
export function UnlockBanner({ access }: { access: Access }) {
  const inApp = useInAppBrowser();
  const [showRecover, setShowRecover] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [recoverFailed, setRecoverFailed] = useState(false);

  // Lifetime owners already have everything
  if (access.lifetime || access.justPaid) return null;

  return (
    <div className="unlock-banner">
      <div className="unlock-copy">
        <strong>Every paid doc is {DOC_PRICE_LABEL}</strong>
        <span>Pay once, view and download it anytime</span>
      </div>
      <div className="unlock-actions">
        <button type="button" className="unlock-link" onClick={() => setShowRecover((v) => !v)}>
          Already bought?
        </button>
      </div>

      {showRecover && (
        <div className="recover-box">
          {!access.user ? (
            <>
              <p>
                {inApp
                  ? "Open this page in your browser, then sign in with Google using the email you paid with."
                  : "Sign in with Google using the email you paid with."}
              </p>
              {!inApp && (
                <button type="button" className="doc-btn" onClick={access.signIn}>
                  Sign in with Google
                </button>
              )}
            </>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setRecoverFailed(!(await access.recover(paymentId)));
              }}
            >
              <p>Paid with a different email? Paste the payment ID from your Dodo receipt.</p>
              <div className="recover-row">
                <input
                  className="email-input"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder="pay_…"
                  aria-label="Payment ID"
                />
                <button type="submit" className="btn-subscribe" disabled={!paymentId.trim() || access.checking}>
                  {access.checking ? "…" : "Unlock"}
                </button>
              </div>
              {recoverFailed && <p className="unlock-error">No unclaimed purchase found for that ID.</p>}
            </form>
          )}
          {access.error && <p className="unlock-error">{access.error}</p>}
        </div>
      )}
    </div>
  );
}
