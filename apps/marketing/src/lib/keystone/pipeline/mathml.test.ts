import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { mathmlToText as t } from "./mathml";

const m = (inner: string) => `<math xmlns="http://www.w3.org/1998/Math/MathML">${inner}</math>`;
const eq = (inner: string, want: string) => assert.equal(t(m(inner)), want, inner);

// tokens and operators
eq("<mn>12.5</mn>", "12.5");
eq("<mi>x</mi><mo>+</mo><mn>2</mn>", "x + 2");
eq("<mi>a</mi><mo>&#x2212;</mo><mi>b</mi>", "a - b");
eq("<mo>&#x2212;</mo><mn>3</mn>", "-3");
eq("<mn>2</mn><mo>&#xD7;</mo><mn>3</mn><mo>&#x22C5;</mo><mn>4</mn>", "2 × 3 · 4");
eq("<mi>a</mi><mo>&#x2264;</mo><mi>b</mi><mo>&#x2265;</mo><mi>c</mi><mo>&#x2260;</mo><mi>d</mi><mo>&#x2248;</mo><mi>e</mi><mo>&#x2250;</mo><mi>f</mi>", "a ≤ b ≥ c ≠ d ≈ e ≈ f");
eq("<mn>30</mn><mo>&#xB0;</mo>", "30°");
eq("<mn>42</mn><mtext>&#xB0;</mtext>", "42°");
eq("<mn>2</mn><mi>&#x3C0;</mi><mi>r</mi>", "2πr");
eq("<mi>x</mi><mo>&lt;</mo><mi>&#x221E;</mi>", "x < ∞");
eq("<mn>2</mn><mo>&#x2062;</mo><mi>x</mi>", "2*x");
eq("<mn>5</mn><mo>!</mo>", "5!");
eq("<mi>&Delta;</mi><mi>t</mi>", "Δt");
eq("<mi>&alpha;</mi><mo>&plusmn;</mo><mi>&beta;</mi><mo>&rarr;</mo><mi>&Omega;</mi>", "α ± β → Ω");

// adjacency: never merge digits, never change the mathematics
eq("<mn>1</mn><mn>2</mn>", "1 2");
eq("<mn>3</mn><mspace width='1em'/><mn>4</mn>", "3 4");
eq("<mn>2</mn><msup><mn>3</mn><mn>2</mn></msup>", "2 * 3^2");
eq("<mn>2</mn><mfrac><mn>1</mn><mn>2</mn></mfrac>", "(2 + 1/2)");
eq("<mn>2</mn><mfrac><mi>x</mi><mn>3</mn></mfrac>", "2 * (x/3)");
eq("<mfrac><mn>1</mn><mn>2</mn></mfrac><mfrac><mn>3</mn><mn>4</mn></mfrac>", "(1/2) * (3/4)");
eq("<mfrac><mn>1</mn><mn>2</mn></mfrac><mi>x</mi>", "(1/2) * x");
eq("<mn>2</mn><mi>x</mi>", "2x");
eq("<mi>m</mi><mi>v</mi>", "mv");
eq("<mi>x</mi><mn>2</mn>", "x * 2");
eq("<mn>3</mn><mrow><mo>(</mo><mi>x</mi><mo>+</mo><mn>1</mn><mo>)</mo></mrow>", "3(x + 1)");
eq("<mi>f</mi><mo>&#x2061;</mo><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow>", "f(x)");
eq("<mi>P</mi><mo>(</mo><mi>k</mi><mo>)</mo><mo>=</mo><mi>p</mi>", "P(k) = p");
eq("<mn>3</mn><mn>4</mn><mi>x</mi>", "3 4x");
eq("<mi>sin</mi><mi>&theta;</mi>", "sin θ");
eq("<mi>sin</mi><mo>&#x2061;</mo><mo>(</mo><mi>x</mi><mo>)</mo>", "sin(x)");
eq("<msup><mi>sin</mi><mrow><mo>&#x2212;</mo><mn>1</mn></mrow></msup><mo>(</mo><mi>x</mi><mo>)</mo>", "sin^(-1)(x)");
eq("<msub><mi>log</mi><mn>2</mn></msub><mo>(</mo><mi>x</mi><mo>)</mo>", "log_2(x)");
eq("<mn>9.81</mn><mtext>&#xA0;</mtext><mfrac><mtext>m</mtext><msup><mtext>s</mtext><mn>2</mn></msup></mfrac>", "9.81 m/s^2");
eq("<mn>42</mn><mtext>&#xA0;kg</mtext>", "42 kg");
eq("<mstyle><mi>x</mi></mstyle><mpadded><mn>2</mn></mpadded>", "x * 2");

