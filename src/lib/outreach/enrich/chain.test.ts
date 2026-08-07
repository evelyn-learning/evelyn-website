import { strict as assert } from "node:assert";
import type { EnrichInput, EnrichProvider, EnrichResult } from "./types";
import { QuotaExhaustedError } from "./types";
import type { LedgerOps } from "./ledger";
import { enrichLead } from "./chain";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const input: EnrichInput = {
  name: "Jane Doe",
  title: "Director of Nursing",
  company: "Acme Health System",
  websiteDomain: "acme-health.edu",
};

// In-memory LedgerOps fake — Task 4 tests must never touch Mongo.
// `throwOn` lets a test simulate a transient Mongo error on a specific op
// (optionally scoped to one provider) to exercise the chain's
// ledger-error resilience.
function fakeLedger(
  seed: Record<string, number> = {},
  throwOn?: { op: "getUsed" | "addUse" | "setExhausted"; provider?: string }
): LedgerOps & { calls: Array<{ op: string; provider: string; month: string; n?: number }> } {
  const used = new Map<string, number>(Object.entries(seed));
  const calls: Array<{ op: string; provider: string; month: string; n?: number }> = [];
  const key = (provider: string, month: string) => `${provider}:${month}`;
  const maybeThrow = (op: "getUsed" | "addUse" | "setExhausted", provider: string) => {
    if (throwOn && throwOn.op === op && (!throwOn.provider || throwOn.provider === provider)) {
      throw new Error("ECONNRESET: simulated Mongo hiccup");
    }
  };
  return {
    calls,
    async getUsed(provider, month) {
      calls.push({ op: "getUsed", provider, month });
      maybeThrow("getUsed", provider);
      return used.get(key(provider, month)) ?? 0;
    },
    async addUse(provider, month, n) {
      calls.push({ op: "addUse", provider, month, n });
      maybeThrow("addUse", provider);
      used.set(key(provider, month), (used.get(key(provider, month)) ?? 0) + n);
    },
    async setExhausted(provider, month) {
      calls.push({ op: "setExhausted", provider, month });
      maybeThrow("setExhausted", provider);
      used.set(key(provider, month), Number.MAX_SAFE_INTEGER);
    },
  };
}

function fakeProvider(opts: {
  name: string;
  configured?: boolean;
  result?: EnrichResult | null;
  throwQuota?: boolean;
  throwPlain?: boolean;
}): EnrichProvider & { calls: number } {
  const p = {
    name: opts.name,
    calls: 0,
    isConfigured: () => opts.configured ?? true,
    async match(): Promise<EnrichResult | null> {
      p.calls++;
      if (opts.throwQuota) throw new QuotaExhaustedError(opts.name);
      if (opts.throwPlain) throw new Error("boom");
      return opts.result ?? null;
    },
  };
  return p;
}

const NOW = new Date("2026-08-07T12:00:00Z");
const MONTH = "2026-08";

