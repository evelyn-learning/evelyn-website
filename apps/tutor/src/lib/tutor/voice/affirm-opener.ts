/**
 * The affirmation-opener pattern, shared by the pacing verdict reader
 * (pacing-verdict.ts) and the praise-then-exclusion detector
 * (praise-exclusion.ts). A leaf module so both can import it.
 *
 * 2026-10-04 (live, student gac-test-001). `pacing_streak correct=2` and
 * `correct=3` were credited on the student's own QUESTIONS, which the tutor
 * answered "Good question"; in another session "i do not know fractions
 * operations well" → "Good to know, thank you for telling me." was credited
 * `correct=1` and marked the segment demonstrated. The opener pattern matched
 * the word "Good" and never looked at what it was praising.
 *
 * An affirmation word followed by a noun for the student's MOVE (question,
 * point, idea, thinking, catch, call, instinct, try, guess…) or by "to know"
 * acknowledges the move; it says nothing about whether an answer is right.
 *
 * Pure; never throws.
 */

const AFFIRM_WORDS =
  "exactly|that'?s right|that is right|correct|perfect|nice work|nice job|nice|good job|good|great|right|yes|yep|yeah|spot[\\s-]?on|absolutely|you got it|you'?ve got it|you have got it|you'?re right|bingo";

/** Sentence-initial affirmation word. Byte-identical to the pattern that
 *  lived in pacing-verdict.ts before this module existed. */
export const AFFIRM_OPENER_RE = new RegExp(`^[*_~\`\\s]*(${AFFIRM_WORDS})\\b`, 'i');

/** What an acknowledgement praises: the student's move, not their answer. */
const ACK_OBJECTS =
  'questions?|points?|to\\s+know|ideas?|thinking|thoughts?|catch|call|instincts?|try|attempt|effort|guess|observation|eye';

/** "<praise word> <move noun>" at the start of a sentence, plus the thanks
 *  forms that carry no praise word at all. */
export const ACK_OPENER_RE = new RegExp(
  `^[*_~\`\\s]*(?:(?:(?:that'?s|that\\s+is|what)\\s+an?\\s+|a\\s+|very\\s+|really\\s+)?(?:good|great|nice|fair|excellent|interesting|smart|sharp)\\s+(?:${ACK_OBJECTS})\\b` +
  `|(?:thanks|thank\\s+you)\\s+for\\s+(?:telling|letting|sharing|asking|saying)\\b)`,
  'i',
);

export type OpenerRead = 'affirm' | 'ack' | 'none';

/**
 * 2026-10-04 (review of the first cut). An acknowledgement noun after the
 * praise word made the WHOLE sentence an acknowledgement, even when the same
 * sentence went on to affirm the answer: "Good catch, that IS the answer.",
 * "Good guess — and it's correct!", "Good eye! 5 is right." all lost their
 * credit. What follows the acknowledgement is read for an explicit
 * affirmation of the answer; only when there is none is it an acknowledgement.
 */
/** "right" / "correct" as a verdict, not "right there", "correct to flip…". */
const VERDICT_WORD =
  '(?:right|correct)(?!\\s+(?:there|here|now|away|after|before|next|on|at|by|above|below|behind|in|side|angle|triangle|hand|to|that|for|way|answer|one|about)\\b)';
const AFFIRM_PHRASE_RE = new RegExp(
  '\\b(?:yes|yep|yeah|exactly(?=\\s*(?:[.,!—–]|$))|you\\s+got\\s+it' +
    `|you'?re\\s+(?:exactly\\s+|absolutely\\s+)?${VERDICT_WORD}` +
    `|(?:that|it)(?:'?s|\\s+is)\\s+(?:exactly\\s+|absolutely\\s+|totally\\s+)?(?:${VERDICT_WORD}|it\\b(?=\\s*(?:[.,!—–]|$))|the\\s+(?:right\\s+|correct\\s+)?answer)` +
    `|is\\s+(?:exactly\\s+|absolutely\\s+|totally\\s+)?(?:${VERDICT_WORD}|the\\s+(?:right\\s+|correct\\s+)?answer)` +
  ')\\b',
  'i',
);
/** Anything that turns the phrase round: a negation, a hedge, a condition, a
 *  question. "right there / right on the board" is a place, not a verdict. */
const AFFIRM_PHRASE_BLOCK_RE = /\b(?:not|never|but|almost|however|though|if|whether|unless|only|when|wrong|incorrect)\b|n['’]t\b|\?/i;

function normValue(text: string): string {
  return (text || '').toLowerCase().replace(/[*_~`$\s]/g, '').replace(/−/g, '-').replace(/^[.,!;:—–-]+|[.,!;:]+$/g, '');
}

/**
 * Does the text that FOLLOWS an acknowledgement (the rest of its sentence, or
 * the next sentence) affirm the answer?
 * @param studentValue  the student's answer; when the text is nothing but
 *   that value restated ("Great call. 5."), that is an affirmation too.
 */
export function affirmsAfterAck(text: string, studentValue?: string | null): boolean {
  const t = (text || '').replace(/[*_~`$]/g, '').trim();
  if (!t) return false;
  if (AFFIRM_PHRASE_BLOCK_RE.test(t)) return false;
  if (AFFIRM_PHRASE_RE.test(t)) return true;
  const v = normValue(studentValue ?? '');
  return v.length > 0 && normValue(t) === v;
}

export interface OpenerContext {
  /** The student's answer, for "Great call. 5." (the value restated). */
  studentValue?: string | null;
  /** The PREVIOUS sentence opened with an acknowledgement: this sentence
   *  affirms when it carries an affirmation phrase anywhere, not only as its
   *  first word ("Good eye! Five is right."). */
  afterAck?: boolean;
}

/**
 * Read ONE sentence's opening.
 * @param ackExclusion  false ⇒ acknowledgement phrases are read as before
 *   (any affirmation word counts). The orchestrator passes its kill switch.
 */
export function readOpener(sentence: string, ackExclusion = true, ctx?: OpenerContext): OpenerRead {
  const s = sentence || '';
  if (ackExclusion) {
    const ack = ACK_OPENER_RE.exec(s);
    if (ack) {
      // The rest of the sentence, after the comma / dash / exclamation mark.
      return affirmsAfterAck(s.slice(ack[0].length), ctx?.studentValue) ? 'affirm' : 'ack';
    }
  }
  if (AFFIRM_OPENER_RE.test(s)) return 'affirm';
  if (ackExclusion && ctx?.afterAck && affirmsAfterAck(s, ctx.studentValue)) return 'affirm';
  return 'none';
}
