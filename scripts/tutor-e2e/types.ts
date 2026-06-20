/**
 * Tutor e2e harness — scenario types. See project_tutor_test_automation.
 *
 * A scenario drives a real claude-brain session through the TYPED-INPUT path
 * (the harness calls window.__tutorSendText, which is exactly what the typed
 * chat box does — no mic/voice needed). The harness captures a bundle
 * (console log + per-turn screenshots + PDF) for review; the `watchFor` notes
 * are what a Phase-2 LLM-judge will check against.
 */

export interface ScenarioTurn {
  /** Student utterance to send (the typed-input student turn). */
  say?: string;
  /** Dev trigger to fire BEFORE sending `say` (or standalone). Mirrors the
   *  window.__tutor* triggers in VoiceTutorRealtime. */
  trigger?: '__tutorForceKill' | '__tutorForceKillAfterRenders' | '__tutorForceFalseBargein' | '__tutorFlushRenderBuffer';
  /** Optional arg for the trigger. For __tutorForceKillAfterRenders it's the
   *  render count (string, parsed to a number); otherwise e.g. a kill reason. */
  triggerArg?: string;
  /** Free-text "what should be true after this turn" — consumed by the
   *  Phase-2 judge and surfaced in the run summary for manual review. */
  watchFor?: string;
  /** Per-turn timeout override (ms). Brain turns can run 20-40s. */
  timeoutMs?: number;
}

export interface Scenario {
  name: string;
  description: string;
  /** Picker selections — selecting a lessonPlanId flips the engine to
   *  claude-brain automatically (page.tsx voiceEngine). */
  start: { subject: string; level: string; topic: string; lessonPlanId: string; studentName?: string };
  /** Turns that fast-forward into the testable state (navigation / building
   *  the session). Captured but usually not the focus. */
  seedTurns?: ScenarioTurn[];
  /** The test-worthy turns — the prompts that exercise the change. */
  testTurns: ScenarioTurn[];
}
