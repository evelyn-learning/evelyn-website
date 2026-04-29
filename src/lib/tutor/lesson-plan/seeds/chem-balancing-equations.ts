/**
 * HS Chemistry — Balancing Chemical Equations.
 * NGSS HS-PS1-7: conservation of atoms in reactions.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_BALANCING_EQUATIONS: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.balancing-equations.v1',
  title: 'Balancing Chemical Equations',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-7', description: 'Use mathematical representations to support the claim that atoms, and therefore mass, are conserved during a chemical reaction.', standard: 'NGSS.HS-PS1-7' }],
  prerequisites: ['hs.chem.mole-stoichiometry'], followUps: ['hs.chem.reactions-types'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Conservation of mass.', script: 'In 1789, Lavoisier proved: matter is neither created nor destroyed in chemical reactions. Just rearranged. So if 10 atoms go in, 10 atoms come out — same elements, same counts. That\'s why we balance equations: to honor the universe\'s bookkeeping rule.', estimatedMinutes: 2 },
    { id: 'concept-balancing', kind: 'concept', goal: 'Balance by adjusting coefficients (not subscripts) until atom counts match.', keyIdeas: [
      'WHY: matter is conserved. Atoms IN = atoms OUT.',
      'COEFFICIENTS: numbers in front of compounds. ADJUST these.',
      'SUBSCRIPTS: numbers within formulas. NEVER change — that would change the substance.',
      'METHOD:',
      '  1. Write unbalanced equation.',
      '  2. Count each element on both sides.',
      '  3. Balance one element at a time. Save H and O for last.',
      '  4. If you change a coefficient, recount.',
      '  5. Check: every element balanced? Coefficients in lowest whole-number ratio?',
      'TIP: Polyatomic ions that appear unchanged on both sides can be balanced as a unit.',
    ], vocabulary: [{ term: 'coefficient', definition: 'number in front of a compound formula.' }, { term: 'subscript', definition: 'small number inside a formula.' }], estimatedMinutes: 4 },
    { id: 'concept-tips', kind: 'concept', goal: 'Strategies for tricky equations: fractions, polyatomics, half-step.', keyIdeas: [
      'TRICK: For odd/even O₂ problems, balance O LAST. If you get a fraction (like 5/2 O₂), MULTIPLY everything by 2.',
      'POLYATOMICS: keep them as a group if they don\'t change.',
      '  · Ca(OH)₂ + 2 HCl → CaCl₂ + 2 H₂O. Treat (OH) as one if balancing for OH groups.',
      'COMBUSTION pattern (CₓHᵧ + O₂ → CO₂ + H₂O):',
      '  1. Balance C first (= x CO₂).',
      '  2. Balance H (= y/2 H₂O).',
      '  3. Balance O last.',
      '  4. Multiply through to clear fractions.',
    ], estimatedMinutes: 3 },
    { id: 'worked-combustion', kind: 'worked_example', problem: 'Balance: C₃H₈ + O₂ → CO₂ + H₂O (propane combustion).', steps: [
      'STEP 1: Carbon. 3 C on left → coefficient 3 for CO₂.',
      '  · C₃H₈ + O₂ → 3 CO₂ + H₂O.',
      'STEP 2: Hydrogen. 8 H on left → coefficient 4 for H₂O (4 × 2 = 8).',
      '  · C₃H₈ + O₂ → 3 CO₂ + 4 H₂O.',
      'STEP 3: Oxygen. Right side: 3(2) + 4(1) = 10 O. Need 10 O on left → coefficient 5 for O₂.',
      '  · C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O.',
      'CHECK: C: 3=3 ✓. H: 8=8 ✓. O: 10=10 ✓. Done.',
    ], answer: 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. Carbon first, hydrogen second, oxygen last.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Balance: Fe + O₂ → Fe₂O₃ (iron rusting).', expectedAnswer: '4 Fe + 3 O₂ → 2 Fe₂O₃. Steps: Fe₂O₃ has 2 Fe, so use 2 Fe₂O₃ (4 Fe). Then balance Fe: need 4 Fe on left. O: 2 Fe₂O₃ has 6 O → need 3 O₂. Final: 4 Fe + 3 O₂ → 2 Fe₂O₃.', responseFormat: 'free', hints: ['Start with Fe (need to balance both sides).', 'Save O for last.'], estimatedMinutes: 3 },
    { id: 'misconception-change-subscripts', kind: 'misconception_check', question: 'A friend balances H₂ + O₂ → H₂O by changing it to H₂ + O₂ → H₂O₂. Why is that wrong?', commonErrors: [{ answer: 'Looks balanced.', misconception: 'Changing subscripts to balance.', correctsTo: 'You changed water (H₂O) into HYDROGEN PEROXIDE (H₂O₂) — a different substance! NEVER change subscripts. Use coefficients only. Correct balance: 2 H₂ + O₂ → 2 H₂O.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Balance by adjusting COEFFICIENTS only. Never subscripts.', 'Carbon → Hydrogen → Oxygen order works for combustion.', 'If fractions appear, multiply through.', 'Check atom counts on both sides at the end.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
