/**
 * Grades K-2 ELA — Phonemic Awareness (Rhyming, Blending).
 */

import type { LessonPlan } from '../types';

export const SEED_K2_ELA_PHONEMIC_AWARENESS: LessonPlan = {
  id: 'evelyn.k2.ela.phonemic-awareness.v1',
  title: 'K-2 ELA — Phonemic Awareness',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ela',
  topic: 'k2-ela',
  locale: 'en',
  los: [
    {
      id: 'k2.ela.phonemic-awareness',
      description: 'Identify rhyming words; blend individual sounds into words; segment words into individual sounds.',
      standard: 'CCSS.ELA-LITERACY.RF.K.2',
    },
  ],
  prerequisites: [],
  followUps: ['k2.ela.cvc-decoding'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hearing the SOUNDS in words is the very first step in learning to read.',
      script: 'Cat. Hat. Bat. Hear how those words end the same way? That\'s rhyming. Today we\'re going to play with the sounds inside words — hearing them, putting them together, and pulling them apart.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-phonemes',
      kind: 'concept',
      goal: 'Three core phonemic-awareness skills.',
      keyIdeas: [
        'PHONEME: the smallest sound in a word. The word "cat" has THREE phonemes: /c/ /a/ /t/.',
        'RHYMING: words that end with the same sound. "Cat" rhymes with "hat", "bat", "mat".',
        'BLENDING: putting individual sounds TOGETHER to make a word. "/c/ /a/ /t/" → "cat".',
        'SEGMENTING: breaking a word INTO individual sounds. "cat" → "/c/ /a/ /t/".',
        'PHONEMIC AWARENESS happens with the EARS, not the eyes — kids should be able to do it with eyes closed.',
        'WHY IT MATTERS: kids who can hear sounds in words learn to read more easily because reading connects letters to sounds.',
        'PRACTICE: "What rhymes with cat?" "What sounds do you hear in dog?" "Put these sounds together: /s/ /u/ /n/".',
      ],
      vocabulary: [
        { term: 'rhyme', definition: 'words that end with the same sound, like cat and hat.' },
        { term: 'sound', definition: 'one little piece of a word, called a phoneme.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-blend',
      kind: 'worked_example',
      problem: 'Listen to these sounds and blend them into a word: /s/ /u/ /n/.',
      steps: [
        'Say each sound: /s/, /u/, /n/.',
        'Slide them together fast: ssssuuuun.',
        'The word is SUN!',
        'Now try /m/ /a/ /p/. Slide them together: mmmaaap. The word is MAP.',
      ],
      answer: 'sun (or map for the second one)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What word is /b/ /e/ /d/?',
      expectedAnswer: 'bed',
      responseFormat: 'free',
      hints: [
        'Say each sound, then slide them together fast.',
        'b-e-d.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-letters-sounds',
      kind: 'misconception_check',
      question: 'A child says "cat" has 3 letters AND 3 sounds. But what about "ship"?',
      commonErrors: [
        {
          answer: '"Ship" has 4 sounds because it has 4 letters',
          misconception: 'Counting LETTERS instead of SOUNDS.',
          correctsTo: '"Ship" has 4 LETTERS but only 3 SOUNDS: /sh/ /i/ /p/. The "sh" makes ONE sound. Letters and sounds aren\'t always one-to-one. Other examples: "thin" has 4 letters, 3 sounds (/th/ /i/ /n/). "Sheep" has 5 letters, 3 sounds (/sh/ /ee/ /p/).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Phonemes = small sounds inside a word.',
        'Rhyming = words ending the same sound.',
        'Blending = putting sounds together to make a word.',
        'Segmenting = pulling sounds apart from a word.',
        'Letters and sounds aren\'t always one-to-one.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What word do you get if you take "cat" and change the /c/ to /b/?',
      hint: 'Replace /c/ with /b/: /b/ /a/ /t/ = "bat". This is called PHONEME SUBSTITUTION — swapping one sound for another. Doing it makes new words: cat → bat → mat → fat → hat.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
