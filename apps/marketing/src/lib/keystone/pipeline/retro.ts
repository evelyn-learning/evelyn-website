// The retro-audit (spec §6 and §8): runs the automatic checks over solutions already written, as a report
// for Praveen. Default: the working check and the full rules audit on the solutions in review. With a rule
// id: that one rule across every solution not yet approved, and the approved / delivered ones that would
// fail it listed apart (a rule made after they were approved; they are never changed).
//
// It reads items and solutions and writes NOTHING: it takes a reader and no writer, and the script opens the
// database read-only (KEYSTONE_READONLY=1) before connecting. The checks are injected (tests call no model).
// The report is internal: model ids appear in its cost line only.
// No `next/*` imports: this runs from tsx scripts on a laptop.

import { STAGES, type Stage } from "../config";
import { ks, type ItemDoc, type SolutionDoc } from "../db";
import { answerForm, parseKey, typedAnswer, type Answer } from "./answers";
import type { CheckResult, Finding } from "./checks";
import { redact } from "./models";
import type { Draft, Rule } from "./write";

export type RetroArgs = { rule?: string; stage?: Stage; only?: string[]; limit?: number; out?: string };

/** Command-line options of scripts/keystone-retro-audit.ts. Throws on anything unknown. */
export function parseRetroArgs(argv: string[]): RetroArgs {
  const a: RetroArgs = {};
  const value = (i: number, name: string) => {
    const v = argv[i + 1];
    if (v === undefined || v.startsWith("--")) throw new Error(`${name} needs a value`);
    return v;
  };
  for (let i = 0; i < argv.length; i++) {
    const o = argv[i];
    switch (o) {
      case "--rule": {
        const v = value(i++, o).trim();
        if (!/^R-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) throw new Error(`--rule takes a rule id like R-units (got "${v}")`);
        a.rule = v;
        break;
      }
      case "--stage": {
        const v = value(i++, o).trim();
        if (!(STAGES as readonly string[]).includes(v)) throw new Error(`--stage must be one of ${STAGES.join(", ")} (got "${v}")`);
        a.stage = v as Stage;
        break;
      }
      case "--only":
        a.only = value(i++, o).split(",").map((s) => s.trim()).filter(Boolean);
        if (!a.only.length) throw new Error("--only names no item");
        break;
      case "--limit": {
        const n = Number(value(i++, o));
        if (!Number.isInteger(n) || n < 1) throw new Error("--limit needs a whole number of at least 1");
        a.limit = n;
        break;
      }
      case "--out": a.out = value(i++, o); break;
      default: throw new Error(`unknown option ${o}`);
    }
  }
  return a;
}

/** Everything the retro-audit reads. There is no writer. */
export interface RetroReader {
  /** Items named by `only`, else in `stages` (undefined: every stage); sorted by order. */
  items(q: { only?: string[]; stages?: Stage[] }): Promise<ItemDoc[]>;
  solution(itemId: string, version: number): Promise<Pick<SolutionDoc, "itemId" | "version" | "sections"> | null>;
}

/** The two model-backed checks (checks.ts workingCheck / rulesAudit), injected. */
export type RetroChecks = {
  working(item: ItemDoc, draft: Draft, answer: Answer): Promise<CheckResult>;
  audit(item: ItemDoc, course: string, draft: Draft, rules: Rule[]): Promise<CheckResult>;
};

export type RetroDeps = { reader: RetroReader; checks: RetroChecks; rules: Rule[]; concurrency?: number; now?: () => Date };

const FINISHED: Stage[] = ["approved", "delivered"];
const DEFAULT_STAGE: Stage = "in_review";

export type RetroSelection = { take: ItemDoc[]; apart: string[]; skipped: { itemId: string; why: string }[] };

/**
 * Which solutions are audited. Default: stage in_review (or --stage). With --rule: every stage (or --stage),
 * approved / delivered ones reported apart. --only narrows either; a named item outside the selection, or
 * not found, is listed with why. Items with no solution (version 0) are listed, not audited.
 */
