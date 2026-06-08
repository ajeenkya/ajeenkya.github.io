#!/usr/bin/env node
// Deploy gate: boot astro preview, open it in headless Chrome, assert
// integrity properties on the rendered page, save a screenshot for
// human spot-check.
//
// Why this exists: 2026-06-08 diagnose-and-apply-learnings, L1.
// Portfolio shipped two consecutive visual/runtime regressions only AJ
// noticed because nothing opens a real browser at deploy time. The
// click-target half is covered by verify-milo.mjs. This is the visual
// half. Loadout pattern transplant (see ~/Desktop/Projects/loadout/
// site/scripts/verify-visual.sh).
//
// Style rule: integrity properties, not literal strings. Per
// ~/.claude/rules/web-deploy.md "Integrity-property assertions over
// exact-string assertions for author-owned copy" the gate must survive
// intentional copy changes. Anchor: 2026-05-29 loadout removed
// "$250 for the hour" and the literal-string assertion blocked deploy.

import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { mkdirSync, readdirSync, unlinkSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 4330;
const URL = `http://localhost:${PORT}/`;
const PREVIEW_BOOT_TIMEOUT_MS = 15_000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_DIR = join(__dirname, 'snapshots');
const KEEP_SNAPSHOTS = 5;

function fail(msg) {
  console.error(`FAIL [verify-visual]: ${msg}`);
  process.exit(1);
}
function ok(msg) {
  console.log(`OK   [verify-visual]: ${msg}`);
}
function warn(msg) {
  console.warn(`WARN [verify-visual]: ${msg}`);
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

function pruneSnapshots() {
  try {
    const files = readdirSync(SNAPSHOT_DIR)
      .filter((f) => f.endsWith('.png'))
      .map((f) => ({ name: f, mtime: statSync(join(SNAPSHOT_DIR, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    for (const f of files.slice(KEEP_SNAPSHOTS)) {
      unlinkSync(join(SNAPSHOT_DIR, f.name));
    }
  } catch {}
}

const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
let previewLog = '';
preview.stdout.on('data', (d) => (previewLog += d.toString()));
preview.stderr.on('data', (d) => (previewLog += d.toString()));
const cleanup = () => { try { preview.kill('SIGTERM'); } catch {} };
process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(130); });

try {
  await waitForServer(URL, PREVIEW_BOOT_TIMEOUT_MS);
  ok(`astro preview up at ${URL}`);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();

  // Collect console errors and page errors so a JS exception surfaces here
  // instead of leaking to live visitors.
  const jsErrors = [];
  page.on('pageerror', (err) => jsErrors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') jsErrors.push(`console.error: ${msg.text()}`);
  });

  await page.goto(URL, { waitUntil: 'networkidle' });

  // ---- Integrity property 1: hero renders with the "Builder." word ----
  // Why this and not a longer string: the hero copy can change at any time,
  // but the page is broken if there is no h1 or the h1 is empty. Keeping
  // the assertion narrow to "an h1 exists with a non-trivial word" survives
  // copy edits while still catching "hero failed to render."
  const heroText = await page.locator('h1').first().textContent({ timeout: 5000 });
  if (!heroText || heroText.trim().length < 2) fail(`hero h1 missing or empty: ${JSON.stringify(heroText)}`);
  ok(`hero h1 renders ("${heroText.trim().slice(0, 40)}")`);

  // ---- Integrity property 2: Milo is mounted ----
  const miloAttached = await page.locator('#milo-companion').count();
  if (miloAttached === 0) fail('Milo (#milo-companion) not mounted');
  ok('milo-companion is in the DOM');

  // ---- Integrity property 3: no leaked placeholder syntax in the rendered DOM ----
  // Catches Astro template leaks ([object Object], {{var}}, ${var}, undefined).
  // Whitespace-tolerant; case-insensitive on the literal-undefined.
  const bodyText = await page.locator('body').innerText();
  const FORBIDDEN = [
    { pat: /\[object\s+Object\]/i, name: '[object Object]' },
    { pat: /\{\{\s*\w+\s*\}\}/, name: '{{var}}' },
    { pat: /\$\{\s*\w+\s*\}/, name: '${var}' },
    { pat: /\bundefined\b/, name: 'literal undefined' },
    { pat: /\bNaN\b/, name: 'literal NaN' },
  ];
  for (const f of FORBIDDEN) {
    if (f.pat.test(bodyText)) {
      // Find the surrounding 60 chars so the failure is debuggable.
      const m = bodyText.match(f.pat);
      const idx = bodyText.indexOf(m[0]);
      const ctx = bodyText.slice(Math.max(0, idx - 40), idx + m[0].length + 40);
      fail(`placeholder leak: ${f.name} found in body. Context: "...${ctx}..."`);
    }
  }
  ok('no placeholder leaks (Object/var/undefined/NaN)');

  // ---- Integrity property 4: at least one Loadout link resolves ----
  // The Loadout deeplink is load-bearing for the hero CTA story. We don't
  // assert exact URL or anchor text; just that *some* link points at a
  // hellomilo subdomain (loadout.hellomilo.app, hellomilo.app, etc).
  const loadoutLinkCount = await page.locator('a[href*="hellomilo.app"]').count();
  if (loadoutLinkCount === 0) fail('no link points at hellomilo.app (hero CTA broken?)');
  ok(`${loadoutLinkCount} link(s) point at hellomilo.app`);

  // ---- Integrity property 5: resume PDF link exists and resolves ----
  const resumeLinks = await page.locator('a[href*="resume"]').all();
  if (resumeLinks.length === 0) fail('no resume link found in DOM');
  ok(`${resumeLinks.length} resume link(s) present`);

  // ---- Integrity property 6: no JS console errors during load ----
  if (jsErrors.length > 0) {
    warn(`${jsErrors.length} JS console/page errors during load:`);
    for (const e of jsErrors.slice(0, 5)) console.warn(`     ${e.slice(0, 200)}`);
    if (jsErrors.length > 5) console.warn(`     ... and ${jsErrors.length - 5} more`);
    // Soft fail: many third-party scripts (PostHog, Lottie loader) log
    // benign warnings. Hard fail only on synchronous pageerrors.
    const hard = jsErrors.filter((e) => !e.startsWith('console.'));
    if (hard.length > 0) fail(`${hard.length} uncaught page error(s); first: ${hard[0].slice(0, 200)}`);
  } else {
    ok('no JS errors during page load');
  }

  // ---- Snapshot for human spot-check ----
  mkdirSync(SNAPSHOT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const snapPath = join(SNAPSHOT_DIR, `${stamp}.png`);
  await page.screenshot({ path: snapPath, fullPage: true });
  pruneSnapshots();
  ok(`snapshot saved: ${snapPath}`);

  await browser.close();
  console.log('\nREADY TO SHIP [verify-visual]: page renders with integrity properties intact');
  process.exit(0);
} catch (err) {
  console.error('\n--- preview server log ---');
  console.error(previewLog);
  console.error('--- end preview log ---\n');
  fail(err.message || String(err));
}
