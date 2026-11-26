export const NO_REPORTING_NEEDS = "None yet";

export function reportingNeedsAreCompatible(needs: readonly string[]): boolean {
  return new Set(needs).size === needs.length &&
    (!needs.includes(NO_REPORTING_NEEDS) || needs.length === 1);
}
