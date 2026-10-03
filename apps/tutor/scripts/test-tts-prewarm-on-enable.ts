/** TTS socket opens on enable, not on the first sentence. Run: npx tsx scripts/test-tts-prewarm-on-enable.ts */
import * as fs from 'node:fs';
import * as path from 'node:path';
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'tutor', 'hooks', 'useCartesiaSonicWS.ts'), 'utf8');
const ok = /useEffect\(\(\) => \{\s*if \(enabled\) void ensureOpen\(\);/.test(src);
console.log(`${ok ? 'PASS' : 'FAIL'}  useCartesiaSonicWS opens the socket when enabled`);
process.exit(ok ? 0 : 1);