// fractions, roots, scripts
eq("<mfrac><mn>3</mn><mn>4</mn></mfrac>", "3/4");
eq("<mfrac><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mi>c</mi></mfrac>", "(a + b)/c");
eq("<mfrac><mrow><mi>a</mi><mo>+</mo><mn>1</mn></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac>", "(a + 1)/(2a)");
eq("<msqrt><mn>2</mn></msqrt>", "sqrt(2)");
eq("<msqrt><mi>x</mi><mo>+</mo><mn>1</mn></msqrt>", "sqrt(x + 1)");
eq("<msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt>", "sqrt(b^2 - 4ac)");
eq("<mroot><mi>x</mi><mn>3</mn></mroot>", "root(x, 3)");
eq("<msup><mi>x</mi><mn>2</mn></msup>", "x^2");
eq("<msup><mi>e</mi><mrow><mi>n</mi><mo>&#x2212;</mo><mi>k</mi></mrow></msup>", "e^(n - k)");
eq("<msup><mi>e</mi><mrow><mo>&#x2212;</mo><mi>k</mi><mi>t</mi></mrow></msup>", "e^(-kt)");
eq("<msup><msup><mn>2</mn><mn>3</mn></msup><mn>2</mn></msup>", "(2^3)^2");
eq("<msup><mfrac><mi>a</mi><mi>b</mi></mfrac><mn>3</mn></msup>", "(a/b)^3");
eq("<msup><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mn>2</mn></msup>", "(x + 1)^2");
eq("<msup><mfenced><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow></mfenced><mrow><mo>&#x2212;</mo><mn>2</mn></mrow></msup>", "(x + 1)^(-2)");
eq("<msup><msqrt><mn>2</mn></msqrt><mn>3</mn></msup>", "sqrt(2)^3");
eq("<msup><mi>Sn</mi><mrow><mn>2</mn><mo>+</mo></mrow></msup>", "Sn^(2+)");
eq("<msubsup><mi>MnO</mi><mn>4</mn><mo>&#x2212;</mo></msubsup>", "MnO_4^(-)");
eq("<msub><mi>v</mi><mi>x</mi></msub>", "v_x");
eq("<msub><mi>a</mi><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow></msub>", "a_(n + 1)");
eq("<msubsup><mi>x</mi><mn>1</mn><mn>2</mn></msubsup>", "x_1^2");
eq("<msubsup><mi>x</mi><mrow><mi>i</mi><mo>+</mo><mn>1</mn></mrow><mn>2</mn></msubsup>", "x_(i + 1)^2");

// sums
eq("<munderover><mo>&#x2211;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msub><mi>a</mi><mi>i</mi></msub>", "sum(i = 1 to n) a_i");
eq("<munder><mo>&#x220F;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow></munder><mi>x</mi>", "prod(i = 1) x");
eq("<msubsup><mo>&#x222B;</mo><mi>a</mi><mi>b</mi></msubsup><mi>f</mi>", "int(a to b) f");

// over / under
eq("<mover><mi>v</mi><mo>&#x2192;</mo></mover>", "vec(v)");
eq("<mover><mi>x</mi><mo>&#xAF;</mo></mover>", "bar(x)");
eq("<mover><mi>x</mi><mo>^</mo></mover>", "x over ^");
eq("<munder><mi>lim</mi><mrow><mi>x</mi><mo>&#x2192;</mo><mn>0</mn></mrow></munder>", "lim under x → 0");

// combinations as this source writes them
eq("<mmultiscripts><mi>C</mi><mi>k</mi><none/><mprescripts/><mi>n</mi><none/></mmultiscripts>", "nCk");
eq("<mmultiscripts><mi>C</mi><mrow><mi>n</mi><mo>&#x2212;</mo><mn>1</mn></mrow><none/><mprescripts/><mi>n</mi><none/></mmultiscripts>", "(n)C(n - 1)");
eq("<mmultiscripts><mrow><mi>C</mi></mrow><mn>0</mn><none /><mprescripts /><mn>5</mn><none /></mmultiscripts>", "5C0");
eq("<mmultiscripts><mi>C</mi><mi>k</mi><none/><mprescripts/><mi>n</mi><none/></mmultiscripts><msup><mi>p</mi><mi>k</mi></msup><msup><mrow><mo>(</mo><mn>1</mn><mo>&#x2212;</mo><mi>p</mi><mo>)</mo></mrow><mrow><mi>n</mi><mo>&#x2212;</mo><mi>k</mi></mrow></msup>", "nCk * p^k * (1 - p)^(n - k)");

