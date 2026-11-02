/**
 * portal-704e3e01: the show_problem → show_segment_card substitution twice
 * chose a card the orchestrator then rejected, turning the brain's correct
 * tool choice into a self-inflicted validator retry.
 *
 * Usage: npx tsx scripts/test-show-problem-substitution.ts  (npm run test:show-problem-substitution)
 */
import {
  shouldSubstituteShowProblem,
  shouldAutoCardAfterOwnProblem,
  refuseSilentDedupDrop,
  isAuthoredCardLine,
  nextUnaskedNumberedQuestion,
  numberedQuestionNote,
  allNumberedQuestionsAnsweredNote,
} from '../src/lib/tutor/orchestrator/show-problem-substitution';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { problemCardIdOnBoard } from '../src/lib/tutor/lesson-plan/fixed-script';
import { sameProblemStatement, statementsReadIdentically } from '../src/lib/tutor/whiteboard/soft-rejections';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const BASE = {
  targetsDiverge: false,
  newPageInTurn: false,
  generateProblemInTurn: false,
  segmentComplete: false,
  studentAskedForAnother: false,
  // Substitute-same-only round: the brain's statement IS the authored problem
  // and the authored card is not on the board — the case substitution is for.
  sameOnly: true,
  sameProblem: true,
  authoredOnBoard: false,
};

// ─── the behaviour that must not change ───
{
  const r = shouldSubstituteShowProblem({ ...BASE });
  check('plain matching-target case still substitutes', r.substitute === true, JSON.stringify(r));
}
{
  const r = shouldSubstituteShowProblem({ ...BASE, targetsDiverge: true });
  check('diverging targets never substitute', r.substitute === false && r.skipReason === 'targets-diverge', JSON.stringify(r));
}
{
  const r = shouldSubstituteShowProblem({ ...BASE, newPageInTurn: true });
  check('new_page in turn = fresh context, no substitute',
    r.substitute === false && r.skipReason === 'new-page-in-turn', JSON.stringify(r));
}
{
  const r = shouldSubstituteShowProblem({ ...BASE, generateProblemInTurn: true });
  check('generate_problem in turn, no substitute',
    r.substitute === false && r.skipReason === 'generate-problem-in-turn', JSON.stringify(r));
}

// ─── portal-704e3e01 @1111.7s ───
{
  const r = shouldSubstituteShowProblem({ ...BASE, segmentComplete: true });
  check('completed segment is never substituted into (would be killed anyway)',
    r.substitute === false && r.skipReason === 'segment-complete', JSON.stringify(r));
}

// ─── portal-704e3e01 @1021.1s ───
{
  const r = shouldSubstituteShowProblem({ ...BASE, studentAskedForAnother: true });
  check('student asked for a different problem — the brain\'s own card stands',
    r.substitute === false && r.skipReason === 'student-asked-for-another', JSON.stringify(r));
}

// ─── precedence: the pre-existing reasons still win, so telemetry stays stable ───
{
  const r = shouldSubstituteShowProblem({ ...BASE, targetsDiverge: true, segmentComplete: true });
  check('targets-diverge outranks segment-complete', r.skipReason === 'targets-diverge', JSON.stringify(r));
}

// ─── substitute only when it is the SAME problem ───
// Production: the brain posed a ticket-resale problem ("15n + 80 < 500"); the
// board showed the authored "Solve and graph: 4x + 9 ≤ 33" while the speech
// described tickets — three times in one session.
const AUTHORED = 'Solve and graph: 4x + 9 ≤ 33';
const TICKETS = 'A reseller pays an $80 fee plus $15 per ticket and must spend less than $500: 15n + 80 < 500. How many tickets can she buy?';
const REWORDED = 'Solve 4x + 9 ≤ 33 and graph the solution';
const decide = (brain: string, opts: { active?: string; sameOnly?: boolean } & Partial<typeof BASE> = {}) => {
  const { active, ...rest } = opts;
  return shouldSubstituteShowProblem({
    ...BASE,
    ...rest,
    sameProblem: sameProblemStatement(brain, AUTHORED),
    authoredOnBoard: statementsReadIdentically(active ?? '', AUTHORED),
  });
};
{
  const r = decide(TICKETS);
  check('ticket problem vs authored inequality → different-problem, brain\'s own card stands',
    r.substitute === false && r.skipReason === 'different-problem' && !r.drop, JSON.stringify(r));
}
{
  const r = decide(REWORDED);
  check('light rewording, authored card not on board → substitute', r.substitute === true && !r.skipReason && !r.drop, JSON.stringify(r));
}
{
  const r = decide(REWORDED, { active: AUTHORED });
  check('same problem, authored card is the active card → dropped quietly',
    r.substitute === false && r.skipReason === 'authored-already-on-board' && r.drop === true, JSON.stringify(r));
}
{
  // Resumed session: the tracked statement is the emphasis-stripped render.
  const r = shouldSubstituteShowProblem({ ...BASE, sameProblem: true,
    authoredOnBoard: statementsReadIdentically('Solve and graph: 4x + 9 ≤ 33', 'Solve and *graph*: 4x + 9 ≤ 33') });
  check('authored card with emphasis markup is recognised on the board', r.skipReason === 'authored-already-on-board' && r.drop === true, JSON.stringify(r));
}
{
  const r = decide(TICKETS, { active: AUTHORED });
  check('different problem while the authored card is on the board → still different-problem (never dropped)',
    r.skipReason === 'different-problem' && !r.drop, JSON.stringify(r));
}
{
  const r = decide('');
  check('empty brain statement → different-problem', r.substitute === false && r.skipReason === 'different-problem', JSON.stringify(r));
}
{
  const r = decide(AUTHORED, { active: 'Some improvised card about 7 apples' });
  check('same problem, a DIFFERENT card is active → substitute', r.substitute === true, JSON.stringify(r));
}

