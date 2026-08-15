/**
 * Env preload for verify-writeback-live.ts. Must be the FIRST import: db.ts
 * snapshots MONGODB_URI at module-import time, and shell `source`-ing of
 * .env.local mangles the URI's unquoted '&' query options — so this parses
 * the file directly before any other module loads.
 */
import fs from 'node:fs';
import path from 'node:path';

for (const key of ['MONGODB_URI', 'ANTHROPIC_API_KEY']) {
  if (!process.env[key]) {
    try {
      const env = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
      const m = env.match(new RegExp(`^${key}=(.+)$`, 'm'));
      if (m) process.env[key] = m[1].trim();
    } catch { /* fall through — the script will fail loudly */ }
  }
}
