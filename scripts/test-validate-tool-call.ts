import { validateToolCall } from '../src/lib/tutor/whiteboard/validate-tool-call';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

// Existing structural rules unchanged
check('table-empty-rows', validateToolCall('show_table', { rows: [] }).ok === false);
check('table-rows-ok', validateToolCall('show_table', { rows: [['a']] }).ok === true);
check('molecule-no-smiles', validateToolCall('show_molecule', { smiles: ' ' }).ok === false);

// Variable self-application in equation latex (2026-07-22 live session:
// brain emitted "x(x)" for "f(x)" — student caught it on the board; the
// corrupted card then re-entered the board snapshot and the brain kept
// reproducing it across turns even after acknowledging the typo).
const bad1 = validateToolCall('show_equation', { latex: 'x(x) = \\frac{x+1}{(x-1)(x+3)}' });
check('selfapp-rejected', bad1.ok === false);
check('selfapp-reason-names-it', !bad1.ok && /x\(x\)/.test(bad1.reason));
check('selfapp-lim', validateToolCall('show_equation', {
  latex: 'x = a \\text{ is a vertical asymptote of } f \\iff \\lim_{x\\to a^-}x(x) = \\pm\\infty',
}).ok === false);
check('selfapp-spaced', validateToolCall('show_equation', { latex: 't( t ) = 5' }).ok === false);
check('selfapp-camelcase-name', validateToolCall('showEquation', { latex: 'y(y)=1' }).ok === false);

// Legitimate function/multiplication notation passes
check('fx-ok', validateToolCall('show_equation', { latex: 'f(x) = \\frac{1}{x-2}' }).ok === true);
check('factor-ok', validateToolCall('show_equation', { latex: 'x(x+2) = 0' }).ok === true);
check('compose-ok', validateToolCall('show_equation', { latex: 'f(f(2)) = 3' }).ok === true);
check('vt-ok', validateToolCall('show_equation', { latex: 'v(t) = at' }).ok === true);
check('no-latex-ok', validateToolCall('show_equation', {}).ok === true);
check('prose-label-ok', validateToolCall('show_equation', {
  latex: 'P = 2l + 2w \\text{ where perimeter (r) is in cm}',
}).ok === true);

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('test:validate-tool-call PASS');