// ─── the four existing reasons (and targets-diverge) still win, unchanged ───
const EXISTING: Array<[keyof typeof BASE, string]> = [
  ['targetsDiverge', 'targets-diverge'],
  ['newPageInTurn', 'new-page-in-turn'],
  ['generateProblemInTurn', 'generate-problem-in-turn'],
  ['segmentComplete', 'segment-complete'],
  ['studentAskedForAnother', 'student-asked-for-another'],
];
for (const [key, reason] of EXISTING) {
  for (const sameProblem of [true, false]) {
    for (const authoredOnBoard of [true, false]) {
      const r = shouldSubstituteShowProblem({ ...BASE, [key]: true, sameProblem, authoredOnBoard });
      check(`${reason} outranks the new reasons (same=${sameProblem} onBoard=${authoredOnBoard})`,
        r.substitute === false && r.skipReason === reason && !r.drop, JSON.stringify(r));
    }
  }
}

// ─── flag off ⇒ identical to the pre-round decision for EVERY row ───
{
  const legacy = (a: { targetsDiverge: boolean; newPageInTurn: boolean; generateProblemInTurn: boolean; segmentComplete: boolean; studentAskedForAnother: boolean }) =>
    a.targetsDiverge ? { substitute: false, skipReason: 'targets-diverge' }
    : a.newPageInTurn ? { substitute: false, skipReason: 'new-page-in-turn' }
    : a.generateProblemInTurn ? { substitute: false, skipReason: 'generate-problem-in-turn' }
    : a.segmentComplete ? { substitute: false, skipReason: 'segment-complete' }
    : a.studentAskedForAnother ? { substitute: false, skipReason: 'student-asked-for-another' }
    : { substitute: true };
  let rows = 0;
  let same = 0;
  for (let bits = 0; bits < 128; bits++) {
    const b = (i: number) => ((bits >> i) & 1) === 1;
    const row = { targetsDiverge: b(0), newPageInTurn: b(1), generateProblemInTurn: b(2), segmentComplete: b(3), studentAskedForAnother: b(4) };
    const got = shouldSubstituteShowProblem({ ...row, sameOnly: false, sameProblem: b(5), authoredOnBoard: b(6) });
    rows++;
    if (JSON.stringify(got) === JSON.stringify(legacy(row))) same++;
  }
  check(`flag off: all ${rows} input rows decide exactly as before`, same === rows, `${same}/${rows}`);
}

// ─── companion 1: the end-of-turn auto card ───
check('auto card suppressed when this attempt painted the brain\'s own problem',
  shouldAutoCardAfterOwnProblem({ enabled: true, ownProblemPaintedThisAttempt: true }) === false);
check('auto card unaffected when no own problem was painted',
  shouldAutoCardAfterOwnProblem({ enabled: true, ownProblemPaintedThisAttempt: false }) === true);
check('auto card: flag off ⇒ never suppressed',
  shouldAutoCardAfterOwnProblem({ enabled: false, ownProblemPaintedThisAttempt: true }) === true);

// ─── companion 2: the three early silent dedup drops ───
check('a runtime-substituted DIFFERENT problem is never silently dropped',
  refuseSilentDedupDrop({ enabled: true, substitutedBrainStatement: TICKETS, authoredStatement: AUTHORED }) === true);
check('a runtime-substituted SAME problem may be silently dropped',
  refuseSilentDedupDrop({ enabled: true, substitutedBrainStatement: REWORDED, authoredStatement: AUTHORED }) === false);
