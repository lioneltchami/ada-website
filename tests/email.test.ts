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
      sendEmail({ to: "donor@example.com", subject: "Receipt", text: "Thanks" }),
    ).rejects.toThrow("RESEND_API_KEY is not configured");
  });
});
