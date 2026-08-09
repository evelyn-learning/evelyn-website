/**
 * Math-notation coverage sweep (round 24, 2026-07-18).
 *
 * Two layers over the same choke points every math surface funnels through
 * (TTS: rewriteForTTS → Cartesia; display: segment/looksLikeMath →
 * InlineMathText/KaTeX in bubbles, cards, captions, Q-pin):
 *
 *  1. CURATED pins — hand-verified exact expected outputs per taxonomy
 *     category (K-12 → test prep → college). Prove correctness where the
 *     ideal phrasing is agreed.
 *  2. GENERATED stress corpus — a small grammar composes primes ×1-4,
 *     inverses, trig/log wrappers, fractions, roots, abs, nesting to
 *     depth 3. Thousands of shapes nobody hand-writes. These assert
 *     INVARIANTS, not exact strings:
 *       T1 zero LaTeX residue in TTS output (\ ^ _ { } $)
 *       T2 speakable charset (letters/digits/space/basic punctuation)
 *       T3 no stray apostrophe survives (primes must verbalize)
 *       T4 idempotence: rewriting the output changes nothing
 *       D1 the $-span classifies as math (looksLikeMath/segment)
 *       D2 the span body parses in KaTeX (no error-fallback on any surface)
 *
 * KNOWN_GAPS below records triaged-but-deferred shapes explicitly: each
 * entry still runs and must KEEP failing its invariant (a gap that silently
 * starts passing means the fix landed and the entry must graduate to a pin).
 * Everything not in KNOWN_GAPS must pass — the suite exits 1 otherwise.
 *
 * Run: npm run test:math-coverage        (asserting mode)
 *      npx tsx scripts/test-math-coverage.ts --dump   (print actual outputs
 *      for bulk adjudication while authoring pins)
 */
import { rewriteForTTS } from '../src/lib/tutor/voice/tts-pronunciation';
import { segment, preprocessKatexBody } from '../src/lib/tutor/whiteboard/inline-math';
import {
  captionMeasureProxy,
  tokenizeCaptionMathAtomic,
  holdBackUnbalancedMathTail,
} from '../src/lib/tutor/whiteboard/caption-fit';
import katex from 'katex';
import { mathifyDollarSpans } from '../src/lib/utils/export/latex-readable';
import { stripLatexForTitle } from '../src/lib/tutor/whiteboard/board-title';

const DUMP = process.argv.includes('--dump');
let pass = 0;
let fail = 0;
const failures: string[] = [];
function check(name: string, cond: boolean, detail?: string): void {
  if (cond) { pass++; }
  else {
    fail++;
    failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
    console.error(`\x1b[31mFAIL\x1b[0m ${name}${detail ? `\n    ${detail}` : ''}`);
  }
}

// ── Shared probes ──────────────────────────────────────────────────────
/** TTS a math body inside a neutral spoken frame (the frame itself contains
 *  no math, digits, or apostrophes, so anything suspicious in the output
 *  came from the span). */
function speak(body: string): string {
  return rewriteForTTS(`so $${body}$ here.`);
}
const RESIDUE_RE = /[\\^_{}$]/;
// Frame words + verbalizer vocabulary are all plain; ° √ × ± | etc. in the
// output mean a symbol leaked past the pipeline.
const SPEAKABLE_RE = /^[A-Za-z0-9 .,;:()\-]+$/;

function mathParts(text: string): string[] {
  return segment(text).filter((p) => p.kind === 'math').map((p) => p.body);
}
function katexParses(body: string): boolean {
  try {
    katex.renderToString(body, { throwOnError: true, strict: false, trust: true });
    return true;
  } catch {
    return false;
  }
}

// ── Layer 1: curated exact pins ────────────────────────────────────────
// `tts` asserts the exact string Cartesia receives for a full sentence.
// `disp` asserts the $-span classifies as math AND parses in KaTeX.
function tts(input: string, want: string, name: string): void {
  const got = rewriteForTTS(input);
  if (DUMP) { console.log(`TTS  ${name}\n  in:   ${input}\n  got:  ${got}${got === want ? '' : `\n  want: ${want}`}`); }
  check(`tts: ${name}`, got === want, `in:   ${input}\n    got:  ${got}\n    want: ${want}`);
}
function disp(body: string, name: string): void {
  const parts = mathParts(`We need $${body}$ to continue.`);
  check(`disp-math: ${name}`, parts.length === 1 && parts[0] === body, `span "$${body}$" segmented as ${JSON.stringify(parts)}`);
  check(`disp-katex: ${name}`, katexParses(body), `KaTeX failed to parse "${body}"`);
}
function dispProse(text: string, name: string): void {
  check(`disp-prose: ${name}`, mathParts(text).length === 0, `"${text}" produced math segments ${JSON.stringify(mathParts(text))}`);
}

// Curated sections are appended below (CURATED_SECTIONS marker).

