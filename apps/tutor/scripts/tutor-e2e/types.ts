/**
 * Tutor e2e harness — scenario types. See project_tutor_test_automation.
 *
 * A scenario drives a real claude-brain session through the TYPED-INPUT path
 * (the harness calls window.__tutorSendText, which is exactly what the typed
 * chat box does — no mic/voice needed). The harness captures a bundle
 * (console log + per-turn screenshots + PDF) for review; the `watchFor` notes
 * are what a Phase-2 LLM-judge will check against.
 */

/** Realistic student behavior archetypes for the simulated-student driver. */
export type StudentProfile =
  | 'cooperative'   // engaged, works through, occasionally unsure/wrong
  | 'struggling'    // confused, asks "why?", needs re-explanation, slow
  | 'distractible'  // drifts off-topic, asks tangents ("is this on the exam?")
  | 'skeptical'     // challenges the tutor, questions answers, pushes back
  | 'gives-up'      // disengages, "idk", asks to just be shown the answer
  | 'brings-problem'; // brings their OWN concrete problem / homework to work

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
  /** Fire `trigger` this many ms AFTER `say` is dispatched (mid-turn
   *  triggers, e.g. barge-in while a render is drawing on); default = fire
   *  before `say` as today. */
  triggerDelayMs?: number;
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
  /** Optional: drive a SIMULATED STUDENT via an LLM instead of fixed testTurns.
   *  After seedTurns, an LLM reads the tutor's last turn and replies as a
   *  student of the given `profile`, so the tutor's coherence is tested against
   *  realistic, non-deterministic behavior (not just an idealized learner). The
   *  judge grades the tutor's RESPONSE QUALITY per turn given what the student
   *  did — reaching `goal` is only expected if the student stays on task. When
   *  present, testTurns are ignored. */
  cooperativeStudent?: {
    goal: string;          // the on-task objective; embed the known answer for grading
    profile?: StudentProfile; // behavior archetype (default 'cooperative')
    persona?: string;      // free-text persona override (else derived from profile)
    turns?: number;        // student turns to drive (default 6)
    firstSay?: string;     // the opening student utterance
  };
  /** Informational only: the harness has no mid-loop hook, so the hard-reload
   *  (Continue overlay + immediate/3s-later screenshots, verifying resume
   *  boards render instantly / bulk-mount cap) actually fires after ALL test
   *  turns complete, regardless of which N is set here. Kept as a field for
   *  when mid-loop reload support is added. */
  reloadAfterTurn?: number;
}
