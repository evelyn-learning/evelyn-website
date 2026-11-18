/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7k: mic test 3 (embed-1794967959470): practice of another part goes to that part's page; a reopened
 * close asks "more, or finish?". The session's plan (gdi-work-projects-v1), its 20-minute box (hard stop 25), its pages and the
 * learner's words of flags 5, 7 and 8 (flags.jsonl lines 15, 17, 18) and the investigation's timeline (task-7i-investigation.md
 * D, E). No network, no model.
 *   npm run test:brain-v2-mic3-7k
 *
 *  1 PRACTICE_ON_PART_PAGE  "Oh, one more, one more past simple, please." (9.82), "can we go back to conversation and do uh one
 *                           more example?" (14.46), "Can you, can we also do some more pronunciation, please?" (15.15), "Can we
 *                           do some more practice on present perfect?" (17.03): the board turns to (or opens) that part's page
 *                           before the reply writes, its cards land there, the chip shows that part, the position and the other
 *                           parts' green do not move, the facts say to turn back, and the board returns to the position's page
 *  2 CLOSE_REOPENED         the close reopened (called off by speech; asked for more after the invitation): no goodbye pressed,
 *                           the end deferred once, the reply ends "more, or finish?", the lesson ends on the answer to it; twice in
 *                           a row; the hard stop still ends; the widened request test and the old goodbyes
 *  each switch off alone (a child process per switch): the behaviour before this task for that item, the other as on.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_CLOSE_REOPENED, TUTOR_V2_PRACTICE_ON_PART_PAGE } from '../src/lib/tutor/orchestrator/flags';
import { v2Progress } from '../src/lib/tutor/v2/progress';
import { v2PartInHand, v2PartViewed } from '../src/lib/tutor/v2/part-flow';
import { v2AsksMorePractice, v2PartPracticeAsked } from '../src/lib/tutor/v2/time-fit';
import { V2_CLOSE_MORE_LINE, V2_CLOSE_REOPEN_REFUSAL, v2ReplyAsksMoreOrFinish } from '../src/lib/tutor/v2/close-invite';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { foldInterruptedTurn } from '../src/lib/tutor/v2/interrupted';
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
  return { call, facts, calls: () => i };
}
const end = (because = 'time_nearly_used') => [{ type: 'tool_use', id: `e${Math.random().toString(36).slice(2, 7)}`, name: 'end_lesson', input: { because, summary: 'x' } }];

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
// The session's box: 20 minutes, the hard stop at 25, the wrap at 18; the level known from an earlier lesson.
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
// The session's pages (flags.jsonl lines 15, 17, 18), each with what was on it.
const TODAY: V2BoardPage = { title: 'Today\'s lesson', items: [{ id: 'inl_mwlhkvds_2', tool: 'annotate', summary: 'The two grammar points are:\npresent perfect (have/has + past participle)\npast simple: a finished event at a specific time' }] };
const JOB: V2BoardPage = { title: 'Your job', items: [card('j1', 'I work as a sales associate at Nagoya Corporation.'), card('j2', 'I sell washing machines.')] };
const PP: V2BoardPage = { title: 'Present perfect', items: [{ id: 'p1', tool: 'annotate', summary: 'have / has + past participle' }, card('p2', 'I have worked at my company for five years.')] };
const PS: V2BoardPage = { title: 'Past simple', items: [card('s1', 'I attended a robotics exhibition in Tokyo two years ago.')] };
// 9.75: the Conversation page just opened; its opening question card was lost to the barge-in (v2_board_dropped at 9.82).
const CONV_EMPTY: V2BoardPage = { title: 'Conversation', items: [] };
const CONV: V2BoardPage = { title: 'Conversation', items: [card('c1', 'I am proud of a donation project for climate change at my company.')] };
const SUMMARY: V2BoardPage = { title: 'Summary', items: [card('m1', 'I have worked at my current company for six years.')] };
const titles = (st: V2State) => st.board.pages.map((p) => p.title);
const pageOf = (st: V2State, title: string) => st.board.pages.find((p) => p.title === title)!;
const goalsAt = { overview: { status: 'shown' as const, at: 0 }, 'level-check': { status: 'skipped' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 }, 'present-perfect': { status: 'demonstrated' as const, at: 0 }, 'past-simple': { status: 'demonstrated' as const, at: 0 } };
const base = (pages: V2BoardPage[], extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'earlier_lesson' }, board: { pages: structuredClone(pages), current: pages.length - 1 }, goals: goalsAt, timeFit: { dropped: [], byArrival: true }, practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 3 }, ...extra });
const run = (st: V2State, said: string | null, steps: Step[], nowMin: number) => {
  const heard: string[] = []; const m = scripted(steps);
  return runV2Turn({ session: lang, state: st, studentSaid: said, callModel: m.call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: nowMin * MIN })
    .then((r) => ({ r, heard: heard.join(''), facts: m.facts.join('\n'), m, end: r.toolCalls.filter((c) => c.name === 'end_lesson').map((c) => c.outcome) }));
};
/** The route's round trip: JSON, the client-state read, the scope. */
const wire = (st: V2State) => v2ScopeCarried(v2ReadClientState(JSON.parse(JSON.stringify(st)))!, lang);
const prog = (st: V2State) => v2Progress(GDI, st.goals, st);

