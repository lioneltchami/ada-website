import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const installer = readFileSync(
  new URL("../scripts/install-donation-email-outbox-cron.sh", import.meta.url),
  "utf8",
);

describe("donation outbox cron installer", () => {
  it("uses authenticated POST and preserves both schedules", () => {
    expect(installer).toContain("curl -fsS -X POST");
    expect(installer).toContain('Authorization: Bearer ${DONATION_FOLLOWUP_CRON_SECRET}');
    expect(installer).toContain('https://apotidev.org/api/cron/donation-email-outbox');
    expect(installer).toContain('*/5 * * * * $REMOTE_SCRIPT # $CRON_MARKER');
    expect(installer).toContain('crontab -l 2>/dev/null | grep -v "$CRON_MARKER"');
    expect(installer).not.toMatch(/curl\s+-fsS\s+\\\n\s+-H/);
  });
});
