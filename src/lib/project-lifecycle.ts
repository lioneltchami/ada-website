export type ProjectStatus = "upcoming" | "active" | "completed" | "paused";
export type EditorialProjectStatus = "active" | "completed" | "paused";

export interface ProjectLifecycleFields {
	status: EditorialProjectStatus;
	slug?: string | { current?: string | null } | null;
	startDate?: string | null;
	endDate?: string | null;
	archiveAfterDate?: string | null;
	autoArchiveAfterEndDate?: boolean | null;
	archiveRecord?: {
		slug?: { current?: string | null } | null;
	} | null;
}

export interface ProjectLifecycleState {
	status: ProjectStatus;
	isAutoCompleted: boolean;
	isUpcoming: boolean;
	hasStarted: boolean;
	hasEnded: boolean;
	archiveHref: string;
	archiveReady: boolean;
}

export function currentIsoDate(now = new Date()): string {
	return now.toISOString().slice(0, 10);
}

function isDateBeforeToday(
	date: string | null | undefined,
	today: string,
): boolean {
	return Boolean(date && date < today);
}

function isDateAfterToday(
	date: string | null | undefined,
	today: string,
): boolean {
	return Boolean(date && date > today);
}

export function getProjectLifecycleState(
	project: ProjectLifecycleFields,
	options: { today?: string; locale?: "en" | "fr" } = {},
): ProjectLifecycleState {
	const today = options.today || currentIsoDate();
	const localePrefix = options.locale === "fr" ? "/fr" : "";
	const completionDate = project.archiveAfterDate || project.endDate;
	const hasEnded = isDateBeforeToday(project.endDate, today);
	const hasStarted = !isDateAfterToday(project.startDate, today);
	const shouldAutoComplete =
		project.status === "active" &&
		project.autoArchiveAfterEndDate !== false &&
		isDateBeforeToday(completionDate, today);
	const shouldBeUpcoming =
		!shouldAutoComplete &&
		project.status === "active" &&
		isDateAfterToday(project.startDate, today);

	let status: ProjectStatus = project.status;
	if (shouldAutoComplete) status = "completed";
	else if (shouldBeUpcoming) status = "upcoming";

	const baseSlug =
		typeof project.slug === "string"
			? project.slug
			: project.slug?.current || "";
	const archiveSlug =
		project.archiveRecord?.slug?.current ||
		(status === "completed" ? baseSlug : "");

	return {
		status,
		hasEnded,
		hasStarted,
		isUpcoming: shouldBeUpcoming,
		isAutoCompleted: shouldAutoComplete,
		archiveHref: archiveSlug
			? `${localePrefix}/projects/archive/${archiveSlug}`
			: "",
		archiveReady: Boolean(archiveSlug),
	};
}

/** Active and upcoming campaigns can still receive gifts. */
export function isProjectFundable(status: ProjectStatus): boolean {
	return status === "active" || status === "upcoming";
}

export function projectStatusLabel(
	status: ProjectStatus,
	locale: "en" | "fr" = "en",
): string {
	if (locale === "fr") {
		if (status === "upcoming") return "À venir";
		if (status === "active") return "Actif";
		if (status === "completed") return "Terminé";
		return "En pause";
	}
	if (status === "upcoming") return "Upcoming";
	if (status === "active") return "Active";
	if (status === "completed") return "Completed";
	return "Paused";
}
