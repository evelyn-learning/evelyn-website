// Castle Rock's source file (item_<id>_original.txt): read, cross-checked against the QTI export, and used to recover
// a choice item whose choices the exporter dropped (2026-11-23 batch: 166808, 210560, 218588).
import assert from "node:assert/strict";
import { checkAgainstSource, imageBase, readSource, recoverChoices } from "./source";

const SRC = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE Package[<!ENTITY deg "&#xB0;">
]><Package Jurisdiction="Ontario"><Item><Item_ID>166808</Item_ID>
<Preamble><html xmlns="http://www.w3.org/1999/xhtml"><p id="p1"><localization><defaulttext>Kelsey</defaulttext><translation region="English (Indian)">Suma</translation></localization> drew a graph.<img id="Image_5" src="https://cdn.example/Image_5_123456789.jpg" highresSrc="https://cdn.example/Image_5_123456789_high.tif" alt="" /></p></html></Preamble>
<QuestionStem><html xmlns="http://www.w3.org/1999/xhtml"><p id="p2">Which angle is <mathml><math xmlns="http://www.w3.org/1998/Math/MathML" asciimath="210deg"><mn>210</mn><mtext>&deg;</mtext></math></mathml> &theta;?</p></html></QuestionStem>
<Postamble />
<Question><Multiple_Choice>
<Distractor Identifier="A" Correct="false"><DistractorContent><html xmlns="http://www.w3.org/1999/xhtml"><p id="a">30&deg;</p></html></DistractorContent></Distractor>
<Distractor Identifier="B" Correct="true"><DistractorContent><html xmlns="http://www.w3.org/1999/xhtml"><p id="b">330&deg;</p></html></DistractorContent></Distractor>
</Multiple_Choice></Question></Item></Package>`;

assert.equal(imageBase("Image_5_123456789_high.tif"), "Image_5");
assert.equal(imageBase("resources/Image_148404.png"), "Image_148404", "a plain id is not cut as a version stamp");

const src = readSource(SRC, ["Image_5.jpg"])!;
assert.ok(src, "read");
assert.match(src.preamble, /Kelsey drew a graph/, "default text, not the translation");
assert.doesNotMatch(src.preamble, /Suma/);
assert.match(src.preamble, /src="resources\/Image_5\.jpg"/, "image pointed at the zip's copy");
assert.match(src.stem, /<math><mn>210<\/mn><mtext>&#xB0;<\/mtext><\/math>/, "entities resolved, MathML kept");
assert.match(src.stem, /&#x3b8;/, "HTML5 entity resolved");
assert.deepEqual(src.choices.map((c) => [c.label, c.correct]), [["A", false], ["B", true]]);
assert.deepEqual(src.images, ["Image_5"]);

const rec = recoverChoices(src)!;
assert.equal(rec.key, "B");
assert.equal(rec.itemType, "MC");
assert.equal(rec.options.length, 2);

const view = { questionHtml: src.preamble + src.stem, options: rec.options, interactions: [], key: "B", itemType: "MC" };
assert.deepEqual(checkAgainstSource(view, src), [], "the recovered item agrees with its source");
assert.deepEqual(checkAgainstSource({ ...view, key: "A" }, src), ["The key is A in the QTI export but B in the source."]);
assert.deepEqual(checkAgainstSource({ ...view, options: rec.options.slice(0, 1) }, src), ["The source has 2 choices; the QTI export has 1."]);
assert.deepEqual(checkAgainstSource({ ...view, questionHtml: src.stem }, src), ["The preamble differs from Castle Rock's source.", "The source shows an image the QTI export does not: Image_5."]);

// A choice image the zip does not hold: never recovered blind.
const noFile = readSource(SRC.replace("<p id=\"a\">30&deg;</p>", '<p id="a"><img id="Image_9" src="https://cdn.example/Image_9_123456789.jpg" /></p>'), ["Image_5.jpg"])!;
assert.equal(recoverChoices(noFile), null);
assert.equal(readSource("<Package><Item></Item></Package>"), null, "not an item source");
console.log("source: ok");