export function selectRetro(items: ItemDoc[], args: Pick<RetroArgs, "rule" | "stage" | "only" | "limit">): RetroSelection {
  const out: RetroSelection = { take: [], apart: [], skipped: [] };
  const stages: Stage[] | null = args.stage ? [args.stage] : args.rule ? null : [DEFAULT_STAGE];
  const byId = new Map(items.map((i) => [i.itemId, i]));
  for (const id of args.only ?? []) if (!byId.has(id)) out.skipped.push({ itemId: id, why: "not found" });
  for (const it of items) {
    const named = !!args.only?.includes(it.itemId);
    if (args.only && !named) continue;
    if (stages && !stages.includes(it.stage)) {
      if (named) out.skipped.push({ itemId: it.itemId, why: `stage ${it.stage}, not ${stages.join(" / ")}` });
      continue;
    }
    if (!(it.version > 0)) {
      out.skipped.push({ itemId: it.itemId, why: "no solution yet" });
      continue;
    }
    out.take.push(it);
  }
  if (args.limit !== undefined && out.take.length > args.limit) {
    for (const it of out.take.slice(args.limit)) out.skipped.push({ itemId: it.itemId, why: `over --limit ${args.limit}` });
    out.take = out.take.slice(0, args.limit);
  }
  if (args.rule) out.apart = out.take.filter((i) => FINISHED.includes(i.stage)).map((i) => i.itemId);
  return out;
}

/**
 * The answer the solution was written to, as an Answer: the agreed answer stored on the item (evelynAnswer,
 * else the released answer; both are stored as run.ts answerText writes them: letters "A,C", a number,
 * labels joined "; ", or text), read in the item's answer form; else the client's key; else null.
 */
export function storedAnswer(item: ItemDoc): { answer: Answer; from: "agreed answer" | "released answer" | "key" } | null {
  const agreed = (item.evelynAnswer ?? "").trim();
  const released = (item.releasedAnswer ?? "").trim();
  const text = agreed || released;
  if (text) {
    const from = agreed ? ("agreed answer" as const) : ("released answer" as const);
    const form = answerForm(item);
    const letters = (t: string) => [...new Set(t.split(/[,\s]+/).map((x) => x.trim().toUpperCase()).filter(Boolean))].sort();
    switch (form?.form) {
      case "choice-one":
      case "choice-many":
        return { answer: { kind: "choice", letters: letters(text) }, from };
      case "number":
      case "typed":
        return { answer: typedAnswer(text), from };
      case "labels":
        return { answer: { kind: "labels", values: text.split("; ").map((v) => v.trim()).filter(Boolean) }, from };
      case "text":
        return { answer: { kind: "text", value: text }, from };
      default:
        return { answer: /^[A-Z](,[A-Z])*$/i.test(text) ? { kind: "choice", letters: letters(text) } : typedAnswer(text), from };
    }
  }
  const key = parseKey(item);
  return key ? { answer: key, from: "key" } : null;
}

export type CheckName = "working" | "audit";
export type ItemResult = {
  itemId: string;
  course: string;
  itemType: string;
  stage: Stage;
  version: number;
  /** --rule: approved or delivered, reported apart. */
  apart: boolean;
  findings: Finding[];
  couldNotRun: { check: CheckName; why: string }[];
  notes: string[];
  noAnswer: boolean;
  /** --rule: the audit found the rule does not apply to this solution. */
  notApplicable: boolean;
  cost: number;
};
export type RetroReport = {
  at: Date;
  rule?: string;
  stage?: Stage;
  items: ItemResult[];
  skipped: { itemId: string; why: string }[];
  cost: number;
  models: string[];
};

/** rulesAudit's failure when every verdict is "na": with one rule, that is "the rule does not apply". */
const ALL_NA = /^audit marked every rule not applicable$/;

