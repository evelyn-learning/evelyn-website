/**
 * G5 — Poetry introduction.
 *
 * Reading and analyzing poems: rhyme scheme, meter (lightly), simile,
 * metaphor, imagery, mood. Why poetry packs more meaning per word.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_ELA_POETRY_INTRO: LessonPlan = {
  id: 'evelyn.g5.ela.poetry.intro.v1',
  title: 'Reading poetry: rhyme, imagery, and metaphor',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'ela',
  topic: 'poetry',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.5.rl.4',
      description: 'Determine the meaning of words and phrases as they are used in a text, including figurative language such as metaphors and similes.',
      standard: 'CCSS.ELA-LITERACY.RL.5.4',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.6.rl.4'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Demonstrate poems do MORE with FEWER words.',
      script: 'Prose says: "She was very sad." A poem might say: "Her heart was a stone in winter." Same idea, but the poem makes you FEEL it. That\'s why poems pack so much in a few lines.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-poetry-tools',
      kind: 'concept',
      goal: 'Five poetic tools: rhyme, rhythm, imagery, simile, metaphor.',
      keyIdeas: [
        'RHYME: words that sound alike at the end (sky/high, light/night). Rhyme SCHEME is the pattern, labeled with letters: AABB, ABAB, etc.',
        'RHYTHM: the beat/stress pattern of a line. Some poems have strict patterns (meter); others are free.',
        'IMAGERY: language that paints pictures using the senses (sight, sound, smell, taste, touch). "Crisp red leaves crunched underfoot" — imagery for fall.',
        'SIMILE: comparing two things using LIKE or AS. "Brave as a lion." "She runs like the wind."',
        'METAPHOR: comparing two things WITHOUT like or as — saying one IS the other. "He is a rock." "Time is a thief."',
        'MOOD: the FEELING the poem creates — sad, joyful, mysterious, peaceful.',
      ],
      vocabulary: [
        { term: 'rhyme scheme', definition: 'the pattern of which lines rhyme — like AABB or ABAB.' },
        { term: 'simile', definition: 'a comparison using "like" or "as".' },
        { term: 'metaphor', definition: 'a comparison saying one thing IS another, without "like".' },
        { term: 'imagery', definition: 'descriptive language that creates pictures using the senses.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-fog',
      kind: 'worked_example',
      problem: 'Look at this short poem by Carl Sandburg: "The fog comes / on little cat feet. / It sits looking / over harbor and city / on silent haunches / and then moves on." What poetic tools does it use?',
      steps: [
        'METAPHOR: the fog is described AS a cat (without using "like" or "as" — just "cat feet", "haunches", "sits", "moves on").',
        'IMAGERY: visual ("little cat feet", "silent haunches"), physical (cat sitting and moving).',
        'MOOD: quiet, mysterious, peaceful.',
        'No rhyme scheme — this is FREE VERSE.',
        'Effect: comparing fog to a cat makes it feel ALIVE and gentle, not threatening or cold.',
      ],
      answer: 'metaphor (fog = cat), imagery, free verse, peaceful mood',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify: simile or metaphor? "The classroom was a zoo at lunch period."',
      expectedAnswer: 'metaphor',
      responseFormat: 'free',
      hints: [
        'Look for "like" or "as".',
        'No "like" or "as" → it\'s a…',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-poems-must-rhyme',
      kind: 'misconception_check',
      question: 'Do all poems have to rhyme?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Defining poetry by rhyme.',
          correctsTo: 'No — FREE VERSE poems don\'t rhyme. They use rhythm, imagery, and line breaks for effect. Walt Whitman, Carl Sandburg, Mary Oliver wrote great poems with no rhyme.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five tools: rhyme, rhythm, imagery, simile, metaphor.',
        'Simile uses "like/as"; metaphor doesn\'t.',
        'Imagery appeals to the senses.',
        'Free verse poems don\'t rhyme — and that\'s fine.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Write your own ONE-LINE metaphor about something in your life — your phone, a teacher, a sport.',
      hint: 'Try the structure "X is a Y" without "like". Example: "My alarm clock is a tiny dictator."',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
