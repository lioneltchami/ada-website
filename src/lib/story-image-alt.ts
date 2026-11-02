const filenameOnlyAlt = /(?:^|[\\/])[\w-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i;

export function resolveStoryImageAlt(
  alt: string | null | undefined,
  title: string | null | undefined,
  fallback: string,
): string {
  const candidate = alt?.trim();
  if (candidate && !filenameOnlyAlt.test(candidate)) return candidate;
  return title?.trim() || fallback;
}
