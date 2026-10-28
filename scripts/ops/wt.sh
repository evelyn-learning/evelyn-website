#!/usr/bin/env bash
# wt.sh — the one-command worktree workflow (docs/ops/WORKFLOW.md).
#
#   scripts/ops/wt.sh new <product>-<topic>      worktree off origin/main, env + deps set up
#   scripts/ops/wt.sh finish [--no-push]         gate the current worktree, fast-forward main, remove it
#   scripts/ops/wt.sh sweep                      list worktrees/branches: merged, stale (>7 d), ahead
#
# Works in the evelynlearning monorepo and in the academy repo (detected by
# package.json workspaces vs apps/web). Never deploys: deploys are the
# deploy-*.sh scripts, run from inside the worktree after `finish`'s gate
# but before its push when the change ships (merge → GATE → deploy → push).
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[ -n "$ROOT" ] || { echo "wt.sh: not inside a git repository" >&2; exit 1; }
# The repo ROOT is the shared checkout; worktrees live under it.
COMMON="$(cd "$(git -C "$ROOT" rev-parse --git-common-dir)" && pwd -P)"
REPO="$(dirname "$COMMON")"
WT_DIR="$REPO/.claude/worktrees"
SOFT_DAYS=7
SOFT_COMMITS=15

is_engine() { [ -d "$REPO/apps/tutor" ]; }
is_academy() { [ -d "$REPO/apps/web" ] && [ -d "$REPO/apps/api" ]; }

setup_env() {
  local wt="$1"
  if is_engine; then
    [ -f "$REPO/.env.local" ] && { cp "$REPO/.env.local" "$wt/.env.local"; chmod 600 "$wt/.env.local"; }
    [ -f "$REPO/.env.local.production" ] && ln -sfn "$REPO/.env.local.production" "$wt/.env.local.production"
    for app in tutor marketing; do
      [ -d "$wt/apps/$app" ] && ln -sfn ../../.env.local "$wt/apps/$app/.env.local"
    done
    # Ketcher bundle is build-generated and gitignored; a worktree without it
    # ships an empty chemistry editor (deploy-tutor.sh header).
    if [ -f "$REPO/apps/tutor/public/ketcher/bundle.js" ]; then
      cp "$REPO/apps/tutor/public/ketcher/bundle.js" "$REPO/apps/tutor/public/ketcher/bundle.css" "$wt/apps/tutor/public/ketcher/"
    fi
    # A cold Turbopack cache costs ~16 minutes on the first prod build of a new
    # worktree (measured 2026-10-28); a warm one ~10 s. Seed it from the root
    # checkout's cache when there is one (best effort — it is only a cache).
    for app in tutor marketing; do
      if [ -d "$REPO/apps/$app/.next/cache" ] && [ ! -d "$wt/apps/$app/.next/cache" ]; then
        mkdir -p "$wt/apps/$app/.next" && cp -R "$REPO/apps/$app/.next/cache" "$wt/apps/$app/.next/cache" 2>/dev/null || true
      fi
    done
    # Blog media is not in git (WORKFLOW.md §6); link the root checkout's copy
    # so local marketing dev shows blog images. The deploy never prunes it.
    if [ -d "$REPO/apps/marketing/public/images/blog" ] && [ ! -e "$wt/apps/marketing/public/images/blog" ]; then
      # Hardlinked copy, not a symlink: Turbopack refuses a symlink that points
      # outside the project root ("Symlink … is invalid, it points out of the
      # project") and the marketing build fails (10-28). Hardlinks cost no space.
      mkdir -p "$wt/apps/marketing/public/images/blog"
      rsync -a --link-dest="$REPO/apps/marketing/public/images/blog/" "$REPO/apps/marketing/public/images/blog/" "$wt/apps/marketing/public/images/blog/"
    fi
  elif is_academy; then
    [ -f "$REPO/.env.local" ] && { cp "$REPO/.env.local" "$wt/.env.local"; chmod 600 "$wt/.env.local"; }
    # Tenant production envs are gitignored; the deploy wrappers refuse without them.
    for f in "$REPO"/.env.*.production; do
      [ -f "$f" ] && { cp "$f" "$wt/$(basename "$f")"; chmod 600 "$wt/$(basename "$f")"; }
    done
  fi
}

cmd_new() {
  local name="${1:-}"
  [ -n "$name" ] || { echo "usage: wt.sh new <product>-<topic>   (e.g. gac-figure-labels, gdi-prefetch-fix, mktg-security-page)" >&2; exit 1; }
  case "$name" in
    gac-*|gdi-*|tutor-*|mktg-*|marketing-*|crimsora-*|evelyntutor-*|gameclass-*|kanzoo-*|portal-*|academy-*|ops-*|content-*|showcase-*) : ;;
    *) echo "wt.sh: name '$name' has no product prefix (gac-, gdi-, tutor-, mktg-, crimsora-, evelyntutor-, gameclass-, kanzoo-, portal-, academy-, ops-, content-, showcase-). See docs/ops/WORKFLOW.md." >&2; exit 1 ;;
  esac
  local wt="$WT_DIR/$name"
  [ -e "$wt" ] && { echo "wt.sh: $wt already exists" >&2; exit 1; }
  git -C "$REPO" fetch origin --quiet
  git -C "$REPO" worktree add "$wt" -b "$name" origin/main
  setup_env "$wt"
  echo "wt.sh: installing dependencies (root npm ci only — never in an app dir)…"
  (cd "$wt" && npm ci --no-audit --no-fund >/dev/null 2>&1) || { echo "wt.sh: npm ci failed in $wt" >&2; exit 1; }
  echo
  echo "Worktree ready: $wt  (branch $name, base $(git -C "$REPO" rev-parse --short origin/main))"
  echo "Next: cd $wt   — when done: scripts/ops/wt.sh finish"
}

