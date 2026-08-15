/**
 * Geometry — Parallel & Perpendicular Lines: Proving Lines Parallel.
 *
 * The same picture as the last lesson, run backwards (CCSS G-CO.C.9): you
 * are handed the angles and asked to conclude that the lines are parallel.
 * Equal billing for the two errors that sink these proofs — using a pair
 * that lives at ONE crossing (vertical angles, linear pairs) as evidence,
 * and quoting the forward theorem, which assumes the very thing being proved.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U3_PROVING_LINES_PARALLEL: LessonPlan = {
  id: 'evelyn.hs.geom.proving-lines-parallel.v1',
  title: 'Proving Lines Parallel',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.proving-lines-parallel',
      standard: 'GEOM-3.2',
      description:
        'Prove that two lines are parallel by applying the converses of the parallel-line angle theorems — corresponding, alternate interior, and alternate exterior angles congruent, same-side interior angles supplementary — along with the perpendicular-transversal and transitivity results, and find the value that forces two lines to be parallel (CCSS G-CO.C.9).',
    },
  ],
  prerequisites: ['geom.parallel-lines-transversals'],
  followUps: ['geom.slopes-parallel-perpendicular'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the converse direction as the practical question — nobody can verify "these lines never meet" by looking, so parallelism has to be certified from two angle measurements.',
      script:
        'Parallel means the two lines never meet — not in this room, not a mile past the wall. Nobody can check "never" by looking. So how does a framer know two wall studs are truly parallel before the drywall goes up, or a striping crew know two rows of parking spaces will not pinch together at the far end of the lot? They lay one straight edge across both lines and measure an angle at each crossing. If those two angles come out right, the lines are guaranteed parallel forever — no walking to the horizon required. Last lesson you were GIVEN parallel and found angles. Today you run the machine backwards: you are given angles, and you prove parallel.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-converses',
      kind: 'concept',
      goal: 'The four converses, why the angle pair must straddle both crossings, the two extra routes, and the two classic errors.',
      keyIdeas: [
        'THE CONVERSE FLIPS THE ARROW — last lesson every theorem read "if the lines are parallel, then the angles do X". Proving lines parallel uses the CONVERSE: "if the angles do X, then the lines are parallel". Given and conclusion trade places, so the given is now an angle fact and the conclusion is ∥.',
        'THE FOUR CONVERSES — if a pair of CORRESPONDING angles is congruent, the lines are parallel (this converse is the postulate the other three lean on). Same conclusion if a pair of ALTERNATE INTERIOR angles is congruent, if a pair of ALTERNATE EXTERIOR angles is congruent, or if a pair of SAME-SIDE INTERIOR angles is SUPPLEMENTARY.',
        'ONE ANGLE AT EACH CROSSING — a pair can only certify parallelism if one angle sits at the crossing with the first line and the other at the crossing with the second line. ERROR 1: offering a pair that lives entirely at ONE crossing — vertical angles congruent, or a linear pair summing to 180° — as proof. Those are true at every crossing in the plane, parallel or not, so they carry zero information about the other line.',
        'NAME THE TRANSVERSAL FIRST — in a figure with three or more lines, the transversal is the line that contains BOTH angle vertices; the two lines you are proving parallel are the other two. Reading the roles backwards proves the wrong pair parallel, so label the roles before quoting any theorem.',
        'SUPPLEMENTARY IS NOT CONGRUENT — three converses want the angles EQUAL; the same-side interior converse wants them to ADD to 180°. When you are solving for the value of x that forces parallel, this choice sets up the entire equation: set the expressions equal, or set their sum to 180. Classify the pair first, write the equation second.',
        'TWO MORE ROUTES TO PARALLEL — the perpendicular-transversal converse: if two coplanar lines are each ⊥ to the same line, they are parallel (this is why square-cut studs off one plate come out parallel). And transitivity: if a ∥ b and b ∥ c, then a ∥ c.',
        'NEVER ASSUME WHAT YOU ARE PROVING — ERROR 2: writing "since a ∥ b, corresponding angles are congruent" inside a proof whose CONCLUSION is a ∥ b. That is circular. Until the last line, a ∥ b is not available as a reason. Neither is "it looks parallel" — a drawing is never a reason.',
        'THE CLOSING MOVE — real problems chain: use vertical angles or a linear pair at one crossing to migrate a known measure into the position you need, and only THEN name a converse to close. Reasons run "vertical angles", "linear pair", …, and the final reason is the converse that delivers ∥.',
      ],
      vocabulary: [
        {
          term: 'converse',
          definition:
            'the statement you get by swapping a conditional\'s hypothesis and conclusion — "if parallel, then congruent" becomes "if congruent, then parallel". A converse has to be proved on its own; it does not come free with the original.',
        },
        {
          term: 'perpendicular transversal converse',
          definition: 'if two coplanar lines are each ⊥ to the same line, then the two lines are parallel.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-certify-parallel',
      kind: 'worked_example',
      problem:
        'Lines p and q are cut by transversal t, with p the upper line and q the lower line. At the crossing with p, the angle above p and to the right of t measures 62°. At the crossing with q, the angle above q and to the left of t measures 118°. Are p and q parallel? Name the reason for every step.',
      steps: [
        'Sort interior from exterior: the strip BETWEEN p and q is the interior region. The 62° angle sits above p, so it is exterior; the 118° angle sits above q and therefore between the lines, so it is interior. Mixed positions — not yet a named pair.',
        'Migrate the 62° angle inside. At the crossing with p, its vertical angle sits below p and to the left of t and also measures 62° (Vertical Angles Theorem). That copy is interior and on the LEFT of t.',
        'Now compare like with like: interior at p, left of t = 62°; interior at q, left of t = 118°. Both interior, both on the same side of t → a same-side interior pair.',
        'Test the pair: 62 + 118 = 180, so the pair is supplementary. By the Converse of the Same-Side Interior Angles Theorem, p ∥ q.',
        'Sense-check the finished picture: only two angle sizes appear, 62° and 118°, four of each, and they sum to 180°. ✓',
      ],
      answer: 'Yes — p ∥ q by the Converse of the Same-Side Interior Angles Theorem, after using vertical angles to move the 62° measure into the interior.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-one-crossing-trap',
      kind: 'worked_example',
      problem:
        'Lines g and h are cut by transversal t. At the crossing of t with g, two angles form a linear pair: one measures 105° and the other measures 75°. A student writes: "These two angles are supplementary, so by the Converse of the Same-Side Interior Angles Theorem, g ∥ h." Explain the error, and state a given that would actually prove g ∥ h.',
      steps: [
        'Locate both angles before judging the claim: both of them sit at the SAME crossing — the one with g. Neither angle touches h at all.',
        'Identify what the pair really is: two angles that share a side and open into a straight line are a LINEAR PAIR, and a linear pair is supplementary at every crossing in the plane, parallel lines or not. A fact that is always true cannot distinguish parallel from not-parallel, so it proves nothing about h.',
        'State the requirement the converse actually has: a same-side interior pair needs ONE angle at the crossing with g and ONE at the crossing with h, both between the lines, both on the same side of t.',
        'Build a given that works: if the interior angle at g on the right of t measures 105° and the interior angle at h on the right of t measures 75°, then that pair is same-side interior and 105 + 75 = 180, so g ∥ h by the Converse of the Same-Side Interior Angles Theorem.',
        'General rule to carry away: before quoting any converse, check that your two angles have DIFFERENT vertices, one on each line being tested.',
      ],
      answer: 'The two angles form a linear pair at a single crossing, so they are supplementary no matter what h does — the converse needs one angle at each crossing, such as a 105° interior angle at g and a 75° interior angle at h on the same side of t.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-name-the-reason',
      kind: 'try_yourself',
      problem:
        'Lines m and n are cut by transversal t, with m the upper line and n the lower line. It is given that the angle above m on the left of t is congruent to the angle below n on the right of t. Which reason proves m ∥ n?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Converse of the Alternate Exterior Angles Theorem', correct: true },
        { id: 'b', text: 'Alternate Exterior Angles Theorem' },
        { id: 'c', text: 'Converse of the Same-Side Interior Angles Theorem' },
        { id: 'd', text: 'Vertical Angles Theorem' },
      ],
      expectedAnswer: 'Converse of the Alternate Exterior Angles Theorem',
      hints: [
        'Place each angle first: is it inside the strip between m and n or outside it, and are the two on the same side of t or opposite sides?',
        'Above the upper line and below the lower line are both EXTERIOR positions, and left versus right of t makes them alternate. You are reasoning FROM the congruence TO parallel, so you need the converse, not the forward theorem.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-given-fails',
      kind: 'try_yourself',
      problem: 'Lines a and b are cut by transversal t. Which given does NOT let you conclude that a ∥ b?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A pair of corresponding angles is congruent.' },
        { id: 'b', text: 'A pair of alternate interior angles is congruent.' },
        { id: 'c', text: 'Two angles forming a linear pair at the crossing with a are supplementary.', correct: true },
        { id: 'd', text: 'A pair of same-side interior angles is supplementary.' },
      ],
      expectedAnswer: 'Two angles forming a linear pair at the crossing with a are supplementary.',
      hints: [
        'Three of these compare one angle at EACH crossing; one of them never leaves a single crossing.',
        'A linear pair is supplementary wherever two lines meet, parallel or not — a fact that is always true cannot certify anything about b.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-force-parallel',
      kind: 'try_yourself',
      problem:
        'Lines c and d are cut by transversal t, with c the upper line and d the lower line. The interior angle at the crossing with c on the left side of t measures (4x + 10)° and the interior angle at the crossing with d on the left side of t measures (x + 40)°. Find the value of x that makes c ∥ d, and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '26',
      hints: [
        'Both angles are interior and on the same side of t, so this is a same-side interior pair — that converse needs the two measures to ADD to 180, not to be equal.',
        '(4x + 10) + (x + 40) = 180 → 5x + 50 = 180 → 5x = 130.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-circular-proof',
      kind: 'misconception_check',
      question:
        'A problem asks the student to prove that lines a and b are parallel. The student writes: "Since a ∥ b, corresponding angles are congruent, so ∠1 ≅ ∠2. Therefore a ∥ b." What went wrong?',
      commonErrors: [
        {
          answer: 'Nothing — corresponding angles are congruent, so a ∥ b.',
          misconception:
            'Circular reasoning: quoting the forward Corresponding Angles Postulate, which ASSUMES a ∥ b, inside the proof that is supposed to establish a ∥ b.',
          correctsTo:
            'Run the argument in the legal direction. The congruence ∠1 ≅ ∠2 has to arrive as a GIVEN (or be derived from givens using always-true facts like vertical angles and linear pairs); then the Converse of the Corresponding Angles Postulate delivers a ∥ b as the final line. Until that final line, a ∥ b may not appear as a reason.',
        },
        {
          answer: 'a ∥ b because the two lines look parallel in the drawing and never seem to meet.',
          misconception: 'Treating how a figure looks as evidence — a drawing can be off by a fraction of a degree and still look parallel.',
          correctsTo:
            'A drawing is never a reason, and "never meet" cannot be checked by inspection. Measure one angle at each crossing and let a converse do the certifying: congruent corresponding, alternate interior, or alternate exterior angles, or supplementary same-side interior angles.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Proving parallel runs the converse: start from an angle fact and conclude ∥, instead of starting from ∥.',
        'Congruent corresponding, alternate interior, or alternate exterior angles → parallel. Supplementary same-side interior angles → parallel. Add for the same-side pair; set equal for the other three.',
        'The pair must have one angle at EACH crossing. Vertical angles and linear pairs live at a single crossing and are always true, so they never prove parallel on their own.',
        'The transversal is the line holding both angle vertices; the other two lines are the ones being proved parallel.',
        'Two lines ⊥ to the same line are parallel, and two lines parallel to the same line are parallel to each other.',
        'Never use the conclusion as a reason, and never use the picture as a reason — chain always-true facts first, then close with one converse.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Proving Lines Parallel' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
