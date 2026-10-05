/**
 * Characterization tests for orchestrator helpers extracted from
 * VoiceTutorRealtime (seam-extraction slice 1). These pin CURRENT behavior
 * across the move — they are not aspirational specs.
 * Run: npm run test:orchestrator-helpers
 */
import {
  isSafeOpener,
  isJudgeKillRestatement,
  detectStudentBroughtProblem,
  decideStudentProblemGrounding,
  extractSymbolicRelation,
  isBoardQuestion,
  isMuteMeCommand,
  isVerdictOpener,
  latexProseFiller,
  extractSentence1Normalized,
  deepEqualParams,
} from '../src/lib/tutor/orchestrator/text-heuristics';
import { sanitizeInkOcrText } from '../src/lib/tutor/orchestrator/ink-capture';
import { inferAdvanceFromSegmentCard } from '../src/lib/tutor/orchestrator/segment-advance';
import { withInactivityTimeout, classifyBrainError } from '../src/lib/tutor/voice/brain-retry';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

// ── isSafeOpener ──────────────────────────────────────────────────
{
  check(
    'isSafeOpener: short content-free runway phrase → true',
    isSafeOpener("Let's take a look at this together.") === true,
  );
  check(
    'isSafeOpener: sentence with a digit → false (any digit is a value/claim)',
    isSafeOpener('We have 5 apples here.') === false,
  );
  check(
    'isSafeOpener: a question → false (student must act)',
    isSafeOpener('Are you ready to begin?') === false,
  );
  check(
    'isSafeOpener: over-long sentence (>10 words, no digits/operators/question) → false',
    isSafeOpener(
      "Let's take a moment to slowly walk through this together before we begin now.",
    ) === false,
  );
}

// ── isJudgeKillRestatement ────────────────────────────────────────
{
  const killed = 'The hyperbola opens along the x axis.';
  check(
    'isJudgeKillRestatement: verbatim restatement → true',
    isJudgeKillRestatement(killed, killed) === true,
  );
  check(
    'isJudgeKillRestatement: reworded but same content words → true (per code, ≥60% overlap + no new numbers)',
    isJudgeKillRestatement(
      "That's right, the hyperbola opens along the x axis.",
      killed,
    ) === true,
  );
  check(
    'isJudgeKillRestatement: numeric-token mismatch (value corrected) → false',
    isJudgeKillRestatement(
      'The area is 18 square units.',
      'The area is 12 square units.',
    ) === false,
  );
  check(
    'isJudgeKillRestatement: fully diverged content → false',
    isJudgeKillRestatement(
      "Let's move on to something completely different now.",
      killed,
    ) === false,
  );
}

// ── detectStudentBroughtProblem ───────────────────────────────────
{
  check(
    'detectStudentBroughtProblem: student text echoing the authored problem → null (overlap >= 0.5)',
    detectStudentBroughtProblem(
      'Can you help me with a car that travels 60 miles in 2 hours?',
      'A car travels 60 miles in 2 hours; find its speed.',
      '',
    ) === null,
  );
  check(
    'detectStudentBroughtProblem: genuinely new numbers + work-intent phrasing → non-null (verbatim student text)',
    detectStudentBroughtProblem(
      'Could you help me solve for x if 3x + 7 = 22?',
      'A train travels 40 mph for 3 hours.',
      '',
    ) === 'Could you help me solve for x if 3x + 7 = 22?',
  );
  check(
    'detectStudentBroughtProblem: casual chat (no work-intent framing) → null',
    detectStudentBroughtProblem("Hey, how's it going today?", '', '') === null,
  );
}

