// Animated solutions: what goes into an authoring call and what comes out of it, as files. Shared by the laptop
// script (scripts/keystone-animated-author.ts) and the server build (serverbuild.ts), so the two cannot drift:
// the finished examples of a folder, the house rules, the item as the model reads it, the question's images,
// written.md and the source folder the build takes. No database, no network, no `next/*` imports.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ItemDoc } from "../db";
import { questionAsText } from "../pipeline/intake";
import type { AuthorAsset, AuthorExample, AuthorInput, AuthoredFiles } from "./author";

/** Shown first when the subject matches (the reviewer's reference items), then the rest by id. */
export const PREFERRED = ["234035", "286312", "193246", "93953", "135676", "98186"];
export const IMAGE_MIME: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp" };
/** Only an approved or in-review written solution (or one ready to go out) is animated. */
export const AUTHORABLE_STAGES = ["ready", "approved", "in_review"];
export const safeName = (s: string) => s.replace(/[^A-Za-z0-9._-]/g, "_");

/** The finished items of a source folder, preferred ones first. Folders without the three texts are skipped. */
export function loadExamples(dir: string, preferred: string[] = PREFERRED): AuthorExample[] {
  if (!existsSync(dir)) return [];
  const names = readdirSync(dir).filter((n) => /^\d+$/.test(n));
  names.sort((a, b) => (preferred.indexOf(a) + 1 || 99) - (preferred.indexOf(b) + 1 || 99) || Number(a) - Number(b));
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

/**
 * Parts 1 and 5 of the playbook (the rules and "write for the ear"); the rest is process. `wholeWithoutParts`:
 * a file that has no "## Part N" heading is taken whole (the server's playbook.md may hold just the rules).
 */
export function houseRules(file: string, opts: { wholeWithoutParts?: boolean } = {}): string | undefined {
  if (!existsSync(file)) return undefined;
  const text = readFileSync(file, "utf8");
  const part = (n: string) => new RegExp(`^## Part ${n} [\\s\\S]*?(?=^## Part |(?![\\s\\S]))`, "m").exec(text)?.[0].trim() ?? "";
  const out = [part("1"), part("5")].filter(Boolean).join("\n\n");
  if (out) return out;
  return opts.wholeWithoutParts && !/^## Part \d/m.test(text) && text.trim() ? text.trim() : undefined;
}

export type WrittenSection = { kind: string; md: string };

/** written.md: the question as stored, the options and the solution's sections (the numbers check reads all of it). */
export function writtenFile(item: ItemDoc, version: number, sections: WrittenSection[]): string {
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

/**
 * The question's own images read from the folder that holds the item's files (`dir`/<file name>): raster images
 * with their bytes, anything else by name only. `missing`: the names with no file there.
 */
export function readQuestionAssets(dir: string, shown: string[]): { assets: AuthorAsset[]; missing: string[] } {
  const assets: AuthorAsset[] = [];
  const missing: string[] = [];
  for (const name of shown) {
    const file = path.join(dir, safeName(path.basename(name)));
    const mime = IMAGE_MIME[path.extname(name).slice(1).toLowerCase()];
    if (existsSync(file) && statSync(file).isFile()) assets.push(mime ? { name, mime, data: new Uint8Array(readFileSync(file)) } : { name });
    else {
      missing.push(name);
      assets.push({ name });
    }
  }
  return { assets, missing };
}

/** The item as authorItem takes it. */
export function authorInputFor(item: ItemDoc, sections: WrittenSection[], assets: AuthorAsset[]): AuthorInput {
  return {
    itemId: item.itemId,
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
}

/**
 * Writes an item's source folder: spec.json, figure.svg, board.js (removed when the item has none), written.md and
 * question-assets/ (copied from `assetsFrom`, the folder holding the item's files). `clean` empties the folder first.
 */
export function writeSource(out: string, files: AuthoredFiles, written: string, assets: { name: string }[], assetsFrom: string, opts: { clean?: boolean } = {}): void {
  if (opts.clean) rmSync(out, { recursive: true, force: true });
  mkdirSync(path.join(out, "question-assets"), { recursive: true });
  writeFileSync(path.join(out, "spec.json"), files.specJson);
  writeFileSync(path.join(out, "figure.svg"), files.figureSvg);
  if (files.boardJs) writeFileSync(path.join(out, "board.js"), files.boardJs);
  else rmSync(path.join(out, "board.js"), { force: true });
  writeFileSync(path.join(out, "written.md"), written);
  for (const a of assets) {
    const from = path.join(assetsFrom, safeName(path.basename(a.name)));
    if (existsSync(from)) copyFileSync(from, path.join(out, "question-assets", safeName(path.basename(a.name))));
  }
}
