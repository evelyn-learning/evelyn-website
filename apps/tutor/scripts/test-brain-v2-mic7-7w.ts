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
  { title: 'Pronunciation', items: [card('r1', 'responsibilities')] },
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
/** The state at T86 (lesson 16.9): Pronunciation entered at 16.3 (its page opened on "Yes, pronunciation."), its goal unmarked. */
const atSummary = (extra: Partial<V2State> = {}): V2State => ({
  ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone(PAGES), current: 5 }, goals: doneGoals,
  timeFit: { dropped: [], byArrival: true }, partStart: { part: 'pronunciation', at: 16.3 * MIN }, history: structuredClone(HISTORY), ...extra,
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
  const m = scripted(replies);
  const r = await runV2Turn({ session, state: structuredClone(state), studentSaid: said, callModel: m.call, boardPass: false, mathsCheck: false, nowMs: atMin * MIN, ...(silence ? { facts: { silenceSeconds: silence } } : {}) });
  return { r, facts: m.facts.join('\n'), results: m.results };
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
  const wrongStress = await turn(lang, base, 'responsibilities.', [{ text: T86.replace('<board sentence gloss="一つのロボット">', '<board sentence stress="are" gloss="一つのロボット">').replace('<board sentence gloss="複数形">', '<board sentence stress="good" gloss="複数形">') }], 16.9);
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
    cleanCard: cardOf(live.r, 'I have worked on this project for one year.') ? { outcome: cardOf(live.r, 'I have worked on this project for one year.')!.outcome, emphasis: cardOf(live.r, 'I have worked on this project for one year.')!.args.emphasis ?? null } : null,
    wrongRobot: cardOf(wrongStress.r, 'The robot that interests me most is the dancing robot.')?.args.emphasis ?? null,
    wrongSkills: cardOf(wrongStress.r, 'I have learned good negotiation skills from my boss.')?.args.emphasis ?? null,
    boardProblems: live.r.state.boardProblems ?? [],
    answeredFacts: answered.facts, answeredState: { closeCheck: answered.r.state.closeCheck ?? null, closeInvitedAt: answered.r.state.closeInvitedAt ?? null, closed: answered.r.state.closed },
    closedResults: closed.results, closedState: closed.r.state.closed,
    stopResults: stop.results, stopClosed: stop.r.state.closed, hardResults: hard.results, hardClosed: hard.r.state.closed,
    skipped: { late: skipped.r.state.closeCheckLate ?? null, check: skipped.r.state.closeCheck ?? null, invited: skipped.r.state.closeInvitedAt ?? null, spoken: skipped.r.spoken },
    lateAskedFacts: lateAsked.facts, lateAsked: { late: lateAsked.r.state.closeCheckLate ?? null, check: lateAsked.r.state.closeCheck ?? null },
    lateSkipped: { late: lateSkipped.r.state.closeCheckLate ?? null, check: lateSkipped.r.state.closeCheck ?? null }, afterLateFacts: afterLate.facts, afterLateInvited: afterLate.r.state.closeInvitedAt ?? null,
    skippedEnd: { results: skippedEnd.results, spoken: skippedEnd.r.spoken, late: skippedEnd.r.state.closeCheckLate ?? null, closed: skippedEnd.r.state.closed },
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
  check('stress written with words not in the sentence ("are") is replaced by the correction\'s marks; words in it ("good") are kept', JSON.stringify(on.wrongRobot) === '["robot","interests"]' && JSON.stringify(on.wrongSkills) === '["good"]', [on.wrongRobot, on.wrongSkills]);
  check('"I felt nice when people appreciated me." (a correction) is refused under "What went well"', /^not painted: this sentence is one of their corrections, so it goes under "To improve"/.test(on.wellCard ?? ''), on.wellCard);
  check('…and the reason reaches the next turn\'s facts; the sentence he said right first time stays, with no marks added', on.boardProblems.some((x) => /one of their corrections/.test(x)) && /^painted/.test(on.cleanCard?.outcome ?? '') && on.cleanCard?.emphasis === null, [on.boardProblems, on.cleanCard]);
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
  check('…skipped again: owed no more (once); the following turn has the invitation line, and its invitation is recorded', on.lateSkipped.late === null && on.lateSkipped.check === null && /questions before the close: there is time for their questions/.test(on.afterLateFacts) && !/closing check: there is time/.test(on.afterLateFacts) && typeof on.afterLateInvited === 'number', [on.lateSkipped, on.afterLateInvited]);
  check('the deferred end_lesson answered with nothing more: no runtime invitation pre-empts the check; it is owed on the next reply', !/any questions before we finish/i.test(on.skippedEnd.spoken) && typeof on.skippedEnd.late === 'number' && !on.skippedEnd.closed && !result(on.skippedEnd.results, MENU), on.skippedEnd);

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
