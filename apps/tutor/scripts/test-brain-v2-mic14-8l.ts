/// <reference types="node" />
/**
 * Tutor brain v2 — Task 8l: mic test 14 (embed-1795467413823; task-8l-report.md). Three flags, on the session's real turns (session row
 * transcript T0–T89 and whiteboard as read from the database; the board as the flag panel recorded it). No network, no model, nothing to
 * the speech vendor.
 *   npm run test:brain-v2-mic14-8l
 *
 *  1 NOTE_ITEM_LINES       the opening note `<board note gloss="今日練習する2つの文法">Present perfect (現在完了)\nPast simple (過去形)</board>`:
 *                          its lines are equal items (no heading line) on a language lesson's note; a heading over points keeps its title;
 *                          a maths / science note (no targets marker, no gloss) keeps main's first-line heading rule
 *  2 CORRECTED_CARD_WHOLE  T35 "I have learned to negotiate customers and give best price." → T36, the model's own card "…with customers
 *                          and give best price." (one error fixed, one left): it is the model's corrected text, never their words (painted,
 *                          recorded as a correction, no as-said refusal); the sentence-card section now says a correcting card holds the
 *                          whole sentence right
 *  3 WELL_WITH_CARD        T90, the summary reply as written: "What went well" then two corrected-then-repeated sentences (placed under
 *                          "To improve", as 7w / 8c intend): the went-well heading is held and never painted; with a card said right
 *                          (T53's) under it, the heading goes up right before that card in the model's words, above "To improve"; the
 *                          facts list T53's sentence as said right; with none on record, the facts say to leave the group out
 *  4 RETEST_SEVERAL_FIXES  (fix round 1, review I1, the controller's ruling) T35 with the whole card "…negotiate with customers and give
 *                          the best price." (two fixes): its re-test passes on one changed phrase used right with no original wrong form
 *                          back; missed only when "negotiate customers" / "give best" comes back; a later correction of another slip
 *                          does not score it
 *  each switch off alone (a child process per switch): as at ade52609 for that item (4: as at ac244651).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { v2NoteCorrection, v2SaidRightSentences } from '../src/lib/tutor/v2/summary-marks';
import { v2NoteCorrectedSentence, v2SentenceCardsSection } from '../src/lib/tutor/v2/sentence-cards';
import { richBlocks, v2NoteLinesAreItems } from '../src/lib/tutor/v2/rich-text';
import { V2_SUMMARY_IMPROVE_HEADING, V2_SUMMARY_WELL_HEADING, V2_SUMMARY_WELL_HELD } from '../src/lib/tutor/v2/summary-headings';
import { V2_SUMMARY_NO_WELL } from '../src/lib/tutor/v2/summary-layout';
import { V2_AS_SAID_REFUSED } from '../src/lib/tutor/v2/learner-card';
import { TUTOR_V2_CORRECTED_CARD_WHOLE, TUTOR_V2_NOTE_ITEM_LINES, TUTOR_V2_RETEST_SEVERAL_FIXES, TUTOR_V2_WELL_WITH_CARD } from '../src/lib/tutor/orchestrator/flags';
import { v2AdaptAfter, v2PracticePairs, v2RetestWrongForms } from '../src/lib/tutor/v2/adaptive';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC14_8L_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, JSON.stringify(detail ?? '', null, 1)?.slice(0, 3000)); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (text: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content: [{ type: 'text', text }], stop_reason: 'end_turn', stop_sequence: null, usage } as unknown as Anthropic.Message);
/** A scripted model: the replies in order (the last repeated); the user texts and the system prompt kept. */
function scripted(replies: string[]) {
  const asks: string[] = []; let system = ''; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    if (!system) system = (Array.isArray(params.system) ? params.system : [{ text: String(params.system ?? '') }]).map((b) => (b as { text: string }).text).join('\n');
    const last = params.messages[params.messages.length - 1];
    if (last?.role === 'user') for (const b of (Array.isArray(last.content) ? last.content : [{ type: 'text', text: last.content }]) as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text) asks.push(b.text);
    const r = replies[Math.min(i, replies.length - 1)]!; i += 1;
    onText?.(r);
    return msg(r);
  };
  return { call, asks, system: () => system };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Praveen', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI, pronunciation: true,
  teacher: { name: 'Ryota', background: 'I help Japanese professionals speak English at work.' } };
const MIN = 60000;
const START = '[The session has just started. The student has joined and is waiting for you to begin the lesson.]';
const ids = GDI.segments.map((s) => s.id);
const goalsThrough = (n: number) => Object.fromEntries(ids.slice(0, n).map((id) => [id, { status: 'shown' as const, at: 0 }]));

