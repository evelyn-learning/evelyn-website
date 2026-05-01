/**
 * LSAT — Reading Comprehension.
 *
 * One scored RC section (35 min, 4 passages, ~26-28 questions). The
 * variable section may also be RC, so the typical test has ~7 passages.
 * Includes "Comparative Reading" passage pairs.
 */

import type { LessonPlan } from '../types';

export const SEED_LSAT_READING_COMPREHENSION: LessonPlan = {
  id: 'evelyn.testprep.lsat.reading-comprehension.v1',
  title: 'LSAT Reading Comprehension: Passage Types and Strategy',
  curriculum: 'LSAC',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'lsat',
  locale: 'en',
  los: [
    {
      id: 'lsat.reading-comprehension',
      description: 'Read LSAT-style passages efficiently, identify passage structure, and answer the major RC question types (main point, primary purpose, structure, inference, attitude/tone, application, comparative reading).',
      standard: 'LSAT-RC',
    },
  ],
  prerequisites: ['lsat.format-2024'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'RC tests legal-style reading: dense, argumentative, structurally precise.',
      script: 'LSAT Reading Comprehension is the LSAT acting most like law school. You get four 400-500 word passages from law, science, humanities, and social science. The questions don\'t reward facts — they reward STRUCTURE recognition. Where\'s the main claim? What\'s the author\'s attitude? How does paragraph 3 relate to paragraph 1? If you can chart the passage\'s anatomy in your head as you read, the questions feel almost mechanical.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Section structure, passage types, question types.',
      keyIdeas: [
        'SECTION FORMAT: 35 minutes, 4 passages, ~26-28 questions total. ~6-8 questions per passage.',
        'PASSAGE TOPICS: law, science, humanities (literature / arts), social science. Topic familiarity helps but isn\'t essential — focus on STRUCTURE.',
        'COMPARATIVE READING: ONE of the four passages is a PAIR of two shorter related passages, written by different authors. Questions ask about agreement, disagreement, scope, attitudes between the two.',
        'PASSAGE STRUCTURE TYPES: thesis-and-defense (claim + supporting argument), debate / refutation (one view + counterview + author\'s position), exposition (descriptive, less argumentative), comparison-contrast (two phenomena set against each other).',
        'QUESTION TYPES: MAIN POINT (the central claim), PRIMARY PURPOSE (why was this written?), AUTHOR\'S ATTITUDE / TONE (sympathetic, skeptical, neutral, ambivalent), INFERENCE (what does the passage support?), STRUCTURE / FUNCTION (what role does paragraph X play?), DETAIL (find a specific fact), APPLICATION (apply the passage\'s framework to a new case), STRENGTHEN/WEAKEN (rare but possible — like LR but tied to passage).',
        'COMPARATIVE READING question types: AGREE / DISAGREE (what would both authors agree about?), SCOPE comparison (which passage covers more terrain?), RELATION (does B build on A, refute A, ignore A?).',
        'PACING: ~8.5 minutes per passage including question time. Spend 3-4 minutes reading the passage, ~1 minute per question.',
      ],
      vocabulary: [
        { term: 'comparative reading', definition: 'an LSAT RC item where two short passages are paired and questions probe their relationship.' },
        { term: 'primary purpose', definition: 'the author\'s overall goal in writing the passage — to argue, describe, refute, evaluate, etc.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Active reading + passage map.',
      keyIdeas: [
        'READ ACTIVELY: as you read, mentally tag each paragraph by FUNCTION. Paragraph 1 introduces. Paragraph 2 explains the standard view. Paragraph 3 raises an objection. Paragraph 4 gives the author\'s position. The TAGS are what you\'ll need on questions.',
        'MARK SHIFTS: words like "however", "yet", "nevertheless", "in contrast" signal STRUCTURAL turns. Most questions hinge on these.',
        'IDENTIFY THE AUTHOR\'S ATTITUDE early. Look for evaluative language — "remarkably", "questionably", "rightly", "fails to". Most passages have an author with a stance, even if subtle.',
        'DISTINCTION: AUTHOR\'S VIEW vs OTHERS\' VIEWS. The passage may describe a view the author disagrees with — be precise about whose view it is when answering.',
        'FOR DETAIL questions, return to the passage. Don\'t answer from memory. Use the line references.',
        'FOR INFERENCE questions, the right answer is what MUST follow from the passage — not what\'s plausible in the world. Stay close to the text.',
        'COMPARATIVE READING tip: read both passages before any questions. Then ask yourself: same topic? same conclusion? same approach? Note where they diverge.',
      ],
      vocabulary: [
        { term: 'passage map', definition: 'a mental or written outline of paragraph functions — intro, evidence, counterargument, etc.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A passage opens by describing a long-standing legal doctrine, then in paragraph 2 quotes a recent dissenting opinion. Paragraph 3 evaluates the dissent. The question asks: "Which best states the primary purpose of the passage?" What\'s your strategy?',
      expectedAnswer: 'Look at the OVERALL STRUCTURE: introduce doctrine → present challenge → evaluate challenge. Primary purpose options likely include "to evaluate a recent challenge to a long-standing doctrine" or "to assess a critique of an established legal principle". Eliminate choices that mention only the doctrine (paragraph 1) or only the dissent (paragraph 2) — the primary purpose must reflect the WHOLE passage, including the evaluation in paragraph 3.',
      responseFormat: 'free',
      hints: [
        'Primary purpose = what is the author DOING across the WHOLE passage?',
        'The structure tells you: doctrine + challenge + evaluation = "to evaluate a challenge".',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-deep-read',
      kind: 'misconception_check',
      question: 'You should read each LSAT passage 2-3 times to fully understand it before tackling questions. True or false?',
      commonErrors: [
        {
          answer: 'true — careful reading wins',
          misconception: 'Confusing thoroughness with efficiency.',
          correctsTo: 'False. You have ~3-4 minutes for the passage and ~1 minute per question. Reading twice burns 6-8 minutes you don\'t have. Better strategy: ONE active read with mental tagging of paragraph functions, then return to specific lines as questions demand. Detail questions tell you which lines matter; you don\'t need pre-cached recall of the whole passage. Multiple reads is the #1 cause of missed RC questions due to time pressure.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '4 passages in 35 min. ~26-28 questions. One passage is comparative-reading (paired).',
        'Read for STRUCTURE (paragraph functions), not facts. Mark shifts and attitudes.',
        'Distinguish author\'s view from others\' views the passage describes.',
        'One active read, then return to lines as needed. Don\'t deep-read multiple times.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the LSAT include a Comparative Reading passage instead of four standalone passages?',
      hint: 'Legal practice constantly involves SYNTHESIS — comparing two cases, two precedents, two legal scholars. Comparative Reading directly tests whether you can hold two arguments simultaneously and identify their relationship (agree / disagree / scope / approach). It\'s the closest item to actual law-school casebook reading. Without it, RC would only test single-source comprehension, which is necessary but not sufficient for legal analysis.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
