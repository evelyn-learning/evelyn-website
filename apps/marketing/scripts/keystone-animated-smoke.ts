/**
 * Local browser walk of the single review: the owner sees the animation on the item page, sends the item to
 * review, and the reviewer then gets "Play animated solution". Seeds its own item in a LOCAL test database.
 *
 *   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 KEYSTONE_DB_NAME=castle_rock_review_smoke KEYSTONE_DATA_DIR=/tmp/ks-smoke \
 *   KS_BASE=http://keystone.localhost:3046 KS_BUILT=<animated-out>/<id> KS_SHOTS=/tmp/ks-smoke-shots \
 *   npx tsx apps/marketing/scripts/keystone-animated-smoke.ts        (the dev server must run with the same three KEYSTONE_ vars)
 */
import assert from "node:assert/strict";
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import { chromium, type Page } from "playwright";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri) || !/_smoke$/.test(process.env.KEYSTONE_DB_NAME ?? "")) {
  console.error("Refused: needs the local mongod on 27017 and a database name ending in _smoke.");
  process.exit(1);
}
const BASE = process.env.KS_BASE!;
const SHOTS = process.env.KS_SHOTS || "/tmp/ks-smoke-shots";
const ID = "993201";
const TODO = "993202";
const PW = "smoke-pass-1";

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
  const anim = await import("../src/lib/keystone/animreview/store");
  const { animatedDir } = await import("../src/lib/keystone/animreview/files");
  const { Item, User, Solution, Animation, AnimFlag, Activity } = await ks();
  await Promise.all([Item.deleteMany({}), User.deleteMany({}), Solution.deleteMany({}), Animation.deleteMany({}), AnimFlag.deleteMany({}), Activity.deleteMany({})]);
  await rm(DATA_DIR, { recursive: true, force: true });
  const hash = await bcrypt.hash(PW, 10);
  await User.create([
    { username: "owner", name: "Smoke Owner", role: "evelyn", passwordHash: hash },
    { username: "rev", name: "Smoke Reviewer", role: "reviewer", passwordHash: hash },
  ]);
  const actor = { username: "owner", name: "Smoke Owner", role: "evelyn" as const };
  for (const id of [ID, TODO]) {
    await Item.create({ itemId: id, subject: "Physics", course: "Physics 30", itemType: "numeric", questionHtml: "<p>Find the wavelength.</p>", options: [], key: "4987", keySource: "castle-rock", stage: "received", version: 0 });
    await saveSolution(id, [{ kind: "short", md: "The answer is 4987." }], actor, { submit: false, stage: "ready", set: { evelynAnswer: "4987", pipeline: { flags: [] } as never } });
    await Item.updateOne({ itemId: id }, { $set: { pipeline: { flags: [] } } });
  }
  await mkdir(path.dirname(animatedDir(ID, 1)), { recursive: true });
  await cp(process.env.KS_BUILT!, animatedDir(ID, 1), { recursive: true });
  const pub = await anim.recordPublish({ itemId: ID, height: 1100, voice: "Mr. Joseph", addresses: [], replies: {}, createdBy: "owner" }, 1);
  assert.ok("ok" in pub, JSON.stringify(pub));
  await closeKs();

  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const errors: string[] = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("pageerror", (e) => errors.push(String(e)));
  await login(page, "owner");
  await page.goto(`${BASE}/queue`);
  await page.screenshot({ path: path.join(SHOTS, "1-queue.png"), fullPage: true });
  const q = await page.textContent("main");
  assert.match(q!, /Animation to review/, "the held reason is shown");
  assert.match(q!, /Animation v1: To review/);
  assert.match(q!, /To animate · 1/);
  assert.ok(!(await page.locator("nav a", { hasText: "Animated" }).count()), "no separate Animated link");
  // route choice
  await page.check(`#animate input[value="${TODO}"]`);
  await page.click('#animate button[value="api"]');
  await page.waitForFunction(() => /Queued for API credits/.test(document.querySelector("#animate")?.textContent ?? ""));
  // the old address lands on the item page
  await page.goto(`${BASE}/animated/${ID}`);
  assert.match(page.url(), new RegExp(`/item/${ID}`));
  await page.waitForSelector("#animated iframe");
  await page.screenshot({ path: path.join(SHOTS, "2-item-owner.png"), fullPage: true });
  assert.match((await page.textContent("#animated"))!, /Animated solution · v1/);
  // flag blocks the send
  await page.click("#animated button:has-text('Flag')");
  await page.fill("#animated textarea", "smoke flag");
  await page.click("#animated button:has-text('Save')");
  await page.waitForFunction(() => /Flags on v1 · 1/.test(document.querySelector("#animated")?.textContent ?? ""));
  await page.click("#ks-owner-send");
  await page.waitForFunction(() => /open flag/.test(document.body.textContent ?? ""));
  await page.screenshot({ path: path.join(SHOTS, "3-blocked.png"), fullPage: true });
  page.once("dialog", (d) => void d.accept());
  await page.click("#animated button:has-text('Delete')");
  await page.waitForFunction(() => /Flags on v1 · 0/.test(document.querySelector("#animated")?.textContent ?? ""));
  await page.click("#ks-owner-send");
  await page.waitForFunction(() => /In review/.test(document.body.textContent ?? ""), null, { timeout: 15000 });
  for (let i = 0; i < 20; i++) {
    await page.goto(`${BASE}/item/${ID}`);
    if (/Released/.test((await page.textContent("#animated")) ?? "")) break;
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(SHOTS, "4-sent.png"), fullPage: true });
  assert.match((await page.textContent("#animated"))!, /Released/);

  const rp = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  rp.on("pageerror", (e) => errors.push(String(e)));
  await login(rp, "rev");
  await rp.goto(`${BASE}/item/${ID}`);
  assert.equal(await rp.locator("#animated").count(), 0, "the reviewer has no flag panel");
  const audio: number[] = [];
  rp.on("response", (r) => r.url().includes(`/api/keystone/player/${ID}/`) && audio.push(r.status()));
  await rp.click("button.ks-play");
  await rp.waitForSelector("dialog.ks-player[open] iframe");
  await rp.waitForTimeout(1500);
  await rp.screenshot({ path: path.join(SHOTS, "5-reviewer-player.png") });
  assert.ok(audio.some((s) => s === 200), `player files load (${audio.join(",")})`);
  assert.equal((await rp.goto(`${BASE}/api/keystone/animated/flags`))?.status() === 200, false);
  await browser.close();
  assert.deepEqual(errors, [], "no page errors");
  console.log(`animated smoke: ok. Pictures: ${SHOTS}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
