/**
 * Digital SAT — Reading and Writing: Four Content Domains.
 *
 * R&W is now ONE merged section with 54 short passages, each followed by
 * one question. Each question maps to one of four content domains. This
 * plan covers domain identification + per-domain strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_DIGITAL_SAT_READING_WRITING_DOMAINS: LessonPlan = {
  id: 'evelyn.testprep.digital-sat.rw-domains.v1',
  title: 'Digital SAT Reading & Writing: Four Content Domains',
  curriculum: 'CollegeBoard',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-reading-writing',
  locale: 'en',
  los: [
    {
      id: 'digital-sat.rw-domains',
      description: 'Identify the four Reading and Writing content domains, the question types each tests, and apply per-domain strategy on Digital SAT short passages.',
      standard: 'SAT-DIGITAL-RW',
    },
  ],
  prerequisites: ['digital-sat.format-overview'],
  followUps: ['digital-sat.math-domains'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The merged R&W section uses short passages — but the question types still split into four domains.',
      script: 'The Digital SAT killed the long passages. Each question now has its own short passage of 25-150 words. Sounds easier — except now you can\'t skim once and answer five questions. Every question is independent and demands fresh focus. The good news: every question maps to ONE of four content domains, and once you can identify which domain a question is from, you know the strategy. Master four domain-specific approaches and you cover the entire R&W section.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-domains',
      kind: 'concept',
      goal: 'The four R&W domains, what they test, and how to recognize each.',
      keyIdeas: [
        'CRAFT AND STRUCTURE (~13-15 questions): Words in Context (vocabulary by inference), Text Structure & Purpose (why was this passage organized this way?), Cross-Text Connections (compare two short related passages — agree, disagree, build on, etc.). RECOGNIZE: vocabulary fill-in-the-blank, "why does the author...", paired passages.',
        'INFORMATION AND IDEAS (~12-14 questions): Central Ideas & Details, Command of Evidence (which choice supports the claim?), Inferences (what conclusion is supported?), Quantitative Evidence (read a chart/table that accompanies the passage). RECOGNIZE: "main idea", "best evidence", "implies / suggests", graph or table accompaniment.',
        'STANDARD ENGLISH CONVENTIONS (~11-15 questions): Boundaries (commas, semicolons, colons, dashes, sentence structure), Form/Structure/Sense (subject-verb agreement, pronoun-antecedent, modifier placement, parallelism, verb tense). RECOGNIZE: short sentence with a blank, four punctuation/grammar choices.',
        'EXPRESSION OF IDEAS (~8-12 questions): Rhetorical Synthesis (combine bullet-pointed notes into a sentence that meets a stated goal), Transitions (which connector — however, therefore, furthermore — fits between two ideas?). RECOGNIZE: "the writer wants to...", bullet-list passages, transition-word fill-in.',
        'DOMAIN ORDER on the test: questions are arranged in the order Craft & Structure → Information & Ideas → Standard English Conventions → Expression of Ideas. So the first ~14 are vocabulary/structure; middle ~12 are evidence/inference; then ~12 grammar; then ~10 rhetoric. PACING TIP: if you\'re running low on time, don\'t skip ahead — Standard English Conventions questions are often the fastest, so working in order generally serves you well.',
        'PASSAGE TOPICS span: literary fiction (often classics from the 18th-19th centuries), history (founding documents, civil rights, "Great Conversation" texts), science (research summaries, data charts), humanities. Topic doesn\'t change strategy — domain does.',
      ],
      vocabulary: [
        { term: 'Words in Context', definition: 'a Craft & Structure question type asking which word fits the blank based on passage meaning.' },
        { term: 'Rhetorical Synthesis', definition: 'an Expression of Ideas question type asking which sentence best combines bullet-point notes per a stated goal.' },
        { term: 'Cross-Text Connections', definition: 'a Craft & Structure question type pairing two short passages and asking how they relate.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-rhetorical-synthesis',
      kind: 'worked_example',
      problem: 'Expression of Ideas — Rhetorical Synthesis. Bullets: (1) The blue whale is the largest animal ever known. (2) Its tongue alone weighs as much as an elephant. (3) Despite this size, the blue whale\'s diet is almost entirely krill — tiny shrimp-like creatures. (4) An adult blue whale eats up to 4 tons of krill per day. The student wants to emphasize the contrast between size and diet. Which sentence best does that?',
      steps: [
        'GOAL stated: emphasize CONTRAST between size and diet.',
        'Sentences combining all four bullets without contrast (e.g., "The blue whale is the largest animal and eats krill") MISS the goal.',
        'Sentences combining only size facts MISS the goal too.',
        'Look for a structure that highlights the unexpected pairing. Best candidate: "Despite being the largest animal ever known — with a tongue alone weighing as much as an elephant — the blue whale survives on krill, tiny shrimp-like creatures it consumes by the ton each day."',
        'KEY: "Despite" or "Although" framing makes the contrast explicit. Just listing facts misses the rhetorical goal.',
        'STRATEGY: in rhetorical synthesis, the GOAL determines which sentence wins. Ignore answer choices that are factually correct but don\'t serve the goal.',
      ],
      answer: 'A sentence using "Despite" or "Although" to frame size + diet as a contrast. Choices that just list facts without contrast lose.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A short passage describes a 19th-century scientist\'s arguments. The question asks: "Which choice best states the function of the underlined sentence in the text as a whole?" Which content domain is this?',
      expectedAnswer: 'Craft and Structure (specifically Text Structure & Purpose).',
      responseFormat: 'free',
      hints: [
        'The question is about the FUNCTION of a sentence, not the meaning.',
        'Domain that includes "why was this organized this way" — Craft and Structure.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skim-reading',
      kind: 'misconception_check',
      question: 'Since each Digital SAT R&W passage is short (25-150 words), you can skim instead of reading carefully. True or false?',
      commonErrors: [
        {
          answer: 'true — short passages don\'t need close reading',
          misconception: 'Treating brevity as a license to skim.',
          correctsTo: 'False. Short passages are DENSER, not easier. Every word can carry weight because there\'s no padding. Skimming costs you the nuance the question turns on — a tonal word, a transition, a qualifier. Read the passage fully (it only takes 30 seconds), then read the question, then return to the passage if needed. Skimming usually costs more time than it saves because you re-read after picking the wrong answer.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four R&W domains, in test order: Craft & Structure, Information & Ideas, Standard English Conventions, Expression of Ideas.',
        '54 questions across 2 modules. Each question has its own short passage.',
        'Recognize the domain quickly — strategy is domain-specific.',
        'Rhetorical synthesis: serve the STATED GOAL. Don\'t pick "all correct facts" — pick the one matching the goal.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the Digital SAT use one-question-per-passage instead of the old paper SAT\'s 10-question passages?',
      hint: 'Module-adaptive routing requires that each question be independently calibrated for difficulty. With 10 questions tied to one passage, you couldn\'t cleanly mix easy and hard items because the passage itself is shared. Atomizing each question to its own passage lets the test bank precisely target Module 1 difficulty mix and Module 2A vs 2B without coherence loss. Bonus: students who struggled with one passage no longer lose 10 questions — only one.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
