/**
 * Read-only plan for the ADA About milestone correction. From Studio:
 *   npx sanity exec plan-bamenda-2024.ts --with-user-token
 *
 * This file does not mutate published or draft documents. Review the output
 * against current content before an authorized, revision-checked update.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-03-28" }).withConfig({
  useCdn: false, perspective: "raw",
});
const { projectId, dataset } = client.config();
if (projectId !== "rj2m21gk" || dataset !== "production") {
  throw new Error("This plan applies to ADA production only.");
}

type Entry = { _key?: string; year?: string; event?: string; eventFr?: string };
type Row = { _id: string; _type: string; _rev: string; timeline?: Entry[] };
const before = {
  year: "2025",
  event: "Our outreach work began in Bamenda.",
  eventFr: "Début de nos actions à Bamenda.",
};
const after = {
  year: "2024",
  event: "Our first Back to School Outreach in Bamenda.",
  eventFr: "Notre première action de rentrée scolaire à Bamenda.",
};

async function main() {
  const rows = await client.fetch<Row[]>(
    `*[_id in ["aboutPage", "drafts.aboutPage"] || (_id in path("versions.**") && _type == "aboutPage")]{
      _id, _type, _rev, timeline[]{_key, year, event, eventFr}
    }`,
  );
  if (rows.some(row => row._id !== "aboutPage")) {
    throw new Error("An About draft or release version exists. Reconcile it manually before updating production.");
  }
  const [row] = rows;
  if (rows.length !== 1 || row?._type !== "aboutPage" || !row._rev) {
    throw new Error("Expected exactly one published ADA About document.");
  }
  const matches = row.timeline?.filter(entry => entry._key === "tl4") ?? [];
  if (matches.length !== 1) throw new Error("Expected exactly one timeline entry keyed tl4.");
  const [entry] = matches;
  const equals = (expected: typeof before) =>
    (Object.keys(expected) as Array<keyof typeof before>).every(key => entry[key] === expected[key]);
  if (equals(after)) {
    console.log("About timeline tl4 already matches the 2024 correction. No writes.");
    return;
  }
  if (!equals(before)) throw new Error("Current timeline tl4 differs from the reviewed source. No patch proposed.");
  const path = 'timeline[_key=="tl4"]';
  console.log(JSON.stringify({
    dryRun: true,
    patch: {
      id: row._id,
      ifRevisionID: row._rev,
      set: Object.fromEntries(Object.entries(after).map(([field, value]) => [`${path}.${field}`, value])),
    },
    before,
    untouched: ["all other timeline items", "drafts", "Team documents", "outreach archive records"],
  }, null, 2));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
