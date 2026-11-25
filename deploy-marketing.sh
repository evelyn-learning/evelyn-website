#!/bin/bash

# Evelyn Learning - Deploy the MARKETING app to Production
# Server: root@85.239.239.134 (US box since 2026-10-13; was root@84.247.185.169, Germany)
# Remote path: /root/evelyn-marketing
#
# One of the two halves of the M1a workspace split (the other is
# deploy-tutor.sh); together they replace the single
# deploy-to-production.sh, which deployed one app from the repo root.
# Each script owns its own remote directory, its own pm2 process and its
# own port, so the two apps deploy and restart completely independently.
#
#   this script  -> apps/marketing  -> /root/evelyn-marketing  -> pm2 evelyn-marketing-a / -b  -> :3001 / :3021
#   deploy-tutor -> apps/tutor      -> /root/evelyn-tutor      -> pm2 evelyn-tutor      -> :3007
#
# Marketing keeps :3001 (the port the old single `evelyn-website` process
# used) so nginx's default upstream needed no change.
#
# ── TWO WAYS TO DEPLOY ──────────────────────────────────────────────────────
# MARKETING_BLUE_GREEN=0 (the old path; refuses to run now that the server is
#   on the two-slot layout): one process, `evelyn-marketing` on :3001, build
#   dir .next, restarted in place. Port 3001 closed for about 5 seconds.
# MARKETING_BLUE_GREEN unset or 1 (the default since the first two-slot deploy
#   on 2026-11-25): two slots, no gap. Slot a = :3001 / .next-a,
#   slot b = :3021 / .next-b, pm2 names evelyn-marketing-a / -b. The build is
#   made for the idle slot, started there, health-checked on its own port,
#   nginx is pointed at it (graceful reload), and only then is the old slot
#   stopped. Server side: scripts/ops/marketing-bluegreen/{slot-lib,remote-deploy}.sh.
#   Needs, once, on the server: apply-nginx.sh and apply-cron.sh from that
#   folder (this script checks both and refuses without them). The first such
#   deploy migrates by itself: today's process counts as slot a, the new build
#   goes to slot b, and `evelyn-marketing` is stopped after the switch.
#   Runbook: scripts/ops/marketing-bluegreen/README.md
#
# ROLLBACK (blue-green only; about 15 seconds, no build, no gap): the previous
# build is still on the server in the other slot's dir.
#       ./deploy-marketing.sh --rollback
# Which slot is live:  ssh root@85.239.239.134 'cat /root/evelyn-marketing/.active-slot /root/evelyn-marketing/.active-port'
# Once a blue-green deploy has happened, the single-process path refuses to
# run (it would start a second copy beside the live slot); the README says how
# to go back to it.

# Colors for output formatting
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

###############################################################################
# !! ONE-TIME PREREQUISITE BEFORE THE FIRST EVER RUN OF THIS SCRIPT !!
#
# REMOTE_DIR moved. It used to be /root/evelynlearning; it is now
# /root/evelyn-marketing. That means the first run of this script creates a
# VIRGIN public/ containing repo files only — and production's public/ is not
# repo files only. Read the incident comment further down (the one explaining
# why `rm -rf public/` before unzip is not an acceptable prune strategy): it
# records that prod public/ holds 200+ MB of user-uploaded images and the
# Google Search Console verification HTML that exist in NO manifest and in no
# commit. src/lib/services/image-service.ts also writes generated blog hero
# images into public/images/blog/generated/ at runtime, on the server.
#
# Changing REMOTE_DIR reaches the exact outcome that comment exists to
# prevent — every runtime-generated blog image 404s and the google*.html
# verification file disappears, un-verifying the GSC property — just by a
# different route. Nothing in this script can detect it: from its point of
# view a fresh directory is simply a first deploy.
#
# So, ON THE SERVER, ONCE, BEFORE the first ./deploy-marketing.sh — and note
# the mkdir -p: the deploy is what normally creates that tree, so before the
# first run the parent does not exist and `cp -a src/. dst/` (which creates
# only the final path component) would fail:
#
#   mkdir -p /root/evelyn-marketing/apps/marketing/public
#   cp -an /root/evelynlearning/public/. /root/evelyn-marketing/apps/marketing/public/
#
# Running it BEFORE is the better order — it means production never serves a
# public/ that is missing 200+ MB of uploads, not even briefly. (After the
# first deploy also works, since -n never overwrites what the deploy just
# unpacked; it just leaves a window where the images 404.)
#
# -a preserves timestamps/permissions, -n never overwrites. It is safe
# against the manifest-diff prune below: files that were never in any
# manifest are never flagged for deletion, which is the same property that
# protects them today. Keep /root/evelynlearning until the copy is verified.
#
# DO NOT "fix" this by pointing REMOTE_DIR back at /root/evelynlearning —
# the two apps need separate remote directories or their npm ci, .next and
# public trees collide.
###############################################################################

# Configuration
SERVER_IP="85.239.239.134"
SERVER_USER="root"
REMOTE_DIR="/root/evelyn-marketing"
ZIP_FILE="evelyn-marketing.zip"

# Which workspace this script deploys. Every path below that used to be
# relative to the repo root (.next/, public/, src/, the config files) is
# now under $APP_DIR — the app moved, the layout inside it did not.
APP_DIR="apps/marketing"
APP_WORKSPACE="@evelyn/marketing"
PM2_NAME="evelyn-marketing"
# 3001 is the port the old single `evelyn-website` process held, kept
# deliberately so nginx's default upstream needed no change. THE FIRST
# CUTOVER IS ORDER-SENSITIVE FOR EXACTLY THAT REASON: `evelyn-website` must
# be deleted before this script runs, or the new process hits EADDRINUSE and
# pm2 puts it in a restart loop. Deploy the tutor to :3007 first, verify it,
# then `pm2 delete evelyn-website` immediately before running this.
PM2_PORT="3001"

# Blue-green (see the header). The default since 2026-11-25 (rehearsal passed, first live deploy clean).
MARKETING_BLUE_GREEN="${MARKETING_BLUE_GREEN:-1}"
BG_DIR="scripts/ops/marketing-bluegreen"
BG_PORT_A="3001"
BG_PORT_B="3021"
BG_UPSTREAM_FILE="/etc/nginx/conf.d/evelyn-marketing-upstream.conf"
# How long pm2 lets the outgoing process finish its requests (same value as the single-process start line).
BG_KILL_TIMEOUT_MS="${BG_KILL_TIMEOUT_MS:-10000}"
BG_HEALTH_SECS="${BG_HEALTH_SECS:-45}"
# The build dir's name inside $APP_DIR, here and on the server. Blue-green sets it to .next-a / .next-b in the preflight.
DIST_NAME=".next"
BG_TARGET=""

# Suffix for this script's /tmp scratch files on the server. deploy-tutor.sh
# and deploy-marketing.sh now run against the SAME host, and the prune logic
# below builds its keep-set in /tmp: with shared filenames, two overlapping
# deploys would diff one app's on-disk static tree against the OTHER app's
# manifest and delete every chunk of the running build.
TMP_TAG="marketing"

# Log function with timestamps
log_message() {
  local level=$1
  local message=$2
  local color=$NC

  case $level in
    "INFO") color=$GREEN ;;
    "ERROR") color=$RED ;;
    "WARNING") color=$YELLOW ;;
    "STEP") color=$BLUE ;;
  esac

  echo -e "${color}[$(date +'%Y-%m-%d %H:%M:%S')] [${level}] ${message}${NC}"
}

