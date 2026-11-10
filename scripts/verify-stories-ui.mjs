import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve('dist/client');
const out = path.resolve('output/stories-recovery');
await mkdir(out, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let target = path.resolve(root, `.${pathname}`);
    if (!target.startsWith(`${root}${path.sep}`) && target !== root) throw new Error('Invalid path');
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
    res.end(await readFile(target));
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const locale of ['en', 'fr']) {
    const prefix = locale === 'fr' ? '/fr' : '';
    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));
      await page.goto(`${base}${prefix}/stories/`, { waitUntil: 'networkidle' });
      const controls = page.locator('[data-story-filter-controls]');
      assert.equal(await controls.isVisible(), true);
      assert.equal(await page.locator('[data-story-filter]').count(), 4);
      assert.equal(await page.locator('[data-story-card]:visible').count(), 17);
      const filterCounts = { all: 17, story: 10, update: 4, announcement: 3 };
      for (const filter of ['story', 'update', 'announcement', 'all', 'announcement', 'story', 'all']) {
        const button = page.locator(`[data-story-filter="${filter}"]`);
        await button.click();
        await button.click();
        assert.equal(await page.locator('[data-story-card]:visible').count(), filterCounts[filter]);
        assert.equal(await page.locator('[data-story-filter][aria-pressed="true"]').count(), 1);
        assert.equal(await button.getAttribute('aria-pressed'), 'true');
        assert.match(await page.locator('[data-story-filter-count]').textContent(), new RegExp(`^${filterCounts[filter]} `));
        assert.equal(await button.evaluate(el => getComputedStyle(el).color), 'rgb(255, 255, 255)');
        assert.equal(await button.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(20, 83, 45)');
        assert.match(await button.evaluate(el => getComputedStyle(el, '::before').content), /✓/);
      }
      await page.locator('[data-story-filter="story"]').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('[data-story-card]:visible').count(), 10);
      await page.locator('[data-story-filter="all"]').focus();
      await page.keyboard.press('Space');
      assert.equal(await page.locator('[data-story-card]:visible').count(), 17);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${width} overflow`);
      assert.doesNotMatch(await page.locator('main').innerText(), /Most articles below discuss general themes|not verified individual|ne décrivent pas des témoignages individuels vérifiés/);
      const hero = page.locator('main section img').first();
      assert.equal(await hero.getAttribute('alt'), '');
      assert.equal(await hero.getAttribute('aria-hidden'), 'true');
      assert.equal(await hero.evaluate(el => el.complete && el.naturalWidth > 0), true, 'hero loaded');
      const portrait = page.locator('[data-story-card] img');
      assert.equal(await portrait.count(), 1);
      assert.equal(await portrait.evaluate(el => el.complete && el.naturalWidth > 0), true, 'portrait loaded');
      if ([1440, 390].includes(width)) await page.screenshot({ path: path.join(out, `${locale}-stories-${width}.png`), fullPage: false });
      await page.locator(`[data-story-card][href="${prefix}/stories/meet-esther-skills-training"]`).click();
      await page.waitForURL(`**${prefix}/stories/meet-esther-skills-training`);
      const back = page.locator(`main nav a[href="${prefix}/stories"]`);
      assert.equal(await back.count(), 1);
      const backBox = await back.boundingBox();
      const titleBox = await page.locator('h1').boundingBox();
      assert.ok(backBox.y < titleBox.y, 'return link above title');
      const articleText = await page.locator('article').innerText();
      assert.match(articleText, /Esther/);
      assert.match(articleText, /Hannah/);
      assert.doesNotMatch(articleText, /regular clients|her own salon|ses propres|income|salary|2024|2026/);
      assert.equal(await page.locator('article img').count(), 1);
      assert.equal(await page.locator('article img').getAttribute('alt'), locale === 'fr' ? 'Portrait d’Esther' : 'Portrait of Esther');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      if ([1440, 390].includes(width)) await page.screenshot({ path: path.join(out, `${locale}-esther-${width}.png`), fullPage: false });
      await back.click();
      await page.waitForURL(`**${prefix}/stories`);
      assert.equal(await page.locator('[data-story-card]:visible').count(), 17);
      await page.goBack();
      assert.match(page.url(), /meet-esther-skills-training/);
      await page.goForward();
      assert.equal(await page.locator('[data-story-card]:visible').count(), 17);
      for (const slug of ['transparency-report-2024', 'donations-changed-lives-2024']) {
        await page.goto(`${base}${prefix}/stories/${slug}/`);
        assert.equal(await page.locator('main [role="status"]').count(), 1);
        assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, follow');
        assert.doesNotMatch(await page.locator('article').innerText(), /\$\s?\d|\d[,.]?\d*\s?CFA/);
      }
      assert.deepEqual(errors, []);
      await page.close();
      results.push(`${locale} ${width}px: counts, repeated clicks, keyboard, selected state, photos, return/back/forward, overflow, financial panels passed`);
    }
    const noJs = await browser.newPage({ javaScriptEnabled: false });
    await noJs.goto(`${base}${prefix}/stories/`);
    assert.equal(await noJs.locator('[data-story-filter-controls]').isVisible(), false);
    assert.equal(await noJs.locator('[data-story-card]:visible').count(), 17);
    await noJs.close();
    results.push(`${locale}: no-JavaScript access to all 17 articles passed`);
  }
  console.log(results.join('\n'));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
