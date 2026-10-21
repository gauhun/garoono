"use client";

import { useEffect, useState } from "react";
import { LAUNCH_ENDS_AT, launchOffer } from "../lib/checkout";

// Current offer on the client. `tick` re-renders every second for the countdown;
// otherwise it only re-renders once, when the launch window closes.
export function useLaunchOffer(tick = false) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    if (tick) {
      const id = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(id);
    }
    const untilEnd = LAUNCH_ENDS_AT - Date.now();
    if (untilEnd <= 0 || untilEnd > 2_147_000_000) return;
    const id = setTimeout(() => setNow(Date.now()), untilEnd + 500);
    return () => clearTimeout(id);
  }, [tick]);

  return { mounted: now !== null, ...launchOffer(now ?? Date.now()) };
}

// "₹199 ₹99" with the regular price struck through while the launch price lasts
export function LaunchPrice() {
  const offer = useLaunchOffer();
  return (
    <>
      {offer.active && <s className="launch-was">{offer.regularPrice}</s>} {offer.price}
    </>
  );
}

export function LaunchCountdown() {
  const offer = useLaunchOffer(true);
  if (!offer.mounted || !offer.active) return null;

  const parts: [string, number][] = [
    ["d", offer.days],
    ["h", offer.hours],
    ["m", offer.minutes],
    ["s", offer.seconds],
  ];

  return (
    <div className="launch-timer" role="timer" aria-label="Time left at the launch price">
      <span className="launch-timer-label">Launch price ends in</span>
      <div className="launch-timer-boxes">
        {parts.map(([unit, value]) => (
          <span key={unit} className="launch-timer-box">
            <strong className="font-mono">{String(value).padStart(2, "0")}</strong>
            {unit}
          </span>
        ))}
      </div>
    </div>
  );
}
