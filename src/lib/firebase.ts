import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore/lite";

// Public web config for the "garoono.in site" app on baseproject-25dbe.
// Web API keys are not secrets — access is governed by firestore.rules. This key is dedicated
// to garoono.in: it only works from garoono.in, localhost and the Firebase auth handler, and only
// for Identity Toolkit, Secure Token and Firestore (Google Cloud → Credentials → "garoono.in site (restricted)").
export const firebaseConfig = {
  apiKey: "AIzaSyDEE0HydXnkeUAIm2rSZO5edlFr9JcUoVA",
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

let dbPromise: Promise<Firestore> | null = null;

export function getLiteDb() {
  dbPromise ??= Promise.all([getFirebaseApp(), import("firebase/firestore/lite")]).then(([app, { getFirestore }]) =>
    getFirestore(app),
  );
  return dbPromise;
}
