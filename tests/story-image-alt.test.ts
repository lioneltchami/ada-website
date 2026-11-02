import { describe, expect, it } from "vitest";
import { resolveStoryImageAlt } from "../src/lib/story-image-alt";

describe("resolveStoryImageAlt", () => {
  it("keeps meaningful CMS alt text", () => {
    expect(
      resolveStoryImageAlt("Fabrice speaking with students", "Fabrice's story", "Story image"),
    ).toBe("Fabrice speaking with students");
  });

  it("uses the localized story title when CMS alt text is only a filename", () => {
    expect(resolveStoryImageAlt("fabrice.jpg", "Le parcours de Fabrice", "Image"))
      .toBe("Le parcours de Fabrice");
    expect(resolveStoryImageAlt("/uploads/mama-rose.PNG", "Mama Rose et ses petits-enfants", "Image"))
      .toBe("Mama Rose et ses petits-enfants");
  });

  it("uses a supplied fallback when title and alt are absent", () => {
    expect(resolveStoryImageAlt(" ", " ", "Photo d’ADA")).toBe("Photo d’ADA");
  });
});
