import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { chromium } from "playwright";

const siteRoot = resolve("dist/client");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};
const server = process.argv[2] ? null : createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let file = resolve(siteRoot, "." + pathname);
    if (file !== siteRoot && !file.startsWith(siteRoot + sep)) throw Error("outside site");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const info = await stat(file);
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] ?? "application/octet-stream",
      "Content-Length": info.size,
    });
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404).end();
  }
});
if (server) await new Promise((done) => server.listen(0, "127.0.0.1", done));
const origin = process.argv[2] ?? `http://127.0.0.1:${server.address().port}`;
const expectedSlugs = [
  "school-supply-distribution-feb-2022",
  "back-to-school-buea-2024",
  "christmas-giving-dec-2022",
];
const expectedOutreachPhotos = new Set([
  "march-2022-widows-team-supplies.webp",
  "widows-outreach-2021.jpg",
  "prenatal-care-support-program-feature.webp",
  "idp-girls-baking-training-jul-2022.webp",
  "school-supply-distribution-feb-2022.webp",
  "back-to-school-buea-2024-feature.webp",
  "christmas-giving-dec-2022.webp",
  "city-cleanup-may-2025-feature.webp",
]);
let browser;
try {
  browser = await chromium.launch();
  for (const locale of ["en", "fr"]) {
    for (const width of [320, 390, 1440]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
        hasTouch: width < 600,
      });
      const prefix = locale === "fr" ? "/fr" : "";
      await page.goto(origin + prefix + "/", { waitUntil: "domcontentloaded" });
      assert.equal(await page.locator("html").getAttribute("lang"), locale);
      const outreachPhotos = await page.locator('main img[src^="/images/projects/"]').evaluateAll(
        (images) => images.map((photo) => photo.getAttribute("src").split("/").at(-1)),
      );
      assert.equal(outreachPhotos.length, new Set(outreachPhotos).size, "Do not repeat an outreach photo on the homepage.");
      assert.deepEqual(new Set(outreachPhotos), expectedOutreachPhotos);
      const hero = page.locator("[data-home-hero]");
      const headline = await hero.locator("h1").textContent();
      assert.match(headline, locale === "fr" ? /femmes et aux adolescentes/ : /women and adolescent girls/);
      const lead = hero.locator("[data-hero-image]:not([hidden])");
      const leadSrc = await lead.getAttribute("src");
      const story = hero.locator("[data-hero-caption]:not([hidden]) a");
      const firstStory = await story.getAttribute("href");
      assert.equal(firstStory, `${prefix}/projects/archive/widow-support-food-cash-mar-2022/`);
      const heroBack = hero.locator('[data-hero-step="-1"]');
      const heroNext = hero.locator('[data-hero-step="1"]');
      await heroNext.waitFor({ state: "visible" });
      await heroNext.press("Enter");
      assert.notEqual(await lead.getAttribute("src"), leadSrc);
      assert.equal(await story.getAttribute("href"), `${prefix}/projects/archive/first-widow-home-visits-2021/`);
      assert.equal(await hero.locator("h1").textContent(), headline);
      await heroBack.click();
      assert.equal(await lead.getAttribute("src"), leadSrc);
      assert.equal(await story.getAttribute("href"), firstStory);
      const section = page.locator("[data-home-outreach-photos]");
      const list = section.locator("[data-photo-list]");
      const next = section.locator("[data-photo-next]");
      const previous = section.locator("[data-photo-previous]");
      const cards = list.locator("li");
      await next.waitFor({ state: "visible" });
      assert.equal(await cards.count(), 3);
      assert.equal(await previous.getAttribute("aria-disabled"), "true");
      assert.equal(await next.getAttribute("aria-disabled"), "false");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const scrollLeft = () => list.evaluate((node) => node.scrollLeft);
      assert.equal(await scrollLeft(), 0);
      await next.click();
      await page.waitForFunction(() => document.querySelector("[data-photo-list]").scrollLeft > 2);
      await page.waitForFunction(() => document.querySelector("[data-photo-previous]").getAttribute("aria-disabled") === "false");
      await previous.click();
      await page.waitForFunction(() => document.querySelector("[data-photo-list]").scrollLeft <= 2);
      await list.focus();
      await list.press("End");
      await page.waitForFunction(() => document.querySelector("[data-photo-next]").getAttribute("aria-disabled") === "true");
      await list.press("Home");
      await page.waitForFunction(() => document.querySelector("[data-photo-list]").scrollLeft <= 2);
      await list.press("ArrowRight");
      await page.waitForFunction(() => document.querySelector("[data-photo-list]").scrollLeft > 2);
      if (width === 390) {
        for (const [i, slug] of expectedSlugs.entries()) {
          const image = cards.nth(i).locator("img");
          await image.scrollIntoViewIfNeeded();
          await image.evaluate((node) => node.decode());
          assert.ok((await image.getAttribute("alt")).trim());
          const ref = cards.nth(i).locator("a");
          assert.equal(await ref.getAttribute("href"), `${prefix}/projects/archive/${slug}/`);
          assert.ok((await page.request.get(new URL(await ref.getAttribute("href"), origin).href)).ok());
        }
      }
      await page.close();
    }
    const page = await browser.newPage({ javaScriptEnabled: false });
    const prefix = locale === "fr" ? "/fr" : "";
    await page.goto(origin + prefix + "/", { waitUntil: "domcontentloaded" });
    const list = page.locator("[data-photo-list]");
    assert.equal(await list.getByRole("listitem").count(), 3);
    assert.ok(await list.evaluate((node) => node.scrollWidth > node.clientWidth));
    assert.equal(await page.locator("[data-photo-next]").isVisible(), false);
    assert.equal(await page.locator("[data-hero-controls]").isVisible(), false);
    assert.equal(await page.locator("[data-hero-image]:not([hidden])").count(), 1);
    await page.close();
  }
  console.log("Bilingual homepage photo strip passed mobile and desktop browser checks.");
} finally {
  await browser?.close();
  if (server) await new Promise((done) => server.close(done));
}
