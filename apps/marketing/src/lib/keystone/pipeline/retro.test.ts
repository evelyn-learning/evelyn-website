// Pure tests for the retro-audit (scripts/keystone-retro-audit.ts): selection, the answer on record, the
// checks through injected fakes, the Markdown report. No model, no network, no database.
// Run: npx tsx src/lib/keystone/pipeline/retro.test.ts
import assert from "node:assert/strict";
import type { ItemDoc } from "../db";
import type { Answer } from "./answers";
import type { CheckResult, Finding } from "./checks";
import { parseRetroArgs, renderRetro, runRetro, selectRetro, storedAnswer, type RetroDeps, type RetroReader } from "./retro";
import type { Draft, Rule } from "./write";

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const deepEqual = (a: unknown, b: unknown, message: string) => assert.deepEqual(a, b, message);

delete process.env.KEYSTONE_PIPELINE_LIVE;

const T0 = new Date("2026-11-17T10:00:00Z");
let order = 0;
const item = (itemId: string, p: Partial<ItemDoc> = {}): ItemDoc => ({
  itemId, subject: "Mathematics", course: "Math 30-1", courseSource: "sheet", itemType: "MC", topic: "Values", standards: [], key: "B",
  evelynAnswer: "B", keySource: "castle-rock", questionHtml: "<p>Which value is right?</p>",
  options: ["A", "B", "C", "D"].map((label) => ({ label, html: `<p>${label}</p>` })),
  interactions: [{ kind: "choice", responseId: "RESPONSE", maxChoices: 1, options: ["A", "B", "C", "D"].map((label) => ({ label, html: label })) }],
  keys: { RESPONSE: ["B"] }, stage: "in_review", version: 1, releasedVersion: 1, releasedAnswer: "B",
  batchId: "b1", showcase: false, source: "upload", order: order++, createdAt: T0, updatedAt: T0, lastActivityAt: T0, ...p,
} as ItemDoc);

const RULES: Rule[] = [
  { id: "R-units", text: "Units on every quantity.", appliesTo: "all", since: "2026-11-01", source: "reviewer" },
  { id: "R-table", text: "Tables have a header row.", appliesTo: "table", since: "2026-11-10", source: "reviewer" },
  { id: "R-house", text: "No first person.", appliesTo: "all", since: "2026-11-01", source: "house" },
];

const sections = (tag: string) => [
  { kind: "short" as const, md: `Short ${tag}. So the answer is B.`, html: "" },
  { kind: "diploma" as const, md: `Working ${tag}.\nSo the answer is B.`, html: "" },
];

/** A reader over fixed rows that records every call; it has no other methods. */
function reader(items: ItemDoc[], withSolution = true): { reader: RetroReader; calls: string[] } {
  const calls: string[] = [];
  const r: RetroReader = {
    items: async (q) => {
      calls.push(`items ${JSON.stringify(q)}`);
      return items.filter((i) => (!q.only || q.only.includes(i.itemId)) && (!q.stages || q.stages.includes(i.stage))).map((i) => structuredClone(i));
    },
    solution: async (itemId, version) => {
      calls.push(`solution ${itemId} ${version}`);
      return withSolution ? { itemId, version, sections: sections(itemId) } : null;
    },
  };
  return { reader: r, calls };
}

type Seen = { working: { itemId: string; answer: Answer; draft: Draft }[]; audit: { itemId: string; course: string; rules: string[] }[] };
function checks(over: { working?: (i: ItemDoc) => CheckResult; audit?: (i: ItemDoc) => CheckResult } = {}): { checks: RetroDeps["checks"]; seen: Seen } {
  const seen: Seen = { working: [], audit: [] };
  return {
    seen,
    checks: {
      working: async (i, draft, answer) => {
        seen.working.push({ itemId: i.itemId, answer, draft });
        return over.working ? over.working(i) : { findings: [], cost: 0.01, model: "m-working-1" };
      },
      audit: async (i, course, _draft, rules) => {
        seen.audit.push({ itemId: i.itemId, course, rules: rules.map((r) => r.id) });
        return over.audit ? over.audit(i) : { findings: [], cost: 0.02, model: "m-audit-1" };
      },
    },
  };
}
const broke = (ruleId: string, quote: string): Finding => ({ check: "audit", code: "rule_broken", ruleId, quote, detail: `breaks ${ruleId}`, section: "diploma" });

