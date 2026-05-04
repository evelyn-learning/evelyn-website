/**
 * Grades 3-5 ELA — Theme Identification.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_THEME: LessonPlan = {
  id: 'evelyn.g35.ela.theme.v1',
  title: 'Grades 3-5 ELA — Theme Identification',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.theme',
      description: 'Identify the theme (overall message or lesson) of a story; distinguish theme from topic and plot summary.',
      standard: 'CCSS.ELA-LITERACY.RL.4.2',
    },
  ],
  prerequisites: ['g35.ela.context-clues'],
  followUps: ['g35.ela.inference-evidence'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Theme is the BIG idea of a story — the lesson the author wants you to take away.',
      script: 'Two stories about a tortoise racing a hare. Same plot. But the theme might be "slow and steady wins the race" — that\'s a lesson, not a summary. Today we learn to dig for the theme behind the plot.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-theme',
      kind: 'concept',
      goal: 'Theme vs topic vs plot + how to find theme.',
      keyIdeas: [
        'TOPIC: what the story is ABOUT (one or two words). Friendship. Courage. Loss.',
        'THEME: a complete IDEA the author conveys ABOUT the topic (a sentence). "True friendship requires honesty." "Courage means acting despite fear."',
        'PLOT: the events that happen. Different from theme — plot is the WHAT, theme is the SO WHAT.',
        'TO FIND THEME: ask 1) What does the main character LEARN? 2) How does the main character CHANGE? 3) What message does the author want me to take away?',
        'THEME IS USUALLY UNIVERSAL — applies to readers, not just to one story\'s characters.',
        'NOT every story has a single theme. Some have multiple. Identify what evidence supports each.',
        'WORDS TO AVOID in theme statements: character names ("Charlotte teaches us...") — those are SUMMARY, not theme. Use general terms.',
        'EVIDENCE: theme should be supported by SPECIFIC EVENTS in the text. If you can\'t point to a scene that supports your theme, refine it.',
      ],
      vocabulary: [
        { term: 'theme', definition: 'the overall lesson or message about life that an author conveys through a story.' },
        { term: 'topic', definition: 'a brief subject of a story (one or two words); broader and less specific than theme.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-theme',
      kind: 'worked_example',
      problem: 'In "Charlotte\'s Web", a spider named Charlotte saves a pig named Wilbur from being slaughtered by writing words about him in her web. What is the theme?',
      steps: [
        'Topic: friendship (one possible topic).',
        'Plot summary: a spider helps a pig by writing in her web.',
        'What does Wilbur LEARN? That a true friend will sacrifice for him.',
        'What does Charlotte show? Even small creatures can change the world by being a good friend.',
        'Theme statement: "True friendship can transform lives, even at great personal cost."',
        'Avoid: "Charlotte saves Wilbur" — that\'s plot. "Friendship" alone — that\'s topic. The full sentence with universal application is the theme.',
      ],
      answer: 'Sample theme: "True friendship can transform lives, even at great personal cost."',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a story where a young boy returns a wallet full of money he found, what might the theme be?',
      expectedAnswer: 'Honesty matters more than personal gain. (Or: Doing the right thing brings inner reward.)',
      responseFormat: 'free',
      hints: [
        'What did the boy LEARN or SHOW?',
        'What lesson would a reader take away?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-summary',
      kind: 'misconception_check',
      question: 'Asked for the theme of a story about a girl who saves a stray dog, a student writes "A girl finds a stray dog and brings it home." Why isn\'t this the theme?',
      commonErrors: [
        {
          answer: 'A girl finds a stray dog and brings it home',
          misconception: 'Confusing summary (specific to this story\'s characters and plot) with theme (general lesson).',
          correctsTo: 'That sentence describes WHAT happened — that\'s a summary. The THEME is the universal idea: e.g. "Compassion for those in need can come from anyone, regardless of age," or "Small acts of kindness make a big difference." A theme should apply beyond this specific story — apply to the reader\'s own life, even.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Topic: 1-2 words. Theme: full sentence with a lesson.',
        'Theme is universal — applies beyond the story.',
        'Test: what did the main character LEARN? How did they CHANGE?',
        'Avoid character names in theme statements.',
        'Always cite text evidence supporting the theme.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In "The Tortoise and the Hare", state the theme and the supporting evidence.',
      hint: 'Theme: "Steady, consistent effort beats raw talent without discipline." Evidence: the hare is faster (talent) but stops to nap (no discipline). The tortoise is slower (less talent) but never stops (discipline). The tortoise wins. The story\'s outcome demonstrates the theme.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
