#!/bin/bash

# Evelyn Learning - Deploy the TUTOR app to Production
# Server: root@84.247.185.169
# Remote path: /root/evelyn-tutor
#
# One of the two halves of the M1a workspace split (the other is
# deploy-marketing.sh); together they replace the single
# deploy-to-production.sh, which deployed one app from the repo root.
# Each script owns its own remote directory, its own pm2 process and its
# own port, so the two apps deploy and restart completely independently.
#
#   this script      -> apps/tutor      -> /root/evelyn-tutor      -> pm2 evelyn-tutor      -> :3007
#   deploy-marketing -> apps/marketing  -> /root/evelyn-marketing  -> pm2 evelyn-marketing  -> :3001
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
# REMOTE_DIR moved (it used to be /root/evelynlearning), so the first run
# creates a virgin tree. deploy-marketing.sh carries a long warning about
# what that strands for marketing — 200+ MB of user uploads and the GSC
# verification file in public/. The TUTOR's exposure is smaller but not zero:
#
#   1. public/ketcher/bundle.js and bundle.css are BUILD-GENERATED and
#      gitignored. They ship only because the zip takes public/ off the LOCAL
#      filesystem — so if this checkout does not have them, the archive
#      contains ketcher/index.html and nothing to load, and every chemistry
#      whiteboard hangs on "Loading chemistry editor...". They are absent from
#      a fresh clone (this one included).
#
#      REBUILDING THEM IS CURRENTLY BLOCKED, and not by anything the split
#      did: node_modules has ketcher-react@3.17.2 against ketcher-core@3.12.0
#      (ketcher-react declares `"ketcher-core": "*"`, so npm let it float),
#      and 3.17.2 imports 18 symbols that 3.12.0 does not export. Verified
#      identical in the package-lock at this branch's merge-base, and
#      reproduced under the exact pre-split invocation — so
#      `node scripts/build-ketcher.mjs` fails the same way on main. Fixing it
#      means pinning or upgrading a dependency, which the M1a constraints
#      forbid; it is tracked as a separate follow-up.
#
#      SO THESE TWO FILES CANNOT BE REGENERATED TODAY. They are not
#      disposable build output; they are the last surviving copy of a build
#      from 2026-03-22, and the only source for the deploy. Do not delete
#      them as "regenerable".
#
#      GOOD NEWS: they were never lost. Task 6 moved this app with `git mv`,
#      which only moves TRACKED files, and these two are gitignored — so they
#      stayed behind at the pre-split path instead of coming along:
#
#        /Users/luke/Dev/evelynlearning/public/ketcher/bundle.js    26,060,387 bytes
#        /Users/luke/Dev/evelynlearning/public/ketcher/bundle.css      182,671 bytes
#
#      PRIMARY MIGRATION — on the DEPLOYING MACHINE, once, before the first
#      ./deploy-tutor.sh. This script zips public/ off the local filesystem,
#      so whatever sits in apps/tutor/public/ketcher/ at zip time is what
#      ships; nothing on the server can substitute for it. From the repo root
#      of the checkout you deploy from:
#
#        mkdir -p apps/tutor/public/ketcher
#        cp -n public/ketcher/bundle.js  apps/tutor/public/ketcher/
#        cp -n public/ketcher/bundle.css apps/tutor/public/ketcher/
#        ls -l apps/tutor/public/ketcher/     # both non-empty, ~26M and ~183K
#
#      (If you deploy from a worktree that has no pre-split public/, point the
#      source at the checkout that does — the paths above.)
#
#      COPY ONLY THOSE TWO FILES. Do NOT copy or overwrite index.html: the
#      tracked apps/tutor/public/ketcher/index.html is already in place and is
#      the authoritative copy. `-n` is belt-and-braces against exactly that.
#      The bundles stay out of git — .gitignore's apps/*/public/ketcher/bundle.*
#      catches both, verified — and a 26 MB blob in git history is not
#      practically removable.
#
#      FALLBACK, if the deploying machine no longer has them: production has a
#      copy, because it was deployed from this very file. Pull it down, or on
#      the server do the equivalent of the marketing cp -an so the OLD remote
#      dir seeds the new one:
#
#        mkdir -p /root/evelyn-tutor/apps/tutor/public/ketcher
#        cp -an /root/evelynlearning/public/ketcher/bundle.js  /root/evelyn-tutor/apps/tutor/public/ketcher/
#        cp -an /root/evelynlearning/public/ketcher/bundle.css /root/evelyn-tutor/apps/tutor/public/ketcher/
#
#      Two named files here too, for the same reason as the primary path: the
#      tracked index.html is authoritative and must not be shadowed by an old
#      copy. (`cp -an <dir>/. <dir>/` would have dragged index.html along.)
#
#      Either way confirm bundle.js and bundle.css are present and non-empty
#      BEFORE the first ./deploy-tutor.sh — the deploy's public/ prune only
#      ever deletes files listed in a PREVIOUS manifest, so files placed this
#      way are never touched, exactly like marketing's uploads.
#      (If NEITHER the deploying machine nor production has them, then
#      production has been serving a broken molecule editor for a while
#      already: file that as a bug, do not delay the cutover for it.)
#
#      Once the dependency skew is fixed, the generator is the right source
#      again. It must be run from the app dir, since its output paths are
#      relative to the cwd:
#          (cd apps/tutor && node scripts/build-ketcher.mjs)
#
#   2. src/data/curated-videos-ap.json is written AT RUNTIME by
#      /admin/video-curator when the operator approves a segment. It is also
#      overwritten by `unzip -o` on every single deploy, so prod approvals
#      have always been transient — the file's own docstring says the repo is
#      the storage and the work is meant to be version-controlled. The move
#      does not create that hazard, it just applies it one deploy early.
#      Before cutover, capture /root/evelynlearning/src/data/curated-videos-ap*.json
#      and diff it against the repo copy; commit anything prod has that the
#      repo does not.
#
# Nothing else needs migrating. In particular artifacts/voice-harness is NOT
# an exposure: its only reader,
# src/app/api/tutor/voice-harness/[...path]/route.ts, returns 404 unless
# NODE_ENV === 'development', so it has never served anything in production.
###############################################################################

