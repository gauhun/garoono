"use client";

import { useEffect, useState } from "react";

function AppleLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.86-.76-1.47.02-2.83.86-3.59 2.17-1.53 2.65-.39 6.58 1.1 8.73.73 1.05 1.6 2.24 2.73 2.2 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.32-3.5ZM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.67-.92 2.66.97.08 1.96-.49 2.56-1.21Z" />
    </svg>
  );
}

function PlayLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.6 2.2 13.4 12l-9.8 9.8c-.36-.2-.6-.6-.6-1.07V3.27c0-.47.24-.87.6-1.07Z" fill="#34A853" />
      <path d="m16.7 8.7-3.3 3.3L3.6 2.2c.2-.11.45-.17.7-.13.2.03.38.1.55.2l11.85 6.43Z" fill="#FBBC04" />
      <path d="m16.7 15.3-11.85 6.43c-.17.1-.35.17-.55.2-.25.04-.5-.02-.7-.13L13.4 12l3.3 3.3Z" fill="#EA4335" />
      <path d="M20.4 10.7c.5.27.8.75.8 1.3s-.3 1.03-.8 1.3l-3.7 2-3.3-3.3 3.3-3.3 3.7 2Z" fill="#4285F4" />
    </svg>
  );
}

type Store = "play" | "apple";

// Puts the visitor's own store first: iPhone and iPad see the App Store button first
export default function StoreButtons({ playUrl, appStoreUrl }: { playUrl: string; appStoreUrl?: string }) {
  const [first, setFirst] = useState<Store>("play");

  useEffect(() => {
    if (appStoreUrl && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)) setFirst("apple");
  }, [appStoreUrl]);

  const buttons: Record<Store, React.ReactNode> = {
    play: (
      <a key="play" href={playUrl} target="_blank" rel="noopener noreferrer" className="store-btn">
        <PlayLogo />
        <span>
          <small>Get it on</small>
          Google Play
        </span>
      </a>
    ),
    apple: appStoreUrl && (
      <a key="apple" href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="store-btn">
        <AppleLogo />
        <span>
          <small>Download on the</small>
          App Store
        </span>
      </a>
    ),
  };

  return <div className="store-btns">{first === "apple" ? [buttons.apple, buttons.play] : [buttons.play, buttons.apple]}</div>;
}
