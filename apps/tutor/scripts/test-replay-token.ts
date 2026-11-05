/**
 * Replay-token signer (GDI learner home, task 3). Run: cd apps/tutor && npx tsx scripts/test-replay-token.ts
 */
import {
  signReplayToken, replayUrl, verifyReplayTokenAsync,
} from '../src/lib/tutor/portal/replay-token';
import {
  __setPartnerTokenSecretDepsForTests, type PartnerTokenSecretDeps,
} from '../src/lib/tutor/portal/partner-token-secrets';
import type { PartnerRecord } from '../src/lib/tutor/portal/registry';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ok  ${name}`); }
  else { failed++; console.log(`  FAIL ${name}${detail ? `  — ${detail}` : ''}`); }
}

function deps(secrets: string[]): PartnerTokenSecretDeps {
  return {
    async getPartner(id) {
      if (secrets.length === 0) return null;
      const r: PartnerRecord = {
        partnerId: id, kind: 'partner', status: 'active', secrets,
        allowedEndpoints: ['/api/portal/v1/'], limits: { rpm: 600, burst: 60, dailyQuota: null }, flagOverrides: {},
      };
      return r;
    },
    env: {} as NodeJS.ProcessEnv,
  };
}

const NOW = 1_800_000_000_500;
const base = { partner_id: 'gdi', student_id: 'stu-1', session_id: 'portal-abc' };

async function main() {
  __setPartnerTokenSecretDepsForTests(deps(['s1']));
  const tok = await signReplayToken(base, NOW);
  check('signs when partner has a secret', typeof tok === 'string' && tok.split('.').length === 3);
  const v = await verifyReplayTokenAsync(tok as string, NOW);
  check('round-trips through verifyReplayTokenAsync', v.ok === true, JSON.stringify(v));
  if (v.ok) {
    check('session_id preserved', v.payload.session_id === 'portal-abc');
    check('student_id preserved', v.payload.student_id === 'stu-1');
    check('exp = floor(now/1000)+30d', v.payload.exp === Math.floor(NOW / 1000) + 30 * 86400, String(v.payload.exp));
  }
  const custom = await signReplayToken({ ...base, ttlSec: 60 }, NOW);
  const vc = await verifyReplayTokenAsync(custom as string, NOW);
  check('custom ttlSec honoured', vc.ok === true && vc.payload.exp === Math.floor(NOW / 1000) + 60);
  const expired = await verifyReplayTokenAsync(tok as string, NOW + 31 * 86400 * 1000);
  check('expires after the ttl', expired.ok === false);

  __setPartnerTokenSecretDepsForTests(deps([]));
  check('null when partner has no secret', (await signReplayToken(base, NOW)) === null);
  __setPartnerTokenSecretDepsForTests(null);

  check('replayUrl shape', replayUrl('a.b.c', 'https://x.com') === 'https://x.com/tutor-portal/replay?token=a.b.c');
  check('replayUrl strips trailing slash', replayUrl('a.b.c', 'https://x.com/') === 'https://x.com/tutor-portal/replay?token=a.b.c');

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
void main();
