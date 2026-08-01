/**
 * Geometry — Unit 1 CED 1.1: Points, Lines & Planes.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.points-lines-planes.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U1_POINTS_LINES_PLANES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.points-lines-planes.v1',
  course: 'Geometry',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Points, Lines & Planes',
  planId: 'evelyn.hs.geom.points-lines-planes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.points-lines-planes.v1' }],
  theory: [
    { loId: 'geom.points-lines-planes', kind: 'framework', title: 'The three undefined terms', content: `THE THREE UNDEFINED TERMS — point, line, and plane are described, never defined. A point has position but no size. A line is straight, has no thickness, and goes on forever in both directions. A plane is a flat surface with no thickness that extends forever in every direction. Space is the set of all points.` },
    { loId: 'geom.points-lines-planes', kind: 'framework', title: 'How to name things', content: `HOW TO NAME THINGS — a point takes one capital letter (point A). A line takes any TWO of its points (line AB) or a single lowercase letter (line m). A plane takes three of its non-collinear points (plane ABC) or a single capital script letter (plane M).` },
    { loId: 'geom.points-lines-planes', content: `SEGMENT vs RAY vs LINE — segment AB is the finite piece with endpoints A and B. Ray AB starts AT A and passes through B, continuing forever past B. Line AB runs forever in both directions. ORDER MATTERS FOR RAYS ONLY: ray AB and ray BA are different rays (different starting points), while segment AB = segment BA and line AB = line BA.` },
    { loId: 'geom.points-lines-planes', content: `COLLINEAR vs COPLANAR — collinear points lie on ONE line; coplanar points lie on ONE plane. Any two points are automatically collinear and any three points are automatically coplanar, so the words only carry information for three-or-more and four-or-more points. Students swap these two constantly — collinear is the stricter condition, and collinear points are always coplanar too.` },
    { loId: 'geom.points-lines-planes', kind: 'framework', title: 'The determining postulates', content: `THE DETERMINING POSTULATES — two distinct points determine exactly one line. THREE NON-COLLINEAR points determine exactly one plane. Drop the words "non-collinear" and the statement is false: three points on the same line sit on infinitely many planes, the way a door swings on its hinge line. A line plus a point NOT on that line also determines exactly one plane, and so do two intersecting lines.` },
    { loId: 'geom.points-lines-planes', kind: 'framework', title: 'How figures intersect', content: `HOW FIGURES INTERSECT — two distinct lines intersect in at most ONE point. Two distinct planes that intersect meet in a LINE, never a single point (picture two walls meeting at a corner edge). A line not lying inside a plane pierces it in at most one point. If a line contains two points of a plane, the whole line lies in that plane.` },
    { loId: 'geom.points-lines-planes', kind: 'framework', title: 'Skew lines', content: `SKEW LINES — the 3-D trap. Parallel lines are coplanar AND never meet. Skew lines never meet and are NOT coplanar. So "these lines never intersect" does NOT prove they are parallel — you must also show they lie in the same plane. In a room, the front-top edge of the ceiling and a vertical corner edge on the far wall never touch and are not coplanar: skew.` },
    { loId: 'geom.points-lines-planes', kind: 'definition', title: 'collinear', content: `lying on the same line; coplanar means lying on the same plane, which is a weaker requirement.` },
    { loId: 'geom.points-lines-planes', kind: 'definition', title: 'skew lines', content: `two lines that do not intersect and do not lie in any single plane together — so they are not parallel.` },
  ],
  methods: [
    {
      title: 'Worked plane intersection',
      steps: [
        `List the labeled points of each plane: plane ABFE contains A, B, F, E; plane BCGF contains B, C, G, F.`,
        `Find the points that appear in BOTH lists: B and F. (The box has a vertical edge running from B down to F.)`,
        `Two distinct points determine exactly one line, so B and F pin down line BF — and every point of line BF lies in both planes.`,
        `Apply the intersection postulate: two distinct planes that meet, meet in a LINE, not a point. Here that line is line BF, the vertical edge where the front and right faces come together.`,
      ],
      example: { problem: `A cardboard box has a top face ABCD sitting directly above a bottom face EFGH, with A above E, B above F, C above G, and D above H. The front face is the flat region ABFE and the right face is the flat region BCGF. What is the intersection of plane ABFE and plane BCGF?`, solution: 'Line BF — the shared vertical edge of the two faces.' },
      relatedLoIds: ['geom.points-lines-planes'],
    },
    {
      title: 'Worked skew vs parallel',
      steps: [
        `Check the intersection claim first: AD is an edge of the top face, BF is the vertical edge dropping from B to F. They share no point, so the classmate is right that the lines never meet.`,
        `But parallel needs TWO conditions: never meeting AND lying in one common plane. Test the second one.`,
        `A, B, and D are non-collinear points of the top face, so they determine exactly ONE plane — the plane of the top face ABCD.`,
        `Is F in that plane? No: F sits directly below B, off the top face. So no single plane contains A, D, B, and F.`,
        `The lines never meet and are not coplanar, so line AD and line BF are SKEW, not parallel. "They never intersect" alone is never enough.`,
      ],
      example: { problem: `Using the same box (top face ABCD above bottom face EFGH, with A above E, B above F, C above G, D above H), a classmate says: "Line AD and line BF never touch each other, so line AD ∥ line BF." Is the classmate right?`, solution: `No — the lines are skew, because they are not coplanar. Parallel requires coplanar AND non-intersecting.` },
      relatedLoIds: ['geom.points-lines-planes'],
    },
  ],
  pointers: [
    { content: `Only NON-COLLINEAR points determine exactly one plane. Collinear points R, S, T lie on infinitely many planes — a plane can rotate around line RS like a door on its hinge. To pin down one plane you need a fourth point that is off the line.`, kind: 'common-error' },
    { content: `Collinear points are always coplanar — the problem is that there are infinitely many such planes, not zero. Collinear is the stricter condition; it implies coplanar.`, kind: 'common-error' },
    { content: `Point, line, and plane are undefined terms; name a line by any two of its points and a plane by three non-collinear points.`, kind: 'tip' },
    { content: `Two points determine one line; three NON-COLLINEAR points determine one plane. The words "non-collinear" are not decoration.`, kind: 'tip' },
    { content: `Two distinct lines meet in at most one point; two distinct planes that meet, meet in a whole line.`, kind: 'tip' },
    { content: `Never intersecting is not the same as parallel — parallel also requires coplanar, and non-coplanar non-intersecting lines are skew.`, kind: 'tip' },
    { content: `Ray AB and ray BA are different rays; segment AB and line AB do not care about letter order.`, kind: 'tip' },
    { content: `Ray notation: $\\overrightarrow{AB}$ starts at $A$; the arrow in the symbol always points right regardless of letter order. $\\overrightarrow{AB} \\ne \\overrightarrow{BA}$, but $\\overline{AB} = \\overline{BA}$ and $\\overleftrightarrow{AB} = \\overleftrightarrow{BA}$.`, kind: 'vocab-note' },
    { content: `"Never intersect" does NOT mean parallel. Before you write $\\parallel$, prove the two lines lie in one common plane. Non-intersecting + non-coplanar = **skew**.`, kind: 'common-error' },
    { content: `Don't drop "non-collinear" from the plane postulate. Three points ON a line lie in infinitely many planes (door swinging on hinges) — not zero, and not one. Collinear points are still coplanar.`, kind: 'gotcha' },
    { content: `Collinear is stricter than coplanar: collinear ⇒ coplanar, never the reverse. Also, any 2 points are automatically collinear and any 3 are automatically coplanar — so those words only say something for 3+ or 4+ points.`, kind: 'vocab-note' },
    { content: `Two distinct planes that meet share a **line**, never a single point. If a question's answer choices include 'exactly one point' for two planes, it's a trap.`, kind: 'common-error' },
    { content: `To find where two faces of a solid meet, list each plane's labeled points and take the shared ones — two shared points name the edge line (e.g. $B$, $F$ → line $BF$). One shared point means they meet along a line you must extend, not just at a corner.`, kind: 'tip' },
    { content: `Naming a plane needs three points that are non-collinear AND actually in that plane — 'plane $ABE$' is meaningless if $E$ is off the face. Check membership before you name.`, kind: 'edge-case' },
    { content: `A line can meet a plane in 0 points (parallel), 1 point (piercing), or infinitely many — if it shares **two** points with the plane, the entire line lies inside it. Don't assume 'at most one point' always.`, kind: 'edge-case' },
  ],
};
