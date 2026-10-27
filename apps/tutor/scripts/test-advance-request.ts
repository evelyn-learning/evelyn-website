/**
 * A typed request to move on in a lesson (orchestrator/advance-request.ts).
 *
 * Regression under test: lesson portal-fa3e2830 (2026-10-26) — "can we move to
 * the next section?", "no move to the next section", "move on to the next
 * section", "skip", "move on to slope intercept" got "we'll stay on this
 * section", menus of choices, a solved problem to redo and the same problem
 * twice.
 *
 * Run: npx tsx scripts/test-advance-request.ts
 */
import {
  detectAdvanceRequest,
  resolveObjectiveTarget,
  resolveObjectiveMove,
  describeAlreadyOnObjective,
  isAutoAdvancedTurn,
  describeTypedAdvance,
  pacingHintForCue,
  isAdvanceCue,
  ADVANCE_CUE_HINT,
  DIFFICULTY_CUE_HINT,
  OVERLONG_FINISH_FIRST,
  OVERLONG_ADVANCE_NOW,
  overlongNoteForTurn,
} from '../src/lib/tutor/orchestrator/advance-request';

import { readFileSync } from 'node:fs';
import { normalizeIntroGoal, withIntroStart, INTRO_START_CLAUSE } from '../src/lib/tutor/lesson-plan/intro-goal';
import { buildLessonPlanContext } from '../src/lib/tutor/lesson-plan/context';
import { join } from 'node:path';

let failures = 0;
let passed = 0;
function check(name: string, cond: boolean, got?: unknown) {
  if (!cond) { failures++; console.error(`FAIL ${name}${got !== undefined ? ` — got ${JSON.stringify(got)}` : ''}`); }
  else passed++;
}

// ── detection: the production utterances ────────────────────────────────
const OBJECTIVE: Array<[string, string | null]> = [
  ['3/2. can we move to the next section?', null],
  ['no move to the next section', null],
  ['move on to the next section', null],
  ['skip', null],
  ['Skip.', null],
  ['skip ahead please', null],
  ['skip this section', null],
  ['next topic', null],
  ["let's go to the next objective", null],
  ['I want to move on to the next part', null],
  ['move on to slope intercept', 'slope intercept'],
  ['can we skip to the quadratic formula?', 'quadratic formula'],
  ['ok, jump ahead to graphing', 'graphing'],
];
for (const [text, named] of OBJECTIVE) {
  const r = detectAdvanceRequest(text);
  check(`objective: "${text}"`, r?.scope === 'objective' && r.named === named, r);
}
const ONWARD = ['move on', "let's move on", 'can we move on?', 'next', 'keep going'];
for (const text of ONWARD) {
  const r = detectAdvanceRequest(text);
  check(`onward: "${text}"`, r?.scope === 'onward' && r.named === null, r);
}
const NONE = [
  "don't skip this section",
  'wait, not the next section yet',
  'what comes next?',
  'can you help me with 4(m + 3) = 2m - 6',
  'move on to the next problem',
  'move on to the next one',
  'skip this one',
  'how do I skip count by fives?',
  'tell me about types of slope',
  'is that how we did the previous problem too?',
  'move on to 4x + 2 = 10',
  '',
];
for (const text of NONE) check(`none: "${text}"`, detectAdvanceRequest(text) === null, detectAdvanceRequest(text));

