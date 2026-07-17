import { projects } from "./cms";

export type MapStatus = "Ongoing" | "Completed" | "Upcoming";

export interface ProjectMapItem {
  id: string;
  name: string;
  shortName: string;
  location: string;
  cityLabel: string;
  status: MapStatus;
  /** viewBox coordinates (0 0 1000 750). */
  position: { x: number; y: number };
  description: string;
  details: string[];
  cta:
    | { kind: "link"; label: string; href: string }
    | { kind: "enquire"; label: string; project: string };
  image: string | null;
}

/** Reference-only locations (labels, no project marker). */
export interface MapCity {
  name: string;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  /** hide on small screens to avoid clutter */
  secondary?: boolean;
}

// CMS status → display label (keeps the map consistent with the grid on the same page).
const STATUS_MAP: Record<string, MapStatus> = {
  Delivered: "Completed",
  Ongoing: "Ongoing",
  Upcoming: "Upcoming",
};
const CTA_LABEL: Record<MapStatus, string> = {
  Completed: "View Project",
  Ongoing: "Explore Project",
  Upcoming: "Register Interest",
};

// Map-specific presentation, keyed by CMS project id. Names/status/href are pulled
// from lib/cms so they never drift from the rest of the site. Details are neutral,
// verified facts only (no "2 minutes from 75-metre road" — the site says "Directly Connected").
const META: Record<
  string,
  { shortName: string; cityLabel: string; position: { x: number; y: number }; description: string; details: string[] }
> = {
  SCG: {
    shortName: "SC Greens",
    cityLabel: "Jhajjar",
    position: { x: 238, y: 208 },
    description:
      "A premium plotted township in Sector 36, Jhajjar, designed around green spaces, modern infrastructure and long-term regional growth.",
    details: ["380 plots", "Deen Dayal Jan Awas Yojana", "DTCP 84 of 2026"],
  },
  SC2: {
    shortName: "South City 2",
    cityLabel: "Jhajjar",
    position: { x: 292, y: 246 },
    description: "A plotted development in Sector 37, Jhajjar, planned across 210 residential plots.",
    details: ["210 plots", "Deen Dayal Jan Awas Yojana", "DTCP 98 of 2024"],
  },
  SC1: {
    shortName: "South City 1",
    cityLabel: "Jhajjar",
    position: { x: 210, y: 272 },
    description: "A completed plotted community in Jhajjar comprising 172 residential plots.",
    details: ["172 plots", "Delivered community", "DTCP 82 of 2023"],
  },
  MKJ: {
    shortName: "Maruti Kunj",
    cityLabel: "Farrukhnagar",
    position: { x: 470, y: 402 },
    description:
      "A strategically located plotted community in Farrukhnagar with strong access to the Gurugram–Jhajjar Highway and KMP Expressway.",
    details: ["242 plots", "Deen Dayal Jan Awas Yojana", "DTCP 18 of 2017"],
  },
};

function fromCms(id: string): ProjectMapItem | null {
  const p = projects.find((x) => x.id === id);
  const m = META[id];
  if (!p || !m) return null;
  const status = STATUS_MAP[p.status] ?? "Upcoming";
  return {
    id,
    name: p.name,
    shortName: m.shortName,
    location: p.locationShort.includes(p.state) ? p.locationShort : `${p.locationShort}, ${p.state}`,
    cityLabel: m.cityLabel,
    status,
    position: m.position,
    description: m.description,
    details: m.details,
    cta: { kind: "link", label: CTA_LABEL[status], href: `/projects/${p.slug}` },
    image: p.cardImage ?? null,
  };
}

export const projectMapItems: ProjectMapItem[] = [
  fromCms("SCG"),
  fromCms("SC2"),
  fromCms("SC1"),
  fromCms("MKJ"),
  // Synthetic Rewari cluster — groups the upcoming Cellular City developments into one
  // marker whose CTA opens the enquiry modal (no detail-page link).
  {
    id: "REWARI",
    name: "Upcoming Rewari Projects",
    shortName: "Rewari",
    location: "Rewari, Haryana",
    cityLabel: "Rewari",
    status: "Upcoming",
    position: { x: 300, y: 612 },
    description:
      "Future plotted-development opportunities planned for the emerging Rewari growth corridor.",
    details: ["Two upcoming developments", "Rewari, Haryana", "Under land procurement"],
    cta: { kind: "enquire", label: "Register Interest", project: "Upcoming Rewari Projects" },
    image: null,
  },
].filter((x): x is ProjectMapItem => Boolean(x));

/** Reference locations that anchor the corridor without their own project markers. */
export const mapCities: MapCity[] = [
  { name: "New Delhi", x: 872, y: 116, anchor: "end" },
  { name: "IGI Airport", x: 842, y: 236, anchor: "end", secondary: true },
  { name: "Gurugram", x: 726, y: 312, anchor: "middle" },
  { name: "Sector 85", x: 700, y: 458, anchor: "middle", secondary: true },
  { name: "Sohna", x: 812, y: 558, anchor: "start", secondary: true },
];
