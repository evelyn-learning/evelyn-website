/**
 * Typed turn, Task 1: flag, wire types, JSON schema, prompt block, state block,
 * sentence budgets and the parser (src/lib/tutor/voice/typed-turn.ts).
 *
 * Run: npx tsx scripts/test-typed-turn.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  TYPED_TURN_SCHEMA, TYPED_NEXT_KINDS, TYPED_TURN_INSTRUCTIONS, typedTurnStateBlock,
  truncateToSentences, sentenceCount, parseTypedTurn, TYPED_FIELD_ORDER,
} from '../src/lib/tutor/voice/typed-turn';

let failed = 0;
const test = (name: string, fn: () => void) => {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
};

type Node = Record<string, any>;
const walk = (n: Node, visit: (n: Node) => void) => {
  visit(n);
  for (const v of Object.values(n)) {
    if (Array.isArray(v)) v.forEach((x) => x && typeof x === 'object' && walk(x, visit));
    else if (v && typeof v === 'object') walk(v as Node, visit);
  }
};

const VALID = {
  ack: 'Nice try.', verdict: 'incorrect', verdict_say: 'Close, one small change.',
  correction: { student: 'I go there yesterday', corrected: 'I went there yesterday.', emphasis: ['went'], explain: 'Past tense.' },
  support_ja: '', next: { kind: 'retry', say: 'Say it once more.', item: '', level: '' },
};

test('schema — strict shape: additionalProperties false, all keys required, no length keywords', () => {
  const props = (TYPED_TURN_SCHEMA as Node).properties;
  walk(TYPED_TURN_SCHEMA as Node, (n) => {
    assert.ok(!('maxLength' in n) && !('minLength' in n), 'no maxLength/minLength');
    if (n.type === 'object') {
      assert.equal(n.additionalProperties, false);
      assert.deepEqual([...n.required].sort(), Object.keys(n.properties).sort());
    }
  });
  assert.deepEqual(props.verdict.enum, ['correct', 'partly_correct', 'incorrect', 'none']);
  assert.deepEqual(props.next.properties.kind.enum, [...TYPED_NEXT_KINDS]);
  assert.deepEqual(props.next.properties.level.enum, ['', 'beginner', 'intermediate', 'advanced']);
  const any = props.correction.anyOf as Node[];
  assert.ok(any.some((b) => b.type === 'object') && any.some((b) => b.type === 'null' && Object.keys(b).length === 1));
  assert.deepEqual([...TYPED_FIELD_ORDER], ['ack', 'verdict', 'verdict_say', 'correction', 'support_ja', 'next']);
});

test('parseTypedTurn — accepts a full object; rejects bad verdict, missing next.say, bad kind', () => {
  assert.deepEqual(parseTypedTurn(JSON.stringify({ ...VALID, correction: null })), { ...VALID, correction: null });
  assert.deepEqual(parseTypedTurn(JSON.stringify(VALID)), VALID);
  assert.equal(parseTypedTurn(JSON.stringify({ ...VALID, verdict: 'ok' })), null);
  const { say: _s, ...noSay } = VALID.next;
  assert.equal(parseTypedTurn(JSON.stringify({ ...VALID, next: noSay })), null);
  assert.equal(parseTypedTurn(JSON.stringify({ ...VALID, next: { ...VALID.next, kind: 'ask' } })), null);
  assert.equal(parseTypedTurn('not json'), null);
});

test('sentences — truncate, count, Japanese terminators', () => {
  assert.equal(truncateToSentences('A. B. C.', 2), 'A. B.');
  assert.equal(truncateToSentences('A. B.', 2), 'A. B.');
  assert.equal(sentenceCount('こんにちは。元気ですか？'), 2);
  assert.equal(sentenceCount('Hello there. How are you?'), 2);
});

test('typedTurnStateBlock — attributes and the state line', () => {
  const b = typedTurnStateBlock({ state: '<turn_state part="x"/>', allowedNext: ['retry', 'question'], recap: false });
  assert.match(b, /allowed_next="retry,question"/);
  assert.match(b, /recap="no"/);
  assert.match(b, /nudge="no"/);
  assert.ok(b.includes('<turn_state part="x"/>'));
});

test('TYPED_TURN_INSTRUCTIONS — covers fields and rules, no tools', () => {
  for (const w of ['"ack"', '"verdict_say"', '"support_ja"', '"next"', 'allowed_next', 'none', 'Japanese']) {
    assert.ok(TYPED_TURN_INSTRUCTIONS.includes(w), w);
  }
  assert.ok(!TYPED_TURN_INSTRUCTIONS.includes('show_sentence'));
  assert.ok(!TYPED_TURN_INSTRUCTIONS.includes('advance_lesson'));
  assert.ok(TYPED_TURN_INSTRUCTIONS.split('\n').length < 120);
});

test('flags — TUTOR_TYPED_TURN is opt-in', () => {
  const src = readFileSync(join(__dirname, '../src/lib/tutor/orchestrator/flags.ts'), 'utf8');
  assert.match(src, /export const TUTOR_TYPED_TURN = process\.env\.NEXT_PUBLIC_TUTOR_TYPED_TURN === 'on';/);
});

if (failed) { console.log(`\n${failed} typed-turn test(s) FAILED`); process.exit(1); }
console.log('\nall typed-turn tests passed');