// ── The session (embed-1795467413823): transcript T0–T89 as stored (u = the learner, a = the tutor) ──
const TRANSCRIPT: Array<['u' | 'a', string]> = [
  ["a", "Hello, Praveen! I'm Ryota, and welcome to your English lesson. Today we'll practice talking about your work and a project you've been involved in, using the present perfect and the past simple. Does that sound good to you?"],
  ["u", "Yes."],
  ["a", "Great, let's begin. First I'll ask you a few short questions, so I can pitch the lesson at the right level for you. Is that OK, or do you have a question first?"],
  ["u", "Okay."],
  ["a", "Let's start with a few questions. Please answer in English, and don't worry about mistakes.\n Can you tell me a little about your job? What do you do?"],
  ["u", "Um, I work sales associate in the Goya Corporation, sell washing machine."],
  ["a", "Thank you, that's clear. Next question: have you ever worked with an international customer? If so, can you tell me about it?"],
  ["u", "Yes, I work with Canada customer, sell washing machine, good experience."],
  ["a", "Good, that's helpful to know. Next question: what is one skill you'd like to improve in your English, and why is it important to you?"],
  ["u", "Um, want fluent English, uh, international customer to sell washing machine."],
  ["a", "ありがとうございます。レベル確認はこれで終わりです。次は「Your job」、仕事について話す練習です。質問はありますか？それとも、このまま進みましょうか？"],
  ["u", "Yes."],
  ["a", "では、仕事について話す練習を始めましょう。自分の仕事を簡単に説明するときは、短い文を使います。\n\nPlease say one sentence about your work. Try starting with: \"I work…\"\n\n What do you do at work?"],
  ["u", "I work 9 to 6, sell washing machine in home appliance division."],
  ["a", "いい説明ですね。一つだけ直しましょう。「washing machine」は複数の機械を売るときは「washing machines」と s を付けます。もう一度言ってみてください。"],
  ["u", "I sell washing machines in the home appliance division."],
  ["a", "That's right! You said it with the s on \"washing machines,\" which is correct because you sell more than one machine. 「washing machines」と複数形にしたのは正しいです。\n\nDo you talk with customers every day?"],
  ["u", "Yes, I talk customer every day, explain working of machine."],
  ["a", "「talk」のあとには「to」が必要です。 「I talk to customers every day.」と言います。\n\n\n\nPlease say that sentence once more."],
  ["u", "machines."],
  ["a", "お客様と話すときは、\"talk to customers\" と言います。\n\nNext, could you tell me one more thing about how you explain the machines to customers? Start with \"I explain…\""],
  ["u", "I explain front load working and top load and which better."],
  ["a", "Good, you explained the two types clearly. One small thing: we say \"which is better,\" with \"is.\" Please say the whole sentence once more."],
  ["u", "I explain front load and top load and which is better."],
  ["a", "その文は正しく言えました。 仕事の説明の練習はここまでです。次は Present perfect（現在完了）です。質問はありますか？それとも、このまま進みましょうか？"],
  ["u", "Yes."],
  ["a", "現在完了は、過去に始まって今も続いていることを話すときに使います。\n\nLet's start with a question about your company. Have you worked for your current company for a long time?"],
  ["u", "Yes, I have work at Nagoya Corporation 5 years."],
  ["a", "わかりました、五年間ですね。「have」の後ろは過去分詞の worked を使います。\n\nPlease say the whole sentence once more."],
  ["u", "I have worked at Nagoya Corporation for 5 years."],
  ["a", "That's correct, and \"5 years\" is fine as written. Now, a follow-up question about how long you've been in sales.\n\nHave you worked in sales for a long time?"],
  ["u", "Yes, I I have worked uh sales uh 3 year"],
  ["a", "営業で働いた期間を言うときは、\"in sales\" と \"for three years\" を使います。\n\nPlease say the whole sentence once more."],
  ["u", "I have worked in sales for 3 years."],
  ["a", "That's correct: \"I have worked in sales for three years.\" Now, what have you learned in your job? Start with: \"I have learned…\""],
  ["u", "I have learned to negotiate customers and give best price."],
  ["a", "\"Negotiate\" needs \"with\" before the customers. Please say the whole sentence once more."],
  ["u", "I have learned to negotiate with customers and give best price."],
  ["a", "よく言えました。 One small thing: we say \"the best price,\" with \"the.\"\n\n I have learned to negotiate with customers and give the best price.\n\n現在完了の練習はここまでです。次は Past simple（過去形）です。質問はありますか？それとも、このまま進みましょうか？"],
  ["u", "I have learned to negotiate with customers and give the best price."],
  ["a", "That's correct: \"I have learned to negotiate with customers and give the best price.\" 現在完了の練習はここまでです。次は Past simple（過去形）です。質問はありますか？それとも、このまま進みましょうか？"],
  ["u", "Yes."],
  ["a", "過去形は、終わった出来事を「いつ」かはっきり言うときに使います。例えば「去年」などです。\n\nDid you attend any business events or exhibitions last year?"],
  ["u", "Yes, I attend robotics exhibition Tokyo last year."],
  ["a", "「去年」は特定の過去の時なので、過去形を使います。 \"attend\" は \"attended\" になります。\n\nPlease say the whole sentence once more."],
  ["u", "I attended the robotics exhibition in Tokyo last year."],
  ["a", "That's right! You used \"attended\" for a specific time, \"last year.\" Now, what did you see at the exhibition? Start with \"I saw…\""],
  ["u", "I saw dancing robot at exhibition."],
  ["a", "Dancing robot, nice! One small thing: we say \"a dancing robot\" and \"the exhibition.\" 「a」と「the」を入れます。\n\nWhat did the robot do?"],
  ["u", "The robot sang well and uh shake hand with people."],
  ["a", "「歌がうまかった」は \"sang well\" で正しいです。 直すのは \"shake hands\" の部分です。過去の出来事なので \"shook hands\" にします。\n\nPlease say the whole sentence once more."],
  ["u", "The robot sang well and shook hands with people."],
  ["a", "That's right! \"Shook\" is the past form of \"shake,\" and you used it for a finished event. Now, did you enjoy the exhibition? Start with \"I enjoyed…\""],
  ["u", "I enjoyed the exhibition very, very, very much."],
  ["a", "Yes, that's correct, and it shows your feeling clearly.\n\nWhat was your favorite part of the exhibition? Start with: \"My favorite part was…\""],
  ["u", "My favorite part was meeting robot named Neon. He got, he made coffee for me."],
  ["a", "Neon がコーヒーを入れてくれたんですね、いい思い出です。 One small thing: \"got\" is not needed here. We say \"He made coffee for me.\" Please say that sentence once more."],
  ["u", "He made coffee for me."],
  ["a", "That's right: \"He made coffee for me.\" 過去形の練習はここまでです。次は Conversation（会話）です。質問はありますか？それとも、このまま進みましょうか？"],
  ["u", "Yes."],
  ["a", "Let's talk more about your work. Thank you for listening so well.\n\nHow long have you been in sales?"],
  ["u", "Um, I uh, in sales 3 year."],
  ["a", "「3年」ですね。文の中に「have」が必要です。Try starting with: \"I have been…\" Please say the whole sentence once more."],
  ["u", "I have been in sales uh 3 years."],
  ["a", "Almost. We need \"for\" before the number of years. Here is the full sentence:\n\nI have been in sales for three years. Now, what do you like most about selling washing machines?"],
  ["u", "I have been in sales for 3 years."],
  ["a", "That's right: \"I have been in sales for three years.\" Now, what do you like most about selling washing machines?"],
  ["u", "What do I like about selling washing machines? I like um uh help uh customers choose front load because better than top load."],
  ["a", "わかりやすい理由ですね。 \"I like help customers\" は \"I like helping customers\" と言います。\n\nお客様がどのタイプを選んだか、具体的に教えてもらえますか？ Please tell me about one customer and the machine they chose."],
  ["u", "Uh, Mr. Kenji chose top load, then I tell front load better because it save electricity."],
  ["a", "Kenji が top load を選んだんですね。 「told」は過去形で、ある時に言ったことを表します。\n\nPlease say the sentence once more: \"Kenji chose top load, then I told him front load is better, because it saves electricity.\""],
  ["u", "Kenji chose top load, then I told him front load is better because it saves electricity."],
  ["a", "That's right, and you explained the reason clearly. Your turn now: you can ask me one question about work, about my experience, or about teaching English. What would you like to know?"],
  ["u", "Um, I want to know which college you went to and what do you do?"],
  ["a", "I studied English in Canada for one year. Now I teach English in Nagoya, and I have taught for about eight years. 私はナゴヤで英語を教えています。\n\nWhat did you sell to the customer from Canada? Start with: \"I sold…\""],
  ["u", "I sold 35 washing machines to Canada customer."],
  ["a", "Thirty-five machines! That's a great result. What did the customer say when they bought so many?"],
  ["a", "Take your time. Here's a smaller hint: you can start with \"He said…\" or \"The customer said…\"."],
  ["a", "会話の練習はここまでです。次は Pronunciation（発音）で、三分ほどです。発音の練習をしますか、それとも、このまままとめに進みましょうか？"],
  ["u", "Yes."],
  ["a", "では、発音の練習を始めましょう。次のどれがいいですか。 You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue.\n\n Which would you like to practice?"],
  ["u", "Uh, individual words."],
  ["a", "単語ですね。まず「responsibilities」を聞いて、まねして言ってください。\n\nListen, then repeat after me: responsibilities."],
  ["u", "responsibilities."],
  ["a", "もう一度聞いてから、まねして言ってください。\nListen, then repeat after me: responsibilities."],
  ["u", "responsibilities."],
  ["a", "Good, that's 85 out of 100. The word \"responsibilities\" is clear. Now one more word, \"international.\" Listen, then repeat after me: international."],
  ["u", "international."],
  ["a", "94点でした。\"international\" はよく言えています。最後の言い方は私が言いますね。 \"international\" はここで区切ります: in-ter-NA-tion-al. 次は、もう一つ単語を練習しますか、それともまとめに進みますか？"],
  ["u", "Um, um, move on."],
];
const T = (n: number) => TRANSCRIPT[n]![1];
/** The board before T90, as the flag panel recorded it (pages 1–7). */
const PAGES: V2BoardPage[] = [ { "title": "Overview", "items": [ { "id": "inl_mwtqxx20_2", "tool": "annotate", "summary": "Talking About Your Work and Recent Projects" }, { "id": "inl_mwtqxx20_3", "tool": "annotate", "summary": "Present perfect (現在完了)\nPast simple (過去形)" } ] }, { "title": "Level check", "items": [ { "id": "inl_mwtqyo1k_2", "tool": "show_problem", "summary": "Question — Can you tell me a little about your job? What do you do?" }, { "id": "inl_mwtqz2mh_1", "tool": "show_problem", "summary": "Question — Have you ever worked with an international customer? If so, can you tell me about the experience?" }, { "id": "inl_mwtqzcdq_1", "tool": "show_problem", "summary": "Question — What is one skill you'd like to improve in your English, and why is it important to you?" } ] }, { "title": "Your job", "items": [ { "id": "inl_mwtr0nsi_1", "tool": "annotate", "summary": "\"I work in sales.\" 「私は営業で働いています。」\n\"I help customers.\" 「私はお客様を手伝います。」\n\"I work with international clients.\" 「私は海外のお客様と仕事をします。」" }, { "id": "inl_mwtr0nsi_2", "tool": "show_problem", "summary": "Question — What do you do at work? Answer with one or two sentences." }, { "id": "inl_mwtr1aka_1", "tool": "show_sentence", "summary": "I sell washing machines in the home appliance division." }, { "id": "inl_mwtr1kvq_1", "tool": "show_problem", "summary": "Question — Do you talk with customers every day? Answer with \"Yes, I…\" or \"No, I…\"." }, { "id": "inl_mwtr252t_1", "tool": "show_sentence", "summary": "I talk to customers every day." }, { "id": "inl_mwtr2mh2_1", "tool": "show_sentence", "summary": "I explain front load and top load, and which is better." } ] }, { "title": "Present perfect", "items": [ { "id": "inl_mwtr50d4_1", "tool": "annotate", "summary": "\"have\" や \"has\" + 過去分詞: \"I have worked here for five years.\"" }, { "id": "inl_mwtr50d4_2", "tool": "show_problem", "summary": "Question — Have you worked for your current company for a long time?" }, { "id": "inl_mwtr5e39_1", "tool": "show_sentence", "summary": "I have worked at Nagoya Corporation for five years." }, { "id": "inl_mwtr6h5v_1", "tool": "show_problem", "summary": "Question — Have you worked in sales for a long time?" }, { "id": "inl_mwtr6wyl_1", "tool": "show_sentence", "summary": "I have worked in sales for three years." }, { "id": "inl_mwtr74ev_1", "tool": "show_problem", "summary": "Question — What have you learned in your job?" }, { "id": "inl_mwtr7hx4_1", "tool": "show_sentence", "summary": "I have learned to negotiate with customers and give best price." }, { "id": "inl_mwtr7sty_1", "tool": "show_sentence", "summary": "I have learned to negotiate with customers and give the best price." } ] }, { "title": "Past simple", "items": [ { "id": "inl_mwtr8pj2_1", "tool": "annotate", "summary": "\"attended\" は attend の過去形です。 I \"attended\" an exhibition last year." }, { "id": "inl_mwtr8pj2_2", "tool": "show_problem", "summary": "Question — Did you attend any business events or exhibitions last year?" }, { "id": "inl_mwtr94yf_1", "tool": "show_sentence", "summary": "I attended the robotics exhibition in Tokyo last year." }, { "id": "inl_mwtra187_1", "tool": "show_problem", "summary": "Question — What did you see at the exhibition?" }, { "id": "inl_mwtradva_1", "tool": "show_sentence", "summary": "I saw a dancing robot at the exhibition." }, { "id": "inl_mwtradva_2", "tool": "show_problem", "summary": "Question — What did the robot do?" }, { "id": "inl_mwtrauh8_1", "tool": "show_sentence", "summary": "The robot sang well and shook hands with people." }, { "id": "inl_mwtrb4dm_1", "tool": "show_problem", "summary": "Question — Did you enjoy the exhibition?" }, { "id": "inl_mwtrbj82_1", "tool": "show_sentence", "summary": "I enjoyed the exhibition very, very, very much." }, { "id": "inl_mwtrbj82_2", "tool": "show_problem", "summary": "Question — What was your favorite part of the exhibition?" }, { "id": "inl_mwtrbyxd_1", "tool": "show_sentence", "summary": "My favorite part was meeting the robot named Neon." }, { "id": "inl_mwtrbyxd_2", "tool": "show_sentence", "summary": "He made coffee for me." } ] }, { "title": "Conversation", "items": [ { "id": "inl_mwtrclo7_1", "tool": "show_problem", "summary": "Question — How long have you been in sales?" }, { "id": "inl_mwtrf25y_1", "tool": "show_sentence", "summary": "I have been in sales for three years." }, { "id": "inl_mwtrf25y_2", "tool": "show_problem", "summary": "Question — What do you like most about selling washing machines?" }, { "id": "inl_mwtrfsi6_1", "tool": "show_sentence", "summary": "I like helping customers." }, { "id": "inl_mwtrfsi6_2", "tool": "show_sentence", "summary": "I like helping customers choose a front load machine, because it is better than a top load machine." }, { "id": "inl_mwtrfsi6_3", "tool": "show_problem", "summary": "Question — Tell me about one customer and the machine they chose." }, { "id": "inl_mwtrgepd_1", "tool": "show_sentence", "summary": "Kenji chose top load, then I told him front load is better, because it saves electricity." }, { "id": "inl_mwtrgepd_2", "tool": "annotate", "summary": "\"told\" is the past form of \"tell.\"" }, { "id": "inl_mwtrhfse_1", "tool": "show_problem", "summary": "Question — What did you sell to the customer from Canada?" }, { "id": "inl_mwtrhyr1_1", "tool": "show_sentence", "summary": "I sold 35 washing machines to a Canadian customer." } ] }, { "title": "Pronunciation", "items": [ { "id": "inl_mwtrl9qc_1", "tool": "show_problem", "summary": "Question — Which would you like to practice? 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue." }, { "id": "inl_mwtrlifx_pron1", "tool": "show_sentence", "summary": "responsibilities" }, { "id": "inl_mwtrm56g_pron1", "tool": "show_sentence", "summary": "international" } ] } ];
/** The corrections of the lesson as the runtime recorded them live (their words → the card, its stress). WB numbers = the row's
 *  whiteboardCommands. WB32 is T53 carded as said (right): no correction. */
