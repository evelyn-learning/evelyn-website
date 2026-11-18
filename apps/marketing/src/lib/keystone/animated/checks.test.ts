// npx tsx src/lib/keystone/animated/checks.test.ts
import assert from "node:assert/strict";
import { earCheck, numbersIn, packagingCheck, sentenceCount, spokenNumbersCheck } from "./checks";
import { renderPage } from "./build";
import type { Spec } from "./spec";
import { BOARD_JS, SVG, WRITTEN, spec } from "./testkit";

const ok = (value: unknown, message: string) => assert.ok(value, message);
const keys = (t: string) => numbersIn(t).map((n) => n.key);
const edit = (f: (s: Spec) => void): Spec => {
  const s = JSON.parse(JSON.stringify(spec())) as Spec;
  f(s);
  return s;
};

// --- numbers: normalisation ---
assert.deepEqual(keys("p = 7507 kg·m/s at 42°"), ["7507", "42"], "plain numbers");
assert.deepEqual(keys("31 360 000 + 25\u2009000\u2009000 = 56,360,000"), ["31360000", "25000000", "56360000"], "spaces, thin spaces and commas as thousands separators");
assert.deepEqual(keys("$31\\,360\\,000$ and $10{,}600$"), ["31360000", "10600"], "LaTeX thousands separators");
assert.deepEqual(keys("5600, 5000 and 900"), ["5600", "5000", "900"], "a list is not one number");
assert.deepEqual(keys("3.0 × 10<sup>8</sup> m/s"), ["300000000"], "×10 with <sup>");
assert.deepEqual(keys("$4.24 \\times 10^{-4}\\ \\text{m}$"), ["0.000424"], "LaTeX ×10^{-n}");
assert.deepEqual(keys("4.98 × 10⁻⁷ m"), ["4.98e-7"], "unicode superscript exponent");
assert.deepEqual(keys("6.02e23"), ["6.02e+23"], "e notation");
assert.deepEqual(keys("8.30 m/s"), ["8.3"], "trailing zero");
assert.deepEqual(keys("−5 and –3"), ["5", "3"], "signs dropped");
assert.deepEqual(keys("<var>p</var><sub>1</sub> = (5600)<sup>2</sup>, x²"), ["5600", "2", "2"], "subscripts are labels; exponents are numbers");
assert.deepEqual(keys("H2O, CO2 and v1"), [], "digits attached to letters are labels");
assert.deepEqual(keys("$v_{2} = v_1 + 4$"), ["4"], "LaTeX subscripts are labels");
assert.deepEqual(keys(`<svg viewBox="0 0 240 180"><line x1="24" y1="34"/><text x="5">7507</text></svg>`), ["7507"], "attribute values are not text");
assert.deepEqual(numbersIn("3.0 × 10^8")[0].parts, ["3", "8"], "mantissa and exponent kept as parts");

// --- numbers: the check ---
assert.deepEqual(spokenNumbersCheck(spec(), WRITTEN, ""), [], "fixture numbers all come from the written solution");
const stray = spokenNumbersCheck(edit((s) => (s.steps[1].lines[0].say = "4 kg times 3 m/s² is 13 N.")), WRITTEN, "");
assert.deepEqual(stray, [{ where: "step 2 line 1 say", detail: "13" }], "a stray in say is found with its place");
ok(spokenNumbersCheck(edit((s) => (s.steps[1].lines[0].speak = "4 kilograms times 3 is 15 newtons.")), WRITTEN, "").some((f) => f.where === "step 2 line 1 speak" && f.detail === "15"), "a stray in speak");
ok(spokenNumbersCheck(edit((s) => (s.steps[0].lines[1].cues = [{ do: "ink", html: "<var>F</var> = 99 N" }])), WRITTEN, "").some((f) => f.where === "step 1 line 2 ink" && f.detail === "99"), "a stray in ink");
ok(spokenNumbersCheck(edit((s) => (s.steps[2].body = "<p>about 11.9 N</p>")), WRITTEN, "").some((f) => f.where === "step 3 body" && f.detail === "11.9"), "a stray in a body");
ok(spokenNumbersCheck(edit((s) => (s.boxes[1].html = "<p>Less than 50 N.</p>")), WRITTEN, "").some((f) => f.where === "box sanity" && f.detail === "50"), "a stray in a box");
ok(spokenNumbersCheck(edit((s) => (s.answer.text = "14 N")), WRITTEN, "").some((f) => f.where === "answer" && f.detail === "14"), "a stray in the answer");
assert.deepEqual(spokenNumbersCheck(edit((s) => (s.boxes[1].html = "<p>Less than 50 N.</p>")), WRITTEN, "The limit is 50 N."), [], "the question also justifies a number");
assert.deepEqual(spokenNumbersCheck(edit((s) => { s.boxes[1].html = "<p>Less than 1 000 N.</p>"; s.allowNumbers = [{ n: "1 000", reason: "an upper bound for the sanity check" }]; }), WRITTEN, ""), [], "allowNumbers exempts");
assert.deepEqual(spokenNumbersCheck(edit((s) => (s.boxes[1].html = "<p>F = 1.2 × 10<sup>1</sup> N</p>")), "F = 12 N", "4 kg, 3 m/s^2"), [], "×10^n compared by value");
assert.deepEqual(spokenNumbersCheck(edit((s) => (s.boxes[1].html = "<p>Values 4 12</p>")), WRITTEN, ""), [], "numbers side by side are not one number");
ok(spokenNumbersCheck(edit((s) => (s.practice.doneText = "That is 77 N.")), WRITTEN, "").some((f) => f.where === "practice.doneText"), "practice texts are checked");

