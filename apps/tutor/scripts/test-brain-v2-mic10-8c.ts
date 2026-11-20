/// <reference types="node" />
/**
 * Tutor brain v2 — Task 8c: mic test 10 (embed-1795202398886): the board never shows the learner's wrong sentence after its correction,
 * a correction is kept (also one written as a note only), and the Summary page's headings come from the runtime. The session's plan
 * (gdi-work-projects-v1) and its real turns (task-8b-investigation.md). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic10-8c
 *
 *  1 OWED_CARD_RIGHT   T31 → T32 and T35 → T36 with the board check: no owed-card line once the corrected card is up (WB25 drops a
 *                      clause of T31, WB29 rewrites T35 with stems alike); the check's as-said card (WB26, WB30) not painted; the owed
 *                      line asks only for the right sentence; a right sentence of theirs is still carded as said
 *  2 CORRECTION_KEPT   T32 and T36 scored as a correction (practice signal wrong), recorded with marks, re-test recorded; the pairing
 *                      prefers the correction card over an as-said one; T45 → T46 (the correction only in note WB37) recorded and counted
 *  3 SUMMARY_HEADINGS  T89 (the summary reply, no heading notes): the headings written once each before their first card, corrections
 *                      under "To improve" with their marks, other cards under "What went well" (above "To improve" when it came
 *                      first), rule notes above, the Japanese line on each heading for a beginner, a model-written heading not doubled
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
import { V2_AS_SAID_REFUSED, v2CardCorrects, v2CardIsOf, v2NoteCorrectionOf, v2OwedCardCheckLine } from '../src/lib/tutor/v2/learner-card';
import { v2PracticePairs } from '../src/lib/tutor/v2/adaptive';
import { V2_SUMMARY_IMPROVE_HEADING, V2_SUMMARY_WELL_HEADING } from '../src/lib/tutor/v2/summary-headings';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC10_8C_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, JSON.stringify(detail ?? '', null, 1)?.slice(0, 3000)); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Reply = { text: string };
/** A scripted model: the replies in order (the last repeated); every user text of every call kept (the facts, the board check). */
function scripted(replies: Reply[]) {
  const asks: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (last?.role === 'user') for (const b of (Array.isArray(last.content) ? last.content : [{ type: 'text', text: last.content }]) as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text) asks.push(b.text);
    const r = replies[Math.min(i, replies.length - 1)]!; i += 1;
    onText?.(r.text);
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
    corrections: r.state.corrections ?? [], retests: r.state.retests ?? [], page: page ? page.items.map((it) => `${it.tool}: ${it.summary}`) : [], spoken: r.spoken };
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

// ── Past simple, T44 → T45 → T46 (the correction only in note WB37) ──
const T44 = '正しく言えました。 Let\'s keep going with that one.\n\nNow, have you been with your current company for a long time? Please answer in English.\n\n<board problem gloss="今の会社には長く勤めていますか？英語で答えてください。">Have you been with your current company for a long time?</board>';
const T45 = 'Yes, I am with uh the current company uh for a long time.';
const WB37 = 'We use "have been" for experience that continues now: I "have been" with the company for a long time.';
const T46 = '惜しいです。「I am」は今の状態を表すので、ここでは使いません。今まで続いている経験なので、「have」を使ってください。\n\n'
  + `<board note gloss="今まで続いている経験は「have been」で言います。">${WB37}</board>\n\nもう一度、「Yes, I ...」から言ってみてください。`;
