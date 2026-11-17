import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { renderInline, renderMarkdown, sanitize } from "./render";
import { parseItemFile } from "./item-file";
import JSZip from "jszip";
import { parseQtiItem, passageHtml, readQtiZip } from "./qti";
import { parseCsv } from "./sheet";
import { cleanPastedHtml, splitNote } from "./note";
import { STAGES, STAGE_LABEL, STAGE_HELP, STAGE_OWNER, VERDICTS, answerSeenBy, canJudgeSolution, visibleStage } from "./config";
import { renderForSolaro, texToLinear, toXhtml } from "./solaro";

// render: math, figures, table captions, images, sanitising
{
  const h = renderMarkdown("Cost is \\$5 and $x^2$.\n\n$$\\frac{1}{2}$$");
  assert.ok(h.includes("$5"), "escaped dollar stays literal");
  assert.ok(h.includes('class="katex"'), "inline math rendered");
  assert.ok(h.includes('class="ks-math"'), "display math wrapped");
  assert.ok(h.includes("<math"), "MathML emitted for screen readers");

  const f = renderMarkdown('```figure alt="A box" caption="Cap"\n<svg viewBox="0 0 10 10"><rect width="5" height="5"/></svg>\n```');
  assert.ok(f.includes('<svg role="img" aria-label="A box"'), "figure svg gets alt");
  assert.ok(f.includes("<figcaption>Cap</figcaption>"), "figure caption");
  assert.ok(!f.includes("<p><figure"), "figure not wrapped in <p>");

  const t = renderMarkdown("Table: Volumes\n\n| A (mL) | B |\n|---|---|\n| 1 | – |");
  assert.ok(t.includes("<table><caption>Volumes</caption>"), "table caption above");

  const i = renderMarkdown("![alt](images/1-1.png)", { resolveImage: (s) => `/x/${s}` });
  assert.ok(i.includes('src="/x/images/1-1.png"'), "image resolved");

  assert.equal(sanitize('<p onclick="x()">a</p><script>bad()</script>'), "<p>a</p>");
  assert.equal(renderInline("$\\dfrac{6!}{3!}$").startsWith("<p>"), false, "inline render has no <p>");
}

// item file
{
  const src = `---
itemId: "1"
subject: Mathematics
itemType: MC
key: "B"
evelynAnswer: "B"
keySource: castle-rock
standards: ["s1"]
---

## Question
What?

## Options
- A) one
- B) two

## Short answer
B.

## Diploma answer
Because.

\`\`\`figure alt="x"
## not a heading inside a fence
\`\`\`

## Common errors
- slip
`;
  const p = parseItemFile(src);
  assert.equal(p.meta.itemId, "1");
  assert.deepEqual(p.options.map((o) => o.label), ["A", "B"]);
  assert.deepEqual(p.sections.map((s) => s.kind), ["short", "diploma", "errors"]);
  assert.ok(p.sections[1].md.includes("## not a heading"), "headings inside fences are kept");
}

// QTI
{
  const apip = `<assessmentItem identifier="item_9"><responseDeclaration><correctResponse><value>A</value></correctResponse></responseDeclaration><itemBody><p id="x">Stem <span class="fill-in-the-blank"></span><img src="resources/Image_1.png" /></p><choiceInteraction responseIdentifier="RESPONSE"><simpleChoice identifier="A"><p>yes</p></simpleChoice><simpleChoice identifier="B"><p>no</p></simpleChoice></choiceInteraction></itemBody><modalFeedback identifier="solution"><div class="step"><div class="text">Step 1</div><p>Do it.</p></div></modalFeedback></assessmentItem>`;
  const meta = `<metadata><SYSTEM_ItemID>9</SYSTEM_ItemID><SYSTEM_ItemType>Multiple Choice</SYSTEM_ItemType><SYSTEM_Subject>PHYS</SYSTEM_Subject><SYSTEM_Grade>12</SYSTEM_Grade><SYSTEM_Course>AB.PHYS.30</SYSTEM_Course></metadata>`;
  const q = parseQtiItem(apip, meta);
  assert.equal(q.itemId, "9");
  assert.equal(q.key, "A");
  assert.equal(q.itemType, "MC");
  assert.equal(q.subject, "Physics");
  assert.equal(q.course, "Physics 30");
  assert.deepEqual(q.options.map((o) => o.label), ["A", "B"]);
  assert.ok(!q.questionHtml.includes("simpleChoice"), "options removed from stem");
  assert.ok(q.castleRockSolutionHtml.includes("cr-step-title"), "their solution kept");
  assert.deepEqual(q.imageRefs, ["resources/Image_1.png"]);
  assert.deepEqual(q.passageRefs, []);

  // Standards descriptions arrive wrapped in <p>; the list is plain text.
  const withStd = meta.replace("</metadata>", "<SYSTEM_Standards><Standard><Code>S.1</Code><Description><p>Solve\t\tproblems.</p></Description></Standard></SYSTEM_Standards></metadata>");
  assert.deepEqual(parseQtiItem(apip, withStd).standards, ["S.1 Solve problems."]);

  // Solution-only item file (question already in the database).
  const solOnly = parseItemFile('---\nitemId: "9"\nevelynAnswer: "A"\n---\n\n## Short answer\nA.\n', { questionOptional: true });
  assert.deepEqual(solOnly.sections.map((s) => s.kind), ["short"]);
  assert.throws(() => parseItemFile('---\nitemId: "9"\n---\n\n## Short answer\nA.\n'), /no Question section/);
}