const CARDS: Array<[number, string, string[]]> = [
  [13, 'I sell washing machines in the home appliance division.', ['machines']],
  [21, 'I explain front load and top load, and which is better.', ['is', 'better']],
  [27, 'I have worked at Nagoya Corporation for five years.', ['worked', 'for']],
  [31, 'I have worked in sales for three years.', ['in', 'sales', 'for', 'three', 'years']],
  [35, 'I have learned to negotiate with customers and give best price.', ['with']],
  [37, 'I have learned to negotiate with customers and give the best price.', ['the', 'best', 'price']],
  [43, 'I attended the robotics exhibition in Tokyo last year.', ['attended', 'the', 'robotics', 'exhibition', 'in', 'Tokyo']],
  [47, 'I saw a dancing robot at the exhibition.', ['a', 'dancing', 'robot', 'the', 'exhibition']],
  [49, 'The robot sang well and shook hands with people.', ['sang', 'well', 'shook', 'hands']],
  [53, 'I enjoyed the exhibition very, very, very much.', []],
  [55, 'My favorite part was meeting the robot named Neon.', ['the', 'robot', 'named', 'Neon']],
  [55, 'He made coffee for me.', ['made', 'coffee', 'for', 'me']],
  [63, 'I have been in sales for three years.', ['for', 'three', 'years']],
  [67, 'I like helping customers.', ['helping']],
  [67, 'I like helping customers choose a front load machine, because it is better than a top load machine.', ['helping', 'customers']],
  [69, 'Kenji chose top load, then I told him front load is better, because it saves electricity.', ['told']],
  [75, 'I sold 35 washing machines to a Canadian customer.', ['a', 'Canadian', 'customer']],
];
const WB32 = 'I enjoyed the exhibition very, very, very much.';
/** WB35, carded at T56 for T55 "…He got, he made coffee for me." and said again at T57. By the one correction test (v2IsCorrectionOf) it is
 *  no correction: their words hold it as it stands ("he got, he made coffee for me"), so it is their own sentence, not a reworking. */
