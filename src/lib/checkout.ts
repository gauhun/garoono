// Set DODO_MODE to "test" (and functions/.env + secrets to the test pair) to test end to end.
export const DODO_MODE: "test" | "live" = "live";

// One Dodo product for every paid doc; the doc itself goes in checkout metadata.
// Lifetime access is no longer sold, past lifetime buyers keep everything.
const DOC_PRODUCT_IDS = {
  test: "pdt_0Nq8i92WhLeqMev6krmGx",
  live: "pdt_0Nq8i8js6GFgP5vm0f9UQ",
};

export const DOC_PRICE_LABEL = "₹9";

export function checkoutUrl(
  opts: { doc: string; returnUrl: string; email?: string | null; uid?: string | null },
  mode: "test" | "live" = DODO_MODE,
  productId: string = DOC_PRODUCT_IDS[mode],
) {
  const base = mode === "live" ? "https://checkout.dodopayments.com" : "https://test.checkout.dodopayments.com";
  const query = new URLSearchParams({ quantity: "1", redirect_url: opts.returnUrl, metadata_doc: opts.doc });
  if (opts.email) query.set("email", opts.email);
  // Lets the webhook unlock a signed-in buyer immediately, even if they pay with another email
  if (opts.uid) query.set("metadata_uid", opts.uid);
  return `${base}/buy/${productId}?${query}`;
}
