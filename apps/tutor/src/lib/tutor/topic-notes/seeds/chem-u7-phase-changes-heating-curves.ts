/**
 * Chemistry — Unit 7.2: Phase Changes & Heating Curves.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u7-phase-changes-heating-curves.ts
 * (planId evelyn.hs.chem.phase-changes-heating-curves.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.phase-changes-heating-curves';
const PLAN_ID = 'evelyn.hs.chem.phase-changes-heating-curves.v1';

export const BASELINE_CHEM_U7_PHASE_CHANGES_HEATING_CURVES: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 7,
  cedTopic: '7.2',
  cedTitle: 'Phase Changes & Heating Curves',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Two accounts energy can go into',
      content:
        'Added heat either speeds particles up (KINETIC energy — what the thermometer reads as temperature) or pulls particles apart against their attractions (POTENTIAL energy, stored in the separation). For one sample it never does both at the same moment. Every heating-curve question is deciding which account is being filled.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Rising segment → q = mcΔT',
      content:
        'While the substance stays solid, or stays liquid, or stays gas, all added heat goes to kinetic energy and the temperature climbs steadily. Use q = mcΔT (mass × specific heat × temperature change).',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Flat plateau → q = mΔH',
      content:
        'The moment melting or boiling starts, the temperature STOPS changing even though heat keeps flowing in — every joule goes to potential energy, breaking attractions. ΔT = 0 there, so q = mcΔT returns nothing; use q = mΔH instead (ΔHfus for melting, ΔHvap for boiling).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Water’s constants',
      content:
        'Melting sits at 0 °C and costs ΔHfus = 334 J/g. Boiling sits at 100 °C and costs ΔHvap = 2260 J/g — about 6.8 times more per gram, so the boiling plateau lasts far longer. Specific heats differ by phase: ice 2.06, liquid water 4.18, steam 2.02 J/g·°C. Liquid water needs roughly twice the energy per degree, so its warming segment is the slowest-rising one.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why vaporizing costs more than melting',
      content:
        'Melting only loosens particles enough to let them slide past one another; vaporizing must separate them COMPLETELY. Full separation costs far more energy than partial loosening — hence the 334 J/g versus 2260 J/g gap for water.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'A multi-stage trip is a SUM',
      content:
        'Ice below 0 °C to steam above 100 °C is five separate calculations added together: warm the ice, melt it, warm the liquid, boil it, warm the steam. A single mcΔT across the whole range is always wrong, and always too small.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Cooling runs the movie backward',
      content:
        'Freezing and condensing RELEASE exactly what melting and boiling absorbed, at the same temperatures — energy is conserved, just moved. Melting and boiling are endothermic (ΔH positive); freezing and condensing are exothermic (ΔH negative). Same magnitude, opposite sign.',
    },
  ],
  methods: [
    {
      title: 'Stage-and-sum a heating-curve energy problem',
      when_to_use:
        'Any "how much heat to take X from temperature A to temperature B" question, especially when the trip crosses a melting or boiling point.',
      steps: [
        'Sketch the trip in words and mark every melting or boiling point it crosses — each crossing is a plateau stage.',
        'Split into stages: one warming stage per phase, one plateau stage per phase change.',
        'For each warming stage use q = mcΔT with THAT phase’s specific heat and that stage’s ΔT only.',
        'For each plateau use q = mΔH (ΔHfus at the melting point, ΔHvap at the boiling point) — no ΔT appears.',
        'Add all stage values for q_total, then check that the plateau terms dominate; if a plateau is missing the total will be far too small.',
      ],
      example: {
        problem:
          'How much heat takes 50.0 g of liquid water from 25.0 °C to steam at 100.0 °C? (c = 4.18 J/g·°C, ΔHvap = 2260 J/g)',
        solution:
          'Stage 1 (warm the liquid, one phase): ΔT = 100.0 − 25.0 = 75.0 °C, q₁ = (50.0)(4.18)(75.0) = 15,675 J. Stage 2 (boil at constant 100.0 °C): q₂ = (50.0)(2260) = 113,000 J. Total = 128,675 J, about 129 kJ — over 87% of it in the flat boiling plateau, which is why a pot reaches a boil quickly but takes far longer to boil dry.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Audit a one-formula answer for a missing plateau',
      when_to_use:
        'A worked answer runs a single q = mcΔT across a temperature range, or the total looks suspiciously small.',
      steps: [
        'Check whether the stated range crosses 0 °C or 100 °C (or the substance’s own melting/boiling point).',
        'If it does, the answer silently assumed melting or boiling is free — flag the missing mΔH term.',
        'Check the specific heat used: each phase has its own, and one phase’s c must never be carried across a plateau.',
        'Rebuild the calculation stage by stage and compare totals to size the error.',
      ],
      example: {
        problem:
          '10.0 g of ice at −10.0 °C to liquid water at 10.0 °C. A student writes q = (10.0)(4.18)(20.0) = 836 J. (c ice = 2.06, ΔHfus = 334 J/g, c liquid = 4.18)',
        solution:
          'The trip crosses 0 °C, so a melting plateau sits inside it, and the liquid specific heat was used for the ice stretch. Stage 1: (10.0)(2.06)(10.0) = 206 J. Stage 2 (melt at 0 °C): (10.0)(334) = 3340 J — the dropped term, and the biggest one. Stage 3: (10.0)(4.18)(10.0) = 418 J. Total 3964 J, nearly five times the student’s 836 J.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Read a plateau or a phase-change energy release qualitatively',
      when_to_use:
        'A question asks WHY the temperature holds constant, or why condensing/freezing delivers so much energy.',
      steps: [
        'Confirm heat is still flowing — a plateau is not a pause in heating.',
        'Assign the energy to the potential account: attractions are being broken (or, on cooling, re-formed).',
        'State the temperature consequence: average kinetic energy is unchanged, so the thermometer holds steady.',
        'For a cooling/condensing question, quote the reverse magnitude — condensing releases ΔHvap per gram before the sample has cooled by even one degree.',
      ],
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Rising stretch = one phase warming → q = mcΔT. Flat plateau = phase change at constant temperature → q = mΔH. Deciding which one you are on is the whole problem.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        '"Adding heat always raises the temperature" is false. During melting or boiling every added joule goes into potential energy, so the sample gains energy while the thermometer holds perfectly steady — that is why ice water stays at 0 °C on a warm counter.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Never carry one phase’s specific heat across a plateau: ice 2.06, liquid water 4.18, steam 2.02 J/g·°C. Using 4.18 for an ice stretch is the second-most-common error after dropping the plateau entirely.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Any trip crossing a melting or boiling point is a SUM of stages; one mcΔT across the full range always undercounts, usually by several fold.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Steam at 100 °C burns worse than water at 100 °C because condensing releases 2260 J/g before the water cools by even one degree — same temperature, extra stored energy.',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
  ],
};
