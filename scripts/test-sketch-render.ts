/**
 * Unit tests for the sketch RENDER core (buildSketchPaths) — the pure path/label
 * builder shared by the live component, the PDF renderer, and the smoke script.
 * Focus: the label-clamp (long labels near an edge must not clip) and that the
 * `concentric` primitive expands into one ellipse path per ring.
 *
 * Usage: npx tsx scripts/test-sketch-render.ts
 */
import { buildSketchPaths } from '../src/lib/tutor/whiteboard/sketch-render-core';
import { SKETCH_VIEWBOX, type SketchPrimitive } from '../src/lib/tutor/whiteboard/sketch-schema';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const W = SKETCH_VIEWBOX.width;
const PAD = 2;
const estW = (text: string, fs: number) => Math.max(8, text.length * fs * 0.55);
const onlyLabel = (prims: SketchPrimitive[]) => buildSketchPaths(prims).labels[0];

const LONG = 'compressed (high pitch)'; // the exact label that clipped in the Doppler probe
const fs = 5;
const w = estW(LONG, fs);

// ── the reported nit: a long label anchored 'start' near the right edge ──
const start = onlyLabel([{ type: 'label', x: 95, y: 50, text: LONG, anchor: 'start' } as SketchPrimitive]);
check('start-anchored long label right edge stays in-bounds',
  start.x + w <= W - PAD + 1e-6, `x=${start.x} x+w=${start.x + w}`);

// ── middle anchor near right edge: box (x ± w/2) stays in-bounds ──
const mid = onlyLabel([{ type: 'label', x: 96, y: 50, text: LONG, anchor: 'middle' } as SketchPrimitive]);
check('middle-anchored long label right edge stays in-bounds',
  mid.x + w / 2 <= W - PAD + 1e-6 && mid.x - w / 2 >= PAD - 1e-6, `x=${mid.x}`);

// ── end anchor near left edge: box (x - w) stays in-bounds ──
const end = onlyLabel([{ type: 'label', x: 4, y: 50, text: LONG, anchor: 'end' } as SketchPrimitive]);
check('end-anchored long label left edge stays in-bounds',
  end.x - w >= PAD - 1e-6, `x=${end.x} x-w=${end.x - w}`);

// ── vertical clamp: a label at the very bottom is pulled up by half its height ──
const bottom = onlyLabel([{ type: 'label', x: 50, y: 100, text: 'source', anchor: 'middle' } as SketchPrimitive]);
check('bottom label clamped above the edge', bottom.y <= W - PAD, `y=${bottom.y}`);
const top = onlyLabel([{ type: 'label', x: 50, y: 0, text: 'source', anchor: 'middle' } as SketchPrimitive]);
check('top label clamped below the edge', top.y >= PAD, `y=${top.y}`);

// ── a well-placed label is left untouched ──
const ok = onlyLabel([{ type: 'label', x: 50, y: 50, text: 'hi', anchor: 'middle' } as SketchPrimitive]);
check('centered label unchanged', ok.x === 50 && ok.y === 50);

// ── the feature bbox tracks the clamped position (scribble targeting stays aligned) ──
check('feature cx matches clamped x',
  Math.abs(((start.feature as any).cx ?? start.x) - start.x) < 1e-6 || start.feature != null);

// ── concentric expands to ≥ count ellipse paths (one hand-drawn ring each) ──
const conc = buildSketchPaths([
  { type: 'concentric', cx: 45, cy: 50, count: 4, spacing: 6.5, squeeze: 0.5, angle: 0 } as SketchPrimitive,
]);
const pathCount = conc.drawn.reduce((n, d) => n + d.paths.length, 0);
check('concentric renders ≥ count rings', conc.drawn.length === 1 && pathCount >= 4, `paths=${pathCount}`);

// ── wave expands to a single sampled curve ──
const wv = buildSketchPaths([
  { type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, cycles: 3, amplitude: 14, damping: 0.5 } as SketchPrimitive,
]);
check('wave renders one drawn curve', wv.drawn.length === 1 && wv.drawn[0].paths.length >= 1,
  `paths=${wv.drawn[0]?.paths.length}`);

