/**
 * Geometry — Foundations: Points, Lines & Planes.
 *
 * The vocabulary the entire course is built on (CCSS G-CO.A.1): the three
 * undefined terms, the naming conventions, and the postulates that decide
 * how many lines and planes a set of points determines. Heavy weight on the
 * two classic traps — "collinear vs coplanar" and "not intersecting means
 * parallel" — because every later proof leans on getting these right.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U1_POINTS_LINES_PLANES: LessonPlan = {
  id: 'evelyn.hs.geom.points-lines-planes.v1',
  title: 'Points, Lines & Planes',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.points-lines-planes',
      standard: 'GEOM-1.1',
      description:
        'Name and describe points, lines, planes, segments, and rays, and apply the postulates governing collinear and coplanar points, line and plane intersections, and skew lines (CCSS G-CO.A.1).',
    },
  ],
  prerequisites: [],
  followUps: ['geom.segments-distance-midpoint'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the undefined terms as the working language of builders, surveyors and 3-D designers — and the reason a three-legged stool never wobbles.',
      script:
        'A four-legged chair wobbles on an uneven floor. A three-legged stool never does. That is not carpentry luck — it is geometry: three points that are not in a straight line lock down exactly one flat surface, and a fourth point has no obligation to join it. Surveyors, architects, and every 3-D modeling program run on the same handful of rules about points, lines, and planes. Today we learn that language precisely, because every proof for the rest of this course is written in it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-foundations',
      kind: 'concept',
      goal: 'The three undefined terms, correct naming, the determining postulates, how figures intersect, and the collinear/coplanar and skew traps.',
      keyIdeas: [
        'THE THREE UNDEFINED TERMS — point, line, and plane are described, never defined. A point has position but no size. A line is straight, has no thickness, and goes on forever in both directions. A plane is a flat surface with no thickness that extends forever in every direction. Space is the set of all points.',
        'HOW TO NAME THINGS — a point takes one capital letter (point A). A line takes any TWO of its points (line AB) or a single lowercase letter (line m). A plane takes three of its non-collinear points (plane ABC) or a single capital script letter (plane M).',
        'SEGMENT vs RAY vs LINE — segment AB is the finite piece with endpoints A and B. Ray AB starts AT A and passes through B, continuing forever past B. Line AB runs forever in both directions. ORDER MATTERS FOR RAYS ONLY: ray AB and ray BA are different rays (different starting points), while segment AB = segment BA and line AB = line BA.',
        'COLLINEAR vs COPLANAR — collinear points lie on ONE line; coplanar points lie on ONE plane. Any two points are automatically collinear and any three points are automatically coplanar, so the words only carry information for three-or-more and four-or-more points. Students swap these two constantly — collinear is the stricter condition, and collinear points are always coplanar too.',
        'THE DETERMINING POSTULATES — two distinct points determine exactly one line. THREE NON-COLLINEAR points determine exactly one plane. Drop the words "non-collinear" and the statement is false: three points on the same line sit on infinitely many planes, the way a door swings on its hinge line. A line plus a point NOT on that line also determines exactly one plane, and so do two intersecting lines.',
        'HOW FIGURES INTERSECT — two distinct lines intersect in at most ONE point. Two distinct planes that intersect meet in a LINE, never a single point (picture two walls meeting at a corner edge). A line not lying inside a plane pierces it in at most one point. If a line contains two points of a plane, the whole line lies in that plane.',
        'SKEW LINES — the 3-D trap. Parallel lines are coplanar AND never meet. Skew lines never meet and are NOT coplanar. So "these lines never intersect" does NOT prove they are parallel — you must also show they lie in the same plane. In a room, the front-top edge of the ceiling and a vertical corner edge on the far wall never touch and are not coplanar: skew.',
      ],
      vocabulary: [
        {
          term: 'collinear',
          definition: 'lying on the same line; coplanar means lying on the same plane, which is a weaker requirement.',
        },
        {
          term: 'skew lines',
          definition: 'two lines that do not intersect and do not lie in any single plane together — so they are not parallel.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-plane-intersection',
      kind: 'worked_example',
      problem:
        'A cardboard box has a top face ABCD sitting directly above a bottom face EFGH, with A above E, B above F, C above G, and D above H. The front face is the flat region ABFE and the right face is the flat region BCGF. What is the intersection of plane ABFE and plane BCGF?',
      steps: [
        'List the labeled points of each plane: plane ABFE contains A, B, F, E; plane BCGF contains B, C, G, F.',
        'Find the points that appear in BOTH lists: B and F. (The box has a vertical edge running from B down to F.)',
        'Two distinct points determine exactly one line, so B and F pin down line BF — and every point of line BF lies in both planes.',
        'Apply the intersection postulate: two distinct planes that meet, meet in a LINE, not a point. Here that line is line BF, the vertical edge where the front and right faces come together.',
      ],
      answer: 'Line BF — the shared vertical edge of the two faces.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-skew-vs-parallel',
      kind: 'worked_example',
      problem:
        'Using the same box (top face ABCD above bottom face EFGH, with A above E, B above F, C above G, D above H), a classmate says: "Line AD and line BF never touch each other, so line AD ∥ line BF." Is the classmate right?',
      steps: [
        'Check the intersection claim first: AD is an edge of the top face, BF is the vertical edge dropping from B to F. They share no point, so the classmate is right that the lines never meet.',
        'But parallel needs TWO conditions: never meeting AND lying in one common plane. Test the second one.',
        'A, B, and D are non-collinear points of the top face, so they determine exactly ONE plane — the plane of the top face ABCD.',
        'Is F in that plane? No: F sits directly below B, off the top face. So no single plane contains A, D, B, and F.',
        'The lines never meet and are not coplanar, so line AD and line BF are SKEW, not parallel. "They never intersect" alone is never enough.',
      ],
      answer: 'No — the lines are skew, because they are not coplanar. Parallel requires coplanar AND non-intersecting.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-plane-intersection',
      kind: 'try_yourself',
      problem:
        'Plane P and plane Q are two different planes, and they do intersect. Which statement describes their intersection?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They intersect in exactly one point' },
        { id: 'b', text: 'They intersect in exactly one line', correct: true },
        { id: 'c', text: 'They intersect in a plane' },
        { id: 'd', text: 'They intersect in exactly one ray' },
      ],
      expectedAnswer: 'They intersect in exactly one line',
      hints: [
        'Two distinct LINES meet in at most one point — but do not copy that rule over to planes. Picture two walls of a room.',
        'Where two walls come together you see a full corner edge running floor to ceiling, and it extends forever in both directions since planes are unbounded.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-determine-plane',
      kind: 'try_yourself',
      problem: 'Which of these always determines exactly one plane?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Any three points' },
        { id: 'b', text: 'Three non-collinear points', correct: true },
        { id: 'c', text: 'Two points' },
        { id: 'd', text: 'A line and a point that lies on that line' },
      ],
      expectedAnswer: 'Three non-collinear points',
      hints: [
        'Try to break each option. If the three points happen to sit in a straight line, how many planes contain them?',
        'Three points on one line are like a door hinge — infinitely many planes swing through them. You need a point off the line.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Five points lie in a plane and no three of them are collinear. A line is drawn through every possible pair of these points. How many different lines are drawn? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '10',
      hints: [
        'Two distinct points determine exactly one line, so counting lines means counting pairs of points.',
        'The first point pairs with the 4 others, the second adds 3 new pairs, the third adds 2, the fourth adds 1: 4 + 3 + 2 + 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-three-points',
      kind: 'misconception_check',
      question:
        'Points R, S, and T all lie on the same straight line. A student says, "Three points always determine exactly one plane, so R, S, and T determine exactly one plane." What is wrong with that reasoning?',
      commonErrors: [
        {
          answer: 'R, S, and T determine exactly one plane',
          misconception:
            'Dropping the words "non-collinear" from the postulate and applying it to any three points.',
          correctsTo:
            'Only NON-COLLINEAR points determine exactly one plane. Collinear points R, S, T lie on infinitely many planes — a plane can rotate around line RS like a door on its hinge. To pin down one plane you need a fourth point that is off the line.',
        },
        {
          answer: 'R, S, and T are collinear, so no plane contains them',
          misconception:
            'Over-correcting: assuming collinear points fail to be coplanar at all.',
          correctsTo:
            'Collinear points are always coplanar — the problem is that there are infinitely many such planes, not zero. Collinear is the stricter condition; it implies coplanar.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Point, line, and plane are undefined terms; name a line by any two of its points and a plane by three non-collinear points.',
        'Two points determine one line; three NON-COLLINEAR points determine one plane. The words "non-collinear" are not decoration.',
        'Two distinct lines meet in at most one point; two distinct planes that meet, meet in a whole line.',
        'Never intersecting is not the same as parallel — parallel also requires coplanar, and non-coplanar non-intersecting lines are skew.',
        'Ray AB and ray BA are different rays; segment AB and line AB do not care about letter order.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Points, Lines & Planes' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