(async () => {
  // --- options ---
  deepEqual(parseRetroArgs([]), {}, "no options");
  deepEqual(
    parseRetroArgs(["--rule", "R-units", "--stage", "ready", "--only", "a, b", "--limit", "2", "--out", "/tmp/x.md"]),
    { rule: "R-units", stage: "ready", only: ["a", "b"], limit: 2, out: "/tmp/x.md" },
    "every option",
  );
  assert.throws(() => parseRetroArgs(["--stage", "nonsense"]), /--stage/, "an unknown stage is refused");
  assert.throws(() => parseRetroArgs(["--limit", "0"]), /--limit/, "--limit 0 refused");
  assert.throws(() => parseRetroArgs(["--rule"]), /--rule needs a value/, "--rule without a value refused");
  assert.throws(() => parseRetroArgs(["--write"]), /unknown option/, "unknown option refused");
  assert.throws(() => parseRetroArgs(["--rule", "units"]), /R-/, "a rule id must look like R-…");

  // --- the answer on record ---
  deepEqual(storedAnswer(item("x", { evelynAnswer: "B" })), { answer: { kind: "choice", letters: ["B"] }, from: "agreed answer" }, "choice from the agreed answer");
  deepEqual(
    storedAnswer(item("x", { itemType: "MS", evelynAnswer: "A,C", interactions: [{ kind: "choice", responseId: "RESPONSE", maxChoices: 0, options: ["A", "B", "C"].map((label) => ({ label, html: label })) }] })),
    { answer: { kind: "choice", letters: ["A", "C"] }, from: "agreed answer" },
    "several letters",
  );
  deepEqual(
    storedAnswer(item("x", { itemType: "NR", evelynAnswer: "4.5", options: [], interactions: [{ kind: "textEntry", responseId: "RESPONSE" }] as ItemDoc["interactions"] })),
    { answer: { kind: "number", value: "4.5" }, from: "agreed answer" },
    "a number",
  );
  deepEqual(
    storedAnswer(item("x", { itemType: "TEI", evelynAnswer: "", releasedAnswer: "A→1; B→2", options: [], interactions: [{ kind: "order", responseId: "RESPONSE", choices: [] }] as unknown as ItemDoc["interactions"] })),
    { answer: { kind: "labels", values: ["A→1", "B→2"] }, from: "released answer" },
    "labels from the released answer when the agreed one is empty (answerText joins them with '; ')",
  );
  deepEqual(storedAnswer(item("x", { evelynAnswer: "", releasedAnswer: "", key: "C", keys: { RESPONSE: ["C"] } })), { answer: { kind: "choice", letters: ["C"] }, from: "key" }, "no stored answer: from the key");
  equal(storedAnswer(item("x", { evelynAnswer: "", releasedAnswer: "", key: "", keys: {} })), null, "neither: null");

  // --- selection ---
  const all = [
    item("r1"), item("r2", { stage: "ready", releasedVersion: 0 }), item("r3", { stage: "approved" }), item("r4", { stage: "delivered" }),
    item("r5", { stage: "changes_requested" }), item("r6", { stage: "in_review", version: 0 }), item("r7", { stage: "received", version: 0 }),
  ];
  const d = selectRetro(all, {});
  deepEqual(d.take.map((i) => i.itemId), ["r1"], "default: in review with a solution");
  ok(d.skipped.some((x) => x.itemId === "r6" && /no solution/.test(x.why)), "in review without a solution is listed as not audited");
  ok(!d.skipped.some((x) => x.itemId === "r3"), "other stages are not listed one by one");
  deepEqual(selectRetro(all, { stage: "ready" }).take.map((i) => i.itemId), ["r2"], "--stage ready");
  const named = selectRetro(all, { only: ["r1", "r3", "zz"] });
  deepEqual(named.take.map((i) => i.itemId), ["r1"], "--only within the stage");
  ok(named.skipped.some((x) => x.itemId === "r3" && /approved/.test(x.why)), "a named item in another stage says why");
  ok(named.skipped.some((x) => x.itemId === "zz" && /not found/.test(x.why)), "a named item that does not exist says so");
  const ruled = selectRetro(all, { rule: "R-units" });
  deepEqual(ruled.take.map((i) => i.itemId), ["r1", "r2", "r3", "r4", "r5"], "--rule: every item with a solution, any stage");
  deepEqual(ruled.apart, ["r3", "r4"], "--rule: approved and delivered reported apart");
  deepEqual(selectRetro(all, { rule: "R-units", stage: "ready" }).take.map((i) => i.itemId), ["r2"], "--rule with --stage narrows");
  const lim = selectRetro(all, { rule: "R-units", limit: 2 });
  deepEqual(lim.take.map((i) => i.itemId), ["r1", "r2"], "--limit");
  ok(lim.skipped.some((x) => /--limit/.test(x.why)), "over the limit is listed");

  // --- default run: working check + full rules audit on the items in review ---
  {
    const items = [item("a1"), item("a2"), item("a3", { evelynAnswer: "", releasedAnswer: "", key: "", keys: {} }), item("a4", { stage: "ready" })];
    const { reader: r, calls } = reader(items);
    const { checks: c, seen } = checks({
      working: (i) => (i.itemId === "a2" ? { failed: "shape: reply skipped a section (m-working-1)", cost: 0.01, model: "m-working-1" } : { findings: [], cost: 0.01, model: "m-working-1" }),
      audit: (i) => (i.itemId === "a1" ? { findings: [broke("R-units", "Working a1.")], cost: 0.02, model: "m-audit-1" } : { findings: [], cost: 0.02, model: "m-audit-1" }),
    });
    const deps: RetroDeps = { reader: r, checks: c, rules: RULES, now: () => T0 };
    ok(!("writer" in deps), "the retro-audit takes no writer");
    const rep = await runRetro({}, deps);
    ok(calls.every((x) => /^(items|solution) /.test(x)), `only reads (${calls})`);
    deepEqual(rep.items.map((i) => i.itemId), ["a1", "a2", "a3"], "the items in review, in order");
    deepEqual(seen.audit.map((a) => a.rules), [RULES.map((x) => x.id), RULES.map((x) => x.id), RULES.map((x) => x.id)], "full rule list for each");
    equal(seen.audit[0].course, "Math 30-1", "the item's course");
    deepEqual(seen.working.map((w) => w.itemId).sort(), ["a1", "a2"], "working check on items with an answer on record");
    deepEqual(seen.working[0].answer, { kind: "choice", letters: ["B"] }, "the stored agreed answer");
    deepEqual(seen.working[0].draft.sections.map((s) => s.kind), ["short", "diploma"], "the stored solution's sections");
    const a1 = rep.items.find((i) => i.itemId === "a1")!;
    equal(a1.findings.length, 1, "a1 has its finding");
    const a2 = rep.items.find((i) => i.itemId === "a2")!;
    deepEqual(a2.couldNotRun.map((x) => x.check), ["working"], "a2: the working check could not run");
    ok(!a2.couldNotRun[0].why.includes("m-working-1"), `model id kept out of the reason (${a2.couldNotRun[0].why})`);
    const a3 = rep.items.find((i) => i.itemId === "a3")!;
    ok(a3.notes.some((n) => /no answer on record/.test(n)), "a3: no answer on record, said so");
    ok(Math.abs(rep.cost - (0.01 * 2 + 0.02 * 3)) < 1e-9, `cost summed (${rep.cost})`);

    const md = renderRetro(rep);
    ok(md.startsWith("# Keystone retro-audit\n"), "title");
    ok(md.includes("working check + full rules audit") && md.includes("stage in_review"), "says what was run on what");
    ok(md.includes("## Summary"), "summary section");
    ok(md.includes("| Items audited | 3 |"), "items audited");
    ok(md.includes("| Items with findings | 1 |"), "items with findings");
    ok(md.includes("| Items where a check could not run | 1 |"), "could-not-run counted apart, never clean");
    ok(md.includes("| Items with no answer on record (working check skipped) | 1 |"), "no answer on record counted");
    ok(md.includes("| R-units | 1 |"), "findings per rule");
    ok(/\nCost: \$0\.0800 \(models: m-audit-1, m-working-1\)\n/.test(md), `cost line with models (${md.match(/Cost:.*/)?.[0]})`);
    equal(md.split("m-working-1").length - 1, 1, "a model id appears only in the cost line");
    ok(md.includes("### a1 · Math 30-1 · MC · in_review · v1"), "item heading: id, course, type, stage, version");
    ok(md.includes(`- audit R-units (diploma): "Working a1." — breaks R-units`), "finding: check, rule, quote, reason");
    ok(md.includes("- check could not run: working —"), "a failed check shown as could not run");
    ok(md.includes("- no answer on record: working check skipped"), "no answer on record shown");
    ok(md.includes("### a2") && !md.slice(md.indexOf("### a2"), md.indexOf("### a3")).includes("- no findings"), "an item whose check could not run is never shown as clean");
  }

  // --- --rule: that one rule only; approved / delivered apart ---
  {
    const items = [item("b1"), item("b2", { stage: "approved" }), item("b3", { stage: "delivered" }), item("b4", { stage: "ready" }), item("b5", { stage: "changes_requested" })];
    const { reader: r } = reader(items);
    const { checks: c, seen } = checks({
      audit: (i) =>
        i.itemId === "b1" || i.itemId === "b2" ? { findings: [broke("R-table", `Short ${i.itemId}.`)], cost: 0.02, model: "m-audit-1" }
        : i.itemId === "b5" ? { failed: "audit marked every rule not applicable", cost: 0.02, model: "m-audit-1" }
        : { findings: [], cost: 0.02, model: "m-audit-1" },
    });
    const rep = await runRetro({ rule: "R-table" }, { reader: r, checks: c, rules: RULES });
    equal(seen.working.length, 0, "--rule: no working check");
    ok(seen.audit.every((a) => a.rules.length === 1 && a.rules[0] === "R-table"), "--rule: the audit gets that one rule (the reply must cover exactly it)");
    deepEqual(seen.audit.map((a) => a.itemId).sort(), ["b1", "b2", "b3", "b4", "b5"], "every solution audited, approved and delivered too");
    const b5 = rep.items.find((i) => i.itemId === "b5")!;
    equal(b5.couldNotRun.length, 0, "a not-applicable verdict is not a failure");
    ok(b5.notes.some((n) => /does not apply/.test(n)), "it says the rule does not apply");
    const md = renderRetro(rep);
    ok(md.includes("rule R-table only"), "says which rule");
    const mainPart = md.slice(md.indexOf("## Not yet approved"), md.indexOf("## Approved or delivered"));
    const apartPart = md.slice(md.indexOf("## Approved or delivered"));
    ok(mainPart.includes("### b1") && !mainPart.includes("### b2"), "b1 in the main section, b2 not");
    ok(apartPart.includes("## Approved or delivered that would fail R-table") && apartPart.includes("### b2") && !apartPart.includes("### b3"), "approved b2 that would fail listed apart; delivered b3 that passes is not");
    ok(apartPart.includes("1 approved or delivered solution passes R-table."), "the passing ones are counted");
    ok(md.includes("| Rule did not apply | 1 |"), "not-applicable counted");
    await assert.rejects(() => runRetro({ rule: "R-nope" }, { reader: r, checks: c, rules: RULES }), /R-nope.*not in the rule file/, "an unknown rule is refused");
  }

  // --- no solution row for a version on record: not audited, said so ---
  {
    const { reader: r } = reader([item("c1")], false);
    const { checks: c, seen } = checks();
    const rep = await runRetro({}, { reader: r, checks: c, rules: RULES });
    equal(seen.audit.length + seen.working.length, 0, "nothing checked without the solution");
    ok(rep.skipped.some((x) => x.itemId === "c1" && /solution v1 not found/.test(x.why)), "listed as not audited");
    ok(renderRetro(rep).includes("## Not audited") && renderRetro(rep).includes("- c1: solution v1 not found"), "and in the report");
  }

  // --- a thrown check is a check that could not run, never a stop or a clean item ---
  {
    const { reader: r } = reader([item("d1"), item("d2")]);
    const { checks: c } = checks({ audit: (i) => { if (i.itemId === "d1") throw new Error("socket hang up"); return { findings: [], cost: 0, model: "" }; } });
    const rep = await runRetro({}, { reader: r, checks: c, rules: RULES });
    deepEqual(rep.items.find((i) => i.itemId === "d1")!.couldNotRun.map((x) => [x.check, x.why]), [["audit", "socket hang up"]], "thrown → could not run");
    equal(rep.items.length, 2, "the other item still audited");
  }

  console.log("retro.test ok");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
