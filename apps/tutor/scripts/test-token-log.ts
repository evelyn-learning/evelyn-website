/** The realtime-token route must never log the ephemeral key.
 *  Usage: npx tsx scripts/test-token-log.ts */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describeTokenResponse } from '../src/lib/tutor/voice/token-log';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }

const SECRET = 'ek_68e0c0ffee0123456789abcdefSECRET';
const INSTR = 'You are a voice-only audio relay. PRIVATE-PROMPT-MARKER';
const real = { value: SECRET, expires_at: 1791000000, session: { type: 'realtime', model: 'gpt-realtime', instructions: INSTR, client_secret: { value: SECRET } } };

const line = describeTokenResponse(200, real, 'gpt-realtime');
check('logs status, model and expiry', line === 'status=200 model=gpt-realtime expires_at=1791000000 token=present', line);
check('never the token value, in any position', !line.includes(SECRET) && !line.includes('ek_'));
check('never the session instructions', !line.includes('PRIVATE-PROMPT-MARKER'));
check('a response without a token says so (no value to print)', describeTokenResponse(200, { expires_at: 5 }, 'm') === 'status=200 model=m expires_at=5 token=MISSING');
check('the model falls back to the requested one; junk in the model field is not echoed',
  describeTokenResponse(200, { value: SECRET, session: { model: `x ${SECRET}` } }, 'gpt-realtime-2') === 'status=200 model=gpt-realtime-2 expires_at=unknown token=present');
check('a token smuggled into expires_at as a string is not echoed', !describeTokenResponse(200, { value: SECRET, expires_at: SECRET }).includes(SECRET));
for (const junk of [null, undefined, 'ek_string_body', 42, []]) {
  const out = describeTokenResponse(502, junk);
  check(`non-object body ${JSON.stringify(junk) ?? 'undefined'} → fixed text`, out === 'status=502 model=unknown expires_at=unknown token=MISSING', out);
}

// Wiring: no *-token route prints a provider response body or a secret field.
const api = join(__dirname, '..', 'src', 'app', 'api');
const routes: string[] = [];
for (const base of ['tutor', 'tutor-portal']) {
  const dir = join(api, base);
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    const f = join(dir, name, 'route.ts');
    if (name.endsWith('-token') && existsSync(f)) routes.push(f);
  }
}
check('found the token routes (realtime, perception, cartesia, demo)', routes.length >= 4, routes.join(', '));
for (const f of routes) {
  const src = readFileSync(f, 'utf8');
  const logs = src.match(/console\.(?:log|info|debug|warn|error)\([^;]*;/g) ?? [];
  const leaky = logs.filter((l) => /JSON\.stringify\(\s*data\b|\bdata\.(?:value|token|client_secret)\b|,\s*data\s*\)|\bapiKey\b|\bclient_secret\b/.test(l));
  check(`${f.split('/api/')[1]}: no log call prints the response body or a secret field`, leaky.length === 0, leaky.join(' | '));
}
const rt = readFileSync(join(api, 'tutor', 'realtime-token', 'route.ts'), 'utf8');
check('realtime-token logs through describeTokenResponse', rt.includes('describeTokenResponse(response.status, data, model)') && !/JSON\.stringify\(data/.test(rt));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
