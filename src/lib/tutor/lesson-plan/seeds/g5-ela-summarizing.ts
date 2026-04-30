/**
 * G5 — ELA: Summarizing fiction and nonfiction.
 *
 * Capturing what a text said in your OWN words and far fewer of
 * them. SWBST for fiction (Somebody-Wanted-But-So-Then) and the
 * "main ideas only, no opinions" rule for nonfiction. The four
 * cardinal sins of bad summaries — too long, copied, opinionated,
 * out of order — are the focus of the misconception check.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_ELA_SUMMARIZING: LessonPlan = {
  id: 'evelyn.g5.ela.summarizing.v1',
  title: 'Summarizing Fiction and Nonfiction',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'ela',
  topic: 'reading-comprehension',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.rl.5.2',
      description: 'Determine a theme; summarize the text.',
      standard: 'CCSS.ELA-LITERACY.RL.5.2',
    },
    {
      id: 'ccss.ela.ri.5.2',
      description: 'Determine two or more main ideas of a text and explain how they are supported.',
      standard: 'CCSS.ELA-LITERACY.RI.5.2',
    },
  ],
  prerequisites: ['ccss.ela.ri.3.2'],
  followUps: ['ccss.ela.rl.6.2'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame summary as the elevator-pitch version of a text.',
      script: 'Imagine a friend asks "what was that book about?" — and they\'ve got 30 seconds. You can\'t recite the whole book. You hit the BIG events, in your own words, in order. That\'s a summary, and the trick is knowing what to leave OUT.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-summary',
      kind: 'concept',
      goal: 'Fiction: SWBST. Nonfiction: main ideas, no opinions. General rules: short, own words, ordered, neutral.',
      keyIdeas: [
        'A SUMMARY is a short version of a text in YOUR OWN words.',
        'Four rules of a good summary:',
        '  SHORT — only the big stuff, not every detail.',
        '  YOUR WORDS — paraphrase, don\'t copy sentences.',
        '  IN ORDER — events in the order they happened.',
        '  NEUTRAL — what the text said, NOT your opinion of it.',
        'For FICTION: use SWBST.',
        '  SOMEBODY (the main character)',
        '  WANTED (their goal)',
        '  BUT (the problem)',
        '  SO (what they did)',
        '  THEN (how it ended).',
        'For NONFICTION: identify the main idea(s), then list the key supporting ideas. Skip examples and side details.',
        'Test: would your summary make sense to someone who hasn\'t read the text?',
      ],
      vocabulary: [
        { term: 'summary', definition: 'a short retelling of a text in your own words.' },
        { term: 'paraphrase', definition: 'to say something in different words while keeping the meaning.' },
        { term: 'SWBST', definition: 'Somebody-Wanted-But-So-Then — a five-part frame for fiction summaries.' },
      ],
      suggestedTools: ['show_concept_map', 'show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-fiction-swbst',
      kind: 'worked_example',
      problem: 'Use SWBST to summarize "Cinderella".',
      steps: [
        'Somebody: Cinderella.',
        'Wanted: to go to the ball.',
        'But: her stepmother and stepsisters wouldn\'t let her, and she had no dress.',
        'So: a fairy godmother helped her with magic — dress, carriage, glass slippers — but only until midnight.',
        'Then: she met the prince, lost a slipper running home at midnight; the prince used it to find her, and they got married.',
        'Together: "Cinderella wanted to go to the ball but was forbidden, so a fairy godmother helped her, and she met a prince who later found her and married her."',
      ],
      answer: 'See SWBST breakdown above',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-nonfiction',
      kind: 'worked_example',
      problem: 'Summarize this nonfiction passage: "Honeybees live in colonies of up to 60,000 bees. Each colony has one queen, who lays all the eggs. Worker bees, all female, gather nectar and care for the young. Drone bees are male and exist only to mate with the queen. The queen can live for several years; workers, only a few weeks."',
      steps: [
        'Find the main idea: how a honeybee colony is organized.',
        'List supporting ideas: queen lays eggs, workers gather and care, drones mate. Lifespans differ.',
        'In your own words, in order, neutral: "Honeybee colonies have up to 60,000 bees split into three roles: a queen who lays eggs, female workers who gather food and care for young, and male drones who only mate with the queen. Queens live years; workers only weeks."',
      ],
      answer: 'See model summary above',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Use SWBST to summarize "The Three Little Pigs".',
      expectedAnswer: 'Pigs (S) wanted to be safe (W) but a wolf wanted to eat them (B), so they built houses (S), and the third pig\'s brick house saved them (T).',
      responseFormat: 'free',
      hints: [
        'Somebody: the three pigs.',
        'Wanted: shelter / safety.',
        'But: the wolf wanted to eat them.',
        'So: they built different kinds of houses.',
        'Then: only the brick house held up.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-opinion',
      kind: 'misconception_check',
      question: 'Owen summarizes a story by saying "First, the boy met a wolf, which was super scary. Then they fought, which was the best part." What\'s wrong?',
      commonErrors: [
        {
          answer: 'nothing',
          misconception: 'Adding personal opinions ("super scary", "best part") to what should be a neutral summary.',
          correctsTo: 'A summary should be NEUTRAL — just what the text said. Owen\'s "super scary" and "best part" are HIS opinions, not facts from the story. Strip those out: "The boy met a wolf, then they fought."',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Summary rules: short, own words, in order, neutral.',
        'Fiction: SWBST (Somebody-Wanted-But-So-Then).',
        'Nonfiction: main ideas + key supporting ideas, skip examples.',
        'No opinions in a summary.',
        'Test: would someone who hadn\'t read it understand?',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Summarize a chapter from a book you\'re reading. How long is the chapter, and how long is your summary? Aim for under 1/4 the original.',
      hint: 'If your summary is more than a quarter of the text, you\'re including too many details.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
