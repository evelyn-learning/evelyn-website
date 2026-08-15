/**
 * JEE Main — overall exam strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_MAIN_STRATEGY: LessonPlan = {
  id: 'evelyn.jee.main.strategy.v1',
  title: 'JEE Main exam strategy',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'math',
  topic: 'jee-main',
  locale: 'en',
  los: [
    {
      id: 'jee.main-strategy',
      description: 'Apply effective strategy to the JEE Main: format, time management, attempt order, accuracy vs speed, and the Main → Advanced pipeline.',
      standard: 'JEE-MAIN',
    },
  ],
  prerequisites: [],
  followUps: ['jee.advanced-strategy', 'jee.physics-strategy', 'jee.chemistry-strategy', 'jee.math-strategy'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'JEE Main as the gateway to NITs and Advanced.',
      script: 'JEE Main is the entry point — top score qualifies you for the National Institutes of Technology (NITs), and the top ~250,000 candidates earn the right to take JEE Advanced for a shot at the IITs. Two attempts a year (January, April), best score counts. Strategy isn\'t just knowing physics, chemistry, and math — it\'s knowing HOW to attempt 90 questions in 3 hours under pressure.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Format, timing, marking scheme, attempt order.',
      keyIdeas: [
        'FORMAT: 3 hours, 90 questions across Physics (30), Chemistry (30), Math (30). Each subject: 20 MCQs (single correct) + 10 numerical answer (NA) questions. Of the 10 NA, you choose 5 to attempt.',
        'MARKING: MCQ — +4 correct, −1 wrong. NA — +4 correct, NO negative for wrong since 2024 reforms (verify current year — recent changes). NA correct answers must match given precision (often integer or up to 2 decimals).',
        'TIME PER QUESTION: 3 hours = 180 min for 75 attempted (90 minus 15 unattempted NA) → ~2.4 min per Q. But spread is uneven — physics and math heavy.',
        'ATTEMPT ORDER: most students start with the strongest subject to build confidence + bank marks. Save physics/math for later if you\'re a chemistry student (or vice versa).',
        'ACCURACY > SPEED: in JEE Main, a wrong MCQ costs 5 marks (lost +4 + −1) compared to skipping (0). Skip if uncertain after a serious attempt.',
        'SECTIONAL CUT-OFFS: don\'t exist on Main, but unbalanced scores (e.g., 95 in math, 30 in chem) hurt total. Aim for at least adequate in every subject.',
        'TWO ATTEMPTS: most students take both January and April attempts. Better of the two counts. First attempt is a calibration; second attempt benefits from experience. Don\'t skip either unless circumstances force.',
        'CUT-OFF for Advanced: top ~250,000 candidates by Main rank. The cutoff varies year to year (often around 90-95 percentile, but exact rank-based).',
        'PERCENTILE CONFUSION: JEE Main reports PERCENTILE within a session. After two sessions, rankings normalize via "JEE Main NTA Score". The cutoff to qualify for Advanced is announced after April session.',
      ],
      vocabulary: [
        { term: 'numerical answer (NA)', definition: 'JEE question type where you enter a numerical value — no MCQ options.' },
        { term: 'percentile', definition: 'the percentage of candidates who scored AT OR BELOW you; 99th percentile = top 1%.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-strategy',
      kind: 'worked_example',
      problem: 'You\'re strong in math, weak in physics. Sketch an attempt strategy for the 3-hour exam.',
      steps: [
        'STEP 1: Open with math (30 questions, ~50-55 min budget). You\'re strong here — bank confidence + marks early.',
        'STEP 2: Switch to chemistry (30 Qs, ~45-50 min). Many chem questions are quick (memorization, formulas). Don\'t over-think.',
        'STEP 3: Tackle physics last (30 Qs, ~70-75 min). You need more time for the subject you find harder.',
        'WITHIN A SUBJECT: scan all 30 Qs first, mark the ones that look obvious. Solve obvious ones, then the medium ones, then attempt the hard ones if time allows.',
        'NA SECTION: pick 5 of 10 you\'re most confident about. NA wrong since 2024 has no penalty (verify), so ATTEMPT all 5 with at least an educated guess.',
        'LAST 10 MIN: review marked-for-review questions. Don\'t change MCQ answers without strong reason — first instinct is often right.',
        'TIME CHECK: at 60 min, you should be roughly 30 questions in. If far behind, accept fewer questions answered well.',
      ],
      answer: 'Order: strongest subject first (math), then chem (quick), physics last (most time). Within each, easy → medium → hard.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is OMITTING a tough MCQ usually better than guessing on JEE Main?',
      expectedAnswer: 'MCQ has +4 / −1 marking. A blind guess (1 in 4 chance correct) gives expected value of (0.25)(4) + (0.75)(−1) = 1 − 0.75 = 0.25 per Q. But this assumes truly random guessing — most "guesses" are actually biased and worse. Skipping = 0 (no risk). On a 90-question test, accumulating −1\'s on bad guesses can cost 10-20 marks. Skip uncertain Qs after a real attempt.',
      responseFormat: 'free',
      hints: [
        'Compute expected value of a random guess.',
        'Compare to skipping (0) and a confident answer.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-coaching-only',
      kind: 'misconception_check',
      question: 'Is succeeding in JEE Main mostly about how good your coaching institute is?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating coaching as the deciding factor.',
          correctsTo: 'Mostly false. Coaching gives structured material and peer pressure, but the deciding factor is HOURS OF FOCUSED PRACTICE. Many top rankers self-study. Coaching is a forcing function — not a substitute for practicing 4-6 hours/day for 18 months. NCERT textbook (especially for chemistry), past 10-year question papers, and consistent mock exams matter more than which institute you attend.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '90 Qs in 3 hours. MCQ +4/−1, NA +4/0 (verify current scheme).',
        'Two attempts/year — take both. Best score counts.',
        'Order subjects by strength. Skip uncertain MCQs.',
        'Top ~250K rank → JEE Advanced eligibility.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is consistent MOCK testing more important than just doing problems from a textbook?',
      hint: 'Mocks simulate the time pressure, the question variety, and the mental load of switching between subjects. You learn HOW you behave under stress — do you panic on physics? Spend too long on a single problem? Make careless errors in the last 30 minutes? Textbook practice doesn\'t reveal those patterns. Aim for 1 full-length mock per week in the last 6 months.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
