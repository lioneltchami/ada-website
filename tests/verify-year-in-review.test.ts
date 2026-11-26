import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { verifyYearInReview } from "../scripts/verify-year-in-review.mjs";

const text = { en: "English copy", fr: "Texte français" };
const annualReview = {
  year: 2026,
  lead: text,
  account: text,
  closing: text,
  features: [{ slug: "outreach-one", ...text }, { slug: "outreach-two", ...text }],
};

async function fixture(check: (root: string, dir: string) => Promise<void>) {
  const root = await mkdtemp(join(tmpdir(), "ada-annual-release-"));
  const dir = join(root, "public/docs/year-in-review");
  try {
    await mkdir(dir, { recursive: true });
    await mkdir(join(root, "content"));
    await writeFile(join(root, "content/year-in-review.json"), JSON.stringify([annualReview]));
    await check(root, dir);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

describe("annual PDF release gate", () => {
  it("verifies the public source/PDF pairs", async () => {
    await expect(verifyYearInReview(process.cwd())).resolves.toBeGreaterThan(0);
  });

  it("rejects a published source without its PDF", async () => {
    await fixture(async (root) => {
      await expect(verifyYearInReview(root)).rejects.toThrow("Missing published Year in Review PDF");
    });
  });

  it("rejects an unlisted public draft", async () => {
    await fixture(async (root, dir) => {
      await writeFile(join(dir, "ADA-2026-Year-in-Review-Draft.pdf"), "");
      await expect(verifyYearInReview(root)).rejects.toThrow("Unlisted public Year in Review file");
    });
  });

  it("rejects a draft or wrong year PDF even if renamed", async () => {
    await fixture(async (root, dir) => {
      const path = join(dir, "ADA-2026-Year-in-Review.pdf");
      await writeFile(path, "%PDF-1.4\n/Title (ADA 2026 Year in Review - Working draft)\n");
      await expect(verifyYearInReview(root)).rejects.toThrow("mismatched title");
      const wrongYear = await readFile("public/docs/year-in-review/ADA-2025-Year-in-Review.pdf");
      await writeFile(path, wrongYear);
      await expect(verifyYearInReview(root)).rejects.toThrow("mismatched title");
    });
  });

  it("rejects duplicate published years", async () => {
    await fixture(async (root) => {
      await writeFile(join(root, "content/year-in-review.json"), JSON.stringify([annualReview, annualReview]));
      await expect(verifyYearInReview(root)).rejects.toThrow("Duplicate Year in Review year");
    });
  });
});
