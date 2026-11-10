const header = document.getElementById("site-header");
const btn = document.getElementById("mobile-menu-btn");
const menu = document.getElementById("mobile-menu");
const menuLabel = document.getElementById("mobile-menu-label");
const iconOpen = document.getElementById("menu-icon-open");
const iconClose = document.getElementById("menu-icon-close");
const isFrench = document.documentElement.lang === "fr";
const authLocaleLinks = document.querySelectorAll("[data-auth-locale-switch]");
const localeLinks = document.querySelectorAll("[data-locale-switch]");
function syncAuthLocaleSwitches() {
  const authQueryKeys = [...new URLSearchParams(window.location.search).keys()];
  const authLocaleSwitchIsSafe =
    window.location.hash === "" &&
    authQueryKeys.every((key) => key === "locale");

  authLocaleLinks.forEach((link) => {
    if (authLocaleSwitchIsSafe) {
      link.removeAttribute("hidden");
      link.classList.remove("hidden");
      if (link.closest("#mobile-menu")) link.classList.add("block");
    } else {
      link.setAttribute("hidden", "");
      link.classList.add("hidden");
    }
  });
}

syncAuthLocaleSwitches();
window.addEventListener("hashchange", syncAuthLocaleSwitches);
window.addEventListener("popstate", syncAuthLocaleSwitches);

// Static pages cannot read the visitor's query string while rendering. Keep a
// recognized sponsor tier or donation frequency when switching locales, and
// discard every other query parameter so secrets or arbitrary state are never copied.
const unlocalizedPath =
  window.location.pathname.replace(/^\/fr(?=\/|$)/, "").replace(/\/+$/, "") ||
  "/";
const safeSponsorBudgets = new Set([
  "$500-$1,000",
  "$2,500-$5,000",
  "$10,000+",
  "Custom / discuss first",
  "In-kind support",
]);

if (unlocalizedPath === "/sponsor/inquiry") {
  const budgetRange = new URLSearchParams(window.location.search).get(
    "budgetRange",
  );
  if (budgetRange && safeSponsorBudgets.has(budgetRange)) {
    localeLinks.forEach((link) => {
      const target = new URL(link.href, window.location.origin);
      target.search = "";
      target.hash = "";
      target.searchParams.set("budgetRange", budgetRange);
      link.href = `${target.pathname}?${target.searchParams.toString()}`;
    });
  }
}

// The static thank-you page hides its monthly-giving suggestion for recurring
// donors. Keep that harmless display state in either language, never payment IDs.
if (unlocalizedPath === "/donate/thank-you") {
  const frequency = new URLSearchParams(window.location.search).get(
    "frequency",
  );
  if (frequency === "monthly" || frequency === "one-time") {
    localeLinks.forEach((link) => {
      const target = new URL(link.href, window.location.origin);
      target.search = "";
      target.hash = "";
      target.searchParams.set("frequency", frequency);
      link.href = `${target.pathname}?${target.searchParams.toString()}`;
    });
  }
}

window.addEventListener(
  "scroll",
  () => {
    const scrolled = window.scrollY > 8;
    header?.classList.toggle("border-gray-200", scrolled);
    header?.classList.toggle("border-transparent", !scrolled);
  },
  { passive: true },
);

function openMenu() {
  btn?.setAttribute("aria-expanded", "true");
  btn?.setAttribute("aria-label", isFrench ? "Fermer le menu" : "Close menu");
  if (menuLabel)
    menuLabel.textContent = isFrench ? "Fermer le menu" : "Close menu";
  menu?.classList.remove("hidden");
  iconOpen?.classList.add("hidden");
  iconClose?.classList.remove("hidden");
  menu?.querySelector("a")?.focus();
}

function closeMenu() {
  btn?.setAttribute("aria-expanded", "false");
  btn?.setAttribute("aria-label", isFrench ? "Ouvrir le menu" : "Open menu");
  if (menuLabel)
    menuLabel.textContent = isFrench ? "Ouvrir le menu" : "Open menu";
  menu?.classList.add("hidden");
  iconOpen?.classList.remove("hidden");
  iconClose?.classList.add("hidden");
  btn?.focus();
}

btn?.addEventListener("click", () => {
  const expanded = btn.getAttribute("aria-expanded") === "true";
  expanded ? closeMenu() : openMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menu?.classList.contains("hidden")) {
    closeMenu();
  }
});
