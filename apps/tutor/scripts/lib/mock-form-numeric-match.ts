/**
 * Mock-form ingest: does an independent solve agree with an item's numeric
 * key? Used by scripts/seed-mock-form.ts's verify gate; kept here (pure, no
 * Mongo, no SDK) because that script runs `main()` on import.
 *
 * It is the SHARED numeric rule (src/lib/tutor/portal/numeric-answer-rule.ts),
 * applied through the very function that scores a live mock exam
 * (`answersMatch`, src/lib/tutor/mock-exam/scoring.ts): a key is verified at
 * ingest iff a student typing the solver's answer would be marked right. Until
 * 2026-10-10 the seeder had its own check — anything within 1% of the key —
 * so a key the live scorer would never accept the true answer for (42 against
 * a solve of 42.3) went live as "verified".
 *
 * One thing the seeder needs that live scoring does not: the key must itself
 * be a plain number under the shared key parser. `answersMatch` falls back to
 * text equality for a non-number key; a "numeric" item with such a key is
 * never verified here.
 */
import { answersMatch } from '../../src/lib/tutor/mock-exam/scoring';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';

export function solveMatchesNumericKey(expected: string, got: string): boolean {
  if (!parseNumericKey(expected ?? '')) return false;
  return answersMatch({ responseFormat: 'numeric', answer: expected }, got);
}
