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
  TYPED_TURN_SCHEMA, TYPED_NEXT_KINDS, TYPED_TURN_INSTRUCTIONS, typedTurnStateBlock, TYPED_KIND_MEANING, typedSayBudgetFor,
  truncateToSentences, sentenceCount, englishSentenceCount, parseTypedTurn, TYPED_FIELD_ORDER,
  TypedTurnReader, OrderedFieldEmitter, typedTurnRetryMessage, isStructuredOutputRejection,
} from '../src/lib/tutor/voice/typed-turn';
import { isStructuredOutputRejection as gradeIsStructuredOutputRejection } from '../src/lib/tutor/portal/grade-free-response';

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

test('typedTurnStateBlock — allowed_next line lists only the allowed kinds with meanings (F3)', () => {
  const b = typedTurnStateBlock({ state: '<turn_state part="x"/>', allowedNext: ['retry', 'question'], recap: false });
  const line = b.split('\n').find((l) => l.startsWith('allowed_next:')) ?? '';
  assert.equal(line, `allowed_next: retry — ${TYPED_KIND_MEANING.retry.replace(/\.$/, '')}; question — ${TYPED_KIND_MEANING.question.replace(/\.$/, '')}`);
  for (const k of TYPED_NEXT_KINDS.filter((x) => x !== 'retry' && x !== 'question')) assert.ok(!new RegExp(`\\b${k} —`).test(line), k);
  assert.ok(b.indexOf('<turn_state') < b.indexOf('allowed_next:'));
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('rejected and costs the student a second wait'));
  for (const k of TYPED_NEXT_KINDS) assert.ok(TYPED_TURN_INSTRUCTIONS.includes(`- ${k}: ${TYPED_KIND_MEANING[k]}`), k);
});

test('TYPED_TURN_INSTRUCTIONS — covers fields and rules, no tools', () => {
  for (const w of ['"ack"', '"verdict_say"', '"support_ja"', '"next"', 'allowed_next', 'none', 'Japanese']) {
    assert.ok(TYPED_TURN_INSTRUCTIONS.includes(w), w);
  }
  assert.ok(/move's "say" ends with the new part's FIRST QUESTION[^\n]*never a readiness check/.test(TYPED_TURN_INSTRUCTIONS), 'move ends on the first question, not a readiness check');
  assert.ok(!TYPED_TURN_INSTRUCTIONS.includes('show_sentence'));
  assert.ok(!TYPED_TURN_INSTRUCTIONS.includes('advance_lesson'));
  assert.ok(TYPED_TURN_INSTRUCTIONS.split('\n').length < 120);
});

test('G2: instructions explain answered and forbid re-asking', () => {
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('answered'));
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('DIFFERENT question'));
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('Never ask again a question listed in `answered`'));
});

