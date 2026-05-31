import { describe, expect, it } from "vitest";
import {
  donationFromStripeInvoice,
  donationFromStripePaymentIntent,
  thirtyDayFollowUpDueAt,
} from "../src/lib/donations";

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
          locale: "en",
          type: "one-time",
          project_slug: "general",
        },
      }),
    ).toMatchObject({
      stripe_payment_intent_id: "pi_123",
      amount_cents: 2500,
      currency: "usd",
      frequency: "one-time",
      locale: "en",
      donor_email: "donor@example.com",
      donor_name: "Ada Donor",
      project_slug: "general",
      follow_up_due_at: "2026-06-16T06:40:00.000Z",
      follow_up_status: "pending_30_day_update",
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
            locale: "fr",
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
      locale: "fr",
      donor_email: "monthly@example.com",
      is_anonymous: true,
      follow_up_due_at: "2026-06-16T06:40:00.000Z",
      follow_up_status: "pending_30_day_update",
    });
  });

  it("maps recurring invoice payments from Stripe's current invoice shape", () => {
    expect(
      donationFromStripeInvoice({
        id: "in_456",
        amount_paid: 7500,
        currency: "usd",
        created: 1_779_000_000,
        customer_email: "fallback@example.com",
        parent: {
          subscription_details: {
            subscription: "sub_current",
            metadata: {
              donor_name: "Current Monthly Donor",
              donor_email: "current-monthly@example.com",
              is_anonymous: "false",
              locale: "en",
              type: "monthly",
              project_slug: "widow-support",
            },
          },
        },
        payments: {
          data: [
            {
              payment: {
                payment_intent: "pi_current_monthly",
              },
            },
          ],
        },
      }),
    ).toMatchObject({
      stripe_invoice_id: "in_456",
      stripe_subscription_id: "sub_current",
      stripe_payment_intent_id: "pi_current_monthly",
      amount_cents: 7500,
      frequency: "monthly",
      donor_email: "current-monthly@example.com",
      donor_name: "Current Monthly Donor",
      project_slug: "widow-support",
    });
  });

  it("computes the 30-day donor follow-up date in UTC", () => {
    expect(thirtyDayFollowUpDueAt("2026-05-30T10:00:00.000Z")).toBe(
      "2026-06-29T10:00:00.000Z",
    );
  });
});
