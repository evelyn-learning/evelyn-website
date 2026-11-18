/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7i: mic test 3 (embed-1794967959470): a part is entered only when the lesson enters it; no early drop;
 * no early close. The session's plan (gdi-work-projects-v1: 2 + 3 + 3 + 3.5 + 3.5 + 5 + 3 optional + 2 = 25 minutes, 22 with the
 * level known from an earlier lesson), its 20-minute box (hard stop 25), and the reply texts of flags 1, 2 and 6. No network, no
 * model.
 *   npm run test:brain-v2-mic3-7i
 *
 *  1 PART_ASK_NAMED          the overview's "…At the end, you can practice pronunciation if you like. Are you ready?" + "Yes."
 *                            opens no Pronunciation page
 *  2 OPTIONAL_AT_ARRIVAL     nothing dropped at the first page (22 planned minutes, 20 + 5); the optional part decided on arrival:
 *                            early taken, late left out (told once, carried), asked for later and taken while it fits
 *  3 PART_ENTERED            an empty page is not reached, not green, not completed; content not done at minute 12.6
 *  4 PAGE_NEEDS_GO           flag 2: the corrected sentence read aloud is no go: the Present perfect page held, the ask said again
 *  5 STAY_IN_PART            the ahead-of-plan line in the conversation; the unheard follow-up question named in the next facts
 *  6 NO_CHECKIN_AFTER_GOODBYE no "Does that make sense so far?" after "…Goodbye!"
 *  each switch off alone (a child process per switch): the behaviour before this task for that item, the others as on.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_NO_CHECKIN_AFTER_GOODBYE, TUTOR_V2_OPTIONAL_AT_ARRIVAL, TUTOR_V2_PAGE_NEEDS_GO, TUTOR_V2_PART_ASK_NAMED, TUTOR_V2_PART_ENTERED, TUTOR_V2_STAY_IN_PART } from '../src/lib/tutor/orchestrator/flags';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { v2Progress } from '../src/lib/tutor/v2/progress';
import { V2_PART_ASKS, v2PartInHand, v2PartsDone, v2PendingPart } from '../src/lib/tutor/v2/part-flow';
import { v2CloseOpen, v2PartDueNow, v2PlanContentDone } from '../src/lib/tutor/v2/time-box';
import { v2ArrivalDrops, v2TimeFitUpFront } from '../src/lib/tutor/v2/time-fit';
import { v2ProfileCommit } from '../src/lib/tutor/v2/memory';
import { trimToSpoken } from '../src/lib/tutor/v2/interrupted';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { V2_CHECK_INS, runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Step = { text: string; after?: unknown[] };
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

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
// The session's box: 20 minutes (the pool's per-session cap), the hard stop at 25, the wrap at 18; the level known from an earlier lesson.
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const known = { workingLevel: { level: 'beginner', from: 'earlier_lesson' } } as Partial<V2State>;
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
// The session's pages (flags.jsonl lines 11, 12, 16), each with what was on it.
const TODAY: V2BoardPage = { title: 'Today\'s lesson', items: [{ id: 'inl_mwlhkvds_2', tool: 'annotate', summary: 'The two grammar points are:\npresent perfect (have/has + past participle)\npast simple: a finished event at a specific time' }] };
const EMPTY_PRON: V2BoardPage = { title: 'Pronunciation', items: [] };
const JOB: V2BoardPage = { title: 'Your job', items: [card('j1', 'I work as a sales associate at Nagoya Corporation.'), card('j2', 'I sell washing machines.'), card('j3', 'Customers want to wash their clothes at home.')] };
const PP: V2BoardPage = { title: 'Present perfect', items: [{ id: 'p1', tool: 'annotate', summary: 'have / has + past participle' }] };
const PS: V2BoardPage = { title: 'Past simple', items: [card('s1', 'I attended a robotics exhibition in Tokyo two years ago.')] };
const CONV: V2BoardPage = { title: 'Conversation', items: [card('c1', 'I am proud of a donation project for climate change at my company.')] };
const board = (pages: V2BoardPage[], current = pages.length - 1): V2State['board'] => ({ pages: structuredClone(pages), current });
const state = (pages: V2BoardPage[], extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), ...known, board: board(pages), goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'skipped', at: 0 } }, timeFit: { dropped: [], byArrival: true }, ...extra });
const run = (session: V2Session, st: V2State, said: string | null, steps: Step[], nowMin: number) => {
  const heard: string[] = []; const m = scripted(steps);
  return runV2Turn({ session, state: st, studentSaid: said, callModel: m.call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: nowMin * MIN })
    .then((r) => ({ r, heard: heard.join(''), facts: m.facts.join('\n') }));
};
const wire = (st: V2State, session: V2Session) => v2ScopeCarried(v2ReadClientState(JSON.parse(JSON.stringify(st)))!, session);
const titles = (st: V2State) => st.board.pages.map((p) => p.title);

