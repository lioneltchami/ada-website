export const NO_REPORTING_NEEDS = "None yet";

export function reportingNeedsAreCompatible(needs: readonly string[]): boolean {
  return new Set(needs).size === needs.length &&
    (!needs.includes(NO_REPORTING_NEEDS) || needs.length === 1);
}

/** The production worker explicitly serves both ADA hosts; permit only a
 * same-origin submit on the www route, not www as an extra cross-origin sender. */
export function sponsorInquiryOrigin(requestOrigin: string, configuredOrigin?: string): string | undefined {
  return configuredOrigin === "https://apotidev.org" && requestOrigin === "https://www.apotidev.org"
    ? requestOrigin
    : configuredOrigin;
}
