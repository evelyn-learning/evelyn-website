/**
 * The dashboard's store on MongoDB (service.ts DashStore). Server only.
 *
 * A partner created here is the same row the seed script writes (scripts/seed-partner-registry.ts
 * buildCreateDoc): kind 'partner', the portal API on its allowlist, the secret sealed. It also gets its minute
 * pool in the same step: a partner with no pool row is uncapped, which a self-serve sandbox must never be.
 */
import connectDB from '@core/db';
import { PartnerAccount } from '@/models/PartnerAccount';
import { PartnerLoginToken } from '@/models/PartnerLoginToken';
import { PartnerDashSession } from '@/models/PartnerDashSession';
import { PartnerModel, type ISealedSecretDoc } from '@/models/Partner';
import { PartnerPoolModel } from '@/models/PartnerPool';
import { reserveCounter, rollbackCounter } from '@/lib/tutor/demo-gate/counter';
import { decryptSecret, encryptSecret } from '@/lib/tutor/portal/secret-box';
import { ENV_FALLBACK_ALLOWED_ENDPOINTS, ENV_FALLBACK_LIMITS, invalidatePartner } from '@/lib/tutor/portal/registry';
import { dashboardOrigin, envPartnerIds, selfServeSignupOn, signupLimits } from './core';
import { dashboardOwnerEmail, sendDashboardMail } from './mailer';
import type { AccountRow, DashStore, ServiceEnv } from './service';

const isDuplicate = (err: unknown) => (err as { code?: number } | null)?.code === 11000;
const account = (d: AccountRow | null): AccountRow | null => (d ? {
  email: d.email, partnerId: d.partnerId, name: d.name || '', company: d.company || '', role: d.role === 'member' ? 'member' : 'owner',
  useCase: d.useCase, termsVersion: d.termsVersion, termsAcceptedAt: d.termsAcceptedAt, lastLoginAt: d.lastLoginAt, firstSessionAt: d.firstSessionAt, createdAt: d.createdAt,
} : null);

export type MongoDashStore = DashStore & { stampFirstSession(partnerId: string, at: Date): Promise<AccountRow | null> };

