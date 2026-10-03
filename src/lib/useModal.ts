import { useEffect, useRef } from "react";

// Escape closes, and the page behind stops scrolling. Stacked modals restore in order;
// pass `active: false` while another modal sits on top so Escape only closes that one.
export function useModal(onClose: () => void, active = true) {
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);
}
