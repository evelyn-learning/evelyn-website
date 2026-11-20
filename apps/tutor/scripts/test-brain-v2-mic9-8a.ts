/// <reference types="node" />
/**
 * Tutor brain v2 — Task 8a: mic test 9 (embed-1795132864767): the conversation as a conversation, a re-test asked once, the level check
 * counted by questions, the summary guard over every correction, a lost correction (T28). The session's plan (gdi-work-projects-v1, the
 * same as the session's plan row) and its real turns (task-8a-investigation.md). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic9-8a
 *
 *  1 FREE_CONV_PARTNER        T86 → T87 in the Conversation part: the partner line (own thought, open questions, ask for more after a
 *                             one-sentence answer, one question, no starter); the core part's time line says "let them say more"
 *  2 RETEST_ASK_ONCE          T49–T55: the line sent at turn 30 (T50 asks), not re-sent at T52 / T54; a reply that asks nothing keeps the
 *                             3 sends; T30's retest (asked, target not used) is `not_used` at the part change, never `not_asked`
 *  3 LEVEL_CHECK_PUT          T6–T11 (T8 cut by the barge-in T9, T10 asks the same follow-up again): not set after 1 question, nor at
 *                             T11 (2 put); set after 3; set once the level-check part has had its 3 minutes
 *  4 CORRECTIONS_ALL_GUARDED  the lesson's 16 corrections from T42 on: T42's "I attended a robotics exhibition…" pushed out of the 12, still
 *                             refused under "What went well"; round trip; an old stored state reads
 *  5 T28 (no flag)            "Now, have you worked…?" (T26) asked for a sentence: T27 is owed a card and T28's correction is counted
 *  each switch off alone (a child process per switch); maths voice and typed lessons unchanged.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Retest, type V2Session, type V2State, type V2ToolCall } from '../src/lib/tutor/v2/types';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { trimToSpoken } from '../src/lib/tutor/v2/interrupted';
import { V2_FREE_CONV_NO_STARTER_LINE, V2_FREE_CONV_PARTNER_LINE } from '../src/lib/tutor/v2/adaptive';
import { V2_LEVEL_WAIT, v2AnswerHasContent, v2LevelSetTooEarly } from '../src/lib/tutor/v2/working-level';
import { v2LevelQuestionOf, v2LevelQuestionsPut } from '../src/lib/tutor/v2/level-check-count';
import { V2_MAX_CORRECTIONS, V2_SUMMARY_WELL_REFUSED, v2NoteCorrection, v2SummaryCardCheck } from '../src/lib/tutor/v2/summary-marks';
import { v2PracticeAnswerSentences } from '../src/lib/tutor/v2/learner-card';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC9_8A_CHILD;
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
const lang: V2Session = { studentName: 'Praveen', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI, pronunciation: true };
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
async function turn(session: V2Session, state: V2State, said: string | null, replies: Reply[], atMin: number) {
  const m = scripted(replies);
  const r = await runV2Turn({ session, state: structuredClone(state), studentSaid: said, callModel: m.call, boardPass: false, mathsCheck: false, nowMs: atMin * MIN });
  return { r, facts: m.facts.join('\n'), results: m.results, events: (r.events ?? []).map((e) => `${e.type} ${e.message}`) };
}

// ── The session's turns (transcript indexes as in the investigation) ──
const T0 = 'Hello, I\'m Ryota, and welcome to your English lesson! Today we\'ll talk about your work and a project you\'ve been involved in, and practise two grammar points: the present perfect and the past simple. Does that sound good to you?';
const T2 = 'Great, let\'s begin. Today you\'ll talk about your job and a project you\'ve worked on, and practise two grammar points: the present perfect for experience, and the past simple for finished events at a specific time. First, there\'s a short level check so I can adjust the lesson for you. Are you ready?';
const T4 = 'Good, the overview is done. Next is the level check, a short friendly chat in English to see what you can already do. Do you have a question first, or shall we go on?';
// T6 as stored: its question only on the card (WB4), not spoken.
const T6 = '<board page>Level check</board>\nOkay, this is a short, friendly chat in English. Please answer in English, and don\'t worry about mistakes. I want to hear what you can already do, so the lesson fits you.\n\n<board problem gloss="お仕事について教えてください。何をしていますか？">Can you tell me a little about your job? What do you do?</board>';
const T7 = 'Um, I sales manager at Microsoft.';
const T8 = 'That\'s clear, thank you. What kind of products do you sell?\n\n<board problem gloss="どんな製品を売っていますか？">What kind of products do you sell?</board>';
const T9 = 'And I write software program.';
const T10 = 'Thank you, that\'s clear. What kind of products do you sell?\n\n<board problem gloss="どんな製品を売っていますか？">What kind of products do you sell?</board>';
const T11 = 'I don\'t sell, I write programs.';
const T12 = 'Ah, I understand. Today we\'ll practise speaking in short, simple English, step by step, and I\'ll explain things in Japanese when it helps. Next is Your job.\n\nDo you have a question before we go on, or are you ready?';
const SET = { name: 'set_working_level', input: { level: 'beginner', evidence: 'short sentences with missing verbs' } };
const LEVEL_PAGES: V2BoardPage[] = [{ title: 'Overview', items: [] }, { title: 'Level check', items: [] }];
/** The check entered at lesson 1.15 (session 1:18.85, the clock started at the tap, about 0:10). */
const CHECK_AT = 1.15;
const checkState = (history: Anthropic.MessageParam[]): V2State => ({ ...newV2State(0), board: { pages: structuredClone(LEVEL_PAGES), current: 1 }, goals: goalsThrough(1), partStart: { part: 'level-check', at: CHECK_AT * MIN }, history });
const pre = [u(START), a(T0), u('Yes.'), a(T2), u('Yes.'), a(T4), u('Let\'s go.'), a(T6)];
/** T9's turn: T8 cut before any sentence was heard (v2_unheard_trimmed: the record keeps 0). */
const atT9 = () => trimToSpoken(checkState([...pre, u(T7), a(T8)]), ['That\'s clear, thank you.', 'What kind of products do you sell?'], 0, true);
const atT11 = () => { const s = atT9(); delete s.unheard; s.history.push(u(T9), a(T10)); return s; };
const Q2 = 'Thank you. Have you ever worked with an international customer? If so, can you tell me about the experience?';
const A2 = 'Yes, I worked with a big company in Canada on a website.';

