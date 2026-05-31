import type { APIRoute } from "astro";
import { z } from "zod";
import { getStripe } from "../../lib/stripe";
import {
  jsonResponse,
  readJsonBody,
  rejectInvalidOrigin,
  rejectOversizedBody,
} from "../../lib/api-requests";

const PRIMARY_ORIGIN = import.meta.env.PUBLIC_SITE_URL;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SubscriptionSchema = z.object({
  amount: z.number().min(500).max(10000000),
  currency: z.enum(["usd"]).default("usd"),
  type: z.literal("monthly"),
  donorName: z.string().trim().min(2).max(100),
  donorEmail: z.string().trim().toLowerCase().email(),
  isAnonymous: z.boolean().default(false),
  locale: z.enum(["en", "fr"]).default("en"),
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

  const sizeError = rejectOversizedBody(request);
  if (sizeError) return sizeError;

  try {
    const body = await readJsonBody(request);
    const data = SubscriptionSchema.parse(body);
    const stripe = getStripe();

    const customers = await stripe.customers.list({
      email: data.donorEmail,
      limit: 1,
    });
    let customer = customers.data[0];
    if (!customer) {
      customer = await stripe.customers.create({
        email: data.donorEmail,
        name: data.donorName,
        metadata: { is_anonymous: String(data.isAnonymous) },
      });
    }

    const subscription = await stripe.subscriptions.create(
      {
        customer: customer.id,
        items: [
          {
            price_data: {
              currency: data.currency,
              unit_amount: data.amount,
              recurring: { interval: "month" },
              product_data: { name: `ADA Monthly Donation` },
            },
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.confirmation_secret"],
        metadata: {
          donor_name: data.donorName,
          donor_email: data.donorEmail,
          is_anonymous: String(data.isAnonymous),
          type: "monthly",
          locale: data.locale,
          follow_up_plan: "receipt_thank_you_30_day_impact",
          ...(data.projectSlug && { project_slug: data.projectSlug }),
        },
      },
      {
        idempotencyKey: `sub_${data.donorEmail}_${data.amount}_${Math.floor(Date.now() / 10000)}`,
      },
    );

    const invoice = subscription.latest_invoice as any;
    const confirmationSecret = invoice?.confirmation_secret;

    if (!confirmationSecret?.client_secret) {
      return jsonResponse(
        { error: "Payment setup failed. Please try again." },
        500,
      );
    }

    return jsonResponse({
      clientSecret: confirmationSecret.client_secret,
      subscriptionId: subscription.id,
    });
  } catch (err: any) {
    if (err.message === "INVALID_JSON") {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }
    if (err.name === "ZodError") {
      return jsonResponse({ error: "Invalid request data" }, 400);
    }
    return jsonResponse({ error: "Subscription creation failed" }, 500);
  }
};

export const prerender = false;
