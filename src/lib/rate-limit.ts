import { jsonResponse } from "./api-requests";

export type RateLimitOptions = {
  /** Max requests allowed in the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5_000;

function pruneBuckets(now: number): void {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size < MAX_BUCKETS) return;
  // Drop oldest half if still over cap (isolate memory guard).
  const keys = [...buckets.keys()].slice(0, Math.floor(buckets.size / 2));
  for (const key of keys) buckets.delete(key);
}

/** Best-effort client IP (Cloudflare first). */
export function clientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  if (forwarded) return forwarded;
  return "unknown";
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions,
  now = Date.now(),
): { ok: true } | { ok: false; retryAfterSec: number } {
  pruneBuckets(now);
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { ok: true };
  }
  if (existing.count >= options.limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  existing.count += 1;
  return { ok: true };
}

/** Returns a 429 Response when the IP+route bucket is exhausted. */
export function rejectIfRateLimited(
  request: Request,
  routeKey: string,
  options: RateLimitOptions,
): Response | null {
  const result = checkRateLimit(`${routeKey}:${clientIp(request)}`, options);
  if (result.ok) return null;
  return jsonResponse(
    { error: "Too many requests. Please try again later." },
    429,
    { "Retry-After": String(result.retryAfterSec) },
  );
}

/** Test helper. */
export function resetRateLimitStoreForTests(): void {
  buckets.clear();
}

export const RATE_LIMITS = {
  contact: { limit: 5, windowMs: 15 * 60 * 1000 },
  newsletter: { limit: 10, windowMs: 15 * 60 * 1000 },
  sponsorInquiry: { limit: 5, windowMs: 15 * 60 * 1000 },
  paymentIntent: { limit: 20, windowMs: 15 * 60 * 1000 },
  subscription: { limit: 20, windowMs: 15 * 60 * 1000 },
  performanceMetrics: { limit: 60, windowMs: 60 * 1000 },
} as const satisfies Record<string, RateLimitOptions>;
