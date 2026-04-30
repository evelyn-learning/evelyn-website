/**
 * K — Letter sounds (phonics intro).
 *
 * Foundational alphabet awareness: each letter makes a sound, and
 * sounds blend into words. Heavy on listening + repeating; the brain
 * reads aloud, the student echoes. Visual support via show_equation
 * with single-letter "labels".
 */

import type { LessonPlan } from '../types';

export const SEED_K_ELA_LETTER_SOUNDS: LessonPlan = {
  id: 'evelyn.k.ela.phonics.letter-sounds.v1',
  title: 'Letter sounds (phonics intro)',
  curriculum: 'CCSS',
  grade: 'K',
  subject: 'ela',
  topic: 'phonics',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.k.rf.3.a',
      description: 'Demonstrate basic knowledge of one-to-one letter-sound correspondences by producing the primary sound for each consonant.',
      standard: 'CCSS.ELA-LITERACY.RF.K.3.A',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.k.rf.3.b', 'ccss.ela.k.rf.3.c'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to notice that letters MAKE sounds — not just have names.',
      script: 'Say your name out loud! The very first sound you made — that\'s a letter\'s sound. Letters have names AND sounds.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-letter-vs-sound',
      kind: 'concept',
      goal: 'Each letter has a NAME (like the alphabet song) and a SOUND (what we use when we read).',
      keyIdeas: [
        'A letter\'s NAME is what we sing in the alphabet song: "A, B, C, D…"',
        'A letter\'s SOUND is what it says when we read: "a says /a/, b says /b/, c says /k/."',
        'Letters can make more than one sound, but each one has a "main" sound to start with.',
      ],
      vocabulary: [
        { term: 'sound', definition: 'what your mouth does when you read a letter aloud.' },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'worked-m-sound',
      kind: 'worked_example',
      problem: 'What sound does the letter M make?',
      steps: [
        'Say "M" — that\'s the name. Now close your lips and hum: /mmmm/. That\'s the sound.',
        'Words that START with /m/: mom, milk, moon. Listen for the /mmm/ at the front.',
        'So M says /mmm/.',
      ],
      answer: '/m/ (mmm)',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What sound does S make? Think of "sun", "sock", "snake."',
      expectedAnswer: '/s/',
      responseFormat: 'free',
      hints: [
        'Think about how a snake hisses!',
        'It\'s the sound at the very start of "sun".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-letter-name',
      kind: 'misconception_check',
      question: 'A friend says "B says BEE because that\'s its name." Is that the right SOUND for B?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing the letter\'s NAME with its SOUND.',
          correctsTo: 'The name is "bee" (we say it in the song), but the SOUND is /b/ — like the start of "ball" or "bat".',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every letter has a NAME and a SOUND.',
        'Sounds are what we use when we READ.',
        'The first sound in a word is a great way to find the letter.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Some letters make TWO sounds — like C in "cat" (/k/) versus "city" (/s/). Can you think of another word starting with C that uses /s/?',
      hint: 'Try words that start with "ce" or "ci".',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
