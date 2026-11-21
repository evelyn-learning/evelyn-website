/**
 * Local browser walk of the server build of an animated solution: the owner ticks an item on the To animate list,
 * presses "Build with API credits", and the item goes Queued → Building → built and shows up for review, with no
 * script started by hand. Seeds its own item, users and examples in a LOCAL test database and data folder.
 *
 * The dev (or built) server must run with the same KEYSTONE_ variables plus the stand-in voice:
 *   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 MONGODB_URI=mongodb://127.0.0.1:27017 \
 *   KEYSTONE_DB_NAME=castle_rock_review_smoke KEYSTONE_DATA_DIR=/tmp/ks-smoke KEYSTONE_ANIM_FAKE_VOICE=1 npx next dev -p 3046
 * then:
 *   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 KEYSTONE_DB_NAME=castle_rock_review_smoke KEYSTONE_DATA_DIR=/tmp/ks-smoke \
 *   KS_BASE=http://keystone.localhost:3046 KS_EXAMPLES=<animated-src> KS_SHOTS=/tmp/ks-smoke-shots \
 *   npx tsx scripts/keystone-animated-serverbuild-smoke.ts
 *
 * KS_EXAMPLES     a folder of finished items; KS_EXAMPLE_IDS (default 135676,93953,286312) are copied from it into
 *                 <data>/animated-examples/ (read only: nothing is written to KS_EXAMPLES). KS_PLAYBOOK: the house
 *                 rules file, copied as playbook.md when given.
 * KS_PREAUTHORED  a source folder (spec.json, figure.svg, …) for the item: placed as already authored, so the walk
 *                 makes NO model call. Without it the server makes one real authoring call (two with a correction):
 *                 that spends API credits, with the server's own ANTHROPIC_API_KEY.
 * The voice is the silent stand-in (honoured only because the database name ends in _smoke): nothing is recorded.
 */
import assert from "node:assert/strict";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { chromium, type Page } from "playwright";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri) || !/_smoke$/.test(process.env.KEYSTONE_DB_NAME ?? "") || !/smoke/.test(process.env.KEYSTONE_DATA_DIR ?? "")) {
  console.error("Refused: needs the local mongod on 27017, a database name ending in _smoke and a KEYSTONE_DATA_DIR with 'smoke' in its path.");
  process.exit(1);
}
const BASE = process.env.KS_BASE!;
const SHOTS = process.env.KS_SHOTS || "/tmp/ks-smoke-shots";
const ID = process.env.KS_ITEM || "993401";
const PW = "smoke-pass-1";
const WAIT_MS = Number(process.env.KS_WAIT_MIN || 25) * 60_000;

const QUESTION = `<p>A 2.0 kg cart moves east at 3.0 m/s on a level, frictionless track. It collides with a 1.0 kg cart that is at rest, and the two carts stick together.</p><p>What is the speed of the joined carts immediately after the collision?</p>`;
const OPTIONS = [
  { label: "A", html: "1.0 m/s" },
  { label: "B", html: "1.5 m/s" },
  { label: "C", html: "2.0 m/s" },
  { label: "D", html: "3.0 m/s" },
];
const SECTIONS = [
  { kind: "short" as const, md: "Momentum is conserved, so the joined carts move at $2.0\\ \\text{m/s}$. The answer is C." },
  {
    kind: "diploma" as const,
    md: [
      "No outside horizontal force acts on the two carts, so the total momentum just before the collision equals the total momentum just after it. Take east as positive. Before the collision only the 2.0 kg cart moves:",
      "",
      "$$p_{\\text{before}} = (2.0\\ \\text{kg})(3.0\\ \\text{m/s}) + (1.0\\ \\text{kg})(0) = 6.0\\ \\text{kg·m/s}$$",
      "",
      "After the collision the carts move together as one object of mass $2.0\\ \\text{kg} + 1.0\\ \\text{kg} = 3.0\\ \\text{kg}$:",
      "",
      "$$v = \\frac{p_{\\text{before}}}{m_{\\text{total}}} = \\frac{6.0\\ \\text{kg·m/s}}{3.0\\ \\text{kg}} = 2.0\\ \\text{m/s}$$",
      "",
      "The joined carts are heavier than the moving cart alone, so they must move slower than 3.0 m/s; 2.0 m/s east fits. The answer is C.",
    ].join("\n"),
  },
  {
    kind: "errors" as const,
    md: [
      "- Keeping the speed at 3.0 m/s (option D). The moving cart shares its momentum with the cart at rest, so the joined carts are slower.",
      "- Averaging the two speeds, $(3.0 + 0) \\div 2 = 1.5\\ \\text{m/s}$ (option B). The carts have different masses, so the speeds cannot simply be averaged.",
      "- Dividing by the mass of the cart that was at rest only, or by the wrong total, which gives 1.0 m/s (option A) when 3.0 m/s is divided by 3.0.",
    ].join("\n"),
  },
];