// ── Present perfect, turn 18 (T26 → T27 → T28) ──
const T14 = '仕事の話は、短い文から始めましょう。「I am a sales manager.」のように、「I am」の後に「a」と職業名を入れます。「I write programs.」は、プログラムを書く、という意味です。\n\nNow, in one or two short sentences, what do you do at work?';
const T26 = '<board page>Present perfect</board>\nPresent perfect は、過去に始まって今も続いていることを話すときに使います。\n\nNow, have you worked for your current company for a long time?';
const T27 = 'Uh, I have worked uh in Microsoft uh 5 years.';
const T28 = '「have worked」はよくできています。ただ、期間を言うときは「for」が必要です。\n\n<board sentence gloss="Microsoft で5年働いています">I have worked at Microsoft for five years.</board>\n\nもう一度、「I have worked at Microsoft」から始めて、最後に「for five years」を付けて言ってみてください。';
const PP_PAGES: V2BoardPage[] = [{ title: 'Overview', items: [] }, { title: 'Level check', items: [] }, { title: 'Your job', items: [card('j1', 'I write software code.'), card('j2', 'Students who study at home use my websites.')] }, { title: 'Present perfect', items: [] }];
const atT27 = () => base({ board: { pages: structuredClone(PP_PAGES), current: 3 }, goals: goalsThrough(3), partStart: { part: 'present-perfect', at: 4.2 * MIN }, support: { step: 'normal', wrong: 0, clean: 0, part: 'present-perfect' },
  history: [u(START), a(T0), u('Yes.'), a(T12), u('I\'m ready.'), a(T14), u('Uh, I write software program code'), a('Good. <board sentence>I write software code.</board> Ready for the next part?'), u('Yes.'), a(T26)] });

