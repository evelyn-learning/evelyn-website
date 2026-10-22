/**
 * Tests for the `homework-problem` brain mode (GAC per-problem homework,
 * Task 7): the deterministic keyed verdict, the <homework_problem> block, the
 * keyed pre-check result, the done tracking, the outcome classification and
 * the wiring of the stream route / outcome route (source checks).
 *
 * Pure: no Mongo, no model call.
 * Run: npx tsx scripts/test-homework-problem-brain.ts  (npm run test:homework-problem-brain)
 */

// Env first: the brain's model client is built from env (the stream method is
// replaced below; nothing reaches the network or a database).
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/test-no-db';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';

import { strict as assert } from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { AnswerKey } from '../src/lib/tutor/homework-build/types';

let passed = 0;
let failed = 0;
async function section(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

/** Run with console.warn silenced (expected warnings stay out of the output). */
async function quietly<T>(fn: () => Promise<T>): Promise<T> {
  const warn = console.warn;
  console.warn = () => {};
  try { return await fn(); } finally { console.warn = warn; }
}

const SRC = path.join(__dirname, '..', 'src');
const read = (rel: string) => fs.readFileSync(path.join(SRC, rel), 'utf8');
/** Source check with a short failure message (never the whole file). */
const has = (src: string, re: RegExp) => assert.ok(re.test(src), `source does not match ${re}`);

const numKey = (parts: Array<[string, string, number, string?]>): AnswerKey => ({
  parts: parts.map(([label, final, value, units]) => ({ label, final, canonical: { kind: 'number' as const, value, ...(units ? { units } : {}) } })),
  solvers: ['s1', 's2'],
});

async function main() {
  const kv = await import('../src/lib/tutor/voice/keyed-verdict');
  const { keyedVerdict, KEYED_VERDICT_MODEL_TIMEOUT_MS } = kv;

  console.log('a keyedVerdict');
  const X20 = numKey([['', 'x = 20', 20]]);
  const PERIM = numKey([['', '35.42 cm', 35.42, 'cm']]);
  const AB = numKey([['a', 'a = 8', 8], ['b', 'b = 24', 24]]);
  const TEXT: AnswerKey = { parts: [{ label: '', final: 'similar by AA', canonical: { kind: 'text', value: 'similar by AA' } }], solvers: [] };

  await section('timeout constant is 4000', () => assert.equal(KEYED_VERDICT_MODEL_TIMEOUT_MS, 4000));
  const table: Array<[string, AnswerKey, string, string, string?]> = [
    ['x=20', X20, 'they are equal so x = 20', 'correct'],
    ['x=20', X20, 'x = 60/3 = 20', 'correct'],
    ['x=20', X20, 'x is 25', 'incorrect'],
    ['x=20', X20, 'twenty', 'undecided'],
    ['x=20', X20, 'I think it\'s about half', 'undecided'],
    ['x=20', X20, 'x = 1/2', 'undecided'],
    ['x=20', X20, '20', 'correct'],
    ['x=20', X20, 'x = 20 because 60 divided by 3', 'correct'],
    ['x=20', X20, 'is it 25?', 'undecided'],
    ['x=20', X20, 'since AD = 6 and DB = x, x = 20', 'correct'],
    ['x=20', X20, 'I multiplied 6 by 3', 'undecided'],
    // Intermediate working is never judged wrong (review finding, 2026-10-21).
    ['x=20', X20, 'I found that AB is 12', 'undecided'],
    ['x=20', X20, 'the angle is 60 degrees so now I need x', 'undecided'],
    ['x=20', X20, 'I got 3 so far', 'undecided'],
    ['x=20', X20, 'there are 2 triangles', 'undecided'],
    ['x=20', X20, 'step 1: 180 - 120 = 60', 'undecided'],
    ['x=20', X20, 'x = 25', 'incorrect'],
    ['x=20', X20, 'the answer is 25', 'incorrect'],
    ['x=20', X20, '[correction note — not from the student] intended answer "x = 20"', 'undecided'],
    ['35.42cm', PERIM, 'so perimeter is 26+3pi=35.4 cm', 'correct'],
    // 2026-10-22 (hw-14 p5): a bare number answers the tutor's question, not the key — undecided, the model check judges it.
    ['35.42cm', PERIM, '31.42', 'undecided'],
    ['35.42cm', PERIM, '26+3π', 'undecided'],
    ['35.42cm', PERIM, 'it is 35.42cm', 'correct'],
    ['a=8,b=24', AB, 'a) 8', 'correct', 'a'],
    ['a=8,b=24', AB, '(b) 24', 'correct', 'b'],
    ['a=8,b=24', AB, 'part b: 25', 'incorrect', 'b'],
    ['a=8,b=24', AB, 'a = 8, b = 24', 'correct'],
    ['a=8,b=24', AB, 'a) 8 b) 25', 'undecided'],
    ['a=8,b=24', AB, '7', 'undecided'],
    ['text', TEXT, 'they are similar by AA', 'undecided'],
    ['c≈6.9', numKey([['', 'c ≈ 6.93', 6.93]]), 'c ≈ 6.9', 'correct'],
    ['20°', numKey([['', '20°', 20]]), 'the angle is 20°', 'correct'],
  ];
  // I3 (2026-10-21): exact text and fractions CONFIRM; nothing new is ever marked wrong.
  const FRAC = numKey([['', '3/4', 0.75]]);
  const XFRAC = numKey([['', 'x = 3/4', 0.75]]);
  const LINE: AnswerKey = { parts: [{ label: '', final: 'y = 2x + 3', canonical: { kind: 'text', value: 'y = 2x + 3' } }], solvers: [] };
  const ROOT = numKey([['', '2√3', 3.4641]]);
  const ROOTS: AnswerKey = { parts: [{ label: '', final: 'x = 2 or x = -3', canonical: { kind: 'text', value: 'x = 2 or x = -3' } }], solvers: [] };
  const ROOTSN = numKey([['', 'x = 2 or x = −3', 2]]);
  const MIX = numKey([['', '1 1/2 cups', 1.5]]);
  const TWO: AnswerKey = { parts: [{ label: 'a', final: 'a = 8', canonical: { kind: 'number', value: 8 } }, { label: 'b', final: 'y = 2x + 3', canonical: { kind: 'text', value: 'y = 2x + 3' } }], solvers: [] };
  table.push(
    ['3/4', FRAC, 'x = 3/4', 'correct'],
    ['3/4', FRAC, '3/4', 'correct'],
    ['3/4', FRAC, '0.75', 'correct'],
    ['3/4', FRAC, 'x = 6/8', 'correct'],
    ['3/4', FRAC, 'x = 2/3', 'undecided'],
    ['3/4', FRAC, 'x = 3/4 + 1', 'undecided'],
    ['x=3/4', XFRAC, 'x = 3 / 4', 'correct'],
    ['x=3/4', XFRAC, 'y = 3/4', 'undecided'],
    ['x=20', X20, 'x = 60/3', 'correct'],
    ['x=20', X20, 'x = 60/3, no wait x = 25', 'undecided'], // an earlier value matched: ambiguous, as for whole numbers
    ['1 1/2', MIX, 'it is 1 1/2', 'correct'],
    ['1 1/2', MIX, '1 1/2 cups', 'correct'],
    ['y=2x+3', LINE, 'y = 2x + 3', 'correct'],
    ['y=2x+3', LINE, 'Y=2X+3.', 'correct'],
    ['y=2x+3', LINE, 'y = 2×x + 3', 'undecided'],
    ['y=2x+3', LINE, 'y = 3x + 2', 'undecided'],
    ['2√3', ROOT, '2√3', 'correct'],
    ['2√3', ROOT, '3.46', 'correct'],
    ['2√3', ROOT, '3√2', 'undecided'],
    ['x=2 or -3', ROOTS, 'x = 2 or x = -3', 'correct'],
    ['x=2 or -3', ROOTS, 'x = 2 or x = −3', 'correct'],
    ['x=2 or -3', ROOTS, 'x = 2', 'undecided'],
    ['x=2 or -3 (num)', ROOTSN, 'x = 2 or x = -3', 'correct'],
    ['text', TEXT, 'Similar by AA.', 'correct'],
    ['a=8,b=line', TWO, 'b) y = 2x + 3', 'correct', 'b'],
    ['a=8,b=line', TWO, 'a) 8 b) y = 2x+3', 'correct'],
    ['a=8,b=line', TWO, 'b) y = 2x + 4', 'undecided'],
    // R19a: a question is judged neither way.
    ['x=20', X20, 'is it 20?', 'undecided'],
    ['x=20', X20, 'x = 20?', 'undecided'],
    ['x=20', X20, 'is x = 20', 'undecided'],
    ['x=20', X20, 'would it be 20', 'undecided'],
    ['x=20', X20, 'does x = 25', 'undecided'],
    // R19b: a note in front of the student's words is dropped, the rest judged.
    ['x=20', X20, '[correction note — not from the student] The intended answer is "x = 20".\n\nx = 25', 'incorrect'],
    ['x=20', X20, '[correction note — not from the student] The intended answer is "x = 25".\n\nx = 20', 'correct'],
    ['x=20', X20, '[cadence note — not from the student] Shorter.\nx = 20', 'correct'],
  );
  // 2026-10-22 (hw-14 p5, F7): the tutor asked for the inner square's diagonal and
  // "12 cm" was denied against the key's 41.10 cm². A bare or unnamed value answers
  // the tutor's last question: it confirms (equal to the key) but never denies.
  const AREA: AnswerKey = { parts: [{ label: '', final: '41.10 cm²', canonical: { kind: 'number', value: 41.1, units: 'cm²' } }], solvers: [] };
  const X27: AnswerKey = numKey([['a', 'x = 27', 27], ['b', 'y = 54', 54], ['c', '81°', 81]]);
  table.push(
    ['41.10cm²', AREA, '12 cm', 'undecided'],
    ['41.10cm²', AREA, '12', 'undecided'],
    ['41.10cm²', AREA, '41.1', 'correct'],
    ['41.10cm²', AREA, '41.1 cm²', 'correct'],
    ['41.10cm²', AREA, 'the answer is 12', 'incorrect'],
    ['41.10cm²', AREA, "it's 12 cm²", 'incorrect'],
    ['41.10cm²', AREA, 'area = 12', 'undecided'],
    ['41.10cm²', AREA, 'I got 12 cm² as the answer', 'incorrect'],   // "area" is not the key's variable
    ['a) x=27 of 3', X27, 'x = 20', 'incorrect'],
    ['a) x=27 of 3', X27, '20', 'undecided'],
    ['a) x=27 of 3', X27, 'a) 20', 'incorrect', 'a'],
  );
  for (const [kname, key, msg, want, part] of table) {
    await section(`[${kname}] ${JSON.stringify(msg)} → ${want}${part ? ` part ${part}` : ''}`, () => {
      const got = keyedVerdict(msg, key);
      assert.equal(got.verdict, want, JSON.stringify(got));
      if (part) assert.equal(got.part, part);
    });
  }
  // 2026-10-21 (hw-11 problem 2): "(b) x = 7, PA = 17" was never confirmed — the
  // student gave x = 7 and then 17 in two messages, and a text part needed the
  // whole final verbatim. Named values confirm one by one, across messages.
  await section('multi-value part "x = 7, PA = 17": each named value judged on its own, the part confirmed once all are', async () => {
    const { normalizeKeyParts } = await import('../src/lib/tutor/homework-build/key-solve');
    const parts = normalizeKeyParts({ parts: [
      { label: 'a', final: '132°', canonical: { kind: 'number', number: 132 } },
      { label: 'b', final: 'x = 7, PA = 17', canonical: { kind: 'text', text: 'x = 7, PA = 17' } },
    ] })!;
    assert.deepEqual(parts[1].values, [{ name: 'x', value: 7 }, { name: 'pa', value: 17 }]);
    assert.equal(parts[0].values, undefined);
    const key: AnswerKey = { parts, solvers: ['s1', 's2'] };
    const pick = (vs: ReturnType<typeof kv.keyedVerdicts>) => vs.map((v) => [v.verdict, v.part, v.value]);
    assert.deepEqual(pick(kv.keyedVerdicts('equal so 3x-4=x+10 so x=7', key)), [['correct', 'b', 'x']]);
    assert.deepEqual(pick(kv.keyedVerdicts('17', key)), [['correct', 'b', 'pa']]);
    assert.deepEqual(pick(kv.keyedVerdicts('PA = 20', key)), [['incorrect', 'b', 'pa']]);
    assert.deepEqual(pick(kv.keyedVerdicts('360 - (90+90+48)=132', key)), [['correct', 'a', undefined]]);
    assert.equal(kv.keyedVerdict('x = 7 and PA = 17', key).verdict, 'correct');
    assert.equal(kv.keyedVerdict('x = 7 and PA = 17', key).part, 'b');
    const h = (...msgs: string[]) => msgs.map((content) => ({ role: 'user' as const, content }));
    assert.equal(kv.allKeyPartsConfirmed(h('360 - (90+90+48)=132', 'equal so 3x-4=x+10 so x=7'), '17', key), true);
    assert.equal(kv.allKeyPartsConfirmed(h('360 - (90+90+48)=132'), 'x = 7', key), false, 'PA still open');
    assert.equal(kv.allKeyPartsConfirmed(h('equal so 3x-4=x+10 so x=7'), '17', key), false, '(a) still open');
    const angles = normalizeKeyParts({ parts: [{ label: 'b', final: 'm∠1 = 116°, m∠2 = 64°', canonical: { kind: 'text', text: '' } }] })!;
    assert.deepEqual(angles[0].values, [{ name: 'm∠1', value: 116 }, { name: 'm∠2', value: 64 }]);
    const akey: AnswerKey = { parts: angles, solvers: [] };
    assert.deepEqual(pick(kv.keyedVerdicts('angle 1 is 116', akey)), [['correct', 'b', 'm∠1']]);
    assert.equal(kv.allKeyPartsConfirmed(h('angle 1 is 116'), 'and angle 2 = 64', akey), true);
    assert.deepEqual(kv.parseKeyedVerdictDebug(kv.formatKeyedVerdictDebug('b', 'correct', 'PA')), { part: 'b', verdict: 'correct', value: 'pa' });
    assert.deepEqual(kv.parseKeyedVerdictDebug(kv.formatKeyedVerdictDebug('b', 'correct')), { part: 'b', verdict: 'correct' });
  });
  await section('correct carries the matched value', () => {
    const got = keyedVerdict('so perimeter is 26+3pi=35.4 cm', PERIM);
    assert.ok(got.matched && got.matched.includes('35.4'), JSON.stringify(got));
  });

  console.log('a2 keyed pre-check result (same shape the brain consumes)');
  const shared = await import('../src/lib/tutor/voice/verdict-precheck-shared');
  await section('correct → overall_problem, high, informs, CORRECT block', () => {
    const r = kv.keyedPrecheckResult(keyedVerdict('x = 20', X20), X20);
    assert.ok(r);
    assert.equal(r.verdict, 'correct');
    assert.equal(r.confidence, 'high');
    assert.equal(r.answers, 'overall_problem');
    assert.equal(r.proposed, '20');
    assert.equal(r.correctValue, 'x = 20');
    assert.equal(r.ms, 0);
    const pub = shared.toPublicPrecheck(r);
    assert.ok(shared.precheckDecides(pub));
    assert.match(shared.formatAnswerCheckBlock(pub, { correctValue: r.correctValue }), /CORRECT/);
  });
  await section('incorrect on a part names the part; undecided → null', () => {
    const r = kv.keyedPrecheckResult(keyedVerdict('part b: 25', AB), AB);
    assert.ok(r);
    assert.equal(r.verdict, 'incorrect');
    assert.match(r.target, /\(b\)/);
    assert.equal(r.correctValue, 'b = 24');
    assert.equal(kv.keyedPrecheckResult(keyedVerdict('twenty', X20), X20), null);
  });
  await section('keyed facts list every final', () => {
    assert.match(kv.keyedProblemFacts(AB), /a\) a = 8; b\) b = 24/);
  });

  console.log('a3 done tracking (stateless, over the history)');
  await section('every part confirmed across messages → done', () => {
    const history = [
      { role: 'user' as const, content: 'a) 8' },
      { role: 'assistant' as const, content: 'Yes — and b?' },
    ];
    assert.deepEqual([...kv.confirmedKeyParts(history, 'b) 23', AB)].sort(), ['a']);
    assert.equal(kv.allKeyPartsConfirmed(history, 'b) 23', AB), false);
    assert.equal(kv.allKeyPartsConfirmed(history, 'b) 24', AB), true);
    assert.equal(kv.allKeyPartsConfirmed([], 'x = 60/3 = 20', X20), true);
    assert.equal(kv.allKeyPartsConfirmed([{ role: 'assistant', content: 'x = 20' }], 'ok', X20), false, 'tutor turns never count');
  });
  await section('runtime notes never count as student answers', () => {
    const note = '[correction note — not from the student] The intended answer is "x = 20". Re-state it.';
    assert.equal(kv.isRuntimeNote(note), true);
    assert.equal(kv.allKeyPartsConfirmed([{ role: 'user', content: note }], 'ok', X20), false, 'a note in the history');
    assert.equal(kv.allKeyPartsConfirmed([], note, X20), false, 'a note as the current message');
    assert.deepEqual(kv.keyedVerdicts(note, X20), []);
  });
  await section('R19b stripRuntimeNote: prefix stripped; a note alone → empty; plain text unchanged', () => {
    assert.equal(kv.stripRuntimeNote('[correction note — not from the student] Re-check.\n\nx = 20'), 'x = 20');
    assert.equal(kv.stripRuntimeNote('[a note] one\n\n[b note] two\n\n  x = 5 '), 'x = 5');
    assert.equal(kv.stripRuntimeNote('[correction note — not from the student] The intended answer is "x = 20".'), '');
    assert.equal(kv.stripRuntimeNote('x = 20 [sic]'), 'x = 20 [sic]');
    const note = '[correction note — not from the student] The intended answer is "x = 20".';
    assert.equal(kv.allKeyPartsConfirmed([{ role: 'user', content: `${note}\n\nx = 20` }], 'ok', X20), true, 'student words after a note count');
    assert.equal(kv.allKeyPartsConfirmed([{ role: 'user', content: note }], 'ok', X20), false, 'a note alone never counts');
  });
  await section('debug message round-trips', () => {
    const m = kv.formatKeyedVerdictDebug('a', 'incorrect');
    assert.match(m, /^keyed part=a verdict=incorrect/);
    assert.deepEqual(kv.parseKeyedVerdictDebug(m), { part: 'a', verdict: 'incorrect' });
    assert.deepEqual(kv.parseKeyedVerdictDebug(kv.formatKeyedVerdictDebug('', 'correct')), { part: '', verdict: 'correct' });
    assert.equal(kv.parseKeyedVerdictDebug('answers=x verdict=correct'), null);
  });

  console.log('b <homework_problem> block');
  const blk = await import('../src/lib/tutor/voice/homework-problem-block');
  await section('unverified: never judges', () => {
    const b = blk.formatHomeworkProblemBlock({ text: 'P', verified: false, hasFigure: true });
    assert.match(b, /<homework_problem>/);
    assert.match(b, /<\/homework_problem>/);
    assert.ok(b.includes('never say an answer is right or wrong'), b);
    assert.ok(!b.includes('expected answer'), 'no expected-answer line when unverified');
    assert.ok(b.includes('already on the student\'s screen'));
  });
  await section('verified: checks against the expected answer', () => {
    const b = blk.formatHomeworkProblemBlock({ text: 'P', verified: true, hasFigure: true, key: X20 });
    assert.ok(b.includes('expected answer'), b);
    assert.ok(!b.includes('never say an answer is right or wrong'));
    assert.ok(!b.includes('x = 20'), 'the block never carries the key itself');
  });
  await section('no figure: refer to the sheet; prior note rendered', () => {
    const b = blk.formatHomeworkProblemBlock({ text: 'P', verified: false, hasFigure: false, priorNote: 'Set up the ratio.' });
    assert.ok(b.includes('refer to the sheet'), b);
    assert.ok(b.includes('Set up the ratio.'));
    assert.ok(b.includes(blk.HOMEWORK_PROBLEM_RULES));
    assert.ok(b.includes('Back to your list'));
  });
  await section('C2 conduct + safeguarding rules: the ledger constants verbatim, both modes', async () => {
    const led = await import('../src/lib/tutor/lesson-plan/homework-ledger');
    for (const verified of [true, false]) {
      const b = blk.formatHomeworkProblemBlock({ text: 'P', verified, hasFigure: true, ...(verified ? { key: X20 } : {}) });
      for (const [name, c] of [['PERSONAL_DETAILS_RULE', led.PERSONAL_DETAILS_RULE], ['OFF_TOPIC_NOT_ANSWERED', led.OFF_TOPIC_NOT_ANSWERED], ['EXTRA_PROBLEM_SAME_RULES', led.EXTRA_PROBLEM_SAME_RULES], ['LEDGER_CONDUCT_RULES', led.LEDGER_CONDUCT_RULES]] as const) {
        assert.ok(b.includes(c), `${name} missing (verified=${verified})`);
        assert.ok(led.HOMEWORK_LEDGER_RULES.includes(c), `${name} no longer in the ledger rules`);
      }
      assert.ok(b.indexOf(led.LEDGER_CONDUCT_RULES) < b.indexOf('</homework_problem>'), 'inside the block');
    }
    has(read('lib/tutor/voice/homework-problem-block.ts'), /import \{[^}]*LEDGER_CONDUCT_RULES[^}]*\} from '\.\.\/lesson-plan\/homework-ledger'/);
  });
  await section('no figure: the rule allows the sheet\'s figure with given values, never a value to find', () => {
    assert.ok(blk.HOMEWORK_PROBLEM_NO_FIGURE.includes('never a value the problem asks the student to find'));
  });
  await section('board guard: a key value on a board item is a hit; a given number or the student\'s own value is not', () => {
    const hp = { text: 'A right circular cone has radius 5 cm and slant height 13 cm. (a) Find the height h. (b) Find the volume. Use π ≈ 3.14.', verified: true, hasFigure: false,
      key: { solvers: ['a', 'b'], parts: [
        { label: '(a)', final: '12 cm', canonical: { kind: 'number' as const, value: 12, units: 'cm' } },
        { label: '(b)', final: '314 cm³', canonical: { kind: 'number' as const, value: 314, units: 'cm³' } },
      ] } };
    const w = blk.homeworkKeyWithheld(hp, '');
    assert.equal(w.length, 2);
    assert.ok(blk.boardRevealsHomeworkKey({ shape: 'cone', title: 'Cone: radius 5 cm, slant height 13 cm', labels: ['h=12', 'r=5'] }, w), 'h=12 is the answer to (a)');
    assert.equal(blk.boardRevealsHomeworkKey({ shape: 'cone', title: 'Cone: radius 5 cm, slant height 13 cm', labels: ['h', 'r=5', 'l=13'] }, w), null, 'given values only');
    assert.equal(blk.boardRevealsHomeworkKey({ labels: ['h=12'] }, blk.homeworkKeyWithheld(hp, 'I think h is 12')), null, 'the student wrote it');
    assert.ok(blk.boardRevealsHomeworkKey({ equation: 'V = 314' }, blk.homeworkKeyWithheld(hp, 'I think h is 12')), '(b) is still withheld');
    assert.deepEqual(blk.homeworkKeyWithheld({ ...hp, verified: false }, ''), [], 'an unverified problem has no key to guard');
    assert.deepEqual(blk.homeworkKeyWithheld(undefined, ''), []);
  });
  await section('verified rule: the expected answer is the authority for relations the tutor asserts', () => {
    assert.ok(blk.HOMEWORK_PROBLEM_VERIFIED.includes('consistent with the expected values'));
  });
  await section('claude-brain withholds every board call of the opening turn when the figure is on the board', () => {
    const src = read('lib/tutor/voice/claude-brain.ts');
    has(src, /const hpOpenerWithFigure = !!input\.homeworkProblem\?\.hasFigure && \/\^\\\[start \(\?:lesson\|session\)\\\]\$\/\.test\(studentSaid\);/);
    has(src, /hpOpenerWithFigure && tc\.name\.startsWith\('show_'\)/);
    has(src, /rejectionReason: HOMEWORK_OPENER_BOARD_WITHHELD_REASON/);
    assert.ok(blk.HOMEWORK_OPENER_BOARD_WITHHELD_REASON.includes('already on the board'));
  });
  await section('claude-brain wires the board guard into the tool-call path', () => {
    const src = read('lib/tutor/voice/claude-brain.ts');
    has(src, /const hpWithheld = hpKey/);
    has(src, /boardRevealsHomeworkKey\(args, hpWithheld\)/);
    has(src, /rejectionReason: HOMEWORK_BOARD_KEY_WITHHELD_REASON/);
  });
  await section('claude-brain re-exports the block API', () => {
    const src = read('lib/tutor/voice/claude-brain.ts');
    for (const re of [/formatHomeworkProblemBlock/, /HOMEWORK_PROBLEM_RULES/, /homeworkProblem\?: HomeworkProblemTurnInput/]) has(src, re);
  });

  console.log('c wiring (source checks)');
  const route = read('app/api/tutor/brain/stream/route.ts');
  const brain = read('lib/tutor/voice/claude-brain.ts');
  const turn = read('lib/tutor/voice/homework-problem-turn.ts');
  await section('stream route resolves the plan and the key', () => {
    has(route + turn, /homeworkProblemOf\(/);
    has(route + turn, /getHomeworkBuild\(/);
    has(route, /resolveHomeworkProblemTurn\(/);
  });
  await section('outcome route reads finished=1 and the key', () => {
    const o = read('app/api/portal/v1/homework-problem-outcome/route.ts');
    has(o, /params\.get\('finished'\) === '1'/);
    has(o, /getHomeworkBuild\(meta\.parentPlanId\)/);
    has(o, /finished,\s*key,/);
  });
  await section('set_current_problem attached only under a homeworkProblem condition', () => {
    const lines = route.split('\n');
    const i = lines.findIndex((l) => /tools: \[\.\.\.toolFilter\.tools, SET_CURRENT_PROBLEM_TOOL\]/.test(l));
    assert.ok(i >= 0, 'attach line not found');
    has(lines.slice(Math.max(0, i - 10), i + 1).join('\n'), /homeworkProblem/);
  });
  await section('route relays the new frames and sets the 8 s deadline', () => {
    has(route, /ev\.type === 'homework-problem-done'/);
    has(route, /ev\.type === 'homework-keyed-verdict'/);
    has(route + turn, /HOMEWORK_PROBLEM_THINKING_DEADLINE_MS/);
    has(turn, /HOMEWORK_PROBLEM_THINKING_DEADLINE_MS = 8000/);
  });
  await section('brain runs the keyed verdict with the 4 s model cap', () => {
    has(brain, /keyedVerdict\(/);
    has(brain, /KEYED_VERDICT_MODEL_TIMEOUT_MS/);
    has(brain, /homework-problem-done/);
  });
  await section('text-thinking takes a per-call textThinkingDeadlineMs', async () => {
    has(read('lib/tutor/voice/text-thinking.ts'), /textThinkingDeadlineMs/);
    const tt = await import('../src/lib/tutor/voice/text-thinking');
    assert.equal(tt.textThinkingDeadline(undefined), tt.TEXT_THINKING_DEADLINE_MS);
    assert.equal(tt.textThinkingDeadline(8000), 8000);
  });
  await section('resolveHomeworkProblemTurn: verified plan gets the key + expected answer', async () => {
    const t = await import('../src/lib/tutor/voice/homework-problem-turn');
    const plan = { metadata: { kind: 'homework-problem', parentPlanId: 'par', n: 3, text: 'Find x.', figure: { action: 'showGraph' }, verified: true } };
    const r = await t.resolveHomeworkProblemTurn('p1', {
      getPlan: async () => plan as never,
      getBuild: async () => ({ problems: [{ n: 2, key: numKey([['', 'x = 1', 1]]) }, { n: 3, key: AB }] }) as never,
      noCache: true,
    });
    assert.ok(r);
    assert.equal(r.homeworkProblem.verified, true);
    assert.equal(r.homeworkProblem.hasFigure, true);
    assert.deepEqual(r.homeworkProblem.key, AB);
    assert.deepEqual(r.activeProblem, { statement: 'Find x.', source: 'homework', expectedAnswer: 'a) a = 8; b) b = 24' });
  });
  await section('resolveHomeworkProblemTurn: unverified → no key, no expected answer; other plans → null', async () => {
    const t = await import('../src/lib/tutor/voice/homework-problem-turn');
    let builds = 0;
    const plan = { metadata: { kind: 'homework-problem', parentPlanId: 'par', n: 1, text: 'Find y.', figure: null, verified: false } };
    const r = await t.resolveHomeworkProblemTurn('p2', { getPlan: async () => plan as never, getBuild: async () => { builds++; return null; }, noCache: true });
    assert.ok(r);
    assert.equal(r.homeworkProblem.verified, false);
    assert.equal(r.homeworkProblem.key, undefined);
    assert.equal(r.activeProblem, undefined, 'an unverified problem carries no <active_problem>');
    assert.equal(builds, 0, 'the build is never read for an unverified plan');
    const none = await t.resolveHomeworkProblemTurn('p3', { getPlan: async () => ({ metadata: { kind: 'homework-help' } }) as never, getBuild: async () => null, noCache: true });
    assert.equal(none, null);
  });
  await section('resolveHomeworkProblemTurn: verified plan whose key is missing runs as unverified', async () => {
    const t = await import('../src/lib/tutor/voice/homework-problem-turn');
    const plan = { metadata: { kind: 'homework-problem', parentPlanId: 'par', n: 4, text: 'Q', figure: null, verified: true } };
    const r = await quietly(() => t.resolveHomeworkProblemTurn('p4', { getPlan: async () => plan as never, getBuild: async () => ({ problems: [] }) as never, noCache: true }));
    assert.ok(r);
    assert.equal(r.homeworkProblem.verified, false);
  });

  const readSrc = (rel: string) => fs.readFileSync(path.join(__dirname, '..', 'src', rel), 'utf8');
  console.log('d outcome');
  const oc = await import('../src/lib/tutor/homework-build/outcome');
  const ev = (type: string, message: string) => ({ type, message });
  const stu = (text: string) => ({ role: 'student', text });
  await section('hw-13: every key part confirmed by the transcript is done, finished or not (a pause after solving it)', () => {
    // GAC acceptance 2026-10-22: problem 2 was solved in full, "Back to list"
    // left it "In progress" and the next open started over. The confirmed-key
    // rule applied only with finished=1; it applies always now.
    const key = { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], solvers: ['A', 'B'] };
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [], transcript: [stu('I think x = 5')], verified: true, key }), 'done');
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [], transcript: [stu('I think x = 4')], verified: true, key }), 'in_progress');
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [], transcript: [stu('I think x = 4')], verified: true, key, finished: true }), 'needs_review');
    const route = readSrc('app/api/portal/v1/homework-problem-outcome/route.ts');
    assert.match(route, /const build = meta\?\.verified \? await getHomeworkBuild\(meta\.parentPlanId\)/, 'the key is loaded for every outcome call, not only a finish');
  });
  await section('done when homework_problem_done is recorded', () => {
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [ev('homework_problem_done', 'done')], transcript: [], verified: true }), 'done');
  });
  await section('needs_review: unverified and the student says they finished', () => {
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [], transcript: [stu('x = 5'), { role: 'tutor', text: 'ok' }, stu('I finished the whole worksheet')], verified: false }), 'needs_review');
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [], transcript: [stu('I finished the whole worksheet')], verified: true }), 'in_progress');
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [], transcript: [stu('ok I\'m done with this one')], verified: false }), 'needs_review');
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [], transcript: [stu('x = 5')], verified: false }), 'in_progress');
  });
  await section('finished (the host\'s button): done when the transcript confirms every key part, else needs_review', async () => {
    const { normalizeKeyParts } = await import('../src/lib/tutor/homework-build/key-solve');
    const key: AnswerKey = { parts: normalizeKeyParts({ parts: [
      { label: 'a', final: '132°', canonical: { kind: 'number', number: 132 } },
      { label: 'b', final: 'x = 7, PA = 17', canonical: { kind: 'text', text: '' } },
    ] })!, solvers: ['s1', 's2'] };
    const tx = [stu('360'), { role: 'tutor', text: 'ok' }, stu('360 - (90+90+48)=132'), stu('equal so 3x-4=x+10 so x=7'), stu('17')];
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [], transcript: tx, verified: true, finished: true, key }), 'done');
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [], transcript: tx.slice(0, 3), verified: true, finished: true, key }), 'needs_review');
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [], transcript: tx, verified: false, finished: true, key: null }), 'needs_review');
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [], transcript: tx.slice(0, 3), verified: true, key }), 'in_progress', 'not finished: as before');
  });
  await section('claimsProblemFinished: this problem (or the set), not a question or a negation', () => {
    for (const t of ['done', 'Finished!', "that's it", "I'm done with this one", 'got it, thanks', 'I finished it', 'I finished the whole worksheet']) {
      assert.equal(oc.claimsProblemFinished(t), true, t);
    }
    for (const t of ['am I done?', "I'm not done yet", 'x = 5', 'I got 3 so far', 'not finished']) {
      assert.equal(oc.claimsProblemFinished(t), false, t);
    }
  });
  await section('needs_review: two wrong keyed verdicts on one part with no later correct', () => {
    const k = (p: string, v: 'correct' | 'incorrect', t?: number) => ({ ...ev(oc.KEYED_VERDICT_DEBUG_TYPE, kv.formatKeyedVerdictDebug(p, v)), ...(t !== undefined ? { timestamp: new Date(t) } : {}) });
    const st = (text: string, t: number) => ({ role: 'student', text, timestamp: new Date(t) });
    const two = [st('a) 7', 1000), st('a) 9', 3000)];
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [k('a', 'incorrect', 1500), k('a', 'incorrect', 3500)], transcript: two, verified: true }), 'needs_review');
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [k('a', 'incorrect', 1500), k('a', 'incorrect', 3500), k('a', 'correct', 3600)], transcript: two, verified: true }), 'in_progress');
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [k('a', 'incorrect', 1500), k('b', 'incorrect', 3500)], transcript: two, verified: true }), 'in_progress');
    // Untimed: consecutive identical events count once; a different event between breaks the run.
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [k('a', 'incorrect'), k('b', 'correct'), k('a', 'incorrect')], transcript: [], verified: true }), 'needs_review');
  });
  await section('R19c: a stall re-dispatch of ONE message never makes needs_review by itself', () => {
    const k = (p: string, v: 'correct' | 'incorrect', t?: number) => ({ ...ev(oc.KEYED_VERDICT_DEBUG_TYPE, kv.formatKeyedVerdictDebug(p, v)), ...(t !== undefined ? { timestamp: new Date(t) } : {}) });
    const one = [{ role: 'student', text: 'a) 7', timestamp: new Date(1000) }, { role: 'tutor', text: 'Not quite', timestamp: new Date(2000) }];
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [k('a', 'incorrect', 1500), k('a', 'incorrect', 1900)], transcript: one, verified: true }), 'in_progress', 'timed, same student turn');
    assert.equal(oc.classifyHomeworkProblemOutcome({ debugEvents: [k('a', 'incorrect'), k('a', 'incorrect')], transcript: [], verified: true }), 'in_progress', 'untimed, consecutive');
    assert.deepEqual(oc.dedupedKeyedVerdicts([k('a', 'incorrect', 1500), k('a', 'incorrect', 1600), k('a', 'correct', 1700)], one), [{ part: 'a', verdict: 'incorrect' }, { part: 'a', verdict: 'correct' }]);
  });
  await section('priorNote: exact prompt, ≤ 40 words, empty without a student turn or on failure', async () => {
    let prompt = '';
    const long = Array.from({ length: 60 }, (_, i) => `w${i}`).join(' ');
    const note = await oc.homeworkProblemPriorNote([stu('x = 5'), { role: 'tutor', text: 'Check step 2.' }], { summarize: async (p) => { prompt = p.instruction; return long; } });
    assert.equal(prompt, 'Two short lines: what the student did on this problem and where they stopped. No answers.');
    assert.equal(note.split(/\s+/).length, 40);
    let calls = 0;
    assert.equal(await oc.homeworkProblemPriorNote([{ role: 'tutor', text: 'Hi' }], { summarize: async () => { calls++; return 'x'; } }), '');
    assert.equal(calls, 0);
    assert.equal(await quietly(() => oc.homeworkProblemPriorNote([stu('hi')], { summarize: async () => { throw new Error('boom'); } })), '');
  });
  await section('outcome route source: HMAC, done event, claimsSetFinished, recap, partner scope', () => {
    const src = read('app/api/portal/v1/homework-problem-outcome/route.ts') + read('lib/tutor/homework-build/outcome.ts');
    has(src, /withPortalAuth/);
    has(src, /homework_problem_done/);
    has(src, /claimsSetFinished/);
    has(src, /recap/);
    has(src, /sourcePartnerId/);
  });

  console.log('e brain turn (fake model client, no network)');
  {
    const registry = await import('../src/lib/tutor/ai/model-registry');
    const brain = await import('../src/lib/tutor/voice/claude-brain');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = registry.getModelClient('brain').client as any;
    const requests: Array<{ messages: Array<{ content: unknown }> }> = [];
    client.messages.stream = (params: { messages: Array<{ content: unknown }> }) => {
      requests.push(JSON.parse(JSON.stringify(params)));
      const text = 'Let us look at it.';
      const events = [
        { type: 'message_start' },
        { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } }, { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text } }, { type: 'content_block_stop', index: 0 },
        { type: 'message_delta', delta: { stop_reason: 'end_turn' } }, { type: 'message_stop' },
      ];
      return {
        abort() {}, controller: { abort() {} },
        async finalMessage() { return { content: [{ type: 'text', text }], stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1 } }; },
        async *[Symbol.asyncIterator]() { for (const e of events) yield e; },
      };
    };
    let llmCalls = 0;
    const llm = async () => { llmCalls++; return { text: JSON.stringify({ proposed_value: '7', problem_final_answer: '20', proposed_equals_final_answer: false, answers: 'overall_problem', target: 'x', correct_value: '20', verdict: 'incorrect', confidence: 'high', differs_test: '', differs_at: '' }), model: 'fake', inputTokens: 1, outputTokens: 1 }; };
    const base = {
      systemPrompt: 'CORE. SESSION.', systemPromptCore: 'CORE. ',
      conversationHistory: [{ role: 'assistant' as const, content: 'What do you get for x?' }],
      whiteboardSnapshot: [], tools: [],
      activeProblem: { statement: 'Find x when 3x = 60.', source: 'card' as const, expectedAnswer: 'x = 20' },
      textTurnShape: true, textVerdictPrecheck: true, textWorkThenMatch: true, noRevealLedger: true,
      verdictPrecheckDeps: { llm },
    };
    const run = async (msg: string, extra: Record<string, unknown>) => {
      requests.length = 0; llmCalls = 0;
      const events: Array<Record<string, unknown>> = [];
      const l = console.log, w = console.warn; console.log = () => {}; console.warn = () => {};
      try { for await (const ev of brain.streamBrainTurn({ ...base, studentTranscript: msg, studentMessage: msg, ...extra } as never)) events.push(ev as unknown as Record<string, unknown>); }
      finally { console.log = l; console.warn = w; }
      const content = String(requests[0]?.messages[requests[0].messages.length - 1]?.content ?? '');
      return { events, content };
    };
    const verifiedHp = { text: 'Find x when 3x = 60.', verified: true, hasFigure: true, key: X20 };
    await section('verified + keyed correct: injected with no model call, frames + done', async () => {
      const r = await run('x = 60/3 = 20', { homeworkProblem: verifiedHp });
      assert.equal(llmCalls, 0);
      const pre = r.events.find((e) => e.type === 'verdict-precheck') as { result: { verdict: string; proposed: string }; ms: number } | undefined;
      assert.ok(pre, 'verdict-precheck frame');
      assert.equal(pre.result.verdict, 'correct');
      assert.equal(pre.result.proposed, '20');
      assert.equal(pre.ms, 0);
      assert.ok(r.events.some((e) => e.type === 'homework-keyed-verdict' && e.verdict === 'correct' && e.part === ''));
      assert.ok(r.events.some((e) => e.type === 'homework-problem-done'));
      assert.ok(r.content.includes('<homework_problem>'));
      assert.ok(r.content.includes('<answer_check>'));
      assert.ok(!r.content.includes('<homework_session>'));
      assert.ok(r.content.includes('Ask, never tell: never state the final answer'), 'ask-never-tell rule');
      assert.ok(r.content.includes(brain.ACTIVE_PROBLEM_HOMEWORK_REVEAL_SUFFIX.trim()), 'homework reveal suffix in <active_problem>');
      assert.ok(!r.content.includes(brain.ACTIVE_PROBLEM_HOMEWORK_PART_SUFFIX.trim()), 'no several-problems part scope');
    });
    await section('a runtime note quoting the answer: no keyed verdict, no done', async () => {
      const note = '[correction note — not from the student] The intended answer is "x = 20".';
      const r = await run(note, { homeworkProblem: verifiedHp, studentMessage: undefined });
      assert.ok(!r.events.some((e) => e.type === 'homework-keyed-verdict' || e.type === 'homework-problem-done'));
      assert.ok(!r.events.some((e) => e.type === 'verdict-precheck' && (e.result as { verdict?: string })?.verdict === 'correct' && e.ms === 0));
    });
    await section('intermediate working: no keyed incorrect, handed to the model check', async () => {
      const r = await run('I found that AB is 12', { homeworkProblem: verifiedHp });
      assert.ok(!r.events.some((e) => e.type === 'homework-keyed-verdict'));
    });
    await section('verified + undecided: the model check runs with the key as facts and a 4 s cap', async () => {
      let seenUser = '';
      let seenTimeout = 0;
      const spy = async (req: { user: string; timeoutMs: number }) => { seenUser = req.user; seenTimeout = req.timeoutMs; return llm(); };
      const r = await run('so it is twenty', { homeworkProblem: verifiedHp, verdictPrecheckDeps: { llm: spy } });
      assert.match(seenUser, /verified final answer: x = 20/);
      assert.equal(seenTimeout, 4000);
      assert.ok(!r.events.some((e) => e.type === 'homework-problem-done'));
    });
    await section('unverified: no pre-check, no <answer_check>, never-judge rule', async () => {
      const r = await run('x = 25', { homeworkProblem: { text: 'Find x.', verified: false, hasFigure: false }, activeProblem: { statement: 'Find x.', source: 'card' } });
      assert.equal(llmCalls, 0);
      assert.ok(!r.events.some((e) => e.type === 'verdict-precheck' || e.type === 'homework-keyed-verdict'));
      assert.ok(!r.content.includes('<answer_check>'));
      assert.ok(r.content.includes('never say an answer is right or wrong'));
    });
    await section('C1 unverified: nothing in the turn tells the tutor to judge', async () => {
      // Even when a caller passes an activeProblem and work-then-match is on.
      for (const msg of ['x = 25', 'I think it is 25', 'yes']) {
        const r = await run(msg, { homeworkProblem: { text: 'Find x.', verified: false, hasFigure: false }, activeProblem: { statement: 'Find x.', source: 'card' } });
        for (const bad of ['WORK IT', 'right final answer', 'judging', 'Derive the correct answer', '<verdict_guard>', '<answer_check>', '<active_problem>', '<active_question>', 'grade it']) {
          assert.ok(!r.content.includes(bad), `${JSON.stringify(msg)}: prompt contains ${bad} :: ${r.content.slice(Math.max(0, r.content.indexOf(bad) - 300), r.content.indexOf(bad) + 100)}`);
        }
        assert.ok(!r.events.some((e) => e.type === 'work-then-match'), 'no work-then-match frame');
        assert.ok(r.content.includes('<homework_problem>'));
      }
    });
    await section('C1 verified: homework card wording, never "YOU authored"/"auto-scorer"', async () => {
      const r = await run('so it is twenty', { homeworkProblem: verifiedHp, activeProblem: { statement: 'Find x when 3x = 60.', source: 'homework', expectedAnswer: 'x = 20' } });
      assert.ok(r.content.includes('from their own homework sheet'), 'homework card text');
      assert.ok(r.content.includes('VERIFIED expected answer'), 'verified expected answer');
      assert.ok(r.content.includes('Never state it to the student.'));
      assert.ok(!r.content.includes('YOU authored'));
      assert.ok(!r.content.includes('auto-scorer'));
    });
    await section('C1 formatActiveProblemBlock: default sources unchanged by the homework variant', () => {
      const card = brain.formatActiveProblemBlock({ statement: 'S', source: 'card', expectedAnswer: 'A' }, { homework: false });
      assert.ok(card.includes('a card YOU authored') && card.includes('auto-scorer'));
      assert.ok(!card.includes('own homework sheet'));
      const hw = brain.formatActiveProblemBlock({ statement: 'S', source: 'homework', expectedAnswer: 'A' }, { homework: true, partScope: false });
      assert.ok(hw.includes(brain.ACTIVE_PROBLEM_HOMEWORK_REVEAL_SUFFIX.trim()));
      assert.equal(brain.homeworkProblemNeverJudged({ homeworkProblem: { text: 'P', verified: true, hasFigure: false } }), true, 'verified without a key is never judged');
      assert.equal(brain.homeworkProblemNeverJudged({}), false);
    });
    await section('no homeworkProblem: the model check runs as before, no new frames or block', async () => {
      const r = await run('x = 7', {});
      assert.equal(llmCalls, 1);
      assert.ok(!r.content.includes('<homework_problem>'));
      assert.ok(!r.content.includes('Ask, never tell'));
      assert.ok(!r.content.includes('You keep nothing about the student between sessions'), 'default turn: no conduct rules added');
      assert.ok(!r.content.includes(brain.ACTIVE_PROBLEM_HOMEWORK_REVEAL_SUFFIX.trim()), 'default turn: no homework reveal suffix');
      assert.ok(!r.events.some((e) => e.type === 'homework-keyed-verdict' || e.type === 'homework-problem-done'));
    });
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
