/**
 * Practice-figure renderer (src/lib/tutor/practice-figure/) — the authoring
 * path that turns `{ type, params }` into the SVG stored on a bank row.
 *
 * Under test:
 *   - render.ts `renderPracticeFigure` over every fixture
 *     (scripts/lib/practice-figure-fixtures.ts, ≥ 2 per kind): renders,
 *     passes the safety validator, is deterministic, has a viewBox and no
 *     pixel-sized root, carries its own font and white background, keeps
 *     every label inside the canvas, uses ids no other figure uses, stays
 *     far under the contract's size bound, and is legible at 340 px wide;
 *   - NOTHING STATES THE ANSWER by default — per kind, the opt-in that does;
 *   - what the figure DRAWS: corners stay corners on a motion graph; a pole
 *     is never joined across; a titration curve has the chemistry's numbers;
 *   - expr.ts `compileExpression` — understood completely or refused;
 *   - slope-field.ts `slopeFieldSamples` / `slopeFieldSolution`;
 *   - plot-frame.ts tick arithmetic;
 *   - the 2026-10-09 legibility round: dash patterns and palette, one
 *     function in pieces, end markers, dots on top, vertexDots, π ticks,
 *     inset slope fields, and legibility.ts `checkFigureLegibility`;
 *   - bad specs fail with `PracticeFigureSpecError`, and text / colour params
 *     cannot inject markup;
 *   - `buildPracticeFigure` (what a bank row stores) against the contract.
 *
 * Pure: no database, no network, no model.
 * Run: npm run test:practice-figure-render   (npx tsx scripts/test-practice-figure-render.ts)
 */
import { strict as assert } from 'node:assert';
import { PracticeFigureSchema } from '@evelyn/portal-contract/v1';
import {
  ALL_PRACTICE_FIGURE_KINDS,
  BATCH1_FIGURE_KINDS,
  PRACTICE_FIGURE_KINDS,
  PracticeFigureSpecError,
  buildPracticeFigure,
  renderPracticeFigure,
  sampleCurve,
  standaloneFromMarkup,
  titrationPH,
  type PracticeFigureSpec,
} from '../src/lib/tutor/practice-figure/render';
import { ExpressionError, compileExpression } from '../src/lib/tutor/practice-figure/expr';
import { slopeFieldSamples, slopeFieldSolution } from '../src/lib/tutor/practice-figure/slope-field';
import { MAX_FIGURE_SVG_CHARS, validateFigureSvg } from '../src/lib/tutor/practice-figure/svg-safety';
import { GUIDE_COLOR, GUIDE_DASH, SERIES_COLORS, SERIES_DASHES, assignDashes, niceBounds, niceStep, piTickText, stepDecimals, tickText, tickTexts, ticksBetween } from '../src/lib/tutor/practice-figure/plot-frame';
import { checkFigureLegibility } from '../src/lib/tutor/practice-figure/legibility';
import { Reader } from '../src/lib/tutor/practice-figure/spec';
import { vectorDiagramModel } from '../src/lib/tutor/practice-figure/kinds/vector-diagram';
import { fbdLayout, freeBodyModel } from '../src/lib/tutor/practice-figure/kinds/free-body';
import { punnettModel } from '../src/lib/tutor/practice-figure/kinds/punnett';
import { pedigreeLayout, pedigreeModel } from '../src/lib/tutor/practice-figure/kinds/pedigree';
import { findViolations } from './lib/svg-text-extents';
import { FIGURE_FIXTURES } from './lib/practice-figure-fixtures';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  }
}

const svgOf = (type: string, params: Record<string, unknown>): string => renderPracticeFigure({ type, params }).svg;
const rootTag = (svg: string): string => /^<svg\b[^>]*>/.exec(svg)?.[0] ?? '';
const viewBox = (svg: string): [number, number] => {
  const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(rootTag(svg));
  assert.ok(m, 'root viewBox "0 0 W H"');
  return [Number(m[1]), Number(m[2])];
};
/** Text content of every <text>, tags stripped, entities decoded. */
const texts = (svg: string): string[] => [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)]
  .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
const fontSizes = (svg: string): number[] => [...svg.matchAll(/<(?:text|tspan)\b[^>]*\sfont-size="([\d.]+)"/g)].map((m) => Number(m[1]));
const throwsSpec = (spec: PracticeFigureSpec, re: RegExp): void => {
  assert.throws(() => renderPracticeFigure(spec), (e: unknown) => e instanceof PracticeFigureSpecError && re.test(e.message), `${spec.type}: ${re}`);
};

console.log('\nEvery fixture (≥ 2 per kind):\n');

test('the fixtures cover every kind at least twice', () => {
  for (const kind of PRACTICE_FIGURE_KINDS) {
    assert.ok(FIGURE_FIXTURES.filter((f) => f.spec.type === kind).length >= 2, kind);
  }
  assert.equal(new Set(FIGURE_FIXTURES.map((f) => f.id)).size, FIGURE_FIXTURES.length, 'fixture ids are unique');
});

