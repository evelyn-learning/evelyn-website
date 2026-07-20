/**
 * ACT — Science / Scientific Math & Units in Context: no-calculator
 * arithmetic, unit tracking, and ratio reasoning from table values.
 *
 * A slice of every ACT Science passage asks you to actually COMPUTE
 * something from the data — a rate, a conversion, a concentration — but
 * NO CALCULATOR is allowed on ACT Science. The good news: the numbers are
 * always calculator-free by design, and answer choices are spaced far
 * enough apart that careful estimation beats slow exact arithmetic. This
 * lesson drills rounding-to-compute, ratio/proportion setups, and the
 * unit traps that catch students who compute correctly but stop one step
 * too early.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U4_SCIENTIFIC_MATH_UNITS: LessonPlan = {
  id: 'evelyn.testprep.act.scientific-math-units.v1',
  title: 'Scientific Math & Units in Context',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.scientific-math-units',
      standard: 'ACT-4.6',
      description:
        'Compute rates, conversions, and ratios from table values without a calculator by rounding to estimate and tracking units through every step.',
    },
  ],
  prerequisites: ['act.data-representation'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe "science math" as no-calculator estimation, not exact computation — lowering panic about arithmetic under time pressure.',
      script:
        "You get 40 questions, 35 minutes, and NO calculator on ACT Science — but only a handful of questions actually require you to compute anything. When they do, the numbers are built to be calculator-free: round to a clean value, set up a ratio, track your units, and you'll land on the one answer choice that's actually spaced apart from the rest. Today is about that method.",
      estimatedMinutes: 1,
    },
    {
      id: 'concept-scientific-math',
      kind: 'concept',
      goal: 'Rounding-to-estimate, ratio/proportion setups, and the unit traps that catch correct arithmetic with an unfinished conversion.',
      keyIdeas: [
        'NO CALCULATOR — and that is a clue, not a curse. If your arithmetic feels ugly, you have either misread the table or should be rounding, not grinding out exact digits.',
        'ROUND EARLY. Round table values to numbers that multiply and divide cleanly (48 → 50, 297 → 300) before you compute. ACT answer choices are spaced far enough apart that a rounded estimate still lands on exactly one of them.',
        'SET UP A RATIO, DON\'T MEMORIZE A FORMULA. Most "calculate" questions are a proportion between two rows of a table: find the rate/ratio from ONE row, then scale it by the same factor to reach the row (or value) the question asks about.',
        'TRACK UNITS AT EVERY STEP. Write (or say) the unit next to every number as you compute. If the units left in your final number don\'t match what the question asks for, you are not done — you skipped a conversion.',
        'CONVERT EVERY UNIT NAMED, NOT JUST THE OBVIOUS ONE. A question can ask you to convert time (minutes → hours) AND volume (mL → L) in the same problem. Finishing only one conversion is the single most common ACT Science math mistake.',
        'TRAP — ORDER OF MAGNITUDE: an answer choice will have the right digits but the decimal point (or a factor of 10, 60, or 1000) in the wrong place. These exist specifically to catch a skipped conversion.',
        'TRAP — BIGGER RAW NUMBER: concentration, density, and rate are all RATIOS (amount per unit), not raw totals. A distractor picks whichever sample has the larger raw amount instead of the larger ratio.',
        'IF A FORMULA APPEARS IN THE PASSAGE, USE IT AS GIVEN. ACT Science math never requires outside formulas — every relationship you need to compute with is stated or is directly readable from the table.',
      ],
      vocabulary: [
        { term: 'ratio / proportion', definition: 'a comparison of two quantities that scales together — find it from one table row, then scale it to answer about another.' },
        { term: 'unit conversion factor', definition: 'a multiplier (like 1000 mL = 1 L, or 60 min = 1 hr) used to switch a value from one unit to an equivalent value in another.' },
        { term: 'order of magnitude', definition: 'the power-of-ten size of a number; an order-of-magnitude trap answer is off by a factor of 10, 60, or 1000 from the correct value.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-rate-conversion',
      kind: 'worked_example',
      problem:
        'A collector gathered rainwater at a constant rate. Table 1 — Time (min): 5, 10, 15, 20; Volume collected (mL): 40, 80, 120, 160. Based on Table 1, if the rate stayed constant, how many total liters would be collected after 60 minutes?',
      steps: [
        'Find the rate from the table: 40 mL in 5 min is 8 mL per minute (check it: 80/10 = 8, 120/15 = 8, 160/20 = 8 — consistent).',
        'Set up the ratio to the target time: 8 mL/min × 60 min = 480 mL.',
        'Check units against the question: the question asks for LITERS, and 480 is in mL — not done yet.',
        'Convert mL to L: 480 mL ÷ 1000 = 0.48 L.',
        'Sanity check with the table pattern: 60 min is 4× the 15-min row (120 mL), and 4 × 120 = 480 mL. ✓',
      ],
      answer: '0.48 L',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ratio-trap',
      kind: 'worked_example',
      problem:
        'A passage gives the formula Density = mass ÷ volume. Table 2 — Sample A: mass 12 g, volume 4 mL. Sample B: mass 18 g, volume 9 mL. A student claims "Sample B is denser because it has more mass." Based on Table 2, is the student correct, and which sample is actually denser?',
      steps: [
        'Density is a RATIO (mass ÷ volume), not the raw mass — the student is falling for the bigger-raw-number trap.',
        'Compute Sample A: 12 g ÷ 4 mL = 3 g/mL.',
        'Compute Sample B: 18 g ÷ 9 mL = 2 g/mL.',
        'Compare the ratios, not the raw masses: 3 g/mL > 2 g/mL, so Sample A is denser even though it has the smaller mass.',
        'The student is WRONG — a larger raw mass does not mean a larger density unless the volume scales the same way.',
      ],
      answer: 'The student is incorrect; Sample A is denser (3 g/mL vs. 2 g/mL for Sample B).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-rate-hours',
      kind: 'try_yourself',
      problem:
        'Table 3 tracks a bacterial culture\'s optical density (OD) over time, starting from OD = 0 at time 0: Hour 1 — OD 0.2. Hour 2 — OD 0.4. Hour 3 — OD 0.6. Hour 4 — OD 0.8. Based on Table 3, assuming the growth rate stays constant, what optical density would be expected after 90 minutes of growth?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0.2' },
        { id: 'b', text: '0.3', correct: true },
        { id: 'c', text: '0.4' },
        { id: 'd', text: '1.5' },
      ],
      expectedAnswer: '0.3',
      hints: [
        'The table\'s rate is per HOUR (0.2 OD per hour), but the question gives minutes — convert 90 minutes to hours first.',
        '90 minutes = 1.5 hours. Multiply by the rate: 0.2 OD/hr × 1.5 hr = 0.3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-flow-liters',
      kind: 'try_yourself',
      problem:
        'A flow meter recorded water moving through a pipe at 300 mL every 2 minutes, a constant rate. At that rate, how many liters flow through the pipe in 1 hour (60 minutes)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0.9 L' },
        { id: 'b', text: '9 L', correct: true },
        { id: 'c', text: '90 L' },
        { id: 'd', text: '900 L' },
      ],
      expectedAnswer: '9 L',
      hints: [
        'First find the per-minute rate: 300 mL ÷ 2 min = 150 mL/min.',
        'Scale to 60 minutes: 150 mL/min × 60 min = 9000 mL, then convert to liters by dividing by 1000.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-concentration-compare',
      kind: 'try_yourself',
      problem:
        'Table 4 compares two fertilizer solutions. Solution X — 10 g of nutrient dissolved in 200 mL of water. Solution Y — 15 g of nutrient dissolved in 500 mL of water. Based on Table 4, which solution has the greater nutrient concentration (grams per 100 mL)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Solution Y, because it has more total nutrient (15 g vs. 10 g)' },
        { id: 'b', text: 'Solution X, because its concentration is 5 g per 100 mL versus Solution Y\'s 3 g per 100 mL', correct: true },
        { id: 'c', text: 'They are equal, because both solutions dissolve completely' },
        { id: 'd', text: 'Solution Y, because it uses more water (500 mL vs. 200 mL)' },
      ],
      expectedAnswer: 'Solution X, because its concentration is 5 g per 100 mL versus Solution Y\'s 3 g per 100 mL',
      hints: [
        'Concentration is a ratio (amount ÷ volume), not the raw grams alone — set up grams per 100 mL for each.',
        'X: 10 g ÷ 200 mL × 100 = 5 g/100 mL. Y: 15 g ÷ 500 mL × 100 = 3 g/100 mL.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-half-conversion',
      kind: 'misconception_check',
      question:
        'A student is asked to convert a flow of 250 mL/min into liters per hour. They compute 250 × 60 = 15,000 and select the choice "15,000 L/hr." What went wrong, and what should the answer be?',
      commonErrors: [
        {
          answer: '15,000 L/hr',
          misconception:
            'Converting minutes to hours but forgetting to also convert mL to L — the arithmetic is right, but the final unit is still wrong, leaving the answer 1000 times too large.',
          correctsTo:
            'Finish BOTH conversions named by the question: 250 mL/min × 60 min = 15,000 mL/hr, then divide by 1000 to get 15 L/hr. Whenever a question names two units to convert, check off both before picking a choice.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'No calculator: round table values to clean numbers and estimate — ACT answer choices are spaced apart enough for this to work.',
        'Set up unit-based questions as a ratio from one table row, then scale by the same factor to reach the value the question asks about.',
        'Convert EVERY unit named in the question and the answer choices, not just the first one you notice.',
        'Concentration, density, and rate are ratios, not raw amounts — compare the ratio, not whichever sample has the bigger number.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.6', cedTitle: 'Scientific Math & Units in Context' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
