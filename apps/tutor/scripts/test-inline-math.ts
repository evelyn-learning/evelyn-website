/**
 * Unit tests for InlineMathText's segmenter — the $...$ math-vs-currency
 * split used by problem statements, answer choices, and worked-example
 * prose on the whiteboard.
 *
 * Regression 2026-07-11: a geometry problem card showed literal "$A = 50°$",
 * "$AB = 6$" while "$ABC$" rendered — looksLikeMath accepted only LaTeX
 * signals (\ ^ _ { }) or ≤4-char identifiers, so compact relations fell
 * through to the currency guard and stayed raw text.
 *
 * Run: npm run test:inline-math
 */
import { segment, autoWrapLatex, normalizeSentenceGaps, isProseNotLatex, normalizeLiteralLineBreaks, deepNormalizeLiteralLineBreaks } from '../src/lib/tutor/whiteboard/inline-math';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

function mathBodies(text: string): string[] {
  return segment(text).filter((p) => p.kind === 'math').map((p) => p.body);
}

function joined(text: string): string {
  return segment(text).map((p) => (p.kind === 'math' ? `⟨${p.body}⟩` : p.body)).join('');
}

// Un-delimited LaTeX cases run text through the auto-wrap pre-pass first,
// the same way InlineMathText's real pipeline does.
function autoMathBodies(text: string): string[] {
  return segment(autoWrapLatex(text)).filter((p) => p.kind === 'math').map((p) => p.body);
}

function autoJoined(text: string): string {
  return segment(autoWrapLatex(text)).map((p) => (p.kind === 'math' ? `⟨${p.body}⟩` : p.body)).join('');
}

console.log('\n=== Compact relations are math (regression 2026-07-11) ===');
{
  const t = 'Triangle $ABC$ has angle $A = 50°$, angle $B = 70°$, and side $AB = 6$.';
  const m = mathBodies(t);
  check('problem-card repro: 4 math segments', m.length === 4, JSON.stringify(m));
  check('"A = 50°" is math', m.includes('A = 50°'), joined(t));
  check('"AB = 6" is math', m.includes('AB = 6'), joined(t));
}
{
  const m = mathBodies('Triangle $DEF$ has angle $D = 50°$ and side $DE = 6$.');
  check('second triangle: 3 math segments', m.length === 3, JSON.stringify(m));
}
{
  const m = mathBodies('Solve $x = 5$ and check $y < 10$.');
  check('"x = 5" and "y < 10" are math', m.length === 2 && m[0] === 'x = 5' && m[1] === 'y < 10', JSON.stringify(m));
}
{
  const m = mathBodies('Ohm: $V = IR$ throughout.');
  check('"V = IR" is math', m.length === 1 && m[0] === 'V = IR', JSON.stringify(m));
}

console.log('\n=== Currency guard still holds ===');
{
  const t = 'Maya has $50 and a $15 movie ticket.';
  check('currency prose: zero math segments', mathBodies(t).length === 0, joined(t));
}
{
  const t = 'She saved $50 and one Saturday afternoon. She wants to (a) see a $15 movie.';
  check('long currency prose: zero math segments', mathBodies(t).length === 0, joined(t));
}
{
  // A relation with prose words inside stays literal (word signal wins).
  const t = 'Note that $5 is less than the $9 fee.';
  check('prose between dollars stays literal', mathBodies(t).length === 0, joined(t));
}
{
  // Relation with an empty side stays literal ("$20 < $30" prose shape).
  const t = 'Is $20 < $30 a good deal?';
  check('"$20 < $30" prose stays literal', mathBodies(t).length === 0, joined(t));
}

console.log('\n=== Existing acceptance rules unchanged ===');
{
  const m = mathBodies('Short ids $ABC$ and $x$ render.');
  check('short identifiers are math', m.length === 2, JSON.stringify(m));
}
{
  const m = mathBodies('Solve for x: $2^{x+1} - 3 \\cdot 2^{x+2} = 0$');
  check('LaTeX-signal segment is math', m.length === 1, JSON.stringify(m));
}
{
  const m = mathBodies('Subscript $y_1$ is math.');
  check('underscore segment is math', m.length === 1 && m[0] === 'y_1', JSON.stringify(m));
}
{
  check('unmatched dollar stays literal', mathBodies('a raw $5 alone').length === 0);
  check('empty pair stays literal', mathBodies('empty $$ pair').length === 0);
}

console.log('\n=== Un-delimited LaTeX auto-wrap (Task E4) ===');
{
  // Screenshot repro 1 (ap-calcbc-u1-limits-algebraic-manipulation.ts seed):
  // authored without any $ delimiters at all.
  const t = 'Compute lim_{x→0} sin(5x)/(2x).';
  const m = autoMathBodies(t);
  check('screenshot 1: exactly one math span', m.length === 1, autoJoined(t));
  check('screenshot 1: math body is the full limit expression',
    m[0] === 'lim_{x→0} sin(5x)/(2x)', JSON.stringify(m));
}
{
  const t = 'Compute lim_{x→4} (x² − 16)/(x − 4).';
  const m = autoMathBodies(t);
  check('screenshot 2: exactly one math span', m.length === 1, autoJoined(t));
  check('screenshot 2: math body is the full limit expression',
    m[0] === 'lim_{x→4} (x² − 16)/(x − 4)', JSON.stringify(m));
}
{
  // Backslash-command signal, no delimiters at all.
  const t = 'Simplify \\frac{1}{2} + \\frac{1}{3}.';
  const m = autoMathBodies(t);
  check('bare backslash command auto-wraps', m.length >= 1, autoJoined(t));
}
{
  // Short-variable + script signal, no delimiters.
  const t = 'Expand x^2 - 4 completely.';
  const m = autoMathBodies(t);
  check('bare x^2 auto-wraps', m.some((b) => b.includes('x^2')), autoJoined(t));
}

