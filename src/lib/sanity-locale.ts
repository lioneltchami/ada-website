/**
 * Sanity content locale helpers.
 * Convention: English is the base field (`title`); French is `titleFr`.
 * Resolution: locale === "fr" && fr value non-empty → fr; else EN base.
 */

export type ContentLocale = "en" | "fr";

export function isContentLocale(value: unknown): value is ContentLocale {
	return value === "en" || value === "fr";
}

/** Pick localized string: Fr field when locale is fr and non-empty, else base. */
export function pickLocalized(
	doc: Record<string, unknown> | null | undefined,
	baseKey: string,
	locale: ContentLocale,
): string {
	if (!doc) return "";
	if (locale === "fr") {
		const fr = doc[`${baseKey}Fr`];
		if (typeof fr === "string" && fr.trim()) return fr.trim();
	}
	const en = doc[baseKey];
	return typeof en === "string" ? en : "";
}

/** Pick localized string array (e.g. storyParagraphs / storyParagraphsFr). */
export function pickLocalizedStringArray(
	doc: Record<string, unknown> | null | undefined,
	baseKey: string,
	locale: ContentLocale,
): string[] {
	if (!doc) return [];
	if (locale === "fr") {
		const fr = doc[`${baseKey}Fr`];
		if (
			Array.isArray(fr) &&
			fr.some((s) => typeof s === "string" && s.trim())
		) {
			return fr.filter(
				(s): s is string => typeof s === "string" && s.trim().length > 0,
			);
		}
	}
	const en = doc[baseKey];
	if (!Array.isArray(en)) return [];
	return en.filter((s): s is string => typeof s === "string");
}

/** Map object array items with per-item *Fr string fields. */
export function localizeObjectArray<T extends Record<string, unknown>>(
	items: T[] | null | undefined,
	stringKeys: string[],
	locale: ContentLocale,
): T[] {
	if (!items?.length) return [];
	return items.map((item) => {
		const next: Record<string, unknown> = { ...item };
		for (const key of stringKeys) {
			next[key] = pickLocalized(item, key, locale);
			delete next[`${key}Fr`];
		}
		return next as T;
	});
}

const VOLUNTEER_LOCATION_FR: Record<string, string> = {
	"On-site": "Sur place",
	Remote: "À distance",
	Hybrid: "Hybride",
};

export function localizeVolunteerLocation(
	location: string | undefined,
	locale: ContentLocale,
): string {
	if (!location) return "";
	if (locale === "fr") return VOLUNTEER_LOCATION_FR[location] || location;
	return location;
}
