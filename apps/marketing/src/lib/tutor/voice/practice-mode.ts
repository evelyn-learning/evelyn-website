/**
 * Practice-mode derivation (Task Y1, round 14).
 *
 * Task X2 made `practiceMode` durable across resume by deriving it from the
 * embed token's `sessionGoal` on every mint (initial + resume) — the
 * LAUNCH-CONTEXT source, set once when the session is created.
 *
 * Task Y1 adds a second input: the student's IN-SESSION intent, expressed
 * by tapping the "Practice problems" / "Explain a concept" starter chips
 * (see SessionStage.tsx). That intent is captured as `practiceOverride` and
 * persisted in the same `evelyn:pacing-v2:<planId>` localStorage blob that
 * already carries paceBias/speakingRate (VoiceTutorRealtime.tsx), so it
 * survives a resume of the same plan exactly like those do.
 *
 * Precedence (documented here as the single source of truth — every call
 * site should defer to this function rather than re-deriving the flag):
 *   - `sessionGoal` is the launch-context default.
 *   - `practiceOverride` is the student's in-session override and wins
 *     WHILE SET — it can only force practice mode ON, never force it off.
 *     Clearing the override (chip: "Explain a concept") does not fight the
 *     token; it simply removes the override, so the token goal governs
 *     again. There is no "forced off" state by design — a token goal of
 *     'practice' can't be chip-cleared, matching the token's role as the
 *     durable per-session contract.
 *
 * Pure — no React, no DOM, no storage access — so it's usable identically
 * from the client component (VoiceTutorRealtime.tsx, deciding what to send
 * the brain each turn) and from unit tests (test-practice-session-block.ts).
 */
import type { SessionGoal } from '@/lib/tutor/types';

export function derivePracticeMode(sessionGoal: SessionGoal | undefined, practiceOverride?: boolean): boolean {
  return sessionGoal === 'practice' || !!practiceOverride;
}
