/**
 * Chemistry — Atomic Structure & Properties: Measurement, SI Units &
 * Significant Figures.
 *
 * The measurement grammar the whole course runs on (NGSS SEP-5): SI base
 * and derived units, metric prefixes, and the sig-fig rules that keep a
 * calculated answer honest. The two classic errors get equal billing —
 * counting leading zeros, and applying the multiply/divide rule to a sum.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U1_MEASUREMENT_SIG_FIGS: LessonPlan = {
  id: 'evelyn.hs.chem.measurement-sig-figs.v1',
  title: 'Measurement, SI Units & Significant Figures',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.measurement-sig-figs',
      standard: 'CHEM-1.3',
      description:
        'Express chemical measurements in SI units with metric prefixes and report calculated results to the correct number of significant figures using the multiplication/division and addition/subtraction rules (NGSS SEP-5, supporting HS-PS1).',
    },
  ],
  prerequisites: ['chem.physical-chemical-changes'],
  followUps: ['chem.density-dimensional-analysis'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Measurement is not bookkeeping — units and digits carry real information, and losing them destroys real things.',
      script:
        'In 1999 a 327-million-dollar Mars orbiter burned up in the Martian atmosphere. Nothing was broken: one team sent thrust data in pounds, the other read it as newtons. No units, no mission. Chemistry is the same — a pharmacist who reads 0.50 mg as 0.5 g just handed out a thousandfold overdose. Every number you write this year has two jobs: say HOW MUCH, and say HOW SURE. Today you learn the grammar for both — SI units for the "how much," significant figures for the "how sure" — and you will use it in every calculation for the rest of this course.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-measurement-sig-figs',
      kind: 'concept',
      goal: 'The SI system, what a significant figure actually means, the two different rounding rules, and the zero-counting trap.',
      keyIdeas: [
        'WHAT A MEASUREMENT IS — every measured value is all the digits you are CERTAIN of plus ONE estimated digit. Reading a ruler marked in millimeters as 4.27 cm means "4.2 for sure, and I estimate the 7." A counted or defined number is not a measurement at all.',
        'THE SI BACKBONE — chemistry runs on five base units: meter (m) for length, kilogram (kg) for mass, second (s) for time, kelvin (K) for temperature, mole (mol) for amount. Everything else is DERIVED from them: volume in cm³ (1 cm³ = 1 mL exactly), density in g/mL, energy in joules.',
        'PREFIXES RESCALE, THEY DO NOT RE-MEASURE — kilo = 1000, centi = 1/100, milli = 1/1000, micro = 1/1000000, nano = 1/1000000000. Rewriting 2.50 g as 0.00250 kg changes the unit, NOT the certainty: it is still a three-significant-figure measurement.',
        'COUNTING SIGNIFICANT FIGURES — (1) every nonzero digit counts; (2) zeros BETWEEN nonzero digits count (2005 g has 4); (3) LEADING zeros never count, they only hold the decimal point (0.0042 kg has 2); (4) TRAILING zeros count ONLY when a decimal point is written (0.04070 g has 4, but 4200 g has 2).',
        'MULTIPLY OR DIVIDE → FEWEST SIGNIFICANT FIGURES — the answer carries as many sig figs as the least precise factor. 8.4 ÷ 3.75 = 2.24 on the calculator, but 8.4 has only 2 sig figs, so report 2.2.',
        'ADD OR SUBTRACT → FEWEST DECIMAL PLACES — a totally different question. 108.5 + 3.27 = 111.77, but 108.5 is only good to the tenths place, so report 111.8. Sums line up by place value; products line up by digit count.',
        'EXACT NUMBERS ARE INFINITELY PRECISE — counted objects (12 test tubes) and defined conversions (1 m = 100 cm, 1 L = 1000 mL) never limit your sig figs. Only measured values do.',
        'THE TRAP: ROUND ONCE, AT THE END — carry extra digits through every intermediate step and round only the final answer. Rounding partway through compounds the error, and reporting every digit the calculator shows claims a precision your instrument never had.',
      ],
      vocabulary: [
        { term: 'significant figures', definition: 'the digits in a measurement that carry real information — all certain digits plus the one estimated digit.' },
        { term: 'SI base unit', definition: 'one of the seven defined units (m, kg, s, K, mol, A, cd) from which all other scientific units are derived.' },
        { term: 'exact number', definition: 'a counted or defined value that carries unlimited significant figures and never limits a calculated answer.' },
        { term: 'precision', definition: 'how finely a measurement is resolved — how many digits the instrument can honestly report.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-density-sig-figs',
      kind: 'worked_example',
      problem:
        'A student measures a metal sample: mass = 24.62 g on a balance, volume = 10.0 mL by water displacement. Report the density in g/mL with the correct number of significant figures.',
      steps: [
        'Identify the operation: density = mass ÷ volume. Division, so the MULTIPLY/DIVIDE rule applies — fewest significant figures wins.',
        'Count sig figs in each measurement: 24.62 g has 4 (all nonzero digits count). 10.0 mL has 3 (the trailing zero counts because a decimal point is written).',
        'Do the arithmetic first, unrounded: 24.62 ÷ 10.0 = 2.462 g/mL. Do not round yet.',
        'Round the result to the SMALLER count, 3 significant figures: 2.462 becomes 2.46 g/mL. The sloppier measurement — the graduated cylinder — sets the ceiling on the whole answer.',
      ],
      answer: '2.46 g/mL',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-wrong-rule-trap',
      kind: 'worked_example',
      problem:
        'A student masses two samples and adds them: 108.5 g + 3.27 g. She gets 111.77 g, then reasons "3.27 has only 3 significant figures, so my answer needs 3 significant figures: 112 g." Find the flaw and give the correct report.',
      steps: [
        'Name the move: she applied the MULTIPLY/DIVIDE rule (fewest significant figures) to an ADDITION. Addition uses a different rule entirely.',
        'Why the rules differ: when you add, the digits stack by PLACE VALUE. The balance that gave 108.5 g knows nothing past the tenths place, so no digit past the tenths place in the sum can be trusted — regardless of how many digits either number has.',
        'Apply the correct rule — fewest DECIMAL PLACES: 108.5 g has 1 decimal place, 3.27 g has 2. The sum is limited to 1 decimal place.',
        'Round 111.77 g to the tenths place: 111.8 g. Notice the answer keeps FOUR significant figures even though one addend had only three — that is allowed. A sum may keep more significant figures than its smallest addend; it may never keep more decimal places than its coarsest one.',
      ],
      answer: '111.8 g — addition is limited by decimal places, not by significant-figure count',
      estimatedMinutes: 3,
    },
    {
      id: 'try-density-rounding',
      kind: 'try_yourself',
      problem:
        'A metal sample has a mass of 9.6 g and a volume of 4.25 mL. Which is the correctly reported density?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2.3 g/mL', correct: true },
        { id: 'b', text: '2.26 g/mL' },
        { id: 'c', text: '2.2588 g/mL' },
        { id: 'd', text: '0.44 g/mL' },
      ],
      expectedAnswer: '2.3 g/mL',
      hints: [
        'Density is mass ÷ volume — a division, so count significant figures in each measurement and keep the smaller count.',
        '9.6 has 2 sig figs and 4.25 has 3. The calculator shows 2.2588...; how many digits are you allowed to keep?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-addition-rule',
      kind: 'try_yourself',
      problem:
        'A chemist adds 128.4 mL of solution to 5.27 mL of solution. What is the total volume, correctly reported?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '133.7 mL', correct: true },
        { id: 'b', text: '134 mL' },
        { id: 'c', text: '133.67 mL' },
        { id: 'd', text: '133.670 mL' },
      ],
      expectedAnswer: '133.7 mL',
      hints: [
        'This is addition, so the limiting question is decimal PLACES, not significant-figure count.',
        '128.4 is good only to the tenths place; 5.27 to the hundredths. The raw sum is 133.67 — round it to the tenths place.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'How many significant figures are in the measurement 0.05060 g? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Leading zeros are only placeholders holding the decimal point — start counting at the first nonzero digit.',
        'Start at the 5. Count the 5, then the zero sandwiched between nonzeros, then the 6, then the trailing zero (it counts, because a decimal point is written).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-extra-digits',
      kind: 'misconception_check',
      question:
        'A student multiplies 3.0 cm by 2.14 cm and reports an area of 6.42 cm², saying "more digits means a more precise answer." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: '6.42 cm² — keep every digit the calculator displays',
          misconception: 'Believing that writing more digits makes a result more precise, rather than recognizing that precision is inherited from the instruments.',
          correctsTo:
            'Digits do not create certainty — measurements do. The 3.0 cm side carries only 2 significant figures, so the product may carry only 2: report 6.4 cm². Extra digits are a claim about the ruler that the ruler cannot back up.',
        },
        {
          answer: 'Counting the leading zeros in 0.0030 kg and calling it 4 significant figures',
          misconception: 'Treating placeholder zeros as measured digits.',
          correctsTo:
            'Leading zeros only park the decimal point — 0.0030 kg and 3.0 g are the SAME measurement, and both have 2 significant figures. The trailing zero after the 3 counts; the zeros before the 3 never do.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A measurement = every certain digit plus one estimated digit; SI base units (m, kg, s, K, mol) build every derived unit, and 1 cm³ = 1 mL exactly.',
        'Prefixes rescale without changing certainty: 2.50 g and 0.00250 kg are both 3 significant figures.',
        'Counting rule: nonzero digits count, sandwiched zeros count, leading zeros never count, trailing zeros count only with a written decimal point.',
        'Multiply or divide → fewest SIGNIFICANT FIGURES. Add or subtract → fewest DECIMAL PLACES. Using the wrong rule is the #1 error.',
        'Exact counts and defined conversions have unlimited sig figs; round once, at the very end, never mid-calculation.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Measurement, SI Units & Significant Figures' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
