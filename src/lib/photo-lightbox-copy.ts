export type PhotoLightboxLocale = "en" | "fr";

export function getPhotoLightboxCopy(
  locale: PhotoLightboxLocale,
  projectTitle: string,
  index: number,
  total: number,
  caption?: string,
) {
  const photoDescription = caption || projectTitle;

  if (locale === "fr") {
    return {
      thumbnail: `Voir la photo ${index + 1} sur ${total} : ${photoDescription}`,
      dialog: `Photo ${index + 1} sur ${total} : ${projectTitle}`,
      close: "Fermer la galerie de photos",
      previous: "Photo précédente",
      next: "Photo suivante",
      goTo: `Aller à la photo ${index + 1}`,
    };
  }

  return {
    thumbnail: `View photo ${index + 1} of ${total}: ${photoDescription}`,
    dialog: `Photo ${index + 1} of ${total}: ${projectTitle}`,
    close: "Close photo gallery",
    previous: "Previous photo",
    next: "Next photo",
    goTo: `Go to photo ${index + 1}`,
  };
}
