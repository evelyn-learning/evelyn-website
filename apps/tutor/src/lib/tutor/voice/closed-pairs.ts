/**
 * Contradicting restatement over closed answer pairs.
 *
 * 2026-10-04 (live, student gac-test-001). The student's second "below the
 * line." was answered "Above the line. Look at (0, 5)…" — a correction with no
 * correction word in it. The ledger and the pacing streak read tutor text for
 * "not quite / that's not / incorrect", found none, and the wrong answer was
 * never recorded.
 *
 * When the answer space is a closed pair, stating the OTHER member is the
 * correction. This module detects exactly that and nothing looser: a short
 * student answer naming one member, and a tutor first sentence that is
 * essentially JUST the opposite member.
 *
 * Review of the first cut (same day): "a short first sentence that contains
 * the opposite word" also described the tutor simply moving on, and each of
 * these marked a (possibly correct) answer wrong:
 *     "minimum"  → "Let's find the maximum next."
 *     "positive" → "Now try a negative number."
 *     "more"     → "Fewer steps than I expected — nice!"
 *     "open"     → "Case closed!"
 * A bare restatement is now: at most FOUR words; the opposite member leading
 * it (after "No —", "Actually,", "It's", an article, "to the"); no
 * transition or instruction word (now, next, let's, try, another, find,
 * test, look, case…); not an idiom. Anything longer is prose, and prose is
 * not a correction by this rule.
 *
 * It only ever feeds COUNTING (ledger `wrong`, pacing `incorrect`); nothing
 * is killed or re-asked on its say-so.
 *
 * Pure; never throws.
 */

/** Each entry: [aliases of one member, aliases of the other]. Data, so a new
 *  pair is one line. Aliases are single lowercase words. */
export const CLOSED_PAIRS: ReadonlyArray<readonly [readonly string[], readonly string[]]> = [
  [['above'], ['below']],
  [['left'], ['right']],
  [['solid'], ['dashed', 'dotted']],
  [['open'], ['closed']],
  [['greater', 'bigger', 'larger'], ['less', 'smaller']],
  [['positive'], ['negative']],
  [['increasing'], ['decreasing']],
  [['yes'], ['no']],
  [['true'], ['false']],
  [['maximum', 'max'], ['minimum', 'min']],
  [['more'], ['fewer']],
  [['inside'], ['outside']],
];

/** The student's answer may carry a little framing ("below the line"). */
const STUDENT_MAX_WORDS = 4;
/** A bare restatement: "Above the line.", "Dashed.", "It's solid, actually.",
 *  "No — decreasing.". */
const TUTOR_FIRST_SENTENCE_MAX_WORDS = 4;

/** The tutor is moving on or giving an instruction, not restating. */
const TRANSITION_WORDS = new Set([
  'now', 'next', 'lets', 'let', 'try', 'another', 'find', 'test', 'look', 'case', 'then', 'so', 'first', 'second',
  'consider', 'suppose', 'imagine', 'pick', 'choose', 'take', 'check', 'draw', 'plot', 'shade', 'move', 'go', 'what', 'which', 'how',
]);
/** Fixed phrases that happen to contain a pair word. */
const IDIOM_RE = /\b(?:case\s+closed|more\s+or\s+less|no\s+less|nothing\s+less|more\s+like\s+it|right\s+away|right\s+now|false\s+alarm|true\s+enough|no\s+way|yes\s+and\s+no|open\s+question|closed\s+book|left\s+over)\b/;

/** Words that may stand in front of the opposite member without making the
 *  sentence anything more than a restatement, in the order they may appear:
 *  "No —" / "Actually," · "It's" / "That's" · "a" / "the" / "to the". */
const LEAD_STAGES: ReadonlyArray<ReadonlyArray<readonly string[]>> = [
  [['no'], ['nope'], ['actually'], ['hmm'], ['well']],
  [['its'], ['it', 'is'], ['thats'], ['that', 'is'], ['it']],
  [['actually']],
  [['to', 'the'], ['on', 'the'], ['a'], ['an'], ['the']],
];

/** How many leading words are only framing. */
function leadLength(tWords: string[]): number {
  let at = 0;
  for (const stage of LEAD_STAGES) {
    for (const seq of stage) {
      if (seq.every((w, k) => tWords[at + k] === w)) { at += seq.length; break; }
    }
  }
  return at;
}

