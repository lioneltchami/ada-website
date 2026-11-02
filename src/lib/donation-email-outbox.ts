import {
  claimDonationEmailOutbox,
  completeDonationEmailOutbox,
  failDonationEmailOutbox,
} from "./donations";
import { sendResendEmailPayload } from "./email";

export async function sha256EmailPayload(
  payload: Record<string, unknown>,
): Promise<string> {
  const canonical = stableJson(payload);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonical),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return `{${Object.keys(object)
      .filter((key) => object[key] !== undefined)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(object[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

function safeDeliveryError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("invalid_idempotent_request")) {
    return "Provider rejected a repeated idempotency key with a different payload (HTTP 409)";
  }
  const status = message.match(/Email send failed:\s*(\d{3})/i)?.[1];
  if (status) return `Email provider returned HTTP ${status}`;
  return "Email delivery or completion state could not be confirmed";
}

export async function processDonationEmailOutbox(
  options: {
    limit?: number;
    onlyIds?: string[];
  } = {},
) {
  const jobs = await claimDonationEmailOutbox(options);
  const result = { claimed: jobs.length, sent: 0, deferred: 0, staleLease: 0 };

  for (const job of jobs) {
    if (!job.lease_token) {
      result.deferred += 1;
      continue;
    }

    const payloadHash = await sha256EmailPayload(job.email_payload);
    if (payloadHash !== job.payload_sha256) {
      try {
        await failDonationEmailOutbox({
          outboxId: job.id,
          leaseToken: job.lease_token,
          error: "Frozen email payload hash does not match stored digest",
          needsReview: true,
        });
      } catch {
        console.error(
          `[donation-outbox] Could not flag payload mismatch for job ${job.id}`,
        );
      }
      result.deferred += 1;
      continue;
    }

    try {
      const delivery = await sendResendEmailPayload(
        job.email_payload,
        job.idempotency_key,
      );
      if (delivery.simulated) {
        await failDonationEmailOutbox({
          outboxId: job.id,
          leaseToken: job.lease_token,
          error:
            "Provider key is absent; simulated send must not mark job sent",
        });
        result.deferred += 1;
        continue;
      }
      const completed = await completeDonationEmailOutbox({
        outboxId: job.id,
        leaseToken: job.lease_token,
        providerMessageId: delivery.providerMessageId || null,
      });
      if (completed) result.sent += 1;
      else {
        result.staleLease += 1;
        console.warn(
          `[donation-outbox] Provider accepted job ${job.id}, but its lease is no longer current`,
        );
      }
    } catch (error) {
      const needsReview =
        error instanceof Error &&
        error.message.includes("invalid_idempotent_request");
      const message = safeDeliveryError(error);
      try {
        const status = await failDonationEmailOutbox({
          outboxId: job.id,
          leaseToken: job.lease_token,
          error: message,
          needsReview,
        });
        if (status === "stale_lease") {
          result.staleLease += 1;
        } else {
          result.deferred += 1;
        }
      } catch {
        result.deferred += 1;
        console.error(
          `[donation-outbox] Could not persist retry state for job ${job.id}`,
        );
        // The row remains leased and can be recovered after lease expiry.
      }
    }
  }

  return result;
}