// The learner's words (flags.jsonl lastStudent; the investigation's timeline, D and E).
const SAID_982 = 'Oh, one more, one more past simple, please.';
const SAID_1446 = 'can we go back to conversation and do uh one more example?';
const SAID_1515 = 'Can you, can we also do some more pronunciation, please?';
const SAID_1703 = 'Can we do some more practice on present perfect?';
// The replies as they came (flags.jsonl lastTutor, lines 15 and 18; line 17's words).
const R_982 = 'Sure, one more past simple. Tell me about a business trip or meeting you had last year, using the past simple.\n\n<board problem difficulty="easy">Did you go on a business trip or have an important meeting last year? Tell me one sentence about it.</board>';
const R_1515 = 'Of course. Would you like to practise single words or a whole sentence?';
const R_1703 = 'Sure, let\'s practise the present perfect once more.\n\n<board problem difficulty="easy">Tell me one sentence about a project you have worked on at your company for a long time. Start with: "I have worked on..."</board>\n\nTell me one sentence about a project you have worked on at your company for a long time.';
const R_1446 = 'Sure. Here is one more question for our conversation. <board problem>When did you start this project?</board> When did you start this project?';
const CONV_Q = 'Now let\'s talk about your projects. What is one project at work that you are proud of?';
const INVITE = 'Do you have any questions before we finish?';
// The close as it stood at 14.12: the summary given at 12.63, the invitation asked; pronunciation passed over (marked skipped),
// so the plan's content is done and the close open.
const closing = (extra: Partial<V2State> = {}): V2State => base([TODAY, JOB, PP, PS, CONV, SUMMARY], { goals: { ...goalsAt, 'open-conversation': { status: 'shown', at: 0 }, pronunciation: { status: 'skipped', at: 0 } }, practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 3, 'open-conversation': 3 }, summaryBegunAt: 12.63 * MIN, closeInvitedAt: 14.12 * MIN, history: [u('x'), a(`Here is a short summary of today. You used the present perfect and the past simple well. ${INVITE}`)], ...extra });

/** One run of the session's key turns, for a child process with one switch off. */
async function probe() {
  const f5 = await run(base([TODAY, JOB, PP, PS, CONV_EMPTY], { history: [u('x'), a(CONV_Q)] }), SAID_982, [{ text: R_982 }], 9.82);
  const f8 = await run(closing(), SAID_1703, [{ text: R_1703 }], 17.03);
  const ans = await run(f8.r.state, 'I have worked on the washing machine project for two years.', [{ text: 'Great sentence, Ken. <board sentence>I have worked on the washing machine project for two years.</board> Thank you, Ken, and see you next time!', after: end() }, { text: '' }], 17.89);
  return {
    turned: f5.r.state.board.current === 3, cardOnPage: pageOf(f5.r.state, 'Past simple').items.length === 2, chip: prog(f5.r.state).currentSegmentId,
    reopened: typeof f8.r.state.closeReopened === 'number', ended: ans.r.state.closed, asked: ans.heard.trim().endsWith(V2_CLOSE_MORE_LINE),
  };
}

/** Fix round 2 (N1): the review's three answers to the lesson's own part ask, summed up (board, position, tools, the "comes later"
 *  line); run here and in a child with both 7k switches off (the 7a flow before this task). */
async function partFlowCases() {
  const convAsked = base([TODAY, JOB, PP, PS, CONV], { history: [u('x'), a('Good. Next is pronunciation. Shall we go on to pronunciation?')], practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 3, 'open-conversation': 3 }, goals: { ...goalsAt, 'open-conversation': { status: 'shown', at: 0 } } });
  const psAsked = base([TODAY, JOB, PP, PS], { history: [u('x'), a('Good. Next is the conversation. Shall we go on?')] });
  const cases: Array<[string, V2State, string, number]> = [
    ['A2', convAsked, 'Yes, let\'s try some pronunciation.', 13], ['A1', convAsked, 'Yes, can we practise pronunciation, please?', 13], ['B', psAsked, 'Yes, can we practise the conversation now?', 9.7]];
  const out: Record<string, unknown> = {};
  for (const [k, st, said, t] of cases) {
    const r = await run(st, said, [{ text: 'Great. Let\'s begin.' }], t);
    out[k] = { titles: titles(r.r.state), cur: r.r.state.board.current, pos: v2PartInHand(GDI, r.r.state), tools: r.r.toolCalls.map((c) => c.name), later: /comes later in the lesson/.test(r.facts), visit: r.r.state.visitPages ?? null, practice: r.r.state.practiceSaid };
  }
  return out;
}