console.log('\n=== Conservative guard: no strong signal → untouched (Task E4) ===');
{
  const t = 'I paid $5 for _reasons_';
  check('currency + markdown italics stay untouched', autoMathBodies(t).length === 0, autoJoined(t));
  check('autoWrapLatex is a no-op here', autoWrapLatex(t) === t, autoWrapLatex(t));
}
{
  const t = 'snake_case_id stays plain';
  check('bare snake_case identifier stays untouched', autoMathBodies(t).length === 0, autoJoined(t));
  check('autoWrapLatex is a no-op here', autoWrapLatex(t) === t, autoWrapLatex(t));
}
{
  const t = 'The report_v2 and draft_final files were merged.';
  check('snake_case-ish prose stays untouched', autoMathBodies(t).length === 0, autoJoined(t));
}

console.log('\n=== Already-$-delimited behavior is unchanged by the auto-wrap pre-pass ===');
{
  const t = 'Triangle $ABC$ has angle $A = 50°$, angle $B = 70°$, and side $AB = 6$.';
  check('compact-relation regression case unaffected', autoWrapLatex(t) === t, autoWrapLatex(t));
  check('segment() result identical with/without auto-wrap pass',
    JSON.stringify(mathBodies(t)) === JSON.stringify(autoMathBodies(t)));
}
{
  const t = 'Maya has $50 and a $15 movie ticket.';
  check('currency prose unaffected by auto-wrap pass', autoMathBodies(t).length === 0, autoJoined(t));
}
{
  const t = 'Solve $x = 5$ and check $y < 10$.';
  check('existing $-delimited math unaffected', autoWrapLatex(t) === t, autoWrapLatex(t));
}

console.log('\n=== Bare TeX-special characters defeat validate-or-fallback (Finding 1, retest round) ===');
{
  // KaTeX treats an un-escaped % as a TeX comment: it does NOT throw, it
  // silently truncates everything after it within the render. Without a
  // guard, autoWrapLatex's own katex.renderToString({throwOnError:true})
  // validation passes and the run gets wrapped, then the truncated render
  // reaches the student — "x^2" with "+ y^2" silently dropped.
  const t = 'Compute x^2% + y^2 next.';
  check('bare % run stays untouched (raw text preserved)', autoWrapLatex(t) === t, autoWrapLatex(t));
  check('bare % run: zero math segments after auto-wrap', autoMathBodies(t).length === 0, autoJoined(t));
}
{
  // Percent-stats prose never had a strong signal to begin with (no
  // backslash/fn-call/short-var-script chunk), so this was already safe —
  // locked in here as an explicit regression alongside the bug case above.
  const t = 'Compute 20% + 30% of x.';
  check('percent-stats prose stays untouched', autoWrapLatex(t) === t, autoWrapLatex(t));
  check('percent-stats prose: zero math segments', autoMathBodies(t).length === 0, autoJoined(t));
}
{
  // Bare # and & are the same class of silent-parse-altering TeX
  // specials (comment-like / alignment-tab) — guarded the same way even
  // though KaTeX happens to throw on them outside tabular contexts today.
  const t = 'Compute x^2# extra stuff.';
  check('bare # run stays untouched', autoWrapLatex(t) === t, autoWrapLatex(t));
}
{
  const t = 'Compute x^2& more stuff.';
  check('bare & run stays untouched', autoWrapLatex(t) === t, autoWrapLatex(t));
}
{
  // Escaped \% inside an authored run is the deliberate, correct way to
  // render a literal percent sign — it must still validate and wrap
  // normally, not get swept up by the new guard.
  const t = 'Expand x^2 \\% now.';
  const m = autoMathBodies(t);
  check('escaped \\% still wraps and validates normally', m.length === 1 && m[0] === 'x^2 \\%', JSON.stringify(m));
}
{
  // Double backslash (TeX \\ line-break command) before % means the %
  // is unescaped; hasUnescapedTexSpecial must detect and block the wrap
  // to preserve the literal backslashes and percent.
  const t = 'Expand x^2 \\\\% now.';
  check('double backslash before % stays unwrapped (parity check)', autoWrapLatex(t) === t, autoWrapLatex(t));
  check('double backslash before %: zero math segments', autoMathBodies(t).length === 0, autoJoined(t));
}

console.log('\n=== Fn-call-only run must NOT inject literal $…$ (Final-review fix wave) ===');
{
  // A run whose ONLY strong signal is a math-fn call (no \ ^ _ { } and no
  // relation) passes isValidLatex (KaTeX renders sin(3x)/(6x) fine) but is
  // REJECTED by segment()'s looksLikeMath currency guard downstream — so
  // wrapping it in $…$ makes the dollars render literally on the card:
  // "Evaluate sin(3x)/(6x) directly." → shows "$sin(3x)/(6x)$". The commit
  // site must require BOTH isValidLatex AND looksLikeMath, else leave raw.
  const t = 'Evaluate sin(3x)/(6x) directly.';
  check('fn-call-only run stays byte-identical (no $ injected)', autoWrapLatex(t) === t, autoWrapLatex(t));
  check('fn-call-only run: zero math segments after auto-wrap', autoMathBodies(t).length === 0, autoJoined(t));
}
{
  const t = 'cos(2x) + 1';
  check('cos(2x) + 1 stays byte-identical (no $ injected)', autoWrapLatex(t) === t, autoWrapLatex(t));
  check('cos(2x) + 1: zero math segments after auto-wrap', autoMathBodies(t).length === 0, autoJoined(t));
}
{
  // The two original screenshot strings carry `_{`, so looksLikeMath's
  // LaTeX-signal branch accepts them — they must STILL wrap and segment.
  const t = 'Compute lim_{x→0} sin(5x)/(2x).';
  const m = autoMathBodies(t);
  check('screenshot 1 still wraps (has _{ signal)', m.length === 1 && m[0] === 'lim_{x→0} sin(5x)/(2x)', autoJoined(t));
}
{
  const t = 'Compute lim_{x→4} (x² − 16)/(x − 4).';
  const m = autoMathBodies(t);
  check('screenshot 2 still wraps (has _{ signal)', m.length === 1 && m[0] === 'lim_{x→4} (x² − 16)/(x − 4)', autoJoined(t));
}