// ── Present perfect, turn 19 (T29 → T30), the retest "who study at home" sent twice already ──
const T29 = 'I have worked at Microsoft for 5 years.';
const T30 = 'Yes, that\'s right. "I have worked at Microsoft for five years." 「for」で期間を言えています。\n\n Who are the people who use the websites you make?';
const WHO: V2Retest = { part: 'topic-intro', said: 'Students use websites who study home.', right: 'Students who study at home use my websites.', target: ['who study at home'], turn: 14, offered: 2, in: 'present-perfect', askedAt: 17, lastAt: 18, question: 'Who uses your websites?' };
const atT29 = () => { const s = atT27(); s.history.push(u(T27), a(T28)); s.retests = [structuredClone(WHO)]; return s; };
// Past simple begins (turn 25): the retest left behind.
const T38 = 'Yes, "I have worked with JavaScript for three years" is correct. Present perfect is done. Next is Past simple, for things that finished at a specific time. Ready to go on, or do you have a question first?';
const T40 = '<board page>Past simple</board>\n過去の特定の時に終わった出来事は、過去形を使います。\n\n Did you attend any business events or exhibitions last year?\n\nPlease answer in one or two sentences.';

// ── Conversation (entered at lesson 8.7) ──
const CONV_PAGES: V2BoardPage[] = [...structuredClone(PP_PAGES), { title: 'Past simple', items: [card('s1', 'I attended a robotics exhibition in Tokyo last year.')] }, { title: 'Conversation', items: [] }];
const T48 = 'Yes, that\'s right. Past simple is done: you used "attended" with "last year" correctly. Next is Conversation, where we talk more freely about your work.\n\nAny questions first, or shall we go on?';
const T50 = 'Let\'s talk a little more about your work. First, a quick question about JavaScript.\n\n How many years have you used JavaScript?';
const T51 = 'Uh, I use JavaScript uh for 2 year.';
const T52 = '「I use JavaScript」は今も続いている経験なので、「I have used」と言います。期間の「2年」は「two years」と複数形です。\n\n<board sentence stress="have used | two years">I have used JavaScript for two years.</board>\n\nもう一度言ってみてください。';
const T53 = 'I have used JavaScript for 2 years.';
const T54 = 'Yes, that\'s right. You used "for" with a period of time. Now, in your own words, how long have you been working with JavaScript?';
const T55 = 'I have used JavaScript for 2 years.';
const T56 = '「I have used JavaScript for two years.」は正しく言えています。では、自分で答えてみてください。\n\n How long have you been a programmer?';
const JS: V2Retest = { part: 'present-perfect', said: 'I work with JavaScript for 3 years.', right: 'I have worked with JavaScript for three years.', target: ['i have worked'], turn: 23, question: 'How long have you worked with JavaScript?' };
const OTHERS: V2Retest[] = [{ ...WHO, offered: 3, lastAt: 19, outcome: 'not_asked' }, { part: 'present-perfect', said: 'I make website student use home to get good marks.', right: 'Students use my websites to get good marks.', target: ['students use', 'use my websites'], turn: 20, offered: 3, in: 'past-simple', askedAt: 25, lastAt: 27, outcome: 'missed' }];
const RETEST_LINE = 'ask them "How long have you worked with JavaScript?" again in fresh words';
const inConv = (history: Anthropic.MessageParam[], extra: Partial<V2State> = {}) => base({ board: { pages: structuredClone(CONV_PAGES), current: 5 }, goals: goalsThrough(5), partStart: { part: 'open-conversation', at: 8.7 * MIN },
  support: { step: 'normal', wrong: 0, clean: 0, part: 'open-conversation' }, retests: [...structuredClone(OTHERS), structuredClone(JS)], history, ...extra });
const convHead = [u(START), a(T0), u('Yes.'), a(T38), u('yes.'), a(T40), u('Uh, yes, I attend uh robotics exhibition Tokyo last year.'), a(T48), u('Uh, go on.')];
/** T49's turn: Past simple done, the Conversation page held for their yes (T48's ask). */
const atT49 = () => base({ board: { pages: structuredClone(CONV_PAGES).slice(0, 5), current: 4 }, goals: goalsThrough(5), partStart: { part: 'past-simple', at: 6.7 * MIN }, heldPage: { title: 'Conversation', part: 'open-conversation', at: 4 },
  support: { step: 'normal', wrong: 0, clean: 0, part: 'past-simple' }, retests: [...structuredClone(OTHERS), structuredClone(JS)], history: convHead.slice(0, -1) });
const T86 = 'That\'s a lot of work for your team! What did you learn from that project?';
const T87 = 'I learn how to code properly in JavaScript and also in the internals of the robot.';
const T88 = 'That\'s a great thing to have learned. <board sentence stress="learned">I learned how to code properly in JavaScript, and also how the robot works inside.</board> What will you use this skill for at work now?';

