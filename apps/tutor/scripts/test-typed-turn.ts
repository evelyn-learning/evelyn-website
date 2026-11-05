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
  TypedTurnReader, OrderedFieldEmitter, typedTurnRetryMessage, isStructuredOutputRejection, correctionChangesNothing,
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
  ack: 'Nice try.', verdict: 'incorrect', verdict_say: 'Close, one small change.', board: '',
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
  assert.deepEqual([...TYPED_FIELD_ORDER], ['ack', 'verdict', 'verdict_say', 'board', 'correction', 'support_ja', 'next']);
  // V1: the board sentence is a required string field
  assert.ok((TYPED_TURN_SCHEMA as Node).required.includes('board'));
  assert.deepEqual(props.board, { type: 'string' });
});

test('V1: parseTypedTurn carries board and rejects an object without it', () => {
  const withBoard = { ...VALID, verdict: 'correct', correction: null, board: 'I sell washing machines to customers.' };
  assert.equal(parseTypedTurn(JSON.stringify(withBoard))?.board, 'I sell washing machines to customers.');
  const { board: _b, ...noBoard } = VALID;
  assert.equal(parseTypedTurn(JSON.stringify(noBoard)), null);
  assert.equal(parseTypedTurn(JSON.stringify({ ...VALID, board: 3 })), null);
});

test('V1: instructions define board (clean written form; "" for fragments / corrections; never the raw transcript)', () => {
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('"board": string'), 'object shape');
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('when verdict is `correct` and the reply is a complete sentence worth keeping, that sentence in its clean written form (capitalised, punctuated, fillers removed, no transcription slips)'));
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('The engine shows `board` on the whiteboard exactly as written; it never shows the raw transcript.'));
  // every EXAMPLE object parses (board present)
  const examples = TYPED_TURN_INSTRUCTIONS.split('\n').filter((l) => l.startsWith('{"ack"'));
  assert.ok(examples.length >= 3, `${examples.length} examples`);
  for (const ex of examples) assert.ok(parseTypedTurn(ex), ex.slice(0, 80));
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
  // V3 (fix wave 2): a recap's review + feedback + check turn needs 2+2+2 English sentences (spec §4.1 said 5)
  assert.equal(typedSayBudgetFor('question', true), 7);
  assert.equal(typedSayBudgetFor('close', true), 7);
  assert.equal(typedSayBudgetFor('question', false), 3);
});

test('V3: the recap glossary, the recap verdict rule and the budget sentence', () => {
  const I = TYPED_TURN_INSTRUCTIONS;
  assert.ok(I.includes('`recap_step=review_feedback_check`: `next.say` reviews what was practised using the student\'s OWN corrected sentences from this lesson (the card\'s examples only when they produced none), gives one specific strength and one thing to improve, and asks the part\'s check question; use every phrase in `required_phrases` verbatim.'));
  assert.ok(I.includes('`recap_step=close`: `next.kind` is `close`; `verdict_say` evaluates their check answer, `next.say` explains briefly if needed and closes warmly; ask nothing after the close.'));
  assert.ok(I.includes('In the recap part a reply that names a sentence, a grammar point or an answer to the check question is `correct` or `partly_correct`, never `none`.'));
  assert.ok(I.includes('next.say 3 (5 for a menu, 7 on a recap)'), 'budget sentence');
  assert.ok(I.includes('(7 when recap is "yes" in the turn block'), 'field line');
});

test('flags — TUTOR_TYPED_TURN is default ON (off only with NEXT_PUBLIC_TUTOR_TYPED_TURN=off)', () => {
  const src = readFileSync(join(__dirname, '../src/lib/tutor/orchestrator/flags.ts'), 'utf8');
  assert.match(src, /export const TUTOR_TYPED_TURN = process\.env\.NEXT_PUBLIC_TUTOR_TYPED_TURN !== 'off';/);
});

// ---- Task 2: incremental field reader ----
const FULL = {
  ack: 'Thanks, Praveen.', verdict: 'partly_correct', verdict_say: 'Close; one word is off.', board: '',
  correction: { student: 'I like presentation', corrected: 'I like presentations', emphasis: ['presentations'], explain: 'Plural.' },
  support_ja: '複数形です。', next: { kind: 'question', say: 'What do you present?', item: '', level: '' },
};
const ORDER = ['ack', 'verdict', 'verdict_say', 'board', 'correction', 'support_ja', 'next'];
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
  assert.deepEqual(evs[4].value.emphasis, ['presentations']);
  assert.equal(evs[6].value.kind, 'question');
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
  const t = JSON.stringify({ next: FULL.next, ack: 'A', verdict: 'correct', verdict_say: 'V', support_ja: '', correction: null, board: '' });
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