// ── spring expands to a single polyline ──
const sp = buildSketchPaths([
  { type: 'spring', x1: 50, y1: 14, x2: 50, y2: 60, coils: 6, width: 6 } as SketchPrimitive,
]);
check('spring renders one drawn polyline', sp.drawn.length === 1 && sp.drawn[0].paths.length >= 1,
  `paths=${sp.drawn[0]?.paths.length}`);

// ── stick_figure expands to head + spine + 2 arms + 2 legs (≥6 shapes) ──
const sf = buildSketchPaths([
  { type: 'stick_figure', x: 50, y: 50, scale: 30, pose: 'run' } as SketchPrimitive,
]);
check('stick_figure renders ≥6 sub-paths (head+spine+arms+legs)',
  sf.drawn.length === 1 && sf.drawn[0].paths.length >= 6, `paths=${sf.drawn[0]?.paths.length}`);

// ── container_fill (beaker) renders outline + liquid + spout ──
const cf = buildSketchPaths([
  { type: 'container_fill', x: 36, y: 26, w: 28, h: 46, fillFrac: 0.5, shape: 'beaker', fillColor: 'blue' } as SketchPrimitive,
]);
check('container_fill beaker renders ≥3 sub-paths', cf.drawn[0].paths.length >= 3, `paths=${cf.drawn[0]?.paths.length}`);
// an empty container (fillFrac 0) still draws its outline
const cf0 = buildSketchPaths([
  { type: 'container_fill', x: 36, y: 26, w: 28, h: 46, fillFrac: 0, shape: 'tank' } as SketchPrimitive,
]);
check('empty container_fill still renders its outline', cf0.drawn[0].paths.length >= 1);

// ── each new primitive's geometry stays within the canvas (with rough jitter tol) ──
const TOL = 6;
const nums = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
function inBounds(prims: SketchPrimitive[]): boolean {
  const { drawn } = buildSketchPaths(prims);
  for (const { paths } of drawn) {
    for (const pi of paths) {
      for (const v of nums(pi.d)) {
        if (v < -TOL || v > W + TOL) return false;
      }
    }
  }
  return true;
}
check('wave stays in bounds', inBounds([
  { type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, cycles: 3, amplitude: 14 } as SketchPrimitive,
]));
check('spring stays in bounds', inBounds([
  { type: 'spring', x1: 50, y1: 14, x2: 50, y2: 60, coils: 6, width: 6 } as SketchPrimitive,
]));
check('stick_figure stays in bounds', inBounds([
  { type: 'stick_figure', x: 50, y: 50, scale: 30, pose: 'run' } as SketchPrimitive,
]));
check('container_fill stays in bounds', inBounds([
  { type: 'container_fill', x: 36, y: 26, w: 28, h: 46, fillFrac: 0.5, shape: 'thermometer' } as SketchPrimitive,
]));

// ── vector: line + head; curved/double/block variants render ──
for (const style of ['single', 'double', 'curved', 'block'] as const) {
  const v = buildSketchPaths([
    { type: 'vector', x1: 20, y1: 50, x2: 70, y2: 50, style } as SketchPrimitive,
  ]);
  check(`vector (${style}) renders ≥2 sub-paths`, v.drawn.length === 1 && v.drawn[0].paths.length >= 2,
    `paths=${v.drawn[0]?.paths.length}`);
}
// a vector's inline label lands in the labels array (not the drawn paths)
const vlab = buildSketchPaths([
  { type: 'vector', x1: 20, y1: 50, x2: 70, y2: 50, style: 'block', label: 'force' } as SketchPrimitive,
]);
check('vector label routes to labels[]', vlab.drawn.length === 1 && vlab.labels.length === 1 && vlab.labels[0].text === 'force');

// ── grid: boxes expands to ≥ cols*rows rects; fillCount adds counter dots ──
const gb = buildSketchPaths([
  { type: 'grid', x: 20, y: 40, cols: 5, rows: 2, cell: 11, style: 'boxes', fillCount: 7 } as SketchPrimitive,
]);
check('grid boxes renders ≥ cols*rows + fillCount sub-paths', gb.drawn[0].paths.length >= 10 + 7,
  `paths=${gb.drawn[0]?.paths.length}`);
