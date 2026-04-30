/**
 * LSAT — Law School Admission Test strategy.
 *
 * Logical reasoning, reading comprehension, logic games (now
 * removed in some test versions — verify before exam date).
 */

import type { LessonPlan } from '../types';

export const SEED_LSAT_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.lsat.strategy.v1',
  title: 'LSAT strategy: logical reasoning and reading',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'lsat.strategy',
      description: 'Apply effective strategy to the LSAT including logical reasoning techniques.',
      standard: 'LSAT-STRAT',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'LSAT as the test of legal reasoning.',
      script: 'Law school is about analyzing arguments — finding flaws, drawing inferences, parsing dense prose. The LSAT tests exactly that. Unlike most standardized tests, content knowledge barely matters. Reasoning skill is everything.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format-tactics',
      kind: 'concept',
      goal: 'Format + question types + per-section strategy.',
      keyIdeas: [
        'FORMAT (recent): ~3 hours. Logical Reasoning (LR), Reading Comprehension (RC), and an unscored experimental section. Logic Games removed for newer test format — confirm details for your test date.',
        'LOGICAL REASONING (LR): short arguments, ~25 questions per section. Question types:',
        '  STRENGTHEN: which choice supports the argument?',
        '  WEAKEN: which choice undermines it?',
        '  ASSUMPTION: what unstated belief does the argument require?',
        '  INFERENCE / MUST BE TRUE: what follows necessarily from the passage?',
        '  FLAW: what\'s wrong with the reasoning?',
        '  PARALLEL REASONING: which choice has the same logical structure?',
        '  PRINCIPLE: what general rule connects the argument?',
        'STRATEGY for LR: identify CONCLUSION + EVIDENCE first. Most questions hinge on the gap between them. Pre-phrase your answer before looking at choices.',
        'READING COMPREHENSION (RC): dense passages, multiple questions each. Strategy: read for STRUCTURE (main idea, author\'s view, paragraph functions), not memorization.',
        'WRITING SAMPLE: ungraded but sent to schools. Reasoned argument, take a position.',
        'SCORING: 120-180. Median ~152. Top schools median ~170+.',
        'PRACTICE makes the biggest difference — LSAT prep typically 200+ hours over 3-6 months. Focus on under-timed mastery first; speed comes after accuracy.',
      ],
      vocabulary: [
        { term: 'LR', definition: 'Logical Reasoning section of the LSAT.' },
        { term: 'assumption', definition: 'an unstated belief required for an argument to work.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-lr',
      kind: 'worked_example',
      problem: 'LR strategy: an argument concludes "we should ban X". Question asks for the WEAKEN. How do you approach?',
      steps: [
        'Find CONCLUSION: "we should ban X".',
        'Find EVIDENCE: "X causes Y, and Y is bad".',
        'Find ASSUMPTION (gap): banning X reduces Y, AND Y\'s harm exceeds the cost of banning, AND no alternative is better.',
        'For WEAKEN: pick a choice that ATTACKS the assumption. Examples:',
        '  "X is the smaller cause of Y; banning X won\'t reduce Y much" (attacks "banning X reduces Y").',
        '  "Banning X would cause Z, which is worse than Y" (attacks the cost-benefit).',
        '  "Y often has alternative causes that ban-of-X wouldn\'t address" (similar).',
        'Eliminate choices that STRENGTHEN, are IRRELEVANT, or ATTACK something not in the argument.',
      ],
      answer: 'identify conclusion + evidence + gap; weaken attacks the gap',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In LR, why is identifying the CONCLUSION first so critical?',
      expectedAnswer: 'most questions ask about the conclusion-evidence relationship; without identifying the conclusion you can\'t evaluate any claim about it',
      responseFormat: 'free',
      hints: [
        'Without conclusion clarity, "weaken" becomes guessing.',
        'Conclusion is your anchor for every question type.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rc-memorize',
      kind: 'misconception_check',
      question: 'For RC, should you try to remember every detail of the passage?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Memorizing dense passages.',
          correctsTo: 'No — read for STRUCTURE. Note: main idea, author\'s position, paragraph functions, contrasts. Detail questions: refer back. You can\'t memorize 60+ lines under time pressure; structure-based reading lets you navigate.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Format: Logical Reasoning + Reading Comprehension (verify per test date).',
        'LR question types: strengthen, weaken, assumption, inference, flaw, parallel, principle.',
        'Identify CONCLUSION and EVIDENCE first.',
        'RC: read for structure, refer back for details.',
        'Practice ~200+ hours with real LSAT questions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does LSAT have such high score-improvement potential with practice?',
      hint: 'Skills are LEARNABLE: spotting argument gaps, recognizing question types, deconstructing dense prose. Most students improve 5-15 points with serious practice. Few standardized tests are this responsive to prep — partly why prep companies thrive.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
