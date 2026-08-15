/**
 * G3 — ELA: Parts of speech (nouns, verbs, adjectives, adverbs).
 *
 * The four most-encountered word categories at G3 level. Quick
 * tests to identify each: nouns name, verbs do, adjectives describe
 * nouns, adverbs describe verbs. Sets up grammar for the rest of
 * elementary and middle school.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_ELA_PARTS_OF_SPEECH: LessonPlan = {
  id: 'evelyn.g3.ela.parts-of-speech.v1',
  title: 'Parts of Speech: Nouns, Verbs, Adjectives, Adverbs',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'ela',
  topic: 'grammar',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.l.3.1.a',
      description: 'Explain the function of nouns, pronouns, verbs, adjectives, and adverbs in general and their functions in particular sentences.',
      standard: 'CCSS.ELA-LITERACY.L.3.1.A',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.l.4.1'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that words have JOBS in a sentence.',
      script: 'Every word in a sentence has a job. "The fluffy dog ran quickly." DOG names something — that\'s a noun\'s job. RAN is something dog DOES — that\'s a verb\'s job. FLUFFY tells you about the dog. QUICKLY tells you about the running. Four words, four different jobs. Once you can spot the jobs, sentences make a lot more sense.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-pos',
      kind: 'concept',
      goal: 'Quick definitions and a simple test for each.',
      keyIdeas: [
        'NOUN — names a person, place, thing, or idea.',
        '  Test: can you put "the" or "a" in front? "The dog", "a school", "the idea".',
        '  Examples: dog, teacher, Paris, happiness.',
        'VERB — an action or state of being.',
        '  Test: can you do it, or BE it? "The dog runs." "She is happy."',
        '  Examples: run, jump, think, is, was, has.',
        'ADJECTIVE — describes a NOUN.',
        '  Test: ask "what kind?", "how many?", or "which one?". "The FLUFFY dog" — what kind of dog? Fluffy.',
        '  Examples: red, big, three, friendly.',
        'ADVERB — describes a VERB (or sometimes an adjective). Often ends in -ly.',
        '  Test: ask "how?", "when?", or "where?". "She ran QUICKLY" — how did she run? Quickly.',
        '  Examples: quickly, today, here, very.',
        'A single word can be a different part of speech in different sentences. "Run" is a verb in "I run", but a noun in "I went for a run."',
      ],
      vocabulary: [
        { term: 'noun', definition: 'a person, place, thing, or idea.' },
        { term: 'verb', definition: 'an action or state of being.' },
        { term: 'adjective', definition: 'a word that describes a noun.' },
        { term: 'adverb', definition: 'a word that describes a verb.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'Identify the part of speech of each word: "The happy student carefully wrote a long story."',
      steps: [
        'The: an article (we won\'t classify articles today, but they go with nouns).',
        'happy: describes "student" → ADJECTIVE.',
        'student: names a person → NOUN.',
        'carefully: tells how → ADVERB.',
        'wrote: an action → VERB.',
        'a: article (with "story").',
        'long: describes "story" → ADJECTIVE.',
        'story: names a thing → NOUN.',
      ],
      answer: 'Nouns: student, story. Verb: wrote. Adjectives: happy, long. Adverb: carefully.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In the sentence "The brave knight fought bravely," what part of speech is BRAVELY?',
      expectedAnswer: 'adverb',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'noun' },
        { id: 'b', text: 'verb' },
        { id: 'c', text: 'adjective' },
        { id: 'd', text: 'adverb', correct: true },
      ],
      hints: [
        '"Bravely" tells HOW the knight fought.',
        'Words ending in -ly that describe a verb are usually adverbs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ly-not-always-adverb',
      kind: 'misconception_check',
      question: 'Sage says "any word ending in -ly is an adverb." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating "-ly" as a 100% rule for adverbs.',
          correctsTo: 'Mostly true, but not always. Some -ly words are adjectives: "friendly dog", "lonely night", "lovely view" — they describe nouns, not verbs. The TEST matters more than the ending: ask if the word describes a noun (adjective) or a verb (adverb).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Noun: names. Verb: action or state. Adjective: describes noun. Adverb: describes verb.',
        'Quick tests: "the/a" before noun; "how/when/where" → adverb; "what kind" → adjective.',
        'A word\'s part of speech can change in different sentences.',
        'Not every -ly word is an adverb (friendly, lonely are adjectives).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find each part of speech in: "The tiny bird sang sweetly in the green tree."',
      hint: 'Nouns: bird, tree. Verb: sang. Adjectives: tiny, green. Adverb: sweetly.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
