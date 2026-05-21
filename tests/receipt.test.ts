import { describe, expect, it } from "vitest";
import { generateReceiptHtml } from "../src/lib/receipt";

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
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<strong>General Fund</strong>");
    expect(html).toContain("&lt;img");
    expect(html).toContain("&lt;strong&gt;General Fund&lt;/strong&gt;");
  });
});
