/**
 * Authors animated solutions with model calls: for each item, reads the item and its latest written solution from
 * the database (READ-ONLY, always), pulls the question's images, calls authorItem (one call, the checks, at most
 * one correction call) and writes the source folder the build script takes.
 *
 *   KEYSTONE_PIPELINE_LIVE=1 KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:2710 \
 *   npx tsx scripts/keystone-animated-author.ts <itemId>… [--src <animated-src dir>] [--dry-run] [--force]
 *     [--examples <dir>] [--playbook <file>] [--assets-dir <dir>] [--max-cost <usd>]
 *
 * --src         where item folders are written: <src>/<itemId>/{spec.json, figure.svg, board.js?, written.md,
 *               question-assets/}. Default: the laptop's animated-src. An existing item folder is refused
 *               unless --force. An item that fails its checks twice is written to <src>/_failed/<itemId>/ (a draft
 *               for the hand author), never to <src>/<itemId>/.
 * --dry-run     no model call: prints, per item, what would be sent (prompt sizes, examples, images) and writes nothing.
 * --examples    the finished items shown as examples (default: the laptop's animated-src).
 * --playbook    house rules added to the guide (Parts 1 and 5 of the playbook); skipped, said, when the file is absent.
 * --assets-dir  local asset folder <dir>/<itemId>/<file>. Without it the images of the named items are pulled
 *               from the box (rsync, a read) into <tmp>/keystone-animated-assets.
 * --max-cost    stop starting new items once this run has spent this much (default 6).
 * Every item appends one line to <src>/author-log.jsonl. Keys come from the environment, as for the pipeline
 * (ANTHROPIC_API_KEY); nothing here records a voice.
 */
import { spawnSync } from "node:child_process";
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AuthorAsset, AuthorExample, AuthorInput, AuthorResult } from "../src/lib/keystone/animated/author";
import type { ItemDoc } from "../src/lib/keystone/db";

const LAPTOP_SRC = "/Users/luke/Dev/evelynlearning/docs/whitelabel/castle-rock/keystone/animated-src";
const LAPTOP_PLAYBOOK = "/Users/luke/Dev/evelynlearning/docs/whitelabel/castle-rock/enhanced-solution-playbook.md";
const BOX_ASSETS = "root@85.239.239.134:/root/keystone-data/assets";
/** Shown first when the subject matches (the reviewer's reference items), then the rest by id. */
const PREFERRED = ["234035", "286312", "193246", "93953", "135676", "98186"];
const IMAGE_MIME: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp" };
const AUTHORABLE_STAGES = ["approved", "in_review"];

const argv = process.argv.slice(2);
const VALUED = new Set(["src", "examples", "playbook", "assets-dir", "max-cost"]);
const has = (n: string) => argv.includes(`--${n}`);
const arg = (n: string) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const ids = argv.filter((a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1].startsWith("--") && VALUED.has(argv[i - 1].slice(2))));
const safeName = (s: string) => s.replace(/[^A-Za-z0-9._-]/g, "_");
const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
const usd = (n: number) => `$${n.toFixed(4)}`;

/** The finished items of a source folder, preferred ones first. Folders without the three texts are skipped. */
function loadExamples(dir: string): AuthorExample[] {
  if (!existsSync(dir)) return [];
  const names = readdirSync(dir).filter((n) => /^\d+$/.test(n));
  names.sort((a, b) => (PREFERRED.indexOf(a) + 1 || 99) - (PREFERRED.indexOf(b) + 1 || 99) || Number(a) - Number(b));
  const out: AuthorExample[] = [];
  for (const id of names) {
    const f = (n: string) => path.join(dir, id, n);
    if (!existsSync(f("spec.json")) || !existsSync(f("figure.svg")) || !existsSync(f("written.md"))) continue;
    try {
      const spec = readFileSync(f("spec.json"), "utf8");
      const written = readFileSync(f("written.md"), "utf8");
      // The solution part only: the question is in the example's spec, and the stored HTML of a question is long.
      const at = written.indexOf("## APPROVED WRITTEN SOLUTION");
      out.push({ itemId: id, subject: String((JSON.parse(spec) as { subject?: string }).subject ?? ""), spec, svg: readFileSync(f("figure.svg"), "utf8"), boardJs: existsSync(f("board.js")) ? readFileSync(f("board.js"), "utf8") : undefined, written: at >= 0 ? written.slice(at) : written });
    } catch {
      // an unreadable example is not an example
    }
  }
  return out;
}

