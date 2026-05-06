/**
 * ACT Reading — Passage Strategy and Question Types.
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_READING_PASSAGE_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.act.reading.passage-strategy.v1',
  title: 'ACT Reading — Passage Approach and Question Types',
  curriculum: 'ACT-PREP',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act-reading',
  locale: 'en',
  los: [
    {
      id: 'testprep.act.reading.passage-strategy',
      description: 'Apply per-passage time discipline (~8.5 min each), identify question types (main idea, detail, inference, vocab in context), and use line references efficiently.',
      standard: 'ACT-READING',
    },
  ],
  prerequisites: ['testprep.act.reading'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'ACT Reading is a TIME test, not a comprehension test — most students could get every question right with unlimited time.',
      script: '4 passages, 40 questions, 35 minutes — that\'s 8 min 45 sec per passage. Reading + answering. The students who run out of time are NOT slow readers; they\'re slow at the QUESTION-AND-ANSWER cycle. Today we drill the strategy that makes that cycle faster.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-act-reading',
      kind: 'concept',
      goal: 'Passage order, reading speed, question types, line references, common traps.',
      keyIdeas: [
        'PASSAGE ORDER (always same): Prose Fiction, Social Science, Humanities, Natural Science. Skip to your strongest type first if pacing matters.',
        'PER-PASSAGE BUDGET: ~3 min reading + ~5 min on questions = 8.5 min total.',
        'READING APPROACH options:',
        '  PASSAGE FIRST: read the whole thing, then answer. Best if you\'re a fast reader and good at retention.',
        '  SKIM + REFERENCE: skim the passage in 60 seconds (read first/last paragraph + topic sentences), then dive into questions, returning to passage for line refs.',
        '  QUESTIONS FIRST: read questions first, then hunt the passage for answers. Best for slow readers.',
        '  Try all three on practice tests; pick the one that gives you HIGHEST accuracy AT speed.',
        'QUESTION TYPES:',
        '  MAIN IDEA: what is the passage primarily about? Skim first/last paragraph.',
        '  DETAIL: stated explicitly in the passage; line ref helpful.',
        '  INFERENCE: not stated, but supported by the text. Avoid extreme answers (always, never).',
        '  VOCAB IN CONTEXT: the word\'s meaning HERE, not its dictionary meaning. Always re-read the sentence.',
        '  TONE/PURPOSE: author\'s attitude toward subject; usually nuanced (mildly skeptical > strongly hostile).',
        '  STRUCTURE: how is the passage organised?',
        'TRAPS:',
        '  EXTREME LANGUAGE in answers ("always," "never," "all") — usually wrong on inference questions.',
        '  HALF-RIGHT answers — say something true but not the FULL or BEST answer.',
        '  ANSWERS USING WORDS FROM THE PASSAGE — feel familiar but may distort the meaning.',
        '  YOUR OPINION — answer based on the passage, not your views.',
      ],
      vocabulary: [
        { term: 'inference question', definition: 'asks what is implied by the passage; correct answer is supported by text but not stated explicitly.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A vocab-in-context question: "The word \'plastic\' in line 24 most nearly means: (A) artificial, (B) flexible, (C) stiff, (D) cheap." Line 24 says "His political views were plastic — he changed them with each new audience."',
      steps: [
        'Re-read the line in context.',
        'The sentence describes views that CHANGE — they\'re malleable, not fixed.',
        'Match meaning to options:',
        '  (A) artificial — could fit the dictionary meaning of "plastic" (man-made), but doesn\'t match "changed" connotation.',
        '  (B) flexible — matches "changed with each audience."',
        '  (C) stiff — opposite.',
        '  (D) cheap — irrelevant.',
        'Answer: (B). Vocab-in-context always favours the meaning that fits THIS sentence, not the most common dictionary definition.',
      ],
      answer: '(B) flexible',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A passage about arctic explorers concludes with the explorer "limping back to camp at midnight, with two of his five companions." A question asks "The author\'s attitude toward the explorer is best described as:" (A) celebratory, (B) deeply critical, (C) sympathetic but somber, (D) indifferent.',
      expectedAnswer: '(C) sympathetic but somber. The image of "limping back" with only "two of five companions" implies hardship and loss. Not (A) celebratory — too positive. Not (B) deeply critical — no hostile language. (D) indifferent — the detail of describing carefully suggests the author DOES care. (C) captures the nuanced tone: the author respects the explorer (sympathetic) but acknowledges loss (somber). Tone questions usually favor nuanced answers.',
      responseFormat: 'free',
      hints: [
        'Tone questions are about subtle author attitude — extremes are usually wrong.',
        'What feeling do "limping" and "two of five" evoke?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-extreme-answers',
      kind: 'misconception_check',
      question: 'A student picks "the author argues environmental policies are a complete disaster" because the author was critical. Why is this risky?',
      commonErrors: [
        {
          answer: 'Picks an extreme answer',
          misconception: 'Confusing degree of criticism with the strongest possible language.',
          correctsTo: 'Authors critical of policies usually use NUANCED language ("flawed," "inadequate," "needs revision") — not "complete disaster" unless the passage genuinely says so. Extreme answers (complete, never, always, total) are usually wrong on inference and tone questions. Match the language INTENSITY of the passage. If the author is "skeptical," pick "skeptical," not "hostile."',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pace: ~8.5 min/passage. 4 passages, fixed order.',
        'Try passage-first / questions-first / skim-and-reference; pick what works for YOU.',
        'Vocab-in-context = meaning HERE, not dictionary.',
        'Inference: supported but not stated; avoid extremes.',
        'Tone usually nuanced — match passage intensity.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
