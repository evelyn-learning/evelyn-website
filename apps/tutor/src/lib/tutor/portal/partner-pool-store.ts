/**
 * Partner minute pool — the store: reads a pool, charges a sitting.
 *
 * All Mongo access goes through `PoolStoreDeps` so the charge algorithm is
 * testable with an in-memory fake (scripts/test-partner-pool-store.ts).
 * A sitting's charge is a compare-and-set on `tutorsessions.poolCharges`:
 * two saves for the same sitting racing (beacon + keepalive) can both read
 * the same `chargedSec`, but only the one whose CAS matches gets to `$inc`
 * the pool. Everything fails OPEN: any throw → not charged, `{ pooled: false }`.
 * Spec: docs/superpowers/specs/2026-10-21-partner-minute-pool-design.md §4.2
 */
import {
  clampEngagedAt,
  poolView,
  sittingCharge,
  sittingEndMs,
  thresholdsCrossed,
  type PoolDoc,
  type PoolSnapshot,
  type PoolThreshold,
} from './partner-pool';

/** Two reports of the same sitting may disagree on engagedAt by this much (clock skew, ISO rounding). */
export const SITTING_MATCH_MS = 60_000;

export interface PoolStoreDeps {
  readPool(partnerId: string): Promise<PoolDoc | null>;
  /** null prevChargedSec = push a new sitting entry if absent; returns whether this call won. */
  casSittingCharge(a: { sessionId: string; engagedAtMs: number; prevChargedSec: number | null; newChargedSec: number }): Promise<boolean>;
  /** $inc usedSec; returns the new doc. */
  incPool(partnerId: string, deltaSec: number): Promise<PoolDoc | null>;
  readSitting(sessionId: string): Promise<{ createdAtMs: number; sittings: Array<{ engagedAtMs: number; chargedSec: number }> } | null>;
  now(): number;
}

export function mongoPoolStoreDeps(): PoolStoreDeps {
  return {
    async readPool(partnerId) {
      const { PartnerPoolModel } = await import('@/models/PartnerPool');
      const doc = await PartnerPoolModel.findById(partnerId).lean<PoolDoc | null>();
      return doc ?? null;
    },
    async casSittingCharge({ sessionId, engagedAtMs, prevChargedSec, newChargedSec }) {
      const { TutorSession } = await import('@/models/TutorSession');
      const engagedAt = new Date(engagedAtMs);
      if (prevChargedSec === null) {
        const r = await TutorSession.updateOne(
          { sessionId, 'poolCharges.engagedAt': { $ne: engagedAt } },
          { $push: { poolCharges: { engagedAt, chargedSec: newChargedSec } } },
        );
        return (r.matchedCount ?? 0) === 1 && (r.modifiedCount ?? 0) === 1;
      }
      const r = await TutorSession.updateOne(
        { sessionId, poolCharges: { $elemMatch: { engagedAt, chargedSec: prevChargedSec } } },
        { $set: { 'poolCharges.$.chargedSec': newChargedSec } },
      );
      return (r.matchedCount ?? 0) === 1 && (r.modifiedCount ?? 0) === 1;
    },
    async incPool(partnerId, deltaSec) {
      const { PartnerPoolModel } = await import('@/models/PartnerPool');
      const doc = await PartnerPoolModel.findByIdAndUpdate(
        partnerId,
        { $inc: { usedSec: deltaSec }, $set: { updatedAt: new Date().toISOString() } },
        { new: true },
      ).lean<PoolDoc | null>();
      return doc ?? null;
    },
    async readSitting(sessionId) {
      const { TutorSession } = await import('@/models/TutorSession');
      const doc = await TutorSession.findOne({ sessionId }, { createdAt: 1, startedAt: 1, poolCharges: 1 })
        .lean<{ createdAt?: Date; startedAt?: Date; poolCharges?: Array<{ engagedAt: Date; chargedSec: number }> } | null>();
      if (!doc) return null;
      const created = doc.createdAt ?? doc.startedAt;
      return {
        createdAtMs: created ? new Date(created).getTime() : Date.now(),
        sittings: (doc.poolCharges ?? []).map((c) => ({ engagedAtMs: new Date(c.engagedAt).getTime(), chargedSec: c.chargedSec })),
      };
    },
    now: () => Date.now(),
  };
}

export async function readPoolSnapshot(partnerId: string, deps: PoolStoreDeps = mongoPoolStoreDeps()): Promise<PoolSnapshot> {
  try {
    return poolView(await deps.readPool(partnerId));
  } catch (err) {
    console.warn('[partner-pool] partner_pool_unavailable', partnerId, (err as Error)?.message);
    return { pooled: false };
  }
}

export interface ChargeResult {
  charged: boolean;
  deltaSec: number;
  snapshot: PoolSnapshot;
  crossed: PoolThreshold[];
}

export async function chargeSitting(
  input: {
    partnerId: string;
    sessionId: string;
    reportedEngagedAtMs: number;
    save: { status: 'active' | 'completed' | 'abandoned'; endedAtMs?: number | null };
  },
  deps: PoolStoreDeps = mongoPoolStoreDeps(),
): Promise<ChargeResult> {
  const none = (snapshot: PoolSnapshot): ChargeResult => ({ charged: false, deltaSec: 0, snapshot, crossed: [] });
  try {
    const pool = await deps.readPool(input.partnerId);
    const snap = poolView(pool);
    if (!snap.pooled || !pool) return none(snap);

    const session = await deps.readSitting(input.sessionId);
    if (!session) return none(snap);
    const nowMs = deps.now();

    // Match this report to a sitting entry, or open a new one.
    const near = (ms: number) => session.sittings.find((s) => Math.abs(s.engagedAtMs - ms) <= SITTING_MATCH_MS);
    let entry = near(clampEngagedAt(input.reportedEngagedAtMs, { createdAtMs: session.createdAtMs, nowMs }));
    let engagedAtMs: number;
    if (entry) {
      engagedAtMs = entry.engagedAtMs;
    } else {
      const prevEngagedAtMs = session.sittings.length ? Math.max(...session.sittings.map((s) => s.engagedAtMs)) : undefined;
      engagedAtMs = clampEngagedAt(input.reportedEngagedAtMs, { createdAtMs: session.createdAtMs, prevEngagedAtMs, nowMs });
      entry = near(engagedAtMs);
      if (entry) engagedAtMs = entry.engagedAtMs;
    }

    const endMs = sittingEndMs(input.save, nowMs);
    const { wallSec, deltaSec } = sittingCharge({ engagedAtMs, endMs, chargedSec: entry?.chargedSec ?? 0, sessionMaxSec: snap.sessionMaxSec });
    if (deltaSec <= 0) return none(snap);

    const won = await deps.casSittingCharge({
      sessionId: input.sessionId,
      engagedAtMs,
      prevChargedSec: entry ? entry.chargedSec : null,
      newChargedSec: wallSec,
    });
    if (!won) return none(snap);

    const after = await deps.incPool(input.partnerId, deltaSec);
    const newDoc: PoolDoc = after ?? { ...pool, usedSec: pool.usedSec + deltaSec };
    const prevUsed = newDoc.usedSec - deltaSec;
    return {
      charged: true,
      deltaSec,
      snapshot: poolView(newDoc),
      crossed: thresholdsCrossed(prevUsed, newDoc.usedSec, newDoc.capSec),
    };
  } catch (err) {
    console.warn('[partner-pool] partner_pool_unavailable', input.partnerId, (err as Error)?.message);
    return none({ pooled: false });
  }
}