// ── decideStudentProblemGrounding (2026-10-04) ────────────────────
{
  const g = (studentText: string, activeStatement = '', authoredText = '') =>
    decideStudentProblemGrounding({ enabled: true, studentText, authoredText, activeStatement });

  // Production utterance 1 — the student's real problem, which the legacy
  // detector missed ("how to solve" is not in WORK_INTENT_RE).
  check('legacy detector misses "how to solve: x>5 or x<3" (the defect)',
    detectStudentBroughtProblem('how to solve: x>5 or x<3', '', '') === null);
  {
    const d = g('how to solve: x>5 or x<3');
    check('grounding: "how to solve: x>5 or x<3" → grounded', d.problem !== null && d.reason === 'request-relation');
    // CHANGED (review 1b): this pinned the statement AS the extracted relation
    // ("x > 5 or x < 3"). The statement is now the student's words minus the
    // request lead-in; "or" joins TWO relations, so `relation` is undefined.
    check('grounding: stored as the student\'s words minus the lead-in', d.problem === 'solve: x>5 or x<3');
    check('grounding: two relations joined by "or" → relation undefined', d.relation === undefined);
  }
  // Production utterance 2 — a question ABOUT the board problem, mis-stating it.
  const PRONOUNCE = 'how do you pronounce this problem… x greater than 3 or x less than 3';
  check('legacy detector grounds on the pronunciation question (the defect)',
    detectStudentBroughtProblem(PRONOUNCE, '', 'how to solve: x>5 or x<3') === null
      // (with utterance 1 undetected there was no active statement:)
      && detectStudentBroughtProblem(PRONOUNCE, '', '') === PRONOUNCE);
  check('grounding: pronunciation question, problem active → null (board-question)',
    g(PRONOUNCE, 'x > 5 or x < 3').problem === null && g(PRONOUNCE, 'x > 5 or x < 3').reason === 'board-question');
  check('grounding: pronunciation question, NO problem active → still null',
    g(PRONOUNCE).problem === null && g(PRONOUNCE).reason === 'board-question');
  check('prose comparatives are not a symbolic relation',
    extractSymbolicRelation('x greater than 3 or x less than 3') === null);

  // (a) request shapes. CHANGED (review 1b): these pinned `problem` as the
  // extracted relation; now `problem` is the sentence minus the lead-in and
  // the relation travels separately.
  for (const [text, statement, relation] of [
    ['can you solve 3x + 2 = 11', 'solve 3x + 2 = 11', '3x + 2 = 11'],
    ['how do I solve 3x + 2 = 11?', 'solve 3x + 2 = 11?', '3x + 2 = 11'],
    ['solve: 2x - 7 = 15', 'solve: 2x - 7 = 15', '2x - 7 = 15'],
    ['Solve this 4x+1=9', 'Solve this 4x+1=9', '4x+1 = 9'],
    ['help me solve x/2 + 3 = 10', 'solve x/2 + 3 = 10', 'x/2 + 3 = 10'],
    ['what is the solution to 5x - 3 >= 12', 'what is the solution to 5x - 3 >= 12', '5x - 3 >= 12'],
    ['how to solve 3 < 2x + 1 < 9', 'solve 3 < 2x + 1 < 9', '3 < 2x + 1 < 9'],
    ['Could you help me solve for x if 3x + 7 = 22?', 'solve for x if 3x + 7 = 22?', '3x + 7 = 22'],
    ['solve for x: 3x + 2 = 11', 'solve for x: 3x + 2 = 11', '3x + 2 = 11'],
    ['please solve 5x - 1 = 9', 'solve 5x - 1 = 9', '5x - 1 = 9'],
  ] as const) {
    const d = g(text);
    check(`grounding: request "${text}" → statement "${statement}"`, d.problem === statement && d.reason === 'request-relation');
    check(`grounding: request "${text}" → relation "${relation}"`, d.relation === relation);
  }
  // (a) bare relation shape. CHANGED (review 2, 2026-10-04): a bare relation
  // with nothing active used to ground ("x^2 - 4 = 0", "3x+2=11", "y = 2x +
  // 1"). It cannot be told from a working STEP, and HEAD's legacy detector
  // returned null for every one of them, so it no longer grounds: the bare
  // path needs an explicit lead-in (see "Review 2" below).
  {
    for (const text of ['x^2 - 4 = 0', '3x+2=11', 'y = 2x + 1']) {
      const d = g(text);
      check(`grounding: bare "${text}", nothing active → null (no lead-in)`, d.problem === null && d.reason === 'bare-no-lead-in');
      check(`grounding: bare "${text}" → same as HEAD's legacy detector`, detectStudentBroughtProblem(text, '', '') === null);
    }
  }

  // ── Review 2: a working STEP with nothing active is not a new problem ─
  {
    const AUTHORED = 'Solve 2x + 6 = 14';
    for (const text of ['then 3x = 9 right', 'x = 4 so 2x = 8', '2x = 8, x = 4', 'x + 3 = 7 then x = 4', '7 - 3 = 4 so x = 4', '3x + 2 = 11']) {
      check(`grounding 2: step "${text}" (nothing active, authored card) → null`, g(text, '', AUTHORED).problem === null);
      check(`grounding 2: step "${text}" → HEAD's legacy detector agrees`, detectStudentBroughtProblem(text, AUTHORED, '') === null);
    }
    for (const text of ['so 2x = 8?', '6x = 18', 'y = 3x + 2']) {
      check(`grounding 2: step "${text}" (nothing active, no authored text) → null`, g(text).problem === null);
      check(`grounding 2: step "${text}" → HEAD's legacy detector agrees`, detectStudentBroughtProblem(text, '', '') === null);
    }
    // A lead-in that says "this is a problem" still grounds, verbatim.
    for (const text of [
      'next problem 5x - 1 = 9', 'my homework says 5x - 1 = 9', 'new problem 5x - 1 = 9',
      'problem: 5x - 1 = 9', 'question: 5x - 1 = 9', 'factor x^2 - 4 = 0', 'graph y = 2x + 1',
    ]) {
      const d = g(text);
      check(`grounding 2: lead-in "${text}" → grounds verbatim`, d.problem === text && d.reason === 'bare-relation');
      // (An authored card that shares none of its numbers — the divergence gate is unchanged.)
      check(`grounding 2: lead-in "${text}" with an authored card → grounds`, g(text, '', 'Solve 7x + 30 = 51').problem === text);
      check(`grounding 2: lead-in "${text}" while a problem is active → unchanged (null)`, g(text, '3x + 2 = 11').reason === 'bare-problem-active');
    }
    check('grounding 2: "solve 5x - 1 = 9" (request path) still grounds',
      g('solve 5x - 1 = 9').problem === 'solve 5x - 1 = 9' && g('solve 5x - 1 = 9').relation === '5x - 1 = 9');
    check('grounding 2: "how to solve: x>5 or x<3" still grounds', g('how to solve: x>5 or x<3').reason === 'request-relation');
    check('grounding 2: givens + task verb, nothing active → grounds',
      g('if a = 3 and b = 4 find c when a^2 + b^2 = c^2').reason === 'bare-relation');
    // A lead-in does not rescue a message that narrates a step.
    for (const text of [
      'next problem 5x - 1 = 9?', 'so factor x^2 - 4 = 0', 'then graph y = 2x + 1', 'find x = 4 so 2x = 8',
      'next problem 5x - 1 = 9 right', 'I got the next problem 5x - 1 = 9', 'factor 2x + 4 = 2(x + 2) because 2 is common',
      'therefore find 3x = 9',
    ]) {
      check(`grounding 2: step words in "${text}" → null`, g(text).problem === null);
    }
    check('grounding 2: lead-in sharing half its numbers with the authored card → null (matches-authored, as before)',
      g('graph y = 2x + 1', '', AUTHORED).reason === 'matches-authored');
    check('grounding 2: step-word reason', g('then graph y = 2x + 1').reason === 'bare-step');
    // With a problem active nothing changed.
    check('grounding 2: bare step while active → bare-problem-active', g('3x + 2 = 11', 'Solve 2x + 6 = 14').reason === 'bare-problem-active');
  }

  // ── Review 1a: an ANSWER never re-grounds the active problem ──────
  {
    const ACTIVE = 'Solve 2x + 6 = 14';
    for (const text of [
      'can you check my answer x = 4',
      'I got x = 4, can you check',
      'how do I solve it, is x = 4?',
      'could you look at x = 4',
      'can you check 5x - 1 = 9 for me',
    ]) {
      const d = g(text, ACTIVE);
      check(`grounding 1a: "${text}" while a problem is active → null (answer-check)`, d.problem === null && d.reason === 'answer-check');
    }
    for (const text of ['is that right, x = 4? can you help', 'can you tell me, is it 4?', 'so my answer is 4, can you help me with 4?']) {
      check(`grounding 1a: "${text}" while a problem is active → null`, g(text, ACTIVE).problem === null);
    }
    // An assignment-shaped relation alone is never a problem, active or not.
    for (const text of ['can you check my answer x = 4', 'I got x = 4, can you check', 'how do I solve it, is x = 4?', 'can you solve x = 4', 'x = 4']) {
      check(`grounding 1a: "${text}" with NO active problem → null`, g(text).problem === null);
    }
    check('grounding 1a: lone assignment in a request → reason assignment-only', g('can you check my answer x = 4').reason === 'assignment-only');
    // …but an assignment that is a GIVEN of a larger problem still grounds.
    check('grounding 1a: "can you help me evaluate 3x + 2 when x = 4" (no active) → grounds on the sentence',
      g('can you help me evaluate 3x + 2 when x = 4').problem === 'evaluate 3x + 2 when x = 4' && g('can you help me evaluate 3x + 2 when x = 4').relation === undefined);
  }

  // ── Review 1b: the SENTENCE is the statement; relation is separate ─
  {
    const cases: Array<[string, string, string | undefined]> = [
      ['can you help me, y = 3 when x = 2 and y = 7 when x = 4, find the slope', 'y = 3 when x = 2 and y = 7 when x = 4, find the slope', undefined],
      ['can you help me find f(3) if f(x) = 2x + 1', 'find f(3) if f(x) = 2x + 1', undefined],
      ['can you graph y = 2x + 1 for me', 'graph y = 2x + 1 for me', undefined],
      ['if a = 3 and b = 4 find c when a^2 + b^2 = c^2', 'if a = 3 and b = 4 find c when a^2 + b^2 = c^2', undefined],
      ['solve for x: 3x + 2 = 11', 'solve for x: 3x + 2 = 11', '3x + 2 = 11'],
      // in doubt ⇒ no relation
      ['solve for x 3x + 2 = 11', 'solve for x 3x + 2 = 11', undefined],
      ['can you solve 2 sin x = 1', 'solve 2 sin x = 1', undefined],
      ['can you solve log(x) = 2', 'solve log(x) = 2', undefined],
      ['can you solve sqrt(x) + 1 = 4', 'solve sqrt(x) + 1 = 4', undefined],
      ['how to solve: x>5 or x<3', 'solve: x>5 or x<3', undefined],
    ];
    for (const [text, statement, relation] of cases) {
      const d = g(text);
      check(`grounding 1b: "${text}" → statement "${statement}"`, d.problem === statement);
      check(`grounding 1b: "${text}" → relation ${relation ?? 'undefined'}`, d.relation === relation);
    }
    // CHANGED (review 2): bare "2 sin x = 1" was pinned as grounding; it has no lead-in.
    check('grounding 1b: bare "2 sin x = 1" → null (no lead-in)', g('2 sin x = 1').problem === null);
    check('relation 1b: "solve for x: 3x + 2 = 11" has no stray x', extractSymbolicRelation('solve for x: 3x + 2 = 11')?.text === '3x + 2 = 11');
    check('relation 1b: "2 sin x = 1" is not read as "x = 1"', extractSymbolicRelation('2 sin x = 1')?.text === '2 sin x = 1');
    check('relation 1b: "f(x) = 2x + 1" kept whole', extractSymbolicRelation('find f(3) if f(x) = 2x + 1')?.text === 'f(x) = 2x + 1');
  }

  // ── Review 1c: an explicit solve request beats the board-question veto ─
  {
    const cases: Array<[string, string | undefined]> = [
      ['how do I solve x^2 + 5x + 6 = 0 and why does factoring work', 'x^2 + 5x + 6 = 0'],
      ['what does 3x + 2 = 11 mean, and can you help me solve it', '3x + 2 = 11'],
      ['Is this right: 3x + 2 = 11? can you help me solve it', '3x + 2 = 11'],
      ['why is 3x+2=11 solved by subtracting? can you solve 5x - 1 = 9 instead', undefined], // two relations
    ];
    for (const [text, relation] of cases) {
      for (const active of ['', 'Solve 2x + 6 = 14']) {
        const d = g(text, active);
        check(`grounding 1c: "${text}" (${active ? 'problem active' : 'nothing active'}) → grounds`, d.problem !== null && d.reason === 'request-relation' && d.relation === relation);
      }
    }
    check('grounding 1c: the statement keeps the named relation',
      (g('why is 3x+2=11 solved by subtracting? can you solve 5x - 1 = 9 instead', '3x + 2 = 11').problem ?? '').includes('5x - 1 = 9'));
    check('grounding 1c: explicit request naming the ACTIVE relation → null',
      g('what does 3x + 2 = 11 mean, and can you help me solve it', '3x + 2 = 11').problem === null);
    check('grounding 1c: board question with no solve request → still null',
      g('why is 3x + 2 = 11 the same as 3x = 9?', 'Solve 5x - 1 = 9').reason === 'board-question');
    check('grounding 1c: "solve <relation>" while another problem is active → re-grounds',
      g('solve 5x - 1 = 9', '3x + 2 = 11').problem === 'solve 5x - 1 = 9');
    check('grounding 1c: narrated ", solve 3x = 9 and get 3" is not an explicit request',
      g('I move the 2 over, solve 3x = 9 and get 3', '4x + 7 = 31').problem === null);
  }

  // Word problems keep the legacy behaviour (verbatim, request-framed).
  {
    const wp = 'Can you help me with a train that goes 45 mph for 3 hours?';
    const d = g(wp);
    check('grounding: request-framed word problem → verbatim, no relation', d.problem === wp && d.relation === undefined && d.reason === 'request-prose');
    check('grounding: word problem echoing the authored one → null',
      g('Can you help me with a car that travels 60 miles in 2 hours?', '', 'A car travels 60 miles in 2 hours; find its speed.').reason === 'matches-authored');
  }

  // Negatives
  check('grounding: "what does x > 5 mean?" → null (board-question)', g('what does x > 5 mean?', 'x > 5 or x < 3').reason === 'board-question');
  check('grounding: "what does x > 5 mean?" with nothing active → null', g('what does x > 5 mean?').problem === null);
  check('grounding: "why is it less than 3?" → null', g('why is it less than 3?', 'x > 5 or x < 3').reason === 'board-question');
  // CHANGED (review 1a): reason label only — with a problem active "I got" is now an answer-check.
  check('grounding: "I got 5" → null', g('I got 5', '3x + 2 = 17').reason === 'answer-check' && g('I got 5').reason === 'no-request');
  check('grounding: "is it x < 3?" → null (board-question)', g('is it x < 3?', 'x > 5 or x < 3').reason === 'board-question' && g('is it x < 3?').problem === null);
  check('grounding: "how do you say x > 5 out loud" → null', g('how do you say x > 5 out loud', '2x > 10').reason === 'board-question');
  check('grounding: "how do I read 3 < x" → null', g('how do I read 3 < x').reason === 'board-question');
  check('grounding: "what is this called, x^2 = 9?" → null', g('what is this called, x^2 = 9?').reason === 'board-question');
  check('grounding: "so is that 2x = 8?" → null', g('so is that 2x = 8?', '2x + 1 = 9').reason === 'board-question');
  // A bare relation mid-problem is the student's step or answer.
  check('grounding: bare step "3x = 9" while a problem is active → null', g('3x = 9', '3x + 2 = 11').reason === 'bare-problem-active');
  check('grounding: bare step with all-new numbers while active → null', g('2x = 9', 'x + x = 4 + 5').reason === 'bare-problem-active');
  check('grounding: bare answer "x = 4" while active → null', g('x = 4', '3x + 2 = 14').problem === null);
  check('grounding: bare answer "x = 4", nothing active → null (answer-shaped)', g('x = 4').reason === 'bare-answer-shaped');
  check('grounding: bare "x > 5 or x < 3" without a request → null (answer-shaped)', g('x > 5 or x < 3').reason === 'bare-answer-shaped');
  check('grounding: "I got x = 5" → null', g('I got x = 5').problem === null);
  check('grounding: relation buried in narration → null (not mostly a relation)',
    g('ok so first I moved the two over and then it became 3x = 9 I think').reason === 'no-request');
  // Self-narration is not a request.
  check('grounding: "let me solve this, 3x = 9" while active → null', g('let me solve this, 3x = 9', '3x + 2 = 11').problem === null);
  check('grounding: "so I solve for x and get 7" → null', g('so I solve for x and get 7', '3x + 2 = 11').problem === null);
  // Divergence gate
  check('grounding: request restating the ACTIVE problem → null (matches-active)',
    g('can you solve 3x + 2 = 11', '3x + 2 = 11').reason === 'matches-active');
  check('grounding: a second, different request while active → re-grounds',
    g('how to solve: 4x - 9 > 15', 'x > 5 or x < 3').problem === 'solve: 4x - 9 > 15' && g('how to solve: 4x - 9 > 15', 'x > 5 or x < 3').relation === '4x - 9 > 15');
  check('grounding: request with no numbers → null (no-content)', g('can you help me with fractions').reason === 'no-content');
  check('grounding: casual chat → null', g("Hey, how's it going today?").problem === null);
  check('grounding: empty → null', g('').reason === 'empty');
  // Kill switch: exactly the legacy detector.
  {
    const off = (t: string, a = '') => decideStudentProblemGrounding({ enabled: false, studentText: t, authoredText: '', activeStatement: a });
    check('kill switch: legacy miss preserved', off('how to solve: x>5 or x<3').problem === null && off('how to solve: x>5 or x<3').reason === 'legacy');
    check('kill switch: legacy verbatim grounding preserved', off(PRONOUNCE).problem === PRONOUNCE);
  }
  // Extractor details
  check('relation: latex comparators normalised', extractSymbolicRelation('$2x + 1 \\le 9$')?.text === '2x + 1 ≤ 9');
  check('relation: answer shape', extractSymbolicRelation('x = 5')?.answerShaped === true && extractSymbolicRelation('3 < x < 5')?.answerShaped === true);
  check('relation: not answer shape', extractSymbolicRelation('3x = 15')?.answerShaped === false);
  check('relation: none in plain prose', extractSymbolicRelation('I think the answer is five') === null);
  check('isBoardQuestion: plain request is not one', isBoardQuestion('can you solve 3x + 2 = 11') === false);
}

