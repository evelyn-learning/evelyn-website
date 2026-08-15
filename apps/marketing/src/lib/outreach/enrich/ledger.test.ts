import { strict as assert } from "node:assert";
import { monthKey, capForProvider } from "./ledger";
import { ProviderCredit } from "@/models/ProviderCredit";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
  await test("monthKey formats fixed UTC dates as YYYY-MM", () => {
    assert.equal(monthKey(new Date("2026-08-07T12:00:00Z")), "2026-08");
    assert.equal(monthKey(new Date("2026-01-01T00:00:00Z")), "2026-01");
    assert.equal(monthKey(new Date("2026-12-31T23:59:59Z")), "2026-12");
    // Local-midnight edge case: a UTC date near month boundary should still
    // report the UTC month, not a locally-shifted one.
    assert.equal(monthKey(new Date("2026-02-01T00:00:00Z")), "2026-02");
  });

  await test("monthKey defaults to now when no date given", () => {
    const key = monthKey();
    assert.match(key, /^\d{4}-\d{2}$/);
  });

  await test("capForProvider apollo default and env override", () => {
    delete process.env.APOLLO_MONTHLY_CAP;
    assert.equal(capForProvider("apollo"), 100);
    process.env.APOLLO_MONTHLY_CAP = "50";
    assert.equal(capForProvider("apollo"), 50);
    process.env.APOLLO_MONTHLY_CAP = "banana";
    assert.equal(capForProvider("apollo"), 100);
    process.env.APOLLO_MONTHLY_CAP = "-3";
    assert.equal(capForProvider("apollo"), 100);
    process.env.APOLLO_MONTHLY_CAP = "0";
    assert.equal(capForProvider("apollo"), 100);
    delete process.env.APOLLO_MONTHLY_CAP;
  });

  await test("capForProvider hunter default and env override", () => {
    delete process.env.HUNTER_MONTHLY_CAP;
    assert.equal(capForProvider("hunter"), 25);
    process.env.HUNTER_MONTHLY_CAP = "10";
    assert.equal(capForProvider("hunter"), 10);
    process.env.HUNTER_MONTHLY_CAP = "banana";
    assert.equal(capForProvider("hunter"), 25);
    process.env.HUNTER_MONTHLY_CAP = "-1";
    assert.equal(capForProvider("hunter"), 25);
    delete process.env.HUNTER_MONTHLY_CAP;
  });

  await test("capForProvider prospeo default and env override", () => {
    delete process.env.PROSPEO_MONTHLY_CAP;
    assert.equal(capForProvider("prospeo"), 75);
    process.env.PROSPEO_MONTHLY_CAP = "30";
    assert.equal(capForProvider("prospeo"), 30);
    process.env.PROSPEO_MONTHLY_CAP = "banana";
    assert.equal(capForProvider("prospeo"), 75);
    process.env.PROSPEO_MONTHLY_CAP = "-1";
    assert.equal(capForProvider("prospeo"), 75);
    delete process.env.PROSPEO_MONTHLY_CAP;
  });

  await test("capForProvider unknown provider returns 0", () => {
    assert.equal(capForProvider("clearbit"), 0);
    assert.equal(capForProvider(""), 0);
  });

  await test("ProviderCredit valid doc passes validateSync with default used", () => {
    const c = new ProviderCredit({ provider: "apollo", month: "2026-08" });
    assert.equal(c.validateSync(), undefined);
    assert.equal(c.used, 0);
  });

  await test("ProviderCredit requires provider and month", () => {
    assert.ok(new ProviderCredit({ month: "2026-08" }).validateSync());
    assert.ok(new ProviderCredit({ provider: "apollo" }).validateSync());
  });

  await test("ProviderCredit accepts an explicit used value", () => {
    const c = new ProviderCredit({ provider: "hunter", month: "2026-08", used: 12 });
    assert.equal(c.validateSync(), undefined);
    assert.equal(c.used, 12);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