// ── The lesson's corrections from T42 on (said → the card), in order ──
const CORRECTIONS: Array<[string, string]> = [
  ['I attend uh robotics exhibition Tokyo last year.', 'I attended a robotics exhibition in Tokyo last year.'],
  ['I walk on um uh robotic floor, uh watch uh dancing and singing robots.', 'I walked on the robot floor and watched dancing and singing robots.'],
  ['Uh, school student who uh study uh private school to get uh better grade.', 'Students who study at a private school use my websites to get better grades.'],
  ['Uh, I use JavaScript uh for 2 year.', 'I have used JavaScript for two years.'],
  ['Um, I um am programmer for 7 year.', 'I have been a programmer for seven years.'],
  ['Uh, I work on uh uh website for um website for a big company in Canada last year.', 'I worked on a website for a big company in Canada last year.'],
  ['Um, the website sell their washing machine online.', 'The website sells their washing machines online.'],
  ['Uh, yes, I work where on uh 5 more projects at Microsoft.', 'I have worked on five more projects at Microsoft.'],
  ['One was develop robot.', 'One was developing a robot.'],
  ['Yes, project uh was finished and boss very happy.', 'The project was finished, and my boss was very happy.'],
  ['I finish project last year.', 'I finished the project last year.'],
  ['Um, hardest part of the robot project was to uh make robot dance.', 'The hardest part was making the robot dance.'],
  ['We wrote program that would teach robot dancing moves.', 'We wrote a program that would teach robot dancing moves.'],
  ['Uh, the team took um 6 month to finish the program.', 'The team took six months to finish the program.'],
  ['I learn how to code properly in JavaScript and also in the internals of the robot.', 'I learned how to code properly in JavaScript, and also how the robot works inside.'],
  ['The children like robot because they find them very amusing uh as they do funny things.', 'The children like robots because they find them very amusing, as they do funny things.'],
];
const WB76 = 'I attended a robotics exhibition in Tokyo last year.';

