import type { APIRoute } from "astro";
import { z } from "zod";
import { getStripe } from "../../lib/stripe";

const PRIMARY_ORIGIN = import.meta.env.PUBLIC_SITE_URL;
const ALLOWED_ORIGINS = PRIMARY_ORIGIN?.includes("localhost")
  ? [PRIMARY_ORIGIN, "http://localhost:4321"]
  : [PRIMARY_ORIGIN];
const MAX_BODY_SIZE = 10 * 1024; // 10KB

const SubscriptionSchema = z.object({
  amount: z.number().min(500).max(10000000),
  currency: z.enum(["usd"]).default("usd"),
  type: z.literal("monthly"),
  donorName: z.string().min(2).max(100),
  donorEmail: z.string().email(),
  isAnonymous: z.boolean().default(false),
  projectSlug: z.string().optional(),
});

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_SIZE) {
    return new Response(JSON.stringify({ error: "Payload too large" }), { status: 413, headers: { "Content-Type": "application/json" } });
  }

  try {
    const body = await request.json();
    const data = SubscriptionSchema.parse(body);
    const stripe = getStripe();

    const customers = await stripe.customers.list({ email: data.donorEmail, limit: 1 });
    let customer = customers.data[0];
    if (!customer) {
      customer = await stripe.customers.create({
        email: data.donorEmail,
        name: data.donorName,
        metadata: { is_anonymous: String(data.isAnonymous) },
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price_data: {
          currency: data.currency,
          unit_amount: data.amount,
          recurring: { interval: "month" },
          product_data: { name: `ADA Monthly Donation` },
        },
      }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        donor_name: data.donorName,
        donor_email: data.donorEmail,
        is_anonymous: String(data.isAnonymous),
        type: "monthly",
        ...(data.projectSlug && { project_slug: data.projectSlug }),
      },
    }, {
      idempotencyKey: `sub_${data.donorEmail}_${data.amount}_${Math.floor(Date.now() / 10000)}`,
    });

    const invoice = subscription.latest_invoice as any;
    const paymentIntent = invoice?.payment_intent;

    if (!paymentIntent?.client_secret) {
      return new Response(JSON.stringify({ error: 'Payment setup failed. Please try again.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret, subscriptionId: subscription.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return new Response(JSON.stringify({ error: "Invalid request data" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ error: "Subscription creation failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

export const prerender = false;
