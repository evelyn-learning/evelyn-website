/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7f: time is a target, not a cutoff (Praveen's decisions after mic test 2, embed-1794941004529, flags 4,
 * 7, 9, 10: a 20-minute box from the partner pool's per-session cap, the GDI plan's 25 minutes; every part thinned to one learner
 * sentence, the summary at 15.9 minutes with two parts not taught, "Can we do some more practice?" refused). No network, no model.
 *   npm run test:brain-v2-time-7f
 *
 *  B  no squeeze: the optional part left out (not thinned), told once, named at the close, carried to the next session
 *  C  at least 2 practice sentences of their own before a practice part closes (goal, part ask, next page), unless they ask to move on
 *  D  the close by content or the wrap minute: no summary at minute 16 with parts not done; at parts done, or at the wrap minute
 *  E  more practice at minute 17 honoured; with under 3 minutes to the hard stop, declined plainly
 *  F  the hard stop at 25 (target + 5); the pool's cap + margin; the pool's balance a real ceiling; charged wall-clock
 *  each switch off alone: today's behaviour for that item
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_CLOSE_BY_CONTENT, TUTOR_V2_CLOSE_REOPENED, TUTOR_V2_MORE_PRACTICE, TUTOR_V2_OVERRUN_MIN, TUTOR_V2_PART_MIN_PRACTICE, TUTOR_V2_TIME_NO_SQUEEZE, TUTOR_V2_TIME_OVERRUN } from '../src/lib/tutor/orchestrator/flags';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { v2CloseOpen, v2HardStopMinutes, v2LeftToStopMin, v2OverrunMin, v2PartDueFact, v2PartDueNow, v2PlanContentDone, v2TimeFlags } from '../src/lib/tutor/v2/time-box';
import { V2_PRACTICE_MORE_LINES, v2AsksMorePractice, v2PartsToDrop, v2PracticePart } from '../src/lib/tutor/v2/time-fit';
import { V2_CLOSE_INVITE_REFUSAL, V2_CLOSE_INVITE_WAIT, V2_CLOSE_MORE_LINE, V2_CLOSE_REOPEN_REFUSAL } from '../src/lib/tutor/v2/close-invite';
import { v2NextTimeLine, v2UnreachedOffer } from '../src/lib/tutor/v2/plan-map';
import { v2MemoryLines, v2ProfileCommit } from '../src/lib/tutor/v2/memory';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { poolStopSec, poolTimeBox, sittingCharge } from '../src/lib/tutor/portal/partner-pool';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Step = { text: string; after?: unknown[] };
/** A model that replies with each step in turn (the last again when they run out), streaming its words; records the facts. */
function scripted(steps: Step[]) {
  const facts: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
    const s = steps[Math.min(i, steps.length - 1)]!; i += 1;
    for (const piece of s.text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece);
    return msg([...(s.text ? [{ type: 'text', text: s.text }] : []), ...(s.after ?? [])], s.after?.length ? 'tool_use' : 'end_turn');
  };
  return { call, facts };
}
const tool = (name: string, input: Record<string, unknown>) => [{ type: 'tool_use', id: `t${Math.random().toString(36).slice(2, 7)}`, name, input }];
const end = (because = 'time_nearly_used') => tool('end_lesson', { because, summary: 'x' });

const repoRoot = join(__dirname, '..', '..', '..');
// The mic-test-2 plan: 2 + 3 + 3 + 3.5 + 3.5 + 5 + 3 (pronunciation, optional) + 2 = 25 minutes.
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
// The pool's per-session cap: 20 minutes, the wrap at 18 (partner-pool.ts poolTimeBox).
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
type H = V2State['history'];
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const MIN = 60000;
const level = { workingLevel: { level: 'intermediate', from: 'this_lesson' } } as Partial<V2State>;
const at = (titles: string[], extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), ...level, board: { pages: titles.map((title) => ({ title, items: [] })), current: titles.length - 1 }, goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'shown', at: 0 } }, ...extra });
const run = (session: V2Session, state: V2State, said: string | null, steps: Step[], nowMin: number, timeFlags?: Parameters<typeof v2TimeFlags>[0]) => {
  const heard: string[] = []; const m = scripted(steps);
  return runV2Turn({ session, state, studentSaid: said, callModel: m.call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: nowMin * MIN, ...(timeFlags ? { timeFlags } : {}) })
    .then((r) => ({ r, heard: heard.join(''), facts: m.facts.join('\n'), calls: r.toolCalls.map((c) => `${c.name}: ${c.outcome}`) }));
};
// Task 7f E (fix round 4): the permissive facts lines, and the lines that press toward the close.
const MORE = /more practice: their words may be a request for more practice now/;
const ALLOWED = /If that is what they mean, it is allowed: there are about (\d+) minutes before the session must end/;
const NO_TIME = /If that is what they mean, there is no time left today: say so plainly/;
const BEGUN = /the summary has begun: from here, no new practice, exercise or offer of more practice unless they ask for it/;
const PRESSURE = /then summary|the close is near|the planned time is reached|say goodbye and end the lesson in this reply/;
const isMore = (x: string) => V2_PRACTICE_MORE_LINES.some((l) => x.includes(l));
// Every part before the summary done; pronunciation left out for time (B).
const allDone = { overview: { status: 'shown' as const, at: 0 }, 'level-check': { status: 'shown' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 }, 'present-perfect': { status: 'demonstrated' as const, at: 0 }, 'past-simple': { status: 'demonstrated' as const, at: 0 }, 'open-conversation': { status: 'shown' as const, at: 0 } };
const FIVE = ['Overview', 'Your job', 'Present perfect', 'Past simple', 'Conversation'];

