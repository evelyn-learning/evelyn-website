/**
 * Task 8h (final review I1–I5): the branch's lesson-flow rules apply only where they were designed and tested (a spoken lesson on a
 * labelled plan with part flow: time-box.ts v2PartFlowLesson); every other session keeps main's (origin/main 11843955) behaviour.
 *
 *  1. close: a plan-led lesson without part names closes by main's clock rule (close-heard.ts closeDueMinutes), not when the last
 *     practice card is painted; the labelled plan's parts are done by the branch's own definition (Task 7i), as at 39907cfc.
 *  2. hard stop: the margin (7f F) only for a part-flow lesson, never past the host's own maximum.
 *  3. pool charge: the clamp is raised only by the margin a sitting reports, bounded by the engine's.
 *  4. constitution: main's Ending paragraph; the "pick up here" line is a part-flow lesson's facts line.
 *  5. facts: the opener run line, the question check and the silence-after-ask lines only in a spoken lesson that teaches a
 *     language (note-targets.ts v2NoteTargetsOn); main's lines elsewhere. Main's strings are copied below from
 *     `git show 11843955:apps/tutor/src/lib/tutor/v2/facts.ts` (lines 67, 111-115).
 *
 * Run: npm run test:brain-v2-tenants-8h
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_CLOSE_BY_CONTENT, TUTOR_V2_OVERRUN_MIN, TUTOR_V2_TIME_OVERRUN } from '../src/lib/tutor/orchestrator/flags';
import { V2_NO_PICK_UP_LINE, renderFacts, v2OpenerFact } from '../src/lib/tutor/v2/facts';
import { V2_CONSTITUTION } from '../src/lib/tutor/v2/constitution';
import { v2ClientMarginMin, v2CloseOpen, v2LeftToStopMin, v2MarginMin, v2PartFlowLesson, v2PlanContentDone, v2TimeFlags, v2WrapMin } from '../src/lib/tutor/v2/time-box';
import { DISCUSSION_PLAN_KIND } from '../src/lib/tutor/v2/discussion';
import { sittingOverrunSec } from '../src/lib/tutor/portal/partner-pool-store';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
const say = (text: string, after: unknown[] = []): V2ModelCall => async (_p, onText) => { onText?.(text); return msg([{ type: 'text', text }, ...after], after.length ? 'tool_use' : 'end_turn'); };
const endLesson = [{ type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'plan_complete', summary: 'x' } }];
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
// The spoken bilingual lesson on the labelled plan: the part-flow lesson (20-minute pool box, wrap at 18).
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], plan: GDI };
// portal-50a1e584's plan shape (test-brain-v2): a plan-led maths lesson, no part names.
const planR = { title: 'Relations and functions', estimatedMinutes: 25, los: [{ id: 'lo1', description: 'Tell a function from a relation.' }], segments: [{ id: 'hook', kind: 'hook' }, { id: 'c', kind: 'concept' }, { id: 'w1', kind: 'worked_example', problem: 'Is the relation {(−3, 4), (−1, 0), (2, 4), (5, −6)} a function? State its domain and range.' }, { id: 't2', kind: 'try_yourself', problem: 'If f(x) = 5 − 2x, what is f(−4)?' }, { id: 't3', kind: 'try_yourself', problem: 'The relation {(−5, 2), (−1, 7), (0, 2), (3, 9), (6, 7)} is a function. How many numbers are in its range? Type your answer as a number.' }, { id: 'recap', kind: 'recap' }] } as unknown as LessonPlan;
const maths: V2Session = { studentName: 'Sam', subject: 'Mathematics', level: 'Grade 9', mode: 'voice', timeBoxMinutes: 30, wrapMinutes: 28, plan: planR };
const homework: V2Session = { studentName: 'Sam', subject: 'Mathematics', level: 'Grade 9', mode: 'text', timeBoxMinutes: 20, homework: { text: 'Solve 3x + 2 = 11.', verified: false, hasFigure: false } } as V2Session;
const discussion: V2Session = { studentName: 'Pat', subject: 'Discussion', level: 'adult', mode: 'voice', timeBoxMinutes: 30, plan: { ...planR, metadata: { kind: DISCUSSION_PLAN_KIND, participant: 'a teacher', orientation: 'cars in cities', cases: [{ id: 'c1', scenario: 'A city bans cars.' }] } } as unknown as LessonPlan };

// Main's lines (11843955 facts.ts:67 and :111-115), verbatim.
const MAIN_TIME_FOR_MORE = (n: number) => `about ${n} left, which is time for more: the lesson is not at its close unless the student asks to stop`;
const MAIN_CLOSE_DUE = (n: number) => `about ${n} left: tell the student so now, once and in a few words, then use what is left for the one thing that matters most (finish the step in hand, or say what to take away), and close when that is done. Do not start anything new`;
const MAIN_TIME_UP = 'the time is up: close now, in a sentence or two';
const MAIN_SILENT = (s: number) => `the student has said nothing for ${s} seconds`;
const MAIN_NO_ASK = 'your last reply has finished and it ended on a statement: no question, and nothing for them to do. They are waiting for you to go on';
const factLines = (f: string) => f.replace(/^<facts>\n|\n<\/facts>$/g, '').split('\n');

async function main() {
  console.log('1. the close (I1)');
  {
    check('the gate: the spoken labelled lesson is a part-flow lesson; a maths lesson, a typed labelled lesson, homework and a discussion are not',
      v2PartFlowLesson(lang) && !v2PartFlowLesson(maths) && !v2PartFlowLesson({ ...lang, mode: 'text' }) && !v2PartFlowLesson(homework) && !v2PartFlowLesson(discussion));
    check('a maths lesson: no close by content and no wrap minute, whatever the flag', v2TimeFlags({ closeByContent: true }, maths).closeByContent === false && v2WrapMin(maths) === undefined && v2TimeFlags({}, lang).closeByContent === TUTOR_V2_CLOSE_BY_CONTENT && v2WrapMin(lang) === 18);
    // Minute 11 of 30: every earlier part shown, the last practice card goes up (main's 593ac295 marks it shown).
    const before: V2State = { ...newV2State(0), goals: { hook: { status: 'shown', at: 1 }, c: { status: 'shown', at: 2 }, w1: { status: 'shown', at: 3 }, t2: { status: 'demonstrated', at: 4 } }, history: [u('ok'), a('Good.')] };
    const t11 = await runV2Turn({ session: maths, state: before, studentSaid: 'ok', nowMs: 11 * MIN, callModel: say('Try this one.\n\n<board problem>The relation {(−5, 2), (−1, 7), (0, 2), (3, 9), (6, 7)} is a function. How many numbers are in its range? Type your answer as a number.</board>\n\nWhat do you get?'), boardPass: false, mathsCheck: false });
    const st = t11.state;
    check('main\'s mark stays in a maths lesson: the last practice part is shown once its card is up', st.goals.t3?.status === 'shown', st.goals);
    check('…the close does not open on that card (content is "done" by the marks, the clock is not)', v2PlanContentDone(planR, st) && !v2CloseOpen(maths, st, 11 * MIN), st.goals);
    const f11 = factLines(renderFacts(maths, st, { nowMs: 11 * MIN }));
    check('…the facts at 11: main\'s "time for more" line, not "the summary may begin"', f11.some((x) => x.endsWith(MAIN_TIME_FOR_MORE(19))) && !f11.some((x) => /summary may begin/.test(x)), f11[1]);
    const r11 = await runV2Turn({ session: maths, state: st, studentSaid: '3', nowMs: 11.5 * MIN, callModel: say('Good work today.', endLesson), boardPass: false, mathsCheck: false });
    check('…end_lesson at 11.5 of 30 is refused', !r11.state.closed && /^not ended/.test(r11.toolCalls.find((c) => c.name === 'end_lesson')?.outcome ?? ''), r11.toolCalls);
    check('…past the host\'s wrap minute (28 of 30, 1.5 to the close by the clock): still main\'s line, the close shut', factLines(renderFacts(maths, st, { nowMs: 27.5 * MIN })).some((x) => x.endsWith(MAIN_CLOSE_DUE(3)) || x.endsWith(MAIN_TIME_FOR_MORE(3))) && !v2CloseOpen(maths, st, 27.5 * MIN));
    const r28 = await runV2Turn({ session: maths, state: st, studentSaid: '3', nowMs: 28.2 * MIN, callModel: say('Good work today.', endLesson), boardPass: false, mathsCheck: false });
    check('…by main\'s rule it opens two minutes before the box: end_lesson at 28.2 is accepted', r28.state.closed && r28.toolCalls.some((c) => c.name === 'end_lesson' && c.outcome === 'the session is ending'), r28.toolCalls);
    check('…the time lines at 28.5 and 29.4 are main\'s', factLines(renderFacts(maths, st, { nowMs: 28.5 * MIN })).some((x) => x.endsWith(MAIN_CLOSE_DUE(2))) && factLines(renderFacts(maths, st, { nowMs: 29.4 * MIN })).some((x) => x.endsWith(MAIN_TIME_UP)));
    // The labelled plan (as at 39907cfc): a plan problem card going up does not mark its part; parts are done as entered and taught.
    const g0: V2State = { ...newV2State(0), goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'shown', at: 0 } }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }], current: 1 }, history: [u('ok'), a('Good.')] };
    const tg = await runV2Turn({ session: lang, state: g0, studentSaid: 'ok', nowMs: 6 * MIN, callModel: say('Here is a question.\n\n<board problem>Have you worked for your current company for a long time?</board>\n\nWhat do you think?'), boardPass: false, mathsCheck: false });
    check('the labelled plan: a plan problem\'s card going up does not mark its part shown (39907cfc)', !tg.state.goals['present-perfect'] && !tg.state.goals['past-simple'], tg.state.goals);
    const shownAll: V2State = { ...g0, goals: Object.fromEntries(GDI.segments.slice(0, -1).map((s) => [s.id, { status: 'shown' as const, at: 0 }])) };
    check('…its close by content is as before: every part before the summary marked opens it at 12 of 20 (flag on), the clock alone does not', v2CloseOpen(lang, shownAll, 12 * MIN) === TUTOR_V2_CLOSE_BY_CONTENT && !v2CloseOpen(lang, g0, 12 * MIN));
  }

  console.log('2. the hard stop (I2)');
  {
    const M = TUTOR_V2_TIME_OVERRUN ? TUTOR_V2_OVERRUN_MIN : 0;
    check('the part-flow lesson has the margin; a maths lesson, a typed lesson, homework and a discussion have none', v2MarginMin(lang) === M && v2MarginMin(maths) === 0 && v2MarginMin({ ...lang, mode: 'text' }) === 0 && v2MarginMin(homework) === 0 && v2MarginMin(discussion) === 0);
    check('the margin never passes the host\'s own maximum: a box that is the maximum has none; 2 minutes of room give 2', v2MarginMin({ ...lang, stopCeilingMinutes: 20 }) === 0 && v2MarginMin({ ...lang, stopCeilingMinutes: 22 }) === Math.min(2, M) && v2MarginMin({ ...lang, stopCeilingMinutes: 30 }) === M);
    check('"the time is up" for the others is measured to the box, as on main', v2LeftToStopMin(maths, { startedAtMs: 0 }, 30 * MIN) === 0 && v2LeftToStopMin(homework, { startedAtMs: 0 }, 20 * MIN) === 0 && v2LeftToStopMin(lang, { startedAtMs: 0 }, 20 * MIN) === M);
    check('the tutor is told of a margin exactly where the stop has one', v2TimeFlags({}, maths).overrun === false && v2TimeFlags({}, { ...lang, stopCeilingMinutes: 20 }).overrun === false && v2TimeFlags({}, lang).overrun === TUTOR_V2_TIME_OVERRUN);
    check('the browser reads the same: the plan it loaded, the box, the ceiling (the partner\'s max_duration_minutes, the pool)',
      v2ClientMarginMin({ mode: 'voice', plan: GDI, boxMin: 20 }) === M && v2ClientMarginMin({ mode: 'voice', plan: GDI, boxMin: 20, ceilingMin: 20 }) === 0
      && v2ClientMarginMin({ mode: 'voice', plan: GDI, boxMin: 20, ceilingMin: 30 }) === M && v2ClientMarginMin({ mode: 'text', plan: GDI, boxMin: 20 }) === 0
      && v2ClientMarginMin({ mode: 'voice', plan: planR, boxMin: 30 }) === 0 && v2ClientMarginMin({ mode: 'voice', plan: null, boxMin: 30 }) === 0
      && v2ClientMarginMin({ mode: 'voice', plan: { ...GDI, metadata: { kind: 'homework-problem', parentPlanId: 'p', n: 1, text: 'x' } } as LessonPlan, boxMin: 20 }) === 0);
  }

  console.log('3. the pool charge (I3)');
  check('a sitting that reports no margin is clamped as on main; a report is bounded by the engine\'s margin',
    sittingOverrunSec(undefined) === 0 && sittingOverrunSec('300') === 0 && sittingOverrunSec(-5) === 0 && sittingOverrunSec(Number.NaN) === 0
    && sittingOverrunSec(120) === (TUTOR_V2_TIME_OVERRUN ? 120 : 0) && sittingOverrunSec(99_999) === (TUTOR_V2_TIME_OVERRUN ? TUTOR_V2_OVERRUN_MIN * 60 : 0));
  {
    const turns = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor-portal', 'embed', 'page.tsx'), 'utf8');
    check('the embed sends the sitting\'s margin with each usage report (none for any other sitting)', /\.\.\.\(v2StopMarginSecRef\.current\(\) > 0 \? \{ overrunSec: v2StopMarginSecRef\.current\(\) \} : \{\}\)/.test(turns));
  }

  console.log('4. the constitution (I4)');
  {
    check('the shared constitution makes no next-time promise either way', !/pick up here|does not open where this one stopped/.test(V2_CONSTITUTION));
    const st: V2State = { ...newV2State(0), history: [u('hi'), a('Hello.')] };
    check('the part-flow lesson\'s facts carry the line; a maths lesson, homework and a discussion do not', factLines(renderFacts(lang, st, { nowMs: 5 * MIN })).includes(V2_NO_PICK_UP_LINE)
      && [maths, homework, discussion].every((s) => !renderFacts(s, st, { nowMs: 5 * MIN }).includes(V2_NO_PICK_UP_LINE)));
  }

  console.log('5. the facts (I5): main\'s lines in a maths lesson, homework and a discussion');
  {
    const asked = 'Good. Now what is f(2) if f(x) = 3x?';
    const same = (o: string) => [u('a'), a(`${o} One.`), u('b'), a(`${o} Two.`), u('c'), a(`${o} ${asked}`)];
    const states: Array<[string, V2State, Parameters<typeof renderFacts>[2]]> = [
      ['three replies opening alike', { ...newV2State(0), history: same('Great.') }, { nowMs: 6 * MIN, heard: 'x' }],
      ['75 s of silence after a reply that asked', { ...newV2State(0), history: same('Great.') }, { nowMs: 6 * MIN, silenceSeconds: 75 }],
      ['the 2 s recheck after a reply that asked', { ...newV2State(0), history: same('Great.') }, { nowMs: 6 * MIN, silenceSeconds: 2 }],
      ['the last reply held a "ready to go on?" ask', { ...newV2State(0), history: [u('a'), a('Good. Ready to go on, or would you like to ask something first?')] }, { nowMs: 6 * MIN, heard: 'yes' }],
    ];
    for (const [name, s] of [['a maths lesson', maths], ['a homework session', homework], ['a discussion', discussion]] as const) {
      for (const [what, st, f] of states) {
        const lines = factLines(renderFacts(s, st, f));
        // Task 8h follow-up: no opener line at all (6b / 6c), and the 2 s recheck is main's line (no 7m "they may be thinking").
        const ok = !lines.some((x) => /opened with/.test(x))
          && !lines.some((x) => /they may be thinking/.test(x))
          && !lines.some((x) => /^part changes: the ask whether to go on/.test(x))
          && !lines.some((x) => /smaller hint|Do not give the answer/.test(x))
          && (f.silenceSeconds ? lines[lines.length - 1] === (f.silenceSeconds === 2 ? MAIN_NO_ASK : MAIN_SILENT(75)) : true);
        check(`${name}, ${what}: main's lines`, ok, lines.filter((x) => /opened with|part changes|said nothing|hint/.test(x)));
      }
    }
    // Task 8h follow-up (controller's ruling): main has no opener fact; only the spoken language lesson gets one.
    const one = { ...newV2State(0), history: [u('a'), a(`Great. ${asked}`)] };
    check('no opener line for a maths lesson, a homework session, a discussion or a typed language lesson, after one reply or a run', [maths, homework, discussion, { ...lang, mode: 'text' as const }].every((s) => v2OpenerFact(s, one).length === 0 && v2OpenerFact(s, { ...newV2State(0), history: same('Great.') }).length === 0));
    check('the spoken language lesson: the single line after one reply', v2OpenerFact(lang, one)[0] === 'your last reply opened with "Great": open this one differently, or go straight to the content', v2OpenerFact(lang, one));
    // The language lesson keeps its lines (no new behaviour there).
    const fl = factLines(renderFacts(lang, { ...newV2State(0), history: same('Great.') }, { nowMs: 6 * MIN, silenceSeconds: 75 }));
    check('the spoken language lesson keeps the run line and the silence-after-ask line', fl.some((x) => /your last 3 replies opened with "Great".*a confirmation only when/.test(x)) && fl.some((x) => /smaller hint towards it/.test(x)), fl.filter((x) => /opened with|hint/.test(x)));
    const f2 = factLines(renderFacts(lang, { ...newV2State(0), history: same('Great.') }, { nowMs: 6 * MIN, silenceSeconds: 2 }));
    check('…and the 7m line at the 2 s recheck after a reply that asked', f2.some((x) => /they may be thinking/.test(x)) && !f2.includes(MAIN_NO_ASK), f2.slice(-2));
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
