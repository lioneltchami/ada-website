import en from "./en";
import fr from "./fr";

export type Locale = "en" | "fr";
export type Translations = typeof en;

const translations: Record<Locale, Translations> = { en, fr };

export function getLocale(
  pathname: string,
  requestedLocale?: string | null,
): Locale {
  if (/^\/fr(?:\/|$)/.test(pathname)) return "fr";
  return requestedLocale === "fr" ? "fr" : "en";
}

export function t(locale: Locale): Translations {
  return translations[locale];
}

export function localePath(path: string, locale: Locale): string {
  if (locale === "en") return path;
  return `/fr${path === "/" ? "" : path}`;
}

export function switchLocalePath(pathname: string): string {
  if (/^\/fr(?:\/|$)/.test(pathname)) {
    const enPath = pathname.replace(/^\/fr/, "") || "/";
    return enPath;
  }
  return `/fr${pathname === "/" ? "" : pathname}`;
}
