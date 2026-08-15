// Enrichment auto-failover chain. Iterates the enrichment vendor adapters
// (Apollo -> Hunter -> Prospeo, in cost/quality order) for a single lead
// and stops at the first one that returns a result.
//
// Tradeoff, deliberate: this is first-hit-wins, not best-of-all-providers.
// A linkedin-only hit from an earlier provider stops the chain even though
// a later provider might have turned up a verified email — we spend at
// most one credit per lead per enrichment round rather than querying every
// vendor to maximize match quality. A future round can re-run a
// linkedin-only lead through the remaining providers if we want the email.
import { EnrichInput, EnrichProvider, EnrichResult, QuotaExhaustedError } from "./types";
import { LedgerOps, mongoLedger, monthKey, capForProvider } from "./ledger";
import { apolloProvider } from "./apollo";
import { hunterProvider } from "./hunter";
import { prospeoProvider } from "./prospeo";

export interface ChainDeps {
  providers?: EnrichProvider[];
  ledger?: LedgerOps;
  fetchFn?: typeof fetch;
  now?: Date;
}

export type AttemptStatus = "hit" | "miss" | "skipped_unconfigured" | "skipped_cap" | "exhausted";

export interface ChainOutcome {
  result: EnrichResult | null;
  attempts: Array<{ provider: string; status: AttemptStatus }>;
}

// Runs the enrichment chain for a single lead. Never throws: every
// per-provider failure mode (unconfigured, at-cap, quota-exhausted, plain
// error, null miss) is captured as an attempt and the chain moves on. This
// includes ledger errors (getUsed/setExhausted/addUse) — a transient Mongo
// hiccup on one provider must not abort a batch enrichment run over many
// leads; see the try/catch around each ledger call below.
export async function enrichLead(input: EnrichInput, deps: ChainDeps = {}): Promise<ChainOutcome> {
  const providers = deps.providers ?? [apolloProvider, hunterProvider, prospeoProvider];
  const ledger = deps.ledger ?? mongoLedger;
  const fetchFn = deps.fetchFn;
  const month = monthKey(deps.now);

  const attempts: ChainOutcome["attempts"] = [];

  for (const provider of providers) {
    // Belt-and-suspenders: adapters also self-guard on isConfigured() via
    // their own env check, but gating here avoids an unnecessary ledger
    // read for a provider we already know can't run.
    if (!provider.isConfigured()) {
      attempts.push({ provider: provider.name, status: "skipped_unconfigured" });
      continue;
    }

    let used: number;
    try {
      used = await ledger.getUsed(provider.name, month);
    } catch {
      // Ledger read failed (e.g. transient Mongo error) — treat as miss,
      // don't spend a credit blind. A batch of many leads shouldn't abort
      // over one DB hiccup; the next lead's read may well succeed.
      attempts.push({ provider: provider.name, status: "miss" });
      continue;
    }
    const cap = capForProvider(provider.name);
    if (used >= cap) {
      attempts.push({ provider: provider.name, status: "skipped_cap" });
      continue;
    }

    let result: EnrichResult | null;
    try {
      result = await provider.match(input, fetchFn);
    } catch (err) {
      if (err instanceof QuotaExhaustedError) {
        try {
          await ledger.setExhausted(provider.name, month);
        } catch {
          // Best-effort write: if it fails, the exhausted flag just
          // doesn't stick this time and a later call will retry it. The
          // chain still records/continues either way.
        }
        attempts.push({ provider: provider.name, status: "exhausted" });
        continue;
      }
      // A plain adapter error (e.g. an unexpected throw the adapter
      // itself failed to swallow) is treated as a miss, not exhaustion —
      // we don't want a transient bug in one adapter to permanently
      // block it for the rest of the month.
      attempts.push({ provider: provider.name, status: "miss" });
      continue;
    }

    if (result) {
      try {
        await ledger.addUse(provider.name, month, result.creditsUsed);
      } catch {
        // The enrichment itself succeeded; a lost credit-usage record is
        // the lesser harm vs. throwing away a real hit. Ledger may
        // under-count this provider's usage for the month as a result.
      }
      attempts.push({ provider: provider.name, status: "hit" });
      return { result, attempts };
    }

    attempts.push({ provider: provider.name, status: "miss" });
  }

  return { result: null, attempts };
}
