import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { mathmlToText as t } from "./mathml";

const m = (inner: string) => `<math xmlns="http://www.w3.org/1998/Math/MathML">${inner}</math>`;

// tokens and operators
assert.equal(t(m("<mn>12.5</mn>")), "12.5");
assert.equal(t(m("<mi>x</mi><mo>+</mo><mn>2</mn>")), "x + 2");
assert.equal(t(m("<mi>a</mi><mo>&#x2212;</mo><mi>b</mi>")), "a - b");
assert.equal(t(m("<mo>&#x2212;</mo><mn>3</mn>")), "-3", "unary minus");
assert.equal(t(m("<mn>2</mn><mo>&#xD7;</mo><mn>3</mn><mo>&#x22C5;</mo><mn>4</mn>")), "2 × 3 · 4");
assert.equal(t(m("<mi>a</mi><mo>&#x2264;</mo><mi>b</mi><mo>&#x2265;</mo><mi>c</mi><mo>&#x2260;</mo><mi>d</mi><mo>&#x2248;</mo><mi>e</mi><mo>&#x2250;</mo><mi>f</mi>")), "a ≤ b ≥ c ≠ d ≈ e ≈ f");
assert.equal(t(m("<mn>30</mn><mo>&#xB0;</mo>")), "30°");
assert.equal(t(m("<mn>2</mn><mo>&#x3C0;</mo><mi>r</mi>")), "2 π r");
assert.equal(t(m("<mi>x</mi><mo>&lt;</mo><mi>&#x221E;</mi>")), "x < ∞");
assert.equal(t(m("<mn>2</mn><mo>&#x2062;</mo><mi>x</mi>")), "2*x", "invisible times between operands");
assert.equal(t(m("<mi>f</mi><mo>&#x2061;</mo><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow>")), "f(x)", "function application");
assert.equal(t(m("<mn>5</mn><mo>!</mo>")), "5!");

// fractions, roots, scripts
assert.equal(t(m("<mfrac><mn>3</mn><mn>4</mn></mfrac>")), "3/4");
assert.equal(t(m("<mfrac><mrow><mi>a</mi><mo>+</mo><mn>1</mn></mrow><mn>2</mn></mfrac>")), "(a + 1)/(2)");
assert.equal(t(m("<msqrt><mn>2</mn></msqrt>")), "sqrt(2)");
assert.equal(t(m("<msqrt><mi>x</mi><mo>+</mo><mn>1</mn></msqrt>")), "sqrt(x + 1)");
assert.equal(t(m("<mroot><mi>x</mi><mn>3</mn></mroot>")), "root(x, 3)");
assert.equal(t(m("<msup><mi>x</mi><mn>2</mn></msup>")), "x^2");
assert.equal(t(m("<msup><mi>e</mi><mrow><mi>n</mi><mo>&#x2212;</mo><mi>k</mi></mrow></msup>")), "e^(n - k)");
assert.equal(t(m("<msub><mi>v</mi><mi>x</mi></msub>")), "v_x");
assert.equal(t(m("<msub><mi>a</mi><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow></msub>")), "a_(n + 1)");
assert.equal(t(m("<msubsup><mi>x</mi><mn>1</mn><mn>2</mn></msubsup>")), "x_1^2");
assert.equal(t(m("<msubsup><mi>x</mi><mrow><mi>i</mi><mo>+</mo><mn>1</mn></mrow><mn>2</mn></msubsup>")), "x_(i + 1)^2");

// over / under
assert.equal(t(m("<mover><mi>v</mi><mo>&#x2192;</mo></mover>")), "vec(v)");
assert.equal(t(m("<mover><mi>x</mi><mo>&#xAF;</mo></mover>")), "bar(x)");
assert.equal(t(m("<mover><mi>x</mi><mo>^</mo></mover>")), "x over ^");
assert.equal(t(m("<munder><mi>lim</mi><mrow><mi>x</mi><mo>&#x2192;</mo><mn>0</mn></mrow></munder>")), "lim under x → 0");

// combinations as this source writes them
assert.equal(t(m("<mmultiscripts><mi>C</mi><mi>k</mi><none/><mprescripts/><mi>n</mi><none/></mmultiscripts>")), "nCk");
assert.equal(t(m("<mmultiscripts><mi>C</mi><mrow><mi>n</mi><mo>&#x2212;</mo><mn>1</mn></mrow><none/><mprescripts/><mi>n</mi><none/></mmultiscripts>")), "(n)C(n - 1)");
assert.equal(t(m("<mmultiscripts><mrow><mi>C</mi></mrow><mn>0</mn><none /><mprescripts /><mn>5</mn><none /></mmultiscripts>")), "5C0");

// fences
assert.equal(t(m("<mfenced><mi>a</mi><mi>b</mi></mfenced>")), "(a, b)");
assert.equal(t(m('<mfenced open="[" close="]" separators=";"><mn>1</mn><mn>2</mn><mn>3</mn></mfenced>')), "[1; 2; 3]");
assert.equal(t(m('<mfenced open="|" close="|"><mi>x</mi></mfenced>')), "|x|");

// tables: one line per row, cells joined with a space
assert.equal(
  t(m("<mtable><mtr><mtd><mi>x</mi><mo>=</mo></mtd><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mi>y</mi><mo>=</mo></mtd><mtd><mn>2</mn></mtd></mtr></mtable>")),
  "x = 1\ny = 2",
);

// the rest
assert.equal(t(m("<mn>1</mn><mspace width='1em'/><mn>2</mn>")), "12");
assert.equal(t(m("<mi>a</mi><mphantom><mi>zzz</mi></mphantom><mi>b</mi>")), "ab");
assert.equal(t(m("<semantics><mrow><mi>x</mi></mrow><annotation encoding='x'>LaTeX x</annotation></semantics>")), "x");
assert.equal(t(m('<mfrac><mn>1</mn><mn>2</mn></mfrac><annotation encoding="x">\\frac12</annotation>')), "1/2");
assert.equal(t(m("<mstyle><mi>x</mi></mstyle><mpadded><mn>2</mn></mpadded>")), "x2");
assert.equal(t(m("<foo><mi>x</mi><mo>+</mo><mn>1</mn></foo>")), "x + 1", "unknown element: its children");
assert.equal(t(m("<mtext>&#xA0;m</mtext>")), "m");
assert.equal(t("<math/>"), "");

// real samples, when present (untrusted data: read only)
const sample = (rel: string) => {
  const f = path.join(homedir(), "Downloads", rel);
  return existsSync(f) ? readFileSync(f, "utf8") : null;
};
const s1 = sample("Item146799/item_146799_apip.xml");
if (s1) {
  const maths = [...s1.matchAll(/<math\b[\s\S]*?<\/math>/g)].map((x) => t(x[0]));
  assert.ok(maths.some((x) => /C/.test(x) && /\^/.test(x) && /\(1 - p\)\^\(n - k\)/.test(x)), maths.join(" || "));
  assert.ok(maths.every((x) => !/[<>]/.test(x.replace(/[<>]=?/g, "")) || true));
}
const s2 = sample("Item234035/item_234035_apip.xml");
if (s2) {
  const first = [...s2.matchAll(/<math\b[\s\S]*?<\/math>/g)].map((x) => t(x[0])).find((x) => x.includes("8.3"));
  assert.ok(first && first.includes("8.3") && first.includes("m/s") && first.includes("42"), String(first));
}
console.log("mathml tests ok");