// ── resolution to the next / named objective ─────────────────────────────
const P = 'gen-x';
const plan = {
  segments: [
    { id: 'intro', kind: 'hook' },
    { id: `${P}.lo-1-hook`, kind: 'hook' }, { id: `${P}.lo-1-concept`, kind: 'concept' }, { id: `${P}.lo-1-try`, kind: 'try_yourself' },
    { id: `${P}.lo-2-hook`, kind: 'hook' }, { id: `${P}.lo-2-try`, kind: 'try_yourself' },
    { id: `${P}.lo-3-hook`, kind: 'hook' }, { id: `${P}.lo-3-concept`, kind: 'concept' },
    { id: `${P}.lo-4-hook`, kind: 'hook' }, { id: `${P}.lo-4-try`, kind: 'try_yourself' },
    { id: 'recap', kind: 'recap' },
  ],
  los: [
    { id: `${P}.lo-1`, description: 'Define slope as the rate of change, rise over run, between two points.' },
    { id: `${P}.lo-2`, description: 'Calculate slope from two points using the slope formula.' },
    { id: `${P}.lo-3`, description: 'Identify positive, negative, zero, and undefined slopes from graphs.' },
    { id: `${P}.lo-4`, description: 'Find the slope and y-intercept from an equation in slope-intercept form.' },
  ],
};
check('next objective from the middle of LO-1 → first segment of LO-2',
  resolveObjectiveTarget(plan, `${P}.lo-1-concept`, null) === `${P}.lo-2-hook`, resolveObjectiveTarget(plan, `${P}.lo-1-concept`, null));
check('next objective from intro → first segment of LO-1', resolveObjectiveTarget(plan, 'intro', null) === `${P}.lo-1-hook`);
check('next objective from the last LO → recap', resolveObjectiveTarget(plan, `${P}.lo-4-try`, null) === 'recap');
check('from recap → nothing', resolveObjectiveTarget(plan, 'recap', null) === null);
check('named "slope intercept" from LO-2 → LO-4, not LO-3',
  resolveObjectiveTarget(plan, `${P}.lo-2-try`, 'slope intercept') === `${P}.lo-4-hook`, resolveObjectiveTarget(plan, `${P}.lo-2-try`, 'slope intercept'));
check('named "undefined slopes" → LO-3', resolveObjectiveTarget(plan, `${P}.lo-1-hook`, 'undefined slopes') === `${P}.lo-3-hook`);
check('a name nothing carries → null (the brain handles it)', resolveObjectiveTarget(plan, `${P}.lo-1-hook`, 'photosynthesis') === null);
check('off-topic segments are never landed on', resolveObjectiveTarget({
  segments: [{ id: `${P}.lo-1-hook` }, { id: `${P}.lo-2-hook`, offTopic: true }, { id: `${P}.lo-3-hook` }],
}, `${P}.lo-1-hook`, null) === `${P}.lo-3-hook`);

