/// <reference types="node" />
/**
 * Tutor brain v2 — Task 8c: mic test 10 (embed-1795202398886): the board never shows the learner's wrong sentence after its correction,
 * a correction is kept, and the Summary page's headings come from the runtime. The session's plan
 * (gdi-work-projects-v1) and its real turns (task-8b-investigation.md). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic10-8c
 *
 *  1 OWED_CARD_RIGHT   T31 → T32 with the board check: no owed-card line once the corrected card WB25 is up (v2IsCorrectionOf, the one
 *                      test; it drops a clause of T31); the check's marked as-said card WB26 not painted; the owed line asks only for
 *                      the right sentence; T35 → T36: WB29 corrects T35 (fix round 2: stems alike count as shared), so no owed line
 *                      and the marked WB30 refused; a right sentence beside another right model card still carded, clean;
 *                      two sentences of one turn never claim one card
 *  2 CORRECTION_KEPT   T32 scored as a correction (signal wrong), recorded with marks, re-test recorded; the pairing takes the correction
 *                      over a marked as-said card, and a right unmarked as-said card over a tutor's model card
 *  3 SUMMARY_HEADINGS  T89 (the summary reply, no heading notes): the headings written once each before their first card, corrections
 *                      under "To improve" with their marks, other cards under "What went well" (above "To improve" when it came
 *                      first), rule notes above, the Japanese line on each heading for a beginner, a model-written heading not doubled;
 *                      a heading known only by its wording (M1); a card corrected this very turn under "To improve" (M3)
 *                      fix round 3: stems alike only for a marked card: an unmarked model card "She enjoys working with clients." beside
 *                      their right "I enjoy working with customers." is no correction
 *  4 ASK_LAST_QUESTION T44 ("…for a long time? Please answer in English.") is an ask for a sentence: T45 is a practice answer, owed a card;
 *                      the board check's corrected card scores the re-test put at T44
 *                      fix round 4: the marked WB29 is entered among their corrected sentences; a card's emphasis given as one string
 *                      is its marks for the pairing too
 *  each switch off alone (a child process per switch); a maths voice lesson and a typed language lesson unchanged.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Retest, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { v2NoteCorrection } from '../src/lib/tutor/v2/summary-marks';
import { V2_AS_SAID_REFUSED, v2CardCorrects, v2CardIsOf, v2CardSentence, v2LastQuestionOf, v2OwedCardCheckLine } from '../src/lib/tutor/v2/learner-card';
import { v2PracticePairs } from '../src/lib/tutor/v2/adaptive';
import { V2_SUMMARY_IMPROVE_HEADING, V2_SUMMARY_WELL_HEADING } from '../src/lib/tutor/v2/summary-headings';
import { TUTOR_V2_RETEST_SEVERAL_FIXES } from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC10_8C_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, JSON.stringify(detail ?? '', null, 1)?.slice(0, 3000)); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Reply = { text: string; tools?: Array<{ name: string; input: Record<string, unknown> }> };
/** A scripted model: the replies in order (the last repeated); every user text of every call kept (the facts, the board check). */
function scripted(replies: Reply[]) {
  const asks: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (last?.role === 'user') for (const b of (Array.isArray(last.content) ? last.content : [{ type: 'text', text: last.content }]) as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text) asks.push(b.text);
    const r = replies[Math.min(i, replies.length - 1)]!; i += 1;
    onText?.(r.text);
    // Fix round 4: a reply may carry structured tool calls (a sentence card written through the tool, its emphasis one string).
    if (r.tools?.length) return msg([{ type: 'text', text: r.text }, ...r.tools.map((t, k) => ({ type: 'tool_use', id: `tu_${i}_${k}`, name: t.name, input: t.input }))], 'tool_use');
    return msg([{ type: 'text', text: r.text }], 'end_turn');
  };
  return { call, asks };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Praveen', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI, pronunciation: true,
  teacher: { name: 'Ryota', background: 'I help Japanese professionals speak English at work.' } };
const maths: V2Session = { studentName: 'Sam', subject: 'Maths', level: 'Grade 8', mode: 'voice', timeBoxMinutes: 20 };
const typedLang: V2Session = { ...lang, mode: 'text' };
const MIN = 60000;
const START = '[The session has just started. The student has joined and is waiting for you to begin the lesson.]';
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
const ids = GDI.segments.map((s) => s.id);
const goalsThrough = (n: number) => Object.fromEntries(ids.slice(0, n).map((id) => [id, { status: 'shown' as const, at: 0 }]));
const base = (extra: Partial<V2State>): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, timeFit: { dropped: [], byArrival: true }, ...extra });
async function turn(session: V2Session, state: V2State, said: string | null, replies: Reply[], atMin: number, boardPass = true) {
  const m = scripted(replies);
  const r = await runV2Turn({ session, state: structuredClone(state), studentSaid: said, callModel: m.call, boardPass, mathsCheck: false, nowMs: atMin * MIN });
  const calls = r.toolCalls.map((c) => ({ id: c.id, name: c.name, text: String(c.args.sentence ?? c.args.text ?? c.args.title ?? ''), style: c.args.style ?? null, gloss: c.args.gloss ?? null, emphasis: c.args.emphasis ?? null, outcome: c.outcome, before: c.before ?? null }));
  const page = r.state.board.pages[r.state.board.current];
  return { calls, asks: m.asks, check: m.asks.find((x) => x.startsWith('[board check')) ?? '', facts: m.asks.filter((x) => x.startsWith('<facts>')).join('\n'), events: (r.events ?? []).map((e) => `${e.type} ${e.message}`),
    corrections: r.state.corrections ?? [], corrected: r.state.correctedSentences ?? [], retests: r.state.retests ?? [], page: page ? page.items.map((it) => `${it.tool}: ${it.summary}`) : [], spoken: r.spoken };
}

