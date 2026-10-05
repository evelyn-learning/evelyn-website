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

// Affirmation openers, WITHOUT the disqualifier lookahead (applied separately
// so it can span the whole head while the opener is matched per sentence),
// live in affirm-opener.ts since 2026-10-04 — together with the
// acknowledgement phrases ("Good question", "Good to know") that are NOT
// affirmations of an answer.
import { readOpener } from '@/lib/tutor/voice/affirm-opener';
import { detectContradictingRestatement } from '@/lib/tutor/voice/closed-pairs';
import { detectPraiseThenExclusion, isReadmitted } from '@/lib/tutor/voice/praise-exclusion';
import { DENIAL_RE } from '@/lib/tutor/voice/simplification-verdict-check';
import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';
import { TUTOR_ACK_NOT_AFFIRM, TUTOR_CORRECTION_WIDENING } from '@/lib/tutor/orchestrator/turn-round-flags';

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

/**
 * 2026-10-04 (live, student gac-test-001) — corrections that carry none of
 * the markers above. "Let's try that again… doesn't satisfy…" and "Right. 5
 * isn't included…" were both invisible, so wrong answers were neither counted
 * in the incorrect streak nor recorded in the struggle ledger.
 *
 * These are ordinary English far more often than "not quite" is, and R53's
 * lesson is that a whole-turn scan for ordinary English marks correct answers
 * wrong. So they are read ONLY in the head of the turn (the same sentence
 * window the affirmation is read in) and ONLY when the turn does not open
 * with a clean affirmation.
 *
 * Review of the first cut (same day): it still counted CORRECT answers wrong.
 *   "x = 4"   → "That works. Notice 3 doesn't work because of the strict sign."
 *   "4 and 6" → "Both work. 5 doesn't work, as you saw."
 *   "7"       → "7 is correct. It doesn't fit the first, but it fits the second."
 *   "6"       → "Let's try this again with a new inequality — you nailed that one."
 * The value predicate was scoped to the student's value only when the student
 * utterance was a BARE value, and any predicate with no number before it
 * counted. The rule now — a head predicate is a correction only when:
 *   - its grammatical SUBJECT is one of the student's values (every number in
 *     the student's text: "x = 4", "I think 7", "4 and 6", "seven"), or a
 *     pronoun for the answer ("that", "it"); a predicate about another value,
 *     or with no readable subject, is skipped;
 *   - nothing before it in the head affirms ("7 is correct. It doesn't…");
 *   - it is not about one PART ("doesn't fit the first…");
 *   - the value is not re-admitted after it ("…but it satisfies x > 5").
 * And "try this again WITH A NEW / another / different / harder …" starts a
 * fresh problem; it is not a retry of this answer.
 *
 * Second review pass (same day): CORRECT answers were still counted wrong.
 *   "x > 3"  → "So 3 isn't included, and everything above it is."     (echo)
 *   "3 fails"→ "That doesn't work — you found the extraneous one!"    (echo)
 *   "3"      → "3 doesn't work, good — that's the one we exclude."    (praise after)
 *   "7"      → "7 doesn't satisfy x < 3. It does satisfy x > 5, …"    (part by part, no "but")
 *   "5"      → "5. Let's try that again with a bigger number."        (retry continues)
 * So, in addition, a head predicate is skipped when
 *   - the STUDENT's own text carries a negation or a relation (the tutor's
 *     negative is then an echo of their conclusion, not a denial of it);
 *   - the rest of that sentence, or the next one, affirms;
 *   - the value is re-admitted with no conjunction (isReadmittedPlainly);
 * and a retry phrase counts only when it ENDS its clause — any continuation
 * ("…again with / but with / on / so / using …") is not read as a denial.
 */
const HEAD_RETRY_RE =
  /\b(?:let'?s\s+(?:try|do|take)\s+(?:that|this|it)(?:\s+one)?\s+again|try\s+(?:that\s+|this\s+|it\s+)?(?:again|once\s+more)|give\s+(?:that|this|it)\s+another\s+(?:try|shot|go|look)|that'?s\s+not\s+it|that\s+is\s+not\s+it)\b/gi;
/** The retry phrase ENDS its clause: followed by . ! ? … or a dash, or by
 *  nothing. Anything else continues it ("…again with a bigger number", "…again,
 *  but with 7", "…again on the board so you can see why") and it is not read. */
