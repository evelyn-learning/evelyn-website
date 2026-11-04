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
  allowedNextFor, createTypedTurnState, turnStateLine, typedPartKind, typedTurnRequestFor,
  type AllowedNextContext, type TypedTurnState,
} from '../src/lib/tutor/lesson-plan/typed-turn-rules';
import { TYPED_TURN_INSTRUCTIONS } from '../src/lib/tutor/voice/typed-turn';

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

if (failed) { console.log(`\n${failed} FAILED`); process.exit(1); }
console.log('\nall ok');
