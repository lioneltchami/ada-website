const WITHDRAWN_WATER_CLAIM = /\b(?:clean[\s-]?water(?:\s+initiative)?|water\s+well|borehole|eau potable|puits|forage)\b/i;
const UNSUPPORTED_PROGRAM_COUNT = /\b(?:six|6)\s+(?:programs?|programmes?)\b/i;
const WITHDRAWN_PROJECT_SLUG = "clean-water-well-nkwen-mbatu";
const WITHDRAWN_PROJECT_IDENTIFIERS = /ADA[/_-]2024[/_-]002|clean[\s-]*water[\s-]*well|borehole[\s-]*drilling[\s-]*and[\s-]*solar[\s-]*pump|(?:well|borehole|puits|forage).{0,60}Nkwen[\s-]*Mbatu|Nkwen[\s-]*Mbatu.{0,60}(?:well|borehole|puits|forage)/i;
const WITHDRAWN_GALLERY_IDENTIFIERS = /ADA[/_-]2024[/_-]002|clean[\s-]*water[\s-]*well|first[\s-]*water[\s-]*well|borehole[\s-]*drilling[\s-]*and[\s-]*solar[\s-]*pump|(?:well|borehole|puits|forage).{0,60}Nkwen[\s-]*Mbatu|Nkwen[\s-]*Mbatu.{0,60}(?:well|borehole|puits|forage)/i;

export function isWithdrawnProjectSlug(slug: unknown): boolean {
	return slug === WITHDRAWN_PROJECT_SLUG;
}

export function isWithdrawnProjectRecord(project: {
	_id?: string;
	title?: string;
	titleFr?: string;
	slug?: { current?: string } | string;
	archiveRecord?: { slug?: { current?: string } };
}): boolean {
	const slug =
		typeof project.slug === "string"
			? project.slug
			: project.slug?.current;
	const archiveSlug = project.archiveRecord?.slug?.current;
	if (isWithdrawnProjectSlug(slug) || isWithdrawnProjectSlug(archiveSlug)) return true;
	const identity = [project._id, project.title, project.titleFr]
		.filter((value): value is string => typeof value === "string")
		.join(" ");
	return WITHDRAWN_PROJECT_IDENTIFIERS.test(identity);
}

export function withoutWithdrawnProjects<
	T extends { slug?: { current?: string } | string },
>(projects: T[]): T[] {
	return projects.filter((project) => !isWithdrawnProjectRecord(project));
}

export function isWithdrawnGalleryImage(image: {
	_id?: string;
	projectSlug?: string;
	title?: string;
	titleFr?: string;
	alt?: string;
	altFr?: string;
	projectTitle?: string;
	projectTitleFr?: string;
	reportUrl?: string;
}): boolean {
	if (isWithdrawnProjectSlug(image.projectSlug)) return true;
	const identifiers = [
		image._id,
		image.title,
		image.titleFr,
		image.alt,
		image.altFr,
		image.projectTitle,
		image.projectTitleFr,
		image.reportUrl,
	].filter((value): value is string => typeof value === "string");
	return identifiers.some((value) => WITHDRAWN_GALLERY_IDENTIFIERS.test(value));
}

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