const WB35 = 'He made coffee for me.';
const history = (upTo: number) => [{ role: 'user' as const, content: START }, ...TRANSCRIPT.slice(0, upTo).map(([r, t]) => ({ role: r === 'u' ? 'user' as const : 'assistant' as const, content: t }))];
/** The state before T90: the board, the history to T89, every correction recorded as live (to T75). `drop`: cards left off the board. */
function atT89(drop: readonly string[] = []): V2State {
  const pages = structuredClone(PAGES).map((p) => ({ ...p, items: p.items.filter((it) => !drop.includes(it.summary)) }));
  const s: V2State = { ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, timeFit: { dropped: [], byArrival: true },
    board: { pages, current: 6 }, goals: goalsThrough(7), partStart: { part: 'pronunciation', at: 18.9 * MIN }, history: history(90) };
  for (const [said, card, stress] of CARDS) { if (drop.includes(card)) continue; v2NoteCorrectedSentence(lang, s, card, T(said), stress); v2NoteCorrection(lang, s, card, stress, T(said)); }
  return s;
}

// ── T90, the summary reply as written (its head from the row's WB52/WB53, the rest from the flag panel) ──
const NOTE53 = '"Present perfect": have or has + past participle, for experience that continues now, such as "I have worked here for five years."\n"Past simple": a finished event at a specific time, such as "I attended an exhibition last year."';
const WELL_BLOCK = '<board note style="heading" gloss="よくできたところ">What went well</board>\n<board sentence gloss="特定の過去の時「last year」に過去形を正しく使えました">I attended the robotics exhibition in Tokyo last year.</board>\n<board sentence gloss="現在完了で、続けてきた経験を言えました">I have learned to negotiate with customers and give the best price.</board>';
const T90 = (well: string = WELL_BLOCK) => `<board page>Summary</board>\n<board note style="highlight" gloss="経験や継続は現在完了、特定の過去の時は過去形">${NOTE53}</board>\n\n`
  + 'Great work today! You talked about your job, your customers and a trade show. You used the present perfect for your experience, and the past simple for finished events with a time, like "last year."\n\n'
  + `${well}\n\nOne thing to improve is the past simple for a finished event. Also, use "a" for a new customer.\n\n`
  + '<board note style="heading" gloss="直すところ">To improve</board>\n<board sentence stress="told" gloss="過去の出来事なので tell の過去形 told">Kenji chose top load, then I told him front load is better, because it saves electricity.</board>\n<board sentence stress="a Canadian" gloss="customer の前に a、国籍は Canadian">I sold 35 washing machines to a Canadian customer.</board>\n\n'
  + 'Before we finish, here is one last question. Can you explain the difference between these two sentences? Take your time, and I\'ll help you if you need it.\n\n<board problem gloss="二つの文の違いを説明してください。">Can you explain the difference between these two sentences? "I have worked here for five years." "I worked here five years ago."</board>';
