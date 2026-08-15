/**
 * Grades 3-5 ELA — Point of View.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_POINT_OF_VIEW: LessonPlan = {
  id: 'evelyn.g35.ela.point-of-view.v1',
  title: 'Grades 3-5 ELA — Point of View',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.point-of-view',
      description: 'Identify first-person, second-person, and third-person points of view; explain how POV affects what the reader knows.',
      standard: 'CCSS.ELA-LITERACY.RL.5.6',
    },
  ],
  prerequisites: ['g35.ela.authors-purpose'],
  followUps: ['g35.ela.figurative-language'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The narrator decides what you SEE — different points of view give very different stories.',
      script: 'A wolf tells the story of the Three Little Pigs from his perspective: he was just hungry, and the pigs were rude. Same plot, different POV → completely different feeling. Knowing the POV helps you understand whose eyes you\'re seeing through.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pov',
      kind: 'concept',
      goal: 'Three POV types + signals + reader effect.',
      keyIdeas: [
        'FIRST-PERSON POV: narrator is a character in the story. Pronouns: I, me, my, we, us. Reader sees ONLY this character\'s thoughts and observations.',
        'SECOND-PERSON POV: narrator addresses YOU. Pronouns: you, your. Common in instructions, choose-your-own-adventure books, recipes.',
        'THIRD-PERSON POV: narrator is OUTSIDE the story. Pronouns: he, she, they. Two main types:',
        'THIRD-PERSON LIMITED: narrator follows ONE character\'s thoughts and observations.',
        'THIRD-PERSON OMNISCIENT: narrator knows ALL characters\' thoughts; can shift between perspectives.',
        'EFFECTS ON READER: 1st-person feels personal, intimate, BUT limited to one character\'s view (which may be biased or wrong). 3rd-person omniscient gives full picture but feels distant.',
        'CHANGING POV: the SAME story told from different POVs reveals different information and emotions.',
        'NOT TO CONFUSE: POV is who tells the story; PERSPECTIVE/OPINION is what someone thinks about something. Different concepts.',
      ],
      vocabulary: [
        { term: 'point of view', definition: 'the perspective from which a story is told.' },
        { term: 'omniscient', definition: 'all-knowing; in third-person omniscient, the narrator knows the thoughts of all characters.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pov',
      kind: 'worked_example',
      problem: 'Identify the POV: "Jamal couldn\'t believe his eyes. The dog he\'d been searching for was sitting on his porch, wagging its tail."',
      steps: [
        'Look for pronouns. We see "Jamal", "his", "he\'d" — third-person pronouns.',
        'Are we inside Jamal\'s head? We see "couldn\'t believe his eyes" — we know his reaction. So narrator follows JAMAL\'s thoughts.',
        'Do we hear other characters\' thoughts? Not in this passage.',
        'POV: Third-person LIMITED (focused on Jamal).',
      ],
      answer: 'Third-person limited (Jamal\'s perspective).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the POV: "I crept down the stairs as quietly as I could, trying not to wake my brother."',
      expectedAnswer: 'First-person',
      responseFormat: 'free',
      hints: [
        'Look at the pronouns: I, my.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pronouns',
      kind: 'misconception_check',
      question: 'A student sees "you" in a passage and immediately calls it second-person POV. The passage says: "I told you we should leave early!" Was the student right?',
      commonErrors: [
        {
          answer: 'Second-person',
          misconception: 'Spotting "you" without checking who is speaking and who "you" refers to.',
          correctsTo: 'The "I" tells you the NARRATOR is a character. The "you" is something this character is saying TO another character — it\'s dialogue. POV is FIRST-PERSON (narrator says "I"), not second-person. Second-person POV addresses YOU, the reader, throughout — like instructions or a recipe. Always look at the dominant pronouns and the narrator\'s position.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'First-person: I, me, we — narrator is in the story.',
        'Second-person: you — narrator addresses reader.',
        'Third-person: he, she, they — narrator outside. Limited (one character\'s thoughts) or omniscient (all).',
        'POV affects what reader knows + felt distance.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How would the experience of reading "Cinderella" change if it were told in first-person from the stepmother\'s POV?',
      hint: 'You\'d see Cinderella as the stepmother does (perhaps as a rival), and you\'d hear the stepmother\'s justifications for her actions. The story might feel less sympathetic to Cinderella; you might understand the stepmother\'s motives — even if you still disagree. POV shifts can humanise or villainise different characters.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