const gl = buildSketchPaths([
  { type: 'grid', x: 20, y: 40, cols: 5, rows: 2, cell: 11, style: 'lines' } as SketchPrimitive,
]);
check('grid lines renders ≥ (cols+1)+(rows+1) rules', gl.drawn[0].paths.length >= 6 + 3, `paths=${gl.drawn[0]?.paths.length}`);
const gd = buildSketchPaths([
  { type: 'grid', x: 20, y: 40, cols: 5, rows: 2, cell: 11, style: 'dots' } as SketchPrimitive,
]);
check('grid dots renders a dot per intersection', gd.drawn[0].paths.length >= 6 * 3, `paths=${gd.drawn[0]?.paths.length}`);

// ── brace: one drawn curve; inline label routes to labels[] ──
const br = buildSketchPaths([
  { type: 'brace', x1: 14, y1: 56, x2: 50, y2: 56, side: 'bottom', label: 'one wavelength' } as SketchPrimitive,
]);
check('brace renders one curve + routes its label', br.drawn.length === 1 && br.drawn[0].paths.length >= 1 && br.labels.length === 1);

// ── arc: one sampled open curve ──
const ar = buildSketchPaths([
  { type: 'arc', cx: 50, cy: 14, r: 47, startAngle: 70, endAngle: 110 } as SketchPrimitive,
]);
check('arc renders one drawn curve', ar.drawn.length === 1 && ar.drawn[0].paths.length >= 1, `paths=${ar.drawn[0]?.paths.length}`);

// ── blob: filled → polygon, unfilled → closed spline; both render ──
const bf = buildSketchPaths([
  { type: 'blob', cx: 48, cy: 46, rx: 30, ry: 17, wobble: 0.32, fill: 'gray' } as SketchPrimitive,
]);
check('filled blob renders', bf.drawn.length === 1 && bf.drawn[0].paths.length >= 1);
const bo = buildSketchPaths([
  { type: 'blob', cx: 48, cy: 46, rx: 30, ry: 17, wobble: 0.32 } as SketchPrimitive,
]);
check('outline blob renders', bo.drawn.length === 1 && bo.drawn[0].paths.length >= 1);
// determinism: same input → identical path geometry (stable seed)
const bo2 = buildSketchPaths([
  { type: 'blob', cx: 48, cy: 46, rx: 30, ry: 17, wobble: 0.32 } as SketchPrimitive,
]);
check('blob render is deterministic', JSON.stringify(bo.drawn) === JSON.stringify(bo2.drawn));

// ── dots_cluster: ≥ count sub-paths ──
const dc = buildSketchPaths([
  { type: 'dots_cluster', cx: 50, cy: 50, count: 26, spread: 22 } as SketchPrimitive,
]);
check('dots_cluster renders ≥ count dots', dc.drawn[0].paths.length >= 26, `paths=${dc.drawn[0]?.paths.length}`);

// ── pulley: wheel + hub + rope arc + hanging sides ──
const pul = buildSketchPaths([
  { type: 'pulley', cx: 50, cy: 26, r: 12, ropeDir: 'both' } as SketchPrimitive,
]);
check('pulley (both) renders ≥5 sub-paths (rim+hub+arc+2 ropes)',
  pul.drawn.length === 1 && pul.drawn[0].paths.length >= 5, `paths=${pul.drawn[0]?.paths.length}`);
const pulL = buildSketchPaths([
  { type: 'pulley', cx: 50, cy: 26, r: 12, ropeDir: 'left' } as SketchPrimitive,
]);
check('pulley (left) renders fewer paths than both',
  pulL.drawn[0].paths.length < pul.drawn[0].paths.length, `left=${pulL.drawn[0].paths.length} both=${pul.drawn[0].paths.length}`);

// ── lever: beam + fulcrum triangle; tilt rotates the beam ──
const lev = buildSketchPaths([
  { type: 'lever', x: 50, y: 56, length: 76, pivotFrac: 0.5, tilt: 0 } as SketchPrimitive,
]);
check('lever renders ≥2 sub-paths (beam + fulcrum)', lev.drawn[0].paths.length >= 2, `paths=${lev.drawn[0]?.paths.length}`);
const levTilt = buildSketchPaths([
  { type: 'lever', x: 50, y: 56, length: 76, pivotFrac: 0.5, tilt: 20 } as SketchPrimitive,
]);
check('lever tilt changes beam geometry', JSON.stringify(lev.drawn) !== JSON.stringify(levTilt.drawn));

