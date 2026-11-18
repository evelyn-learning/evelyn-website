/**
 * The solutions pipeline run (spec §4): every item in Received, items whose key query the
 * reviewer answered "The key is right", and items sent back as "Solution changes".
 *
 *   KEYSTONE_PIPELINE_LIVE=1 KEYSTONE_MONGODB_URI=<uri> \
 *   npx tsx apps/marketing/scripts/keystone-pipeline.ts [options]
 *
 * Options:
 *   --only id,id        just these items (an approved / delivered one is refused)
 *   --batch <batchId>   just this batch
 *   --limit <n>         at most n items
 *   --dry-run           no database writes at all; prints what each item would become
 *   --as-received       dry run only, with --only: treat the named items as Received
 *   --run-id <id>       continue / name this run (default: each item's unfinished run, else a new one)
 *   --max-cost <usd>    stop starting new items once this invocation has spent this much (default 25); prints what was left
 *   --assets-dir <dir>  local asset folder laid out <dir>/<itemId>/<file> (read-only)
 *   --pull-assets       first rsync the selected items' assets from the box into --assets-dir
 *                       (default <tmp>/keystone-pipeline-assets); a read-only pull
 * Without an asset folder the intake image check is SKIPPED (said loudly, recorded on each run)
 * and an item whose question has images is not solved.
 *
 * Stops at any time; started again it continues each item's run without redoing finished steps.
 * A writing run takes the lock "keystone-pipeline" (expires after 2 h; released when the run ends): a second
 * writing run started meanwhile exits doing nothing. A dry run takes no lock. An item whose last three attempts
 * failed (since it last changed) is not taken again (held for Praveen) unless named with --only.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { KEYSTONE_DB } from "../src/lib/keystone/config";
import { closeKs, type RunDoc } from "../src/lib/keystone/db";
import type { Actor } from "../src/lib/keystone/store";
import { runKeyCheck } from "../src/lib/keystone/pipeline/models";
import {
  asReceivedReader, defaultRules, folderAssets, mongoReader, mongoWriter, noAssets, parseArgs, realSteps, runPipeline, selectItems, withPipelineLock,
} from "../src/lib/keystone/pipeline/run";
import { acquireLock, releaseLock } from "../src/lib/keystone/pipeline/release";

const EVELYN: Actor = { username: "pipeline", name: "Evelyn Learning", role: "evelyn" };
const BOX_ASSETS = "root@85.239.239.134:/root/keystone-data/assets";

/** Host and port of a mongodb URI, without credentials or options. */
function hostOf(uri: string): string {
  const m = /^mongodb(?:\+srv)?:\/\/(?:[^@/]*@)?([^/?]+)/.exec(uri);
  return m ? m[1] : "(unreadable URI)";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  // A dry run opens the database read-only, before the first connection: no collection or index is
  // created on connect and any model write throws (db.ts connectOptions / blockWrites).
  if (args.dryRun) process.env.KEYSTONE_READONLY = "1";
  else if (process.env.KEYSTONE_READONLY === "1") throw new Error("Refusing to run: KEYSTONE_READONLY=1 is set for a writing run (use --dry-run).");
  const uri = process.env.KEYSTONE_MONGODB_URI;
  if (!uri) throw new Error("Refusing to run: set KEYSTONE_MONGODB_URI explicitly.");
  console.log(`Database: ${KEYSTONE_DB} on ${hostOf(uri)}${args.dryRun ? " (DRY RUN: read-only connection, nothing is written)" : " (WRITING)"}`);
  if (process.env.KEYSTONE_PIPELINE_LIVE !== "1") throw new Error("Refusing to run: model calls are off (set KEYSTONE_PIPELINE_LIVE=1).");
  // Names missing variables, never their values. A missing key for a role every item uses stops the run; a missing
  // tie-break key (used only when the first two solvers disagree) is said loudly and the run goes on: such an item is held.
  for (const line of runKeyCheck()) console.log(`!! ${line}`);

  const base = mongoReader();
  const reader = args.asReceived && args.only ? asReceivedReader(base, args.only) : base;

  let assetsDir = args.assetsDir;
  if (args.pullAssets) {
    assetsDir ??= path.join(tmpdir(), "keystone-pipeline-assets");
    // The same selection the run makes, to know which items' assets to pull.
    const candidates = await reader.candidates({ only: args.only, batch: args.batch });
    const latest = new Map<string, RunDoc>();
    for (const c of candidates) {
      const r = await reader.latestRun(c.itemId);
      if (r) latest.set(c.itemId, r);
    }
    const ids = selectItems(candidates, latest, args).take.map((i) => i.itemId);
    for (const id of ids) {
      if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error(`unexpected item id ${JSON.stringify(id)}`);
      const into = path.join(assetsDir, id);
      mkdirSync(into, { recursive: true });
      const r = spawnSync("rsync", ["-a", "--exclude=player/", "--", `${BOX_ASSETS}/${id}/`, `${into}/`], { stdio: ["ignore", "inherit", "inherit"] });
      if (r.status !== 0) console.log(`!! assets for ${id} could not be pulled (rsync exit ${r.status}); its image check will report missing images`);
    }
    console.log(`Assets: pulled ${ids.length} item folder(s) into ${assetsDir}`);
  }
  if (assetsDir) console.log(`Assets: read from ${assetsDir}`);
  else console.log("!! NO LOCAL ASSET FOLDER: the intake image check is SKIPPED (assetsChecked:false on each run, resumed runs included) and every item whose question has images ends \"failed\", unsolved. Use --assets-dir or --pull-assets.");
  const assets = assetsDir ? folderAssets(assetsDir) : noAssets;

  const locked = await withPipelineLock(
    args.dryRun,
    () => runPipeline(args, {
      reader: base,
      makeRealWriter: () => mongoWriter(EVELYN),
      deps: { steps: realSteps(), rules: defaultRules(), ...assets },
    }),
    { acquire: acquireLock, release: releaseLock },
  );
  if (locked === "busy") {
    console.log("pipeline: another writing pipeline run holds the lock; nothing done");
    await closeKs();
    return;
  }
  const out = locked;

  if (out.dry) {
    console.log("\n=== What each item would become (dry run) ===");
    for (const a of out.dry.actions) {
      if (a.action === "saveSolution") {
        const d = a.detail as { evelynAnswer: string; version: number; pipeline: { flags: string[] }; sections: { kind: string; md: string }[] };
        console.log(`\n--- ${a.itemId}: solution v${d.version}, stage ready (hidden), answer ${d.evelynAnswer}${d.pipeline.flags.length ? `, held [${d.pipeline.flags.join(", ")}]` : ""}`);
        for (const s of d.sections) console.log(`\n## ${s.kind}\n${s.md}`);
      } else {
        console.log(`\n--- ${a.itemId}: ${a.action} ${JSON.stringify(a.detail)}`);
      }
    }
  }

  // Summary
  const byResult = new Map<string, number>();
  const byFlag = new Map<string, number>();
  for (const r of out.runs) {
    byResult.set(r.result ?? "unfinished", (byResult.get(r.result ?? "unfinished") ?? 0) + 1);
    for (const f of r.flags) byFlag.set(f, (byFlag.get(f) ?? 0) + 1);
  }
  const total = out.runs.reduce((s, r) => s + r.cost, 0);
  console.log("\n=== Summary ===");
  console.log("item       result          cost      flags");
  for (const r of out.runs) console.log(`${r.itemId.padEnd(10)} ${(r.result ?? "").padEnd(15)} $${r.cost.toFixed(4).padStart(8)} ${r.flags.join(", ")}${r.error ? `  (${r.error})` : ""}`);
  // Why each held or failed item stopped: every step that did not pass, with its findings (internal, for the owner).
  const stopped = out.runs.filter((r) => r.flags.length || r.result === "failed" || r.result === "held");
  if (stopped.length) {
    console.log("\n=== Why held ===");
    for (const r of stopped) {
      console.log(`\n${r.itemId}: ${r.result ?? "unfinished"} [${r.flags.join(", ")}] corrections ${r.corrections}`);
      for (const st of r.steps) {
        const o = (st.output && typeof st.output === "object" ? st.output : {}) as { findings?: { check?: string; code?: string; ruleId?: string; section?: string; quote?: string; detail?: string }[]; failed?: string };
        const fs = Array.isArray(o.findings) ? o.findings : [];
        if (st.ok && !fs.length && !o.failed) continue;
        console.log(`  ${st.key ?? st.step}: ${st.ok ? "ran" : "DID NOT PASS"}${o.failed ? ` — could not run: ${String(o.failed).slice(0, 300)}` : ""}`);
        for (const f of fs) console.log(`    - ${[f.check, f.code, f.ruleId, f.section].filter(Boolean).join(" / ")}: ${String(f.detail ?? "").slice(0, 300)}${f.quote ? ` | quote: "${String(f.quote).slice(0, 160)}"` : ""}`);
      }
    }
  }
  // Where the money went: cost per step kind and per model, over every run of this invocation.
  const byStep = new Map<string, { n: number; cost: number }>();
  const byModel = new Map<string, number>();
  for (const r of out.runs) for (const st of r.steps) {
    const e = byStep.get(st.step) ?? { n: 0, cost: 0 };
    e.n += 1; e.cost += st.cost ?? 0; byStep.set(st.step, e);
    const solves = st.output && typeof st.output === "object" ? (st.output as { solves?: { model?: string; cost?: number }[] }).solves : undefined;
    if (Array.isArray(solves) && solves.length) for (const sv of solves) byModel.set(sv.model ?? "?", (byModel.get(sv.model ?? "?") ?? 0) + (sv.cost ?? 0));
    else byModel.set(st.model ?? "(none)", (byModel.get(st.model ?? "(none)") ?? 0) + (st.cost ?? 0));
  }
  console.log("\n=== Cost by step ===");
  for (const [k, e] of [...byStep].sort((x, y) => y[1].cost - x[1].cost)) console.log(`${k.padEnd(10)} calls ${String(e.n).padStart(3)}  $${e.cost.toFixed(4)}  (${total ? Math.round((100 * e.cost) / total) : 0}%)`);
  console.log("=== Cost by model ===");
  for (const [k, c] of [...byModel].sort((x, y) => y[1] - x[1])) console.log(`${k.padEnd(22)} $${c.toFixed(4)}  (${total ? Math.round((100 * c) / total) : 0}%)`);
  console.log(`\nresults: ${[...byResult].map(([k, v]) => `${k} ${v}`).join(", ") || "none"}`);
  console.log(`flags:   ${[...byFlag].map(([k, v]) => `${k} ${v}`).join(", ") || "none"}`);
  console.log(`refused: ${out.refused.length}, skipped: ${out.skipped.length}`);
  console.log(`total cost: $${total.toFixed(4)} over ${out.runs.length} item(s)`);
  if (out.leftOver.length) console.log(`spend cap reached: not started: ${out.leftOver.join(", ")}`);
  // Each new written solution is also sorted: needs an animation, or not (with the reason Castle Rock reads).
  // Never fails the run; KEYSTONE_ANIM_TRIAGE=off skips it.
  if (!args.dryRun && process.env.KEYSTONE_ANIM_TRIAGE !== "off") {
    try {
      const { needsDecision, recordTriage } = await import("../src/lib/keystone/animreview/store");
      const { triageItem } = await import("../src/lib/keystone/animated/triage");
      const { ks } = await import("../src/lib/keystone/db");
      const { Item, Solution } = await ks();
      const ran = new Set(out.runs.map((r) => r.itemId));
      const text = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      console.log("\n=== Animation needed? ===");
      for (const itemId of (await needsDecision()).filter((id) => ran.has(id))) {
        const item = await Item.findOne({ itemId }).select("subject course itemType questionHtml version").lean();
        const sol = item?.version ? await Solution.findOne({ itemId, version: item.version }).select("sections").lean() : null;
        if (!item || !sol) continue;
        const t = await triageItem({ subject: item.subject || "", course: item.course || "", itemType: item.itemType, questionText: text(item.questionHtml || ""), hasImages: /<img/i.test(item.questionHtml || ""), written: sol.sections.map((x) => `## ${x.kind}\n${x.md}`).join("\n\n") });
        if (t.ok) await recordTriage(itemId, t.animate, t.reason);
        console.log(`${itemId}: ${t.ok ? `${t.animate ? "animate" : "no animation"} · ${t.reason}` : `not decided (${t.error})`}  ($${t.cost.toFixed(4)})`);
      }
    } catch (e) {
      console.log(`animation sorting skipped: ${(e as Error).message}`);
    }
  }
  await closeKs();
}

main().catch(async (e) => {
  console.error((e as Error).message);
  await closeKs();
  process.exit(1);
});
