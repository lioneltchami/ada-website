#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";

const domain = process.env.STRIPE_PAYMENT_DOMAIN || "apotidev.org";

function readDotEnvValue(key) {
  if (!existsSync(".env")) return "";
  const lines = readFileSync(".env", "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [name, ...rest] = line.split("=");
    if (name === key) return rest.join("=").trim();
  }
  return "";
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || readDotEnvValue("STRIPE_SECRET_KEY");

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is required. Export it or place it in .env before running this script.");
  process.exit(1);
}

async function stripeRequest(path, init = {}) {
  const response = await fetch(`https://api.stripe.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(init.headers || {}),
    },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(`Stripe API failed (${response.status}): ${payload.error?.message || text}`);
  }
  return payload;
}

const existing = await stripeRequest(
  `/v1/payment_method_domains?domain_name=${encodeURIComponent(domain)}&limit=1`,
);

let paymentMethodDomain = existing.data?.[0];
if (!paymentMethodDomain) {
  paymentMethodDomain = await stripeRequest("/v1/payment_method_domains", {
    method: "POST",
    body: new URLSearchParams({ domain_name: domain }),
  });
  console.log(`Created Stripe payment method domain for ${domain}.`);
} else if (!paymentMethodDomain.enabled) {
  paymentMethodDomain = await stripeRequest(
    `/v1/payment_method_domains/${paymentMethodDomain.id}`,
    {
      method: "POST",
      body: new URLSearchParams({ enabled: "true" }),
    },
  );
  console.log(`Enabled existing Stripe payment method domain for ${domain}.`);
} else {
  console.log(`Stripe payment method domain already exists for ${domain}.`);
}

console.log(
  [
    `id=${paymentMethodDomain.id}`,
    `livemode=${paymentMethodDomain.livemode}`,
    `enabled=${paymentMethodDomain.enabled}`,
    `apple_pay=${paymentMethodDomain.apple_pay?.status || "unknown"}`,
    `google_pay=${paymentMethodDomain.google_pay?.status || "unknown"}`,
    `link=${paymentMethodDomain.link?.status || "unknown"}`,
  ].join("\n"),
);