// ── The session's turns (transcript indexes as in the investigation) ──
const T0 = 'Hello, I\'m Ryota, and welcome to your English lesson! Today we\'ll talk about your work and a project you\'ve been involved in, and practise two grammar points: the present perfect and the past simple. Does that sound good to you?';
const T22 = 'その文はそのままで自然です。次は「Present perfect」です。このまま進みますか？それとも、先に質問がありますか？';
const T30 = 'いいですね、お客様に合う洗濯機を選ぶ手伝いをしている、と伝わります。ただ、「best」の前に「the」が必要です。「the best washing machine」と言います。\n\n<board sentence stress="the | best" gloss="「the best」と言います。">I help customers choose the best washing machine for home.</board>\n\nNow, how long have you worked in sales? Please answer with a full sentence.\n\n<board problem gloss="営業の仕事を何年していますか？">How long have you worked in sales?</board>';
const T31 = 'Um, I worked in sales uh 3 year before that work as receptionist.';
const WB25 = 'I worked in sales for three years.';
const WB26 = 'I worked in sales three year before that work as receptionist.';
const T32 = '営業の仕事は今は終わっているので、過去形を使ったのは正しいです。ただ、期間を言うときは「for」が必要で、year は複数形になります。\n\n<board note gloss="期間を表すときは「for」と数字の後の複数形を使います。">We use "for" + a number of years: "for" three "years".</board>\n\n'
  + `<board sentence stress="for | three | years" gloss="営業の仕事を三年間しました。">${WB25}</board>\n\nこの文をもう一度言ってみてください。`;
const CHECK_WB26 = `1: none\n2: <board sentence stress="three | year" gloss="「営業を三年しました」。数字の後の year は years ではなく for three years と言います。" with="営業の仕事は今は終わっている">${WB26}</board>\n3: none (nothing to draw)`;
const T34 = '惜しいですね。「for three years」の「for」が抜けています。正しくは、こう言います。\n\n<board sentence stress="for | three | years" gloss="営業を三年間しました。">I worked in sales for three years before that, as a receptionist.</board>\n\n I worked in sales for three years before that, as a receptionist.\n\n次は、今の会社で学んだスキルについて話してみましょう。「I have learned...」で始めてください。\n\n What is one skill you have learned at Nagoya Corporation?';
const T35 = 'Um, I learn uh the skill for negotiate uh with customer.';
const WB29 = 'I have learned how to negotiate with customers.';
const WB30 = 'I learn the skill for negotiate with customer.';
const T36 = 'スキルの話、いいですね。ただ、「learn」は「have learned」にします。今の会社で身につけて、今も使っているスキルだからです。\n\n'
  + `<board sentence stress="have | learned | to | negotiate" gloss="「have learned」は過去から今までのスキルを表します。">${WB29}</board>\n\nもう一度、この文を言ってみてください。`;
const CHECK_WB30 = `1: none\n2: <board sentence stress="learn | negotiate" gloss="「learn」は「have learned」にします。" with="ただ、「learn」は「have learned」にします">${WB30}</board>\n3: none (nothing to draw)`;
const NONE = { text: '1: none\n2: none\n3: none (nothing to draw)' };

const PP_PAGES: V2BoardPage[] = [{ title: 'Overview', items: [] }, { title: 'Level check', items: [] }, { title: 'Your job', items: [card('wb16', 'I help customers choose the right washing machine for home.')] },
  { title: 'Present perfect', items: [card('wb20', 'I have worked at Nagoya Corporation for five years.'), card('wb22', 'I help customers choose the best washing machine for home.'), { id: 'wb23', tool: 'show_problem', summary: 'Question — How long have you worked in sales?' }] }];
const ppHead = [u(START), a(T0), u('Yes.'), a(T22), u('Yes.')];
/** T31's turn: in Present perfect (entered at lesson 4.2), T30 asked for a full sentence. One retest of the part kept (room for one more). */
const atT31 = () => base({ board: { pages: structuredClone(PP_PAGES), current: 3 }, goals: goalsThrough(3), partStart: { part: 'present-perfect', at: 4.2 * MIN }, support: { step: 'normal', wrong: 0, clean: 0, part: 'present-perfect' },
  retests: [{ part: 'present-perfect', said: 'Yes, I worked at Nagoya uh 5 years ago.', right: 'I have worked at Nagoya Corporation for five years.', target: ['i have', 'corporation for five'], turn: 16 }],
  history: [...ppHead, a('Present perfect は、過去に始まって今も続いていることを話すときに使います。\n\nNow, have you worked for your current company for a long time?'), u('I help customers um choose best washing machine for home.'), a(T30)] });
