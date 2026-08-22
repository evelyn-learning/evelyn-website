/**
 * How the pacing layer reads the tutor's own words to decide whether the
 * student's answer was credited.
 *
 * R53 (live, portal-8d15f85c). The student answered "Quito" correctly TWICE
 * and was affirmed both times — and pacing recorded `incorrect=2`. The tutor
 * then told them "that Quito question is still hanging out there waiting for
 * your answer" and made them answer a third time. Two independent defects,
 * both in patterns written against assumed phrasing:
 *
 *  (A) THE AFFIRMATION IS ^-ANCHORED, so a conversational lead-in defeats it.
 *      Turn 1 was "Ah, Quito — got it. Right, Quito stays cooler!" — the
 *      affirmation is in the SECOND sentence, the anchor sees "Ah," and the
 *      turn scored NO credit. Tutors open with an interjection constantly;
 *      the anchor assumed they never do.
 *
 *  (B) THE CORRECTION PATTERN RAN OVER THE WHOLE TURN AND `almost` IS AN
 *      ORDINARY ENGLISH ADVERB. Turn 2 opened "Right — Quito stays cooler
 *      because of the elevation!" (a clean affirm) and forty words later
 *      described the Atacama as a place where "rain **almost** never falls".
 *      That matched, and a correct answer was scored INCORRECT.
 *
 *  (B) is the damaging one: it does not merely fail to credit, it credits the
 *  wrong way and corrupts the learner model. A lesson about a dry desert
 *  marked the student wrong for saying the right thing.
 *
 * Kept as a pure module so both defects are testable and so the next person
 * tuning them can see the live cases they were derived from.
 */

/** Affirmation openers, WITHOUT the disqualifier lookahead (applied separately
 *  so it can span the whole head while the opener is matched per sentence). */
const AFFIRM_OPENER_RE =
  /^[*_~`\s]*(exactly|that'?s right|that is right|correct|perfect|nice work|nice job|nice|good job|good|great|right|yes|yep|yeah|spot[\s-]?on|absolutely|you got it|you'?ve got it|you have got it|you'?re right|bingo)\b/i;

/**
 * Disqualifiers come in two strengths, because the original single list mixed
 * verdict language with ordinary English and the ordinary words dominated.
 *
 * WEAK — `but` and `almost` are hedges ONLY inside the affirming sentence
 * itself ("Right, but you missed a step"). Anywhere later they are just
 * prose, and treating them as reversals is what denied credit to
 * "Right, Quito stays cooler! Same latitude as Guayaquil, BUT way up in
 * those thin Andes mountains…" — a clean affirmation followed by a normal
 * subordinate clause.
 */
const WEAK_DISQUALIFIER_RE = /\b(but|almost)\b/i;

/**
 * STRONG — these mean a reversal wherever they land near the affirmation, so
 * they are checked across the affirming sentence AND the one after it.
 * "Right. But actually, hold on — that isn't it." must never read as credit.
 */
const STRONG_DISQUALIFIER_RE =
  /\b(however|not\s+quite|let\s+me\s+(?:re)?check|wait|actually|hmm|hold on|wrong|incorrect)\b/i;

/**
 * Correction markers. `almost` and `close but` are the evaluative ones and
 * `almost` alone was the live false positive, so it now requires a verdict
 * context: "you're almost", "almost there", or sentence-initial "Almost —".
 * Bare adverbial use ("rain almost never falls", "almost every student")
 * no longer counts as marking the student wrong.
 */
const CORRECTION_RE =
  /\b(not\s+quite|that'?s\s+not|that\s+is\s+not|let'?s\s+(?:re)?check|close\s+but|incorrect)\b/i;

/** The evaluative uses of "almost" only. */
const ALMOST_VERDICT_RE =
  // Sentence-initial "Almost" counts only when it STANDS ALONE — followed by
  // punctuation ("Almost —", "Almost!") or an evaluative word. Caught by this
  // module's own suite: "Almost every JEE coordinate question hides a circle"
  // is sentence-initial ordinary prose, and treating it as a verdict marked a
  // student wrong on an OPENING turn, before they had said anything.
  /(?:^|[.!?]\s*)almost\s*(?:[—–\-,!.]|\b(?:there|right|it|correct)\b)|\b(?:you'?re|you\s+are|that'?s|that\s+is)\s+almost\b|\balmost\s+(?:there|right|it|correct)\b/i;

/** Split on sentence ends. Terminator + optional space + capital, so a
 *  decimal ("10.5") is never treated as a boundary — digits are not
 *  capitals. `\s*` because real turns run sentences together with no space. */
function sentences(text: string): string[] {
  return (text || '').split(/(?<=[.!?])\s*(?=[A-Z"'“])/).filter((s) => s.trim().length > 0);
}

/** How many leading sentences may carry the affirmation. Two, because the
 *  live miss put it in the second after an interjection; more than that and
 *  a mid-turn "right" inside ordinary prose starts qualifying. */
export const AFFIRM_SENTENCE_WINDOW = 2;

export interface PacingVerdictRead {
  isAffirm: boolean;
  isCorrection: boolean;
  /** Which sentence index carried the affirmation (-1 when none). */
  affirmSentence: number;
}

/**
 * Read the tutor's turn for an affirmation and/or a correction.
 * Pure, total, never throws.
 */
export function readPacingVerdict(fullText: string): PacingVerdictRead {
  const text = fullText || '';
  const head = text.slice(0, 200);
  const parts = sentences(head).slice(0, AFFIRM_SENTENCE_WINDOW);
  let affirmSentence = -1;
  for (let i = 0; i < parts.length; i++) {
    if (AFFIRM_OPENER_RE.test(parts[i])) { affirmSentence = i; break; }
  }
  // Weak markers only count inside the affirming sentence; strong ones also
  // count in the sentence after it, where a reversal would land.
  const affirmText = affirmSentence >= 0 ? parts[affirmSentence] : '';
  const nextText = affirmSentence >= 0 ? (parts[affirmSentence + 1] ?? '') : '';
  const disqualified =
    WEAK_DISQUALIFIER_RE.test(affirmText) ||
    STRONG_DISQUALIFIER_RE.test(`${affirmText} ${nextText}`);
  const isCorrection = CORRECTION_RE.test(text) || ALMOST_VERDICT_RE.test(text);
  return {
    isAffirm: affirmSentence >= 0 && !disqualified,
    isCorrection,
    affirmSentence,
  };
}
