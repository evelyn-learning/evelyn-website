/**
 * G11 — Poetry analysis: TPCASTT method.
 *
 * Title, Paraphrase, Connotation, Attitude, Shifts, Title (revisited),
 * Theme. Standard close-reading technique.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ELA_POETRY_ANALYSIS: LessonPlan = {
  id: 'evelyn.g11.ela.poetry.analysis-tpcastt.v1',
  title: 'Analyzing poetry with TPCASTT',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'poetry',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.11-12.rl.4',
      description: 'Determine the meaning of words and phrases as they are used in the text, including figurative and connotative meanings.',
      standard: 'CCSS.ELA-LITERACY.RL.11-12.4',
    },
  ],
  prerequisites: ['ccss.ela.5.rl.4'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe poetry analysis as a method, not a mystery.',
      script: 'Most students freeze at "what does this poem MEAN?" — like there\'s some hidden answer. There isn\'t. There\'s a METHOD. Today: TPCASTT, a step-by-step approach used by AP Lit students to crack any poem.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-tpcastt',
      kind: 'concept',
      goal: 'Walk through each step of TPCASTT.',
      keyIdeas: [
        'T — TITLE: read just the title. What do you EXPECT? Save your guess.',
        'P — PARAPHRASE: read the poem. Restate it in plain prose. What is LITERALLY happening?',
        'C — CONNOTATION: look at WORD CHOICES and figurative language. What associations do words carry beyond their dictionary meaning? "Home" vs "house" — different connotations. Look for similes, metaphors, imagery, sound.',
        'A — ATTITUDE / TONE: what\'s the speaker\'s feeling toward the subject? Bitter? Joyful? Mournful? Sarcastic?',
        'S — SHIFTS: where does the poem CHANGE? Look for "but", "yet", "now". A shift in tone, time, point of view often signals the heart of the poem.',
        'T — TITLE (revisit): now that you\'ve read it, what does the title mean? Often DIFFERENT from your initial guess. Why did the poet pick THIS title?',
        'T — THEME: what BIG IDEA about life is the poem expressing? Theme is a complete sentence, not a topic. NOT "love" — instead "Love can be both a gift and a wound."',
      ],
      vocabulary: [
        { term: 'connotation', definition: 'the feeling or association a word carries beyond its dictionary meaning.' },
        { term: 'tone', definition: 'the speaker\'s attitude toward the subject.' },
        { term: 'theme', definition: 'the central idea about life expressed in a literary work.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-not-taken',
      kind: 'worked_example',
      problem: 'Apply TPCASTT to "The Road Not Taken" by Robert Frost (briefly).',
      steps: [
        'T (Title): "The Road Not Taken" — implies regret about a missed choice.',
        'P (Paraphrase): A traveler comes to a fork in the woods, picks one path, claims it was less traveled, and says this choice "made all the difference."',
        'C (Connotation): "Yellow wood", "grassy and wanted wear" — pastoral imagery. "Sigh" later suggests regret OR fond reflection. Frost is famously ambiguous here.',
        'A (Attitude): The narrator is reflective; some read it as wistful pride, others as regret in disguise.',
        'S (Shift): The shift comes in the final stanza — speaker imagines telling this story "ages and ages hence" with a "sigh".',
        'T (Title revisit): "Not taken" — the title is about the OTHER road, the one he DIDN\'T take. The poem is more about the IMAGINING of the alternative than the choice itself.',
        'T (Theme): a possible theme — "We construct meaning around our choices in retrospect, even when the choice itself was nearly arbitrary."',
      ],
      answer: 'work through each letter; theme is the final synthesis',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a poem analysis, what is the difference between TOPIC and THEME?',
      expectedAnswer: 'topic is a single word/phrase (e.g., "love"); theme is a complete sentence about love expressed in the poem',
      responseFormat: 'free',
      hints: [
        'Topic = WHAT the poem is ABOUT (one word).',
        'Theme = WHAT the poem SAYS about that topic (full sentence).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-meaning',
      kind: 'misconception_check',
      question: 'Does every poem have ONE correct meaning the analyzer must find?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating poetry analysis as treasure-hunting for the "real" meaning.',
          correctsTo: 'No — well-written poems often support MULTIPLE valid readings. What matters is whether your reading is supported by EVIDENCE in the text. "The Road Not Taken" can defensibly mean confidence OR regret — both readings cite real lines.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'TPCASTT: Title, Paraphrase, Connotation, Attitude, Shifts, Title revisit, Theme.',
        'Connotation = associations beyond dictionary meaning.',
        'Theme is a SENTENCE, not a topic.',
        'Multiple valid readings can coexist if all are evidenced.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is poetry SO hard to translate well between languages?',
      hint: 'Connotation, sound, rhythm, and cultural context all break in translation. The DICTIONARY meaning crosses easily, but everything that makes it a poem is local.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
