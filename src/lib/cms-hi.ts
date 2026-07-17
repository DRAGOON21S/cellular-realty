// Hindi content overlays for CMS-driven data, with per-field English fallback.
// Locale-aware accessors used by the shared (locale-aware) page components.
// Brand/project names stay Latin; place names → Devanagari; numerals stay Western-Arabic.
import { featuredProjects, articles as enArticles, testimonials as enTestimonials, projects, getProject as enGetProject, type Project } from "./cms";
import { pillars as enPillars, type Pillar } from "../data/pillars";
import type { Locale } from "./i18n";

const S = "/media/homepage/section-images/cellular-realty-brand-pillar-";

// ---- Brand pillars (Hindi) ----
const hiPillars: Pillar[] = [
  { num: "01", tag: "खरीदार पक्षधरता", title: "आपके हित, सर्वप्रथम", body: "हम पारदर्शी मार्गदर्शन, ईमानदार संवाद और बिक्री के बाद भी जारी रहने वाले सहयोग के माध्यम से महत्वपूर्ण संपत्ति निर्णयों को सरल बनाते हैं।", image: `${S}buyer-advocacy.webp` },
  { num: "02", tag: "अंतर्दृष्टि आधारित", title: "कार्य से पहले अंतर्दृष्टि", body: "हर अवसर का आकलन स्थान, कनेक्टिविटी, बुनियादी ढाँचे और माँग के आधार पर किया जाता है, ताकि निर्णय अनुमान नहीं, प्रमाण पर आधारित हों।", image: `${S}insight-led.webp` },
  { num: "03", tag: "अवसर की समझ", title: "संभावना को पहले पहचानना", body: "हम उभरते विकास गलियारों को स्पष्ट होने से पहले पहचान लेते हैं, बुनियादी ढाँचे की गति को भविष्य की आवासीय और वाणिज्यिक माँग से जोड़ते हैं।", image: `${S}opportunity-intelligence.webp` },
  { num: "04", tag: "रूपांतरण", title: "भूमि से स्थायी समुदायों तक", body: "हम भूमि को संरचित, जुड़े हुए और सुनियोजित वातावरण में बदलते हैं, जो बेहतर रोज़मर्रा के जीवन को सहारा देने के लिए डिज़ाइन किए गए हैं।", image: `${S}transformation.webp` },
  { num: "05", tag: "बाज़ार विशेषज्ञता", title: "बाज़ार में गहराई से जुड़े", body: "स्थानीय ज्ञान, नियामक जागरूकता और खरीदार व्यवहार की व्यावहारिक समझ हर परियोजना और सिफ़ारिश को आकार देती है।", image: `${S}market-expertise.webp` },
  { num: "06", tag: "दीर्घकालिक मूल्य", title: "प्रासंगिक बने रहने के लिए निर्मित", body: "हम ठोस योजना, बुनियादी ढाँचे, कनेक्टिविटी और स्थायी उपयोगिता को प्राथमिकता देते हैं, ताकि खरीद के बिंदु से कहीं आगे तक मूल्य बना रहे।", image: `${S}long-term-value.webp` },
];

// ---- Project field overlays (Hindi), keyed by project id ----
const hiProject: Record<string, Partial<Pick<Project, "locationShort" | "cardDescription" | "landAreaDisplay" | "plotSizes" | "launchTag">>> = {
  SCG: { locationShort: "सेक्टर 36, झज्जर", cardDescription: "सेक्टर 36, झज्जर में एक प्रीमियम प्लॉटेड टाउनशिप, जो हरित स्थानों, आधुनिक बुनियादी ढाँचे और दीर्घकालिक क्षेत्रीय विकास के इर्द-गिर्द डिज़ाइन की गई है।", landAreaDisplay: "20 एकड़", plotSizes: "90–180 वर्ग गज", launchTag: "अभी लॉन्च हो रहा" },
  SC2: { locationShort: "सेक्टर 37, झज्जर", cardDescription: "सेक्टर 37, झज्जर में 210 आवासीय प्लॉटों में नियोजित एक प्लॉटेड विकास।", plotSizes: "90–180 वर्ग गज", launchTag: "80% पूर्ण" },
  SC1: { locationShort: "सेक्टर 36, झज्जर", cardDescription: "झज्जर में 172 आवासीय प्लॉटों वाला एक पूर्ण प्लॉटेड समुदाय।", plotSizes: "90–180 वर्ग गज", launchTag: "पूर्ण" },
  MKJ: { locationShort: "सेक्टर 3, फर्रुखनगर", cardDescription: "फर्रुखनगर में एक रणनीतिक रूप से स्थित प्लॉटेड समुदाय, गुरुग्राम–झज्जर हाईवे और KMP एक्सप्रेसवे तक मज़बूत पहुँच के साथ।", plotSizes: "90–180 वर्ग गज", launchTag: "पूर्ण" },
  CC01: { locationShort: "सेक्टर 23, रेवाड़ी", cardDescription: "रेवाड़ी के उभरते विकास गलियारे में नियोजित एक आगामी प्लॉटेड विकास।" },
  CC02: { locationShort: "सेक्टर 32, रेवाड़ी", cardDescription: "रेवाड़ी के उभरते विकास गलियारे में नियोजित एक आगामी प्लॉटेड विकास।" },
};

