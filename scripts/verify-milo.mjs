#!/usr/bin/env node
// Deploy gate: prove Milo is clickable and routes to hellomilo.app.
//
// Why this exists: 2026-06-08, commit 4234988 pushed Milo to z:1 to
// recess him behind the content layer. Content layer sits at z:10 and
// every section spans the full viewport width, so clicks in the gutter
// where Milo lands hit the section first and never reach his handler.
// Live for ~3 days before AJ noticed. A 30s headless click would have
// caught it the same commit.
//
// Runs after `npm run build`. Boots `astro preview` against dist/,
// drives Chromium, clicks Milo, intercepts window.open, asserts the URL.
// Exits non-zero on any failure so it can chain into deploy.

import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4329;
const URL = `http://localhost:${PORT}/`;
const PREVIEW_BOOT_TIMEOUT_MS = 15_000;

function fail(msg) {
  console.error(`FAIL [verify-milo]: ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`OK   [verify-milo]: ${msg}`);
}

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`server did not boot within ${timeoutMs}ms at ${url}`);
}

const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let previewLog = '';
preview.stdout.on('data', (d) => (previewLog += d.toString()));
preview.stderr.on('data', (d) => (previewLog += d.toString()));

const cleanup = () => {
  try {
    preview.kill('SIGTERM');
  } catch {}
};
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});

try {
  await waitForServer(URL, PREVIEW_BOOT_TIMEOUT_MS);
  ok(`astro preview up at ${URL}`);

  const browser = await chromium.launch({ headless: true });
  // reducedMotion: 'reduce' parks Milo static (see MiloCompanion.astro's
  // reduceMotion branch) so Playwright's stability check passes. Without
  // this, his perpetual gentle bob fails the click's "element is stable"
  // gate and the gate flakes on the live behavior we want to verify.
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();

  // Intercept window.open BEFORE navigation so the page's own handler sees
  // our stub. Real handler calls window.open('https://hellomilo.app', ...).
  await page.addInitScript(() => {
    window.__miloOpened = null;
    const origOpen = window.open;
    window.open = (url, ...rest) => {
      window.__miloOpened = url;
      // do NOT call origOpen so Playwright doesn't deal with a new context
      return null;
    };
  });

  await page.goto(URL, { waitUntil: 'load' });

  // Wait for the companion to mount. He's positioned by JS in tick(), so
  // we just need the element to exist and have non-zero rect.
  const milo = page.locator('#milo-companion');
  await milo.waitFor({ state: 'attached', timeout: 5000 });

  // Give the requestAnimationFrame loop a beat to apply the first transform.
  await page.waitForTimeout(400);

  const box = await milo.boundingBox();
  if (!box) fail('milo-companion has no bounding box (positioning never ran)');
  ok(`milo bounding box at (${Math.round(box.x)}, ${Math.round(box.y)}), ${Math.round(box.width)}x${Math.round(box.height)}`);

  // Click. The handler delays window.open by 180ms (heart-burst animation).
  await milo.click({ timeout: 3000 });
  await page.waitForTimeout(400);

  const opened = await page.evaluate(() => window.__miloOpened);
  if (!opened) fail('clicking Milo did NOT call window.open');
  if (!/hellomilo\.app/.test(opened)) fail(`window.open called with wrong URL: ${opened}`);
  ok(`window.open(${opened}) fired on click`);

  await browser.close();
  console.log('\nREADY TO SHIP [verify-milo]: click routes to hellomilo.app');
  process.exit(0);
} catch (err) {
  console.error('\n--- preview server log ---');
  console.error(previewLog);
  console.error('--- end preview log ---\n');
  fail(err.message || String(err));
}
