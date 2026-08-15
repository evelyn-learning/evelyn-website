#!/bin/bash

# Evelyn Learning - Deploy the MARKETING app to Production
# Server: root@84.247.185.169
# Remote path: /root/evelyn-marketing
#
# One of the two halves of the M1a workspace split (the other is
# deploy-tutor.sh); together they replace the single
# deploy-to-production.sh, which deployed one app from the repo root.
# Each script owns its own remote directory, its own pm2 process and its
# own port, so the two apps deploy and restart completely independently.
#
#   this script  -> apps/marketing  -> /root/evelyn-marketing  -> pm2 evelyn-marketing  -> :3001
#   deploy-tutor -> apps/tutor      -> /root/evelyn-tutor      -> pm2 evelyn-tutor      -> :3007
#
# Marketing keeps :3001 (the port the old single `evelyn-website` process
# used) so nginx's default upstream needed no change.

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
SERVER_IP="84.247.185.169"
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
  # — nothing executable runs between the ERR trap install below and
  # acquire_local_lock — but that is correct by distance, not by
  # construction, and one inserted command would reopen it. (Before the lock
  # block initialises it, $RESTORE_ENV is unset and this is a no-op, which is
  # the right answer: no backup can exist that early.)
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

on_exit() {
  restore_dev_env
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

log_message "INFO" "Preflight OK (.env.local.production present)"

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
rm -rf "$APP_DIR/.next/" 2>/dev/null || true
rm -f "$APP_DIR/tsconfig.tsbuildinfo" 2>/dev/null || true

npm run --workspace "$APP_WORKSPACE" build || {
  # Restore dev env before exiting on error
  if [ "$RESTORE_ENV" = true ]; then
    mv .env.local.dev.bak .env.local
  fi
  log_message "ERROR" "Failed to build application locally"
  exit 1
}

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
find "$APP_DIR/public" -type f | LC_ALL=C sort > .deploy-public-manifest
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
find "$APP_DIR/.next/static" -type f | LC_ALL=C sort > .deploy-static-manifest
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
find "$APP_DIR/.next/server/chunks" -type f | LC_ALL=C sort > .deploy-server-chunks-manifest
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
zip -qr "$ZIP_FILE" \
  "$APP_DIR/.next" \
  "$APP_DIR/public" \
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
  -x "*.log" "*/.DS_Store" "$APP_DIR/.next/cache/*" || {
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
log_message "STEP" "Running deployment on production server..."
run_remote_command "cd $REMOTE_DIR && \
  if [ -f .deploy-public-manifest ]; then cp .deploy-public-manifest /tmp/.deploy-public-manifest.$TMP_TAG.prev; else : > /tmp/.deploy-public-manifest.$TMP_TAG.prev; fi && \
  unzip -qo $ZIP_FILE && \
  rm -f $ZIP_FILE && \
  if [ ! -s $APP_DIR/.env.local ]; then echo \"FATAL: $REMOTE_DIR/$APP_DIR/.env.local is missing or empty. Refusing to restart $PM2_NAME — it would start with none of its secrets.\"; exit 1; fi && \
  STALE_FILES=\$(comm -23 /tmp/.deploy-public-manifest.$TMP_TAG.prev .deploy-public-manifest) && \
  if [ -n \"\$STALE_FILES\" ]; then echo \"Pruning stale public/ files:\"; echo \"\$STALE_FILES\"; echo \"\$STALE_FILES\" | xargs -r rm -f; else echo \"No stale public/ files to prune.\"; fi && \
  rm -f /tmp/.deploy-public-manifest.$TMP_TAG.prev && \
  if [ -s .deploy-static-manifest ]; then find $APP_DIR/.next/static -type f | LC_ALL=C sort > /tmp/.static-have.$TMP_TAG && LC_ALL=C sort .deploy-static-manifest > /tmp/.static-keep.$TMP_TAG && comm -23 /tmp/.static-have.$TMP_TAG /tmp/.static-keep.$TMP_TAG > /tmp/.static-orphans.$TMP_TAG && if [ -s /tmp/.static-orphans.$TMP_TAG ]; then echo \"Pruning \$(wc -l < /tmp/.static-orphans.$TMP_TAG) orphaned .next/static file(s) from prior builds\"; xargs -r rm -f < /tmp/.static-orphans.$TMP_TAG; else echo \"No orphaned .next/static files to prune.\"; fi && rm -f /tmp/.static-have.$TMP_TAG /tmp/.static-keep.$TMP_TAG /tmp/.static-orphans.$TMP_TAG; else echo \"WARN: .deploy-static-manifest missing/empty — skipping static prune (safety)\"; fi && \
  npm ci --omit=dev && \
  (pm2 delete $PM2_NAME 2>/dev/null || true) && \
  (cd $REMOTE_DIR/$APP_DIR && pm2 start ../../node_modules/.bin/next --name $PM2_NAME -- start -p $PM2_PORT) && \
  pm2 save && \
  if [ -s .deploy-server-chunks-manifest ]; then find $APP_DIR/.next/server/chunks -type f | LC_ALL=C sort > /tmp/.srv-have.$TMP_TAG && LC_ALL=C sort .deploy-server-chunks-manifest > /tmp/.srv-keep.$TMP_TAG && comm -23 /tmp/.srv-have.$TMP_TAG /tmp/.srv-keep.$TMP_TAG > /tmp/.srv-orphans.$TMP_TAG && if [ -s /tmp/.srv-orphans.$TMP_TAG ]; then echo \"Pruning \$(wc -l < /tmp/.srv-orphans.$TMP_TAG) orphaned .next/server/chunks file(s) from prior builds\"; xargs -r rm -f < /tmp/.srv-orphans.$TMP_TAG; else echo \"No orphaned .next/server/chunks files to prune.\"; fi && rm -f /tmp/.srv-have.$TMP_TAG /tmp/.srv-keep.$TMP_TAG /tmp/.srv-orphans.$TMP_TAG; else echo \"WARN: .deploy-server-chunks-manifest missing/empty — skipping server-chunk prune (safety)\"; fi" || {
  log_message "ERROR" "Deployment failed on remote server"
  exit 1
}
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
log_message "INFO" "Process: $PM2_NAME on port $PM2_PORT (nginx: evelyn_upstream, the default)"
log_message "INFO" "Check logs: ssh root@$SERVER_IP 'pm2 logs $PM2_NAME'"
