/**
 * ACT — Math / Exponents, Roots & Logarithms.
 *
 * Standalone questions, calculator allowed, ~60 seconds per question.
 * Exponent and radical rules recur constantly across ACT Math, and
 * logarithms are tested DIRECTLY on the ACT (unlike the SAT) — the core
 * skill is fluently converting log_b(x) = y ↔ b^y = x.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_EXPONENTS_ROOTS_LOGS: LessonPlan = {
  id: 'evelyn.testprep.act.exponents-roots-logs.v1',
  title: 'Exponents, Roots & Logarithms',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.exponents-roots-logs',
      standard: 'ACT-2.6',
      description:
        'Apply exponent rules, simplify and rationalize radicals, and convert fluently between logarithmic and exponential form to solve ACT Math questions quickly and accurately.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe exponents/roots/logs as a recurring, high-frequency ACT Math pattern — and flag that logs are ACT-specific.',
      script:
        "About 4 to 6 of the 60 ACT Math questions test exponents, roots, or logarithms directly — and logarithms show up on the ACT but NOT on the SAT, so this is pure ACT territory. You get roughly 60 seconds per question here, which is plenty of time IF you know the rules cold. Today: the exponent and radical rules the ACT reuses constantly, plus the one log skill that unlocks almost every log question — converting between log form and exponential form.",
      estimatedMinutes: 1,
    },
    {
      id: 'concept-exponents-logs',
      kind: 'concept',
      goal: 'The core exponent/radical rules, the log-exponential change-of-form, and the traps the ACT builds around each.',
      keyIdeas: [
        'EXPONENT RULES: aᵐ × aⁿ = a^(m+n); aᵐ ÷ aⁿ = a^(m−n); (aᵐ)ⁿ = a^(mn); a⁰ = 1; a^(−n) = 1/aⁿ.',
        'FRACTIONAL EXPONENTS ARE ROOTS: a^(1/n) = ⁿ√a — e.g. a^(1/2) = √a, a^(1/3) = the cube root of a. The ACT tests this equivalence directly.',
        'RADICAL RULES: √(a·b) = √a · √b and √(a/b) = √a / √b — but radicals do NOT distribute over addition or subtraction: √(a+b) ≠ √a + √b.',
        'SIMPLIFYING RADICALS: pull out perfect-square factors, e.g. √72 = √(36·2) = √36 · √2 = 6√2.',
        'RATIONALIZING DENOMINATORS: no radical should be left on the bottom of a fraction — multiply top and bottom by that radical, e.g. 1/√2 = √2/2.',
        'LOGS ARE INVERSE EXPONENTS — CHANGE OF FORM: log_b(x) = y means "b raised to the y equals x." So log_b(x) = y ↔ b^y = x. This is the ACT log skill: move fluently between the two forms.',
        'LOG DOMAIN TRAP: log_b(x) is only defined for x > 0 and b > 0, b ≠ 1. Trap choices sometimes offer a value of x that is zero or negative — it can never be the answer to a log equation.',
        'NEGATIVE-EXPONENT TRAP: a negative exponent means "take the reciprocal," NOT "make the value negative." 2^(−3) = 1/8, not −8.',
      ],
      vocabulary: [
        { term: 'logarithm', definition: 'the exponent you must raise a fixed base to, to produce a given number; log_b(x) is that exponent.' },
        { term: 'base', definition: 'in log_b(x) or bˣ, the number b being raised to a power (for logs, must be positive and ≠ 1).' },
        { term: 'radical', definition: 'the root symbol √; √a is the non-negative number that, multiplied by itself, gives a.' },
        { term: 'rationalize', definition: 'rewrite a fraction so no radical remains in the denominator.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-exponent-rules',
      kind: 'worked_example',
      problem: 'Simplify: (x³)⁴ · x² / x⁵',
      steps: [
        'Apply the power rule first: (x³)⁴ = x^(3×4) = x¹².',
        'Apply the product rule: x¹² · x² = x^(12+2) = x¹⁴.',
        'Apply the quotient rule: x¹⁴ / x⁵ = x^(14−5) = x⁹.',
      ],
      answer: 'x⁹',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-log-trap',
      kind: 'worked_example',
      problem: 'If log₂(x) = −3, what is x?',
      steps: [
        'Rewrite in exponential form using log_b(x) = y ↔ b^y = x. Here b = 2, y = −3, so x = 2^(−3).',
        'TRAP: a negative exponent does NOT make the value negative — students who write x = −8 are treating the sign of the exponent as the sign of the answer. That\'s wrong.',
        'Correctly, 2^(−3) means the reciprocal of 2³: x = 1/2³ = 1/8.',
      ],
      answer: 'x = 1/8',
      estimatedMinutes: 3,
    },
    {
      id: 'try-log-basic',
      kind: 'try_yourself',
      problem: 'log₄(x) = 2. What is x?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2' },
        { id: 'b', text: '8' },
        { id: 'c', text: '16', correct: true },
        { id: 'd', text: '32' },
      ],
      expectedAnswer: '16',
      hints: [
        'Rewrite as exponential form: log_b(x) = y means b^y = x.',
        'Here b = 4 and y = 2, so x = 4².',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-exponent-rules',
      kind: 'try_yourself',
      problem: 'What is the value of (2³)² / 2⁴?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2' },
        { id: 'b', text: '4', correct: true },
        { id: 'c', text: '8' },
        { id: 'd', text: '64' },
      ],
      expectedAnswer: '4',
      hints: [
        'Apply the power rule first: (2³)² = 2^(3×2) = 2⁶.',
        'Then apply the quotient rule: 2⁶ / 2⁴ = 2^(6−4) = 2².',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-log-numeric',
      kind: 'try_yourself',
      problem: 'Type your answer: log₂(32) = ?',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'Ask: 2 raised to what power gives 32?',
        '2⁵ = 32, so log₂(32) = 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-radical-sum',
      kind: 'misconception_check',
      question:
        'A student simplifies √(9 + 16) by writing √9 + √16 = 3 + 4 = 7. What is the correct value, and what went wrong?',
      commonErrors: [
        {
          answer: '7',
          misconception: 'Assuming radicals distribute over addition: √(a+b) = √a + √b. They do not.',
          correctsTo:
            'Add inside the radical FIRST, then take the root: √(9+16) = √25 = 5. Radicals only distribute over multiplication and division — √(a·b) = √a · √b — never over addition or subtraction.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'log_b(x) = y is just another way of writing b^y = x — the ACT tests moving between these forms directly.',
        'Exponent rules: same base multiplying → add exponents; power of a power → multiply exponents; negative exponent → reciprocal, not a negative value.',
        'Radicals distribute over multiplication/division only — never over addition or subtraction: √(a+b) ≠ √a + √b.',
        'ACT Math gives ~60 seconds per question — spot which rule applies before reaching for the calculator.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.6', cedTitle: 'Exponents, Roots & Logarithms' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