/** The same reply with T53's right sentence written under "What went well" after the two corrections. */
const T90_WITH_RIGHT = T90(`${WELL_BLOCK}\n<board sentence gloss="とても楽しかった気持ちが伝わりました">${WB32}</board>`);
const NONE = '1: none\n2: none\n3: none (nothing to draw)';

async function turn(state: V2State, said: string, replies: string[], atMin: number, boardPass = false) {
  const m = scripted(replies);
  const r = await runV2Turn({ session: lang, state: structuredClone(state), studentSaid: said, callModel: m.call, boardPass, mathsCheck: false, nowMs: atMin * MIN });
  const calls = r.toolCalls.map((c) => ({ id: c.id, name: c.name, text: String(c.args.sentence ?? c.args.text ?? c.args.title ?? ''), style: c.args.style ?? null, gloss: c.args.gloss ?? null, emphasis: c.args.emphasis ?? null, outcome: c.outcome, before: c.before ?? null }));
  const page = r.state.board.pages[r.state.board.current];
  return { calls, system: m.system(), facts: m.asks.filter((x) => x.startsWith('<facts>')).join('\n'), corrections: r.state.corrections ?? [], boardProblems: (r.state as { boardProblems?: string[] }).boardProblems ?? [],
    page: page ? page.items.map((it) => `${it.tool}: ${it.summary}`) : [], spoken: r.spoken };
}

