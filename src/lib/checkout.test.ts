import { describe, expect, it } from "vitest";
import { checkoutUrl } from "./checkout";

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
