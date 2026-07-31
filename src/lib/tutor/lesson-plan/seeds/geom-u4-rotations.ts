/**
 * Geometry — Transformations: Rotations.
 *
 * The third rigid motion (CCSS G-CO.A.2, G-CO.A.4, G-CO.A.5): a turn about
 * a fixed center by a directed angle. Rotations preserve orientation — the
 * feature that separates them from reflections — and the whole lesson lives
 * or dies on two disciplines: naming the DIRECTION and honoring the CENTER.
 * Non-origin centers are taught as translate-rotate-translate-back.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U4_ROTATIONS: LessonPlan = {
  id: 'evelyn.hs.geom.rotations.v1',
  title: 'Rotations',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.rotations',
      standard: 'GEOM-4.3',
      description:
        'Rotate figures about a given center through 90°, 180°, and 270°, using coordinate rules about the origin and the translate-rotate-translate-back method for other centers, and explain why a rotation is a rigid motion that preserves orientation (CCSS G-CO.A.2, G-CO.A.4, G-CO.A.5).',
    },
  ],
  prerequisites: ['geom.reflections'],
  followUps: ['geom.compositions-symmetry'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame rotation as the move that builds everything arranged around a center — wheels, gears, logos, tile patterns.',
      script:
        'Look at a Ferris wheel, a car rim, a turbine, or the petals stamped around the center of a tile: somebody drew ONE piece and turned it. That turn is a rotation, and it is described by exactly three things — where the center is, how far you turn, and which way. Get any one of those three wrong and the copy lands somewhere it should not. Today you learn the coordinate rules for the quarter, half, and three-quarter turns, and how to rotate about a center that is nowhere near the origin.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rotations',
      kind: 'concept',
      goal: 'Center, directed angle, the three origin rules, the non-origin method, and the direction traps.',
      keyIdeas: [
        'WHAT A ROTATION IS — a turn of every point about a fixed CENTER through a given ANGLE. Each point travels along a circular arc, and its distance from the center never changes. Notation: R(P, 90°) means "rotate 90° about center P".',
        'THREE THINGS DEFINE IT — center, angle, direction. Missing any one makes the instruction ambiguous: "rotate 90°" is not an answer until you say about WHAT and which WAY.',
        'DIRECTION CONVENTION — counterclockwise is POSITIVE, clockwise is NEGATIVE. A full turn is 360°, so every clockwise turn has a counterclockwise twin: 90° clockwise = 270° counterclockwise, and 180° is the same either way.',
        'THE ORIGIN RULES — about the origin: 90° counterclockwise (x, y) → (-y, x); 180° (x, y) → (-x, -y); 270° counterclockwise (x, y) → (y, -x). The two quarter-turns both SWAP the coordinates and negate exactly ONE of them — which one is the whole difference between them.',
        'CENTER IS THE ONLY FIXED POINT — the center maps to itself and nothing else does (short of a full 360° turn). The center does not have to be the origin, and it does not have to sit inside the figure — it can be a vertex, a midpoint, or a point off in space.',
        'ANY CENTER, THREE STEPS — to rotate about center (a, b): subtract the center from each point, apply the origin rule, then add the center back. For a 180° turn this collapses to a shortcut: the image of (x, y) is (2a - x, 2b - y), because the center is the midpoint of every point and its image.',
        'RIGID MOTION, ORIENTATION KEPT — rotations preserve segment lengths, angle measures, and parallelism, so the image is CONGRUENT to the preimage. Unlike a reflection, a rotation does NOT reverse orientation: a clockwise-lettered triangle stays clockwise-lettered.',
        'CLASSIC ERRORS — using the counterclockwise rule for a clockwise turn (the two quarter-turn rules get swapped); negating both coordinates for a 90° turn (that is the 180° rule); and applying an origin rule when the center is not the origin, which drags the center itself off its own spot.',
      ],
      vocabulary: [
        { term: 'center of rotation', definition: 'the fixed point every other point turns around — the only point that maps to itself.' },
        { term: 'angle of rotation', definition: 'the directed turn amount, counterclockwise when positive and clockwise when negative.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-quarter-turn-origin',
      kind: 'worked_example',
      problem:
        'Triangle ABC has vertices A(1, 2), B(4, 2), and C(1, 6). Rotate △ABC 90° counterclockwise about the origin and give the coordinates of the image △A′B′C′.',
      steps: [
        'Pick the rule for the named turn: 90° counterclockwise about the origin is (x, y) → (-y, x) — swap the coordinates, then negate the new first coordinate.',
        'A(1, 2) → (-2, 1). Swap gives (2, 1); negating the first entry gives (-2, 1).',
        'B(4, 2) → (-2, 4), and C(1, 6) → (-6, 1). Apply the same rule to every vertex — never mix rules within one rotation.',
        'Check that the motion is rigid: A is √5 from the origin and A′(-2, 1) is also √5 from the origin, and leg AB had length 3 while A′B′ runs from (-2, 1) to (-2, 4), length 3. ✓ Lengths preserved.',
      ],
      answer: 'A′(-2, 1), B′(-2, 4), C′(-6, 1)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-clockwise-trap',
      kind: 'worked_example',
      problem:
        'A student rotates P(5, -3) 90° CLOCKWISE about the origin, writes (x, y) → (-y, x), and reports the image (3, 5). Find the correct image and explain the error.',
      steps: [
        'Diagnose the rule: (x, y) → (-y, x) is the 90° COUNTERclockwise rule. The student grabbed the wrong twin.',
        'Convert the direction so a known rule applies: 90° clockwise is the same turn as 270° counterclockwise, whose rule is (x, y) → (y, -x).',
        'Apply it: P(5, -3) → (-3, -5). Swap to get (-3, 5), then negate the new second coordinate.',
        'Sanity-check with the quadrants: P(5, -3) sits in Quadrant IV, and a quarter turn clockwise from Quadrant IV lands in Quadrant III, where both coordinates are negative. The student\'s (3, 5) is in Quadrant I — a counterclockwise landing, which is exactly the tell.',
      ],
      answer: 'P′(-3, -5) — the student used the counterclockwise rule (-y, x) instead of the clockwise rule (y, -x)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-quarter-turn',
      kind: 'try_yourself',
      problem: 'What is the image of the point (-4, 7) after a rotation of 90° counterclockwise about the origin?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(-7, -4)', correct: true },
        { id: 'b', text: '(7, 4)' },
        { id: 'c', text: '(4, -7)' },
        { id: 'd', text: '(7, -4)' },
      ],
      expectedAnswer: '(-7, -4)',
      hints: [
        '90° counterclockwise about the origin: (x, y) → (-y, x).',
        'Swap to get (7, -4), then negate the first coordinate.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-direction-equivalence',
      kind: 'try_yourself',
      problem: 'A rotation of 270° counterclockwise about the origin produces the same image as which rotation about the origin?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '90° clockwise', correct: true },
        { id: 'b', text: '90° counterclockwise' },
        { id: 'c', text: '270° clockwise' },
        { id: 'd', text: '180° clockwise' },
      ],
      expectedAnswer: '90° clockwise',
      hints: [
        'A full turn is 360°, so turning 270° one way lands where turning 360° - 270° the other way lands.',
        '360° - 270° = 90°, and the direction reverses.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Point Q(6, 3) is rotated 180° about the center (2, 1). What is the x-coordinate of the image Q′? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-2',
      hints: [
        'For a 180° turn the center is the MIDPOINT of Q and Q′, so the image of (x, y) is (2a - x, 2b - y) with center (a, b).',
        'x-coordinate: 2(2) - 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-center-moved',
      kind: 'misconception_check',
      question:
        'To rotate △ABC with A(3, 1), B(7, 1), C(3, 4) by 90° counterclockwise ABOUT VERTEX A, a student applies (x, y) → (-y, x) to all three vertices and gets A′(-1, 3), B′(-1, 7), C′(-4, 3). Why is that wrong?',
      commonErrors: [
        {
          answer: 'A′(-1, 3), B′(-1, 7), C′(-4, 3)',
          misconception: 'Using the origin coordinate rule when the center of rotation is not the origin — which moves the center itself.',
          correctsTo:
            'The center is the ONE point that must stay put, so A′ has to be A(3, 1) — the moment A moves, the work is wrong. Shift so the center becomes the origin (subtract A: B → (4, 0), C → (0, 3)), apply (x, y) → (-y, x) (B → (0, 4), C → (-3, 0)), then add A back: A′(3, 1), B′(3, 5), C′(0, 1).',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A rotation needs all three: center, angle, and direction — counterclockwise is positive, clockwise is negative.',
        'About the origin: 90° counterclockwise (x, y) → (-y, x); 180° (x, y) → (-x, -y); 270° counterclockwise (x, y) → (y, -x).',
        'Non-origin center (a, b): subtract the center, apply the origin rule, add the center back. The center never moves.',
        'Rotations are rigid motions — lengths and angles are preserved, the image is congruent, and orientation is NOT reversed (that is the reflection\'s job).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Rotations' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
