import { createHmac, timingSafeEqual } from "node:crypto";

export type WebhookHeaders = { id?: string; timestamp?: string; signature?: string };

// Standard Webhooks: HMAC-SHA256 over "id.timestamp.body", base64, header "v1,<sig> v1,<sig2>"
export function verifyWebhook(headers: WebhookHeaders, rawBody: string, secret: string, nowSec: number, toleranceSec = 300) {
  const { id, timestamp, signature } = headers;
  if (!id || !timestamp || !signature) return false;

  const ts = Number(timestamp);
  if (!Number.isInteger(ts) || Math.abs(nowSec - ts) > toleranceSec) return false;

  const key = Buffer.from(secret.startsWith("whsec_") ? secret.slice(6) : secret, "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${rawBody}`).digest();

  return signature.split(" ").some((entry) => {
    const [version, sig] = entry.split(",");
    if (version !== "v1" || !sig) return false;
    const given = Buffer.from(sig, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
