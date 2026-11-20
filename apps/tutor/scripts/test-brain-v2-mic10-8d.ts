/// <reference types="node" />
/**
 * Tutor brain v2 — Task 8d: mic test 10 (embed-1795202398886), the close and the part asks: one summary, a yes over the ask moves on, the
 * armed sentence is said. The session's plan (gdi-work-projects-v1) and its real turns (task-8b-investigation.md A3, A5, A6, B). No
 * network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic10-8d
 *
 *  1 CLOSE_SUMMARY_ONCE  T89–T95: T91's invitation (a statement after the question) is recorded; at T92 no line asks for the summary, the
 *                        goodbye line is short, end_lesson is accepted; the invitation owed after the summary and the refusal carry no
 *                        summary clause; a lesson with no summary given still asks for it; a stop after the summary: goodbye now
 *  2 ANSWER_OVER_ASK     T52–T54: "Yes." over the part ask releases Conversation, no re-ask line; a question over the ask re-asks as
 *                        today; a yes over the lead (the ask not the playing sentence) as today; the invitation answered "no question"
 *                        over it is not owed again, another answer re-owes it
 *  3 PRON_TARGET_SAID    T82: the reply armed the sentence and only carded it: the runtime says it last
 *  each switch off alone (a child process per switch).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { trimToSpoken } from '../src/lib/tutor/v2/interrupted';
import { v2ReplySentences } from '../src/lib/tutor/v2/one-question';
import { stripBoardBlocks } from '../src/lib/tutor/v2/board-inline';
import { V2_CLOSE_INVITE_OWED_GIVEN_LINE, V2_CLOSE_INVITE_REFUSAL, V2_CLOSE_INVITE_REFUSAL_GIVEN, V2_CLOSE_INVITE_UNHEARD_LINE, V2_CLOSE_INVITED_GIVEN_LINE, V2_SUMMARY_GIVEN_STOP_LINE, v2InviteOfReply } from '../src/lib/tutor/v2/close-invite';
import { v2NoMoreAnswer, v2UnheardPartAsk } from '../src/lib/tutor/v2/part-flow';
import { v2StopAsked } from '../src/lib/tutor/v2/stop-signal';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC10_8D_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Reply = { text: string; tools?: Array<{ name: string; input: Record<string, unknown> }> };
function scripted(replies: Reply[]) {
  const facts: string[] = []; const results: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string; content?: unknown }>) {
      if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
      if (b.type === 'tool_result') results.push(String(b.content));
    }
    const r = replies[Math.min(i, replies.length - 1)]!; i += 1;
    if (r.text) onText?.(r.text);
    const tools = (r.tools ?? []).map((t, k) => ({ type: 'tool_use', id: `tu_${i}_${k}`, name: t.name, input: t.input }));
    return msg([...(r.text ? [{ type: 'text', text: r.text }] : []), ...tools], tools.length ? 'tool_use' : 'end_turn');
  };
  return { call, facts, results };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Praveen', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI, pronunciation: true };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
const ids = GDI.segments.map((s) => s.id);
const goalsThrough = (n: number) => Object.fromEntries(ids.slice(0, n).map((id) => [id, { status: 'shown' as const, at: 0 }]));
const END = { name: 'end_lesson', input: { summary: 'x' } };
const PAGES: V2BoardPage[] = [
  { title: 'Overview', items: [] }, { title: 'Your job', items: [card('j1', 'I sell washing machines to customers.')] },
  { title: 'Present perfect', items: [card('p1', 'I have worked at Nagoya Corporation for five years.')] },
  { title: 'Past simple', items: [card('s1', 'I worked as a receptionist for three years at Nagoya Corporation.')] },
];
const base = (extra: Partial<V2State>): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, timeFit: { dropped: [], byArrival: true }, ...extra });
async function turn(state: V2State, said: string | null, replies: Reply[], atMin: number) {
  const m = scripted(replies);
  const r = await runV2Turn({ session: lang, state: structuredClone(state), studentSaid: said, callModel: m.call, boardPass: false, mathsCheck: false, nowMs: atMin * MIN });
  return { r, facts: m.facts.join('\n'), results: m.results, ends: r.toolCalls.filter((c) => c.name === 'end_lesson').map((c) => c.outcome) };
}

// ── 1: the close, T89–T95 (the session's words) ──
const T89 = '<board page>Summary</board>\n今日は、仕事の話をたくさん練習しましたね。文法は二つでした。\n\n良かったところは、お客様への説明がよく伝わったことです。\n\n直すところは、期間と過去の時を表す言葉です。\n\nでは最後に、考えてみてください。Before we finish, can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago. Take your time; I\'ll help you if you need it.';
const T90 = 'Um, I have worked here for 5 years, means I still work here and I worked here 5 years ago, uh, means I do not.';
const T91 = 'その通りです。今も働いているのか、もう終わっているのかが、よく分かります。\n\n何か質問はありますか？なければ、ここで終わりにします。';
const T91_INVITE = '何か質問はありますか？';
const T92 = 'Uh, no question.';
const STOP = 'I have to finish now.';
const T93_CALL1 = 'Thank you, Praveen. Today you talked about your work, your customers and a project you are proud of, and you practised the present perfect and the past simple.';
const T95 = 'Thank you, Praveen. Good luck with your customers, and goodbye!';
const SUMMARY_PAGE: V2BoardPage = { title: 'Summary', items: [{ id: 'q1', tool: 'show_problem', summary: 'Before we finish, can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago.' }] };
const PRON_PAGE: V2BoardPage = { title: 'Pronunciation', items: [card('r1', 'I worked on a project to collect donations for a climate change project.')] };
const closePages = () => [...structuredClone(PAGES), { title: 'Conversation', items: [] }, structuredClone(PRON_PAGE), structuredClone(SUMMARY_PAGE)];
/** As T90's turn gets it: the Summary page up (T89), the check asked on its card. */
const atT90 = () => base({ board: { pages: closePages(), current: 6 }, goals: goalsThrough(7), partStart: { part: 'pronunciation', at: 15.2 * MIN }, summaryBegunAt: 17.9 * MIN, closeCheck: { askedAt: 17.9 * MIN },
  history: [u('x'), a('<board page>Pronunciation</board>\nScore 94.'), u('Uh, move on.'), a(T89)] });
