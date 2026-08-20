import { strict as assert } from "node:assert";
import { applyApprove, applyKill, type TransitionLead } from "./lead-transitions";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const NOW = new Date("2026-08-19T10:00:00.000Z");
const mint = () => "tok-minted";

const lead = (over: Partial<TransitionLead> = {}): TransitionLead => ({
  status: "staged",
  nextActionAt: null,
  ...over,
});

(async () => {
  console.log("lead-transitions");

  await test("approve moves staged -> approved", () => {
    const l = lead();
    const res = applyApprove(l, NOW, mint);
    assert.deepEqual(res, { ok: true });
    assert.equal(l.status, "approved");
  });

  await test("approve stamps approvedAt and nextActionAt with now", () => {
    const l = lead();
    applyApprove(l, NOW, mint);
    assert.equal(l.approvedAt?.toISOString(), NOW.toISOString());
    assert.equal(l.nextActionAt?.toISOString(), NOW.toISOString());
  });

  await test("approve mints a demo token when there is none", () => {
    const l = lead();
    applyApprove(l, NOW, mint);
    assert.equal(l.demoToken, "tok-minted");
  });

  await test("approve never re-mints an existing demo token", () => {
    // The old token is already inside any /d/<token> link that went out.
    const l = lead({ demoToken: "tok-original" });
    applyApprove(l, NOW, mint);
    assert.equal(l.demoToken, "tok-original");
  });

  await test("approve refuses a non-staged lead and changes nothing", () => {
    for (const status of ["approved", "contacted", "replied", "parked", "dead"] as const) {
      const l = lead({ status });
      const res = applyApprove(l, NOW, mint);
      assert.equal(res.ok, false);
      assert.match((res as { reason: string }).reason, new RegExp(status));
      assert.equal(l.status, status);
      assert.equal(l.approvedAt, undefined);
      assert.equal(l.demoToken, undefined);
      assert.equal(l.nextActionAt, null);
    }
  });

  await test("kill marks dead and clears nextActionAt", () => {
    const l = lead({ status: "contacted", nextActionAt: NOW });
    const res = applyKill(l);
    assert.deepEqual(res, { ok: true });
    assert.equal(l.status, "dead");
    assert.equal(l.nextActionAt, null);
  });

  await test("kill is allowed from every status", () => {
    for (const status of ["staged", "approved", "contacted", "replied", "call_booked", "parked", "dead"] as const) {
      const l = lead({ status });
      assert.equal(applyKill(l).ok, true, status);
      assert.equal(l.status, "dead");
    }
  });

  await test("kill preserves approvedAt so an un-kill sorts correctly", () => {
    const l = lead({ status: "approved", approvedAt: NOW });
    applyKill(l);
    assert.equal(l.approvedAt?.toISOString(), NOW.toISOString());
  });


  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
