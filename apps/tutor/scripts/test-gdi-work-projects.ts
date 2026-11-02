/**
 * GDI trial lesson plan (2026-10-28): docs/whitelabel/gdi/plans/gdi-work-projects-v1.json
 * — Josh's "Talking About Your Work and Recent Projects", 25 min, bilingual.
 * Parses the authored JSON through the REAL parser and pins the structure the
 * engine relies on (fixed script, level-check skip, three level variants,
 * pronunciation targets, recap phrase) plus the behaviour notes the design's
 * anti-goals depend on.
 *
 * Run: npx tsx scripts/test-gdi-work-projects.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { initialSegmentId, nextSegmentId, isFixedScriptPlan, fixedScriptCloseAllowed, fixedScriptLastSegmentId } from '../src/lib/tutor/lesson-plan/fixed-script';
import type { LessonPlan, Segment } from '../src/lib/tutor/lesson-plan/types';
import { fixedScriptSpokenOpener } from '../src/lib/tutor/lesson-plan/spoken-opener';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}

const PLAN_PATH = join(__dirname, '..', '..', '..', 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json');
let plan: LessonPlan;
try {
  plan = parseLessonPlan(JSON.parse(readFileSync(PLAN_PATH, 'utf8')));
} catch (e) {
  console.log(`  FAIL load + parse ${PLAN_PATH}\n       ${(e as Error).message}`);
  process.exit(1);
}
const seg = (id: string): Segment => {
  const s = plan.segments.find((x) => x.id === id);
  assert.ok(s, `segment ${id} missing`);
  return s!;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const field = (s: Segment, k: string): any => (s as any)[k];
const lower = (s: string | undefined) => (s ?? '').toLowerCase();

const IDS = ['overview', 'level-check', 'topic-intro', 'present-perfect', 'past-simple', 'open-conversation', 'pronunciation', 'summary'];
const KINDS = ['hook', 'misconception_check', 'concept', 'try_yourself', 'try_yourself', 'extension', 'try_yourself', 'recap'];
const MINUTES = [2, 3, 3, 3.5, 3.5, 5, 3, 2];

test('plan identity: id, subject, fixedScript, partner', () => {
  assert.equal(plan.id, 'gdi.trial.english.work-projects.v1');
  assert.equal(plan.subject, 'languages');
  assert.equal(plan.metadata?.fixedScript, true);
  assert.equal(plan.metadata?.partner, 'gdi-demo');
  assert.equal(isFixedScriptPlan(plan), true);
  assert.equal(plan.estimatedMinutes, 25);
});

test('8 segments in the exact id + kind order', () => {
  assert.deepEqual(plan.segments.map((s) => s.id), IDS);
  assert.deepEqual(plan.segments.map((s) => s.kind), KINDS);
});

test('minutes 2/3/3/3.5/3.5/5/3/2, sum 25', () => {
  assert.deepEqual(plan.segments.map((s) => s.estimatedMinutes), MINUTES);
  assert.equal(plan.segments.reduce((a, s) => a + (s.estimatedMinutes ?? 0), 0), 25);
});

test('every segment has a teacherNote', () => {
  for (const s of plan.segments) assert.ok((s.teacherNote ?? '').length > 40, `${s.id} teacherNote`);
});

test('overview names both grammar points (requiredPhrases)', () => {
  const rp = (seg('overview').requiredPhrases ?? []).map(lower);
  assert.ok(rp.includes('present perfect'), 'present perfect');
  assert.ok(rp.includes('past simple'), 'past simple');
  assert.match(lower(field(seg('overview'), 'script')), /present perfect/);
  assert.match(lower(field(seg('overview'), 'script')), /past simple/);
  // The script is spoken to returning learners too, whose level check is
  // skipped: it must not presume the check; the conditional lives in the note.
  assert.doesNotMatch(lower(field(seg('overview'), 'script')), /level|check|assess/);
  const n = seg('overview').teacherNote ?? '';
  assert.match(n, /If the learner's level is not yet known, say just before the closing question that the short one-time level check comes next/);
  // Task 13 (run 3): the overview closes with "Are you ready?" and never asks about the job
  assert.match(n, /Close the overview with exactly "Are you ready\?" and nothing after it\./);
  assert.match(n, /NEVER ask about the learner's job or work in the overview/);
  assert.ok(n.trim().endsWith('When they say they are ready, advance to the next segment.'));
  assert.match(n, /if it is already known, say instead that you'll continue at that level and move on/);
  assert.match(n, /if the level is already known and it is beginner, give the overview in short Japanese, keeping the grammar names in English/i);
});

test('level check: all three questions on the card, Q1 first, skip flag, once-only set_working_level', () => {
  const s = seg('level-check');
  const q = field(s, 'question').split('\n');
  assert.equal(q.length, 3);
  assert.equal(q[0], '1. Can you tell me a little about your job? What do you do?');
  assert.match(q[1], /^2\. Have you ever worked with an international customer\?/);
  assert.match(q[2], /^3\. What is one skill you'd like to improve in your English/);
  assert.match(s.teacherNote ?? '', /Ask these three questions in this order, one per turn; after the third answer, call set_working_level\(\{level\}\) in the same turn as your soft focus line, then advance_lesson\(\{to:"next"\}\)\./);
  assert.equal(s.metadata?.skipWhenLevelKnown, true);
  const n = s.teacherNote ?? '';
  assert.match(n, /set_working_level/);
  assert.match(n, /ONCE/);
  assert.match(n, /international customer/);
  assert.match(n, /skill you'd like to improve/);
  assert.match(lower(n), /no corrections/);
  assert.match(lower(n), /cefr/); // the "no CEFR, no score" rule is spelled out
  // Task 30 fix round 4 (Q-9): the soft line names the focus, never the level (259e2dc1).
  assert.ok(n.includes('never name a level'));
  assert.ok(n.includes('soft focus line'));
  assert.ok(n.includes('Do not ask grammar questions'));
  assert.ok(!n.includes('suggest the level'));
});

test('fixed-script navigation: known level skips only the level check', () => {
  assert.equal(initialSegmentId(plan, true), 'overview');
  assert.equal(nextSegmentId(plan, 'overview', true), 'topic-intro');
  assert.equal(nextSegmentId(plan, 'overview', false), 'level-check');
  assert.equal(plan.segments.filter((s) => s.metadata?.skipWhenLevelKnown === true).length, 1);
});

test('topic intro: three variants, every keyIdea labelled, teach only one', () => {
  const ki = field(seg('topic-intro'), 'keyIdeas') as string[];
  for (const lvl of ['beginner', 'intermediate', 'advanced']) {
    assert.ok(ki.some((k) => k.startsWith(`[${lvl}] `)), `[${lvl}] line`);
  }
  for (const k of ki) assert.match(k, /^\[(beginner|intermediate|advanced)\] /, `unlabelled keyIdea: ${k}`);
  assert.match(lower(seg('topic-intro').teacherNote), /only/);
  const tn = seg('topic-intro').teacherNote ?? '';
  // The board card is filtered by level now (and auto-rendered on advance):
  // the note must not forbid it.
  assert.doesNotMatch(tn, /not call show_segment_card/i);
  assert.match(tn, /If no working level was set, use the \[intermediate\] version\./);
});

test('grammar conversations: free response, open problem, A→C→E→P→C rubric', () => {
  for (const id of ['present-perfect', 'past-simple']) {
    const s = seg(id);
    assert.equal(field(s, 'responseFormat'), 'free', id);
    assert.ok(lower(field(s, 'problem')).endsWith('?'), `${id} problem is a spoken question`);
    assert.equal(field(s, 'expectedAnswer'), undefined, `${id} has no single answer`);
    assert.match(s.teacherNote ?? '', /Acknowledge → Correct → Explain → Practice → Continue/, id);
    assert.match(lower(s.teacherNote), /let the rest pass/, id);
  }
});

test('open conversation: proud-project question is the problem truth', () => {
  const s = seg('open-conversation');
  assert.equal(field(s, 'advancedQuestion'), "What is one project you've worked on that you're particularly proud of?");
  assert.match(lower(s.teacherNote), /ask me/);
});

test('open conversation (final review #5): a mid-conversation "how do I say…" gets a model, a check, ONE point, then back', () => {
  const n = seg('open-conversation').teacherNote ?? '';
  assert.ok(n.includes('If the learner asks how to say a word or sentence, model it (its own English-only sentence), call request_pronunciation_check if that tool is available, give ONE point, then return to the conversation exactly where you left it.'), n);
});

test('pronunciation: targets in metadata, four options, measured-only feedback', () => {
  const s = seg('pronunciation');
  assert.deepEqual(s.metadata?.pronunciation, {
    words: ['responsibilities', 'international', 'communicate', 'customers', 'developed'],
    sentences: ['I have worked with international customers for several years.', 'I was responsible for communicating with our customers.'],
  });
  const n = s.teacherNote ?? '';
  assert.match(n, /request_pronunciation_check/);
  assert.match(lower(n), /skip/);
  assert.match(lower(n), /only check the words/);
  assert.match(n, /if that tool is available in this session/);
  // Final review #3: the TTS voice is picked per sentence — a model line with
  // any Japanese in it would be voiced by the Japanese voice.
  // Task 29 fix round 1 (I-5): instruction first, the model text as its own English-only LAST sentence.
  assert.ok(n.includes('say the model text exactly, in English, as the LAST sentence of your turn — its own sentence, English only, no Japanese in it (the voice switches per sentence).'), n);
  for (const w of ['responsibilities', 'international', 'communicate', 'customers', 'developed']) assert.ok(n.includes(w), w);
});

test('summary: "one thing you did well", check question, no stored-summary tool', () => {
  const s = seg('summary');
  assert.ok((s.requiredPhrases ?? []).map(lower).includes('one thing you did well'));
  // bot run r15 (2026-11-02): the brain closed the summary in its first turn without the check question — the phrase gates the close
  assert.ok((s.requiredPhrases ?? []).map(lower).includes('the difference between'));
  const n = s.teacherNote ?? '';
  assert.ok(n.includes('I have worked here for five years'));
  assert.ok(n.includes('I worked here five years ago'));
  assert.match(lower(n), /own sentences/);
});

test('no segment mentions close_session_notes', () => {
  assert.doesNotMatch(readFileSync(PLAN_PATH, 'utf8'), /close_session_notes/);
});

test('Task 13: every segment carries label / labelLocalized.ja / maxTurns; pronunciation optional', () => {
  const want: Record<string, [string, string, number]> = {
    overview: ['Overview', '概要', 2], 'level-check': ['Level check', 'レベルチェック', 5],
    'topic-intro': ['Your job', '仕事について', 4], 'present-perfect': ['Present perfect', '現在完了', 8],
    'past-simple': ['Past simple', '過去形', 8], 'open-conversation': ['Conversation', '会話', 12],
    pronunciation: ['Pronunciation', '発音', 8], summary: ['Summary', 'まとめ', 4],
  };
  assert.deepEqual(plan.segments.map((x) => x.id), Object.keys(want));
  for (const [id, [label, ja, maxTurns]] of Object.entries(want)) {
    const m = seg(id).metadata ?? {};
    assert.equal(m.label, label, `${id} label`);
    assert.deepEqual(m.labelLocalized, { ja }, `${id} labelLocalized`);
    assert.equal(m.maxTurns, maxTurns, `${id} maxTurns`);
    assert.equal(m.optional === true, id === 'pronunciation', `${id} optional`);
  }
  assert.equal(seg('level-check').metadata?.skipWhenLevelKnown, true);
  assert.ok((seg('pronunciation').metadata as { pronunciation?: unknown }).pronunciation, 'pronunciation targets kept');
});

test('Task 14: the overview carries a client-spoken script (≤ 6 sentences, both grammar names, a Japanese line, ends "Are you ready?")', () => {
  const o = fixedScriptSpokenOpener(plan, false);
  assert.ok(o, 'spoken opener');
  assert.equal(o!.segmentId, 'overview');
  assert.ok(o!.sentences.length <= 6, `${o!.sentences.length} sentences`);
  assert.equal(o!.sentences[o!.sentences.length - 1], 'Are you ready?');
  assert.ok(/present perfect/.test(o!.script) && /past simple/.test(o!.script));
  const jaIdx = o!.sentences.findIndex((x) => /[぀-ヿ一-鿿]/.test(x));
  assert.ok(jaIdx > 0 && jaIdx === o!.sentences.length - 2, 'a short Japanese sentence after the English summary');
  assert.ok(o!.sentences[jaIdx].length <= 40, 'short');
  assert.equal(o!.next, 'level-check');
  assert.equal(fixedScriptSpokenOpener(plan, true)!.next, 'topic-intro');
  assert.ok((seg('overview').teacherNote ?? '').length > 0, 'teacherNote kept for flag-off');
});

// ── Task 20 §B1 (GDI run 8, 1543 s): no close before the summary ─────────
test('20B1: the brain may close only from the summary (or after the student asked to stop)', () => {
  assert.equal(fixedScriptLastSegmentId(plan), 'summary');
  assert.equal(fixedScriptCloseAllowed(plan, 'pronunciation'), false);
  assert.equal(fixedScriptCloseAllowed(plan, 'open-conversation'), false);
  assert.equal(fixedScriptCloseAllowed(plan, 'summary'), true);
  assert.equal(fixedScriptCloseAllowed(plan, 'pronunciation', { studentEndSignal: true }), true);
  assert.equal(fixedScriptCloseAllowed(plan, 'no-such-part'), true, 'unknown segment ⇒ never refuse');
  assert.equal(fixedScriptCloseAllowed({ ...plan, metadata: { ...plan.metadata, fixedScript: false } } as LessonPlan, 'pronunciation'), true, 'other plans untouched');
});

test('29E3: the pronunciation note — every item new, instruction first / model text last, no menu after a result', () => {
  const n = seg('pronunciation').teacherNote ?? '';
  assert.ok(n.includes('Every item is NEW: never give a word or sentence the learner has already practised in this part; when the menu\'s items are used up, take a corrected sentence of the learner\'s from earlier in the lesson.'));
  assert.ok(n.includes('For options 1 to 3: give the instruction first ("Listen, then repeat after me:"), then say the model text exactly, in English, as the LAST sentence of your turn'));
  assert.ok(!/say the model text first/i.test(n), 'the old "model text first" order is gone');
  assert.ok(n.endsWith('After a result, do not offer the four options again: work on the weakest word or sound with one more repeat, then ask: one more item, or move on to the summary? If the learner has not chosen an option after you have asked twice, do not ask a third time: say you will skip the practice today and move on to the summary (call advance_lesson).'));
  assert.ok(n.startsWith('Optional pronunciation practice. Offer the four options'), 'the rest of the note kept');
});

test('Task 30 fix round 3 R2-2b: the level check asks only its three questions and teaches nothing', () => {
  const n = seg('level-check').teacherNote ?? '';
  assert.ok(n.endsWith('Ask only these three questions, one at a time; listen and assess silently. Do not ask grammar questions (which tense, which word shows the time) and do not teach here — corrections come later in the lesson.'));
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall gdi-work-projects tests passed');