/** Runs the selected audits, `concurrency` (default 4) items at a time. Reads only. */
export async function runRetro(args: RetroArgs, deps: RetroDeps): Promise<RetroReport> {
  const now = deps.now ? deps.now() : new Date();
  let rules = deps.rules;
  if (args.rule) {
    const r = deps.rules.find((x) => x.id === args.rule);
    if (!r) throw new Error(`rule ${args.rule} is not in the rule file (rules.md); known: ${deps.rules.map((x) => x.id).join(", ")}`);
    rules = [r]; // the reply must then carry a verdict for exactly this id
  }
  const stages = args.stage ? [args.stage] : args.rule ? undefined : [DEFAULT_STAGE];
  const candidates = await deps.reader.items(args.only ? { only: args.only } : { stages });
  const sel = selectRetro(candidates, args);
  const skipped = [...sel.skipped];
  const models = new Set<string>();
  const results = new Map<string, ItemResult>();

  const auditOne = async (item: ItemDoc) => {
    const res: ItemResult = {
      itemId: item.itemId, course: item.course ?? "", itemType: item.itemType ?? "", stage: item.stage, version: item.version,
      apart: sel.apart.includes(item.itemId), findings: [], couldNotRun: [], notes: [], noAnswer: false, notApplicable: false, cost: 0,
    };
    const sol = await deps.reader.solution(item.itemId, item.version);
    if (!sol || !sol.sections?.length) {
      skipped.push({ itemId: item.itemId, why: `solution v${item.version} not found` });
      return;
    }
    const draft: Draft = { topic: item.topic ?? "", sections: sol.sections.map((s) => ({ kind: s.kind, md: s.md })) };
    const run = async (check: CheckName, fn: () => Promise<CheckResult>) => {
      try {
        const r = await fn();
        res.cost += r.cost || 0;
        if (r.model) models.add(r.model);
        if ("failed" in r) {
          if (check === "audit" && args.rule && ALL_NA.test(r.failed)) {
            res.notApplicable = true;
            res.notes.push(`rule ${args.rule} does not apply to this solution`);
          } else res.couldNotRun.push({ check, why: r.failed });
        } else res.findings.push(...r.findings);
      } catch (e) {
        res.couldNotRun.push({ check, why: e instanceof Error ? e.message : String(e) });
      }
    };
    if (!args.rule) {
      const a = storedAnswer(item);
      if (!a) {
        res.noAnswer = true;
        res.notes.push("no answer on record: working check skipped");
      } else {
        if (a.from === "key") res.notes.push("no stored answer: working checked against the key");
        await run("working", () => deps.checks.working(item, draft, a.answer));
      }
    }
    const course = (item.course ?? "").trim();
    if (!course) res.couldNotRun.push({ check: "audit", why: "no course on record" });
    else await run("audit", () => deps.checks.audit(item, course, draft, rules));
    results.set(item.itemId, res);
  };

  const queue = [...sel.take];
  const worker = async () => {
    for (let it = queue.shift(); it; it = queue.shift()) await auditOne(it);
  };
  await Promise.all(Array.from({ length: Math.max(1, deps.concurrency ?? 4) }, worker));

  // Model ids stay in the cost line: scrubbed from every reason (and keys, as everywhere).
  const scrub = (text: string) => {
    let out = redact(text);
    for (const m of models) if (m) out = out.split(m).join("[model]");
    return out.replace(/\s+/g, " ").trim().slice(0, 400);
  };
  const items = sel.take.flatMap((i) => results.get(i.itemId) ?? []).map((r) => ({ ...r, couldNotRun: r.couldNotRun.map((c) => ({ ...c, why: scrub(c.why) })) }));
  return {
    at: now, ...(args.rule ? { rule: args.rule } : {}), ...(args.stage || !args.rule ? { stage: args.stage ?? DEFAULT_STAGE } : {}),
    items, skipped, cost: items.reduce((s, r) => s + r.cost, 0), models: [...models].sort(),
  };
}

// --- the report ---

const oneLine = (s: string) => String(s ?? "").replace(/\s+/g, " ").trim();
const cell = (s: string) => oneLine(s).replace(/\|/g, "\\|");
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

function findingLine(f: Finding): string {
  const head = `${f.check}${f.ruleId ? ` ${f.ruleId}` : ` ${f.code}`}${f.section ? ` (${f.section})` : ""}`;
  return `- ${head}: ${f.quote ? `"${oneLine(f.quote)}" — ` : ""}${oneLine(f.detail)}`;
}

function itemBlock(r: ItemResult): string[] {
  const lines = [`### ${r.itemId} · ${r.course || "no course"} · ${r.itemType || "?"} · ${r.stage} · v${r.version}`, ""];
  for (const f of r.findings) lines.push(findingLine(f));
  for (const c of r.couldNotRun) lines.push(`- check could not run: ${c.check} — ${c.why}`);
  for (const n of r.notes) lines.push(`- ${n}`);
  if (!r.findings.length && !r.couldNotRun.length) lines.push("- no findings");
  lines.push("");
  return lines;
}

