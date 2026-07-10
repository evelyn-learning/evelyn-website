import type { Scenario } from '../types';

/**
 * Round-7 guardrail regression gate (SmoothDraw Phase 1+). Drives the
 * canonical incoherence test plan with a cooperative student — the run
 * must show no kill cascades, intact dedup, and no animation artifacts
 * on retry turns. See project_tutor_round7_architecture.md.
 *
 * Adjustment (2026-07-10): the round-7-era `evelyn.test.incoherence.v1`
 * debug seed (src/lib/tutor/lesson-plan/seeds/test-incoherence.ts) was
 * deliberately dropped in commit 47abf6c ("Drop debug-only
 * test-incoherence seed", 2026-05-05) — one day after round-7 shipped.
 * It no longer resolves. The nearest still-live plan matching
 * Mathematics → College Intro → Intro Statistics is the real anchor
 * plan `evelyn.college.math.intro-statistics.v1`
 * (seeds/college-math-intro-statistics.ts, subject 'math', topic
 * 'intro-statistics', grade 'college'). Its concept-stats segment's key
 * ideas explicitly cover MEAN/MEDIAN/MODE, so the mean-exercise
 * cooperativeStudent goal below still exercises real plan content —
 * only `lessonPlanId` was changed from the brief's original value.
 */
const scenario: Scenario = {
  name: 'round7-regression',
  description: 'Round-7 incoherence plan under the draw-on engine — guardrails intact.',
  start: { subject: 'math', level: 'College Intro', topic: 'intro-statistics', lessonPlanId: 'evelyn.college.math.intro-statistics.v1', studentName: 'Test Student' },
  seedTurns: [],
  testTurns: [],
  cooperativeStudent: {
    goal: 'Work through the mean exercises: worked example {70,75,80,85,90} (mean 80), try {2,4,6,8,10} (mean 6), then ask for another and solve {12,14,16,18,20} (mean 16).',
    firstSay: "I'm ready — let's work through this together.",
    persona: 'an engaged college intro statistics student',
    turns: 6,
  },
};

export default scenario;