const PS_PAGES: V2BoardPage[] = [...structuredClone(PP_PAGES), { title: 'Past simple', items: [card('wb32', 'I attended an exhibition last year.'), card('wb34', 'I attended a robotics exhibition in Tokyo two years ago.'), { id: 'wb36', tool: 'show_problem', summary: 'Question — Have you been with your current company for a long time?' }] }];
const PUT: V2Retest = { part: 'present-perfect', said: 'Yes, I worked at Nagoya uh 5 years ago.', right: 'I have worked at Nagoya Corporation for five years.', target: ['i have', 'corporation for five'], turn: 16, offered: 3, in: 'past-simple', askedAt: 3, lastAt: 5, put: 5, question: 'Have you worked for your current company for a long time?' };
const atT45 = () => base({ board: { pages: structuredClone(PS_PAGES), current: 4 }, goals: goalsThrough(4), partStart: { part: 'past-simple', at: 8.4 * MIN }, support: { step: 'normal', wrong: 0, clean: 0, part: 'past-simple' }, retests: [structuredClone(PUT)],
  history: [...ppHead, a('<board page>Past simple</board>\n過去形は、終わった出来事に使います。\n\n Did you attend any business events or exhibitions last year?'), u('Yes, I attend robotics exhibition Tokyo 2 year ago.'), a('「attended」にします。<board sentence stress="attended">I attended a robotics exhibition in Tokyo two years ago.</board>もう一度、この文を言ってみてください。'), u('I attended a robotics exhibition in Tokyo 2 years ago.'), a(T44)] });

// ── The Summary page, T89 (no heading notes) ──
const WB61 = 'We use "have worked" for experience that started in the past and continues now.';
const WB62 = 'We use the past simple, like "attended", for a finished event with a time word such as "last year".';
const WB63 = 'I worked on a project to collect donations for a climate change project.';
const WB64 = 'I have been with the company for a long time.';
const WB65 = 'I have worked at Nagoya Corporation for five years.';
const WB66 = 'I attended a robotics exhibition in Tokyo two years ago.';
const sc = (s: string, stress?: string, gloss?: string) => `<board sentence${stress ? ` stress="${stress}"` : ''}${gloss ? ` gloss="${gloss}"` : ''}>${s}</board>`;
const T89 = (headings: { well?: boolean } = {}) => '今日は、仕事の話をたくさん練習しましたね。文法は二つでした。\n\n'
  + `<board note gloss="今も続いている経験。">${WB61}</board>\n<board note gloss="終わった出来事。">${WB62}</board>\n\n良かったところは、お客様への説明がよく伝わったことです。\n\n`
  + `${headings.well ? '<board note style="heading" gloss="良かったところ">What went well</board>\n' : ''}${sc(WB63, 'donations | a', '気候変動プロジェクトのために寄付を集めました。')}\n${sc(WB64, '', '今の会社に長く勤めています。')}\n\n直すところは、期間と過去の時を表す言葉です。\n\n`
  + `${sc(WB65, 'have | corporation | for', 'Nagoya Corporation で五年間働いています。')}\n${sc(WB66, 'attended | two | years | ago', '二年前に東京で展示会に参加しました。')}\n\n`
  + 'では最後に、考えてみてください。Before we finish, can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago.\n\n<board problem gloss="二つの文の違いを説明してください。">Before we finish, can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago.</board>';
const SUM_PAGES: V2BoardPage[] = [...structuredClone(PS_PAGES), { title: 'Conversation', items: [] }, { title: 'Pronunciation', items: [] }, { title: 'Summary', items: [] }];
/** The lesson's corrections as recorded (said → card): T25, T41, T57, and with 8c T45 (the note). `only`: the ones kept. */
const RECORDS: Array<[string, string]> = [
  ['Yes, I worked at Nagoya uh 5 years ago.', WB65],
  ['Yes, I attend robotics exhibition Tokyo 2 year ago.', WB66],
  ['I worked on a project to um to uh uh to collect donation for climate change project.', WB63],
  [T45, WB64],
];
const atT88 = (only: readonly string[]) => {
  const s = base({ board: { pages: structuredClone(SUM_PAGES), current: 7 }, goals: goalsThrough(7), partStart: { part: 'summary', at: 19.7 * MIN },
    history: [...ppHead, a('Your score for that word was 100 out of 100, and the whole sentence came out at 94 out of 100. Well done. Would you like one more item, or shall we move on to the summary?')] });
  for (const [said, right] of RECORDS) if (only.includes(right)) v2NoteCorrection(lang, s, right, [], said);
  return s;
};

