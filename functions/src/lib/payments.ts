export type DodoPayment = {
  payment_id: string;
  status: string;
  total_amount: number;
  currency: string;
  customer?: { email?: string | null } | null;
  product_cart?: { product_id: string; quantity: number }[] | null;
  metadata?: Record<string, unknown> | null;
};

export const SLUG_RE = /^[a-z0-9-]{3,60}$/;
export const PAYMENT_ID_RE = /^[A-Za-z0-9_-]{6,80}$/;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

// The product is what was bought; Dodo may localise the amount/currency for overseas buyers
export function isQualifyingPayment(p: DodoPayment, productId: string) {
  return p.status === "succeeded" && (p.product_cart ?? []).some((item) => item.product_id === productId);
}

const REVOKE = new Set(["refund.succeeded", "dispute.opened", "dispute.lost"]);
const RESTORE = new Set(["dispute.won"]);

export function revocationFor(type: string | undefined): boolean | null {
  if (!type) return null;
  if (REVOKE.has(type)) return true;
  if (RESTORE.has(type)) return false;
  return null;
}

export function canClaim(purchase: { status?: string; claimedBy?: string | null } | undefined, uid: string) {
  if (!purchase || purchase.status !== "paid") return false;
  return !purchase.claimedBy || purchase.claimedBy === uid;
}

// Only the first name goes on the public wall
export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0]?.slice(0, 24) || "Pro member";
}