// QTI reading passage: shown above the stem, kept raw for the package going back
async function passageTests() {
  const apip = `<assessmentItem identifier="item_7"><responseDeclaration><correctResponse><value>A</value><value>C</value></correctResponse></responseDeclaration><itemBody><rubricBlock id="passage_3" class="passage" view="candidate"><object type="text/html" data="passage_3.xml" /></rubricBlock><rubricBlock class="scoringData" view="scorer"><div><![CDATA[<Data>{A,C}=1</Data>]]></div></rubricBlock><p>Which apply?</p><choiceInteraction responseIdentifier="RESPONSE" maxChoices="0"><simpleChoice identifier="A"><p>a</p></simpleChoice><simpleChoice identifier="C"><p>c</p></simpleChoice></choiceInteraction></itemBody></assessmentItem>`;
  const passage = `<div class="passage" id="passage_3"><div class="title">Kind</div><div class="content"><p><span class="passageRef" label="x_y">The bus came.</span></p></div></div>`;
  assert.deepEqual(parseQtiItem(apip, "").passageRefs, ["passage_3.xml"]);
  assert.equal(parseQtiItem(apip, "").key, "A,C");
  assert.ok(!passageHtml(passage).includes("label="), "passage anchors dropped");

  const zip = new JSZip();
  zip.file("Item7/item_7_apip.xml", apip);
  zip.file("Item7/passage_3.xml", passage);
  const { items, messages } = await readQtiZip(await zip.generateAsync({ type: "uint8array" }));
  assert.equal(items.length, 1);
  const h = items[0].questionHtml;
  assert.ok(h.indexOf("The bus came.") >= 0 && h.indexOf("The bus came.") < h.indexOf("Which apply?"), "passage sits above the stem");
  assert.ok(h.includes('class="cr-passage"') && h.includes('class="cr-passage-title"'), "passage classes");
  assert.ok(!h.includes("{A,C}=1"), "scoring data not shown");
  assert.deepEqual(items[0].raw.passages, [{ file: "passage_3.xml", xml: passage }]);
  assert.ok(!messages.some((m) => m.includes("passage")), "no passage warning");

  const bare = new JSZip();
  bare.file("item_7_apip.xml", apip);
  const missing = await readQtiZip(await bare.generateAsync({ type: "uint8array" }));
  assert.ok(missing.messages.some((m) => m.includes("passage passage_3.xml is referenced but not in the zip")), "missing passage is reported");
}

// review notes: pasted markup becomes a clean table, long notes are marked long
{
  const plain = splitNote("Please shorten the short answer.");
  assert.deepEqual(plain, { text: "Please shorten the short answer.", html: null, plain: "Please shorten the short answer.", long: false });

  const list = splitNote("Premises did not export.\nOocyte\n\nSperm\n\nFertilization\n\nBlastocyst");
  assert.equal(list.text.split("\n").length, 5, "blank lines closed up");
  assert.equal(list.long, true, "more than four lines is long");

  const pasted = splitNote('The postamble: <table width="250" border="0" id="Item1_x" onclick="x()"><colgroup><col /><col /></colgroup> <tbody> <tr> <th align="center" colspan="2"><p id="Item1_y">Description</p></th> </tr> <tr> <td><p><span class="fill-in-the-blank">&nbsp;</span>A carboxylic acid</p></td> </tr> </tbody> </table><script>bad()</script><img src=x onerror=y>');
  assert.equal(pasted.text, "The postamble:");
  assert.ok(pasted.html!.startsWith("<table><colgroup><col /><col /></colgroup>"), "attributes dropped");
  assert.ok(pasted.html!.includes('<th colspan="2"><p>Description</p></th>'), "colspan kept, ids dropped");
  assert.ok(!/ id=|onclick|<script|<img|bad\(\)/.test(pasted.html!), "nothing active survives");
  assert.equal(pasted.plain, "The postamble: Description A carboxylic acid");
  assert.equal(pasted.long, true);
  assert.equal(cleanPastedHtml("<a href='javascript:x'>go</a><b>b</b>").replace(/\s+/g, " ").trim(), "go <b>b</b>");
  assert.equal(splitNote(undefined).plain, "");

  // every stage has a label, a help line and an owner entry; every verdict leads to a stage
  for (const s of STAGES) assert.ok(STAGE_LABEL[s] && STAGE_HELP[s] && s in STAGE_OWNER, `stage ${s} is described`);
  assert.deepEqual(Object.values(VERDICTS).map((v) => v.stage), ["approved", "changes_requested", "item_data", "rejected"]);
  assert.equal(STAGE_OWNER.changes_requested, "evelyn");
  assert.equal(STAGE_OWNER.item_data, "tech");
  assert.equal(STAGE_OWNER.rejected, null);

  // "ready" (passed our checks, not yet released) reads as drafting to Castle Rock
  assert.equal(visibleStage("ready", "reviewer"), "drafting");
  assert.equal(visibleStage("ready", "tech"), "drafting");
  assert.equal(visibleStage("ready", "evelyn"), "ready");
  assert.equal(visibleStage("key_query", "reviewer"), "key_query");
  assert.equal(STAGE_OWNER.key_query, "reviewer");
  assert.equal(STAGE_OWNER.ready, "evelyn");
  assert.deepEqual(STAGES.slice(1, 3), ["drafting", "ready"]);
  assert.equal(STAGES[STAGES.indexOf("item_data") + 1], "key_query");

  // a solution verdict needs the latest version to be released (legacy rows count as released)
  const held = { version: 2, releasedVersion: 1 };
  assert.equal(canJudgeSolution(held), false, "v2 held: nothing to approve");
  assert.equal(canJudgeSolution({ version: 2, releasedVersion: 2 }), true, "after releaseSolution");
  assert.equal(canJudgeSolution({ version: 1, releasedVersion: 0 }), false, "nothing released");
  assert.equal(canJudgeSolution({ version: 3 }), true, "legacy row");
  assert.equal(canJudgeSolution({ version: 0, releasedVersion: 0 }), false);

  // the answer Castle Rock sees is the one released with the solution
  const ans = { evelynAnswer: "C", releasedAnswer: "B", releasedVersion: 1 };
  assert.equal(answerSeenBy(ans, "reviewer"), "B");
  assert.equal(answerSeenBy(ans, "tech"), "B");
  assert.equal(answerSeenBy(ans, "evelyn"), "C");
  assert.equal(answerSeenBy({ evelynAnswer: "C", releasedVersion: 0 }, "reviewer"), "", "nothing released: no answer");
  assert.equal(answerSeenBy({ evelynAnswer: "C" }, "reviewer"), "C", "legacy row");
}

