/**
 * Per-tenant tutor speaking rate (the `speech_rate` embed claim).
 *
 * Sent to Cartesia as `generation_config.speed` — the sonic-3 control. The
 * older `voice.__experimental_controls.speed` that `cartesiaVoiceSpeed` and
 * the "speak slower" toggle send is ignored by sonic-3.6 (measured
 * 2026-10-14: −0.5 left clip length unchanged; generation_config 0.85 ≈ 5%
 * slower, 0.7 ≈ 15–23% slower).
 *
 * Absent / 1 / unusable ⇒ undefined and every TTS request is unchanged.
 */
export const SPEECH_RATE_MIN = 0.6;
export const SPEECH_RATE_MAX = 1.5;

export function parseSpeechRate(raw: unknown): number | undefined {
  const n = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : raw;
  if (typeof n !== 'number' || !Number.isFinite(n)) return undefined;
  const clamped = Math.min(SPEECH_RATE_MAX, Math.max(SPEECH_RATE_MIN, n));
  return clamped === 1 ? undefined : Math.round(clamped * 100) / 100;
}
