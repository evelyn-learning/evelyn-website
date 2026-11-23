/// <reference types="node" />
/**
 * Tutor brain v2 — Task 8j: mic test 13 (embed-1795453600266, flag 1 at lesson minute 18.6; task-8j-report.md). In the optional
 * Pronunciation part (taken at 16.9; one item, the second try scored 73 at 17.7) the reply to the score gave the result and the stress
 * tip, then opened the Summary page (`<board page>Summary</board>`), gave the summary and ended on the check question: no hand-over,
 * the 7x hold (1 of 2 items) being facts only. Now (SUMMARY_HAND_OVER, fix round 1) the page is held in that reply while the part's 7x
 * hold is active on no closing turn; one continuation call finishes the reply (the promised sentence, then the hand-over ask); the
 * Summary opens on the next reply (state.summaryHandOver) or their go. The session's plan (gdi-work-projects-v1) and real turns
 * (T38, T54, T82–T91). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic13-8j
 *
 *  1 T90 → T91 as live: the learner hears the feedback, then the continuation (the sentence promised, the hand-over ask): no dangling
 *    "Here is the whole sentence again…", no Summary page, nothing of the summary said or stored, the page's cards not painted;
 *    end_lesson deferred with the in-part prefix; summaryHandOver set and round-tripped
 *  2 fallbacks: the continuation fails / writes the Summary page again / asks nothing → the fixed hand-over line, once
 *  3 the next reply: "The summary, please." and a bare "Yes." open the page (state, not wording); "One more, please." keeps the hold
 *  4 never held: a closing turn (23.7: the time up; a stop asked; end_lesson because the student asked; the wrap due), a reply whose own
 *    words began the summary (no duplicate announcement), a required part's reply with no 7x hold, an in-part deferral already given
 *  5 the whole close after a hand-over (8d): summary once with its headings and marks, check question once, invitation, short goodbye
 *  6 a lesson without part flow (typed): identical on and off
 *  7 NEXT_PUBLIC_TUTOR_V2_SUMMARY_HAND_OVER=off (child process): as at 663fe546
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { V2_HAND_OVER_CONTINUE } from '../src/lib/tutor/v2/summary-hand-over';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC13_8J_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, JSON.stringify(detail ?? '', null, 1)?.slice(0, 3000)); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Reply = { text: string; tools?: Array<{ name: string; input: Record<string, unknown> }>; fail?: boolean; hang?: boolean };
function scripted(replies: Reply[]) {
  const facts: string[] = []; let i = 0; let cont = false;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string }>) { if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text); if (b.type === 'text' && b.text === V2_HAND_OVER_CONTINUE) cont = true; }
    const r = replies[Math.min(i, replies.length - 1)]!; i += 1;
    if (r.fail) throw new Error('the model call failed');
    if (r.hang) { onText?.('Listen once more: '); return new Promise<Anthropic.Message>(() => undefined); }
    for (const piece of r.text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece);
    const tools = (r.tools ?? []).map((t, k) => ({ type: 'tool_use', id: `tu_${i}_${k}`, name: t.name, input: t.input }));
    return msg([{ type: 'text', text: r.text }, ...tools], tools.length ? 'tool_use' : 'end_turn');
  };
  return { call, facts, calls: () => i, cont: () => cont };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
// The session's box: 20 minutes (hard stop 25), the wrap at 18; Japanese support; pronunciation measured.
const voice: V2Session = { studentName: 'Praveen', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI, pronunciation: true,
  teacher: { name: 'Ryota', background: 'I help Japanese professionals speak English at work.' } };
const typed: V2Session = { ...voice, mode: 'text' };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const ids = GDI.segments.map((s) => s.id);

// The session's transcript T82–T90 (tutorsessions row, transcript) and the Pronunciation page (WB64–WB66). T82's part ask led to the
// Pronunciation page (released on T83/T84's yes, stored at the head of T85), so the 6e frame budget does not hold the Summary page
// (part-close.ts v2FrameDue: never at two part changes running), as live.
const T82 = 'Emotion made a real difference there. Your team\'s conversation was done well. Next is Pronunciation, which is optional: would you like to practice a few words or sentences, or go straight to the summary?';
// T38 and T54: the part asks the 6e budget counts (two frames that led to a page), as in the live history.
const T38 = '「I」の場合は「have」を使います。「has」は「he」「she」「it」など三人称の単数に使います。\n\nそれで分かりましたか。分かったら、過去形の練習に進みましょうか、それとも他に質問がありますか。';
const T54 = 'Yes, that\'s right: "We discussed how to sell washing machines in Canada." 過去形の練習はここまでです。次は「Open conversation」で、仕事やプロジェクトについて自由に話します。何か質問がありますか、それとも次に進みましょうか。';
const T85 = 'Let\'s start the pronunciation practice.\n\nWhich one would you like?';
const T87 = 'まず私が言うので、聞いてから、同じように言ってみてください。\n\nI have worked with international customers for several years.';
const T89 = 'Please say the whole sentence once more, from the beginning.';
const SENT = 'I have worked with international customers for several years.';
const PAGES: V2BoardPage[] = [
  { title: 'Overview', items: [] }, { title: 'Level check', items: [] }, { title: 'Your job', items: [{ id: 'j1', tool: 'show_sentence', summary: 'I sell washing machines to customers.' }] },
  { title: 'Present perfect', items: [{ id: 'p1', tool: 'show_sentence', summary: 'I have worked at Nagoya Corporation for seven years.' }] },
  { title: 'Past simple', items: [{ id: 's1', tool: 'show_sentence', summary: 'I attended a robotics exhibition in Tokyo last year.' }] },
  { title: 'Conversation', items: [{ id: 'c1', tool: 'show_sentence', summary: 'We gave them candy and wrote emails.' }] },
  { title: 'Pronunciation', items: [{ id: 'inl_mwtjbhpx_1', tool: 'show_problem', summary: 'Question — You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue.' }, { id: 'inl_mwtjbnow_1', tool: 'show_sentence', summary: SENT }] },
];
const goals = Object.fromEntries(ids.slice(0, 6).map((id) => [id, { status: id === 'open-conversation' ? 'demonstrated' as const : 'shown' as const, at: 0 }]));
/** T90's moment: the second try scored 73 (pronunciation_scored #2 at 17:41.08); the part entered at 16:52.6. */
const atT90 = (): V2State => ({
  ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, timeFit: { dropped: [], byArrival: true }, goals,
  partStart: { part: 'pronunciation', at: 16.876 * MIN }, board: { pages: structuredClone(PAGES), current: 6 },
  pronunciation: { seq: 2, armed: { seq: 2, items: [SENT], reference: SENT, attempt: 2 }, heard: { seq: 2, status: 'measured', overall: 73, words: [{ word: 'international', score: 55 }] } },
  history: [u('x'), a('<board page>Overview</board>\nHello, Praveen…'), a(T38), u('Yes.'), a('<board page>Past simple</board>\nDid you attend any business events or exhibitions last year?'), a(T54), u('Yes.'), a('<board page>Conversation</board>\nWhat is one project you\'ve worked on that you\'re particularly proud of?'), a(T82), u('Yes. pronunciation.'), a(`<board page>Pronunciation</board>\n${T85}`), u('A complete sentence.'), a(T87), u('I have worked with'), a(T89)],
});
// T91 as the model wrote it (transcript T91; WB68–WB73 and the tool order of the log: new_page, annotate ×2, show_sentence, end_lesson,
// show_problem): the score and tip, the Summary page, the summary, the check question.
const FEEDBACK = 'You scored 73 out of 100 on that try. The word "international" was the weakest, so the stress falls on "NA": in-ter-NA-tion-al, with a "sh" sound in the middle. Here is the whole sentence again, for you to hear.';
const SUMMARY_WORDS = 'You talked clearly about your job, your team, and a project you are proud of, and your story about the donation drive was easy to follow.';
const T91: Reply = { text: `${FEEDBACK}\n\n<board page>Summary</board>\n<board note gloss="今回のまとめです">Present perfect: "I have worked with international customers for several years." (experience that continues now)</board>\n<board note gloss="今回のまとめです">Past simple: "I attended a robotics exhibition in Tokyo last year." (a finished event at a specific time)</board>\n<board sentence gloss="発音の練習です">${SENT}</board>\n\n${SUMMARY_WORDS} Keep the sentence about your job, and practice "international" when you speak with customers.\n\nBefore we finish, can you explain the difference between these two sentences?\n<board problem gloss="この二つの文の違いを説明してください。">Can you explain the difference between these two sentences? "I have worked here for five years." "I worked here five years ago."</board>`,
  tools: [{ name: 'end_lesson', input: { because: 'time_nearly_used' } }] };
