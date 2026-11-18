/**
 * Keystone pipeline walk: Praveen's queue (the owner's final look) and what Castle Rock's reviewer can see.
 * LOCAL ONLY. It refuses to run unless the database is castle_rock_review_test on 127.0.0.1:27017 and the
 * site is on localhost, so it can never write to production.
 *
 *   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 KEYSTONE_DB_NAME=castle_rock_review_test \
 *   KS_BASE=http://localhost:3047/keystone KS_SHOTS=<dir> npx tsx apps/marketing/scripts/keystone-pipeline-e2e.ts
 *
 * (a `next dev` of apps/marketing on that port, started with the same two KEYSTONE_ variables.)
 *
 * It creates throwaway items 990015 (held: failed a check twice), 990016 (clean, going out by itself) and
 * 990017 (held: sample), a run record for 990015, and two users (qa-owner: Evelyn, qa-reviewer: reviewer),
 * and removes all of it at the end, also on failure. It refuses to start if any of them already exists.
 *
 *   owner sees 990015 under "Waiting for you" with "Failed a check twice" → Keep holding (990017) → "Seen …"
 *   → Send back (990017) with a note → "Sent back by you: …" → reviewer: 990015 is Drafting, no solution text,
 *   no pipeline word, flag, run id anywhere in the HTML or the page data; /queue gives the overview; the owner's
 *   own action request replayed with the reviewer's session is refused → owner: Send to review → In review;
 *   the same request again is harmless → reviewer sees the solution → owner: Hold this one (990016) → it moves
 *   to "Waiting for you" → the item page's Checks panel and the B key.
 */
import { randomBytes } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import { chromium, type BrowserContext, type Page, type Request } from "playwright";

const DB = "castle_rock_review_test";
const URI = process.env.KEYSTONE_MONGODB_URI ?? "";
if (process.env.KEYSTONE_DB_NAME !== DB || !/^mongodb:\/\/127\.0\.0\.1:27017\/?$/.test(URI)) {
  console.error(`keystone-pipeline-e2e refused to run: needs KEYSTONE_DB_NAME=${DB} and KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 (got "${process.env.KEYSTONE_DB_NAME ?? "unset"}" on "${URI || "unset"}").`);
  process.exit(1);
}
const BASE = process.env.KS_BASE ?? "";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+\/keystone$/.test(BASE)) {
  console.error(`keystone-pipeline-e2e refused to run: KS_BASE must be a local dev server, http://localhost:<port>/keystone (got "${BASE || "unset"}").`);
  process.exit(1);
}
const SHOTS = process.env.KS_SHOTS || "/tmp/ks-pipeline-shots";

const HELD = "990015";
const CLEAN = "990016";
const SAMPLE = "990017";
const IDS = [HELD, CLEAN, SAMPLE];
const RUN_ID = "e2e-run-990015";
const SOLUTION = "QA SOLUTION TEXT 990015";
const NOTE = "QA NOTE: say the units in the short answer.";
const USERS = {
  owner: { u: "qa-owner", name: "QA owner", role: "evelyn" as const, p: randomBytes(12).toString("base64url") },
  reviewer: { u: "qa-reviewer", name: "QA reviewer", role: "reviewer" as const, p: randomBytes(12).toString("base64url") },
};
/** Nothing a reviewer receives may contain any of these. */
const FORBIDDEN = ["second_failure", "heldFor", "pipeline", "Failed a check twice", "Random sample", RUN_ID, "Sent back by you", NOTE, "Your queue", "Checks"];

function ok(cond: unknown, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}
const text = async (page: Page, sel: string) => ((await page.locator(sel).first().innerText()) ?? "").replace(/\s+/g, " ").trim();

async function signIn(ctx: BrowserContext, who: keyof typeof USERS): Promise<Page> {
  await ctx.clearCookies();
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto(`${BASE}/login`);
  await page.fill("#u", USERS[who].u);
  await page.fill("#p", USERS[who].p);
  await Promise.all([page.waitForURL((u) => !u.pathname.endsWith("/login")), page.click("button:has-text('Sign in')")]);
  console.log(`${who} (${USERS[who].u}) signed in`);
  return page;
}

