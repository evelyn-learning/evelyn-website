/**
 * Geometry — Foundations: Angle Pair Relationships.
 *
 * The named pairs that turn one known angle into a whole figure full of
 * known angles (CCSS G-CO.A.1): adjacent, complementary, supplementary,
 * linear pair, vertical. Equal billing for the two mirror-image algebra
 * errors — setting a linear pair equal, and adding vertical angles to
 * 180° — because those two mistakes account for most lost points here.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U1_ANGLE_PAIR_RELATIONSHIPS: LessonPlan = {
  id: 'evelyn.hs.geom.angle-pair-relationships.v1',
  title: 'Angle Pair Relationships',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.angle-pair-relationships',
      standard: 'GEOM-1.4',
      description:
        'Identify adjacent, complementary, supplementary, linear-pair, and vertical angle pairs, and use those relationships to find unknown angle measures and solve algebraic angle problems (CCSS G-CO.A.1).',
    },
  ],
  prerequisites: ['geom.angles-and-measure'],
  followUps: ['geom.inductive-deductive-reasoning'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame angle pairs as the reason a designer only has to label one angle — every other angle follows.',
      script:
        'Look at any architectural drawing where two beams cross, or a street map where two roads intersect. The drafter labels exactly ONE angle and walks away. Not laziness — once one of the four angles at a crossing is known, the other three are forced. Today you learn the handful of named angle pairs that do that forcing, plus the two algebra slips that turn an easy problem into a wrong answer.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-angle-pairs',
      kind: 'concept',
      goal: 'The five named pairs, which ones are congruent versus supplementary, and how to turn each into an equation.',
      keyIdeas: [
        'ADJACENT ANGLES — share a vertex AND a side, and their interiors do not overlap. Sharing only the vertex is not enough, and one angle sitting inside another is not adjacent.',
        'COMPLEMENTARY vs SUPPLEMENTARY — complementary angles sum to 90°, supplementary angles sum to 180°. These are NUMBER relationships only: the two angles may sit side by side or in completely different parts of a figure. Alphabet hook: C before S, 90 before 180.',
        'LINEAR PAIR — two ADJACENT angles whose outer sides form a straight line (opposite rays). A linear pair is always supplementary, so it is the one position that hands you the 180° equation for free.',
        'VERTICAL ANGLES — when two lines cross they make two pairs of opposite, non-adjacent angles. Vertical angles are always CONGRUENT (equal measure). Why: each of them forms a linear pair with the same neighbor angle, so both equal 180° minus that neighbor.',
        'ONE ANGLE UNLOCKS FOUR — at any crossing the four angles read around as x, 180° - x, x, 180° - x, totalling 360°. Two copies of the acute value, two of the obtuse value.',
        'PERPENDICULAR AND BISECTORS — if two lines are ⊥ every angle at the crossing is 90°, so all four are congruent AND complementary in pairs. An angle bisector cuts one angle into two congruent halves, each measuring half the whole.',
        'NEVER TRUST THE LOOK — an angle that looks like 90°, or two angles that look equal, prove nothing. Only given statements, tick or arc marks, and a stated ⊥ count as evidence.',
        'THE ALGEBRA MOVE — name the relationship FIRST, then write its equation: congruent pairs give expression = expression, linear pairs give expression + expression = 180, complements give a sum of 90. Solve for x, then substitute back, because the question usually asks for an ANGLE, not for x.',
      ],
      vocabulary: [
        {
          term: 'linear pair',
          definition: 'two adjacent angles whose non-shared sides form a straight line — always supplementary.',
        },
        {
          term: 'vertical angles',
          definition: 'the two opposite, non-adjacent angles formed by a pair of intersecting lines — always congruent.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-one-unlocks-four',
      kind: 'worked_example',
      problem:
        'Lines AB and CD intersect at point P, and m∠APC = 47°. Find m∠APD, m∠BPD, and m∠BPC.',
      steps: [
        'Locate ∠APD: it is adjacent to ∠APC and rays PC and PD are opposite rays, so ∠APC and ∠APD form a linear pair → m∠APD = 180° - 47° = 133°.',
        'Locate ∠BPD: it is opposite ∠APC across the crossing, so they are vertical angles → m∠BPD = 47°.',
        'Locate ∠BPC: it is vertical to ∠APD → m∠BPC = 133°. (It also forms a linear pair with ∠APC, which gives the same 133°.)',
        'Sense-check: 47 + 133 + 47 + 133 = 360°, and the four angles come in two congruent pairs. ✓',
      ],
      answer: 'm∠APD = 133°, m∠BPD = 47°, m∠BPC = 133°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-linear-pair-trap',
      kind: 'worked_example',
      problem:
        '∠1 and ∠2 form a linear pair, with m∠1 = (3x + 10)° and m∠2 = (5x + 26)°. A student writes 3x + 10 = 5x + 26 and gets x = -8. Find the error and the correct measure of each angle.',
      steps: [
        'Name the relationship first: a LINEAR PAIR is supplementary, not congruent. The student used the congruent-angles equation, which belongs to vertical angles.',
        'Write the right equation: (3x + 10) + (5x + 26) = 180, so 8x + 36 = 180.',
        'Solve: 8x = 144, so x = 18.',
        'Substitute back — the question asks for angles, not x: m∠1 = 3(18) + 10 = 64° and m∠2 = 5(18) + 26 = 116°.',
        'Check: 64 + 116 = 180 ✓. Notice the negative x was the warning sign — a negative solution usually means the wrong relationship was used.',
      ],
      answer: 'The linear pair is supplementary, not congruent: x = 18, m∠1 = 64°, m∠2 = 116°.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-chain-of-pairs',
      kind: 'try_yourself',
      problem:
        'Two lines cross at point O. ∠1 and ∠2 are vertical angles, and m∠1 = 63°. ∠2 and ∠3 form a linear pair. What is m∠3?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '117°', correct: true },
        { id: 'b', text: '63°' },
        { id: 'c', text: '27°' },
        { id: 'd', text: '90°' },
      ],
      expectedAnswer: '117°',
      hints: [
        'Work one link at a time: vertical angles are congruent, so what is m∠2?',
        'A linear pair is supplementary, so m∠3 = 180° - 63°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-always-true',
      kind: 'try_yourself',
      problem: 'Which statement about angle pairs is ALWAYS true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Two angles that form a linear pair are supplementary', correct: true },
        { id: 'b', text: 'Two supplementary angles must be adjacent' },
        { id: 'c', text: 'Vertical angles are supplementary' },
        { id: 'd', text: 'Two angles that share a vertex are adjacent' },
      ],
      expectedAnswer: 'Two angles that form a linear pair are supplementary',
      hints: [
        'Three of these confuse a POSITION relationship with a MEASURE relationship, or drop a condition.',
        'Supplementary angles can sit anywhere; adjacency also requires a shared SIDE; vertical angles are congruent, not supplementary.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        '∠A and ∠B are complementary, with m∠A = (2x + 5)° and m∠B = (3x + 10)°. Solve for x and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '15',
      hints: [
        'Complementary means the two measures sum to 90: (2x + 5) + (3x + 10) = 90.',
        'Combine to 5x + 15 = 90, subtract 15, then divide by 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-vertical-sum',
      kind: 'misconception_check',
      question:
        '∠1 and ∠2 are vertical angles with m∠1 = 4x and m∠2 = (2x + 30)°. A student writes 4x + (2x + 30) = 180. What went wrong, and what is each angle really?',
      commonErrors: [
        {
          answer: '6x + 30 = 180, so x = 25 and the angles are 100° and 80°',
          misconception:
            'Assuming any two angles at an intersection add to 180°, and applying the linear-pair equation to a vertical pair.',
          correctsTo:
            'Vertical angles are CONGRUENT, so set the expressions equal: 4x = 2x + 30 → 2x = 30 → x = 15, making both angles 60°. The 180° equation belongs only to ADJACENT angles that form a linear pair. Answer check: vertical angles must come out equal — 100° and 80° were unequal, which flags the error immediately.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Adjacent = shared vertex AND shared side; complementary = 90°; supplementary = 180° (position not required).',
        'Linear pair → supplementary (add to 180°). Vertical angles → congruent (set equal). Do not swap those two equations.',
        'One angle at a crossing gives all four: x, 180° - x, x, 180° - x, totalling 360°.',
        'Never assume a right angle or an equality from how the drawing looks — use givens, marks, and ⊥ statements.',
        'Solve for x, then substitute back and answer the question that was actually asked.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Angle Pair Relationships' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