// ---- Article overlays (Hindi), keyed by slug ----
const hiArticle: Record<string, { category: string; readTime: string; title: string; excerpt: string }> = {
  "jhajjar-ncr-growth-corridor": { category: "स्थान अंतर्दृष्टि", readTime: "5 मिनट पढ़ें", title: "झज्जर: एनसीआर का अगला विकास गलियारा", excerpt: "दिल्ली एनसीआर की सीमा पर स्थित और बेहतर कनेक्टिविटी, औद्योगिक गतिविधि तथा नियोजित क्षेत्रीय विकास से आकार लेता झज्जर, खरीदारों की नज़दीकी निगाह में आ रहा है।" },
  "met-city-effect-housing-demand": { category: "निवेश गाइड", readTime: "4 मिनट पढ़ें", title: "आवास माँग पर MET सिटी का प्रभाव", excerpt: "रिलायंस MET सिटी द्वारा झज्जर में औद्योगिक गतिविधि, वैश्विक व्यवसाय और रोज़गार की गति लाने के साथ, इस क्षेत्र में नियोजित आवासीय और वाणिज्यिक बुनियादी ढाँचे के लिए मज़बूत आधार बन रहा है।" },
  "sector-36-address-taking-shape": { category: "परियोजना स्थान", readTime: "7 मिनट पढ़ें", title: "सेक्टर 36: आकार लेता पता", excerpt: "प्रमुख नागरिक, रेल और उभरते सड़क बुनियादी ढाँचे के निकट स्थित, सेक्टर 36 खरीदारों को कनेक्टिविटी, योजना और दीर्घकालिक क्षेत्रीय विकास से आकार लेती एक स्थान-कथा प्रदान करता है।" },
};

// ---- Testimonial overlays (Hindi), keyed by English name ----
const hiTestimonial: Record<string, { name: string; role: string; quote: string }> = {
  "Shashank, Gurugram": { name: "शशांक, गुरुग्राम", role: "निवेशक", quote: "मुझे उनकी तत्परता और व्यावसायिकता बहुत पसंद आई। उन्होंने पूरी प्रक्रिया को सरल और आसान बना दिया।" },
  "Mukesh, Gurgaon": { name: "मुकेश, गुड़गाँव", role: "निवेशक", quote: "निवेश में आसानी और अच्छा रिटर्न।" },
  "Prem, Gurgaon": { name: "प्रेम, गुड़गाँव", role: "घर खरीदार", quote: "अच्छे लोग जो हर स्तर पर पूरा सहयोग और मार्गदर्शन करते हैं।" },
  "Varun, Noida": { name: "वरुण, नोएडा", role: "निवेशक", quote: "भुगतान में पारदर्शिता और रजिस्ट्री प्रक्रिया में तेज़ी।" },
  "Pankaj, Delhi": { name: "पंकज, दिल्ली", role: "घर खरीदार", quote: "उत्कृष्ट।" },
  "Deepak, Bhiwani": { name: "दीपक, भिवानी", role: "घर खरीदार", quote: "बहुत सहयोगी टीम।" },
  "Ranjana, Bhiwani": { name: "रंजना, भिवानी", role: "निवेशक", quote: "मैंने पूरी प्रक्रिया के दौरान सेल्युलर रियल्टी की व्यावसायिकता और स्पष्ट संवाद को सराहा। वे तत्पर, पारदर्शी थे और अनुभव को सहज व तनावमुक्त बनाया।" },
  "Bobby, New Delhi": { name: "बॉबी, नई दिल्ली", role: "घर खरीदार", quote: "स्टाफ सहयोगी है और व्यवहार अच्छा है।" },
};

// ---------------- accessors ----------------
export const getPillars = (locale: Locale): Pillar[] => (locale === "hi" ? hiPillars : enPillars);

/** A project with Hindi visible fields merged over English (fallback per field). */
export function localizeProject(p: Project, locale: Locale): Project {
  if (locale !== "hi") return p;
  const o = hiProject[p.id];
  return o ? { ...p, ...o } : p;
}
export const getProjectL = (slug: string, locale: Locale): Project | undefined => {
  const p = enGetProject(slug);
  return p ? localizeProject(p, locale) : undefined;
};
export const getProjectsL = (locale: Locale): Project[] => projects.map((p) => localizeProject(p, locale));
export const getFeaturedProjectsL = (locale: Locale): Project[] => featuredProjects.map((p) => localizeProject(p, locale));

export function getArticlesL(locale: Locale) {
  if (locale !== "hi") return enArticles;
  return enArticles.map((a) => ({ ...a, ...(hiArticle[a.slug] ?? {}) }));
}

export function getTestimonialsL(locale: Locale) {
  if (locale !== "hi") return enTestimonials;
  return enTestimonials.map((tst) => ({ ...tst, ...(hiTestimonial[tst.name] ?? {}) }));
}
