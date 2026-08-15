/**
 * AP Literature — Free-response (Q3) essay strategy.
 *
 * Apply a thematic prompt to a NOVEL or PLAY of your choice.
 * Picking the right work, planning, integrating textual evidence.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_LIT_Q3_ESSAY: LessonPlan = {
  id: 'evelyn.ap.lit.q3-essay-novel-analysis.v1',
  title: 'Novel/play analysis essay (AP Lit Q3)',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'test-prep',
  topic: 'ap-test-strategy',
  locale: 'en',
  los: [
    {
      id: 'aplit.q3-essay',
      description: 'Plan and write an effective Q3 (open-question) essay analyzing a novel or play.',
      standard: 'AP-LIT-ESSAY-3',
    },
  ],
  prerequisites: ['aplit.prose-essay'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Q3 rewards depth of preparation.',
      script: 'Q3 gives you an open prompt and asks you to apply it to a NOVEL or PLAY of "literary merit". You pick the work. The student who knows 2-3 novels DEEPLY beats the student who knows 10 superficially. Choose well, prepare thoroughly.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Choosing works + reading the prompt + structure + integration.',
      keyIdeas: [
        'CHOOSE WORKS IN ADVANCE: pick 2-3 novels or plays you know thoroughly. Common excellent choices: Beloved, The Great Gatsby, Hamlet, Their Eyes Were Watching God, Crime and Punishment.',
        'WORKS should be COMPLEX (rich enough for multiple themes), of LITERARY MERIT (graders recognize them), and ones you actually KNOW.',
        'READ THE PROMPT CAREFULLY: it\'s a SPECIFIC question, not a general "write about themes". Re-read until you can state what it asks in your own words.',
        'PICK THE WORK that BEST addresses the specific prompt. If your prepared works don\'t fit, choose the one that\'s closest and adapt.',
        'PLAN: thesis stating your CLAIM about the work in response to the prompt. 2-3 body paragraphs, each focused on a specific element (character, scene, motif).',
        'STRUCTURE — body paragraph: claim → SPECIFIC plot reference + brief quotation if you remember + analysis of HOW it supports your claim.',
        'AVOID: pure plot summary. The graders know the book; they want ANALYSIS.',
        'CONCLUSION: synthesize. Don\'t just restate. Show how the elements together support your thesis.',
        'SCORING: thesis (1) + evidence/commentary (4) + sophistication (1) = 6 points.',
      ],
      vocabulary: [
        { term: 'literary merit', definition: 'works recognized as literarily significant; suitable for college-level analysis.' },
        { term: 'thesis', definition: 'a clear, defensible argument the essay defends.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-prompt',
      kind: 'worked_example',
      problem: 'Sample prompt: "Some authors use a single object as a powerful symbol throughout a work. Choose a novel or play and analyze how a recurring object contributes to the work\'s meaning." How would you approach with The Great Gatsby?',
      steps: [
        'OBJECT in Gatsby: the green light at the end of Daisy\'s dock. Recurring symbol.',
        'WHAT IT MEANS at different points:',
        '  Early: Gatsby reaches for it across the water — symbol of his hope and aspiration.',
        '  Middle: still distant, despite his wealth and effort.',
        '  End: Nick reflects "we beat on, boats against the current" — light becomes symbol of unattainable American Dream.',
        'THESIS: "In The Great Gatsby, the green light evolves from a personal token of Gatsby\'s longing for Daisy into a universal symbol of the impossibility of recapturing the past, ultimately critiquing the American Dream itself."',
        'BODY 1: green light as Gatsby\'s personal aspiration.',
        'BODY 2: green light as critique of materialism (he ACHIEVES wealth but not Daisy).',
        'BODY 3: green light in Nick\'s closing as symbol for ALL human striving against an irreversible past.',
        'ANALYSIS at each step: HOW the recurring symbol shifts meaning, deepening the work\'s critique.',
      ],
      answer: 'green light as evolving symbol — personal longing → American Dream critique',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is choosing a work you KNOW WELL more important than choosing the "smartest" work?',
      expectedAnswer: 'you can\'t analyze well a book you don\'t remember; specific evidence beats name-dropping a famous title',
      responseFormat: 'free',
      hints: [
        'Graders reward specific evidence.',
        'A novel you barely remember produces vague, summary-heavy essays.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mention-themes',
      kind: 'misconception_check',
      question: 'Is listing several themes the work explores enough for a strong essay?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Cataloging themes.',
          correctsTo: 'No — strong essays make a SINGLE focused argument, supported by specific evidence. Listing themes is shallow. Pick ONE thesis-worthy claim and develop it deeply.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Prepare 2-3 novels/plays deeply — don\'t scattershot many.',
        'Read the prompt CAREFULLY; pick the work that best addresses it.',
        'Single focused thesis. Avoid summary.',
        'Each body paragraph: claim + specific evidence + analysis.',
        'The 6-point essays integrate evidence with sophisticated insight.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are some works MORE flexible across many prompts (Gatsby, Beloved) while others are narrower?',
      hint: 'Works with multiple complex layers (race, class, gender, time, identity, narrative structure) can fit many prompts. Narrower works only fit specific themes. When choosing study works, prefer rich multi-layer texts.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
