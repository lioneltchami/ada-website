import type { APIRoute } from "astro";
import { jsonResponse } from "../../../lib/api-requests";
import { getEnv } from "../../../lib/runtime-env";

function getCronSecret(): string | undefined {
  return getEnv("DONATION_FOLLOWUP_CRON_SECRET");
}

function isAuthorized(request: Request): boolean {
  const secret = getCronSecret();
  if (!secret) return false;

  const auth = request.headers.get("authorization") || "";
  const cronSecret = request.headers.get("x-cron-secret") || "";
  return auth === `Bearer ${secret}` || cronSecret === secret;
}

export const POST: APIRoute = async ({ request, url }) => {
  if (!isAuthorized(request)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const dryRun = url.searchParams.get("dryRun") === "1";
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit") || 25), 1),
    100,
  );
  const now = new Date();
  const {
    getDueDonationFollowUps,
    markDonationFollowUpReminderSent,
  } = await import("../../../lib/donations");
  const { sendDonationFollowUpDigest } = await import("../../../lib/email");

  const donations = await getDueDonationFollowUps(now, limit);
  if (donations.length === 0) {
    return jsonResponse({ ok: true, dueCount: 0, dryRun });
  }

  const ids = donations
    .map((donation) => donation.id)
    .filter((id): id is string => Boolean(id));
  if (!dryRun) {
    await sendDonationFollowUpDigest({ donations, generatedAt: now });
    await markDonationFollowUpReminderSent(ids, now);
  }

  return jsonResponse({
    ok: true,
    dueCount: donations.length,
    reminderMarkedCount: dryRun ? 0 : ids.length,
    dryRun,
  });
};

export const GET = POST;

export const prerender = false;
