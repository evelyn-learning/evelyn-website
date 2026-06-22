/**
 * Smoke test for the graph slope/point-consistency guard.
 *
 * Usage: npx tsx scripts/test-graph-consistency.ts
 */
import {
  parseLinear,
  validateGraphLinearConsistency,
} from '../src/lib/tutor/whiteboard/graph-consistency-validator';
import type { GraphData } from '../src/lib/knowledge/types';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// --- parseLinear ---
check('parseLinear: "0.667 * x" → m=0.667,b=0', JSON.stringify(parseLinear('0.667 * x')) === JSON.stringify({ m: 0.667, b: 0 }));
check('parseLinear: "0.00667x" → m=0.00667', parseLinear('0.00667x')?.m === 0.00667);
check('parseLinear: "2x + 3"', JSON.stringify(parseLinear('2x + 3')) === JSON.stringify({ m: 2, b: 3 }));
check('parseLinear: "y = -x - 5"', JSON.stringify(parseLinear('y = -x - 5')) === JSON.stringify({ m: -1, b: -5 }));
check('parseLinear: "x" → m=1', JSON.stringify(parseLinear('x')) === JSON.stringify({ m: 1, b: 0 }));
check('parseLinear rejects "x^2"', parseLinear('x^2') === null);
check('parseLinear rejects "0.5x^2 + 1"', parseLinear('0.5x^2 + 1') === null);
check('parseLinear rejects "\\sin(x)"', parseLinear('\\sin(x)') === null);
check('parseLinear rejects "3y + 2" (wrong var)', parseLinear('3y + 2') === null);
check('parseLinear: latex "0.00667\\cdot x"', parseLinear('0.00667\\cdot x')?.m === 0.00667);

// --- The reported bug: Charles's-Law V–T, slope 100× too steep ---
const charles: GraphData = {
  title: "Charles's Law: Volume vs Temperature",
  xLabel: 'Temperature (K)', yLabel: 'Volume (L)',
  xRange: [0, 700], yRange: [0, 5],
  functions: [{ latex: '0.667 * x', label: 'V = kT (Charles\'s Law)', color: 'blue' }],
  points: [
    { x: 300, y: 2, label: 'Cold: 300K, 2L' },
    { x: 600, y: 4, label: 'Warm: 600K, 4L' },
  ],
};
const fixed = validateGraphLinearConsistency(charles);
check('Charles: guard fired (returned a new object)', fixed !== charles);
check('Charles: slope refit to ~0.00667', Math.abs((parseLinear(fixed.functions![0].latex!)?.m ?? 0) - 0.00667) < 1e-4,
  fixed.functions?.[0]?.latex);
check('Charles: refit line passes through (600,4)', Math.abs((parseLinear(fixed.functions![0].latex!)!.m * 600) - 4) < 0.05);
check('Charles: legacy fn cleared so latex wins', fixed.functions![0].fn === undefined);
check('Charles: points untouched', fixed.points!.length === 2 && fixed.points![0].y === 2);

// --- No false positives ---
const correctLine: GraphData = {
  xLabel: 'T', yLabel: 'V', xRange: [0, 700], yRange: [0, 5],
  functions: [{ latex: '0.00667x', label: 'V = kT' }],
  points: [{ x: 300, y: 2 }, { x: 600, y: 4 }],
};
check('correct line: guard does NOT fire', validateGraphLinearConsistency(correctLine) === correctLine);

const noPoints: GraphData = {
  xLabel: 'x', yLabel: 'y', xRange: [-5, 5], yRange: [-5, 5],
  functions: [{ latex: '5x' }],
};
check('no points: guard skips (nothing to check against)', validateGraphLinearConsistency(noPoints) === noPoints);

const nonlinear: GraphData = {
  xLabel: 'x', yLabel: 'y', xRange: [-3, 3], yRange: [0, 9],
  functions: [{ latex: 'x^2' }],
  points: [{ x: 1, y: 1 }, { x: 2, y: 4 }, { x: 3, y: 9 }],
};
check('nonlinear (x^2): out of scope, left untouched', validateGraphLinearConsistency(nonlinear) === nonlinear);

const scatterNotALine: GraphData = {
  xLabel: 'x', yLabel: 'y', xRange: [0, 10], yRange: [0, 10],
  functions: [{ latex: '2x' }],
  points: [{ x: 1, y: 9 }, { x: 5, y: 1 }, { x: 8, y: 6 }], // not collinear
};
check('non-collinear points: guard does NOT refit (can\'t define a line)', validateGraphLinearConsistency(scatterNotALine) === scatterNotALine);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