async function main() {
  // A child run with one switch off: report what that switch decides, for the parent to compare.
  if (process.env.TIME_7F_CHILD) {
    const tf = v2TimeFlags();
    const drop = await run(lang, at(['Overview', 'Your job']), 'I work in sales.', [{ text: 'Good. Now tell me more about your job. What do you do every day?' }], 5);
    const short = await run(lang, at(['Overview', 'Your job', 'Present perfect'], { timeFit: { dropped: ['pronunciation'], told: true } }), 'I have worked here for five years.', [{ text: 'Good. <board page>Past simple</board> Now the past simple.' }], 10);
    const sixteen = await run({ ...lang, languages: undefined, levelCheck: undefined }, at(FIVE, { goals: { overview: { status: 'shown', at: 0 } }, timeFit: { dropped: ['pronunciation'], told: true } }), 'Thank you.', [{ text: 'Great. See you next time!', after: end() }], 16);
    const more = await run(lang, at(FIVE, { goals: allDone, summaryBegunAt: 1, timeFit: { dropped: ['pronunciation'], told: true } }), 'Can we do some more practice?', [{ text: 'Sure.' }], 17);
    console.log(`OFF_JSON ${JSON.stringify({
      tf, due19: v2PartDueNow(GDI, {}, 19, 20), dropped: drop.r.state.timeFit ?? null,
      pageOpened: short.r.state.board.pages.some((p) => p.title === 'Past simple'), moreLine: isMore(short.heard),
      closed16: sixteen.r.state.closed, moreFacts: /more practice: their words may be a request/.test(more.facts), stop: v2HardStopMinutes(20), leftStop: v2LeftToStopMin(lang, { startedAtMs: 0 }, 20 * MIN),
    })}`);
    return;
  }

  console.log('the switches: each on by default, the margin 5 minutes');
  check('TIME_NO_SQUEEZE, PART_MIN_PRACTICE, CLOSE_BY_CONTENT, MORE_PRACTICE, TIME_OVERRUN default on; OVERRUN_MIN 5', TUTOR_V2_TIME_NO_SQUEEZE && TUTOR_V2_PART_MIN_PRACTICE && TUTOR_V2_CLOSE_BY_CONTENT && TUTOR_V2_MORE_PRACTICE && TUTOR_V2_TIME_OVERRUN && TUTOR_V2_OVERRUN_MIN === 5 && v2OverrunMin() === 5);

  console.log('B. never squeeze a plan');
  {
    check('the mic-test-2 plan is 25 minutes, one optional part (pronunciation)', GDI.segments.reduce((t, s) => t + (s.estimatedMinutes ?? 0), 0) === 25);
    check('25 minutes in a 20-minute box: the optional part is left out (and still 22 > 20: nothing else is thinned)', v2PartsToDrop(GDI, { goals: {} }, 20).join() === 'pronunciation');
    check('the level known (its 3 minutes skipped): 22 still > 20, pronunciation left out; at 19 minutes it would fit', v2PartsToDrop(GDI, { goals: {}, workingLevel: { level: 'intermediate', from: 'earlier_lesson' } }, 20).join() === 'pronunciation');
    check('the plan fits a 30-minute box: nothing left out', v2PartsToDrop(GDI, { goals: {} }, 30).length === 0);
    const noOptional = { ...GDI, segments: GDI.segments.map((s) => ({ ...s, teacherNote: undefined, metadata: { ...(s.metadata ?? {}), optional: undefined } })) } as LessonPlan;
    check('no optional part: nothing is left out or thinned (the lesson goes as far as it gets)', v2PartsToDrop(noOptional, { goals: {} }, 20).length === 0);
    const d19 = v2PartDueNow(GDI, {}, 19, 20, { dropped: ['pronunciation'] });
    check('the part line is not fitted to the box: at 19 minutes, the conversation (plan minutes 15–20), not "the summary"', d19 !== null && d19 !== 'done' && d19.id === 'open-conversation' && !d19.fitted && d19.fromMin === 15 && d19.toMin === 20, d19);
    const d10 = v2PartDueNow(GDI, {}, 10, 20, { dropped: ['pronunciation'] });
    check('…at 10 minutes, the present perfect (8–11.5), at its own minutes', d10 !== null && d10 !== 'done' && d10.id === 'present-perfect', d10);
    const line = v2PartDueFact(lang, at(['Overview'], { timeFit: { dropped: ['pronunciation'] } }), 10 * MIN, false);
    check('the line is a guide only, and says it never cuts a part short', !!line && /a guide only: never a reason to cut a part short or skip its practice/.test(line) && !/fitted/.test(line), line);

    // Task 7i (OPTIONAL_AT_ARRIVAL): the plan's required parts (19 minutes, the level check's set aside once its level is set) fit 20 + 5, so
    // nothing is left out up front; the optional part is decided on arrival (test-brain-v2-mic3-7i). Was: pronunciation dropped here.
    const t0 = await run(lang, at(['Overview', 'Your job']), 'I work in sales at a big company.', [{ text: 'Good. What do you sell?' }], 5);
    check('(7i) the first teaching part open: nothing left out up front, the optional part decided on arrival', t0.r.state.timeFit?.byArrival === true && t0.r.state.timeFit.dropped.length === 0 && !/left out for time/.test(t0.facts), t0.r.state.timeFit);
    // The 7f decision stands where the REQUIRED parts alone exceed target + margin: a 12-minute box (19 > 12 + 5).
    const lang12: V2Session = { ...lang, timeBoxMinutes: 12, wrapMinutes: 10 };
    const t1 = await run(lang12, at(['Overview', 'Your job']), 'I work in sales at a big company.', [{ text: 'Good. We will not have time for pronunciation today, so we will do it next time. What do you sell?' }], 5);
    check('the first teaching part open (12-minute box: the required parts alone, 19, exceed 12 + 5): pronunciation left out, decided once', t1.r.state.timeFit?.dropped.join() === 'pronunciation' && !t1.r.state.timeFit.byArrival, t1.r.state.timeFit);
    check('the facts ask the tutor to tell them once, as the part begins', /left out for time: .*the Pronunciation part is left for the next session\. Tell them once/.test(t1.facts), t1.facts);
    check('the reply named it: told, and the facts ask no more', t1.r.state.timeFit?.told === true);
    const t2 = await run(lang12, t1.r.state, 'Washing machines.', [{ text: 'Washing machines, good. Who are your customers?' }], 6);
    check('next turn: a reminder only (already told; not offered)', /left out for time \(already told\): the Pronunciation part, for next time; do not offer it/.test(t2.facts) && !/Tell them once/.test(t2.facts), t2.facts);
    const early = await run(lang, { ...newV2State(0), board: { pages: [{ title: 'Overview', items: [] }], current: 0 }, history: [a('Hello.')] }, 'Hello.', [{ text: 'First, a few questions to see how you speak English. What do you do?' }], 2);
    check('not during the overview or the level check: nothing decided yet', !early.r.state.timeFit && !/left out for time/.test(early.facts));
    const unnamed = await run(lang12, at(['Overview', 'Your job']), 'I work in sales.', [{ text: 'Good. What do you sell?' }], 5);
    const unnamed2 = await run(lang12, unnamed.r.state, 'Machines.', [{ text: 'Good. Who buys them?' }], 6);
    check('a reply that does not name it: asked again once, then the facts stop asking (twice at most)', unnamed.r.state.timeFit?.shown === 1 && unnamed2.r.state.timeFit?.told === true);
    const st = at(FIVE, { goals: allDone, timeFit: { dropped: ['pronunciation'], told: true } });
    check('not offered before the summary (the held summary page has no offer of it)', v2UnreachedOffer(GDI, st) === null);
    check('named at the close as next time', /We didn't get to the pronunciation part today, so that's for next time\./.test(v2NextTimeLine(GDI, st, '') ?? ''), v2NextTimeLine(GDI, st, ''));
    const commit = v2ProfileCommit({ sessionId: 's', subject: 'English', level: 'adult', plan: GDI, state: { ...st, closeSummary: 'Practise the present perfect.' }, transcript: [] });
    check('carried to the next session: it heads the plan for next time', commit.nextSessionIntent === 'Not reached last time, to do next: Pronunciation. Practise the present perfect.', commit.nextSessionIntent);
    const lines = v2MemoryLines({ nextSessionIntent: { text: String(commit.nextSessionIntent), sessionId: 's', at: '' } } as never, 'next');
    check('…and the next lesson reads it in its background', lines.some((l) => /plan for next time was: Not reached last time, to do next: Pronunciation\./.test(l)), lines);
    check('no time fit decided: the commit as before', v2ProfileCommit({ sessionId: 's', subject: 'English', level: 'adult', plan: GDI, state: { ...at(FIVE), closeSummary: 'x' }, transcript: [] }).nextSessionIntent === 'x');
  }

  console.log('C. at least 2 practice sentences of their own before a practice part closes');
  {
    const pp = (extra: Partial<V2State> = {}) => at(['Overview', 'Your job', 'Present perfect'], { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'shown', at: 0 }, 'topic-intro': { status: 'shown', at: 0 } }, timeFit: { dropped: ['pronunciation'], told: true }, history: [u('x'), a('Now the present perfect. Can you tell me how long you have worked at your company?')], ...extra });
    const c1 = await run(lang, pp(), 'I have worked here for five years.', [{ text: 'Very good, that is the present perfect. Next is the past simple. Shall we go on, or do you have a question first?' }], 10);
    check('one sentence said: counted (1)', c1.r.state.practiceSaid?.['present-perfect'] === 1, c1.r.state.practiceSaid);
    check('the facts say 1 of 2, and nothing closes the part', /practice in this part \(Present perfect\): the learner has said 1 of the 2 practice sentences/.test(c1.facts), c1.facts);
    check('the model\'s part ask is dropped, and the runtime asks for another sentence instead', !/Shall we go on/.test(c1.r.spoken) && isMore(c1.r.spoken) && !c1.r.state.heldPage, c1.r.spoken);
    const c2 = await run(lang, pp(), 'I have worked here for five years.', [{ text: 'Very good. <board page>Past simple</board> Now, the past simple: what did you do last week?' }], 10);
    check('the next part\'s page is not opened: the reply ends at it, with the ask for another sentence (said and stored)', !c2.r.state.board.pages.some((p) => p.title === 'Past simple') && isMore(c2.heard) && isMore(c2.r.spoken) && !/what did you do last week/.test(c2.r.spoken) && !c2.r.state.heldPage && JSON.stringify(c2.r.state.history.at(-1)).includes('one more'), [c2.heard, c2.r.state.history.at(-1)]);
    const c3 = await run(lang, pp(), 'I have worked here for five years.', [{ text: 'Very good. Try another one: how long have you known your manager?', after: tool('set_goal_status', { goal: 'present-perfect', status: 'demonstrated' }) }, { text: '' }], 10);
    check('the goal is not marked done', !c3.r.state.goals['present-perfect'] && c3.calls.some((c) => /^set_goal_status: not recorded: they have said 1 of the 2/.test(c)), c3.calls);
    const sum = await run(lang, pp(), 'I have worked here for five years.', [{ text: 'Good. <board page>Summary</board> Today you practised the present perfect.' }], 10);
    check('nor the summary page (the part would close)', !sum.r.state.board.pages.some((p) => p.title === 'Summary') && isMore(sum.heard), sum.heard);
    const two = pp({ practiceSaid: { 'present-perfect': 1 } });
    const c4 = await run(lang, two, 'I have known my manager since 2019.', [{ text: 'Excellent, two good sentences. Next is the past simple. Shall we go on, or do you have a question first?' }], 11);
    check('the second sentence: 2 of 2, the part may close: the ask goes out, the next part waits for their yes (7a)', c4.r.state.practiceSaid?.['present-perfect'] === 2 && /Shall we go on, or do you have a question first\?$/.test(c4.r.spoken) && !isMore(c4.r.spoken) && !/practice in this part/.test(c4.facts), [c4.r.spoken, c4.r.state.practiceSaid]);
    const mv = await run(lang, pp(), 'Can we move on to the next part, please?', [{ text: 'Of course. Next is the past simple. Shall we go on, or do you have a question first?' }], 10);
    check('they ask to move on: the part closes without the count', mv.r.state.moveOnAsked?.includes('present-perfect') === true && /Shall we go on/.test(mv.r.spoken) && !isMore(mv.r.spoken), mv.r.spoken);
    const q = await run(lang, pp(), 'What is the difference between for and since?', [{ text: '"For" is a length of time; "since" is a starting point. Can you make a sentence with since?' }], 10);
    check('a question is no practice sentence', !q.r.state.practiceSaid?.['present-perfect']);
    const lvl = await run(lang, { ...newV2State(0), board: { pages: [{ title: 'Overview', items: [] }], current: 0 }, goals: { overview: { status: 'shown', at: 0 } }, history: [u('x'), a('What do you do?')] }, 'I am a sales manager at a big company.', [{ text: 'Thank you. <board page>Your job</board> Let us talk about your job.' }], 4);
    check('not the overview or the level check: their words are not counted, and the first teaching page opens', !lvl.r.state.practiceSaid && lvl.r.state.board.pages.some((p) => p.title === 'Your job'), [lvl.r.state.practiceSaid, lvl.calls]);
    const typed = await run({ ...lang, mode: 'text' }, pp(), 'I have worked here for five years.', [{ text: 'Very good. <board page>Past simple</board> Now the past simple.' }], 10);
    check('a typed lesson (no part flow): not counted, no ask for another sentence', !typed.r.state.practiceSaid && !isMore(typed.r.spoken), typed.r.spoken);
    const unl = { ...GDI, segments: GDI.segments.map((s) => ({ ...s, metadata: { ...(s.metadata ?? {}), label: undefined } })) } as LessonPlan;
    const maths = await run({ ...lang, plan: unl, languages: undefined }, at(['Intro', 'Equations']), 'x equals four because two x is eight.', [{ text: 'Right. <board page>Graphs</board> Now graphs.' }], 10);
    check('a plan without part names (maths, science): not counted, no ask for another sentence', !maths.r.state.practiceSaid && !isMore(maths.r.spoken), maths.r.spoken);
    const off = await run(lang, pp(), 'I have worked here for five years.', [{ text: 'Very good. <board page>Past simple</board> Now, the past simple: what did you do last week?' }], 10, { minPractice: false });
    check('the switch off for the turn: not counted, the page held for the part ask as in 7a', !off.r.state.practiceSaid && !isMore(off.r.spoken) && /past simple/i.test(off.r.spoken) && /\?$/.test(off.r.spoken), off.r.spoken);
  }

  console.log('C fix round 1 (I1): a pronunciation (word-drill) part is not held by the sentence count');
  {
    const pron = GDI.segments.findIndex((x) => x.id === 'pronunciation');
    check('the plan marks it (metadata.pronunciation): not a practice part; the past simple is', !v2PracticePart(GDI, pron) && v2PracticePart(GDI, GDI.segments.findIndex((x) => x.id === 'past-simple')));
    const box30: V2Session = { ...lang, timeBoxMinutes: 30, wrapMinutes: 28 };
    const drill = at([...FIVE, 'Pronunciation'], { goals: allDone, history: [u('x'), a('Say this word: responsibilities.')] });
    const r = await run(box30, drill, 'Responsibilities.', [{ text: 'Very good, that was clear. <board page>Summary</board> Here is a quick summary of today.' }], 24);
    check('a 30-minute box, a word said in the drill at 24: no count, no "practice in this part", no ask for another sentence', !r.r.state.practiceSaid && !/practice in this part/.test(r.facts) && !isMore(r.heard), [r.heard, r.r.state.practiceSaid]);
  }

  console.log('D. the close by content or the wrap minute, not the box\'s last fifth');
  {
    const notDone = at(FIVE, { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'shown', at: 0 }, 'topic-intro': { status: 'shown', at: 0 } }, timeFit: { dropped: ['pronunciation'], told: true }, history: [u('x'), a('What did you do on your last project?')] });
    const m16 = await run(lang, notDone, 'I visited a customer in Canada.', [{ text: 'Good. Here is a quick summary of today. See you next time!', after: end() }, { text: 'What would you like to do next?' }], 16);
    check('minute 16, the conversation not done: no close (refused), the facts say time for more, no "close is near"', !m16.r.state.closed && m16.calls.some((c) => /^end_lesson: not ended/.test(c)) && /about 4 left, which is time for more/.test(m16.facts) && !/close is near/.test(m16.facts), [m16.calls, m16.facts.slice(0, 300)]);
    check('…and its summary words do not begin the summary', typeof m16.r.state.summaryBegunAt !== 'number');
    check('v2CloseOpen at 16: false; the last fifth (switch off): true', !v2CloseOpen(lang, notDone, 16 * MIN) && v2CloseOpen(lang, notDone, 16 * MIN, false));
    const done = at(FIVE, { goals: allDone, timeFit: { dropped: ['pronunciation'], told: true }, history: [u('x'), a('Tell me about your project.')] });
    check('every required part done, pronunciation left out: the content is done, the close open at minute 14', v2PlanContentDone(GDI, done) && v2CloseOpen(lang, done, 14 * MIN));
    const f14 = renderFacts(lang, done, { nowMs: 14 * MIN });
    check('…the facts say so', /about 6 left; the plan's parts are done, so the summary may begin/.test(f14), f14.slice(0, 400));
    const s14 = await run(lang, done, 'We made a new catalogue.', [{ text: 'Great. Here is a quick summary: you used the present perfect and the past simple. Do you have any questions before we finish?' }], 14);
    check('…the summary may begin at once (its words recorded) and the 7d invitation follows the same rule', typeof s14.r.state.summaryBegunAt === 'number' && typeof s14.r.state.closeInvitedAt === 'number', [s14.r.spoken, s14.r.state.summaryBegunAt]);
    const maths: V2Session = { ...lang, languages: undefined, levelCheck: undefined };
    const c14 = await run(maths, done, 'We made a new catalogue.', [{ text: 'Great work today. See you next time!', after: end() }], 14);
    check('…a lesson without the invitation: its end_lesson is accepted at minute 14', c14.r.state.closed, c14.calls);
    const optionalOpen = at(FIVE, { goals: allDone, history: [u('x'), a('Tell me about your project.')] });
    check('pronunciation not left out (no time fit) and not offered: not done; the facts offer it ("near")', !v2PlanContentDone(GDI, optionalOpen) && /Pronunciation part was not reached: before the summary, offer it/.test(renderFacts(lang, optionalOpen, { nowMs: 14 * MIN })));
    const w18 = renderFacts(lang, notDone, { nowMs: 18.2 * MIN });
    check('the wrap minute (18), parts not done: open; finish this exchange, then summary', v2CloseOpen(lang, notDone, 18.2 * MIN) && /about 2 minutes left: finish this exchange, then summary/.test(w18), w18.slice(0, 300));
    const noWrap: V2Session = { ...lang, wrapMinutes: undefined };
    check('no wrap from the host: two before the box (18)', !v2CloseOpen(noWrap, notDone, 17.9 * MIN) && v2CloseOpen(noWrap, notDone, 18 * MIN));
    const sci: V2Session = { studentName: 'Sam', subject: 'Biology', level: 'Grade 9', mode: 'voice', timeBoxMinutes: 20, topic: 'Cells' };
    check('a timed lesson with no plan: only the wrap minute (never "content done")', !v2CloseOpen(sci, newV2State(0), 17 * MIN) && v2CloseOpen(sci, newV2State(0), 18 * MIN) && v2CloseOpen({ ...sci, timeBoxMinutes: undefined }, newV2State(0), 1 * MIN));
    const hw: V2Session = { ...lang, homework: { text: 'Solve 2x = 6.', verified: false, hasFigure: false } };
    check('homework keeps the last fifth', v2CloseOpen(hw, newV2State(0), 16.5 * MIN) && !v2CloseOpen(hw, newV2State(0), 15 * MIN));
    const m16off = await run(lang, notDone, 'I visited a customer in Canada.', [{ text: 'Good. Here is a quick summary. Any questions before we finish?' }], 16, { closeByContent: false });
    check('the switch off for the turn: the last fifth opens the close at 16, as before (the invitation is recorded)', typeof m16off.r.state.closeInvitedAt === 'number' && /close is near|summary/.test(m16off.facts), m16off.r.state);
  }

  console.log('E. more practice at the close');
  {
    const asks = ['Can we do some more practice?', 'Could I practise more?', 'One more exercise, please.', 'もっと練習したいです。', 'Can I try another sentence?', 'Can we practice a bit more?'];
    check('the ask is heard', asks.every(v2AsksMorePractice), asks.filter((x) => !v2AsksMorePractice(x)));
    // Fix round 1 (C1): answers about questions, examples, and negated phrases are never a request for practice.
    const notAsks = ['No more questions, thank you.', 'No, I have no more questions.', "I don't have any more questions.", 'Can I ask one more question?', 'I have another question.', 'Could you give me more examples?', 'No more practice, thank you.', "I don't need more exercises.", 'That is all for me.', '練習はもういいです。', '質問はありません。'];
    check('…and not: questions, examples, negated or declining phrases', notAsks.every((x) => !v2AsksMorePractice(x)), notAsks.filter(v2AsksMorePractice));
    // Fix round 2 (R1): the learner's own future practice is no request; a "No," answering the invitation then a request is one.
    const own = ['No, thanks. I will practice more at home.', "I'll keep practicing, thank you.", 'I will try more tomorrow.', 'Thank you, I want to practice more with my team.', "Thank you. I'll do more practice later.", 'いえ、ありません。もっと練習します。', 'もっと練習します。'];
    check('fix round 2: a statement of their own practice is not a request', own.every((x) => !v2AsksMorePractice(x)), own.filter(v2AsksMorePractice));
    const real = ["No, I'd like another exercise.", 'もう一回お願いします。', 'Yes, one more sentence please.', 'No problem, can we do more practice?', "I don't know, can we practice more?", 'Not yet, I want more practice.', 'Could you give me another example sentence to say?'];
    check('fix round 2: …and a real request after "No," or in Japanese is heard', real.every(v2AsksMorePractice), real.filter((x) => !v2AsksMorePractice(x)));
    // Fix round 3: a wish about a later session is no request now; the short asks (mic test 2: "Uh, one more.") are.
    const later = ['次回もっと練習したいです。', '今度もっと練習したいです。', 'I want to practice more next time.', 'I want to practice more next week.', 'I want to practice more in the next lesson.', 'One more thing: thank you very much.', 'Can you say it again?'];
    check('fix round 3: a wish about the next session is not a request', later.every((x) => !v2AsksMorePractice(x)), later.filter(v2AsksMorePractice));
    const short = ['Could we do one more?', 'One more, please.', 'No, one more please.', 'Can we do it again?', 'Can I try one more time?', 'もう1問お願いします', 'Uh, one more.', 'I want to practice more.'];
    check('fix round 3: …and the short asks are heard', short.every(v2AsksMorePractice), short.filter((x) => !v2AsksMorePractice(x)));
    // Fix round 4: E informs, it does not enforce. The facts allow the practice; no end_lesson is refused for it.
    const begun = at([...FIVE, 'Summary'], { goals: allDone, summaryBegunAt: 1, timeFit: { dropped: ['pronunciation'], told: true }, history: [u('x'), a('Here is a quick summary of today. Do you have any questions?')] });
    for (const ask of ['Can we do some more practice?', 'Uh, one more.', 'もう一問お願いします']) {
      const e17 = await run(lang, begun, ask, [{ text: 'Of course! Tell me about a project you have finished. Use the past simple.' }], 17);
      check(`minute 17, the summary begun, "${ask}": the facts allow it (about 8 minutes to the stop), with no summary-begun line and no close pressure`, MORE.test(e17.facts) && ALLOWED.exec(e17.facts)?.[1] === '8' && !BEGUN.test(e17.facts) && !PRESSURE.test(e17.facts) && /about 8 minutes before the session must end\n/.test(e17.facts) && !e17.r.state.closed, e17.facts.slice(0, 200) + e17.facts.slice(-900));
    }
    const e19 = await run(lang, at([...FIVE, 'Summary'], { goals: allDone, summaryBegunAt: 1, closeInvitedAt: 2, timeFit: { dropped: ['pronunciation'], told: true }, history: [u('x'), a('Here is a quick summary of today. Do you have any questions before we finish?')] }), 'Can we do some more practice?', [{ text: 'Sure. Tell me about your last trip.' }], 19);
    check('minute 19, past the wrap and the invitation: allowed (about 6 minutes), the time line has no "then summary", and no "end the lesson in this reply"', ALLOWED.exec(e19.facts)?.[1] === '6' && !PRESSURE.test(e19.facts) && !BEGUN.test(e19.facts), e19.facts.slice(0, 200) + e19.facts.slice(-900));
    const eEnds = await run(lang, begun, 'Can we do some more practice?', [{ text: 'Thank you for today. See you next time!', after: end() }, { text: 'Goodbye!' }], 17);
    check('nothing is enforced: no end_lesson is refused for more practice (the only refusal there can be is the 7d invitation\'s)', eEnds.calls.every((c) => !/more practice/.test(c)), eEnds.calls);
    const e22 = await run(lang, begun, 'Can we do some more practice?', [{ text: 'There is no time left today, so let us do more practice next time. Goodbye!' }], 22.5);
    check('2.5 minutes to the hard stop (22.5 of 20 + 5): no time left today, named for next time; the close lines stay', NO_TIME.test(e22.facts) && !ALLOWED.test(e22.facts) && BEGUN.test(e22.facts), e22.facts.slice(-600));
    const mid = await run(lang, at(FIVE.slice(0, 3), { timeFit: { dropped: ['pronunciation'], told: true } }), 'Can we do some more practice?', [{ text: 'Sure. How long have you lived in your city?' }], 9);
    check('mid-lesson (not at the close): no such line, the lesson goes on as ever', !MORE.test(mid.facts));
    const plain = await run(lang, begun, 'Thank you, that was useful.', [{ text: 'I am glad.' }], 17);
    check('the 6g rule stays: once the summary has begun, no NEW practice is offered by the tutor (the line is there in every other turn)', BEGUN.test(plain.facts) && !MORE.test(plain.facts), plain.facts.slice(-600));
    const eOff = await run(lang, begun, 'Can we do some more practice?', [{ text: 'Sure.' }], 17, { morePractice: false });
    check('the switch off for the turn: no line, and the summary-begun line as before', !MORE.test(eOff.facts) && BEGUN.test(eOff.facts));
  }

  console.log('the 7d invitation with B–F on (fix round 1, I2 and C1): asked once, and the lesson ends on their answer');
  {
    const closeSt = (extra: Partial<V2State> = {}) => at([...FIVE, 'Summary'], { goals: allDone, timeFit: { dropped: ['pronunciation'], told: true }, summaryBegunAt: 1, history: [u('x'), a('Here is a quick summary of today: you used the present perfect and the past simple.')], ...extra });
    const INVITE = 'Do you have any questions before we finish?';
    const s1 = await run(lang, at([...FIVE], { goals: allDone, timeFit: { dropped: ['pronunciation'], told: true }, history: [u('x'), a('Tell me about your project.')] }), 'We made a new catalogue last year.', [{ text: 'Well done. Here is a quick summary: you used the present perfect and the past simple. See you next time!', after: end() }, { text: 'Bye!', after: end() }], 17);
    check('minute 17, parts done: the summary reply\'s close is refused once for the invitation, the second end_lesson waits; not closed; the runtime\'s invitation ends it', !s1.r.state.closed && s1.calls.some((c) => c === `end_lesson: ${V2_CLOSE_INVITE_REFUSAL}`) && s1.calls.some((c) => c === `end_lesson: ${V2_CLOSE_INVITE_WAIT}`) && s1.r.spoken.trim().endsWith(INVITE) && typeof s1.r.state.closeInvitedAt === 'number', [s1.calls, s1.r.spoken]);
    const answers = ['No more questions, thank you.', 'No, I have no more questions.', "I don't have any more questions.", 'No, thank you.', '質問はありません。'];
    for (const ans of answers) {
      const t = await run(lang, closeSt({ closeInvitedAt: 2, history: [u('x'), a(`Here is a quick summary of today. ${INVITE}`)] }), ans, [{ text: 'Thank you for today. See you next time!', after: end() }, { text: 'Goodbye!' }], 17.5);
      check(`"${ans}" at 17.5: the lesson ends on it (no more-practice line, no refusal)`, t.r.state.closed && !MORE.test(t.facts) && t.calls.every((c) => !/^end_lesson: not ended/.test(c)), [t.calls, t.facts.slice(-500)]);
    }
    const q = await run(lang, closeSt({ closeInvitedAt: 2, history: [u('x'), a(`Here is a quick summary of today. ${INVITE}`)] }), 'One more question: what is the difference between been and gone?', [{ text: '"Gone" means they are still there; "been" means they came back. Thank you for today, see you next time!', after: end() }, { text: 'Goodbye!' }], 17.5);
    check('"One more question: …" is a question: no more-practice line, answered, and the lesson may end', q.r.state.closed && !MORE.test(q.facts) && /questions before the close: you have asked/.test(q.facts), [q.calls]);
    // Fix round 4: every closing remark the three re-reviews found misread (whether the matcher still fires on it or not)
    // ends the lesson at the minute-17 invitation: the tutor's end_lesson is accepted, nothing holds the close.
    const invited = () => closeSt({ closeInvitedAt: 2, history: [u('x'), a(`Here is a quick summary of today. ${INVITE}`)] });
    const falseHits = [
      'No, thanks. I will practice more at home.', "I'll keep practicing, thank you.", 'Thank you, I want to practice more with my team.', 'いえ、ありません。もっと練習します。',
      '次回もっと練習したいです。', '今度もっと練習したいです。', 'I want to practice more next time.',
      "Let's do this again sometime.", '明日もう一回お願いします。', 'また明日、もう一回お願いします。', 'Could we do it again next Tuesday?',
      'Could we do one more question?', 'Can you explain one more time?', 'もう一度説明してください。', 'Can we do this again? Thank you for today.',
    ];
    for (const ans of falseHits) {
      const t = await run(lang, invited(), ans, [{ text: 'Thank you for today. See you next time!', after: end() }, { text: 'Goodbye!' }], 17);
      check(`"${ans}" to the invitation at 17: the tutor's end_lesson is accepted`, t.r.state.closed && t.calls.some((c) => /^end_lesson: /.test(c)) && t.calls.every((c) => !/^end_lesson: not ended/.test(c)), t.calls);
    }
    // A clear request: the facts allow the practice; the model that gives it stays open, and the lesson ends on a later turn.
    for (const ask of ['Uh, one more.', "No, I'd like another exercise.", 'Can we do some more practice?']) {
      const t = await run(lang, invited(), ask, [{ text: 'Of course! Tell me what you did last weekend, in the past simple.' }], 17);
      check(`"${ask}" to the invitation at 17: the facts allow it, no close pressure, the lesson stays open`, !t.r.state.closed && ALLOWED.test(t.facts) && !BEGUN.test(t.facts) && !PRESSURE.test(t.facts), t.facts.slice(-900));
      const after = await run(lang, { ...t.r.state }, 'I went to Kyoto with my family.', [{ text: 'Well said. Thank you for today, see you next time!', after: end() }, { text: 'Goodbye!' }], 18);
      // Task 7k (CLOSE_REOPENED): the practice taken up reopened the close: after it, the end is deferred once and the reply asks
      // "more, or finish?"; the lesson ends on the answer to that. Before 7k: the next close was accepted.
      if (TUTOR_V2_CLOSE_REOPENED) {
        check('…(7k) after the practice the next close is deferred once: the reply asks "more, or finish?", the lesson open', !after.r.state.closed && after.calls.some((c) => c === `end_lesson: ${V2_CLOSE_REOPEN_REFUSAL}`) && after.heard.trim().endsWith(V2_CLOSE_MORE_LINE), [after.calls, after.heard]);
        const fin = await run(lang, { ...after.r.state }, 'No, thank you. That is all.', [{ text: 'Thank you for today, see you next time!', after: end() }], 18.4);
        check('…and the lesson ends on their answer to it', fin.r.state.closed && fin.calls.every((c) => !/^end_lesson: not ended/.test(c)), fin.calls);
      } else check('…and after the practice the lesson ends on the next close (the invitation is not asked again)', after.r.state.closed && after.calls.every((c) => !/^end_lesson: not ended/.test(c)), after.calls);
    }
  }

  console.log('F. the target and the margin');
  {
    check('the hard stop: 20 + 5 = 25; the switch off: 20', v2HardStopMinutes(20) === 25 && v2HardStopMinutes(20, undefined, false) === 20);
    check('a pool balance of 21 minutes is a ceiling: 21; a looser one does not raise it (30 → 25); never before the box', v2HardStopMinutes(20, 21) === 21 && v2HardStopMinutes(20, 30) === 25 && v2HardStopMinutes(20, 12) === 20);
    const f20 = renderFacts(lang, at(FIVE), { nowMs: 20.5 * MIN });
    check('20.5 of 20: not "the time is up"; finish this exchange properly, then the summary', !/the time is up/.test(f20) && /the planned time is reached: finish this exchange properly, then summary/.test(f20), f20.slice(0, 300));
    check('23.6 (1.4 to the hard stop): the time is up', /the time is up/.test(renderFacts(lang, at(FIVE), { nowMs: 23.6 * MIN })));
    check('the time-up minute for a lesson: 25 − 1.5; homework keeps its box', v2LeftToStopMin(lang, { startedAtMs: 0 }, 20 * MIN) === 5 && v2LeftToStopMin({ ...lang, homework: { text: 'x', verified: false, hasFigure: false } }, { startedAtMs: 0 }, 20 * MIN) === 0);
    const t24 = await run(lang, at([...FIVE, 'Summary'], { goals: allDone }), 'Thank you.', [{ text: 'Thank you, see you next time!', after: end() }], 24);
    check('24 min: a closing turn, the close accepted', t24.r.state.closed);
    // The pool (partner-pool.ts): the box is the per-session cap, the margin past it, the balance a ceiling, charged wall-clock.
    check('the pool box is unchanged: 20, wrap 18', JSON.stringify(poolTimeBox({ tokenMaxMinutes: 30, pooled: true, capSec: 1200 })) === JSON.stringify({ maxMinutes: 20, wrapMinutes: 18 }));
    check('a v2 sitting\'s wall-clock cap: 20 min + 5 = 1500 s; a v1 sitting: 1200 s', poolStopSec({ capSec: 1200, remainingSec: 36000, overrunSec: 300 }) === 1500 && poolStopSec({ capSec: 1200, remainingSec: 36000, overrunSec: 0 }) === 1200);
    check('the balance is a real ceiling: 21 minutes left → 1260 s; a balance under the cap gives no margin (the cap itself)', poolStopSec({ capSec: 1200, remainingSec: 1260, overrunSec: 300 }) === 1260 && poolStopSec({ capSec: 900, remainingSec: 900, overrunSec: 300 }) === 900);
    const ch = sittingCharge({ engagedAtMs: 0, endMs: 1500 * 1000, chargedSec: 0, sessionMaxSec: 1200, overrunSec: 300 });
    check('the overrun is charged wall-clock (25 min = 1500 s); without the margin the charge stops at cap + 120 s', ch.wallSec === 1500 && sittingCharge({ engagedAtMs: 0, endMs: 1500 * 1000, chargedSec: 0, sessionMaxSec: 1200 }).wallSec === 1320);
    // No database write: the margin is the engine's constant; the embed and the store read it (source pins).
    const embed = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor-portal', 'embed', 'page.tsx'), 'utf8');
    check('the embed\'s pool cap gives the margin only to a v2 sitting, with the balance at the latch as its ceiling', /poolStopSec\(\{ capSec: cap, remainingSec: poolRemainingAtLatchSecRef\.current, overrunSec: brainVersionRef\.current === 'v2' && TUTOR_V2_TIME_OVERRUN/.test(embed) && /sessionStopCeilingMinutes=\{poolCeilingMinutes\}/.test(embed));
    const turns = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'useV2Turns.ts'), 'utf8');
    check('the runtime\'s hard stop is at v2HardStopMinutes (the box + the margin, under the ceiling)', /const stopMin = v2HardStopMinutes\(minutes, p\.current\.sessionStopCeilingMinutes\)/.test(turns) && /stopMin \* 60000/.test(turns));
    const store = readFileSync(join(__dirname, '..', 'src', 'lib', 'tutor', 'portal', 'partner-pool-store.ts'), 'utf8');
    check('the store charges the margin', /overrunSec: TUTOR_V2_TIME_OVERRUN \? TUTOR_V2_OVERRUN_MIN \* 60 : 0/.test(store));
    const controls = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'SessionControls.tsx'), 'utf8');
    check('the visible timer: past the target it counts on; the chip only in the last 2 minutes before the hard stop', /overrunSec > 0 \? remainingSeconds <= 120 : remainingSeconds <= 300/.test(controls));
  }

  console.log('the state round-trips');
  {
    const st: V2State = { ...at(FIVE), timeFit: { dropped: ['pronunciation'], told: true }, practiceSaid: { 'present-perfect': 2, 'past-simple': 1 }, moveOnAsked: ['past-simple'] };
    const back = v2ReadClientState(JSON.parse(JSON.stringify(st)));
    check('timeFit, practiceSaid and moveOnAsked survive the wire', !!back && back.timeFit?.dropped.join() === 'pronunciation' && back.timeFit.told === true && back.practiceSaid?.['present-perfect'] === 2 && back.moveOnAsked?.join() === 'past-simple', back);
    const bad = v2ReadClientState(JSON.parse(JSON.stringify({ ...st, timeFit: { dropped: ['<x>', 3] }, practiceSaid: { a: 'x', 'b c': 2 }, moveOnAsked: 'x' })));
    check('…validated: bad ids and values dropped', !!bad && bad.timeFit?.dropped.length === 0 && !bad.practiceSaid && !bad.moveOnAsked, bad);
    const scoped = v2ScopeCarried(v2ReadClientState(JSON.parse(JSON.stringify(st)))!, { ...lang, mode: 'text' });
    check('a typed lesson keeps the time fit, not the practice count (no part flow)', scoped.timeFit?.dropped.join() === 'pronunciation' && !scoped.practiceSaid && !scoped.moveOnAsked);
    const hwScoped = v2ScopeCarried(v2ReadClientState(JSON.parse(JSON.stringify(st)))!, { ...lang, homework: { text: 'x', verified: false, hasFigure: false } });
    check('homework keeps neither', !hwScoped.timeFit && !hwScoped.practiceSaid);
    // A multi-turn walk over the wire: the count is carried, so the second sentence closes the part.
    const pp = at(['Overview', 'Your job', 'Present perfect'], { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'shown', at: 0 }, 'topic-intro': { status: 'shown', at: 0 } }, timeFit: { dropped: ['pronunciation'], told: true }, history: [u('x'), a('How long have you worked there?')] });
    const w1 = await run(lang, pp, 'I have worked here for five years.', [{ text: 'Good. How long have you known your manager?' }], 10);
    const wire = v2ScopeCarried(v2ReadClientState(JSON.parse(JSON.stringify(w1.r.state)))!, lang);
    const w2 = await run(lang, wire, 'I have known her since 2019.', [{ text: 'Excellent. Next is the past simple. Shall we go on, or do you have a question first?' }], 11);
    check('turn 1 counted 1 → the wire → turn 2 counts 2 and the part ask goes out', w2.r.state.practiceSaid?.['present-perfect'] === 2 && /Shall we go on/.test(w2.r.spoken), [w1.r.state.practiceSaid, w2.r.spoken]);
  }

  console.log('each switch off alone (a child run per switch): that item as before');
  {
    const child = (flag: string) => {
      const r = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', TIME_7F_CHILD: '1' }, encoding: 'utf8' });
      const line = (r.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
      return line ? JSON.parse(line.slice('OFF_JSON '.length)) : { error: r.stderr };
    };
    // Task 7i (OPTIONAL_AT_ARRIVAL): at the first teaching page nothing is left out up front (was: pronunciation).
    const arrival = (x: { dropped?: { dropped?: string[]; byArrival?: boolean } | null }) => x.dropped?.byArrival === true && x.dropped.dropped?.length === 0;
    const on = child('NONE');
    check('(all on in a child: the new behaviour)', on.tf?.noSqueeze && arrival(on) && !on.pageOpened && on.moreLine && !on.closed16 && on.moreFacts && on.stop === 25 && on.leftStop === 5, on);
    const b = child('TIME_NO_SQUEEZE');
    check('TIME_NO_SQUEEZE off: the minutes fitted to the box (19 min = the summary), nothing left out; the rest as on', b.tf?.noSqueeze === false && b.due19?.id === 'summary' && b.due19?.fitted === true && b.dropped === null && !b.pageOpened && !b.closed16 && b.stop === 25, b);
    const c = child('PART_MIN_PRACTICE');
    check('PART_MIN_PRACTICE off: the next part\'s page held for the part ask, as in 7a (no ask for another sentence); the rest as on', c.tf?.minPractice === false && !c.moreLine && arrival(c) && !c.closed16 && c.stop === 25, c);
    const d = child('CLOSE_BY_CONTENT');
    check('CLOSE_BY_CONTENT off: the last fifth: closed at minute 16 with parts not done, as before; the rest as on', d.tf?.closeByContent === false && d.closed16 === true && arrival(d) && d.stop === 25, d);
    const e = child('MORE_PRACTICE');
    check('MORE_PRACTICE off: no more-practice line; the rest as on', e.tf?.morePractice === false && !e.moreFacts && !e.closed16 && e.stop === 25, e);
    const f = child('TIME_OVERRUN');
    check('TIME_OVERRUN off: the hard stop and the time-up minute at the box (20); the rest as on', f.tf?.overrun === false && f.stop === 20 && f.leftStop === 0 && !f.closed16 && arrival(f), f);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
