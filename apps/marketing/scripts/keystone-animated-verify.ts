/**
 * Headless check of one built animated solution (the folder keystone-animated-build.ts wrote). The check itself
 * is src/lib/keystone/animated/screencheck.ts, which the server build uses too.
 * At 360×740, 768×1024 and 1024×768 it loads the page from a local server and checks: the fresh state (nothing
 * derived on the board), Reset and the board buttons before play, a full Play through every step (paused once per
 * step for a picture), the finished board against the same board built silently (catch-up), Listen on step 3 then
 * step 1, Pause/Resume, Reset during play, the practice task, the taps (transcript, folds, equation lines,
 * choices, sliders), no console error, no request other than the page and its clips, no horizontal scroll, and
 * that the board and the caption never move. Pictures go to <outDir>/shots/. Exit code 1 on any failure.
 *
 *   npx tsx scripts/keystone-animated-verify.ts <outDir> [--speed 8] [--widths 360x740,768x1024,1024x768]
 *
 * Playback runs --speed times faster (the clips too, muted by the headless browser). No network beyond 127.0.0.1.
 */
import path from "node:path";
import { screenCheck } from "../src/lib/keystone/animated/screencheck";

const arg = (n: string) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};

async function main(): Promise<number> {
  const dir = process.argv[2];
  if (!dir || dir.startsWith("--")) {
    console.error("Usage: keystone-animated-verify.ts <outDir> [--speed 8] [--widths 360x740,768x1024,1024x768]");
    return 2;
  }
  const outDir = path.resolve(dir);
  const widths = arg("widths") ? arg("widths")!.split(",").map((w) => w.split("x").map(Number) as [number, number]) : undefined;
  let r;
  try {
    r = await screenCheck(outDir, { speed: arg("speed") ? Number(arg("speed")) : undefined, widths, log: (l) => console.log(l) });
  } catch (e) {
    console.error((e as Error).message);
    return 2;
  }
  if (r.status === "unavailable") {
    console.error(`NOT CHECKED: ${r.why}.`);
    return 1;
  }
  const fails = r.status === "failed" ? r.fails : [];
  for (const f of fails) console.error(`  FAIL ${f}`);
  console.log(fails.length ? `NOT GREEN: ${fails.length} problem(s). Pictures: ${r.shots}` : `GREEN. Pictures: ${r.shots}`);
  return fails.length ? 1 : 0;
}

main().then(
  (code) => process.exit(code),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
