// Database test: an uploaded QTI package as the 2026-11-23 batch sent it (readQtiZip → ingestQtiItems).
// Images in the choices, in a passage file and as TIF all reach the page; the typesetting note is dropped; a choice
// item the exporter emptied is filled from Castle Rock's source file; a difference from the source is recorded.
// Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses castle_rock_review_test and only item ids 9923xx; deletes only what it created.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import JSZip from "jszip";
import sharp from "sharp";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`ingest.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
process.env.KEYSTONE_DB_NAME = "castle_rock_review_test";
const DATA = path.join(tmpdir(), "ks-test-data-ingest");
process.env.KEYSTONE_DATA_DIR = DATA;
delete process.env.KEYSTONE_READONLY;

const ACTOR = { username: "praveen", name: "Evelyn Learning", role: "evelyn" as const };
const IDS = ["992301", "992302", "992303"];
const META = (id: string) => `<metadata><SYSTEM_ItemID>${id}</SYSTEM_ItemID><SYSTEM_Subject>MATH</SYSTEM_Subject><SYSTEM_Grade>11</SYSTEM_Grade><SYSTEM_ItemType>Multiple Choice</SYSTEM_ItemType></metadata>`;
const head = (id: string, key: string) =>
  `<?xml version="1.0" encoding="UTF-8"?><assessmentItem identifier="item_${id}">${key ? `<responseDeclaration identifier="RESPONSE" cardinality="single"><correctResponse><value>${key}</value></correctResponse></responseDeclaration>` : ""}<itemBody>`;
const choices = (labels: string[], body: (l: string) => string) =>
  `<choiceInteraction responseIdentifier="RESPONSE" maxChoices="1">${labels.map((l) => `<simpleChoice identifier="${l}">${body(l)}</simpleChoice>`).join("")}</choiceInteraction>`;
const SOURCE = (id: string, stem: string, correct: string) =>
  `<?xml version="1.0" encoding="UTF-8"?><Package><Item><Item_ID>${id}</Item_ID><Preamble /><QuestionStem><html><p>${stem}</p></html></QuestionStem><Postamble /><Question><Multiple_Choice>${["A", "B", "C", "D"]
    .map((l) => `<Distractor Identifier="${l}" Correct="${l === correct}"><DistractorContent><html><p>${l === correct ? "330&deg;" : `${l}0&deg;`}</p></html></DistractorContent></Distractor>`)
    .join("")}</Multiple_Choice></Question></Item></Package>`;

(async () => {
  const { ks, closeKs } = await import("./db");
  const { readQtiZip } = await import("./qti");
  const { ingestQtiItems } = await import("./store");
  const { intakeCode } = await import("./pipeline/intake");
  const { Item, Activity } = await ks();
  assert.equal(Item.db.name, "castle_rock_review_test", "must run against the test database");
  const clean = () => Promise.all([Item.deleteMany({ itemId: { $in: IDS } }), Activity.deleteMany({ itemId: { $in: IDS } })]);
  await clean();
  try {
    const png = await sharp({ create: { width: 4, height: 4, channels: 3, background: "#fff" } }).png().toBuffer();
    const tif = await sharp({ create: { width: 4, height: 4, channels: 3, background: "#000" } }).tiff().toBuffer();
    const zip = new JSZip();

    // 992301: images in every choice, a passage whose figure lives in the passage file, a TIF in their solution, a typesetting note.
    const a = zip.folder("992301")!;
    a.file("item_992301_apip.xml",
      head("992301", "B") +
        `<rubricBlock class="passage" view="candidate"><object type="text/html" data="passage_1.xml" /></rubricBlock>` +
        `<p>Which number line? <span class="procinst">castlefo keep-with-next.within-column="8"</span></p>` +
        choices(["A", "B", "C", "D"], (l) => `<p><img src="resources/Opt_${l}.jpg" alt="" /></p>`) +
        `</itemBody><modalFeedback outcomeIdentifier="FEEDBACK" showHide="show" identifier="solution"><p>See <img src="resources/Sol_1.tif" alt="" /></p></modalFeedback></assessmentItem>`);
    a.file("item_992301_metadata.xml", META("992301"));
    a.file("passage_1.xml", `<div class="passage"><div class="content"><p>The graph. <img src="resources/Graph_1.png" alt="" /></p></div></div>`);
    for (const l of ["A", "B", "C", "D"]) a.file(`resources/Opt_${l}.jpg`, png);
    a.file("resources/Graph_1.png", png);
    a.file("resources/Sol_1.tif", tif);

    // 992302: the exporter could not write the interaction (no choices, no key); the source file has them.
    const b = zip.folder("992302")!;
    b.file("item_992302_apip.xml", head("992302", "") + `<p>What is the other angle with the same sine as 210°?</p><!--Unknown Tech-Enchanced Item. Cannot generate correct interaction.--></itemBody></assessmentItem>`);
    b.file("item_992302_metadata.xml", META("992302"));
    b.file("item_992302_original.txt", SOURCE("992302", "What is the other angle with the same sine as 210&deg;?", "D"));

    // 992303: the QTI key disagrees with the source.
    const c = zip.folder("992303")!;
    c.file("item_992303_apip.xml", head("992303", "A") + `<p>Pick one.</p>` + choices(["A", "B", "C", "D"], (l) => `<p>${l === "D" ? "330°" : `${l}0°`}</p>`) + `</itemBody></assessmentItem>`);
    c.file("item_992303_metadata.xml", META("992303"));
    c.file("item_992303_original.txt", SOURCE("992303", "Pick one.", "D"));

    const parsed = await readQtiZip(await zip.generateAsync({ type: "uint8array" }));
    assert.equal(parsed.items.length, 3, "three items read");
    const res = await ingestQtiItems(parsed.items, ACTOR, "dbtest-ingest");
    assert.deepEqual(res.created.sort(), IDS, "all three created");

    const one = (await Item.findOne({ itemId: "992301" }).lean())!;
    for (const o of one.options) assert.match(o.html, /src="\/api\/keystone\/asset\/992301\/Opt_[A-D]\.jpg"/, `choice ${o.label} image linked to our copy`);
    const choiceJson = JSON.stringify(one.interactions);
    assert.ok(!choiceJson.includes('src=\\"resources/'), "no raw image path left in the interactions");
    assert.match(one.questionHtml, /src="\/api\/keystone\/asset\/992301\/Graph_1\.png"/, "the passage's figure is linked");
    assert.ok(existsSync(path.join(DATA, "assets", "992301", "Graph_1.png")), "the passage's figure is saved");
    assert.match(one.castleRockSolutionHtml ?? "", /Sol_1\.png"/, "their TIF is shown as a PNG");
    assert.ok(existsSync(path.join(DATA, "assets", "992301", "Sol_1.png")), "the PNG copy is saved");
    assert.ok(!/castlefo|procinst/.test(one.questionHtml), "typesetting note dropped");
    const ic = intakeCode(one as never, (f) => existsSync(path.join(DATA, "assets", "992301", f)));
    assert.deepEqual([ic.unsupported, ic.findings], [[], []], "intake: every image linked and present");

    const two = (await Item.findOne({ itemId: "992302" }).lean())!;
    assert.equal(two.options.length, 4, "choices taken from the source");
    assert.equal(two.key, "D", "key taken from the source");
    assert.equal(two.keySource, "castle-rock", "a key from their own source counts as theirs");
    assert.match((two.sourceNotes ?? []).join(" "), /taken from Castle Rock's source file/, "the item page says where the choices came from");
    assert.deepEqual(two.sourceFindings, [], "the recovered item agrees with its source");

    const three = (await Item.findOne({ itemId: "992303" }).lean())!;
    assert.deepEqual(three.sourceFindings, ["The key is A in the QTI export but D in the source."], "the key difference recorded");
    const f3 = intakeCode(three as never, () => true).findings;
    assert.ok(f3.some((f) => f.code === "source_mismatch"), "the pipeline stops at intake on it");
    console.log("ingest.dbtest: ok");
  } finally {
    await clean();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