// ── isMuteMeCommand ────────────────────────────────────────────────
{
  check(
    'isMuteMeCommand: clear mute request → true',
    isMuteMeCommand('please mute me') === true,
  );
  check(
    'isMuteMeCommand: exact "stop listening" → true',
    isMuteMeCommand('stop listening') === true,
  );
  check(
    'isMuteMeCommand: short sentence mentioning "mute" with no companion word → false',
    isMuteMeCommand('the mute button broke') === false,
  );
  check(
    'isMuteMeCommand: long sentence merely mentioning "mute" (>7 words) → false',
    isMuteMeCommand(
      'I was talking about how loud the mute button on my remote is',
    ) === false,
  );
}

// ── extractSentence1Normalized ─────────────────────────────────────
{
  check(
    'extractSentence1Normalized: splits on terminal punctuation, lowercases + trims',
    extractSentence1Normalized('Hello there! How are you?') === 'hello there',
  );
  check(
    'extractSentence1Normalized: missing space after period still splits (no trailing-space requirement)',
    extractSentence1Normalized('for you.Off the top of my head') === 'for you',
  );
}

// ── deepEqualParams ─────────────────────────────────────────────────
{
  check(
    'deepEqualParams: structurally identical nested object/array → true',
    deepEqualParams({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] }) === true,
  );
  check(
    'deepEqualParams: no type coercion — string "1" !== number 1 → false',
    deepEqualParams({ a: 1 }, { a: '1' }) === false,
  );
  check(
    'deepEqualParams: NaN === NaN special-cased → true',
    deepEqualParams(NaN, NaN) === true,
  );
}

