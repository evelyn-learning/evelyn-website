import { randomBytes } from 'crypto';

const key = randomBytes(32).toString('hex');
console.log('\nGenerated TOKEN_ENCRYPTION_KEY (add to .env.local):\n');
console.log(`TOKEN_ENCRYPTION_KEY=${key}\n`);
console.log('Keep this value secret. Re-running this script invalidates any tokens already stored under the previous key.\n');
