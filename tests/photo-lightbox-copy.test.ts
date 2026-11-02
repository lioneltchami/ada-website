import { describe, expect, it } from "vitest";
import { getPhotoLightboxCopy } from "../src/lib/photo-lightbox-copy";

describe("localized project photo controls", () => {
  it("gives each English thumbnail and dialog a contextual accessible name", () => {
    expect(
      getPhotoLightboxCopy("en", "Campus Cleanup", 1, 3, "Volunteers at work"),
    ).toEqual({
      thumbnail: "View photo 2 of 3: Volunteers at work",
      dialog: "Photo 2 of 3: Campus Cleanup",
      close: "Close photo gallery",
      previous: "Previous photo",
      next: "Next photo",
      goTo: "Go to photo 2",
    });
  });

  it("provides French labels and a useful fallback when a caption is missing", () => {
    expect(getPhotoLightboxCopy("fr", "Nettoyage du campus", 0, 2)).toEqual({
      thumbnail: "Voir la photo 1 sur 2 : Nettoyage du campus",
      dialog: "Photo 1 sur 2 : Nettoyage du campus",
      close: "Fermer la galerie de photos",
      previous: "Photo précédente",
      next: "Photo suivante",
      goTo: "Aller à la photo 1",
    });
  });
});
