// Database test for the retro-audit: on a read-only connection it reads the real store and writes nothing
// (every collection identical before and after); the script refuses without the live switch. Faked checks:
// no model, no network. Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses its own database castle_rock_review_retro_test; drops it before and after. Never the production tunnel.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`retro.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_retro_test";
process.env.KEYSTONE_DB_NAME = DB;
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data");
delete process.env.KEYSTONE_READONLY;
delete process.env.KEYSTONE_PIPELINE_LIVE;

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);

const T0 = new Date("2026-11-17T10:00:00Z");

(async () => {
  const { ks, closeKs } = await import("../db");
  const { runRetro, renderRetro, mongoRetroReader } = await import("./retro");
  const seed = await ks();
  equal(seed.Item.db.name, DB, "must run against the retro test database");
  await seed.Item.db.db!.dropDatabase();
  try {
    let order = 0;
    const mk = (itemId: string, stage: string, version: number, extra: Record<string, unknown> = {}) =>
      seed.Item.create({
        itemId, subject: "Mathematics", course: "Math 30-1", courseSource: "sheet", itemType: "MC", topic: "Values", standards: [], key: "B",
        evelynAnswer: "B", keySource: "castle-rock", questionHtml: "<p>q</p>", options: ["A", "B", "C", "D"].map((label) => ({ label, html: label })),
        interactions: [{ kind: "choice", responseId: "RESPONSE", maxChoices: 1, options: ["A", "B", "C", "D"].map((label) => ({ label, html: label })) }],
        keys: { RESPONSE: ["B"] }, stage, version, releasedVersion: version, releasedAnswer: "B", batchId: "dbtest-retro", showcase: false, source: "upload",
        order: order++, createdAt: T0, updatedAt: T0, lastActivityAt: T0, ...extra,
      });
    const sol = (itemId: string, version: number) =>
      seed.Solution.create({ itemId, version, author: "pipeline", releasedAt: T0, sections: [{ kind: "short", md: `Short ${itemId} v${version}. So the answer is B.`, html: "" }] });
    await mk("rt-rev1", "in_review", 2);
    await sol("rt-rev1", 1);
    await sol("rt-rev1", 2);
    await mk("rt-rev2", "in_review", 1);
    await sol("rt-rev2", 1);
    await mk("rt-appr", "approved", 1);
    await sol("rt-appr", 1);
    await mk("rt-rec", "received", 0);
    await seed.Lesson.create({ itemId: "rt-rev1", version: 1, note: "n", cause: "format", proposedBy: "model", confirmed: false });

    // Every collection and index the writable connection builds on connect is in place before "before".
    await Promise.all(Object.values(seed).map((m) => (m as { init(): Promise<unknown> }).init()));
    let db = seed.Item.db.db!;
    const snapshot = async () => {
      const out: Record<string, unknown[]> = {};
      for (const c of (await db.listCollections().toArray()).map((x) => x.name).sort()) {
        out[c] = await db.collection(c).find({}).sort({ _id: 1 }).toArray();
        out[`${c}#indexes`] = (await db.collection(c).indexes()).map((i) => i.name).sort();
      }
      return JSON.stringify(out);
    };
    const before = await snapshot();

    // --- the retro-audit on a read-only connection (as the script opens it) ---
    await closeKs();
    process.env.KEYSTONE_READONLY = "1";
    const ro = await ks();
    db = ro.Item.db.db!;
    await assert.rejects(() => ro.Item.updateOne({ itemId: "rt-rev1" }, { $set: { stage: "approved" } }), /read-only/, "the read-only connection refuses a write");
    const seen: string[] = [];
    const checks = {
      working: async (item: { itemId: string }, draft: { sections: { md: string }[] }) => {
        seen.push(`working ${item.itemId} ${draft.sections[0].md}`);
        return { findings: [], cost: 0.01, model: "m-w" };
      },
      audit: async (item: { itemId: string }) => {
        seen.push(`audit ${item.itemId}`);
        return item.itemId === "rt-rev2"
          ? { findings: [{ check: "audit" as const, code: "rule_broken", ruleId: "R-units", quote: "Short rt-rev2 v1.", detail: "no units" }], cost: 0.02, model: "m-a" }
          : { findings: [], cost: 0.02, model: "m-a" };
      },
    };
    const rules = [{ id: "R-units", text: "Units.", appliesTo: "all" as const, since: "2026-11-01", source: "reviewer" as const }];
    const rep = await runRetro({}, { reader: mongoRetroReader(), checks: checks as never, rules });
    equal(rep.items.map((i) => i.itemId).join(), "rt-rev1,rt-rev2", "the items in review");
    ok(seen.includes("working rt-rev1 Short rt-rev1 v2. So the answer is B."), `the current version's solution is read (${seen})`);
    const md = renderRetro(rep);
    ok(md.includes(`- audit R-units: "Short rt-rev2 v1." — no units`), "the finding in the report");
    const ruled = await runRetro({ rule: "R-units" }, { reader: mongoRetroReader(), checks: checks as never, rules });
    equal(ruled.items.map((i) => `${i.itemId}${i.apart ? "*" : ""}`).join(), "rt-rev1,rt-rev2,rt-appr*", "--rule: every stage with a solution, approved apart");
    equal(ruled.unreleased, 1, "the received item is counted as nothing released yet");

    // --- the script: refuses without the live switch, never writes ---
    const script = path.join(__dirname, "../../../../scripts/keystone-retro-audit.ts");
    const cwd = path.join(__dirname, "../../../..");
    const base: Record<string, string | undefined> = { PATH: process.env.PATH, HOME: process.env.HOME, KEYSTONE_MONGODB_URI: uri, KEYSTONE_DB_NAME: DB };
    const run = (args: string[], env: Record<string, string | undefined>) => spawnSync("npx", ["tsx", script, ...args], { cwd, env: env as NodeJS.ProcessEnv, encoding: "utf8", timeout: 120_000 });
    const off = run([], base);
    ok(off.status !== 0 && /KEYSTONE_PIPELINE_LIVE=1/.test(off.stderr), `refused without the live switch (${off.stderr.trim().slice(0, 200)})`);
    ok(off.stdout.includes(`Database: ${DB} on 127.0.0.1:27017 (READ-ONLY: nothing is written)`), `names the database, host and read-only (${off.stdout.trim()})`);
    const noUri = run([], { ...base, KEYSTONE_MONGODB_URI: "", MONGODB_URI: uri });
    ok(noUri.status !== 0 && /KEYSTONE_MONGODB_URI/.test(noUri.stderr), "KEYSTONE_MONGODB_URI required explicitly");
    const badOpt = run(["--write"], base);
    ok(badOpt.status !== 0 && /unknown option/.test(badOpt.stderr), "unknown option refused");

    equal(await snapshot(), before, "every collection and index unchanged: the retro-audit wrote nothing");
    console.log("retro.dbtest ok");
  } finally {
    await closeKs();
    delete process.env.KEYSTONE_READONLY;
    const w = await ks();
    await w.Item.db.db!.dropDatabase();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
