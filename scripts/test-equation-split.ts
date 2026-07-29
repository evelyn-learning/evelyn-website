/**
 * Equation reflow splitter (round-7 item 7).
 *
 * The whiteboard's EquationRenderer used to shrink long equations with a
 * transform scale (floor 0.32) — IMG_7874/7875 showed equation text at a
 * fraction of every other component's size. The renderer now REFLOWS
 * instead: split the LaTeX at top-level relations (then at +/- for an
 * oversized run) into an aligned/gathered block, and only falls back to
 * horizontal scroll when nothing can be split. This suite pins the pure
 * splitter.
 *
 * Run: npx tsx scripts/test-equation-split.ts
 */
import { splitLatexToLines } from '../src/lib/tutor/whiteboard/equation-split';

let failures = 0;
function check(name: string, cond: boolean, got?: unknown) {
  if (!cond) { failures++; console.error(`FAIL ${name}${got !== undefined ? ` — got: ${JSON.stringify(got)}` : ''}`); }
  else console.log(`ok ${name}`);
}

// 1. Chained equalities split one relation per line, aligned on the relation.
{
  const out = splitLatexToLines('a = b = c', 4);
  check('chain-split', out === '\\begin{aligned}a &= b \\\\ &= c\\end{aligned}', out);
}

// 2. Content within budget → null (no split needed).
check('fits-null', splitLatexToLines('a = b', 40) === null);

// 3. Existing environments and explicit line breaks are left alone.
check('env-null', splitLatexToLines('\\begin{aligned}a &= b\\end{aligned}', 4) === null);
check('linebreak-null', splitLatexToLines('a = b \\\\ c = d', 4) === null);

// 4. Relations inside braces are NOT split points.
check('brace-guard', splitLatexToLines('\\frac{a=b}{c} + \\frac{d=e}{f}', 8) !== null
  && !String(splitLatexToLines('\\frac{a=b}{c} + \\frac{d=e}{f}', 8)).includes('{a \\\\'));
{
  // The only top-level points here are the +; the = signs are inside \frac args.
  const out = splitLatexToLines('\\frac{a=b}{c} + \\frac{d=e}{f}', 8);
  check('brace-guard-gathered', String(out).startsWith('\\begin{gathered}'), out);
}

// 5. Relations inside \left...\right are not split points.
{
  const out = splitLatexToLines('\\left( x = 1 \\right) + \\left( y = 2 \\right)', 12);
  check('leftright-guard', String(out).includes('gathered'), out);
}

// 6. No relations: long sums split at top-level +/- into a gathered block
//    with binary-safe operators at line starts.
{
  const out = splitLatexToLines('x^5 + 4x^4 - 3x^3 + 2x^2', 10);
  check('sum-gathered', String(out).startsWith('\\begin{gathered}') === true, out);
  check('sum-binary-ops', /\\\\ {}[+-]/.test(String(out)), out);
}

// 7. Unary minus is not a split point.
check('unary-minus', splitLatexToLines('-x + y', 40) === null);
{
  const out = splitLatexToLines('a = -3x + b = c', 6);
  check('unary-after-rel', out !== null && !String(out).includes('= \\\\'), out);
}

// 8. Command relations (\leq, \approx) split like =; commands like \frac don't.
{
  const out = splitLatexToLines('a \\leq b \\approx c', 4);
  check('cmd-relations', out === '\\begin{aligned}a &\\leq b \\\\ &\\approx c\\end{aligned}', out);
}

// 9. Greedy packing: segments that fit together stay on one line.
{
  const out = splitLatexToLines('a = b = c = ddddddddddddd', 10);
  check('greedy-pack', out === '\\begin{aligned}a &= b = c \\\\ &= ddddddddddddd\\end{aligned}', out);
}

// 10. One relation with an over-budget RHS: RHS continues on +/- lines,
//     indented past the relation column.
{
  const out = splitLatexToLines('f(x) = x^5 + 4x^4 - 3x^3 + 2x^2 - x + 7', 14);
  check('rhs-subsplit-aligned', String(out).startsWith('\\begin{aligned}'), out);
  check('rhs-subsplit-continuation', /\\\\ &\\quad {}[+-]/.test(String(out)), out);
}

// 11. No top-level split points at all → null (caller falls back to scroll).
check('atomic-null', splitLatexToLines('\\frac{aaaaaaaaaaaaaaaaaaaa}{bbbbbbbbbbbbbbbbb}', 8) === null);

// ─── layout: 'left' (round-8, IMG_7893/7894 clipping) ───────────────────
// Column-aligned rows lay out as (widest LHS) + (widest RHS): on a narrow
// pane every continuation line starts where line 1's relation sits, which
// can be past the right edge. The left-flush layout starts every row at a
// common left margin (continuations get a \quad indent), so total width is
// max(single row) — the true wrap.

// 12. Chained equalities, left-flush: same greedy packing as columns
//     ("a = b" fits budget 4 together), rows lead from the left margin,
//     continuation joiners keep relation spacing via a leading {}.
{
  const out = splitLatexToLines('a = b = c', 4, 'left');
  check('left-chain', out === '\\begin{aligned}&a = b \\\\ &\\quad {}= c\\end{aligned}', out);
}

// 13. First row keeps its own relation when it fits one ("a = b" then "= c").
{
  const out = splitLatexToLines('a = b = ddddddddddddd', 10, 'left');
  check('left-greedy', out === '\\begin{aligned}&a = b \\\\ &\\quad {}= ddddddddddddd\\end{aligned}', out);
}

// 14. Over-budget RHS sub-splits at +/- — same left margin, op joiners.
{
  const out = splitLatexToLines('f(x) = x^5 + 4x^4 - 3x^3 + 2x^2 - x + 7', 14, 'left');
  check('left-rhs-subsplit', String(out).startsWith('\\begin{aligned}&f(x)'), out);
  check('left-op-rows', /\\\\ &\\quad {}[+-]/.test(String(out)), out);
  check('left-no-column-align', !/[^&\\]&[=<>]/.test(String(out)), out);
}

// 15. Default layout unchanged — explicit 'columns' equals the omitted form.
{
  check('columns-default', splitLatexToLines('a = b = c', 4, 'columns') === splitLatexToLines('a = b = c', 4));
}

// 16. No-relations input under 'left' still packs (gathered stays fine —
//     its width is already max(row)).
{
  const out = splitLatexToLines('x^5 + 4x^4 - 3x^3 + 2x^2', 10, 'left');
  check('left-gathered', String(out).startsWith('\\begin{gathered}'), out);
}

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('test:equation-split PASS');
