import { en } from "../i18n/en";
import { hi } from "../i18n/hi";

export type Locale = "en" | "hi";
export const LOCALES: Locale[] = ["en", "hi"];
export const DEFAULT_LOCALE: Locale = "en";

/** The English dictionary defines the shape; `hi` satisfies it (with English fallback per key). */
export type Dict = typeof en;
const dictionaries: Record<Locale, Dict> = { en, hi };

/** Dictionary accessor. Usage: const t = useT(locale); t.nav.home */
export function useT(locale: Locale): Dict {
  return dictionaries[locale] ?? en;
}

/** Derive locale from a URL/pathname. `/hi`, `/hi/`, `/hi/about` → 'hi'; else 'en'. */
export function getLocale(url: URL | string): Locale {
  const path = typeof url === "string" ? url : url.pathname;
  const seg = path.replace(/\/+$/, "").split("/")[1];
  return seg === "hi" ? "hi" : "en";
}

/** Normalize a pathname: strip trailing slash (except root). */
function norm(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

/** Strip the /hi prefix → canonical English base path. `/hi/about` → `/about`; `/hi` → `/`. */
export function toBasePath(pathname: string): string {
  const p = norm(pathname);
  if (p === "/hi") return "/";
  return p.startsWith("/hi/") ? p.slice(3) : p;
}

/** Build a locale-aware href from an English base path. `('/about','hi')` → `/hi/about`; `('/','hi')` → `/hi`. */
export function localizePath(basePath: string, locale: Locale): string {
  const base = norm(basePath);
  if (locale === "en") return base;
  return base === "/" ? "/hi" : `/hi${base}`;
}

/** Given the current pathname, return the SAME page in the OTHER locale (for the toggle). */
export function switchLocalePath(pathname: string): string {
  const p = norm(pathname);
  if (getLocale(p) === "hi") return toBasePath(p);
  return localizePath(p, "hi");
}
