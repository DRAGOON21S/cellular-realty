// ============================================================================
// Cellular Realty — CMS build step
// Reads content-source/cms-data-pack.xlsx (the source of truth) and emits
// clean, typed JSON into src/data/generated/. Placeholder tokens are nulled
// out; a publish-gate check reports projects that are marked Published=Yes but
// still missing required facts (per the Data Pack README rule).
// ============================================================================
import * as XLSX from "xlsx";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC_XLSX = resolve(ROOT, "content-source/cms-data-pack.xlsx");
const OUT_DIR = resolve(ROOT, "src/data/generated");

// --- placeholder tokens that must never be published (README rule) ----------
const PLACEHOLDERS = new Set([
  "ADD_LINK",
  "ADD_IMAGE",
  "ADD_DOC_LINK",
  "TBD",
  "TO BE CONFIRMED",
  "TO BE UPDATED",
  "NOT AVAILABLE",
  "COMING SOON",
]);

const s = (v) => (v == null ? "" : String(v).trim());
/** clean(): returns trimmed string, or null for empty / placeholder tokens */
const clean = (v) => {
  const t = s(v);
  if (!t) return null;
  if (PLACEHOLDERS.has(t.toUpperCase())) return null;
  return t;
};
const yes = (v) => s(v).toLowerCase() === "yes";
const showFlag = (v) => {
  const t = s(v).toLowerCase();
  return t === "yes" ? "yes" : t === "optional" ? "optional" : "no";
};
const num = (v) => {
  const n = parseFloat(s(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
};

// --- read a sheet as array-of-objects (row 0 = title, row 1 = header) -------
function readSheet(wb, name) {
  const ws = wb.Sheets[name];
  if (!ws) throw new Error(`Sheet not found: ${name}`);
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: "" });
  if (rows.length < 2) return [];
  const headers = rows[1].map((h) => s(h));
  return rows.slice(2).map((r) => {
    const o = {};
    headers.forEach((h, i) => {
      if (h) o[h] = r[i] ?? "";
    });
    return o;
  });
}

// asset path normaliser — CMS uses forward-slash relative paths; we serve the
// media library from /media/<path>. Absolute drive URLs (drive.google.com) pass through.
const asset = (v) => {
  const t = clean(v);
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  return "/media/" + t.replace(/^\/+/, "");
};

// ---------------------------------------------------------------------------
console.log("→ Reading", SRC_XLSX);
const wb = XLSX.read(readFileSync(SRC_XLSX), { type: "buffer" });

// ---- Projects_Master ------------------------------------------------------
const master = readSheet(wb, "Projects_Master").map((r) => ({
  id: s(r["Project ID"]),
  name: s(r["Project Name"]),
  slug: s(r["Slug"]),
  status: s(r["Status"]), // Delivered | Ongoing | Upcoming
  launchTag: clean(r["Launch Tag"]),
  locationShort: s(r["Location Short"]),
  city: s(r["City"]),
  state: s(r["State"]),
  projectType: clean(r["Project Type"]),
  scheme: clean(r["Scheme"]),
  landAreaDisplay: clean(r["Land Area Display"]),
  landAreaExact: clean(r["Land Area Exact"]),
  totalPlots: clean(r["Total Plots"]),
  plotSizes: clean(r["Plot Sizes"]),
  dtcpLicence: clean(r["DTCP Licence"]),
  reraNumber: clean(r["RERA Number"]),
  reraQr: asset(r["RERA QR / Link"]),
  verificationStatus: s(r["Verification Status"]),
  legalNotes: s(r["Legal / Accuracy Notes"]),
  cardDescription: clean(r["Short Card Description"]),
  heroTitle: clean(r["Hero Title"]),
  heroSubtitle: clean(r["Hero Subtitle"]),
  heroDescription: clean(r["Hero Description"]),
  section01Title: clean(r["Section 01 Title"]),
  section01Body: clean(r["Section 01 Body"]),
  primaryCta: clean(r["Primary CTA"]),
  secondaryCta: clean(r["Secondary CTA"]),
  brochureLink: asset(r["Brochure Link"]),
  progressReportLink: asset(r["Progress Report Link"]),
  view3dLink: asset(r["3D View Link"]),
  layoutPlanLink: asset(r["Layout Plan Link"]),
  heroImage: asset(r["Hero Image"]),
  cardImage: asset(r["Card Image"]),
  ogImage: asset(r["OG Image"]),
  seoTitle: clean(r["SEO Title"]),
  seoDescription: clean(r["SEO Description"]),
  published: yes(r["Published"]),
  displayOrder: num(r["Display Order"]) ?? 999,
  comingSoon: s(r["Status"]).toLowerCase() === "upcoming",
}));

