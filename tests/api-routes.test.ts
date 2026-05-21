import { afterEach, describe, expect, it, vi } from "vitest";

const paymentIntentCreate = vi.fn();

vi.mock("../src/lib/stripe", () => ({
  getStripe: () => ({
    paymentIntents: { create: paymentIntentCreate },
  }),
}));

function jsonRequest(body: unknown, origin = "https://apotidev.org") {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return new Request("https://apotidev.org/api/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(text.length),
      Origin: origin,
    },
    body: text,
  });
}

describe("payment intent route", () => {
  afterEach(() => {
    paymentIntentCreate.mockReset();
  });

  it("rejects invalid origins", async () => {
    const { POST } = await import("../src/pages/api/create-payment-intent");
    const response = await POST({
      request: jsonRequest({}, "https://evil.example"),
      url: new URL("https://apotidev.org/api/create-payment-intent"),
    } as any);

    expect(response.status).toBe(403);
  });

  it("rejects invalid JSON as a bad request", async () => {
    const { POST } = await import("../src/pages/api/create-payment-intent");
    const response = await POST({
      request: jsonRequest("{not-json"),
      url: new URL("https://apotidev.org/api/create-payment-intent"),
    } as any);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "Invalid JSON" });
  });

  it("normalizes donor metadata for valid one-time gifts", async () => {
    paymentIntentCreate.mockResolvedValue({ client_secret: "pi_secret" });
    const { POST } = await import("../src/pages/api/create-payment-intent");

    const response = await POST({
      request: jsonRequest({
        amount: 2500,
        currency: "usd",
        type: "one-time",
        donorName: "  Ada Donor  ",
        donorEmail: "ADA@EXAMPLE.COM ",
        isAnonymous: false,
        projectSlug: "education-drive",
      }),
      url: new URL("https://apotidev.org/api/create-payment-intent"),
    } as any);

    expect(response.status).toBe(200);
    expect(paymentIntentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        receipt_email: "ada@example.com",
        metadata: expect.objectContaining({
          donor_name: "Ada Donor",
          donor_email: "ada@example.com",
          project_slug: "education-drive",
        }),
      }),
      expect.any(Object),
    );
  });
});