async function probe() {
  // 1 + 2: T31 → T32 and T35 → T36, the board check writing the as-said card.
  const t32 = await turn(lang, atT31(), T31, [{ text: T32 }, { text: CHECK_WB26 }, NONE], 6.6);
  const t36 = await turn(lang, atT35(), T35, [{ text: T36 }, { text: CHECK_WB30 }, NONE], 8.1);
  // A right sentence of theirs (T37 "I have learned how to negotiate with customers.") is carded as said.
  const t38 = await turn(lang, (() => { const s = atT35(); s.history.push(u(T35), a(T36)); s.board.pages[3]!.items.push(card('wb29', WB29)); return s; })(), 'I have learned how to negotiate with customers today at work.',
    [{ text: 'その文は正しいです。\n\n<board sentence>I have learned how to negotiate with customers today at work.</board>\n\nWhat else have you learned?' }, NONE], 8.3);
  // The owed line itself, for a sentence the reply carded nowhere.
  const owedLine = v2OwedCardCheckLine(lang, [WB26]);
  // 2: T45 → T46.
  const t46 = await turn(lang, atT45(), T45, [{ text: T46 }, NONE], 10.9);
  // …and with T44's question as its last sentence (an ask for a sentence by the 7g test): the answer is counted too.
  const t46b = await turn(lang, (() => { const s = atT45(); s.history[s.history.length - 1] = a(T44.replace(' Please answer in English.', '')); return s; })(), T45, [{ text: T46 }, NONE], 10.9);
  // 2: the pairing on the live T32 cards (WB26 painted before WB25 was read, as at HEAD).
  const pairs = v2PracticePairs(['I worked in sales 3 year before that work as receptionist.'], [{ sentence: WB26, stress: ['three', 'year'] }, { sentence: WB25, stress: ['for', 'three', 'years'] }]);
  // 3: T89, (A) the session's records (all four cards corrections), (B) only WB63 and WB64 recorded (the others right), (C) as B with
  // the model's own "What went well" heading before WB65.
  const all = [WB63, WB64, WB65, WB66];
  const sumA = await turn(lang, atT88(all), 'Uh, move on.', [{ text: T89() }, NONE], 19.75, false);
  const sumB = await turn(lang, atT88([WB63, WB64]), 'Uh, move on.', [{ text: T89() }, NONE], 19.75, false);
  const sumC = await turn(lang, atT88([WB63, WB64]), 'Uh, move on.', [{ text: T89({ well: true }) }, NONE], 19.75, false);
  // D: the runtime's "What went well" up first (WB65 before any heading), then the model writes its own: refused.
  const sumD = await turn(lang, atT88([WB63, WB64]), 'Uh, move on.', [{ text: `${sc(WB65)}\n<board note style="heading">What went well</board>\n${sc(WB66)}\nGood.` }, NONE], 19.75, false);
  // An intermediate learner: the headings with no Japanese line.
  const sumI = await turn(lang, { ...atT88([WB63, WB64]), workingLevel: { level: 'intermediate', from: 'this_lesson' } }, 'Uh, move on.', [{ text: T89() }, NONE], 19.75, false);
  // Other lessons.
  const typed = await turn(typedLang, atT31(), T31, [{ text: T32 }, { text: CHECK_WB26 }, NONE], 6.6);
  const mathsTurn = await turn(maths, { ...newV2State(0), history: [u('x'), a('What is 3 times 4?')] }, '12', [{ text: 'Yes, 12. <board equation>3 \\times 4 = 12</board> What is 6 × 7?' }, NONE], 18.1);
  return { t32, t36, t38, owedLine, t46, t46b, pairs, sumA, sumB, sumC, sumD, sumI, typed: { calls: typed.calls, page: typed.page, check: typed.check }, maths: { calls: mathsTurn.calls, page: mathsTurn.page, check: mathsTurn.check } };
}

type Probe = Awaited<ReturnType<typeof probe>>;
const sentenceCalls = (t: Probe['t32']) => t.calls.filter((c) => c.name === 'show_sentence');
const painted = (t: Probe['t32'], s: string) => t.calls.some((c) => c.name === 'show_sentence' && c.text === s && !/^not /.test(c.outcome));
const HAS_OWED = /put no card of (?:it|them) on the board/;

