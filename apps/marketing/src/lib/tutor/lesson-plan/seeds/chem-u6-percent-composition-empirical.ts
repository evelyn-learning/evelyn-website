/**
 * Chemistry — The Mole & Stoichiometry: Percent Composition & Empirical Formulas.
 *
 * From a lab's mass percentages back to a formula (NGSS HS-PS1-7): the
 * assume-100-g / divide-by-atomic-mass / divide-by-smallest recipe, plus
 * the two classic wrecks — treating percents as subscripts, and rounding
 * a 2.5 ratio instead of multiplying through. Numbers are chosen so every
 * ratio lands cleanly.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U6_PERCENT_COMPOSITION_EMPIRICAL: LessonPlan = {
  id: 'evelyn.hs.chem.percent-composition-empirical.v1',
  title: 'Percent Composition & Empirical Formulas',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.percent-composition-empirical',
      standard: 'CHEM-6.3',
      description:
        'Calculate the percent composition of a compound from its formula and determine empirical and molecular formulas from mass-percent data using mole ratios (NGSS HS-PS1-7).',
    },
  ],
  prerequisites: ['chem.mole-conversions'],
  followUps: ['chem.mass-mass-stoichiometry'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Percent composition as the forensic chemist\'s fingerprint — turning a bag of unknown white powder into a formula.',
      script:
        'A crime lab receives an unlabeled white powder. No one can tell by looking whether it is sugar, a painkiller, or something dangerous. So the analyst burns a weighed sample and measures what comes off: 40.0% of the mass was carbon, 6.7% hydrogen, 53.3% oxygen. From those three numbers alone the analyst can name the atom ratio inside that powder. That reverse trip — from masses in a lab back to a formula on paper — is today\'s skill, and it is exactly how every new compound on Earth first got its formula.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-percent-to-formula',
      kind: 'concept',
      goal: 'Percent composition forward from a formula, and the four-step reverse trip back to an empirical formula — including why percents are never subscripts.',
      keyIdeas: [
        'PERCENT COMPOSITION = MASS FRACTION × 100 — for each element: (mass of that element in one mole of the compound ÷ molar mass of the compound) × 100. In H₂O the hydrogen mass is 2(1.0) = 2.0 out of 18.0, so H is 11.1% and O is 88.9%. The percents must add to 100.',
        'SUBSCRIPTS BUILD THE MOLAR MASS — multiply each atomic mass by its subscript, then add: CO₂ = 12.0 + 2(16.0) = 44.0 g/mol. Miss a subscript and every percent that follows is wrong.',
        'EMPIRICAL VS MOLECULAR — the empirical formula is the SMALLEST whole-number atom ratio; the molecular formula is the actual atom count in one molecule. Glucose is molecular C₆H₁₂O₆ but empirical CH₂O. Percent data alone can only ever give you the empirical formula.',
        'THE FOUR-STEP REVERSE TRIP — (1) assume exactly 100 g of sample, so each percent becomes grams; (2) divide each mass by that element\'s atomic mass to get moles; (3) divide every mole value by the SMALLEST of them; (4) multiply through if needed to clear a fraction. The result is the empirical formula.',
        'THE TRAP: PERCENTS ARE NOT SUBSCRIPTS — 50.0% sulfur and 50.0% oxygen does NOT mean SO. Equal MASSES are not equal COUNTS, because a sulfur atom weighs twice an oxygen atom. Step 2 (divide by atomic mass) is the whole point of the recipe.',
        'THE MULTIPLY-THROUGH RESCUE — after dividing by the smallest, a ratio ending in .5 gets multiplied by 2, one ending in .33 or .67 by 3, one ending in .25 by 4. Rounding 2.5 up to 3 is the single most common way this problem is lost; values within about 0.1 of a whole number (1.98, 3.02) may be rounded, nothing else.',
        'MOLECULAR FORMULA NEEDS ONE MORE FACT — the compound\'s molar mass. Compute n = (molar mass) ÷ (empirical formula mass), then multiply EVERY subscript by n. If n = 2, CH₂O becomes C₂H₄O₂.',
        'SAME PERCENTS ≠ SAME COMPOUND — every compound sharing an empirical formula shares its percent composition, so percent data narrows the field but never finishes the job by itself.',
      ],
      vocabulary: [
        { term: 'percent composition', definition: 'the percentage of a compound\'s total mass contributed by each element.' },
        { term: 'empirical formula', definition: 'the formula showing the smallest whole-number ratio of atoms in a compound.' },
        { term: 'molecular formula', definition: 'the formula giving the actual number of each atom in one molecule of the compound.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-percent-to-empirical',
      kind: 'worked_example',
      problem:
        'The crime-lab powder is 40.0% carbon, 6.7% hydrogen, and 53.3% oxygen by mass. Find its empirical formula. Atomic masses: C = 12.0, H = 1.0, O = 16.0.',
      steps: [
        'Step 1 — assume 100 g of sample. The percents become masses directly: 40.0 g C, 6.7 g H, 53.3 g O.',
        'Step 2 — convert each mass to moles by dividing by its atomic mass: C = 40.0 ÷ 12.0 = 3.33 mol; H = 6.7 ÷ 1.0 = 6.7 mol; O = 53.3 ÷ 16.0 = 3.33 mol.',
        'Step 3 — divide every value by the smallest (3.33): C = 3.33 ÷ 3.33 = 1.00; H = 6.7 ÷ 3.33 = 2.01; O = 3.33 ÷ 3.33 = 1.00.',
        'Step 4 — the ratio 1 : 2.01 : 1 is already whole within rounding, so no multiply-through is needed. Empirical formula: CH₂O.',
        'Note what this does NOT say: CH₂O, C₂H₄O₂, and C₆H₁₂O₆ all give these same percents. To pick the real molecule the analyst still needs the compound\'s molar mass.',
      ],
      answer: 'CH₂O (the empirical formula — molar mass is still needed to identify the molecule)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-half-ratio-trap',
      kind: 'worked_example',
      problem:
        'A phosphorus oxide is 43.7% phosphorus and 56.3% oxygen by mass. A student reaches a ratio of 1 : 2.5 and writes PO₃. Find the error and give the correct empirical formula. Atomic masses: P = 31.0, O = 16.0.',
      steps: [
        'Run the recipe honestly. In 100 g: 43.7 g P and 56.3 g O. Moles: P = 43.7 ÷ 31.0 = 1.41 mol; O = 56.3 ÷ 16.0 = 3.52 mol.',
        'Divide by the smallest (1.41): P = 1.41 ÷ 1.41 = 1.00; O = 3.52 ÷ 1.41 = 2.50. So far the student agrees — the ratio really is 1 : 2.5.',
        'Name the error: 2.50 was ROUNDED up to 3. Rounding is only legal when a value is already within about 0.1 of a whole number; 2.50 sits exactly halfway and is a signal, not noise.',
        'Apply the multiply-through rescue: a .5 ending means multiply EVERY value by 2. P: 1.00 × 2 = 2; O: 2.50 × 2 = 5. Empirical formula P₂O₅.',
        'Check it forward: P₂O₅ has molar mass 2(31.0) + 5(16.0) = 142.0, so P is 62.0 ÷ 142.0 = 43.7% and O is 80.0 ÷ 142.0 = 56.3%. Matches the data. The student\'s PO₃ would have been 31.0 ÷ 79.0 = 39.2% P — not the sample at all.',
      ],
      answer: 'P₂O₅ — a 2.5 ratio must be doubled, never rounded',
      estimatedMinutes: 3,
    },
    {
      id: 'try-molecular-from-empirical',
      kind: 'try_yourself',
      problem:
        'A compound has the empirical formula CH₂O, whose empirical formula mass is 30.0 g/mol. An experiment gives the compound a molar mass of 60.0 g/mol. What is its molecular formula?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'C₂H₄O₂', correct: true },
        { id: 'b', text: 'CH₂O — the empirical formula is already the molecular formula' },
        { id: 'c', text: 'C₂H₂O₂' },
        { id: 'd', text: 'C₄H₈O₄' },
      ],
      expectedAnswer: 'C₂H₄O₂',
      hints: [
        'First find n = (molar mass of the compound) ÷ (empirical formula mass).',
        'n = 60.0 ÷ 30.0 = 2, and n multiplies EVERY subscript — including the hidden 1 on carbon and oxygen.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-equal-percent-trap',
      kind: 'try_yourself',
      problem:
        'A sulfur oxide is 50.0% sulfur and 50.0% oxygen by mass. What is its empirical formula? Atomic masses: S = 32.0, O = 16.0.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'SO₂', correct: true },
        { id: 'b', text: 'SO — the percentages are equal, so the atoms are equal' },
        { id: 'c', text: 'S₂O' },
        { id: 'd', text: 'SO₃' },
      ],
      expectedAnswer: 'SO₂',
      hints: [
        'Assume 100 g: 50.0 g of S and 50.0 g of O. Equal masses, but do they contain equal numbers of atoms?',
        'Moles of S = 50.0 ÷ 32.0 = 1.56; moles of O = 50.0 ÷ 16.0 = 3.13. Now divide both by the smaller one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Methane has the formula CH₄. Using C = 12.0 and H = 1.0, what is the percent by mass of carbon in methane? Type your answer as a plain number, without a percent sign.',
      responseFormat: 'numeric',
      expectedAnswer: '75',
      hints: [
        'Build the molar mass first: CH₄ = 12.0 + 4(1.0). Remember the subscript 4 applies to hydrogen only.',
        'Molar mass = 16.0, and the carbon in it weighs 12.0. Compute (12.0 ÷ 16.0) × 100.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-same-percents',
      kind: 'misconception_check',
      question:
        'A student says: "Two samples with identical percent composition have to be the same compound — the percentages are a fingerprint." Ethene (C₂H₄) and propene (C₃H₆) are both 85.7% carbon and 14.3% hydrogen, yet they are different substances. What is wrong with the student\'s reasoning?',
      commonErrors: [
        {
          answer: 'Identical percent composition means identical compound',
          misconception: 'Treating percent composition as a unique identifier, when it only fixes the RATIO of atoms and not their actual number.',
          correctsTo:
            'Percent composition determines the empirical formula only. C₂H₄ and C₃H₆ both reduce to the empirical formula CH₂, so both are 85.7% C by mass — as would C₄H₈. To move from the ratio to the real molecule you need one more measurement, the molar mass, and then n = (molar mass) ÷ (empirical formula mass).',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Percent composition = (mass of the element in one mole ÷ molar mass of the compound) × 100, and the percents must total 100.',
        'Reverse trip in four steps: assume 100 g → divide each mass by its atomic mass → divide all results by the smallest → multiply through to clear any fraction.',
        'Percents are never subscripts: equal masses are not equal atom counts, which is why 50.0% S with 50.0% O is SO₂, not SO.',
        'A ratio ending in .5 gets doubled, .33 or .67 tripled, .25 quadrupled — round only values already within about 0.1 of a whole number.',
        'Percent data gives the EMPIRICAL formula; the molecular formula needs the molar mass, then n = (molar mass ÷ empirical formula mass) multiplies every subscript.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Percent Composition & Empirical Formulas' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
