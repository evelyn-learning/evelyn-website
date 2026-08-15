// Provider credit ledger for lead-enrichment vendors (Apollo, Hunter,
// Prospeo). Each provider offers a free-tier monthly quota; this module
// tracks usage against that quota so the enrichment chain (Task 4) can
// skip a provider once its month is exhausted.
//
// `monthKey`/`capForProvider` are pure and DB-free so they're unit-tested
// directly. `LedgerOps` is the seam: `mongoLedger` is the real Mongo-backed
// implementation, but Task 4's chain can inject an in-memory fake against
// the same interface for its own DB-free tests.
import { ProviderCredit } from "@/models/ProviderCredit";

export function monthKey(d: Date = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

// Same non-numeric/<=0 fallback pattern as costCapUsd() in
// research/cost.ts: an unusable env value silently falls back to the
// hardcoded default rather than producing NaN/0 caps.
const PROVIDER_CAP_ENV: Record<string, { env: string; fallback: number }> = {
  apollo: { env: "APOLLO_MONTHLY_CAP", fallback: 100 },
  hunter: { env: "HUNTER_MONTHLY_CAP", fallback: 25 },
  prospeo: { env: "PROSPEO_MONTHLY_CAP", fallback: 75 },
};

export function capForProvider(provider: string): number {
  const entry = PROVIDER_CAP_ENV[provider];
  if (!entry) return 0;
  const raw = Number(process.env[entry.env]);
  return Number.isFinite(raw) && raw > 0 ? raw : entry.fallback;
}

export interface LedgerOps {
  getUsed(provider: string, month: string): Promise<number>;
  addUse(provider: string, month: string, n: number): Promise<void>;
  setExhausted(provider: string, month: string): Promise<void>;
}

// Mongo-backed LedgerOps implementation. Caller must have called
// connectDB() first (same convention as insertLeads in
// lib/outreach/import-leads.ts).
export const mongoLedger: LedgerOps = {
  async getUsed(provider, month) {
    const doc = await ProviderCredit.findOne({ provider, month });
    return doc?.used ?? 0;
  },

  async addUse(provider, month, n) {
    await ProviderCredit.updateOne(
      { provider, month },
      { $inc: { used: n } },
      { upsert: true }
    );
  },

  // Marks the provider exhausted for the month by clamping `used` up to
  // its cap — never down, so a later call can't undo a higher recorded
  // usage.
  async setExhausted(provider, month) {
    await ProviderCredit.updateOne(
      { provider, month },
      { $max: { used: capForProvider(provider) } },
      { upsert: true }
    );
  },
};