// ── Flag 1: the opening note ──
const NOTE1 = 'Present perfect (現在完了)\nPast simple (過去形)';

// ── Fix round 1: the re-test of a card that fixed several errors (T35 → the whole card) ──
const T35 = 'I have learned to negotiate customers and give best price.';
const WHOLE35 = 'I have learned to negotiate with customers and give the best price.';
const PP = { index: 3, id: 'present-perfect' };
/** The re-test of T35's whole card, open (asked at reply 1) in Present perfect; `said`: their later answer, `card`/`stress`: its card. */
function retestAfter(said: string, card: string, stress: string[], of: { said: string; right: string; target: string[] } = { said: T35, right: WHOLE35, target: ['with customers', 'the best'] }) {
  const s: V2State = { ...newV2State(0), history: [{ role: 'user', content: START }, { role: 'assistant', content: 'a' }, { role: 'user', content: 'b' }, { role: 'assistant', content: 'c' }, { role: 'user', content: 'd' }, { role: 'assistant', content: 'e' }],
    retests: [{ part: PP.id, ...of, turn: 0, offered: 1, in: PP.id, askedAt: 1, lastAt: 1 }] };
  const events = v2AdaptAfter(lang, s, PP, [said], v2PracticePairs([said], [{ sentence: card, stress }]), { support: false, retest: true });
  return { outcome: s.retests![0]!.outcome ?? null, events: events.map((e) => `${e.type} ${e.message}`) };
}

const NAGOYA = { said: 'Yes, I worked at Nagoya uh 5 years ago.', right: 'I have worked at Nagoya Corporation for five years.', target: ['i have', 'corporation for five'] };
const TOKYO = { said: 'I work Tokyo 3 year.', right: 'I have worked in Tokyo for three years.', target: [] as string[] };

async function probe() {
  // 2: T35 → T36 (the reply as said, with the card WB21 the row holds).
  const atT35 = (() => { const s = atT89(); s.history = history(35); s.board.pages = s.board.pages.slice(0, 4); s.board.pages[3]!.items = s.board.pages[3]!.items.slice(0, 6); s.board.current = 3; s.corrections = []; s.correctedSentences = []; s.correctedOlder = []; s.partStart = { part: 'present-perfect', at: 6 * MIN }; s.goals = goalsThrough(4); return s; })();
  const T36 = `"Negotiate" needs "with" before the customers. <board sentence stress="with" gloss="negotiate の後ろには with を入れます">${CARDS[4]![1]}</board> Please say the whole sentence once more.`;
  const t36 = await turn(atT35, T(35), [T36, NONE], 7.9, true);
  // 3: T90 as written; T90 with T53's sentence under "What went well"; the facts of T90 with and without T53's card on the board.
  const sum = await turn(atT89(), T(89), [T90(), NONE], 19.75);
  const sumRight = await turn(atT89(), T(89), [T90_WITH_RIGHT, NONE], 19.75);
  const noRight = await turn(atT89([WB32, WB35]), T(89), [T90(), NONE], 19.75);
  const rt = {
    // the session's shape: "…give the best price" with "with" right
    wholeRight: retestAfter(WHOLE35, WHOLE35, []),
    // one changed phrase used right in a new sentence, the other not used, no wrong form
    oneRight: retestAfter('I have talked with customers about prices.', 'I have talked with customers about prices.', []),
    // "give best price" again: an original wrong form back
    again: retestAfter('I have learned to negotiate with customers and give best price.', WHOLE35, ['the']),
    // a later correction of another slip (an article elsewhere): not scored
    other: retestAfter('I have gave best service to customer.', 'I have given the best service to the customer.', ['given', 'the', 'the']),
    // fix round 2 (re-review I1, ruling): mic test 10's T44 card ("i worked", "nagoya five" its wrong forms). A RIGHT later sentence that
    // holds "i worked" (carded as said, not corrected): not missed. The same form in a sentence that was corrected: missed.
    bankRight: retestAfter('I worked at a bank before that.', 'I worked at a bank before that.', [], NAGOYA),
    nagoyaAgain: retestAfter('I worked at Nagoya for five years.', 'I have worked at Nagoya for five years.', ['have'], NAGOYA),
    // fix round 2 (re-review M1, ruling): more than three words changed, the target fell back to the stress words "in", "for" (function
    // words only): a sentence with "in" and "for" passes nothing; with a content word in the stress, it passes on it.
    stressFn: retestAfter('I live in Osaka for work.', 'I live in Osaka for work.', [], { ...TOKYO, target: ['in', 'for'] }),
    stressContent: retestAfter('I have worked in Osaka since May.', 'I have worked in Osaka since May.', [], { ...TOKYO, target: ['have worked', 'in', 'for'] }),
  };
  return { rt, t36, sum, sumRight, noRight, saidRight: v2SaidRightSentences(lang, atT89()), saidRightNone: v2SaidRightSentences(lang, atT89([WB32, WB35])),
    flags: { several: TUTOR_V2_RETEST_SEVERAL_FIXES, items: TUTOR_V2_NOTE_ITEM_LINES, whole: TUTOR_V2_CORRECTED_CARD_WHOLE, well: TUTOR_V2_WELL_WITH_CARD } };
}
type Probe = Awaited<ReturnType<typeof probe>>;
const WHOLE = /A card that corrects their sentence holds the whole sentence right/;
const headings = (t: Probe['sum']) => t.calls.filter((c) => c.name === 'annotate' && c.style === 'heading' && !/^not /.test(c.outcome));
const idx = (t: Probe['sum'], s: string) => t.page.findIndex((x) => x.endsWith(s));

