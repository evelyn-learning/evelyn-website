/**
 * Partner-embed turns must never fail over to the fallback brain provider
 * (2026-09-19): `allowFallback=false` yields the primary as the ONLY target,
 * even with a fallback configured and even while the breaker is latched.
 * Env is set BEFORE the module import because the registry resolves the
 * fallback at load time.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
process.env.TUTOR_MODEL_BRAIN_FALLBACK = 'deepseek-chat';
process.env.TUTOR_MODEL_BRAIN_FALLBACK_BASE_URL = 'https://api.deepseek.com/anthropic';
process.env.TUTOR_MODEL_BRAIN_FALLBACK_API_KEY = 'sk-test-not-used';
process.env.ANTHROPIC_API_KEY ||= 'sk-ant-test-not-used';

async function main() {
  const { brainCallTargets, BRAIN_MODEL_ID } = await import('@/lib/tutor/voice/claude-brain');
  const checks: Array<[string, boolean]> = [];
  const withFb = brainCallTargets(undefined, true);
  const noFb = brainCallTargets(undefined, false);
  const pinned = brainCallTargets('claude-test-pin', true);
  checks.push(['fallback configured → 2 targets when allowed', withFb.length === 2]);
  checks.push(['primary first when breaker not latched', withFb[0]?.model === BRAIN_MODEL_ID]);
  checks.push(['fallback target is deepseek when allowed', withFb[1]?.model === 'deepseek-chat']);
  checks.push(['allowFallback=false → exactly 1 target', noFb.length === 1]);
  checks.push(['allowFallback=false → primary only', noFb[0]?.model === BRAIN_MODEL_ID]);
  checks.push(['model override pins a single target', pinned.length === 1 && pinned[0]?.model === 'claude-test-pin']);
  let fail = 0;
  for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
  console.log(`${checks.length - fail}/${checks.length} passed`);
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
