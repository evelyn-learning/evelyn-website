/**
 * Algebra 1 — Quadratics: Quadratic Models & Word Problems.
 *
 * Where the algebra finally means something (CCSS F-IF.B.4, A-CED.A.1):
 * projectile height and fenced-area situations, what the vertex, the
 * roots, and the y-intercept SAY about the story, and the habit of
 * throwing out roots the situation forbids (negative time, negative
 * length). The whole skill is matching the question to the feature.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U8_QUADRATIC_MODELS: LessonPlan = {
  id: 'evelyn.hs.alg1.quadratic-models.v1',
  title: 'Quadratic Models & Word Problems',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.quadratic-models',
      standard: 'ALG1-8.5',
      description:
        'Build and interpret quadratic models for projectile-height and area situations, explaining what the vertex, roots, and y-intercept mean in context and rejecting solutions outside the domain of the situation (CCSS F-IF.B.4, A-CED.A.1).',
    },
  ],
  prerequisites: ['alg1.quadratic-formula-discriminant'],
  followUps: ['alg1.simplifying-radicals'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame quadratic models as the reason anyone cares about parabolas — thrown objects and "how big can I make it" problems.',
      script:
        'Throw anything — a basketball, a water balloon, a firework — and gravity bends its path into a parabola. Fence a garden with a fixed amount of fence and the area you get is also a parabola. So the same three features you already know how to find — the vertex, the roots, the y-intercept — answer real questions: how high did it get, when did it land, what is the biggest garden possible. Today the algebra is easy; the skill is knowing which feature the question is asking for.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-features-in-context',
      kind: 'concept',
      goal: 'Translate the three parabola features into real-world meaning, build models from a fence or launch description, and screen out impossible answers.',
      keyIdeas: [
        'THE PROJECTILE MODEL — height in feet t seconds after launch is h(t) = −16t² + vt + c, where v is the upward launch speed in feet per second and c is the height it was launched from. The −16 is gravity, and because it is negative the parabola opens DOWN, so the vertex is a maximum.',
        'Y-INTERCEPT = STARTING VALUE — h(0) = c, the constant term. It is the launch height, and you read it off with no work at all. It is a height, never a time.',
        'VERTEX = THE BEST MOMENT, AND IT IS TWO DIFFERENT NUMBERS — t = −b/(2a) is WHEN the peak happens; plugging that t back in gives HOW HIGH the peak is. "At what time?" wants the first number, "what is the maximum height?" wants the second. Mixing these up is the single most common error in this whole topic.',
        'ROOTS = WHEN THE QUANTITY IS ZERO — solving h(t) = 0 finds when the object is at ground level, i.e. when it lands. Factor if you can (dividing every term by the common factor first makes it easy), otherwise use the quadratic formula.',
        'REJECT IMPOSSIBLE ROOTS — the algebra does not know the story. A negative time, a negative length, or a width bigger than the fence you own are all valid solutions of the equation and wrong answers to the question. State the feasible domain (t ≥ 0, or 0 < x < half the fence) and discard anything outside it.',
        'AREA MODELS — use the fence or perimeter constraint to write one dimension in terms of the other, then multiply. Fencing three sides with P feet against a wall: width x, remaining side P − 2x, area A(x) = x(P − 2x) = −2x² + Px. That is a downward parabola, so its vertex is the biggest possible area.',
        'MATCH THE QUESTION TO THE FEATURE — "how high / how big / what is the maximum" → the vertex OUTPUT. "At what time / what width" → the vertex INPUT. "Starting / initial" → the y-intercept. "Hits the ground / area is zero / breaks even" → the roots.',
        'CARRY THE UNITS — a time is in seconds, a height in feet, an area in square feet. If your answer is an area and you wrote feet, you almost certainly reported the vertex input instead of the vertex output.',
      ],
      vocabulary: [
        { term: 'vertex', definition: 'the turning point of the parabola — the maximum when the leading coefficient is negative.' },
        { term: 'root (zero)', definition: 'an input that makes the function equal 0 — in context, when the height or area is zero.' },
        { term: 'feasible domain', definition: 'the inputs the real situation actually allows, e.g. t ≥ 0 for time after launch.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-projectile',
      kind: 'worked_example',
      problem:
        'A ball is launched from a 64-foot platform at an upward speed of 48 feet per second, so h(t) = −16t² + 48t + 64. Find (a) the launch height, (b) the maximum height and when it happens, (c) when the ball lands.',
      steps: [
        '(a) Launch height is the y-intercept: h(0) = 64 feet. That is just the constant term — no computation needed.',
        '(b) The peak is at the vertex: t = −b/(2a) = −48/(2(−16)) = −48/−32 = 1.5 seconds.',
        'Now plug it back to get the height: h(1.5) = −16(2.25) + 48(1.5) + 64 = −36 + 72 + 64 = 100 feet. The 1.5 answers "when", the 100 answers "how high".',
        '(c) Landing means the height is 0: −16t² + 48t + 64 = 0. Divide every term by −16 to simplify: t² − 3t − 4 = 0, so (t − 4)(t + 1) = 0 and t = 4 or t = −1.',
        'Time cannot be negative, so reject t = −1. The ball lands 4 seconds after launch. Check: h(4) = −16(16) + 48(4) + 64 = −256 + 192 + 64 = 0. ✓',
      ],
      answer: 'Launch height 64 ft; maximum height 100 ft at t = 1.5 s; lands at t = 4 s',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-area-vertex-trap',
      kind: 'worked_example',
      problem:
        'A rectangular garden is built against a straight barn wall, using 40 feet of fence for the other three sides. What dimensions give the greatest area, and what is that area?',
      steps: [
        'Let x be the width of each side running out from the wall. Those two sides use 2x feet of fence, so the side parallel to the wall is 40 − 2x.',
        'Area: A(x) = x(40 − 2x) = −2x² + 40x. The leading coefficient −2 is negative, so this parabola opens down and its vertex is the maximum area.',
        'Vertex input: x = −b/(2a) = −40/(2(−2)) = 10. Careful — 10 is the WIDTH in feet, not the area. Stopping here is the classic mistake.',
        'Vertex output: A(10) = 10(40 − 20) = 10(20) = 200. So the garden is 10 ft by 20 ft with an area of 200 square feet.',
        'Domain check: x must keep the third side positive, so 0 < x < 20, and 10 is inside. Sanity test the neighbours: A(9) = 9(22) = 198 and A(11) = 11(18) = 198 — both smaller than 200. ✓',
      ],
      answer: '10 ft by 20 ft, maximum area 200 square feet',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-feature',
      kind: 'try_yourself',
      problem:
        'A ball thrown from a rooftop has height h(t) = −16t² + 32t + 48 feet after t seconds. Which computation tells you WHEN the ball hits the ground?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Solve h(t) = 0 and keep the positive solution', correct: true },
        { id: 'b', text: 'Evaluate h(0)' },
        { id: 'c', text: 'Compute t = −b/(2a)' },
        { id: 'd', text: 'Evaluate h at the vertex' },
      ],
      expectedAnswer: 'Solve h(t) = 0 and keep the positive solution',
      hints: [
        'Hitting the ground means the height value is zero — which feature of a parabola is an input that makes the output 0?',
        'h(0) is the starting height and the vertex is the peak; neither is the landing moment.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-area-max',
      kind: 'try_yourself',
      problem:
        'A dog run is fenced against a garage wall with 36 feet of fence on the three open sides. If x is the width of each side meeting the wall, the area is A(x) = x(36 − 2x). What is the greatest possible area?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '162 square feet', correct: true },
        { id: 'b', text: '9 square feet' },
        { id: 'c', text: '18 square feet' },
        { id: 'd', text: '81 square feet' },
      ],
      expectedAnswer: '162 square feet',
      hints: [
        'Expand to A(x) = −2x² + 36x and find the vertex input with x = −b/(2a).',
        'x = 9 is the width, not the answer — put it back into A(x) to get the area.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-landing',
      kind: 'try_yourself',
      problem:
        'A firework is launched from a 32-foot ledge at 16 feet per second: h(t) = −16t² + 16t + 32. How many seconds after launch does it hit the ground? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '2',
      hints: [
        'Hitting the ground means h(t) = 0. Divide every term by −16 first to simplify.',
        't² − t − 2 = 0 factors as (t − 2)(t + 1) = 0 — one of those roots is impossible in this story.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-time',
      kind: 'misconception_check',
      question:
        'A student models a thrown ball with h(t) = −16t² + 24t + 40, solves h(t) = 0 correctly, and answers "the ball hits the ground at t = −1 seconds and t = 2.5 seconds." What went wrong?',
      commonErrors: [
        {
          answer: 't = −1 and t = 2.5 seconds',
          misconception:
            'Reporting every algebraic root instead of only the ones the situation allows — treating the equation as the whole problem and forgetting the story it came from.',
          correctsTo:
            'Both roots do satisfy the equation, but the model only describes time from launch onward, so the feasible domain is t ≥ 0. Discard t = −1 and answer t = 2.5 seconds.',
        },
        {
          answer: 't = 40 seconds',
          misconception:
            'Reading the constant term as a time. 40 is the y-intercept, which is a HEIGHT in feet — where the ball started, not when anything happens.',
          correctsTo:
            'h(0) = 40 means the ball was released 40 feet up. Times come from solving h(t) = 0 or from −b/(2a); heights come from evaluating h.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y-intercept = starting value (launch height); vertex = the maximum; roots = when the quantity hits zero (lands, or area is 0).',
        'The vertex is TWO numbers: −b/(2a) is when, and the function value there is how much. Read which one the question wants.',
        'For area problems, use the fence or perimeter constraint to write one dimension in terms of the other, then maximize the product.',
        'Throw out roots the situation forbids — negative times and negative lengths solve the equation but do not answer the question.',
        'Label units: seconds for time, feet for height or width, square feet for area.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.5', cedTitle: 'Quadratic Models & Word Problems' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