console.log('\n=== Round-19: coordinate tuples are math (2026-07-17) ===');
{
  // Live AP Calc BC card: "passes through the point $(1,-1)$" rendered the
  // dollar signs literally — no LaTeX signal char, longer than 4 chars, no
  // relation symbol, so every looksLikeMath rule missed it.
  const t = 'The curve $y^2 = x^3$ passes through the point $(1,-1)$.';
  const m = mathBodies(t);
  check('tuple $(1,-1)$ renders as math', m.includes('(1,-1)'), joined(t));
  check('the relation span still renders', m.includes('y^2 = x^3'), joined(t));
}
{
  const m = mathBodies('Plot $(0, 3.5)$ and $(-2, a)$ on the grid.');
  check('spaced/decimal/negative/identifier tuples render', m.length === 2 && m[0] === '(0, 3.5)' && m[1] === '(-2, a)');
}
{
  // Currency-adjacent guards: prose amounts must stay literal.
  const m1 = mathBodies('It costs $5 (about) and $9 elsewhere.');
  check('unpaired currency untouched', m1.length === 0);
  const m2 = mathBodies('a range of $(low, high) prices$ here');
  check('tuple with prose words stays literal', m2.length === 0);
}

console.log(`\nround-19 additions: done`);

console.log('\n=== Round-21: compact operand-operator spans are math ===');
{
  // Live transcript showed literal "$L + M$" — no relation symbol, >4
  // chars, no LaTeX signal, so every display rule missed it.
  const m = mathBodies('The limit of a sum is $L + M$ here.');
  check('$L + M$ renders as math', m.length === 1 && m[0] === 'L + M');
}
{
  const m = mathBodies('So $c \\cdot L$ and $L/M$ both work.');
  check('operator spans render', m.length === 2);
}
{
  const m1 = mathBodies('It costs $5 and shipping is $10.');
  check('currency artifact still literal (prose guard)', m1.length === 0);
}

console.log('\n=== Round-22: bracketed intervals are math ===');
{
  // Live card showed literal "$[2,b]$" — brackets, so the paren-tuple rule missed it.
  const m = mathBodies('velocity over intervals $[2,b]$ as $b$ approaches 2.');
  check('interval $[2,b]$ renders as math', m.includes('[2,b]'));
  const m2 = mathBodies('on $[a, b]$ and half-open $(0, 5]$.');
  check('spaced and half-open intervals render', m2.length === 2);
  const m3 = mathBodies('It costs $5 and shipping is $10.');
  check('currency still literal', m3.length === 0);
}

console.log('\n=== Round-23: prime/derivative spans are math ===');
{
  // Live transcript + problem card showed literal "$f'(x)$" and "$h'(1)$" —
  // no LaTeX signal char, 5 chars (>4), no relation, apostrophe is not in
  // the operator class, so every rule missed them.
  const m = mathBodies("The derivative $f'(x)$ tells you the slope.");
  check("$f'(x)$ renders as math", m.length === 1 && m[0] === "f'(x)");
  const m2 = mathBodies("So $h'(1)$ is what we want.");
  check("$h'(1)$ renders as math", m2.length === 1 && m2[0] === "h'(1)");
  const m3 = mathBodies("Second derivative $f''(x)$ measures concavity.");
  check("$f''(x)$ renders as math", m3.length === 1 && m3[0] === "f''(x)");
  const m4 = mathBodies("Evaluate $g'(-2)$ next.");
  check("$g'(-2)$ renders as math", m4.length === 1);
}
{
  // Currency + possessive prose must stay literal: the candidate inner
  // between the two $ is "5 and Bob's fee is " — prose, not a prime span.
  const m = mathBodies("It costs $5 and Bob's fee is $10.");
  check('possessive prose between currency stays literal', m.length === 0);
}

console.log('\n=== Round-23: display-side sentence-gap normalization ===');
{
  // Round 21 fixed the missing sentence space on the SPEECH side only;
  // Image 25 (round 23) showed the bubble still rendering "1.So" run-ons.
  check(
    'space inserted after mid-word period',
    normalizeSentenceGaps('the slope is 1.So what next?') === 'the slope is 1. So what next?',
  );
  check(
    'space inserted after math-closing $.',
    normalizeSentenceGaps("$h'(1) = \\dfrac{1}{2}$.Now let's cross-check.") ===
      "$h'(1) = \\dfrac{1}{2}$. Now let's cross-check.",
  );
  check('decimals untouched', normalizeSentenceGaps('about 3.14 units') === 'about 3.14 units');
  check(
    'already-spaced sentences untouched',
    normalizeSentenceGaps('Nailed it. Now onward.') === 'Nailed it. Now onward.',
  );
}

// R32 (session-1784825448372): letter exponent is a strong signal — the Try
// Yourself card printed "e^x = 2x + 1" with a raw caret.
{
  const wrapped = autoWrapLatex('Use IVT to show that the equation e^x = 2x + 1 has a solution in (0, 2).');
  check('letter exponent e^x auto-wraps', wrapped.includes('$e^x = 2x + 1$'), wrapped);
  const parts = segment(wrapped);
  check('e^x span segments as math', parts.some((p) => p.kind === 'math' && p.body === 'e^x = 2x + 1'));
  check('prose with caret-free words untouched',
    autoWrapLatex('The next section covers limits.') === 'The next section covers limits.');
}

console.log('\n=== Bare comma-separated numeric lists are math (transcript drawer regression) ===');
{
  // Transcript drawer showed literal "$2, 3, 4, 5, 31$" — the tuple rule
  // requires a leading ( or [ so a bare list missed every clause.
  const m = mathBodies('The factors are $2, 3, 4, 5, 31$ here.');
  check('$2, 3, 4, 5, 31$ renders as math', m.length === 1 && m[0] === '2, 3, 4, 5, 31', joined('The factors are $2, 3, 4, 5, 31$ here.'));
}
{
  const m = mathBodies('Critical points at $0.5, 1.5$ exactly.');
  check('decimal list $0.5, 1.5$ renders as math', m.length === 1 && m[0] === '0.5, 1.5');
}
{
  const m = mathBodies('Test values $-3, -1, 0, 2$ in order.');
  check('negative list $-3, -1, 0, 2$ renders as math', m.length === 1 && m[0] === '-3, -1, 0, 2');
}
{
  const m = mathBodies('The variables $x, y, z$ are free.');
  check('single-letter identifier list $x, y, z$ renders as math', m.length === 1 && m[0] === 'x, y, z');
}
{
  // Prose guard: 1-4 letter word lists with no digit and multi-char words
  // must stay literal — "so, um, yes" is speech filler, not a math list.
  const m = mathBodies('I said $so, um, yes$ twice.');
  check('filler-word list stays literal', m.length === 0, joined('I said $so, um, yes$ twice.'));
}
{
  const m = mathBodies('like $when, they, said$ before.');
  check('longer prose word list stays literal', m.length === 0);
}
{
  // Currency pairing artifact must stay literal: inner is "5 and " which
  // has no comma structure at all.
  const m = mathBodies('It costs $5 and $10 elsewhere.');
  check('currency pairing artifact stays literal', m.length === 0, joined('It costs $5 and $10 elsewhere.'));
}

