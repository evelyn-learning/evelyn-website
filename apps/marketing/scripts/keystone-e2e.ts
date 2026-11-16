/**
 * Keystone end-to-end walk: upload → Evelyn writes → reviewer comments and
 * asks for changes → Evelyn revises → reviewer approves → tech downloads and
 * marks delivered → Evelyn's overview shows it all.
 *
 *   KS_BASE=http://keystone.localhost:3036 KS_ZIP=~/Downloads/Item146799.zip \
 *   KS_PW_PRAVEEN=… KS_PW_JULIE=… KS_PW_VANCE=… KS_SHOTS=/tmp/ks-shots \
 *   npx tsx apps/marketing/scripts/keystone-e2e.ts
 *
 * Leaves the test item in the database; remove it with keystone-remove-item.ts.
 */
import { chromium, type Page } from "playwright";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";

const BASE = process.env.KS_BASE!;
const ZIP = process.env.KS_ZIP!;
const SHOTS = process.env.KS_SHOTS || "/tmp/ks-shots";
const PW = { praveen: process.env.KS_PW_PRAVEEN!, julie: process.env.KS_PW_JULIE!, vance: process.env.KS_PW_VANCE! };
const ITEM = path.basename(ZIP).match(/(\d+)/)![1];

let step = 0;
async function shot(page: Page, name: string) {
  step++;
  await page.screenshot({ path: path.join(SHOTS, `${String(step).padStart(2, "0")}-${name}.png`), fullPage: true });
}
function ok(cond: unknown, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}
async function signIn(page: Page, user: keyof typeof PW) {
  await page.context().clearCookies();
  await page.goto(`${BASE}/login`);
  await page.fill("#u", user);
  await page.fill("#p", PW[user]);
  const t = Date.now();
  await Promise.all([page.waitForURL((u) => !u.pathname.endsWith("/login")), page.click("button:has-text('Sign in')")]);
  console.log(`${user} signed in (${Date.now() - t} ms)`);
}
async function timedGoto(page: Page, url: string) {
  const t = Date.now();
  await page.goto(url, { waitUntil: "load" });
  return Date.now() - t;
}

