// Maps CMS amenity `Icon Suggestion` keys to valid Lucide icon names (astro-icon).
const AMENITY_ICON: Record<string, string> = {
  gate: "fence",
  shield: "shield-check",
  leaf: "leaf",
  activity: "activity",
  play: "blocks",
  store: "store",
  water: "droplet",
  trees: "trees",
  "shopping-bag": "shopping-bag",
  zap: "zap",
  road: "route",
  droplets: "droplets",
  "cloud-rain": "cloud-rain",
  racket: "dumbbell",
  map: "map",
};

export const amenityIcon = (key: string): string =>
  `lucide:${AMENITY_ICON[key?.toLowerCase()] ?? "check"}`;

// Connectivity category → icon
const CONNECTIVITY_ICON: Record<string, string> = {
  transport: "train-front",
  highway: "milestone",
  employment: "briefcase",
  healthcare: "heart-pulse",
  education: "graduation-cap",
  leisure: "trees",
  airport: "plane",
  city: "building-2",
  region: "map-pinned",
  convenience: "shopping-cart",
};
export const connectivityIcon = (cat: string): string =>
  `lucide:${CONNECTIVITY_ICON[cat?.toLowerCase()] ?? "map-pin"}`;
