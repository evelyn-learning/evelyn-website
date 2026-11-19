/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7x: mic test 7 (embed-1795100797999), the middle of the lesson: the optional pronunciation part, the conversation
 * part, repeat-then-wait, and re-tests that get asked. The session's plan (gdi-work-projects-v1) and its real turns and minutes
 * (task-7w-investigation.md B, C, E, F). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic7-7x
 *
 *  1 PART_FIRST_STEP      "Yes, pronunciation." at 16.3: the opening facts carry the plan's own question (its four choices); at 16.9 after
 *                         one word tried twice the part is held (no summary-page lines, no "summary may begin"); left on his word; after
 *                         two items and half its minutes not held
 *  2 FREE_CONVERSATION    no starter line in the conversation unless he was silent or asked for help; the third correction not made
 *                         aloud but recorded; the invitation to ask the tutor once at half time, not after it happened
 *  3 REPEAT_THEN_WAIT     a correction that asks for the repeat ends the reply (T44 with a repeat ask: no next question, no question
 *                         card); without a repeat ask the next question stays (T44 as live)
 *  4 RETEST_ASKED         the retest line is the next question's instruction, beside the support step; sent 3 turns; open until the
 *                         part ends; the late "washing machines to customers" (T33) = passed
 *  5 (finding only)       the orphan question card at 09:09: no runtime rule (see the report)
 *  maths voice and typed lessons unchanged; each switch off alone (a child process per switch).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Retest, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { v2AsksRepeat } from '../src/lib/tutor/v2/one-question';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC7_7X_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Reply = { text: string; tools?: Array<{ name: string; input: Record<string, unknown> }> };
function scripted(replies: Reply[]) {
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
const lang: V2Session = { studentName: 'Praveen', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI, pronunciation: true };
const maths: V2Session = { studentName: 'Sam', subject: 'Maths', level: 'Grade 8', mode: 'voice', timeBoxMinutes: 20 };
const typedLang: V2Session = { ...lang, mode: 'text' };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
const ids = GDI.segments.map((s) => s.id);
const goalsThrough = (n: number) => Object.fromEntries(ids.slice(0, n).map((id) => [id, { status: 'shown' as const, at: 0 }]));
const PLAN_Q = 'Would you like to practice your pronunciation? You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue.';

const PAGES: V2BoardPage[] = [
  { title: 'Overview', items: [] }, { title: 'Your job', items: [card('j1', 'I sell washing machines to customers.')] },
  { title: 'Present perfect', items: [card('p1', 'I have learned good negotiation skills from my boss.')] },
  { title: 'Past simple', items: [card('s1', 'I attended the robotics competition last year.')] },
  { title: 'Conversation', items: [card('c1', 'I have worked on this project for one year.')] },
];
const base = (extra: Partial<V2State>): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, timeFit: { dropped: [], byArrival: true }, ...extra });

async function turn(session: V2Session, state: V2State, said: string | null, replies: Reply[], atMin: number, silence?: number) {
  const m = scripted(replies);
  const r = await runV2Turn({ session, state: structuredClone(state), studentSaid: said, callModel: m.call, boardPass: false, mathsCheck: false, nowMs: atMin * MIN, ...(silence ? { facts: { silenceSeconds: silence } } : {}) });
  return { r, facts: m.facts.join('\n') };
}

// ── 1: the Conversation's T80 offer, "Yes, pronunciation." at 16.3 (investigation C) ──
const T80 = 'The sentence on the board is the one to use: "The robot that interests me most is the dancing robot." Would you like a minute of pronunciation practice before the summary, or shall we go straight to the summary?';
const atOffer = () => base({ board: { pages: structuredClone(PAGES), current: 4 }, goals: goalsThrough(5), partStart: { part: 'open-conversation', at: 10.61 * MIN },
  history: [u('x'), a('<board page>Conversation</board>\nTell me about a project you are proud of.'), u('The robots that interest me most is the dancing robot.'), a(T80)] });
const T82_LIVE = 'いいですね。まず一つの単語から練習しましょう。「Listen, then repeat after me.」\n\nresponsibilities';
const T82_MENU = `いいですね。発音の練習です。${PLAN_Q}`;
/** T86's moment (16.9): the Pronunciation page holds the one word, tried twice. `cards`: the items carded on its page. */
const inPron = (cards: string[], extra: Partial<V2State> = {}) => base({
  board: { pages: [...structuredClone(PAGES), { title: 'Pronunciation', items: cards.map((c, i) => card(`r${i}`, c)) }], current: 5 }, goals: goalsThrough(5),
  partStart: { part: 'pronunciation', at: 16.3 * MIN },
  history: [u('x'), a(T80), u('Yes, pronunciation.'), a(`<board page>Pronunciation</board>\n${T82_LIVE}`), u('responsibilities.'), a('Your score is 87 out of 100. The stress is on the BIL part. Say it once more.\n\nresponsibilities')], ...extra });