/** Parts 1 and 5 of the playbook (the rules and "write for the ear"); the rest is process. */
function houseRules(file: string): string | undefined {
  if (!existsSync(file)) return undefined;
  const text = readFileSync(file, "utf8");
  const part = (n: string) => new RegExp(`^## Part ${n} [\\s\\S]*?(?=^## Part |(?![\\s\\S]))`, "m").exec(text)?.[0].trim() ?? "";
  const out = [part("1"), part("5")].filter(Boolean).join("\n\n");
  return out || undefined;
}

/** written.md: the question as stored, the options and the solution's sections (the numbers check reads all of it). */
function writtenFile(item: ItemDoc, version: number, sections: { kind: string; md: string }[]): string {
  return [
    `# Item ${item.itemId} — ${item.subject} — ${item.course}`,
    "",
    `Stage: ${item.stage} · solution version ${version} · key ${JSON.stringify(item.key ?? "")} · our answer ${item.evelynAnswer} · item type ${item.itemType}`,
    "",
    "## QUESTION (as shown; html)",
    "",
    item.questionHtml,
    "",
    "",
    "### Options",
    JSON.stringify((item.options ?? []).map((o) => ({ label: o.label, html: o.html, md: o.md })), null, 1),
    "",
    "## APPROVED WRITTEN SOLUTION",
    "",
    ...sections.flatMap((s) => [`### ${s.kind}`, "", s.md.trim(), ""]),
  ].join("\n");
}

type Row = { itemId: string; result: AuthorResult["result"] | "skipped" | "dry-run"; cost: number; note: string };