test('V1: a board that closes before verdict_say is held until verdict_say is released', () => {
  const t = JSON.stringify({ ack: 'A', verdict: 'correct', board: 'I sell washing machines to customers.', verdict_say: 'V', correction: null, support_ja: '', next: FULL.next });
  const { evs } = feedAll(t);
  assert.equal(evs.find((e) => e.field === 'board').value, 'I sell washing machines to customers.');
  const em = new OrderedFieldEmitter(); const got: string[][] = [];
  for (const e of evs) got.push(em.push(e).map((x) => x.field));
  const boardAt = evs.findIndex((e) => e.field === 'board');
  assert.deepEqual(got[boardAt], [], 'board held');
  const vsAt = evs.findIndex((e) => e.field === 'verdict_say');
  assert.deepEqual(got[vsAt], ['verdict_say', 'board'], 'released with verdict_say, in order');
  assert.deepEqual(got.flat(), ORDER);
});

test('V1: the retry message lists board among the fields already given', () => {
  const m = typedTurnRetryMessage({ reason: 'illegal_kind', refused: { kind: 'offer', say: 'x', item: '', level: '' },
    allowedNext: ['retry', 'question'], alreadySaid: { ack: 'A.', verdict: 'correct', verdict_say: 'Good.', board: 'I went there yesterday.', correction: null, support_ja: '' }, budget: 3 });
  assert.ok(m.includes('board: "I went there yesterday."'), m);
});

test('instructions explain turn_state and nudge', () => {
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('turn_state') && TYPED_TURN_INSTRUCTIONS.includes('nudge'));
});


// ---- Task 6: retry message + structured-output rejection predicate ----
const ALREADY = { ack: 'Good try.', verdict: 'incorrect' as const, verdict_say: 'Nearly there.', board: '', correction: null, support_ja: '' };
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

test('H2: verdicts are defined operationally; none only for a non-answer; answered glossary', () => {
  // fix wave 3 F2: pin moved — the merged single `none` rule (X4 + the old list) replaced 'ONLY when the reply is not an answer'
  // F2b: pin moved again — the full merged list (a question to you / an aside / a request to move on restored)
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes("`none` ONLY when the reply is not an attempt at the open ask: silence, a greeting, 'OK' / 'thank you', 'I don't understand', a request to repeat or slow down, a question to you, an aside, a request to move on, or a reply in Japanese only."));
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('acceptable answer'));
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('fills from correct and partly_correct'));
});

test('W6: retry message — item_not_listed names the listed items verbatim', () => {
  const left = ['I was responsible for communicating with our customers.', 'We finished the project last month.'];
  const m = typedTurnRetryMessage({ reason: 'illegal_kind', refused: { kind: 'item', say: 'Say this.', item: 'I have worked here.', level: '' },
    allowedNext: ['item', 'offer', 'move'], alreadySaid: ALREADY, budget: 3, itemNotListed: left });
  assert.ok(m.includes('item_not_listed'), m);
  for (const x of left) assert.ok(m.includes(`"${x}"`), x);
  assert.ok(m.includes('allowed: item, offer, move'));
  assert.ok(m.includes('ALREADY SPOKEN'));
});

test('W7: every spoken turn carries an English sentence; Japanese supports, never replaces (r60 1008 s)', () => {
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('Every turn you speak contains at least one English sentence (in `verdict_say` or `next.say`); Japanese supports, it never replaces.'));
});

