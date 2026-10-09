/**
 * Typed-answer grading — the deterministic numeric rule and the grade path.
 *
 *   - portal/numeric-answer-rule.ts — pure rule: a plain-number key is graded
 *     by EQUALITY at the key's written precision, never by "close enough";
 *   - portal/grade-free-response.ts — a numeric key never reaches the model
 *     judge; anything else does, and the judge's prompt carries the question
 *     and the equal-not-close / stated-requirement rules.
 *
 *   - scripts/fixtures/numeric-answer-cases.json — the case table shared with
 *     the academy app (its api and web copies of the rule). Both repos pin the
 *     table's SHA-256 and the SHA-256 of the shared reader/rule block, so a
 *     copy cannot drift silently.
 *
 * No model calls, no database. Run: `npm run test:numeric-answer-rule`
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  gradeNumericAnswer,
  parseNumericKey,
  parseStudentNumber,
} from '../src/lib/tutor/portal/numeric-answer-rule';
import {
  gradeFreeResponse,
  makeGradeDeps,
  buildSingleAnswerJudgePrompt,
  type GradeItem,
  type JsonModelCall,
} from '../src/lib/tutor/portal/grade-free-response';

/** Pinned in BOTH repos (academy: tests/unit/numeric-answer-cases.test.ts). */
const NUMERIC_CASES_SHA256 = '4f8fb5efde7041ec146640b4d4910d14d87e479311a7e8392c1894e847a6bbea';
const NUMERIC_CORE_SHA256 = '547ec0227ad5d561359d21df87ab86f52542f714c7a1db45eca0d8039288ce7b';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}

/** 'correct' | 'wrong' | 'undecided' */
function v(key: string, answer: string): string {
  const r = gradeNumericAnswer(key, answer);
  return r.decided ? (r.correct ? 'correct' : 'wrong') : 'undecided';
}
function all(key: string, answers: string[], expected: string) {
  for (const a of answers) assert.equal(v(key, a), expected, `key "${key}", answer "${a}"`);
}