// ── Round 3 (Haiku 5.5, lesson portal-939d545b, 10-27) ───────────────────
{
  const Q = 'gen-6f0109e0';
  const real = {
    segments: [
      { id: 'intro', kind: 'hook' },
      { id: `${Q}.lo-1-hook`, kind: 'hook' }, { id: `${Q}.lo-1-concept`, kind: 'concept' },
      { id: `${Q}.lo-2-hook`, kind: 'hook' }, { id: `${Q}.lo-2-try`, kind: 'try_yourself' },
      { id: `${Q}.lo-3-hook`, kind: 'hook' }, { id: `${Q}.lo-3-try`, kind: 'try_yourself' },
      { id: `${Q}.lo-4-hook`, kind: 'hook' }, { id: `${Q}.lo-4-try`, kind: 'try_yourself' },
      { id: 'recap', kind: 'recap' },
    ],
    los: [
      { id: `${Q}.lo-1`, description: 'Define slope as the rate of change between two points on a line.' },
      { id: `${Q}.lo-2`, description: 'Compute slope from two points using the rise-over-run formula.' },
      { id: `${Q}.lo-3`, description: 'Interpret positive, negative, zero, and undefined slopes.' },
      { id: `${Q}.lo-4`, description: 'Identify slope from the equation of a line in slope-intercept form.' },
    ],
  };
  // "move on to slope intercept form" on objective 4 went BACK to objective 1:
  // "slope" is in every objective, and the current one was never scored.
  const here = resolveObjectiveMove(real, `${Q}.lo-4-hook`, 'slope intercept form');
  check('named objective already in progress → already (never back to objective 1)', here?.kind === 'already' && here.target === `${Q}.lo-4-hook`, here);
  check('…and resolveObjectiveTarget does not move', resolveObjectiveTarget(real, `${Q}.lo-4-hook`, 'slope intercept form') === null);
  const ahead = resolveObjectiveMove(real, `${Q}.lo-2-try`, 'slope intercept form');
  check('named later objective → move there', ahead?.kind === 'move' && ahead.target === `${Q}.lo-4-hook`, ahead);
  check('a name matching only an EARLIER objective → nothing (never backwards)', resolveObjectiveMove(real, `${Q}.lo-3-hook`, 'rate of change') === null, resolveObjectiveMove(real, `${Q}.lo-3-hook`, 'rate of change'));
  check('a name of words every objective carries → stay (already)', resolveObjectiveMove(real, `${Q}.lo-2-hook`, 'slope')?.kind === 'already');
  check('skip on objective 2 → objective 3', resolveObjectiveMove(real, `${Q}.lo-2-hook`, null)?.target === `${Q}.lo-3-hook`);
  check('skip on objective 3 → objective 4', resolveObjectiveMove(real, `${Q}.lo-3-hook`, null)?.target === `${Q}.lo-4-hook`);
  const already = describeAlreadyOnObjective({ named: 'slope intercept form', target: `${Q}.lo-4-hook`, objective: real.los[3].description });
  check('already-here fact: bracketed, continue it, never go back', already.startsWith('[') && already.endsWith(']') && /ALREADY on that objective/.test(already) && /never go back to an earlier objective/i.test(already) && /Do NOT call advance_lesson/.test(already), already);
  const f = describeTypedAdvance({ target: `${Q}.lo-3-hook`, kind: 'hook' });
  check('advance fact: say you are moving on, never that you are staying', /never say you are staying/i.test(f), f);
  check('isAutoAdvancedTurn: the fact behind other notes', isAutoAdvancedTurn(`[board-anchor note — not from the student] x\n\n${f}\n\nno move to the next section`));
  check('isAutoAdvancedTurn: the already-here fact', isAutoAdvancedTurn(already));
  check('isAutoAdvancedTurn: a plain student turn', !isAutoAdvancedTurn('no move to the next section'));
}

// ── Round 3: the lesson starts objective 1 — it does not ask which ───────
{
  const legacy = "Acknowledge the student's pick of 4 learning objectives, list them in the planned order in 1 sentence, and propose starting with the first one. Stay brief — under 25 spoken words.";
  const fixed = normalizeIntroGoal(legacy);
  check('stored intro goal: no "propose"', !/propose starting/.test(fixed) && fixed.includes(INTRO_START_CLAUSE), fixed);
  check('intro clause forbids asking the student to choose', /never ask the student to choose or confirm where to start/.test(INTRO_START_CLAUSE));
  const seg = { id: 'intro', kind: 'hook', goal: legacy };
  check('withIntroStart: rewrites a copy, never the stored object', withIntroStart(seg).goal === fixed && seg.goal === legacy);
  const other = { id: 'x', kind: 'hook', goal: 'Hook the student.' };
  check('withIntroStart: other goals are the same object', withIntroStart(other) === other);
  const ctx = buildLessonPlanContext({ id: 'gen-1', title: 'T', grade: '8', subject: 'math', curriculum: 'x', los: [], estimatedMinutes: 10, schemaVersion: 1, segments: [seg] } as never, 'intro');
  check('the brain reads the rewritten intro goal', (ctx?.currentSegment as { goal?: string } | undefined)?.goal === fixed, ctx?.currentSegment);
  for (const f of ['src/app/api/portal/v1/plan-generate/route.ts', 'src/app/api/tutor/plan-from-text/route.ts', 'src/lib/tutor/lesson-plan/expand.ts', 'src/lib/tutor/lesson-plan/generate-from-text.ts']) {
    const src = readFileSync(join(__dirname, '..', f), 'utf8');
    check(`new plans (${f}): intro starts with the first one`, !src.includes('propose starting with the first one') && src.includes(INTRO_START_CLAUSE));
  }
}

