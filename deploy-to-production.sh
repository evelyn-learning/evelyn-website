#!/bin/bash

# Evelyn Learning - Deploy to Production
# Server: root@84.247.185.169
# Remote path: /root/evelynlearning

# Colors for output formatting
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="84.247.185.169"
SERVER_USER="root"
REMOTE_DIR="/root/evelynlearning"
ZIP_FILE="evelyn-website.zip"

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
log_message "INFO" "Starting Evelyn Learning deployment to production..."

# Step 1: Build locally using production env (for NEXT_PUBLIC_ vars)
log_message "STEP" "Building Next.js application locally..."

# Temporarily swap in production env so NEXT_PUBLIC_ vars are baked in correctly
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
rm -rf .next/ 2>/dev/null || true
rm -f tsconfig.tsbuildinfo 2>/dev/null || true

npm run build || {
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
log_message "STEP" "Generating public/ manifest..."
find public -type f | LC_ALL=C sort > .deploy-public-manifest
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
find .next/static -type f | LC_ALL=C sort > .deploy-static-manifest
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
find .next/server/chunks -type f | LC_ALL=C sort > .deploy-server-chunks-manifest
log_message "INFO" "Server-chunk manifest contains $(wc -l < .deploy-server-chunks-manifest) entries"

# Step 2: Create deployment package
log_message "STEP" "Creating deployment package..."

if [ -f "$ZIP_FILE" ]; then
  rm -f "$ZIP_FILE"
  log_message "INFO" "Removed existing zip file"
fi

# Zip everything except node_modules, .git, and local env files.
#
# .next/cache is excluded: it is the LOCAL build cache (webpack/SWC + the
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
zip -qr "$ZIP_FILE" \
  .next \
  public \
  src \
  package.json \
  package-lock.json \
  .npmrc \
  next.config.ts \
  tsconfig.json \
  tailwind.config.ts \
  postcss.config.mjs \
  .deploy-public-manifest \
  .deploy-static-manifest \
  .deploy-server-chunks-manifest \
  -x "*.log" "*/.DS_Store" ".next/cache/*" || {
  log_message "ERROR" "Failed to create zip file"
  exit 1
}
log_message "INFO" "Successfully created $ZIP_FILE"

# Step 3: Ensure remote directory exists and upload
log_message "STEP" "Setting up remote server..."
run_remote_command "mkdir -p $REMOTE_DIR" || {
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
log_message "STEP" "Uploading production environment file..."
if [ -f ".env.local.production" ]; then
  upload_with_retry ".env.local.production" "$REMOTE_DIR/.env.local" || {
    log_message "WARNING" "Failed to upload .env.local.production after 3 attempts"
  }
  log_message "INFO" "Successfully uploaded .env.local.production as .env.local"
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
log_message "STEP" "Running deployment on production server..."
run_remote_command "cd $REMOTE_DIR && \
  if [ -f .deploy-public-manifest ]; then cp .deploy-public-manifest /tmp/.deploy-public-manifest.prev; else : > /tmp/.deploy-public-manifest.prev; fi && \
  unzip -qo $ZIP_FILE && \
  rm -f $ZIP_FILE && \
  STALE_FILES=\$(comm -23 /tmp/.deploy-public-manifest.prev .deploy-public-manifest) && \
  if [ -n \"\$STALE_FILES\" ]; then echo \"Pruning stale public/ files:\"; echo \"\$STALE_FILES\"; echo \"\$STALE_FILES\" | xargs -r rm -f; else echo \"No stale public/ files to prune.\"; fi && \
  rm -f /tmp/.deploy-public-manifest.prev && \
  if [ -s .deploy-static-manifest ]; then find .next/static -type f | LC_ALL=C sort > /tmp/.static-have && LC_ALL=C sort .deploy-static-manifest > /tmp/.static-keep && comm -23 /tmp/.static-have /tmp/.static-keep > /tmp/.static-orphans && if [ -s /tmp/.static-orphans ]; then echo \"Pruning \$(wc -l < /tmp/.static-orphans) orphaned .next/static file(s) from prior builds\"; xargs -r rm -f < /tmp/.static-orphans; else echo \"No orphaned .next/static files to prune.\"; fi && rm -f /tmp/.static-have /tmp/.static-keep /tmp/.static-orphans; else echo \"WARN: .deploy-static-manifest missing/empty — skipping static prune (safety)\"; fi && \
  npm ci --omit=dev && \
  (pm2 delete evelyn-website 2>/dev/null || true) && \
  pm2 start node_modules/.bin/next --name evelyn-website -- start -p 3001 && \
  pm2 save && \
  if [ -s .deploy-server-chunks-manifest ]; then find .next/server/chunks -type f | LC_ALL=C sort > /tmp/.srv-have && LC_ALL=C sort .deploy-server-chunks-manifest > /tmp/.srv-keep && comm -23 /tmp/.srv-have /tmp/.srv-keep > /tmp/.srv-orphans && if [ -s /tmp/.srv-orphans ]; then echo \"Pruning \$(wc -l < /tmp/.srv-orphans) orphaned .next/server/chunks file(s) from prior builds\"; xargs -r rm -f < /tmp/.srv-orphans; else echo \"No orphaned .next/server/chunks files to prune.\"; fi && rm -f /tmp/.srv-have /tmp/.srv-keep /tmp/.srv-orphans; else echo \"WARN: .deploy-server-chunks-manifest missing/empty — skipping server-chunk prune (safety)\"; fi" || {
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
log_message "INFO" "Deployment to production completed!"
log_message "INFO" "=========================================="
log_message "INFO" "Site: http://$SERVER_IP"
log_message "INFO" "Check logs: ssh root@$SERVER_IP 'pm2 logs evelyn-website'"