# Error handling function
handle_error() {
  log_message "ERROR" "An error occurred on line $1"
  # $RESTORE_ENV for the same reason restore_dev_env has it: the bare
  # "does a backup exist" test is true of a backup made by ANOTHER deploy
  # running in this same checkout, and acting on it would overwrite that
  # deploy's production .env.local mid-build. Unreachable cross-process today
  # — but no longer by distance: the root-deploy guard now runs between the
  # ERR trap install below and acquire_local_lock, which is exactly the
  # "one inserted command" the previous version of this comment warned about.
  # It is still safe, and now by construction rather than by luck:
  #   - the guard leaves via an explicit `exit 1`, and an explicit exit does
  #     not fire an ERR trap, so handle_error is not reached on refusal;
  #   - its only failure-capable command, `git rev-parse --git-dir`, is
  #     wrapped in `|| echo 'not-a-repo'`, so it cannot fail unchecked;
  #   - and even if handle_error did run, $RESTORE_ENV is still unset that
  #     early, so both branches below are no-ops.
  # Anything else inserted above acquire_local_lock must re-establish those
  # three properties. (Before the lock block initialises it, $RESTORE_ENV is
  # unset and this is a no-op, which is the right answer: no backup can exist
  # that early.)
  if [ "$RESTORE_ENV" = true ] && [ -f ".env.local.dev.bak" ]; then
    mv .env.local.dev.bak .env.local
    log_message "INFO" "Restored local dev .env.local"
  fi
  if [ -f "$ZIP_FILE" ]; then
    rm -f "$ZIP_FILE"
    log_message "INFO" "Cleaned up local zip file"
  fi
  exit 1
}

# Set up trap to catch errors
trap 'handle_error $LINENO' ERR