/** A lesson at the same point where no summary was given (no Summary page, nothing recorded) and the check is done. */
const noSummary = () => base({ board: { pages: [...structuredClone(PAGES), { title: 'Conversation', items: [] }, structuredClone(PRON_PAGE)], current: 5 }, goals: goalsThrough(7), partStart: { part: 'pronunciation', at: 15.2 * MIN }, closeCheck: { askedAt: 17.9 * MIN, answeredAt: 18.6 * MIN },
  history: [u('x'), a('<board page>Pronunciation</board>\nScore 94. Would you like one more item, or shall we move on?'), u('Uh, move on.'), a('Good.')] });

// ── 2: the Past simple part, T50–T54 ──
const T50 = '惜しいです。「3 year」は「three years」と複数形にします。期間には「for」を使い、数字の後も複数形です。\n\nもう一度、この文を言ってみてください。';
const T51 = 'I worked as a receptionist for 3 years at Nagoya Corporation.';
const T52 = '正しく言えました。「for three years」が自然に言えています。過去の仕事の期間を英語で話せるようになりました。\n\nPast simple はここまでです。次は Conversation で、仕事について自由に話す練習です。質問がありますか？それとも、このまま進みますか？';
const T52_SENTENCES = v2ReplySentences(stripBoardBlocks(T52));
const T54 = '過去形の練習はここまでです。次は Conversation で、仕事について自由に話す練習です。質問がありますか？それとも、このまま進みますか？';
const atT51 = () => base({ board: { pages: structuredClone(PAGES), current: 3 }, goals: goalsThrough(4), partStart: { part: 'past-simple', at: 9 * MIN }, practiceSaid: { 'past-simple': 3 },
  history: [u('x'), a('<board page>Past simple</board>\nHow long did you work as a receptionist?'), u('Um, I worked as a receptionist 3 year.'), a(T50)] });
/** The close invitation of T91 cut as it began to play (its sentences 3–4 unheard). */
const T91_SENTENCES = v2ReplySentences(stripBoardBlocks(T91));