test('G3: menu and move say the choices WITH their numbers; budget helper', () => {
  assert.ok(TYPED_KIND_MEANING.menu.includes('1)'));
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('1)'));
  assert.ok(/WITH its numbers/.test(TYPED_TURN_INSTRUCTIONS.split('WHEN next.kind IS move')[1]));
  assert.equal(typedSayBudgetFor('menu', false), 5);
  assert.equal(typedSayBudgetFor('question', true), 5);
  assert.equal(typedSayBudgetFor('question', false), 3);
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
  assert.equal(pushes, [...text].length);
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

test('reader — literal \\uXXXX escapes split across 1-char deltas', () => {
  const text = '{"ack":"A","support_ja":"\\u3053\\u3093\\u306b\\u3061\\u306f","verdict_say":"q\\u0022x"}';
  assert.ok(text.includes('\\u3053'));
  const { evs } = feedAll(text);
  assert.equal(evs.find(e => e.field === 'support_ja').value, 'こんにちは');
  assert.equal(evs.find(e => e.field === 'verdict_say').value, 'q"x');
});

test('emitter — invalid mid-stream field holds later ones until flush()', () => {
  const t = JSON.stringify({ ack: 'A', verdict: 'bogus', verdict_say: 'V', correction: null, support_ja: '', next: FULL.next });
  const { evs, r } = feedAll(t);
  assert.deepEqual(evs.map(e => e.field), ['ack', 'verdict_say', 'correction', 'support_ja', 'next']);
  assert.equal(r.complete, true);
  const em = new OrderedFieldEmitter(); const out: string[] = [];
  for (const e of evs) out.push(...em.push(e).map(x => x.field));
  assert.deepEqual(out, ['ack']);
  assert.deepEqual(em.flush().map(x => x.field), ['verdict_say', 'correction', 'support_ja', 'next']);
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

test('instructions explain turn_state and nudge', () => {
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('turn_state') && TYPED_TURN_INSTRUCTIONS.includes('nudge'));
});


// ---- Task 6: retry message + structured-output rejection predicate ----
const ALREADY = { ack: 'Good try.', verdict: 'incorrect' as const, verdict_say: 'Nearly there.', correction: null, support_ja: '' };
test('retry message — illegal kind: refused kind, allowed set, ALREADY SPOKEN, the ack text, only next is read', () => {
  const m = typedTurnRetryMessage({ reason: 'illegal_kind', refused: { kind: 'offer', say: 'One more, or move on?', item: '', level: '' },
    allowedNext: ['retry', 'question'], alreadySaid: ALREADY, budget: 3 });
  assert.ok(m.startsWith('[typed turn retry — not from the student]'), m.slice(0, 60));
  assert.ok(m.includes('refused "offer"'), 'names the refused kind');
  assert.ok(m.includes('allowed: retry, question'), 'names the allowed set');
  assert.ok(m.includes('ALREADY SPOKEN'));
  assert.ok(m.includes('Good try.') && m.includes('Nearly there.'), 'lists the spoken fields');
  assert.ok(/only .?next.? is read/i.test(m), 'says only next is read');
});
test('retry message — say over budget restates the budget number', () => {
  const m = typedTurnRetryMessage({ reason: 'say_over_budget', refused: { kind: 'question', say: 'A. B. C. D.', item: '', level: '' },
    allowedNext: ['retry', 'question'], alreadySaid: ALREADY, budget: 3 });
  assert.ok(/at most 3 sentences/.test(m) && /English sentences/.test(m), m);
  assert.ok(m.includes('ALREADY SPOKEN'));
});
test('englishSentenceCount — Japanese sentences are exempt (F2)', () => {
  assert.equal(englishSentenceCount('はい。 Let us go. 次です。 Ready?'), 2);
  assert.equal(englishSentenceCount('Good. では次です。 Next one. 発音の練習です。 What did you do?'), 3);
  assert.equal(englishSentenceCount('One. Two. Three.'), 3);
  assert.equal(englishSentenceCount('はい。次です。'), 0);
  assert.equal(englishSentenceCount('「去年」は特定の過去なので過去形の went を使います。'), 0);
  assert.equal(englishSentenceCount('「I went there yesterday.」と言ってください。'), 0);
  assert.equal(englishSentenceCount('Good. 「去年」は特定の過去なので過去形の went を使います。 Say it again.'), 2);
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('The next.say budget counts English sentences; Japanese sentences in next.say do not count.'));
});
test('instructions — move rule reads next_card, menu read out (F1)', () => {
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('next_card') && TYPED_TURN_INSTRUCTIONS.includes('numbered menu'));
});
test('isStructuredOutputRejection lives here and is re-exported unchanged by grade-free-response', () => {
  assert.equal(isStructuredOutputRejection({ status: 400, message: 'output_config.format is not supported' }), true);
  assert.equal(isStructuredOutputRejection({ status: 400, message: 'prompt is too long' }), false);
  assert.equal(gradeIsStructuredOutputRejection, isStructuredOutputRejection);
});

if (failed) { console.log(`\n${failed} typed-turn test(s) FAILED`); process.exit(1); }
console.log('\nall typed-turn tests passed');
