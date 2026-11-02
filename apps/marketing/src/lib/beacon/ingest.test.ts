import { strict as assert } from "node:assert";
import { checkBeaconAuth } from "./ingest-auth";
import { bucketFunnel, parseFunnelRange } from "./funnel";
import { nextBeaconTopic, parseTopicsBody, parsePostPatch } from "./topics";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

// ── auth ──
test("no header → 401", () => assert.equal(checkBeaconAuth(null, "t"), 401));
test("matching bearer → 200", () => assert.equal(checkBeaconAuth("Bearer t", "t"), 200));
test("wrong bearer → 401", () => assert.equal(checkBeaconAuth("Bearer x", "t"), 401));
test("token env unset → 503", () => assert.equal(checkBeaconAuth("Bearer t", undefined), 503));
test("token env empty → 503", () => assert.equal(checkBeaconAuth("Bearer ", ""), 503));
test("different-length bearer → 401 (no throw)", () => assert.equal(checkBeaconAuth("Bearer tt", "t"), 401));
test("non-bearer scheme → 401", () => assert.equal(checkBeaconAuth("Basic t", "t"), 401));

// ── funnel ──
test("bucketFunnel over 3 days with one empty day → 3 entries, empty day zeros", () => {
  const out = bucketFunnel(
    {
      demos: [
        { productId: "voice-tutor", startedAt: new Date("2026-10-01T03:00:00Z"), engaged: true },
        { productId: "voice-tutor", startedAt: new Date("2026-10-01T23:59:59Z"), engaged: false },
        { productId: "academy", startedAt: new Date("2026-10-03T00:00:00Z"), engaged: true },
        { productId: "academy", startedAt: new Date("2026-10-04T00:00:00Z"), engaged: true }, // outside range
      ],
      signups: [{ createdAt: new Date("2026-10-01T10:00:00Z") }],
      contacts: [{ createdAt: new Date("2026-10-03T10:00:00Z") }, { createdAt: new Date("2026-10-03T11:00:00Z") }],
    },
    "2026-10-01",
    "2026-10-03"
  );
  assert.equal(out.length, 3);
  assert.deepEqual(out.map((d) => d.date), ["2026-10-01", "2026-10-02", "2026-10-03"]);
  assert.deepEqual(out[0], {
    date: "2026-10-01",
    demoOpens: { "voice-tutor": 2 },
    demoEngaged: { "voice-tutor": 1 },
    tutorDemoSignups: 1,
    contactForms: 0,
  });
  assert.deepEqual(out[1], { date: "2026-10-02", demoOpens: {}, demoEngaged: {}, tutorDemoSignups: 0, contactForms: 0 });
  assert.deepEqual(out[2].demoOpens, { academy: 1 });
  assert.equal(out[2].contactForms, 2);
});
test("parseFunnelRange accepts an inclusive UTC range", () => {
  const r = parseFunnelRange("2026-10-01", "2026-10-03");
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.start.toISOString(), "2026-10-01T00:00:00.000Z");
    assert.equal(r.endExclusive.toISOString(), "2026-10-04T00:00:00.000Z");
  }
});
test("parseFunnelRange rejects bad dates, reversed ranges, >92 days", () => {
  assert.equal(parseFunnelRange(null, "2026-10-03").ok, false);
  assert.equal(parseFunnelRange("2026-13-01", "2026-10-03").ok, false);
  assert.equal(parseFunnelRange("2026-10-05", "2026-10-03").ok, false);
  assert.equal(parseFunnelRange("2026-01-01", "2026-04-03").ok, false); // 93 days
  assert.equal(parseFunnelRange("2026-01-01", "2026-04-02").ok, true); // 92 days
});

// ── topics ──
test("nextBeaconTopic: empty queue → null", () => assert.equal(nextBeaconTopic({ beaconTopics: [] }), null));
test("nextBeaconTopic: missing queue → null", () => assert.equal(nextBeaconTopic({}), null));
test("nextBeaconTopic: two topics → first", () => {
  assert.deepEqual(
    nextBeaconTopic({
      beaconTopics: [
        { topic: "A", reason: "ra", source: "geo-lost" },
        { topic: "B", reason: "rb", source: "product-query" },
      ],
    }),
    { topic: "A", reason: "ra" }
  );
});
test("parseTopicsBody: valid body passes, >10 or bad source rejected", () => {
  const ok = parseTopicsBody({ topics: [{ topic: " A ", reason: "r", source: "geo-lost" }] });
  assert.ok(ok.ok);
  if (ok.ok) assert.equal(ok.topics[0].topic, "A");
  const eleven = Array.from({ length: 11 }, (_, i) => ({ topic: `t${i}`, reason: "r", source: "geo-lost" }));
  assert.equal(parseTopicsBody({ topics: eleven }).ok, false);
  assert.equal(parseTopicsBody({ topics: [{ topic: "A", reason: "r", source: "other" }] }).ok, false);
  assert.equal(parseTopicsBody({ topics: [{ topic: "", reason: "r", source: "geo-lost" }] }).ok, false);
  assert.equal(parseTopicsBody({}).ok, false);
  assert.ok(parseTopicsBody({ topics: [] }).ok); // empty clears the queue
});
test("parsePostPatch: accepts noindex/reason/ctaProduct, rejects unknown product", () => {
  assert.deepEqual(parsePostPatch({ noindex: true, reason: "no clicks 180d" }), {
    ok: true,
    patch: { noindex: true, reason: "no clicks 180d" },
  });
  assert.deepEqual(parsePostPatch({ ctaProduct: null }), { ok: true, patch: { ctaProduct: null } });
  assert.equal(parsePostPatch({ ctaProduct: "essay-ai" }).ok, false);
  assert.equal(parsePostPatch({ noindex: "yes" }).ok, false);
  assert.equal(parsePostPatch({}).ok, false);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
