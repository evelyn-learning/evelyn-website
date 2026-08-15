/**
 * Chemistry — Unit 10.2: The pH Scale.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u10-ph-scale.ts
 * (planId evelyn.hs.chem.ph-scale.v1).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.ph-scale';
const PLAN_ID = 'evelyn.hs.chem.ph-scale.v1';

export const BASELINE_CHEM_U10_PH_SCALE: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 10,
  cedTopic: '10.2',
  cedTitle: 'The pH Scale',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'What pH reports',
      content:
        'pH is a readout of [H⁺], the molarity of hydrogen ions. It runs BACKWARDS: more H⁺ means a LOWER pH, so pH 1 is fiercely acidic and pH 13 fiercely basic. The scale exists to compress concentrations spanning about 1 M down to 0.00000000000001 M into one number from 0 to 14.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Powers-of-ten rule',
      content:
        'When [H⁺] = 1 × 10⁻ⁿ M, pH = n. Drop the "1 ×", read the exponent, drop the minus sign: 1 × 10⁻³ M → pH 3. Formally pH = −log[H⁺]; the logarithm is what converts that exponent into the answer. Concentrations that are not clean powers of ten need a calculator.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Running it backwards',
      content:
        'pH → concentration is the same rule reversed: pH 5 means [H⁺] = 1 × 10⁻⁵ M, pH 11 means [H⁺] = 1 × 10⁻¹¹ M. The pH IS the exponent, wearing a minus sign.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Water sets the midpoint',
      content:
        'Pure water self-ionizes slightly: [H⁺] = 1 × 10⁻⁷ M, so pH 7 is NEUTRAL. Below 7 is acidic (more H⁺ than water), above 7 basic. Water also fixes the partner: [H⁺] × [OH⁻] = 1 × 10⁻¹⁴ always — acidic solutions still hold a trace of OH⁻ and basic ones a trace of H⁺.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Every step is a factor of ten',
      content:
        'That is the whole point of a logarithmic scale. pH 3 has 10× the H⁺ of pH 4, 100× that of pH 5, 1000× that of pH 6. To compare two solutions, SUBTRACT the pH values and raise 10 to the difference.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'pH is not a ruler',
      content:
        'Ratios of pH values carry no chemical meaning — only DIFFERENCES do. Doubling or halving a pH number says nothing; each unit of difference is a ten-fold multiplier on [H⁺]. Outside the lab this is why a lake falling from pH 6 to pH 4 has 100× the H⁺ it started with, and why blood held at 7.4 rather than 7.1 is being buffered to within a factor of two.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'pH mixes strength and concentration',
      content:
        'pH reports how much H⁺ is actually present, which folds together two separate facts: how completely the acid ionizes (strong vs weak) and how much acid was dissolved (concentrated vs dilute). A dilute strong acid and a concentrated weak acid can land at the same pH.',
    },
  ],
  methods: [
    {
      title: 'Convert between [H⁺] and pH, then classify the solution',
      when_to_use:
        'Given a concentration of the clean form 1 × 10⁻ⁿ M, or given a pH and asked for the concentration.',
      steps: [
        'Check the form: the concentration must read 1 × 10⁻ⁿ M for the shortcut to apply.',
        'Concentration → pH: pH = n, the exponent without its minus sign.',
        'pH → concentration: [H⁺] = 1 × 10⁻ⁿ M with n equal to the pH value.',
        'Classify against water at 1 × 10⁻⁷ M / pH 7 — more H⁺ (smaller n) is acidic, less H⁺ (bigger n) is basic.',
        'Sanity-check the direction: a bigger [H⁺] must give a SMALLER pH.',
      ],
      example: {
        problem: 'Black coffee has [H⁺] = 1 × 10⁻⁵ M. Find the pH and classify it.',
        solution:
          'n = 5, so pH = 5. Against water at 1 × 10⁻⁷ M the coffee holds 100 times more H⁺ (two exponent steps), so it is acidic — and 5 < 7 as the backwards scale requires.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Compare the acidity of two solutions',
      when_to_use:
        'When asked how many times more acidic one solution is than another, or when a comparison has been made by dividing pH values.',
      steps: [
        'Subtract the two pH values to get the number of steps between them (order does not matter; keep it positive).',
        'Raise 10 to that difference — that is the ratio of hydrogen-ion concentrations.',
        'Assign the ratio to the LOWER pH: the smaller pH is the one with more H⁺.',
        'Confirm with concentrations if the numbers are clean: 10⁻² ÷ 10⁻⁷ = 10⁵.',
        'Never divide pH values — that treats an exponent as if it were the quantity itself.',
      ],
      example: {
        problem: 'Lemon juice is pH 2 and pure water pH 7. How much more H⁺ does the lemon juice hold?',
        solution:
          '7 − 2 = 5 steps, so the ratio is 10⁵ = 100,000. Lemon juice has 100,000 times the H⁺ of water — not the "3.5 times" that dividing 7 by 2 suggests.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'The scale runs backwards. More H⁺ → lower pH. If your answer says a stronger acid has a higher pH, you inverted it.',
      kind: 'tip',
    },
    {
      content:
        'Powers-of-ten shortcut both ways: [H⁺] = 1 × 10⁻ⁿ M ↔ pH = n. Only valid when the coefficient is a clean 1.',
      kind: 'tip',
    },
    {
      content:
        'Never divide pH values. "pH 4 is twice as acidic as pH 8" is wrong by four orders of magnitude — the gap is 4 units, so 10⁴ = 10,000 times more H⁺.',
      kind: 'common-error',
    },
    {
      content:
        'Subtract, then exponentiate: pH 3 vs pH 6 is 3 steps → 10³ = 1000 times more H⁺ in the pH 3 solution.',
      kind: 'tip',
    },
    {
      content:
        '[H⁺] × [OH⁻] = 1 × 10⁻¹⁴ holds in every aqueous solution, so no solution is ever completely free of one or the other — pH 7 just means the two are equal at 1 × 10⁻⁷ M.',
      kind: 'edge-case',
    },
  ],
};
