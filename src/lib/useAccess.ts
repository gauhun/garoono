"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { claimAccess } from "./access";
import { signInWithGoogle, signOutUser, watchUser } from "./auth";

const PENDING_KEY = "garoono.pendingPayment";

function readPending() {
  try {
    return localStorage.getItem(PENDING_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

function writePending(paymentId: string | null) {
  try {
    if (paymentId) localStorage.setItem(PENDING_KEY, paymentId);
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    // Storage blocked: the buyer can still recover with the payment ID from their receipt
  }
}

export type Access = {
  user: User | null;
  ready: boolean;
  lifetime: boolean;
  checking: boolean;
  justPaid: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  recover: (paymentId: string) => Promise<boolean>;
  recheck: () => Promise<boolean>;
};

export function useAccess(): Access {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [lifetime, setLifetime] = useState(false);
  const [checking, setChecking] = useState(false);
  const [justPaid, setJustPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dodo sends buyers back to /docs/?payment_id=…&status=succeeded
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("payment_id");
    if (paymentId && params.get("status") === "succeeded") writePending(paymentId);
    if (paymentId) window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    if (readPending()) setJustPaid(true);
  }, []);

  const check = useCallback(async (paymentId?: string) => {
    setChecking(true);
    setError(null);
    try {
      const result = await claimAccess(paymentId);
      setLifetime(result.lifetime);
      if (result.lifetime) {
        writePending(null);
        setJustPaid(false);
      }
      return result.lifetime;
    } catch {
      setError("Couldn't check your access. Try again in a moment.");
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    watchUser((u) => {
      setUser(u);
      setReady(true);
      if (u) void check(readPending());
      else setLifetime(false);
    }).then((fn) => {
      if (cancelled) fn();
      else unsubscribe = fn;
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [check]);

  const signIn = useCallback(async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Google sign-in didn't finish. Allow popups for this site and try again.");
    }
  }, []);

  return {
    user,
    ready,
    lifetime,
    checking,
    justPaid,
    error,
    signIn,
    signOut: signOutUser,
    recover: (paymentId) => check(paymentId.trim()),
    recheck: () => check(readPending()),
  };
}