async function main() {
  const on = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }

  console.log('1  OWED_CARD_RIGHT: never their wrong sentence as a card');
  check('v2CardCorrects: WB25 corrects T31 (v2CardIsOf did not: it drops "before that work as receptionist"); WB29 corrects T35 (stems alike); their words as said do not', v2CardCorrects(WB25, T31) && !v2CardIsOf(WB25, T31) && v2CardCorrects(WB29, T35) && !v2CardCorrects(WB26, T31) && !v2CardCorrects(WB30, T35));
  check('T32: the corrected card WB25 painted inline; the board check ran with no owed-card line', painted(on.t32, WB25) && on.t32.check.length > 0 && !HAS_OWED.test(on.t32.check), on.t32.check.slice(-1500));
  check('…the check\'s WB26 (T31 as said) not painted, with the reason', sentenceCalls(on.t32).every((c) => c.text !== WB26) || on.t32.calls.some((c) => c.text === WB26 && c.outcome === V2_AS_SAID_REFUSED), on.t32.calls);
  check('…the page holds WB25 and not WB26', on.t32.page.includes(`show_sentence: ${WB25}`) && !on.t32.page.includes(`show_sentence: ${WB26}`), on.t32.page);
  check('T36: WB29 painted; no owed-card line; WB30 (T35 as said) not painted', painted(on.t36, WB29) && !HAS_OWED.test(on.t36.check) && !painted(on.t36, WB30) && !on.t36.page.includes(`show_sentence: ${WB30}`), [on.t36.calls, on.t36.check.slice(-800)]);
  check('the owed line asks only for the right sentence (no "as they said it … wrong word stressed"); never their mistake', /the corrected sentence with the changed words stressed/.test(on.owedLine) && /Never their sentence with its mistake in it/.test(on.owedLine) && !/wrong word stressed/.test(on.owedLine), on.owedLine);
  check('a right sentence of theirs is still carded as said (painted)', painted(on.t38, 'I have learned how to negotiate with customers today at work.'), on.t38.calls);

  console.log('2  CORRECTION_KEPT: a correction is kept');
  check('T32 scored as a correction: practice signal wrong, the correction recorded with its marks (for, three, years), a re-test recorded', on.t32.events.some((e) => /^v2_practice_signal wrong part=present-perfect/.test(e)) && on.t32.corrections.some((c) => c.sentence === WB25 && c.stress.includes('for') && c.stress.some((w) => /^years?$/.test(w))) && on.t32.events.some((e) => /^v2_retest_recorded /.test(e)), [on.t32.events, on.t32.corrections]);
  check('T36 scored as a correction (WB29, stems alike): signal wrong, recorded with marks, re-test recorded', on.t36.events.some((e) => /^v2_practice_signal wrong part=present-perfect/.test(e)) && on.t36.corrections.some((c) => c.sentence === WB29 && c.stress.length > 0) && on.t36.retests.some((r) => r.right === WB29), [on.t36.events, on.t36.corrections, on.t36.retests]);
  check('the pairing prefers the correction card (WB25) over the as-said one (WB26) when both are up', on.pairs.length === 1 && on.pairs[0]!.card === WB25 && on.pairs[0]!.corrected, on.pairs);
  check('v2NoteCorrectionOf: WB37 holds "I have been with the company for a long time." for T45', v2NoteCorrectionOf(WB37, T45) === WB64 && v2NoteCorrectionOf('We use "for" with a length of time.', T45) === null);
  check('T46 (the correction only in note WB37, no card): recorded (said → WB64, with marks)', on.t46.corrections.some((c) => c.sentence === WB64 && /I am with/.test(c.said) && c.stress.length > 0), [on.t46.events, on.t46.corrections]);
  check('…T44 as stored ends on "Please answer in English." (no ask for a sentence by the 7g test, as live: no practice signal at T46), so the answer is not counted', !on.t46.events.some((e) => /^v2_practice_signal/.test(e)), on.t46.events);
  check('…with T44 ending on its question, the answer is counted (signal wrong) and the retest put at T44 is scored missed', on.t46b.events.some((e) => /^v2_practice_signal wrong part=past-simple/.test(e)) && on.t46b.events.some((e) => /^v2_retest_outcome target="i have", "corporation for five" outcome=missed/.test(e)), on.t46b.events);

  console.log('3  SUMMARY_HEADINGS: the Summary page\'s headings by the runtime');
  const headings = (t: Probe['sumA']) => t.calls.filter((c) => c.name === 'annotate' && c.style === 'heading' && !/^not /.test(c.outcome));
  const idx = (t: Probe['sumA'], s: string) => t.page.findIndex((x) => x.endsWith(s));
  // A: every card a recorded correction.
  check('A (the session\'s records: all four cards corrections): one "To improve" heading, written before WB63; no "What went well"', headings(on.sumA).length === 1 && headings(on.sumA)[0]!.text === V2_SUMMARY_IMPROVE_HEADING && idx(on.sumA, V2_SUMMARY_IMPROVE_HEADING) === idx(on.sumA, WB63) - 1, on.sumA.page);
  check('A: rule notes above the heading; all four cards painted under it, each with its record\'s marks (WB64 had none)', idx(on.sumA, WB61) < idx(on.sumA, V2_SUMMARY_IMPROVE_HEADING) && idx(on.sumA, WB62) < idx(on.sumA, V2_SUMMARY_IMPROVE_HEADING) && [WB63, WB64, WB65, WB66].every((s) => painted(on.sumA, s) && idx(on.sumA, s) > idx(on.sumA, V2_SUMMARY_IMPROVE_HEADING))
    && Array.isArray(on.sumA.calls.find((c) => c.text === WB64)?.emphasis) && (on.sumA.calls.find((c) => c.text === WB64)!.emphasis as string[]).length > 0, [on.sumA.page, on.sumA.calls]);
  check('A: the heading carries the Japanese line for a beginner', headings(on.sumA)[0]?.gloss === 'これから直すところ', headings(on.sumA));
  // B: WB63, WB64 corrections, WB65, WB66 right.
  check('B (WB63, WB64 corrections; WB65, WB66 not): each heading written once', headings(on.sumB).map((h) => h.text).sort().join('|') === [V2_SUMMARY_IMPROVE_HEADING, V2_SUMMARY_WELL_HEADING].sort().join('|'), headings(on.sumB));
  check('B: page order: notes, "What went well", WB65, WB66, "To improve", WB63, WB64, the question card last', (() => { const order = [WB61, WB62, V2_SUMMARY_WELL_HEADING, WB65, WB66, V2_SUMMARY_IMPROVE_HEADING, WB63, WB64].map((s) => idx(on.sumB, s)); return order.every((x, i) => x >= 0 && (i === 0 || x > order[i - 1]!)); })() && /^show_problem/.test(on.sumB.page[on.sumB.page.length - 1] ?? ''), on.sumB.page);
  check('B: the cards placed above "To improve" say so to the board (before = the heading); the corrections carry their marks', on.sumB.calls.filter((c) => c.text === WB65 || c.text === WB66 || c.text === V2_SUMMARY_WELL_HEADING).every((c) => c.before === on.sumB.calls.find((h) => h.text === V2_SUMMARY_IMPROVE_HEADING)?.id)
    && (on.sumB.calls.find((c) => c.text === WB64)?.emphasis as string[] | null ?? []).length > 0, on.sumB.calls);
  check('C (the model wrote "What went well" itself before WB63, as the 7u line asks): not doubled; WB63 (a correction) goes under the runtime\'s "To improve", WB65/WB66 above it, under the model\'s heading', headings(on.sumC).filter((h) => h.text === V2_SUMMARY_WELL_HEADING).length === 1 && headings(on.sumC).filter((h) => h.text === V2_SUMMARY_IMPROVE_HEADING).length === 1
    && (() => { const order = [V2_SUMMARY_WELL_HEADING, WB65, WB66, V2_SUMMARY_IMPROVE_HEADING, WB63, WB64].map((x) => idx(on.sumC, x)); return order.every((x, i) => x >= 0 && (i === 0 || x > order[i - 1]!)); })(), [on.sumC.page, headings(on.sumC)]);
  check('C: a second "What went well" heading the model writes after the runtime\'s is not painted (the group\'s heading is up)', on.sumD.calls.filter((c) => c.style === 'heading' && c.text === V2_SUMMARY_WELL_HEADING && /^not painted: the "What went well" heading is on the summary page already/.test(c.outcome)).length === 1 && headings(on.sumD).filter((h) => h.text === V2_SUMMARY_WELL_HEADING).length === 1, on.sumD.calls);
  check('no model text cut: the spoken words of T89 are all there (A)', on.sumA.spoken.includes('良かったところは、お客様への説明がよく伝わったことです。') && on.sumA.spoken.includes('直すところは、期間と過去の時を表す言葉です。'), on.sumA.spoken);
  check('an intermediate learner: the headings with no Japanese line', headings(on.sumI).length === 2 && headings(on.sumI).every((h) => h.gloss === null), headings(on.sumI));

  console.log('other lessons');
  check('a typed language lesson: no runtime heading, the as-said card painted as at HEAD (the rule is for spoken lessons)', !on.typed.calls.some((c) => c.outcome === V2_AS_SAID_REFUSED));
  check('a maths voice lesson: no 8c line, no refusal, no heading', !HAS_OWED.test(on.maths.check) && !on.maths.calls.some((c) => c.outcome === V2_AS_SAID_REFUSED || c.style === 'heading'));

  console.log('each switch off alone (a child process per switch): as at 57c71382 for that item');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC10_8C_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Probe;
  };
  const others = (off: Probe, but: string) => [
    but === 'OWED_CARD_RIGHT' || (!painted(off.t32, WB26) && !HAS_OWED.test(off.t32.check)),
    but === 'CORRECTION_KEPT' || off.t46.corrections.some((c) => c.sentence === WB64),
    but === 'SUMMARY_HEADINGS' || headings(off.sumB).length === 2,
  ].every(Boolean);
  {
    const off = child('OWED_CARD_RIGHT');
    check('OWED_CARD_RIGHT off: the owed line sent at T32 with its "as they said it" branch, and WB26 painted (as live); T36 likewise WB30', HAS_OWED.test(off.t32.check) && /their own sentence as they said it/.test(off.t32.check) && painted(off.t32, WB26) && painted(off.t36, WB30) && /wrong word stressed/.test(off.owedLine) && others(off, 'OWED_CARD_RIGHT'), [off.t32.calls, off.t36.calls]);
    check('…with CORRECTION_KEPT on, the turn still counts as a correction (the pairing takes WB25 over WB26)', off.t32.events.some((e) => /^v2_practice_signal wrong/.test(e)), off.t32.events);
  }
  {
    const off = child('CORRECTION_KEPT');
    check('CORRECTION_KEPT off: T46\'s note-only correction not recorded and no signal; T36 not recorded as a correction (WB29 is no v2IsCorrectionOf); the pairing takes WB26 (clean)', !off.t46.corrections.some((c) => c.sentence === WB64) && !off.t46.events.some((e) => /^v2_practice_signal wrong/.test(e)) && !off.t36.corrections.some((c) => c.sentence === WB29) && off.pairs[0]?.card === WB26 && off.pairs[0]?.corrected === false && others(off, 'CORRECTION_KEPT'), [off.t46.events, off.t36.corrections, off.pairs]);
  }
  {
    const off = child('SUMMARY_HEADINGS');
    check('SUMMARY_HEADINGS off: no runtime heading on the Summary page (as live: notes then four unlabelled cards)', headings(off.sumA).length === 0 && headings(off.sumB).length === 0 && others(off, 'SUMMARY_HEADINGS'), off.sumB.page);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
