import { createClient, type SanityClient } from "@sanity/client";

let client: SanityClient | null = null;
const PROJECT_ID = "rj2m21gk";
const DATASET = "production";

function getSanityClient(): SanityClient {
  if (!client) {
    const projectId = import.meta.env.SANITY_PROJECT_ID || PROJECT_ID;
    const dataset = import.meta.env.SANITY_DATASET || DATASET;
    if (!projectId) throw new Error("SANITY_PROJECT_ID is required");
    client = createClient({ projectId, dataset, apiVersion: "2026-03-28", useCdn: true });
  }
  return client;
}

// Convert Sanity image reference to URL
export function sanityImageUrl(ref: string, width = 800): string {
  if (!ref) return '';
  // ref format: image-{id}-{dimensions}-{format}
  const [, id, dimensions, format] = ref.split('-');
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dimensions}.${format}?w=${width}&auto=format`;
}

export interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  status: "active" | "completed" | "paused";
  location: string;
  description: string;
  beneficiaries: number;
  goalAmount: number;
  raisedAmount: number;
  sortOrder: number;
  mainImage?: { asset: { _ref: string }; alt?: string };
}

export interface SanityImpactMetric {
  _id: string;
  label: string;
  value: number;
  suffix: string;
  displayOrder: number;
}

export interface SanityVolunteerRole {
  _id: string;
  title: string;
  description: string;
  timeCommitment: string;
  location: string;
  sortOrder: number;
}

export interface SanityDonationTier {
  _id: string;
  amount: number;
  impactDescription: string;
  sortOrder: number;
}

export interface SanitySiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  officeHours: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
}

export async function getProjects(): Promise<SanityProject[]> {
  return getSanityClient().fetch(`*[_type == "project"] | order(sortOrder asc)`);
}

export async function getProjectBySlug(slug: string): Promise<SanityProject | null> {
  return getSanityClient().fetch(`*[_type == "project" && slug.current == $slug][0]`, { slug });
}

export async function getImpactMetrics(): Promise<SanityImpactMetric[]> {
  return getSanityClient().fetch(`*[_type == "impactMetric"] | order(displayOrder asc)`);
}

export async function getVolunteerRoles(): Promise<SanityVolunteerRole[]> {
  return getSanityClient().fetch(`*[_type == "volunteerRole" && isActive == true] | order(sortOrder asc)`);
}

export async function getDonationTiers(): Promise<SanityDonationTier[]> {
  return getSanityClient().fetch(`*[_type == "donationTier" && isActive == true] | order(sortOrder asc)`);
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return getSanityClient().fetch(`*[_type == "siteSettings"][0]`);
}

export async function getTeamMembers() {
  return getSanityClient().fetch(`*[_type == "teamMember" && isActive == true] | order(sortOrder asc)`);
}

export async function getGalleryImages(category?: string) {
  const filter = category ? ` && category == $category` : "";
  return getSanityClient().fetch(`*[_type == "galleryImage"${filter}] | order(dateTaken desc)`, { category });
}

export async function getTestimonials() {
  return getSanityClient().fetch(`*[_type == "testimonial" && isFeatured == true]`);
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
  programs: { icon: string; title: string; description: string }[];
  financialSplit: { percentage: number; label: string }[];
  timeline: { year: string; event: string }[];
}

export interface SanityFaqResponse {
  _id: string;
  keywords: string[];
  response: string;
  sortOrder: number;
}

export async function getHomePage(): Promise<SanityHomePage | null> {
  return getSanityClient().fetch(`*[_type == "homePage"][0]`);
}

export async function getAboutPage(): Promise<SanityAboutPage | null> {
  return getSanityClient().fetch(`*[_type == "aboutPage"][0]`);
}

export async function getFaqResponses(): Promise<SanityFaqResponse[]> {
  return getSanityClient().fetch(`*[_type == "faqResponse"] | order(sortOrder asc)`);
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body: string;
  publishedAt: string;
  category: string;
}

export async function getBlogPosts(): Promise<SanityBlogPost[]> {
  return getSanityClient().fetch(`*[_type == "blogPost"] | order(publishedAt desc)`);
}

export async function getBlogPostBySlug(slug: string): Promise<SanityBlogPost | null> {
  return getSanityClient().fetch(`*[_type == "blogPost" && slug.current == $slug][0]`, { slug });
}
