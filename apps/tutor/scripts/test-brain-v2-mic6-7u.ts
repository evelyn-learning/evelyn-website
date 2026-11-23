/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7u: mic test 6 (embed-1795067373124), the summary and the level-check count. The session's plan
 * (gdi-work-projects-v1) and its real summary reply (T101, quoted in task-7u-investigation.md B; glosses shortened) and level check
 * (T4–T8, A). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic6-7u
 *
 *  1 CARD_AT_SENTENCE         each summary card is placed with its own sentence (the runtime's spoken line, or the one quoting it),
 *                             in the order written; the client's placement replayed on the turn's stream (board-timing.ts)
 *  2 SUMMARY_GROUPS           the summary page's order in the facts and the section; a fifth sentence card is refused; heading style
 *  3 CLOSE_CHECK              the check question asked on a question card and not answered, feedback then the invitation next turn,
 *                             silence, no time, end_lesson never refused for the check alone
 *  4 LEVEL_NO_NUMBER          the level check's facts say not to number its questions
 *  5 NUMBER_NOT_CORRECTION    "2" → "two" is no correction, and no 7q wrong signal
 *  a maths voice lesson and a text lesson unchanged; each switch off alone (a child process per switch): as at a52da3d9.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State, type V2ToolCall } from '../src/lib/tutor/v2/types';
import { SentenceStream } from '../src/lib/tutor/v2/sentences';
import { anchorSentenceIndex, inlineSentenceIndex, v2TimedItemIndex } from '../src/lib/tutor/v2/board-timing';
import { summariseBoardCall } from '../src/lib/tutor/v2/board';
import { v2PlanCheckQuestion } from '../src/lib/tutor/v2/close-check';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2IsCorrectionOf, v2SentenceCardsSection } from '../src/lib/tutor/v2/sentence-cards';
import { v2PracticePairs } from '../src/lib/tutor/v2/adaptive';
import { TUTOR_V2_CARD_AT_SENTENCE } from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC6_7U_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
/** A scripted model: each call gives the next reply (text, and tool calls when given). */
function scripted(replies: Array<{ text: string; tools?: Array<{ name: string; input: Record<string, unknown> }> }>) {
  const facts: string[] = []; const results: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string; content?: unknown }>) {
      if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
      if (b.type === 'tool_result') results.push(String(b.content));
    }
    const r = replies[Math.min(i, replies.length - 1)]!; i += 1;
    onText?.(r.text);
    const tools = (r.tools ?? []).map((t, k) => ({ type: 'tool_use', id: `tu_${i}_${k}`, name: t.name, input: t.input }));
    return msg([{ type: 'text', text: r.text }, ...tools], tools.length ? 'tool_use' : 'end_turn');
  };
  return { call, facts, results };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI, pronunciation: true };
const maths: V2Session = { studentName: 'Sam', subject: 'Maths', level: 'Grade 8', mode: 'voice', timeBoxMinutes: 20 };
const typedLang: V2Session = { ...lang, mode: 'text' };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
const PAGES: V2BoardPage[] = [{ title: '概要', items: [] }, { title: '仕事について', items: [card('j1', 'I work in sales.')] }, { title: '現在完了 (present perfect)', items: [card('p1', 'I have led my team for two years.')] }, { title: '過去形 (past simple)', items: [card('s1', 'I attended a robotics exhibition last year.')] }, { title: 'Conversation', items: [card('c1', 'As a senior manager, I told everyone to raise money.')] }];
const goals = Object.fromEntries(GDI.segments.slice(0, 6).map((s) => [s.id, { status: 'shown' as const, at: 0 }]));
const T99 = 'That finishes our conversation. Next is Pronunciation, which is optional. Shall we move on, or is there anything you would like to ask first?';
const atClose = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone(PAGES), current: 4 }, goals, history: [u('x'), a(T99)], ...extra });

