import { strict as assert } from "node:assert";
import { applyMarkSent, expectedNextChannel } from "./cadence";
import { landingPathForSegment } from "./segment-landing";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
  const now = new Date("2026-08-04T17:00:00Z");
  const days = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);
  const out = (channel: "email" | "linkedin" | "form") =>
    ({ at: now, channel, direction: "outbound", summary: "x" } as const);
  const inb = { at: now, channel: "email", direction: "inbound", summary: "reply" } as const;

  await test("1st send (intro email): contacted, nextActionAt +1d", () => {
    const r = applyMarkSent({ status: "approved", touches: [] }, "email", "intro email", now);
    assert.equal(r.status, "contacted");
    assert.equal(r.nextActionAt?.getTime(), days(1).getTime());
    assert.equal(r.touch.direction, "outbound");
  });
  await test("2nd send: nextActionAt +3d", () => {
    const r = applyMarkSent({ status: "contacted", touches: [out("email")] }, "linkedin", "li note", now);
    assert.equal(r.status, "contacted");
    assert.equal(r.nextActionAt?.getTime(), days(3).getTime());
  });
  await test("3rd send: nextActionAt +6d", () => {
    const r = applyMarkSent({ status: "contacted", touches: [out("email"), out("linkedin")] }, "email", "bump", now);
    assert.equal(r.status, "contacted");
    assert.equal(r.nextActionAt?.getTime(), days(6).getTime());
  });
  await test("4th send: auto-park, nextActionAt cleared", () => {
    const touches = [out("email"), out("linkedin"), out("email")];
    const r = applyMarkSent({ status: "contacted", touches }, "email", "breakup", now);
    assert.equal(r.status, "parked");
    assert.equal(r.nextActionAt, null);
  });
  await test("counter is channel-blind: skipping LinkedIn still consumes the step", () => {
    const r = applyMarkSent({ status: "contacted", touches: [out("email")] }, "email", "bump instead of li", now);
    assert.equal(r.nextActionAt?.getTime(), days(3).getTime());
  });
  await test("inbound touches don't count toward the 4-touch cap", () => {
    const r = applyMarkSent({ status: "contacted", touches: [out("email"), inb] }, "linkedin", "y", now);
    assert.equal(r.status, "contacted");
    assert.equal(r.nextActionAt?.getTime(), days(3).getTime());
  });
  await test("expectedNextChannel follows the sequence by outbound count", () => {
    assert.equal(expectedNextChannel([]), "email");
    assert.equal(expectedNextChannel([out("email")]), "linkedin");
    assert.equal(expectedNextChannel([out("email"), out("linkedin")]), "email");
    assert.equal(expectedNextChannel([out("email"), out("linkedin"), out("email")]), "email");
    assert.equal(expectedNextChannel([out("email"), out("linkedin"), out("email"), out("email")]), null);
    // channel-blind: count drives the hint, not what was actually sent
    assert.equal(expectedNextChannel([out("form")]), "linkedin");
    // inbound touches ignored
    assert.equal(expectedNextChannel([out("email"), inb]), "linkedin");
  });
  await test("segment landing map covers every segment", async () => {
    const { LEAD_SEGMENTS } = await import("../../models/Lead");
    for (const s of LEAD_SEGMENTS) assert.ok(landingPathForSegment(s).startsWith("/"), s);
    assert.equal(landingPathForSegment("nursing_program"), "/solutions/nursing");
    assert.equal(landingPathForSegment("corporate_ld"), "/solutions/corporate-ld");
    assert.equal(landingPathForSegment("other"), "/");
  });

  console.log(`passed: ${passed}, failed: ${failed}`);
  if (failed > 0) process.exit(1);
})();
