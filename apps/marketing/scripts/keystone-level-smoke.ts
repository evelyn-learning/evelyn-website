/**
 * Local browser walk of an item's level: the reviewer sees the level the pipeline read from the question and
 * where it came from, corrects it, and the solution in review goes back to Evelyn. Seeds its own item in a
 * LOCAL test database.
 *
 *   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 KEYSTONE_DB_NAME=castle_rock_review_smoke KEYSTONE_DATA_DIR=/tmp/ks-smoke \
 *   KS_BASE=http://keystone.localhost:3047 KS_SHOTS=/tmp/ks-smoke-shots npx tsx apps/marketing/scripts/keystone-level-smoke.ts
 *
 * The dev server must run with the same three KEYSTONE_ vars AND the site's own database on the local mongod with
 * its schedulers off (see keystone-animated-smoke.ts: .env.local's MONGODB_URI is the PRODUCTION tunnel).
 */
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
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
const ID = "993301";
const PW = "smoke-pass-1";

async function login(page: Page, u: string) {
  await page.goto(`${BASE}/login`);
  await page.fill("#u", u);
  await page.fill("#p", PW);
  await Promise.all([page.waitForURL((x) => !x.pathname.endsWith("/login")), page.click("button[type=submit], form button")]);
}

(async () => {
  const { ks, closeKs } = await import("../src/lib/keystone/db");
  const { saveSolution } = await import("../src/lib/keystone/store");
  const { Item, User, Solution, Activity } = await ks();
  await Promise.all([Item.deleteMany({ itemId: ID }), User.deleteMany({ username: { $in: ["lvl-owner", "lvl-rev"] } }), Solution.deleteMany({ itemId: ID }), Activity.deleteMany({ itemId: ID })]);
  const hash = await bcrypt.hash(PW, 10);
  await User.create([
    { username: "lvl-owner", name: "Smoke Owner", role: "evelyn", passwordHash: hash },
    { username: "lvl-rev", name: "Smoke Reviewer", role: "reviewer", passwordHash: hash },
  ]);
  const actor = { username: "lvl-owner", name: "Smoke Owner", role: "evelyn" as const };
  const now = new Date();
  await Item.create({
    itemId: ID, subject: "Mathematics", course: "Math 30-2", courseSource: "pipeline", levelWhy: "Probability of independent events with the complement rule belongs to Math 30-2.",
    itemType: "NR", questionHtml: "<p>Find the probability of at least one success.</p>", options: [], key: "0.58", keySource: "castle-rock", stage: "received",
    version: 0, releasedVersion: 0, releasedAnswer: "", evelynAnswer: "", standards: [], topic: "", showcase: false, source: "upload", order: 1, createdAt: now, updatedAt: now, lastActivityAt: now,
  });
  await saveSolution(ID, [{ kind: "short", md: "The probability is 0.58." }, { kind: "diploma", md: "Use the complement: $1 - 0.42 = 0.58$." }], actor, { submit: true, set: { evelynAnswer: "0.58" } });
  assert.equal((await Item.findOne({ itemId: ID }).lean())?.stage, "in_review", "seeded in review");

  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  try {
    // The phone width first: the level is changed in the wide pass.
    for (const width of [390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await login(page, "lvl-rev");
      await page.goto(`${BASE}/item/${ID}`);
      const head = page.locator(".ks-item-head");
      await head.getByText("Math 30-2").first().waitFor();
      assert.ok((await head.innerText()).includes("set by Evelyn from the question"), "the source of the level is shown");
      await head.locator("details.ks-level > summary").click();
      await page.screenshot({ path: path.join(SHOTS, `level-open-${width}.png`) });
      const box = await page.locator(".ks-level-form").boundingBox();
      assert.ok(box && box.x >= 0 && box.x + box.width <= width + 1, `the form fits the page at ${width}px (x ${box?.x}, w ${box?.width})`);
      if (width === 1280) {
        await page.fill(".ks-level-form input[name=level]", "Math 30-1");
        await page.fill(".ks-level-form input[name=note]", "It needs the binomial theorem.");
        await page.click(".ks-level-form button[type=submit]");
        await head.getByText("set in review").waitFor();
        await page.screenshot({ path: path.join(SHOTS, "level-changed-1280.png"), fullPage: true });
        const it = await Item.findOne({ itemId: ID }).lean();
        assert.equal(it?.course, "Math 30-1");
        assert.equal(it?.courseSource, "person");
        assert.equal(it?.stage, "changes_requested", "the solution in review went back to Evelyn");
        const v = await Activity.findOne({ itemId: ID, type: "verdict" }).sort({ createdAt: -1 }).lean();
        assert.equal(v?.body, "Level changed from Math 30-2 to Math 30-1. It needs the binomial theorem. Please write the solution to this level.");
      }
      await page.close();
    }
    console.log(`level smoke ok; screenshots in ${SHOTS}`);
  } finally {
    await browser.close();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