async function main() {
  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1366, height: 860 }, acceptDownloads: true })).newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  // 1. Evelyn uploads the zip.
  await signIn(page, "praveen");
  await shot(page, "evelyn-overview-before");
  await page.goto(`${BASE}/upload`);
  await page.setInputFiles("#files", ZIP);
  await page.click("button:has-text('Upload')");
  await page.waitForSelector(`.ks-note:has-text('${path.basename(ZIP)}')`, { timeout: 60000 });
  const uploadText = await page.textContent(".ks-note");
  ok(uploadText?.includes(ITEM), `upload lists item ${ITEM}`);
  await shot(page, "upload-result");

  // 2. The question arrives; Evelyn writes the solution.
  await page.goto(`${BASE}/item/${ITEM}`);
  ok(await page.isVisible("text=Question"), "item page shows the question");
  await shot(page, "item-received");
  await page.click(".ks-item-head a.ks-btn");
  await page.fill("#s_short", "E2E TEST — short answer with $x^2$ inline.");
  await page.fill("#s_diploma", "E2E TEST — diploma answer.\n\n$$\\frac{6!}{3!\\,2!} = 60$$");
  await page.fill("#s_errors", "- E2E TEST common error.");
  await page.fill("#evelynAnswer", "E2E");
  await Promise.all([page.waitForURL(new RegExp(`/item/${ITEM}$`)), page.click("button:has-text('Save and send for review')")]);
  ok(await page.isVisible(".ks-chip.s-in_review"), "stage is In review after sending");
  ok((await page.locator(".katex").count()) > 0, "LaTeX rendered with KaTeX");

  // 3. Reviewer: overview, comment, ask for changes.
  await signIn(page, "julie");
  console.log("  at", page.url()); await shot(page, "julie-after-login");
  const waitingText = await page.textContent(".ks-hero");
  ok(/waiting for your review/.test(waitingText || ""), "reviewer overview leads with the waiting count");
  await shot(page, "reviewer-overview");
  const ms = await timedGoto(page, `${BASE}/item/${ITEM}`);
  console.log(`  item page load ${ms} ms`);
  await shot(page, "reviewer-item");
  await page.fill(".ks-bar textarea", "E2E TEST comment: the diploma answer reads well.");
  await page.click(".ks-bar button:has-text('Comment')");
  await page.waitForSelector(".ks-feed li:has-text('E2E TEST comment')");
  ok(true, "comment appears in the history");
  await page.fill(".ks-bar textarea", "E2E TEST change: please shorten the short answer.");
  await Promise.all([page.waitForURL((u) => !u.pathname.endsWith(`/item/${ITEM}`) || u.search.length > 0), page.click(".ks-bar button:has-text('Needs changes')")]);
  console.log(`  after Needs changes → ${page.url()}`);

  // 4. Evelyn sees the request and revises.
  await signIn(page, "praveen");
  ok(await page.isVisible(`.ks-list a:has-text('${ITEM}')`), "Evelyn's 'Needs Evelyn' lists the item");
  ok(await page.isVisible("text=please shorten the short answer"), "Evelyn sees the reviewer's change request");
  await shot(page, "evelyn-overview-changes");
  await page.goto(`${BASE}/item/${ITEM}/edit`);
  await page.fill("#s_short", "E2E TEST — shorter.");
  await page.fill("#note", "E2E TEST: shortened as asked");
  await Promise.all([page.waitForURL(new RegExp(`/item/${ITEM}$`)), page.click("button:has-text('Save and send for review')")]);
  ok(await page.isVisible("text=v2"), "version 2 saved");

  // 5. Reviewer approves with the keyboard.
  await signIn(page, "julie");
  await page.goto(`${BASE}/item/${ITEM}`);
  await page.locator("body").click({ position: { x: 5, y: 5 } });
  await Promise.all([page.waitForURL((u) => !u.pathname.endsWith(`/item/${ITEM}`) || u.search.length > 0), page.keyboard.press("a")]);
  console.log(`  after A → ${page.url()}`);

  // 6. Tech downloads and marks delivered.
  await signIn(page, "vance");
  await shot(page, "tech-overview");
  await page.goto(`${BASE}/export`);
  ok(await page.isVisible(`.ks-list a:has-text('${ITEM}')`), "approved item is listed for SOLARO");
  await shot(page, "tech-export");
  const [download] = await Promise.all([page.waitForEvent("download"), page.click(`a[href*='ids=${ITEM}']`)]);
  const file = path.join(SHOTS, download.suggestedFilename());
  await download.saveAs(file);
  const zip = await JSZip.loadAsync(await readFile(file));
  ok(!!zip.file(`${ITEM}/solution.html`), "download has solution.html");
  ok((await zip.file(`${ITEM}/solution.html`)!.async("string")).includes("solution_step"), "solution.html uses the solution_step markup");
  ok(!!zip.file("manifest.csv"), "download has manifest.csv");
  for (const cb of await page.locator("input[name=itemId]").all()) {
    if ((await cb.getAttribute("value")) !== ITEM) await cb.uncheck();
  }
  await page.click("button:has-text('Mark ticked items as delivered')");
  await page.waitForSelector(`section:has(h2:has-text('Already delivered')) a:has-text('${ITEM}')`);
  ok(true, "item marked delivered");
  await shot(page, "tech-export-after");

  // 7. Evelyn's overview shows Castle Rock's actions.
  await signIn(page, "praveen");
  const feed = await page.textContent("section:has(h2:has-text('From Castle Rock'))");
  ok(/Julie May approved/.test(feed || ""), "Evelyn's feed shows the approval");
  ok(/Vance Schamehorn/.test(feed || ""), "Evelyn's feed shows the tech's actions");
  await shot(page, "evelyn-overview-after");
  await page.goto(`${BASE}/item/${ITEM}`);
  ok(await page.isVisible(".ks-chip.s-delivered"), "item stage is Delivered");
  await shot(page, "item-delivered");

  console.log(errors.length ? `Browser errors:\n${errors.join("\n")}` : "No browser errors.");
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
