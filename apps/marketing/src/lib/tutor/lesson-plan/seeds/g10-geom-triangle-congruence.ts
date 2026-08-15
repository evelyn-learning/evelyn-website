/**
 * G10 — Geometry: Triangle congruence (SSS, SAS, ASA, AAS, HL).
 *
 * Two triangles are CONGRUENT when one is a perfect copy of the other
 * (same size, same shape). To PROVE congruence, you don't need to
 * check every side and angle — just three matching pieces in one of
 * five specific patterns. The misconception about SSA (no, doesn't
 * work) is the centerpiece.
 */

import type { LessonPlan } from '../types';

export const SEED_G10_GEOM_TRIANGLE_CONGRUENCE: LessonPlan = {
  id: 'evelyn.g10.math.geometry.triangle-congruence.v1',
  title: 'Triangle Congruence (SSS, SAS, ASA, AAS, HL)',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'math',
  topic: 'congruence',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsg.co.b.7',
      description: 'Show that two triangles are congruent if and only if corresponding pairs of sides and angles are congruent.',
      standard: 'CCSS.MATH.CONTENT.HSG.CO.B.7',
    },
    {
      id: 'ccss.math.hsg.co.b.8',
      description: 'Explain how the criteria for triangle congruence (ASA, SAS, SSS) follow from rigid motions.',
      standard: 'CCSS.MATH.CONTENT.HSG.CO.B.8',
    },
  ],
  prerequisites: ['ccss.math.8.g.a.2'],
  followUps: ['ccss.math.hsg.srt.b.5'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Build the "minimum info to lock a triangle" intuition.',
      script: 'I tell you "draw me a triangle with sides 3, 4, and 5." How many different triangles fit? Just one, up to a flip — you can\'t adjust without breaking the side lengths. Three pieces of info, locked in. That\'s SSS, the simplest of five congruence shortcuts.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-shortcuts',
      kind: 'concept',
      goal: 'The five working patterns + why SSA does NOT work.',
      keyIdeas: [
        'Two triangles are CONGRUENT (≅) if one is identical to the other after a translation, rotation, or reflection.',
        'You don\'t need to check all 6 corresponding parts — just 3 in the right pattern.',
        'SSS — three pairs of corresponding SIDES equal. Triangles congruent.',
        'SAS — two pairs of corresponding sides AND the angle BETWEEN them. The angle must be the INCLUDED angle.',
        'ASA — two pairs of corresponding angles AND the side BETWEEN them.',
        'AAS — two pairs of corresponding angles AND a NON-included side. (Once two angles are fixed, the third is forced — so AAS is really just ASA in disguise.)',
        'HL — for RIGHT triangles only: hypotenuse and one leg. (Special case.)',
        'SSA does NOT generally prove congruence — two non-included sides + a non-included angle can give two different triangles. ("Donkey theorem" — the joke name students remember.)',
        'AAA gives SIMILAR triangles, NOT necessarily congruent. (Same shape, possibly different size.)',
      ],
      vocabulary: [
        { term: 'congruent', definition: 'identical in size and shape.' },
        { term: 'included angle', definition: 'the angle between two specified sides.' },
        { term: 'included side', definition: 'the side between two specified angles.' },
      ],
      suggestedTools: ['show_geometry_constructed'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sas',
      kind: 'worked_example',
      problem: 'Triangle ABC has AB = 5, AC = 7, and angle A = 40°. Triangle DEF has DE = 5, DF = 7, and angle D = 40°. Are they congruent? Which postulate?',
      steps: [
        'Match up: AB ↔ DE (both 5). AC ↔ DF (both 7). Angle A ↔ Angle D (both 40°).',
        'Check the angle position. Angle A is between AB and AC — the INCLUDED angle. Same for D.',
        'Two sides + the included angle → SAS.',
        'Triangles ABC and DEF are congruent by SAS.',
      ],
      answer: 'Yes — SAS',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-no-ssa',
      kind: 'worked_example',
      problem: 'Triangle PQR has PQ = 8, QR = 5, and angle P = 30° (NOT between the two given sides). Triangle XYZ has XY = 8, YZ = 5, and angle X = 30°. Must they be congruent?',
      steps: [
        'Match: PQ ↔ XY (8). QR ↔ YZ (5). Angle P ↔ Angle X (30°).',
        'Angle position: P is at vertex P, between sides PQ and PR. The OTHER given side, QR, is opposite to angle P — NOT an included angle.',
        'Pattern: SSA. NOT a valid congruence criterion.',
        'Two different triangles can satisfy these measurements (the "ambiguous case" you\'ll see in trig).',
        'Cannot conclude congruence with SSA alone.',
      ],
      answer: 'Not necessarily — SSA does not prove congruence',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Triangle ABC has angle A = 50°, angle B = 70°, AB = 6. Triangle DEF has angle D = 50°, angle E = 70°, DE = 6. Are they congruent? By which postulate?',
      expectedAnswer: 'ASA',
      responseFormat: 'free',
      hints: [
        'Two angles and the side BETWEEN them — that\'s ASA.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-aaa',
      kind: 'misconception_check',
      question: 'Mira sees two triangles with all three angles equal — 50°, 60°, 70° in both. She concludes they are congruent. Right?',
      commonErrors: [
        {
          answer: 'yes — same angles means congruent',
          misconception: 'Confusing SIMILAR (same angles, possibly different sizes) with CONGRUENT (same size AND shape).',
          correctsTo: 'Wrong. Same angles guarantees the triangles are SIMILAR (same shape) — but they could be wildly different sizes. AAA is similarity, not congruence. To conclude congruence you also need at least one pair of corresponding sides equal.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five working patterns: SSS, SAS, ASA, AAS, HL (right triangles).',
        'SSA does NOT prove congruence (ambiguous case).',
        'AAA gives SIMILAR, not congruent.',
        'In SAS, the angle must be BETWEEN the two given sides. In ASA, the side must be BETWEEN the two given angles.',
        'You only need 3 matching pieces in the right pattern — not all 6.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Two right triangles share a hypotenuse of length 13 and one leg of length 5. Are they congruent?',
      hint: 'HL applies (right triangles + hypotenuse + leg). Yes — congruent. The other leg can be computed via Pythagoras: √(13² − 5²) = √144 = 12.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