async function probe() {
  // 1: T86 → T87 at lesson 14.0 (two corrections aloud spent, the invitation given at T68).
  const conv = await turn(lang, inConv([...convHead, a(T50), u(T51), a(T86)], { freeConv: { part: 'open-conversation', corrected: 2, invited: true }, retests: [...structuredClone(OTHERS), { ...structuredClone(JS), offered: 3, in: 'open-conversation', askedAt: 30, lastAt: 32, outcome: 'missed' }] }), T87, [{ text: T88 }], 14.0);
  const convHelp = await turn(lang, inConv([...convHead, a(T86)], { freeConv: { part: 'open-conversation', corrected: 2, invited: true } }), 'How do I say what I learned?', [{ text: 'You can say: I learned…' }], 14.0);
  const pp = await turn(lang, atT29(), T29, [{ text: T30 }], 5.1);

  // 2: the retest in the Conversation part, turns 30–33 (T49 … T55).
  const t30 = await turn(lang, atT49(), 'Uh, go on.', [{ text: T50 }], 8.9);
  const t31 = await turn(lang, t30.r.state, T51, [{ text: T52 }], 9.2);
  const t32 = await turn(lang, t31.r.state, T53, [{ text: T54 }], 9.4);
  const t33 = await turn(lang, t32.r.state, T55, [{ text: T56 }], 9.7);
  // A first send whose reply asks nothing (a correction and a repeat ask only): the line is sent 3 times, then no more.
  // (Not on the turn the part opens: the runtime asks the part's first question when that reply asks nothing.)
  const n1 = await turn(lang, inConv([...convHead, a('Let\'s talk a little more about your work. What do you do on a normal day?')]), T51, [{ text: T52 }], 9.2);
  const n2 = await turn(lang, n1.r.state, T53, [{ text: 'Good. Please say the sentence once more, a little more slowly.' }], 9.4);
  const n3 = await turn(lang, n2.r.state, T55, [{ text: 'Good, that is clear now.' }], 9.7);
  const n4 = await turn(lang, n3.r.state, 'I write programs for websites.', [{ text: 'I see.' }], 10.0);
  // T30: send 3 of "who study at home" asked the question; the part changes at T39 (turn 25) with no outcome.
  const t19 = pp;
  const leave = (st: V2State) => { const s = structuredClone(st); s.history.push(u('Students use my websites to get good marks.'), a(T38)); s.board.pages.push({ title: 'Past simple', items: [] }); s.board.current = 4; s.goals = goalsThrough(4); s.partStart = { part: 'past-simple', at: 6.7 * MIN }; return s; };
  const t25 = await turn(lang, leave(t19.r.state), 'Uh, yes, I attend uh robotics exhibition Tokyo last year.', [{ text: '「attend」は過去形にします。' }], 7.4);
  // Round trip of the new field.
  const read = v2ReadClientState(JSON.parse(JSON.stringify(t30.r.state)));
  const scoped = read ? v2ScopeCarried(structuredClone(read), lang) : null;

  // 3: the level check.
  const gate = {
    t7: v2LevelSetTooEarly(checkState([...pre]), T7),
    t9: v2LevelSetTooEarly(atT9(), T9),
    t11: v2LevelSetTooEarly(atT11(), T11),
    three: v2LevelSetTooEarly((() => { const s = atT11(); s.history.push(u(T11), a(Q2)); return s; })(), A2),
    put: v2LevelQuestionsPut(atT11().history, T11, v2AnswerHasContent),
  };
  const lv11 = await turn(lang, atT11(), T11, [{ text: T12, tools: [SET] }, { text: 'Okay.' }], 1.8);
  const lvThree = await turn(lang, (() => { const s = atT11(); s.history.push(u(T11), a(Q2)); return s; })(), A2, [{ text: 'Thank you, that\'s clear. Next is Your job. Are you ready?', tools: [SET] }, { text: 'Okay.' }], 2.4);
  const lvTime = await turn(lang, atT11(), T11, [{ text: T12, tools: [SET] }, { text: 'Okay.' }], CHECK_AT + 3.05);

  // 4: the corrections, one card each after its answer.
  const st4 = base({ board: { pages: [...structuredClone(CONV_PAGES), { title: 'Summary', items: [{ id: 'h1', tool: 'annotate', summary: 'What went well' }] }], current: 6 } });
  for (const [said, right] of CORRECTIONS) v2NoteCorrection(lang, st4, right, [], said);
  const wellCall: V2ToolCall = { id: 'h1', name: 'annotate', args: { style: 'heading', text: 'What went well' }, outcome: 'painted' };
  const improveCall: V2ToolCall = { id: 'h2', name: 'annotate', args: { style: 'heading', text: 'To improve' }, outcome: 'painted' };
  const st4b = structuredClone(st4); st4b.board.pages[6]!.items.push({ id: 'h2', tool: 'annotate', summary: 'To improve' });
  const guard = {
    kept: (st4.corrections ?? []).map((c) => c.sentence), older: st4.correctedOlder ?? [],
    well: v2SummaryCardCheck(lang, st4, { sentence: WB76 }, [wellCall]),
    wellNew: v2SummaryCardCheck(lang, st4, { sentence: 'The team took six months to finish the program.' }, [wellCall]),
    wellRight: v2SummaryCardCheck(lang, st4, { sentence: 'I can use the skill to create more robots.' }, [wellCall]),
    improve: v2SummaryCardCheck(lang, st4b, { sentence: WB76 }, [wellCall, improveCall]),
  };
  const read4 = v2ReadClientState(JSON.parse(JSON.stringify(st4)));
  const scoped4 = read4 ? v2ScopeCarried(structuredClone(read4), lang) : null;
  const old = structuredClone(st4); delete old.correctedOlder;
  const readOld = v2ReadClientState(JSON.parse(JSON.stringify(old)));

  // 5: T28.
  const t18 = await turn(lang, atT27(), T27, [{ text: T28 }], 4.6);
  const owed = v2PracticeAnswerSentences(lang, atT27(), T27);

  // Other lessons.
  const typed = await turn(typedLang, inConv([...convHead, a(T86)], { freeConv: { part: 'open-conversation', corrected: 2, invited: true } }), T87, [{ text: 'Why?' }], 14.0);
  const mathsTurn = await turn(maths, { ...newV2State(0), history: [u('x'), a('What is 3 times 4?')] }, '12', [{ text: 'Yes, 12. What is 6 × 7?' }], 18.1);

  const retestOf = (s: V2State) => (s.retests ?? []).find((r) => r.right === JS.right) ?? null;
  const whoOf = (s: V2State) => (s.retests ?? []).find((r) => r.right === WHO.right) ?? null;
  return {
    convFacts: conv.facts, convHelpFacts: convHelp.facts, ppFacts: pp.facts,
    t30: { facts: t30.facts, events: t30.events, retest: retestOf(t30.r.state) }, t31: { facts: t31.facts, retest: retestOf(t31.r.state) }, t32: { facts: t32.facts, retest: retestOf(t32.r.state) }, t33: { facts: t33.facts, retest: retestOf(t33.r.state) },
    n: [n1, n2, n3, n4].map((x) => ({ facts: x.facts, events: x.events, retest: retestOf(x.r.state), spoken: x.r.spoken })),
    t19: { events: t19.events, retest: whoOf(t19.r.state) }, t25: { events: t25.events, retest: whoOf(t25.r.state) },
    readPut: retestOf(read ?? newV2State(0))?.put ?? null, scopedPut: retestOf(scoped ?? newV2State(0))?.put ?? null,
    gate, lv11: { results: [...lv11.results, ...lv11.r.toolCalls.filter((c) => c.name === 'set_working_level').map((c) => c.outcome)], level: lv11.r.state.workingLevel ?? null, facts: lv11.facts }, lvThree: { results: lvThree.results, level: lvThree.r.state.workingLevel ?? null }, lvTime: { results: lvTime.results, level: lvTime.r.state.workingLevel ?? null, facts: lvTime.facts },
    guard, readOlder: read4?.correctedOlder ?? null, scopedOlder: scoped4?.correctedOlder ?? null, readOld: { corrections: readOld?.corrections?.length ?? 0, older: readOld?.correctedOlder ?? null },
    t18: { events: t18.events, retests: t18.r.state.retests ?? [], facts: t18.facts }, owed,
    typedFacts: typed.facts, mathsFacts: mathsTurn.facts,
  };
}

