/**
 * Chemistry — Unit 1 topic 1.3: Measurement, SI Units & Significant
 * Figures.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u1-measurement-sig-figs.ts
 * (planId evelyn.hs.chem.measurement-sig-figs.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.measurement-sig-figs';
const PLAN_ID = 'evelyn.hs.chem.measurement-sig-figs.v1';

export const BASELINE_CHEM_U1_MEASUREMENT_SIG_FIGS: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Measurement, SI Units & Significant Figures',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'What a measurement is',
      content:
        'Every measured value = all the digits you are CERTAIN of, plus exactly ONE estimated digit. Reading a millimeter ruler as 4.27 cm means "4.2 for sure, 7 estimated." Counted objects and defined conversions are not measurements at all.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The SI backbone',
      content:
        'Five base units run chemistry: meter (m) length, kilogram (kg) mass, second (s) time, kelvin (K) temperature, mole (mol) amount. Everything else is derived — volume in cm³ (1 cm³ = 1 mL exactly), density in g/mL, energy in joules.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Metric prefixes rescale only',
      content:
        'kilo = 1000, centi = 1/100, milli = 1/1000, micro = 1/1000000, nano = 1/1000000000. Rewriting 2.50 g as 0.00250 kg changes the UNIT, not the certainty — both are three-significant-figure measurements.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Counting significant figures',
      content:
        '(1) Every nonzero digit counts. (2) Zeros BETWEEN nonzero digits count — 2005 g has 4. (3) LEADING zeros never count; they only park the decimal point — 0.0042 kg has 2. (4) TRAILING zeros count only when a decimal point is written — 0.04070 g has 4, but 4200 g has 2.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Multiply or divide → fewest significant figures',
      content:
        'The answer carries as many significant figures as the LEAST precise factor. 8.4 ÷ 3.75 = 2.24 on the calculator, but 8.4 has only 2 sig figs, so report 2.2.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Add or subtract → fewest decimal places',
      content:
        'A different question entirely: sums line up by PLACE VALUE, products by digit count. 108.5 + 3.27 = 111.77, but 108.5 is trustworthy only to the tenths place, so report 111.8 — which legitimately keeps four significant figures.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Exact numbers',
      content:
        'Counted objects (12 test tubes) and defined conversions (1 m = 100 cm, 1 L = 1000 mL) are infinitely precise and never limit an answer. Only measured values set the ceiling.',
    },
  ],
  methods: [
    {
      title: 'Report a calculated result to the correct precision',
      when_to_use: 'Any multi-step calculation built from measured quantities.',
      steps: [
        'Identify each operation in the chain and tag it: × or ÷ uses SIGNIFICANT FIGURES; + or − uses DECIMAL PLACES.',
        'Count the governing quantity for each input — sig figs for a product/quotient, decimal places for a sum/difference.',
        'Do the arithmetic unrounded, carrying extra digits through every intermediate step.',
        'Round ONCE at the end, to the limit set by the governing rule, and attach the unit.',
      ],
      example: {
        problem: 'mass = 24.62 g, volume = 10.0 mL by displacement. Report the density.',
        solution:
          'Division → sig-fig rule. 24.62 g has 4; 10.0 mL has 3 (trailing zero counts, decimal point written). 24.62 ÷ 10.0 = 2.462, rounded to 3 sig figs = 2.46 g/mL. The graduated cylinder, the sloppier instrument, sets the ceiling.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Count significant figures in a written value',
      when_to_use: 'When asked how many sig figs a measurement carries, especially with zeros.',
      steps: [
        'Start at the FIRST nonzero digit — everything to its left is a placeholder and is discarded.',
        'Count every digit from there to the last written digit, including zeros trapped between nonzeros.',
        'Include trailing zeros only if a decimal point appears anywhere in the number.',
        'If no decimal point is written and the number ends in zeros, treat those zeros as ambiguous placeholders and do not count them.',
      ],
      example: {
        problem: 'How many significant figures in 0.05060 g?',
        solution:
          'Discard the leading 0.0 placeholders and start at the 5. Count 5, the sandwiched 0, the 6, and the trailing 0 (a decimal point is written) = 4 significant figures.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'The #1 error: applying the multiply/divide rule to an addition. 108.5 + 3.27 is limited to ONE decimal place (111.8), not to three significant figures (112).',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'A sum may keep MORE significant figures than its smallest addend; it may never keep more decimal places than its coarsest one.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Leading zeros are never significant. 0.0030 kg and 3.0 g are the same measurement with 2 sig figs — the trailing zero counts, the front zeros never do.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Round once, at the very end. Rounding mid-calculation compounds the error; copying every calculator digit claims a precision the instrument never had.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Exact numbers (counts, defined conversions like 1 mL = 1 cm³ or 1 kg = 1000 g) have unlimited sig figs — never let them limit an answer.',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
  ],
};
