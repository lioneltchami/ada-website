import { describe, expect, it } from "vitest";
import { localizeProjectsIndexFallback, selectProjectsIndexImage } from "../src/lib/projects-index-presentation";

describe("Projects landing image provenance", () => {
  it("suppresses a generic project placeholder instead of calling it a project visual", () => {
    expect(selectProjectsIndexImage({
      slug: "archive-example",
      imageUrl: "/project-placeholder.svg",
      imageAlt: "Project visual",
    }, "en")).toBeUndefined();
  });

  it("does not use the unrelated cleanup photo for relief, in either locale", () => {
    const cleanup = {
      slug: "emergency-relief",
      imageUrl: "https://cdn.sanity.io/images/project/production/edc2f2636d0dc93ab0405ea0bd67f8b6f4f1f308-800x450.jpg",
      imageAlt: "Community gathering for clean-up",
    };
    expect(selectProjectsIndexImage(cleanup, "en")).toBeUndefined();
    expect(selectProjectsIndexImage({ ...cleanup, imageAlt: "Rassemblement communautaire" }, "fr")).toBeUndefined();
  });

  it("localizes known matching images without replacing alt for future uploads", () => {
    const education = {
      slug: "education-drive",
      imageUrl: "https://cdn.sanity.io/images/project/production/efa3a07277351eb6f5bbb587fa2babd234c50d8f-800x450.jpg",
      imageAlt: "School supplies distribution day",
    };
    expect(selectProjectsIndexImage(education, "fr")?.alt).toBe("Distribution de fournitures scolaires");
    expect(selectProjectsIndexImage({
      ...education,
      imageUrl: "https://cdn.sanity.io/images/project/production/new-file.jpg",
      imageAlt: "Matériel de classe",
    }, "fr")?.alt).toBe("Matériel de classe");
  });
});

describe("Projects landing CMS fallback", () => {
  it("keeps known fallback cards localized without changing the underlying lifecycle", () => {
    const project = {
      slug: "education-drive",
      title: "Annual Education Drive",
      description: "School supplies support",
      location: "Rural Areas",
      status: "active",
    };
    expect(localizeProjectsIndexFallback(project, "fr")).toMatchObject({
      title: "Campagne annuelle d’éducation",
      location: "Zones rurales",
      status: "active",
    });
    expect(localizeProjectsIndexFallback(project, "en")).toBe(project);
  });
});
