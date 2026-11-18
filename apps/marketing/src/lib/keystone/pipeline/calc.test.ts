import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { calcCheck, closingSentence, statedNumbers, toPlainDecimal } from "./calc";
import type { CalcFinding } from "./calc";
import type { Answer } from "./answers";
import type { ItemDoc } from "../db";
import type { Draft } from "./write";

const NUM: Answer = { kind: "number", value: "0.998" };
const item = (stem = "<p>Find the probability.</p>"): ItemDoc => ({ itemType: "NR", questionHtml: stem, options: [] }) as unknown as ItemDoc;
const draft = (opts: { short?: string; diploma?: string; calc?: Draft["calc"] }): Draft => ({
  topic: "t",
  sections: [
    { kind: "short", md: opts.short ?? "The probability is 0.998." },
    { kind: "diploma", md: opts.diploma ?? "We compute it. So the probability is 0.998." },
  ],
  calc: opts.calc,
});
const codes = (f: CalcFinding[]) => f.map((x) => x.code);

// --- statedNumbers (pure) ---
assert.deepEqual(statedNumbers("The answer is $0.998$."), ["0.998"]);
assert.deepEqual(statedNumbers("It is $$1\\,250 \\text{ m}$$ and \\text{3 apples} then 2"), ["1250", "2"]);
assert.deepEqual(statedNumbers("Costs 1,250.5 dollars, or -4 and 3 000"), ["1250.5", "-4", "3000"]);
assert.deepEqual(statedNumbers("no numbers here"), []);
assert.deepEqual(statedNumbers("$2.50 \\times 10^{3}$ J"), ["2500"]);
assert.deepEqual(statedNumbers("$x_1 = 5$"), ["5"]);
assert.deepEqual(statedNumbers("$v_{1} = 4.0$"), ["4.0"]);
assert.deepEqual(statedNumbers("half is $\\frac{1}{2}$ of 8"), ["1/2", "8"]);
assert.deepEqual(statedNumbers("6.02 x 10^23 and 1.5e-3"), ["602000000000000000000000", "0.0015"]);
assert.deepEqual(statedNumbers("$9.81\\ \\text{m/s}^2$"), ["9.81"]);
assert.deepEqual(statedNumbers("9.81 m/s^2 and 3 cm^{3}"), ["9.81", "3"]);
assert.deepEqual(statedNumbers("$10^{-3}$"), ["0.001"]);
assert.deepEqual(statedNumbers("a 10^-3 g"), ["0.001"]);
assert.deepEqual(statedNumbers("x^{2} + 3"), ["2", "3"]);
// toPlainDecimal
assert.equal(toPlainDecimal("2.50e3"), "2500");
assert.equal(toPlainDecimal("2.50E+3"), "2500");
assert.equal(toPlainDecimal("2.50 × 10^3"), "2500");
assert.equal(toPlainDecimal("2.50 \\times 10^{3}"), "2500");
assert.equal(toPlainDecimal("2.50*10^3"), "2500");
assert.equal(toPlainDecimal("2.50 x 10^-3"), "0.00250");
assert.equal(toPlainDecimal("2.5 × 10^\u22123"), "0.0025");
assert.equal(toPlainDecimal("-3.01 × 10^23"), "-301000000000000000000000");
assert.equal(toPlainDecimal("0.998"), "0.998");
assert.equal(toPlainDecimal("12 m"), null);
assert.equal(toPlainDecimal("abc"), null);

const python = spawnSync("python3", ["-I", "-c", "import sys; sys.path.append(__import__('site').getusersitepackages()); import sympy"], { encoding: "utf8" });
const havePython = python.status === 0;

