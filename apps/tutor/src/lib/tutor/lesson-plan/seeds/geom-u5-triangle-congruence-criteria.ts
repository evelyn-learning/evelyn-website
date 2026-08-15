/**
 * Geometry — Triangles: Triangle Congruence: SSS, SAS, ASA & AAS.
 *
 * The heart of the proof culture (CCSS G-CO.B.7, G-CO.B.8): congruence
 * means every corresponding part matches, but you only ever need to check
 * three well-chosen parts. Equal billing for the impostors — AAA and SSA —
 * because knowing why they fail is what makes the real criteria stick.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U5_TRIANGLE_CONGRUENCE_CRITERIA: LessonPlan = {
  id: 'evelyn.hs.geom.triangle-congruence-criteria.v1',
  title: 'Triangle Congruence: SSS, SAS, ASA & AAS',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.triangle-congruence-criteria',
      standard: 'GEOM-5.2',
      description:
        'Determine whether two triangles are congruent using the SSS, SAS, ASA, and AAS criteria, and explain why AAA and SSA are not valid congruence shortcuts (CCSS G-CO.B.7, G-CO.B.8).',
    },
  ],
  prerequisites: ['geom.triangle-angle-relationships'],
  followUps: ['geom.cpctc-proofs'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame congruence shortcuts as minimum-information guarantees — the idea engineers and manufacturers rely on daily.',
      script:
        'A triangle has six measurable parts — three sides and three angles. Checking all six every time would be exhausting. The beautiful result of this lesson: three well-chosen parts are enough to lock down the whole triangle. That is why a bridge builder can order a thousand identical steel trusses by specifying just three numbers. Today you learn which combinations of three work, and — just as important — which two famous combinations fail.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-criteria',
      kind: 'concept',
      goal: 'The four valid criteria, why "included" matters, and the two impostors.',
      keyIdeas: [
        'WHAT CONGRUENT MEANS — △ABC ≅ △DEF says every corresponding part matches: AB = DE, BC = EF, CA = FD, ∠A = ∠D, ∠B = ∠E, ∠C = ∠F. The letter ORDER carries the matching: A↔D, B↔E, C↔F.',
        'THE FOUR SHORTCUTS — SSS (three sides), SAS (two sides and the INCLUDED angle), ASA (two angles and the INCLUDED side), AAS (two angles and a NON-included side). Any one of them forces all six parts to match.',
        'INCLUDED MEANS BETWEEN — in SAS the angle must sit between the two sides; in ASA the side must connect the two angles. ∠B is included between sides AB and BC.',
        'IMPOSTOR 1: AAA — three matching angles fix the SHAPE but not the SIZE. A small triangle and a billboard-sized copy have identical angles. AAA gives similarity (Unit 6), never congruence.',
        'IMPOSTOR 2: SSA — two sides and a non-included angle can close in two different ways (the swinging-door problem): the third side can swing to two different lengths. Same three measurements, two different triangles.',
        'HIDDEN GIVENS — diagrams donate free parts: a shared side equals itself (Reflexive Property), and vertical angles are congruent. Most "not enough information" mistakes are really missed hidden givens.',
      ],
      vocabulary: [
        { term: 'included angle', definition: 'the angle formed by (between) two given sides of a triangle.' },
        { term: 'corresponding parts', definition: 'sides or angles in matching positions of two triangles, given by the letter order of the congruence statement.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-identify-criterion',
      kind: 'worked_example',
      problem:
        'Triangles ABD and CBD share side BD. Given: AB = CB and ∠ABD = ∠CBD. Which congruence criterion proves △ABD ≅ △CBD?',
      steps: [
        'List the given pairs: AB = CB (side) and ∠ABD = ∠CBD (angle).',
        'Hunt the hidden given: BD is shared by both triangles, and BD = BD by the Reflexive Property (side).',
        'Arrange the parts in position order: side AB, angle ∠ABD, side BD — the angle sits BETWEEN the two sides.',
        'Two sides and the included angle → SAS. So △ABD ≅ △CBD by SAS.',
      ],
      answer: 'SAS (using the shared side BD by the Reflexive Property)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ssa-fails',
      kind: 'worked_example',
      problem:
        'A classmate claims: "Two triangles each have sides of 8 and 5 and a 30° angle at the end of the 8 side (not between the given sides). That is three matching parts, so the triangles must be congruent." What is wrong?',
      steps: [
        'Name the pattern: side (8), side (5), and a NON-included angle (30°) — this is SSA, not SAS.',
        'Picture the 5-side as a door hinged at the far end of the 8-side, swinging until its tip touches the base ray.',
        'The swinging side can land in TWO spots — leaning toward the 30° angle or away from it — closing the triangle with two different third sides.',
        'Two different triangles share those three measurements, so the three parts do not force congruence. SSA proves nothing without extra information.',
      ],
      answer: 'The pattern is SSA, which is not a congruence criterion — the triangle can close in two different ways.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pick-criterion',
      kind: 'try_yourself',
      problem:
        'In triangles PQR and XYZ: ∠P = ∠X, ∠Q = ∠Y, and PQ = XY. Note that side PQ connects vertices P and Q. Which criterion proves △PQR ≅ △XYZ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'ASA', correct: true },
        { id: 'b', text: 'AAS' },
        { id: 'c', text: 'SAS' },
        { id: 'd', text: 'SSS' },
      ],
      expectedAnswer: 'ASA',
      hints: [
        'Two angles and one side are given — is the side included between the angles?',
        'PQ connects P and Q, the vertices of the two given angles — the side is between them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-not-enough',
      kind: 'try_yourself',
      problem: 'Which set of matching parts does NOT guarantee two triangles are congruent?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Three pairs of sides' },
        { id: 'b', text: 'Two pairs of angles and the included side' },
        { id: 'c', text: 'Three pairs of angles', correct: true },
        { id: 'd', text: 'Two pairs of sides and the included angle' },
      ],
      expectedAnswer: 'Three pairs of angles',
      hints: [
        'One of these fixes the shape but lets the size grow or shrink.',
        'AAA is the similarity impostor — same angles, any size.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        '△ABC ≅ △DEF, AB = 3x - 4, and the corresponding side DE = 17. Solve for x and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '7',
      hints: [
        'Corresponding parts of congruent triangles are equal: 3x - 4 = 17.',
        'Add 4, then divide by 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-aaa',
      kind: 'misconception_check',
      question:
        'A student measures all three angles of two triangles, finds all three pairs equal, and concludes the triangles are congruent. What went wrong?',
      commonErrors: [
        {
          answer: 'The triangles are congruent by AAA',
          misconception: 'Treating AAA as a congruence criterion because three parts match.',
          correctsTo:
            'AAA fixes only the shape, not the size — the triangles are SIMILAR. Congruence needs at least one pair of corresponding sides: upgrade AAA to ASA or AAS with a side.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Valid shortcuts: SSS, SAS, ASA, AAS — three well-chosen parts force all six.',
        'Included means between: SAS needs the angle between the sides, ASA the side between the angles.',
        'AAA → similarity only; SSA → ambiguous (the swinging door). Neither proves congruence.',
        'Hunt hidden givens: shared sides (Reflexive Property) and vertical angles are free matching parts.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Triangle Congruence: SSS, SAS, ASA & AAS' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
