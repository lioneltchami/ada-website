import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join, resolve } from "node:path";

export async function verifyYearInReview(root) {
  const reviews = JSON.parse(await readFile(join(root, "content/year-in-review.json"), "utf8"));
  if (!Array.isArray(reviews) || reviews.length === 0) throw new Error("No published Year in Review source records");

  const names = new Set();
  for (const { year, lead, account, closing, features } of reviews) {
    if (!Number.isInteger(year) || year < 2021 || year > 9999) throw new Error("Invalid Year in Review year: " + year);
    const name = `ADA-${year}-Year-in-Review.pdf`;
    if (names.has(name)) throw new Error("Duplicate Year in Review year: " + year);
    names.add(name);
    const bilingual = (section) => ["en", "fr"].every((lang) => typeof section?.[lang] === "string" && section[lang].trim());
    if (![lead, account, closing].every(bilingual) || !Array.isArray(features) ||
        features.length < 2 || features.length > 4 || !features.every((feature) =>
          bilingual(feature) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(feature.slug))) {
      throw new Error("Invalid bilingual source for Year in Review " + year);
    }
  }

  const dir = join(root, "public/docs/year-in-review");
  const files = await readdir(dir, { withFileTypes: true });
  for (const file of files) {
    if (!file.isFile() || !names.has(file.name)) throw new Error("Unlisted public Year in Review file: " + file.name);
  }
  for (const name of names) {
    if (!files.some((file) => file.name === name)) throw new Error("Missing published Year in Review PDF: " + name);
    const file = await readFile(join(dir, name));
    const year = name.slice(4, 8);
    if (file.subarray(0, 5).toString("ascii") !== "%PDF-" ||
        !file.includes(Buffer.from(`/Title (ADA ${year} Year in Review)`))) {
      throw new Error("Invalid public Year in Review PDF or mismatched title: " + name);
    }
  }
  return names.size;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const count = await verifyYearInReview(fileURLToPath(new URL("../", import.meta.url)));
  console.log(`Year in Review verified: ${count} public source and PDF pairs, no unlisted public files.`);
}
