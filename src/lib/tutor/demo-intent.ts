/**
 * Task E3 (pedagogy, flag NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER) — demo-intent
 * capture. Classifies what a DEMO (logged-out) student seemed to want from
 * the session, from their own words only, so the page can attach one
 * analytics label at session end (useDemoTracker interaction — NEVER a
 * student profile/record write; demo sessions stay zero-persistence).
 *
 * Deliberately CONSERVATIVE: few, high-precision keyword/phrase patterns.
 * Recall is intentionally low — a missed signal costs nothing (the label is
 * advisory analytics), while a false "considering-enrolling" pollutes the
 * funnel data. Do not broaden these patterns with single ambiguous words
 * ("join", "price", "more") that collide with ordinary math/tutoring talk.
 *
 * Pure, total, no I/O.
 */

export type DemoIntent =
  | 'exploring'
  | 'considering-enrolling'
  | 'curious-how-ai-teaches';

/** Enrolment/purchase interest — the highest-value signal. */
const ENROLLING_PATTERNS: RegExp[] = [
  /\bsign(?:ing|ed)?\s+up\b/i,
  /\benrol{1,2}(?:ing|ed|ment)?\b/i,
  /\bsubscri(?:be|bing|bed|ption)\b/i,
  /\bfor my (?:kid|kids|son|daughter|child|children)\b/i,
];

/** Curiosity about the AI/tech itself rather than the subject matter. */
const CURIOUS_AI_PATTERNS: RegExp[] = [
  /\bhow does (?:the|this) ai\b/i,
  /\bhow do you (?:work|actually work)\b/i,
  /\bare you (?:a )?(?:robot|real|human|an? ai)\b/i,
  /\bis this (?:a )?(?:robot|real person|an? ai)\b/i,
  /\bhow (?:were|was) you (?:made|built|trained)\b/i,
];

/** Explicit browsing/no-commitment statements. */
const EXPLORING_PATTERNS: RegExp[] = [
  /\bjust looking\b/i,
  /\bjust browsing\b/i,
  /\bchecking (?:it|this|you) out\b/i,
  /\bjust trying (?:it|this) out\b/i,
];

/**
 * Scans the student's turns (their raw transcript texts, oldest-first or
 * any order — order is irrelevant) and returns the strongest matched
 * intent, or null when nothing clearly matches (the common case, by
 * design). Precedence: considering-enrolling > curious-how-ai-teaches >
 * exploring — enrolment interest dominates because it is the signal the
 * funnel analytics exist to catch.
 */
export function detectDemoIntent(studentTurns: string[]): DemoIntent | null {
  const matchesAny = (patterns: RegExp[]): boolean =>
    studentTurns.some((turn) => typeof turn === 'string' && patterns.some((re) => re.test(turn)));
  if (matchesAny(ENROLLING_PATTERNS)) return 'considering-enrolling';
  if (matchesAny(CURIOUS_AI_PATTERNS)) return 'curious-how-ai-teaches';
  if (matchesAny(EXPLORING_PATTERNS)) return 'exploring';
  return null;
}
