/** Round 4 (E2): a y-axis shading whose bounds are functions of x is drawn as
 *  x-shading (and vice versa); both renderers use the normalized region.
 *  Usage: npx tsx scripts/test-shaded-region.ts */
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolveShadedRegionAxis, normalizeShadedRegion, parseFunctionString, parseFunctionOfYString } from '../src/lib/tutor/whiteboard/math-expr';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };

const live = { axis: 'y' as 'x' | 'y', between: ['-0.5*x + 4', 'x + 1'], from: -2, to: 2, color: '#a855f7', opacity: 0.35 };
{
  const warns: string[] = [];
  const orig = console.warn;
  console.warn = (...a: unknown[]) => { warns.push(a.map(String).join(' ')); };
  normalizeShadedRegion(live);
  normalizeShadedRegion(live);
  console.warn = orig;
  assert(warns.length === 1 && warns[0].includes('y → x'), 'warns exactly once per page load');
}
const r = resolveShadedRegionAxis(live);
assert(r.axis === 'x' && r.corrected, 'live 2026-09-24: axis y with x-bounds → x');
const n = normalizeShadedRegion(live);
assert(n.axis === 'x' && n.from === -2 && n.to === 2 && n.color === '#a855f7' && n.between === live.between, 'normalize keeps every other field');
assert(parseFunctionString(n.between[0])(0) === 4 && parseFunctionString(n.between[1])(0) === 1, 'bounds evaluate as f(x)');
assert(Number.isNaN(parseFunctionOfYString(live.between[0])(0)), 'the bug: as g(y) they are NaN');
assert(!resolveShadedRegionAxis({ axis: 'y', between: ['y^2', 'y+2'] }).corrected, 'a genuine x = g(y) region stays y');
assert(resolveShadedRegionAxis({ axis: 'x', between: ['x^2', '0'] }).axis === 'x', 'area under a curve stays x');
assert(resolveShadedRegionAxis({ axis: 'x', between: ['y^2', '4'] }).axis === 'y', 'x-axis with y-bounds → y');
assert(resolveShadedRegionAxis({ axis: 'y', between: ['0', '3'] }).axis === 'y', 'constants only: the declared axis stands');
assert(resolveShadedRegionAxis({ axis: 'y', between: ['2x', 'y'] }).axis === 'y', 'any y reference keeps y');
assert(resolveShadedRegionAxis({ axis: 'y', between: ['e^{x}', '1'] }).axis === 'x', 'a LaTeX x-bound counts');
assert(resolveShadedRegionAxis({ axis: 'y', between: ['exp(1)', '2'] }).axis === 'y', '"exp" is not an x reference');
assert(resolveShadedRegionAxis({ axis: 'y', between: 'nope' }).axis === 'y', 'malformed between: declared axis');

const dir = join(__dirname, '..', 'src/app/tutor');
const mafs = readFileSync(join(dir, 'components/whiteboard/GraphRenderer.tsx'), 'utf8');
const desmos = readFileSync(join(dir, 'components/whiteboard/DesmosGraphRenderer.tsx'), 'utf8');
const tools = readFileSync(join(dir, 'hooks/toolDefinitions.ts'), 'utf8');
assert(mafs.includes('normalizeShadedRegion(rawShadedRegion)'), 'wiring: Mafs renderer normalizes');
assert(desmos.includes('normalizeShadedRegion(data.shadedRegion)'), 'wiring: Desmos renderer normalizes');
assert(tools.includes("'x' when the two bounds are y=f(x) and from/to are x-values (the usual case, incl. regions between two lines); 'y' only when the bounds are x=g(y) and from/to are y-values."), 'tool schema describes axis');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