// ── 3: the Pronunciation part, T80–T83 ──
const T80 = '発音の練習を始めましょう。次の中から選んでください。You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue.';
const T82 = '3番ですね。では、前に言った文を自然なスピードで言ってみましょう。まず聞いてください。最後の文は英語だけです。';
const SENTENCE = 'I worked on a project to collect donations for a climate change project.';
const T82_CARD = `<board sentence>${SENTENCE}</board>`;
const atT81 = () => base({ board: { pages: [...structuredClone(PAGES), { title: 'Conversation', items: [] }, { title: 'Pronunciation', items: [] }], current: 5 }, goals: goalsThrough(6), partStart: { part: 'pronunciation', at: 18.3 * MIN },
  history: [u('x'), a('Next is Pronunciation, a short and optional practice. Would you like to try it, or do you have a question first?'), u('Yes, try.'), a(`<board page>Pronunciation</board>\n${T80}`)] });

async function main() {
  // ── 1 ──
  if (!CHILD) console.log('1  CLOSE_SUMMARY_ONCE: the summary is given once');
  const t91 = await turn(atT90(), T90, [{ text: T91 }], 18.6);
  const t92 = await turn(t91.r.state, T92, [{ text: T95, tools: [END] }], 18.9);
  // The live T92 state: the invitation not recorded (what the switch off gives at T91).
  const unrec = { ...structuredClone(t91.r.state) }; delete unrec.closeInvitedAt; delete unrec.closeAskLast;
  const t92u = await turn(unrec, T92, [{ text: T93_CALL1, tools: [END] }, { text: 'Before I finish, do you have any questions?' }], 18.9);
  const t92n = await turn(noSummary(), 'Okay.', [{ text: 'Thank you, goodbye!', tools: [END] }, { text: 'Do you have any questions before we finish?' }], 18.9);
  // Fix round 1 (M1): the Summary page opened with nothing on it: not "given"; the summary is still asked for.
  const bare = structuredClone(unrec); bare.board.pages = bare.board.pages.map((pg) => (pg.title === 'Summary' ? { ...pg, items: [] } : pg));
  const t92bare = await turn(bare, T92, [{ text: T93_CALL1, tools: [END] }, { text: 'Before I finish, do you have any questions?' }], 18.9);
  const stop = await turn(unrec, STOP, [{ text: T95, tools: [END] }], 18.9);
  const on = {
    t91: { invited: t91.r.state.closeInvitedAt, last: t91.r.state.closeAskLast?.last ?? null, answered: t91.r.state.closeCheck?.answeredAt },
    t92: { facts: t92.facts, ends: t92.ends, closed: t92.r.state.closed },
    t92u: { facts: t92u.facts, ends: t92u.ends, closed: t92u.r.state.closed, results: t92u.results },
    t92n: { facts: t92n.facts, ends: t92n.ends, closed: t92n.r.state.closed },
    stop: { facts: stop.facts, ends: stop.ends, closed: stop.r.state.closed },
    t92bare: { facts: t92bare.facts, ends: t92bare.ends },
    inviteOf: v2InviteOfReply(T91),
  };

  // ── 2 ──
  const t52 = await turn(atT51(), T51, [{ text: T52 }], 12.2);
  const overAsk = trimToSpoken(t52.r.state, T52_SENTENCES, 5, true); // cut as 「質問がありますか？」 began (the live record kept the sentences before it)
  const yes = await turn(overAsk, 'Yes.', [{ text: 'では、Conversation を始めましょう。What is one project you worked on that you are proud of?' }], 12.5);
  const q = await turn(overAsk, 'What is Conversation?', [{ text: T54 }], 12.5);
  const overLead = trimToSpoken(t52.r.state, T52_SENTENCES, 4, true); // cut as the lead 「次は Conversation で…」 began
  const yesLead = await turn(overLead, 'Yes.', [{ text: T54 }], 12.5);
  // The invitation (T91) cut as it began: "no question" answers it; "Sorry?" does not.
  const inviteCut = trimToSpoken(t91.r.state, T91_SENTENCES, 2, true);
  const noQ = await turn(inviteCut, T92, [{ text: T95, tools: [END] }], 18.9);
  const sorry = await turn(inviteCut, 'Sorry?', [{ text: T95, tools: [END] }, { text: 'Do you have any questions before we finish?' }], 18.9);
  // Fix round 1 (I1): an English held ask cut whole (they spoke over "Nice work."), then an explicit order: released as at 74014f96.
  const ENG_ASK = 'Nice work, that is the past simple done. Next is Conversation. Shall we move on to Conversation, or do you have a question first?';
  const engAsked = await turn(atT51(), T51, [{ text: ENG_ASK }], 12.2);
  const engCut = trimToSpoken(engAsked.r.state, v2ReplySentences(ENG_ASK), 0, true);
  const engGo = await turn(engCut, 'Okay, let\'s go to Conversation.', [{ text: 'Great. What is one project you are proud of?' }], 12.5);
  // Fix round 1 (I2): a recap lead 「Pronunciation で、…」 (not the next part) before a bare go-on ask: it pends and holds nothing of its own (the
  // go-on ask keeps its reading at 74014f96: the next part by plan order).
  const RECAP = 'よくできました。Pronunciation で、たくさん話せました。次に進みますか？';
  const recapAsked = await turn(atT51(), T51, [{ text: RECAP }], 12.2);
  const recapYes = await turn(recapAsked.r.state, 'Yes.', [{ text: 'では、続けましょう。' }], 12.5);
  const pages = (r: Awaited<ReturnType<typeof turn>>) => r.r.toolCalls.filter((c) => c.name === 'new_page' && !/^not /.test(c.outcome)).map((c) => String(c.args.title));
  Object.assign(on, {
    t52Unheard: overAsk.unheard, t52Held: t52.r.state.heldPage ?? null,
    yes: { pages: pages(yes), facts: yes.facts }, q: { pages: pages(q), facts: q.facts }, yesLead: { pages: pages(yesLead), facts: yesLead.facts, calls: yesLead.r.toolCalls.map((c) => `${c.name} ${c.id} ${c.outcome}`), unheard: overLead.unheard },
    noQ: { facts: noQ.facts, ends: noQ.ends, closed: noQ.r.state.closed, invited: noQ.r.state.closeInvitedAt }, sorry: { facts: sorry.facts, ends: sorry.ends, closed: sorry.r.state.closed },
    engHeld: engAsked.r.state.heldPage?.title ?? null, engUnheard0: engCut.unheard?.[0] ?? null, engGo: { pages: pages(engGo) },
    recap: { held: recapAsked.r.state.heldPage ?? null, pages: pages(recapYes) },
    overAskOf: v2UnheardPartAsk(GDI, overAsk, (overAsk.history[overAsk.history.length - 1]!.content as Array<{ type: string; text?: string }>).map((c) => c.text ?? '').join(' '), ['en', 'ja']),
  });

  // ── 3 ──
  const t82 = await turn(atT81(), 'Uh, 3.', [{ text: `${T82}${T82_CARD}`, tools: [{ name: 'practise_pronunciation', input: { items: [SENTENCE] } }] }, { text: '' }], 19.3);
  const t82said = await turn(atT81(), 'Uh, 3.', [{ text: `${T82} ${SENTENCE}`, tools: [{ name: 'practise_pronunciation', input: { items: [SENTENCE] } }] }, { text: '' }], 19.3);
  // Fix round 1 (I3): a retry arm (the facts ask them to say it once more, unmodelled): nothing added; a partly said item: nothing added.
  const retryState: V2State = { ...atT81(), pronunciation: { seq: 1, armed: { seq: 1, items: [SENTENCE], reference: SENTENCE, attempt: 1 }, heard: { seq: 1, status: 'cut' } } };
  const retry = await turn(retryState, SENTENCE, [{ text: 'もう一度言ってみてください。', tools: [{ name: 'practise_pronunciation', input: { items: [SENTENCE] } }] }, { text: '' }], 19.6);
  const PART = '3番ですね。Say: I worked on a project to collect donations.';
  const partly = await turn(atT81(), 'Uh, 3.', [{ text: PART, tools: [{ name: 'practise_pronunciation', input: { items: [SENTENCE] } }] }, { text: '' }], 19.3);
  Object.assign(on, {
    retry: { spoken: retry.r.spoken, attempt: retry.r.state.pronunciation?.armed?.attempt ?? null }, partly: { spoken: partly.r.spoken },
    t82: { spoken: t82.r.spoken, armed: t82.r.state.pronunciation?.armed?.reference ?? null, events: (t82.r.events ?? []).map((e) => e.type), stored: JSON.stringify(t82.r.state.history[t82.r.state.history.length - 1]) },
    t82said: { spoken: t82said.r.spoken },
  });

  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }
  type On = typeof on & Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const o = on as On;

  const SUMMARY_ASK = /the reply that gives the summary|If you have not given the summary|if you have not given the summary yet, give it/;
  check('v2InviteOfReply: T91\'s last question sentence is the invitation, the statement after it does not undo it', o.inviteOf === T91_INVITE, o.inviteOf);
  check('T91 (feedback + invitation + "なければ、ここで終わりにします。"): the check answered and the invitation recorded, its own sentence kept for 7z', typeof o.t91.answered === 'number' && o.t91.invited === 18.6 * MIN && o.t91.last === T91_INVITE, o.t91);
  check('T92 "Uh, no question.": the invited line with the short goodbye, nothing asks for the summary', o.t92.facts.includes(V2_CLOSE_INVITED_GIVEN_LINE) && /one or two sentences/.test(V2_CLOSE_INVITED_GIVEN_LINE) && !SUMMARY_ASK.test(o.t92.facts), o.t92.facts.split('\n').filter((l: string) => /questions before the close/.test(l)));
  check('…T92\'s end_lesson accepted: the lesson closes on the goodbye', o.t92.closed && o.t92.ends.length === 1 && !/^not /.test(o.t92.ends[0]), o.t92.ends);
  check('the invitation not recorded after the summary (the live T92): the owed line has no summary clause and the refusal never asks for it', o.t92u.facts.includes(V2_CLOSE_INVITE_OWED_GIVEN_LINE) && !SUMMARY_ASK.test(o.t92u.facts) && o.t92u.ends[0] === V2_CLOSE_INVITE_REFUSAL_GIVEN && !SUMMARY_ASK.test(o.t92u.results.join('\n')) && !o.t92u.closed, [o.t92u.ends, o.t92u.results]);
  check('a lesson where the summary was NOT given still asks for it (owed line and refusal as before)', /the reply that gives the summary/.test(o.t92n.facts) && o.t92n.ends[0] === V2_CLOSE_INVITE_REFUSAL && !o.t92n.closed, o.t92n.ends);
  check('fix round 1 (M1): the Summary page opened with nothing on it is not "given": the owed line and the refusal still ask for the summary', /the reply that gives the summary/.test(o.t92bare.facts) && o.t92bare.ends[0] === V2_CLOSE_INVITE_REFUSAL, o.t92bare.ends);
  check('a stop after the summary ("I have to finish now.", the invitation not recorded): the short goodbye in this reply, end_lesson accepted', v2StopAsked(STOP) && o.stop.facts.includes(V2_SUMMARY_GIVEN_STOP_LINE) && o.stop.closed && !SUMMARY_ASK.test(o.stop.facts), o.stop.ends);

  console.log('2  ANSWER_OVER_ASK: an answer over the ask');
  check('T52 cut as the ask began: the record keeps the announcement; the two ask sentences unheard', JSON.stringify(o.t52Unheard) === JSON.stringify(['質問がありますか？', 'それとも、このまま進みますか？']), o.t52Unheard);
  check('fix round 1 (I2): T52\'s own ask holds no page (the held-page record keeps the narrower reading, as live)', o.t52Held === null, o.t52Held);
  check('fix round 1 (I2): a recap lead 「Pronunciation で、たくさん話せました。」 before 「次に進みますか？」 pends and holds no Pronunciation page (the go-on ask as at 74014f96)', o.recap.held?.title !== 'Pronunciation' && !o.recap.pages.includes('Pronunciation'), o.recap);
  check('fix round 1 (I1): an English ask cut whole (first unheard "Nice work…"), then "Okay, let\'s go to Conversation.": the held page opens as at 74014f96', o.engHeld === 'Conversation' && /^Nice work/.test(o.engUnheard0 ?? '') && JSON.stringify(o.engGo.pages) === '["Conversation"]', [o.engHeld, o.engUnheard0, o.engGo]);
  check('v2UnheardPartAsk reads the reply as written and its ask from the first unheard sentence', !!o.overAskOf && o.overAskOf.ask.includes('質問がありますか？'), o.overAskOf);
  check('T53 "Yes." over the ask: the Conversation page opens as for a heard ask; no "not heard" line (no re-ask)', JSON.stringify(o.yes.pages) === '["Conversation"]' && !/not heard:/.test(o.yes.facts), [o.yes.pages, o.yes.facts.split('\n').filter((l: string) => /not heard/.test(l))]);
  check('a question over the ask ("What is Conversation?"): nothing opens, the ask is in the "not heard" line (as today)', o.q.pages.length === 0 && /not heard:.*質問がありますか？/.test(o.q.facts), o.q.pages);
  check('a yes over the lead (the ask not the playing sentence): nothing opens, re-asked as today', o.yesLead.pages.length === 0 && /not heard:.*次は Conversation/.test(o.yesLead.facts), [o.yesLead.calls, o.yesLead.unheard]);
  check('the invitation cut as it began, "Uh, no question.": answered, not owed again; no unheard line; the goodbye closes', v2NoMoreAnswer(T92) && o.noQ.invited === 18.6 * MIN && !o.noQ.facts.includes(V2_CLOSE_INVITE_UNHEARD_LINE) && !/not heard:/.test(o.noQ.facts) && o.noQ.closed, [o.noQ.ends, o.noQ.invited]);
  check('…"Sorry?" over it: owed again as before (the unheard line, end_lesson deferred)', o.sorry.facts.includes(V2_CLOSE_INVITE_UNHEARD_LINE) && !o.sorry.closed && /^not /.test(o.sorry.ends[0] ?? ''), o.sorry.ends);
  check('v2NoMoreAnswer: plain no / nothing more only', ['No.', 'Uh, no questions. Thank you.', 'Nothing.', '質問はありません。', 'No, thank you.'].every((x) => v2NoMoreAnswer(x)) && !['Yes.', 'No, can you explain again?', 'Sorry?', 'I have a question.'].some((x) => v2NoMoreAnswer(x)));

  console.log('3  PRON_TARGET_SAID: the armed sentence is said');
  check('T82 (lead-in + card only + practise_pronunciation, then an empty call): armed, and the reply ends on the sentence', o.t82.armed === SENTENCE && o.t82.spoken.trim().endsWith(SENTENCE) && o.t82.spoken.startsWith('3番ですね。') && o.t82.events.includes('pronunciation_target_said') && o.t82.stored.includes(SENTENCE), o.t82);
  check('fix round 1 (I3): a retry arm (attempt 2, "say it once more") gets nothing added', o.retry.attempt === 2 && o.retry.spoken.trim() === 'もう一度言ってみてください。', o.retry);
  check('fix round 1 (I3): an item partly said (8 of 13 words, over 60 %) gets nothing added', o.partly.spoken.trim() === PART, o.partly.spoken);
  check('…a reply that said the sentence itself gets nothing added (said once)', o.t82said.spoken.split(SENTENCE).length === 2, o.t82said.spoken);

  console.log('each switch off alone');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC10_8D_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} printed nothing`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as On;
  };
  const others = (off: On, but: string) => [
    but === 'CLOSE_SUMMARY_ONCE' || (off.t91.invited === o.t91.invited && off.t92.closed),
    but === 'ANSWER_OVER_ASK' || JSON.stringify(off.yes.pages) === '["Conversation"]',
    but === 'PRON_TARGET_SAID' || off.t82.spoken.trim().endsWith(SENTENCE),
  ].every(Boolean);
  {
    const off = child('CLOSE_SUMMARY_ONCE');
    check('CLOSE_SUMMARY_ONCE off: as live: T91 not recorded; the owed line and the refusal ask for the summary', off.t91.invited === undefined && /the reply that gives the summary/.test(off.t92u.facts) && off.t92u.ends[0] === V2_CLOSE_INVITE_REFUSAL && others(off, 'CLOSE_SUMMARY_ONCE'), [off.t91, off.t92u.ends]);
  }
  {
    const off = child('ANSWER_OVER_ASK');
    check('ANSWER_OVER_ASK off: the recap lead reads the same as on (deTopic never widens the held-page record)', JSON.stringify(off.recap) === JSON.stringify(o.recap), [off.recap, o.recap]);
    check('ANSWER_OVER_ASK off: as live: no page held at T52; "Yes." over the ask opens nothing and the ask is in the "not heard" line; the invitation re-owed', off.t52Held === null && off.yes.pages.length === 0 && /not heard:.*質問がありますか？/.test(off.yes.facts) && off.noQ.facts.includes(V2_CLOSE_INVITE_UNHEARD_LINE) && others(off, 'ANSWER_OVER_ASK'), off.yes.pages);
  }
  {
    const off = child('PRON_TARGET_SAID');
    check('PRON_TARGET_SAID off: as live: T82 armed and ends on 「最後の文は英語だけです。」, nothing said', off.t82.armed === SENTENCE && off.t82.spoken.trim().endsWith('最後の文は英語だけです。') && !off.t82.events.includes('pronunciation_target_said') && others(off, 'PRON_TARGET_SAID'), off.t82.spoken);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
