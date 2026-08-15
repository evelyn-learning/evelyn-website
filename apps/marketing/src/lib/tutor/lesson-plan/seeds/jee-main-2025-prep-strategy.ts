/**
 * JEE Main 2025-26 — Prep Strategy Adjusted for the New Pattern + Reduced Syllabus.
 *
 * Combines the format changes (compulsory Section B, negative marking
 * on numericals) with the syllabus reductions to give a 2025-current
 * prep approach.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_MAIN_2025_PREP_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.jee-main-2025.prep-strategy.v1',
  title: 'JEE Main 2025-26: Prep Strategy for the New Pattern + Reduced Syllabus',
  curriculum: 'NTA',
  grade: 'iitjee',
  subject: 'test-prep',
  topic: 'jee-main',
  locale: 'en',
  los: [
    {
      id: 'jee-main-2025.prep-strategy',
      description: 'Build a JEE Main 2025-26 prep plan that accounts for the compulsory Section B, negative marking on numericals, and the 25-35% syllabus reduction across subjects.',
      standard: 'JEE-MAIN-2025-PREP',
    },
  ],
  prerequisites: ['jee-main-2025.format', 'jee-main-2025.syllabus-deletions'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Smart prep adjusts for the format AND content shifts at once.',
      script: 'JEE Main 2025 changed in two ways at once: the exam pattern (Section B compulsory + negative marking on numericals) and the syllabus (25-35% reduced). A prep plan that ignores either will leave you over-prepared on dead topics or under-prepared on numericals. The good news: less material to learn. The catch: more attempts have to count. Reallocate accordingly.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-prep-shifts',
      kind: 'concept',
      goal: 'Three concrete shifts to make in prep.',
      keyIdeas: [
        'SHIFT 1 — DRILL NUMERICAL QUESTIONS. With Section B compulsory and 5 mandatory numerical items per subject, you can\'t avoid them. Allocate at least 30% of practice time to numerical-format problems. Past JEE Mains 2020-2024 have plenty.',
        'SHIFT 2 — PRACTICE PARTIAL-ATTEMPT JUDGMENT. With negative marking on numericals, you need fast judgment: "do I have enough progress to attempt or should I skip?" Mock-test under timed conditions and grade your skip-vs-attempt decisions, not just your answers.',
        'SHIFT 3 — CUT TIME ON DELETED TOPICS. Hours saved on Surface Chemistry, Communication Systems, AGP series — redirect to: (a) NCERT depth in topics that ARE on the syllabus, (b) more mock practice, (c) weak-topic remediation.',
        'NCERT FIRST: with the cuts, NCERT class 11-12 textbooks now cover ~85-90% of the syllabus (used to be ~70%). Master NCERT thoroughly before reaching for HC Verma / Resnick-Halliday for physics, OP Tandon for chemistry, RD Sharma for math.',
        'TWO-ATTEMPT BUDGET: most students take both January and April sessions. January is your calibration; April benefits from 2-3 months more prep + the experience. If your January score is below your target, don\'t panic — the gap can close in April.',
        'MOCK-TEST RHYTHM: weekly full-length mocks in the last 4 months. Focus mock review on attempt strategy (Section B skip-vs-go, time management) more than content recall.',
        'TOPIC PRIORITY for 2025: Math (largely unchanged) → invest in concept depth + speed. Physics (mid-cuts) → focus on Mechanics + EM (highest weight, fully retained). Chemistry (heavy cuts) → Inorganic gets simpler, Organic and Physical retain depth.',
      ],
      vocabulary: [
        { term: 'NCERT', definition: 'National Council of Educational Research and Training; produces the official Indian school textbooks. JEE Main 2025 syllabus is roughly 85-90% NCERT-based.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'concept-time-allocation',
      kind: 'concept',
      goal: 'Sample 12-month and final-3-month time allocations.',
      keyIdeas: [
        '12-MONTH PLAN (if starting now): months 1-3 NCERT theory + simple problems for all subjects; months 4-6 reference books + chapter-end exercises; months 7-9 weekly subject mocks; months 10-12 weekly full-length mocks + revision.',
        'FINAL-3-MONTH SHIFT: stop introducing new topics. Drill mocks. Revision via short notes (your own, made earlier in the year). Sleep 7+ hours/night — exam-day cognitive performance depends on rest, not last-minute cramming.',
        'PER-DAY TIME (during dedicated prep): 4-6 hours of focused study. Past 6 hours marginal returns drop sharply. Quality > quantity.',
        'WEEKLY MOCK CADENCE: do mocks at the SAME TIME OF DAY as your real exam slot (early afternoon for most JEE Main slots). Build cognitive endurance for the actual 3-hour window.',
        'POST-MOCK REVIEW: spend MORE time reviewing mistakes than taking the next mock. Each wrong answer is a teacher. Categorize: silly error vs concept gap vs strategy gap (skipped a question that was easy, attempted a numerical you should have skipped). Strategy gaps are the most fixable.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'re 4 months out from JEE Main April session. You\'ve covered the entire 2025 syllabus once. Should you (a) review the syllabus a second time, (b) start weekly full-length mocks, or (c) drill specific weak chapters?',
      expectedAnswer: 'A balanced answer: start (b) weekly full-length mocks NOW, AND use mock results to identify the chapters in (c) to drill. A second full-syllabus pass at 4 months out is too time-expensive — the marginal new learning is small. Mocks reveal where you actually struggle (which is often surprising) and direct your remaining study time efficiently. The 4-month window is for STRATEGY + WEAK-TOPIC SHARPENING, not breadth re-coverage.',
      responseFormat: 'free',
      hints: [
        'At 4 months out with one full pass done, what is the marginal value of more breadth vs depth?',
        'Mocks tell you where you actually need work.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-old-prep-books',
      kind: 'misconception_check',
      question: 'A pre-2025 JEE Main prep book covers everything in detail. Studying it cover-to-cover is fine — extra content can\'t hurt.',
      commonErrors: [
        {
          answer: 'true — extra preparation never hurts',
          misconception: 'Treating study time as unlimited.',
          correctsTo: 'False. Time is the binding constraint. Hours on Communication Systems or Surface Chemistry or AGP series are hours NOT spent on topics that ARE on the 2025 syllabus. Pre-2025 books also lack practice in the new format (compulsory Section B, numerical negative marking). Use post-2025 materials for current-pattern practice. Pre-2025 books are useful for fundamentals but require an explicit "skip the deleted chapters" overlay.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Drill numericals — they\'re mandatory and now penalized.',
        'Practice skip-vs-attempt judgment in mocks. Strategy gaps are the most fixable.',
        'Don\'t study deleted topics. Reallocate that time to NCERT depth + mocks.',
        'Final 3 months: stop new content, do mocks, review mistakes more than you take new ones.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are mock-test weak-topic patterns more reliable than self-assessed confidence for prep planning?',
      hint: 'Most students rate their own confidence based on familiarity, not accuracy. You feel "confident" in topics you\'ve seen often, even if your hit rate is poor. Mocks generate objective accuracy data per topic. Often students discover they\'re weakest in chapters they thought were strong (e.g., they covered Electromagnetic Induction six times but consistently miss conceptual EMI questions). Use the data to reallocate time, not your gut feeling. This is true for all standardized exams, not just JEE.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
