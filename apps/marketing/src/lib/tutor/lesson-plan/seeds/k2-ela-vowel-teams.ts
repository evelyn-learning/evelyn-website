/**
 * Grades K-2 ELA — Vowel Teams (Long Vowels).
 */

import type { LessonPlan } from '../types';

export const SEED_K2_ELA_VOWEL_TEAMS: LessonPlan = {
  id: 'evelyn.k2.ela.vowel-teams.v1',
  title: 'K-2 ELA — Vowel Teams',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ela',
  topic: 'k2-ela',
  locale: 'en',
  los: [
    {
      id: 'k2.ela.vowel-teams',
      description: 'Recognise common vowel teams (ai, ay, ee, ea, oa, ow) that make long vowel sounds; decode words containing them.',
      standard: 'CCSS.ELA-LITERACY.RF.1.3',
    },
  ],
  prerequisites: ['k2.ela.cvc-decoding'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Once kids learn vowel teams, hundreds of new words become readable.',
      script: 'You know "rain"? It has FOUR letters but only THREE sounds. The "ai" works as a TEAM to say long /ā/ — the vowel\'s NAME. Today we learn the most common vowel teams.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-vowel-teams',
      kind: 'concept',
      goal: 'Common vowel teams + long-vowel patterns.',
      keyIdeas: [
        'VOWEL TEAM: two vowels working together to make ONE sound. Usually a long vowel (the vowel says its name).',
        'AI / AY for long /ā/: rain, train, day, play, say, way.',
        'EE / EA for long /ē/: tree, see, week, eat, beach, read.',
        'OA / OW for long /ō/: boat, coat, road, slow, snow, blow.',
        'IGH / IE for long /ī/: night, light, pie, tie.',
        'OO can make TWO sounds: /oo/ as in "moon", /oo/ as in "book". Watch context.',
        'WHEN TWO VOWELS GO WALKING saying: "the first one does the talking and says its name". (Memorable rule that works for ai, ee, oa.)',
        'COMPARE: cat (CVC, short a) vs rain (vowel team, long a). The team CHANGES the vowel sound.',
        'PRACTICE WORDS: rain, sail, day, see, feet, eat, road, boat, low, snow.',
      ],
      vocabulary: [
        { term: 'vowel team', definition: 'two vowels working together as one sound, like "ai" in rain.' },
        { term: 'long vowel', definition: 'a vowel saying its name, like /ā/ in cake.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-vt',
      kind: 'worked_example',
      problem: 'Decode the word "boat".',
      steps: [
        'Look at the letters: b-o-a-t. Four letters.',
        'Find the vowel team: "oa". This works together to make ONE sound — long /ō/ (the o says its name).',
        'Sound 1: /b/. Sound 2 (the team): /ō/. Sound 3: /t/.',
        'Blend: /b/ + /ō/ + /t/ = "boat".',
        'Notice — only 3 sounds even though 4 letters!',
      ],
      answer: 'boat',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Decode the word "feet".',
      expectedAnswer: 'feet',
      responseFormat: 'free',
      hints: [
        'Vowel team "ee" makes long /ē/.',
        '/f/ + /ē/ + /t/.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-each-letter',
      kind: 'misconception_check',
      question: 'A child reads "rain" as "ra-in" — saying both vowels separately. What went wrong?',
      commonErrors: [
        {
          answer: 'Saying both vowels separately',
          misconception: 'Treating each letter as a separate sound, even when two vowels are a team.',
          correctsTo: 'When two vowels touch (ai, ee, oa, ow, etc.), they often work as a TEAM = one sound. /r/ + /ā/ + /n/ = "rain", not "ra-in". Recognising vowel teams is a major reading milestone — it lets you read longer words correctly.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Vowel team = two vowels making one sound, usually long.',
        'ai, ay = long /ā/ (rain, day).',
        'ee, ea = long /ē/ (see, eat).',
        'oa, ow = long /ō/ (boat, snow).',
        'igh = long /ī/ (light).',
        'When two vowels go walking, the first does the talking.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do you think English has so many vowel team patterns instead of just one way to spell each long vowel?',
      hint: 'English borrowed words from many languages (Latin, French, German, Old English) over centuries. Each language brought its own spelling habits. So we have "rain" from one source and "vein" (long /ā/) from another, "sleigh" (long /ā/) from yet another. The variety is messy but reflects real history. Once you know the common teams, the messy bits become memorable.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
