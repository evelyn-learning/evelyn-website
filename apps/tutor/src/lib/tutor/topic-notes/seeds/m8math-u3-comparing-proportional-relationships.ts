/**
 * Grade 8 Math — Unit 3 CED 3.2: Comparing Proportional Relationships.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.comparing-proportional-relationships.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U3_COMPARING_PROPORTIONAL_RELATIONSHIPS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.comparing-proportional-relationships.v1',
  course: 'Grade 8 Math',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Comparing Proportional Relationships',
  planId: 'evelyn.ms.m8math.comparing-proportional-relationships.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.comparing-proportional-relationships.v1' }],
  theory: [
    { loId: 'm8math.comparing-proportional-relationships', kind: 'framework', title: 'One number describes the whole relationship', content: `ONE NUMBER DESCRIBES THE WHOLE RELATIONSHIP — a proportional relationship is y = kx, and k is the unit rate: the miles per one minute, the dollars per one hour, the pages per one minute. Since k is the whole story, comparing two proportional relationships means comparing two values of k. A gig that pays $12 per hour beats one that pays $11.50 per hour, and no other detail changes that.` },
    { loId: 'm8math.comparing-proportional-relationships', content: `FROM A GRAPH, DIVIDE y BY x AT ANY MARKED POINT — the line goes through the origin, so any other point on it gives the rate: pick a point you can read exactly, such as (4, 50), and divide the y-coordinate by the x-coordinate, 50 ÷ 4 = 12.5. That number is the slope, the rise for every 1 unit of run, and it is the unit rate, exactly as you found last lesson. Keep y on top: it is dollars per hour, so dollars go on top and hours go on the bottom.` },
    { loId: 'm8math.comparing-proportional-relationships', kind: 'framework', title: 'From an equation, a table, or a sentence', content: `FROM AN EQUATION, A TABLE, OR A SENTENCE — in y = 13x the rate is the 13, sitting right in front of the x. In a table, divide y by x in any row, because a proportional table gives the same answer in every row. In a sentence like "$30 for 2.5 hours", divide to get the rate per ONE unit: 30 ÷ 2.5 = 12 dollars per hour. Whatever the form, you are hunting for the same thing, the amount of y for one unit of x.` },
    { loId: 'm8math.comparing-proportional-relationships', kind: 'framework', title: 'Match the units before you compare', content: `MATCH THE UNITS BEFORE YOU COMPARE — 90 gallons per hour and 2.5 gallons per minute are both unit rates, but they are per different units, and 90 is not bigger than 2.5 in any way that matters. Convert one of them first: 90 gallons per hour is 90 ÷ 60 = 1.5 gallons per minute, and now 2.5 beats 1.5. Both rates must be per the same one unit, or the comparison is meaningless.` },
    { loId: 'm8math.comparing-proportional-relationships', kind: 'framework', title: 'Decide in context, then subtract', content: `DECIDE IN CONTEXT, THEN SUBTRACT — the bigger unit rate is the faster speed, the higher pay, the steeper line. When y is a cost, the smaller unit rate is the cheaper one. Subtracting the two rates tells how much more per unit: 13 dollars per hour minus 12.5 dollars per hour is 0.5 dollars per hour, so one gig pays $0.50 more for every hour worked.` },
    { loId: 'm8math.comparing-proportional-relationships', kind: 'framework', title: 'Steeper by eye only works on the same axes', content: `STEEPER BY EYE ONLY WORKS ON THE SAME AXES — if two lines are drawn on the same coordinate plane, the steeper one has the bigger unit rate, and you can see the winner. Two separate graphs are a different story: a vertical axis that counts by 10s makes any line look steep, and one that counts by 1s makes the same line look flat. Across two pictures, only the numbers decide, so read a point and divide.` },
    { loId: 'm8math.comparing-proportional-relationships', kind: 'definition', title: 'unit rate', content: `the amount of y for exactly one unit of x, such as miles per one minute or dollars per one hour; in y = kx it is k.` },
    { loId: 'm8math.comparing-proportional-relationships', kind: 'definition', title: 'slope', content: `the steepness of a line, measured as the rise for every 1 unit of run; for a proportional graph it equals the unit rate.` },
    { loId: 'm8math.comparing-proportional-relationships', kind: 'definition', title: 'proportional relationship', content: `a relationship of the form y = kx, whose graph is a straight line through the origin and whose table gives the same y ÷ x in every row.` },
  ],
  methods: [
    {
      title: 'Worked zara graph vs stated rate',
      steps: [
        `Extract Zara's rate from the graph. The marked point is (30, 6): 30 minutes, 6 miles. Divide y by x: 6 ÷ 30 = 0.2 miles per minute. That is the slope of her line and her unit rate.`,
        `Extract your rate from the sentence. 5 miles in 20 minutes means 5 ÷ 20 = 0.25 miles per minute.`,
        `Match the units. Both rates are already miles per minute, so nothing needs converting.`,
        `Compare: 0.25 is bigger than 0.2, so you cover more ground every minute. You are faster.`,
        `Subtract to say by how much: 0.25 - 0.2 = 0.05 miles per minute. To feel that number, multiply both rates by 60 to get miles per hour: Zara rides 0.2 × 60 = 12 miles per hour and you ride 0.25 × 60 = 15 miles per hour, so you are 3 miles per hour faster.`,
        `Check by plugging the same time into both. In 20 minutes Zara covers 0.2 × 20 = 4 miles, and you covered 5. Same time, more distance, so the comparison holds.`,
      ],
      example: { problem: `Zara's app graphs her ride as a straight line through the origin and through the point (30, 6), with minutes on the horizontal axis and miles on the vertical axis. You rode 5 miles in 20 minutes. Who is faster, and by how much?`, solution: `You are faster: 0.25 miles per minute versus 0.2 miles per minute, a difference of 0.05 miles per minute (15 versus 12 miles per hour)` },
      relatedLoIds: ['m8math.comparing-proportional-relationships'],
    },
    {
      title: 'Worked dog walking graph vs equation',
      steps: [
        `Extract Gig A's rate from the graph. The marked point is (4, 50): 4 hours, $50. Divide y by x: 50 ÷ 4 = 12.5 dollars per hour.`,
        `WRONG: dividing 4 ÷ 50 = 0.08 and calling that the rate. CORRECT: the unit rate is dollars per ONE hour, so dollars go on top, 50 ÷ 4 = 12.5. Run over rise gives hours per dollar, which is not what the question asks and not what slope means.`,
        `Extract Gig B's rate from the equation. In p = 13h the rate is the number in front of h: 13 dollars per hour.`,
        'Match the units. Both are dollars per hour, so compare directly.',
        `WRONG: saying Gig A pays more because its line on the flyer looks so steep. CORRECT: the flyer's axis counts by 10s, which makes any line look steep, and Gig B has no picture to compare against anyway. The numbers decide: 13 is bigger than 12.5, so Gig B pays more per hour.`,
        'Subtract: 13 - 12.5 = 0.5, so Gig B pays $0.50 more for every hour worked.',
        `Check by plugging the same hours into both. At 4 hours, Gig A pays $50 (the marked point) and Gig B pays 13 × 4 = 52 dollars. That is $2 more over 4 hours, and 0.5 × 4 = 2, so the per-hour difference matches.`,
      ],
      example: { problem: `Two dog-walking gigs pay by the hour. Gig A's flyer shows a graph: pay in dollars against hours worked, a straight line through the origin and through the point (4, 50), on a vertical axis that counts by 10s. Gig B posts the equation p = 13h, where p is pay in dollars and h is hours. Which gig pays more per hour, and by how much?`, solution: 'Gig B pays more: $13 per hour versus $12.50 per hour, so $0.50 more per hour' },
      relatedLoIds: ['m8math.comparing-proportional-relationships'],
    },
  ],
  pointers: [
    { content: `Students often say "Scooter X is faster, because its line looks steep on the screen." — Steeper means faster only when both lines sit on the same axes. A phone screen can stretch or squash any line, so the picture proves nothing on its own. Read a point and divide: Scooter X covers 3 ÷ 15 = 0.2 miles per minute. Scooter Y's equation says 0.25 miles per minute. Since 0.25 is bigger than 0.2, Scooter Y is faster, by 0.25 - 0.2 = 0.05 miles per minute, which is 0.05 × 60 = 3 miles per hour.`, kind: 'common-error' },
    { content: `Students often say "Scooter X is faster, because 15 ÷ 3 = 5 is bigger than 0.25." — The unit rate is miles per ONE minute, so miles go on top: 3 ÷ 15 = 0.2 miles per minute, not 5. The 5 Priya found is minutes per mile, a different quantity, and it cannot be compared with 0.25 miles per minute. With both rates in miles per minute, 0.2 for X and 0.25 for Y, Scooter Y is faster by 0.05 miles per minute.`, kind: 'common-error' },
    { content: `A proportional relationship is described by one number, its unit rate k, so comparing two of them means comparing two values of k.`, kind: 'tip' },
    { content: `From a graph, pick any marked point and divide y by x, with y on top; that is the slope and the unit rate. From an equation y = kx, read k. From a table, divide y by x in any row. From a sentence, divide to get the amount per ONE unit.`, kind: 'tip' },
    { content: `Match the units before comparing: a rate per hour and a rate per minute must be converted to the same unit first.`, kind: 'tip' },
    { content: `The bigger unit rate is faster, pays more, and is steeper; when y is a cost, the smaller unit rate is cheaper. Subtract the two rates to say how much more per unit.`, kind: 'tip' },
    { content: `Steeper by eye only works when both lines are on the same axes. Across two separate graphs, or a graph and an equation, only the numbers decide.`, kind: 'tip' },
  ],
};
