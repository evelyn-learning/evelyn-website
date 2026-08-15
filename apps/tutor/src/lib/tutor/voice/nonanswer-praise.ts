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

/** 2026-08-07 triage extension: two more non-answer classes, same closed-set
 *  philosophy as ACK_PHRASES.
 *  - 'idk'    — an explicit give-up ("I don't know." → "Right, a circle!" in
 *               session-1786064015703: the reveal must never be praise-phrased).
 *  - 'request'— the student asked for something instead of answering
 *               ("gtive another example" → "One eighth. Nice." in
 *               embed-1786076855391: a request is never gradeable).
 *  Apostrophes are stripped WITHOUT inserting a space ("don't" → "dont") so
 *  contraction variants collapse to one spelling. */
export type NonAnswerKind = 'ack' | 'idk' | 'request';

const IDK_RE =
  /^(?:i\s+)?(?:dont\s+know|do\s+not\s+know|dunno|idk|no\s+idea|have\s+no\s+idea|not\s+sure|im\s+not\s+sure|i\s+am\s+not\s+sure|no\s+clue|forget|forgot|dont\s+remember)$/;

/** Anchored request shapes — imperative ask, polite ask, or the "another
 *  example/one" tail (covers STT-mangled verbs like "gtive"). */
const REQUEST_RES: RegExp[] = [
  /^(?:please\s+)?(?:give|show|tell|explain|teach|repeat)\b/,
  /^(?:can|could|would|will)\s+(?:you|we)\b/,
  /\banother\s+(?:example|one)\b/,
  /^what\s+do\s+you\s+mean\b/,
  /^(?:please\s+)?help(?:\s+me)?$/,
  /^(?:give\s+me\s+)?a\s+hint$|^hints?$/,
];

export function classifyNonAnswer(text: string): NonAnswerKind | null {
  if (isPureAcknowledgment(text)) return 'ack';
  const words = text
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !FILLER.has(w));
  if (words.length === 0) return null;
  const joined = words.join(' ');
  // A long utterance carries content — grade it, don't classify it away.
  if (words.length <= 5 && IDK_RE.test(joined)) return 'idk';
  if (words.length <= 8 && REQUEST_RES.some((re) => re.test(joined))) return 'request';
  return null;
}

/** Praise verdict opener followed IMMEDIATELY by a numeric value — the
 *  answer-reveal shape ("Exactly.4 meters…", "Right. 45 N…"). Prose after
 *  the praise ("Right. Here's the next one…") deliberately does not match. */
/** `(?:\\[a-z]+[^a-z\d]*)*` steps over TeX commands so a latex-wrapped reveal
 *  ("Exactly. $\frac{1}{8}$ …") still counts as praise-then-value; ordinary
 *  prose after the praise ("Right. Here's the next one…") still doesn't. */
const PRAISE_THEN_VALUE_RE =
  /^\s*(?:exactly|correct|perfect|right|spot on|nailed it|you got it|that['’]s (?:right|it|correct))[.!,]?\s*[^a-z\d]*(?:\\[a-z]+[^a-z\d]*)*\d/i;

/**
 * Should this attempt be killed as praise-plus-reveal to a non-answer?
 * `attemptText` is the turn's accumulated narration so far — evaluate on
 * each new sentence; fires as soon as the reveal shape completes.
 */
export function shouldKillNonAnswerPraise(studentText: string, attemptText: string): boolean {
  if (classifyNonAnswer(studentText) === null) return false;
  return PRAISE_THEN_VALUE_RE.test(attemptText);
}

/** Retry feedback fed to the brain via the standard rejection channel —
 *  worded per non-answer class. */
export function nonAnswerPraiseFeedback(studentText: string): string {
  const quoted = `The student said "${studentText.trim()}"`;
  const kind = classifyNonAnswer(studentText);
  if (kind === 'idk') {
    return (
      `${quoted} — they do NOT know and gave no answer, yet you opened with praise and revealed the answer as if grading a correct reply. ` +
      `Re-emit your response: no verdict or praise word ("Right." / "Exactly." / "Nice."). ` +
      `Either guide them with a smaller step or hint, or — if you choose to reveal — reveal plainly and kindly ("No worries — it's …"), never as an affirmation.`
    );
  }
  if (kind === 'request') {
    return (
      `${quoted} — a REQUEST, not an answer. You treated it as a correct answer: you answered your own open question and praised. ` +
      `Re-emit your response: respond to the request itself, no verdict or praise word, and do NOT answer your own question for them. ` +
      `Do not narrate this classification ("that's a request, not an answer") — just respond naturally ("Sure — here's one more.").`
    );
  }
  return (
    `${quoted} — an acknowledgment, NOT an answer. ` +
    `You affirmed it and revealed the answer to your own open question. ` +
    `Re-emit your response: no verdict word, do NOT state the answer or its value. ` +
    `The student has not answered yet — briefly re-invite them (e.g. "Take your time — what do you get?") or keep waiting.`
  );
}
