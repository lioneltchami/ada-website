export type EditorialProjectStatus = "active" | "completed" | "paused";

export interface Project {
  slug: string;
  title: string;
  location: string;
  status: EditorialProjectStatus;
  description: string;
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
  {
    slug: "back-to-school-buea-aug-2026",
    title: "Back to School Outreach — Buea",
    location: "Buea, South West Region",
    status: "active",
    demographic: "orphans",
    description:
      "Annual Back to School Reach Out in Buea (South West). Community campaign to equip underprivileged children with school supplies so they can learn, grow, and succeed. Flyer timing: anticipated in August 2026 — scheduled outreach window 15–18 August.",
    beneficiaries: 40,
    goal: 2500,
    raised: 0,
    startDate: "2026-08-15",
    endDate: "2026-08-18",
    archiveAfterDate: "2026-08-18",
    autoArchiveAfterEndDate: true,
    imagePath: "/images/projects/back-to-school-buea-aug-2026.png",
  },
  {
    slug: "back-to-school-bamenda-aug-2026",
    title: "Back to School Outreach — Bamenda",
    location: "Mile 4 Nkwen, Bamenda, North West Region",
    status: "active",
    demographic: "orphans",
    description:
      "Back to School Outreach in Mile 4 Nkwen, Bamenda (North West). Community campaign putting smiles on faces through education supplies for underprivileged children. Flyer timing: anticipated by the end of August 2026 — scheduled outreach window 28–31 August.",
    beneficiaries: 40,
    goal: 2500,
    raised: 0,
    startDate: "2026-08-28",
    endDate: "2026-08-31",
    archiveAfterDate: "2026-08-31",
    autoArchiveAfterEndDate: true,
    imagePath: "/images/projects/back-to-school-bamenda-aug-2026.png",
  },
  {
    slug: "widow-support",
    title: "Widow Support Program",
    location: "Bamenda",
    status: "active",
    demographic: "widows",
    description:
      "Financial aid, food packages, and skills training for widows rebuilding their lives after loss. Our program provides monthly food supplies, vocational training in tailoring and hairdressing, and a supportive community network.",
    beneficiaries: 15,
    goal: 3000,
    raised: 2400,
  },
  {
    slug: "girls-dignity-menstrual-health-bamenda-jun-2026",
    title: "Girls Dignity & Menstrual Health Outreach",
    location: "Bamenda",
    status: "active",
    demographic: "young-women",
    description:
      "A June 27 outreach for 25 girls in Bamenda providing menstrual dignity kits, buckets, soap, underwear, and a short health education session on menstrual hygiene and self-care.",
    beneficiaries: 25,
    goal: 1000,
    raised: 0,
    startDate: "2026-06-27",
    endDate: "2026-06-27",
    archiveAfterDate: "2026-06-27",
    autoArchiveAfterEndDate: true,
  },
  {
    slug: "education-orphans",
    title: "Education for Orphans",
    location: "Douala",
    status: "completed",
    demographic: "orphans",
    description:
      "Comprehensive education support for orphaned children including school supplies, uniforms, tuition fees, and mentorship programs. We believe every child deserves access to quality education regardless of their circumstances.",
    beneficiaries: 20,
    goal: 2500,
    raised: 2500,
  },
  {
    slug: "women-empowerment",
    title: "Young Women Empowerment",
    location: "Yaoundé",
    status: "active",
    demographic: "young-women",
    description:
      "Vocational training and microfinance opportunities for young women seeking financial independence. Programs include tailoring, hairdressing, computer skills, and small business management.",
    beneficiaries: 10,
    goal: 2000,
    raised: 1200,
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