const SCORE_REPLY = 'Your score on that was 95 out of 100, and the stress on BIL came through clearly. Would you like one more word, or shall we go to the summary?';

// ── 2: the Conversation part (investigation B): entered at 10.61, starter step, corrections ──
const inConv = (extra: Partial<V2State> = {}, lastAsk = 'Which kind of robot interests you most?') => base({
  board: { pages: structuredClone(PAGES), current: 4 }, goals: goalsThrough(4), partStart: { part: 'open-conversation', at: 10.61 * MIN },
  support: { step: 'starter', wrong: 0, clean: 0, part: 'open-conversation' }, history: [u('x'), a('<board page>Conversation</board>\nTell me about a project you are proud of.'), u('I work on a project to donate money.'), a(lastAsk)], ...extra });
const ROBOT = 'The robots that interest me most is the dancing robot.';
const QUIET = 'A dancing robot sounds fun to watch. <board sentence stress="robot | interests">The robot that interests me most is the dancing robot.</board> What can it do?';

// ── 3: T43/T44 (Past simple, 09:09): the correction, and the next question in the same reply ──
const inPast = (extra: Partial<V2State> = {}) => base({ board: { pages: structuredClone(PAGES.slice(0, 4)), current: 3 }, goals: goalsThrough(3), partStart: { part: 'past-simple', at: 7.47 * MIN },
  history: [u('x'), a('<board page>Past simple</board>\nWhat did you do when you first joined your company? Start with: When I first joined…')], ...extra });
const T43 = 'When I first joined my company, I I filled uh joining form.';
const T44_LIVE = 'Filling in the form is a good past simple story. One small thing: we say "filled in the joining form."\n\n<board sentence stress="filled | in">When I first joined my company, I filled in the joining form.</board>\n\nNext, tell me about your first day. <board problem>What did you do on your first day at the company?</board> Start with: "On my first day, I…"';
const T44_REPEAT = 'Filling in the form is a good past simple story. One small thing: we say "filled in the joining form."\n\n<board sentence stress="filled | in">When I first joined my company, I filled in the joining form.</board>\n\nCan you say the sentence once more?\n\nNext, tell me about your first day. <board problem>What did you do on your first day at the company?</board> What did you do on your first day?';

// ── 4: the washing-machines retest (Your job, turn 10), offered in Present perfect (investigation F) ──
const WASH: V2Retest = { part: 'topic-intro', said: 'I sell washing machine for customer.', right: 'I sell washing machines to customers.', target: ['washing machines', 'to customers'], turn: 10 };
const inPP = (extra: Partial<V2State> = {}) => base({ board: { pages: structuredClone(PAGES.slice(0, 3)), current: 2 }, goals: goalsThrough(2), partStart: { part: 'present-perfect', at: 4.85 * MIN },
  support: { step: 'normal', wrong: 0, clean: 0, part: 'present-perfect' }, retests: [structuredClone(WASH)],
  history: [u('x'), a('<board page>Present perfect</board>\nHow long have you worked for your company?')], ...extra });
const PP_CLEAN = (s: string, q: string) => `Good. <board sentence>${s}</board> ${q}`;

