#!/usr/bin/env bash
# Git pre-push hook for Portfolio.
#
# Runs `npm run ship` (build + verify-visual + verify-milo) when the push
# includes changes that could affect rendered output. Skips for doc-only /
# state-only edits so small commits don't pay the Playwright tax.
#
# Why this exists: 2026-06-08 diagnose-and-apply-learnings, L3.
# Portfolio is a solo-to-main flow. CI gates catch failures ~30s after the
# push goes public. This catches them BEFORE the push leaves the machine,
# so visitors never see broken state even briefly.
#
# Wire it in (one-time, per worktree):
#   ln -sf ../../scripts/pre-push.sh .git/hooks/pre-push
#   chmod +x scripts/pre-push.sh
#
# Bypass for emergencies: `git push --no-verify`.

set -euo pipefail

# Git passes ref info on stdin: "<local_ref> <local_sha> <remote_ref> <remote_sha>".
# An empty stdin (e.g. when invoked manually) is fine; we use the diff between
# the local branch HEAD and its upstream to decide what's being pushed.

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"

# What changed between origin/main (the push target) and HEAD?
# If origin/main doesn't exist locally (fresh clone), fall back to last commit.
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  base="origin/main"
else
  base="HEAD~1"
fi

changed=$(git diff --name-only "$base"...HEAD 2>/dev/null || echo "")

# Paths that COULD affect rendered output. If any changed file matches one
# of these patterns, run the full ship gate.
gate_paths_pattern='^(src/|scripts/|public/|astro\.config|tailwind\.config|package\.json|package-lock\.json|\.github/workflows/)'

if [[ -z "$changed" ]]; then
  echo "[pre-push] no changes vs $base, skipping verify"
  exit 0
fi

if ! echo "$changed" | grep -qE "$gate_paths_pattern"; then
  echo "[pre-push] only doc/state changes detected, skipping verify"
  echo "[pre-push] changed:"
  echo "$changed" | sed 's/^/           /'
  exit 0
fi

echo "[pre-push] UI-affecting changes detected, running npm run ship..."
echo "[pre-push] changed:"
echo "$changed" | sed 's/^/           /'
echo

if ! npm run ship; then
  echo
  echo "[pre-push] FAIL: npm run ship failed. Push aborted."
  echo "[pre-push] Override with: git push --no-verify"
  exit 1
fi

echo
echo "[pre-push] OK: ship gate green, pushing."
