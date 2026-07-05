/**
 * Tutor reactions — the "how would a human tutor react" playbook.
 *
 * Mechanism: situation counter → one-time spoken suggestion. A trigger site
 * in the orchestrator records events against a rule; when `threshold` events
 * land within a sliding `windowMs`, the rule fires (at most
 * `maxFiresPerSession` times) and the orchestrator delivers the rule's
 * bracketed directive to the brain at the next quiet beat (idle-send), so the
 * tutor voices the suggestion naturally, in persona, exactly once.
 *
 * v1 rule: NOISE_INTERRUPTION_REACTION — repeated perception noise-cancels
 * (the tutor audibly pausing on background sounds) prompt a kind "reduce the
 * noise or mute + type" suggestion. Queue memo (2026-07-06) item 2; design:
 * docs/superpowers/specs/2026-07-05-noise-nagging-reaction-design.md.
 *
 * Adding a future reaction = add a rule here + call recordReactionEvent at
 * its trigger site + reuse the orchestrator's reaction idle-send delivery.
 *
 * Pure module — no component state, no I/O. Ship-gate:
 * scripts/test-tutor-reactions.ts (`npm run test:tutor-reactions`).
 */

export interface TutorReactionRule {
  /** Stable id — used in telemetry event names. */
  id: string;
  /** Events within `windowMs` required to fire. */
  threshold: number;
  /** Sliding window over event timestamps (ms). */
  windowMs: number;
  /** Hard cap on fires per session (state lifetime). */
  maxFiresPerSession: number;
  /** Bracketed system-style directive the brain receives on fire. MUST stay
   *  generic — no subject-specific content (feedback_generic_prompts). */
  directive: string;
}

/** Per-rule mutable state. Hold in a component ref (session-scoped by
 *  construction — the orchestrator remounts per session). */
export interface ReactionState {
  events: number[];
  fires: number;
}

export function createReactionState(): ReactionState {
  return { events: [], fires: 0 };
}

/**
 * Record one occurrence of the rule's situation at `nowMs`. Returns true
 * exactly when the rule fires: `threshold` events inside the sliding window
 * and the per-session fire cap not yet reached. Firing consumes the window
 * (events cleared) so the same occurrences never double-count toward a
 * later fire.
 */
export function recordReactionEvent(
  state: ReactionState,
  rule: TutorReactionRule,
  nowMs: number,
): boolean {
  state.events.push(nowMs);
  state.events = state.events.filter((t) => nowMs - t <= rule.windowMs);
  if (state.fires >= rule.maxFiresPerSession) return false;
  if (state.events.length < rule.threshold) return false;
  state.fires += 1;
  state.events = [];
  return true;
}

/**
 * v1: repeated noise interruptions. Trigger site: applyPerceptionVerdict's
 * noise-family branch (verdict ∈ {noise, filler, drop_self_voice}) with an
 * open checkpoint — i.e. a cancel actually paused the tutor's speech or
 * aborted its thinking. 3 such cancels within 3 minutes ⇒ the tutor kindly
 * suggests reducing the noise or muting the mic and typing, once per session.
 */
export const NOISE_INTERRUPTION_REACTION: TutorReactionRule = {
  id: 'noise_nag',
  threshold: 3,
  windowMs: 180_000,
  maxFiresPerSession: 1,
  directive:
    '[System note: background sounds have repeatedly interrupted this session ' +
    'in the last few minutes. In one or two kind sentences, let the student ' +
    'know there seems to be noise in their background that keeps interrupting ' +
    'you, and suggest they either reduce the background noise or mute the mic ' +
    'and type instead. Do not scold or dwell on it. Then continue from where ' +
    'you left off.]',
};
