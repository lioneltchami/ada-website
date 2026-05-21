import { describe, expect, it } from "vitest";
import { donationFromStripePaymentIntent, donationFromStripeInvoice } from "../src/lib/donations";

describe("Stripe donation mapping", () => {
  it("maps a one-time payment intent into a persisted donation record", () => {
    expect(
      donationFromStripePaymentIntent({
        id: "pi_123",
        amount: 2500,
        currency: "usd",
        created: 1_779_000_000,
        receipt_email: "donor@example.com",
        metadata: {
          donor_name: "Ada Donor",
          donor_email: "donor@example.com",
          is_anonymous: "false",
          type: "one-time",
          project_slug: "general",
        },
      }),
    ).toMatchObject({
      stripe_payment_intent_id: "pi_123",
      amount_cents: 2500,
      currency: "usd",
      frequency: "one-time",
      donor_email: "donor@example.com",
      donor_name: "Ada Donor",
      project_slug: "general",
    });
  });

  it("maps a recurring invoice payment and preserves subscription identity", () => {
    expect(
      donationFromStripeInvoice({
        id: "in_123",
        amount_paid: 5000,
        currency: "usd",
        created: 1_779_000_000,
        customer_email: "monthly@example.com",
        subscription: "sub_123",
        payment_intent: "pi_monthly",
        subscription_details: {
          metadata: {
            donor_name: "Monthly Donor",
            donor_email: "monthly@example.com",
            is_anonymous: "true",
            type: "monthly",
            project_slug: "education-orphans",
          },
        },
      }),
    ).toMatchObject({
      stripe_invoice_id: "in_123",
      stripe_subscription_id: "sub_123",
      stripe_payment_intent_id: "pi_monthly",
      amount_cents: 5000,
      frequency: "monthly",
      donor_email: "monthly@example.com",
      is_anonymous: true,
    });
  });
});
