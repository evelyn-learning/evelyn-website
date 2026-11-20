/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7z: mic test 8 (embed-1795115593161), the engine's side: the part entered on a yes, an unheard invitation, the
 * free conversation, page 1, re-tests the tutor can ask, leaving a held optional part. The session's plan (gdi-work-projects-v1) and its
 * real turns (task-7y-investigation.md A3, B). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic8-7z
 *
 *  1 PART_YES_CHOICES        T89–T91: "Yes, pronunciation." → the line says they already said yes, gives the choices, card holds them;
 *                            a plan question with nothing after the yes/no keeps the 7x line
 *  2 UNHEARD_ASK_OWED        T103–T105: the invitation cut before it was heard is owed again (no goodbye, end_lesson deferred, the
 *                            invitation asked), the pin is not cleared; heard as today; the learner asking to stop still ends; the
 *                            unheard check owed again; reading the card back is no explanation; "Before we finish" said once (T101)
 *  3 FREE_CONV_NO_STARTER    the conversation part: ask and stop, no starter unless silence / help; the corrections-spent line beside
 *                            the card line
 *  4 OPENING_PAGE_FIRST      page 1 = the overview page with the plan title heading, then the opening reply's own note under it
 *  5 RETEST_QUESTION         a correction keeps the question that drew it (T10–T12); the retest line gives sentence + question; round trip
 *  6 OPTIONAL_ONE_MORE       the hold lifted with minutes left: "one more, or move on?" before leaving the part
 *  each switch off alone (a child process per switch); maths voice and typed lessons unchanged.
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
import { trimToSpoken } from '../src/lib/tutor/v2/interrupted';
import { v2PartFirstStepLine, v2PartYesChoices } from '../src/lib/tutor/v2/optional-hold';
import { V2_CLOSE_INVITE_UNHEARD_LINE } from '../src/lib/tutor/v2/close-invite';
import { V2_CLOSE_CHECK_READ_BACK } from '../src/lib/tutor/v2/close-check';
import { V2_FREE_CONV_NO_STARTER_LINE, V2_FREE_CONV_PARTNER_LINE, v2QuestionOfReply } from '../src/lib/tutor/v2/adaptive';
/** Task 8a (FREE_CONV_PARTNER): the 7z positive line is now sent as the partner line, which keeps its rules (one question, no starter
 *  unless silent or asked for help); either is the free-conversation line here. */
const hasFreeLine = (facts: string) => facts.includes(V2_FREE_CONV_NO_STARTER_LINE) || facts.includes(V2_FREE_CONV_PARTNER_LINE);
import { V2_STARTER_LINE } from '../src/lib/tutor/v2/practice-facts';
import { qpinAskUnheard, shouldClearQpinOnAnswer } from '../src/lib/tutor/qpin-behavior';
import { v2DropSaidLead } from '../src/lib/tutor/v2/board-timing';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC8_7Z_CHILD;
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
const UNLABELLED = { ...structuredClone(GDI), segments: GDI.segments.map((s) => ({ ...structuredClone(s), metadata: { ...(s.metadata as Record<string, unknown>), label: undefined } })) } as LessonPlan;
const lang: V2Session = { studentName: 'Praveen', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI, pronunciation: true };
const maths: V2Session = { studentName: 'Sam', subject: 'Maths', level: 'Grade 8', mode: 'voice', timeBoxMinutes: 20 };
const typedLang: V2Session = { ...lang, mode: 'text' };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
const ids = GDI.segments.map((s) => s.id);
const goalsThrough = (n: number) => Object.fromEntries(ids.slice(0, n).map((id) => [id, { status: 'shown' as const, at: 0 }]));
const END = { name: 'end_lesson', input: { summary: 'x' } };
const PAGES: V2BoardPage[] = [
  { title: 'Overview', items: [] }, { title: 'Your job', items: [card('j1', 'I sell washing machines to customers.')] },
  { title: 'Present perfect', items: [card('p1', 'I have worked at Nagoya for six years.')] },
  { title: 'Past simple', items: [card('s1', 'I sold washing machines in China last year.')] },
  { title: 'Conversation', items: [card('c1', 'I usually go with Kenji and my boss.')] },
];
const base = (extra: Partial<V2State>): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, timeFit: { dropped: [], byArrival: true }, ...extra });

async function turn(session: V2Session, state: V2State, said: string | null, replies: Reply[], atMin: number, silence?: number) {
  const m = scripted(replies);
  const r = await runV2Turn({ session, state: structuredClone(state), studentSaid: said, callModel: m.call, boardPass: false, mathsCheck: false, nowMs: atMin * MIN, ...(silence ? { facts: { silenceSeconds: silence } } : {}) });
  return { r, facts: m.facts.join('\n'), results: m.results };
}

// ── 1: T89 (wall 17:18) → T90 "Yes, pronunciation." → T91 ──
const T89 = 'Good, you told me who you go with. That finishes our conversation about your work. Next is Pronunciation, which is optional: would you like to practise it, or go straight to the summary?';
const T91 = 'Would you like to practice your pronunciation? You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue. 1番は単語、2番は一文、3番は自然な話し方です。どれにしますか？';
const CHOICES = 'You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue.';
const PLAN_Q = `Would you like to practice your pronunciation? ${CHOICES}`;
const atT89 = () => base({ board: { pages: structuredClone(PAGES), current: 4 }, goals: goalsThrough(5), partStart: { part: 'open-conversation', at: 9.6 * MIN },
  history: [u('x'), a('<board page>Conversation</board>\nDo you usually go with your team? Start with: "Yes, I usually go with…"'), u('Yes, I usually go with Kenji and my boss.'), a(T89)] });

