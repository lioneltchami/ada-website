const header = document.getElementById("site-header");
const btn = document.getElementById("mobile-menu-btn");
const menu = document.getElementById("mobile-menu");
const menuLabel = document.getElementById("mobile-menu-label");
const iconOpen = document.getElementById("menu-icon-open");
const iconClose = document.getElementById("menu-icon-close");
const isFrench = document.documentElement.lang === "fr";

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
