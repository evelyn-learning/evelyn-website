/**
 * Unit tests for normalizeCellForKatex (CellContent.tsx).
 *
 * R45 Task 6 — live failures from session portal-d7ec8e42: a show_table
 * header cell rendered "Beststrategyfor f^( n)(x)" (spaces eaten — the old
 * per-word \text{} wrap put math-mode whitespace BETWEEN \text{} blocks,
 * which KaTeX discards) and "Productrule—butfor f^(n), considertheLeibniz
 * rule". Also bare parenthesized superscripts f^(n) rendered as f^( plus a
 * glued superscript n).
 *
 * normalizeCellForKatex fixes both: (a) braces bare parenthesized
 * superscripts f^(n) -> f^{(n)}; (b) wraps whole prose word-RUNS (not one
 * \text{} per word) so inter-word spaces land INSIDE \text{}, where KaTeX
 * actually preserves them.
 *
 * Usage: npx tsx scripts/test-cell-content-normalize.ts  (npm run test:cell-content)
 */
import { normalizeCellForKatex } from '../src/app/tutor/components/whiteboard/cellContentNormalize';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// --- Fixture 1: live header cell — "Beststrategyfor f^( n)(x)" bug ---
{
  const out = normalizeCellForKatex('Best strategy for f^(n)(x)');
  check('fixture1: prose run wrapped with trailing space inside \\text{}', out.includes('\\text{Best strategy for }'), out);
  check('fixture1: superscript braced', out.includes('^{(n)}'), out);
  check('fixture1: no per-word \\text{} splitting', !/\\text\{Best\}/.test(out) && !/\\text\{strategy\}/.test(out), out);
}

// --- Fixture 2: live cell — "Productrule—butfor f^(n), considertheLeibnizrule" bug ---
{
  const out = normalizeCellForKatex('Product rule — but for f^(n), consider the Leibniz rule');
  check('fixture2: superscript braced', out.includes('^{(n)}'), out);
  check('fixture2: first prose run wrapped (through "for")', out.includes('\\text{Product rule — but for'), out);
  check('fixture2: second prose run wrapped (Leibniz clause)', out.includes('Leibniz rule}'), out);
  const textBlocks = out.match(/\\text\{[^}]*\}/g) ?? [];
  check('fixture2: exactly two \\text{} runs (not one-per-word)', textBlocks.length === 2, JSON.stringify(textBlocks));
}

// --- Fixture 3: pure math cell — MUST NOT regress (byte-unchanged) ---
{
  const input = 'e^{kx}, sin(kx), cos(kx)';
  const out = normalizeCellForKatex(input);
  check('fixture3: pure math cell byte-unchanged', out === input, out);
}

// --- Edge case: single prose word, no filler-word signal — unchanged ---
{
  const input = 'Derivative';
  check('single word "Derivative" unchanged (no prose signal to trigger wrap)', normalizeCellForKatex(input) === input);
}

// --- Edge case: pure prose, no math signal at all ---
// Note: CellContent's hasLatexCmd/hasSubSup gate means a cell like this
// never reaches normalizeCellForKatex in the component (renders as plain
// text instead of going through KaTeX at all). We still pin the helper's
// own behavior here for completeness: no filler word in the list, no
// backslash/^/{/} present, so it's a no-op.
{
  const input = 'Function shape';
  check('pure prose "Function shape" unchanged by helper (component never calls KaTeX for it — no \\ or ^/{/})', normalizeCellForKatex(input) === input);
}

// --- Edge case: plain digit superscript (^2) is untouched by the brace-fix
// (step (a) only targets ^(...) — not ^2), and the prose run correctly
// absorbs the space between it and the math that follows. ---
{
  const input = 'solve for x^2 + y^2';
  const out = normalizeCellForKatex(input);
  check('bare digit superscript x^2 untouched', out.includes('x^2') && out.includes('y^2'), out);
  check('prose run "solve for" wrapped with trailing space inside \\text{}', out.includes('\\text{solve for }'), out);
}

// --- Edge case: backslash-command word (\theta) is skipped by the wrap, not swallowed into \text{} ---
{
  const input = 'the angle \\theta is obtuse';
  const out = normalizeCellForKatex(input);
  check('\\theta left as a bare command, not wrapped in \\text{}', out.includes('\\theta') && !out.includes('\\text{theta}'), out);
  check('surrounding prose still wrapped', /\\text\{the angle/.test(out) && /is obtuse\}/.test(out), out);
}

// --- Edge case: named math function (sin/cos) inside a prose-signal cell stays bare ---
{
  const input = 'the value of sin(x) for small x';
  const out = normalizeCellForKatex(input);
  check('sin(...) not wrapped in \\text{} even with prose signal present', !/\\text\{[^}]*sin/.test(out), out);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