// ── 2: the close, T101–T105 (lesson ≈ 17.9 → 19.1) ──
const T101 = 'Your score was 93 out of 100. The word "for" was the weakest, so keep the "f" sound light.\n\n<board page>Summary</board>\nLet\'s review what we practised today. You talked about your work, your responsibilities and your customers.\n\nNow, one thing to improve: the word order when you compare front load and top load.\n\nBefore we finish, one check question.\n\n<board problem>Before we finish, can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago.</board>';
const T102 = 'I have worked here for 5 years. I worked here 5 years ago.';
const T103 = 'Both sentences are right, and you explained the difference in your own words: you have worked here for five years, so you still work here, and you worked here five years ago, so that job is finished. Your sentences were clear today, and you said "for" and "ago" correctly. Do you have any questions before we finish?';
const T103_SENTENCES = ['Both sentences are right, and you explained the difference in your own words: you have worked here for five years, so you still work here, and you worked here five years ago, so that job is finished.', 'Your sentences were clear today, and you said "for" and "ago" correctly.', 'Do you have any questions before we finish?'];
const T104 = 'Uh, first means both, okay, first means I don\'t work uh, ne. I, okay. Second means I don\'t work here.';
const T105 = 'Yes, that\'s exactly right: the first sentence is still true today, and the second means you no longer work there. You made clear sentences today. Thank you for today\'s lesson, and see you next time!';
const PRON_PAGE: V2BoardPage = { title: 'Pronunciation', items: [card('r1', 'I have worked with international customers for several years.'), card('r2', 'I was responsible for communicating with our customers.')] };
const SUMMARY_PAGE: V2BoardPage = { title: 'Summary', items: [{ id: 'q1', tool: 'show_problem', summary: 'Before we finish, can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago.' }] };
const closeBoard = () => ({ pages: [...structuredClone(PAGES), structuredClone(PRON_PAGE), structuredClone(SUMMARY_PAGE)], current: 6 });
/** The state as T104's turn gets it: the check asked (T101) and answered (T102), the invitation recorded (T103), and T103 cut 0.8 s in. */
const atT104 = (unheard: boolean, extra: Partial<V2State> = {}): V2State => {
  const st = base({ board: closeBoard(), goals: goalsThrough(7), partStart: { part: 'pronunciation', at: 15.2 * MIN }, summaryBegunAt: 17.9 * MIN,
    closeCheck: { askedAt: 17.9 * MIN, answeredAt: 18.6 * MIN }, closeInvitedAt: 18.6 * MIN, closeAskLast: { step: 'invite', last: T103_SENTENCES[2]! },
    history: [u('x'), a(T89), u('Yes, pronunciation.'), a(`<board page>Pronunciation</board>\n${T91}`), u('Uh, complete sentence.'), a(T101), u(T102), a(T103)], ...extra });
  return unheard ? trimToSpoken(st, T103_SENTENCES, 0, true) : st;
};
/** The state as T102's turn gets it: the check card asked by T101 (pending), unheard when `unheard`. */
const atT102 = (unheard: boolean): V2State => {
  const st = base({ board: closeBoard(), goals: goalsThrough(7), partStart: { part: 'pronunciation', at: 15.2 * MIN }, summaryBegunAt: 17.9 * MIN, closeCheck: { askedAt: 17.9 * MIN }, closeAskLast: { step: 'check', last: 'Before we finish, can you explain the difference between these two sentences?' },
    history: [u('x'), a(T89), u('Yes, pronunciation.'), a(`<board page>Pronunciation</board>\n${T91}`), u('Uh, complete sentence.'), a(T101)] });
  return unheard ? trimToSpoken(st, ['Your score was 93 out of 100.', 'Let\'s review what we practised today.', 'Before we finish, one check question.', 'Before we finish, can you explain the difference between these two sentences?'], 3, true) : st;
};

// ── 3: the Conversation part (entered at 9.6, support normal) ──
const inConv = (extra: Partial<V2State> = {}, lastAsk = 'Let\'s keep it at this: the sentence we say is "Customers usually like front load, but top load is cheaper, so they go for that." Now, which one do you sell more, front load or top load? Start with: "I sell more…"') => base({
  board: { pages: structuredClone(PAGES), current: 4 }, goals: goalsThrough(4), partStart: { part: 'open-conversation', at: 9.6 * MIN },
  support: { step: 'normal', wrong: 0, clean: 0, part: 'open-conversation' }, history: [u('x'), a('<board page>Conversation</board>\nWhat do your customers want most in a washing machine?'), u('Customers want a front load feature.'), a(lastAsk)], ...extra });
const T70 = 'I sell more front uh top load than front load, but want to sell front load more.';
const T71_QUIET = 'Good, you have a clear goal there. <board sentence>I sell more top load than front load, but I want to sell more front load.</board> Why do you want to sell more front load?';

