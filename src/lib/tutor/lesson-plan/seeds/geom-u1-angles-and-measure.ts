/**
 * Geometry — Foundations: Angles & Angle Measure.
 *
 * The second measuring stick of the course (CCSS G-CO.A.1). Segments gave
 * us length; angles give us turn. Naming discipline, the protractor's
 * two-scale trap, the Angle Addition Postulate, and bisectors — plus the
 * stubborn belief that longer rays make a bigger angle.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U1_ANGLES_AND_MEASURE: LessonPlan = {
  id: 'evelyn.hs.geom.angles-and-measure.v1',
  title: 'Angles & Angle Measure',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.angles-and-measure',
      standard: 'GEOM-1.3',
      description:
        'Name and classify angles, measure them in degrees, and apply the Angle Addition Postulate and angle bisectors to find unknown angle measures (CCSS G-CO.A.1).',
    },
  ],
  prerequisites: ['geom.segments-distance-midpoint'],
  followUps: ['geom.angle-pair-relationships'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame angle measure as the course\'s second ruler — the one that measures turn instead of distance — and show how much of the built world is specified by it.',
      script:
        'Last lesson you measured how FAR apart two points are. Today you measure how much something TURNS. A wheelchair ramp is legal at about 4.8° and illegal at 6°. A roof pitched at 45° sheds snow; the same roof at 10° collapses under it. A pilot who flies a bearing that is 2° off arrives 70 miles from the airport after a 2000-mile flight. Angles are how designers, builders, and navigators pin down direction — and almost every theorem in the rest of this course is a statement about them. So we need to name them, read them, and add them without slipping.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-angle-measure',
      kind: 'concept',
      goal: 'Definition and naming of angles, the four classifications, protractor reading, the Angle Addition Postulate, bisectors, and the congruent-vs-equal distinction.',
      keyIdeas: [
        'WHAT AN ANGLE IS — two rays that share an endpoint. The shared endpoint is the VERTEX; the rays are the SIDES. The measure is the amount of OPENING (turn) between the rays, written in degrees, with one full turn = 360°.',
        'NAMING RULES — three letters with the VERTEX IN THE MIDDLE: ∠ABC or ∠CBA both name the angle with vertex B. The single-letter name ∠B is legal ONLY when exactly one angle sits at B. A number label like ∠1 is always safe.',
        'SIZE IS OPENING, NOT LENGTH — stretching the sides longer does not change the measure. Two angles drawn with sides of wildly different lengths can be congruent. Rays are infinite; only the spread between them is measured.',
        'THE FOUR CLASSES — ACUTE: between 0° and 90°. RIGHT: exactly 90° (mark it with a small square). OBTUSE: between 90° and 180°. STRAIGHT: exactly 180°, the two rays forming a line. (Beyond 180° is called a reflex angle.)',
        'THE PROTRACTOR\'S TWO SCALES — every protractor carries an inner and an outer scale running opposite directions. Read the scale whose 0 sits on YOUR ray. Reading the wrong one returns 180° minus the true measure, so a 140° angle gets recorded as 40°. Sanity-check against the classification: an obtuse-looking opening cannot read 40°.',
        'ANGLE ADDITION POSTULATE — if ray BD lies in the INTERIOR of ∠ABC, then m∠ABD + m∠DBC = m∠ABC. This is the angle twin of the Segment Addition Postulate, and it is what turns diagrams into equations.',
        'ANGLE BISECTOR — a ray from the vertex that cuts an angle into two congruent angles. If ray BD bisects ∠ABC, then m∠ABD = m∠DBC = half of m∠ABC. An interior ray is NOT a bisector unless you are told so or can prove it.',
        'CONGRUENT VS EQUAL — ∠A ≅ ∠B compares the FIGURES; m∠A = m∠B compares the NUMBERS. They say the same thing, but the ≅ symbol goes between angles and the = sign goes between measures. Writing ∠A = 40° is a notation slip; write m∠A = 40°.',
      ],
      vocabulary: [
        { term: 'vertex', definition: 'the common endpoint of the two rays that form an angle; the middle letter in a three-letter angle name.' },
        { term: 'angle bisector', definition: 'a ray from the vertex that divides an angle into two congruent angles.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-angle-addition',
      kind: 'worked_example',
      problem:
        'Ray QS lies in the interior of ∠PQR. m∠PQS = 34° and m∠SQR = 51°. Find m∠PQR and classify it.',
      steps: [
        'Check the naming: each angle has Q in the middle, so all three share vertex Q. Ray QS splits the big angle ∠PQR into two smaller ones.',
        'Because QS is INTERIOR, the Angle Addition Postulate applies: m∠PQS + m∠SQR = m∠PQR.',
        'Substitute the given measures: 34° + 51° = m∠PQR.',
        'Add: m∠PQR = 85°.',
        'Classify: 85° is less than 90°, so ∠PQR is acute. (Note that the two parts, 34° and 51°, are not equal — QS is an interior ray but NOT a bisector.)',
      ],
      answer: 'm∠PQR = 85°, an acute angle.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-protractor-scale',
      kind: 'worked_example',
      problem:
        'You set a protractor with its center hole on vertex Q. Ray QP passes through the 0 mark of the OUTER scale. Ray QR passes through a point where the outer scale reads 140 and the inner scale reads 40. A classmate records m∠PQR = 40°. Who is right, and how can you tell without re-measuring?',
      steps: [
        'Identify which scale is in play: the measurement always starts from the ray sitting on 0. Ray QP is on the 0 of the OUTER scale, so the OUTER scale is the one to read.',
        'Read ray QR on that same scale: the outer scale says 140. So m∠PQR = 140°.',
        'Diagnose the classmate\'s 40°: they read the inner scale, whose 0 sits on the opposite side. The two scales always sum to 180 at any mark — 40 + 140 = 180 — so the wrong scale hands back the supplement, not the angle.',
        'Sanity-check with classification: 140° is obtuse and 40° is acute, and an angle cannot be both. Whenever the two candidate readings disagree, decide first whether the opening is bigger or smaller than a square corner, then keep the reading that matches.',
      ],
      answer: 'm∠PQR = 140°. The classmate read the scale whose 0 was not on ray QP, so they reported the supplement, 180° - 140° = 40°.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-naming',
      kind: 'try_yourself',
      problem:
        'Rays BA, BD, and BC all have endpoint B, and ray BD lies in the interior of ∠ABC. Which is a correct and unambiguous name for the angle formed by rays BA and BD?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '∠ABD', correct: true },
        { id: 'b', text: '∠B' },
        { id: 'c', text: '∠ADB' },
        { id: 'd', text: '∠BAD' },
      ],
      expectedAnswer: '∠ABD',
      hints: [
        'In a three-letter name, which position holds the vertex?',
        'Three different angles sit at vertex B, so ∠B does not say which one you mean — and the vertex B must be the MIDDLE letter.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bisector',
      kind: 'try_yourself',
      problem:
        'Ray KM bisects ∠JKL. m∠JKM = (3x + 5)° and m∠MKL = (x + 25)°. What is m∠JKL?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '70°', correct: true },
        { id: 'b', text: '35°' },
        { id: 'c', text: '10°' },
        { id: 'd', text: '140°' },
      ],
      expectedAnswer: '70°',
      hints: [
        'A bisector makes the two halves congruent, so set the two expressions equal and solve for x.',
        'x = 10 makes each half 35°. The question asks for the WHOLE angle ∠JKL, not one half and not x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Ray BD lies in the interior of ∠ABC. m∠ABD = (2x + 10)°, m∠DBC = (3x)°, and m∠ABC = 85°. Solve for x and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '15',
      hints: [
        'Interior ray → Angle Addition Postulate: (2x + 10) + 3x = 85.',
        'Combine like terms to 5x + 10 = 85, subtract 10, then divide by 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ray-length',
      kind: 'misconception_check',
      question:
        'Two angles are drawn on the board. ∠ABC has sides drawn 10 cm long; ∠DEF has sides drawn 3 cm long, but both openings are 50°. A student says ∠ABC is the bigger angle. What went wrong?',
      commonErrors: [
        {
          answer: '∠ABC is bigger because its sides are longer',
          misconception: 'Measuring the angle by the length of its drawn sides instead of by the opening between them.',
          correctsTo:
            'The sides of an angle are RAYS — they go on forever, and the drawn length is just how much of them fits on the board. Angle measure is the amount of turn from one ray to the other, so m∠ABC = m∠DEF = 50° and ∠ABC ≅ ∠DEF.',
        },
        {
          answer: 'Write ∠ABC = 50° to record the measurement',
          misconception: 'Collapsing the figure and its measure into one symbol.',
          correctsTo:
            'An angle is a figure and cannot equal a number. Write m∠ABC = 50° when you mean the measure, and ∠ABC ≅ ∠DEF when you mean the two figures match.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Name angles with the vertex in the MIDDLE (∠ABC); use ∠B only when one angle sits at B.',
        'Measure is opening, not side length: acute < 90°, right = 90°, obtuse between 90° and 180°, straight = 180°.',
        'On a protractor, read the scale whose 0 is on your ray — the other scale gives 180° minus the true measure.',
        'Angle Addition Postulate: an interior ray splits the angle, m∠ABD + m∠DBC = m∠ABC. A bisector splits it into two CONGRUENT halves — never assume one without being told.',
        'Angles are ≅ to each other; their measures are = to each other.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Angles & Angle Measure' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
