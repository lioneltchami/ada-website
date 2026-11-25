/**
 * Assign project mainImage (+ missing story personPhoto) from existing gallery assets.
 * Does not use promotional or unrelated images for reviewed archive records.
 *
 * Run: npx tsx sanity/patch-cover-images.ts
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import releases2026 from "../config/project-records-2026.json";
import { homedir } from "os";
import { join } from "path";

const protectedProjectIds = new Set([
  ...releases2026.projects.map(({ slug }) => `project-${slug}`),
  "project-education-orphans",
]);

const token =
  process.env.SANITY_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  (() => {
    try {
      return JSON.parse(
        readFileSync(
          join(homedir(), ".config", "sanity", "config.json"),
          "utf-8",
        ),
      ).authToken as string;
    } catch {
      return undefined;
    }
  })();

if (!token) {
  console.error("No Sanity token found");
  process.exit(1);
}

const client = createClient({
  projectId: "rj2m21gk",
  dataset: "production",
  apiVersion: "2026-03-28",
  token,
  useCdn: false,
});

type ImageRef = {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
  alt?: string;
};

function imageFromRef(ref: string, alt: string): ImageRef {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: ref },
    alt,
  };
}

async function main() {
  const gallery = await client.fetch<
    {
      title: string;
      photo?: { asset?: { _ref?: string }; alt?: string };
      projectId?: string;
    }[]
  >(`*[_type == "galleryImage" && defined(photo.asset._ref)]{
    title,
    photo { asset { _ref }, alt },
    "projectId": project->_id
  }`);

  const byProject = new Map<string, { ref: string; alt: string }>();
  for (const g of gallery) {
    if (!g.projectId || protectedProjectIds.has(g.projectId) || !g.photo?.asset?._ref) continue;
    if (byProject.has(g.projectId)) continue;
    byProject.set(g.projectId, {
      ref: g.photo.asset._ref,
      alt: g.photo.alt || g.title,
    });
  }

  console.log("Patching project mainImage…");
  for (const [projectId, img] of byProject) {
    await client
      .patch(projectId)
      .set({ mainImage: imageFromRef(img.ref, img.alt) })
      .commit();
    console.log(`✓ ${projectId}`);
  }

  // Fill remaining story covers (updates/announcements without personPhoto)
  const storyCovers: { id: string; ref: string; alt: string }[] = [
    {
      id: "post-1",
      ref: byProject.get("project-widow-support")?.ref || "",
      alt: "Impact from donor support across ADA programs",
    },
    {
      id: "post-3",
      ref: byProject.get("project-education-drive")?.ref || "",
      alt: "Back-to-school supply distribution",
    },
    {
      id: "post-5",
      ref: byProject.get("project-emergency-relief")?.ref || "",
      alt: "Community clean-up volunteers in Bamenda",
    },
    {
      id: "post-7",
      ref: "", // Withdrawn project image source; do not repopulate story covers.
      alt: "Transparency and program delivery documentation",
    },
    {
      id: "post-9",
      ref: byProject.get("project-christmas-giving")?.ref || "",
      alt: "Christmas giving campaign distribution",
    },
    {
      id: "post-10",
      ref: byProject.get("project-widow-support")?.ref || "",
      alt: "Community members supported by ADA volunteers",
    },
    {
      id: "post-11",
      ref: byProject.get("project-emergency-relief")?.ref || "",
      alt: "Community infrastructure and clean-water related outreach",
    },
    {
      id: "post-12",
      ref: "", // Withdrawn project image source; do not repopulate story covers.
      alt: "ADA program celebration and community gathering",
    },
  ].filter((row) => Boolean(row.ref));

  console.log("Patching story personPhoto where missing…");
  for (const story of storyCovers) {
    const existing = await client.fetch<string | null>(
      `*[_id == $id][0].personPhoto.asset._ref`,
      { id: story.id },
    );
    if (existing) {
      console.log(`· skip ${story.id} (already has photo)`);
      continue;
    }
    await client
      .patch(story.id)
      .set({ personPhoto: imageFromRef(story.ref, story.alt) })
      .commit();
    console.log(`✓ ${story.id}`);
  }

  const projectsWithImage = await client.fetch<number>(
    `count(*[_type == "project" && defined(mainImage.asset._ref)])`,
  );
  const projects = await client.fetch<number>(`count(*[_type == "project"])`);
  const storiesWithPhoto = await client.fetch<number>(
    `count(*[_type == "blogPost" && defined(personPhoto.asset._ref)])`,
  );
  const stories = await client.fetch<number>(`count(*[_type == "blogPost"])`);

  console.log("Verified:", {
    projectsWithImage,
    projects,
    storiesWithPhoto,
    stories,
  });
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
