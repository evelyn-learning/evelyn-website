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
    --exclude '.env.local' \
    --exclude '*.log' \
    ./ $SERVER:$DEPLOY_PATH/

# Build and restart
echo -e "${YELLOW}Building and restarting...${NC}"
ssh $SERVER << ENDSSH
cd $DEPLOY_PATH
npm ci --production=false
npm run build
pm2 restart $APP_NAME
ENDSSH

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "Site: ${YELLOW}http://84.247.185.169${NC}"
