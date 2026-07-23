/**
 * Non-answer praise backstop (live round 5, 2026-07-23, session-1784778855564).
 *
 * Observed failure: tutor asked "what's its acceleration?", the student said
 * "Oh, okay." — a pure acknowledgment, not an answer — and the brain replied
 * "Exactly.4 meters per second squared", praising a non-answer AND revealing
 * the answer to its own open question. The per-turn <verdict_guard> block was
 * attached (verified) and the model blew through it under praise-opener
 * momentum (3 consecutive legit "Exactly." openers preceded the turn), so a
 * prompt rule alone is not enough — this is the deterministic client-side
 * backstop, same tier as the contradiction-inversion kill.
 *
 * Deliberately narrow, both ways:
 *  - the student utterance must EXACTLY match a closed acknowledgment-phrase
 *    list (after filler stripping). "yes"/"yeah"/"no" are excluded — they can
 *    be legitimate answers to yes/no questions; bare "right" is excluded — it
 *    can answer a direction question.
 *  - the turn must open with a praise verdict IMMEDIATELY followed by a
 *    numeric value ("Exactly.4 meters…", "Right. 45 N…"). A praise-opener
 *    that continues into prose ("Right. Here's the next one: a 5 kg box…")
 *    does NOT fire — that's a legit discourse marker + new problem.
 *
 * Tests: npm run test:nonanswer-praise.
 */

/** Filler tokens stripped before matching (never load-bearing). */
const FILLER = new Set(['um', 'uh', 'er', 'like', 'so', 'well']);

/** Closed phrase list — a pure acknowledgment carries no answer content. */
const ACK_PHRASES = new Set([
  'oh', 'okay', 'ok', 'oh okay', 'oh ok', 'okay okay',
  'mhm', 'mm', 'hmm', 'mm hmm', 'mmhmm', 'uh huh', 'huh',
  'alright', 'all right', 'oh alright', 'oh all right',
  'got it', 'oh got it', 'okay got it', 'gotcha', 'oh gotcha',
  'i see', 'oh i see', 'ah', 'aha', 'ah okay', 'ah i see',
  'makes sense', 'that makes sense', 'sounds good', 'okay cool', 'cool',
  'sure', 'fine', 'okay sure',
]);

export function isPureAcknowledgment(text: string): boolean {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !FILLER.has(w));
  if (words.length === 0 || words.length > 4) return false;
  return ACK_PHRASES.has(words.join(' '));
}

/** Praise verdict opener followed IMMEDIATELY by a numeric value — the
 *  answer-reveal shape ("Exactly.4 meters…", "Right. 45 N…"). Prose after
 *  the praise ("Right. Here's the next one…") deliberately does not match. */
const PRAISE_THEN_VALUE_RE =
  /^\s*(?:exactly|correct|perfect|right|spot on|nailed it|you got it|that['’]s (?:right|it|correct))[.!,]?\s*[^a-z\d]*\d/i;

/**
 * Should this attempt be killed as praise-plus-reveal to a non-answer?
 * `attemptText` is the turn's accumulated narration so far — evaluate on
 * each new sentence; fires as soon as the reveal shape completes.
 */
export function shouldKillNonAnswerPraise(studentText: string, attemptText: string): boolean {
  if (!isPureAcknowledgment(studentText)) return false;
  return PRAISE_THEN_VALUE_RE.test(attemptText);
}

/** Retry feedback fed to the brain via the standard rejection channel. */
export function nonAnswerPraiseFeedback(studentText: string): string {
  return (
    `The student said "${studentText.trim()}" — an acknowledgment, NOT an answer. ` +
    `You affirmed it and revealed the answer to your own open question. ` +
    `Re-emit your response: no verdict word, do NOT state the answer or its value. ` +
    `The student has not answered yet — briefly re-invite them (e.g. "Take your time — what do you get?") or keep waiting.`
  );
}