# ---------------------------------------------------------------------------
# Single-deploy lock, shared by deploy-tutor.sh and deploy-marketing.sh.
#
# $TMP_TAG (defined above) keeps the two scripts' SERVER-side scratch files apart. The
# LOCAL side has the same collision and renaming cannot fix all of it:
#
#   * The three .deploy-*-manifest files are written to fixed repo-root paths.
#     Run both deploys at once to save the double build and marketing
#     overwrites the tutor's .deploy-static-manifest before the tutor zips it.
#     The tutor then ships a keep-set describing MARKETING's build, and the
#     server-side prune — which runs AFTER `pm2 start` — computes every file
#     of the freshly deployed tutor as an orphan and `rm -f`s the entire
#     static tree out from under the running process.
#   * Worse, and unfixable by renaming: both scripts swap the ONE repo-root
#     .env.local out to .env.local.dev.bak and back. Interleave them and
#     whichever restores first hands the other a dev .env.local to bake
#     NEXT_PUBLIC_ vars from — a production bundle built against dev config,
#     with nothing in the output to say so.
#
# So: serialise, do not rename. One lock covering BOTH scripts for the whole
# run. It refuses immediately instead of waiting, so the operator learns what
# happened rather than watching an unexplained pause.
#
# Scope is the machine (/tmp), not the checkout, deliberately: two checkouts
# on one machine still deploy to the same production host.
#
# mkdir is the atomic primitive (macOS ships no flock).
#
# ACQUISITION IS EXACTLY ONE STEP — `mkdir "$LOCK_DIR"` — AND NOTHING ON THAT
# PATH EVER DELETES A LOCK. That is the whole correctness argument, and it is
# why there is no automatic stale-lock reclaim here. An earlier version had
# one: read the pid file, decide the owner is gone, `rm -rf`, `mkdir`. `mkdir`
# is atomic but "read the pid and decide" is not atomic *with* it, and two
# interleavings then admit TWO SIMULTANEOUS HOLDERS:
#
#   * EMPTY-PID RACE. B wins the mkdir. C's mkdir fails, and C reads the pid
#     file in the window BEFORE B has written it. C sees "", concludes the
#     lock is stale, `rm -rf`s B's LIVE lock and takes its own. Both deploy.
#     Reproduced with `./deploy-tutor.sh & ./deploy-marketing.sh &`.
#   * DOUBLE-RECLAIM RACE. After a SIGKILLed deploy, B and C both read the
#     same dead pid, both classify it stale, B reclaims, and C's `rm -rf`
#     then deletes B's *fresh* lock before C mkdirs its own. Both deploy.
#
#   And afterwards both hold LOCK_HELD=true, so on release both `rm -rf` the
#   same path — the second release removing a THIRD deploy's lock.
#
# So: no reclaim. A lock left behind by a SIGKILL (or by a deploy killed in
# the millisecond between the mkdir and the pid write) makes the next deploy
# REFUSE and print the exact `rm -rf` for a human to run after checking.
# Deploys are manual and rare; one manual command is a much better trade than
# a race whose failure mode is deploying both apps at once. LOCK_HELD is set
# immediately after the mkdir, before the pid write, so a deploy that dies in
# that window still releases its own lock through the EXIT trap.
#
# Release, and the `.env.local` restore, both run from that EXIT trap, which
# fires on the normal path AND on the `exit 1` inside handle_error, so the
# script's original ERR cleanup keeps working untouched. INT, TERM and HUP are
# wired to `exit 1` so Ctrl-C, a `kill`, and closing the terminal all reach it
# too — without the restore, an interrupted deploy would leave the developer's
# working checkout holding PRODUCTION config in .env.local.
#
# BOTH HALVES OF THAT TRAP ARE OWNERSHIP-GATED, and the second gate was
# learned the hard way. The EXIT trap is installed BEFORE the lock is taken,
# so it also fires on the refusal `exit 1` of a deploy that never became the
# holder. `release_local_lock` was always safe there (LOCK_HELD is false, so
# it removes nothing). `restore_dev_env` was NOT: its only condition was
# "does .env.local.dev.bak exist", and that file belongs to whichever deploy
# is currently mid-build in this same repo. A refused deploy would `mv` the
# RUNNING deploy's backup over its production .env.local, mid-build, and
# delete the backup — re-creating, through the restore, the exact
# wrong-.env.local hazard this lock exists to prevent. It is now gated on
# $RESTORE_ENV, which this process sets only after making its OWN backup
# (Step 1 below); a refused run has no backup of its own, so it restores
# nothing. $RESTORE_ENV rather than $LOCK_HELD deliberately: it tracks the
# backup itself rather than a proxy for it.
#
# Residual, accepted knowingly: pid reuse. If the OS has recycled a dead
# holder's pid onto an unrelated process, the refusal misreports the lock as
# live ("wait for it") instead of stale ("rm -rf it"). It still REFUSES, so it
# cannot cause a double deploy — it only sends the operator a less useful
# message, and the message names $LOCK_DIR either way. A start-time check
# would close it and is more machinery than the risk warrants.
# ---------------------------------------------------------------------------
# ── GUARD: never deploy from a repo ROOT. ────────────────────────────────
# Ported from deploy-tutor.sh (b49e77c1) after the 2026-08-21 incident, where
# a verified engine deploy was silently destroyed by running that script from
# the shared repo root: the root sat on `main`, main did not carry the round,
# so the deploy shipped the root's branch and dropped the round — while nine
# feature flags stayed ON in the server env, so every check read healthy for
# ten hours against code that could not read them.
#
# This script has the same shape and therefore the same exposure: it ships the
# WORKING TREE, and four agent sessions share this repo. The deploy lock is no
# defence — it exists only DURING a deploy, so a free lock proves nothing about
# undeployed work on another branch.
#
# Placement is load-bearing: this sits BEFORE $LOCK_DIR is defined and before
# the EXIT trap is installed, so a refusal cannot acquire, or strand, the
# global lock on its way out. deploy-tutor.sh's first revision sat in preflight
# AFTER acquisition and stranded the lock for every other session when it
# refused. Do not move this below the trap.
#
# A worktree's git-dir is `<repo>/.git/worktrees/<name>`; a root checkout's is
# plain `.git`. That is the whole test.
#
# Escape hatch, deliberately awkward: ALLOW_ROOT_DEPLOY=1. If you reach for it,
# first ask what is on the root's branch that is NOT in yours.
GIT_DIR_REL="$(git rev-parse --git-dir 2>/dev/null || echo 'not-a-repo')"
case "$GIT_DIR_REL" in
  */.git/worktrees/*) : ;;                       # linked worktree — correct
  not-a-repo)
    log_message "ERROR" "Not a git repository — refusing to deploy from an unknown tree."
    exit 1 ;;
  *)
    if [ "${ALLOW_ROOT_DEPLOY:-}" = "1" ]; then
      log_message "INFO" "ALLOW_ROOT_DEPLOY=1 — deploying from the repo ROOT by explicit override."
    else
      log_message "ERROR" "REFUSING TO DEPLOY FROM THE REPO ROOT (git-dir: $GIT_DIR_REL, branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null))."
      log_message "ERROR" "  This script ships the WORKING TREE. The root is shared by every agent session,"
      log_message "ERROR" "  so deploying from it ships whatever branch the root happens to be on and"
      log_message "ERROR" "  silently drops any work that lives on another branch (2026-08-21 incident)."
      log_message "ERROR" "  Deploy from your own worktree instead:  .claude/worktrees/<yours>"
      log_message "ERROR" "  Override only if you know what root carries that your worktree does not:"
      log_message "ERROR" "      ALLOW_ROOT_DEPLOY=1 ./deploy-marketing.sh"
      exit 1
    fi ;;
esac

LOCK_DIR="/tmp/evelyn-deploy.lock"
LOCK_HELD=false
# Initialised here, not just at Step 1, because the EXIT trap below can fire
# long before Step 1 runs (a refused lock, an early error) and must see a
# definite "this process has made no backup".
RESTORE_ENV=false

restore_dev_env() {
  # Two conditions, and both are load-bearing:
  #   $RESTORE_ENV  — THIS process made the backup. Without it, a deploy that
  #                   was refused the lock would restore, and delete, the
  #                   backup belonging to the deploy that is currently
  #                   building. See the ownership note in the comment above.
  #   -f the backup — idempotency. Already absent after a normal build
  #                   (restored inline) and after handle_error (restored
  #                   there); only a signal-interrupted run still has it.
  if [ "$RESTORE_ENV" = true ] && [ -f ".env.local.dev.bak" ]; then
    mv .env.local.dev.bak .env.local 2>/dev/null || true
    log_message "INFO" "Restored local dev .env.local"
  fi
}

release_local_lock() {
  if [ "$LOCK_HELD" = true ]; then
    LOCK_HELD=false
    # `|| true` for the same reason restore_dev_env has it: a failure inside
    # the EXIT trap would otherwise re-enter handle_error.
    rm -rf "$LOCK_DIR" || true
  fi
}

# Blue-green builds with NEXT_DIST_DIR, and `next build` may then add that dir's types path to the app's
# tsconfig.json, a tracked file. It is saved before the build and put back after (and here, if the run was cut short).
TSCONFIG_SAVED=false
restore_tsconfig() {
  if [ "$TSCONFIG_SAVED" = true ] && [ -f "$APP_DIR/tsconfig.json.deploy-bak" ]; then
    mv "$APP_DIR/tsconfig.json.deploy-bak" "$APP_DIR/tsconfig.json" 2>/dev/null || true
    TSCONFIG_SAVED=false
  fi
}
# The slot build dir (.next-a / .next-b) is not in .gitignore and is of no use locally once zipped.
remove_local_slot_build() {
  if [ "$MARKETING_BLUE_GREEN" = "1" ] && [ -n "$BG_TARGET" ] && [ "$DIST_NAME" != ".next" ]; then
    rm -rf "${APP_DIR:?}/$DIST_NAME" 2>/dev/null || true
  fi
}

on_exit() {
  restore_dev_env
  restore_tsconfig
  remove_local_slot_build
  release_local_lock
}

acquire_local_lock() {
  # The one and only way to become the holder. Atomic, and no delete anywhere
  # on this path — see the interleavings in the comment above.
  if mkdir "$LOCK_DIR" 2>/dev/null; then
    LOCK_HELD=true
    printf '%s\n' "$$" > "$LOCK_DIR/pid"
    printf '%s\n' "$0" > "$LOCK_DIR/script"
    return 0
  fi

  local owner script
  owner=$(cat "$LOCK_DIR/pid" 2>/dev/null || true)
  script=$(cat "$LOCK_DIR/script" 2>/dev/null || true)

  if [ -n "$owner" ] && kill -0 "$owner" 2>/dev/null; then
    log_message "ERROR" "Another Evelyn deploy is already running: ${script:-unknown script}, pid $owner (lock $LOCK_DIR)."
    log_message "ERROR" "Deploys share the repo-root .env.local and the .deploy-*-manifest files; running two at once corrupts both. Wait for it to finish."
    exit 1
  fi

  if [ -z "$owner" ]; then
    log_message "ERROR" "Deploy lock $LOCK_DIR exists but records no pid: either another deploy is a few milliseconds into taking it, or one died between creating the lock and recording itself."
  else
    log_message "ERROR" "Deploy lock $LOCK_DIR is held by pid $owner (${script:-unknown script}), which is no longer running — a previous deploy was killed."
  fi
  log_message "ERROR" "NOT reclaiming it automatically: judging a lock stale cannot be made atomic with taking it, and getting that wrong runs two deploys at once."
  # A killed deploy can leave the env swap half-undone as well as the lock
  # behind. If it does, clearing the lock and rerunning is DESTRUCTIVE and
  # silent: Step 1's `cp .env.local .env.local.dev.bak` would overwrite the
  # good backup with the production config still sitting in .env.local, and
  # the post-build restore would then write production config back into
  # .env.local — the developer's real local config gone, with no message.
  # So say so first. Dev machine only; this file never exists on the server.
  if [ -f ".env.local.dev.bak" ]; then
    log_message "ERROR" "ALSO: a leftover .env.local.dev.bak is sitting in this directory, so the killed deploy did not finish restoring your env."
    log_message "ERROR" "Restore it BEFORE clearing the lock, or rerunning will overwrite the backup with production config and lose your local .env.local:"
    log_message "ERROR" "    mv .env.local.dev.bak .env.local"
  fi
  log_message "ERROR" "Confirm no deploy is running, then clear it by hand:  rm -rf $LOCK_DIR"
  exit 1
}

trap on_exit EXIT
trap 'exit 1' INT TERM HUP
acquire_local_lock

# Function to run remote command via SSH
run_remote_command() {
  local command=$1
  ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$command"
}

# Keystone is served by this same process (keystone.evelynlearning.com → :3001), and a client's reviewer works in
# it for hours at a time. A restart drops her requests for a few seconds, and a page she has open from the old
# build can fail its next click (2026-11-24: two deploys that evening, two 502s on the item she had open and one
# review click that did nothing). So a deploy is refused while Keystone is in use: a request in the last
# KEYSTONE_QUIET_MIN minutes (her open page refreshes itself, so an open tab counts), or a release or animated
# build holding its lock. KEYSTONE_BUSY_OK=1 deploys anyway, for when the owner says to.
KEYSTONE_QUIET_MIN="${KEYSTONE_QUIET_MIN:-15}"
# A page open in someone's browser belongs to the build that was live when it loaded, and asks for that build's
# script files when they click on. Deleting those files at the next deploy broke such pages (a 404 for a chunk);
# they are now kept for a week. Their names carry a content hash, so old and new never collide. The other half of
# the same care is NEXT_SERVER_ACTIONS_ENCRYPTION_KEY in .env.local.production: with it a button on an old page
# still finds its action in the new build (without it every build gave every action a new id).
STATIC_KEEP_DAYS="${STATIC_KEEP_DAYS:-7}"
keystone_in_use() {
  run_remote_command "L=/var/log/nginx/keystone.access.log; \
    recent=\$(find \$L -mmin -$KEYSTONE_QUIET_MIN 2>/dev/null | wc -l | tr -d ' '); \
    last=\$(tail -1 \$L 2>/dev/null | awk '{print \$4}' | tr -d '['); \
    locks=\$(mongosh --quiet 'mongodb://127.0.0.1:2710/castle_rock_review' --eval 'print(db.locks.countDocuments({expiresAt:{\$gt:new Date()}}))' 2>/dev/null | tail -1 | tr -dc '0-9'); \
    echo \"\$recent|\${locks:-0}|\$last\""
}
refuse_if_keystone_in_use() {
  local when=$1 out recent locks last
  out=$(keystone_in_use 2>/dev/null | tail -1)
  recent=${out%%|*}; locks=$(echo "$out" | cut -d'|' -f2); last=$(echo "$out" | cut -d'|' -f3)
  if [ "$recent" = "0" ] && [ "${locks:-0}" = "0" ]; then
    log_message "INFO" "Keystone is quiet ($when): no request in the last $KEYSTONE_QUIET_MIN min (last: ${last:-none}), no job running."
    return 0
  fi
  if [ "${KEYSTONE_BUSY_OK:-}" = "1" ]; then
    log_message "INFO" "Keystone is IN USE ($when; last request ${last:-unknown} server time, ${locks:-?} job lock(s)) — deploying anyway: KEYSTONE_BUSY_OK=1."
    return 0
  fi
  log_message "ERROR" "Keystone is in use ($when): last request ${last:-unknown} (server time), ${locks:-?} job lock(s) held."
  log_message "ERROR" "      This deploy restarts the process she is working in. Wait for $KEYSTONE_QUIET_MIN quiet minutes, or, when the owner"
  log_message "ERROR" "      says to go anyway:  KEYSTONE_BUSY_OK=1 ./deploy-marketing.sh"
  exit 1
}

# ── Blue-green: what the server looks like, and how its half of the work is run ──
# One read-only ssh. Prints key=value lines:
#   slot      a | b | (empty: no blue-green deploy yet)
#   legacy    pm2 status of the single process `evelyn-marketing` (online/absent/…)
#   upstream  yes when the nginx upstream file exists
#   wired     how many proxy_pass lines go through the upstream (3 once apply-nginx.sh has run)
#   direct    how many still name 127.0.0.1:3001 (0 once it has run)
#   cron      how many Keystone cron lines read .active-port (2 once apply-cron.sh has run)
bg_remote_state() {
  run_remote_command "cd $REMOTE_DIR 2>/dev/null; \
    echo \"slot=\$(cat .active-slot 2>/dev/null | tr -d '[:space:]')\"; \
    echo \"legacy=\$(pm2 jlist 2>/dev/null | python3 -c 'import json,sys; print(next((p[\"pm2_env\"].get(\"status\",\"?\") for p in json.load(sys.stdin) if p.get(\"name\")==\"$PM2_NAME\"), \"absent\"))' 2>/dev/null)\"; \
    echo \"upstream=\$([ -f $BG_UPSTREAM_FILE ] && echo yes || echo no)\"; \
    echo \"wired=\$(cat /etc/nginx/sites-enabled/evelynlearning /etc/nginx/sites-enabled/keystone.evelynlearning.com 2>/dev/null | grep -c 'proxy_pass http://evelyn_marketing;')\"; \
    echo \"direct=\$(cat /etc/nginx/sites-enabled/evelynlearning /etc/nginx/sites-enabled/keystone.evelynlearning.com 2>/dev/null | grep -c 'proxy_pass http://127.0.0.1:$BG_PORT_A;')\"; \
    echo \"cron=\$(crontab -l 2>/dev/null | grep '/api/keystone/cron/' | grep -c 'active-port')\""
}
bg_field() { echo "$1" | grep "^$2=" | head -1 | cut -d= -f2-; }

# Runs slot-lib.sh + <main script> on the server. The whole text is read there before any of it runs
# (`eval "$(cat)"`), so a command inside it that reads stdin (unzip, npm, pm2) cannot swallow the rest of the script.
# Arguments after the script name are VAR=value words (no spaces in values) put in the remote environment.
bg_remote() {
  local main=$1; shift
  cat "$BG_DIR/slot-lib.sh" "$BG_DIR/$main" | ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$* bash -c 'eval \"\$(cat)\"'"
}

# Robust file upload, over a plain `ssh 'cat > dest'` pipe rather than scp.
#
# History: this used `scp -O` to force the legacy SCP protocol, because modern
# OpenSSH (9.x, incl. macOS) defaults scp to the SFTP subsystem and the
# server's sftp-server was mis/disabled — scp would connect then hang at
# 0% / 0.0KB/s forever, while `ssh host "cmd"` exec still worked (2026-05-18).
#
# `-O` fixed the hang but was pathologically SLOW: measured 39 KB/s on
# 2026-08-14, against 3.4 MB/s for a plain ssh pipe to the same host at the
# same moment (88x), on a 194 Mbps uplink with server load at 0.58. A 941 MB
# upload was quoted at 5.2 hours.
#
# An ssh pipe sidesteps BOTH scp transports, so the sftp problem that -O
# worked around is irrelevant here — this is the same `ssh host "cmd"` exec
# path that kept working throughout. ConnectTimeout/ServerAlive still turn a
# genuine stall into an error instead of an unkillable hang, and the 3-attempt
# retry still rides out transient drops.
#
# The `if ssh; then` form keeps an intermediate failure from tripping the
# ERR trap (this script uses `trap ERR`, not `set -e`); the caller handles
# the final non-zero return via `|| { ... }`.
upload_with_retry() {
  local src=$1
  local remote_path=$2
  local attempt=1
  local max=3
  while [ "$attempt" -le "$max" ]; do
    # `cat > tmp && mv` so a partial transfer never lands at the real path.
    if ssh -o StrictHostKeyChecking=no \
           -o ConnectTimeout=15 \
           -o ServerAliveInterval=10 \
           -o ServerAliveCountMax=3 \
           "$SERVER_USER@$SERVER_IP" \
           "cat > '${remote_path}.part' && mv '${remote_path}.part' '${remote_path}'" \
           < "$src"; then
      return 0
    fi
    log_message "WARNING" "Upload attempt ${attempt}/${max} failed (${src}); retrying in $((attempt * 5))s..."
    sleep $((attempt * 5))
    attempt=$((attempt + 1))
  done
  return 1
}

# Rollback: no build. Not held back by the Keystone check: a rollback is run because something is wrong for
# whoever is on the site, and it closes no port.
if [ "${1:-}" = "--rollback" ]; then
  if [ "$MARKETING_BLUE_GREEN" != "1" ]; then
    log_message "ERROR" "--rollback exists only for the blue-green layout:  ./deploy-marketing.sh --rollback"
    exit 1
  fi
  for f in slot-lib.sh remote-rollback.sh; do
    if [ ! -s "$BG_DIR/$f" ]; then log_message "ERROR" "$BG_DIR/$f is missing."; exit 1; fi
  done
  log_message "STEP" "Rolling the marketing app back to the previous build (other slot)..."
  bg_remote remote-rollback.sh \
    "BG_ROOT=$REMOTE_DIR" "BG_APP=$APP_DIR" "BG_NAME=$PM2_NAME" "BG_PORT_A=$BG_PORT_A" "BG_PORT_B=$BG_PORT_B" \
    "BG_UPSTREAM_FILE=$BG_UPSTREAM_FILE" "BG_KILL_TIMEOUT_MS=$BG_KILL_TIMEOUT_MS" "BG_HEALTH_SECS=$BG_HEALTH_SECS" || {
    log_message "ERROR" "Rollback failed on the server (see above). Whatever was live before is still live unless the output says the switch happened."
    exit 1
  }
  log_message "INFO" "Rollback done."
  exit 0
fi

# Starting deployment
log_message "INFO" "Starting Evelyn Learning MARKETING deployment to production..."

# Step 0: Preflight. A hard abort, checked BEFORE the ~4 minute build so a
# doomed deploy fails in a second instead of at the end.
log_message "STEP" "Preflight checks..."

# 0a. Production env must exist.
#
# This used to be a silent skip: `if [ -f ".env.local.production" ]` simply
# fell through, the build ran against the developer's DEV .env.local, and
# every NEXT_PUBLIC_ value was baked from dev config into a production bundle
# with nothing in the output saying so. The remote .env.local gate later in
# this script does NOT catch it — that only fires on a virgin remote tree, so
# it protects the FIRST deploy and no other. Wrong client config on a live
# site is not something to discover from a user report, so: abort.
if [ ! -s ".env.local.production" ]; then
  log_message "ERROR" ".env.local.production is missing or empty in $(pwd)."
  log_message "ERROR" "Without it this build would bake NEXT_PUBLIC_* from your DEV .env.local into a PRODUCTION bundle, silently."
  log_message "ERROR" "Deploy from a checkout that has it (note: the m1a worktree does not), or restore it, then rerun."
  exit 1
fi

# The per-app .env.local symlink must exist and resolve — same check, same
# rationale as deploy-tutor.sh's Step 0c (live incident 2026-08-18: a
# symlink-less checkout builds fine but bakes ZERO NEXT_PUBLIC_* vars into
# the client bundle, silently disabling whole client subsystems).
if [ ! -e "$APP_DIR/.env.local" ]; then
  log_message "ERROR" "$APP_DIR/.env.local is missing (or a dangling symlink)."
  log_message "ERROR" "The build loads env from the APP directory, so without it NO env vars — including every NEXT_PUBLIC_* flag — reach the client bundle, silently."
  log_message "ERROR" "Create the standard symlink once for this checkout, then rerun:"
  log_message "ERROR" "    ln -s ../../.env.local $APP_DIR/.env.local"
  exit 1
fi
log_message "INFO" "Preflight OK (.env.local.production present; $APP_DIR/.env.local resolves)"

# 0c. Which layout is the server in, and does it match the way this run was asked to deploy?
BG_STATE="$(bg_remote_state 2>/dev/null || true)"
BG_SLOT="$(bg_field "$BG_STATE" slot)"
if [ -z "$(bg_field "$BG_STATE" upstream)" ]; then
  log_message "ERROR" "Could not read the server's state over ssh (needed to know which process is live). Nothing built."
  exit 1
fi
if [ "$MARKETING_BLUE_GREEN" = "1" ]; then
  for f in slot-lib.sh remote-deploy.sh; do
    if [ ! -s "$BG_DIR/$f" ]; then log_message "ERROR" "$BG_DIR/$f is missing."; exit 1; fi
  done
  if [ "$(bg_field "$BG_STATE" upstream)" != "yes" ] || [ "$(bg_field "$BG_STATE" wired)" != "3" ] || [ "$(bg_field "$BG_STATE" direct)" != "0" ]; then
    log_message "ERROR" "nginx is not set up for blue-green (upstream file: $(bg_field "$BG_STATE" upstream); proxy_pass lines through it: $(bg_field "$BG_STATE" wired) of 3; still naming :$BG_PORT_A: $(bg_field "$BG_STATE" direct))."
    log_message "ERROR" "      Run once:  $BG_DIR/apply-nginx.sh --yes     (then rerun this)"
    exit 1
  fi
  if [ "$(bg_field "$BG_STATE" cron)" != "2" ]; then
    log_message "ERROR" "The two Keystone cron lines do not read the live port yet ($(bg_field "$BG_STATE" cron) of 2): after a switch to slot b they would call a closed port."
    log_message "ERROR" "      Run once:  $BG_DIR/apply-cron.sh --yes      (then rerun this)"
    exit 1
  fi
  case "$BG_SLOT" in
    a) BG_TARGET=b ;;
    b) BG_TARGET=a ;;
    "")
      # First blue-green deploy: the single process is slot a in all but name (same port), so the build goes to b.
      if [ "$(bg_field "$BG_STATE" legacy)" != "online" ]; then
        log_message "ERROR" "No blue-green deploy yet and pm2 process $PM2_NAME is '$(bg_field "$BG_STATE" legacy)', not online: nothing known to be live. See $BG_DIR/README.md, 'First deploy'."
        exit 1
      fi
      BG_TARGET=b
      log_message "INFO" "First blue-green deploy: $PM2_NAME (:$BG_PORT_A, .next) is live; the new build goes to slot b (:$BG_PORT_B)."
      ;;
    *) log_message "ERROR" "The server's .active-slot holds '$BG_SLOT' (expected a or b)."; exit 1 ;;
  esac
  DIST_NAME=".next-$BG_TARGET"
  log_message "INFO" "Blue-green: live slot '${BG_SLOT:-single process}', building for slot $BG_TARGET ($DIST_NAME)."
else
  if [ -n "$BG_SLOT" ]; then
    log_message "ERROR" "The server runs the blue-green layout (live slot: $BG_SLOT). The single-process deploy would start a second"
    log_message "ERROR" "      copy beside it and leave the site on the old build. Deploy with:  ./deploy-marketing.sh"
    log_message "ERROR" "      (Going back to the single process is a by-hand procedure: $BG_DIR/README.md.)"
    exit 1
  fi
fi

# Step 1: Build locally using production env (for NEXT_PUBLIC_ vars)
log_message "STEP" "Building Next.js application locally..."

# Temporarily swap in production env so NEXT_PUBLIC_ vars are baked in correctly.
# This still operates on the REPO-ROOT .env.local even though the build now runs
# with its cwd inside $APP_DIR: apps/*/.env.local are symlinks to ../../.env.local,
# so swapping the root file is what the app actually reads at build time.
RESTORE_ENV=false
if [ -f ".env.local.production" ]; then
  cp .env.local .env.local.dev.bak
  # ARM THE RESTORE THE INSTANT THE BACKUP EXISTS, and before anything is
  # overwritten. The INT/TERM/HUP trap is already live by now, and if a signal
  # lands between the two `cp`s with this line still below them, on_exit's
  # restore is disarmed and the developer's checkout is left holding
  # PRODUCTION .env.local plus an orphaned .dev.bak. Ordering is the whole fix
  # — setting it here makes the window empty rather than sub-millisecond.
  RESTORE_ENV=true
  cp .env.local.production .env.local
  log_message "INFO" "Temporarily using .env.local.production for build"
