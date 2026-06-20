import type { Scenario } from '../types';

/**
 * Forced-kill capture scenario (instrumentation, 2026-06-20). Drives a
 * render-rich, narration-rich turn and fires the dev __tutorForceKill once a
 * sentence is audible — deterministically exercising the SECOND kill flavor:
 * judge-kill Stage 3.1 snapshot → bridge-suppress → retry → restate/resume,
 * with the phase-A dim / phase-B keep-or-rollback on the killed attempt's
 * renders. (The give-up flavor — valid collateral renders hard-removed — is
 * captured by jee-conics-tangent's natural conic-solver rejection.)
 *
 * Purpose: capture render_sync_buffer/flush/drop + dim_mismatch +
 * killed_render_confirmed/rollback telemetry to study WB-paint-on-kill.
 */
const scenario: Scenario = {
  name: 'forced-kill-dim',
  description: 'Forced synthetic kill on a render+narration-rich turn — capture dim/keep/rollback paint behavior.',
  start: {
    subject: 'math',
    level: 'High School',
    topic: 'jee-math',
    lessonPlanId: 'evelyn.jee.coordinate-geometry.v1',
    studentName: 'Test Student',
  },
  seedTurns: [
    { say: 'parabola', watchFor: 'Tutor moves into the parabola segment.' },
  ],
  testTurns: [
    {
      // Kill AFTER 2 renders paint → the killed attempt has validated renders
      // on the board, so the end-of-call keep-validated decision actually runs
      // (the post-sentence force-kill fires before any render, so it can't).
      trigger: '__tutorForceKillAfterRenders',
      triggerArg: '2',
      say: 'Write the equation y² = 4x on the board, then draw its graph, and explain the focus and directrix.',
      watchFor:
        'After the synthetic kill (post-render): validated renders (equations/notes) should be KEPT (killed_render_kept_validated), not hard-removed; only a superseded same-figure redraw should sweep. Capture render_sync_* + killed_render_* events.',
      timeoutMs: 180_000,
    },
  ],
};

export default scenario;
