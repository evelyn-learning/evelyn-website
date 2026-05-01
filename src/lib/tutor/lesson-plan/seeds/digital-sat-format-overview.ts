/**
 * Digital SAT — Format Overview, Module Adaptivity, Bluebook, Scoring.
 *
 * The SAT moved fully digital in the US in March 2024 (international
 * markets had switched in spring 2023). Currency-checked against the
 * College Board SAT Suite + Bluebook documentation + cross-referenced
 * with Piqosity / IvyMax / Test Ninjas guides for the module-adaptive
 * routing rules and the soft cap on Module 2A.
 */

import type { LessonPlan } from '../types';

export const SEED_DIGITAL_SAT_FORMAT_OVERVIEW: LessonPlan = {
  id: 'evelyn.testprep.digital-sat.format-overview.v1',
  title: 'Digital SAT: Format, Module Adaptivity, and Bluebook',
  curriculum: 'CollegeBoard',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-strategy',
  locale: 'en',
  los: [
    {
      id: 'digital-sat.format-overview',
      description: 'Describe the current Digital SAT format: section + module structure, multistage adaptive routing, Bluebook testing app, calculator policy, scoring, and how this differs from the pre-2024 paper SAT.',
      standard: 'SAT-DIGITAL',
    },
  ],
  prerequisites: [],
  followUps: ['digital-sat.reading-writing-domains', 'digital-sat.math-domains'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The Digital SAT is fundamentally different from the paper SAT — not just shorter.',
      script: 'The SAT went fully digital in the US in March 2024. New shape: 2 hours 14 minutes (was 3 hours), 98 questions (was 154), one section instead of three (Reading + Writing merged), calculator allowed throughout Math (no more no-calc section), and — biggest deal — the test is MULTISTAGE ADAPTIVE. Your Module 1 score in each section determines whether your Module 2 is easy or hard, and only the hard one lets you score above ~590 in that section. Knowing how the routing works changes how you pace Module 1.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-structure',
      kind: 'concept',
      goal: 'Sections, modules, timing, item counts.',
      keyIdeas: [
        'TWO SECTIONS only: (1) Reading and Writing — merged from the old separate Reading and Writing & Language sections. (2) Math — merged from the old no-calculator and calculator sections.',
        'EACH SECTION has TWO modules. Module 1 is fixed difficulty (mix of easy/medium/hard). Module 2 is adaptive — the difficulty depends on Module 1 performance.',
        'TIMING: Reading & Writing — 2 modules × 32 minutes × 27 questions each = 64 minutes total, 54 questions. Math — 2 modules × 35 minutes × 22 questions each = 70 minutes total, 44 questions. Plus a 10-minute break between sections. TOTAL ~2 hours 14 minutes.',
        'NO PENALTY for wrong answers (no negative marking). Always answer every question — guess if you must.',
        'BLUEBOOK is the College Board\'s testing app you take the test in (laptop or tablet). Built-in: Desmos graphing calculator, annotation tools, mark-for-review flag, countdown timer, reference sheet for math.',
        'CALCULATOR POLICY: graphing calculator allowed for ALL math questions. Desmos is built into Bluebook — you don\'t need to bring one, though you may bring an approved physical calculator as backup.',
        'WITHIN A MODULE you can navigate freely — go back, change answers, mark for review. BETWEEN modules you cannot — once you submit Module 1, it\'s locked.',
        'SCORING: 200-800 per section, 400-1600 total (same scale as paper SAT). Released within ~2 weeks via College Board portal.',
      ],
      vocabulary: [
        { term: 'multistage adaptive', definition: 'a test format where one stage\'s difficulty is fixed, and a later stage\'s difficulty is selected based on performance on the earlier stage.' },
        { term: 'Bluebook', definition: 'College Board\'s digital testing app for the SAT (and other digital exams).' },
        { term: 'mark for review', definition: 'a Bluebook flag that lets you tag a question to revisit later within the same module.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-routing',
      kind: 'concept',
      goal: 'How module routing affects scoring.',
      keyIdeas: [
        'MODULE 1 PERFORMANCE routes you to one of two Module 2 versions: Module 2A (EASIER mix) or Module 2B (HARDER mix). The threshold is roughly 66-70% correct on Module 1.',
        'MODULE 2A SCORE CAP: even with a perfect score, the maximum SECTION score is approximately 590-610 (varies slightly per form).',
        'MODULE 2B has NO score cap — the full 800 ceiling is available.',
        'IMPLICATION: Module 1 effectively decides whether you can score above 600 in that section. Treat Module 1 as if every question matters more than it does on a flat-difficulty exam — because it does.',
        'NO DELIBERATE FAILURE: don\'t intentionally miss Module 1 questions to "get the easy module" — you cap your score immediately. Always do your best on Module 1.',
        'CONTENT mix is the SAME on both Module 2 versions (all four content domains appear). Only DIFFICULTY of the questions differs.',
        'ADAPTIVITY IS PER SECTION — Reading & Writing routes independently of Math. Bombing Module 1 of one section doesn\'t affect the other.',
      ],
      vocabulary: [
        { term: 'routing threshold', definition: 'the Module 1 performance level (~66-70% correct) that determines whether you advance to the easy or hard Module 2.' },
        { term: 'score cap', definition: 'an upper bound on a section\'s score; applies to candidates routed to Module 2A.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You finish Module 1 of Math with 18 of 22 questions answered confidently and 4 you guessed on. What\'s the best estimate of your routing, and how should you approach Module 2?',
      expectedAnswer: 'If your 18 confident answers were mostly correct (say, ≥16/22 ≈ 73%), you likely route to Module 2B (hard). Approach Module 2B aware that questions skew harder — pace yourself, use Desmos liberally, and don\'t rush. If your guesses were wrong and you ended near 14/22 (~64%), you may route to Module 2A and your section score is already capped near 600. Either way, every Module 2 question still matters for your final score.',
      responseFormat: 'free',
      hints: [
        'Routing threshold is ~66-70% correct on Module 1.',
        '18 confident + some wrong guesses puts you near or above the threshold.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-skip-module1',
      kind: 'misconception_check',
      question: 'If you find Module 1 hard and run out of time, leaving 5 questions blank is fine because the Digital SAT has no penalty for wrong answers. True or false?',
      commonErrors: [
        {
          answer: 'true — no penalty means blank is safe',
          misconception: 'Confusing "no negative marking" with "no impact from blanks".',
          correctsTo: 'False. Blanks count as wrong answers for routing purposes — leaving 5 blank is the same as getting 5 wrong, which directly hurts your chance of routing to the hard Module 2. NO penalty for wrong answers means you should ALWAYS guess on questions you don\'t know — never leave anything blank. The routing algorithm doesn\'t know you ran out of time vs guessed wrong; both look like 5 missed questions.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '2 sections, each with 2 modules. R&W: 32 min × 27 Q × 2. Math: 35 min × 22 Q × 2. Total ~2h14m.',
        'Module 1 routes to Module 2A (easy, capped ~590-610) or Module 2B (hard, full 800).',
        'Calculator throughout Math; Desmos built into Bluebook. No penalty for wrong answers — always guess.',
        'Within a module: free navigation. Between modules: locked.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did College Board adopt multistage adaptive instead of question-by-question adaptive (like NCLEX or GRE)?',
      hint: 'Multistage gives candidates within-module navigation (you CAN go back inside a module) — students prefer it psychologically and it\'s closer to a "normal" test feel. Pure CAT locks each question once submitted, which feels stressful and rules out review. Multistage also produces stable score equating across forms more easily. Trade-off: less precise score targeting than full CAT, but better candidate experience. The test-development team picked candidate experience.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
