/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7r: mic test 5 (embed-1795050656326): a Japanese ask is an ask (no false 2 s silence turn), a silence after
 * an ask never answers it, Japanese part asks are read by clause, and naming the part asked is a go. The session's plan
 * (gdi-work-projects-v1) and its real reply texts (the session record's transcript, quoted in task-7r-investigation.md A and C).
 * No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic5-7r
 *
 *  1 ASK_ONE_TEST       the 9 replies followed by a 2 s silence turn are asks (client and server, one test); 7m's cases kept;
 *                       English statements and a maths voice reply unchanged
 *  2 SILENCE_AFTER_ASK  a long silence after an ask: encouragement or a smaller hint, never the answer, no new question
 *  3 PART_ASK_CLAUSES   the session's 8 Japanese part asks are part asks (#66 is a practice choice, not one); 7n's cases kept
 *  4 PART_GO_NAMED      "pronunciation.", "Uh, wrap up.", "Uh, summary.", まとめ… are go answers; the page opens, no English ask after a go
 *  each switch off alone (a child process per switch): the behaviour at 7ce31282 for that item.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_ASK_ONE_TEST, TUTOR_V2_PART_ASK_CLAUSES, TUTOR_V2_PART_GO_NAMED, TUTOR_V2_SILENCE_AFTER_ASK } from '../src/lib/tutor/orchestrator/flags';
import { asksAnywhere } from '../src/lib/tutor/v2/board-timing';
import { v2AsksInJapanese, v2AsksTheLearner, v2ReplyAsks, v2ReplySentences } from '../src/lib/tutor/v2/one-question';
import { v2LastReplyAsked, v2LastReplyAskedGuarded } from '../src/lib/tutor/v2/facts';
import { SentenceStream } from '../src/lib/tutor/v2/sentences';
import { v2SpeechParts } from '../src/lib/tutor/v2/languages';
import { v2AskedParts, v2EndingPartAsk, v2GoForPart, v2MoveAnswer, v2PendingPart } from '../src/lib/tutor/v2/part-flow';
import { v2InvitesToSpeak } from '../src/lib/tutor/v2/language-pack';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC5_7R_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
function scripted(texts: string[]) {
  const facts: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
    const t = texts[Math.min(i, texts.length - 1)]!; i += 1;
    onText?.(t);
    return msg([{ type: 'text', text: t }], 'end_turn');
  };
  return { call, facts };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const LANGS = ['en', 'ja'];
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: LANGS, levelCheck: true, plan: GDI };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
const TODAY: V2BoardPage = { title: '概要', items: [{ id: 't1', tool: 'annotate', summary: 'present perfect / past simple' }] };
const JOB: V2BoardPage = { title: '仕事について', items: [card('j1', 'I sell televisions to customers.')] };
const PP: V2BoardPage = { title: '現在完了', items: [card('p1', 'I have found it difficult to collect donations.')] };
const PS: V2BoardPage = { title: '過去形', items: [card('s1', 'I enjoyed the exhibition a lot.')] };
const CONV: V2BoardPage = { title: '会話', items: [card('c1', 'The project went very well.')] };
const PRON: V2BoardPage = { title: '発音 (pronunciation)', items: [] };
const goalsAt = { overview: { status: 'shown' as const, at: 0 }, 'level-check': { status: 'demonstrated' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 } };
const base = (pages: V2BoardPage[], extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone(pages), current: pages.length - 1 }, goals: goalsAt, timeFit: { dropped: [], byArrival: true }, practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 3, 'open-conversation': 3 }, ...extra });

