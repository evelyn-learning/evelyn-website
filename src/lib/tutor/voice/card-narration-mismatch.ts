/**
 * Deterministic detector for a card/narration numeric mismatch (E2, prod
 * session 2026-08-06/07): the brain called `show_segment_card` for a
 * worked-example segment, the orchestrator resolved the AUTHORED card text
 * onto the whiteboard ("A car travels 240 miles in 4 hours. Find the rate
 * of change"), but the brain's SPOKEN narration described a completely
 * different, improvised problem in the same turn ("A taxi charges a $5
 * flat fee plus $1.50 per kilometer…"), then scolded the student for
 * answering the card that was actually on the board. The judge LLM
 * flagged the mismatch but only as advisory (judge kills only on severity
 * 'kill'), and the existing structural guards (the show_worked_example /
 * show_problem divergence checks in VoiceTutorRealtime.tsx) compare the
 * brain's TOOL PAYLOAD against the authored text — they never look at
 * what the brain actually SAID. This module closes that gap by comparing
 * the authored card against the turn's spoken text instead.
 *
 * Extraction mirrors the show_worked_example numeric-set check's approach
 * (VoiceTutorRealtime.tsx, `numRe = /-?\d+(?:\.\d+)?/g` numeric-set
 * comparison) — reused here as NUMBER_RE — but the LEFT side is the
 * spoken turn text, not a tool argument.
 *
 * Deliberately conservative — a false-positive kill is jarring (it chops
 * the brain's audio mid-turn), so this only fires on the unambiguous
 * shape:
 *   - No numbers on the card at all → nothing to ground the comparison
 *     against → PASS (skip).
 *   - Fewer than 2 numbers spoken → treated as a short transition/verdict
 *     ("Right, 5." / "Let's check your answer.") → PASS, never enough
 *     signal to call it a competing "problem statement".
 *   - The speech reuses ANY of the card's numbers → treated as a
 *     paraphrase of the card, or a computed step off it (a rate, a
 *     partial answer) → PASS, even if the speech also introduces other
 *     new numbers (an intermediate result, a follow-up value, etc.).
 *   - Only when the speech has >=2 numbers, ALL of which are absent from
 *     the card, do we conclude the brain is narrating a genuinely
 *     DIFFERENT problem → REJECT.
 *
 * Pure module — no imports, no side effects. Never throws.
 */

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;

export interface CardNarrationMismatchResult {
  reject: boolean;
  /** Numbers found on the authored card (debug/logging aid). */
  cardNums?: string[];
  /** Spoken numbers absent from the card (debug/logging aid). */
  newNums?: string[];
}

export function detectCardNarrationMismatch(
  cardText: string,
  spokenText: string,
): CardNarrationMismatchResult {
  const cardNums = new Set(cardText.match(NUMBER_RE) || []);
  if (cardNums.size === 0) {
    // Nothing numeric on the card to ground the comparison — skip.
    return { reject: false };
  }
  const spokenNums = new Set(spokenText.match(NUMBER_RE) || []);
  if (spokenNums.size < 2) {
    // Short transition / bare verdict — not enough signal to call this a
    // competing problem statement.
    return { reject: false };
  }
  const hasCardNum = [...spokenNums].some((n) => cardNums.has(n));
  if (hasCardNum) {
    // Paraphrase of the card, or a computed step referencing it.
    return { reject: false };
  }
  const newNums = [...spokenNums].filter((n) => !cardNums.has(n));
  if (newNums.length >= 2) {
    return { reject: true, cardNums: [...cardNums], newNums };
  }
  return { reject: false };
}