// Flag 1: the overview (0.35; its last two sentences verbatim, the opening abbreviated) and "Yes." (0.83).
const OVERVIEW = 'Hello, and welcome to your English lesson! Today we\'ll practice talking about your work and the projects you\'re involved in. At the end, you can practice pronunciation if you like. Are you ready?';
// Flag 2: the 2.80 reply, the learner's 3.13 words, and the model's reply to them.
const T280 = 'Yes, that\'s right. You also said \'Customer looking to wash clothes at home,\' and a natural way to say it is below. That covers your job. Next is Present perfect. Do you have a question first, or shall we go on?';
const SAID313 = 'Customers want to wash their clothes at home.';
const R313 = 'Good, that sentence is clear. <board page>Present perfect</board>\nWould you like to start the present perfect next, or is there something you\'d like to ask first?';
// Flag 6 (12.19 reply, reconstructed but for its last sentence, the follow-up question cut by the barge-in at 12.47).
const R1219 = ['Good.', 'We say "a donation project," with "a" before it.', 'I am proud of a donation project for climate change at my company.', 'Great project.', 'When did you start this project?'];

/** One run of the session's key turns, for a child process with one switch off. */
async function probe() {
  const ready = await run(lang, state([TODAY], { history: [u('[start]'), a(OVERVIEW)], timeFit: undefined }), 'Yes.', [{ text: 'Great, let\'s begin. <board page>Your job</board> Tell me about your job. What do you do?' }], 0.83);
  const first = (await run(lang, ready.r.state, 'I work in sales.', [{ text: 'Good. What do you sell?' }], 1.49)).r.state.timeFit ?? null;
  const flag1Board = state([TODAY, EMPTY_PRON, JOB], { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'skipped', at: 0 } } });
  const prog = v2Progress(GDI, flag1Board.goals, flag1Board);
  const at126 = state([TODAY, EMPTY_PRON, JOB, PP, PS, CONV], { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'skipped', at: 0 }, 'topic-intro': { status: 'shown', at: 0 }, 'present-perfect': { status: 'demonstrated', at: 0 }, 'past-simple': { status: 'demonstrated', at: 0 } }, practiceSaid: { 'open-conversation': 3 }, timeFit: { dropped: ['pronunciation'], told: true } });
  const f2 = await run(lang, state([TODAY, EMPTY_PRON, JOB], { history: [u('x'), a(OVERVIEW), u('I sell washing machines.'), a(T280)], practiceSaid: { 'topic-intro': 3 }, heldPage: { title: 'Present perfect', part: 'present-perfect', at: 2 } }), SAID313, [{ text: R313 }], 3.13);
  const trimmed = trimToSpoken({ ...at126, history: [u('x'), a(R1219.join(' '))] }, R1219, 4);
  const stay = renderFacts(lang, wire(trimmed, lang), { nowMs: 12.57 * MIN, heard: 'I am proud of a donation project for climate change at my company.' });
  const bye = await run(lang, at126, 'Oh, wait, one more thing.', [{ text: 'That\'s okay, Ken. Thank you for today\'s lesson. Goodbye!' }], 14.96);
  return {
    pronPage: titles(ready.r.state).includes('Pronunciation'), upFront: first, pronCompleted: prog.completedSegmentIds.includes('pronunciation'), pronLit: prog.currentSegmentId === 'pronunciation',
    contentDone: v2PlanContentDone(GDI, at126), f2Opened: titles(f2.r.state).includes('Present perfect'),
    stayLine: /has about \d+ of its 5 minutes left by the plan/.test(stay), unheardLine: /not heard: .*"When did you start this project\?"/.test(stay),
    checkIn: V2_CHECK_INS.some((x) => bye.heard.includes(x)),
  };
}

