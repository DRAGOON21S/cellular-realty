// Global site content — verified from CMS Data Pack › Global_Content sheet (2026-07-15).
// This is hand-authored from the source of truth; project/relational data is generated
// into src/data/generated/ by scripts/build-cms.mjs.

export const site = {
  brand: "Cellular Realty",
  // ⚠️ DO NOT DISPLAY on the website. Kept as CMS/reference data only.
  // The parent entity must NOT appear in any user-facing copy, meta, or structured
  // data until the client explicitly approves showing it. Do not reference site.parentEntity
  // in any page/component/layout.
  parentEntity: "Aditi Infrabuild & Services Limited",
  established: 2005,
  tagline: "Building Communities. Creating Lasting Value.",
  footerLine: "Building Communities • Enabling Growth.",
  domain: "cellularrealty.in",
  url: "https://cellularrealty.in",

  office: {
    label: "Corporate Office",
    lines: [
      "222–223, 2nd Floor, Star Tower",
      "Sector 30, Gurugram, Haryana 122001",
    ],
    full: "222–223, 2nd Floor, Star Tower, Sector 30, Gurugram, Haryana 122001",
  },

  // Show BOTH numbers everywhere (content-spec rule).
  phones: [
    { display: "+91 99585 49955", tel: "+919958549955" },
    { display: "+91 92171 79219", tel: "+919217179219" },
  ],
  // Public "talk to us / questions" address (Zoho aliases enquiries@ and info@ also
  // funnel into this mailbox). This is the ONLY email shown on the site.
  email: "hello@cellularrealty.in",
  // Internal destination for lead-generation form submissions (never displayed).
  // Wire the server-side/Zoho integration to route form leads here by CTA type.
  salesEmail: "sales@cellularrealty.in",
  whatsapp: { number: "919958549955", url: "https://wa.me/919958549955" },

  social: {
    instagram: { handle: "@cellularrealty", url: "https://www.instagram.com/cellularrealty" },
    facebook: { handle: "Cellular Realty", url: "https://www.facebook.com/CellularRealty" },
    youtube: { handle: "@cellularrealty", url: "https://www.youtube.com/@cellularrealty" },
  },

  // Trust metrics — site-wide (content-spec Part B). Use these, NOT the mockup's inflated ones.
  trustMetrics: [
    { value: "20+", label: "Years" },
    { value: "4+", label: "Townships" },
    { value: "700+", label: "Plots" },
    { value: "100+", label: "Acres Developed" },
  ],

  compliance:
    "Approval and licensing documents available for inspection at our Corporate Office.",
  bankFinance: "Bank loan facility available from nationalised banks.",
} as const;

// Primary navigation — 5 items only (new 444 board): Home · About Us · Projects · Buyers' Guide · Contact
export const nav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Buyers' Guide", href: "/buyers-guide" },
  { label: "Contact", href: "/contact" },
] as const;

// Footer link columns (new board: Quick Links · Support · HQ Contact rendered separately).
export const footerColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "Current Projects", href: "/projects" },
      { label: "Buyers' Guide", href: "/buyers-guide" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Sitemap", href: "/sitemap-index.xml" },
    ],
  },
] as const;
