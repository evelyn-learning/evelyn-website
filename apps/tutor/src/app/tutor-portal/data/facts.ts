/**
 * The numbers the public pages quote, read from the code that enforces them (2026-11-24).
 *
 * The pricing page said "billed monthly in arrears" and "5 concurrent sessions" while the service sold prepaid
 * packs and enforced no such limit: the copy had been typed, not read. Every figure on the home page, the
 * pricing page, llms.txt and the structured data comes through here.
 *
 * SERVER ONLY: partner-dashboard/core.ts and billing.ts use node:crypto and the database models. Client
 * components take what they need as props (or from data/pricing.ts, which is pure).
 */
import { ROTATED_SECRET_GRACE_MS, SANDBOX_FREE_MINUTES } from '@/lib/tutor/partner-dashboard/core';
import { MINUTE_PACKS, PACK_LIFETIME_MS, PAID_SESSION_MAX_SEC, perMinute, topUpLineSec } from '@/lib/tutor/partner-dashboard/billing';
import { DEFAULT_SESSION_MAX_SEC, TEXT_MINUTE_RATE } from '@/lib/tutor/portal/partner-pool';
import { offeredLanguages } from '@/lib/tutor/voice/lesson-language';
import { languageCount } from './languages';
import { pricing } from './pricing';

export interface PackFact { id: string; minutes: number; usd: number; perMinuteUsd: number; label: string; topUpAtMinutes: number }
export interface TaughtLanguage { code: string; english: string; ownName: string }

export interface PortalFacts {
  voicePerMinuteUsd: number;
  textPerMinuteUsd: number;
  /** What a typed minute draws from a prepaid balance (0.8). */
  textMinuteRate: number;
  packs: PackFact[];
  largestPack: PackFact;
  /** How long pack minutes stay usable, in months. */
  packValidityMonths: number;
  sandboxFreeMinutes: number;
  sandboxSessionMinutes: number;
  paidSessionMinutes: number;
  /** Hours the old secret keeps working after a rotation. */
  rotationGraceHours: number;
  /** The languages a whole lesson can be taught in: the engine's rows marked ready. */
  taughtLanguages: TaughtLanguage[];
  /** The public language-reach figure (data/languages.ts). Not the same claim as taughtLanguages; do not merge them. */
  reachLanguageCount: number;
}

const YEAR_MS = 365 * 24 * 60 * 60_000;

export function portalFacts(): PortalFacts {
  const packs = MINUTE_PACKS.map((p) => ({ id: p.id, minutes: p.minutes, usd: p.usd, perMinuteUsd: perMinute(p), label: p.label, topUpAtMinutes: topUpLineSec(p) / 60 }));
  return {
    voicePerMinuteUsd: pricing.perMinuteUsd,
    textPerMinuteUsd: pricing.textPerMinuteUsd,
    textMinuteRate: TEXT_MINUTE_RATE,
    packs,
    largestPack: packs.reduce((a, b) => (b.minutes > a.minutes ? b : a)),
    packValidityMonths: Math.round((PACK_LIFETIME_MS / YEAR_MS) * 12),
    sandboxFreeMinutes: SANDBOX_FREE_MINUTES,
    sandboxSessionMinutes: DEFAULT_SESSION_MAX_SEC / 60,
    paidSessionMinutes: PAID_SESSION_MAX_SEC / 60,
    rotationGraceHours: ROTATED_SECRET_GRACE_MS / 3_600_000,
    taughtLanguages: offeredLanguages().map((l) => ({ code: l.code, english: l.english, ownName: l.label })),
    reachLanguageCount: languageCount,
  };
}

/** "$100", "$1,600": a whole-dollar amount. */
export const usd = (n: number): string => `$${n.toLocaleString('en-US')}`;
/** "$0.20", "$0.18", "$0.144": a per-minute rate, with a third decimal only when it has one. */
export const rateUsd = (n: number): string => `$${n.toFixed(Math.round(n * 1000) % 10 === 0 ? 2 : 3)}`;
export const count = (n: number): string => n.toLocaleString('en-US');

/** "A, B and C". */
export function listAnd(items: readonly string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** The taught languages by their English names, as a sentence fragment. */
export function taughtLanguageNames(f: PortalFacts = portalFacts()): string {
  return listAnd(f.taughtLanguages.map((l) => l.english));
}

/**
 * How a session's reported duration and the minute balance are counted, in the words every page uses
 * (2026-11-24). The API docs said the active-time figure "is the number your invoice is based on"; minutes are
 * prepaid, and the balance is drawn by the clock, not by active time:
 *   - durationSec: gaps between consecutive messages, each capped at ten minutes (portal/session-summary.ts
 *     activeSeconds, ACTIVE_GAP_CAP_SEC);
 *   - the balance: each sitting from when the lesson starts to its end or its last report, clamped at the
 *     session limit plus a small margin (portal/partner-pool.ts sittingCharge, partner-pool-store.ts
 *     chargeSitting), typed sessions at TEXT_MINUTE_RATE.
 */
export function minuteCounting(f: PortalFacts = portalFacts()): { balance: string; reported: string } {
  return {
    balance:
      `Your minute balance is drawn by the clock. Each sitting of a session counts from the moment the lesson starts to the moment it ends, pauses included; ` +
      `if the tab is closed or abandoned, it counts up to the last report the session page sent. A sitting stops counting at your session limit ` +
      `(${f.sandboxSessionMinutes} minutes in the free sandbox, ${f.paidSessionMinutes} after a first purchase), apart from a margin of a few minutes at most while a lesson is finishing. ` +
      `A minute of a voice session uses one minute of balance and a minute of a typed session uses ${f.textMinuteRate}. ` +
      `The balance is reported by GET /usage and on your dashboard.`,
    reported:
      `durationSec in GET /sessions/summary is a different figure: active tutoring time, the gaps between consecutive messages with each gap capped at ten minutes, so an idle open tab adds nothing. ` +
      `Use it to show how long a student worked. It is not what your balance is drawn by.`,
  };
}
