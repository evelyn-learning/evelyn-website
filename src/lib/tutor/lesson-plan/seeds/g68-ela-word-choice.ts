/**
 * Grades 6-8 ELA — Word Choice & Connotation.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_WORD_CHOICE: LessonPlan = {
  id: 'evelyn.g68.ela.word-choice.v1',
  title: 'Grades 6-8 ELA — Word Choice & Connotation',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.word-choice',
      description: 'Distinguish denotation from connotation; choose precise, vivid words; recognise synonyms with subtly different feelings.',
      standard: 'CCSS.ELA-LITERACY.L.7.5.B',
    },
  ],
  prerequisites: ['g68.ela.active-passive-voice'],
  followUps: ['g68.ela.revising-clarity'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Two words can mean almost the same thing — but FEEL very different.',
      script: '"Frugal" vs "cheap". Both describe someone careful with money. But "frugal" is positive (wise, disciplined); "cheap" is negative (stingy, mean). The difference is CONNOTATION. Skilled writers exploit this. Today we drill it.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-word-choice',
      kind: 'concept',
      goal: 'Denotation, connotation, vivid verbs, precise nouns.',
      keyIdeas: [
        'DENOTATION: the dictionary definition of a word.',
        'CONNOTATION: the emotional weight or association a word carries beyond its literal meaning.',
        'POSITIVE / NEGATIVE / NEUTRAL: synonyms often differ in connotation. "Determined" (positive) vs "stubborn" (negative) vs "persistent" (neutral).',
        'VIVID VERBS replace dull ones: "walked" → "strolled", "marched", "trudged", "shuffled". Each suggests something specific.',
        'PRECISE NOUNS replace vague ones: "tree" → "oak", "willow", "redwood".',
        'AVOID lazy intensifiers: "very", "really", "so". Replace with stronger words. "Very tired" → "exhausted". "Really cold" → "freezing".',
        'AUDIENCE MATTERS: formal writing uses different word choice from casual writing. "Utilise" sounds stiff in conversation; "use" sounds casual in a research paper.',
        'TONE FOLLOWS WORD CHOICE: a series of negative-connotation words creates a critical tone; positive words a sympathetic tone.',
        'AVOID OVERUSE: don\'t reach for the thesaurus and pick the fanciest word. Pick the RIGHT word.',
      ],
      vocabulary: [
        { term: 'denotation', definition: 'the literal, dictionary meaning of a word.' },
        { term: 'connotation', definition: 'the emotional or cultural association a word carries beyond its literal meaning.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-connotation',
      kind: 'worked_example',
      problem: 'Compare connotations of these synonyms: "slim", "thin", "skinny", "scrawny". Which would you use to describe someone admiringly?',
      steps: [
        '"Slim" — positive connotation (graceful, fit). Often used for praise.',
        '"Thin" — neutral connotation (just describing).',
        '"Skinny" — slight negative (could imply unhealthy).',
        '"Scrawny" — strong negative (underweight, weak).',
        'Admiring choice: "slim". For neutral description: "thin". For criticism: "scrawny".',
      ],
      answer: '"Slim" for admiration. The same idea, four very different feels.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Replace "very tired" with one stronger word.',
      expectedAnswer: 'exhausted, drained, depleted, weary, beat (any precise synonym).',
      responseFormat: 'free',
      hints: [
        'What\'s a single word for "extremely tired"?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-thesaurus',
      kind: 'misconception_check',
      question: 'A student replaces "happy" with "ecstatic" and "walked" with "perambulated". Why might this hurt the writing?',
      commonErrors: [
        {
          answer: '"Ecstatic" and "perambulated"',
          misconception: 'Picking unusual words for the sake of variety, without checking fit.',
          correctsTo: '"Ecstatic" implies overwhelming joy — too strong if the character is just pleased. "Perambulated" is overly formal and archaic. Word choice should fit the CONTEXT and MEANING, not just impress. Better: "happy" → "pleased" or "content" if mild; "thrilled" if stronger. "Walked" → "strolled" or "wandered". Match word strength to actual meaning.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Denotation: dictionary meaning. Connotation: emotional association.',
        'Synonyms have different connotations — choose the one that matches your tone.',
        'Vivid verbs and precise nouns over generic + intensifiers.',
        'Audience and context shape appropriate word choice.',
        'Don\'t pick fancy words for their own sake — pick the right one.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How can a writer use word choice to subtly bias the reader without making outright claims?',
      hint: 'Calling a politician "visionary" vs "reckless" — both might describe ambitious goals, but the reader\'s impression flips. Calling protests "uprisings" vs "riots" — same event, different framing. Skilled writers (and propagandists) exploit connotation to nudge readers toward conclusions while seeming neutral. Critical readers learn to spot loaded words and ask "what alternative wording would feel different?"',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