async function login(page: Page, u: string) {
  await page.goto(`${BASE}/login`);
  await page.fill("#u", u);
  await page.fill("#p", PW);
  await Promise.all([page.waitForURL((x) => !x.pathname.endsWith("/login")), page.click("button[type=submit], form button")]);
}

(async () => {
  const { ks, closeKs } = await import("../src/lib/keystone/db");
  const { DATA_DIR } = await import("../src/lib/keystone/assets");
  const { saveSolution } = await import("../src/lib/keystone/store");
  const { buildDirs } = await import("../src/lib/keystone/animated/serverbuild");
  const { Item, User, Solution, Animation, AnimFlag, AnimBuild, Activity, Lock } = await ks();
  await Promise.all([Item.deleteMany({}), User.deleteMany({}), Solution.deleteMany({}), Animation.deleteMany({}), AnimFlag.deleteMany({}), AnimBuild.deleteMany({}), Activity.deleteMany({}), Lock.deleteMany({})]);
  await rm(DATA_DIR, { recursive: true, force: true });
  const hash = await bcrypt.hash(PW, 10);
  await User.create([{ username: "owner", name: "Smoke Owner", role: "evelyn", passwordHash: hash }]);
  const actor = { username: "owner", name: "Smoke Owner", role: "evelyn" as const };
  await Item.create({ itemId: ID, subject: "Physics", course: "Physics 30", itemType: "MC", questionHtml: QUESTION, options: OPTIONS, key: "C", keySource: "castle-rock", stage: "received", version: 0 });
  await saveSolution(ID, SECTIONS, actor, { submit: false, stage: "ready", set: { evelynAnswer: "C", pipeline: { flags: [] } as never } });
  await Item.updateOne({ itemId: ID }, { $set: { evelynAnswer: "C", pipeline: { flags: [] } } });

  const dirs = buildDirs();
  const from = process.env.KS_EXAMPLES;
  if (!from) throw new Error("Set KS_EXAMPLES to a folder of finished items.");
  for (const id of (process.env.KS_EXAMPLE_IDS || "135676,93953,286312").split(",")) {
    await mkdir(path.join(dirs.examples, id), { recursive: true });
    for (const f of ["spec.json", "figure.svg", "board.js", "written.md"]) if (existsSync(path.join(from, id, f))) await cp(path.join(from, id, f), path.join(dirs.examples, id, f));
  }
  if (process.env.KS_PLAYBOOK) await cp(process.env.KS_PLAYBOOK, path.join(dirs.examples, "playbook.md"));
  if (process.env.KS_PREAUTHORED) {
    const to = path.join(dirs.src, ID);
    await mkdir(to, { recursive: true });
    for (const f of ["spec.json", "figure.svg", "board.js", "written.md"]) if (existsSync(path.join(process.env.KS_PREAUTHORED, f))) await cp(path.join(process.env.KS_PREAUTHORED, f), path.join(to, f));
    await writeFile(path.join(to, "authored.json"), JSON.stringify({ solutionVersion: 1, cost: 0, corrections: 0, at: new Date().toISOString() }));
    console.log(`Source placed as already authored (${process.env.KS_PREAUTHORED}): no model call will be made.`);
  } else console.log("The server will make a real authoring call (API credits).");

  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const errors: string[] = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("pageerror", (e) => errors.push(String(e)));
  await login(page, "owner");
  await page.goto(`${BASE}/queue`);
  const row = () => page.locator(`#animate li[data-item="${ID}"]`).first();
  assert.match((await row().textContent())!, /Not decided/);
  await page.screenshot({ path: path.join(SHOTS, "1-to-animate.png"), fullPage: true });

  // the button: the request returns at once, the build starts by itself
  const t0 = Date.now();
  await page.check(`#animate input[value="${ID}"]`);
  await page.click('#animate button[value="api"]');
  await page.waitForFunction((id) => /Queued for API credits/.test(document.querySelector(`#animate li[data-item="${id}"]`)?.textContent ?? ""), ID, { timeout: 15000 });
  const pressMs = Date.now() - t0;
  const since = () => `${((Date.now() - t0) / 1000).toFixed(0)} s`;
  console.log(`pressed: the list answered in ${pressMs} ms`);
  assert.ok(pressMs < 10000, "the press does not wait for the build");

  const seen: string[] = [];
  const note = async (state: string, shot: string) => {
    if (seen.includes(state)) return;
    seen.push(state);
    console.log(`${since()}: ${state}`);
    await page.screenshot({ path: path.join(SHOTS, shot), fullPage: true });
  };
  let outcome: "built" | "failed" | "timeout" = "timeout";
  while (Date.now() - t0 < WAIT_MS) {
    const all = (await page.textContent("main")) ?? "";
    const mine = (await row().count()) ? ((await row().textContent()) ?? "") : "";
    if (/Building since/.test(mine)) await note("Building", "3-building.png");
    else if (/Queued for API credits/.test(mine)) await note("Queued", "2-queued.png");
    if (/Failed:/.test(mine)) {
      await note(`Failed: ${mine.replace(/\s+/g, " ").slice(0, 400)}`, "4-failed.png");
      outcome = "failed";
      break;
    }
    if (!mine && new RegExp(`Item ${ID}[\\s\\S]*Animation v1: To review`).test(all)) {
      await note("Built: Animation v1: To review (held for the owner)", "4-built-queue.png");
      outcome = "built";
      break;
    }
    await page.waitForTimeout(2000);
    await page.reload();
  }
  const it = await Item.findOne({ itemId: ID }).lean();
  const b = it?.animate?.build;
  console.log(`item.animate: route ${it?.animate?.route}, build ${JSON.stringify(b)}`);
  for (const r of await AnimBuild.find({ itemId: ID }).lean()) console.log(`build record: ${JSON.stringify({ result: r.result, cost: r.cost, modelCost: r.modelCost, voiceChars: r.voiceChars, corrections: r.corrections, failure: r.failure, version: r.version })}`);
  if (outcome !== "built") {
    await browser.close();
    await closeKs();
    throw new Error(`the item was not built (${outcome}); states seen: ${seen.join(" → ")}`);
  }
  assert.ok(seen.includes("Queued") || seen.includes("Building"), "the list showed the build's progress");
  assert.equal(b?.state, "built");
  const a = await Animation.findOne({ itemId: ID }).lean();
  console.log(`animation row: v${a?.version} ${a?.status}, by ${a?.createdBy}, notes: ${a?.notes}`);

  // the built item is there for review
  await page.goto(`${BASE}/item/${ID}`);
  await page.waitForSelector("#animated iframe");
  await page.waitForTimeout(1500);
  assert.match((await page.textContent("#animated"))!, /Animated solution · v1/);
  await page.screenshot({ path: path.join(SHOTS, "5-item-review.png"), fullPage: true });
  const src = await page.getAttribute("#animated iframe", "src");
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await phone.context().addCookies(await page.context().cookies());
  await phone.goto(new URL(src!, BASE).toString());
  await phone.waitForFunction(() => !!(window as unknown as { esPlayer?: unknown }).esPlayer);
  await phone.screenshot({ path: path.join(SHOTS, "6-solution-phone-fresh.png"), fullPage: true });
  await phone.evaluate(() => (window as unknown as { esPlayer: { buildAll(): void } }).esPlayer.buildAll());
  await phone.waitForTimeout(1200);
  await phone.screenshot({ path: path.join(SHOTS, "7-solution-phone-built.png"), fullPage: true });
  const shots = path.join(dirs.out, ID, "shots");
  console.log(existsSync(shots) ? `the build's own screen-check pictures: ${shots}` : "the build ran no screen check (no pictures)");
  await browser.close();
  await closeKs();
  assert.deepEqual(errors, [], "no page errors");
  console.log(`server build smoke: ok (${seen.join(" → ")}). Pictures: ${SHOTS}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
