"use client";

import { useEffect, useState } from "react";
import { isInAppBrowser } from "../lib/auth";
import { LaunchCountdown, LaunchPrice, useLaunchOffer } from "./LaunchOffer";
import type { Access } from "../lib/useAccess";

function useInAppBrowser() {
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

export function UnlockBanner({ access, onBuy }: { access: Access; onBuy: () => void }) {
  const inApp = useInAppBrowser();
  const offer = useLaunchOffer();
  const [showRecover, setShowRecover] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [recoverFailed, setRecoverFailed] = useState(false);

  // Owners already see "You're Pro" in the header
  if (access.lifetime) return null;

  if (access.justPaid) {
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

  return (
    <div className="unlock-banner">
      <div className="unlock-copy">
        <strong>
          Unlock all docs · <LaunchPrice /> lifetime
        </strong>
        <span>
          {offer.active
            ? `Launch price. Goes up to ${offer.regularPrice} on 10 Oct. One payment, every doc I publish, forever.`
            : "One payment. Every doc I publish, forever."}
        </span>
        <span className="unlock-note">Pro members appear on the Pro wall with their first name and photo. Email garoonotech@gmail.com to be removed.</span>
      </div>
      <LaunchCountdown />
      <button type="button" className="doc-btn doc-btn-primary" onClick={onBuy}>
        Get lifetime access
      </button>
      <button type="button" className="unlock-link" onClick={() => setShowRecover((v) => !v)}>
        Already bought?
      </button>

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
