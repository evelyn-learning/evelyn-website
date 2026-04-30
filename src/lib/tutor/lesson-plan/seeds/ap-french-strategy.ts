/**
 * AP French Language and Culture — exam strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_FRENCH_STRATEGY: LessonPlan = {
  id: 'evelyn.ap.french.strategy.v1',
  title: 'AP French Language exam strategy',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'ap-french-lang',
  locale: 'en',
  los: [
    {
      id: 'apfrench.strategy',
      description: 'Apply effective strategy to AP French Language exam sections.',
      standard: 'AP-FREN-LANG',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'AP French tests COMMUNICATION across all four skills.',
      script: 'AP French isn\'t about memorizing vocab and grammar drills. It\'s about COMMUNICATING — listening to French-speakers from Quebec to Senegal, reading authentic texts, writing essays, speaking spontaneously. Strategy spans all four skills.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Format + section strategies + cultural knowledge.',
      keyIdeas: [
        'FORMAT: ~3 hours. Multiple choice (interpretive listening + reading) and free-response (writing + speaking).',
        'INTERPRETIVE LISTENING: audio (interviews, podcasts, news) from across the Francophone world (France, Quebec, Africa, Caribbean). Listen for MAIN IDEA first, then details. Accents vary — practice with diverse sources.',
        'INTERPRETIVE READING: authentic texts (newspapers, literature, charts, ads). Same skill — skim, then detail.',
        'INTERPERSONAL WRITING: respond to an EMAIL formally (~15 min). Use vous, formal greetings/closings, address all questions, fit cultural context.',
        'PRESENTATIONAL WRITING: persuasive essay synthesizing 3 sources (article + chart + audio), ~40 min. Take a position, cite each source by name, organize logically.',
        'INTERPERSONAL SPEAKING: simulated conversation, 5 prompts, 20 sec each. React in real time, don\'t recite prepared lines.',
        'PRESENTATIONAL SPEAKING: cultural comparison, 4 min. Compare a feature of your community to one in a Francophone community.',
        'CULTURAL KNOWLEDGE: themes include identity, family, science, beauty/aesthetics, environment. Study the FRANCOPHONE world broadly — France is just one part.',
        'SCORING: 1-5. Most universities accept 4 for credit; some take 3.',
      ],
      vocabulary: [
        { term: 'la francophonie', definition: 'the global community of French-speaking countries and regions.' },
        { term: 'register', definition: 'level of formality in language (vous vs tu).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-essay',
      kind: 'worked_example',
      problem: 'For the persuasive essay: how to integrate the THREE SOURCES effectively.',
      steps: [
        'Read all three sources before writing.',
        'Take a clear position with reasoning.',
        'Each body paragraph cites a source by name: "Selon la source numéro 1, ...".',
        'USE sources to support your argument — don\'t just summarize them.',
        'Engage with disagreements between sources — shows sophistication.',
        'Use connectors: cependant, en revanche, de plus, par conséquent.',
        'Conclusion: synthesize.',
        'Time: ~5 min planning, ~30 min writing, ~5 min review.',
      ],
      answer: 'cite all 3 sources by name, integrating their evidence into your argument',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is the Francophone world (not just France) tested?',
      expectedAnswer: 'French is a global language — Quebec, Belgium, Switzerland, much of West and Central Africa, Haiti, Caribbean. Cultural comparisons in the exam draw on all these communities, not just France. Studying only Paris misses most of the test.',
      responseFormat: 'free',
      hints: [
        'How many countries have French as an official language?',
        'Cultural comparison tasks may pull from any of them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-grammar-only',
      kind: 'misconception_check',
      question: 'Should AP French prep focus mostly on memorizing grammar rules?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Grammar-only approach.',
          correctsTo: 'No — graders reward COMMUNICATION over perfect grammar. A few errors are fine if the message is clear and culturally appropriate. Focus on: rich vocabulary, varied syntax, fluent flow, cultural understanding. Communicate first; perfection is optional.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '4 skills tested: interpretive (listening + reading) + interpersonal (writing + speaking) + presentational.',
        'Communication > perfect grammar.',
        'Email: formal register (vous), all questions answered.',
        'Essay: cite all 3 sources by name; take a clear position.',
        'Study the Francophone world broadly — France, Quebec, Africa, Caribbean.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How do you BUILD fluency for the speaking sections beyond classroom practice?',
      hint: 'Watch French shows/films (Lupin, Amélie, Intouchables, Senegalese cinema). Listen to French podcasts (RFI, Slate). Speak with native speakers via language-exchange apps. Read French news. Immersion shifts you over months in ways drills cannot.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