console.log('\n=== Factorial-list $-spans are math (R45 fix, live session portal-d7ec8e42) ===');
{
  // Live: the transcript drawer showed literal "$0!, 1!, 2!$" — the R31
  // bare-comma-list rule's token charset allowed digits/commas but not "!".
  const m = mathBodies('Does seeing it laid out as $0!, 1!, 2!$ next to $1, 1, 2$ make it click?');
  check('$0!, 1!, 2!$ renders as math', m.includes('0!, 1!, 2!'),
    joined('Does seeing it laid out as $0!, 1!, 2!$ next to $1, 1, 2$ make it click?'));
}
{
  // Guard: a bare exclamation with no comma-list shape at all must never
  // qualify — "Great!" is prose, not a single-item factorial list.
  const m = mathBodies('I said $Great!$ before.');
  check('bare exclamation stays literal', m.length === 0, joined('I said $Great!$ before.'));
}
{
  // Guard: a real word breaks the numeric-item shape even with a comma —
  // "Hello!, world" is not a factorial list just because it contains "!,".
  const m = mathBodies('I said $Hello!, world$ before.');
  check('word-list with exclamation stays literal', m.length === 0, joined('I said $Hello!, world$ before.'));
}

console.log('\n=== Known 3-letter fn names + comma args are math ===');
{
  const m = mathBodies('Recall $sin(x)$ oscillates.');
  check('$sin(x)$ renders as math', m.length === 1 && m[0] === 'sin(x)');
}
{
  const m = mathBodies('A standard normal is $N(0, 1)$ by definition.');
  check('$N(0, 1)$ renders as math', m.length === 1 && m[0] === 'N(0, 1)');
}
{
  const m = mathBodies('So $log(100)$ and $max(a, b)$ work.');
  check('$log(100)$ and $max(a, b)$ render as math', m.length === 2 && m[0] === 'log(100)' && m[1] === 'max(a, b)');
}
{
  // Long / unknown fn names still stay literal — "cost(x)" is prose-like.
  const m = mathBodies('The $cost(x) of it$ is high.');
  check('unknown 4-letter fn name stays literal', m.length === 0);
}


// Live check 6 (2026-09-07, portal-63ee9f2c): the Q-pin renders with
// forceMath; a gist echoing two spoken prices paired them into one math span.
{
  const { looksLikeCurrencySpan } = require('../src/lib/tutor/whiteboard/inline-math');
  const gist = 'Why does a 20% decrease on $120 give a different result than on $100?';
  const forced = segment(gist, true);
  check('forceMath: currency pair stays text', forced.every((p) => p.kind === 'text'), JSON.stringify(forced));
  check('forceMath: "$2 - x$" still math', segment('What is $2 - x$ when x is 5?', true).some((p) => p.kind === 'math' && p.body === '2 - x'));
  check('forceMath: "$1.12p = 560$" still math', segment('Solve $1.12p = 560$?', true).some((p) => p.kind === 'math' && p.body === '1.12p = 560'));
  check('forceMath: "$12 \\times 3$" still math', segment('Compute $12 \\times 3$.', true).some((p) => p.kind === 'math'));
  check('currencySpan: "5 and " yes', looksLikeCurrencySpan('5 and ') === true);
  check('currencySpan: "2 - x" no', looksLikeCurrencySpan('2 - x') === false);
  check('currencySpan: "\\text{price} per 12" no', looksLikeCurrencySpan('\\text{price} per 12') === false);
}

// isProseNotLatex — live 2026-09-18 (portal-7cefb23d, pharmacy-tech worked
// example): showSolution step `result` = "Less waiting at the counter" went
// through the display-math renderer and painted as "Lesswaitingatthecounter".
{
  const prose = [
    'Less waiting at the counter',
    'Technicians handle routine tasks, freeing pharmacists for clinical review.',
    '150 prescriptions daily',
    'Lipitor is the brand name for atorvastatin',
  ];
  for (const t of prose) check(`prose: "${t}"`, isProseNotLatex(t) === true);
  const math = [
    'x = 2y + 3',
    '\\frac{a}{b} = c',
    '2x',
    '3 \\times 4 = 12',
    'F = ma',
    'sin x',
    'v_0 t + \\frac{1}{2} a t^2',
    '\\text{Total} = 150 \\text{ prescriptions}',
    '$5 + $3 = $8',
    '',
  ];
  for (const t of math) check(`not prose: "${t}"`, isProseNotLatex(t) === false);
}

console.log('\n=== Answer choices sent as bare LaTeX, no $ (live MCQ card) ===');
{
  // The brain sent these four option texts with NO $ delimiters. B stayed
  // fully literal (whitespace chunking split `\text{ or }` into `\text{`,
  // `or`, `}` and KaTeX threw on the unclosed brace), C half-rendered, and
  // A rendered as two fragments around an upright x.
  const whole = (t: string, name: string) => {
    const parts = segment(autoWrapLatex(t));
    check(`${name}: one maths span covering the whole string`,
      parts.length === 1 && parts[0].kind === 'math' && parts[0].body === t, autoJoined(t));
  };
  whole('-3 \\le x \\le 5', 'option A');
  whole('x \\le -3 \\text{ or } x > 5', 'option B');
  whole('x < -3 \\text{ or } x \\ge 5', 'option C');
  const d = 'No solution — the two pieces never overlap';
  check('option D: prose untouched', autoWrapLatex(d) === d && autoMathBodies(d).length === 0, autoJoined(d));
  // Same shapes, structurally (not these exact strings).
  whole('y \\ge 2 \\text{ and } y < 9', 'and-compound');
  whole('\\text{Total} = 150 \\text{ prescriptions}', 'text groups either side of a relation');
  whole('a \\ne 0', 'single-letter operand on the left');
  whole('\\frac{1}{2} \\le t', 'single-letter operand on the right');
  {
    // Trailing sentence punctuation stays outside the span.
    const t = 'x \\le -3 \\text{ or } x > 5.';
    check('whole-string wrap leaves trailing punctuation outside',
      autoJoined(t) === '⟨x \\le -3 \\text{ or } x > 5⟩.', autoJoined(t));
  }
}