// ── Layer 2: generated stress corpus ───────────────────────────────────
type Wrap = { key: string; fn: (e: string) => string };
const LEAVES = ['x', '2', 'x+1'];
const WRAPS: Wrap[] = [
  { key: 'prime1', fn: (e) => `f'(${e})` },
  { key: 'prime2', fn: (e) => `g''(${e})` },
  { key: 'prime3', fn: (e) => `h'''(${e})` },
  { key: 'prime4', fn: (e) => `f''''(${e})` },
  { key: 'finv', fn: (e) => `f^{-1}(${e})` },
  { key: 'sin', fn: (e) => `\\sin(${e})` },
  { key: 'arctan', fn: (e) => `\\arctan(${e})` },
  { key: 'sininv', fn: (e) => `\\sin^{-1}(${e})` },
  { key: 'ln', fn: (e) => `\\ln(${e})` },
  { key: 'sqrt', fn: (e) => `\\sqrt{${e}}` },
  { key: 'frac', fn: (e) => `\\frac{1}{${e}}` },
  { key: 'dfrac', fn: (e) => `\\dfrac{${e}}{2}` },
  { key: 'sq', fn: (e) => `(${e})^2` },
  { key: 'negexp', fn: (e) => `(${e})^{-1}` },
  { key: 'abs', fn: (e) => `|${e}|` },
  { key: 'ddx', fn: (e) => `\\frac{d}{dx}\\left[${e}\\right]` },
  { key: 'plus2', fn: (e) => `${e} + 2` },
  { key: 'eq', fn: (e) => `y = ${e}` },
];

/** Which invariants a generated case is EXPECTED to fail today. Keyed by
 *  wrapper-path prefix ("outer>inner>leaf" starts-with match) or invariant
 *  name; see KNOWN_GAPS. */
const KNOWN_GAPS: Array<{ match: RegExp; invariant: 'T1' | 'T2' | 'T3' | 'T4' | 'D1' | 'D2'; reason: string }> = [
  // `$|y = |x||$` — an outer abs wrapping an equation that ends in an abs.
  // The pipe pairing is genuinely ambiguous without a parser (humans write
  // \left|…\right| to disambiguate); the pair-regex mis-associates and one
  // pipe survives. Real content uses \left|/\right| or parenthesizes.
  { match: /^abs>eq>abs>/, invariant: 'T2', reason: 'ambiguous nested unsized pipes' },
];
function gapFor(path: string, invariant: string): { reason: string } | undefined {
  return KNOWN_GAPS.find((g) => g.invariant === invariant && g.match.test(path));
}

