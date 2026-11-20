/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7w: mic test 7 (embed-1795100797999), the summary (marks on its cards, spoken, the check question and a clean
 * end) and the first page. The session's plan (gdi-work-projects-v1) and its real turns (task-7w-investigation.md A, D, E; transcript
 * T0, T69–T86): the summary reply at lesson 16.9 min with the wrap at 18 held to 19.3 for the optional Pronunciation part. No network,
 * no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic7-7w
 *
 *  1 SUMMARY_MARKS        the robot correction recorded with its changed words, drawn on the summary card (no stress written, and
 *                         wrong stress written); a corrected sentence refused under "What went well"; the facts' said → correct list
 *  2 SUMMARY_SPOKEN       the layout line says each group is said aloud before its cards
 *  3 SUMMARY_OPENS_CLOSE  the summary reply at 16.9: close open, check owed, end_lesson deferred (never the menu), the check, then the
 *                         invitation, then the close; the learner's stop ends at once; the hard stop; the skipped-check path
 *  4 OPENING_PAGE_TITLE   the opening fallback for a labelled plan (the overview's page, the title as heading, no objectives) vs a plan
 *                         without labels (byte-identical)
 *  5 OVERLONG_QUIET       no overlong warning where the part clock governs
 *  state round trip through readState; maths voice and typed lessons unchanged; each switch off alone (a child process per switch).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { v2CloseOpen } from '../src/lib/tutor/v2/time-box';
import { v2OverlongQuiet } from '../src/lib/tutor/v2/time-fit';
import { v2SummaryLayoutLine } from '../src/lib/tutor/v2/summary-layout';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC7_7W_CHILD;
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
    onText?.(r.text);
    const tools = (r.tools ?? []).map((t, k) => ({ type: 'tool_use', id: `tu_${i}_${k}`, name: t.name, input: t.input }));
    return msg([{ type: 'text', text: r.text }, ...tools], tools.length ? 'tool_use' : 'end_turn');
  };
  return { call, facts, results };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
// The plan as it would be without part names (no labels): the fallback as before.
const UNLABELLED = { ...structuredClone(GDI), segments: GDI.segments.map((s) => ({ ...structuredClone(s), metadata: { ...(s.metadata as Record<string, unknown>), label: undefined } })) } as LessonPlan;
const lang: V2Session = { studentName: 'Praveen', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI, pronunciation: true };
const maths: V2Session = { studentName: 'Sam', subject: 'Maths', level: 'Grade 8', mode: 'voice', timeBoxMinutes: 20 };
const typedLang: V2Session = { ...lang, mode: 'text' };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
const ids = GDI.segments.map((s) => s.id);

// ── The session's board and goals before the summary (investigation A, B) ──
const PAGES: V2BoardPage[] = [
  { title: 'Overview', items: [] }, { title: 'Your job', items: [card('j1', 'I sell washing machines to customers.')] },
  { title: 'Present perfect', items: [card('p1', 'I have learned good negotiation skills from my boss.')] },
  { title: 'Past simple', items: [card('s1', 'I attended the robotics competition last year.')] },
  { title: 'Conversation', items: [card('c1', 'I have worked on this project for one year.')] },
  { title: 'Pronunciation', items: [card('r1', 'responsibilities'), card('r2', 'international')] },
];
const doneGoals = Object.fromEntries(ids.slice(0, 6).map((id) => [id, { status: 'shown' as const, at: 0 }]));
// T84: the score and the second try armed (the arm is left out: the score line is not what is tested here).
const T84 = 'Your score is 87 out of 100. The stress is on the BIL part: re-spon-si-BIL-i-ties. Listen, then say it once more.\n\nresponsibilities';
// T78–T84 (transcript): the Conversation's last correction, the ask to go on (T80), the Pronunciation page opened on "Yes, pronunciation."
const HISTORY = [u('x'), a('That was the level check. Next is Your job. Shall we go on?'), u('Uh, yes, go on.'), a('<board page>Your job</board>\nWhat do you do?'), u('I sell washing machines.'),
  a('Next is Present perfect. Shall we go on?'), u('Hmm. Yes.'), a('<board page>Present perfect</board>\nHow long have you worked there?'), u('Three years.'),
  a('Next is Past simple. Shall we go on?'), u('Yes.'), a('<board page>Past simple</board>\nWhat did you do last year?'), u('I attended a competition.'),
  a('Shall we move on to the conversation part?'), u('Uh, continue.'), a('<board page>Conversation</board>\nTell me about a project you are proud of.'), u('The robots that interest me most is the dancing robot.'),
  a('The sentence on the board is the one to use: "The robot that interests me most is the dancing robot." The subject is one robot, so we use "is." Would you like a minute of pronunciation practice before the summary, or shall we go straight to the summary?'),
  u('Yes, pronunciation.'), a('<board page>Pronunciation</board>\nいいですね。まず一つの単語から練習しましょう。「Listen, then repeat after me.」\n\nresponsibilities'), u('responsibilities.'), a(T84)];
/** The state at T86 (lesson 16.9): Pronunciation entered, its goal unmarked. Fix round 1: with 7x's PART_FIRST_STEP on, the part taken is
 *  held (no summary lines) until 2 items and half its minutes; so here it has two items (responsibilities, international, as in
 *  embed-1795050656326) and was entered at 15.3 (live: 16.3, one item), which leaves the summary turn as live: the wrap held past 16.9,
 *  the close not open, the summary page's lines in the facts. */
const atSummary = (extra: Partial<V2State> = {}): V2State => ({
  ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone(PAGES), current: 5 }, goals: doneGoals,
  timeFit: { dropped: [], byArrival: true }, partStart: { part: 'pronunciation', at: 15.3 * MIN }, history: structuredClone(HISTORY), ...extra,
});

