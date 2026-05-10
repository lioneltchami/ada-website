import type { APIRoute } from "astro";
import { z } from "zod";
import { getStripe } from "../../lib/stripe";

const PRIMARY_ORIGIN = import.meta.env.PUBLIC_SITE_URL;
const ALLOWED_ORIGINS = PRIMARY_ORIGIN?.includes("localhost")
  ? [PRIMARY_ORIGIN, "http://localhost:4321"]
  : [PRIMARY_ORIGIN];
const MAX_BODY_SIZE = 10 * 1024; // 10KB

const PaymentSchema = z.object({
  amount: z.number().min(500).max(10000000),
  currency: z.enum(["usd"]).default("usd"),
  type: z.literal("one-time"),
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
    const data = PaymentSchema.parse(body);
    const stripe = getStripe();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      metadata: {
        donor_name: data.donorName,
        donor_email: data.donorEmail,
        is_anonymous: String(data.isAnonymous),
        type: "one-time",
        project_slug: data.projectSlug || "general",
      },
      receipt_email: data.donorEmail,
    }, {
      idempotencyKey: `pi_${data.donorEmail}_${data.amount}_${Math.floor(Date.now() / 10000)}`,
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return new Response(JSON.stringify({ error: "Invalid request data" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ error: "Payment creation failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

export const prerender = false;
