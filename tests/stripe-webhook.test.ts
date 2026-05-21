import { describe, expect, it } from "vitest";
import { verifySignature } from "../src/pages/api/webhooks/stripe";

async function signatureHeader(payload: string, secret: string, timestamp = Math.floor(Date.now() / 1000)) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const hex = [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `t=${timestamp},v1=${hex}`;
}

describe("Stripe webhook signature verification", () => {
  it("accepts valid signatures", async () => {
    const payload = JSON.stringify({ type: "payment_intent.succeeded" });
    const header = await signatureHeader(payload, "whsec_test");

    await expect(verifySignature(payload, header, "whsec_test")).resolves.toBe(true);
  });

  it("rejects stale timestamps and invalid signatures", async () => {
    const payload = JSON.stringify({ type: "payment_intent.succeeded" });
    const staleHeader = await signatureHeader(payload, "whsec_test", Math.floor(Date.now() / 1000) - 600);

    await expect(verifySignature(payload, staleHeader, "whsec_test")).resolves.toBe(false);
    await expect(verifySignature(payload, "t=123,v1=nothex", "whsec_test")).resolves.toBe(false);
  });
});
