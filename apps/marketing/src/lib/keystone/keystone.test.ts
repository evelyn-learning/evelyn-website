import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { renderInline, renderMarkdown, sanitize } from "./render";
import { parseItemFile } from "./item-file";
import { parseQtiItem, readQtiZip } from "./qti";
import { parseCsv } from "./sheet";
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
  if (existsSync(sample)) {
    const { items, messages } = await readQtiZip(new Uint8Array(await readFile(sample)));
    assert.equal(items.length, 1, messages.join("; "));
    assert.equal(items[0].key, "A");
    assert.equal(items[0].resources.size, 1);
    console.log("  real QTI sample 234035 parsed");
  }
  console.log("keystone tests passed");
})();
