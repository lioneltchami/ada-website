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
	isFundable: boolean;
	hasStarted: boolean;
	hasEnded: boolean;
	archiveHref: string;
	archiveReady: boolean;
}

export function currentIsoDate(now = new Date()): string {
	return now.toISOString().slice(0, 10);
}

const ARCHIVE_DELAY_DAYS = 7;

function validIsoDate(value: string | null | undefined): string | undefined {
	if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
	const date = new Date(`${value}T00:00:00.000Z`);
	return Number.isFinite(date.getTime()) && currentIsoDate(date) === value
		? value
		: undefined;
}

function addCalendarDays(date: string, days: number): string | undefined {
	const next = new Date(`${date}T00:00:00.000Z`);
	next.setUTCDate(next.getUTCDate() + days);
	return validIsoDate(currentIsoDate(next));
}

/** First UTC calendar date eligible for automatic archiving. */
export function getAutomaticArchiveDate(
	project: Pick<ProjectLifecycleFields, "startDate" | "endDate" | "archiveAfterDate">,
): string | undefined {
	const start = validIsoDate(project.startDate);
	const end = validIsoDate(project.endDate);
	if (start && end && end < start) return undefined;
	const lastScheduledDate = end ?? start;
	if (lastScheduledDate) return addCalendarDays(lastScheduledDate, ARCHIVE_DELAY_DAYS);

	// Legacy records without a schedule may still use their explicit date.
	// Preserve their old "after" semantics, but don't fall back on malformed schedules.
	if (!project.startDate && !project.endDate) {
		const legacyDate = validIsoDate(project.archiveAfterDate);
		if (legacyDate) return addCalendarDays(legacyDate, 1);
	}
	return undefined;
}

export function getProjectLifecycleState(
	project: ProjectLifecycleFields,
	options: { today?: string; locale?: "en" | "fr" } = {},
): ProjectLifecycleState {
	const today = validIsoDate(options.today ?? currentIsoDate());
	const localePrefix = options.locale === "fr" ? "/fr" : "";
	const archiveDate = getAutomaticArchiveDate(project);
	const start = validIsoDate(project.startDate);
	const end = validIsoDate(project.endDate);
	const lastScheduledDate = end ?? start;
	const startsLater = Boolean(start && today && start > today);
	const hasEnded = Boolean(lastScheduledDate && today && lastScheduledDate < today);
	const hasStarted = !startsLater;
	const shouldAutoComplete =
		project.status === "active" &&
		project.autoArchiveAfterEndDate !== false &&
		Boolean(archiveDate && today && archiveDate <= today);
	const shouldBeUpcoming =
		!shouldAutoComplete && project.status === "active" && startsLater;

	let status: ProjectStatus = project.status;
	if (shouldAutoComplete) status = "completed";
	else if (shouldBeUpcoming) status = "upcoming";

	// The archive grace period is not a fundraising extension. Honor an earlier
	// legacy cutoff, but never use it to keep gifts open past the scheduled date.
	const legacyCutoff = validIsoDate(project.archiveAfterDate);
	const fundingCutoff = legacyCutoff && (!lastScheduledDate || legacyCutoff < lastScheduledDate)
		? legacyCutoff
		: lastScheduledDate;
	const fundingClosed = project.autoArchiveAfterEndDate !== false
		&& Boolean(fundingCutoff && today && fundingCutoff < today);

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
		isFundable: isProjectFundable(status) && !fundingClosed,
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
