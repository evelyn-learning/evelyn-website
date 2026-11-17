import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { keyFor, keyLine, type Interaction, parseInteractions, stemWithoutInteractions } from "./qti-interactions";
import { parseQtiItem } from "./qti";

const wrap = (b: string) => `<assessmentItem><itemBody>${b}</itemBody></assessmentItem>`;

assert.deepEqual(parseInteractions('<choiceInteraction responseIdentifier="R" maxChoices="2"><simpleChoice identifier="A"><p>one</p></simpleChoice><simpleChoice identifier="B">two</simpleChoice></choiceInteraction>'), [
  { kind: "choice", responseId: "R", maxChoices: 2, options: [{ label: "A", html: "<p>one</p>" }, { label: "B", html: "two" }] },
]);
assert.deepEqual(parseInteractions('<p>x <textEntryInteraction responseIdentifier="N1" expectedLength="5"/></p>'), [{ kind: "textEntry", responseId: "N1" }]);
assert.deepEqual(parseInteractions('<p>A <inlineChoiceInteraction responseIdentifier="D" shuffle="false"><inlineChoice identifier="a">up</inlineChoice><inlineChoice identifier="b">down</inlineChoice></inlineChoiceInteraction></p>'), [
  { kind: "inlineChoice", responseId: "D", choices: [{ label: "a", html: "up" }, { label: "b", html: "down" }] },
]);
assert.deepEqual(
  parseInteractions('<matchInteraction responseIdentifier="M"><simpleMatchSet><simpleAssociableChoice identifier="P1" matchMax="1">Cat</simpleAssociableChoice><simpleAssociableChoice matchMax="1" identifier="P2">Dog</simpleAssociableChoice></simpleMatchSet><simpleMatchSet><simpleAssociableChoice identifier="R1">Meow</simpleAssociableChoice></simpleMatchSet></matchInteraction>'),
  [{ kind: "match", responseId: "M", premises: [{ label: "P1", html: "Cat" }, { label: "P2", html: "Dog" }], responses: [{ label: "R1", html: "Meow" }] }],
);
assert.deepEqual(parseInteractions('<gapMatchInteraction responseIdentifier="G"><gapText identifier="W1" matchMax="1">sun</gapText><gapText identifier="W2">moon</gapText><p>The <gap identifier="G1"/> and <gap identifier="G2"></gap>.</p></gapMatchInteraction>'), [
  { kind: "gapMatch", responseId: "G", gaps: ["G1", "G2"], choices: [{ label: "W1", html: "sun" }, { label: "W2", html: "moon" }] },
]);
assert.deepEqual(parseInteractions('<orderInteraction responseIdentifier="O"><simpleChoice identifier="s1">first</simpleChoice><simpleChoice identifier="s2">second</simpleChoice></orderInteraction>'), [
  { kind: "order", responseId: "O", choices: [{ label: "s1", html: "first" }, { label: "s2", html: "second" }] },
]);
assert.deepEqual(parseInteractions('<extendedTextInteraction responseIdentifier="W"/>'), [{ kind: "extendedText", responseId: "W" }]);
assert.deepEqual(parseInteractions('<p>x</p><hotspotInteraction responseIdentifier="R"/>'), [{ kind: "unsupported", element: "hotspotInteraction" }]);
// bare numerical response: only a blank in the stem
assert.deepEqual(parseInteractions('<p>Answer <span class="fill-in-the-blank">&#x000A0;</span>.</p>'), [{ kind: "textEntry", responseId: "RESPONSE" }]);
assert.deepEqual(parseInteractions("<p>plain</p>"), []);

assert.deepEqual(keyFor('<responseDeclaration identifier="RESPONSE" cardinality="multiple"><correctResponse><value>A</value><value>C</value></correctResponse></responseDeclaration>'), { RESPONSE: ["A", "C"] });
assert.deepEqual(keyFor('<responseDeclaration identifier="A" baseType="string"><correctResponse><value>x &lt; 1</value></correctResponse></responseDeclaration><responseDeclaration cardinality="single" identifier="B"/><responseDeclaration identifier="C"><correctResponse><value>7</value></correctResponse></responseDeclaration>'), { A: ["x < 1"], C: ["7"] });

