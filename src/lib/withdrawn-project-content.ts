const WITHDRAWN_WATER_CLAIM = /\b(?:clean[\s-]?water(?:\s+initiative)?|water\s+well|borehole|eau potable|puits|forage)\b/i;
const UNSUPPORTED_PROGRAM_COUNT = /\b(?:six|6)\s+(?:programs?|programmes?)\b/i;
const WITHDRAWN_WIDOW_TRAINING = /widow.{0,50}(?:vocational[\s-]*)?training.{0,40}(?:cohort|program)|widow.{0,35}(?:tailoring|hairdressing).{0,25}training|training.{0,35}widow.{0,35}(?:cohort|program)|veuve.{0,50}(?:formation professionnelle|formation des veuves|cohorte)|formation.{0,35}veuve.{0,35}(?:cohorte|programme)/i;
const WITHDRAWN_PROJECT_SLUGS = new Set([
	"clean-water-well-nkwen-mbatu",
	"young-women-conference-oct-2024",
	"widow-vocational-training-cohort-1",
	"widow-support-program-cohort-3",
]);
const WITHDRAWN_RECORD_ID_PATTERN = /ADA[/_-]2024[/_-]002|ADA[/_-]2024[/_-]005|ADA[/_-]2022[/_-]002|ADA[/_-]2025[/_-]002/i;
const WITHDRAWN_PROJECT_IDENTIFIERS = /ADA[/_-]2024[/_-]002|clean[\s-]*water[\s-]*well|borehole[\s-]*drilling[\s-]*and[\s-]*solar[\s-]*pump|(?:well|borehole|puits|forage).{0,60}Nkwen[\s-]*Mbatu|Nkwen[\s-]*Mbatu.{0,60}(?:well|borehole|puits|forage)|ADA[/_-]2024[/_-]005|young[\s-]*women.{0,40}(?:empowerment[\s-]*)?conference|conference.{0,40}young[\s-]*women|jeunes femmes.{0,40}conférence|conférence.{0,40}jeunes femmes|ADA[/_-]2022[/_-]002|widow.{0,50}(?:vocational[\s-]*)?training.{0,40}cohort|widow.{0,30}support.{0,20}cohort[\s-]*[123]|(?:vocational[\s-]*)?training.{0,30}widow.{0,30}cohort|veuve.{0,45}(?:formation|cohorte).{0,30}(?:cohorte|[123])|cohorte.{0,25}veuve|widow.{0,35}(?:vocational|tailoring|hairdressing).{0,25}training|(?:vocational|tailoring|hairdressing).{0,25}training.{0,35}widow|veuve.{0,35}(?:formation|couture|coiffure)|(?:formation|couture|coiffure).{0,35}veuve/i;
const WITHDRAWN_GALLERY_IDENTIFIERS = /ADA[/_-]2024[/_-]002|clean[\s-]*water[\s-]*well|first[\s-]*water[\s-]*well|borehole[\s-]*drilling[\s-]*and[\s-]*solar[\s-]*pump|(?:well|borehole|puits|forage).{0,60}Nkwen[\s-]*Mbatu|Nkwen[\s-]*Mbatu.{0,60}(?:well|borehole|puits|forage)|ADA[/_-]2024[/_-]005|young[\s-]*women.{0,40}(?:empowerment[\s-]*)?conference|conference.{0,40}young[\s-]*women|jeunes femmes.{0,40}conférence|conférence.{0,40}jeunes femmes|ADA[/_-]2022[/_-]002|widow.{0,50}(?:vocational[\s-]*)?training.{0,40}cohort|widow.{0,30}support.{0,20}cohort[\s-]*[123]|(?:vocational[\s-]*)?training.{0,30}widow.{0,30}cohort|veuve.{0,45}(?:formation|cohorte).{0,30}(?:cohorte|[123])|cohorte.{0,25}veuve|widow.{0,35}(?:vocational|tailoring|hairdressing).{0,25}training|(?:vocational|tailoring|hairdressing).{0,25}training.{0,35}widow|veuve.{0,35}(?:formation|couture|coiffure)|(?:formation|couture|coiffure).{0,35}veuve/i;