type Captured = { url: string; headers: Record<string, string>; body: Buffer };
/** Records the next server-action POST the page makes (to replay it later with another session). */
function captureAction(page: Page): () => Captured {
  let got: Captured | null = null;
  const on = (r: Request) => {
    const h = r.headers();
    if (r.method() === "POST" && h["next-action"] && !got) {
      got = { url: r.url(), headers: Object.fromEntries(Object.entries(h).filter(([k]) => ["next-action", "content-type", "accept", "next-router-state-tree"].includes(k))), body: r.postDataBuffer() ?? Buffer.from("") };
    }
  };
  page.on("request", on);
  return () => {
    page.off("request", on);
    if (!got) throw new Error("no server action request was seen");
    return got;
  };
}
const replay = async (ctx: BrowserContext, c: Captured) => {
  const res = await ctx.request.post(c.url, { headers: c.headers, data: c.body });
  return { status: res.status(), body: await res.text() };
};

/** Everything the reviewer's browser gets for a page: the HTML (with its inline page data) and the client-navigation payload. */
async function everythingFor(ctx: BrowserContext, url: string): Promise<string> {
  const html = await (await ctx.request.get(url)).text();
  const rsc = await (await ctx.request.get(url, { headers: { RSC: "1" } })).text();
  return `${html}\n${rsc}`;
}

