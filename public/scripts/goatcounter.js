(() => {
  const script = document.currentScript;
  const endpoint = script?.dataset.endpoint;
  if (!endpoint || !/^(www\.)?apotidev\.org$/.test(location.hostname) ||
      navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true ||
      navigator.webdriver || window.top !== window.self) return;

  const path = location.pathname;
  if (!/^\/[a-z0-9/-]*$/i.test(path) || path.length > 220 ||
      /^\/(?:fr\/)?(?:api|auth|account|dashboard|donate|preview|admin|studio)(?:\/|$)/i.test(path) ||
      /^\/(?:fr\/)?sponsor\/inquiry(?:\/|$)/i.test(path)) return;

  function count(value, event = false) {
    const url = new URL(endpoint);
    url.searchParams.set("p", value);
    if (event) url.searchParams.set("e", "true");
    url.searchParams.set("rnd", Math.random().toString(36).slice(2));
    fetch(url, {
      mode: "no-cors",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      keepalive: true,
      cache: "no-store",
    }).catch(() => {});
  }

  if (document.visibilityState === "visible") count(path);
  else {
    const countWhenVisible = () => {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", countWhenVisible);
      count(path);
    };
    document.addEventListener("visibilitychange", countWhenVisible);
  }

  const archiveCategories = new Set(["all", "education", "widows", "girls-young-women", "christmas", "community-events", "maternal-baby"]);
  const socialProfiles = new Map([
    ["facebook.com/apotidev", "social-facebook-click"],
    ["instagram.com/apotidev", "social-instagram-click"],
    ["threads.com/@apotidev", "social-threads-click"],
    ["threads.net/@apotidev", "social-threads-click"],
    ["linkedin.com/company/apotidev", "social-linkedin-click"],
  ]);
  document.addEventListener("click", (event) => {
    if (!event.isTrusted || !(event.target instanceof Element)) return;
    if (/^\/(?:fr\/)?projects\/archive\/?$/.test(path)) {
      const button = event.target.closest("#archive-category-filters button[data-archive-category]");
      const category = button?.dataset.archiveCategory;
      if (archiveCategories.has(category) && button.getAttribute("aria-pressed") !== "true") {
        count("archive-filter-" + category, true);
        return;
      }
    }
    const link = event.target.closest("a[href]");
    if (!link) return;
    let destination;
    try { destination = new URL(link.href); } catch { return; }
    const target = destination.pathname;
    if (destination.origin === location.origin) {
      if (/^\/(?:fr\/)?donate\/?$/.test(target)) count("donate-click", true);
      else if (/^\/docs\/projects\/[a-z0-9-]+\/(?:tor|report)\.pdf$/i.test(target)) count("outreach-document-click", true);
      else if (/^\/docs\/year-in-review\/ADA-20\d{2}-Year-in-Review\.pdf$/.test(target)) count("year-in-review-click", true);
      else if (/^\/(?:fr\/)?sponsor\/inquiry\/?$/.test(target)) count("sponsorship-inquiry-click", true);
      else if (target === "/docs/diligence/ada-registration-certificate.pdf" ||
               (/^\/(?:fr\/)?resources\/?$/.test(target) && destination.hash === "#due-diligence")) count("sponsor-materials-click", true);
    } else if (destination.origin === "https://wa.me" && /^\/\d+\/?$/.test(target)) count("whatsapp-contact-click", true);
    else if (destination.protocol === "https:") {
      const social = socialProfiles.get((destination.hostname.replace(/^www\./, "") + target.replace(/\/$/, "")).toLowerCase());
      if (social) count(social, true);
    }
  }, { capture: true });
})();