test('V2: verdict semantics per part kind + the conversation corrections budget', () => {
  const I = TYPED_TURN_INSTRUCTIONS;
  assert.ok(I.includes('`correct`: the reply answers the open ask and is acceptable as said.'), 'correct defined');
  assert.ok(I.includes('In a part that teaches a grammar point (`part` is bridge, offer_part or plain), a reply with an error in the target grammar, a missing verb, a missing article/plural that changes the form, or a fragment where a sentence was asked is `partly_correct` with a correction.'), 'grammar-part rule');
  assert.ok(I.includes('In conversation parts small slips may pass as `correct`, but an error in the lesson\'s target grammar is corrected while `corrections_left` is above 0.'), 'conversation rule');
  assert.ok(I.includes('In the level check nothing is corrected.'), 'level check');
  // R4/M6: the level check's verdict, explicitly
  assert.ok(I.includes('There every real answer is `correct` with `correction` null, errors or not (a non-answer is still `none`).'), 'level-check verdict');
  assert.ok(!/In conversation and level-check parts an acceptable answer/.test(I), 'the old Ruling-9 sentence is gone');
  assert.ok(/corrections_left \(conversation parts only\)/.test(I), 'glossary entry');
  // the correct EXAMPLE sits in a conversation part with a non-target slip; a grammar-part EXAMPLE shows partly_correct + retry
  const exHeads = I.split('\n').filter((l) => l.startsWith('EXAMPLE'));
  assert.ok(exHeads.some((h) => /verdict correct/.test(h) && /conversation part/.test(h) && /not the target grammar/.test(h)), exHeads.join('\n'));
  const grammarAt = I.split('\n').findIndex((l) => l.startsWith('EXAMPLE') && /grammar part/.test(l));
  assert.ok(grammarAt >= 0, 'grammar-part example');
  const g = parseTypedTurn(I.split('\n')[grammarAt + 1]);
  assert.ok(g && g.verdict === 'partly_correct' && g.correction && g.next.kind === 'retry' && g.board === '', 'partly_correct + correction + retry');
});

test('V6: a move into a key-ideas card previews its examples, then asks its practice question (3 sentences)', () => {
  const move = TYPED_TURN_INSTRUCTIONS.split('WHEN next.kind IS move')[1].split('\n\n')[0];
  assert.ok(move.includes('When `next_card` lists key ideas or example sentences (not a question or a numbered menu), `say` is: the bridge sentence, ONE sentence that names the card\'s example(s) as a preview, then the card\'s practice question.'), move);
  assert.equal(typedSayBudgetFor('move', false), 3);
});

test('X2 (fix wave 3): the recap close carries every required phrase; the retry for a close without one names them', () => {
  assert.ok(TYPED_TURN_INSTRUCTIONS.split('THE RECAP PART')[1].split('\n\n')[0].includes('Your closing turn contains every phrase in `required_phrases` verbatim before the goodbye.'), 'recap block');
  const m = typedTurnRetryMessage({ reason: 'missing_required_phrase', refused: { kind: 'close', say: 'Well done today. See you!', item: '', level: '' },
    allowedNext: ['close'], alreadySaid: { ack: 'Right.', verdict: 'correct', verdict_say: 'That is it.', board: '', correction: null, support_ja: '' }, budget: 7,
    missingPhrases: ['one thing you did well'] });
  assert.ok(m.includes('missing_required_phrase') && m.includes('"one thing you did well"'), m);
  assert.ok(/the close must contain/i.test(m), m);
  assert.ok(m.includes('ALREADY SPOKEN'));
});

test('X3 (fix wave 3): a refused move / close is never spoken as a move (r61b 71 s, 147 s)', () => {
  const STAY = 'Do not announce a move, do not say this part is finished, and do not name the next part — stay in this part and choose from the allowed kinds.';
  const ALREADY = { ack: 'Good.', verdict: 'correct' as const, verdict_say: 'Nice.', board: '', correction: null, support_ja: '' };
  for (const kind of ['move', 'close'] as const) {
    const m = typedTurnRetryMessage({ reason: 'illegal_kind', refused: { kind, say: "Let's move on to your work.", item: '', level: '' }, allowedNext: ['question'], alreadySaid: ALREADY, budget: 3 });
    assert.ok(m.includes(STAY), `${kind}: ${m}`);
  }
  const q = typedTurnRetryMessage({ reason: 'illegal_kind', refused: { kind: 'offer', say: 'One more?', item: '', level: '' }, allowedNext: ['question'], alreadySaid: ALREADY, budget: 3 });
  assert.ok(!q.includes(STAY), 'only a refused move / close');
  // F3: the offer names the next part as a choice — not forbidden
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes("When `move` is not in `allowed_next`, never say the part is over and never announce a move; the engine turns the page, not your words. An `offer` turn names the next part as the choice ('…or shall we move on to <next_part>?') — that is not a move."), 'instructions');
  assert.ok(!TYPED_TURN_INSTRUCTIONS.includes('never say the part is over or name the next part'), 'old X3(b) wording gone');
});