// ── T86 as live: the page and its nine blocks with nothing said for them, then "You worked hard today", and end_lesson ──
const T86 = `Your score on that was 95 out of 100, and the stress on BIL came through clearly. Responsibilities.
<board page>Summary</board>
<board note gloss="過去から今も続く">"have worked" + for + a period: I have worked for my current company for three years.</board>
<board note gloss="過去の決まった時">"attended" + a past time: I attended the robotics competition last year.</board>
<board note style="heading" gloss="よくできていました">What went well</board>
<board sentence gloss="期間を正しく言えました">I have worked on this project for one year.</board>
<board sentence gloss="過去形で話せました">I felt nice when people appreciated me.</board>
<board note style="heading" gloss="改善点">To improve</board>
<board sentence gloss="一つのロボット">The robot that interests me most is the dancing robot.</board>
<board sentence gloss="複数形">I have learned good negotiation skills from my boss.</board>
You worked hard today, Praveen.`;
const END = { name: 'end_lesson', input: { summary: 'x' } };
// After the deferral: the model ends on the check question card.
const CHECK_REPLY = `Before we finish, can you explain the difference between these two sentences?
<board problem>Can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago.</board>`;
const MENU = /something harder, more practice, a question of their own, or to stop here/;

async function turn(session: V2Session, state: V2State, said: string | null, replies: Reply[], atMin: number, silence?: number) {
  const m = scripted(replies); const heard: string[] = [];
  const r = await runV2Turn({ session, state: structuredClone(state), studentSaid: said, callModel: m.call, onText: (t) => heard.push(t), boardPass: false, mathsCheck: false, nowMs: atMin * MIN, ...(silence ? { facts: { silenceSeconds: silence } } : {}) });
  return { r, facts: m.facts.join('\n'), results: m.results, heard: heard.join('') };
}
const cardOf = (r: Awaited<ReturnType<typeof turn>>['r'], sentence: string) => r.toolCalls.find((c) => c.name === 'show_sentence' && c.args.sentence === sentence);

