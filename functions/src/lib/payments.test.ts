import { describe, expect, it } from "vitest";
import { canClaim, firstName, isQualifyingPayment, normalizeEmail, revocationFor, type DodoPayment } from "./payments";

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

describe("isQualifyingPayment", () => {
  it("accepts a succeeded payment for the lifetime product", () => expect(isQualifyingPayment(paid(), "pdt_life")).toBe(true));
  it("accepts a localised currency", () => expect(isQualifyingPayment(paid({ currency: "USD", total_amount: 119 }), "pdt_life")).toBe(true));
  it("rejects other statuses", () => expect(isQualifyingPayment(paid({ status: "processing" }), "pdt_life")).toBe(false));
  it("rejects other products", () => expect(isQualifyingPayment(paid(), "pdt_other")).toBe(false));
  it("rejects an empty cart", () => expect(isQualifyingPayment(paid({ product_cart: null }), "pdt_life")).toBe(false));
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
