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

# Clean up previous builds
log_message "INFO" "Cleaning up previous build artifacts..."
rm -rf .next/ 2>/dev/null || true

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

# Step 2: Create deployment package
log_message "STEP" "Creating deployment package..."

if [ -f "$ZIP_FILE" ]; then
  rm -f "$ZIP_FILE"
  log_message "INFO" "Removed existing zip file"
fi

# Zip everything except node_modules, .git, and local env files
zip -qr "$ZIP_FILE" \
  .next \
  public \
  src \
  package.json \
  package-lock.json \
  next.config.ts \
  tsconfig.json \
  tailwind.config.ts \
  postcss.config.mjs \
  -x "*.log" "*/.DS_Store" || {
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
scp -o StrictHostKeyChecking=no "$ZIP_FILE" "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/" || {
  log_message "ERROR" "Failed to upload zip file to server"
  exit 1
}
log_message "INFO" "Successfully uploaded zip file to server"

# Step 3.5: Upload production environment file
log_message "STEP" "Uploading production environment file..."
if [ -f ".env.local.production" ]; then
  scp -o StrictHostKeyChecking=no ".env.local.production" "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/.env.local" || {
    log_message "WARNING" "Failed to upload .env.local.production"
  }
  log_message "INFO" "Successfully uploaded .env.local.production as .env.local"
else
  log_message "WARNING" ".env.local.production not found, skipping env file upload"
fi

# Step 4: Deploy on remote server
#
# IMPORTANT: `unzip -o` overwrites existing files but does NOT delete files
# that are absent from the archive. This means any file removed from the
# repo (e.g. public/robots.txt after it was replaced by app/robots.ts) will
# silently survive on production and shadow the Next.js route.
#
# Maintain an explicit prune list below for files that have been deleted
# from the repo and must ALSO be removed from production. Add new entries
# here whenever you delete a file under public/ that is now handled by a
# Next.js route handler. Do NOT rm -rf public/ — it contains 200+ MB of
# user-uploaded images and the GSC verification HTML that aren't in the repo.
log_message "STEP" "Running deployment on production server..."
run_remote_command "cd $REMOTE_DIR && \
  unzip -qo $ZIP_FILE && \
  rm -f $ZIP_FILE && \
  rm -f public/robots.txt && \
  rm -f public/sitemap.xml && \
  npm ci --omit=dev && \
  (pm2 delete evelyn-website 2>/dev/null || true) && \
  pm2 start node_modules/.bin/next --name evelyn-website -- start -p 3001 && \
  pm2 save" || {
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
