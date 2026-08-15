/**
 * Chemistry — Unit 7.4: The Combined & Ideal Gas Laws.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u7-ideal-gas-law.ts
 * (planId evelyn.hs.chem.ideal-gas-law.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.ideal-gas-law';
const PLAN_ID = 'evelyn.hs.chem.ideal-gas-law.v1';

export const BASELINE_CHEM_U7_IDEAL_GAS_LAW: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'The Combined & Ideal Gas Laws',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'The combined gas law',
      content:
        'P₁V₁/T₁ = P₂V₂/T₂ follows ONE sealed sample from an old set of conditions to a new one. Because the amount of gas never changes, moles never appear and R never appears.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'It swallows the three simple laws',
      content:
        'Cover whichever variable stays constant and it cancels from both sides: hold T → Boyle (P₁V₁ = P₂V₂); hold P → Charles (V₁/T₁ = V₂/T₂); hold V → Gay-Lussac (P₁/T₁ = P₂/T₂). Memorize one equation, not four.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'The ideal gas law',
      content:
        'PV = nRT describes ONE state — no subscripts, no before-and-after. It is the only gas law containing n, the moles of gas, so reach for it whenever the amount of gas (moles, mass, or molar mass) is given or asked for.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'R carries its units with it',
      content:
        'R = 0.0821 L·atm/(mol·K). Using that value LOCKS every other unit: P in atm, V in liters, n in moles, T in kelvin. Millilitres, mmHg, or degrees Celsius plugged in beside it produce a wrong answer with no warning from the arithmetic.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Choosing the right tool',
      content:
        'Two sets of conditions for the same sealed sample → combined gas law (ratio form, R absent). One set of conditions with moles, mass, or molar mass involved → PV = nRT. Kelvin is required in both: K = °C + 273, because a negative Celsius temperature would predict a negative volume.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Molar volume at STP',
      content:
        'At standard temperature and pressure — 0 °C (273 K) and 1 atm — one mole of ANY ideal gas occupies 22.4 L. This is not a separate rule; it is PV = nRT with those numbers already substituted, so it is valid ONLY at STP.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'What "ideal" assumes',
      content:
        'An ideal gas has particles with zero volume of their own and no attractions between them. Real gases follow PV = nRT closely at ordinary conditions and deviate at very high pressure or very low temperature, where particles are crowded and sticky.',
    },
  ],
  methods: [
    {
      title: 'Combined-gas-law solve (one sample, two states)',
      when_to_use:
        'A sealed sample changes conditions and the problem never mentions moles, mass, or molar mass.',
      steps: [
        'Confirm the amount of gas is fixed and two states are described → P₁V₁/T₁ = P₂V₂/T₂.',
        'List P₁, V₁, T₁, P₂, V₂, T₂ and convert every temperature to kelvin (K = °C + 273).',
        'Rearrange algebraically for the unknown BEFORE substituting, e.g. V₂ = P₁V₁T₂ / (P₂T₁).',
        'Substitute and compute numerator and denominator separately.',
        'Sanity-check by separating the two effects: what would the pressure change alone do, and what would the temperature change alone do? Their product should match your answer.',
      ],
      example: {
        problem:
          'A weather balloon holds 6.0 L of helium at 1.0 atm and 300 K, then rises to 0.50 atm and 200 K. New volume?',
        solution:
          'V₂ = P₁V₁T₂/(P₂T₁) = (1.0 × 6.0 × 200)/(0.50 × 300) = 1200/150 = 8.0 L. Check: halving the pressure alone would double 6.0 L to 12 L, while cooling 300 K → 200 K alone shrinks it to two-thirds; 12 × (2/3) = 8.0 L. ✓ The balloon expands because the pressure drop outweighs the cooling.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'PV = nRT solve with a unit audit',
      when_to_use:
        'One state of a gas is described and moles, mass, or molar mass appear anywhere in the problem.',
      steps: [
        'Rearrange for the unknown first: n = PV/RT, P = nRT/V, V = nRT/P, T = PV/(nR).',
        'Run the unit audit against R = 0.0821 L·atm/(mol·K): pressure → atm (760 mmHg = 1.00 atm), volume → liters (1000 mL = 1 L), temperature → kelvin (K = °C + 273).',
        'If mass is given instead of moles, convert with n = mass ÷ molar mass before substituting.',
        'Substitute the converted values and compute.',
        'Reasonableness check: near STP a mole of gas occupies roughly 22–25 L, so compare your n against V ÷ 22.4.',
      ],
      example: {
        problem:
          'A 24.63 L cylinder holds gas at 1.0 atm and 27 °C. A student writes n = (1.0 × 24.63)/(0.0821 × 27) = 11.1 mol.',
        solution:
          'R is defined PER KELVIN, so the Celsius 27 is invalid — convert to 27 + 273 = 300 K. Then n = (1.0 × 24.63)/(0.0821 × 300) = 24.63/24.63 = 1.00 mol. The error factor (300/27 ≈ 11) is exactly how far the student\'s answer was off; 11 mol crammed into 24.63 L at 1 atm should have failed the reasonableness check immediately.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Use molar volume at STP as a shortcut',
      when_to_use:
        'The conditions are stated as STP (or 0 °C and 1 atm) and you need moles from volume, or volume from moles.',
      steps: [
        'Verify the conditions really are 0 °C (273 K) and 1 atm — otherwise the shortcut does not apply and you must run PV = nRT.',
        'Convert volume to liters.',
        'Moles from volume: n = V ÷ 22.4 L/mol. Volume from moles: V = n × 22.4 L/mol.',
        'Remember the shortcut is identity-blind: one mole of any ideal gas takes the same 22.4 L regardless of how heavy its particles are.',
      ],
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Combined gas law = one sealed sample, two sets of conditions (no moles, no R). PV = nRT = one state, and the only gas law that contains moles. Pick by asking whether the amount of gas is in play.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Kelvin or nothing: K = °C + 273 in every gas-law temperature, every time. R = 0.0821 L·atm/(mol·K) is defined per kelvin, so Celsius beside it is silently wrong.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'R locks the units, not just the temperature: atm, liters, moles, kelvin. 760 mmHg = 1.00 atm and 500 mL = 0.500 L — plugging in mmHg and mL can be off by a factor of hundreds of thousands with nothing in the arithmetic to warn you.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        '22.4 L/mol holds ONLY at STP (0 °C, 1 atm). At any other conditions it is not a shortcut, it is a wrong answer — go back to PV = nRT.',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
    {
      content:
        '"Ideal" assumes zero particle volume and no attractions. That holds well at ordinary conditions and breaks down at very high pressure or very low temperature, where real gases deviate.',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
  ],
};
