/**
 * ACT Reading — Detail, Inference, and Comparison Questions.
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_READING_QUESTION_TYPES: LessonPlan = {
  id: 'evelyn.testprep.act.reading.question-types.v1',
  title: 'ACT Reading — Detail, Inference, and Paired-Passage Strategies',
  curriculum: 'ACT-PREP',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act-reading',
  locale: 'en',
  los: [
    {
      id: 'testprep.act.reading.question-types',
      description: 'Drill the per-question approach for detail, inference, and paired-passage comparison questions.',
      standard: 'ACT-READING',
    },
  ],
  prerequisites: ['testprep.act.reading.passage-strategy'],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Each ACT Reading question type has a specific approach — knowing which is fastest matters under time pressure.',
      script: 'Detail questions: hunt for the line, read carefully. Inference: what does the text imply? Comparison: track what each passage says about the same topic. Different approaches; same goal — finishing on time with high accuracy.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-question-types',
      kind: 'concept',
      goal: 'Procedure for detail, inference, comparison; line references; trap recognition.',
      keyIdeas: [
        'DETAIL questions: ask what was STATED in the passage. Procedure:',
        '  1. Read the question and identify the key term.',
        '  2. Find that term in the passage (line ref usually given).',
        '  3. Read 1-2 sentences before and after for context.',
        '  4. Match the answer to the passage WORDING (or precise paraphrase).',
        '  Trap: an answer with passage words but distorted meaning.',
        'INFERENCE questions: ask what is IMPLIED. Procedure:',
        '  1. Find the relevant section.',
        '  2. Identify what is stated vs what is left unsaid.',
        '  3. The correct answer must be SUPPORTED by the text but not directly stated.',
        '  4. ELIMINATE answers that contradict the passage or go too far.',
        '  Common signal words: "suggests," "implies," "would most likely agree."',
        'PAIRED-PASSAGE comparison (recently added on some ACTs):',
        '  TWO passages on related topics, with questions about each individually AND about both together.',
        '  Read passage A, do its questions. Read passage B, do its questions. THEN do comparison questions.',
        '  Track: what does A say about X? What does B say about X? Are they agreeing, disagreeing, or talking past each other?',
        'TYPICAL COMPARISON questions:',
        '  "Both authors would agree that..." — find common ground.',
        '  "The authors\' main disagreement is..." — find divergence.',
        '  "How would the author of A respond to B\'s claim that...?" — predict from A\'s framework.',
        'STRATEGY: write a 3-word summary of each passage\'s main argument BEFORE comparison questions.',
      ],
      vocabulary: [
        { term: 'inference', definition: 'a conclusion supported by, but not directly stated in, the passage.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Detail question: line 35 says "The expedition relied on dogsleds." Question: "According to the passage, the explorers traveled by:" Options include (A) snowshoes, (B) skis, (C) dogsleds, (D) horses.',
      steps: [
        'Detail question — go to the line ref directly.',
        'Line 35 explicitly says "dogsleds."',
        'Match: (C) dogsleds.',
        'Trap check: did any other option appear nearby in the passage? If "skis" or "snowshoes" appears in another paragraph as a different mode, the question would still be (C) for THIS sentence.',
      ],
      answer: '(C) dogsleds',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Inference: a passage describes a politician who "always thanked donors before answering reporters." The question: "The passage suggests the politician valued:" (A) transparency, (B) financial supporters more than the press, (C) reporters\' opinions, (D) public speaking.',
      expectedAnswer: '(B) financial supporters more than the press. The behaviour (thanking donors first) IMPLIES priority — donors come before press in attention. Not stated explicitly, but supported by the action described. (A) transparency — opposite. (C) reporters\' opinions — contradicted. (D) public speaking — irrelevant.',
      responseFormat: 'free',
      hints: [
        'What does putting donors before reporters suggest?',
        'Which answer is supported but not stated?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-passage-words',
      kind: 'misconception_check',
      question: 'A student picks an answer because it contains exact words from the passage. Why is this risky?',
      commonErrors: [
        {
          answer: 'Same words = correct answer',
          misconception: 'Confusing word matching with meaning matching.',
          correctsTo: 'ACT often includes "trap" answers that recycle passage words but DISTORT the meaning. The correct answer often paraphrases the passage in DIFFERENT words. Strategy: cover the answer choices, predict what the answer should say in YOUR words, then find the option that matches your prediction in MEANING — not in word choice.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Detail: hunt the line, match meaning carefully.',
        'Inference: supported, not stated; avoid extremes.',
        'Comparison: summarise each passage in 3 words first.',
        'Word-matching ≠ meaning-matching — distrust answers that just recycle passage words.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
