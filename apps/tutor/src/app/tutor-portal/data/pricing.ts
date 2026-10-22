/**
 * Portal pricing — ONE product, ONE per-minute rate (Praveen ruling 2026-09-14).
 *
 * The earlier Text / Standard / Premium tiers, the $2,500 setup fee, the
 * $500/mo platform fee and the "Launch Partner" promo are all retired. Every
 * partner pays the same usage rate on tutoring minutes actually used, with no
 * fixed fees, so a first partner can start small. Volume terms are negotiated,
 * not published.
 */

export const pricing = {
  productName: 'Voice Tutor',
  /** Partner list price, USD per VOICE tutoring minute (whiteboard included).
   *  2026-10-22 (Praveen ruling): $0.15 → $0.20. The measured all-in cost is
   *  ≈ $0.12–0.13 per minute and a cold session writes a ≈ $0.50 prompt
   *  cache, so the old rate was at cost. */
  perMinuteUsd: 0.2,
  /**
   * Text-only sessions (same tutor, same whiteboard, typed instead of spoken).
   * Cheaper because the speech layer (TTS + STT) is what the difference pays for
   * (Praveen ruling 2026-09-19).
   */
  textPerMinuteUsd: 0.16,
  /**
   * 2026-10-22 (Praveen ruling): every session is billed for at least this many
   * minutes — it covers the cold-start cost (the prompt-cache write) that a
   * one-minute session would otherwise leave unpaid.
   */
  minimumMinutesPerSession: 5,
  tagline: 'One product. One rate. No fixed fees.',
  description:
    'Voice + interactive-whiteboard AI tutor, embedded in your platform under your brand. ' +
    'Billed monthly on the minutes your students actually use.',
  includes: [
    'Voice and text tutoring with the full interactive whiteboard',
    'Structured pedagogy engine with adaptive pacing',
    '50+ spoken languages',
    'Homework photo upload',
    'Per-student learning gaps, mastery and topic notes',
    'Session transcript, progress and summary data through the partner API',
    'Your branding, your student IDs, your lesson context',
    'All AI inference, speech recognition and speech synthesis costs',
  ],
  billing: [
    'No setup fee, no monthly platform fee, no minimum commitment',
    'Minutes are metered per session and billed monthly in arrears',
    'Every session is billed for at least 5 minutes',
    'Volume pricing available for 50,000+ minutes per month — contact us',
  ],
};

/** What a free sandbox comes with. Same engine as production. */
export const sandboxLimits = {
  freeMinutes: 300,
  maxSessionDurationMinutes: 30,
  maxConcurrentSessions: 5,
};

/** A 30-minute session at list price — used wherever we quote "per session". */
export type SessionMode = 'voice' | 'text';

/** Per-minute list rate for a session mode. */
export const rateFor = (mode: SessionMode = 'voice') =>
  mode === 'text' ? pricing.textPerMinuteUsd : pricing.perMinuteUsd;

/** Minutes billed for a session: its length, never less than the per-session minimum. */
export const billableMinutes = (minutes: number) => Math.max(minutes, pricing.minimumMinutesPerSession);

export const perSessionUsd = (minutes: number, mode: SessionMode = 'voice') => billableMinutes(minutes) * rateFor(mode);

export function estimateMonthlyCost(
  studentsPerMonth: number,
  sessionsPerStudent: number,
  avgSessionMinutes: number,
  mode: SessionMode = 'voice',
): { totalMinutes: number; cost: number; perStudent: number; rate: number } {
  const totalMinutes = studentsPerMonth * sessionsPerStudent * billableMinutes(avgSessionMinutes);
  const rate = rateFor(mode);
  const cost = totalMinutes * rate;
  return { totalMinutes, cost, perStudent: studentsPerMonth > 0 ? cost / studentsPerMonth : 0, rate };
}
