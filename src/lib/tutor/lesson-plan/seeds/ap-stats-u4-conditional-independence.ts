/**
 * AP Statistics — CED Unit 4.4+4.5: Conditional Probability and
 * Independence.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U4_CONDITIONAL_INDEPENDENCE: LessonPlan = {
  id: 'evelyn.ap.stats.conditional-independence.v1', title: 'U4.4 Conditional Probability and Independence',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.conditional-independence', description: 'Compute conditional probabilities using the formula P(A | B) = P(A and B)/P(B). Test for independence: A and B are independent iff P(A | B) = P(A). Apply the multiplication rule.', standard: 'AP-STATS-4.4-4.5' }],
  prerequisites: ['apstats.probability-basics'], followUps: ['apstats.random-variables'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame conditional probability.', script: "P(A) is the chance of A in the whole sample space. P(A | B) is the chance of A given that B happened — usually different. Today: how to compute it, when events are independent, and how to multiply probabilities.", estimatedMinutes: 2 },
    { id: 'concept-conditional', kind: 'concept', goal: 'Cover conditional + independence + multiplication.',
      keyIdeas: [
        'CONDITIONAL PROBABILITY: P(A | B) = P(A and B) / P(B), provided P(B) > 0. "Given B, what\'s the probability of A?"',
        'INTERPRETATION: restrict the sample space to outcomes where B occurred. Among those, what fraction also has A?',
        'INDEPENDENCE: events A and B are INDEPENDENT if knowing B happens does not change the probability of A:',
        '  • P(A | B) = P(A), equivalently P(A and B) = P(A) · P(B).',
        '  • Otherwise A and B are DEPENDENT.',
        'CRITICAL: independence ≠ mutually exclusive. Mutually exclusive means P(A and B) = 0; if both have positive probability, they are NOT independent (knowing B happened means A definitely didn\'t).',
        'GENERAL MULTIPLICATION RULE: P(A and B) = P(A) · P(B | A) = P(B) · P(A | B). Use when events are dependent.',
        'INDEPENDENT EVENTS multiplication: P(A and B) = P(A) · P(B). Special case where P(B | A) = P(B).',
        'TWO-WAY TABLES are great for conditional probability problems — divide cell counts by appropriate row or column total.',
        'AP COMMON ERROR: mixing up P(A | B) and P(B | A). E.g., P(disease | positive test) ≠ P(positive test | disease).',
      ],
      vocabulary: [
        { term: 'conditional probability', definition: 'P(A | B) = P(A and B) / P(B).' },
        { term: 'independent events', definition: 'P(A | B) = P(A); knowing B doesn\'t change A\'s chance.' },
      ],
      estimatedMinutes: 6 },
    { id: 'worked-twoway', kind: 'worked_example',
      problem: 'A two-way table: 60 students total. By gender × glasses: \nMales: 25 with glasses, 15 without. \nFemales: 10 with glasses, 10 without. \nFind P(glasses | male) and P(male | glasses).',
      steps: [
        'STEP 1 — Total males: 40. Glasses among males: 25. P(glasses | male) = 25/40 = 0.625.',
        'STEP 2 — Total with glasses: 25 + 10 = 35. Males among glasses-wearers: 25. P(male | glasses) = 25/35 ≈ 0.714.',
        'STEP 3 — Note: P(glasses | male) ≠ P(male | glasses). Different conditioning.',
      ],
      answer: 'P(glasses | male) = 0.625. P(male | glasses) ≈ 0.714.', estimatedMinutes: 4 },
    { id: 'try-independence', kind: 'try_yourself',
      problem: 'In a deck: P(king) = 4/52 = 1/13. P(heart) = 13/52 = 1/4. P(king AND heart) = 1/52. Are king and heart independent?',
      expectedAnswer: 'Test: P(king) · P(heart) = (1/13)(1/4) = 1/52 = P(king AND heart). EQUAL → INDEPENDENT. Knowing the card is a heart does not change the probability it\'s a king.',
      responseFormat: 'free', hints: ['Independence: P(A)·P(B) = P(A and B)?'], estimatedMinutes: 3 },
    { id: 'try-conditional', kind: 'try_yourself',
      problem: 'A medical test for a disease: 1% of population has the disease. The test is 95% accurate (95% sensitivity AND 95% specificity). A randomly chosen person tests positive. What is the probability they actually have the disease? (Use a hypothetical population of 10,000.)',
      expectedAnswer: 'Build a hypothetical 10,000 people: 100 have the disease (1%), 9900 don\'t. Among the 100 with disease: 95 test positive (true positives), 5 test negative. Among 9900 without: 95% specific = 9405 test negative, 495 test positive (false positives). Total positives = 95 + 495 = 590. P(disease | positive) = 95/590 ≈ 16.1%. (Counterintuitively low because false positives swamp true positives when disease is rare.)',
      responseFormat: 'numeric', hints: ['Imagine 10,000 people; build the table; condition on test result.'], estimatedMinutes: 5 },
    { id: 'try-multiplication', kind: 'try_yourself',
      problem: 'AP-style synthesis. A jar has 5 red and 3 blue marbles. Draw two marbles WITHOUT replacement. (a) P(both red)? (b) P(red then blue)? (c) Are the two draws independent? Justify.',
      expectedAnswer: '(a) P(R₁) = 5/8. P(R₂ | R₁) = 4/7 (one red and one fewer total). P(R₁ and R₂) = (5/8)(4/7) = 20/56 = 5/14. (1.5)\n(b) P(R then B) = (5/8)(3/7) = 15/56. (1.5)\n(c) NOT INDEPENDENT. Without replacement, the first draw changes the second\'s probabilities. P(R₂) = 5/8 marginally, but P(R₂ | R₁) = 4/7 — different. (2)\nTotal: 5 points.',
      responseFormat: 'frq', hints: ['Without replacement → conditional probabilities change.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'P(A | B) = P(A and B) / P(B).',
      'Independent: P(A | B) = P(A), equivalently P(A and B) = P(A)·P(B).',
      'Independent ≠ mutually exclusive.',
      'Use two-way tables for conditional problems; without replacement → dependent.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '4', cedTopic: '4.4-4.5', cedTitle: 'Conditional and Independence', sources: [{ type: 'concept', book: 'tps5e', chapter: '5', note: 'Standard conditional/independence.' }] },
};
