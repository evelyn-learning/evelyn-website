/**
 * Partner minute pool — pure helpers (no imports, no I/O).
 *
 * A pooled partner has a fixed bank of wall-clock tutoring seconds; every
 * sitting (one page mount) is charged from the moment the tutor engaged to
 * the end of each usage report, so an abandoned tab stops costing when its
 * last report says it ended. Every reader of these helpers fails OPEN: a
 * missing or unreadable pool means "not pooled", never a blocked student.
 * Spec: docs/superpowers/specs/2026-10-21-partner-minute-pool-design.md
 */

export const POOL_MIN_START_SEC = 60;
export const POOL_CHARGE_SLACK_SEC = 120;
export const DEFAULT_SESSION_MAX_SEC = 900;
export const DEFAULT_IDLE_END_SEC = 1800;
/** Token-less default for the effective sitting cap (today's embed default, 30 min). */
export const DEFAULT_TOKEN_MAX_SEC = 1800;
/** Engaged-at may precede the session row's createdAt by this much (clock skew, insert after engage). */
export const ENGAGED_AT_FLOOR_SLACK_MS = 60_000;

export const POOL_BLOCKED_LINE = 'Tutoring minutes for this program are used up.';
export const POOL_GOODBYE_LINE = 'The tutoring minutes for this program are used up for now.';

export type PoolThreshold = 'pct80' | 'pct100';

export interface PoolDoc {
  _id: string;
  capSec: number;
  usedSec: number;
  sessionMaxSec?: number;
  idleEndSec?: number;
  alerts?: { pct80At?: string; pct100At?: string };
}

export interface PoolView {
  pooled: true;
  capSec: number;
  usedSec: number;
  remainingSec: number;
  sessionMaxSec: number;
  idleEndSec: number;
  exhausted: boolean;
}

export type PoolSnapshot = PoolView | { pooled: false };

function finiteOr(n: unknown, fallback: number): number {
  return typeof n === 'number' && Number.isFinite(n) ? n : fallback;
}

export function poolView(doc: PoolDoc | null | undefined): PoolSnapshot {
  if (!doc) return { pooled: false };
  const capSec = Math.max(0, finiteOr(doc.capSec, 0));
  const usedSec = Math.max(0, finiteOr(doc.usedSec, 0));
  const remainingSec = Math.max(0, capSec - usedSec);
  return {
    pooled: true,
    capSec,
    usedSec,
    remainingSec,
    sessionMaxSec: finiteOr(doc.sessionMaxSec, DEFAULT_SESSION_MAX_SEC),
    idleEndSec: finiteOr(doc.idleEndSec, DEFAULT_IDLE_END_SEC),
    exhausted: remainingSec < POOL_MIN_START_SEC,
  };
}

/** Keep a client-reported engaged-at inside [createdAt − slack, now]; a previous sitting raises the floor. */
export function clampEngagedAt(
  reportedMs: number,
  bounds: { createdAtMs: number; prevEngagedAtMs?: number; nowMs: number },
): number {
  let floor = bounds.createdAtMs - ENGAGED_AT_FLOOR_SLACK_MS;
  if (typeof bounds.prevEngagedAtMs === 'number') floor = Math.max(floor, bounds.prevEngagedAtMs);
  const ceiling = bounds.nowMs;
  return Math.min(ceiling, Math.max(floor, reportedMs));
}

/** The end of the sitting this save describes: an active save means "still going", so its end is now. */
export function sittingEndMs(
  save: { status: 'active' | 'completed' | 'abandoned'; endedAtMs?: number | null },
  nowMs: number,
): number {
  if (save.status === 'active') return nowMs;
  return typeof save.endedAtMs === 'number' && Number.isFinite(save.endedAtMs) ? save.endedAtMs : nowMs;
}