async function main() {
  const on = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }
  const LET_MORE = 'go on with it: let them say more (a follow-up that asks for a reason, an example or what happened)';
  const ANOTHER = 'go on with it (another question, or a follow-up on their answer)';

  console.log('1  FREE_CONV_PARTNER: a conversation, not an interview');
  check('T87 (one sentence) in the Conversation part: the partner line (own thought now and then, open questions, ask for more after a one-sentence answer, one question, no starter)', on.convFacts.includes(V2_FREE_CONV_PARTNER_LINE) && !on.convFacts.includes(V2_FREE_CONV_NO_STARTER_LINE), on.convFacts.split('\n').filter((l) => /free conversation/.test(l)));
  check('the line names no part, topic or tenant', !/conversation part \(|robot|JavaScript|Microsoft|work|GDI|Nagoya/i.test(V2_FREE_CONV_PARTNER_LINE.replace(/conversation partner/, '')));
  check('the core part\'s time line (the Conversation, saved time): "let them say more", not "another question"', on.convFacts.includes(LET_MORE) && !on.convFacts.includes(ANOTHER), on.convFacts.split('\n').filter((l) => /^time:|this part \(/.test(l)));
  check('the help asked: no partner line (a starter may be given), as 7z', !on.convHelpFacts.includes(V2_FREE_CONV_PARTNER_LINE));
  check('Present perfect (no free conversation): no partner line; its time line keeps "another question"', !on.ppFacts.includes(V2_FREE_CONV_PARTNER_LINE) && on.ppFacts.includes(ANOTHER), on.ppFacts.split('\n').filter((l) => /this part \(/.test(l)));

  console.log('2  RETEST_ASK_ONCE: a re-test question is asked once');
  check('turn 30 (T49 → T50): the line sent (send 1), and T50 asked a question: the retest is put (state, turn 30)', on.t30.facts.includes(RETEST_LINE) && on.t30.retest?.put === on.t30.retest?.lastAt && typeof on.t30.retest?.put === 'number' && on.t30.events.some((e) => /^v2_retest_put .*send=1\/3/.test(e)), [on.t30.retest, on.t30.events]);
  check('turn 31 (T51 → T52) and turn 32 (T53 → T54): the line not sent again; the retest stays open, sent once', !on.t31.facts.includes(RETEST_LINE) && !on.t32.facts.includes(RETEST_LINE) && !on.t33.facts.includes(RETEST_LINE) && on.t32.retest?.offered === 1 && !on.t32.retest?.outcome, [on.t31.retest, on.t32.retest]);
  check('T55 (T53 said again, no "have worked"): no outcome by turns; the outcome waits for the part to end', !on.t33.retest?.outcome || on.t33.retest.outcome === 'missed', on.t33.retest);
  check('a first send whose reply asks nothing: the line is sent on 3 turns (sends 1–3), then no more', on.n[0]!.facts.includes(RETEST_LINE) && on.n[1]!.facts.includes(RETEST_LINE) && on.n[2]!.facts.includes(RETEST_LINE) && !on.n[3]!.facts.includes(RETEST_LINE) && on.n[2]!.retest?.offered === 3 && on.n.every((x) => x.retest?.put === undefined), on.n.map((x) => x.retest));
  check('T30 (send 3 of "who study at home") asked: put; at the part change (Past simple) its outcome is not_used, never not_asked', typeof on.t19.retest?.put === 'number' && on.t25.retest?.outcome === 'not_used' && on.t25.events.some((e) => /^v2_retest_outcome target="who study at home" outcome=not_used/.test(e)), [on.t19.retest, on.t25.events]);
  check('`put` survives JSON → v2ReadClientState → v2ScopeCarried', on.readPut === on.t30.retest?.put && on.scopedPut === on.readPut, [on.readPut, on.scopedPut]);

  console.log('3  LEVEL_CHECK_PUT: the level check asks the plan\'s questions');
  check('the questions put: T6 by its card, T8 cut before its question (T9 goes on with his answer), T10 the follow-up', v2LevelQuestionOf(T6) === 'Can you tell me a little about your job? What do you do?' && v2LevelQuestionOf('[cut off here: the student began to speak]') === null && v2LevelQuestionOf(T10) === 'What kind of products do you sell?' && v2LevelQuestionOf(T4) === null);
  check('…T7 counts, T9 does not (the cut reply put nothing), T11 does: two questions put and answered', JSON.stringify(on.gate.put.filter((_, i, xs) => i >= xs.length - 3)) === '[true,false,true]', on.gate.put);
  check('not set after 1 question (T7) nor after T9; at T11 (2 put) still not set: set_working_level refused (wait)', [on.gate.t7, on.gate.t9, on.gate.t11].every((x) => !!x && x.startsWith(V2_LEVEL_WAIT)) && /answered 2 of/.test(on.gate.t11 ?? ''), on.gate.t11);
  check('the live turn at T11: refused, no level; the facts count 2 of 3 (not "call set_working_level now")', on.lv11.results.some((x) => x.startsWith(V2_LEVEL_WAIT)) && on.lv11.level === null && /level check: 2 of 3 questions asked and answered/.test(on.lv11.facts) && !/Call set_working_level now/.test(on.lv11.facts), [on.lv11.results, on.lv11.facts.split('\n').filter((l) => /level check/.test(l))]);
  check('the plan\'s question 2 put and answered: 3, set', on.gate.three === null && on.lvThree.level?.level === 'beginner', [on.gate.three, on.lvThree]);
  check('the check\'s 3 minutes up at T11 (2 put): the facts say its time is up, and the level is set', on.lvTime.level?.level === 'beginner' && /level check: its time is up/.test(on.lvTime.facts), [on.lvTime.results, on.lvTime.facts.split('\n').filter((l) => /level check/.test(l))]);

  console.log('4  CORRECTIONS_ALL_GUARDED: a corrected sentence never goes under "What went well"');
  check(`16 corrections: ${V2_MAX_CORRECTIONS} kept in full, T42's pushed out of them, kept as its sentence`, on.guard.kept.length === V2_MAX_CORRECTIONS && !on.guard.kept.includes(WB76) && on.guard.older.includes('i attended a robotics exhibition in tokyo last year'), on.guard);
  check('WB76 under "What went well": refused (as the 7w guard does for a recent one)', on.guard.well === V2_SUMMARY_WELL_REFUSED && on.guard.wellNew === V2_SUMMARY_WELL_REFUSED, [on.guard.well, on.guard.wellNew]);
  check('…a sentence right as said is painted there; under "To improve" WB76 is painted', on.guard.wellRight === null && on.guard.improve === null, [on.guard.wellRight, on.guard.improve]);
  check('round trip: correctedOlder survives JSON → v2ReadClientState → v2ScopeCarried; an older state without it reads (12 corrections, nothing older)', JSON.stringify(on.readOlder) === JSON.stringify(on.guard.older) && JSON.stringify(on.scopedOlder) === JSON.stringify(on.guard.older) && on.readOld.corrections === V2_MAX_CORRECTIONS && on.readOld.older === null, [on.readOlder, on.readOld]);

  console.log('5  T28: the correction that was never counted');
  check('cause: "Now, have you worked…?" (T26) is an ask for a sentence: T27 is owed a card', JSON.stringify(on.owed) === JSON.stringify(['I have worked in Microsoft 5 years.']), on.owed);
  check('turn 18 replayed: the facts carry the card line for T27; T28\'s correction counted (practice signal wrong in Present perfect) and recorded for a re-test', /their answer just now had 1 sentence of their own: 1\. "I have worked in Microsoft 5 years\."/.test(on.t18.facts) && on.t18.events.some((e) => /^v2_practice_signal wrong part=present-perfect/.test(e)) && on.t18.retests.some((r) => r.right === 'I have worked at Microsoft for five years.'), [on.t18.events, on.t18.retests]);

  console.log('other lessons');
  check('a typed language lesson and a maths voice lesson: no 8a lines', ![V2_FREE_CONV_PARTNER_LINE, LET_MORE].some((x) => on.typedFacts.includes(x) || on.mathsFacts.includes(x)));

  console.log('each switch off alone (a child process per switch): as at 48f7cfbb for that item');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC9_8A_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Awaited<ReturnType<typeof probe>>;
  };
  const others = (off: Awaited<ReturnType<typeof probe>>, but: string) => [
    but === 'FREE_CONV_PARTNER' || (off.convFacts.includes(V2_FREE_CONV_PARTNER_LINE) && off.convFacts.includes(LET_MORE)),
    but === 'RETEST_ASK_ONCE' || (!off.t31.facts.includes(RETEST_LINE) && off.t25.retest?.outcome === 'not_used'),
    but === 'LEVEL_CHECK_PUT' || (off.lv11.level === null && off.lvTime.level !== null),
    but === 'CORRECTIONS_ALL_GUARDED' || off.guard.well === V2_SUMMARY_WELL_REFUSED,
    off.t18.events.some((e) => /^v2_practice_signal wrong/.test(e)),
  ].every(Boolean);
  {
    const off = child('FREE_CONV_PARTNER');
    check('FREE_CONV_PARTNER off: the 7z line and the "another question" time line', off.convFacts.includes(V2_FREE_CONV_NO_STARTER_LINE) && !off.convFacts.includes(V2_FREE_CONV_PARTNER_LINE) && off.convFacts.includes(ANOTHER) && !off.convFacts.includes(LET_MORE) && others(off, 'FREE_CONV_PARTNER'));
  }
  {
    const off = child('RETEST_ASK_ONCE');
    check('RETEST_ASK_ONCE off: the line sent on 3 turns whatever was asked (T50, T52, T54), no `put`; T30\'s retest not_asked (as live)', off.t30.facts.includes(RETEST_LINE) && off.t31.facts.includes(RETEST_LINE) && off.t32.facts.includes(RETEST_LINE) && off.t30.retest?.put === undefined && off.t25.retest?.outcome === 'not_asked' && others(off, 'RETEST_ASK_ONCE'), [off.t32.retest, off.t25.retest]);
  }
  {
    const off = child('LEVEL_CHECK_PUT');
    check('LEVEL_CHECK_PUT off: three answers with content (T7, T9, T11) set the level at T11 (as live); the facts said "call it now"', off.gate.t11 === null && off.lv11.level?.level === 'beginner' && /Call set_working_level now/.test(off.lv11.facts) && others(off, 'LEVEL_CHECK_PUT'), off.lv11);
  }
  {
    const off = child('CORRECTIONS_ALL_GUARDED');
    check('CORRECTIONS_ALL_GUARDED off: nothing older kept; WB76 painted under "What went well" (as live)', off.guard.older.length === 0 && off.guard.well === null && off.guard.wellNew === V2_SUMMARY_WELL_REFUSED && others(off, 'CORRECTIONS_ALL_GUARDED'), off.guard);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
