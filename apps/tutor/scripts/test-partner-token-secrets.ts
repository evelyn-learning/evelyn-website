/**
 * Registry-aware embed/replay token verification —
 * src/lib/tutor/portal/partner-token-secrets.ts plus the two verifiers that
 * now use it. Hermetic: no DB, no LLM. The registry is injected.
 *
 * THE CASE THAT MATTERS is `evelyntutor`: a partner that exists ONLY as an
 * M1c registry row and is absent from PORTAL_PARTNER_SECRETS. In production
 * that combination returned `unknown partner` for every embed-token-gated
 * engine route and for the student replay page — 1061 × 401 vs 0 × 200 on
 * /api/tutor/session-usage, against 0 × 401 for the two env-configured
 * partners on the same route. Every assertion about it below has an
 * env-configured partner beside it as a live control: if the harness itself
 * breaks, the control fails too instead of quietly agreeing with me.
 *
 * Usage: npx tsx scripts/test-partner-token-secrets.ts
 *        (npm run test:partner-token-secrets)
 */
import { createHmac } from 'node:crypto';
import {
  resolvePartnerTokenSecrets,
  registryTokenSecretsEnabled,
  __setPartnerTokenSecretDepsForTests,
  type PartnerTokenSecretDeps,
} from '../src/lib/tutor/portal/partner-token-secrets';
import { verifyReplayToken, verifyReplayTokenAsync } from '../src/lib/tutor/portal/replay-token';
import { verifyEmbedToken, verifyEmbedTokenAsync } from '../src/lib/tutor/portal/embed-token';
import type { PartnerRecord } from '../src/lib/tutor/portal/registry';

