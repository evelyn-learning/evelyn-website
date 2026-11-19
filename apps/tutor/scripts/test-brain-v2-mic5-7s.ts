/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7s: mic test 5 (embed-1795050656326), the rest: the question-card record, practised questions, starters,
 * the pronunciation page, the summary's question card, and three small ones. The session's plan (gdi-work-projects-v1) and its
 * real turns (the session record's transcript and whiteboard commands, quoted in task-7r-investigation.md B, D, E, F, G).
 * No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic5-7s
 *
 *  1 QUESTION_ONCE fix    a card question the runtime speaks is stored after its card, once: the six corrected answers after a
 *                         question (#6, #16, #20, #31, #50, #56) each give a v2_practice_signal through runV2Turn
 *  2 PRACTISED_SENTENCE   after an ask for a sentence (「"Did you enjoy..." で答えてみてください。」), their words are practice: a facts line
 *  3 STARTER_IS_ANSWER    a starter for an answer is a statement; the 7q starter step agrees
 *  4 PRONUNCIATION_PAGE   the armed item is carded on the pronunciation page; a measured attempt there counts (no "didn't get to");
 *                         only the measured score; no check-in after 繰り返して or an armed recording
 *  5 QUESTION_NOT_NOTE    a question goes on a question card (facts); a glossed plain note is drawn as a note
 *  6 small                header timers leave out flag time; "I am proud of." is not carded; #64 reported
 *  each switch off alone (a child process per switch): the behaviour at dcdf5430 for that item.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { v2AskedForSentence, v2AskedToProduce, v2CardIsFragment, v2PracticeAnswerSentences } from '../src/lib/tutor/v2/learner-card';
import { v2SupportFormLine, v2SupportLine } from '../src/lib/tutor/v2/adaptive';
import { v2NextTimeAllLine } from '../src/lib/tutor/v2/plan-map';
import { v2ArmClosesOnOtherAsk, v2ReadPronunciation } from '../src/lib/tutor/v2/pronunciation';
import { flagFreeElapsedSec } from '../src/app/tutor/components/session/useFlagClockPause';
import { stripBoardBlocks } from '../src/lib/tutor/v2/board-inline';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State, type V2TurnEvent } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC5_7S_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
/** A scripted model: each call gives the next reply (text, and tool calls when given). */
function scripted(replies: Array<{ text: string; tools?: Array<{ name: string; input: Record<string, unknown> }> }>) {
  const facts: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
    const r = replies[Math.min(i, replies.length - 1)]!; i += 1;
    onText?.(r.text);
    const tools = (r.tools ?? []).map((t, k) => ({ type: 'tool_use', id: `tu_${i}_${k}`, name: t.name, input: t.input }));
    return msg([{ type: 'text', text: r.text }, ...tools], tools.length ? 'tool_use' : 'end_turn');
  };
  return { call, facts };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const LANGS = ['en', 'ja'];
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: LANGS, levelCheck: true, plan: GDI, pronunciation: true };
const maths: V2Session = { studentName: 'Sam', subject: 'Maths', level: 'Grade 8', mode: 'voice', timeBoxMinutes: 20 };
const typedLang: V2Session = { ...lang, mode: 'text' };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
const TODAY: V2BoardPage = { title: '概要', items: [{ id: 't1', tool: 'annotate', summary: 'present perfect / past simple' }] };
const JOB: V2BoardPage = { title: '仕事について', items: [card('j1', 'I work in sales.')] };
const PP: V2BoardPage = { title: '現在完了 (present perfect)', items: [card('p1', 'I have worked at Nagoya Corporation for six years.')] };
const PS: V2BoardPage = { title: '過去形 (past simple)', items: [card('s1', 'I attended an exhibition last year.')] };
const CONV: V2BoardPage = { title: 'Conversation', items: [card('c1', 'The project went very well.')] };
const PRON: V2BoardPage = { title: '発音 (pronunciation)', items: [] };
const goalsAt = { overview: { status: 'shown' as const, at: 0 }, 'level-check': { status: 'demonstrated' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 } };
const base = (pages: V2BoardPage[], extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone(pages), current: pages.length - 1 }, goals: goalsAt, timeFit: { dropped: [], byArrival: true }, ...extra });

// ── The session's turns (transcript index), word for word; the cards from its whiteboard commands ──
const Q = (statement: string, gloss: string) => `<board problem gloss="${gloss}">${statement}</board>`;
const S = (sentence: string, stress: string[]) => `<board sentence${stress.length ? ` stress="${stress.join(' | ')}"` : ''}>${sentence}</board>`;
/** The six asks with a question card, each with the answer after it and the reply that carded it. `own`: the model said the question
 *  itself (#19, the one answer that was counted live). */
