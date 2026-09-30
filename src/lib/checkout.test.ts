import { describe, expect, it } from "vitest";
import { checkoutUrl, launchOffer } from "./checkout";

describe("checkoutUrl", () => {
  it("builds a test-mode static link with return url", () => {
    const url = new URL(checkoutUrl({ returnUrl: "https://garoono.in/docs/" }, "test", "pdt_abc"));
    expect(url.origin + url.pathname).toBe("https://test.checkout.dodopayments.com/buy/pdt_abc");
    expect(url.searchParams.get("quantity")).toBe("1");
    expect(url.searchParams.get("redirect_url")).toBe("https://garoono.in/docs/");
    expect(url.searchParams.has("email")).toBe(false);
    expect(url.searchParams.has("metadata_uid")).toBe(false);
  });

  it("adds email and uid when signed in, live host in live mode", () => {
    const url = new URL(checkoutUrl({ returnUrl: "https://garoono.in/docs/", email: "a@b.com", uid: "u1" }, "live", "pdt_live"));
    expect(url.origin).toBe("https://checkout.dodopayments.com");
    expect(url.searchParams.get("email")).toBe("a@b.com");
    expect(url.searchParams.get("metadata_uid")).toBe("u1");
  });
});

describe("launchOffer", () => {
  const end = Date.parse("2026-10-10T23:59:59+05:30");

  it("shows the launch price and time left before the deadline", () => {
    const now = end - (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000;
    expect(launchOffer(now, end)).toMatchObject({ active: true, price: "₹99", regularPrice: "₹199", days: 2, hours: 3, minutes: 4, seconds: 5 });
  });

  it("switches to the regular price at the deadline, for good", () => {
    expect(launchOffer(end, end)).toMatchObject({ active: false, price: "₹199", days: 0, seconds: 0 });
    expect(launchOffer(end + 86400000, end)).toMatchObject({ active: false, price: "₹199" });
  });

  it("ends at 10 Oct 2026, 11:59:59pm IST", () => {
    expect(new Date(end).toISOString()).toBe("2026-10-10T18:29:59.000Z");
  });
});