// --- packaging ---
const page = (over: Partial<Spec> = {}, js = BOARD_JS) => renderPage({ spec: spec(over), svg: SVG, boardJs: js });
assert.deepEqual(packagingCheck(page()), [], "a built page passes");
const bad = (html: string, re: RegExp, message: string) => assert.ok(packagingCheck(html).some((e) => re.test(e)), `${message}; got ${JSON.stringify(packagingCheck(html))}`);
bad(page().replace("</h2>", `</h2><img src="https://example.com/a.png">`), /outside address/, "http address");
bad(page().replace("</h2>", `</h2><img src="//cdn.example.com/a.png">`), /protocol-relative/, "protocol-relative address");
bad(page().replace("</h2>", `</h2><details><summary>x</summary></details>`), /<details>/, "details");
bad(page().replace("</style>", `@import "x.css";</style>`), /@import/, "@import");
bad(page().replace("</style>", `@font-face { font-family: x; }</style>`), /@font-face/, "@font-face");
bad(page().replace("</head>", `<link rel="stylesheet" href="x.css"></head>`), /<link>/, "link");
bad(page().replace("</h2>", `</h2><p class="note es-small">x</p>`), /classes must start with "es-".*note/, "unprefixed class");
bad(page({ boxes: spec().boxes.map((b) => (b.kind === "sanity" ? { ...b, html: `<p class="big">x</p>` } : b)) }), /classes must start.*big/, "unprefixed class inside the spec");
bad(page({ steps: spec().steps.map((s, i) => (i === 0 ? { ...s, lines: [{ say: "x", cues: [{ do: "ink" as const, html: `<span class="red">x</span>` }] }] } : s)) }), /classes must start.*red/, "unprefixed class inside a cue (embedded JSON)");
bad(page().replace("© 2026 Evelyn Learning", "(c) Someone"), /footer/, "footer");
bad(page({ boxes: spec().boxes.map((b) => (b.kind === "sanity" ? { ...b, html: "<p>This was written by an AI model.</p>" } : b)) }), /how it was made/, "banned words");
bad(page(undefined, BOARD_JS + `\nlocalStorage.setItem("a", "b");`), /storage, cookies or network/, "storage");
bad(page().replace("</h2>", `</h2><img src="figure.png">`), /file reference/, "a separate image file");
bad(page().replace("</h2>", `</h2><iframe src="x.html"></iframe>`), /frame, object or form/, "iframe");
assert.deepEqual(packagingCheck(page().replace("</h2>", `</h2><img src="data:image/png;base64,AAAA" alt="">`)), [], "inline data image is fine");

// --- written for the ear ---
assert.equal(sentenceCount("The answer is A. Here's why."), 2, "two sentences");
assert.equal(sentenceCount("The speed is 8.3 m/s, 42° South of East: option A."), 1, "decimals and colons do not split");
assert.equal(sentenceCount("Because they stick, this is a momentum problem:"), 1, "no closing mark");
assert.deepEqual(earCheck(spec()), [], "fixture is written for the ear");
const ear = (speak: string, say = "Line.") => earCheck(edit((s) => (s.steps[1].lines[0] = { say, speak }))).map((f) => f.detail).join(" | ");
ok(/symbols.*=/.test(ear("F = 12 newtons.")), "equals sign");
ok(/symbols/.test(ear("It is 42° south.")), "degree sign");
ok(/symbols.*\//.test(ear("14 meters/second.")), "slash");
ok(/unit abbreviation.*4 kg/.test(ear("It has 4 kg of mass.")), "bare kg");
ok(/unit abbreviation/.test(ear("It moves at 14 m per second.")), "bare m");
assert.equal(ear("It moves at 14 meters per second, for 5 minutes, with car A."), "", "spelled units and car A are fine");
ok(/trig/.test(ear("Take sin of the angle.")), "sin");
assert.equal(ear("Take the sine of the angle since it is known."), "", "sine and since are fine");
ok(/three or more numbers/.test(ear("The labels are 4, 1, 3, 2.")), "four numbers in a row");
ok(/three or more numbers/.test(ear("That is 56 360 000.")), "a spaced number is read as three");
assert.equal(ear("400 plus 500 is 900."), "", "numbers with words between are fine");
ok(/say has 1 sentence\(s\), speak has 2/.test(ear("One. Two.", "Just one.")), "sentence counts must match");
ok(/say \(no speak given\) has symbols/.test(earCheck(edit((s) => (s.steps[1].lines[0] = { say: "F = 12 N." }))).map((f) => f.detail).join(" ")), "say is the voice text when there is no speak");

console.log("animated/checks.test.ts: ok");