test('X4 + F2 (fix wave 3): ONE `none` rule — non-attempts only', () => {
  const I = TYPED_TURN_INSTRUCTIONS;
  const RULE = "`none` ONLY when the reply is not an attempt at the open ask: silence, a greeting, 'OK' / 'thank you', 'I don't understand', a request to repeat or slow down, a question to you, an aside, a request to move on, or a reply in Japanese only. A reply that attempts the question in English is never `none`, in any part, even when you will not correct it.";
  assert.equal(I.split(RULE).length - 1, 1, 'the merged rule, once');
  assert.ok(!I.includes('ONLY when the reply is not an answer at all'), 'old list merged away');
  assert.ok(!I.includes('Never use "none" for a reply that answers the ask'), 'duplicate sentence removed');
  assert.ok(!I.includes("`none` only when the reply is not an attempt at the open ask — a greeting"), 'X4 sentence merged away');
});

test('Z1 (fix wave 5): correctionChangesNothing — a correction equal to what the student said changes nothing', () => {
  const c = (student: string, corrected: string, emphasis: string[]) => ({ student, corrected, emphasis, explain: 'x' });
  // p2.txt 310 s / 501 s: the student's sentence was already the corrected one
  const canva = 'I use Canva to prepare presentations with pictures and graphics.';
  assert.equal(correctionChangesNothing(canva, c(canva, 'I use Canva to prepare presentations with pictures and graphics.', ['presentations'])), true, '310 s');
  const robots = 'I learned that robot companies come from China.';
  assert.equal(correctionChangesNothing(robots, c(robots, 'I learned that robot companies come from China.', ['learned', 'that'])), true, '501 s');
  // normalisation: case, punctuation, whitespace, a leading filler in the student text
  assert.equal(correctionChangesNothing('uh, so I learned that robot companies  come from china', c('', robots, ['learned'])), true, 'leading fillers + case + punctuation');
  // the fix is already there: every changed word present (as often as the model needs it), nothing the model drops, same order
  assert.equal(correctionChangesNothing('I learned um that robot companies come from China', c('', robots, ['learned'])), true, 'mid-sentence hesitation only');
  // a real correction stays
  assert.equal(correctionChangesNothing('I go there yesterday', c('I go there yesterday', 'I went there yesterday.', ['went'])), false, 'go → went');
  assert.equal(correctionChangesNothing('I saw a robot and dog', c('', 'I saw a robot and a dog.', ['a'])), false, 'a missing second "a" (count-aware)');
  assert.equal(correctionChangesNothing('I yesterday went there', c('', 'I went there yesterday.', ['went', 'yesterday'])), false, 'word order is a change');
  assert.equal(correctionChangesNothing('I use Canva to prepare presentation', c('', 'I use Canva to prepare presentations.', ['presentations'])), false, 'plural');
  assert.equal(correctionChangesNothing('anything', null), false, 'no correction');
  assert.equal(correctionChangesNothing('', c('', '', [])), false, 'empty texts never match');
});

test('Z1 (fix wave 5): a retry refused for correction_no_change names the reason and the next step', () => {
  const m = typedTurnRetryMessage({ reason: 'illegal_kind', correctionNoChange: true, refused: { kind: 'retry', say: 'Can you say the whole sentence once more?', item: '', level: '' }, allowedNext: ['retry', 'question', 'offer'], alreadySaid: { ack: 'Nice.', verdict: 'correct', verdict_say: '', board: '', correction: null, support_ja: '' }, budget: 3 });
  assert.ok(m.includes('(correction_no_change)'), m);
  assert.ok(m.includes("the student's sentence already has that form; no correction, no retry — ask the next question or offer"), m);
  assert.ok(m.includes('verdict: "correct"') && m.includes('correction: null'), m);
});

// B (fix wave 6, p3 654 s) pin moved: Z2's "leave board empty on a move" is REMOVED by the brief — a move right after
// an answer judges it first (verdict, verdict_say, correction + board) — the fix wave 5 page hold keeps the card up.
test('B (fix wave 6): a move right after an answer judges it first, then bridges (replaces Z2 "leave board empty")', () => {
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes("When `next.kind` is `move` right after the student's answer, judge that answer first (`verdict`, `verdict_say`, a `correction` and `board` when it had a slip), then `next.say` = one bridge sentence + the new part's opening ask."), 'instruction');
  assert.ok(!TYPED_TURN_INSTRUCTIONS.includes('leave `board` empty'), 'the Z2 sentence is gone');
  const i = TYPED_TURN_INSTRUCTIONS.indexOf('- "board":');
  const j = TYPED_TURN_INSTRUCTIONS.indexOf('- "correction":');
  assert.ok(i >= 0 && j > i && TYPED_TURN_INSTRUCTIONS.slice(i, j).includes('judge that answer first'), 'inside the board rule');
});

