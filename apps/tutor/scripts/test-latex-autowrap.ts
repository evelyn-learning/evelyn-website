/**
 * Smoke test for the EquationRenderer's auto-wrap behavior. Pure
 * regex/string check — verifies that latex containing `\\` or `\hline`
 * gets wrapped in \begin{aligned}...\end{aligned} when not already
 * inside a math environment. Catches the 2026-04-29 algebra session
 * #30 "Subtraction Step" bleeding case and confirms we don't double-
 * wrap latex that's already inside an environment.
 *
 * Run: npx ts-node -O '{"module":"commonjs","moduleResolution":"node"}' --transpile-only scripts/test-latex-autowrap.ts
 */

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

// Mirror of the auto-wrap logic in EquationRenderer.tsx. Keep in sync.
function autoWrap(latex: string): string {
  let processed = latex
    .replace(/\\\\(?=[a-zA-Z{])/g, '\\')
    .replace(/\\n(?![a-zA-Z])/g, '\n');
  const isAlreadyWrapped = /\\begin\{(aligned|array|cases|matrix|gathered|split|align|alignat|equation|multline)\}/.test(processed);
  const looksMultiLine = /\\\\|\\hline\b/.test(processed);
  if (looksMultiLine && !isAlreadyWrapped) {
    processed = processed.replace(/^\s*\\\\\s*/, '');
    processed = `\\begin{aligned}${processed}\\end{aligned}`;
  }
  return processed;
}

console.log('\n=== Wrap multi-line latex when not already in an environment ===');
{
  // The exact string from 2026-04-29 algebra session #30
  const bleed = '10x + 15y = 60 \\\\ -\\;(10x + 8y = 46) \\\\ \\hline 7y = 14 \\implies y = 2';
  const wrapped = autoWrap(bleed);
  check('algebra-session bleed wraps in aligned',
    wrapped.startsWith('\\begin{aligned}') && wrapped.endsWith('\\end{aligned}'),
    wrapped.slice(0, 40) + '…');
}
{
  const simple = 'a + b = c \\\\ d + e = f';
  const wrapped = autoWrap(simple);
  check('two-line eq wraps', wrapped.startsWith('\\begin{aligned}'), wrapped);
}
{
  const onlyHline = '3 + 5 \\hline 8';
  const wrapped = autoWrap(onlyHline);
  check('\\hline alone triggers wrap', wrapped.startsWith('\\begin{aligned}'), wrapped);
}

console.log('\n=== Do NOT wrap when already inside an environment ===');
{
  const aligned = '\\begin{aligned} a &= b \\\\ c &= d \\end{aligned}';
  const wrapped = autoWrap(aligned);
  check('already-aligned latex untouched', wrapped === aligned, wrapped.slice(0, 60));
}
{
  const array = '\\begin{array}{c} x \\\\ y \\\\ z \\end{array}';
  const wrapped = autoWrap(array);
  check('array environment untouched', wrapped === array);
}
{
  const cases = '\\begin{cases} x & x > 0 \\\\ -x & x \\le 0 \\end{cases}';
  const wrapped = autoWrap(cases);
  check('cases environment untouched', wrapped === cases);
}
{
  const matrix = '\\begin{matrix} 1 \\\\ 2 \\end{matrix}';
  const wrapped = autoWrap(matrix);
  check('matrix environment untouched', wrapped === matrix);
}

console.log('\n=== Single-line latex stays untouched ===');
{
  const single = 'x^2 + y^2 = r^2';
  const wrapped = autoWrap(single);
  check('single-line latex untouched', wrapped === single);
}
{
  const fracted = '\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}';
  const wrapped = autoWrap(fracted);
  check('fraction-only latex untouched', wrapped === fracted);
}
{
  const integral = '\\int_0^1 x \\, dx = \\frac{1}{2}';
  const wrapped = autoWrap(integral);
  check('integral untouched', wrapped === integral);
}

console.log('\n=== Edge cases ===');
{
  // Stray leading \\ should be stripped before wrap
  const leading = '\\\\ a + b = c \\\\ d + e = f';
  const wrapped = autoWrap(leading);
  check('leading \\\\ stripped before wrap',
    !wrapped.startsWith('\\begin{aligned}\\\\') && wrapped.startsWith('\\begin{aligned}'),
    wrapped.slice(0, 40));
}
{
  // \neq should NOT match \\n* — already protected by the existing escape fix
  const neq = '23 \\neq 5';
  const wrapped = autoWrap(neq);
  check('\\neq does NOT trigger wrap', wrapped === neq, wrapped);
}

console.log(`\n=== Result: ${pass} pass, ${fail} fail ===`);
process.exit(fail > 0 ? 1 : 0);
