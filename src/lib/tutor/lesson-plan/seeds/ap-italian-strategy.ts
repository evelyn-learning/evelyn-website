/**
 * AP Italian Language and Culture — exam strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_ITALIAN_STRATEGY: LessonPlan = {
  id: 'evelyn.ap.italian.strategy.v1',
  title: 'AP Italian Language exam strategy',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'apitalian.strategy',
      description: 'Apply effective strategy to AP Italian Language exam sections.',
      standard: 'AP-ITAL-LANG',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'AP Italian tests COMMUNICATION across all four skills.',
      script: 'AP Italian uses the same architecture as other AP language exams: interpretive listening + reading, presentational + interpersonal writing + speaking. The Italian-specific challenge is mastering the formal/informal distinction (Lei vs tu) and engaging with Italy\'s rich cultural heritage — art, history, food, regions.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Format + section strategies + cultural knowledge.',
      keyIdeas: [
        'FORMAT: ~3 hours. Multiple choice (interpretive listening + reading) and free-response (writing + speaking).',
        'INTERPRETIVE LISTENING: audio passages from Italy and Italian-speaking communities. Listen for MAIN IDEA first, then specifics.',
        'INTERPRETIVE READING: authentic texts (newspapers, fiction, ads). Skim, then detail.',
        'INTERPERSONAL WRITING: respond to an EMAIL formally (~15 min). Use Lei (formal you), proper greetings/closings, address all questions.',
        'PRESENTATIONAL WRITING: persuasive essay synthesizing 3 sources, ~40 min. Take a position, cite each source by name.',
        'INTERPERSONAL SPEAKING: simulated conversation, 5 prompts, 20 sec each. React in real time.',
        'PRESENTATIONAL SPEAKING: cultural comparison, 4 min. Compare a feature of your community to one in Italy.',
        'CULTURAL KNOWLEDGE: themes include identity, family, beauty/aesthetics, science, environment. Italy\'s regional diversity matters — Sicily, Tuscany, Veneto each have distinct traditions.',
        'GRAMMAR: master congiuntivo (subjunctive), passato remoto (literary past), formal vs informal address.',
        'SCORING: 1-5.',
      ],
      vocabulary: [
        { term: 'congiuntivo', definition: 'subjunctive mood used after verbs of opinion, doubt, emotion — heavily tested.' },
        { term: 'register', definition: 'level of formality (Lei vs tu).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-essay',
      kind: 'worked_example',
      problem: 'For the persuasive essay: integrating the THREE SOURCES effectively.',
      steps: [
        'Read all three sources.',
        'Take a clear position with reasoning.',
        'Each body paragraph cites a source: "Secondo la fonte numero 1, ...".',
        'USE sources to support your argument.',
        'Engage with disagreements between sources.',
        'Use connectors: tuttavia, inoltre, d\'altra parte, di conseguenza.',
        'Conclusion: synthesize.',
        'Time: ~5 min planning, ~30 min writing, ~5 min review.',
      ],
      answer: 'cite all 3 sources by name, integrating their evidence into your argument',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does AP Italian reward knowledge of Italy\'s REGIONAL diversity?',
      expectedAnswer: 'Italy unified only in 1861. Regional traditions (food, dialect, architecture, history) are still strong — Tuscan vs Sicilian vs Venetian. Cultural comparison tasks may pull from any region. Treating "Italian culture" as monolithic misses much of what graders look for.',
      responseFormat: 'free',
      hints: [
        'How long has Italy been a unified nation?',
        'What does that suggest about regional culture?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-grammar-only',
      kind: 'misconception_check',
      question: 'Should AP Italian prep focus mostly on memorizing grammar?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Grammar-only approach.',
          correctsTo: 'No — graders reward COMMUNICATION over perfect grammar. A few errors are fine if message is clear and culturally appropriate. Focus on: vocabulary, varied syntax, fluency, cultural understanding. Master congiuntivo and Lei/tu, but communicate first; perfection is optional.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '4 skills tested: interpretive + interpersonal + presentational.',
        'Communication > perfect grammar (but congiuntivo + Lei matter).',
        'Email: formal register (Lei), all questions answered.',
        'Essay: cite all 3 sources by name; take a clear position.',
        'Italy\'s regional diversity is part of cultural knowledge.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How do you BUILD fluency for the speaking sections beyond classroom practice?',
      hint: 'Watch Italian films (La vita è bella, Cinema Paradiso, Il Postino) and shows. Listen to Italian podcasts and music (RAI Radio, Italian rap). Read Italian news (Corriere, Repubblica). Speak with native speakers via language exchange. Visit Italy if possible — even a week immersed accelerates fluency.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
