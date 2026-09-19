/**
 * mint-embed-token.ts — dev helper: mint a signed embed token for the LOCAL
 * engine (Task 10, text-only tutor mode e2e).
 *
 * Mirrors docs/whitelabel/kanzoo/examples/sign-embed-token.js's signing
 * scheme exactly (HS256 JWT, same header/claim names, same HMAC), but reads
 * the partner secret out of the LOCAL PORTAL_PARTNER_SECRETS env var instead
 * of requiring PARTNER_SECRET on the command line. PORTAL_PARTNER_SECRETS is
 * a JSON map (see auth.ts / registry.ts's getPartnerSecret /
 * resolveEnvSecret — mode 1: `PORTAL_PARTNER_SECRETS='{"portalA":"secret-a"}'`),
 * NOT a comma-separated `id:secret` list.
 *
 * The 'evelyn-marketing' partner (the production embed default) has no
 * local secret in this repo's .env.local — only 'academy' and 'crimsora' do,
 * so --partner defaults to 'academy' (the one this file's own examples and
 * Task 10's e2e runs use). Both 'academy' and 'crimsora' work identically
 * for embed-token verification (getPartnerSecret finds either in the env
 * map) and neither is subject to the evelyn-marketing-only demo gate
 * (checkDemoAccess allows any non-'evelyn-marketing' partner token
 * unconditionally — see demo-gate/enforce.ts). Override with --partner for
 * a different local secret (e.g. 'crimsora', or 'evelyn-marketing' itself
 * once it's added to PORTAL_PARTNER_SECRETS).
 *
 * Usage:
 *   npx tsx scripts/mint-embed-token.ts --mode text --student qa-text-1
 *   npx tsx scripts/mint-embed-token.ts --student qa-voice-1 \
 *     --subject math --level Elementary --topic g4-math --plan evelyn.g4.math.long-division.v1
 */
import * as dotenv from 'dotenv';
// quiet: true — dotenv 17's "injected env" banner goes to stdout and would
// corrupt `T=$(npx tsx scripts/mint-embed-token.ts …)` token capture.
dotenv.config({ path: '.env.local', quiet: true });
import { createHmac } from 'node:crypto';

const arg = (k: string, d?: string) =>
  process.argv.includes(`--${k}`) ? process.argv[process.argv.indexOf(`--${k}`) + 1] : d;

const partner = arg('partner', 'academy')!;

// PORTAL_PARTNER_SECRETS is a JSON map — `{"academy":"...","crimsora":"..."}`
// — matching getPartnerSecret (auth.ts) / resolveEnvSecret (registry.ts)
// exactly, not a comma-separated pair list.
function loadSecret(partnerId: string): string {
  const raw = process.env.PORTAL_PARTNER_SECRETS;
  if (!raw) throw new Error('PORTAL_PARTNER_SECRETS is not set in .env.local');
  let map: Record<string, string>;
  try {
    map = JSON.parse(raw);
  } catch {
    throw new Error('PORTAL_PARTNER_SECRETS is not valid JSON');
  }
  const secret = map[partnerId];
  if (typeof secret !== 'string' || !secret) {
    throw new Error(
      `no secret for partner "${partnerId}" in PORTAL_PARTNER_SECRETS (available: ${Object.keys(map).join(', ') || '(none)'})`,
    );
  }
  return secret;
}

const secret = loadSecret(partner);

const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const payload: Record<string, unknown> = {
  partner_id: partner,
  student_id: arg('student', 'qa-text-1'),
  subject: arg('subject', 'math'),
  level: arg('level', '9-10'),
  topic: arg('topic', 'algebra-1'),
  iat: now,
  exp: now + 3600,
};
const mode = arg('mode');
if (mode) payload.input_mode = mode;
// --plan → EmbedConfig.curriculum_module (the embed page's active
// lessonPlanId source) — lets a voice-mode mint reproduce a specific
// lesson-plan-driven scenario (e.g. arith-long-division) through the embed
// path, not just a free-conversation session on --subject/--level/--topic.
const plan = arg('plan');
if (plan) payload.curriculum_module = plan;

const head = b64({ alg: 'HS256', typ: 'JWT' });
const body = b64(payload);
const sig = createHmac('sha256', secret).update(`${head}.${body}`).digest('base64url');
process.stdout.write(`${head}.${body}.${sig}\n`);
