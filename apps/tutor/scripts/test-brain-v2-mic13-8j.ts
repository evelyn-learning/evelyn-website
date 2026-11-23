/// <reference types="node" />
/**
 * Tutor brain v2 — Task 8j: mic test 13 (embed-1795453600266, flag 1 at lesson minute 18.6; task-8j-report.md). In the optional
 * Pronunciation part (taken at 16.9; one item, the second try scored 73 at 17.7) the reply to the score gave the result and the stress
 * tip, then opened the Summary page (`<board page>Summary</board>`), gave the summary and ended on the check question: no hand-over,
 * the 7x hold (1 of 2 items) being facts only. Now (SUMMARY_HAND_OVER) the page is held in that reply, which ends with the hand-over,
 * and the Summary opens on the next reply. The session's plan (gdi-work-projects-v1) and real turns (T85–T91). No network, no model,
 * nothing to the speech vendor.
 *   npm run test:brain-v2-mic13-8j
 *
 *  1 T90 → T91 as live: the feedback is said, the Summary page is not opened, nothing of the summary is said or stored, the reply ends
 *    with "one more, or … the summary?"; the summary has not begun; end_lesson in that reply is not accepted
 *  2 the next reply: "The summary, please." → the Summary page opens and the summary begins; the facts carry the summary layout line
 *    (the hold lifted on their words); "One more, please." → the facts still hold the part
 *  3 the hard stop near (23.7 of 20 + 5): the page opens in the same reply, as before; they asked to stop: the same
 *  4 the time up by the wrap (a required part, 18.5): the hand-over is the "now" sentence; the next reply ("Okay.") opens it
 *  5 a lesson without part flow (typed): the same on and off (main's own 6e page offer, as on main 11843955)
 *  6 NEXT_PUBLIC_TUTOR_V2_SUMMARY_HAND_OVER=off (child process): the page opens in the same reply, as at 663fe546
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
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC13_8J_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, JSON.stringify(detail ?? '', null, 1)?.slice(0, 3000)); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Reply = { text: string; tools?: Array<{ name: string; input: Record<string, unknown> }> };
function scripted(replies: Reply[]) {
  const facts: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
    const r = replies[Math.min(i, replies.length - 1)]!; i += 1;
    for (const piece of r.text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece);
    const tools = (r.tools ?? []).map((t, k) => ({ type: 'tool_use', id: `tu_${i}_${k}`, name: t.name, input: t.input }));
    return msg([{ type: 'text', text: r.text }, ...tools], tools.length ? 'tool_use' : 'end_turn');
  };
  return { call, facts };
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
async function run(session: V2Session, st: V2State, said: string | null, replies: Reply[], atMin: number) {
  const heard: string[] = []; const m = scripted(replies);
  const r = await runV2Turn({ session, state: st, studentSaid: said, callModel: m.call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: atMin * MIN });
  const stored = r.state.history.filter((h) => h.role === 'assistant').map((h) => (typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '))).pop() ?? '';
  return { r, heard: heard.join(''), facts: m.facts.join('\n'), stored, summaryOpen: r.state.board.pages.some((p) => p.title === 'Summary'), begun: typeof r.state.summaryBegunAt === 'number',
    ended: r.toolCalls.find((c) => c.name === 'end_lesson')?.outcome ?? '' };
}

async function probe() {
  const live = await run(voice, atT90(), SENT, [T91, { text: '' }], 17.69);
  const next = await run(voice, wire(live.r.state, voice), 'The summary, please.', [SUMMARY_REPLY], 18.0);
  const oneMore = await run(voice, wire(live.r.state, voice), 'One more, please.', [{ text: 'Good. <board sentence>I communicate with customers every day.</board> Listen, then say it after me.' }], 18.0);
  const nearStop = await run(voice, atT90(), SENT, [T91, { text: '' }], 23.7);
  const stop = await run(voice, atT90(), 'I have to finish now.', [T91, { text: '' }], 17.69);
  // 4: a required part (Conversation, Pronunciation left out for time) at 18.5, past the wrap: "now", then their "Okay." opens it.
  const conv = (): V2State => ({ ...atT90(), goals: Object.fromEntries(ids.slice(0, 5).map((id) => [id, { status: 'shown' as const, at: 0 }])), partStart: { part: 'open-conversation', at: 11 * MIN },
    timeFit: { dropped: ['pronunciation'], byArrival: true }, board: { pages: structuredClone(PAGES.slice(0, 6)), current: 5 }, pronunciation: undefined,
    history: [u('x'), a('What did your team do when people made excuses?')] });
  const convReply: Reply = { text: `Candy and emails sound like a friendly way to follow up.\n\n<board sentence>We gave them candy and wrote emails.</board>\n\n<board page>Summary</board>\n\n${SUMMARY_WORDS}` };
  const timeUp = await run(voice, conv(), 'Um, we give them candy and wrote email.', [convReply], 18.5);
  const timeUpNext = await run(voice, wire(timeUp.r.state, voice), 'Okay.', [SUMMARY_REPLY], 18.7);
  const typedLive = await run(typed, atT90(), SENT, [T91, { text: '' }], 17.69);
  return { live, next, oneMore, nearStop, stop, timeUp, timeUpNext, typedLive };
}
type P = Awaited<ReturnType<typeof probe>>;
const slim = (p: P) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, { heard: v.heard, facts: v.facts, stored: v.stored, summaryOpen: v.summaryOpen, begun: v.begun, ended: v.ended }]));

async function main() {
  const p = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(slim(p))}`); return; }

  console.log('1. T90 → T91 as live (17.7, the optional part held at 1 of 2 items)');
  check('the facts held the part (no summary page yet) — the model went to the summary anyway', /Pronunciation part was taken and is not done \(1 of at least 2 items done/.test(p.live.facts), p.live.facts);
  check('the feedback is said', p.live.heard.includes('in-ter-NA-tion-al') && p.live.heard.includes('for you to hear.'), p.live.heard);
  check('the Summary page is not opened; the summary has not begun', !p.live.summaryOpen && !p.live.begun, p.live.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`));
  check('nothing of the summary or the check question is said', !p.live.heard.includes('donation drive') && !/difference between/.test(p.live.heard), p.live.heard);
  check('the reply ends with the hand-over: one more, or the summary', /\n\n(?:Would you like one more, or shall we move on to the summary\?|One more, or shall we go to the summary now\?)$/.test(p.live.heard), p.live.heard.slice(-200));
  check('the stored reply is the feedback and the hand-over (no summary, no Summary page block)', !p.live.stored.includes('donation') && !/<board page>Summary/.test(p.live.stored) && /summary\?$/.test(p.live.stored.trim()), p.live.stored);
  check('end_lesson in that reply is not accepted (it waits for their answer)', /^not ended: this reply ends by asking/.test(p.live.ended) && !p.live.r.state.closed, p.live.ended);

  console.log('2. the next reply');
  check('"The summary, please." → the Summary page opens and the summary begins', p.next.summaryOpen && p.next.begun && p.next.heard.includes('donation drive'), p.next.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`));
  check('…its facts lay out the summary page (the hold lifted on their words)', /summary page: lay the Summary page out/.test(p.next.facts) && !/Pronunciation part was taken and is not done/.test(p.next.facts), p.next.facts);
  check('"One more, please." → the facts still hold the part; no Summary page', /Pronunciation part was taken and is not done/.test(p.oneMore.facts) && !p.oneMore.summaryOpen, p.oneMore.facts);

  console.log('3. the exceptions: the hard stop near, a stop asked');
  check('23.7 of 20 + 5 (1.3 min to the stop): the Summary page opens in the same reply', p.nearStop.summaryOpen && p.nearStop.begun && p.nearStop.heard.includes('donation drive'), p.nearStop.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`));
  check('"I have to finish now." at 17.7: the Summary page opens in the same reply', p.stop.summaryOpen && p.stop.heard.includes('donation drive'), p.stop.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`));

  console.log('4. the time up by the wrap (Conversation, 18.5): the "now" hand-over, then the next reply');
  check('the page is held and the reply ends saying we move to the summary now', !p.timeUp.summaryOpen && /move on to the summary now\.$|go to the summary now\.$/.test(p.timeUp.heard) && !p.timeUp.heard.includes('donation'), p.timeUp.heard);
  check('…the learner\'s card is still painted on the Conversation page', p.timeUp.r.state.board.pages[5]!.items.some((it) => it.summary === 'We gave them candy and wrote emails.'));
  check('"Okay." → the Summary page opens on the next reply', p.timeUpNext.summaryOpen && p.timeUpNext.begun, p.timeUpNext.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`));

  console.log('6. NEXT_PUBLIC_TUTOR_V2_SUMMARY_HAND_OVER=off: as at 663fe546');
  const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, NEXT_PUBLIC_TUTOR_V2_SUMMARY_HAND_OVER: 'off', MIC13_8J_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
  if (!line) { console.log(res.stdout, res.stderr); throw new Error('child gave no result'); }
  const off = JSON.parse(line.slice('OFF_JSON '.length)) as ReturnType<typeof slim>;
  check('off: T91 opens the Summary page in the same reply and the summary begins', off.live!.summaryOpen && off.live!.begun && off.live!.heard.includes('donation drive'), off.live);
  check('off: the 18.5 Conversation reply opens it too', off.timeUp!.summaryOpen, off.timeUp);
  check('off: the exceptions unchanged', off.nearStop!.summaryOpen && off.stop!.summaryOpen);

  console.log('5. a lesson without part flow (typed): the same with the switch on and off (main\'s 6e page offer)');
  check('typed: the words, the board and the stored reply are the same on and off', p.typedLive.heard === off.typedLive!.heard && p.typedLive.summaryOpen === off.typedLive!.summaryOpen && p.typedLive.stored === off.typedLive!.stored, [p.typedLive.heard.slice(-200), off.typedLive!.heard.slice(-200)]);
  check('typed: no 8j hand-over line', !/move on to the summary|go to the summary now/.test(p.typedLive.heard), p.typedLive.heard.slice(-200));

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