(async () => {
  await test("first-hit-wins: first provider with a result wins, later providers untouched", async () => {
    const hit: EnrichResult = { provider: "apollo", email: "jane@acme-health.edu", creditsUsed: 1 };
    const apollo = fakeProvider({ name: "apollo", result: hit });
    const hunter = fakeProvider({ name: "hunter", result: { provider: "hunter", email: "other@x.com", creditsUsed: 1 } });
    const ledger = fakeLedger();

    const outcome = await enrichLead(input, { providers: [apollo, hunter], ledger, now: NOW });

    assert.deepEqual(outcome.result, hit);
    assert.equal(hunter.calls, 0);
    assert.deepEqual(outcome.attempts, [{ provider: "apollo", status: "hit" }]);
  });

  await test("chain tries providers in the given order", async () => {
    const order: string[] = [];
    const miss = (name: string) => fakeProvider({ name, result: null });
    const a = miss("apollo"), h = miss("hunter"), p = miss("prospeo");
    // Wrap match to record call order.
    for (const prov of [a, h, p]) {
      const orig = prov.match.bind(prov);
      prov.match = async (...args: Parameters<typeof orig>) => { order.push(prov.name); return orig(...args); };
    }
    await enrichLead(input, { providers: [a, h, p], ledger: fakeLedger(), now: NOW });
    assert.deepEqual(order, ["apollo", "hunter", "prospeo"]);
  });

  await test("unconfigured provider is skipped without calling match or touching the ledger", async () => {
    const apollo = fakeProvider({ name: "apollo", configured: false });
    const hunter = fakeProvider({ name: "hunter", result: { provider: "hunter", email: "jane@x.com", creditsUsed: 1 } });
    const ledger = fakeLedger();

    const outcome = await enrichLead(input, { providers: [apollo, hunter], ledger, now: NOW });

    assert.equal(apollo.calls, 0);
    assert.equal(ledger.calls.some((c) => c.provider === "apollo"), false);
    assert.deepEqual(outcome.attempts[0], { provider: "apollo", status: "skipped_unconfigured" });
    assert.equal(outcome.result?.provider, "hunter");
  });

  await test("provider at or over its monthly cap is skipped without calling match", async () => {
    const apollo = fakeProvider({ name: "apollo", result: { provider: "apollo", email: "jane@x.com", creditsUsed: 1 } });
    const hunter = fakeProvider({ name: "hunter", result: { provider: "hunter", email: "jane2@x.com", creditsUsed: 1 } });
    // apollo's default cap is 100; seed usage right at the cap.
    const ledger = fakeLedger({ "apollo:2026-08": 100 });

    const outcome = await enrichLead(input, { providers: [apollo, hunter], ledger, now: NOW });

    assert.equal(apollo.calls, 0);
    assert.deepEqual(outcome.attempts[0], { provider: "apollo", status: "skipped_cap" });
    assert.equal(outcome.result?.provider, "hunter");
  });

  await test("quota-exhausted error marks the provider exhausted in the ledger and continues to the next, which hits", async () => {
    const apollo = fakeProvider({ name: "apollo", throwQuota: true });
    const hunterHit: EnrichResult = { provider: "hunter", email: "jane@x.com", creditsUsed: 1 };
    const hunter = fakeProvider({ name: "hunter", result: hunterHit });
    const ledger = fakeLedger();

    const outcome = await enrichLead(input, { providers: [apollo, hunter], ledger, now: NOW });

    assert.deepEqual(outcome.attempts, [
      { provider: "apollo", status: "exhausted" },
      { provider: "hunter", status: "hit" },
    ]);
    assert.deepEqual(outcome.result, hunterHit);
    assert.ok(ledger.calls.some((c) => c.op === "setExhausted" && c.provider === "apollo" && c.month === MONTH));
    // Exhausted provider must not also record a credit use.
    assert.equal(ledger.calls.some((c) => c.op === "addUse" && c.provider === "apollo"), false);
  });

  await test("all providers miss -> result null with a full attempts trail", async () => {
    const a = fakeProvider({ name: "apollo", result: null });
    const h = fakeProvider({ name: "hunter", result: null });
    const p = fakeProvider({ name: "prospeo", result: null });

    const outcome = await enrichLead(input, { providers: [a, h, p], ledger: fakeLedger(), now: NOW });

    assert.equal(outcome.result, null);
    assert.deepEqual(outcome.attempts, [
      { provider: "apollo", status: "miss" },
      { provider: "hunter", status: "miss" },
      { provider: "prospeo", status: "miss" },
    ]);
  });

  await test("ledger.addUse is called exactly once, with the hit's creditsUsed, on a hit", async () => {
    const hit: EnrichResult = { provider: "hunter", email: "jane@x.com", creditsUsed: 3 };
    const a = fakeProvider({ name: "apollo", result: null });
    const h = fakeProvider({ name: "hunter", result: hit });
    const ledger = fakeLedger();

    await enrichLead(input, { providers: [a, h], ledger, now: NOW });

    const addUseCalls = ledger.calls.filter((c) => c.op === "addUse");
    assert.equal(addUseCalls.length, 1);
    assert.deepEqual(addUseCalls[0], { op: "addUse", provider: "hunter", month: MONTH, n: 3 });
  });

  await test("a provider that throws a plain Error is treated as a miss, not exhausted, and the chain continues", async () => {
    const a = fakeProvider({ name: "apollo", throwPlain: true });
    const hit: EnrichResult = { provider: "hunter", email: "jane@x.com", creditsUsed: 1 };
    const h = fakeProvider({ name: "hunter", result: hit });
    const ledger = fakeLedger();

    const outcome = await enrichLead(input, { providers: [a, h], ledger, now: NOW });

    assert.deepEqual(outcome.attempts, [
      { provider: "apollo", status: "miss" },
      { provider: "hunter", status: "hit" },
    ]);
    assert.equal(ledger.calls.some((c) => c.op === "setExhausted" && c.provider === "apollo"), false);
    assert.deepEqual(outcome.result, hit);
  });

  await test("deps.fetchFn is passed through to provider.match", async () => {
    let seenFetch: unknown;
    const provider: EnrichProvider = {
      name: "apollo",
      isConfigured: () => true,
      async match(_input, fetchFn) {
        seenFetch = fetchFn;
        return null;
      },
    };
    const marker = (async () => new Response("{}")) as unknown as typeof fetch;
    await enrichLead(input, { providers: [provider], ledger: fakeLedger(), fetchFn: marker, now: NOW });
    assert.equal(seenFetch, marker);
  });

  await test("ledger.getUsed throwing is treated as a miss (no blind credit spend) and the chain continues to a hit", async () => {
    const apollo = fakeProvider({ name: "apollo", result: { provider: "apollo", email: "should-not-be-used@x.com", creditsUsed: 1 } });
    const hunterHit: EnrichResult = { provider: "hunter", email: "jane@x.com", creditsUsed: 1 };
    const hunter = fakeProvider({ name: "hunter", result: hunterHit });
    const ledger = fakeLedger({}, { op: "getUsed", provider: "apollo" });

    const outcome = await enrichLead(input, { providers: [apollo, hunter], ledger, now: NOW });

    // apollo's getUsed threw, so match() must never have been called on it.
    assert.equal(apollo.calls, 0);
    assert.deepEqual(outcome.attempts, [
      { provider: "apollo", status: "miss" },
      { provider: "hunter", status: "hit" },
    ]);
    assert.deepEqual(outcome.result, hunterHit);
  });

  await test("ledger.addUse throwing after a hit still returns the hit (lost credit record is the lesser harm)", async () => {
    const hit: EnrichResult = { provider: "apollo", email: "jane@x.com", creditsUsed: 1 };
    const apollo = fakeProvider({ name: "apollo", result: hit });
    const ledger = fakeLedger({}, { op: "addUse", provider: "apollo" });

    const outcome = await enrichLead(input, { providers: [apollo], ledger, now: NOW });

    assert.deepEqual(outcome.result, hit);
    assert.deepEqual(outcome.attempts, [{ provider: "apollo", status: "hit" }]);
  });

  await test("ledger.setExhausted throwing still records exhausted and the chain continues", async () => {
    const apollo = fakeProvider({ name: "apollo", throwQuota: true });
    const hunterHit: EnrichResult = { provider: "hunter", email: "jane@x.com", creditsUsed: 1 };
    const hunter = fakeProvider({ name: "hunter", result: hunterHit });
    const ledger = fakeLedger({}, { op: "setExhausted", provider: "apollo" });

    const outcome = await enrichLead(input, { providers: [apollo, hunter], ledger, now: NOW });

    assert.deepEqual(outcome.attempts, [
      { provider: "apollo", status: "exhausted" },
      { provider: "hunter", status: "hit" },
    ]);
    assert.deepEqual(outcome.result, hunterHit);
  });

  await test("never throws even when every provider throws a plain error", async () => {
    const a = fakeProvider({ name: "apollo", throwPlain: true });
    const h = fakeProvider({ name: "hunter", throwPlain: true });
    const outcome = await enrichLead(input, { providers: [a, h], ledger: fakeLedger(), now: NOW });
    assert.equal(outcome.result, null);
    assert.deepEqual(outcome.attempts, [
      { provider: "apollo", status: "miss" },
      { provider: "hunter", status: "miss" },
    ]);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
