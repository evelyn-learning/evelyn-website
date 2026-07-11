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
import { segment } from '../src/lib/tutor/whiteboard/inline-math';

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

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
