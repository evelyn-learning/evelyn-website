/**
 * Geometry — Unit 3 CED 3.2: Proving Lines Parallel.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.proving-lines-parallel.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U3_PROVING_LINES_PARALLEL: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.proving-lines-parallel.v1',
  course: 'Geometry',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Proving Lines Parallel',
  planId: 'evelyn.hs.geom.proving-lines-parallel.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.proving-lines-parallel.v1' }],
  theory: [
    { loId: 'geom.proving-lines-parallel', kind: 'framework', title: 'The converse flips the arrow', content: `THE CONVERSE FLIPS THE ARROW — last lesson every theorem read "if the lines are parallel, then the angles do X". Proving lines parallel uses the CONVERSE: "if the angles do X, then the lines are parallel". Given and conclusion trade places, so the given is now an angle fact and the conclusion is ∥.` },
    { loId: 'geom.proving-lines-parallel', kind: 'framework', title: 'The four converses', content: `THE FOUR CONVERSES — if a pair of CORRESPONDING angles is congruent, the lines are parallel (this converse is the postulate the other three lean on). Same conclusion if a pair of ALTERNATE INTERIOR angles is congruent, if a pair of ALTERNATE EXTERIOR angles is congruent, or if a pair of SAME-SIDE INTERIOR angles is SUPPLEMENTARY.` },
    { loId: 'geom.proving-lines-parallel', kind: 'framework', title: 'One angle at each crossing', content: `ONE ANGLE AT EACH CROSSING — a pair can only certify parallelism if one angle sits at the crossing with the first line and the other at the crossing with the second line. ERROR 1: offering a pair that lives entirely at ONE crossing — vertical angles congruent, or a linear pair summing to 180° — as proof. Those are true at every crossing in the plane, parallel or not, so they carry zero information about the other line.` },
    { loId: 'geom.proving-lines-parallel', kind: 'framework', title: 'Name the transversal first', content: `NAME THE TRANSVERSAL FIRST — in a figure with three or more lines, the transversal is the line that contains BOTH angle vertices; the two lines you are proving parallel are the other two. Reading the roles backwards proves the wrong pair parallel, so label the roles before quoting any theorem.` },
    { loId: 'geom.proving-lines-parallel', kind: 'framework', title: 'Supplementary is not congruent', content: `SUPPLEMENTARY IS NOT CONGRUENT — three converses want the angles EQUAL; the same-side interior converse wants them to ADD to 180°. When you are solving for the value of x that forces parallel, this choice sets up the entire equation: set the expressions equal, or set their sum to 180. Classify the pair first, write the equation second.` },
    { loId: 'geom.proving-lines-parallel', kind: 'framework', title: 'Two more routes to parallel', content: `TWO MORE ROUTES TO PARALLEL — the perpendicular-transversal converse: if two coplanar lines are each ⊥ to the same line, they are parallel (this is why square-cut studs off one plate come out parallel). And transitivity: if a ∥ b and b ∥ c, then a ∥ c.` },
    { loId: 'geom.proving-lines-parallel', kind: 'framework', title: 'Never assume what you are proving', content: `NEVER ASSUME WHAT YOU ARE PROVING — ERROR 2: writing "since a ∥ b, corresponding angles are congruent" inside a proof whose CONCLUSION is a ∥ b. That is circular. Until the last line, a ∥ b is not available as a reason. Neither is "it looks parallel" — a drawing is never a reason.` },
    { loId: 'geom.proving-lines-parallel', kind: 'framework', title: 'The closing move', content: `THE CLOSING MOVE — real problems chain: use vertical angles or a linear pair at one crossing to migrate a known measure into the position you need, and only THEN name a converse to close. Reasons run "vertical angles", "linear pair", …, and the final reason is the converse that delivers ∥.` },
    { loId: 'geom.proving-lines-parallel', kind: 'definition', title: 'converse', content: `the statement you get by swapping a conditional's hypothesis and conclusion — "if parallel, then congruent" becomes "if congruent, then parallel". A converse has to be proved on its own; it does not come free with the original.` },
    { loId: 'geom.proving-lines-parallel', kind: 'definition', title: 'perpendicular transversal converse', content: `if two coplanar lines are each ⊥ to the same line, then the two lines are parallel.` },
  ],
  methods: [
    {
      title: 'Worked certify parallel',
      steps: [
        `Sort interior from exterior: the strip BETWEEN p and q is the interior region. The 62° angle sits above p, so it is exterior; the 118° angle sits above q and therefore between the lines, so it is interior. Mixed positions — not yet a named pair.`,
        `Migrate the 62° angle inside. At the crossing with p, its vertical angle sits below p and to the left of t and also measures 62° (Vertical Angles Theorem). That copy is interior and on the LEFT of t.`,
        `Now compare like with like: interior at p, left of t = 62°; interior at q, left of t = 118°. Both interior, both on the same side of t → a same-side interior pair.`,
        `Test the pair: 62 + 118 = 180, so the pair is supplementary. By the Converse of the Same-Side Interior Angles Theorem, p ∥ q.`,
        `Sense-check the finished picture: only two angle sizes appear, 62° and 118°, four of each, and they sum to 180°. ✓`,
      ],
      example: { problem: `Lines p and q are cut by transversal t, with p the upper line and q the lower line. At the crossing with p, the angle above p and to the right of t measures 62°. At the crossing with q, the angle above q and to the left of t measures 118°. Are p and q parallel? Name the reason for every step.`, solution: `Yes — p ∥ q by the Converse of the Same-Side Interior Angles Theorem, after using vertical angles to move the 62° measure into the interior.` },
      relatedLoIds: ['geom.proving-lines-parallel'],
    },
    {
      title: 'Worked one crossing trap',
      steps: [
        `Locate both angles before judging the claim: both of them sit at the SAME crossing — the one with g. Neither angle touches h at all.`,
        `Identify what the pair really is: two angles that share a side and open into a straight line are a LINEAR PAIR, and a linear pair is supplementary at every crossing in the plane, parallel lines or not. A fact that is always true cannot distinguish parallel from not-parallel, so it proves nothing about h.`,
        `State the requirement the converse actually has: a same-side interior pair needs ONE angle at the crossing with g and ONE at the crossing with h, both between the lines, both on the same side of t.`,
        `Build a given that works: if the interior angle at g on the right of t measures 105° and the interior angle at h on the right of t measures 75°, then that pair is same-side interior and 105 + 75 = 180, so g ∥ h by the Converse of the Same-Side Interior Angles Theorem.`,
        `General rule to carry away: before quoting any converse, check that your two angles have DIFFERENT vertices, one on each line being tested.`,
      ],
      example: { problem: `Lines g and h are cut by transversal t. At the crossing of t with g, two angles form a linear pair: one measures 105° and the other measures 75°. A student writes: "These two angles are supplementary, so by the Converse of the Same-Side Interior Angles Theorem, g ∥ h." Explain the error, and state a given that would actually prove g ∥ h.`, solution: `The two angles form a linear pair at a single crossing, so they are supplementary no matter what h does — the converse needs one angle at each crossing, such as a 105° interior angle at g and a 75° interior angle at h on the same side of t.` },
      relatedLoIds: ['geom.proving-lines-parallel'],
    },
  ],
  pointers: [
    { content: `Run the argument in the legal direction. The congruence ∠1 ≅ ∠2 has to arrive as a GIVEN (or be derived from givens using always-true facts like vertical angles and linear pairs); then the Converse of the Corresponding Angles Postulate delivers a ∥ b as the final line. Until that final line, a ∥ b may not appear as a reason.`, kind: 'common-error' },
    { content: `A drawing is never a reason, and "never meet" cannot be checked by inspection. Measure one angle at each crossing and let a converse do the certifying: congruent corresponding, alternate interior, or alternate exterior angles, or supplementary same-side interior angles.`, kind: 'common-error' },
    { content: `Proving parallel runs the converse: start from an angle fact and conclude ∥, instead of starting from ∥.`, kind: 'tip' },
    { content: `Congruent corresponding, alternate interior, or alternate exterior angles → parallel. Supplementary same-side interior angles → parallel. Add for the same-side pair; set equal for the other three.`, kind: 'tip' },
    { content: `The pair must have one angle at EACH crossing. Vertical angles and linear pairs live at a single crossing and are always true, so they never prove parallel on their own.`, kind: 'tip' },
    { content: `The transversal is the line holding both angle vertices; the other two lines are the ones being proved parallel.`, kind: 'tip' },
    { content: `Two lines ⊥ to the same line are parallel, and two lines parallel to the same line are parallel to each other.`, kind: 'tip' },
    { content: `Never use the conclusion as a reason, and never use the picture as a reason — chain always-true facts first, then close with one converse.`, kind: 'tip' },
    { content: `Before quoting any converse, check that your two angles have **different vertices** — one on each line you're testing. Vertical angles and linear pairs both live at a single crossing and are true whether or not the lines are parallel, so they certify nothing.`, kind: 'common-error' },
    { content: `Say "Converse of the Alternate Interior Angles Theorem" — not just "Alternate Interior Angles Theorem." Dropping the word *converse* names the theorem that runs the wrong direction (parallel → angles) and is illegal as a reason when ∥ is your conclusion.`, kind: 'vocab-note' },
    { content: `Same-side interior is the only converse that wants a **sum of 180**; corresponding, alternate interior, and alternate exterior all want **congruence**. Classify the pair first, THEN write \`expr = expr\` or \`expr + expr = 180\`.`, kind: 'gotcha' },
    { content: `Never write "since a ∥ b …" anywhere inside a proof whose conclusion is a ∥ b — that's circular. Until the final line, a ∥ b is not available as a reason, and neither is "it looks parallel in the figure."`, kind: 'common-error' },
    { content: `In a figure with three or more lines, find the transversal first: it's the line containing **both** angle vertices. The other two lines are the ones you're proving parallel. Read the roles backwards and you prove the wrong pair parallel.`, kind: 'tip' },
    { content: `If the given angles are mixed (one interior, one exterior, or on opposite sides), you don't have a named pair yet. Use vertical angles or a linear pair at one crossing to migrate a measure into position, then close with a converse.`, kind: 'edge-case' },
    { content: `"Both lines perpendicular to the same line" gives parallel only if the lines are **coplanar** — in 3-D two lines ⊥ to the same line can be skew. Also remember transitivity: a ∥ b and b ∥ c ⇒ a ∥ c.`, kind: 'edge-case' },
    { content: `After solving for x, plug it back in: a correct answer makes the two expressions equal (or sum to 180) and leaves only two angle sizes in the whole figure, four of each, adding to 180°. Quick sanity check on any answer.`, kind: 'tip' },
  ],
};
