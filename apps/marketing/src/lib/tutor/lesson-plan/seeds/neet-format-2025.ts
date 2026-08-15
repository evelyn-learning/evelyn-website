/**
 * NEET UG 2025-26 — Exam Format and Pattern.
 *
 * NTA reformatted NEET UG for 2025: optional Section B was removed
 * (all questions now compulsory), exam duration reduced by 20 minutes.
 * The 2026 syllabus matches 2025. NEET UG is the single Indian medical
 * undergraduate entrance exam (replaced AIIMS + JIPMER + state CETs).
 */

import type { LessonPlan } from '../types';

export const SEED_NEET_FORMAT_2025: LessonPlan = {
  id: 'evelyn.testprep.neet.format-2025.v1',
  title: 'NEET UG 2025-26: Exam Pattern, Marking, and 2025 Changes',
  curriculum: 'NTA',
  grade: 'medical-entrance',
  subject: 'test-prep',
  topic: 'neet-ug',
  locale: 'en',
  los: [
    {
      id: 'neet.format-2025',
      description: 'Describe the NEET UG 2025-26 exam pattern (180 questions, 720 marks, 3h 20m), the +4/−1 marking, the 2025 removal of optional Section B, and the subject distribution heavily weighted to Biology.',
      standard: 'NEET-UG-2025',
    },
  ],
  prerequisites: [],
  followUps: ['neet.biology-cell-biology', 'neet.physics-mechanics-overview', 'neet.chemistry-organic-overview'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'NEET is THE gateway to MBBS in India — and it tilts heavily toward Biology.',
      script: 'NEET UG is the single entrance exam for almost all MBBS, BDS, and AYUSH seats in India — over 2 million students take it each year. Half the score comes from Biology (Botany + Zoology), so a strong Biology base is non-negotiable. NTA changed the format for 2025: Section B optional questions are gone, and the exam is 20 minutes shorter. That tightens pacing for everyone.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Sections, question count, marking, scoring.',
      keyIdeas: [
        'TOTAL: 180 questions, 720 marks, 3 hours 20 minutes (200 minutes).',
        'SUBJECT SPLIT: Biology 90 Q (45 Botany + 45 Zoology) = 360 marks. Physics 45 Q = 180 marks. Chemistry 45 Q = 180 marks. Biology is HALF the score.',
        'PER-SUBJECT STRUCTURE (post-2025): Section A only — 35 questions (Physics/Chem) or 35 + 35 (Bio Botany + Zoology). Optional Section B (where students chose 10 of 15) was REMOVED in 2025. All questions are now compulsory.',
        'MARKING: +4 for correct, −1 for incorrect, 0 for unanswered. NO partial credit. NO numerical-value items (everything is 4-option MCQ).',
        'TIME PER QUESTION: 200 min / 180 Q ≈ 67 seconds per question average. Biology must be fast (~50s/Q) to leave time for Physics + Chemistry calculations.',
        'NEGATIVE-MARKING RULE: a wrong answer costs 1 mark, but missing a question costs 0. So if you have NO idea, leave blank. If you can eliminate 2 of 4 options (~50% chance correct), expected value of guessing = 0.5(+4) + 0.5(−1) = +1.5. Worth it.',
        'PAPER LANGUAGE: 13 languages available — English, Hindi, Bengali, Marathi, Tamil, Telugu, Urdu, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese.',
        'SYLLABUS: NCERT class 11 + 12 Biology, Physics, Chemistry. NEET 2026 syllabus is unchanged from 2025 — NTA confirmed January 8, 2026.',
        'EXAM DATE 2026: May 3, 2026 (single all-India sitting in pen-and-paper mode).',
      ],
      vocabulary: [
        { term: 'Section A', definition: 'NEET subject section with all-compulsory MCQs (post-2025 the only section).' },
        { term: 'NCERT', definition: 'National Council of Educational Research and Training — produces the school textbooks NEET\'s syllabus is based on.' },
        { term: 'NEET UG', definition: 'undergraduate medical entrance exam administered by NTA in India.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Order of attempt + pacing benchmarks.',
      keyIdeas: [
        'TYPICAL ORDER: Biology → Chemistry → Physics. Biology is the largest section, mostly recall-based, fastest per question. Bank confidence + marks early.',
        'PACING BENCHMARK: aim for 60 minutes Biology (90 Q at 40s avg), 50 min Chemistry (45 Q at ~70s), 70 min Physics (45 Q at ~95s, calculations are slower), 20 min review.',
        'BIOLOGY APPROACH: factual recall + diagram interpretation + NCERT-line questions. Most questions can be answered in under a minute if NCERT is well-revised. Drill NCERT line by line.',
        'CHEMISTRY APPROACH: Inorganic = recall, Organic = mechanism reasoning, Physical = calculations. Inorganic and Organic should be fast; Physical chemistry calculations need time.',
        'PHYSICS APPROACH: half memorization (formulas), half problem-solving. Mechanics + Electromagnetism + Modern Physics are highest-weight chapters. Memorize formula derivations to recover under stress.',
        'STRATEGY for the −1 penalty: only attempt where you can eliminate at least one option confidently. Pure-blind guess on a 4-option MCQ has EV = 0.25(4) + 0.75(−1) = +0.25 — barely positive but error-prone. Better to skip and use that time on questions you know.',
        'CUTOFFS for top medical colleges: AIIMS New Delhi historically requires ~99.95+ percentile (NEET score 700+). Government medical colleges typically need ~600+. State quotas vary.',
      ],
      vocabulary: [
        { term: 'percentile', definition: 'the percentage of test-takers scoring at or below you; 99.95 percentile means top 0.05% of all NEET takers.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'re 30 minutes into the exam, halfway through Biology, and on track. A Physics question catches your eye that you know cold. Should you switch sections to grab it?',
      expectedAnswer: 'No — stay in Biology and finish the section. Switching sections breaks your pacing rhythm and you risk forgetting where you were in Bio. Mark the easy Physics question for review; come back to Physics with full focus when you finish Biology. The cost of context-switching mid-flow is greater than the marginal benefit of grabbing one easy question early.',
      responseFormat: 'free',
      hints: [
        'Stick to your planned section order.',
        'Context-switching has cost.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-section-b',
      kind: 'misconception_check',
      question: 'Section B in NEET still gives you the option to skip 5 of 15 questions, so you can avoid your weak topics. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Carrying over the pre-2025 optional Section B rule.',
          correctsTo: 'False. NTA removed optional Section B in 2025. All questions in NEET UG are now compulsory under Section A. You can\'t skip strategically — every question is either answered or left blank (with the −1 penalty if wrong). Pre-2025 prep books and YouTube videos describing "the 15-pick-10 strategy" are outdated.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '180 Q in 3h 20m. Biology 90 Q (50% of marks), Physics 45, Chemistry 45.',
        'Marking: +4 / −1 / 0. No optional Section B since 2025.',
        'Order: Bio → Chem → Phys. ~67 sec/question average; Bio fastest, Physics slowest.',
        'Skip if you can\'t eliminate at least one option. Don\'t blind guess.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does NEET weight Biology so heavily (50% of marks) when Physics + Chemistry are essential to medical school too?',
      hint: 'Biology is the most subject-specific predictor of MBBS readiness — you\'ll directly use anatomy, physiology, biochemistry, microbiology in years 1-2. Physics + Chemistry are useful but more general (med school re-teaches the relevant biochemistry from scratch). The 50/25/25 weighting reflects that. NTA also keeps the same NCERT-based depth for all three so coaching institutes can\'t pour disproportionate effort into one subject and skip Biology.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
