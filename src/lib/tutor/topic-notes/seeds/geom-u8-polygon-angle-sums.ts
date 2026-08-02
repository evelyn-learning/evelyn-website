/**
 * Geometry — Unit 8 CED 8.1: Polygon Interior & Exterior Angle Sums.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.polygon-angle-sums.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U8_POLYGON_ANGLE_SUMS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.polygon-angle-sums.v1',
  course: 'Geometry',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Polygon Interior & Exterior Angle Sums',
  planId: 'evelyn.hs.geom.polygon-angle-sums.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.polygon-angle-sums.v1' }],
  theory: [
    { loId: 'geom.polygon-angle-sums', kind: 'framework', title: 'Triangulate to derive', content: `TRIANGULATE TO DERIVE — pick one vertex of a convex n-gon and draw every diagonal from it. The polygon splits into exactly n - 2 triangles, each contributing 180°. So the interior angle sum is (n - 2) × 180°. A quadrilateral gives 2 triangles → 360°; a pentagon gives 3 → 540°; a hexagon gives 4 → 720°.` },
    { loId: 'geom.polygon-angle-sums', content: `CLASSIC ERROR 1: LOSING THE -2 — writing n × 180° instead of (n - 2) × 180°. Sanity check every answer against a shape you know: if your formula says a quadrilateral totals 720°, it is wrong, because two triangles taped together clearly total 360°.` },
    { loId: 'geom.polygon-angle-sums', content: `ONE ANGLE OF A REGULAR n-GON — regular means all sides equal AND all angles equal, so each interior angle = (n - 2) × 180° / n. Regular octagon: (6 × 180°) / 8 = 1080° / 8 = 135°.` },
    { loId: 'geom.polygon-angle-sums', content: `CLASSIC ERROR 2: DIVIDING WHEN IT IS NOT REGULAR — the SUM formula works for every convex polygon, but dividing that sum by n only gives one angle when the polygon is regular. On an irregular polygon the sum is still (n - 2) × 180°, and you find a missing angle by subtracting the known ones.` },
    { loId: 'geom.polygon-angle-sums', content: `EXTERIOR ANGLES ALWAYS SUM TO 360° — extend each side in the same rotational direction and take one exterior angle per vertex. Walk the whole boundary and you turn through the exterior angles until you face your original direction: one full turn, 360°, no matter whether the polygon has 5 sides or 500.` },
    { loId: 'geom.polygon-angle-sums', content: `ONE EXTERIOR ANGLE OF A REGULAR n-GON — 360° / n. Regular octagon: 360° / 8 = 45°.` },
    { loId: 'geom.polygon-angle-sums', kind: 'framework', title: 'The supplement link', content: `THE SUPPLEMENT LINK — at any vertex the interior angle and its exterior angle form a straight line, so they sum to 180°. That link is the fastest bridge between the two formulas: interior 135° ↔ exterior 45°.` },
    { loId: 'geom.polygon-angle-sums', content: `WORKING BACKWARD TO n — given an angle, go through the EXTERIOR angle. If each interior angle is 150°, the exterior is 180° - 150° = 30°, so n = 360° / 30° = 12. Solving (n - 2) × 180° / n = 150 gives the same 12, just with more algebra.` },
    { loId: 'geom.polygon-angle-sums', kind: 'definition', title: 'regular polygon', content: `a polygon whose sides are all congruent and whose angles are all congruent — both conditions, not just one.` },
    { loId: 'geom.polygon-angle-sums', kind: 'definition', title: 'exterior angle of a polygon', content: `the angle between one side and the extension of an adjacent side; it is supplementary to the interior angle at that vertex.` },
  ],
  methods: [
    {
      title: 'Worked regular octagon',
      steps: [
        'Count the sides: an octagon has n = 8.',
        'Interior sum = (n - 2) × 180° = (8 - 2) × 180° = 6 × 180° = 1080°.',
        `The sign is REGULAR, so all 8 interior angles are equal: each = 1080° / 8 = 135°.`,
        `Each exterior angle is the supplement of its interior angle: 180° - 135° = 45°. (Shortcut: 360° / 8 = 45°.)`,
        `Check: 8 exterior angles × 45° = 360°. ✓ The exterior angles of any convex polygon must total 360°.`,
      ],
      example: { problem: `A stop sign is a regular octagon. Find (a) the sum of its interior angles, (b) the measure of each interior angle, and (c) the measure of each exterior angle.`, solution: 'Interior sum = 1080°; each interior angle = 135°; each exterior angle = 45°.' },
      relatedLoIds: ['geom.polygon-angle-sums'],
    },
    {
      title: 'Worked backward to n',
      steps: [
        `Name the error: (n - 2) × 180° is the SUM of all the interior angles, not one of them. Setting the whole sum equal to a single 150° angle can only produce nonsense.`,
        `Fast route — use the exterior angle. Interior and exterior are supplementary at each vertex: exterior = 180° - 150° = 30°.`,
        `The exterior angles total 360° and the polygon is regular, so all n of them are equal: n = 360° / 30° = 12. The polygon is a regular 12-gon (dodecagon).`,
        `Confirm with the interior formula written correctly, one angle at a time: (n - 2) × 180° / n = 150 → 180n - 360 = 150n → 30n = 360 → n = 12. ✓ Same answer, more algebra.`,
      ],
      example: { problem: `Each interior angle of a regular polygon measures 150°. A classmate writes (n - 2) × 180° = 150 and gets a fraction for n. Find the number of sides and explain the error.`, solution: `12 sides — the classmate set the interior SUM equal to a single interior angle instead of dividing the sum by n.` },
      relatedLoIds: ['geom.polygon-angle-sums'],
    },
  ],
  pointers: [
    { content: `The SUM of 720° is true for every convex hexagon, but dividing by 6 assumes all six angles are equal — that is the definition of regular. An irregular hexagon could have angles of 90°, 100°, 110°, 130°, 140°, and 150°, which still total 720°. Without the word "regular" (or given congruent angle marks), find a missing angle by subtracting the known angles from 720°.`, kind: 'common-error' },
    { content: `Interior angle sum of a convex n-gon = (n - 2) × 180° — the -2 comes from triangulating into n - 2 triangles.`, kind: 'tip' },
    { content: `Exterior angles (one per vertex) always sum to 360°, for every convex polygon, no matter how many sides.`, kind: 'tip' },
    { content: `REGULAR only: each interior angle = (n - 2) × 180° / n, and each exterior angle = 360° / n.`, kind: 'tip' },
    { content: `Interior and exterior angles at a vertex are supplementary (180°) — use that link to work backward from any angle to n via 360° / exterior.`, kind: 'tip' },
    { content: `Never set $(n-2)\\times 180^\\circ$ equal to ONE angle. That expression is the SUM of all interior angles. If you're given a single angle of a regular polygon, either divide the sum by $n$ first or (faster) go through the exterior angle.`, kind: 'common-error' },
    { content: `Only divide the interior sum by $n$ when the problem says **regular** (or shows congruent angle marks). For an irregular polygon, find a missing angle by subtracting the known angles from $(n-2)\\times 180^\\circ$.`, kind: 'gotcha' },
    { content: `"Regular" means equal sides AND equal angles — both. A rectangle has all angles $90^\\circ$ but isn't regular; a rhombus has all sides equal but isn't regular. Don't infer equal angles from "equilateral" alone.`, kind: 'vocab-note' },
    { content: `Sanity-check the $-2$ against a shape you know: a quadrilateral must total $360^\\circ$, not $720^\\circ$. If your answer for 4 sides isn't $360^\\circ$, you dropped the $-2$.`, kind: 'tip' },
    { content: `$360^\\circ$ is the exterior SUM, not one exterior angle. $360^\\circ/n$ is one exterior angle, and only for a regular polygon. A 20-gon's exterior angles still total $360^\\circ$ — more sides never means a bigger total.`, kind: 'common-error' },
    { content: `Take exactly ONE exterior angle per vertex, all extended in the same rotational direction. Each vertex has two vertical exterior angles; counting both doubles your total to $720^\\circ$.`, kind: 'edge-case' },
    { content: `Working backward to $n$: convert the interior angle to its exterior angle first ($180^\\circ - $ interior), then $n = 360^\\circ \\div$ exterior. Far fewer algebra steps than solving $(n-2)\\times 180^\\circ / n = $ interior.`, kind: 'tip' },
    { content: `If solving for $n$ gives a non-integer (or $n < 3$), the angle is impossible for a polygon — recheck your setup rather than rounding. And note $n$ must be a whole number $\\geq 3$.`, kind: 'edge-case' },
  ],
};
