(() => {
  const script = document.currentScript;
  const endpoint = script?.dataset.endpoint;
  if (!endpoint || !/^(www\.)?apotidev\.org$/.test(location.hostname) ||
      navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true ||
      navigator.webdriver || window.top !== window.self) return;

  const path = location.pathname;
  if (!/^\/[a-z0-9/-]*$/i.test(path) || path.length > 220 ||
      /^\/(?:fr\/)?(?:api|auth|account|dashboard|donate|preview|admin|studio)(?:\/|$)/i.test(path)) return;

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

  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element && event.target.closest("a[href]");
    if (!link || !event.isTrusted) return;
    let destination;
    try { destination = new URL(link.href); } catch { return; }
    const target = destination.pathname;
    if (destination.origin === location.origin) {
      if (/^\/(?:fr\/)?donate\/?$/.test(target)) count("donate-click", true);
      if (/^\/docs\/projects\/[a-z0-9-]+\/(?:tor|report)\.pdf$/i.test(target)) count("outreach-document-click", true);
    }
    if (destination.origin === "https://wa.me" && /^\/\d+\/?$/.test(target)) count("whatsapp-contact-click", true);
  }, { capture: true });
})();
