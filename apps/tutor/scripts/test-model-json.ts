/**
 * Tolerant reading of a model's JSON reply (src/lib/tutor/ai/model-json.ts).
 *
 * Run: `npm run test:model-json`. Pure — no model calls.
 *
 * The reply shapes are the REAL ones the practice grader's judge produced on
 * 2026-10-05 (11 maths answers silently marked wrong): prose before the
 * object, and an object the model then corrected with a second object.
 */
import assert from 'node:assert';
import { parseJsonObjects, repairJsonStringEscapes, replyHead } from '../src/lib/tutor/ai/model-json';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}
const last = (raw: string) => parseJsonObjects(raw).at(-1);
const BS = '\\';

console.log('\nmodel-json: finding the object\n');

test('a bare object parses', () => {
  assert.deepStrictEqual(parseJsonObjects('{"correct": true, "feedback": "Yes."}'), [{ correct: true, feedback: 'Yes.' }]);
});

test('fenced object parses', () => {
  assert.deepStrictEqual(last('```json\n{"correct": false, "feedback": "No."}\n```'), { correct: false, feedback: 'No.' });
});

test('REAL shape 1 — prose, then the object (gen-42b6b3db… "(x+4)e^x")', () => {
  const raw =
    "The student's answer is equivalent. e^x + (x+3)e^x = e^x(1 + x + 3) = (x+4)e^x.\n\n" +
    '{"correct": true, "feedback": "Correct! Your simplified form (x+4)e^x is equivalent to e^x + (x+3)e^x obtained by the product rule."}';
  const objs = parseJsonObjects(raw);
  assert.strictEqual(objs.length, 1);
  assert.strictEqual(objs[0].correct, true);
});

test('REAL shape 2 — an object, a self-correction in prose, then the final object: both are returned, in order', () => {
  const raw =
    '{"correct": false, "feedback": "Parts (b) and (c) are correct, and μ = 6 is correct, but σ = √30 is wrong."}\n\n' +
    'Wait — let me recompute. σ = √(q/p²) = √((5/6)/(1/36)) = √30. So the answer σ = √30 is correct.\n\n' +
    '{"correct": true, "feedback": "All parts are correct: μ = 6, σ = √30 ≈ 5.48, P(X=1) = 1/6, and P(X≤3) = 1−(5/6)³ = 91/216 ≈ 0.421."}';
  const objs = parseJsonObjects(raw);
  assert.strictEqual(objs.length, 2);
  assert.strictEqual(objs[0].correct, false);
  assert.strictEqual(objs[1].correct, true, 'the LAST object is the model\'s final verdict');
});

test('braces in the prose (a set, a LaTeX group) are skipped, not mistaken for the object', () => {
  const raw = `Using the set {1, 2} and ${BS}frac{1}{2}:\n{"correct": true, "feedback": "ok"}\nDone.`;
  assert.deepStrictEqual(parseJsonObjects(raw), [{ correct: true, feedback: 'ok' }]);
});

test('an unclosed brace in the prose does not hide the object after it', () => {
  assert.deepStrictEqual(parseJsonObjects('Consider { x : x > 0.\n{"correct": false, "feedback": "no"}'), [{ correct: false, feedback: 'no' }]);
});

test('nested objects come back as ONE outer object', () => {
  const objs = parseJsonObjects('{"a": {"b": {"c": 1}}, "d": "}"}');
  assert.deepStrictEqual(objs, [{ a: { b: { c: 1 } }, d: '}' }]);
});

test('truncated at the token cap, prose only, empty, an array → nothing', () => {
  assert.deepStrictEqual(parseJsonObjects('{"correct": false, "feedback": "The derivative of'), []);
  assert.deepStrictEqual(parseJsonObjects('The answer is right.'), []);
  assert.deepStrictEqual(parseJsonObjects(''), []);
  assert.deepStrictEqual(parseJsonObjects('[1, 2, 3]'), []);
});

console.log('\nmodel-json: LaTeX backslashes inside strings\n');

