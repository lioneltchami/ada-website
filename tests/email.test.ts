import { afterEach, describe, expect, it, vi } from "vitest";

describe("sendEmail", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("fails loudly in production when email delivery is not configured", async () => {
    process.env.NODE_ENV = "production";
    vi.stubEnv("RESEND_API_KEY", "");

    const { sendEmail } = await import("../src/lib/email");

    await expect(
      sendEmail({
        to: "donor@example.com",
        subject: "Receipt",
        text: "Thanks",
      }),
    ).rejects.toThrow("RESEND_API_KEY is not configured");
  });

  it("attaches a generated PDF receipt to confirmed donation emails", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));

    const { sendDonationReceipt } = await import("../src/lib/email");

    await expect(
      sendDonationReceipt({
        email: "donor@example.com",
        name: "Ada Donor",
        amount: 25,
        project: "education-drive",
        frequency: "one-time",
        receiptId: "ADA-2026-PI123",
        followUpDueAt: "2026-06-29T12:00:00.000Z",
      }),
    ).resolves.toMatchObject({ success: true, receiptId: "ADA-2026-PI123" });

    const payload = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(payload.attachments).toHaveLength(1);
    expect(payload.attachments[0]).toMatchObject({
      filename: "ADA-Receipt-ADA-2026-PI123.pdf",
    });
    expect(atob(payload.attachments[0].content).startsWith("%PDF-1.4")).toBe(
      true,
    );

    fetchMock.mockRestore();
  });
});