// sheet
{
  const rows = parseCsv('Item ID,Subject,Course,Showcase\n"301823",Mathematics,Math 30-1,yes\n193246,Chemistry,Chemistry 30,\n');
  assert.deepEqual(rows[0], { itemId: "301823", subject: "Mathematics", course: "Math 30-1", showcase: true });
  assert.equal(rows[1].showcase, false);
}

/** Minimal well-formedness check: every open tag closed in order, no bare named entities. */
function wellFormed(xml: string): boolean {
  const stack: string[] = [];
  for (const m of xml.matchAll(/<(\/?)([A-Za-z][\w:.-]*)[^>]*?(\/?)>/g)) {
    if (m[3]) continue;
    if (m[1]) {
      if (stack.pop() !== m[2]) return false;
    } else stack.push(m[2]);
  }
  return stack.length === 0 && !/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-f]+;)/i.test(xml);
}

// SOLARO export rendering: no MathML, PNG equations with alt + vertical-align, well-formed XHTML
async function solaroTests() {
  assert.equal(texToLinear("\\frac{6!}{3!\\,2!} = 60"), "(6!)/(3! 2!) = 60");
  assert.equal(texToLinear("\\sqrt{x^2 + 1}"), "√(x^2 + 1)");
  const md = 'So $x^2$ and $n$.\n\n$$\\frac{a}{b}$$\n\n| A (mL) | B |\n|---|---|\n| 1 | – |\n\n```figure alt="Box" caption="Cap"\n<svg viewBox="0 0 100 50" width="100"><rect width="50" height="20" fill="none" stroke="#000"/></svg>\n```';
  const r = await renderForSolaro(md, "1-diploma", (s) => `resources/${s}`);
  assert.ok(!/<math|katex/.test(r.html), "no MathML or KaTeX in the SOLARO html");
  assert.ok(/<img class="mathml" src="resources\/1-diploma-eq\d\.png" width="\d+" height="\d+" style="vertical-align: -?[\d.]+px;" alt="[^"]+" \/>/.test(r.html), "equation img with size, vertical-align and alt");
  assert.ok(r.html.includes("<i>n</i>"), "single-letter variable stays text");
  assert.equal(r.files.filter((f) => f.name.includes("-eq")).length, 2);
  assert.equal(r.files.filter((f) => f.name.includes("-fig")).length, 1);
  assert.ok(r.files.every((f) => f.data.subarray(1, 4).toString() === "PNG"), "files are PNG");
  const x = toXhtml(r.html);
  assert.ok(wellFormed(`<div>${x}</div>`), "XHTML is well-formed");
}

// Real SOLARO sample, when present on this machine (Vance's 2026-10-29 export).
const sample = path.join(homedir(), "Downloads", "Item234035.zip");
(async () => {
  await solaroTests();
  await passageTests();
  if (existsSync(sample)) {
    const { items, messages } = await readQtiZip(new Uint8Array(await readFile(sample)));
    assert.equal(items.length, 1, messages.join("; "));
    assert.equal(items[0].key, "A");
    assert.equal(items[0].resources.size, 1);
    console.log("  real QTI sample 234035 parsed");
  }
  console.log("keystone tests passed");
})();
