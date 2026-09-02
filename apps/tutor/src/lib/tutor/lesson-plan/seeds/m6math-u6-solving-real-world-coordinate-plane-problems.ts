/**
 * Grade 6 Math — The Coordinate Plane: Real-World Coordinate Plane Problems.
 *
 * CONCEPT-LED fan-out lesson closing Unit 6. Plotting points in all four
 * quadrants (6.1), reflecting points across the axes (6.2), and finding the
 * distance between two points that share a coordinate (6.3) are all already
 * taught. This lesson does not reteach any of those mechanics; its own skill
 * is MODELLING -- reading a written real-world situation onto a coordinate
 * grid, and using the graphed points to answer the question actually being
 * asked (CCSS 6.NS.C.8). One context, a neighborhood scavenger hunt, runs
 * through the whole plan so the modelling is the difficulty, not the reading.
 * Two traps this plan is built to kill: assigning a coordinate's sign from
 * its position in a sentence instead of from its direction word, and adding
 * two coordinate values on reflex without first checking whether the two
 * points sit on the same side of the shared axis or on opposite sides of it.
 *
 * SCOPE GUARD: This lesson APPLIES three already-taught Unit 6 skills
 * (plotting in all four quadrants, reading a quadrant from coordinate signs,
 * and finding the distance between two points that share a coordinate); it
 * teaches none of those mechanics from scratch. No arithmetic is ever
 * performed ON a signed coordinate itself -- coordinates are placed, read,
 * and compared only by their sign and their quadrant, never added,
 * subtracted, or multiplied together as signed numbers. That escalation
 * (integer arithmetic) is Grade 7, m7math U1-U2, and does not appear here.
 * The one addition/subtraction that does appear is row 6.3's own distance
 * count, reused rather than retaught: once two points share a coordinate,
 * their DISTANCES FROM ZERO -- always non-negative block counts, never the
 * signed coordinates themselves -- are added when the two points sit on
 * opposite sides of the shared axis, and subtracted when they sit on the
 * same side. Every distance in this plan is computed only between two
 * points that share a coordinate; no distance here needs the Pythagorean
 * theorem, which is Grade 8 and does not appear.
 *
 * NOTE ON prerequisites/followUps: per the fan-out contract's chain table,
 * this row's real neighbors are 6.3 (finding-distance-between-points) and
 * 7.1 (numerical-expressions-with-exponents). Neither is registered on disk
 * yet at authoring time, but the controller wires and lints the full
 * 40-row chain in one batched commit, so both slugs are written in now
 * rather than left empty.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U6_SOLVING_REAL_WORLD_COORDINATE_PLANE_PROBLEMS: LessonPlan = {
  id: 'evelyn.ms.m6math.solving-real-world-coordinate-plane-problems.v1',
  title: 'Real-World Coordinate Plane Problems',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.solving-real-world-coordinate-plane-problems',
      standard: 'M6MATH-6.4',
      description:
        'Solve real-world and mathematical problems by graphing points in all four quadrants of the coordinate plane (CCSS 6.NS.C.8).',
    },
  ],
  prerequisites: ['m6math.finding-distance-between-points'],
  followUps: ['m6math.numerical-expressions-with-exponents'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: "Frame the whole lesson as turning a written real-world clue into a coordinate point, then using that point to answer the team's real question.",
      script:
        "Every spring, your class holds a neighborhood scavenger hunt in Riverside. The hunt organizer hands each team a grid map with Town Square marked as the center, and a list of written clues, like \"the flag is 4 blocks east and 3 blocks south of Town Square.\" Reading a clue is not the hard part. Turning that clue into an exact point on the grid, and then using the map to answer the team's real question, like which street two flags share or how far apart they sit, that is the skill that wins the hunt. Today you are the team captain.",
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mapping-clues-to-points',
      kind: 'concept',
      goal: 'Give the student a reliable method for translating a real-world direction into an ordered pair, and for reading graphed points back into real-world answers.',
      keyIdeas: [
        'TURN THE CLUE INTO AN ORDERED PAIR, IN ORDER -- "4 blocks east and 3 blocks south of Town Square" becomes the point (4, -3). The east-west number becomes the x-coordinate and comes first, exactly like the order of an ordered pair (x, y).',
        'EAST AND NORTH ARE POSITIVE; WEST AND SOUTH ARE NEGATIVE -- on the Riverside map, Elm Street is the x-axis and Oak Avenue is the y-axis. East of Town Square gives a positive x-coordinate, and west gives a negative one. North gives a positive y-coordinate, and south gives a negative one. Get the sign from the direction word every time, never from where the number sits in the sentence.',
        'THE SIGNS ALONE NAME THE QUADRANT -- before plotting exactly, (positive, positive) sits northeast of Town Square, (negative, positive) sits northwest, (negative, negative) sits southwest, and (positive, negative) sits southeast. Checking the signs first catches a plotting mistake before it happens.',
        'A SHARED COORDINATE MEANS A SHARED STREET -- two flags with the same x-coordinate sit on the same north-south street, one straight up or down the map from the other. Two flags with the same y-coordinate sit on the same east-west street. Spotting the shared coordinate is what tells you two flags can be compared by counting blocks along one street.',
        'COUNT ALONG THE SHARED STREET TO FIND THE DISTANCE -- once two points share a coordinate, compare their other coordinate. If both values sit on the same side of zero, subtract the smaller distance from the larger one. If they sit on opposite sides of zero, add the two distances from zero instead. Either way, the answer is a distance, so it is never negative.',
      ],
      vocabulary: [
        { term: 'ordered pair', definition: 'a pair of numbers written (x, y) that names one exact point, with the x-coordinate first and the y-coordinate second.' },
        { term: 'quadrant', definition: 'one of the four regions the x-axis and y-axis divide the coordinate plane into, identified by the signs of the coordinates in it.' },
        { term: 'origin', definition: 'the point (0, 0), where the x-axis and y-axis cross. On the Riverside map, this is Town Square.' },
      ],
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-clue-to-point-and-quadrant',
      kind: 'worked_example',
      problem:
        'Team Red\'s clue says: "Flag 1 is 4 blocks east of Town Square and 3 blocks south." Team Blue\'s clue says: "Flag 2 is 4 blocks east of Town Square and 5 blocks north." Write each flag as an ordered pair, and name which quadrant each one sits in.',
      steps: [
        'Town Square is the origin, (0, 0). On the Riverside map, east is the positive x-direction and south is the negative y-direction.',
        'Flag 1: 4 blocks east gives x = 4. 3 blocks south gives y = -3. Flag 1 = (4, -3).',
        'Flag 2: 4 blocks east gives x = 4. 5 blocks north gives y = 5. Flag 2 = (4, 5).',
        'WRONG: writing Flag 1 as (-4, -3), making east negative because the clue felt like it was moving away from Town Square. CORRECT: east is always the positive x-direction on this map, for every flag. Only west gives a negative x-coordinate.',
        'Check the quadrant from the signs alone. Flag 1 is (positive, negative), so it sits southeast of Town Square, in Quadrant IV. Flag 2 is (positive, positive), so it sits northeast of Town Square, in Quadrant I.',
        'Notice both flags share the same x-coordinate, 4. That means Flag 1 and Flag 2 sit on the very same north-south street, four blocks east of Town Square, with one flag south of Town Square and the other north of it.',
      ],
      answer: 'Flag 1 = (4, -3), Quadrant IV. Flag 2 = (4, 5), Quadrant I.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-distance-along-shared-street',
      kind: 'worked_example',
      problem:
        'Flag 1 and Flag 2 sit on the same street at (4, -3) and (4, 5). On a different street, three blocks west of Town Square, Flag 3 is at (-3, 6) and Flag 4 is at (-3, 2). Find how many blocks apart each pair of flags is, walking straight along their shared street.',
      steps: [
        'Flag 1 and Flag 2 share the x-coordinate 4, so compare their y-coordinates: -3 and 5. One is negative and one is positive, so these two points sit on OPPOSITE sides of Town Square\'s east-west street. Add their distances from zero: 3 + 5 = 8 blocks.',
        'Flag 3 and Flag 4 share the x-coordinate -3, so compare their y-coordinates: 6 and 2. Both are positive, so these two points sit on the SAME side of Town Square\'s east-west street. Subtract the smaller distance from the larger one instead of adding: 6 - 2 = 4 blocks.',
        'WRONG: subtracting for Flag 1 and Flag 2 the same way, 5 - 3 = 2 blocks. CORRECT: subtracting only works when both points sit on the same side of zero. Flag 1 and Flag 2 sit on opposite sides (-3 and 5), so their distances from zero must be added, not subtracted: 3 + 5 = 8 blocks.',
        'Check both answers by counting on the street. From -3 up through 0 to 5 is 3 blocks plus 5 blocks, which is 8. From 2 up to 6 is 4 blocks, counted directly, since that hop never crosses zero.',
      ],
      answer: 'Flag 1 to Flag 2: 8 blocks. Flag 3 to Flag 4: 4 blocks.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-clue-to-ordered-pair',
      kind: 'try_yourself',
      problem:
        'Team Green\'s clue says: "The prize flag sits 5 blocks west of Town Square and 3 blocks north." Which ordered pair matches the flag\'s location?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(5, 3)' },
        { id: 'b', text: '(-5, -3)' },
        { id: 'c', text: '(-5, 3)', correct: true },
        { id: 'd', text: '(3, -5)' },
      ],
      expectedAnswer: '(-5, 3)',
      hints: [
        'West is the negative x-direction on this map, and north is the positive y-direction. Match each number in the clue to the direction it names.',
        'West of Town Square makes the x-coordinate -5. North of Town Square keeps the y-coordinate positive, 3. The ordered pair is (-5, 3).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-distance-along-shared-street',
      kind: 'try_yourself',
      problem:
        'Flag 5 is at (-2, 6) and Flag 6 is at (-2, -1). Both flags sit on the same street. How many blocks apart are they, walking straight along that street?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '7', correct: true },
        { id: 'b', text: '5' },
        { id: 'c', text: '6' },
        { id: 'd', text: '0' },
      ],
      expectedAnswer: '7',
      hints: [
        'Flag 5 and Flag 6 share the x-coordinate -2, so they sit on the same street. Compare their y-coordinates instead to find the distance between them.',
        "6 and -1 sit on opposite sides of Town Square's east-west street, so add their distances from zero: 6 + 1 = 7 blocks.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-distance-along-shared-street',
      kind: 'try_yourself',
      problem:
        'Flag 7 is at (8, -6) and Flag 8 is at (8, 3). Both flags sit on the same street. How many blocks apart are they, walking straight along that street? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '9',
      hints: [
        'Flag 7 and Flag 8 share the x-coordinate 8, so they sit on the same north-south street. Compare their y-coordinates to find the distance between them.',
        "-6 and 3 sit on opposite sides of Town Square's east-west street, so add their distances from zero: 6 + 3 = 9 blocks.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sign-from-position-and-blind-subtraction',
      kind: 'misconception_check',
      question:
        'Team Yellow\'s clue says: "The flag is 6 blocks west of Town Square and 4 blocks north." A student translates this as the point (6, -4). Two more flags sit on the same street at (5, 7) and (5, -1), and the same student says they are 6 blocks apart. What went wrong in each case?',
      commonErrors: [
        {
          answer: '(6, -4)',
          misconception:
            'Assuming the negative sign belongs to whichever number comes second in the sentence, instead of reading the sign from each direction word on its own.',
          correctsTo:
            'West means the x-coordinate is negative, so x = -6. North means the y-coordinate is positive, so y = 4. The correct point is (-6, 4). Each coordinate gets its sign from its own direction word, never from its position in the sentence.',
        },
        {
          answer: '6',
          misconception:
            'Always subtracting the two matching coordinates, even when the points sit on opposite sides of the shared axis, instead of checking which side each point is on first.',
          correctsTo:
            "7 and -1 sit on opposite sides of Town Square's east-west street: 7 is 7 blocks north of it, and -1 is 1 block south of it. Since the two points are on opposite sides, add the two distances instead of subtracting them: 7 + 1 = 8 blocks. Subtracting only works when both points sit on the same side of the shared axis.",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Turn a real-world clue into an ordered pair by matching each direction word to its coordinate: east and north are positive, west and south are negative.',
        'The x-coordinate is the east-west number and comes first; the y-coordinate is the north-south number and comes second, matching the order of (x, y).',
        'The signs of an ordered pair name its quadrant before you ever plot it: for example, (positive, positive) sits northeast of Town Square.',
        'Two points that share an x-coordinate sit on the same north-south street; two that share a y-coordinate sit on the same east-west street.',
        'To find the distance between two points that share a coordinate, add their distances from zero when they sit on opposite sides of the shared axis, and subtract when they sit on the same side.',
        'Plotting a point is only the first step. The real question is always what the graphed points tell you, like which street two flags share or how far apart they sit.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Real-World Coordinate Plane Problems' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
