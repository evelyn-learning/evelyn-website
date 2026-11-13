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

/** The speaking rate for a grade level when the tenant has set none (tutor v2). A lesson for a twelve-year-old
 *  was spoken at the pace of an AP lesson (Praveen, algebra 1, embed-1794537652738). The values are sonic-3
 *  `generation_config.speed`; measured, 0.85 is about 5% slower and 0.7 about 15 to 23% slower, so the steps
 *  are larger than they look. Levels come as "7", "9-10", "grade 4", "k", "ap", "college": the first number
 *  decides; a level with no number (AP, college, test prep) is spoken at the normal rate. */
export function speechRateForLevel(level: string | undefined): number | undefined {
  const text = (level ?? '').toLowerCase();
  if (/^(?:k|kg|kindergarten|pre-?k)\b/.test(text)) return 0.7;
  const grade = Number(text.match(/\d{1,2}/)?.[0] ?? NaN);
  if (!Number.isFinite(grade) || grade > 12) return undefined;
  if (grade <= 5) return 0.7;
  if (grade <= 8) return 0.78;
  if (grade <= 10) return 0.88;
  return undefined;
}