const ASKS: Array<{ k: string; pages: V2BoardPage[]; at: number; before: string; ask: string; answer: string; reply: string; own?: boolean }> = [
  { k: '#5→#6', pages: [TODAY, JOB], at: 2.2, before: 'Uh, yes.',
    ask: `では、仕事について話す練習から始めましょう。自分の仕事を説明する簡単な文は、「I work in sales.」（私は営業をしています）のように言えます。\n\n${Q('What do you do at work? Answer with one or two sentences.', 'あなたは仕事で何をしていますか。一、二文で答えてください。')}`,
    answer: 'Um, I uh, in sales uh, at Nagoya Corporation.',
    reply: `いいですね。"at Nagoya Corporation"（ナゴヤ・コーポレーションで）と会社の名前の前に"at"を使えています。${S('I work in sales at Nagoya Corporation.', ['at', 'Nagoya', 'Corporation'])}\n\n次は、お客様についての文をもう一つ言ってみてください。` },
  { k: '#15→#16', pages: [TODAY, JOB, PP], at: 5.0, before: 'Uh, yes. we can go.',
    ask: `では、「present perfect」に入ります。日本語では「今も続いている経験」を言うときに使います。形は have か has に過去分詞を続けます。\n\nでは、質問です。今の会社で長く働いていますか。\n\n${Q('Have you worked for your current company for a long time?', '今の会社で長く働いていますか。「I have worked…」で始めてみてください。')}`,
    answer: 'Uh, yes, I work at Nagoya Corporation for 5 years.',
    reply: `「I work」だと今の仕事を言うだけで、5年続いていることが伝わりません。「ずっと続いている経験」なので、「I have worked」と言ってみてください。${S('I have worked at Nagoya Corporation for five years.', ['have', 'worked'])}\n\nもう一度、この文を言ってみてください。` },
  { k: '#19→#20', pages: [TODAY, JOB, PP], at: 6.0, before: 'I have worked at Nagoya Corporation for 5 years.', own: true,
    ask: `そうです、その文は正しいです。5年続いている経験を、ちゃんと"have worked"で言えています。\n\n次の質問です。今の会社で、何か新しく覚えたことはありますか。"I have learned"で始めてみてください。\n\nWhat have you learned at your company? ${Q('What have you learned at your company?', '今の会社で、何か新しく覚えたことはありますか。')}`,
    answer: 'I learn uh how to negotiate with customer.',
    reply: `「I learn」だと今の動作になります。覚えたことを今も使っているので、「I have learned」と言います。${S('I have learned how to negotiate with customers.', ['have', 'learned'])}\n\nもう一度、この文を言ってみてください。` },
  { k: '#30→#31', pages: [TODAY, JOB, PP, PS], at: 8.0, before: 'Um, no question.',
    ask: `では、過去形の練習に進みましょう。「last year」や「yesterday」のように、いつかがはっきりした過去の出来事には past simple を使います。\n\nでは、質問です。去年、展示会や仕事のイベントに行きましたか。\n\n${Q('Did you attend any business events last year?', '去年、展示会や仕事のイベントに行きましたか。')}`,
    answer: 'Uh, yes, I attend uh robotic exhibition in Tokyo last year.',
    reply: `ロボットの展示会に行ったんですね。「last year」は去年という特定の時なので、過去形の"attended"を使います。${S('I attended a robotics exhibition in Tokyo last year.', ['attended'])}\n\nもう一度、この文を言ってみてください。` },
  { k: '#49→#50', pages: [TODAY, JOB, PP, PS, CONV], at: 12.5, before: 'Yes, let\'s go.',
    ask: `では、会話を始めましょう。今の会社で誇りに思っているプロジェクトを一つ、教えてください。\n\n${Q('What is one project you are proud of?', '誇りに思っているプロジェクトを一つ教えてください。')}`,
    answer: 'Uh, I proud of uh donations project for climate change.',
    reply: `「I proud of」の前に「am」が必要です。「私は誇りに思っています」は「I am proud of」と言います。${S('I am proud of the donation project for climate change.', ['am', 'proud', 'of'])}\n\nもう一度、この文を言ってみてください。` },
  { k: '#55→#56', pages: [TODAY, JOB, PP, PS, CONV], at: 13.5, before: 'I had to collect donation from everyone.',
    ask: `大変でしたね。では、どうやって寄付を集めましたか。\n\n${Q('How did you collect the donations?', '寄付をどうやって集めたか、教えてください。')}`,
    answer: 'I ask people I email everyone uh to donate.',
    reply: `寄付をお願いするために、みんなにメールを送ったんですね。過去のプロジェクトなので、"ask"ではなく過去形の"emailed"を使います。${S('I emailed everyone to ask them to donate.', ['emailed'])}\n\nもう一度、この文を言ってみてください。` },
];
const T36 = 'その文は正しいです。去年という特定の時に、過去形の"attended"を使えています。\n\nでは、その展示会は楽しかったですか。"Did you enjoy..." で答えてみてください。';
const T37 = 'Uh, did you enjoy the robotics exhibition in Tokyo last year?';
const T42 = 'その文は正しいです。去年の展示会なので、過去形の"enjoyed"を使えています。\n\n過去形の練習はここまでです。次は会話の練習です。質問がありますか、それとも進みましょうか。';
const T59 = 'その文は正しいです。みんなにメールで寄付をお願いしたんですね。\n\n次の質問です。寄付のプロジェクトは、今もまだ続いていますか。"Has the project..." で答えてみてください。';
const T69 = 'わかりました、一語ずつ練習しましょう。最初の単語は responsibilities です。私の後に繰り返してください。';
const T76 = '「international」です。私の後に繰り返してください。 international';
const T51_FRAG = `「I proud of」の前に「am」が必要です。「私は誇りに思っています」は「I am proud of」と言います。${S('I am proud of.', ['am'])}${S('I am proud of the donation project for climate change.', ['am', 'proud', 'of'])}\n\nもう一度、この文を言ってみてください。`;
const ARM_Q_K = 'みんなにメールを送ったんですね。Say it after me: "I emailed everyone to ask them to donate." What else did you do for the project?';
const SENT_K = 'I have worked with international customers.';
const CHECK_IN = /Does that make sense|Is that clear|Any questions so far|Ready to go on/i;

