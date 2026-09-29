import type { FirebaseApp } from "firebase/app";

// Public web config for the "garoono.in site" app on baseproject-25dbe.
// Web API keys are not secrets — access is governed by firestore.rules.
export const firebaseConfig = {
  apiKey: "AIzaSyDKwzNIAk2QqbdqDbsshseKbO_smhDjodI",
  authDomain: "baseproject-25dbe.firebaseapp.com",
  projectId: "baseproject-25dbe",
  storageBucket: "baseproject-25dbe.firebasestorage.app",
  messagingSenderId: "1018097794451",
  appId: "1:1018097794451:web:f16edaa960e153a3087c66",
};

let appPromise: Promise<FirebaseApp> | null = null;

// One lazily created app shared by stats, auth and functions
export function getFirebaseApp() {
  appPromise ??= import("firebase/app").then(({ getApps, initializeApp }) => getApps()[0] ?? initializeApp(firebaseConfig));
  return appPromise;
}