// ── what the brain reads ─────────────────────────────────────────────────
{
  const f = describeTypedAdvance({ target: `${P}.lo-2-hook`, kind: 'hook', objective: 'Calculate slope from two points.' });
  check('fact is bracketed and says the advance is done', f.startsWith('[Lesson auto-advanced: the student asked to move on') && f.endsWith(']') && /Do NOT call advance_lesson/.test(f), f);
  check('fact: verdict first when the message also answers', /also answers your last question, give the verdict/.test(f));
  check('fact: no choices, no re-posed solved problem', /Do not offer choices/.test(f) && /already solved/.test(f));
}
check('advance cues', ['skip', 'next', 'move on', 'skip this'].every(isAdvanceCue));
check('difficulty / pace cues are not advance cues', !['too fast', 'easy', 'boring', 'i know this', 'slow down', 'faster'].some(isAdvanceCue));
check('advance cue → move-on hint, no menu', pacingHintForCue('skip') === ADVANCE_CUE_HINT && !/offer/.test(ADVANCE_CUE_HINT) && /no choices or menu/.test(ADVANCE_CUE_HINT));
check('difficulty cue → the offer (unchanged text)', pacingHintForCue('too fast') === DIFFICULTY_CUE_HINT && /verbally offer "harder \/ skip \/ different topic" immediately/.test(DIFFICULTY_CUE_HINT));
{
  const note = `[runtime note — not from the student] You have spent 6 turns in the "s" (concept) segment without advancing. ${OVERLONG_FINISH_FIRST}Call advance_lesson.`;
  check('overlong note unchanged when the student did not ask', overlongNoteForTurn(note, false) === note);
  const moved = overlongNoteForTurn(note, true);
  check('overlong note: "finish first" replaced when the student asked to move on', !moved.includes('First finish the problem in play') && moved.includes(OVERLONG_ADVANCE_NOW), moved);
}
for (const s of [ADVANCE_CUE_HINT, OVERLONG_ADVANCE_NOW, describeTypedAdvance({ target: 't' })]) {
  check('generic wording (no subject words)', !/slope|intercept|equation|fraction|chemistry/i.test(s), s);
}

// ── wiring (source): the browser orchestrator uses all of the above ───────
{
  const src = readFileSync(join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('wiring: typed request detected and resolved before the brain call', /detectAdvanceRequest\(transcript\)/.test(src) && /resolveObjectiveMove\(advPlan, advFrom, advanceRequest\.named\)/.test(src) && /describeAlreadyOnObjective\(/.test(src) && /pendingBoardAnchorNoteRef\.current = null;\n\s*pendingNoAdvanceNoteRef\.current = null;/.test(src) && /applyResolvedAdvance\(advPlan, advFrom, advTarget\)/.test(src));
  check('wiring: the fact rides the brain transcript', /if \(typedAdvanceFact\) runTranscript = `\$\{typedAdvanceFact\}/.test(src));
  check('wiring: an advanced turn carries no pace hint', /const cueMatch = !hasButtonMarker && !typedAdvanceFact/.test(src));
  check('wiring: a move-on turn delivers the overlong note without "finish first"', /askedToMoveOn \|\| runtimeNoteHeldTurnsRef/.test(src) && /overlongNoteForTurn\(pendingRuntimeNoteRef\.current, askedToMoveOn\)/.test(src));
  check('wiring: the planted note uses the shared "finish first" text', src.includes('`${OVERLONG_FINISH_FIRST}${nextHint} `'));
  const brain = readFileSync(join(__dirname, '../src/lib/tutor/voice/claude-brain.ts'), 'utf8');
  check('wiring: the pace hint is split by cue kind', /pacingHintForCue\(state\.cue\)/.test(brain));
}

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log(`test:advance-request PASS (${passed} checks)`);
