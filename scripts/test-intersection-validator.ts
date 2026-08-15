/**
 * Smoke test for the intersection-point validator.
 *
 * Usage: npx tsx scripts/test-intersection-validator.ts
 */

import {
  validateIntersectionPoints,
  latexToJs,
} from "../apps/marketing/src/lib/tutor/whiteboard/intersection-validator";

type TC = { name: string; ok: boolean; detail?: string };
const results: TC[] = [];
function check(name: string, cond: boolean, detail?: string) {
  results.push({ name, ok: cond, detail });
}

// --- latexToJs sanity ---
check(
  "latexToJs: x^3",
  latexToJs("x^3", "x") === "x**3",
  latexToJs("x^3", "x") || "null",
);
check(
  "latexToJs: 4x - x^2",
  latexToJs("4x - x^2", "x") === "4*x - x**2",
  latexToJs("4x - x^2", "x") || "null",
);
check(
  "latexToJs rejects relations",
  latexToJs("y = x^2 + 1", "x") === "x**2 + 1",
);
check(
  "latexToJs: \\sin(x) + \\frac{1}{2}",
  latexToJs("\\sin(x) + \\frac{1}{2}", "x") === "Math.sin(x) + ((1)/(2))",
  latexToJs("\\sin(x) + \\frac{1}{2}", "x") || "null",
);

// --- The bug case: y=x^3 and y=4x-x^2 with mislabeled intersections ---
const bugCase = validateIntersectionPoints({
  title: "Graph of y = x^3 and y = 4x − x²",
  xRange: [-2.5, 4],
  yRange: [-6, 10],
  functions: [
    { latex: "x^3", label: "y = x^3" },
    { latex: "4x - x^2", label: "y = 4x - x²" },
  ],
  points: [
    { x: 0, y: 0, label: "(0, 0)", color: "#16a34a" },
    { x: 2, y: 4, label: "(2, 4)", color: "#16a34a" },
    { x: 4, y: 0, label: "(4, 0)", color: "#16a34a" },
  ],
});

const bugPoints = bugCase.points || [];
const labels = bugPoints.map(p => p.label).join(", ");

check(
  "bug: (0,0) is kept",
  bugPoints.some(p => Math.abs(p.x) < 0.01 && Math.abs(p.y) < 0.01),
  labels,
);
check(
  "bug: (2,4) is dropped (not on y=x^3, since 2^3=8)",
  !bugPoints.some(p => Math.abs(p.x - 2) < 0.01 && Math.abs(p.y - 4) < 0.01),
  labels,
);
check(
  "bug: (4,0) is dropped (not on y=x^3, since 4^3=64)",
  !bugPoints.some(p => Math.abs(p.x - 4) < 0.01 && Math.abs(p.y) < 0.01),
  labels,
);
check(
  "bug: real intersection near x ≈ 1.56 is auto-added",
  bugPoints.some(p => Math.abs(p.x - 1.5616) < 0.05),
  labels,
);

// --- 3-curve case from the voice-tutor screenshot ---
// y = x^3, y = 2x - 3x^2, y = x; intersection points should be pairwise:
//   y=x^3 ∩ y=x:        (-1,-1), (0,0), (1,1)
//   y=x^3 ∩ y=2x-3x^2:  (0,0), (~0.56, ~0.18), (~-3.56, ~-45) [off-screen]
//   y=x   ∩ y=2x-3x^2:  (0,0), (1/3, 1/3)
const threeCurve = validateIntersectionPoints({
  title: "Graphs of y = x^3, y = 2x - 3x^2, and y = x",
  xRange: [-3, 3],
  yRange: [-5, 5],
  functions: [
    { latex: "x^3", label: "y = x^3" },
    { latex: "2x - 3x^2", label: "y = 2x - 3x²" },
    { latex: "x", label: "y = x" },
  ],
  points: [
    { x: 0, y: 0, label: "(0, 0)" },
    { x: 1, y: 1, label: "(1, 1)" }, // on y=x^3 and y=x, NOT parabola — should be kept under pairwise rule
    { x: 2, y: 2, label: "(2, 2)" }, // on y=x only — should be dropped
  ],
});
const threePoints = threeCurve.points || [];
const threeLabels = threePoints.map(p => p.label).join(", ");

