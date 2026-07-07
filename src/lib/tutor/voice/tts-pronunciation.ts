/**
 * TTS pronunciation rewrites.
 *
 * Single source of truth for "expand abbreviations and notation into
 * what the TTS engine should actually say." Applied to ALL TTS paths
 * (Realtime out-of-band, openai-mini, future Cartesia, etc.) so we
 * never have to maintain rewrites in two places again.
 *
 * Rules to add: only universal abbreviations / symbols where the TTS
 * model's default pronunciation is wrong. Avoid case-specific phrasing
 * (it bloats the file the same way prompt examples bloat the prompt).
 */

interface Replacement {
  pattern: RegExp;
  replacement: string;
}

/** Trigonometric function names. The TTS pronounces "sin" as the
 *  3-letter English word ("sin"), "cos" as one syllable ("kose"),
 *  etc. Expand to the spoken function name. Word-boundary regex so
 *  these don't catch matches inside other words ("sing", "tank"). */
const TRIG_REPLACEMENTS: Replacement[] = [
  { pattern: /\barcsin\b/gi, replacement: 'arc sine' },
  { pattern: /\barccos\b/gi, replacement: 'arc cosine' },
  { pattern: /\barctan\b/gi, replacement: 'arc tangent' },
  { pattern: /\barccot\b/gi, replacement: 'arc cotangent' },
  { pattern: /\barcsec\b/gi, replacement: 'arc secant' },
  { pattern: /\barccsc\b/gi, replacement: 'arc cosecant' },
  { pattern: /\bsin\b/gi, replacement: 'sine' },
  { pattern: /\bcos\b/gi, replacement: 'cosine' },
  { pattern: /\btan\b/gi, replacement: 'tangent' },
  { pattern: /\bsec\b/gi, replacement: 'secant' },
  { pattern: /\bcsc\b/gi, replacement: 'cosecant' },
  { pattern: /\bcot\b/gi, replacement: 'cotangent' },
];

/** Logarithm / exponent shortcuts the TTS often gets wrong. */
const MATH_FUNC_REPLACEMENTS: Replacement[] = [
  { pattern: /\bln\b/g, replacement: 'natural log' },
  // 'log' is left alone — TTS pronounces it correctly as "log".
];

/** Greek letters from LaTeX/Unicode the brain might emit. The TTS
 *  reads e.g. "θ" reliably as "theta", but the LaTeX command "\theta"
 *  gets pronounced as "back-slash theta" or worse. Strip the slash. */
const GREEK_REPLACEMENTS: Replacement[] = [
  { pattern: /\\theta\b/g, replacement: 'theta' },
  { pattern: /\\phi\b/g, replacement: 'phi' },
  { pattern: /\\alpha\b/g, replacement: 'alpha' },
  { pattern: /\\beta\b/g, replacement: 'beta' },
  { pattern: /\\gamma\b/g, replacement: 'gamma' },
  { pattern: /\\delta\b/g, replacement: 'delta' },
  { pattern: /\\epsilon\b/g, replacement: 'epsilon' },
  { pattern: /\\lambda\b/g, replacement: 'lambda' },
  { pattern: /\\mu\b/g, replacement: 'mu' },
  { pattern: /\\pi\b/g, replacement: 'pi' },
  { pattern: /\\sigma\b/g, replacement: 'sigma' },
  { pattern: /\\omega\b/g, replacement: 'omega' },
];

/** Punctuation normalizations — the TTS handles these unevenly. */
const PUNCTUATION_REPLACEMENTS: Replacement[] = [
  { pattern: /…/g, replacement: ', ' },          // ellipsis → comma pause
  { pattern: /–/g, replacement: ', ' },          // en-dash → comma pause
];

/** Slash-pair whitelist — curated option/direction pairs where "/" is
 *  read aloud as "or" ("opens left/right" → "opens left or right").
 *  Deliberately a short, exact list: fractions ("3/4") and ratios
 *  ("profit/revenue") must NOT be touched, so this is NOT a generic
 *  slash → "or" rule, just these named pairs. For the two pairs whose
 *  second word already IS "or" ("and/or", "either/or"), don't double
 *  up — "and/or" reads as "and or", not "and or or". */
const SLASH_PAIRS: [string, string][] = [
  ['left', 'right'],
  ['right', 'left'],
  ['up', 'down'],
  ['down', 'up'],
  ['top', 'bottom'],
  ['higher', 'lower'],
  ['wider', 'taller'],
  ['taller', 'wider'],
  ['increase', 'decrease'],
  ['and', 'or'],
  ['either', 'or'],
  ['plus', 'minus'],
  ['true', 'false'],
  ['yes', 'no'],
];