async function main(): Promise<void> {
  console.log('\nkey form (parseNumericKey):\n');

  await test('integer / decimal / fraction forms are read from the key text', () => {
    assert.deepEqual(pick(parseNumericKey('5')), { form: 'integer', places: 0, value: 5 });
    assert.deepEqual(pick(parseNumericKey('-12')), { form: 'integer', places: 0, value: -12 });
    assert.deepEqual(pick(parseNumericKey('−12')), { form: 'integer', places: 0, value: -12 });
    assert.deepEqual(pick(parseNumericKey('10.81')), { form: 'decimal', places: 2, value: 10.81 });
    assert.deepEqual(pick(parseNumericKey('2.0')), { form: 'decimal', places: 1, value: 2 });
    assert.deepEqual(pick(parseNumericKey('0.0')), { form: 'decimal', places: 1, value: 0 });
    assert.deepEqual(pick(parseNumericKey('$4.50')), { form: 'decimal', places: 2, value: 4.5 });
    assert.deepEqual(pick(parseNumericKey(' 13/3 ')), { form: 'fraction', places: 0, value: 13 / 3 });
    assert.deepEqual(pick(parseNumericKey('-1/2')), { form: 'fraction', places: 0, value: -0.5 });
  });

  await test('a key that is not a plain number is not a numeric key', () => {
    for (const k of ['', 'x = 5', '5 m', '38.4 N·s', '50%', '3 or 5', '2x + 8', 'x < 5', '(2, 3)', '1,200', '3 × 10^8', '√2', '1/0',
      'v_y0 = 20 × 0.5 = 10 m/s. H = 5 m.', 'the mitochondrion', '6x − 5y − 3z = −12', '1/2/3', '5.', '1e5']) {
      assert.equal(parseNumericKey(k), null, `"${k}"`);
    }
  });

  console.log('\nstudent answer (parseStudentNumber):\n');

  await test('strips an identifier-equals prefix, a leading $, a trailing full stop, a trailing %, typographic minus', () => {
    assert.equal(parseStudentNumber('x = 5')?.value, 5);
    assert.equal(parseStudentNumber('x=-12')?.value, -12);
    assert.equal(parseStudentNumber('v0 = 2.50')?.places, 2);
    assert.equal(parseStudentNumber('$4.50')?.value, 4.5);
    assert.equal(parseStudentNumber('5.')?.value, 5);
    assert.equal(parseStudentNumber('5.0.')?.places, 1);
    assert.equal(parseStudentNumber('50%')?.value, 50);
    assert.equal(parseStudentNumber('−3')?.value, -3);
    assert.equal(parseStudentNumber('  13/3 ')?.fraction, true);
    assert.equal(parseStudentNumber('.5')?.value, 0.5);
  });

  await test('anything that is not a single number is not parsed', () => {
    for (const a of ['', 'five', '5 m', '5 meters', 'about 5', '3 or 5', '3, 5', '(2, 3)', 'x < 5', '2x', '5 = x', '1/0', '4.9 ≈ 5',
      'x = 5 and y = 2', '1/2/3', '5..', 'y = x = 5',
      '2 or 3', '2 and 3', '2,5', '2-3', '2 x 3', '2^3', '2π', '2 m/s^2', '84.9 N', '45°', '5 = x', '2 × 10', '2 e3']) {
      assert.equal(parseStudentNumber(a), null, `"${a}"`);
    }
  });

  // 2026-10-09: the whole answer is read. Scientific notation used to be
  // "not a single number" (left to the judge); it is now evaluated, so
  // "2 × 10^3" is decided — right for a key of 2000, wrong for a key of 2.
  await test('scientific notation, a leading + and thousands separators are read by their value; a mixed number is not read', () => {
    assert.equal(parseStudentNumber('3 × 10^8')?.value, 3e8);
    assert.equal(parseStudentNumber('1e5')?.value, 1e5);
    for (const a of ['2 × 10^3', '2 x 10^3', '2*10^3', '2·10³', '2e3', '2E3', '2,000', '+2000']) assert.equal(parseStudentNumber(a)?.value, 2000, a);
    assert.equal(parseStudentNumber('2 × 10⁻⁵')?.value, 0.00002);
    assert.deepEqual(parseStudentNumber('1.2 × 10^-5'), { value: 0.000012, places: 6, fraction: false, kind: 'decimal', text: '1.2×10^-5' });
    assert.equal(parseStudentNumber('1 × 10^-5')?.places, 5);
    assert.deepEqual(parseStudentNumber('+10/21'), { value: 10 / 21, places: 0, fraction: true, kind: 'fraction', text: '10/21' });
    assert.equal(parseStudentNumber('1 1/2'), null);
    all('2', ['2 × 10^3', '2 x 10^3', '2*10^3', '2e3'], 'wrong');
    all('2', ['2 1/2'], 'undecided');
    all('2000', ['2 × 10^3', '2 x 10^3', '2*10^3', '2e3'], 'correct');
    all('0.000012', ['1.2 × 10^-5', '1.23 × 10^-5'], 'correct');
    all('0.000012', ['1 × 10^-5', '1.3 × 10^-5'], 'wrong');
    all('10/21', ['+10/21'], 'correct');
  });

  console.log('\nshared case table (numeric-answer-cases.json):\n');

  const sha = (text: string) => crypto.createHash('sha256').update(text).digest('hex');
  const tableText = fs.readFileSync(path.join(__dirname, 'fixtures', 'numeric-answer-cases.json'), 'utf8');
  const table = JSON.parse(tableText) as { cases: Array<{ key: string; answer: string; expect: 'accept' | 'reject'; engine: string }> };

  await test('the table is the canonical one (same pinned hash as the academy repo)', () => {
    assert.equal(sha(tableText), NUMERIC_CASES_SHA256, 'numeric-answer-cases.json changed: update the academy copy and BOTH pins');
  });

  await test('the reader/rule block is the canonical one (same pinned hash as the two academy copies)', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'tutor', 'portal', 'numeric-answer-rule.ts'), 'utf8');
    const block = src.match(/\/\/ ── numeric-core:begin[\s\S]*?\/\/ ── numeric-core:end[^\n]*\n/);
    assert.ok(block, 'numeric-core block markers');
    assert.equal(sha(block[0]), NUMERIC_CORE_SHA256, 'the shared block changed: change all three copies and BOTH pins');
  });

  await test('every case: the engine verdict is the table\'s, and the rule never accepts an answer the table rejects', () => {
    assert.ok(table.cases.length >= 300);
    const bad: string[] = [];
    for (const c of table.cases) {
      const got = v(c.key, c.answer);
      if (got !== c.engine || (c.expect === 'reject' && got === 'correct')) bad.push(`key "${c.key}" answer "${c.answer}": ${got}, want ${c.engine}`);
      assert.ok(c.engine === 'undecided' || (c.engine === 'correct') === (c.expect === 'accept'), `inconsistent row: key "${c.key}" answer "${c.answer}"`);
    }
    assert.deepEqual(bad, []);
  });

  console.log('\nthe rule (gradeNumericAnswer):\n');

  await test('INTEGER key: equal value only — near misses are wrong', () => {
    all('5', ['5', '5.0', '5.00', 'x = 5', '$5', '5.', '10/2', '5%'], 'correct');
    all('5', ['4.976', '5.024', '4.9', '5.1', '4.999999', '-5', '6', '49/10'], 'wrong');
    all('8', ['7.998', '8.002'], 'wrong');
    all('8', ['8', '8.000'], 'correct');
  });

  await test('INTEGER key: negative keys and zero', () => {
    all('-12', ['-12', '−12', 'x = -12', 'x=−12.0', '-24/2'], 'correct');
    all('-12', ['12', '-11.99', '-12.01'], 'wrong');
    all('0', ['0', '0.0', '-0', '0/7'], 'correct');
    all('0', ['0.001', '-0.004', '0.01'], 'wrong');
  });

  await test('DECIMAL key: at least d places and within half a unit of the last place', () => {
    all('10.81', ['10.81', '10.811', '10.8149', '10.8051', '10.810'], 'correct');
    all('10.81', ['10.80', '10.8', '10.82', '10.816', '10.804', '11', '10'], 'wrong');
    all('63.62', ['63.62', '63.617', '63.6249'], 'correct');
    all('63.62', ['63.6', '63.61', '63.63', '64'], 'wrong');
  });

  await test('DECIMAL key: the half-unit boundary is inclusive', () => {
    all('10.81', ['10.815', '10.805'], 'correct');
    all('10.81', ['10.8151', '10.8049'], 'wrong');
    all('2.5', ['2.55', '2.45'], 'correct');
    all('2.5', ['2.551', '2.449'], 'wrong');
  });

  await test('DECIMAL key: fewer places is correct only when the value is exactly the key', () => {
    all('2.50', ['2.5', '2.50', '2.500', '5/2', '25/10'], 'correct');
    all('2.50', ['2.4', '2.6', '3'], 'wrong');
    all('2.0', ['2', '2.0', '2.04', '1.95'], 'correct');
    all('2.0', ['2.06', '1.9', '1.94', '3'], 'wrong');
    all('0.0', ['0', '0.0', '0.04', '-0.05'], 'correct');
    all('0.0', ['0.1', '0.06', '1'], 'wrong');
    all('-3.75', ['-3.75', '−3.752', '-15/4'], 'correct');
    all('-3.75', ['3.75', '-3.7', '-3.8', '-3.76'], 'wrong');
  });

  await test('DECIMAL key: an exact fraction that rounds to the key is correct', () => {
    all('4.33', ['13/3'], 'correct');
    all('0.33', ['1/3'], 'correct');
    all('4.33', ['14/3', '433/101'], 'wrong');
  });

  await test('FRACTION key: an equal fraction, the exact value, or a ≥2-place decimal equal to the key rounded to its own places', () => {
    all('13/3', ['13/3', '26/6', 'x = 13/3', '4.33', '4.333', '4.3333333'], 'correct');
    all('13/3', ['4.3', '4.34', '4.32', '4.334', '4', '4.4', '12/3', '-13/3'], 'wrong');
    all('1/2', ['1/2', '2/4', '0.5', '0.50', '.5'], 'correct');
    all('1/2', ['0.51', '0.49', '1'], 'wrong');
    all('6/3', ['2', '2.0', '2.00'], 'correct');
    all('2/3', ['0.67', '0.667'], 'correct');
    all('2/3', ['0.66', '0.7', '0.666'], 'wrong');
    all('-1/8', ['-0.125', '-1/8', '-0.13'], 'correct');
    all('-1/8', ['0.125', '-0.12', '-0.1'], 'wrong');
  });

  await test('not decided: the key is not a plain number, or the answer is not a single number', () => {
    all('5', ['five', '5 m', 'about 5', '3 or 5', '5 and 6', '', 'x < 5', '2 + 3'], 'undecided');
    all('10.81', ['10.81 cm', 'roughly 10.8'], 'undecided');
    for (const k of ['x < 5', '5 m', 'the mitochondrion', '6x − 5y − 3z = −12', '50%', 'x = 5']) {
      assert.equal(v(k, '5'), 'undecided', `key "${k}"`);
    }
  });

  await test('feedback is a short deterministic sentence', () => {
    const fb = (k: string, a: string) => {
      const r = gradeNumericAnswer(k, a);
      assert.equal(r.decided, true);
      return r.decided ? r.feedback : '';
    };
    assert.equal(fb('5', '4.976'), 'The expected answer is 5; 4.976 is not equal to it.');
    assert.equal(fb('5', 'x = 4.976.'), 'The expected answer is 5; 4.976 is not equal to it.');
    assert.equal(fb('10.81', '10.80'), 'The expected answer to two decimal places is 10.81, not 10.80.');
    assert.equal(fb('2.5', '2.4'), 'The expected answer to one decimal place is 2.5, not 2.4.');
    assert.match(fb('13/3', '4.3'), /^The expected answer is 13\/3; 4\.3 is not equal to it/);
    assert.equal(fb('5', '5.0'), 'Correct.');
    assert.equal(fb('−12', '-11'), 'The expected answer is -12; -11 is not equal to it.');
  });

  // =========================================================================
  console.log('\ngrade path (gradeFreeResponse + makeGradeDeps, fake model):\n');
  // =========================================================================

  const req = (text: string) => ({ studentId: 's', itemId: 'i', response: { text } });
  function fakeModel(reply: Record<string, unknown>) {
    const calls: Array<{ system: string; user: string }> = [];
    const call: JsonModelCall = async (system, user) => {
      calls.push({ system, user });
      return reply;
    };
    return { calls, deps: makeGradeDeps(call) };
  }

  await test('a numeric key never reaches the judge — wrong near-misses', async () => {
    const m = fakeModel({ correct: true, feedback: 'essentially correct, within rounding' });
    const cases: Array<[string, string]> = [
      ['5', '4.976'], ['5', '5.024'], ['5', '4.9'], ['8', '7.998'], ['8', '8.002'], ['10.81', '10.80'], ['63.62', '63.6'],
    ];
    for (const [key, ans] of cases) {
      const item: GradeItem = { itemId: 'i', expectedAnswer: key, problemText: 'Q' };
      const r = await gradeFreeResponse(req(ans), item, m.deps);
      assert.equal(r.totalPoints, 0, `key ${key}, answer ${ans}`);
      assert.equal(r.maxPoints, 1);
      assert.equal(r.parts[0].criterionId, 'overall');
      assert.ok(r.parts[0].feedback.length > 0);
      assert.equal(r.modelResponse, key);
    }
    assert.equal(m.calls.length, 0, 'no model call for a numeric key');
  });

  await test('a numeric key never reaches the judge — correct answers', async () => {
    const m = fakeModel({ correct: false, feedback: 'nope' });
    const cases: Array<[string, string]> = [
      ['5', '5'], ['5', '5.0'], ['5', 'x = 5'], ['10.81', '10.811'], ['2.50', '2.5'], ['13/3', '4.33'], ['13/3', '4.333'], ['$4.50', '4.50'],
    ];
    for (const [key, ans] of cases) {
      const r = await gradeFreeResponse(req(ans), { itemId: 'i', expectedAnswer: key }, m.deps);
      assert.equal(r.totalPoints, 1, `key ${key}, answer ${ans}`);
      assert.equal(r.parts[0].feedback, 'Correct.');
    }
    assert.equal(m.calls.length, 0);
  });

  await test('a numeric key with an answer that is not a single number falls through to the judge', async () => {
    const m = fakeModel({ correct: true, feedback: 'ok' });
    const r = await gradeFreeResponse(req('5 metres per second'), { itemId: 'i', expectedAnswer: '5', problemText: 'Find the speed.' }, m.deps);
    assert.equal(r.totalPoints, 1);
    assert.equal(m.calls.length, 1);
    assert.match(m.calls[0].user, /Find the speed\./);
  });

  await test('an image response on a numeric key goes to the judge', async () => {
    const m = fakeModel({ correct: false, feedback: 'cannot read' });
    await gradeFreeResponse({ studentId: 's', itemId: 'i', response: { imageRef: 'img-1' } }, { itemId: 'i', expectedAnswer: '5' }, m.deps);
    assert.equal(m.calls.length, 1);
  });

  await test('a non-numeric key reaches the judge, whose prompt carries the question and the new rules', async () => {
    const QUESTION = 'Rewrite in standard form Ax + By + Cz = D, where A, B, C, D are integers and A is positive: 5y = 6x − 3z + 12';
    const m = fakeModel({ correct: false, feedback: 'A must be positive.' });
    const item: GradeItem = { itemId: 'i', expectedAnswer: '6x − 5y − 3z = −12', problemText: QUESTION };
    const r = await gradeFreeResponse(req('−6x + 5y + 3z = 12'), item, m.deps);
    assert.equal(r.totalPoints, 0);
    assert.equal(r.parts[0].feedback, 'A must be positive.');
    assert.equal(r.modelResponse, '6x − 5y − 3z = −12');
    assert.equal(m.calls.length, 1);
    const { system, user } = m.calls[0];
    assert.ok(user.includes(QUESTION), 'question text in the prompt');
    assert.ok(user.includes('Expected answer: 6x − 5y − 3z = −12'));
    assert.ok(user.includes('Student response: −6x + 5y + 3z = 12'));
    assert.match(system, /equal to the expected answer, not merely close to it/);
    assert.match(system, /within rounding/);
    assert.match(system, /violates the stated requirement is incorrect/);
    assert.match(system, /which requirement is not met/);
    assert.match(system, /either bracket style/);
    assert.match(system, /"correct": boolean/);
  });

  await test('the judge prompt is generic: no question → no Question block; rules carry no topic examples', () => {
    const p = buildSingleAnswerJudgePrompt({ expectedAnswer: 'x < 5', response: { text: '5 > x' } });
    assert.ok(!/Question:/.test(p.user));
    assert.match(p.user, /^Expected answer: x < 5/);
    const q = buildSingleAnswerJudgePrompt({ expectedAnswer: 'x < 5', response: { text: '5 > x' }, question: 'Solve 2x + 3 < 13.' });
    assert.match(q.user, /^Question: Solve 2x \+ 3 < 13\./);
    assert.equal(p.system, q.system);
    assert.ok(!/\d/.test(p.system.replace(/"correct".*$/, '')), 'no worked numbers in the instructions');
  });

  await test('rubric items are untouched by the numeric rule', async () => {
    const m = fakeModel({ pointsAwarded: 2, feedback: 'good' });
    const item: GradeItem = {
      itemId: 'i', expectedAnswer: '5',
      rubric: { parts: [{ criterionId: 'a', maxPoints: 2, scoringCriteria: 'c', modelResponse: 'm' }] },
    };
    const r = await gradeFreeResponse(req('4.976'), item, m.deps);
    assert.equal(r.totalPoints, 2);
    assert.equal(m.calls.length, 1);
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

function pick(k: ReturnType<typeof parseNumericKey>) {
  return k ? { form: k.form, places: k.places, value: k.value } : null;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
