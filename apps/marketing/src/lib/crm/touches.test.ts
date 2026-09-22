import { strict as assert } from "node:assert";
import { mergeTouches, applyIngestStatus, type IncomingTouch } from "./touches";
import type { ITouch } from "@/models/Lead";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
const t = (id: string, dir: "inbound" | "outbound", at: number): IncomingTouch =>
  ({ at: new Date(at), channel: "email", direction: dir, summary: id, externalId: id, origin: "gmail_import" });

(async () => {
await test("merge dedupes on externalId and sorts by at", () => {
  const existing: ITouch[] = [{ at: new Date(20), channel: "email", direction: "outbound", summary: "b", externalId: "b" }];
  const r = mergeTouches(existing, [t("a", "outbound", 10), t("b", "inbound", 20), t("c", "inbound", 30)]);
  assert.equal(r.added, 2);
  assert.deepEqual(r.touches.map((x) => x.externalId), ["a", "b", "c"]);
});
await test("legacy touches without externalId are kept untouched", () => {
  const existing: ITouch[] = [{ at: new Date(5), channel: "linkedin", direction: "outbound", summary: "old" }];
  const r = mergeTouches(existing, [t("a", "inbound", 10)]);
  assert.equal(r.touches.length, 2); assert.equal(r.touches[0].summary, "old");
});
await test("mergeTouches returns fresh = only the newly added touches", () => {
  const existing: ITouch[] = [{ at: new Date(20), channel: "email", direction: "outbound", summary: "b", externalId: "b" }];
  const r = mergeTouches(existing, [t("a", "outbound", 10), t("b", "inbound", 20), t("c", "inbound", 30)]);
  assert.equal(r.fresh.length, 2);
  assert.deepEqual(r.fresh.map((x) => x.externalId), ["a", "c"]);
  // touches/added keep their existing meaning (whole merged list / count added).
  assert.equal(r.added, 2);
  assert.deepEqual(r.touches.map((x) => x.externalId), ["a", "b", "c"]);
});
await test("applyIngestStatus with an empty touches list leaves status untouched", () => {
  const lead = { status: "contacted" as const, nextActionAt: new Date(5), needsReview: false };
  applyIngestStatus(lead, [], { created: false, flagReview: false });
  assert.equal(lead.status, "contacted");
  assert.equal(lead.nextActionAt?.getTime(), 5);
  assert.equal(lead.needsReview, false);
});
await test("a legacy watcher touch with gmailMessageId X blocks an incoming touch with externalId gmail:X", () => {
  const existing: ITouch[] = [
    { at: new Date(1), channel: "email", direction: "inbound", summary: "watched", gmailMessageId: "X" },
  ];
  const incoming: IncomingTouch[] = [
    { at: new Date(1), channel: "email", direction: "inbound", summary: "ingested", externalId: "gmail:X", gmailMessageId: "X", origin: "gmail_label" },
  ];
  const r = mergeTouches(existing, incoming);
  assert.equal(r.added, 0);
  assert.equal(r.touches.length, 1);
});
await test("inbound flips staged/approved/contacted/parked to replied", () => {
  for (const s of ["staged", "approved", "contacted", "parked"] as const) {
    const lead = { status: s, nextActionAt: new Date(), needsReview: false };
    applyIngestStatus(lead, [t("a", "inbound", 1) as ITouch], { created: false, flagReview: false });
    assert.equal(lead.status, "replied"); assert.equal(lead.nextActionAt, null);
  }
});
await test("dead / replied / call_booked are never changed", () => {
  for (const s of ["dead", "replied", "call_booked"] as const) {
    const lead = { status: s, nextActionAt: null, needsReview: false };
    applyIngestStatus(lead, [t("a", "inbound", 1) as ITouch], { created: false, flagReview: false });
    assert.equal(lead.status, s);
  }
});
await test("new lead with only outbound -> contacted, no cadence", () => {
  const lead = { status: "staged" as const, nextActionAt: null, needsReview: false };
  applyIngestStatus(lead, [t("a", "outbound", 1) as ITouch], { created: true, flagReview: false });
  assert.equal(lead.status, "contacted"); assert.equal(lead.nextActionAt, null);
});
await test("flagReview keeps a new lead staged and sets needsReview", () => {
  const lead = { status: "staged" as const, nextActionAt: null, needsReview: false };
  applyIngestStatus(lead, [t("a", "outbound", 1) as ITouch], { created: true, flagReview: true });
  assert.equal(lead.status, "staged"); assert.equal(lead.needsReview, true);
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
