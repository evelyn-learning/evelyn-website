import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { calcCheck, statedNumbers } from "./calc";
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
  assert.deepEqual(codes(await calcCheck(letterDraft("The correct choice is option B."), A, item())), ["letter_mismatch"]);
  assert.deepEqual(codes(await calcCheck(letterDraft("A ball rolls down a slope, so the answer is B."), A, item())), ["letter_mismatch"]);
  assert.deepEqual(codes(await calcCheck(letterDraft("A ball rolls down a slope, which is option A."), A, item())), []);
  assert.deepEqual(codes(await calcCheck(letterDraft("The ball speeds up, so the answer is a result of gravity."), A, item())), ["letter_mismatch"]); // names no letter
  assert.deepEqual(codes(await calcCheck(letterDraft("A is correct because of energy."), A, item())), []);
  assert.deepEqual(codes(await calcCheck(letterDraft("Energy is conserved. (A)"), A, item())), []);

  // units
  const stem = "<p>Calculate the speed in <b>m/s</b>.</p>";
  const ms: Answer = { kind: "number", value: "12" };
  const d = (short: string) => draft({ short, diploma: "Work. So the speed is 12 m/s." });
  assert.deepEqual(codes(await calcCheck(d("The speed is 12 m/s."), ms, item(stem))), []);
  assert.deepEqual(codes(await calcCheck(d("The speed is $12\\,\\text{m/s}$."), ms, item(stem))), []);
  assert.deepEqual(codes(await calcCheck(d("The speed is 12."), ms, item(stem))), ["unit_missing"]);
  assert.deepEqual(codes(await calcCheck(d("The speed is 12."), ms, item("<p>Calculate the speed.</p>"))), []); // stem names no unit
  assert.deepEqual(codes(await calcCheck(d("The result is the answer."), ms, item(stem))), ["answer_inconsistent"]); // sentence not found: only the number check fires

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
