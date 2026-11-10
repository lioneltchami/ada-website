// Keep the mobile shortcut while reading, but do not duplicate footer links
// or cover contact/legal information once the footer is visible.
(() => {
  const donate = document.querySelector("[data-floating-donate]");
  const footer = document.querySelector("[data-site-footer]");
  if (!donate || !footer || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(([entry]) => {
    donate.classList.toggle("invisible", entry.isIntersecting);
    donate.setAttribute("aria-hidden", String(entry.isIntersecting));
    donate.tabIndex = entry.isIntersecting ? -1 : 0;
  });
  observer.observe(footer);
})();
