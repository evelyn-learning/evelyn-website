/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7g: mic test 2 (embed-1794941004529), the four items after the time rules (7f). No network, no model.
 *   npm run test:brain-v2-mic2-7g
 *
 *  1  LEVEL_CHECK_CHIP: the level check's chip lights from the reply that begins it until the next part's page (flags 1–2:
 *     "Overview" lit through the whole check; the opening page was "Page 1" and the model marked no goal for the check)
 *  2  CARD_EVERY_SENTENCE: every sentence of a practice answer is listed in the facts, one card each; what the reply left off is
 *     owed in the next facts, once (flag 3: four sentences about his job, one carded)
 *  3  QUESTION_CARD: a practice question in a language lesson is a plain question card, no difficulty (flag 5: "EASY / Problem")
 *  4  CLOCK_FROM_START: the engine's clock starts with the session, not at the hook's mount (5 min left on screen, "we're nearly
 *     out of time" from the tutor)
 *  each switch off alone (a child process per switch): the behaviour before this task for that item, the others as on.
 *
 * The tutor's replies are the session's own (apps/tutor/.v2-flags/gdi-trial-praveen-ton6ag/flags.jsonl, `lastTutor`); the
 * learner's words are his as the flags' notes report them (the flags do not keep the learner's turns).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { v2Progress } from '../src/lib/tutor/v2/progress';
import { v2PartInHand } from '../src/lib/tutor/v2/part-flow';
import { v2LevelCheckBegun } from '../src/lib/tutor/v2/level-check-count';
import { v2LearnerSentences, v2SentencesNotCarded } from '../src/lib/tutor/v2/learner-card';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { v2LeftToStopMin, v2StartClock } from '../src/lib/tutor/v2/time-box';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State, type V2ToolCall } from '../src/lib/tutor/v2/types';
import { TUTOR_V2_CARD_EVERY_SENTENCE, TUTOR_V2_CLOCK_FROM_START, TUTOR_V2_LEVEL_CHECK_CHIP, TUTOR_V2_QUESTION_CARD } from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const CHILD = !!process.env.MIC2_7G_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (CHILD) return;
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
/** The reply streamed in small pieces, then its tool calls; records the facts it was sent. */
function streaming(text: string, after: unknown[] = [], facts: string[] = []): V2ModelCall {
  let n = 0;
  return async (params, onText) => {
    n += 1;
    const last = params.messages[params.messages.length - 1];
    if (n === 1 && Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
    if (n > 1) return msg([], 'end_turn');
    for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece);
    return msg([{ type: 'text', text }, ...after], after.length ? 'tool_use' : 'end_turn');
  };
}
const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const session: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, pronunciation: true, plan: GDI };
const MIN = 60_000;
let clock = 0;
interface Step { state: V2State; calls: V2ToolCall[]; facts: string; spoken: string }
async function turn(state: V2State, said: string | null, text: string, after: unknown[] = [], s: V2Session = session): Promise<Step> {
  const calls: V2ToolCall[] = []; const facts: string[] = [];
  clock += 20_000;
  const r = await runV2Turn({ session: s, state, studentSaid: said, callModel: streaming(text, after, facts), nowMs: clock, boardPass: false, mathsCheck: false, onToolCall: (c) => calls.push(c) });
  return { state: r.state, calls, facts: facts.join('\n'), spoken: r.spoken };
}
const chips = (st: V2State) => { const p = v2Progress(GDI, st.goals, st); return { lit: p.currentSegmentId, green: p.completedSegmentIds }; };
const tool = (name: string, input: Record<string, unknown>) => ({ type: 'tool_use', id: `t_${name}_${Math.random().toString(36).slice(2, 7)}`, name, input });