gate() {
  # The gate is the targeted test set + typecheck + prod build of the app(s)
  # touched. test:all is for cross-cutting changes (WORKFLOW.md §4).
  local changed
  changed="$(git diff --name-only origin/main...HEAD; git diff --name-only)"
  if is_engine; then
    if echo "$changed" | grep -q '^apps/tutor/\|^packages/core/'; then
      echo "gate: tutor typecheck"; (cd apps/tutor && npx tsc --noEmit -p tsconfig.json)
      echo "gate: tutor test:changed"; (cd apps/tutor && npm run --silent test:changed)
      echo "gate: tutor prod build"; (npm --prefix apps/tutor run --silent build >/dev/null)
    fi
    if echo "$changed" | grep -q '^apps/marketing/\|^packages/core/'; then
      echo "gate: marketing typecheck"; (cd apps/marketing && npx tsc --noEmit -p tsconfig.json)
      echo "gate: marketing prod build"; (npm --prefix apps/marketing run --silent build >/dev/null)
    fi
  elif is_academy; then
    echo "gate: typecheck"; npm run --silent typecheck
    echo "gate: test:changed"; npm run --silent test:changed
  fi
  echo "gate: GREEN"
}

cmd_finish() {
  local push=1; [ "${1:-}" = "--no-push" ] && push=0
  local here; here="$(git rev-parse --show-toplevel)"
  case "$here" in "$WT_DIR"/*) : ;; *) echo "wt.sh finish: run it from inside a worktree under $WT_DIR" >&2; exit 1 ;; esac
  local branch; branch="$(git branch --show-current)"
  [ -z "$(git status --short --untracked-files=no)" ] || { echo "wt.sh finish: uncommitted changes — commit first" >&2; git status --short --untracked-files=no; exit 1; }
  git fetch origin --quiet
  if ! git merge-base --is-ancestor origin/main HEAD; then
    echo "wt.sh finish: origin/main moved — merging it first (MERGE origin/main BEFORE every deploy)"
    git merge --no-edit origin/main
  fi
  local n; n="$(git rev-list --count origin/main..HEAD)"
  echo "finish: $branch is $n commit(s) ahead of origin/main"
  gate
  if [ "$push" = 1 ]; then
    git push origin "$branch:main"
    echo "finish: origin/main → $(git rev-parse --short HEAD)"
    cd "$REPO"
    git worktree remove --force "$here"
    git branch -D "$branch" >/dev/null
    git -C "$REPO" merge --ff-only origin/main >/dev/null 2>&1 || echo "finish: root checkout not fast-forwarded (dirty or diverged) — leave it, it is not deployed from"
    echo "finish: worktree and branch removed"
  else
    echo "finish: --no-push — gate green, nothing pushed, worktree kept"
  fi
}

cmd_sweep() {
  git -C "$REPO" fetch origin --quiet
  echo "== worktrees"
  git -C "$REPO" worktree list --porcelain | awk '/^worktree /{print $2}' | while read -r wt; do
    [ "$wt" = "$REPO" ] && continue
    local br ahead age dirty
    br="$(git -C "$wt" branch --show-current)"
    ahead="$(git -C "$wt" rev-list --count origin/main..HEAD)"
    age=$(( ( $(date +%s) - $(git -C "$wt" log -1 --format=%ct) ) / 86400 ))
    dirty="$(git -C "$wt" status --short --untracked-files=no | wc -l | tr -d ' ')"
    local flag=""
    [ "$ahead" = 0 ] && flag="MERGED → remove"
    [ "$ahead" -gt "$SOFT_COMMITS" ] && flag="⚠ $ahead commits — check in"
    [ "$age" -gt "$SOFT_DAYS" ] && [ "$ahead" != 0 ] && flag="⚠ ${age}d old — check in"
    printf '%-36s %-32s ahead=%-3s age=%-3sd dirty=%-2s %s\n' "$(basename "$wt")" "$br" "$ahead" "$age" "$dirty" "$flag"
  done
  echo "== local branches not merged into origin/main"
  git -C "$REPO" branch --no-merged origin/main | sed 's/^/  /'
  echo "== local branches merged (safe to delete: git branch -d <name>)"
  git -C "$REPO" branch --merged origin/main | grep -vE '^\*|^\s*main$' | wc -l | sed 's/^ */  /;s/$/ branch(es)/'
}

case "${1:-}" in
  new) shift; cmd_new "$@" ;;
  finish) shift; cmd_finish "$@" ;;
  sweep) cmd_sweep ;;
  *) sed -n '2,10p' "$0"; exit 1 ;;
esac
