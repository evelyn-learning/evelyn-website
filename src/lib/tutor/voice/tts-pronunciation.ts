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
  // Round-21: callback form for replacements that transform a capture
  // (e.g. \lim_{x\to a} → "the limit as x approaches a of").
  replacement: string | ((substring: string, ...args: string[]) => string);
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
    // Round-24: bare relational glyphs leaked from spans ("$x > 0$" spoke
    // "x 0"). In-span/argument scope only — this function never runs on
    // prose, so HTML-ish angle brackets in ordinary text are unaffected.
    .replace(/</g, ' less than ')
    .replace(/>/g, ' greater than ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** \frac{a}{b} -> "a over b". Looped (not recursive) so nested fractions
 *  resolve inside-out — same approach as board-title's resolveFractions:
 *  the regex only matches a frac whose numerator/denominator are
 *  themselves brace-free, i.e. exactly the innermost one first. */
// Round-21: \dfrac/\tfrac are display/text-size variants of the same
// fraction — the brain uses \dfrac heavily on cards and (post-Rule-3b) in
// speech spans, which previously reached the speaker raw.
const SPEECH_FRAC_RE = /\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/;
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
// Strip one optional layer of braces off a captured limit-bound token
// ("{i=1}" → "i=1", "0" → "0").
const unbrace = (s: string): string => s.replace(/^\{/, '').replace(/\}$/, '');

/** Physics round (2026-07-18): bare Greek GLYPHS get the same spoken words
 *  as their \commands (previously only π had a glyph rule — ω/Ω/Δ/μ etc.
 *  leaked raw to Cartesia in prose and failed the speakable invariant in
 *  spans). Prose-safe: a Greek glyph in English text is always the letter,
 *  never punctuation. μ is the POST-unit-pass fallback: number-anchored
 *  micro-units (5 μC) are consumed by rewriteUnitsForSpeech before this
 *  runs, so a surviving μ is the Greek letter (F = μN → "mu"). Covers both
 *  U+00B5 MICRO SIGN and U+03BC GREEK SMALL LETTER MU. */
const GREEK_GLYPH_WORDS: Array<[string, string]> = [
  ['Ω', 'Omega'], ['ω', 'omega'], ['α', 'alpha'], ['β', 'beta'],
  ['γ', 'gamma'], ['Γ', 'Gamma'], ['δ', 'delta'], ['Δ', 'Delta'],
  ['ε', 'epsilon'], ['θ', 'theta'], ['Θ', 'Theta'], ['λ', 'lambda'],
  ['Λ', 'Lambda'], ['ρ', 'rho'], ['σ', 'sigma'], ['Σ', 'Sigma'],
  ['τ', 'tau'], ['φ', 'phi'], ['Φ', 'Phi'], ['ν', 'nu'], ['η', 'eta'],
  ['ξ', 'xi'], ['ζ', 'zeta'], ['χ', 'chi'], ['ψ', 'psi'], ['ι', 'iota'],
  ['κ', 'kappa'], ['υ', 'upsilon'],
];
const GREEK_GLYPH_RULES: Replacement[] = [
  { pattern: /[μµ]/g, replacement: ' mu ' },
  ...GREEK_GLYPH_WORDS.map(([glyph, word]): Replacement => (
    { pattern: new RegExp(glyph, 'g'), replacement: ` ${word} ` })),
];

const MATH_COMMAND_REPLACEMENTS: Replacement[] = [
  // ── Round-24 math-coverage sweep ──────────────────────────────────
  // Integrals/sums/products: bounds variant FIRST (else the bare rule
  // strands `_0^4` for the subscript/exponent rules to misread as
  // "sub 0 to the 4"). Both the \command and the bare glyph forms.
  // These must also precede `\in\b` — `\int` would otherwise never match.
  { pattern: /(?:\\int|∫)\s*_\s*(\{[^{}]*\}|[^\s{^]+)\s*\^\s*(\{[^{}]*\}|[^\s{]+)/g,
    replacement: (_m: string, lo: string, hi: string) => ` the integral from ${unbrace(lo)} to ${unbrace(hi)} of ` },
  { pattern: /(?:\\int|∫)/g, replacement: ' the integral of ' },
  { pattern: /(?:\\sum|∑)\s*_\s*(\{[^{}]*\}|[^\s{^]+)\s*\^\s*(\{[^{}]*\}|[^\s{]+)/g,
    replacement: (_m: string, lo: string, hi: string) => ` the sum from ${unbrace(lo)} to ${unbrace(hi)} of ` },
  { pattern: /(?:\\sum|∑)/g, replacement: ' the sum of ' },
  { pattern: /(?:\\prod|∏)\s*_\s*(\{[^{}]*\}|[^\s{^]+)\s*\^\s*(\{[^{}]*\}|[^\s{]+)/g,
    replacement: (_m: string, lo: string, hi: string) => ` the product from ${unbrace(lo)} to ${unbrace(hi)} of ` },
  { pattern: /(?:\\prod|∏)/g, replacement: ' the product of ' },
  { pattern: /\\infty(?![a-zA-Z])|∞/g, replacement: ' infinity ' },
  // Round-21: limits. Must run before the generic subscript rule (which
  // would otherwise read \lim_{x\to a} as "lim sub x to a"). The braced
  // subscript is the approach expression; "of" closes the phrase so the
  // following operand reads naturally ("the limit as x approaches 2 of
  // f of x times g of x").
  { pattern: /\\lim_\{([^{}]*)\}/g, replacement: (_m: string, sub: string) => ` the limit as ${sub.replace(/\\to(?![a-zA-Z])/g, ' approaches ')} of ` },
  { pattern: /\\lim\b/g, replacement: ' the limit of ' },
  // Chemistry round (2026-07-17): the equilibrium harpoon has no math
  // meaning — unconditional. Chem-detected $-spans already converted their
  // arrows to "yields" before this set runs; a REMAINING → is math
  // ("approaches") unless it sits between two chemical-formula tokens in
  // prose ("2H₂ + O₂ → 2H₂O"), where it reads "yields".
  { pattern: /\\rightleftharpoons\b|\\leftrightharpoons\b|⇌/g, replacement: ' is in equilibrium with ' },
  { pattern: /\\to(?![a-zA-Z])|\\longrightarrow(?![a-zA-Z])|\\rightarrow(?![a-zA-Z])/g, replacement: ' approaches ' },
  { pattern: /→/g,
    replacement: (m: string, ...rest: unknown[]) => {
      const offset = rest[rest.length - 2] as number;
      const full = rest[rest.length - 1] as string;
      return chemArrowContext(full, offset, m.length) ? ' yields ' : ' approaches ';
    } },
  // Single-letter function application: f(x) → "f of x". Restricted to the
  // conventional function names f/g/h — a leading digit or other letter is
  // multiplication ("2(2)^2", "x(x+3)") and stays untouched.
  { pattern: /\b([fgh])\(([^()]{1,16})\)/g, replacement: '$1 of $2 ' },
  { pattern: /\\quad(?![a-zA-Z])|\\qquad(?![a-zA-Z])/g, replacement: ', ' },
  // Round-22: named functions shed the backslash but KEEP the word (the
  // end-of-span residual sweep would otherwise delete "\sin" wholesale);
  // the prose-level trig pass then converts sin→sine etc. as usual.
  // Round-24: the \b here was wrong — `_` is a word char, so `\log_2`
  // never matched and the residual sweep deleted "\log" wholesale. A
  // negative letter lookahead keeps longest-first alternation semantics.
  { pattern: /\\(arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan|sec|csc|cot|ln|log|exp)(?![a-zA-Z])/g, replacement: ' $1 ' },
  // Round-28 (live 2026-07-18: "$8\neq5$" spoke "8 5"): every letter-run
  // command below uses the round-24 \log_2 lookahead instead of \b — a \b
  // after a letter never matches when a DIGIT follows (q→5 is word→word),
  // so the glued form "\neq5" missed the rule and the residual sweep
  // deleted the relation from speech entirely.
  { pattern: /\\times(?![a-zA-Z])/g, replacement: ' times ' },
  { pattern: /\\cdot(?![a-zA-Z])/g, replacement: ' times ' },
  { pattern: /\\div(?![a-zA-Z])/g, replacement: ' divided by ' },
  { pattern: /\\pm(?![a-zA-Z])/g, replacement: ' plus or minus ' },
  { pattern: /\\leq(?![a-zA-Z])/g, replacement: ' less than or equal to ' },
  { pattern: /\\geq(?![a-zA-Z])/g, replacement: ' greater than or equal to ' },
  { pattern: /\\neq(?![a-zA-Z])/g, replacement: ' not equal to ' },
  { pattern: /\\approx(?![a-zA-Z])/g, replacement: ' approximately ' },
  // ── Round-24: short relation forms, geometry, sets, decorations ───
  { pattern: /\\le(?![a-zA-Z])/g, replacement: ' less than or equal to ' },
  { pattern: /\\ge(?![a-zA-Z])/g, replacement: ' greater than or equal to ' },
  { pattern: /\\ne(?![a-zA-Z])/g, replacement: ' not equal to ' },
  { pattern: /\\cong(?![a-zA-Z])|≅/g, replacement: ' is congruent to ' },
  { pattern: /\\sim(?![a-zA-Z])/g, replacement: ' is similar to ' },
  { pattern: /\\perp(?![a-zA-Z])|⊥/g, replacement: ' is perpendicular to ' },
  { pattern: /\\parallel(?![a-zA-Z])|∥/g, replacement: ' is parallel to ' },
  { pattern: /\\triangle(?![a-zA-Z])|△/g, replacement: ' triangle ' },
  { pattern: /\\angle(?![a-zA-Z])|∠/g, replacement: ' angle ' },
  { pattern: /\\in(?![a-zA-Z])|∈/g, replacement: ' is in ' },
  { pattern: /\\cup(?![a-zA-Z])|∪/g, replacement: ' union ' },
  { pattern: /\\cap(?![a-zA-Z])|∩/g, replacement: ' intersect ' },
  { pattern: /\\subseteq(?![a-zA-Z])|\\subset(?![a-zA-Z])|⊆|⊂/g, replacement: ' is a subset of ' },
  { pattern: /\\emptyset(?![a-zA-Z])|\\varnothing(?![a-zA-Z])|∅/g, replacement: ' the empty set ' },
  { pattern: /\\implies(?![a-zA-Z])|\\Rightarrow(?![a-zA-Z])|⇒/g, replacement: ' implies ' },
  { pattern: /\\iff(?![a-zA-Z])/g, replacement: ' if and only if ' },
  { pattern: /\\binom\{([^{}]+)\}\{([^{}]+)\}/g, replacement: '$1 choose $2 ' },
  { pattern: /\\bar\{([^{}]{1,8})\}/g, replacement: ' $1 bar ' },
  { pattern: /\\hat\{([^{}]{1,8})\}/g, replacement: ' $1 hat ' },
  { pattern: /\\vec\{([^{}]{1,8})\}/g, replacement: ' vector $1 ' },
  // Physics round: brace-less decoration forms (\vec F, \hat i) — the brain
  // writes both. Without a rule the in-span product splitter shreds the
  // command name into letters ("\vec F" spoke as "e c F": the splitter
  // split "vec", then the residual sweep ate the orphaned "\v").
  { pattern: /\\vec\s+([A-Za-z])(?![A-Za-z])/g, replacement: ' vector $1 ' },
  { pattern: /\\hat\s+([A-Za-z])(?![A-Za-z])/g, replacement: ' $1 hat ' },
  // ℏ — reduced Planck constant. Without a rule the in-span residual sweep
  // deleted it from speech entirely (the round-24 \theta deletion class).
  { pattern: /\\hbar(?![a-zA-Z])/g, replacement: ' h bar ' },
  // 0.\overline{3} is a repeating decimal; any other overline is a bar.
  { pattern: /\.\\overline\{(\d+)\}/g, replacement: '.$1 repeating ' },
  { pattern: /\\overline\{([^{}]{1,12})\}/g, replacement: ' $1 bar ' },
  { pattern: /\\(text|mathrm|mathbf|textbf)\{([^{}]*)\}/g, replacement: ' $2 ' },
  // Chemistry round: a thermodynamic standard-state mark on H/G/S/E is
  // spoken "naught" ("ΔH°" → "Delta H naught"), never "degrees". Must
  // precede the generic ^\circ rule.
  { pattern: /([HGSE])\^(?:\{\\circ\}|\\circ)/g, replacement: '$1 naught ' },
  // Braces matched as a unit (physics stress sweep: the old optional \}?
  // ate the CLOSING brace of an enclosing F_{...} group when the span held
  // an unbraced "^\circ}" — the round-24 one-sided-limit lesson again).
  { pattern: /\^(?:\{\\circ\}|\\circ)/g, replacement: ' degrees ' },
  // Greek commands → bare words. The FULL alphabet must live HERE, not
  // only in the prose pass: the in-span residual sweep deletes any
  // \command still unconverted when the span is cleaned, so "\theta"
  // relying on the prose rule spoke as nothing ("tangent ()", round-24).
  // "pi" survives the in-span product-split (SPAN_PRODUCT_EXCLUDE) and
  // the prose pass turns it into "pie" as usual. Longest names first.
  // Physics round: the \var* variants strip their "var" prefix — they're
  // typographic variants of the same letter ("\varepsilon" previously
  // spoke as the non-word "varepsilon").
  { pattern: /\\(varepsilon|vartheta|varphi|upsilon|Upsilon|epsilon|lambda|Lambda|omega|Omega|sigma|Sigma|gamma|Gamma|theta|Theta|kappa|alpha|delta|Delta|beta|iota|zeta|eta|rho|tau|chi|psi|phi|Phi|Psi|pi|nu|xi|Xi|mu)(?![a-zA-Z])/g,
    replacement: (_m: string, name: string) => ` ${name.replace(/^var/, '')} ` },
  // Thin-space and spacing macros (backslash-punctuation escapes the
  // letter-only residual sweep and spoke as a literal backslash).
  { pattern: /\\[,;!:]/g, replacement: ' ' },
  { pattern: /(?:\\partial|∂)\s*([a-zA-Z])\s*\/\s*(?:\\partial|∂)\s*([a-zA-Z])/g, replacement: ' partial $1 over partial $2 ' },
  { pattern: /\\partial(?![a-zA-Z])|∂/g, replacement: ' partial ' },
  // Conditional probability — must claim P(A|B) before anything else sees
  // the pipe (the in-span absolute-value rule requires a pipe PAIR, so a
  // single conditional bar never matches it).
  { pattern: /\bP\(\s*([^|()]{1,12})\s*\|\s*([^()]{1,12})\s*\)/g, replacement: ' the probability of $1 given $2 ' },
  // Bare math glyphs (prose-safe: these are never punctuation).
  { pattern: /×/g, replacement: ' times ' },
  { pattern: /·/g, replacement: ' times ' },
  { pattern: /÷/g, replacement: ' divided by ' },
  { pattern: /π/g, replacement: ' pie ' },
  ...GREEK_GLYPH_RULES,
  // Unit-vector glyphs: precomposed î/ĵ and any letter carrying a
  // combining circumflex (k̂, x̂ have no precomposed forms).
  { pattern: /î/g, replacement: ' i hat ' },
  { pattern: /ĵ/g, replacement: ' j hat ' },
  { pattern: /([A-Za-z])̂/g, replacement: ' $1 hat ' },
  // Combining macron (subject-notation round): x̄ / ȳ — the statistics
  // sample-mean glyph, sibling of the circumflex above. The physics round
  // handled the circumflex (p̂ → "p hat") but not the macron, so x̄ leaked
  // its raw glyph. Both precomposed (ā) and base+U+0304 forms.
  { pattern: /([A-Za-z])̄/g, replacement: ' $1 bar ' },
  { pattern: /√\s*\(([^()]{1,24})\)/g, replacement: ' the square root of ($1) ' },
  { pattern: /√\s*([0-9]+(?:\.[0-9]+)?|[a-zA-Z])/g, replacement: ' the square root of $1 ' },
  { pattern: /\\(left|right|big[lmr]?|Big[lmr]?|bigg[lmr]?|Bigg[lmr]?)\b/g, replacement: '' },
  { pattern: /\\[()]/g, replacement: ' ' },
];
function verbalizeMathCommandsForSpeech(t: string): string {
  for (const { pattern, replacement } of MATH_COMMAND_REPLACEMENTS) {
    t = typeof replacement === 'string'
      ? t.replace(pattern, replacement)
      : t.replace(pattern, replacement);
  }
  // Round-24: composition. One pass converts the innermost application
  // only — f(g(2)) leaves "f(g of 2 )" because the outer arg contained
  // parens at match time. Re-run until stable (bounded by nesting depth).
  let prev: string;
  do {
    prev = t;
    t = t.replace(/\b([fgh])\(([^()]{1,24})\)/g, '$1 of $2 ');
  } while (t !== prev);
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

/** _{n+1} / _1 / _i -> "sub …". Same braced-first ordering as exponents.
 *  The braced rule LOOPS so nested subscripts (F_{F_{\Delta x}}, physics
 *  stress sweep) resolve inside-out — a single pass left the outer "_{"
 *  stranded as residue once the inner braces were consumed. */
function verbalizeSubscriptsForSpeech(t: string): string {
  let prev: string;
  do {
    prev = t;
    t = t.replace(/_\{([^{}]+)\}/g, (_m, sub: string) => ` sub ${wordifyMathOperators(sub)} `);
  } while (t !== prev);
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
  // Physics round: the whole sequence loops to a fixpoint (bounded) so
  // structures nested ACROSS pass types resolve inside-out — e.g. a
  // fraction inside a braced subscript (F_{\frac{a}{t}}) only becomes
  // brace-free after the subscript pass exposes it, which is too late for
  // the single fraction pass that already ran. Each pass is idempotent on
  // its own output, so a stable string exits immediately.
  for (let i = 0; i < 5; i++) {
    const prev = t;
    t = resolveFractionsForSpeech(t);
    t = resolveSqrtForSpeech(t);
    t = verbalizeMathCommandsForSpeech(t);
    t = verbalizeExponentsForSpeech(t);
    t = verbalizeSubscriptsForSpeech(t);
    if (t === prev) break;
  }
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
// Round-22: in-span words that must NEVER be split as variable products —
// function names, spoken-form tokens the verbalizers emit, and connective
// words that legitimately appear inside spans.
// Physics round: 'at' is deliberately NOT in this set anymore — inside a
// declared span "at" is the kinematic product a·t (v = v₀ + at → "ay t"),
// the single most common physics equation tail. Accepted tradeoff: a rare
// \text{…at…} prose fragment inside a span respells its "at".
const SPAN_PRODUCT_EXCLUDE = new Set([
  'of', 'to', 'the', 'as', 'is', 'in', 'or', 'and', 'for', 'over',
  'plus', 'minus', 'times', 'equals', 'squared', 'cubed', 'root', 'limit',
  'approaches', 'sub', 'not', 'equal', 'than', 'less', 'greater', 'why',
  'bee', 'ay', 'dee', 'ex', 'pi', 'ln', 'log', 'sin', 'cos', 'tan', 'sec',
  'csc', 'cot', 'sine', 'cosine', 'tangent', 'exp', 'lim', 'dx', 'dy',
  'dt', 'du', 'dv', 'max', 'min', 'mod', 'abs', 'deg', 'degrees',
  // Round-24: words the new verbalizer rules emit into spans — none may
  // be split as variable products.
  'sum', 'bar', 'hat', 'set', 'rho', 'tau', 'eta', 'chi', 'psi', 'nu',
  'xi', 'pie',
  // Round-25 (live: du → "dee why o u", $x-\mu$ → "m u"): every word
  // VAR_SPOKEN can emit (rewriteDerivatives runs BEFORE this splitter)
  // plus the short Greek names the base prose set owns — all of them
  // re-enter this splitter and must never be shredded into letters.
  'you', 'see', 'ee', 'ef', 'jee', 'kay', 'em', 'en', 'pee', 'cue', 'ar',
  'ess', 'tee', 'vee', 'zee', 'mu', 'phi',
  // Physics round: unit vocabulary + words the unit pass emits — none may
  // be shredded into letter names ("kg" spoke as "k g" pre-round).
  'per', 'ohm', 'amp', 'kg', 'mg', 'km', 'cm', 'mm', 'nm', 'ms', 'ns',
  'mol', 'rad', 'amu', 'atm',
  // Chemistry round: words the chem rewrites emit into spans. NOT 'sp' or
  // 'eq' — those are K-constant subscripts the splitter SHOULD spell out.
  // el/oh/eye/jay are SPOKEN_ELEMENT_LETTERS outputs (the rest of that
  // map's words are already here from round-25).
  'gas', 'aq', 'dot', 'ion', 'ppm', 'el', 'oh', 'eye', 'jay',
  // Subject-notation round: the genotype respell emits "big"/"little" (and
  // "star" from the critical-value rule) into spans — never split them.
  'big', 'star',
]);
// Phase-3 live round: letter runs that must stay glued to a PRECEDING
// DIGIT specifically — ordinal suffixes, meridiems, and imperial/time
// units not in the span vocabulary. Separate from SPAN_PRODUCT_EXCLUDE:
// a standalone "th" inside a span should still split, but "4th" never.
const DIGIT_RUN_EXCLUDE = new Set([
  'th', 'st', 'nd', 'rd', 'am', 'pm', 'oz', 'lb', 'lbs', 'ft', 'yd',
  'mi', 'hr', 'hrs',
  // Units/rates the span vocabulary doesn't carry — the prose digit-run
  // splitter (see rewriteForTTS) sees raw text where any of these can be
  // digit-glued ("70mph", "500ml", "8gb"). Never letter-split them.
  'ml', 'kl', 'dl', 'gal', 'mph', 'kph', 'rpm', 'mpg', 'psi', 'bpm',
  'dpi', 'fps', 'ghz', 'mhz', 'khz', 'gb', 'mb', 'kb', 'tb', 'kwh',
]);
function respellMathLetters(s: string): string {
  // Phase-3 live round (2026-07-23, SAT session: "b^2 - 4ac" spoke "4ac"
  // as in "four-ack"): a COEFFICIENT-PREFIXED product ("4ac", "2ab") never
  // hit the round-22 splitter below — between a digit and a letter there
  // is no \b, so the letters aren't a standalone token. Split the letter
  // run off the coefficient first ("4ac" → "4 a c") so the single-letter
  // respells apply. Ordinals ("4th"), meridiems ("10am") and the shared
  // exclude vocabulary (units like kg/cm, function names) stay glued.
  s = s.replace(/\b(\d+)([a-z]{2,3})\b/g, (m: string, num: string, run: string) =>
    DIGIT_RUN_EXCLUDE.has(run) || SPAN_PRODUCT_EXCLUDE.has(run)
      ? m
      : `${num} ${run.split('').join(' ')}`);
  // Round-22 (live: "$…(a^2+ab+b^2)$" spoke "ab" as in "cab"): a 2-3
  // letter lowercase token inside a DECLARED span is a variable PRODUCT
  // ("ab", "xy") unless it's a known word/function — split into letters
  // so each respells below ("ay bee", "x why").
  s = s.replace(/\b([a-z]{2,3})\b/g, (m: string) =>
    SPAN_PRODUCT_EXCLUDE.has(m) ? m : m.split('').join(' '));
  return s
    .replace(/\b[aA]\b/g, 'ay')
    .replace(/\b[bB]\b/g, 'bee')
    .replace(/\b[yY]\b/g, 'why')
    .replace(/\bd\b/g, 'dee')
    // Round-28 (live: "$m = 7$" heard as "meter equals 7"): Cartesia
    // normalizes a bare standalone "m" to "meter". Units have already
    // converted ("5 m" → "5 meters", "m/s" → compound) before this
    // respell runs, so a surviving standalone lowercase m in a declared
    // span is the variable. Capital M stays (molar / labels).
    .replace(/\bm\b/g, 'em');
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
/** Round-23: primes and function inverses, IN-SPAN ONLY. The apostrophe in
 *  f'(x) breaks the [fgh]( function-application match, so the span reached
 *  Cartesia raw ("fe"/"fef"); f^{-1} fell to the general exponent rule and
 *  spoke "f to the minus 1" instead of "f inverse". These shapes must NOT
 *  join MATH_COMMAND_REPLACEMENTS: that set also runs on full prose (see
 *  rewriteForTTS), where an apostrophe rule would shred contractions.
 *  Order inside-out: inverse first, so the nested transcript shape
 *  f'(f^{-1}(2)) resolves its argument before the prime-with-argument rule
 *  measures it; double prime before single so f'' never half-matches.
 *  Non-function bases (x^{-1}) deliberately keep "to the minus 1". */
/** Genetics allele notation, applied to a NON-chem span's raw text before
 *  the shared verbalizer runs. Kept off the chemistry path: that path
 *  spells element runs into letter-name words ("Fe" → "ef ee"), and "ee"
 *  would otherwise re-match as a homozygous genotype. Runs before the
 *  exponent pass so sex-linked allele superscripts aren't read as powers. */
function rewriteGeneticsInSpan(t: string): string {
  // Sex-linked: X/Y carry an allele on the chromosome, not an exponent.
  t = t.replace(/([XY])\^\{?([A-Za-z])\}?/g, (_m, chrom: string, allele: string) =>
    ` ${chrom} ${spokenAllele(allele)} `);
  // Genotype tokens respell with case spoken (see isGenotypeToken) — ahead
  // of respellMathLetters, which only splits all-lowercase runs and would
  // drop the case that IS the meaning.
  t = t.replace(/\b([A-Za-z]{2,8})\b/g, (m: string) =>
    isGenotypeToken(m) ? ` ${speakGenotype(m)} ` : m);
  return t;
}

function rewritePrimesForSpeech(t: string): string {
  t = t.replace(/\\(sin|cos|tan)\^(?:\{-1\}|-1(?!\d))/g, '\\arc$1');
  t = t.replace(/\b([fgh])\^(?:\{-1\}|-1(?!\d))\(([^()]{1,16})\)/g, '$1 inverse of $2 ');
  t = t.replace(/\b([fgh])\^(?:\{-1\}|-1(?!\d))/g, ' $1 inverse ');
  // Longest prime run first — a shorter rule matching the head of a longer
  // run strands the leftover apostrophes as residue (round-24 stress sweep
  // caught f''' emitting "f double prime '").
  t = t.replace(/\b([a-zA-Z])''''\(([^()]{1,24})\)/g, '$1 fourth derivative of $2 ');
  t = t.replace(/\b([a-zA-Z])''''(?![a-zA-Z'])/g, ' $1 fourth derivative ');
  t = t.replace(/\b([a-zA-Z])'''\(([^()]{1,24})\)/g, '$1 triple prime of $2 ');
  t = t.replace(/\b([a-zA-Z])'''(?![a-zA-Z'])/g, ' $1 triple prime ');
  t = t.replace(/\b([a-zA-Z])''\(([^()]{1,24})\)/g, '$1 double prime of $2 ');
  t = t.replace(/\b([a-zA-Z])''(?![a-zA-Z'])/g, ' $1 double prime ');
  t = t.replace(/\b([a-zA-Z])'\(([^()]{1,24})\)/g, '$1 prime of $2 ');
  t = t.replace(/\b([a-zA-Z])'(?![a-zA-Z'])/g, ' $1 prime ');
  // ── Round-24 in-span notation (kept OUT of MATH_COMMAND_REPLACEMENTS,
  // which also runs on prose where pipes/colons/bangs are punctuation) ──
  // Absolute value. P(A|B) has a single pipe so the pair rule skips it
  // (the probability rule in the commands set claims it instead). Looped:
  // nested pipes ("$||x||$", "|" around an already-expanded inner) need a
  // second pass, and prior expansions can push the inner past a small cap.
  // Physics round: |\vec{v}| is a MAGNITUDE, not an absolute value — claim
  // the vector-pipe shape before the generic pair rule below sees it.
  t = t.replace(/\|\s*\\vec\{?([A-Za-z])\}?\s*\|/g, ' the magnitude of vector $1 ');
  let prevAbs: string;
  do {
    prevAbs = t;
    t = t.replace(/\|([^|]{1,160})\|/g, ' the absolute value of $1 ');
  } while (t !== prevAbs);
  // Starred critical values (subject-notation round): "z^*"/"t^*"/"A^*"
  // (statistics critical values, conjugates) speak "star". Before the
  // one-sided-limit markers so "^*" isn't mistaken for a sign, and before
  // the exponent pass which would strand the bare "*".
  t = t.replace(/\^\{\*\}/g, ' star ');
  t = t.replace(/\^\*/g, ' star ');
  // One-sided limit approach markers: 2^+ / 2^- / 2^{+}. The optional
  // brace pair is matched as a unit so a \lim_{...}'s closing brace is
  // never consumed; a digit after ^- is a negative exponent, not a side.
  t = t.replace(/\^(?:\{\+\}|\+)(?=[\s)\]},]|$)/g, ' from the right ');
  t = t.replace(/\^(?:\{-\}|-)(?=[\s)\]},]|$)/g, ' from the left ');
  // Ratios. In-span only — prose colons are clock times. Chained so a
  // multi-part phenotype ratio ("9:3:3:1", subject-notation round) reads
  // fully, not just the first pair — each colon between digits becomes
  // "to" ("9 to 3 to 3 to 1"); the 2-part case ("3:1") is unchanged.
  t = t.replace(/(\d)\s*:\s*(?=\d)/g, '$1 to ');
  // Interval notation — only when a square bracket marks it as an interval;
  // a plain paren pair "(3, -4)" is a coordinate point and reads fine as-is.
  // The comma must not be a LaTeX thin-space's ("\,") — chem round: that
  // misread "$[O_2 \, \text{M}]$" as an interval and stranded the backslash.
  t = t.replace(/\[\s*([^,()[\]|]{1,10})\s*(?<!\\),\s*([^,()[\]|]{1,10})\s*[\])]/g, ' the interval from $1 to $2 ');
  t = t.replace(/\(\s*([^,()[\]|]{1,10})\s*(?<!\\),\s*([^,()[\]|]{1,10})\s*\]/g, ' the interval from $1 to $2 ');
  // Combinatorics shorthand 10C3 and factorials — span-only (prose "10C"
  // is a temperature, "!" an exclamation).
  t = t.replace(/\b(\d{1,3}|[a-z])C(\d{1,3}|[a-z])\b/g, '$1 choose $2');
  t = t.replace(/(\d+|\b[a-zA-Z])!/g, '$1 factorial ');
  return t;
}
/** ---------------------------------------------------------------------
 *  Physics units → spoken words (physics-coverage round, 2026-07-18).
 *
 *  Cartesia reads unit symbols unreliably ("kg", "Hz", "Ω") and the
 *  in-span product splitter used to shred them into letter names
 *  ("kg" → "k g"). Expansion is NUMBER-ANCHORED ("5 kg" → "5 kilograms")
 *  so bare variables never convert; COMPOUND units (m/s, m/s², km/h,
 *  N·m) are shape-unambiguous and expand unconditionally. Single letters
 *  that are common in prose (s, A, C, K, T, F) expand only inside $-spans
 *  (spanMode), where a declared-math context removes the ambiguity —
 *  same reasoning as the round-20 in-span letter respell. Bare prose
 *  "300 K" stays untouched (vitamin K / "$5K" precedent in
 *  rewriteDomainAcronyms). Accepted, documented tradeoffs: "9 g" always
 *  reads grams (never g-force); a genuine prose "5 N" (e.g. a route
 *  number) reads newtons.
 * ----------------------------------------------------------------- */
// A number token, optionally carrying a caret exponent ("10^{-19} C") or
// made of unicode superscripts ("10⁻³⁴ J" — the run after "10"). The
// lookbehinds stop mid-number matches: "x^2 kg" must not anchor on the
// exponent's 2, and a superscript run anchors at its own start.
const UNIT_NUM_SRC = String.raw`(?:(?<![\d,.^_{])\d[\d,]*(?:\.\d+)?(?:\s*\^\s*(?:\{-?\d+\}|-?\d+))?|(?<![⁰¹²³⁴⁵⁶⁷⁸⁹])[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)`;
// Whitespace / LaTeX thin-space / non-breaking tie between number and unit.
const UNIT_SEP_SRC = String.raw`(?:\s|\\[,;:!]|\\ |~)*`;
interface UnitRule { src: string; plural: string; singular: string; spanOnly?: boolean }
const SINGLE_UNIT_RULES: UnitRule[] = [
  // Prefixed forms first (longest match wins over their base unit).
  { src: '[μµ]C', plural: 'microcoulombs', singular: 'microcoulomb' },
  { src: 'nC', plural: 'nanocoulombs', singular: 'nanocoulomb' },
  { src: 'pC', plural: 'picocoulombs', singular: 'picocoulomb' },
  { src: '[μµ]F', plural: 'microfarads', singular: 'microfarad' },
  { src: 'nF', plural: 'nanofarads', singular: 'nanofarad' },
  { src: 'pF', plural: 'picofarads', singular: 'picofarad' },
  { src: '[μµ]s', plural: 'microseconds', singular: 'microsecond' },
  { src: 'ns', plural: 'nanoseconds', singular: 'nanosecond' },
  { src: 'ms', plural: 'milliseconds', singular: 'millisecond' },
  { src: '[μµ]m', plural: 'micrometers', singular: 'micrometer' },
  { src: 'nm', plural: 'nanometers', singular: 'nanometer' },
  { src: 'mm', plural: 'millimeters', singular: 'millimeter' },
  { src: 'cm', plural: 'centimeters', singular: 'centimeter' },
  { src: 'km', plural: 'kilometers', singular: 'kilometer' },
  { src: '[μµ]A', plural: 'microamps', singular: 'microamp' },
  { src: 'mA', plural: 'milliamps', singular: 'milliamp' },
  { src: 'mV', plural: 'millivolts', singular: 'millivolt' },
  { src: 'kV', plural: 'kilovolts', singular: 'kilovolt' },
  { src: 'kΩ', plural: 'kilohms', singular: 'kilohm' },
  { src: 'MΩ', plural: 'megohms', singular: 'megohm' },
  { src: 'GHz', plural: 'gigahertz', singular: 'gigahertz' },
  { src: 'MHz', plural: 'megahertz', singular: 'megahertz' },
  { src: 'kHz', plural: 'kilohertz', singular: 'kilohertz' },
  { src: 'Hz', plural: 'hertz', singular: 'hertz' },
  { src: 'GeV', plural: 'giga electron volts', singular: 'giga electron volt' },
  { src: 'MeV', plural: 'mega electron volts', singular: 'mega electron volt' },
  { src: 'keV', plural: 'kilo electron volts', singular: 'kilo electron volt' },
  { src: 'eV', plural: 'electron volts', singular: 'electron volt' },
  { src: 'kN', plural: 'kilonewtons', singular: 'kilonewton' },
  { src: 'kJ', plural: 'kilojoules', singular: 'kilojoule' },
  { src: 'MJ', plural: 'megajoules', singular: 'megajoule' },
  { src: 'kW', plural: 'kilowatts', singular: 'kilowatt' },
  { src: 'MW', plural: 'megawatts', singular: 'megawatt' },
  { src: 'kPa', plural: 'kilopascals', singular: 'kilopascal' },
  { src: 'MPa', plural: 'megapascals', singular: 'megapascal' },
  { src: 'Pa', plural: 'pascals', singular: 'pascal' },
  { src: 'kg', plural: 'kilograms', singular: 'kilogram' },
  { src: 'mg', plural: 'milligrams', singular: 'milligram' },
  { src: 'mol', plural: 'moles', singular: 'mole' },
  { src: 'rad', plural: 'radians', singular: 'radian' },
  { src: 'amu', plural: 'atomic mass units', singular: 'atomic mass unit' },
  { src: 'atm', plural: 'atmospheres', singular: 'atmosphere' },
  // Chemistry round (2026-07-17): unambiguous chem units expand everywhere
  // the physics rules do. mmHg/mmol never collide with the bare mm rule —
  // its trailing guard rejects the following letter.
  { src: 'mmHg', plural: 'millimeters of mercury', singular: 'millimeter of mercury' },
  { src: 'mmol', plural: 'millimoles', singular: 'millimole' },
  { src: 'mL', plural: 'milliliters', singular: 'milliliter' },
  { src: 'ppm', plural: 'parts per million', singular: 'part per million' },
  // Glyph + command forms of ohm (the span sees raw \Omega).
  { src: 'Ω|\\\\Omega\\b', plural: 'ohms', singular: 'ohm' },
  { src: 'N', plural: 'newtons', singular: 'newton' },
  { src: 'J', plural: 'joules', singular: 'joule' },
  { src: 'W', plural: 'watts', singular: 'watt' },
  { src: 'V', plural: 'volts', singular: 'volt' },
  { src: 'm', plural: 'meters', singular: 'meter' },
  { src: 'g', plural: 'grams', singular: 'gram' },
  // Prose-ambiguous single letters: $-span only.
  { src: 's', plural: 'seconds', singular: 'second', spanOnly: true },
  { src: 'A', plural: 'amps', singular: 'amp', spanOnly: true },
  { src: 'C', plural: 'coulombs', singular: 'coulomb', spanOnly: true },
  { src: 'K', plural: 'kelvin', singular: 'kelvin', spanOnly: true },
  { src: 'T', plural: 'tesla', singular: 'tesla', spanOnly: true },
  { src: 'F', plural: 'farads', singular: 'farad', spanOnly: true },
  // Chemistry round: liters and molarity are prose-ambiguous ("5 L" could
  // be a label, bare "0.5 M" reads as an initial/million) — span-only,
  // same tier as s/A/C/K/T/F. M sits LAST so every M-prefixed unit above
  // (MΩ, MHz, MPa, MeV, MJ, MW) wins first.
  { src: 'L', plural: 'liters', singular: 'liter', spanOnly: true },
  { src: 'M', plural: 'molar', singular: 'molar', spanOnly: true },
];
const SINGLE_UNIT_COMPILED = SINGLE_UNIT_RULES.map((u) => ({
  ...u,
  // Trailing guard excludes digits too: a unit letter directly followed by
  // a digit is notation, not a unit — "$10C3$" is nCr shorthand ("10
  // choose 3"), which the span-only coulomb rule must never claim.
  re: new RegExp(`(${UNIT_NUM_SRC})(?:${UNIT_SEP_SRC})(?:${u.src})(?![A-Za-z0-9])`, 'g'),
  // \text{kg}/\mathrm{K} with an optional preceding number. A \text-wrapped
  // unit inside a span is an EXPLICIT unit annotation, so it converts even
  // number-less ((x)_0 \, \text{kg} → "… sub 0 kilograms") — leaving it raw
  // broke T4 idempotence: the spoken "sub 0 kg" re-matched as "0 kg".
  textRe: new RegExp(`(?:(${UNIT_NUM_SRC})(?:${UNIT_SEP_SRC}))?\\\\(?:text|mathrm)\\{\\s*(?:${u.src})\\s*\\}`, 'g'),
}));
const COMPOUND_UNIT_RULES: Array<{ re: RegExp; spoken: string }> = [
  // Brace pair matched as a unit — "^2}" inside an enclosing braced group
  // must not have its foreign "}" consumed.
  { re: /(?<![A-Za-z])m\/s\s*(?:²|\^\{2\}|\^2)(?![A-Za-z])/g, spoken: ' meters per second squared ' },
  { re: /(?<![A-Za-z])m\/s(?![A-Za-z0-9])/g, spoken: ' meters per second ' },
  { re: /(?<![A-Za-z])km\/h(?![A-Za-z])/g, spoken: ' kilometers per hour ' },
  { re: /(?<![A-Za-z])km\/s(?![A-Za-z])/g, spoken: ' kilometers per second ' },
  { re: /(?<![A-Za-z])N\s*(?:·|\\cdot\b)\s*m(?![A-Za-z])/g, spoken: ' newton meters ' },
  // Chemistry round: mol-denominated and density compounds. kJ/mol before
  // J/mol is cosmetic — J/mol's lookbehind already rejects the k.
  { re: /(?<![A-Za-z])kJ\/mol(?![A-Za-z])/g, spoken: ' kilojoules per mole ' },
  { re: /(?<![A-Za-z])J\/mol(?![A-Za-z])/g, spoken: ' joules per mole ' },
  { re: /(?<![A-Za-z])g\/mol(?![A-Za-z])/g, spoken: ' grams per mole ' },
  { re: /(?<![A-Za-z])mol\/L(?![A-Za-z])/g, spoken: ' moles per liter ' },
  { re: /(?<![A-Za-z])g\/mL(?![A-Za-z])/g, spoken: ' grams per milliliter ' },
  { re: /(?<![A-Za-z])g\/cm(?:³|\^\{?3\}?)(?![A-Za-z0-9])/g, spoken: ' grams per cubic centimeter ' },
  { re: /(?<![A-Za-z])kg\/m(?:³|\^\{?3\}?)(?![A-Za-z0-9])/g, spoken: ' kilograms per cubic meter ' },
];
/** Single-letter units that ARE element symbols (or the seconds "s" an
 *  orbital run emits) — inside a chemistry-detected span "2C" is two
 *  carbons, never coulombs, so these singles are suppressed there. */
const CHEM_UNIT_COLLISIONS = new Set(['N', 'C', 'K', 'F', 's']);
function rewriteUnitsForSpeech(t: string, spanMode: boolean, chemMode = false): string {
  if (spanMode) {
    // \text-wrapped single units convert first (see textRe above), THEN
    // remaining \text/\mathrm unwrap so compound units ("\text{m/s}") are
    // visible to the rules below — identical to the strip
    // verbalizeMathCommandsForSpeech performs later, just earlier.
    for (const u of SINGLE_UNIT_COMPILED) {
      if (chemMode && CHEM_UNIT_COLLISIONS.has(u.src)) continue;
      t = t.replace(u.textRe, (_m, num?: string) =>
        num ? `${num} ${num === '1' ? u.singular : u.plural} ` : ` ${u.plural} `);
    }
    t = t.replace(/\\(?:text|mathrm)\{\s*([^{}]*?)\s*\}/g, ' $1 ');
  }
  for (const { re, spoken } of COMPOUND_UNIT_RULES) t = t.replace(re, spoken);
  for (const u of SINGLE_UNIT_COMPILED) {
    if (u.spanOnly && !spanMode) continue;
    if (chemMode && CHEM_UNIT_COLLISIONS.has(u.src)) continue;
    t = t.replace(u.re, (_m, num: string) => `${num} ${num === '1' ? u.singular : u.plural} `);
  }
  return t;
}

/** ---------------------------------------------------------------------
 *  Chemistry notation → spoken words (chem-coverage round, 2026-07-17).
 *
 *  The math pipeline reads chemistry wrong: "H_2O" spoke "H sub 2 O",
 *  \to spoke "approaches" (a reaction YIELDS), Na⁺ ion charges were
 *  deliberately untouched by the physics round, and the in-span splitter
 *  respelled "(aq)" as letters. A $-span that LOOKS like chemistry (see
 *  looksLikeChemistrySpan) routes through rewriteChemistrySpanForSpeech
 *  instead of the plain unit pass; detection misses degrade gracefully —
 *  the math pipeline still produces clean (if "sub"-flavored) speech.
 *  Genuinely ambiguous shapes stay math by design: "$F_2$" alone is
 *  "F sub 2" (force vs fluorine has no signal), "$\text{C}$" alone is
 *  coulombs. \ce{...} (mhchem) is unsupported — KaTeX here has no mhchem
 *  and the residual sweep already degrades it losslessly enough.
 * ----------------------------------------------------------------- */
const ELEMENT_SYMBOLS = new Set([
  'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al',
  'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe',
  'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr',
  'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
  'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm',
  'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W',
  'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn',
  'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf',
  'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds',
  'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og',
]);
/** Two-letter element symbols that are also common English words (via
 *  \text prose inside a span) — never spelled out letter-by-letter. */
const ELEMENT_WORD_COLLISIONS = new Set(['In', 'As', 'At', 'No', 'He', 'Be']);
/** Spoken element names for nuclide notation ("^{14}C" → "carbon 14") —
 *  the isotopes that actually show up in AP/intro chem and physics.
 *  Fallback for anything else: the bare symbol ("Xy 99"). */
const ISOTOPE_ELEMENT_NAMES: Record<string, string> = {
  H: 'hydrogen', He: 'helium', C: 'carbon', N: 'nitrogen', O: 'oxygen',
  F: 'fluorine', Na: 'sodium', P: 'phosphorus', S: 'sulfur', Cl: 'chlorine',
  K: 'potassium', Ca: 'calcium', Fe: 'iron', Co: 'cobalt', Ni: 'nickel',
  Cu: 'copper', Zn: 'zinc', Sr: 'strontium', Tc: 'technetium', I: 'iodine',
  Cs: 'cesium', Ba: 'barium', Pb: 'lead', Po: 'polonium', Rn: 'radon',
  Ra: 'radium', Th: 'thorium', U: 'uranium', Pu: 'plutonium', Am: 'americium',
};
/** True when a capital-letter run parses entirely into element symbols
 *  (greedy two-letter-first with single-letter backtrack). */
function parsesAsElementRun(token: string): boolean {
  let i = 0;
  while (i < token.length) {
    const two = token.slice(i, i + 2);
    if (two.length === 2 && ELEMENT_SYMBOLS.has(two)) { i += 2; continue; }
    if (ELEMENT_SYMBOLS.has(token[i])) { i += 1; continue; }
    return false;
  }
  return token.length > 0;
}

// Nuclide superscript: {}^{14}C / ^{235}U / ^{14}_{6}C, element optionally
// \text-wrapped. The \} is consumed ONLY with its own \text{ (the physics
// "optional \}? ate a foreign closing brace" lesson). The callback rejects
// a match whose ^ rides a preceding digit/brace with no explicit {} base —
// that shape is an exponent ("10^{23}"), not a nuclide.
const NUCLIDE_RE = /(\{\}\s*)?\^\{(\d{1,3})\}(?:_\{\d{1,3}\})?\s*(?:\\text\{([A-Z][a-z]?)\}|([A-Z][a-z]?))/g;
const CHEM_TWO_LETTER_SIGNAL = /(?:^|[^A-Za-z])(?:Na|Cl|Mg|Ca|Fe|Cu|Zn|Ag|Au|Pb|Hg|Al|Si|Br|Li|Ba|Sr|Ni|Mn|Cr|Sn|Kr|Xe|Ne|Ar|Rb|Cs|Ti|Co)(?![a-z])/;
function looksLikeChemistrySpan(inner: string): boolean {
  // Arrows and states are chemistry-only shapes.
  if (/\\rightleftharpoons\b|\\leftrightharpoons\b|⇌|\\xrightarrow\b/.test(inner)) return true;
  if (/[A-Za-z0-9)\]}]\s*\(\s*(?:aq|s|l|g)\s*\)/.test(inner)) return true;
  // Ion charges: a TRAILING sign in a superscript (leading-sign is a
  // negative exponent; digit-based "2^+" is a one-sided limit).
  if (/\^\{\d{0,2}[+-]\}/.test(inner)) return true;
  if (/[A-Za-z)\]]\^[+-](?![\w{])/.test(inner)) return true;
  if (/[A-Za-z0-9][⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁺⁻]/.test(inner)) return true;
  // Nuclide superscripts (digit-preceded ^ is an exponent, not a nuclide).
  if (/(?:^|[^\d}])\^\{\d{1,3}\}(?:_\{\d{1,3}\})?\s*(?:\\text\{)?[A-Z]/.test(inner)) return true;
  if (/\{\}\s*\^\{\d{1,3}\}/.test(inner)) return true;
  // Unambiguous two-letter element symbols (case-sensitive, inside or
  // outside a compound — "NaCl" has no word boundary before "Cl").
  if (CHEM_TWO_LETTER_SIGNAL.test(inner)) return true;
  // Formula shapes: element-subscript chained to another element (H_2O),
  // two capitals + subscript (CO_2, NH_3), coefficient + element +
  // subscript (2H_2). A LONE capital-with-subscript ("$F_2$", "$O_2$")
  // deliberately stays math — force-sub-2 vs fluorine has no signal.
  if (/[A-Z][a-z]?(?:_\{?\d+\}?|[₀-₉]+)(?=\(?[A-Z])/.test(inner)) return true;
  if (/[A-Z]{2}[a-z]?(?:_\{?\d|[₀-₉])/.test(inner)) return true;
  if (/\d[A-Z][a-z]?(?:_\{?\d|[₀-₉])/.test(inner)) return true;
  if (/\\(?:text|mathrm)\{[A-Z][A-Za-z]{0,2}\}(?:_|[₀-₉])/.test(inner)) return true;
  // Named equilibrium constants and concentration brackets. The bracket
  // probe normalizes LaTeX thin-spaces away first — their comma character
  // is not a list comma — then asks for a capital inside a comma-free
  // bracket pair (an interval "[2, 5]" keeps its real comma and is math).
  if (/\bK_(?:\{(?:sp|eq|a|b|w|c|p)\}|[abwcp]\b)/.test(inner)) return true;
  const bracketProbe = inner.replace(/\\[,;:!]/g, ' ');
  if (/\[\s*[^,[\]]*[A-Z][^,[\]]*\]/.test(bracketProbe)) return true;
  // Electron configurations: two or more orbital tokens (a single "3d^5"
  // could be plain algebra).
  if ((inner.match(/\d[spdf](?:\^|[⁰¹²³⁴⁵⁶⁷⁸⁹])/g) ?? []).length >= 2) return true;
  return false;
}

const CHEM_STATE_WORDS: Record<string, string> = { aq: 'aqueous', s: 'solid', l: 'liquid', g: 'gas' };
function rewriteChemistrySpanForSpeech(t: string): string {
  // Nuclides first, before anything reads their superscript as a power.
  t = t.replace(NUCLIDE_RE, (m: string, base: string | undefined, mass: string, sym1: string | undefined, sym2: string | undefined, offset: number, full: string) => {
    const prev = full.charAt(offset - 1);
    if (!base && (/[\d}]/.test(prev))) return m; // exponent shape, not a nuclide
    const sym = (sym1 ?? sym2) as string;
    const name = ISOTOPE_ELEMENT_NAMES[sym] ?? sym;
    return ` ${name} ${mass} `;
  });
  // Orbitals before units — "1s^2" must never anchor the seconds rule.
  t = t.replace(/\b([1-7])([spdf])(?:\^\{?(\d{1,2})\}?|([⁰¹²³⁴⁵⁶⁷⁸⁹]{1,2}))/g,
    (_m, shell: string, sub: string, caret?: string, glyph?: string) => {
      const count = caret ?? (glyph ?? '').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,
        (ch) => String('⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(ch)));
      return ` ${shell} ${sub} ${count} `;
    });
  // Units (chem mode: element-collision singles suppressed) + \text unwrap.
  t = rewriteUnitsForSpeech(t, true, true);
  // Aggregation states — inside a chem-detected span every (aq|s|l|g)
  // paren is a state marker.
  t = t.replace(/\(\s*(aq|s|l|g)\s*\)/g, (_m, st: string) => ` ${CHEM_STATE_WORDS[st]} `);
  // Hydrate dot: CuSO₄·5H₂O reads "dot", not "times".
  t = t.replace(/\\cdot\b|·/g, ' dot ');
  // Ion charges: sign AFTER the digits ("^{2-}", "^+"). A sign BEFORE
  // digits ("10^{-19}") is a negative exponent and falls through to the
  // math pipeline.
  t = t.replace(/\^\{(\d{0,2})\s*([+-])\}/g, (_m, n: string, sign: string) =>
    ` ${n ? `${n} ` : ''}${sign === '+' ? 'plus' : 'minus'} `);
  t = t.replace(/\^(\d{0,2})([+-])(?![\w{])/g, (_m, n: string, sign: string) =>
    ` ${n ? `${n} ` : ''}${sign === '+' ? 'plus' : 'minus'} `);
  // Concentration brackets. Adjacent []-groups are an implied product;
  // the × resolves to "times" in the command pass. Looped so nested
  // groups resolve inside-out.
  t = t.replace(/\]\s*\[/g, '] × [');
  let prevBr: string;
  do {
    prevBr = t;
    t = t.replace(/\[([^[\]]{1,80})\]/g, ' the concentration of $1 ');
  } while (t !== prevBr);
  // Subscripts speak as PLAIN tokens — "H 2 O", "K a", "K sp" (the span
  // splitter then letter-spells sp → "s p"). Nobody says "H sub 2 O".
  t = t.replace(/_\{?(\d{1,3})\}?/g, ' $1 ');
  t = t.replace(/_\{?([A-Za-z]{1,3})\}?/g, ' $1 ');
  // Reaction / equilibrium arrows.
  t = t.replace(/\\xrightarrow\{[^{}]*\}/g, ' yields ');
  t = t.replace(/\\rightleftharpoons\b|\\leftrightharpoons\b|⇌/g, ' is in equilibrium with ');
  t = t.replace(/\\to(?![a-zA-Z])|\\longrightarrow(?![a-zA-Z])|\\rightarrow(?![a-zA-Z])|→/g, ' yields ');
  // Mixed-case element runs spell out with SPOKEN letter names ("NaCl" →
  // "en ay see el") — bare capitals would re-anchor the prose unit pass on
  // the output ("2 N …" → "2 newtons", a T4 idempotence break) and
  // Cartesia reads letter names deterministically. Pure-caps runs (CO,
  // NH, HA) stay joined — Cartesia letter-reads those correctly already,
  // per the round-22 uppercase-token precedent.
  t = t.replace(/\b(\d{0,3})((?:[A-Z][a-z]?)+)\b/g, (m: string, coeff: string, run: string) => {
    if (!/[a-z]/.test(run)) return m;
    if (ELEMENT_WORD_COLLISIONS.has(run)) return m;
    if (!parsesAsElementRun(run)) return m;
    const spelled = run.split('').map((ch) => SPOKEN_ELEMENT_LETTERS[ch.toLowerCase()] ?? ch).join(' ');
    return ` ${coeff ? `${coeff} ` : ''}${spelled} `;
  });
  return t;
}
/** Letter names for spelled-out element runs. VAR_SPOKEN plus the letters
 *  it lacks (h/i/j/l/o/w — element seconds like Al, Ni, Co, Bh need them). */
const SPOKEN_ELEMENT_LETTERS: Record<string, string> = {
  a: 'ay', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'ef', g: 'jee',
  h: 'aitch', i: 'eye', j: 'jay', k: 'kay', l: 'el', m: 'em', n: 'en',
  o: 'oh', p: 'pee', q: 'cue', r: 'ar', s: 'ess', t: 'tee', u: 'you',
  v: 'vee', w: 'double u', x: 'ex', y: 'why', z: 'zee',
};

/** ---------------------------------------------------------------------
 *  Genetics notation → spoken words (subject-notation round, 2026-07-18).
 *  Genotype allele notation is unusual: CASE is the meaning (dominant B vs
 *  recessive b), so a genotype respells with the case spoken aloud —
 *  "Bb" → "big bee little bee" — the way a teacher dictates it. This is
 *  distinct from the round-22 variable-product split ("ab" → "ay bee"),
 *  which drops case because there it carries no meaning.
 * ----------------------------------------------------------------- */
/** A genotype token: letters only, even length, in consecutive same-base
 *  allele pairs (Aa, aa, AaBb). "Ab"/"xy" (distinct-letter products) and
 *  odd-length runs are rejected — they fall to the ordinary letter split. */
function isGenotypeToken(tok: string): boolean {
  if (tok.length < 2 || tok.length % 2 !== 0 || !/^[A-Za-z]+$/.test(tok)) return false;
  for (let i = 0; i < tok.length; i += 2) {
    if (tok[i].toLowerCase() !== tok[i + 1].toLowerCase()) return false;
  }
  return true;
}
/** One allele: "big"/"little" + the spoken letter name ("A" → "big ay"). */
function spokenAllele(ch: string): string {
  const size = ch === ch.toUpperCase() ? 'big' : 'little';
  return `${size} ${SPOKEN_ELEMENT_LETTERS[ch.toLowerCase()] ?? ch.toLowerCase()}`;
}
function speakGenotype(tok: string): string {
  return tok.split('').map(spokenAllele).join(' ');
}

/** Prose reaction arrows: "2H₂ + O₂ → 2H₂O" reads "yields" when BOTH
 *  neighbors of the arrow are chemical-formula tokens and at least one is
 *  unambiguously chemical (subscript, coefficient, charge, state, or a
 *  second capital) — "A → B" (a mapping) keeps "approaches". */
function isChemFormulaToken(tok: string): boolean {
  const clean = tok.replace(/^[([]+|[).,;:!?\]]+$/g, '');
  return /^\(?\d{0,3}(?:[A-Z][a-z]?(?:[₀-₉]|\d)*)+(?:[⁺⁻]|\(\s*(?:aq|s|l|g)\s*\))?\)?$/.test(clean);
}
function isStrongChemToken(tok: string): boolean {
  return /[₀-₉]|\d|[⁺⁻]|\(\s*(?:aq|s|l|g)\s*\)|[A-Z][a-z]?.*[A-Z]/.test(tok);
}
function chemArrowContext(full: string, offset: number, len: number): boolean {
  const prevTok = /(\S+)\s*$/.exec(full.slice(0, offset))?.[1];
  const nextTok = /^\s*(\S+)/.exec(full.slice(offset + len))?.[1];
  if (!prevTok || !nextTok) return false;
  if (!isChemFormulaToken(prevTok) || !isChemFormulaToken(nextTok)) return false;
  return isStrongChemToken(prevTok) || isStrongChemToken(nextTok);
}

function stripDollarMathForSpeech(t: string): string {
  return t.replace(/\$([^$\n]{1,160})\$/g, (whole: string, inner: string) => {
    if (
      CURRENCY_ARTIFACT_RE.test(inner) &&
      PROSE_WORD_RE.test(inner) &&
      !MATH_SIGNAL_RE.test(inner) &&
      !MATH_OPERAND_OP_RE.test(inner)
    ) return whole;
    // Round-21: post-verbalization span cleanup — square brackets are
    // grouping (silent), and any RESIDUAL braces or unknown \commands
    // must never reach the speaker (the raw-"\lim sub x\to ay" class).
    // Chemistry round: chem-looking spans take the chemistry rewrite
    // (which claims arrows/charges/subscripts/brackets before the math
    // passes can misread them) in place of the plain unit pass.
    const prepped = looksLikeChemistrySpan(inner)
      ? rewriteChemistrySpanForSpeech(inner)
      : rewriteUnitsForSpeech(rewriteGeneticsInSpan(inner), true);
    const spoken = respellMathLetters(wordifyMathOperators(verbalizeMathForSpeech(rewritePrimesForSpeech(rewriteDerivatives(prepped)))))
      .replace(/\\[a-zA-Z]+\s*/g, ' ')
      .replace(/[[\]{}]/g, ' ')
      // Round-22: adjacent paren groups are an implied product —
      // "(x+2)(x-2)" spoke as "x plus 2 x minus 2" with no operator.
      .replace(/\)\s*\(/g, ') times (')
      .replace(/\s+/g, ' ')
      .replace(/\s+\)/g, ')')
      .replace(/\(\s+/g, '(')
      .trim();
    return ` ${spoken} `;
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
  // Round-28 (live 2026-07-18: "*a plus b* equals 5" spoke the article —
  // markdown italics, not a $-span, so no span respell applied): 'a'
  // before an operator word is the variable when a math-shaped term
  // follows (single letter, respelled letter word, or digit). "a plus
  // for the team" / "a plus sign" stay articles (multi-letter follower).
  { pattern: /\ba\b(?=\s+(?:plus|minus|times|over)\s+(?:[a-z]\b|bee\b|why\b|dee\b|see\b|\d))/gi, replacement: 'ay' },
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
  // Round-28: standalone prose 'm' behind variable anchors ("Right, m
  // equals 7" was heard as "meter equals 7" — Cartesia's own
  // normalization of a bare m). Prose units ("5 m long") have already
  // converted by the earlier unit pass, so an anchored m here is the
  // variable. Lookbehind guards contractions ("I'm") and dotted
  // abbreviations ("a.m."); lowercase only, same tier as 'a'.
  { pattern: /(?<!['’.])\bm\b(?=\s*(?:=|equals?\b|should\b|must\b|will\s+be\b|is\s+equal\b))/g, replacement: 'em' },
  { pattern: /(?<=\b(?:substitute|solve for|value of|values of|find)\s)m\b(?!['’])/g, replacement: 'em' },
  // Round-29 (live 2026-07-23): prose "F equals m times a" — the m sits
  // AFTER equals, so the rule above misses it and Cartesia reads the bare
  // token as "meter". Two anchors, both variable-only by construction:
  //  - m right after "equals" ("equals m times a", "equals m a"); a unit m
  //    never directly follows the word "equals".
  //  - m right before "times" ("is m times a"), digit-guarded so a measured
  //    "5 m times as long" keeps its unit reading (units with digits have
  //    already converted in the earlier unit pass anyway).
  //  - the compound "equals m a" respells BOTH letters ("em ay") — the
  //    article-guarded 'a' rules can't touch a sentence-final bare a, so
  //    the phrase rule handles it whole (must precede the single-m rule,
  //    which would otherwise consume the m first).
  { pattern: /(?<=\bequals\s+)m\s+a\b(?=[\s.,;!?]|$)/g, replacement: 'em ay' },
  { pattern: /(?<=\bequals\s+)m\b(?!['’.])/g, replacement: 'em' },
  { pattern: /(?<!\d)(?<!\d\s)\bm\b(?=\s+times\b)/g, replacement: 'em' },
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
  // Round-24: \frac{d}{dx}[…] operator form — must resolve before the
  // generic fraction pass turns it into a meaningless "d over dee x".
  t = t.replace(/\\[dt]?frac\{d\}\{d([a-zA-Z])\}/g, ' the derivative with respect to $1 of ');
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
 * Sub-question labels "part A" / "parts (b)" / "question C" — a bare single
 * letter after "part"/"question" that Cartesia voices as the ARTICLE or a
 * schwa ("part uh") rather than the letter NAME (agenda round 4, mock-exam
 * review: "let's do part a" spoke "part /æ/"). Respell the letter to its
 * spoken name: b–h use the file's phonetic idiom ('b'→'bee', 'c'→'see' …),
 * the same the variable-respelling rules rely on (see
 * A_VARIABLE_REPLACEMENTS / LETTER_RESPELLING_REPLACEMENTS and VAR_SPOKEN).
 * The letter 'a' is the exception: its phonetic 'ay' was voiced as the WORD
 * "aye" (agenda round 5), so in this label position it emits the capital
 * GLYPH 'A' instead, which reads as the letter name — see the map below.
 *
 * Gated to a–h, the only letters real exam parts use — i/v/x are excluded so
 * document roman numerals ("Part VI" → rewriteRomanNumerals) and any citation
 * "Part I" keep their own handling, and letters past h stay untouched.
 * Optional surrounding parens are consumed. The \b after the letter plus the
 * required whitespace after "part" mean "partial", "particle", "partake" never
 * match (no space) and neither does a bare "part" with no following letter.
 */
const PART_LETTER_SPOKEN: Record<string, string> = {
  // LIVE FAILURE (agenda round 5, mock-review): the phonetic respelling 'ay'
  // was voiced by Cartesia as "aye" (/aɪ/, the word "aye"), NOT the letter
  // name /eɪ/. In LABEL position ("part A", followed by punctuation or a verb
  // per the PART_LETTER_*_RE gates) the capital GLYPH 'A' reads correctly as
  // the letter name, so 'a' emits 'A' ("part A" / "part A."). Do NOT revert to
  // 'ay'. b–h keep their respellings (those read correctly).
  a: 'A', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'ef', g: 'jee', h: 'aitch',
};
// The trailing (?![a-z]) (case-insensitive under /i) both keeps the letter a
// STANDALONE token ("part apple" never matches) and lets the optional closing
// paren be consumed cleanly — a plain \b after \)? would backtrack the paren
// off and orphan it ("part (b)" → "part bee)").
// Parenthesized labels — "part (a)" — are unambiguous references, rewrite
// unconditionally. Bare b–h can't be English articles, so any non-letter
// continuation is safe. Bare "a" IS the article ("for the most part a
// student sees…", "question a witness" — live round-4 concern), so it only
// rewrites when the continuation reads like a label reference: punctuation,
// dash, end-of-text, or a connective/verb that follows a label, never a
// fresh noun phrase.
const PART_LETTER_PAREN_RE = /\b(parts?|questions?)\s+\(([a-h])\)/gi;
const PART_LETTER_BARE_BH_RE = /\b(parts?|questions?)\s+([b-h])(?![a-z])/gi;
const PART_LETTER_BARE_A_RE =
  /\b(parts?|questions?)\s+(a)(?=\s*[.,;:!?)\]"'—–-]|\s+(?:of|and|or|then|first|next|now|again|here|together|too|asks?|says?|is|are|was|has|wants?|needs?|gives?|shows?|does|did|will|would|should)\b|\s*$)/gi;
function rewritePartLetters(t: string): string {
  const spoken = (_m: string, label: string, letter: string) =>
    `${label} ${PART_LETTER_SPOKEN[letter.toLowerCase()]}`;
  return t
    .replace(PART_LETTER_PAREN_RE, spoken)
    .replace(PART_LETTER_BARE_BH_RE, spoken)
    .replace(PART_LETTER_BARE_A_RE, spoken);
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
  // Chemistry round: the unicode superscript charge signs join the ASCII
  // forms — "Na⁺"/"K⁺" read "sodium"/"potassium" with the charge consumed,
  // same round-15 semantics ("the sodium ion" beats "sodium plus ion").
  t = t.replace(/\bNa[+⁺]/g, 'sodium');
  t = t.replace(/\bNa\b/g, 'sodium');
  t = t.replace(/\bK[+⁺]/g, 'potassium');
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

export interface RewriteForTTSOptions {
  /** The session's student name. When present, ANY comma directly before
   *  the name (whatever its case/quoting) is dropped for speech — the
   *  definitive fix for the vocative-pause class the shape-matched rules
   *  below can only approximate. */
  studentName?: string;
}

export function rewriteForTTS(raw: string, opts?: RewriteForTTSOptions): string {
  let t = raw;
  // Known-name vocative comma (2026-07-19, closes the residual from the
  // 2026-07-11/07-16 shape-matched rules): with the actual student name in
  // hand there is no article/clause ambiguity left — a comma immediately
  // before the name is always the vocative pause Cartesia exaggerates.
  // Case-insensitive, quote-tolerant, fires sentence-finally AND
  // mid-sentence (", baby, let's go"), but ONLY when the name is followed
  // by punctuation or end-of-text — "Yes, will you try?" with a student
  // named Will keeps its clause comma because "will" is followed by a
  // word. Name is regex-escaped; length-capped as a safety valve since
  // names arrive from an unauthenticated field.
  const studentName = opts?.studentName?.trim();
  if (studentName && studentName.length >= 2 && studentName.length <= 40) {
    const nm = studentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(
      new RegExp(`,\\s*((?:["“‘']\\s*)?${nm}(?:\\s*["”’'])?)(\\s*(?:[.!?,;:—–]|$))`, 'gi'),
      ' $1$2',
    );
  }
  // Quoted vocative (live 2026-07-16, session-1784194326500, student named
  // "baby"): the brain wrote `Hey, "baby"!` — lowercase AND quote-wrapped,
  // so the sentence-final vocative rule further down (which needs a bare
  // capitalized name) couldn't fire and Cartesia over-paused on the comma.
  // A quote-wrapped single word right before a terminator is a name
  // mention whatever its case → drop the comma here, BEFORE the global
  // double-quote strip below erases the quote evidence. The quotes
  // themselves are then removed by that strip as usual. Multi-word quotes
  // ("...called a "right angle".") don't match. Bare lowercase names
  // (`Nice work, baby.`) remain out of reach — this layer doesn't know the
  // student's name, and unquoted lowercase words before terminators
  // ("Thanks, everyone!") are legitimately not vocatives.
  t = t.replace(/,\s*(["“‘'][A-Za-z]+["”’'])([.!?])/g, ' $1$2');
  // Double quotes (straight + curly) are stripped outright: after a
  // number Cartesia reads `"6"` as an inch mark ("six inch"), and
  // quotation marks add nothing audible elsewhere. Apostrophes /
  // single quotes are untouched (contractions).
  t = t.replace(/["“”]/g, '');
  // Caps-emphasis → lowercase (see CAPS_EMPHASIS_WORDS). Runs early so
  // later rules see normal-case words.
  t = t.replace(CAPS_EMPHASIS_WORDS, (m) => m.toLowerCase());
  // LaTeX literal escapes \$ \% \& (subject-notation round, live-heard in
  // econ: "\$21" spoke "backslash 21"). These leaked their backslash to
  // Cartesia, and \$ additionally CORRUPTED $-span parsing (its stray "$"
  // mis-paired the splitter), so they must be neutralized up front, before
  // the split below. \$ → literal "$" so Cartesia's native currency
  // reading applies (matching the currency-guard convention that leaves
  // "$5" literal); \% → "%" (Cartesia says "percent"); \& → "and".
  t = t.replace(/\\\$/g, '$');
  t = t.replace(/\\%/g, '%');
  t = t.replace(/\\&/g, ' and ');
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
  // Sub-question labels ("part a" → "part ay"). Runs AFTER rewriteRomanNumerals
  // so "Part VI" is already the citation reading (a–h can't collide with roman
  // I/V/X anyway) and BEFORE the letter-respelling pass so the letter is fixed
  // to its spoken name here rather than left for the article-ambiguous 'a' rule.
  t = rewritePartLetters(t);
  // Math verbalization (Task X1): $-delimited card-field math and any
  // bare LaTeX notation both need converting to SPOKEN WORDS before
  // anything downstream (letter respelling, the bare-equals rule below,
  // etc.) sees the text. Dollar-wrapped spans are only unwrapped when
  // they look like real math — see stripDollarMathForSpeech's gate.
  // Runs after rewriteDerivatives (which already consumed d²y/dx²-style
  // patterns) and before the bare "=" → "equals" rule so anything left
  // over (e.g. "$x = 3$" → "x = 3") still gets voiced by it.
  // Physics units in prose ("5 kg", "9.8 m/s²"). MUST run BEFORE span
  // processing: a span's respelled output ("1 over 2 m v squared" from
  // $\frac{1}{2}mv^2$) is indistinguishable from prose "2 m", so the pass
  // may only ever see the pre-span text. $-span INTERIORS are skipped
  // entirely (same pair regex as stripDollarMathForSpeech): they run their
  // own span-mode pass, and letting the prose pass eat "\, \Omega" inside
  // "$2 \, \Omega$" destroyed the span's only math signal — the gate then
  // mistook "2 ohms" for a currency artifact and spoke the dollar signs.
  t = t
    .split(/(\$[^$\n]{1,160}\$)/)
    .map((chunk) => (chunk.startsWith('$') && chunk.endsWith('$') && chunk.length > 1
      ? chunk
      : rewriteUnitsForSpeech(chunk, false)))
    .join('');
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
  // Phase-3 live round (2026-07-23, SAT session): PROSE "b^2 - 4ac" spoke
  // "4ac" as "four-ack" — the caret rule handled b^2 but the
  // coefficient-glued variable product never reached any splitter (the
  // in-span rule in respellMathLetters only sees DECLARED spans). In tutor
  // prose a digit glued to a 2-3 letter lowercase run that isn't an
  // ordinal/meridiem/unit is algebra by construction — split it and speak
  // the letter NAMES directly ("4ac" → "4 ay see"); emitting names (not
  // bare letters) sidesteps the prose article guards that would leave a
  // bare "a" ambiguous.
  t = t.replace(/\b(\d+)([a-z]{2,3})\b/g, (m: string, num: string, run: string) =>
    DIGIT_RUN_EXCLUDE.has(run) || SPAN_PRODUCT_EXCLUDE.has(run)
      ? m
      : `${num} ${run.split('').map((ch) => SPOKEN_ELEMENT_LETTERS[ch] ?? ch).join(' ')}`);
  // Unicode sub/superscript digits: Cartesia mangles them ("T₁" was
  // voiced roughly as "T-jash"). Speak the plain digit ("T 1").
  const SUBSCRIPT_DIGITS: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  };
  // Trailing space too (chemistry round): "H₂O" must break into "H 2 O",
  // not "H 2O" — the collapse pass folds any doubling back to one space.
  t = t.replace(/[₀-₉]/g, (ch) => ` ${SUBSCRIPT_DIGITS[ch] ?? ch} `);
  // Electron configurations in prose ("1s² 2s² 2p⁶" → "1 s 2 2 s 2 2 p 6")
  // — must claim the superscript run before the exponent pass below reads
  // "1s²" as "1 second squared". Digit + s/p/d/f + superscript digits is
  // uniquely orbital notation.
  const SUP_DIGIT_VAL = (ch: string): string => String('⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(ch));
  t = t.replace(/\b([1-7])([spdf])([⁰¹²³⁴⁵⁶⁷⁸⁹]{1,2})/g,
    (_m, shell: string, sub: string, run: string) =>
      ` ${shell} ${sub} ${run.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, SUP_DIGIT_VAL)} `);
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
  // Physics round: superscript minus/plus join the map so scientific
  // notation ("10⁻¹⁹") reads "10 to the minus 19" — previously the ⁻ glyph
  // passed through raw and the magnitude was silently dropped. A run with
  // no DIGIT (a bare ⁺/⁻, e.g. an ion charge "Na⁺") is left untouched.
  const SUPERSCRIPT_DIGIT_MAP: Record<string, string> = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
    '⁻': '-', '⁺': '+',
  };
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, (run: string, offset: number, full: string) => {
    const prev = full.charAt(offset - 1);
    // Chemistry round: ion charges. A sign-only run anchored to a token is
    // a bare charge ("OH⁻" → "OH minus", "e⁻" → "e minus"); a run whose
    // sign TRAILS its digits is a multiple charge ("Ca²⁺" → "Ca 2 plus").
    // Leading-sign runs stay exponents ("10⁻³⁴" → "to the minus 34"), and
    // an unanchored sign-only run stays untouched. The footnote gate below
    // deliberately does NOT apply — footnote markers never carry signs,
    // and element symbols ("OH", "Ca") are multi-letter by nature.
    if (!/[⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(run)) {
      if (run.length === 1 && /[A-Za-z0-9)\]]/.test(prev)) {
        return run === '⁺' ? ' plus' : ' minus';
      }
      return run; // sign-only, unanchored (or a nonsense multi-sign run)
    }
    if (/[⁺⁻]$/.test(run) && !/[⁺⁻]/.test(run.slice(0, -1)) && /[A-Za-z0-9)\]]/.test(prev)) {
      const digits = run.slice(0, -1).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (ch) => SUP_DIGIT_VAL(ch));
      return ` ${digits} ${run.endsWith('⁺') ? 'plus' : 'minus'} `;
    }
    const prevPrev = full.charAt(offset - 2);
    const precededByDigit = /\d/.test(prev);
    const precededByCloser = prev === ')' || prev === ']';
    const precededBySingleLetterVar = /[A-Za-z]/.test(prev) && !/[A-Za-z]/.test(prevPrev);
    if (!precededByDigit && !precededByCloser && !precededBySingleLetterVar) {
      return run; // footnote marker shape — leave the raw glyph(s) untouched
    }
    const digits = run.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/g, (ch) => SUPERSCRIPT_DIGIT_MAP[ch]);
    return spokenExponent(digits);
  });
  // Degree sign: "38°N" → "38 degrees N". Physics round: °C/°F expand the
  // scale name first ("100°C" previously spoke "100 degrees C").
  t = t.replace(/°\s*C\b/g, ' degrees Celsius ');
  t = t.replace(/°\s*F\b/g, ' degrees Fahrenheit ');
  // Chemistry round: thermodynamic standard state — "ΔH°"/"ΔG°"/"S°"/"E°"
  // speak "naught", never "degrees". Letter-anchored, so coordinates
  // ("38°N") and plain angles ("90°") fall through to the generic rule.
  t = t.replace(/\b([HGSE])\s*°/g, '$1 naught ');
  t = t.replace(/°/g, ' degrees ');
  for (const { pattern, replacement } of ALL_REPLACEMENTS) {
    t = typeof replacement === 'string'
      ? t.replace(pattern, replacement)
      : t.replace(pattern, replacement);
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
  // Round-21: restore the missing space after a sentence-joining period
  // ("…$L \cdot M$.Same pattern…" → after $-strip, "M.Same"). Requires a
  // capital + lowercase after the period so decimals ("3.14") and
  // abbreviations ("U.S." — uppercase follows) stay untouched.
  t = t.replace(/(\w)\.([A-Z][a-z])/g, '$1. $2');
  return t;
}
