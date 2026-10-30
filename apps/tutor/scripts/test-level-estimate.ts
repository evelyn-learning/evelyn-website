/**
 * Task 14 §G — working-level estimate fallback: the route's gating (404-first)
 * and JSON parsing with a stubbed model (lib/tutor/level/estimate.ts), plus
 * the client wiring pins.
 * Run: npx tsx scripts/test-level-estimate.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  handleLevelEstimate, parseLevelEstimateBody, parseLevelEstimateReply, buildLevelEstimateUserMessage,
  LEVEL_ESTIMATE_MAX_TOKENS, LEVEL_ESTIMATE_TIMEOUT_MS, type LevelEstimateDeps,
} from '../src/lib/tutor/level/estimate';
import { CallBudget } from '../src/lib/tutor/pronunciation/assess-request';

let failed = 0;
const pending: Promise<void>[] = [];
function test(name: string, fn: () => void | Promise<void>) {
  pending.push((async () => {
    try { await fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
  })());
}

const LIVE = { sourcePartnerId: 'gdi-demo', status: 'active' };
const BODY = { sessionId: 's1', answers: ['I work in sales. I sell washing machine.', 'Yes, I have worked with customer from Vietnam.'] };
const deps = (over: Partial<LevelEstimateDeps> = {}): LevelEstimateDeps => ({
  enabled: true,
  findSession: async () => LIVE,
  callModel: async () => '{"level": "intermediate", "evidence": "Connected sentences with article and plural errors."}',
  budget: new CallBudget(3),
  ...over,
});

test('happy path: a live gdi-demo session ⇒ 200 ok {level, evidence}; the model gets the answers, small max_tokens', async () => {
  let seen: { system: string; user: string; maxTokens: number } | null = null;
  const out = await handleLevelEstimate(BODY, deps({ callModel: async (a) => { seen = a; return '{"level":"intermediate","evidence":"Connected sentences with errors."}'; } }));
  assert.deepEqual(out, { status: 200, body: { status: 'ok', level: 'intermediate', evidence: 'Connected sentences with errors.' } });
  assert.ok(seen!.user.includes('1. I work in sales.') && seen!.user.includes('Allowed levels: beginner, intermediate, advanced.'));
  assert.ok(seen!.system.includes('Reply with ONLY a JSON object'));
  assert.equal(seen!.maxTokens, LEVEL_ESTIMATE_MAX_TOKENS);
  assert.ok(LEVEL_ESTIMATE_MAX_TOKENS <= 300);
  assert.equal(LEVEL_ESTIMATE_TIMEOUT_MS, 10_000);
});
test('404-first: flag off, bad body, unknown / ended / closed session, partner without levelCheck', async () => {
  let called = 0;
  const counting = (o: Partial<LevelEstimateDeps>) => deps({ ...o, callModel: async () => { called++; return '{}'; } });
  assert.equal((await handleLevelEstimate(BODY, counting({ enabled: false }))).status, 404);
  assert.equal((await handleLevelEstimate({ sessionId: 's1' }, counting({}))).status, 404, 'no answers');
  assert.equal((await handleLevelEstimate({ ...BODY, answers: ['  '] }, counting({}))).status, 404, 'empty answers');
  assert.equal((await handleLevelEstimate({ ...BODY, levels: ['B2'] }, counting({}))).status, 404, 'unknown level');
  assert.equal((await handleLevelEstimate(undefined, counting({}))).status, 404);
  assert.equal((await handleLevelEstimate(BODY, counting({ findSession: async () => null }))).status, 404, 'unknown session');
  assert.equal((await handleLevelEstimate(BODY, counting({ findSession: async () => ({ ...LIVE, status: 'completed' }) }))).status, 404, 'not active');
  assert.equal((await handleLevelEstimate(BODY, counting({ findSession: async () => ({ ...LIVE, endedAt: new Date() }) }))).status, 404, 'ended');
  assert.equal((await handleLevelEstimate(BODY, counting({ findSession: async () => ({ ...LIVE, sourcePartnerId: 'gameclass' }) }))).status, 404, 'partner without levelCheck');
  assert.equal((await handleLevelEstimate(BODY, counting({ findSession: async () => ({ status: 'active' }) }))).status, 404, 'no partner');
  assert.equal(called, 0, 'the model is never called outside the gate');
});
test('budget: past the per-session cap ⇒ 429', async () => {
  const d = deps({ budget: new CallBudget(1) });
  assert.equal((await handleLevelEstimate(BODY, d)).status, 200);
  assert.equal((await handleLevelEstimate(BODY, d)).status, 429);
});
test('model failure / timeout / bad reply ⇒ 200 unavailable (the lesson continues unlevelled)', async () => {
  assert.deepEqual((await handleLevelEstimate(BODY, deps({ callModel: async () => { throw new Error('500'); } }))), { status: 200, body: { status: 'unavailable', reason: 'model_error' } });
  const slow = deps({ timeoutMs: 20, callModel: ({ signal }) => new Promise((_, rej) => signal.addEventListener('abort', () => rej(new Error('aborted')))) });
  assert.deepEqual(await handleLevelEstimate(BODY, slow), { status: 200, body: { status: 'unavailable', reason: 'timeout' } });
  assert.deepEqual(await handleLevelEstimate(BODY, deps({ callModel: async () => 'I think intermediate.' })), { status: 200, body: { status: 'unavailable', reason: 'bad_reply' } });
});
test('reply parsing: fenced JSON ok, level outside `levels` refused, evidence cut to 30 words', () => {
  assert.deepEqual(parseLevelEstimateReply('```json\n{"level":"Beginner","evidence":"short answers"}\n```', ['beginner', 'intermediate', 'advanced']), { level: 'beginner', evidence: 'short answers' });
  assert.equal(parseLevelEstimateReply('{"level":"advanced","evidence":"x"}', ['beginner', 'intermediate']), null);
  assert.equal(parseLevelEstimateReply('{"level":"C1","evidence":"x"}', ['beginner']), null);
  const long = Array.from({ length: 50 }, (_, i) => `w${i}`).join(' ');
  assert.equal(parseLevelEstimateReply(`{"level":"advanced","evidence":"${long}"}`, ['advanced'])!.evidence.split(' ').length, 30);
});
test('body parsing: answers trimmed/capped, levels deduped', () => {
  const b = parseLevelEstimateBody({ sessionId: ' s ', answers: [' a ', '', 3, 'b'], levels: ['intermediate', 'Intermediate'] })!;
  assert.deepEqual(b, { sessionId: 's', answers: ['a', 'b'], levels: ['intermediate'] });
  assert.ok(buildLevelEstimateUserMessage(['x'], ['beginner']).startsWith('Allowed levels: beginner.'));
});
test('client wiring: every advance off a level check with no level asks the route; result applied through the tool path', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(/if \(needsLevelCaptureLead\(plan, fromSegId, !!workingLevelRef\.current\)\) requestLevelEstimateRef\.current\(fromSegId\);/.test(VTR));
  assert.ok(VTR.includes("const decision = applyWorkingLevelRef.current(wl.level, wl.evidence ?? '', 'tool');"), 'tool path');
  assert.ok(VTR.includes("applyWorkingLevelRef.current(d.level, typeof d.evidence === 'string' ? d.evidence : '', 'estimate')"), 'estimate path');
  assert.ok(VTR.includes("source === 'estimate' ? ' source=estimate' : ''"), 'debug working_level_set source=estimate');
  assert.ok(/if \(!TUTOR_WORKING_LEVEL_ESTIMATE \|\| !levelCheckActive \|\| !sessionId \|\| workingLevelRef\.current/.test(VTR), 'gated');
  const route = readFileSync(join(__dirname, '..', 'src/app/api/tutor/level/estimate/route.ts'), 'utf8');
  assert.ok(route.includes("getModelClient('brain')") && route.includes("thinking: { type: 'disabled' as const }") && !/stream/.test(route.replace(/request\.body/g, '')), 'brain model, no thinking, no streaming');
});

void Promise.all(pending).then(() => {
  if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
  console.log('\nall passed');
});