const RETRY_CLAUSE_END_RE = /^["')\]]*\s*(?:[.!?…—–]|-(?:\s|-)|$)/;
/** The student's own text carries a negation or a relation: a negative
 *  predicate from the tutor may simply be agreeing with it. */
const STUDENT_NEGATION_OR_RELATION_RE =
  /\b(?:not|no|nope|never|none|neither|nor|fails?|failed|failing|greater|less|more\s+than|fewer|between|excluded?|except|outside|cannot|(?:do|does|is|are|was|did|wo|ca)nt)\b|n't\b|[<>≤≥≠]/i;
/** Verdict language that AFFIRMS, AFTER the predicate (the rest of its
 *  sentence, or the next sentence). Acknowledgements ("good try"), a negated
 *  form ("not right") and a question ("is that right?") are not affirmations. */
const HEAD_LATER_AFFIRM_RE =
  /(?<!\bnot\s)(?<!n't\s)(?<!\bnever\s)\b(?:(?:good|nice|great)(?!\s+(?:try|effort|attempt|guess|question|thinking|thought|idea|start|go|shot|point|to\s+know)\b)|well\s+done|well\s+spotted|exactly|nicely|correct(?!\s*\?)|right(?!\s*\?|\s+(?:on|at|there|here|next|by|side|one|hand|away|now|angle|triangle|part|half|inequality|equation|ray|end|endpoint|branch|piece|of)\b)|you\s+found|you\s+said|as\s+you\b)/i;
const HEAD_VALUE_PREDICATE_RE =
  /\b(?:(?:doesn'?t|does\s+not)\s+(?:quite\s+|actually\s+|really\s+)?(?:satisfy|work|fit)|(?:isn'?t|is\s+not)\s+(?:quite\s+|actually\s+|really\s+)?(?:included|a\s+solution|correct|right))\b/gi;
/** A value token: signed number, decimal, fraction. */
const VALUE_TOKEN = '-?\\d+(?:[./]\\d+)?';
/** The predicate's subject, read off the END of the text before it: a value,
 *  or a pronoun for the answer. */
const HEAD_SUBJECT_RE = new RegExp(
  `(?:(?<![\\w.])(${VALUE_TOKEN})|\\b(that\\s+one|that|it|your\\s+answer))\\s*(?:(?:itself|alone|actually|just|still|really|also)\\s+)*$`,
  'i',
);
/** Verdict language that AFFIRMS, before the predicate in the head. */
const HEAD_PRIOR_AFFIRM_RE =
  /\b(?:is|are|was|'s)\s+(?:exactly\s+|absolutely\s+)?(?:correct|right(?!\s+(?:on|at|there|here|next|by)\b)|in\b|a\s+solution|included)|\b(?:that|it|this|both|they|\d)\s+works?\b|\bexactly\b|\bnailed\b|\byou(?:'ve|\s+have)?\s+got\s+it\b/i;
/** The predicate is about one part of the problem. */
const HEAD_PART_SCOPE_RE = /\b(?:first|second|third|other|both|one|left|right|part|piece|half|branch|side)\b/i;
const HEAD_CLAUSE_BREAK_RE = /[,;:.!?—–…]|\s-\s|\b(?:since|because|as|so|but|though|and)\b/i;

function cleanHead(raw: string): string {
  return spokenNumbersToDigits((raw || '').replace(/[*_`$]/g, '').replace(/[’‘]/g, "'")).replace(/−/g, '-');
}

/** Every number in the student's text ("x = 4" → 4; "4 and 6" → 4, 6;
 *  "I think seven" → 7). */
export function studentValues(studentText: string | undefined): string[] {
  const t = cleanHead(studentText ?? '');
  return t.match(new RegExp(`(?<![\\w.])${VALUE_TOKEN}`, 'g')) ?? [];
}

/** "That works." / "Both work." / "<their value> is correct | is right |
 *  works | is in" opening the turn: an affirmation with no affirmation word. */
const VALUE_AFFIRM_RE = new RegExp(
  `^\\s*(?:(?:so|and|ok(?:ay)?|yep|yeah)[,\\s]+)?(?:(that|both|those)|(${VALUE_TOKEN}))\\s+` +
    `(?:works?|(?:is|are)\\s+(?:correct|right|in|a\\s+solution|included|solutions))` +
    `(?=\\s*(?:[.,!;:—–]|$)|\\s+(?:too|as\\s+well|here|since|because)\\b)`,
  'i',
);
function readValueAffirm(sentence: string, values: string[]): boolean {
  const m = VALUE_AFFIRM_RE.exec(cleanHead(sentence));
  if (!m) return false;
  return m[1] ? true : values.includes(m[2]);
}

/** Does the head carry one of the widened corrections?
 *  @param all  every sentence of the head (for the sentence after the
 *    predicate, where a re-admission lands). */
function readHeadCorrection(headSentences: string[], all: string[], studentText: string | undefined, ackExclusion = true): boolean {
  const values = studentValues(studentText);
  // The tutor's negative may be an echo of the student's own conclusion
  // ("x > 3" → "So 3 isn't included…"): no head predicate is read at all.
  const studentConcludesNegatively = STUDENT_NEGATION_OR_RELATION_RE.test(cleanHead(studentText ?? ''));
  let prior = '';
  let priorAffirmed = false;
  for (let i = 0; i < headSentences.length; i++) {
    const s = cleanHead(headSentences[i]);
    for (const m of s.matchAll(HEAD_RETRY_RE)) {
      if (RETRY_CLAUSE_END_RE.test(s.slice((m.index ?? 0) + m[0].length))) return true;
    }
    const sentenceAffirms = readOpener(s, ackExclusion) === 'affirm' || readValueAffirm(s, values);
    for (const m of s.matchAll(HEAD_VALUE_PREDICATE_RE)) {
      if (studentConcludesNegatively) break;
      const at = m.index ?? 0;
      const before = s.slice(0, at);
      const after = s.slice(at + m[0].length);
      const subject = HEAD_SUBJECT_RE.exec(before);
      // No readable subject ("the point doesn't satisfy…"): not ours to call.
      if (!subject) continue;
      const subjectValue = subject[1] ?? null;
      // About a value the student did not give.
      if (subjectValue !== null && !values.includes(subjectValue)) continue;
      // Something earlier in the head already affirmed.
      if (priorAffirmed || sentenceAffirms || HEAD_PRIOR_AFFIRM_RE.test(`${prior} ${before}`)) continue;
      // "It doesn't work that way" is about the method, not the answer.
      if (/^\s+(?:that|this)\s+way\b|^\s+like\s+(?:that|this)\b/i.test(after)) continue;
      // About one part of the problem.
      if (HEAD_PART_SCOPE_RE.test(after.split(HEAD_CLAUSE_BREAK_RE)[0] ?? '')) continue;
      // Re-admitted afterwards ("…but it satisfies x > 5, so it's a solution").
      const rest = `${after} ${cleanHead(all[i + 1] ?? '')}`;
      if (/\bbut\s+(?:it|that)\b/i.test(rest) || isReadmitted(rest, subjectValue)) continue;
      // Praise AFTER the predicate ("3 doesn't work, good — that's the one we
      // exclude.", "…— exactly the boundary we wanted.").
      if (HEAD_LATER_AFFIRM_RE.test(rest)) continue;
      return true;
    }
    prior += ` ${s}`;
    if (sentenceAffirms) priorAffirmed = true;
  }
  return false;
}

/** Split on sentence ends. Terminator + optional space + capital, so a
 *  decimal ("10.5") is never treated as a boundary — digits are not
 *  capitals. `\s*` because real turns run sentences together with no space. */
function sentences(text: string): string[] {
  return (text || '').split(/(?<=[.!?])\s*(?=[A-Z"'“])/).filter((s) => s.trim().length > 0);
}

/**
 * Is this flagged CLAIM (a quote of the tutor's turn) a denial of the
 * student's answer? The judge decision (judge-issue-decision.ts) and the
 * pacing read share this one predicate: an opening denial word (DENIAL_RE),
 * or one of the head corrections above — a retry phrase, or "that / it
 * doesn't work | isn't right …". With no student text in hand, a predicate
 * whose subject is a NUMBER is not read as a denial.
 */
export function isDenialClaim(claim: string): boolean {
  const c = claim || '';
  if (DENIAL_RE.test(c)) return true;
  const all = sentences(c.slice(0, 200));
  return readHeadCorrection(all.slice(0, AFFIRM_SENTENCE_WINDOW), all, undefined);
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
  /** A head sentence opened with an acknowledgement ("Good question", "Good
   *  to know") that was NOT counted as an affirmation. */
  ackOpener: boolean;
  /** What made `isCorrection` true: the original markers, or one of the
   *  2026-10-04 widenings. null when not a correction. */
  correctionSource: 'marker' | 'head' | 'restatement' | null;
  /** The opener affirmed, and the same or the next sentence excludes the
   *  student's OWN bare value. Credited neither correct nor incorrect. */
  ownValueExcluded: boolean;
}

export interface PacingVerdictOptions {
  /** The student utterance this turn responds to. Enables the contradicting-
   *  restatement read and scopes value predicates to the student's value. */
  studentText?: string;
  /** false ⇒ acknowledgement phrases count as affirmations, as before.
   *  Unset ⇒ TUTOR_ACK_NOT_AFFIRM. */
  ackExclusion?: boolean;
  /** false ⇒ only the original correction markers. Unset ⇒
   *  TUTOR_CORRECTION_WIDENING. */
  widenedCorrection?: boolean;
}

/**
 * Read the tutor's turn for an affirmation and/or a correction.
 * Pure, total, never throws.
 */
export function readPacingVerdict(fullText: string, opts?: PacingVerdictOptions): PacingVerdictRead {
  const text = fullText || '';
  const head = text.slice(0, 200);
  const all = sentences(head);
  const parts = all.slice(0, AFFIRM_SENTENCE_WINDOW);
  // Unset ⇒ the kill switch decides, so a caller that passes no options
  // (qpin-behavior.ts) is switched off by the same flag as the orchestrator.
  const ackExclusion = opts?.ackExclusion ?? TUTOR_ACK_NOT_AFFIRM;
  const widened = opts?.widenedCorrection ?? TUTOR_CORRECTION_WIDENING;
  let affirmSentence = -1;
  let ackOpener = false;
  // An acknowledgement that goes on to affirm ("Good catch, that IS the
  // answer.", "Good eye! Five is right.") is an affirmation.
  let afterAck = false;
  for (let i = 0; i < parts.length; i++) {
    const opener = readOpener(parts[i], ackExclusion, { studentValue: opts?.studentText, afterAck });
    if (opener === 'ack') { ackOpener = true; afterAck = true; continue; }
    if (opener === 'affirm') { affirmSentence = i; break; }
    afterAck = false;
  }
  // "That works." / "Both work." / "7 is correct." opening the turn.
  if (affirmSentence < 0 && widened && parts.length > 0 && readValueAffirm(parts[0], studentValues(opts?.studentText))) {
    affirmSentence = 0;
  }
  // Weak markers only count inside the affirming sentence; strong ones also
  // count in the sentence after it, where a reversal would land.
  const affirmText = affirmSentence >= 0 ? parts[affirmSentence] : '';
  const nextText = affirmSentence >= 0 ? (parts[affirmSentence + 1] ?? '') : '';
  const disqualified =
    WEAK_DISQUALIFIER_RE.test(affirmText) ||
    STRONG_DISQUALIFIER_RE.test(`${affirmText} ${nextText}`);
  let isAffirm = affirmSentence >= 0 && !disqualified;
  const marker = CORRECTION_RE.test(text) || ALMOST_VERDICT_RE.test(text);
  let correctionSource: PacingVerdictRead['correctionSource'] = marker ? 'marker' : null;
  let ownValueExcluded = false;
  if (widened) {
    // Praise, then the student's own bare value excluded: not a clean
    // "correct" — and not an "incorrect" either. The read cannot tell which
    // half is the mistake ("What is the boundary?" → "5" → "Right. 5 isn't
    // included…" is a CORRECT answer), so it credits neither way.
    const exclusion = affirmSentence === 0 && opts?.studentText
      ? detectPraiseThenExclusion(text, opts.studentText, ackExclusion)
      : null;
    // A part-scoped exclusion ("5 doesn't satisfy x < 3") says nothing about
    // the answer as a whole.
    if (exclusion && !exclusion.partScoped) {
      ownValueExcluded = true;
      isAffirm = false;
    }
    // The widened readings never reverse a CLEAN affirmation.
    if (!marker && !isAffirm) {
      if (readHeadCorrection(parts, all, opts?.studentText, ackExclusion)) correctionSource = 'head';
      else if (affirmSentence !== 0 && opts?.studentText
          && detectContradictingRestatement(opts.studentText, text)) correctionSource = 'restatement';
    }
  }
  return {
    isAffirm,
    isCorrection: correctionSource !== null,
    affirmSentence,
    ackOpener,
    correctionSource,
    ownValueExcluded,
  };
}