fi

# Clean up previous builds. `.next/` alone is not enough: a stale
# tsconfig.tsbuildinfo (TS incremental cache) survives the .next wipe and
# can carry a dangling `.next/types/cache-life.d.ts` root-file reference,
# failing `next build`'s type-check with "File not found" even though the
# code is clean (2026-05-18 build failure — Next 16 only emits
# cache-life.d.ts when cacheComponents is on, which it isn't here).
log_message "INFO" "Cleaning up previous build artifacts..."
# Fail fast, before the minutes of build: nothing is deployed over someone working in Keystone.
refuse_if_keystone_in_use "before the build"
rm -rf "${APP_DIR:?}/$DIST_NAME/" 2>/dev/null || true
rm -f "$APP_DIR/tsconfig.tsbuildinfo" 2>/dev/null || true

# Blue-green: the build is made FOR the idle slot's dir (next.config.ts reads NEXT_DIST_DIR), so the server can
# unpack it beside the live build without touching it. Single-process: NEXT_DIST_DIR stays unset, exactly as before.
if [ "$MARKETING_BLUE_GREEN" = "1" ]; then
  cp "$APP_DIR/tsconfig.json" "$APP_DIR/tsconfig.json.deploy-bak"
  TSCONFIG_SAVED=true
  export NEXT_DIST_DIR="$DIST_NAME"
