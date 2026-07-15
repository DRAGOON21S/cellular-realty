// Six brand pillars — copy approved by client (display order 01–06).
// Images from the approved brand-pillar asset set.
export interface Pillar {
  num: string;
  tag: string;
  title: string;
  body: string;
  image: string;
}

const img = (k: string) => `/media/homepage/section-images/cellular-realty-brand-pillar-${k}.webp`;

export const pillars: Pillar[] = [
  {
    num: "01",
    tag: "Buyer Advocacy",
    title: "Your Interests, First",
    body: "We simplify important property decisions through transparent guidance, honest communication and support that continues beyond the sale.",
    image: img("buyer-advocacy"),
  },
  {
    num: "02",
    tag: "Insight Led",
    title: "Insight Before Action",
    body: "Every opportunity is assessed through location, connectivity, infrastructure and demand — so decisions are grounded in evidence, not assumption.",
    image: img("insight-led"),
  },
  {
    num: "03",
    tag: "Opportunity Intelligence",
    title: "Seeing Potential Early",
    body: "We identify emerging growth corridors before they become obvious, connecting infrastructure momentum with future residential and commercial demand.",
    image: img("opportunity-intelligence"),
  },
  {
    num: "04",
    tag: "Transformation",
    title: "From Land to Lasting Communities",
    body: "We transform land into structured, connected and thoughtfully planned environments designed to support better everyday living.",
    image: img("transformation"),
  },
  {
    num: "05",
    tag: "Market Expertise",
    title: "Grounded in the Market",
    body: "Local knowledge, regulatory awareness and a practical understanding of buyer behaviour shape every project and recommendation.",
    image: img("market-expertise"),
  },
  {
    num: "06",
    tag: "Long-Term Value",
    title: "Built to Remain Relevant",
    body: "We prioritise sound planning, infrastructure, connectivity and lasting usability to create value that extends well beyond the point of purchase.",
    image: img("long-term-value"),
  },
];
