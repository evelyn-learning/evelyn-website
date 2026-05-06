/**
 * MCAT — Chemical and Physical Foundations of Biological Systems.
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_CHEM_PHYS_DOMAINS: LessonPlan = {
  id: 'evelyn.testprep.mcat.chem-phys.domains.v1',
  title: 'MCAT Chem/Phys — Section Overview and High-Yield Domains',
  curriculum: 'MCAT',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'mcat-chem-phys',
  locale: 'en',
  los: [
    {
      id: 'testprep.mcat.chem-phys.domains',
      description: 'Map the MCAT Chemical and Physical Foundations section: content distribution, passage structure, time management, and high-yield topic clusters.',
      standard: 'MCAT-CP',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Chem/Phys is 30% gen chem, 25% gen physics, 25% biochem, 15% organic chem, 5% other — tightly integrated with biology.',
      script: 'The MCAT Chem/Phys section tests physics and chemistry IN CONTEXT — typically through experimental passages where you read about a study, then answer questions integrating multiple concepts. Today: the section\'s content distribution, the passage shape, and the topics that show up most.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mcat-cp',
      kind: 'concept',
      goal: 'Section format, content categories, passage strategy, top topics.',
      keyIdeas: [
        'FORMAT: 59 questions, 95 minutes. Score range 118-132 (combined with three other sections for total 472-528).',
        'PASSAGE-BASED: ~10 passages with 4-7 questions each + ~15 standalone questions. Passages describe an experiment, technique, or scenario; questions test integration.',
        'CONTENT (per AAMC):',
        '  GEN CHEMISTRY (~30%): bonding, equilibria, acids/bases, thermodynamics, kinetics, redox, solutions, gas laws.',
        '  GEN PHYSICS (~25%): mechanics (kinematics, forces, energy), fluids, waves, sound, optics, electricity/magnetism, modern physics.',
        '  BIOCHEMISTRY (~25%): enzyme kinetics, lipids, proteins, carbohydrates, nucleic acids, metabolism — overlaps with Bio/Biochem section.',
        '  ORGANIC CHEMISTRY (~15%): functional groups, reaction mechanisms, separation techniques, spectroscopy basics.',
        '  RESEARCH METHODS / STATISTICS (~5%).',
        'HIGH-YIELD TOPICS (most-tested):',
        '  Acid-base chemistry: pH, pKa, buffers, Henderson-Hasselbalch.',
        '  Thermodynamics: ΔG, ΔH, ΔS, spontaneity.',
        '  Kinematics + Newton\'s laws + energy.',
        '  Fluid dynamics: Bernoulli, continuity (cardiovascular applications).',
        '  Optics + sound: relevant to medicine (vision, hearing, ultrasound).',
        '  Spectroscopy: IR, NMR, UV-vis basics.',
        '  Enzyme kinetics: Michaelis-Menten, inhibition.',
        'PASSAGE STRATEGY: read the experimental setup carefully. Understand what was measured. Many questions can be answered just from reading the passage; others require outside knowledge of underlying concepts.',
        'TIME: 95 min / 59 q ≈ 1.6 min/question. But passages need extra setup time. Plan ~9 min/passage on average.',
      ],
      vocabulary: [
        { term: 'high-yield topic', definition: 'a content area that appears frequently on the MCAT and rewards focused study time.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A passage describes a buffer at pH 7.4 made from H₂PO₄⁻ / HPO₄²⁻ (pKa = 7.2). The question asks: "What is the ratio [HPO₄²⁻] / [H₂PO₄⁻]?"',
      steps: [
        'Use Henderson-Hasselbalch: pH = pKa + log([base]/[acid]).',
        'Conjugate base = HPO₄²⁻ (deprotonated). Acid = H₂PO₄⁻.',
        '7.4 = 7.2 + log([HPO₄²⁻]/[H₂PO₄⁻]).',
        '0.2 = log([base]/[acid]).',
        '[base]/[acid] = 10^0.2 ≈ 1.58.',
        'Answer: ratio ≈ 1.58 (more base than acid, since pH > pKa).',
      ],
      answer: '≈ 1.58 (or about 1.6:1)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does the MCAT emphasise fluid dynamics (Bernoulli, continuity) more than other intro physics topics?',
      expectedAnswer: 'Cardiovascular relevance. Continuity equation (A₁v₁ = A₂v₂) explains why blood speeds up in narrowed vessels. Bernoulli\'s principle explains pressure-velocity tradeoffs in arterial stenosis. Poiseuille\'s law (resistance, viscosity, radius) explains how vessel narrowing dramatically increases resistance. Fluid dynamics is the most directly medical of intro physics topics — hence high MCAT yield.',
      responseFormat: 'free',
      hints: [
        'What body system has flowing fluid?',
        'Why would arterial narrowing matter for blood velocity and pressure?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-physics-priority',
      kind: 'misconception_check',
      question: 'A student studies all of intro physics equally for the MCAT. Why is this an inefficient strategy?',
      commonErrors: [
        {
          answer: 'Study physics topics equally',
          misconception: 'Treating MCAT physics as a comprehensive physics test.',
          correctsTo: 'MCAT physics is biased toward MEDICALLY RELEVANT topics: fluid dynamics (cardiovascular), optics (vision), sound/acoustics (hearing, ultrasound), electricity (nerve impulses, EKG). Topics like rotational dynamics or static equilibrium of complex structures get little testing. Allocate study time proportionally — fluids and waves > rotational mechanics.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '95 min / 59 questions; passage-heavy.',
        'Content: 30% gen chem, 25% physics, 25% biochem, 15% orgo.',
        'High-yield: pH/buffers, thermo, fluid dynamics, kinetics.',
        'Read passages carefully — many answers are in the setup.',
        'Bias study time toward medically-relevant physics.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
