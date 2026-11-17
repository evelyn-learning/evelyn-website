/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7e: the runtime gaps the real-voice replay round 5 found (v2audio-7, c0ee0314;
 * docs/superpowers/plans/gdi-v2-baseline/v2audio-7/RESULTS.md). Each case uses the turn shapes and the real replies from
 * the transcripts (boards/*.txt). No network, no model: scripted runV2Turn walks.
 *   npm run test:brain-v2-replay-7e
 *
 *  1. Check-in after a reply that already asks (check D): "Start with: …", "Please answer with …", Japanese か questions
 *  2. Going back to an earlier page is a look, not a move (Tester A T77–T78); no runtime part ask after a reply's own
 *  3. A content answer to a part ask, then the next part taught on the old page (James T25–T33)
 *  4. Text runs: the text path is untouched (goodbye + menu predates Task 7: report)
 *  5. Kill switches
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { v2AsksInJapanese, v2HandsOver, v2ReplyAsks, v2ReplyHandsOver } from '../src/lib/tutor/v2/one-question';
import { V2_PART_ASKS, v2OpenPagePart, v2PartInHand } from '../src/lib/tutor/v2/part-flow';
import { v2Progress } from '../src/lib/tutor/v2/progress';
import { V2_CHECK_INS, runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State, type V2ToolCall } from '../src/lib/tutor/v2/types';
import { TUTOR_V2_ASK_NO_CHECKIN, TUTOR_V2_HELD_PART_RELEASE, TUTOR_V2_PART_POSITION_KEPT } from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
/** The reply streamed in small pieces, then its tool calls; a second call says nothing more. Records the facts. */
function streaming(text: string, facts: string[], after: unknown[] = []): V2ModelCall {
  let n = 0;
  return async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
    n += 1;
    if (n > 1) return msg([], 'end_turn');
    for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece);
    return msg([{ type: 'text', text }, ...after], after.length ? 'tool_use' : 'end_turn');
  };
}
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(__dirname, '..', '..', '..', 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const voice: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
const text: V2Session = { ...voice, mode: 'text' };
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });

interface Step { state: V2State; spoken: string; calls: V2ToolCall[]; stored: string; facts: string[] }
let clock = 60_000;
async function turn(session: V2Session, state: V2State, said: string | null, reply: string): Promise<Step> {
  const calls: V2ToolCall[] = []; let out = ''; const facts: string[] = [];
  clock += 30_000;
  const r = await runV2Turn({ session, state, studentSaid: said, callModel: streaming(reply, facts), nowMs: clock, boardPass: false, mathsCheck: false, onToolCall: (c) => calls.push(c), onText: (t) => { out += t; } });
  const m = [...r.state.history].reverse().find((x) => x.role === 'assistant');
  const stored = !m ? '' : typeof m.content === 'string' ? m.content : m.content.map((c) => (c.type === 'text' ? c.text : '')).join(' ');
  return { state: r.state, spoken: out, calls, stored, facts };
}
const checkIns = (s: string) => V2_CHECK_INS.filter((x) => s.includes(x)).length;
const chips = (st: V2State) => { const p = v2Progress(GDI, st.goals, st); return { lit: p.currentSegmentId, green: p.completedSegmentIds }; };
const openTitle = (st: V2State) => st.board.pages[st.board.current]?.title ?? '';
const pages = (titles: string[], current: number): V2State['board'] => ({ pages: titles.map((title) => ({ title, items: [] })), current });
const level = { level: 'intermediate' as const, from: 'this_lesson' as const };
const shown = (at: number) => ({ status: 'shown' as const, at });