interface StressResult { total: number; bad: number; gapHits: number; staleGaps: string[] }
function runStress(depth: number): StressResult {
  const res: StressResult = { total: 0, bad: 0, gapHits: 0, staleGaps: [] };
  const seenGapEntries = new Set<number>();
  const perKey = new Map<string, number>();
  const firstFailures: string[] = [];

  function visit(body: string, path: string, d: number): void {
    res.total++;
    const spoken = speak(body);
    const inv: Array<[string, boolean, string]> = [
      ['T1', !RESIDUE_RE.test(spoken), `residue in "${spoken}"`],
      ['T2', SPEAKABLE_RE.test(spoken), `unspeakable char in "${spoken}"`],
      ['T3', !/[A-Za-z]'/.test(spoken) && !spoken.includes("'"), `apostrophe in "${spoken}"`],
      ['T4', rewriteForTTS(spoken) === spoken, `not idempotent: "${spoken}" → "${rewriteForTTS(spoken)}"`],
      ['D1', mathParts(`We need $${body}$ now.`).length === 1, `span not classified math`],
      ['D2', katexParses(body), `KaTeX parse failure`],
    ];
    for (const [invName, ok, detail] of inv) {
      const gap = gapFor(path, invName);
      if (gap) {
        const idx = KNOWN_GAPS.findIndex((g) => g.invariant === invName && g.match.test(path));
        seenGapEntries.add(idx);
        if (ok) res.staleGaps.push(`${invName} ${path} — gap "${gap.reason}" now PASSES: graduate it`);
        else res.gapHits++;
        continue;
      }
      if (!ok) {
        res.bad++;
        const k = `${invName}:${path.split('>')[0]}`;
        perKey.set(k, (perKey.get(k) ?? 0) + 1);
        if (firstFailures.length < 40) firstFailures.push(`${invName} [${path}] $${body}$ — ${detail}`);
      }
    }
  }

  function enumerate(e: string, path: string, d: number): void {
    if (d === 0) { visit(e, path, d); return; }
    for (const w of WRAPS) {
      const wrapped = w.fn(e);
      if (wrapped.length > 90) continue;
      visit(wrapped, `${w.key}>${path}`, d);
      if (d > 1) enumerate(wrapped, `${w.key}>${path}`, d - 1);
    }
  }

  for (const leaf of LEAVES) enumerate(leaf, leaf, depth);

  if (firstFailures.length) {
    console.error(`\nStress failures (first ${firstFailures.length}):`);
    for (const f of firstFailures) console.error(`  ${f}`);
    console.error(`\nFailure counts by invariant:outer-wrapper:`);
    for (const [k, n] of [...perKey.entries()].sort((a, b) => b[1] - a[1])) console.error(`  ${k}: ${n}`);
  }
  for (let i = 0; i < KNOWN_GAPS.length; i++) {
    if (!seenGapEntries.has(i)) res.staleGaps.push(`KNOWN_GAPS[${i}] (${KNOWN_GAPS[i].reason}) matched no case — remove or fix the matcher`);
  }
  return res;
}

// ── Caption-fit helpers ────────────────────────────────────────────────
function captionFitChecks(): void {
  check('caption: proxy strips commands inside spans',
    captionMeasureProxy("so $\\dfrac{1}{f'(f^{-1}(2))}$ ok") === "so 1f'(f^-1(2)) ok",
    `got "${captionMeasureProxy("so $\\dfrac{1}{f'(f^{-1}(2))}$ ok")}"`);
  check('caption: tokenizer keeps spaced span atomic',
    JSON.stringify(tokenizeCaptionMathAtomic('so $y = 3$ here')) === JSON.stringify(['so', '$y = 3$', 'here']));
  check('caption: tokenizer attaches punctuation to span token',
    JSON.stringify(tokenizeCaptionMathAtomic("is $f'(2)$?")) === JSON.stringify(['is', "$f'(2)$?"]));
  check('caption: odd-$ tail held back',
    holdBackUnbalancedMathTail('so $x = ') === 'so ');
  check('caption: balanced text untouched',
    holdBackUnbalancedMathTail('so $x$ done') === 'so $x$ done');
}

// ── Main ───────────────────────────────────────────────────────────────
declare global {
  // populated by the curated section file appended below
}

runCurated();
captionFitChecks();
const stress = runStress(3);
console.log(`\nstress: ${stress.total} cases, ${stress.bad} invariant failures, ${stress.gapHits} known-gap hits`);
for (const s of stress.staleGaps) { check(`stale gap: ${s}`, false); }
if (stress.bad > 0) { fail += 1; failures.push(`${stress.bad} stress invariant failures`); }

console.log(`\nmath-coverage: ${pass} passed, ${fail} failed (curated+caption), stress bad=${stress.bad}`);
if (fail > 0 || stress.bad > 0) process.exit(1);

// CURATED_SECTIONS: runCurated is defined at the bottom so the category
// blocks read top-to-bottom in taxonomy order without hoisting surprises.
function runCurated(): void {
  // ── 1. Numbers & arithmetic ──────────────────────────────────────
  tts('So $-7 + 12$ gives us the total.', 'So minus 7 plus 12 gives us the total.', 'negative-int');
  tts('The population is 1,234,567 people.', 'The population is 1,234,567 people.', 'comma-grouped');
  tts('About 3.14 units of area.', 'About 3.14 units of area.', 'decimal-untouched');
  tts('So $0.\\overline{3}$ equals one third.', 'So 0.3 repeating equals one third.', 'repeating-decimal');
  tts('You scored 85% on the quiz.', 'You scored 85% on the quiz.', 'percent-native');
  tts('The ratio is $3:4$ here.', 'The ratio is 3 to 4 here.', 'ratio-colon');
  tts('It costs $5 and shipping is $10.', 'It costs $5 and shipping is $10.', 'currency-pair-guard');
  tts("That's $12.50 for two tickets.", "That's $12.50 for two tickets.", 'currency-single');
  tts('Avogadro is $6.02 \\times 10^{23}$ exactly.', 'Avogadro is 6.02 times 10 to the 23 exactly.', 'sci-notation');
  tts('Speed is 3 × 10⁸ meters per second.', 'Speed is 3 times 10 to the 8 meters per second.', 'sci-glyph-times');

  // ── 2. Fractions ─────────────────────────────────────────────────
  tts('So $\\frac{3}{4}$ of the class passed.', 'So 3 over 4 of the class passed.', 'basic-frac');
  tts('Simplify $\\frac{2x}{x^2+1}$ now.', 'Simplify 2x over x squared plus 1 now.', 'frac-poly');
  disp('\\frac{3}{4}', 'frac');
  disp('\\dfrac{1}{1+x^2}', 'dfrac');

  // ── 3. Exponents & roots ─────────────────────────────────────────
  tts('So $x^2 + y^3 - x^{10}$ here.', 'So x squared plus why cubed minus x to the 10 here.', 'exp-basic');
  tts('Compute $\\sqrt{49}$ mentally.', 'Compute the square root of 49 mentally.', 'sqrt');
  tts('Then $\\sqrt[4]{16}$ equals 2.', 'Then the 4th root of 16 equals 2.', 'nth-root');
  tts('Recall $x^{1/2}$ is a square root.', 'Recall x to the 1/2 is a square root.', 'fractional-exponent');
  tts('but $x^{-1}$ means the reciprocal.', 'but x to the minus 1 means the reciprocal.', 'negative-exponent');
  // Audit residual (2026-07-23 fix): unicode superscript directly on the left
  // operand used to block the bare-minus rule — "x² - 4" spoke with a silent
  // hyphen-pause instead of "minus".
  tts('The expression x² - 4 factors nicely.', 'The expression x squared minus 4 factors nicely.', 'unicode-sup-bare-minus');
  tts('Compare 10² - 4 with the rest.', 'Compare 10 squared minus 4 with the rest.', 'unicode-sup-digit-bare-minus');
  tts('The war ran 1941 - 1945 overall.', 'The war ran 1941 - 1945 overall.', 'year-range-still-hyphen');
  // R32 live (session-1784825448372): plain-slash pi fraction spoke "slash";
  // paren pairs lost their comma ("zero two").
  tts('Evaluate $f(\\pi/2)$ here.', 'Evaluate f of pie over 2 here.', 'pi-slash-fraction');
  tts('So f(π/2) equals zero.', 'So f of pie over 2 equals zero.', 'pi-slash-prose');
  tts('a solution in $(0, 2)$.', 'a solution in (0 comma 2).', 'interval-pair-comma');
  tts('has a root in (0, π/2).', 'has a root in (0 comma pie over 2).', 'interval-pair-pi-comma');
  disp('\\sqrt[4]{16}', 'nth-root-display');

  // ── 4. Functions, composition, primes, inverses ──────────────────
  tts('Evaluate $f(g(2))$ step by step.', 'Evaluate f of jee of 2 step by step.', 'composition');
  tts("the derivative $f'(x)$ gives the slope.", 'the derivative f prime of x gives the slope.', 'prime-r23');
  tts("then $f'''(x)$ is the jerk.", 'then f triple prime of x is the jerk.', 'triple-prime');
  tts("even $g''''(x)$ appears in beam theory.", 'even jee fourth derivative of x appears in beam theory.', 'fourth-derivative');
  tts('that gives $f^{-1}(2)$ here.', 'that gives f inverse of 2 here.', 'function-inverse');
  disp("f'''(x)", 'triple-prime-display');
  disp("h''''(1)", 'fourth-prime-display');

  // ── 5. Equations & inequalities ──────────────────────────────────
  tts('Solve $2x + 5 = 11$ for $x$.', 'Solve 2x plus 5 equals 11 for x.', 'linear-eq');
  tts('We need $x \\le 5$ and $x \\ne 2$ both.', 'We need x less than or equal to 5 and x not equal to 2 both.', 'short-ineq-commands');
  tts('So $-3 < x \\leq 5$ overall.', 'So minus 3 less than x less than or equal to 5 overall.', 'compound-ineq');
  tts('Thus $x > 0$ strictly.', 'Thus x greater than 0 strictly.', 'gt-in-span');

  // ── 6. Absolute value ────────────────────────────────────────────
  tts('So $|x - 3| < 2$ bounds it.', 'So the absolute value of x minus 3 less than 2 bounds it.', 'abs-value');
  disp('|x - 3|', 'abs-display');

  // ── 7. Logs & exponentials ───────────────────────────────────────
  tts('Recall $\\ln(e^x) = x$ always.', 'Recall natural log (e to the x) equals x always.', 'ln-exp');
  tts('Compute $\\log_2 8$ quickly.', 'Compute log base 2 8 quickly.', 'log-base');

  // ── 8. Trig ──────────────────────────────────────────────────────
  tts('So $\\sin^2(x) + \\cos^2(x) = 1$ always.', 'So sine squared (x) plus cosine squared (x) equals 1 always.', 'pythagorean-identity');
  tts('Why is $\\tan(\\theta)$ undefined there?', 'Why is tangent (theta) undefined there?', 'tan-theta');
  // R37 (session-polish, live report): "sin" was heard mispronounced
  // inside a two-span sentence like this one. Exhaustively re-fed through
  // rewriteForTTS, this exact shape (and every \sin variant tried —
  // parens, no parens, subscript, glued coefficient, adjacent spans) came
  // out correctly as "sine" — the reproducible defect turned out to be the
  // currency-artifact gate above (see currency-short-word-sentence-boundary
  // pins), not this rule ordering. Pinned here as a straight regression
  // guard on the exact live shape.
  tts('Right — $\\sin(\\pi/6) = \\tfrac12$, and $\\cos(\\pi/3)$…',
    'Right, sine (pie over 6) equals 1 over 2, and cosine (pie over 3),', 'live-report-sin-two-span');
  tts('$\\cos(-\\pi/6) = \\cos(\\pi/6)$', 'cosine (minus pie over 6) equals cosine (pie over 6)', 'cos-even-identity');
  tts('$\\sin(-\\theta) = -\\sin\\theta$', 'sine (minus theta) equals minus sine theta', 'sin-odd-identity-span');
  tts('\\sin(-\\theta) = -\\sin\\theta', 'sine (- theta ) equals - sine theta', 'sin-odd-identity-bare');
  // R37 (session-polish, live report — same sentence as the sin bug above):
  // brace-less \frac/\dfrac/\tfrac ("\tfrac12" == "\tfrac{1}{2}" in real
  // LaTeX) fell through the braced-only SPEECH_FRAC_RE and collapsed to
  // the bare concatenated digits ("equals 12"), silencing the fraction
  // entirely. Bare two-digit form must match the braced form's output
  // exactly; braced multi-digit args are untouched.
  tts('$\\tfrac12$', '1 over 2', 'bare-tfrac-matches-braced');
  tts('$\\frac{1}{2}$', '1 over 2', 'braced-frac-one-half-reference');
  tts('$\\frac34$', '3 over 4', 'bare-frac-matches-braced');
  tts('$\\frac{3}{4}$', '3 over 4', 'braced-frac-three-fourths-reference');
  tts('$\\tfrac{11}{2}$', '11 over 2', 'braced-multidigit-tfrac-unchanged');
  tts('And $\\sin^{-1}(0.5)$ is 30 degrees.', 'And arc sine (0.5) is 30 degrees.', 'inverse-trig');
  tts('Convert $\\frac{\\pi}{6}$ radians to 30°.', 'Convert pie over 6 radians to 30 degrees.', 'radians-degrees');

  // ── 9. Coordinates & intervals ───────────────────────────────────
  tts('Plot the point $(3, -4)$ first.', 'Plot the point (3, minus 4) first.', 'coordinate-pair');
  tts('Velocity over $[2, b]$ as $b$ approaches 2.', 'Velocity over the interval from 2 to bee as bee approaches 2.', 'interval-speech');
  disp('(3, -4)', 'coordinate-display');
  disp('[2, b]', 'interval-display');

  // ── 10. Limits (incl. one-sided, infinity) ───────────────────────
  tts('Evaluate $\\lim_{x \\to \\infty} \\frac{1}{x}$ directly.', 'Evaluate the limit as x approaches infinity of 1 over x directly.', 'limit-infinity');
  tts('Check $\\lim_{x \\to 2^+} f(x)$ next.', 'Check the limit as x approaches 2 from the right of f of x next.', 'one-sided-limit');
  tts('So dy/dx measures slope.', 'So dee why over dee ex measures slope.', 'leibniz-prose');

  // ── 11. Integrals ────────────────────────────────────────────────
  tts('Compute $\\int_0^4 x^2 \\, dx$ today.', 'Compute the integral from 0 to 4 of x squared dee ex today.', 'definite-integral');
  tts('Find $\\int x^2 \\, dx$ now.', 'Find the integral of x squared dee ex now.', 'indefinite-integral');
  tts('So ∫_0^4 x dx is the area.', 'So the integral from 0 to 4 of x dee ex is the area.', 'integral-glyph-prose');
  disp('\\int_0^4 x^2 \\, dx', 'integral-display');

  // ── 12. Sums, products, factorials, combinatorics ────────────────
  tts('So $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$ neatly.', 'So the sum from i equals 1 to n of i equals n(n plus 1) over 2 neatly.', 'sum-formula');
  tts('Then $5! = 120$ ways.', 'Then 5 factorial equals 120 ways.', 'factorial');
  tts('Compute $\\binom{5}{2}$ choices.', 'Compute 5 choose 2 choices.', 'binomial-coefficient');
  tts('So $10C3$ counts them.', 'So 10 choose 3 counts them.', 'ncr');
  disp('\\binom{5}{2}', 'binom-display');
  disp('5!', 'factorial-display');

  // ── 13. Stats & probability ──────────────────────────────────────
  tts('The mean $\\bar{x} = 52$ here.', 'The mean x bar equals 52 here.', 'x-bar');
  tts('And $\\hat{p} = 0.4$ from the sample.', 'And p hat equals 0.4 from the sample.', 'p-hat');
  // "ay"/"bee" are the correct SPOKEN letter forms (in-span respell).
  tts('So $P(A|B)$ differs from $P(A)$.', 'So the probability of A given bee differs from P(A).', 'conditional-probability');
  tts('Population variance is $\\sigma^2$ overall.', 'Population variance is sigma squared overall.', 'sigma-squared');
  disp('P(A|B)', 'conditional-display');
  disp('\\bar{x}', 'x-bar-display');

  // ── 14. Greek ────────────────────────────────────────────────────
  tts('The angle $\\theta = \\frac{\\pi}{3}$ nicely.', 'The angle theta equals pie over 3 nicely.', 'greek-theta');
  tts('Compare $\\Delta y$ over $\\Delta x$ carefully.', 'Compare Delta why over Delta x carefully.', 'capital-delta');
  tts('Density uses $\\rho$ and shear uses $\\tau$ often.', 'Density uses rho and shear uses tau often.', 'rho-tau');

  // ── 15. Geometry relations ───────────────────────────────────────
  tts('So $AB \\parallel CD$ and $EF \\perp GH$ hold.', 'So AB is parallel to CD and EF is perpendicular to GH hold.', 'parallel-perp');
  tts('Then $\\triangle ABC \\cong \\triangle DEF$ exactly.', 'Then triangle ABC is congruent to triangle DEF exactly.', 'congruent-triangles');
  tts('Here $\\angle ABC = 50°$ exactly.', 'Here angle ABC equals 50 degrees exactly.', 'angle-measure');

  // ── 16. Sets ─────────────────────────────────────────────────────
  tts('Since $x \\in A \\cup B$ we proceed.', 'Since x is in A union bee we proceed.', 'set-union');
  tts('But $A \\cap B = \\emptyset$ here.', 'But A intersect bee equals the empty set here.', 'empty-intersection');

  // ── 17. Vectors & complex ────────────────────────────────────────
  // R32: pair-comma voicing supersedes the earlier "reads fine as-is" call —
  // live evidence (session-1784825448372) showed Cartesia speaks "(3, 4)"
  // as "three four", dropping the separator.
  tts('So $\\vec{v} = (3, 4)$ here.', 'So vector v equals (3 comma 4) here.', 'vector');
  tts('So $z = 3 + 4i$ has modulus 5.', 'So z equals 3 plus 4i has modulus 5.', 'complex-number');
  tts('Recall $i^2 = -1$ always.', 'Recall i squared equals minus 1 always.', 'i-squared');

  // ── 18. Sequences & subscripts ───────────────────────────────────
  tts('The term $a_{n+1} = a_n + d$ recursively.', 'The term A sub n plus 1 equals A sub n plus dee recursively.', 'recursive-sequence');

  // ── 19. Sentence hygiene with math ───────────────────────────────
  tts("Nailed it. $h'(1) = \\dfrac{1}{2}$.Now onward.", 'Nailed it. h prime of 1 equals 1 over 2. Now onward.', 'sentence-gap-r23');
  tts("I'm sure you don't mind, let's go.", "I'm sure you don't mind, let's go.", 'contractions-guard');

  // ── 20. Display currency guards ──────────────────────────────────
  dispProse('It costs $5 and shipping is $10.', 'currency-pairing-artifact');
  dispProse("It costs $5 and Bob's fee is $10.", 'possessive-currency');

  // ── 21. PDF export $-span mathification (round-24 fix) ───────────
  check('pdf: dfrac span → readable',
    mathifyDollarSpans("$h'(1) = \\dfrac{1}{1+1^2}$") === "h'(1) = (1)/(1+1^2)",
    `got "${mathifyDollarSpans("$h'(1) = \\dfrac{1}{1+1^2}$")}"`);
  check('pdf: currency untouched',
    mathifyDollarSpans('It costs $5 and shipping is $10.') === 'It costs $5 and shipping is $10.');
  check('pdf: nested frac resolves inner-first',
    mathifyDollarSpans('$\\frac{\\frac{1}{2}}{3}$') === '(1/2)/(3)',
    `got "${mathifyDollarSpans('$\\frac{\\frac{1}{2}}{3}$')}"`);
  check('pdf: nth root readable',
    mathifyDollarSpans('$\\sqrt[3]{27}$') === '3-root(27)',
    `got "${mathifyDollarSpans('$\\sqrt[3]{27}$')}"`);

  // R2 P4 (2026-07-26, session portal-19ac025c PDF): multi-token exponents
  // keep parens — brace-stripping made e^{kT} ambiguous and x^{n+1} WRONG.
  check('pdf: multi-token exponent keeps parens',
    mathifyDollarSpans('$e^{kT}$') === 'e^(kT)',
    `got "${mathifyDollarSpans('$e^{kT}$')}"`);
  check('pdf: x^{n+1} precedence preserved',
    mathifyDollarSpans('$x^{n+1}$') === 'x^(n+1)',
    `got "${mathifyDollarSpans('$x^{n+1}$')}"`);
  check('pdf: single-char exponent stays bare',
    mathifyDollarSpans('$x^{2}$') === 'x^2',
    `got "${mathifyDollarSpans('$x^{2}$')}"`);
  check('pdf: multi-token subscript keeps parens, single stays bare',
    mathifyDollarSpans('$a_{n+1} + y_{0}$') === 'a_(n+1) + y_0',
    `got "${mathifyDollarSpans('$a_{n+1} + y_{0}$')}"`);
  check('pdf: session shape y_0e^{kT} = y_0/2',
    mathifyDollarSpans('$y_0e^{kT} = y_0/2$') === 'y_0e^(kT) = y_0/2',
    `got "${mathifyDollarSpans('$y_0e^{kT} = y_0/2$')}"`);
  check('pdf: trivial fraction collapses',
    mathifyDollarSpans('$e^{kT} = \\frac{1}{2}$') === 'e^(kT) = 1/2',
    `got "${mathifyDollarSpans('$e^{kT} = \\frac{1}{2}$')}"`);
  check('pdf: dy/dt collapses, non-trivial operands keep parens',
    mathifyDollarSpans('$\\frac{dy}{dt} = \\frac{y_0}{2}$') === 'dy/dt = (y_0)/(2)',
    `got "${mathifyDollarSpans('$\\frac{dy}{dt} = \\frac{y_0}{2}$')}"`);
  check('pdf: coefficient-function spacing',
    mathifyDollarSpans('$T = \\frac{\\ln 2}{0.1} = 10\\ln 2$') === 'T = (ln 2)/(0.1) = 10 ln 2',
    `got "${mathifyDollarSpans('$T = \\frac{\\ln 2}{0.1} = 10\\ln 2$')}"`);

  // ── 22. Board switcher titles ────────────────────────────────────
  check('title: dfrac reduces like frac',
    stripLatexForTitle('$\\dfrac{1}{2}$ rule') === '1/2 rule',
    `got "${stripLatexForTitle('$\\dfrac{1}{2}$ rule')}"`);
  check('title: cdot/times render as symbols',
    stripLatexForTitle('$a \\cdot b \\times c$') === 'a · b × c',
    `got "${stripLatexForTitle('$a \\cdot b \\times c$')}"`);

  // ── 23. Round-28: command-glued-to-digit + bare variable letters ──
  // (live 2026-07-18, AP Calc BC session portal-f31017f0)
  // "$8\neq5$" spoke as "8 5": `\b` after a letter-run command never
  // matches when a digit follows (q→5 is word-char→word-char, no
  // boundary), so the relation rule missed and the residual sweep
  // deleted the command wholesale. Same class as the round-24 \log_2 fix.
  tts('and $1 + 7 = 8\\neq5$, so no.', 'and 1 plus 7 equals 8 not equal to 5, so no.', 'unspaced-neq-digit');
  tts('so $x\\neq2$ here.', 'so x not equal to 2 here.', 'unspaced-neq-var');
  tts('We need $x\\leq5$ and $y\\geq3$.', 'We need x less than or equal to 5 and why greater than or equal to 3.', 'unspaced-leq-geq');
  tts('so $x\\ne2$ here.', 'so x not equal to 2 here.', 'unspaced-ne-short');
  tts('so $6\\pm2$ and $3\\times2$ here.', 'so 6 plus or minus 2 and 3 times 2 here.', 'unspaced-pm-times');
  // Bare variable "m": the pipeline used to pass a standalone "m"
  // through untouched and Cartesia normalized it to "meter". Spans
  // respell unconditionally; prose respells only behind variable
  // anchors. "5 m" (number + unit) must still convert to meters.
  tts('so $m = 7$ here.', 'so M equals 7 here.', 'span-variable-m');
  tts('Right, m equals 7 there.', 'Right, M equals 7 there.', 'prose-m-equals');
  tts('so m should be 7 there.', 'so M should be 7 there.', 'prose-m-should');
  tts('The rod is 5 m long.', 'The rod is 5 meters long.', 'unit-m-still-meters');
  tts("I'm being careful there.", "I'm being careful there.", 'im-contraction-m-guard');
  // Article-'a' before an operator word with a math-shaped continuation
  // ("*a plus b*" spoke the article — markdown italics, not a $-span).
  tts('and we are told a plus b equals 5.', 'and we are told A plus bee equals 5.', 'prose-a-plus-b');
  tts('so a minus b gives 2 here.', 'so A minus bee gives 2 here.', 'prose-a-minus-b');
  tts('That is a plus for the team.', 'That is a plus for the team.', 'article-a-plus-guard');
  // Display side of the same incident: the pre-KaTeX "\n → newline"
  // de-escape must not eat the backslash off \n-prefixed commands
  // ("x\neq2" rendered as italic "xeq2" in problem cards and bubbles;
  // EquationRenderer already carried the guarded form).
  check('katex-preprocess: \\neq survives',
    preprocessKatexBody('x\\neq2') === 'x\\neq2',
    `got ${JSON.stringify(preprocessKatexBody('x\\neq2'))}`);
  check('katex-preprocess: \\nabla survives',
    preprocessKatexBody('\\nabla f') === '\\nabla f',
    `got ${JSON.stringify(preprocessKatexBody('\\nabla f'))}`);
  check('katex-preprocess: literal newline escape still converts',
    preprocessKatexBody('a\\n b') === 'a\n b',
    `got ${JSON.stringify(preprocessKatexBody('a\\n b'))}`);
  check('katex-preprocess: double-escaped command collapses',
    preprocessKatexBody('\\\\frac{1}{2}') === '\\frac{1}{2}',
    `got ${JSON.stringify(preprocessKatexBody('\\\\frac{1}{2}'))}`);

  // ── 24. Phase-3 live round (2026-07-23, SAT session): coefficient-glued
  // variable products. "b^2 - 4ac" spoke "4ac" as "four-ack" — no \b
  // between digit and letter, so neither the in-span round-22 splitter
  // nor any prose rule ever saw "ac" as a token. Prose emits letter NAMES
  // directly ("4 ay see" — bare split letters would re-enter the
  // article-'a' guards); spans split then respell per round-22.
  tts('what do we need b^2 - 4ac to equal?', 'what do we need bee squared - 4 ay see to equal?', 'prose-4ac-discriminant');
  tts('plug a = 2, b = k, c = 8 into b^2 - 4ac = 0.', 'plug A equals 2, bee equals k, see equals 8 into bee squared - 4 ay see equals 0.', 'prose-4ac-plugin');
  tts('So 2ab plus 4ac minus 3bc.', 'So 2 ay bee plus 4 ay see minus 3 bee see.', 'prose-coeff-products');
  tts('The discriminant is $b^2 - 4ac$.', 'The discriminant is bee squared minus 4 A c.', 'span-4ac');
  // Guards: ordinals, meridiems, units — digit-glued runs that must stay.
  tts('That is the 4th problem, due at 10am on the 2nd.', 'That is the 4th problem, due at 10am on the 2nd.', 'digit-run-ordinal-meridiem-guard');
  tts('It moves at 70mph and holds 500ml.', 'It moves at 70mph and holds 500ml.', 'digit-run-unit-guard');
  tts('A 4acre lot with 12oz cups.', 'A 4acre lot with 12oz cups.', 'digit-run-word-guard');

  // ── 25. R36 (2026-07-30, SAT session portal-fdee5b34): currency $
  // pairing with a later $-span, markdown emphasis defeating the
  // artifact gate, letter-m spelling, and fill-in-the-blank runs. ──
  // "$40 … *one-time* … $m$" paired the price's $ with the span's
  // opener; the hyphenated words + emphasis asterisks inside matched
  // MATH_OPERAND_OP_RE, so the whole prose stretch verbalized as math
  // ("o n e minus time f e e"). The price $ must stay literal AND the
  // trailing $m$ must still unwrap as its own span.
  tts("Right — the $40 is a *one-time* fee, so it's the y-intercept: the cost when $m$ equals zero months.",
    "Right, the $40 is a one-time fee, so it's the why-intercept: the cost when M equals zero months.",
    'currency-span-pairing-artifact');
  tts('It costs $5 and shipping is $10 for the set.',
    'It costs $5 and shipping is $10 for the set.', 'currency-double-price-guard');
  // R37 (session-polish, live: "$5. So $\sin(\pi/6)…$" spoke "S o sine
  // ( theta )$"): isCurrencyPairingArtifact's PROSE_WORD_RE only counts a
  // 3+ letter run as prose evidence. A digit-led inner ending on a SHORT
  // (1-2 letter) connector word — "So", "ok", "no" — has no such run, so
  // the round-20 math-by-default gate misclassified the real currency+
  // filler-word gap as math: the price's own $ paired with the NEXT
  // real span's opener, swallowing "So" into the bogus span (in-span
  // letter respelling then split it into "S o"), and left the real
  // span's closing $ dangling raw for the second sentence-boundary
  // verbalizeMathForSpeech pass to partially recover. Any inner text
  // that crosses a SENTENCE boundary (terminal punctuation + a new
  // capitalized word) can never be a legitimate math span — LaTeX
  // spans don't contain full sentences — so that shape is now always
  // treated as an artifact regardless of the short-word gap.
  tts('It costs $5. So $\\sin(\\theta)$ is the ratio.',
    'It costs $5. So sine (theta) is the ratio.', 'currency-short-word-sentence-boundary');
  tts('It costs $5. Ok $x + 2 = 5$ works.',
    'It costs $5. Ok x plus 2 equals 5 works.', 'currency-short-word-sentence-boundary-2');
  // Letter m: 'em' is voiced /əm/ ("um") by Cartesia — live-heard as
  // "um ex" for $mx$ and "um and bee" for prose "m and b". Bare capital
  // M reads as the letter name (same round-30 rationale as capital A).
  tts('so $y = mx + b$ here.', 'so why equals M x plus bee here.', 'span-mx-product');
  tts('what do m and b represent?', 'what do M and bee represent?', 'prose-m-and-b');
  // Fill-in-the-blank underscore runs spoke "underscore underscore …".
  tts('The slope is _______ and the intercept is _____.',
    'The slope is blank and the intercept is blank.', 'fill-in-blank-underscores');

  // ── 26. R36b (2026-07-30, session portal-18ac9fb5): glued coefficients
  // and mixed-case variable products. "$C = 3.50m + 250$" spoke "3.50
  // meters" (glued digit+letter claimed by the unit pass) and "$Ax + By =
  // C$" read "Ax"/"By" as the words "axe"/"by". ──
  tts('The cost is $C = 3.50m + 250$ for the month.',
    'The cost is see equals 3.50 M plus 250 for the month.', 'span-glued-coefficient-m');
  tts('so $y = 2m$ here.', 'so why equals 2 M here.', 'span-glued-coefficient-2m');
  tts('Standard form is $Ax + By = C$ here.',
    'Standard form is A x plus bee why equals C here.', 'span-mixed-case-products');
  // Separated units must still convert — only GLUED singles are algebra.
  tts('The rod is 5 m long and the wire is 3.50 m.',
    'The rod is 5 meters long and the wire is 3.50 meters.', 'unit-spaced-m-still-meters');
  tts('It weighs 5kg and holds 500ml.', 'It weighs 5 kilograms and holds 500ml.', 'unit-glued-multiletter-kept');
}
