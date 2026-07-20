/**
 * Digital SAT — Math / Problem-Solving and Data Analysis: Ratios, Rates,
 * Proportions & Unit Conversion.
 *
 * High-frequency skill across the Problem-Solving and Data Analysis domain,
 * and a hidden step inside many other questions (word problems, table/graph
 * reads). Focus on the digital-test traps: parts-vs-fraction-of-whole
 * confusion, mismatched proportion setups, conversion-factor inversion, and
 * combined work-rate problems. Desmos is allowed on every math question —
 * teach when it's faster to type a division than to cross-multiply by hand.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U3_RATIOS_RATES_UNITS: LessonPlan = {
  id: 'evelyn.testprep.dsat.ratios-rates-units.v1',
  title: 'Ratios, Rates, Proportions & Unit Conversion',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.ratios-rates-units',
      standard: 'DSAT-3.1',
      description:
        'Solve ratio, proportion, rate, and unit-conversion problems using proportional reasoning and dimensional analysis, including combined work-rate scenarios.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame ratios/rates/units as a Problem-Solving and Data Analysis staple that also lurks inside other question types.',
      script:
        'Problem-Solving and Data Analysis is roughly 15 percent of digital SAT Math — about 5 to 7 questions per test — and ratios, rates, and unit conversion are the backbone of that domain. They also sneak into word problems everywhere else on the test. The math itself is simple; the SAT hides it behind setup traps. Learn the traps and these become fast, reliable points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-traps',
      kind: 'concept',
      goal: 'Ratio and proportion setup, rates, dimensional analysis, and the recurring SAT traps around each.',
      keyIdeas: [
        'RATIO LANGUAGE — "a to b" or a:b compares PARTS, not a fraction of the total directly. TRAP — PARTS VS FRACTION OF WHOLE: if apples:oranges = 4:7, apples are 4 OUT OF 4+7=11 TOTAL PARTS (4/11 of the total), NOT 4/7.',
        'RATIO ORDER TRAP — the question sets the order. "Ratio of red to blue" must stay red:blue. Reducing 12:18 to 2:3 is fine; flipping it to 3:2 answers the wrong question.',
        'PROPORTION SETUP — a/b = c/d, cross-multiply to get ad = bc. Keep the SAME quantity in the SAME position in both fractions (both numerators the same unit, both denominators the same unit) before cross-multiplying — swapping a position silently inverts the answer.',
        'RATE = quantity per unit (miles per hour, pages per second, dollars per item). Write it as a fraction with units attached; a rate and its reciprocal (miles per hour vs. hours per mile) are easy to confuse — check that your final units match what the question asks for.',
        'CONVERSION FACTOR TRAP — the SAT often supplies the exact factor to use ("1 kilometer = 0.621 mile"). Use that number, not a memorized approximation, and sanity-check direction: converting to a BIGGER unit should shrink the number (multiply by the given decimal), converting to a SMALLER unit should grow it (divide by the given decimal, or multiply by its reciprocal).',
        'COMBINED WORK/RATE — if A finishes a job in a hours and B finishes it in b hours, their combined rate is 1/a + 1/b (job per hour). Combined TIME is the RECIPROCAL of that sum, not the sum of the times.',
        'DESMOS CHECK — the built-in calculator is available on every math question. Typing a division or a proportion as two lines and reading the value (or intersection) is a legitimate 15-second verification of a cross-multiplied answer.',
      ],
      vocabulary: [
        { term: 'ratio', definition: 'a comparison of two quantities by division, written a:b or a/b, preserving the order the question states.' },
        { term: 'proportion', definition: 'an equation stating two ratios are equal: a/b = c/d.' },
        { term: 'unit rate', definition: 'a rate expressed per a single unit of the other quantity, e.g. dollars per 1 item.' },
        { term: 'dimensional analysis', definition: 'converting units by multiplying by conversion-factor fractions arranged so the unwanted units cancel.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-direct-proportion',
      kind: 'worked_example',
      problem: 'A factory produces 180 gadgets every 4 hours, working at a constant rate. At this rate, how many gadgets does it produce in 10 hours?',
      steps: [
        'Set up a proportion keeping gadgets over hours on both sides: 180 gadgets / 4 hours = x gadgets / 10 hours.',
        'Cross-multiply: 4x = 180 × 10 = 1800.',
        'x = 450 gadgets.',
        'Sanity check: 10 hours is 2.5× the original 4 hours, and 180 × 2.5 = 450. ✓',
      ],
      answer: '450 gadgets',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-reciprocal-trap',
      kind: 'worked_example',
      problem: 'A printer produces 5 pages every 2 seconds, working at a constant rate. At this rate, how many seconds does it take to produce 300 pages?',
      steps: [
        'Keep the SAME quantity in the SAME position in both ratios: pages over seconds on both sides — 5 pages / 2 seconds = 300 pages / x seconds.',
        'TRAP — flipping the setup to seconds/pages = pages/seconds inverts the proportion and produces a nonsense result (more pages finishing FASTER). A quick magnitude check catches it: more pages must take MORE time.',
        'Cross-multiply correctly: 5x = 2 × 300 = 600.',
        'x = 120 seconds.',
      ],
      answer: '120 seconds',
      estimatedMinutes: 3,
    },
    {
      id: 'try-parts-of-whole',
      kind: 'try_yourself',
      problem: 'A fruit basket contains apples and oranges in the ratio 4:7. If the basket has 44 pieces of fruit total, how many are oranges?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '16' },
        { id: 'b', text: '20' },
        { id: 'c', text: '28', correct: true },
        { id: 'd', text: '31' },
      ],
      expectedAnswer: '28',
      hints: [
        'Total parts = 4 + 7 = 11, not 7.',
        'Each part = 44 / 11 = 4 pieces. Oranges are 7 parts: 7 × 4 = 28.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-conversion-factor',
      kind: 'try_yourself',
      problem: "A cyclist rides at a constant speed of 18 kilometers per hour. Using the conversion 1 kilometer = 0.621 mile, what is the cyclist's speed in miles per hour, to the nearest whole number?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '11', correct: true },
        { id: 'b', text: '18' },
        { id: 'c', text: '29' },
        { id: 'd', text: '6' },
      ],
      expectedAnswer: '11',
      hints: [
        'Multiply, don\'t divide: 18 km/hr × 0.621 mile/km.',
        '18 × 0.621 = 11.178, which rounds to 11.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-combined-work',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): Pipe A can fill a tank in 6 hours, and Pipe B can fill the same tank in 3 hours. Working together at their constant rates, how many hours does it take both pipes to fill the tank?',
      responseFormat: 'numeric',
      expectedAnswer: '2',
      hints: [
        'Combined rate = 1/6 + 1/3 tank per hour (get a common denominator).',
        '1/6 + 2/6 = 3/6 = 1/2 tank per hour. Time = 1 ÷ (1/2) = 2 hours.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ratio-order',
      kind: 'misconception_check',
      question: 'A class has 12 red marbles and 18 blue marbles. Asked for the ratio of red marbles to blue marbles, a student answers 3:2. What went wrong?',
      commonErrors: [
        {
          answer: '3:2',
          misconception: 'Reduced 12:18 correctly to 2:3, then wrote the reduced ratio in the wrong order.',
          correctsTo: 'The question asks red TO blue, so red must come first: 12:18 reduces to 2:3, not 3:2. Always match the order the question states, even after simplifying.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Ratio a:b means a parts to b parts; total parts = a + b — a part is a fraction of the TOTAL parts, not of the other quantity.',
        'Set up proportions with matching quantities in matching positions before cross-multiplying; a swapped position silently inverts the answer.',
        'When the SAT gives a conversion factor, use that exact number and sanity-check the direction — bigger target unit shrinks the number, smaller target unit grows it.',
        'Combined work/rate: add the individual rates (1/timeA + 1/timeB), then take the reciprocal to get the combined time.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Ratios, Rates, Proportions & Unit Conversion' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
