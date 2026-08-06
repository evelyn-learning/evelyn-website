import { strict as assert } from "node:assert";
import { ResearchJob } from "./ResearchJob";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
  await test("valid job passes validateSync with defaults", () => {
    const j = new ResearchJob({ segment: "nursing_program", count: 20 });
    assert.equal(j.validateSync(), undefined);
    assert.equal(j.status, "queued");
    assert.equal(j.costUsd, 0);
    assert.equal(j.tokens.input, 0);
    assert.equal(j.progress.inserted, 0);
    assert.deepEqual(j.candidates.toObject(), []);
  });

  await test("count outside 1-25 fails", () => {
    assert.ok(new ResearchJob({ segment: "nursing_program", count: 0 }).validateSync());
    assert.ok(new ResearchJob({ segment: "nursing_program", count: 26 }).validateSync());
  });

  await test("bad segment / bad status fail", () => {
    assert.ok(new ResearchJob({ segment: "nope", count: 5 }).validateSync());
    assert.ok(new ResearchJob({ segment: "nursing_program", count: 5, status: "nope" }).validateSync());
  });

  await test("candidate requires company+website, status enum enforced", () => {
    const j = new ResearchJob({
      segment: "nursing_program", count: 5,
      candidates: [{ company: "X", website: "https://x.edu", status: "pending" }],
    });
    assert.equal(j.validateSync(), undefined);
    const bad = new ResearchJob({
      segment: "nursing_program", count: 5,
      candidates: [{ company: "X", website: "https://x.edu", status: "nope" }],
    });
    assert.ok(bad.validateSync());
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
