/**
 * Task 16 (GDI live, embed-1793326847152): a fixed-script tutor turn that
 * announces the move into the NEXT part ("Now let's move on to the open
 * conversation.") moves the pointer — announced-move.ts.
 *
 * Run: npx tsx scripts/test-announced-move.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { announcedMoveTarget, MOVE_PHRASE_RE, segmentKeywords } from '../src/lib/tutor/lesson-plan/announced-move';
import { fixedScriptAnnouncedAdvanceLead } from '../src/lib/tutor/lesson-plan/fixed-script';
import type { LessonPlan, Segment } from '../src/lib/tutor/lesson-plan/types';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}

const seg = (id: string, kind: string, label: string, ja: string, extra: Record<string, unknown> = {}) =>
  ({ id, kind, metadata: { label, labelLocalized: { ja }, maxTurns: 6, ...extra } }) as unknown as Segment;
const SEGMENTS: Segment[] = [
  seg('overview', 'hook', 'Overview', '概要'),
  seg('level-check', 'misconception_check', 'Level check', 'レベルチェック', { skipWhenLevelKnown: true }),
  seg('topic-intro', 'concept', 'Your job', '仕事について'),
  seg('present-perfect', 'try_yourself', 'Present perfect', '現在完了'),
  seg('past-simple', 'try_yourself', 'Past simple', '過去形'),
  seg('open-conversation', 'extension', 'Conversation', '会話'),
  seg('pronunciation', 'try_yourself', 'Pronunciation', '発音'),
  seg('summary', 'recap', 'Summary', 'まとめ'),
];
const plan = (fixedScript: boolean) =>
  ({ id: 'test.announced', title: 'T', segments: SEGMENTS, metadata: fixedScript ? { fixedScript: true } : {} }) as unknown as LessonPlan;
const FIXED = plan(true);
const at = (tutorText: string, currentSegmentId: string, p: LessonPlan = FIXED, levelKnown = true) =>
  announcedMoveTarget({ tutorText, plan: p, currentSegmentId, levelKnown });

const LIVE = "Yes, that's correct. I went to a trade show last year is a good past simple sentence. Now let's move on to the open conversation.";

test('the live sentence from past-simple ⇒ open-conversation', () => {
  assert.equal(at(LIVE, 'past-simple'), 'open-conversation');
});
test('"Let\'s move on to the present perfect now." from topic-intro ⇒ present-perfect', () => {
  assert.equal(at("Let's move on to the present perfect now.", 'topic-intro'), 'present-perfect');
});
test('the same sentence from past-simple ⇒ null (not the next segment — never a jump)', () => {
  assert.equal(at("Let's move on to the present perfect now.", 'past-simple'), null);
});
test('"Now let\'s move on." ⇒ null (no keyword)', () => {
  assert.equal(at("Now let's move on.", 'past-simple'), null);
});
test('次は会話に進みましょう。 from past-simple ⇒ open-conversation', () => {
  assert.equal(at('次は会話に進みましょう。', 'past-simple'), 'open-conversation');
});
test('a non-fixed-script plan ⇒ null', () => {
  assert.equal(at(LIVE, 'past-simple', plan(false)), null);
});
test('"We\'ll talk about the conversation you had with your customer." ⇒ null (no move phrase)', () => {
  assert.equal(at("We'll talk about the conversation you had with your customer.", 'past-simple'), null);
});
test('a sentence naming another part too ⇒ null', () => {
  assert.equal(at("Now let's move on to the conversation, then pronunciation.", 'past-simple'), null);
});
test('curly apostrophe counts', () => {
  assert.equal(at('Now let’s move on to the open conversation.', 'past-simple'), 'open-conversation');
});
test('the last segment ⇒ null (nothing after it)', () => {
  assert.equal(at("Let's move on to the summary.", 'summary'), null);
});
test('level unknown: from overview the next is level-check', () => {
  assert.equal(at("Now let's move on to the level check.", 'overview', FIXED, false), 'level-check');
  assert.equal(at("Now let's move on to the level check.", 'overview', FIXED, true), null);
});
test('MOVE_PHRASE_RE: EN and JA forms', () => {
  for (const s of ["Let's go to the next part", 'Moving on to grammar', "Let's start the conversation", 'Next up is grammar', 'Time to move on to grammar', '会話に移りましょう', 'ロールプレイを始めましょう']) {
    assert.ok(MOVE_PHRASE_RE.test(s), s);
  }
  for (const s of ['We talked about your job.', 'Tell me about your last trip.']) assert.ok(!MOVE_PHRASE_RE.test(s), s);
});
test('segmentKeywords: label, ja label, id words; stopwords out; open kept', () => {
  const k = segmentKeywords(SEGMENTS[5]);
  assert.ok(k.includes('conversation') && k.includes('open') && k.includes('会話'), k.join(','));
  const j = segmentKeywords(SEGMENTS[2]);
  assert.ok(!j.includes('your') && j.includes('job') && j.includes('topic') && j.includes('intro'), j.join(','));
});
test('the real GDI plan: the live sentence from past-simple ⇒ open-conversation', () => {
  const real = JSON.parse(readFileSync(join(__dirname, '..', '..', '..', 'docs/whitelabel/gdi/plans/gdi-work-projects-v1.json'), 'utf8')) as LessonPlan;
  assert.equal(at(LIVE, 'past-simple', real), 'open-conversation');
});

// ── §B wiring pins ───────────────────────────────────────────────────────
const read = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
const pin = (src: string, re: RegExp) => assert.ok(re.test(src), `missing ${re}`);
const VTR = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
const FLAGS = read('src/lib/tutor/orchestrator/flags.ts');
test('B: flag default ON', () => {
  pin(FLAGS, /export const TUTOR_FIXED_SCRIPT_ANNOUNCED_ADVANCE = process\.env\.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_ANNOUNCED_ADVANCE !== 'off';/);
});
test('B: the announced lead (brief text)', () => {
  assert.equal(
    fixedScriptAnnouncedAdvanceLead('past-simple', 'open-conversation', 'extension'),
    'The "past-simple" part is over — you announced the move yourself — and the lesson pointer has ALREADY moved to segment "open-conversation" (extension).',
  );
});
test('B: VTR — only when the budget rule did not fire, flag on, no advance_lesson, not homework; the NEXT segment only', () => {
  pin(VTR, /const announcedTarget = !autoReason && TUTOR_FIXED_SCRIPT_ANNOUNCED_ADVANCE && !homeworkSession && autoPlan && !opts\?\.prefetchOnly\s*&& !totalToolNamesSeen\.includes\('advance_lesson'\)\s*\? announcedMoveTarget\(\{ tutorText: fullText, plan: autoPlan, currentSegmentId: segIdNow, levelKnown: !!workingLevelRef\.current \}\)/);
  pin(VTR, /\?\? \(announcedTarget && autoPlan && announcedTarget === nextSegmentId\(autoPlan, segIdNow, !!workingLevelRef\.current\) \? 'announced' : null\)/);
  // the same advance path (pron hold, applyResolvedAdvance, FACT note) runs on advanceReason
  pin(VTR, /if \(!advanceReason\) autoAdvancePronHeldRef\.current = 0;\n\s*if \(autoPlan && advanceReason\) \{/);
  pin(VTR, /reason=\$\{advanceReason\} turns=/);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall announced-move tests passed');
