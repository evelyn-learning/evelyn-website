/**
 * Grades 6-8 ELA — Literary Analysis.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_LITERARY_ANALYSIS: LessonPlan = {
  id: 'evelyn.g68.ela.literary-analysis.v1',
  title: 'Grades 6-8 ELA — Literary Analysis',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.literary-analysis',
      description: 'Analyse literary elements (theme, character development, plot, conflict) in fiction; support claims with text evidence.',
      standard: 'CCSS.ELA-LITERACY.RL.7.2',
    },
  ],
  prerequisites: [],
  followUps: ['g68.ela.narrative-arc'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Literary analysis is detective work — find the clues, build the case, support with evidence.',
      script: 'A novel\'s message isn\'t usually stated outright. The author plants clues — character actions, recurring images, dialogue. Your job: collect the clues and build a claim about what they mean. Today we drill the analysis framework.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-analysis',
      kind: 'concept',
      goal: 'Elements + claim-evidence-warrant + textual analysis structure.',
      keyIdeas: [
        'CORE LITERARY ELEMENTS: theme (universal message), character (who), setting (where/when), plot (what happens), conflict (struggle), point of view (whose eyes).',
        'CHARACTER DEVELOPMENT: how does a character change? What events drive change? Static vs dynamic characters.',
        'CONFLICT TYPES: character vs character, character vs self, character vs nature, character vs society, character vs technology.',
        'CLAIM: a debatable statement about the text. NOT a fact summary. "The protagonist learns that loyalty has limits."',
        'EVIDENCE: specific quotes or scenes from the text that support the claim.',
        'WARRANT: explanation of HOW the evidence supports the claim. Don\'t leave this implicit.',
        'STRUCTURE for analysis paragraph: claim → evidence (quote with citation) → warrant → conclusion.',
        'AVOID: plot summary disguised as analysis. The reader has read the book; tell them what it MEANS.',
        'EVIDENCE QUALITY: 2-3 specific examples beat a list of 10 vague ones.',
      ],
      vocabulary: [
        { term: 'theme', definition: 'a universal message or insight conveyed through a literary work.' },
        { term: 'dynamic character', definition: 'a character who undergoes significant change during the story.' },
        { term: 'warrant', definition: 'the explanation of how a piece of evidence supports a claim.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-analysis',
      kind: 'worked_example',
      problem: 'Write an analysis paragraph claim about a character who initially refuses to help others but learns the value of community.',
      steps: [
        'CLAIM: "Through her transformation from solitary skeptic to loyal teammate, the protagonist demonstrates that community requires sacrificing individual comfort."',
        'EVIDENCE 1 (early): "When the others ask for help, she ignores them, choosing to read alone in the corner." (Quote/citation.)',
        'EVIDENCE 2 (turning point): "Faced with a problem too big for one, she reluctantly offers her skills, surprised at the relief she feels."',
        'WARRANT: "Her shift — from comfort in isolation to risk in collaboration — shows the author\'s argument: belonging costs the very independence we cling to."',
        'CONCLUSION: "By the end, she has internalised that community is worth the cost."',
      ],
      answer: 'Claim → 2 pieces of evidence → warrant → conclusion.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the conflict type in: "Maya battles fierce winds and freezing rain to deliver supplies to a remote village."',
      expectedAnswer: 'Character vs nature',
      responseFormat: 'free',
      hints: [
        'Who/what is Maya struggling against?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-summary-as-analysis',
      kind: 'misconception_check',
      question: 'A student writes "In the book, the main character finds a treasure and shares it with friends" as their analysis. Why isn\'t this analysis?',
      commonErrors: [
        {
          answer: '"Finds a treasure and shares it with friends"',
          misconception: 'Confusing summary (what happened) with analysis (what it means).',
          correctsTo: 'That\'s plot summary — describes events. ANALYSIS asks WHY and SO WHAT. "By choosing to share rather than hoard, the character rejects the materialist values of the village around him, suggesting the author believes wealth without generosity is empty." Now we have an interpretive claim with implications. Always push past summary toward meaning.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Analyse: theme, character, plot, conflict, POV.',
        'Structure: claim → evidence → warrant → conclusion.',
        'Make a debatable CLAIM, not a summary.',
        'Cite specific quotes; explain HOW they support the claim.',
        'Beware plot summary disguised as analysis.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is character vs self conflict different from character vs character?',
      hint: 'Character vs character: external. Two people in opposition. Character vs self: internal. The struggle is between desires, fears, beliefs INSIDE one person — guilt, doubt, temptation. Often the deeper conflict in literary fiction. A novel can have multiple conflict layers; identify which is primary.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
