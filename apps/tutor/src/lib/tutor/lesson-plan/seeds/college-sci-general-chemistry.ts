/**
 * College Intro — General Chemistry (Gen Chem I overview).
 *
 * Atomic theory, stoichiometry, thermochemistry, kinetics, equilibrium.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_GENERAL_CHEMISTRY: LessonPlan = {
  id: 'evelyn.college.general-chemistry.v1',
  title: 'General chemistry — anchors of Gen Chem I',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'general-chemistry',
  locale: 'en',
  los: [
    {
      id: 'college.genchem',
      description: 'Connect atomic structure → bonding → stoichiometry → thermochemistry → kinetics → equilibrium.',
      standard: 'COLLEGE-CHEM-1',
    },
  ],
  prerequisites: ['hschem.anchors'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Gen Chem as building from atoms upward to predicting reactions.',
      script: 'High school chemistry teaches the vocabulary. College Gen Chem teaches how to PREDICT: given reactants, what products, in what ratios, releasing how much energy, how fast, and reaching what equilibrium. Same atoms, deeper questions.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-genchem',
      kind: 'concept',
      goal: 'Five anchors of Gen Chem I.',
      keyIdeas: [
        'STOICHIOMETRY: balanced equations + mole ratios + limiting reactant. The "how much" toolkit.',
        'THERMOCHEMISTRY: ΔH (enthalpy change) for reactions. Hess\'s law: ΔH adds along reaction paths. Bond energies + heats of formation.',
        'EQUILIBRIUM: reactions reach a balance, not completion. K = [products]^c / [reactants]^a. Le Chatelier: stress shifts equilibrium to relieve it.',
        'KINETICS: rate = k[A]^m[B]^n. Activation energy + Arrhenius. Catalysts lower Eₐ without changing thermodynamics.',
        'ACID-BASE: Brønsted (H⁺ donors/acceptors). pH = -log[H⁺]. Buffers resist pH change.',
        'GAS LAWS: PV = nRT (ideal gas). Real gases deviate at high P + low T. Kinetic theory connects pressure to molecular motion.',
        'AQUEOUS REACTIONS: solubility rules, precipitation, oxidation-reduction (electron transfer). Half-reactions balance e⁻.',
      ],
      vocabulary: [
        { term: 'limiting reactant', definition: 'the reactant that runs out first; determines max product.' },
        { term: 'enthalpy', definition: 'heat content; ΔH measures heat released or absorbed at constant pressure.' },
        { term: 'equilibrium constant K', definition: 'ratio of product to reactant concentrations at equilibrium, raised to stoichiometric powers.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-limiting',
      kind: 'worked_example',
      problem: '4 mol H₂ + 1 mol O₂ → ? mol H₂O. (Reaction: 2 H₂ + O₂ → 2 H₂O)',
      steps: [
        'Stoichiometric ratio: 2 mol H₂ per 1 mol O₂.',
        'Have: 4 mol H₂, 1 mol O₂.',
        'H₂ needs only 4/2 = 2 mol O₂ to react completely. We have 1 mol — O₂ is LIMITING.',
        '1 mol O₂ produces 1 × (2 H₂O / 1 O₂) = 2 mol H₂O.',
        'Leftover: 4 - 2(1) = 2 mol H₂ unreacted.',
        'Answer: 2 mol H₂O produced; 2 mol H₂ left over.',
      ],
      answer: '2 mol H₂O; O₂ is the limiting reactant.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A reaction at equilibrium: N₂ + 3 H₂ ⇌ 2 NH₃. If pressure is increased, which side is favored?',
      expectedAnswer: 'the right (NH₃) — fewer moles of gas, so increased pressure shifts equilibrium toward fewer-mole side',
      responseFormat: 'free',
      hints: [
        'Le Chatelier: stress → shift to relieve.',
        'Count moles of gas on each side. Pressure pushes toward the side with fewer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-equilibrium-static',
      kind: 'misconception_check',
      question: 'A student says: "At equilibrium, the reaction has stopped." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because nothing changes',
          misconception: 'Confusing dynamic equilibrium with reaction termination.',
          correctsTo: 'Equilibrium is DYNAMIC — forward and reverse rates are equal, so net concentrations don\'t change, but molecules ARE constantly reacting in both directions. Tracer experiments using radioactive isotopes prove this. The system looks static from outside, but inside it\'s a busy two-way street.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Stoichiometry: balanced equations + mole ratios + limiting reactant.',
        'ΔH from Hess\'s law or bond/formation enthalpies.',
        'Equilibrium is dynamic. K predicts position; Le Chatelier predicts shift.',
        'Kinetics: rate, k, Eₐ. Catalysts lower Eₐ.',
        'pH = -log[H⁺]; buffers stabilize pH.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'If equilibrium is reached, how can a reaction be "driven to completion" by removing product?',
      hint: 'Removing product disturbs the ratio Q < K, so the system shifts forward to restore K. If you keep removing product (e.g., distilling water out of an esterification), Q never catches up to K, and the reaction proceeds essentially fully. Le Chatelier in action — used industrially for many syntheses.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