// fences
eq("<mfenced><mi>a</mi><mi>b</mi></mfenced>", "(a, b)");
eq('<mfenced open="[" close=")"><mn>0</mn><mn>1</mn></mfenced>', "[0, 1)");
eq('<mfenced open="[" close="]" separators=";"><mn>1</mn><mn>2</mn><mn>3</mn></mfenced>', "[1; 2; 3]");
eq('<mfenced open="|" close="|"><mrow><mi>x</mi><mo>&#x2212;</mo><mn>3</mn></mrow></mfenced>', "|x - 3|");
eq('<mfenced open="|" close="|"><mi>x</mi><mo>&#x2212;</mo><mn>3</mn></mfenced>', "|x - 3|");
eq("<mn>3</mn><mfenced><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow></mfenced>", "3(x + 1)");
eq("<mfenced><mi>x</mi></mfenced>", "(x)");

// tables: one line per row
eq("<mtable><mtr><mtd><mi>x</mi><mo>=</mo></mtd><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mi>y</mi><mo>=</mo></mtd><mtd><mn>2</mn></mtd></mtr></mtable>", "x = 1\ny = 2");
eq("<mtable><mtr><mtd><mn>2</mn><mi>x</mi><mo>+</mo><mi>y</mi></mtd><mtd><mo>=</mo><mn>5</mn></mtd></mtr><mtr><mtd><mi>x</mi><mo>&#x2212;</mo><mi>y</mi></mtd><mtd><mo>=</mo><mn>1</mn></mtd></mtr></mtable>", "2x + y = 5\nx - y = 1");
eq("<mtable><mtr><mtd><mn>2</mn><mi>x</mi></mtd><mtd><mo>+</mo><mi>y</mi></mtd><mtd><mo>=</mo><mn>5</mn></mtd></mtr></mtable>", "2x + y = 5");

// the rest
eq("<mi>a</mi><mphantom><mi>zzz</mi></mphantom><mi>b</mi>", "ab");
eq("<semantics><mrow><mi>x</mi></mrow><annotation encoding='x'>LaTeX x</annotation></semantics>", "x");
eq("<semantics><annotation encoding='x'>LaTeX x</annotation><mrow><mi>y</mi></mrow></semantics>", "y");
eq('<mfrac><mn>1</mn><mn>2</mn></mfrac><annotation encoding="x">\\frac12</annotation>', "1/2");
eq("<foo><mi>x</mi><mo>+</mo><mn>1</mn></foo>", "x + 1");
eq("hello <mi>x</mi>", "hello x");
eq("<foo>text</foo>", "text");
eq("<mtext>&#xA0;m</mtext>", "m");
assert.equal(t("<math/>"), "");

// robustness: never throws, never hangs, digits never merge
{
  const deep = "<math>" + "<mrow>".repeat(2000) + "<mn>1</mn><mn>2</mn>" + "</mrow>".repeat(2000) + "</math>";
  const r = t(deep);
  assert.equal(typeof r, "string");
  assert.ok(r.includes("1 2"), r.slice(0, 40));
  const open = t("<math>" + "<mi>".repeat(3000));
  assert.equal(typeof open, "string");
  const big = t("<math>" + "<mn>1</mn>".repeat(30000) + "</math>");
  assert.ok(big.startsWith("1 1 1"));
  assert.equal(typeof t("<math><mn>1</mn><mfrac><mn>2</mn>"), "string", "unclosed tags do not throw");
}

// real samples, when present (untrusted data: read only)
const sample = (rel: string) => {
  const f = path.join(homedir(), "Downloads", rel);
  return existsSync(f) ? readFileSync(f, "utf8") : null;
};
const s1 = sample("Item146799/item_146799_apip.xml");
if (s1) {
  const maths = [...s1.matchAll(/<math\b[\s\S]*?<\/math>/g)].map((x) => t(x[0]));
  const lines = maths.flatMap((x) => x.split("\n"));
  assert.ok(lines.includes("P(k) = nCk * p^k * (1 - p)^(n - k)"), maths.join(" || "));
  assert.ok(lines.includes("P(0) = 5C0 * (0.70)^0 * (0.30)^5"), maths.join(" || "));
}
const s2 = sample("Item234035/item_234035_apip.xml");
if (s2) {
  const first = [...s2.matchAll(/<math\b[\s\S]*?<\/math>/g)].map((x) => t(x[0])).find((x) => x.includes("8.3"));
  assert.ok(first && first.includes("8.3") && first.includes("m/s") && first.includes("42"), String(first));
}
console.log("mathml tests ok");
