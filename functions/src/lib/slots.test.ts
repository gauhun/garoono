import { describe, expect, it } from "vitest";
import { bookingDecision, generateSlots, HOLD_MS, isTaken } from "./slots";

// 2026-10-29 12:00 IST
const NOW = Date.parse("2026-10-29T12:00:00+05:30");

describe("generateSlots", () => {
  it("offers 14:00–18:30 and 20:30–21:30 IST on Tue, Thu, Sat, Sun", () => {
    const thu = generateSlots(NOW, [], new Set()).filter((s) => s.startsWith("2026-10-29"));
    expect(thu).toHaveLength(13);
    expect(thu[0]).toBe("2026-10-29T08:30:00.000Z"); // 14:00
    expect(thu[9]).toBe("2026-10-29T13:00:00.000Z"); // 18:30
    expect(thu[10]).toBe("2026-10-29T15:00:00.000Z"); // 20:30
    expect(thu[12]).toBe("2026-10-29T16:00:00.000Z"); // 21:30
  });

  it("offers 20:00–22:00 IST starts on Mon, Wed, Fri", () => {
    const fri = generateSlots(NOW, [], new Set()).filter((s) => s.startsWith("2026-10-30"));
    expect(fri).toEqual([
      "2026-10-30T14:30:00.000Z",
      "2026-10-30T15:00:00.000Z",
      "2026-10-30T15:30:00.000Z",
      "2026-10-30T16:00:00.000Z",
      "2026-10-30T16:30:00.000Z",
    ]);
  });

  it("covers the next 14 days", () => {
    // Thu 29 from 14:00, then 7 long and 6 short days; Thu 12 Nov is past the 14 day limit
    expect(generateSlots(NOW, [], new Set())).toHaveLength(13 + 7 * 13 + 6 * 5);
  });

  it("needs 2 hours' notice", () => {
    const slots = generateSlots(Date.parse("2026-10-29T19:00:00+05:30"), [], new Set());
    expect(slots[0]).toBe("2026-10-29T15:30:00.000Z"); // 21:00 IST
  });

  it("skips calendar busy times and taken slots", () => {
    const busy = [{ start: Date.parse("2026-10-29T20:15:00+05:30"), end: Date.parse("2026-10-29T20:45:00+05:30") }];
    const slots = generateSlots(NOW, busy, new Set(["2026-10-29T16:00:00.000Z"]));
    expect(slots).not.toContain("2026-10-29T15:00:00.000Z");
    expect(slots).not.toContain("2026-10-29T16:00:00.000Z");
    expect(slots).toContain("2026-10-29T15:30:00.000Z");
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