/** T35's turn: T34 asked the next question (a fresh retest list, so T36's can be recorded: the live part held two already). */
const atT35 = () => { const s = atT31(); s.retests = []; s.history.push(u(T31), a(T32), u('I worked in sales 3 year before the work before that work as receptionist.'), a(T34)); s.board.pages[3]!.items.push(card('wb25', WB25), card('wb27', 'I worked in sales for three years before that, as a receptionist.'), { id: 'wb28', tool: 'show_problem', summary: 'Question — What is one skill you have learned at Nagoya Corporation?' }); return s; };

// ── Past simple, T44 → T45 → T46 ──
const T44 = '正しく言えました。 Let\'s keep going with that one.\n\nNow, have you been with your current company for a long time? Please answer in English.\n\n<board problem gloss="今の会社には長く勤めていますか？英語で答えてください。">Have you been with your current company for a long time?</board>';
const T45 = 'Yes, I am with uh the current company uh for a long time.';
const WB37 = 'We use "have been" for experience that continues now: I "have been" with the company for a long time.';
const T46 = '惜しいです。「I am」は今の状態を表すので、ここでは使いません。今まで続いている経験なので、「have」を使ってください。\n\n'
  + `<board note gloss="今まで続いている経験は「have been」で言います。">${WB37}</board>\n\nもう一度、「Yes, I ...」から言ってみてください。`;
const WB64 = 'I have been with the company for a long time.';
/** The board check, told T45 is owed a card, writes the corrected sentence (what the right-sentence owed line asks for). */
const CHECK_T46 = `1: none\n2: <board sentence stress="have | been" gloss="今の会社に長く勤めています。" with="今まで続いている経験なので">${WB64}</board>\n3: none (nothing to draw)`;
const PS_PAGES: V2BoardPage[] = [...structuredClone(PP_PAGES), { title: 'Past simple', items: [card('wb32', 'I attended an exhibition last year.'), card('wb34', 'I attended a robotics exhibition in Tokyo two years ago.'), { id: 'wb36', tool: 'show_problem', summary: 'Question — Have you been with your current company for a long time?' }] }];
const PUT: V2Retest = { part: 'present-perfect', said: 'Yes, I worked at Nagoya uh 5 years ago.', right: 'I have worked at Nagoya Corporation for five years.', target: ['i have', 'corporation for five'], turn: 16, offered: 3, in: 'past-simple', askedAt: 3, lastAt: 5, put: 5, question: 'Have you worked for your current company for a long time?' };
const atT45 = () => base({ board: { pages: structuredClone(PS_PAGES), current: 4 }, goals: goalsThrough(4), partStart: { part: 'past-simple', at: 8.4 * MIN }, support: { step: 'normal', wrong: 0, clean: 0, part: 'past-simple' }, retests: [structuredClone(PUT)],
  history: [...ppHead, a('<board page>Past simple</board>\n過去形は、終わった出来事に使います。\n\n Did you attend any business events or exhibitions last year?'), u('Yes, I attend robotics exhibition Tokyo 2 year ago.'), a('「attended」にします。<board sentence stress="attended">I attended a robotics exhibition in Tokyo two years ago.</board>もう一度、この文を言ってみてください。'), u('I attended a robotics exhibition in Tokyo 2 years ago.'), a(T44)] });

// ── Fix round 1 (I1) pins ──
const RIGHT = 'I worked in sales for three years.';
const ENJOY_SAID = 'I enjoy working with customers.';
const MODEL = 'I worked in marketing for five years.';
/** A right sentence of theirs; the reply writes another model sentence first, then their sentence as said (no marks). */
const R_MODEL = `That's right. Another example: ${sc0(MODEL)} And yours: ${sc0(RIGHT)} What did you do before that?`;
function sc0(x: string, stress?: string) { return `<board sentence${stress ? ` stress="${stress}"` : ''}>${x}</board>`; }
/** Two sentences of one turn with a shared pattern: the first right, the second corrected. */
const TWO_SAID = 'I worked in Tokyo for two years. I work in Osaka for three year.';
const S1 = 'I worked in Tokyo for two years.';
const S2_FIX = 'I have worked in Osaka for three years.';
const R_TWO = `Your first sentence is right. ${sc0(S2_FIX, 'have | worked | years')} ${sc0(S1, 'worked')} Say the second one again, please.`;

