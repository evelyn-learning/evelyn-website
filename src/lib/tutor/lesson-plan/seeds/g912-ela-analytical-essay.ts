/**
 * Grades 9-12 ELA — Analytical Essay Structure.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_ANALYTICAL_ESSAY: LessonPlan = {
  id: 'evelyn.g912.ela.analytical-essay.v1',
  title: 'Grades 9-12 ELA — Analytical Essay Structure',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.analytical-essay',
      description: 'Plan and write a literary or rhetorical analysis essay with a debatable thesis, structured body, integrated evidence, and analytical depth.',
      standard: 'CCSS.ELA-LITERACY.W.11-12.2',
    },
  ],
  prerequisites: ['g912.ela.narrative-advanced'],
  followUps: ['g912.ela.literature-periods'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'An analytical essay isn\'t a summary or a reaction — it\'s an ARGUMENT about how a text works.',
      script: 'You\'ll write dozens of analytical essays in college. The form: thesis defending a debatable interpretation, body paragraphs each developing one element, evidence from the text, analysis that explains HOW evidence supports thesis. Today we drill the structure that makes analysis sing.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-analytical',
      kind: 'concept',
      goal: 'Structure + thesis + body + analysis depth.',
      keyIdeas: [
        'STRUCTURE: introduction (with hook + thesis) → body (multiple paragraphs, each one analytical claim) → conclusion (implications).',
        'DEBATABLE THESIS: "The author uses fragmented narrative structure to mirror the protagonist\'s psychological dislocation, suggesting that recovery requires reassembling identity from fragments." (Specific, complex, debatable.)',
        'WEAK THESIS: "The novel is interesting." Not arguable. Not specific.',
        'BODY PARAGRAPH structure: 1) Topic sentence (a sub-claim of thesis). 2) Evidence (quote with citation). 3) Analysis (HOW evidence supports the sub-claim AND the thesis). 4) Synthesis sentence linking back.',
        'ANALYSIS DEPTH: don\'t just describe what the text does — explain WHY and to what EFFECT.',
        'EVIDENCE INTEGRATION: signal phrase + quote + citation + analysis. Never drop quotes naked.',
        'TRANSITIONS BETWEEN PARAGRAPHS: each new paragraph should relate to the previous. "Building on this..." or "While the imagery establishes X, the structure...".',
        'CONCLUSION: don\'t summarise. Show implications. What does the analysis mean for understanding the text? The author? The genre?',
        'AVOID: plot summary, opinion without evidence, vague generalities.',
      ],
      vocabulary: [
        { term: 'analytical essay', definition: 'an essay that argues an interpretation of a text using structured evidence and analysis.' },
        { term: 'thesis', definition: 'a debatable claim that an essay defends.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-analytical-paragraph',
      kind: 'worked_example',
      problem: 'Write an analytical body paragraph about how an author uses repetition to convey grief in a poem.',
      steps: [
        'TOPIC SENTENCE: "The poem\'s structural reliance on repetition transforms private grief into ritual."',
        'EVIDENCE: "The phrase \'and still she waits\' appears in three of the four stanzas, each time followed by a different image of decay."',
        'ANALYSIS: "Each repetition mimics the cyclic nature of mourning — return to the same emotional ground, different details around it. By placing decay-images after each repetition, the author suggests that waiting is not passive but actively wearing."',
        'SYNTHESIS: "This structural choice supports the thesis: grief is portrayed not as a moment but as a relentless return, a daily reckoning with absence."',
        'Notice: each sentence does work. No filler.',
      ],
      answer: 'Topic sentence + evidence + analysis + synthesis.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Improve this thesis: "Macbeth is a tragic play about ambition."',
      expectedAnswer: 'Sample improvement: "Shakespeare\'s Macbeth depicts ambition not merely as a moral failing but as a force that hollows out identity, leaving its bearer unable to recognise himself or others — the play\'s tragedy lies less in the murders than in this loss of self."',
      responseFormat: 'free',
      hints: [
        'Original is too vague — what SPECIFIC argument about ambition?',
        'Add a debatable interpretation; specify HOW.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-summary',
      kind: 'misconception_check',
      question: 'A student\'s analytical essay devotes paragraphs to summarising plot before any analysis. Why is this weak?',
      commonErrors: [
        {
          answer: 'Plot summary first',
          misconception: 'Treating analytical essay as a place to recap the work.',
          correctsTo: 'The reader has read the work. Don\'t spend energy summarising. Analytical essays should ARGUE FROM PAGE ONE. Reference plot details only as evidence for analytical points. If you find yourself summarising, ask: "what claim does this support?" If none, cut. Analysis should DOMINATE; summary is a tool.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Debatable thesis: specific, complex, arguable.',
        'Body: topic sentence + evidence + ANALYSIS + synthesis.',
        'Analyse, don\'t summarise.',
        'Integrate quotes; never drop them.',
        'Conclusion: implications, not summary.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are analytical essays sometimes called "argumentative"?',
      hint: 'Because they ARGUE for an interpretation. Many readings of a text are possible; the analytical essay defends ONE as valid (or strongest) using evidence and reasoning. The reader is expected to be skeptical; the essay must convince. This argumentative structure is why analytical essays follow rhetorical conventions — claim, evidence, reasoning — like persuasive writing in general.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
