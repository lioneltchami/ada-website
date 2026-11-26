// Run against a running ADA preview: node scripts/verify-mobile-header-overlay.mjs http://127.0.0.1:4321
import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:4321";
const browser = await chromium.launch({
  args: ["--single-process", "--no-zygote", "--disable-gpu"],
});
const page = await browser.newPage();

const geometry = () =>
  page.evaluate(() => {
    const rect = (selector) =>
      document.querySelector(selector).getBoundingClientRect();
    return {
      masthead: rect("#site-header").height,
      contentTop: rect("main").top,
      scrollY,
    };
  });

try {
  for (const [locale, prefix, openLabel, closeLabel] of [
    ["en", "", "Open menu", "Close menu"],
    ["fr", "/fr", "Ouvrir le menu", "Fermer le menu"],
  ]) {
    for (const [width, height] of [
      [320, 720],
      [390, 844],
      [844, 320],
    ]) {
      await page.setViewportSize({ width, height });
      const response = await page.goto(
        new URL(prefix + "/stories/", base).href,
      );
      assert(response?.ok(), `${locale}: could not load Stories`);
      const button = page.locator("#mobile-menu-btn");
      const panel = page.locator("#mobile-menu");
      const first = panel.locator("a").first();
      assert.equal(await button.getAttribute("aria-label"), openLabel);
      assert.equal(await panel.isVisible(), false);

      await page.evaluate(() => document.fonts.ready.then(() => undefined));

      const before = await geometry();
      await button.focus();
      await page.keyboard.press("Enter");
      await panel.waitFor();
      assert.equal(await button.getAttribute("aria-expanded"), "true");
      assert.equal(await button.getAttribute("aria-label"), closeLabel);
      assert.equal(
        await first.evaluate((el) => el === document.activeElement),
        true,
      );
      assert.deepEqual(await geometry(), before);
      assert.equal(await panel.locator('[aria-current="page"]').count(), 1);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        width,
      );
      const overlay = await panel.evaluate((el) => {
        const box = el.getBoundingClientRect();
        return {
          position: getComputedStyle(el).position,
          flush:
            Math.abs(
              box.top -
                document.querySelector("#site-header").getBoundingClientRect()
                  .bottom,
            ) <= 1,
          withinScreen: box.bottom <= innerHeight,
          abovePage: el.contains(
            document.elementFromPoint(box.left + 4, box.top + 4),
          ),
          scrolls: el.scrollHeight > el.clientHeight,
        };
      });

      assert.equal(overlay.position, "absolute");
      assert.equal(overlay.flush, true);
      assert.equal(overlay.withinScreen, true);
      assert.equal(overlay.abovePage, true);
      if (height === 320) assert.equal(overlay.scrolls, true);

      await page.keyboard.press("Escape");
      assert.equal(await panel.isVisible(), false);
      assert.equal(
        await button.evaluate((el) => el === document.activeElement),
        true,
      );
      assert.deepEqual(await geometry(), before);

      await page.evaluate(() =>
        window.scrollTo({ top: 250, behavior: "instant" }),
      );
      const scrolled = await geometry();
      await button.click();
      assert.equal(await panel.isVisible(), true);
      assert.deepEqual(await geometry(), scrolled);
      if (height !== 320) {
        const panelBox = await panel.boundingBox();
        await page.mouse.click(5, panelBox.y + panelBox.height + 20);
        assert.equal(
          await panel.isVisible(),
          false,
          "outside press must dismiss",
        );
        assert.equal(await button.getAttribute("aria-expanded"), "false");
        await button.click();
        const bottom = panel.locator("a").last();
        await bottom.focus();
        await page.keyboard.press("Tab");
        assert.equal(
          await panel.isVisible(),
          false,
          "tabbing into the page must dismiss",
        );
        assert.equal(await button.getAttribute("aria-expanded"), "false");
        await button.click();
      }

      await page.setViewportSize({ width: 1440, height: 900 });
      assert.equal(await button.isVisible(), false);
      assert.equal(await panel.isVisible(), false);
      assert.equal(
        await page.locator("[data-desktop-navigation]").isVisible(),
        true,
      );
      await page.waitForFunction(
        () =>
          document
            .querySelector("#mobile-menu-btn")
            .getAttribute("aria-expanded") === "false",
      );
      await page.setViewportSize({ width, height });
      assert.equal(await panel.isVisible(), false);
      console.log(
        `${locale} ${width}×${height}: stable masthead and content; menu stacks, dismisses and resets correctly`,
      );
    }
  }
} finally {
  await browser.close();
}