async function probe() {
  // 1
  const opened = await turn(lang, atOffer(), 'Yes, pronunciation.', [{ text: T82_MENU }], 16.3);
  const heldOne = await turn(lang, inPron(['responsibilities']), 'responsibilities.', [{ text: SCORE_REPLY }], 16.9);
  const leave = await turn(lang, inPron(['responsibilities']), 'No, let\'s go to the summary.', [{ text: 'Okay.' }], 16.9);
  const twoEarly = await turn(lang, inPron(['responsibilities', 'international']), 'international.', [{ text: SCORE_REPLY }], 16.9);
  const twoLate = await turn(lang, inPron(['responsibilities', 'international']), 'international.', [{ text: SCORE_REPLY }], 17.9);
  const oneLate = await turn(lang, inPron(['responsibilities']), 'responsibilities.', [{ text: SCORE_REPLY }], 17.9);
  const leftThen = await turn(lang, leave.r.state, 'Okay.', [{ text: 'Okay.' }], 17.0);

  // 2
  const convPlain = await turn(lang, inConv(), 'I worked on a project for social welfare.', [{ text: 'That sounds meaningful. What was your role?' }], 12.0);
  const convHelp = await turn(lang, inConv(), 'How do I say what I did?', [{ text: 'Start with: I helped…' }], 12.0);
  const silentHist = inConv(); silentHist.history.push(u('[The student has not replied.]'), a('Take your time. You could start with: I worked on…'));
  const convAfterSilence = await turn(lang, silentHist, 'I worked on a project for social welfare.', [{ text: 'Good. What was your role?' }], 12.0);
  const convThird = await turn(lang, inConv({ freeConv: { part: 'open-conversation', corrected: 2 } }), ROBOT, [{ text: QUIET }], 12.2);
  const convSecond = await turn(lang, inConv({ freeConv: { part: 'open-conversation', corrected: 1 } }), ROBOT, [{ text: QUIET }], 12.2);
  const half = await turn(lang, inConv(), 'I worked on a project for social welfare.', [{ text: 'That sounds meaningful. Now it\'s your turn: ask me a question about my work.' }], 13.2);
  const afterInvite = await turn(lang, half.r.state, 'What project are you working on now?', [{ text: 'I am helping with customer service training. What would you like to work on next?' }], 13.6);
  const early = await turn(lang, inConv(), 'I worked on a project for social welfare.', [{ text: 'Good. What was your role?' }], 12.0);
  // The step "starter" in a part that is no free conversation (Present perfect): the starter line as before.
  const ppStarter = await turn(lang, inPP({ support: { step: 'starter', wrong: 0, clean: 0, part: 'present-perfect' }, retests: [] }), 'I have worked there for three years.', [{ text: PP_CLEAN('I have worked there for three years.', 'What have you learned there?') }], 6.0);

  // 3
  const live44 = await turn(lang, inPast(), T43, [{ text: T44_LIVE }], 9.0);
  const rep44 = await turn(lang, inPast(), T43, [{ text: T44_REPEAT }], 9.0);
  const repeated = await turn(lang, rep44.r.state, 'When I first joined my company, I filled in the joining form.', [{ text: 'Yes, that\'s right. What did you do on your first day at the company?' }], 9.3);
  const mathsRepeat = await turn(maths, { ...newV2State(0), history: [u('x'), a('What is 3 times 4?')] }, '13', [{ text: 'Not quite: 3 × 4 = 12. Can you say it again? What is 6 times 7?' }], 5);

  // 4: Present perfect, turns 14–19 of the session (one tutor reply per turn).
  const p1 = await turn(lang, inPP(), 'I have worked there for three years.', [{ text: PP_CLEAN('I have worked there for three years.', 'What have you learned at your company?') }], 5.2);
  const p2 = await turn(lang, p1.r.state, 'I have learned good negotiation skills.', [{ text: PP_CLEAN('I have learned good negotiation skills.', 'How has it helped you?') }], 5.6);
  const p3 = await turn(lang, p2.r.state, 'It has helped me with my customers.', [{ text: PP_CLEAN('It has helped me with my customers.', 'What else have you done this year?') }], 6.0);
  const p4 = await turn(lang, p3.r.state, 'I have visited many shops this year.', [{ text: PP_CLEAN('I have visited many shops this year.', 'Why did you visit them?') }], 6.3);
  // T33 (turn 19): the late right use, after the old window.
  const p5 = await turn(lang, p4.r.state, 'I have sold more washing machines to customers.', [{ text: PP_CLEAN('I have sold more washing machines to customers.', 'That is great. What is next for you?') }], 6.6);
  // A part change with the retest still open: not asked.
  const left = await turn(lang, { ...p4.r.state, board: { pages: structuredClone(PAGES.slice(0, 4)), current: 3 }, partStart: { part: 'past-simple', at: 7.0 * MIN } }, 'I attended a fair last year.', [{ text: PP_CLEAN('I attended a fair last year.', 'Who did you meet?') }], 7.2);
  // A new correction on the target after the send: missed.
  const missed = await turn(lang, p2.r.state, 'I have sold washing machine for customers.', [{ text: 'We say: <board sentence stress="washing machines | to customers">I have sold washing machines to customers.</board> Can you say it once more?' }], 6.0);

  // Round trip of the new state.
  const read = v2ReadClientState(JSON.parse(JSON.stringify(convThird.r.state)));
  const scoped = read ? v2ScopeCarried(structuredClone(read), lang) : null;
  const scopedMaths = read ? v2ScopeCarried(structuredClone(read), maths) : null;

  // Other lessons.
  const typed = await turn(typedLang, inConv(), 'I worked on a project for social welfare.', [{ text: 'Good. What was your role?' }], 13.2);
  const mathsTurn = await turn(maths, { ...newV2State(0), history: [u('x'), a('What is 3 times 4?')] }, '12', [{ text: 'Yes, 12. What is 6 × 7?' }], 18.1);

  const q = (r: Awaited<ReturnType<typeof turn>>['r']) => r.toolCalls.filter((c) => c.name === 'show_problem' && /^painted/.test(c.outcome)).map((c) => String(c.args.statement ?? ''));
  const stored = (r: Awaited<ReturnType<typeof turn>>['r']) => { const m = r.state.history[r.state.history.length - 1]!; return typeof m.content === 'string' ? m.content : m.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '); };
  const retest = (s: V2State) => (s.retests ?? []).find((r) => r.target.join() === WASH.target.join()) ?? null;
  return {
    openedFacts: opened.facts, openedPage: opened.r.state.board.pages[opened.r.state.board.current]?.title ?? null,
    heldOneFacts: heldOne.facts, leaveFacts: leave.facts, leaveMove: leave.r.state.moveOnAsked ?? [], leftThenFacts: leftThen.facts, twoEarlyFacts: twoEarly.facts, twoLateFacts: twoLate.facts, oneLateFacts: oneLate.facts,
    convPlain: convPlain.facts, convHelp: convHelp.facts, convAfterSilence: convAfterSilence.facts, convThird: convThird.facts, convSecond: convSecond.facts,
    thirdCorrections: convThird.r.state.corrections ?? null, thirdCount: convThird.r.state.freeConv ?? null, thirdSpoken: convThird.r.spoken,
    halfFacts: half.facts, halfState: half.r.state.freeConv ?? null, afterInviteFacts: afterInvite.facts, earlyFacts: early.facts, ppStarter: ppStarter.facts,
    live44: { spoken: live44.r.spoken, q: q(live44.r), facts: live44.facts }, rep44: { spoken: rep44.r.spoken, q: q(rep44.r), stored: stored(rep44.r) }, repeatedQ: q(repeated.r), repeatedSpoken: repeated.r.spoken,
    mathsRepeat: { spoken: mathsRepeat.r.spoken, facts: mathsRepeat.facts },
    p: [p1, p2, p3, p4, p5].map((x) => ({ facts: x.facts, retest: retest(x.r.state), events: (x.r.events ?? []).map((e) => `${e.type} ${e.message}`) })),
    left: { retest: retest(left.r.state), events: (left.r.events ?? []).map((e) => `${e.type} ${e.message}`) }, missed: retest(missed.r.state),
    read: read ? { freeConv: read.freeConv ?? null } : null, scoped: scoped?.freeConv ?? null, scopedMaths: scopedMaths?.freeConv ?? null,
    typedFacts: typed.facts, mathsFacts: mathsTurn.facts,
  };
}

async function main() {
  const on = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }
  const SUMMARY_LINES = /summary page: lay the Summary page out|the summary may begin/;
  const HOLD = /the optional Pronunciation part was taken and is not done/;
  const STARTER = /next question's form: STARTER/;
  const NO_ALOUD = /From now on do not correct aloud/;
  const INVITE = /your turn to be asked: half of this conversation part's time has passed/;
  const RETEST = /next question's aim \(a retest of an earlier mistake\): Your next new question must make them say "washing machines", "to customers"; for example ask about something whose natural answer is like "I sell washing machines to customers\."/;
  const REPEAT_LINE = /after a correction: if you ask them to say the corrected sentence again, that ask ENDS this reply/;

  console.log('1  PART_FIRST_STEP: the pronunciation part offers the plan\'s choice and does its minutes');
  check('"Yes, pronunciation." opens its page; the opening facts carry the plan\'s own question with its four choices, to ask and wait for', on.openedPage === 'Pronunciation' && on.openedFacts.includes(`its opening question is "${PLAN_Q}". Ask THAT question in this reply`) && /wait for their answer: no item, exercise or question of your own before it/.test(on.openedFacts), on.openedFacts.split('\n').filter((l) => /said yes to going on/.test(l)));
  check('…and not the bare "begin that part in this reply" line', !/begin that part in this reply, and do not open its page again/.test(on.openedFacts));
  check('16.9, one word tried twice: the part is held (1 of 2 items; time left of its first half); no summary-page lines', HOLD.test(on.heldOneFacts) && /1 of at least 2 items done/.test(on.heldOneFacts) && /more minute.? of its time before it may close/.test(on.heldOneFacts) && !SUMMARY_LINES.test(on.heldOneFacts), on.heldOneFacts.split('\n').filter((l) => /time:|summary/.test(l)));
  check('his word to leave ("No, let\'s go to the summary."): not held; recorded; the summary-page line is back', !HOLD.test(on.leaveFacts) && on.leaveMove.includes('pronunciation') && /summary page: lay the Summary page out/.test(on.leaveFacts), on.leaveMove);
  check('…and on the next turn too (state, not the words)', !HOLD.test(on.leftThenFacts));
  check('two items but under half its minutes while it fits: still held (time only), "one more item, or the summary?"', HOLD.test(on.twoEarlyFacts) && !/items done/.test(on.twoEarlyFacts.split('\n').find((l) => HOLD.test(l)) ?? '') && /ask whether they want one more item or the summary/.test(on.twoEarlyFacts) && !SUMMARY_LINES.test(on.twoEarlyFacts));
  check('two items and past half its minutes (17.9): not held; the summary page\'s line is in', !HOLD.test(on.twoLateFacts) && /summary page: lay the Summary page out/.test(on.twoLateFacts));
  check('one item past half its minutes: held by the item minimum alone', HOLD.test(on.oneLateFacts) && /1 of at least 2 items done/.test(on.oneLateFacts) && !/before it may close/.test(on.oneLateFacts));

  console.log('2  FREE_CONVERSATION: the conversation part is a conversation');
  check('step "starter", an ordinary answer: no STARTER form line in the conversation', !STARTER.test(on.convPlain), on.convPlain.split('\n').filter((l) => /form/.test(l)));
  check('…after he asked for help ("How do I say what I did?"): the starter line', STARTER.test(on.convHelp));
  check('…after a silence turn: the starter line', STARTER.test(on.convAfterSilence));
  check('a part that is no free conversation (Present perfect) keeps the starter line', STARTER.test(on.ppStarter));
  check('two corrections made: the facts say do not correct aloud, card it quietly for "To improve"', NO_ALOUD.test(on.convThird) && !NO_ALOUD.test(on.convSecond));
  check('the third correction carded with no words about it is recorded (7w list) and counted', JSON.stringify(on.thirdCorrections?.map((c) => c.stress)) === '[["robot","interests"]]' && on.thirdCount?.corrected === 3 && !/robot that interests/i.test(on.thirdSpoken), [on.thirdCorrections, on.thirdCount, on.thirdSpoken]);
  check('half the part\'s minutes passed (13.2, entered 10.61, 5 min): the invitation line, once; not at 12.0', INVITE.test(on.halfFacts) && !INVITE.test(on.earlyFacts));
  check('the reply that asked him for a question marks it given (state); the next turn has no invitation line', on.halfState?.invited === true && !INVITE.test(on.afterInviteFacts), on.halfState);

  console.log('3  REPEAT_THEN_WAIT: after a correction the tutor waits for the repeat');
  check('the facts of a reply to his practice answer carry the repeat-then-wait line', REPEAT_LINE.test(on.live44.facts));
  check('T44 with a repeat ask: the reply ends on it; the next question and its card are left out (spoken and stored)', /Can you say the sentence once more\?\s*$/.test(on.rep44.spoken) && !/first day/.test(on.rep44.spoken) && on.rep44.q.length === 0 && !/first day/.test(on.rep44.stored), on.rep44);
  check('T44 as live (no repeat ask): the next question and its card stay', /tell me about your first day/.test(on.live44.spoken) && on.live44.q.length === 1, on.live44);
  check('after his repeat, the next question comes (its card painted)', /first day/.test(on.repeatedSpoken), on.repeatedSpoken);
  check('a maths voice lesson: nothing dropped, no line', /What is 6 times 7\?/.test(on.mathsRepeat.spoken) && !REPEAT_LINE.test(on.mathsRepeat.facts));
  check('v2AsksRepeat: the asks of the session, and not advice for later', ['Can you say the sentence once more?', 'Can you say the complete sentence?', 'Can you try that sentence again?', 'Please say this after me: I have worked here.', 'もう一度言ってみてください。'].every(v2AsksRepeat) && !['Try to say it this way next time.', 'What did you do next?', 'Tell me about your first day.'].some(v2AsksRepeat));

  console.log('4  RETEST_ASKED: re-tests get asked, and a late pass counts');
  const [p1, p2, p3, p4, p5] = on.p;
  const lines1 = p1!.facts.split('\n');
  const at = lines1.findIndex((l) => RETEST.test(l));
  check('the retest line is the next question\'s instruction (one imperative sentence, its aim)', at >= 0, lines1.filter((l) => /retest/.test(l)));
  check('…placed with the next-question block: right after the practice facts, before the sentence-card and learner-card lines', at > lines1.findIndex((l) => /^board: a question the learner must answer/.test(l)) && at < lines1.findIndex((l) => /their (?:answer|words) just now/.test(l)), lines1.slice(Math.max(0, at - 2), at + 2));
  check('sent for 3 turns (turns 1–3 in the part), not a 4th', RETEST.test(p1!.facts) && RETEST.test(p2!.facts) && RETEST.test(p3!.facts) && !RETEST.test(p4!.facts) && p3!.retest?.offered === 3);
  check('…and still open after it (no "not asked" by turns)', !p4!.retest?.outcome && !p4!.events.some((e) => /outcome=not_asked/.test(e)), p4!.retest);
  check('T33: "I have sold more washing machines to customers." in that part = passed', p5!.retest?.outcome === 'passed' && p5!.events.some((e) => /v2_retest_outcome target="washing machines", "to customers" outcome=passed/.test(e)), [p5!.retest, p5!.events]);
  check('the part left with it open: not asked', on.left.retest?.outcome === 'not_asked', on.left);
  check('a new correction on the target: missed', on.missed?.outcome === 'missed', on.missed);

  console.log('state round trip; other lessons');
  check('freeConv survives JSON → v2ReadClientState → v2ScopeCarried; scoped out of a maths lesson', on.read?.freeConv?.corrected === 3 && on.scoped?.corrected === 3 && on.scopedMaths === null, [on.read, on.scoped]);
  check('a typed language lesson and a maths voice lesson: no 7x lines', ![HOLD, INVITE, NO_ALOUD, REPEAT_LINE, /next question's aim/].some((re) => re.test(on.typedFacts) || re.test(on.mathsFacts)));

  console.log('each switch off alone (a child process per switch): as at 8f334150 for that item');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC7_7X_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Awaited<ReturnType<typeof probe>>;
  };
  {
    const off = child('PART_FIRST_STEP');
    check('PART_FIRST_STEP off: the bare "begin that part" line; at 16.9 the summary page\'s line, no hold', /begin that part in this reply, and do not open its page again/.test(off.openedFacts) && !HOLD.test(off.heldOneFacts) && /summary page: lay the Summary page out/.test(off.heldOneFacts));
    check('PART_FIRST_STEP off: the other items unchanged', NO_ALOUD.test(off.convThird) && off.rep44.q.length === 0 && off.p[4]!.retest?.outcome === 'passed');
  }
  {
    const off = child('FREE_CONVERSATION');
    check('FREE_CONVERSATION off: the starter line as before, no corrections cap, no invitation', STARTER.test(off.convPlain) && !NO_ALOUD.test(off.convThird) && !INVITE.test(off.halfFacts) && off.thirdCount?.corrected === 2 && off.halfState === null, [off.thirdCount, off.halfState]);
    check('FREE_CONVERSATION off: the other items unchanged', HOLD.test(off.heldOneFacts) && off.rep44.q.length === 0);
  }
  {
    const off = child('REPEAT_THEN_WAIT');
    check('REPEAT_THEN_WAIT off: T44 with a repeat ask keeps its next question and card; no line', /first day/.test(off.rep44.spoken) && off.rep44.q.length === 1 && !REPEAT_LINE.test(off.live44.facts));
    check('REPEAT_THEN_WAIT off: the other items unchanged', HOLD.test(off.heldOneFacts) && INVITE.test(off.halfFacts));
  }
  {
    const off = child('RETEST_ASKED');
    check('RETEST_ASKED off: the old retest line, two sends, not asked after them; the late use is not scored', !RETEST.test(off.p[0]!.facts) && /retest of an earlier mistake: in the Your job part/.test(off.p[0]!.facts) && !/retest of an earlier mistake/.test(off.p[2]!.facts) && off.p[3]!.retest?.outcome === 'not_asked' && off.p[4]!.retest?.outcome === 'not_asked', off.p.map((x) => x.retest));
    check('RETEST_ASKED off: the other items unchanged', HOLD.test(off.heldOneFacts) && off.rep44.q.length === 0);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
