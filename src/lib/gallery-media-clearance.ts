/**
 * Public gallery publication is opt-in for the exact CMS record and image.
 *
 * The historical gallery seed data is not a provenance or consent record. A
 * campaign reference, an upload filename, and an approved use in a separate
 * report do not independently clear an image for this gallery. Only add an
 * entry after checking the exact source image, its permission and publication
 * scope, and the bilingual caption against an identified outreach. Do not
 * store private consent records or personal details in this public source.
 */
export interface ClearedGalleryMedia {
  readonly id: string;
  readonly assetRef: string;
  readonly year: number;
  /** Verified capture date (YYYY-MM-DD), if documented. */
  readonly date?: string;
  readonly caption: string;
  readonly captionFr: string;
  readonly alt: string;
  readonly altFr: string;
  /** Exact archive entry, if the event and source match have been verified. */
  readonly archiveSlug?: string;
}

const CLEARED_GALLERY_MEDIA: readonly ClearedGalleryMedia[] = [];

// Explicit cross-surface hold for the exact historical assets. Track Sanity's
// asset hash, not the record's mutable title or URL resizing parameters.
const WITHHELD_ASSET_HASHES = new Set([
  "ec7c3db9f63fc5cd6fce17378dc687550042b82d", // gallery-1: Bamenda/year and permission unverified
  "a7226b4c89fe8b2320801ec9546babbee36b854d", // gallery-2: already withheld training content
  "0db3d6effd4ef4bde86aefd5269a4de9fe5f22c0", // gallery-3: legacy label/date; shared with 2023 widows record
  "9c544ffcea465e5a66c4ad9885ef108dafe383ce", // gallery-4: indoor scene captioned as cleanup
  "3a792aebf4bbedc981d28e6002d5db5926ee96db", // gallery-5: legacy label conflicts with known asset reuse
  "50d291ca9440219e29697b0cc99b355f8d590da2", // gallery-6: already withheld training content
  "02bd09413bd429a7cb9677a9368392642774671e", // gallery-7: cleanup, misdated/mislinked, exact clearance unverified
  "2152c5a90b06cad5a62b5f582b0d836a8b6c54e3", // gallery-8: cleanup image labeled as education
  "b53764203b2682009944b856eaa5920afad93da3", // gallery-9: identifiable participants, permission unverified
  "9909bd7153695fc41b8d80f0a5656e17de210da8", // gallery-10: children, event and permission unverified
  "c61680ea417e75d3fcb13f4a245138209cac4eef", // gallery-11: maternity visit context/permissions unverified
  "edc2f2636d0dc93ab0405ea0bd67f8b6f4f1f308", // gallery-13: already held, conflicting city/year reuse
  "efa3a07277351eb6f5bbb587fa2babd234c50d8f", // gallery-14: identifiable children; school photo restriction
  "85d73f4797b625e01e2a66df43cea27625e0ad72", // gallery-15: orphanage context/permission unverified; already withheld
]);

/**
 * Is this a specifically held historical asset? Accept a Sanity image ref or
 * a direct Sanity CDN image URL, including a transformed/resized URL.
 *
 * False means "not on this specific hold list", not "approved for the gallery".
 * Gallery and homepage mosaic callers must use getClearedGalleryMedia instead.
 */
export function isWithheldGalleryAsset(assetRef?: string | null): boolean {
  if (!assetRef) return false;
  const directRef = /^image-([0-9a-f]{40})-\d+x\d+-[a-z0-9]+$/i.exec(assetRef);
  if (directRef) return WITHHELD_ASSET_HASHES.has(directRef[1].toLowerCase());

  try {
    const url = new URL(assetRef.startsWith("//") ? `https:${assetRef}` : assetRef);
    if (!["https:", "http:"].includes(url.protocol) || url.hostname !== "cdn.sanity.io") {
      return false;
    }
    const cdnRef = /^\/images\/[^/]+\/[^/]+\/([0-9a-f]{40})-\d+x\d+\.[a-z0-9]+$/i.exec(url.pathname);
    return cdnRef ? WITHHELD_ASSET_HASHES.has(cdnRef[1].toLowerCase()) : false;
  } catch {
    return false;
  }
}

export function getClearedGalleryMedia(
  id?: string | null,
  assetRef?: string | null,
): ClearedGalleryMedia | undefined {
  if (!id || !assetRef || isWithheldGalleryAsset(assetRef)) return undefined;
  return CLEARED_GALLERY_MEDIA.find(entry => entry.id === id && entry.assetRef === assetRef);
}