// ── The session's summary reply (T101), as written ──
const T101 = `Great work today, let's quickly review what we practised. You talked about your job, your team and a project, using the present perfect and the past simple.
<board page>Summary</board>
<board note gloss="現在完了：今も続いていること">Present perfect: "have worked" for five years, from the past until now.</board>
<board note gloss="過去形：終わった出来事">Past simple: "attended" last year, a finished event at a specific time.</board>
One thing you did well was use the past simple with time words, such as "I attended a robotics exhibition last year." One thing to improve is the preposition after "work": you said "work on sales," and we say "work in sales."
<board sentence stress="have led">I have led my team for two years.</board>
<board sentence stress="attended">I attended a robotics exhibition last year.</board>
<board sentence stress="told">As a senior manager, I told everyone to raise money.</board>
The difference between "I have worked here for five years" and "I worked here five years ago" is this: the first means you still work there, and the second means you left in the past. Pronunciation is still open, so we can practise it next time.
Do you have any questions before we finish?
<board sentence stress="in sales" with="One thing to improve">I work in sales, not on sales.</board>
<board sentence stress="have worked" with="The difference between">I have worked here for five years.</board>
<board sentence with="The difference between">I worked here five years ago.</board>`;
// The summary as the new facts ask for it: grouped, in order, ending on the check question card.
const GROUPED = `Great work today, let's quickly review what we practised.
<board page>Summary</board>
<board note gloss="現在完了">Present perfect: "have worked", from the past until now.</board>
<board note gloss="過去形">Past simple: "attended", a finished time in the past.</board>
What went well: you used the past simple with time words.
<board note style="heading" gloss="よくできたこと">What went well</board>
<board sentence stress="attended">I attended a robotics exhibition last year.</board>
To improve: we say "work in sales".
<board note style="heading" gloss="改善点">To improve</board>
<board sentence stress="in">I work in sales.</board>
Before we finish, can you explain the difference between these two sentences?
<board problem gloss="二つの文の違いを説明してください。">Can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago.</board>`;
const CHECK_ANSWER = 'Uh, first one, I still work here. Second one, I don\'t work here now.';
const FEEDBACK = 'Yes, that\'s right: the first means you still work here, and the second is finished. Do you have any questions before we finish?';

/** The client's inline placement (TutorVoiceV2.tsx holdBoard / placeBoard), replayed on a turn's stream: the sentences as the voice
 *  gets them, and where each board item goes. `timedOn`: CARD_AT_SENTENCE as the client reads it. */
function replay(events: Array<{ t?: string; c?: V2ToolCall }>, timedOn: boolean) {
  const stream = new SentenceStream(); const sentences: string[] = [];
  const placed: Array<{ what: string; idx: number }> = [];
  let segStart = 0; let lastBlockAt = -1; let pageTurnAt = 0; let floor = 0; let floorIsLine = false;
  const paraStartAt = (n: number) => { let p = 0; for (const s of stream.paragraphStarts) if (s <= n && s > p) p = s; return p; };
  for (const e of events) {
    if (e.t !== undefined) { sentences.push(...stream.push(e.t)); continue; }
    const call = e.c!;
    if (/^not /.test(call.outcome)) continue;
    sentences.push(...stream.flush());
    const n = sentences.length; const page = call.name === 'new_page' || call.name === 'go_to_page';
    const timed = timedOn && call.timed && !page ? call.timed : undefined;
    let idx: number;
    if (call.sayWith) {
      idx = Math.max(anchorSentenceIndex(call.sayWith, sentences), pageTurnAt);
      if (timed) { idx = Math.max(idx, floor); if (idx > floor) floorIsLine = false; floor = idx; }
    } else {
      if (n !== lastBlockAt) { segStart = Math.max(0, lastBlockAt); lastBlockAt = n; }
      const from = call.name === 'show_problem' ? segStart : Math.max(segStart, Math.min(paraStartAt(Math.max(0, n - 1)), Math.max(0, n - 1)));
      const found = inlineSentenceIndex(call.name, summariseBoardCall(call.name, call.args), sentences, from);
      const at = timed ? v2TimedItemIndex({ name: call.name, timed, ...(typeof call.args.sentence === 'string' ? { text: call.args.sentence } : {}) }, sentences, found, floor, pageTurnAt, floorIsLine) : found;
      idx = Math.max(page ? 0 : pageTurnAt, at);
      if (timed) { const line = timed === 'next' && idx === n; if (idx > floor || line) floorIsLine = line; floor = Math.max(floor, idx); }
      if (call.name === 'new_page') pageTurnAt = idx;
    }
    placed.push({ what: typeof call.args.sentence === 'string' ? call.args.sentence : `${call.name}`, idx });
  }
  sentences.push(...stream.flush());
  return { sentences, placed };
}