const SLASH_PAIR_REPLACEMENTS: Replacement[] = SLASH_PAIRS.map(([a, b]) => ({
  pattern: new RegExp(`\\b${a}/${b}\\b`, 'gi'),
  replacement: b === 'or' ? `${a} ${b}` : `${a} or ${b}`,
}));

/** Em-dash normalization. Some TTS voices (Cartesia/Sonic in particular)
 *  render an em-dash as an audible hard pause rather than a natural
 *  clause break — reported live as "That's a clean session <pause>
 *  Praveen <pause> you walked in." Rewrite to a comma instead. Handles
 *  both the bare glyph and the spaced " — " form; rewriteForTTS()
 *  collapses any doubled commas this produces. */
const EMDASH_REPLACEMENTS: Replacement[] = [
  { pattern: /\s*—\s*/g, replacement: ', ' },
];

/** Math-variable letter respelling.
 *
 *  Tier 1 (unconditional): standalone lowercase 'y' and 'b' are almost
 *  never English words on their own, so they're rewritten every time
 *  they appear as a standalone token ('y' → "why", 'b' → "bee"). This
 *  also catches compound tokens like "x-y" (the hyphen is a word
 *  boundary, so "x-y plane" → "x-why plane"). Capitalized Y/B ARE
 *  common as standalone tokens (sentence-initial "You...", or "B" as
 *  a grade/label), so those are only rewritten when immediately
 *  followed by a math anchor that confirms variable usage.
 *
 *  Tier 2 ('a' only, context-anchored): 'a' is the English article and
 *  can't be rewritten unconditionally ("a cat", "a question" must stay
 *  untouched). It's only rewritten to "ay" when a variable-defining
 *  phrase anchors it — kept deliberately conservative.
 */
const MATH_ANCHOR_SRC = 'squared|cubed|equals|=|over|plus|minus|axis|coordinate|value';

const A_VARIABLE_REPLACEMENTS: Replacement[] = [
  // "a represents/denotes/stands for/equals/=" — 'a' as the named variable.
  { pattern: /\ba\b(?=\s+(?:represents|denotes|stands for|equals|=))/gi, replacement: 'ay' },
  // "substitute a" / "solve for a" / "value of a" / "values of a"
  { pattern: /(?<=\b(?:substitute|solve for|value of|values of)\s)a\b/gi, replacement: 'ay' },
  // "of a and b" — e.g. "the ratio of a and b"
  { pattern: /(?<=\bof\s)a(?=\s+and\s+b\b)/gi, replacement: 'ay' },
  // "value/values/find/for a and b" (same idea, without "of")
  { pattern: /(?<=\b(?:value|values|find|for)\s)a(?=\s+and\s+b\b)/gi, replacement: 'ay' },
  // "a, the ..." apposition — "substitute a, the number of apples"
  { pattern: /\ba\b(?=,\s*the\b)/gi, replacement: 'ay' },
];

const LETTER_RESPELLING_REPLACEMENTS: Replacement[] = [
  ...A_VARIABLE_REPLACEMENTS,
  { pattern: /\by\b/g, replacement: 'why' },
  { pattern: /\bb\b/g, replacement: 'bee' },
  { pattern: new RegExp(`\\bY\\b(?=\\s*(?:${MATH_ANCHOR_SRC}))`, 'g'), replacement: 'why' },
  { pattern: new RegExp(`\\bB\\b(?=\\s*(?:${MATH_ANCHOR_SRC}))`, 'g'), replacement: 'bee' },
];

const ALL_REPLACEMENTS: Replacement[] = [
  ...TRIG_REPLACEMENTS,
  ...MATH_FUNC_REPLACEMENTS,
  ...GREEK_REPLACEMENTS,
  ...PUNCTUATION_REPLACEMENTS,
  ...SLASH_PAIR_REPLACEMENTS,
  ...EMDASH_REPLACEMENTS,
  ...LETTER_RESPELLING_REPLACEMENTS,
];

/**
 * Apply all pronunciation rewrites + punctuation normalizations.
 * Order matters within sections (longer matches first — "arcsin"
 * before "sin"); TRIG_REPLACEMENTS is ordered accordingly above.
 */
export function rewriteForTTS(raw: string): string {
  let t = raw;
  for (const { pattern, replacement } of ALL_REPLACEMENTS) {
    t = t.replace(pattern, replacement);
  }
  // Collapse doubled commas (e.g. two adjacent em-dashes both becoming
  // ", ") into a single comma.
  t = t.replace(/,(\s*,)+/g, ',');
  // Collapse repeated whitespace introduced by replacements.
  t = t.replace(/\s+/g, ' ').trim();
  // If a sentence ends with "?" but has stray spaces before it, fix.
  t = t.replace(/\s+\?/g, '?');
  return t;
}
