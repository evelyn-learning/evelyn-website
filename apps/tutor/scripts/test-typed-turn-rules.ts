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
  sayWithinBudget, sharesCardWords, type FieldEffectContext, turnStateLine, typedPartKind, typedTurnRequestFor,
  type AllowedNextContext, type TypedTurnState,
} from '../src/lib/tutor/lesson-plan/typed-turn-rules';
import { TYPED_TURN_INSTRUCTIONS, type TypedNext, type TypedTurn } from '../src/lib/tutor/voice/typed-turn';
import { cardAskLine } from '../src/lib/tutor/lesson-plan/transition-ask';
import { fixedScriptEngineOfferLines } from '../src/lib/tutor/lesson-plan/fixed-script';
import { getSegmentTruth } from '../src/lib/tutor/lesson-plan/context';

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
    studentAnswerCount: 0, nudge: false, items: [], ...rest,
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

test('recap order', () => {
  assert.deepEqual(allowedNextFor(ctx('summary')), ['question', 'close']);
  assert.deepEqual(allowedNextFor(ctx('summary', { state: { turnsInPart: { summary: 1 } } })), ['close', 'question']);
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
    items: [], ...rest,
  };
}
const nx = (over: Partial<TypedNext>): TypedNext => ({ kind: 'question', say: 'Say.', item: '', level: '', ...over });
const nextEv = (over: Partial<TypedNext>) => ({ field: 'next' as const, value: nx(over) });
const kinds = (e: { kind: string }[]) => e.map((x) => x.kind);

test('applyField records verdict; verdict_say with correct + cardable sentence -> model_card', () => {
  const s0 = createTypedTurnState();
  const s1 = applyField(s0, { field: 'verdict', value: 'correct' });
  assert.equal(s1.pendingVerdict, 'correct');
  assert.equal(s0.pendingVerdict, null);
  const e = effectsForField({ field: 'verdict_say', value: 'Good.' }, fctx('present-perfect', { state: s1, studentLast: 'yes, I have worked here for five years' }));
  assert.equal(e.length, 1);
  assert.equal(e[0].kind, 'model_card');
  assert.ok((e[0] as { sentence: string }).sentence.includes('I have worked here for five years'));
});
test('no model_card for verdict none or a bare yes', () => {
  const none = applyField(createTypedTurnState(), { field: 'verdict', value: 'none' });
  assert.deepEqual(effectsForField({ field: 'verdict_say', value: '' }, fctx('present-perfect', { state: none, studentLast: 'I have worked here for five years' })), []);
  const ok = applyField(createTypedTurnState(), { field: 'verdict', value: 'correct' });
  assert.deepEqual(effectsForField({ field: 'verdict_say', value: 'Good.' }, fctx('present-perfect', { state: ok, studentLast: 'yes' })), []);
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
});

if (failed) { console.log(`\n${failed} FAILED`); process.exit(1); }
console.log('\nall ok');