async function turn(session: V2Session, state: V2State, said: string | null, replies: Array<{ text: string; tools?: Array<{ name: string; input: Record<string, unknown> }> }>, atMin: number, silence?: number) {
  const m = scripted(replies); const events: Array<{ t?: string; c?: V2ToolCall }> = [];
  const r = await runV2Turn({ session, state: structuredClone(state), studentSaid: said, callModel: m.call, onText: (t) => events.push({ t }), onToolCall: (c) => events.push({ c }), boardPass: false, mathsCheck: false, nowMs: atMin * MIN, ...(silence ? { facts: { silenceSeconds: silence } } : {}) });
  return { r, facts: m.facts.join('\n'), results: m.results, events };
}

async function probe() {
  // 1, 2: T101 at lesson 18.1 min (the wrap minute passed), after "Uh, yes, let's go."
  const live = await turn(lang, atClose(), 'Uh, yes, let\'s go.', [{ text: T101 }], 18.1);
  const liveReplay = replay(live.events, TUTOR_V2_CARD_AT_SENTENCE);
  const calls = live.r.toolCalls.map((c) => ({ name: c.name, outcome: c.outcome, timed: c.timed ?? null, sentence: typeof c.args.sentence === 'string' ? c.args.sentence : null }));
  // 3: the grouped summary ending on the check card; then their answer; a silence instead; no time; end_lesson.
  const asked = await turn(lang, atClose(), 'Uh, yes, let\'s go.', [{ text: GROUPED }], 18.1);
  const groupedReplay = replay(asked.events, TUTOR_V2_CARD_AT_SENTENCE);
  const answered = await turn(lang, asked.r.state, CHECK_ANSWER, [{ text: FEEDBACK }], 18.9);
  const silent = await turn(lang, asked.r.state, null, [{ text: 'Take your time. Think about whether you still work there.' }], 19.2, 20);
  const noTime = await turn(lang, atClose(), 'Uh, yes, let\'s go.', [{ text: T101 }], 22.8);
  const endInSummary = await turn(lang, atClose(), 'Uh, yes, let\'s go.', [{ text: 'Great work today. You used the present perfect well. Goodbye!', tools: [{ name: 'end_lesson', input: { summary: 'x' } }] }, { text: GROUPED.split('\n').slice(-2).join('\n') }], 18.1);
  const endAfterInvite = await turn(lang, answered.r.state, 'No, thank you.', [{ text: 'Thank you for today\'s lesson. See you next time!', tools: [{ name: 'end_lesson', input: { summary: 'x' } }] }], 19.4);
  const endStudentAsked = await turn(lang, asked.r.state, 'I have to go now, sorry.', [{ text: 'Of course. Thank you, goodbye!', tools: [{ name: 'end_lesson', input: { summary: 'x', because: 'student_asked' } }] }], 18.6);
  const begun = await turn(lang, atClose({ summaryBegunAt: 17.5 * MIN }), 'Okay.', [{ text: 'Do you have any questions before we finish?' }], 18.1);
  const reopenedT = await turn(lang, atClose({ summaryBegunAt: 17.5 * MIN, closeReopened: 18 * MIN }), 'Can we practise one more?', [{ text: 'Sure. Tell me about your team.' }], 18.3);
  const roundTrip = v2ReadClientState(JSON.parse(JSON.stringify(asked.r.state)));
  const roundTrip2 = v2ReadClientState(JSON.parse(JSON.stringify(answered.r.state)));
  // 4: the level check after T4 → T5 → T6 → T7 (the follow-up answered).
  const lvState: V2State = { ...newV2State(0), board: { pages: [{ title: '概要', items: [] }], current: 0 }, history: [u('x'), a('Hello Ken! Before we start, a few questions. Can you tell me a little about your job? What do you do?'), u('I sales manager Nagoya Corporation.'), a('Sales manager at Nagoya Corporation, that\'s great. What kind of products do you sell?')] };
  const level = await turn(lang, lvState, 'Uh, sell washing machine.', [{ text: 'Washing machines, I see. Have you ever worked with an international customer?' }], 1.1);
  // 5: "I have led uh my team for 2 years." carded as "…two years." in Present perfect; "My team has uh 7 uh people."
  const ppState: V2State = { ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone(PAGES.slice(0, 3)), current: 2 }, goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'demonstrated', at: 0 }, 'topic-intro': { status: 'shown', at: 0 } }, history: [u('x'), a('How long have you led your team?')] };
  const led = await turn(lang, ppState, 'I have led uh my team for 2 years.', [{ text: `That's right, and the form is correct. <board sentence stress="have led">I have led my team for two years.</board>\n\nWhat have you learned in that time?` }], 9.7);
  // Other lessons: a maths voice lesson and a typed language lesson.
  const mathsTurn = await turn(maths, { ...newV2State(0), history: [u('x'), a('What is 3 times 4?')] }, '12', [{ text: 'Yes, 12.\n<board note>3 × 4 = 12</board>\nNow try this one.\n<board problem>What is 6 × 7?</board>' }], 18.1);
  const typed = await turn(typedLang, atClose(), 'Uh, yes, let\'s go.', [{ text: T101 }], 18.1);
  return {
    calls, liveSentences: liveReplay.sentences, livePlaced: liveReplay.placed, liveFacts: live.facts, liveCheck: live.r.state.closeCheck ?? null,
    groupedSentences: groupedReplay.sentences, groupedPlaced: groupedReplay.placed, askedFacts: asked.facts, askedCheck: asked.r.state.closeCheck ?? null, askedInvited: asked.r.state.closeInvitedAt ?? null, askedSpoken: asked.r.spoken,
    answeredFacts: answered.facts, answeredCheck: answered.r.state.closeCheck ?? null, answeredInvited: answered.r.state.closeInvitedAt ?? null,
    silentFacts: silent.facts, silentCheck: silent.r.state.closeCheck ?? null, noTimeFacts: noTime.facts, noTimeCheck: noTime.r.state.closeCheck ?? null,
    begunFacts: begun.facts, reopenedFacts: reopenedT.facts,
    endInSummary: endInSummary.results, endInSummaryClosed: endInSummary.r.state.closed, endAfterInvite: endAfterInvite.r.state.closed, endStudentAsked: endStudentAsked.r.state.closed,
    roundTrip: roundTrip?.closeCheck ?? null, roundTrip2: roundTrip2?.closeCheck ?? null,
    levelFacts: level.facts, ledEvents: (led.r.events ?? []).map((e) => `${e.type} ${e.message}`), ledCorrected: led.r.state.correctedSentences ?? [],
    mathsFacts: mathsTurn.facts, mathsTimed: mathsTurn.r.toolCalls.filter((c) => c.timed).length, typedFacts: typed.facts, typedTimed: typed.r.toolCalls.filter((c) => c.timed).length,
    section: v2SentenceCardsSection(['en', 'ja'], true),
    correction: { led: v2IsCorrectionOf('I have led my team for two years.', 'I have led uh my team for 2 years.'), seven: v2IsCorrectionOf('My team has seven people.', 'My team has uh 7 uh people.'), real: v2IsCorrectionOf('I work in the home appliance division.', 'I work in sales on uh home appliance division'), third: v2IsCorrectionOf('It was my third visit to Tokyo.', 'It was my 3rd visit to Tokyo.'), twentyOne: v2IsCorrectionOf('I have twenty-one people in my team.', 'I have 21 people in my team.'), pairs: v2PracticePairs(['My team has uh 7 uh people.'], [{ sentence: 'My team has seven people.', stress: [] }]).map((p) => p.corrected) },
  };
}

