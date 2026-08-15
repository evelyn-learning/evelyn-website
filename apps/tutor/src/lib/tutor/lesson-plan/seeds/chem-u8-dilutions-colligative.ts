/**
 * Chemistry — Solutions: Dilutions & Colligative Properties.
 *
 * Moles-of-solute conservation as the whole story behind M₁V₁ = M₂V₂
 * (NGSS HS-PS1-3), plus the qualitative side of dissolving: freezing-point
 * depression and boiling-point elevation, and why the number of dissolved
 * PARTICLES — not their identity — sets the size of the effect. Dilution
 * numbers are chosen so every answer lands on a clean value; colligative
 * properties stay conceptual (no molality math).
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U8_DILUTIONS_COLLIGATIVE: LessonPlan = {
  id: 'evelyn.hs.chem.dilutions-colligative.v1',
  title: 'Dilutions & Colligative Properties',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.dilutions-colligative',
      standard: 'CHEM-8.3',
      description:
        'Use M₁V₁ = M₂V₂ to calculate concentrations and volumes for dilutions, and explain freezing-point depression and boiling-point elevation in terms of the number of dissolved solute particles (NGSS HS-PS1-3).',
    },
  ],
  prerequisites: ['chem.molarity'],
  followUps: ['chem.endothermic-exothermic'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Dissolved particles change what a liquid DOES — the same two ideas run a hospital IV bag and a snowplow spreading salt.',
      script:
        'Nobody stocks a hospital pharmacy with a hundred different strengths of the same drug. They stock one concentrated stock bottle and dilute it — a nurse pulls a few milliliters, adds sterile saline to a marked volume, and the dose is exact. Meanwhile, outside in a January storm, a truck spreads salt on the road and liquid water survives at −10 °C, a temperature at which pure water is solid ice. Two very different scenes, two ideas from today: diluting changes the concentration but never the amount of solute, and dissolved particles change the temperatures at which a liquid freezes and boils. Both of them are things you can calculate or predict before you ever touch the flask.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-dilution-colligative',
      kind: 'concept',
      goal: 'Moles conserved → M₁V₁ = M₂V₂, and particle COUNT → freezing-point depression and boiling-point elevation.',
      keyIdeas: [
        'DILUTION ADDS SOLVENT, NEVER SOLUTE — when you add water to a solution, the moles of solute you started with are exactly the moles you end with. They are just spread through more liters, so the concentration drops. Nothing is created, nothing is destroyed, nothing reacts.',
        'THE FORMULA IS THAT SENTENCE IN SYMBOLS — moles before = moles after, and moles = molarity × volume, so M₁V₁ = M₂V₂. The 1 subscripts are the concentrated stock; the 2 subscripts are the final diluted solution.',
        'UNITS ONLY HAVE TO MATCH, NOT CONVERT — volume appears on both sides, so mL with mL and L with L both work. Molarity must be in mol/L on both sides. Mixing mL on one side with L on the other is a silent factor-of-1000 error.',
        'V₂ IS THE FINAL TOTAL VOLUME — the classic wreck. "Dilute to 300 mL" means the finished solution measures 300 mL in the flask, NOT that you poured in 300 mL of water. If you start with 50 mL of stock, you add water until the mark, which is only 250 mL of water.',
        'LAB SAFETY: ACID INTO WATER — diluting a concentrated acid releases a lot of heat. Add the ACID to the WATER, so the large volume of water absorbs the heat; pouring water onto concentrated acid can boil and splatter it. "Do as you oughta — add the acid to the water."',
        'COLLIGATIVE PROPERTIES COUNT PARTICLES, NOT IDENTITY — some properties of a solution depend only on HOW MANY solute particles are dissolved, not on what they are. Sugar and salt are chemically nothing alike, yet per dissolved particle they shift a solvent\'s freezing and boiling points the same way.',
        'FREEZING-POINT DEPRESSION — solute particles get in the way of water molecules trying to lock into an ice crystal, so the solution must be cooled BELOW 0 °C before it can freeze. That is why road salt melts ice, why ice cream is churned in a salt-and-ice bath, and why antifreeze protects an engine in winter.',
        'BOILING-POINT ELEVATION — dissolved particles also make escaping to the gas phase harder, so a solution must be heated ABOVE 100 °C before it boils. Salted pasta water boils at a slightly HIGHER temperature — which means it takes slightly LONGER to reach a boil, not shorter.',
        'IONIC SOLUTES SPLIT, SO THEY COUNT EXTRA — one formula unit of sugar dissolves as 1 particle; NaCl separates into Na⁺ and Cl⁻, which is 2 particles; CaCl₂ separates into Ca²⁺ plus two Cl⁻, which is 3. Equal amounts dissolved, CaCl₂ shifts the freezing point the most — which is why some road crews use it in the deepest cold.',
      ],
      vocabulary: [
        { term: 'dilution', definition: 'adding solvent to a solution to lower its concentration while keeping the moles of solute unchanged.' },
        { term: 'stock solution', definition: 'a concentrated solution kept on hand and diluted to make the working concentrations actually used.' },
        { term: 'colligative property', definition: 'a property of a solution that depends on the number of dissolved solute particles, not on their chemical identity.' },
        { term: 'freezing-point depression', definition: 'the lowering of a solvent\'s freezing temperature caused by dissolved solute particles.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-dilution-basic',
      kind: 'worked_example',
      problem:
        'A lab keeps a 12.0 M stock bottle of hydrochloric acid. How many milliliters of that stock are needed to make 500 mL of 3.0 M HCl?',
      steps: [
        'Identify the four slots. Stock (side 1): M₁ = 12.0 M, V₁ = unknown. Final solution (side 2): M₂ = 3.0 M, V₂ = 500 mL.',
        'Both volumes are in mL, so no conversion is needed — the units simply have to match across the equal sign.',
        'Write moles before = moles after: M₁V₁ = M₂V₂, so (12.0)(V₁) = (3.0)(500) = 1500.',
        'Solve: V₁ = 1500 ÷ 12.0 = 125 mL of stock.',
        'Procedure and check: measure 125 mL of the 12.0 M acid, pour it INTO some water, then add water up to the 500 mL mark. Sanity check — the concentration dropped by a factor of 4 (12.0 → 3.0), and the volume grew by a factor of 4 (125 → 500). ✓',
      ],
      answer: '125 mL of the 12.0 M stock, diluted with water to a final volume of 500 mL',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-final-volume-trap',
      kind: 'worked_example',
      problem:
        'A student needs 200 mL of 1.5 M NaCl from a 6.0 M stock. They correctly find that 50 mL of stock is required, then add 200 mL of water to it. Their solution tests weaker than 1.5 M. Find the error and give the correct procedure.',
      steps: [
        'Check the arithmetic first: (6.0)(V₁) = (1.5)(200) = 300, so V₁ = 300 ÷ 6.0 = 50 mL of stock. That part is right.',
        'Name the error: V₂ is the FINAL TOTAL VOLUME of the solution, not the volume of water added. The student made 50 mL + 200 mL = 250 mL of solution instead of 200 mL.',
        'Confirm the damage with the same formula run forward: (6.0)(50) = M₂(250), so M₂ = 300 ÷ 250 = 1.2 M — noticeably weaker than the 1.5 M ordered.',
        'The correct procedure: put 50 mL of the 6.0 M stock in a 200 mL volumetric flask, then add water only until the total solution reaches the 200 mL mark — which is 150 mL of water, not 200 mL.',
        'The habit that prevents this forever: V₂ is a mark on the glassware you fill UP TO, never an amount you pour IN.',
      ],
      answer: '50 mL of stock diluted TO a 200 mL total volume (add only 150 mL of water); adding 200 mL of water gives 1.2 M instead',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-stays-same',
      kind: 'try_yourself',
      problem: 'You take 100 mL of 2.0 M KCl solution and add water until the total volume is 400 mL. Which statement about the diluted solution is TRUE?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The moles of KCl are unchanged; the molarity drops to 0.50 M', correct: true },
        { id: 'b', text: 'Both the moles of KCl and the molarity drop to one quarter of their original values' },
        { id: 'c', text: 'The moles of KCl increase because there is now more solution' },
        { id: 'd', text: 'The molarity is unchanged because no KCl was added or removed' },
      ],
      expectedAnswer: 'The moles of KCl are unchanged; the molarity drops to 0.50 M',
      hints: [
        'Adding water adds solvent only. Did any KCl enter or leave the flask?',
        'Same moles spread through 4 times the volume — divide the concentration by 4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-colligative-particles',
      kind: 'try_yourself',
      problem:
        'Three solutions are made by dissolving the same number of moles of solute in the same amount of water: sugar (C₁₂H₂₂O₁₁, which stays as whole molecules), NaCl (which separates into Na⁺ and Cl⁻), and CaCl₂ (which separates into Ca²⁺ and two Cl⁻). Which solution has the LOWEST freezing point?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The CaCl₂ solution — it releases 3 particles per formula unit, the most of the three', correct: true },
        { id: 'b', text: 'The sugar solution — sugar molecules are much larger than the ions' },
        { id: 'c', text: 'The NaCl solution — salt is what road crews spread on ice' },
        { id: 'd', text: 'All three are identical because the same number of moles was dissolved' },
      ],
      expectedAnswer: 'The CaCl₂ solution — it releases 3 particles per formula unit, the most of the three',
      hints: [
        'A colligative property counts dissolved PARTICLES, not molecule size and not chemical identity.',
        'Count what each formula unit becomes in water: sugar → 1, NaCl → 2, CaCl₂ → 3. More particles means a bigger drop.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'You measure out 50 mL of 6.0 M NaOH stock and add water until the total volume of the solution is 300 mL. What is the molarity of the diluted solution, in mol/L? Use M₁V₁ = M₂V₂. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '1',
      hints: [
        'Fill the slots: M₁ = 6.0, V₁ = 50 mL, V₂ = 300 mL (the final total volume), M₂ = unknown.',
        '(6.0)(50) = 300, and 300 ÷ 300 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-salt-boils-faster',
      kind: 'misconception_check',
      question:
        'A student salts a pot of water and says: "Salt makes water boil faster, and it also freezes faster because salt water is denser." What is wrong with both halves of that claim?',
      commonErrors: [
        {
          answer: 'Salt makes water boil faster',
          misconception: 'Reading boiling-point ELEVATION as "boils sooner" — confusing the temperature at which boiling happens with the time it takes to get there.',
          correctsTo:
            'Dissolved particles make it harder for water molecules to escape into the gas phase, so salt water must be heated ABOVE 100 °C to boil. A higher target temperature on the same burner means the pot takes slightly LONGER to reach a boil, not shorter.',
        },
        {
          answer: 'Salt water freezes faster than pure water',
          misconception: 'Assuming a dissolved solute helps a solvent change state, when colligative effects push both state changes in the same direction: away from the pure solvent\'s normal range.',
          correctsTo:
            'Solute particles block water molecules from locking into the ice lattice, so the solution must be cooled BELOW 0 °C before it freezes — freezing-point depression. That is exactly why road salt keeps ice from forming: it widens the liquid range at both ends, lowering the freezing point and raising the boiling point.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Dilution adds solvent only — the moles of solute never change, so M₁V₁ = M₂V₂.',
        'V₂ is the FINAL TOTAL volume you fill up to, not the volume of water you pour in.',
        'Units only have to match across the equal sign — mL with mL is fine; mL against L is a factor-of-1000 error.',
        'Colligative properties count dissolved PARTICLES, not their identity: freezing point goes DOWN, boiling point goes UP.',
        'Ionic solutes split into multiple particles (NaCl → 2, CaCl₂ → 3), so they shift those temperatures more than an equal amount of sugar.',
        'Lab safety: always add the acid to the water — dilution releases heat.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Dilutions & Colligative Properties' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
