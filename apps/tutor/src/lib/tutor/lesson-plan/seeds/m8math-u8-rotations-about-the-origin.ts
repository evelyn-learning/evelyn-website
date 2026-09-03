/**
 * Grade 8 Math — Transformations, Congruence & Similarity: Rotations About
 * the Origin.
 *
 * PROCEDURE-LED row 8.2. The student already translates and reflects whole
 * figures with coordinate rules (row 8.1); what is new is the turn. The
 * concept segment installs an ordered method rather than a mental model:
 * confirm the direction (counterclockwise unless told otherwise), pick the
 * one rule for the angle, apply it to EVERY vertex, then check with the
 * quadrant the image should land in and by running the inverse turn on one
 * image vertex to recover the original (CCSS 8.G.A.1, 8.G.A.3). Both worked
 * examples run the same moves; the second also reads a rotation OFF a
 * preimage/image pair by testing the three rules against one vertex. Two
 * traps this plan is built to kill: using the clockwise quarter-turn rule
 * when the instruction says counterclockwise, and negating both coordinates
 * for a quarter turn (that is the half-turn rule).
 *
 * SCOPE GUARD: Rotate figures 90°, 180° and 270° about the origin
 * (counterclockwise convention) with coordinate rules ((x, y) → (-y, x),
 * (-x, -y), (y, -x)), verify the preserved properties, and identify a
 * rotation from a preimage/image pair. Withholds: rotations about other
 * centers and the translate-rotate-translate-back method →
 * `geom-u4-rotations.ts`; compositions and symmetry →
 * `geom-u4-compositions-symmetry.ts`. Concretely: every coordinate-plane
 * rotation in this plan has its center at the origin, and no figure is ever
 * turned about a vertex or any other point (the skate spins and the puzzle
 * piece in the hook are physical pictures of turning, not coordinate
 * rotations); no two motions are ever chained, and no figure is checked for
 * symmetry; the plan makes no orientation argument and never reasons about
 * which way a figure faces. The counterclockwise convention is stated before
 * any rule is used, so every rule and instruction is read counterclockwise
 * unless it says clockwise, and a clockwise turn appears only as a
 * conversion (90° clockwise is the same landing as 270° counterclockwise).
 * Sideways: the plan never describes a sequence of motions between two
 * figures and never decides congruence from coordinates (row 8.3), and never
 * dilates (row 8.4); translations and reflections (row 8.1) are assumed and
 * recalled only as rigid motions the student already owns, and a reflection
 * across the y-axis appears as a distractor a student must rule OUT when
 * naming a rotation, never as something taught. Preserved lengths are
 * verified only on horizontal and vertical sides, by counting units, because
 * the length of a slanted side is Unit 9 material and is never computed
 * here. Below, assumed and not re-taught: plotting points and reflecting
 * single points across the axes (`m6math` rows 6.1 and 6.2). Salvaged from
 * `g8-math-transformations.ts`: the "rotations turn" framing and the 90° and
 * 180° rule examples only.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U8_ROTATIONS_ABOUT_THE_ORIGIN: LessonPlan = {
  id: 'evelyn.ms.m8math.rotations-about-the-origin.v1',
  title: 'Rotations About the Origin',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.rotations-about-the-origin',
      standard: 'M8MATH-8.2',
      description:
        'Rotate figures 90°, 180° and 270° about the origin (counterclockwise convention) with coordinate rules ((x, y) → (-y, x), (-x, -y), (y, -x)), verify the preserved properties, and identify a rotation from a preimage/image pair (CCSS 8.G.A.1, 8.G.A.3).',
    },
  ],
  prerequisites: ['m8math.translations-and-reflections'],
  followUps: ['m8math.congruence-through-rigid-motions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect the turns a student already names in degrees to a figure pinned at the origin, so the coordinate rules have a physical picture to land on.',
      script:
        'Skaters name their spins by degrees. A 180 turns you around to ride backward, a 360 brings you all the way back to where you started, and a 90 is a quarter turn. In a block-stacking puzzle game, the rotate button does the same thing to a piece: the piece turns a quarter turn around one fixed block, and every other block swings around it. Now put a paper triangle on a coordinate plane, push a pin through the origin, and spin the triangle a quarter turn counterclockwise. The pin does not move, but every corner does, and each corner lands on a new pair of coordinates. Today you learn the three rules that tell you exactly where each corner lands after a quarter turn, a half turn, and a three-quarter turn, which direction counts as the standard direction, and how to look at a before-and-after picture and name the turn that happened.',
      suggestedTools: ['show_coordinate_plane'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-rules-one-direction',
      kind: 'concept',
      goal: 'Install the direction convention, the three coordinate rules for turns about the origin, the quadrant check, the preserved-property list, and the method for reading a rotation off a pair of figures.',
      keyIdeas: [
        'A ROTATION IS A TURN ABOUT A FIXED POINT — the fixed point is the center of rotation, and in this lesson the center is always the origin, (0, 0). Every point of the figure swings around the origin and stays exactly as far from the origin as it was; the origin itself does not move. The angle says how far: 90° is a quarter turn, 180° is a half turn, and 270° is three quarters of a turn.',
        'COUNTERCLOCKWISE IS THE STANDARD DIRECTION — unless a problem says clockwise, a rotation turns counterclockwise, the opposite of the way the hands of a clock move. Every rule below is for counterclockwise turns. A clockwise turn is just a counterclockwise turn of a different size: 90° clockwise lands in the same place as 270° counterclockwise, 270° clockwise lands where 90° counterclockwise does, and 180° lands in the same place either way.',
        'THREE RULES, ONE FOR EACH TURN — 90°: (x, y) becomes (-y, x). 180°: (x, y) becomes (-x, -y). 270°: (x, y) becomes (y, -x). Take the point (3, 1): a 90° turn sends it to (-1, 3), a 180° turn sends it to (-3, -1), and a 270° turn sends it to (1, -3). The two quarter turns SWAP the coordinates and flip the sign of exactly one of them; the half turn swaps nothing and flips both signs. Apply the one rule you chose to every vertex, not just the first.',
        'CHECK THE LANDING QUADRANT — a point in quadrant I turns counterclockwise into quadrant II after 90°, into quadrant III after 180°, and into quadrant IV after 270°. So (3, 1), which sits in quadrant I, must land at negative x and positive y after a 90° turn, and (-1, 3) does. The fastest check of all is a point on an axis: (3, 0) on the positive x-axis turns 90° to (0, 3) on the positive y-axis, and the x-axis swinging up into the y-axis IS a counterclockwise turn.',
        'WHAT A ROTATION KEEPS — a rotation is a rigid motion, like the translations and reflections you already use. Lines stay lines, every side keeps its length, every angle keeps its measure, and sides that were parallel stay parallel, so the image is congruent to the original figure. What changes is only where the figure sits and which way it is turned. You can verify a kept length on a horizontal or vertical side by counting units before and after the turn.',
        'READ THE TURN OFF A PAIR — given a figure and its image, take one vertex and compare it with its image. If both coordinates flipped sign and nothing swapped, the turn was 180°. If the coordinates swapped, test the two quarter-turn rules on that vertex: the one that produces the image point names the turn, 90° for (-y, x) and 270° for (y, -x). Then confirm with a second vertex, because one vertex can agree with a rule by accident.',
      ],
      vocabulary: [
        { term: 'rotation', definition: 'a turn of a figure about a fixed point through a stated angle.' },
        { term: 'center of rotation', definition: 'the fixed point the figure turns around; in this lesson it is always the origin, (0, 0).' },
        { term: 'counterclockwise', definition: 'the standard direction for a rotation, opposite to the way the hands of a clock move.' },
        { term: 'preimage and image', definition: 'the figure before the turn and the figure after it; an image vertex is marked with a prime, so A turns into A-prime.' },
      ],
      suggestedTools: ['show_coordinate_plane', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-quarter-turn-triangle',
      kind: 'worked_example',
      problem:
        'Triangle ABC has vertices A(2, 1), B(5, 1) and C(5, 5). Rotate it 90° counterclockwise about the origin, give the image vertices, and verify that the side lengths and the right angle are preserved.',
      steps: [
        'Confirm the direction and pick the rule. The instruction says counterclockwise, the angle is 90°, so the rule is (x, y) becomes (-y, x): the y-coordinate moves to the front with its sign flipped, and the old x-coordinate moves to the back.',
        'Apply the rule to every vertex. A(2, 1) becomes (-1, 2). B(5, 1) becomes (-1, 5). C(5, 5) becomes (-5, 5). Write them as A-prime (-1, 2), B-prime (-1, 5), C-prime (-5, 5).',
        'Check the landing quadrant. A(2, 1) sits in quadrant I, and a quarter turn counterclockwise should carry it into quadrant II, where x is negative and y is positive. A-prime (-1, 2) is in quadrant II, so the direction is right.',
        'Check by working backward. A 270° turn undoes a 90° turn, and its rule is (x, y) becomes (y, -x). Apply it to A-prime (-1, 2): (2, 1), which is A. The rule was applied correctly.',
        'Verify the preserved lengths on the horizontal and vertical sides by counting units. Side AB runs from x = 2 to x = 5 at height 1, so AB is 3 units long. Its image A-prime B-prime runs from y = 2 to y = 5 at x = -1, so it is 3 units long. Side BC runs from y = 1 to y = 5 at x = 5, so BC is 4 units long. Its image B-prime C-prime runs from x = -1 to x = -5 at height 5, so it is 4 units long.',
        'Verify the angle. At B, the horizontal side AB meets the vertical side BC, so angle B is a right angle. At B-prime, the vertical side A-prime B-prime meets the horizontal side B-prime C-prime, so angle B-prime is also a right angle. The triangle turned, but nothing about its size or shape changed.',
      ],
      answer: 'A-prime (-1, 2), B-prime (-1, 5), C-prime (-5, 5); AB and A-prime B-prime are both 3 units, BC and B-prime C-prime are both 4 units, and the right angle at B is still a right angle at B-prime',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-half-turn-and-identify',
      kind: 'worked_example',
      problem:
        'Triangle DEF has vertices D(-3, 2), E(-1, 2) and F(-1, 6). (a) Rotate it 180° about the origin. (b) A second image of the same triangle has vertices (2, 3), (2, 1) and (6, 1). Which rotation about the origin produced it?',
      steps: [
        '(a) The angle is 180°, so the rule is (x, y) becomes (-x, -y): flip both signs, swap nothing. D(-3, 2) becomes (3, -2). E(-1, 2) becomes (1, -2). F(-1, 6) becomes (1, -6).',
        'Check a length. DE runs from x = -3 to x = -1 at height 2, so DE is 2 units. D-prime E-prime runs from x = 1 to x = 3 at height -2, so it is 2 units as well. EF runs from y = 2 to y = 6 at x = -1, so EF is 4 units, and E-prime F-prime runs from y = -6 to y = -2 at x = 1, also 4 units. Lengths preserved.',
        '(b) Compare D(-3, 2) with its image (2, 3). The coordinates swapped places, so this is a quarter turn, and the only question is which one.',
        'WRONG: seeing that the coordinates swapped and answering 90° without testing the rule. CORRECT: test it. The 90° rule (-y, x) sends D(-3, 2) to (-2, -3), which is not the image point. The 270° rule (y, -x) sends D(-3, 2) to (2, 3), which is. So the turn was 270° counterclockwise, which is the same landing as 90° clockwise.',
        'Confirm with a second vertex, because one match could be luck. The 270° rule sends E(-1, 2) to (2, 1) and F(-1, 6) to (6, 1), and both match the given image. The rotation is 270° counterclockwise about the origin.',
        'Check the quadrant. D(-3, 2) sits in quadrant II. Three quarter turns counterclockwise carry quadrant II to quadrant III, then IV, then I. The image (2, 3) is in quadrant I, so a 270° turn is exactly what the picture shows.',
      ],
      answer: '(a) D-prime (3, -2), E-prime (1, -2), F-prime (1, -6); (b) a rotation of 270° counterclockwise about the origin',
      estimatedMinutes: 3,
    },
    {
      id: 'try-quarter-turn-point',
      kind: 'try_yourself',
      problem: 'The vertex (4, -2) of a figure is rotated 90° counterclockwise about the origin. Where does it land?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(-4, 2)' },
        { id: 'b', text: '(-2, -4)' },
        { id: 'c', text: '(2, 4)', correct: true },
        { id: 'd', text: '(-2, 4)' },
      ],
      expectedAnswer: '(2, 4)',
      hints: [
        'A 90° turn swaps the coordinates and flips the sign of exactly one of them. The rule is (x, y) becomes (-y, x), so start by writing the old y-coordinate first with its sign flipped.',
        'Here y is -2, so the new x-coordinate is -(-2) = 2, and the old x-coordinate, 4, becomes the new y-coordinate. Check the quadrant: (4, -2) is in quadrant IV, and a quarter turn counterclockwise from quadrant IV lands in quadrant I.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-the-turn',
      kind: 'try_yourself',
      problem:
        'Triangle JKL has vertices J(2, 5), K(6, 5) and L(6, 8). Its image has vertices J-prime (-2, -5), K-prime (-6, -5) and L-prime (-6, -8). Which single transformation maps JKL onto its image?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A rotation of 180° about the origin', correct: true },
        { id: 'b', text: 'A rotation of 90° counterclockwise about the origin' },
        { id: 'c', text: 'A rotation of 270° counterclockwise about the origin' },
        { id: 'd', text: 'A reflection across the y-axis' },
      ],
      expectedAnswer: 'A rotation of 180° about the origin',
      hints: [
        'Compare J(2, 5) with J-prime (-2, -5). Did the coordinates swap places, or did they stay in order? Did one sign flip, or both?',
        'Both signs flipped and nothing swapped, which is the (-x, -y) rule. A quarter turn would have swapped the coordinates, and a reflection across the y-axis would have flipped only the x-coordinate. Confirm with K: (6, 5) to (-6, -5).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-three-quarter-turn',
      kind: 'try_yourself',
      problem:
        'Vertex N(-5, 3) of a rectangle is rotated 270° counterclockwise about the origin. What is the y-coordinate of N-prime, the image of N? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'The 270° rule is (x, y) becomes (y, -x). The old y-coordinate moves to the front unchanged, and the old x-coordinate moves to the back with its sign flipped.',
        'The old x-coordinate is -5, and flipping its sign gives -(-5). That value is the new y-coordinate. Check the quadrant: (-5, 3) is in quadrant II, and three quarter turns counterclockwise from quadrant II land in quadrant I, where both coordinates are positive.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-clockwise-and-double-flip',
      kind: 'misconception_check',
      question:
        'Two students rotate the point (2, 6) by 90° counterclockwise about the origin. Ana writes (6, -2) and Theo writes (-2, -6). The correct image is (-6, 2). What went wrong in each case?',
      commonErrors: [
        {
          answer: '(6, -2)',
          misconception: 'Using the clockwise quarter-turn rule (y, -x) when the instruction says counterclockwise, which turns the point the wrong way.',
          correctsTo:
            'Counterclockwise is the standard direction, and the 90° counterclockwise rule is (x, y) becomes (-y, x), so (2, 6) becomes (-6, 2). The quadrant check exposes the slip: (2, 6) sits in quadrant I, and a quarter turn counterclockwise lands in quadrant II, where x is negative and y is positive. (-6, 2) is in quadrant II. (6, -2) is in quadrant IV, which is where a CLOCKWISE quarter turn lands. That rule, (y, -x), belongs to the 270° counterclockwise turn.',
        },
        {
          answer: '(-2, -6)',
          misconception: 'Flipping the sign of both coordinates without swapping them, which is the 180° rule, not the 90° rule.',
          correctsTo:
            'A quarter turn always SWAPS the two coordinates and flips exactly one sign. Flipping both signs with no swap is the half-turn rule, so (-2, -6) is where (2, 6) lands after 180°, not 90°. The fastest way to see it is a point on an axis: (2, 0) turned 90° counterclockwise lands on the positive y-axis at (0, 2), and the coordinates clearly traded places. Flipping both signs would send (2, 0) to (-2, 0), straight across the origin, which is a half turn. For (2, 6), swap to get (6, 2), then flip the sign of the new first coordinate: (-6, 2).',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A rotation turns a figure about a fixed center; in this lesson the center is always the origin, and the origin is the one point that does not move.',
        'Counterclockwise is the standard direction. 90° clockwise lands where 270° counterclockwise does, and 180° is the same either way.',
        'The three rules about the origin: 90° sends (x, y) to (-y, x); 180° sends (x, y) to (-x, -y); 270° sends (x, y) to (y, -x). Apply the one rule to every vertex.',
        'A quarter turn swaps the coordinates and flips exactly one sign; a half turn swaps nothing and flips both.',
        'Check the landing quadrant: counterclockwise carries quadrant I to II, then III, then IV. A point on an axis is the quickest test of direction.',
        'A rotation preserves side lengths, angle measures and parallel sides, so the image is congruent to the original.',
        'To name a rotation from a preimage/image pair, test the three rules on one vertex, then confirm with a second vertex.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Rotations About the Origin' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
