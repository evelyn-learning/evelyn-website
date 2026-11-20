// Animated solutions: the built folder. buildToFolder turns an item source folder into <out>/solution.html +
// <out>/audio/step-N.mp3 after the checks; placeBuilt copies a built folder to where a published version lives,
// through a temporary folder and a rename so a half-written vN never exists. Shared by the laptop scripts
// (keystone-animated-build.ts, keystone-animated-publish.ts --local) and the server build. No `next/*` imports.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { cp, mkdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import { buildItem } from "./build";
import { earCheck, packagingCheck, spokenNumbersCheck } from "./checks";
import type { Spec } from "./spec";

export type BuiltFolder = {
  spec: Spec;
  html: string;
  out: string;
  /** Clips copied beside the page. */
  clips: number;
  warnings: string[];
  /** Checks that failed (the page is written all the same, so it can be looked at). */
  failures: string[];
  /** The written solution the numbers were checked against, when one was found. */
  writtenPath?: string;
};

/**
 * Builds the item in `srcDir` into `out`: the page, its clips, and the checks (packaging, written-for-the-ear,
 * numbers against the written solution). Throws when the spec is not valid. `lenient` reports ear and number
 * findings as warnings. `writtenPaths`: where to look for the written solution, first hit wins.
 */
export function buildToFolder(srcDir: string, out: string, opts: { version?: number; lenient?: boolean; writtenPaths?: (string | undefined)[] } = {}): BuiltFolder {
  const { html, warnings, spec } = buildItem(srcDir, { version: opts.version });
  if (path.basename(srcDir) !== spec.itemId) warnings.push(`the folder is named ${path.basename(srcDir)} but spec.itemId is ${spec.itemId}`);

  const failures: string[] = [];
  failures.push(...packagingCheck(html).map((p) => `packaging: ${p}`));
  const soft = opts.lenient ? warnings : failures;
  soft.push(...earCheck(spec).map((f) => `ear: ${f.where}: ${f.detail}`));
  const writtenPath = (opts.writtenPaths ?? [path.join(srcDir, "written.md")]).find((p): p is string => !!p && existsSync(p));
  if (!writtenPath) warnings.push("numbers not checked: no written solution found (written.md in the source folder, or --written)");
  else {
    const strays = spokenNumbersCheck(spec, readFileSync(writtenPath, "utf8"), spec.question);
    soft.push(...strays.map((f) => `number not in the written solution or the question: ${f.detail} (${f.where})`));
  }

  mkdirSync(path.join(out, "audio"), { recursive: true });
  writeFileSync(path.join(out, "solution.html"), html);
  let clips = 0;
  spec.steps.forEach((_, k) => {
    const f = path.join(srcDir, "audio", `step-${k + 1}.mp3`);
    if (existsSync(f)) {
      copyFileSync(f, path.join(out, "audio", `step-${k + 1}.mp3`));
      clips += 1;
    }
  });
  return { spec, html, out, clips, warnings, failures, writtenPath };
}

/** What a published version holds: the page and its clips; never the check's pictures or the spec. */
const NOT_PUBLISHED = ["shots", "spec.json"];

/**
 * Copies the built folder `outDir` to `dest` (a version folder that must not exist yet): into `dest`.tmp-… beside
 * it first, then one rename. A copy that fails part-way leaves no `dest`.
 */
export async function placeBuilt(outDir: string, dest: string): Promise<void> {
  const root = path.resolve(outDir);
  if (await stat(dest).catch(() => null)) throw new Error(`${dest} already exists`);
  await mkdir(path.dirname(dest), { recursive: true });
  const tmp = `${dest}.tmp-${process.pid}-${Date.now()}`;
  try {
    await cp(root, tmp, { recursive: true, filter: (src) => !NOT_PUBLISHED.includes(path.relative(root, src).split(path.sep)[0]) });
    await rename(tmp, dest);
  } catch (e) {
    await rm(tmp, { recursive: true, force: true });
    throw e;
  }
}
