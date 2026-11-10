const pairedStaticPaths = new Set([
  "/",
  "/about",
  "/contact",
  "/donate",
  "/donate/thank-you",
  "/gallery",
  "/get-involved",
  "/impact-scorecard",
  "/monthly",
  "/partners",
  "/privacy",
  "/projects",
  "/projects/archive",
  "/resources",
  "/sponsor",
  "/sponsor/inquiry",
  "/stories",
  "/team",
  "/terms",
  "/transparency",
]);

const authLocalePaths = new Set([
  "/auth/email-verified",
  "/auth/forgot-password",
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  "/auth/verify-email",
]);

const safeSponsorBudgets = new Set([
  "$500-$1,000",
  "$2,500-$5,000",
  "$10,000+",
  "Custom / discuss first",
  "In-kind support",
]);

export function normalizeLocalePath(pathname: string): string {
  const withoutLocale = pathname.replace(/^\/fr(?=\/|$)/, "") || "/";
  return withoutLocale.replace(/\/+$/, "") || "/";
}

export function hasLocaleAlternative(pathname: string): boolean {
  const path = normalizeLocalePath(pathname);
  if (pairedStaticPaths.has(path)) return true;
  return /^\/(?:projects\/[^/]+|projects\/archive\/[^/]+|stories\/[^/]+)$/.test(
    path,
  );
}

function isAuthLocaleRoute(pathname: string): boolean {
  return authLocalePaths.has(normalizeLocalePath(pathname));
}

function isOnlyLocaleQuery(searchParams: URLSearchParams): boolean {
  return [...searchParams.keys()].every((key) => key === "locale");
}

export function getLocaleSwitchPath(
  pathname: string,
  locale: "en" | "fr",
  searchParams = new URLSearchParams(),
): { href: string; authRoute: boolean } | null {
  const path = normalizeLocalePath(pathname);

  if (isAuthLocaleRoute(pathname)) {
    if (!isOnlyLocaleQuery(searchParams)) return null;
    const preserveTrailingSlash = pathname.length > 1 && pathname.endsWith("/");
    const authPath = preserveTrailingSlash && path !== "/" ? `${path}/` : path;
    const href = locale === "en" ? `${authPath}?locale=fr` : authPath;
    return { href, authRoute: true };
  }

  if (!hasLocaleAlternative(pathname)) return null;

  const targetBasePath =
    locale === "en" ? `/fr${path === "/" ? "" : path}` : path;
  const preserveTrailingSlash = pathname.length > 1 && pathname.endsWith("/");
  const targetPath =
    preserveTrailingSlash && targetBasePath !== "/"
      ? `${targetBasePath}/`
      : targetBasePath;
  const target = new URLSearchParams();

  // Sponsor tier CTAs encode a useful choice in the inquiry URL. Preserve only
  // a recognized tier value; never echo arbitrary query data into a locale link.
  if (path === "/sponsor/inquiry") {
    const budgetRange = searchParams.get("budgetRange");
    if (budgetRange && safeSponsorBudgets.has(budgetRange)) {
      target.set("budgetRange", budgetRange);
    }
  }

  // The thank-you page uses frequency only to decide whether to show an
  // additional monthly-giving panel. Preserve this harmless state and nothing else.
  if (path === "/donate/thank-you") {
    const frequency = searchParams.get("frequency");
    if (frequency === "monthly" || frequency === "one-time") {
      target.set("frequency", frequency);
    }
  }

  const query = target.toString();
  return {
    href: query ? `${targetPath}?${query}` : targetPath,
    authRoute: false,
  };
}

/** Keep the top bar useful on unpaired pages without inventing a translation.
 * Auth callbacks must not gain a fallback that could discard an in-flight session.
 */
export function getLanguageBarSwitch(
  pathname: string,
  locale: "en" | "fr",
  searchParams = new URLSearchParams(),
): { href: string; authRoute: boolean; homeFallback: boolean } | null {
  const pairedRoute = getLocaleSwitchPath(pathname, locale, searchParams);
  if (pairedRoute) return { ...pairedRoute, homeFallback: false };
  if (isAuthLocaleRoute(pathname)) return null;
  return {
    href: locale === "en" ? "/fr" : "/",
    authRoute: false,
    homeFallback: true,
  };
}