fi

npm run --workspace "$APP_WORKSPACE" build || {
  # Restore dev env before exiting on error
  if [ "$RESTORE_ENV" = true ]; then
    mv .env.local.dev.bak .env.local
  fi
  restore_tsconfig
  log_message "ERROR" "Failed to build application locally"
  exit 1
}
unset NEXT_DIST_DIR
restore_tsconfig
if [ ! -f "$APP_DIR/$DIST_NAME/BUILD_ID" ]; then
  log_message "ERROR" "The build did not produce $APP_DIR/$DIST_NAME/BUILD_ID (does next.config.ts still read NEXT_DIST_DIR?)."
  exit 1
fi

# Restore dev env immediately after build
if [ "$RESTORE_ENV" = true ]; then
  mv .env.local.dev.bak .env.local
  log_message "INFO" "Restored local dev .env.local"
fi
log_message "INFO" "Application built successfully"

# Step 1.5: Generate public/ manifest for safe pruning on the server.
# The server uses this to detect files that have been deleted from the
# repo since the last deploy and remove them from production. See the
# detailed comment near the unzip step below for the full mechanism.
# Paths in the manifest stay relative to the REPO ROOT (i.e. they start with
# apps/marketing/), because the server consumes them with its cwd at $REMOTE_DIR,
# which mirrors the repo root. Do not cd into $APP_DIR to shorten them.
log_message "STEP" "Generating public/ manifest..."
# public/images/blog is NOT tracked in git since 2026-10-28 (185 MB of blog
# media; it lives on the server and in each developer's checkout). It is
# excluded from the manifest so a checkout without it can never prune the
# server's copy, and the server-side prune refuses that path too.
# public/client-samples (2026-11-21) is the same kind of thing: media-heavy sample pages for one client, present
# only in the checkout that made them. Left out of the manifest so a deploy from another checkout never prunes them.
find "$APP_DIR/public" -type f -not -path "$APP_DIR/public/images/blog/*" -not -path "$APP_DIR/public/client-samples/*" | LC_ALL=C sort > .deploy-public-manifest
log_message "INFO" "Manifest contains $(wc -l < .deploy-public-manifest) entries"

