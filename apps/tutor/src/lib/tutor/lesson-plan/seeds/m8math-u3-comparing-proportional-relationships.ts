/**
 * Grade 8 Math — Proportional Relationships & Slope: Comparing Proportional
 * Relationships.
 *
 * PROCEDURE-LED. Row 3.1 established that the slope of a proportional graph
 * IS the unit rate. This row puts that fact to work (CCSS 8.EE.B.5): two
 * proportional relationships arrive in two different forms — one as a graph,
 * the other as an equation, a table, or a stated rate — and the student
 * extracts one unit rate from each, matches the units, and decides which is
 * faster, cheaper, or steeper, and by how much. The concept segment is a
 * short recipe (pull the rate out of each form, match units, compare,
 * subtract) rather than a new mental model. Both worked examples run the
 * same moves so the pattern is unmistakable, and every comparison ends with
 * a check that plugs one shared x-value into both relationships. Three traps
 * this plan is built to kill: judging steepness by eye across two graphs
 * with different axis scales, dividing run by rise when reading a rate off a
 * graph point, and comparing a per-hour rate against a per-minute rate
 * without converting.
 *
 * SCOPE GUARD: Grade 8 row 3.2 compares two proportional relationships
 * presented in different ways (one as a graph, one as an equation, a table,
 * or a stated rate) by extracting each unit rate/slope and deciding which is
 * faster, cheaper, or steeper. Withholds: comparing non-proportional linear
 * functions (rate AND initial value) → row 6.3 (8.F.A.2). Concretely: every
 * relationship in this plan is proportional — every graph is a straight line
 * through the origin, every equation has the form y = kx with nothing added,
 * every table has a constant y ÷ x — so there is never an initial value to
 * compare and the words "y-intercept" and "initial value" do not appear as
 * things to find. The unit rate is always pulled from a graph by dividing
 * the y-coordinate of one marked point by its x-coordinate (the origin is
 * the other point, for free); the plan never computes rise over run between
 * two arbitrary points (row 3.3), never writes an equation from a graph that
 * shows an intercept (row 3.4), and never classifies a slope as zero or
 * undefined. Below, assumed and recalled in a clause but never re-taught:
 * unit rates and the constant of proportionality
 * (`m7math-u3-ratios-and-unit-rates.ts`,
 * `m7math-u3-constant-of-proportionality.ts`), the through-the-origin test
 * (`m7math-u3-proportional-relationships.ts`), and slope = unit rate = k
 * (row 3.1, `unit-rate-as-slope`). A one-line unit conversion (gallons per
 * hour → gallons per minute, miles per minute → miles per hour) DOES appear,
 * because two rates cannot be compared until they are per the same unit;
 * that is Grade 7 unit-rate ground used as a tool, not taught. No proportion
 * is ever solved by cross-multiplication.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U3_COMPARING_PROPORTIONAL_RELATIONSHIPS: LessonPlan = {
  id: 'evelyn.ms.m8math.comparing-proportional-relationships.v1',
  title: 'Comparing Proportional Relationships',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.comparing-proportional-relationships',
      standard: 'M8MATH-3.2',
      description:
        'Compare two proportional relationships presented in different ways (one as a graph, one as an equation, a table, or a stated rate) by extracting each unit rate/slope and deciding which is faster, cheaper, or steeper (CCSS 8.EE.B.5).',
    },
  ],
  prerequisites: ['m8math.unit-rate-as-slope'],
  followUps: ['m8math.slope-from-similar-triangles'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hand the student two proportional relationships in two different forms, so the problem of comparing across forms is felt before the recipe is given.',
      script:
        'Zara says her bike route to school is faster than yours, and she has proof: her fitness app shows a graph, distance in miles on the vertical axis, time in minutes on the horizontal axis, a straight line from the origin that passes through the point (30, 6). You do not have a graph. All you know is that you rode 5 miles in 20 minutes this morning. Her evidence is a picture and yours is a sentence, so you cannot lay them side by side. Here is the thing, though: both of these are proportional relationships, and you already know that a proportional relationship is completely described by one number, its unit rate, which is also the slope of its graph. If you can pull that one number out of the picture and that one number out of the sentence, the comparison is just two numbers. Today you learn to do exactly that, whatever form the two relationships come in.',
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-extract-match-compare',
      kind: 'concept',
      goal: 'Install the extract-match-compare-subtract recipe, one extraction move per representation, and the two places the comparison goes wrong.',
      keyIdeas: [
        'ONE NUMBER DESCRIBES THE WHOLE RELATIONSHIP — a proportional relationship is y = kx, and k is the unit rate: the miles per one minute, the dollars per one hour, the pages per one minute. Since k is the whole story, comparing two proportional relationships means comparing two values of k. A gig that pays $12 per hour beats one that pays $11.50 per hour, and no other detail changes that.',
        'FROM A GRAPH, DIVIDE y BY x AT ANY MARKED POINT — the line goes through the origin, so any other point on it gives the rate: pick a point you can read exactly, such as (4, 50), and divide the y-coordinate by the x-coordinate, 50 ÷ 4 = 12.5. That number is the slope, the rise for every 1 unit of run, and it is the unit rate, exactly as you found last lesson. Keep y on top: it is dollars per hour, so dollars go on top and hours go on the bottom.',
        'FROM AN EQUATION, A TABLE, OR A SENTENCE — in y = 13x the rate is the 13, sitting right in front of the x. In a table, divide y by x in any row, because a proportional table gives the same answer in every row. In a sentence like "$30 for 2.5 hours", divide to get the rate per ONE unit: 30 ÷ 2.5 = 12 dollars per hour. Whatever the form, you are hunting for the same thing, the amount of y for one unit of x.',
        'MATCH THE UNITS BEFORE YOU COMPARE — 90 gallons per hour and 2.5 gallons per minute are both unit rates, but they are per different units, and 90 is not bigger than 2.5 in any way that matters. Convert one of them first: 90 gallons per hour is 90 ÷ 60 = 1.5 gallons per minute, and now 2.5 beats 1.5. Both rates must be per the same one unit, or the comparison is meaningless.',
        'DECIDE IN CONTEXT, THEN SUBTRACT — the bigger unit rate is the faster speed, the higher pay, the steeper line. When y is a cost, the smaller unit rate is the cheaper one. Subtracting the two rates tells how much more per unit: 13 dollars per hour minus 12.5 dollars per hour is 0.5 dollars per hour, so one gig pays $0.50 more for every hour worked.',
        'STEEPER BY EYE ONLY WORKS ON THE SAME AXES — if two lines are drawn on the same coordinate plane, the steeper one has the bigger unit rate, and you can see the winner. Two separate graphs are a different story: a vertical axis that counts by 10s makes any line look steep, and one that counts by 1s makes the same line look flat. Across two pictures, only the numbers decide, so read a point and divide.',
      ],
      vocabulary: [
        { term: 'unit rate', definition: 'the amount of y for exactly one unit of x, such as miles per one minute or dollars per one hour; in y = kx it is k.' },
        { term: 'slope', definition: 'the steepness of a line, measured as the rise for every 1 unit of run; for a proportional graph it equals the unit rate.' },
        { term: 'proportional relationship', definition: 'a relationship of the form y = kx, whose graph is a straight line through the origin and whose table gives the same y ÷ x in every row.' },
      ],
      suggestedTools: ['show_function_graph', 'show_table', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-zara-graph-vs-stated-rate',
      kind: 'worked_example',
      problem:
        'Zara\'s app graphs her ride as a straight line through the origin and through the point (30, 6), with minutes on the horizontal axis and miles on the vertical axis. You rode 5 miles in 20 minutes. Who is faster, and by how much?',
      steps: [
        'Extract Zara\'s rate from the graph. The marked point is (30, 6): 30 minutes, 6 miles. Divide y by x: 6 ÷ 30 = 0.2 miles per minute. That is the slope of her line and her unit rate.',
        'Extract your rate from the sentence. 5 miles in 20 minutes means 5 ÷ 20 = 0.25 miles per minute.',
        'Match the units. Both rates are already miles per minute, so nothing needs converting.',
        'Compare: 0.25 is bigger than 0.2, so you cover more ground every minute. You are faster.',
        'Subtract to say by how much: 0.25 - 0.2 = 0.05 miles per minute. To feel that number, multiply both rates by 60 to get miles per hour: Zara rides 0.2 × 60 = 12 miles per hour and you ride 0.25 × 60 = 15 miles per hour, so you are 3 miles per hour faster.',
        'Check by plugging the same time into both. In 20 minutes Zara covers 0.2 × 20 = 4 miles, and you covered 5. Same time, more distance, so the comparison holds.',
      ],
      answer: 'You are faster: 0.25 miles per minute versus 0.2 miles per minute, a difference of 0.05 miles per minute (15 versus 12 miles per hour)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dog-walking-graph-vs-equation',
      kind: 'worked_example',
      problem:
        'Two dog-walking gigs pay by the hour. Gig A\'s flyer shows a graph: pay in dollars against hours worked, a straight line through the origin and through the point (4, 50), on a vertical axis that counts by 10s. Gig B posts the equation p = 13h, where p is pay in dollars and h is hours. Which gig pays more per hour, and by how much?',
      steps: [
        'Extract Gig A\'s rate from the graph. The marked point is (4, 50): 4 hours, $50. Divide y by x: 50 ÷ 4 = 12.5 dollars per hour.',
        'WRONG: dividing 4 ÷ 50 = 0.08 and calling that the rate. CORRECT: the unit rate is dollars per ONE hour, so dollars go on top, 50 ÷ 4 = 12.5. Run over rise gives hours per dollar, which is not what the question asks and not what slope means.',
        'Extract Gig B\'s rate from the equation. In p = 13h the rate is the number in front of h: 13 dollars per hour.',
        'Match the units. Both are dollars per hour, so compare directly.',
        'WRONG: saying Gig A pays more because its line on the flyer looks so steep. CORRECT: the flyer\'s axis counts by 10s, which makes any line look steep, and Gig B has no picture to compare against anyway. The numbers decide: 13 is bigger than 12.5, so Gig B pays more per hour.',
        'Subtract: 13 - 12.5 = 0.5, so Gig B pays $0.50 more for every hour worked.',
        'Check by plugging the same hours into both. At 4 hours, Gig A pays $50 (the marked point) and Gig B pays 13 × 4 = 52 dollars. That is $2 more over 4 hours, and 0.5 × 4 = 2, so the per-hour difference matches.',
      ],
      answer: 'Gig B pays more: $13 per hour versus $12.50 per hour, so $0.50 more per hour',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sticker-packs-graph-vs-table',
      kind: 'try_yourself',
      problem:
        'Two online stores sell the same sticker packs at a proportional price. Store P\'s price is shown by a graph: a straight line through the origin and through the point (6, 15), with packs on the horizontal axis and dollars on the vertical axis. Store Q\'s price is shown by a table: packs 4, 8, 12 and dollars 9, 18, 27. Which store is cheaper per pack, and by how much?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Store P, by $0.25 per pack' },
        { id: 'b', text: 'Store Q, by $0.25 per pack', correct: true },
        { id: 'c', text: 'Store Q, by $6 per pack' },
        { id: 'd', text: 'Store P, because $15 is less than $18' },
      ],
      expectedAnswer: 'Store Q, by $0.25 per pack',
      hints: [
        'Pull one unit rate out of each form. From the graph, divide the y-coordinate of the marked point by its x-coordinate. From the table, divide dollars by packs in any row.',
        'Store P is 15 ÷ 6 dollars per pack and Store Q is 9 ÷ 4 dollars per pack. Cheaper means the SMALLER rate, and the difference is between the two per-pack rates, not between two totals.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-faucets-graph-vs-stated-rate',
      kind: 'try_yourself',
      problem:
        'Two faucets fill a tank at steady rates. Faucet A\'s flow is shown by a graph: a straight line through the origin and through the point (4, 10), with minutes on the horizontal axis and gallons on the vertical axis. Faucet B is labeled "90 gallons per hour". Which faucet fills faster, and by how much per minute?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Faucet B, by 80 gallons per minute' },
        { id: 'b', text: 'Faucet A, by 2.5 gallons per minute' },
        { id: 'c', text: 'Faucet B, by 1.1 gallons per minute' },
        { id: 'd', text: 'Faucet A, by 1 gallon per minute', correct: true },
      ],
      expectedAnswer: 'Faucet A, by 1 gallon per minute',
      hints: [
        'Faucet A\'s rate is gallons divided by minutes at the marked point, with gallons on top. Faucet B\'s rate is per HOUR, and the question asks per minute, so convert it before comparing.',
        'There are 60 minutes in an hour, so 90 gallons per hour is 90 ÷ 60 gallons per minute. Compare that with 10 ÷ 4, then subtract the smaller rate from the larger one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-babysitting-difference',
      kind: 'try_yourself',
      problem:
        'Ava\'s babysitting pay is shown by a graph: a straight line through the origin and through the point (4, 54), with hours on the horizontal axis and dollars on the vertical axis. Ben\'s babysitting pay follows the equation p = 12h, where p is dollars and h is hours. How many more dollars per hour does Ava earn than Ben? Type your answer as a decimal number.',
      responseFormat: 'numeric',
      expectedAnswer: '1.5',
      hints: [
        'Ava\'s rate is the y-coordinate of the marked point divided by its x-coordinate. Ben\'s rate is the number in front of h in his equation.',
        'Work out 54 ÷ 4 and then subtract 12 from it. Both rates are already dollars per hour, so no unit conversion is needed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-steep-by-eye-and-run-over-rise',
      kind: 'misconception_check',
      question:
        'Kai and Priya compare two e-scooters. Scooter X\'s speed is shown on a phone screen as a graph: a straight line through the origin and through the point (15, 3), minutes across and miles up. Scooter Y follows the equation d = 0.25t, with d in miles and t in minutes. Kai says X is faster because its line looks really steep on the screen. Priya says X is faster because 15 ÷ 3 = 5, and 5 is much bigger than 0.25. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'Scooter X is faster, because its line looks steep on the screen.',
          misconception: 'Judging steepness by eye on a single graph, when the look of a line depends on how the axes are scaled and there is no second line on the same axes to compare against.',
          correctsTo:
            'Steeper means faster only when both lines sit on the same axes. A phone screen can stretch or squash any line, so the picture proves nothing on its own. Read a point and divide: Scooter X covers 3 ÷ 15 = 0.2 miles per minute. Scooter Y\'s equation says 0.25 miles per minute. Since 0.25 is bigger than 0.2, Scooter Y is faster, by 0.25 - 0.2 = 0.05 miles per minute, which is 0.05 × 60 = 3 miles per hour.',
        },
        {
          answer: 'Scooter X is faster, because 15 ÷ 3 = 5 is bigger than 0.25.',
          misconception: 'Dividing run by rise, which gives minutes per mile, and then comparing that number against a rate in miles per minute.',
          correctsTo:
            'The unit rate is miles per ONE minute, so miles go on top: 3 ÷ 15 = 0.2 miles per minute, not 5. The 5 Priya found is minutes per mile, a different quantity, and it cannot be compared with 0.25 miles per minute. With both rates in miles per minute, 0.2 for X and 0.25 for Y, Scooter Y is faster by 0.05 miles per minute.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A proportional relationship is described by one number, its unit rate k, so comparing two of them means comparing two values of k.',
        'From a graph, pick any marked point and divide y by x, with y on top; that is the slope and the unit rate. From an equation y = kx, read k. From a table, divide y by x in any row. From a sentence, divide to get the amount per ONE unit.',
        'Match the units before comparing: a rate per hour and a rate per minute must be converted to the same unit first.',
        'The bigger unit rate is faster, pays more, and is steeper; when y is a cost, the smaller unit rate is cheaper. Subtract the two rates to say how much more per unit.',
        'Steeper by eye only works when both lines are on the same axes. Across two separate graphs, or a graph and an equation, only the numbers decide.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Comparing Proportional Relationships' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
