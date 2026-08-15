/**
 * Grades K-2 ELA — Sequencing Events.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_ELA_SEQUENCING: LessonPlan = {
  id: 'evelyn.k2.ela.sequencing.v1',
  title: 'K-2 ELA — Sequencing Events',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ela',
  topic: 'k2-ela',
  locale: 'en',
  los: [
    {
      id: 'k2.ela.sequencing',
      description: 'Identify the order of events in a story; use signal words (first, next, then, finally) to retell.',
      standard: 'CCSS.ELA-LITERACY.RL.1.3',
    },
  ],
  prerequisites: ['k2.ela.main-idea-details'],
  followUps: ['k2.ela.compare-contrast'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Order matters — telling a story in the wrong order makes it confusing.',
      script: '"I ate my cookie. I baked the cookies. I mixed the dough." Wait — that\'s the wrong order! First mix, then bake, then eat. Stories make sense when events come in ORDER. Today we drill how to spot and tell the order.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-sequence',
      kind: 'concept',
      goal: 'Sequence + signal words + practical use.',
      keyIdeas: [
        'SEQUENCE: the ORDER of events. What happened first? Next? Last?',
        'SIGNAL WORDS clue you in: "first", "next", "then", "after that", "finally", "in the end".',
        'NUMBERS, dates, and times also signal sequence: "Monday morning...", "An hour later...", "First...Second...Third...".',
        'BEGINNING-MIDDLE-END structure naturally creates sequence.',
        'WHY ORDER MATTERS: events make sense in order; out of order, they confuse the reader.',
        'TO FIND SEQUENCE: ask "what happened first?", "what happened next?", "what was last?".',
        'RETELLING with signal words: "First Maya bought eggs. Then she cracked them in a bowl. Next she stirred them. Finally, she poured them in the pan."',
        'NOT EVERY story is told in order. Some use FLASHBACKS — telling a past event after a present one. Watch for time-shift signals.',
      ],
      vocabulary: [
        { term: 'sequence', definition: 'the order in which events happen.' },
        { term: 'signal word', definition: 'a word like "first", "then", or "finally" that tells the reader the order.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-sequence',
      kind: 'worked_example',
      problem: 'Put these events in order: "Maya ate breakfast. Maya woke up. Maya brushed her teeth. Maya left for school."',
      steps: [
        'Think about a normal morning: what comes first?',
        '1. Maya WOKE UP (you have to wake up first).',
        '2. Maya ATE breakfast.',
        '3. Maya BRUSHED her teeth.',
        '4. Maya LEFT for school.',
        'Now retell with signal words: "First Maya woke up. Next she ate breakfast. Then she brushed her teeth. Finally, she left for school."',
      ],
      answer: 'Wake up → eat breakfast → brush teeth → leave for school.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Put these events in order: "The cake was baked. The cake was eaten. The cake was mixed."',
      expectedAnswer: '1. mixed, 2. baked, 3. eaten.',
      responseFormat: 'free',
      hints: [
        'What do you do FIRST when making a cake?',
        'You can\'t eat it before it\'s baked!',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-text-order',
      kind: 'misconception_check',
      question: 'A child assumes the FIRST sentence in a story always describes the first event. Why might this be wrong sometimes?',
      commonErrors: [
        {
          answer: 'First sentence = first event',
          misconception: 'Confusing the order of TELLING with the order of HAPPENING.',
          correctsTo: 'Some stories START at the end and FLASHBACK to the beginning. Or start with a teaser ("She didn\'t expect what happened next") and then tell the events in order. The order events happen IN THE STORY is sometimes different from the order they happen IN TIME. Strong readers track both — what the text says first, AND what happened first in time.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sequence = order of events.',
        'Signal words: first, next, then, after, finally.',
        'Beginning-middle-end gives natural sequence.',
        'Some stories use flashbacks — order in TEXT differs from order in TIME.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a writer choose to tell events OUT OF ORDER?',
      hint: 'Hooking the reader. Starting with a dramatic moment ("the building was on fire") makes the reader curious. Then flashing back to "How did it get this way?" builds suspense. The reader knows the destination but wants the journey. Out-of-order storytelling is a craft choice — usually for emphasis or surprise.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
