/**
 * HS Chemistry — Solutions and Concentration.
 * Foundational solution chemistry: solubility, molarity, dilution.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_SOLUTIONS_CONCENTRATION: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.solutions-concentration.v1',
  title: 'Solutions and Concentration',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-5', description: 'Apply scientific principles and evidence to provide an explanation about the effects of changing the temperature or concentration of the reacting particles on the rate at which a reaction occurs.', standard: 'NGSS.HS-PS1-5' }],
  prerequisites: ['hs.chem.mole-stoichiometry'], followUps: ['hs.chem.acids-bases-ph'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in everyday solutions.', script: 'Salt water. Soda. Stainless steel. Air. All SOLUTIONS — one substance dissolved in another. Concentration tells you HOW MUCH. A wrong dose can be a poison; the right dose is a medicine. Concentration matters.', estimatedMinutes: 2 },
    { id: 'concept-solutions', kind: 'concept', goal: 'Solutions: solute dissolved in solvent. Solubility depends on temperature, polarity.', keyIdeas: [
      'SOLUTION = HOMOGENEOUS mixture of solute + solvent.',
      '  · SOLUTE: the smaller-amount substance (salt).',
      '  · SOLVENT: the larger-amount substance (water).',
      '"LIKE DISSOLVES LIKE": polar dissolves polar; nonpolar dissolves nonpolar.',
      '  · Salt (ionic/polar) dissolves in water (polar). ✓',
      '  · Oil (nonpolar) does NOT dissolve in water. ✗',
      'SOLUBILITY: how much solute can dissolve at a given temperature.',
      '  · Most SOLIDS: solubility INCREASES with temperature (sugar in hot tea).',
      '  · GASES: solubility DECREASES with temperature (warm soda goes flat).',
      'SATURATED: max amount dissolved. UNSATURATED: less than max. SUPERSATURATED: more than max (unstable).',
    ], vocabulary: [{ term: 'solute', definition: 'substance dissolved.' }, { term: 'solvent', definition: 'substance doing the dissolving.' }, { term: 'molarity', definition: 'concentration in mol/L.' }], estimatedMinutes: 4 },
    { id: 'concept-molarity', kind: 'concept', goal: 'Molarity (M) = moles of solute per liter of solution. Dilution: M₁V₁ = M₂V₂.', keyIdeas: [
      'MOLARITY (M) = moles of SOLUTE / liters of SOLUTION.',
      '  · 1.0 M NaCl = 1 mole of NaCl in 1 liter of solution.',
      'CALCULATION: M = mol / L.',
      '  · 0.5 mol NaCl in 2.0 L → M = 0.5/2.0 = 0.25 M.',
      'DILUTION: adding solvent decreases concentration.',
      '  · M₁V₁ = M₂V₂ (moles of solute conserved).',
      '  · Take 100 mL of 6 M HCl, add water to 600 mL → (6)(100) = M₂(600) → M₂ = 1 M.',
      'OTHER UNITS: molality (mol/kg solvent), mass percent, ppm.',
    ], suggestedTools: ['show_equation'], estimatedMinutes: 4 },
    { id: 'worked-make-solution', kind: 'worked_example', problem: 'How would you make 250 mL of 0.40 M NaCl solution?', steps: [
      'Find moles needed: M × V = 0.40 mol/L × 0.250 L = 0.10 mol NaCl.',
      'Convert to grams: molar mass NaCl = 22.99 + 35.45 = 58.44 g/mol.',
      '  · 0.10 mol × 58.44 g/mol = 5.84 g NaCl.',
      'PROCEDURE: weigh 5.84 g NaCl, dissolve in some water in a 250 mL volumetric flask, then ADD WATER TO THE 250 mL MARK.',
      'KEY: total VOLUME of solution = 250 mL (not just water added).',
    ], answer: 'Dissolve 5.84 g NaCl in water and dilute to a total volume of 250 mL.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You need to make 500 mL of 1.0 M HCl from a stock solution of 12 M HCl. How much stock do you need?', expectedAnswer: 'Use M₁V₁ = M₂V₂: (12)(V₁) = (1.0)(500), so V₁ = 500/12 ≈ 41.7 mL. Pour 41.7 mL of 12 M HCl into a flask, then add water to total 500 mL. (Always add ACID to WATER, never water to acid — exothermic!)', responseFormat: 'numeric', hints: ['Use M₁V₁ = M₂V₂.', 'V₁ is what you\'re solving for.'], estimatedMinutes: 3 },
    { id: 'misconception-add-acid', kind: 'misconception_check', question: 'A friend dilutes acid by pouring water into the acid. Why is that dangerous?', commonErrors: [{ answer: 'Either way is fine.', misconception: 'Order doesn\'t matter.', correctsTo: 'Acid + water releases HEAT. If you add water to concentrated acid, the small amount of water heats up rapidly → can BOIL and SPLATTER acid into your face. Always add ACID to WATER (the larger volume absorbs the heat safely). Memory aid: "Do as you oughta — add the acid to the water."' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Like dissolves like (polar/polar, nonpolar/nonpolar).', 'Molarity = mol solute / L solution.', 'Dilution: M₁V₁ = M₂V₂.', 'ALWAYS add acid to water.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
