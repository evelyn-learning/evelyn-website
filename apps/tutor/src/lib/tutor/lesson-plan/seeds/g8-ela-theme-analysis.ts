/**
 * G8 — Theme analysis: identifying and tracing themes in
 * literature.
 *
 * Theme = a universal idea, not topic. Tracing through events,
 * characters, symbols.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_ELA_THEME_ANALYSIS: LessonPlan = {
  id: 'evelyn.g8.ela.literary.theme-analysis.v1',
  title: 'Identifying and tracing themes in literature',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'ela',
  topic: 'literary-analysis',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.8.rl.2',
      description: 'Determine a theme or central idea of a text and analyze its development over the course of the text.',
      standard: 'CCSS.ELA-LITERACY.RL.8.2',
    },
  ],
  prerequisites: ['ccss.ela.6.rl.2'],
  followUps: ['ccss.ela.9-10.rl.2'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Distinguish topic from theme.',
      script: '"Friendship" is a TOPIC. "True friendship requires sacrifice" is a THEME. The topic is what the story\'s ABOUT; the theme is what the story SAYS about that topic. Today: how to find themes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-method',
      kind: 'concept',
      goal: 'Topic vs theme + how to identify and trace.',
      keyIdeas: [
        'TOPIC: a single word or phrase. Love, war, courage, family, identity.',
        'THEME: a complete sentence stating WHAT the story says about the topic. "War destroys both sides," "Love can be both a gift and a wound."',
        'A story usually has MULTIPLE themes — major and minor.',
        'TO IDENTIFY: 1) Notice what TOPICS keep appearing. 2) Look at what HAPPENS to characters who try certain approaches. 3) Watch for SYMBOLS that recur. 4) Notice the resolution — what idea does the ending support?',
        'TRACE through the work: a strong theme appears in MULTIPLE places — through different characters\' arcs, repeated motifs, key scenes.',
        'AVOID clichés: "love conquers all" or "good triumphs over evil" are surface-level. Push deeper — what specific take on the topic does THIS story make?',
        'A theme should be ARGUABLE — someone could disagree. "The character lives in a city" is a fact, not a theme.',
      ],
      vocabulary: [
        { term: 'theme', definition: 'a complete statement about a universal idea expressed by a text.' },
        { term: 'motif', definition: 'a repeated symbol, image, or idea that supports a theme.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-trace',
      kind: 'worked_example',
      problem: 'A novel has a character who values money above all relationships. They eventually become rich but lose all friends and family. What might be a theme?',
      steps: [
        'TOPIC: money / materialism / relationships.',
        'What HAPPENS to the character? Becomes rich BUT alone.',
        'What does that suggest? Money pursued single-mindedly costs more than it brings.',
        'THEME (sentence): "The pursuit of wealth at the expense of relationships leads to spiritual poverty even amid material success."',
        'TRACE: this theme would appear through specific scenes — friend turned away, daughter avoiding visits, narrator\'s cold dinners alone in big house.',
        'A weaker version: "Money isn\'t everything" (cliché). The strong version is specific to THIS story\'s argument.',
      ],
      answer: 'pursuing wealth alone leads to spiritual poverty (or similar specific framing)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a story where a quiet, modest character prevails over a loud, arrogant one, what theme might be developing?',
      expectedAnswer: 'student-specific (e.g., "humility outlasts pride" or "strength shown through quiet wisdom rather than loud bravado")',
      responseFormat: 'free',
      hints: [
        'Topic: humility/pride.',
        'What does the OUTCOME suggest the story is arguing?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-topic-as-theme',
      kind: 'misconception_check',
      question: 'Is "friendship" a theme?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating topics as themes.',
          correctsTo: 'No — "friendship" is a TOPIC. A theme is a SENTENCE stating what the story says about friendship: "True friendship requires sacrifice and patience" or "Friendship is more rewarding than romance for some characters." The verb form (full sentence) is the theme.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'TOPIC = single idea. THEME = complete sentence about that idea.',
        'Identify by tracing: events, character arcs, motifs, resolution.',
        'A theme should be ARGUABLE and SPECIFIC to the story.',
        'Avoid cliché summaries — push for the story\'s unique angle.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Pick a movie or book you know well. State its main theme as a complete sentence.',
      hint: 'Avoid "love wins". Try "Love can survive enormous obstacles when both people choose to fight for it" — specific to that story\'s actual argument.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
