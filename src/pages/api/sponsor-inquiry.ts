import type { APIRoute } from "astro";
import { z } from "zod";
import {
  jsonResponse,
  readJsonBody,
  rejectInvalidOrigin,
  rejectOversizedBody,
} from "../../lib/api-requests";
import { sendSponsorInquiryNotification } from "../../lib/email";
import { RATE_LIMITS, rejectIfRateLimited } from "../../lib/rate-limit";

const PRIMARY_ORIGIN = import.meta.env.PUBLIC_SITE_URL;

const SponsorType = z.enum([
  "Individual",
  "Church or faith community",
  "Company / CSR team",
  "School or university",
  "Diaspora group",
  "Foundation or grantmaker",
  "Other",
]);

const Interest = z.enum([
  "Sponsor a project",
  "Sponsor a program cycle",
  "Run a group campaign",
  "Give monthly or quarterly",
  "Offer in-kind support",
  "Request documents first",
  "Not sure yet",
]);

const BudgetRange = z.enum([
  "$500-$1,000",
  "$2,500-$5,000",
  "$10,000+",
  "Custom / discuss first",
  "In-kind support",
]);

const PreferredTiming = z.enum([
  "Ready now",
  "Within 30 days",
  "This quarter",
  "Planning for later",
  "Just gathering information",
]);

const RecognitionPreference = z.enum([
  "Public recognition is okay",
  "Internal acknowledgment only",
  "Anonymous in public materials",
  "Discuss first",
]);

const ReportingNeed = z.enum([
  "Sponsor packet",
  "Registration certificate",
  "Financial summary",
  "Safeguarding policy",
  "Project reports",
  "Invoice or sponsorship agreement",
  "Board / internal approval support",
  "None yet",
]);

const CallPreference = z.enum([
  "Email first",
  "Book a short call",
  "WhatsApp is best",
  "Send documents first",
]);

const Schema = z.object({
  website: z.string().max(0).optional().default(""),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(40).optional().default(""),
  organization: z.string().trim().min(2).max(150),
  country: z.string().trim().min(2).max(80),
  sponsorType: SponsorType,
  interest: Interest,
  budgetRange: BudgetRange,
  preferredTiming: PreferredTiming,
  recognitionPreference: RecognitionPreference,
  fundingPurpose: z.string().trim().min(10).max(1000),
  reportingNeeds: z.array(ReportingNeed).max(7).default([]),
  invoiceOrWire: z.boolean(),
  callPreference: CallPreference,
  notes: z.string().trim().max(1000).optional().default(""),
});

export const POST: APIRoute = async ({ request, url }) => {
  const originError = rejectInvalidOrigin(request, url.href, PRIMARY_ORIGIN);
  if (originError) return originError;

  const rateError = rejectIfRateLimited(
    request,
    "sponsor-inquiry",
    RATE_LIMITS.sponsorInquiry,
  );
  if (rateError) return rateError;

  const sizeError = rejectOversizedBody(request);
  if (sizeError) return sizeError;

  try {
    const body = await readJsonBody(request);
    const data = Schema.parse(body);

    await sendSponsorInquiryNotification(data);

    return jsonResponse({ success: true });
  } catch (err: any) {
    if (err.message === "INVALID_JSON") {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }
    if (err.name === "ZodError") {
      return jsonResponse({ error: "Invalid sponsor inquiry" }, 400);
    }
    return jsonResponse({ error: "Failed to send sponsor inquiry" }, 500);
  }
};

export const prerender = false;