let passed = 0;
let failed = 0;
function assert(cond: boolean, name: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

const ENV_KEYS = ['PORTAL_PARTNER_SECRETS', 'PORTAL_PARTNER_ID', 'PORTAL_API_SECRET', 'TUTOR_PARTNER_REGISTRY_TOKENS'] as const;
const savedEnv: Record<string, string | undefined> = {};
for (const k of ENV_KEYS) savedEnv[k] = process.env[k];
function restoreEnv() {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
}

// --- fixtures --------------------------------------------------------------
// Mirrors production's shape exactly: crimsora in the env map, evelyntutor
// only in the registry.
const CRIMSORA_SECRET = 'crimsora-env-secret';
const EVELYNTUTOR_SECRET = 'evelyntutor-registry-secret';
const ROTATED_SECRET = 'evelyntutor-rotated-secret';

function row(partnerId: string, secrets: string[], status: 'active' | 'suspended' = 'active'): PartnerRecord {
  return {
    partnerId,
    kind: 'partner',
    status,
    secrets,
    allowedEndpoints: ['/api/portal/v1/'],
    limits: { rpm: 600, burst: 60, dailyQuota: null },
    flagOverrides: {},
  };
}

/** The registry as production has it: a row for evelyntutor, none for crimsora. */
const REGISTRY: Record<string, PartnerRecord> = {
  evelyntutor: row('evelyntutor', [EVELYNTUTOR_SECRET]),
  suspendedco: row('suspendedco', ['suspended-secret'], 'suspended'),
};

function depsWith(overrides: Partial<PartnerTokenSecretDeps> = {}): PartnerTokenSecretDeps {
  return {
    // Falls back to the env map for an absent row, exactly as the real
    // getPartner does via fromEnv — otherwise this harness would "prove" a
    // regression the production code does not have.
    async getPartner(id) {
      if (REGISTRY[id]) return REGISTRY[id];
      const raw = process.env.PORTAL_PARTNER_SECRETS;
      if (raw) {
        const map = JSON.parse(raw) as Record<string, string>;
        if (map[id]) return row(id, [map[id]]);
      }
      return null;
    },
    env: process.env,
    ...overrides,
  };
}

function b64url(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj), 'utf8')
    .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function sign(payload: unknown, secret: string): string {
  const h = b64url({ alg: 'HS256', typ: 'JWT' });
  const p = b64url(payload);
  const sig = createHmac('sha256', secret).update(`${h}.${p}`).digest()
    .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${h}.${p}.${sig}`;
}

const NOW = 1_800_000_000_000;
const FUTURE_EXP = Math.floor(NOW / 1000) + 3600;
const replayPayload = (partner: string) => ({
  mode: 'replay', partner_id: partner, student_id: 'stu-1', session_id: 'portal-abc', exp: FUTURE_EXP,
});
const embedPayload = (partner: string) => ({ partner_id: partner, student_id: 'stu-1', exp: FUTURE_EXP });

process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ crimsora: CRIMSORA_SECRET });
delete process.env.PORTAL_PARTNER_ID;
delete process.env.PORTAL_API_SECRET;
delete process.env.TUTOR_PARTNER_REGISTRY_TOKENS;

console.log('partner-token-secrets: registry-aware embed + replay verification');

async function main() {
  // --- the flag ------------------------------------------------------------
  console.log('\nkill switch');
  assert(registryTokenSecretsEnabled({} as NodeJS.ProcessEnv) === true, 'defaults ON when unset');
  assert(registryTokenSecretsEnabled({ TUTOR_PARTNER_REGISTRY_TOKENS: 'off' } as unknown as NodeJS.ProcessEnv) === false, "'off' disables");
  assert(registryTokenSecretsEnabled({ TUTOR_PARTNER_REGISTRY_TOKENS: 'on' } as unknown as NodeJS.ProcessEnv) === true, "'on' enables");
  assert(registryTokenSecretsEnabled({ TUTOR_PARTNER_REGISTRY_TOKENS: 'yes' } as unknown as NodeJS.ProcessEnv) === true, 'any non-off value enables (never accidentally dark)');

  // --- secret resolution ---------------------------------------------------
  console.log('\nresolvePartnerTokenSecrets');
  assert((await resolvePartnerTokenSecrets('evelyntutor', depsWith())).includes(EVELYNTUTOR_SECRET),
    'REGRESSION TARGET: registry-only partner resolves its secret');
  assert((await resolvePartnerTokenSecrets('crimsora', depsWith())).includes(CRIMSORA_SECRET),
    'CONTROL: env-only partner still resolves (no regression)');
  assert((await resolvePartnerTokenSecrets('nobody-at-all', depsWith())).length === 0,
    'NEGATIVE CONTROL: unknown partner resolves to no secrets');
  assert((await resolvePartnerTokenSecrets('', depsWith())).length === 0, 'empty partner id resolves to no secrets');
  assert((await resolvePartnerTokenSecrets('suspendedco', depsWith())).length === 0,
    'suspended partner resolves to no secrets even though the row has one');

  const rotating = depsWith({ async getPartner(id) { return id === 'evelyntutor' ? row(id, [EVELYNTUTOR_SECRET, ROTATED_SECRET]) : null; } });
  const rotated = await resolvePartnerTokenSecrets('evelyntutor', rotating);
  assert(rotated.length === 2 && rotated.includes(ROTATED_SECRET), 'mid-rotation row yields every live secret');

  const throwing = depsWith({ async getPartner() { throw new Error('mongo is down'); } });
  assert((await resolvePartnerTokenSecrets('crimsora', throwing)).length === 0,
    'registry throw denies rather than falling back to env (cannot resurrect a suspended partner)');
  const keyFault = depsWith({ async getPartner() { throw new Error('PORTAL_SECRET_ENC_KEY is not set'); } });
  assert((await resolvePartnerTokenSecrets('crimsora', keyFault)).length === 0, 'key-config fault also denies');

  // Kill switch returns the pre-fix behaviour exactly.
  const offDeps = depsWith({ env: { ...process.env, TUTOR_PARTNER_REGISTRY_TOKENS: 'off' } as NodeJS.ProcessEnv });
  assert((await resolvePartnerTokenSecrets('evelyntutor', offDeps)).length === 0,
    "flag 'off' reproduces the pre-fix blind spot (proves the switch really switches)");
  assert((await resolvePartnerTokenSecrets('crimsora', offDeps)).includes(CRIMSORA_SECRET),
    "CONTROL: flag 'off' still serves env partners");

  // The async verifiers take no deps (route handlers pass none), so install
  // the injected registry through the test seam for everything below.
  __setPartnerTokenSecretDepsForTests(depsWith());

  // --- replay tokens -------------------------------------------------------
  console.log('\nreplay token');
  const etReplay = sign(replayPayload('evelyntutor'), EVELYNTUTOR_SECRET);
  const crReplay = sign(replayPayload('crimsora'), CRIMSORA_SECRET);

  assert(verifyReplayToken(crReplay, NOW).ok === true, 'CONTROL: sync env path still verifies an env partner');
  const syncEt = verifyReplayToken(etReplay, NOW);
  assert(syncEt.ok === false && syncEt.reason === 'unknown partner',
    'the sync env-only path still cannot see the registry partner — this is the bug, reproduced');

  const asyncEt = await verifyReplayTokenAsync(etReplay, NOW);
  assert(asyncEt.ok === true, 'REGRESSION TARGET: async path verifies the registry partner');
  assert((await verifyReplayTokenAsync(crReplay, NOW)).ok === true, 'CONTROL: async path still verifies the env partner');

  const forged = await verifyReplayTokenAsync(sign(replayPayload('evelyntutor'), 'wrong-secret'), NOW);
  assert(forged.ok === false && forged.reason === 'bad signature', 'NEGATIVE CONTROL: wrong secret is still rejected');
  const crossPartner = await verifyReplayTokenAsync(sign(replayPayload('evelyntutor'), CRIMSORA_SECRET), NOW);
  assert(crossPartner.ok === false && crossPartner.reason === 'bad signature',
    "NEGATIVE CONTROL: one partner's secret cannot sign another partner's token");
  const expired = await verifyReplayTokenAsync(
    sign({ ...replayPayload('evelyntutor'), exp: Math.floor(NOW / 1000) - 10 }, EVELYNTUTOR_SECRET), NOW);
  assert(expired.ok === false && expired.reason === 'expired', 'expiry still enforced (no grace on replay)');
  const notReplay = await verifyReplayTokenAsync(
    sign({ ...replayPayload('evelyntutor'), mode: 'embed' }, EVELYNTUTOR_SECRET), NOW);
  assert(notReplay.ok === false && notReplay.reason === 'not a replay token', 'mode claim still pinned');
  assert((await verifyReplayTokenAsync(null, NOW)).ok === false, 'null token rejected');
  assert((await verifyReplayTokenAsync('not-a-jwt', NOW)).ok === false, 'non-JWT rejected');
  const rotatedTok = sign(replayPayload('evelyntutor'), ROTATED_SECRET);
  assert((await verifyReplayTokenAsync(rotatedTok, NOW)).ok === false,
    'a secret NOT on the row does not verify (rotation list is the whole allowlist)');

  // --- embed tokens --------------------------------------------------------
  console.log('\nembed token');
  const etEmbed = sign(embedPayload('evelyntutor'), EVELYNTUTOR_SECRET);
  const crEmbed = sign(embedPayload('crimsora'), CRIMSORA_SECRET);

  assert(verifyEmbedToken(crEmbed, NOW).ok === true, 'CONTROL: sync env path still verifies an env partner');
  const syncEtEmbed = verifyEmbedToken(etEmbed, NOW);
  assert(syncEtEmbed.ok === false && syncEtEmbed.reason === 'unknown partner',
    'sync env-only path still blind to the registry partner — the production 401, reproduced');

  assert((await verifyEmbedTokenAsync(etEmbed, NOW)).ok === true,
    'REGRESSION TARGET: async path verifies the registry partner');
  assert((await verifyEmbedTokenAsync(crEmbed, NOW)).ok === true, 'CONTROL: async path still verifies the env partner');
  const embedForged = await verifyEmbedTokenAsync(sign(embedPayload('evelyntutor'), 'wrong-secret'), NOW);
  assert(embedForged.ok === false && embedForged.reason === 'bad signature', 'NEGATIVE CONTROL: wrong secret rejected');
  assert((await verifyEmbedTokenAsync(sign({ student_id: 'x' }, EVELYNTUTOR_SECRET), NOW)).ok === false,
    'missing partner_id claim rejected');

  // Grace window is embed-only and must survive the refactor: an exp 1h in the
  // past is still inside the 240min default.
  const staleEmbed = sign({ ...embedPayload('evelyntutor'), exp: Math.floor(NOW / 1000) - 3600 }, EVELYNTUTOR_SECRET);
  assert((await verifyEmbedTokenAsync(staleEmbed, NOW)).ok === true, 'expiry grace window preserved (1h stale passes)');
  const veryStale = sign({ ...embedPayload('evelyntutor'), exp: Math.floor(NOW / 1000) - 5 * 3600 }, EVELYNTUTOR_SECRET);
  assert((await verifyEmbedTokenAsync(veryStale, NOW)).ok === false, 'past the grace window still rejected');

  __setPartnerTokenSecretDepsForTests(null);
  restoreEnv();
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

void main();
