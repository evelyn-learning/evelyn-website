/**
 * Grades 9-12 ELA — Advanced Vocabulary in Context.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_VOCAB_ADVANCED: LessonPlan = {
  id: 'evelyn.g912.ela.vocab-advanced.v1',
  title: 'Grades 9-12 ELA — Advanced Vocabulary in Context',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.vocab-advanced',
      description: 'Master advanced vocabulary by context, etymology, and usage; deploy precise vocabulary in writing.',
      standard: 'CCSS.ELA-LITERACY.L.11-12.4',
    },
  ],
  prerequisites: ['g912.ela.speech-presentation'],
  followUps: ['g912.ela.college-essay'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A precise vocabulary doesn\'t just impress — it lets you SAY exactly what you mean.',
      script: 'The difference between "good" and "competent" / "exemplary" / "adequate" / "stellar" is the difference between vague and precise. SAT, ACT, AP exams, college essays, professional communication — all reward precise word choice. Today we drill how to BUILD vocabulary, not memorise word lists.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-vocab-strategy',
      kind: 'concept',
      goal: 'Building vocabulary through context + etymology + active use.',
      keyIdeas: [
        'CONTEXT CLUES: surrounding sentences usually hint at meaning of unfamiliar words. Examples, contrasts, restatements, tone all help.',
        'ETYMOLOGY: word origins reveal meaning. Greek/Latin roots and prefixes/suffixes carry over.',
        'WORD FAMILIES: learn one word, get four. "Critique", "critic", "critical", "criticise". "Analyse", "analysis", "analyst", "analytic".',
        'CONNOTATION: many words are technical synonyms with different feelings. "Frugal" (positive) vs "cheap" (negative). "Confident" (positive) vs "arrogant" (negative).',
        'ACTIVE USE: vocabulary that you USE sticks. Words you only RECOGNISE fade. Try one new word per day in conversation or writing.',
        'WORD JOURNAL: when you encounter a new word in reading, write it down with context. Look up. Use it within a week.',
        'PRECISE VS FANCY: the goal isn\'t the LONGEST word but the RIGHT word. "Use" beats "utilise" if both convey the same meaning.',
        'COLLOCATIONS: words that go together. "Heavy traffic" works; "weighty traffic" doesn\'t. Read widely to build a sense of what fits.',
        'VOCABULARY BUILDS THROUGH READING. SAT lists alone don\'t beat sustained engagement with rich texts.',
      ],
      vocabulary: [
        { term: 'etymology', definition: 'the study of word origins and history.' },
        { term: 'connotation', definition: 'the emotional or cultural association attached to a word beyond its dictionary meaning.' },
        { term: 'collocation', definition: 'a habitual pairing of words; "heavy traffic" not "weighty traffic".' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-precision',
      kind: 'worked_example',
      problem: 'A student writes "The teacher was very strict." Replace with a more precise word.',
      steps: [
        'WHAT KIND OF "strict"?',
        'If discipline-focused: "the teacher was authoritarian" or "the teacher was rigorous".',
        'If detail-focused: "the teacher was meticulous" or "the teacher was exacting".',
        'If demanding-focused: "the teacher was demanding" or "the teacher was uncompromising".',
        'Each precise word REVEALS more than the vague "strict". Pick by what you actually mean.',
      ],
      answer: 'Multiple precise alternatives, each conveying a specific shade of "strict".',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Choose the better word: "She was [happy / ecstatic / content] to hear the news that her grades had improved slightly."',
      expectedAnswer: '"Content" — fits "improved slightly" better than "ecstatic" (over the top) or "happy" (vague).',
      responseFormat: 'free',
      hints: [
        '"Slightly improved" suggests modest improvement.',
        'Match the word\'s intensity to the situation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-thesaurus-lazy',
      kind: 'misconception_check',
      question: 'A student replaces "good" with "magnificent" throughout an essay using a thesaurus, without checking. Why is this risky?',
      commonErrors: [
        {
          answer: 'Always replace "good" with "magnificent"',
          misconception: 'Treating thesaurus synonyms as direct substitutes.',
          correctsTo: '"Good" and "magnificent" are NOT interchangeable. "Good" is mild, neutral. "Magnificent" is grand, overwhelming. "A good cup of coffee" works; "a magnificent cup of coffee" sounds absurd. Synonyms vary in CONNOTATION and INTENSITY. Thesaurus offers options; YOU must judge fit. Better strategy: check unfamiliar synonyms in a dictionary AND see them used in context before deploying.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Build vocabulary through context, etymology, and active use.',
        'Word families: one word = four.',
        'Precise > fancy.',
        'Connotation matters as much as denotation.',
        'Read widely to absorb collocations.',
        'Use new words within a week to retain.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might OVER-USING fancy vocabulary make writing WORSE?',
      hint: 'Three reasons: 1) Reader friction — pausing to parse rare words breaks flow. 2) Loss of precision — fancy words may not match meaning. 3) Tone mismatch — high-register vocabulary in casual writing sounds pompous. Strong writers use sophisticated vocabulary SPARINGLY, when no simpler word fits. Hemingway used short, plain words and changed literature.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
