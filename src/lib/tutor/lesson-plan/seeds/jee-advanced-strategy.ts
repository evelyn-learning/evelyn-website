/**
 * JEE Advanced — overall exam strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_ADVANCED_STRATEGY: LessonPlan = {
  id: 'evelyn.jee.advanced.strategy.v1',
  title: 'JEE Advanced exam strategy',
  curriculum: 'NCERT',
  grade: '12',
  subject: 'math',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'jee.advanced-strategy',
      description: 'Apply effective strategy to JEE Advanced: format, partial-credit marking, time management, problem-selection, accuracy vs speed.',
      standard: 'JEE-ADV',
    },
  ],
  prerequisites: ['jee.main-strategy'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'JEE Advanced is harder, more conceptual, with subtle marking.',
      script: 'JEE Advanced is the path to the IITs — only ~16,000 seats, ~250,000 takers. The exam is RADICALLY different from Main: TWO 3-hour papers in one day, multiple-correct questions, partial credit, no negative on numerical, integer-type answers, paragraph-based questions. You can\'t just memorize formulas — Advanced tests CONCEPTUAL DEPTH. Strategy here is about WHICH questions to attempt, not how many.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Format, marking subtleties, attempt strategy.',
      keyIdeas: [
        'FORMAT: TWO PAPERS in a single day (Paper 1 morning, Paper 2 afternoon). Each ~3 hours, 54 questions. 18 in each subject (Phys, Chem, Math). Total: 108 questions.',
        'QUESTION TYPES vary year to year but typically: SINGLE CORRECT MCQ (+3 / −1), MULTIPLE CORRECT MCQ (+4 / −2 — partial credit if SOME correct chosen and NO incorrect), INTEGER ANSWERS (+3 / 0), PARAGRAPH-BASED (linked questions sharing context).',
        'MULTIPLE-CORRECT marking is the trickiest: you get +1 per correctly marked option AND lose −2 if you mark any incorrect option. Best strategy: mark only the options you\'re CONFIDENT are correct. Don\'t guess — −2 is severe.',
        'TIME MANAGEMENT: ~3.3 min per question, but the spread is huge — some Qs take 10+ minutes, some are 1-min. Attempt easy ones first.',
        'ATTEMPT STRATEGY: read ALL questions first to get a sense of relative difficulty. Mark which to attempt first (E), which to attempt second (M), which to skip or attempt last (H). Then work through E → M → H.',
        'DON\'T LINGER: if a question takes 8+ minutes without progress, MOVE ON. Returning fresh often unlocks it. Sunk-cost fallacy is the most common failure.',
        'PAPERS COMBINED: total marks across Paper 1 + Paper 2 determine rank. Equally weighted. Mistakes in Paper 1 can be partially compensated in Paper 2.',
        'CHEMISTRY OFTEN EASIER: strong students often clean up chem first, then physics, then math (math has the highest ceiling). Adjust to your profile.',
        'NUMERICAL/INTEGER: no negative marking. Always attempt — even an educated guess yields expected value > 0.',
        'CONCEPTUAL DEPTH: JEE Advanced tests UNDERSTANDING, not formulas. A math problem may need calculus, geometry, AND algebra integrated. A physics problem may chain mechanics, electromagnetism, AND optics. Cross-topic mastery is essential.',
      ],
      vocabulary: [
        { term: 'partial credit', definition: 'Advanced multiple-correct questions give +1 per correctly marked option, with a heavy penalty for any wrong selection.' },
        { term: 'paragraph-based questions', definition: 'a shared paragraph followed by 2-3 linked questions; understanding the paragraph unlocks all of them.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-multi-correct',
      kind: 'worked_example',
      problem: 'A multiple-correct question has 4 options. You\'re sure (A) is correct, leaning (B) correct, unsure about (C) and (D). Marking scheme is: +4 if all correct only; partial credit −2 if any incorrect, +1 per correct marked. What should you mark?',
      steps: [
        'Mark only (A): +1 (sure). Risk: 0.',
        'Mark (A) + (B): +2 if both correct, −2 if (B) wrong (penalty applies). Net: depends on probability (B) is correct.',
        'Mark (A) + (B) + (C): higher upside, but each addition adds risk of −2. Marking 3 right options = +3; one wrong = −2. Need (C) probability > 50% to be worth it.',
        'Mark all 4: +4 if all 4 correct; if any 2 wrong, you lose −2 for the wrong marking + you don\'t get +1 for that one. Risky unless you\'re confident in all four.',
        'OPTIMAL STRATEGY: mark only options you\'re ≥75% confident in. The −2 penalty for one wrong selection is severe. Better to score +1 with confidence than risk −2 to chase +4.',
        'CONCRETE: mark (A) only if very unsure. Mark (A) + (B) if reasonably sure (B) is right. Skip (C) and (D) unless confident.',
      ],
      answer: 'Mark only options you\'re strongly confident are correct. The asymmetric penalty rewards caution.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why are paragraph-based questions both an opportunity AND a risk on JEE Advanced?',
      expectedAnswer: 'Opportunity: understanding the paragraph unlocks 2-3 linked questions efficiently — high yield per concept. Risk: misreading the paragraph corrupts ALL the linked answers — a single comprehension error compounds. Reread the paragraph carefully before attempting any of its questions, and verify your interpretation against the first question\'s answer logic.',
      responseFormat: 'free',
      hints: [
        'What\'s shared across the linked questions?',
        'What happens if you misunderstand the paragraph?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-attempt-everything',
      kind: 'misconception_check',
      question: 'Should you try to attempt ALL questions on JEE Advanced even if you\'re uncertain?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating Advanced like Main where attempting more = better.',
          correctsTo: 'No. Advanced rewards SELECTIVITY. With negative marking on most question types AND multiple-correct\'s severe −2 penalty, blind attempts on hard questions destroy your score. Top rankers often attempt 60-70% of questions but with high accuracy on those they answer. Knowing what to skip is a learnable skill — it\'s about RECOGNIZING question types within 30 seconds of reading and budgeting time accordingly.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two papers, 3 hr each. Multi-correct + integer + paragraph-based.',
        'Multi-correct: only mark options you\'re ≥75% confident in (−2 penalty).',
        'Read all questions first; attempt easy → medium → hard.',
        'Selectivity > completeness. Top rankers skip ~30% of questions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does JEE Advanced specifically test CROSS-TOPIC integration (e.g., a problem combining electrostatics + calculus + symmetry)?',
      hint: 'Engineering and research demand integration of concepts across domains. A pure-mechanics problem only tests one skill; a problem requiring you to FRAME the physics, choose the right calculus method, and exploit symmetry tests whether you can THINK like an engineer. Coaching that drills topic-by-topic without integration produces students who fail Advanced. Practice cross-topic problems in the final 6 months.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