check(
  "3-curve: (0,0) is kept (common to all)",
  threePoints.some(p => Math.abs(p.x) < 0.05 && Math.abs(p.y) < 0.05),
  threeLabels,
);
check(
  "3-curve: (1,1) is kept under pairwise rule (on y=x^3 and y=x)",
  threePoints.some(p => Math.abs(p.x - 1) < 0.05 && Math.abs(p.y - 1) < 0.05),
  threeLabels,
);
check(
  "3-curve: (2,2) is dropped (only on y=x)",
  !threePoints.some(p => Math.abs(p.x - 2) < 0.05 && Math.abs(p.y - 2) < 0.05),
  threeLabels,
);
check(
  "3-curve: (-1,-1) is auto-added from y=x^3 ∩ y=x",
  threePoints.some(p => Math.abs(p.x + 1) < 0.05 && Math.abs(p.y + 1) < 0.05),
  threeLabels,
);
check(
  "3-curve: (1/3, 1/3) is auto-added from y=x ∩ y=2x-3x^2",
  threePoints.some(p => Math.abs(p.x - 1 / 3) < 0.05 && Math.abs(p.y - 1 / 3) < 0.05),
  threeLabels,
);
check(
  "3-curve: (~0.56, ~0.18) is auto-added from y=x^3 ∩ y=2x-3x^2",
  threePoints.some(p => Math.abs(p.x - 0.5616) < 0.05 && Math.abs(p.y - 0.177) < 0.1),
  threeLabels,
);

// --- Correct input: should pass through unchanged ---
const correctCase = validateIntersectionPoints({
  title: "Parabola and line",
  xRange: [-5, 5],
  yRange: [-5, 10],
  functions: [
    { latex: "x^2", label: "y = x^2" },
    { latex: "2x + 1", label: "y = 2x + 1" },
  ],
  points: [
    // x^2 = 2x+1 → x = 1 ± √2 → (2.414, 5.828) and (-0.414, 0.172)
    { x: 2.414, y: 5.828, label: "(2.41, 5.83)" },
    { x: -0.414, y: 0.172, label: "(-0.41, 0.17)" },
  ],
});
check(
  "correct case: both provided intersections are kept",
  (correctCase.points || []).length >= 2,
  `kept ${(correctCase.points || []).length}`,
);

// --- Pass-through when only one curve is plotted ---
const singleCurve = validateIntersectionPoints({
  title: "Parabola with vertex labeled",
  xRange: [-3, 3],
  yRange: [-2, 9],
  functions: [{ latex: "x^2", label: "y = x^2" }],
  points: [{ x: 0, y: 0, label: "Vertex (0, 0)" }],
});
check(
  "single-curve: point kept even if coord-style (no intersection intent)",
  (singleCurve.points || []).length === 1,
);

// --- Pass-through when word-labeled (non-coordinate) points ---
const wordLabeled = validateIntersectionPoints({
  title: "Two curves with vertex labeled",
  xRange: [-3, 3],
  yRange: [-3, 5],
  functions: [
    { latex: "x^2", label: "y = x^2" },
    { latex: "-x + 2", label: "y = -x + 2" },
  ],
  points: [
    { x: 0, y: 0, label: "Vertex" }, // Not coord-style; shouldn't trigger drop
  ],
});
check(
  "word-labeled point: not dropped",
  (wordLabeled.points || []).length === 1,
);

// --- Unparseable curve: bail out, keep everything ---
const unparseable = validateIntersectionPoints({
  title: "Implicit conic and line",
  xRange: [-3, 3],
  yRange: [-3, 3],
  functions: [
    { latex: "x^2 + y^2 = 1", label: "Unit circle" },
    { latex: "x", label: "y = x" },
  ],
  points: [{ x: 5, y: 5, label: "(5, 5)" }], // Definitely not on either, but we can't verify.
});
check(
  "unparseable curve: validator bails out and keeps the point",
  (unparseable.points || []).length === 1,
);

// --- Report ---
let failed = 0;
for (const r of results) {
  if (r.ok) {
    console.log(`  ✓ ${r.name}`);
  } else {
    failed++;
    console.log(`  ✗ ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
  }
}
console.log(`\n${results.length - failed}/${results.length} passed`);
if (failed > 0) process.exit(1);
