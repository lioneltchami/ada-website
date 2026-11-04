import { createClient, type SanityClient } from "@sanity/client";
import {
	type ContentLocale,
	localizeObjectArray,
	localizeVolunteerLocation,
	pickLocalized,
	pickLocalizedStringArray,
} from "./sanity-locale";
import {
	isSafeProgramFaq,
	isWithdrawnGalleryImage,
	isWithdrawnProjectRecord,
	withoutWithdrawnProjects,
} from "./withdrawn-project-content";

export type { ContentLocale } from "./sanity-locale";

let client: SanityClient | null = null;
const PROJECT_ID = "rj2m21gk";
const DATASET = "production";
const API_VERSION = "2026-03-28";

function getSanityConfig() {
	return {
		projectId: import.meta.env.SANITY_PROJECT_ID || PROJECT_ID,
		dataset: import.meta.env.SANITY_DATASET || DATASET,
		token: import.meta.env.SANITY_TOKEN || import.meta.env.SANITY_API_TOKEN,
	};
}

export function getSanityClient(): SanityClient {
	if (!client) {
		const { projectId, dataset, token } = getSanityConfig();
		if (!projectId) throw new Error("SANITY_PROJECT_ID is required");
		// Prefer API over CDN so SSG builds see freshly patched *Fr fields.
		// Opt into CDN with SANITY_USE_CDN=true when stale lag is acceptable.
		const useCdn =
			process.env.SANITY_USE_CDN === "true" ||
			import.meta.env.SANITY_USE_CDN === "true";
		client = createClient({
			projectId,
			dataset,
			apiVersion: API_VERSION,
			token,
			useCdn,
		});
	}
	return client;
}