const textOf = (m: V2State['history'][number]) => (typeof m.content === 'string' ? m.content : m.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '));
const lastReply = (h: V2State['history']) => textOf([...h].reverse().find((m) => m.role === 'assistant')!);
const count = (hay: string, needle: string) => hay.split(needle).length - 1;

async function probe() {
  // 1: the ask turn, then the answer turn, each through runV2Turn (the route's round trip: the state as the turn left it).
  const item1 = [];
  for (const x of ASKS) {
    const s0 = base(x.pages, { history: [u('x'), a('はい。')] });
    const t1 = await runV2Turn({ session: lang, state: s0, studentSaid: x.before, callModel: scripted([{ text: x.ask }]).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: x.at * MIN });
    const stored = lastReply(t1.state.history);
    const qText = x.ask.match(/<board problem[^>]*>([^<]*)<\/board>/)![1]!.replace(/ Answer with one or two sentences\.$/, '');
    // Before the fix: the stored reply without the question the runtime spoke (only the raw card).
    const stripped = structuredClone(t1.state);
    const lastA = [...stripped.history].reverse().find((m) => m.role === 'assistant')!;
    if (!x.own) { if (typeof lastA.content === 'string') lastA.content = lastA.content.replace(`\n${qText}`, ''); else for (const c of lastA.content) if (c.type === 'text') c.text = c.text.replace(`\n${qText}`, ''); }
    const t2 = await runV2Turn({ session: lang, state: t1.state, studentSaid: x.answer, callModel: scripted([{ text: x.reply }]).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: (x.at + 0.5) * MIN });
    const ev = (t2.events ?? []) as V2TurnEvent[];
    item1.push({ k: x.k, own: !!x.own, stored, plainOnce: count(stripBoardBlocks(stored), qText), afterCard: stored.indexOf(qText, stored.indexOf('</board>')) > stored.indexOf('</board>'), signal: ev.filter((e) => e.type === 'v2_practice_signal').map((e) => e.message), sentencesBefore: v2PracticeAnswerSentences(lang, stripped, x.answer).length, sentencesNow: v2PracticeAnswerSentences(lang, t1.state, x.answer).length });
  }

  // 2: the turn after #36 (n2) with his practised question; the part ask #42 (no ask for a sentence); a maths and a typed lesson.
  const factsOf = async (session: V2Session, state: V2State, said: string | null, at: number, extra: Record<string, unknown> = {}) => { const m = scripted([{ text: 'はい。' }]); await runV2Turn({ session, state, studentSaid: said, callModel: m.call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: at * MIN, ...extra }); return m.facts.join('\n'); };
  const f37 = await factsOf(lang, base([TODAY, JOB, PP, PS], { history: [u('I saw dancing robot singing to music.'), a(T36)] }), T37, 10.2);
  const f42 = await factsOf(lang, base([TODAY, JOB, PP, PS], { history: [u('I enjoyed the exhibition a lot.'), a(T42)] }), 'Uh, no, let\'s go.', 10.9);
  const f59 = await factsOf(lang, base([TODAY, JOB, PP, PS, CONV], { history: [u('I emailed everyone to ask them to donate.'), a(T59)] }), 'Yes, uh, the project uh go very well.', 14.1);
  const fMaths = await factsOf(maths, { ...newV2State(0), history: [u('ok'), a('Try starting with "The slope is…". What is the slope?')] }, 'The slope is 3.', 5);
  const fTyped = await factsOf(typedLang, base([TODAY, JOB, PP, PS], { history: [u('I saw dancing robot singing to music.'), a(T36)] }), T37, 10.2);

  // 4: on the pronunciation page: #69 arms "responsibilities"; the measured attempt next turn; #76 with and without the arm.
  const pron = await runV2Turn({ session: lang, state: base([TODAY, JOB, PP, PS, CONV, PRON], { history: [u('pronunciation.'), a('発音の練習ですね。')] }), studentSaid: 'Uh, word by word.', callModel: scripted([{ text: T69, tools: [{ name: 'practise_pronunciation', input: { items: ['responsibilities'] } }] }, { text: '' }]).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 16.1 * MIN });
  const pronPage = pron.state.board.pages[pron.state.board.pages.length - 1]!;
  const heardState: V2State = { ...structuredClone(pron.state), pronunciation: { seq: pron.state.pronunciation!.seq, armed: pron.state.pronunciation!.armed, heard: { seq: pron.state.pronunciation!.seq, status: 'measured', overall: 93, words: [{ word: 'responsibilities', score: 90 }] } } };
  const scoredM = scripted([{ text: '93点でした。' }]);
  const scored = await runV2Turn({ session: lang, state: heardState, studentSaid: 'responsibilities.', callModel: scoredM.call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 16.8 * MIN });
  const summaryState = { ...structuredClone(scored.state), board: { pages: [...structuredClone(scored.state.board.pages), { title: 'まとめ (summary)', items: [] }], current: scored.state.board.pages.length } };
  let said76 = ''; const t76 = await runV2Turn({ session: lang, state: structuredClone(scored.state), studentSaid: 'international.', callModel: scripted([{ text: T76, tools: [{ name: 'practise_pronunciation', input: { items: ['international'] } }] }, { text: '' }]).call, onText: (t) => { said76 += t; }, boardPass: false, mathsCheck: false, nowMs: 17 * MIN });
  let said76b = ''; await runV2Turn({ session: lang, state: structuredClone(scored.state), studentSaid: 'international.', callModel: scripted([{ text: T76 }]).call, onText: (t) => { said76b += t; }, boardPass: false, mathsCheck: false, nowMs: 17 * MIN });
  // An English-only lesson's statement reply still gets its check-in (unchanged).
  let saidEn = ''; await runV2Turn({ session: { ...lang, languages: ['en'], pronunciation: false }, state: base([TODAY, JOB]), studentSaid: 'I sell cars.', callModel: scripted([{ text: 'Good. We use the present simple for a job.' }]).call, onText: (t) => { saidEn += t; }, boardPass: false, mathsCheck: false, nowMs: 3 * MIN });

  // 6: the fragment card of #51.
  const t51 = await runV2Turn({ session: lang, state: base([TODAY, JOB, PP, PS, CONV], { history: [u('x'), a(ASKS[4]!.ask)] }), studentSaid: ASKS[4]!.answer, callModel: scripted([{ text: T51_FRAG }]).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 13 * MIN });

  // ── Fix round 1 ──
  // I1: a question about them, then their question back: the persona card answers it (no practised line). A make-a-question ask
  // with their question: the line. #59's answer is a statement: no line.
  const CONV_Q = `では、会話を始めましょう。\n\n${Q('What is one project you are proud of?', '誇りに思っているプロジェクトを一つ教えてください。')}\nWhat is one project you are proud of?`;
  const fBack = await factsOf(lang, base([TODAY, JOB, PP, PS, CONV], { history: [u('Yes, let\'s go.'), a(CONV_Q)] }), 'Hmm, what about you? What project are you proud of?', 12.6);
  const fMake = await factsOf(lang, base([TODAY, JOB, PP, PS], { history: [u('I enjoyed the exhibition a lot.'), a('Now ask me a question about my weekend. Start with "Did you…".')] }), 'Did you go to the mountains?', 10.4);
  // ── Fix round 2 ──
  // N1: the n2 question transcribed with a period, and lower case with no mark: the line all the same.
  const fPeriod = await factsOf(lang, base([TODAY, JOB, PP, PS], { history: [u('I saw dancing robot singing to music.'), a(T36)] }), 'Uh, did you enjoy the robotics exhibition in Tokyo last year.', 10.2);
  const fBare = await factsOf(lang, base([TODAY, JOB, PP, PS], { history: [u('I saw dancing robot singing to music.'), a(T36)] }), 'did you enjoy the robotics exhibition in tokyo last year', 10.2);
  // M3: a practice-part reply arms its corrected sentence and closes on its own different question; then their answer.
  const ARM_Q = 'みんなにメールを送ったんですね。「I emailed everyone to ask them to donate.」と言います。Say it after me: "I emailed everyone to ask them to donate." What else did you do for the project?';
  const armQ = await runV2Turn({ session: lang, state: base([TODAY, JOB, PP, PS, CONV], { history: [u('x'), a(ASKS[5]!.ask)] }), studentSaid: ASKS[5]!.answer, callModel: scripted([{ text: ARM_Q, tools: [{ name: 'practise_pronunciation', input: { items: ['I emailed everyone to ask them to donate.'] } }] }, { text: '' }]).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 13.6 * MIN });
  const armQNextM = scripted([{ text: `Posters are a good idea. ${S('We made posters for the school festival.', [])}` }]);
  const armQNext = await runV2Turn({ session: lang, state: structuredClone(armQ.state), studentSaid: 'We make posters for the school festival.', callModel: armQNextM.call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 14 * MIN });
  const fStarterBack = await factsOf(lang, base([TODAY, JOB, PP], { history: [u('I have worked here for five years.'), a('What have you learned at your company? Start with "I have learned…".')] }), 'Hmm, what about you? What have you learned?', 6.2);
  const fMakeJa = await factsOf(lang, base([TODAY, JOB, PP, PS], { history: [u('I enjoyed the exhibition a lot.'), a('では、「Did you…」で私に質問を作ってみてください。')] }), 'Did you enjoy the exhibition?', 10.4);
  // I3 / M1 / M2 / M5: a sentence item armed on the pronunciation page, then the scored attempt (the learner says the sentence).
  const SENT = 'I have worked with international customers.';
  const armSent = await runV2Turn({ session: lang, state: base([TODAY, JOB, PP, PS, CONV, PRON], { history: [u('pronunciation.'), a('発音の練習ですね。')] }), studentSaid: 'Uh, the whole sentence.', callModel: scripted([{ text: `わかりました。「${SENT}」私の後に繰り返してください。`, tools: [{ name: 'practise_pronunciation', input: { items: [SENT] } }] }, { text: '' }]).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 16.1 * MIN });
  const armedOnly = { ...structuredClone(armSent.state), board: { pages: [...structuredClone(armSent.state.board.pages), { title: 'まとめ (summary)', items: [] }], current: armSent.state.board.pages.length } };
  const sentHeard: V2State = { ...structuredClone(armSent.state), pronunciation: { seq: armSent.state.pronunciation!.seq, armed: armSent.state.pronunciation!.armed, heard: { seq: armSent.state.pronunciation!.seq, status: 'measured', overall: 88, words: [{ word: 'have', score: 95 }, { word: 'international', score: 80 }] } } };
  const sentM = scripted([{ text: '88点でした。' }]);
  const sentScored = await runV2Turn({ session: lang, state: sentHeard, studentSaid: 'I have worked with international customer.', callModel: sentM.call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 16.6 * MIN });
  // I2: the review's failing inputs, and #51 through runV2Turn with a two-sentence turn.
  const frag2 = await runV2Turn({ session: lang, state: base([TODAY, JOB, PP, PS, CONV], { history: [u('x'), a('Now ask me a question about where I live.')] }), studentSaid: 'I live in Nagoya. What city do you live in?', callModel: scripted([{ text: `Good question. ${S('What city do you live in?', [])} I live in Gifu.` }]).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 12.8 * MIN });
  // ── Fix round 4 ──
  // N-A: the practice sentence is a question of its own after the ask, no arm: their repetition is practice (the line).
  const NA1 = 'Good. Repeat after me.\n\nWhat did you do last weekend?';
  const NA2 = 'Ask me a question about my weekend. What would you like to know?';
  const fNA1 = await factsOf(lang, base([TODAY, JOB, PP, PS], { history: [u('I enjoyed the exhibition a lot.'), a(NA1)] }), 'What did you do last weekend?', 10.4);
  const fNA2 = await factsOf(lang, base([TODAY, JOB, PP, PS], { history: [u('I enjoyed the exhibition a lot.'), a(NA2)] }), 'What did you do on Saturday?', 10.4);
  // The M3 shape of the finding: "…Repeat after me: X. What did you do last weekend?" with an arm, then their answer.
  const ARM_Q4 = 'Good. Repeat after me: "I emailed everyone to ask them to donate." What did you do last weekend?';
  const armQ4 = await runV2Turn({ session: lang, state: base([TODAY, JOB, PP, PS, CONV], { history: [u('x'), a(ASKS[5]!.ask)] }), studentSaid: ASKS[5]!.answer, callModel: scripted([{ text: ARM_Q4, tools: [{ name: 'practise_pronunciation', input: { items: ['I emailed everyone to ask them to donate.'] } }] }, { text: '' }]).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 13.6 * MIN });
  const armQ4NextM = scripted([{ text: 'That sounds fun.' }]);
  // The route's round trip: the pronunciation state as the route reads it back from the client.
  const armQ4State = structuredClone(armQ4.state); armQ4State.pronunciation = v2ReadPronunciation(JSON.parse(JSON.stringify(armQ4State.pronunciation ?? null)));
  const armQ4Next = await runV2Turn({ session: lang, state: armQ4State, studentSaid: 'I went to the mountains.', callModel: armQ4NextM.call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 14 * MIN });

  return {
    fNA1, fNA2, armQ4Armed: !!armQ4.state.pronunciation?.armed, armQ4Mark: !!armQ4.state.pronunciation?.disarmed, armQ4NextFacts: armQ4NextM.facts.join('\n'), armQ4NextMark: !!armQ4Next.state.pronunciation?.disarmed,
    fBack, fMake, fMakeJa, fStarterBack, fPeriod, fBare,
    armQArmed: !!armQ.state.pronunciation?.armed, armQEvents: (armQ.events ?? []).map((e) => e.type), armQNextFacts: armQNextM.facts.join('\n'), armQNextEvents: (armQNext.events ?? []).map((e) => `${e.type} ${e.message}`), t69Armed: !!pron.state.pronunciation?.armed,
    askedBack: v2AskedToProduce([a(CONV_Q)]), askedT36: v2AskedToProduce([a(T36)]),
    armedNextTime: v2NextTimeAllLine(GDI, armedOnly), armedSaid: armSent.state.practiceSaid?.pronunciation ?? 0, armCards: armSent.state.board.pages[armSent.state.board.pages.length - 1]!.items.map((it) => it.summary),
    sentFacts: sentM.facts.join('\n'), sentCalls: sentScored.toolCalls.filter((c) => c.name === 'show_sentence').map((c) => String(c.args.sentence)), sentSaid: sentScored.state.practiceSaid?.pronunciation ?? 0,
    frag2: frag2.toolCalls.filter((c) => c.name === 'show_sentence').map((c) => [String(c.args.sentence), c.outcome]),
    item1, f37, f42, f59, fMaths, fTyped,
    asked36: v2AskedForSentence([a(T36)]), asked59: v2AskedForSentence([a(T59)]),
    starter: v2SupportLine('starter'),
    pronCards: pronPage.items.map((it) => `${it.tool}:${it.summary}`), pronCalls: pron.toolCalls.filter((c) => c.name === 'show_sentence').map((c) => c.outcome),
    practiceSaid: scored.state.practiceSaid ?? null, scoredFacts: scoredM.facts.join('\n'),
    nextTime: v2NextTimeAllLine(GDI, summaryState),
    said76, said76b, saidEn, t76cards: t76.state.board.pages[t76.state.board.current]!.items.map((it) => it.summary),
    frag: t51.toolCalls.filter((c) => c.name === 'show_sentence').map((c) => [String(c.args.sentence), c.outcome]),
  };
}

async function main() {
  const on = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }

  console.log('1  QUESTION_ONCE fix: a card question the runtime spoke is in the stored reply (embed-1795050656326)');
  for (const x of on.item1) {
    if (!x.own) check(`${x.k}: the question is stored once, after its card`, x.plainOnce === 1 && x.afterCard, x.stored);
    check(`${x.k}: the answer gives a v2_practice_signal (wrong: it was corrected)`, x.signal.length === 1 && /^wrong /.test(x.signal[0]!), x.signal);
  }
  check('all 6 corrected answers counted', on.item1.every((x) => x.signal.some((s) => /^wrong /.test(s))));
  const blind = on.item1.filter((x) => !x.own && x.sentencesBefore === 0).map((x) => x.k);
  check('without the stored question (the live record), the 5 runtime-asked answers give no practice sentences (the regression)', blind.length === 5 && on.item1.filter((x) => !x.own).every((x) => x.sentencesNow > 0), on.item1.map((x) => [x.k, x.sentencesBefore, x.sentencesNow]));

  console.log('2  PRACTISED_SENTENCE: a sentence they were asked to make or say is practice');
  check('#36 「"Did you enjoy..." で答えてみてください。」 and #59 are asks for a sentence', on.asked36 && on.asked59);
  check('the turn of "did you enjoy the robotics exhibition…?" (n2): the facts say it is their practice, no persona answer', /practised sentence: your last reply asked them to make a question or to say a sentence you gave/.test(on.f37) && /nothing from your own persona card/.test(on.f37), on.f37);
  check('fix round 2 (N1 ruling): #59 asked to answer with "Has the project...": his statement is that practice, the line fires whatever its form', /practised sentence:/.test(on.f59), on.f59);
  check('after the part ask #42: no such line', !/practised sentence: your last reply asked them to make a question or to say a sentence you gave/.test(on.f42));

  console.log('3  STARTER_IS_ANSWER: a starter is the opening of the answer');
  check('the facts of a spoken language lesson say a starter is a statement, the question form only for making a question', /starters: a starter you give for their answer is the first words of the answer itself, a statement/.test(on.f37) && /Ask me a question starting with/.test(on.f37));
  check('7q starter step agrees: a statement, never the question form', /as a statement/.test(on.starter ?? '') && /never the question form/.test(on.starter ?? ''), on.starter);

  console.log('4  PRONUNCIATION_PAGE: the page shows the practice and the practice counts');
  check('#69 arms "responsibilities": it is carded on the pronunciation page by the runtime', on.pronCards.includes('show_sentence:responsibilities') && on.pronCalls.length === 1, [on.pronCards, on.pronCalls]);
  check('the measured attempt (93) on that page counts as practice of the part', on.practiceSaid?.pronunciation === 1, on.practiceSaid);
  check('at the summary, the pronunciation part is not named as "didn\'t get to"', !/pronunciation/i.test(on.nextTime ?? ''), on.nextTime);
  check('the facts give the score and say it is the only number to say', /the score of this attempt is 93 out of 100, and it is the only number you may say/.test(on.scoredFacts), on.scoredFacts);
  check('#76 「私の後に繰り返してください。 international」 with the arm: no check-in after it', !CHECK_IN.test(on.said76), on.said76);
  check('#76 without a tool call: no check-in either (the shared ask test)', !CHECK_IN.test(on.said76b), on.said76b);
  check('#76: "international" carded beside "responsibilities"', on.t76cards.includes('international') && on.t76cards.includes('responsibilities'), on.t76cards);
  check('an English-only lesson\'s statement reply keeps its check-in', CHECK_IN.test(on.saidEn), on.saidEn);

  console.log('5  QUESTION_NOT_NOTE: a question goes on a question card');
  check('the facts say a question for the learner goes in <board problem>, never a note', /a question the learner must answer, on any page and in the summary too, goes on a question card \(a <board problem> block\), never in a note/.test(on.f37));
  const canvas = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'whiteboard', 'WhiteboardCanvas.tsx'), 'utf8');
  check('the board draws a plain glossed note white with a slate edge, under the switch (a sentence card stays grey)', /const glossNote = TUTOR_V2_QUESTION_NOT_NOTE && !!cardGlossOf\(command\) && command\.style !== 'highlight'/.test(canvas) && /glossNote \? 'bg-white border border-slate-200 border-l-4 border-l-slate-400'/.test(canvas) && /px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 font-sans/.test(canvas));

  console.log('6  small ones');
  check('flag time left out of the header timer: 22:35 wall with 5:00 of flags → 17:35; a pause under way stands still', flagFreeElapsedSec(0, (22 * 60 + 35) * 1000, { totalMs: 300000, sinceMs: null }) === 17 * 60 + 35 && flagFreeElapsedSec(0, 1000000, { totalMs: 0, sinceMs: 600000 }) === 600 && flagFreeElapsedSec(5000, 65000, { totalMs: 0, sinceMs: null }) === 60);
  const clocks = ['session/HeaderClock.tsx', 'SessionControls.tsx'].map((f) => readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', f), 'utf8'));
  const hook = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'session', 'useFlagClockPause.ts'), 'utf8');
  check('both header timers use it; the hook reads only the dev flag event, under the switch, never in production', clocks.every((c) => /flagFreeElapsedSec\(startedAtMs, frozenAtMs \?\? Date\.now\(\), flagPause\)/.test(c)) && /if \(!TUTOR_V2_HEADER_CLOCK_PAUSE \|\| process\.env\.NODE_ENV === 'production'/.test(hook) && /evelyn:lesson-clock-paused/.test(hook));
  check('"I am proud of." after "I proud of uh donations project…" is a fragment; "Where are you from?" said whole is not; "I work in sales." is not', v2CardIsFragment('I am proud of.', ASKS[4]!.answer) && !v2CardIsFragment('Where are you from?', 'Where are you from?') && !v2CardIsFragment('I work in sales.', 'I work in sales.'));
  check('#51: the fragment card is refused, the whole sentence carded', on.frag.length === 2 && /^not painted: a sentence card holds a whole sentence, and this one stops/.test(on.frag[0]![1]) && !/^not /.test(on.frag[1]![1]), on.frag);

  console.log('other lessons: nothing new');
  check('a maths voice lesson: no 7s facts', !/practised sentence:|starters:|question card \(a <board problem>/.test(on.fMaths), on.fMaths);
  check('a typed language lesson: no 7s facts', !/practised sentence:|starters:|question card \(a <board problem>/.test(on.fTyped));

  console.log('fix round 1');
  check('I1: a question about them ("What is one project you are proud of?"), then "Hmm, what about you? What project are you proud of?": no practised line (the persona card answers)', !/practised sentence:/.test(on.fBack) && !on.askedBack, on.fBack);
  check('I1: "Now ask me a question … Start with \"Did you…\"." + "Did you go to the mountains?": the line', /practised sentence:/.test(on.fMake), on.fMake);
  check('I1: 「「Did you…」で私に質問を作ってみてください。」 + "Did you enjoy the exhibition?": the line; #36 (a quoted model + で答えて) is an ask to produce', /practised sentence:/.test(on.fMakeJa) && on.askedT36);
  check('I1: a statement starter ("Start with \"I have learned…\"") then "Hmm, what about you? What have you learned?": no line (a real question back)', !/practised sentence:/.test(on.fStarterBack), on.fStarterBack);
  check('I2: "What city do you live in?" after "I live in Nagoya. What city do you live in?" is no fragment', !v2CardIsFragment('What city do you live in?', 'I live in Nagoya. What city do you live in?'));
  check('I2: "Where are you from?" after "I\'m from Osaka. Where are you from?" is no fragment', !v2CardIsFragment('Where are you from?', 'I\'m from Osaka. Where are you from?'));
  check('I2: the tutor\'s "This is the team I work with." after "I work with my team every day." is no fragment', !v2CardIsFragment('This is the team I work with.', 'I work with my team every day.'));
  check('I2: "I am proud of." is still one inside a two-sentence turn ("Yes. I proud of uh donations project.")', v2CardIsFragment('I am proud of.', 'Yes. I proud of uh donations project.'));
  check('I2: through runV2Turn, the question card "What city do you live in?" is painted', on.frag2.length === 1 && !/^not /.test(on.frag2[0]![1]), on.frag2);
  check('I3: the scored turn of a sentence item: no practised line, no 7b/7g card line, no runtime learner card', !/practised sentence:/.test(on.sentFacts) && !/their answer just now had \d+ sentences? of their own|a sentence of theirs/.test(on.sentFacts) && on.sentCalls.length === 0, [on.sentFacts.split('\n').filter((l) => /sentence/.test(l)), on.sentCalls]);
  check('I3: the scored "responsibilities." turn: no practised line either', !/practised sentence:/.test(on.scoredFacts));
  check('M1: the arm writes the card but enters nothing: "didn\'t get to the pronunciation part" still said with no attempt', on.armCards.includes(SENT_K) && on.armedSaid === 0 && /pronunciation/i.test(on.armedNextTime ?? ''), [on.armCards, on.armedNextTime]);
  check('M1: the scored attempt enters it', on.sentSaid === 1);
  check('M2: the score line says the word numbers are not to be said', /the word numbers above are for you, not to be said/.test(on.sentFacts));
  check('M5: no starter line on the pronunciation page; it stays in a practice part', !/starters:/.test(on.sentFacts) && /starters:/.test(on.f37));

  console.log('fix round 2');
  check('N1: T36 then the question with a final period ("…last year."): the line', /practised sentence:/.test(on.fPeriod), on.fPeriod);
  check('N1: T36 then lower case with no mark ("did you enjoy … last year"): the line', /practised sentence:/.test(on.fBare));
  check('N1: the line leaves room for a plain request for help', /Only if they are plainly asking you what to do, what a word means, or to hear it again, answer that/.test(on.fPeriod));
  check('N1/I1 kept: a question about them, then their real question back: no line', !/practised sentence:/.test(on.fBack) && !/practised sentence:/.test(on.fStarterBack));
  const prod = (t: string) => v2AskedToProduce([a(t)]);
  check('N2: no ask to produce: "Don\'t just repeat my words. What did you do last weekend?", "Feel free to ask me anything. What did you do?", 「よく聞いてみてください。」, a quoted question discussed beside a statement starter', !prod("Don't just repeat my words. What did you do last weekend?") && !prod('Feel free to ask me anything. What did you do?') && !prod('よく聞いてみてください。') && !prod('The question "Have you ever…" is answered with "Yes, I have". Start with "Yes, I have…".'));
  check('N2: asks to produce: 「質問をしてみてください。」, 「質問を作りましょう。」, 「「Did you…」を使って質問をしてください。」, "Try asking me about my weekend.", "Make two questions with \'did\'."', prod('では、質問をしてみてください。') && prod('では、質問を作りましょう。') && prod('「Did you…」を使って質問をしてください。') && prod('Try asking me about my weekend.') && prod("Make two questions with 'did'."));
  check('N2: kept: T36, "Now ask me a question…", "Repeat after me."', on.askedT36 && prod('Now ask me a question about my weekend.') && prod('Repeat after me: "I have worked here for five years."'));
  check('M3: an arm, then the reply closes on its own different question ("What else did you do for the project?"): disarmed (event), nothing recorded', !on.armQArmed && on.armQEvents.includes('pronunciation_disarmed'), [on.armQArmed, on.armQEvents]);
  check('M3: their answer next turn is an ordinary practice turn: the 7b/7g card line and a 7q signal', /their answer just now had \d+ sentences? of their own|a sentence of theirs/.test(on.armQNextFacts) && on.armQNextEvents.some((e) => /^v2_practice_signal (?:wrong|clean)/.test(e)), [on.armQNextEvents]);
  check('M3: an arm that ends on the repeat request (#69 「私の後に繰り返してください。」) or on the item (#76 "… international") stays armed', on.t69Armed && !v2ArmClosesOnOtherAsk(T76, ['international']) && !v2ArmClosesOnOtherAsk(T69, ['responsibilities']) && !v2ArmClosesOnOtherAsk('Can you say "international" for me?', ['international']));
  check('M3: the shape that disarms, pure', v2ArmClosesOnOtherAsk(ARM_Q_K, ['I emailed everyone to ask them to donate.']));
  check('N6: "Who did you go with?" after "Who did you go with to the party?" is no fragment (a question card is whole)', !v2CardIsFragment('Who did you go with?', 'Who did you go with to the party?'));

  console.log('fix round 3');
  const KEEP: Array<[string, string]> = [['「international」です。発音してみてください。', 'international'], ['一緒に言ってみましょう。', 'international'], ['この文を読んでみてください。', 'I have worked with international customers.'], ['言えますか。', 'responsibilities'], ['Now you try.', 'international'], ['Go ahead.', 'international'], ['Let me hear it.', 'international'], ['Ready?', 'international'], ['Can you pronounce it?', 'international']];
  const kept = KEEP.filter(([t, item]) => v2ArmClosesOnOtherAsk(`Listen: "${item}". ${t}`, [item]));
  check('I-A: the nine hand-overs keep the arm (発音してみて, 一緒に言ってみましょう, 読んでみて, 言えますか, Now you try, Go ahead, Let me hear it, Ready?, Can you pronounce it?)', kept.length === 0, kept);
  const SESSION_ARMS: Array<[string, string]> = [[T69, 'responsibilities'], ['英語の単語を一つずつ練習しましょう。まず、この単語を言ってみてください。responsibilities', 'responsibilities'], ['もう一度、responsibilities と言ってみてください。', 'responsibilities'], [T76, 'international'], [`${T76}\n\nDoes that make sense?`, 'international'], ['はい、わかりました。では、もう一度 international と言ってみてください。', 'international']];
  check('I-A: the session\'s real armed replies (#69, #70, #72, #76 with and without its check-in, #78) keep the arm', SESSION_ARMS.every(([t, i]) => !v2ArmClosesOnOtherAsk(t, [i])));
  check('I-A: "…Repeat after me: X. What did you do last weekend?" and 「…繰り返してください。週末は何をしましたか。」 drop it; the M3 shape still disarms through runV2Turn', v2ArmClosesOnOtherAsk('Good. Repeat after me: "I emailed everyone to ask them to donate." What did you do last weekend?', ['I emailed everyone to ask them to donate.']) && v2ArmClosesOnOtherAsk('「I emailed everyone.」私の後に繰り返してください。週末は何をしましたか。', ['I emailed everyone.']) && !on.armQArmed);
  check('I-A: a content question that holds the item keeps it ("How do you say \"international\"?")', !v2ArmClosesOnOtherAsk('How do you say "international"?', ['international']));
  check('m2: the answer to the disarmed reply\'s closing question gets no practised line (the 7b/7g card line stays)', !/practised sentence:/.test(on.armQNextFacts) && /their answer just now had \d+ sentences? of their own|a sentence of theirs/.test(on.armQNextFacts));
  check('m1: "Could you ask me a question using \'did\'?", "Now you can ask me a question about my weekend.", "Ask me if I have ever been to Japan." are asks to produce; "Feel free to ask me anything." is not', prod("Could you ask me a question using 'did'?") && prod('Now you can ask me a question about my weekend.') && prod('Ask me if I have ever been to Japan.') && !prod('Feel free to ask me anything. What did you do?'));

  console.log('fix round 4');
  check('N-A: "Good. Repeat after me.\\n\\nWhat did you do last weekend?" (no arm), then their repetition: the practised line', /practised sentence:/.test(on.fNA1), on.fNA1);
  check('N-A: "Ask me a question about my weekend. What would you like to know?" (no arm), then their question: the practised line', /practised sentence:/.test(on.fNA2), on.fNA2);
  check('N-A: "…Repeat after me: X. What did you do last weekend?" with an arm: disarmed and marked; their answer gets no practised line; the mark is used up', !on.armQ4Armed && on.armQ4Mark && !/practised sentence:/.test(on.armQ4NextFacts) && !on.armQ4NextMark, [on.armQ4Armed, on.armQ4Mark, on.armQ4NextMark]);
  check('N-A: the mark is read back by the route only without an arm', v2ReadPronunciation({ seq: 2, disarmed: true })?.disarmed === true && !v2ReadPronunciation({ seq: 2, disarmed: true, armed: { seq: 2, items: ['x'], attempt: 1 } })?.disarmed && !('disarmed' in (v2ReadPronunciation({ seq: 2 }) ?? {})));
  const KEEP4: Array<[string, string]> = [['How about you try?', 'international'], ['どうでしょう、言えますか。', 'international'], ['どうぞ、言ってみませんか。', 'international'], ['いつもの発音で言ってみませんか。', 'international']];
  const kept4 = KEEP4.filter(([t, item]) => v2ArmClosesOnOtherAsk(`Listen: "${item}". ${t}`, [item]));
  check('n-b: "How about you try?", 「どうでしょう、言えますか。」, 「どうぞ、言ってみませんか。」, 「いつもの発音で言ってみませんか。」 keep the arm', kept4.length === 0, kept4);
  check('n-b: an invitation to say it keeps the arm beside a question word ("Now, how would you say that word?"); いつも / どうぞ are no question words, いつ / どう still are', !v2ArmClosesOnOtherAsk('Listen: "international". Now, how would you say that word?', ['international']) && !v2ArmClosesOnOtherAsk('「international」です。いつもどおりでいいですか。', ['international']) && v2ArmClosesOnOtherAsk('「international」です。いつ行きましたか。', ['international']) && v2ArmClosesOnOtherAsk('「international」です。週末はどうでしたか。', ['international']) && v2ArmClosesOnOtherAsk('Listen: "international". How about your weekend, what did you do?', ['international']));

  console.log('each switch off alone (a child process per switch): as at dcdf5430 for that item');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC5_7S_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Awaited<ReturnType<typeof probe>>;
  };
  {
    const off = child('PRACTISED_SENTENCE');
    check('PRACTISED_SENTENCE off: no line, and #36 / #59 are no asks for a sentence again', !/practised sentence:/.test(off.f37) && !off.asked36 && !off.asked59);
    check('fix round 4 (N-A): PRACTISED_SENTENCE off: no line on either input', !/practised sentence:/.test(off.fNA1) && !/practised sentence:/.test(off.fNA2));
    check('PRACTISED_SENTENCE off: the other items unchanged', /starters:/.test(off.f37) && off.practiceSaid?.pronunciation === 1);
  }
  {
    const off = child('STARTER_IS_ANSWER');
    check('STARTER_IS_ANSWER off: no starter line; the step line exactly the 7v form line without the statement clause (the 7q wording is SUPPORT_FOLLOWED off)', !/starters:/.test(off.f37) && off.starter === v2SupportFormLine('starter', false), off.starter);
  }
  {
    const off = child('PRONUNCIATION_PAGE');
    check('PRONUNCIATION_PAGE off: no card, no practice counted, "didn\'t get to the pronunciation part", no score-only line', !off.pronCards.length && !off.practiceSaid?.pronunciation && /pronunciation/i.test(off.nextTime ?? '') && !/only number you may say/.test(off.scoredFacts), [off.pronCards, off.practiceSaid, off.nextTime]);
    check('PRONUNCIATION_PAGE off: #76 with the arm gets "Does that make sense?" (as live)', CHECK_IN.test(off.said76), off.said76);
    check('fix round 2 (N5): PRONUNCIATION_PAGE off, PRACTISED_SENTENCE on: the scored "responsibilities." turn after 「繰り返して」 gets no practised line', !/practised sentence:/.test(off.scoredFacts));
    check('fix round 2 (M3): PRONUNCIATION_PAGE off: the arm before another question stands (as before)', off.armQArmed);
    check('fix round 4 (N-A): PRONUNCIATION_PAGE off: both unarmed inputs still get the practised line; the arm stands unmarked', /practised sentence:/.test(off.fNA1) && /practised sentence:/.test(off.fNA2) && off.armQ4Armed && !off.armQ4Mark, [off.armQ4Armed, off.armQ4Mark]);
  }
  {
    const off = child('QUESTION_NOT_NOTE');
    check('QUESTION_NOT_NOTE off: no question-card line', !/question card \(a <board problem>/.test(off.f37));
  }
  {
    const off = child('FRAGMENT_CARD');
    check('FRAGMENT_CARD off: "I am proud of." is painted (as live)', off.frag.length === 2 && !/^not /.test(off.frag[0]![1]), off.frag);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
