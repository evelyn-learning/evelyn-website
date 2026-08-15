/**
 * Freestyle-text trigger detection.
 *
 * Decides whether a student-submitted message is large/structured enough
 * to warrant generating an on-the-fly lesson plan from its content (vs.
 * being treated as a regular conversational turn).
 *
 * Heuristics only — no LLM, no subject knowledge. Pure shape detection
 * so the call site can run it on every message cheaply and synchronously.
 *
 * Generic by design: the detector must not depend on subject vocabulary,
 * topic-specific phrasing, or curriculum standards. New triggers should
 * stay structural (length, markup patterns, repeated openers).
 */

export interface FreestyleTriggerResult {
  /** Caller should kick off plan generation. */
  shouldGeneratePlan: boolean;
  /** Why we triggered (or didn't). Logged for telemetry; never shown to
   *  the student. Generic shape — no subject names. */
  reason: string;
  /** Rough item count we saw in the text (numbered items, bullet items,
   *  or repeated learning-style openers like "Know …", "Understand …",
   *  "Be able to …"). Useful for the acknowledgment turn so the brain
   *  can say "I see ~N items". 0 when the trigger is length-only. */
  detectedItemCount: number;
}

/** Minimum length above which a single-paragraph message is treated as
 *  study material rather than chat. Tuned to the typical short-chat /
 *  long-paste boundary; well below the size of pasted study guides. */
const LENGTH_THRESHOLD = 200;

/** Lines starting with a numbered or bulleted marker. Generic — matches
 *  "1.", "1)", "- ", "* ", "• ", "→ ". */
const LIST_MARKER_RE = /^\s*(?:[-*•→]|\d+[.)])\s+\S/gm;

/** Repeated learning-objective opener words. Curriculum-neutral verbs
 *  that show up in study outlines across domains; this is a STRUCTURAL
 *  signal (repetition pattern), not a content signal. We only count
 *  these when they appear repeatedly in the same message, which is the
 *  cue that the text is a study outline. */
const OBJECTIVE_OPENER_RE = /\b(?:Know|Understand|Identify|Describe|Explain|Compare|Compute|Apply|Recognize|Be able to)\s+/g;

export function detectFreestyleText(text: string): FreestyleTriggerResult {
  if (!text || typeof text !== 'string') {
    return { shouldGeneratePlan: false, reason: 'empty input', detectedItemCount: 0 };
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { shouldGeneratePlan: false, reason: 'empty after trim', detectedItemCount: 0 };
  }

  // Count list-style items and repeated objective openers. These are
  // additive signals — either one alone is enough if it's strong.
  const listMatches = trimmed.match(LIST_MARKER_RE) ?? [];
  const openerMatches = trimmed.match(OBJECTIVE_OPENER_RE) ?? [];
  const itemCount = Math.max(listMatches.length, openerMatches.length);

  // Strong structural signal: many enumerated items in one message. Even
  // a short text fires the trigger if it's clearly a list.
  if (itemCount >= 3) {
    return {
      shouldGeneratePlan: true,
      reason: `${itemCount} structured items detected`,
      detectedItemCount: itemCount,
    };
  }

  // Length signal: long single-paragraph or mixed text. We pair it with
  // a soft check that the text contains at least one sentence terminator
  // so we don't fire on a 200-char URL or a code paste.
  const looksLikeProse = /[.!?]\s/.test(trimmed);
  if (trimmed.length >= LENGTH_THRESHOLD && looksLikeProse) {
    return {
      shouldGeneratePlan: true,
      reason: `length ${trimmed.length} >= ${LENGTH_THRESHOLD} with prose structure`,
      detectedItemCount: itemCount,
    };
  }

  return {
    shouldGeneratePlan: false,
    reason: `length ${trimmed.length}, items ${itemCount} — below thresholds`,
    detectedItemCount: itemCount,
  };
}
