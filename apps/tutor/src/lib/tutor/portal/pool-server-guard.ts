/**
 * The partner minute pool, held on the server for the engine's paid calls (a brain turn, a realtime token, a
 * board or sketch generation).
 *
 * Why (2026-11-24, self-serve sandboxes): until now the pool was kept by the session page alone. It refuses a
 * start when the pool is empty and reports its minutes as it goes, and the charge is made from those reports.
 * That holds for a partner we know. Anyone can now get a signed token by themselves, and a caller that talks to
 * the paid routes directly, or never reports, would have no cap at all. Two checks, both on the server:
 *
 *   1. An empty pool refuses the call (the page already ends an open session at its next report).
 *   2. Every paid call is counted on the pool's own row, and the count has a ceiling that follows the pool's
 *      size: POOL_CALLS_PER_CAP_MINUTE calls for each minute of cap. A lesson makes well under ten such calls
 *      a minute, so a partner using its minutes as intended never meets it; a caller that reports nothing is
 *      stopped at a few times the pool's worth. A top-up raises the ceiling with the cap.
 *
 * A partner with no pool row is not pooled and is never refused here. A database failure allows the call: a
 * lesson in progress is worth more than the guard. Kill switch: TUTOR_POOL_SERVER_GUARD=off.
 */
import connectDB, { isDBConfigured } from '@core/db';
import { PartnerPoolModel } from '@/models/PartnerPool';

export const POOL_CALLS_PER_CAP_MINUTE = 30;
/** The ceiling never goes below this, so a small pool (a 10-minute trial) can still finish its lessons. */
export const POOL_CALLS_FLOOR = 600;

export type PoolGuardVerdict = 'ok' | 'pool_exhausted' | 'pool_call_limit';

export function poolCallCeiling(capSec: number): number {
  return Math.max(POOL_CALLS_FLOOR, Math.round((Math.max(0, capSec) / 60) * POOL_CALLS_PER_CAP_MINUTE));
}

/** The verdict for one pool row after counting this call. Pure. */
export function poolGuardVerdict(doc: { capSec?: number; usedSec?: number; serverCalls?: number } | null | undefined): PoolGuardVerdict {
  if (!doc) return 'ok';
  const cap = typeof doc.capSec === 'number' && Number.isFinite(doc.capSec) ? Math.max(0, doc.capSec) : 0;
  const used = typeof doc.usedSec === 'number' && Number.isFinite(doc.usedSec) ? Math.max(0, doc.usedSec) : 0;
  if (used >= cap) return 'pool_exhausted';
  if ((doc.serverCalls ?? 0) > poolCallCeiling(cap)) return 'pool_call_limit';
  return 'ok';
}

export function poolServerGuardOn(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.TUTOR_POOL_SERVER_GUARD !== 'off';
}

/** Count one paid call against the partner's pool and say whether it may go ahead. */
export async function poolServerGuard(partnerId: string): Promise<PoolGuardVerdict> {
  if (!poolServerGuardOn() || !partnerId || !isDBConfigured()) return 'ok';
  try {
    await connectDB();
    const doc = await PartnerPoolModel.findOneAndUpdate({ _id: partnerId }, { $inc: { serverCalls: 1 } }, { new: true, projection: { capSec: 1, usedSec: 1, serverCalls: 1 } })
      .lean<{ capSec?: number; usedSec?: number; serverCalls?: number } | null>();
    return poolGuardVerdict(doc);
  } catch (err) {
    console.warn('[partner-pool] server guard unavailable, allowing', partnerId, (err as Error)?.message);
    return 'ok';
  }
}