// ── The session's replies (transcript index), word for word ──
const T0 = 'こんにちは、Kenさん。Taroです。前回のAcme Corporationのお話の続きで、今日は仕事や最近のプロジェクトについて英語で話します。文法は「present perfect」と「past simple」の二つを練習します。前回は初級のレベルで進めましたが、今日もそのままでよろしいでしょうか。';
const T7 = 'いいですね。"at Acme Corporation"（アクメ・コーポレーションで）と会社の名前の前に"at"を使えています。\n\n次は、お客様についての文をもう一つ言ってみてください。例えば「I sell washing machines.」のように、何を売っているかを言ってみましょう。';
const T12 = 'テレビを売っている、というのは良い説明です。一つだけ直すと、"to customers" と複数形にします。\n\n仕事について話す練習はここまでです。次は「present perfect」に進みます。質問がありますか、それとも続けますか。';
const T13 = '次は「present perfect」に進みましょうか。それとも、先に何か質問がありますか。';
const T27 = 'その文は正しいです。ずっと続いている大変さを「I have found」で言えています。\n\n現在完了はここまでにします。次は past simple（過去形）です。質問がありますか。それとも、そのまま進みましょうか。';
const T28 = 'Next is past simple. 過去形の練習に進んでよろしいでしょうか。それとも、先に質問がありますか。';
const T42 = 'その文は正しいです。去年の展示会なので、過去形の"enjoyed"を使えています。\n\n過去形の練習はここまでです。次は会話の練習です。質問がありますか、それとも進みましょうか。';
const T43 = '過去形の練習は、ここまでです。次は会話の練習です。質問がありますか、それとも会話に進みましょうか。';
const T45 = 'では、会話の練習に進みましょう。今まで話した仕事のことを使って、話してみてください。';
const T63 = 'その文は正しいです。プロジェクトが、とてもうまくいったんですね。\n\n次は発音の練習です。やりますか、それとも先にまとめに進みますか。';
const T66 = '発音の練習ですね。では、一つずつ言ってみましょうか、それとも文全体を言ってみますか。';
const T69 = 'わかりました、一語ずつ練習しましょう。最初の単語は responsibilities です。私の後に繰り返してください。';
const T80 = '発音は96点でした。international は98点で、とてもよくできています。\n\n時間が少し残っています。最後にまとめに進みましょうか。それとも、もう一語練習しますか。';
const T82_EN = 'Next is summary. Shall we go on, or do you have a question first?';
const T84 = '今日はよく頑張りました。仕事の内容、責任、そしてプロジェクトについて話せました。よくできたのは、「I have worked at Acme Corporation for five years.」と言えたことです。五年前から今も続いている経験なので、have worked を正しく使えています。\n\n直すところは一つです。「I work at Acme Corporation for five years.」は、今の動作になるので、「have worked」にします。\nでは、確認の質問です。日本語で説明できますか。二つの文の違いを教えてください。\n We didn\'t get to the pronunciation part today, so that\'s for next time.';
// The replies a 2 s silence turn followed (investigation A), and #76 (繰り返して, then the runtime check-in).
const SILENCE_BEFORE: Array<[string, string]> = [['#0', T0], ['#7', T7], ['#12', T12], ['#27', T27], ['#42', T42], ['#63', T63], ['#66', T66], ['#69', T69], ['#84', T84]];
const T76 = '「international」です。私の後に繰り返してください。 international';
// Task 7m's pinned asks (test-brain-v2-mic4-7m.ts): kept.
const M7_D = 'Yes, "I have worked" is right. One small thing: we say "at Acme Corporation" and "for six years."\n\nNow, another sentence about you, with "I have…" Try starting with "I have worked with…" or "I have sold…".';
const M7_E = 'わかりました。もう一問、過去形の練習をしましょう。まず、一文で答えてみてください。Try starting with: "I visited…" or "I met…"';
// Statements: no ask, before or after.
const STATEMENTS = ['Good. Let\'s start with the past simple.', 'The derivative of x squared is 2x. So the slope at x = 3 is 6.', 'わかりました、一語ずつ練習しましょう。', 'では、例を見てみましょう。現在完了は have と過去分詞です。', 'Good. Let\'s try starting with the chain rule.'];
// ── Fix round 1: the review's failing inputs ──
// C1: check-ins and practice questions that name a part (not forward) are no part asks.
const C1_NOT_PART: Array<[string, string, V2BoardPage[]]> = [
  ['contrast line in Present perfect', '過去形とは違って、今も続いていることを表します。何か質問はありますか。', [TODAY, JOB, PP]],
  ['a later use named in Present perfect', 'この表現は、あとの会話の練習でも使います。何か質問はありますか。', [TODAY, JOB, PP]],
  ['the overview naming the optional part', '最後に、希望があれば発音の練習もします。何か質問はありますか。', [TODAY]],
  ['continue the role-play in Past simple', 'この会話、もう少し続けますか。', [TODAY, JOB, PP, PS]],
];
// I1: a content answer, a no-name ask with a part named before it, a choice offer.
const I1_EN = 'Next we\'ll do conversation, but first: did you enjoy the exhibition?';
const I1_JA = '会話の練習で使える表現です。次の問題に進みましょうか？';
const I1_OFFER = 'Before the summary, there is still pronunciation. Would you like to do it now, or go straight to the summary?';
// I2: offers, homework and taught phrases are no ask.
const I2_NOT_ASK = ['わからない単語があれば、いつでも教えてください。', '次回までに、この文を三回書いてみてください。', '"Please tell me" は「教えてください」です。', '一緒に考えてみましょう。'];
const I2_QUOTED_Q = '"Could you tell me…?" は「教えてもらえますか」という意味です。';
// ── Fix round 2: the re-review's failing inputs ──
// N1: か-questions holding a time or condition word stay asks.
const N1_ASKS = ['今までに、海外出張をしたことがありますか。', '同時に二つのプロジェクトを担当したことはありますか。', '仕事で英語を使うときは、どんな場面が多いですか。', '今度の会議では、何について話しますか。', 'プロジェクトが終わったら、何をしますか。'];
// N2: "before moving to X, continue Y?" keeps the part in hand.
const N2_NOT_PART: Array<[string, V2BoardPage[]]> = [['発音の練習に進む前に、もう少し会話を続けますか。', [TODAY, JOB, PP, PS, CONV]], ['まとめに入る前に、もう一度最初から始めましょうか。', [TODAY, JOB, PP, PS, CONV]]];
// N3: a 次に lead with a questions-or-go choice; an optional part offered in the model's words.
const N3_ASK = '次に、会話の練習をします。質問がありますか、それとも進みましょうか。';
const N3_OFFER = '発音の練習もできます。やりますか、それとも、まとめに進みますか。';
// n4: a 次は lead about content, not a part.
const N4_NOT_PART = '次は過去形と比べてみましょう。何か質問はありますか。';
// n5: a quoted question the learner is asked to put.
const N5_ASK = '"How long have you worked there?" と聞いてみてください。';
const MATHS_ASK = 'Nice work on the product rule. Now differentiate x cubed times sine x. What do you get?';