async function main() {
  const { ks, closeKs } = await import("../src/lib/keystone/db");
  const { Item, Solution, Activity, Run, User, Session } = await ks();
  if (Item.db.name !== DB) throw new Error(`connected to ${Item.db.name}, not ${DB}`);
  if (await Item.exists({ itemId: { $in: IDS } })) throw new Error(`an item ${IDS.join("/")} already exists in ${DB}; remove it first`);
  if (await User.exists({ username: { $in: [USERS.owner.u, USERS.reviewer.u] } })) throw new Error("qa-owner or qa-reviewer already exists in the test database; remove it first");

  let created = false;
  const cleanup = async () => {
    if (!created) return;
    await Item.deleteMany({ itemId: { $in: IDS } });
    await Solution.deleteMany({ itemId: { $in: IDS } });
    await Activity.deleteMany({ itemId: { $in: IDS } });
    await Run.deleteMany({ itemId: { $in: IDS } });
    await User.deleteMany({ username: { $in: [USERS.owner.u, USERS.reviewer.u] } });
    await Session.deleteMany({ username: { $in: [USERS.owner.u, USERS.reviewer.u] } });
    console.log("cleaned up: items, solutions, activity, runs, users, sessions");
  };

  const browser = await chromium.launch();
  try {
    created = true;
    for (const u of Object.values(USERS)) await User.create({ username: u.u, name: u.name, role: u.role, passwordHash: await bcrypt.hash(u.p, 10) });
    const t0 = new Date(Date.now() - 3 * 86400_000);
    const mk = async (itemId: string, order: number, pipeline: Record<string, unknown>) => {
      await Item.create({
        itemId, subject: "Mathematics", course: "Math 30-1", courseSource: "sheet", itemType: "MC", topic: "QA TEST", standards: [], key: "B",
        evelynAnswer: "B", keySource: "castle-rock", questionHtml: `<p>QA TEST ITEM ${itemId}, please ignore. Which is right?</p>`,
        options: [{ label: "A", html: "<p>Left</p>" }, { label: "B", html: "<p>Right</p>" }], stage: "ready", version: 1, releasedVersion: 0, releasedAnswer: "",
        receivedAt: t0, showcase: false, source: "upload", order: 900000 + order, createdAt: t0, updatedAt: t0, lastActivityAt: t0, pipeline,
      });
      await Solution.create({ itemId, version: 1, sections: [{ kind: "short", md: SOLUTION, html: `<p>${SOLUTION} (${itemId})</p>` }], author: "Evelyn Learning", createdAt: t0, runId: RUN_ID });
      await Activity.create({ itemId, version: 1, type: "revision", body: "Solution written.", username: "pipeline", name: "Evelyn Learning", role: "evelyn", createdAt: t0 });
    };
    await mk(HELD, 1, { flags: ["second_failure"], heldFor: "praveen", passedAt: t0, runId: RUN_ID });
    await mk(CLEAN, 2, { flags: [], passedAt: t0, releaseAt: new Date(Date.now() + 2 * 86400_000) });
    await mk(SAMPLE, 3, { flags: ["sample"], heldFor: "praveen", passedAt: t0 });
    await Run.create({
      itemId: HELD, runId: RUN_ID, startedAt: t0, finishedAt: t0, mode: "fresh", startedFrom: { stage: "received", version: 0, updatedAt: t0 },
      corrections: 1, result: "held", flags: ["second_failure"], cost: 0.21, assetsChecked: true,
      steps: [
        { step: "solve", key: "solve#1", at: t0, ok: true, cost: 0.1, model: "qa-model-1+qa-model-2", output: {
          decision: { outcome: "pass", answer: { kind: "choice", letters: ["B"] }, confirm: false },
          solves: { solver1: { ok: true, value: { answer: { kind: "choice", letters: ["B"] } }, model: "qa-model-1" }, solver2: { ok: true, value: { answer: { kind: "choice", letters: ["B"] } }, model: "qa-model-2" } },
        } },
        { step: "audit", key: "audit#1", at: t0, ok: true, cost: 0.05, output: { findings: [{ check: "audit", code: "rule", ruleId: "R3", quote: "clearly", detail: "QA finding: avoid 'clearly'" }] } },
        { step: "audit", key: "audit#2", at: t0, ok: false, cost: 0.06, output: { failed: "QA: the check failed the second time" } },
      ],
    });
    await mkdir(SHOTS, { recursive: true });

    const ownerCtx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const reviewerCtx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const errors: string[] = [];
    for (const c of [ownerCtx, reviewerCtx]) c.on("page", (p) => p.on("pageerror", (e) => errors.push(e.message)));
    await ownerCtx.newPage();
    await reviewerCtx.newPage();

    // 1. Owner: the queue.
    let owner = await signIn(ownerCtx, "owner");
    // Other tests may share the test database: at least our two held items.
    const navCount = Number(/Queue · (\d+)/.exec(await text(owner, ".ks-nav"))?.[1] ?? -1);
    ok(navCount >= 2, `top bar: Queue · ${navCount} for the owner`);
    ok(/Your queue: \d+ waiting for you/.test(await text(owner, ".ks-q-line")), "overview: one-line queue summary");
    await owner.goto(`${BASE}/queue`);
    const heldRow = owner.locator(`#waiting li[data-item="${HELD}"]`);
    ok((await heldRow.count()) === 1, "990015 is under 'Waiting for you'");
    const heldText = (await heldRow.innerText()).replace(/\s+/g, " ");
    ok(heldText.includes("Failed a check twice"), "with its reason: Failed a check twice");
    ok(/Solver 1 B/.test(heldText) && /Solver 2 B/.test(heldText) && /Key B/.test(heldText) && /0 findings/.test(heldText) && /1 check could not run/.test(heldText), `solver answers vs key and the findings count (${heldText.slice(0, 160)}…)`);
    ok((await owner.locator(`#going li[data-item="${CLEAN}"]`).count()) === 1, "990016 is under 'Going out by itself'");
    ok(/Goes to review \w{3} \w{3} \d+, \d+:\d\d (am|pm) PT/.test(await owner.locator(`#going li[data-item="${CLEAN}"]`).innerText()), "with its release time in Pacific");
    ok((await owner.locator("#waiting li.ks-q-row").first().getAttribute("data-item")) === HELD, "flagged before sample-only");
    await owner.screenshot({ path: path.join(SHOTS, "queue-desktop.png"), fullPage: true });

    // 2. Keep holding (990017): "Seen …"; the request is kept to replay as the reviewer.
    let cap = captureAction(owner);
    await Promise.all([owner.waitForSelector(".ks-q-done"), owner.locator(`#waiting li[data-item="${SAMPLE}"] button:has-text('Keep holding')`).click()]);
    const keepReq = cap();
    ok(/Seen \w{3} \w{3} \d+, \d+:\d\d (am|pm) PT/.test(await owner.locator(`#waiting li[data-item="${SAMPLE}"]`).innerText()), "Keep holding → the row shows 'Seen …'");
    ok((await owner.locator("#waiting li.ks-q-row").last().getAttribute("data-item")) === SAMPLE, "a seen row sorts below unseen rows");
    const seenAt = (await Item.findOne({ itemId: SAMPLE }).lean<{ pipeline: { seenAt?: Date } }>())?.pipeline?.seenAt;
    ok(seenAt instanceof Date, "seenAt stored");

    // 3. Send back (990017) with a note.
    const sampleRow = owner.locator(`#waiting li[data-item="${SAMPLE}"]`);
    await sampleRow.locator("summary:has-text('Send back')").click();
    await sampleRow.locator("textarea[name=note]").fill(NOTE);
    await Promise.all([owner.waitForURL(/done=sentback/), sampleRow.locator("button:has-text('Send back to the pipeline')").click()]);
    ok((await owner.locator(`#waiting li[data-item="${SAMPLE}"]`).innerText()).includes(`Sent back by you: ${NOTE}`), "Send back → 'Sent back by you: <note>'");
    {
      const it = await Item.findOne({ itemId: SAMPLE }).lean<{ stage: string; pipeline: Record<string, unknown> }>();
      ok(it?.stage === "ready" && it.pipeline.fixNote === NOTE && (it.pipeline.flags as string[]).includes("owner_sent_back") && (it.pipeline.flags as string[]).includes("sample"), "stored: stage ready, fixNote, flag owner_sent_back, sample kept");
    }

    // 4. Phone width: rows wrap, no sideways scroll.
    await owner.setViewportSize({ width: 380, height: 800 });
    await owner.goto(`${BASE}/queue`);
    const sideways = await owner.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await owner.screenshot({ path: path.join(SHOTS, "queue-phone.png"), fullPage: true });
    ok(sideways <= 0, `no horizontal scroll at 380 px (overflow ${sideways} px)`);
    await owner.setViewportSize({ width: 1366, height: 900 });

    // 5. Reviewer: Drafting, no solution, nothing internal; no queue.
    const reviewer = await signIn(reviewerCtx, "reviewer");
    await reviewer.goto(`${BASE}/item/${HELD}`);
    ok((await text(reviewer, ".ks-item-head .ks-stage")) === "Drafting with Evelyn", "reviewer sees 990015 as Drafting · with Evelyn");
    ok(!(await reviewer.locator("body").innerText()).includes(SOLUTION), "no solution text visible");
    ok((await reviewer.locator(".ks-checks, .ks-owner").count()) === 0, "no Checks panel and no hold box");
    for (const id of [HELD, SAMPLE]) {
      const all = await everythingFor(reviewerCtx, `${BASE}/item/${id}`);
      ok(!all.includes(SOLUTION), `item ${id}: no solution text anywhere in the HTML or page data`);
      const leaks = FORBIDDEN.filter((w) => all.includes(w));
      ok(leaks.length === 0, `item ${id}: none of ${FORBIDDEN.length} internal words in the HTML or page data${leaks.length ? ` (found: ${leaks.join(", ")})` : ""}`);
    }
    {
      const all = await everythingFor(reviewerCtx, `${BASE}/`);
      const leaks = FORBIDDEN.filter((w) => all.includes(w));
      ok(leaks.length === 0, `overview: no internal words${leaks.length ? ` (found: ${leaks.join(", ")})` : ""}`);
    }
    await reviewer.goto(`${BASE}/queue`);
    ok(new URL(reviewer.url()).pathname.replace(/\/$/, "") === "/keystone", `/queue gives the reviewer the overview (${reviewer.url()})`);
    ok(!(await reviewer.locator(".ks-nav").innerText()).includes("Queue"), "no Queue link for the reviewer");
    const refused = await replay(reviewerCtx, keepReq);
    ok(refused.body.includes("Only Evelyn can do that."), `the owner's Keep holding request with the reviewer's session is refused (HTTP ${refused.status})`);
    ok((await Item.findOne({ itemId: SAMPLE }).lean<{ pipeline: { seenAt?: Date } }>())?.pipeline?.seenAt === undefined, "and nothing was written (seenAt still cleared by the send-back)");

    // 6. Owner: Send to review → In review; the same request again is harmless.
    owner = ownerCtx.pages()[0];
    await owner.goto(`${BASE}/queue`);
    cap = captureAction(owner);
    await owner.locator(`#waiting li[data-item="${HELD}"] button:has-text('Send to review')`).click();
    await owner.waitForFunction(() => /done=sent(&|$)/.test(location.search) || !!document.querySelector(".ks-err"), null, { timeout: 30000 });
    ok(/done=sent(&|$)/.test(new URL(owner.url()).search), `Send to review went through${(await owner.locator(".ks-err").count()) ? `: ${await owner.locator(".ks-err").first().innerText()}` : ""}`);
    const sendReq = cap();
    ok((await owner.locator(`#waiting li[data-item="${HELD}"]`).count()) === 0, "it left 'Waiting for you'");
    await owner.goto(`${BASE}/item/${HELD}`);
    ok((await text(owner, ".ks-item-head .ks-stage")) === "In review with Castle Rock review", "Send to review → In review · with Castle Rock review");
    const again = await replay(ownerCtx, sendReq);
    // The action returns { go: "…?done=already" } and no error message.
    ok(again.status === 200 && /"go":"[^"]*done=already"/.test(again.body) && !/"error":"(?!\$undefined)/.test(again.body), `a second Send to review is harmless: told 'already' (HTTP ${again.status})`);
    ok((await Activity.countDocuments({ itemId: HELD, body: "Sent for review." })) === 1, "one 'Sent for review.' row");
    const stillFlags = (await Item.findOne({ itemId: HELD }).lean<{ pipeline: { flags: string[]; heldFor?: string } }>())?.pipeline;
    ok(stillFlags?.flags.includes("second_failure") && !stillFlags.heldFor, "hold cleared, flags kept as history");

    // 7. Reviewer now sees the solution, and still nothing internal.
    await reviewer.goto(`${BASE}/item/${HELD}`);
    ok((await text(reviewer, ".ks-item-head .ks-stage")) === "In review with Castle Rock review", "reviewer: In review");
    ok((await reviewer.locator(".ks-section").innerText()).includes(SOLUTION), "reviewer now sees the solution");
    ok(await reviewer.isVisible(".ks-feed li:has-text('QA owner')"), "reviewer's history: the ordinary sent-for-review row by the owner");
    {
      const all = await everythingFor(reviewerCtx, `${BASE}/item/${HELD}`);
      const leaks = FORBIDDEN.filter((w) => all.includes(w));
      ok(leaks.length === 0, `released item: no internal words${leaks.length ? ` (found: ${leaks.join(", ")})` : ""}`);
    }

    // 8. Owner: Hold this one (990016) → Waiting for you.
    await owner.goto(`${BASE}/queue`);
    await Promise.all([owner.waitForURL(/done=held/), owner.locator(`#going li[data-item="${CLEAN}"] button:has-text('Hold this one')`).click()]);
    ok((await owner.locator(`#waiting li[data-item="${CLEAN}"]`).innerText()).includes("Held by you"), "Hold this one → under 'Waiting for you', 'Held by you'");
    ok((await owner.locator(`#going li[data-item="${CLEAN}"]`).count()) === 0, "and no longer going out by itself");

    // 9. Owner: the item page of a held item: the hold, the Checks panel, B focuses the note box.
    await owner.goto(`${BASE}/item/${SAMPLE}`);
    ok((await text(owner, ".ks-owner")).includes(`Sent back by you: ${NOTE}`), "item page: the hold box with the reason");
    await owner.goto(`${BASE}/item/${CLEAN}`);
    ok((await text(owner, ".ks-checks")).includes("No pipeline run on this item yet"), "Checks panel: empty state");
    await owner.goto(`${BASE}/item/${HELD}`);
    const checks = await text(owner, ".ks-checks");
    ok(/Blind solves/.test(checks) && /Solver 1: B/.test(checks) && /Key: B/.test(checks), "Checks panel: solver answers vs key");
    ok(/R3/.test(checks) && /clearly/.test(checks) && /Could not run: QA: the check failed the second time/.test(checks) && /1 correction/.test(checks), "Checks panel: findings, the failed step, corrections");
    await owner.goto(`${BASE}/item/${CLEAN}`);
    await owner.locator("h1").click();
    await owner.keyboard.press("b");
    ok(await owner.evaluate(() => document.activeElement?.id === "ks-owner-note"), "B on a held item opens the note box and puts the cursor there");
    await owner.keyboard.press("Escape");

    ok(errors.length === 0, `no browser errors${errors.length ? ": " + errors.join(" | ") : ""}`);
    console.log("PIPELINE QUEUE WALK PASSED");
  } finally {
    await browser.close().catch(() => {});
    await cleanup();
    await closeKs();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
