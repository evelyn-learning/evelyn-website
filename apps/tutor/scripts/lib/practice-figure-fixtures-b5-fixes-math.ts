/**
 * Batch-5 fixtures, part "fixes-math" (fixes a, d, j, k — and the new
 * solid_3d variant of fix j, the frustum of a pyramid) — see
 * practice-figure-fixtures-batch5.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

const conic = (params: Record<string, unknown>) => ({ type: 'conic_graph', params });
const solid = (params: Record<string, unknown>) => ({ type: 'solid_3d', params });

export const FIXTURES: FigureFixture[] = [
  // --- a: conic_graph — the centre (and any other one-letter mark) under another name ----------
  {
    id: 'fix5-a-conic-centre-named',
    note: 'a: the centre of a circle marked "O" (names.center) instead of "C", which is an option letter; a point "P" on the circle',
    question: 'The circle shown has centre O. Which of these is its equation?  A. (x − 2)² + (y + 1)² = 16   B. (x + 2)² + (y − 1)² = 16   C. (x − 2)² + (y + 1)² = 4   D. (x + 2)² + (y − 1)² = 4',
    alt: 'A circle on a coordinate grid with its centre marked O and a point P marked on it.',
    spec: conic({ xRange: [-4, 8], yRange: [-6, 4], conics: [{ type: 'circle', center: [2, -1], radius: 4, show: { center: 'mark' }, names: { center: 'O' } }], points: [{ x: 6, y: -1, label: 'P' }] }),
  },
  {
    id: 'fix5-a-conic-numerals',
    note: 'a: letterLabels "numerals" — the vertex V and the focus F of a parabola, and a point A on it, are printed 1, 2, 3; the directrix is dashed',
    question: 'On the parabola shown, which numbered point is the focus?  A. point 1   B. point 2   C. point 3   D. none of them',
    alt: 'A parabola opening upward on a coordinate grid with three numbered points — two on its axis of symmetry and one on the curve — and a dashed horizontal line below it.',
    spec: conic({ xRange: [-6, 6], yRange: [-3, 7], letterLabels: 'numerals', conics: [{ type: 'parabola', vertex: [0, 0], p: 2, axis: 'y', show: { vertex: 'mark', focus: 'mark', directrix: 'mark' } }], points: [{ x: 4, y: 2, label: 'A' }] }),
  },
  {
    id: 'fix5-a-conic-foci-named-roman',
    note: 'a: an ellipse whose foci are named P and Q (names.foci) and whose centre is the Roman numeral I (letterLabels "roman" renames the one-letter marks C, P, Q → I, II, III)',
    question: 'The ellipse shown has its foci at the points marked II and III. What is the distance between them?',
    alt: 'An ellipse wider than it is tall on a coordinate grid, with three points on its long axis marked with Roman numerals: its centre and one on each side.',
    spec: conic({ xRange: [-6, 6], yRange: [-4, 4], letterLabels: 'roman', conics: [{ type: 'ellipse', center: [0, 0], rx: 5, ry: 3, show: { center: 'mark', foci: 'mark' }, names: { foci: ['P', 'Q'] } }] }),
  },
  // --- d: distribution_curve — a bound between two ticks is not printed unless asked ------------
  {
    id: 'fix5-d-bound-hidden-by-default',
    note: 'd: the shaded bound (z = 1.25) falls between two ticks and is what the question asks for — by default nothing is printed under it',
    question: 'The shaded region under the standard normal curve has area 0.1056. What is the z-score at its left edge?',
    alt: 'A standard normal curve with ticks from −3 to 3. The right tail is shaded from a bound between 1 and 2.',
    spec: { type: 'distribution_curve', params: { axis: 'z', shade: [{ from: 1.25, to: null }], xLabel: 'z' } },
  },
  {
    id: 'fix5-d-bound-blank',
    note: 'd: boundLabels "blank" — a "?" box under the bound that is asked for (x between 100 and 115)',
    question: 'IQ scores are normally distributed with mean 100 and standard deviation 15. The shaded region holds 20% of scores. What is the score marked "?"?',
    alt: 'A normal curve with ticks from 55 to 145. The left part is shaded up to a bound between 85 and 100, marked with a boxed question mark.',
    spec: { type: 'distribution_curve', params: { mean: 100, sd: 15, shade: [{ from: null, to: 87.4 }], boundLabels: 'blank', xLabel: 'IQ score' } },
  },
  {
    id: 'fix5-d-bound-value',
    note: 'd: boundLabels "value" — the two bounds between ticks are GIVEN (the area is asked): printed under the axis as before this round',
    question: 'Heights are normally distributed with mean 170 cm and standard deviation 8 cm. What proportion of heights lie in the shaded region?',
    alt: 'A normal curve with ticks from 146 to 194. The region between two labelled bounds, one on each side of the centre, is shaded.',
    spec: { type: 'distribution_curve', params: { mean: 170, sd: 8, shade: [{ from: 166, to: 182 }], boundLabels: 'value', xLabel: 'Height (cm)' } },
  },
  // --- j: solid_3d — the frustum of a pyramid -----------------------------------------------
  {
    id: 'solid-frustum-simple',
    note: 'simple: a square frustum — both sides and the height printed',
    question: 'What is the volume of the frustum of a square pyramid shown?',
    alt: 'A frustum of a square pyramid: a large square base, a smaller square top and four sloping faces, with the side of each square and the height labelled.',
    spec: solid({ solid: 'pyramid_frustum', base: 6, topBase: 3, height: 4, unit: 'cm' }),
  },
  {
    id: 'solid-frustum-dense-rectangular',
    note: 'dense: rectangular faces — base, depth, both top sides, the height and the slant height of the front face all printed; not to scale',
    question: 'What is the total surface area of the frustum shown?',
    alt: 'A frustum of a rectangular pyramid with every edge length of its two faces, its height and the slant height of its front face labelled. It carries the note "not to scale".',
    spec: solid({ solid: 'pyramid_frustum', base: 12, width: 8, topBase: 6, height: 4, unit: 'cm', labels: { slant: 'auto', topWidth: 'auto' }, notToScale: true }),
  },
  {
    id: 'solid-frustum-blank-height',
    note: 'a "?" on the height; both sides and the slant height printed (the height follows from them)',
    question: 'What is the height marked "?" of the frustum of a square pyramid shown?',
    alt: 'A frustum of a square pyramid with the sides of its two square faces and its slant height labelled. Its height is marked with a boxed question mark.',
    spec: solid({ solid: 'pyramid_frustum', base: 16, topBase: 4, height: 8, unit: 'm', labels: { height: '?', slant: 'auto' } }),
  },
  {
    id: 'fix5-j-pyramid-frustum-few-edges',
    note: 'j: the frustum of a pyramid with hiddenEdges "few" (no dashed far edges), the top side named x',
    question: 'The frustum shown has volume 84 cm³. What is x?',
    alt: 'A frustum of a square pyramid with the side of its base and its height labelled; the side of its top face is labelled x.',
    spec: solid({ solid: 'pyramid_frustum', base: 6, topBase: 3, height: 4, unit: 'cm', hiddenEdges: 'few', labels: { topBase: 'x' } }),
  },
  // --- k: slope_match_equation reads products written without a sign --------------------------
  {
    id: 'fix5-k-slope-field-implicit-products',
    note: 'k: the field of dy/dx = 2xy — the options of the item are worded "2xy", "x²y", "y(1 − y)", "x + 2y" (no multiplication signs)',
    question: 'Which differential equation has the slope field shown?  A. dy/dx = 2xy   B. dy/dx = x²y   C. dy/dx = y(1 − y)   D. dy/dx = x + 2y',
    alt: 'A slope field on a grid from −2 to 2 in both directions: short segments that are flat along both axes and steepen away from them, rising in the first and third quadrants and falling in the second and fourth.',
    spec: { type: 'slope_field', params: { expr: '2*x*y', xRange: [-2, 2], yRange: [-2, 2], xStep: 1, yStep: 1, gridStep: 0.5 } },
  },
];
