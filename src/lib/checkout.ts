// Flip DODO_MODE to "live" and fill PRODUCT_IDS.live at go-live.
export const DODO_MODE: "test" | "live" = "test";

const PRODUCT_IDS = {
  test: "<test product id from Dodo, pdt_…>",
  live: "",
};

export const LIFETIME_PRICE_LABEL = "₹99";

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
