/**
 * Keystone routing walk, safe on the live site: makes its own item (990001,
 * with a reading passage) and uses throwaway reviewer / tech sign-ins.
 *
 *   upload (passage shown) → Evelyn writes → reviewer: Item data, with markup
 *   pasted in the note (collapsed, renders as a table) → tech sees "Waiting on
 *   you", re-sends → back with Evelyn → revise → reviewer: Fix solution →
 *   revise → reviewer: Reject → reviewer: Approve (a decision can be changed).
 *
 *   KS_BASE=https://keystone.evelynlearning.com KS_PW_PRAVEEN=… \
 *   KS_REVIEWER=qa-reviewer KS_PW_REVIEWER=… KS_TECH=qa-tech KS_PW_TECH=… KS_SHOTS=<dir> \
 *   npx tsx apps/marketing/scripts/keystone-routing-e2e.ts
 *
 * Before: keystone-add-user.ts for the two throwaway users. After:
 * keystone-remove-item.ts 990001 --uploads-by praveen (and the tech's upload
 * rows, the users, their sessions, uploads/*Item990001* on the box).
 */
import { chromium, type Page } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";

const BASE = process.env.KS_BASE!;
const SHOTS = process.env.KS_SHOTS || "/tmp/ks-routing-shots";
const ITEM = "990001";
const USERS = {
  evelyn: { u: "praveen", p: process.env.KS_PW_PRAVEEN! },
  reviewer: { u: process.env.KS_REVIEWER || "qa-reviewer", p: process.env.KS_PW_REVIEWER! },
  tech: { u: process.env.KS_TECH || "qa-tech", p: process.env.KS_PW_TECH! },
};

let step = 0;
async function shot(page: Page, name: string) {
  step++;
  await page.screenshot({ path: path.join(SHOTS, `${String(step).padStart(2, "0")}-${name}.png`), fullPage: true });
}
function ok(cond: unknown, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}
async function signIn(page: Page, who: keyof typeof USERS) {
  await page.context().clearCookies();
  await page.goto(`${BASE}/login`);
  await page.fill("#u", USERS[who].u);
  await page.fill("#p", USERS[who].p);
  await Promise.all([page.waitForURL((u) => !u.pathname.endsWith("/login")), page.click("button:has-text('Sign in')")]);
  console.log(`${who} (${USERS[who].u}) signed in`);
}
const left = (page: Page) => page.waitForURL((u) => !u.pathname.endsWith(`/item/${ITEM}`) || u.search.length > 0);
const stageOf = async (page: Page) => {
  await page.goto(`${BASE}/item/${ITEM}`);
  return (await page.locator(".ks-item-head .ks-stage").innerText()).replace(/\s+/g, " ").trim();
};

async function testZip(): Promise<string> {
  const apip = `<?xml version="1.0" encoding="UTF-8"?><assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" identifier="item_${ITEM}" title="Item ${ITEM}" adaptive="false" timeDependent="false"><responseDeclaration identifier="RESPONSE" cardinality="single"><correctResponse><value>B</value></correctResponse></responseDeclaration><itemBody><rubricBlock id="passage_990" class="passage" view="candidate"><object type="text/html" data="passage_990.xml" /></rubricBlock><p>QA TEST ITEM, please ignore. According to the passage, when does the ferry leave?</p><choiceInteraction responseIdentifier="RESPONSE" maxChoices="1"><simpleChoice identifier="A"><p>At noon</p></simpleChoice><simpleChoice identifier="B"><p>At seven</p></simpleChoice></choiceInteraction></itemBody></assessmentItem>`;
  const meta = `<metadata><SYSTEM_ItemID>${ITEM}</SYSTEM_ItemID><SYSTEM_ItemType>Multiple Choice</SYSTEM_ItemType><SYSTEM_Subject>ELA</SYSTEM_Subject><SYSTEM_Grade>5</SYSTEM_Grade><SYSTEM_Course></SYSTEM_Course><keyword>QA TEST, please ignore</keyword></metadata>`;
  const passage = `<div class="passage" id="passage_990"><div class="title">The Morning Ferry</div><div class="content"><p><span class="passageRef" label="a_b">The ferry leaves the harbour at seven each morning.</span></p></div></div>`;
  const zip = new JSZip();
  zip.file(`Item${ITEM}/item_${ITEM}_apip.xml`, apip);
  zip.file(`Item${ITEM}/item_${ITEM}_metadata.xml`, meta);
  zip.file(`Item${ITEM}/passage_990.xml`, passage);
  const file = path.join(SHOTS, `Item${ITEM}.zip`);
  await writeFile(file, await zip.generateAsync({ type: "uint8array" }));
  return file;
}

