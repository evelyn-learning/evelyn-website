// Database test for the cron routes (I1): the route handlers are called directly with constructed Requests.
// Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses its own database castle_rock_review_cron_test (locks, heartbeats); drops it before and after.
// No network: fetch is replaced by a spy that fails the test if called; no real Resend key is ever set.
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`cron.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_cron_test";
process.env.KEYSTONE_DB_NAME = DB;
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data-cron");
delete process.env.KEYSTONE_READONLY;
for (const k of ["KEYSTONE_RESEND_API_KEY", "RESEND_API_KEY", "KEYSTONE_STATUS_TO", "KEYSTONE_STATUS_FROM", "KEYSTONE_CRON_SECRET"]) delete process.env[k];

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const deepEqual = (a: unknown, b: unknown, message: string) => assert.deepEqual(a, b, message);

const SECRET = "test-cron-secret-0123456789abcdef";
let fetchCalls = 0;
globalThis.fetch = (async () => {
  fetchCalls++;
  throw new Error("no network in tests");
}) as typeof fetch;

(async () => {
  const { ks, closeKs } = await import("../db");
  const release = await import("../../../app/api/keystone/cron/release/route");
  const statusRoute = await import("../../../app/api/keystone/cron/status-email/route");
  const { statusEmailJob, cronGate, pacificHour } = await import("./jobs");
  const { Item, Lock } = await ks();
  equal(Item.db.name, DB, "must run against the cron test database");
  const db = Item.db.db!;
  await db.dropDatabase();
  const req = (route: string, headers: Record<string, string> = {}, method = "POST") =>
    new Request(`http://127.0.0.1:3001/api/keystone/cron/${route}`, { method, headers });
  const snapshot = async () => {
    const out: Record<string, unknown[]> = {};
    for (const c of (await db.listCollections().toArray()).map((x) => x.name).sort()) out[c] = await db.collection(c).find({}).toArray();
    return JSON.stringify(out);
  };
  try {
    // --- the gate ---
    equal(cronGate(SECRET, undefined), "unconfigured", "gate: no secret configured");
    equal(cronGate("short", "short"), "unconfigured", "gate: a secret under 24 characters counts as not configured");
    equal(cronGate(null, SECRET), "denied", "gate: no header");
    equal(cronGate(`${SECRET}x`, SECRET), "denied", "gate: wrong header (different length)");
    equal(cronGate(SECRET.replace(/.$/, "X"), SECRET), "denied", "gate: wrong header (same length)");
    equal(cronGate(SECRET, SECRET), "ok", "gate: right header");

    for (const [name, mod] of [["release", release], ["status-email", statusRoute]] as const) {
      delete process.env.KEYSTONE_CRON_SECRET;
      equal((await mod.POST(req(name, { "x-keystone-cron": SECRET }))).status, 503, `${name}: no secret configured → 503`);
      process.env.KEYSTONE_CRON_SECRET = "too-short";
      equal((await mod.POST(req(name, { "x-keystone-cron": "too-short" }))).status, 503, `${name}: short secret → 503`);
      process.env.KEYSTONE_CRON_SECRET = SECRET;
      const wrong = await mod.POST(req(name, { "x-keystone-cron": "nope" }));
      equal(wrong.status, 404, `${name}: wrong header → 404`);
      equal(await wrong.text(), "", `${name}: 404 with an empty body`);
      equal((await mod.POST(req(name))).status, 404, `${name}: missing header → 404`);
      // A session cookie opens nothing: only the secret does.
      equal((await mod.POST(req(name, { cookie: "ks_session=anything" }))).status, 404, `${name}: a session is not a way in`);
      equal((await mod.GET()).status, 405, `${name}: GET → 405`);
    }
    equal(await db.collection("heartbeats").countDocuments(), 0, "nothing ran while refused");

    // --- release: runs once; concurrent calls → the lock makes one busy ---
    process.env.KEYSTONE_CRON_SECRET = SECRET;
    const one = await release.POST(req("release", { "x-keystone-cron": SECRET }));
    equal(one.status, 200, "release: 200 with the secret");
    const body = (await one.json()) as { status: string; released: number };
    equal(body.status, "done", "release: done");
    equal(body.released, 0, "release: nothing to release on an empty database");
    ok(await db.collection("heartbeats").findOne({ _id: "keystone-release" as never }), "release: heartbeat recorded");
    equal(await Lock.countDocuments({ _id: "keystone-release" }), 0, "release: the lock is released after the run");
    const both = await Promise.all([0, 1].map(() => release.POST(req("release", { "x-keystone-cron": SECRET }))));
    const statuses = (await Promise.all(both.map(async (r) => ((await r.json()) as { status: string }).status))).sort();
    deepEqual(statuses, ["busy", "done"], "release: two concurrent calls → one runs, one finds the lock held");
    await Lock.create({ _id: "keystone-release", owner: "someone-else", expiresAt: new Date(Date.now() + 60_000) });
    equal(((await (await release.POST(req("release", { "x-keystone-cron": SECRET }))).json()) as { status: string }).status, "busy", "release: a held lock → busy");
    await Lock.deleteMany({});

    // --- status email: ?print=1 sends nothing and writes nothing ---
    const before = await snapshot();
    const printed = await statusRoute.POST(new Request("http://127.0.0.1:3001/api/keystone/cron/status-email?print=1", { method: "POST", headers: { "x-keystone-cron": SECRET } }));
    equal(printed.status, 200, "print: 200");
    ok(/^Subject: Keystone: /.test(await printed.text()), "print: the email text");
    equal(fetchCalls, 0, "print: nothing sent");
    equal(await snapshot(), before, "print: the database is exactly as it was (no heartbeat, no write)");

    // --- status email: the 7 am Los Angeles rule, once a day (job called directly with a fake sender) ---
    const env = { KEYSTONE_STATUS_TO: "praveen@example.com", KEYSTONE_STATUS_FROM: "Keystone <status@evelynlearning.com>", KEYSTONE_RESEND_API_KEY: "re_test_not_a_real_key_0000" };
    let sent = 0;
    const fakeSend = (async () => { sent++; return new Response(JSON.stringify({ id: "x" }), { status: 200 }); }) as typeof fetch;
    const winter6 = new Date("2026-11-18T14:00:00Z"); // 06:00 PST
    const winter7 = new Date("2026-11-18T15:00:00Z"); // 07:00 PST
    equal(pacificHour(winter6), 6, "14:00 UTC is 6 am in Los Angeles in winter");
    equal((await statusEmailJob({ now: winter6, env, fetchFn: fakeSend, onlyAtPacificHour: 7 })).status, "skipped", "14:00 UTC in winter: skipped");
    equal(sent, 0, "nothing sent at 6 am");
    equal((await statusEmailJob({ now: winter7, env, fetchFn: fakeSend, onlyAtPacificHour: 7 })).status, "sent", "15:00 UTC in winter: sent");
    equal(sent, 1, "sent once");
    equal((await statusEmailJob({ now: new Date(winter7.getTime() + 20 * 60_000), env, fetchFn: fakeSend, onlyAtPacificHour: 7 })).status, "skipped", "a second call the same morning: skipped");
    equal(sent, 1, "still once");
    const summer7 = new Date("2026-07-08T14:00:00Z"); // 07:00 PDT
    equal(pacificHour(summer7), 7, "14:00 UTC is 7 am in Los Angeles in summer");
    equal(pacificHour(new Date("2026-07-08T15:00:00Z")), 8, "15:00 UTC is 8 am in summer (that call skips)");
    await assert.rejects(() => statusEmailJob({ now: winter7, env: { ...env, KEYSTONE_STATUS_FROM: "x@crimsora.com" }, fetchFn: fakeSend }), /evelynlearning\.com/, "the FROM check stays");
    equal(fetchCalls, 0, "no real network call in the whole test");

    console.log("cron.dbtest ok");
  } finally {
    await db.dropDatabase();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