async function main() {
  if (process.env.MIC3_7I_CHILD) { console.log(`OFF_JSON ${JSON.stringify(await probe())}`); return; }

  console.log('the switches: each on by default');
  check('PART_ASK_NAMED, OPTIONAL_AT_ARRIVAL, PART_ENTERED, PAGE_NEEDS_GO, STAY_IN_PART, NO_CHECKIN_AFTER_GOODBYE default on', TUTOR_V2_PART_ASK_NAMED && TUTOR_V2_OPTIONAL_AT_ARRIVAL && TUTOR_V2_PART_ENTERED && TUTOR_V2_PAGE_NEEDS_GO && TUTOR_V2_STAY_IN_PART && TUTOR_V2_NO_CHECKIN_AFTER_GOODBYE);

  console.log('1. "Are you ready?" is no part ask (flag 1)');
  {
    const st = state([TODAY], { history: [u('[start]'), a(OVERVIEW)], timeFit: undefined });
    check('the overview\'s "Are you ready?" pends no part (Pronunciation was named only in passing, the sentence before)', v2PendingPart(GDI, st, OVERVIEW, 'Yes.') === null, v2PendingPart(GDI, st, OVERVIEW, 'Yes.'));
    check('…as before 7i, it pended Pronunciation', v2PendingPart(GDI, st, OVERVIEW, 'Yes.', false)?.title === 'Pronunciation');
    const r = await run(lang, st, 'Yes.', [{ text: 'Great, let\'s begin. <board page>Your job</board> Tell me about your job. What do you do?' }], 0.83);
    check('"Yes." opens no Pronunciation page; the model\'s Your job page opens, the first teaching part', !titles(r.r.state).includes('Pronunciation') && titles(r.r.state).join() === 'Today\'s lesson,Your job', titles(r.r.state));
    check('…its chip lit; Pronunciation neither lit nor green', v2Progress(GDI, r.r.state.goals, r.r.state).currentSegmentId === 'topic-intro' && !v2Progress(GDI, r.r.state.goals, r.r.state).completedSegmentIds.includes('pronunciation'));
    const st2 = state([TODAY, JOB], { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'skipped', at: 0 }, 'topic-intro': { status: 'shown', at: 0 } } });
    check('a real part ask still pends its part: "Next is Present perfect. Do you have a question first, or shall we go on?"', v2PendingPart(GDI, st2, T280, 'Yes.')?.title === 'Present perfect');
    check('…and "Shall we move on to the past simple?" its named part', v2PendingPart(GDI, st2, 'Good. Shall we move on to the past simple?', 'Yes.')?.title === 'Past simple');
    check('…and "Next is present perfect. Are you ready?" (the lead with its ask)', v2PendingPart(GDI, st2, 'Good. Next is present perfect. Are you ready?', 'Yes.')?.title === 'Present perfect');
    check('a plain "Shall we begin?" after the overview pends nothing', v2PendingPart(GDI, state([TODAY]), 'Today we talk about your work. Shall we begin?', 'Yes.') === null);
  }

  console.log('2. optional parts decided on arrival, not up front (flag 1)');
  {
    check('the plan: 25 minutes, 22 with the level known; the required parts 19 fit 20 + 5: nothing up front', (() => { const f = v2TimeFitUpFront(GDI, { goals: { 'level-check': { status: 'skipped', at: 0 } }, ...known }, 20, 5); return f.byArrival === true && f.dropped.length === 0; })());
    const r0 = await run(lang, state([TODAY], { history: [u('[start]'), a(OVERVIEW)], timeFit: undefined }), 'Yes.', [{ text: 'Great, let\'s begin. <board page>Your job</board> Tell me about your job. What do you do?' }], 0.83);
    const r = await run(lang, r0.r.state, 'I work in sales.', [{ text: 'Good. What do you sell?' }], 1.49);
    check('the first teaching page up (minute 1.49): nothing dropped, decided on arrival', r.r.state.timeFit?.byArrival === true && r.r.state.timeFit.dropped.length === 0, r.r.state.timeFit);
    check('…and nothing announced: no "left out for time" in the facts', !/left out for time/.test(r.facts));
    check('the required parts alone over target + margin (a 12-minute box: 19 > 17): the 7f up-front drop', v2TimeFitUpFront(GDI, { goals: {}, ...known }, 12, 5).dropped.join() === 'pronunciation');
    // Arrival: the conversation in hand, Pronunciation next.
    const conv = (extra: Partial<V2State> = {}) => state([TODAY, JOB, PP, PS, CONV], { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'skipped', at: 0 }, 'topic-intro': { status: 'shown', at: 0 }, 'present-perfect': { status: 'demonstrated', at: 0 }, 'past-simple': { status: 'demonstrated', at: 0 } }, practiceSaid: { 'open-conversation': 3 }, ...extra });
    check('arrival early (minute 15: 15 + 3 + 2 = 20 ≤ 25): Pronunciation not left out', v2ArrivalDrops(GDI, conv(), 15, 20, 5).length === 0);
    const asked = conv({ history: [u('x'), a('Thank you, that was a good conversation. Next is Pronunciation. Shall we go on, or do you have a question first?')] });
    const early = await run(lang, asked, 'Yes.', [{ text: 'Let\'s practise a few words. Say "responsibilities".' }], 15);
    check('…"Yes." to its ask opens the Pronunciation page: taken', titles(early.r.state).includes('Pronunciation') && !early.r.state.timeFit?.dropped.length, titles(early.r.state));
    check('arrival late (minute 21: 21 + 3 + 2 = 26 > 25): left out', v2ArrivalDrops(GDI, conv(), 21, 20, 5).join() === 'pronunciation');
    const late = await run(lang, conv({ history: [u('x'), a('When did you start this project?')] }), 'We started it last year.', [{ text: 'Great. That was a good conversation. There is no time left for pronunciation today, so we will take it up next time. Now let\'s sum up what we did today. <board page>Summary</board> You talked about your job.' }], 21);
    check('…the facts say so: tell them once in the reply that moves on, then go on', /left out for time: there is no longer time for the Pronunciation part and the summary .*tell them once/.test(late.facts), late.facts);
    check('…recorded as left out, told (the reply named it)', late.r.state.timeFit?.dropped.join() === 'pronunciation' && late.r.state.timeFit.told === true, late.r.state.timeFit);
    check('…no Pronunciation page; the summary page opened without an offer of it', !titles(late.r.state).includes('Pronunciation') && titles(late.r.state).includes('Summary') && !/Would you like to do it now/.test(late.heard), late.heard);
    const after = await run(lang, late.r.state, 'Thank you.', [{ text: 'You did well today. Do you have any questions before we finish?' }], 21.5);
    check('…told once: the next facts only remind (not offered)', /left out for time \(already told\): the Pronunciation part, for next time/.test(after.facts) && !/tell them once/.test(after.facts), after.facts);
    const commit = v2ProfileCommit({ sessionId: 's', subject: 'English', level: 'adult', plan: GDI, state: { ...late.r.state, closeSummary: 'Practise articles.' }, transcript: [] });
    check('…carried to the next session', /Not reached last time, to do next: Pronunciation\./.test(String(commit.nextSessionIntent)), commit.nextSessionIntent);
    const notYet = await run(lang, conv({ history: [u('x'), a('When did you start this project?')] }), 'We started it last year.', [{ text: 'Great. What was the hardest part?' }], 21);
    check('a yes to an ask that names it anyway opens nothing once it is left out', await (async () => { const y = await run(lang, { ...notYet.r.state, history: [...notYet.r.state.history, u('x'), a('Next is Pronunciation. Shall we go on, or do you have a question first?')] }, 'Yes.', [{ text: 'Okay.' }], 21.4); return !titles(y.r.state).includes('Pronunciation'); })());
    const held = await run(lang, conv({ history: [u('x'), a('Next is Pronunciation. Shall we go on, or do you have a question first?')], heldPage: { title: 'Pronunciation', part: 'pronunciation', at: 1 } }), 'What does "responsible" mean?', [{ text: 'It means it is your job. There is no time left for pronunciation today, so we will do it next time.' }], 21);
    check('a page held for it before it was left out: the reply that names it (the tell) opens nothing, the wait cleared', !titles(held.r.state).includes('Pronunciation') && !held.r.state.heldPage, { pages: titles(held.r.state), held: held.r.state.heldPage });
    // Taken after all on request, while it fits before the hard stop.
    const req = await run(lang, late.r.state, 'Can we do some pronunciation practice, please?', [{ text: 'Sure, a short one. <board page>Pronunciation</board> Say "responsibilities".' }], 21.5);
    check('asked for at 21.5 (21.5 + 3 ≤ 25): taken after all: no longer left out, the facts say to take it up now', !req.r.state.timeFit?.dropped.includes('pronunciation') && /they asked for the Pronunciation part, left out earlier for time: it still fits/.test(req.facts) && titles(req.r.state).includes('Pronunciation'), { tf: req.r.state.timeFit, pages: titles(req.r.state) });
    check('…and not left out again on the next turn', v2ArrivalDrops(GDI, req.r.state, 22.5, 20, 5).length === 0);
    const noTime = await run(lang, late.r.state, 'Can we do some pronunciation practice, please?', [{ text: 'There is no time today; next time.' }], 22.5);
    check('asked for at 22.5 (25.5 > 25): no time, said plainly; still left out', noTime.r.state.timeFit?.dropped.includes('pronunciation') && /there is no time left for it before the session must end/.test(noTime.facts));
    check('the part line counts what the fit counts: at 12.6 the conversation is due (the known level\'s check takes no minutes)', (() => { const d = v2PartDueNow(GDI, {}, 12.6, 20, { dropped: [], levelKnown: true }); return d !== null && d !== 'done' && d.id === 'open-conversation'; })());
  }

  console.log('3. a page alone is not a part reached (flags 1, 6)');
  {
    const st = state([TODAY, EMPTY_PRON, JOB]);
    const prog = v2Progress(GDI, st.goals, st);
    check('the empty Pronunciation page (left behind): not lit, not green, not completed; Your job lit', prog.currentSegmentId === 'topic-intro' && !prog.completedSegmentIds.includes('pronunciation') && !v2PartsDone(GDI, st)[6], prog);
    // The session's state at 12.6: pronunciation left out (7f, minute 0.83), the empty page still up, no goal for the conversation.
    const at126 = state([TODAY, EMPTY_PRON, JOB, PP, PS, CONV], { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'skipped', at: 0 }, 'topic-intro': { status: 'shown', at: 0 }, 'present-perfect': { status: 'demonstrated', at: 0 }, 'past-simple': { status: 'demonstrated', at: 0 } }, practiceSaid: { 'open-conversation': 3 }, timeFit: { dropped: ['pronunciation'], told: true } });
    check('minute 12.6 of the session\'s shape: the plan\'s content is not done, the close is shut', !v2PlanContentDone(GDI, at126) && !v2CloseOpen(lang, at126, 12.6 * MIN));
    check('…nor with nothing left out (7i: pronunciation not yet decided)', !v2PlanContentDone(GDI, { ...at126, timeFit: { dropped: [], byArrival: true } }));
    check('…as before 7i, the empty page made it done', v2PlanContentDone(GDI, at126, false, false));
    const f = renderFacts(lang, at126, { nowMs: 12.6 * MIN, heard: 'x' });
    check('…the time line says time for more, never "the summary may begin"', /time for more: the lesson is not at its close/.test(f) && !/the summary may begin/.test(f), f.split('\n')[1]);
    check('a part left out for time is never done, even with its page holding something', !v2PartsDone(GDI, { ...at126, board: board([TODAY, { title: 'Pronunciation', items: [card('x', 'responsibilities')] }, JOB, PP, PS, CONV]), timeFit: { dropped: ['pronunciation'], byArrival: true } })[6]);
    check('a page just opened (in view, empty) is the part in hand', v2PartInHand(GDI, state([TODAY, JOB, { title: 'Present perfect', items: [] }], { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'skipped', at: 0 }, 'topic-intro': { status: 'shown', at: 0 } } })) === 3);
    check('a part taught (its page holds cards) is green once the lesson moves on', v2PartsDone(GDI, state([TODAY, JOB, PP]))[2]);
  }

  console.log('4. the model\'s page waits for a go (flag 2)');
  {
    const st = state([TODAY, EMPTY_PRON, JOB], { history: [u('x'), a(OVERVIEW), u('I sell washing machines.'), a(T280)], practiceSaid: { 'topic-intro': 3 }, heldPage: { title: 'Present perfect', part: 'present-perfect', at: 2 } });
    const r = await run(lang, st, SAID313, [{ text: R313 }], 3.13);
    check('the corrected sentence read aloud is no go: the Present perfect page is held, not opened', !titles(r.r.state).includes('Present perfect') && r.r.state.heldPage?.title === 'Present perfect', titles(r.r.state));
    check('…the chip stays on Your job', v2Progress(GDI, r.r.state.goals, r.r.state).currentSegmentId === 'topic-intro');
    check('…the ask is said again (the part named, a part ask at the end), the model\'s own ask after the block dropped', /present perfect/i.test(r.r.spoken) && V2_PART_ASKS.some((x) => r.r.spoken.trim().endsWith(x)) && !/Would you like to start the present perfect next/.test(r.r.spoken), r.r.spoken);
    const yes = await run(lang, r.r.state, 'Yes, let\'s go on.', [{ text: '<board page>Present perfect</board> Great. Have you ever worked with a customer from another country?' }], 3.5);
    check('a go then opens it', titles(yes.r.state).includes('Present perfect') && v2Progress(GDI, yes.r.state.goals, yes.r.state).currentSegmentId === 'present-perfect');
  }

  console.log('5. stay in a part the plan gives time to (flag 6)');
  {
    const at = state([TODAY, JOB, PP, PS, CONV], { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'skipped', at: 0 }, 'topic-intro': { status: 'shown', at: 0 }, 'present-perfect': { status: 'demonstrated', at: 0 }, 'past-simple': { status: 'demonstrated', at: 0 } }, practiceSaid: { 'open-conversation': 3 } });
    const f = renderFacts(lang, at, { nowMs: 12.57 * MIN, heard: 'x' });
    check('12.57, the conversation (plan minutes 12–17): ahead of the plan: "about 4 of its 5 minutes left … go on with it"', /this part \(Conversation\) has about 4 of its 5 minutes left by the plan: there is time, so go on with it/.test(f), f.split('\n')[1]);
    check('…not past half its minutes (15): no such line', !/minutes left by the plan/.test(renderFacts(lang, at, { nowMs: 15 * MIN, heard: 'x' })));
    check('…not after they asked to move on', !/minutes left by the plan/.test(renderFacts(lang, { ...at, moveOnAsked: ['open-conversation'] }, { nowMs: 12.57 * MIN, heard: 'x' })));
    check('…not in a typed lesson', !/minutes left by the plan/.test(renderFacts({ ...lang, mode: 'text' }, at, { nowMs: 12.57 * MIN, heard: 'x' })));
    // The barge-in at 12.47: four of the five sentences heard, the follow-up question lost.
    const trimmed = trimToSpoken({ ...at, history: [u('x'), a(R1219.join(' '))] }, R1219, 4);
    check('the trim keeps the unheard question in the state', trimmed.unheard?.join() === 'When did you start this project?', trimmed.unheard);
    const back = wire(trimmed, lang);
    check('…it survives the route\'s round trip', back.unheard?.join() === 'When did you start this project?');
    const r = await run(lang, back, 'I am proud of a donation project for climate change at my company.', [{ text: 'Yes, that\'s it. When did you start this project?' }], 12.57);
    check('…the next facts name it, to be asked again', /not heard: .*"When did you start this project\?"\. If it still fits after what they said, say again/.test(r.facts), r.facts);
    check('…named once: the state after the turn no longer carries it', !r.r.state.unheard);
    check('a typed lesson or homework does not carry it', !wire(trimmed, { ...lang, mode: 'text' }).unheard);
  }

  console.log('6. no check-in after a goodbye (14.99)');
  {
    const at = state([TODAY, JOB, PP, PS, CONV, { title: 'Summary', items: [card('m1', 'I have worked at my current company for six years.')] }], { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'skipped', at: 0 } }, history: [u('x'), a('Thank you, Ken, and see you next time!')] });
    const r = await run(lang, at, 'Oh, wait, one more thing.', [{ text: 'That\'s okay, Ken. Thank you for today\'s lesson. Goodbye!' }], 14.96);
    check('"…Goodbye!" gets no "Does that make sense so far?"', !V2_CHECK_INS.some((x) => r.r.spoken.includes(x)) && /Goodbye!$/.test(r.r.spoken.trim()), r.r.spoken);
    const s = await run(lang, at, 'Okay.', [{ text: 'The present perfect joins the past and now.' }], 10);
    check('a reply that asks nothing and says no goodbye still gets its check-in', V2_CHECK_INS.some((x) => s.r.spoken.includes(x)), s.r.spoken);
  }

  console.log('each switch off alone (a child run per switch): that item as before');
  {
    const child = (flag: string) => {
      const r = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC3_7I_CHILD: '1' }, encoding: 'utf8' });
      const line = (r.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
      return line ? JSON.parse(line.slice('OFF_JSON '.length)) : { error: r.stderr };
    };
    type P = Awaited<ReturnType<typeof probe>>;
    const on = child('NONE') as P;
    const allOn = (p: P, skip: string[] = []) => (['pronPage', 'pronCompleted', 'pronLit', 'contentDone', 'f2Opened', 'checkIn'] as const).every((k) => skip.includes(k) || !p[k]) && (skip.includes('upFront') || (p.upFront?.byArrival === true && p.upFront.dropped.length === 0)) && (skip.includes('stay') || (p.stayLine && p.unheardLine));
    check('(all on in a child: the new behaviour)', allOn(on), on);
    const n1 = child('PART_ASK_NAMED') as P;
    check('PART_ASK_NAMED off: "Yes." to the overview opens the Pronunciation page; the rest as on', n1.pronPage && allOn(n1, ['pronPage', 'pronCompleted', 'pronLit', 'upFront', 'contentDone']), n1);
    const n2 = child('OPTIONAL_AT_ARRIVAL') as P;
    check('OPTIONAL_AT_ARRIVAL off: pronunciation dropped at the first teaching page (7f); the rest as on', n2.upFront?.dropped?.join() === 'pronunciation' && !n2.upFront.byArrival && allOn(n2, ['upFront']), n2);
    const n3 = child('PART_ENTERED') as P;
    check('PART_ENTERED off: the empty page is completed (green) and the content done at 12.6; the rest as on', n3.pronCompleted && n3.contentDone && allOn(n3, ['pronCompleted', 'pronLit', 'contentDone', 'stay']), n3);
    const n4 = child('PAGE_NEEDS_GO') as P;
    check('PAGE_NEEDS_GO off: the corrected sentence read aloud opens the Present perfect page; the rest as on', n4.f2Opened && allOn(n4, ['f2Opened']), n4);
    const n5 = child('STAY_IN_PART') as P;
    check('STAY_IN_PART off: neither the ahead-of-plan line nor the unheard question; the rest as on', !n5.stayLine && !n5.unheardLine && allOn(n5, ['stay']), n5);
    const n6 = child('NO_CHECKIN_AFTER_GOODBYE') as P;
    check('NO_CHECKIN_AFTER_GOODBYE off: the check-in follows the goodbye; the rest as on', n6.checkIn && allOn(n6, ['checkIn']), n6);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
