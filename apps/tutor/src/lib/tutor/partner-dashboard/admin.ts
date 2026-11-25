/**
 * The owner's view: every partner on one page, for the people who run Evelyn (Praveen 2026-11-24: who signed
 * up, how much they have used, who is active), with the two levers an operator needs: add minutes, and suspend.
 *
 * Who may see it: the dashboard accounts whose email is listed in PARTNER_DASHBOARD_ADMINS (comma-separated;
 * default praveen@evelynlearning.com). It is a view inside the partner dashboard, reached with the same
 * emailed-link sign-in, and not the /admin pages, whose sign-in runs on another host.
 */
import connectDB from '@core/db';
import { PartnerModel } from '@/models/Partner';
import { PartnerPoolModel } from '@/models/PartnerPool';
import { PartnerAccount } from '@/models/PartnerAccount';
import { TutorSession } from '@/models/TutorSession';
import { invalidatePartner } from '@/lib/tutor/portal/registry';

export function dashboardAdmins(env: NodeJS.ProcessEnv = process.env): Set<string> {
  return new Set((env.PARTNER_DASHBOARD_ADMINS || 'praveen@evelynlearning.com').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean));
}

export function isDashboardAdmin(email: string | null | undefined, env: NodeJS.ProcessEnv = process.env): boolean {
  return !!email && dashboardAdmins(env).has(email.toLowerCase());
}

export interface AdminPartnerRow {
  partnerId: string; name: string; status: string; plan: string; createdAt: string;
  owner: { email: string; name: string; company: string } | null; people: number;
  pooled: boolean; capMinutes: number; usedMinutes: number;
  sessions: number; sessions7d: number; lastSessionAt: string | null; firstSessionAt: string | null;
}

const tenth = (sec: number) => Math.round(sec / 6) / 10;

export async function adminPartnerRows(nowMs: number = Date.now()): Promise<AdminPartnerRow[]> {
  await connectDB();
  const weekAgo = new Date(nowMs - 7 * 86_400_000);
  const [partners, pools, accounts, sessions] = await Promise.all([
    PartnerModel.find({ kind: 'partner' }, { name: 1, status: 1, metering: 1, createdAt: 1 }).lean<Array<{ _id: string; name?: string; status?: string; metering?: { plan?: string }; createdAt?: string }>>(),
    PartnerPoolModel.find({}, { capSec: 1, usedSec: 1 }).lean<Array<{ _id: string; capSec?: number; usedSec?: number }>>(),
    PartnerAccount.find({}, { email: 1, name: 1, company: 1, partnerId: 1, role: 1, firstSessionAt: 1 }).lean<Array<{ email: string; name?: string; company?: string; partnerId: string; role?: string; firstSessionAt?: Date }>>(),
    TutorSession.aggregate<{ _id: string; sessions: number; last: Date; recent: number }>([
      { $match: { sourcePartnerId: { $nin: [null, ''] } } },
      { $group: { _id: '$sourcePartnerId', sessions: { $sum: 1 }, last: { $max: '$startedAt' }, recent: { $sum: { $cond: [{ $gte: ['$startedAt', weekAgo] }, 1, 0] } } } },
    ]),
  ]);
  const pool = new Map(pools.map((p) => [p._id, p]));
  const sess = new Map(sessions.map((s) => [s._id, s]));
  return partners.map((p) => {
    const people = accounts.filter((a) => a.partnerId === p._id);
    const owner = people.find((a) => a.role !== 'member') ?? null;
    const pl = pool.get(p._id); const s = sess.get(p._id);
    return {
      partnerId: p._id, name: p.name || p._id, status: p.status || 'active', plan: p.metering?.plan || '', createdAt: p.createdAt || '',
      owner: owner ? { email: owner.email, name: owner.name || '', company: owner.company || '' } : null, people: people.length,
      pooled: !!pl, capMinutes: tenth(pl?.capSec ?? 0), usedMinutes: tenth(pl?.usedSec ?? 0),
      sessions: s?.sessions ?? 0, sessions7d: s?.recent ?? 0, lastSessionAt: s?.last ? s.last.toISOString() : null,
      firstSessionAt: owner?.firstSessionAt ? owner.firstSessionAt.toISOString() : null,
    };
  }).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

export type AdminAction = { action: 'add_minutes'; partnerId: string; minutes: number } | { action: 'suspend' | 'resume'; partnerId: string };

/** Reads an action from a request body; null when it is not one. Minutes: 1 to 100,000, whole. */
export function parseAdminAction(body: unknown): AdminAction | null {
  const b = body as { action?: unknown; partnerId?: unknown; minutes?: unknown } | null;
  if (!b || typeof b.partnerId !== 'string' || !/^[a-z0-9][a-z0-9-]{1,40}$/.test(b.partnerId)) return null;
  if (b.action === 'suspend' || b.action === 'resume') return { action: b.action, partnerId: b.partnerId };
  if (b.action === 'add_minutes') {
    const m = Number(b.minutes);
    return Number.isInteger(m) && m >= 1 && m <= 100_000 ? { action: 'add_minutes', partnerId: b.partnerId, minutes: m } : null;
  }
  return null;
}

/** Apply an owner action. Adding minutes only ever raises a pool that exists (a partner with no pool is
 *  uncapped by design and is left so); the pool's alert stamps are cleared as scripts/ops/partner-pool.js does
 *  when a top-up brings use back under a line. A suspended partner's tokens and API calls stop at once here and
 *  within a minute on the other server processes (the registry cache). */
export async function applyAdminAction(a: AdminAction, by: string): Promise<{ ok: true } | { ok: false; error: 'not_found' | 'not_pooled' }> {
  await connectDB();
  const ts = new Date().toISOString();
  if (a.action === 'add_minutes') {
    const r = await PartnerPoolModel.updateOne({ _id: a.partnerId }, { $inc: { capSec: a.minutes * 60 }, $set: { updatedAt: ts }, $unset: { 'alerts.pct80At': '', 'alerts.pct100At': '' } });
    if (!r.matchedCount) return { ok: false, error: 'not_pooled' };
    console.log(`[partner-dashboard] admin ${by}: +${a.minutes} min for ${a.partnerId}`);
    return { ok: true };
  }
  const r = await PartnerModel.updateOne({ _id: a.partnerId, kind: 'partner' }, { $set: { status: a.action === 'suspend' ? 'suspended' : 'active', updatedAt: ts } });
  if (!r.matchedCount) return { ok: false, error: 'not_found' };
  invalidatePartner(a.partnerId);
  console.log(`[partner-dashboard] admin ${by}: ${a.action} ${a.partnerId}`);
  return { ok: true };
}
