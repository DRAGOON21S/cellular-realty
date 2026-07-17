// Approved amenity → symbol manifest (spec §5.4.2).
// Each amenity label is paired with the EXACT approved SVG supplied by the client.
// Do not substitute, remap, or use icon-library symbols where an approved symbol exists.
// Files live in /public/amenities/ (slugged for web delivery; the approved source
// filename is noted per entry so the pairing stays auditable — artwork is unchanged).
//
// Amenities with NO approved symbol fall through to the Lucide fallback in
// src/lib/icons.ts (see amenityIcon). Currently flagged as awaiting a symbol:
//   • "Rainwater Harvesting"
//   • "Approx. 2-Acre Community Facility"
// "Lush Green Pockets.svg" is supplied but no current amenity uses that label.

/** Exact data-label → public SVG path. Keys must byte-match projects.json labels. */
export const AMENITY_SVG: Record<string, string> = {
  "24×7 Security": "/amenities/24x7-security.svg", // 24-7 SECURITY.svg
  "Badminton Court": "/amenities/badminton-court.svg", // BADMINTON COURT.svg
  "Commercial Space": "/amenities/commercial-space.svg", // COMMERCIAL SPACE.svg
  "Fresh Water Supply": "/amenities/fresh-water-supply.svg", // FRESH WATER SUPPLY.svg
  "Gated Community": "/amenities/gated-security.svg", // GATED SECURITY.svg
  "Green Pockets": "/amenities/green-pockets.svg", // GREEN POCKETS.svg
  "Jogging Track": "/amenities/jogging-track.svg", // JOGGING TRACK.svg
  "Kids’ Play Area": "/amenities/kids-play-area.svg", // KIDS’ PLAY AREA.svg
  "Milk & Vegetable Booth": "/amenities/milk-vegetable-booth.svg", // Milk & VEGETABLE BOOTH.svg
  "Underground Utilities": "/amenities/underground-utilities.svg", // underground utilities.svg
  "Wide Internal Roads": "/amenities/wide-internal-roads.svg", // Wide Internal Roads.svg
  "WTP & STP": "/amenities/wtp-stp.svg", // WTP & STP.svg
  "Yoga & Central Lawn": "/amenities/yoga-central-lawn.svg", // YOGA & CENTRAL LAWN.svg
  // Spare (supplied, currently unused): "Lush Green Pockets" → /amenities/lush-green-pockets.svg
};

/** Normalize a label for a tolerant secondary match (punctuation/case drift only). */
function norm(label: string): string {
  return label
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/[’‘']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

const NORM_INDEX: Record<string, string> = Object.fromEntries(
  Object.entries(AMENITY_SVG).map(([label, path]) => [norm(label), path]),
);

/** Return the approved SVG path for an amenity label, or null if none is paired. */
export function amenitySvg(label: string): string | null {
  return AMENITY_SVG[label] ?? NORM_INDEX[norm(label)] ?? null;
}
