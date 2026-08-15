/**
 * Grades 9-12 ELA — Short Story Craft.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_SHORT_STORY_CRAFT: LessonPlan = {
  id: 'evelyn.g912.ela.short-story-craft.v1',
  title: 'Grades 9-12 ELA — Short Story Craft',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.short-story-craft',
      description: 'Analyse the craft of short stories: compression, structure, voice, ambiguity, ending strategies.',
      standard: 'CCSS.ELA-LITERACY.RL.11-12.5',
    },
  ],
  prerequisites: ['g912.ela.poetry-analysis'],
  followUps: ['g912.ela.genre-comparison'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A great short story does in 10 pages what a novel takes 300 to do — through compression and craft.',
      script: 'Carver, Hemingway, Munro, Adichie, O\'Connor — masters of the short story. The form rewards economy and precision. Every word must earn its place. Today we drill the techniques that distinguish great short fiction.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-shortstory',
      kind: 'concept',
      goal: 'Compression + structure + iceberg theory + ending types.',
      keyIdeas: [
        'COMPRESSION: short stories operate on small canvas. Often a single moment, single character, single conflict.',
        'STRUCTURE OPTIONS: linear (start to end), in medias res (start mid-action), frame (story within story), epiphany (moment of realisation).',
        'ICEBERG THEORY (Hemingway): show only 10% of the story\'s emotional truth on the surface; the other 90% lurks beneath. The reader feels what isn\'t said.',
        'VOICE & POV: choose deliberately. Short story\'s tight scope makes voice carry weight.',
        'SCENE OVER SUMMARY: short stories often consist of one or two scenes, with minimal summary.',
        'AMBIGUITY: many great short stories end without resolution. The reader is left to weigh meaning.',
        'EPIPHANY ENDING (Joyce): a moment of realisation, often quiet rather than dramatic. The character (and reader) sees something newly.',
        'TWIST ENDING: subverts expectations. Risky — can feel cheap if not earned.',
        'OPEN ENDING: ambiguous resolution. The reader fills in the rest.',
        'OPENINGS that work: in medias res, a striking image, a voice that surprises, a question.',
        'REVISION: short stories are revised obsessively. Each word gets weighed.',
      ],
      vocabulary: [
        { term: 'epiphany', definition: 'a moment of sudden insight or realisation, often the climax of a short story.' },
        { term: 'iceberg theory', definition: 'Hemingway\'s idea that a story should show only a fraction of its emotional truth, with the rest implied.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-iceberg',
      kind: 'worked_example',
      problem: 'Apply iceberg theory: take this dialogue and identify the 90% beneath the 10% spoken.',
      steps: [
        'Dialogue: "\'Are you cold?\' he asked. \'No,\' she said. \'I\'m fine.\'"',
        '10% on surface: a question and answer about temperature.',
        '90% beneath: tension between them. Why is she saying "fine" instead of acknowledging cold? Pride? Anger? A wall between them? She might be cold but unwilling to ask for warmth from HIM specifically.',
        'CRAFT MOVE: by NOT saying what\'s really happening, the writer makes the reader feel the unspoken weight. The reader fills in.',
        'EFFECT: more powerful than "She was cold but didn\'t want to admit it because she was angry at him." Restraint > exposition.',
      ],
      answer: 'Surface: temperature. Below: relational tension, restraint, pride.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why might a short story END without resolving the conflict?',
      expectedAnswer: 'To force the reader to participate in meaning-making. To preserve ambiguity that mirrors real life. To leave the character\'s growth unresolved (because real growth often is). To privilege understanding over plot.',
      responseFormat: 'free',
      hints: [
        'What does AMBIGUITY do for the reader?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-twist-required',
      kind: 'misconception_check',
      question: 'A student believes every short story needs a twist ending. Why is this an over-generalisation?',
      commonErrors: [
        {
          answer: 'Twist ending required',
          misconception: 'Confusing a popular ending type with a universal requirement.',
          correctsTo: 'Many great short stories end QUIETLY — with epiphany, ambiguity, or simply a return to the everyday. Joyce\'s "The Dead", Hemingway\'s "Hills Like White Elephants" — neither has a "twist". Forcing twists onto every story produces gimmicky writing. The ending should serve the story\'s emotional truth. Sometimes that\'s a twist; usually it\'s not.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Compression, single arc, voice carry weight.',
        'Iceberg theory: show 10%, imply 90%.',
        'Endings: epiphany, twist, open. Ambiguity is a feature.',
        'Scene over summary.',
        'Each word earns its place.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is reading a short story different from reading a novel?',
      hint: 'Pace and attention. Short stories demand close, slow reading — every detail may matter. Novels allow looser engagement; short stories don\'t. Re-reading a short story often reveals patterns missed the first time. Read short stories more like poems than like prose: every line carries weight.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
