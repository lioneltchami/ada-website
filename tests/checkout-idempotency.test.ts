import { describe, expect, it } from "vitest";
import {
  isCheckoutAttemptId,
  paymentIntentIdempotencyKey,
  subscriptionIdempotencyKey,
} from "../src/lib/checkout-idempotency";

describe("checkout idempotency helpers", () => {
  it("accepts UUID checkout attempt ids", () => {
    expect(isCheckoutAttemptId("11111111-1111-4111-8111-111111111111")).toBe(
      true,
    );
    expect(isCheckoutAttemptId("not-a-uuid")).toBe(false);
    expect(isCheckoutAttemptId("pi_donor@example.com_2500_123")).toBe(false);
  });

  it("builds Stripe idempotency keys from the attempt id", () => {
    const id = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
    expect(paymentIntentIdempotencyKey(id)).toBe(`pi_${id}`);
    expect(subscriptionIdempotencyKey(id)).toBe(`sub_${id}`);
  });
});
