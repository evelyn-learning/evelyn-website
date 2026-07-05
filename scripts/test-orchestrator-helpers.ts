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
  isMuteMeCommand,
  extractSentence1Normalized,
  deepEqualParams,
} from '../src/lib/tutor/orchestrator/text-heuristics';
import { sanitizeInkOcrText } from '../src/lib/tutor/orchestrator/ink-capture';

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

console.log(`\norchestrator-helpers: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
