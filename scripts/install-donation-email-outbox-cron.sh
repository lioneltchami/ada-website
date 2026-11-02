#!/usr/bin/env bash
set -euo pipefail

# Adds a frequent outbox drain using the existing cron secret file. It does not
# read or replace the secret value in this installer and never changes Worker
# secrets. Run only after the outbox route is deployed and the current secret is
# known to match the existing remote env file.
VPS_HOST="${VPS_HOST:-root@77.42.83.187}"
REMOTE_ENV="/opt/backups/ada-followup-cron.env"
REMOTE_SCRIPT="/opt/backups/ada-donation-email-outbox.sh"
CRON_MARKER="ada-donation-email-outbox"

ssh -o BatchMode=yes -o StrictHostKeyChecking=yes "$VPS_HOST" "bash -s" <<'REMOTE'
set -euo pipefail
umask 077
REMOTE_ENV="/opt/backups/ada-followup-cron.env"
REMOTE_SCRIPT="/opt/backups/ada-donation-email-outbox.sh"
CRON_MARKER="ada-donation-email-outbox"

if ! test -r "$REMOTE_ENV" || ! grep -q '^DONATION_FOLLOWUP_CRON_SECRET=.' "$REMOTE_ENV"; then
  echo "Existing donation cron secret file is missing or has no secret; refusing to install." >&2
  exit 1
fi

cat > "$REMOTE_SCRIPT" <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail
umask 077
. /opt/backups/ada-followup-cron.env
curl -fsS -X POST \
  -H "Authorization: Bearer ${DONATION_FOLLOWUP_CRON_SECRET}" \
  "https://apotidev.org/api/cron/donation-email-outbox" \
  >/dev/null 2>> /opt/backups/ada-donation-email-outbox.log
printf '\n' >> /opt/backups/ada-donation-email-outbox.log
SCRIPT
chmod 700 "$REMOTE_SCRIPT"

TMP_CRON="$(mktemp)"
crontab -l 2>/dev/null | grep -v "$CRON_MARKER" > "$TMP_CRON" || true
echo "*/5 * * * * $REMOTE_SCRIPT # $CRON_MARKER" >> "$TMP_CRON"
crontab "$TMP_CRON"
rm -f "$TMP_CRON"
REMOTE

echo "Installed ADA outbox drain cron on $VPS_HOST (every five minutes)."
