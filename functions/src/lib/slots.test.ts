import { describe, expect, it } from "vitest";
import { bookingDecision, generateSlots, HOLD_MS, isTaken } from "./slots";

// 2026-10-29 12:00 IST
const NOW = Date.parse("2026-10-29T12:00:00+05:30");

describe("generateSlots", () => {
  it("offers 20:00, 20:30, 21:00, 21:30 IST every day for 14 days", () => {
    const slots = generateSlots(NOW, [], new Set());
    expect(slots.slice(0, 4)).toEqual([
      "2026-10-29T14:30:00.000Z",
      "2026-10-29T15:00:00.000Z",
      "2026-10-29T15:30:00.000Z",
      "2026-10-29T16:00:00.000Z",
    ]);
    expect(slots).toHaveLength(14 * 4);
  });

  it("needs 2 hours' notice", () => {
    const slots = generateSlots(Date.parse("2026-10-29T19:00:00+05:30"), [], new Set());
    expect(slots[0]).toBe("2026-10-29T15:30:00.000Z"); // 21:00 IST
  });

  it("skips calendar busy times and taken slots", () => {
    const busy = [{ start: Date.parse("2026-10-29T20:15:00+05:30"), end: Date.parse("2026-10-29T20:45:00+05:30") }];
    const slots = generateSlots(NOW, busy, new Set(["2026-10-29T16:00:00.000Z"]));
    expect(slots.slice(0, 2)).toEqual(["2026-10-29T15:30:00.000Z", "2026-10-30T14:30:00.000Z"]);
  });
});

describe("isTaken", () => {
  it("is taken while booked or held, free once the hold runs out", () => {
    expect(isTaken(undefined, NOW)).toBe(false);
    expect(isTaken({ status: "booked" }, NOW)).toBe(true);
    expect(isTaken({ status: "held", holdUntil: NOW + HOLD_MS }, NOW)).toBe(true);
    expect(isTaken({ status: "held", holdUntil: NOW - 1 }, NOW)).toBe(false);
  });
});

describe("bookingDecision", () => {
  it("books the payer's own hold, even after it ran out", () => {
    expect(bookingDecision({ status: "held", holdId: "h1", holdUntil: 0 }, "h1", "p1")).toBe("book");
  });
  it("ignores a webhook retry", () => {
    expect(bookingDecision({ status: "booked", paymentId: "p1" }, "h1", "p1")).toBe("duplicate");
  });
  it("refunds when someone else has the slot", () => {
    expect(bookingDecision({ status: "booked", paymentId: "p2" }, "h1", "p1")).toBe("refund");
    expect(bookingDecision({ status: "held", holdId: "h2" }, "h1", "p1")).toBe("refund");
    expect(bookingDecision(undefined, "h1", "p1")).toBe("refund");
  });
});
