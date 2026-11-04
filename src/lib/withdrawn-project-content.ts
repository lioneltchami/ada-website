const WITHDRAWN_WATER_CLAIM = /\b(?:clean[\s-]?water(?:\s+initiative)?|water\s+well|borehole|eau potable|puits|forage)\b/i;
const UNSUPPORTED_PROGRAM_COUNT = /\b(?:six|6)\s+(?:programs?|programmes?)\b/i;

export function containsWithdrawnProjectClaim(value: unknown): boolean {
	return typeof value === "string" && WITHDRAWN_WATER_CLAIM.test(value);
}

export function isSafeProgramFaq(faq: {
	keywords?: string[];
	keywordsFr?: string[];
	response?: string;
	responseFr?: string;
}): boolean {
	const text = [
		...(faq.keywords || []),
		...(faq.keywordsFr || []),
		faq.response || "",
		faq.responseFr || "",
	].join(" ");
	return !WITHDRAWN_WATER_CLAIM.test(text) && !UNSUPPORTED_PROGRAM_COUNT.test(text);
}