// The real replies (boards/audio-*.txt), as the model wrote them.
const A_T26 = 'Yes, you have! 経理の仕事を何年しているかを、文で言ってみましょう。Start with: I have worked in accounting for…';
const A_T34 = 'その仕事の内容は分かりました。今は年数を聞いています。経理の仕事を何年しているか、教えてください。Please answer with a number: I have worked in accounting for…';
const A_T54 = '正しい文は「No, I didn\'t.」です。「yesterday」があるので、現在完了ではなく過去形を使います。\n\nPast simple はこれで終わりです。次は Conversation で、あなたの仕事について少し話しましょう。質問がありますか、それとも次に進みますか。';
const A_T71 = 'すみません、今の答えは私の質問と合っていないようです。もう一度言ってもらえますか。\n\nThe sentence on the board is: I think we learned it with help from our accounting office staff. 経理課のスタッフの助けを借りた、という意味です。';
const J_T31 = 'すみません、よく聞き取れませんでした。もう一度言ってもらえますか？ Next is past simple. Shall we go on? Or do you have a question first?';
const B_T59 = '「worked on」を使うと、もっと自然になります。「I worked on a project to support SNS networking content.」と言います。\n\nこの文をもう一度言ってみてください。その後、このプロジェクトであなたの役割は何でしたか？';
const A_T78 = 'Thank you for your answers today. We\'ll stop the conversation here. 今日は、プロジェクトの話をたくさんしてくれました。\n\nNext is Pronunciation, a short optional practice. Shall we go on, or do you have a question first?';
const J_T25 = 'Seven years as an engineer, that\'s a good start. Here\'s the full sentence: "I have been an engineer for seven years." Next is the present perfect, for experience that started in the past and continues now. Do you have a question first, or shall we go on?';
const J_T27 = '「I work here」は今の状態ですが、「7年間ずっと」は過去から今まで続いているので、現在完了を使います。Say: "I have worked here for seven years." 「have worked」がポイントです。\n\nもう一度、言ってみてください。';
const J_T29 = 'Yes, that\'s right: "I have worked here for seven years." 現在完了の文が言えました。\n\nNext is the past simple, for finished events at a specific time. \n\nDo you have a question before we go on, or are you ready?';
const J_T33 = 'Now the past simple. We use it for something that finished at a specific time in the past, like yesterday, last year, or three years ago. Now you say one. Use "I joined" and "three years ago."';

// Tester A, past simple in hand (T50–T56 shape).
const pastSimple = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: level, goals: { overview: shown(1), 'topic-intro': shown(2), 'present-perfect': shown(3) }, board: pages(['Overview', 'Your job', 'Present perfect', 'Past simple'], 3), history: [u('x'), a('Please say it once more: No, I didn\'t.')], ...extra });
// Tester A at T77: conversation in hand, then go_to_page back to "Past simple" for more examples.
const conversationLookedBack = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: level, goals: { overview: shown(1), 'topic-intro': shown(2), 'present-perfect': shown(3), 'past-simple': shown(4) }, board: pages(['Overview', 'Your job', 'Present perfect', 'Past simple', 'Conversation'], 3),
  history: [u('x'), a('Past simple is done. Next is Conversation. Shall we go on, or do you have a question first?'), u('Yes.'), a('Now, what was the hard part of the project? Try starting with: The hard part was…'), u('Could you give me some more example of past simple?'), a('過去形の例をもう少し出しますね。これで分かりましたか。分かったら、次は「The hard part was…」で、プロジェクトの大変だった部分を一つ話してみてください。')], ...extra });
// James, on the job's page after the level check (T23 shape).
const jobInHand = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: level, goals: { overview: shown(1), 'level-check': { status: 'demonstrated', at: 2 } }, board: pages(['Overview', 'Your job'], 1), history: [u('hi'), a('では、仕事について話しましょう。'), u('Uh, sorry? Again'), a('もう一度ゆっくり言います。 "I am an engineer. I make cars." では、同じように言ってみてください。 "I am an engineer."')], ...extra });

async function offChild() {
  const t26 = await turn(voice, pastSimple(), 'Yes, I have.', A_T26);
  const back = conversationLookedBack();
  const t78 = await turn(voice, back, null, A_T78);
  let st = (await turn(voice, jobInHand(), 'Uh, yes. For 7 year.', J_T25)).state;
  const held25 = st.heldPage?.part ?? null;
  st = (await turn(voice, st, 'I work here for 7 years.', J_T27)).state;
  const t29 = await turn(voice, st, 'I have worked here for 7 years.', J_T29);
  console.log(`OFF_JSON ${JSON.stringify({ flags: [TUTOR_V2_ASK_NO_CHECKIN, TUTOR_V2_PART_POSITION_KEPT, TUTOR_V2_HELD_PART_RELEASE], t26: checkIns(t26.spoken), inHand: v2PartInHand(GDI, back), t78: /Next comes conversation|Next is conversation|Next up is conversation|Next we have conversation/.test(t78.spoken), held25, t29open: openTitle(t29.state), t29held: t29.state.heldPage?.part ?? null })}`);
}

