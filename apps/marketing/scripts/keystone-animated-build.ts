/**
 * Builds one animated solution: <srcDir>/<itemId>/{spec.json, figure.svg, board.js?, timing.json?, audio/} →
 * <out>/solution.html + <out>/audio/step-N.mp3, after the checks (spec, packaging, written-for-the-ear,
 * numbers against the approved written solution). No network, no database.
 *
 *   npx tsx scripts/keystone-animated-build.ts <srcDir>/<itemId> [--out dir] [--written file.md] [--version N] [--lenient]
 *
 * --out      default: ../../animated-out/<itemId> beside an "animated-src" folder, else <srcDir>/<itemId>/out
 * --written  the approved written solution with its question (Markdown or text). Default: written.md in the
 *            source folder, else ../../items/<itemId>.md. Without one the numbers check is skipped (a warning).
 * --lenient  ear and number findings are printed as warnings instead of failing the build
 * Exit code 1 when a check fails; the page is still written so it can be looked at.
 */
import path from "node:path";
import { buildToFolder } from "../src/lib/keystone/animated/output";
import { readSource } from "../src/lib/keystone/animated/build";

const arg = (n: string) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};

function main(): number {
  const src = process.argv[2];
  if (!src || src.startsWith("--")) {
    console.error("Usage: keystone-animated-build.ts <srcDir>/<itemId> [--out dir] [--written file.md] [--version N] [--lenient]");
    return 2;
  }
  const srcDir = path.resolve(src);
  const lenient = process.argv.includes("--lenient");
  const parent = path.dirname(srcDir);
  const itemId = String((readSource(srcDir).spec as { itemId?: unknown } | null)?.itemId ?? path.basename(srcDir));
  const out = path.resolve(arg("out") ?? (path.basename(parent) === "animated-src" ? path.join(parent, "..", "animated-out", itemId) : path.join(srcDir, "out")));
  const { html, warnings, failures, spec, clips, writtenPath } = buildToFolder(srcDir, out, {
    version: arg("version") ? Number(arg("version")) : undefined,
    lenient,
    writtenPaths: [arg("written"), path.join(srcDir, "written.md"), path.join(parent, "..", "items", `${itemId}.md`)],
  });
  if (writtenPath) console.log(`numbers checked against ${writtenPath}`);
  console.log(`${spec.itemId}: ${path.join(out, "solution.html")} (${Math.round(html.length / 1024)} KB, ${clips}/${spec.steps.length} clips)`);
  for (const w of warnings) console.log(`  warning: ${w}`);
  for (const f of failures) console.error(`  FAIL: ${f}`);
  if (failures.length) console.error(`${failures.length} check(s) failed.`);
  return failures.length ? 1 : 0;
}

try {
  process.exit(main());
} catch (e) {
  console.error((e as Error).message);
  process.exit(1);
}
