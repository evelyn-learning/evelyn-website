/**
 * Typed turn: allowed next.kind sets + <turn_state/> line, on the real GDI plan.
 *
 * Run: npx tsx scripts/test-typed-turn-rules.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import {
  allowedNextFor, applyField, applyTypedTurn, createTypedTurnState, effectsForField, engineLineFor, nextItemFor,
  sayWithinBudget, sharesCardWords, enterPartState, laterPartLabels, itemsLeftFor, type FieldEffectContext, turnStateLine, typedPartKind, typedTurnRequestFor,
  type AllowedNextContext, type TypedTurnState,
} from '../src/lib/tutor/lesson-plan/typed-turn-rules';
import { TYPED_TURN_INSTRUCTIONS, type TypedNext, type TypedTurn } from '../src/lib/tutor/voice/typed-turn';
import { cardAskLine } from '../src/lib/tutor/lesson-plan/transition-ask';
import { fixedScriptEngineOfferLines } from '../src/lib/tutor/lesson-plan/fixed-script';
import { getSegmentTruth } from '../src/lib/tutor/lesson-plan/context';
import { moveOnRequestSpan } from '../src/lib/tutor/voice/correct-retry';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}

const PLAN_PATH = join(__dirname, '..', '..', '..', 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json');
const plan: LessonPlan = parseLessonPlan(JSON.parse(readFileSync(PLAN_PATH, 'utf8')));

function ctx(segId: string, over: Partial<AllowedNextContext> & { state?: Partial<TypedTurnState> } = {}): AllowedNextContext {
  const { state, ...rest } = over;
  return {
    plan, segId, levelKnown: false, state: { ...createTypedTurnState(), ...(state ?? {}) },
    budgetDue: false, lastPart: false, studentMovedOn: false, menuPick: null,
    studentAnswerCount: 0, nudge: false, items: [], lessonElapsedMs: 0, ...rest,
  };
}
const sorted = (a: string[]) => [...a].sort();
const ask = (kind: TypedTurnState['openAsk']['kind'], text = 'x'): Partial<TypedTurnState> => ({ openAsk: { kind, text } });

test('typedPartKind for the 8 GDI segments', () => {
  const want: Record<string, string> = {
    overview: 'plain', 'level-check': 'level_check', 'topic-intro': 'bridge', 'present-perfect': 'offer_part',
    'past-simple': 'offer_part', 'open-conversation': 'conversation', pronunciation: 'pronunciation', summary: 'recap',
  };
  for (const [id, k] of Object.entries(want)) assert.equal(typedPartKind(plan, id, false), k, id);
});

test('level check: question/retry, then move at the third answer', () => {
  assert.deepEqual(sorted(allowedNextFor(ctx('level-check', { state: ask('question'), studentAnswerCount: 0 }))), ['question', 'retry']);
  assert.deepEqual(allowedNextFor(ctx('level-check', { state: ask('question'), studentAnswerCount: 3 })), ['move']);
});

test('level known: topic-intro is ordinary and the line says level_known="yes"', () => {
  const c = ctx('topic-intro', { levelKnown: true, state: ask('question') });
  assert.deepEqual(sorted(allowedNextFor(c)), ['question', 'retry']);
  assert.ok(turnStateLine(c).includes('level_known="yes"'));
});

test('offer part walk', () => {
  assert.deepEqual(allowedNextFor(ctx('present-perfect', { budgetDue: true })), ['offer']);
  const made = { 'present-perfect': { made: true, accepted: false, served: false } };
  assert.deepEqual(allowedNextFor(ctx('present-perfect', { budgetDue: true, state: { ...ask('offer'), offerState: made } })), ['move', 'question']);
  const acc = { 'present-perfect': { made: true, accepted: true, served: false } };
  assert.deepEqual(allowedNextFor(ctx('present-perfect', { state: { offerState: acc } })), ['question']);
  const served = { 'present-perfect': { made: true, accepted: true, served: true } };
  assert.deepEqual(allowedNextFor(ctx('present-perfect', { budgetDue: true, state: { offerState: served } })), ['move']);
});

test('retry chain', () => {
  assert.ok(allowedNextFor(ctx('open-conversation', { state: { ...ask('retry'), retriesInARow: 0 } })).includes('retry'));
  assert.ok(!allowedNextFor(ctx('open-conversation', { state: { ...ask('retry'), retriesInARow: 2 } })).includes('retry'));
  assert.ok(allowedNextFor(ctx('open-conversation', { budgetDue: true, state: { ...ask('retry'), retriesInARow: 2 } })).includes('move'));
  assert.ok(!allowedNextFor(ctx('open-conversation', { state: { ...ask('retry'), retriesInARow: 0 } })).includes('move'));
});

test('menu / pronunciation', () => {
  const ms = (asked: number, picked: string | null) => ({ menuState: { pronunciation: { asked, picked } } });
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { state: ms(0, null) })), ['menu']);
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { state: ms(2, null) })), ['move']);
  const items = ['a', 'b'];
  const some = allowedNextFor(ctx('pronunciation', { items, state: { ...ms(1, '2'), ...ask('item'), practisedItems: { pronunciation: ['a'] } } }));
  assert.deepEqual(sorted(some), ['item', 'move', 'offer', 'retry']);
  assert.ok(!allowedNextFor(ctx('pronunciation', { items, state: { ...ms(1, '2'), ...ask('none'), practisedItems: { pronunciation: ['a'] } } })).includes('retry'));
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items, state: { ...ms(1, '2'), practisedItems: { pronunciation: ['a', 'b'] } } })), ['offer', 'move']);
  for (const k of ['question', 'offer', 'menu', 'retry'] as const) {
    assert.deepEqual(allowedNextFor(ctx('pronunciation', { items, state: { ...ms(1, '2'), ...ask(k), practisedItems: { pronunciation: ['a'] } } })), ['item', 'offer', 'move'], k);
  }
  assert.ok(allowedNextFor(ctx('pronunciation', { items, state: { ...ms(1, '2'), ...ask('item') } })).includes('retry'));

  assert.ok(allowedNextFor(ctx('pronunciation', { items, menuPick: '2' })).includes('item'));
});

test('student moved on', () => {
  assert.deepEqual(allowedNextFor(ctx('past-simple', { studentMovedOn: true })), ['move']);
  assert.deepEqual(allowedNextFor(ctx('summary', { studentMovedOn: true, lastPart: true })), ['close']);
});

test('nudge', () => {
  assert.deepEqual(allowedNextFor(ctx('past-simple', { nudge: true, state: ask('question') })), ['question', 'wait']);
  assert.deepEqual(allowedNextFor(ctx('past-simple', { nudge: true })), ['question', 'wait']);
});

test('recap order (V3: question on the first recap turn, then close only)', () => {
  assert.deepEqual(allowedNextFor(ctx('summary')), ['question']);
  assert.deepEqual(allowedNextFor(ctx('summary', { state: { ...ask('question'), turnsInPart: { summary: 0 } } })), ['question']);
  assert.deepEqual(allowedNextFor(ctx('summary', { state: { ...ask('question'), turnsInPart: { summary: 1 } } })), ['close']);
  assert.deepEqual(allowedNextFor(ctx('summary', { state: { ...ask('question'), turnsInPart: { summary: 3 } } })), ['close']);
});
test('V3: turnStateLine recap_step + required_phrases on the summary', () => {
  const t0 = turnStateLine(ctx('summary', { state: ask('question') }));
  assert.ok(t0.includes('recap_step="review_feedback_check"'), t0);
  assert.ok(t0.includes('required_phrases="one thing you did well|the difference between"'), t0);
  const t1 = turnStateLine(ctx('summary', { state: { ...ask('question'), turnsInPart: { summary: 1 } } }));
  assert.ok(t1.includes('recap_step="close"'), t1);
  assert.ok(!t1.includes('required_phrases'), t1);
  const pp = turnStateLine(ctx('present-perfect'));
  assert.ok(!pp.includes('recap_step') && !pp.includes('required_phrases'), pp);
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('`recap_step=review_feedback_check`') && TYPED_TURN_INSTRUCTIONS.includes('`recap_step=close`'));
});

test('budget due', () => {
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true })), ['move']);
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true, lastPart: true })), ['close']);
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true, state: ask('question') })), ['question', 'move']);
});

test('every state in a grid yields a non-empty set', () => {
  const kinds = ['none', 'retry', 'question', 'offer', 'menu', 'item'] as const;
  const bools = [false, true];
  let n = 0;
  for (const p of plan.segments) for (const k of kinds) for (const b of bools) for (const m of bools) for (const nu of bools)
    for (const last of bools) for (const picked of [null, 'x']) for (const asked of [0, 2]) for (const ans of [0, 3]) for (const rr of [0, 2])
      for (const o of [{ made: false, accepted: false, served: false }, { made: true, accepted: false, served: false }, { made: true, accepted: true, served: false }, { made: true, accepted: true, served: true }])
        for (const its of [[], ['a']]) {
          const c = ctx(p.id, {
            budgetDue: b, studentMovedOn: m, nudge: nu, lastPart: last, studentAnswerCount: ans, items: its,
            state: { ...ask(k), retriesInARow: rr, offerState: { [p.id]: o }, menuState: { [p.id]: { asked, picked } } },
          });
          const r = allowedNextFor(c); n++;
          assert.ok(r.length > 0, JSON.stringify({ p: p.id, k, b, m, nu, last, picked, asked, ans, rr, o, its }));
        }
  assert.ok(n > 1000);
});

test('turnStateLine escaping, items_left, turn n/max', () => {
  const c = ctx('present-perfect', {
    items: ['a', 'b', 'c'],
    state: { openAsk: { kind: 'question', text: 'Say "hi" <b>' }, turnsInPart: { 'present-perfect': 3 }, practisedItems: { 'present-perfect': ['b'] } },
  });
  const line = turnStateLine(c);
  assert.ok(line.includes('open_ask_text="Say &quot;hi&quot; &lt;b&gt;"'), line);
  assert.ok(line.includes('items_left="a|c"') && line.includes('items_practised="b"'), line);
  assert.ok(line.includes('turn="3/8"'), line);
  assert.ok(line.startsWith('<turn_state ') && line.endsWith('/>'));
});

test('turnStateLine next_part / next_card on a move turn only (F1)', () => {
  const pp = turnStateLine(ctx('present-perfect', { budgetDue: true }));
  assert.ok(pp.includes('next_part="Past simple"'), pp);
  assert.ok(/next_card="[^"]*Did you attend/.test(pp), pp);
  const oc = turnStateLine(ctx('open-conversation', { studentMovedOn: true }));
  assert.ok(oc.includes('next_part="Pronunciation"'), oc);
  assert.ok(/next_card="[^"]*1\) individual words/.test(oc), oc);
  const sm = turnStateLine(ctx('summary', { studentMovedOn: true, lastPart: true }));
  assert.ok(sm.includes('next_part="(end)"'), sm);
  const plain = turnStateLine(ctx('present-perfect'));
  assert.ok(!plain.includes('next_part') && !plain.includes('next_card'), plain);
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('next_card') && TYPED_TURN_INSTRUCTIONS.includes('next_part'));
});

test('G2: turnStateLine lists answered card questions (escaped, cut, max 4); absent when empty', () => {
  const none = turnStateLine(ctx('present-perfect'));
  assert.ok(!none.includes('answered='), none);
  const two = turnStateLine(ctx('present-perfect', { state: { answeredCards: { 'present-perfect': ['What is one project <you> are proud of?', 'Have you "ever" travelled?'] } } }));
  assert.ok(two.includes('answered="What is one project &lt;you&gt; are proud of?|Have you &quot;ever&quot; travelled?"'), two);
  const many = turnStateLine(ctx('present-perfect', { state: { answeredCards: { 'present-perfect': ['q1', 'q2', 'q3', 'q4', 'q5', 'x'.repeat(200)] } } }));
  assert.ok(many.includes('answered="q1|q2|q3|q4"'), many);
  const long = turnStateLine(ctx('present-perfect', { state: { answeredCards: { 'present-perfect': ['x'.repeat(200)] } } }));
  assert.ok(long.includes(`answered="${'x'.repeat(120)}"`), long);
});

test('typedTurnRequestFor', () => {
  const r = typedTurnRequestFor(ctx('summary', { nudge: true }));
  assert.equal(r.recap, true);
  assert.equal(r.nudge, true);
  assert.deepEqual(r.allowedNext, ['question', 'wait']);
  assert.ok(r.state.startsWith('<turn_state'));
});

test('instructions define turn_state and nudge', () => {
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('turn_state') && TYPED_TURN_INSTRUCTIONS.includes('nudge'));
});

// ---- Task 4: field effects, reducer, engine lines ----
const ITEMS = [
  'I have worked with international customers for several years.',
  'I was responsible for communicating with our customers.',
];
function fctx(segId: string, over: Partial<FieldEffectContext> & { state?: Partial<TypedTurnState> } = {}): FieldEffectContext {
  const { state, ...rest } = over;
  return {
    plan, segId, levelKnown: false, state: { ...createTypedTurnState(), ...(state ?? {}) }, studentLast: '',
    cardStatement: getSegmentTruth(plan.segments.find((s) => s.id === segId), plan.id)?.problemText ?? null,
    items: [], menuPick: null, budgetDue: false, ...rest,
  };
}
const nx = (over: Partial<TypedNext>): TypedNext => ({ kind: 'question', say: 'Say.', item: '', level: '', ...over });
const nextEv = (over: Partial<TypedNext>) => ({ field: 'next' as const, value: nx(over) });
const kinds = (e: { kind: string }[]) => e.map((x) => x.kind);

test('applyField records verdict; V1: board with verdict correct -> one model_card with the brain\'s sentence', () => {
  const s0 = createTypedTurnState();
  const s1 = applyField(s0, { field: 'verdict', value: 'correct' });
  assert.equal(s1.pendingVerdict, 'correct');
  assert.equal(s0.pendingVerdict, null);
  const e = effectsForField({ field: 'board', value: ' I sell washing machines to customers. ' }, fctx('present-perfect', { state: s1, studentLast: 'um I sell washing machine to customer' }));
  assert.deepEqual(e, [{ kind: 'model_card', sentence: 'I sell washing machines to customers.' }]);
});
test('V1: no model_card for an empty board, a non-correct verdict, or verdict_say alone (the raw transcript is never boarded)', () => {
  const ok = applyField(createTypedTurnState(), { field: 'verdict', value: 'correct' });
  assert.deepEqual(effectsForField({ field: 'board', value: '' }, fctx('present-perfect', { state: ok, studentLast: 'I have worked here for five years' })), []);
  assert.deepEqual(effectsForField({ field: 'board', value: '   ' }, fctx('present-perfect', { state: ok })), []);
  assert.deepEqual(effectsForField({ field: 'verdict_say', value: 'Good.' }, fctx('present-perfect', { state: ok, studentLast: 'I have worked here for five years' })), []);
  const partly = applyField(createTypedTurnState(), { field: 'verdict', value: 'partly_correct' });
  assert.deepEqual(effectsForField({ field: 'board', value: 'I have worked here for five years.' }, fctx('present-perfect', { state: partly })), []);
  const none = applyField(createTypedTurnState(), { field: 'verdict', value: 'none' });
  assert.deepEqual(effectsForField({ field: 'board', value: 'I have worked here for five years.' }, fctx('present-perfect', { state: none })), []);
});
test('correction -> correction_card', () => {
  const e = effectsForField({ field: 'correction', value: { student: 'I make presentation', corrected: 'I make presentations.', emphasis: ['presentations'], explain: 'x' } }, fctx('present-perfect'));
  assert.deepEqual(e, [{ kind: 'correction_card', student: 'I make presentation', corrected: 'I make presentations.', emphasis: ['presentations'] }]);
  assert.deepEqual(effectsForField({ field: 'correction', value: null }, fctx('present-perfect')), []);
});
test('next move: advance, bridgeMissing, close from last', () => {
  const a = effectsForField(nextEv({ kind: 'move', say: 'Let us go. Did you attend events?' }), fctx('present-perfect'));
  assert.deepEqual(a[0], { kind: 'advance', from: 'present-perfect', to: 'past-simple', bridgeMissing: false });
  const b = effectsForField(nextEv({ kind: 'move', say: "Let's practise the present perfect. Have you worked here long?" }), fctx('topic-intro'));
  assert.equal((b[0] as { bridgeMissing: boolean }).bridgeMissing, true);
  const c = effectsForField(nextEv({ kind: 'move', say: 'You told me you work in sales. Have you worked here long?' }), fctx('topic-intro'));
  assert.equal((c[0] as { bridgeMissing: boolean }).bridgeMissing, false);
  const d = effectsForField(nextEv({ kind: 'move', say: 'Bye.' }), fctx('summary'));
  assert.deepEqual(kinds(d), ['close']);
});
test('next item: arm, substitute, exhausted', () => {
  const it = ITEMS[1];
  const e1 = effectsForField(nextEv({ kind: 'item', say: 'Say it.', item: it }), fctx('pronunciation', { items: ITEMS }));
  assert.deepEqual(e1[0], { kind: 'arm_item', text: it });
  const prac = { practisedItems: { pronunciation: [it] } };
  const e2 = effectsForField(nextEv({ kind: 'item', say: 'Say it.', item: it }), fctx('pronunciation', { items: ITEMS, state: prac }));
  assert.deepEqual(e2[0], { kind: 'arm_item', text: ITEMS[0] });
  const e3 = effectsForField(nextEv({ kind: 'item', say: 'Say it.', item: 'bogus' }), fctx('pronunciation', { items: ITEMS }));
  assert.deepEqual(e3[0], { kind: 'arm_item', text: ITEMS[0] });
  const all = { practisedItems: { pronunciation: [...ITEMS] } };
  const e4 = effectsForField(nextEv({ kind: 'item', say: 'Say it.', item: it }), fctx('pronunciation', { items: ITEMS, state: all }));
  assert.deepEqual(kinds(e4), ['open_ask']);
  assert.equal((e4[0] as { ask: { kind: string } }).ask.kind, 'item');
});
test('level move order and other kinds', () => {
  const e = effectsForField(nextEv({ kind: 'move', say: 'Next. Did you attend events?', level: 'intermediate' }), fctx('level-check'));
  assert.deepEqual(kinds(e), ['set_level', 'advance', 'open_ask']);
  assert.deepEqual(kinds(effectsForField(nextEv({ kind: 'menu', say: 'Pick one.' }), fctx('pronunciation'))), ['menu_asked', 'open_ask']);
  assert.deepEqual(kinds(effectsForField(nextEv({ kind: 'offer', say: 'More?' }), fctx('present-perfect'))), ['offer_made', 'open_ask']);
  const acc = { offerState: { 'present-perfect': { made: true, accepted: true, served: false } } };
  assert.deepEqual(kinds(effectsForField(nextEv({ kind: 'question' }), fctx('present-perfect', { state: acc }))), ['offer_served', 'open_ask']);
  assert.deepEqual(kinds(effectsForField(nextEv({ kind: 'close', say: 'Bye.' }), fctx('summary'))), ['close']);
  assert.deepEqual(effectsForField(nextEv({ kind: 'wait', say: '...' }), fctx('present-perfect')), []);
});
test('open_ask cardQuestion by word overlap (question and move)', () => {
  const card = 'Have you worked for your current company for a long time?';
  const q = effectsForField(nextEv({ kind: 'question', say: 'Have you worked for your current company long?' }), fctx('present-perfect'));
  assert.equal((q[0] as { ask: { cardQuestion?: string } }).ask.cardQuestion, card);
  const q2 = effectsForField(nextEv({ kind: 'question', say: 'What is your favourite food?' }), fctx('present-perfect'));
  assert.equal((q2[0] as { ask: { cardQuestion?: string } }).ask.cardQuestion, undefined);
  const m = effectsForField(nextEv({ kind: 'move', say: 'Did you attend any business events last year?' }), fctx('present-perfect'));
  const ask = m[1] as { ask: { cardQuestion?: string } };
  assert.equal(ask.ask.cardQuestion, 'Did you attend any business events or exhibitions last year?');
  assert.equal(sharesCardWords('Hello there friend', card), false);
  assert.equal(sharesCardWords('Have you worked at the company for a long time?', card), true);
});

const turnOf = (over: Partial<TypedTurn> & { next?: Partial<TypedNext> }): TypedTurn => ({
  ack: '', verdict: 'none', verdict_say: '', correction: null, support_ja: '', ...over, next: nx(over.next ?? {}),
});
test('applyTypedTurn: move resets, openAsk, pendingVerdict cleared', () => {
  const st = { ...createTypedTurnState(), pendingVerdict: 'correct' as const, turnsInPart: { 'present-perfect': 3, 'past-simple': 5 } };
  const out = applyTypedTurn(st, turnOf({ next: { kind: 'move', say: 'Did you attend events?' } }), fctx('present-perfect', { state: st }), { from: 'present-perfect', to: 'past-simple' });
  assert.equal(out.turnsInPart['past-simple'], 0);
  assert.equal(out.turnsInPart['present-perfect'], 3);
  assert.equal(out.openAsk.kind, 'question');
  assert.equal(out.openAsk.text, 'Did you attend events?');
  assert.equal(out.pendingVerdict, null);
  const out2 = applyTypedTurn(st, turnOf({}), fctx('present-perfect', { state: st }), null);
  assert.equal(out2.turnsInPart['present-perfect'], 4);
});
test('applyTypedTurn: item, retry, menu, offer, served, answeredCards', () => {
  const seg = 'pronunciation';
  const it = applyTypedTurn(createTypedTurnState(), turnOf({ next: { kind: 'item', item: ITEMS[0] } }), fctx(seg, { items: ITEMS }), null);
  assert.deepEqual(it.practisedItems[seg], [ITEMS[0]]);
  assert.equal(it.openAsk.kind, 'item');
  const r1 = applyTypedTurn(createTypedTurnState(), turnOf({ next: { kind: 'retry', say: 'Again.' } }), fctx('present-perfect'), null);
  assert.equal(r1.retriesInARow, 1);
  const r2 = applyTypedTurn(r1, turnOf({ next: { kind: 'retry', say: 'Again.' } }), fctx('present-perfect', { state: r1 }), null);
  assert.equal(r2.retriesInARow, 2);
  const r3 = applyTypedTurn(r2, turnOf({}), fctx('present-perfect', { state: r2 }), null);
  assert.equal(r3.retriesInARow, 0);
  const m = applyTypedTurn(createTypedTurnState(), turnOf({ next: { kind: 'menu', say: 'Pick.' } }), fctx(seg), null);
  assert.equal(m.menuState[seg].asked, 1);
  const o = applyTypedTurn(createTypedTurnState(), turnOf({ next: { kind: 'offer', say: 'More?' } }), fctx('present-perfect'), null);
  assert.equal(o.offerState['present-perfect'].made, true);
  const acc = { ...createTypedTurnState(), offerState: { 'present-perfect': { made: true, accepted: true, served: false } } };
  const sv = applyTypedTurn(acc, turnOf({ next: { kind: 'question' } }), fctx('present-perfect', { state: acc }), null);
  assert.equal(sv.offerState['present-perfect'].served, true);
  const asked = { ...createTypedTurnState(), openAsk: { kind: 'question' as const, text: 'Q?', cardQuestion: 'CARD Q' } };
  const ac = applyTypedTurn(asked, turnOf({ verdict: 'correct', next: { kind: 'question', say: 'Another?' } }), fctx('present-perfect', { state: asked }), null);
  assert.deepEqual(ac.answeredCards['present-perfect'], ['CARD Q']);
});
test('applyTypedTurn: move from the last part closes (no open ask)', () => {
  const st = { ...createTypedTurnState(), openAsk: { kind: 'question' as const, text: 'Q?' } };
  const out = applyTypedTurn(st, turnOf({ next: { kind: 'move', say: 'Bye.' } }), fctx('summary', { state: st }), null);
  assert.equal(out.openAsk.kind, 'none');
});
test('applyTypedTurn: move credits the answered card to the FROM part', () => {
  const st = { ...createTypedTurnState(), openAsk: { kind: 'question' as const, text: 'Q?', cardQuestion: 'CARD Q' } };
  const out = applyTypedTurn(st, turnOf({ verdict: 'correct', next: { kind: 'move', say: 'Did you attend events?' } }),
    fctx('present-perfect', { state: st }), { from: 'present-perfect', to: 'past-simple' });
  assert.deepEqual(out.answeredCards['present-perfect'], ['CARD Q']);
  assert.equal(out.answeredCards['past-simple'], undefined);
});
test('engineLineFor', () => {
  const base = { ...fctx('present-perfect'), japanese: false };
  assert.equal(engineLineFor('offer', base), fixedScriptEngineOfferLines(plan, 'present-perfect', 'past-simple', { japanese: false }).join(' '));
  const ja = engineLineFor('offer', { ...base, japanese: true })!;
  assert.ok(ja.includes('「'));
  assert.equal(engineLineFor('question', base), cardAskLine(base.cardStatement));
  assert.equal(engineLineFor('wait', base), null);
  assert.equal(engineLineFor('close', base), null);
  const pr = { ...fctx('pronunciation', { items: ITEMS, state: { practisedItems: { pronunciation: [ITEMS[0]] } } }), japanese: false };
  assert.equal(engineLineFor('item', pr), ITEMS[1]);
  assert.equal(nextItemFor(pr), ITEMS[1]);
  const retry = { ...fctx('present-perfect', { state: { openAsk: { kind: 'retry' as const, text: 'Say it again.' } } }), japanese: false };
  assert.equal(engineLineFor('retry', retry), 'Say it again.');
  const mv = { ...fctx('past-simple'), japanese: false };
  assert.equal(engineLineFor('move', mv), cardAskLine(mv.cardStatement));
});
test('sayWithinBudget', () => {
  assert.equal(sayWithinBudget(nx({ say: 'A. B. C. D.' }), false), false);
  assert.equal(sayWithinBudget(nx({ say: 'A. B. C. D.' }), true), true);
  assert.equal(sayWithinBudget(nx({ say: 'A. B. C.' }), false), true);
  // G3: a menu may run to 5 English sentences (4 choices + lead); a question may not
  assert.equal(sayWithinBudget(nx({ kind: 'menu', say: 'Pick one. Words. Sentence. Naturally.' }), false), true);
  assert.equal(sayWithinBudget(nx({ kind: 'question', say: 'Pick one. Words. Sentence. Naturally.' }), false), false);
  assert.equal(sayWithinBudget(nx({ kind: 'menu', say: 'A. B. C. D. E. F.' }), false), false);
  // F2: Japanese sentences do not count against the budget
  assert.equal(sayWithinBudget(nx({ say: 'Good. では次です。 Let us move. 発音です。 Ready?' }), false), true);
  assert.equal(sayWithinBudget(nx({ say: 'A. B. C. D.' }), false), false);
});

test('H1: a resolved menu pick persists, so the menu is never re-asked after an item', () => {
  const sentences = ((plan.segments.find((s) => s.id === 'pronunciation')?.metadata as { pronunciation: { sentences: string[] } }).pronunciation.sentences);
  assert.equal(sentences.length, 2);
  const pick = 'a complete sentence';
  const a1 = allowedNextFor(ctx('pronunciation', { items: sentences, menuPick: pick }));
  assert.ok(a1.includes('item') && !a1.includes('menu'));
  const turn = { ack: '', verdict: 'none' as const, verdict_say: '', correction: null, support_ja: '', next: { kind: 'item' as const, say: '', item: sentences[0], level: '' } };
  const s1 = applyTypedTurn(createTypedTurnState(), turn, fctx('pronunciation', { items: sentences, menuPick: pick }), null);
  assert.equal(s1.menuState.pronunciation.picked, pick);
  const c2 = ctx('pronunciation', { items: sentences, menuPick: null, state: s1 });
  const a2 = allowedNextFor(c2);
  assert.ok(!a2.includes('menu') && a2.includes('item'));
  assert.ok(turnStateLine(c2).includes('menu_picked="a complete sentence"'));
  const s2 = applyTypedTurn(s1, { ...turn, next: { ...turn.next, item: sentences[1] } }, fctx('pronunciation', { items: sentences, state: s1 }), null);
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items: sentences, state: s2 })), ['offer', 'move']);
  // no pick this turn -> picked stays null
  const s3 = applyTypedTurn(createTypedTurnState(), { ...turn, next: { kind: 'menu', say: 'x', item: '', level: '' } }, fctx('pronunciation', { items: sentences }), null);
  assert.equal(s3.menuState.pronunciation.picked, null);
});

test('H2: a partly_correct answer fills answeredCards like a correct one; none and incorrect do not', () => {
  const st = { ...createTypedTurnState(), openAsk: { kind: 'question' as const, text: 'x', cardQuestion: 'Can you tell me a little about your job?' } };
  const mk = (verdict: 'correct' | 'partly_correct' | 'incorrect' | 'none') => applyTypedTurn(st, { ack: '', verdict, verdict_say: '', correction: null, support_ja: '', next: { kind: 'question', say: 'Next?', item: '', level: '' } }, fctx('present-perfect', { state: st }), null);
  assert.deepEqual(mk('correct').answeredCards['present-perfect'], ['Can you tell me a little about your job?']);
  assert.deepEqual(mk('partly_correct').answeredCards['present-perfect'], ['Can you tell me a little about your job?']);
  assert.equal(mk('incorrect').answeredCards['present-perfect'], undefined);
  assert.equal(mk('none').answeredCards['present-perfect'], undefined);
});

// ---- Final fix wave W1: the post-due turn cap on the typed path ----
test('W1: open-conversation, open question, budget due — post-due 0/1 hold, 2 forces the move', () => {
  const pd = (n: number) => ({ ...ask('question'), postDueTurns: { 'open-conversation': n } });
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true, state: pd(0) })), ['question', 'move']);
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true, state: pd(1) })), ['question', 'move']);
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true, state: pd(2) })), ['move']);
  // an open retry ask is capped too
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true, state: { ...pd(2), openAsk: { kind: 'retry', text: 'x' } } })), ['move']);
  // not due: the counter is ignored
  assert.deepEqual(sorted(allowedNextFor(ctx('open-conversation', { state: pd(5) }))), ['question', 'retry']);
});
test('W1: the last part (summary) capped -> close; an offer part with the offer not made -> offer', () => {
  assert.deepEqual(allowedNextFor(ctx('summary', { budgetDue: true, lastPart: true, state: { ...ask('question'), postDueTurns: { summary: 2 } } })), ['close']);
  assert.deepEqual(allowedNextFor(ctx('present-perfect', { budgetDue: true, state: { ...ask('question'), postDueTurns: { 'present-perfect': 2 } } })), ['offer']);
});
test('W1: past the lesson-time guard point (deadline) -> move even with no hold spent', () => {
  const late = 60 * 60 * 1000;
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true, lessonElapsedMs: late, state: ask('question') })), ['move']);
});
test('W1: turnStateLine post_due / last_turn', () => {
  const pd = (n: number) => ({ ...ask('question'), postDueTurns: { 'open-conversation': n } });
  const two = turnStateLine(ctx('open-conversation', { budgetDue: true, state: pd(2) }));
  assert.ok(two.includes('post_due="2"') && two.includes('last_turn="yes"'), two);
  const one = turnStateLine(ctx('open-conversation', { budgetDue: true, state: pd(1) }));
  assert.ok(one.includes('post_due="1"') && one.includes('last_turn="yes"'), one);
  const zero = turnStateLine(ctx('open-conversation', { budgetDue: true, state: pd(0) }));
  assert.ok(zero.includes('post_due="0"') && !zero.includes('last_turn='), zero);
  const notDue = turnStateLine(ctx('open-conversation', { state: pd(0) }));
  assert.ok(!notDue.includes('post_due=') && !notDue.includes('last_turn='), notDue);
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('post_due') && TYPED_TURN_INSTRUCTIONS.includes('last_turn'));
});
test('W1: applyTypedTurn counts post-due turns in the answered part; a move resets the new part', () => {
  const t = { ack: '', verdict: 'none' as const, verdict_say: '', correction: null, support_ja: '', next: { kind: 'question' as const, say: 'Next?', item: '', level: '' as const } };
  const s1 = applyTypedTurn(createTypedTurnState(), t, fctx('open-conversation', { budgetDue: true }), null);
  assert.equal(s1.postDueTurns['open-conversation'], 1);
  const s2 = applyTypedTurn(s1, t, fctx('open-conversation', { budgetDue: true, state: s1 }), null);
  assert.equal(s2.postDueTurns['open-conversation'], 2);
  const s3 = applyTypedTurn(s2, t, fctx('open-conversation', { budgetDue: false, state: s2 }), null);
  assert.equal(s3.postDueTurns['open-conversation'], 2, 'not due: unchanged');
  const mv = { ...t, next: { kind: 'move' as const, say: 'On.', item: '', level: '' as const } };
  const s4 = applyTypedTurn({ ...s2, postDueTurns: { ...s2.postDueTurns, pronunciation: 3 } }, mv, fctx('open-conversation', { budgetDue: true, state: s2 }), { from: 'open-conversation', to: 'pronunciation' });
  assert.equal(s4.postDueTurns.pronunciation, 0);
  assert.equal(createTypedTurnState().postDueTurns && Object.keys(createTypedTurnState().postDueTurns).length, 0);
});

// ---- Final fix wave W2: engine-side pre-turn moves ----
test('W2: enterPartState clears the old part\'s open ask and correction; pure', () => {
  const st = { ...createTypedTurnState(), openAsk: { kind: 'retry' as const, text: 'Say it again.' }, correctionOpen: { student: 'a', corrected: 'b' }, retriesInARow: 2,
    turnsInPart: { 'past-simple': 4 }, postDueTurns: { 'past-simple': 1 } };
  const e = enterPartState(st, 'past-simple');
  assert.deepEqual(e.openAsk, { kind: 'none', text: '' });
  assert.equal(e.correctionOpen, null);
  assert.equal(e.retriesInARow, 0);
  assert.equal(e.turnsInPart['past-simple'], 0);
  assert.equal(e.postDueTurns['past-simple'], 0);
  assert.equal(st.openAsk.kind, 'retry', 'input untouched');
});
test('W2: engineMoved — no second move / close; the new part\'s entry row instead', () => {
  const fresh = (seg: string, over: Partial<AllowedNextContext> = {}) => ctx(seg, { engineMoved: true, state: enterPartState(createTypedTurnState(), seg), ...over });
  assert.deepEqual(allowedNextFor(fresh('past-simple')), ['question']);
  assert.deepEqual(allowedNextFor(fresh('pronunciation')), ['menu']);
  // the student asked to move on in the same turn the engine moved: the move already happened
  assert.deepEqual(allowedNextFor(fresh('past-simple', { studentMovedOn: true })), ['question']);
  assert.deepEqual(allowedNextFor(fresh('pronunciation', { studentMovedOn: true })), ['menu']);
  // a due budget with an open ask: move is dropped, the rest stays
  assert.deepEqual(allowedNextFor(fresh('open-conversation', { budgetDue: true, state: ask('question') })), ['question']);
  // the closing part entered by the engine: no close on the entry turn
  assert.ok(!allowedNextFor(fresh('summary', { lastPart: true })).includes('close'));
  // without engineMoved nothing changes
  assert.deepEqual(allowedNextFor(ctx('past-simple', { studentMovedOn: true })), ['move']);
});
test('W2: laterPartLabels feed moveOnRequestSpan as the prose move-on order does', () => {
  const labels = laterPartLabels(plan, 'present-perfect');
  assert.ok(labels.includes('Past simple') && labels.includes('Summary'), labels.join('|'));
  assert.ok(!labels.includes('Conversation'), 'extension parts excluded (as the prose site)');
  assert.ok(!labels.includes('Present perfect'), 'only later parts');
  assert.ok(moveOnRequestSpan('Can we go to past simple?', labels));
  assert.equal(moveOnRequestSpan('Can we go to past simple?'), null, 'without labels the span misses');
});

// ---- Final fix wave W6: the items still to practise go to the server ----
test('W6: itemsLeftFor = items minus practised; items_left and the request carry the same list', () => {
  const c = ctx('pronunciation', { items: ITEMS, state: { practisedItems: { pronunciation: [ITEMS[0]] }, menuState: { pronunciation: { asked: 1, picked: '2' } } } });
  assert.deepEqual(itemsLeftFor(c), [ITEMS[1]]);
  assert.ok(turnStateLine(c).includes(`items_left="${ITEMS[1]}"`));
  assert.deepEqual(typedTurnRequestFor(c).itemsLeft, [ITEMS[1]]);
  assert.equal(typedTurnRequestFor(ctx('past-simple')).itemsLeft, undefined, 'absent on a part without items');
});

// ---- Fix wave 2 V2: the conversation corrections budget ----
test('V2: correctionsInPart counts corrections in the FROM part; a move does not reset it', () => {
  const corr = { student: 'they feel happy and they donate', corrected: 'They felt happy and they donated.', emphasis: ['felt', 'donated'], explain: 'Past.' };
  const t = (correction: typeof corr | null, kind: 'question' | 'move' = 'question') => ({ ack: '', verdict: (correction ? 'partly_correct' : 'correct') as 'partly_correct' | 'correct', verdict_say: 'x', board: '', correction, support_ja: '', next: { kind, say: 'Next?', item: '', level: '' as const } });
  assert.deepEqual(createTypedTurnState().correctionsInPart, {});
  const s1 = applyTypedTurn(createTypedTurnState(), t(corr), fctx('open-conversation'), null);
  assert.equal(s1.correctionsInPart['open-conversation'], 1);
  const s2 = applyTypedTurn(s1, t(null), fctx('open-conversation', { state: s1 }), null);
  assert.equal(s2.correctionsInPart['open-conversation'], 1, 'no correction: unchanged');
  const s3 = applyTypedTurn(s2, t(corr, 'move'), fctx('open-conversation', { state: s2 }), { from: 'open-conversation', to: 'pronunciation' });
  assert.equal(s3.correctionsInPart['open-conversation'], 2, 'counted in the part it was given in');
  assert.equal(s3.correctionsInPart.pronunciation, undefined);
});
test('V2: turnStateLine corrections_left on conversation parts only (2 − used, floor 0)', () => {
  const oc = turnStateLine(ctx('open-conversation', { state: ask('question') }));
  assert.ok(oc.includes('corrections_left="2"'), oc);
  assert.ok(turnStateLine(ctx('open-conversation', { state: { ...ask('question'), correctionsInPart: { 'open-conversation': 1 } } })).includes('corrections_left="1"'));
  assert.ok(turnStateLine(ctx('open-conversation', { state: { ...ask('question'), correctionsInPart: { 'open-conversation': 5 } } })).includes('corrections_left="0"'));
  const pp = turnStateLine(ctx('present-perfect', { state: ask('question') }));
  assert.ok(!pp.includes('corrections_left'), pp);
  assert.ok(!turnStateLine(ctx('level-check')).includes('corrections_left'));
  // advisory only: a third correction is not refused by the allowed set
  assert.deepEqual(sorted(allowedNextFor(ctx('open-conversation', { state: { ...ask('question'), correctionsInPart: { 'open-conversation': 2 } } }))), ['question', 'retry']);
});

// ---- Fix wave 2 V4: the level check counts answers, not turns ----
test('V4: answersInPart counts non-none verdicts in the FROM part; a move resets the new part', () => {
  const t = (verdict: 'none' | 'correct', kind: 'question' | 'move' = 'question') => ({ ack: '', verdict, verdict_say: '', board: '', correction: null, support_ja: '', next: { kind, say: 'Next?', item: '', level: '' as const } });
  assert.deepEqual(createTypedTurnState().answersInPart, {});
  const s1 = applyTypedTurn(createTypedTurnState(), t('none'), fctx('level-check'), null);
  const s2 = applyTypedTurn(s1, t('correct'), fctx('level-check', { state: s1 }), null);
  const s3 = applyTypedTurn(s2, t('correct'), fctx('level-check', { state: s2 }), null);
  assert.equal(s3.answersInPart['level-check'], 2);
  assert.equal(s3.turnsInPart['level-check'], 3, 'turns still count every turn');
  const s4 = applyTypedTurn({ ...s3, answersInPart: { ...s3.answersInPart, 'topic-intro': 4 } }, t('correct', 'move'), fctx('level-check', { state: s3 }), { from: 'level-check', to: 'topic-intro' });
  assert.equal(s4.answersInPart['level-check'], 3);
  assert.equal(s4.answersInPart['topic-intro'], 0);
  assert.equal(enterPartState({ ...s3, answersInPart: { 'past-simple': 2 } }, 'past-simple').answersInPart['past-simple'], 0);
});
test('V4: level check with studentAnswerCount 2 → question/retry; 3 → move', () => {
  assert.deepEqual(sorted(allowedNextFor(ctx('level-check', { state: ask('question'), studentAnswerCount: 2 }))), ['question', 'retry']);
  assert.deepEqual(allowedNextFor(ctx('level-check', { state: ask('question'), studentAnswerCount: 3 })), ['move']);
});

if (failed) { console.log(`\n${failed} FAILED`); process.exit(1); }
console.log('\nall ok');