async function main() {
  if (process.env.REPLAY_7E_OFF_CHILD === '1') { await offChild(); return; }

  console.log('1. check D: no check-in after a reply that already asks');
  {
    check('T26 "Start with: I have worked in accounting for…" hands over, as the last sentence', v2HandsOver('Start with: I have worked in accounting for…') && v2ReplyAsks(A_T26));
    check('T34 "Please answer with a number: …" hands over', v2HandsOver('Please answer with a number: I have worked in accounting for…') && v2ReplyAsks(A_T34));
    check('…and "Begin with", "Answer in English", "Complete the sentence", "Fill in the blank" do too', ['Begin with: Last year, I…', 'Answer in English, please.', 'Complete the sentence: I have worked here for…', 'Fill in the blank with your number of years.'].every(v2HandsOver));
    // (board-timing.ts asksAnywhere keeps its own older reading of the last two sentences; untouched here.)
    check('the hand-over is told by position: "Start with the equation." earlier in an explanation hands nothing over', !v2ReplyHandsOver('Start with the equation y = 2x. We subtract 2 from both sides. That leaves 2x on the left. Dividing by 2, x is 3.') && !v2ReplyAsks('Start with the equation y = 2x. We subtract 2 from both sides. That leaves 2x on the left. Dividing by 2, x is 3.'));
    check('T54 the Japanese part ask ending 「か。」 is a question', v2ReplyAsks(A_T54) && v2AsksInJapanese('質問がありますか、それとも次に進みますか。'));
    check('T71 「もう一度言ってもらえますか。」 asks, even with an explanation after it', v2ReplyAsks(A_T71));
    check('「か？」「ですか」「ましょうか」 and the full-width ？ are questions', ['次に進みましょうか', '大丈夫ですか', 'もう一度言ってもらえますか？', '質問はありますか？'].every((x) => v2ReplyAsks(`いい答えです。${x}`)));
    check('「そうですか。」 (an "I see") is no question: a reply that only says so still gets its check-in', !v2ReplyAsks('なるほど、そうですか。The past simple is for a finished time.') && !v2AsksInJapanese('そうですか。'));
    for (const [label, said, reply] of [['T26', 'Yes, I have.', A_T26], ['T34', 'I do emails and sorting out some documents.', A_T34], ['T54', 'No, I have not.', A_T54], ['T71', 'No, I have not.', A_T71]] as const) {
      const t = await turn(voice, pastSimple(), said, reply);
      check(`${label}: the runtime adds no check-in (spoken and stored)`, checkIns(t.spoken) === 0 && checkIns(t.stored) === 0, t.spoken);
    }
    const plain = await turn(voice, pastSimple(), 'No, I have not.', 'なるほど、そうですか。The past simple is for a finished time, like yesterday.');
    check('…a reply that asks nothing still gets one', checkIns(plain.spoken) === 1, plain.spoken);
    for (const [label, reply] of [['James T31', J_T31], ['Tester B T59', B_T59]] as const) {
      const t = await turn(voice, pastSimple(), 'Uh, time management.', reply);
      check(`${label}: both questions are the model's own (model variance): the runtime adds nothing to them`, checkIns(t.spoken) === 0 && !V2_PART_ASKS.some((x) => t.spoken.includes(x) && !reply.includes(x)), t.spoken);
    }
  }

  console.log('2. going back to an earlier page is a look, not a move (Tester A T77–T78)');
  {
    const back = conversationLookedBack();
    check('after go_to_page back to "Past simple": the part in hand stays conversation (the furthest reached)', v2PartInHand(GDI, back) === GDI.segments.findIndex((s) => s.id === 'open-conversation') && openTitle(back) === 'Past simple', v2PartInHand(GDI, back));
    check('…as before 7e it followed the page in view (kept = false)', v2OpenPagePart(GDI, back.board, false) === GDI.segments.findIndex((s) => s.id === 'past-simple'));
    const c = chips(back);
    check('the lit chip does not jump back: conversation lit, past simple green', c.lit === 'open-conversation' && c.green.includes('past-simple') && !c.green.includes('open-conversation'), c);
    const revisit = { ...back, board: pages(['Overview', 'Your job', 'Present perfect', 'Past simple', 'Conversation', 'Past simple'], 5) };
    check('a new page headed by a part already paged is a revisit too', v2PartInHand(GDI, revisit) === GDI.segments.findIndex((s) => s.id === 'open-conversation'));
    const t78 = await turn(voice, back, null, A_T78);
    check('T78: the model\'s repeated ask is dropped and the runtime asks once, without naming conversation again', !/Next (?:comes|is|up is|we have) conversation/i.test(t78.spoken) && V2_PART_ASKS.filter((x) => t78.spoken.includes(x)).length === 1 && t78.spoken.includes('Next is Pronunciation'), t78.spoken);
    check('…and pronunciation (the part the reply named) waits for their yes', t78.state.heldPage?.part === 'pronunciation', t78.state.heldPage);
    const yes = await turn(voice, t78.state, 'Yes.', 'Let\'s practise one word: responsibilities. Please say it.');
    check('…"Yes." opens the Pronunciation page, and its chip lights', openTitle(yes.state) === 'Pronunciation' && chips(yes.state).lit === 'pronunciation' && chips(yes.state).green.includes('open-conversation'), { open: openTitle(yes.state), chips: chips(yes.state) });
    // A page held unasked is owed its ask; a reply that already carries a part ask (not as its last sentence) gets none added.
    const owedState = pastSimple({ heldPage: { title: 'Conversation', part: 'open-conversation', at: 1, unasked: true } });
    const own = await turn(voice, owedState, 'No, I didn\'t.', 'Good. Shall we move on to the conversation, or do you have a question first? 例えば「I joined the company in 2019.」も過去形です。');
    check('a reply carrying its own part ask gets no runtime part ask after it', V2_PART_ASKS.every((x) => !own.spoken.includes(x)) && checkIns(own.spoken) === 0, own.spoken);
    const none = await turn(voice, owedState, 'No, I didn\'t.', 'Good. 「I joined the company in 2019.」も過去形です。');
    check('…one with no part ask still gets the owed ask', V2_PART_ASKS.some((x) => none.spoken.includes(x)), none.spoken);
  }

  console.log('3. a content answer to a part ask, then the next part taught on the old page (James T25–T33)');
  {
    let t = await turn(voice, jobInHand(), 'Uh, yes. For 7 year.', J_T25);
    check('T25: the model\'s own ask holds the part it names (present perfect), the page stays shut', t.state.heldPage?.part === 'present-perfect' && !t.state.heldPage.unasked && openTitle(t.state) === 'Your job', t.state.heldPage);
    t = await turn(voice, t.state, 'I work here for 7 years.', J_T27);
    check('T26 "I work here for 7 years." is no yes: the page stays shut, and the facts say the part change is waiting (answer, then ask again)', openTitle(t.state) === 'Your job' && /part change waiting: they were asked whether to go on to the Present perfect part/.test(t.facts[0] ?? '') && t.state.heldPage?.part === 'present-perfect', t.facts[0]?.match(/part change[^\n]*/)?.[0]);
    check('T27 (the model teaches it anyway, answering his sentence): nothing opens while it answers his content', openTitle(t.state) === 'Your job' && chips(t.state).lit === 'topic-intro');
    const t29 = await turn(voice, t.state, 'I have worked here for 7 years.', J_T29);
    check('T29: the reply asks to go on past the held part: the Present perfect page opens, its chip lit, Your job green', openTitle(t29.state) === 'Present perfect' && chips(t29.state).lit === 'present-perfect' && chips(t29.state).green.includes('topic-intro'), { open: openTitle(t29.state), chips: chips(t29.state) });
    check('…the page goes in the stored reply before the ask, and the past simple now waits for their yes', /<board page>Present perfect<\/board>\s*Do you have a question before we go on/.test(t29.stored) && t29.state.heldPage?.part === 'past-simple' && t29.calls.some((c) => c.name === 'new_page' && c.args.title === 'Present perfect'), t29.stored);
    const t33 = await turn(voice, t29.state, 'Uh, next.', J_T33);
    check('T32 "Uh, next.": the Past simple page opens with its chip; Present perfect green', openTitle(t33.state) === 'Past simple' && chips(t33.state).lit === 'past-simple' && chips(t33.state).green.includes('present-perfect') && t33.state.board.pages.filter((p) => p.title === 'Present perfect').length === 1, { pages: t33.state.board.pages.map((p) => p.title), chips: chips(t33.state) });
    // The same when the model writes the next part's page itself: P opens, Q is held, and the runtime's ask closes P.
    let h = await turn(voice, jobInHand(), 'Uh, yes. For 7 year.', J_T25);
    h = await turn(voice, h.state, 'I work here for 7 years.', J_T27);
    const held = await turn(voice, h.state, 'I have worked here for 7 years.', 'Yes, that\'s right: "I have worked here for seven years."\n<board page>Past simple</board>\nThe past simple is for a finished time.');
    check('…a page block for the part after the held one: the held part opens, the new page is held, the ask closes the held part and names the next', openTitle(held.state) === 'Present perfect' && held.state.heldPage?.part === 'past-simple' && /present perfect/i.test(held.spoken.split('\n\n').pop() ?? '') && /past simple/i.test(held.spoken.split('\n\n').pop() ?? ''), { open: openTitle(held.state), spoken: held.spoken });
    check('…stored: the held part\'s page before the runtime\'s ask', /<board page>Present perfect<\/board>[\s\S]*Next/.test(held.stored), held.stored);
    // Not while the tutor is still on the old part: a question answered and the same part asked again opens nothing.
    const q = await turn(voice, (await turn(voice, jobInHand(), 'Uh, yes. For 7 year.', J_T25)).state, 'What is the present perfect?', 'It joins the past to now: "I have worked here for seven years." Next is the present perfect. Shall we go on, or is there anything you would like to ask first?');
    check('a question answered and the same part asked again: the page stays shut, still held', openTitle(q.state) === 'Your job' && q.state.heldPage?.part === 'present-perfect', { open: openTitle(q.state), held: q.state.heldPage });
    const yes = await turn(voice, q.state, 'Yes.', 'The present perfect joins the past to now.');
    check('…then "Yes." opens it', openTitle(yes.state) === 'Present perfect' && yes.calls[0]?.agreed === true);
  }

  console.log('4. text runs: the text path is untouched');
  {
    const t = await turn(text, jobInHand(), 'Uh, yes. For 7 year.', J_T25);
    check('a typed lesson: the model\'s ask holds nothing (part flow is spoken only), no check-in', !t.state.heldPage && checkIns(t.spoken) === 0, t.state.heldPage);
  }

  console.log('5. kill switches');
  {
    check('flags on by default', TUTOR_V2_ASK_NO_CHECKIN && TUTOR_V2_PART_POSITION_KEPT && TUTOR_V2_HELD_PART_RELEASE);
    const r = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, NEXT_PUBLIC_TUTOR_V2_ASK_NO_CHECKIN: 'off', NEXT_PUBLIC_TUTOR_V2_PART_POSITION_KEPT: 'off', NEXT_PUBLIC_TUTOR_V2_HELD_PART_RELEASE: 'off', REPLAY_7E_OFF_CHILD: '1' }, encoding: 'utf8' });
    const line = (r.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    const off = line ? JSON.parse(line.slice('OFF_JSON '.length)) : null;
    check('all off: T26 gets its check-in; the part in hand follows the page in view and T78 names conversation; the model\'s own ask holds nothing and T29 opens no page', !!off && off.flags.every((f: boolean) => f === false) && off.t26 === 1 && off.inHand === GDI.segments.findIndex((s) => s.id === 'past-simple') && off.t78 === true && off.held25 === null && off.t29open === 'Your job', off ?? r.stderr);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
