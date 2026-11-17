/// <reference types="node" />
// Task 7f: run with NEXT_PUBLIC_TUTOR_V2_TIME_NO_SQUEEZE=off, NEXT_PUBLIC_TUTOR_V2_PART_MIN_PRACTICE=off, NEXT_PUBLIC_TUTOR_V2_CLOSE_BY_CONTENT=off, NEXT_PUBLIC_TUTOR_V2_TIME_OVERRUN=off (package.json): it pins the behaviour
// before Task 7f (the box's last fifth, the fitted part minutes, the stop at the box, part changes with no practice count);
// scripts/test-brain-v2-time-7f.ts covers the switches on, and each one off alone.
/**
 * Tutor brain v2 — the time box (v2/time-box.ts): which part should be running by the plan's minutes, the wrap minute as
 * a fact (not a line spoken into the lesson), the goodbye at the box after the tutor's speech, and the host's box, wrap
 * minute and lessonCloseAutoEnd carried to v2.
 *   npm run test:brain-v2-time-box
 *
 * The 20-minute sitting is a partner pool's cap (partner-pool.ts poolTimeBox). No network, no model.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import type Anthropic from '@anthropic-ai/sdk';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { V2_HARD_STOP_TAIL_MAX_MS, v2HardStop, v2PartDueFact, v2PartDueNow, v2WrapDue, type V2HardStopSteps } from '../src/lib/tutor/v2/time-box';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { V2_CONSTITUTION } from '../src/lib/tutor/v2/constitution';
import { DISCUSSION_PLAN_KIND } from '../src/lib/tutor/v2/discussion';
import { poolTimeBox } from '../src/lib/tutor/portal/partner-pool';
import { goodbyeLine } from '../src/lib/tutor/voice/timebox-lines';
import { TUTOR_V2_CLOSE_OPENS_SUMMARY, TUTOR_V2_TIME_BOX } from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const MIN = 60000;

// A written language lesson: 2 + 3 + 5 + 5 + 3 + 2 = 20 minutes, the level check skipped once the level is known.
const PLAN = {
  id: 'test.language.work.v1', title: 'Talking about your work', curriculum: 'test', grade: 'Adult', subject: 'languages', schemaVersion: 1, estimatedMinutes: 20,
  los: [{ id: 'lo.past', description: 'Talk about last week in the past simple.' }],
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2, metadata: { label: 'Overview' } },
    { id: 'level', kind: 'hook', goal: 'Level check', estimatedMinutes: 3, metadata: { label: 'Level check', skipWhenLevelKnown: true } },
    { id: 'past', kind: 'concept', goal: 'Past simple', estimatedMinutes: 5, metadata: { label: 'Past simple' } },
    { id: 'perfect', kind: 'concept', goal: 'Present perfect', estimatedMinutes: 5, metadata: { label: 'Present perfect' } },
    { id: 'pron', kind: 'try_yourself', goal: 'Pronunciation', estimatedMinutes: 3, metadata: { label: 'Pronunciation' } },
    { id: 'summary', kind: 'recap', goal: 'Summary', estimatedMinutes: 2, metadata: { label: 'Summary' } },
  ],
} as unknown as LessonPlan;
// 1 + 2 + 3 + 4 + 3 + 2 = 15 minutes, for a 30-minute box.
const SHORT = { ...PLAN, segments: PLAN.segments.map((s, i) => ({ ...s, estimatedMinutes: [1, 2, 3, 4, 3, 2][i] })) } as unknown as LessonPlan;
const LONG = { ...PLAN, segments: PLAN.segments.map((s) => ({ ...s, estimatedMinutes: (s.estimatedMinutes ?? 0) + 1 })) } as unknown as LessonPlan; // 26 min
const lesson: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, plan: PLAN, languages: ['en', 'ja'] };
const at = (min: number) => ({ state: newV2State(0), nowMs: min * MIN });

async function main() {
  console.log('the kill switch is on by default');
  check('TUTOR_V2_TIME_BOX defaults on', TUTOR_V2_TIME_BOX === true);

  console.log('which part should be running, by the plan\'s minutes');
  {
    const g = newV2State(0).goals;
    const p0 = v2PartDueNow(PLAN, g, 0, 20); const p6 = v2PartDueNow(PLAN, g, 6, 20); const p19 = v2PartDueNow(PLAN, g, 19, 20);
    check('at 0 min: the first part, minutes 0–2', p0 !== null && p0 !== 'done' && p0.id === 'overview' && p0.n === 1 && p0.of === 6 && p0.fromMin === 0 && p0.toMin === 2 && !p0.fitted, p0);
    check('at 6 min: the third part (past simple, minutes 5–10)', p6 !== null && p6 !== 'done' && p6.id === 'past' && p6.label === 'Past simple' && p6.fromMin === 5 && p6.toMin === 10, p6);
    check('at 19 min: the summary', p19 !== null && p19 !== 'done' && p19.id === 'summary', p19);
    check('past the box: done', v2PartDueNow(PLAN, g, 20.5, 20) === 'done');
    const skipped = { level: { status: 'skipped' as const } };
    const s6 = v2PartDueNow(PLAN, skipped, 6, 20);
    check('a skipped part takes no minutes, and the other 17 fill the 20-minute box: at 6 min with the level known, past simple (part 2 of 5, to minute 8)', s6 !== null && s6 !== 'done' && s6.id === 'past' && s6.n === 2 && s6.of === 5 && s6.toMin === 8 && s6.planMin === 17, s6);
    const s8 = v2PartDueNow(PLAN, skipped, 9, 20);
    check('…and at 9 min, present perfect', s8 !== null && s8 !== 'done' && s8.id === 'perfect', s8);
    const f = v2PartDueNow(LONG, g, 19, 20);
    check('a plan longer than the box is fitted to it: at 19 of 20 min the 26-minute plan is on its summary', f !== null && f !== 'done' && f.id === 'summary' && f.fitted && f.toMin === 20, f);
    check('no box: nothing to pace to, no answer (review 5a I2)', v2PartDueNow(LONG, g, 19, undefined) === null && v2PartDueNow(PLAN, g, 3, 0) === null);
    const sh = v2PartDueNow(SHORT, g, 15, 30);
    check('a 15-minute plan in a 30-minute box runs at half speed: at 15 min, plan minute 7.5, present perfect (box minutes 12–20)', sh !== null && sh !== 'done' && sh.id === 'perfect' && sh.fromMin === 12 && sh.toMin === 20 && sh.fitted && sh.planMin === 15, sh);
    check('…and is not done at 29 min', (() => { const x = v2PartDueNow(SHORT, g, 29, 30); return x !== null && x !== 'done' && x.id === 'summary'; })());
    const noMinutes = { ...PLAN, segments: PLAN.segments.map((s, i) => (i === 2 ? { ...s, estimatedMinutes: undefined } : s)) } as unknown as LessonPlan;
    check('a part with no minutes: no answer', v2PartDueNow(noMinutes, g, 6, 20) === null);
  }

  console.log('the facts: elapsed, remaining, the part by the clock, the wrap');
  {
    const ten = renderFacts(lesson, at(10).state, { nowMs: at(10).nowMs });
    check('10 min in: used, left, time for more', /time: 10 min used of about 20; about 10 left, which is time for more/.test(ten), ten);
    check('10 min in: the part by the clock', ten.includes('by the plan\'s minutes: [perfect] Present perfect would be running now (part 4 of 6, minutes 10–15)'), ten);
    const wrap = renderFacts(lesson, at(18.2).state, { nowMs: at(18.2).nowMs });
    check('past the wrap minute (18 of 20): about 2 minutes left: finish this exchange, then summary', /time: 18 min used of about 20; about 2 minutes left: finish this exchange, then summary/.test(wrap), wrap);
    check('…and no "the close is near" beside it', !/close is near/.test(wrap));
    const up = renderFacts(lesson, at(18.6).state, { nowMs: at(18.6).nowMs });
    check('inside the time-up window (1.4 min left): the time is up, as before', /the time is up/.test(up) && !/finish this exchange/.test(up), up);
    const noWrap = renderFacts({ ...lesson, wrapMinutes: undefined }, at(18.2).state, { nowMs: at(18.2).nowMs });
    check('no wrap minute from the host: "the close is near", as before', /about 2 left: the close is near/.test(noWrap) && !/finish this exchange/.test(noWrap), noWrap);
    check('before the wrap minute: no wrap', !/finish this exchange/.test(renderFacts(lesson, at(17.5).state, { nowMs: at(17.5).nowMs })));
    const fitted = renderFacts({ ...lesson, plan: LONG }, at(19).state, { nowMs: at(19).nowMs });
    check('a fitted plan says so', fitted.includes('the plan\'s 26 minutes fitted to the 20-minute box'), fitted);
    const short = { ...lesson, timeBoxMinutes: 30, wrapMinutes: 28, plan: SHORT };
    const s15 = renderFacts(short, at(15).state, { nowMs: at(15).nowMs });
    check('a 15-minute plan, 15 min into a 30-minute box: its middle part, scaled, and never "every part\'s time has passed" beside "time for more"', s15.includes('[perfect] Present perfect would be running now (part 4 of 6, minutes 12–20, the plan\'s 15 minutes fitted to the 30-minute box)') && !/every part's time has passed/.test(s15) && /time for more/.test(s15), s15);
    const untimed = renderFacts({ ...lesson, timeBoxMinutes: undefined, wrapMinutes: undefined }, at(25).state, { nowMs: at(25).nowMs });
    check('no box: no part line at all, even past the plan\'s minutes', !/by the plan's minutes/.test(untimed), untimed);
    const over = renderFacts({ ...lesson, wrapMinutes: undefined }, at(20.2).state, { nowMs: at(20.2).nowMs });
    check('past the box, the time up: every part\'s time has passed', /the time is up/.test(over) && over.includes('by the plan\'s minutes: every part\'s time has passed'), over);
    check('"every part\'s time has passed" only when the time is up or the wrap is due', v2PartDueFact({ ...lesson, wrapMinutes: undefined }, at(20.2).state, at(20.2).nowMs, false) === null && v2PartDueFact(lesson, at(20.2).state, at(20.2).nowMs, false) !== null);
    const noMin = renderFacts({ ...lesson, plan: { ...PLAN, segments: PLAN.segments.map((s, i) => (i === 2 ? { ...s, estimatedMinutes: undefined } : s)) } as unknown as LessonPlan }, at(10).state, { nowMs: at(10).nowMs });
    check('a part with no minutes: no part line', !/by the plan's minutes/.test(noMin), noMin);
    check('the kill switch off: no part line, no wrap', v2PartDueFact(lesson, at(10).state, at(10).nowMs, false, false) === null && !v2WrapDue(lesson, 18.2, false));
    const hw: V2Session = { ...lesson, homework: { text: 'Solve 2x = 6.', verified: false, hasFigure: false } };
    check('homework: no part line, and its own time line', v2PartDueFact(hw, at(10).state, at(10).nowMs, false) === null && !/finish this exchange/.test(renderFacts(hw, at(18.2).state, { nowMs: at(18.2).nowMs })));
    const disc = { ...lesson, plan: { ...PLAN, metadata: { kind: DISCUSSION_PLAN_KIND, participant: 'a teacher', orientation: 'cars in cities', cases: [{ id: 'c1', scenario: 'A city bans cars.' }] } } as unknown as LessonPlan };
    check('a discussion: no part line', v2PartDueFact(disc, at(10).state, at(10).nowMs, false) === null);
    check('a topic lesson with no plan: no part line', v2PartDueFact({ ...lesson, plan: undefined }, at(10).state, at(10).nowMs, false) === null);
    check('the wrap needs a box', !v2WrapDue({ wrapMinutes: 18 }, 19));
  }

  console.log('the wrap minute is a closing turn: the summary page is not held');
  {
    const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
    const reply = (text: string): V2ModelCall => { let n = 0; return async (_params, onText) => { n += 1; const t = n === 1 ? text : ''; if (t) onText?.(t); return { id: 'm', type: 'message', role: 'assistant', model: 'x', content: [{ type: 'text', text: t }], stop_reason: 'end_turn', stop_sequence: null, usage } as unknown as Anthropic.Message; }; };
    // Two pages open, mid-lesson: the part-close hold applies to any new page (pagesOpen >= 2).
    const twoPages = (): V2State => ({ ...newV2State(0), board: { pages: [{ title: 'Warm-up', items: [] }, { title: 'Present perfect', items: [] }], current: 1 }, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Good. Have you ever worked abroad?' }] });
    const SUMMARY = 'Thank you, that was clear. <board page>Summary</board> Today you used the past simple and the present perfect.';
    const turn = (session: V2Session, leftMin: number, text = SUMMARY) => runV2Turn({ session, state: twoPages(), studentSaid: 'Yes, please.', callModel: reply(text), boardPass: false, mathsCheck: false, nowMs: (20 - leftMin) * MIN });
    const opened = (r: Awaited<ReturnType<typeof turn>>) => r.state.board.pages[2]?.title === 'Summary' && !r.toolCalls.some((c) => /not opened yet/.test(c.outcome)) && !/Shall we go on/.test(r.spoken);
    const r18 = await turn(lesson, 1.8);
    check('1.8 min left on a timed link (past the wrap minute): "Yes, please." opens the summary page, without the offer', opened(r18), [r18.toolCalls.map((c) => `${c.name} ${c.outcome}`), r18.spoken]);
    const r5 = await turn(lesson, 5, 'Good, that is right. <board page>Past simple</board> Now, what did you do last week?');
    // Task 7a: a plan whose parts all have names asks in varied words ("…Next is past simple. Any questions first, or shall we go on?").
    check('5 min left: a new part\'s page is still held, with the offer in its place', r5.state.board.pages.length === 2 && !r5.toolCalls.some((c) => c.name === 'new_page') && /Next is past simple\. [^.]*(?:go on|ready)[^.]*\?$/.test(r5.spoken), [r5.toolCalls.map((c) => c.outcome), r5.spoken]);
    const rNo = await turn({ ...lesson, wrapMinutes: undefined }, 1.8);
    check('no wrap minute from the host: 1.8 min left is not a closing turn, the page is held as before', !opened(rNo), rNo.spoken);
  }

  console.log('a reply that ends the lesson opens its summary page (D1)');
  {
    const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
    // The model streams its words and then calls end_lesson, as in showcase embed-1794821260705 t77 (968 s of a 20-minute box).
    const closing = (text: string): V2ModelCall => { let n = 0; return async (_params, onText) => {
      n += 1;
      if (n > 1) return { id: 'm', type: 'message', role: 'assistant', model: 'x', content: [{ type: 'text', text: '' }], stop_reason: 'end_turn', stop_sequence: null, usage } as unknown as Anthropic.Message;
      for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece);
      return { id: 'm', type: 'message', role: 'assistant', model: 'x', content: [{ type: 'text', text }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'time_nearly_used', summary: 'Four past forms.' } }], stop_reason: 'tool_use', stop_sequence: null, usage } as unknown as Anthropic.Message;
    }; };
    const notClosing = (text: string): V2ModelCall => { let n = 0; return async (_params, onText) => { n += 1; const t = n === 1 ? text : ''; if (t) onText?.(t); return { id: 'm', type: 'message', role: 'assistant', model: 'x', content: [{ type: 'text', text: t }], stop_reason: 'end_turn', stop_sequence: null, usage } as unknown as Anthropic.Message; }; };
    // Six pages open; the last reply answered a question of theirs and ended "Does that answer your question?" (no offer to go on).
    const showcase = (): V2State => ({ ...newV2State(0), board: { pages: ['Warm-up', 'Four ways', 'The misconception', 'Verb chart', 'Choose the form', 'Role-play'].map((title) => ({ title, items: [] })), current: 5 },
      history: [{ role: 'user', content: 'When do I use \'been\' and when do I use \'gone\'?' }, { role: 'assistant', content: 'Good question. "Gone" means someone went to a place and is not there now. "Been" means someone went and came back. Does that answer your question?' }] });
    const T77 = '<board page>Summary: talking about the past</board>Today you used four ways to talk about the past, and you fixed "have went" at once. Next time, look again at been and gone. Goodbye, Aya!';
    const run = (session: V2Session, nowMin: number, call: V2ModelCall) => {
      const streamed: string[] = [];
      return runV2Turn({ session, state: showcase(), studentSaid: 'Yes, thank you. That is very clear now.', callModel: call, onText: (t) => streamed.push(t), boardPass: false, mathsCheck: false, nowMs: nowMin * MIN }).then((r) => ({ r, streamed: streamed.join('') }));
    };
    const showcaseSession: V2Session = { ...lesson, mode: 'text', trial: true };
    const { r, streamed } = await run(showcaseSession, 16.13, closing(T77));
    check('t77 (3.9 min left, the box\'s last fifth): the summary page opens, the summary is said, no offer, and the session ends', r.state.closed && r.state.board.pages.at(-1)?.title === 'Summary: talking about the past' && /Today you used four ways/.test(r.spoken) && !/Shall we go on/.test(r.spoken) && !r.toolCalls.some((c) => /not opened yet/.test(c.outcome)) && r.toolCalls.some((c) => c.name === 'end_lesson' && c.outcome === 'the session is ending'), [r.toolCalls.map((c) => `${c.name} ${c.outcome}`), r.spoken]);
    check('…and what was streamed is the summary, with no offer in it', /Goodbye, Aya!/.test(streamed) && !/Shall we go on/.test(streamed), streamed);
    const { r: r2, streamed: s2 } = await run(showcaseSession, 16.13, notClosing(T77));
    check('the same reply without end_lesson in the last fifth: the page is held, as before, with the offer', !r2.state.closed && r2.state.board.pages.length === 6 && /Next is summary: talking about the past\. Shall we go on/.test(r2.spoken) && /Shall we go on/.test(s2) && !/Today you used/.test(s2), [r2.spoken, s2]);
    const { r: r3 } = await run(showcaseSession, 10, closing(T77));
    check('10 min left: end_lesson is refused for time, and the page is held as before', !r3.state.closed && r3.state.board.pages.length === 6 && /Shall we go on/.test(r3.spoken), [r3.toolCalls.map((c) => `${c.name} ${c.outcome}`), r3.spoken]);
    const { r: r4 } = await run({ ...showcaseSession, timeBoxMinutes: undefined, wrapMinutes: undefined }, 16.13, closing(T77));
    check('no box (a close is never refused for time): a held page and end_lesson in one reply: the end_lesson is refused, the session goes on, on the offer', !r4.state.closed && /Shall we go on/.test(r4.spoken) && r4.toolCalls.some((c) => c.name === 'end_lesson' && /^not ended/.test(c.outcome)), [r4.toolCalls.map((c) => `${c.name} ${c.outcome}`), r4.spoken]);
    check('the kill switch defaults on', TUTOR_V2_CLOSE_OPENS_SUMMARY === true);

    // Review I1: only a page that closes the lesson waits for the end of the reply; any other is held at once.
    const order: string[] = [];
    const tracked = (text: string): V2ModelCall => { let n = 0; return async (_params, onText) => {
      n += 1; const t = n === 1 ? text : '';
      for (const piece of t.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece);
      order.push('model done');
      return { id: 'm', type: 'message', role: 'assistant', model: 'x', content: [{ type: 'text', text: t }], stop_reason: 'end_turn', stop_sequence: null, usage } as unknown as Anthropic.Message;
    }; };
    const MID = '<board page>Irregular verbs</board>Now pick the right tense in each sentence. First one: I ___ to Osaka last week.';
    const rMid = await runV2Turn({ session: showcaseSession, state: showcase(), studentSaid: 'Yes, thank you. That is very clear now.', callModel: tracked(MID), onText: (t) => { if (/Shall we go on/.test(t)) order.push('offer streamed'); }, onToolCall: (c) => { if (/not opened yet/.test(c.outcome)) order.push('held'); }, boardPass: false, mathsCheck: false, nowMs: 16.13 * MIN });
    check('the last fifth, a page that is not the summary: held at once, the offer streamed while the model still writes, as before', JSON.stringify(order) === JSON.stringify(['offer streamed', 'held', 'model done']) && /Next is irregular verbs\. Shall we go on/.test(rMid.spoken), [order, rMid.spoken]);
    order.length = 0;
    await runV2Turn({ session: showcaseSession, state: showcase(), studentSaid: 'Yes, thank you. That is very clear now.', callModel: tracked(T77), onText: (t) => { if (/Shall we go on/.test(t)) order.push('offer streamed'); }, onToolCall: (c) => { if (/not opened yet/.test(c.outcome)) order.push('held'); }, boardPass: false, mathsCheck: false, nowMs: 16.13 * MIN });
    check('…a summary page without end_lesson waits for the reply to end, then is held', JSON.stringify(order) === JSON.stringify(['model done', 'offer streamed', 'held']), order);
    // A plan whose last part is not called a summary: its page closes the lesson too.
    const NEXT = { ...PLAN, segments: [...PLAN.segments.slice(0, -1), { id: 'next-steps', kind: 'recap', goal: 'Next steps', estimatedMinutes: 2, metadata: { label: 'Your next steps' } }] } as unknown as LessonPlan;
    const { r: rNext } = await run({ ...showcaseSession, plan: NEXT }, 16.13, closing('<board page>Your next steps</board>You worked well today. Goodbye, Aya!'));
    check('the plan\'s last part, by its name, is a closing page: opened with the close', rNext.state.closed && rNext.state.board.pages.at(-1)?.title === 'Your next steps' && !/Shall we go on/.test(rNext.spoken), [rNext.toolCalls.map((c) => `${c.name} ${c.outcome}`), rNext.spoken]);
    const { r: rOther } = await run(showcaseSession, 16.13, closing('<board page>Irregular verbs</board>One more set. Goodbye!'));
    check('a non-closing page with end_lesson in the last fifth: held at once, and the end_lesson refused (no close on an unanswered offer)', !rOther.state.closed && /Shall we go on/.test(rOther.spoken) && rOther.toolCalls.some((c) => c.name === 'end_lesson' && /^not ended/.test(c.outcome)), [rOther.toolCalls.map((c) => `${c.name} ${c.outcome}`), rOther.spoken]);
  }

  console.log('the stop at the box');
  {
    const run = async (opts: { quiet?: boolean; voice?: boolean; farewell: string | null; endedDuring?: 'tail' | 'goodbye' }) => {
      const order: string[] = []; let ended = false;
      const steps: V2HardStopSteps = {
        stopTurn: () => order.push('stopTurn'),
        ...(opts.voice ? { untilQuiet: async (ms: number) => { order.push(`untilQuiet(${ms})`); if (opts.endedDuring === 'tail') ended = true; return opts.quiet ?? true; } } : {}),
        cut: () => order.push('cut'),
        say: (l) => order.push(`say:${l}`),
        commit: () => order.push('commit'),
        afterGoodbye: async () => { order.push('afterGoodbye'); if (opts.endedDuring === 'goodbye') ended = true; },
        end: () => order.push('end'),
        ended: () => ended,
      };
      await v2HardStop(steps, opts.farewell);
      return order;
    };
    const bye = goodbyeLine('Ken Sato');
    check('the goodbye is v1\'s fixed line, with the first name', bye === 'That\'s our time for today, Ken. Nice work.');
    const voice = await run({ voice: true, quiet: true, farewell: bye });
    check('voice: the turn stops, the speech under way finishes, then the goodbye, the commit, its playing, the end', JSON.stringify(voice) === JSON.stringify(['stopTurn', `untilQuiet(${V2_HARD_STOP_TAIL_MAX_MS})`, `say:${bye}`, 'commit', 'afterGoodbye', 'end']), voice);
    const long = await run({ voice: true, quiet: false, farewell: bye });
    check('voice, speech still going at the bound: cut, then the goodbye', JSON.stringify(long) === JSON.stringify(['stopTurn', `untilQuiet(${V2_HARD_STOP_TAIL_MAX_MS})`, 'cut', `say:${bye}`, 'commit', 'afterGoodbye', 'end']), long);
    check('the tail is bounded well inside the pool\'s 120 s slack', V2_HARD_STOP_TAIL_MAX_MS <= 30000);
    const text = await run({ farewell: bye });
    check('text: the goodbye is written, then the end', JSON.stringify(text) === JSON.stringify(['stopTurn', `say:${bye}`, 'commit', 'afterGoodbye', 'end']), text);
    const off = await run({ voice: true, farewell: null });
    check('no goodbye (kill switch off, or the lesson already closed): cut and end at once, as before', JSON.stringify(off) === JSON.stringify(['stopTurn', 'cut', 'commit', 'end']), off);
    const endTail = await run({ voice: true, quiet: true, farewell: bye, endedDuring: 'tail' });
    check('ended (End button, host) while the last words played: no goodbye, no second commit, no second end (review 5a I1)', JSON.stringify(endTail) === JSON.stringify(['stopTurn', `untilQuiet(${V2_HARD_STOP_TAIL_MAX_MS})`]), endTail);
    const endTailLong = await run({ voice: true, quiet: false, farewell: bye, endedDuring: 'tail' });
    check('…nor a cut when it ended with speech still going (the end already stopped it)', JSON.stringify(endTailLong) === JSON.stringify(['stopTurn', `untilQuiet(${V2_HARD_STOP_TAIL_MAX_MS})`]), endTailLong);
    const endBye = await run({ voice: true, quiet: true, farewell: bye, endedDuring: 'goodbye' });
    check('ended while the goodbye played: no second end', JSON.stringify(endBye) === JSON.stringify(['stopTurn', `untilQuiet(${V2_HARD_STOP_TAIL_MAX_MS})`, `say:${bye}`, 'commit', 'afterGoodbye']), endBye);
    const endText = await run({ farewell: bye, endedDuring: 'goodbye' });
    check('text, ended in the 4 s after the goodbye: no second end', !endText.includes('end'), endText);
  }

  console.log('the box: the tighter of the link\'s and the pool\'s, wrap two minutes before');
  {
    check('a 30-minute link in a pool capped at 20: 20, wrap 18', JSON.stringify(poolTimeBox({ tokenMaxMinutes: 30, pooled: true, capSec: 1200 })) === JSON.stringify({ maxMinutes: 20, wrapMinutes: 18 }));
    check('a 15-minute link in the same pool: the link\'s box stands', poolTimeBox({ tokenMaxMinutes: 15, pooled: true, capSec: 1200 }) === null);
  }

  console.log('wiring (source)');
  {
    const src = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
    const embed = src('src/app/tutor-portal/embed/page.tsx');
    check('the embed page gives the session the pool\'s box and wrap minute', /sessionMaxMinutes=\{poolTimeBoxState\?\.maxMinutes \?\? maxDuration\}/.test(embed) && /sessionWrapMinutes=\{poolTimeBoxState\?\.wrapMinutes \?\? wrapAtMinutes\}/.test(embed));
    const ts = src('src/app/tutor/components/session/TutorSession.tsx');
    const voiceEl = ts.slice(ts.indexOf('<TutorVoiceV2'), ts.indexOf('/>', ts.indexOf('<TutorVoiceV2')));
    const textEl = ts.slice(ts.indexOf('<TutorClientV2'), ts.indexOf('/>', ts.indexOf('<TutorClientV2')));
    for (const [name, el] of [['voice', voiceEl], ['text', textEl]] as const) {
      check(`TutorSession passes the wrap minute to the ${name} client`, /sessionWrapMinutes=\{sessionWrapMinutes\}/.test(el));
      check(`TutorSession passes lessonCloseAutoEnd to the ${name} client`, /lessonCloseAutoEnd=\{lessonCloseAutoEnd\}/.test(el));
    }
    const turns = src('src/app/tutor/components/v2/useV2Turns.ts');
    check('the turn loop sends the wrap minute with the box', /wrapMinutes: p\.current\.sessionWrapMinutes/.test(turns));
    check('the hard stop goes through v2HardStop with v1\'s goodbye line', /v2HardStop\(/.test(turns) && /goodbyeLine\(/.test(turns));
    check('the session ends once: every end goes through endOnce, the hard stop is told when it has ended, end() returns before its farewell when already ended, and unmounting counts as ended',
      /const endOnce = \(reason\?: 'time_limit'\) => \{ if \(endedRef\.current\) return; endedRef\.current = true; p\.current\.onEndSession\?\.\(reason\); \}/.test(turns)
      && !/p\.current\.onEndSession\?\.\(/.test(turns.replace(/const endOnce = [^\n]*/, ''))
      && /ended: \(\) => endedRef\.current/.test(turns)
      && /if \(endedRef\.current\) return;\n\s*const farewell = opts\?\.farewell/.test(turns)
      && /return \(\) => \{ endedRef\.current = true;/.test(turns));
    check('the lesson\'s close ends the session only when the partner keeps auto-end on', /TUTOR_LESSON_CLOSE_AUTO_END && p\.current\.lessonCloseAutoEnd !== false/.test(turns));
    const route = src('src/app/api/tutor/brain-v2/turn/route.ts');
    check('the route reads the wrap minute, below the box', /wrapMinutes/.test(route) && /cfg\.wrapMinutes < cfg\.timeBoxMinutes/.test(route));
    const voice = src('src/app/tutor/components/v2/TutorVoiceV2.tsx');
    check('the voice client waits for its speech to finish at the box', /untilQuiet:/.test(voice));
    check('the voice client answers nothing once the session is ending (a word over the goodbye cleared it)', /if \(turnsRef\.current\?\.isEnding\(\)\) \{ p\.current\.onDebugEvent\?\.\('v2_heard_while_ending'/.test(voice));
    check('the constitution names no partner and no wrap', !/gdi|nagoya|finish this exchange/i.test(V2_CONSTITUTION));
    check('the time-box module names no partner', !/\bgdi\b|nagoya/i.test(src('src/lib/tutor/v2/time-box.ts')));
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

void main();