export function sanityImageUrl(ref: string, width = 800): string {
	if (!ref) return "";
	const { projectId, dataset } = getSanityConfig();
	const [, id, dimensions, format] = ref.split("-");
	return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=${width}&auto=format`;
}

/** Raw project from Sanity (includes optional *Fr fields). */
export interface SanityProject {
	_id: string;
	title: string;
	titleFr?: string;
	slug: { current: string };
	status: "active" | "completed" | "paused";
	demographic?:
		| "widows"
		| "orphans"
		| "young-women"
		| "pregnant-women"
		| "idps"
		| "community";
	location: string;
	locationFr?: string;
	description: string;
	descriptionFr?: string;
	beneficiaries: number;
	goalAmount: number;
	raisedAmount: number;
	sortOrder: number;
	startDate?: string;
	endDate?: string;
	archiveAfterDate?: string;
	autoArchiveAfterEndDate?: boolean;
	archiveRecord?: {
		slug?: { current: string };
		photo?: { asset?: { _ref?: string }; alt?: string; altFr?: string };
	};
	mainImage?: {
		asset: { _ref: string };
		alt?: string;
		altFr?: string;
	};
}

export interface SanityImpactMetric {
	_id: string;
	label: string;
	labelFr?: string;
	value: number;
	suffix: string;
	displayOrder: number;
}

export interface SanityVolunteerRole {
	_id: string;
	title: string;
	titleFr?: string;
	description: string;
	descriptionFr?: string;
	timeCommitment: string;
	timeCommitmentFr?: string;
	location: string;
	sortOrder: number;
}

export interface SanityDonationTier {
	_id: string;
	amount: number;
	impactDescription: string;
	impactDescriptionFr?: string;
	sortOrder: number;
}

export interface SanitySiteSettings {
	siteName: string;
	tagline: string;
	taglineFr?: string;
	contactEmail: string;
	contactPhone: string;
	officeHours: string;
	officeHoursFr?: string;
	socialFacebook: string;
	socialInstagram: string;
	socialTwitter: string;
}

export interface SanityTestimonial {
	name: string;
	quote: string;
	quoteFr?: string;
	location?: string;
	locationFr?: string;
	program?: string;
	programFr?: string;
	photo?: { asset?: { _ref?: string }; alt?: string; altFr?: string };
}

export interface SanityHomePage {
	heroBadge: string;
	heroHeadline: string;
	heroSubtitle: string;
	missionHeading: string;
	missionBody: string;
	missionCards: { icon: string; title: string; description: string }[];
	ctaHeading: string;
	ctaBody: string;
}

export interface SanityAboutPage {
	missionStatement: string;
	storyHeading: string;
	storyParagraphs: string[];
	coreValues: { icon: string; title: string; description: string }[];
	programs: {
		icon: string;
		title: string;
		description: string;
		slug?: string;
	}[];
	financialSplit: { percentage: number; label: string }[];
	timeline: { year: string; event: string }[];
}

export interface SanityFaqResponse {
	_id: string;
	keywords: string[];
	keywordsFr?: string[];
	response: string;
	responseFr?: string;
	sortOrder: number;
}

export interface SanityBlogPost {
	_id: string;
	title: string;
	titleFr?: string;
	slug: { current: string };
	excerpt: string;
	excerptFr?: string;
	body: any;
	bodyFr?: any;
	publishedAt: string;
	category: string;
	personPhoto?: { asset?: { _ref?: string }; alt?: string; altFr?: string };
}

export interface SanityTeamMember {
	_id: string;
	name: string;
	role: string;
	roleFr?: string;
	bio?: string;
	bioFr?: string;
	photo?: { asset?: { _ref?: string }; alt?: string; altFr?: string };
	sortOrder: number;
}

function localizeProject(
	project: SanityProject,
	locale: ContentLocale,
): SanityProject {
	return {
		...project,
		title: pickLocalized(project as Record<string, unknown>, "title", locale),
		location: pickLocalized(
			project as Record<string, unknown>,
			"location",
			locale,
		),
		description: pickLocalized(
			project as Record<string, unknown>,
			"description",
			locale,
		),
		mainImage: project.mainImage
			? {
					...project.mainImage,
					alt: pickLocalized(
						project.mainImage as Record<string, unknown>,
						"alt",
						locale,
					),
				}
			: project.mainImage,
	};
}

export async function getProjects(
	locale: ContentLocale = "en",
): Promise<SanityProject[]> {
	const rows = await getSanityClient().fetch(
		`*[_type == "project"] | order(sortOrder asc) {
    ...,
    archiveRecord->{ slug, photo { asset { _ref }, alt, altFr } }
  }`,
	);
	return withoutWithdrawnProjects(rows as SanityProject[]).map((p) =>
		localizeProject(p, locale),
	);
}

export async function getProjectBySlug(
	slug: string,
	locale: ContentLocale = "en",
): Promise<SanityProject | null> {
	const row = await getSanityClient().fetch(
		`*[_type == "project" && slug.current == $slug][0] {
    ...,
    archiveRecord->{ slug, photo { asset { _ref }, alt, altFr } }
  }`,
		{ slug },
	);
	return row && !isWithdrawnProjectRecord(row as SanityProject)
		? localizeProject(row as SanityProject, locale)
		: null;
}

export async function getImpactMetrics(
	locale: ContentLocale = "en",
): Promise<SanityImpactMetric[]> {
	const rows = await getSanityClient().fetch(
		`*[_type == "impactMetric"] | order(displayOrder asc)`,
	);
	return (rows as SanityImpactMetric[]).map((m) => ({
		...m,
		label: pickLocalized(m as Record<string, unknown>, "label", locale),
	}));
}

export async function getVolunteerRoles(
	locale: ContentLocale = "en",
): Promise<SanityVolunteerRole[]> {
	const rows = await getSanityClient().fetch(
		`*[_type == "volunteerRole" && isActive == true] | order(sortOrder asc)`,
	);
	return (rows as SanityVolunteerRole[]).map((r) => ({
		...r,
		title: pickLocalized(r as Record<string, unknown>, "title", locale),
		description: pickLocalized(
			r as Record<string, unknown>,
			"description",
			locale,
		),
		timeCommitment: pickLocalized(
			r as Record<string, unknown>,
			"timeCommitment",
			locale,
		),
		location: localizeVolunteerLocation(r.location, locale),
	}));
}

export async function getDonationTiers(
	locale: ContentLocale = "en",
): Promise<SanityDonationTier[]> {
	const rows = await getSanityClient().fetch(
		`*[_type == "donationTier" && isActive == true] | order(sortOrder asc)`,
	);
	return (rows as SanityDonationTier[]).map((t) => ({
		...t,
		impactDescription: pickLocalized(
			t as Record<string, unknown>,
			"impactDescription",
			locale,
		),
	}));
}

export async function getSiteSettings(
	locale: ContentLocale = "en",
): Promise<SanitySiteSettings | null> {
	const row = await getSanityClient().fetch(`*[_type == "siteSettings"][0]`);
	if (!row) return null;
	return {
		...row,
		tagline: pickLocalized(row, "tagline", locale),
		officeHours: pickLocalized(row, "officeHours", locale),
	};
}

export async function getTeamMembers(locale: ContentLocale = "en") {
	const rows = await getSanityClient().fetch(
		`*[_type == "teamMember" && isActive == true] | order(sortOrder asc)`,
	);
	return (rows as SanityTeamMember[]).map((m) => ({
		...m,
		role: pickLocalized(m as Record<string, unknown>, "role", locale),
		bio: pickLocalized(m as Record<string, unknown>, "bio", locale),
		photo: m.photo
			? {
					...m.photo,
					alt: pickLocalized(m.photo as Record<string, unknown>, "alt", locale),
				}
			: m.photo,
	}));
}

export async function getGalleryImages(
	category?: string,
	locale: ContentLocale = "en",
) {
	const filter = category ? ` && category == $category` : "";
	const rows = await getSanityClient().fetch(
		`*[_type == "galleryImage"${filter}] | order(year desc, dateTaken desc) {
      _id,
      title,
      titleFr,
      category,
      year,
      reportUrl,
      dateTaken,
      photo { asset { _ref }, alt, altFr },
      "projectTitle": project->title,
      "projectTitleFr": project->titleFr,
      "projectSlug": project->slug.current
    }`,
		{ category },
	);
	return (rows as any[])
		.filter((img) => !isWithdrawnGalleryImage(img))
		.map((img) => ({
			...img,
			title: pickLocalized(img, "title", locale),
			projectTitle: pickLocalized(
				{
					projectTitle: img.projectTitle,
					projectTitleFr: img.projectTitleFr,
				},
				"projectTitle",
				locale,
			),
			photo: img.photo
				? {
						...img.photo,
						alt: pickLocalized(img.photo, "alt", locale),
					}
				: img.photo,
		}));
}

export async function getTestimonials(locale: ContentLocale = "en") {
	const rows = await getSanityClient().fetch(
		`*[_type == "testimonial" && isFeatured == true]{
      name,
      quote,
      quoteFr,
      location,
      locationFr,
      program,
      programFr,
      photo { asset { _ref }, alt, altFr }
    }`,
	);
	return (rows as SanityTestimonial[]).map((item) => ({
		name: item.name,
		quote: pickLocalized(item as Record<string, unknown>, "quote", locale),
		location: pickLocalized(
			item as Record<string, unknown>,
			"location",
			locale,
		),
		program: pickLocalized(item as Record<string, unknown>, "program", locale),
		photo: item.photo
			? {
					...item.photo,
					alt: pickLocalized(
						item.photo as Record<string, unknown>,
						"alt",
						locale,
					),
				}
			: item.photo,
	}));
}

export async function getHomePage(
	locale: ContentLocale = "en",
): Promise<SanityHomePage | null> {
	const row = await getSanityClient().fetch(`*[_type == "homePage"][0]`);
	if (!row) return null;
	return {
		heroBadge: pickLocalized(row, "heroBadge", locale),
		heroHeadline: pickLocalized(row, "heroHeadline", locale),
		heroSubtitle: pickLocalized(row, "heroSubtitle", locale),
		missionHeading: pickLocalized(row, "missionHeading", locale),
		missionBody: pickLocalized(row, "missionBody", locale),
		missionCards: localizeObjectArray(
			row.missionCards || [],
			["title", "description"],
			locale,
		),
		ctaHeading: pickLocalized(row, "ctaHeading", locale),
		ctaBody: pickLocalized(row, "ctaBody", locale),
	};
}

export async function getAboutPage(
	locale: ContentLocale = "en",
): Promise<SanityAboutPage | null> {
	const row = await getSanityClient().fetch(`*[_type == "aboutPage"][0]`);
	if (!row) return null;
	return {
		missionStatement: pickLocalized(row, "missionStatement", locale),
		storyHeading: pickLocalized(row, "storyHeading", locale),
		storyParagraphs: pickLocalizedStringArray(row, "storyParagraphs", locale),
		coreValues: localizeObjectArray(
			row.coreValues || [],
			["title", "description"],
			locale,
		),
		programs: localizeObjectArray(
			row.programs || [],
			["title", "description"],
			locale,
		),
		financialSplit: localizeObjectArray(
			row.financialSplit || [],
			["label"],
			locale,
		),
		timeline: localizeObjectArray(row.timeline || [], ["event"], locale),
	};
}

export async function getFaqResponses(
	locale: ContentLocale = "en",
): Promise<SanityFaqResponse[]> {
	const rows = await getSanityClient().fetch(
		`*[_type == "faqResponse"] | order(sortOrder asc)`,
	);
	return (rows as SanityFaqResponse[]).filter(isSafeProgramFaq).map((f) => ({
		...f,
		response: pickLocalized(f as Record<string, unknown>, "response", locale),
	}));
}

export async function getBlogPosts(
	locale: ContentLocale = "en",
): Promise<SanityBlogPost[]> {
	const rows = await getSanityClient().fetch(
		`*[_type == "blogPost"] | order(publishedAt desc)`,
	);
	return (rows as SanityBlogPost[]).map((post) =>
		localizeBlogPost(post, locale),
	);
}

/** Slugs only, for rendering story routes while withholding story content. */
export async function getBlogPostSlugs(): Promise<string[]> {
	const rows = await getSanityClient().fetch(
		`*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) { "current": slug.current }`,
	);
	return Array.isArray(rows)
		? rows
				.map((row: { current?: unknown }) => row?.current)
				.filter((slug: unknown): slug is string => typeof slug === "string" && slug.length > 0)
		: [];
}

export async function getBlogPostBySlug(
	slug: string,
	locale: ContentLocale = "en",
): Promise<SanityBlogPost | null> {
	const row = await getSanityClient().fetch(
		`*[_type == "blogPost" && slug.current == $slug][0]`,
		{ slug },
	);
	return row ? localizeBlogPost(row as SanityBlogPost, locale) : null;
}

function localizeBlogPost(
	post: SanityBlogPost,
	locale: ContentLocale,
): SanityBlogPost {
	const title = pickLocalized(post as Record<string, unknown>, "title", locale);
	const excerpt = pickLocalized(
		post as Record<string, unknown>,
		"excerpt",
		locale,
	);
	let body = post.body;
	if (locale === "fr" && post.bodyFr) {
		const frBody = post.bodyFr;
		if (
			Array.isArray(frBody) ? frBody.length > 0 : String(frBody || "").trim()
		) {
			body = frBody;
		}
	}
	return {
		...post,
		title,
		excerpt,
		body,
		personPhoto: post.personPhoto
			? {
					...post.personPhoto,
					alt: pickLocalized(
						post.personPhoto as Record<string, unknown>,
						"alt",
						locale,
					),
				}
			: post.personPhoto,
	};
}
