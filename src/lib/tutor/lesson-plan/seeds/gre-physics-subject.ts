/**
 * GRE Physics Subject Test — anchor plan covering scope, scoring,
 * and the topic-balance strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_PHYSICS_SUBJECT: LessonPlan = {
  id: 'evelyn.testprep.gre-physics-subject.strategy.v1',
  title: 'GRE Physics Subject Test — scope, strategy, time management',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'gre-physics-subject',
  locale: 'en',
  los: [
    {
      id: 'gre.physics-subject.strategy',
      description: 'Map the GRE Physics Subject Test format, content distribution, and the prep strategy that maximises the 200-990 score.',
      standard: 'GRE-PHYS-SUBJECT',
    },
  ],
  prerequisites: ['ibdp.physics.overview'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The GRE Physics Subject Test is the single most-weighted credential for US physics PhD admissions.',
      script: 'Top US physics PhD programmes lean heavily on the Physics GRE. A 90th-percentile score (~880/990) is competitive; below 60th percentile usually requires compensating strengths elsewhere. The test is dense — 100 questions, 2h50m, no calculator beyond a small ruler — and rewards a specific kind of preparation. Today we map the scope and the strategy that converts undergraduate physics into top-decile scores.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-gre-phys',
      kind: 'concept',
      goal: 'Test format, content distribution, scoring, prep strategy.',
      keyIdeas: [
        'FORMAT: 100 multiple-choice questions, 2 hours 50 minutes (≈ 1 min 42 sec per question), paper-and-pencil, no calculator. Score scale 200-990 with percentile compression at the top.',
        'SCORING: raw = (correct) − ¼(incorrect). Same expected-value math as the Math Subject Test — blind guess is neutral; educated guess is positive EV.',
        'CONTENT DISTRIBUTION (approximate): CLASSICAL MECHANICS 20%, ELECTROMAGNETISM 18%, OPTICS & WAVES 9%, THERMODYNAMICS & STATISTICAL MECHANICS 10%, QUANTUM MECHANICS 12%, ATOMIC PHYSICS 10%, SPECIAL RELATIVITY 6%, LAB METHODS 6%, SPECIALISED TOPICS (nuclear, particle, condensed matter, astrophysics, math methods) 9%.',
        'TIME PRESSURE: 100 questions / 170 min ≈ 1m42 per question. Many are 30-second symbol-manipulation problems; some are 3-minute multi-step. Pace ruthlessly.',
        'STRATEGY for top scores: (1) Two-pass — handle the gimme questions first (units, dimensions, qualitative). (2) Memorise the formula sheet — this test gives you NOTHING. (3) Drill problem patterns from Conquering the Physics GRE (Kahn & Anderson) and the four official ETS practice tests. (4) Lab methods is small but underprepared — easy points if drilled.',
        'CHARACTERISTIC QUESTION PATTERNS: order-of-magnitude estimates (no calc, so estimate fast), unit-checking ("which of these has units of energy?"), dimensional analysis to recover formulas you forgot, identifying limit behaviour, recognising standard problems in disguise (SHM dressed up as a circuit, etc.).',
        'COMMON KILLERS: relativistic kinematics with both transformations and energy-momentum, multi-step quantum problems requiring perturbation theory or specific operator algebra, statistical mechanics partition function setups, EM problems that need recognising the right Maxwell equation to invoke.',
        'PREP TIME: 200-400 hours over 3-6 months. The 4 publicly available ETS tests are gold — save them for the last month and work timed.',
      ],
      vocabulary: [
        { term: 'order-of-magnitude', definition: 'estimating an answer to within a factor of 10 — heavily tested on the Physics GRE because no calculator is allowed.' },
        { term: 'limit behaviour', definition: 'checking what an expression does as a parameter goes to 0 or infinity; useful for eliminating answer choices that fail the limit.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-elimination',
      kind: 'worked_example',
      problem: 'Question: What is the period of small oscillations of a simple pendulum of length L on a planet with surface gravity g\'? (A) 2π√(g\'L) (B) 2π√(L/g\') (C) 2π(L/g\')² (D) (1/2π)√(L/g\') (E) 2πL/g\'',
      steps: [
        'You forget the exact formula. Use limit and dimensional analysis to eliminate.',
        'Period must have units of TIME (seconds). Check each option:',
        '(A) √(g\'·L) → √([m/s²]·[m]) = √[m²/s²] = m/s. WRONG units.',
        '(B) √(L/g\') → √([m]/[m/s²]) = √[s²] = s. CORRECT units.',
        '(C) (L/g\')² → ([s²])² = s⁴. WRONG units.',
        '(D) (1/2π)√(L/g\') → s. CORRECT units, but factor 1/(2π) instead of 2π — different from the standard answer.',
        '(E) L/g\' → [m]/[m/s²] = s². WRONG units.',
        'Down to (B) and (D). Test the limit: as L grows, period should grow (longer pendulum swings slower). Both (B) and (D) satisfy this.',
        'Test the prefactor: T = 2π√(L/g) is the standard formula. (D) has 1/(2π) — wrong.',
        'Answer: (B) 2π√(L/g\').',
        'You answered without remembering the formula — by combining unit elimination + memory of the prefactor. This pattern works across many GRE Physics questions.',
      ],
      answer: '(B) 2π√(L/g\')',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is "memorise units of every physical quantity" a high-leverage Physics GRE prep activity?',
      expectedAnswer: 'Many GRE Physics questions test setups where you might not remember the exact formula, but you CAN check units of the answer choices. Units alone often eliminate 2-3 of the 5 options, dropping the question from "shot in the dark" to "1-out-of-2 with educated guess." Combined with limit behaviour checks, units can sometimes uniquely identify the right answer. The time cost of memorising units is small; the marginal score gain is large because it works on so many questions.',
      responseFormat: 'free',
      hints: [
        'No calculator means lots of dimensional analysis.',
        'How many of the 5 options can usually be eliminated by units alone?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-time',
      kind: 'misconception_check',
      question: 'A student does well on practice problems but scores poorly on practice tests. What\'s the likely failure mode?',
      commonErrors: [
        {
          answer: 'They didn\'t study hard enough',
          misconception: 'Confusing content knowledge with test execution.',
          correctsTo: 'The Physics GRE is as much a TIME-MANAGEMENT test as a physics test. A student who can solve 90% of problems given unlimited time but only 50% under 1m42 per question scores poorly on the actual test. The fix is not more content — it\'s practice-under-time and pattern-recognition drilling. Take all four official ETS tests under STRICT time conditions in the last month, not as untimed practice. Identify your slow categories and drill those specifically.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '100 questions, 170 min, no calculator. ¼-point penalty.',
        'Content: ~20% mech, ~18% E&M, ~12% QM, ~10% thermo+stat mech, ~10% atomic, ~9% specialised, ~9% optics+waves+SR+lab.',
        'Memorise units of every quantity — eliminates wrong answers fast.',
        'Limit-behaviour checks eliminate more options.',
        'Practice under STRICT time on the 4 official ETS tests.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
