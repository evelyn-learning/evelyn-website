/**
 * G3 — ELA: Story elements (character, setting, plot, problem,
 * solution).
 *
 * The structural pieces that make up almost every fiction story.
 * Once a student can name them, they can analyze any story they
 * read — and write better ones themselves. Plot as
 * beginning/middle/end, with the problem-and-solution arc inside.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_ELA_STORY_ELEMENTS: LessonPlan = {
  id: 'evelyn.g3.ela.story-elements.v1',
  title: 'Story Elements',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'ela',
  topic: 'literature',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.rl.3.3',
      description: 'Describe characters in a story and explain how their actions contribute to the sequence of events.',
      standard: 'CCSS.ELA-LITERACY.RL.3.3',
    },
    {
      id: 'ccss.ela.rl.3.5',
      description: 'Refer to parts of stories when writing or speaking about a text.',
      standard: 'CCSS.ELA-LITERACY.RL.3.5',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.rl.4.3'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a familiar story (Three Little Pigs) to ground the elements.',
      script: 'Think about The Three Little Pigs. Three CHARACTERS (the pigs), in three different houses (the SETTING). A wolf shows up and tries to blow the houses down (PROBLEM). The third pig\'s brick house saves the day (SOLUTION). Almost every story has these same parts. Today we name them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-elements',
      kind: 'concept',
      goal: 'Five core elements + plot structure (beginning / middle / end).',
      keyIdeas: [
        'CHARACTERS: the people, animals, or beings in the story.',
        '  MAIN character (or PROTAGONIST): the story is mostly about them.',
        '  Often there\'s an ANTAGONIST too — someone working against the main character.',
        'SETTING: when and where the story happens. Place + time.',
        'PLOT: the sequence of events. Has a BEGINNING (we meet the characters and setting), a MIDDLE (the problem rises), and an END (the problem is solved).',
        'PROBLEM (or CONFLICT): what\'s going wrong, what the main character has to figure out.',
        'SOLUTION (or RESOLUTION): how the problem gets fixed.',
        'Some stories have a THEME — a big lesson or message ("be kind", "honesty matters"). Theme is SHOWN through what happens, not stated directly.',
      ],
      vocabulary: [
        { term: 'character', definition: 'a person, animal, or being in a story.' },
        { term: 'setting', definition: 'when and where the story takes place.' },
        { term: 'plot', definition: 'the sequence of events in the story.' },
        { term: 'protagonist', definition: 'the main character.' },
        { term: 'theme', definition: 'the big lesson or message of the story.' },
      ],
      suggestedTools: ['show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-3-pigs',
      kind: 'worked_example',
      problem: 'Map the story elements of "The Three Little Pigs".',
      steps: [
        'Characters: three pigs (main characters), the wolf (antagonist).',
        'Setting: long ago, near a forest, three different houses.',
        'Problem: the wolf wants to eat the pigs and blows their houses down.',
        'Solution: the third pig built a brick house that the wolf can\'t blow down. He\'s safe.',
        'Theme: hard work and planning ahead pay off (the pig who built carefully won).',
      ],
      answer: 'See structure above',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In "Goldilocks and the Three Bears", who is the main character? What is the setting?',
      expectedAnswer: 'Main character: Goldilocks. Setting: the bears\' cottage in the woods.',
      responseFormat: 'free',
      hints: [
        'Main character = whose story is it really?',
        'Setting = where and when does it take place?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-theme-vs-summary',
      kind: 'misconception_check',
      question: 'Asha says the THEME of "The Three Little Pigs" is "a wolf tried to blow down the pigs\' houses." What\'s the issue?',
      commonErrors: [
        {
          answer: 'nothing — that\'s the theme',
          misconception: 'Confusing the PLOT (what happened) with the THEME (the lesson).',
          correctsTo: 'That\'s a SUMMARY of what happened — that\'s plot. Theme is the BIG LESSON the story teaches: e.g., "hard work pays off" or "plan for the worst." Theme can apply to lots of stories; plot is unique to one.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five elements: Character, Setting, Plot, Problem, Solution.',
        'Plot = beginning + middle + end.',
        'Theme = the big lesson, not the events.',
        'Almost every story has these pieces — you can map them out.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Pick a book you\'ve read recently. Map its five story elements.',
      hint: 'If you can\'t find a clear problem, the story might be a slice-of-life rather than problem-and-solution.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