// The session's replies (flags.jsonl lastTutor), and the opening as its board shows it (Page 1: "Today's lesson: …").
const OPENING = '<board note style="highlight">\nToday\'s lesson:\n- Talking about your job and projects\n- Present perfect: I have worked here for five years.\n- Past simple: I attended an exhibition last year.\n- Follow-up questions to keep a conversation going\n</board>\nHello Ken, welcome! Today we will practise talking about your work and your projects. Does that sound good?';
const LEVEL_Q1 = 'Great. First, three short questions so I can pitch the lesson for you. Can you tell me a little about your job? What do you do?';
const FLAG1 = 'Thank you, that\'s clear. What kind of products do you sell?';
const FLAG2 = '<board page>Your job</board>\nでは、「仕事について」を始めましょう。仕事の話は短い文で始めると簡単です。例えば「I work in sales.」は「私は営業で働いています」という意味です。\n\n<board note style="highlight">\nI work in sales.\nI help customers.\nI work with international clients.\nI joined my company three years ago.\n</board>\n\nそれでは、あなたの仕事について一文で言ってみてください。 Can you say one sentence about your job?';
const FLAG5 = '<board page>Past simple</board>\n過去形は、「去年」「昨日」「2022年に」のように時間がはっきりした、終わった出来事に使います。形は動詞に -ed を付けたり、不規則な形を使ったりします。例えば「I attended an exhibition last year.」です。\n\n<board note style="highlight">\nPast simple: subject + past-tense verb\nattend → attended\nmeet → met\njoin → joined\nTime words: yesterday, last year, in 2022, two weeks ago\n</board>\n\n<board sentence stress="attended | last year" gloss="last year は特定の過去の時間なので、過去形を使います。">I attended an exhibition last year.</board>\n\nでは、質問に答えてみてください。「Try starting with: I attended…」で始めて構いません。\n\n<board problem difficulty="easy">Did you attend any business events or exhibitions last year? Answer in one or two sentences.</board>\n\nDid you attend any business events or exhibitions last year? Answer in one or two sentences.';
// Flag 3: his answer about his job (the note: "I work in the home plans division and I sell washing machines and then I work
// with international clients … I joined the company 5 years ago"), as the recogniser punctuates it.
const JOB_ANSWER = 'Um, I work in the home appliances division. I sell washing machine to customer. I work with international clients. I joined the company five years ago.';
// The reply that carded one of them (the board at flag 3: "I joined the company five years ago." on its own).
const ONE_CARD = 'Good, "I joined" is the right past simple for a finished time.\n\n<board sentence stress="joined" gloss="joined は過去形です。">I joined the company five years ago.</board>\n\nWhat do you like most about your job?';

