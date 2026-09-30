import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyWebhook } from "./webhook";

const rawSecret = Buffer.from("super-secret-signing-key").toString("base64");
const secret = `whsec_${rawSecret}`;
const body = JSON.stringify({ type: "payment.succeeded", data: { payment_id: "pay_123" } });
const now = 1_790_000_000;

function sign(id: string, ts: number, payload: string, key = rawSecret) {
  const sig = createHmac("sha256", Buffer.from(key, "base64")).update(`${id}.${ts}.${payload}`).digest("base64");
  return `v1,${sig}`;
}

describe("verifyWebhook", () => {
  it("accepts a correctly signed, fresh webhook", () => {
    expect(verifyWebhook({ id: "msg_1", timestamp: String(now), signature: sign("msg_1", now, body) }, body, secret, now)).toBe(true);
  });

  it("accepts when one of several signatures matches", () => {
    const sig = `v1,bm9wZQ== ${sign("msg_1", now, body)}`;
    expect(verifyWebhook({ id: "msg_1", timestamp: String(now), signature: sig }, body, secret, now)).toBe(true);
  });

  it("rejects a tampered body", () => {
    const sig = sign("msg_1", now, body);
    expect(verifyWebhook({ id: "msg_1", timestamp: String(now), signature: sig }, body.replace("123", "999"), secret, now)).toBe(false);
  });

  it("rejects the wrong secret", () => {
    const other = Buffer.from("other-key").toString("base64");
    expect(verifyWebhook({ id: "msg_1", timestamp: String(now), signature: sign("msg_1", now, body, other) }, body, secret, now)).toBe(false);
  });

  it("rejects stale or future timestamps", () => {
    const old = now - 301;
    expect(verifyWebhook({ id: "msg_1", timestamp: String(old), signature: sign("msg_1", old, body) }, body, secret, now)).toBe(false);
    const future = now + 301;
    expect(verifyWebhook({ id: "msg_1", timestamp: String(future), signature: sign("msg_1", future, body) }, body, secret, now)).toBe(false);
  });

  it("rejects missing headers", () => {
    expect(verifyWebhook({ timestamp: String(now), signature: sign("msg_1", now, body) }, body, secret, now)).toBe(false);
    expect(verifyWebhook({ id: "msg_1", signature: sign("msg_1", now, body) }, body, secret, now)).toBe(false);
    expect(verifyWebhook({ id: "msg_1", timestamp: String(now) }, body, secret, now)).toBe(false);
  });
});
