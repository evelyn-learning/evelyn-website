/**
 * Chemistry — Acids & Bases: The pH Scale.
 *
 * pH as a compressed logarithmic readout of [H⁺] (NGSS HS-PS1-2, SEP-5):
 * powers-of-ten only, so pH of [H⁺] = 1 × 10⁻ⁿ M is just n. The star
 * misconception gets equal billing — "pH 4 is twice as acidic as pH 8"
 * treats a log scale like a ruler; each step is a factor of 10.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U10_PH_SCALE: LessonPlan = {
  id: 'evelyn.hs.chem.ph-scale.v1',
  title: 'The pH Scale',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.ph-scale',
      standard: 'CHEM-10.2',
      description:
        'Interpret the pH scale as a logarithmic measure of hydrogen-ion concentration, converting between [H⁺] values of the form 1 × 10⁻ⁿ M and pH and comparing acidity by factors of ten (NGSS HS-PS1-2, SEP-5).',
    },
  ],
  prerequisites: ['chem.acids-bases-definitions'],
  followUps: ['chem.neutralization-titration'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'pH as a compression trick — one small number standing in for concentrations that span a trillion-fold range.',
      script:
        'Your blood sits at pH 7.4, and if it drifts to 7.0 you are in a hospital. Stomach acid runs near pH 2, pool water is tested every morning, and a lake that slides from pH 6 to pH 4 loses its fish. Here is what makes that scale strange: those small numbers are hiding enormous jumps. The hydrogen-ion concentrations in chemistry run from about 1 M down to 0.00000000000001 M — fourteen zeros of range. Nobody wants to write that, so chemists compressed it into a single number from 0 to 14. Today you learn to read that compressed scale, and to un-compress it back into actual concentration.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ph-scale',
      kind: 'concept',
      goal: 'What pH measures, the powers-of-ten shortcut for reading it, and why every step is a factor of ten — not a step on a ruler.',
      keyIdeas: [
        'pH TRACKS HYDROGEN IONS — pH is a readout of [H⁺], the molarity of hydrogen ions in a solution. More H⁺ means a LOWER pH. The scale runs backwards from what most students expect, so pH 1 is fiercely acidic and pH 13 is fiercely basic.',
        'THE POWERS-OF-TEN RULE — when the concentration is written as [H⁺] = 1 × 10⁻ⁿ M, the pH is simply n. [H⁺] = 1 × 10⁻³ M → pH 3. [H⁺] = 1 × 10⁻¹¹ M → pH 11. Drop the "1 ×", read the exponent, drop the minus sign. (Formally pH = −log[H⁺]; the logarithm is what turns that exponent into the answer, and for concentrations that are not clean powers of ten you would need a calculator. In this lesson every concentration is a clean power of ten.)',
        'RUN IT BACKWARDS — going from pH to concentration is the same rule reversed: pH 5 means [H⁺] = 1 × 10⁻⁵ M. The pH IS the exponent, wearing a minus sign.',
        'WATER SETS THE MIDPOINT — pure water self-ionizes just slightly: [H⁺] = 1 × 10⁻⁷ M, so pH 7 is NEUTRAL. Below 7 is acidic (more H⁺ than pure water), above 7 is basic (less H⁺). Water also fixes the partner concentration: [H⁺] × [OH⁻] = 1 × 10⁻¹⁴ always, so acidic solutions still contain a trace of OH⁻ and basic ones a trace of H⁺.',
        'EVERY STEP IS A FACTOR OF TEN — this is the whole point of a logarithmic scale. pH 3 has 10 times the H⁺ of pH 4, 100 times the H⁺ of pH 5, and 1000 times the H⁺ of pH 6. To compare two solutions, subtract the pH values and raise 10 to that difference.',
        'THE TRAP: pH IS NOT A RULER — "pH 4 is twice as acidic as pH 8" treats the scale like a number line where 8 is double 4. It is not. The gap is 4 units, so the pH 4 solution has 10⁴ = 10,000 times more H⁺. Halving or doubling a pH number is meaningless; only DIFFERENCES matter, and each unit of difference is a ten-fold multiplier.',
        'WHY THAT MATTERS OUTSIDE THE LAB — an acid-rain lake dropping from pH 6 to pH 4 has not gotten "a bit worse"; its H⁺ concentration went up 100-fold. Blood held at 7.4 instead of 7.1 is holding H⁺ to within a factor of two, which is why the body spends real energy buffering it.',
        'STRENGTH IS NOT CONCENTRATION — pH reports how much H⁺ is actually present, which mixes two separate facts: how completely the acid ionizes (strong vs weak) and how much acid was dissolved (concentrated vs dilute). A dilute strong acid and a concentrated weak acid can land at the same pH.',
      ],
      vocabulary: [
        { term: 'pH', definition: 'a logarithmic measure of hydrogen-ion concentration; for [H⁺] = 1 × 10⁻ⁿ M the pH is n.' },
        { term: 'neutral', definition: 'a solution with [H⁺] = 1 × 10⁻⁷ M, equal to that of pure water — pH 7.' },
        { term: 'logarithmic scale', definition: 'a scale on which each one-unit step multiplies (or divides) the underlying quantity by ten.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-ph-from-concentration',
      kind: 'worked_example',
      problem:
        'A sample of black coffee has [H⁺] = 1 × 10⁻⁵ M. Find its pH and state whether it is acidic, neutral, or basic.',
      steps: [
        'Check the form first: the concentration is written as 1 × 10⁻ⁿ M, with n = 5. That is the clean powers-of-ten case, so the shortcut applies.',
        'Apply the rule: for [H⁺] = 1 × 10⁻ⁿ M, pH = n. Here n = 5, so pH = 5.',
        'Classify against water: pure water is 1 × 10⁻⁷ M at pH 7. Coffee at 1 × 10⁻⁵ M has MORE H⁺ than water — 100 times more, since the exponent moved two steps — so it is acidic.',
        'Sanity check the direction: a bigger [H⁺] gave a smaller pH (5 < 7), exactly as the backwards scale predicts.',
      ],
      answer: 'pH = 5, acidic — 100 times more H⁺ than pure water',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-log-scale-trap',
      kind: 'worked_example',
      problem:
        'A student compares lemon juice at pH 2 with pure water at pH 7 and writes: "Lemon juice is about 3.5 times as acidic, since 7 divided by 2 is 3.5." Diagnose the error and give the correct comparison.',
      steps: [
        'Name the move: the student divided one pH value by the other, treating pH like a linear ruler where 6 is twice as much as 3.',
        'Why it fails: pH is a logarithm — the number is an EXPONENT in disguise. Dividing exponents does not divide the quantities they stand for, and ratios of pH values carry no chemical meaning at all.',
        'The legal route: work with the DIFFERENCE. 7 − 2 = 5 units, and each unit is a factor of 10, so the H⁺ ratio is 10⁵ = 100,000.',
        'Confirm with the concentrations themselves: pH 2 means [H⁺] = 1 × 10⁻² M and pH 7 means [H⁺] = 1 × 10⁻⁷ M. Dividing, 10⁻² ÷ 10⁻⁷ = 10⁵. Lemon juice has 100,000 times the H⁺ of pure water, not 3.5 times.',
      ],
      answer: '100,000 times more H⁺ (10⁵) — subtract pH values, never divide them',
      estimatedMinutes: 3,
    },
    {
      id: 'try-concentration-from-ph',
      kind: 'try_yourself',
      problem: 'A cleaning solution is measured at pH 11. What is its hydrogen-ion concentration?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1 × 10⁻¹¹ M', correct: true },
        { id: 'b', text: '1 × 10¹¹ M' },
        { id: 'c', text: '11 M' },
        { id: 'd', text: '1 × 10⁻³ M' },
      ],
      expectedAnswer: '1 × 10⁻¹¹ M',
      hints: [
        'Run the powers-of-ten rule backwards: the pH value is the exponent, and the exponent is negative.',
        'pH 11 → [H⁺] = 1 × 10⁻¹¹ M. Check the sense of it: that is far less H⁺ than water\'s 1 × 10⁻⁷ M, which fits a basic cleaner.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-compare-acidity',
      kind: 'try_yourself',
      problem: 'Solution X has pH 3 and solution Y has pH 6. How do their hydrogen-ion concentrations compare?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'X has 1000 times more H⁺ than Y', correct: true },
        { id: 'b', text: 'X has 3 times more H⁺ than Y' },
        { id: 'c', text: 'X has twice as much H⁺ as Y' },
        { id: 'd', text: 'Y has 1000 times more H⁺ than X' },
      ],
      expectedAnswer: 'X has 1000 times more H⁺ than Y',
      hints: [
        'Subtract the pH values to get the number of steps, then make each step a factor of 10.',
        '6 − 3 = 3 steps, so the ratio is 10³. The LOWER pH is the one with more H⁺.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A soft drink is found to have [H⁺] = 1 × 10⁻⁴ M. What is its pH? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'The concentration is written as 1 × 10⁻ⁿ M, so the powers-of-ten rule applies directly.',
        'For [H⁺] = 1 × 10⁻ⁿ M the pH is n. Here the exponent is −4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ph-is-linear',
      kind: 'misconception_check',
      question:
        'A student says: "pH 4 is twice as acidic as pH 8, because 8 is double 4." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'pH 4 is twice as acidic as pH 8',
          misconception: 'Treating pH as a linear ruler, so that doubling or halving the pH number doubles or halves the acidity.',
          correctsTo:
            'pH is logarithmic, so only the DIFFERENCE between two pH values means anything, and each unit of difference is a factor of 10. From pH 8 to pH 4 is 4 units, so the pH 4 solution has 10⁴ = 10,000 times more H⁺ — not twice as much. Check it with concentrations: 1 × 10⁻⁴ M versus 1 × 10⁻⁸ M is a 10,000-fold gap.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'pH reports [H⁺], and it runs backwards: more H⁺ means a lower pH.',
        'Powers-of-ten rule: for [H⁺] = 1 × 10⁻ⁿ M the pH is n — and running it backwards, pH n means [H⁺] = 1 × 10⁻ⁿ M.',
        'Pure water is [H⁺] = 1 × 10⁻⁷ M → pH 7, the neutral midpoint; below is acidic, above is basic, and [H⁺] × [OH⁻] = 1 × 10⁻¹⁴ always.',
        'Compare acidity by SUBTRACTING pH values and raising 10 to the difference: pH 3 versus pH 6 is 10³ = 1000 times more H⁺.',
        'The trap: pH is not a ruler — "pH 4 is twice as acidic as pH 8" is wrong; it is 10,000 times more acidic.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'The pH Scale' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