# Step 1.6: Generate a .next/static/ manifest for orphan-chunk pruning.
# `unzip -o` overwrites but never DELETES files absent from the archive,
# so every deploy that renames content-hashed chunks leaves the old ones
# behind. They accumulated to 1880 stale chunks / 173 MB before the first
# manual cleanup (2026-07-10). `.next/static/` is 100% build-generated,
# immutable, content-hashed output — nothing writes there at runtime — so
# the freshly-built manifest is the authoritative keep-set: any static file
# on the server NOT in it belongs to a prior build and is safe to delete.
# Self-healing: the FIRST deploy after this change wipes all accumulated
# orphans, and every deploy after keeps the tree clean.
log_message "STEP" "Generating .next/static manifest (orphan-chunk prune)..."
find "$APP_DIR/$DIST_NAME/static" -type f | LC_ALL=C sort > .deploy-static-manifest
log_message "INFO" "Static manifest contains $(wc -l < .deploy-static-manifest) entries"

# Step 1.7: Same treatment for .next/server/chunks — the server-side twin of
# the problem above. `unzip -o` never deletes, so server chunks from every
# prior build accumulated to 4,570 files / 580 MB (measured 2026-08-14),
# including .js.map sourcemaps still carrying the retired admin123 hash from
# the Aug 11/12 builds. Not reachable over HTTP, but retired credentials
# lingering on disk make any future audit confusing.
#
# SCOPE IS DELIBERATELY .next/server/chunks, NOT .next/server:
#   .next/server/app is written AT RUNTIME — the app-router ISR/segment cache
#   lands there as .rsc/.html/.meta/.segment.rsc files (3,040 of them were
#   newer than BUILD_ID on 2026-08-14). A build manifest is NOT an
#   authoritative keep-set for that directory, and pruning against it would
#   delete live cache output. `.next/server/chunks` by contrast had ZERO
#   files newer than BUILD_ID: it is pure, content-hashed build output.
#   For the same reason `rm -rf .next` on the server is NOT an option — it
#   would also take out .next/cache (756 MB) and the running process's files.
log_message "STEP" "Generating .next/server/chunks manifest (orphan-chunk prune)..."
find "$APP_DIR/$DIST_NAME/server/chunks" -type f | LC_ALL=C sort > .deploy-server-chunks-manifest
log_message "INFO" "Server-chunk manifest contains $(wc -l < .deploy-server-chunks-manifest) entries"

# Step 2: Create deployment package
log_message "STEP" "Creating deployment package..."

if [ -f "$ZIP_FILE" ]; then
  rm -f "$ZIP_FILE"
  log_message "INFO" "Removed existing zip file"
fi

