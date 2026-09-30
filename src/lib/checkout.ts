// Set DODO_MODE to "test" (and functions/.env + secrets to the test pair) to test end to end.
export const DODO_MODE: "test" | "live" = "live";

const PRODUCT_IDS = {
  test: "pdt_0NofSlOUqHpX7aEbitwyI",
  live: "pdt_0NohRpLiJr5vBcyeC78UG",
};

// Launch pricing is a real deadline, the same for every visitor (no resetting timers).
// When it passes, raise the Dodo product price to match REGULAR_PRICE_LABEL.
export const LAUNCH_PRICE_LABEL = "₹99";
export const REGULAR_PRICE_LABEL = "₹199";
export const LAUNCH_ENDS_AT = Date.parse("2026-10-10T23:59:59+05:30");

export function launchOffer(now: number, endsAt = LAUNCH_ENDS_AT) {
  const left = Math.max(0, Math.floor((endsAt - now) / 1000));
  const active = left > 0;
  return {
    active,
    price: active ? LAUNCH_PRICE_LABEL : REGULAR_PRICE_LABEL,
    regularPrice: REGULAR_PRICE_LABEL,
    days: Math.floor(left / 86400),
    hours: Math.floor((left % 86400) / 3600),
    minutes: Math.floor((left % 3600) / 60),
    seconds: left % 60,
  };
}

export function checkoutUrl(
  opts: { returnUrl: string; email?: string | null; uid?: string | null },
  mode: "test" | "live" = DODO_MODE,
  productId: string = PRODUCT_IDS[mode],
) {
  const base = mode === "live" ? "https://checkout.dodopayments.com" : "https://test.checkout.dodopayments.com";
  const query = new URLSearchParams({ quantity: "1", redirect_url: opts.returnUrl });
  if (opts.email) query.set("email", opts.email);
  // Lets the webhook unlock a signed-in buyer immediately, even if they pay with another email
  if (opts.uid) query.set("metadata_uid", opts.uid);
  return `${base}/buy/${productId}?${query}`;
}
