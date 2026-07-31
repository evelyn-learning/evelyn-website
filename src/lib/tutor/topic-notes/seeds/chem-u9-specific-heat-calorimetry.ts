/**
 * Chemistry — Unit 9 topic 9.2: Specific Heat & Calorimetry.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u9-specific-heat-calorimetry.ts
 * (planId evelyn.hs.chem.specific-heat-calorimetry.v1).
 *
 * Bump baselineVersion when content materially changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.specific-heat-calorimetry';

export const BASELINE_CHEM_U9_SPECIFIC_HEAT_CALORIMETRY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.specific-heat-calorimetry.v1',
  course: 'Chemistry',
  cedUnit: 9,
  cedTopic: '9.2',
  cedTitle: 'Specific Heat & Calorimetry',
  planId: 'evelyn.hs.chem.specific-heat-calorimetry.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.specific-heat-calorimetry.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Heat is not temperature',
      content:
        'Heat (q) is ENERGY that flows from hot to cold, measured in joules. Temperature measures how fast particles jiggle, in °C. A bathtub of warm water holds far more heat than a 1000 °C spark: temperature says how hot, heat says how much energy moved.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Specific heat capacity (c)',
      content:
        'The energy to raise ONE gram by ONE °C, in J/(g·°C) — a fingerprint of the material. Water 4.18, aluminum ≈ 0.90, iron ≈ 0.44. Big c → resists temperature change; small c → heats and cools in a hurry.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'q = m × c × ΔT',
      content:
        'Heat (J) = mass (g) × specific heat (J/(g·°C)) × temperature change (°C). All three factors scale it: double the mass OR double ΔT and you double q.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'ΔT is a difference, and it carries the sign',
      content:
        'ΔT = T_final − T_initial. Water warmed 25 °C → 45 °C has ΔT = 20 °C, not 45. Positive q means the sample ABSORBED heat (warmed); negative q means it RELEASED heat (cooled). The sign falls straight out of ΔT.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Calorimetry = conservation in a cup',
      content:
        'Energy is conserved, so in an insulated container heat lost by the hot object equals heat gained by the cold one: q_lost = −q_gained. That is why the reaction is never measured directly — watch what the surrounding water does and let conservation supply the rest.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Thermal equilibrium',
      content:
        'Mixed samples stop exchanging heat once they share the SAME final temperature. One common T_final, but each substance has its own ΔT because each started somewhere different.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Big ΔT does not mean big q',
      content:
        'Rearranged, ΔT = q / (m × c). With q and m fixed, the substance with the SMALLER c takes the bigger temperature swing. A dramatic temperature change is evidence of a small specific heat, not of a large heat transfer.',
    },
  ],
  methods: [
    {
      title: 'Single-substance heat calculation',
      when_to_use:
        'One substance, a mass, a starting and ending temperature, and a specific heat — asking how much heat was absorbed or released.',
      steps: [
        'List the three inputs separately: m in grams, c in J/(g·°C), and the two temperatures.',
        'Compute ΔT = T_final − T_initial as its own written step, keeping the sign.',
        'Multiply: q = m × c × ΔT.',
        'Interpret the sign — positive q = heat absorbed (warmed); negative q = heat released (cooled).',
        'Convert to kJ if the question asks (divide by 1000).',
      ],
      example: {
        problem: '100.0 g of water warms from 25.0 °C to 45.0 °C. c = 4.18 J/(g·°C). Find q.',
        solution:
          'ΔT = 45.0 − 25.0 = 20.0 °C. q = 100.0 × 4.18 × 20.0 = 8360 J = 8.36 kJ, positive, so the water absorbed it.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Calorimetry: what did the reaction or hot object do?',
      when_to_use:
        'Two bodies in an insulated container (burning sample under water, hot metal into cool water) reaching a common final temperature.',
      steps: [
        'Work with the substance you have full data for — usually the water: m, c, T_initial and T_final are all given.',
        'Compute q for that substance with q = m × c × ΔT, sign included.',
        'Apply conservation to cross over: q_other = −q_water. Same magnitude, opposite sign.',
        'Label the process: water warmed → the other body released heat → exothermic for that body.',
        'If both bodies are given with masses and specific heats, remember they share one T_final but have different ΔT values.',
      ],
      example: {
        problem:
          'A burning peanut warms 100.0 g of water from 25.0 °C to 45.0 °C. What is q for the peanut?',
        solution:
          'q_water = 100.0 × 4.18 × 20.0 = +8360 J. By conservation q_peanut = −8360 J, an exothermic release of 8.36 kJ (real peanuts hold 20-25 kJ; the rest escaped to the air).',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Compare temperature swings of two substances',
      when_to_use:
        'A claim that equal masses exchanging equal energy must change temperature equally, or any "why did this one get so much hotter?" question.',
      steps: [
        'Compute q for each substance separately using its own ΔT — confirm the magnitudes match (they must, by conservation).',
        'Now compare the ΔT values, not the q values.',
        'Rearrange to ΔT = q / (m × c) and read off which c is smaller.',
        'Predict the ratio: with m and |q| matched, ΔT ratio = inverse ratio of the specific heats.',
      ],
      example: {
        problem:
          '100.0 g iron at 120.0 °C into 100.0 g water at 15.0 °C, both settling at 25.0 °C. c_water = 4.18, c_iron = 0.44.',
        solution:
          'Water: ΔT = +10.0, q = +4180 J. Iron: ΔT = −95.0, q = −4180 J. Identical energy, but 4.18 ÷ 0.44 ≈ 9.5 — exactly the ratio 95.0 ÷ 10.0 of the temperature swings.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Never substitute the FINAL temperature for ΔT. Using 60.0 instead of (60.0 − 20.0) pretends the sample was heated up from 0 °C and silently inflates the answer.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Write ΔT = T_final − T_initial as its own line before it ever touches the equation, and keep the minus sign when the sample cooled.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'q_lost = −q_gained only holds in an insulated container. Real open calorimeters under-report because heat leaks to the air — expect the measured value to come in low.',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
    {
      content:
        'Units must line up: m in grams (not kg), c in J/(g·°C), ΔT in °C. A ΔT in °C and in K are numerically identical, so either works for a CHANGE — but never for an absolute temperature.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'A huge temperature swing signals a SMALL specific heat, not a large heat transfer. Water\'s 4.18 J/(g·°C) is unusually high, which is why oceans stay cool while beach sand scorches.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
  ],
};