async function probe() {
  // 1: the corrections as made in the lesson (T69/T70 appreciated, T77/T78 robot, T29/T30 negotiation skills), through runV2Turn.
  const conv: V2State = { ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone(PAGES.slice(0, 5)), current: 4 }, goals: Object.fromEntries(ids.slice(0, 5).map((id) => [id, { status: 'shown' as const, at: 0 }])), timeFit: { dropped: [], byArrival: true } };
  const t70 = await turn(lang, { ...conv, history: [u('x'), a('How did you feel when people said that? Start with: I felt…')] }, 'I felt nice when people appreciate me.',
    [{ text: 'Good, you felt nice. One small thing: this story is about the past, so we say "appreciated." <board sentence stress="appreciated">I felt nice when people appreciated me.</board> Can you say the sentence once more?' }], 14.3);
  const t78 = await turn(lang, { ...t70.r.state, history: [...t70.r.state.history, u('x'), a('Which kind of robot interests you most? Start with: The robot that interests me most is…')] }, 'The robots that interest me most is the dancing robot.',
    [{ text: 'Not quite. Look at the subject: one robot, so "is." <board note>"the robot that interests me most": one robot, so "is," not "are."</board> <board sentence stress="robot | is">The robot that interests me most is the dancing robot.</board> Can you say the sentence once more?' }], 15.6);
  const pp: V2State = { ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: [{ title: 'Present perfect', items: [] }], current: 0 }, history: [u('x'), a('What have you learned from your boss? Start with: I have learned…')] };
  const t30 = await turn(lang, pp, 'I have learned, uh, good negotiation skill from my boss.', [{ text: 'Good. We say "skills," with an s. <board sentence stress="skills">I have learned good negotiation skills from my boss.</board> What else have you learned?' }], 6.1);
  const corrections = [...(t30.r.state.corrections ?? []), ...(t78.r.state.corrections ?? [])];
  const correctedSentences = [...(t30.r.state.correctedSentences ?? []), ...(t78.r.state.correctedSentences ?? [])];
  const base = atSummary({ corrections, correctedSentences });

  // 3: T86 at 16.9 ("responsibilities." is their second try), then the deferral and the check card in the same turn.
  const live = await turn(lang, base, 'responsibilities.', [{ text: T86, tools: [END] }, { text: CHECK_REPLY }], 16.9);
  // …the model's stress on a summary card: wrong words (not in the sentence) and right ones.
  const wrongStress = await turn(lang, base, 'responsibilities.', [{ text: T86.replace('<board sentence gloss="一つのロボット">', '<board sentence stress="are" gloss="一つのロボット">').replace('<board sentence gloss="複数形">', '<board sentence stress="skills | good" gloss="複数形">') }], 16.9);
  // Their answer to the check, then the close.
  const answered = await turn(lang, live.r.state, 'The first one, I still work there. The second one, I don\'t work there now.', [{ text: 'Yes, that\'s right: the first is still true now, the second is finished. Do you have any questions before we finish?' }], 17.5);
  const closed = await turn(lang, answered.r.state, 'No, thank you.', [{ text: 'Thank you for today\'s lesson, Praveen. See you next time!', tools: [END] }], 17.8);
  // The learner's stop in the summary turn ends at once; the hard stop (time up) too.
  const stop = await turn(lang, base, 'Sorry, I have to finish now.', [{ text: T86, tools: [END] }], 16.9);
  const hard = await turn(lang, base, 'responsibilities.', [{ text: T86, tools: [END] }], 24.8);
  // The skipped check: the summary reply ends on no check and no question (and no end_lesson); the next reply owes it, once.
  const skipped = await turn(lang, base, 'responsibilities.', [{ text: T86 }], 16.9);
  const lateAsked = await turn(lang, skipped.r.state, 'Thank you.', [{ text: CHECK_REPLY }], 17.3);
  const lateSkipped = await turn(lang, skipped.r.state, 'Thank you.', [{ text: 'You did well today.' }], 17.3);
  const afterLate = await turn(lang, lateSkipped.r.state, 'Okay.', [{ text: 'Do you have any questions before we finish?' }], 17.6);
  // The skipped check with an end_lesson whose deferral the model answers with nothing more: no runtime invitation in its place.
  const skippedEnd = await turn(lang, base, 'responsibilities.', [{ text: T86, tools: [END] }, { text: 'Thank you.' }], 16.9);
  // Fix round 1 (M4): the live in-lesson marks "robot | is" on the summary card: replaced (they miss "interests").
  const liveMarks = await turn(lang, base, 'responsibilities.', [{ text: T86.replace('<board sentence gloss="一つのロボット">', '<board sentence stress="robot | is" gloss="一つのロボット">') }], 16.9);
  // Fix round 1 (I1): the check step defers end_lesson once in total. (a) The summary reply's deferral, then a question other than the
  // check: the check is dropped; the next reply's end_lesson meets the invitation's deferral (the runtime's invitation), the one after
  // closes. (b) The skipped check owed late: its reply's end_lesson is the check's one deferral; nothing more after it ends on the check.
  const otherQ = await turn(lang, base, 'responsibilities.', [{ text: T86, tools: [END] }, { text: 'Would you like to try one more word?' }], 16.9);
  const otherQ2 = await turn(lang, otherQ.r.state, 'No, thank you.', [{ text: 'All right. See you next time!', tools: [END] }, { text: '' }], 17.2);
  const otherQ3 = await turn(lang, otherQ2.r.state, 'No questions.', [{ text: 'Thank you for today. Goodbye!', tools: [END] }], 17.5);
  const lateEnd = await turn(lang, skipped.r.state, 'Thank you.', [{ text: 'You\'re welcome. See you next time!', tools: [END] }, { text: 'Thanks.' }], 17.3);
  // Fix round 1 (I3): minute 8, "Next is Past simple. Shall we go on?" → "Yes." → the model writes a Summary page and ends.
  const early: V2State = { ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone(PAGES.slice(0, 3)), current: 2 }, goals: Object.fromEntries(ids.slice(0, 4).map((id) => [id, { status: 'shown' as const, at: 0 }])), timeFit: { dropped: [], byArrival: true }, practiceSaid: { 'present-perfect': 3 }, history: [...structuredClone(HISTORY).slice(0, 9), a('Next is Past simple. Shall we go on?')] };
  const earlySum = await turn(lang, early, 'Yes.', [{ text: 'Great work today. Before we finish, here is a quick summary. <board page>Summary</board><board note>You practised the present perfect.</board> You did well.', tools: [END] }, { text: 'Next is Past simple. Shall we go on?' }], 8);
  // Fix round 1 (M1): end_lesson in the reply's first call before any summary (required parts done, the close not open by the clock),
  // then the Summary page in its second call.
  const m1 = await turn(lang, base, 'responsibilities.', [{ text: 'Your score on that was 95 out of 100. You worked hard today, Praveen.', tools: [END] }, { text: `${T86.split('\n').slice(1).join('\n')}\nWould you like to try something harder, do more practice, ask me a question, or stop here?` }], 16.9);
  // Fix round 2 (N1): minute 14, every required part done, Pronunciation (optional) not yet offered, the close shut (wrap 18). The tutor
  // says "You worked hard today" and ends; then writes the Summary page. Then the pronunciation, and later the real summary.
  const m14State: V2State = { ...atSummary(), board: { pages: structuredClone(PAGES.slice(0, 5)), current: 4 }, partStart: { part: 'open-conversation', at: 9 * MIN }, history: structuredClone(HISTORY).slice(0, 13), corrections: base.corrections, correctedSentences: base.correctedSentences };
  const s14 = await turn(lang, m14State, 'I convinced people by writing emails.', [{ text: 'Good. You worked hard today, Ken.', tools: [END] }, { text: T86.split('\n').slice(1).join('\n') }], 14);
  const s14b = await turn(lang, s14.r.state, 'Yes, pronunciation.', [{ text: '<board page>Pronunciation</board>\nWould you like to practise your pronunciation? You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue.' }], 14.3);
  // …the pronunciation done (two items, its minutes), then the summary reply at 17.5 (end_lesson, then the check card).
  const s14cState: V2State = { ...s14b.r.state, board: { ...s14b.r.state.board, pages: s14b.r.state.board.pages.map((pg) => (pg.title === 'Pronunciation' ? { ...pg, items: [card('r1', 'responsibilities'), card('r2', 'international')] } : pg)) }, partStart: { part: 'pronunciation', at: 14.3 * MIN }, history: [...s14b.r.state.history, u('Individual words.'), a(T84)] };
  const s14c = await turn(lang, s14cState, 'responsibilities.', [{ text: T86, tools: [END] }, { text: CHECK_REPLY }], 17.5);
  const s14d = await turn(lang, s14c.r.state, 'The first one, I still work there.', [{ text: 'Yes, that\'s right. Do you have any questions before we finish?' }], 18.0);
  const s14e = await turn(lang, s14d.r.state, 'No, thank you.', [{ text: 'Thank you for today\'s lesson, Ken. See you next time!', tools: [END] }], 18.3);
  // N2: the close shut, no Summary page: two turns running the tutor ends; neither appends an invitation (none is owed before the summary).
  const n2a = await turn(lang, m14State, 'I convinced people by writing emails.', [{ text: 'Good. You worked hard today.', tools: [END] }, { text: 'What would you like to do now?' }], 14);
  const n2b = await turn(lang, n2a.r.state, 'Stop, maybe.', [{ text: 'All right.', tools: [END] }, { text: 'Is there anything else you would like to do?' }], 14.4);
  // Fix round 1 (M7): the pinned older suites' scenarios with every switch on. close-7d: every part reached (Pronunciation skipped), a
  // summary at 12 min; 6f / 7d: the next-time line of a summary begun at 12 goes on the reply that closes (the invitation is owed first).
  const B7d = ['Lesson overview', 'Your job', 'Present perfect', 'Past simple', 'Your project'];
  const goals7d = { overview: { status: 'shown' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 }, 'present-perfect': { status: 'demonstrated' as const, at: 0 }, 'past-simple': { status: 'demonstrated' as const, at: 0 }, 'open-conversation': { status: 'shown' as const, at: 0 }, pronunciation: { status: 'skipped' as const, at: 0 } };
  const s7d: V2State = { ...newV2State(0), board: { pages: B7d.map((title) => ({ title, items: [] })), current: B7d.length - 1 }, goals: goals7d, workingLevel: { level: 'intermediate', from: 'this_lesson' }, history: [u('x'), a('Try the whole sentence again, and say "was" clearly.')] };
  const ken: V2Session = { ...lang, studentName: 'Ken', wrapMinutes: undefined, pronunciation: undefined };
  const t60 = 'Good work today. Before we finish, here is a quick summary. <board page>Summary</board><board note>You practised the present perfect and the past simple.</board> You used "have worked" well.';
  const d1 = await turn(ken, s7d, 'My responsibility in sales area is contact for our client.', [{ text: t60 }], 12);
  const d2 = await turn(ken, d1.r.state, 'Uh, the first is still true now?', [{ text: 'Yes, that\'s right. Do you have any questions before we finish?' }], 12.5);
  const d3 = await turn(ken, d2.r.state, 'No, nothing else.', [{ text: 'All right. Thank you for today\'s lesson, Ken. See you next time!', tools: [END] }], 13);
  // The close is open once the summary has begun (time-box.ts), and the state round-trips through the route's readState.
  const read = v2ReadClientState(JSON.parse(JSON.stringify({ ...skipped.r.state })));
  const scoped = read ? v2ScopeCarried(structuredClone(read), lang) : null;

  // 4: the opening reply that painted nothing (T0), labelled plan vs a plan without labels; then the overview's own page.
  const T0 = 'Hello, I\'m Ryota. We\'ll talk about your job and a project you\'re proud of, and practise two grammar points: the present perfect and the past simple. Does that sound good to you?';
  const open = await turn(lang, newV2State(0), null, [{ text: T0 }], 0.2);
  const T2 = 'Great. <board page>Overview</board><board note>"present perfect": I have worked here for five years.\n"past simple": I attended an exhibition last year.</board> Are you ready?';
  const overview = await turn(lang, { ...open.r.state, history: [...open.r.state.history] }, 'Yes, sounds good.', [{ text: T2 }], 0.5);
  const overviewJa = await turn(lang, { ...open.r.state }, 'Yes, sounds good.', [{ text: T2.replace('<board page>Overview</board>', '<board page>概要</board>') }], 0.5);
  const openUnlabelled = await turn({ ...lang, plan: UNLABELLED }, newV2State(0), null, [{ text: T0 }], 0.2);
  const openMaths = await turn({ ...lang, languages: ['en'], pronunciation: false }, newV2State(0), null, [{ text: T0 }], 0.2);

  // Other lessons: a maths voice lesson, a typed language lesson.
  const mathsTurn = await turn(maths, { ...newV2State(0), history: [u('x'), a('What is 3 times 4?')] }, '12', [{ text: 'Yes, 12.\n<board note>3 × 4 = 12</board>\nNow try this one.\n<board problem>What is 6 × 7?</board>' }], 18.1);
  const typed = await turn(typedLang, { ...conv, history: [u('x'), a('Which kind of robot interests you most?')] }, 'The robots that interest me most is the dancing robot.', [{ text: 'We say: <board sentence stress="robot">The robot that interests me most is the dancing robot.</board>' }], 15.6);

  const calls = (r: Awaited<ReturnType<typeof turn>>['r']) => r.toolCalls.map((c) => ({ name: c.name, outcome: c.outcome, args: c.args }));
  return {
    t78: t78.r.state.corrections ?? null, t70: t70.r.state.corrections ?? null, t30: t30.r.state.corrections ?? null,
    liveFacts: live.facts, liveResults: live.results, liveSpoken: live.r.spoken, liveCalls: calls(live.r), liveState: { summaryBegunAt: live.r.state.summaryBegunAt ?? null, closeCheck: live.r.state.closeCheck ?? null, closeInvitedAt: live.r.state.closeInvitedAt ?? null, closed: live.r.state.closed, late: live.r.state.closeCheckLate ?? null },
    robotEmphasis: cardOf(live.r, 'The robot that interests me most is the dancing robot.')?.args.emphasis ?? null,
    skillsEmphasis: cardOf(live.r, 'I have learned good negotiation skills from my boss.')?.args.emphasis ?? null,
    wellCard: cardOf(live.r, 'I felt nice when people appreciated me.')?.outcome ?? null,
    // Task 8c fix round 1 (M4): the Summary page as painted (SUMMARY_HEADINGS on: the runtime's "To improve" before the correction).
    livePage: (() => { const st = live.r.state; const pg = st.board.pages.find((p) => p.title === 'Summary'); return pg ? pg.items.map((it) => it.summary) : []; })(),
    cleanCard: cardOf(live.r, 'I have worked on this project for one year.') ? { outcome: cardOf(live.r, 'I have worked on this project for one year.')!.outcome, emphasis: cardOf(live.r, 'I have worked on this project for one year.')!.args.emphasis ?? null } : null,
    wrongRobot: cardOf(wrongStress.r, 'The robot that interests me most is the dancing robot.')?.args.emphasis ?? null,
    wrongSkills: cardOf(wrongStress.r, 'I have learned good negotiation skills from my boss.')?.args.emphasis ?? null,
    liveMarks: cardOf(liveMarks.r, 'The robot that interests me most is the dancing robot.')?.args.emphasis ?? null,
    otherQ: { results: otherQ.results, check: otherQ.r.state.closeCheck ?? null, late: otherQ.r.state.closeCheckLate ?? null }, otherQ2: { results: otherQ2.results, spoken: otherQ2.r.spoken, invited: otherQ2.r.state.closeInvitedAt ?? null, closed: otherQ2.r.state.closed, facts: otherQ2.facts }, otherQ3: { results: otherQ3.results, closed: otherQ3.r.state.closed },
    lateEnd: { results: lateEnd.results, spoken: lateEnd.r.spoken, check: lateEnd.r.state.closeCheck ?? null, late: lateEnd.r.state.closeCheckLate ?? null, closed: lateEnd.r.state.closed },
    earlySum: { results: earlySum.results, pages: earlySum.r.state.board.pages.map((p) => p.title), begun: earlySum.r.state.summaryBegunAt ?? null, closed: earlySum.r.state.closed, spoken: earlySum.r.spoken, closeOpen: v2CloseOpen(lang, earlySum.r.state, 8.5 * MIN) },
    s14: { results: s14.results, pages: s14.r.state.board.pages.map((p) => p.title), begun: s14.r.state.summaryBegunAt ?? null, heard: s14.heard, spent: s14.r.state.closeCheckDeferredAt ?? null, facts: s14.facts },
    s14b: { pages: s14b.r.state.board.pages.map((p) => p.title), spent: s14b.r.state.closeCheckDeferredAt ?? null },
    s14c: { results: s14c.results, facts: s14c.facts, check: s14c.r.state.closeCheck ?? null, begun: s14c.r.state.summaryBegunAt ?? null, spent: s14c.r.state.closeCheckDeferredAt ?? null },
    s14d: { facts: s14d.facts, check: s14d.r.state.closeCheck ?? null, invited: s14d.r.state.closeInvitedAt ?? null }, s14e: { closed: s14e.r.state.closed, results: s14e.results },
    n2: { a: n2a.results, aSpoken: n2a.r.spoken, aInvited: n2a.r.state.closeInvitedAt ?? null, b: n2b.results, bSpoken: n2b.r.spoken, bInvited: n2b.r.state.closeInvitedAt ?? null },
    m1: { results: m1.results, begun: m1.r.state.summaryBegunAt ?? null, check: m1.r.state.closeCheck ?? null, closed: m1.r.state.closed, spoken: m1.r.spoken },
    d1: { spoken: d1.r.spoken, begun: d1.r.state.summaryBegunAt ?? null, check: d1.r.state.closeCheck ?? null, late: d1.r.state.closeCheckLate ?? null, facts: d1.facts }, d2: { invited: d2.r.state.closeInvitedAt ?? null, check: d2.r.state.closeCheck ?? null }, d3: { closed: d3.r.state.closed, spoken: d3.r.spoken, heard: d3.heard, results: d3.results }, d1heard: d1.heard,
    boardProblems: live.r.state.boardProblems ?? [],
    answeredFacts: answered.facts, answeredState: { closeCheck: answered.r.state.closeCheck ?? null, closeInvitedAt: answered.r.state.closeInvitedAt ?? null, closed: answered.r.state.closed },
    closedResults: closed.results, closedState: closed.r.state.closed,
    stopResults: stop.results, stopClosed: stop.r.state.closed, hardResults: hard.results, hardClosed: hard.r.state.closed,
    skipped: { late: skipped.r.state.closeCheckLate ?? null, check: skipped.r.state.closeCheck ?? null, invited: skipped.r.state.closeInvitedAt ?? null, spoken: skipped.r.spoken },
    lateAskedFacts: lateAsked.facts, lateAsked: { late: lateAsked.r.state.closeCheckLate ?? null, check: lateAsked.r.state.closeCheck ?? null },
    lateSkipped: { late: lateSkipped.r.state.closeCheckLate ?? null, check: lateSkipped.r.state.closeCheck ?? null }, afterLateFacts: afterLate.facts, afterLateInvited: afterLate.r.state.closeInvitedAt ?? null,
    skippedEnd: { results: skippedEnd.results, spoken: skippedEnd.r.spoken, late: skippedEnd.r.state.closeCheckLate ?? null, closed: skippedEnd.r.state.closed, check: skippedEnd.r.state.closeCheck ?? null, card: skippedEnd.r.toolCalls.filter((c) => c.name === 'show_problem' && /^painted/.test(c.outcome)).map((c) => String(c.args.statement ?? '')) },
    closeOpenAfter: v2CloseOpen(lang, skipped.r.state, 17.0 * MIN), closeOpenBefore: v2CloseOpen({ ...lang, wrapMinutes: 19.3 }, base, 16.9 * MIN),
    read: read ? { corrections: read.corrections ?? null, late: read.closeCheckLate ?? null, begun: read.summaryBegunAt ?? null } : null,
    scoped: scoped ? { corrections: scoped.corrections ?? null, late: scoped.closeCheckLate ?? null } : null,
    openCalls: calls(open.r), openPages: open.r.state.board.pages.map((p) => ({ title: p.title, n: p.items.length })),
    overviewPages: overview.r.state.board.pages.map((p) => ({ title: p.title, n: p.items.length })), overviewProblems: overview.r.state.boardProblems ?? [],
    overviewJaPages: overviewJa.r.state.board.pages.map((p) => ({ title: p.title, n: p.items.length })),
    openUnlabelledCalls: calls(openUnlabelled.r), openMathsCalls: calls(openMaths.r),
    layout: v2SummaryLayoutLine(lang, base, 'responsibilities.'),
    overlong: { v2: v2OverlongQuiet(true, { mode: 'voice', plan: GDI, timeBoxMinutes: 20 }), v1: v2OverlongQuiet(false, { mode: 'voice', plan: GDI, timeBoxMinutes: 20 }), text: v2OverlongQuiet(true, { mode: 'text', plan: GDI, timeBoxMinutes: 20 }), unlabelled: v2OverlongQuiet(true, { mode: 'voice', plan: UNLABELLED, timeBoxMinutes: 20 }), noBox: v2OverlongQuiet(true, { mode: 'voice', plan: GDI }) },
    mathsFacts: mathsTurn.facts, typedCorrections: typed.r.state.corrections ?? null, typedFacts: typed.facts,
  };
}

