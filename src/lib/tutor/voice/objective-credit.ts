/**
 * Objective-correct pacing-credit decision (R47 Task 1, live incident
 * session portal-d859df30): a deterministic false-denial kill — arithmetic-
 * claim-check, simplification-verdict-check, or inverse-verdict-check — is
 * machine proof the STUDENT's answer was right. Only the `false_denial`
 * verdict qualifies (the brain wrongly denied a correct student answer);
 * arithmetic's `false_assertion` branch is the brain being wrong about its
 * OWN asserted math and carries no proof about the student, so callers must
 * never stash a signal for it.
 *
 * Why this exists: the pacing block downstream infers correctness from two
 * regexes run over the brain's prose — `brainAffirmationRegex` on the turn's
 * opener and `brainCorrectionRegex` on the full turn text. Those are fine
 * heuristics for ordinary turns, but they misread the text a KILLED-then-
 * RETRIED turn produces: the retry often narrates the correction it just
 * made ("Right, exactly. 72 minus 3 is 69 — so your setup and your
 * arithmetic were…"), and that narration trips brainCorrectionRegex even
 * though the retry is AFFIRMING the student. Live incident: the kill fired
 * on a correct "72 minus 3, that's 69", the retry affirmed it, but the
 * regex reading of the retry's correction-narrative phrasing fired
 * streak-incorrect anyway — the segment ended "visited, not mastered".
 *
 * An objective signal for THIS turn forces 'correct' regardless of the
 * regex reading, because the deterministic checker already proved the
 * student's answer right before the brain ever got a chance to narrate
 * anything about it.
 *
 * Deliberate widening: the objective path credits even when
 * `isVerification` is false. The verification classifier is a heuristic
 * read of the STUDENT's utterance (digits/math-language/word-count) and is
 * exactly the kind of messy-utterance misclassification the live incident
 * is about; the deterministic kill only fires when the student's utterance
 * contained a checkable claim/answer in the first place, which is a
 * strictly stronger signal that the student did state an answer.
 *
 * Pure module — no side effects, never throws.
 */
export interface ObjectiveCorrectSignal {
  source: 'arith_false_denial' | 'simplification_false_denial' | 'inverse_false_denial';
  segId: string;
  atMs: number;
}

export interface PacingCreditDecision {
  credit: 'correct' | 'incorrect' | 'none';
  objective: boolean;
}

/** Decide the pacing-credit branch for a completed brain turn.
 *  An objective signal for THIS turn forces 'correct' regardless of the
 *  affirm/correction regex reading — the deterministic checker already
 *  proved the student's answer right; the regexes are only fallback
 *  heuristics over brain prose (they misread post-kill retries that
 *  NARRATE the correction, live incident portal-d859df30). */
export function decidePacingCredit(args: {
  isVerification: boolean;
  isAffirm: boolean;      // brainAffirmationRegex on the head
  isCorrect: boolean;     // brainCorrectionRegex on fullText (misnomer kept: true = correction detected)
  objectiveSignal: ObjectiveCorrectSignal | null;  // stashed this turn, segId-matched by caller
}): PacingCreditDecision {
  if (args.objectiveSignal) return { credit: 'correct', objective: true };
  if (!args.isVerification) return { credit: 'none', objective: false };
  if (args.isAffirm && !args.isCorrect) return { credit: 'correct', objective: false };
  if (args.isCorrect) return { credit: 'incorrect', objective: false };
  return { credit: 'none', objective: false };
}
