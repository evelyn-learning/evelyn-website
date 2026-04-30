/**
 * G8 — Chemistry intro: physical vs chemical changes.
 *
 * Distinguish physical changes (state, shape) from chemical (new
 * substance formed). Signs of chemical change: color, gas, heat,
 * precipitate.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SCI_CHEMISTRY_INTRO: LessonPlan = {
  id: 'evelyn.g8.sci.physical.chemistry-intro.v1',
  title: 'Physical vs chemical changes',
  curriculum: 'NGSS',
  grade: '8',
  subject: 'sci',
  topic: 'physical-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.ms-ps1.b',
      description: 'Develop and use a model to describe changes in particle motion, temperature, and state of a pure substance.',
      standard: 'NGSS.MS-PS1-4',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.ms-ps1.c'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Distinguish reversible from irreversible changes.',
      script: 'Ice melts into water. You can freeze it back. But cook an egg — try to UNCOOK it. Some changes can reverse. Others can\'t. That difference is the difference between PHYSICAL and CHEMICAL change.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distinction',
      kind: 'concept',
      goal: 'Define each, list signs of chemical change.',
      keyIdeas: [
        'PHYSICAL CHANGE: substance changes APPEARANCE but its CHEMICAL IDENTITY stays the same. Examples: ice melting (water in different state), cutting paper (smaller pieces, still paper), dissolving sugar (still sugar — you can evaporate water and get it back).',
        'CHEMICAL CHANGE (reaction): substance becomes something CHEMICALLY DIFFERENT. New molecules form. Often hard to reverse.',
        'SIGNS of chemical change: 1) COLOR change (rust, leaves turning red). 2) GAS produced (bubbles, fizz). 3) PRECIPITATE — solid forms when liquids mix. 4) HEAT released or absorbed (exothermic / endothermic). 5) LIGHT given off.',
        'Examples of chemical: burning wood (→ ash, CO₂, water), iron rusting (→ iron oxide), baking a cake (raw ingredients → cooked, can\'t reverse), digestion.',
        'Tricky: dissolving salt in water — physical (you can evaporate to get salt back). Dissolving baking soda + vinegar — chemical (gas forms, new substance).',
      ],
      vocabulary: [
        { term: 'physical change', definition: 'a change in appearance or state — same substance, different form.' },
        { term: 'chemical change', definition: 'a change that produces a new substance with different properties.' },
        { term: 'precipitate', definition: 'a solid that forms when two liquids react.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'Is "an egg cooking on a stove" physical or chemical change?',
      steps: [
        'Look for signs: COLOR changes (clear → white). TEXTURE changes (liquid → solid).',
        'Is it reversible? Can you uncook the egg? No.',
        'Did the chemical identity change? Yes — proteins UNFOLDED and connected differently. The molecules are now different.',
        'Verdict: CHEMICAL change.',
      ],
      answer: 'chemical',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You cut a piece of paper in half. Physical or chemical?',
      expectedAnswer: 'physical',
      responseFormat: 'free',
      hints: [
        'Did the substance change identity, or just shape?',
        'You still have paper afterward, just two pieces.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-state-change-chemical',
      kind: 'misconception_check',
      question: 'Is melting ice a chemical change?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating state changes as chemical.',
          correctsTo: 'No — ice and water are both H₂O. Just different STATES. The molecule is identical. State changes (melting, freezing, boiling, condensing) are PHYSICAL.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Physical = same substance, different form. Reversible.',
        'Chemical = new substance formed. Often irreversible.',
        'Signs of chemical: color, gas, precipitate, heat, light.',
        'State changes (melt, boil, freeze) are PHYSICAL.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Mixing baking soda and vinegar produces fizz. What\'s actually happening chemically, and what evidence tells you it\'s a chemical change?',
      hint: 'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. The CO₂ gas is the fizz. Color/temp may also change. Multiple signs = chemical.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
