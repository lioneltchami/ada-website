import { listReleased2026ProjectDocuments, reviewed2026Release } from "../lib/reviewed-project-summaries-2026";

export type EditorialProjectStatus = "active" | "completed" | "paused";

export interface Project {
  slug: string;
  title: string;
  titleFr?: string;
  location: string;
  locationFr?: string;
  status: EditorialProjectStatus;
  description: string;
  descriptionFr?: string;
  beneficiaries: number;
  goal: number;
  raised: number;
  demographic?:
    | "widows"
    | "orphans"
    | "young-women"
    | "pregnant-women"
    | "idps"
    | "community";
  startDate?: string;
  endDate?: string;
  archiveAfterDate?: string;
  autoArchiveAfterEndDate?: boolean;
  /** Local flyer / hero image under public/ */
  imagePath?: string;
}

export const projects: Project[] = [
  ...listReleased2026ProjectDocuments().map(({ slug, demographic }): Project => {
    const release = reviewed2026Release(slug)!;
    return {
      slug,
      title: release.title,
      titleFr: release.titleFr,
      location: release.location,
      locationFr: release.locationFr,
      status: "completed",
      demographic,
      description: release.description,
      descriptionFr: release.descriptionFr,
      beneficiaries: release.beneficiaries,
      goal: 0,
      raised: 0,
      startDate: release.date,
      endDate: release.date,
    };
  }),
  {
    slug: "widow-support",
    title: "Widow Support Program",
    location: "Bamenda",
    status: "active",
    demographic: "widows",
    description:
      "Financial aid and food support for widows and families rebuilding household stability.",
    beneficiaries: 15,
    goal: 3000,
    raised: 2400,
  },
  {
    slug: "emergency-relief",
    title: "Emergency Relief Fund",
    location: "Multiple Regions",
    status: "active",
    demographic: "idps",
    description:
      "Rapid response fund for urgent community needs including emergency food distribution, medical assistance, and temporary shelter during crises.",
    beneficiaries: 50,
    goal: 3500,
    raised: 1800,
  },
  {
    slug: "education-drive",
    title: "Annual Education Drive",
    location: "Rural Areas",
    status: "active",
    demographic: "orphans",
    description:
      "Annual back-to-school campaign providing supplies, uniforms, and school fees for children in rural communities who would otherwise miss out on education.",
    beneficiaries: 20,
    goal: 3000,
    raised: 800,
  },
  {
    slug: "christmas-giving",
    title: "Christmas Giving Campaign",
    location: "Bamenda & surrounding villages",
    status: "paused",
    demographic: "community",
    description:
      "Holiday season campaign bringing food packages, clothing, and gifts to families in need. A time to share love and joy with those who need it most.",
    beneficiaries: 50,
    goal: 1500,
    raised: 400,
  },
];