const SUMMARY_REPLY: Reply = { text: `Great work today! Let's quickly review.\n\n<board page>Summary</board>\n<board note>Present perfect: experience that continues now.</board>\n\n${SUMMARY_WORDS} Can you explain the difference between "I have worked here for five years" and "I worked here five years ago"?` };

const wire = (st: V2State, s: V2Session) => v2ScopeCarried(v2ReadClientState(JSON.parse(JSON.stringify(st)))!, s);
const textOf = (h: V2State['history'][number]) => (typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '));
async function run(session: V2Session, st: V2State, said: string | null, replies: Reply[], atMin: number) {
  const heard: string[] = []; const m = scripted(replies); const before = st.history.length;
  const r = await runV2Turn({ session, state: st, studentSaid: said, callModel: m.call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: atMin * MIN });
  const stored = r.state.history.slice(before).filter((h) => h.role === 'assistant').map(textOf).join(' ');
  return { r, heard: heard.join(''), facts: m.facts.join('\n'), stored, summaryOpen: r.state.board.pages.some((p) => p.title === 'Summary'), begun: typeof r.state.summaryBegunAt === 'number',
    ended: r.toolCalls.find((c) => c.name === 'end_lesson')?.outcome ?? '', calls: m.calls(), cont: m.cont(), painted: r.toolCalls.filter((c) => !/^not /.test(c.outcome)).map((c) => c.name), handOver: r.state.summaryHandOver };
}
const count = (t: string, x: string) => t.split(x).length - 1;

// The continuation as a model would write it: the sentence promised, then the ask (the instruction asks for two short sentences).
const CONT: Reply = { text: `${SENT} Would you like one more, or shall we move on to the summary?` };
const CONT_NO_ASK: Reply = { text: `${SENT}` };
const CONT_PAGE: Reply = { text: `${SENT}\n\n<board page>Summary</board>\n${SUMMARY_WORDS}` };
// The close after the hand-over (the 8d steps, as a model would write them).
const CLOSE_SUMMARY: Reply = { text: `Great work today! Let's quickly review.\n\n<board page>Summary</board>\n<board note>Present perfect: experience that continues now.</board>\n<board sentence>I have worked at Nagoya Corporation for seven years.</board>\n<board sentence stress="gave | emails">We gave them candy and wrote emails.</board>\n\n${SUMMARY_WORDS} One thing to improve: "We gave them candy and wrote emails."\n\nBefore we finish, one question for you.\n<board problem>Can you explain the difference between "I have worked here for five years." and "I worked here five years ago."?</board>` };
const CHECK_ANSWER = 'I have worked here for 5 years means I still work there and I worked there 5 years ago means I don\'t work here.';
const INVITE: Reply = { text: 'Yes, that\'s exactly right. Do you have any questions before we finish?' };
const GOODBYE: Reply = { text: 'Thank you, Praveen, and good work today. Goodbye, and see you next time!', tools: [{ name: 'end_lesson', input: { because: 'lesson_complete' } }] };
const withCorrections = (st: V2State): V2State => ({ ...st, corrections: [{ said: 'Um, we give them candy and wrote email.', sentence: 'We gave them candy and wrote emails.', stress: ['gave', 'emails'] }] });

async function probe() {
  // 1
  const live = await run(voice, withCorrections(atT90()), SENT, [T91, CONT], 17.69);
  // 2
  const failed = CHILD ? live : await run(voice, atT90(), SENT, [T91, { text: '', fail: true }], 17.69);
  const timedOut = CHILD ? live : await run(voice, atT90(), SENT, [T91, { text: '', hang: true }], 17.69);
  const pageAgain = await run(voice, atT90(), SENT, [T91, CONT_PAGE], 17.69);
  const noAsk = await run(voice, atT90(), SENT, [T91, CONT_NO_ASK], 17.69);
  // 3
  const next = await run(voice, wire(live.r.state, voice), 'The summary, please.', [SUMMARY_REPLY], 18.0);
  const bareYes = await run(voice, wire(live.r.state, voice), 'Yes.', [SUMMARY_REPLY], 18.0);
  const oneMore = await run(voice, wire(live.r.state, voice), 'One more, please.', [{ text: 'Good. <board sentence>I communicate with customers every day.</board> Listen, then say it after me.' }], 18.0);
  // 4
  const nearStop = await run(voice, atT90(), SENT, [T91, { text: '' }], 23.7);
  const stop = await run(voice, atT90(), 'I have to finish now.', [T91, { text: '' }], 17.69);
  const studentAsked = await run(voice, atT90(), 'Sorry, my next meeting is starting.', [{ ...T91, tools: [{ name: 'end_lesson', input: { because: 'student_asked' } }] }, { text: '' }], 17.69);
  const wrap = await run(voice, { ...atT90(), timeFit: { dropped: [], byArrival: true }, partStart: { part: 'pronunciation', at: 16.876 * MIN } }, SENT, [T91, { text: '' }], 21.0);
  const began = await run(voice, atT90(), SENT, [{ text: `${FEEDBACK.replace(' Here is the whole sentence again, for you to hear.', '')} Great work today! Here is a quick summary.\n\n<board page>Summary</board>\n${SUMMARY_WORDS}` }, { text: '' }], 17.69);
  const conv = (): V2State => ({ ...atT90(), goals: Object.fromEntries(ids.slice(0, 5).map((id) => [id, { status: 'shown' as const, at: 0 }])), partStart: { part: 'open-conversation', at: 11 * MIN },
    board: { pages: structuredClone(PAGES.slice(0, 6)), current: 5 }, pronunciation: undefined, history: [...atT90().history.slice(0, 8)] });
  const convReply: Reply = { text: `Candy and emails sound like a friendly way to follow up.\n\n<board sentence>We gave them candy and wrote emails.</board>\n\n<board page>Summary</board>\n\n${SUMMARY_WORDS}` };
  const required = await run(voice, conv(), 'Um, we give them candy and wrote email.', [convReply, { text: '' }], 16.3);
  const deferredState = atT90(); deferredState.history.push(u('responsibilities.'), { role: 'assistant', content: [{ type: 'tool_use', id: 'tu_x', name: 'end_lesson', input: { because: 'time_nearly_used' } }] } as unknown as V2State['history'][number], { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'tu_x', content: 'not ended yet, in the part: they chose the optional Pronunciation part and its minutes are not over.' }] } as unknown as V2State['history'][number], a(T89));
  const deferredBefore = await run(voice, deferredState, SENT, [T91, { text: '' }], 17.69);
  // 5: the whole close after the hand-over
  const c1 = await run(voice, wire(live.r.state, voice), 'The summary, please.', [CLOSE_SUMMARY], 18.1);
  const c2 = await run(voice, wire(c1.r.state, voice), CHECK_ANSWER, [INVITE], 18.9);
  const c3 = await run(voice, wire(c2.r.state, voice), 'Uh no.', [GOODBYE], 19.1);
  // 6
  const typedLive = await run(typed, atT90(), SENT, [T91, { text: '' }], 17.69);
  return { live, failed, timedOut, pageAgain, noAsk, next, bareYes, oneMore, nearStop, stop, studentAsked, wrap, began, required, deferredBefore, c1, c2, c3, typedLive };
}
type P = Awaited<ReturnType<typeof probe>>;
const slim = (p: P) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, { heard: v.heard, facts: v.facts, stored: v.stored, summaryOpen: v.summaryOpen, begun: v.begun, ended: v.ended, calls: v.calls, cont: v.cont }]));