/** Everything observed, for the parent (all on) and for each child (one switch off). */
async function scenario() {
  clock = 0;
  const out: Record<string, unknown> = { flags: { chip: TUTOR_V2_LEVEL_CHECK_CHIP, every: TUTOR_V2_CARD_EVERY_SENTENCE, question: TUTOR_V2_QUESTION_CARD, clock: TUTOR_V2_CLOCK_FROM_START } };
  // ── 1. The level check, as the session ran it.
  let st = newV2State(0);
  let r = await turn(st, null, OPENING); st = r.state;
  out.openTitle = st.board.pages[0]?.title; out.atOpening = chips(st);
  r = await turn(st, 'Yes, sounds good.', LEVEL_Q1); st = r.state;
  out.atQ1 = chips(st);
  r = await turn(st, 'I am a sales manager. I work in the home appliances division.', FLAG1); st = r.state;
  out.atFlag1 = chips(st); out.practiceInCheck = st.practiceSaid ?? null;
  out.cardLineInCheck = /answer just now had|answered your ask with a sentence/.test(r.facts);
  r = await turn(st, 'We sell washing machines and refrigerators.', 'Have you ever worked with an international customer? If so, can you tell me about the experience?'); st = r.state;
  r = await turn(st, 'Yes, I work with customers in Canada.', 'What is one skill you would like to improve in your English, and why is it important to you?'); st = r.state;
  out.beforeSet = chips(st); out.beforeSetState = st;
  r = await turn(st, 'Speaking, because I talk with foreign customers.', FLAG2, [tool('set_working_level', { level: 'intermediate', evidence: 'short sentences' })]); st = r.state;
  out.afterSet = chips(st); out.afterSetTitle = st.board.pages[st.board.current]?.title;
  // Fix round 1 (I3): set_working_level in a reply that opens no page: the check is over at once (green, not lit); the part after
  // it is in hand; a practice answer in that stretch gets its card line; an unnamed page then opens as that part's page.
  {
    let s3 = (await turn(out.beforeSetState as V2State, 'Speaking, because I talk with foreign customers.', 'Thank you, that is very helpful. Let\'s start with your work. Can you say one sentence about your job?', [tool('set_working_level', { level: 'intermediate', evidence: 'short sentences' })])).state;
    out.setNoPage = chips(s3);
    const ans = await turn(s3, 'I work in the sales division. I sell washing machines.', 'Good. <board page>Talking about work</board> Tell me more.');
    out.setNoPageLine = /their answer just now had 2 sentences/.test(ans.facts);
    out.setNoPagePage = ans.state.board.pages[ans.state.board.current]?.title;
    s3 = ans.state;
  }
  delete out.beforeSetState;
  // ── 2. Every sentence of his answer (flag 3).
  const atJob = st;
  r = await turn(atJob, JOB_ANSWER, ONE_CARD); st = r.state;
  const factsJob = r.facts;
  out.listLine = factsJob.split('\n').find((l) => /their answer just now had/.test(l)) ?? null;
  out.oldLine = /One card in this reply at most/.test(factsJob);
  out.owed = st.cardsOwed ?? null;
  out.practiceAfterAnswer = st.practiceSaid?.['topic-intro'] ?? 0;
  {
    const nc = await turn(st, 'Thank you.', 'Here it is. <board sentence>I work with international clients.</board> What do you like about your job?');
    out.noteCard = nc.calls.find((c) => c.name === 'show_sentence')?.outcome ?? null;
  }
  // The round trip the route makes keeps what is owed.
  const back = v2ScopeCarried(v2ReadClientState(JSON.parse(JSON.stringify(st)))!, session);
  out.owedRoundTrip = back.cardsOwed ?? null;
  // The next turn's facts owe them; a reply that cards one of them clears the list (owed once).
  r = await turn(back, 'I like meeting customers.', 'Nice. <board sentence stress="machines | customers" gloss="複数形">I sell washing machines to customers.</board> Can you tell me one more thing about your work?'); st = r.state;
  out.owedLine = r.facts.split('\n').find((l) => /not carded in your last reply/.test(l)) ?? null;
  out.owedAfter = st.cardsOwed ?? null;
  // "I didn't catch that": nothing owed for what was heard.
  r = await turn(atJob, JOB_ANSWER, 'Sorry, I didn\'t catch that. Could you say it again?');
  out.owedMisheard = r.state.cardsOwed ?? null;
  // ── 3. The practice question as a card (flag 5).
  r = await turn(st, 'Yes, let\'s go on.', FLAG5);
  const card = r.calls.find((c) => c.name === 'show_problem');
  out.questionCard = card ? { title: card.args.title ?? null, difficulty: card.args.difficulty ?? null, statement: card.args.statement, outcome: card.outcome } : null;
  const maths: V2Session = { studentName: 'Ken', subject: 'Mathematics', level: 'grade 8', mode: 'voice', timeBoxMinutes: 20 };
  const m = await turn(newV2State(0), null, 'Let\'s solve one.\n<board problem difficulty="easy">Solve 2x + 3 = 11.</board>\nWhat is x?', [], maths);
  const mc = m.calls.find((c) => c.name === 'show_problem');
  out.mathsCard = mc ? { title: mc.args.title ?? null, difficulty: mc.args.difficulty ?? null } : null;
  // ── 4. The clock: the hook mounted at 0, the session opened (the tap) at minute 1.3; the learner's timer read 9:51 at minute 11.2.
  const mounted = newV2State(0);
  const started = v2StartClock(mounted, 1.3 * MIN);
  out.clockStart = started.startedAtMs;
  out.leftAtFlag5 = Math.round(v2LeftToStopMin({ timeBoxMinutes: 20, plan: GDI }, started, 11.2 * MIN, false) * 10) / 10;
  const resumed = { ...newV2State(0), history: [{ role: 'assistant' as const, content: 'Welcome back.' }] };
  out.resumedKept = v2StartClock(resumed, 5 * MIN).startedAtMs;
  const usedLine = renderFacts(session, started, { nowMs: 11.2 * MIN }).split('\n').find((l) => l.startsWith('time:')) ?? '';
  out.usedLine = usedLine;
  return out;
}

