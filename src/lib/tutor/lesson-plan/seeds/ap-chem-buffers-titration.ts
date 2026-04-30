/**
 * AP Chemistry — Buffers and titration curves.
 *
 * Buffer chemistry, Henderson-Hasselbalch, equivalence point.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CHEM_BUFFERS_TITRATION: LessonPlan = {
  id: 'evelyn.ap.chem.buffers-titration.v1',
  title: 'Buffers and titration curves',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'apchem.buffers',
      description: 'Apply buffer chemistry, Henderson-Hasselbalch, and titration curve analysis.',
      standard: 'AP-CHEM-EQU-2',
    },
  ],
  prerequisites: ['apchem.acid-base'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why your blood pH stays at 7.4 even when you eat acidic food.',
      script: 'Your blood pH is 7.4. Eat lemon juice — pH stays 7.4. Sprint hard, building lactic acid — still 7.4. Your blood is BUFFERED. Tiny shifts kill. Buffers are the chemistry of homeostasis.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-buffers-titration',
      kind: 'concept',
      goal: 'Buffer mechanism + Henderson-Hasselbalch + titration curve features.',
      keyIdeas: [
        'BUFFER: a solution that RESISTS pH change. Composed of a WEAK ACID and its CONJUGATE BASE in comparable amounts (or weak base + conjugate acid).',
        'HOW IT WORKS: added H+ reacts with conjugate base (consuming the acid). Added OH- reacts with the weak acid (consuming the base). Either way, pH barely shifts.',
        'HENDERSON-HASSELBALCH: pH = pKa + log([A⁻]/[HA]). Buffer is most effective near pH = pKa (when [A⁻] ≈ [HA]).',
        'BUFFER CAPACITY: how much acid or base can be added before pH shifts a lot. Larger when concentrations are higher.',
        'TITRATION CURVE: pH (y-axis) vs volume of titrant added (x-axis).',
        '  STRONG ACID + STRONG BASE: starts low, sudden jump near equivalence (~pH 7), then plateaus high. No buffering.',
        '  WEAK ACID + STRONG BASE: BUFFER REGION (gentle slope). HALF-EQUIVALENCE: pH = pKa. Equivalence point > 7 (basic, since conjugate base remains).',
        '  WEAK BASE + STRONG ACID: mirror image. Equivalence point < 7.',
        'EQUIVALENCE POINT: moles acid = moles base. Detectable by sharp pH jump or indicator color change.',
      ],
      vocabulary: [
        { term: 'buffer', definition: 'a solution resistant to pH change.' },
        { term: 'pKa', definition: 'the negative log of the acid dissociation constant; pH at which a weak acid is half-dissociated.' },
        { term: 'equivalence point', definition: 'the point in titration where moles of acid equal moles of base.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-hh',
      kind: 'worked_example',
      problem: 'A buffer has 0.1 M acetic acid (pKa = 4.74) and 0.05 M acetate. What is the pH?',
      steps: [
        'Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]).',
        'pH = 4.74 + log(0.05/0.1) = 4.74 + log(0.5) = 4.74 + (-0.30) = 4.44.',
        'Below pKa because [HA] > [A⁻] — solution is more acidic than the half-dissociation point.',
      ],
      answer: 'pH ≈ 4.44',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-titration',
      kind: 'worked_example',
      problem: 'You titrate weak acid HA (pKa = 5) with NaOH. At HALF-EQUIVALENCE point, what\'s the pH?',
      steps: [
        'At half-equivalence: half the HA has been neutralized. [HA] = [A⁻].',
        'Henderson-Hasselbalch: pH = pKa + log(1) = pKa + 0 = pKa.',
        'pH = 5.',
        'KEY INSIGHT: half-equivalence pH directly gives you pKa. This is HOW chemists determine pKa values experimentally.',
      ],
      answer: '5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does adding water to a buffer not change its pH significantly?',
      expectedAnswer: 'dilution affects [HA] and [A⁻] equally; the ratio in Henderson-Hasselbalch stays the same',
      responseFormat: 'free',
      hints: [
        'pH = pKa + log([A⁻]/[HA]).',
        'If both halve, the ratio is unchanged.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-strong-buffer',
      kind: 'misconception_check',
      question: 'Can you make a buffer with a STRONG acid (like HCl) and its conjugate base?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating any acid+conjugate as a buffer.',
          correctsTo: 'No — buffers require WEAK acid + conjugate base. Strong acids dissociate completely; their conjugate bases are too weak to react with added H+. The buffering mechanism doesn\'t work.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Buffer = weak acid + its conjugate base (or weak base + conjugate acid).',
        'Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]).',
        'Half-equivalence: [HA] = [A⁻], so pH = pKa.',
        'Strong acid + strong base titration: sharp jump at pH 7.',
        'Weak acid + strong base: equivalence point > 7.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does the BICARBONATE buffer system keep blood pH stable?',
      hint: 'CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. The body controls CO₂ via breathing and HCO₃⁻ via kidneys, keeping the ratio (and thus pH) tightly regulated. Diabetic ketoacidosis breaks this — patients hyperventilate to remove CO₂ as compensation.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
