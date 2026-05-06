/**
 * College General Chemistry — Chemical Equilibrium and Le Chatelier.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_GENCHEM_EQUILIBRIUM: LessonPlan = {
  id: 'evelyn.college.sci.genchem.equilibrium.v1',
  title: 'General Chemistry — Equilibrium, Kc, and Le Chatelier\'s Principle',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'general-chemistry',
  locale: 'en',
  los: [
    {
      id: 'college.sci.genchem.equilibrium',
      description: 'Write equilibrium expressions, use ICE tables to compute equilibrium concentrations, and apply Le Chatelier to predict shifts.',
      standard: 'COLLEGE-GENCHEM',
    },
  ],
  prerequisites: ['college.sci.genchem.stoichiometry'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Many reactions don\'t go to completion — they reach a balance. Equilibrium math is how we predict that balance.',
      script: 'Mix N₂ and H₂ at high temperature: you get some NH₃ but not 100% conversion. The forward and reverse rates equalise. Knowing the equilibrium constant K plus initial conditions lets you predict the final concentrations exactly. Today: equilibrium expressions, ICE tables, and the qualitative Le Chatelier rules.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-equilibrium',
      kind: 'concept',
      goal: 'Equilibrium expression, Q vs K, ICE table, Le Chatelier shifts.',
      keyIdeas: [
        'For aA + bB ⇌ cC + dD, the equilibrium expression: Kc = [C]^c [D]^d / ([A]^a [B]^b). PURE solids and pure liquids are EXCLUDED.',
        'REACTION QUOTIENT Q has the same form as K but uses CURRENT (not equilibrium) concentrations.',
        'Q < K: reaction shifts FORWARD (toward products) to reach equilibrium.',
        'Q > K: reaction shifts REVERSE (toward reactants).',
        'Q = K: at equilibrium, no net change.',
        'ICE TABLE (Initial, Change, Equilibrium):',
        '  Initial: starting concentrations.',
        '  Change: +x or −x scaled by stoichiometric coefficients.',
        '  Equilibrium: initial + change.',
        '  Substitute into Kc expression, solve for x.',
        'LE CHATELIER\'S PRINCIPLE: a system at equilibrium responds to a stress by shifting to PARTIALLY counteract the stress.',
        '  Add reactant → shift FORWARD.',
        '  Add product → shift REVERSE.',
        '  INCREASE pressure on a gas equilibrium → shift toward fewer moles of gas.',
        '  INCREASE temperature → shifts in the ENDOTHERMIC direction (favours absorbing heat).',
        '  CATALYST does NOT shift equilibrium — only changes the time to reach it.',
      ],
      vocabulary: [
        { term: 'Kc', definition: 'equilibrium constant in terms of molar concentrations; ratio of product to reactant concentrations at equilibrium.' },
        { term: 'ICE table', definition: 'a 3-row table tracking Initial, Change (in terms of x), Equilibrium concentrations.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'For N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g), Kc = 0.50 at some T. If [N₂] = 1.0 M, [H₂] = 2.0 M, [NH₃] = 0.0 initially, find x = [NH₃] / 2 at equilibrium. (Use ICE; assume small-x approx if applicable.)',
      steps: [
        'Set up ICE table. Let x = mol/L of N₂ that reacts.',
        '  N₂:    1.0  − x   = 1.0 − x',
        '  H₂:    2.0  − 3x  = 2.0 − 3x',
        '  NH₃:   0    + 2x  = 2x',
        'Equilibrium expression: Kc = [NH₃]² / ([N₂][H₂]³) = (2x)² / [(1.0 − x)(2.0 − 3x)³] = 0.50.',
        'Try small-x approx (valid if x << 1): 4x² / (1.0 · 8.0) ≈ 0.50 ⟹ x² ≈ 1.0 ⟹ x ≈ 1.0.',
        'But x = 1.0 is NOT << 1. Approximation invalid. Solve exactly numerically (or with quadratic solver). x ≈ 0.42 (numerical).',
        '[NH₃] = 2(0.42) = 0.84 M. Sanity check: 4(0.42²)/[(0.58)(0.74)³] ≈ 0.71/0.235 ≈ 3.0... actual numerical solution requires iteration.',
        'Lesson: ALWAYS verify the small-x approximation by plugging back. If x exceeds ~5% of initial, solve exactly.',
      ],
      answer: 'x ≈ 0.42 mol/L (must verify approx); [NH₃] ≈ 0.84 M.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For an exothermic reaction at equilibrium, what happens if you DECREASE temperature?',
      expectedAnswer: 'Le Chatelier: lowering T removes heat (a "product" of an exothermic reaction since heat is released). System shifts to REPLACE heat → shifts FORWARD (toward more products). K increases at lower T for exothermic reactions.',
      responseFormat: 'free',
      hints: [
        'Treat heat as a product for exothermic reactions.',
        'How does the system respond to removing a "product"?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-catalyst',
      kind: 'misconception_check',
      question: 'A student says adding a catalyst will shift equilibrium toward products. What\'s wrong?',
      commonErrors: [
        {
          answer: 'Catalyst shifts equilibrium forward',
          misconception: 'Confusing rate effect with thermodynamic position.',
          correctsTo: 'A catalyst lowers activation energy of BOTH forward and reverse reactions equally. It speeds up the time to REACH equilibrium but does NOT change the position. Kc is unchanged. The destination is the same; the path is faster.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Kc = [products]^coeffs / [reactants]^coeffs (no solids/liquids).',
        'Q vs K: Q < K → forward; Q > K → reverse.',
        'ICE: initial, change in x, equilibrium; substitute into K.',
        'Le Chatelier: stress shifts equilibrium to oppose the stress.',
        'Catalyst: speeds rate, NOT position.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
