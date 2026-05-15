import { createClient } from "@sanity/client";
import {
	annualReportPdfs,
	documentArchiveProjects,
} from "../data/organization";

export type ProjectDemographic =
	| "widows"
	| "orphans"
	| "young-women"
	| "pregnant-women"
	| "idps"
	| "community";

export interface ProjectArchiveDocument {
	slug: string;
	title: string;
	titleFr?: string;
	year: number;
	demographic: ProjectDemographic;
}

export interface YearDocumentGroup {
	year: number;
	annualReportPath?: string;
	demographics: {
		demographic: ProjectDemographic;
		projects: ProjectArchiveDocument[];
	}[];
	projectCount: number;
}

const DEMOGRAPHIC_ORDER: ProjectDemographic[] = [
	"widows",
	"orphans",
	"young-women",
	"pregnant-women",
	"idps",
	"community",
];

const SLUG_SET = new Set<string>(documentArchiveProjects);

/** Fallback when Sanity is unavailable at build time */
const FALLBACK_RECORDS: ProjectArchiveDocument[] = [
	{
		slug: "youth-mentorship-seminar-oct-2025",
		title: "Youth Mentorship Seminar",
		year: 2025,
		demographic: "orphans",
	},
	{
		slug: "campus-cleanup-aug-2025",
		title: "Campus Environmental Cleanup",
		year: 2025,
		demographic: "community",
	},
	{
		slug: "hospital-prenatal-care-jul-2025",
		title: "Hospital Visit — Prenatal Care Kits",
		year: 2025,
		demographic: "pregnant-women",
	},
	{
		slug: "city-cleanup-may-2025",
		title: "City Cleanup — Labour Day 2025",
		year: 2025,
		demographic: "community",
	},
	{
		slug: "idp-children-education-fund",
		title: "IDP Children Education Fund",
		year: 2025,
		demographic: "idps",
	},
	{
		slug: "widow-support-program-cohort-3",
		title: "Widow Support Program - Cohort 3",
		year: 2025,
		demographic: "widows",
	},
	{
		slug: "prenatal-care-support-program",
		title: "Prenatal Care Support Program",
		year: 2025,
		demographic: "pregnant-women",
	},
	{
		slug: "christmas-giving-dec-2024",
		title: "Christmas Giving 2024",
		year: 2024,
		demographic: "orphans",
	},
	{
		slug: "back-to-school-sep-2024",
		title: "Back-to-School 2024",
		year: 2024,
		demographic: "orphans",
	},
	{
		slug: "clean-water-well-nkwen-mbatu",
		title: "Clean Water Well - Nkwen-Mbatu",
		year: 2024,
		demographic: "community",
	},
	{
		slug: "emergency-food-relief-bamenda-crisis",
		title: "Emergency Food Relief - Bamenda Crisis",
		year: 2024,
		demographic: "idps",
	},
	{
		slug: "young-women-conference-oct-2024",
		title: "Young Women Empowerment Conference",
		year: 2024,
		demographic: "young-women",
	},
	{
		slug: "back-to-school-bamenda-sep-2024",
		title: "Back-to-School Bamenda 2024",
		year: 2024,
		demographic: "orphans",
	},
	{
		slug: "city-cleanup-may-2023",
		title: "City Cleanup — Labour Day",
		year: 2023,
		demographic: "community",
	},
	{
		slug: "womens-day-home-visits-mar-2023",
		title: "Women's Day Home Visits",
		year: 2023,
		demographic: "widows",
	},
	{
		slug: "young-women-skills-training-program",
		title: "Young Women Skills Training Program",
		year: 2023,
		demographic: "young-women",
	},
	{
		slug: "back-to-school-drive-2023",
		title: "Back-to-School Drive 2023",
		year: 2023,
		demographic: "orphans",
	},
	{
		slug: "back-to-school-sep-2022",
		title: "Back-to-School 2022",
		year: 2022,
		demographic: "orphans",
	},
	{
		slug: "idp-girls-baking-training-jul-2022",
		title: "IDP Girls Baking Training & Startup Kits",
		year: 2022,
		demographic: "idps",
	},
	{
		slug: "school-visit-mentorship-may-2022",
		title: "School Visit & Mentorship",
		year: 2022,
		demographic: "orphans",
	},
	{
		slug: "widow-support-food-cash-mar-2022",
		title: "Widow Support — Food & Financial Aid",
		year: 2022,
		demographic: "widows",
	},
	{
		slug: "school-supply-distribution-feb-2022",
		title: "School Supply Distribution",
		year: 2022,
		demographic: "orphans",
	},
	{
		slug: "widow-vocational-training-cohort-1",
		title: "Widow Vocational Training Cohort 1",
		year: 2022,
		demographic: "widows",
	},
	{
		slug: "christmas-giving-dec-2022",
		title: "Christmas Giving 2022",
		year: 2022,
		demographic: "widows",
	},
	{
		slug: "first-widow-home-visits-2021",
		title: "First Widow Home Visits",
		year: 2021,
		demographic: "widows",
	},
];

