/**
 * Demo time-box mode selection (pure, client-safe).
 *
 * Extracted so the is_trial × explicit-duration × wrap matrix is
 * unit-testable without running a brain turn or a React render, and so the
 * payload shape has a single source of truth shared by the client composer
 * (VoiceTutorRealtime), the brain-route sanitizer, and formatDemoStopBlock
 * (claude-brain.ts). This module has NO server-only dependencies — the client
 * component imports it directly.
 */

/** The per-turn `<demo_stop>` payload. Lives in volatile per-turn user content
 *  (minutesElapsed changes every turn) — NEVER in the cached system prefix. */
export type DemoStopPayload =
  | {
      mode: 'time';
      budgetMinutes: number;
      minutesElapsed: number;
      /** Wrap-phase threshold in whole minutes. Set only for a real time-boxed
       *  demo (explicit max_duration_minutes). When minutesElapsed reaches it,
       *  formatDemoStopBlock switches to the graceful-wrap directive. Absent ⇒
       *  no wrap phase (pre-existing untimed-demo behavior). */
      wrapAtMinutes?: number;
    }
  | { mode: 'milestone' };

/**
 * Decide the per-turn demo-stop payload for a DEMO-mode session. The caller
 * (VoiceTutorRealtime) gates on TUTOR_PEDAGOGY_OPENER + sessionMode==='demo'
 * and supplies minutesElapsed from the real-start clock.
 *
 * - Trial WITHOUT an explicit time box ⇒ `milestone` (win boxed to completing
 *   the first concept — today's is_trial behavior, unchanged).
 * - Trial WITH an explicit time box (the homepage timed demo) OR any non-trial
 *   demo ⇒ `time` with the minute budget, elapsed, and (when set) the wrap
 *   threshold.
 */
export function selectDemoStopPayload(args: {
  isTrial: boolean;
  maxDurationExplicit: boolean;
  budgetMinutes: number;
  minutesElapsed: number;
  wrapAtMinutes?: number;
}): DemoStopPayload {
  if (args.isTrial && !args.maxDurationExplicit) {
    return { mode: 'milestone' };
  }
  return {
    mode: 'time',
    budgetMinutes: args.budgetMinutes,
    minutesElapsed: args.minutesElapsed,
    ...(args.wrapAtMinutes != null ? { wrapAtMinutes: args.wrapAtMinutes } : {}),
  };
}