console.log('\n=== Brace-aware chunking + single-letter operands inside prose ===');
{
  // A `\cmd{…}` group containing spaces is ONE chunk, so a maths run inside
  // a sentence survives a `\text{ or }` in the middle of it.
  const t = 'The answer is x \\le -3 \\text{ or } x > 5 here.';
  check('run with a spaced \\text{} group wraps as one span inside prose',
    autoJoined(t) === 'The answer is ⟨x \\le -3 \\text{ or } x > 5⟩ here.', autoJoined(t));
}
{
  // A bare single-letter variable that is an operand of a relation joins.
  const t = 'Subtract 3 from both sides, so x \\le 5 holds';
  check('prose stays prose; the variable joins its relation',
    autoJoined(t) === 'Subtract 3 from both sides, so ⟨x \\le 5⟩ holds', autoJoined(t));
}
{
  const t = 'We need -3 \\le x \\le 5 for this to work.';
  check('variable between two relations joins one span',
    autoJoined(t) === 'We need ⟨-3 \\le x \\le 5⟩ for this to work.', autoJoined(t));
}

{
  const t = 'Give A \\cup B in set notation';
  check('set operands join their operator',
    autoJoined(t) === 'Give ⟨A \\cup B⟩ in set notation', autoJoined(t));
}

console.log('\n=== Negative: prose must never be typeset as italic maths ===');
{
  const t = 'Use \\frac{1}{2} of the pie to share';
  check('fraction in a sentence: only the fraction is maths',
    autoJoined(t) === 'Use ⟨\\frac{1}{2}⟩ of the pie to share', autoJoined(t));
}
{
  // The article "a" next to a maths chunk is NOT a variable.
  const t = 'I think a \\frac{1}{2} cup is enough';
  check('article "a" before a fraction stays prose',
    autoJoined(t) === 'I think a ⟨\\frac{1}{2}⟩ cup is enough', autoJoined(t));
}
{
  // "a" beside a relation whose other side is prose is still the article.
  const t = 'Is that a \\le sign or not';
  check('article "a" before a lone relation symbol stays prose',
    autoJoined(t) === 'Is that a ⟨\\le⟩ sign or not', autoJoined(t));
}
{
  // Short all-prose-word strings: no long word to trip a "3+ letters"
  // guard, so the whole-string rule needs its short-word guard.
  const t = 'so x \\le 5';
  check('leading "so" is not swallowed into the span',
    autoJoined(t) === 'so ⟨x \\le 5⟩', autoJoined(t));
}
{
  // A bare (un-\text) "or" would be typeset "5orx" in maths mode — the
  // whole string must NOT wrap; each side wraps on its own.
  const t = 'x \\le 5 or x \\ge 7';
  check('bare "or" stays prose between two spans',
    autoJoined(t) === '⟨x \\le 5⟩ or ⟨x \\ge 7⟩', autoJoined(t));
}
{
  const t = 'The slope is \\frac{1}{2}';
  check('sentence ending in a fraction: only the fraction is maths',
    autoJoined(t) === 'The slope is ⟨\\frac{1}{2}⟩', autoJoined(t));
}
{
  const t = 'A is the point where the graph turns, and \\frac{1}{2} is its height';
  check('capital-letter label in prose stays prose',
    autoJoined(t) === 'A is the point where the graph turns, and ⟨\\frac{1}{2}⟩ is its height', autoJoined(t));
}
{
  // An unbalanced brace must not glue the rest of the sentence into one chunk.
  const t = 'Write \\text{ and then finish the sentence with x^2 here';
  check('unbalanced \\text{ does not swallow the sentence',
    autoJoined(t) === 'Write \\text{ and then finish the sentence with ⟨x^2⟩ here', autoJoined(t));
}
{
  // Whole-string wrap never spans a line break (segment() rejects those
  // and would show the dollars literally).
  const t = 'x \\le 5\ny \\ge 7';
  check('multi-line bare LaTeX: no literal $ leaks', !autoJoined(t).includes('$'), autoJoined(t));
}

