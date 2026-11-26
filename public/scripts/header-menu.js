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

function menuIsOpen() {
  return btn?.getAttribute("aria-expanded") === "true";
}

function openMenu() {
  btn?.setAttribute("aria-expanded", "true");
  btn?.setAttribute("aria-label", isFrench ? "Fermer le menu" : "Close menu");
  if (menuLabel)
    menuLabel.textContent = isFrench ? "Fermer le menu" : "Close menu";
  header?.setAttribute("data-menu-open", "");
  menu?.classList.remove("hidden");
  iconOpen?.classList.add("hidden");
  iconClose?.classList.remove("hidden");
  menu?.querySelector("a")?.focus({ preventScroll: true });
}

function closeMenu(restoreFocus = false) {
  btn?.setAttribute("aria-expanded", "false");
  btn?.setAttribute("aria-label", isFrench ? "Ouvrir le menu" : "Open menu");
  if (menuLabel)
    menuLabel.textContent = isFrench ? "Ouvrir le menu" : "Open menu";
  header?.removeAttribute("data-menu-open");
  menu?.classList.add("hidden");
  iconOpen?.classList.remove("hidden");
  iconClose?.classList.add("hidden");
  if (restoreFocus) btn?.focus({ preventScroll: true });
}

btn?.addEventListener("click", () => {
  menuIsOpen() ? closeMenu(true) : openMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuIsOpen()) {
    event.preventDefault();
    closeMenu(true);
  }
});

// This is a navigation disclosure, not a modal. Let focus travel normally
// and close the panel when the visitor moves to another part of the page.
function closeFromOutside(event) {
  if (
    menuIsOpen() &&
    !btn?.contains(event.target) &&
    !menu?.contains(event.target)
  ) {
    closeMenu();
  }
}

document.addEventListener("focusin", closeFromOutside);
document.addEventListener("click", closeFromOutside);

// Match the xl display utilities in Header.astro when crossing to desktop.
const desktopNavigation = window.matchMedia?.("(min-width: 80rem)");
desktopNavigation?.addEventListener("change", (event) => {
  if (event.matches && menuIsOpen()) closeMenu();
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted && menuIsOpen()) closeMenu();
});
