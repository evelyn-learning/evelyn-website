/**
 * The partner API's call log (models/PartnerApiLog.ts), written by portal/auth.ts withPortalAuth after every
 * call and read by the dashboard.
 *
 * A write never delays or fails the call: it is not awaited and its errors are dropped. A call that failed its
 * signature is logged too, under the partner id it claimed, because a bad signature is the mistake a new
 * integration makes most and the developer needs to see it. Since anyone can send such a call, those lines
 * are held to one a second per claimed partner in this process, so the log cannot be flooded through them.
 */
import connectDB, { isDBConfigured } from '@core/db';
import { PartnerApiLog } from '@/models/PartnerApiLog';

const lastRefusedAt = new Map<string, number>();
const SLUG = /^[a-z0-9][a-z0-9-]{1,40}$/;

/** Whether a refused, unauthenticated call is logged now (one a second per claimed partner). Pure but for the map. */
export function admitRefusedLine(partnerId: string, nowMs: number): boolean {
  const last = lastRefusedAt.get(partnerId) ?? 0;
  if (nowMs - last < 1000) return false;
  if (lastRefusedAt.size > 5000) lastRefusedAt.clear();
  lastRefusedAt.set(partnerId, nowMs);
  return true;
}

export function partnerApiLogOn(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.PARTNER_API_LOG !== 'off';
}

export function recordPartnerApiCall(line: { partnerId: string | null; authed: boolean; method: string; pathname: string; status: number; error?: string; startedMs: number }): void {
  if (!partnerApiLogOn() || !isDBConfigured() || !line.partnerId || !SLUG.test(line.partnerId)) return;
  const now = Date.now();
  if (!line.authed && !admitRefusedLine(line.partnerId, now)) return;
  void (async () => {
    try {
      await connectDB();
      await PartnerApiLog.create({ partnerId: line.partnerId, at: new Date(now), method: line.method, path: line.pathname.slice(0, 200), status: line.status, ...(line.error ? { error: line.error.slice(0, 80) } : {}), ms: Math.max(0, now - line.startedMs) });
    } catch { /* the log is a convenience: never the call's problem */ }
  })();
}

export interface ApiLogRow { at: string; method: string; path: string; status: number; error: string | null; ms: number }

export async function listApiLog(partnerId: string, limit = 100): Promise<ApiLogRow[]> {
  await connectDB();
  const docs = await PartnerApiLog.find({ partnerId }).sort({ at: -1 }).limit(Math.min(200, Math.max(1, limit))).lean();
  return docs.map((d) => ({ at: d.at.toISOString(), method: d.method, path: d.path, status: d.status, error: d.error ?? null, ms: d.ms }));
}
