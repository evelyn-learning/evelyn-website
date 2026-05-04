/**
 * Grades 6-8 ELA — Revising for Clarity.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_REVISING_CLARITY: LessonPlan = {
  id: 'evelyn.g68.ela.revising-clarity.v1',
  title: 'Grades 6-8 ELA — Revising for Clarity',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.revising-clarity',
      description: 'Revise drafts to improve clarity by tightening sentences, eliminating wordiness, and improving flow.',
      standard: 'CCSS.ELA-LITERACY.W.7.5',
    },
  ],
  prerequisites: ['g68.ela.word-choice'],
  followUps: ['g68.ela.phrases-clauses'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Clear writing isn\'t just shorter writing — it\'s writing where the reader doesn\'t have to work to understand.',
      script: '"It is generally believed by many people that there is a possibility that homework could potentially be helpful for student learning." That sentence is technically grammatical and totally murky. Cut it: "Homework may help students learn." Same idea, half the words. Today we drill the moves that make writing clear.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-clarity',
      kind: 'concept',
      goal: 'Common clarity moves + sentence-level revision.',
      keyIdeas: [
        'CUT WORDINESS: "due to the fact that" → "because". "in the event that" → "if". "at this point in time" → "now". "in order to" → "to".',
        'AVOID HEDGING phrases: "I think", "in my opinion", "kind of", "sort of", "really" — often add nothing.',
        'PASSIVE → ACTIVE: when actor is clear, active voice is shorter and clearer.',
        'NOMINALISATIONS: when verbs become nouns ("makes a decision" instead of "decides"). Often inflate sentences. Convert back: "She makes a decision" → "She decides".',
        'SPECIFIC OVER GENERAL: "many things" → list them. "It was bad" → describe how.',
        'PARALLEL STRUCTURE: keep grammatical forms consistent in lists. "I like running, swimming, and to bike" → "I like running, swimming, and biking".',
        'TRANSITIONS: signal relationships between sentences. However, therefore, in addition, in contrast.',
        'READ ALOUD: catches awkward phrasing your eye misses.',
        'CUT 10%: as a rule of thumb, most drafts can lose ~10% of their words without losing meaning.',
      ],
      vocabulary: [
        { term: 'wordiness', definition: 'using more words than needed; reduces clarity.' },
        { term: 'parallelism', definition: 'maintaining consistent grammatical form in items of a list or pair.' },
        { term: 'nominalisation', definition: 'turning a verb into a noun, often making sentences wordier.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-revise',
      kind: 'worked_example',
      problem: 'Revise this for clarity: "It is the case that, due to the fact that there are many people who think pollution is a problem, we should make a decision about reducing it in some kind of way."',
      steps: [
        'Cut "It is the case that" — empty filler.',
        'Replace "due to the fact that" with "because".',
        'Cut "there are many people who think" — sounds like opinion-laundering. Just state the position.',
        'Replace "make a decision about reducing" with "decide to reduce".',
        'Cut "in some kind of way" — vague filler.',
        'Revised: "Because pollution is a problem, we should decide to reduce it." Or even: "Pollution is a problem; we must reduce it."',
        'Original: 26 words. Revised: 8-13 words. Same meaning, far clearer.',
      ],
      answer: '"Because pollution is a problem, we should reduce it." (or similar).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Revise: "I will utilise the new equipment in order to complete the assignment in a manner that is timely."',
      expectedAnswer: '"I will use the new equipment to complete the assignment on time."',
      responseFormat: 'free',
      hints: [
        '"Utilise" → "use".',
        '"In order to" → "to".',
        '"In a manner that is timely" → "on time".',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-formal-clarity',
      kind: 'misconception_check',
      question: 'A student believes long, complex sentences with fancy vocabulary make their writing sound smart. Why might this backfire?',
      commonErrors: [
        {
          answer: 'Long fancy sentences = smart',
          misconception: 'Confusing complexity with quality.',
          correctsTo: 'Clarity is the mark of confident writing. Cluttered, hedged, jargon-filled writing often signals confusion or insecurity. The best writers say complex things in simple language. "Less is more" — readers reward clarity, not vocabulary fireworks. Save fancy words for when they\'re truly precise; default to plain language.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cut empty fillers: "due to the fact that", "it is the case that".',
        'Active voice over passive when actor is clear.',
        'Specific over general.',
        'Parallel structure in lists.',
        'Read aloud to catch awkwardness.',
        'Cut ~10% of words without losing meaning.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When might LONGER sentences be clearer than shorter ones?',
      hint: 'When you need to show a relationship between ideas. "She left. He was sad." Two sentences, but the connection is left implicit. Combined: "She left, leaving him sad." or "When she left, he felt sad." The longer version makes causation explicit. Length serves clarity when relationships matter; brevity serves clarity when standalone facts matter. Adapt to purpose.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