async function main() {
  // Before the first connection: no collection or index is created on connect and every model write throws.
  process.env.KEYSTONE_READONLY = "1";
  const dry = has("dry-run");
  const force = has("force");
  if (!ids.length || ids.some((id) => !/^\d+$/.test(id))) throw new Error("Usage: keystone-animated-author.ts <itemId>… [--src dir] [--dry-run] [--force] [--examples dir] [--playbook file] [--assets-dir dir] [--max-cost usd]");
  const src = path.resolve(arg("src") ?? LAPTOP_SRC);
  const maxCost = Number(arg("max-cost") ?? "6");
  if (!Number.isFinite(maxCost) || maxCost <= 0) throw new Error("--max-cost must be a positive number of dollars");

  const { KEYSTONE_DB } = await import("../src/lib/keystone/config");
  const { explicitTarget } = await import("../src/lib/keystone/dbtarget");
  console.log(`${explicitTarget(process.env, KEYSTONE_DB).line} (read-only connection, nothing is written to it)`);
  const { MODEL_FOR, assertKeys } = await import("../src/lib/keystone/pipeline/models");
  if (!dry) {
    if (process.env.KEYSTONE_PIPELINE_LIVE !== "1") throw new Error("Refusing to run: model calls are off (set KEYSTONE_PIPELINE_LIVE=1), or use --dry-run.");
    assertKeys(["animator"]); // names the missing variable, never a value
  }
  const { authorItem, buildPrompt, AUTHOR_MAX_TOKENS } = await import("../src/lib/keystone/animated/author");
  const { questionAsText } = await import("../src/lib/keystone/pipeline/intake");
  const { shownImages } = await import("../src/lib/keystone/pipeline/run");
  const { ks, closeKs } = await import("../src/lib/keystone/db");

  const here = path.dirname(fileURLToPath(import.meta.url));
  const guide = readFileSync(path.join(here, "..", "src", "lib", "keystone", "animated", "AUTHORING.md"), "utf8");
  const playbook = arg("playbook") ?? LAPTOP_PLAYBOOK;
  const rules = houseRules(playbook);
  const examples = loadExamples(path.resolve(arg("examples") ?? LAPTOP_SRC));
  console.log(`Model: ${MODEL_FOR.animator.model} ($${MODEL_FOR.animator.pricePerMTokIn} in / $${MODEL_FOR.animator.pricePerMTokOut} out per million tokens; output limit ${AUTHOR_MAX_TOKENS})`);
  console.log(`Guide: AUTHORING.md ${kb(guide.length)}; house rules: ${rules ? `${kb(rules.length)} from ${playbook}` : `none (${playbook} not found)`}; examples to choose from: ${examples.map((e) => e.itemId).join(", ") || "NONE"}`);
  console.log(`Output: ${src}${dry ? " (DRY RUN: no model call, nothing written)" : ""}`);

  const assetsDir = path.resolve(arg("assets-dir") ?? path.join(tmpdir(), "keystone-animated-assets"));
  const rows: Row[] = [];
  let spent = 0;
  const log = (line: Record<string, unknown>) => {
    mkdirSync(src, { recursive: true });
    appendFileSync(path.join(src, "author-log.jsonl"), `${JSON.stringify({ at: new Date().toISOString(), ...line })}\n`);
  };

  try {
    const { Item, Solution } = await ks();
    for (const itemId of ids) {
      console.log(`\n=== ${itemId} ===`);
      const skip = (note: string) => {
        console.log(`  skipped: ${note}`);
        rows.push({ itemId, result: "skipped", cost: 0, note });
      };
      if (!dry && spent >= maxCost) { skip(`spend cap reached (${usd(spent)} of $${maxCost})`); continue; }
      const dest = path.join(src, itemId);
      if (!dry && existsSync(dest) && !force) { skip(`${dest} exists (use --force to write over it)`); continue; }

      const item = await Item.findOne({ itemId }).lean<ItemDoc>();
      if (!item) { skip("no such item in the database"); continue; }
      if (!AUTHORABLE_STAGES.includes(item.stage)) { skip(`stage is "${item.stage}": only an approved or in-review written solution is animated`); continue; }
      const sol = await Solution.findOne({ itemId }).sort({ version: -1 }).lean<{ version: number; sections: { kind: string; md: string }[] }>();
      if (!sol?.sections?.length) { skip("no written solution"); continue; }
      if (!item.evelynAnswer?.trim()) { skip("no approved answer on the item"); continue; }

      // The question's own images, the same names the pipeline's solvers get.
      const shown = shownImages(item);
      if (shown.length && !arg("assets-dir") && !dry) {
        const into = path.join(assetsDir, safeName(itemId));
        mkdirSync(into, { recursive: true });
        const r = spawnSync("rsync", ["-a", "--exclude=player/", "--exclude=animated/", "--", `${BOX_ASSETS}/${itemId}/`, `${into}/`], { stdio: ["ignore", "inherit", "inherit"] });
        if (r.status !== 0) console.log(`  !! assets could not be pulled (rsync exit ${r.status})`);
      }
      const assets: AuthorAsset[] = [];
      const missing: string[] = [];
      for (const name of shown) {
        const file = path.join(assetsDir, safeName(itemId), safeName(path.basename(name)));
        const mime = IMAGE_MIME[path.extname(name).slice(1).toLowerCase()];
        if (existsSync(file) && statSync(file).isFile()) assets.push(mime ? { name, mime, data: new Uint8Array(readFileSync(file)) } : { name });
        else { missing.push(name); assets.push({ name }); }
      }
      if (missing.length && !dry) { skip(`its question image(s) could not be read: ${missing.join(", ")} (not authored without them)`); continue; }

      const sections = sol.sections.map((s) => ({ kind: s.kind, md: s.md }));
      const written = writtenFile(item, sol.version, sections);
      const input: AuthorInput = {
        itemId,
        subject: item.subject,
        course: item.course,
        itemType: item.itemType,
        questionHtml: item.questionHtml,
        questionText: questionAsText(item),
        options: (item.options ?? []).map((o) => ({ label: o.label, html: o.html })),
        assets,
        // The solution's sections. The checks add the stored question and the options, so they read what written.md holds.
        writtenMd: sections.map((s) => `### ${s.kind}\n\n${s.md.trim()}`).join("\n\n"),
        answer: item.evelynAnswer,
        key: item.key || undefined,
      };
      const deps = { guide, rules, examples };
      const prompt = buildPrompt(input, deps);
      const sent = assets.filter((a) => a.data);
      const named = assets.filter((a) => !a.data);
      console.log(`  ${item.subject} · ${item.course} · ${item.itemType} · stage ${item.stage} · solution v${sol.version} · answer ${item.evelynAnswer}`);
      console.log(`  prompt: system ${kb(prompt.system.length)} in ${prompt.systemParts.length} cached part(s) [${prompt.systemParts.map((p) => kb(p.length)).join(", ")}], user ${kb(prompt.user.length)} (about ${Math.round((prompt.system.length + prompt.user.length) / 3.6 / 100) / 10}k tokens of text)`);
      console.log(`  examples: ${prompt.examples.join(", ") || "none"}; images sent: ${sent.map((a) => `${a.name} (${kb(a.data!.length)})`).join(", ") || "none"}${named.length ? `; named only${dry ? " (a dry run does not pull images)" : ""}: ${named.map((a) => a.name).join(", ")}` : ""}`);
      if (dry) {
        console.log(`  would send to ${MODEL_FOR.animator.model}; user message begins:\n${prompt.user.slice(0, 600).replace(/^/gm, "    | ")}\n    | …`);
        rows.push({ itemId, result: "dry-run", cost: 0, note: `${kb(prompt.system.length + prompt.user.length)} of prompt` });
        continue;
      }

      const r = await authorItem(input, deps);
      spent += r.cost;
      const failed = r.result === "failed";
      const out = failed ? path.join(src, "_failed", itemId) : dest;
      if (r.files) {
        if (failed) rmSync(out, { recursive: true, force: true });
        mkdirSync(path.join(out, "question-assets"), { recursive: true });
        writeFileSync(path.join(out, "spec.json"), r.files.specJson);
        writeFileSync(path.join(out, "figure.svg"), r.files.figureSvg);
        if (r.files.boardJs) writeFileSync(path.join(out, "board.js"), r.files.boardJs);
        else rmSync(path.join(out, "board.js"), { force: true });
        writeFileSync(path.join(out, "written.md"), written);
        for (const a of assets) {
          const from = path.join(assetsDir, safeName(itemId), safeName(path.basename(a.name)));
          if (existsSync(from)) copyFileSync(from, path.join(out, "question-assets", safeName(path.basename(a.name))));
        }
      }
      for (const c of r.calls) console.log(`  ${c.kind}: ${c.model || "(no reply)"} in ${c.tokens.in} (cache write ${c.tokens.cacheWrite}, read ${c.tokens.cacheRead}) out ${c.tokens.out} ${usd(c.cost)}${c.ms ? ` ${Math.round(c.ms / 1000)} s` : ""}${c.ok ? "" : " FAILED"}`);
      if (r.firstFindings.length) console.log(`  first reply, ${r.firstFindings.length} finding(s):\n${r.firstFindings.map((f) => `    - ${f}`).join("\n")}`);
      if (failed) console.log(`  FAILED, ${r.findings.length} finding(s) left (by-hand list)${r.files ? `; draft in ${out}` : ""}:\n${r.findings.map((f) => `    - ${f}`).join("\n")}`);
      else console.log(`  ${r.result === "passed" ? "passed first time" : "passed after one correction"}: ${out}`);
      log({ itemId, subject: item.subject, course: item.course, solutionVersion: sol.version, model: r.model, calls: r.calls, tokens: r.tokens, cost: r.cost, corrections: r.corrections, result: r.result, firstFindings: r.firstFindings, findings: r.findings, examples: r.examples, images: sent.map((a) => a.name), out: r.files ? out : null });
      rows.push({ itemId, result: r.result, cost: r.cost, note: `in ${r.tokens.in} out ${r.tokens.out} tokens, ${r.calls.length} call(s)` });
    }
  } finally {
    await closeKs();
  }

  console.log("\n=== Summary ===");
  for (const r of rows) console.log(`${r.itemId.padEnd(10)} ${r.result.padEnd(10)} ${usd(r.cost).padStart(9)}  ${r.note}`);
  const authored = rows.filter((r) => r.result !== "skipped" && r.result !== "dry-run");
  if (!dry) console.log(`total cost: ${usd(spent)} over ${authored.length} item(s)${authored.length ? ` (${usd(spent / authored.length)} per item)` : ""}; passed ${authored.filter((r) => r.result === "passed").length}, corrected ${authored.filter((r) => r.result === "corrected").length}, failed ${authored.filter((r) => r.result === "failed").length}, skipped ${rows.length - authored.length}`);
  if (authored.some((r) => r.result === "failed")) process.exitCode = 1;
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exit(1);
});
