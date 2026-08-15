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
import { segment, autoWrapLatex, normalizeSentenceGaps } from '../apps/marketing/src/lib/tutor/whiteboard/inline-math';

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

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