// ── sanitizeInkOcrText ────────────────────────────────────────────
{
  check(
    'sanitizeInkOcrText: meta-description ("the image appears...") rejected → undefined',
    sanitizeInkOcrText('The image appears to contain a triangle') === undefined,
  );
  check(
    'sanitizeInkOcrText: second meta pattern ("photo ... shows") rejected → undefined',
    sanitizeInkOcrText('The photo shows some unclear scribbles') === undefined,
  );
  check(
    'sanitizeInkOcrText: >120 chars rejected → undefined',
    sanitizeInkOcrText('x'.repeat(121)) === undefined,
  );
  check(
    'sanitizeInkOcrText: clean short text passes through trimmed',
    sanitizeInkOcrText('  3x + 5 = 20  ') === '3x + 5 = 20',
  );
  check(
    'sanitizeInkOcrText: non-string number input → undefined',
    sanitizeInkOcrText(42) === undefined,
  );
  check(
    'sanitizeInkOcrText: undefined input → undefined',
    sanitizeInkOcrText(undefined) === undefined,
  );
}

// ── isVerdictOpener ───────────────────────────────────────────────
// Round-15 Issue 2 (2026-07-16): a sentence that opens with a judgment
// of the student's answer must NOT be voiced until the turn's verdict
// is settled — the observed failure was "Not qu…" [audio chop] then an
// affirmation. False positives only add a brief hold; false negatives
// re-open the speak-then-kill window, so the detector leans inclusive.
{
  // negative verdicts
  check('isVerdictOpener: "Not quite." → true', isVerdictOpener('Not quite.') === true);
  check('isVerdictOpener: "Not exactly — think about…" → true', isVerdictOpener('Not exactly — think about the receptor.') === true);
  check('isVerdictOpener: "Close, but not quite." → true', isVerdictOpener('Close, but not quite.') === true);
  check('isVerdictOpener: "Nope, remember the sign." → true', isVerdictOpener('Nope, remember the sign.') === true);
  check('isVerdictOpener: "That\'s not right." → true', isVerdictOpener("That's not right.") === true);
  // affirmations
  check('isVerdictOpener: "That\'s right!" → true', isVerdictOpener("That's right!") === true);
  check('isVerdictOpener: "Exactly." → true', isVerdictOpener('Exactly.') === true);
  check('isVerdictOpener: "Right, that\'s exactly it." → true', isVerdictOpener("Right, that's exactly it.") === true);
  check('isVerdictOpener: "Spot on." → true', isVerdictOpener('Spot on.') === true);
  check('isVerdictOpener: "You got it." → true', isVerdictOpener('You got it.') === true);
  check('isVerdictOpener: "Correct." → true', isVerdictOpener('Correct.') === true);
  // NON-verdicts — runway openers and ordinary narration must not hold
  check('isVerdictOpener: runway opener → false', isVerdictOpener("Let's take a look at this together.") === false);
  check('isVerdictOpener: "No worries — let me draw it." → false', isVerdictOpener('No worries, let me draw it.') === false);
  check('isVerdictOpener: mid-sentence "right" (direction) → false', isVerdictOpener('Now look at the right side of the equation.') === false);
  check('isVerdictOpener: "Okay, next up is the synapse." → false', isVerdictOpener('Okay, next up is the synapse.') === false);
  check('isVerdictOpener: question → false', isVerdictOpener('What do you think happens next?') === false);
  // Round-23 (2026-07-18, session portal-6b84012b): "Right idea, but let's
  // check that carefully" opened a soft-reject of a CORRECT answer and was
  // voiced ungated — `right` was only matched with [.!,] directly after,
  // so the verdict hold and the cross-sentence inversion check never armed.
  check('isVerdictOpener: "Right idea, but…" → true', isVerdictOpener("Right idea, but let's check that carefully.") === true);
  check('isVerdictOpener: "Right track — now…" → true', isVerdictOpener('Right track, now finish the step.') === true);
  check('isVerdictOpener: "Good idea, but…" → true', isVerdictOpener('Good idea, but check the sign.') === true);
  check('isVerdictOpener: "Good start — keep going." → true', isVerdictOpener('Good start, keep going.') === true);
  check('isVerdictOpener: "Good thinking, but…" → true (pre-existing)', isVerdictOpener('Good thinking, but look again.') === true);
  check('isVerdictOpener: "Close — but…" → true (pre-existing)', isVerdictOpener('Close — but check the denominator.') === true);
  check('isVerdictOpener: "The right idea here is…" mid-sentence → false', isVerdictOpener('The right idea here is substitution.') === false);
  // R38: "Right — X." / "Yes — X." verdict openers must be held (embed-1785738371329:
  // "Right — one half." fast-opened ungated, then the same turn taught "one third").
  check('isVerdictOpener: "Right — one half." → true', isVerdictOpener('Right — one half.') === true);
  check('isVerdictOpener: "Yes — that is exactly the pattern." → true', isVerdictOpener('Yes — that is exactly the pattern.') === true);
  check('isVerdictOpener: "No — look at the denominator again." → true', isVerdictOpener('No — look at the denominator again.') === true);
  check('isVerdictOpener: "Right, one half." → true', isVerdictOpener('Right, one half.') === true);
  check('isVerdictOpener: "Right now, look at the board." → false', isVerdictOpener('Right now, look at the board.') === false);
  check('isVerdictOpener: "No problem, take your time." → false', isVerdictOpener('No problem, take your time.') === false);
  check('isVerdictOpener: "Yes and no — it depends on the base." → true', isVerdictOpener('Yes and no — it depends on the base.') === true);
}

