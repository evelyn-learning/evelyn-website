/**
 * Deterministic detector for a card/narration numeric mismatch (E2, prod
 * session 2026-08-06/07): the brain called `show_segment_card` for a
 * worked-example segment, the orchestrator resolved the AUTHORED card text
 * onto the whiteboard ("A car travels 240 miles in 4 hours. Find the rate
 * of change"), but the brain's SPOKEN narration described a completely
 * different, improvised problem in the same turn — verbatim, per the
 * session log: "Here's a real-world one — a taxi ride costs a flat five
 * dollars, plus one fifty for every kilometer." — then scolded the student
 * for answering the card that was actually on the board. The judge LLM
 * flagged the mismatch but only as advisory (judge kills only on severity
 * 'kill'), and the existing structural guards (the show_worked_example /
 * show_problem divergence checks in VoiceTutorRealtime.tsx) compare the
 * brain's TOOL PAYLOAD against the authored text — they never look at
 * what the brain actually SAID. This module closes that gap by comparing
 * the authored card against the turn's spoken text instead.
 *
 * REVIEW FIX (2026-08-08): the first cut of this module extracted digits
 * only, so it silently passed the exact incident it was built for — the
 * live narration above has ZERO digits. Worse, Rule 3b (system-prompt-
 * builder.ts) pushes narration AWAY from digit+$ notation toward prose, so
 * spelled-out numbers are the LIKELY spoken form, not the exception. This
 * module now also extracts cardinal number words (zero–ninety-nine,
 * hundred/thousand compounds) via extractWordNumbers below, applied
 * symmetrically to both the card and the spoken text.
 *
 * Digit extraction mirrors the show_worked_example numeric-set check's
 * approach (VoiceTutorRealtime.tsx, `numRe = /-?\d+(?:\.\d+)?/g` numeric-
 * set comparison) — reused here as NUMBER_RE, UNCHANGED — but the LEFT
 * side is the spoken turn text, not a tool argument.
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
 *     new numbers (an intermediate result, a follow-up value, etc.). This
 *     also covers word-number AMBIGUITY: "one fifty" yields two candidate
 *     readings (1.5 and 150) — if EITHER matches a card number, the whole
 *     phrase counts as a card-number match (favors passing when
 *     ambiguous), never a forced pick of one reading.
 *   - Only when the speech has >=2 numbers, ALL of which are absent from
 *     the card, do we conclude the brain is narrating a genuinely
 *     DIFFERENT problem → REJECT.
 *
 * Pure module — no imports, no side effects. Never throws.
 */

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;

const ONES_OR_TEENS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90,
};

function isNumberWord(tok: string): boolean {
  return tok in ONES_OR_TEENS || tok in TENS || tok === 'hundred' || tok === 'thousand';
}

/**
 * Groups a token stream into contiguous runs of number-words (allowing
 * "and" as a mid-run connector, e.g. "two hundred and forty"). Non-number
 * tokens ("miles", "dollars", "for") end a run, same as punctuation would.
 */
function groupNumberWordChunks(tokens: string[]): string[][] {
  const chunks: string[][] = [];
  let current: string[] = [];
  for (const tok of tokens) {
    if (isNumberWord(tok) || (tok === 'and' && current.length > 0)) {
      current.push(tok);
    } else {
      if (current.some(isNumberWord)) chunks.push(current);
      current = [];
    }
  }
  if (current.some(isNumberWord)) chunks.push(current);
  return chunks;
}

/**
 * Resolves one contiguous number-word chunk into one or more candidate
 * numeric values.
 *
 * Two-token chunks of the shape "<ones/teens> <tens>" ("one fifty",
 * "twelve fifty") are a genuine idiom-level ambiguity in spoken English —
 * they could mean a currency shorthand ($1.50) or a concatenated reading
 * (150) — so BOTH candidates are returned; the caller's set-membership
 * check treats a match against either as a card-number match.
 *
 * A solo "one" ("a good ONE", "which ONE", "a real-world ONE") is
 * suppressed entirely: in isolation it is far more often the indefinite
 * pronoun than the numeral, and this check only needs to catch clear
 * multi-number problem statements, not single stray words. "one" still
 * participates fully in multi-token chunks ("one fifty", "one hundred").
 */
function resolveChunkCandidates(rawChunk: string[]): number[] {
  const toks = rawChunk.filter((t) => t !== 'and');
  if (toks.length === 0) return [];
  if (toks.length === 1 && toks[0] === 'one') return [];
  if (toks.length === 2 && toks[0] in ONES_OR_TEENS && toks[1] in TENS) {
    const a = ONES_OR_TEENS[toks[0]];
    const b = TENS[toks[1]];
    return [a + b / 100, a * 100 + b];
  }
  let total = 0;
  let current = 0;
  for (const tok of toks) {
    if (tok in ONES_OR_TEENS) {
      current += ONES_OR_TEENS[tok];
    } else if (tok in TENS) {
      current += TENS[tok];
    } else if (tok === 'hundred') {
      current = (current || 1) * 100;
    } else if (tok === 'thousand') {
      total += (current || 1) * 1000;
      current = 0;
    }
  }
  return [total + current];
}

/** Extracts spelled-out cardinal numbers from prose as string values. */
function extractWordNumbers(text: string): string[] {
  const tokens = text.toLowerCase().split(/[^a-z']+/).filter(Boolean);
  const values: string[] = [];
  for (const chunk of groupNumberWordChunks(tokens)) {
    for (const v of resolveChunkCandidates(chunk)) {
      values.push(String(v));
    }
  }
  return values;
}

/** Digit matches (unchanged) unioned with word-number matches (new). */
function extractAllNumbers(text: string): Set<string> {
  const digitMatches = text.match(NUMBER_RE) || [];
  const wordMatches = extractWordNumbers(text);
  return new Set([...digitMatches, ...wordMatches]);
}

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
  const cardNums = extractAllNumbers(cardText);
  if (cardNums.size === 0) {
    // Nothing numeric on the card to ground the comparison — skip.
    return { reject: false };
  }
  const spokenNums = extractAllNumbers(spokenText);
  if (spokenNums.size < 2) {
    // Short transition / bare verdict — not enough signal to call this a
    // competing problem statement.
    return { reject: false };
  }
  const hasCardNum = [...spokenNums].some((n) => cardNums.has(n));
  if (hasCardNum) {
    // Paraphrase of the card, or a computed step referencing it — includes
    // the case where an ambiguous word-number's OTHER reading matched.
    return { reject: false };
  }
  const newNums = [...spokenNums].filter((n) => !cardNums.has(n));
  if (newNums.length >= 2) {
    return { reject: true, cardNums: [...cardNums], newNums };
  }
  return { reject: false };
}