// ── The Summary page, T89 (no heading notes) ──
const WB61 = 'We use "have worked" for experience that started in the past and continues now.';
const WB62 = 'We use the past simple, like "attended", for a finished event with a time word such as "last year".';
const WB63 = 'I worked on a project to collect donations for a climate change project.';
const WB65 = 'I have worked at Nagoya Corporation for five years.';
const WB66 = 'I attended a robotics exhibition in Tokyo two years ago.';
const sc = (s: string, stress?: string, gloss?: string) => `<board sentence${stress ? ` stress="${stress}"` : ''}${gloss ? ` gloss="${gloss}"` : ''}>${s}</board>`;
const T89 = (headings: { well?: boolean } = {}) => '今日は、仕事の話をたくさん練習しましたね。文法は二つでした。\n\n'
  + `<board note gloss="今も続いている経験。">${WB61}</board>\n<board note gloss="終わった出来事。">${WB62}</board>\n\n良かったところは、お客様への説明がよく伝わったことです。\n\n`
  + `${headings.well ? '<board note style="heading" gloss="良かったところ">What went well</board>\n' : ''}${sc(WB63, 'donations | a', '気候変動プロジェクトのために寄付を集めました。')}\n${sc(WB64, '', '今の会社に長く勤めています。')}\n\n直すところは、期間と過去の時を表す言葉です。\n\n`
  + `${sc(WB65, 'have | corporation | for', 'Nagoya Corporation で五年間働いています。')}\n${sc(WB66, 'attended | two | years | ago', '二年前に東京で展示会に参加しました。')}\n\n`
  + 'では最後に、考えてみてください。Before we finish, can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago.\n\n<board problem gloss="二つの文の違いを説明してください。">Before we finish, can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago.</board>';
const SUM_PAGES: V2BoardPage[] = [...structuredClone(PS_PAGES), { title: 'Conversation', items: [] }, { title: 'Pronunciation', items: [] }, { title: 'Summary', items: [] }];
/** The lesson's corrections as recorded live (said → card): T25, T41, T57. T45's (WB64) was made by a note only and is in no record. */
const RECORDS: Array<[string, string]> = [
  ['Yes, I worked at Nagoya uh 5 years ago.', WB65],
  ['Yes, I attend robotics exhibition Tokyo 2 year ago.', WB66],
  ['I worked on a project to um to uh uh to collect donation for climate change project.', WB63],
  [T45, WB64],
];
const atT88 = (only: readonly string[], items: V2BoardPage['items'] = []) => {
  const pages = structuredClone(SUM_PAGES); pages[7]!.items = structuredClone(items);
  const s = base({ board: { pages, current: 7 }, goals: goalsThrough(7), partStart: { part: 'summary', at: 19.7 * MIN },
    history: [...ppHead, a('Your score for that word was 100 out of 100, and the whole sentence came out at 94 out of 100. Well done. Would you like one more item, or shall we move on to the summary?')] });
  for (const [said, right] of RECORDS) if (only.includes(right)) v2NoteCorrection(lang, s, right, [], said);
  return s;
};