/** "right" is also the commonest affirmation. It counts as the DIRECTION only
 *  with direction grammar on one side of it. */
const RIGHT_BEFORE = new Set(['the', 'to', 'its', 'go', 'goes', 'going', 'move', 'moves', 'moved', 'shift', 'shifts', 'shifted', 'far', 'facing', 'toward', 'towards', 'turn', 'turns', 'points', 'opens', 'units']);
const RIGHT_AFTER = new Set(['side', 'of', 'hand', 'half', 'end', 'branch', 'tail', 'direction']);

/** "more" as an ordinary quantifier, not the answer "more". */
const MORE_BEFORE = new Set(['one', 'once', 'bit', 'little', 'some', 'any', 'few', 'two', 'no', 'much', 'even', 'lot']);
const MORE_AFTER = new Set(['thing', 'things', 'time', 'step', 'steps', 'question', 'questions', 'example', 'examples', 'problem', 'problems', 'one', 'practice', 'try', 'like', 'about', 'on', 'to']);

/** Reassurance that opens with "No". */
const NO_REASSURANCE_RE = /\bno\s+(?:worries|problem|rush|need|pressure|big\s+deal|trouble|stress)\b/i;

const NEGATORS = new Set(['not', 'never', 'isnt', 'arent', 'doesnt', 'wasnt', 'wont', 'cant', 'neither', 'nor']);

function words(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function firstSentence(text: string): string {
  const cleaned = (text || '').replace(/[*_~`$]/g, '').trim();
  const m = /^[\s\S]*?[.!?…](?=\s|$)/.exec(cleaned);
  return (m ? m[0] : cleaned).trim();
}

export interface ContradictingRestatement {
  /** The pair member (alias as spoken) the student said. */
  student: string;
  /** The opposite member the tutor's first sentence states. */
  tutor: string;
}

/**
 * Does the tutor's first sentence state the opposite member of a closed pair
 * to the student's short answer?
 */
export function detectContradictingRestatement(studentText: string, tutorText: string): ContradictingRestatement | null {
  const sWords = words(studentText);
  if (sWords.length === 0 || sWords.length > STUDENT_MAX_WORDS) return null;

  const first = firstSentence(tutorText);
  if (!first || /\?\s*$/.test(first)) return null;
  const tWords = words(first);
  if (tWords.length === 0 || tWords.length > TUTOR_FIRST_SENTENCE_MAX_WORDS) return null;
  if (tWords.some((w) => TRANSITION_WORDS.has(w))) return null;
  if (IDIOM_RE.test(tWords.join(' '))) return null;
  const lead = leadLength(tWords);

  for (const [a, b] of CLOSED_PAIRS) {
    for (const [own, other] of [[a, b], [b, a]] as const) {
      const said = sWords.find((w) => own.includes(w));
      if (!said) continue;
      // The student named both members ("above or below"): no single answer.
      if (sWords.some((w) => other.includes(w))) continue;
      // The tutor repeats the student's member: agreement or a contrast that
      // includes it, never a bare contradiction.
      if (tWords.some((w) => own.includes(w))) continue;

      const idx = tWords.findIndex((w) => other.includes(w));
      if (idx < 0) continue;
      // The opposite member must LEAD the sentence (after framing only).
      if (idx !== lead && !(idx === 0 && (tWords[0] === 'yes' || tWords[0] === 'no'))) continue;
      const opp = tWords[idx];
      const prev = tWords[idx - 1] ?? '';
      const next = tWords[idx + 1] ?? '';
      // Negated opposite ("it's not above") agrees with the student.
      if (NEGATORS.has(prev) || NEGATORS.has(tWords[idx - 2] ?? '')) continue;

      if (opp === 'right' && !RIGHT_BEFORE.has(prev) && !RIGHT_AFTER.has(next)) continue;
      if (opp === 'more' && (MORE_BEFORE.has(prev) || MORE_AFTER.has(next))) continue;
      if (opp === 'yes' || opp === 'no') {
        // Only as the standalone opening word: "No. …" / "Yes, it does."
        if (idx !== 0) continue;
        if (!/^(?:yes|no)\s*(?:[.,!;:—–-]|$)/i.test(first)) continue;
        if (NO_REASSURANCE_RE.test(first)) continue;
      }
      return { student: said, tutor: opp };
    }
  }
  return null;
}
