#!/bin/bash

# Deployment script for Evelyn Learning website
# Server: 84.247.185.169 (Contabo VPS)

set -e

# Configuration
SERVER="84.247.185.169"
USER="root"
DEPLOY_PATH="/var/www/evelyn-website"
PM2_APP_NAME="evelyn-website"

echo "🚀 Starting deployment to production..."

# Build the application
echo "📦 Building the application..."
npm run build

# Create deployment archive
echo "📁 Creating deployment archive..."
tar -czf deploy.tar.gz .next package.json package-lock.json next.config.ts public

# Upload to server
echo "📤 Uploading to server..."
scp deploy.tar.gz $USER@$SERVER:/tmp/

# Deploy on server
echo "🔧 Deploying on server..."
ssh $USER@$SERVER << 'ENDSSH'
  cd /tmp

  # Backup current deployment
  if [ -d "/var/www/evelyn-website" ]; then
    echo "Backing up current deployment..."
    cp -r /var/www/evelyn-website /var/www/evelyn-website.backup
  fi

  # Create directory if it doesn't exist
  mkdir -p /var/www/evelyn-website
  cd /var/www/evelyn-website

  # Extract new deployment
  tar -xzf /tmp/deploy.tar.gz

  # Install production dependencies
  npm ci --production

  # Restart PM2 process
  pm2 restart evelyn-website || pm2 start npm --name "evelyn-website" -- start

  # Cleanup
  rm /tmp/deploy.tar.gz

  echo "✅ Deployment completed successfully!"
ENDSSH

# Cleanup local archive
rm deploy.tar.gz

echo "🎉 Deployment finished!"
