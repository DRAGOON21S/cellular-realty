# Cellular Realty — Website

Marketing website for Cellular Realty (real-estate arm of Aditi Infrabuild & Services Ltd.) —
DDJAY plotted developments across Jhajjar, Gurugram and Rewari.

Built with **Astro 5 + Tailwind 4 + Preact islands**. Content is baked in from the Excel
**CMS Data Pack**; the brown brand palette is applied over a pixel-faithful build of the Figma design.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321  (regenerate CMS: npm run cms)
npm run build      # runs the CMS step, then a full static + endpoint build
npm run preview
```

## Project structure

```
content-source/cms-data-pack.xlsx   # SOURCE OF TRUTH for all facts (edit here)
scripts/build-cms.mjs               # Excel → src/data/generated/*.json (+ publish-gate check)
src/data/generated/                 # generated content (do not hand-edit)
src/data/global.ts                  # global content (contact, nav, trust metrics)
src/lib/cms.ts                      # typed access layer + helpers
src/lib/icons.ts                    # amenity/connectivity icon maps (Lucide)
src/layouts/Layout.astro            # shell: head/SEO/JSON-LD, header, footer, mobile bar, enquiry modal
src/components/                      # Header, Footer, ProjectCard, EnquiryModal, EmiCalculator, …
src/pages/                          # routes (home, projects, PDP, about, buyers-guide, insights, contact, legal, 404)
src/pages/api/lead.ts               # lead endpoint (enquiry / download / newsletter)
public/media/                       # image/PDF/video library (served at /media/…)
public/fonts/, public/brand/        # self-hosted fonts + logos
```

## Editing content

1. Edit `content-source/cms-data-pack.xlsx` (keep Project IDs stable).
2. `npm run cms` regenerates `src/data/generated/*`.
3. `STRICT_CMS=1 npm run build` **fails** if a `Published=Yes` project is missing required
   facts (real RERA number + QR, hero/card/OG image, SEO title/description) — the README publish rule.

Placeholder tokens in the sheet (`ADD_LINK`, `ADD_IMAGE`, `ADD_DOC_LINK`, `TBD`, `Coming Soon`,
`Not available`) are auto-nulled and render as the correct fallback (e.g. Maruti Kunj brochure CTA
hidden; Cellular City shown as "Coming Soon"; all pricing as "On request").

## Lead capture

All enquiry / gated-download / newsletter submissions POST to `src/pages/api/lead.ts`.
Delivery currently logs the lead server-side. **To wire Supabase** (or email), replace the body of
`deliverLead()` only — the request/response contract and all UI stay unchanged:

```ts
// src/pages/api/lead.ts → deliverLead()
await supabase.from("leads").insert(record);
```

Spam protection: honeypot field + email validation (add Cloudflare Turnstile at deploy if desired).

## Deployment

Static pages + one on-demand endpoint (`/api/lead`). Currently uses `@astrojs/node`
(works for local `build`/`preview`). **At deploy time, swap the adapter** in `astro.config.mjs`:

- **Cloudflare Pages** (recommended: fast in India, free tier, Pages Functions) → `@astrojs/cloudflare`
- **Vercel** → `@astrojs/vercel`
- **Netlify** → `@astrojs/netlify`

Then connect the GitHub repo to the host for auto-deploy + preview builds, point DNS for
`cellularrealty.in` at the host (auto SSL), and set any env vars (Supabase keys) in the host dashboard.

## ⚠️ Launch-blocking gates (client must resolve before go-live)

These are content/legal facts that cannot be invented — the build surfaces them, but they must be filled:

- **South City Greens RERA number + QR** — hard go-live gate (currently "on registration").
- **Verify & publish SC1 / SC2 / Maruti Kunj** — set `Published=Yes` in the sheet once RERA
  association, distances, MKJ plot count/RERA and real images are confirmed. (All 6 are built;
  SC1/SC2/MKJ pages render but are flagged by the publish-gate.)
- **Compress `south-city-greens-brochure.pdf`** — the original 217 MB file was excluded from
  `public/media`; add a web-optimised version before enabling that download.
- **Legal document PDFs** — `legal-documents/{approvals,ddjay,dtcp,master-plan,rera}` were empty;
  supply them for the RERA QR targets and "documents at Corporate Office".
- **Confirm** TT Hoves commercial licence (else swap the `@font-face` fallback), and permission to
  display the client-logo marquee (CPWD, Indian Railways, L&T, NBCC, …).

## Roadmap (post-launch)

- Hindi locale (i18n routing already scaffolded; `hi` toggle currently marked "coming soon").
- Supabase leads DB (see above).
- Interactive Map view on `/projects` (grid view live; map is a placeholder).
- Project Milestones photo strips (component ready; populate as site photos arrive).
- Article bodies on `/insights/*` (currently teasers until `ADD_DOC_LINK` docs are provided).
- Image optimisation via `astro:assets` and video compression for the media library.

---

Source-of-truth precedence: **CMS Data Pack (xlsx) → Content Specification (docx) → Figma/mockup
(visual only)**. The Figma is the layout bible; colour is the brown brand palette; all facts come
from the spreadsheet.
