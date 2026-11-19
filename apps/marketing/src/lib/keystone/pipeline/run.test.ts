// Pure tests for the run: every model call and the database are faked (an in-memory store
// implementing Reader and Writer). No network, no mongod. Run: npx tsx src/lib/keystone/pipeline/run.test.ts
import assert from "node:assert/strict";
import type { ItemDoc, LessonDoc, PipelineDoc, RunDoc } from "../db";
import type { SectionKind } from "../config";
import { SupersededError, type Expect } from "../store";
import type { Answer, Decision } from "./answers";
import type { Solves } from "./solve";
import type { Draft } from "./write";
import type { CheckResult, Finding } from "./checks";
import type { CalcFinding } from "./calc";
import type { ModelReply } from "./types";
import { visibleStage } from "../config";
import type { ModelImage } from "./types";
import { releaseAt } from "./release";
import { agreeOnAnswer } from "./solve";
import { sniffImage, parseArgs, processItem, runPipeline, selectItems, styleOnly, type Deps, type Reader, type Steps, type Writer } from "./run";

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
  solutions: { itemId: string; version: number; sections: { kind: SectionKind; md: string }[]; releasedAt?: Date; runId?: string }[] = [];
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
  async failedAttempts(id: string, from: Expect) {
    return [...this.runs.values()].filter((r) => r.itemId === id && !r.dryRun && r.startedFrom && r.startedFrom.stage === from.stage && r.startedFrom.version === from.version && new Date(r.startedFrom.updatedAt).getTime() === new Date(from.updatedAt).getTime()).reduce((n, r) => n + (r.failedAttempts ?? 0), 0);
  }
  async solutionRunId(id: string, version: number) { const r = this.solutions.find((x) => x.itemId === id && x.version === version); return r ? { runId: r.runId } : null; }
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
  async flagItemData(id: string, note: string, e: Expect, runId: string) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    Object.assign(i, { stage: "item_data", updatedAt: new Date(i.updatedAt.getTime() + 1) });
    i.pipeline = { ...(i.pipeline ?? { flags: [] }), runId, wroteStage: "item_data" };
    delete i.pipeline.heldFor;
    this.activity.push({ itemId: id, type: "verdict", verdict: "item_data", body: note });
  }
  async raiseKeyQuery(id: string, ourAnswer: string, workingMd: string, e: Expect, runId: string) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    Object.assign(i, { stage: "key_query", keyQuery: { ourAnswer, workingHtml: workingMd, raisedAt: new Date() }, updatedAt: new Date(i.updatedAt.getTime() + 1) });
    i.pipeline = { ...(i.pipeline ?? { flags: [] }), runId, wroteStage: "key_query" };
    delete i.pipeline.heldFor;
  }
  async saveSolution(id: string, s: { sections: { kind: SectionKind; md: string }[]; evelynAnswer: string; topic?: string; pipeline: PipelineDoc; note?: string; runId: string }, e: Expect) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    const version = (i.version || 0) + 1;
    this.solutions.push({ itemId: id, version, sections: s.sections, runId: s.runId });
    Object.assign(i, { version, stage: "ready", evelynAnswer: s.evelynAnswer, pipeline: s.pipeline, updatedAt: new Date(i.updatedAt.getTime() + 1) });
    return version;
  }
  async setPipeline(id: string, pipeline: PipelineDoc, e: Expect) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    i.pipeline = pipeline;
  }
  async suggest(kind: "items_need_data" | "keys_queried" | "course_missing", itemIds: string[], batchId?: string) { this.suggestions.push({ kind, itemIds, batchId }); }
  lessons: LessonDoc[] = [];
  lessonCalls = 0;
  /** Upsert-if-absent on itemId + version, like the unique index. */
  async saveLesson(l: LessonDoc) {
    this.lessonCalls++;
    if (!this.lessons.some((x) => x.itemId === l.itemId && x.version === l.version)) this.lessons.push(structuredClone(l));
  }
  sampled: { batchIds: string[]; unbatched: string[] }[] = [];
  async sample(batchIds: string[], unbatched: string[]) { this.sampled.push({ batchIds, unbatched }); }
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
  return { reader: store, writer: store, steps: s, rules: [], images: async (_i, files) => files.map(() => ({ mime: "image/png", data: PNG })), assetExists: () => true, now: () => new Date(), ...extra };
}

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13]);
// A content rule: never "style only", so a second failure on it is held (the one-correction rule).
const auditFail = (n: number): CheckResult => ({ findings: [{ check: "audit", code: "rule_broken", ruleId: "R-answer-agreed", detail: `broken ${n}`, quote: "Short 1" } as Finding], cost: 0.05, model: "m-audit" });

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
    ok(it.pipeline?.releaseAt instanceof Date, "a clean pass gets its release time");
    equal(it.pipeline!.releaseAt!.getTime(), releaseAt(T0, it.pipeline!.passedAt!, false, "100").getTime(), "releaseAt from receivedAt (createdAt when unset) and passedAt, not corrected");
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

  // --- a second correction for style only ---
  {
    const styleFail = (n: number): CheckResult => ({ findings: [{ check: "audit", code: "rule_broken", ruleId: "R-canadian-spelling", detail: `spelling ${n}`, quote: "Short 1" } as Finding], cost: 0.05, model: "m-audit" });
    const found = (r: CheckResult): Finding[] => ("findings" in r ? r.findings : []);
    ok(styleOnly(found(styleFail(1))) && !styleOnly(found(auditFail(1))) && !styleOnly([]), "styleOnly: a style rule yes, a content rule no, nothing no");
    ok(!styleOnly([...found(styleFail(1)), { check: "working", code: "line_does_not_follow", detail: "x" } as Finding]), "one content finding among style ones: not style only");
    ok(styleOnly([{ check: "render", code: "katex", detail: "x" } as Finding]) && !styleOnly([{ check: "render", code: "missing_image", detail: "x" } as Finding]) && !styleOnly([{ check: "audit", code: "rule_broken", detail: "no rule id" } as Finding]), "form codes yes; a missing picture or an unnamed rule no");

    // style fails twice, then passes: two corrections, every check re-run on the last draft, ready with no flag
    let n = 0;
    const a = steps({ rulesAudit: async () => (n++ < 2 ? styleFail(n) : { findings: [], cost: 0.05, model: "m-audit" }) });
    const store = new FakeStore([item()]);
    const run = await processItem("100", "r1", deps(store, a.steps));
    equal(run.result, "ready", "style corrected twice → ready");
    equal(run.corrections, 2, "two corrections");
    deepEqual(run.flags, [], "no flag");
    equal(a.calls.writeSolution, 3, "author called three times");
    equal(a.calls.calcCheck, 2, "calc re-run after the style correction");
    equal(a.calls.workingCheck, 2, "working re-run after the style correction");
    equal(a.calls.rulesAudit, 3, "audit ran three times");

    // style fails a third time: held, as before
    const b = steps({ rulesAudit: async () => styleFail(9) });
    const store2 = new FakeStore([item()]);
    const run2 = await processItem("100", "r1", deps(store2, b.steps));
    equal(run2.result, "held", "style fails three times → held");
    deepEqual(run2.flags, ["second_failure"], "second_failure");
    equal(b.calls.writeSolution, 3, "no third correction");

    // the working check fails on the style-corrected draft: held, no further correction
    let w = 0, au = 0;
    const c = steps({
      rulesAudit: async () => (au++ < 2 ? styleFail(au) : { findings: [], cost: 0.05, model: "m-audit" }),
      workingCheck: async () => (w++ === 0 ? { findings: [], cost: 0.05, model: "m-work" } : { findings: [{ check: "working", code: "line_does_not_follow", detail: "broken by the rewrite" } as Finding], cost: 0.05, model: "m-work" }),
    });
    const run3 = await processItem("100", "r1", deps(new FakeStore([item()]), c.steps));
    equal(run3.result, "held", "a rewrite that breaks the working is caught and held");
    deepEqual(run3.flags, ["second_failure"], "second_failure");
    equal(c.calls.writeSolution, 3, "and not corrected again");

    // the switch: off = one correction of any kind
    process.env.KEYSTONE_STYLE_CORRECTION = "off";
    const d = steps({ rulesAudit: async () => styleFail(2) });
    const run4 = await processItem("100", "r1", deps(new FakeStore([item()]), d.steps));
    delete process.env.KEYSTONE_STYLE_CORRECTION;
    equal(run4.result, "held", "switched off → held after one correction");
    equal(d.calls.writeSolution, 2, "one correction only");
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

  // --- two solvers disagree and the tie-break key is missing: held for the owner, nothing else written ---
  {
    const saved = { a: process.env.ANTHROPIC_API_KEY, o: process.env.OPENAI_API_KEY, d: process.env.DEEPSEEK_API_KEY };
    process.env.ANTHROPIC_API_KEY = "test-key";
    process.env.OPENAI_API_KEY = "test-key";
    delete process.env.DEEPSEEK_API_KEY;
    try {
      const answerJson = (l: string) => JSON.stringify({ answer: { kind: "choice", letters: [l], value: "", values: [], responses: [] }, working: "w", confidence: "high" });
      const urls: string[] = [];
      const fakeFetch = (async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        urls.push(url);
        const json = (b: unknown) => new Response(JSON.stringify(b), { status: 200, headers: { "content-type": "application/json" } });
        if (url.includes("anthropic")) {
          return json({ id: "m", type: "message", role: "assistant", model: "claude-fable-5-2", content: [{ type: "text", text: answerJson("B") }], stop_reason: "end_turn", stop_sequence: null, usage: { input_tokens: 1000, output_tokens: 100 } });
        }
        return json({ id: "c", object: "chat.completion", created: 1, model: "gpt-6.2-astra", choices: [{ index: 0, message: { role: "assistant", content: answerJson("C") }, finish_reason: "stop" }], usage: { prompt_tokens: 1000, completion_tokens: 100 } });
      }) as typeof fetch;
      const store = new FakeStore([item()]);
      const { steps: s, calls } = steps({ agreeOnAnswer: (it, images, course, hint) => agreeOnAnswer(it, images, course, hint, { fetch: fakeFetch, backoffMs: 0 }) as never });
      const run = await processItem("100", "r1", deps(store, s));
      equal(run.result, "held", "a split with no tie-break key is held");
      deepEqual(run.flags, ["step_failed"], "held as a check that could not run");
      equal(store.items.get("100")!.pipeline?.heldFor, "praveen", "held for the owner");
      equal(store.solutions.length, 0, "no solution written");
      equal(calls.writeSolution, 0, "nothing authored");
      equal(store.suggestions.filter((x) => x.kind === "keys_queried").length, 0, "no key query raised");
      ok(!urls.some((u) => u.includes("deepseek")), "the vendor with no key was never called");
    } finally {
      process.env.ANTHROPIC_API_KEY = saved.a; process.env.OPENAI_API_KEY = saved.o;
      if (saved.d === undefined) delete process.env.DEEPSEEK_API_KEY; else process.env.DEEPSEEK_API_KEY = saved.d;
    }
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

  // --- lessons: one per send-back the run picks up ---
  {
    // Task 17 step 1: a changes_requested item with a faked cause "format" leaves one lesson.
    const long = `Put the table in the Diploma section. ${"Keep the units in every row. ".repeat(12)}`;
    const store = new FakeStore([changes()]);
    store.verdicts.set("100", { verdict: "changes", body: `${long}<table><tr><td>row</td></tr></table>`, createdAt: T0 });
    store.sections.set("100", draft("old").sections);
    const { steps: s } = steps({ classifyCause: async () => okReply({ cause: "format" as const, why: "layout" }, 0.01, "m-audit") });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "ready", `the correction still goes through (${run.error ?? ""})`);
    equal(store.lessons.length, 1, "one lesson");
    const l = store.lessons[0];
    deepEqual(
      { itemId: l.itemId, version: l.version, cause: l.cause, proposedBy: l.proposedBy, confirmed: l.confirmed },
      { itemId: "100", version: 1, cause: "format", proposedBy: "model", confirmed: false },
      "lesson: the version sent back, the proposed cause, unconfirmed, by the model",
    );
    ok(l.note.startsWith("Put the table in the Diploma section.") && l.note.endsWith("row"), `note is the plain text of the note (${l.note.slice(-30)})`);
    ok(l.note.length > 300 && !/[<>]/.test(l.note), `note kept full length, no markup (${l.note.length})`);
    ok(l.createdAt instanceof Date, "createdAt set");
    equal(l.ruleId, undefined, "no rule yet");
    // repeated with the same run id: the finished run is returned, no second lesson
    await processItem("100", "r1", deps(store, s));
    equal(store.lessons.length, 1, "a repeated run writes no second lesson");
  }
  {
    // resumed: the run fails after the cause step, then continues (same run id) and a new run starts (new id)
    const store = new FakeStore([changes()]);
    store.verdicts.set("100", { verdict: "changes", body: "Fix the spelling.", createdAt: T0 });
    store.sections.set("100", draft("old").sections);
    let boom = true;
    const { steps: s, calls } = steps({ writeSolution: async () => { if (boom) throw new Error("killed"); return okReply(draft(), 0.1, "m-author"); } });
    const r1 = await processItem("100", "r1", deps(store, s));
    equal(r1.result, "failed", "first attempt fails in write");
    equal(store.lessons.length, 1, "the lesson was written before the failure");
    boom = false;
    const r2 = await processItem("100", "r2", deps(store, s));
    equal(r2.result, "ready", `a second run on the same send-back goes through (${r2.error ?? ""})`);
    equal(store.lessons.length, 1, "still one lesson for the item and version");
    ok(store.lessonCalls >= 2, "the second run asked again; the writer kept one (upsert-if-absent)");
    equal(calls.classifyCause, 2, "each run classified once");
  }
  {
    // the cause step failed: the send-back still happened → lesson "other" by the model, run held step_failed
    const store = new FakeStore([changes()]);
    store.verdicts.set("100", { verdict: "changes", body: "Something about the graph.", createdAt: T0 });
    const { steps: s } = steps({ classifyCause: async () => ({ ok: false, reason: "shape", detail: "bad", cost: 0.02, model: "m-audit" }) });
    const run = await processItem("100", "r1", deps(store, s));
    deepEqual(run.flags, ["step_failed"], "cause failure still holds step_failed");
    equal(run.result, "held", "held as before");
    equal(store.lessons.length, 1, "a lesson is written anyway");
    deepEqual([store.lessons[0].cause, store.lessons[0].proposedBy, store.lessons[0].confirmed], ["other", "model", false], "cause other, by the model, unconfirmed");
    equal(store.lessons[0].note, "Something about the graph.", "the note");
  }
  {
    // fresh and key-right runs write no lesson
    const store = new FakeStore([item()]);
    const { steps: s } = steps();
    await processItem("100", "r1", deps(store, s));
    equal(store.lessons.length, 0, "a fresh run writes no lesson");
  }
  {
    // dry run: the lesson is recorded as an action on the dry writer, never written
    const store = new FakeStore([changes()]);
    store.verdicts.set("100", { verdict: "changes", body: "Use Canadian spelling.", createdAt: T0 });
    store.sections.set("100", draft("old").sections);
    const { steps: s } = steps({ classifyCause: async () => okReply({ cause: "format" as const, why: "" }, 0.01, "m-audit") });
    const out = await runPipeline({ dryRun: true }, { reader: store, makeRealWriter: () => { throw new Error("no real writer in a dry run"); }, deps: deps(store, s), log: () => {} });
    equal(store.lessons.length, 0, "dry run: no lesson written");
    equal(store.lessonCalls, 0, "dry run: the store was never asked");
    const a = out.dry!.actions.filter((x) => x.action === "saveLesson");
    equal(a.length, 1, "dry run: the lesson is recorded as what would be written");
    equal((a[0].detail as { cause: string }).cause, "format", "with its cause");
  }

  // --- a lesson that cannot be recorded never holds the item ---
  {
    const store = new FakeStore([changes()]);
    store.verdicts.set("100", { verdict: "changes", body: "Use Canadian spelling.", createdAt: T0 });
    store.sections.set("100", draft("old").sections);
    process.env.OPENAI_API_KEY = "sk-test-SECRET-123456789";
    store.saveLesson = async () => { throw new Error("connection reset with sk-test-SECRET-123456789"); };
    const { steps: s } = steps();
    const run = await processItem("100", "r1", deps(store, s));
    delete process.env.OPENAI_API_KEY;
    equal(run.result, "ready", `the correction goes through (${run.error ?? ""})`);
    deepEqual(run.flags, [], "no step_failed");
    equal(run.warnings?.length, 1, "one warning on the run record");
    ok(/^lesson not recorded: connection reset/.test(run.warnings![0]) && !run.warnings![0].includes("SECRET"), `scrubbed (${run.warnings![0]})`);
    equal(store.runs.get("100|r1")?.warnings?.length, 1, "saved on the run record");
  }

  // --- owner rewrite: a held solution Praveen sent back with a note ---
  const T1 = new Date("2026-11-17T12:00:00Z");
  const ownerItem = (p: Partial<ItemDoc> = {}) => item({
    stage: "ready", version: 1, releasedVersion: 0, evelynAnswer: "B", updatedAt: T1,
    pipeline: { flags: ["sample", "owner_sent_back"], heldFor: "praveen", fixNote: "Show the units.", fixRequestedAt: T1, sentBackBy: "praveen", runId: "old", seenAt: T0 },
    ...p,
  });
  {
    const items = [
      ownerItem(),
      item({ itemId: "101", stage: "ready", version: 1, pipeline: { flags: ["sample"], heldFor: "praveen" } }),
      ownerItem({ itemId: "102", stage: "approved" }),
      item({ itemId: "103", stage: "ready", version: 1, pipeline: { flags: [] } }),
    ];
    const sel = selectItems(items, new Map(), {});
    deepEqual(sel.take.map((i) => i.itemId), ["100"], "only the ready item with owner_sent_back is taken");
    ok(sel.skipped.some((x) => x.itemId === "101" && /not sent back/.test(x.why)), "a held ready item without the flag is not");
    ok(sel.skipped.some((x) => x.itemId === "103"), "nor a clean ready one");
    ok(sel.refused.some((x) => x.itemId === "102"), "approved is refused even with the flag");
    deepEqual(selectItems(items, new Map(), { only: ["101"] }).take, [], "naming a ready item without the flag does not take it");
  }
  {
    // other cause: write with the note and the current solution, checks, saved held for him
    const store = new FakeStore([ownerItem()]);
    store.sections.set("100", draft("old").sections);
    const notes: string[] = [];
    const { steps: s, calls } = steps({ classifyCause: async (_i, note) => { notes.push(note); return okReply({ cause: "format" as const, why: "" }, 0.01, "m-audit"); } });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.mode, "owner", "mode owner");
    equal(run.result, "held", `always held (${run.error ?? ""})`);
    deepEqual(notes, ["Show the units."], "the cause step classifies Praveen's note");
    equal(calls.intakeModel, 0, "no intake");
    equal(calls.agreeOnAnswer, 0, "not about the answer: no re-solve");
    const opts = calls.writeOpts[0] as { fixNote?: string; previous?: Draft };
    equal(opts.fixNote, "Show the units.", "the note is the author's instruction");
    ok(opts.previous?.sections[0].md.includes("old"), "the current solution as previous");
    equal(calls.workingCheck + calls.rulesAudit, 2, "the checks ran");
    const it = store.items.get("100")!;
    equal(it.stage, "ready", "stays ready");
    equal(it.version, 2, "new version");
    equal(it.releasedVersion, 0, "unreleased");
    deepEqual([...it.pipeline!.flags].sort(), ["owner_rewrite", "sample"], "owner_sent_back gone, owner_rewrite added, sample kept");
    equal(it.pipeline!.heldFor, "praveen", "held for him");
    equal(it.pipeline!.releaseAt, undefined, "never a release time");
    ok(it.pipeline!.passedAt instanceof Date, "it passed the checks");
    for (const k of ["fixNote", "fixRequestedAt", "sentBackBy", "seenAt"] as const) equal(it.pipeline![k], undefined, `${k} cleared in the same update`);
    equal(it.evelynAnswer, "B", "same answer");
    equal(store.lessons.length + store.lessonCalls, 0, "no lesson: Praveen's note is not the client's send-back");
    equal(store.itemWrites, 1, "one item write");
  }
  {
    // answer cause: back to the blind solves
    const store = new FakeStore([ownerItem()]);
    store.sections.set("100", draft("old").sections);
    const { steps: s, calls } = steps({ classifyCause: async () => okReply({ cause: "answer" as const, why: "" }, 0.01, "m-audit") });
    const run = await processItem("100", "r1", deps(store, s));
    equal(calls.agreeOnAnswer, 1, "answer: restarts at solve");
    equal((calls.writeOpts[0] as { fixNote?: string; previous?: Draft }).fixNote, "Show the units.", "with the note");
    equal((calls.writeOpts[0] as { previous?: Draft }).previous, undefined, "and no previous solution");
    equal(run.result, "held", "held for him");
    ok(store.items.get("100")!.pipeline!.flags.includes("owner_rewrite"), "owner_rewrite");
  }
  {
    // a second failure is still saved, held, with both flags
    const store = new FakeStore([ownerItem()]);
    store.sections.set("100", draft("old").sections);
    const { steps: s } = steps({ rulesAudit: async () => auditFail(1) });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "held", "second failure held");
    const it = store.items.get("100")!;
    deepEqual([...it.pipeline!.flags].sort(), ["owner_rewrite", "sample", "second_failure"], "flags after a second failure");
    equal(it.pipeline!.passedAt, undefined, "did not pass");
    equal(it.pipeline!.releaseAt, undefined, "no release time");
  }
  {
    // the rewrite cannot complete: item as it was + step_failed; the next run retries
    const store = new FakeStore([ownerItem()]);
    store.sections.set("100", draft("old").sections);
    const { steps: s } = steps({ writeSolution: async () => ({ ok: false, reason: "shape", detail: "bad", cost: 0.1, model: "m-author" }) });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "held", "held");
    const it = store.items.get("100")!;
    equal(it.version, 1, "no new version");
    deepEqual([...it.pipeline!.flags].sort(), ["owner_sent_back", "sample", "step_failed"], "flag kept, step_failed added");
    equal(it.pipeline!.fixNote, "Show the units.", "note kept");
    equal(it.pipeline!.heldFor, "praveen", "held");
    const again = selectItems([it], new Map([["100", store.runs.get("100|r1")!]]), {});
    deepEqual(again.take.map((i) => i.itemId), ["100"], "the next run retries it");
    // a thrown step: the same through the run's failure path
    const store2 = new FakeStore([ownerItem()]);
    store2.sections.set("100", draft("old").sections);
    const { steps: s2 } = steps({ writeSolution: async () => { throw new Error("killed"); } });
    const r2 = await processItem("100", "r1", deps(store2, s2));
    equal(r2.result, "failed", "failed");
    const it2 = store2.items.get("100")!;
    deepEqual([...it2.pipeline!.flags].sort(), ["owner_sent_back", "sample", "step_failed"], "thrown: flag kept, step_failed added");
    equal(it2.pipeline!.fixNote, "Show the units.", "thrown: note kept");
  }
  {
    // dry run writes nothing
    const store = new FakeStore([ownerItem()]);
    store.sections.set("100", draft("old").sections);
    const { steps: s } = steps();
    const out = await runPipeline({ dryRun: true }, { reader: store, makeRealWriter: () => { throw new Error("no real writer"); }, deps: deps(store, s), log: () => {} });
    equal(store.itemWrites, 0, "dry run: no item write");
    equal(store.solutions.length, 0, "dry run: no solution");
    const save = out.dry!.actions.find((x) => x.action === "saveSolution");
    ok(save && (save.detail as { pipeline: PipelineDoc }).pipeline.flags.includes("owner_rewrite"), "dry run says what it would save");
  }
  {
    // resume after a crash just after the save: no second write
    const store = new FakeStore([ownerItem()]);
    store.sections.set("100", draft("old").sections);
    const realSave = store.saveRun.bind(store);
    let crashed = false;
    store.saveRun = async (r: RunDoc) => {
      if (!crashed && r.result === "held") { crashed = true; throw new Error("crash after the save"); }
      return realSave(r);
    };
    const { steps: s, calls } = steps();
    await processItem("100", "r1", deps(store, s)).catch(() => undefined);
    equal(store.solutions.length, 1, "the save landed before the crash");
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "held", `resume finishes as held (${run.error ?? ""})`);
    equal(store.solutions.length, 1, "no second solution");
    equal(store.itemWrites, 1, "no second item write");
    equal(calls.writeSolution, 1, "the author was not called again");
  }

  // --- release time: a clean pass gets releaseAt in the same write; a flagged one does not ---
  {
    const RECEIVED = new Date("2026-11-16T17:00:00Z"); // Mon 10:00 MT
    const PASSED = new Date("2026-11-16T19:00:00Z"); // Mon 12:00 MT
    const store = new FakeStore([item({ receivedAt: RECEIVED })]);
    const { steps: s } = steps();
    const run = await processItem("100", "r1", deps(store, s, { now: () => PASSED }));
    equal(run.result, "ready", "clean pass");
    const it = store.items.get("100")!;
    equal(it.pipeline?.passedAt?.getTime(), PASSED.getTime(), "passedAt is the run's clock");
    equal(it.pipeline?.releaseAt?.getTime(), releaseAt(RECEIVED, PASSED, false, "100").getTime(), "releaseAt = releaseAt(receivedAt, passedAt, false, id)");
    ok(it.pipeline!.releaseAt!.getTime() >= new Date("2026-11-18T17:00:00Z").getTime(), "not before Wed 10:00 MT");
  }
  {
    const store = new FakeStore([item({ receivedAt: T0 })]);
    const { steps: s } = steps({ agreeOnAnswer: async () => ({ decision: { outcome: "pass", answer: B, confirm: false, flag: "solvers_split" }, solves: solves(B), cost: 0.2 }) });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "held", "a flagged pass is held");
    const it = store.items.get("100")!;
    equal(it.pipeline?.heldFor, "praveen", "held");
    ok(it.pipeline?.passedAt instanceof Date, "it passed the checks");
    equal(it.pipeline?.releaseAt, undefined, "a held item gets no releaseAt");
  }
  {
    // a correction after "Fix solution": 1 day, counted from when it came back (the later of receivedAt and the verdict)
    const RECEIVED = new Date("2026-11-02T17:00:00Z");
    const BACK = new Date("2026-11-16T17:00:00Z"); // Mon 10:00 MT
    const PASSED = new Date("2026-11-16T17:30:00Z");
    const store = new FakeStore([changes()]);
    store.items.get("100")!.receivedAt = RECEIVED;
    store.verdicts.set("100", { verdict: "changes", body: "Use Canadian spelling.", createdAt: BACK });
    store.sections.set("100", draft("old").sections);
    const { steps: s } = steps();
    const run = await processItem("100", "r1", deps(store, s, { now: () => PASSED }));
    equal(run.result, "ready", "corrected → ready");
    const at = store.items.get("100")!.pipeline?.releaseAt;
    equal(at?.getTime(), releaseAt(BACK, PASSED, true, "100").getTime(), "corrected: 1 day from the send-back");
    ok(at!.getTime() < releaseAt(BACK, PASSED, false, "100").getTime(), "sooner than the 2-day wait");
  }

  // --- the run hands the batches it touched to the sample step (never in a dry run) ---
  {
    const store = new FakeStore([item({ batchId: "bA" }), item({ itemId: "101", batchId: "bB" }), item({ itemId: "102", batchId: "bA" }), item({ itemId: "103", batchId: undefined })]);
    const { steps: s } = steps();
    await runPipeline({ dryRun: false }, { reader: store, makeRealWriter: () => store, deps: deps(store, s), log: () => {} });
    equal(store.sampled.length, 1, "sample called once after the run");
    deepEqual(store.sampled[0].batchIds.sort(), ["bA", "bB"], "every batch touched, once each");
    deepEqual(store.sampled[0].unbatched, ["103"], "items without a batch passed on");
    const dryStore = new FakeStore([item({ batchId: "bA" })]);
    await runPipeline({ dryRun: true }, { reader: dryStore, makeRealWriter: () => dryStore, deps: deps(dryStore, s), log: () => {} });
    equal(dryStore.sampled.length, 0, "a dry run samples nothing");
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
    equal(store.items.get("101")!.stage, "received", "stage untouched");
    equal(store.items.get("101")!.pipeline?.heldFor, "praveen", "a failed run is in Praveen's queue");
    ok(store.items.get("101")!.pipeline?.flags.includes("step_failed"), "with step_failed");
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

  // --- CRITICAL 1: resume never reuses a stale code intake; an image is never dropped ---
  {
    const img = item({ questionHtml: '<p>See</p><img src="/api/keystone/asset/100/fig.png" alt="f"/>' });
    const store = new FakeStore([img]);
    const { steps: s, calls } = steps();
    const r1 = await processItem("100", "r1", deps(store, s, { assetExists: undefined }));
    equal(r1.result, "failed", "run 1 without an asset folder fails");
    equal(r1.assetsChecked, false, "assetsChecked false");
    const r2 = await processItem("100", "r1", deps(store, s, { assetExists: () => false }));
    equal(r2.result, "item_data", "resume with the folder, file missing → item_data, never ready");
    equal(r2.assetsChecked, true, "checked this time");
    equal(calls.agreeOnAnswer, 0, "never solved");
    equal(store.items.get("100")!.stage, "item_data", "stage item_data");
    equal(store.items.get("100")!.pipeline?.heldFor, undefined, "now waits on the client, not Praveen");
    deepEqual(store.items.get("100")!.pipeline?.flags, ["step_failed"], "flag history kept");
  }
  {
    const img = item({ questionHtml: '<p>See</p><img src="/api/keystone/asset/100/fig.png" alt="f"/>' });
    const store = new FakeStore([img]);
    const { steps: s, calls } = steps();
    const run = await processItem("100", "r1", deps(store, s, { images: async () => { throw new Error("image fig.png of item 100 could not be read"); } }));
    equal(run.result, "failed", "an unreadable image fails the run");
    equal(calls.agreeOnAnswer, 0, "not solved without it");
    equal(store.solutions.length, 0, "nothing written");
  }
  {
    const { folderAssets, noAssets } = await import("./run");
    const { mkdtempSync, writeFileSync, mkdirSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const dir = mkdtempSync(`${tmpdir()}/ks-run-assets-`);
    mkdirSync(`${dir}/100`);
    writeFileSync(`${dir}/100/a.png`, new Uint8Array([1, 2]));
    const fa = folderAssets(dir);
    equal((await fa.images(item(), ["a.png"])).length, 1, "a readable image is returned");
    await assert.rejects(() => fa.images(item(), ["a.png", "gone.png"]), /could not be read/, "an unreadable one throws, never dropped");
    await assert.rejects(() => noAssets.images(item(), ["a.png"]), /no local asset folder/, "no folder: throws for any file");
  }

  // --- 7: a figure the solvers cannot take → held type_not_supported, file recorded ---
  {
    const store = new FakeStore([item({ questionHtml: '<p>See</p><img src="/api/keystone/asset/100/graph.svg" alt="g"/>' })]);
    const { steps: s, calls } = steps();
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "held", "held");
    deepEqual(run.flags, ["type_not_supported"], "type_not_supported");
    deepEqual(run.filesNotSent, ["graph.svg"], "file recorded on the run");
    equal(calls.agreeOnAnswer, 0, "not solved");
  }

  // --- 6: answer to confirm ---
  {
    // In a fresh run intake's no_key finding comes first for choice items, so this is reached on a return
    // (here: sent back, cause "answer") or for a type whose key intake does not require.
    const store = new FakeStore([item({ key: "", keys: {}, stage: "changes_requested", version: 1, releasedVersion: 1 })]);
    store.verdicts.set("100", { verdict: "changes", body: "Check the answer.", createdAt: T0 });
    const { steps: s } = steps({
      classifyCause: async () => okReply({ cause: "answer" as const, why: "" }, 0.01, "m-audit"),
      agreeOnAnswer: async () => ({ decision: { outcome: "pass", answer: B, confirm: true }, solves: solves(B), cost: 0.3 }),
    });
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.result, "held", "held for Praveen");
    deepEqual(run.flags, ["answer_to_confirm"], "answer_to_confirm");
    const it = store.items.get("100")!;
    equal(it.pipeline?.answerToConfirm, true, "answerToConfirm on the item");
    equal(it.pipeline?.heldFor, "praveen", "heldFor");
    equal(it.pipeline?.releaseAt, undefined, "answer_to_confirm is a flag: no release time");
    ok(it.pipeline?.passedAt, "it passed the checks");
  }

  // --- 4: resume after the item changed → superseded before any step runs or is paid for ---
  {
    const store = new FakeStore([item()]);
    const { steps: s, calls } = steps({ writeSolution: async () => { throw new Error("killed"); } });
    const r1 = await processItem("100", "r1", deps(store, s));
    equal(r1.result, "failed", "crashed in write");
    const stepsBefore = store.runs.get("100|r1")!.steps.length;
    store.items.get("100")!.updatedAt = new Date(T0.getTime() + 99);
    const r2 = await processItem("100", "r1", deps(store, s));
    equal(r2.result, "superseded", "superseded on resume");
    equal(calls.writeSolution, 1, "write not retried");
    equal(calls.agreeOnAnswer, 1, "nothing re-run");
    equal(store.runs.get("100|r1")!.steps.length, stepsBefore, "no step added");
  }

  // --- 5b: a crash between our own final write and its bookkeeping ---
  {
    // pass: the solution write landed, then the process died
    const store = new FakeStore([item()]);
    const crashing: Writer = Object.assign(Object.create(store), {
      saveRun: (r: RunDoc) => store.saveRun(r),
      saveSolution: async (...a: Parameters<Writer["saveSolution"]>) => { await store.saveSolution(...a); throw new Error("crash after write"); },
    });
    const { steps: s, calls } = steps();
    const r1 = await processItem("100", "r1", { ...deps(store, s), writer: crashing });
    equal(r1.result, "failed", "crashed");
    ok(store.runs.get("100|r1")!.intent?.writing === "ready", "intent recorded before the write");
    const r2 = await processItem("100", "r1", deps(store, s));
    equal(r2.result, "ready", "own write recognised: ready, not superseded");
    equal(calls.agreeOnAnswer, 1, "nothing re-run");
    equal(store.solutions.length, 1, "one solution");
  }
  {
    // item_data: the stage write landed, the suggestion did not
    const store = new FakeStore([item({ questionHtml: "" })]);
    let fail = true;
    const crashing: Writer = Object.assign(Object.create(store), {
      saveRun: (r: RunDoc) => store.saveRun(r),
      flagItemData: (...a: Parameters<Writer["flagItemData"]>) => store.flagItemData(...a),
      suggest: async (...a: Parameters<Writer["suggest"]>) => { if (fail) { fail = false; throw new Error("crash before suggest"); } return store.suggest(...a); },
    });
    const r1 = await processItem("100", "r1", { ...deps(store, steps().steps), writer: crashing });
    equal(r1.result, "failed", "crashed before the suggestion");
    const r2 = await processItem("100", "r1", { ...deps(store, steps().steps), writer: crashing });
    equal(r2.result, "item_data", "finished as item_data");
    deepEqual(store.suggestions.map((x) => x.kind), ["items_need_data"], "suggested exactly once");
    const r3 = await processItem("100", "r1", { ...deps(store, steps().steps), writer: crashing });
    equal(r3.result, "item_data", "finished run returned as is");
    equal(store.suggestions.length, 1, "no second suggestion");
  }
  {
    // someone else produced the same version: not ours → superseded
    const store = new FakeStore([item()]);
    const crashing: Writer = Object.assign(Object.create(store), {
      saveRun: (r: RunDoc) => store.saveRun(r),
      saveSolution: async () => { throw new Error("crash before write"); },
    });
    const { steps: s } = steps();
    await processItem("100", "r1", { ...deps(store, s), writer: crashing });
    const i = store.items.get("100")!;
    Object.assign(i, { stage: "ready", version: 1, updatedAt: new Date() });
    store.solutions.push({ itemId: "100", version: 1, sections: [], runId: "someone-else" });
    const r2 = await processItem("100", "r1", deps(store, s));
    equal(r2.result, "superseded", "another writer's version is not taken as ours");
  }

  // --- 11: after an answer-dispute restart no further correction is granted ---
  {
    const store = new FakeStore([item()]);
    let calcs = 0, works = 0;
    const { steps: s, calls } = steps({
      calcCheck: async () => (calcs++ === 0 ? [{ code: "calc_mismatch", detail: "off" } as CalcFinding] : []),
      workingCheck: async () => (works++ === 0 ? { findings: [{ check: "working", code: "answer_disputed", detail: "no" }], cost: 0.05, model: "m" } : { findings: [], cost: 0.05, model: "m" }),
      rulesAudit: async () => auditFail(9),
    });
    const run = await processItem("100", "r1", deps(store, s));
    equal(calls.agreeOnAnswer, 2, "restarted once");
    equal(run.corrections, 1, "corrections stays 1");
    deepEqual(run.flags, ["second_failure"], "the audit failure after the restart is a second failure");
    equal(calls.writeSolution, 3, "write, correction, fresh write after restart — no further correction");
  }

  // --- 10: --only that names nothing ---
  assert.throws(() => parseArgs(["--only", " , "]), /names no item/, "empty --only rejected");

  // --- 12: what Castle Rock sees for an item held before a solution exists ---
  {
    // visibleStage maps only "ready" to "drafting": a held item in Received shows as Received (with Evelyn).
    equal(visibleStage("received", "reviewer"), "received", "held Received item: Castle Rock sees Received (gap noted in the report)");
    equal(visibleStage("drafting", "reviewer"), "drafting", "held Drafting item: Castle Rock sees Drafting");
    equal(visibleStage("ready", "tech"), "drafting", "ready shows as Drafting");
  }

  // --- round 2, I3b: a person's identical change is never taken for this run's own write ---
  for (const kind of ["item_data", "key_query"] as const) {
    const store = new FakeStore([item(kind === "item_data" ? { questionHtml: "" } : {})]);
    const C: Answer = { kind: "choice", letters: ["C"] };
    const throwing: Writer = Object.assign(Object.create(store), {
      saveRun: (r: RunDoc) => store.saveRun(r),
      flagItemData: async () => { throw new Error("write died"); },
      raiseKeyQuery: async () => { throw new Error("write died"); },
    });
    const { steps: s } = steps({ agreeOnAnswer: async () => ({ decision: { outcome: "key_query", answer: C }, solves: solves(C), cost: 0.2 }) });
    const r1 = await processItem("100", "r1", { ...deps(store, s), writer: throwing });
    equal(r1.result, "failed", `${kind}: the write threw`);
    equal(store.runs.get("100|r1")!.intent?.writing, kind, `${kind}: intent was saved`);
    // a person makes the same stage change (same version, new updatedAt)
    Object.assign(store.items.get("100")!, { stage: kind, updatedAt: new Date(T0.getTime() + 500) });
    const r2 = await processItem("100", "r1", deps(store, s));
    equal(r2.result, "superseded", `${kind}: a person's identical change → superseded`);
    equal(store.suggestions.length, 0, `${kind}: zero suggestions`);
    ok(!r2.ownWriteLanded, `${kind}: not marked as ours`);
  }
  {
    // the genuine case for a key query: the write landed (marker set), the suggestion did not
    const store = new FakeStore([item()]);
    const C: Answer = { kind: "choice", letters: ["C"] };
    let fail = true;
    const crashing: Writer = Object.assign(Object.create(store), {
      saveRun: (r: RunDoc) => store.saveRun(r),
      raiseKeyQuery: (...a: Parameters<Writer["raiseKeyQuery"]>) => store.raiseKeyQuery(...a),
      suggest: async (...a: Parameters<Writer["suggest"]>) => { if (fail) { fail = false; throw new Error("crash"); } return store.suggest(...a); },
    });
    const { steps: s } = steps({ agreeOnAnswer: async () => ({ decision: { outcome: "key_query", answer: C }, solves: solves(C), cost: 0.2 }) });
    await processItem("100", "r1", { ...deps(store, s), writer: crashing });
    const r2 = await processItem("100", "r1", { ...deps(store, s), writer: crashing });
    equal(r2.result, "key_query", "own key query write recognised");
    deepEqual(store.suggestions.map((x) => x.kind), ["keys_queried"], "suggested once");
  }
  // --- round 2, minor 4: our write landed, then a person changed the item → superseded, history truthful ---
  {
    const store = new FakeStore([item({ questionHtml: "" })]);
    const crashing: Writer = Object.assign(Object.create(store), {
      saveRun: (r: RunDoc) => store.saveRun(r),
      flagItemData: (...a: Parameters<Writer["flagItemData"]>) => store.flagItemData(...a),
      suggest: async () => { throw new Error("crash"); },
    });
    await processItem("100", "r1", { ...deps(store, steps().steps), writer: crashing });
    Object.assign(store.items.get("100")!, { stage: "received", updatedAt: new Date(T0.getTime() + 900) }); // re-sent by the client
    const r2 = await processItem("100", "r1", deps(store, steps().steps));
    equal(r2.result, "superseded", "superseded");
    equal(r2.ownWriteLanded, true, "own write recorded as landed");
    equal(r2.intent?.writing, "item_data", "intent kept");
    equal(store.suggestions.length, 0, "no suggestion for a changed item");
  }

  // --- round 2, R7: images by allow list and by content ---
  {
    const SVG = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    const BYTES: Record<string, Uint8Array> = {
      png: PNG,
      jpg: new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10]),
      gif: new TextEncoder().encode("GIF89a\x01\x00"),
      webp: new Uint8Array([0x52, 0x49, 0x46, 0x46, 4, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]),
    };
    const withFile = (file: string) => item({ questionHtml: `<p>See</p><img src="/api/keystone/asset/100/${file}" alt="f"/>` });
    const refusedCases: [string, Uint8Array][] = [["fig.avif", PNG], ["fig.jfif", BYTES.jpg], ["fig", PNG], ["fig.svg", SVG], ["fig.png", SVG], ["FIG.PNG", BYTES.gif.slice(0, 2)]];
    for (const [file, data] of refusedCases) {
      const store = new FakeStore([withFile(file)]);
      const { steps: s, calls } = steps();
      const run = await processItem("100", "r1", deps(store, s, { images: async (_i, files) => files.map(() => ({ mime: "image/png", data })) }));
      equal(run.result, "held", `${file}: held`);
      deepEqual(run.flags, ["type_not_supported"], `${file}: type_not_supported`);
      ok(run.filesNotSent?.includes(file), `${file}: named on the run`);
      equal(calls.agreeOnAnswer, 0, `${file}: 0 solves`);
      equal(store.solutions.length, 0, `${file}: nothing written`);
    }
    for (const [ext, data] of Object.entries(BYTES)) {
      const file = `fig.${ext.toUpperCase()}`;
      const store = new FakeStore([withFile(file)]);
      let sent: ModelImage[] = [];
      const { steps: s, calls } = steps({
        agreeOnAnswer: async (_it, images) => { sent = images; return { decision: { outcome: "pass", answer: B, confirm: false }, solves: solves(B), cost: 0.2 }; },
      });
      const run = await processItem("100", "r1", deps(store, s, { images: async (_i, files) => files.map(() => ({ mime: "image/png", data })) }));
      equal(run.result, "ready", `${file}: solved`);
      equal(calls.agreeOnAnswer, 1, `${file}: one solve`);
      equal(sent.length, 1, `${file}: the figure was sent`);
      equal(sent[0].mime, sniffImage(data), `${file}: sent as what its bytes are`);
    }
    equal(sniffImage(BYTES.jpg), "image/jpeg", "jpeg sniffed");
    equal(sniffImage(BYTES.webp), "image/webp", "webp sniffed");
    equal(sniffImage(SVG), null, "svg text is no allowed image");
    // a package resource the question does not show: figure-like holds, audio passes through (recorded)
    {
      const store = new FakeStore([item({ qti: { apip: "", metadata: "", resources: ["resources/talk.mp3"] } })]);
      const { steps: s, calls } = steps();
      const run = await processItem("100", "r1", deps(store, s));
      equal(run.result, "ready", "audio resource passes");
      deepEqual(run.filesNotSent, ["talk.mp3"], "and is recorded");
      equal(calls.agreeOnAnswer, 1, "solved");
      const st2 = new FakeStore([item({ qti: { apip: "", metadata: "", resources: ["resources/extra.avif"] } })]);
      const r2 = await processItem("100", "r1", deps(st2, steps().steps));
      deepEqual(r2.flags, ["type_not_supported"], "figure-like resource holds");
    }
  }

  // --- C1: only the files the QUESTION shows ever reach a model; the client's solution images never do ---
  {
    const SOL_HTML = '<p>Their working</p><img src="/api/keystone/asset/100/sol_answer.png" alt="x = 4"/>';
    const APIP = '<assessmentItem><itemBody><p>See</p><img src="resources/q.png"/></itemBody><modalFeedback identifier="solution"><img src="resources/sol_answer.png"/></modalFeedback></assessmentItem>';
    const probe = (p: Partial<ItemDoc> = {}) => item({
      questionHtml: '<p>See the graph.</p><img src="/api/keystone/asset/100/q.png" alt="graph"/>',
      castleRockSolutionHtml: SOL_HTML,
      qti: { apip: APIP, metadata: "", resources: ["resources/q.png", "resources/sol_answer.png"] },
      ...p,
    });
    const watch = () => {
      const seen = { asked: [] as string[][], intake: [] as number[], solve: [] as number[] };
      const { steps: s, calls } = steps({
        intakeModel: async (_it, images) => { seen.intake.push(images.length); return { complete: true, missing: [] }; },
        agreeOnAnswer: async (_it, images) => { seen.solve.push(images.length); return { decision: { outcome: "pass", answer: B, confirm: false }, solves: solves(B), cost: 0.2 }; },
      });
      const images = async (_i: ItemDoc, files: string[]) => { seen.asked.push([...files]); return files.map(() => ({ mime: "image/png", data: PNG })); };
      return { seen, s, calls, images };
    };
    // fresh
    {
      const store = new FakeStore([probe()]);
      const w = watch();
      const run = await processItem("100", "r1", deps(store, w.s, { images: w.images }));
      equal(run.result, "ready", "C1 probe: solved");
      deepEqual(w.seen.asked, [["q.png"]], "C1 probe: only the question's own file is read for the models");
      deepEqual(w.seen.intake, [1], "C1 probe: intake model got exactly one image");
      deepEqual(w.seen.solve, [1], "C1 probe: solvers got exactly one image");
      deepEqual(run.filesNotSent, ["sol_answer.png"], "C1 probe: the solution image is recorded as not sent");
    }
    // only images are in the client's solution: none sent, still solved
    {
      const store = new FakeStore([probe({ questionHtml: "<p>Which value is right?</p>", qti: { apip: APIP, metadata: "", resources: ["resources/sol_answer.png"] } })]);
      const w = watch();
      const run = await processItem("100", "r1", deps(store, w.s, { images: w.images }));
      equal(run.result, "ready", "C1 solution-only images: still solved");
      deepEqual(w.seen.asked, [], "C1 solution-only images: no file read for a model");
      deepEqual(w.seen.solve, [0], "C1 solution-only images: zero images to the solvers");
      deepEqual(w.seen.intake, [0], "C1 solution-only images: zero images to intake");
      deepEqual(run.filesNotSent, ["sol_answer.png"], "C1 solution-only images: recorded");
    }
    // a figure-like solution file (svg) does not hold: it is answer-side
    {
      const apip = APIP.replace("sol_answer.png", "sol.svg");
      const store = new FakeStore([probe({ castleRockSolutionHtml: '<img src="/api/keystone/asset/100/sol.svg"/>', qti: { apip, metadata: "", resources: ["resources/q.png", "resources/sol.svg"] } })]);
      const w = watch();
      const run = await processItem("100", "r1", deps(store, w.s, { images: w.images }));
      equal(run.result, "ready", "C1 svg in their solution: not held");
      deepEqual(w.seen.solve, [1], "C1 svg in their solution: only q.png sent");
    }
    // changes (cause answer → solved again), owner rewrite (cause answer), key-right: the same one image
    {
      const store = new FakeStore([probe({ stage: "changes_requested", version: 1, releasedVersion: 1, evelynAnswer: "B" })]);
      store.verdicts.set("100", { verdict: "changes", body: "The answer is wrong.", createdAt: T0 });
      const w = watch();
      const s2 = { ...w.s, classifyCause: async () => okReply({ cause: "answer" as const, why: "" }, 0.01, "m-audit") };
      const run = await processItem("100", "r1", deps(store, s2, { images: w.images }));
      equal(run.mode, "changes", "C1 changes: mode");
      deepEqual(w.seen.asked, [["q.png"]], "C1 changes: only q.png read");
      deepEqual(w.seen.solve, [1], "C1 changes: solvers got one image");
    }
    {
      const store = new FakeStore([probe({ stage: "ready", version: 1, releasedVersion: 0, evelynAnswer: "B", pipeline: { flags: ["owner_sent_back"], heldFor: "praveen", fixNote: "The answer is wrong." } as PipelineDoc })]);
      store.sections.set("100", draft().sections);
      const w = watch();
      const s2 = { ...w.s, classifyCause: async () => okReply({ cause: "answer" as const, why: "" }, 0.01, "m-audit") };
      const run = await processItem("100", "r1", deps(store, s2, { images: w.images }));
      equal(run.mode, "owner", "C1 owner: mode");
      deepEqual(w.seen.asked, [["q.png"]], "C1 owner: only q.png read");
      deepEqual(w.seen.solve, [1], "C1 owner: solvers got one image");
    }
    {
      const later = new Date(T0.getTime() + 5000);
      const store = new FakeStore([probe({ stage: "drafting", keyQuery: { ourAnswer: "C", workingHtml: "", raisedAt: T0, answeredAt: later, reviewerReason: "Key is right" } })]);
      store.verdicts.set("100", { verdict: "key_right", body: "Key is right", createdAt: later });
      const w = watch();
      const run = await processItem("100", "r1", deps(store, w.s, { images: w.images }));
      equal(run.mode, "key_right", "C1 key_right: mode");
      deepEqual(w.seen.asked, [["q.png"]], "C1 key_right: only q.png read");
      deepEqual(w.seen.solve, [1], "C1 key_right: solvers got one image");
    }
  }

  // --- I2: a new run re-checks that the item is in a state the run takes, and as it was selected ---
  {
    const cases: [string, Partial<ItemDoc>][] = [
      ["in_review", { stage: "in_review", version: 1, releasedVersion: 1 }],
      ["approved", { stage: "approved", version: 1, releasedVersion: 1 }],
      ["delivered", { stage: "delivered", version: 1, releasedVersion: 1 }],
      ["rejected", { stage: "rejected" }],
      ["item_data", { stage: "item_data" }],
      ["key_query", { stage: "key_query", keyQuery: { ourAnswer: "C", workingHtml: "", raisedAt: T0 } }],
      ["ready without the flag", { stage: "ready", version: 1, pipeline: { flags: ["no_agreement"], heldFor: "praveen" } }],
      ["drafting, key query unanswered", { stage: "drafting", keyQuery: { ourAnswer: "C", workingHtml: "", raisedAt: T0 } }],
    ];
    for (const [name, p] of cases) {
      const store = new FakeStore([item(p)]);
      const { steps: s, calls } = steps();
      const before = structuredClone(store.items.get("100"));
      const run = await processItem("100", "r1", deps(store, s));
      equal(run.result, "superseded", `I2 ${name}: superseded`);
      equal(run.cost, 0, `I2 ${name}: nothing paid`);
      equal(Object.values(calls).filter((v) => typeof v === "number").reduce((a, b) => a + (b as number), 0), 0, `I2 ${name}: no step called`);
      equal(store.itemWrites, 0, `I2 ${name}: no item write`);
      equal(store.runs.size, 0, `I2 ${name}: no run record`);
      deepEqual(store.items.get("100"), before, `I2 ${name}: item untouched`);
    }
    // startedFrom from selection must match on a new run
    {
      const store = new FakeStore([item()]);
      const { steps: s, calls } = steps();
      const run = await processItem("100", "r1", deps(store, s), { startedFrom: { stage: "received", version: 0, updatedAt: new Date(T0.getTime() - 1) } });
      equal(run.result, "superseded", "I2: changed since selection → superseded");
      equal(calls.intakeModel + calls.agreeOnAnswer, 0, "I2: nothing run");
      const again = await processItem("100", "r1", deps(store, s), { startedFrom: { stage: "received", version: 0, updatedAt: T0 } });
      equal(again.result, "ready", "I2: as selected → runs");
    }
  }

  // --- I3: a held send-back Praveen sent back with his note: both notes reach the author, the result waits for him ---
  {
    const store = new FakeStore([item({ stage: "changes_requested", version: 1, releasedVersion: 1, evelynAnswer: "B", pipeline: { flags: ["step_failed", "owner_sent_back"], heldFor: "praveen", fixNote: "Round to 2 decimals." } as PipelineDoc })]);
    store.verdicts.set("100", { verdict: "changes", body: "Show the unit conversion.", createdAt: T0 });
    store.sections.set("100", draft().sections);
    const { steps: s, calls } = steps();
    const run = await processItem("100", "r1", deps(store, s));
    equal(run.mode, "changes", "I3 note: changes mode");
    const opts = calls.writeOpts[0] as { fixNote?: string };
    ok(/Show the unit conversion/.test(opts.fixNote ?? "") && /Round to 2 decimals/.test(opts.fixNote ?? ""), `I3 note: both notes to the author (${opts.fixNote})`);
    equal(run.result, "held", "I3 note: the rewrite waits for his look");
    ok(store.items.get("100")!.pipeline!.flags.includes("owner_rewrite"), "I3 note: owner_rewrite");
    ok(!store.items.get("100")!.pipeline!.flags.includes("owner_sent_back"), "I3 note: his send-back flag is consumed");
    equal(store.lessons[0]?.note, "Show the unit conversion.", "I3 note: the lesson is the reviewer's note only");
  }

  // --- I8: a model-written topic is saved only when it is safe for the client to read ---
  {
    const { acceptTopic } = await import("./run");
    const cases: [string, string | undefined][] = [
      ["  Quadratic functions  ", "Quadratic functions"],
      ["x".repeat(80), "x".repeat(80)],
      ["x".repeat(81), undefined],
      ["Line one\nLine two", undefined],
      ["<b>Vectors</b>", undefined],
      ["Rates & ratios", undefined],
      ["Topic chosen by GPT-6", undefined],
      ["Written by an AI model", undefined],
      ["Solved with Claude Opus", undefined],
      ["", undefined],
    ];
    for (const [raw, want] of cases) equal(acceptTopic(raw), want, `I8 acceptTopic(${JSON.stringify(raw)})`);
    for (const [topic, saved] of [["Kinematics", "Kinematics"], ["Generated by an AI model", undefined], ["y".repeat(200), undefined]] as const) {
      // FakeStore.saveSolution does not apply `topic`: record what the run passed to the writer.
      class TopicStore extends FakeStore {
        passed: string | undefined = "unset";
        async saveSolution(id: string, x: Parameters<Writer["saveSolution"]>[1], e: Expect) { this.passed = x.topic; return super.saveSolution(id, x, e); }
      }
      const store = new TopicStore([item({ topic: "" })]);
      const { steps: s } = steps({ writeSolution: async () => okReply({ ...draft(), topic }, 0.1, "m-author") });
      const run = await processItem("100", "r1", deps(store, s));
      equal(run.result, "ready", `I8 ${topic.slice(0, 20)}: solved`);
      equal(store.passed, saved, `I8 ${topic.slice(0, 20)}: topic saved only when safe`);
    }
  }

  // --- I6 / I7: a bound on re-spend; transient step failures are retried within it ---
  {
    const quiet = { log: () => {} };
    const transientWrite = () => steps({ writeSolution: async () => ({ ok: false, reason: "transport", detail: "anthropic HTTP 529: overloaded", cost: 0.01, model: "m-author", transient: true }) as ModelReply<Draft> });
    // a transient failure holds with step_failed, recorded on the step, and is retried by the next run
    {
      const store = new FakeStore([item()]);
      const { steps: s, calls } = transientWrite();
      const env = { reader: store, makeRealWriter: () => store, deps: deps(store, s), ...quiet };
      const one = await runPipeline({ dryRun: false, runId: "inv-1" }, env);
      equal(one.runs[0].result, "held", "I7: transient write failure holds");
      ok(one.runs[0].flags.includes("step_failed"), "I7: step_failed");
      ok(one.runs[0].steps.find((x) => x.step === "write")?.transient, "I7: the step records transient");
      equal(one.runs[0].failedAttempts, 1, "I6: one failed attempt counted");
      await runPipeline({ dryRun: false, runId: "inv-2" }, env);
      await runPipeline({ dryRun: false, runId: "inv-3" }, env);
      equal(calls.writeSolution, 3, "I7: retried on each of the next runs");
      const four = await runPipeline({ dryRun: false, runId: "inv-4" }, env);
      equal(four.runs.length, 0, "I6: the fourth invocation does not take it");
      ok(four.skipped.some((x) => x.itemId === "100" && x.why === "attempt limit reached"), "I6: listed as attempt limit reached");
      equal(calls.writeSolution, 3, "I6: nothing more spent");
      const it = store.items.get("100")!;
      equal(it.pipeline?.heldFor, "praveen", "I6: plain hold for Praveen");
      equal(it.pipeline?.heldWhy, "Three attempts failed", "I6: heldWhy");
      ok(it.pipeline?.flags.includes("step_failed"), "I6: flags kept");
      // named with --only: retried
      const named = await runPipeline({ dryRun: false, runId: "inv-5", only: ["100"] }, env);
      equal(named.runs.length, 1, "I6: --only retries it");
      // after the item changes: retried
      store.items.get("100")!.updatedAt = new Date(T0.getTime() + 777);
      const changed = await runPipeline({ dryRun: false, runId: "inv-6" }, env);
      equal(changed.runs.length, 1, "I6: a changed item is taken again");
    }
    // a non-transient step failure hold is not retried automatically
    {
      const store = new FakeStore([item()]);
      const { steps: s, calls } = steps({ writeSolution: async () => ({ ok: false, reason: "shape", detail: "bad json", cost: 0.01, model: "m-author" }) as ModelReply<Draft> });
      const env = { reader: store, makeRealWriter: () => store, deps: deps(store, s), ...quiet };
      await runPipeline({ dryRun: false, runId: "n-1" }, env);
      const two = await runPipeline({ dryRun: false, runId: "n-2" }, env);
      equal(calls.writeSolution, 1, "I7: a non-transient failure is not retried by the next run");
      ok(two.skipped.some((x) => /held at its last run/.test(x.why)), "I7: skipped as held");
    }
    // a run that keeps failing (resumed under the same id) is capped too
    {
      const store = new FakeStore([item()]);
      const { steps: s, calls } = steps({ writeSolution: async () => { throw new Error("adapter crashed"); } });
      const env = { reader: store, makeRealWriter: () => store, deps: deps(store, s), ...quiet };
      for (let k = 0; k < 5; k++) await runPipeline({ dryRun: false }, env);
      equal(calls.writeSolution, 3, "I6: a failing run resumed every invocation stops after three");
      equal(store.items.get("100")!.pipeline?.heldWhy, "Three attempts failed", "I6: and is held for Praveen");
    }
    // --max-cost: stops taking new items once reached and says what was left
    {
      const store = new FakeStore([item(), item({ itemId: "101", order: 2 }), item({ itemId: "102", order: 3 })]);
      const { steps: s, calls } = steps();
      const lines: string[] = [];
      const out = await runPipeline({ dryRun: false, maxCost: 0.5 }, { reader: store, makeRealWriter: () => store, deps: deps(store, s), concurrency: 1, log: (l) => lines.push(l) });
      equal(out.runs.length, 2, "I6: two items run (0.40 + 0.40 crosses 0.50)");
      deepEqual(out.leftOver, ["102"], "I6: the third is not started");
      equal(calls.agreeOnAnswer, 2, "I6: nothing spent on it");
      ok(lines.some((l) => /spend cap \$0\.50 reached/.test(l) && /102/.test(l)), "I6: says what was left");
      ok(out.skipped.some((x) => x.itemId === "102"), "I6: listed as skipped");
      equal(parseArgs(["--max-cost", "3.5"]).maxCost, 3.5, "I6: --max-cost parsed");
      assert.throws(() => parseArgs(["--max-cost", "0"]), /positive/, "I6: --max-cost must be positive");
      equal(parseArgs([]).maxCost, undefined, "I6: default applies inside runPipeline");
    }
    // the pipeline's own lock: one writing run at a time, released in finally; a dry run takes none
    {
      const { withPipelineLock, PIPELINE_LOCK, PIPELINE_LOCK_TTL_MS } = await import("./run");
      const held = new Map<string, string>();
      const calls2: string[] = [];
      const lock = {
        acquire: async (name: string, owner: string, _now: Date, ttl: number) => { calls2.push(`acquire ${name} ${ttl}`); if (held.has(name)) return false; held.set(name, owner); return true; },
        release: async (name: string, owner: string) => { calls2.push(`release ${name}`); if (held.get(name) === owner) held.delete(name); },
      };
      equal(String(PIPELINE_LOCK) === "keystone-release", false, "I6: a different lock name from the release job");
      equal(PIPELINE_LOCK_TTL_MS, 2 * 60 * 60 * 1000, "I6: expiry 2 h");
      let inner: unknown;
      const first = withPipelineLock(false, async () => { inner = await withPipelineLock(false, async () => "second ran", lock); return "first ran"; }, lock);
      equal(await first, "first ran", "I6: the first run runs");
      equal(inner, "busy", "I6: a second writing run finds the lock held");
      equal(held.size, 0, "I6: released after the run");
      await assert.rejects(() => withPipelineLock(false, async () => { throw new Error("boom"); }, lock), /boom/, "I6: an error propagates");
      equal(held.size, 0, "I6: released in finally after an error");
      calls2.length = 0;
      equal(await withPipelineLock(true, async () => "dry", lock), "dry", "I6: a dry run runs");
      deepEqual(calls2, [], "I6: a dry run takes no lock");
    }
  }

  // --- M4 / C2(b): a changes-mode rewrite keeps sample, timerReleasedAt and an uncleared question_resent hold ---
  {
    const released = new Date(T0.getTime() - 1000);
    const store = new FakeStore([item({ stage: "changes_requested", version: 1, releasedVersion: 1, evelynAnswer: "B", pipeline: { flags: ["sample"], runId: "r0", timerReleasedAt: released } })]);
    store.verdicts.set("100", { verdict: "changes", body: "Tidy the wording.", createdAt: T0 });
    store.sections.set("100", draft().sections);
    const run = await processItem("100", "r1", deps(store, steps().steps));
    const p = store.items.get("100")!.pipeline!;
    ok(p.flags.includes("sample"), "M4: sample kept on the rewrite");
    equal(p.timerReleasedAt?.getTime(), released.getTime(), "M4: timerReleasedAt kept on the rewrite");
    equal(run.result, "held", "M4: a sample item's correction waits for Praveen (a flag is never released by the timer)");
    const st2 = new FakeStore([item({ stage: "changes_requested", version: 1, releasedVersion: 1, evelynAnswer: "B", pipeline: { flags: ["question_resent"], heldFor: "praveen", runId: "r0" } as PipelineDoc })]);
    st2.verdicts.set("100", { verdict: "changes", body: "Tidy the wording.", createdAt: T0 });
    st2.sections.set("100", draft().sections);
    const r2 = await processItem("100", "r1", deps(st2, steps().steps));
    equal(r2.result, "held", "C2(b): the corrected version of a re-sent question waits for his look");
    ok(st2.items.get("100")!.pipeline!.flags.includes("question_resent"), "C2(b): question_resent carried");
    equal(st2.items.get("100")!.pipeline!.releaseAt, undefined, "C2(b): no release time");
    const st3 = new FakeStore([item({ stage: "changes_requested", version: 1, releasedVersion: 1, evelynAnswer: "B", pipeline: { flags: ["question_resent"], runId: "r0" } })]);
    st3.verdicts.set("100", { verdict: "changes", body: "Tidy the wording.", createdAt: T0 });
    st3.sections.set("100", draft().sections);
    const r3 = await processItem("100", "r1", deps(st3, steps().steps));
    equal(r3.result, "ready", "C2(b): once he cleared the hold, the flag is history and not carried");
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
    items.push(
      item({ itemId: "9", stage: "drafting", keyQuery: { ourAnswer: "C", workingHtml: "", raisedAt: T0, answeredAt: T0 } }),
      item({ itemId: "10", stage: "drafting", keyQuery: { ourAnswer: "C", workingHtml: "", raisedAt: T0, answeredAt: T0 } }),
      item({ itemId: "11", stage: "drafting", keyQuery: { ourAnswer: "C", workingHtml: "", raisedAt: T0, answeredAt: T0 } }),
    );
    const runs = new Map<string, RunDoc>([
      ["5", { result: "ready", startedAt: new Date(T0.getTime() + 1) } as RunDoc],
      ["8", { result: "held", startedAt: T0, startedFrom: { stage: "received", version: 0, updatedAt: T0 } } as RunDoc],
      ["9", { result: "failed", startedAt: new Date(T0.getTime() + 1) } as RunDoc],
      ["10", { startedAt: new Date(T0.getTime() + 1) } as RunDoc],
      ["11", { result: "superseded", startedAt: new Date(T0.getTime() + 1) } as RunDoc],
    ]);
    const sel = selectItems(items, runs, {});
    deepEqual(sel.take.map((i) => i.itemId), ["1", "3", "4", "9", "10", "11"], "received, changes_requested, answered key queries with no decided run since");
    deepEqual(
      [...sel.take, ...sel.skipped, ...sel.refused].map((x) => x.itemId).sort(),
      items.map((i) => i.itemId).sort(),
      "every candidate is taken, skipped or refused: none dropped silently",
    );
    ok(sel.skipped.every((x) => x.why.length > 0) && sel.refused.every((x) => x.why.length > 0), "each with a reason");
    ok(sel.skipped.some((x) => x.itemId === "5" && /already run/.test(x.why)), "decided key query says so");
    deepEqual(selectItems(items, runs, { only: ["9"] }).take.map((i) => i.itemId), ["9"], "a failed key-right run can be named");
    const limited = selectItems(items, runs, { limit: 2 });
    ok(limited.skipped.some((x) => /--limit/.test(x.why)), "over the limit is listed");
    const named = selectItems(items, runs, { only: ["2", "7", "8"] });
    deepEqual(named.take.map((i) => i.itemId), ["8"], "a held item can be named");
    deepEqual(named.refused.map((r) => r.itemId), ["2", "7"], "in_review and approved refused");
    ok(/approved/.test(named.refused[1].why), "says why");
    const asRec = selectItems(items, runs, { only: ["2"], asReceived: true });
    deepEqual(asRec.take.map((i) => [i.itemId, i.stage]), [["2", "received"]], "as-received overlay");
    equal(limited.take.length, 2, "limit");
  }

  console.log("run.test ok");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
