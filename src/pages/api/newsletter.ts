import type { APIRoute } from "astro";
import { z } from "zod";
import {
  jsonResponse,
  readJsonBody,
  rejectInvalidOrigin,
  rejectOversizedBody,
} from "../../lib/api-requests";
import { sendNewsletterConfirmation } from "../../lib/email";
import { RATE_LIMITS, rejectIfRateLimited } from "../../lib/rate-limit";

const PRIMARY_ORIGIN = import.meta.env.PUBLIC_SITE_URL;

const Schema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const POST: APIRoute = async ({ request, url }) => {
  const originError = rejectInvalidOrigin(request, url.href, PRIMARY_ORIGIN);
  if (originError) return originError;

  const rateError = rejectIfRateLimited(
    request,
    "newsletter",
    RATE_LIMITS.newsletter,
  );
  if (rateError) return rateError;

  const sizeError = rejectOversizedBody(request);
  if (sizeError) return sizeError;

  try {
    const body = await readJsonBody(request);
    const { email } = Schema.parse(body);

    await sendNewsletterConfirmation(email);

    return jsonResponse({ success: true });
  } catch (err: any) {
    if (err.message === "INVALID_JSON") {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }
    if (err.name === "ZodError") {
      return jsonResponse({ error: "Invalid email" }, 400);
    }
    return jsonResponse({ error: "Subscription failed" }, 500);
  }
};

export const prerender = false;