async function main() {
  const on = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }
  const at = (list: Array<{ what: string; idx: number }>, what: string) => list.find((p) => p.what === what)?.idx ?? -1;
  const sentenceAt = (sentences: string[], text: string) => sentences.findIndex((s) => s.trim() === text);

  console.log('1  CARD_AT_SENTENCE: each card with its own sentence, in written order');
  const S = on.liveSentences; const P = on.livePlaced;
  const ledLine = sentenceAt(S, 'I have led my team for two years.'); const toldLine = sentenceAt(S, 'As a senior manager, I told everyone to raise money.');
  check('the runtime speaks the "have led" and "told" cards (as live: s5, s6)', ledLine >= 0 && toldLine === ledLine + 1, S);
  check('the cards the runtime speaks are sent marked "next"; the quoted one and the anchored ones "text"; pages unmarked (Task 8c: a runtime heading rides with its card\'s mark)', on.calls.filter((c) => c.timed === 'next' && c.sentence !== null).map((c) => c.sentence).join('|') === 'I have led my team for two years.|As a senior manager, I told everyone to raise money.' && on.calls.find((c) => c.sentence === 'I attended a robotics exhibition last year.')?.timed === 'text' && on.calls.find((c) => c.name === 'new_page')?.timed === null, on.calls);
  check('"I have led my team…" goes up as its own line is spoken (not with "One thing you did well…")', at(P, 'I have led my team for two years.') === ledLine, [P, S]);
  check('"I attended…" (quoted earlier, written after "have led") goes up no earlier than "have led"', at(P, 'I attended a robotics exhibition last year.') === ledLine);
  check('"As a senior manager, I told…" goes up as its own line is spoken', at(P, 'As a senior manager, I told everyone to raise money.') === toldLine);
  const order = P.filter((p) => p.what !== 'new_page').map((p) => p.idx);
  check('no item goes up before one the reply wrote earlier (the "work in sales" card anchored back to s4 waits)', order.every((x, i) => i === 0 || x >= order[i - 1]!) && at(P, 'I work in sales, not on sales.') >= toldLine, P);
  const G = on.groupedSentences; const GP = on.groupedPlaced;
  check('the grouped summary: each card with the words that say it, in order', GP.map((p) => p.idx).every((x, i, l) => i === 0 || x >= l[i - 1]!) && at(GP, 'I attended a robotics exhibition last year.') >= sentenceAt(G, 'What went well: you used the past simple with time words.') && at(GP, 'I work in sales.') >= sentenceAt(G, 'To improve: we say "work in sales".'), [GP, G]);
  check('the question card goes up where its question is said', at(GP, 'show_problem') === G.findIndex((s) => /can you explain the difference/i.test(s)), [GP, G]);

  console.log('2  SUMMARY_GROUPS: a labelled, grouped summary page');
  // Task 8l (WELL_WITH_CARD): this fixture's board holds no sentence of theirs said right, so (2) says to leave the went-well group out
  // (fix round 1, M6: pinned to that branch).
  check('the facts at the close give the order: rule notes, "What went well" + right sentences (8l: or the group left out when none is on record), "To improve" + one card per correction, at most 4', /summary page: lay the Summary page out in this order, and say it in the same order.*\(1\) the rule notes.*\(2\) nothing they said right is on record apart from their corrections, so leave this group out.*\(3\) a heading note <board note style="heading" gloss="…">To improve<\/board>.*never a card holding their mistake.*At most 4 sentence cards/.test(on.liveFacts), on.liveFacts.split('\n').filter((l) => /summary page/.test(l)));
  check('the section\'s summary line names the grouped page (not "up to 4 of their corrected sentences")', /lay it out in the order the facts give for the summary page \(what went well, then what to improve\), with at most 4 sentence cards in all/.test(on.section) && !/put up to 4 of their corrected sentences/.test(on.section));
  check('T101\'s fifth and sixth sentence cards on the summary page are refused (the runtime keeps at most 4)', on.calls.filter((c) => c.name === 'show_sentence' && !/^not /.test(c.outcome)).length === 4 && on.calls.filter((c) => /at most 4 sentence cards/.test(c.outcome)).length === 2, on.calls);
  const canvas = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'whiteboard', 'WhiteboardCanvas.tsx'), 'utf8');
  check('the board draws a heading note as a bold line with no box, under the switch', /if \(TUTOR_V2_SUMMARY_GROUPS && \(command\.style as string \| undefined\) === 'heading'\)/.test(canvas) && /text-xl font-bold/.test(canvas));

  console.log('3  CLOSE_CHECK: the check question is its own step');
  check('the plan\'s check question is read from its summary part', v2PlanCheckQuestion(GDI) === 'Before we finish, can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago. Take your time; I\'ll help you if you need it.', v2PlanCheckQuestion(GDI));
  check('summary turn: the facts say end on the check question card, no answer, no invitation; the 7d invitation line is not there', /closing check: there is time for the plan's check question.*ENDS on the check question, on a question card \(a <board problem> block.*does not give the answer/.test(on.askedFacts) && !/questions before the close: there is time for their questions, so the reply that gives the summary/.test(on.askedFacts));
  check('the reply ending on the check card records it asked, and no invitation', typeof on.askedCheck?.askedAt === 'number' && on.askedInvited === null && !/any questions before we finish/i.test(on.askedSpoken), [on.askedCheck, on.askedInvited]);
  check('T101 as live (ends on the invitation): nothing recorded for the check; the invitation stands', on.liveCheck === null);
  check('their answer: the facts say feedback, then the invitation; no ask line; then the invitation is recorded and the check answered', /closing check: your last reply asked the check question, and their words just now are their answer\. Give short feedback/.test(on.answeredFacts) && !/ENDS on the check question/.test(on.answeredFacts) && typeof on.answeredInvited === 'number' && typeof on.answeredCheck?.answeredAt === 'number', [on.answeredCheck, on.answeredInvited]);
  check('a silence after the check: 7r\'s line (a hint, never the answer), no invitation, no answer line; the check still waits', /they have not answered the question in hand yet.*Do not give the answer/.test(on.silentFacts) && !/questions before the close/.test(on.silentFacts) && !/their words just now are their answer/.test(on.silentFacts) && typeof on.silentCheck?.answeredAt !== 'number');
  check('no time (22.8 of 20 + 5): no check; the invitation as today', !/closing check/.test(on.noTimeFacts) && /questions before the close: there is time for their questions/.test(on.noTimeFacts) && on.noTimeCheck === null);
  check('no check once the summary began in an earlier reply, nor while the close is reopened (7k)', !/closing check/.test(on.begunFacts) && !/closing check/.test(on.reopenedFacts));
  check('an end_lesson in the summary reply is deferred as 7d defers it, with the check in place of the invitation', on.endInSummary.some((r) => /^not ended: there is time for the check question/.test(r)) && !on.endInSummaryClosed, on.endInSummary);
  check('end_lesson after the invitation is accepted; and when they ask to stop with the check unanswered, at once', on.endAfterInvite && on.endStudentAsked);
  check('the check state round-trips through the client\'s copy', typeof on.roundTrip?.askedAt === 'number' && typeof on.roundTrip2?.answeredAt === 'number');

  console.log('4  LEVEL_NO_NUMBER');
  check('the level check\'s facts say not to number the questions aloud; the count line stays', /level check: do not number its questions aloud: never "first \/ second \/ third \/ last question" or any number; say "next question" or nothing/.test(on.levelFacts) && /level check: \d of 3 questions asked and answered/.test(on.levelFacts), on.levelFacts.split('\n').filter((l) => /level check/.test(l)));

  console.log('5  NUMBER_NOT_CORRECTION');
  check('"2" → "two" and "7" → "seven" (fillers aside) are no corrections; "3rd" → "third", "21" → "twenty-one" neither', !on.correction.led && !on.correction.seven && !on.correction.third && !on.correction.twentyOne);
  check('a real correction still is one', on.correction.real);
  check('7q: "My team has uh 7 uh people." / "…seven people." is a right answer', on.correction.pairs.length === 1 && on.correction.pairs[0] === false);
  check('through runV2Turn: no wrong signal and no corrected sentence for "for 2 years"', !on.ledEvents.some((e) => /v2_practice_signal wrong/.test(e)) && !on.ledCorrected.length, [on.ledEvents, on.ledCorrected]);

  console.log('other lessons: nothing new');
  check('a maths voice lesson: no timed calls, no 7u facts', on.mathsTimed === 0 && !/summary page:|closing check|do not number/.test(on.mathsFacts));
  check('a typed language lesson: no timed calls, no 7u facts', on.typedTimed === 0 && !/summary page:|closing check|do not number/.test(on.typedFacts));

  console.log('each switch off alone (a child process per switch): as at a52da3d9 for that item');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC6_7U_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Awaited<ReturnType<typeof probe>>;
  };
  {
    const off = child('CARD_AT_SENTENCE');
    const ledOff = off.livePlaced.find((p) => p.what === 'I have led my team for two years.')?.idx ?? -1;
    check('CARD_AT_SENTENCE off: no timed calls; "have led" goes up a sentence early again (with the paragraph before it)', off.calls.every((c) => c.timed === null) && ledOff >= 0 && ledOff < sentenceAt(off.liveSentences, 'I have led my team for two years.'), off.livePlaced);
    check('CARD_AT_SENTENCE off: the other items unchanged', /summary page:/.test(off.liveFacts) && typeof off.askedCheck?.askedAt === 'number');
  }
  {
    const off = child('SUMMARY_GROUPS');
    check('SUMMARY_GROUPS off: no layout line, the old section line, all six cards painted', !/summary page:/.test(off.liveFacts) && /put up to 4 of their corrected sentences/.test(v2SentenceCardsSection(['en', 'ja'])) && off.calls.filter((c) => c.name === 'show_sentence' && !/^not /.test(c.outcome)).length === 6);
  }
  {
    const off = child('CLOSE_CHECK');
    check('CLOSE_CHECK off: the 7d invitation line on the summary turn, no check line or state, the 7d refusal', !/closing check/.test(off.askedFacts) && /questions before the close: there is time for their questions/.test(off.askedFacts) && off.askedCheck === null && off.endInSummary.some((r) => /^not ended: there is time for their questions/.test(r)));
  }
  {
    const off = child('LEVEL_NO_NUMBER');
    check('LEVEL_NO_NUMBER off: no line', !/do not number its questions/.test(off.levelFacts));
  }
  {
    const off = child('NUMBER_NOT_CORRECTION');
    check('NUMBER_NOT_CORRECTION off: "2" → "two" counts as a correction again (and the 7q pair as wrong)', off.correction.led && off.correction.seven && off.correction.pairs[0] === true);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
