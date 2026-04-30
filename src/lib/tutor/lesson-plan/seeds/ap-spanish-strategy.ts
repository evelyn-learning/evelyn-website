/**
 * AP Spanish Language and Culture — exam strategy.
 *
 * Format, sections, listening/reading/speaking/writing prep tips.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_SPANISH_STRATEGY: LessonPlan = {
  id: 'evelyn.ap.spanish.strategy.v1',
  title: 'AP Spanish Language exam strategy',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'apspanish.strategy',
      description: 'Apply effective strategy to AP Spanish Language exam sections.',
      standard: 'AP-SPAN-LANG',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'AP Spanish tests COMMUNICATION across all four skills.',
      script: 'AP Spanish isn\'t about memorizing vocab and grammar drills. It\'s about COMMUNICATING — listening to Spanish-speakers, reading authentic texts, writing essays, speaking spontaneously. Strategy spans all four skills.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Format + section strategies + cultural knowledge.',
      keyIdeas: [
        'FORMAT: ~3 hours total. Multiple choice (interpretive listening + reading) and free-response (writing + speaking).',
        'INTERPRETIVE LISTENING: audio passages (interviews, news, podcasts) followed by MC. Strategy: listen for MAIN IDEA first, then specifics. Don\'t panic at unfamiliar words — context.',
        'INTERPRETIVE READING: authentic texts from Spanish-speaking world (newspapers, fiction, ads, charts). Same skill — skim for main idea, then detail.',
        'INTERPERSONAL WRITING: respond to an EMAIL in formal Spanish (~15 min). Use proper register (usted), greet/close formally, address all questions, fit cultural context.',
        'PRESENTATIONAL WRITING: persuasive essay synthesizing 3 sources (article + chart + audio). 40 min. Take a position, integrate sources by name, organize logically.',
        'INTERPERSONAL SPEAKING: simulated conversation, 5 prompts, 20 sec each. Respond like a real conversation — react to what was said, not just read prepared answers.',
        'PRESENTATIONAL SPEAKING: cultural comparison. 4 min. Compare a feature of your community to one in a Spanish-speaking community.',
        'CULTURAL KNOWLEDGE: themes like family, identity, science, technology, environment. Spend prep time learning about Spanish-speaking countries, NOT just grammar.',
        'SCORING: 1-5. Most universities accept 4 for credit; some take 3.',
      ],
      vocabulary: [
        { term: 'interpretive', definition: 'understanding spoken or written language (one-way input).' },
        { term: 'presentational', definition: 'producing language for an audience (writing or speaking).' },
        { term: 'register', definition: 'level of formality in language use.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-essay',
      kind: 'worked_example',
      problem: 'For the persuasive essay: how to integrate the THREE SOURCES effectively.',
      steps: [
        'Read all three sources before writing.',
        'Take a clear position (sí/no/depende, with reasoning).',
        'Each body paragraph cites a source by name: "Según la fuente número 1, ...".',
        'Don\'t just summarize sources — USE them to support YOUR argument.',
        'Sources may agree or disagree — engaging with the disagreement shows sophistication.',
        'Vocabulary: use connectors (sin embargo, además, por otro lado, en cambio).',
        'Conclusion: synthesize.',
        'Time: ~5 min planning, ~30 min writing, ~5 min review.',
      ],
      answer: 'cite all 3 sources by name, engaging with their evidence to support YOUR claim',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does AP Spanish reward CULTURAL knowledge alongside language skill?',
      expectedAnswer: 'language is embedded in culture; tasks include cultural comparison; sophisticated communication requires cultural awareness',
      responseFormat: 'free',
      hints: [
        'Speaking Spanish across cultures requires knowing those cultures.',
        'Several tasks specifically test cultural understanding.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-grammar-only',
      kind: 'misconception_check',
      question: 'Should AP Spanish prep focus mostly on memorizing grammar rules?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Grammar-only approach.',
          correctsTo: 'No — graders reward COMMUNICATION over perfect grammar. A few grammar errors are fine if your message is clear and culturally appropriate. Focus on: rich vocabulary, varied sentence structures, fluent flow, cultural understanding. Communicate first; perfection is optional.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '4 skills tested: interpretive listening + reading, interpersonal writing + speaking, presentational writing + speaking.',
        'Communication > perfect grammar.',
        'For email: formal register (usted), all questions answered.',
        'For essay: cite all 3 sources by name; take a clear position.',
        'Cultural knowledge of Spanish-speaking world is part of the test.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How do you BUILD fluency for the speaking sections beyond just classroom practice?',
      hint: 'Watch Spanish shows / movies (Money Heist, Coco). Listen to Spanish podcasts during commutes. Speak with native speakers (language exchanges, conversation partners). Read Spanish news. The 3-hour test is hard to fake; immersion changes you over months.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