async function main() {
  // --- consistency checks that need no python ---
  assert.deepEqual(codes(await calcCheck(draft({}), NUM, item())), []);
  {
    const f = await calcCheck(draft({ short: "The probability is 0.998.", diploma: "First we multiply. Hence the probability is 0.997." }), NUM, item());
    assert.deepEqual(codes(f), ["answer_inconsistent"]);
    assert.match(f[0].detail, /diploma/);
    assert.match(f[0].detail, /0\.997/);
    assert.match(f[0].detail, /0\.998/);
  }
  assert.deepEqual(codes(await calcCheck(draft({ short: "The probability is 0.997." }), NUM, item())), ["answer_inconsistent"]);
  // a sentence may restate given quantities as well
  assert.deepEqual(codes(await calcCheck(draft({ short: "With 5 trials the probability is 0.998.", diploma: "x. So with p = 0.3 the probability is $0.998$." }), NUM, item())), []);

  // letters
  const A: Answer = { kind: "choice", letters: ["A"] };
  const letterDraft = (short: string) => draft({ short, diploma: "Reasoning." });
  assert.deepEqual(codes(await calcCheck(letterDraft("A ball rolls down a slope. So the answer is A."), A, item())), []);
  assert.deepEqual(codes(await calcCheck(letterDraft("A ball rolls down a slope. So the answer is B."), A, item())), ["letter_mismatch"]);
  assert.deepEqual(codes(await calcCheck(letterDraft("A ball rolls down a slope, which is option A."), A, item())), ["letter_mismatch"]); // no closing sentence
  {
    const f = await calcCheck(letterDraft("It speeds up."), A, item());
    assert.equal(f[0].detail, "the Short answer does not end with: So the answer is A.");
  }
  const Bk: Answer = { kind: "choice", letters: ["B"] };
  assert.deepEqual(codes(await calcCheck(letterDraft("The answer is not A but B. So the answer is B."), Bk, item())), []);
  assert.deepEqual(codes(await calcCheck(letterDraft("Options A and B are wrong. So the answer is C."), { kind: "choice", letters: ["C"] }, item())), []);
  assert.deepEqual(codes(await calcCheck(letterDraft("Work.\n\nSo the answers are A and C.\n"), { kind: "choice", letters: ["C", "A"] }, item())), []);
  assert.deepEqual(codes(await calcCheck(letterDraft("So the answers are A, C and D."), { kind: "choice", letters: ["D", "A", "C"] }, item())), []);
  assert.deepEqual(codes(await calcCheck(letterDraft("So the answers are A, C, and D."), { kind: "choice", letters: ["A", "C", "D"] }, item())), ["letter_mismatch"]); // no Oxford comma
  assert.deepEqual(codes(await calcCheck(letterDraft("So the answer is A."), { kind: "choice", letters: ["A", "C"] }, item())), ["letter_mismatch"]);
  assert.equal(closingSentence(["c", "a"]), "So the answers are A and C.");
  assert.equal(closingSentence(["B"]), "So the answer is B.");

  // units
  const stem = "<p>Calculate the speed. Give your answer in <b>m/s</b>.</p>";
  const ms: Answer = { kind: "number", value: "12" };
  const d = (short: string) => draft({ short, diploma: "Work. So the speed is 12 m/s." });
  assert.deepEqual(codes(await calcCheck(d("The speed is 12 m/s."), ms, item(stem))), []);
  assert.deepEqual(codes(await calcCheck(d("The speed is $12\\,\\text{m/s}$."), ms, item(stem))), []);
  assert.deepEqual(codes(await calcCheck(d("The speed is 12."), ms, item(stem))), ["unit_missing"]);
  assert.deepEqual(codes(await calcCheck(d("The speed is 12."), ms, item("<p>Calculate the speed.</p>"))), []); // stem names no unit
  assert.deepEqual(codes(await calcCheck(d("The result is the answer."), ms, item(stem))), ["answer_inconsistent"]); // sentence not found: only the number check fires
  // degree sign in LaTeX, and a unit word only counts after a lead-in
  const deg = "<p>What is the temperature? Express your answer in &deg;C.</p>";
  const t25: Answer = { kind: "number", value: "25" };
  const dt = (short: string) => draft({ short, diploma: "Work. So it is 25 °C." });
  assert.deepEqual(codes(await calcCheck(dt("It is $25^{\\circ}\\text{C}$."), t25, item(deg))), []);
  assert.deepEqual(codes(await calcCheck(dt("It is $25^\\circ \\mathrm{C}$."), t25, item(deg))), []);
  assert.deepEqual(codes(await calcCheck(dt("It is 25 °C."), t25, item("<p>Give the temperature in °C.</p>"))), []);
  assert.deepEqual(codes(await calcCheck(dt("It is 25."), t25, item(deg))), ["unit_missing"]);
  assert.deepEqual(codes(await calcCheck(dt("It is 25."), t25, item("<p>Which value in A is largest?</p>"))), []);
  // lead-ins are case-insensitive, units are not
  {
    const x: Answer = { kind: "number", value: "25.3" };
    const du = (short: string) => draft({ short, diploma: "Work. So it is 25.3 units." });
    const cases: [string, string, string][] = [
      ["<p>Express the result in kJ.</p>", "It is 25.3.", "It is 25.3 kJ."],
      ["<p>Give the speed in m/s.</p>", "It is 25.3.", "It is $25.3\\ \\text{m/s}$."],
      ["<p>To the nearest tenth, give the temperature in °C.</p>", "It is 25.3.", "It is 25.3 °C."],
      ["<p>Record the time to the nearest 0.1 s.</p>", "It is 25.3.", "It is 25.3 s."],
    ];
    for (const [st, bad, good] of cases) {
      assert.deepEqual(codes(await calcCheck(du(bad), x, item(st))), ["unit_missing"], st);
      assert.deepEqual(codes(await calcCheck(du(good), x, item(st))), [], st);
    }
    assert.deepEqual(codes(await calcCheck(du("It is 25.3."), x, item("<p>Which value in A is largest?</p>"))), []);
    assert.deepEqual(codes(await calcCheck(du("It is 25.3."), x, item("<p>Calculate the speed in m/s.</p>"))), []);
    assert.deepEqual(codes(await calcCheck(du("It is 25.3."), x, item("<p>Give the amount in M.</p>"))), []); // "M" is not a unit here
  }
  // scientific notation in both sections
  {
    const sci: Answer = { kind: "number", value: "2500" };
    const f = await calcCheck(draft({ short: "The energy is $2.50 \\times 10^{3}$ J.", diploma: "Work. So E = $2.50 \\times 10^{3}$ J." }), sci, item("<p>Energy in J?</p>"));
    assert.deepEqual(codes(f), []);
  }
  // the Diploma's last sentence must state the answer
  {
    const f = await calcCheck(draft({ diploma: "We compute it. Therefore the sample is large enough." }), NUM, item());
    assert.deepEqual(f.map((x) => x.detail), ["the Diploma answer's last sentence does not state the answer"]);
  }

  // python missing -> one finding, never a throw
  {
    const f = await calcCheck(draft({ calc: [{ expr: "1+1", expect: "2" }] }), NUM, item(), { python: "/nonexistent/python3" });
    assert.deepEqual(codes(f), ["calc_unparseable"]);
    assert.match(f[0].detail, /^calculation check could not run: /);
  }
  assert.deepEqual(codes(await calcCheck(draft({}), NUM, item(), { python: "/nonexistent/python3" })), []); // no calc: nothing spawned

  if (!havePython) {
    console.log("calc tests skipped: python3 with sympy not available");
    return;
  }

  const run = async (expr: string, expect = "", rounding = "") => calcCheck(draft({ calc: [{ expr, expect, rounding }] }), NUM, item());
  const ok = async (expr: string, expect: string, rounding = "") => assert.deepEqual(await run(expr, expect, rounding), [], `${expr} expect ${expect}`);

  // the brief's cases
  await ok("1 - 0.30**5", "0.998", "3dp");
  {
    const f = await run("1 - 0.30**5", "0.997", "3dp");
    assert.deepEqual(codes(f), ["calc_mismatch"]);
    assert.match(f[0].detail, /0\.998/);
    assert.match(f[0].detail, /0\.997/);
  }
  {
    const marker = join(mkdtempSync(join(tmpdir(), "calc-")), "touched");
    const hostile = [
      `__import__('os').system('touch ${marker}')`,
      `open("${marker}","w")`,
      `eval("1")`, "os", "open", "__class__", "().__class__", "(1).__class__", "1; 2", "1 = 1", "lambda: 1", "[1]", "{1}", "'a'", "a.b", "1\\2",
      "sqrt.__call__(4)", "exec", "compile", "sympify", "Symbol", "Integer", "Float",
    ];
    for (const expr of hostile) {
      const f = await run(expr, "1");
      assert.deepEqual(codes(f), ["calc_unparseable"], expr);
    }
    assert.equal(existsSync(marker), false, "hostile expression had a side effect");
    rmSync(join(marker, ".."), { recursive: true, force: true });
  }
  {
    const f = await calcCheck(
      draft({ calc: [{ expr: "0.30**5", expect: "0.002", rounding: "3dp" }, { expr: "1 - 0.002", expect: "0.998", rounding: "3dp" }] }),
      NUM, item(),
    );
    assert.deepEqual(codes(f), ["early_rounding"]);
    assert.match(f[0].detail, /calculation 2/);
    assert.match(f[0].detail, /calculation 1/);
  }
  // exact intermediate values (no rounding) may be reused
  assert.deepEqual(codes(await calcCheck(
    draft({ calc: [{ expr: "0.5*0.5", expect: "0.25" }, { expr: "1 - 0.25", expect: "0.75" }] }), { kind: "number", value: "0.998" }, item(),
  )), []);

  // E-notation can hang inside C code: never let it through
  for (const bad of ["1E+5", "1e5", "1E-5", "1.5E+3", "2 E 3", "E5", "E.5", "1E+10000000"]) {
    const t0 = Date.now();
    const f = await run(bad, "1");
    assert.deepEqual(codes(f), ["calc_unparseable"], bad);
    assert.match(f[0].detail, /exponent notation is not allowed/, bad);
    assert.ok(Date.now() - t0 < 1500, `${bad} took ${Date.now() - t0} ms`);
  }
  await ok("E^2", "7.389", "3dp");
  await ok("2*E", "5.437", "3dp");
  await ok("E", "2.718", "3dp");
  // a rounded request never returns invented digits
  await ok("2^100", "1267650600228229401496703205376", "0dp");
  await ok("10^40+1", "1" + "0".repeat(39) + "1", "0dp");
  await ok("100/3", "33." + "3".repeat(30), "30dp");
  await ok("2^100", "1267650600228229401496703205376");
  await ok("Rational(-1, 2)", "-0.5");
  assert.deepEqual(codes(await run("Rational(1, 0)", "1")), ["calc_unparseable"]);
  assert.deepEqual(codes(await run("1/3", "0.3", "61sf")), ["calc_unparseable"]);
  assert.deepEqual(codes(await run("1/3", "0.3", "61dp")), ["calc_unparseable"]);
  // plain decimals for any magnitude, never exponent form
  await ok("1.5*10^20", "150000000000000000000");
  await ok("1.5*10^-20", "0.000000000000000000015");
  await ok("10^100", "1" + "0".repeat(100) + ".00", "2dp");
  await ok("6.02*10^23", "602000000000000000000000", "3sf");
  await ok("6.02*10^23", "6.02 × 10^23", "3sf");
  await ok("3.01*10^23", "3.01 × 10^{23}", "3sf");
  await ok("2.5*10^3", "2.50e3");
  assert.deepEqual(codes(await run("10^301", "1")), ["calc_unparseable"]);
  assert.deepEqual(codes(await run("10^-301", "1")), ["calc_unparseable"]);
  assert.deepEqual(codes(await run("Rational(1.5, 2)", "1")), ["calc_unparseable"]);
  assert.deepEqual(codes(await run("Rational(1, 2, 3)", "1")), ["calc_unparseable"]);
  assert.deepEqual(codes(await run("7 // 2", "3")), ["calc_unparseable"]);
  assert.deepEqual(codes(await run("1\t+ 1", "2")), ["calc_unparseable"]);
  assert.deepEqual(codes(await run("1\u000c+ 1", "2")), ["calc_unparseable"]);

  // early rounding: the three false positives from review stay quiet
  {
    const quiet = async (calc: Draft["calc"], stem?: string) => codes(await calcCheck(draft({ calc }), NUM, item(stem)));
    assert.deepEqual(await quiet([{ expr: "1.6", expect: "2", rounding: "0dp" }, { expr: "0.5*3^2", expect: "4.5" }]), []);
    assert.deepEqual(await quiet([{ expr: "1.6", expect: "2", rounding: "0dp" }, { expr: "Rational(1, 2)", expect: "0.5" }]), []);
    assert.deepEqual(await quiet([{ expr: "1.234", expect: "1.23", rounding: "2dp" }, { expr: "1.23*2", expect: "2.46", rounding: "2dp" }], "<p>A rod is 1.23 m long.</p>"), []);
    assert.deepEqual(await quiet([{ expr: "9.812", expect: "9.81", rounding: "2dp" }, { expr: "9.81*2", expect: "19.62", rounding: "2dp" }]), []); // a common constant
    assert.deepEqual(await quiet([{ expr: "1.234", expect: "1.23", rounding: "2dp" }, { expr: "10^1.23", expect: "16.98", rounding: "2dp" }]), []);
  }

  // slow test (up to ~9 s): the batch returns every result before the TS timeout and exits 0
  {
    const t0 = Date.now();
    const f = await calcCheck(draft({ calc: [{ expr: "exp(10^9999)", expect: "1" }, { expr: "exp(10^9999)", expect: "1" }, { expr: "1+1", expect: "2" }] }), NUM, item());
    const took = Date.now() - t0;
    assert.deepEqual(codes(f), ["calc_unparseable", "calc_unparseable", "calc_unparseable"]);
    assert.ok(f.every((x) => /took too long/.test(x.detail)), JSON.stringify(f));
    assert.ok(took < 10_500, `slow batch took ${took} ms`);
  }
  {
    const many = Array.from({ length: 201 }, () => ({ expr: "1+1", expect: "2" }));
    const f = await calcCheck(draft({ calc: many }), NUM, item());
    assert.deepEqual(f.map((x) => x.code), ["calc_unparseable"]);
    assert.match(f[0].detail, /too many expressions/);
  }

  // every allowed name once
  await ok("sqrt(16)", "4");
  await ok("sin(0)", "0");
  await ok("cos(0)", "1");
  await ok("tan(0)", "0");
  await ok("asin(1)", "1.5707963267949", "13dp");
  await ok("acos(1)", "0");
  await ok("atan(1)", "0.785398163397448");
  await ok("log(E)", "1");
  await ok("log(8, 2)", "3");
  await ok("ln(E**2)", "2");
  await ok("log10(1000)", "3");
  await ok("exp(0)", "1");
  await ok("pi", "3.14", "2dp");
  await ok("E", "2.718", "3dp");
  await ok("Rational(1, 4)", "0.25");
  await ok("binomial(5, 2)", "10");
  await ok("factorial(5)", "120");
  await ok("Abs(-3.5)", "3.5");
  await ok("sind(30)", "0.5");
  await ok("cosd(60)", "0.5", "5dp");
  await ok("tand(45)", "1");
  await ok("asind(0.5)", "30");
  await ok("acosd(0.5)", "60");
  await ok("atand(1)", "45");
  await ok("2^10", "1024");
  await ok("2 ^ 0.5", "1.414", "3dp");
  // rounding
  await ok("2.675", "2.68", "2dp");
  await ok("1234.5", "1200", "2sf");
  await ok("0.0012345", "0.00123", "3sf");
  await ok("2.5", "2.50", "3sf");
  await ok("1/3", "0.333333333333333");
  assert.deepEqual(codes(await run("2.675", "2.67", "2dp")), ["calc_mismatch"]);
  assert.deepEqual(codes(await run("1/3", "0.3333")), ["calc_mismatch"]);

  // rejections
  assert.deepEqual(codes(await run("1" + "+1".repeat(250), "251")), ["calc_unparseable"]); // 501 characters
  await ok("1" + "+1".repeat(249), "250"); // 499 characters is fine
  for (const bad of ["x + 1", "2 3", "2pi", "sin", "1/0", "sqrt(-1)", "1 +", "", "10**10**10", "10**10001", "factorial(100001)", "binomial(100001, 2)", "2 ** 3 ** 4"]) {
    const f = await run(bad, "1");
    assert.deepEqual(codes(f), ["calc_unparseable"], bad);
  }
  {
    const f = await run("x + 1", "1");
    assert.match(f[0].detail, /name not allowed/);
  }

  // several entries keep their order
  {
    const f = await calcCheck(draft({ calc: [{ expr: "1+1", expect: "2" }, { expr: "os", expect: "1" }, { expr: "2+2", expect: "5" }] }), NUM, item());
    assert.deepEqual(codes(f), ["calc_unparseable", "calc_mismatch"]);
    assert.match(f[0].detail, /calculation 2/);
    assert.match(f[1].detail, /calculation 3/);
  }
}

main().then(
  () => { if (havePython) console.log("calc tests passed"); },
  (e) => { console.error(e); process.exit(1); },
);
