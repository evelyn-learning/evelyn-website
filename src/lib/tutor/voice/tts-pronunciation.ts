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
 *  gets pronounced as "back-slash theta" or worse. Strip the slash.
 *  \pi resolves to the bare word "pi" here — PI_REPLACEMENTS below then
 *  upgrades that (and any other bare "pi") to "pie", so the ordering in
 *  ALL_REPLACEMENTS (Greek before Pi) matters. */
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

/** Greek letter π — live bug (session portal-236c6e8f): bare "pi" voiced
 *  as the letter-name "pee" instead of "pie". Unlike the SD/state-code
 *  ambiguity elsewhere in this file, there's no legitimate ENGLISH
 *  reading where standalone "pi"/"Pi" is pronounced any way other than
 *  "pie" — the constant, "Pi Day", "Raspberry Pi", the movie title, all
 *  say "pie" — so lowercase and Title-Case forms are unconditionally
 *  rewritten, same as the tier-1 y/b letter respelling below. Word-
 *  boundary regex keeps "spinning"/"pit"/"piano" untouched (no standalone
 *  "pi" token exists inside those words — \b requires a non-word
 *  character on both sides of the match, which "pit"'s trailing "t" and
 *  "spinning"'s embedded "pi" both fail). ALL-CAPS "PI" is deliberately
 *  EXCLUDED (case-sensitive pattern, no 'i' flag) — that shape is almost
 *  always an acronym (principal investigator, personal information)
 *  rather than the Greek letter, matching CAPS_EMPHASIS_WORDS' own
 *  known-collision precedent (NO, US, AD/AS, ERA, SAT/ACT). Must run
 *  AFTER GREEK_REPLACEMENTS in ALL_REPLACEMENTS so "\pi" (already
 *  resolved to bare "pi" there) also gets upgraded to "pie". */
