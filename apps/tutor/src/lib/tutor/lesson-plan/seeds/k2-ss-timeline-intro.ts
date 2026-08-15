/**
 * Grades K-2 Social Studies — Past, Present, Future (Timeline Intro).
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SS_TIMELINE_INTRO: LessonPlan = {
  id: 'evelyn.k2.ss.timeline-intro.v1',
  title: 'K-2 SS — Past, Present, Future',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ss',
  topic: 'k2-ss',
  locale: 'en',
  los: [
    {
      id: 'k2.ss.timeline-intro',
      description: 'Distinguish past, present, and future; place events on a simple timeline.',
      standard: 'NCSS K-2 Time, Continuity, Change',
    },
  ],
  prerequisites: ['k2.ss.rules-laws'],
  followUps: ['k2.ss.holidays-traditions'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Time has three big parts — past, present, future. Knowing them helps you understand stories AND your own life.',
      script: 'When you were a baby, that was the PAST. Right now, you\'re in school — that\'s the PRESENT. When you grow up, that\'s the FUTURE. Past, present, future. Three parts of a timeline.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-timeline',
      kind: 'concept',
      goal: 'Three time periods + signal words + simple timelines.',
      keyIdeas: [
        'PAST: things that ALREADY HAPPENED. "Yesterday", "last year", "long ago", "when I was 3".',
        'PRESENT: what is happening NOW. "Right now", "today", "this morning".',
        'FUTURE: things that WILL HAPPEN. "Tomorrow", "next year", "when I grow up", "later".',
        'TIMELINE: a line showing events in order from past to future.',
        'On a timeline, OLDER events go on the LEFT, NEWER on the RIGHT.',
        'SIGNAL WORDS for past: "was", "did", "yesterday", "ago".',
        'SIGNAL WORDS for present: "is", "do", "now", "today".',
        'SIGNAL WORDS for future: "will", "shall", "tomorrow", "later".',
        'Stories often jump between time periods — listen for the signals.',
        'PERSONAL TIMELINE: birth → first day of school → today → graduation → grown-up.',
      ],
      vocabulary: [
        { term: 'past', definition: 'time that has already happened.' },
        { term: 'present', definition: 'time happening right now.' },
        { term: 'future', definition: 'time that has not happened yet.' },
        { term: 'timeline', definition: 'a line showing events in the order they happened.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-timeline',
      kind: 'worked_example',
      problem: 'Place these in order on a timeline: "I will go to college", "I am 7 years old now", "I was born".',
      steps: [
        'Earliest: "I was born" (PAST — happened first).',
        'Middle: "I am 7 years old now" (PRESENT).',
        'Latest: "I will go to college" (FUTURE).',
        'Timeline (left to right): born → age 7 → college.',
      ],
      answer: 'born → 7 years old → college.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Is "I went to the zoo yesterday" past, present, or future?',
      expectedAnswer: 'Past — "yesterday" and "went" both signal past.',
      responseFormat: 'free',
      hints: [
        'Look at "yesterday" and "went".',
        'Did it happen already?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-near-past',
      kind: 'misconception_check',
      question: 'A child says "yesterday" is the present because it just happened. Correct?',
      commonErrors: [
        {
          answer: 'Yesterday = present',
          misconception: 'Treating recent past as if it\'s still happening.',
          correctsTo: 'YESTERDAY is PAST — even if it was only a few hours ago. PAST means "before now". The past can be 5 minutes ago or 100 years ago — both are past. The PRESENT is only RIGHT NOW. Words like "yesterday", "last week", "this morning before now" are all past.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Past = before now. Present = now. Future = later.',
        'Signal words: was/yesterday (past), is/now (present), will/tomorrow (future).',
        'Timelines go left to right: past → future.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Can the same event be in the past for one person AND the future for another?',
      hint: 'Yes! Walking on the moon is in the past for adults today (it happened in 1969). For your great-grandchildren, it will still be in the past. But for someone living in 1900, it would have been in the FUTURE. The past and future depend on WHEN you are. The present moves forward like a wave; old future becomes present, then past.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
