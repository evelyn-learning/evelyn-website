/**
 * Chemistry — Solutions: Solutions & Solubility.
 *
 * Dissolving as a competition between particle attractions (NGSS HS-PS1-3):
 * like dissolves like, solubility as a number tied to a temperature, and
 * the saturated / unsaturated / supersaturated vocabulary. The two star
 * errors get full billing — gases go the OTHER way with temperature, and
 * stirring changes how FAST, never how MUCH. All solubility data is stated
 * verbally in grams per 100 g of water so no curve is ever needed.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U8_SOLUTIONS_SOLUBILITY: LessonPlan = {
  id: 'evelyn.hs.chem.solutions-solubility.v1',
  title: 'Solutions & Solubility',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.solutions-solubility',
      standard: 'CHEM-8.1',
      description:
        'Explain dissolving as a competition between particle attractions, and use solubility values in grams per 100 g of water to classify solutions as unsaturated, saturated, or supersaturated and to predict the effect of temperature and pressure (NGSS HS-PS1-3).',
    },
  ],
  prerequisites: ['chem.ideal-gas-law'],
  followUps: ['chem.molarity'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Dissolving is not automatic — attractions decide what goes in, and the limit is a hard number.',
      script:
        'Rock candy grows on a string because a hot sugar solution can hold far more sugar than a cool one — cool it down and the extra sugar has nowhere to go but onto the string. Meanwhile a salad dressing separates no matter how hard you shake it, and a warm soda goes flat faster than a cold one. Three kitchen facts, one idea behind all of them: whether something dissolves, and HOW MUCH, is set by the attractions between particles and by the conditions you impose. Today you learn to predict all three outcomes instead of just watching them happen.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-solubility',
      kind: 'concept',
      goal: 'Dissolving as an attraction competition, solubility as a conditional number, and the two classic traps (gases invert; stirring is rate, not amount).',
      keyIdeas: [
        'SOLUTION = HOMOGENEOUS MIXTURE — the SOLUTE (smaller amount, the sugar) spreads out uniformly through the SOLVENT (larger amount, the water). Uniform is the test: every sample of salt water tastes equally salty, and no filter can separate it.',
        'DISSOLVING IS A COMPETITION OF ATTRACTIONS — three pulls compete: solute-to-solute, solvent-to-solvent, and solute-to-solvent. Dissolving happens when the solute-solvent attraction is strong enough to pay for pulling the other two apart. Nothing about the particles changes chemically — this is why dissolving is a physical change.',
        'LIKE DISSOLVES LIKE — polar and ionic solutes dissolve in polar solvents; nonpolar solutes dissolve in nonpolar solvents. Water molecules surround Na⁺ and Cl⁻ with their oppositely-charged ends and pull the crystal apart. Oil offers water nothing to grip, so water molecules simply hold on to each other and squeeze the oil out.',
        'SOLUBILITY IS A NUMBER WITH CONDITIONS ATTACHED — it is the maximum solute that dissolves in a fixed amount of solvent at a stated temperature, usually reported as grams per 100 g of water. "KNO₃ solubility is 32" is meaningless; "32 g per 100 g of water at 20 °C" is a fact you can compute with. Scale it: 200 g of water holds twice as much.',
        'THREE STATES OF A SOLUTION — UNSATURATED (holding less than the maximum, more will still dissolve); SATURATED (holding exactly the maximum, undissolved solid sits at the bottom in balance with dissolved solute); SUPERSATURATED (holding MORE than the maximum, achieved by dissolving hot then cooling slowly — unstable, and one seed crystal makes the excess crash out at once).',
        'TEMPERATURE SPLITS SOLIDS FROM GASES — for most SOLIDS, solubility RISES with temperature (hot tea takes more sugar). For GASES it FALLS: warm water cannot hold dissolved gas, which is why a warm soda fizzes flat and why a heated river holds less dissolved O₂ for fish. Never carry the solid rule over to gases.',
        'PRESSURE MOVES ONLY GASES — raising the pressure of a gas above a liquid forces more of it into solution, and releasing that pressure drives it back out. A sealed soda is bottled under high CO₂ pressure; cracking the cap drops the pressure and the dissolved CO₂ escapes as bubbles. Pressure has essentially no effect on dissolved solids.',
        'THE TRAP: RATE IS NOT AMOUNT — stirring, grinding the crystals smaller, and heating all make a solid dissolve FASTER, but only temperature (and, for gases, pressure) changes HOW MUCH can dissolve at all. Stirring a saturated solution for an hour dissolves not one extra gram.',
      ],
      vocabulary: [
        { term: 'solute', definition: 'the substance being dissolved, present in the smaller amount.' },
        { term: 'solvent', definition: 'the substance doing the dissolving, present in the larger amount.' },
        { term: 'solubility', definition: 'the maximum mass of solute that dissolves in a fixed mass of solvent at a stated temperature, e.g. grams per 100 g of water.' },
        { term: 'saturated', definition: 'holding exactly the maximum dissolvable amount of solute at that temperature.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cooling-crystals',
      kind: 'worked_example',
      problem:
        'Potassium nitrate, KNO₃, has a solubility of 110 g per 100 g of water at 60 °C, 64 g per 100 g of water at 40 °C, and 32 g per 100 g of water at 20 °C. A student stirs 90 g of KNO₃ into 100 g of water at 60 °C, then cools the mixture to 20 °C. Describe the solution at each temperature and find the mass of crystals that appears.',
      steps: [
        'At 60 °C: compare what is present (90 g) to the maximum (110 g per 100 g of water). 90 is less than 110, so everything dissolves and the solution is UNSATURATED — you could still add 20 g more.',
        'Cool to 20 °C: the maximum drops to 32 g per 100 g of water. The water can now hold only 32 g dissolved.',
        'The excess has to leave solution: 90 g present − 32 g still dissolved = 58 g of KNO₃ crystallizes out on the bottom.',
        'At 20 °C the remaining liquid holds exactly its 32 g maximum with solid sitting in it, so it is now SATURATED. Note the solvent mass never changed — cooling changed the LIMIT, not the amount of water.',
      ],
      answer: '58 g of KNO₃ crystallize; unsaturated at 60 °C, saturated at 20 °C',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-gas-temperature-trap',
      kind: 'worked_example',
      problem:
        'A student wants a fizzier drink and reasons: "Hot water dissolves more sugar than cold water, so warming my soda will let it hold more CO₂." They warm the open bottle and the drink goes completely flat. Diagnose the error and give the correct procedure.',
      steps: [
        'Name the move: the student took the solubility rule for SOLIDS — more dissolves as temperature rises — and applied it to a dissolved GAS. Gases run the opposite way.',
        'Why gases invert: a dissolved gas particle is only loosely held by the surrounding water molecules. Heating gives it more kinetic energy, so it escapes the liquid instead of staying trapped. Warming a solution drives dissolved gas OUT.',
        'The second error: an OPEN bottle sits at ordinary air pressure, where the CO₂ pressure above the liquid is nearly zero. Low gas pressure above the liquid means low gas solubility in it, so CO₂ leaves whether or not the drink is warm.',
        'The correct procedure: keep the drink COLD and keep it SEALED under pressure. Low temperature plus high CO₂ pressure both push gas into solution — exactly why bottling plants carbonate chilled liquid under pressure and why a cold unopened soda stays fizzy for months.',
      ],
      answer: 'Warming drives dissolved gas out — gas solubility falls with temperature and rises with pressure, so cold and sealed keeps the fizz',
      estimatedMinutes: 3,
    },
    {
      id: 'try-like-dissolves-like',
      kind: 'try_yourself',
      problem:
        'Motor oil, a mixture of long nonpolar hydrocarbon chains, will not dissolve in water no matter how vigorously it is shaken. Which explanation is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Water molecules attract each other far more strongly than they attract oil molecules, so they cling together and exclude the oil instead of surrounding it', correct: true },
        { id: 'b', text: 'Oil molecules are too large to fit in the spaces between water molecules' },
        { id: 'c', text: 'Oil is less dense than water, so it floats instead of dissolving' },
        { id: 'd', text: 'The water is already saturated with dissolved air, so there is no room left for oil' },
      ],
      expectedAnswer: 'Water molecules attract each other far more strongly than they attract oil molecules, so they cling together and exclude the oil instead of surrounding it',
      hints: [
        'Dissolving is decided by a competition of attractions, not by particle size, density, or leftover room.',
        'Ask which pull wins: water-to-water, or water-to-oil? Polar water has nothing to grip on a nonpolar chain.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-solution',
      kind: 'try_yourself',
      problem:
        'KNO₃ solubility is 32 g per 100 g of water at 20 °C and 64 g per 100 g of water at 40 °C. A student dissolves 50 g of KNO₃ in 100 g of water at 40 °C and all of it dissolves. How should this solution be described?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Unsaturated — it holds 50 g out of a possible 64 g at that temperature', correct: true },
        { id: 'b', text: 'Saturated — 50 g is more than the 32 g that dissolves' },
        { id: 'c', text: 'Supersaturated — 50 g is above the 32 g listed for KNO₃' },
        { id: 'd', text: 'Impossible to classify without knowing the volume of the solution' },
      ],
      expectedAnswer: 'Unsaturated — it holds 50 g out of a possible 64 g at that temperature',
      hints: [
        'Two solubility values are given. Which one applies at 40 °C?',
        'Compare 50 g to the maximum at the ACTUAL temperature, not to the 20 °C value.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'KNO₃ solubility is 32 g per 100 g of water at 20 °C and 64 g per 100 g of water at 40 °C. A saturated KNO₃ solution is prepared using 200 g of water at 40 °C, then cooled slowly to 20 °C. How many grams of KNO₃ crystallize out? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '64',
      hints: [
        'The solubility values are per 100 g of water, but this solution uses 200 g — scale both numbers up first.',
        'At 40 °C the 200 g of water holds 128 g dissolved; at 20 °C it holds only 64 g. 128 − 64 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rate-vs-amount',
      kind: 'misconception_check',
      question:
        'A student has a saturated salt solution with undissolved salt on the bottom of the beaker. They stir hard for ten minutes and grind the leftover crystals into powder, expecting the rest to dissolve. Why does the solid stay?',
      commonErrors: [
        {
          answer: 'Stirring and grinding will make more of it dissolve',
          misconception: 'Confusing the RATE of dissolving with the maximum AMOUNT that can dissolve.',
          correctsTo:
            'Stirring and grinding only speed up the process by exposing more surface and sweeping dissolved particles away from the crystal — they get you to the limit faster, but they do not move the limit. Solubility at a fixed temperature is a hard ceiling. To dissolve more salt you must change the conditions (raise the temperature) or add more solvent (more water).',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Dissolving is a competition of attractions: solute-solvent pulls must overcome solute-solute and solvent-solvent pulls. Like dissolves like.',
        'Solubility is a number with conditions: grams per 100 g of water AT a stated temperature — and it scales with the mass of solvent.',
        'Unsaturated = below the maximum; saturated = at the maximum with solid in balance; supersaturated = above it and unstable.',
        'Solids dissolve MORE as temperature rises; gases dissolve LESS. Pressure raises gas solubility only.',
        'Stirring, grinding, and heating change how FAST a solid dissolves; only temperature and solvent amount change how MUCH.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Solutions & Solubility' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