// ---- normalized related sheets --------------------------------------------
const amenities = readSheet(wb, "Project_Amenities")
  .map((r) => ({
    projectId: s(r["Project ID"]),
    amenity: s(r["Amenity Name"]),
    category: s(r["Amenity Category"]),
    label: s(r["Display Label"]) || s(r["Amenity Name"]),
    icon: s(r["Icon Suggestion"]),
    status: s(r["Status"]),
    order: num(r["Display Order"]) ?? 999,
    show: showFlag(r["Show on Website"]),
  }))
  .filter((a) => a.projectId && a.show !== "no");

const connectivity = readSheet(wb, "Project_Connectivity")
  .map((r) => ({
    projectId: s(r["Project ID"]),
    category: s(r["Category"]),
    place: s(r["Place / Landmark"]),
    distance: s(r["Distance / Time"]),
    description: clean(r["Description"]),
    order: num(r["Display Order"]) ?? 999,
    show: showFlag(r["Show on Website"]),
  }))
  .filter((c) => c.projectId && c.show !== "no");

const neighbourhoodRows = readSheet(wb, "Neighbourhood")
  .map((r) => ({
    region: s(r["Project ID / Region"]),
    category: s(r["Category"]),
    landmark: s(r["Institution / Landmark"]),
    distance: s(r["Distance / Time"]),
    show: showFlag(r["Show on Website"]),
  }))
  .filter((n) => n.region && n.show !== "no");

const gallery = readSheet(wb, "Project_Gallery")
  .map((r) => ({
    projectId: s(r["Project ID"]),
    type: s(r["Image Type"]),
    title: s(r["Title"]),
    src: asset(r["Image File / URL"]),
    alt: s(r["Alt Text"]),
    caption: clean(r["Caption"]),
    sourceType: s(r["Source Type"]),
    order: num(r["Display Order"]) ?? 999,
    show: showFlag(r["Show on Website"]),
  }))
  .filter((g) => g.projectId && g.show !== "no");

const timeline = readSheet(wb, "Project_Timeline")
  .map((r) => ({
    projectId: s(r["Project ID"]),
    phase: s(r["Phase"]),
    title: s(r["Title"]),
    status: s(r["Status"]),
    targetDate: clean(r["Target Date"]),
    proof: asset(r["Image / Proof Link"]),
    description: clean(r["Description"]),
    order: num(r["Display Order"]) ?? 999,
    show: showFlag(r["Show on Website"]),
  }))
  .filter((t) => t.projectId && t.show !== "no");

const downloads = readSheet(wb, "Downloads")
  .map((r) => {
    const file = asset(r["File / URL"]);
    return {
      projectId: s(r["Project ID"]),
      type: s(r["Download Type"]),
      title: s(r["Title"]),
      file,
      available: !!file,
      gated: yes(r["Gated?"]),
      modalTitle: clean(r["Modal Title"]),
      modalBody: clean(r["Modal Body"]),
      buttonText: clean(r["Button Text"]) || "Download",
      show: showFlag(r["Show on Website"]),
    };
  })
  .filter((d) => d.projectId && d.show !== "no");

// ---- standalone collections -----------------------------------------------
const testimonials = readSheet(wb, "Testimonials")
  .map((r) => {
    const rawImg = s(r["Image"]);
    const image = /^https?:\/\//i.test(rawImg) ? rawImg : null; // some rows have consent text mis-placed here
    return {
      id: s(r["Testimonial ID"]),
      projectId: s(r["Project ID"]),
      name: s(r["Name"]),
      role: s(r["Role / Type"]),
      quote: s(r["Quote"]),
      rating: num(r["Rating"]) ?? 5,
      image,
      order: num(r["Display Order"]) ?? 999,
      show: yes(r["Show on Website"]),
    };
  })
  .filter((t) => t.id && t.show)
  .sort((a, b) => a.order - b.order);

const articles = readSheet(wb, "Articles")
  .map((r) => ({
    id: s(r["Article ID"]),
    title: s(r["Title"]),
    slug: s(r["Slug"]),
    category: s(r["Category"]),
    readTime: s(r["Read Time"]),
    excerpt: s(r["Excerpt"]),
    image: asset(r["Image"]),
    relatedProjectId: clean(r["Related Project ID"]),
    body: asset(r["Body Link / Doc"]), // null until ADD_DOC_LINK resolved
    show: yes(r["Show on Website"]),
  }))
  .filter((a) => a.id && a.show);

