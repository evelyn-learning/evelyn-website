/**
 * Geometry — Unit 6 CED 6.4: Side-Splitter & Proportionality Theorems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.proportionality-theorems.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U6_PROPORTIONALITY_THEOREMS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.proportionality-theorems.v1',
  course: 'Geometry',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Side-Splitter & Proportionality Theorems',
  planId: 'evelyn.hs.geom.proportionality-theorems.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.proportionality-theorems.v1' }],
  theory: [
    { loId: 'geom.proportionality-theorems', kind: 'framework', title: 'The side-splitter theorem', content: `THE SIDE-SPLITTER THEOREM — in △ABC, if D is on AB and E is on AC with DE ∥ BC, then AD/DB = AE/EC. The reason is similarity: DE ∥ BC makes ∠ADE ≅ ∠ABC and ∠AED ≅ ∠ACB (corresponding angles), so △ADE ~ △ABC by AA. A parallel cut clones the triangle.` },
    { loId: 'geom.proportionality-theorems', kind: 'framework', title: 'Part to part, or part to whole', content: `PART TO PART, OR PART TO WHOLE — BOTH AD/DB = AE/EC (piece to piece) and AD/AB = AE/AC (piece to whole side) are true. What is NOT allowed is mixing them: AD/DB = AE/AC is false. Choose one style and use it on both sides of the equals sign.` },
    { loId: 'geom.proportionality-theorems', kind: 'framework', title: 'The parallel segment is different', content: `THE PARALLEL SEGMENT IS DIFFERENT — DE is a side of the small triangle, so it only ever compares to a WHOLE side: DE/BC = AD/AB. Writing DE/BC = AD/DB is the single most common wrong setup when the question asks for the length of the cut.` },
    { loId: 'geom.proportionality-theorems', kind: 'framework', title: 'The converse', content: `THE CONVERSE — if AD/DB = AE/EC, then DE ∥ BC. This runs the theorem backwards: equal piece ratios prove two lines parallel using lengths alone, with no angle measured.` },
    { loId: 'geom.proportionality-theorems', kind: 'framework', title: 'Three parallel lines', content: `THREE PARALLEL LINES — if three parallel lines cross two transversals, they cut proportional pieces on both. With the parallels meeting one transversal at A, B, C and the other at X, Y, Z (in that order), AB/BC = XY/YZ. Equal spacing on one transversal forces equal spacing on the other — that is the carpenter's board trick.` },
    { loId: 'geom.proportionality-theorems', kind: 'framework', title: 'Triangle angle-bisector theorem', content: `TRIANGLE ANGLE-BISECTOR THEOREM — in △ABC, if AD bisects ∠A with D on BC, then BD/DC = AB/AC. The bisector splits the opposite side in the ratio of the two sides that FORM the angle. Match by shared vertex: piece BD touches B, so it pairs with side AB, which also touches B. Crossing them (BD/DC = AC/AB) is the classic slip.` },
    { loId: 'geom.proportionality-theorems', kind: 'framework', title: 'Midsegment is a special case', content: `MIDSEGMENT IS A SPECIAL CASE — when D and E are midpoints, AD/DB = AE/EC = 1, so by the converse DE ∥ BC, and the whole-side ratio AD/AB = 1/2 gives DE = BC/2. The midsegment theorem falls straight out of side-splitter.` },
    { loId: 'geom.proportionality-theorems', kind: 'framework', title: 'Check the hypothesis first', content: `CHECK THE HYPOTHESIS FIRST — none of these fire without their condition. A segment that merely looks parallel proves nothing; the problem must state DE ∥ BC, or you must establish it with the converse, before any proportion is written.` },
    { loId: 'geom.proportionality-theorems', kind: 'definition', title: 'side-splitter theorem', content: `a line parallel to one side of a triangle divides the other two sides into proportional pieces.` },
    { loId: 'geom.proportionality-theorems', kind: 'definition', title: 'angle bisector', content: `a ray that cuts an angle into two congruent angles; drawn from a triangle's vertex, it divides the opposite side in the ratio of the two sides forming that angle.` },
  ],
  methods: [
    {
      title: 'Worked side splitter',
      steps: [
        `Check the hypothesis before anything else: DE ∥ BC is given, D is on AB, E is on AC — the side-splitter theorem applies.`,
        `Choose a ratio style and stay in it. Piece to piece: AD/DB = AE/EC, with the top pieces (AD and AE) both the ones touching vertex A.`,
        'Substitute the known lengths: 6/4 = 9/EC.',
        'Cross-multiply: 6 · EC = 4 · 9 = 36, so EC = 6.',
        `Sense-check the two ratios: AD/DB = 6/4 = 1.5 and AE/EC = 9/6 = 1.5. They match. ✓`,
      ],
      example: { problem: `In △ABC, point D lies on side AB and point E lies on side AC, with DE ∥ BC. AD = 6, DB = 4, and AE = 9. Find EC.`, solution: 'EC = 6' },
      relatedLoIds: ['geom.proportionality-theorems'],
    },
    {
      title: 'Worked parallel segment trap',
      steps: [
        `Spot the mismatch: DE is a side of the small triangle △ADE and BC is the matching side of the big triangle △ABC. Comparing across the two triangles needs the WHOLE-side ratio, not the piece ratio.`,
        `Build the whole side: AB = AD + DB = 8 + 4 = 12. The similarity ratio of △ADE to △ABC is AD/AB = 8/12 = 2/3.`,
        'Apply that ratio to the matching sides: DE/BC = 2/3, so DE = (2/3)(18) = 12.',
        `Name the error: the student used AD/DB = 8/4 = 2, a piece-to-piece ratio, where a piece-to-whole ratio was required.`,
        `Reality check that catches it instantly: △ADE sits INSIDE △ABC, so DE must be shorter than BC = 18. The answer 36 was longer than the side it was cut from — impossible.`,
      ],
      example: { problem: `In △ABC, D is on AB and E is on AC with DE ∥ BC. AD = 8, DB = 4, and BC = 18. A student writes DE/BC = AD/DB = 8/4 and concludes DE = 36. Find the correct DE and explain the error.`, solution: `DE = 12 — the parallel segment compares to the whole side (AD/AB = 2/3), never to the piece ratio AD/DB.` },
      relatedLoIds: ['geom.proportionality-theorems'],
    },
  ],
  pointers: [
    { content: `Parallel is the engine of the theorem — without DE ∥ BC there is no similarity and no proportion. Test it here: AD/DB = 5/10 = 1/2 but AE/EC = 4/6 = 2/3. The ratios differ, so the converse says DE is NOT parallel to BC, and the equation the student wrote is simply false. Always confirm the parallel given (or prove it with the converse) before writing a proportion.`, kind: 'common-error' },
    { content: `Side-splitter: in △ABC with DE ∥ BC, AD/DB = AE/EC — the parallel cut clones the triangle by AA similarity.`, kind: 'tip' },
    { content: `Keep one ratio style: piece/piece or piece/whole, never mixed. The parallel segment itself compares only to the whole side: DE/BC = AD/AB.`, kind: 'tip' },
    { content: `Converse: equal piece ratios prove DE ∥ BC from lengths alone. Three parallel lines cut proportional pieces on any two transversals.`, kind: 'tip' },
    { content: `Angle bisector from A: BD/DC = AB/AC — pair each piece with the side that touches the same vertex.`, kind: 'tip' },
    { content: `Every one of these needs its hypothesis: no parallel given (or bisector given) means no proportion.`, kind: 'tip' },
    { content: `Never mix ratio styles: \`AD/DB = AE/AC\` is false. Pick piece/piece (\`AD/DB = AE/EC\`) **or** piece/whole (\`AD/AB = AE/AC\`) and keep both sides of the equation in that same style.`, kind: 'common-error' },
    { content: `When solving for the parallel segment itself (DE), it compares only to the **whole** side: \`DE/BC = AD/AB\`. Writing \`DE/BC = AD/DB\` is the classic trap — DE is a side of △ADE, not a piece of a split side.`, kind: 'gotcha' },
    { content: `Sanity-check size: △ADE sits inside △ABC, so DE must be **shorter** than BC. If your answer for the cut is longer than the side it's parallel to, you used a piece ratio by mistake.`, kind: 'tip' },
    { content: `No parallel given, no proportion. A segment that *looks* parallel proves nothing — either DE ∥ BC is stated, or you must prove it with the converse first. Check the hypothesis before writing any equation.`, kind: 'gotcha' },
    { content: `Angle bisector: match each piece with the side touching the **same vertex**. BD touches B, so it pairs with AB: \`BD/DC = AB/AC\`. Writing \`BD/DC = AC/AB\` is the standard slip.`, kind: 'common-error' },
    { content: `Side-splitter and angle bisector are different theorems with different triggers: parallel cut → pieces of the two *cut* sides are proportional; bisector from a vertex → pieces of the *opposite* side match the two sides forming the angle.`, kind: 'vocab-note' },
    { content: `With three parallel lines on two transversals, keep the points in matching order: \`AB/BC = XY/YZ\`. Don't pair a top piece on one transversal with a bottom piece on the other, and don't assume the transversals themselves are equal in length.`, kind: 'edge-case' },
    { content: `If D and E are midpoints you don't need new machinery: \`AD/DB = AE/EC = 1\` gives DE ∥ BC by the converse, and \`AD/AB = 1/2\` gives DE = BC/2 — a special case of side-splitter, not a separate rule.`, kind: 'tip' },
  ],
};
