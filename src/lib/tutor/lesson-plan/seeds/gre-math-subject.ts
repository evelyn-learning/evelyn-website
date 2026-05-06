/**
 * GRE Math Subject Test — anchor plan covering scope, scoring, and
 * the calculus + linear algebra + abstract algebra balance.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_MATH_SUBJECT: LessonPlan = {
  id: 'evelyn.testprep.gre-math-subject.strategy.v1',
  title: 'GRE Math Subject Test — scope, strategy, time management',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'gre-math-subject',
  locale: 'en',
  los: [
    {
      id: 'gre.math-subject.strategy',
      description: 'Map the GRE Math Subject Test scope, scoring shape, time pressure, and study allocation that maximises the 200-990 score.',
      standard: 'GRE-MATH-SUBJECT',
    },
  ],
  prerequisites: ['college.math.linear-algebra'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The GRE Math Subject Test is the single most important credential for math PhD admissions in the US.',
      script: 'Top US math PhD programs use the Math Subject Test as a major filter. A 90th-percentile score (~830/990) opens doors a strong undergrad GPA alone won\'t. The test is brutal — 66 questions, 2h50min, no calculator — and rewards specific preparation. Today we map the scope and the strategy that converts content knowledge into top-decile scores.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-gre-math',
      kind: 'concept',
      goal: 'Test format, content distribution, scoring, time management, prep strategy.',
      keyIdeas: [
        'FORMAT: 66 multiple-choice questions, 2 hours 50 minutes, paper-and-pencil, no calculator. Score scale 200-990; percentiles compressed at the high end (a few extra correct answers can move you a lot of percentile rank).',
        'SCORING: raw score = (correct) − ¼(incorrect). Wild guessing is mildly penalised; educated guessing (eliminate 1-2) is favourable.',
        'CONTENT DISTRIBUTION (approximate): CALCULUS 50% (single + multi-variable, sequences/series, differential equations, vector calc), ALGEBRA 25% (linear algebra, abstract algebra basics, number theory), ADDITIONAL TOPICS 25% (real analysis, complex variables, topology, combinatorics, probability, set theory, logic, numerical analysis).',
        'TIME PRESSURE: 2h50 / 66q ≈ 2 min 35 sec per question. Many questions can be solved in under a minute; harder ones take 5+. Pace by topic — never spend more than 5 min on one question on first pass.',
        'STRATEGY for top scores: (1) two passes — easy first, hard second. (2) Bank the gimme calc + linalg questions before tackling abstract algebra and topology. (3) Memorise the integration tricks list (substitution patterns, integration by parts, common improper integrals). (4) Pre-compute commonly needed series sums (geometric, telescoping, harmonic).',
        'COMMON KILLERS: epsilon-delta proofs phrased multiple-choice; identifying topological properties; ring/field/group identification questions; Lagrange theorem applications; convergence of series with subtle terms.',
        'PREP TIME: serious candidates spend 200-400 hours over 3-6 months. Use Princeton Review GRE Math, Cracking the GRE Math, and the official ETS practice tests (4 are publicly available — work them in the last month under timed conditions).',
        'DON\'T undervalue the basics. The test rewards FAST recognition: "this is integration by parts," "this is a quotient ring," "this is the chain rule in disguise." Pattern-recognition speed = score points.',
      ],
      vocabulary: [
        { term: 'pace control', definition: 'managing time per question so you finish; a perfect score on 50 questions is worse than 60% on 66.' },
        { term: 'pattern recognition', definition: 'rapid identification of "what kind of problem is this" — the single most score-predictive habit on the test.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-strategy',
      kind: 'worked_example',
      problem: 'You\'re 90 minutes in and stuck on a topology question. Six questions remain unanswered. What do you do?',
      steps: [
        'Stop. The marginal cost of more time on this question is high; the marginal value of touching the remaining questions is much higher.',
        'Make a best-effort GUESS on the topology question (eliminate one or two options if possible) and mark it for review.',
        'Move on to the remaining six. Most of them will be calc or linear algebra you can solve in 1-2 minutes each.',
        'If time remains after the six, return to the topology question with fresh eyes — you may see it.',
        'Pacing math: 6 unanswered questions × 2 min each = 12 minutes. Spending 12 more minutes on one question is 6× worse expected value.',
        'Score psychology: leaving questions blank costs you raw points (no penalty unlike incorrect, but also no upside). Educated guessing on 5 questions where you can eliminate 2 options yields ~3 correct on average → ~+2 net (after ¼-pt penalty).',
      ],
      answer: 'Guess the topology question; spend the remaining 90 min on the 6 unanswered + reviewable easier ones.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is "memorise common integrals" actually a high-leverage prep activity for the GRE Math Subject test?',
      expectedAnswer: 'Calc is 50% of the test and most calc questions test recognition, not derivation. If you can immediately recall ∫sec²x dx = tanx, ∫1/(1+x²) dx = arctan x, ∫1/√(1−x²) dx = arcsin x, the closed forms of common geometric and telescoping series, and the standard substitution patterns (trig sub for √(a²−x²), etc.), you save 1-2 minutes per question over candidates who derive on the fly. Across 25-30 calc questions, that\'s 25-60 minutes of saved time you can spend on harder questions and review. Recall speed = score.',
      responseFormat: 'free',
      hints: [
        'Calc is 50% of the test.',
        'What\'s the time cost of deriving vs recalling?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-guess',
      kind: 'misconception_check',
      question: 'A student leaves 10 questions blank on the GRE Math Subject test, fearing the ¼-point penalty for wrong answers. Why is this a costly strategy?',
      commonErrors: [
        {
          answer: 'Skip questions to avoid the penalty',
          misconception: 'Treating any guessing as bad rather than calculating expected value.',
          correctsTo: 'The penalty only matters relative to expected value. With 5 answer choices, blind guessing has expected value 1/5 × 1 + 4/5 × (−1/4) = 0 — exactly neutral. So blind guessing is never WORSE than skipping. Educated guessing — eliminate even ONE option — has positive expected value. Eliminate two: 1/3 × 1 + 2/3 × (−1/4) = 1/3 − 1/6 = 1/6 per question on average. Across 10 questions you eliminate one option on, you\'d expect to gain ~5 raw points by guessing vs ~0 by skipping. The fear of the penalty costs more than the penalty itself.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '66 questions, 170 min, no calculator. ¼-point penalty for wrong.',
        'Content: 50% calc, 25% algebra, 25% additional topics.',
        'Memorise common integrals + series — pattern recognition is score-predictive.',
        'Two passes: easy questions first, hard second.',
        'Educated guessing (eliminate 1-2 options) has positive expected value.',
        'Use 4 official ETS practice tests in last month under timed conditions.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
