import type { ProjectStatus } from "./project-lifecycle";

export type ProjectPresentationLocale = "en" | "fr";
export type ArchiveRecordStatus = "completed" | "ongoing" | "planned";

export function getPausedProjectMessage(
  locale: ProjectPresentationLocale,
): string {
  return locale === "fr"
    ? "Ce projet est en pause et n'accepte pas de dons dédiés."
    : "This project is paused and is not accepting project-specific donations.";
}

export function getProjectReportLabel(
  locale: ProjectPresentationLocale,
): string {
  return locale === "fr" ? "Rapport de projet (PDF)" : "Project report (PDF)";
}

export function formatUsdAmount(
  amount: number,
  locale: ProjectPresentationLocale,
): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProjectStatusText(
  status: ProjectStatus,
  autoArchived: boolean,
  locale: ProjectPresentationLocale,
): string {
  if (autoArchived) return locale === "fr" ? "Archivé" : "Archived";
  const labels: Record<
    ProjectPresentationLocale,
    Record<ProjectStatus, string>
  > = {
    en: {
      upcoming: "Upcoming",
      active: "Active",
      completed: "Completed",
      paused: "Paused",
    },
    fr: {
      upcoming: "À venir",
      active: "Actif",
      completed: "Terminé",
      paused: "En pause",
    },
  };
  return labels[locale][status];
}

export function getArchiveRecordStatusText(
  status: ArchiveRecordStatus,
  autoArchived: boolean,
  locale: ProjectPresentationLocale,
): string {
  if (autoArchived) return locale === "fr" ? "Archivé" : "Archived";

  const labels: Record<
    ProjectPresentationLocale,
    Record<ArchiveRecordStatus, string>
  > = {
    en: { completed: "Completed", ongoing: "Ongoing", planned: "Planned" },
    fr: { completed: "Terminé", ongoing: "En cours", planned: "Planifié" },
  };
  return labels[locale][status];
}
