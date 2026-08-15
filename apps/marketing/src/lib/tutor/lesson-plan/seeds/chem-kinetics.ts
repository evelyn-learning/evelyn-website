/**
 * HS Chemistry — Reaction Kinetics.
 * NGSS HS-PS1-5: factors affecting reaction rate.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_KINETICS: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.kinetics.v1',
  title: 'Reaction Kinetics',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-5', description: 'Apply scientific principles and evidence to provide an explanation about the effects of changing the temperature or concentration of the reacting particles on the rate at which a reaction occurs.', standard: 'NGSS.HS-PS1-5' }],
  prerequisites: ['hs.chem.thermochemistry'], followUps: ['hs.chem.equilibrium'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in everyday rates.', script: 'Iron rusts in months. Gunpowder burns in milliseconds. Both are oxidation reactions. Why the speed difference? KINETICS — the science of HOW FAST reactions go and WHY.', estimatedMinutes: 2 },
    { id: 'concept-collision-theory', kind: 'concept', goal: 'Reactions need molecules to COLLIDE with enough energy and right orientation.', keyIdeas: [
      'COLLISION THEORY: for a reaction to occur:',
      '  1. Particles must COLLIDE.',
      '  2. Collision must have enough energy (ACTIVATION ENERGY, Eₐ).',
      '  3. Collision must have correct ORIENTATION.',
      'Most collisions don\'t result in reaction — energy or orientation is wrong.',
      'ACTIVATION ENERGY (Eₐ): the energy "hill" reactants must climb to become products.',
      'TRANSITION STATE: the high-energy intermediate at the top of the hill.',
      'Higher Eₐ → slower reaction.',
    ], vocabulary: [{ term: 'activation energy', definition: 'minimum energy for a reaction to occur (Eₐ).' }, { term: 'collision theory', definition: 'particles must collide with enough energy + right orientation.' }, { term: 'catalyst', definition: 'substance that lowers Eₐ without being used up.' }], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'concept-factors', kind: 'concept', goal: 'Five factors change reaction rate.', keyIdeas: [
      '1. CONCENTRATION (or pressure for gases): more particles → more collisions → faster.',
      '2. TEMPERATURE: higher T → particles move faster → more collisions WITH enough energy. Rate roughly DOUBLES per 10°C rise.',
      '3. SURFACE AREA: more exposed surface → more collisions. (Powder burns faster than a chunk.)',
      '4. CATALYSTS: lower Eₐ → faster, without being consumed. Enzymes are biological catalysts.',
      '5. NATURE of reactants: ionic reactions in solution are usually fast; covalent bond reorganizations slower.',
    ], estimatedMinutes: 4 },
    { id: 'worked-explain-rates', kind: 'worked_example', problem: 'Explain why these speed up reactions: (a) blowing on a campfire, (b) refrigerating food, (c) chewing food before swallowing, (d) catalytic converter in a car.', steps: [
      '(a) Blowing brings MORE OXYGEN (concentration ↑) → faster combustion.',
      '(b) Refrigerating LOWERS TEMPERATURE → bacteria + chemical reactions in food slow → food lasts longer. (Same factor, different direction.)',
      '(c) Chewing increases SURFACE AREA of food → digestive enzymes can act faster.',
      '(d) Catalytic converter contains platinum/palladium CATALYSTS → speeds up CO + NOₓ → CO₂ + N₂ without being consumed.',
    ], answer: '(a) concentration, (b) temperature (down), (c) surface area, (d) catalyst. All five factors at work in everyday life.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A reaction takes 20 minutes at 25°C. Roughly how long would it take at 45°C?', expectedAnswer: 'Rule of thumb: rate doubles per 10°C rise. From 25→45 is 20°C → rate quadruples (2 doublings). So time is ~1/4 = 5 minutes. (This is approximate — Arrhenius equation is exact, but the rule of thumb is good enough.)', responseFormat: 'numeric', hints: ['Each 10°C rise roughly doubles the rate.', 'Twice the doublings, half the time twice over.'], estimatedMinutes: 3 },
    { id: 'misconception-catalyst-shift', kind: 'misconception_check', question: 'A friend says "a catalyst makes more product form than would otherwise." Right?', commonErrors: [{ answer: 'Yes — more product.', misconception: 'Believing catalysts shift the equilibrium.', correctsTo: 'Catalysts make reactions go FASTER but DON\'T change how much product forms at equilibrium. They lower Eₐ for both forward AND reverse reactions equally. You reach the same final amounts faster — but not more.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Collision theory: collisions need enough energy + right orientation.', 'Activation energy (Eₐ) is the "hill" that must be climbed.', 'Speed-up factors: concentration, temperature, surface area, catalyst.', 'Catalysts lower Eₐ without being consumed.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