export function mongoDashStore(): MongoDashStore {
  const db = () => connectDB();
  return {
    now: () => Date.now(),
    async reserve(key, cap) { await db(); return reserveCounter(key, cap); },
    async release(key) { await db(); await rollbackCounter(key); },
    async findAccount(email) { await db(); return account(await PartnerAccount.findOne({ email }).lean<AccountRow | null>()); },
    async listAccounts(partnerId) { await db(); return (await PartnerAccount.find({ partnerId }).sort({ createdAt: 1 }).lean<AccountRow[]>()).map((d) => account(d)!); },
    async createAccount(row) {
      await db();
      try { await PartnerAccount.create(row); return true; } catch (err) { if (isDuplicate(err)) return false; throw err; }
    },
    async updateAccount(email, set) { await db(); await PartnerAccount.updateOne({ email }, { $set: set }); },
    async removeAccount(email) { await db(); await PartnerAccount.deleteOne({ email }); },
    async saveLink(row) { await db(); await PartnerLoginToken.create(row); },
    async takeLink(tokenHash) {
      await db();
      const now = new Date();
      const d = await PartnerLoginToken.findOneAndUpdate({ tokenHash, usedAt: { $exists: false }, expiresAt: { $gt: now } }, { $set: { usedAt: now } }).lean();
      return d ? { tokenHash: d.tokenHash, email: d.email, purpose: d.purpose, signup: d.signup, ip: d.ip, expiresAt: d.expiresAt } : null;
    },
    async saveSession(tokenHash, email, expiresAt) { await db(); await PartnerDashSession.create({ tokenHash, email, expiresAt }); },
    async sessionEmail(tokenHash) {
      await db();
      const d = await PartnerDashSession.findOne({ tokenHash, expiresAt: { $gt: new Date() } }, { email: 1 }).lean<{ email: string } | null>();
      return d?.email ?? null;
    },
    async dropSession(tokenHash) { await db(); await PartnerDashSession.deleteOne({ tokenHash }); },
    async dropSessionsOf(email) { await db(); await PartnerDashSession.deleteMany({ email }); },
    async partnerIdTaken(id) {
      if (envPartnerIds().has(id)) return true;
      await db();
      return !!(await PartnerModel.exists({ _id: id })) || !!(await PartnerPoolModel.exists({ _id: id }));
    },
    async createPartner({ partnerId, name, secret, poolMinutes }) {
      await db();
      const ts = new Date().toISOString();
      const sealed = encryptSecret(secret);
      // The pool first: were the partner row to exist for a moment without it, that moment would be uncapped.
      await PartnerPoolModel.create({ _id: partnerId, capSec: Math.round(poolMinutes * 60), usedSec: 0, updatedAt: ts });
      try {
        await PartnerModel.create({
          _id: partnerId, name: name || partnerId, kind: 'partner', status: 'active',
          secrets: [{ ciphertext: sealed.ciphertext, keyVersion: sealed.keyVersion, label: 'self-serve', createdAt: ts }],
          allowedEndpoints: ENV_FALLBACK_ALLOWED_ENDPOINTS, limits: ENV_FALLBACK_LIMITS,
          flagOverrides: {}, metering: { plan: 'sandbox' }, createdAt: ts, updatedAt: ts,
        });
      } catch (err) {
        await PartnerPoolModel.deleteOne({ _id: partnerId, usedSec: 0 }).catch(() => undefined);
        throw err;
      }
      invalidatePartner(partnerId);
    },
    async partnerSecrets(partnerId) {
      await db();
      const d = await PartnerModel.findById(partnerId, { secrets: 1 }).lean<{ secrets?: ISealedSecretDoc[] } | null>();
      const now = Date.now();
      const out: Array<{ secret: string; label: string; createdAt: string; expiresAt?: string }> = [];
      for (const s of d?.secrets ?? []) {
        if (s.expiresAt && !(Date.parse(s.expiresAt) > now)) continue;
        try { out.push({ secret: decryptSecret({ ciphertext: s.ciphertext, keyVersion: s.keyVersion }), label: s.label, createdAt: s.createdAt, expiresAt: s.expiresAt }); } catch { /* a secret this key cannot open is not shown */ }
      }
      return out;
    },
    async rotateSecret(partnerId, secret, othersExpireAt) {
      await db();
      const d = await PartnerModel.findById(partnerId, { secrets: 1 }).lean<{ secrets?: ISealedSecretDoc[] } | null>();
      if (!d) throw new Error('partner not found');
      const now = Date.now(); const ts = new Date(now).toISOString(); const until = othersExpireAt.toISOString();
      // Secrets already past their expiry are dropped; live ones keep the earlier of their expiry and the new one.
      const kept = (d.secrets ?? []).filter((s) => !s.expiresAt || Date.parse(s.expiresAt) > now)
        .map((s) => ({ ...s, expiresAt: s.expiresAt && s.expiresAt < until ? s.expiresAt : until }));
      const sealed = encryptSecret(secret);
      await PartnerModel.updateOne({ _id: partnerId }, { $set: { secrets: [{ ciphertext: sealed.ciphertext, keyVersion: sealed.keyVersion, label: 'rotated', createdAt: ts }, ...kept], updatedAt: ts } });
      invalidatePartner(partnerId);
    },
    sendMail: sendDashboardMail,
    async stampFirstSession(partnerId, at) {
      await db();
      return account(await PartnerAccount.findOneAndUpdate({ partnerId, role: 'owner', firstSessionAt: { $exists: false } }, { $set: { firstSessionAt: at } }).lean<AccountRow | null>());
    },
  };
}

export function serviceEnv(env: NodeJS.ProcessEnv = process.env): ServiceEnv {
  return { origin: dashboardOrigin(env), limits: signupLimits(env), ownerEmail: dashboardOwnerEmail(env), signupOn: selfServeSignupOn(env) };
}
