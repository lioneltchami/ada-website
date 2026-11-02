import type { APIRoute } from "astro";
import { jsonResponse } from "../../../lib/api-requests";
import { getEnv } from "../../../lib/runtime-env";
import { processDonationEmailOutbox } from "../../../lib/donation-email-outbox";

function isAuthorized(request: Request): boolean {
  const secret = getEnv("DONATION_FOLLOWUP_CRON_SECRET");
  if (!secret) return false;
  return (
    request.headers.get("authorization") === `Bearer ${secret}` ||
    request.headers.get("x-cron-secret") === secret
  );
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAuthorized(request)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const result = await processDonationEmailOutbox({ limit: 20 });
  return jsonResponse({ ok: true, ...result });
};

export const prerender = false;