const rendered = new Map<string, string>();
for (const fx of FIGURE_FIXTURES) {
  test(`${fx.id} (${fx.spec.type}) — renders standalone, safe, deterministic, in bounds`, () => {
    const svg = renderPracticeFigure(fx.spec).svg;
    rendered.set(fx.id, svg);
    // Deterministic — and independent of the object identity of the spec.
    assert.equal(renderPracticeFigure(JSON.parse(JSON.stringify(fx.spec))).svg, svg);
    assert.deepEqual(validateFigureSvg(svg), { ok: true });
    assert.ok(svg.length < MAX_FIGURE_SVG_CHARS / 4, `size ${svg.length}`);
    // Root: one <svg>, namespace, viewBox, NO pixel size, its own font.
    const root = rootTag(svg);
    assert.ok(svg.startsWith('<svg ') && svg.endsWith('</svg>'));
    assert.ok(root.includes('xmlns="http://www.w3.org/2000/svg"'));
    const [W, H] = viewBox(svg);
    assert.ok(W >= 300 && H >= 60 && H <= W * 1.6, `canvas ${W}×${H}`);
    assert.ok(!/\s(?:width|height)=/.test(root), 'no width/height on the root');
    assert.ok(!/\sstyle=/.test(root), 'no sizing style on the root');
    assert.ok(/font-family="[^"]*sans-serif"/.test(root), 'a font stack that needs no app CSS');
    // An explicit white background as the first thing drawn.
    assert.ok(svg.slice(root.length).startsWith(`<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>`));
    // Nothing that only means something inside the app.
    assert.ok(!/\sclass=|\sdata-|className|var\(--|currentColor/.test(svg));
    // Every id carries this figure's own prefix; every reference resolves.
    const idList = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    for (const id of idList) assert.match(id, /^pf[0-9a-z]+-/);
    for (const m of svg.matchAll(/url\(#([^)]+)\)/g)) assert.ok(idList.includes(m[1]), `dangling reference ${m[1]}`);
    // Labels stay on the canvas (horizontal extent, estimated).
    assert.deepEqual(findViolations(svg), []);
    for (const m of svg.matchAll(/<text\b[^>]*\sy="(-?[\d.]+)"/g)) assert.ok(Number(m[1]) >= 0 && Number(m[1]) <= H + 0.5, `text y ${m[1]} within 0..${H}`);
    // No NaN / Infinity leaked into a coordinate.
    assert.ok(!/NaN|Infinity|undefined/.test(svg));
    // What the bank row stores validates against the contract.
    PracticeFigureSchema.parse(buildPracticeFigure(fx.spec, fx.alt));
  });
}

test('no two fixtures share an id prefix (figures can be inlined side by side)', () => {
  const prefixes = new Map<string, string>();
  for (const [id, svg] of rendered) {
    for (const m of svg.matchAll(/\sid="(pf[0-9a-z]+)-/g)) {
      assert.ok(!prefixes.has(m[1]) || prefixes.get(m[1]) === id, `${m[1]} used by ${prefixes.get(m[1])} and ${id}`);
      prefixes.set(m[1], id);
    }
  }
  assert.ok(prefixes.size >= 10);
});

test('legible at 340 px: the smallest type on every plot-frame figure is ≥ 10 px there (board-rendered FBD ≥ 7 px)', () => {
  for (const fx of FIGURE_FIXTURES) {
    const svg = rendered.get(fx.id) as string;
    const [W] = viewBox(svg);
    // The lowered "a" of "Ea" is a subscript, not a label.
    const sizes = fontSizes(svg).filter((s) => s !== 8);
    assert.ok(sizes.length > 0, fx.id);
    const px = (Math.min(...sizes) * 340) / W;
    if (fx.spec.type === 'free_body_diagram') assert.ok(px >= 7, `${fx.id}: ${px.toFixed(1)} px`);
    else assert.ok(px >= 10, `${fx.id}: ${px.toFixed(1)} px`);
  }
});

console.log('\nNothing states the answer unless the spec asks:\n');

test('title: absent by default on every kind, drawn only when given', () => {
  for (const fx of FIGURE_FIXTURES) {
    if (fx.spec.params.title) continue;
    const withTitle = renderPracticeFigure({ type: fx.spec.type, params: { ...fx.spec.params, title: 'Zebra Quartz Title' } }).svg;
    assert.ok(texts(withTitle).join(' ').includes('Zebra Quartz Title'), fx.id);
    assert.ok(!texts(rendered.get(fx.id) as string).join(' ').includes('Zebra'), fx.id);
    assert.deepEqual(validateFigureSvg(withTitle), { ok: true });
  }
});

test('bar_chart: bar values are not printed; showValues prints them', () => {
  const params = { categories: ['Mon', 'Tue', 'Wed'], values: [13, 17, 7], yLabel: 'Books' };
  const plain = texts(svgOf('bar_chart', params));
  for (const v of ['13', '17', '7']) assert.ok(!plain.includes(v), `value ${v} is not on the figure`);
  assert.ok(plain.includes('Mon') && plain.includes('Books'));
  const shown = texts(svgOf('bar_chart', { ...params, showValues: true }));
  for (const v of ['13', '17', '7']) assert.ok(shown.includes(v));
});

test('reaction_coordinate: no Ea / ΔH marks or values by default; symbols with annotate; values only with annotateValues', () => {
  const params = { productsEnergy: -45, activationEnergies: [65] };
  const plain = texts(svgOf('reaction_coordinate', params)).join(' | ');
  assert.ok(!/ΔH|Ea|65|45 kJ/.test(plain.replace(/Energy \(kJ\/mol\)/, '')), plain);
  assert.ok(plain.includes('Reactants') && plain.includes('Products'));
  const sym = texts(svgOf('reaction_coordinate', { ...params, annotate: ['Ea', 'deltaH'] })).join(' | ');
  assert.ok(sym.includes('ΔH') && sym.includes('Ea'));
  assert.ok(!sym.includes('65 kJ/mol') && !sym.includes('45 kJ/mol'));
  const vals = texts(svgOf('reaction_coordinate', { ...params, annotate: ['Ea', 'deltaH'], annotateValues: true })).join(' | ');
  assert.ok(vals.includes('Ea = 65 kJ/mol') && vals.includes('ΔH = −45 kJ/mol'), vals);
  // Qualitative axis: no numbers at all.
  const qual = texts(svgOf('reaction_coordinate', { ...params, showAxisValues: false }));
  assert.ok(!qual.some((t) => /\d/.test(t)), qual.join(' | '));
});

test('titration_curve: nothing marked by default; marks are dots and guide lines, never numbers', () => {
  const params = { analyte: { type: 'weak_acid', concentration: 0.1, volume: 25, pKa: 4.76 }, titrantConcentration: 0.1 };
  const plain = svgOf('titration_curve', params);
  assert.ok(!/equivalence/.test(plain) && !/<circle/.test(plain));
  const marked = svgOf('titration_curve', { ...params, mark: ['equivalence', 'half_equivalence'] });
  assert.equal((marked.match(/<circle/g) ?? []).length, 4, 'two marks + their two legend dots');
  const t = texts(marked).join(' | ');
  assert.ok(t.includes('equivalence point') && t.includes('half-equivalence point'));
  assert.ok(!/4\.76|8\.7|pKa/.test(t), t);
});

test('scatter_plot: a trend line carries no equation unless showEquation', () => {
  const params = { points: [[1, 3], [2, 5], [3, 7], [4, 9]], trendLine: true };
  assert.ok(!texts(svgOf('scatter_plot', params)).some((t) => t.includes('y =')));
  assert.ok(texts(svgOf('scatter_plot', { ...params, showEquation: true })).includes('y = 2x + 1'));
  assert.ok(!/<line[^>]*stroke-width="1.6"/.test(svgOf('scatter_plot', { points: params.points })), 'no line unless asked');
});

test('slope_field: the expression is not printed, and no solution curve is drawn, unless asked', () => {
  const params = { expr: 'x - y', xRange: [-3, 3], yRange: [-3, 3] };
  const plain = svgOf('slope_field', params);
  assert.ok(!texts(plain).some((t) => t.includes('dy/dx')));
  assert.equal((plain.match(/<circle/g) ?? []).length, 0);
  const asked = svgOf('slope_field', { ...params, showExpression: true, solutionThrough: [0, 1] });
  assert.ok(texts(asked).includes('dy/dx = x - y'));
  assert.equal((asked.match(/<circle/g) ?? []).length, 1);
});

test('function_graph: curve labels appear only when given; expressions are never printed', () => {
  const plain = texts(svgOf('function_graph', { xRange: [-3, 3], yRange: [-3, 3], curves: [{ expr: 'x^2 - 1' }] }));
  assert.ok(!plain.some((t) => /x\^2|x\*\*2|x²/.test(t)), plain.join(' | '));
  assert.ok(texts(svgOf('function_graph', { xRange: [-3, 3], yRange: [-3, 3], curves: [{ expr: 'x^2 - 1', label: 'f' }] })).includes('f'));
});

console.log('\nWhat is drawn:\n');

test('motion_graph: linear interpolation keeps every corner — one straight segment per pair of samples', () => {
  const svg = svgOf('motion_graph', { series: [{ points: [[0, 0], [2, 8], [5, 8], [8, -4]] }] });
  const d = /<path d="(M[^"]+)" fill="none" stroke="#1d4ed8"/.exec(svg)?.[1] ?? '';
  assert.match(d, /^M[\d.]+,[\d.]+(L[\d.]+,[\d.]+){3}$/, d);
  const ys = [...d.matchAll(/[ML][\d.]+,([\d.]+)/g)].map((m) => Number(m[1]));
  assert.equal(ys[1], ys[2], 'the rest from t = 2 to t = 5 is level');
  // Zero is on the value axis, and the numbers are round.
  const t = texts(svg);
  for (const label of ['0', '2', '4', '6', '8', '−4', 'Time (s)', 'Position (m)']) assert.ok(t.includes(label), label);
  // Smooth is opt-in and uses curves.
  assert.ok(/<path d="M[\d.,]+ ?C/.test(svgOf('motion_graph', { interpolation: 'smooth', series: [{ points: [[0, 0], [1, 5], [2, 8], [3, 9]] }] })));
  // Samples in any order, and as objects.
  assert.equal(
    svgOf('motion_graph', { series: [{ points: [{ t: 5, value: 8 }, { t: 0, value: 0 }, { t: 2, value: 8 }, { t: 8, value: -4 }] }] }).match(/<path d="(M[^"]+)" fill="none" stroke="#1d4ed8"/)?.[1],
    d,
  );
});

test('sampleCurve: a pole is two pieces, never joined across; each piece runs off the plot', () => {
  const pieces = sampleCurve((x) => 1 / (x - 1), -4, 6, -5, 5);
  assert.equal(pieces.length, 2);
  const [left, right] = pieces;
  assert.ok(left.every(([x]) => x < 1) && right.every(([x]) => x > 1));
  assert.ok(left[left.length - 1][1] <= -5, 'left branch leaves through the bottom');
  assert.ok(right[0][1] >= 5, 'right branch enters from the top');
  // y is clamped — no absurd coordinates.
  assert.ok(pieces.flat().every(([, y]) => y >= -15 && y <= 15));
  // tan on [-5, 5]: poles at ±π/2 and ±3π/2 ⇒ five pieces.
  assert.equal(sampleCurve(Math.tan, -5, 5, -6, 6).length, 5);
});

test('sampleCurve: a jump is a break; a steep continuous curve is not; a partly-defined curve starts at its edge', () => {
  const step = sampleCurve((x) => (x < 1 ? x + 2 : -1), -5, 5, -4, 6);
  assert.equal(step.length, 2);
  assert.ok(Math.abs(step[0][step[0].length - 1][0] - 1) < 1e-6 && Math.abs(step[0][step[0].length - 1][1] - 3) < 1e-4);
  assert.ok(Math.abs(step[1][0][0] - 1) < 1e-6 && step[1][0][1] === -1);
  assert.equal(sampleCurve((x) => 50 * x, -1, 1, -5, 5).length, 1);
  assert.equal(sampleCurve((x) => x ** 3, -3, 3, -2, 2).length, 1);
  const root = sampleCurve((x) => Math.sqrt(x), -2, 4, -1, 3);
  assert.equal(root.length, 1);
  assert.ok(Math.abs(root[0][0][0]) < 1e-9 && Math.abs(root[0][0][1]) < 1e-4, `starts at the origin, got ${root[0][0]}`);
  assert.deepEqual(sampleCurve(() => NaN, 0, 1, 0, 1), []);
});

test('function_graph: open / closed endpoint marks sit on the domain ends', () => {
  const svg = svgOf('function_graph', {
    xRange: [-4, 4], yRange: [-4, 4],
    curves: [{ expr: 'x + 1', domain: [-3, 1], from: 'closed', to: 'open' }],
    points: [{ x: 1, y: -2, label: 'A' }, { x: 0, y: 0, open: true }],
  });
  const circles = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="3.8" fill="(#[0-9a-f]+)"/g)].map((m) => m[3]);
  assert.deepEqual(circles, ['#1d4ed8', '#ffffff', '#111827', '#ffffff']);
  assert.ok(texts(svg).includes('A'));
  throwsSpec({ type: 'function_graph', params: { xRange: [-4, 4], yRange: [-4, 4], curves: [{ expr: 'x', to: 'open' }] } }, /needs that end of domain/);
});

test('titration_curve: the chemistry is right', () => {
  const near = (a: number, b: number, tol: number, what: string) => assert.ok(Math.abs(a - b) <= tol, `${what}: ${a} vs ${b}`);
  // 25 mL of 0.100 M weak acid (pKa 4.76) with 0.100 M strong base.
  const ka = 10 ** -4.76;
  near(titrationPH('weak_acid', ka, 0.1, 25, 0.1, 0), 2.88, 0.01, 'initial pH');
  near(titrationPH('weak_acid', ka, 0.1, 25, 0.1, 12.5), 4.76, 0.01, 'half-equivalence pH = pKa');
  near(titrationPH('weak_acid', ka, 0.1, 25, 0.1, 25), 8.73, 0.01, 'equivalence pH');
  near(titrationPH('weak_acid', ka, 0.1, 25, 0.1, 50), 12.52, 0.01, 'excess base');
  // Strong acid / strong base.
  near(titrationPH('strong_acid', 0, 0.1, 25, 0.1, 0), 1, 0.001, 'strong acid initial');
  near(titrationPH('strong_acid', 0, 0.1, 25, 0.1, 25), 7, 0.001, 'strong-strong equivalence');
  near(titrationPH('strong_acid', 0, 0.1, 25, 0.1, 24.9), 3.7, 0.01, 'just before');
  // Bases titrated with strong acid mirror these.
  near(titrationPH('strong_base', 0, 0.1, 25, 0.1, 0), 13, 0.001, 'strong base initial');
  near(titrationPH('weak_base', 1e-14 / 10 ** -4.75, 0.1, 25, 0.1, 12.5), 9.25, 0.01, 'weak base half-equivalence = pKa of the conjugate acid');
  throwsSpec({ type: 'titration_curve', params: { analyte: { type: 'weak_acid', concentration: 0.1, volume: 25 }, titrantConcentration: 0.1 } }, /pKa/);
  throwsSpec({ type: 'titration_curve', params: { analyte: { type: 'strong_acid', concentration: 0.1, volume: 25 }, titrantConcentration: 0.1, maxVolume: 20, mark: ['equivalence'] } }, /outside 0\.\.maxVolume/);
});

test('line_plot: dots sit on a number line drawn to scale, one per value', () => {
  const svg = svgOf('line_plot', { values: [1, 1, 2, 4, 4, 4, 8] });
  const dots = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)"/g)].map((m) => [Number(m[1]), Number(m[2])]);
  assert.equal(dots.length, 7);
  const xs = [...new Set(dots.map((d) => d[0]))].sort((a, b) => a - b);
  assert.equal(xs.length, 4);
  // 1 → 2 → 4 → 8: spacing is proportional to the values, not one slot per distinct value.
  const unit = xs[1] - xs[0];
  assert.ok(Math.abs((xs[2] - xs[1]) - 2 * unit) < 0.05 && Math.abs((xs[3] - xs[2]) - 4 * unit) < 0.05);
  assert.equal(dots.filter((d) => d[0] === xs[2]).length, 3);
  // Quarter steps keep their real labels.
  const q = texts(svgOf('line_plot', { values: [1.25, 1.5, 1.75] }));
  assert.ok(q.includes('1.25') && q.includes('1.75') && !q.includes('1.3'), q.join(' '));
});

