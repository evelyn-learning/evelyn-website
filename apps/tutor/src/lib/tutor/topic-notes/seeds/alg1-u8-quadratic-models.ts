/**
 * Algebra 1 — Unit 8 CED 8.5: Quadratic Models & Word Problems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.quadratic-models.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U8_QUADRATIC_MODELS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.quadratic-models.v1',
  course: 'Algebra 1',
  cedUnit: 8,
  cedTopic: '8.5',
  cedTitle: 'Quadratic Models & Word Problems',
  planId: 'evelyn.hs.alg1.quadratic-models.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.quadratic-models.v1' }],
  theory: [
    { loId: 'alg1.quadratic-models', kind: 'framework', title: 'The projectile model', content: `THE PROJECTILE MODEL — height in feet t seconds after launch is h(t) = −16t² + vt + c, where v is the upward launch speed in feet per second and c is the height it was launched from. The −16 is gravity, and because it is negative the parabola opens DOWN, so the vertex is a maximum.` },
    { loId: 'alg1.quadratic-models', content: `Y-INTERCEPT = STARTING VALUE — h(0) = c, the constant term. It is the launch height, and you read it off with no work at all. It is a height, never a time.` },
    { loId: 'alg1.quadratic-models', content: `VERTEX = THE BEST MOMENT, AND IT IS TWO DIFFERENT NUMBERS — t = −b/(2a) is WHEN the peak happens; plugging that t back in gives HOW HIGH the peak is. "At what time?" wants the first number, "what is the maximum height?" wants the second. Mixing these up is the single most common error in this whole topic.` },
    { loId: 'alg1.quadratic-models', content: `ROOTS = WHEN THE QUANTITY IS ZERO — solving h(t) = 0 finds when the object is at ground level, i.e. when it lands. Factor if you can (dividing every term by the common factor first makes it easy), otherwise use the quadratic formula.` },
    { loId: 'alg1.quadratic-models', kind: 'framework', title: 'Reject impossible roots', content: `REJECT IMPOSSIBLE ROOTS — the algebra does not know the story. A negative time, a negative length, or a width bigger than the fence you own are all valid solutions of the equation and wrong answers to the question. State the feasible domain (t ≥ 0, or 0 < x < half the fence) and discard anything outside it.` },
    { loId: 'alg1.quadratic-models', kind: 'framework', title: 'Area models', content: `AREA MODELS — use the fence or perimeter constraint to write one dimension in terms of the other, then multiply. Fencing three sides with P feet against a wall: width x, remaining side P − 2x, area A(x) = x(P − 2x) = −2x² + Px. That is a downward parabola, so its vertex is the biggest possible area.` },
    { loId: 'alg1.quadratic-models', kind: 'framework', title: 'Match the question to the feature', content: `MATCH THE QUESTION TO THE FEATURE — "how high / how big / what is the maximum" → the vertex OUTPUT. "At what time / what width" → the vertex INPUT. "Starting / initial" → the y-intercept. "Hits the ground / area is zero / breaks even" → the roots.` },
    { loId: 'alg1.quadratic-models', kind: 'framework', title: 'Carry the units', content: `CARRY THE UNITS — a time is in seconds, a height in feet, an area in square feet. If your answer is an area and you wrote feet, you almost certainly reported the vertex input instead of the vertex output.` },
    { loId: 'alg1.quadratic-models', kind: 'definition', title: 'vertex', content: `the turning point of the parabola — the maximum when the leading coefficient is negative.` },
    { loId: 'alg1.quadratic-models', kind: 'definition', title: 'root (zero)', content: `an input that makes the function equal 0 — in context, when the height or area is zero.` },
    { loId: 'alg1.quadratic-models', kind: 'definition', title: 'feasible domain', content: 'the inputs the real situation actually allows, e.g. t ≥ 0 for time after launch.' },
  ],
  methods: [
    {
      title: 'Worked projectile',
      steps: [
        `(a) Launch height is the y-intercept: h(0) = 64 feet. That is just the constant term — no computation needed.`,
        `(b) The peak is at the vertex: t = −b/(2a) = −48/(2(−16)) = −48/−32 = 1.5 seconds.`,
        `Now plug it back to get the height: h(1.5) = −16(2.25) + 48(1.5) + 64 = −36 + 72 + 64 = 100 feet. The 1.5 answers "when", the 100 answers "how high".`,
        `(c) Landing means the height is 0: −16t² + 48t + 64 = 0. Divide every term by −16 to simplify: t² − 3t − 4 = 0, so (t − 4)(t + 1) = 0 and t = 4 or t = −1.`,
        `Time cannot be negative, so reject t = −1. The ball lands 4 seconds after launch. Check: h(4) = −16(16) + 48(4) + 64 = −256 + 192 + 64 = 0. ✓`,
      ],
      example: { problem: `A ball is launched from a 64-foot platform at an upward speed of 48 feet per second, so h(t) = −16t² + 48t + 64. Find (a) the launch height, (b) the maximum height and when it happens, (c) when the ball lands.`, solution: 'Launch height 64 ft; maximum height 100 ft at t = 1.5 s; lands at t = 4 s' },
      relatedLoIds: ['alg1.quadratic-models'],
    },
    {
      title: 'Worked area vertex trap',
      steps: [
        `Let x be the width of each side running out from the wall. Those two sides use 2x feet of fence, so the side parallel to the wall is 40 − 2x.`,
        `Area: A(x) = x(40 − 2x) = −2x² + 40x. The leading coefficient −2 is negative, so this parabola opens down and its vertex is the maximum area.`,
        `Vertex input: x = −b/(2a) = −40/(2(−2)) = 10. Careful — 10 is the WIDTH in feet, not the area. Stopping here is the classic mistake.`,
        `Vertex output: A(10) = 10(40 − 20) = 10(20) = 200. So the garden is 10 ft by 20 ft with an area of 200 square feet.`,
        `Domain check: x must keep the third side positive, so 0 < x < 20, and 10 is inside. Sanity test the neighbours: A(9) = 9(22) = 198 and A(11) = 11(18) = 198 — both smaller than 200. ✓`,
      ],
      example: { problem: `A rectangular garden is built against a straight barn wall, using 40 feet of fence for the other three sides. What dimensions give the greatest area, and what is that area?`, solution: '10 ft by 20 ft, maximum area 200 square feet' },
      relatedLoIds: ['alg1.quadratic-models'],
    },
  ],
  pointers: [
    { content: `Both roots do satisfy the equation, but the model only describes time from launch onward, so the feasible domain is t ≥ 0. Discard t = −1 and answer t = 2.5 seconds.`, kind: 'common-error' },
    { content: `h(0) = 40 means the ball was released 40 feet up. Times come from solving h(t) = 0 or from −b/(2a); heights come from evaluating h.`, kind: 'common-error' },
    { content: `y-intercept = starting value (launch height); vertex = the maximum; roots = when the quantity hits zero (lands, or area is 0).`, kind: 'tip' },
    { content: `The vertex is TWO numbers: −b/(2a) is when, and the function value there is how much. Read which one the question wants.`, kind: 'tip' },
    { content: `For area problems, use the fence or perimeter constraint to write one dimension in terms of the other, then maximize the product.`, kind: 'tip' },
    { content: `Throw out roots the situation forbids — negative times and negative lengths solve the equation but do not answer the question.`, kind: 'tip' },
    { content: 'Label units: seconds for time, feet for height or width, square feet for area.', kind: 'tip' },
    { content: `The vertex is **two numbers**, not one. \`−b/(2a)\` answers *when/what width*; you must substitute it back to get *how high/how big*. Circle which one the question asked before you write your final answer.`, kind: 'common-error' },
    { content: `Never read the constant term as a time. In h(t) = −16t² + 24t + 40, the 40 is 40 **feet** of launch height, and the 24 is a **speed**, not a time. Times only come from solving h(t) = 0 or from −b/(2a).`, kind: 'vocab-note' },
    { content: `After solving h(t) = 0, state the feasible domain (t ≥ 0) and *explicitly reject* the impossible root. A negative time or negative length solves the equation but does not answer the question — write "reject t = −1" so you don't hand in both.`, kind: 'gotcha' },
    { content: `Let units audit your answer: seconds for time, feet for height or a dimension, **square** feet for area. If the question asks for area and your units are feet, you almost certainly reported the vertex input instead of the vertex output.`, kind: 'tip' },
    { content: `In three-sides-against-a-wall problems the fence is 2x + (other side) = P, **not** 2x + 2y. So the side parallel to the wall is P − 2x, giving A(x) = x(P − 2x). Using the full perimeter formula gives the wrong parabola.`, kind: 'common-error' },
    { content: `Before factoring −16t² + bt + c = 0, divide *every* term by −16 (or the common factor). Dividing only some terms, or forgetting the sign flip on the constant, is where most landing-time answers go wrong.`, kind: 'tip' },
    { content: `For area problems the domain has an upper limit too: x must keep the other dimension positive, so 0 < x < P/2. Check your vertex input lands inside it — a maximizing x outside the interval means you set up the constraint wrong.`, kind: 'edge-case' },
    { content: `"Maximum height" ≠ "height when it lands." Landing height is always 0 — that's what you *solve for*, not something you compute. If you plug the landing time into h and get 0, that's a check, not the answer.`, kind: 'gotcha' },
  ],
};