async function upload(page: Page, zip: string) {
  await page.goto(`${BASE}/upload`);
  await page.setInputFiles("#files", zip);
  await page.click("button:has-text('Upload')");
  await page.waitForSelector(`.ks-note:has-text('Item${ITEM}.zip')`, { timeout: 60000 });
  return (await page.textContent(`.ks-note:has-text('Item${ITEM}.zip')`)) ?? "";
}

async function revise(page: Page, short: string, note: string) {
  await page.goto(`${BASE}/item/${ITEM}/edit`);
  await page.fill("#s_short", short);
  if (!(await page.inputValue("#s_diploma"))) await page.fill("#s_diploma", "QA TEST. The passage says the ferry leaves at seven, so the answer is B.");
  await page.fill("#evelynAnswer", "B");
  await page.fill("#note", note);
  await Promise.all([page.waitForURL(new RegExp(`/item/${ITEM}$`)), page.click("button:has-text('Save and send for review')")]);
}

const PASTED =
  'QA TEST: the postamble did not come through. <table width="250" border="0" id="Item1_x"><colgroup><col /><col /></colgroup> <tbody> <tr> <th align="center"><p id="Item1_y">Description</p></th><th align="center"><p>Structure Number</p></th> </tr> <tr> <td><p>A saturated and non-cyclic hydrocarbon</p></td> <td><p><span class="fill-in-the-blank">&nbsp;</span></p></td> </tr> <tr> <td><p>A carboxylic acid</p></td> <td><p>&nbsp;</p></td> </tr> <tr> <td><p>An aliphatic alkene</p></td> <td><p>&nbsp;</p></td> </tr> <tr> <td><p>An aromatic</p></td> <td><p>&nbsp;</p></td> </tr> </tbody> </table>';

