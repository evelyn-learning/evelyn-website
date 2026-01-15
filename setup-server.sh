#!/bin/bash

# Evelyn Learning - One-time Server Setup
# Run this before the first deployment

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER_IP="84.247.185.169"
SERVER_USER="root"
REMOTE_DIR="/root/evelynlearning"

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

log_message "INFO" "Starting Evelyn Learning server setup..."

# Run setup on remote server
log_message "STEP" "Installing dependencies on remote server..."
ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

echo "=== Checking Node.js ==="
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js already installed: $(node -v)"
fi

echo "=== Checking PM2 ==="
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
else
    echo "PM2 already installed"
fi

echo "=== Checking Nginx ==="
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
else
    echo "Nginx already installed"
fi

echo "=== Creating deployment directory ==="
mkdir -p /root/evelynlearning

echo "=== Creating .env.local ==="
cat > /root/evelynlearning/.env.local << 'EOF'
# Database
MONGODB_URI=mongodb://evelyn:EvelynDB_7493Learn@localhost:2710/evelynlearning?authSource=admin&replicaSet=rs0

# NextAuth
NEXTAUTH_URL=http://84.247.185.169
NEXTAUTH_SECRET=evelyn-nextauth-secret-change-in-production-2024

# Site URL
NEXT_PUBLIC_SITE_URL=http://84.247.185.169
EOF

echo "=== Configuring Nginx ==="
cat > /etc/nginx/sites-available/evelynlearning << 'EOF'
server {
    listen 80;
    server_name evelynlearning.com www.evelynlearning.com 84.247.185.169;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    client_max_body_size 50M;
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/evelynlearning /etc/nginx/sites-enabled/

# Test and reload Nginx
nginx -t && systemctl reload nginx

echo "=== Setup Complete ==="
ENDSSH

log_message "INFO" "=========================================="
log_message "INFO" "Server setup completed!"
log_message "INFO" "=========================================="
log_message "INFO" "Now run ./deploy.sh to deploy the application"