const PI_REPLACEMENTS: Replacement[] = [
  { pattern: /\bpi\b/g, replacement: 'pie' },
  { pattern: /\bPi\b/g, replacement: 'Pie' },
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

/** ---------------------------------------------------------------------
 *  Math verbalization for speech (Task X1).
 *
 *  Live bug (session portal-236c6e8f): E4's prompt change encourages
 *  $-delimiting math in card fields (e.g. `show_problem`'s statement)
 *  so KaTeX renders correctly on the board. When the brain narrates that
 *  same card text as SPEECH (per "narrate the authored card verbatim"),
 *  the raw LaTeX reaches TTS unconverted — Cartesia voiced `$a^3 b^3$`
 *  as "dollar a cubed bee circumflex 3 dollar". This section turns LaTeX
 *  math notation into SPOKEN WORDS ("a cubed b cubed") — a sibling to
 *  (but distinct from) stripLatexForTitle in whiteboard/board-title.ts,
 *  which turns the same notation into DISPLAY SYMBOLS ("a³") for a
 *  page-title pill. The brace-resolution/sizing-command approach below
 *  is structurally similar to that module (nested-brace loop, \left/
 *  \right stripping) but the output is always words, never symbols, so
 *  it's a separate implementation rather than a shared one.
 * ----------------------------------------------------------------- */

/** Turn `+`/`-` inside an already-isolated math fragment (a \frac
 *  numerator/denominator, or a braced exponent/subscript) into spoken
 *  words. Only ever applied to content we already know is math — never
 *  to arbitrary prose, where a bare "-" is usually a hyphenated word or
 *  a genuine minus sign it's not safe to guess about. */
function wordifyMathOperators(s: string): string {
  return s
    .replace(/\+/g, ' plus ')
    .replace(/-/g, ' minus ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** \frac{a}{b} -> "a over b". Looped (not recursive) so nested fractions
 *  resolve inside-out — same approach as board-title's resolveFractions:
 *  the regex only matches a frac whose numerator/denominator are
 *  themselves brace-free, i.e. exactly the innermost one first. */
const SPEECH_FRAC_RE = /\\frac\{([^{}]*)\}\{([^{}]*)\}/;
function resolveFractionsForSpeech(t: string): string {
  let prev: string;
  do {
    prev = t;
    t = t.replace(SPEECH_FRAC_RE, (_m, num: string, den: string) =>
      ` ${wordifyMathOperators(num)} over ${wordifyMathOperators(den)} `);
  } while (t !== prev);
  return t;
}

/** \sqrt{X} / \sqrt[n]{X} -> "the square root of X" / "the cube root of
 *  X" / "the Nth root of X". */
function resolveSqrtForSpeech(t: string): string {
  t = t.replace(/\\sqrt\[(\w+)\]\{([^{}]*)\}/g, (_m, index: string, content: string) => {
    const inner = wordifyMathOperators(content);
    if (index === '2') return ` the square root of ${inner} `;
    if (index === '3') return ` the cube root of ${inner} `;
    return ` the ${index}th root of ${inner} `;
  });
  t = t.replace(/\\sqrt\{([^{}]*)\}/g, (_m, content: string) =>
    ` the square root of ${wordifyMathOperators(content)} `);
  return t;
}

/** Common LaTeX operator commands with unambiguous spoken forms — the
 *  backslash-command counterparts to the unicode glyphs already handled
 *  by MATH_OPERATOR_REPLACEMENTS below. \left/\right/\big../\Big..
 *  ("parentheses handling") are pure sizing wrappers with no semantic
 *  content, reused from board-title's delimiter-sizing regex — stripped
 *  entirely rather than voiced, leaving the bare "(" "/" ")" for the TTS
 *  to read naturally (it already handles literal parens fine, per the
 *  existing "200 ± 2(25)" regression test below). Bare "\(" / "\)"
 *  (the alternate inline-math delimiter form) are stripped the same way
 *  $ is — see stripDollarMathForSpeech. */
const MATH_COMMAND_REPLACEMENTS: Replacement[] = [
  { pattern: /\\times\b/g, replacement: ' times ' },
  { pattern: /\\cdot\b/g, replacement: ' times ' },
  { pattern: /\\div\b/g, replacement: ' divided by ' },
  { pattern: /\\pm\b/g, replacement: ' plus or minus ' },
  { pattern: /\\leq\b/g, replacement: ' less than or equal to ' },
  { pattern: /\\geq\b/g, replacement: ' greater than or equal to ' },
  { pattern: /\\neq\b/g, replacement: ' not equal to ' },
  { pattern: /\\approx\b/g, replacement: ' approximately ' },
  { pattern: /\\(left|right|big[lmr]?|Big[lmr]?|bigg[lmr]?|Bigg[lmr]?)\b/g, replacement: '' },
  { pattern: /\\[()]/g, replacement: ' ' },
];
function verbalizeMathCommandsForSpeech(t: string): string {
  for (const { pattern, replacement } of MATH_COMMAND_REPLACEMENTS) {
    t = t.replace(pattern, replacement);
  }
  return t;
}

/** Spoken form for an exponent: 2 -> "squared", 3 -> "cubed", anything
 *  else -> "to the N". Higher numeric powers deliberately aren't spelled
 *  as ordinals ("to the fourth") — same conservative call the unicode
 *  ²/³-only handling below makes, since higher ordinals read ambiguously
 *  next to a plain number. */
function spokenExponent(exp: string): string {
  const trimmed = wordifyMathOperators(exp);
  if (trimmed === '2') return ' squared ';
  if (trimmed === '3') return ' cubed ';
  return ` to the ${trimmed} `;
}

/** ^{n+1} / ^2 / ^3 / ^n -> spoken exponent form. Braced form first (so
 *  its content can hold an expression like "n+1"); then bare numeric
 *  ("x^2", "x^-1"); then bare single-letter ("x^n"). Runs AFTER
 *  rewriteDerivatives (see call site in rewriteForTTS), which already
 *  consumes d²y/dx²-style patterns — by the time this runs there's no
 *  more "d^2y" for the numeric branch to misparse. */
function verbalizeExponentsForSpeech(t: string): string {
  t = t.replace(/\^\{([^{}]+)\}/g, (_m, exp: string) => spokenExponent(exp));
  t = t.replace(/\^(-?\d+)/g, (_m, exp: string) => spokenExponent(exp));
  t = t.replace(/\^([a-zA-Z])\b/g, (_m, exp: string) => spokenExponent(exp));
  return t;
}

/** _{n+1} / _1 / _i -> "sub …". Same braced-first ordering as exponents. */
function verbalizeSubscriptsForSpeech(t: string): string {
  t = t.replace(/_\{([^{}]+)\}/g, (_m, sub: string) => ` sub ${wordifyMathOperators(sub)} `);
  t = t.replace(/_(-?\d+)/g, (_m, sub: string) => ` sub ${sub} `);
  t = t.replace(/_([a-zA-Z])\b/g, (_m, sub: string) => ` sub ${sub} `);
  return t;
}

/** Full math-notation -> words pipeline. Order matters: fractions and
 *  roots first (they consume whole `\command{...}{...}` shapes before
 *  the generic exponent/subscript regexes could misfire on braces that
 *  belong to a \frac or \sqrt), then the small operator-command set,
 *  then exponents, then subscripts. Safe to run on ANY text — every
 *  pattern here is backslash/caret/underscore-anchored, none of which
 *  appear in ordinary English prose, so this never touches real speech. */
function verbalizeMathForSpeech(t: string): string {
  t = resolveFractionsForSpeech(t);
  t = resolveSqrtForSpeech(t);
  t = verbalizeMathCommandsForSpeech(t);
  t = verbalizeExponentsForSpeech(t);
  t = verbalizeSubscriptsForSpeech(t);
  return t;
}

/** $...$ delimiter stripping. Only unwraps a paired span when its
 *  content looks like real math (a caret, underscore, backslash command,
 *  or bare "=" sign) — a lone "$5" price mention (no closing $ nearby,
 *  or a closing $ that belongs to an unrelated second price) must never
 *  be touched. Gate rationale: unlike the SD/state-code ambiguity above,
 *  there's no legitimate reading where "$a^3 b^3$" or "$x = 3$" (straight
 *  from the E4 prompt's own show_problem example) is prose rather than
 *  leaked markup — but plain "$x$" with no such signal is left alone
 *  (rare in practice, and erring toward leaving a bare $ is safer than
 *  guessing wrong on a real currency mention).
 *  Runs the full verbalizeMathForSpeech pipeline on the captured content
 *  so the dollar signs disappear along with the symbols they wrapped. */
const MATH_SIGNAL_RE = /[\^_\\=]/;
// Round-20 (2026-07-17): in-span letter respelling. Inside a DECLARED math
// span, ambiguity doesn't exist — a standalone letter is a variable by
// construction, so the article/prose guards that constrain the Tier-1/2
// heuristics (below) don't apply here. x/e/i read naturally and are left
// alone; d covers the bare differential (dy/dx forms are rewritten before
// this runs on the span's inner text).
function respellMathLetters(s: string): string {
  return s
    .replace(/\b[aA]\b/g, 'ay')
    .replace(/\b[bB]\b/g, 'bee')
    .replace(/\b[yY]\b/g, 'why')
    .replace(/\bd\b/g, 'dee');
}
// Round-15 Issue 4 (2026-07-16, live AP Calc): "$(x-2)$" leaked raw to
// Cartesia — no ^ _ \ = inside, so the signal gate never fired, and the
// prose bare-minus rule (BARE_MINUS_RE) requires spaces on both sides so
// unspaced "x-2" never converted either. A $-span with an arithmetic
// operator BETWEEN operand-shaped tokens (letter/digit/closing bracket →
// op → letter/digit/opening bracket) is math, not prose: "(x-2)", "x+3",
// "2n-1". Currency stays safe — "It costs $5 and shipping is $10" captures
// "5 and shipping is " between the two $, which has no operand-op-operand
// shape. En-dash ranges ("$5–8$") are excluded by using ASCII operators.
const MATH_OPERAND_OP_RE = /[A-Za-z0-9)\]]\s*[-+*/×·^]\s*[A-Za-z0-9(\[]/;
// Round-16 Issue 3 (2026-07-17, live AP Calc): "the numerator's just $x$"
// reached Cartesia with the dollar signs spoken — a bare single-letter span
// has no signal char and no operand-op-operand shape. A PAIRED
// $<single letter>$ is essentially never a currency mention (currency is
// "$5", one sign), so unwrap it. Single letters only — "$5$" stays out of
// scope to keep the price guard airtight.
const SINGLE_VAR_RE = /^\s*[A-Za-z]\s*$/;
// Round-20 (2026-07-17): the gate is FLIPPED to math-by-default. History:
// every $-leak fixed since X1 ($a^3 b^3$, $(x-2)$, $x$, …) was this gate
// being under-inclusive — a whitelist of "math signals" meeting an
// unbounded variety of math shapes. With the brain now instructed to wrap
// ALL spoken math in $…$ (the declared-pronunciation design), the default
// inverts: a paired span is math unless it matches the one enumerable
// counter-shape — a currency PAIRING ARTIFACT, where two real prices pair
// into a fake span ("It costs $5 and shipping is $10" captures "5 and
// shipping is "): digit-led, contains prose words, no math signal. A
// wrapped span can no longer leak "$" into speech by construction; the
// inner text runs the full math pipeline (derivatives included — "$dy/dx$"
// previously leaked because rewriteDerivatives consumed the slash before
// this gate ran) plus unconditional in-span letter respelling.
const CURRENCY_ARTIFACT_RE = /^\s*\d/;
const PROSE_WORD_RE = /[a-z]{3,}/i;
function stripDollarMathForSpeech(t: string): string {
  return t.replace(/\$([^$\n]{1,160})\$/g, (whole: string, inner: string) => {
    if (
      CURRENCY_ARTIFACT_RE.test(inner) &&
      PROSE_WORD_RE.test(inner) &&
      !MATH_SIGNAL_RE.test(inner) &&
      !MATH_OPERAND_OP_RE.test(inner)
    ) return whole;
    return ` ${respellMathLetters(wordifyMathOperators(verbalizeMathForSpeech(rewriteDerivatives(inner)))).trim()} `;
  });
}

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
  // Round-19 (2026-07-17, live): "a squared minus b squared" spoke the
  // article. 'a' before squared/cubed is the variable when a math
  // continuation follows (operator word, a VERB — "a squared can be taken
  // common" — or another single-letter / respelled term). "a squared grid"
  // (squared as adjective before a noun) stays untouched.
  { pattern: /\ba\b(?=\s+(?:squared|cubed)\s+(?:minus|plus|times|over|equals|divided|is\b|can\b|could\b|will\b|would\b|becomes?\b|gives?\b|gets?\b|cancels?\b|factors?\b|divides?\b|[a-z]\b|bee\b|why\b))/gi, replacement: 'ay' },
  // Round-19b (user stress cases) — grammatically unambiguous variable
  // shapes an English article can never form:
  //   "a is a/the variable…"  (article + "is" is ungrammatical)
  { pattern: /\ba\b(?=\s+is\s+(?:a|the)\s+(?:variable|constant|coefficient|term|factor|number|value|unknown)\b)/gi, replacement: 'ay' },
  //   "the a in/of/…"  ("the a" can only denote the letter/variable; the
  //   follower list keeps "the a cappella choir" safe)
  { pattern: /(?<=\bthe\s)a\b(?=\s+(?:in|of|here|term|value|equals|is|and)\b)/gi, replacement: 'ay' },
  //   "a when divided/…"  (article + "when" is ungrammatical; follower list
  //   guards hyphenless "a when-clause" prose)
  { pattern: /\ba\b(?=\s+when\s+(?:divided|multiplied|squared|cubed|added|subtracted|raised|it\b|we\b|you\b))/gi, replacement: 'ay' },
  //   sentence-final "…over a." / "…divided by a," (an article must be
  //   followed by a noun — clause-final 'a' after a math preposition is
  //   always the variable)
  { pattern: /(?<=\b(?:over|by|times|plus|minus)\s)a\b(?=\s*(?:[.,;:!?]|$))/gi, replacement: 'ay' },
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
  ...PI_REPLACEMENTS,
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
 * Roman numerals in document-citation contexts ("Article I", "Amendment
 * XIV", "Title IX") — live-heard as "Article aye" rather than "Article
 * one" (Task X8, AP Gov/US History sessions). Gate on a preceding citation
 * keyword so the pronoun "I" is NEVER touched standalone — "I said", "I
 * think" never match because no keyword immediately precedes them.
 *
 * Deliberately simple once gated: ANY keyword + roman-numeral token is
 * read as the document sense, even in a sentence like "Article I says
 * this clause..." where "I" is followed by a verb that would otherwise
 * look pronoun-like ("I says" is ungrammatical anyway) — there's no
 * legitimate reading of "Article I" as "Article, I ..." (a citation
 * keyword is never itself a complete clause), so no further gating on
 * what follows is needed. This is the one documented edge case the task
 * called out: we accept it because the false-positive surface is empty in
 * practice (no one writes "Article I <verb>" meaning "Article, I <verb>").
 *
 * Covers I through XX (Article/Amendment/Section numbers rarely exceed
 * this in AP Gov/US History content; extend the map if a higher one shows
 * up live, e.g. Amendment XXVII).
 *
 * X8 REVIEW FIX (C1, critical): this used to run with the 'gi' flag, so a
 * LOWERCASE keyword-shaped word (e.g. "section" as an ordinary noun)
 * immediately before a bare "I" (the pronoun) matched the citation shape
 * and converted it — "The section I wrote" -> "the section one wrote"
 * (verified live; high-frequency tutoring phrase). The keyword must now
 * match its literal Title-Case spelling, or an EXPLICIT ALL-CAPS variant
 * (a genuine all-caps citation, e.g. "ARTICLE II" in emphasized text) —
 * no blanket case-insensitivity. Any other casing (e.g. "aRTICLE") is
 * left untouched by design; it isn't a shape real citation text takes.
 */
const ROMAN_NUMERAL_WORDS: Record<string, string> = {
  I: 'one', II: 'two', III: 'three', IV: 'four', V: 'five',
  VI: 'six', VII: 'seven', VIII: 'eight', IX: 'nine', X: 'ten',
  XI: 'eleven', XII: 'twelve', XIII: 'thirteen', XIV: 'fourteen', XV: 'fifteen',
  XVI: 'sixteen', XVII: 'seventeen', XVIII: 'eighteen', XIX: 'nineteen', XX: 'twenty',
};
const ROMAN_NUMERAL_KEYWORDS = 'Article|Title|Section|Amendment|Chapter|Act|Part';
const ROMAN_NUMERAL_KEYWORDS_ALLCAPS = 'ARTICLE|TITLE|SECTION|AMENDMENT|CHAPTER|ACT|PART';
const ROMAN_NUMERAL_ALL_KEYS_SRC = Object.keys(ROMAN_NUMERAL_WORDS).join('|');
// X8 REVIEW FIX (I1, important): elided-keyword lists ("Amendment I, II,
// and III") used to convert only the first numeral, leaving the rest of
// the list ("II, and III") unconverted mid-sentence. CONTINUATION numerals
// in the same comma/and list now convert too — but NEVER a bare "I": if a
// continuation slot is the bare pronoun-shaped "I", it's indistinguishable
// from "Article II, I mean the free speech one..." (a real utterance
// shape), so the list-continuation scan simply stops there rather than
// guessing. Excluding "I" from this set is what implements that.
const ROMAN_NUMERAL_CONTINUATION_KEYS_SRC = Object.keys(ROMAN_NUMERAL_WORDS)
  .filter((key) => key !== 'I')
  .join('|');
const ROMAN_NUMERAL_RE = new RegExp(
  `\\b(${ROMAN_NUMERAL_KEYWORDS}|${ROMAN_NUMERAL_KEYWORDS_ALLCAPS})\\s+(${ROMAN_NUMERAL_ALL_KEYS_SRC})` +
    // Each continuation item is separated either by a comma (optionally
    // with a trailing "and ", e.g. ", and III") or, with no Oxford comma
    // at all, a bare " and " ("Section IV and V").
    `((?:\\s*,\\s*(?:and\\s+)?(?:${ROMAN_NUMERAL_CONTINUATION_KEYS_SRC})|\\s+and\\s+(?:${ROMAN_NUMERAL_CONTINUATION_KEYS_SRC}))*)\\b`,
  'g',
);
// Word-boundary-wrapped so this (used for a plain global replace with no
// trailing assertion of its own) can't partially match a longer numeral
// token's prefix (e.g. "X" matching inside "XV") — the \b on both sides
// forces the regex engine to backtrack to the correct, longer alternative.
const ROMAN_NUMERAL_CONTINUATION_RE = new RegExp(
  `\\b(?:${ROMAN_NUMERAL_CONTINUATION_KEYS_SRC})\\b`,
  'g',
);
function rewriteRomanNumerals(t: string): string {
  return t.replace(ROMAN_NUMERAL_RE, (_m, keyword: string, firstNumeral: string, continuation: string) => {
    let out = `${keyword} ${ROMAN_NUMERAL_WORDS[firstNumeral]}`;
    if (continuation) {
      out += continuation.replace(ROMAN_NUMERAL_CONTINUATION_RE, (numeral: string) => ROMAN_NUMERAL_WORDS[numeral]);
    }
    return out;
  });
}

/**
 * Legal case-name "v." (live-heard: "McCulloch vee Maryland" instead of
 * "McCulloch versus Maryland"). Gated on the " v. " token sitting directly
 * between two capitalized words — the shape of a case citation — so other
 * uses of "v." (rare in tutor speech; e.g. an abbreviation elsewhere) are
 * left alone. Only the word immediately before "v." needs to be
 * capitalized (multi-word names like "United States v. Nixon" still work
 * correctly: the untouched "United " prefix passes through unchanged, and
 * only "States v. " is rewritten to "States versus ", giving "United
 * States versus Nixon").
 */
const LEGAL_V_RE = /\b([A-Z][\w.]*)\s+v\.\s+(?=[A-Z])/g;
function rewriteLegalV(t: string): string {
  return t.replace(LEGAL_V_RE, '$1 versus ');
}

/**
 * Bare `-` (ASCII hyphen) between numeric/variable operands (Task Y3, live
 * bug: "2 - 2" spoken with the minus SKIPPED — Cartesia reads the bare glyph
 * as a pause, not "minus"). X1's `wordifyMathOperators` already converts
 * `-` -> "minus" everywhere, but ONLY inside content already confirmed to be
 * isolated math (a `\frac`/`\sqrt` brace, a braced exponent/subscript, or a
 * signal-gated `$...$` span) — by design it's never run on arbitrary prose,
 * where a bare `-` is usually a hyphenated word ("well-known") or a dash
 * used as punctuation. This is the missing case: a bare hyphen OUTSIDE any
 * of those gated contexts, sitting directly between two operand-shaped
 * tokens in otherwise-ungated text ("2 - 2", "x - 4").
 *
 * Gate: SPACES on both sides of the hyphen, AND a numeric token (int or
 * decimal) or a single letter immediately on each side. This is deliberately
 * narrow, same conservative shape as the rest of this file:
 *   - Hyphenated words ("well-known", "state-of-the-art") have NO spaces
 *     around the hyphen, so they never match — no separate word-list guard
 *     needed.
 *   - Prose dashes between ordinary words ("the plan - which was risky -
 *     failed") don't match either: the operand-shape gate (number or single
 *     letter only) already excludes multi-letter word tokens, so no extra
 *     prose-detection is needed beyond the shape check itself.
 *   - Em-dash / en-dash prose is a different unicode glyph entirely
 *     (EMDASH_REPLACEMENTS / PUNCTUATION_REPLACEMENTS above), unaffected.
 *
 * Documented ambiguity (per the brief): an UNSPACED numeric range ("pages
 * 3-5") is genuinely ambiguous with no space signal available — left
 * untouched, since "3-5" reads fine as a page range and there's no way to
 * distinguish it from subtraction shorthand without spaces. A SPACED
 * numeric pair ("pages 3 - 5"), by contrast, IS converted ("pages 3 minus
 * 5") even though it could still be intended as a range — the brief's call
 * is that a spaced hyphen between two operand-shaped tokens is the
 * STRONGEST available signal of minus-intent, and this rule trusts it
 * unconditionally rather than trying to sniff prose context (e.g. a
 * preceding "pages"/"years" word) to override it. Accepted tradeoff: rare
 * in tutoring speech, and erring toward voicing the operator is more
 * consistent with this module's math-speech mission than staying silent.
 */
const MATH_OPERAND_SRC = String.raw`\d+(?:\.\d+)?|[A-Za-z]`;
const BARE_MINUS_RE = new RegExp(
  `\\b(${MATH_OPERAND_SRC})\\b\\s+-\\s+(?=(${MATH_OPERAND_SRC})\\b)`,
  'g',
);

/** Y3 review (Controller decision, upgraded from documentation): a spaced
 *  YEAR RANGE ("1941 - 1945") was being read as subtraction ("1941 minus
 *  1945") — a live regression in a history-heavy catalog, where year ranges
 *  are common and a bare hyphen there already reads fine as a natural
 *  pause/range, same as TTS handles unspaced ranges elsewhere in this file.
 *  Excluded ONLY when BOTH operands are exactly 4-digit numbers (the year
 *  shape) — a 2-digit pair ("21 - 14", exam scores) or a mixed-digit-count
 *  pair ("400 - 40") still converts normally, since neither reads as a year.
 *  Accepted, documented loss: genuine math subtraction between two 4-digit
 *  literals (e.g. "9000 - 1500") will also read as an untouched range rather
 *  than "minus" — judged rare enough in tutoring speech that the year-range
 *  fix is worth the tradeoff. */
function isFourDigitYear(operand: string): boolean {
  return /^\d{4}$/.test(operand);
}

/** Y3 review (Minor): a chain of 3+ single-letter operands ("A - B - C")
 *  reads more like an enumerated list / labeled option set than subtraction
 *  — unlike a numeric chain ("2 - 2 - 2", still converted, tested above),
 *  there's no digit-shaped chain to anchor the math reading. Cheap guard:
 *  only fires when BOTH sides of a link are single letters AND the link
 *  extends into a further single-letter link on either side (forward: the
 *  right operand is itself followed by another " - <letter>"; backward: the
 *  left operand is itself preceded by another "<letter> - "). A single
 *  isolated two-letter link ("x - y", no third letter chained in either
 *  direction) is NOT a "chain" by this definition and still converts
 *  normally — same conservative shape as the rest of this file. */
function isSingleLetterChainLink(full: string, offset: number, matchLen: number, left: string, right: string): boolean {
  if (!/^[A-Za-z]$/.test(left) || !/^[A-Za-z]$/.test(right)) return false;
  const afterRight = full.slice(offset + matchLen + 1); // right operand is exactly 1 char
  const forwardExtends = /^\s+-\s+[A-Za-z]\b/.test(afterRight);
  const beforeMatch = full.slice(0, offset);
  const backwardExtends = /(?:^|[^A-Za-z])[A-Za-z]\s+-\s+$/.test(beforeMatch);
  return forwardExtends || backwardExtends;
}

function rewriteBareMinusForSpeech(t: string): string {
  return t.replace(BARE_MINUS_RE, (m: string, left: string, right: string, offset: number, full: string) => {
    if (isFourDigitYear(left) && isFourDigitYear(right)) return m; // year range — leave hyphen
    if (isSingleLetterChainLink(full, offset, m.length, left, right)) return m; // enumerated list, not subtraction
    return `${left} minus `;
  });
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
  // Round-15 Issue 5 (2026-07-16, live AP Psych neuron lesson): "Na"/"Na+"
  // voiced as the word "nah". Element-symbol expansions, guarded like the
  // SD precedent above. Case-sensitive on purpose ("na" in dialect text
  // stays). The ion charge sign is CONSUMED by the expansion so a stray
  // "+"/"-" doesn't reach the math wordifier. Bare "K" is NEVER touched —
  // vitamin K, grade K, "$5K" are all genuine K readings — it only
  // expands with an explicit charge sign or in the "Na-K pump" compound.
  t = t.replace(/\bNa[-–/]K\b/g, 'sodium potassium'); // Na-K / Na–K / Na/K pump
  t = t.replace(/\bNa\+/g, 'sodium');
  t = t.replace(/\bNa\b/g, 'sodium');
  t = t.replace(/\bK\+/g, 'potassium');
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
  // Document-citation roman numerals ("Article I" → "Article one") and
  // legal case-name "v." ("McCulloch v. Maryland" → "... versus ...")
  // (Task X8). Both are text-shape rewrites unrelated to math notation, so
  // they run before the math-verbalization pipeline; order between the two
  // doesn't matter (disjoint token shapes).
  t = rewriteRomanNumerals(t);
  t = rewriteLegalV(t);
  // Math verbalization (Task X1): $-delimited card-field math and any
  // bare LaTeX notation both need converting to SPOKEN WORDS before
  // anything downstream (letter respelling, the bare-equals rule below,
  // etc.) sees the text. Dollar-wrapped spans are only unwrapped when
  // they look like real math — see stripDollarMathForSpeech's gate.
  // Runs after rewriteDerivatives (which already consumed d²y/dx²-style
  // patterns) and before the bare "=" → "equals" rule so anything left
  // over (e.g. "$x = 3$" → "x = 3") still gets voiced by it.
  t = stripDollarMathForSpeech(t);
  t = verbalizeMathForSpeech(t);
  // Bare equals signs: Cartesia voices "=" as "equal sign" ("n=12" →
  // "n equal sign 12", live 2026-07-10). Not touched: ≠/≤/≥ (distinct
  // glyphs) and "==" (never appears in tutor speech).
  t = t.replace(/\s*=\s*/g, ' equals ');
  // Bare minus between math operands (Task Y3, live bug: "2 - 2" spoken with
  // the minus SKIPPED). See rewriteBareMinusForSpeech's doc comment above
  // for the full spaced/unspaced gating rationale. Runs after the bare-"="
  // rule (same family of ASCII-operator normalizations) and before the
  // unicode sub/superscript handling below (disjoint character classes, so
  // order between the two doesn't matter, but keeping ASCII-operator rules
  // together mirrors the existing equals-sign placement).
  t = rewriteBareMinusForSpeech(t);
  // Unicode sub/superscript digits: Cartesia mangles them ("T₁" was
  // voiced roughly as "T-jash"). Speak the plain digit ("T 1").
  const SUBSCRIPT_DIGITS: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  };
  t = t.replace(/[₀-₉]/g, (ch) => ` ${SUBSCRIPT_DIGITS[ch] ?? ch}`);
  // Unicode superscript digits (Task Y3, live bug: "a²" voiced as "a
  // square"/"a two" — X1's exponent handling only covered the CARET form
  // ("x^2"), never the unicode glyph outside a $-gated span). Reuses
  // spokenExponent (defined above for caret exponents) so "squared"/"cubed"
  // vs "to the N" stays a SINGLE source of truth between the two notations.
  // Runs at the character level: a MAXIMAL RUN of superscript digits is
  // resolved to one number first ("¹²" -> "12"), THEN spokenExponent decides
  // squared/cubed/"to the N" — so a run only reads as "squared"/"cubed" when
  // it's the single digit ²/³ in isolation; "x¹²" (a 2-digit run that
  // happens to contain the digit shape for 2) correctly reads "to the 12",
  // never "to the 1 squared" or digit-by-digit.
  //
  // Y3 REVIEW FIX (Important): a footnoted excerpt ("document¹", "citizens²"
  // — common in history/lit passages) was misread as an exponent
  // ("document to the 1", "citizens squared"). Gated on the PRECEDING
  // character's shape, mirroring the bare-minus operand-shape gate below:
  // only convert when the character immediately before the superscript run
  // is a digit ("5²"), a single-letter variable standalone token ("x²",
  // "m²" — "m" here is a unit, e.g. square meters, so converting IS the
  // correct reading), or a closing paren/bracket ("(x+1)²"). A superscript
  // directly after a MULTI-LETTER word (the preceding character is a letter
  // that is itself preceded by another letter, i.e. not a standalone
  // single-letter token) is left untouched — the footnote-marker shape.
  const SUPERSCRIPT_DIGIT_MAP: Record<string, string> = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  };
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (run: string, offset: number, full: string) => {
    const prev = full.charAt(offset - 1);
    const prevPrev = full.charAt(offset - 2);
    const precededByDigit = /\d/.test(prev);
    const precededByCloser = prev === ')' || prev === ']';
    const precededBySingleLetterVar = /[A-Za-z]/.test(prev) && !/[A-Za-z]/.test(prevPrev);
    if (!precededByDigit && !precededByCloser && !precededBySingleLetterVar) {
      return run; // footnote marker shape — leave the raw glyph(s) untouched
    }
    const digits = run.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (ch) => SUPERSCRIPT_DIGIT_MAP[ch]);
    return spokenExponent(digits);
  });
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
  // Trailing filler-word comma (Task X1, session portal-236c6e8f): "let's
  // turn it up, then." reads with the same unnatural comma-pause as the
  // vocative case above, but for a short spoken-filler tail instead of a
  // name. Mirrors that rule's shape-match (comma + word + terminator) for
  // a small curated set of common tail-fillers. Deliberately narrow —
  // only fires immediately before a sentence terminator, so mid-sentence
  // uses of these words ("then we simplify", "the right side") are
  // untouched. Case-insensitive so it also catches the vocative-comma
  // rule's blind spot when the filler happens to be capitalized ("Ready,
  // Right?").
  t = t.replace(/,\s+(then|right|okay|alright|yeah)([.!?])/gi, ' $1$2');
  // Collapse repeated whitespace introduced by replacements.
  t = t.replace(/\s+/g, ' ').trim();
  // Stray whitespace directly before terminal punctuation (introduced by
  // e.g. math-verbalization replacements padding their output with a
  // trailing space that then abuts a following "." or "?") reads as an
  // audible extra pause for some TTS voices — collapse it.
  t = t.replace(/\s+([.,!?])/g, '$1');
  return t;
}