async function main() {
  const on = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }
  const result = (list: string[], re: RegExp) => list.some((x) => re.test(x));

  console.log('1  SUMMARY_MARKS: the corrections and their marks on the summary');
  check('T78: the robot correction recorded with what he said and its changed words ("robot", "interests"; the card marked "robot, is")', JSON.stringify(on.t78?.find((c) => /robot/.test(c.sentence))) === JSON.stringify({ said: 'The robots that interest me most is the dancing robot.', sentence: 'The robot that interests me most is the dancing robot.', stress: ['robot', 'interests'] }), on.t78);
  check('T70: "appreciate" → "appreciated" recorded; T30: "skill" → "skills"', on.t70?.[0]?.stress.join() === 'appreciated' && on.t30?.[0]?.stress.join() === 'skills' && on.t30?.[0]?.said === 'I have learned, uh, good negotiation skill from my boss.', [on.t70, on.t30]);
  check('T86: the robot card, written with no stress, is drawn with the correction\'s marks', JSON.stringify(on.robotEmphasis) === '["robot","interests"]', on.robotEmphasis);
  check('T86: the negotiation card likewise ("skills")', JSON.stringify(on.skillsEmphasis) === '["skills"]', on.skillsEmphasis);
  check('stress written with words not in the sentence ("are") is replaced by the correction\'s marks; words in it that hold the changed word ("skills | good") are kept', JSON.stringify(on.wrongRobot) === '["robot","interests"]' && JSON.stringify(on.wrongSkills) === '["skills","good"]', [on.wrongRobot, on.wrongSkills]);
  check('fix round 1 (M4): the live in-lesson marks "robot | is" miss a changed word ("interests"): replaced by the correction\'s', JSON.stringify(on.liveMarks) === '["robot","interests"]', on.liveMarks);
  // Task 8c fix round 1 (M4): with SUMMARY_HEADINGS (default on) the correction is placed, not refused: the runtime writes "To improve" before
  // it, and the model's own "To improve" heading after it is not painted (its group's heading is up). The refusal is checked with
  // SUMMARY_HEADINGS off below.
  const at = (x: string) => on.livePage.findIndex((y) => y === x);
  check('"I felt nice when people appreciated me." (a correction, written under the model\'s "What went well") is placed under the runtime\'s "To improve" heading, written right before it', /^painted/.test(on.wellCard ?? '') && at('To improve') >= 0 && at('To improve') === at('I felt nice when people appreciated me.') - 1 && at('What went well') < at('To improve') && on.livePage.filter((x) => x === 'To improve').length === 1, [on.wellCard, on.livePage]);
  check('…the model\'s own "To improve" heading is not painted (the reason reaches the next turn\'s facts); the sentence he said right first time stays under "What went well", with no marks added', on.boardProblems.some((x) => /"To improve" heading is on the summary page already/.test(x)) && /^painted/.test(on.cleanCard?.outcome ?? '') && on.cleanCard?.emphasis === null && at('I have worked on this project for one year.') < at('To improve'), [on.boardProblems, on.cleanCard, on.livePage]);
  check('the summary facts list the corrections as said → correct (changed: …), the "To improve" source, and the "What went well" rule', /their corrections in this lesson \(said → correct\): "I have learned, uh, good negotiation skill from my boss\." → "I have learned good negotiation skills from my boss\." \(changed: skills\); "I felt nice when people appreciate me\." → "I felt nice when people appreciated me\." \(changed: appreciated\); "The robots that interest me most is the dancing robot\." → "The robot that interests me most is the dancing robot\." \(changed: robot, interests\)\. The "To improve" cards come only from this list.*do not describe an error that is not in it\. A sentence in this list is never put under "What went well"/.test(on.liveFacts), on.liveFacts.split('\n').filter((l) => /corrections in this lesson/.test(l)));

  console.log('2  SUMMARY_SPOKEN: the summary is said aloud');
  check('the layout line says each group is said aloud, before its cards, never a page with nothing said', /Say the summary aloud as you write it: for each group \(the grammar points, what went well, what to improve\) one or two sentences of your own, said just before its cards; never a summary page with nothing said for it/.test(on.layout) && on.liveFacts.includes('Say the summary aloud as you write it'));

  console.log('3  SUMMARY_OPENS_CLOSE: the check question and the close follow the summary');
  check('before the reply (16.9, wrap held to 19.3, Pronunciation unmarked) the close is not open by the clock', on.closeOpenBefore === false);
  check('the facts at 16.9 carry the check line beside the summary page\'s layout line', /summary page: lay the Summary page out/.test(on.liveFacts) && /closing check: there is time for the plan's check question.*ENDS on the check question/.test(on.liveFacts));
  check('T86: the summary is marked begun in the reply that writes its page; its end_lesson is deferred for the check, never the menu', on.liveState.summaryBegunAt === 16.9 * MIN && result(on.liveResults, /^not ended: there is time for the check question/) && !result(on.liveResults, MENU) && !on.liveState.closed, on.liveResults);
  check('…the reply then ends on the check card: recorded asked, no invitation yet, nothing owed late', typeof on.liveState.closeCheck?.askedAt === 'number' && on.liveState.closeInvitedAt === null && on.liveState.late === null && on.liveCalls.some((c) => c.name === 'show_problem' && /^painted/.test(c.outcome)), on.liveState);
  check('the summary reply opened the close: from then the close is open', on.closeOpenAfter === true);
  check('their answer: feedback then the questions invitation (the answer line), recorded', /closing check: your last reply asked the check question, and their words just now are their answer/.test(on.answeredFacts) && typeof on.answeredState.closeCheck?.answeredAt === 'number' && typeof on.answeredState.closeInvitedAt === 'number' && !on.answeredState.closed, on.answeredState);
  check('then "No, thank you.": the end_lesson is accepted', on.closedState && !result(on.closedResults, /^not ended/), on.closedResults);
  check('the learner\'s stop in the summary turn ends the lesson at once', on.stopClosed && !result(on.stopResults, /^not ended/), on.stopResults);
  check('at the hard stop (24.8 of 20 + 5) the end_lesson is accepted (no check, no deferral)', on.hardClosed && !result(on.hardResults, /^not ended/), on.hardResults);
  check('the skipped check: a summary reply ending on no check and no question owes it on the next reply (closeCheckLate)', typeof on.skipped.late === 'number' && on.skipped.check === null && on.skipped.invited === null, on.skipped);
  check('…the next reply\'s facts carry the check line (not the invitation); its check card is recorded asked, the late mark used up', /closing check: there is time for the plan's check question/.test(on.lateAskedFacts) && !/questions before the close: there is time for their questions/.test(on.lateAskedFacts) && typeof on.lateAsked.check?.askedAt === 'number' && on.lateAsked.late === null, on.lateAsked);
  check('…skipped again: owed no more (once); the following turn has the invitation line, and its invitation is recorded', on.lateSkipped.late === null && on.lateSkipped.check === null && /questions before the close: (?:there is time for their questions|the summary has been given, so do not give it again or recap it\. There is time for their questions)/.test(on.afterLateFacts) && !/closing check: there is time/.test(on.afterLateFacts) && typeof on.afterLateInvited === 'number', [on.lateSkipped, on.afterLateInvited]);
  check('fix round 1 (I2): the deferred end_lesson answered with nothing more: the runtime asks the plan\'s check question (spoken once, on a Question card), counted as asked; nothing owed late', /Thank you\.\s+Before we finish, can you explain the difference between these two sentences\? I have worked here for five years\. I worked here five years ago\./.test(on.skippedEnd.spoken) && (on.skippedEnd.spoken.match(/can you explain the difference/g) ?? []).length === 1 && on.skippedEnd.card.length === 1 && /can you explain the difference/i.test(on.skippedEnd.card[0]!) && typeof on.skippedEnd.check?.askedAt === 'number' && on.skippedEnd.late === null && !on.skippedEnd.closed && !result(on.skippedEnd.results, MENU), on.skippedEnd);
  const DEFER_CHECK = /^not ended: there is time for the check question/; const DEFER_INVITE = /^not ended: there is time for their questions/;
  check('fix round 1 (I1): the summary reply\'s one check deferral; its reply ended on another question (the 7u rule reads it as asked)', on.otherQ.results.filter((x) => DEFER_CHECK.test(x)).length === 1 && on.otherQ.late === null, on.otherQ);
  check('…the next reply\'s end_lesson meets the invitation\'s one deferral (never the check\'s again), and the runtime\'s invitation ends it', on.otherQ2.results.length === 1 && DEFER_INVITE.test(on.otherQ2.results[0]!) && /Do you have any questions before we finish\?$/.test(on.otherQ2.spoken.trim()) && typeof on.otherQ2.invited === 'number' && !on.otherQ2.closed, on.otherQ2);
  check('…the one after closes: two deferrals in all, one per step', on.otherQ3.closed && !result(on.otherQ3.results, /^not ended/), on.otherQ3);
  check('fix round 1 (I1): the late check\'s reply: its end_lesson is the check step\'s one deferral, and with nothing more the runtime asks the check (asked; late used up)', on.lateEnd.results.filter((x) => DEFER_CHECK.test(x)).length === 1 && /can you explain the difference/.test(on.lateEnd.spoken) && typeof on.lateEnd.check?.askedAt === 'number' && on.lateEnd.late === null && !on.lateEnd.closed, on.lateEnd);
  check('fix round 1 (I3): a Summary page at minute 8 (Past simple, Conversation not reached) after "Yes." to "Next is Past simple": held (not shown), nothing begun, the close not open, the lesson not ended', !on.earlySum.pages.includes('Summary') && on.earlySum.begun === null && !on.earlySum.closeOpen && !on.earlySum.closed, on.earlySum);
  check('fix round 2 (M1 kept): end_lesson before the Summary page meets the refusal of its state before 7w (the menu, before any summary); the page then opens the close, the menu question after it is dropped, and the reply ends on the check', on.m1.results.length === 1 && MENU.test(on.m1.results[0]!) && on.m1.begun === 16.9 * MIN && typeof on.m1.check?.askedAt === 'number' && !/something harder/.test(on.m1.spoken) && /Take your time; I'll help you if you need it\.$/.test(on.m1.spoken.trim()) && !on.m1.closed, on.m1);
  const refusals = (xs: string[]) => xs.filter((x) => /^not ended/.test(x));
  check('fix round 2 (N1): minute 14: the early end_lesson gets the refusal it got before 7w (the menu); its Summary page is held and the runtime offers the pronunciation; nothing begun, no check deferral spent', on.s14.results.length === 1 && MENU.test(on.s14.results[0]!) && !on.s14.pages.includes('Summary') && on.s14.begun === null && on.s14.spent === null && /pronunciation/i.test(on.s14.heard), on.s14);
  check('…"Yes, pronunciation.": the reply opens the Pronunciation page (the runtime\'s offer holds no page); still nothing spent', on.s14b.pages.includes('Pronunciation') && on.s14b.spent === null, on.s14b);
  check('…the real summary at 17.5: the facts owe the check, the runtime refuses for the check (they agree), the check card is recorded, the deferral spent now', /closing check: there is time for the plan's check question/.test(on.s14c.facts) && on.s14c.results.length === 1 && /^not ended: there is time for the check question/.test(on.s14c.results[0]!) && typeof on.s14c.check?.askedAt === 'number' && typeof on.s14c.spent === 'number', on.s14c.results);
  check('…their answer: the answer line, then the invitation recorded; "No, thank you." closes. Refusals in the lesson: 2 (the menu, the check)', /their words just now are their answer/.test(on.s14d.facts) && typeof on.s14d.invited === 'number' && on.s14e.closed && refusals([...on.s14.results, ...on.s14c.results, ...on.s14e.results]).length === 2, [on.s14d.invited, on.s14e]);
  check('fix round 2 (N2): the close shut and no Summary page: no invitation appended or recorded, turn after turn (the refusals of the state before 7w)', !/any questions before we finish/i.test(on.n2.aSpoken + on.n2.bSpoken) && on.n2.aInvited === null && on.n2.bInvited === null && [...on.n2.a, ...on.n2.b].every((x) => !/there is time for their questions|check question/.test(x)), on.n2);
  check('fix round 2 (b): the appended check\'s Question card holds the question and its two sentences; the spoken line keeps the plan\'s whole wording', on.skippedEnd.card[0] === 'Before we finish, can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago.' && /Take your time; I'll help you if you need it\./.test(on.skippedEnd.spoken), on.skippedEnd.card);
  check('fix round 1 (M7, close-7d / 6f with every switch on): a summary at 12 min with every part reached opens the close; the next-time line is not said at its page', on.d1.begun === 12 * MIN && !/We didn't get to/.test(on.d1heard), on.d1heard);
  check('…the skipped check is owed late; the reply ending on the invitation records it; "No, nothing else." closes, and the next-time line comes on that closing reply, once', typeof on.d1.late === 'number' && typeof on.d2.invited === 'number' && on.d3.closed && (on.d3.heard.match(/We didn't get to the pronunciation part today, so that's for next time\./g) ?? []).length === 1, [on.d1.late, on.d2, on.d3]);

  console.log('4  OPENING_PAGE_TITLE: the first page');
  check('T0 painted nothing: the fallback opens the overview\'s page with the lesson\'s title as its heading, no objectives', JSON.stringify(on.openCalls.map((c) => [c.name, c.args.title ?? c.args.text, c.args.style ?? null])) === JSON.stringify([['new_page', 'Overview', null], ['annotate', 'Talking About Your Work and Recent Projects', 'heading']]), on.openCalls);
  check('page 1 has a title', on.openPages.length === 1 && on.openPages[0]!.title === 'Overview' && on.openPages[0]!.n === 1, on.openPages);
  check('T2: the overview\'s own page block stays on it (one page, its note under the title), nothing reported', JSON.stringify(on.overviewPages) === JSON.stringify([{ title: 'Overview', n: 2 }]) && !on.overviewProblems.length, [on.overviewPages, on.overviewProblems]);
  check('…also when the model names it in Japanese (「概要」)', JSON.stringify(on.overviewJaPages) === JSON.stringify([{ title: 'Overview', n: 2 }]), on.overviewJaPages);
  const OLD = 'Talking About Your Work and Recent Projects\nTalk about experience and achievements that started in the past and continue now: I have worked here for five years.';
  check('a plan without part names: the fallback as before (the title and the objectives, one highlight note)', on.openUnlabelledCalls.length === 1 && on.openUnlabelledCalls[0]!.name === 'annotate' && on.openUnlabelledCalls[0]!.args.style === 'highlight' && String(on.openUnlabelledCalls[0]!.args.text).startsWith(OLD), on.openUnlabelledCalls);
  check('a lesson that teaches no language (the same plan): the fallback as before', on.openMathsCalls.length === 1 && on.openMathsCalls[0]!.args.style === 'highlight' && String(on.openMathsCalls[0]!.args.text).startsWith(OLD), on.openMathsCalls);

  console.log('5  OVERLONG_QUIET');
  check('no overlong warning where the part clock governs (spoken, timed v2 lesson with a labelled plan); v1, typed, unlabelled, unboxed as before', on.overlong.v2 && !on.overlong.v1 && !on.overlong.text && !on.overlong.unlabelled && !on.overlong.noBox, on.overlong);
  const session = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'session', 'TutorSession.tsx'), 'utf8');
  check('TutorSession skips the segment_overlong event through v2OverlongQuiet', /if \(v2OverlongQuiet\(brainVersion === 'v2'[^\n]*\)\) return;\n\s*const within = tutorTurns - st\.baseline;/.test(session));

  console.log('state round trip (readState, then the route\'s scope)');
  check('corrections, closeCheckLate and summaryBegunAt survive JSON → v2ReadClientState → v2ScopeCarried', JSON.stringify(on.read?.corrections) === JSON.stringify(on.scoped?.corrections) && (on.scoped?.corrections?.length ?? 0) === 3 && typeof on.scoped?.late === 'number' && typeof on.read?.begun === 'number', [on.read, on.scoped]);

  console.log('other lessons: nothing new');
  check('a maths voice lesson: no 7w lines', !/corrections in this lesson|Say the summary aloud|closing check/.test(on.mathsFacts));
  check('a typed language lesson: no corrections recorded, no 7w lines', on.typedCorrections === null && !/corrections in this lesson|Say the summary aloud/.test(on.typedFacts));

  console.log('each switch off alone (a child process per switch): as at 165552cc for that item');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC7_7W_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Awaited<ReturnType<typeof probe>>;
  };
  {
    const off = child('SUMMARY_MARKS');
    check('SUMMARY_MARKS off: nothing recorded, the summary cards as written (no marks, the corrected one painted under "What went well"), no list', off.t78 === null && off.robotEmphasis === null && /^painted/.test(off.wellCard ?? '') && !/corrections in this lesson/.test(off.liveFacts), [off.t78, off.robotEmphasis, off.wellCard]);
    check('SUMMARY_MARKS off: the other items unchanged', off.liveState.summaryBegunAt === 16.9 * MIN && typeof off.liveState.closeCheck?.askedAt === 'number' && off.layout.includes('Say the summary aloud'));
  }
  {
    // Task 8c fix round 1 (M4): the 7w refusal itself, with the runtime's headings off (as at 57c71382).
    const off = child('SUMMARY_HEADINGS');
    check('SUMMARY_HEADINGS off: "I felt nice when people appreciated me." is refused under the model\'s "What went well"; the reason reaches the next turn\'s facts; the right sentence stays, no marks', /^not painted: this sentence is one of their corrections, so it goes under "To improve"/.test(off.wellCard ?? '') && off.boardProblems.some((x) => /one of their corrections/.test(x)) && /^painted/.test(off.cleanCard?.outcome ?? '') && off.cleanCard?.emphasis === null, [off.wellCard, off.boardProblems]);
  }
  {
    const off = child('SUMMARY_SPOKEN');
    check('SUMMARY_SPOKEN off: the layout line as before', !off.layout.includes('Say the summary aloud') && /At most 4 sentence cards on the page in all$/.test(off.layout));
  }
  {
    const off = child('SUMMARY_OPENS_CLOSE');
    check('SUMMARY_OPENS_CLOSE off: as live at 16.9: no check line, the end_lesson answered with the generic menu, no check asked', !/closing check/.test(off.liveFacts) && result(off.liveResults, MENU) && off.liveState.closeCheck === null, off.liveResults);
    check('SUMMARY_OPENS_CLOSE off: the close not open after the summary began by the clock alone; nothing owed late', off.closeOpenAfter === false && off.skipped.late === null);
    check('SUMMARY_OPENS_CLOSE off: the other items unchanged', JSON.stringify(off.robotEmphasis) === '["robot","interests"]' && off.openCalls[0]?.name === 'new_page');
  }
  {
    const off = child('OPENING_PAGE_TITLE');
    check('OPENING_PAGE_TITLE off: the old fallback (title and objectives, untitled page 1)', off.openCalls.length === 1 && off.openCalls[0]!.args.style === 'highlight' && String(off.openCalls[0]!.args.text).startsWith(OLD) && off.openPages[0]?.title === 'Page 1', off.openCalls);
  }
  {
    const off = child('OVERLONG_QUIET');
    check('OVERLONG_QUIET off: the warning as before', off.overlong.v2 === false);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
