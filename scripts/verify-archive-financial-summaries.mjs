import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = process.argv[2] || "dist/client";
const area = "/projects/archive/";
const strip = text => text.replace(/<[^>]*>/g, "").trim();
for (const prefix of ["", "/fr"]) {
  const index = await readFile(root + prefix + area + "index.html", "utf8");
  const cards = [...index.matchAll(/<a\b([^>]*\bclass="[^"]*\barchive-item\b[^"]*"[^>]*)>([\s\S]*?)<\/a>/g)];
  assert.ok(cards.length > 0, prefix + " archive has no cards");
  for (const [, attrs, body] of cards) {
    const path = attrs.match(/href="([^"]+)"/)?.[1];
    assert.ok(path?.startsWith(prefix + area), attrs);
    const detail = await readFile(root + path.replace(/\/$/, "") + "/index.html", "utf8");
    const summaries = [...detail.matchAll(/<section\b([^>]*data-archive-financial-summary="([^"]+)"[^>]*)>([\s\S]*?)<\/section>/g)];
    assert.equal(summaries.length, 1, path + " must show one financial summary");
    const [, , state, summary] = summaries[0];
    assert.match(summary, /<h2 id="archive-financial-heading"[^>]*>[^<]+<\/h2>/);
    assert.ok([...summary.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].some(m => strip(m[1]).length > 24), path + " needs context");
    const cardAmount = body.match(/data-archive-local-finance-fcfa="(\d+)"/)?.[1];
    const detailAmount = summary.match(/data-archive-financial-figure="(\d+)"/)?.[1];
    if (state === "published" && cardAmount) {
      assert.equal(detailAmount, cardAmount, path + " must show the same sourced FCFA amount as its archive card");
      assert.match(summary, /FCFA/);
    }
    if (state === "not-published") {
      assert.equal(detailAmount, undefined, path + " must not expose unconfirmed figures");
      assert.doesNotMatch(summary, /data-archive-financial-figure/);
    }
    assert.doesNotMatch(detail, /<dt[^>]*>Budget \(USD\)<\/dt>/, path + " must not repeat an old USD field");
  }
  console.log(`Verified ${cards.length} consistent financial summaries (${prefix || "en"}).`);
}