// ── 5: Your job, T18–T20 ──
const T18 = 'Of course. I asked: What kind of customers did you sell to in China? 「中国でどんなお客様に売りましたか？」\n\nPlease answer with one short sentence.';
const T19 = 'Um, uh, retail customer, um, uh, they need, um, machine to clean cloth.';
const T20 = 'Good, I understand: the customers are shops that sell to people. One point: for one machine, we say "a machine". <board sentence stress="a machine">Retail customers need a machine to clean clothes.</board> Can you say that sentence once more?';
// T10–T12 (wall 01:50–02:20): the ask, his answer, the correction that ends on a Japanese repeat ask.
const T10 = '仕事について話すときは、短い文で大丈夫です。\n\nでは練習です。仕事で何をしているか、一文か二文で答えてください。\n\nWhat do you do at work? Answer with one or two sentences.';
const T11 = 'I sell washing machine to customer.';
const T12 = 'いいですね、意味がよく伝わります。一つだけ直しましょう。「washing machine」と「customer」は複数形にします。\n\n<board sentence stress="washing machines | customers">I sell washing machines to customers.</board>\n\nもう一度言ってみてください。';
const jobT10 = () => base({ board: { pages: [{ title: 'Overview', items: [] }, { title: 'Your job', items: [] }], current: 1 }, goals: goalsThrough(2), partStart: { part: 'topic-intro', at: 2.0 * MIN },
  history: [u('x'), a('Next is Your job. Would you like to go on, or do you have a question first?'), u('Uh, go on.'), a(`<board page>Your job</board>\n${T10}`)] });
const inJob = () => base({ board: { pages: structuredClone(PAGES.slice(0, 2)).map((p, i) => (i === 1 ? { ...p, items: [] } : p)), current: 1 }, goals: goalsThrough(2), partStart: { part: 'topic-intro', at: 2.0 * MIN },
  history: [u('x'), a('Next is Your job. Would you like to go on, or do you have a question first?'), u('Uh, go on.'), a('<board page>Your job</board>\nWhat do you do at work?'), u('I sold machine in China too last year.'), a('Good. What kind of customers did you sell to in China?'), u('Uh, can you repeat?'), a(T18)] });
const inPP = (extra: Partial<V2State> = {}) => base({ board: { pages: structuredClone(PAGES.slice(0, 3)), current: 2 }, goals: goalsThrough(2), partStart: { part: 'present-perfect', at: 4.85 * MIN },
  support: { step: 'normal', wrong: 0, clean: 0, part: 'present-perfect' }, history: [u('x'), a('<board page>Present perfect</board>\nHave you worked for your current company for a long time?')], ...extra });

// ── 6: Pronunciation with two items scored (as 7x's twoLate): entered at 16.3, now 17.9 ──
const inPron = (extra: Partial<V2State> = {}) => base({
  board: { pages: [...structuredClone(PAGES), structuredClone(PRON_PAGE)], current: 5 }, goals: goalsThrough(5), partStart: { part: 'pronunciation', at: 16.3 * MIN },
  history: [u('x'), a(T89), u('Yes, pronunciation.'), a(`<board page>Pronunciation</board>\n${T91}`), u('I was responsible for communicating with our customers.'), a('Please say it once more: "I was responsible for communicating with our customers."')], ...extra });
const SCORE = 'Your score was 93 out of 100. The word "for" was the weakest, so keep the "f" sound light.';

