const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Validate a client-generated checkout attempt id (UUID). */
export function isCheckoutAttemptId(value: string): boolean {
  return UUID_RE.test(value);
}

/** Stripe idempotency key for a one-time PaymentIntent. */
export function paymentIntentIdempotencyKey(checkoutAttemptId: string): string {
  return `pi_${checkoutAttemptId}`;
}

/** Stripe idempotency key for a monthly subscription create. */
export function subscriptionIdempotencyKey(checkoutAttemptId: string): string {
  return `sub_${checkoutAttemptId}`;
}