// ── gauge: dial arc + base + ticks + needle + hub ──
const gau = buildSketchPaths([
  { type: 'gauge', cx: 50, cy: 62, r: 34, frac: 0.7, label: 'speed' } as SketchPrimitive,
]);
check('gauge renders ≥5 sub-paths (arc+base+ticks+needle+hub)', gau.drawn[0].paths.length >= 5, `paths=${gau.drawn[0]?.paths.length}`);
check('gauge label routes to labels[]', gau.labels.length === 1 && gau.labels[0].text === 'speed');
// needle position tracks frac
const gau0 = buildSketchPaths([
  { type: 'gauge', cx: 50, cy: 62, r: 34, frac: 0.1 } as SketchPrimitive,
]);
check('gauge needle tracks frac', JSON.stringify(gau.drawn) !== JSON.stringify(gau0.drawn));

// ── axis: line + ticks; labels route to labels[] under the ticks ──
const ax = buildSketchPaths([
  { type: 'axis', x1: 10, y1: 46, x2: 90, y2: 46, ticks: 11, labels: ['0', '1', '2'] } as SketchPrimitive,
]);
check('axis renders line + ≥ ticks sub-paths', ax.drawn[0].paths.length >= 1 + 11, `paths=${ax.drawn[0]?.paths.length}`);
check('axis labels route to labels[]', ax.labels.length === 3 && ax.labels[0].text === '0');
// labels are capped by the tick count
const axCap = buildSketchPaths([
  { type: 'axis', x1: 10, y1: 46, x2: 90, y2: 46, ticks: 2, labels: ['a', 'b', 'c', 'd'] } as SketchPrimitive,
]);
check('axis labels capped at tick count', axCap.labels.length === 2, `labels=${axCap.labels.length}`);

// ── each new primitive's geometry stays within the canvas ──
check('pulley stays in bounds', inBounds([
  { type: 'pulley', cx: 50, cy: 26, r: 12, ropeDir: 'both' } as SketchPrimitive,
]));
check('lever stays in bounds', inBounds([
  { type: 'lever', x: 50, y: 56, length: 76, pivotFrac: 0.5, tilt: 15 } as SketchPrimitive,
]));
check('gauge stays in bounds', inBounds([
  { type: 'gauge', cx: 50, cy: 62, r: 34, frac: 0.7 } as SketchPrimitive,
]));
check('axis stays in bounds', inBounds([
  { type: 'axis', x1: 10, y1: 46, x2: 90, y2: 46, ticks: 11 } as SketchPrimitive,
]));

check('vector (curved) stays in bounds', inBounds([
  { type: 'vector', x1: 20, y1: 50, x2: 70, y2: 50, style: 'curved' } as SketchPrimitive,
]));
check('grid stays in bounds', inBounds([
  { type: 'grid', x: 20, y: 40, cols: 5, rows: 2, cell: 11, style: 'boxes', fillCount: 7 } as SketchPrimitive,
]));
check('brace stays in bounds', inBounds([
  { type: 'brace', x1: 14, y1: 56, x2: 50, y2: 56, side: 'bottom' } as SketchPrimitive,
]));
check('arc stays in bounds', inBounds([
  { type: 'arc', cx: 50, cy: 14, r: 47, startAngle: 70, endAngle: 110 } as SketchPrimitive,
]));
check('blob stays in bounds', inBounds([
  { type: 'blob', cx: 48, cy: 46, rx: 30, ry: 17, wobble: 0.32 } as SketchPrimitive,
]));
check('dots_cluster stays in bounds', inBounds([
  { type: 'dots_cluster', cx: 50, cy: 50, count: 26, spread: 22 } as SketchPrimitive,
]));

// ── coordinate_grid: gridlines + 2 axes + arrowheads; labels route to labels[] ──
const cg = buildSketchPaths([
  { type: 'coordinate_grid', x: 20, y: 16, w: 60, h: 60, quadrants: 4, xLabel: 'x', yLabel: 'y' } as SketchPrimitive,
]);
// 9 vertical + 9 horizontal gridlines + 2 axes + 4 arrowheads(×2 strokes) = many paths
check('coordinate_grid renders many sub-paths (grid + axes + heads)', cg.drawn[0].paths.length >= 20, `paths=${cg.drawn[0]?.paths.length}`);
check('coordinate_grid axis labels route to labels[]', cg.labels.length === 2 && cg.labels.some((l) => l.text === 'x') && cg.labels.some((l) => l.text === 'y'));
// 1-quadrant grid has 2 arrowheads (not 4) → fewer paths than the 4-quadrant one
const cg1 = buildSketchPaths([
  { type: 'coordinate_grid', x: 20, y: 16, w: 60, h: 60, quadrants: 1 } as SketchPrimitive,
]);
check('coordinate_grid (1-quadrant) renders fewer paths than 4-quadrant',
  cg1.drawn[0].paths.length < cg.drawn[0].paths.length, `q1=${cg1.drawn[0].paths.length} q4=${cg.drawn[0].paths.length}`);