async function probe() {
  // 1
  const entry = await turn(lang, atT89(), 'Yes, pronunciation.', [{ text: `Great, let's start pronunciation. ${CHOICES} <board problem>${CHOICES}</board>` }], 15.2);
  const ppOpen = await turn(lang, base({ board: { pages: structuredClone(PAGES.slice(0, 2)), current: 1 }, goals: goalsThrough(2), partStart: { part: 'topic-intro', at: 2.8 * MIN }, practiceSaid: { 'topic-intro': 2 },
    history: [u('x'), a('<board page>Your job</board>\nWhat do you do at work?'), u('I sell washing machines.'), a('ここで「仕事について」は終わりです。次は「現在完了」です。質問がありますか、それとも次に進みますか？')] }), 'Uh, yes.', [{ text: 'では、現在完了から始めましょう。Have you worked for your current company for a long time?' }], 4.9);

  // 2
  const unheard = await turn(lang, atT104(true), T104, [{ text: T105, tools: [END] }, { text: 'Good.' }], 19.1);
  const heard = await turn(lang, atT104(false), T104, [{ text: T105, tools: [END] }, { text: 'Good.' }], 19.1);
  const stop = await turn(lang, atT104(true), 'Sorry, I have to finish now. Goodbye.', [{ text: 'Of course. Thank you for today\'s lesson, and see you next time!', tools: [{ name: 'end_lesson', input: { summary: 'x', because: 'student_asked' } }] }], 19.1);
  const checkUnheard = await turn(lang, atT102(true), T102, [{ text: 'Good. Before we finish, can you explain the difference between these two sentences in your own words?' }], 18.6);
  const checkHeard = await turn(lang, atT102(false), T102, [{ text: 'Good reading. Can you say the difference in your own words?' }], 18.6);
  // Fix round 1 (I2): the reply that records the invitation leaves its last sentence (state, by position).
  const t103 = await turn(lang, atT102(false), T102, [{ text: T103 }], 18.6);
  // Fix round 1 (I1): unheard a second time: no longer owed; the next reply may say goodbye and end.
  const again = trimToSpoken(structuredClone(unheard.r.state), unheard.r.spoken.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean), 0, true);
  const twice = await turn(lang, again, 'No, no questions.', [{ text: 'Thank you for today\'s lesson, and see you next time!', tools: [END] }], 19.5);
  // Fix round 1 (I2): no wording dependence: an unusually worded invitation, its last sentence unheard / not unheard.
  const ODD = 'Anything on your mind before we wrap up today?';
  const oddState = (unheardList: string[]) => ({ ...atT104(false, { closeAskLast: { step: 'invite' as const, last: ODD } }), unheard: unheardList });
  const oddUnheard = await turn(lang, oddState(['Your sentences were clear today.', ODD]), T104, [{ text: 'Good.' }], 19.1);
  const oddHeard = await turn(lang, oddState(['Your sentences were clear today.']), T104, [{ text: 'Good.' }], 19.1);
  // A heard last sentence with an invitation-like unheard sentence before it: not owed (position, not words).
  const midHeard = await turn(lang, { ...atT104(false, { closeAskLast: { step: 'invite', last: 'Thank you, Praveen.' } }), unheard: ['Do you have any questions before we finish?'] }, T104, [{ text: 'Good.' }], 19.1);
  // Item 3 (REPEAT_NOT_MISHEARD): T10–T12, the correction that ends 「もう一度言ってみてください。」; a real mishear.
  const t12live = await turn(lang, jobT10(), T11, [{ text: T12 }], 2.6);
  const mishear = await turn(lang, jobT10(), T11, [{ text: 'Sorry, I didn\'t catch that. Could you say it again?' }], 2.6);
  // T101's end: the model's lead-in and the check card on the Summary page (the summary begun, the check owed in this reply).
  const t101State = base({ board: { pages: [...structuredClone(PAGES), structuredClone(PRON_PAGE), { title: 'Summary', items: [] }], current: 6 }, goals: goalsThrough(7), partStart: { part: 'pronunciation', at: 15.2 * MIN }, summaryBegunAt: 17.8 * MIN, closeCheckLate: 17.8 * MIN,
    history: [u('x'), a(T89), u('Yes, pronunciation.'), a(`<board page>Pronunciation</board>\n${T91}`), u('I was responsible for communicating with our customers.'), a('Let\'s review what we practised today. You talked about your work and your customers.')] });
  const t101 = await turn(lang, t101State, 'Okay.', [{ text: T101.slice(T101.indexOf('Now, one thing to improve')) }], 17.9);
  // The pin (TutorSession): the T103 pin, T104 said over it unheard, T105 affirms.
  const transcript = (over: boolean) => [
    { id: 't103', role: 'tutor', text: T103 },
    { id: 's104', role: 'student', text: T104, ...(over ? { overUnheard: [...T103_SENTENCES] } : {}) },
    { id: 't105', role: 'tutor', text: T105 },
  ];
  const pinOver = shouldClearQpinOnAnswer(transcript(true), 't103', { unheardGist: 'Do you have any questions before we finish?' });
  const pinHeard = shouldClearQpinOnAnswer(transcript(false), 't103', { unheardGist: 'Do you have any questions before we finish?' });
  const pinNoGist = shouldClearQpinOnAnswer(transcript(true), 't103', {});

  // 3
  const convPlain = await turn(lang, inConv(), 'I sell more top load than front load.', [{ text: 'Top load is popular. Why do customers choose it?' }], 11.0);
  const convHelp = await turn(lang, inConv(), 'How do I say why customers choose it?', [{ text: 'You can say: They choose it because…' }], 11.0);
  const silent = inConv(); silent.history.push(u('[The student has not replied.]'), a('Take your time.'));
  const convSilence = await turn(lang, silent, 'I sell more top load than front load.', [{ text: 'Good. Why?' }], 11.0);
  const convThird = await turn(lang, inConv({ freeConv: { part: 'open-conversation', corrected: 2 } }), T70, [{ text: T71_QUIET }], 11.4);

  // 4
  const T0 = 'Hello, I\'m Ryota, and welcome to your English lesson! Today we\'ll talk about your work and the projects you\'re involved in. <board note>"present perfect": experience that started in the past and continues now, like "I have worked here for five years."</board> Does that sound good to you?';
  const open = await turn(lang, newV2State(0), null, [{ text: T0 }], 0);
  const openBare = await turn(lang, newV2State(0), null, [{ text: 'Hello, I\'m Ryota, and welcome to your English lesson! Does that sound good to you?' }], 0);
  const openOwnPage = await turn(lang, newV2State(0), null, [{ text: `<board page>Overview</board>\n${T0}` }], 0);
  const openUnlabelled = await turn({ ...lang, plan: UNLABELLED }, newV2State(0), null, [{ text: T0 }], 0);
  const openMaths = await turn(maths, newV2State(0), null, [{ text: 'Hi Sam! <board note>Today: linear equations.</board> Ready?' }], 0);

  // 5
  const t12 = await turn(lang, inJob(), T19, [{ text: T20 }], 2.6);
  const recorded = (t12.r.state.retests ?? [])[0] ?? null;
  const read = v2ReadClientState(JSON.parse(JSON.stringify(t12.r.state)));
  const scoped = read ? v2ScopeCarried(structuredClone(read), lang) : null;
  const pp1 = await turn(lang, inPP({ retests: recorded ? [structuredClone(recorded)] : [] }), 'I have worked there for six years.', [{ text: 'Good. <board sentence>I have worked there for six years.</board> What have you learned there?' }], 5.2);

  // 6
  const lifted = await turn(lang, inPron(), 'I was responsible for communicating with our customers.', [{ text: SCORE }], 17.9);
  const liftedLate = await turn(lang, inPron({ partStart: { part: 'pronunciation', at: 14.5 * MIN } }), 'I was responsible for communicating with our customers.', [{ text: SCORE }], 17.9);
  const liftedLeave = await turn(lang, inPron(), 'Let\'s move on to the summary.', [{ text: 'Okay.' }], 17.9);
  const heldOne = await turn(lang, inPron({ board: { pages: [...structuredClone(PAGES), { title: 'Pronunciation', items: [PRON_PAGE.items[0]!] }], current: 5 } }), 'I have worked with international customers for several years.', [{ text: SCORE }], 17.0);

  // Other lessons.
  const typed = await turn(typedLang, inConv(), 'I sell more top load than front load.', [{ text: 'Why?' }], 11.0);
  const mathsTurn = await turn(maths, { ...newV2State(0), history: [u('x'), a('What is 3 times 4?')] }, '12', [{ text: 'Yes, 12. What is 6 × 7?' }], 18.1);

  const pages = (r: Awaited<ReturnType<typeof turn>>['r']) => r.state.board.pages.map((p) => ({ title: p.title, items: p.items.map((it) => `${it.tool}:${it.summary}`) }));
  const storedFirst = (r: Awaited<ReturnType<typeof turn>>['r']) => { const m = r.state.history.find((h) => h.role === 'assistant'); return !m ? '' : typeof m.content === 'string' ? m.content : m.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '); };
  const close = (x: Awaited<ReturnType<typeof turn>>) => ({ facts: x.facts, results: x.results, spoken: x.r.spoken, closed: x.r.state.closed, invited: x.r.state.closeInvitedAt ?? null, check: x.r.state.closeCheck ?? null, late: x.r.state.closeCheckLate ?? null });
  return {
    entryFacts: entry.facts, entryPage: entry.r.state.board.pages[entry.r.state.board.current]?.title ?? null, ppOpenFacts: ppOpen.facts,
    unheard: close(unheard), heard: close(heard), stop: close(stop), checkUnheard: close(checkUnheard), checkHeard: close(checkHeard),
    t101: { spoken: t101.r.spoken, cards: t101.r.toolCalls.filter((c) => c.name === 'show_problem' && /^painted/.test(c.outcome)).map((c) => String(c.args.statement)) },
    pinOver, pinHeard, pinNoGist,
    convPlain: convPlain.facts, convHelp: convHelp.facts, convSilence: convSilence.facts, convThird: convThird.facts,
    open: { pages: pages(open.r), calls: open.r.toolCalls.map((c) => c.name), stored: storedFirst(open.r) }, openBare: pages(openBare.r), openOwnPage: pages(openOwnPage.r), openUnlabelled: pages(openUnlabelled.r), openMaths: pages(openMaths.r),
    recorded, readQ: read?.retests?.[0]?.question ?? null, scopedQ: scoped?.retests?.[0]?.question ?? null, pp1Facts: pp1.facts,
    liftedFacts: lifted.facts, liftedLateFacts: liftedLate.facts, liftedLeaveFacts: liftedLeave.facts, heldOneFacts: heldOne.facts,
    typedFacts: typed.facts, mathsFacts: mathsTurn.facts,
    t103Last: t103.r.state.closeAskLast ?? null, unheardLast: unheard.r.state.closeAskLast ?? null, unheardReowed: unheard.r.state.closeReowed ?? null,
    twice: close(twice), twiceReowed: twice.r.state.closeReowed ?? null,
    oddUnheard: close(oddUnheard), oddHeard: close(oddHeard), midHeard: close(midHeard),
    t12: { retests: t12live.r.state.retests ?? [], events: (t12live.r.events ?? []).map((e) => `${e.type} ${e.message}`) }, mishear: { retests: mishear.r.state.retests ?? [], events: (mishear.r.events ?? []).map((e) => `${e.type} ${e.message}`) },
  };
}

