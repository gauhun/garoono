import type { User } from "firebase/auth";
import { getFirebaseApp } from "./firebase";

async function authModule() {
  const [app, mod] = await Promise.all([getFirebaseApp(), import("firebase/auth")]);
  return { auth: mod.getAuth(app), mod };
}

export async function signInWithGoogle() {
  const { auth, mod } = await authModule();
  const provider = new mod.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    await mod.signInWithPopup(auth, provider);
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
    throw e;
  }
}

export async function signOutUser() {
  const { auth, mod } = await authModule();
  await mod.signOut(auth);
}

export async function watchUser(cb: (user: User | null) => void) {
  const { auth, mod } = await authModule();
  return mod.onAuthStateChanged(auth, cb);
}

// Google blocks OAuth inside Instagram/Facebook/LinkedIn in-app browsers
export const isInAppBrowser = () => /Instagram|FBAN|FBAV|FB_IAB|LinkedInApp/i.test(navigator.userAgent);
