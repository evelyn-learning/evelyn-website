/**
 * Grades 3-5 ELA — Author's Purpose.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_AUTHORS_PURPOSE: LessonPlan = {
  id: 'evelyn.g35.ela.authors-purpose.v1',
  title: 'Grades 3-5 ELA — Author\'s Purpose',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.authors-purpose',
      description: 'Identify whether an author\'s purpose is to persuade, inform, entertain, or describe; cite evidence.',
      standard: 'CCSS.ELA-LITERACY.RI.4.6',
    },
  ],
  prerequisites: ['g35.ela.inference-evidence'],
  followUps: ['g35.ela.point-of-view'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why did the author write this? Knowing the answer helps you read smarter.',
      script: 'A cereal box ad and a cereal nutrition label are about the same product but written for different reasons. The ad wants you to BUY. The label wants you to KNOW. Same topic, different purpose. Today we drill the four big purposes.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-purpose',
      kind: 'concept',
      goal: 'PIE\'D framework + signals for each purpose.',
      keyIdeas: [
        'PIE\'D = Persuade, Inform, Entertain, Describe.',
        'PERSUADE: convince the reader of an opinion or to take action. Signals: opinion words ("best", "should", "must"), emotional language, calls to action. Examples: ads, editorials, opinion essays.',
        'INFORM: give facts and explain. Signals: factual statements, definitions, headings, charts. Examples: textbooks, news articles, encyclopedias.',
        'ENTERTAIN: make the reader feel emotion (joy, excitement, suspense). Signals: characters, dialogue, plot, vivid descriptions. Examples: novels, short stories, poems.',
        'DESCRIBE: paint a picture in words. Signals: sensory details, adjectives, metaphors. Examples: travel writing, character sketches, parts of stories.',
        'OVERLAP: many texts have multiple purposes. A historical novel ENTERTAINS while teaching history (informs).',
        'CITE EVIDENCE: identify specific words or sentences that signal the purpose.',
      ],
      vocabulary: [
        { term: 'author\'s purpose', definition: 'the reason an author writes a text — to persuade, inform, entertain, or describe.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-purpose',
      kind: 'worked_example',
      problem: 'Read this passage: "Recycling is one of the most important things YOU can do today. By tossing one plastic bottle in the recycling bin, you save energy, reduce waste, and protect our oceans for future generations. Start today!" What is the author\'s purpose?',
      steps: [
        'Look at signal words: "you", "should", "important", "start today" — calls to action and opinion language.',
        'Is the author trying to teach facts? Some facts ARE here (recycling saves energy), but the framing is to convince you to act.',
        'Purpose: PERSUADE.',
        'Evidence: "one of the most important" (opinion, not fact). "Start today!" (call to action). Direct address to "YOU".',
      ],
      answer: 'Persuade. Signals: opinion words, direct address, call to action.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the purpose: "The Pacific Ocean is the largest ocean on Earth, covering about 63 million square miles. It is bordered by Asia and Australia to the west and the Americas to the east."',
      expectedAnswer: 'Inform. Signals: facts, no opinions, encyclopedia-style language.',
      responseFormat: 'free',
      hints: [
        'Are there opinion words?',
        'Are there calls to action?',
        'What about straightforward facts?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-singular',
      kind: 'misconception_check',
      question: 'A student says a story can only have ONE purpose. Why might this be wrong?',
      commonErrors: [
        {
          answer: 'Stories have only one purpose',
          misconception: 'Treating purpose as exclusive when texts often serve multiple goals.',
          correctsTo: 'Many texts have OVERLAPPING purposes. A picture book can entertain (story) AND inform (real-world facts) AND teach a lesson (persuade about kindness). A biography informs about a person\'s life AND entertains with narrative. Identify the PRIMARY purpose first, then any secondary ones the text supports.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PIE\'D: Persuade, Inform, Entertain, Describe.',
        'Persuade: opinion words + call to action.',
        'Inform: facts + neutral tone.',
        'Entertain: characters + plot + emotion.',
        'Describe: sensory details.',
        'Texts often blend purposes — name the primary one.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A passage describes a sunset using vivid colours and metaphors but contains no characters, plot, or call to action. Which purpose dominates?',
      hint: 'DESCRIBE. Sensory details (colours), metaphors, no plot or persuasion. Often appears as a paragraph WITHIN a story whose overall purpose is to entertain.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
