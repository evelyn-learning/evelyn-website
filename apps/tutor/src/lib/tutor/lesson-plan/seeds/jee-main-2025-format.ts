/**
 * JEE Main 2025-26 — Exam Pattern and Marking Changes.
 *
 * NTA restructured the JEE Main pattern for 2025: Section B numerical
 * questions are now MANDATORY (no longer 10-pick-5), and negative marking
 * was added to numerical questions for the first time. Currency-checked
 * against NTA\'s JEE Main 2025 syllabus document + CollegeDekho /
 * iibedu coverage of the changes.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_MAIN_2025_FORMAT: LessonPlan = {
  id: 'evelyn.testprep.jee-main-2025.format.v1',
  title: 'JEE Main 2025-26: Exam Pattern and Marking Changes',
  curriculum: 'NTA',
  grade: 'iitjee',
  subject: 'test-prep',
  topic: 'jee-main',
  locale: 'en',
  los: [
    {
      id: 'jee-main-2025.format',
      description: 'Describe the JEE Main 2025-26 exam pattern, the discontinuation of optional Section B questions, the addition of negative marking on numerical-value items, and the implications for attempt strategy.',
      standard: 'JEE-MAIN-2025',
    },
  ],
  prerequisites: [],
  followUps: ['jee-main-2025.syllabus-deletions', 'jee-main-2025.prep-strategy'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Two specific changes for 2025 reshape attempt strategy.',
      script: 'NTA made two pattern changes for JEE Main 2025 that change how you should attempt the exam. First, Section B (numerical) used to have 10 questions where you picked the 5 you felt strongest on. Now it\'s 5 questions, all MANDATORY. No more skipping. Second, those numerical questions now carry NEGATIVE marking: −1 for a wrong answer. Pre-2025, numericals had no penalty so blind guessing was rational. That free-guess strategy is dead.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pattern',
      kind: 'concept',
      goal: 'Sections, question count, marking scheme, timing.',
      keyIdeas: [
        'PAPER 1 (B.Tech / B.E.): Physics, Chemistry, Mathematics. 25 questions per subject = 75 total. 3 hours.',
        'WITHIN EACH SUBJECT: 20 MCQs (Section A) + 5 Numerical Value Questions (Section B). Both sections COMPULSORY for 2025.',
        'PRE-2025 had Section B as 10 Q where students chose 5. The "choose 5 of 10" optionality is GONE — all 5 numerical questions in Section B must be attempted.',
        'MARKING — MCQ (Section A): +4 for correct, −1 for incorrect, 0 for unattempted. Unchanged.',
        'MARKING — NUMERICAL (Section B) FOR 2025+: +4 correct, −1 incorrect, 0 unattempted. Pre-2025 had NO negative marking on numericals — they were free attempts. The new rule penalizes blind guessing.',
        'TOTAL MARKS per paper: 75 questions × 4 = 300. Scoring is converted to a percentile by NTA.',
        'TWO ATTEMPTS per year (January and April sessions). Best of two scores counts. Most students take both.',
        'PAPER 2A (B.Arch) and PAPER 2B (B.Plan) have Math + Aptitude + Drawing/Planning components. The Section-B optional-question removal applies to those too.',
        'TIME PER QUESTION: 3 hr / 75 Q ≈ 2.4 min average. Not uniform — chemistry is fastest, math slowest.',
      ],
      vocabulary: [
        { term: 'Section A', definition: 'JEE Main multiple-choice section: 20 MCQs per subject.' },
        { term: 'Section B', definition: 'JEE Main numerical-value section: 5 questions per subject (was 10-pick-5 before 2025).' },
        { term: 'Numerical Value Question (NVQ)', definition: 'a JEE item where the candidate enters a numeric answer rather than picking from choices.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-impact',
      kind: 'concept',
      goal: 'How marking changes shift attempt strategy.',
      keyIdeas: [
        'STRATEGY SHIFT for Section B: pre-2025, attempting all 10 was rational because no penalty. Post-2025, only 5 questions exist, all compulsory, with −1 penalty.',
        'EXPECTED-VALUE math for a Section B guess: if you have a 50/50 chance of being right, EV = 0.5·(+4) + 0.5·(−1) = +1.5. Worth attempting. If 25% chance of right, EV = 0.25·(+4) + 0.75·(−1) = +0.25. Marginal. If pure blind guess (no constraint on the answer), EV is significantly negative for a typical numeric answer with infinite possibilities.',
        'BUT: most numerical answers are integers in a small range (often single-digit to 3-digit). After working the problem partway, you can often narrow to "some integer between 0 and 20." That narrowing makes attempting still worthwhile.',
        'RULE OF THUMB: do NOT attempt a Section B question you have NO idea about. DO attempt one where you\'ve made progress and have a candidate answer.',
        'COMPENSATING SHIFT: the move to 5 mandatory Section-B questions means students who used to "save time by skipping numericals" no longer can. Practice with compulsory numerical attempts in mocks.',
        'NO TIME ADVANTAGE: total time stayed at 3 hours. With 75 mandatory questions vs the old setup, students have effectively LESS time to invest in the easier MCQs.',
      ],
      vocabulary: [
        { term: 'expected value', definition: 'the average outcome of a probabilistic decision; on JEE, the long-run gain from a guess given hit and miss probabilities.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a JEE Main 2025 Physics Section-B numerical, you\'ve worked through the problem partially and are now choosing between two final calculation paths that give very different answers (40 vs 80). You don\'t have time to verify which is right. Should you attempt or leave blank?',
      expectedAnswer: 'You\'re effectively guessing between 2 plausible answers (50/50 by your estimate). EV = 0.5·(+4) + 0.5·(−1) = +1.5. Attempt. Pick the answer that better matches a sanity check — units, order of magnitude, expected sign. Don\'t leave blank when you\'ve narrowed the field.',
      responseFormat: 'free',
      hints: [
        'Compute expected value: 50% × +4 + 50% × −1.',
        'Positive EV means attempt is rational.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-old-strategy',
      kind: 'misconception_check',
      question: 'On JEE Main 2025, since Section B numerical questions used to have no negative marking, you should still attempt every Section B question even if you have no idea. True or false?',
      commonErrors: [
        {
          answer: 'true — they were free guesses before, still are',
          misconception: 'Carrying over the pre-2025 free-guess rule.',
          correctsTo: 'False. NTA added −1 negative marking on Section B numerical questions in 2025. Blind guessing now has expected value below zero for most numerical questions (since the answer space is large). Attempt only after you\'ve made enough progress to narrow the answer to a small range. Books and coaching materials from 2024 still teach the old free-guess rule and will mislead students using 2025 marking.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '75 questions, 3 hours. 20 MCQ + 5 Numerical per subject. ALL compulsory.',
        'MCQ: +4/−1. Numerical: +4/−1 (NEW — was +4/0 before 2025).',
        'No more 10-pick-5 in Section B. Optional questions gone.',
        'Compute EV before guessing on numericals. Don\'t blind-guess.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did NTA add negative marking on numerical questions specifically in 2025, after years of leaving them penalty-free?',
      hint: 'The 10-pick-5 + no-penalty combination created an arbitrage: students could attempt all 10 numericals and pick the 5 they ranked highest in confidence, with zero downside on the misses. That gave students at coaching institutes (who learned this strategy) an outsized advantage over self-prepared students. Removing optionality + adding negative marking levels the field — every student now faces the same 5 questions with the same risk/reward. It\'s a fairness adjustment more than a difficulty adjustment.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
