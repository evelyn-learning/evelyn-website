// Pure tests for the run: every model call and the database are faked (an in-memory store
// implementing Reader and Writer). No network, no mongod. Run: npx tsx src/lib/keystone/pipeline/run.test.ts
import assert from "node:assert/strict";
import type { ItemDoc, PipelineDoc, RunDoc } from "../db";
import type { SectionKind } from "../config";
import { SupersededError, type Expect } from "../store";
import type { Answer, Decision } from "./answers";
import type { Solves } from "./solve";
import type { Draft } from "./write";
import type { CheckResult, Finding } from "./checks";
import type { CalcFinding } from "./calc";
import type { ModelReply } from "./types";
import { parseArgs, processItem, runPipeline, selectItems, type Deps, type Reader, type Steps, type Writer } from "./run";

/** assert.ok with a message always: without one, Node re-parses the transformed source to build it, which stalls under tsx. */
const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const deepEqual = (a: unknown, b: unknown, message: string) => assert.deepEqual(a, b, message);

delete process.env.KEYSTONE_PIPELINE_LIVE;

const T0 = new Date("2026-11-17T10:00:00Z");
const item = (p: Partial<ItemDoc> = {}): ItemDoc => ({
  itemId: "100", subject: "Mathematics", course: "Math 30-1", courseSource: "sheet", itemType: "MC", topic: "", standards: [], key: "B",
  evelynAnswer: "", keySource: "castle-rock", questionHtml: "<p>Which value is right?</p>",
  options: ["A", "B", "C", "D"].map((label) => ({ label, html: `<p>${label}</p>` })),
  interactions: [{ kind: "choice", responseId: "RESPONSE", maxChoices: 1, options: ["A", "B", "C", "D"].map((label) => ({ label, html: label })) }],
  keys: { RESPONSE: ["B"] }, castleRockSolutionHtml: "<p>theirs</p>", stage: "received", version: 0, releasedVersion: 0, releasedAnswer: "",
  batchId: "b1", showcase: false, source: "upload", order: 1, createdAt: T0, updatedAt: T0, lastActivityAt: T0, ...p,
} as ItemDoc);

type Activity = { itemId: string; type: string; verdict?: string; body?: string };

class FakeStore implements Reader, Writer {
  items = new Map<string, ItemDoc>();
  runs = new Map<string, RunDoc>();
  solutions: { itemId: string; version: number; sections: { kind: SectionKind; md: string }[]; releasedAt?: Date }[] = [];
  activity: Activity[] = [];
  suggestions: { kind: string; itemIds: string[]; batchId?: string }[] = [];
  verdicts = new Map<string, { verdict?: string; body?: string; createdAt: Date }>();
  sections = new Map<string, { kind: SectionKind; md: string }[]>();
  itemWrites = 0;
  constructor(items: ItemDoc[]) { for (const i of items) this.items.set(i.itemId, structuredClone(i)); }
  // Reader
  async item(id: string) { const i = this.items.get(id); return i ? structuredClone(i) : null; }
  async run(itemId: string, runId: string) { const r = this.runs.get(`${itemId}|${runId}`); return r ? structuredClone(r) : null; }
  async latestRun(itemId: string) {
    const all = [...this.runs.values()].filter((r) => r.itemId === itemId).sort((a, b) => +b.startedAt - +a.startedAt);
    return all[0] ? structuredClone(all[0]) : null;
  }
  async lastVerdict(id: string) { return this.verdicts.get(id) ?? null; }
  async latestSections(id: string) { return this.sections.get(id) ?? null; }
  async candidates(q: { only?: string[]; batch?: string }) {
    return [...this.items.values()].filter((i) => (!q.only || q.only.includes(i.itemId)) && (!q.batch || i.batchId === q.batch)).map((i) => structuredClone(i));
  }
  // Writer
  private unchanged(id: string, e: Expect): ItemDoc {
    const i = this.items.get(id);
    if (!i || i.stage !== e.stage || (i.version || 0) !== e.version || i.updatedAt.getTime() !== new Date(e.updatedAt).getTime() || i.stage === "approved" || i.stage === "delivered") throw new SupersededError(id);
    return i;
  }
  async saveRun(run: RunDoc) { this.runs.set(`${run.itemId}|${run.runId}`, structuredClone(run)); }
  async flagItemData(id: string, note: string, e: Expect) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    Object.assign(i, { stage: "item_data", updatedAt: new Date(i.updatedAt.getTime() + 1) });
    this.activity.push({ itemId: id, type: "verdict", verdict: "item_data", body: note });
  }
  async raiseKeyQuery(id: string, ourAnswer: string, workingMd: string, e: Expect) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    Object.assign(i, { stage: "key_query", keyQuery: { ourAnswer, workingHtml: workingMd, raisedAt: new Date() }, updatedAt: new Date(i.updatedAt.getTime() + 1) });
  }
  async saveSolution(id: string, s: { sections: { kind: SectionKind; md: string }[]; evelynAnswer: string; topic?: string; pipeline: PipelineDoc; note?: string }, e: Expect) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    const version = (i.version || 0) + 1;
    this.solutions.push({ itemId: id, version, sections: s.sections });
    Object.assign(i, { version, stage: "ready", evelynAnswer: s.evelynAnswer, pipeline: s.pipeline, updatedAt: new Date(i.updatedAt.getTime() + 1) });
    return version;
  }
  async setPipeline(id: string, pipeline: PipelineDoc, e: Expect) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    i.pipeline = pipeline;
  }
  async suggest(kind: "items_need_data" | "keys_queried" | "course_missing", itemIds: string[], batchId?: string) { this.suggestions.push({ kind, itemIds, batchId }); }
}

