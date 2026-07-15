// Typed access layer over the generated CMS data (src/data/generated/*).
// Regenerate the JSON with `npm run cms`. Facts here trace to the Excel Data Pack.

import projectsData from "../data/generated/projects.json";
import testimonialsData from "../data/generated/testimonials.json";
import articlesData from "../data/generated/articles.json";
import leadershipData from "../data/generated/leadership.json";
import neighbourhoodData from "../data/generated/neighbourhood.json";
import optionsData from "../data/generated/options.json";
import globalContentData from "../data/generated/global-content.json";

export type ProjectStatus = "Delivered" | "Ongoing" | "Upcoming";
export type ShowFlag = "yes" | "optional" | "no";

export interface Amenity {
  projectId: string;
  amenity: string;
  category: string;
  label: string;
  icon: string;
  status: string;
  order: number;
  show: ShowFlag;
}
export interface Connectivity {
  projectId: string;
  category: string;
  place: string;
  distance: string;
  description: string | null;
  order: number;
  show: ShowFlag;
}
export interface GalleryItem {
  projectId: string;
  type: string;
  title: string;
  src: string | null;
  alt: string;
  caption: string | null;
  sourceType: string;
  order: number;
  show: ShowFlag;
}
export interface TimelinePhase {
  projectId: string;
  phase: string;
  title: string;
  status: string;
  targetDate: string | null;
  proof: string | null;
  description: string | null;
  order: number;
  show: ShowFlag;
}
export interface DownloadItem {
  projectId: string;
  type: string;
  title: string;
  file: string | null;
  available: boolean;
  gated: boolean;
  modalTitle: string | null;
  modalBody: string | null;
  buttonText: string;
  show: ShowFlag;
}
export interface NeighbourhoodItem {
  region: string;
  category: string;
  landmark: string;
  distance: string;
  show: boolean | ShowFlag;
}
export interface Project {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  launchTag: string | null;
  locationShort: string;
  city: string;
  state: string;
  projectType: string | null;
  scheme: string | null;
  landAreaDisplay: string | null;
  landAreaExact: string | null;
  totalPlots: string | null;
  plotSizes: string | null;
  dtcpLicence: string | null;
  reraNumber: string | null;
  reraQr: string | null;
  verificationStatus: string;
  legalNotes: string;
  cardDescription: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroDescription: string | null;
  section01Title: string | null;
  section01Body: string | null;
  primaryCta: string | null;
  secondaryCta: string | null;
  brochureLink: string | null;
  progressReportLink: string | null;
  view3dLink: string | null;
  layoutPlanLink: string | null;
  heroImage: string | null;
  cardImage: string | null;
  ogImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  displayOrder: number;
  comingSoon: boolean;
  amenities: Amenity[];
  connectivity: Connectivity[];
  gallery: GalleryItem[];
  timeline: TimelinePhase[];
  downloads: DownloadItem[];
  neighbourhood: NeighbourhoodItem[];
}
export interface Testimonial {
  id: string;
  projectId: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string | null;
  order: number;
  show: boolean;
}
export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  excerpt: string;
  image: string | null;
  relatedProjectId: string | null;
  body: string | null;
  show: boolean;
}
export interface Leader {
  name: string;
  designation: string;
  bio: string;
  image: string | null;
  order: number;
  show: boolean;
}

export const projects = projectsData as unknown as Project[];
export const testimonials = testimonialsData as unknown as Testimonial[];
export const articles = articlesData as unknown as Article[];
export const leadership = leadershipData as unknown as Leader[];
export const neighbourhood = neighbourhoodData as unknown as NeighbourhoodItem[];
export const options = optionsData as Record<string, string[]>;
export const globalContent = globalContentData as Record<string, string>;

// ---- helpers --------------------------------------------------------------
export const publishedProjects = projects.filter((p) => p.published);

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

/** Listing-tab order per content spec: Ongoing · Delivered · Upcoming */
export const projectTabs: { key: ProjectStatus; label: string }[] = [
  { key: "Ongoing", label: "Ongoing" },
  { key: "Delivered", label: "Delivered" },
  { key: "Upcoming", label: "Upcoming" },
];

export const projectsByStatus = (status: ProjectStatus): Project[] =>
  projects.filter((p) => p.status === status).sort((a, b) => a.displayOrder - b.displayOrder);

/** Featured on the homepage (content spec): SCG, SC2, SC1 in that order */
export const featuredProjects: Project[] = ["SCG", "SC2", "SC1"]
  .map((id) => projects.find((p) => p.id === id))
  .filter((p): p is Project => Boolean(p));

export const neighbourhoodByRegion = (region: string): NeighbourhoodItem[] =>
  neighbourhood.filter((n) => n.region.toLowerCase() === region.toLowerCase());

/** "Interested In" options for the enquiry form (content spec). */
export const enquiryProjectOptions: string[] = [
  ...publishedProjects.filter((p) => !p.comingSoon).map((p) => p.name),
  "Upcoming Rewari Projects",
  "Not Sure Yet",
];
