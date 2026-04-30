/**
 * SAT — Reading: Evidence-based questions and main idea.
 *
 * The SAT Reading section is heavily evidence-driven. "Best supports
 * the previous answer" pairs, line-reference questions, main-idea
 * questions, vocabulary in context. Strategy: answer the harder
 * question first (the actual claim), then pick evidence that
 * matches your answer — not the other way around.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_READING_EVIDENCE: LessonPlan = {
  id: 'evelyn.testprep.sat.reading.evidence.v1',
  title: 'SAT Reading: Evidence-Based Questions',
  curriculum: 'SAT',
  grade: '11',
  subject: 'test-prep',
  topic: 'sat-reading',
  locale: 'en',
  los: [
    {
      id: 'sat.reading.evidence',
      description: 'Use textual evidence and main idea reasoning to answer SAT Reading questions.',
    },
  ],
  prerequisites: ['ccss.ela.rl.6.1'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the SAT\'s evidence-pair format as the dominant move.',
      script: 'On the SAT Reading section, you\'ll see TWO-question chains constantly: "What does the author argue?" then "Which line BEST SUPPORTS your answer?" This pair format is worth ~25% of the section. Master one strategy and you bank a quarter of Reading.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-evidence-strategy',
      kind: 'concept',
      goal: 'Strategy for evidence pairs + line-reference moves + vocabulary-in-context.',
      keyIdeas: [
        'EVIDENCE PAIR strategy:',
        '  Step 1: answer the FIRST question (the harder, content question) using your own understanding.',
        '  Step 2: find the line in the passage that PROVES your answer — quote-by-quote.',
        '  Step 3: match that line to one of the four evidence-question choices.',
        '  ALTERNATIVE: if you\'re stuck on Q1, work backward — the four evidence choices in Q2 narrow the relevant lines. Read each one and see which best supports a Q1 answer.',
        'LINE-REFERENCE questions ("In line 12-14, the author...") — always read 2-3 lines BEFORE and 2-3 lines AFTER the cited lines. Context matters.',
        'MAIN IDEA / PURPOSE questions: ask "what is this passage MOSTLY about?" or "what is the author\'s main point?" Avoid choices that are too narrow (a single detail) or too broad (a generic theme).',
        'VOCABULARY-IN-CONTEXT: the SAT picks common-meaning words being used in less-common ways.',
        '  STRATEGY: cover the answer choices, re-read the sentence with the word, predict your own substitute. Then pick the closest match.',
        '  TRAP: the most-common dictionary definition is often the WRONG answer. The SAT picks the secondary or context-driven meaning.',
        'INFERENCE questions: "the author would most likely agree that..." — must be SUPPORTED by the passage, not just plausible.',
        'WRONG-ANSWER patterns: extreme language ("always", "never"), out-of-scope claims, half-true (mixes a fact with a wrong twist).',
      ],
      vocabulary: [
        { term: 'evidence pair', definition: 'a two-question chain: claim + which line supports it.' },
        { term: 'inference', definition: 'a conclusion supported by — but not directly stated in — the text.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-strategy',
      kind: 'worked_example',
      problem: 'Walk through the SAT evidence-pair strategy on this scenario: Q1 asks "What is the author\'s view on X?" with four choices. Q2 asks "Which line best supports the previous answer?"',
      steps: [
        'STEP 1: Answer Q1 first using the passage. Predict the author\'s view in your own words BEFORE looking at choices.',
        'STEP 2: Match your prediction to one of Q1\'s four choices.',
        'STEP 3: Now go to Q2. Read each cited line. Pick the one that DIRECTLY supports your Q1 answer.',
        'STEP 4: If your Q2 line doesn\'t obviously support any Q1 answer, RECONSIDER Q1. The two answers must MATCH. If they don\'t, one of them is wrong.',
        'KEY: Q1 and Q2 are linked. They confirm each other. If they don\'t fit together, you picked wrong on at least one.',
      ],
      answer: 'See 4-step strategy',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-vocab',
      kind: 'worked_example',
      problem: 'In context: "The professor maintained that climate change was accelerating." What does MAINTAINED mean here?',
      steps: [
        'Common dictionary meaning: "kept up", "preserved" (e.g., maintained a car).',
        'But here, "maintained THAT [a claim]" — clearly not "preserving an object".',
        'Substitute: in context, "the professor INSISTED" or "ASSERTED" or "ARGUED" that climate change was accelerating.',
        'So MAINTAINED here = asserted or argued. The SAT loves this kind of "what does the common word mean in THIS sentence" question.',
      ],
      answer: 'asserted / argued / claimed',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'On an evidence pair, you\'ve answered Q1 confidently. The Q2 evidence options are 4 line references. Should you read each line, or jump straight to the one closest to your prediction?',
      expectedAnswer: 'Read each — pick the strongest support',
      responseFormat: 'free',
      hints: [
        'Two of the four might LOOK related to your answer.',
        'Always pick the BEST support, not just an OK one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-extreme-language',
      kind: 'misconception_check',
      question: 'A choice on a Reading question reads "The author believes ALL scientists ALWAYS support this theory." Should this raise a red flag?',
      commonErrors: [
        {
          answer: 'no — extreme language is fine',
          misconception: 'Trusting choices with sweeping claims.',
          correctsTo: 'Yes — RED FLAG. SAT passages rarely make absolute claims. "All", "always", "never", "every" are wrong-answer signals. Authors hedge: "many", "often", "tend to". Choose the choice that matches the passage\'s level of certainty, not one that\'s more extreme.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Evidence pairs: answer Q1 first, then find supporting line for Q2. Both must match.',
        'Line references: read 2-3 lines around the cited window.',
        'Vocab-in-context: predict your own substitute, then match. Don\'t pick the most-common meaning by default.',
        'Avoid extreme language ("always", "never") — usually wrong.',
        'Inference must be supported by the passage, not just plausible.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'On hard reading passages (especially older texts), what do you do if you don\'t understand a paragraph at all?',
      hint: 'Read the FIRST and LAST sentences carefully (often where main ideas live). Skim the middle for ANY clear claim. Move on to questions — sometimes the questions tell you what to look for and you can come back.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
