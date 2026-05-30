import type { APIRoute } from "astro";
import { z } from "zod";
import {
  jsonResponse,
  readJsonBody,
  rejectInvalidOrigin,
  rejectOversizedBody,
} from "../../lib/api-requests";

const PRIMARY_ORIGIN = import.meta.env.PUBLIC_SITE_URL;

const MetricSchema = z.object({
  name: z.enum(["CLS", "FCP", "INP", "LCP", "TTFB"]),
  value: z.number().min(0).max(120_000),
  rating: z.enum(["good", "needs-improvement", "poor"]),
  path: z.string().trim().min(1).max(160),
  device: z.enum(["mobile", "desktop"]),
  connection: z.string().trim().max(40).optional(),
});

export const POST: APIRoute = async ({ request, url }) => {
  const originError = rejectInvalidOrigin(request, url.href, PRIMARY_ORIGIN);
  if (originError) return originError;

  const sizeError = rejectOversizedBody(request, 2 * 1024);
  if (sizeError) return sizeError;

  try {
    const body = await readJsonBody(request);
    const metric = MetricSchema.parse(body);

    console.info("[web-vitals]", metric);
    return jsonResponse({ ok: true });
  } catch (err: any) {
    if (err.message === "INVALID_JSON") {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }
    if (err.name === "ZodError") {
      return jsonResponse({ error: "Invalid metric" }, 400);
    }
    return jsonResponse({ error: "Metric not recorded" }, 500);
  }
};

export const prerender = false;
