/**
 * G10 — Rhetorical devices.
 *
 * Anaphora, parallelism, antithesis, hyperbole, rhetorical question,
 * ethos/pathos/logos. Recognize and analyze in speeches and texts.
 */

import type { LessonPlan } from '../types';

export const SEED_G10_ELA_RHETORICAL_DEVICES: LessonPlan = {
  id: 'evelyn.g10.ela.rhetoric.devices.v1',
  title: 'Rhetorical devices and how they persuade',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'ela',
  topic: 'rhetoric',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.9-10.ri.6',
      description: 'Determine an author\'s point of view and analyze how an author uses rhetoric to advance that point of view.',
      standard: 'CCSS.ELA-LITERACY.RI.9-10.6',
    },
  ],
  prerequisites: ['ccss.ela.7.ri.6'],
  followUps: ['ccss.ela.11-12.ri.6'],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a famous line to show how structure does the work.',
      script: '"I have a dream." Said once, it\'s a sentence. King said it EIGHT TIMES at the start of consecutive paragraphs. That\'s a rhetorical device called anaphora — and it\'s why we still feel that speech.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-devices',
      kind: 'concept',
      goal: 'Six common devices and the three appeals of rhetoric.',
      keyIdeas: [
        'ANAPHORA: repeating a word/phrase at the start of consecutive lines or sentences. ("We shall fight on the beaches, we shall fight on the landing grounds…" — Churchill).',
        'PARALLELISM: using the same grammatical structure in a list. ("of the people, by the people, for the people").',
        'ANTITHESIS: pairing opposite ideas in balanced structure. ("Ask not what your country can do for you — ask what you can do for your country").',
        'HYPERBOLE: deliberate exaggeration for effect. ("I\'ve told you a million times").',
        'RHETORICAL QUESTION: a question asked for effect, not for an answer. ("How long must we wait?").',
        'ETHOS, PATHOS, LOGOS — the three appeals: ETHOS (credibility/authority), PATHOS (emotion), LOGOS (logic/evidence). Effective speakers blend all three.',
      ],
      vocabulary: [
        { term: 'rhetoric', definition: 'the art of using language to persuade.' },
        { term: 'anaphora', definition: 'repetition of a word or phrase at the start of successive clauses.' },
        { term: 'ethos', definition: 'rhetorical appeal based on speaker\'s credibility.' },
        { term: 'pathos', definition: 'rhetorical appeal to the audience\'s emotions.' },
        { term: 'logos', definition: 'rhetorical appeal to logic and evidence.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mlk',
      kind: 'worked_example',
      problem: 'In MLK\'s "I Have a Dream" speech: "I have a dream that one day this nation will rise up. I have a dream that my four little children will one day live in a nation…" What device, and what\'s its effect?',
      steps: [
        'Identify the device: same phrase "I have a dream that…" starts each sentence. That\'s ANAPHORA.',
        'Effect: builds rhythm, creates emotional momentum, ties many specific dreams into one bigger vision.',
        'Also tied to PATHOS — the rhythm hits the audience emotionally before the logic.',
        'AND ETHOS — King\'s position as a Baptist minister means his dream feels prophetic, not just personal.',
      ],
      answer: 'anaphora — builds rhythm and emotional momentum',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the device: "It was the best of times, it was the worst of times." — Charles Dickens.',
      expectedAnswer: 'antithesis (also parallelism)',
      responseFormat: 'free',
      hints: [
        'Two opposing ideas in balanced grammar.',
        '"Best" vs "worst" — opposites paired together.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pathos-bad',
      kind: 'misconception_check',
      question: 'Is using PATHOS (emotion) to persuade a "cheap trick" — bad rhetoric?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating emotional appeal as inherently dishonest.',
          correctsTo: 'No — pathos is a legitimate part of rhetoric. The issue is when pathos REPLACES logos and ethos, manipulating instead of persuading. Lincoln\'s Gettysburg Address is heavy on pathos AND deeply ethical.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Anaphora = repeated start. Parallelism = same structure. Antithesis = balanced opposites.',
        'Hyperbole = exaggeration. Rhetorical question = no answer expected.',
        'Three appeals: ETHOS (credibility), PATHOS (emotion), LOGOS (logic).',
        'Great rhetoric blends devices and all three appeals.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Pick a modern speech (commencement, political, advertising) and identify TWO devices used. What was each one\'s effect?',
      hint: 'Almost every memorable speech uses anaphora or parallelism. Listen for repeated structures.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
