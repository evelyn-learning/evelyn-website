/**
 * NEET UG — Time Management Drill.
 */

import type { LessonPlan } from '../types';

export const SEED_NEET_UG_TIME_MANAGEMENT: LessonPlan = {
  id: 'evelyn.neet.ug.time-management.v1',
  title: 'NEET UG — Time Management Drill',
  curriculum: 'NEET',
  grade: 'medical-entrance',
  subject: 'test-prep',
  topic: 'neet-ug',
  locale: 'en',
  los: [{ id: 'neet.ug.time-management', description: 'Plan a per-section pacing strategy; practice "skip and return" + sectional priority.', standard: 'NEET-UG' }],
  prerequisites: ['neet.ug.strategy'],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Time is the second-toughest constraint after content. Students who finish, win.', script: 'Most NEET aspirants would score higher with unlimited time. The art is finishing all 200 questions and still having buffer to review. Today: drill the pacing.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Pacing model, sectional order, marker strategy, review pass.', keyIdeas: [
      'PACING MODEL — set a per-question target by subject.',
      '  Biology: 35-45 sec per question.',
      '  Chemistry: 45-60 sec per question.',
      '  Physics: 75-90 sec per question.',
      'Total at these rates: ~200 min. Tight but feasible.',
      'SECTIONAL ORDER — recommended:',
      '  Many candidates do BIOLOGY FIRST (highest accuracy + speed → confidence + bank time).',
      '  Then CHEMISTRY (mix of memorisation + calc).',
      '  PHYSICS LAST (most time-intensive; if you run out, you\'ve banked easier sections).',
      '  Some candidates prefer Physics first (when fresh). Try both in mocks; pick the one giving HIGHER total.',
      'SKIP-AND-RETURN protocol:',
      '  First pass: do every "easy" question. Mark difficult ones with a small star, MOVE ON.',
      '  Don\'t spend > target time per question on first pass. EVER.',
      '  Second pass: tackle starred questions with whatever time remains.',
      '  Third pass (if time): review answers you weren\'t 100% on.',
      'OMR DISCIPLINE: shade bubbles immediately for each question, not at end. Running out of time AND having unshaded bubbles is the worst-case scenario.',
      'PSYCHOLOGICAL pacing: if a question feels hard, your brain is screaming "spend more time." Discipline says: mark it, move on, return later. Spending 8 minutes on one question costs you the chance at multiple easier ones.',
      'MOCK PRACTICE: every full mock should be timed STRICTLY. You can\'t train pacing without practice — and pacing matters as much as content for cutoff.',
    ], vocabulary: [{ term: 'OMR sheet', definition: 'Optical Mark Recognition answer sheet used in NEET; bubbles must be shaded clearly to count.' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'You\'ve started Physics with 75 min remaining for 50 questions. After 30 min, you\'ve done 18 questions. Are you on track?', steps: [
      'Target: 50 questions / 75 min = 90 sec/q.',
      'Actual rate: 30 min / 18 questions = 100 sec/q.',
      'Behind target by ~10 sec/q × 32 remaining = 320 sec = ~5 min.',
      'Strategy: speed up. Aim for 80 sec/q on remaining. Skip aggressively any question taking > 2 min.',
      'Alternative: prioritise easy/medium questions (skip hard). Better to leave 5 hardest blank than rush all 32 with errors.',
      'CHECK: review your strategy at the 50%-time mark, not the end.',
    ], answer: 'Slightly behind; speed up + skip aggressively.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'In a mock, a student spends 40 minutes on Physics\'s first 20 questions. They have 30 questions and 30 minutes left. What should they do?', expectedAnswer: '30 questions in 30 min = 60 sec/q. They\'re BEHIND a healthy pace. Strategy: scan ALL remaining questions, MARK the easy ones, attempt those FIRST. Skip anything calculation-heavy. Aim to attempt 20 of the 30 with ~1.5 min each, leaving 10 to skip or guess on. NEVER race through all 30 in panic — accuracy collapses. Triage hardest, secure easier marks.', responseFormat: 'free', hints: ['Behind pace? Triage by difficulty.', 'Don\'t race; secure attempts on easy/medium.'], estimatedMinutes: 3 },
    { id: 'misconception-stick-it-out', kind: 'misconception_check', question: 'A student gets stuck on a Physics question for 6 minutes but refuses to skip. Why is this a costly choice?', commonErrors: [{ answer: 'Stick with one tough question', misconception: 'Loss aversion + sunk-cost thinking.', correctsTo: 'Time spent is gone — sunk cost. The decision should be FORWARD-LOOKING: what\'s the highest-value use of the next minute? If 4 mins on this question gives ~50% chance of correct (+4 × 0.5 = +2), vs 4 mins on FOUR easier questions at 80% accuracy each gives 4 × 0.8 × 4 = 12.8 expected marks. Skipping wins by ~10 marks. Always: mark, move on, return later. Discipline beats stubbornness.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Per-q targets: Bio 35-45s, Chem 45-60s, Phys 75-90s.', 'Bio first → Chem → Phys (or your tested order).', 'Skip and return — never spend > target time on first pass.', 'OMR shade as you go — don\'t batch.', 'Time pacing is trained in mocks, not the actual exam.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