/** The client's decision at HEAD (TutorVoiceV2: asksAnywhere on the voice parts) and with the switch (or the one test on the
 *  reply's whole sentences). */
function clientAsks(text: string, one: boolean): boolean {
  const plain = text.replace(/<board[\s\S]*?<\/board>/g, ' ');
  const cut = new SentenceStream(); const sentences = [...cut.push(plain), ...cut.flush()];
  const parts = sentences.flatMap((s) => v2SpeechParts(s, LANGS));
  return asksAnywhere(parts) || (one && v2AsksTheLearner(sentences.join(' ')));
}

async function probe() {
  const one = TUTOR_V2_ASK_ONE_TEST;
  const item1 = {
    silence: SILENCE_BEFORE.map(([k, t]) => ({ k, client: clientAsks(t, one), server: v2LastReplyAsked([u('x'), a(t)]), was: asksAnywhere([...new SentenceStream().push(t)]) })),
    t76: clientAsks(T76, one),
    m7: [M7_D, M7_E].map((t) => clientAsks(t, one) && v2LastReplyAsked([u('x'), a(t)])),
    statements: STATEMENTS.map((t) => ({ t, client: clientAsks(t, one), server: v2LastReplyAsked([u('x'), a(t)]) })),
    mathsAsk: clientAsks(MATHS_ASK, one),
  };
  // 2: the long silence after the summary question (#84), and after the part ask #42 (no answer, no new question).
  const sil = async (history: V2State['history'], pages: V2BoardPage[], seconds: number, at: number) => {
    const m = scripted(['ゆっくりで大丈夫です。']);
    await runV2Turn({ session: lang, state: base(pages, { history }), studentSaid: null, callModel: m.call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: at * MIN, facts: { silenceSeconds: seconds } });
    return m.facts.join('\n');
  };
  const f84 = await sil([u('Uh, summary.'), a(T84)], [TODAY, JOB, PP, PS, CONV, PRON, { title: 'まとめ', items: [] }], 12, 18.9);
  const f42 = await sil([u('I enjoyed the exhibition a lot.'), a(T42)], [TODAY, JOB, PP, PS], 12, 10.9);
  const f2s = await sil([u('I enjoyed the exhibition a lot.'), a(T42)], [TODAY, JOB, PP, PS], 2, 10.9);
  const fStatement = await sil([u('I enjoyed the exhibition a lot.'), a('その文は正しいです。去年の展示会なので、過去形の"enjoyed"を使えています。')], [TODAY, JOB, PP, PS], 12, 10.9);

  // 3: the session's Japanese part asks, each on the board it was said over.
  const at = (pages: V2BoardPage[], reply: string) => base(pages, { history: [u('x'), a(reply)] });
  const asks: Array<[string, string, V2BoardPage[], string | null]> = [
    ['#12', T12, [TODAY, JOB], 'Present perfect'], ['#13', T13, [TODAY, JOB], 'Present perfect'],
    ['#27', T27, [TODAY, JOB, PP], 'Past simple'], ['#28', T28, [TODAY, JOB, PP], 'Past simple'],
    ['#42', T42, [TODAY, JOB, PP, PS], 'Conversation'], ['#43', T43, [TODAY, JOB, PP, PS], 'Conversation'],
    ['#63', T63, [TODAY, JOB, PP, PS, CONV], null], ['#80', T80, [TODAY, JOB, PP, PS, CONV, PRON], null],
  ];
  const item3 = asks.map(([k, t, pages, want]) => ({ k, want, ending: !!v2EndingPartAsk(t, GDI, LANGS), parts: v2AskedParts(t, GDI, LANGS).map((i) => GDI.segments[i]!.id), pending: v2PendingPart(GDI, at(pages, t), t, 'Yes.', undefined, LANGS)?.title ?? null }));
  const t66 = { ending: !!v2EndingPartAsk(T66, GDI, LANGS), pending: v2PendingPart(GDI, at([TODAY, JOB, PP, PS, CONV, PRON], T66), T66, 'Uh, word by word.', undefined, LANGS)?.title ?? null };
  const n7 = {
    morning: v2PendingPart(GDI, at([TODAY, JOB], 'That\'s right, and it\'s clear. 「仕事について」はここまでです。次は Present perfect です。何か質問がありますか？それとも、このまま進みますか？'), 'That\'s right, and it\'s clear. 「仕事について」はここまでです。次は Present perfect です。何か質問がありますか？それとも、このまま進みますか？', 'Uh, move on.', undefined, LANGS)?.title ?? null,
    morning2: v2PendingPart(GDI, at([TODAY, JOB, PP], 'ご質問への答えは以上です。次は Past simple に進みますが、よろしいですか？'), 'ご質問への答えは以上です。次は Past simple に進みますが、よろしいですか？', 'Uh, yes.', undefined, LANGS)?.title ?? null,
    notPart: ['次の問題に進みましょうか？', '次の文に行きましょうか？', 'では、行きましょうか。', 'いいですね。このまま進みますか？', 'That\'s nice. 仕事は順調に進みますか？', '現在完了で答えてください。仕事は順調に進みますか？', '現在完了の文を、もう一つ続けてみますか。'].map((x) => ({ x, ending: !!v2EndingPartAsk(`いいですね。${x}`, GDI, LANGS), pending: v2PendingPart(GDI, at([TODAY, JOB, PP], `いいですね。${x}`), `いいですね。${x}`, 'はい', undefined, LANGS)?.title ?? null })),
    english: v2EndingPartAsk(T42, GDI, ['en']) === null,
  };

  // 4: go answers.
  const go = {
    pron63: v2MoveAnswer('pronunciation.', T63, LANGS, undefined, GDI),
    pron63Pending: v2PendingPart(GDI, at([TODAY, JOB, PP, PS, CONV], T63), T63, 'pronunciation.', undefined, LANGS)?.title ?? null,
    wrap80: v2MoveAnswer('Uh, wrap up.', T80, LANGS, undefined, GDI),
    wraps: ['wrap up', 'let\'s wrap up', 'summary', 'Uh, summary.', 'まとめ', 'まとめましょう', '次へ', '進みましょう'].map((x) => ({ x, to80: v2MoveAnswer(x, T80, LANGS, undefined, GDI), toEn: v2MoveAnswer(x, T82_EN, LANGS, undefined, GDI) })),
    letsGo43: v2MoveAnswer('Uh, no, let\'s go.', T43, LANGS, undefined, GDI),
    summaryTo42: v2MoveAnswer('summary', T42, LANGS, undefined, GDI),
    skipTo42: v2MoveAnswer('Let\'s skip to the summary.', T42, LANGS, undefined, GDI),
    wrapNoAsk: v2MoveAnswer('wrap up', 'その文は正しいです。', LANGS, undefined, GDI),
  };
  // 4: the 11.4 min turn: #43, "Uh, no, let's go.", and the model's #45 with its own page.
  const heard43: string[] = [];
  const beforeConv = { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 3 };
  const t43 = await runV2Turn({ session: lang, state: base([TODAY, JOB, PP, PS], { practiceSaid: beforeConv, history: [u('I enjoyed the exhibition a lot.'), a(T42), a(T43)] }), studentSaid: 'Uh, no, let\'s go.', callModel: scripted([`<board page>会話</board>${T45}`]).call, onText: (d) => heard43.push(d), boardPass: false, mathsCheck: false, nowMs: 11.4 * MIN });
  // The unreadable ask (fallback): the same reply in words the clause reading does not know, naming 会話.
  const ODD = '過去形の練習は、ここまでです。会話の練習はどうでしょうか。';
  const heardOdd: string[] = [];
  const tOdd = await runV2Turn({ session: lang, state: base([TODAY, JOB, PP, PS], { practiceSaid: beforeConv, history: [u('I enjoyed the exhibition a lot.'), a(ODD)] }), studentSaid: 'Yes, let\'s go.', callModel: scripted([`<board page>会話</board>${T45}`]).call, onText: (d) => heardOdd.push(d), boardPass: false, mathsCheck: false, nowMs: 11.4 * MIN });
  // The 18 min turn (lesson clock ≈14.5 min: 224 s of flag time paused it): #80, "Uh, wrap up.", and the model's summary page.
  const heard80: string[] = [];
  const t80 = await runV2Turn({ session: lang, state: base([TODAY, JOB, PP, PS, CONV, PRON], { history: [u('International.'), a(T80)] }), studentSaid: 'Uh, wrap up.', callModel: scripted(['<board page>まとめ</board>まとめに入ります。今日は仕事の話を、現在完了と過去形を使って話せました。']).call, onText: (d) => heard80.push(d), boardPass: false, mathsCheck: false, nowMs: 14.5 * MIN });
  const pageTitles = (s: V2State) => s.board.pages.map((p) => p.title);
  // Fix round 1 (C1): pure, the reply's own hold (7e ownAsk), and the answer that would open the held part.
  const c1 = [];
  for (const [k, t, pages] of C1_NOT_PART) {
    const st = base(pages, { practiceSaid: { 'topic-intro': 3, 'present-perfect': 1 }, history: [u('x'), a(t)] });
    const asking = await runV2Turn({ session: lang, state: base(pages, { practiceSaid: { 'topic-intro': 3, 'present-perfect': 1 }, history: [u('x'), a('y')] }), studentSaid: 'I have worked here for six years.', callModel: scripted([t]).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 9 * MIN });
    const answered = await runV2Turn({ session: lang, state: asking.state, studentSaid: 'いいえ、大丈夫です。', callModel: scripted(['では、もう一文作ってみましょう。']).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 9.5 * MIN });
    c1.push({ k, ending: !!v2EndingPartAsk(t, GDI, LANGS), pending: v2PendingPart(GDI, st, t, 'はい', undefined, LANGS)?.title ?? null, held: asking.state.heldPage?.title ?? null, pagesAfter: pageTitles(answered.state).length - pages.length });
  }
  // Fix round 1 (I1): the model turns to the Conversation page after a content answer / a 「はい」 to a no-name ask.
  const i1 = [];
  for (const [k, reply, said] of [['en content answer', I1_EN, 'Yes, I enjoyed it.'], ['ja no-name ask', I1_JA, 'はい']] as const) {
    const heard: string[] = [];
    const t = await runV2Turn({ session: lang, state: base([TODAY, JOB, PP, PS], { practiceSaid: beforeConv, history: [u('I enjoyed the exhibition a lot.'), a(reply)] }), studentSaid: said, callModel: scripted([`<board page>会話</board>${T45}`]).call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: 11.4 * MIN });
    i1.push({ k, go: v2GoForPart(said, reply, GDI, base([TODAY, JOB, PP, PS], { practiceSaid: beforeConv }), 5, LANGS), opened: pageTitles(t.state).some((p) => /会話|Conversation/.test(p)) });
  }
  const offerSt = base([TODAY, JOB, PP, PS, CONV], { practiceSaid: { ...beforeConv, 'open-conversation': 3 } });
  const i1Offer = { summary: v2GoForPart('Yes.', I1_OFFER, GDI, offerSt, GDI.segments.length - 1, LANGS), pron: v2GoForPart('Yes.', I1_OFFER, GDI, offerSt, 6, LANGS) };
  // Fix round 1 (I2) and the maths long silence (m6).
  const i2 = { notAsk: I2_NOT_ASK.map((t) => ({ t, asks: v2AsksTheLearner(`いいですね。${t}`), server: v2LastReplyAskedGuarded([u('x'), a(`いいですね。${t}`)]) })), quotedInvite: v2InvitesToSpeak(I2_QUOTED_Q), quotedAsks: v2AsksTheLearner(I2_QUOTED_Q), stillAsks: ['ゆっくりどうぞ。', '私の後に繰り返してください。', 'では、言ってみましょう。'].map((t) => v2AsksTheLearner(t)) };
  const maths: V2Session = { studentName: 'Sam', subject: 'Calculus', level: 'AP', mode: 'voice' };
  const mf = scripted(['Take your time.']);
  await runV2Turn({ session: maths, state: { ...newV2State(0), history: [u('ok'), a(MATHS_ASK)] }, studentSaid: null, callModel: mf.call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 5 * MIN, facts: { silenceSeconds: 12 } });
  const mathsSilence = mf.facts.join('\n');
  const m1 = { conversationQ: v2MoveAnswer('Conversation?', T42, LANGS, undefined, GDI) };
  // Fix round 2.
  const sessionQs = [T0, T12, T13, T27, T28, T42, T43, T63, T66, T80, T84].flatMap((t) => v2ReplySentences(t).filter(v2AsksInJapanese));
  const n1 = { asks: N1_ASKS.map((t) => ({ t, one: v2AsksTheLearner(`いいですね。${t}`), guarded: v2LastReplyAskedGuarded([u('x'), a(`いいですね。${t}`)]), server: v2LastReplyAsked([u('x'), a(`いいですね。${t}`)]) })), sessionQs: sessionQs.map((t) => ({ t, one: v2AsksTheLearner(t) })) };
  const n2 = [];
  for (const [t, pages] of N2_NOT_PART) {
    const ps = { ...beforeConv, 'open-conversation': 1 };
    const asking = await runV2Turn({ session: lang, state: base(pages, { practiceSaid: ps, history: [u('x'), a('y')] }), studentSaid: 'The project went very well.', callModel: scripted([t]).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 13 * MIN });
    const answered = await runV2Turn({ session: lang, state: asking.state, studentSaid: 'はい、続けましょう。', callModel: scripted(['では、もう一つ質問します。']).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 13.5 * MIN });
    n2.push({ t, ending: !!v2EndingPartAsk(t, GDI, LANGS), held: asking.state.heldPage?.title ?? null, pagesAfter: answered.state.board.pages.length - pages.length });
  }
  const n3 = [];
  for (const said of ['Yes, let\'s go.', 'はい、お願いします。']) {
    const heard: string[] = [];
    const t = await runV2Turn({ session: lang, state: base([TODAY, JOB, PP, PS], { practiceSaid: beforeConv, history: [u('I enjoyed the exhibition a lot.'), a(N3_ASK)] }), studentSaid: said, callModel: scripted([`<board page>会話</board>${T45}`]).call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: 11.4 * MIN });
    n3.push({ said, ending: !!v2EndingPartAsk(N3_ASK, GDI, LANGS), pages: pageTitles(t.state), held: t.state.heldPage?.title ?? null, heard: heard.join('') });
  }
  const offerAt = base([TODAY, JOB, PP, PS, CONV], { practiceSaid: { ...beforeConv, 'open-conversation': 3 }, history: [u('x'), a(N3_OFFER)] });
  const heardOffer: string[] = [];
  const tOffer = await runV2Turn({ session: lang, state: offerAt, studentSaid: '発音をお願いします。', callModel: scripted(['<board page>発音</board>では、発音の練習をしましょう。']).call, onText: (d) => heardOffer.push(d), boardPass: false, mathsCheck: false, nowMs: 15 * MIN });
  const n3Offer = { move: v2MoveAnswer('発音をお願いします。', N3_OFFER, LANGS, undefined, GDI), pending: v2PendingPart(GDI, base([TODAY, JOB, PP, PS, CONV], { practiceSaid: { ...beforeConv, 'open-conversation': 3 }, history: [u('x'), a(N3_OFFER)] }), N3_OFFER, '発音をお願いします。', undefined, LANGS)?.title ?? null, pages: pageTitles(tOffer.state), held: tOffer.state.heldPage?.title ?? null, heard: heardOffer.join(''), politeNo: v2MoveAnswer('大丈夫です。', N3_OFFER, LANGS, undefined, GDI), okToQuestions: v2MoveAnswer('大丈夫です。', T42, LANGS, undefined, GDI) };
  // State before wording: a page owed its ask, the model's reply ends on a question the wording does not read; then 「はい」.
  const owedSt = base([TODAY, JOB, PP, PS], { practiceSaid: beforeConv, history: [u('x'), a('y')], heldPage: { title: 'Conversation', part: 'open-conversation', at: 1, unasked: true } });
  const heardOwed: string[] = [];
  const tOwed = await runV2Turn({ session: lang, state: owedSt, studentSaid: 'I enjoyed the exhibition a lot.', callModel: scripted(['その文は正しいです。過去形の練習はここまでです。準備はいいですか。']).call, onText: (d) => heardOwed.push(d), boardPass: false, mathsCheck: false, nowMs: 11 * MIN });
  const tOwedGo = await runV2Turn({ session: lang, state: tOwed.state, studentSaid: 'はい', callModel: scripted([T45]).call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 11.4 * MIN });
  const owed = { held: tOwed.state.heldPage ?? null, heard: heardOwed.join(''), pagesAfterGo: pageTitles(tOwedGo.state) };
  const n4 = { ending: !!v2EndingPartAsk(N4_NOT_PART, GDI, LANGS), pending: v2PendingPart(GDI, base([TODAY, JOB, PP], { history: [u('x'), a(N4_NOT_PART)] }), N4_NOT_PART, 'いいえ、大丈夫です。', undefined, LANGS)?.title ?? null };
  const n5 = { guarded: v2LastReplyAskedGuarded([u('x'), a(N5_ASK)]), one: v2AsksTheLearner(N5_ASK) };
  return {
    item1, f84, f42, f2s, fStatement, item3, t66, n7, go, c1, i1, i1Offer, i2, mathsSilence, m1, n1, n2, n3, n3Offer, owed, n4, n5,
    t43: { pages: pageTitles(t43.state), heard: heard43.join(''), held: t43.state.heldPage?.title ?? null },
    tOdd: { pages: pageTitles(tOdd.state), heard: heardOdd.join(''), held: tOdd.state.heldPage?.title ?? null },
    t80: { pages: pageTitles(t80.state), heard: heard80.join(''), held: t80.state.heldPage?.title ?? null },
    replyAsks: SILENCE_BEFORE.map(([, t]) => v2ReplyAsks(t)),
  };
}

