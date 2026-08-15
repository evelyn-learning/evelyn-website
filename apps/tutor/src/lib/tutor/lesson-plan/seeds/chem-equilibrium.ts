/**
 * HS Chemistry — Chemical Equilibrium.
 * NGSS HS-PS1-6: Le Chatelier's principle.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_EQUILIBRIUM: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.equilibrium.v1',
  title: 'Chemical Equilibrium',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-6', description: 'Refine the design of a chemical system by specifying a change in conditions that would produce increased amounts of products at equilibrium.', standard: 'NGSS.HS-PS1-6' }],
  prerequisites: ['hs.chem.kinetics'], followUps: ['hs.chem.redox'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Reactions can go backward.', script: 'Most reactions don\'t go to completion — they reach a BALANCE between forward and reverse. The Haber process turns N₂ + H₂ into ammonia (NH₃) — but the reverse happens too. Understanding equilibrium let us feed billions by manufacturing fertilizer.', estimatedMinutes: 2 },
    { id: 'concept-equilibrium', kind: 'concept', goal: 'Equilibrium: forward and reverse rates equal; concentrations stop changing.', keyIdeas: [
      'REVERSIBLE REACTIONS: A + B ⇌ C + D. Both directions happen.',
      'EQUILIBRIUM: forward RATE = reverse RATE. Concentrations stay constant (but reactions still happen!).',
      'NOT 50/50 — usually favors one side or the other.',
      'EQUILIBRIUM CONSTANT (K):',
      '  · K = [products] / [reactants] (raised to coefficients).',
      '  · K >> 1: products favored.',
      '  · K << 1: reactants favored.',
      'K is constant at a given temperature. Changing T changes K.',
      'EQUILIBRIUM is DYNAMIC — both reactions still happening, just balanced.',
    ], vocabulary: [{ term: 'equilibrium', definition: 'state where forward rate = reverse rate.' }, { term: 'reversible reaction', definition: 'reaction that goes both ways.' }, { term: 'equilibrium constant', definition: 'K = product/reactant ratio at equilibrium.' }], suggestedTools: ['show_equation'], estimatedMinutes: 4 },
    { id: 'concept-le-chatelier', kind: 'concept', goal: 'Le Chatelier: a system at equilibrium shifts to oppose any disturbance.', keyIdeas: [
      'LE CHATELIER\'S PRINCIPLE: if you stress an equilibrium, it shifts to reduce that stress.',
      'STRESSES:',
      '1. ADD reactant → shift toward products.',
      '2. ADD product → shift toward reactants.',
      '3. REMOVE product → shift toward products.',
      '4. INCREASE pressure (gases) → shift toward FEWER moles of gas.',
      '5. INCREASE temperature → shift in ENDOTHERMIC direction.',
      'Used industrially to maximize product yield.',
      'EXAMPLE: Haber process N₂ + 3 H₂ ⇌ 2 NH₃ (exothermic).',
      '  · Higher pressure → shift right (4 mol gas → 2 mol gas).',
      '  · Lower temp → shift right (heat is a "product").',
      '  · BUT lower temp also slows rate → compromise around 400°C with catalyst.',
    ], estimatedMinutes: 5 },
    { id: 'worked-haber', kind: 'worked_example', problem: 'For N₂ + 3 H₂ ⇌ 2 NH₃ (ΔH = −92 kJ), predict the shift if you (a) add N₂, (b) increase pressure, (c) increase temperature.', steps: [
      '(a) ADD N₂: stress = too much reactant. Shift to consume N₂ → toward PRODUCTS (more NH₃).',
      '(b) INCREASE pressure: side with FEWER gas moles is preferred. Left = 1+3 = 4 mol; right = 2 mol. Shift toward PRODUCTS (right).',
      '(c) INCREASE temperature: shift in endothermic direction. Forward is exothermic (ΔH < 0), so reverse is endothermic. Shift LEFT (toward reactants). Bad for ammonia production.',
      'Industry: high pressure ✓, moderate temperature compromise (need rate too).',
    ], answer: '(a) right (more NH₃), (b) right (fewer gas moles), (c) left (toward reactants). Le Chatelier predicts each shift.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'CO₂(aq) + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ in your blood. When you exhale CO₂, what happens to your blood pH?', expectedAnswer: 'Removing CO₂ shifts the equilibrium LEFT (toward CO₂). That means less H₂CO₃ → less H⁺ → blood pH RISES (becomes more basic). Hyperventilating (exhaling too much CO₂) → blood pH rises → tingling, dizziness. Breathing into a bag re-inhales CO₂ → restores balance.', responseFormat: 'free', hints: ['Le Chatelier: removing X shifts to make more X.', 'What does that do to H⁺?'], estimatedMinutes: 3 },
    { id: 'misconception-equilibrium-stop', kind: 'misconception_check', question: 'A friend says "at equilibrium, the reaction has STOPPED." Right?', commonErrors: [{ answer: 'Yes — stopped.', misconception: 'Treating equilibrium as static.', correctsTo: 'Equilibrium is DYNAMIC, not static. Forward and reverse reactions both still happen — just at the SAME RATE, so net concentrations stay constant. Like an escalator going up while you walk down at the same speed: you don\'t move, but lots is happening.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Equilibrium: forward rate = reverse rate. Concentrations constant.', 'K = [products]/[reactants]. K>>1 favors products.', 'Le Chatelier: stress → shift to oppose.', 'Equilibrium is dynamic, not static.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
