/**
 * Session input-mode resolution (text-only tutor mode, 2026-09-19).
 *
 * Text mode is PARTNER-LEVEL: it is selected only by the signed embed-token
 * claim `input_mode: 'text'`. A kill switch (`NEXT_PUBLIC_TUTOR_TEXT_MODE`,
 * default ON per the house rule) makes the claim inert again — i.e. exactly
 * today's behaviour, where the claim is forwarded to analytics and ignored.
 *
 * Pure module: zero imports — server- and client-safe, unit-tested by
 * scripts/test-session-mode.ts.
 */
export type SessionMode = 'voice' | 'text';

export function resolveSessionMode(
  tokenInputMode: string | null | undefined,
  killSwitch: string | undefined,
): SessionMode {
  if (killSwitch === 'off') return 'voice';
  return tokenInputMode === 'text' ? 'text' : 'voice';
}

/** Reading pace for the silent clock in text mode (real speech ≈ 0.37 s/word;
 *  the harness's 0.15 would race the board ahead of a reader). */
export const TEXT_MODE_SECONDS_PER_WORD = 0.35;

export function textModeSecondsPerWord(env: string | undefined): number {
  const n = Number(env);
  return Number.isFinite(n) && n > 0 ? n : TEXT_MODE_SECONDS_PER_WORD;
}
