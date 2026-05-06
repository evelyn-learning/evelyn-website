/**
 * IB DP Chemistry — anchor plan covering course shape and the
 * quantitative + qualitative balance examiners reward.
 */

import type { LessonPlan } from '../types';

export const SEED_IB_CHEMISTRY: LessonPlan = {
  id: 'evelyn.ibdp.chemistry.v1',
  title: 'IB Chemistry — course shape, quantitative habits, NoS',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'science',
  topic: 'ib-chemistry',
  locale: 'en',
  los: [
    {
      id: 'ibdp.chemistry.overview',
      description: 'Map IB Chemistry assessment, the calculation discipline (sig figs, units, dimensional analysis) and Nature of Science framing examiners reward.',
      standard: 'IB-DP-CHEM',
    },
  ],
  prerequisites: ['g912.science.chemistry-advanced'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'IB Chemistry rewards specific quantitative discipline and command-term-correct prose answers.',
      script: 'Calculation questions in IB Chem look easy when you read them — the numbers are friendly. The trap is in unit handling, sig figs, and showing the working step. Half the marks usually go to METHOD, not the final number. Today we cover course shape and the quantitative habits that earn those method marks.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ib-chem',
      kind: 'concept',
      goal: 'Assessment shape, calc discipline, key topics, command terms, NoS, IA.',
      keyIdeas: [
        'ASSESSMENT (2025+ syllabus): Paper 1 (multiple choice + data response, no calculator on Paper 1A), Paper 2 (short + extended response, calculator), Internal Assessment (10-hour investigation, 20% grade).',
        'CALCULATION DISCIPLINE earns method marks every time:',
        '  1) Units kept on EVERY line, not added at the end.',
        '  2) Significant figures: answer carries the LOWEST sig fig count of the inputs (typically 3 sf in IB).',
        '  3) Dimensional analysis check: cancel units to make sure the final unit is what you wanted.',
        '  4) Show the equation BEFORE substituting numbers. Examiners give method marks even when arithmetic slips.',
        'CORE TOPICS: stoichiometry & moles, atomic structure & periodicity, bonding (ionic / covalent / metallic / intermolecular), energetics (ΔH, Hess), kinetics (rate laws, Ea, Arrhenius), equilibrium (Kc, Le Chatelier), acids/bases (pH, buffers, titration curves), redox (E°, electrochemistry), organic (mechanisms, isomerism), measurement & analysis.',
        'HL adds: thermodynamics (entropy, Gibbs), more detailed kinetics, more redox, more organic spectra (¹H NMR, MS, IR), more equilibrium maths.',
        'COMMAND TERMS as in IB Bio. STATE one word, DESCRIBE factual account, EXPLAIN mechanism, DEDUCE arrive at an answer using logical steps, DETERMINE find a specific value with calculation/reasoning.',
        'NATURE OF SCIENCE points: history of atomic models (Dalton → Thomson → Rutherford → Bohr → quantum), use of TECHNOLOGY (mass spec, NMR, IR), models vs reality, falsification (Popper), peer review, ethics (chemical weapons, environmental).',
        'IA grading rewards CONTROL of variables, range/repeats, ANALYSIS depth (error propagation), and EVALUATION of systematic vs random error sources.',
      ],
      vocabulary: [
        { term: 'significant figures', definition: 'the digits in a measurement that carry meaning about precision; in IB Chem, the answer matches the lowest sig-fig count of any input quantity.' },
        { term: 'dimensional analysis', definition: 'tracking units through a calculation to verify the final unit is what the problem asked for; an essential error-catching habit.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-stoich',
      kind: 'worked_example',
      problem: 'Calculate the mass of CO₂ produced when 5.00 g of CaCO₃ is fully decomposed: CaCO₃ → CaO + CO₂. M(CaCO₃) = 100.09 g/mol, M(CO₂) = 44.01 g/mol.',
      steps: [
        'Step 1: write the balanced equation. CaCO₃ → CaO + CO₂. 1:1 mole ratio CaCO₃ : CO₂.',
        'Step 2: moles of CaCO₃ = mass / M = 5.00 g ÷ 100.09 g/mol = 0.04996 mol ≈ 0.0500 mol (3 sf).',
        'Step 3: moles of CO₂ produced = 0.0500 mol (1:1 ratio).',
        'Step 4: mass of CO₂ = moles × M = 0.0500 mol × 44.01 g/mol = 2.20 g (3 sf).',
        'Final answer: 2.20 g of CO₂.',
        'Method marks distributed across: balanced equation, moles calculation with units, mole-ratio identification, final mass calculation. Even an arithmetic slip in the last step costs only 1 mark, not the whole question.',
      ],
      answer: '2.20 g CO₂',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does IB Chem deduct marks if a student writes "5 g" as their answer when the inputs were "5.00 g" and "100.09 g/mol"?',
      expectedAnswer: 'Sig figs communicate precision. Inputs were given to 3 sf and 5 sf respectively. The lowest sig-fig input sets the answer\'s sig figs (3 sf). Writing "5 g" claims 1-sig-fig precision — a much weaker claim than what the data justifies. Conversely, writing "5.00000 g" would falsely claim 6-sf precision the data cannot support. Sig fig discipline communicates honestly how precise your answer actually is.',
      responseFormat: 'free',
      hints: [
        'Sig figs are about communicating precision honestly.',
        'What does "5 g" claim about precision compared to "5.00 g"?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-equilibrium-shift',
      kind: 'misconception_check',
      question: 'A student says: "Adding a catalyst shifts the equilibrium toward products." Why is this wrong?',
      commonErrors: [
        {
          answer: 'Catalyst shifts equilibrium toward products',
          misconception: 'Confusing rate effects with thermodynamic equilibrium position.',
          correctsTo: 'A catalyst lowers the activation energy of BOTH the forward and reverse reactions equally. It speeds up how QUICKLY equilibrium is reached, but does NOT change the position of equilibrium (Kc is unchanged). Le Chatelier shifts come from changing concentration, pressure (gas), or temperature — these alter Q vs K. A catalyst changes the path, not the destination. This is one of the most-tested distinctions on IB Chem; getting it right is a free mark every time it comes up.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Always: balanced equation → moles → ratio → answer.',
        'Units on every line; sig figs match lowest input.',
        'Show the equation before substituting — earns method marks.',
        'Catalyst speeds rate; does not shift equilibrium position.',
        'NoS framing (history, technology, models) earns marks across topics.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
