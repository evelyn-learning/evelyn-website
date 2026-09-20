/**
 * Grade 8 Math — Unit 3 CED 3.1: Unit Rate as Slope.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.unit-rate-as-slope.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U3_UNIT_RATE_AS_SLOPE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.unit-rate-as-slope.v1',
  course: 'Grade 8 Math',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Unit Rate as Slope',
  planId: 'evelyn.ms.m8math.unit-rate-as-slope.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.unit-rate-as-slope.v1' }],
  theory: [
    { loId: 'm8math.unit-rate-as-slope', kind: 'framework', title: 'Graph it first', content: `GRAPH IT FIRST — a proportional relationship graphs as a straight line through the origin, the test you already own. From a table, plot each (x, y) pair as a point. From an equation such as y = 6x, make your own pairs by choosing x = 0, 1, 2, 3 and multiplying: (0, 0), (1, 6), (2, 12), (3, 18). Either way the points line up, so draw the line through them and through (0, 0).` },
    { loId: 'm8math.unit-rate-as-slope', content: `STEEPNESS HAS A NAME: SLOPE — every straight line leans at one fixed steepness, and that steepness is measured with two moves. The RUN is a move to the right, along the horizontal axis. The RISE is the move straight up that gets you back onto the line. The slope is the rise for a run of exactly 1 unit: step 1 to the right, count how far up you climb to reach the line, and that count is the slope.` },
    { loId: 'm8math.unit-rate-as-slope', kind: 'framework', title: 'The climb is the same everywhere', content: `THE CLIMB IS THE SAME EVERYWHERE — on the download line y = 6x, stepping right 1 from (0, 0) means climbing 6 to reach (1, 6), and stepping right 1 from (2, 12) means climbing 6 again to reach (3, 18). A straight line has one steepness, so a run of 1 always buys the same rise, no matter where on the line you start.` },
    { loId: 'm8math.unit-rate-as-slope', content: `SLOPE IS THE UNIT RATE IS k — the unit rate asks "how much for 1", and the slope asks "how far up for 1 step right", which is the same question asked of the graph. Six megabytes per second, slope 6, k = 6: three names for one number. Because of that, the point where x = 1 sits at height k, and you can read the slope straight off it.` },
    { loId: 'm8math.unit-rate-as-slope', content: `WHEN x = 1 IS NOT MARKED — if the only point you can read is (4, 24), the rise from the origin is 24 spread across a run of 4, so each single unit of run gets 24 ÷ 4 = 6 of rise. That is the same y ÷ x you already use to find k, and it is not the y-value of the point. The point (4, 24) says that 4 seconds gives 24 megabytes; the slope says how fast.` },
    { loId: 'm8math.unit-rate-as-slope', content: `BIGGER k, STEEPER LINE — a slope of 2 climbs 2 for every step right and a slope of 10 climbs 10, so a larger k makes the line stand up steeper and a smaller k makes it lean flatter. Slope carries the units of the rate: 6 megabytes per second, 12 dollars per hour, 2.5 gallons per minute. Saying the units out loud is how you know you took rise over run and not run over rise.` },
    { loId: 'm8math.unit-rate-as-slope', kind: 'definition', title: 'slope', content: 'the steepness of a line, measured as the rise for a run of exactly 1 unit.' },
    { loId: 'm8math.unit-rate-as-slope', kind: 'definition', title: 'run', content: `a move to the right along the horizontal axis; in this lesson the run is always 1 unit.` },
    { loId: 'm8math.unit-rate-as-slope', kind: 'definition', title: 'rise', content: 'the move straight up needed to get back onto the line after a run.' },
    { loId: 'm8math.unit-rate-as-slope', kind: 'definition', title: 'unit rate', content: `the amount that goes with 1 of the other quantity; on a proportional graph it is the slope, and in y = kx it is k.` },
  ],
  methods: [
    {
      title: 'Worked table to graph to slope',
      steps: [
        `Plot hours across and dollars up: (2, 24), (3, 36), (5, 60). Confirm the relationship is proportional before drawing anything: 24 ÷ 2 = 12, 36 ÷ 3 = 12, 60 ÷ 5 = 12, every row agrees, so the points sit on one straight line through the origin. Draw that line through (0, 0) and the three points.`,
        `Measure the steepness with a run of exactly 1. Start at (2, 24) and step right 1 unit, to x = 3. The line is at (3, 36) there, so the rise is 36 - 24 = 12. The slope is 12.`,
        `Measure it again somewhere else, to see that the line has only one steepness. From the origin, the point (5, 60) is a rise of 60 across a run of 5, so a single unit of run gets 60 ÷ 5 = 12 of rise. Same 12.`,
        `Say the slope with its units: 12 dollars per hour. That is Nia's unit rate, and it is the constant of proportionality k, so the equation of the line is y = 12x.`,
        `Check by working forward: the equation has to hit every table point. 12 × 2 = 24, 12 × 3 = 36, 12 × 5 = 60. All three match. And the point at x = 1 is (1, 12), sitting at a height equal to the slope, exactly where it should be.`,
      ],
      example: { problem: `Nia babysits for a family down the street. Her table: 2 hours earns $24, 3 hours earns $36, and 5 hours earns $60. Graph the relationship and find the slope of the line.`, solution: 'Slope 12, meaning 12 dollars per hour; the line is y = 12x' },
      relatedLoIds: ['m8math.unit-rate-as-slope'],
    },
    {
      title: 'Worked equation to graph to slope',
      steps: [
        `Make points from the equation by choosing x-values and multiplying: x = 0 gives y = 2.5 × 0 = 0, x = 1 gives 2.5, x = 2 gives 5, x = 4 gives 10. So the pairs are (0, 0), (1, 2.5), (2, 5), (4, 10).`,
        `Plot minutes across and gallons up. The four points line up on a straight line through the origin, as every y = kx graph does. Draw the line.`,
        `Measure the slope with a run of 1: from (0, 0), step right 1 to x = 1 and climb 2.5 to reach (1, 2.5). The slope is 2.5. Try it again from (2, 5): step right 1 to x = 3, where y = 2.5 × 3 = 7.5, so the rise is 7.5 - 5 = 2.5. Same steepness.`,
        `WRONG: looking at the point (4, 10) and saying the slope is 10. CORRECT: 10 is the rise for a run of 4, not for a run of 1. Share it out: 10 ÷ 4 = 2.5 per unit of run. The slope is 2.5, and the number 10 is how many gallons are in the pool after 4 minutes.`,
        `Say it with units: 2.5 gallons per minute. That is the unit rate, and it is the k already sitting in y = 2.5x. The equation and the graph are saying the same thing, one with a number and one with a lean.`,
        `Check by working backward from the slope: 2.5 × 4 = 10 matches (4, 10), and 2.5 × 2 = 5 matches (2, 5). The slope reproduces every point on the line.`,
      ],
      example: { problem: `A hose fills a kiddie pool at a steady rate, and the relationship is y = 2.5x, where x is minutes and y is gallons in the pool. Graph the relationship and find the slope of the line.`, solution: 'Slope 2.5, meaning 2.5 gallons per minute, the same number as k in y = 2.5x' },
      relatedLoIds: ['m8math.unit-rate-as-slope'],
    },
  ],
  pointers: [
    { content: `Students often say "slope = 20" — The point (5, 20) says a run of 5 comes with a rise of 20, so one unit of run gets 20 ÷ 5 = 4 of rise. The slope is 4. Check it: stepping right 1 from the origin on this line lands on (1, 4), and 4 × 5 = 20 puts (5, 20) on the line. A slope of 20 would put (5, 100) on the line, nowhere near the marked point.`, kind: 'common-error' },
    { content: `Students often say "slope = 0.25" — Slope is rise over run, the climb for a single step to the right: 20 ÷ 5 = 4, not 5 ÷ 20. A slope of 0.25 would mean the line climbs only a quarter of a unit for each step right, an almost flat line, when this one climbs 20 units in 5 steps. Saying the units catches it: 4 units up per 1 unit right.`, kind: 'common-error' },
    { content: `A proportional relationship graphs as a straight line through the origin. Plot the table, or make points from y = kx, and draw the line.`, kind: 'tip' },
    { content: `Slope is the steepness of the line: the rise for a run of exactly 1 unit. Step right 1, count up to the line.`, kind: 'tip' },
    { content: `A straight line has one slope. A run of 1 buys the same rise from any point on the line.`, kind: 'tip' },
    { content: `Slope = unit rate = k. Three names, one number, and the point at x = 1 sits at height k.`, kind: 'tip' },
    { content: `If the marked point is not at x = 1, divide rise by run: (4, 24) gives 24 ÷ 4 = 6. Never read the y-value alone, and never put run over rise.`, kind: 'tip' },
    { content: `Slope carries the units of the rate: 6 megabytes per second, 12 dollars per hour, 2.5 gallons per minute.`, kind: 'tip' },
  ],
};
