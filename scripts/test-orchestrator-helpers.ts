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
  isVerdictOpener,
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
