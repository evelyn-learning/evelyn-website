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

/** Math comparison / operator glyphs. Cartesia voices these as their glyph
 *  name or drops them; the "=" rule in rewriteForTTS deliberately leaves
 *  these distinct code points alone, so expand them here. */
const MATH_OPERATOR_REPLACEMENTS: Replacement[] = [
  { pattern: /\s*≤\s*/g, replacement: ' less than or equal to ' },
  { pattern: /\s*≥\s*/g, replacement: ' greater than or equal to ' },
  { pattern: /\s*≠\s*/g, replacement: ' not equal to ' },
  { pattern: /\s*≈\s*/g, replacement: ' approximately ' },
  { pattern: /\s*±\s*/g, replacement: ' plus or minus ' },
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

/** Markdown emphasis stripping — the brain emits *italic* / **bold**
 *  spans; the client strips bold before speech but single-asterisk
 *  italics leak through to TTS, where they block variable-anchor
 *  matching ("*a* represents") and can be voiced as "asterisk".
 *  Content must start with a letter so multiplication ("2*3*4")
 *  is never touched. */
const MD_EMPHASIS_REPLACEMENTS: Replacement[] = [
  { pattern: /\*{1,2}([A-Za-z][^*]{0,60}?)\*{1,2}/g, replacement: '$1' },
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
const MATH_ANCHOR_SRC = 'squared|cubed|equals|=|over|plus|minus|axis|coordinate|value|bar|hat|prime|tilde|intercept';

const A_VARIABLE_REPLACEMENTS: Replacement[] = [
  // "a represents/denotes/stands for/equals/=" — 'a' as the named variable.
  { pattern: /\ba\b(?=\s+(?:represent(?:s|ed)?|denotes?|stands?\s+for|means?|equals|=))/gi, replacement: 'ay' },
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
  // Coefficient lists "a, b, c" / "a, b, and c" respell CONSISTENTLY —
  // live 2026-07-15 (quadratics): the standalone \bb\b rule below produced
  // "a, bee, c" (b respelled, a and c not), which sounds like a mistake.
  // MUST run before the standalone \bb\b rule (it would consume the b).
  { pattern: /\ba\s*,\s*b\s*,\s*and\s+c\b/gi, replacement: 'ay, bee, and see' },
  { pattern: /\ba\s*,\s*b\s*,\s*c\b/gi, replacement: 'ay, bee, see' },
  { pattern: /\bb\s+and\s+c\b/g, replacement: 'bee and see' },
  // "c represents/denotes/equals…" — same anchored contexts as 'a'.
  { pattern: /\bc\b(?=\s+(?:represent(?:s|ed)?|denotes?|stands?\s+for|means?|equals|=))/gi, replacement: 'see' },
  { pattern: /\by\b(?!['’])/g, replacement: 'why' },  // (?!') guards contractions like y'all
  { pattern: /\bb\b(?!['’])/g, replacement: 'bee' },
  { pattern: new RegExp(`\\bY\\b(?=[-\\s]\\s*(?:${MATH_ANCHOR_SRC})|\\s*(?:${MATH_ANCHOR_SRC}))`, 'g'), replacement: 'why' },
  { pattern: new RegExp(`\\bB\\b(?=[-\\s]\\s*(?:${MATH_ANCHOR_SRC})|\\s*(?:${MATH_ANCHOR_SRC}))`, 'g'), replacement: 'bee' },
];

const ALL_REPLACEMENTS: Replacement[] = [
  ...MD_EMPHASIS_REPLACEMENTS,
  ...TRIG_REPLACEMENTS,
  ...MATH_FUNC_REPLACEMENTS,
  ...GREEK_REPLACEMENTS,
  ...PUNCTUATION_REPLACEMENTS,
  ...MATH_OPERATOR_REPLACEMENTS,
  ...SLASH_PAIR_REPLACEMENTS,
  ...EMDASH_REPLACEMENTS,
  ...LETTER_RESPELLING_REPLACEMENTS,
];

/** Spoken names for single-letter math variables in derivative
 *  notation ("dee why", "dee ex"). Fallback: the letter itself. */
const VAR_SPOKEN: Record<string, string> = {
  a: 'ay', b: 'bee', c: 'see', e: 'ee', f: 'ef', g: 'jee',
  k: 'kay', m: 'em', n: 'en', p: 'pee', q: 'cue', r: 'ar',
  s: 'ess', t: 'tee', u: 'you', v: 'vee', x: 'ex', y: 'why', z: 'zee',
};
const spokenVar = (ch: string): string => VAR_SPOKEN[ch.toLowerCase()] ?? ch;

/**
 * Derivative / differential notation → spoken form. Deterministic
 * backstop for the prompt's speak-math-in-words rule: seed content and
 * brain slips still emit raw "dy/dx", which Cartesia voices as
 * "die slash dx" (live 2026-07-09, portal calc sessions). Runs BEFORE
 * the slash whitelist (which deliberately never touches fractions) and
 * before letter respelling (which only matches standalone letters, so
 * two-letter "dy" reads as the word "die").
 */
function rewriteDerivatives(t: string): string {
  // d²y/dx² and d^2y/dx^2 — second derivative fractions.
  t = t.replace(
    /\bd(?:²|\^2)\s*([a-z])\s*\/\s*d\s*([a-z])\s*(?:²|\^2)/gi,
    (_, top: string, bot: string) => `dee squared ${spokenVar(top)} over dee ${spokenVar(bot)} squared`,
  );
  // dy/dx, dx/dt, … — first-derivative fractions. Both sides must be a
  // d-prefixed single letter, so numeric fractions and word ratios
  // ("3/4", "profit/revenue") can never match.
  t = t.replace(
    /\bd([a-z])\s*\/\s*d([a-z])\b/gi,
    (_, top: string, bot: string) => `dee ${spokenVar(top)} over dee ${spokenVar(bot)}`,
  );
  // Bare differential tokens ("take dy and divide by dx"). Lowercase
  // common calculus variables only — case-sensitive and \b-guarded so
  // "dying", "Dr", and ordinary words never match.
  t = t.replace(/\bd([xytuv])\b/g, (_, v: string) => `dee ${spokenVar(v)}`);
  return t;
}

/**
 * Domain acronyms the Cartesia text normalizer expands into US state names.
 * Confirmed live 2026-07-13: "SD" (standard deviation) voiced as "South
 * Dakota" in a stats session. The fix expands the acronym to its spoken
 * term, guarded so GENUINE state abbreviations survive — a state code is
 * preceded by a 4-digit year ("1890 SD" = Wounded Knee) or a "Placename, XX"
 * comma ("Pierre, SD"), and the stats term never is; plural "SDs" is always
 * the stats term. The comma guard requires a Capitalized word before the
 * comma so stats phrasings like "mean=100, SD=15" (number before the comma)
 * still expand. This is the home for other guarded domain-acronym
 * expansions if more surface (see the mispronunciation audit).
 */
function rewriteDomainAcronyms(t: string): string {
  // "SD"/"SDs" → "standard deviation(s)" unless it reads as a state code
  // (preceded by "<year> " or "Placename, ").
  t = t.replace(/(?<!\d{4}\s)(?<![A-Z][a-z]+,\s)\bSD(s?)\b/g, (_m, s: string) => `standard deviation${s}`);
  return t;
}

/**
 * Apply all pronunciation rewrites + punctuation normalizations.
 * Order matters within sections (longer matches first — "arcsin"
 * before "sin"); TRIG_REPLACEMENTS is ordered accordingly above.
 */
/** ALL-CAPS emphasis words Cartesia reads as initialisms ("OUT" → "O U T",
 *  live 2026-07-15 biology session). The brain writes caps for emphasis;
 *  audio carries no visual emphasis, so lowercase them for speech. A
 *  WHITELIST on purpose: blanket lowercasing would break genuine
 *  initialisms, and known collisions (US, IT, NO=nitric oxide, AD/AS,
 *  ERA, SAT/ACT) are deliberately absent. */
const CAPS_EMPHASIS_WORDS = new RegExp(
  '\\b(OUT|NOT|ALL|ONE|BOTH|EVERY|NEVER|ALWAYS|ONLY|SAME|EACH|MOST|NONE|VERY' +
  '|ANY|MUST|WHY|HOW|WHAT|WHERE|WHEN|YES|AND|BUT|ARE|WAS|WILL|CAN|DOES|DID' +
  '|THE|THIS|THAT|INSIDE|OUTSIDE|BEFORE|AFTER|WITH|WITHOUT|MORE|LESS|SAME' +
  '|EXACTLY|OPPOSITE|TOGETHER|WITHIN|BECAUSE|INTO|FROM|BOTH|HALF|TWICE)\\b',
  'g',
);

export function rewriteForTTS(raw: string): string {
  let t = raw;
  // Double quotes (straight + curly) are stripped outright: after a
  // number Cartesia reads `"6"` as an inch mark ("six inch"), and
  // quotation marks add nothing audible elsewhere. Apostrophes /
  // single quotes are untouched (contractions).
  t = t.replace(/["“”]/g, '');
  // Caps-emphasis → lowercase (see CAPS_EMPHASIS_WORDS). Runs early so
  // later rules see normal-case words.
  t = t.replace(CAPS_EMPHASIS_WORDS, (m) => m.toLowerCase());
  t = rewriteDerivatives(t);
  // Domain acronyms Cartesia expands as state names ("SD" → "South Dakota").
  // Runs before comma/number normalization so its state-code guard can still
  // see "1890 SD" / ", SD".
  t = rewriteDomainAcronyms(t);
  // Bare equals signs: Cartesia voices "=" as "equal sign" ("n=12" →
  // "n equal sign 12", live 2026-07-10). Not touched: ≠/≤/≥ (distinct
  // glyphs) and "==" (never appears in tutor speech).
  t = t.replace(/\s*=\s*/g, ' equals ');
  // Unicode sub/superscript digits: Cartesia mangles them ("T₁" was
  // voiced roughly as "T-jash"). Speak the plain digit ("T 1").
  const SUBSCRIPT_DIGITS: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  };
  t = t.replace(/[₀-₉]/g, (ch) => ` ${SUBSCRIPT_DIGITS[ch] ?? ch}`);
  // Superscript squared/cubed: Cartesia drops or mis-voices "x²"/"cm²".
  // Only ²/³ are handled — higher superscripts are rare and their spoken
  // form ("to the fourth") is ambiguous with ordinals.
  t = t.replace(/²/g, ' squared').replace(/³/g, ' cubed');
  // Degree sign: "38°N" → "38 degrees N", "60°C" → "60 degrees C".
  t = t.replace(/°/g, ' degrees ');
  for (const { pattern, replacement } of ALL_REPLACEMENTS) {
    t = t.replace(pattern, replacement);
  }
  // Collapse doubled commas (e.g. two adjacent em-dashes both becoming
  // ", ") into a single comma.
  t = t.replace(/,(\s*,)+/g, ',');
  // Sentence-final vocative comma: Cartesia turns ", Praveen." into an
  // exaggerated pause before the name (live 2026-07-11). Drop the comma
  // in SPEECH only — this layer never feeds captions/transcript/PDF, so
  // the written form keeps correct punctuation. Shape-matched: comma +
  // capitalized word + terminator. Runs AFTER the em-dash → comma
  // replacement so "— Praveen." is caught too. Openers ("Hey Praveen,
  // I'm Sameer") don't match — their comma isn't before name+terminator.
  t = t.replace(/,\s+([A-Z][a-z]+)([.!?])/g, ' $1$2');
  // Collapse repeated whitespace introduced by replacements.
  t = t.replace(/\s+/g, ' ').trim();
  // If a sentence ends with "?" but has stray spaces before it, fix.
  t = t.replace(/\s+\?/g, '?');
  return t;
}
