export type ProjectStatus = "active" | "completed" | "paused";

export interface ProjectLifecycleFields {
  status: ProjectStatus;
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

export function getProjectLifecycleState(
  project: ProjectLifecycleFields,
  options: { today?: string; locale?: "en" | "fr" } = {},
): ProjectLifecycleState {
  const today = options.today || currentIsoDate();
  const localePrefix = options.locale === "fr" ? "/fr" : "";
  const completionDate = project.archiveAfterDate || project.endDate;
  const hasEnded = isDateBeforeToday(project.endDate, today);
  const shouldAutoComplete =
    project.status === "active" &&
    project.autoArchiveAfterEndDate !== false &&
    isDateBeforeToday(completionDate, today);
  const status = shouldAutoComplete ? "completed" : project.status;
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
    isAutoCompleted: shouldAutoComplete,
    archiveHref: archiveSlug
      ? `${localePrefix}/projects/archive/${archiveSlug}`
      : "",
    archiveReady: Boolean(archiveSlug),
  };
}

export function projectStatusLabel(
  status: ProjectStatus,
  locale: "en" | "fr" = "en",
): string {
  if (locale === "fr") {
    if (status === "active") return "Actif";
    if (status === "completed") return "Terminé";
    return "En pause";
  }
  if (status === "active") return "Active";
  if (status === "completed") return "Completed";
  return "Paused";
}
