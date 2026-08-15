/**
 * AP — General test-taking strategy.
 *
 * Cross-AP guidance: how to read AP questions, time management
 * across MC and FRQ, the rubric mindset.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_TEST_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.ap.general-strategy.v1',
  title: 'AP exam strategy: MC + FRQ across subjects',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'ap-test-strategy',
  locale: 'en',
  los: [
    {
      id: 'ap.test-strategy',
      description: 'Apply general AP exam strategy across MC and FRQ formats.',
      standard: 'AP-STRATEGY',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame AP as a rubric-driven exam.',
      script: 'AP exams aren\'t graded by a perfectionist teacher — they\'re graded by hundreds of readers using a RUBRIC. Earn rubric points, not bonus points for being clever. Strategy is about knowing what the rubric rewards.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format-tactics',
      kind: 'concept',
      goal: 'Format + per-section strategy + score scale.',
      keyIdeas: [
        'FORMAT: most APs have multiple choice (MC) + free-response (FRQ). Some have additional formats (lab, performance task, document-based question).',
        'NO WRONG-ANSWER PENALTY since 2011 — guess on every MC. Never leave blank.',
        'MC: Easy and hard questions worth the same. Mark and skip if stuck; return if time. Average ~1-1.5 min/question depending on subject.',
        'FRQ: write to the RUBRIC. Each part has scoring points. Address every part directly. Show work. Use specific terminology from the course.',
        'FRQ writing tip: a ROUGH answer that hits all rubric points beats a polished answer that misses one. Cover ground first.',
        'TIME ON FRQ: roughly equal time per question — don\'t spend 30 minutes on one when others remain unanswered.',
        'SCORE SCALE: 1-5. 3 = qualified, 4 = well-qualified, 5 = extremely well-qualified. College credit policies vary by school.',
        'TEST-DAY: bring approved calculator (subject-dependent), pencil, ID. Eat. Sleep. Don\'t cram the night before.',
      ],
      vocabulary: [
        { term: 'FRQ', definition: 'free-response question, requiring written work and analysis.' },
        { term: 'rubric', definition: 'the scoring guide listing what earns each point.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-frq',
      kind: 'worked_example',
      problem: 'Strategy for an FRQ with parts (a), (b), (c), (d).',
      steps: [
        'Read all parts FIRST. Often part (b) builds on (a); knowing the structure helps you frame (a).',
        'Allocate time: roughly equal. If part has visibly more sub-points, weight slightly more.',
        'Answer EVERY part. A blank earns zero. A messy partial answer can earn partial credit.',
        'Use course-specific terminology — graders look for it.',
        'For each rubric point, MAKE IT VISIBLE. Underline key terms; clearly label parts; show calculation steps.',
        'If stuck on part (b), make a reasonable assumption and continue. You can earn points for parts (c) and (d) even with (b) wrong.',
      ],
      answer: 'cover all parts; rubric points first; polish later if time',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Should you ever leave an MC blank on an AP exam?',
      expectedAnswer: 'no — no penalty since 2011, always guess',
      responseFormat: 'free',
      hints: [
        'No wrong-answer penalty.',
        'Random guess gives ~25% chance of being right; blank gives 0%.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-frq-perfect',
      kind: 'misconception_check',
      question: 'Should you write a polished, perfectly worded FRQ even if it costs time on later parts?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Aiming for elegance over completeness.',
          correctsTo: 'No — graders score by rubric points, not eloquence. A rough answer hitting all rubric points scores higher than a beautiful one that runs out of time and skips a part. Cover ground first; polish only if time remains.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'No wrong-answer penalty — guess on every MC.',
        'FRQ: write to the rubric. Cover all parts. Show work.',
        'Allocate time roughly equally; don\'t over-invest in one question.',
        'Use course-specific terminology.',
        'Easy + hard questions worth equally; skip and return.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the AP design favor breadth over depth in scoring?',
      hint: 'Rubrics distribute points across multiple sub-skills. A rubric with 8 points across 4 parts rewards covering all four — even partially — over getting one part perfectly. Designed to differentiate students fairly across many topics.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
