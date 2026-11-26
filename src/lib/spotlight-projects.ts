import {
	mergeProjectLists,
	normalizeFallbackProjects,
} from "./project-fallbacks";
import {
	getProjectLifecycleState,
	type ProjectStatus,
} from "./project-lifecycle";
import { getProjects, type SanityProject } from "./sanity";

export interface SpotlightProject {
	slug: string;
	title: string;
	location: string;
	description: string;
	status: ProjectStatus;
	startDate?: string;
	endDate?: string;
	goal: number;
	raised: number;
	beneficiaries: number;
}

function toSpotlight(project: {
	slug: string;
	title: string;
	location: string;
	description: string;
	status: ProjectStatus;
	startDate?: string;
	endDate?: string;
	goal: number;
	raised: number;
	beneficiaries: number;
}): SpotlightProject {
	return {
		slug: project.slug,
		title: project.title,
		location: project.location,
		description: project.description,
		status: project.status,
		startDate: project.startDate,
		endDate: project.endDate,
		goal: project.goal,
		raised: project.raised,
		beneficiaries: project.beneficiaries,
	};
}

function rankSpotlight(a: SpotlightProject, b: SpotlightProject): number {
	const rank = (status: ProjectStatus) =>
		status === "upcoming" ? 0 : status === "active" ? 1 : 2;
	const byStatus = rank(a.status) - rank(b.status);
	if (byStatus !== 0) return byStatus;
	return (a.startDate || "9999").localeCompare(b.startDate || "9999");
}

/** Fundable campaigns for homepage: upcoming first, then active. */
export async function loadSpotlightProjects(
	locale: "en" | "fr" = "en",
	limit = 4,
): Promise<SpotlightProject[]> {
	const fallbacks = normalizeFallbackProjects({ locale })
		.filter((p) => p.isFundable)
		.map((p) =>
			toSpotlight({
				slug: p.slug,
				title: p.title,
				location: p.location,
				description: p.description,
				status: p.status,
				startDate: p.startDate,
				endDate: p.endDate,
				goal: p.goal,
				raised: p.raised,
				beneficiaries: p.beneficiaries,
			}),
		);

	let projects = fallbacks;
	try {
		const sanityProjects = await getProjects(locale);
		if (sanityProjects?.length) {
			projects = mergeProjectLists(
				sanityProjects
					.map((p: SanityProject) => {
						const lifecycle = getProjectLifecycleState(p, { locale });
						if (!lifecycle.isFundable) return null;
						return toSpotlight({
							slug: p.slug.current,
							title: p.title,
							location: p.location,
							description: p.description,
							status: lifecycle.status,
							startDate: p.startDate,
							endDate: p.endDate,
							goal: p.goalAmount,
							raised: p.raisedAmount,
							beneficiaries: p.beneficiaries,
						});
					})
					.filter(Boolean) as SpotlightProject[],
				fallbacks.filter((fallback) => !sanityProjects.some((project) => project.slug.current === fallback.slug)),
			);
		}
	} catch {
		projects = fallbacks;
	}

	const ranked = projects.sort(rankSpotlight);
	const upcoming = ranked.filter((p) => p.status === "upcoming");
	// When scheduled campaigns exist, feature those first so the homepage answers
	// "what is ADA doing right now?" without burying them under ongoing programs.
	if (upcoming.length > 0) {
		return upcoming.slice(0, limit);
	}
	return ranked.slice(0, limit);
}