# Configuration
SERVER_IP="84.247.185.169"
SERVER_USER="root"
REMOTE_DIR="/root/evelyn-tutor"
ZIP_FILE="evelyn-tutor.zip"

# Which workspace this script deploys. Every path below that used to be
# relative to the repo root (.next/, public/, src/, the config files) is
# now under $APP_DIR — the app moved, the layout inside it did not.
APP_DIR="apps/tutor"
APP_WORKSPACE="@evelyn/tutor"
PM2_NAME="evelyn-tutor"
PM2_PORT="3007"

# Suffix for this script's /tmp scratch files on the server. deploy-tutor.sh
# and deploy-marketing.sh now run against the SAME host, and the prune logic
# below builds its keep-set in /tmp: with shared filenames, two overlapping
# deploys would diff one app's on-disk static tree against the OTHER app's
# manifest and delete every chunk of the running build.
TMP_TAG="tutor"

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
  if [ -f ".env.local.dev.bak" ]; then
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
log_message "INFO" "Starting Evelyn Learning TUTOR deployment to production..."

# Step 1: Build locally using production env (for NEXT_PUBLIC_ vars)
log_message "STEP" "Building Next.js application locally..."

# Temporarily swap in production env so NEXT_PUBLIC_ vars are baked in correctly.
# This still operates on the REPO-ROOT .env.local even though the build now runs
# with its cwd inside $APP_DIR: apps/*/.env.local are symlinks to ../../.env.local,
# so swapping the root file is what the app actually reads at build time.
RESTORE_ENV=false
if [ -f ".env.local.production" ]; then
  cp .env.local .env.local.dev.bak
  cp .env.local.production .env.local
  RESTORE_ENV=true
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
# apps/tutor/), because the server consumes them with its cwd at $REMOTE_DIR,
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
#                 src/ still ships because runtime code reads files out of it
#                 relative to cwd (e.g. the video curator's
#                 src/data/curated-videos-ap.json) and because
#                 src/instrumentation.ts is what registers this app's crons.
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
  tsconfig.json \
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
# the zip — this upload is the only thing that puts it on the server, and the
# post-unzip check below is what stops a silent miss from taking every secret
# out at once.
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
#   1. A hard .env.local gate right after the unzip. .env.local is gitignored
#      and therefore never in the archive — it gets there only via the upload
#      step above. If that upload silently failed, `next start` would come up
#      with no secrets at all rather than not come up, so this refuses to
#      restart instead.
#   2. The pm2 process starts with its cwd INSIDE $APP_DIR (note the
#      subshell), so the app sees exactly the pre-split layout: several
#      runtime modules resolve paths from process.cwd() — the video
#      curator's src/data/curated-videos-ap.json store, the voice-harness
#      artifacts/ route — and they must keep resolving against the app dir,
#      not the workspace root. `next start` has NO --dir flag (Next 16.1.6:
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
log_message "INFO" "Tutor deployment to production completed!"
log_message "INFO" "=========================================="
log_message "INFO" "Site: http://$SERVER_IP"
log_message "INFO" "Process: $PM2_NAME on port $PM2_PORT (nginx: evelyn_tutor_upstream)"
log_message "INFO" "Check logs: ssh root@$SERVER_IP 'pm2 logs $PM2_NAME'"
