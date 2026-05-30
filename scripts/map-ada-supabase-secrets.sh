#!/usr/bin/env bash
set -euo pipefail

VPS_HOST="${VPS_HOST:-root@77.42.83.187}"
REMOTE_ENV="${REMOTE_ENV:-/data/coolify/services/adawebsitekavora000001/.env}"
SUPABASE_URL="${SUPABASE_URL:-https://supabase-ada.77.42.83.187.sslip.io}"
CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-4d09fd6387eaad164e0236ab73ff09c7}"
RUN_BUILD="${RUN_BUILD:-1}"
RUN_DEPLOY="${RUN_DEPLOY:-1}"
DRY_RUN="${DRY_RUN:-0}"
export CLOUDFLARE_ACCOUNT_ID

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

remote_env_value() {
  local key="$1"
  ssh "$VPS_HOST" "python3 - '$REMOTE_ENV' '$key'" <<'PY'
from pathlib import Path
import sys

env_path = Path(sys.argv[1])
wanted_key = sys.argv[2]

for line in env_path.read_text().splitlines():
    if not line or line.startswith("#") or "=" not in line:
        continue
    key, value = line.split("=", 1)
    if key == wanted_key:
        print(value)
        raise SystemExit(0)

raise SystemExit(f"Missing {wanted_key} in {env_path}")
PY
}

put_secret() {
  local name="$1"
  local value="$2"

  if [[ -z "$value" ]]; then
    echo "Refusing to set empty secret: $name" >&2
    exit 1
  fi

  if [[ "$DRY_RUN" == "1" ]]; then
    echo "Dry run: would set $name"
    return
  fi

  echo "Setting $name"
  printf '%s' "$value" | npx wrangler secret put "$name"
}

require_command ssh
require_command npm

if [[ ! -f wrangler.jsonc ]]; then
  echo "Run this script from the ADA website repo root, where wrangler.jsonc exists." >&2
  exit 1
fi

echo "Reading Supabase keys from $VPS_HOST:$REMOTE_ENV"
echo "Using Cloudflare account $CLOUDFLARE_ACCOUNT_ID"
SUPABASE_ANON_KEY="$(remote_env_value SERVICE_SUPABASEANON_KEY)"
SUPABASE_SERVICE_ROLE_KEY="$(remote_env_value SERVICE_SUPABASESERVICE_KEY)"

put_secret PUBLIC_SUPABASE_URL "$SUPABASE_URL"
put_secret PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY"
put_secret SUPABASE_URL "$SUPABASE_URL"
put_secret SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_ROLE_KEY"

if [[ "$RUN_BUILD" == "1" ]]; then
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "Dry run: would run npm run build"
  else
  echo "Running build"
  npm run build
  fi
fi

if [[ "$RUN_DEPLOY" == "1" ]]; then
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "Dry run: would run npx wrangler deploy"
  else
  echo "Deploying Worker"
  npx wrangler deploy
  fi
else
  echo "Skipping deploy because RUN_DEPLOY=$RUN_DEPLOY"
fi

echo "Supabase secrets are mapped for the ADA website Worker."