async function fetchProjectRecords(): Promise<ProjectArchiveDocument[]> {
	const projectId = import.meta.env.SANITY_PROJECT_ID || "rj2m21gk";
	const dataset = import.meta.env.SANITY_DATASET || "production";
	const client = createClient({
		projectId,
		dataset,
		apiVersion: "2026-03-28",
		useCdn: true,
	});
	const rows = await client.fetch<
		{
			slug: string;
			title: string;
			titleFr?: string;
			year: number;
			demographic: ProjectDemographic;
		}[]
	>(
		`*[_type == "projectRecord"] {
      "slug": slug.current,
      title,
      titleFr,
      year,
      demographic
    } | order(year desc, title asc)`,
	);
	return rows.filter((r) => r.slug && r.year && r.demographic);
}

export function groupProjectsByYear(
	records: ProjectArchiveDocument[],
): YearDocumentGroup[] {
	const filtered = records.filter((r) => SLUG_SET.has(r.slug));
	const byYear = new Map<
		number,
		Map<ProjectDemographic, ProjectArchiveDocument[]>
	>();

	for (const record of filtered) {
		if (!byYear.has(record.year)) byYear.set(record.year, new Map());
		const byDemo = byYear.get(record.year)!;
		if (!byDemo.has(record.demographic)) byDemo.set(record.demographic, []);
		byDemo.get(record.demographic)!.push(record);
	}

	return [...byYear.entries()]
		.sort(([a], [b]) => b - a)
		.map(([year, byDemo]) => {
			const demographics = DEMOGRAPHIC_ORDER.filter((d) => byDemo.has(d)).map(
				(demographic) => ({
					demographic,
					projects: byDemo.get(demographic)!,
				}),
			);
			const projectCount = demographics.reduce(
				(n, d) => n + d.projects.length,
				0,
			);
			const annualReportPath = annualReportPdfs.find(
				(r) => r.year === String(year),
			)?.path;
			return { year, demographics, projectCount, annualReportPath };
		});
}

export async function loadProjectDocumentLibrary(): Promise<{
	yearGroups: YearDocumentGroup[];
	totalProjects: number;
}> {
	let records: ProjectArchiveDocument[] = [];
	try {
		records = await fetchProjectRecords();
	} catch (e) {
		console.error("[project-archive] Sanity fetch failed, using fallback:", e);
	}
	if (!records.length) records = FALLBACK_RECORDS;
	const yearGroups = groupProjectsByYear(records);
	const totalProjects = yearGroups.reduce((n, y) => n + y.projectCount, 0);
	return { yearGroups, totalProjects };
}

export function demographicLabel(
	demographic: ProjectDemographic,
	labels: Record<ProjectDemographic, string>,
): string {
	return labels[demographic] ?? demographic;
}

export function projectDisplayTitle(
	project: ProjectArchiveDocument,
	locale: "en" | "fr",
): string {
	if (locale === "fr" && project.titleFr) return project.titleFr;
	return project.title;
}