test('`\\frac`, `\\times`, `\\nabla`, `\\beta`, `\\rho` survive as text — NOT form-feed / tab / newline / backspace / CR', () => {
  const raw = `{"problemText": "Compute $${BS}frac{3}{4} ${BS}times 8$, then $${BS}nabla f$, $${BS}beta$ and $${BS}rho$."}`;
  // Plain JSON.parse "succeeds" and corrupts every one of them:
  const naive = JSON.parse(raw).problemText as string;
  assert.ok(/[\f\t\n\b\r]/.test(naive), 'precondition: the naive parse corrupts');
  const text = last(raw)!.problemText as string;
  assert.strictEqual(text, `Compute $${BS}frac{3}{4} ${BS}times 8$, then $${BS}nabla f$, $${BS}beta$ and $${BS}rho$.`);
  assert.ok(!/[\f\t\n\b\r]/.test(text));
});

test('invalid escapes (`\\sqrt`, `\\pi`, `\\(`, `\\,`, `\\{`, `\\underline`) no longer make the reply unparseable', () => {
  const raw = `{"feedback": "Use $${BS}sqrt{8} = 2${BS}sqrt{2}$, ${BS}(${BS}pi r^2${BS}), $a${BS},b$, $${BS}{1,2${BS}}$ and ${BS}underline{this}."}`;
  assert.throws(() => JSON.parse(raw));
  assert.strictEqual(last(raw)!.feedback, `Use $${BS}sqrt{8} = 2${BS}sqrt{2}$, ${BS}(${BS}pi r^2${BS}), $a${BS},b$, $${BS}{1,2${BS}}$ and ${BS}underline{this}.`);
});

test('more LaTeX that starts with a JSON escape letter: text, theta, tan, to, neq, right, begin, bar, forall, tfrac', () => {
  for (const cmd of ['text', 'theta', 'tan', 'to', 'tau', 'neq', 'notin', 'right', 'rangle', 'begin', 'bar', 'binom', 'forall', 'tfrac', 'textbf']) {
    const raw = `{"t": "a ${BS}${cmd}{x} b"}`;
    assert.strictEqual(last(raw)!.t, `a ${BS}${cmd}{x} b`, cmd);
  }
});

test('real line breaks and tabs are KEPT: `\\n`, `\\n\\n`, `\\nNext`, `\\r\\n`, `\\t` + digit', () => {
  const raw = `{"t": "Line one.${BS}nNext line.${BS}n${BS}n(b) third${BS}r${BS}nfourth${BS}t5"}`;
  assert.strictEqual(last(raw)!.t, 'Line one.\nNext line.\n\n(b) third\r\nfourth\t5');
});

test('ambiguous two-letter commands: `x \\ne 0` is LaTeX, `done.\\ne^x` is a line break before "e^x"', () => {
  assert.strictEqual(last(`{"t": "so $x ${BS}ne 0$ and $${BS}nu = 2$"}`)!.t, `so $x ${BS}ne 0$ and $${BS}nu = 2$`);
  assert.strictEqual(last(`{"t": "done.${BS}ne^x is next"}`)!.t, 'done.\ne^x is next');
});

test('already-correct escapes are left alone: `\\\\frac`, `\\"`, `\\\\`, `\\u00e9`, `\\/`', () => {
  const raw = `{"t": "${BS}${BS}frac{1}{2} says ${BS}"hi${BS}" ${BS}${BS} caf${BS}u00e9 a${BS}/b"}`;
  assert.strictEqual(last(raw)!.t, `${BS}frac{1}{2} says "hi" ${BS} café a/b`);
  assert.strictEqual(repairJsonStringEscapes(raw), raw, 'valid JSON is returned byte-for-byte');
});

test('raw control characters inside a string (a literal newline) are escaped, not fatal', () => {
  assert.strictEqual(last('{"t": "line one\nline two"}')!.t, 'line one\nline two');
});

test('backslashes OUTSIDE strings are not touched (the reply stays invalid rather than being guessed at)', () => {
  assert.deepStrictEqual(parseJsonObjects(`{"t": ${BS}frac}`), []);
});

console.log('\nmodel-json: a line break is not a LaTeX command (review 6)\n');

const field = (inner: string) => last(`{"t": "${inner}"}`)!.t as string;

