/**
 * Chemistry — Unit 9 topic 9.1: Endothermic & Exothermic Reactions.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u9-endothermic-exothermic.ts
 * (planId evelyn.hs.chem.endothermic-exothermic.v1).
 *
 * Bump baselineVersion when content materially changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.endothermic-exothermic';

export const BASELINE_CHEM_U9_ENDOTHERMIC_EXOTHERMIC: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.endothermic-exothermic.v1',
  course: 'Chemistry',
  cedUnit: 9,
  cedTopic: '9.1',
  cedTitle: 'Endothermic & Exothermic Reactions',
  planId: 'evelyn.hs.chem.endothermic-exothermic.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.endothermic-exothermic.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Breaking absorbs, forming releases',
      content:
        'A bond is a stable, low-energy arrangement, so pulling one apart COSTS energy and snapping a new one together PAYS energy back. Every reaction does both. This one sentence is backwards in most heads — bonds do not "store energy you get by breaking them".',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'ΔH is the net bill',
      content:
        'ΔH = (energy to break ALL reactant bonds) − (energy released forming ALL product bonds). Broken first, formed second. It is the difference of the two totals, never either total alone.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Sign convention',
      content:
        'ΔH negative = EXOTHERMIC: forming paid back more than breaking cost, the surplus leaves as heat, surroundings WARM. ΔH positive = ENDOTHERMIC: breaking cost more than forming paid, the system pulls the shortfall in, surroundings COOL.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Reading an energy diagram',
      content:
        'Plot reactants and products by energy. Products BELOW reactants → energy left the system → exothermic, ΔH negative. Products ABOVE reactants → energy entered → endothermic, ΔH positive. The vertical gap between the levels is |ΔH|.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Where you meet each one',
      content:
        'Exothermic: combustion of fuels, hand warmers, acid-base neutralization, explosions, respiration. Endothermic: instant cold packs, melting ice, cooking an egg, photosynthesis, decomposing limestone in a cement kiln.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Core vocabulary',
      content:
        'exothermic — releases energy to the surroundings, ΔH negative. endothermic — absorbs energy from the surroundings, ΔH positive. enthalpy change (ΔH) — net energy exchanged with the surroundings at constant pressure. bond energy — kJ/mol needed to break one mole of a bond, and the same amount released when it forms.',
    },
  ],
  methods: [
    {
      title: 'Bond-energy ΔH calculation',
      when_to_use:
        'A reaction equation plus a table of bond energies in kJ/mol, asking for ΔH and/or the endo/exo classification.',
      steps: [
        'Count the bonds BROKEN on the reactant side, multiplying by the coefficients (2 H₂ → 2 H-H bonds; O₂ → 1 O=O bond).',
        'Total the breaking cost: Σ(count × bond energy). This number is always positive.',
        'Count the bonds FORMED on the product side, again multiplying by coefficients AND by the bonds per molecule (2 H₂O → 4 O-H bonds).',
        'Total the forming payback: Σ(count × bond energy).',
        'ΔH = broken − formed. Keep that order; it is part of the definition.',
        'Classify from the sign: negative → exothermic (heat out, products below reactants); positive → endothermic (heat in, products above reactants).',
      ],
      example: {
        problem:
          '2 H₂ + O₂ → 2 H₂O, with H-H = 436, O=O = 498, O-H = 463 kJ/mol. Find ΔH and classify.',
        solution:
          'Broken: 2 × 436 + 1 × 498 = 1370 kJ. Formed: 4 O-H × 463 = 1852 kJ. ΔH = 1370 − 1852 = -482 kJ → exothermic; the 482 kJ surplus leaves as heat and light.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Classify a process from what the surroundings do',
      when_to_use:
        'A description of a physical observation (pack gets cold, beaker gets hot, thermometer drops) with no numbers given.',
      steps: [
        'Ask which way ENERGY moved, never which way "cold" moved — cold is not a substance.',
        'Surroundings got COLDER → energy flowed INTO the system → endothermic → ΔH positive.',
        'Surroundings got HOTTER → energy flowed OUT of the system → exothermic → ΔH negative.',
        'State both halves together (label + sign) so the two never drift apart in your answer.',
      ],
      example: {
        problem: 'An instant cold pack drops from 22°C to 2°C when ammonium nitrate dissolves.',
        solution:
          'The pack pulls energy out of the water and your skin, so energy flows IN to the system: endothermic, ΔH positive. It does not "release cold".',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Audit a suspicious ΔH answer',
      when_to_use:
        'Your sign disagrees with the physical description, or a worked answer classifies a familiar exothermic reaction as endothermic.',
      steps: [
        'Re-check the two totals independently — they are usually correct; the fault is normally the subtraction order.',
        'Confirm you wrote broken − formed, not formed − broken. Reversing it flips the sign and the classification together.',
        'Sanity-check against the physical fact: if formed > broken there is surplus energy with nowhere to go but out, so ΔH must be negative.',
        'Cross-check with reality (ammonia plants remove heat from the reactor; rocket engines get hot) before committing to the label.',
      ],
      example: {
        problem:
          'N₂ + 3 H₂ → 2 NH₃ with N≡N = 941, H-H = 436, N-H = 391. A student reports +97 kJ, endothermic.',
        solution:
          'Broken = 941 + 3 × 436 = 2249 kJ; formed = 6 N-H × 391 = 2346 kJ. The student did formed − broken. Correct: ΔH = 2249 − 2346 = -97 kJ, exothermic.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Nothing releases "cold". A cold pack feels cold because it TAKES energy from your skin — energy in means endothermic, ΔH positive.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Subtraction order is part of the definition: ΔH = bonds BROKEN − bonds FORMED. Flip it and an explosion becomes a cold pack.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Memory hook: you PAY to break, you get PAID to form. Net negative payment (you collected more than you spent) = exothermic.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Count bonds per molecule, not per formula unit: 2 H₂O is 4 O-H bonds, and 2 NH₃ is 6 N-H bonds. Miscounting here is the second-most common wrong answer after the sign flip.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Diagram check: products below reactants ⇔ negative ΔH ⇔ exothermic. If your diagram and your sign disagree, one of them is wrong — fix it before answering.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
  ],
};
