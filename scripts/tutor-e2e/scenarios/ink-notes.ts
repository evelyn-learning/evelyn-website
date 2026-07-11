import type { Scenario } from '../types';

/**
 * SmoothDraw Phase-3 gate: on-board ink notes. FRESH SESSION required —
 * the tutor_handwrite docstring changed (session-static prompt).
 * Requires NEXT_PUBLIC_TUTOR_INK_NOTES=true (and DRAW_ON) in .env.local
 * + dev-server restart. Run with TUTOR_E2E_VIDEO=1.
 */
const scenario: Scenario = {
  name: 'ink-notes',
  description: 'Notes land beside targets, never overlap, margin fallback works.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [],
  testTurns: [
    {
      say: 'Draw the triangle with vertices (0,0), (6,0) and (0,4), and write a short note next to the vertex at the origin reminding me it is the right angle.',
      watchFor: 'Figure renders; a hand-written amber note sits BESIDE the origin vertex (not on the figure, not in a strip below); note wipes on.',
      timeoutMs: 150_000,
    },
    {
      say: 'Add another note near the hypotenuse about its length, and also jot a general reminder that area is half base times height.',
      watchFor: 'Second note beside the hypotenuse without overlapping the first note or the figure; the general reminder lands in the right margin column.',
      timeoutMs: 150_000,
    },
    {
      say: 'Can you highlight the vertex at (6,0) and label it "the far corner"?',
      watchFor: 'Scribble label renders as an on-board note beside (6,0) — NOT a strip entry; no overlap with existing notes.',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
