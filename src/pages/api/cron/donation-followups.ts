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
  const { enqueueFollowUpDigest, getDueDonationFollowUps } =
    await import("../../../lib/donations");
  const { createDonationFollowUpDigestPayload } =
    await import("../../../lib/email");
  const { processDonationEmailOutbox, sha256EmailPayload } =
    await import("../../../lib/donation-email-outbox");

  const donations = await getDueDonationFollowUps(now, limit);
  if (donations.length === 0) {
    if (dryRun) {
      return jsonResponse({
        ok: true,
        dueCount: 0,
        dryRun,
        reminderMarkedCount: 0,
      });
    }
    const outboxDrain = await processDonationEmailOutbox({ limit: 20 });
    return jsonResponse({
      ok: true,
      dueCount: 0,
      dryRun,
      reminderMarkedCount: 0,
      outboxDrain,
    });
  }

  const ids = donations
    .map((donation) => donation.id)
    .filter((id): id is string => Boolean(id));
  let outboxId: string | null = null;
  let sentCount = 0;
  let outboxDrain = { claimed: 0, sent: 0, deferred: 0, staleLease: 0 };
  if (!dryRun) {
    const payload = createDonationFollowUpDigestPayload({
      donations,
      generatedAt: now,
    });
    outboxId = await enqueueFollowUpDigest({
      donationIds: ids,
      emailPayload: payload,
      payloadSha256: await sha256EmailPayload(payload),
      now,
    });
    if (outboxId) {
      const result = await processDonationEmailOutbox({
        limit: 1,
        onlyIds: [outboxId],
      });
      sentCount = result.sent;
    }
    outboxDrain = await processDonationEmailOutbox({ limit: 20 });
  }

  return jsonResponse({
    ok: true,
    dueCount: donations.length,
    reminderMarkedCount: sentCount ? ids.length : 0,
    outboxId,
    outboxDrain,
    dryRun,
  });
};

export const GET = POST;

export const prerender = false;
