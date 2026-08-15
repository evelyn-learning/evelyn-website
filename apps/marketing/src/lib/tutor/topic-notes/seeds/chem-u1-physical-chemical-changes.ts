/**
 * Chemistry — Unit 1 topic 1.2: Physical & Chemical Properties and
 * Changes.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u1-physical-chemical-changes.ts
 * (planId evelyn.hs.chem.physical-chemical-changes.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.physical-chemical-changes';
const PLAN_ID = 'evelyn.hs.chem.physical-chemical-changes.v1';

export const BASELINE_CHEM_U1_PHYSICAL_CHEMICAL_CHANGES: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Physical & Chemical Properties and Changes',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'The identity test',
      content:
        'One question decides every case: after the change, is it still the same substance? Yes → PHYSICAL change. No, new substances with new properties now exist → CHEMICAL change. Memorized example lists fail on unfamiliar cases; the identity test never does.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Physical vs chemical property',
      content:
        'PHYSICAL property = measurable WITHOUT destroying the substance: color, odor, density, melting point, boiling point, hardness, solubility, conductivity, state. Measuring copper\'s density leaves you with copper. CHEMICAL property = how the substance reacts, observable only by letting it become something else: flammability, reactivity with acid, ability to rust, toxicity.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Intensive vs extensive',
      content:
        'INTENSIVE properties (density, melting point, color) do not depend on how much you have; EXTENSIVE properties (mass, volume, length) do. Only intensive properties identify a substance — a 1 g chip and a 50 kg block of aluminum share the same density, 2.7 g/cm³.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'What each change does to the particles',
      content:
        'PHYSICAL change: form, shape, or state changes while the molecules survive intact — melting ice is still H₂O, dissolved salt is still Na⁺ and Cl⁻, drawn copper wire is still copper. CHEMICAL change: atoms REARRANGE into new substances, reactants → products, e.g. 2 Mg + O₂ → 2 MgO turns a shiny bendable metal and an invisible gas into white crumbly powder.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Evidence of a chemical change',
      content:
        'Unexpected color change, gas produced by mixing (not by heating past a boiling point), a precipitate when two clear solutions meet, light emitted, or a temperature change the surroundings did not supply. Treat all five as CLUES that trigger the identity test — never as proof on their own.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Conservation of mass',
      content:
        'Atoms are never created or destroyed, so in a closed system total mass before = total mass after, for physical AND chemical changes alike. Burning wood only looks like mass vanished because CO₂ and water vapor left the scene; burned magnesium GAINS mass because oxygen from the air joined it.',
    },
  ],
  methods: [
    {
      title: 'Label a lab observation: property type and change type',
      when_to_use:
        'When a list of observations must be sorted into physical property, chemical property, extensive property, and change classification.',
      steps: [
        'Ask whether observing it destroyed the substance. No → physical property. Yes, it had to become something else → chemical property.',
        'For each physical property, ask whether the value changes when you cut the sample in half. Changes → EXTENSIVE (mass, volume). Unchanged → INTENSIVE (density, color, melting point) and therefore usable to identify the substance.',
        'For any event described, run the identity test on the substances present before and after; write the reaction if new substances formed.',
        'Report the pairing explicitly — a chemical property is observed only by carrying out a chemical change.',
      ],
      example: {
        problem:
          'Zinc strip: (1) shiny and gray, (2) density 7.1 g/cm³, (3) mass 5.0 g, (4) dropped in hydrochloric acid it fizzes and dissolves.',
        solution:
          '(1) physical, intensive. (2) physical, intensive — identifies the metal. (3) physical but EXTENSIVE, so it can never identify a substance. (4) chemical property, and the event is a chemical change: Zn + 2 HCl → ZnCl₂ + H₂; the zinc is now dissolved ZnCl₂ and the fizz is newly formed H₂.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Decide whether bubbles prove a chemical change',
      when_to_use: 'Whenever gas is produced and the classification is in doubt.',
      steps: [
        'Name the gas. Is it a substance that did NOT exist a moment ago, or the same substance that was already in the container?',
        'Same substance escaping → physical: boiling water gives H₂O vapor; an opened soda releases CO₂ that was already dissolved CO₂.',
        'New substance → chemical: an antacid tablet in water releases CO₂ built from bicarbonate and citric acid rearranging.',
        'Cross-check with reversibility and temperature: steam condenses back to water and the pot holds at 100 °C while energy separates molecules rather than breaking bonds inside them.',
      ],
      example: {
        problem: '"Boiling water is chemical because gas forms." Diagnose.',
        solution:
          'The bubbles are H₂O vapor — the same substance — so the "gas produced" clue does not apply. Boiling is a PHYSICAL change however violent it looks. Ask "is the gas new?", not "are there bubbles?"',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Solve a conservation-of-mass problem',
      when_to_use: 'Sealed-container problems giving all masses but one.',
      steps: [
        'Confirm the system is closed — no gas escaped and none entered — so no atoms were gained or lost.',
        'Write total reactant mass = total product mass.',
        'Substitute the known masses and solve for the missing one.',
        'Sanity-check the direction: a solid that gained mass took something from the air; a solid that "lost" mass released a gas.',
      ],
      example: {
        problem: '2.4 g of magnesium burns in sealed oxygen and yields 4.0 g of magnesium oxide. Mass of oxygen consumed?',
        solution: '2.4 g + mass O₂ = 4.0 g → mass O₂ = 1.6 g. The product is heavier than the metal because oxygen joined it.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Bubbles ≠ chemical. Boiling water bubbles furiously and is still H₂O. The clue only counts when the gas is a NEW substance.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Irreversible ≠ chemical. A shattered mug and a stirred milkshake can never be undone, yet no new substance formed. Reversibility is a hint, never the test.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Dissolving is physical. Salt in water separates into Na⁺ and Cl⁻ ions that already existed in the crystal, and boiling the water brings the crystals back unchanged.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Mass never disappears. Burning wood seems lighter only because CO₂ and water vapor escaped; weigh the whole system and mass is conserved.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Mass alone identifies nothing — it is extensive. Reach for density, melting point, or boiling point when the question is "which substance is it?"',
      kind: 'tip',
      relatedLoIds: [LO],
    },
  ],
};
