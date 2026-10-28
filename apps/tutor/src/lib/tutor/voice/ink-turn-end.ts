/**
 * Ink 2 turn-end timeout, keyed on the session's languages.
 *
 * 2026-10-17 (GDI embed-1792254012923 / -1792261973710): with 5600 ms, Ink
 * confirmed the end of a finished A1 turn 3–5.4 s after its eager end on about
 * half the turns — the student had stopped; Ink was waiting out the timeout —
 * and that wait was most of the "Hearing you" time. 3000 ms was decided with
 * Praveen for those lessons. 2026-10-27 (GDI → main merge): the shorter
 * timeout stays BILINGUAL-ONLY — a maths learner pauses longer mid-thought,
 * and every English-only tenant keeps the Phase-1-verified 5600 ms.
 *
 * `NEXT_PUBLIC_TUTOR_INK_TURN_END_TIMEOUT_MS` (build-time, read here so the
 * inlining works) overrides BOTH when set to a finite positive number.
 *
 * Pure. Client-safe.
 */
import { sessionAllowsNonLatin } from './transcript-filters';

/** Phase-1-verified default: every session without a non-Latin tutor language. */
export const INK_TURN_END_TIMEOUT_MS = 5600;
/** Bilingual (non-Latin tutor language) sessions, decided 2026-10-17. */
export const INK_TURN_END_TIMEOUT_MS_BILINGUAL = 3000;

const ENV_RAW = process.env.NEXT_PUBLIC_TUTOR_INK_TURN_END_TIMEOUT_MS;

export function inkTurnEndTimeoutMs(tutorLanguages: string[] | undefined, envRaw: string | undefined = ENV_RAW): number {
  const n = envRaw === undefined || envRaw === '' ? NaN : Number(envRaw);
  if (Number.isFinite(n) && n > 0) return n;
  return sessionAllowsNonLatin(tutorLanguages) ? INK_TURN_END_TIMEOUT_MS_BILINGUAL : INK_TURN_END_TIMEOUT_MS;
}