async function main() {
  const on = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }

  console.log('1  NOTE_ITEM_LINES: a note that is a list of items has no heading line');
  check('the opening note "Present perfect (現在完了) / Past simple (過去形)": its lines are equal items', v2NoteLinesAreItems(NOTE1));
  check('…rendered with titled off (the canvas passes titled = not items): two plain lines; titled on (main): the first line a title, as live', richBlocks(NOTE1, { titled: false }).every((b) => b.kind === 'line') && richBlocks(NOTE1, { titled: true })[0]!.kind === 'title');
  check('a heading over points keeps its title: "Disc method, the idea:" / a heading over sentences / a heading over maths', !v2NoteLinesAreItems('Disc method, the idea:\nslice it\nadd the discs') && !v2NoteLinesAreItems('Talking about work\nI work in sales.\nI help customers.') && !v2NoteLinesAreItems('Kinematics\n$v = u + at$'));
  check('labelled points, long lines, one line: no items', !v2NoteLinesAreItems('Present perfect: have + past participle\nPast simple: verb + ed') && !v2NoteLinesAreItems('We use the present perfect for experience that continues now\nPast simple') && !v2NoteLinesAreItems('Present perfect (現在完了)'));
  {
    const c = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'whiteboard', 'WhiteboardCanvas.tsx'), 'utf8');
    check('the canvas: only a note with the language-lesson marker (targets) or a gloss line, with the switch on; every other note titled as on main', c.includes("titled={!(TUTOR_V2_NOTE_ITEM_LINES && ((command as { targets?: boolean }).targets === true || !!cardGlossOf(command)) && v2NoteLinesAreItems(String(command.text ?? '')))}"));
  }
  check('the switch is default ON', on.flags.items === true);

  console.log('2  CORRECTED_CARD_WHOLE: a correcting card holds the whole sentence right');
  const wb21 = on.t36.calls.find((c) => c.name === 'show_sentence' && c.text === CARDS[4]![1]);
  check('T36: the card "…with customers and give best price." is the model\'s own corrected text (the error it named fixed, "best price" left): painted, no as-said refusal, recorded as the correction of T35 with "with"', !!wb21 && !/^not /.test(wb21.outcome) && wb21.outcome !== V2_AS_SAID_REFUSED && on.t36.corrections.some((c) => c.sentence === CARDS[4]![1] && c.stress.includes('with')), [on.t36.calls, on.t36.corrections]);
  check('the sentence-card section (in the system prompt) now says a correcting card holds the whole sentence right, every error fixed, stress on each word changed', WHOLE.test(on.t36.system) && WHOLE.test(v2SentenceCardsSection(['en', 'ja'])) && !WHOLE.test(v2SentenceCardsSection(['en', 'ja'], false, false)), on.t36.system.slice(0, 200));
  check('the switch is default ON', on.flags.whole === true);

  console.log('3  WELL_WITH_CARD: no "What went well" heading with nothing under it');
  check('T90 as written: the model\'s "What went well" is held (not painted) and never goes up: no card of that group came', on.sum.calls.some((c) => c.text === V2_SUMMARY_WELL_HEADING && c.outcome === V2_SUMMARY_WELL_HELD) && !headings(on.sum).some((h) => h.text === V2_SUMMARY_WELL_HEADING) && !on.sum.page.some((x) => x.endsWith(V2_SUMMARY_WELL_HEADING)), [on.sum.calls, on.sum.page]);
  check('…placement as 7w / 8c intend (unchanged): the two corrected-then-repeated sentences go under the runtime\'s "To improve" with their marks; the model\'s own "To improve" not doubled', idx(on.sum, V2_SUMMARY_IMPROVE_HEADING) >= 0 && idx(on.sum, V2_SUMMARY_IMPROVE_HEADING) < idx(on.sum, 'I attended the robotics exhibition in Tokyo last year.') && idx(on.sum, V2_SUMMARY_IMPROVE_HEADING) < idx(on.sum, 'I have learned to negotiate with customers and give the best price.') && headings(on.sum).length === 1, on.sum.page);
  check('…the page: rule note, "To improve", four cards, the question card; nothing is told to the next turn about the held heading', on.sum.page.length === 7 && /^annotate: "Present perfect"/.test(on.sum.page[0]!) && on.sum.page[1] === `annotate: ${V2_SUMMARY_IMPROVE_HEADING}` && /^show_problem/.test(on.sum.page[6]!) && !on.sum.boardProblems.some((x) => /What went well/.test(x)), [on.sum.page, on.sum.boardProblems]);
  check('…no model text cut: the spoken summary is all there', on.sum.spoken.includes('Great work today!') && on.sum.spoken.includes('One thing to improve is the past simple for a finished event.'), on.sum.spoken);
  const wellH = headings(on.sumRight).find((h) => h.text === V2_SUMMARY_WELL_HEADING);
  check('T90 with T53\'s right sentence under it: the heading goes up once, right before that card, in the model\'s words and line (よくできたところ), both above "To improve"', !!wellH && wellH.gloss === 'よくできたところ' && headings(on.sumRight).filter((h) => h.text === V2_SUMMARY_WELL_HEADING).length === 1
    && idx(on.sumRight, V2_SUMMARY_WELL_HEADING) + 1 === idx(on.sumRight, WB32) && idx(on.sumRight, WB32) < idx(on.sumRight, V2_SUMMARY_IMPROVE_HEADING), [on.sumRight.page, headings(on.sumRight)]);
  check('the facts of T90: the sentences said right on record are T53\'s and WB35 (T55 held it as it stands; T57 said it again); every other card was a correction; the layout line names them', JSON.stringify(on.saidRight) === JSON.stringify([WB32, WB35]) && on.sum.facts.includes(`chosen from these only (none of them a correction): ${JSON.stringify(WB32)}; ${JSON.stringify(WB35)}`), [on.saidRight, on.sum.facts.slice(0, 3000)]);
  check('with no sentence said right on record (WB32 and WB35 left off the board): the facts leave the group out and ask for kind words on what to improve and on their effort; the spoken line names no went-well group', on.saidRightNone.length === 0 && on.noRight.facts.includes(V2_SUMMARY_NO_WELL) && /for each group \(the grammar points, what to improve\)/.test(on.noRight.facts) && !/What went well<\/board>/.test(on.noRight.facts), on.noRight.facts.slice(0, 3000));
  check('the switch is default ON', on.flags.well === true);

  console.log('4  RETEST_SEVERAL_FIXES: the re-test of a card that fixed several errors (fix round 1, ruling)');
  check('T35 → the whole card: its original wrong forms are "negotiate customers" and "give best"', JSON.stringify(v2RetestWrongForms(T35, WHOLE35)) === JSON.stringify(['negotiate customers', 'give best']));
  check('"…negotiate with customers and give the best price." later (with right, the best right): passed', on.rt.wholeRight.outcome === 'passed', on.rt.wholeRight);
  check('one changed phrase used right ("talked with customers"), the other not used, no wrong form: passed', on.rt.oneRight.outcome === 'passed', on.rt.oneRight);
  check('"…and give best price." again: missed (an original wrong form back)', on.rt.again.outcome === 'missed', on.rt.again);
  check('a later correction of another slip ("gave best service" → "given the best service"): not scored', on.rt.other.outcome === null, on.rt.other);
  check('fix round 2 (I1): a right later sentence holding "i worked" ("I worked at a bank before that.", carded as said): not missed (not scored)', on.rt.bankRight.outcome === null, on.rt.bankRight);
  check('fix round 2 (I1): "i worked" back in a sentence that was corrected ("I worked at Nagoya for five years." → "I have worked…"): missed', on.rt.nagoyaAgain.outcome === 'missed', on.rt.nagoyaAgain);
  check('fix round 2 (M1): the target fell back to stress words (more than three changed); only function words ("in", "for"): a sentence holding them passes nothing', on.rt.stressFn.outcome === null, on.rt.stressFn);
  check('fix round 2 (M1): …with a content word among them ("have worked"): passes on it', on.rt.stressContent.outcome === 'passed', on.rt.stressContent);
  check('the switch is default ON', on.flags.several === true);

  console.log('each switch off alone (a child process per switch): as at ade52609 for that item');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC14_8L_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Probe;
  };
  const wellOn = (o: Probe) => !headings(o.sum).some((h) => h.text === V2_SUMMARY_WELL_HEADING);
  {
    const off = child('NOTE_ITEM_LINES');
    check('NOTE_ITEM_LINES off: the switch reads off (the canvas then titles the first line, as live); the others on', !off.flags.items && WHOLE.test(off.t36.system) && wellOn(off));
  }
  {
    const off = child('CORRECTED_CARD_WHOLE');
    check('CORRECTED_CARD_WHOLE off: no whole-sentence line in the system prompt; the others as on', !WHOLE.test(off.t36.system) && off.flags.items && wellOn(off), off.t36.system.slice(0, 200));
  }
  {
    const off = child('WELL_WITH_CARD');
    check('WELL_WITH_CARD off: "What went well" painted at once with nothing under it, as live; the facts as before (no list, no leave-out line)', off.sum.page[1] === `annotate: ${V2_SUMMARY_WELL_HEADING}` && off.sum.page[2] === `annotate: ${V2_SUMMARY_IMPROVE_HEADING}` && !off.sum.facts.includes('chosen from these only') && !off.noRight.facts.includes(V2_SUMMARY_NO_WELL) && WHOLE.test(off.t36.system), off.sum.page);
  }

  {
    const off = child('RETEST_SEVERAL_FIXES');
    check('RETEST_SEVERAL_FIXES off: as at ac244651 (every target phrase to pass; a correction of the same phrase misses): one phrase used, not scored; the other slip\'s correction of "the best": missed; the whole sentence: passed', off.rt.oneRight.outcome === null && off.rt.other.outcome === 'missed' && off.rt.wholeRight.outcome === 'passed' && off.flags.items && wellOn(off), off.rt);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
