/**
 * GRE Subject Test — Physics.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_SUBJECT_PHYSICS: LessonPlan = {
  id: 'evelyn.gre.subject.physics.v1',
  title: 'GRE Physics Subject Test strategy',
  curriculum: 'ETS',
  grade: '12',
  subject: 'test-prep',
  topic: 'gre-physics-subject',
  locale: 'en',
  los: [
    {
      id: 'gre.subject-physics',
      description: 'Apply effective strategy to the GRE Physics Subject Test: content scope, time pressure, formula recall, and the role of order-of-magnitude reasoning.',
      standard: 'GRE-PHYS',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'GRE Subject Physics is the gateway to physics PhD programs.',
      script: 'The GRE Physics Subject Test is required by most physics PhD programs. It tests the entire undergraduate physics curriculum — classical mechanics, electromagnetism, quantum mechanics, thermodynamics, optics, atomic physics, special relativity, lab techniques. 100 multiple-choice questions in 2 hours 50 minutes. The challenge is BREADTH plus speed.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Content breakdown, time strategy, formula bank.',
      keyIdeas: [
        'FORMAT: 100 MC in 2hr 50min. Scored 200-990. −1/4 per wrong (skip uncertain).',
        'CONTENT BREAKDOWN (approximate): CLASSICAL MECHANICS (~20%), ELECTROMAGNETISM (~18%), QUANTUM MECHANICS (~12%), ATOMIC + NUCLEAR + PARTICLE (~10%), THERMODYNAMICS + STAT MECH (~10%), OPTICS + WAVES (~9%), SPECIAL RELATIVITY (~6%), LAB METHODS (~6%), MISCELLANEOUS (math methods, computing, history) (~9%).',
        'TIME PRESSURE: ~1.7 min per Q. Many require quick formula recall + plug-and-chug. Don\'t derive — just remember.',
        'FORMULA BANK to memorize cold: kinematics, conservation laws, Maxwell equations (in differential AND integral form), Schrödinger equation forms, Stefan-Boltzmann law, Bohr model formulas, lensmaker\'s eq, special relativity transformations.',
        'ORDER-OF-MAGNITUDE REASONING: many Qs can be eliminated by checking units / orders. If a magnetic-field answer is in joules, it\'s wrong without computing.',
        'PRACTICE WITH PAST EXAMS: ETS releases past Physics GRE tests — practice them all. The level + style of questions is most consistent across past papers.',
        'COMMON QUESTION TYPES: 1) Plug-and-chug formula recall. 2) Limit / scaling — what happens to X as Y → ∞? 3) Diagram interpretation (circuits, optics ray diagrams). 4) Conceptual questions on famous experiments (Stern-Gerlach, photoelectric, Rutherford, double-slit).',
        'STRATEGY: scan all 100 Qs in 5-10 min, mark instantly recognizable. First pass 60 min for ~60 Qs (the easy half). Second pass 50 min for the medium ones. Last 30 min for hard ones + buffer.',
        'PREP TIMELINE: 6 months minimum for a student fresh out of an introductory undergrad sequence. Strong physics majors with junior-level mechanics + EM + QM completed need 3-4 months.',
      ],
      vocabulary: [
        { term: 'order-of-magnitude reasoning', definition: 'estimating a quantity to within a factor of 10 to verify or eliminate answers.' },
        { term: 'commutator', definition: '[A, B] = AB − BA; central in quantum mechanics, especially uncertainty relations.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pace',
      kind: 'worked_example',
      problem: '170 minutes for 100 questions = 1.7 min each. Plan a 3-pass attempt.',
      steps: [
        'PASS 1 (60 min): tackle the ~60 questions you can recognize and solve quickly. These are formula plug-ins, simple conceptual questions. Goal: 60 questions answered in 60 min — 1 min average.',
        'PASS 2 (60 min): tackle the next ~30 questions that require 2-3 minutes. Medium difficulty.',
        'PASS 3 (40 min): hardest 10. Spend 4 min on each. Skip if no path within 1 min.',
        'BUFFER: ~10 min for review of marked uncertain answers.',
        'FALLBACK: if running out of time, leave hardest ones blank rather than guessing — −1/4 penalty doesn\'t reward random.',
      ],
      answer: 'Three-pass approach: easy → medium → hard. Skip hard ones without a clear path.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A particle of mass m is in a 1D infinite square well of width L. What\'s the energy of the ground state? (Use ℏ for h-bar.)',
      expectedAnswer: 'E_1 = π²ℏ²/(2mL²) — formula recall is essential for the GRE Physics test. Should be at instant access.',
      responseFormat: 'free',
      hints: [
        'Energy formula: E_n = n²π²ℏ²/(2mL²).',
        'For ground state, n = 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-derive',
      kind: 'misconception_check',
      question: 'Should you DERIVE formulas during the GRE Physics test?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating the test like a problem set.',
          correctsTo: 'No — there\'s no time. With 1.7 min per question average, deriving even simple results burns your budget. The test rewards FORMULA RECALL. If you recognize the question type, the formula should come instantly. Spend prep time MEMORIZING the formula bank, not re-deriving every time. The 2-hour time pressure is the main filter for who\'s really mastered the material vs who needs to think through every step.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '100 Qs in 170 min. −1/4 wrong (skip uncertain).',
        'Mechanics + E&M + QM = ~50% of content. Distribute prep.',
        'Memorize formulas — derivation is too slow.',
        'Three-pass attempt: easy → medium → hard.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the Physics GRE\'s 1.7-minute pace fundamentally different from a course exam in physics?',
      hint: 'Course exams test depth — fewer problems, more time per problem, partial credit. Subject test is breadth + speed — the goal is to filter who has SO INTERNALIZED the entire undergraduate curriculum that they answer instinctively. A student who can derive everything but slowly will score 700; one who recognizes 80% of questions in 1 min will score 900. The test isn\'t fair to slow but careful thinkers — that\'s by design.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
