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
  { pattern: /–/g, replacement: ', ' },          // en-dash → comma pause (em-dash kept; the prompt covers it)
];

const ALL_REPLACEMENTS: Replacement[] = [
  ...TRIG_REPLACEMENTS,
  ...MATH_FUNC_REPLACEMENTS,
  ...GREEK_REPLACEMENTS,
  ...PUNCTUATION_REPLACEMENTS,
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
  // Collapse repeated whitespace introduced by replacements.
  t = t.replace(/\s+/g, ' ').trim();
  // If a sentence ends with "?" but has stray spaces before it, fix.
  t = t.replace(/\s+\?/g, '?');
  return t;
}