const B: Answer = { kind: "choice", letters: ["B"] };
const draft = (tag = "1"): Draft => ({
  topic: "Values",
  sections: [
    { kind: "short", md: `Short ${tag}. So the answer is B.` },
    { kind: "diploma", md: `Working ${tag}.\nSo the answer is B.` },
  ],
});
const okReply = <T>(value: T, cost: number, model: string): ModelReply<T> => ({ ok: true, value, cost, model, ms: 1, fellBack: false });
const solves = (answer: Answer): Solves => ({
  solver1: okReply({ answer, working: "w1", confidence: "high" as const }, 0.1, "m-s1"),
  solver2: okReply({ answer, working: "w2", confidence: "high" as const }, 0.1, "m-s2"),
});

type Calls = Record<keyof Steps, number> & { hints: (string | undefined)[]; writeOpts: unknown[] };

/** Steps that pass by default; each can be replaced. Counts every call. */
function steps(over: Partial<Steps> = {}): { steps: Steps; calls: Calls } {
  const calls = { intakeModel: 0, agreeOnAnswer: 0, writeSolution: 0, calcCheck: 0, workingCheck: 0, rulesAudit: 0, renderCheck: 0, classifyCause: 0, hints: [], writeOpts: [] } as Calls;
  const base: Steps = {
    intakeModel: async () => ({ complete: true, missing: [] }),
    agreeOnAnswer: async () => ({ decision: { outcome: "pass", answer: B, confirm: false }, solves: solves(B), cost: 0.2 }),
    writeSolution: async () => okReply(draft(), 0.1, "m-author"),
    calcCheck: async () => [],
    workingCheck: async () => ({ findings: [], cost: 0.05, model: "m-working" }),
    rulesAudit: async () => ({ findings: [], cost: 0.05, model: "m-audit" }),
    renderCheck: async () => [],
    classifyCause: async () => okReply({ cause: "style" as const, why: "wording" }, 0.01, "m-audit"),
  };
  const merged = { ...base, ...over };
  const counted = Object.fromEntries(
    Object.entries(merged).map(([k, fn]) => [k, async (...args: unknown[]) => {
      calls[k as keyof Steps]++;
      if (k === "agreeOnAnswer") calls.hints.push(args[3] as string | undefined);
      if (k === "writeSolution") calls.writeOpts.push(args[3]);
      return (fn as (...a: unknown[]) => unknown)(...args);
    }]),
  ) as unknown as Steps;
  return { steps: counted, calls };
}

function deps(store: FakeStore, s: Steps, extra: Partial<Deps> = {}): Deps {
  return { reader: store, writer: store, steps: s, rules: [], images: async () => [], assetExists: () => true, now: () => new Date(), ...extra };
}

const auditFail = (n: number): CheckResult => ({ findings: [{ check: "audit", code: "rule_broken", ruleId: "R-x", detail: `broken ${n}`, quote: "Short 1" } as Finding], cost: 0.05, model: "m-audit" });