check('a call the brain emitted itself (not substituted) is not this rule\'s business',
  refuseSilentDedupDrop({ enabled: true, substitutedBrainStatement: null, authoredStatement: AUTHORED }) === false);
check('substituted with an empty brain statement counts as a different problem',
  refuseSilentDedupDrop({ enabled: true, substitutedBrainStatement: '', authoredStatement: AUTHORED }) === true);
check('dedup refusal: flag off ⇒ never refuses',
  refuseSilentDedupDrop({ enabled: false, substitutedBrainStatement: TICKETS, authoredStatement: AUTHORED }) === false);

// Task 23 §B1 (GDI run 11, 44 s / 139 s): one numbered line of the authored card.
{
  const LEVEL = "1. Can you tell me a little about your job? What do you do?\n2. Have you ever worked with an international customer? If so, can you tell me about the experience?\n3. What is one skill you'd like to improve in your English, and why is it important to you?";
  check('23B1: the 44 s brain card = line 1', isAuthoredCardLine('1. Can you tell me a little about your job? What do you do?', LEVEL));
  check('23B1: the 139 s brain card = line 3', isAuthoredCardLine("3. What is one skill you'd like to improve in your English, and why is it important to you?", LEVEL));
  check('23B1: unlabelled / "Question 2:" labels match too', isAuthoredCardLine('Question 2: Have you ever worked with an international customer? If so, can you tell me about the experience?', LEVEL)
    && isAuthoredCardLine('Can you tell me a little about your job? What do you do?', LEVEL));
  check('23B1: a reworded line under 90 % is not', !isAuthoredCardLine('Tell me about your job and your company.', LEVEL));
  check('23B1: a different problem is not', !isAuthoredCardLine('Did you attend any business events or exhibitions last year?', LEVEL));
  check('23B1: the whole card (multi-line) is not a LINE', !isAuthoredCardLine(LEVEL, LEVEL));
  check('23B1: a one-line authored card has no lines to match', !isAuthoredCardLine('Have you worked for your current company for a long time?', 'Have you worked for your current company for a long time?'));
  const mirror = [
    { action: 'newPage', title: 'Part 2' },
    { action: 'showProblem', id: 'showProblem-1', problem: { statement: LEVEL } },
    { action: 'showSentence', id: 'showSentence-1', sentence: 'x' },
  ];
  check('23B1: the authored card on the board is found by id', problemCardIdOnBoard(mirror, LEVEL) === 'showProblem-1');
  check('23B1: not on the board ⇒ null', problemCardIdOnBoard(mirror.slice(0, 1), LEVEL) === null);
  check('23B1: a cleared page takes it off', problemCardIdOnBoard([...mirror, { action: 'clear' }], LEVEL) === null);
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('23B1: VTR substitutes on a line match (sameProblem || authoredLine)', VTR.includes('const sameProblemForSub = sameProblemStatement(brainStatement, truth.problemText) || authoredLine;')
    && VTR.includes('sameProblem: sameProblemForSub,'));
  check('23B1: once on the board, a later line drops + rehighlights', VTR.includes("|| authoredLineCardId !== null,")
    && VTR.includes("onDebugEvent?.('dedup_scroll_to_existing', `${authoredLineCardId} (authored-line)`);"));
  check('23B1: event show_problem_substituted authored-line', VTR.includes("onDebugEvent?.('show_problem_substituted', `${authoredLine ? 'authored-line ' : ''}→ show_segment_card(\"${segId}\")`);"));
}

