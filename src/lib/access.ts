import { getFirebaseApp } from "./firebase";

async function call<T>(name: string, data: unknown): Promise<T> {
  const [app, fns, auth] = await Promise.all([getFirebaseApp(), import("firebase/functions"), import("firebase/auth")]);
  auth.getAuth(app); // registers auth so the callable carries the ID token
  const fn = fns.httpsCallable(fns.getFunctions(app, "asia-south1"), name);
  return (await fn(data)).data as T;
}

export const claimAccess = (paymentId?: string) =>
  call<{ lifetime: boolean }>("claimAccess", paymentId ? { paymentId } : {});

// Opens the tab synchronously so popup blockers allow it, then points it at the signed URL
export async function openPaidDoc(slug: string, download: boolean) {
  const tab = window.open("about:blank", "_blank");
  try {
    const { url } = await call<{ url: string }>("getDocLink", { slug, download });
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      window.location.href = url;
    }
  } catch (e) {
    tab?.close();
    throw e;
  }
}