test('bar_chart: bars rise from zero; a negative bar hangs below it; many long labels are rotated, not overlapped', () => {
  const svg = svgOf('bar_chart', { categories: ['a', 'b'], values: [4, -2] });
  const bars = [...svg.matchAll(/<rect x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="([\d.]+)" fill="#1d4ed8"\/>/g)].map((m) => [Number(m[1]), Number(m[2])]);
  assert.equal(bars.length, 2);
  assert.ok(Math.abs((bars[0][0] + bars[0][1]) - bars[1][0]) < 0.02, 'the positive bar ends where the negative one starts — at zero');
  assert.ok(Math.abs(bars[0][1] - 2 * bars[1][1]) < 0.05, 'heights are proportional');
  const many = svgOf('bar_chart', { categories: Array.from({ length: 16 }, (_, i) => `Category number ${i + 1}`), values: Array.from({ length: 16 }, (_, i) => i + 1) });
  assert.equal((many.match(/transform="rotate\(-40 /g) ?? []).length, 16);
  throwsSpec({ type: 'bar_chart', params: { categories: ['a', 'b'], values: [1] } }, /values must be 2 numbers/);
});

test('free_body_diagram: the board renderer\'s picture, made standalone', () => {
  const svg = svgOf('free_body_diagram', { object: { label: 'box' }, surface: { type: 'horizontal' }, forces: [{ name: 'N', direction: 'up' }, { name: 'W', direction: 'down', magnitude: '20 N' }] });
  assert.ok(/<marker id="pf[0-9a-z]+-fbd-arrow-/.test(svg), 'arrowhead markers are re-prefixed');
  assert.ok(/marker-end="url\(#pf[0-9a-z]+-fbd-arrow-/.test(svg));
  assert.ok(texts(svg).some((t) => t.includes('20 N')), 'a magnitude the spec gave is shown');
  assert.ok(!texts(svgOf('free_body_diagram', { forces: [{ name: 'W', direction: 'down' }] })).some((t) => /\d+ N/.test(t)));
  throwsSpec({ type: 'free_body_diagram', params: { forces: [{ name: 'F', direction: 'sideways' }] } }, /direction must be/);
  // The post-processor on its own.
  const out = standaloneFromMarkup('<div class="x"><svg viewBox="0 0 200 100" class="w-full" style="width:100%"><defs><marker id="arrow"><path d="M0 0"/></marker></defs><line class="a" data-feature="f" marker-end="url(#arrow)"/></svg></div>', 'pfx');
  assert.deepEqual([out.W, out.H], [200, 100]);
  assert.equal(out.body, '<defs><marker id="pfx-arrow"><path d="M0 0"/></marker></defs><line marker-end="url(#pfx-arrow)"/>');
  assert.throws(() => standaloneFromMarkup('<div class="MafsView"></div>', 'pfx'), /no <svg>/);
});

console.log('\nExpressions (expr.ts):\n');

test('understood: arithmetic, powers, implicit products after a number or ")", functions, constants, LaTeX', () => {
  const at = (expr: string, x: number, y?: number) => (y === undefined ? compileExpression(expr)(x) : compileExpression(expr, ['x', 'y'])(x, y));
  const near = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-9, `${a} vs ${b}`);
  near(at('x^2 - 2', 3), 7);
  near(at('-x^2', 3), -9);
  near(at('2x + 1', 3), 7);
  near(at('(x + 1)(x - 2)', 3), 4);
  near(at('3sin(x)', Math.PI / 2), 3);
  near(at('2*pi*x', 1), 2 * Math.PI);
  near(at('e^x', 1), Math.E);
  near(at('exp(x)', 1), Math.E);
  near(at('ln(x)', Math.E), 1);
  near(at('log(x)', Math.E), 1);
  near(at('sqrt(x) + abs(x - 10)', 4), 8);
  near(at('\\frac{1}{x} + x^{2}', 2), 4.5);
  near(at('\\sqrt{x}', 9), 3);
  near(at('x - y', 5, 2), 3);
  near(at('-x/y', 3, 2), -1.5);
  near(at('2*y*(1 - y/3)', 0, 1.5), 1.5);
  near(at('2y', 0, 4), 8);
  // Undefined points evaluate without throwing.
  assert.ok(Number.isNaN(at('sqrt(x)', -1)));
  assert.equal(at('1/x', 0), Infinity);
});

test('refused: anything not fully understood — never a silent NaN curve, never code', () => {
  const refused = (expr: unknown, vars: Array<'x' | 'y'> = ['x']) => assert.throws(() => compileExpression(expr, vars), ExpressionError, String(expr));
  for (const bad of ['', '   ', 42, null, 'x +', '(x + 1', 'x + 1)', 'x y', 'xy', 'x(x - 1)', 'foo(x)', 'sinh(x)', 'x; alert(1)', 'alert(1)', 'process.exit(1)', 'x => x', 'constructor', 'this', '`x`', 'x ? 1 : 2', 'x == 1', 'window', 'globalThis.x', 'Math.random()', 'sin', 'sin x', '[1]', '"a"', 'x'.repeat(201)]) refused(bad);
  refused('x + y');            // y is not available in a one-variable graph
  refused('t^2');              // nor is t
  refused('z', ['x', 'y']);
  // The renderers surface the refusal with the param's name.
  throwsSpec({ type: 'function_graph', params: { xRange: [0, 1], yRange: [0, 1], curves: [{ expr: 'foo(x)' }] } }, /curves\[0\]\.expr: cannot read expression/);
  throwsSpec({ type: 'slope_field', params: { expr: 'x +', xRange: [0, 1], yRange: [0, 1] } }, /expr: cannot read expression/);
  throwsSpec({ type: 'function_graph', params: { xRange: [0, 4], yRange: [0, 4], curves: [{ expr: 'sqrt(x - 10)' }] } }, /undefined across its whole domain/);
});

console.log('\nSlope-field sampler (slope-field.ts):\n');

test('slopeFieldSamples: the lattice and the slope at each point', () => {
  const s = slopeFieldSamples({ expr: 'x - y', xRange: [-2, 2], yRange: [-1, 1], xStep: 1, yStep: 1 });
  assert.equal(s.length, 5 * 3);
  assert.deepEqual(s[0], { x: -2, y: -1, slope: -1 });
  assert.deepEqual(s.find((p) => p.x === 2 && p.y === -1), { x: 2, y: -1, slope: 3 });
  assert.ok(s.every((p) => p.slope === p.x - p.y));
  // Default spacing: a round step, at most 12 intervals per axis.
  const d = slopeFieldSamples({ expr: 'y', xRange: [-4, 4], yRange: [-4, 4] });
  assert.equal(d.length, 9 * 9);
  const fine = slopeFieldSamples({ expr: 'y', xRange: [0, 30], yRange: [0, 1] });
  assert.ok(new Set(fine.map((p) => p.x)).size <= 13 && new Set(fine.map((p) => p.y)).size <= 13);
});

test('slopeFieldSamples: vertical is ±Infinity, undefined is NaN, and both draw correctly', () => {
  const s = slopeFieldSamples({ expr: '-x/y', xRange: [-1, 1], yRange: [-1, 1], xStep: 1, yStep: 1 });
  const at = (x: number, y: number) => s.find((p) => p.x === x && p.y === y)?.slope;
  assert.equal(at(1, 0), -Infinity);
  assert.equal(at(-1, 0), Infinity);
  assert.ok(Number.isNaN(at(0, 0) as number));
  assert.equal(at(1, 1), -1);
  const svg = svgOf('slope_field', { expr: '-x/y', xRange: [-1, 1], yRange: [-1, 1], gridStep: 1 });
  const segs = (/<path d="((?:M[-\d.]+,[-\d.]+L[-\d.]+,[-\d.]+)+)" fill="none" stroke="#1d4ed8"/.exec(svg)?.[1] ?? '').match(/M[^M]+/g) ?? [];
  assert.equal(segs.length, 8, 'nine lattice points, the undefined one is skipped');
  const vertical = segs.filter((sg) => { const m = /M([-\d.]+),[-\d.]+L([-\d.]+),/.exec(sg); return !!m && m[1] === m[2]; });
  assert.equal(vertical.length, 2, 'the two points on y = 0 are vertical ticks');
});

test('slopeFieldSamples refuses what it cannot read or draw', () => {
  assert.throws(() => slopeFieldSamples({ expr: 'x +', xRange: [0, 1], yRange: [0, 1] }), ExpressionError);
  assert.throws(() => slopeFieldSamples({ expr: 'foo(x, y)', xRange: [0, 1], yRange: [0, 1] }), ExpressionError);
  assert.throws(() => slopeFieldSamples({ expr: 'sqrt(-1 - x^2)', xRange: [0, 1], yRange: [0, 1] }), /undefined at every grid point/);
  assert.throws(() => slopeFieldSamples({ expr: 'x', xRange: [0, 100], yRange: [0, 100], xStep: 1, yStep: 1 }), /choose a step/);
  // Precomputed samples (the board tool's shape) are still accepted by the renderer.
  assert.deepEqual(validateFigureSvg(svgOf('slope_field', { samples: [[0, 0, 1], { x: 1, y: 1, slope: -1 }], xRange: [-1, 2], yRange: [-1, 2] })), { ok: true });
  throwsSpec({ type: 'slope_field', params: { samples: [[0, 0, 1]], xRange: [-1, 2], yRange: [-1, 2], solutionThrough: [0, 0] } }, /solutionThrough needs expr/);
});

test('slopeFieldSolution follows the field and stops where the curve turns vertical', () => {
  // dy/dx = y through (0, 1) is e^x.
  const exp = slopeFieldSolution('y', [0, 1], [-2, 2], [0, 8]);
  const at1 = exp.reduce((best, p) => (Math.abs(p[0] - 1) < Math.abs(best[0] - 1) ? p : best));
  assert.ok(Math.abs(at1[1] - Math.exp(at1[0])) < 1e-6);
  assert.ok(exp.every((p, i) => i === 0 || p[0] > exp[i - 1][0]), 'increasing x');
  // dy/dx = −x/y through (0, 3) is the upper half of a circle of radius 3.
  const arc = slopeFieldSolution('-x/y', [0, 3], [-4, 4], [-4, 4]);
  assert.ok(arc.every(([x, y]) => Math.abs(Math.hypot(x, y) - 3) < 0.02 && y > 0), 'stays on the circle, above the axis');
  assert.ok(arc[0][0] < -2.9 && arc[arc.length - 1][0] > 2.9);
});

console.log('\nTick arithmetic (plot-frame.ts):\n');

test('round steps, exact tick values, honest labels', () => {
  assert.equal(niceStep(10, 8), 2);
  assert.equal(niceStep(8, 8), 1);
  assert.equal(niceStep(60, 12), 5);
  assert.equal(niceStep(0.9, 8), 0.2);
  assert.equal(niceStep(1300, 8), 200);
  assert.deepEqual(ticksBetween(-0.3, 0.3, 0.1), [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3]);
  assert.deepEqual(ticksBetween(0, 1, 0.25), [0, 0.25, 0.5, 0.75, 1]);
  assert.deepEqual(ticksBetween(0, 1, 0.00001), [], 'a runaway step draws nothing rather than 100 000 lines');
  assert.equal(stepDecimals(0.25), 2);
  assert.equal(stepDecimals(5), 0);
  assert.equal(tickText(-4, 2), '−4');
  assert.equal(tickText(1.25, 0.25), '1.25');
  assert.equal(tickText(-0, 1), '0');
  assert.deepEqual(tickTexts([1, 1.5, 2], 0.25), ['1.0', '1.5', '2.0']);
  assert.deepEqual(tickTexts([0, 10, 20], 5), ['0', '10', '20']);
  assert.deepEqual(niceBounds(0, 8, 8), { min: 0, max: 8, step: 1 });
  assert.deepEqual(niceBounds(-4, 8, 8), { min: -4, max: 8, step: 2 });
  assert.deepEqual(niceBounds(52, 91, 10), { min: 50, max: 95, step: 5 });
  // Rounding outward must not exceed the tick budget: one step coarser.
  assert.deepEqual(niceBounds(52, 91, 8), { min: 50, max: 100, step: 10 });
  const flat = niceBounds(5, 5, 8);
  assert.ok(flat.min < 5 && flat.max > 5);
});

console.log('\nBad specs and hostile params:\n');

test('an unknown kind or a malformed spec is refused by name', () => {
  throwsSpec({ type: 'pie_chart', params: {} }, /unknown figure kind/);
  throwsSpec({ type: 'bar_chart', params: null as unknown as Record<string, unknown> }, /params must be an object/);
  throwsSpec({ type: 'function_graph', params: { xRange: [3, 1], yRange: [0, 1], curves: [{ expr: 'x' }] } }, /xRange must have max greater than min/);
  throwsSpec({ type: 'function_graph', params: { xRange: [0, 1], yRange: [0, 1] } }, /at least one curve or point/);
  throwsSpec({ type: 'motion_graph', params: { series: [{ points: [[0, 0]] }] } }, /between 2 and 200/);
  throwsSpec({ type: 'motion_graph', params: { quantity: 'jerk', series: [{ points: [[0, 0], [1, 1]] }] } }, /quantity must be/);
  throwsSpec({ type: 'scatter_plot', params: { points: [[0, NaN]] } }, /finite number/);
  throwsSpec({ type: 'scatter_plot', params: { points: [[0, 0], [5, 5]], xRange: [0, 2] } }, /outside the ranges/);
  throwsSpec({ type: 'reaction_coordinate', params: { productsEnergy: 80, activationEnergies: [50] } }, /peak .* must be above the products/);
  throwsSpec({ type: 'line_plot', params: { values: [] } }, /non-empty/);
  throwsSpec({ type: 'bar_chart', params: { categories: ['a'], values: [1], title: 'x'.repeat(161) } }, /title is longer/);
});

test('text params are escaped and colour params are never passed through — the output still validates', () => {
  const hostile = '<script>alert(1)</script> "onload=x" & <img src=x>';
  const svgs = [
    svgOf('bar_chart', { categories: [hostile.slice(0, 50), 'b'], values: [1, 2], yLabel: hostile, xLabel: hostile, title: hostile, colors: ['red" onload="alert(1)', 'url(https://evil.example)'] }),
    svgOf('function_graph', { xRange: [0, 1], yRange: [0, 1], curves: [{ expr: 'x', label: hostile.slice(0, 40), color: '"/><script>alert(1)</script>' }], points: [{ x: 0.5, y: 0.5, label: '<b>&</b>' }], xLabel: hostile }),
    svgOf('scatter_plot', { points: [{ x: 1, y: 1, label: '</text><script>', series: '<s>' }], xLabel: hostile }),
    svgOf('reaction_coordinate', { productsEnergy: -1, activationEnergies: [2], reactantLabel: '<a href="javascript:x">', units: '<u>' }),
    svgOf('free_body_diagram', { object: { label: '<i>x</i>' }, forces: [{ name: '<script>', direction: 'up', color: 'javascript:alert(1)' }] }),
    svgOf('slope_field', { expr: 'x', xRange: [0, 1], yRange: [0, 1], showExpression: true, title: hostile }),
  ];
  for (const svg of svgs) {
    assert.deepEqual(validateFigureSvg(svg), { ok: true });
    assert.ok(!/<script|<img|<a |onload=/i.test(svg.replace(/&lt;[^&]*?&gt;/g, '').replace(/&quot;[^<]*?(?=<)/g, '')), 'no live markup from a param');
    assert.ok(!svg.includes('evil.example') && !svg.includes('fill="red'));
  }
  assert.ok(texts(svgs[0]).some((t) => t.includes('<script>alert(1)</script>')), 'the text is shown as text');
});

test('buildPracticeFigure: what a bank row stores — picture, alt and spec — and its bounds', () => {
  const spec = FIGURE_FIXTURES[0].spec;
  const fig = buildPracticeFigure(spec, '  A parabola and a line.  ');
  assert.deepEqual(Object.keys(fig).sort(), ['alt', 'spec', 'svg']);
  assert.equal(fig.alt, 'A parabola and a line.');
  assert.deepEqual(fig.spec, spec);
  assert.equal(fig.svg, renderPracticeFigure(spec).svg);
  PracticeFigureSchema.parse(fig);
  // The spec survives a JSON round trip (Mongo) and redraws the same picture.
  assert.equal(renderPracticeFigure(JSON.parse(JSON.stringify(fig.spec))).svg, fig.svg);
  assert.throws(() => buildPracticeFigure(spec, ''), /alt text is required/);
  assert.throws(() => buildPracticeFigure(spec, 'x'.repeat(601)), /longer than 600/);
  assert.throws(() => buildPracticeFigure({ type: 'nope', params: {} }, 'alt'), PracticeFigureSpecError);
});

console.log('\nLegibility round (2026-10-09 — found reading the figures at 340 px):\n');

/** Every circle that is a data mark (the white halo discs excluded). */
const dots = (svg: string): Array<{ cx: number; cy: number; fill: string; at: number }> =>
  [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="[\d.]+" fill="(#[0-9a-f]+)" stroke=/g)].map((m) => ({ cx: Number(m[1]), cy: Number(m[2]), fill: m[3], at: m.index as number }));
/** The curves: thick paths with no fill, in document order. */
const curvePaths = (svg: string): Array<{ stroke: string; dash: string }> =>
  [...svg.matchAll(/<path d="M[^"]+" fill="none" stroke="(#[0-9a-f]+)" stroke-width="2\.[24]"[^>]*?(?: stroke-dasharray="([^"]+)")?\/>/g)].map((m) => ({ stroke: m[1], dash: m[2] ?? '' }));
const legendLines = (svg: string): Array<{ stroke: string; dash: string }> =>
  [...svg.matchAll(/<line [^>]*stroke="(#[0-9a-f]+)" stroke-width="2\.4"[^>]*?(?: stroke-dasharray="([^"]+)")?\/>/g)].map((m) => ({ stroke: m[1], dash: m[2] ?? '' }));
const plotRect = (svg: string): { x: number; y: number; w: number; h: number } => {
  const m = /<clipPath id="[^"]+"><rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"\/>/.exec(svg);
  assert.ok(m, 'a clip rect');
  return { x: Number(m[1]), y: Number(m[2]), w: Number(m[3]), h: Number(m[4]) };
};

test('palette: every series colour is ≥ 4.5 : 1 on white and the six stay apart under simulated colour-vision deficiency', () => {
  const lin = (c: number) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const rgb = (h: string) => [1, 3, 5].map((i) => lin(parseInt(h.slice(i, i + 2), 16)));
  const lum = (v: number[]) => 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  // Machado, Oliveira & Fernandes (2009), severity 1.0, on linear RGB.
  const CVD: Record<string, number[][]> = {
    normal: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
    protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
    tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
  };
  const lab = (v: number[]) => {
    const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const x = f((0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.95047);
    const y = f(lum(v));
    const z = f((0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.08883);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };
  assert.equal(SERIES_COLORS.length, 6);
  for (const c of SERIES_COLORS) assert.ok(1.05 / (lum(rgb(c)) + 0.05) >= 4.5, `${c} contrast on white`);
  for (const [name, m] of Object.entries(CVD)) {
    const seen = SERIES_COLORS.map((c) => lab(m.map((row) => Math.min(1, Math.max(0, row[0] * rgb(c)[0] + row[1] * rgb(c)[1] + row[2] * rgb(c)[2])))));
    for (let i = 0; i < seen.length; i++) for (let j = i + 1; j < seen.length; j++) {
      const d = Math.hypot(seen[i][0] - seen[j][0], seen[i][1] - seen[j][1], seen[i][2] - seen[j][2]);
      assert.ok(d >= 15, `${name}: ${SERIES_COLORS[i]} vs ${SERIES_COLORS[j]} ΔE ${d.toFixed(1)}`);
    }
  }
  assert.equal(new Set(SERIES_DASHES).size, SERIES_DASHES.length);
  assert.ok(!(SERIES_DASHES as readonly string[]).includes(GUIDE_DASH), 'no curve pattern is the asymptote pattern');
});

test('assignDashes: one curve is solid; several each get their own pattern; `dashed` curves take the broken ones first', () => {
  assert.deepEqual(assignDashes([false]), ['']);
  assert.deepEqual(assignDashes([true]), ['7 4']);
  assert.deepEqual(assignDashes([false, false, false, false]), [SERIES_DASHES[0], SERIES_DASHES[1], SERIES_DASHES[2], SERIES_DASHES[3]]);
  assert.deepEqual(assignDashes([false, true]), ['', SERIES_DASHES[1]]);
  assert.deepEqual(assignDashes([true, false]), [SERIES_DASHES[1], '']);
  assert.deepEqual(assignDashes([true, true, false]), [SERIES_DASHES[1], SERIES_DASHES[2], '']);
  assert.equal(new Set(assignDashes([false, true, false, true, false, false])).size, 6);
});

test('function_graph: several curves differ by dash as well as colour, the legend swatch repeats the dash, an asymptote stays a thin grey guide', () => {
  const svg = svgOf('function_graph', {
    xRange: [-4, 4], yRange: [-6, 6],
    curves: [{ expr: 'x/2 + 1', label: 'A' }, { expr: '3 - (x - 1)^2', label: 'B' }, { expr: 'abs(x - 2)', label: 'C' }, { expr: 'x^3 - 3*x', label: 'D' }],
    asymptotes: [{ y: -5 }],
  });
  const cs = curvePaths(svg);
  assert.equal(cs.length, 4);
  assert.equal(cs[0].dash, '', 'the first curve is solid');
  assert.equal(new Set(cs.map((c) => c.dash)).size, 4);
  assert.equal(new Set(cs.map((c) => c.stroke)).size, 4);
  assert.deepEqual(legendLines(svg), cs, 'legend swatches: same colour and same pattern, in order');
  assert.deepEqual(texts(svg).slice(-4), ['A', 'B', 'C', 'D']);
  const guide = /<line [^>]*stroke="(#[0-9a-f]+)" stroke-width="([\d.]+)" stroke-dasharray="([^"]+)"\/>/.exec(svg);
  assert.ok(guide, 'the asymptote');
  assert.ok(Number(guide[2]) <= 1.1 && guide[1] === GUIDE_COLOR && guide[3] === GUIDE_DASH);
  assert.ok(!cs.some((c) => c.dash === guide[3] || c.stroke === guide[1]));
  // One curve alone is plain — nothing changes for the common case.
  assert.deepEqual(curvePaths(svgOf('function_graph', { xRange: [-3, 3], yRange: [-3, 3], curves: [{ expr: 'x', label: 'f' }] })), [{ stroke: '#1d4ed8', dash: '' }]);
  // "A solid, B dashed" as a spec wrote it stays true.
  const ab = curvePaths(svgOf('function_graph', { xRange: [0, 2], yRange: [-2, 2], curves: [{ expr: 'sin(pi*x)', label: 'A' }, { expr: 'sin(2*pi*x)', label: 'B', dashed: true }] }));
  assert.ok(ab[0].dash === '' && ab[1].dash !== '');
});

test('function_graph: the pieces of ONE function share colour, dash and legend entry', () => {
  // The piece after the jump carries no label and no colour of its own.
  const params = { xRange: [-4, 4], yRange: [-6, 6], curves: [{ expr: 'x + 2', domain: [-4, 1], to: 'closed', label: 'g' }, { expr: 'x - 3', domain: [1, 4], from: 'open' }] };
  const svg = svgOf('function_graph', params);
  assert.deepEqual(curvePaths(svg), [{ stroke: '#1d4ed8', dash: '' }, { stroke: '#1d4ed8', dash: '' }]);
  assert.deepEqual(legendLines(svg), [{ stroke: '#1d4ed8', dash: '' }]);
  assert.deepEqual(dots(svg).map((d) => d.fill), ['#1d4ed8', '#ffffff'], 'both endpoint marks in the curve\'s colour');
  // A third, separately named curve is the SECOND curve of the figure.
  const three = curvePaths(svgOf('function_graph', { ...params, curves: [...params.curves, { expr: '-x', label: 'k' }] }));
  assert.deepEqual(three.map((c) => c.stroke), ['#1d4ed8', '#1d4ed8', '#c2410c']);
  assert.deepEqual(three.map((c) => c.dash), ['', '', SERIES_DASHES[1]]);
  // Overlapping domains, or `continues: false`, are separate curves; `continues: true` joins explicitly.
  assert.equal(new Set(curvePaths(svgOf('function_graph', { xRange: [-4, 4], yRange: [-6, 6], curves: [{ expr: 'x' }, { expr: '-x' }] })).map((c) => c.stroke)).size, 2);
  const apart = { ...params, curves: [params.curves[0], { ...params.curves[1], continues: false }] };
  assert.equal(new Set(curvePaths(svgOf('function_graph', apart)).map((c) => c.stroke)).size, 2);
  const joined = { ...params, curves: [params.curves[0], { expr: 'x - 3', label: 'right', continues: true }] };
  assert.equal(new Set(curvePaths(svgOf('function_graph', joined)).map((c) => c.stroke)).size, 1);
  throwsSpec({ type: 'function_graph', params: { xRange: [0, 1], yRange: [0, 1], curves: [{ expr: 'x', continues: true }] } }, /curves\[0\]\.continues/);
});

test('function_graph: a curve that stops inside the plot ends in a marker — filled unless the spec says open', () => {
  const g = (curves: unknown[], extra: Record<string, unknown> = {}) => svgOf('function_graph', { xRange: [-4, 6], yRange: [-4, 10], curves, ...extra });
  // No flags: both ends are inside the plot ⇒ two filled dots.
  assert.deepEqual(dots(g([{ expr: '(x - 2)^2 - 1', domain: [-1, 5] }])).map((d) => d.fill), ['#1d4ed8', '#1d4ed8']);
  // Flags still decide; 'none' is the explicit opt-out.
  assert.deepEqual(dots(g([{ expr: 'x', domain: [-1, 5], from: 'open', to: 'none' }])).map((d) => d.fill), ['#ffffff']);
  throwsSpec({ type: 'function_graph', params: { xRange: [0, 4], yRange: [0, 4], curves: [{ expr: 'x', domain: [1, 2], to: 'half' }] } }, /'open', 'closed' or 'none'/);
  // The curve simply leaves the plot: through the side (domain end on / past xRange), or through top or bottom.
  assert.equal(dots(g([{ expr: 'x', domain: [-4, 6] }])).length, 0);
  assert.equal(dots(g([{ expr: 'x', domain: [-9, null] }])).length, 0);
  assert.equal(dots(g([{ expr: 'x^3 - 3*x', domain: [-3, 3] }])).length, 0, 'y(±3) = ±18 is off the plot');
  assert.equal(dots(g([{ expr: 'x' }])).length, 0);
  // Pieces of one function that meet: no dot at the join (it would mark the corner), dots at the outer ends.
  const joined = dots(g([{ expr: 'x + 1', domain: [-2, 1], label: 'f' }, { expr: '3 - x', domain: [1, 4] }]));
  assert.equal(joined.length, 2);
  // …but a jump gets both of its ends.
  assert.equal(dots(g([{ expr: 'x + 1', domain: [-2, 1], label: 'f' }, { expr: '6 - x', domain: [1, 4] }])).length, 4);
  // The mark sits exactly on the end of the drawn curve.
  const svg = g([{ expr: '2', domain: [0, 3] }]);
  const d = /<path d="M([\d.]+),([\d.]+)[^"]*L([\d.]+),([\d.]+)" fill="none" stroke="#1d4ed8"/.exec(svg);
  assert.ok(d);
  assert.deepEqual(dots(svg).map((c) => [c.cx, c.cy]), [[Number(d[1]), Number(d[2])], [Number(d[3]), Number(d[4])]]);
});

test('points and dots are drawn last, unclipped, each on a thin white ring — a point on an axis or the border reads whole', () => {
  const fg = svgOf('function_graph', { xRange: [-3, 3], yRange: [-3, 3], curves: [{ expr: 'x' }], points: [{ x: 0, y: 0, label: 'O' }, { x: 3, y: 0, open: true }] });
  const clipEnd = fg.lastIndexOf('</g>');
  const fd = dots(fg);
  assert.equal(fd.length, 2);
  assert.ok(fd.every((d) => d.at > clipEnd), 'after the clipped curves');
  assert.ok(fd.every((d) => d.at > fg.lastIndexOf('stroke-width="1.4"/>')), 'after the axes');
  for (const d of fd) {
    const halo = new RegExp(`<circle cx="${d.cx}" cy="${d.cy}" r="([\\d.]+)" fill="#ffffff"/>`).exec(fg);
    assert.ok(halo && Number(halo[1]) >= 5.5 && (halo.index as number) < d.at, 'a white disc under the mark');
  }
  // Motion-graph vertices at the plot corner used to be cut to a quarter by the clip path.
  const mg = svgOf('motion_graph', { showPoints: true, series: [{ points: [[0, 0], [2, 8], [5, 8], [8, 0]] }], tRange: [0, 8], yRange: [0, 10] });
  const md = [...mg.matchAll(/<circle cx="[\d.]+" cy="[\d.]+" r="[\d.]+" fill="#1d4ed8" stroke="#ffffff" stroke-width="1.2"\/>/g)];
  assert.equal(md.length, 4);
  assert.ok(md.every((m) => (m.index as number) > mg.lastIndexOf('</g>')), 'outside the clip group');
  const sc = svgOf('scatter_plot', { points: [[0, 0], [1, 2]], xRange: [0, 2], yRange: [0, 4] });
  assert.equal([...sc.matchAll(/<circle [^>]*stroke="#ffffff" stroke-width="1.2"\/>/g)].length, 2);
});

test('motion_graph: vertexDots draws a series without its corner dots (default unchanged); a line that stops inside the plot ends in a dot', () => {
  const series = { points: [[1, 0], [3, 8], [6, 8], [8, 2]] };
  const count = (params: Record<string, unknown>) => [...svgOf('motion_graph', { tRange: [0, 10], yRange: [0, 10], ...params }).matchAll(/<circle [^>]*fill="#1d4ed8"/g)].length;
  assert.equal(count({ showPoints: true, series: [series] }), 4, 'default with showPoints: every vertex');
  assert.equal(count({ showPoints: true, series: [{ ...series, vertexDots: 'ends' }] }), 2, 'the two ends only — the corners are not given away');
  assert.equal(count({ showPoints: true, series: [{ ...series, vertexDots: 'none' }] }), 0);
  assert.equal(count({ series: [{ ...series, vertexDots: 'all' }] }), 4, 'per series, without the figure-wide switch');
  assert.equal(count({ series: [series] }), 2, 'no showPoints: the ends are inside the plot, so they are marked');
  assert.equal(count({ series: [{ points: [[0, 0], [10, 10]] }] }), 0, 'a line that runs border to border has no marks');
  throwsSpec({ type: 'motion_graph', params: { series: [{ ...series, vertexDots: 'some' }] } }, /vertexDots must be 'all', 'ends' or 'none'/);
  // Several series: a pattern each, repeated in the legend.
  const two = svgOf('motion_graph', { series: [{ label: 'Car A', points: [[0, 24], [12, -12]] }, { label: 'Car B', points: [[0, -6], [12, 18]] }] });
  assert.deepEqual(curvePaths(two).map((c) => c.dash), ['', SERIES_DASHES[1]]);
  assert.deepEqual(legendLines(two), curvePaths(two));
});

test('reaction_coordinate and scatter_plot: several curves / series are told apart without colour', () => {
  const rc = svgOf('reaction_coordinate', { productsEnergy: -40, activationEnergies: [60, 35], curveLabels: ['without catalyst', 'with catalyst'] });
  assert.deepEqual(curvePaths(rc).map((c) => c.dash), ['', SERIES_DASHES[1]]);
  assert.deepEqual(legendLines(rc), curvePaths(rc));
  assert.deepEqual(curvePaths(svgOf('reaction_coordinate', { productsEnergy: -40, activationEnergies: [60] })).map((c) => c.dash), ['']);
  const sc = svgOf('scatter_plot', { points: [{ x: 1, y: 1, series: 'a' }, { x: 2, y: 2, series: 'a' }, { x: 2, y: 1, series: 'b' }, { x: 3, y: 3, series: 'c' }] });
  assert.equal([...sc.matchAll(/<circle [^>]*fill="#1d4ed8"/g)].length, 3, 'series a: two circles + its legend dot');
  assert.equal([...sc.matchAll(/<path d="M[^"]+z" fill="#c2410c"/g)].length, 2, 'series b: a square + its legend mark');
  assert.equal([...sc.matchAll(/<path d="M[^"]+z" fill="#0f766e"/g)].length, 2, 'series c: a triangle + its legend mark');
  // One series (or none named) is plain circles, as before.
  assert.ok(!/<path d="M[^"]+z" fill=/.test(svgOf('scatter_plot', { points: [[1, 1], [2, 2]] })));
});

test('function_graph: ticks at multiples of π are labelled −π, −π/2, 0, π/2, π … only when the spec asks', () => {
  assert.deepEqual([-4, -3, -1, 0, 1, 2, 3, 4, 6].map((k) => piTickText(k, 2)), ['−2π', '−3π/2', '−π/2', '0', 'π/2', 'π', '3π/2', '2π', '3π']);
  assert.deepEqual([1, 2, 3, 4].map((k) => piTickText(k, 6)), ['π/6', 'π/3', 'π/2', '2π/3']);
  const base = { xRange: [-6.5, 6.5], yRange: [-4, 4], curves: [{ expr: '3*cos(x)' }] };
  const t = texts(svgOf('function_graph', { ...base, xTickUnit: 'pi', xTickDivisor: 2 }));
  for (const label of ['−2π', '−3π/2', '−π', '−π/2', '0', 'π/2', 'π', '3π/2', '2π', '−4', '4']) assert.ok(t.includes(label), `${label} in ${t.join(' ')}`);
  assert.ok(!t.some((s) => /\d\.\d/.test(s)), 'no decimals');
  // The gridline under "π" is at x = π.
  const svg = svgOf('function_graph', { ...base, xTickUnit: 'pi' });
  const plot = plotRect(svg);
  const piX = Number(/<text x="([\d.]+)"[^>]*>π<\/text>/.exec(svg)?.[1]);
  assert.ok(Math.abs(piX - (plot.x + ((Math.PI + 6.5) / 13) * plot.w)) < 0.02);
  assert.deepEqual(texts(svg).filter((s) => s.includes('π')), ['−2π', '−π', 'π', '2π']);
  // Unchanged without the option — a 1.57 step is still labelled as numbers.
  assert.ok(texts(svgOf('function_graph', { ...base, xStep: 1.57 })).includes('1.57'));
  assert.ok(texts(svgOf('function_graph', { xRange: [-1, 1], yRange: [-4, 4], curves: [{ expr: 'x' }], yTickUnit: 'pi' })).includes('−π'));
  throwsSpec({ type: 'function_graph', params: { ...base, xTickUnit: 'tau' } }, /xTickUnit must be 'pi'/);
  throwsSpec({ type: 'function_graph', params: { ...base, xTickUnit: 'pi', xStep: 1 } }, /xStep or xTickUnit, not both/);
  throwsSpec({ type: 'function_graph', params: { ...base, xTickUnit: 'pi', xTickDivisor: 2.5 } }, /xTickDivisor must be a whole number/);
});

test('slope_field: every segment lies wholly inside the plot, above the axes, and neighbours never touch', () => {
  for (const params of [
    { expr: 'x - y', xRange: [-4, 4], yRange: [-4, 4] },
    { expr: '-x/y', xRange: [-4, 4], yRange: [-4, 4] },
    { expr: '2*y*(1 - y/3)', xRange: [0, 8], yRange: [-1, 4], gridStep: [0.5, 0.5] },
    { expr: 'y', xRange: [0, 29], yRange: [0, 29], gridStep: 1 },
    { samples: [[0, 0, 1], [1, 0, 0], [0, 1, -1], [1, 1, 5]], xRange: [0, 1], yRange: [0, 1] },
  ]) {
    const svg = svgOf('slope_field', params);
    const plot = plotRect(svg);
    const m = /<path d="((?:M[-\d.]+,[-\d.]+L[-\d.]+,[-\d.]+)+)" fill="none" stroke="#1d4ed8" stroke-width="([\d.]+)" stroke-linecap="round"\/>/.exec(svg);
    assert.ok(m, 'the segments');
    const sw = Number(m[2]);
    const segs = (m[1].match(/M[^M]+/g) ?? []).map((sg) => (/M([-\d.]+),([-\d.]+)L([-\d.]+),([-\d.]+)/.exec(sg) as RegExpExecArray).slice(1).map(Number));
    assert.ok(segs.length >= 3);
    for (const [ax, ay, bx, by] of segs) {
      for (const [px, py] of [[ax, ay], [bx, by]]) {
        assert.ok(px - sw / 2 >= plot.x && px + sw / 2 <= plot.x + plot.w && py - sw / 2 >= plot.y && py + sw / 2 <= plot.y + plot.h, `(${px}, ${py}) inside ${JSON.stringify(plot)}`);
      }
    }
    // Centres are a cell apart; a segment and its round caps are shorter than the cell by a clear gap.
    const centres = segs.map(([ax, ay, bx, by]) => [(ax + bx) / 2, (ay + by) / 2]);
    let cell = Infinity;
    for (let i = 0; i < centres.length; i++) for (let j = i + 1; j < centres.length; j++) cell = Math.min(cell, Math.hypot(centres[i][0] - centres[j][0], centres[i][1] - centres[j][1]));
    const longest = Math.max(...segs.map(([ax, ay, bx, by]) => Math.hypot(bx - ax, by - ay)));
    assert.ok(longest + sw <= cell - 1.5, `segment ${longest.toFixed(1)} + cap ${sw} in a ${cell.toFixed(1)} cell`);
    // Drawn after the grid and the axes, on a white under-stroke.
    assert.ok((m.index as number) > svg.lastIndexOf(`stroke="#111827" stroke-width="1.1"/>`) || !svg.includes('stroke="#111827" stroke-width="1.1"/>'));
    assert.ok(new RegExp(`<path d="${m[1].replace(/[.]/g, '\\.')}" fill="none" stroke="#ffffff"`).test(svg.slice(0, m.index)), 'white under-stroke first');
  }
  // The lattice is where the spec put it — the plot grows by half a cell instead.
  const t = texts(svgOf('slope_field', { expr: 'x - y', xRange: [-4, 4], yRange: [-4, 4] }));
  for (const label of ['−4', '0', '4']) assert.ok(t.includes(label));
});

test('checkFigureLegibility: reports, never redraws', () => {
  const codes = (type: string, params: Record<string, unknown>) => checkFigureLegibility({ type, params }).map((w) => w.code);
  assert.deepEqual(codes('function_graph', { xRange: [-4, 4], yRange: [-4, 6], curves: [{ expr: 'x^2 - 2', label: 'f' }], points: [{ x: 2, y: 2, label: 'P' }] }), []);
  // A curve the y-range cuts down to a stub.
  assert.deepEqual(codes('function_graph', { xRange: [-10, 10], yRange: [0, 4], curves: [{ expr: 'x^2 * 30' }] }), ['curve_barely_visible']);
  // One branch of several reduced to a stub while the rest shows.
  assert.ok(codes('function_graph', { xRange: [-6, 6], yRange: [-0.5, 12], curves: [{ expr: '1/(x - 5.8)' }] }).includes('branch_stub'));
  // A marked point, an endpoint mark and a series vertex on the border.
  assert.deepEqual(codes('function_graph', { xRange: [-3, 3], yRange: [-3, 3], curves: [{ expr: 'x' }], points: [{ x: 3, y: 1 }] }), ['feature_on_border']);
  assert.deepEqual(codes('function_graph', { xRange: [-3, 3], yRange: [0, 3], curves: [{ expr: 'x', domain: [0, 2] }] }), ['feature_on_border']);
  assert.deepEqual(codes('motion_graph', { series: [{ points: [[0, 0], [4, 8]] }], tRange: [0, 6], yRange: [0, 10] }), ['feature_on_border']);
  assert.deepEqual(codes('motion_graph', { series: [{ points: [[1, 1], [4, 8]] }], tRange: [0, 6], yRange: [0, 10] }), []);
  // Two labels on top of each other.
  assert.deepEqual(codes('function_graph', { xRange: [-3, 3], yRange: [-3, 3], points: [{ x: 1, y: 1, label: 'first' }, { x: 1.05, y: 1.05, label: 'second' }] }), ['labels_overlap']);
  // More than four curves (pieces of one function count once).
  const five = ['x', 'x + 1', 'x + 2', 'x - 1', 'x - 2'].map((expr) => ({ expr }));
  assert.deepEqual(codes('function_graph', { xRange: [-3, 3], yRange: [-3, 3], curves: five }), ['too_many_curves']);
  assert.deepEqual(codes('function_graph', { xRange: [-3, 3], yRange: [-3, 3], curves: five.slice(0, 4) }), []);
  // Each warning says what and where; a spec that cannot be drawn is one warning, not a throw.
  const w = checkFigureLegibility({ type: 'function_graph', params: { xRange: [-3, 3], yRange: [-3, 3], curves: [{ expr: 'x' }], points: [{ x: 3, y: 1, label: 'Q' }] } });
  assert.match(w[0].message, /points\[0\].*border/);
  assert.deepEqual(codes('pie_chart', {}), ['not_renderable']);
  // Reporting changes nothing about the picture.
  const spec = FIGURE_FIXTURES[0].spec;
  const before = renderPracticeFigure(spec).svg;
  checkFigureLegibility(spec);
  assert.equal(renderPracticeFigure(spec).svg, before);
  for (const fx of FIGURE_FIXTURES) assert.ok(Array.isArray(checkFigureLegibility(fx.spec)), fx.id);
});

// ---------------------------------------------------------------------------
// Batch 1 (2026-10-09): unit_circle, vector_diagram, free_body_diagram_v2,
// shaded_region, number_line / sign_chart, distribution_curve / histogram /
// box_plot, polar_complex, punnett_square / pedigree.
// ---------------------------------------------------------------------------

console.log('\nBatch 1 kinds:\n');

/** The element and attribute names of the pinned client fixture
 *  (academy tests/fixtures/engine-practice-figures.json, 27 figures). A new
 *  kind may use nothing outside it: the client drops a figure it would alter. */
const PINNED_ELEMENTS = ['circle', 'clipPath', 'defs', 'g', 'line', 'marker', 'path', 'polygon', 'rect', 'svg', 'text', 'tspan'];
const PINNED_ATTRS = ['clip-path', 'cx', 'cy', 'd', 'dominant-baseline', 'dy', 'fill', 'font-family', 'font-size', 'font-style', 'font-weight', 'height', 'id', 'marker-end', 'markerHeight', 'markerWidth', 'orient', 'paint-order', 'points', 'preserveAspectRatio', 'r', 'refX', 'refY', 'role', 'rx', 'stroke', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'text-anchor', 'transform', 'viewBox', 'width', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2'];
const batch1 = FIGURE_FIXTURES.filter((f) => (BATCH1_FIGURE_KINDS as readonly string[]).includes(f.spec.type));
const warn = (type: string, params: Record<string, unknown>): string[] => checkFigureLegibility({ type, params }).map((w) => w.code);

test('batch 1: every new kind has ≥ 3 fixtures, one of them with a blank "?"', () => {
  assert.equal(BATCH1_FIGURE_KINDS.length, 12);
  assert.equal(ALL_PRACTICE_FIGURE_KINDS.length, PRACTICE_FIGURE_KINDS.length + 12);
  for (const kind of BATCH1_FIGURE_KINDS) {
    const mine = batch1.filter((f) => f.spec.type === kind);
    assert.ok(mine.length >= 3, `${kind}: ${mine.length} fixtures`);
    const blank = mine.filter((f) => /blank/.test(f.id));
    assert.ok(blank.length >= 1, `${kind}: a fixture with a blank`);
    for (const b of blank) assert.ok(texts(rendered.get(b.id) as string).some((t) => t.includes('?')), `${b.id} shows a "?"`);
  }
});

test('batch 1: only the pinned client vocabulary — elements, attributes; no opacity, style, data-*, aria-*, title', () => {
  for (const fx of batch1) {
    const svg = rendered.get(fx.id) as string;
    for (const m of svg.matchAll(/<([A-Za-z][\w:-]*)((?:\s+[\w:-]+="[^"]*")*)\s*\/?>/g)) {
      assert.ok(PINNED_ELEMENTS.includes(m[1]), `${fx.id}: element <${m[1]}>`);
      for (const a of m[2].matchAll(/\s([\w:-]+)="/g)) assert.ok(PINNED_ATTRS.includes(a[1]), `${fx.id}: attribute ${a[1]} on <${m[1]}>`);
    }
    assert.ok(!/opacity|<style|<title|<desc|data-|aria-|href|<pattern|Gradient|<image|<use/.test(svg), fx.id);
  }
});

test('batch 1: every fixture is clean under checkFigureLegibility unless its note says it shows a warning', () => {
  for (const fx of batch1) {
    const w = checkFigureLegibility(fx.spec);
    if (/warns/.test(fx.note)) assert.ok(w.length > 0, `${fx.id} should warn`);
    else assert.deepEqual(w, [], `${fx.id}: ${w.map((x) => x.message).join(' | ')}`);
  }
});

test('unit_circle: coordinates and angle sizes are printed only as asked; exact values; either coordinate can be blank', () => {
  const one = (extra: Record<string, unknown>) => texts(svgOf('unit_circle', { angles: [{ degrees: 150, ...extra }] }));
  assert.ok(one({}).includes('150°'));
  assert.ok(!one({}).some((t) => t.includes('√3')), 'no coordinates by default');
  assert.ok(one({ coords: 'show' }).includes('(−√3/2, 1/2)'));
  assert.ok(one({ coords: 'blank_x' }).includes('(?, 1/2)'));
  assert.ok(one({ coords: 'blank_y', name: 'P' }).includes('P(−√3/2, ?)'));
  assert.ok(one({ coords: 'blank' }).includes('(?, ?)'));
  assert.ok(one({ label: 'radians' }).includes('5π/6'));
  assert.ok(!one({ label: 'none' }).some((t) => /150|π/.test(t)));
  assert.ok(one({ label: 'blank' }).includes('?'));
  assert.ok(one({ labelText: 'θ' }).includes('θ') && !one({ labelText: 'θ' }).includes('150°'));
  assert.ok(texts(svgOf('unit_circle', { angles: [{ pi: [-3, 4], coords: 'show' }] })).includes('−3π/4'));
  assert.ok(texts(svgOf('unit_circle', { angles: [{ pi: [-3, 4], coords: 'show' }] })).includes('(−√2/2, −√2/2)'));
  assert.ok(texts(svgOf('unit_circle', { angles: [{ degrees: 20, coords: 'show' }] })).includes('(0.94, 0.34)'));
  const q = texts(svgOf('unit_circle', { angles: [{ degrees: 40 }], quadrantLabels: true }));
  for (const name of ['I', 'II', 'III', 'IV']) assert.ok(q.includes(name));
  assert.ok(!one({}).includes('III'));
  // The reference triangle and the arc are drawn only when asked.
  assert.ok(!svgOf('unit_circle', { angles: [{ degrees: 150 }] }).includes('stroke-dasharray="4 3"'));
  assert.ok(svgOf('unit_circle', { angles: [{ degrees: 150, triangle: true }] }).includes('stroke-dasharray="4 3"'));
  throwsSpec({ type: 'unit_circle', params: { angles: [{ degrees: 30, pi: [1, 6] }] } }, /degrees or pi, not both/);
  throwsSpec({ type: 'unit_circle', params: { angles: [{ degrees: 400 }] } }, /between −360° and 360°/);
  throwsSpec({ type: 'unit_circle', params: { angles: [{ degrees: 30 }, { degrees: -330 }] } }, /same point/);
  throwsSpec({ type: 'unit_circle', params: { angles: [{ degrees: 90, triangle: true }] } }, /no reference triangle/);
  throwsSpec({ type: 'unit_circle', params: { angles: [] } }, /angles must have between 1 and 16/);
  assert.deepEqual(warn('unit_circle', { angles: [{ degrees: 210, coords: 'blank', label: 'none' }] }), ['ambiguous_blank']);
  assert.ok(warn('unit_circle', { angles: [0, 30, 45, 60, 90, 120, 135, 150, 180, 210].map((degrees) => ({ degrees, coords: 'show' })) }).includes('too_many_elements'));
});

test('vector_diagram: tails / heads, magnitude + direction, components, tip-to-tail, a resultant only when asked', () => {
  const base = { xRange: [-1, 8], yRange: [-1, 7], vectors: [{ tail: [0, 0], head: [3, 4], label: 'a' }, { components: [4, -1], label: 'b' }] };
  const plain = svgOf('vector_diagram', base);
  assert.ok(texts(plain).includes('a') && texts(plain).includes('b'));
  assert.equal((plain.match(/<polygon /g) ?? []).length, 2, 'one arrowhead per vector');
  const withR = svgOf('vector_diagram', { ...base, resultant: true });
  assert.equal((withR.match(/<polygon /g) ?? []).length, 3);
  assert.ok(texts(withR).includes('R') && !texts(plain).includes('R'));
  assert.ok(texts(svgOf('vector_diagram', { ...base, resultant: { label: 'a + b' } })).includes('a + b'));
  // Tip-to-tail: the second vector starts where the first ends.
  const m = vectorDiagramModel(new Reader('vector_diagram', { ...base, tipToTail: true, resultant: true }));
  assert.deepEqual([m.vectors[1].tail, m.vectors[1].head], [[3, 4], [7, 3]]);
  assert.deepEqual([m.resultant?.tail, m.resultant?.head], [[0, 0], [7, 3]]);
  // Magnitude + direction.
  const md = vectorDiagramModel(new Reader('vector_diagram', { xRange: [-6, 6], yRange: [-6, 6], vectors: [{ magnitude: 5, direction: 180 }] }));
  assert.ok(Math.abs(md.vectors[0].head[0] + 5) < 1e-9 && Math.abs(md.vectors[0].head[1]) < 1e-9);
  // Component dashes only when asked; several vectors differ by dash pattern, not only colour.
  assert.ok(!plain.includes('stroke-dasharray="3 3"'));
  assert.ok(svgOf('vector_diagram', { ...base, vectors: [{ ...base.vectors[0], showComponents: true }] }).includes('stroke-dasharray="3 3"'));
  assert.ok(plain.includes(`stroke-dasharray="${SERIES_DASHES[1]}"`));
  throwsSpec({ type: 'vector_diagram', params: { ...base, vectors: [{ tail: [0, 0], head: [30, 4] }] } }, /outside/);
  throwsSpec({ type: 'vector_diagram', params: { ...base, vectors: [{ tail: [1, 1], head: [1, 1] }] } }, /zero length/);
  throwsSpec({ type: 'vector_diagram', params: { ...base, vectors: [{ tail: [1, 1] }] } }, /head, components, or magnitude and direction/);
  assert.ok(warn('vector_diagram', { xRange: [0, 8], yRange: [0, 8], vectors: [1, 2, 3, 4, 5, 6, 7].map((k) => ({ tail: [0, 0], head: [k, 8 - k] })) }).includes('too_many_elements'));
});

test('free_body_diagram_v2: labels at the tips, sizes only when given, lengths to scale or equal', () => {
  const forces = [
    { label: 'N', direction: 'up', magnitude: 60 }, { label: 'W', direction: 'down', magnitude: 60 },
    { label: 'F', direction: 'right', magnitude: 30 }, { label: 'f', direction: 'left', magnitude: 15 },
  ];
  const shown = texts(svgOf('free_body_diagram_v2', { forces }));
  assert.ok(shown.includes('N = 60 N') && shown.includes('f = 15 N'));
  const hidden = texts(svgOf('free_body_diagram_v2', { forces: forces.map((f) => ({ ...f, showMagnitude: false })) }));
  assert.ok(hidden.includes('N') && !hidden.some((t) => /60|30|15/.test(t)));
  const len = (params: Record<string, unknown>) => fbdLayout(freeBodyModel(new Reader('free_body_diagram_v2', params))).lengths;
  const prop = len({ forces });
  assert.ok(Math.abs(prop[0] / prop[2] - 2) < 1e-9 && Math.abs(prop[2] / prop[3] - 2) < 1e-9, 'proportional to the magnitudes');
  const equal = len({ forces, lengths: 'equal' });
  assert.equal(new Set(equal.map((v) => v.toFixed(3))).size, 1);
  // No magnitudes at all ⇒ equal lengths; some but not all ⇒ a spec error for 'proportional'.
  assert.equal(new Set(len({ forces: forces.map(({ label, direction }) => ({ label, direction })) }).map((v) => v.toFixed(3))).size, 1);
  throwsSpec({ type: 'free_body_diagram_v2', params: { forces: [{ label: 'T', direction: 40 }, forces[1]], lengths: 'proportional' } }, /every force needs a magnitude/);
  // An arrow too small to draw to scale is drawn at the minimum length and reported.
  assert.deepEqual(warn('free_body_diagram_v2', { forces: [{ label: 'A', direction: 'up', magnitude: 100 }, { label: 'B', direction: 'down', magnitude: 2 }] }), ['not_to_scale']);
  // Six forces: every label is placed clear of the others.
  const six = { object: { shape: 'block', label: 'sled' }, surface: true, forces: [...forces, { label: 'T', direction: 35, magnitude: 40, showAngle: true }, { label: 'Drag', direction: 200, magnitude: 20 }] };
  assert.deepEqual(warn('free_body_diagram_v2', six), []);
  assert.ok(texts(svgOf('free_body_diagram_v2', six)).includes('35°'));
  // Incline: named directions follow the slope; the angle label can be replaced or left out.
  const inc = { object: { shape: 'box' }, incline: { angle: 30 }, forces: [{ label: 'N', direction: 'normal' }, { label: 'W', direction: 'down' }, { label: 'f', direction: 'up-slope' }] };
  const mi = freeBodyModel(new Reader('free_body_diagram_v2', inc));
  assert.deepEqual(mi.forces.map((f) => f.degrees), [120, 270, 30]);
  assert.ok(texts(svgOf('free_body_diagram_v2', inc)).includes('30°'));
  assert.ok(texts(svgOf('free_body_diagram_v2', { ...inc, incline: { angle: 30, angleLabel: 'θ' } })).includes('θ'));
  assert.ok(!texts(svgOf('free_body_diagram_v2', { ...inc, incline: { angle: 30, showAngle: false } })).some((t) => /30|θ/.test(t)));
  throwsSpec({ type: 'free_body_diagram_v2', params: { forces: [{ label: 'N', direction: 'normal' }] } }, /needs an incline/);
  throwsSpec({ type: 'free_body_diagram_v2', params: { forces: [{ label: 'N', direction: 'sideways' }] } }, /direction/);
  throwsSpec({ type: 'free_body_diagram_v2', params: { forces: [{ label: 'N', direction: 'up', magnitude: -3 }] } }, /greater than 0/);
});

test('shaded_region: hatching by drawn lines under a clip path; strict inequalities dashed; marks only when asked', () => {
  const under = svgOf('shaded_region', { xRange: [-1, 6], yRange: [-1, 6], region: { type: 'under_curve', expr: '0.5*x + 1', from: 0, to: 4 } });
  assert.match(under, /<clipPath id="pf[0-9a-z]+-region"><polygon /);
  assert.match(under, /<g clip-path="url\(#pf[0-9a-z]+-region\)"><path d="M[^"]+" fill="none"/);
  assert.ok(!/fill-opacity|opacity|<pattern/.test(under));
  const between = { xRange: [-3, 3], yRange: [-2, 6], region: { type: 'between_curves', upper: { expr: '4 - x^2', label: 'f' }, lower: { expr: 'x + 2', label: 'g' }, from: -2, to: 1 } };
  assert.equal((svgOf('shaded_region', between).match(/r="3.8"/g) ?? []).length, 0);
  assert.equal((svgOf('shaded_region', { ...between, region: { ...between.region, markIntersections: true } }).match(/r="3.8"/g) ?? []).length, 2);
  const ineq = (op: string) => svgOf('shaded_region', { xRange: [-1, 7], yRange: [-1, 7], region: { type: 'inequalities', inequalities: [{ a: 1, b: 1, op, c: 6 }, { a: 1, b: 0, op: '>=', c: 0 }, { a: 0, b: 1, op: '>=', c: 0 }] } });
  assert.ok(ineq('<').includes('stroke-dasharray="7 4"') && !ineq('<=').includes('stroke-dasharray="7 4"'));
  // Marked corners: filled, but OPEN on a strict (dashed) boundary.
  const corners = svgOf('shaded_region', { xRange: [-1, 9], yRange: [-1, 9], region: { type: 'inequalities', markVertices: true, inequalities: [{ a: 1, b: 1, op: '<=', c: 8 }, { a: 1, b: -1, op: '<', c: 2 }, { a: 1, b: 0, op: '>=', c: 0 }, { a: 0, b: 1, op: '>=', c: 1 }] } });
  assert.equal((corners.match(/r="3.8" fill="#ffffff"/g) ?? []).length, 2);
  assert.equal((corners.match(/r="3.8" fill="#111827"/g) ?? []).length, 2);
  // Nothing printed states the inequalities unless a label is given.
  assert.ok(!texts(ineq('<=')).some((t) => /≤|≥|</.test(t)));
  throwsSpec({ type: 'shaded_region', params: { xRange: [-1, 7], yRange: [-1, 7], region: { type: 'inequalities', inequalities: [{ a: 1, b: 0, op: '>', c: 5 }, { a: 1, b: 0, op: '<', c: 2 }] } } }, /no point of the plot satisfies/);
  throwsSpec({ type: 'shaded_region', params: { xRange: [-1, 7], yRange: [-1, 7], region: { type: 'under_curve', expr: '1/(x-2)', from: 0, to: 4 } } }, /not defined/);
  throwsSpec({ type: 'shaded_region', params: { xRange: [-1, 7], yRange: [-1, 7], region: { type: 'under_curve', expr: 'x', from: 4, to: 2 } } }, /to must be greater than from/);
  throwsSpec({ type: 'shaded_region', params: { xRange: [-1, 7], yRange: [-1, 7], region: { type: 'between_curves', upper: { expr: 'x' }, lower: { expr: 'x + 1' }, from: 0, to: 3 } } }, /upper .* below .* lower/);
  throwsSpec({ type: 'shaded_region', params: { xRange: [-1, 7], yRange: [-1, 7], region: { type: 'blob' } } }, /region.type/);
});

test('number_line: open / closed ends, rays with arrows, integer and fraction ticks; sign_chart: signs, zeros and "?" cells', () => {
  const nl = svgOf('number_line', { min: -5, max: 5, intervals: [{ from: -2, to: 3, fromOpen: true }, { from: 4, to: null }] });
  assert.equal((nl.match(/<circle [^>]*fill="#ffffff" stroke="#1d4ed8"/g) ?? []).length, 1, 'one open end');
  assert.equal((nl.match(/<circle [^>]*fill="#1d4ed8" stroke="#1d4ed8"/g) ?? []).length, 2, 'two closed ends');
  for (const t of ['−5', '0', '5']) assert.ok(texts(nl).includes(t));
  const fr = texts(svgOf('number_line', { min: 0, max: 2, denominator: 4, points: [{ x: 0.75, label: 'A' }] }));
  for (const t of ['1/4', '1/2', '3/4', '1', '5/4', '2', 'A']) assert.ok(fr.includes(t), t);
  assert.deepEqual(texts(svgOf('number_line', { min: -3, max: 3, labelOnly: [0, 1], points: [{ x: -2 }] })).sort(), ['0', '1']);
  throwsSpec({ type: 'number_line', params: { min: 0, max: 5, intervals: [{ from: 3, to: 1 }] } }, /to must be greater than from/);
  throwsSpec({ type: 'number_line', params: { min: 0, max: 5, points: [{ x: 9 }] } }, /outside min..max/);
  throwsSpec({ type: 'number_line', params: { min: 0, max: 5, intervals: [{ from: null, to: null, fromOpen: true }] } }, /open/);
  assert.ok(warn('number_line', { min: 0, max: 3, denominator: 12 }).includes('too_many_elements'));

  const sc = { critical: [-1, 2], rows: [{ label: 'f′(x)', signs: ['+', '-', '+'], at: ['0', '0'], blankSigns: [2] }, { label: 'f″(x)', signs: ['-', '-', '+'], at: ['', 'und'] }] };
  const st = texts(svgOf('sign_chart', sc));
  assert.equal(st.filter((t) => t === '+').length, 2, 'the sign under the blank is not printed');
  assert.equal(st.filter((t) => t === '−').length, 3);
  assert.equal(st.filter((t) => t === '?').length, 1);
  assert.ok(st.includes('f′(x)') && st.includes('−1') && st.includes('2') && st.includes('und'));
  throwsSpec({ type: 'sign_chart', params: { critical: [-1, 2], rows: [{ label: 'f', signs: ['+', '-'] }] } }, /signs must have 3 entries/);
  throwsSpec({ type: 'sign_chart', params: { critical: [2, -1], rows: [{ label: 'f', signs: ['+', '-', '+'] }] } }, /increasing/);
  throwsSpec({ type: 'sign_chart', params: { critical: [1], rows: [{ label: 'f', signs: ['+', '?'] }] } }, /'\+', '-' or ''/);
  throwsSpec({ type: 'sign_chart', params: { critical: [1], rows: [{ label: 'f', signs: ['+', ''], blankSigns: [1] }] } }, /give its true value/);
  assert.deepEqual(warn('sign_chart', { critical: [1], rows: [{ label: 'f′', signs: ['+', '-'], at: ['0'], blankSigns: [0, 1], blankAt: [0] }] }), ['ambiguous_blank']);
});

test('distribution_curve / histogram / box_plot: no area, count or five-number value is printed unless asked', () => {
  const dc = { shade: [{ from: -1, to: 1 }] };
  assert.ok(!texts(svgOf('distribution_curve', dc)).some((t) => /0\.68|68/.test(t)));
  assert.ok(texts(svgOf('distribution_curve', { ...dc, showArea: true })).includes('0.6827'));
  for (const t of ['−3', '−1', '0', '2', '3']) assert.ok(texts(svgOf('distribution_curve', dc)).includes(t));
  const x = texts(svgOf('distribution_curve', { mean: 100, sd: 15, shade: [{ from: 115, to: null }] }));
  for (const t of ['55', '85', '100', '115', '145']) assert.ok(x.includes(t), t);
  const sig = texts(svgOf('distribution_curve', { mean: 100, sd: 15, axis: 'sigma' }));
  assert.ok(sig.includes('μ') && sig.includes('μ+2σ') && sig.includes('μ−σ') && !sig.includes('100'));
  assert.ok(!texts(svgOf('distribution_curve', { axis: 'none', shade: [{ from: null, to: 1.5, label: 'k' }] })).some((t) => /^[−\d.]+$/.test(t)));
  assert.match(svgOf('distribution_curve', dc), /<clipPath id="pf[0-9a-z]+-shade0"><polygon /);
  throwsSpec({ type: 'distribution_curve', params: { sd: 0 } }, /sd must be greater than 0/);
  throwsSpec({ type: 'distribution_curve', params: { shade: [{ from: 2, to: 1 }] } }, /to must be greater than from/);
  throwsSpec({ type: 'distribution_curve', params: { shade: [{ from: null, to: null }] } }, /needs from or to/);

  const h = { binStart: 10, binWidth: 5, counts: [2, 6, 9, 4, 1], xLabel: 'Mass (g)' };
  const ht = texts(svgOf('histogram', h));
  for (const t of ['10', '15', '35', 'Mass (g)', 'Frequency']) assert.ok(ht.includes(t), t);
  assert.ok(!ht.includes('9') && texts(svgOf('histogram', { ...h, showCounts: true })).includes('9'));
  // A blank class: a "?" box instead of the bar, its count printed nowhere, and the axis not sized by it.
  const hb = texts(svgOf('histogram', { ...h, counts: [2, 6, 19, 4, 1], showCounts: true, blankBins: [2] }));
  assert.ok(hb.includes('?') && !hb.includes('19') && !hb.includes('18') && hb.includes('7') && !hb.includes('8'), 'the axis stops at 7, sized by the bars that are drawn');
  throwsSpec({ type: 'histogram', params: { ...h, counts: [2, -1] } }, /whole numbers ≥ 0/);
  throwsSpec({ type: 'histogram', params: { ...h, binWidth: 0 } }, /binWidth must be greater than 0/);
  assert.ok(warn('histogram', { binStart: 0, binWidth: 1, counts: new Array(15).fill(3) }).includes('too_many_elements'));

  const b = { plots: [{ label: 'Class A', min: 52, q1: 61, median: 70, q3: 78, max: 95, outliers: [31] }, { label: 'Class B', min: 40, q1: 55, median: 62, q3: 71, max: 88 }], range: [30, 100], step: 10 };
  const bt = texts(svgOf('box_plot', b));
  assert.ok(bt.includes('Class A') && bt.includes('Class B') && bt.includes('30') && bt.includes('100'));
  assert.ok(!bt.includes('70') || b.range[0] % 10 === 0, 'only axis numbers');
  assert.ok(!bt.includes('61') && !bt.includes('95'));
  assert.ok(texts(svgOf('box_plot', { ...b, showValues: true })).includes('61'));
  throwsSpec({ type: 'box_plot', params: { plots: [{ min: 5, q1: 4, median: 6, q3: 8, max: 9 }] } }, /min ≤ q1 ≤ median ≤ q3 ≤ max/);
  throwsSpec({ type: 'box_plot', params: { plots: [{ min: 5, q1: 6, median: 7, q3: 8, max: 9, outliers: [7] }] } }, /outlier.*outside min..max/);
});

test('polar_complex: complex plane and polar grid; construction lines and a curve r = f(θ) only when asked', () => {
  const c = { plane: 'complex', range: 6, step: 2, points: [{ re: 3, im: 4, label: 'z' }, { re: -2, im: 1, label: 'w' }] };
  const ct = texts(svgOf('polar_complex', c));
  assert.ok(ct.includes('Re') && ct.includes('Im') && ct.includes('z') && ct.includes('w'));
  assert.equal((svgOf('polar_complex', c).match(/stroke-dasharray="3 3"/g) ?? []).length, 0);
  const withLines = svgOf('polar_complex', { ...c, points: [{ ...c.points[0], showModulus: true, showArgument: true, projections: true }] });
  assert.ok(withLines.includes('stroke-dasharray="3 3"'));
  assert.ok(!texts(withLines).some((t) => /^5$|53/.test(t)), 'the modulus and the argument are drawn, never printed');
  const pl = { plane: 'polar', rMax: 4, angleStep: 30, points: [{ r: 3, theta: 120, label: 'P' }] };
  const pt = texts(svgOf('polar_complex', pl));
  for (const t of ['30°', '120°', '330°', '1', '4', 'P']) assert.ok(pt.includes(t), t);
  assert.ok(texts(svgOf('polar_complex', { ...pl, angleLabels: 'radians' })).includes('2π/3'));
  assert.ok(!texts(svgOf('polar_complex', { ...pl, angleLabels: 'none' })).some((t) => /°|π/.test(t)));
  const curve = svgOf('polar_complex', { plane: 'polar', rMax: 4, angleStep: 45, curve: { expr: '4*cos(2*theta)' } });
  assert.match(curve, /<path d="M[^"]{400,}" fill="none" stroke="#1d4ed8"/);
  assert.ok(!texts(curve).some((t) => t.includes('cos')), 'the equation is not printed');
  assert.ok(texts(svgOf('polar_complex', { plane: 'polar', rMax: 4, angleStep: 45, curve: { expr: '4*cos(2*theta)', label: 'r = 4 cos 2θ' } })).includes('r = 4 cos 2θ'));
  throwsSpec({ type: 'polar_complex', params: { plane: 'polar', rMax: 4, angleStep: 45, curve: { expr: '4*cos(2*q)' } } }, /curve.expr/);
  throwsSpec({ type: 'polar_complex', params: { plane: 'polar', rMax: 4, angleStep: 7, points: [] } }, /angleStep must be one of/);
  throwsSpec({ type: 'polar_complex', params: { plane: 'polar', rMax: 4, angleStep: 30, points: [{ r: 9, theta: 0 }] } }, /outside/);
  throwsSpec({ type: 'polar_complex', params: { plane: 'argand' } }, /plane must be 'complex' or 'polar'/);
});

test('punnett_square: cells from the gametes, any cell or header blank, phenotype hatching with a legend', () => {
  const mono = { top: ['A', 'a'], side: ['A', 'a'] };
  assert.deepEqual(punnettModel(new Reader('punnett_square', mono)).cells.map((row) => row.map((c) => c.genotype)), [['AA', 'Aa'], ['Aa', 'aa']]);
  const di = punnettModel(new Reader('punnett_square', { top: ['RY', 'Ry', 'rY', 'ry'], side: ['RY', 'Ry', 'rY', 'ry'] }));
  assert.equal(di.cells[3][0].genotype, 'RrYy');
  assert.equal(di.cells[1][2].genotype, 'RrYy');
  assert.equal(di.cells[3][3].genotype, 'rryy');
  const t = texts(svgOf('punnett_square', { ...mono, blankCells: [[1, 1]], blankTop: [0] }));
  assert.equal(t.filter((s) => s === '?').length, 2);
  assert.ok(!t.includes('aa') && t.includes('AA') && t.filter((s) => s === 'A').length === 1);
  const ph = svgOf('punnett_square', { ...mono, phenotypes: [{ label: 'purple flowers', genotypes: ['AA', 'Aa'] }, { label: 'white flowers', genotypes: ['aa'] }] });
  assert.ok(texts(ph).includes('purple flowers') && texts(ph).includes('white flowers'));
  assert.ok((ph.match(/<clipPath /g) ?? []).length >= 1 && !/<pattern|opacity/.test(ph));
  assert.ok(!texts(svgOf('punnett_square', mono)).some((s) => /flowers/.test(s)));
  // Every phenotype class is hatched (two clip paths for two classes, plus two legend swatches), so only a blank cell is plain.
  assert.equal((ph.match(/<clipPath /g) ?? []).length, 4);
  assert.equal((svgOf('punnett_square', { ...mono, blankCells: [[1, 1]], phenotypes: [{ label: 'purple flowers', genotypes: ['AA', 'Aa'] }, { label: 'white flowers', genotypes: ['aa'] }] }).match(/<clipPath /g) ?? []).length, 3, 'the blank cell is not hatched');
  throwsSpec({ type: 'punnett_square', params: { top: ['A', 'a'], side: ['AB', 'a'] } }, /same number of alleles/);
  throwsSpec({ type: 'punnett_square', params: { ...mono, blankCells: [[2, 0]] } }, /blankCells\[0\]/);
  throwsSpec({ type: 'punnett_square', params: { ...mono, phenotypes: [{ label: 'x', genotypes: ['AA'] }] } }, /phenotypes do not cover/);
  assert.deepEqual(warn('punnett_square', { ...mono, blankTop: [0], blankCells: [[0, 0], [1, 0]] }), ['ambiguous_blank']);
});

test('pedigree: standard symbols, automatic layout to three generations, numbering', () => {
  const fam = {
    individuals: [
      { id: 'a', sex: 'M' }, { id: 'b', sex: 'F', affected: true },
      { id: 'c', sex: 'F', father: 'a', mother: 'b', carrier: true }, { id: 'd', sex: 'M', father: 'a', mother: 'b', affected: true }, { id: 's', sex: 'M' },
      { id: 'e', sex: 'F', father: 's', mother: 'c' }, { id: 'f', sex: 'M', father: 's', mother: 'c', affected: true },
    ],
  };
  const svg = svgOf('pedigree', fam);
  const t = texts(svg);
  for (const s of ['I', 'II', 'III', '1', '2', '3']) assert.ok(t.includes(s), s);
  const m = pedigreeModel(new Reader('pedigree', fam));
  assert.deepEqual(m.individuals.map((i) => i.generation), [0, 0, 1, 1, 1, 2, 2]);
  assert.deepEqual(m.generations.map((g) => g.map((i) => i.id).sort()), [['a', 'b'], ['c', 'd', 's'], ['e', 'f']]);
  // Partners sit side by side in every generation.
  const lay = pedigreeLayout(m);
  for (const [x, y] of m.matings) assert.equal(Math.abs(lay.order[x] - lay.order[y]), 1, `${x}–${y}`);
  assert.equal(m.individuals.find((i) => i.id === 'e')?.number, 'III-1');
  assert.ok(texts(svgOf('pedigree', { individuals: fam.individuals.map((i) => (i.id === 'e' ? { ...i, unknown: true } : i)) })).includes('?'));
  assert.ok(t.includes('affected') && t.includes('carrier'));
  assert.ok(!texts(svgOf('pedigree', { ...fam, legend: false })).includes('affected'));
  throwsSpec({ type: 'pedigree', params: { individuals: [{ id: 'a', sex: 'M' }, { id: 'c', sex: 'F', father: 'a', mother: 'zz' }] } }, /mother "zz" is not in the list/);
  throwsSpec({ type: 'pedigree', params: { individuals: [{ id: 'a', sex: 'M' }, { id: 'c', sex: 'F', father: 'a' }] } }, /both parents or neither/);
  throwsSpec({ type: 'pedigree', params: { individuals: [{ id: 'a', sex: 'F' }, { id: 'b', sex: 'F' }, { id: 'c', sex: 'F', father: 'a', mother: 'b' }] } }, /father "a" must be male/);
  throwsSpec({ type: 'pedigree', params: { individuals: [{ id: 'a', sex: 'M' }, { id: 'a', sex: 'F' }] } }, /id "a" is used twice/);
  throwsSpec({ type: 'pedigree', params: { individuals: [{ id: 'a', sex: 'M', father: 'b', mother: 'c' }, { id: 'b', sex: 'M', father: 'a', mother: 'c' }, { id: 'c', sex: 'F' }] } }, /own ancestor/);
  const big = { individuals: Array.from({ length: 13 }, (_, k) => (k < 2 ? { id: `p${k}`, sex: k ? 'F' : 'M' } : { id: `k${k}`, sex: k % 2 ? 'F' : 'M', father: 'p0', mother: 'p1' })) };
  assert.ok(warn('pedigree', big).includes('too_many_elements'));
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
