/**
 * Local browser walk of the single review: the owner sees the animation on the item page, sends the item to
 * review, and the reviewer then gets "Play animated solution" and the flag panel on the released version.
 * Then Castle Rock's own flag: the reviewer flags a step, the owner sees it marked as Castle Rock's, a v2 that
 * addresses it is published (through the store, as the session's publish script does), the owner accepts it,
 * and the reviewer sees "Fixed in v2" with the reply and confirms. Seeds its own item in a LOCAL test database.
 *
 *   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 KEYSTONE_DB_NAME=castle_rock_review_smoke KEYSTONE_DATA_DIR=/tmp/ks-smoke \
 *   KS_BASE=http://keystone.localhost:3046 KS_BUILT=<animated-out>/<id> KS_SHOTS=/tmp/ks-smoke-shots \
 *   npx tsx apps/marketing/scripts/keystone-animated-smoke.ts        (the dev server must run with the same three KEYSTONE_ vars)
 *
 * START THE DEV SERVER WITH THE SITE'S OWN DATABASE POINTED AT THE LOCAL MONGOD TOO, and its schedulers off:
 *   MONGODB_URI=mongodb://127.0.0.1:27017/marketing_local_smoke ENABLE_BLOG_SCHEDULER=false \
 *   ENABLE_OUTREACH_WATCHER=false ENABLE_LEAD_RESEARCH=false KEYSTONE_…(the three above) npx next dev --turbopack -p 3046
 * Without these the marketing app reads MONGODB_URI from .env.local, which on a laptop is the PRODUCTION tunnel
 * (127.0.0.1:2710), connects to it at start-up and starts the blog, reply and research schedulers against it.
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
  const panel = async (pg: Page) => (await pg.textContent("#animated")) ?? "";
  const reload = async (pg: Page) => {
    await pg.goto(`${BASE}/item/${ID}`);
    await pg.waitForSelector("#animated iframe");
  };
  const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);
  const OWNER = { username: "owner", role: "evelyn" as const, name: "Smoke Owner" };
  const statusOf = async (pg: Page, url: string) => (await pg.request.get(`${BASE}${url}`)).status();
  // an owner flag with a picture on the released version: the reviewer must get neither
  const internal = await anim.createFlag({ itemId: ID, version: 1, comment: "INTERNAL owner note" }, [PNG], OWNER);
  assert.ok("ok" in internal, JSON.stringify(internal));
  await rp.waitForSelector("#animated iframe");
  let seen = await panel(rp);
  assert.match(seen, /Animated solution · v1/, "the reviewer has the flag panel on the released version");
  assert.ok(!/INTERNAL|Accept this version|Released|To review|voice:/.test(seen), "no owner flag, no owner control in the reviewer's panel");
  assert.equal(await rp.locator('#animated nav[aria-label="Version"]').count(), 0, "no version switcher for the reviewer");
  assert.equal(await statusOf(rp, `/api/keystone/animated/shot/${internal.ok.id}/1.png`), 404, "an owner flag's picture is 404 for the reviewer");
  assert.equal(await statusOf(page, `/api/keystone/animated/shot/${internal.ok.id}/1.png`), 200, "and there for the owner");
  assert.ok("ok" in (await anim.deleteFlag(internal.ok.id, OWNER)));
  await rp.screenshot({ path: path.join(SHOTS, "5a-reviewer-panel.png"), fullPage: true });
  const audio: number[] = [];
  rp.on("response", (r) => r.url().includes(`/api/keystone/player/${ID}/`) && audio.push(r.status()));
  await rp.click("button.ks-play");
  await rp.waitForSelector("dialog.ks-player[open] iframe");
  await rp.waitForTimeout(1500);
  await rp.screenshot({ path: path.join(SHOTS, "5-reviewer-player.png") });
  assert.ok(audio.some((s) => s === 200), `player files load (${audio.join(",")})`);
  assert.equal((await rp.goto(`${BASE}/api/keystone/animated/flags`))?.status() === 200, false);

  // --- Castle Rock's own flag: reviewer flags a step on the released animation ---
  await reload(rp);
  // play into the explanation so the flag records a step (the Flag button pauses the player)
  await rp.frameLocator("#animated iframe").locator("button:has-text('Play the explanation')").click();
  await rp.waitForTimeout(3000);
  await rp.click("#animated button:has-text('Flag')");
  await rp.fill("#animated textarea", "The arrow points the wrong way here");
  await rp.click("#animated button:has-text('Save')");
  await rp.waitForFunction(() => /Your team's flags on v1 · 1/.test(document.querySelector("#animated")?.textContent ?? ""));
  seen = await panel(rp);
  assert.match(seen, /With Evelyn/);
  assert.match(seen, /The arrow points the wrong way here/);
  assert.match(seen, /Step \d/, "the flag carries the step");
  assert.ok(!/Castle Rock/.test(seen), "their own panel does not label them");
  await rp.screenshot({ path: path.join(SHOTS, "6-reviewer-flagged.png"), fullPage: true });
  await rp.locator("#animated .ks-ar-panel").screenshot({ path: path.join(SHOTS, "6-reviewer-flagged-panel.png") });
  const theirs = await AnimFlag.findOne({ itemId: ID, createdByRole: "reviewer" }).lean();
  assert.ok(theirs, "the flag is stored with the reviewer's role");
  const flagId = String(theirs._id);
  assert.deepEqual([theirs.createdBy, theirs.createdByName, theirs.version, theirs.status], ["rev", "Smoke Reviewer", 1, "open"]);
  assert.equal((await Animation.findOne({ itemId: ID, version: 1 }).lean())?.status, "released", "the version stays released");
  // the reviewer cannot accept, whatever the page sends
  const acc = await rp.request.post(`${BASE}/api/keystone/animated/flags`, { multipart: { op: "accept", itemId: ID, version: "1" } });
  assert.equal(acc.status(), 404, "accept is not the reviewer's");

  // --- the owner sees it, marked as Castle Rock's ---
  await reload(page);
  seen = await panel(page);
  assert.match(seen, /Smoke Reviewer · Castle Rock/);
  assert.match(seen, /The arrow points the wrong way here/);
  await page.screenshot({ path: path.join(SHOTS, "7-owner-sees-castle-rock-flag.png"), fullPage: true });
  await page.goto(`${BASE}/queue`);
  assert.match((await page.textContent("main"))!, /Animations flagged by Castle Rock · 1/);
  assert.match((await page.textContent("#cr-flags"))!, /1 flagged by Castle Rock/);

  // --- a v2 that addresses it is published (as the session's publish script does) ---
  await cp(process.env.KS_BUILT!, animatedDir(ID, 2), { recursive: true });
  const pub2 = await anim.recordPublish({ itemId: ID, height: 1100, voice: "Mr. Joseph", notes: "INTERNAL build note", addresses: [flagId], replies: { [flagId]: "The arrow now points to the right" }, createdBy: "owner" }, 2);
  assert.deepEqual(pub2, { ok: { version: 2, fixed: 1 } });
  // not released: the reviewer still has v1, the flag still reads as with Evelyn, v2 does not exist for them
  await reload(rp);
  seen = await panel(rp);
  assert.match(seen, /Animated solution · v1/);
  assert.match(seen, /With Evelyn/);
  assert.ok(!/Fixed in|now points to the right|INTERNAL|v2/.test(seen), "nothing of the unreleased fix in the reviewer's panel");
  assert.equal(await statusOf(rp, `/api/keystone/animated/${ID}/2/solution.html`), 404, "the unreleased version's files are 404 for the reviewer");
  assert.equal(await statusOf(rp, `/api/keystone/animated/${ID}/1/solution.html`), 200);

  // --- the owner accepts v2: released at once, because the written solution is out ---
  await reload(page);
  seen = await panel(page);
  assert.match(seen, /Animated solution · v2/);
  assert.match(seen, /Fixed in v2 · 1/);
  assert.match(seen, /Castle Rock confirm this fix/);
  assert.equal(await page.locator(`#animated [data-flag="${flagId}"] button:has-text('Confirm')`).count(), 0, "the fix of a Castle Rock flag is theirs to confirm");
  page.once("dialog", (d) => void d.accept());
  await page.click("#animated button:has-text('Accept this version')");
  await page.waitForFunction(() => /Released/.test(document.querySelector("#animated h2")?.textContent ?? ""), null, { timeout: 15000 });
  await page.screenshot({ path: path.join(SHOTS, "8-owner-accepted-v2.png"), fullPage: true });

  // --- the reviewer sees "Fixed in v2" with the reply, and confirms ---
  await reload(rp);
  seen = await panel(rp);
  assert.match(seen, /Animated solution · v2/);
  assert.match(seen, /Fixed in v2/);
  assert.match(seen, /Evelyn's reply: The arrow now points to the right/);
  assert.ok(!/INTERNAL|Accept this version/.test(seen));
  assert.equal(await rp.locator('#animated nav[aria-label="Version"]').count(), 0);
  assert.equal(await statusOf(rp, `/api/keystone/animated/${ID}/1/solution.html`), 404, "the superseded version is no longer served to the reviewer");
  await rp.screenshot({ path: path.join(SHOTS, "9-reviewer-fixed-in-v2.png"), fullPage: true });
  await rp.locator("#animated .ks-ar-panel").screenshot({ path: path.join(SHOTS, "9-reviewer-fixed-in-v2-panel.png") });
  await rp.click(`#animated [data-flag="${flagId}"] button:has-text('Confirm')`);
  await rp.waitForFunction(() => /Confirmed/.test(document.querySelector("#animated")?.textContent ?? ""));
  await rp.screenshot({ path: path.join(SHOTS, "10-reviewer-confirmed.png"), fullPage: true });
  assert.equal((await AnimFlag.findById(flagId).lean())?.status, "confirmed");
  // wording for Castle Rock: nothing about how the animation is made
  const words = (await rp.textContent("main")) ?? "";
  assert.ok(!/\bAI\b|\bmodels?\b|generated|API credit|by hand/i.test(words), "plain wording for Castle Rock");
  await closeKs();
  await browser.close();
  assert.deepEqual(errors, [], "no page errors");
  console.log(`animated smoke: ok. Pictures: ${SHOTS}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
