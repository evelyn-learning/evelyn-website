/**
 * G8 — Tone vs mood.
 *
 * Tone = author's attitude. Mood = reader's feeling. Two related
 * but distinct concepts in literary analysis.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_ELA_TONE_MOOD: LessonPlan = {
  id: 'evelyn.g8.ela.literary.tone-vs-mood.v1',
  title: 'Tone vs mood: author\'s attitude vs reader\'s feeling',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'ela',
  topic: 'literary-devices',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.8.rl.4',
      description: 'Determine the meaning of words and phrases as they are used in a text, including the impact of specific word choices on tone.',
      standard: 'CCSS.ELA-LITERACY.RL.8.4',
    },
  ],
  prerequisites: ['ccss.ela.6.rl.4'],
  followUps: ['ccss.ela.9-10.rl.4'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Distinguish them with everyday speech.',
      script: 'When your friend says "Oh, GREAT" with a flat voice — the WORDS are positive but the TONE tells you they\'re annoyed. That gap between literal meaning and how it\'s said? That\'s tone. And it changes how you FEEL — the mood.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distinction',
      kind: 'concept',
      goal: 'Define each, give common adjectives, identify in text.',
      keyIdeas: [
        'TONE = the AUTHOR\'S attitude toward the subject. Created by word choice, sentence structure, details.',
        'MOOD = the FEELING the text creates in the READER. Created by setting, imagery, pacing.',
        'TWO sides of the same coin — but distinct.',
        'TONE adjectives: bitter, joyful, sarcastic, formal, playful, mournful, urgent, reverent, mocking, intimate, detached.',
        'MOOD adjectives: tense, peaceful, eerie, hopeful, melancholy, suspenseful, joyful, oppressive.',
        'EXAMPLE: a horror story\'s TONE might be "ominous, foreboding" while its MOOD on the reader is "frightened, anxious".',
        'TIP: ask "what does the AUTHOR seem to feel about this?" → tone. Ask "how does this make ME feel?" → mood.',
      ],
      vocabulary: [
        { term: 'tone', definition: 'the author\'s attitude toward the subject.' },
        { term: 'mood', definition: 'the feeling created in the reader by the text.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-passage',
      kind: 'worked_example',
      problem: 'Read: "The cracked walls leaned inward as if the house itself was tired of standing. A single bulb flickered, casting long, twitching shadows." What\'s the tone? What\'s the mood?',
      steps: [
        'TONE: how does the author seem to FEEL about the house? Word choices like "tired", "twitching", "flickering" suggest WEARY, OMINOUS, possibly PITYING.',
        'MOOD: how does this make the reader feel? Tense, uneasy, suspenseful — like something is wrong.',
        'They\'re related: an ominous tone CREATES an uneasy mood. Author\'s posture → reader\'s response.',
      ],
      answer: 'tone: ominous/weary; mood: tense/uneasy',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A passage describes a sunny picnic with friends laughing and birds singing. What tone and mood?',
      expectedAnswer: 'tone: joyful or warm; mood: cheerful or peaceful',
      responseFormat: 'free',
      hints: [
        'Author\'s attitude toward the picnic seems POSITIVE.',
        'Reader\'s feeling: probably HAPPY, RELAXED.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-same',
      kind: 'misconception_check',
      question: 'Are tone and mood the same thing?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Conflating the two.',
          correctsTo: 'No — TONE is the AUTHOR\'S attitude (in the writing). MOOD is the READER\'S feeling (created by the writing). They\'re usually aligned (sad tone → sad mood), but they\'re different perspectives. Author\'s side vs reader\'s side.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'TONE = author\'s attitude. MOOD = reader\'s feeling.',
        'Created by word choice, setting, imagery, pacing.',
        'They usually match (somber tone → somber mood) but are distinct.',
        'Identify by collecting evidence words/details from the passage.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Can tone and mood ever DISAGREE? Give an example.',
      hint: 'Yes — satire often has a LIGHT tone but creates an UNEASY mood. Sarcasm: cheerful tone, sour mood. The mismatch is the literary effect.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
