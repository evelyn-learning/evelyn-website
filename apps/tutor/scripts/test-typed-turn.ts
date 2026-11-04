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
  TypedTurnReader, OrderedFieldEmitter,
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

// ---- Task 2: incremental field reader ----
const FULL = {
  ack: 'Thanks, Praveen.', verdict: 'partly_correct', verdict_say: 'Close; one word is off.',
  correction: { student: 'I like presentation', corrected: 'I like presentations', emphasis: ['presentations'], explain: 'Plural.' },
  support_ja: '複数形です。', next: { kind: 'question', say: 'What do you present?', item: '', level: '' },
};
const ORDER = ['ack', 'verdict', 'verdict_say', 'correction', 'support_ja', 'next'];
const feedAll = (text: string, size = 1) => {
  const r = new TypedTurnReader(); const evs: any[] = [];
  for (let i = 0; i < text.length; i += size) evs.push(...r.push(text.slice(i, i + size)));
  return { r, evs };
};

test('reader — 1-char deltas, all fields in order', () => {
  const text = JSON.stringify(FULL);
  const r = new TypedTurnReader(); const evs: any[] = []; let pushes = 0;
  for (const ch of text) { assert.equal(ch.length >= 1, true); evs.push(...r.push(ch)); pushes++; }
  assert.ok(pushes >= text.length - 5);
  assert.deepEqual(evs.map(e => e.field), ORDER);
  assert.equal(evs[0].value, 'Thanks, Praveen.');
  assert.deepEqual(evs[3].value.emphasis, ['presentations']);
  assert.equal(evs[5].value.kind, 'question');
  assert.equal(r.complete, true);
  assert.equal(r.text, text);
  assert.ok(parseTypedTurn(r.text));
});

test('reader — escapes and non-ASCII', () => {
  const o = { ...FULL, verdict_say: 'She said "yes".\nGood.', support_ja: 'こんにちは。' };
  const { evs } = feedAll(JSON.stringify(o));
  assert.equal(evs.find(e => e.field === 'verdict_say').value, 'She said "yes".\nGood.');
  assert.equal(evs.find(e => e.field === 'support_ja').value, 'こんにちは。');
});

test('reader — braces, colons and commas inside strings', () => {
  const o = { ...FULL, ack: 'a { b } : "c", [d]', verdict_say: '}{:' };
  const { evs } = feedAll(JSON.stringify(o), 3);
  assert.deepEqual(evs.map(e => e.field), ORDER);
  assert.equal(evs[0].value, 'a { b } : "c", [d]');
  assert.equal(evs[2].value, '}{:');
});

test('reader — pretty-printed equals compact', () => {
  const a = feedAll(JSON.stringify(FULL)).evs;
  const b = feedAll(JSON.stringify(FULL, null, 2), 2).evs;
  assert.deepEqual(b, a);
});

test('reader — truncation leaves next open', () => {
  const t = '{"ack":"Hi.","verdict":"correct","verdict_say":"Yes.","correction":null,"support_ja":"","next":{"kind":"question","say":"Wha';
  const { r, evs } = feedAll(t, 7);
  assert.deepEqual(evs.map(e => e.field), ['ack', 'verdict', 'verdict_say', 'correction', 'support_ja']);
  assert.equal(r.closed.next, undefined);
  assert.equal(r.complete, false);
  assert.equal(r.closed.correction?.value, null);
});

test('reader — unknown keys ignored, duplicates ignored, literal before final brace', () => {
  const t = '{"zzz":{"a":[1,2]},"ack":"A","ack":"B","verdict":"none"}';
  const { evs, r } = feedAll(t);
  assert.deepEqual(evs.map(e => e.field), ['ack', 'verdict']);
  assert.equal(evs[0].value, 'A');
  assert.equal(r.complete, true);
});

test('reader — correction/next coerced loosely', () => {
  const t = '{"correction":{"student":"a","corrected":"b","explain":"c"},"next":{"kind":"wait","say":"x"}}';
  const { evs } = feedAll(t);
  assert.deepEqual(evs[0].value, { student: 'a', corrected: 'b', emphasis: [], explain: 'c' });
  assert.deepEqual(evs[1].value, { kind: 'wait', say: 'x', item: '', level: '' });
});

test('emitter — reorders, holds, flushes', () => {
  const t = JSON.stringify({ next: FULL.next, ack: 'A', verdict: 'correct', verdict_say: 'V', support_ja: '', correction: null });
  const { evs } = feedAll(t);
  assert.equal(evs[0].field, 'next');
  const em = new OrderedFieldEmitter(); const out: string[] = [];
  const got: string[][] = [];
  for (const e of evs) { const o = em.push(e); got.push(o.map(x => x.field)); out.push(...o.map(x => x.field)); }
  assert.deepEqual(got[0], []);
  assert.deepEqual(out, ORDER);
  // flush after truncation
  const em2 = new OrderedFieldEmitter();
  assert.deepEqual(em2.push({ field: 'verdict_say', value: 'V' }), []);
  assert.deepEqual(em2.push({ field: 'next', value: FULL.next as any }), []);
  assert.deepEqual(em2.flush().map(x => x.field), ['verdict_say', 'next']);
  assert.deepEqual(em2.flush(), []);
});


if (failed) { console.log(`\n${failed} typed-turn test(s) FAILED`); process.exit(1); }
console.log('\nall typed-turn tests passed');