const leadership = readSheet(wb, "Leadership")
  .map((r) => ({
    name: s(r["Name"]),
    designation: s(r["Designation"]),
    bio: s(r["Short Bio"]),
    image: asset(r["Image"]),
    order: num(r["Display Order"]) ?? 999,
    show: yes(r["Show on Website"]),
  }))
  .filter((l) => l.name && l.show)
  .sort((a, b) => a.order - b.order);

const globalContent = Object.fromEntries(
  readSheet(wb, "Global_Content").map((r) => [s(r["Key"]), s(r["Value"])]),
);

const options = {};
for (const r of readSheet(wb, "Options")) {
  const list = s(r["List Name"]);
  const val = s(r["Allowed Value"]);
  if (!list || !val) continue;
  (options[list] ??= []).push(val);
}

// ---- attach related data to each project ----------------------------------
const byProject = (arr) => (id) => arr.filter((x) => x.projectId === id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
const projects = master
  .map((p) => ({
    ...p,
    amenities: byProject(amenities)(p.id),
    connectivity: byProject(connectivity)(p.id),
    gallery: byProject(gallery)(p.id),
    timeline: byProject(timeline)(p.id),
    downloads: byProject(downloads)(p.id),
    // Jhajjar projects share the Jhajjar neighbourhood list
    neighbourhood: /jhajjar/i.test(p.city) ? neighbourhoodRows.filter((n) => /jhajjar/i.test(n.region)) : [],
  }))
  .sort((a, b) => a.displayOrder - b.displayOrder);

// ---- publish-gate validation ----------------------------------------------
// A RERA number counts only if it's an actual registration, not a holding note
// like "Registration confirmed; RERA number awaited" (SCG hard go-live gate).
const isRealRera = (v) =>
  !!v && !/awaited|on registration|registration confirmed|to be|pending|coming soon/i.test(v);
const REQUIRED_FOR_PUBLISH = ["reraQr", "heroImage", "cardImage", "ogImage", "seoTitle", "seoDescription"];
const gateReport = [];
for (const p of projects) {
  if (!p.published) continue;
  if (p.comingSoon) continue; // teasers intentionally omit specs
  const missing = REQUIRED_FOR_PUBLISH.filter((f) => !p[f]);
  if (!isRealRera(p.reraNumber)) missing.unshift("reraNumber");
  if (missing.length) gateReport.push({ id: p.id, name: p.name, missing });
}

// ---- write output ---------------------------------------------------------
mkdirSync(OUT_DIR, { recursive: true });
const write = (file, data) => {
  writeFileSync(resolve(OUT_DIR, file), JSON.stringify(data, null, 2) + "\n");
  console.log("  wrote", file, Array.isArray(data) ? `(${data.length})` : "");
};
write("projects.json", projects);
write("testimonials.json", testimonials);
write("articles.json", articles);
write("leadership.json", leadership);
write("neighbourhood.json", neighbourhoodRows);
write("global-content.json", globalContent);
write("options.json", options);
write("meta.json", {
  generatedFrom: "content-source/cms-data-pack.xlsx",
  counts: {
    projects: projects.length,
    published: projects.filter((p) => p.published).length,
    testimonials: testimonials.length,
    articles: articles.length,
    leadership: leadership.length,
  },
  publishGate: gateReport,
});

// ---- report ---------------------------------------------------------------
console.log(`\n✓ ${projects.length} projects (${projects.filter((p) => p.published).length} published), ${testimonials.length} testimonials, ${articles.length} articles, ${leadership.length} leaders`);
if (gateReport.length) {
  console.log("\n⚠ PUBLISH-GATE: these Published projects are missing required facts (fill before real go-live):");
  for (const g of gateReport) console.log(`   • ${g.name} (${g.id}) — missing: ${g.missing.join(", ")}`);
} else {
  console.log("✓ Publish-gate: all published projects have required facts.");
}

// Fail the build only when STRICT_CMS=1 (so dev can proceed with warnings).
if (gateReport.length && process.env.STRICT_CMS === "1") {
  console.error("\n✗ STRICT_CMS=1 and publish-gate failures present. Aborting build.");
  process.exit(1);
}