// ── inferAdvanceFromSegmentCard ───────────────────────────────────
// Round-15 Issue 1 (2026-07-16): the brain walks the board forward via
// show_segment_card without calling advance_lesson, freezing the
// pedagogical cursor (and the portal progress pills) at the opening
// segment. The orchestrator infers the advance when the card resolves
// to a segment strictly LATER in the plan than the cursor.
{
  const ids = ['hook', 'concept', 'worked-1', 'try-1', 'recap'];
  check(
    'inferAdvanceFromSegmentCard: card for a later segment → infer',
    inferAdvanceFromSegmentCard(ids, 'hook', 'try-1') === true,
  );
  check(
    'inferAdvanceFromSegmentCard: card for the immediate next segment → infer',
    inferAdvanceFromSegmentCard(ids, 'hook', 'concept') === true,
  );
  check(
    'inferAdvanceFromSegmentCard: re-render of the current segment → no advance',
    inferAdvanceFromSegmentCard(ids, 'try-1', 'try-1') === false,
  );
  check(
    'inferAdvanceFromSegmentCard: card for an EARLIER segment (revisit) → no advance',
    inferAdvanceFromSegmentCard(ids, 'try-1', 'concept') === false,
  );
  check(
    'inferAdvanceFromSegmentCard: empty cursor (free conversation) → no advance',
    inferAdvanceFromSegmentCard(ids, '', 'concept') === false,
  );
  check(
    'inferAdvanceFromSegmentCard: unknown cursor id → no advance',
    inferAdvanceFromSegmentCard(ids, 'not-a-segment', 'concept') === false,
  );
  check(
    'inferAdvanceFromSegmentCard: unknown target id → no advance',
    inferAdvanceFromSegmentCard(ids, 'hook', 'not-a-segment') === false,
  );
}