async function main() {
  const p = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(slim(p))}`); return; }
  const HAND = 'Would you like one more, or shall we move on to the summary?';

  console.log('1. T90 → T91 as live (17.7, the optional part held at 1 of 2 items)');
  check('the facts held the part (no summary page yet) — the model went to the summary anyway', /Pronunciation part was taken and is not done \(1 of at least 2 items done/.test(p.live.facts), p.live.facts);
  check('two model calls: the reply, then one continuation with the hand-over instruction', p.live.calls === 2 && p.live.cont, p.live.calls);
  check('the learner hears the feedback, then the sentence promised, then the hand-over ask, once', p.live.heard.startsWith('You scored 73') && /for you to hear\.[\s\S]*I have worked with international customers for several years\. Would you like one more, or shall we move on to the summary\?$/.test(p.live.heard.trim()) && count(p.live.heard, HAND) === 1, p.live.heard);
  check('no dangling promise: the sentence card\'s words are said after "for you to hear"', p.live.heard.indexOf(SENT, p.live.heard.indexOf('for you to hear')) > 0);
  check('the Summary page is not opened; the summary has not begun; nothing of the summary or check said', !p.live.summaryOpen && !p.live.begun && !p.live.heard.includes('donation drive') && !/difference between/.test(p.live.heard), p.live.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`));
  check('no card of the Summary page painted (notes, sentence, check card)', !p.live.painted.some((n) => n === 'annotate' || n === 'show_problem') && p.live.r.state.board.pages[6]!.items.length === 2, p.live.painted);
  check('stored: the feedback and the continuation, no summary, no Summary page block', p.live.stored.includes('for you to hear.') && p.live.stored.includes(HAND) && !p.live.stored.includes('donation') && !/<board page>Summary/.test(p.live.stored), p.live.stored);
  check('end_lesson deferred with the in-part prefix (counted with 7v\'s)', p.live.ended.startsWith('not ended yet, in the part:') && !p.live.r.state.closed, p.live.ended);
  check('summaryHandOver is set and survives the round trip', typeof p.live.handOver === 'number' && wire(p.live.r.state, voice).summaryHandOver === p.live.handOver, p.live.handOver);

  console.log('2. fallbacks');
  check('the continuation fails: the words before the page, then the fixed line', /for you to hear\.\s*Would you like one more, or shall we move on to the summary\?$/.test(p.failed.heard.trim()) && !p.failed.summaryOpen && typeof p.failed.r.state.summaryHandOver === 'number', p.failed.heard);
  check('the continuation runs past its time limit (10 s): what it streamed stays, then the fixed line, once; the turn ends', count(p.timedOut.heard, HAND) === 1 && p.timedOut.heard.trim().endsWith(HAND) && !p.timedOut.summaryOpen, p.timedOut.heard);
  check('the continuation writes the Summary page again: held, its words not said, the fixed line once', !p.pageAgain.summaryOpen && !p.pageAgain.heard.includes('donation') && count(p.pageAgain.heard, HAND) === 1, p.pageAgain.heard);
  check('the continuation asks nothing: the fixed line added, once', count(p.noAsk.heard, HAND) === 1 && p.noAsk.heard.trim().endsWith(HAND), p.noAsk.heard);

  console.log('3. the next reply');
  check('"The summary, please." → the Summary page opens and the summary begins; the layout line is in its facts', p.next.summaryOpen && p.next.begun && /summary page: lay the Summary page out/.test(p.next.facts), p.next.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`));
  check('a bare "Yes." → the page opens (by state)', p.bareYes.summaryOpen && p.bareYes.begun, p.bareYes.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`));
  check('…the hand-over state is spent after that reply', p.next.r.state.summaryHandOver === undefined);
  check('"One more, please." → the facts still hold the part; no Summary page', /Pronunciation part was taken and is not done/.test(p.oneMore.facts) && !p.oneMore.summaryOpen, p.oneMore.facts);

  console.log('4. never held');
  for (const [k, label] of [['nearStop', '23.7 of 20 + 5 (the time up)'], ['stop', '"I have to finish now."'], ['studentAsked', 'end_lesson because the student asked'], ['wrap', 'the wrap due at 21.0'], ['required', 'Conversation (no 7x hold) at 16.3'], ['deferredBefore', 'an in-part deferral already given, with end_lesson']] as const) {
    const x = p[k];
    check(`${label}: no hold: ${k === 'required' ? 'as off (below)' : 'the Summary page opens in the same reply'}, no continuation, no hand-over line`, (k === 'required' || x.summaryOpen) && !x.cont && !x.heard.includes(HAND) && x.r.state.summaryHandOver === undefined, [x.heard.slice(-200), x.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`)]);
  }
  check('the reply\'s own words began the summary: the page opens, no second announcement', p.began.summaryOpen && !p.began.heard.includes(HAND) && count(p.began.heard, 'summary') === 1, p.began.heard);

  console.log('5. the whole close after the hand-over (8d)');
  const summaryPages = (st: V2State) => st.board.pages.filter((pg) => pg.title === 'Summary');
  const sp = summaryPages(p.c3.r.state)[0];
  check('the summary is given once: one Summary page, begun on the reply after the hand-over', summaryPages(p.c3.r.state).length === 1 && p.c1.begun && count(`${p.c1.heard} ${p.c2.heard} ${p.c3.heard}`, 'donation drive') === 1);
  check('its runtime headings and marks: "To improve" before the correction card, which carries its marks', !!sp && sp.items.some((it) => /To improve/.test(it.summary)) && sp.items.findIndex((it) => /To improve/.test(it.summary)) < sp.items.findIndex((it) => it.summary === 'We gave them candy and wrote emails.'), sp?.items);
  check('the check question once (card + words), in the summary reply only', count(`${p.c1.heard} ${p.c2.heard} ${p.c3.heard}`, 'difference between') === 1 && sp!.items.filter((it) => it.tool === 'show_problem').length === 1, [p.c1.heard, p.c2.heard]);
  check('the invitation after their answer', /any questions before we finish\?/.test(p.c2.heard) && typeof p.c2.r.state.closeInvitedAt === 'number', p.c2.heard);
  check('the short goodbye and end_lesson accepted', p.c3.r.state.closed && /Goodbye/.test(p.c3.heard) && !/^not /.test(p.c3.ended), [p.c3.heard, p.c3.ended]);
  check('no hand-over line anywhere in the close', ![p.c1, p.c2, p.c3].some((x) => x.heard.includes(HAND)));

  console.log('6. a lesson without part flow (typed) and 7. the switch off');
  const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, NEXT_PUBLIC_TUTOR_V2_SUMMARY_HAND_OVER: 'off', MIC13_8J_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
  if (!line) { console.log(res.stdout, res.stderr); throw new Error('child gave no result'); }
  const off = JSON.parse(line.slice('OFF_JSON '.length)) as ReturnType<typeof slim>;
  check('typed: the words, the board and the stored reply are the same on and off', p.typedLive.heard === off.typedLive!.heard && p.typedLive.summaryOpen === off.typedLive!.summaryOpen && p.typedLive.stored === off.typedLive!.stored, [p.typedLive.heard.slice(-200), off.typedLive!.heard.slice(-200)]);
  check('off: T91 opens the Summary page in the same reply and the summary begins, no continuation, as at 663fe546', off.live!.summaryOpen && off.live!.begun && off.live!.heard.includes('donation drive') && !off.live!.cont, off.live);
  check('off: the closing turns are the same as on (never held either way)', (['nearStop', 'stop', 'studentAsked', 'wrap', 'required', 'deferredBefore', 'began'] as const).every((k) => off[k]!.heard === p[k].heard && off[k]!.summaryOpen === p[k].summaryOpen), (['nearStop', 'stop', 'studentAsked', 'wrap', 'required', 'deferredBefore', 'began'] as const).filter((k) => off[k]!.heard !== p[k].heard));

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