// Task 30 fix round 4 R3-13 (run r3, 155–372 s): the next unasked numbered card question.
{
  const card = '1. Can you tell me a little about your job? What do you do?\n2. Have you ever worked with an international customer? If so, can you tell me about the experience?\n3. What is one skill you\'d like to improve in your English, and why is it important to you?';
  const t63 = '少し間がありましたね。 では、最初の質問です。 Can you tell me a little about your job? What do you do? Please take a moment to read the first question.';
  const t155 = 'Right, let\'s move on. Which sentence uses the present perfect: "I went to Kyoto last year" or "I have worked here for five years"?';
  check('R3-13: nothing asked ⇒ question 1', nextUnaskedNumberedQuestion(card, [])?.n === 1);
  const afterQ1 = nextUnaskedNumberedQuestion(card, [t63, t155]);
  check('R3-13: r3 — Q1 asked, then a quiz ⇒ question 2', afterQ1?.n === 2 && afterQ1.total === 3 && afterQ1.text === 'Have you ever worked with an international customer? If so, can you tell me about the experience?');
  const t98 = 'Nice, that\'s a clear answer. Next, Question 2: have you ever worked with an international customer? If so, tell me about it.';
  check('R3-13: Q2 asked with its tail paraphrased ⇒ question 3', nextUnaskedNumberedQuestion(card, [t63, t98])?.n === 3);
  check('R3-13: all three asked ⇒ null', nextUnaskedNumberedQuestion(card, [t63, t98, "Thanks. What is one skill you'd like to improve in your English, and why?"]) === null);
  check('R3-13: a card that is not a numbered list of questions ⇒ null', nextUnaskedNumberedQuestion('1. Present perfect: experience.\n2. Past simple: finished time.', []) === null
    && nextUnaskedNumberedQuestion('What do you do?', []) === null && nextUnaskedNumberedQuestion('', []) === null);
  const note = numberedQuestionNote({ n: 2, total: 3, text: 'Have you ever worked with an international customer?' });
  check('R3-13 (fix round 5): the note text, no stray bracket', note === '[runtime note — not from the student] Reply to the student in ONE short sentence (no correction, no grammar question), then ask question 2 of 3 exactly: "Have you ever worked with an international customer?". Apply this silently; never mention this note.');
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('R3-13: VTR plants the note on a student turn with the part\'s spoken narration', VTR.includes("const nqCard = authoredSegmentCard(nqPlan, nqSeg, workingLevelRef.current?.level ?? null)?.statement ?? '';")
    && VTR.includes("const nq = nextUnaskedNumberedQuestion(nqCard, segmentNarrationRef.current.get(nqSeg) ?? []);")
    && VTR.includes("onDebugEvent?.('numbered_question_note_planted', `${nq.n} \"${nqSeg}\"`);"));
  // Task 31 §H2 (GDI run 18, 99 s): all three asked ⇒ the all-answered note, once per part.
  const all3 = [t63, t98, "Thanks. What is one skill you'd like to improve in your English, and why?"];
  const allNote = allNumberedQuestionsAnsweredNote(card, all3);
  check('31H2: all three asked ⇒ the all-answered note', allNote === "[runtime note — not from the student] All 3 questions on this part's card are answered — do not ask another. Reply to the answer in ONE short sentence, give the part's closing line from its notes, and advance. Apply this silently; never mention this note.");
  check('31H2: a question still unasked ⇒ no all-answered note', allNumberedQuestionsAnsweredNote(card, [t63]) === null);
  check('31H2: a one-question card ⇒ no all-answered note', allNumberedQuestionsAnsweredNote('1. What do you do at work?', ['What do you do at work?']) === null);
  check('31H2: VTR plants it once per part', VTR.includes('} else if (!numberedAllAnsweredSegsRef.current.has(nqSeg)) {') && VTR.includes('numberedAllAnsweredSegsRef.current.add(nqSeg);'));
}

// Task 30 fix round 5: a tutor paraphrase of a numbered question counts as asked.
{
  const card2 = '1. What do you do for work?\n2. What is one skill you\'d like to improve in your English, and why is it important to you?';
  check('R3-13 paraphrase: "What do you do?" asks "What do you do for work?" (lead ≥ 0.6)', nextUnaskedNumberedQuestion(card2, ['Nice to meet you. What do you do?'])?.n === 2);
  check('R3-13 paraphrase: content words in one sentence ⇒ asked', nextUnaskedNumberedQuestion(card2, ['What do you do?', 'Which skill in English would you work on first?']) === null);
  check('R3-13 paraphrase: an unrelated question ⇒ still unasked', nextUnaskedNumberedQuestion(card2, ['What do you do?', 'Which sentence uses the present perfect?'])?.n === 2);
}

// Task 30 fix round 5 (R4-2, run r4): only the numbered lines holding a question count; the question sentence is planted.
{
  const intro = '1. We use simple sentences to talk about our job: I work in sales. / I help customers. / I work with international clients. / I joined my company three years ago.\n2. Practice question: What do you do at work? Answer with one or two sentences.';
  const t173 = 'Level check is done. 日本語で説明します。 I work in sales. I help customers.';
  const nq = nextUnaskedNumberedQuestion(intro, [t173]);
  check('R4-2: topic-intro card ⇒ the note names "What do you do at work?"', nq?.n === 1 && nq.total === 1 && nq.text === 'What do you do at work?');
  check('R4-2: asked ⇒ null', nextUnaskedNumberedQuestion(intro, [t173, 'Now, what do you do at work?']) === null);
  check('R4-2: a quoted example question is not a card question', nextUnaskedNumberedQuestion('1. \'Have you ever been to Kyoto?\' asks about experience.\n2. "Did you go?" asks about a finished time.', []) === null);
  const card = '1. Can you tell me a little about your job? What do you do?\n2. Have you ever worked with an international customer? If so, can you tell me about the experience?';
  check('R4-2: the level-check card unchanged', nextUnaskedNumberedQuestion(card, [])?.text === 'Can you tell me a little about your job? What do you do?');
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