async function main() {
  await mkdir(SHOTS, { recursive: true });
  const zip = await testZip();
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1366, height: 860 } })).newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  // 1. Evelyn uploads on the site; the passage arrives with the question.
  await signIn(page, "evelyn");
  ok((await upload(page, zip)).includes(ITEM), "upload on the site lists the test item");
  await page.goto(`${BASE}/item/${ITEM}`);
  ok(await page.isVisible(".ks-question .cr-passage:has-text('The ferry leaves the harbour at seven')"), "the reading passage is shown above the stem");
  ok((await page.locator(".ks-question .cr-passage-title").evaluate((e) => getComputedStyle(e).fontWeight)) >= "600", "passage title is styled");
  ok((await stageOf(page)) === "Received with Evelyn", "new item: Received · with Evelyn");
  await revise(page, "QA TEST. The ferry leaves at seven, so the answer is B.", "QA TEST: first version");
  ok((await stageOf(page)) === "In review with Castle Rock review", "sent for review: In review · with Castle Rock review");
  await shot(page, "evelyn-in-review");

  // 2. Reviewer: the four decisions are there; sending back needs a reason; Item data with pasted markup.
  await signIn(page, "reviewer");
  await page.goto(`${BASE}/item/${ITEM}`);
  for (const b of ["Approve", "Fix solution", "Item data", "Reject item"]) ok(await page.isVisible(`.ks-bar button:has-text('${b}')`), `review bar has '${b}'`);
  await page.locator("h1").click();
  await page.keyboard.press("d");
  ok(await page.evaluate(() => document.activeElement?.tagName === "TEXTAREA"), "D with an empty box puts the cursor in the box (reason required)");
  await page.keyboard.press("Escape");
  await page.click(".ks-bar button:has-text('Item data')");
  await page.waitForSelector(".ks-bar .msg");
  ok(/missing or wrong in the question/.test((await page.textContent(".ks-bar .msg")) ?? ""), "Item data without a reason is refused with a clear message");
  await page.fill(".ks-bar textarea", PASTED);
  await Promise.all([left(page), page.click(".ks-bar button:has-text('Item data')")]);
  ok((await stageOf(page)) === "Item data needed with Castle Rock technical", "Item data → Item data needed · with Castle Rock technical");
  const banner = page.locator(".ks-sentback");
  ok(/Item data needed · with Castle Rock technical/.test((await banner.textContent()) ?? ""), "banner on the item says what kind and whose move it is");
  const quote = page.locator(".ks-feed .ks-notebody").first();
  ok(!/<table|colgroup|id=/.test((await quote.innerText()) ?? ""), "pasted markup is not shown as tags");
  ok((await quote.locator("table").count()) === 1 && (await quote.locator("td:has-text('A carboxylic acid')").count()) === 1, "pasted markup renders as a table");
  const closed = (await quote.locator(".ks-quote").boundingBox())!.height;
  ok(closed < 120, `long note starts closed (${Math.round(closed)} px)`);
  await quote.locator("button:has-text('Show more')").click();
  const open = (await quote.locator(".ks-quote").boundingBox())!.height;
  ok(open > closed + 40 && (await quote.locator("button:has-text('Show less')").count()) === 1, `Show more opens it (${Math.round(open)} px)`);
  await shot(page, "reviewer-item-data");
  await page.goto(`${BASE}/items?stage=item_data`);
  const row = page.locator(`.ks-list tr:has(a:has-text('${ITEM}'))`);
  ok((await row.count()) === 1, "item is under the 'Item data needed' tab");
  ok(!/<table|colgroup/.test((await row.innerText()) ?? "") && (await row.boundingBox())!.height < 140, "list row shows the note as short plain text");
  await shot(page, "reviewer-list-item-data");

  // 3. Tech: 'Waiting on you' lists it; re-sending hands it back to Evelyn.
  await signIn(page, "tech");
  const waiting = page.locator("section.ks-waiting");
  ok(/Waiting on you: item data needed/.test((await waiting.textContent()) ?? "") && (await waiting.locator(`a:has-text('${ITEM}')`).count()) === 1, "tech overview: 'Waiting on you' lists the item");
  await shot(page, "tech-waiting");
  ok(/Updated: 990001/.test(await upload(page, zip)), "tech re-sends the item");
  ok((await stageOf(page)) === "Drafting with Evelyn", "re-sent item returns: Drafting · with Evelyn");
  ok(await page.isVisible(".ks-feed li:has-text('re-sent, now back with Evelyn')"), "history records the hand-back");

  // 4. Evelyn revises → reviewer: Fix solution → with Evelyn.
  await signIn(page, "evelyn");
  ok(await page.isVisible(`section:has(h2:has-text('Needs Evelyn')) a:has-text('${ITEM}')`), "Evelyn's 'Needs Evelyn' lists the returned item");
  await revise(page, "QA TEST. Seven; B.", "QA TEST: after the item was re-sent");
  await signIn(page, "reviewer");
  await page.goto(`${BASE}/item/${ITEM}`);
  await page.fill(".ks-bar textarea", "QA TEST: say the time in words.");
  await page.locator("h1").click();
  await Promise.all([left(page), page.keyboard.press("c")]);
  ok((await stageOf(page)) === "Solution changes with Evelyn", "C → Solution changes · with Evelyn");
  ok(await page.isVisible(".ks-feed li:has-text('asked for solution changes on')"), "history wording names the kind");
  await signIn(page, "evelyn");
  await revise(page, "QA TEST. The ferry leaves at seven in the morning, so the answer is B.", "QA TEST: time in words");

  // 5. Reviewer rejects the item, then changes the decision to approve.
  await signIn(page, "reviewer");
  await page.goto(`${BASE}/item/${ITEM}`);
  await page.fill(".ks-bar textarea", "QA TEST: the item itself is wrong.");
  await Promise.all([left(page), page.click(".ks-bar button:has-text('Reject item')")]);
  ok((await stageOf(page)) === "Rejected", "Reject → Rejected, nobody waited on");
  ok(/Rejected\./.test((await page.textContent(".ks-sentback")) ?? ""), "rejected banner shown");
  await shot(page, "reviewer-rejected");
  await page.goto(`${BASE}/items?stage=rejected`);
  ok((await page.locator(`.ks-list a:has-text('${ITEM}')`).count()) === 1, "item is under the 'Rejected' tab");
  await page.goto(`${BASE}/item/${ITEM}`);
  await page.locator("h1").click();
  await Promise.all([left(page), page.keyboard.press("a")]);
  ok((await stageOf(page)) === "Approved", "a decision can be changed: A → Approved");

  ok(errors.length === 0, `no browser errors${errors.length ? ": " + errors.join(" | ") : ""}`);
  await browser.close();
  console.log("ROUTING WALK PASSED");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
