/**
 * Geometry — Similarity: Side-Splitter & Proportionality Theorems.
 *
 * Similarity cashed out as arithmetic (CCSS G-SRT.B.4, G-SRT.B.5): a line
 * parallel to one side of a triangle cuts the other two sides in the same
 * ratio, three parallel lines cut proportional pieces on any transversal,
 * and an angle bisector splits the opposite side in the ratio of the sides
 * that form the angle. Numeric work stays on integer setups.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U6_PROPORTIONALITY_THEOREMS: LessonPlan = {
  id: 'evelyn.hs.geom.proportionality-theorems.v1',
  title: 'Side-Splitter & Proportionality Theorems',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.proportionality-theorems',
      standard: 'GEOM-6.4',
      description:
        'Apply the triangle proportionality (side-splitter) theorem and its converse, the parallel-lines-on-transversals theorem, and the triangle angle-bisector theorem to find unknown lengths and to justify that lines are parallel (CCSS G-SRT.B.4, G-SRT.B.5).',
    },
  ],
  prerequisites: ['geom.triangle-similarity-criteria'],
  followUps: ['geom.pythagorean-theorem'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame proportionality as the tool that turns "same shape" into exact measurements — the carpenter\'s and drafter\'s everyday trick.',
      script:
        'A carpenter needs to rip a wide board into five equal strips, but the board is an awkward 13 and 3/8 inches across, and dividing that by five with a tape measure is miserable. So they cheat: lay the ruler diagonally across the board, mark five easy equal units along it, then draw parallel lines back to the edge. Five perfect strips, no arithmetic. That trick IS today\'s theorem — parallel lines slice any two paths into proportional pieces. Similarity told you shapes match; proportionality turns that match into numbers you can cut to.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-proportionality',
      kind: 'concept',
      goal: 'The side-splitter theorem and its converse, the three-parallel-lines version, the angle-bisector theorem, and the ratio-matching discipline that keeps proportions honest.',
      keyIdeas: [
        'THE SIDE-SPLITTER THEOREM — in △ABC, if D is on AB and E is on AC with DE ∥ BC, then AD/DB = AE/EC. The reason is similarity: DE ∥ BC makes ∠ADE ≅ ∠ABC and ∠AED ≅ ∠ACB (corresponding angles), so △ADE ~ △ABC by AA. A parallel cut clones the triangle.',
        'PART TO PART, OR PART TO WHOLE — BOTH AD/DB = AE/EC (piece to piece) and AD/AB = AE/AC (piece to whole side) are true. What is NOT allowed is mixing them: AD/DB = AE/AC is false. Choose one style and use it on both sides of the equals sign.',
        'THE PARALLEL SEGMENT IS DIFFERENT — DE is a side of the small triangle, so it only ever compares to a WHOLE side: DE/BC = AD/AB. Writing DE/BC = AD/DB is the single most common wrong setup when the question asks for the length of the cut.',
        'THE CONVERSE — if AD/DB = AE/EC, then DE ∥ BC. This runs the theorem backwards: equal piece ratios prove two lines parallel using lengths alone, with no angle measured.',
        'THREE PARALLEL LINES — if three parallel lines cross two transversals, they cut proportional pieces on both. With the parallels meeting one transversal at A, B, C and the other at X, Y, Z (in that order), AB/BC = XY/YZ. Equal spacing on one transversal forces equal spacing on the other — that is the carpenter\'s board trick.',
        'TRIANGLE ANGLE-BISECTOR THEOREM — in △ABC, if AD bisects ∠A with D on BC, then BD/DC = AB/AC. The bisector splits the opposite side in the ratio of the two sides that FORM the angle. Match by shared vertex: piece BD touches B, so it pairs with side AB, which also touches B. Crossing them (BD/DC = AC/AB) is the classic slip.',
        'MIDSEGMENT IS A SPECIAL CASE — when D and E are midpoints, AD/DB = AE/EC = 1, so by the converse DE ∥ BC, and the whole-side ratio AD/AB = 1/2 gives DE = BC/2. The midsegment theorem falls straight out of side-splitter.',
        'CHECK THE HYPOTHESIS FIRST — none of these fire without their condition. A segment that merely looks parallel proves nothing; the problem must state DE ∥ BC, or you must establish it with the converse, before any proportion is written.',
      ],
      vocabulary: [
        {
          term: 'side-splitter theorem',
          definition: 'a line parallel to one side of a triangle divides the other two sides into proportional pieces.',
        },
        {
          term: 'angle bisector',
          definition: 'a ray that cuts an angle into two congruent angles; drawn from a triangle\'s vertex, it divides the opposite side in the ratio of the two sides forming that angle.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-side-splitter',
      kind: 'worked_example',
      problem:
        'In △ABC, point D lies on side AB and point E lies on side AC, with DE ∥ BC. AD = 6, DB = 4, and AE = 9. Find EC.',
      steps: [
        'Check the hypothesis before anything else: DE ∥ BC is given, D is on AB, E is on AC — the side-splitter theorem applies.',
        'Choose a ratio style and stay in it. Piece to piece: AD/DB = AE/EC, with the top pieces (AD and AE) both the ones touching vertex A.',
        'Substitute the known lengths: 6/4 = 9/EC.',
        'Cross-multiply: 6 · EC = 4 · 9 = 36, so EC = 6.',
        'Sense-check the two ratios: AD/DB = 6/4 = 1.5 and AE/EC = 9/6 = 1.5. They match. ✓',
      ],
      answer: 'EC = 6',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-parallel-segment-trap',
      kind: 'worked_example',
      problem:
        'In △ABC, D is on AB and E is on AC with DE ∥ BC. AD = 8, DB = 4, and BC = 18. A student writes DE/BC = AD/DB = 8/4 and concludes DE = 36. Find the correct DE and explain the error.',
      steps: [
        'Spot the mismatch: DE is a side of the small triangle △ADE and BC is the matching side of the big triangle △ABC. Comparing across the two triangles needs the WHOLE-side ratio, not the piece ratio.',
        'Build the whole side: AB = AD + DB = 8 + 4 = 12. The similarity ratio of △ADE to △ABC is AD/AB = 8/12 = 2/3.',
        'Apply that ratio to the matching sides: DE/BC = 2/3, so DE = (2/3)(18) = 12.',
        'Name the error: the student used AD/DB = 8/4 = 2, a piece-to-piece ratio, where a piece-to-whole ratio was required.',
        'Reality check that catches it instantly: △ADE sits INSIDE △ABC, so DE must be shorter than BC = 18. The answer 36 was longer than the side it was cut from — impossible.',
      ],
      answer: 'DE = 12 — the parallel segment compares to the whole side (AD/AB = 2/3), never to the piece ratio AD/DB.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pick-proportion',
      kind: 'try_yourself',
      problem:
        'In △PQR, point S lies on side PQ and point T lies on side PR, with ST ∥ QR. PS = 5, SQ = 3, and PT = 10. Which proportion correctly sets up the search for TR?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '5/3 = 10/TR', correct: true },
        { id: 'b', text: '5/8 = 10/TR' },
        { id: 'c', text: '5/3 = TR/10' },
        { id: 'd', text: '3/5 = 10/TR' },
      ],
      expectedAnswer: '5/3 = 10/TR',
      hints: [
        'PS and SQ are the two pieces of side PQ; PT and TR are the matching pieces of side PR.',
        'Use the same style on both sides: piece/piece = piece/piece, with the pieces touching vertex P (PS and PT) both on top.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-converse',
      kind: 'try_yourself',
      problem:
        'In △ABC, point D lies on side AB and point E lies on side AC. You are told AD = 4, DB = 6, AE = 6, and EC = 9, and nothing about parallel lines. What can you conclude about DE and BC?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'DE ∥ BC, by the converse of the side-splitter theorem', correct: true },
        { id: 'b', text: 'DE ⊥ BC, because the pieces are proportional' },
        { id: 'c', text: 'Nothing — piece ratios say nothing about direction' },
        { id: 'd', text: 'DE = BC, because both triangles contain ∠A' },
      ],
      expectedAnswer: 'DE ∥ BC, by the converse of the side-splitter theorem',
      hints: [
        'Compute the two piece ratios AD/DB and AE/EC and compare them.',
        '4/6 = 2/3 and 6/9 = 2/3 — equal piece ratios trigger the converse, which hands you the parallel conclusion.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'In △ABC, AB = 12 and AC = 8. Segment AD bisects ∠A, with D on side BC. If BD = 9, find DC. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '6',
      hints: [
        'The angle-bisector theorem gives BD/DC = AB/AC — each piece pairs with the side touching the same vertex.',
        'Substitute: 9/DC = 12/8 = 3/2, then cross-multiply.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-missing-parallel',
      kind: 'misconception_check',
      question:
        'In △ABC, D is on AB and E is on AC. A student is given AD = 5, DB = 10, AE = 4, EC = 6 and immediately writes AD/DB = AE/EC to start solving — but the problem never says DE ∥ BC. What went wrong?',
      commonErrors: [
        {
          answer: 'AD/DB = AE/EC, so the proportion holds',
          misconception: 'Treating the side-splitter proportion as true for ANY segment that cuts two sides, instead of only for a segment parallel to the third side.',
          correctsTo:
            'Parallel is the engine of the theorem — without DE ∥ BC there is no similarity and no proportion. Test it here: AD/DB = 5/10 = 1/2 but AE/EC = 4/6 = 2/3. The ratios differ, so the converse says DE is NOT parallel to BC, and the equation the student wrote is simply false. Always confirm the parallel given (or prove it with the converse) before writing a proportion.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Side-splitter: in △ABC with DE ∥ BC, AD/DB = AE/EC — the parallel cut clones the triangle by AA similarity.',
        'Keep one ratio style: piece/piece or piece/whole, never mixed. The parallel segment itself compares only to the whole side: DE/BC = AD/AB.',
        'Converse: equal piece ratios prove DE ∥ BC from lengths alone. Three parallel lines cut proportional pieces on any two transversals.',
        'Angle bisector from A: BD/DC = AB/AC — pair each piece with the side that touches the same vertex.',
        'Every one of these needs its hypothesis: no parallel given (or bisector given) means no proportion.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Side-Splitter & Proportionality Theorems' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
