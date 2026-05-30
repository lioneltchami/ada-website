#!/usr/bin/env bash
set -euo pipefail

VPS_HOST="${VPS_HOST:-root@77.42.83.187}"
CRON_SECRET="${DONATION_FOLLOWUP_CRON_SECRET:-}"
CRON_URL="${DONATION_FOLLOWUP_CRON_URL:-https://apotidev.org/api/cron/donation-followups}"
CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-4d09fd6387eaad164e0236ab73ff09c7}"
REMOTE_ENV="/opt/backups/ada-followup-cron.env"
REMOTE_SCRIPT="/opt/backups/ada-donation-followups.sh"
CRON_MARKER="ada-donation-followups"
export CLOUDFLARE_ACCOUNT_ID

if [[ -z "$CRON_SECRET" ]]; then
  CRON_SECRET="$(openssl rand -hex 32)"
  echo "Generated DONATION_FOLLOWUP_CRON_SECRET."
fi

printf '%s' "$CRON_SECRET" | npx wrangler secret put DONATION_FOLLOWUP_CRON_SECRET

ssh "$VPS_HOST" "bash -s" <<SH
set -euo pipefail
umask 077
cat > "$REMOTE_ENV" <<'ENV'
DONATION_FOLLOWUP_CRON_SECRET=$CRON_SECRET
DONATION_FOLLOWUP_CRON_URL=$CRON_URL
ENV
cat > "$REMOTE_SCRIPT" <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail
. /opt/backups/ada-followup-cron.env
curl -fsS \\
  -H "Authorization: Bearer \${DONATION_FOLLOWUP_CRON_SECRET}" \\
  "\${DONATION_FOLLOWUP_CRON_URL}" \\
  >> /opt/backups/ada-donation-followups.log 2>&1
printf '\\n' >> /opt/backups/ada-donation-followups.log
SCRIPT
chmod 700 "$REMOTE_SCRIPT"
TMP_CRON="\$(mktemp)"
crontab -l 2>/dev/null | grep -v "$CRON_MARKER" > "\$TMP_CRON" || true
echo "15 14 * * * $REMOTE_SCRIPT # $CRON_MARKER" >> "\$TMP_CRON"
crontab "\$TMP_CRON"
rm -f "\$TMP_CRON"
SH

echo "Installed ADA donation follow-up cron on $VPS_HOST."