export function sittingCharge(input: {
  engagedAtMs: number;
  endMs: number;
  chargedSec: number;
  sessionMaxSec: number;
}): { wallSec: number; deltaSec: number } {
  const raw = Math.floor((input.endMs - input.engagedAtMs) / 1000);
  const wallSec = Math.max(0, Math.min(raw, input.sessionMaxSec + POOL_CHARGE_SLACK_SEC));
  const deltaSec = Math.max(0, wallSec - Math.max(0, input.chargedSec));
  return { wallSec, deltaSec };
}

export function effectiveCapSec(input: { tokenMaxSec?: number; sessionMaxSec: number; remainingSec: number }): number {
  const tokenMax = finiteOr(input.tokenMaxSec, DEFAULT_TOKEN_MAX_SEC);
  return Math.max(0, Math.min(tokenMax, input.sessionMaxSec, input.remainingSec));
}

export function startDecision(
  snap: PoolSnapshot,
): { start: true; capSec?: number; idleEndSec?: number } | { start: false; reason: 'minutes_exhausted' } {
  if (!snap.pooled) return { start: true };
  if (snap.exhausted) return { start: false, reason: 'minutes_exhausted' };
  return { start: true, capSec: snap.remainingSec, idleEndSec: snap.idleEndSec };
}

const THRESHOLDS: Array<[PoolThreshold, number]> = [['pct80', 0.8], ['pct100', 1.0]];

/** Thresholds the usage crossed going from prev to new (each once, in order). */
export function thresholdsCrossed(prevUsedSec: number, newUsedSec: number, capSec: number): PoolThreshold[] {
  if (!(capSec > 0)) return [];
  const out: PoolThreshold[] = [];
  for (const [name, frac] of THRESHOLDS) {
    const line = capSec * frac;
    if (prevUsedSec < line && newUsedSec >= line) out.push(name);
  }
  return out;
}

/** Alerts already sent that no longer apply (usage fell back under the line, e.g. after a top-up). */
export function thresholdsCleared(newUsedSec: number, capSec: number, alerts: PoolDoc['alerts']): PoolThreshold[] {
  if (!alerts) return [];
  const out: PoolThreshold[] = [];
  for (const [name, frac] of THRESHOLDS) {
    const sentAt = name === 'pct80' ? alerts.pct80At : alerts.pct100At;
    if (sentAt && newUsedSec < capSec * frac) out.push(name);
  }
  return out;
}

export function clockPoolSeconds(snap: PoolSnapshot | null | undefined): number | undefined {
  return snap && snap.pooled ? snap.remainingSec : undefined;
}

export function poolFlagOn(env: string | undefined): boolean {
  return env !== 'off';
}

/** Which partner a usage save charges: the verified token's partner wins; the body's is a fallback. */
export function chargePartnerFor(input: {
  tokenPartnerId?: string | null;
  bodyPartnerId?: string | null;
}): { partnerId: string | null; mismatch: boolean } {
  const token = (input.tokenPartnerId ?? '').trim() || null;
  const body = (input.bodyPartnerId ?? '').trim() || null;
  if (token) return { partnerId: token, mismatch: body !== null && body !== token };
  return { partnerId: body, mismatch: false };
}

const toMinutes = (sec: number) => Math.round(sec / 6) / 10;

/** The partner-facing shape of GET /api/portal/v1/usage (minutes to one decimal). */
export function usageResponse(
  snap: PoolSnapshot,
  partnerId: string,
): { partner_id: string; pooled: boolean; cap_minutes?: number; used_minutes?: number; remaining_minutes?: number; session_max_minutes?: number } {
  if (!snap.pooled) return { partner_id: partnerId, pooled: false };
  return {
    partner_id: partnerId,
    pooled: true,
    cap_minutes: toMinutes(snap.capSec),
    used_minutes: toMinutes(snap.usedSec),
    remaining_minutes: toMinutes(snap.remainingSec),
    session_max_minutes: toMinutes(snap.sessionMaxSec),
  };
}