async function main() {
  const on = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }
  const YES_LINE = /They have already said yes to this part, so do not ask again whether they want it/;
  const OLD_FIRST = (q: string) => `its opening question is "${q}". Ask THAT question in this reply`;
  const ONE_MORE = /the optional Pronunciation part has had its items and still has about \d+ minutes? of its own: after the result of an item, ask whether they would like one more or to move on/;
  const HOLD = /the optional Pronunciation part was taken and is not done/;
  const NO_ALOUD = /From now on do not correct aloud/;
  const RETEST_Q = 'earlier they needed help with "Retail customers need a machine to clean clothes."; in this reply, before your next question, ask them "What kind of customers did you sell to in China?" again in fresh words';

  console.log('1  PART_YES_CHOICES: a part entered on their yes does not ask the yes/no again');
  check('T90 "Yes, pronunciation." to T89 opens the Pronunciation page', on.entryPage === 'Pronunciation', on.entryPage);
  check('the line: they already said yes, say in a few words you are starting, give the choices (quoted), do not ask again', YES_LINE.test(on.entryFacts) && on.entryFacts.includes(`say in a few words that you are starting it, then give its choices from the plan: "${CHOICES}"`) && !on.entryFacts.includes(OLD_FIRST(PLAN_Q)), on.entryFacts.split('\n').filter((l) => /said yes/.test(l)));
  check('…and the question card holds the choices, not the yes/no question', /Put those choices on its question card \(a <board problem> block holding the choices, not the yes\/no question\)/.test(on.entryFacts));
  check('v2PartYesChoices: the plan\'s question splits at its leading offer; T91\'s own words as the question too', JSON.stringify(v2PartYesChoices(PLAN_Q)) === JSON.stringify({ offer: 'Would you like to practice your pronunciation?', choices: CHOICES }) && v2PartYesChoices(T91)?.offer === 'Would you like to practice your pronunciation?');
  check('nothing after the yes/no: the 7x line as today', v2PartFirstStepLine('Pronunciation', 'Would you like to practice your pronunciation?').includes(OLD_FIRST('Would you like to practice your pronunciation?')) && v2PartYesChoices('Would you like to practice your pronunciation?') === null);
  check('a question that is no offer of the part (Present perfect\'s "Have you worked…?") and a choice question ("…or…?"): the 7x line', on.ppOpenFacts.includes(OLD_FIRST('Have you worked for your current company for a long time?')) && !YES_LINE.test(on.ppOpenFacts) && v2PartYesChoices('Would you like words or sentences? Pick one.') === null);

  console.log('2  UNHEARD_ASK_OWED: an invitation or ask the learner never heard is still owed');
  const u2 = on.unheard; const h2 = on.heard;
  check('T104 over the unheard T103: the facts say the invitation did not reach them and is owed (not "say goodbye and end")', u2.facts.includes(V2_CLOSE_INVITE_UNHEARD_LINE) && !/then say goodbye and end the lesson in this reply/.test(u2.facts), u2.facts.split('\n').filter((l) => /questions before the close/.test(l)));
  check('T105\'s end_lesson is deferred for the invitation; no goodbye; the reply ends on the invitation, recorded now', u2.results.some((x) => /^not ended: there is time for their questions/.test(x)) && !u2.closed && !/see you next time/i.test(u2.spoken) && /Do you have any questions before we finish\?\s*$/.test(u2.spoken) && typeof u2.invited === 'number' && u2.invited === 19.1 * MIN, u2);
  check('heard as today: the invitation stands, T105 and its end_lesson close the lesson', h2.closed && !h2.results.some((x) => /^not ended/.test(x)) && !h2.facts.includes(V2_CLOSE_INVITE_UNHEARD_LINE) && /then say goodbye and end the lesson in this reply/.test(h2.facts), h2);
  check('the learner asking to stop still ends (the unheard invitation owes nothing then)', on.stop.closed && !on.stop.results.some((x) => /^not ended/.test(x)) && !on.stop.facts.includes(V2_CLOSE_INVITE_UNHEARD_LINE), on.stop);
  check('fix round 1 (I2): the reply that records the invitation leaves the step and its last sentence (state)', JSON.stringify(on.t103Last) === JSON.stringify({ step: 'invite', last: 'Do you have any questions before we finish?' }), on.t103Last);
  check('fix round 1 (I1): owed again once (closeReowed), its re-ask recorded with its last sentence; unheard a second time it counts as given: "say goodbye and end", the end_lesson accepted', JSON.stringify(on.unheardReowed) === '["invite"]' && on.unheardLast?.step === 'invite' && !on.twice.facts.includes(V2_CLOSE_INVITE_UNHEARD_LINE) && /then say goodbye and end the lesson in this reply/.test(on.twice.facts) && on.twice.closed && !on.twice.results.some((x) => /^not ended/.test(x)), [on.unheardReowed, on.unheardLast, on.twice]);
  check('fix round 1 (I2): no wording dependence: "Anything on your mind before we wrap up today?" as the last sentence, unheard: owed again; not in the unheard list: not', on.oddUnheard.facts.includes(V2_CLOSE_INVITE_UNHEARD_LINE) && !on.oddHeard.facts.includes(V2_CLOSE_INVITE_UNHEARD_LINE) && /then say goodbye and end the lesson in this reply/.test(on.oddHeard.facts), [on.oddUnheard.invited, on.oddHeard.invited]);
  check('fix round 1 (I2): by position: an unheard "Do you have any questions…?" that is not the reply\'s last sentence re-owes nothing', !on.midHeard.facts.includes(V2_CLOSE_INVITE_UNHEARD_LINE) && /then say goodbye and end the lesson in this reply/.test(on.midHeard.facts));
  check('the pin: words said over the unheard ask do not clear it ("ask-unheard"); heard, it clears as before; without the gist (v1 / flag off) as before', on.pinOver.clear === false && on.pinOver.reason === 'ask-unheard' && on.pinHeard.clear === true && on.pinNoGist.clear === true, [on.pinOver, on.pinHeard, on.pinNoGist]);
  {
    const src = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'session', 'TutorSession.tsx'), 'utf8');
    const hook = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'useV2Turns.ts'), 'utf8');
    check('wiring: TutorSession passes the pin\'s gist only for v2 with the switch on; useV2Turns keeps the unheard sentences on the student entry under it', /TUTOR_V2_UNHEARD_ASK_OWED && brainVersion === 'v2' \? \{ unheardGist: questionPin\.gist \}/.test(src) && /TUTOR_V2_UNHEARD_ASK_OWED && stateRef\.current\.unheard\?\.length \? \[\.\.\.stateRef\.current\.unheard\]/.test(hook));
  }
  check('qpinAskUnheard: the pin\'s gist matched to an unheard sentence by its words; not to others', qpinAskUnheard(T103_SENTENCES, 'Any questions before we finish?') && !qpinAskUnheard(T103_SENTENCES.slice(0, 2), 'Do you have any questions before we finish?') && !qpinAskUnheard(undefined, 'x'));
  check('the check card\'s question unheard (T101 cut at it): not counted asked; the check is owed in this reply (its ask line), recorded when asked', on.checkUnheard.facts.includes('closing check: there is time for the plan\'s check question') && !on.checkUnheard.facts.includes('your last reply asked the check question') && typeof on.checkUnheard.check?.askedAt === 'number' && on.checkUnheard.check.askedAt === 18.6 * MIN && on.checkUnheard.late === null, on.checkUnheard);
  check('the check heard: their words are the answer, and the answer line says reading the card back is not an explanation', on.checkHeard.facts.includes(V2_CLOSE_CHECK_READ_BACK) && /your last reply asked the check question/.test(on.checkHeard.facts) && typeof on.checkHeard.check?.answeredAt === 'number', on.checkHeard.facts.split('\n').filter((l) => /closing check/.test(l)));
  check('T101: "Before we finish, one check question." then the card: the card\'s question spoken without "Before we finish" again (the card unchanged)', (on.t101.spoken.match(/Before we finish/g) ?? []).length === 1 && /Can you explain the difference between these two sentences\?/.test(on.t101.spoken) && on.t101.cards.some((x) => /^Before we finish, can you explain/.test(x)), on.t101);
  check('v2DropSaidLead: only a lead-in the sentence just before said', v2DropSaidLead('Before we finish, can you explain it?', 'Good. Before we finish, one check question.') === 'Can you explain it?' && v2DropSaidLead('Before we finish, can you explain it?', 'Good work today.') === 'Before we finish, can you explain it?' && v2DropSaidLead('What did you do?', 'Before we finish.') === 'What did you do?');

  console.log('fix round 1  REPEAT_NOT_MISHEARD: a correction that ends on a repeat ask is counted');
  check('T12 (correction card, ends 「もう一度言ってみてください。」): the correction counted (practice signal wrong) and recorded for a re-test', on.t12.events.some((e) => /^v2_practice_signal wrong/.test(e)) && on.t12.retests.some((x) => x.right === 'I sell washing machines to customers.'), on.t12);
  check('a real mishear ("Sorry, I didn\'t catch that. Could you say it again?", no card): nothing counted, as before', on.mishear.events.length === 0 && on.mishear.retests.length === 0, on.mishear);

  console.log('3  FREE_CONV_NO_STARTER: no starter unless asked; the corrections-spent line where the model reads it');
  check('an ordinary answer in the conversation: the positive line (ask and stop), and no general starter line', hasFreeLine(on.convPlain) && !on.convPlain.includes(V2_STARTER_LINE), on.convPlain.split('\n').filter((l) => /starter|free conversation/.test(l)));
  check('after a request for help, or a silence turn: no such line (a starter may be given)', !hasFreeLine(on.convHelp) && !hasFreeLine(on.convSilence));
  const tl = on.convThird.split('\n');
  const aloudAt = tl.findIndex((l) => NO_ALOUD.test(l)); const cardAt = tl.findIndex((l) => /^their answer just now had/.test(l));
  check('T70 with two corrections made: the "no more aloud" line is sent, right before the card line of their answer', aloudAt >= 0 && cardAt === aloudAt + 1, tl.slice(Math.max(0, aloudAt - 1), aloudAt + 2));
  check('a part that is no free conversation (Present perfect) has no such line', !hasFreeLine(on.pp1Facts));

  console.log('4  OPENING_PAGE_FIRST: page 1 is the overview page with the plan title');
  check('the opening reply with its own note: one page "Overview", the plan title heading first, the note under it', JSON.stringify(on.open.pages.map((p) => p.title)) === '["Overview"]' && on.open.pages[0]!.items.length === 2 && /^annotate:Talking About Your Work and Recent Projects/.test(on.open.pages[0]!.items[0]!) && /present perfect/.test(on.open.pages[0]!.items[1]!), on.open);
  check('…the page is the first call, and the stored reply opens with the page and heading blocks', on.open.calls[0] === 'new_page' && /^<board page>Overview<\/board>\n<board note style="heading">Talking About Your Work and Recent Projects<\/board>/.test(on.open.stored), [on.open.calls, on.open.stored.slice(0, 120)]);
  check('an opening reply that paints nothing: the same page and heading (as 7w)', JSON.stringify(on.openBare) === JSON.stringify([{ title: 'Overview', items: ['annotate:Talking About Your Work and Recent Projects'] }]), on.openBare);
  check('the model\'s own Overview page block stays on that page (one page)', on.openOwnPage.length === 1 && on.openOwnPage[0]!.title === 'Overview', on.openOwnPage);
  check('a plan without part names and a maths lesson: unchanged (no overview page first)', on.openUnlabelled[0]?.title !== 'Overview' && on.openMaths[0]?.title !== 'Overview' && on.openMaths[0]!.items.some((x) => /linear equations/.test(x)), [on.openUnlabelled, on.openMaths]);

  console.log('5  RETEST_QUESTION: re-tests the tutor can ask');
  check('T20\'s correction is recorded with its corrected sentence and the question that drew it (T18, its English question)', on.recorded?.right === 'Retail customers need a machine to clean clothes.' && on.recorded?.question === 'What kind of customers did you sell to in China?', on.recorded);
  check('…the question survives JSON → v2ReadClientState → v2ScopeCarried', on.readQ === 'What kind of customers did you sell to in China?' && on.scopedQ === on.readQ, [on.readQ, on.scopedQ]);
  check('in Present perfect the retest line gives both: the sentence and the question to ask again in fresh words', on.pp1Facts.includes(RETEST_Q), on.pp1Facts.split('\n').filter((l) => /retest/.test(l)));
  check('v2QuestionOfReply: the English question of a bilingual reply, a lead "I asked:" off', v2QuestionOfReply('Of course. I asked: What kind of customers did you sell to in China? 「中国でどんなお客様に売りましたか？」\n\nPlease answer with one short sentence.') === 'What kind of customers did you sell to in China?' && v2QuestionOfReply('Good. Tell me more.') === null && v2QuestionOfReply('Almost. Can you say the sentence once more?') === null);

  console.log('6  OPTIONAL_ONE_MORE: leaving a held optional part');
  check('two items scored, past half its minutes, 1.4 of its 3 minutes left: "one more, or move on?" before leaving it', ONE_MORE.test(on.liftedFacts) && !HOLD.test(on.liftedFacts), on.liftedFacts.split('\n').filter((l) => /^time:/.test(l)));
  check('…not once its own minutes are spent, not after they ask to move on, not while held (the hold line says it)', !ONE_MORE.test(on.liftedLateFacts) && !ONE_MORE.test(on.liftedLeaveFacts) && !ONE_MORE.test(on.heldOneFacts) && HOLD.test(on.heldOneFacts));

  console.log('other lessons');
  check('a typed language lesson and a maths voice lesson: no 7z lines', ![V2_FREE_CONV_NO_STARTER_LINE, V2_FREE_CONV_PARTNER_LINE, V2_CLOSE_INVITE_UNHEARD_LINE, V2_CLOSE_CHECK_READ_BACK].some((x) => on.typedFacts.includes(x) || on.mathsFacts.includes(x)) && !ONE_MORE.test(on.mathsFacts));

  console.log('each switch off alone (a child process per switch): as at 6a5f3c8b for that item');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC8_7Z_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Awaited<ReturnType<typeof probe>>;
  };
  const others = (off: Awaited<ReturnType<typeof probe>>, but: string) => [
    but === 'PART_YES_CHOICES' || YES_LINE.test(off.entryFacts),
    but === 'UNHEARD_ASK_OWED' || off.unheard.facts.includes(V2_CLOSE_INVITE_UNHEARD_LINE),
    but === 'FREE_CONV_NO_STARTER' || hasFreeLine(off.convPlain),
    but === 'OPENING_PAGE_FIRST' || off.open.pages[0]?.title === 'Overview',
    but === 'RETEST_QUESTION' || off.pp1Facts.includes(RETEST_Q),
    but === 'OPTIONAL_ONE_MORE' || ONE_MORE.test(off.liftedFacts),
    but === 'REPEAT_NOT_MISHEARD' || off.t12.retests.length > 0,
  ].every(Boolean);
  {
    const off = child('PART_YES_CHOICES');
    check('PART_YES_CHOICES off: the 7x line with the plan\'s whole question', !YES_LINE.test(off.entryFacts) && off.entryFacts.includes(OLD_FIRST(PLAN_Q)) && others(off, 'PART_YES_CHOICES'));
  }
  {
    const off = child('UNHEARD_ASK_OWED');
    check('UNHEARD_ASK_OWED off: as live: the invitation counted, "say goodbye and end", T105 closes; the check counted asked; no read-back line; "Before we finish" twice', off.unheard.closed && /then say goodbye and end the lesson in this reply/.test(off.unheard.facts)
      && /your last reply asked the check question/.test(off.checkUnheard.facts) && !off.checkHeard.facts.includes(V2_CLOSE_CHECK_READ_BACK) && (off.t101.spoken.match(/Before we finish/g) ?? []).length === 2 && others(off, 'UNHEARD_ASK_OWED'), [off.unheard.closed, off.pinOver, (off.t101.spoken.match(/Before we finish/g) ?? []).length]);
  }
  {
    const off = child('FREE_CONV_NO_STARTER');
    const ot = off.convThird.split('\n'); const oa = ot.findIndex((l) => NO_ALOUD.test(l));
    check('FREE_CONV_NO_STARTER off: no positive line; the starter line as before; the corrections line among the next question\'s lines', !hasFreeLine(off.convPlain) && off.convPlain.includes(V2_STARTER_LINE) && oa >= 0 && ot.findIndex((l) => /^their answer just now had/.test(l)) !== oa + 1 && others(off, 'FREE_CONV_NO_STARTER'));
  }
  {
    const off = child('OPENING_PAGE_FIRST');
    check('OPENING_PAGE_FIRST off: the note on an untitled page 1 (the 7w fallback only for a bare opening)', off.open.pages[0]?.title !== 'Overview' && JSON.stringify(off.openBare) === JSON.stringify(on.openBare) && others(off, 'OPENING_PAGE_FIRST'), off.open.pages);
  }
  {
    const off = child('RETEST_QUESTION');
    check('RETEST_QUESTION off: no question kept; the 7x retest line', !off.recorded?.question && !off.pp1Facts.includes(RETEST_Q) && /Your next new question must make them say/.test(off.pp1Facts) && others(off, 'RETEST_QUESTION'));
  }
  {
    const off = child('REPEAT_NOT_MISHEARD');
    check('REPEAT_NOT_MISHEARD off: T12 read as a mishear, nothing counted (as live)', off.t12.events.length === 0 && off.t12.retests.length === 0 && others(off, 'REPEAT_NOT_MISHEARD'), off.t12);
  }
  {
    const off = child('OPTIONAL_ONE_MORE');
    check('OPTIONAL_ONE_MORE off: no "one more, or move on?" line', !ONE_MORE.test(off.liftedFacts) && others(off, 'OPTIONAL_ONE_MORE'));
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
