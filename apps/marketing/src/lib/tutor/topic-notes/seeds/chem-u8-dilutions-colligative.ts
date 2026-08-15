/**
 * Chemistry — Unit 8 topic 8.3: Dilutions & Colligative Properties.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u8-dilutions-colligative.ts
 * (planId evelyn.hs.chem.dilutions-colligative.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.dilutions-colligative';

export const BASELINE_CHEM_U8_DILUTIONS_COLLIGATIVE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.dilutions-colligative.v1',
  course: 'Chemistry',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'Dilutions & Colligative Properties',
  planId: 'evelyn.hs.chem.dilutions-colligative.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.dilutions-colligative.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Dilution adds solvent, never solute',
      content:
        'Adding water to a solution leaves the moles of solute exactly as they were — they are simply spread through more liters, so the concentration drops. Nothing is created, destroyed, or reacted.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'M₁V₁ = M₂V₂',
      content:
        'That sentence in symbols: moles before = moles after, and moles = molarity × volume. Subscript 1 = the concentrated stock; subscript 2 = the final diluted solution. Solve for whichever of the four slots is missing.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Units must match, not convert',
      content:
        'Volume appears on both sides of M₁V₁ = M₂V₂, so mL with mL and L with L both work — the conversion cancels. Molarity must be mol/L on both sides. Mixing mL on one side with L on the other is a silent factor-of-1000 error.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'V₂ is the FINAL TOTAL volume',
      content:
        '"Dilute to 300 mL" means the finished solution measures 300 mL in the flask — not that 300 mL of water was poured in. Starting from 50 mL of stock, that is only 250 mL of added water. V₂ is a mark you fill UP TO, never an amount you pour IN.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Colligative properties count particles',
      content:
        'A colligative property depends only on HOW MANY solute particles are dissolved, not on their chemical identity. Sugar and salt are nothing alike chemically, yet per dissolved particle they shift a solvent\'s freezing and boiling points identically.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Freezing point DOWN, boiling point UP',
      content:
        'FREEZING-POINT DEPRESSION — solute particles block water molecules from locking into the ice lattice, so the solution must be cooled BELOW 0 °C to freeze (road salt, ice-cream churns, antifreeze). BOILING-POINT ELEVATION — dissolved particles make escape to the gas phase harder, so the solution must be heated ABOVE 100 °C to boil. Solute widens the liquid range at both ends.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Ionic solutes split, so they count extra',
      content:
        'Particle count per formula unit: sugar (C₁₂H₂₂O₁₁) → 1, NaCl → Na⁺ + Cl⁻ = 2, CaCl₂ → Ca²⁺ + 2 Cl⁻ = 3. For equal moles dissolved, CaCl₂ shifts the freezing point most — which is why some road crews switch to it in the deepest cold.',
    },
  ],
  methods: [
    {
      title: 'Solve a dilution with M₁V₁ = M₂V₂',
      when_to_use:
        'A stock solution is diluted, or a target volume and concentration must be made from a stock, and one of M₁, V₁, M₂, V₂ is unknown.',
      steps: [
        'Fill the four slots explicitly. Side 1 = the concentrated stock; side 2 = the finished diluted solution.',
        'Check units: both volumes in the SAME unit (mL with mL is fine), both molarities in mol/L.',
        'Write M₁V₁ = M₂V₂ and substitute the three known values.',
        'Solve for the unknown by dividing.',
        'Sanity check the trade-off: if the concentration fell by a factor of 4, the volume must have grown by a factor of 4.',
      ],
      example: {
        problem: 'How many mL of 12.0 M HCl stock are needed to make 500 mL of 3.0 M HCl?',
        solution: '(12.0)(V₁) = (3.0)(500) = 1500, so V₁ = 1500 ÷ 12.0 = 125 mL of stock, then water up to the 500 mL mark.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Turn a dilution answer into a lab procedure',
      when_to_use:
        'The question asks HOW to make the solution, or a described procedure has to be checked for the added-water error.',
      steps: [
        'Compute V₁, the volume of stock needed, from M₁V₁ = M₂V₂.',
        'Water to add = V₂ − V₁ — but never measure it separately; fill to the V₂ mark on the volumetric flask.',
        'If the procedure poured V₂ of water ONTO V₁ of stock, the true final volume is V₁ + V₂; rerun the formula forward with that volume to find the actual (weaker) concentration.',
        'Safety: when diluting a concentrated acid, add the ACID to the WATER — dilution releases heat and the larger water volume absorbs it.',
      ],
      relatedLoIds: [LO],
    },
    {
      title: 'Rank solutions by freezing- or boiling-point shift',
      when_to_use:
        'Several solutes at equal moles in equal solvent are compared for lowest freezing point or highest boiling point.',
      steps: [
        'Ignore molecule size, mass, and chemical identity — only the particle COUNT matters.',
        'Count what each formula unit becomes in water: a molecular solute stays 1; an ionic solute splits into its ions (NaCl → 2, CaCl₂ → 3).',
        'Multiply moles dissolved by that count to get total dissolved particles.',
        'More particles → LOWER freezing point and HIGHER boiling point. Equal particles → equal effect regardless of the solute.',
      ],
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'V₂ is the FINAL TOTAL volume you fill up to, not the volume of water you pour in. Adding V₂ of water to V₁ of stock overshoots the volume and leaves the solution too weak.',
      kind: 'common-error',
    },
    {
      content:
        'In M₁V₁ = M₂V₂ the volume units only have to MATCH across the equal sign — mL with mL is fine. Mixing mL on one side with L on the other is a factor-of-1000 error.',
      kind: 'gotcha',
    },
    {
      content:
        'Boiling-point ELEVATION does not mean "boils sooner". Salt water must reach a HIGHER temperature to boil, so on the same burner the pot takes slightly LONGER.',
      kind: 'common-error',
    },
    {
      content:
        'Salt water does not freeze faster. Both colligative effects push AWAY from pure water\'s range: freezing point down, boiling point up.',
      kind: 'gotcha',
    },
    {
      content:
        'Lab safety: always add the acid to the water — "do as you oughta, add the acid to the water." Dilution releases heat, and water poured onto concentrated acid can boil and splatter.',
      kind: 'tip',
    },
  ],
};