async function main() {
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(await scenario())}`); return; }
  const o = await scenario() as Record<string, any>;

  console.log('1. the level check\'s chip (flags 1–2)');
  check('the opening page is "Page 1" (no page block), its chip the overview', o.openTitle === 'Page 1' && o.atOpening.lit === 'overview', o);
  check('from the reply that asks the first level question: "Level check" lit, "Overview" green, no page opened for it', o.atQ1.lit === 'level-check' && o.atQ1.green.includes('overview') && !o.atQ1.green.includes('level-check'), o.atQ1);
  check('…at flag 1 ("What kind of products do you sell?", no goal marked): still the level check', o.atFlag1.lit === 'level-check', o.atFlag1);
  check('…and at its last question', o.beforeSet.lit === 'level-check', o.beforeSet);
  check('set_working_level, and the "Your job" page opens in the same reply: level check green, "Your job" lit', o.afterSet.lit === 'topic-intro' && o.afterSet.green.includes('level-check') && o.afterSet.green.includes('overview') && o.afterSetTitle === 'Your job', o.afterSet);
  check('fix round 1 (I3): set_working_level with no page: Level check green and not lit, "Your job" in hand', o.setNoPage?.lit === 'topic-intro' && o.setNoPage.green.includes('level-check') && !o.setNoPage.green.includes('topic-intro'), o.setNoPage);
  check('…a practice answer in that stretch gets its card line', o.setNoPageLine === true);
  check('…and an unnamed page then opens as "Your job" (not the part after it)', o.setNoPagePage === 'Your job', o.setNoPagePage);
  check('nothing counted as practice during the level check (7f practiceSaid)', o.practiceInCheck === null, o.practiceInCheck);
  check('no card line during the level check', o.cardLineInCheck === false);
  {
    // Root cause, pinned: the part in hand after an unnamed opening page fell back to the overview, and the level check lit only
    // on a goal mark.
    const st: V2State = { ...newV2State(0), board: { pages: [{ title: 'Page 1', items: [] }], current: 0 }, history: [{ role: 'user', content: '[The session has just started.]' }, { role: 'assistant', content: 'Hello. Does that sound good?' }, { role: 'user', content: 'Yes.' }, { role: 'assistant', content: FLAG1 }] };
    check('root cause: as before (switch off), the overview is in hand through the check', v2PartInHand(GDI, st, true, false) === 0 && v2PartInHand(GDI, st, true, true) === 1);
    check('a level remembered from an earlier lesson (the part skipped): never lit', v2PartInHand(GDI, { ...st, goals: { 'level-check': { status: 'skipped' } }, workingLevel: { level: 'intermediate', from: 'earlier_lesson' } }, true, true) === 0);
    check('the overview\'s own question ("Does that sound good?") does not begin the check', !v2LevelCheckBegun(GDI, st.history.slice(0, 2)) && !v2LevelCheckBegun(GDI, [...st.history.slice(0, 3), { role: 'assistant', content: 'Great. Are you ready?' }]));
    check('a plan without a level check: nothing begins', !v2LevelCheckBegun({ ...GDI, segments: GDI.segments.filter((s) => s.id !== 'level-check') }, st.history));
  }

  console.log('2. every sentence of a practice answer on the board (flag 3)');
  // Fix round 1 (I2): "I work with international clients." stands word for word in the page's example note; flag 3 names it as
  // left off, so it is listed and owed like the others (only a sentence card of it would make it up already).
  check('the facts list his four sentences, the one in the page\'s example note too, and ask for a card each', typeof o.listLine === 'string' && /4 sentences/.test(o.listLine) && /home appliances division/.test(o.listLine) && /I sell washing machine to customer\./.test(o.listLine) && /I work with international clients\./.test(o.listLine) && /five years ago/.test(o.listLine) && /one sentence card per sentence/.test(o.listLine) && !o.oldLine, o.listLine);
  check('the reply carded one: the other three are owed', JSON.stringify(o.owed) === JSON.stringify(['I work in the home appliances division.', 'I sell washing machine to customer.', 'I work with international clients.']), o.owed);
  check('a card of the sentence in the example note paints (a sentence card is its own form, not a repeat of the note)', /^painted/.test(o.noteCard ?? ''), o.noteCard);
  check('…and the round trip keeps them', JSON.stringify(o.owedRoundTrip) === JSON.stringify(o.owed), o.owedRoundTrip);
  check('the next reply\'s facts name them ("not carded in your last reply")', typeof o.owedLine === 'string' && /home appliances division/.test(o.owedLine) && /washing machine/.test(o.owedLine), o.owedLine);
  check('owed once: the turn after owes only its own answer\'s uncarded sentence, not the earlier ones again', JSON.stringify(o.owedAfter) === JSON.stringify(['I like meeting customers.']), o.owedAfter);
  check('a reply that did not catch their words owes nothing', o.owedMisheard === null, o.owedMisheard);
  check('7f agrees: the answer counts once toward the part\'s practice', o.practiceAfterAnswer === 1, o.practiceAfterAnswer);
  {
    check('requests, questions and "I didn\'t catch that" are no sentences of theirs', v2LearnerSentences('One more, please.').length === 0 && v2LearnerSentences('Let\'s move on to the next part.').length === 0 && v2LearnerSentences('Sorry, I didn\'t catch that.').length === 0 && v2LearnerSentences('Could you repeat the question please?').length === 0 && v2LearnerSentences('Yes, okay.').length === 0 && v2LearnerSentences('I\'d like to do another exercise.').length === 0);
    const theirs = ['I want to go to Canada next year.', 'I\'d like to try a new job in marketing.', 'I would like more holidays every year.', 'My customers don\'t understand Japanese very well.', 'Go on business trips twice a month.', 'I want to move on to a bigger company.'];
    check('fix round 1 (I1): statements about their life with "I want", "I\'d like", "don\'t understand", "go on" are theirs', theirs.every((x) => v2LearnerSentences(x).length === 1), theirs.map((x) => v2LearnerSentences(x)));
    check('…and "Sorry I was late, I work in sales." is listed (the sorry aside)', JSON.stringify(v2LearnerSentences('Sorry I was late, I work in sales.')) === JSON.stringify(['I was late, I work in sales.']));
    check('…while asks about the lesson are not ("Let\'s move on to the next part.", "Can we do one more?", "Please say that again.", "I don\'t understand the question.", "I have a question.")', ['Let\'s move on to the next part.', 'Can we do one more?', 'Please say that again slowly.', 'Okay, I don\'t understand the question.', 'I have a question.', 'Could you speak more slowly, please?'].every((x) => v2LearnerSentences(x).length === 0));
    check('fillers out, a repeat once', JSON.stringify(v2LearnerSentences('Uh, I work in sales. I work in sales. Um, I help customers with orders.')) === JSON.stringify(['I work in sales.', 'I help customers with orders.']), v2LearnerSentences('Uh, I work in sales. I work in sales. Um, I help customers with orders.'));
    const board = { pages: [{ title: 'Your job', items: [] }], current: 0 };
    check('a corrected card counts for its sentence (plurals added); one card covers one sentence', JSON.stringify(v2SentencesNotCarded(['I sell washing machine to customer.', 'I work with international clients.'], ['I sell washing machines to customers.'], board)) === JSON.stringify(['I work with international clients.']));
    check('numbers in words and digits alike', v2SentencesNotCarded(['I joined the company 5 years ago.'], ['I joined the company five years ago.'], board).length === 0);
  }

  console.log('3. the practice question as a question card (flag 5)');
  check('no difficulty, headed "Question", the question as written, painted', !!o.questionCard && o.questionCard.difficulty === null && o.questionCard.title === 'Question' && /business events or exhibitions/.test(o.questionCard.statement) && /^painted/.test(o.questionCard.outcome), o.questionCard);
  check('a maths problem card keeps its difficulty', !!o.mathsCard && o.mathsCard.difficulty === 'easy' && o.mathsCard.title === null, o.mathsCard);

  console.log('4. the engine\'s clock from the session\'s start');
  check('the clock starts at the tap (minute 1.3), not at the mount', o.clockStart === 1.3 * MIN, o.clockStart);
  check('at the learner\'s 9:51 the engine has about 10 minutes left, as the screen does (not 8.8)', o.leftAtFlag5 === 10.1, o.leftAtFlag5);
  check('the facts\' time line reads 10 min used', /^time: 10 min used of about 20/.test(o.usedLine), o.usedLine);
  check('a resumed session keeps its start', o.resumedKept === 0);
  {
    const src = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'useV2Turns.ts'), 'utf8');
    const open = src.slice(src.indexOf('const open = useCallback'), src.indexOf('const send = useCallback'));
    const send = src.slice(src.indexOf('const send = useCallback'), src.indexOf('const nudge = useCallback'));
    check('useV2Turns starts the clock where the session starts (open, a first typed message), never on a resume', /if \(!resumedRef\.current\) stateRef\.current = v2StartClock\(stateRef\.current, Date\.now\(\)\)/.test(open) && /v2StartClock/.test(send) && open.indexOf('v2StartClock') < open.indexOf('onSessionStarted?.()'));
  }

  console.log('each switch off alone');
  {
    const child = (flag: string) => {
      const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC2_7G_CHILD: '1' }, encoding: 'utf8' });
      const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
      return line ? JSON.parse(line.slice('OFF_JSON '.length)) : { error: res.stderr };
    };
    const a = child('LEVEL_CHECK_CHIP');
    check('LEVEL_CHECK_CHIP off: the overview lit through the whole check (as at flag 1); the rest as on', a.flags?.chip === false && a.atQ1?.lit === 'overview' && a.atFlag1?.lit === 'overview' && a.afterSet?.lit === 'topic-intro' && Array.isArray(a.owed) && a.owed.length === 3 && a.questionCard?.difficulty === null && a.clockStart === 1.3 * MIN, a);
    const b = child('CARD_EVERY_SENTENCE');
    check('CARD_EVERY_SENTENCE off: the 7b line (one card at most), nothing owed; the rest as on', b.flags?.every === false && b.listLine === null && b.owed === null && b.owedLine === null && b.atFlag1?.lit === 'level-check' && b.questionCard?.difficulty === null, b);
    const c = child('QUESTION_CARD');
    check('QUESTION_CARD off: "easy", no title (the board\'s "Problem"), as at flag 5; the rest as on', c.flags?.question === false && c.questionCard?.difficulty === 'easy' && c.questionCard?.title === null && c.atFlag1?.lit === 'level-check' && Array.isArray(c.owed), c);
    const d = child('CLOCK_FROM_START');
    check('CLOCK_FROM_START off: the clock from the mount (8.8 left at 9:51 on screen); the rest as on', d.flags?.clock === false && d.clockStart === 0 && d.leftAtFlag5 === 8.8 && d.atFlag1?.lit === 'level-check' && d.questionCard?.difficulty === null, d);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
