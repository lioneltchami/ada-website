import { describe, expect, it } from "vitest";
import { generateReceiptHtml, generateReceiptPdf } from "../src/lib/receipt";

describe("generateReceiptHtml", () => {
  it("escapes donor-controlled fields before rendering receipt HTML", () => {
    const html = generateReceiptHtml({
      name: `<img src=x onerror=alert("name")>`,
      email: `donor@example.com"><script>alert("email")</script>`,
      project: `<strong>General Fund</strong>`,
      amount: 25,
      date: "May 17, 2026",
      receiptId: "ADA-TEST",
    });

    expect(html).not.toContain("<script>");
    expect(html).toContain(
      '<img src="https://apotidev.org/brand/ada-logo.png" alt="Apoti Development Association"',
    );
    expect(html).not.toContain("<strong>General Fund</strong>");
    expect(html).toContain("&lt;img");
    expect(html).toContain("&lt;strong&gt;General Fund&lt;/strong&gt;");
  });

  it("generates a valid receipt PDF for email attachments", async () => {
    const pdf = await generateReceiptPdf({
      name: "Ada Donor",
      email: "donor@example.com",
      project: "education-drive",
      amount: 25,
      date: "May 30, 2026",
      receiptId: "ADA-2026-PI123",
    });
    const text = new TextDecoder().decode(pdf);

    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text).toContain("Donation Receipt");
    expect(text).toContain("ADA-2026-PI123");
    expect(text).toContain("Not a tax-deductible receipt");
    expect(pdf.byteLength).toBeGreaterThan(1000);
  });
});