test('a REAL line break before "e.g.", "i)", "i.e.", "mid-…", "less …", "exists", "parallel", "ot…" stays a line break', () => {
  // Each of these used to lose its line break and gain \ne, \ni, \nmid, \nless …
  assert.strictEqual(field(`Use a counterexample,${BS}ne.g. the harmonic series.`), 'Use a counterexample,\ne.g. the harmonic series.');
  assert.strictEqual(field(`Two cases: ${BS}ni) x > 0 ${BS}nii) x < 0`), 'Two cases: \ni) x > 0 \nii) x < 0');
  assert.strictEqual(field(`It converges,${BS}ni.e. the limit exists.`), 'It converges,\ni.e. the limit exists.');
  assert.strictEqual(field(`Review the${BS}nmid-term notes.`), 'Review the\nmid-term notes.');
  assert.strictEqual(field(`The sum is 5${BS}ne.g. 2 + 3.`), 'The sum is 5\ne.g. 2 + 3.', 'a digit before it is not enough');
  assert.strictEqual(field(`It costs $5${BS}ne.g. a coffee.`), 'It costs $5\ne.g. a coffee.', 'a currency dollar is not maths');
  assert.strictEqual(field(`Value is${BS}nless than expected.`), 'Value is\nless than expected.');
  assert.strictEqual(field(`A solution${BS}nexists here.`), 'A solution\nexists here.');
  assert.strictEqual(field(`These are${BS}nparallel lines.`), 'These are\nparallel lines.');
  assert.strictEqual(field(`Step one.${BS}nu is the unknown here.`), 'Step one.\nu is the unknown here.');
  assert.strictEqual(field(`First line${BS}nNext line${BS}n${BS}nThird`), 'First line\nNext line\n\nThird');
  assert.strictEqual(field(`so x = 5${BS}ni think that is right`), 'so x = 5\ni think that is right', 'two-letter commands need maths on BOTH sides');
});

test('…and real LaTeX still survives: inside $…$, or next to maths characters', () => {
  assert.strictEqual(field(`x ${BS}ne 3`), `x ${BS}ne 3`);
  assert.strictEqual(field(`so $x ${BS}ne 3$ holds`), `so $x ${BS}ne 3$ holds`);
  assert.strictEqual(field(`$${BS}ne$`), `$${BS}ne$`);
  assert.strictEqual(field(`with $a ${BS}neq b$ and $${BS}nu = 3$`), `with $a ${BS}neq b$ and $${BS}nu = 3$`);
  assert.strictEqual(field(`x ${BS}neq 0 and y ${BS}notin S`), `x ${BS}neq 0 and y ${BS}notin S`);
  assert.strictEqual(field(`Compute ${BS}nabla f at the origin`), `Compute ${BS}nabla f at the origin`);
  assert.strictEqual(field(`${BS}nabla ${BS}cdot F = 0`), `${BS}nabla ${BS}cdot F = 0`);
  assert.strictEqual(field(`3 ${BS}nmid 10`), `3 ${BS}nmid 10`);
  assert.strictEqual(field(`$3 ${BS}nmid 10$, so`), `$3 ${BS}nmid 10$, so`);
  assert.strictEqual(field(`p ${BS}not= q`), `p ${BS}not= q`);
  assert.strictEqual(field(`f = ${BS}nu ${BS}lambda`), `f = ${BS}nu ${BS}lambda`);
  assert.strictEqual(field(`Use ${BS}theta, ${BS}nu, x${BS}ne y and $${BS}ne$`), `Use ${BS}theta, ${BS}nu, x${BS}ne y and $${BS}ne$`, 'a list of commands');
  // Known limit, pinned: outside $…$ with a WORD before it, `\nu =` cannot be told from a line
  // break followed by "u = …"; it is read as the line break.
  assert.strictEqual(field(`frequency ${BS}nu = 5 Hz`), 'frequency \nu = 5 Hz');
  // An escaped dollar does not open maths.
  assert.strictEqual(field(`pay ${BS}$5${BS}ne.g. cash`), `pay ${BS}$5\ne.g. cash`);
});

test('the other escape letters are unchanged: \\t…, \\r…, \\b…, \\f… commands are still kept as text', () => {
  assert.strictEqual(field(`3 ${BS}times 4 and ${BS}theta, ${BS}rho, ${BS}beta, ${BS}frac{1}{2}`), `3 ${BS}times 4 and ${BS}theta, ${BS}rho, ${BS}beta, ${BS}frac{1}{2}`);
});

test('replyHead: one line, capped, safe to log', () => {
  const head = replyHead('The student\n\tsaid\r\nx.' + 'y'.repeat(500), 40);
  assert.ok(!/[\r\n\t]/.test(head));
  assert.strictEqual(JSON.parse(head).length, 40);
  assert.ok(head.startsWith('"The student said x.yyy'));
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