# Zip everything except node_modules, .git, and local env files.
#
# $APP_DIR/.next/cache is excluded: it is the LOCAL build cache (webpack/SWC + the
# image-optimizer cache) and the server never reads it — the server runs
# `npm ci` and `next start`, it does not rebuild. It was 715 MB of the
# 941 MB archive on 2026-08-14, i.e. three quarters of every upload was
# bytes production had no use for. Note the server-side `rm -rf
# .next/cache/fetch-cache` in deploy-crimsora.sh is a different concern
# (a runtime cache on that host), not this build cache.
# .npmrc is required so `npm ci` on the server picks up legacy-peer-deps=true
# (next-auth declares an optional peer on nodemailer ^7 that conflicts with
# our direct nodemailer ^9 — we don't use the email provider, so accepting
# the optional-peer mismatch is safe).
# Two groups of paths now, and the split is load-bearing:
#   $APP_DIR/*  — this app's build output, public assets, source and config.
#                 Same file list as before the split, just one level down.
#                 src/ still ships because src/instrumentation.ts is what
#                 registers this app's crons (blog scheduler, outreach
#                 watcher, lead research) at process start.
#                 .env ships too (public NEXT_PUBLIC_ config, safe to commit);
#                 .env.local does NOT — see the upload + verify steps below.
#   repo root   — package.json/package-lock.json/.npmrc for `npm ci`, which
#                 must run at the WORKSPACE ROOT because deps are hoisted
#                 there, plus tsconfig.base.json that the app's tsconfig
#                 extends, plus packages/core, which both apps import as
#                 source (@evelyn/core is main:src/index.ts, transpiled by
#                 Next rather than prebuilt).
# The other app's workspace is deliberately absent: `npm ci` tolerates a
# missing sibling workspace (verified locally — it simply creates one fewer
# node_modules link), which is what keeps the two deploys independent.
# 2026-10-28: public/ is NOT in the zip any more. Zipping its ~210 MB of media
# took 8.5 of the 11.7 minutes a marketing deploy spent; it is rsynced
# incrementally below instead (only changed files cross the wire).
zip -qr "$ZIP_FILE" \
  "$APP_DIR/$DIST_NAME" \
  "$APP_DIR/src" \
  "$APP_DIR/.env" \
  "$APP_DIR/package.json" \
  "$APP_DIR/next.config.ts" \
  "$APP_DIR/tsconfig.json" \
  "$APP_DIR/tailwind.config.ts" \
  "$APP_DIR/postcss.config.mjs" \
  packages/core/src \
  packages/core/package.json \
  packages/core/tsconfig.json \
  package.json \
  package-lock.json \
  .npmrc \
  tsconfig.base.json \
  .deploy-public-manifest \
  .deploy-static-manifest \
  .deploy-server-chunks-manifest \
  -x "*.log" "*/.DS_Store" "$APP_DIR/$DIST_NAME/cache/*" || {
  log_message "ERROR" "Failed to create zip file"
  exit 1
}
log_message "INFO" "Successfully created $ZIP_FILE"

# Step 3: Ensure remote directory exists and upload
log_message "STEP" "Setting up remote server..."
# $APP_DIR too, not just $REMOTE_DIR: the .env.local upload below targets
# $REMOTE_DIR/$APP_DIR/.env.local and happens BEFORE the zip is unpacked, so
# the app directory has to exist first.
run_remote_command "mkdir -p $REMOTE_DIR/$APP_DIR" || {
  log_message "ERROR" "Failed to create remote directory"
  exit 1
}

log_message "STEP" "Uploading to production server..."
upload_with_retry "$ZIP_FILE" "$REMOTE_DIR/$ZIP_FILE" || {
  log_message "ERROR" "Failed to upload zip file to server after 3 attempts"
  exit 1
}
log_message "INFO" "Successfully uploaded zip file to server"

# Step 3.5: Upload production environment file
#
# Destination is $APP_DIR/.env.local, NOT the remote root: the pm2 process
# starts with its cwd inside $APP_DIR (see the start line below), and that is
# where Next looks for .env.local. The file is gitignored, so it is never in
# the zip — this upload is the only thing that puts it on the server.
#
# The post-unzip check below backstops it, but know its limit rather than
# trusting it: it tests `[ ! -s $APP_DIR/.env.local ]`, so it only fires
# against a VIRGIN remote tree. On the first deploy it is a real gate. On
# every later one the previous deploy's .env.local is already sitting there,
# non-empty, so a failed upload passes the check and the process restarts on
# STALE secrets. What actually protects the content of that file is the
# Step 0 preflight, which refuses to build at all without
# .env.local.production locally.
log_message "STEP" "Uploading production environment file..."
if [ -f ".env.local.production" ]; then
  upload_with_retry ".env.local.production" "$REMOTE_DIR/$APP_DIR/.env.local" || {
    log_message "WARNING" "Failed to upload .env.local.production after 3 attempts"
  }
  log_message "INFO" "Successfully uploaded .env.local.production as $APP_DIR/.env.local"
else
  log_message "WARNING" ".env.local.production not found, skipping env file upload"
fi

# Step 3.6: public/ goes over by rsync, incrementally (2026-10-28). No
# --delete: the server's public/ also holds user uploads, generated blog
# images and the GSC verification file that exist in no checkout. Files
# removed from the repo are still pruned by the manifest diff below.
log_message "STEP" "Syncing public/ (incremental rsync)..."
rsync -az --no-perms --no-owner --no-group \
  -e "ssh -o StrictHostKeyChecking=no" \
  "$APP_DIR/public/" "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/$APP_DIR/public/" || {
  log_message "ERROR" "Failed to rsync public/ to the server"
  exit 1
}
log_message "INFO" "public/ in sync"

# 2026-10-28: see deploy-tutor.sh — install only when the lockfile changed.
LOCK_HASH="$(shasum -a 256 package-lock.json | cut -c1-32)"
[ "${DEPLOY_FORCE_NPM_CI:-}" = "1" ] && LOCK_HASH="force-$(date +%s)"