(async () => {
  // --- happy path ---
  {
    const store = new FakeStore([item()]);
    const { steps: s } = steps();
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "ready", "happy path is ready");
    deepEqual(run.flags, [], "no flags");
    const it = store.items.get("100")!;
    equal(it.stage, "ready", "stage ready");
    equal(it.version, 1, "solution v1");
    equal(store.solutions.length, 1, "one solution");
    equal(store.solutions[0].releasedAt, undefined, "not released");
    equal(it.evelynAnswer, "B", "answer set");
    ok(it.pipeline?.passedAt instanceof Date, "passedAt set");
    equal(it.pipeline?.heldFor, undefined, "not held");
    equal(it.pipeline?.releaseAt, undefined, "releaseAt left to the release task");
    ok(store.runs.get("100|r1")?.result === "ready", "run record saved with its result");
    ok(Math.abs(run.cost - (0.2 + 0.1 + 0.05 + 0.05)) < 1e-9, `cost summed: ${run.cost}`);
    equal(store.suggestions.length, 0, "no suggestion");
  }

  // --- intake finding (code) → item_data, no solution, one suggestion ---
  {
    const store = new FakeStore([item({ questionHtml: "" })]);
    const { steps: s, calls } = steps();
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "item_data", "intake code finding → item_data");
    equal(store.items.get("100")!.stage, "item_data", "stage item_data");
    equal(store.solutions.length, 0, "no solution");
    deepEqual(store.suggestions, [{ kind: "items_need_data", itemIds: ["100"], batchId: "b1" }], "one suggestion");
    equal(store.activity.length, 1, "one verdict-style row");
    ok(/did not come through/.test(store.activity[0].body ?? ""), `client note: ${store.activity[0].body}`);
    equal(calls.agreeOnAnswer, 0, "never solved");
  }
  // --- intake finding (model) → item_data ---
  {
    const store = new FakeStore([item()]);
    const { steps: s } = steps({ intakeModel: async () => ({ complete: false, missing: ["the table of values"] }) });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "item_data", "intake model finding → item_data");
    ok(/table of values/.test(store.activity[0].body ?? ""), "note names what is missing");
  }

  // --- solvers agree, key differs → key_query ---
  {
    const store = new FakeStore([item()]);
    const C: Answer = { kind: "choice", letters: ["C"] };
    const { steps: s, calls } = steps({ agreeOnAnswer: async () => ({ decision: { outcome: "key_query", answer: C }, solves: solves(C), cost: 0.2 }) });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "key_query", "key query");
    const it = store.items.get("100")!;
    equal(it.stage, "key_query", "stage key_query");
    equal(it.keyQuery?.ourAnswer, "C", "our answer");
    equal(store.solutions.length, 0, "no solution");
    deepEqual(store.suggestions.map((x) => x.kind), ["keys_queried"], "keys_queried suggested");
    equal(calls.writeSolution, 0, "nothing written");
  }

  // --- audit fails once then passes → corrections 1, ready, no flag ---
  {
    const store = new FakeStore([item()]);
    let n = 0;
    const { steps: s, calls } = steps({ rulesAudit: async () => (n++ === 0 ? auditFail(1) : { findings: [], cost: 0.05, model: "m-audit" }) });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "ready", "corrected once → ready");
    equal(run.corrections, 1, "one correction");
    deepEqual(run.flags, [], "no flag");
    equal(calls.writeSolution, 2, "author called twice");
    const second = calls.writeOpts[1] as { findings?: string[]; previous?: Draft };
    ok(second.findings?.length === 1 && /broken 1/.test(second.findings[0]), "finding passed to the author");
    ok(second.previous?.sections.length === 2, "previous draft passed");
    equal(calls.calcCheck, 1, "calc not re-run (passed before the failed check)");
    equal(calls.workingCheck, 1, "working not re-run");
    equal(calls.rulesAudit, 2, "audit re-run");
    equal(calls.renderCheck, 1, "render ran once after");
  }

  // --- audit fails twice → held second_failure, stage ready ---
  {
    const store = new FakeStore([item()]);
    const { steps: s } = steps({ rulesAudit: async () => auditFail(2) });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "held", "held");
    deepEqual(run.flags, ["second_failure"], "second_failure");
    const it = store.items.get("100")!;
    equal(it.pipeline?.heldFor, "praveen", "held for Praveen");
    equal(it.stage, "ready", "stage ready");
    equal(it.pipeline?.passedAt, undefined, "did not pass");
    equal(store.solutions.length, 1, "draft kept as a held solution");
  }

  // --- course from metadata only → item untouched, course_missing ---
  {
    const store = new FakeStore([item({ courseSource: "metadata" })]);
    const before = structuredClone(store.items.get("100"));
    const { steps: s, calls } = steps();
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "course_missing", "course missing");
    deepEqual(store.items.get("100"), before, "item untouched");
    deepEqual(store.suggestions.map((x) => x.kind), ["course_missing"], "course_missing suggested");
    equal(calls.intakeModel + calls.agreeOnAnswer, 0, "no model spend");
  }

  // --- sectionTitle null → section_title_unset, no model ---
  {
    const store = new FakeStore([item({ course: "Physics 20" })]);
    const { steps: s, calls } = steps();
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "held", "held");
    deepEqual(run.flags, ["section_title_unset"], "flag");
    const it = store.items.get("100")!;
    equal(it.stage, "received", "stage unchanged");
    equal(it.pipeline?.heldFor, "praveen", "heldFor");
    deepEqual(it.pipeline?.flags, ["section_title_unset"], "flags on the item");
    equal(Object.values(calls).filter((v) => typeof v === "number").reduce((a, b) => (a as number) + (b as number), 0), 0, "no model call at all");
  }

  // --- kill after solve, run again → solvers not called again ---
  {
    const store = new FakeStore([item()]);
    let first = true;
    const { steps: s, calls } = steps({
      writeSolution: async () => {
        if (first) { first = false; throw new Error("killed"); }
        return okReply(draft(), 0.1, "m-author");
      },
    });
    const r1 = await processItem("100", "r1", deps(store, s));
    equal(r1.result, "failed", "first attempt failed");
    equal(r1.error, "killed", "error message kept");
    ok(r1.steps.some((x) => x.step === "solve"), "solve recorded");
    const r2 = await processItem("100", "r1", deps(store, s));
    equal(r2.result, "ready", "resumed and finished");
    equal(calls.agreeOnAnswer, 1, "solvers not called again");
    equal(calls.intakeModel, 1, "intake not called again");
  }

  // --- stage changed to rejected during the run → superseded ---
  {
    const store = new FakeStore([item()]);
    const { steps: s } = steps({
      writeSolution: async () => {
        Object.assign(store.items.get("100")!, { stage: "rejected", updatedAt: new Date() });
        return okReply(draft(), 0.1, "m-author");
      },
    });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "superseded", "superseded");
    equal(store.solutions.length, 0, "no solution written");
    equal(store.itemWrites, 0, "no item write");
  }

  // --- supersede at the item_data write point ---
  {
    const store = new FakeStore([item()]);
    const { steps: s } = steps({
      intakeModel: async () => { store.items.get("100")!.updatedAt = new Date(); return { complete: false, missing: ["x"] }; },
    });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "superseded", "item_data write superseded");
    equal(store.items.get("100")!.stage, "received", "stage untouched");
    equal(store.suggestions.length, 0, "no suggestion");
  }
  // --- supersede at the key_query write point (approved meanwhile) ---
  {
    const store = new FakeStore([item()]);
    const C: Answer = { kind: "choice", letters: ["C"] };
    const { steps: s } = steps({
      agreeOnAnswer: async () => { store.items.get("100")!.stage = "approved"; return { decision: { outcome: "key_query", answer: C }, solves: solves(C), cost: 0.2 }; },
    });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "superseded", "key query write superseded");
    equal(store.items.get("100")!.keyQuery, undefined, "no key query raised");
    equal(store.suggestions.length, 0, "no suggestion");
  }
  // --- supersede at the pass write point (version bumped meanwhile) ---
  {
    const store = new FakeStore([item()]);
    const { steps: s } = steps({ renderCheck: async () => { store.items.get("100")!.version = 3; return []; } });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "superseded", "pass write superseded");
    equal(store.solutions.length, 0, "no solution");
  }
  // --- writer's own conditional check (race after the re-read) → superseded, not failed ---
  {
    const store = new FakeStore([item()]);
    const racing: Writer = Object.assign(Object.create(store), {
      saveSolution: async () => { throw new SupersededError("100"); },
      saveRun: (r: RunDoc) => store.saveRun(r),
    });
    const { steps: s } = steps();
    const run = await processItem("100", "r1", { ...deps(store, s), writer: racing });
    equal(run.result, "superseded", "conditional write mismatch → superseded");
  }

  // --- approved / delivered: refused at selection and before writing ---
  {
    const store = new FakeStore([item({ stage: "approved" }), item({ itemId: "101", stage: "delivered" })]);
    const { steps: s, calls } = steps();
    const out = await runPipeline({ only: ["100", "101"], dryRun: false }, { reader: store, makeRealWriter: () => store, deps: deps(store, s), log: () => {} });
    equal(out.runs.length, 0, "nothing processed");
    deepEqual(out.refused.map((r) => r.itemId).sort(), ["100", "101"], "both refused");
    equal(store.runs.size, 0, "no run record");
    equal(store.itemWrites, 0, "nothing written");
    equal(calls.agreeOnAnswer + calls.intakeModel, 0, "no model call");
    const direct = await processItem("100", "r1", deps(store, s));
    equal(direct.result, "superseded", "processItem refuses an approved item too");
    equal(store.runs.size, 0, "and records nothing");
  }

  // --- a model step fails → held step_failed, next item still processed; cost includes the failed call ---
  {
    const store = new FakeStore([item(), item({ itemId: "101" })]);
    const { steps: s } = steps({
      workingCheck: async (it) => (it.itemId === "100" ? { failed: "shape: bad", cost: 0.3, model: "m-working" } : { findings: [], cost: 0.05, model: "m-working" }),
    });
    const out = await runPipeline({ only: ["100", "101"], dryRun: false }, { reader: store, makeRealWriter: () => store, deps: deps(store, s), log: () => {} });
    const r100 = out.runs.find((r) => r.itemId === "100")!;
    const r101 = out.runs.find((r) => r.itemId === "101")!;
    equal(r100.result, "held", "held");
    deepEqual(r100.flags, ["step_failed"], "step_failed");
    equal(store.items.get("100")!.pipeline?.heldFor, "praveen", "held for Praveen");
    equal(store.solutions.filter((x) => x.itemId === "100").length, 0, "no solution for the failed item");
    ok(Math.abs(r100.cost - (0.2 + 0.1 + 0.3)) < 1e-9, `failed call's cost counted: ${r100.cost}`);
    const w = r100.steps.find((x) => x.step === "working")!;
    ok(!w.ok && w.cost === 0.3 && w.model === "m-working", "failed step recorded with cost and model");
    equal(r101.result, "ready", "next item still processed");
  }

  // --- a thrown error in one item never stops the others ---
  {
    const store = new FakeStore([item(), item({ itemId: "101" })]);
    const { steps: s } = steps({ writeSolution: async (it) => { if (it.itemId === "100") throw new Error("boom"); return okReply(draft(), 0.1, "m"); } });
    const out = await runPipeline({ only: ["100", "101"], dryRun: false }, { reader: store, makeRealWriter: () => store, deps: deps(store, s), log: () => {} });
    equal(out.runs.find((r) => r.itemId === "100")!.result, "failed", "failed");
    equal(out.runs.find((r) => r.itemId === "101")!.result, "ready", "other item ready");
  }

  // --- --dry-run → zero writes, real writer never constructed ---
  {
    const store = new FakeStore([item(), item({ itemId: "101", questionHtml: "" })]);
    const before = structuredClone([...store.items.values()]);
    const { steps: s } = steps();
    let built = 0;
    const out = await runPipeline({ dryRun: true }, { reader: store, makeRealWriter: () => { built++; throw new Error("real writer built in a dry run"); }, deps: deps(store, s), log: () => {} });
    equal(built, 0, "real writer never constructed");
    deepEqual([...store.items.values()], before, "items unchanged");
    equal(store.runs.size, 0, "no run record written");
    equal(store.solutions.length + store.suggestions.length + store.activity.length, 0, "zero writes");
    ok(out.dry, "dry writer returned");
    const would = out.dry!.actions;
    ok(would.some((a) => a.itemId === "100" && a.action === "saveSolution"), "would save 100's solution");
    ok(would.some((a) => a.itemId === "101" && a.action === "flagItemData"), "would flag 101");
    equal(out.runs.find((r) => r.itemId === "100")!.result, "ready", "would be ready");
    ok(out.runs.every((r) => r.dryRun), "runs marked dry");
  }

  // --- --as-received only with --dry-run ---
  {
    assert.throws(() => parseArgs(["--as-received", "--only", "1"]), /--as-received.*--dry-run/, "as-received without dry-run rejected");
    const a = parseArgs(["--dry-run", "--as-received", "--only", "1,2", "--limit", "3"]);
    ok(a.dryRun && a.asReceived && a.only?.join() === "1,2" && a.limit === 3, "parsed");
    assert.throws(() => parseArgs(["--bogus"]), /unknown option/, "unknown option rejected");
    assert.throws(() => parseArgs(["--as-received", "--dry-run"]), /--only/, "as-received needs --only");
  }

  // --- unverified type: processed normally, always held ---
  {
    const inline = item({ itemType: "DDL", interactions: [{ kind: "inlineChoice", responseId: "R1", choices: [{ label: "x", html: "x" }, { label: "y", html: "y" }] }], keys: { R1: ["x"] }, key: "", options: [] });
    const store = new FakeStore([inline]);
    const L: Answer = { kind: "labels", values: ["x"] };
    const { steps: s } = steps({ agreeOnAnswer: async () => ({ decision: { outcome: "pass", answer: L, confirm: false }, solves: solves(L), cost: 0.2 }) });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "held", "held");
    deepEqual(run.flags, ["unverified_type"], "unverified_type");
    equal(store.items.get("100")!.stage, "ready", "solution written, stage ready");
    ok(store.items.get("100")!.pipeline?.passedAt, "it passed");
    equal(store.items.get("100")!.pipeline?.heldFor, "praveen", "held for Praveen");
  }
  // --- unverified type whose solvers query the key: held, nothing sent to the client ---
  {
    const inline = item({ itemType: "DDL", interactions: [{ kind: "inlineChoice", responseId: "R1", choices: [{ label: "x", html: "x" }, { label: "y", html: "y" }] }], keys: { R1: ["x"] }, key: "", options: [] });
    const store = new FakeStore([inline]);
    const L: Answer = { kind: "labels", values: ["y"] };
    const { steps: s } = steps({ agreeOnAnswer: async () => ({ decision: { outcome: "key_query", answer: L }, solves: solves(L), cost: 0.2 }) });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "held", "held instead of a key query");
    equal(run.wouldBe, "key_query", "what it would have been is recorded");
    equal(store.items.get("100")!.stage, "received", "no key query raised");
    equal(store.suggestions.length, 0, "no suggestion");
  }

  // --- unsupported interaction → type_not_supported, no model called ---
  {
    const store = new FakeStore([item({ interactions: [{ kind: "unsupported", element: "hotspotInteraction" }] })]);
    const { steps: s, calls } = steps();
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "held", "held");
    deepEqual(run.flags, ["type_not_supported"], "type_not_supported");
    equal(calls.intakeModel + calls.agreeOnAnswer + calls.writeSolution, 0, "no model called");
    equal(store.items.get("100")!.stage, "received", "never sent back as incomplete");
  }
  // --- unreadable form from the solve step → type_not_supported ---
  {
    const store = new FakeStore([item()]);
    const { steps: s } = steps({ agreeOnAnswer: async () => ({ decision: { outcome: "hold", why: "unreadable_form", detail: "x" }, solves: {}, cost: 0 }) });
    const run = await processItem("100", "r1", deps(store, s));
    deepEqual(run.flags, ["type_not_supported"], "unreadable_form → type_not_supported");
  }
  // --- written response → written_response, held, nothing written ---
  {
    const store = new FakeStore([item({ itemType: "WR", interactions: [{ kind: "extendedText", responseId: "R" }], keys: {}, key: "", options: [] })]);
    const T: Answer = { kind: "text", value: "essay" };
    const { steps: s } = steps({ agreeOnAnswer: async () => ({ decision: { outcome: "hold", why: "written_response" }, solves: solves(T), cost: 0.3 }) });
    const run = await processItem("100", "r1", deps(store, s));
    deepEqual(run.flags, ["written_response"], "written_response");
    equal(store.solutions.length, 0, "nothing written");
  }
  // --- a solver call failing → step_failed (not no_agreement) ---
  {
    const store = new FakeStore([item()]);
    const failedSolves: Solves = { solver1: { ok: false, reason: "transport", detail: "down", cost: 0.01, model: "m-s1" }, solver2: solves(B).solver2 };
    const { steps: s } = steps({ agreeOnAnswer: async () => ({ decision: { outcome: "hold", why: "no_agreement" }, solves: failedSolves, cost: 0.11 }) });
    const run = await processItem("100", "r1", deps(store, s));
    deepEqual(run.flags, ["step_failed"], "solver failure → step_failed");
    ok(Math.abs(run.cost - 0.11) < 1e-9, "failed solver cost counted");
  }

  // --- crash after the first correction does not grant a second ---
  {
    const store = new FakeStore([item()]);
    let audits = 0;
    const { steps: s, calls } = steps({
      rulesAudit: async () => {
        audits++;
        if (audits === 2) throw new Error("crash");
        return auditFail(audits);
      },
    });
    const r1 = await processItem("100", "r1", deps(store, s));
    equal(r1.result, "failed", "crashed after the correction");
    equal(r1.corrections, 1, "one correction recorded");
    const r2 = await processItem("100", "r1", deps(store, s));
    equal(r2.result, "held", "second failure holds");
    deepEqual(r2.flags, ["second_failure"], "second_failure");
    equal(calls.writeSolution, 2, "no second correction");
  }

  // --- working check disputes the answer: back to solve once, then no_agreement ---
  {
    const store = new FakeStore([item()]);
    const disputed: CheckResult = { findings: [{ check: "working", code: "answer_disputed", detail: "B is wrong" }], cost: 0.05, model: "m-working" };
    const { steps: s, calls } = steps({ workingCheck: async () => disputed });
    const run = await processItem("100", "r1", deps(store, s));
    equal(calls.agreeOnAnswer, 2, "solved again once");
    equal(run.result, "held", "held");
    deepEqual(run.flags, ["no_agreement"], "no_agreement");
    equal(store.solutions.length, 0, "nothing written");
    equal(run.corrections, 0, "a restart is not a correction");
  }
  {
    const store = new FakeStore([item()]);
    let n = 0;
    const { steps: s, calls } = steps({
      workingCheck: async () => (n++ === 0 ? { findings: [{ check: "working", code: "answer_disputed", detail: "no" }], cost: 0.05, model: "m" } : { findings: [], cost: 0.05, model: "m" }),
    });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "ready", "second solve passes");
    equal(calls.agreeOnAnswer, 2, "solved twice");
    equal(calls.writeSolution, 2, "written again from the new answer");
    equal((calls.writeOpts[1] as { previous?: Draft }).previous, undefined, "fresh draft after a restart");
  }

  // --- key_right return ---
  const keyRight = (p: Partial<ItemDoc> = {}) =>
    item({ stage: "drafting", keyQuery: { ourAnswer: "C", workingHtml: "", raisedAt: T0, answeredAt: new Date(T0.getTime() + 1000), reviewerReason: "The diagram shows B." }, ...p });
  {
    const store = new FakeStore([keyRight()]);
    store.verdicts.set("100", { verdict: "key_right", body: "The diagram shows B.", createdAt: new Date(T0.getTime() + 1000) });
    const { steps: s, calls } = steps();
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.mode, "key_right", "mode");
    deepEqual(calls.hints, ["The diagram shows B."], "reviewer's reason passed to the solvers");
    equal(run.result, "held", "held for Praveen");
    deepEqual(run.flags, ["key_confirmed_by_reviewer"], "key_confirmed_by_reviewer");
    equal(store.solutions.length, 1, "written");
    equal(calls.intakeModel, 0, "no intake on a return");
  }
  {
    const store = new FakeStore([keyRight()]);
    store.verdicts.set("100", { verdict: "key_right", body: "x", createdAt: new Date(T0.getTime() + 1000) });
    const C: Answer = { kind: "choice", letters: ["C"] };
    const { steps: s, calls } = steps({ agreeOnAnswer: async () => ({ decision: { outcome: "key_query", answer: C }, solves: solves(C), cost: 0.2 }) });
    const run = await processItem("100", "r1", deps(store, s));
    deepEqual(run.flags, ["no_agreement"], "still not the key → no_agreement");
    equal(store.solutions.length, 0, "nothing written");
    equal(store.items.get("100")!.stage, "drafting", "no new key query");
    equal(calls.writeSolution, 0, "author not called");
  }
  {
    const store = new FakeStore([keyRight()]);
    store.verdicts.set("100", { verdict: "key_right", body: "x", createdAt: new Date(T0.getTime() + 1000) });
    const split: Decision = { outcome: "pass", answer: B, confirm: false, flag: "solvers_split" };
    const { steps: s } = steps({ agreeOnAnswer: async () => ({ decision: split, solves: solves(B), cost: 0.3 }) });
    const run = await processItem("100", "r1", deps(store, s));
    deepEqual(run.flags, ["no_agreement"], "only two of three reach the key → no_agreement");
    equal(store.solutions.length, 0, "nothing written");
  }
  // --- solvers_split on a fresh item → written and flagged ---
  {
    const store = new FakeStore([item()]);
    const split: Decision = { outcome: "pass", answer: B, confirm: false, flag: "solvers_split" };
    const { steps: s } = steps({ agreeOnAnswer: async () => ({ decision: split, solves: solves(B), cost: 0.3 }) });
    const run = await processItem("100", "r1", deps(store, s));
    deepEqual(run.flags, ["solvers_split"], "solvers_split");
    equal(store.solutions.length, 1, "written");
  }

  // --- changes_requested ---
  const changes = () => item({ stage: "changes_requested", version: 1, releasedVersion: 1, evelynAnswer: "B" });
  {
    const store = new FakeStore([changes()]);
    store.verdicts.set("100", { verdict: "changes", body: "Use Canadian spelling.", createdAt: T0 });
    store.sections.set("100", draft("old").sections);
    const { steps: s, calls } = steps();
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.mode, "changes", "mode");
    equal(run.cause, "style", "cause stored");
    equal(calls.agreeOnAnswer, 0, "style: no re-solve");
    const opts = calls.writeOpts[0] as { fixNote?: string; previous?: Draft };
    equal(opts.fixNote, "Use Canadian spelling.", "fixNote");
    ok(opts.previous?.sections[0].md.includes("old"), "previous solution given");
    equal(run.result, "ready", "ready");
    equal(store.items.get("100")!.version, 2, "new version");
  }
  {
    const store = new FakeStore([changes()]);
    store.verdicts.set("100", { verdict: "changes", body: "The answer should be C.", createdAt: T0 });
    store.sections.set("100", draft("old").sections);
    const { steps: s, calls } = steps({ classifyCause: async () => okReply({ cause: "answer" as const, why: "says answer" }, 0.01, "m-audit") });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.cause, "answer", "cause answer");
    equal(calls.agreeOnAnswer, 1, "answer: restarts at solve");
    equal((calls.writeOpts[0] as { fixNote?: string }).fixNote, "The answer should be C.", "fixNote kept");
  }
  {
    const store = new FakeStore([changes()]);
    store.verdicts.set("100", { verdict: "changes", body: "x", createdAt: T0 });
    const { steps: s } = steps({ classifyCause: async () => ({ ok: false, reason: "shape", detail: "bad", cost: 0.02, model: "m-audit" }) });
    const run = await processItem("100", "r1", deps(store, s));
    deepEqual(run.flags, ["step_failed"], "cause model failure → step_failed");
  }

  // --- no local asset folder: image check skipped loudly; an item with an image is not solved blind ---
  {
    const store = new FakeStore([item(), item({ itemId: "101", questionHtml: '<p>See</p><img src="/api/keystone/asset/101/fig.png" alt="f"/>' })]);
    const { steps: s, calls } = steps();
    const d = deps(store, s, { assetExists: undefined });
    const a = await processItem("100", "r1", d);
    equal(a.assetsChecked, false, "assetsChecked false");
    equal(a.result, "ready", "text item still runs");
    const b = await processItem("101", "r1", d);
    equal(b.result, "failed", "image item not solved without its images");
    ok(/images/.test(b.error ?? ""), `says why: ${b.error}`);
    equal(calls.agreeOnAnswer, 1, "only the text item was solved");
    equal(store.items.get("101")!.stage, "received", "nothing written");
  }
  // --- with an asset folder, a missing image is an intake finding ---
  {
    const store = new FakeStore([item({ questionHtml: '<p>See</p><img src="/api/keystone/asset/100/fig.png" alt="f"/>' })]);
    const { steps: s } = steps();
    const run = await processItem("100", "r1", deps(store, s, { assetExists: () => false }));
    equal(run.result, "item_data", "missing image → item_data");
    equal(run.assetsChecked, true, "checked");
  }

  // --- a finished run is not redone ---
  {
    const store = new FakeStore([item()]);
    const { steps: s, calls } = steps();
    await processItem("100", "r1", deps(store, s));
    const again = await processItem("100", "r1", deps(store, s));
    equal(again.result, "ready", "same result");
    equal(calls.agreeOnAnswer, 1, "not redone");
  }

  // --- selection ---
  {
    const later = new Date(T0.getTime() + 5000);
    const items = [
      item({ itemId: "1" }),
      item({ itemId: "2", stage: "in_review" }),
      item({ itemId: "3", stage: "changes_requested" }),
      item({ itemId: "4", stage: "drafting", keyQuery: { ourAnswer: "C", workingHtml: "", raisedAt: T0, answeredAt: later } }),
      item({ itemId: "5", stage: "drafting", keyQuery: { ourAnswer: "C", workingHtml: "", raisedAt: T0, answeredAt: T0 } }),
      item({ itemId: "6", stage: "drafting" }),
      item({ itemId: "7", stage: "approved" }),
      item({ itemId: "8", pipeline: { flags: ["no_agreement"], heldFor: "praveen" } }),
    ];
    const runs = new Map<string, RunDoc>([
      ["5", { startedAt: new Date(T0.getTime() + 1) } as RunDoc],
      ["8", { result: "held", startedAt: T0, startedFrom: { stage: "received", version: 0, updatedAt: T0 } } as RunDoc],
    ]);
    const sel = selectItems(items, runs, {});
    deepEqual(sel.take.map((i) => i.itemId), ["1", "3", "4"], "received, changes_requested, answered key query with no later run");
    const named = selectItems(items, runs, { only: ["2", "7", "8"] });
    deepEqual(named.take.map((i) => i.itemId), ["8"], "a held item can be named");
    deepEqual(named.refused.map((r) => r.itemId), ["2", "7"], "in_review and approved refused");
    ok(/approved/.test(named.refused[1].why), "says why");
    const asRec = selectItems(items, runs, { only: ["2"], asReceived: true });
    deepEqual(asRec.take.map((i) => [i.itemId, i.stage]), [["2", "received"]], "as-received overlay");
    equal(selectItems(items, runs, { limit: 2 }).take.length, 2, "limit");
  }

  console.log("run.test ok");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