export function isWithdrawnProjectSlug(slug: unknown): boolean {
	return typeof slug === "string" && WITHDRAWN_PROJECT_SLUGS.has(slug);
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
	category?: string;
	projectTitle?: string;
	projectTitleFr?: string;
	reportUrl?: string;
	photo?: { alt?: string; altFr?: string };
}): boolean {
	if (isWithdrawnProjectSlug(image.projectSlug)) return true;
	const identifiers = [
		image._id,
		image.title,
		image.titleFr,
		image.alt,
		image.altFr,
		image.category,
		image.photo?.alt,
		image.photo?.altFr,
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
	const withdrawnAggregate = /(?:200\s*\+|plus de 200)\s*(?:lives|people|widows|vies|personnes|veuves)|(?:lives|people|widows|vies|personnes|veuves)\s*(?:impacted|supported|served|impactées|accompagnées|soutenues).{0,30}(?:200\s*\+|plus de 200)/i;
	return !WITHDRAWN_WATER_CLAIM.test(text) && !UNSUPPORTED_PROGRAM_COUNT.test(text) && !WITHDRAWN_WIDOW_TRAINING.test(text) && !WITHDRAWN_PROJECT_IDENTIFIERS.test(text) && !withdrawnAggregate.test(text);
}

export function isWithdrawnImpactMetric(metric: {
	_id?: string;
	label?: string;
	labelFr?: string;
	value?: number | string;
	suffix?: string;
}): boolean {
	const identity = [metric._id, metric.label, metric.labelFr]
		.filter((value): value is string => typeof value === "string")
		.join(" ");
	const metricText = `${identity} ${metric.value ?? ""}${metric.suffix || ""}`;
	return /^(?:metric-lives|metric-widows|metric-document-count)$/i.test(metric._id || "") ||
		WITHDRAWN_RECORD_ID_PATTERN.test(metricText) ||
		WITHDRAWN_PROJECT_IDENTIFIERS.test(identity) ||
		/\b(?:lives impacted|vies impactées|documented project records|dossiers de projets documentés|widows supported|widow independence|widow graduates|widow training|veuves soutenues|indépendance des veuves|diplômées veuves)\b/i.test(identity) ||
		/(?:85\s*%.*(?:women|girls|femmes|filles)|(?:women|girls|femmes|filles).*85\s*%)/i.test(metricText);
}

export function isWithdrawnWidowTrainingTestimonial(testimonial: {
	program?: string;
	programFr?: string;
	quote?: string;
	quoteFr?: string;
}): boolean {
	const program = `${testimonial.program || ""} ${testimonial.programFr || ""}`;
	const quote = `${testimonial.quote || ""} ${testimonial.quoteFr || ""}`;
	return /widow|veuve/i.test(program) &&
		/(?:vocational|tailoring|hairdressing|training|cohort|formation|couture|coiffure|cohorte)/i.test(quote);
}

export function safeWidowSupportDescription(description: string): string {
	if (/\bwidows?\b/i.test(description) && /(?:vocational|skills?) training|tailoring|hairdressing/i.test(description)) {
		return "Food and financial support for widows and families.";
	}
	if (/veuve/i.test(description) && /formation professionnelle|formation|couture|coiffure/i.test(description)) {
		return "Aide alimentaire et financière pour les veuves et les familles.";
	}
	return description;
}

export function isWithdrawnAboutEntry(entry: {
	title?: string;
	titleFr?: string;
	description?: string;
	descriptionFr?: string;
	event?: string;
	eventFr?: string;
}): boolean {
	const identity = [
		entry.title,
		entry.titleFr,
		entry.description,
		entry.descriptionFr,
		entry.event,
		entry.eventFr,
	]
		.filter((value): value is string => typeof value === "string")
		.join(" ");
	return WITHDRAWN_PROJECT_IDENTIFIERS.test(identity) ||
		/(?:200\s*\+\s*(?:lives|vies)\s*(?:impacted|impactées)|(?:200\s*(?:volunteers|bénévoles)))/i.test(identity);
}

/** Filter a withdrawn record by its title, while allowing general widow-relief cards to remain. */
export function isWithdrawnProgramEntry(entry: {
	title?: string;
	titleFr?: string;
}): boolean {
	const identity = [entry.title, entry.titleFr]
		.filter((value): value is string => typeof value === "string")
		.join(" ");
	return /ADA[/_-]2024[/_-]005|young[\s-]*women.{0,40}(?:empowerment[\s-]*)?conference|conference.{0,40}young[\s-]*women|jeunes femmes.{0,40}conférence|conférence.{0,40}jeunes femmes|ADA[/_-]2022[/_-]002|widow.{0,60}(?:vocational[\s-]*)?training|widow.{0,35}support.{0,20}cohort[\s-]*[123]|veuve.{0,50}(?:formation|cohorte)|cohorte.{0,25}veuve/i.test(identity);
}

export function isWithdrawnTestimonial(testimonial: {
	program?: string;
	programFr?: string;
	quote?: string;
	quoteFr?: string;
}): boolean {
	return isWithdrawnAboutEntry(testimonial) || isWithdrawnWidowTrainingTestimonial(testimonial);
}
