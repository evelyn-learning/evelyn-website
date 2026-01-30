#!/usr/bin/env node
/**
 * Startup script to ensure the auto-blog scheduler is running
 * Run this after the Next.js server starts
 *
 * Usage: node scripts/start-scheduler.js
 * Or add to PM2 ecosystem file
 */

const https = require('https');
const http = require('http');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const MAX_RETRIES = 10;
const RETRY_DELAY = 5000; // 5 seconds

async function waitForServer(retries = 0) {
  return new Promise((resolve, reject) => {
    const url = new URL('/api/health', SITE_URL);
    const client = url.protocol === 'https:' ? https : http;

    const req = client.get(url.toString(), (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        reject(new Error(`Server returned ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      if (retries < MAX_RETRIES) {
        console.log(`Waiting for server... (attempt ${retries + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          waitForServer(retries + 1).then(resolve).catch(reject);
        }, RETRY_DELAY);
      } else {
        reject(err);
      }
    });

    req.setTimeout(5000, () => {
      req.destroy();
      if (retries < MAX_RETRIES) {
        setTimeout(() => {
          waitForServer(retries + 1).then(resolve).catch(reject);
        }, RETRY_DELAY);
      } else {
        reject(new Error('Server timeout'));
      }
    });
  });
}

async function startScheduler() {
  return new Promise((resolve, reject) => {
    const url = new URL('/api/ai/blog/auto', SITE_URL);
    const client = url.protocol === 'https:' ? https : http;

    const data = JSON.stringify({ action: 'restart' });

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        // This endpoint requires auth - for internal use, we can add a special header
        'X-Internal-Scheduler': process.env.SCHEDULER_SECRET || 'internal-startup',
      },
    };

    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch {
          resolve({ raw: body, status: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('[Scheduler Startup] Waiting for server to be ready...');

  try {
    await waitForServer();
    console.log('[Scheduler Startup] Server is ready');

    const result = await startScheduler();
    console.log('[Scheduler Startup] Result:', result);

    if (result.success) {
      console.log('[Scheduler Startup] Auto-blog scheduler started successfully');
    } else {
      console.log('[Scheduler Startup] Note: May need manual authentication to start scheduler');
    }
  } catch (error) {
    console.error('[Scheduler Startup] Error:', error.message);
    process.exit(1);
  }
}

main();
