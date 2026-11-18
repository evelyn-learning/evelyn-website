/**
 * The retro-audit (spec §6 and §8): the automatic checks over solutions already written, as a report for
 * Praveen. Reads items and solutions; WRITES NOTHING (the connection is read-only: KEYSTONE_READONLY=1 is
 * set before anything connects, always).
 *
 *   KEYSTONE_PIPELINE_LIVE=1 KEYSTONE_MONGODB_URI=<uri> \
 *   npx tsx apps/marketing/scripts/keystone-retro-audit.ts [options]
 *
 * Options:
 *   (none)              working check + full rules audit on every solution in review
 *   --stage <stage>     another stage instead of in_review (with --rule: narrows "every stage")
 *   --rule R-id         that one rule only, across every solution not yet approved; approved and delivered
 *                       ones that would fail it are listed apart (never changed)
 *   --only id,id        just these items
 *   --limit <n>         at most n items
 *   --out <file>        write the report (Markdown) to this file instead of printing it
 * Model calls need KEYSTONE_PIPELINE_LIVE=1 and the API keys of the working and audit roles.
 */
// Before anything else, and whatever the options: the database is opened read-only (db.ts connectOptions /
// blockWrites: no collection or index is created on connect and any model write throws).
process.env.KEYSTONE_READONLY = "1";

import { writeFileSync } from "node:fs";
import path from "node:path";

async function main() {
  const { parseRetroArgs, runRetro, renderRetro, mongoRetroReader, hostOf } = await import("../src/lib/keystone/pipeline/retro");
  const args = parseRetroArgs(process.argv.slice(2));
  const uri = process.env.KEYSTONE_MONGODB_URI;
  if (!uri) throw new Error("Refusing to run: set KEYSTONE_MONGODB_URI explicitly.");
  const { KEYSTONE_DB } = await import("../src/lib/keystone/config");
  console.log(`Database: ${KEYSTONE_DB} on ${hostOf(uri)} (READ-ONLY: nothing is written)`);
  if (process.env.KEYSTONE_PIPELINE_LIVE !== "1") throw new Error("Refusing to run: model calls are off (set KEYSTONE_PIPELINE_LIVE=1).");
  const { assertKeys, redact } = await import("../src/lib/keystone/pipeline/models");
  assertKeys(args.rule ? ["audit"] : ["working", "audit"]); // names missing variables, never their values
  const { workingCheck, rulesAudit } = await import("../src/lib/keystone/pipeline/checks");
  const { loadRules } = await import("../src/lib/keystone/pipeline/write");
  const { closeKs } = await import("../src/lib/keystone/db");

  try {
    const report = await runRetro(args, {
      reader: mongoRetroReader(),
      checks: {
        working: (item, draft, answer) => workingCheck(item, draft, answer),
        audit: (item, course, draft, rules) => rulesAudit(item, course, draft, rules),
      },
      rules: loadRules(),
      concurrency: 4,
    });
    const md = renderRetro(report);
    if (args.out) {
      const file = path.resolve(args.out);
      writeFileSync(file, md);
      console.log(`Report written to ${file}`);
    } else {
      console.log(`\n${md}`);
    }
    const withFindings = report.items.filter((r) => r.findings.length).length;
    const couldNot = report.items.filter((r) => r.couldNotRun.length).length;
    console.log(
      `\n=== Summary ===\naudited ${report.items.length}, with findings ${withFindings}, check could not run ${couldNot}, not audited ${report.skipped.length}` +
        `\ntotal cost: $${report.cost.toFixed(4)} over ${report.items.length} item(s)`,
    );
  } catch (e) {
    throw new Error(redact(e instanceof Error ? e.message : String(e)));
  } finally {
    await closeKs();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
