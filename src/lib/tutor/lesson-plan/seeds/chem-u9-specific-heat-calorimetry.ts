/**
 * Chemistry — Thermochemistry: Specific Heat & Calorimetry.
 *
 * Quantifying the energy story (NGSS HS-PS3-1, HS-PS3-4): q = mcΔT as the
 * bookkeeping equation for heat, plus calorimetry's conservation statement
 * (heat lost = heat gained). The two classic errors get equal billing —
 * plugging the FINAL temperature in for ΔT, and reading a big temperature
 * change as proof of a big heat transfer.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U9_SPECIFIC_HEAT_CALORIMETRY: LessonPlan = {
  id: 'evelyn.hs.chem.specific-heat-calorimetry.v1',
  title: 'Specific Heat & Calorimetry',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.specific-heat-calorimetry',
      standard: 'CHEM-9.2',
      description:
        'Calculate heat transfer using q = mcΔT and apply conservation of energy in calorimetry problems, where heat lost by the hot sample equals heat gained by the cold sample (NGSS HS-PS3-1, HS-PS3-4).',
    },
  ],
  prerequisites: ['chem.endothermic-exothermic'],
  followUps: ['chem.reaction-rates-collision'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Same sunlight, wildly different temperatures — specific heat is the hidden property, and q = mcΔT is how we measure it.',
      script:
        'Walk barefoot across beach sand at noon and you sprint for the water — yet the ocean, soaking up the exact same sunlight for the exact same hours, stays cool enough to swim in. Nothing about the sunlight differs; what differs is the substance. Water is stubborn about changing temperature, and sand is not. That stubbornness has a number attached to it, and once you can put a number on it you can do something remarkable: measure the energy of a reaction you cannot see, just by watching a thermometer in a cup of water. That is calorimetry, and today you learn the one equation it runs on.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-q-mcdt',
      kind: 'concept',
      goal: 'Specific heat as a material fingerprint, q = mcΔT as the bookkeeping, and the two errors that wreck the arithmetic.',
      keyIdeas: [
        'HEAT IS NOT TEMPERATURE — heat (q) is energy that flows from hot to cold, measured in joules. Temperature measures how fast the particles jiggle, in °C. A bathtub of warm water holds far more heat than a spark at 1000 °C: temperature says how hot, heat says how much energy moved.',
        'SPECIFIC HEAT CAPACITY (c) — the energy needed to raise ONE gram of a substance by ONE °C, in J/(g·°C). It is a fingerprint of the material: water is 4.18, aluminum about 0.90, iron about 0.44. A big c means the substance resists temperature change; a small c means it heats and cools in a hurry.',
        'THE EQUATION: q = m × c × ΔT — heat equals mass (g) times specific heat (J/(g·°C)) times temperature change (°C). All three factors matter: double the mass OR double the temperature change and you double the heat.',
        'ΔT IS A DIFFERENCE, NOT A DESTINATION — ΔT = T_final − T_initial (final minus initial). Water warmed from 25 °C to 45 °C has ΔT = 20 °C, not 45. Dropping the final temperature into the equation is the single most common wrong answer in this unit, and it inflates the result silently.',
        'SIGN CONVENTION — a positive q means the sample ABSORBED heat (it warmed, endothermic for that sample); a negative q means it RELEASED heat (it cooled, exothermic). The sign falls straight out of ΔT: if the temperature dropped, ΔT is negative and so is q.',
        'CALORIMETRY = CONSERVATION IN A CUP — energy is not created or destroyed, so in an insulated container the heat lost by the hot object equals the heat gained by the cold one: q_lost = −q_gained. That is why we never need to measure the reaction directly; we measure what the water around it does and let conservation do the rest (HS-PS3-1).',
        'THERMAL EQUILIBRIUM — mixed samples stop exchanging heat when they reach the SAME final temperature. Both objects share one T_final, but each has its own ΔT because each started somewhere different.',
        'THE TRAP: BIG ΔT ≠ BIG q — the substance whose temperature swings the most is usually the one with the SMALL specific heat, not the one that got the most energy. Iron and water can trade the exact same joules while iron\'s temperature moves nearly ten times farther.',
      ],
      vocabulary: [
        { term: 'heat (q)', definition: 'energy transferred between objects because of a temperature difference, measured in joules.' },
        { term: 'specific heat capacity', definition: 'the joules required to raise one gram of a substance by one degree Celsius.' },
        { term: 'calorimetry', definition: 'measuring heat transfer by tracking the temperature change of a known mass, usually water, in an insulated container.' },
        { term: 'thermal equilibrium', definition: 'the state in which objects in contact have reached the same temperature and net heat flow stops.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-burning-peanut',
      kind: 'worked_example',
      problem:
        'A burning peanut is held under a test tube containing 100.0 g of water. The water warms from 25.0 °C to 45.0 °C. How much heat did the water absorb, and what is q for the peanut? (c of water = 4.18 J/(g·°C))',
      steps: [
        'Identify the three inputs for the water: m = 100.0 g, c = 4.18 J/(g·°C), and ΔT = T_final − T_initial = 45.0 − 25.0 = 20.0 °C. Note that ΔT is 20, not 45.',
        'Apply q = m × c × ΔT: q = 100.0 × 4.18 × 20.0 = 8360 J, or 8.36 kJ.',
        'Sign check for the water: its temperature rose, so ΔT is positive and q is positive — the water ABSORBED 8360 J.',
        'Cross to the peanut by conservation: the energy came out of the burning peanut, so q_peanut = −8360 J, an exothermic release of 8.36 kJ.',
        'Reality check: a real peanut stores roughly 20-25 kJ. The calorimeter under-reports because heat escapes to the air — which is exactly why lab calorimeters are insulated.',
      ],
      answer: 'The water absorbed 8360 J (8.36 kJ); q for the peanut is −8360 J (exothermic)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-equal-heat-unequal-dt',
      kind: 'worked_example',
      problem:
        'A 100.0 g piece of iron at 120.0 °C is dropped into 100.0 g of water at 15.0 °C in an insulated cup. Both settle at 25.0 °C. A student claims: "Equal masses exchanging equal energy must change temperature by equal amounts." Show the actual numbers for each substance. (c of water = 4.18 J/(g·°C); c of iron = 0.44 J/(g·°C))',
      steps: [
        'Water first: ΔT = 25.0 − 15.0 = +10.0 °C, so q = 100.0 × 4.18 × 10.0 = +4180 J. The water GAINED 4180 J.',
        'Iron next: ΔT = 25.0 − 120.0 = −95.0 °C, so q = 100.0 × 0.44 × (−95.0) = −4180 J. The iron RELEASED 4180 J — the identical amount, with the opposite sign, exactly as q_lost = −q_gained requires.',
        'Now compare the temperature changes: the water moved 10.0 °C while the iron moved 95.0 °C. Equal masses, equal energy, and the temperature changes differ by a factor of about 9.5.',
        'Find the flaw: the student left c out of the reasoning. Rearranged, ΔT = q / (m × c) — with m and q matched, the substance with the SMALLER c takes the bigger temperature swing. Iron\'s c (0.44) is about 9.5 times smaller than water\'s (4.18), and 4.18 ÷ 0.44 ≈ 9.5 is precisely the ratio of the two temperature changes.',
        'Takeaway: a dramatic temperature change is evidence of a small specific heat, not of a large heat transfer.',
      ],
      answer: 'Both transferred 4180 J, but water changed 10.0 °C and iron changed 95.0 °C — specific heat, not energy, sets the size of the swing',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sand-vs-water',
      kind: 'try_yourself',
      problem:
        'Beach sand and ocean water absorb sunlight side by side all morning. By noon the sand is scorching while the water is still cool. What best explains this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sand has a much lower specific heat, so the same energy per gram raises its temperature far more', correct: true },
        { id: 'b', text: 'Sand absorbs much more heat from the sun than the water does' },
        { id: 'c', text: 'Water has a lower specific heat, so it resists warming' },
        { id: 'd', text: 'Sand contains more heat energy overall than the ocean does' },
      ],
      expectedAnswer: 'Sand has a much lower specific heat, so the same energy per gram raises its temperature far more',
      hints: [
        'Both surfaces receive comparable sunlight, so the difference must be a property of the material, not the amount of energy delivered.',
        'Rearrange q = mcΔT to ΔT = q / (m × c). With q and m comparable, which value of c produces the larger ΔT — a big one or a small one?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-calorimetry-signs',
      kind: 'try_yourself',
      problem:
        'A hot metal block is dropped into cool water inside an insulated calorimeter, and the two reach thermal equilibrium. Which statement is TRUE?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'q for the metal is negative and equal in magnitude to q for the water, which is positive', correct: true },
        { id: 'b', text: 'q is positive for both, since heat energy was transferred in both objects' },
        { id: 'c', text: 'The metal loses more energy than the water gains, because the metal started hotter' },
        { id: 'd', text: 'The metal and the water must undergo the same temperature change, since they exchange the same energy' },
      ],
      expectedAnswer: 'q for the metal is negative and equal in magnitude to q for the water, which is positive',
      hints: [
        'The sign of q follows the sign of ΔT: the metal cooled, the water warmed.',
        'An insulated cup lets no energy escape, so every joule leaving the metal arrives in the water: q_lost = −q_gained. Equal energy does not mean equal ΔT, because the two specific heats differ.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'How many joules of heat are required to raise the temperature of 200.0 g of water from 25.0 °C to 45.0 °C? (c of water = 4.18 J/(g·°C)) Type your answer as a number of joules.',
      responseFormat: 'numeric',
      expectedAnswer: '16720',
      hints: [
        'Use q = m × c × ΔT, and remember ΔT is final minus initial — not the final temperature itself.',
        'ΔT = 45.0 − 25.0 = 20.0 °C, so compute 200.0 × 4.18 × 20.0.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-final-temp-for-dt',
      kind: 'misconception_check',
      question:
        'A student heats 50.0 g of water from 20.0 °C to 60.0 °C and writes q = 50.0 × 4.18 × 60.0 = 12540 J. What went wrong, and what is the correct answer?',
      commonErrors: [
        {
          answer: '12540 J, using 60.0 °C in the equation',
          misconception: 'Substituting the FINAL temperature for ΔT instead of the temperature CHANGE.',
          correctsTo:
            'ΔT means the change: T_final − T_initial = 60.0 − 20.0 = 40.0 °C. The correct heat is 50.0 × 4.18 × 40.0 = 8360 J. Using 60.0 pretends the water was heated all the way up from 0 °C, which inflates the answer by half. Compute ΔT as a separate written step before it ever touches the equation — and if the sample cooled, keep the negative sign it produces.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'q = m × c × ΔT — heat in joules from mass in grams, specific heat in J/(g·°C), and temperature change in °C.',
        'ΔT = T_final − T_initial. Always compute the difference first; plugging in the final temperature is the classic error.',
        'Sign convention: positive q means heat absorbed (warming), negative q means heat released (cooling).',
        'Calorimetry is conservation of energy in a cup: q_lost = −q_gained, so watching the water tells you what the reaction did.',
        'Specific heat is a material fingerprint — water\'s 4.18 J/(g·°C) is unusually high, so a big temperature swing signals a SMALL c, not a large heat transfer.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Specific Heat & Calorimetry' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