// ── orbit: path + central body + satellite; labels route to labels[] ──
const orb = buildSketchPaths([
  { type: 'orbit', cx: 50, cy: 50, rx: 33, ry: 20, angle: -35, centerLabel: 'sun', satelliteLabel: 'planet' } as SketchPrimitive,
]);
check('orbit renders ≥3 sub-paths (path + body + satellite)', orb.drawn[0].paths.length >= 3, `paths=${orb.drawn[0]?.paths.length}`);
check('orbit labels route to labels[]', orb.labels.length === 2 && orb.labels.some((l) => l.text === 'planet'));
// satellite position tracks angle
const orb2 = buildSketchPaths([
  { type: 'orbit', cx: 50, cy: 50, rx: 33, ry: 20, angle: 120 } as SketchPrimitive,
]);
check('orbit satellite tracks angle', JSON.stringify(orb.drawn) !== JSON.stringify(orb2.drawn));

// ── molecule: bonds + atoms; atom letters route to labels[] ──
const mole = buildSketchPaths([
  { type: 'molecule',
    atoms: [{ x: 50, y: 46, label: 'O' }, { x: 36, y: 62, label: 'H' }, { x: 64, y: 62, label: 'H' }],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }] } as SketchPrimitive,
]);
check('molecule renders ≥ atoms + bonds sub-paths', mole.drawn[0].paths.length >= 3 + 2, `paths=${mole.drawn[0]?.paths.length}`);
check('molecule atom letters route to labels[]', mole.labels.length === 3 && mole.labels[0].text === 'O');
// a double bond draws 2 lines, so more paths than the same single bond
const molS = buildSketchPaths([
  { type: 'molecule', atoms: [{ x: 30, y: 50 }, { x: 70, y: 50 }], bonds: [{ a: 0, b: 1, order: 1 }] } as SketchPrimitive,
]);
const molD = buildSketchPaths([
  { type: 'molecule', atoms: [{ x: 30, y: 50 }, { x: 70, y: 50 }], bonds: [{ a: 0, b: 1, order: 2 }] } as SketchPrimitive,
]);
check('molecule double bond renders more lines than single', molD.drawn[0].paths.length > molS.drawn[0].paths.length,
  `single=${molS.drawn[0].paths.length} double=${molD.drawn[0].paths.length}`);

// ── bar_compare: baseline + one bar per value; labels route to labels[] ──
const bc = buildSketchPaths([
  { type: 'bar_compare', x: 20, y: 24, w: 60, h: 50, values: [3, 7, 5], labels: ['A', 'B', 'C'] } as SketchPrimitive,
]);
check('bar_compare renders baseline + ≥3 bars', bc.drawn[0].paths.length >= 1 + 3, `paths=${bc.drawn[0]?.paths.length}`);
check('bar_compare labels route to labels[]', bc.labels.length === 3 && bc.labels[0].text === 'A');

// ── each Wave-4 primitive's geometry stays within the canvas ──
check('coordinate_grid stays in bounds', inBounds([
  { type: 'coordinate_grid', x: 20, y: 16, w: 60, h: 60, quadrants: 4 } as SketchPrimitive,
]));
check('orbit stays in bounds', inBounds([
  { type: 'orbit', cx: 50, cy: 50, rx: 33, ry: 20, angle: -35 } as SketchPrimitive,
]));
check('molecule stays in bounds', inBounds([
  { type: 'molecule',
    atoms: [{ x: 50, y: 46 }, { x: 36, y: 62 }, { x: 64, y: 62 }],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }] } as SketchPrimitive,
]));
check('bar_compare stays in bounds', inBounds([
  { type: 'bar_compare', x: 20, y: 24, w: 60, h: 50, values: [3, 7, 5] } as SketchPrimitive,
]));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
