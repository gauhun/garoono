import { describe, expect, it } from "vitest";
import { canClaim, firstName, normalizeEmail, purchaseKind, revocationFor, type DodoPayment } from "./payments";

const paid = (over: Partial<DodoPayment> = {}): DodoPayment => ({
  payment_id: "pay_1",
  status: "succeeded",
  total_amount: 9900,
  currency: "INR",
  customer: { email: "A@B.com" },
  product_cart: [{ product_id: "pdt_life", quantity: 1 }],
  metadata: {},
  ...over,
});

describe("normalizeEmail", () => {
  it("trims and lowercases", () => expect(normalizeEmail("  Gautam@Gmail.COM ")).toBe("gautam@gmail.com"));
});

describe("purchaseKind", () => {
  const products = { lifetime: "pdt_life", doc: "pdt_doc" };
  const docPaid = (doc: unknown) => paid({ product_cart: [{ product_id: "pdt_doc", quantity: 1 }], metadata: { doc } });

  it("accepts a succeeded payment for the lifetime product", () => expect(purchaseKind(paid(), products)).toEqual({ kind: "lifetime" }));
  it("accepts a localised currency", () => expect(purchaseKind(paid({ currency: "USD", total_amount: 119 }), products)).toEqual({ kind: "lifetime" }));
  it("rejects other statuses", () => expect(purchaseKind(paid({ status: "processing" }), products)).toBeNull());
  it("rejects other products", () => expect(purchaseKind(paid({ product_cart: [{ product_id: "pdt_other", quantity: 1 }] }), products)).toBeNull());
  it("rejects an empty cart", () => expect(purchaseKind(paid({ product_cart: null }), products)).toBeNull());
  it("reads the doc slug from metadata", () => expect(purchaseKind(docPaid("find-your-niche"), products)).toEqual({ kind: "doc", slug: "find-your-niche" }));
  it("rejects a doc purchase without a valid slug", () => {
    for (const doc of [undefined, "", "../x", "A B", 42]) expect(purchaseKind(docPaid(doc), products)).toBeNull();
  });
});

describe("revocationFor", () => {
  it("revokes on refunds and lost/opened disputes", () => {
    for (const t of ["refund.succeeded", "dispute.opened", "dispute.lost"]) expect(revocationFor(t)).toBe(true);
  });
  it("restores on a won dispute", () => expect(revocationFor("dispute.won")).toBe(false));
  it("ignores everything else", () => {
    for (const t of ["payment.succeeded", "refund.failed", undefined]) expect(revocationFor(t)).toBe(null);
  });
});

describe("canClaim", () => {
  it("allows an unclaimed paid purchase", () => expect(canClaim({ status: "paid", claimedBy: null }, "u1")).toBe(true));
  it("allows re-claiming your own", () => expect(canClaim({ status: "paid", claimedBy: "u1" }, "u1")).toBe(true));
  it("refuses someone else's", () => expect(canClaim({ status: "paid", claimedBy: "u2" }, "u1")).toBe(false));
  it("refuses revoked or missing", () => {
    expect(canClaim({ status: "revoked", claimedBy: null }, "u1")).toBe(false);
    expect(canClaim(undefined, "u1")).toBe(false);
  });
});

describe("firstName", () => {
  it("keeps only the first name", () => expect(firstName("Gautam Singh Rathor")).toBe("Gautam"));
  it("trims and caps length", () => expect(firstName("  Abcdefghijklmnopqrstuvwxyzabc ")).toBe("Abcdefghijklmnopqrstuvwx"));
  it("falls back when empty", () => expect(firstName("   ")).toBe("Pro member"));
});