async function probe() {
  // 1 + 2: T31 → T32 and T35 → T36, the board check writing the as-said card.
  const t32 = await turn(lang, atT31(), T31, [{ text: T32 }, { text: CHECK_WB26 }, NONE], 6.6);
  const t36 = await turn(lang, atT35(), T35, [{ text: T36 }, { text: CHECK_WB30 }, NONE], 8.1);
  // Fix round 4 (m-1): the correcting card written through the tool with its emphasis as ONE STRING: marks for the pairing too.
  const t36s = await turn(lang, atT35(), T35, [{ text: 'スキルの話、いいですね。ただ、「learn」は「have learned」にします。', tools: [{ name: 'show_sentence', input: { sentence: WB29, emphasis: 'learned' } }] }, { text: 'もう一度、この文を言ってみてください。' }, NONE], 8.1);
  // A right sentence of theirs (T37 "I have learned how to negotiate with customers.") is carded as said.
  const t38 = await turn(lang, (() => { const s = atT35(); s.history.push(u(T35), a(T36)); s.board.pages[3]!.items.push(card('wb29', WB29)); return s; })(), 'I have learned how to negotiate with customers today at work.',
    [{ text: 'その文は正しいです。\n\n<board sentence>I have learned how to negotiate with customers today at work.</board>\n\nWhat else have you learned?' }, NONE], 8.3);
  // I1 pins: a right sentence beside another model card; two sentences of one turn.
  const rModel = await turn(lang, atT31(), RIGHT, [{ text: R_MODEL }, NONE], 6.6);
  // Fix round 3 (ruling): stems only for a marked card. A right answer with only an unmarked model card painted: not a correction.
  const ENJOY = 'I enjoy working with customers.';
  const rEnjoy = await turn(lang, atT31(), ENJOY, [{ text: `Nice. ${sc0('She enjoys working with clients.')} What else do you enjoy?` }, NONE], 6.6);
  // …the same model card with marks (reported, no rule for it).
  const rEnjoyMarked = await turn(lang, atT31(), ENJOY, [{ text: `Nice. ${sc0('She enjoys working with clients.', 'enjoys')} What else do you enjoy?` }, NONE], 6.6);
  // Fix round 2: a right sentence of theirs next to a tutor model card that shares an inflected word ("She works in marketing.").
  const rInfl = await turn(lang, atT31(), 'I worked in marketing for five years.', [{ text: `That's right. ${sc0('She works in marketing.')} And yours: ${sc0('I worked in marketing for five years.')} What did you do before that?` }, NONE], 6.6);
  const rTwo = await turn(lang, atT31(), TWO_SAID, [{ text: R_TWO }, NONE], 6.6);
  // The owed line itself, for a sentence the reply carded nowhere.
  const owedLine = v2OwedCardCheckLine(lang, [WB26]);
  // 4: T45 → T46 (T44 as stored), the board check writing the corrected card the owed line asks for.
  const t46 = await turn(lang, atT45(), T45, [{ text: T46 }, { text: CHECK_T46 }, NONE], 10.9);
  // 2: the pairing on the live T32 cards (WB26 painted before WB25 was read, as at HEAD).
  const pairs = v2PracticePairs(['I worked in sales 3 year before that work as receptionist.'], [{ sentence: WB26, stress: ['three', 'year'] }, { sentence: WB25, stress: ['for', 'three', 'years'] }]);
  // 3: T89. (A) the live records (WB63, WB65, WB66; WB64 corrected by a note only, in no record); (B) only WB63 and WB64 recorded; (C) as
  // B with the model's own "What went well" heading before WB63; (D) a model heading after the runtime's.
  const sumA = await turn(lang, atT88([WB63, WB65, WB66]), 'Uh, move on.', [{ text: T89() }, NONE], 19.75, false);
  const sumB = await turn(lang, atT88([WB63, WB64]), 'Uh, move on.', [{ text: T89() }, NONE], 19.75, false);
  const sumC = await turn(lang, atT88([WB63, WB64]), 'Uh, move on.', [{ text: T89({ well: true }) }, NONE], 19.75, false);
  const sumD = await turn(lang, atT88([WB63, WB64]), 'Uh, move on.', [{ text: `${sc(WB65)}\n<board note style="heading">What went well</board>\n${sc(WB66)}\nGood.` }, NONE], 19.75, false);
  // M1: short rule notes with "good" / "better" up on the page from an earlier reply, and one written now: no heading.
  const ruleNotes = [{ id: 'r1', tool: 'annotate', summary: 'Good: for + a length of time' }, { id: 'r2', tool: 'annotate', summary: 'Use better word order' }];
  const sumM1 = await turn(lang, atT88([WB63, WB64], ruleNotes), 'Uh, move on.', [{ text: `<board note>Good: past simple with a time word</board>\n${sc(WB65)}\n${sc(WB63, 'donations | a')}\nGood.` }, NONE], 19.75, false);
  // M3: a card on the Summary page correcting what they say this very turn (no record before): under "To improve".
  const sumM3 = await turn(lang, atT88([]), 'I attend robotics exhibition Tokyo 2 year ago.', [{ text: `${sc(WB65)}\n${sc(WB66, 'attended | two | years | ago')}\nGood.` }, NONE], 19.75, false);
  // An intermediate learner: the headings with no Japanese line.
  const sumI = await turn(lang, { ...atT88([WB63, WB64]), workingLevel: { level: 'intermediate', from: 'this_lesson' } }, 'Uh, move on.', [{ text: T89() }, NONE], 19.75, false);
  // Other lessons.
  const typed = await turn(typedLang, atT31(), T31, [{ text: T32 }, { text: CHECK_WB26 }, NONE], 6.6);
  const mathsTurn = await turn(maths, { ...newV2State(0), history: [u('x'), a('What is 3 times 4?')] }, '12', [{ text: 'Yes, 12. <board equation>3 \\times 4 = 12</board> What is 6 × 7?' }, NONE], 18.1);
  return { t32, t36, t36s, t38, rModel, rInfl, rEnjoy, rEnjoyMarked, rTwo, owedLine, t46, pairs, sumA, sumB, sumC, sumD, sumM1, sumM3, sumI, typed: { calls: typed.calls, page: typed.page, check: typed.check }, maths: { calls: mathsTurn.calls, page: mathsTurn.page, check: mathsTurn.check } };
}

type Probe = Awaited<ReturnType<typeof probe>>;
const painted = (t: Probe['t32'], s: string) => t.calls.some((c) => c.name === 'show_sentence' && c.text === s && !/^not /.test(c.outcome));
const HAS_OWED = /put no card of (?:it|them) on the board/;

