/// <reference types="node" />
// Task 7f: run with NEXT_PUBLIC_TUTOR_V2_PART_MIN_PRACTICE=off (package.json): it pins the behaviour
// before Task 7f (the box's last fifth, the fitted part minutes, the stop at the box, part changes with no practice count);
// scripts/test-brain-v2-time-7f.ts covers the switches on, and each one off alone.
/**
 * Tutor brain v2 — Task 7e: the runtime gaps the real-voice replay round 5 found (v2audio-7, c0ee0314;
 * docs/superpowers/plans/gdi-v2-baseline/v2audio-7/RESULTS.md). Each case uses the turn shapes and the real replies from
 * the transcripts (boards/*.txt). No network, no model: scripted runV2Turn walks.
 *   npm run test:brain-v2-replay-7e
 *
 *  1. Check-in after a reply that already asks (check D): "Start with: …", "Please answer with …", Japanese か questions
 *  2. Going back to an earlier page is a look, not a move (Tester A T77–T78); no runtime part ask after a reply's own
 *  3. A content answer to a part ask, then the next part taught on the old page (learner 2 T25–T33)
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
const J_T27 = '「I work here」は今の状態ですが、「7年間ずっと」は過去から今まで続いているので、現在完了を使います。Say: "I have worked here for seven years."\n<board sentence gloss="私は7年間ここで働いています。">I have worked here for seven years.</board>\n「have worked」がポイントです。\n\nもう一度、言ってみてください。';
const J_T29 = 'Yes, that\'s right: "I have worked here for seven years." 現在完了の文が言えました。\n\nNext is the past simple, for finished events at a specific time. \n\nDo you have a question before we go on, or are you ready?';
const J_T33 = 'Now the past simple. We use it for something that finished at a specific time in the past, like yesterday, last year, or three years ago. Now you say one. Use "I joined" and "three years ago."';

// Tester A, past simple in hand (T50–T56 shape).
const pastSimple = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: level, goals: { overview: shown(1), 'topic-intro': shown(2), 'present-perfect': shown(3) }, board: pages(['Overview', 'Your job', 'Present perfect', 'Past simple'], 3), history: [u('x'), a('Please say it once more: No, I didn\'t.')], ...extra });
// Tester A at T77: conversation in hand, then go_to_page back to "Past simple" for more examples.
const conversationLookedBack = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: level, goals: { overview: shown(1), 'topic-intro': shown(2), 'present-perfect': shown(3), 'past-simple': shown(4) }, board: pages(['Overview', 'Your job', 'Present perfect', 'Past simple', 'Conversation'], 3),
  history: [u('x'), a('Past simple is done. Next is Conversation. Shall we go on, or do you have a question first?'), u('Yes.'), a('Now, what was the hard part of the project? Try starting with: The hard part was…'), u('Could you give me some more example of past simple?'), a('過去形の例をもう少し出しますね。これで分かりましたか。分かったら、次は「The hard part was…」で、プロジェクトの大変だった部分を一つ話してみてください。')], ...extra });
// Learner 2 (v2audio-7), on the job's page after the level check (T23 shape).
const jobInHand = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: level, goals: { overview: shown(1), 'level-check': { status: 'demonstrated', at: 2 } }, board: pages(['Overview', 'Your job'], 1), history: [u('hi'), a('では、仕事について話しましょう。'), u('Uh, sorry? Again'), a('もう一度ゆっくり言います。 "I am an engineer. I make cars." では、同じように言ってみてください。 "I am an engineer."')], ...extra });

async function offChild() {
  const t26 = await turn(voice, pastSimple(), 'Yes, I have.', A_T26);
  const back = conversationLookedBack();
  const t78 = await turn(voice, back, null, A_T78);
  let st = (await turn(voice, jobInHand(), 'Uh, yes. For 7 year.', J_T25)).state;
  const held25 = st.heldPage?.part ?? null;
  const t27 = await turn(voice, st, 'I work here for 7 years.', J_T27);
  st = t27.state;
  console.log(`OFF_JSON ${JSON.stringify({ flags: [TUTOR_V2_ASK_NO_CHECKIN, TUTOR_V2_PART_POSITION_KEPT, TUTOR_V2_HELD_PART_RELEASE], t26: checkIns(t26.spoken), inHand: v2PartInHand(GDI, back), lit: chips(back).lit, t78: /Next (?:comes|is|up is|we have) conversation/.test(t78.spoken), held25, t27open: openTitle(t27.state) })}`);
}
const child = (env: Record<string, string>) => {
  const r = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, ...env, REPLAY_7E_OFF_CHILD: '1' }, encoding: 'utf8' });
  const line = (r.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
  return line ? JSON.parse(line.slice('OFF_JSON '.length)) : { error: r.stderr };
};

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
    for (const [label, reply] of [['learner 2 T31', J_T31], ['Tester B T59', B_T59]] as const) {
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
    // Fix round 1 (review I1): "Are you ready?" is no part ask.
    const ready = await turn(voice, owedState, 'No, I didn\'t.', 'Are you ready? Here is one more example. 「I joined the company in 2019.」も過去形です。');
    check('I1 owed: a non-part "Are you ready?" mid-reply: the owed part ask is still added and the page then waits asked', V2_PART_ASKS.some((x) => ready.spoken.includes(x)) && ready.state.heldPage?.part === 'open-conversation' && !ready.state.heldPage.unasked, { spoken: ready.spoken, held: ready.state.heldPage });
    const readyRepl = await turn(voice, conversationLookedBack(), null, `Are you ready? ${A_T78}`);
    check('I1 replacement: a "Ready?" before the dropped repeat still gets the runtime\'s replacement ask', V2_PART_ASKS.filter((x) => readyRepl.spoken.includes(x)).length === 1 && readyRepl.state.heldPage?.part === 'pronunciation', { spoken: readyRepl.spoken, held: readyRepl.state.heldPage });
  }

  console.log('3. a content answer to a part ask, then the next part taught on the old page (learner 2 T25–T33)');
  {
    let t = await turn(voice, jobInHand(), 'Uh, yes. For 7 year.', J_T25);
    check('T25: the model\'s own ask holds the part it names (present perfect), the page stays shut', t.state.heldPage?.part === 'present-perfect' && !t.state.heldPage.unasked && openTitle(t.state) === 'Your job', t.state.heldPage);
    const t27 = await turn(voice, t.state, 'I work here for 7 years.', J_T27);
    check('T26 "I work here for 7 years." is no yes: nothing opens as the reply begins, and the facts say the part change is waiting', !t27.calls[0]?.agreed && /part change waiting: they were asked whether to go on to the Present perfect part/.test(t27.facts[0] ?? ''), t27.facts[0]?.match(/part change[^\n]*/)?.[0]);
    const cardPage = t27.state.board.pages.findIndex((p) => p.items.some((i) => i.tool === 'show_sentence'));
    check('T27 names the held part (現在完了) and teaches it, not asking to go on: the Present perfect page opens before its card; chip lit, Your job green', openTitle(t27.state) === 'Present perfect' && t27.state.board.pages[cardPage]?.title === 'Present perfect' && chips(t27.state).lit === 'present-perfect' && chips(t27.state).green.includes('topic-intro') && !t27.state.heldPage, { open: openTitle(t27.state), cardOn: t27.state.board.pages[cardPage]?.title, chips: chips(t27.state) });
    check('…stored: the page block before the sentence that names the part', /<board page>Present perfect<\/board>\n「I work here」/.test(t27.stored), t27.stored);
    const t29 = await turn(voice, t27.state, 'I have worked here for 7 years.', J_T29);
    check('T29: the ask for the past simple opens nothing (no page for a part the lesson leaves); the past simple waits', openTitle(t29.state) === 'Present perfect' && t29.state.heldPage?.part === 'past-simple' && !t29.calls.some((c) => c.name === 'new_page' && !/^not /.test(c.outcome)), { open: openTitle(t29.state), held: t29.state.heldPage });
    const t33 = await turn(voice, t29.state, 'Uh, next.', J_T33);
    check('T32 "Uh, next.": the Past simple page opens with its chip; Present perfect green; one page each', openTitle(t33.state) === 'Past simple' && chips(t33.state).lit === 'past-simple' && chips(t33.state).green.includes('present-perfect') && t33.state.board.pages.filter((p) => p.title === 'Present perfect').length === 1, { pages: t33.state.board.pages.map((p) => p.title), chips: chips(t33.state) });
    // Review I2: a part the lesson moves past, never taught by name, opens nothing.
    const past = await turn(voice, t.state, 'I have worked here for 7 years.', J_T29);
    check('a reply that asks past the held part without naming it opens no page for it', openTitle(past.state) === 'Your job' && past.state.heldPage?.part === 'past-simple', { open: openTitle(past.state), held: past.state.heldPage });
    // Negatives: still answering their content, or a re-ask.
    const q = await turn(voice, t.state, 'What is the present perfect?', 'It joins the past to now: "I have worked here for seven years." Next is the present perfect. Shall we go on, or is there anything you would like to ask first?');
    check('the reply answers his content and re-asks (names the part, ends on the part ask): the page stays shut, still held', openTitle(q.state) === 'Your job' && q.state.heldPage?.part === 'present-perfect', { open: openTitle(q.state), held: q.state.heldPage });
    const yes = await turn(voice, q.state, 'Yes.', 'The present perfect joins the past to now.');
    check('…then "Yes." opens it', openTitle(yes.state) === 'Present perfect' && yes.calls[0]?.agreed === true);
    const content = await turn(voice, t.state, 'I work here for 7 years.', 'Seven years is a long time. What do you like most about your job? Try starting with: I like…');
    check('a reply about the old part only (no name of the held part): the page stays shut', openTitle(content.state) === 'Your job' && content.state.heldPage?.part === 'present-perfect');
    const asked = await turn(voice, t.state, 'What is the present perfect?', 'The present perfect joins the past to now: "I have worked here for seven years."');
    check('…nor while it answers their question about it (the ask comes again: 7a I2)', openTitle(asked.state) === 'Your job' && asked.state.heldPage?.part === 'present-perfect');
    const owedOpen = await turn(voice, t.state, 'I work here for 7 years.', '現在完了を使います。Say: "I have worked here for seven years." Next is the present perfect. Shall we go on?');
    check('…nor one that names it and still asks whether to go on', openTitle(owedOpen.state) === 'Your job');
  }

  console.log('4. text runs: the text path is untouched');
  {
    const t = await turn(text, jobInHand(), 'Uh, yes. For 7 year.', J_T25);
    check('a typed lesson: the model\'s ask holds nothing (part flow is spoken only), no check-in', !t.state.heldPage && checkIns(t.spoken) === 0, t.state.heldPage);
  }

  console.log('5. kill switches');
  {
    check('flags on by default', TUTOR_V2_ASK_NO_CHECKIN && TUTOR_V2_PART_POSITION_KEPT && TUTOR_V2_HELD_PART_RELEASE);
    const ps = GDI.segments.findIndex((x) => x.id === 'past-simple'); const conv = GDI.segments.findIndex((x) => x.id === 'open-conversation');
    const all = child({ NEXT_PUBLIC_TUTOR_V2_ASK_NO_CHECKIN: 'off', NEXT_PUBLIC_TUTOR_V2_PART_POSITION_KEPT: 'off', NEXT_PUBLIC_TUTOR_V2_HELD_PART_RELEASE: 'off' });
    check('all off: T26 gets its check-in; the part in hand follows the page in view and T78 names conversation; the model\'s own ask holds nothing and T27 opens no page', all.flags?.every((f: boolean) => f === false) && all.t26 === 1 && all.inHand === ps && all.t78 === true && all.held25 === null && all.t27open === 'Your job', all);
    const pos = child({ NEXT_PUBLIC_TUTOR_V2_PART_POSITION_KEPT: 'off' });
    check('PART_POSITION_KEPT off alone: the part in hand and the lit chip follow the page in view, T78 names conversation; the held part still opens at T27', pos.flags?.[1] === false && pos.flags[0] === true && pos.flags[2] === true && pos.inHand === ps && pos.lit === 'past-simple' && pos.t78 === true && pos.t26 === 0 && pos.held25 === 'present-perfect' && pos.t27open === 'Present perfect', pos);
    const held = child({ NEXT_PUBLIC_TUTOR_V2_HELD_PART_RELEASE: 'off' });
    check('HELD_PART_RELEASE off alone: the model\'s own ask holds nothing and T27 teaches on "Your job"; the position is still kept (T78 right)', held.flags?.[2] === false && held.flags[0] === true && held.flags[1] === true && held.held25 === null && held.t27open === 'Your job' && held.inHand === conv && held.t78 === false && held.t26 === 0, held);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