// stem: placeholders for inline, removal for block
const stem = stemWithoutInteractions('<p>Is <inlineChoiceInteraction responseIdentifier="D"><inlineChoice identifier="a">up</inlineChoice></inlineChoiceInteraction> or <textEntryInteraction responseIdentifier="T"/>?</p><matchInteraction responseIdentifier="M"><prompt>Match.</prompt><simpleMatchSet><simpleAssociableChoice identifier="P">Cat</simpleAssociableChoice></simpleMatchSet></matchInteraction>');
assert.equal(stem, '<p>Is <span class="fill-in-the-blank"></span><sub class="ks-gap-id">D</sub> or <span class="fill-in-the-blank"></span><sub class="ks-gap-id">T</sub>?</p><p>Match.</p>');
const gs = stemWithoutInteractions('<gapMatchInteraction responseIdentifier="G"><gapText identifier="W1">sun</gapText><p>The <gap identifier="G1"/> shines.</p></gapMatchInteraction>');
assert.equal(gs, '<p>The <span class="fill-in-the-blank" data-gap="G1"></span><sub class="ks-gap-id">G1</sub> shines.</p>');
assert.equal(stemWithoutInteractions('<p>q</p><choiceInteraction responseIdentifier="R"><simpleChoice identifier="A">a</simpleChoice></choiceInteraction>'), "<p>q</p>");

// through parseQtiItem: options unchanged, interactions added, blank in stem
const item = parseQtiItem(
  `<assessmentItem identifier="item_1"><responseDeclaration identifier="RESPONSE"><correctResponse><value>B</value></correctResponse></responseDeclaration>${wrap('<p>Q <inlineChoiceInteraction responseIdentifier="D"><inlineChoice identifier="a">up</inlineChoice></inlineChoiceInteraction></p><choiceInteraction responseIdentifier="RESPONSE" maxChoices="1"><simpleChoice identifier="A">a</simpleChoice><simpleChoice identifier="B">b</simpleChoice></choiceInteraction>')}</assessmentItem>`,
  "<SYSTEM_ItemID>1</SYSTEM_ItemID>",
);
assert.deepEqual(item.options.map((o) => o.label), ["A", "B"]);
assert.deepEqual(item.interactions.map((i) => i.kind), ["inlineChoice", "choice"]);
assert.deepEqual(item.keys, { RESPONSE: ["B"] });
assert.ok(item.questionHtml.includes("fill-in-the-blank") && !item.questionHtml.includes("inlineChoice"));

// order item: options stay empty, one order interaction
const ord = parseQtiItem(wrap('<p>Sort</p><orderInteraction responseIdentifier="O"><simpleChoice identifier="s1">first</simpleChoice></orderInteraction>'), "<SYSTEM_ItemID>2</SYSTEM_ItemID>");
assert.deepEqual(ord.options, []);
assert.deepEqual(ord.interactions.map((i) => i.kind), ["order"]);

// numerical fallback: quote styles and class lists
for (const c of ["class='fill-in-the-blank'", 'class="x fill-in-the-blank y"']) {
  assert.deepEqual(parseInteractions(`<p><span ${c}> </span></p>`), [{ kind: "textEntry", responseId: "RESPONSE" }], c);
}
assert.deepEqual(parseInteractions('<p><span class="fill-in-the-blanks"> </span></p>'), []);

// key lines
const o: Interaction = { kind: "order", responseId: "O", choices: [] };
const m: Interaction = { kind: "match", responseId: "M", premises: [], responses: [] };
assert.equal(keyLine(o, { O: ["B", "A", "C"] }), "Key order: B, A, C");
assert.equal(keyLine(m, { M: ["P1 R2", "P2  R1"] }), "Key pairs: P1 → R2; P2 → R1");
assert.equal(keyLine({ kind: "gapMatch", responseId: "G", gaps: [], choices: [] }, { G: ["W1 G1"] }), "Key pairs: W1 → G1");
assert.equal(keyLine(o, {}), null);
assert.equal(keyLine({ kind: "extendedText", responseId: "T" }, { T: ["1"] }), null);

assert.equal(keyLine({ kind: "textEntry", responseId: "T" }, { T: ["42"] }), "Key: 42");
assert.equal(keyLine({ kind: "textEntry", responseId: "T" }, { T: ["1", "2"] }), "Key: 1, 2");
assert.equal(keyLine({ kind: "textEntry", responseId: "T" }, {}), null);
// labelled blanks
assert.ok(gs.includes('data-gap="G1"') && gs.includes('<sub class="ks-gap-id">G1</sub>'));
const two = stemWithoutInteractions('<p><textEntryInteraction responseIdentifier="A"/> and <textEntryInteraction responseIdentifier="B"/></p>');
assert.ok(two.includes('>A</sub>') && two.includes('>B</sub>'));

// real SOLARO samples, when present
const sample = path.join(homedir(), "Downloads/Item146799/item_146799_apip.xml");
if (existsSync(sample)) {
  const apip = readFileSync(sample, "utf8");
  const p = parseQtiItem(apip, "");
  assert.deepEqual(p.interactions, [{ kind: "textEntry", responseId: "RESPONSE" }]);
  assert.deepEqual(p.keys, { RESPONSE: ["0.998"] });
}
console.log("qti-interactions tests passed");
