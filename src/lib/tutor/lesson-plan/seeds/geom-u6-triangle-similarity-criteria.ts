/**
 * Geometry — Similarity: Triangle Similarity: AA, SSS & SAS.
 *
 * The similarity twins of the congruence criteria (CCSS G-SRT.A.3,
 * G-SRT.B.5): same shape, any size. AA is the workhorse — two angles
 * are enough — and the two ratio criteria (SSS~, SAS~) carry the
 * scale factor. Equal billing for the classic wrecker: comparing
 * sides by DIFFERENCE instead of by RATIO.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U6_TRIANGLE_SIMILARITY_CRITERIA: LessonPlan = {
  id: 'evelyn.hs.geom.triangle-similarity-criteria.v1',
  title: 'Triangle Similarity: AA, SSS & SAS',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.triangle-similarity-criteria',
      standard: 'GEOM-6.3',
      description:
        'Establish that two triangles are similar using the AA, SSS and SAS similarity criteria, and use the resulting scale factor to find unknown side lengths (CCSS G-SRT.A.3, G-SRT.B.5).',
    },
  ],
  prerequisites: ['geom.similar-polygons'],
  followUps: ['geom.proportionality-theorems'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame similarity criteria as the tool that measures the unreachable — and as the foundation the rest of the course stands on.',
      script:
        'How do you measure a cliff you cannot climb? Stand a metre stick in the sun, measure its shadow and the cliff\'s shadow, and you are done — because the sun\'s rays strike both at the same angle, the stick-and-shadow triangle and the cliff-and-shadow triangle have the same shape. Two equal angles is all it takes. That single idea is how surveyors, architects making scale models, and film crews faking a giant monster all work. It is also the hinge of this whole course: every trigonometric ratio you meet later exists only because all right triangles sharing one acute angle are similar.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-criteria',
      kind: 'concept',
      goal: 'The three similarity criteria, how the scale factor works, and the ratio-versus-difference trap.',
      keyIdeas: [
        'WHAT SIMILAR MEANS — △ABC ~ △DEF says corresponding angles are EQUAL and corresponding sides are PROPORTIONAL: AB/DE = BC/EF = CA/FD = k. The letter order carries the matching, exactly as it does for ≅: A↔D, B↔E, C↔F.',
        'AA — two pairs of equal angles prove similarity. The third pair comes free, because the angles of every triangle sum to 180°. This is the criterion you will reach for nine times out of ten, and it has NO congruence twin: angles fix shape, never size.',
        'SSS SIMILARITY — all three pairs of corresponding sides in the SAME ratio. Pair them by position: longest with longest, shortest with shortest. Compute all three ratios and check they agree before you claim it.',
        'SAS SIMILARITY — two pairs of sides in the same ratio AND the INCLUDED angle equal. Included still means between: in △ABC, ∠B sits between AB and BC. A non-included angle (SSA) proves nothing here either.',
        'THE SCALE FACTOR k — once similarity is established, k multiplies EVERY length: sides, altitudes, medians, perimeter. If k = 2.5 going from △ABC to △DEF, then every length in △DEF is 2.5 times its partner in △ABC.',
        'ERROR 1: DIFFERENCES INSTEAD OF RATIOS — sides 4, 6, 8 and 6, 8, 10 are NOT similar even though each side grew by 2. Similarity is multiplicative, never additive: check 6/4, 8/6, 10/8 and watch them disagree.',
        'ERROR 2: NOT ENOUGH ANGLES — one pair of equal angles is not AA. Two right triangles both have a 90° angle and can still be wildly different shapes. You need a SECOND pair of equal angles, or a pair of proportional sides around the one you have.',
        'CONGRUENCE IS THE k = 1 CASE — SSS and SAS congruence are just these criteria with the ratio locked at 1. Similar triangles with any pair of corresponding sides equal are congruent.',
      ],
      vocabulary: [
        { term: 'scale factor', definition: 'the constant ratio k between every pair of corresponding lengths in two similar figures.' },
        { term: 'included angle', definition: 'the angle formed by (between) two given sides of a triangle — the angle SAS similarity requires.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-aa-angle-sum',
      kind: 'worked_example',
      problem:
        'In △ABC, ∠A = 52° and ∠B = 63°. In △DEF, ∠E = 63° and ∠F = 65°. Are the two triangles similar? If so, by which criterion, and written in which order?',
      steps: [
        'Only one pair matches on sight — ∠B = ∠E = 63°. One pair is not AA, so recover a missing angle first.',
        'Angle sum in △ABC: ∠C = 180° - 52° - 63° = 65°.',
        'Now ∠C = ∠F = 65°, giving a second matching pair — that is AA.',
        'Fix the correspondence from the equal angles: A↔D, B↔E, C↔F. Check it: ∠D = 180° - 63° - 65° = 52° = ∠A. ✓',
        'Write the statement in that order: △ABC ~ △DEF by AA.',
      ],
      answer: 'Yes — △ABC ~ △DEF by AA (after finding ∠C = 65°).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ratio-not-difference',
      kind: 'worked_example',
      problem:
        'A classmate claims △PQR with sides 4, 6, 8 is similar to △STU with sides 6, 8, 10, "because every side grew by 2." Is the claim right? And what side lengths WOULD make a triangle similar to △PQR?',
      steps: [
        'Pair the sides by size: 4 with 6, 6 with 8, 8 with 10.',
        'Compute each ratio: 6/4 = 1.5, 8/6 ≈ 1.33, 10/8 = 1.25.',
        'The three ratios disagree, so SSS similarity fails — the triangles are not similar. Adding the same amount to every side changes the shape, because 2 is a big jump next to 4 and a small one next to 8.',
        'Similarity needs one constant MULTIPLIER. Scale △PQR by k = 1.5: 4 × 1.5 = 6, 6 × 1.5 = 9, 8 × 1.5 = 12.',
        'So a triangle with sides 6, 9, 12 is similar to △PQR by SSS similarity, with scale factor 1.5.',
      ],
      answer: 'The claim is wrong — the ratios 1.5, 1.33 and 1.25 disagree. Sides 6, 9, 12 (k = 1.5) would be similar.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pick-criterion',
      kind: 'try_yourself',
      problem:
        'In △JKL and △MNP: JK/MN = KL/NP = 3/2, and ∠K = ∠N. Remember that in △JKL, ∠K is the angle between sides JK and KL, and in △MNP, ∠N is between MN and NP. Which criterion proves △JKL ~ △MNP?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'SAS similarity', correct: true },
        { id: 'b', text: 'AA' },
        { id: 'c', text: 'SSS similarity' },
        { id: 'd', text: 'Nothing — a side-side-angle pattern never proves similarity' },
      ],
      expectedAnswer: 'SAS similarity',
      hints: [
        'Count what you were handed: two side ratios and one angle. Then ask where that angle sits.',
        '∠K lies between the two sides whose ratios you know, so the angle is included.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-not-similar',
      kind: 'try_yourself',
      problem: 'Which pair of triangles is NOT necessarily similar?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Two triangles that each have angles measuring 30° and 70°' },
        { id: 'b', text: 'A triangle with sides 5, 12, 13 and a triangle with sides 10, 24, 26' },
        { id: 'c', text: 'A triangle with sides 3, 5, 7 and a triangle with sides 6, 8, 10', correct: true },
        { id: 'd', text: 'Two right triangles that each have an acute angle of 55°' },
      ],
      expectedAnswer: 'A triangle with sides 3, 5, 7 and a triangle with sides 6, 8, 10',
      hints: [
        'For the side-length pairs, divide matching sides and see whether the ratios agree.',
        'One pair grew by adding 3 to each side rather than multiplying — check 6/3, 8/5 and 10/7.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        '△ABC ~ △DEF, so A↔D, B↔E and C↔F. AB = 6, BC = 8, and DE = 15. Find the length of EF and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '20',
      hints: [
        'Find the scale factor from △ABC to △DEF using the pair you know both of: k = DE/AB = 15/6.',
        'k = 2.5, and EF corresponds to BC, so EF = 2.5 × 8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-angle',
      kind: 'misconception_check',
      question:
        'A student notices that △ABC and △DEF are both right triangles, with ∠A = ∠D = 90°, and concludes that the two triangles are similar by AA. What went wrong?',
      commonErrors: [
        {
          answer: 'They are similar by AA because both have a 90° angle',
          misconception: 'Treating a single pair of equal angles as AA — and assuming all right triangles share a shape.',
          correctsTo:
            'AA needs TWO pairs of equal angles. A 90°-45°-45° triangle and a 90°-20°-70° triangle both have a right angle and look nothing alike. Find a second equal angle pair, or show the legs around the right angle are proportional and use SAS similarity.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three criteria: AA (two equal angle pairs), SSS similarity (all three side ratios equal), SAS similarity (two side ratios equal plus the INCLUDED angle).',
        'AA is the workhorse — the third angle is forced by the 180° sum — and it never proves congruence, only shape.',
        'Compare sides by RATIO, never by difference: 4, 6, 8 and 6, 8, 10 are not similar.',
        'One scale factor k multiplies every corresponding length; k = 1 is exactly congruence.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Triangle Similarity: AA, SSS & SAS' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