# Step 4: Deploy on remote server
#
# Why the manifest-diff dance:
#
# `unzip -o` overwrites existing files but does NOT delete files that are
# absent from the archive. This means any file removed from the repo (e.g.
# public/robots.txt after it was replaced by app/robots.ts) silently survives
# on production and shadows the Next.js route.
#
# Naive fixes don't work for this codebase:
#   - `rm -rf public/` before unzip would wipe 200+ MB of user-uploaded
#     images and the GSC verification HTML that aren't in the repo.
#   - `rsync --delete` has the same problem.
#   - A hardcoded prune list rots — easy to forget when deleting a file.
#
# Manifest-diff approach:
#   1. Local build emits .deploy-public-manifest listing every file
#      currently in local public/ (sorted)
#   2. Manifest is included in the zip
#   3. On the server, before extracting, save the existing manifest (left
#      from the previous deploy) to /tmp
#   4. Extract the new zip (overwrites the manifest with the new state)
#   5. Diff: lines in the previous manifest but NOT in the current manifest
#      are files that the dev intentionally removed since the last deploy
#   6. Delete those files from production
#
# Files that were never in the dev's repo (user uploads, google verification
# HTML) are never in any manifest, so they are never flagged for deletion.
# First-ever deploy: previous manifest doesn't exist, diff is empty, no-op.
#
# Ordering note: the .next/server/chunks prune runs AFTER `pm2 start`, unlike
# the public/ and .next/static prunes which run before. The orphan set is by
# definition the chunks the OUTGOING process was running on; deleting them
# while it is still serving could break a lazy require in flight. Once the new
# process is up, every chunk it can possibly need is in the keep-set, so the
# delete is provably safe.
#
# Two things the split adds to this chain:
#
#   1. A .env.local gate right after the unzip. .env.local is gitignored and
#      therefore never in the archive — it gets there only via the upload step
#      above. If that upload silently failed on a FIRST deploy, `next start`
#      would come up with no secrets at all rather than not come up, so this
#      refuses to restart instead. Scope note, because the shape invites
#      over-trust: `-s` is false only when the file is absent or empty, so on
#      any deploy after the first the previous .env.local satisfies it and a
#      failed upload leaves the process on STALE secrets. It is a
#      first-deploy gate, not a freshness check.
#   2. The pm2 process starts with its cwd INSIDE $APP_DIR (note the
#      subshell), so the app sees exactly the pre-split layout: runtime code
#      resolves paths from process.cwd() — image-service.ts writes generated
#      blog images to public/images/blog/generated — and that must keep
#      resolving against the app dir, not the workspace root (where it would
#      write into a public/ nothing serves). `next start` has NO --dir flag
#      (Next 16.1.6:
#      the app directory is a positional argument), and the positional form
#      would leave cwd at the repo root, which is exactly the breakage.
#      The `../../node_modules/.bin/next` path is relative for the same
#      reason deps are hoisted: there is no node_modules/.bin inside the app.
# Checked again here: the build and the upload take minutes, and she may have come back in them.
refuse_if_keystone_in_use "before the restart"
log_message "STEP" "Running deployment on production server..."
if [ "$MARKETING_BLUE_GREEN" = "1" ]; then
# Blue-green: the server half lives in $BG_DIR (slot-lib.sh + remote-deploy.sh) so the rehearsal can run the very
# same functions. It does what the chain below does, per slot: the public/ manifest prune (public/ is shared), the
# .env.local gate, npm ci when the lockfile changed, the static age prune (inside the idle slot's dir, after the
# live build's static files are copied forward), and a server-chunk check (the idle dir is emptied first, so
# orphans cannot build up). Then start, health check, nginx switch, stop the old slot, pm2 save.
bg_remote remote-deploy.sh \
  "BG_ROOT=$REMOTE_DIR" "BG_APP=$APP_DIR" "BG_NAME=$PM2_NAME" "BG_PORT_A=$BG_PORT_A" "BG_PORT_B=$BG_PORT_B" \
  "BG_UPSTREAM_FILE=$BG_UPSTREAM_FILE" "BG_KILL_TIMEOUT_MS=$BG_KILL_TIMEOUT_MS" "BG_HEALTH_SECS=$BG_HEALTH_SECS" \
  "BG_TARGET=$BG_TARGET" "BG_ZIP=$ZIP_FILE" "BG_LOCK_HASH=$LOCK_HASH" "BG_TMP_TAG=$TMP_TAG" "BG_STATIC_KEEP_DAYS=$STATIC_KEEP_DAYS" || {
  log_message "ERROR" "Blue-green deploy failed on the server (see above). Unless the output says nginx was switched, the previous build is still live and untouched."
  exit 1
}
else
run_remote_command "cd $REMOTE_DIR && \
  if [ -f .deploy-public-manifest ]; then cp .deploy-public-manifest /tmp/.deploy-public-manifest.$TMP_TAG.prev; else : > /tmp/.deploy-public-manifest.$TMP_TAG.prev; fi && \
  unzip -qo $ZIP_FILE && \
  rm -f $ZIP_FILE && \
  if [ ! -s $APP_DIR/.env.local ]; then echo \"FATAL: $REMOTE_DIR/$APP_DIR/.env.local is missing or empty. Refusing to restart $PM2_NAME — it would start with none of its secrets.\"; exit 1; fi && \
  STALE_FILES=\$(comm -23 /tmp/.deploy-public-manifest.$TMP_TAG.prev .deploy-public-manifest | grep -v -e '^$APP_DIR/public/images/blog/' -e '^$APP_DIR/public/client-samples/' || true) && \
  if [ -n \"\$STALE_FILES\" ]; then echo \"Pruning stale public/ files:\"; echo \"\$STALE_FILES\"; echo \"\$STALE_FILES\" | xargs -r rm -f; else echo \"No stale public/ files to prune.\"; fi && \
  rm -f /tmp/.deploy-public-manifest.$TMP_TAG.prev && \
  if [ -s .deploy-static-manifest ]; then find $APP_DIR/.next/static -type f | LC_ALL=C sort > /tmp/.static-have.$TMP_TAG && LC_ALL=C sort .deploy-static-manifest > /tmp/.static-keep.$TMP_TAG && comm -23 /tmp/.static-have.$TMP_TAG /tmp/.static-keep.$TMP_TAG > /tmp/.static-orphans.$TMP_TAG && if [ -s /tmp/.static-orphans.$TMP_TAG ]; then echo \"\$(wc -l < /tmp/.static-orphans.$TMP_TAG) .next/static file(s) are from prior builds: kept for pages still open on them, removed once older than $STATIC_KEEP_DAYS days\"; while IFS= read -r f; do find \"\$f\" -type f -mtime +$STATIC_KEEP_DAYS -delete 2>/dev/null; done < /tmp/.static-orphans.$TMP_TAG; else echo \"No orphaned .next/static files to prune.\"; fi && rm -f /tmp/.static-have.$TMP_TAG /tmp/.static-keep.$TMP_TAG /tmp/.static-orphans.$TMP_TAG; else echo \"WARN: .deploy-static-manifest missing/empty — skipping static prune (safety)\"; fi && \
  if [ -d node_modules ] && [ \"\$(cat .deploy-lock-hash 2>/dev/null)\" = \"$LOCK_HASH\" ]; then echo \"npm ci skipped — package-lock.json unchanged since the last install ($LOCK_HASH)\"; else echo \"npm ci — lockfile changed or first install\" && npm ci --omit=dev && echo \"$LOCK_HASH\" > .deploy-lock-hash; fi && \
  (pm2 delete $PM2_NAME 2>/dev/null || true) && \
  (cd $REMOTE_DIR/$APP_DIR && pm2 start ../../node_modules/.bin/next --name $PM2_NAME --kill-timeout 10000 -- start -p $PM2_PORT) && \
  pm2 save && \
  if [ -s .deploy-server-chunks-manifest ]; then find $APP_DIR/.next/server/chunks -type f | LC_ALL=C sort > /tmp/.srv-have.$TMP_TAG && LC_ALL=C sort .deploy-server-chunks-manifest > /tmp/.srv-keep.$TMP_TAG && comm -23 /tmp/.srv-have.$TMP_TAG /tmp/.srv-keep.$TMP_TAG > /tmp/.srv-orphans.$TMP_TAG && if [ -s /tmp/.srv-orphans.$TMP_TAG ]; then echo \"Pruning \$(wc -l < /tmp/.srv-orphans.$TMP_TAG) orphaned .next/server/chunks file(s) from prior builds\"; xargs -r rm -f < /tmp/.srv-orphans.$TMP_TAG; else echo \"No orphaned .next/server/chunks files to prune.\"; fi && rm -f /tmp/.srv-have.$TMP_TAG /tmp/.srv-keep.$TMP_TAG /tmp/.srv-orphans.$TMP_TAG; else echo \"WARN: .deploy-server-chunks-manifest missing/empty — skipping server-chunk prune (safety)\"; fi" || {
  log_message "ERROR" "Deployment failed on remote server"
  exit 1
}
fi
log_message "INFO" "Deployment completed successfully on server"

# Step 5: Clean up local zip file
log_message "STEP" "Cleaning up local files..."
rm -f "$ZIP_FILE" || {
  log_message "WARNING" "Failed to remove local zip file"
}
log_message "INFO" "Local zip file cleaned up"

# Deployment complete
log_message "INFO" "=========================================="
log_message "INFO" "Marketing deployment to production completed!"
log_message "INFO" "=========================================="
log_message "INFO" "Site: http://$SERVER_IP"
if [ "$MARKETING_BLUE_GREEN" = "1" ]; then
  log_message "INFO" "Process: $PM2_NAME-$BG_TARGET (slot $BG_TARGET; nginx upstream evelyn_marketing points at it)"
  log_message "INFO" "Check logs: ssh root@$SERVER_IP 'pm2 logs $PM2_NAME-$BG_TARGET'"
  log_message "INFO" "Roll back:  ./deploy-marketing.sh --rollback"
else
  log_message "INFO" "Process: $PM2_NAME on port $PM2_PORT (nginx: location / and /_next/static/ of evelynlearning, location / of keystone.evelynlearning.com)"
  log_message "INFO" "Check logs: ssh root@$SERVER_IP 'pm2 logs $PM2_NAME'"
fi
