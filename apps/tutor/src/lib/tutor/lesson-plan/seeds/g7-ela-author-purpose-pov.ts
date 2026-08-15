/**
 * G7 — ELA: Author's purpose and point of view.
 *
 * Why was this written? Who's telling it? PIE (Persuade-Inform-
 * Entertain) for purpose. First-person, second-person, third-person
 * (limited / omniscient) for narrative point of view. Recognize
 * that the SAME information sounds different depending on who's
 * telling it and why.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_ELA_AUTHOR_PURPOSE_POV: LessonPlan = {
  id: 'evelyn.g7.ela.author-purpose-pov.v1',
  title: 'Author\'s Purpose and Point of View',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'ela',
  topic: 'reading-comprehension',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.rl.7.6',
      description: 'Analyze how an author develops and contrasts the points of view of different characters or narrators.',
      standard: 'CCSS.ELA-LITERACY.RL.7.6',
    },
    {
      id: 'ccss.ela.ri.7.6',
      description: 'Determine an author\'s point of view or purpose and analyze how the author distinguishes their position.',
      standard: 'CCSS.ELA-LITERACY.RI.7.6',
    },
  ],
  prerequisites: ['ccss.ela.rl.5.6'],
  followUps: ['ccss.ela.rl.8.6'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show how the same event sounds different in different voices.',
      script: 'A car accident happens on a busy street. The DRIVER might tell it as "out of nowhere, this guy ran a red light." A WITNESS might tell it as "the driver was clearly going too fast, and another car couldn\'t stop in time." A REPORTER writing for the news might tell it as "Two cars collided at 5th and Main; one driver was cited." Same event, three completely different versions. That\'s point of view.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-purpose-and-pov',
      kind: 'concept',
      goal: 'PIE for purpose; four narrator types for fiction; how POV shapes what the reader knows.',
      keyIdeas: [
        'AUTHOR\'S PURPOSE — why did they write this? "PIE":',
        '  PERSUADE — convince you to think or do something. (Editorials, ads, opinion pieces.)',
        '  INFORM — give you facts or explain. (Textbooks, news articles, encyclopedias.)',
        '  ENTERTAIN — tell a story or amuse. (Novels, poems, plays.)',
        'A text can have more than one purpose, but usually one is dominant.',
        'POINT OF VIEW (POV) — who\'s telling the story?',
        '  FIRST PERSON ("I", "me", "we"): a character in the story tells it. Limited to what they know and feel.',
        '  SECOND PERSON ("you"): rare; addresses the reader directly. Common in instructions and choose-your-own-adventure.',
        '  THIRD PERSON LIMITED ("he", "she", "they"): narrator outside the story, but follows ONE character\'s thoughts.',
        '  THIRD PERSON OMNISCIENT: outside narrator who knows EVERY character\'s thoughts. (Omniscient = "all-knowing".)',
        'POV shapes what the reader knows. First person = inside one head, biased. Omniscient = god-mode.',
        'For NONFICTION the equivalent question is: what is the author\'s STANCE on the topic? Pro, anti, neutral?',
      ],
      vocabulary: [
        { term: 'author\'s purpose', definition: 'the reason the author wrote the text — persuade, inform, or entertain.' },
        { term: 'point of view', definition: 'who is telling the story; what perspective the narration takes.' },
        { term: 'first person', definition: 'the narrator is a character — uses "I" and "me".' },
        { term: 'omniscient', definition: 'all-knowing; the narrator knows every character\'s thoughts.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-identify',
      kind: 'worked_example',
      problem: 'Identify purpose and POV: "I never thought I\'d say this, but middle school is genuinely fun. Let me tell you about my first week..."',
      steps: [
        'POV: "I", "my" — FIRST PERSON. The narrator is speaking from inside their own experience.',
        'Purpose: not really persuading anyone of anything; could be informing about middle school OR entertaining with a personal story.',
        'The casual "let me tell you" tone leans entertain. PIE: ENTERTAIN (with some inform).',
      ],
      answer: 'POV: first person. Purpose: entertain (with inform).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-omniscient',
      kind: 'worked_example',
      problem: 'Identify POV: "Maya knew Chen was hiding something — but Chen was certain Maya hadn\'t noticed. Both of them spent the whole afternoon pretending."',
      steps: [
        'The narrator tells us what MAYA knows AND what CHEN believes — two different characters\' inner thoughts in one paragraph.',
        'No "I" — third person.',
        'Following more than one character\'s thoughts → THIRD PERSON OMNISCIENT.',
      ],
      answer: 'Third person omniscient',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A short article opens: "Studies show that students who get 9+ hours of sleep score significantly higher on tests. Therefore, schools should start later." What is the author\'s purpose?',
      expectedAnswer: 'persuade',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Persuade', correct: true },
        { id: 'b', text: 'Inform' },
        { id: 'c', text: 'Entertain' },
      ],
      hints: [
        'The "therefore, schools should..." — is the author trying to influence what we do?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-i-equals-author',
      kind: 'misconception_check',
      question: 'In a fiction novel, the narrator says "I". Asha concludes the author is the narrator. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating first-person narrator with the author themselves.',
          correctsTo: 'Wrong. In fiction, the "I" is a CHARACTER the author created. The author can write a novel from the first-person POV of a teenage girl, an alien, a cat, anyone. The narrator and the author are two different things — even in nonfiction, the author chooses what voice to use.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PIE: Persuade, Inform, Entertain.',
        'First-person POV uses "I" and is limited to one character\'s view.',
        'Third-person limited follows ONE character; omniscient follows MANY.',
        'Same event sounds different based on who tells it and why.',
        'Narrator ≠ author, even when the narrator says "I".',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find a paragraph in a book and identify the POV. How would the meaning change if the POV switched to a different character?',
      hint: 'A scene from the antagonist\'s POV often makes their actions feel more sympathetic — POV shapes what the reader cares about.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
