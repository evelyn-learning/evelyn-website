/**
 * Grades 11-12 Math — Properties of Logarithms.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_MATH_LOG_PROPERTIES: LessonPlan = {
  id: 'evelyn.g1112.math.log.properties.v1',
  title: 'Logarithms — Properties and Manipulation',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'logarithms-exponentials',
  locale: 'en',
  los: [
    {
      id: 'g1112.math.log.properties',
      description: 'Apply log properties (product, quotient, power, change of base) to expand or condense logarithmic expressions.',
      standard: 'CCSS.MATH.CONTENT.HSA.SSE.B.3c',
    },
  ],
  prerequisites: ['g1112.math.log.equations'],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Log properties are the algebra of logs — they turn products into sums (which is why logs were invented).',
      script: 'Before calculators, multiplying long numbers was tedious. Logarithm tables converted multiplication to addition (log(AB) = log A + log B), did the easy add, then converted back. The properties that made that possible are now your toolkit for simplifying any log expression.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-log-properties',
      kind: 'concept',
      goal: 'The four properties, expanding vs condensing, common errors.',
      keyIdeas: [
        'PRODUCT rule: log_b(MN) = log_b(M) + log_b(N). (Log of product = sum of logs.)',
        'QUOTIENT rule: log_b(M/N) = log_b(M) − log_b(N). (Log of quotient = difference of logs.)',
        'POWER rule: log_b(Mᵏ) = k log_b(M). (Exponent moves out to a coefficient.)',
        'CHANGE OF BASE: log_b(M) = log(M) / log(b) = ln(M) / ln(b). (Convert to whatever base your calculator has.)',
        'IDENTITIES:',
        '  log_b(1) = 0 (because b⁰ = 1).',
        '  log_b(b) = 1.',
        '  log_b(bˣ) = x.  And  b^(log_b x) = x. (Inverse functions.)',
        'EXPANDING means writing a single log as a sum/difference of simpler logs (using product, quotient, power rules).',
        'CONDENSING means writing a sum/difference of logs as a single log (reverse direction).',
        'NON-RULES (common errors):',
        '  log(M + N) ≠ log M + log N. (No "sum to log" rule. The product rule needs MULTIPLICATION inside.)',
        '  log(M)·log(N) ≠ log(MN). (No "product of logs" rule.)',
        '  log(M)/log(N) ≠ log(M/N). (Quotient rule needs the QUOTIENT inside the log.)',
        '  (log M)² ≠ log(M²). (Squaring the log ≠ log of square.)',
      ],
      vocabulary: [
        { term: 'expanding a log', definition: 'rewriting a single log of a product/quotient/power as a sum, difference, or scalar of simpler logs.' },
        { term: 'condensing a log', definition: 'combining a sum/difference of logs into a single log expression.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Expand log₂(8x³√y / (z²)) using log properties.',
      steps: [
        'Apply quotient rule: log₂(8x³√y) − log₂(z²).',
        'Apply product rule on numerator: log₂(8) + log₂(x³) + log₂(√y) − log₂(z²).',
        'Simplify log₂(8) = 3 (since 2³ = 8).',
        'Apply power rule on each: 3 + 3 log₂(x) + log₂(y^(1/2)) − 2 log₂(z).',
        'Apply power rule on the square root: 3 + 3 log₂(x) + (1/2) log₂(y) − 2 log₂(z).',
        'Final: 3 + 3 log₂(x) + (1/2) log₂(y) − 2 log₂(z).',
      ],
      answer: '3 + 3 log₂(x) + (1/2) log₂(y) − 2 log₂(z)',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Condense to a single logarithm: 2 log(x) − 3 log(y) + log(5).',
      expectedAnswer: 'Apply power rule to first two: log(x²) − log(y³) + log(5). Quotient rule: log(x²/y³) + log(5). Product rule: log(5x²/y³).',
      responseFormat: 'free',
      hints: [
        'Apply the power rule first to move coefficients into exponents.',
        'Then combine with product/quotient rules.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-log-sum',
      kind: 'misconception_check',
      question: 'A student writes log(x + 3) = log(x) + log(3). What\'s the error?',
      commonErrors: [
        {
          answer: 'Distributes log over a sum',
          misconception: 'Treating log as if it were a multiplicative function distributing over addition.',
          correctsTo: 'log(x + 3) does NOT simplify. There is NO log property for a sum INSIDE a log. The product rule converts log(x · 3) = log x + log 3, but addition inside is not a product. log is not linear: log(x + 3) ≠ log x + log 3 in general. (Quick numerical check: log(1 + 9) = log 10 = 1, but log 1 + log 9 = 0 + ~0.954 ≈ 0.954 ≠ 1.) Memorise the four legitimate properties; assume no others apply.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'log(MN) = log M + log N. log(M/N) = log M − log N. log(Mᵏ) = k log M.',
        'log_b(1) = 0; log_b(b) = 1; log_b(bˣ) = x.',
        'NO sum-rule: log(M+N) doesn\'t simplify.',
        'Coefficients become exponents (and vice versa) via the power rule.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
