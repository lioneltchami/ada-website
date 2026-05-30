#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${STRIPE_PAYMENT_DOMAIN:-apotidev.org}"

if [[ ! -f scripts/register-stripe-payment-domain.mjs ]]; then
  echo "Run this from the ADA website repo root." >&2
  exit 1
fi

if [[ -z "${STRIPE_SECRET_KEY:-}" ]]; then
  printf "Paste the Stripe live secret key for ADA. Input is hidden: " >&2
  stty -echo
  read -r STRIPE_SECRET_KEY
  stty echo
  printf "\n" >&2
fi

if [[ ! "$STRIPE_SECRET_KEY" =~ ^sk_(live|test)_ ]]; then
  echo "That does not look like a Stripe secret key." >&2
  unset STRIPE_SECRET_KEY
  exit 1
fi

if [[ "$STRIPE_SECRET_KEY" =~ ^sk_test_ ]]; then
  echo "Warning: this is a test-mode key. It will register the domain in Stripe test mode." >&2
fi

export STRIPE_SECRET_KEY
export STRIPE_PAYMENT_DOMAIN="$DOMAIN"

node scripts/register-stripe-payment-domain.mjs

unset STRIPE_SECRET_KEY

echo
echo "Next manual dashboard check:"
echo "Stripe Dashboard -> Settings -> Payment methods"
echo "Confirm Apple Pay, Google Pay, Link, and other desired payment methods are enabled for live payments."
