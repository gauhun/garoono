import { describe, expect, it } from "vitest";
import { timeAgo } from "./proWall";

describe("timeAgo", () => {
  const now = Date.parse("2026-09-30T12:00:00Z");
  it("formats recent times compactly", () => {
    expect(timeAgo(now - 20_000, now)).toBe("just now");
    expect(timeAgo(now - 5 * 60_000, now)).toBe("5m ago");
    expect(timeAgo(now - 3 * 3_600_000, now)).toBe("3h ago");
    expect(timeAgo(now - 2 * 86_400_000, now)).toBe("2d ago");
  });
  it("is empty without a time", () => expect(timeAgo(null, now)).toBe(""));
});
