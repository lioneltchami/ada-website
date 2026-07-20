import type { APIRoute } from "astro";
import { z } from "zod";
import {
  jsonResponse,
  readJsonBody,
  rejectInvalidOrigin,
  rejectOversizedBody,
} from "../../lib/api-requests";
import { paymentIntentIdempotencyKey } from "../../lib/checkout-idempotency";
import { RATE_LIMITS, rejectIfRateLimited } from "../../lib/rate-limit";
import { getStripe } from "../../lib/stripe";

const PRIMARY_ORIGIN = import.meta.env.PUBLIC_SITE_URL;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PaymentSchema = z.object({
  amount: z.number().min(500).max(10000000),
  currency: z.enum(["usd"]).default("usd"),
  type: z.literal("one-time"),
  donorName: z.string().trim().min(2).max(100),
  donorEmail: z.string().trim().toLowerCase().email(),
  isAnonymous: z.boolean().default(false),
  locale: z.enum(["en", "fr"]).default("en"),
  checkoutAttemptId: z.string().uuid(),
  projectSlug: z
    .string()
    .trim()
    .regex(SLUG_PATTERN)
    .max(80)
    .nullable()
    .optional()
    .transform((value) => value || undefined),
});

export const POST: APIRoute = async ({ request, url }) => {
  const originError = rejectInvalidOrigin(request, url.href, PRIMARY_ORIGIN);
  if (originError) return originError;

  const rateError = rejectIfRateLimited(
    request,
    "create-payment-intent",
    RATE_LIMITS.paymentIntent,
  );
  if (rateError) return rateError;

  const sizeError = rejectOversizedBody(request);
  if (sizeError) return sizeError;

  try {
    const body = await readJsonBody(request);
    const data = PaymentSchema.parse(body);
    const stripe = getStripe();

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: data.amount,
        currency: data.currency,
        automatic_payment_methods: { enabled: true },
        metadata: {
          donor_name: data.donorName,
          donor_email: data.donorEmail,
          is_anonymous: String(data.isAnonymous),
          type: "one-time",
          locale: data.locale,
          project_slug: data.projectSlug || "general",
          follow_up_plan: "receipt_thank_you_30_day_impact",
        },
        receipt_email: data.donorEmail,
      },
      {
        idempotencyKey: paymentIntentIdempotencyKey(data.checkoutAttemptId),
      },
    );

    return jsonResponse({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    if (err.message === "INVALID_JSON") {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }
    if (err.name === "ZodError") {
      return jsonResponse({ error: "Invalid request data" }, 400);
    }
    return jsonResponse({ error: "Payment creation failed" }, 500);
  }
};

export const prerender = false;
