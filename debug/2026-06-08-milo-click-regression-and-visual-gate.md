---
date: 2026-06-08
session: 19218aea-8b59-4975-b5dd-8c779c4cbfd6
skill: diagnose-and-apply-learnings
project: portfolio
status: applied
---

# Milo click regression + visual-gate institutionalization

## TL;DR

Two consecutive UI regressions in two sessions, neither caught by the existing curl-only / structural deploy checks. Diagnosed root cause as the absence of a visual-render verification layer on this project (the Loadout pattern was never transplanted here). Built three structural fixes: a Playwright visual integrity gate, a regression-triage routing line in the project's CLAUDE.md, and a git pre-push hook that runs `npm run ship` for UI-affecting changes. All three applied and live.

## The arc

1. AJ reported "the site looks regressed; the Milo changes (slow, behind content, not intrusive) seem gone."
2. I checked git log, source, origin, deploy status, live CSS. Everything looked correct in the deployed code. I told AJ "browser cache, hard-refresh."
3. AJ came back: "but clicking Milo doesn't open hellomilo.app anymore. It was working last week."
4. Real diagnosis: commit 4234988 ("push Milo behind content layer") had set `.milo-companion { z-index: 1 }` while `.content-layer { z-index: 10 }` and every `<section>` spans full viewport width. Clicks in Milo's gutter landed on the section above and never reached his handler. Live for ~3 days.
5. Fix: raise Milo to z:55 (recession is already enforced by opacity 0.82 + gutter-only collision avoidance + slow motion, so the lower z-index was buying nothing). Also folded the duplicate `transition:` declaration. Commit 97ae37f.
6. Built `scripts/verify-milo.mjs` (Playwright headless click + intercept window.open + assert URL). Smoke-tested it against the bug by temporarily inverting z-index; gate failed in seconds with the precise root cause. Restored fix. Commit 39e3247.
7. Wired into GH Actions deploy.yml between build and deploy. CI green on run 27160992247.

## Friction events (what cost turns the system should have prevented)

### FE1: Two consecutive visual regressions only AJ caught. ~30 turns this session, ~50 across two.

**Root cause (ARCHITECTURE / CAPABILITY_GAP):** Portfolio lacks the two-layer-gate pattern Loadout has. Loadout has `verify-links.sh` + `verify-visual.sh` + `verify-checkout.mjs`. Portfolio had a build that proves types compile and HTML serves, but nothing opens a real browser. The visual half of the gate stack was never transplanted.

**Autonomy lens:** Claude couldn't catch this alone because there's no automated mechanism that opens a browser and reports "the rendered page is broken." The structural fix is a headless integrity check chained into ship + CI.

### FE2: I told AJ "browser cache" without opening a browser. ~5 turns of false closure.

**Root cause (INFORMATION_FLOW):** `~/.claude/rules/web-deploy.md` literally says *"Curl is necessary but not sufficient for any flow that touches a JS-rendered destination."* I had the rule. I didn't surface it on a regression report because the rule lives under "/sibling concerns" deep in the file and isn't routed at the project boundary.

**Autonomy lens:** Claude couldn't make the right call because the rule didn't fire at the trigger ("AJ reports a regression"). The structural fix is a project-local pointer in `CLAUDE.md` that surfaces the rule on regression reports.

### FE3: A single commit (4234988) shipped both a visual recession bug AND a click-break bug. Both went live because solo-to-main has no pre-push verification.

**Root cause (SYSTEM):** AJ ships direct-to-main on Portfolio. CI catches things ~30s after public; nothing catches them before. Pre-push is the cheapest place to insert the gate AJ already wanted to exist.

**Autonomy lens:** Claude couldn't catch this alone because there's no enforcement point between local commit and remote main. The structural fix is a git pre-push hook that runs `npm run ship` for UI-affecting changes.

### Non-friction events (dropped from learnings)

- **Em-dash gate fired once on a CSS comment.** Already structurally addressed by `~/.claude/hooks/em-dash-gate.sh`. Cost ~10s.
- **Sleep-then-poll command rejected by harness sleep rule.** Already structurally addressed. Switched to until-loop in 1 retry.
- **Playwright first run flaked on Milo's bob.** Fixed with `reducedMotion: 'reduce'` Playwright context option in 1 retry. The MiloCompanion script already had the reduced-motion branch.