console.log('\n=== Set-literal braces are never swallowed as invisible TeX groups ===');
{
  // Review finding: a bare `{…}` inside a maths span is a TeX GROUP — KaTeX
  // draws nothing for it, so "A ∪ B = {1, 2, 3}" rendered "A ∪ B = 1, 2, 3".
  // A set-literal brace that lands in a span is rewritten to \{ … \}.
  const t = 'A \\cup B = {1, 2, 3}';
  check('set literal after a relation keeps visible braces',
    autoJoined(t) === '⟨A \\cup B = \\{1, 2, 3\\}⟩', autoJoined(t));
}
{
  const t = 'A = {1, 2} and B = {2, 3}, so A \\cap B = {2}';
  check('set literal at the end of a sentence run keeps visible braces',
    autoJoined(t) === 'A = {1, 2} and B = {2, 3}, so ⟨A \\cap B = \\{2\\}⟩', autoJoined(t));
}
{
  // Before the fix this was ⟨{1, 2, 3} \cup {4}⟩ (braces invisible).
  const t = 'set {1, 2, 3} \\cup {4}';
  check('set literals either side of an operator command keep visible braces',
    autoJoined(t) === 'set ⟨\\{1, 2, 3\\} \\cup \\{4\\}⟩', autoJoined(t));
}
{
  const t = 'x \\in {1, 2, 3}';
  check('set literal after \\in', autoJoined(t) === '⟨x \\in \\{1, 2, 3\\}⟩', autoJoined(t));
}
{
  // The invariant, over every span of a mixed bag: no unescaped `{` that is
  // not an argument brace (directly after a command name, _, ^, ] or }).
  const bag = [
    'A \\cup B = {1, 2, 3}', 'A = {1, 2} and B = {2, 3}, so A \\cap B = {2}',
    'set {1, 2, 3} \\cup {4}', 'S = {x \\in A : x > 0}', 'Give {a, b} \\subseteq {a, b, c} here',
    '{1, 2} \\cap {2, 3} = {2}', 'P = {\\frac{1}{2}, x^{2}}',
  ];
  for (const t of bag) {
    const bad = autoMathBodies(t).some((b) => {
      for (let i = 0; i < b.length; i++) {
        if (b[i] === '\\') { i++; continue; }
        if (b[i] === '{' && !(i > 0 && /[A-Za-z_^}\]]/.test(b[i - 1]))) return true;
      }
      return false;
    });
    check(`no bare set brace inside a span: "${t}"`, !bad, autoJoined(t));
  }
}
{
  // Argument braces are untouched.
  const same = (t: string, want: string, name: string) => check(name, autoJoined(t) === want, autoJoined(t));
  same('\\frac{1}{2}', '⟨\\frac{1}{2}⟩', 'fraction argument braces untouched');
  same('x \\le -3 \\text{ or } x > 5', '⟨x \\le -3 \\text{ or } x > 5⟩', '\\text{ or } argument braces untouched');
  same('x^{2}', '⟨x^{2}⟩', 'superscript braces untouched');
  same('a_{n}', '⟨a_{n}⟩', 'subscript braces untouched');
  same('\\sqrt[3]{x} \\le 2', '⟨\\sqrt[3]{x} \\le 2⟩', 'argument brace after an optional [..] untouched');
  same('a_{n + 1} = \\frac{a_{n}}{2}', '⟨a_{n + 1} = \\frac{a_{n}}{2}⟩', 'nested argument braces untouched');
  same('A \\cup B = \\{1, 2, 3\\}', '⟨A \\cup B = \\{1, 2, 3\\}⟩', 'already-escaped set braces are not double-escaped');
}
{
  // After a non-operator command or an argument group + SPACE, a `{` may be
  // an argument (\frac{1} {2}) or a set literal (\alpha {1, 2}). A top-level
  // comma decides for "set"; otherwise it is ambiguous and the run is left
  // un-wrapped rather than risk either reading.
  const t = 'x \\le \\alpha {1, 2}';
  check('spaced brace with a comma list is a set literal', autoJoined(t) === '⟨x \\le \\alpha \\{1, 2\\}⟩', autoJoined(t));
  const u = 'so \\frac{1} {2} \\le x';
  check('ambiguous spaced brace: no span contains it', !autoMathBodies(u).some((b) => /\s\{/.test(b)), autoJoined(u));
}

console.log('\n=== A leading enumerator stays outside the maths span ===');
{
  const same = (t: string, want: string, name: string) => check(name, autoJoined(t) === want, autoJoined(t));
  // Review finding: "$A. x \le -3 …$" reads as the product A·x.
  same('A. x \\le -3 \\text{ or } x > 5', 'A. ⟨x \\le -3 \\text{ or } x > 5⟩', 'option letter "A." stays text');
  same('Q1: x \\le 3', 'Q1: ⟨x \\le 3⟩', '"Q1:" stays text');
  same('Step 2: 3x + 1 \\le 7', 'Step 2: ⟨3x + 1 \\le 7⟩', '"Step 2:" stays text');
  same('B) x \\ge 2', 'B) ⟨x \\ge 2⟩', '"B)" stays text');
  same('(C) -3 \\le x \\le 5', '(C) ⟨-3 \\le x \\le 5⟩', '"(C)" stays text');
  same('1. x \\le 3', '1. ⟨x \\le 3⟩', '"1." stays text');
  same('2) \\frac{1}{2} \\le t', '2) ⟨\\frac{1}{2} \\le t⟩', '"2)" stays text');
  same('  A. x \\le 3.', '  A. ⟨x \\le 3⟩.', 'leading whitespace + trailing punctuation preserved');
  same('D. No solution — the two pieces never overlap', 'D. No solution — the two pieces never overlap', 'prose option untouched');
  // Negatives: these are maths, not enumerators.
  same('A = 5 \\cdot 2', '⟨A = 5 \\cdot 2⟩', '"A = …" is a variable, not an enumerator');
  same('A \\cup B', '⟨A \\cup B⟩', '"A \\cup B" is a set, not an enumerator');
  same('2.5 \\le x', '⟨2.5 \\le x⟩', 'a decimal is not "2."');
  same('(A) \\cup (B)', '⟨(A) \\cup (B)⟩', '"(A)" before an operator is an operand');
  same('(x) \\cdot 2 \\le 8', '⟨(x) \\cdot 2 \\le 8⟩', '"(x)" before an operator is an operand');
  same('x. y \\le 3', '⟨x. y \\le 3⟩', '"x." (lower-case letter + dot) is not an enumerator — unchanged');
  same('A.x \\le 3', '⟨A.x \\le 3⟩', 'no space after the dot — unchanged');
}

// ── Literal backslash-n in prose (live: a show_problem statement for an
// uploaded worksheet arrived with the two CHARACTERS backslash + n between
// items — the model over-applied LaTeX escaping — and the card printed them).
// Review 2026-10-04: the first cut converted ANY backslash-n / backslash-t
// and damaged code, paths and unknown macros. The rule is now "only the
// unmistakable separator; when unsure, leave the text alone".
// String.raw keeps every backslash below a real backslash character.
{
  const nlb = normalizeLiteralLineBreaks;
  const eq = (name: string, got: unknown, want: unknown) =>
    check(name, JSON.stringify(got) === JSON.stringify(want), JSON.stringify(got) === JSON.stringify(want) ? undefined : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`);
  const seen: string[] = [];
  const untouched = (name: string, s: string) => { seen.push(s); eq(`untouched: ${name}`, nlb(s), s); };
  const converts = (name: string, s: string, want: string) => { seen.push(s); eq(`converts: ${name}`, nlb(s), want); };

  const stored = String.raw`Solve for the variable.\n\n1) $v - 29\frac{4}{5} = \frac{1}{5}$\n2) $-8 = c - 5$`;
  const fixed = 'Solve for the variable.\n\n1) $v - 29\\frac{4}{5} = \\frac{1}{5}$\n2) $-8 = c - 5$';
  converts('stored worksheet statement: literal \\n → real newlines, maths untouched', stored, fixed);
  const production = String.raw`Solve for the variable. Round to the nearest hundredth if needed.\n\n1) $v - 29\frac{4}{5} = \frac{1}{5}$\n2) $-8 = c - 5$\n3) $n + 3 = -9$`;
  converts('the real production string', production,
    'Solve for the variable. Round to the nearest hundredth if needed.\n\n1) $v - 29\\frac{4}{5} = \\frac{1}{5}$\n2) $-8 = c - 5$\n3) $n + 3 = -9$');
  check('stored worksheet statement: no literal backslash-n survives outside maths',
    !/\\n/.test(nlb(stored).replace(/\$[^$]*\$/g, '')));
  check('stored worksheet statement: maths spans byte-identical',
    JSON.stringify(nlb(stored).match(/\$[^$]*\$/g)) === JSON.stringify(stored.match(/\$[^$]*\$/g)));
  untouched('real newlines are left alone', fixed);
  untouched('no backslash at all', 'Find x.\nThen find y.');

  // LaTeX commands that start with n / t are never touched, inside or
  // outside $…$ (bare LaTeX in prose is auto-wrapped later by the renderer).
  for (const s of [
    String.raw`x \neq 3`, String.raw`\nu`, String.raw`\nabla f`, String.raw`\text{no}`, String.raw`\theta`,
    String.raw`a \ne b`, String.raw`x \not= y`, String.raw`3 \nmid 10`, String.raw`A \ni x`, String.raw`\newline`,
    String.raw`2 \times 3`, String.raw`x \to 0`, String.raw`\tan x`, String.raw`\tau`, String.raw`\top`,
    String.raw`\tfrac{1}{2}`, String.raw`\triangle ABC`, String.raw`\textbf{note}`, String.raw`\nRightarrow`,
    String.raw`A \nRightarrow B`, String.raw`A \nLeftarrow B`,
    String.raw`$x \neq 3$ and $\theta = \tfrac{\pi}{2}$`, String.raw`$\theta$`, String.raw`$\nu$ is the frequency`,
    String.raw`the frequency (\nu) is fixed`,
  ]) untouched(`command ${s}`, s);
  // Review 2026-10-04 (round 2): with no "(" before it, "\nu) is" passed for
  // the lettered item "u)" — the marker test runs before the command guard.
  // A lone lettered marker must open the string or follow sentence
  // punctuation; mid-sentence it needs a second lettered item beside it.
  untouched('unparenthesised \\nu) mid-sentence', String.raw`frequency \nu) is`);
  untouched('unparenthesised \\nu) in a sentence', String.raw`The wave (of frequency \nu) is fixed`);
  untouched('parenthesised (frequency \\nu) is', String.raw`(frequency \nu) is`);
  untouched('\\ne) mid-sentence, one marker only', String.raw`where a \ne) b`);
  untouched('\\nu) glued to what follows', String.raw`Use.\nu)x`);

  // LaTeX macros KaTeX does not know keep their backslash.
  untouched('siunitx \\textcelsius', String.raw`Water boils at 100\textcelsius and room is 25\textcelsius.`);
  untouched('\\num{…}', String.raw`About \num{12345} people`);
  untouched('custom macro starting with n', String.raw`Use \norm{v} and \nicefrac{1}{2} here`);
  untouched('custom macro, capitalised', String.raw`Let \nA be the set`);

  // Computer-science content and paths: the escape IS the content.
  untouched('string literal in a question', String.raw`What does print("a\nb") output?`);
  untouched('choice a\\nb', String.raw`a\nb`);
  untouched('choice that is only \\n', String.raw`\n`);
  untouched('choice that is only \\t', String.raw`\t`);
  untouched('Windows path', String.raw`C:\new\table`);
  untouched('Windows path 2', String.raw`C:\Users\tom\notes.txt`);
  untouched('Windows path with a digit folder', String.raw`Open C:\n2024 first`);
  untouched('prose about escapes', String.raw`In Python, \n means newline and \t means tab.`);
  untouched('grep', String.raw`grep '\tfoo'`);
  untouched('backticked code', 'Call `s.split(\'\\n\')` to get the lines.');
  untouched('quoted escape before a capitalised word', String.raw`The string "\nHello" starts with a line feed`);
  untouched('single-quoted escape before a digit', String.raw`Then it writes '\n1' to the file`);
  untouched('backticked escape before a list marker', 'Type `\\n1)` exactly');
  untouched('talk about a backslash', String.raw`A backslash then n:\n1) what is it?`);
  untouched('talk about the tab character', String.raw`The tab character.\n1) Where is it?`);
  untouched('another escape in the same string', String.raw`First.\n1) one\r2) two\t3) three`);
  untouched('println cue', String.raw`System.out.println prints a line.\n1) What follows?`);
  untouched('literal backslash-t is never a separator', String.raw`a)\tx = 2`);
  untouched('lower-case word after it', String.raw`first line\nthen the second`);
  untouched('a doubled backslash (LaTeX row break)', String.raw`a \\n b`);
  untouched('literal \\n inside a maths span, nothing else', String.raw`$x^2\n+ 1$`);

  // The separator shapes.
  converts('lettered items, including the one that spells \\ne',
    String.raw`Pick one.\na) one\nb) two\nc) three\nd) four\ne) five`, 'Pick one.\na) one\nb) two\nc) three\nd) four\ne) five');
  converts('the reviewer\'s tail', String.raw`c) three\nd) four\ne) five`, 'c) three\nd) four\ne) five');
  converts('lettered tail with nothing before it', String.raw`\nd) four\ne) five`, '\nd) four\ne) five');
  converts('one lettered item after a finished sentence', String.raw`Do part a first.\na) Solve it`, 'Do part a first.\na) Solve it');
  converts('one lettered item after a colon and a space', String.raw`Parts: \nb) the second`, 'Parts: \nb) the second');
  converts('two lettered items after plain words', String.raw`a) one\nb) two`, 'a) one\nb) two');
  converts('"1." items', String.raw`Do these.\n1. Solve $2x = 8$\n2. Factor $x^2 - 9$`, 'Do these.\n1. Solve $2x = 8$\n2. Factor $x^2 - 9$');
  converts('"(1)" and "(a)" items', String.raw`Parts:\n(1) first\n(a) second`, 'Parts:\n(1) first\n(a) second');
  converts('bullets', String.raw`Remember:\n- signs\n• units\n* order`, 'Remember:\n- signs\n• units\n* order');
  converts('capitalised word', String.raw`Part A.\nSolve for x.`, 'Part A.\nSolve for x.');
  converts('a maths span follows', String.raw`Simplify:\n$2x + 3x$`, 'Simplify:\n$2x + 3x$');
  converts('a digit follows', String.raw`Totals:\n12 apples`, 'Totals:\n12 apples');
  converts('trailing separator after a sentence', String.raw`Solve for x.\n`, 'Solve for x.\n');
  converts('doubled separator with a space between', String.raw`Read this.\n \nThen answer.`, 'Read this.\n \nThen answer.');
  converts('CRLF escape pair → one newline', String.raw`One.\r\nTwo is next.`, 'One.\nTwo is next.');
  converts('literal \\n inside a maths span is left for the KaTeX pre-pass',
    String.raw`$x^2\n+ 1$ then\nNext`, String.raw`$x^2\n+ 1$ then` + '\nNext');
  converts('currency prose is prose', String.raw`Maya has $50.\nBen has $15.`, 'Maya has $50.\nBen has $15.');
  converts('apostrophes are not quotes', String.raw`Don't rush.\n1) Solve it\n2) Check Maya's work`, 'Don\'t rush.\n1) Solve it\n2) Check Maya\'s work');
  converts('quoted word elsewhere does not block', String.raw`Define "slope".\n1) Find it for $y = 3x$`, 'Define "slope".\n1) Find it for $y = 3x$');
  converts('escape velocity is physics, not an escape sequence', String.raw`Find the escape velocity.\n1) Earth\n2) Mars`, 'Find the escape velocity.\n1) Earth\n2) Mars');
  converts('science words that are also tool names', String.raw`Fill the outer shell. Print your name.\n1) Rust forms\n2) An echo returns`, 'Fill the outer shell. Print your name.\n1) Rust forms\n2) An echo returns');
  converts('\\neq in a maths span next to a separator', String.raw`Note $x \neq 3$.\nSolve for x.`, 'Note $x \\neq 3$.\nSolve for x.');

  for (const s of seen) eq(`idempotent: ${s.slice(0, 40)}`, nlb(nlb(s)), nlb(s));

  // Deep walk over tool args: ONLY prose-statement fields are converted;
  // answer-bearing, tabular, maths, code and lookup fields stay byte-identical.
  const sep = String.raw`One.\n1) Two`;
  const sepFixed = 'One.\n1) Two';
  const args = {
    statement: String.raw`Solve.\n1) $x \neq 2$`,
    title: sep, label: sep, caption: sep, description: sep, note: sep, notes: sep, text: sep, problem: sep,
    explanation: sep, content: sep, question: sep, passage: sep, keyIdea: sep,
    hints: [String.raw`Look.\nAgain`],
    steps: [{ description: sep, explanation: sep, expression: sep }],
    answerChoices: [{ letter: 'A', text: sep }, sep],
    choices: [{ id: 'a', text: sep, correct: true }],
    options: [sep], answer: sep, correctAnswer: sep, correctChoice: sep, solution: sep,
    rows: [[sep, 'x']], headers: [sep], cells: [sep], columns: [sep], values: [sep],
    latex: String.raw`a\nb`,
    code: String.raw`print("a\nb")`,
    expectedAnswer: sep,
    smiles: String.raw`C/C=C\n1ccccc1`,
    near: sep,
    someUnknownKey: sep,
    count: 3,
  };
  const out = deepNormalizeLiteralLineBreaks(args) as typeof args;
  eq('deep: statement', out.statement, 'Solve.\n1) $x \\neq 2$');
  for (const k of ['title', 'label', 'caption', 'description', 'note', 'notes', 'text', 'problem', 'explanation', 'content', 'question', 'passage', 'keyIdea'] as const) {
    eq(`deep: prose key ${k} converted`, out[k], sepFixed);
  }
  eq('deep: array of strings under a prose key', out.hints[0], 'Look.\nAgain');
  eq('deep: nested prose keys', [out.steps[0].description, out.steps[0].explanation], [sepFixed, sepFixed]);
  eq('deep: nested maths key untouched', out.steps[0].expression, sep);
  for (const k of ['answerChoices', 'choices', 'options', 'answer', 'correctAnswer', 'correctChoice', 'solution', 'rows', 'headers', 'cells', 'columns', 'values', 'latex', 'code', 'expectedAnswer', 'smiles', 'near', 'someUnknownKey'] as const) {
    eq(`deep: ${k} byte-identical`, out[k], args[k]);
  }
  check('deep: non-strings pass through', out.count === 3);
  check('deep: input not mutated', args.statement === String.raw`Solve.\n1) $x \neq 2$`);
  eq('deep: a bare string is not prose-keyed', deepNormalizeLiteralLineBreaks(sep), sep);
  eq('deep: idempotent', deepNormalizeLiteralLineBreaks(out), out);

  // The reviewer's computer-science tool calls, end to end through the walk.
  const cs = {
    statement: String.raw`What does print("a\nb") output?`,
    answerChoices: [String.raw`a\nb`, 'a b', String.raw`\n`, 'ab'],
    expectedAnswer: String.raw`a\nb`,
  };
  eq('deep: CS show_problem byte-identical', deepNormalizeLiteralLineBreaks(cs), cs);
  const table = { title: 'Escapes', headers: ['escape', 'meaning'], rows: [[String.raw`\n`, 'newline'], [String.raw`\t`, 'tab']] };
  eq('deep: CS show_table byte-identical', deepNormalizeLiteralLineBreaks(table), table);
  const quiz = { question: 'Which escape is a line feed?', options: [String.raw`\n`, String.raw`\t`], answer: String.raw`\n` };
  eq('deep: CS show_quiz byte-identical', deepNormalizeLiteralLineBreaks(quiz), quiz);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
