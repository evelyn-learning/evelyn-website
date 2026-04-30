/**
 * G11 — Statistics: Probability basics (rules, conditional, expected value).
 *
 * Foundation of statistical inference. Probability rules: union (OR),
 * intersection (AND), complement. Independent vs dependent events.
 * Conditional probability and the multiplication rule. Expected
 * value as a long-run average.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_STATS_PROBABILITY: LessonPlan = {
  id: 'evelyn.g11.math.stats.probability.v1',
  title: 'Probability: Rules, Conditional, Expected Value',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hss.cp.a.2',
      description: 'Understand independence; compute probabilities of compound events.',
      standard: 'CCSS.MATH.CONTENT.HSS.CP.A.2',
    },
  ],
  prerequisites: ['ccss.math.7.sp.c.5'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor on a coin/dice scenario that surprises students.',
      script: 'Flip a coin three times. What\'s the probability of getting at least one head? Most people say 50% — they\'re wrong. The actual answer (≈ 87.5%) shows that intuitive guesses about combined events are often badly off. Probability is one of the most counterintuitive areas of math, and the rules are how we keep our reasoning honest.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'Sample space, four rules (addition, multiplication, complement, conditional), expected value.',
      keyIdeas: [
        'PROBABILITY of event A: P(A) = (favorable outcomes) / (total outcomes). Always between 0 and 1.',
        'COMPLEMENT rule: P(not A) = 1 - P(A). Often easier to compute "not A" than "A".',
        'ADDITION rule (OR):',
        '  Mutually exclusive events: P(A or B) = P(A) + P(B).',
        '  Otherwise: P(A or B) = P(A) + P(B) - P(A and B). (Subtract overlap.)',
        'MULTIPLICATION rule (AND):',
        '  Independent events: P(A and B) = P(A) · P(B).',
        '  Dependent events: P(A and B) = P(A) · P(B|A). (Conditional.)',
        'CONDITIONAL probability: P(B|A) = "probability of B given A has happened" = P(A and B) / P(A).',
        'INDEPENDENT events: knowing A happened doesn\'t change P(B). Tested by P(B|A) = P(B).',
        'EXPECTED VALUE (E[X]): the long-run average of a random variable.',
        '  E[X] = Σ (value × probability) over all possible values.',
        '  Useful for "should I take this gamble?" questions.',
        'COMMON TRAP: P(at least one) computed by complement. P(at least one head in 3 flips) = 1 - P(no heads) = 1 - (1/2)³ = 1 - 1/8 = 7/8 = 87.5%.',
      ],
      vocabulary: [
        { term: 'sample space', definition: 'all possible outcomes of an experiment.' },
        { term: 'mutually exclusive', definition: 'events that can\'t both happen.' },
        { term: 'independent', definition: 'one event doesn\'t affect the probability of the other.' },
        { term: 'expected value', definition: 'long-run average of a random variable.' },
      ],
      suggestedTools: ['show_equation', 'show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-complement',
      kind: 'worked_example',
      problem: 'A die is rolled twice. What\'s the probability of getting at least one 6?',
      steps: [
        'Direct (hard): (rolling 6 first) + (rolling 6 second) - (rolling 6 both). 1/6 + 1/6 - 1/36 = 11/36.',
        'Easier (complement): P(at least one 6) = 1 - P(NO 6 in either roll).',
        'P(no 6 in one roll) = 5/6.',
        'P(no 6 in both, independent) = (5/6)(5/6) = 25/36.',
        'P(at least one 6) = 1 - 25/36 = 11/36 ≈ 30.6%.',
      ],
      answer: '11/36',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-conditional',
      kind: 'worked_example',
      problem: 'In a class of 30: 18 study Spanish, 12 study French, 6 study both. What is P(student studies French | given they study Spanish)?',
      steps: [
        'P(F|S) = P(F and S) / P(S).',
        'P(F and S) = 6/30 = 1/5.',
        'P(S) = 18/30 = 3/5.',
        'P(F|S) = (1/5) / (3/5) = 1/3.',
        'Interpretation: of students who study Spanish, 1/3 also study French.',
      ],
      answer: '1/3',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-expected',
      kind: 'worked_example',
      problem: 'A lottery costs $2 to play. 1% chance of winning $100, 99% chance of winning $0. What\'s the expected value of buying a ticket?',
      steps: [
        'E[winnings] = 0.01 × $100 + 0.99 × $0 = $1.',
        'But the ticket costs $2.',
        'NET expected value = $1 - $2 = -$1.',
        'Long run: every ticket loses you $1 on average. Don\'t play.',
      ],
      answer: '-$1 (per ticket)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'P(rain Saturday) = 0.4. P(rain Sunday) = 0.5. Independent. What\'s P(rains BOTH days)?',
      expectedAnswer: '0.20',
      responseFormat: 'numeric',
      hints: [
        'Independent events: multiply.',
        '0.4 × 0.5 = 0.2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-gambler',
      kind: 'misconception_check',
      question: 'A coin lands heads 5 times in a row. Owen says "the next flip is more likely tails — it\'s due." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Gambler\'s fallacy — past independent events don\'t change future probability.',
          correctsTo: 'Wrong. A fair coin has memory of nothing. Each flip is INDEPENDENT — still 50/50, no matter what came before. The "due" intuition (gambler\'s fallacy) is one of the most-common probability errors.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'P(not A) = 1 - P(A). Complement is often easier.',
        'OR with mutually exclusive: just add. Otherwise: subtract overlap.',
        'AND with independent: multiply.',
        'P(B|A) = P(A and B) / P(A). Conditional changes the sample space.',
        'Expected value = Σ (value × probability). Long-run average.',
        'Independent events have NO MEMORY. Past flips don\'t affect future flips.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'You roll two dice. What\'s the probability the sum is 7?',
      hint: 'List combinations summing to 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 ways out of 36 total = 6/36 = 1/6.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
