/**
 * Chemistry — Unit 9 topic 9.4: Equilibrium & Le Chatelier's Principle.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u9-equilibrium-le-chatelier.ts
 * (planId evelyn.hs.chem.equilibrium-le-chatelier.v1).
 *
 * Bump baselineVersion when content materially changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.equilibrium-le-chatelier';

export const BASELINE_CHEM_U9_EQUILIBRIUM_LE_CHATELIER: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.equilibrium-le-chatelier.v1',
  course: 'Chemistry',
  cedUnit: 9,
  cedTopic: '9.4',
  cedTitle: "Equilibrium & Le Chatelier's Principle",
  planId: 'evelyn.hs.chem.equilibrium-le-chatelier.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.equilibrium-le-chatelier.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Reversible reactions',
      content:
        'Most reactions run both ways, written with a double arrow: N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g). The forward reaction builds product; the reverse tears it back apart.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Equilibrium = equal rates, not zero rates',
      content:
        'As reactants are consumed the forward rate falls; as product accumulates the reverse rate rises. When the two rates match, concentrations stop changing. Both reactions still run at full speed — they simply cancel. Hence DYNAMIC equilibrium.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Equal rates ≠ equal amounts',
      content:
        'The balance point can sit far to the product side, far to the reactant side, or anywhere between. An equilibrium can be 99% products or 99% reactants and still be perfectly balanced.',
    },
    {
      loId: LO,
      kind: 'law',
      title: "Le Chatelier's principle",
      content:
        'Disturb a system at equilibrium and it shifts in whichever direction partly UNDOES the disturbance. Working question: what do I now have too much (or too little) of, and which direction consumes (or replaces) it?',
    },
    {
      loId: LO,
      kind: 'shifter-list',
      title: 'Stress 1 — concentration',
      content:
        'Add a reactant or remove a product → shift RIGHT, toward products. Add a product or remove a reactant → shift LEFT. Industry drains product off continuously, so the reaction keeps chasing an equilibrium it never reaches (Haber ammonia, lime kilns venting CO₂).',
    },
    {
      loId: LO,
      kind: 'shifter-list',
      title: 'Stress 2 — pressure / volume (gases only)',
      content:
        'Compressing raises pressure, so the system shifts toward the side with FEWER moles of gas; expanding shifts toward MORE moles. Count the gas coefficients on each side first — a tie means pressure does nothing. Solids and liquids are not counted.',
    },
    {
      loId: LO,
      kind: 'shifter-list',
      title: 'Stress 3 — temperature',
      content:
        'Treat heat as a substance. Exothermic → heat is a PRODUCT (N₂ + 3 H₂ ⇌ 2 NH₃ + heat, ΔH = −92 kJ). Endothermic → heat is a REACTANT (N₂O₄ ⇌ 2 NO₂, ΔH = +57 kJ). Heating shifts AWAY from the heat side; cooling shifts TOWARD it. Temperature is the only stress that moves the balance point itself.',
    },
  ],
  methods: [
    {
      title: 'Predict a shift from any single stress',
      when_to_use:
        'A balanced reversible equation plus one change — something added or removed, the vessel compressed or expanded, or the temperature raised or lowered.',
      steps: [
        'Classify the stress: concentration, pressure/volume, or temperature.',
        'For CONCENTRATION — locate the changed species. Added → shift away from that side; removed → shift toward that side.',
        'For PRESSURE — count moles of GAS on each side using the coefficients. Compression shifts toward the smaller total; expansion toward the larger; a tie gives no shift.',
        'For TEMPERATURE — write heat into the equation using the sign of ΔH (product if exothermic, reactant if endothermic), then apply the concentration rule to "heat".',
        'State the direction (right/left) AND the consequence in amounts (more/less of the named product).',
      ],
      example: {
        problem:
          'Haber: N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g), ΔH = −92 kJ. Effect of (a) extra N₂, (b) compression, (c) heating?',
        solution:
          '(a) Right — the system consumes the added N₂, making more NH₃. (b) Right — 4 moles of gas on the left vs 2 on the right, so it shifts to the smaller side. (c) Left — heat is a product of an exothermic reaction, so adding heat drives it back toward N₂ and H₂.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Apply the pressure rule correctly (mole count, not direction)',
      when_to_use:
        'Any compression or expansion claim, especially "higher pressure makes more product".',
      steps: [
        'Reject the direction shortcut: the rule is "toward FEWER moles of gas", never "toward products".',
        'Sum the coefficients of GAS species only, side by side. Ignore (s) and (l) entries.',
        'Compare the totals: compression → shift to the smaller total; expansion → shift to the larger; equal totals → NO shift, because shifting relieves nothing.',
        'If the reaction is in solution rather than the gas phase, pressure is irrelevant entirely.',
      ],
      example: {
        problem: 'Does compressing H₂(g) + I₂(g) ⇌ 2 HI(g) make more HI?',
        solution:
          'No. Gas moles: left 1 + 1 = 2, right 2 — a tie. Compression causes no shift; both concentrations rise together and the balance holds where it was.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Diagnose "did the equilibrium actually move?"',
      when_to_use:
        'Claims involving catalysts, or descriptions where rates changed but positions may not have.',
      steps: [
        'Ask whether the change altered the relative amounts of anything the reaction consumes or produces (including heat).',
        'A CATALYST speeds forward and reverse by exactly the same factor — equilibrium arrives sooner, in the SAME place. No shift.',
        'Concentration and pressure stresses move the AMOUNTS but not the underlying balance point; temperature moves the balance point itself.',
        'Answer in two parts: what happened to the rates, and what happened to the position.',
      ],
      example: {
        problem: 'Iron catalyst added to a Haber reactor already at equilibrium.',
        solution:
          'Forward and reverse rates both rise by the same factor, so the position does not move at all. The plant reaches its equilibrium yield faster, not a larger one.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Equilibrium never means "the reaction stopped". Both directions run at full speed at the SAME rate — an escalator going up while you walk down at matching pace.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Equal RATES do not imply equal AMOUNTS. Nothing about equilibrium says 50/50.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Count gas coefficients BEFORE applying the pressure rule, and count only gases. Tied sides → no shift; solids and liquids never enter the count.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Temperature trick: write "+ heat" on the product side when ΔH is negative and on the reactant side when ΔH is positive, then treat heat exactly like any other species.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'A catalyst changes the schedule, never the destination. Real Haber plants run near 400 °C anyway — low temperature would favor yield but be far too slow, so rate is bought at the cost of yield.',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
  ],
};
