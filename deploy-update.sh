#!/bin/bash

# Evelyn Learning - Quick Update Deployment
# Use this for subsequent deployments after initial setup

set -e

SERVER="root@84.247.185.169"
DEPLOY_PATH="/root/evelynlearning"
APP_NAME="evelyn-website"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Deploying updates to Evelyn Learning...${NC}"

# Sync files
echo -e "${YELLOW}Syncing files...${NC}"
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '.claude' \
    --exclude '.env.local' \
    --exclude '.env.local.*' \
    --exclude '*.log' \
    ./ $SERVER:$DEPLOY_PATH/

# Ship the production env (same mechanism as deploy-to-production.sh):
# .env.local.production is the CANONICAL prod env — it lands as the server's
# .env.local before the remote build, so NEXT_PUBLIC_ vars bake in from it
# and new flags never need a separate manual edit on the server (the old
# manual-edit flow caused real drift: TUTOR_ANSWER_EQUIVALENCE was lost from
# prod for weeks, 2026-07-17). rsync above still excludes .env.local* — this
# scp is the single deliberate channel. -O forces legacy scp protocol:
# OpenSSH 9+ defaults to SFTP and hangs at 0% against this server (same
# gotcha documented in deploy-to-production.sh).
echo -e "${YELLOW}Uploading .env.local.production as server .env.local...${NC}"
if [ ! -f ".env.local.production" ]; then
    echo "ERROR: .env.local.production not found — aborting so the server env is not left stale." >&2
    exit 1
fi
scp -O .env.local.production $SERVER:$DEPLOY_PATH/.env.local

# Build and restart.
# set -e INSIDE the remote block is load-bearing: without it a failed
# `npm run build` (seen 2026-07-14: ENOTEMPTY on a stale .next) still
# restarted pm2 against the now-deleted build — crash loop — and the script
# reported "Deployment complete!". Now any remote failure aborts the deploy
# and the old process keeps serving the previous build.
echo -e "${YELLOW}Building and restarting...${NC}"
ssh $SERVER << ENDSSH
set -e
cd $DEPLOY_PATH
npm ci --production=false
# Clean build every time: incremental next builds on this server keep dying
# with ENOTEMPTY rmdir on stale .next/server/app/blog/*.segments dirs (hit
# twice 2026-07-14/15). The running pm2 process keeps serving through the
# ~2.5min rebuild; set -e above means a failed build never restarts pm2.
# Retry rm -rf against pm2-write race (hit 2026-07-15, 2026-07-16).
for attempt in 1 2 3; do
  if rm -rf .next; then
    break
  fi
  if [ \$attempt -lt 3 ]; then
    sleep 2
  fi
done

if [ -d .next ]; then
  echo "Failed to remove .next after 3 attempts" >&2
  exit 1
fi
npm run build
pm2 restart $APP_NAME --update-env
ENDSSH

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "Site: ${YELLOW}http://84.247.185.169${NC}"
