// Gallery cover-only manifest: images that must NOT appear inside the Project
// Gallery lightbox, but MAY still be used as a category cover / thumbnail.
//
// Business rule (client): the gallery a visitor opens must show REAL on-site
// photographs only. AI-generated / CGI marketing renders (and designed marketing
// composites) are allowed as a cover for their polish, never inside the gallery.
//
// There is no reliable automatic detector and the CMS carries no origin flag, so
// membership here is a deliberate, human-confirmed decision (visual review). Add the
// exact public `src` path (as it appears in the gallery data) of any image to keep it
// out of the gallery. Anything NOT listed is treated as a real photo and may appear.
//
// To reclassify an image: move its path in or out of this set. That's the only edit
// needed — the gallery derivation in projects/[slug].astro reads it automatically.
export const aiImages = new Set<string>([
  // --- South City Greens: every public gallery image is a CGI/AI render ---
  "/media/projects/south-city-greens/hero/south-city-greens-hero-entrance-gate.webp",
  "/media/projects/south-city-greens/amenities/south-city-greens-park-play-area.webp",
  "/media/projects/south-city-greens/gallery/south-city-greens-central-park.webp",
  "/media/projects/south-city-greens/amenities/south-city-greens-jogging-track.webp",
  "/media/projects/south-city-greens/amenities/south-city-greens-sports-court.webp",
  "/media/projects/south-city-greens/amenities/south-city-greens-convenience-shopping.webp",

  // --- South City 1 ---
  "/media/projects/south-city-1/gallery/south-city-1-central-park-aerial.webp", // idealized/AI-enhanced sunset aerial
  "/media/projects/south-city-1/gallery/south-city-1-entrance-gate.webp", // CGI render (mirror-symmetric, HDR sky)
  "/media/projects/south-city-1/gallery/south-city-1-internal-road.webp", // painterly / illustrated render
  // Not AI, but a designed marketing collage with a baked-in caption — not a clean
  // gallery photo, so kept out of the lightbox (cover-only).
  "/media/projects/south-city-1/gallery/south-city-1-central-park-collage.webp",

  // --- South City 2 ---
  "/media/projects/south-city-2/amenities/south-city-2-amenities-park.webp", // blue-hour CGI render
  "/media/projects/south-city-2/gallery/south-city-2-tree-lined-avenue.webp", // idealized golden render
  "/media/projects/south-city-2/gallery/south-city-2-entrance-avenue.webp", // CGI render (warped flags/topiary)
]);

/** True when `src` is cover-only (AI/CGI render or marketing composite) and excluded from the gallery. */
export function isAiImage(src: string | null | undefined): boolean {
  return !!src && aiImages.has(src);
}