const ENGLISH_ASK = /next is|next up|shall we (?:go|move) on|question first|ready to go on|would you like to ask|before the summary/i;

async function main() {
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(await probe())}`); return; }
  const on = await probe();

  console.log('the switches: each on by default');
  check('ASK_ONE_TEST, SILENCE_AFTER_ASK, PART_ASK_CLAUSES, PART_GO_NAMED default on', TUTOR_V2_ASK_ONE_TEST && TUTOR_V2_SILENCE_AFTER_ASK && TUTOR_V2_PART_ASK_CLAUSES && TUTOR_V2_PART_GO_NAMED);

  console.log('1  a Japanese ask is an ask: no 2 s recheck after it (client) and "asked them" on the server, one test');
  for (const s of on.item1.silence) check(`${s.k}: the client and v2LastReplyAsked read an ask`, s.client && s.server, s);
  check('#76 「私の後に繰り返してください。 international」 is an ask', on.item1.t76);
  check('7m: `Try starting with "I have worked with…"` and 「まず、一文で答えてみてください。」 + a starter stay asks', on.item1.m7.every(Boolean), on.item1.m7);
  for (const s of on.item1.statements) check(`a statement stays a statement: "${s.t}"`, !s.client && !s.server, s);
  check('a maths voice reply that asks ("What do you get?") is an ask', on.item1.mathsAsk);
  {
    const tv = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'TutorVoiceV2.tsx'), 'utf8');
    check('the client tests the reply\'s whole sentences with v2AsksTheLearner (turnWholeRef), under the switch', /!asksAnywhere\(said\) && !\(TUTOR_V2_ASK_ONE_TEST && v2AsksTheLearner\(turnWholeRef\.current\.join\(' '\)\)\)/.test(tv) && /turnWholeRef\.current\.push\(sentence\)/.test(tv) && /turnWholeRef\.current = \[\]/.test(tv));
  }

  console.log('2  a long silence after an ask: the question in hand stands, never answered by the tutor');
  check('18.9 min (after the summary question #84): "not answered the question in hand", "do not give the answer", "no new question"', /not answered the question in hand yet/.test(on.f84) && /Do not give the answer/.test(on.f84) && /do not ask a new question/.test(on.f84), on.f84.match(/the student has said nothing[^\n]*/)?.[0]);
  check('after the part ask #42: the same, and not the part-change ask again word for word', /not answered the question in hand yet/.test(on.f42) && /part-change ask word for word/.test(on.f42));
  check('the 2 s recheck line after an ask (7m) also says not to give the answer', /they may be thinking/.test(on.f2s) && /Do not give the answer yourself/.test(on.f2s), on.f2s.match(/your last reply asked[^\n]*/)?.[0]);
  check('after a statement: the plain line, as before', /the student has said nothing for 12 seconds/.test(on.fStatement) && !/question in hand/.test(on.fStatement));

  console.log('3  Japanese part asks read by clause');
  for (const x of on.item3) check(`${x.k}: a part ask (${x.parts.join(', ')})${x.want ? `; "Yes." pends ${x.want}` : ''}`, x.ending && x.parts.length > 0 && (x.want === null || x.pending === x.want), x);
  check('#63 names Pronunciation and Summary', JSON.stringify(on.item3.find((x) => x.k === '#63')?.parts) === JSON.stringify(['pronunciation', 'summary']));
  check('#80 names Summary', JSON.stringify(on.item3.find((x) => x.k === '#80')?.parts) === JSON.stringify(['summary']));
  check('#66 (one word at a time, or the whole sentence?) is a practice choice, not a part ask', !on.t66.ending && on.t66.pending === null, on.t66);
  check('7n: the morning\'s ask still pends Present perfect, 「…進みますが、よろしいですか？」 Past simple', on.n7.morning === 'Present perfect' && on.n7.morning2 === 'Past simple', on.n7);
  for (const n of on.n7.notPart) check(`no part ask: 「${n.x}」`, !n.ending && n.pending === null, n);
  check('an English-only lesson does not read the Japanese wording', on.n7.english);

  console.log('4  go answers; the page of the part their go answered opens; no English ask after a go');
  check('#63 + "pronunciation." is a go and pends Pronunciation', on.go.pron63 === 'go' && on.go.pron63Pending === 'Pronunciation', [on.go.pron63, on.go.pron63Pending]);
  check('#80 + "Uh, wrap up." is a go', on.go.wrap80 === 'go', on.go.wrap80);
  for (const w of on.go.wraps) check(`"${w.x}" is a go to #80 (まとめに進みましょうか) and to "Next is summary. Shall we go on…"`, w.to80 === 'go' && w.toEn === 'go', w);
  check('"Uh, no, let\'s go." to #43 is a go (7n)', on.go.letsGo43 === 'go');
  check('"summary" to an ask about Conversation is not a go; "Let\'s skip to the summary." neither', on.go.summaryTo42 !== 'go' && on.go.skipTo42 !== 'go', [on.go.summaryTo42, on.go.skipTo42]);
  check('"wrap up" after no ask is not a go', on.go.wrapNoAsk !== 'go', on.go.wrapNoAsk);
  check('11.4 min: #43 + "Uh, no, let\'s go." opens the Conversation page as the reply begins', on.t43.pages.includes('Conversation') && on.t43.held === null, on.t43);
  check('…and no runtime English part ask in that reply', !ENGLISH_ASK.test(on.t43.heard), on.t43.heard);
  check('an ask the runtime cannot read (「会話の練習はどうでしょうか。」) + "Yes, let\'s go.": the model\'s Conversation page is not held', on.tOdd.pages.some((p) => /会話|Conversation/.test(p)) && on.tOdd.held === null && !ENGLISH_ASK.test(on.tOdd.heard), on.tOdd);
  check('18 min: #80 + "Uh, wrap up." opens the summary page, no English ask or offer after it', on.t80.pages.includes('まとめ') && on.t80.held === null && !ENGLISH_ASK.test(on.t80.heard), on.t80);

  console.log('6  fix round 1');
  for (const c of on.c1) check(`C1 ${c.k}: no part ask, nothing pends, the reply holds no part, 「いいえ、大丈夫です。」 opens no page`, !c.ending && c.pending === null && c.held === null && c.pagesAfter === 0, c);
  for (const x of on.i1) check(`I1 ${x.k}: not a go for Conversation; the model's Conversation page is held`, !x.go && !x.opened, x);
  check('I1 the runtime\'s choice offer ("…now, or go straight to the summary?") + "Yes.": a go for neither part', !on.i1Offer.summary && !on.i1Offer.pron, on.i1Offer);
  for (const x of on.i2.notAsk) check(`I2 no ask by the one test (and no silence-after-ask line): 「${x.t}」`, !x.asks && !x.server, x);
  check('I2 a request quoted as a phrase (「"Could you tell me…?" は「教えてもらえますか」という意味です。」) is no ask by the one test', !on.i2.quotedInvite && !on.i2.quotedAsks, on.i2);
  check('I2 the session\'s asks stay asks (どうぞ, 繰り返してください, 言ってみましょう)', on.i2.stillAsks.every(Boolean), on.i2.stillAsks);
  check('m1 "Conversation?" (asking what it is) is not a go', on.m1.conversationQ !== 'go', on.m1);
  check('m6 a maths voice reply that asked: the long silence says the question in hand stands', /not answered the question in hand yet/.test(on.mathsSilence), on.mathsSilence.match(/the student has said nothing[^\n]*/)?.[0]);

  console.log('7  fix round 2');
  for (const x of on.n1.asks) check(`N1 a か-question with a time / condition word stays an ask (one test, guarded, server): 「${x.t}」`, x.one && x.guarded && x.server, x);
  check(`N1 every か-question of the session is an ask by the one test (${on.n1.sessionQs.length})`, on.n1.sessionQs.length >= 10 && on.n1.sessionQs.every((x) => x.one), on.n1.sessionQs.filter((x) => !x.one));
  for (const x of on.n2) check(`N2 「${x.t}」: no part ask, nothing held, 「はい、続けましょう。」 opens no page`, !x.ending && x.held === null && x.pagesAfter === 0, x);
  for (const x of on.n3) check(`N3 「次に、会話の練習をします。質問がありますか、それとも進みましょうか。」 + "${x.said}": read, Conversation opens, no English ask`, x.ending && x.pages.includes('Conversation') && x.held === null && !ENGLISH_ASK.test(x.heard), x);
  check('N3 the optional part offered in the model\'s words + 「発音をお願いします。」: a go, Pronunciation pends and opens, no English ask', on.n3Offer.move === 'go' && on.n3Offer.pending === 'Pronunciation' && on.n3Offer.pages.includes('Pronunciation') && on.n3Offer.held === null && !ENGLISH_ASK.test(on.n3Offer.heard), on.n3Offer);
  check('N3 (state before wording): a page owed its ask + a reply closing on 「準備はいいですか。」: that is the ask (held, asked, no English ask added)', on.owed.held?.part === 'open-conversation' && !on.owed.held?.unasked && !ENGLISH_ASK.test(on.owed.heard), on.owed);
  check('N3 …and 「はい」 then opens Conversation', on.owed.pagesAfterGo.includes('Conversation'), on.owed.pagesAfterGo);
  check('「大丈夫です。」 to an offer to do a part is a polite no; to "questions, or go on?" a go', on.n3Offer.politeNo === 'other' && on.n3Offer.okToQuestions === 'go', on.n3Offer);
  check('n4 「次は過去形と比べてみましょう。何か質問はありますか。」 is no part ask', !on.n4.ending && on.n4.pending === null, on.n4);
  check('n5 「"How long have you worked there?" と聞いてみてください。」 is an ask (silence-after-ask line too)', on.n5.guarded && on.n5.one, on.n5);

  console.log('5  each switch off alone (a child process per switch): as at 7ce31282 for that item, the others on');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC5_7R_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Awaited<ReturnType<typeof probe>>;
  };
  {
    const off = child('ASK_ONE_TEST');
    const missed = off.item1.silence.filter((s) => !s.client).map((s) => s.k);
    check('ASK_ONE_TEST off: the client takes exactly the 9 for statements again (as at HEAD)', JSON.stringify(missed) === JSON.stringify(['#0', '#7', '#12', '#27', '#42', '#63', '#66', '#69', '#84']), missed);
    check('ASK_ONE_TEST off: the server reads them as before (asksAnywhere on its cut)', off.item1.silence.every((s) => s.server === s.was), off.item1.silence);
    check('ASK_ONE_TEST off: the other items unchanged', off.item3.every((x) => x.ending) && off.go.wrap80 === 'go');
  }
  {
    const off = child('SILENCE_AFTER_ASK');
    check('SILENCE_AFTER_ASK off: the plain silence line after an ask (as before)', /the student has said nothing for 12 seconds/.test(off.f84) && !/question in hand/.test(off.f84) && !/Do not give the answer/.test(off.f2s));
  }
  {
    const off = child('PART_ASK_CLAUSES');
    check('PART_ASK_CLAUSES off: none of the session\'s Japanese part asks is read (as before)', off.item3.every((x) => !x.ending), off.item3.map((x) => [x.k, x.ending]));
    check('PART_ASK_CLAUSES off: the morning\'s ask still pends Present perfect (7n)', off.n7.morning === 'Present perfect');
  }
  {
    const off = child('PART_GO_NAMED');
    check('PART_GO_NAMED off: "Uh, wrap up." and "summary" are not go answers (as before)', off.go.wrap80 !== 'go' && off.go.wraps.find((w) => w.x === 'Uh, summary.')?.toEn !== 'go', off.go.wraps);
    check('PART_GO_NAMED off: #80 + "Uh, wrap up." holds the summary page and asks in English again (as live at 18 min)', !off.t80.pages.includes('まとめ') && ENGLISH_ASK.test(off.t80.heard), off.t80);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