async function main() {
  const on = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }

  console.log('1  OWED_CARD_RIGHT: never their wrong sentence as a card');
  check('the one correction test: WB25 corrects T31 (v2CardIsOf did not: it drops "before that work as receptionist"); fix round 2/3: WB29, marked, corrects T35 (learned / learn, customers / customer count as shared: 5 of 8; unmarked, exact words: 3 of 8, no); their words as said never', v2CardCorrects(WB25, T31) && !v2CardIsOf(WB25, T31) && v2CardCorrects(WB29, T35, ['have', 'learned', 'to', 'negotiate']) && !v2CardCorrects(WB29, T35) && !v2CardCorrects(WB26, T31) && !v2CardCorrects(WB30, T35));
  check('T32: the corrected card WB25 painted inline; the board check ran with no owed-card line', painted(on.t32, WB25) && on.t32.check.length > 0 && !HAS_OWED.test(on.t32.check), on.t32.check.slice(-1500));
  check('…the check\'s WB26 (T31 as said, its words marked) not painted, with the reason; the page holds WB25 and not WB26', !painted(on.t32, WB26) && on.t32.page.includes(`show_sentence: ${WB25}`) && !on.t32.page.includes(`show_sentence: ${WB26}`), [on.t32.calls, on.t32.page]);
  check('T36 (fix round 2): WB29 painted; no owed-card line; WB30 (T35 as said, marked) not painted', painted(on.t36, WB29) && on.t36.check.length > 0 && !HAS_OWED.test(on.t36.check) && !painted(on.t36, WB30) && !on.t36.page.includes(`show_sentence: ${WB30}`), [on.t36.calls, on.t36.check.slice(-900)]);
  check('T36: scored wrong; the correction recorded with its marks; the re-test recorded', on.t36.events.some((e) => /^v2_practice_signal wrong part=present-perfect/.test(e)) && on.t36.corrections.some((c) => c.sentence === WB29 && c.stress.length > 0) && on.t36.retests.some((r) => r.right === WB29), [on.t36.events, on.t36.corrections, on.t36.retests]);
  check('fix round 4 (I-1): T36: the marked WB29 is entered among their corrected sentences (the 4c list) for T35, as T32\'s WB25 for T31', on.t36.corrected.includes(WB29) && on.t32.corrected.includes(WB25), [on.t36.corrected, on.t32.corrected]);
  check('fix round 4 (m-1): WB29 written through the tool with its emphasis as one string ("learned"): painted, paired as a correction (scored wrong, re-test recorded), entered among their corrected sentences', on.t36s.calls.some((c) => c.name === 'show_sentence' && c.text === WB29 && c.emphasis === 'learned' && !/^not /.test(c.outcome)) && on.t36s.events.some((e) => /^v2_practice_signal wrong part=present-perfect/.test(e)) && on.t36s.retests.some((r) => r.right === WB29) && on.t36s.corrected.includes(WB29), [on.t36s.calls, on.t36s.events, on.t36s.retests, on.t36s.corrected]);
  check('the owed line asks only for the right sentence (no "as they said it … wrong word stressed"); never their mistake', /the corrected sentence with the changed words stressed/.test(on.owedLine) && /Never their sentence with its mistake in it/.test(on.owedLine) && !/wrong word stressed/.test(on.owedLine), on.owedLine);
  check('a right sentence of theirs is still carded as said (painted)', painted(on.t38, 'I have learned how to negotiate with customers today at work.'), on.t38.calls);
  check('I1: a right sentence with a different right model card first ("I worked in marketing for five years."): carded as said, scored clean, no re-test', painted(on.rModel, RIGHT) && on.rModel.events.some((e) => /^v2_practice_signal clean/.test(e)) && !on.rModel.events.some((e) => /^v2_retest_recorded/.test(e)), [on.rModel.calls, on.rModel.events]);
  check('fix round 2: a right sentence ("I worked in marketing for five years.") next to a model card sharing an inflected word ("She works in marketing."): carded as said, clean, no re-test', painted(on.rInfl, 'I worked in marketing for five years.') && on.rInfl.events.some((e) => /^v2_practice_signal clean/.test(e)) && !on.rInfl.events.some((e) => /^v2_retest_recorded/.test(e)), [on.rInfl.calls, on.rInfl.events]);
  check('fix round 3: their right "I enjoy working with customers." with only the UNMARKED model card "She enjoys working with clients." painted: no correction (exact words): still owed its card, not scored wrong, no re-test, nothing recorded', HAS_OWED.test(on.rEnjoy.check) && /I enjoy working with customers/.test(on.rEnjoy.check) && !on.rEnjoy.events.some((e) => /^v2_practice_signal wrong|^v2_retest_recorded/.test(e)) && on.rEnjoy.corrections.length === 0 && on.rEnjoy.corrected.length === 0 && !v2CardCorrects('She enjoys working with clients.', ENJOY_SAID) && v2CardCorrects('She enjoys working with clients.', ENJOY_SAID, ['enjoys']), [on.rEnjoy.events, on.rEnjoy.corrections, on.rEnjoy.check.slice(-700)]);
  console.log(`  · (reported, no rule) the same model card MARKED "enjoys": owed line ${HAS_OWED.test(on.rEnjoyMarked.check) ? 'sent' : 'not sent'}; events ${JSON.stringify(on.rEnjoyMarked.events)}; corrections ${JSON.stringify(on.rEnjoyMarked.corrections)}`);
  check('I1: two sentences of one turn: the card correcting the second belongs to it (v2CardSentence), so the first one\'s as-said card is painted (even marked); one right, one corrected', v2CardSentence(S2_FIX, [S1, 'I work in Osaka for three year.']) === 1 && painted(on.rTwo, S1) && painted(on.rTwo, S2_FIX) && on.rTwo.events.some((e) => /^v2_practice_signal wrong .*sentences=2 corrected=1/.test(e)), [on.rTwo.calls, on.rTwo.events]);

  console.log('2  CORRECTION_KEPT: a correction is kept');
  check('T32 scored as a correction: practice signal wrong, the correction recorded with its marks (for, three, years), a re-test recorded', on.t32.events.some((e) => /^v2_practice_signal wrong part=present-perfect/.test(e)) && on.t32.corrections.some((c) => c.sentence === WB25 && c.stress.includes('for') && c.stress.some((w) => /^years?$/.test(w))) && on.t32.events.some((e) => /^v2_retest_recorded /.test(e)), [on.t32.events, on.t32.corrections]);
  check('the pairing takes the correction card (WB25) over the marked as-said one (WB26) when both are up', on.pairs.length === 1 && on.pairs[0]!.card === WB25 && on.pairs[0]!.corrected, on.pairs);
  check('I2: no note-only recording: T46\'s note WB37 records nothing by itself (the record comes from the corrected card)', on.t46.corrections.filter((c) => c.sentence === WB64).length === 1 && on.t46.calls.some((c) => c.text === WB64 && !/^not /.test(c.outcome)), on.t46.corrections);

  console.log('4  ASK_LAST_QUESTION: the ask read from the last question');
  check('v2LastQuestionOf: a question then one short non-question sentence gives the question; a long tail or no question before it gives the last', v2LastQuestionOf(['Now, have you been with your current company for a long time?', 'Please answer in English.']) === 'Now, have you been with your current company for a long time?' && v2LastQuestionOf(['Good.', 'Please answer in English.']) === 'Please answer in English.' && v2LastQuestionOf(['How long have you worked there?', 'I will tell you about my own job first and then we can compare them.']) === 'I will tell you about my own job first and then we can compare them.');
  // Task 8l fix round 1 (RETEST_SEVERAL_FIXES, the controller's ruling): the re-test put at T44 is of a card that fixed several errors ("i
  // worked" → "i have worked", "nagoya five" → "nagoya corporation for five"); T45 ("I am with … for a long time") brings back neither
  // original wrong form and uses no target phrase, so it is no longer scored (it was missed, by T46's correction touching "i have").
  // With the switch off it is missed as before.
  check('T44 → T45: a practice answer: T45 owed a card (the board check gets the line), counted (signal wrong) with the corrected card; the re-test put at T44: 8l fix round 1, not scored (switch off: missed)', HAS_OWED.test(on.t46.check) && on.t46.events.some((e) => /^v2_practice_signal wrong part=past-simple/.test(e))
    && (TUTOR_V2_RETEST_SEVERAL_FIXES ? !on.t46.events.some((e) => /^v2_retest_outcome target="i have", "corporation for five"/.test(e)) : on.t46.events.some((e) => /^v2_retest_outcome target="i have", "corporation for five" outcome=missed/.test(e))), [on.t46.events, on.t46.check.slice(-600)]);

  console.log('3  SUMMARY_HEADINGS: the Summary page\'s headings by the runtime');
  const headings = (t: Probe['sumA']) => t.calls.filter((c) => c.name === 'annotate' && c.style === 'heading' && !/^not /.test(c.outcome));
  const idx = (t: Probe['sumA'], s: string) => t.page.findIndex((x) => x.endsWith(s));
  const inOrder = (t: Probe['sumA'], xs: string[]) => { const o = xs.map((x) => idx(t, x)); return o.every((x, i) => x >= 0 && (i === 0 || x > o[i - 1]!)); };
  check('A (the live records: WB63, WB65, WB66 corrections; WB64 in none): notes, "What went well", WB64, "To improve", WB63, WB65, WB66; each heading once', inOrder(on.sumA, [WB61, WB62, V2_SUMMARY_WELL_HEADING, WB64, V2_SUMMARY_IMPROVE_HEADING, WB63, WB65, WB66]) && headings(on.sumA).length === 2, on.sumA.page);
  check('A: the corrections carry their record\'s marks; the headings carry the Japanese line for a beginner', (on.sumA.calls.find((c) => c.text === WB63)?.emphasis as string[] | null ?? []).length > 0 && headings(on.sumA).find((h) => h.text === V2_SUMMARY_IMPROVE_HEADING)?.gloss === 'これから直すところ' && headings(on.sumA).find((h) => h.text === V2_SUMMARY_WELL_HEADING)?.gloss === '良かったところ', [on.sumA.calls, headings(on.sumA)]);
  check('B (WB63, WB64 corrections; WB65, WB66 not): notes, "What went well", WB65, WB66, "To improve", WB63, WB64, the question card last', inOrder(on.sumB, [WB61, WB62, V2_SUMMARY_WELL_HEADING, WB65, WB66, V2_SUMMARY_IMPROVE_HEADING, WB63, WB64]) && headings(on.sumB).length === 2 && /^show_problem/.test(on.sumB.page[on.sumB.page.length - 1] ?? ''), on.sumB.page);
  check('B: the cards placed above "To improve" say so to the board (before = the heading); the corrections carry their marks', on.sumB.calls.filter((c) => c.text === WB65 || c.text === WB66 || c.text === V2_SUMMARY_WELL_HEADING).every((c) => c.before === on.sumB.calls.find((h) => h.text === V2_SUMMARY_IMPROVE_HEADING)?.id)
    && (on.sumB.calls.find((c) => c.text === WB64)?.emphasis as string[] | null ?? []).length > 0, on.sumB.calls);
  check('C (the model wrote "What went well" itself before WB63, as the 7u line asks): not doubled; WB63 under the runtime\'s "To improve", WB65/WB66 above it', headings(on.sumC).filter((h) => h.text === V2_SUMMARY_WELL_HEADING).length === 1 && headings(on.sumC).filter((h) => h.text === V2_SUMMARY_IMPROVE_HEADING).length === 1
    && inOrder(on.sumC, [V2_SUMMARY_WELL_HEADING, WB65, WB66, V2_SUMMARY_IMPROVE_HEADING, WB63, WB64]), [on.sumC.page, headings(on.sumC)]);
  check('D: a second "What went well" heading the model writes after the runtime\'s is not painted', on.sumD.calls.filter((c) => c.text === V2_SUMMARY_WELL_HEADING && /^not painted: the "What went well" heading is on the summary page already/.test(c.outcome)).length === 1 && headings(on.sumD).filter((h) => h.text === V2_SUMMARY_WELL_HEADING).length === 1, on.sumD.calls);
  check('M1: rule notes with "Good" / "better" (earlier and now) are no headings: the runtime still writes both, and the new note is painted', headings(on.sumM1).length === 2 && on.sumM1.calls.some((c) => c.text === 'Good: past simple with a time word' && !/^not /.test(c.outcome)), [on.sumM1.page, on.sumM1.calls]);
  check('M3: a card correcting their words this very turn (no record before) goes under "To improve"; the other under "What went well"', inOrder(on.sumM3, [V2_SUMMARY_WELL_HEADING, WB65, V2_SUMMARY_IMPROVE_HEADING, WB66]), on.sumM3.page);
  check('no model text cut: the spoken words of T89 are all there (A)', on.sumA.spoken.includes('良かったところは、お客様への説明がよく伝わったことです。') && on.sumA.spoken.includes('直すところは、期間と過去の時を表す言葉です。'), on.sumA.spoken);
  check('an intermediate learner: the headings with no Japanese line', headings(on.sumI).length === 2 && headings(on.sumI).every((h) => h.gloss === null), headings(on.sumI));

  console.log('other lessons');
  check('a typed language lesson: no as-said refusal (the rule is for spoken lessons)', !on.typed.calls.some((c) => c.outcome === V2_AS_SAID_REFUSED));
  check('a maths voice lesson: no 8c line, no refusal, no heading', !HAS_OWED.test(on.maths.check) && !on.maths.calls.some((c) => c.outcome === V2_AS_SAID_REFUSED || c.style === 'heading'));

  console.log('each switch off alone (a child process per switch): as at 57c71382 for that item');
  const child = (flag: string) => {
    // Task 8g: the ask is also read from the reply's question card (ASK_QUESTION_CARD); T44 carries one, so the live record of
    // ASK_LAST_QUESTION off is reproduced with that switch off too.
    const extra = flag === 'ASK_LAST_QUESTION' ? { NEXT_PUBLIC_TUTOR_V2_ASK_QUESTION_CARD: 'off' } : {};
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', ...extra, MIC10_8C_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Probe;
  };
  const others = (off: Probe, but: string) => [
    but === 'OWED_CARD_RIGHT' || (!painted(off.t32, WB26) && !HAS_OWED.test(off.t32.check)),
    but === 'CORRECTION_KEPT' || (off.pairs[0]?.card === WB25),
    but === 'SUMMARY_HEADINGS' || headings(off.sumB).length === 2,
    but === 'ASK_LAST_QUESTION' || off.t46.events.some((e) => /^v2_practice_signal wrong part=past-simple/.test(e)),
  ].every(Boolean);
  {
    const off = child('OWED_CARD_RIGHT');
    check('OWED_CARD_RIGHT off: the owed line sent at T32 with its "as they said it" branch, and WB26 painted (as live)', HAS_OWED.test(off.t32.check) && /their own sentence as they said it/.test(off.t32.check) && painted(off.t32, WB26) && /wrong word stressed/.test(off.owedLine) && others(off, 'OWED_CARD_RIGHT'), off.t32.calls);
    check('…with CORRECTION_KEPT on, the turn still counts as a correction (the pairing takes WB25 over the marked WB26)', off.t32.events.some((e) => /^v2_practice_signal wrong/.test(e)), off.t32.events);
  }
  {
    const off = child('CORRECTION_KEPT');
    check('CORRECTION_KEPT off: the pairing takes the first card of the sentence (WB26: clean), as live', off.pairs[0]?.card === WB26 && off.pairs[0]?.corrected === false && others(off, 'CORRECTION_KEPT'), off.pairs);
  }
  {
    const off = child('SUMMARY_HEADINGS');
    check('SUMMARY_HEADINGS off: no runtime heading on the Summary page (as live: notes then four unlabelled cards)', headings(off.sumA).length === 0 && headings(off.sumB).length === 0 && others(off, 'SUMMARY_HEADINGS'), off.sumB.page);
  }
  {
    const off = child('CORRECTION_STEMS');
    check('CORRECTION_STEMS off: WB29 is no correction of T35 (round 1): T35 owed, WB30 painted, the turn clean', HAS_OWED.test(off.t36.check) && painted(off.t36, WB30) && !off.t36.events.some((e) => /^v2_practice_signal wrong/.test(e)) && !off.t36.corrected.includes(WB29) && !off.t36s.corrected.includes(WB29) && others(off, 'CORRECTION_STEMS'), [off.t36.calls, off.t36.events, off.t36.corrected, off.t36s.corrected]);
  }
  {
    const off = child('ASK_LAST_QUESTION');
    check('ASK_LAST_QUESTION off: T45 is no practice answer (no signal, no owed line), as live', !off.t46.events.some((e) => /^v2_practice_signal/.test(e)) && !HAS_OWED.test(off.t46.check) && others(off, 'ASK_LAST_QUESTION'), off.t46.events);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
