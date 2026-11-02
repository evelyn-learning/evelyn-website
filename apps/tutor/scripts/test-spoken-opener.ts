/**
 * Task 14 §A — client-spoken opening script (lesson-plan/spoken-opener.ts)
 * and the shared sentence boundary (voice/sentence-spacing.ts).
 *
 * Run: npx tsx scripts/test-spoken-opener.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fixedScriptSpokenOpener, spokenOpenerAdvanceLead, proactiveOpenerAllowed, OPENER_PLAN_WAIT_MAX_MS } from '../src/lib/tutor/lesson-plan/spoken-opener';
import { splitIntoSpokenSentences, matchSentenceBoundary } from '../src/lib/tutor/voice/sentence-spacing';
import { SentenceBuffer } from '../src/lib/tutor/voice/claude-brain';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}
const read = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
const pin = (src: string, re: RegExp) => assert.ok(re.test(src), `missing ${re}`);

const SCRIPT = "Hello, and welcome to your English lesson! Today we'll practise talking about your work. We'll practise the present perfect and the past simple. 今日は、仕事について英語で話す練習をしましょう。 Are you ready?";
const RAW = {
  id: 'test.spoken-opener', title: 'T', curriculum: 'test', grade: 'adult', subject: 'languages', estimatedMinutes: 10,
  metadata: { fixedScript: true },
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2, metadata: { script: SCRIPT } },
    { id: 'level-check', kind: 'misconception_check', question: 'Tell me about your work.', misconception: 'n/a', metadata: { skipWhenLevelKnown: true } },
    { id: 'topic-intro', kind: 'concept', goal: 'Teach', keyIdeas: ['a'], estimatedMinutes: 1 },
  ],
};
const plan: LessonPlan = parseLessonPlan(RAW);

test('splitter: English sentences, the Japanese sentence on its own, the short tail kept', () => {
  assert.deepEqual(splitIntoSpokenSentences(SCRIPT), [
    'Hello, and welcome to your English lesson!',
    "Today we'll practise talking about your work.",
    "We'll practise the present perfect and the past simple.",
    '今日は、仕事について英語で話す練習をしましょう。',
    'Are you ready?',
  ]);
  assert.deepEqual(splitIntoSpokenSentences('  '), []);
  assert.deepEqual(splitIntoSpokenSentences('Say hello to Ms. Tanaka from the sales team today.'), ['Say hello to Ms. Tanaka from the sales team today.'], 'abbreviation tail is not a boundary');
});
test('splitter = the brain stream: SentenceBuffer yields the same sentences (push + flush)', () => {
  const b = new SentenceBuffer();
  const got = [...b.push(SCRIPT)];
  const rest = b.flush();
  if (rest) got.push(rest);
  assert.deepEqual(got, splitIntoSpokenSentences(SCRIPT));
  assert.equal(matchSentenceBoundary('Short.  '), null, 'under the minimum length');
});
test('opener: first segment script, next = level check while the level is unknown', () => {
  const o = fixedScriptSpokenOpener(plan, false)!;
  assert.equal(o.segmentId, 'overview');
  assert.equal(o.script, SCRIPT);
  assert.equal(o.sentences.length, 5);
  assert.equal(o.next, 'level-check');
});
test('opener: a known level hands over to the part after the level check', () => {
  assert.equal(fixedScriptSpokenOpener(plan, true)!.next, 'topic-intro');
});
test('opener: none for a non-fixed plan, a missing/empty script, or a first segment skipped for a known level', () => {
  assert.equal(fixedScriptSpokenOpener({ ...plan, metadata: {} }, false), null);
  assert.equal(fixedScriptSpokenOpener(null, false), null);
  const noScript = { ...plan, segments: plan.segments.map((s, i) => (i === 0 ? { ...s, metadata: {} } : s)) } as LessonPlan;
  assert.equal(fixedScriptSpokenOpener(noScript, false), null);
  const blank = { ...plan, segments: plan.segments.map((s, i) => (i === 0 ? { ...s, metadata: { script: '   ' } } : s)) } as LessonPlan;
  assert.equal(fixedScriptSpokenOpener(blank, false), null);
  const skipFirst = { ...plan, segments: plan.segments.map((s, i) => (i === 0 ? { ...s, metadata: { script: SCRIPT, skipWhenLevelKnown: true } } : s)) } as LessonPlan;
  assert.equal(fixedScriptSpokenOpener(skipFirst, true), null);
});
test('advance lead: a FACT naming the part, its last sentence and the next segment', () => {
  const o = fixedScriptSpokenOpener(plan, false)!;
  const lead = spokenOpenerAdvanceLead(o, 'level-check', 'misconception_check');
  assert.ok(lead.includes('ALREADY spoken the "overview" part'));
  assert.ok(lead.includes('it ended with "Are you ready?"'));
  assert.ok(lead.includes('ALREADY moved to segment "level-check" (misconception_check)'));
});
test('VTR wiring: flag-gated, speaks each sentence through speakText, paints the outline, advances with the FACT note, skips the prefetch and the phrase check', () => {
  const VTR = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
  pin(VTR, /const spokenOpener = TUTOR_FIXED_SCRIPT_SPOKEN_OPENER && claudeBrainMode && !resumeState && !isInFlow/);
  pin(VTR, /for \(const line of spokenOpener\.sentences\) \{\s*try \{ realtime\.speakText\(line, pushTtsScriptForPerception\(line\)\); \}/);
  pin(VTR, /onDebugEvent\?\.\('fixed_script_spoken_opener', `sentences=\$\{spokenOpener\.sentences\.length\}`\);/);
  pin(VTR, /segmentRequiredPhrasesCheckedRef\.current\.add\(spokenOpener\.segmentId\);/);
  pin(VTR, /openingTurnPendingRef\.current = false;\s*for \(const line of spokenOpener\.sentences\)/);
  pin(VTR, /applyResolvedAdvance\(spokenOpenerPlan, spokenOpener\.segmentId, next\);/);
  pin(VTR, /pendingRuntimeNoteRef\.current = fixedScriptAdvancedNote\(spokenOpenerAdvanceLead\(spokenOpener, next, nextKind\), next\);\s*pendingRuntimeNoteSegRef\.current = next;\s*pendingRuntimeNoteUrgentRef\.current = true;/);
  pin(VTR, /'opener_prefetch_skipped', 'fixed script: the client speaks the opening script'/);
  // outline first, then the advance
  assert.ok(VTR.indexOf("(spoken opener)`);") < VTR.indexOf('applyResolvedAdvance(spokenOpenerPlan, spokenOpener.segmentId, next);'));
  pin(read('src/lib/tutor/orchestrator/flags.ts'), /export const TUTOR_FIXED_SCRIPT_SPOKEN_OPENER = process\.env\.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_SPOKEN_OPENER !== 'off';/);
});

// ── Task 30 fix round 6 R5-1: the opener never runs without an expected plan ──
test('R5-1: proactiveOpenerAllowed — wait for the expected plan (and a fixed script\'s prompt), bounded at 4 s', () => {
  const base = { planExpected: true, planLoaded: false, fixedScript: false, promptReady: false, waitedMs: 0 };
  assert.equal(OPENER_PLAN_WAIT_MAX_MS, 4000);
  assert.equal(proactiveOpenerAllowed(base), false, 'r5: the tap before the plan landed ⇒ wait');
  assert.equal(proactiveOpenerAllowed({ ...base, waitedMs: 3999 }), false);
  assert.equal(proactiveOpenerAllowed({ ...base, waitedMs: 4000 }), true, 'bounded');
  assert.equal(proactiveOpenerAllowed({ ...base, planLoaded: true, fixedScript: true, promptReady: false, waitedMs: 1000 }), false, 'fixed script, prompt not ready ⇒ wait');
  assert.equal(proactiveOpenerAllowed({ ...base, planLoaded: true, fixedScript: true, promptReady: true, waitedMs: 1000 }), true, 'plan + prompt ⇒ the spoken opener runs');
  assert.equal(proactiveOpenerAllowed({ ...base, planLoaded: true, fixedScript: false, waitedMs: 0 }), true, 'a non-fixed plan ⇒ now');
  assert.equal(proactiveOpenerAllowed({ ...base, planExpected: false }), true, 'no plan id (free conversation) ⇒ now');
  const VTR = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
  pin(VTR, /const runStartOpener = \(\): void => \{\n\s+const spokenOpenerPlan = lessonPlanRef\.current;/);
  pin(VTR, /planExpected: !!lessonPlanId && !resumeState,/);
  pin(VTR, /onDebugEvent\?\.\('opener_waits_for_plan',/);
  pin(read('src/lib/tutor/orchestrator/flags.ts'), /export const TUTOR_OPENER_WAITS_FOR_PLAN = process\.env\.NEXT_PUBLIC_TUTOR_OPENER_WAITS_FOR_PLAN !== 'off';/);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
