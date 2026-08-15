/**
 * Grades K-2 ELA — Story Elements (Character, Setting, Plot).
 */

import type { LessonPlan } from '../types';

export const SEED_K2_ELA_STORY_ELEMENTS: LessonPlan = {
  id: 'evelyn.k2.ela.story-elements.v1',
  title: 'K-2 ELA — Story Elements',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ela',
  topic: 'k2-ela',
  locale: 'en',
  los: [
    {
      id: 'k2.ela.story-elements',
      description: 'Identify characters, setting, and main events (plot) in stories; retell a story using these elements.',
      standard: 'CCSS.ELA-LITERACY.RL.K.3',
    },
  ],
  prerequisites: ['k2.ela.sentence-structure'],
  followUps: ['k2.ela.main-idea-details'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Every good story has the same three building blocks — finding them helps you understand any story.',
      script: 'Who is in the story? Where does it happen? What happens? Three questions, three building blocks. Today you learn to find them in any story you read.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-elements',
      kind: 'concept',
      goal: 'Three story elements + how to find them.',
      keyIdeas: [
        'CHARACTER: who is in the story. The people, animals, or beings. Examples: Cinderella, the wolf, Goldilocks.',
        'SETTING: WHERE and WHEN the story happens. "In a forest, long ago." "At the school, on Monday."',
        'PLOT: WHAT happens — the main events in order. Beginning → middle → end.',
        'TO FIND CHARACTERS: ask "who?" Look at who acts, speaks, has feelings.',
        'TO FIND SETTING: ask "where?" and "when?" Listen for descriptions of place and time.',
        'TO FIND PLOT: ask "what happened first?" "What happened next?" "How did it end?" The story\'s big events.',
        'BEGINNING: introduce characters and setting. Set up the problem.',
        'MIDDLE: characters try to solve the problem. Things happen.',
        'END: the problem gets fixed. Story wraps up.',
        'RETELLING a story = sharing the elements: "It was about [character] in [setting]. First X happened, then Y, then Z."',
      ],
      vocabulary: [
        { term: 'character', definition: 'a person or animal in a story.' },
        { term: 'setting', definition: 'where and when the story takes place.' },
        { term: 'plot', definition: 'what happens in the story — the main events.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-elements',
      kind: 'worked_example',
      problem: 'Identify the story elements of "Goldilocks and the Three Bears".',
      steps: [
        'CHARACTERS: Goldilocks and three bears (Papa, Mama, Baby).',
        'SETTING: a cottage in the forest.',
        'PLOT — beginning: Goldilocks finds a cottage and goes inside.',
        'PLOT — middle: she tries the porridge, the chairs, and the beds. Some are too hot/big/hard; one is just right.',
        'PLOT — end: the bears come home, find Goldilocks, and she runs away.',
        'Now you can RETELL: "Goldilocks went into a cottage in the forest. She tried porridge, chairs, and beds. The bears came home and she ran away."',
      ],
      answer: 'Characters: Goldilocks + 3 bears. Setting: cottage in forest. Plot: tries things, gets caught, runs.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name the SETTING of "The Three Little Pigs".',
      expectedAnswer: 'Out in the country / by their houses (made of straw, sticks, and brick). Or just "the countryside where the pigs live".',
      responseFormat: 'free',
      hints: [
        'Where does the story happen?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-character-trait',
      kind: 'misconception_check',
      question: 'Is "scared" a character?',
      commonErrors: [
        {
          answer: 'Yes, scared is a character',
          misconception: 'Confusing how a character FEELS with WHO the character is.',
          correctsTo: '"Scared" is a FEELING, not a character. A character is a person, animal, or being in the story. The MOUSE is a character; "scared" is how the mouse feels. Same with "brave", "tired", "happy" — those describe characters but aren\'t themselves characters.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three elements: characters, setting, plot.',
        'Characters = WHO. Setting = WHERE/WHEN. Plot = WHAT HAPPENS.',
        'Plot has beginning, middle, end.',
        'Retelling = naming the elements together.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Can a story have more than one setting?',
      hint: 'Yes! In "The Wizard of Oz", the story starts on a Kansas farm, then moves to Oz. In "Charlotte\'s Web", the setting moves between the barn, the fair, and the farm. Stories can change settings as the plot moves. Each setting change usually signals new events.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