## Proposed learnings (presented to AJ)

| # | Fix | Lever | ELI5 |
|---|---|---|---|
| L1 | `scripts/verify-visual.mjs` + chain into ship + CI | SYSTEM / CAPABILITY_GAP | Open a real browser at deploy time; assert the page renders and key things are present. |
| L2 | "Regression triage" line appended to Portfolio's `CLAUDE.md` | INFORMATION_FLOW | When AJ reports a regression, route to web-deploy.md's "curl is not sufficient" rule before inferring cache. |
| L3 | `scripts/pre-push.sh` git hook running `npm run ship` for UI-affecting changes | SYSTEM | Catch failures before the push leaves your machine, scoped so doc-only edits don't pay the Playwright tax. |

## Applied

All three approved by AJ via multi-select AskUserQuestion.

- **L1:** `scripts/verify-visual.mjs` (160 lines), wired into `package.json` (`verify:visual`, `verify`, `ship` npm scripts), wired into `.github/workflows/deploy.yml` between build and deploy. `scripts/snapshots/` gitignored. Smoke-tested locally; CI run pending verification on the push.
- **L2:** Portfolio `CLAUDE.md` extended with a "Regression triage" section that names the load-bearing rule (`web-deploy.md` "Curl is necessary but not sufficient") and cites the 2026-06-08 anchor.
- **L3:** `scripts/pre-push.sh` (executable, repo-tracked) + `.git/hooks/pre-push` symlink (per-worktree, one-time setup documented in the script header). Bypassable with `git push --no-verify` for emergencies. Skipped for doc-only edits via path-pattern grep against `git diff --name-only origin/main...HEAD`.

Commits: `9acfb5f gate: visual integrity gate + regression-triage rule + pre-push hook`. The pre-push hook fired on its own first push and all gates passed.

## Integrity properties asserted by verify-visual.mjs

1. Hero `h1` exists and has non-trivial text content.
2. `#milo-companion` is mounted in the DOM.
3. No placeholder leaks: `[object Object]`, `{{var}}`, `${var}`, literal `undefined`, literal `NaN`.
4. At least one link points at `hellomilo.app` (hero CTA story).
5. At least one resume link present.
6. No JS pageerrors during load (console.error is soft-warned; only uncaught pageerrors fail).
7. Saves full-page screenshot to `scripts/snapshots/`, keeps last 5.

Property-based, not literal-string, per `web-deploy.md` "Integrity-property assertions over exact-string assertions for author-owned copy." Anchor: 2026-05-29 Loadout `$250 for the hour` removal blocked deploy because that assertion was a literal-string check.

## What did NOT get done (deliberately)

- **A general CSS-lint hook for duplicate properties.** The 4234988 commit also shipped a duplicate `transition:` declaration silently killing the opacity transition. Stylelint could have caught this. Not gating now because the duplicate declaration only bit once; per gate-discipline three-question test, the failure shape needs a second instance before earning a gate.
- **A screenshot diff against a baseline.** verify-visual.mjs saves a snapshot but doesn't compare. Adding a baseline-diff layer is a clear next step IF visual regressions keep recurring despite the integrity assertions. Drop for now to avoid premature complexity.
- **Cache invalidation verification post-deploy.** GitHub Pages has its own CDN edge with ~10min TTL. The web-deploy.md Vercel cache section doesn't cleanly map. Defer until a recurring "fix shipped but stale visitors still saw bug" pattern shows up.

## Related rules
- `~/.claude/rules/web-deploy.md`: the two-layer-gate pattern this transplants; the curl-is-not-sufficient rule L2 surfaces.
- `~/.claude/rules/ship-readiness.md`: every shippable artifact needs a verification gate that runs as part of the build.
- `~/.claude/rules/gate-discipline.md`: the three-question test all three learnings passed.
- `~/.claude/rules/institutionalization-tempo.md`: this is the second gate this project has shipped (G-numbering deferred to AJ's release log when he wants it tracked).

## Index entries (logged to gstack learnings store)

See following gstack-learnings-log calls.
