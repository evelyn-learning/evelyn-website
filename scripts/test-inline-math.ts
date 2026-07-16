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
import { segment, autoWrapLatex } from '../src/lib/tutor/whiteboard/inline-math';

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

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