test('B (fix wave 6): Mr. / Dr. / St. / No. 5 are not sentence ends on the typed path; etc. / a single initial are (F1)', () => {
  assert.equal(sentenceCount('Good, you met Mr. Kenji last month.'), 1);
  assert.equal(truncateToSentences('Good, you met Mr. Kenji last month.', 1), 'Good, you met Mr. Kenji last month.');
  assert.equal(sentenceCount('I spoke to Dr. Sato. She agreed.'), 2);
  for (const t of ['Mrs. Tanaka called.', 'Ms. Ito agreed.', 'Prof. Mori spoke.', 'We met on Main St. Station.', 'Taro Jr. Smith came.', 'Japan vs. Korea was fun.', 'Fruit, e.g. Apples are good.', 'Food, i.e. Rice is fine.', 'Go to No. 5 now.']) {
    assert.equal(sentenceCount(t), 1, t);
  }
  // Fix round 1 (F1) pins moved: "etc." and the single capital initial are sentence ends again — the rules merged real
  // sentences (review). 'TVs, fridges, etc. Many things.' and 'I emailed J. Smith today.' were 1, now 2.
  for (const t of ['We sold TVs, fridges, etc. Then we left.', 'You can choose plan B. Then we start.', 'Neither do I. Let us try again.', 'Take vitamin C. It helps.', 'TVs, fridges, etc. Many things.', 'I emailed J. Smith today.']) {
    assert.equal(sentenceCount(t), 2, t);
  }
  assert.equal(sentenceCount('No. That is wrong.'), 2, 'No. before a word ends a sentence');
  assert.equal(sentenceCount('A. B. C.'), 3, 'bare initials in a row stay separate');
  assert.equal(englishSentenceCount('Good, you met Mr. Kenji last month. Next, tell me about your work.'), 2);
});

test('Z1 round 1: leading yes / so / well / okay are dropped before comparing', () => {
  const c = (corrected: string) => ({ student: '', corrected, emphasis: ['presentations'], explain: 'x' });
  for (const lead of ['Yes,', 'yes', 'So', 'Well,', 'Okay,', 'OK,']) {
    assert.equal(correctionChangesNothing(`${lead} I use Canva to prepare presentations.`, c('I use Canva to prepare presentations.')), true, lead);
  }
});

test('E (fix wave 6, p3 362 s): a reply that restates one of the question\'s options is an answer, inside the verdict rule', () => {
  const rule = "A reply that restates one of the question's own options — even as an imperative or a fragment ('Ask them to repeat the words') — is an answer, never a request.";
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes(rule), 'instruction');
  const i = TYPED_TURN_INSTRUCTIONS.indexOf('- "verdict":');
  const j = TYPED_TURN_INSTRUCTIONS.indexOf('- "verdict_say":');
  assert.ok(i >= 0 && j > i && TYPED_TURN_INSTRUCTIONS.slice(i, j).includes(rule), 'inside the verdict rule');
});

test('Y4 (fix wave 7, sessions 1/2: 414 s "starting with Have you ever", 157 s "move on to a new question"): a question turn asks and stops', () => {
  const rule = "A `question` turn asks and stops: never tell the learner which words to begin with ('starting with: …' belongs to a `retry` only), and never say 'move on' / 'next question' inside it — ask the question.";
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes(rule), 'instruction');
  const say = TYPED_TURN_INSTRUCTIONS.indexOf('  - "say": what you say for that kind'), r = TYPED_TURN_INSTRUCTIONS.indexOf(rule), item = TYPED_TURN_INSTRUCTIONS.indexOf('  - "item": for kind "item"');
  assert.ok(say >= 0 && r > say && r < item, 'inside the next.say guidance');
});

if (failed) { console.log(`\n${failed} typed-turn test(s) FAILED`); process.exit(1); }
console.log('\nall typed-turn tests passed');
