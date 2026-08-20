import { strict as assert } from "node:assert";
import { sortTodayLeads, todayTier, todayOrderTime, type TodayOrderLead } from "./today-order";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const outbound = { direction: "outbound" };
const inbound = { direction: "inbound" };

type Row = TodayOrderLead & { id: string };
const lead = (id: string, over: Partial<TodayOrderLead> = {}): Row => ({
  id,
  status: "approved",
  touches: [],
  decisionMaker: { emailVerified: false },
  createdAt: "2026-01-01T00:00:00.000Z",
  ...over,
});

const ids = (rows: Row[]) => rows.map((r) => r.id);

(async () => {
  console.log("today-order");

  await test("approved with no outbound touch is newly_approved", () => {
    assert.equal(todayTier(lead("a")), "newly_approved");
  });

  await test("an inbound-only touch still counts as never contacted", () => {
    // A demo visit or a reply-watcher inbound doesn't mean we reached out.
    assert.equal(todayTier(lead("a", { touches: [inbound] })), "newly_approved");
  });

  await test("one outbound touch graduates it out of newly_approved", () => {
    assert.equal(
      todayTier(lead("a", { status: "contacted", touches: [outbound] })),
      "rest"
    );
  });

  await test("a contacted lead with a verified email is verified_email", () => {
    const l = lead("a", {
      status: "contacted",
      touches: [outbound],
      decisionMaker: { emailVerified: true },
    });
    assert.equal(todayTier(l), "verified_email");
  });

  await test("newly_approved wins even when the email is verified", () => {
    const l = lead("a", { decisionMaker: { emailVerified: true } });
    assert.equal(todayTier(l), "newly_approved");
  });

  await test("a missing decisionMaker falls to rest", () => {
    const l = lead("a", { status: "contacted", touches: [outbound], decisionMaker: null });
    assert.equal(todayTier(l), "rest");
  });

  await test("tiers order newly_approved, then verified_email, then rest", () => {
    const rest = lead("rest", { status: "contacted", touches: [outbound] });
    const verified = lead("verified", {
      status: "contacted", touches: [outbound], decisionMaker: { emailVerified: true },
    });
    const fresh = lead("fresh");
    assert.deepEqual(ids(sortTodayLeads([rest, verified, fresh])), ["fresh", "verified", "rest"]);
  });

  await test("within a tier, newest approval comes first", () => {
    const old = lead("old", { approvedAt: "2026-08-01T00:00:00.000Z" });
    const mid = lead("mid", { approvedAt: "2026-08-10T00:00:00.000Z" });
    const recent = lead("recent", { approvedAt: "2026-08-19T00:00:00.000Z" });
    assert.deepEqual(ids(sortTodayLeads([old, recent, mid])), ["recent", "mid", "old"]);
  });

  await test("approvedAt beats createdAt when both are present", () => {
    // A lead created long ago but approved today is today's work.
    const oldButJustApproved = lead("just-approved", {
      createdAt: "2026-01-01T00:00:00.000Z",
      approvedAt: "2026-08-19T00:00:00.000Z",
    });
    const newerButApprovedEarlier = lead("earlier", {
      createdAt: "2026-08-05T00:00:00.000Z",
      approvedAt: "2026-08-06T00:00:00.000Z",
    });
    assert.deepEqual(
      ids(sortTodayLeads([newerButApprovedEarlier, oldButJustApproved])),
      ["just-approved", "earlier"]
    );
  });

  await test("legacy leads with no approvedAt fall back to createdAt", () => {
    const l = lead("a", { createdAt: "2026-03-04T00:00:00.000Z" });
    assert.equal(todayOrderTime(l), Date.parse("2026-03-04T00:00:00.000Z"));
  });

  await test("an unparseable date sorts last rather than throwing", () => {
    const broken = lead("broken", { approvedAt: "not-a-date" });
    const good = lead("good", { approvedAt: "2026-08-01T00:00:00.000Z" });
    assert.equal(todayOrderTime(broken), 0);
    assert.deepEqual(ids(sortTodayLeads([broken, good])), ["good", "broken"]);
  });

  await test("Date objects and ISO strings order identically", () => {
    const asDate = lead("date", { approvedAt: new Date("2026-08-19T00:00:00.000Z") });
    const asString = lead("string", { approvedAt: "2026-08-18T00:00:00.000Z" });
    assert.deepEqual(ids(sortTodayLeads([asString, asDate])), ["date", "string"]);
  });

  await test("ties keep the input order (stable)", () => {
    const a = lead("a", { approvedAt: "2026-08-19T00:00:00.000Z" });
    const b = lead("b", { approvedAt: "2026-08-19T00:00:00.000Z" });
    assert.deepEqual(ids(sortTodayLeads([a, b])), ["a", "b"]);
    assert.deepEqual(ids(sortTodayLeads([b, a])), ["b", "a"]);
  });

  await test("does not mutate the input array", () => {
    const input = [
      lead("rest", { status: "contacted", touches: [outbound] }),
      lead("fresh"),
    ];
    sortTodayLeads(input);
    assert.deepEqual(ids(input), ["rest", "fresh"]);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