async function main() {
  if (process.env.MIC3_7K_CHILD) { console.log(`OFF_JSON ${JSON.stringify(await probe())}`); return; }
  if (process.env.MIC3_7K_FLOW) { console.log(`OFF_JSON ${JSON.stringify(await partFlowCases())}`); return; }

  console.log('the switches: each on by default');
  check('PRACTICE_ON_PART_PAGE, CLOSE_REOPENED default on', TUTOR_V2_PRACTICE_ON_PART_PAGE && TUTOR_V2_CLOSE_REOPENED);

  console.log('1a. flag 5 (9.82): "one more past simple" just after the move to Conversation');
  {
    const before = base([TODAY, JOB, PP, PS, CONV_EMPTY], { history: [u('x'), a(CONV_Q)] });
    const progBefore = prog(before);
    check('before: the chip on Conversation (the page just opened), past simple green', progBefore.currentSegmentId === 'open-conversation' && progBefore.completedSegmentIds.includes('past-simple'), progBefore);
    check('their words ask for practice of the Past simple part', v2PartPracticeAsked(GDI, before, SAID_982)?.index === 4 && v2PartPracticeAsked(GDI, before, SAID_982)?.ahead === false);
    const r = await run(before, SAID_982, [{ text: R_982 }], 9.82);
    const first = r.r.toolCalls[0];
    check('the board turns back to the Past simple page (go_to_page, page 4) before the reply writes', first?.name === 'go_to_page' && first.args.pageIndex === 3 && r.r.state.board.current === 3, r.r.toolCalls.map((c) => `${c.name} ${JSON.stringify(c.args)}`));
    check('…its result says to write the practice there and turn back to the Conversation page after', /write the practice of this part here; when it is over, turn back to page 5 "Conversation"/.test(first?.outcome ?? ''), first?.outcome);
    check('the practice card lands on the Past simple page; the Conversation page gets none', pageOf(r.r.state, 'Past simple').items.length === 2 && /business trip/.test(pageOf(r.r.state, 'Past simple').items[1]!.summary) && pageOf(r.r.state, 'Conversation').items.length === 0, r.r.state.board);
    const p = prog(r.r.state);
    check('the chip shows Past simple while it lasts', p.currentSegmentId === 'past-simple', p);
    check('…the position stays Conversation (the furthest part), and green is unchanged', v2PartInHand(GDI, r.r.state) === 5 && JSON.stringify(p.completedSegmentIds) === JSON.stringify(progBefore.completedSegmentIds), [v2PartInHand(GDI, r.r.state), p.completedSegmentIds, progBefore.completedSegmentIds]);
    check('the facts say the board turned for it and to turn back to "Conversation" when it is over', /practice on another part's page: they asked for practice of the Past simple part, and the board has turned to its page "Past simple"/.test(r.facts) && /turn back to the "Conversation" page with its page block/.test(r.facts), r.facts);
    check('the request is not counted as a conversation sentence', (r.r.state.practiceSaid?.['open-conversation'] ?? 0) === 0, r.r.state.practiceSaid);
    // The answer: carded on the Past simple page, counted for the past simple, and the board turned back.
    const st = wire(r.r.state);
    check('the visit survives the route\'s round trip (the board is the record)', v2PartViewed(GDI, st) === 4);
    const ans = await run(st, 'I went to Osaka for a meeting last year.', [{ text: 'Good, that is correct. <board sentence>I went to Osaka for a meeting last year.</board> Now, back to our conversation. <board page>Conversation</board> What is one project at work that you are proud of?' }], 10.4);
    check('the answer: the facts ask for its card (7g), and the card lands on the Past simple page', /their answer just now had 1 sentence of their own/.test(ans.facts) && pageOf(ans.r.state, 'Past simple').items.some((it) => /Osaka/.test(it.summary)), ans.facts.split('\n').filter((l) => /answer just now/.test(l)));
    check('…counted for no part (fix round 1: a visit counts for nothing): not the conversation\'s minimum, not the past simple', (ans.r.state.practiceSaid?.['past-simple'] ?? 0) === 3 && (ans.r.state.practiceSaid?.['open-conversation'] ?? 0) === 0, ans.r.state.practiceSaid);
    check('…no "practice in this part (Conversation)" minimum line while the Past simple page is in view', !/practice in this part \(Conversation\)/.test(ans.facts));
    check('the return: the page block turns back to Conversation; the chip and the position are Conversation again', titles(ans.r.state).filter((t) => t === 'Conversation').length === 1 && ans.r.state.board.current === 4 && prog(ans.r.state).currentSegmentId === 'open-conversation' && v2PartInHand(GDI, ans.r.state) === 5, [ans.r.state.board.current, prog(ans.r.state)]);
    check('…and the next facts carry no turn-back line', !/practice on another part's page/.test((await run(ans.r.state, 'I am proud of the donation project.', [{ text: 'Great.' }], 10.9)).facts));
  }

  console.log('1b. flag 7 (14.46): "can we go back to conversation and do one more example?" at the close');
  {
    const before = closing();
    const progBefore = prog(before);
    check('before: the chip on Summary', progBefore.currentSegmentId === 'summary', progBefore);
    const r = await run(before, SAID_1446, [{ text: R_1446 }], 14.46);
    check('the board turns back to the Conversation page before the reply writes', r.r.toolCalls[0]?.name === 'go_to_page' && r.r.state.board.current === 4, r.r.toolCalls.map((c) => c.name));
    check('…the card lands there, none on the Summary page', pageOf(r.r.state, 'Conversation').items.length === 2 && pageOf(r.r.state, 'Summary').items.length === 1);
    check('the chip shows Conversation; the position stays Summary; green unchanged', prog(r.r.state).currentSegmentId === 'open-conversation' && v2PartInHand(GDI, r.r.state) === 7 && JSON.stringify(prog(r.r.state).completedSegmentIds) === JSON.stringify(progBefore.completedSegmentIds), [prog(r.r.state), progBefore]);
    check('the facts: turn back to "Summary" when it is over; never the board\'s "work in progress stays on page 6"', /turn back to the "Summary" page/.test(r.facts) && !/work in progress stays/.test(JSON.stringify(r.r.toolCalls)), r.facts);
    // The model's own go_to_page (no runtime turn): its result does not push it back to the Summary page mid-practice.
    const own = await run(closing(), 'Can I ask about the conversation?', [{ text: 'Of course.', after: [{ type: 'tool_use', id: 'g1', name: 'go_to_page', input: { pageIndex: 4 } }] }, { text: 'What would you like to ask?' }], 14.5);
    const g = own.r.toolCalls.find((c) => c.name === 'go_to_page');
    check('the model\'s own go_to_page to an earlier part: "write the practice of this part here; when it is over, turn back to page 6 "Summary""', !!g && /write the practice of this part here; when it is over, turn back to page 6 "Summary"/.test(g.outcome) && !/work in progress/.test(g.outcome), g?.outcome);
  }

  console.log('1c. flag 7 (15.15): "more pronunciation" at the close (the optional part not taken: no page yet)');
  {
    const before = closing();
    const r = await run(before, SAID_1515, [{ text: 'Of course. Let\'s practise one sentence. <board sentence>I have worked on this project for two years.</board> Please say this sentence.' }], 15.15);
    check('a "Pronunciation" page opens before the reply writes (agreed: turned as the reply begins)', r.r.toolCalls[0]?.name === 'new_page' && r.r.toolCalls[0].args.title === 'Pronunciation' && (r.r.toolCalls[0] as { agreed?: boolean }).agreed === true && titles(r.r.state).join() === 'Today\'s lesson,Your job,Present perfect,Past simple,Conversation,Summary,Pronunciation', titles(r.r.state));
    check('…the card lands on it, none on the Summary page', pageOf(r.r.state, 'Pronunciation').items.length === 1 && pageOf(r.r.state, 'Summary').items.length === 1);
    check('the chip shows Pronunciation; the position stays Summary (the furthest part, though the new page is the newest)', prog(r.r.state).currentSegmentId === 'pronunciation' && v2PartInHand(GDI, r.r.state) === 7, [prog(r.r.state), v2PartInHand(GDI, r.r.state)]);
    check('…green unchanged: the visit\'s page (marked in visitPages) is no part reached, so Pronunciation is not green', JSON.stringify(prog(r.r.state).completedSegmentIds) === JSON.stringify(prog(before).completedSegmentIds) && JSON.stringify(r.r.state.visitPages) === '[6]', [prog(before).completedSegmentIds, prog(r.r.state).completedSegmentIds, r.r.state.visitPages]);
    check('…the marks survive the route\'s round trip, and the position stays Summary after it', JSON.stringify(wire(r.r.state).visitPages) === '[6]' && v2PartInHand(GDI, wire(r.r.state)) === 7);
    const back = await run(r.r.state, 'I have worked on this project for two years.', [{ text: 'Very clear. <board page>Summary</board> Would you like some more practice, or shall we finish here?' }], 16.5);
    check('the return to the Summary page: chip Summary, position Summary', back.r.state.board.current === 5 && prog(back.r.state).currentSegmentId === 'summary' && v2PartInHand(GDI, back.r.state) === 7, [back.r.state.board.current, prog(back.r.state)]);
    // A part left out for time is turned to only while it still fits (7i).
    const dropped = closing({ timeFit: { dropped: ['pronunciation'], byArrival: true } });
    const dr = await run(dropped, SAID_1515, [{ text: 'Of course. <board sentence>I have worked on this project for two years.</board> Please say this sentence.' }], 15.15);
    check('left out for time and fitting (15.15: about 9 min to the stop, it takes 3): the page opens', dr.r.state.board.pages.some((p) => p.title === 'Pronunciation'));
    check('…the lesson entered it (a card on its page): 7i takes it (taken), and the position stays Summary', !!dr.r.state.timeFit?.taken?.includes('pronunciation') && !dr.r.state.timeFit.dropped.includes('pronunciation') && v2PartInHand(GDI, dr.r.state) === 7, [dr.r.state.timeFit, v2PartInHand(GDI, dr.r.state)]);
    check('…under 3 minutes to the stop (22.5): no page', !(await run(dropped, SAID_1515, [{ text: 'There is no time for that today.' }], 22.5)).r.state.board.pages.some((p) => p.title === 'Pronunciation'));
  }

  console.log('1d. flag 8 (17.03): "more practice on present perfect" at the close');
  {
    const before = closing();
    const r = await run(before, SAID_1703, [{ text: R_1703 }], 17.03);
    check('the board turns back to the Present perfect page (page 3)', r.r.toolCalls[0]?.name === 'go_to_page' && r.r.state.board.current === 2);
    check('…the question card lands there; none on Summary or Conversation', pageOf(r.r.state, 'Present perfect').items.length === 3 && pageOf(r.r.state, 'Summary').items.length === 1 && pageOf(r.r.state, 'Conversation').items.length === 1);
    check('the chip shows Present perfect; the position and green unchanged', prog(r.r.state).currentSegmentId === 'present-perfect' && v2PartInHand(GDI, r.r.state) === 7 && JSON.stringify(prog(r.r.state).completedSegmentIds) === JSON.stringify(prog(before).completedSegmentIds));
    check('not for words that name a part with no request ("My present perfect is bad.")', v2PartPracticeAsked(GDI, before, 'My present perfect is bad.') === null && v2PartPracticeAsked(GDI, before, 'I will practice the present perfect at home.') === null);
    check('M5: not for a request about a later day ("…again next Tuesday?", "…next time", "…next lesson")', ['Can we practise the past simple again next Tuesday?', 'Could we do conversation again next Friday?', 'Maybe more pronunciation next lesson.', 'More present perfect next time, please.'].every((x) => v2PartPracticeAsked(GDI, before, x) === null));
    check('not for the part in view ("more summary" names the closing part: never)', v2PartPracticeAsked(GDI, before, 'Can we do more summary?') === null);
  }

  console.log('2a. the close reopened by request after the invitation (17.03 → 17.89 → answer)');
  {
    const r = await run(closing(), SAID_1703, [{ text: R_1703 }], 17.03);
    check('the request turn: the facts allow the practice, with no "say goodbye and end the lesson in this reply" nor "bring the lesson to its close"', /more practice: their words may be a request/.test(r.facts) && !/say goodbye and end the lesson in this reply/.test(r.facts) && !/bring the lesson to its close/.test(r.facts), r.facts);
    check('…the more-practice line says to ask after the practice, not "return to the close"', /ask whether they would like more or to finish/.test(r.facts) && !/then return to the close/.test(r.facts));
    check('the reply took it up (no end): reopened after it: closeReopened set, the invitation re-armed (closeInvitedAt cleared)', typeof r.r.state.closeReopened === 'number' && r.r.state.closeInvitedAt === undefined, [r.r.state.closeReopened, r.r.state.closeInvitedAt]);
    const asksNow = await run(closing(), SAID_1703, [{ text: 'Sure. Here is the pattern: "I have worked on…". <board note>I have worked on … for … years.</board> Would you like more practice with it, or shall we finish here?' }], 17.03);
    check('a reply that takes it up and already ends "…more practice with it, or shall we finish here?": that is the ask (not reopened, so no second ask)', asksNow.r.state.closeReopened === undefined && typeof asksNow.r.state.closeInvitedAt === 'number' && asksNow.r.state.closeInvitedAt === 17.03 * MIN, [asksNow.r.state.closeReopened, asksNow.r.state.closeInvitedAt]);
    // 7f E: recognising is facts only. A reply that reads the words as a goodbye and ends is never refused for them.
    const bye = await run(closing(), 'Could we do it again next Tuesday?', [{ text: 'Of course, next time. Thank you, Ken, see you next time!', after: end() }], 17.03);
    check('a closing remark read as a request ("Could we do it again next Tuesday?"): the end in that reply is accepted, nothing reopened', bye.r.state.closed && bye.end[0] === 'the session is ending' && bye.r.state.closeReopened === undefined, bye.end);
    check('the state survives the route\'s round trip', wire(r.r.state).closeReopened === r.r.state.closeReopened && wire(r.r.state).closeInvitedAt === undefined);
    // 17.89: their answer; the model corrects and says goodbye with end_lesson, as it did.
    const ans = await run(wire(r.r.state), 'I have worked on the washing machine project for two years.', [{ text: 'Great sentence, Ken. <board sentence>I have worked on the washing machine project for two years.</board> Thank you, Ken, and see you next time!', after: end() }, { text: '' }], 17.89);
    check('the answer turn: the reopened line (no goodbye, ask "more, or finish?" after the feedback), no "say goodbye and end the lesson"', /the close is reopened/.test(ans.facts) && /asking whether they would like more practice or to finish/.test(ans.facts) && !/say goodbye and end the lesson/.test(ans.facts), ans.facts);
    check('…and never the summary again ("the summary was given already: never offer it again", 16.50)', /the summary was given already: never offer it again/.test(ans.facts));
    check('…end_lesson is deferred once, with what to do instead; the lesson stays open', ans.end[0] === V2_CLOSE_REOPEN_REFUSAL && !ans.r.state.closed, ans.end);
    check('…the goodbye is not said; the reply ends "more, or finish?" (the runtime\'s ask)', !/see you next time/i.test(ans.heard) && ans.heard.trim().endsWith(V2_CLOSE_MORE_LINE), ans.heard);
    check('…the card for their answer lands on the Present perfect page', pageOf(ans.r.state, 'Present perfect').items.some((it) => /washing machine project/.test(it.summary)));
    check('…the ask recorded: closeInvitedAt set, closeReopened cleared', typeof ans.r.state.closeInvitedAt === 'number' && ans.r.state.closeReopened === undefined);
    // Their answer to the ask: finish.
    const fin = await run(wire(ans.r.state), 'No, that\'s all. Thank you very much.', [{ text: 'Thank you, Ken, and see you next time!', after: end() }], 18.2);
    check('the lesson ends on their answer to that ask', fin.r.state.closed && fin.end[0] === 'the session is ending', fin.end);
    // …or more again (twice in a row).
    const again = await run(wire(ans.r.state), SAID_1515, [{ text: 'Of course. <board sentence>I have worked on this project for two years.</board> Please say this sentence.' }], 18.2);
    check('twice in a row: "more pronunciation" reopens it again, on the Pronunciation page', typeof again.r.state.closeReopened === 'number' && again.r.state.closeInvitedAt === undefined && pageOf(again.r.state, 'Pronunciation')?.items.length === 1, [again.r.state.closeReopened, titles(again.r.state)]);
    const ans2 = await run(again.r.state, 'I have worked on this project for two years.', [{ text: 'Very clear. Would you like to keep going, or shall we finish here?' }], 19.0);
    check('…after the practice, the model\'s own ask ("…keep going, or shall we finish here?") is recorded', typeof ans2.r.state.closeInvitedAt === 'number' && ans2.r.state.closeReopened === undefined && !ans2.r.state.closed);
    const fin2 = await run(ans2.r.state, 'Let\'s finish. Thank you!', [{ text: 'Thank you, Ken. Goodbye!', after: end() }], 19.4);
    check('…and the lesson ends on the answer', fin2.r.state.closed);
  }

  console.log('2b. the close called off by speech (7h: the client marks it reopened)');
  {
    // 16.78 end_lesson; 17.03 the learner speaks over the closing words: the client sends closed false and closeReopened.
    const off = closing({ closeReopened: 17.03 * MIN, history: [u('x'), a('Very good. Thank you, Ken, and see you next time!')] });
    const r = await run(off, SAID_1703, [{ text: R_1703 }], 17.03);
    check('reopened: the invitation re-armed, the reopened line in the facts, no goodbye pressed', r.r.state.closeInvitedAt === undefined && /the close is reopened/.test(r.facts) && !/say goodbye and end the lesson/.test(r.facts));
    check('…an end_lesson in this reply (the practice question asked) is deferred, and the reply keeps its question', !(await run(off, 'Oh, wait.', [{ text: 'Of course. What would you like to do?', after: end() }, { text: '' }], 17.03)).r.state.closed);
    const said = await run(off, 'Oh, wait, one more thing.', [{ text: 'Sure, Ken. What is it?' }], 17.03);
    check('called off with a question: the turn stays reopened (the invitation re-armed)', said.r.state.closeInvitedAt === undefined && typeof said.r.state.closeReopened === 'number');
  }

  console.log('2c. the hard stop still ends');
  {
    const late = closing({ closeReopened: 24.2 * MIN });
    const r = await run(late, 'I have worked here for six years.', [{ text: 'Good. Thank you, Ken. Goodbye!', after: end() }], 24.5);
    check('at 24.5 (box 20 + 5): end_lesson accepted, no reopened line', r.r.state.closed && r.end[0] === 'the session is ending' && !/the close is reopened/.test(r.facts), [r.end, r.facts]);
    const asked = await run(closing(), SAID_1703, [{ text: 'There is no time for that today. Goodbye!', after: end() }], 22.5);
    check('a request with under 3 minutes to the stop does not reopen it; the close goes on', asked.r.state.closeReopened === undefined && asked.r.state.closed);
  }

  console.log('2d. the widened request test, and the old goodbyes');
  {
    const asks = [SAID_1446, SAID_1515, SAID_982, SAID_1703, 'Can we do one more example?'];
    check('the session\'s close-time requests are heard (part named, or "one more")', asks.every((x) => v2AsksMorePractice(x, { plan: GDI })), asks.filter((x) => !v2AsksMorePractice(x, { plan: GDI })));
    check('…two of them were missed before (widened off)', !v2AsksMorePractice(SAID_1446, { plan: GDI, widened: false }) && !v2AsksMorePractice(SAID_1515, { plan: GDI, widened: false }) && !v2AsksMorePractice(SAID_982, { plan: GDI, widened: false }));
    const goodbyes = ['No more questions, thank you', 'I will practice more at home', '次回もっと練習したいです', 'Let\'s do this again sometime.', 'Oh, wait, one more thing.', 'Can I ask one more question?', 'My pronunciation is bad.', 'Okay, pronunciation next time then.'];
    check('the goodbyes that broke 7f are still no request', goodbyes.every((x) => !v2AsksMorePractice(x, { plan: GDI })), goodbyes.filter((x) => v2AsksMorePractice(x, { plan: GDI })));
    const ok = ['Would you like some more practice, or shall we finish here?', 'Do you want to try another one, or are you done?', 'もう少し練習しますか、それとも終わりにしますか？'];
    const not = ['Would you like to practise single words or a whole sentence?', 'Shall we finish here?', 'Can you say one more sentence?'];
    check('the "more, or finish?" ask is recognised; a practice question is not', ok.every(v2ReplyAsksMoreOrFinish) && !not.some(v2ReplyAsksMoreOrFinish), { missed: ok.filter((x) => !v2ReplyAsksMoreOrFinish(x)), caught: not.filter(v2ReplyAsksMoreOrFinish) });
  }

  console.log('fix round 1, I1: a part request mid-lesson never moves the lesson (the review\'s probes)');
  {
    // Minute 6 in Present perfect, one of its two practice sentences said.
    const pp = base([TODAY, JOB, { title: 'Present perfect', items: [card('p2', 'I have worked at my company for five years.')] }], { goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'skipped', at: 0 }, 'topic-intro': { status: 'shown', at: 0 } }, practiceSaid: { 'topic-intro': 3, 'present-perfect': 1 }, history: [u('x'), a('Tell me one sentence with the present perfect.')] });
    const progBefore = prog(pp);
    const said = 'Can we practise the pronunciation of this sentence, please?';
    check('recognised as a part ahead of the position (before the close)', v2PartPracticeAsked(GDI, pp, said)?.ahead === true);
    const r = await run(pp, said, [{ text: 'Sure. <board sentence>I have worked here for five years.</board> Please say it.' }], 6);
    check('no page opened or turned: the card stays on the Present perfect page', titles(r.r.state).join() === 'Today\'s lesson,Your job,Present perfect' && r.r.state.board.current === 2 && !r.r.toolCalls.some((c) => c.name === 'new_page' || c.name === 'go_to_page'), [titles(r.r.state), r.r.toolCalls.map((c) => c.name)]);
    check('position, chip and green unchanged; Present perfect not green, its minimum still owed (1 of 2), parts behind not skipped', v2PartInHand(GDI, r.r.state) === 3 && JSON.stringify(prog(r.r.state)) === JSON.stringify(progBefore) && !prog(r.r.state).completedSegmentIds.includes('present-perfect') && (r.r.state.practiceSaid?.['present-perfect'] ?? 0) === 1, [v2PartInHand(GDI, r.r.state), prog(r.r.state), r.r.state.practiceSaid]);
    check('the facts: they asked for it, it comes later; say so or help in place, go on with the part in hand', /they asked to practise the Pronunciation part, which comes later in the lesson/.test(r.facts), r.facts.split('\n').filter((l) => /comes later/.test(l)));
    // During Conversation (9.9): "more pronunciation".
    const conv = base([TODAY, JOB, PP, PS, CONV], { history: [u('x'), a(CONV_Q)], practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 3, 'open-conversation': 1 } });
    const c = await run(conv, 'Can we do some more pronunciation, please?', [{ text: 'Pronunciation comes a little later. First, what is one project you are proud of?' }], 9.9);
    check('during Conversation: no Pronunciation page; position Conversation; green and the conversation\'s count unchanged', !titles(c.r.state).includes('Pronunciation') && v2PartInHand(GDI, c.r.state) === 5 && JSON.stringify(prog(c.r.state)) === JSON.stringify(prog(conv)) && c.r.state.practiceSaid?.['open-conversation'] === 1, [titles(c.r.state), prog(c.r.state), c.r.state.practiceSaid]);
    // A visit to an earlier part and back, mid-lesson: the position never moves.
    const v = await run(conv, 'Can we do one more present perfect, please?', [{ text: 'Sure. <board problem>Tell me one sentence with "I have worked on".</board>' }], 10);
    check('an earlier part (Present perfect) from Conversation: turned to, position Conversation, no page marked (an existing page)', v.r.state.board.current === 2 && v2PartInHand(GDI, v.r.state) === 5 && !v.r.state.visitPages, [v.r.state.board.current, v.r.state.visitPages]);
    const b = await run(v.r.state, 'I have worked on the donation project for a year.', [{ text: 'Good. <board page>Conversation</board> Now, what is one project you are proud of?' }], 10.5);
    check('…and back: Conversation in view, position and green as before the visit', b.r.state.board.current === 4 && v2PartInHand(GDI, b.r.state) === 5 && JSON.stringify(prog(b.r.state).completedSegmentIds) === JSON.stringify(prog(conv).completedSegmentIds));
  }

  console.log('fix round 2, N1: an answer to the lesson\'s own part ask is the 7a flow\'s alone');
  {
    const now = await partFlowCases() as Record<string, { later: boolean; visit: unknown }>;
    check('A2, A1, B: no "comes later" line, no visit page', Object.values(now).every((c) => !c.later && c.visit === null), now);
    const r = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, NEXT_PUBLIC_TUTOR_V2_PRACTICE_ON_PART_PAGE: 'off', NEXT_PUBLIC_TUTOR_V2_CLOSE_REOPENED: 'off', MIC3_7K_FLOW: '1' }, encoding: 'utf8' });
    const line = (r.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    const before = line ? JSON.parse(line.slice('OFF_JSON '.length)) : { error: r.stderr };
    check('…the board, position, tools and practice count exactly as with both 7k switches off (the 7a flow before this task)', JSON.stringify(before) === JSON.stringify(now), { before, now });
    check('…A2 is 7a\'s release: the Pronunciation page opens on the yes', (now.A2 as unknown as { titles: string[] }).titles.includes('Pronunciation'));
    // A learner bringing up a part beyond the next step on their own still gets the line (minute 6 above), and the next part
    // named without an ask (Past simple in hand, "Can we practise the conversation now?") is the flow's too.
    const ps = base([TODAY, JOB, PP, PS], { history: [u('x'), a('Tell me one more sentence in the past simple.')] });
    const nx = await run(ps, 'Can we practise the conversation now?', [{ text: 'Sure.' }], 9.7);
    check('the next part named with no ask: no "comes later" line (the 7a flow decides)', !/comes later in the lesson/.test(nx.facts));
  }

  console.log('fix round 2, N2: the answer to "more, or finish?" with no time left');
  {
    const r = await run(closing(), SAID_1703, [{ text: R_1703 }], 17.03);
    const asked = await run(r.r.state, 'I have worked on the washing machine project for two years.', [{ text: 'Great sentence. Goodbye!', after: end() }, { text: '' }], 21.4);
    check('(the ask recorded at 21.4)', asked.r.state.closeAsk === 'more' && typeof asked.r.state.closeInvitedAt === 'number', asked.r.state);
    for (const t of [22.5, 24.5]) {
      const y = await run(wire(asked.r.state), 'Yes, please.', [{ text: 'Sure. <board problem>Tell me one more sentence.</board>' }], t);
      check(`${t} (under 3 minutes to the stop): the facts are the normal close (no time for more today, goodbye), never "give one more practice"`, /no time left for more today: thank them/.test(y.facts) && !/give one more practice/.test(y.facts), y.facts.split('\n').filter((l) => /before the close/.test(l)));
      check('…and the reply does not reopen the close', y.r.state.closeReopened === undefined && typeof y.r.state.closeInvitedAt === 'number', [y.r.state.closeReopened, y.r.state.closeInvitedAt]);
    }
    const ok = await run(wire(asked.r.state), 'Yes, please.', [{ text: 'Sure. <board problem>Tell me one more sentence.</board>' }], 21.8);
    check('with time left (21.8): "give one more practice", and the reply reopens the close', /give one more practice/.test(ok.facts) && typeof ok.r.state.closeReopened === 'number');
  }

  console.log('fix round 2, m1: a visit reply cut by a barge-in keeps its page marked');
  {
    const r = await run(closing(), SAID_1515, [{ text: 'Of course. <board sentence>I have worked on this project for two years.</board> Please say this sentence.' }], 15.15);
    const call = r.r.toolCalls.find((c) => c.name === 'new_page')!;
    check('the visit\'s new_page call carries the mark', call.visit === true);
    // The client folds the settled calls of a cut reply onto the state it had before the turn (useV2Turns → foldInterruptedTurn).
    const folded = foldInterruptedTurn(closing(), 'Can we also do some more pronunciation?', 'Of course.', r.r.toolCalls);
    check('foldInterruptedTurn: the Pronunciation page is on the board and marked (visitPages [6])', titles(folded).includes('Pronunciation') && JSON.stringify(folded.visitPages) === '[6]', [titles(folded), folded.visitPages]);
    const later = { ...folded, board: { ...folded.board, pages: folded.board.pages.map((p) => (p.title === 'Pronunciation' ? { ...p, items: [card('x1', 'I have worked on this project for two years.')] } : p)) } };
    check('…so with a card on it later, Pronunciation is still not green, and the position stays Summary', !prog(later).completedSegmentIds.includes('pronunciation') && v2PartInHand(GDI, later) === 7);
  }

  console.log('fix round 1, I2: a plain yes to "more, or finish?" is read by state');
  {
    const r = await run(closing(), SAID_1703, [{ text: R_1703 }], 17.03);
    const ans = await run(r.r.state, 'I have worked on the washing machine project for two years.', [{ text: 'Great sentence. Thank you, Ken, see you next time!', after: end() }, { text: '' }], 17.89);
    check('the ask recorded as "more, or finish?" (closeAsk), and carried', ans.r.state.closeAsk === 'more' && wire(ans.r.state).closeAsk === 'more' && ans.heard.trim().endsWith(V2_CLOSE_MORE_LINE));
    for (const yes of ['Yes, please.', 'はい、お願いします。']) {
      const y = await run(wire(ans.r.state), yes, [{ text: 'Sure. <board problem>Tell me one more sentence with "I have worked on".</board>' }], 18.2);
      check(`"${yes}": the facts press no goodbye (they say: you asked "more, or finish?")`, /you asked whether they would like more practice or to finish/.test(y.facts) && !/then say goodbye and end the lesson in this reply/.test(y.facts) && !/bring the lesson to its close/.test(y.facts), y.facts.split('\n').filter((l) => /before the close|close/.test(l)));
      check('…the reply gave practice and did not end: the close reopened again (the ask comes after it)', typeof y.r.state.closeReopened === 'number' && y.r.state.closeInvitedAt === undefined && y.r.state.closeAsk === undefined);
      const y2 = await run(y.r.state, 'I have worked on the donation project for a year.', [{ text: 'Very good. Goodbye!', after: end() }, { text: '' }], 18.6);
      check('…after that practice: the end deferred once, the ask again', !y2.r.state.closed && y2.end[0] === V2_CLOSE_REOPEN_REFUSAL && y2.heard.trim().endsWith(V2_CLOSE_MORE_LINE) && y2.r.state.closeAsk === 'more', [y2.end, y2.heard]);
      const no = await run(y2.r.state, 'No, thank you.', [{ text: 'Thank you, Ken. Goodbye!', after: end() }], 19);
      check('…"No, thank you.": the lesson ends (end_lesson on the answer turn never refused)', no.r.state.closed && no.end[0] === 'the session is ending', no.end);
    }
    const bye = await run(wire(ans.r.state), 'Keep going.', [{ text: 'Thank you, Ken. Goodbye!', after: end() }], 18.2);
    check('an end on the answer turn is accepted, whatever the words ("Keep going." read as done by the model)', bye.r.state.closed);
  }

  console.log('lessons without labelled plans: nothing turns');
  {
    const plain: LessonPlan = { ...GDI, segments: GDI.segments.map((s) => ({ ...s, metadata: { ...(s.metadata ?? {}), label: undefined } })) as LessonPlan['segments'] };
    check('an unlabelled plan: the recogniser finds no part (recogniser only)', v2PartPracticeAsked(plain, closing(), SAID_1703) === null);
  }

  console.log('each switch off alone (a child run per switch): that item as before');
  {
    const child = (flag: string) => {
      const r = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC3_7K_CHILD: '1' }, encoding: 'utf8' });
      const line = (r.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
      return line ? JSON.parse(line.slice('OFF_JSON '.length)) : { error: r.stderr };
    };
    type P = Awaited<ReturnType<typeof probe>>;
    const on = child('NONE') as P;
    check('(all on in a child: the new behaviour)', on.turned && on.cardOnPage && on.chip === 'past-simple' && on.reopened && !on.ended && on.asked, on);
    const n1 = child('PRACTICE_ON_PART_PAGE') as P;
    check('PRACTICE_ON_PART_PAGE off: no turn, the card on the Conversation page, the chip on Conversation; the close as on', !n1.turned && !n1.cardOnPage && n1.chip === 'open-conversation' && n1.reopened && !n1.ended && n1.asked, n1);
    const n2 = child('CLOSE_REOPENED') as P;
    check('CLOSE_REOPENED off: not reopened, the goodbye and end_lesson after one practice; the page turn as on', n2.turned && n2.cardOnPage && n2.chip === 'past-simple' && !n2.reopened && n2.ended && !n2.asked, n2);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