/** The report as Markdown. */
export function renderRetro(rep: RetroReport): string {
  const what = rep.rule ? `rule ${rep.rule} only` : "working check + full rules audit";
  const where = rep.stage ? `stage ${rep.stage}` : "every stage";
  const withFindings = rep.items.filter((r) => r.findings.length);
  const couldNot = rep.items.filter((r) => r.couldNotRun.length);
  const perRule = new Map<string, number>();
  for (const r of rep.items) for (const f of r.findings) {
    const k = f.ruleId ?? `${f.check}: ${f.code}`;
    perRule.set(k, (perRule.get(k) ?? 0) + 1);
  }
  const L: string[] = [
    "# Keystone retro-audit",
    "",
    `${rep.at.toISOString()} · ${what} · ${where}. Internal report: nothing was changed on any item.`,
    "",
    "## Summary",
    "",
    "| | |",
    "|---|---|",
    `| Items audited | ${rep.items.length} |`,
    `| Items with findings | ${withFindings.length} |`,
    `| Items where a check could not run | ${couldNot.length} |`,
  ];
  if (!rep.rule) L.push(`| Items with no answer on record (working check skipped) | ${rep.items.filter((r) => r.noAnswer).length} |`);
  if (rep.rule) {
    L.push(`| Rule did not apply | ${rep.items.filter((r) => r.notApplicable).length} |`);
    L.push(`| Approved or delivered that would fail | ${rep.items.filter((r) => r.apart && r.findings.length).length} |`);
  }
  L.push(`| Not audited | ${rep.skipped.length} |`, "");
  L.push("### Findings per rule", "");
  if (perRule.size) {
    L.push("| Rule | Findings |", "|---|---|");
    for (const [k, n] of [...perRule].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) L.push(`| ${cell(k)} | ${n} |`);
  } else L.push("None.");
  L.push("", `Cost: $${rep.cost.toFixed(4)}${rep.models.length ? ` (models: ${rep.models.join(", ")})` : ""}`, "");

  const main = rep.items.filter((r) => !r.apart);
  L.push(rep.rule ? "## Not yet approved" : "## Items", "");
  if (main.length) for (const r of main) L.push(...itemBlock(r));
  else L.push("None.", "");

  if (rep.rule) {
    const apart = rep.items.filter((r) => r.apart);
    const show = apart.filter((r) => r.findings.length || r.couldNotRun.length);
    const passing = apart.length - show.length;
    L.push(`## Approved or delivered that would fail ${rep.rule}`, "", "Listed for Praveen; nothing is changed on them.", "");
    for (const r of show) L.push(...itemBlock(r));
    if (!show.length) L.push("None.", "");
    L.push(`${plural(passing, "approved or delivered solution passes", "approved or delivered solutions pass")} ${rep.rule}.`, "");
  }

  if (rep.skipped.length) {
    L.push("## Not audited", "");
    for (const s of rep.skipped) L.push(`- ${s.itemId}: ${oneLine(s.why)}`);
    L.push("");
  }
  return L.join("\n");
}

// --- the database (read-only) ---

/** Reads the Keystone database. Only finds: no write is reachable from here. */
export function mongoRetroReader(): RetroReader {
  return {
    items: async ({ only, stages }) => {
      const { Item } = await ks();
      const filter: Record<string, unknown> = only ? { itemId: { $in: only } } : stages ? { stage: { $in: stages } } : {};
      return Item.find(filter).sort({ order: 1, itemId: 1 }).lean<ItemDoc[]>();
    },
    solution: async (itemId, version) => {
      const { Solution } = await ks();
      return Solution.findOne({ itemId, version }).select("itemId version sections").lean<Pick<SolutionDoc, "itemId" | "version" | "sections">>();
    },
  };
}

/** Host and port of a mongodb URI, without credentials or options. */
export function hostOf(uri: string): string {
  const m = /^mongodb(?:\+srv)?:\/\/(?:[^@/]*@)?([^/?]+)/.exec(uri);
  return m ? m[1] : "(unreadable URI)";
}