// ── latexProseFiller ──────────────────────────────────────────────
// Round-25 (session portal-59ae30c7): the brain aborted a self-correction
// mid-thought INSIDE a show_equation latex arg — the board rendered
// "e^x \sin x' \cdot wait" verbatim.
{
  check('latexProseFiller: the live "· wait" card → caught',
    latexProseFiller("\\frac{d}{dx}[e^x \\sin x] = e^x \\sin x' \\cdot wait") === 'wait');
  check('latexProseFiller: "hold on" mid-latex → caught',
    latexProseFiller('x^2 + hold on') === 'hold on');
  check('latexProseFiller: clean equation → null',
    latexProseFiller("\\frac{d}{dx}[e^x \\sin x] = e^x \\sin x + e^x \\cos x") === null);
  check('latexProseFiller: \\text{waiting time} is legitimate → null',
    latexProseFiller('W = \\text{waiting time} + 5') === null);
  check('latexProseFiller: \\text{no waiting} + real filler → caught',
    latexProseFiller('\\text{waiting time} = umm 5') === 'umm');
}

// ── withInactivityTimeout ─────────────────────────────────────────
// Round-23 (2026-07-18, session portal-6b84012b): the "Nailed it." turn's
// Anthropic stream went quiet ~55s BETWEEN sentences without throwing
// (server total=62578ms, retries=0), so no retry tier engaged and the
// student sat in dead air. The watchdog turns inter-event silence into a
// thrown error that the existing classify/decide machinery handles.
// Async tests — the summary/exit gate moves inside the IIFE so it still
// runs LAST.
void (async () => {
  async function* paced(events: string[], gapMs: number): AsyncGenerator<string, void, unknown> {
    for (const e of events) {
      await new Promise((r) => setTimeout(r, gapMs));
      yield e;
    }
  }
  {
    const got: string[] = [];
    for await (const e of withInactivityTimeout(paced(['a', 'b', 'c'], 5), 200)) got.push(e);
    check('withInactivityTimeout: fast stream passes through untouched', got.join(',') === 'a,b,c');
  }
  {
    async function* stalls(): AsyncGenerator<string, void, unknown> {
      yield 'a';
      await new Promise((r) => setTimeout(r, 500));
      yield 'never';
    }
    const got: string[] = [];
    let msg = '';
    try {
      for await (const e of withInactivityTimeout(stalls(), 60)) got.push(e);
    } catch (err) {
      msg = err instanceof Error ? err.message : String(err);
    }
    check('withInactivityTimeout: stalled stream throws, keeps earlier events', /stalled/.test(msg) && got.join(',') === 'a');
    check(
      'withInactivityTimeout: stall error classifies transient (composes with decideBrainRetry)',
      classifyBrainError(new Error(msg)) === 'transient',
    );
  }
  {
    // Early consumer exit (route breaks on client-gone) must still run the
    // underlying generator's cleanup.
    let cleaned = false;
    async function* withCleanup(): AsyncGenerator<string, void, unknown> {
      try {
        yield 'a';
        yield 'b';
      } finally {
        cleaned = true;
      }
    }
    for await (const e of withInactivityTimeout(withCleanup(), 200)) {
      if (e === 'a') break;
    }
    check('withInactivityTimeout: early break forwards cleanup to the wrapped generator', cleaned);
  }

  console.log(`\norchestrator-helpers: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
