/**
 * Grade 6 Math — Percent & Measurement Conversion: Finding the Percent of a
 * Quantity.
 *
 * PROCEDURE-LED lesson for the m6math fan-out. Lesson 2.1 built percent as a
 * rate per 100; this lesson turns that meaning into a two-move algorithm a
 * student can run on any whole-number quantity: find the value of 1% by
 * dividing the whole by 100, then multiply that value by the percent number
 * (CCSS 6.RP.A.3c). The one-step shortcut — writing the percent as a decimal
 * and multiplying straight through — is taught right alongside it as the
 * same move done in a different order, not as a separate rule to memorize.
 * Two traps this plan is built to kill: treating the percent number itself
 * as the answer, and multiplying the whole by the percent number without
 * ever scaling it down by 100 first.
 *
 * SCOPE GUARD: Grade 6 row 2.2 finds the PERCENT OF a whole-number quantity —
 * given a whole and a percent, find the part — using rate-per-100 reasoning:
 * find the value of 1% by dividing the whole by 100, then scale it by the
 * percent number, or equivalently multiply the whole by the percent's
 * decimal form. It never computes percent increase or decrease, percent
 * error, simple interest, or tax/tip/discount/markup; all of those stay in
 * Grade 7 (m7math U4). It also never runs the relationship in the other
 * direction: given a part and a percent, finding the whole is row 2.3 and is
 * not taught or assessed here. Every whole quantity and every percent in
 * this plan is a whole number; the only non-whole values that appear are the
 * intermediate value-of-1% computations (0.8, 0.4, 0.25, and similar), which
 * are a stepping stone inside the method, not a concept this lesson asks the
 * student to name or interpret on their own.
 *
 * NOTE ON prerequisites/followUps: this row's chain is 2.1 -> 2.2 -> 2.3.
 * Row 2.1 (percent-as-rate-per-100) and row 2.3
 * (finding-the-whole-given-a-part-and-percent) are authored in the same
 * fan-out batch as this file and are not yet registered when this file is
 * written, but the controller registers and lints all 40 rows together, so
 * both arrays below are populated with their real loIds now.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U2_FINDING_THE_PERCENT_OF_A_QUANTITY: LessonPlan = {
  id: 'evelyn.ms.m6math.finding-the-percent-of-a-quantity.v1',
  title: 'Finding the Percent of a Quantity',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.finding-the-percent-of-a-quantity',
      standard: 'M6MATH-2.2',
      description:
        'Find the percent of a whole-number quantity (e.g., 30% of 60) using rate-per-100 reasoning: find the value of 1% by dividing the whole by 100, then multiply by the percent number (CCSS 6.RP.A.3c).',
    },
  ],
  prerequisites: ['m6math.percent-as-rate-per-100'],
  followUps: ['m6math.finding-the-whole-given-a-part-and-percent'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pose a percent-of-a-quantity question the student cannot yet answer with a reliable method, so the algorithm feels needed.',
      script:
        'Your class runs a canned-food drive for the shelter. The class collects 80 cans in total, and Ms. Diaz says 25% of all those cans came from just one student, Marcus. How many cans did Marcus donate by himself? You could guess a number that sounds about right, but a guess is not a method, and it will not work on the next problem with different numbers. Today you get a two-move tool that turns any percent of any whole-number quantity into an answer you can check, every time.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-one-percent-then-scale',
      kind: 'concept',
      goal: 'Install the value-of-1% algorithm, its one-step decimal shortcut, and a benchmark-percent way to check any answer.',
      keyIdeas: [
        'PERCENT MEANS PER 100 — a percent compares a number to 100. To find a percent OF an actual quantity, you scale that per-100 rate up or down until it matches the real whole.',
        'FIND THE VALUE OF 1% FIRST — the value of 1% of any quantity is the whole divided by 100. For 80 cans, 1% of 80 is 80 divided by 100, which is 0.8 cans. That 0.8 is not an answer to anything by itself; it is the building block for every other percent of 80.',
        'MULTIPLY BY THE PERCENT NUMBER — once you know the value of 1%, multiply it by however many percent you actually need. 25% of 80 is 25 copies of 1% of 80, so it is 0.8 times 25, which is 20.',
        'THE SHORTCUT: PERCENT AS A DECIMAL — the two moves above (divide by 100, then multiply by the percent number) can be done in one step: write the percent as a decimal by dividing it by 100, then multiply that decimal straight by the whole. 25% is 0.25, and 0.25 times 80 is 20, the same answer, found in one move instead of two.',
        'BENCHMARK PERCENTS CHECK YOUR ANSWER — 10% of a quantity is the quantity divided by 10, and 50% of a quantity is half of it. For 80 cans, 10% is 8 and 50% is 40, so 25% has to land somewhere between those two, closer to 8 since 25 is closer to 10 than to 50. 20 fits.',
        'THE PERCENT NUMBER IS NEVER THE ANSWER BY ITSELF — 25% of 80 is not 25, and it is not 80 times 25 either. The percent number always has to be scaled down by 100, either by finding 1% first or by converting it to a decimal, before it multiplies the whole.',
      ],
      vocabulary: [
        { term: 'percent', definition: 'a rate that compares a number to 100; 25% means 25 out of every 100.' },
        {
          term: 'benchmark percent',
          definition: 'an easy percent to compute in your head, such as 10%, 25%, or 50%, used to estimate or check another percent.',
        },
        {
          term: 'decimal equivalent',
          definition: 'a percent written as a decimal, found by dividing the percent number by 100; the decimal equivalent of 25% is 0.25.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cans-donated',
      kind: 'worked_example',
      problem: 'Your class collects 80 cans for a food drive. Marcus donated 25% of all the cans by himself. How many cans did Marcus donate?',
      steps: [
        'Restate the question in the tool\'s terms: you need 25% of 80.',
        'Find the value of 1% first by dividing the whole by 100: 80 divided by 100 is 0.8. So 1% of 80 cans is 0.8 cans.',
        'Multiply the value of 1% by the percent number you actually need: 0.8 times 25 is 20.',
        'Check with a benchmark: 25% is one quarter, and 80 divided by 4 is also 20, so the two methods agree.',
        'Check the size: 25% is less than 50%, so the answer must be less than half of 80, which is 40. 20 is less than 40, so the size holds up.',
        'Read it back into the story: Marcus donated 20 of the 80 cans.',
      ],
      answer: '20 cans',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-travel-team',
      kind: 'worked_example',
      problem: '40 players try out for a soccer team. 15% of them make the travel team. How many players make the travel team?',
      steps: [
        'Size test first: 15% is less than 20%, so the answer has to be less than one-fifth of 40 players, which is 8. Expect a number smaller than 8.',
        'Find the value of 1% by dividing the whole by 100: 40 divided by 100 is 0.4. So 1% of 40 players is 0.4 players.',
        'Multiply the value of 1% by the percent number: 0.4 times 15 is 6.',
        'WRONG: multiplying the whole quantity by the percent NUMBER without ever dividing by 100, giving 40 times 15, which is 600. CORRECT: the percent number always has to be scaled down by 100 first, either by finding 1% and multiplying, or by writing the percent as a decimal (15% is 0.15) and multiplying that decimal by the whole: 0.15 times 40 is 6. A team of 40 players cannot produce 600 travel-team players, so the size test catches this mistake immediately.',
        'Benchmark check: 10% of 40 is 4, and 5% of 40 is half of that, which is 2. 15% is 10% plus 5%, so 4 plus 2 is 6, matching the earlier answer.',
        'Read it back into the story: 6 of the 40 players make the travel team.',
      ],
      answer: '6 players',
      estimatedMinutes: 3,
    },
    {
      id: 'try-playlist-hip-hop',
      kind: 'try_yourself',
      problem: 'You have 50 songs on a playlist. 20% of them are hip-hop songs. How many songs on the playlist are hip-hop?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '20 songs' },
        { id: 'b', text: '30 songs' },
        { id: 'c', text: '10 songs', correct: true },
        { id: 'd', text: '2.5 songs' },
      ],
      expectedAnswer: '10 songs',
      hints: [
        'Find the value of 1% first: divide 50 by 100. Then multiply that value by the percent number you need.',
        '1% of 50 is 0.5. Twenty percent is 20 copies of that 1%, so multiply 0.5 by 20.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-trading-cards',
      kind: 'try_yourself',
      problem: 'Jayden has 90 trading cards. 10% of them are rare cards. How many of Jayden\'s cards are rare?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '900 cards' },
        { id: 'b', text: '10 cards' },
        { id: 'c', text: '81 cards' },
        { id: 'd', text: '9 cards', correct: true },
      ],
      expectedAnswer: '9 cards',
      hints: [
        '10% of a quantity is that quantity divided by 10.',
        '90 divided by 10 is 9. Check it the other way too: 1% of 90 is 0.9, and 0.9 times 10 is also 9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-race-runners',
      kind: 'try_yourself',
      problem: 'A charity 5K race has 120 runners registered. 5% of them are under age 10. How many of the registered runners are under age 10? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '6',
      hints: [
        'Find the value of 1% first by dividing 120 by 100.',
        '10% of 120 is 12. Since 5% is half of 10%, take half of 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-percent-number-vs-scaled-answer',
      kind: 'misconception_check',
      question:
        'A class of 25 students votes on the class-trip lunch, and 40% of them vote for pizza. One student answers that 40 students voted for pizza. Another student answers 1,000 students. What went wrong in each case?',
      commonErrors: [
        {
          answer: '40 students',
          misconception: 'Treating the percent number itself as the number of students, without ever scaling it to the actual class size.',
          correctsTo:
            'The class only has 25 students in it, so the answer cannot be bigger than 25, and 40 already is. Find the value of 1% first: 25 divided by 100 is 0.25. Then multiply by the percent number: 0.25 times 40 is 10. Ten students voted for pizza.',
        },
        {
          answer: '1,000 students',
          misconception: 'Multiplying the whole quantity by the percent number directly, without dividing by 100 first: 25 times 40 is 1,000.',
          correctsTo:
            'The percent number always has to be scaled down before it multiplies the whole, either by finding the value of 1% first or by writing the percent as a decimal: 40% is 0.40. Then 0.40 times 25 is 10. A class of 25 students cannot produce an answer of 1,000, so the size of that answer is the first clue something went wrong.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A percent is a rate per 100; finding the percent of a quantity means scaling that rate to match the actual whole.',
        'Find the value of 1% first by dividing the whole quantity by 100.',
        'Multiply the value of 1% by the percent number to find the answer.',
        'The shortcut: write the percent as a decimal (divide by 100) and multiply it directly by the quantity, for the exact same answer in one step.',
        'Benchmark percents such as 10%, 25%, and 50% give a fast way to estimate or check an answer.',
        'The percent number by itself is never the answer, and the whole times the percent number by itself is never the answer either; both need the percent scaled down by 100 first.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Finding the Percent of a Quantity' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
