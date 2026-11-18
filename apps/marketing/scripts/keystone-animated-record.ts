/**
 * Records the voice for one Keystone animated solution (Cartesia).
 *
 *   npx tsx apps/marketing/scripts/keystone-animated-record.ts <srcDir>/<itemId> [--live] [--step N] [--force]
 *
 * Without --live: prints each step's text, its character count and what would
 * be recorded — no network call. With --live: one request per step, writes
 * audio/step-N.mp3 + timing.json, skips steps whose text is unchanged (hash in
 * timing.json) unless --force, and appends the characters billed to
 * <srcDir>/recording-log.jsonl. Key: CARTESIA_API_KEY in the environment.
 * See src/lib/keystone/animated/record.ts.
 */
import { recordItem, type FetchLike } from "../src/lib/keystone/animated/record";

async function main() {
  const args = process.argv.slice(2);
  const srcDir = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--step");
  if (!srcDir) throw new Error("Usage: keystone-animated-record.ts <srcDir>/<itemId> [--live] [--step N] [--force]");
  const si = args.indexOf("--step");
  const step = si >= 0 ? Number(args[si + 1]) : undefined;
  const live = args.includes("--live");
  const res = await recordItem(srcDir, {
    live,
    step,
    force: args.includes("--force"),
    apiKey: process.env.CARTESIA_API_KEY || undefined,
    fetch: globalThis.fetch as unknown as FetchLike,
  });
  if (live) {
    console.log(`\nRecorded steps: ${res.recorded.join(", ") || "none"}; ${res.charsBilled} chars billed.`);
    for (const n of res.notes) console.log(`⚠ ${n}`);
  } else {
    console.log("\nPreview only. Add --live to record.");
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
