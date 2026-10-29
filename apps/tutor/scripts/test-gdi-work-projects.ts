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
import { initialSegmentId, nextSegmentId, isFixedScriptPlan } from '../src/lib/tutor/lesson-plan/fixed-script';
import type { LessonPlan, Segment } from '../src/lib/tutor/lesson-plan/types';

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
  assert.match(n, /If the learner's level is not yet known, end the overview by saying the short one-time level check comes next/);
  assert.match(n, /if it is already known, say instead that you'll continue at that level and move on/);
});

test('level check: Q1 is the problem truth, skip flag, once-only set_working_level', () => {
  const s = seg('level-check');
  assert.equal(field(s, 'question'), 'Can you tell me a little about your job? What do you do?');
  assert.equal(s.metadata?.skipWhenLevelKnown, true);
  const n = s.teacherNote ?? '';
  assert.match(n, /set_working_level/);
  assert.match(n, /ONCE/);
  assert.match(n, /international customer/);
  assert.match(n, /skill you'd like to improve/);
  assert.match(lower(n), /no corrections/);
  assert.match(lower(n), /cefr/); // the "no CEFR, no score" rule is spelled out
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
  for (const w of ['responsibilities', 'international', 'communicate', 'customers', 'developed']) assert.ok(n.includes(w), w);
});

test('summary: "one thing you did well", check question, no stored-summary tool', () => {
  const s = seg('summary');
  assert.ok((s.requiredPhrases ?? []).map(lower).includes('one thing you did well'));
  const n = s.teacherNote ?? '';
  assert.ok(n.includes('I have worked here for five years'));
  assert.ok(n.includes('I worked here five years ago'));
  assert.match(lower(n), /own sentences/);
});

test('no segment mentions close_session_notes', () => {
  assert.doesNotMatch(readFileSync(PLAN_PATH, 'utf8'), /close_session_notes/);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall gdi-work-projects tests passed');
