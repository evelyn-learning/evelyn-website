/**
 * Grade 5 Science — Mixtures and Solutions.
 * NGSS 5-PS1-2 / 5-PS1-4: when two or more substances are mixed,
 * a new substance with different properties may be formed; mass is
 * conserved.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_SCI_MIXTURES_SOLUTIONS: LessonPlan = {
  id: 'evelyn.g5.science.matter.mixtures-solutions.v1',
  title: 'Mixtures and Solutions',
  curriculum: 'NGSS', grade: '5', subject: 'science', topic: 'matter', locale: 'en',
  los: [{ id: 'ngss.5-ps1-2', description: 'Measure and graph quantities to provide evidence that regardless of the type of change that occurs when heating, cooling, or mixing substances, the total weight of matter is conserved.', standard: 'NGSS.5-PS1-2' }, { id: 'ngss.5-ps1-4', description: 'Conduct an investigation to determine whether the mixing of two or more substances results in new substances.', standard: 'NGSS.5-PS1-4' }],
  prerequisites: ['ngss.5-ps1-1'], followUps: ['ngss.ms-ps1-2'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor with sugar in tea.', script: 'Stir sugar into tea. The sugar disappears! Did it really vanish? If you taste the tea — sweet — you know the sugar is still there. Where\'d it go?', estimatedMinutes: 1 },
    { id: 'concept-mixtures-vs-solutions', kind: 'concept', goal: 'Mixtures combine substances without changing them. Solutions are mixtures where one substance dissolves in another.', keyIdeas: [
      'A MIXTURE is two or more substances combined but NOT chemically bonded — each keeps its own properties.',
      'You can usually SEPARATE a mixture (filter, magnet, picking apart, evaporation).',
      'A SOLUTION is a special kind of mixture where one substance DISSOLVES into another at the particle level (like sugar in water).',
      'In a solution, the particles are spread evenly — you can\'t see them, but they\'re still there.',
      'COMPOUND is different — it\'s a NEW substance formed by chemical bonding (water = H + O bonded; not a mixture).',
    ], vocabulary: [{ term: 'mixture', definition: 'two or more substances combined but not bonded.' }, { term: 'solution', definition: 'a mixture where one substance dissolves in another.' }, { term: 'solute', definition: 'the substance being dissolved (like sugar).' }, { term: 'solvent', definition: 'the substance doing the dissolving (like water).' }], estimatedMinutes: 5 },
    { id: 'concept-conservation', kind: 'concept', goal: 'When you mix or dissolve, the total mass stays the same — matter is conserved.', keyIdeas: [
      'Mass before mixing = mass after mixing (LAW OF CONSERVATION OF MASS).',
      'If you put 100g of water and 5g of sugar in a sealed container, then weigh the solution, it\'s STILL 105g.',
      'The sugar\'s particles are still there — just spread among the water particles.',
      'This holds for chemical reactions too — atoms can rearrange but never disappear.',
    ], vocabulary: [{ term: 'conservation of mass', definition: 'matter isn\'t created or destroyed in mixing/reactions.' }], estimatedMinutes: 3 },
    { id: 'worked-sand-water-salt-water', kind: 'worked_example', problem: 'You add (a) sand to water and (b) salt to water. What happens in each, and how would you separate them?', steps: [
      '(a) SAND + WATER: a MIXTURE. Sand sinks; doesn\'t dissolve. Separate by FILTERING — paper catches sand, water passes through.',
      '(b) SALT + WATER: a SOLUTION. Salt dissolves at the particle level — you can\'t see it. Separate by EVAPORATION — boil off the water, salt remains as solid.',
    ], answer: 'Sand: simple mixture, separate by filtering. Salt: solution, separate by evaporation.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You weigh a glass of water (200g) and a spoon of sugar (10g) on a scale. You stir the sugar into the water. What does the scale read now?', expectedAnswer: '210g (mass is conserved — sugar didn\'t disappear, just dissolved)', responseFormat: 'numeric', hints: ['Total = water + sugar.', 'Conservation of mass: nothing is added or removed.'], estimatedMinutes: 2 },
    { id: 'misconception-dissolved-disappears', kind: 'misconception_check', question: 'A friend says "when sugar dissolves, it disappears — it\'s gone." Is that right?', commonErrors: [{ answer: 'Yes — gone.', misconception: 'Believing dissolved substances cease to exist.', correctsTo: 'The sugar is STILL THERE — its particles are just so small and spread out among water particles that you can\'t see them. Taste it (sweet!) or evaporate the water (sugar reappears as crystals). Mass is conserved.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Mixtures: substances combined but not bonded.', 'Solutions: a mixture where one dissolves.', 'Mass is conserved — total weight doesn\'t change.', 'Separation methods: filter (sand), evaporate (salt), magnet (iron filings).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
