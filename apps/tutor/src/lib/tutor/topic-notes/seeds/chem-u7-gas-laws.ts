/**
 * Chemistry — Unit 7.3: The Gas Laws (Boyle's, Charles's & Gay-Lussac's).
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u7-gas-laws.ts
 * (planId evelyn.hs.chem.gas-laws.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.gas-laws';
const PLAN_ID = 'evelyn.hs.chem.gas-laws.v1';

export const BASELINE_CHEM_U7_GAS_LAWS: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'The Gas Laws: Boyle\'s, Charles\'s & Gay-Lussac\'s',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Why gases obey rules at all',
      content:
        'A gas is mostly empty space with tiny particles flying fast in every direction, and pressure IS those particles hammering the walls. More collisions per second, or harder collisions, means higher pressure. Every gas law below is bookkeeping on those collisions.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Boyle\'s law — T and amount fixed',
      content:
        'P₁V₁ = P₂V₂. Squeeze the gas into half the volume and the same particles strike a smaller wall area twice as often, so pressure DOUBLES. Pressure and volume are INVERSE — their product stays constant, so the two sides MULTIPLY across.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Charles\'s law — P and amount fixed',
      content:
        'V₁/T₁ = V₂/T₂. Heating makes particles move faster; in a flexible container (balloon, free piston) the walls expand until the collisions balance the outside pressure again. Volume and ABSOLUTE temperature are DIRECT, so the two sides are equal fractions.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Gay-Lussac\'s law — V and amount fixed',
      content:
        'P₁/T₁ = P₂/T₂. In a RIGID sealed container the walls cannot move, so faster particles simply hit harder. Pressure and absolute temperature are DIRECT. This is the "do not store above 50°C" spray-can warning written as an equation.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Step zero — what is held constant?',
      content:
        'A rigid steel cylinder pins the VOLUME → Gay-Lussac. A balloon or a piston free to move pins the PRESSURE → Charles. A sealed syringe pushed at room temperature pins the TEMPERATURE → Boyle. Name the constant first and the law picks itself.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Kelvin is not optional',
      content:
        'Every temperature in a gas-law ratio must be absolute: K = °C + 273. The kelvin scale starts at absolute zero (about -273°C), where particle motion stops, so kelvins are proportional to particle energy. Celsius has an arbitrary zero, so 20°C is NOT twice as hot as 10°C — and 0°C in a denominator divides by zero.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'One equation to rule them all',
      content:
        'The combined gas law P₁V₁/T₁ = P₂V₂/T₂ contains all three. Cross out whatever is constant on both sides and Boyle, Charles, or Gay-Lussac falls out. Memorize one, recover three.',
    },
  ],
  methods: [
    {
      title: 'Solve a two-variable gas-law problem',
      when_to_use:
        'One sealed sample of gas moves from an old set of conditions to a new one and two of P, V, T are in play.',
      steps: [
        'Step zero — name what is held constant (rigid → V, flexible/free piston → P, isothermal → T). That choice picks the law.',
        'Write the matching equation: Boyle P₁V₁ = P₂V₂ (inverse, multiply across); Charles V₁/T₁ = V₂/T₂ or Gay-Lussac P₁/T₁ = P₂/T₂ (direct, equal fractions).',
        'Convert every temperature to kelvins with K = °C + 273 BEFORE substituting anything.',
        'List the knowns with units, substitute, and solve for the single unknown.',
        'Sanity-check the DIRECTION: inverse pairs must move opposite ways, direct pairs the same way. A wrong direction means the setup pattern was inverted.',
      ],
      example: {
        problem:
          'A sealed syringe holds 6.0 L at 2.0 atm; the plunger is pushed until the pressure reads 3.0 atm at constant temperature. New volume?',
        solution:
          'Temperature fixed and the gas is sealed → Boyle. (2.0)(6.0) = (3.0)(V₂), so 12 = 3.0 V₂ and V₂ = 4.0 L. Direction check: pressure went up, so an inverse relationship demands the volume go down — 4.0 L is less than 6.0 L. ✓ (9.0 L would have meant an inverted setup.)',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Convert before you divide (the Celsius audit)',
      when_to_use:
        'Any gas-law setup where a temperature in °C appears, or an answer came out wildly too large or negative.',
      steps: [
        'Scan the ratio for raw Celsius numbers — a Celsius value inside a fraction is always an error.',
        'Convert both temperatures: K = °C + 273, and recompute the true temperature ratio.',
        'Redo the substitution with kelvins and compare the two answers to size the mistake.',
        'Note the physical tell: Celsius arithmetic can predict a negative or absurdly large volume, which absolute temperature never does.',
      ],
      example: {
        problem:
          'A balloon holds 2.0 L at 27°C and is warmed to 327°C at constant pressure. A student writes V₂ = 2.0 × (327/27) ≈ 24 L.',
        solution:
          'The law choice (Charles) is right; the UNIT is wrong. 327/27 claims a twelve-fold heating, but the Celsius zero is only water\'s freezing point. Convert: T₁ = 300 K, T₂ = 600 K — the gas merely doubled in absolute temperature. 2.0/300 = V₂/600 → V₂ = 4.0 L, a six-fold correction. At -50°C the Celsius method would even predict a negative volume; 223 K stays comfortably positive.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Rebuild a forgotten law from the combined gas law',
      when_to_use:
        'You cannot recall which of Boyle, Charles, or Gay-Lussac applies, or which variables pair up.',
      steps: [
        'Write the combined law: P₁V₁/T₁ = P₂V₂/T₂.',
        'Identify the quantity the problem holds constant and cancel it from both sides.',
        'Read off what is left: cancel T → P₁V₁ = P₂V₂ (Boyle); cancel P → V₁/T₁ = V₂/T₂ (Charles); cancel V → P₁/T₁ = P₂/T₂ (Gay-Lussac).',
        'Proceed with kelvins and solve as usual.',
      ],
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Boyle (T constant): P₁V₁ = P₂V₂, inverse — squeeze it, pressure rises. Charles (P constant): V₁/T₁ = V₂/T₂, direct — heat a balloon, it expands. Gay-Lussac (V constant): P₁/T₁ = P₂/T₂, direct — heat a rigid can, pressure climbs.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Writing Boyle as P₁/V₁ = P₂/V₂ inverts the answer. Quantities that FIGHT each other multiply to a constant; only quantities that rise together go into equal fractions.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Celsius inside a ratio is the single most common gas-law error. Convert first, every time: K = °C + 273.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'A balloon in the freezer shrinks because the particles slow down and hit the wall less often and less hard, so outside air pushes the wall inward. Particles never change size — only spacing and collision rate do.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Fast direction check on any answer: pressure up should mean volume down (Boyle), temperature up should mean volume up (Charles) or pressure up (Gay-Lussac). Wrong direction = wrong pattern, not just wrong arithmetic.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
  ],
};
