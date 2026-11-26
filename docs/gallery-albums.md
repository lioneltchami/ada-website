# ADA outreach albums

Keep Google Photos as the private library for original material. The ADA
website is the public showcase. Do not embed private albums, use a shared URL
as a storage origin, or transfer an entire original album; choose specific
publishable exports. The gallery has no separate service or login.

1. Match a media item to an exact completed outreach and year. Confirm where
   and when it was taken. Confirm permission for public website publication
   when people are identifiable, especially children or sensitive settings.
   Do not copy consent records, recipient names or other private data into
   website source. Do not use generated imagery or substitute another event.
2. Crop and export publication copies at practical web dimensions, removing
   location metadata from public exports. Provide a factual alt and caption
   in English and French. Say “some of…” where the photo is not the whole team
   or participant group. Keep preparation, action, and detail shots that show
   different steps rather than repeats.
3. Add a cover for a cleared outreach in `src/data/archive-feature-photos.ts`
   and its slug and year in `src/data/gallery-archive-photos.ts`. The same cover
   works on the detail page, archive card and gallery album. Publish a matching
   200px-wide WebP cover thumbnail with metadata stripped in
   `public/images/gallery-thumbnails/` (same basename as the feature image).
   The album automatically includes the additional photos listed for that
   outreach in `src/data/archive-supporting-photos.ts`. Add gallery-only media to `src/data/gallery-albums.ts` instead. Host short,
   approved web video exports under `public/videos/outreaches/`, use both
   language caption tracks for speech or meaningful audio, and do not
   autoplay.
4. For a Sanity-hosted image, both the exact gallery record and exact asset
   must be cleared in `src/lib/gallery-media-clearance.ts` with the matching
   archive slug. Legacy record labels, upload dates or Sanity links do not
   constitute publication clearance.
5. Check both `/gallery/` and `/fr/gallery/` at phone and desktop widths. The
   album should open by keyboard, display its caption, and link to the same
   outreach in the selected language. Leave albums with no cleared cover off
   the gallery.
