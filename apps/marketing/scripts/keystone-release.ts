/**
 * The timed release (spec §7), started hourly by cron on the server. Releases every clean solution whose
 * time has come (Mon–Fri 08:00–17:00 Mountain time), after taking each finished batch's sample for Praveen.
 * Calls no model.
 *
 *   KEYSTONE_MONGODB_URI=<uri> npx tsx apps/marketing/scripts/keystone-release.ts [--dry-run [--now <iso>]]
 *
 *   --dry-run      read-only connection (KEYSTONE_READONLY=1 before connecting); prints what would be
 *                  sampled and released and when each waiting item is due; writes nothing, takes no lock
 *   --now <iso>    with --dry-run only: plan as of this instant
 *
 * Exits 0 with a one-line summary ("release: ..."), also on an empty database. Two overlapping runs:
 * the second finds the lock held and exits 0 doing nothing.
 */
import { randomUUID } from "node:crypto";
import { KEYSTONE_DB } from "../src/lib/keystone/config";

const LOCK = "keystone-release";
const LOCK_TTL_MS = 30 * 60 * 1000;

/** Host and port of a mongodb URI, without credentials or options. */
function hostOf(uri: string): string {
  const m = /^mongodb(?:\+srv)?:\/\/(?:[^@/]*@)?([^/?]+)/.exec(uri);
  return m ? m[1] : "(unreadable URI)";
}

function parse(argv: string[]): { dryRun: boolean; now?: Date } {
  const a: { dryRun: boolean; now?: Date } = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const o = argv[i];
    if (o === "--dry-run") a.dryRun = true;
    else if (o === "--now") {
      const v = argv[++i];
      const d = new Date(v ?? "");
      if (!v || Number.isNaN(d.getTime())) throw new Error("--now needs an ISO date-time");
      a.now = d;
    } else throw new Error(`unknown option ${o}`);
  }
  if (a.now && !a.dryRun) throw new Error("--now is allowed only together with --dry-run");
  return a;
}

async function main() {
  const args = parse(process.argv.slice(2));
  // Before any connection: a dry run opens the database read-only (db.ts connectOptions / blockWrites).
  if (args.dryRun) process.env.KEYSTONE_READONLY = "1";
  else if (process.env.KEYSTONE_READONLY === "1") throw new Error("Refusing to run: KEYSTONE_READONLY=1 is set for a writing run (use --dry-run).");
  const uri = process.env.KEYSTONE_MONGODB_URI;
  if (!uri) throw new Error("Refusing to run: set KEYSTONE_MONGODB_URI explicitly.");
  console.log(`Database: ${KEYSTONE_DB} on ${hostOf(uri)}${args.dryRun ? " (DRY RUN: read-only connection, nothing is written)" : " (WRITING)"}`);

  const { closeKs } = await import("../src/lib/keystone/db");
  const rel = await import("../src/lib/keystone/pipeline/release");
  const now = args.now ?? new Date();
  try {
    if (args.dryRun) {
      const plan = await rel.planRelease(now);
      console.log(`As of ${rel.mountain(now)} Mountain time: ${plan.inWindow ? "inside" : "outside"} the release window (Mon–Fri 08:00–17:00).`);
      for (const s of plan.samples) {
        console.log(s.ids.length ? `batch ${s.batchId}: would take the sample for Praveen: ${s.ids.join(", ")}` : `batch ${s.batchId}: sample not taken yet (${s.why ?? "nothing clean to sample"})`);
      }
      for (const r of plan.rows) {
        console.log(`${r.itemId.padEnd(12)} ${(r.batchId ?? "-").padEnd(26)} ${r.releaseAt ? `due ${rel.mountain(r.releaseAt)}` : "no release time".padEnd(24)}  ${r.state}`);
      }
      const now_ = plan.rows.filter((r) => r.state === "would release now").length;
      console.log(`release: dry run, would release ${now_}, ${plan.rows.length - now_} waiting, ${plan.samples.filter((s) => s.ids.length).length} batch sample(s) to take`);
      return;
    }
    const owner = randomUUID();
    if (!(await rel.acquireLock(LOCK, owner, new Date(), LOCK_TTL_MS))) {
      console.log("release: another release run holds the lock; nothing done");
      return;
    }
    try {
      const released = await rel.releaseDue(now);
      if (released.length) console.log(`released: ${released.join(", ")}`);
      console.log(`release: ${released.length} released${rel.inWindow(now) ? "" : " (outside the window)"} at ${rel.mountain(now)} Mountain time`);
    } finally {
      await rel.releaseLock(LOCK, owner);
    }
  } finally {
    await closeKs();
  }
}

main().catch(async (e) => {
  console.error((e as Error).message);
  process.exit(1);
});
