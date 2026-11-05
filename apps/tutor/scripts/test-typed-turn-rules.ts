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
  sayWithinBudget, sharesCardWords, enterPartState, boardEmphasis, answerShaped, typedTurnSpokenText, typedPronunciationItems, typedPronunciationItemsFor, moveNeedsAnswerFor, capCardText, laterPartLabels, itemsLeftFor, type FieldEffectContext, turnStateLine, typedPartKind, typedTurnRequestFor,
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
    studentReplied: false, nudge: false, items: [], lessonElapsedMs: 0, partQuestionsAnswered: false, ...rest,
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

test('level check: question, then move at the third answer (R3: committed answers)', () => {
  assert.deepEqual(allowedNextFor(ctx('level-check', { state: ask('question'), studentReplied: true })), ['question']);
  assert.deepEqual(allowedNextFor(ctx('level-check', { state: { ...ask('question'), answersInPart: { 'level-check': 3 } } })), ['move']);
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

test('V5: items exhausted → offer first (once), then move', () => {
  const ms = { menuState: { pronunciation: { asked: 1, picked: '2' } } };
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items: [], state: ms })), ['offer']);
  const made = { ...ms, offerState: { pronunciation: { made: true, accepted: false, served: false } } };
  // A (fix wave 6) pin moved: a made, not-taken offer may be repeated once — ['move'] → ['move', 'offer']
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items: [], state: { ...made, ...ask('offer') } })), ['move', 'offer']);
  const accepted = { ...ms, offerState: { pronunciation: { made: true, accepted: true, served: false } } };
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items: ['a'], state: { ...accepted, practisedItems: { pronunciation: ['a'] } } })), ['move']);
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('after an item\'s result, work on the weakest word with one more repeat (`retry`) before the next item or the offer'));
});
test('A (fix wave 6): the pronunciation offer repeats once for a reply that did not choose, then only move', () => {
  const ms = { menuState: { pronunciation: { asked: 1, picked: '2' } } };
  const at = (count: number, accepted = false) => ctx('pronunciation', { items: [], state: { ...ms, ...ask('offer'), offerState: { pronunciation: { made: true, accepted, served: false, count } } } });
  assert.deepEqual(allowedNextFor(at(1)), ['move', 'offer']);
  assert.deepEqual(allowedNextFor(at(2)), ['move']);
  assert.deepEqual(allowedNextFor(at(1, true)), ['move'], 'a taken offer is not repeated');
  assert.ok(turnStateLine(at(1)).includes('offer_repeat="allowed"'), turnStateLine(at(1)));
  assert.ok(!turnStateLine(at(2)).includes('offer_repeat'), turnStateLine(at(2)));
  // the reducer counts offers: the first sets count 1, the second count 2
  const offerT: TypedTurn = { ack: '', verdict: 'none', verdict_say: '', board: '', correction: null, support_ja: '', next: { kind: 'offer', say: 'One more, or move on?', item: '', level: '' } };
  const s1 = applyTypedTurn({ ...createTypedTurnState(), ...ms }, offerT, fctx('pronunciation'), null);
  assert.equal(s1.offerState.pronunciation.count, 1);
  const s2 = applyTypedTurn(s1, offerT, fctx('pronunciation'), null);
  assert.equal(s2.offerState.pronunciation.count, 2);
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('offer_repeat="allowed" (only then)'));
  // the request carries studentEnglish only when set
  assert.equal(typedTurnRequestFor({ ...at(1), studentEnglish: true }).studentEnglish, true);
  assert.equal('studentEnglish' in typedTurnRequestFor(at(1)), false);
});
test('V5: typedPronunciationItems — authored items, then the learner\'s corrected sentences (newest first, deduped, max 4, full sentences)', () => {
  const authored = ['I have worked here for years.', 'I was responsible for sales.'];
  const corrected = ['They felt happy and donated.', 'I have worked here for years.', 'sales', 'I sell washing machines to customers.', 'They felt happy and donated.', 'We met five clients.', 'I visited Osaka last year.', 'I called the team yesterday.'];
  assert.deepEqual(typedPronunciationItems(authored, corrected), [
    ...authored, 'They felt happy and donated.', 'I sell washing machines to customers.', 'We met five clients.', 'I visited Osaka last year.',
  ]);
  assert.deepEqual(typedPronunciationItems(authored, []), authored);
  assert.deepEqual(typedPronunciationItems([], ['no capital here.', 'Two words.', 'Fine sentence without stop']), []);
});
test('W10-1 (fix wave 10, run 6 796 s): the item list follows the menu pick — words / sentences / the learner\'s own', () => {
  const pron = (plan.segments.find((s) => s.id === 'pronunciation')?.metadata as { pronunciation: { words: string[]; sentences: string[] } }).pronunciation;
  const corrected = ['I visited Osaka last year.', 'sales', 'We met five clients.'];
  // pick 1 — the words, so the brain's next.item="responsibilities" is listed, armed and boarded (not the first sentence)
  assert.deepEqual(typedPronunciationItemsFor(pron, 'individual words', corrected), pron.words);
  assert.ok(typedPronunciationItemsFor(pron, 'individual words', corrected).includes('responsibilities'));
  // pick 2 — the authored sentences, refilled by the learner's corrected sentences (V5)
  assert.deepEqual(typedPronunciationItemsFor(pron, 'a complete sentence', corrected), [...pron.sentences, 'I visited Osaka last year.', 'We met five clients.']);
  // pick 3 — the learner's own corrected sentences only; none yet ⇒ the authored sentences
  assert.deepEqual(typedPronunciationItemsFor(pron, 'speaking more naturally', corrected), ['I visited Osaka last year.', 'We met five clients.']);
  assert.deepEqual(typedPronunciationItemsFor(pron, 'speaking more naturally', []), pron.sentences);
  // no pick yet / an unrecognised pick ⇒ today's list (sentences + refill)
  assert.deepEqual(typedPronunciationItemsFor(pron, null, corrected), typedPronunciationItems(pron.sentences, corrected));
  assert.deepEqual(typedPronunciationItemsFor(pron, 'skip and continue', corrected), typedPronunciationItems(pron.sentences, corrected));
  // a plan without words: pick 1 falls back to the sentences
  assert.deepEqual(typedPronunciationItemsFor({ sentences: pron.sentences }, 'individual words', []), pron.sentences);
  // the W6 list and itemsLeft follow: with pick 1 the words are the items left
  const c = ctx('pronunciation', { items: typedPronunciationItemsFor(pron, 'individual words', []), menuPick: 'individual words' });
  assert.deepEqual(itemsLeftFor(c), pron.words);
  assert.ok(allowedNextFor(c).includes('item'));
});

test('menu / pronunciation', () => {
  const ms = (asked: number, picked: string | null) => ({ menuState: { pronunciation: { asked, picked } } });
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { state: ms(0, null) })), ['menu']);
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { state: ms(2, null) })), ['move']);
  const items = ['a', 'b'];
  const some = allowedNextFor(ctx('pronunciation', { items, state: { ...ms(1, '2'), ...ask('item'), practisedItems: { pronunciation: ['a'] } } }));
  assert.deepEqual(sorted(some), ['item', 'move', 'offer', 'retry']);
  assert.ok(!allowedNextFor(ctx('pronunciation', { items, state: { ...ms(1, '2'), ...ask('none'), practisedItems: { pronunciation: ['a'] } } })).includes('retry'));
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items, state: { ...ms(1, '2'), practisedItems: { pronunciation: ['a', 'b'] } } })), ['offer']);
  for (const k of ['question', 'offer', 'menu'] as const) {
    assert.deepEqual(allowedNextFor(ctx('pronunciation', { items, state: { ...ms(1, '2'), ...ask(k), practisedItems: { pronunciation: ['a'] } } })), ['item', 'offer', 'move'], k);
  }
  // W10-3a: an open retry of the last item keeps `retry` (the item stays the subject) — see the W10-3a test
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items, state: { ...ms(1, '2'), ...ask('retry'), practisedItems: { pronunciation: ['a'] } } })), ['item', 'retry', 'offer', 'move']);
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

test('recap order (V3 / R1: question until the review was delivered, then close only)', () => {
  assert.deepEqual(allowedNextFor(ctx('summary')), ['question']);
  assert.deepEqual(allowedNextFor(ctx('summary', { state: { ...ask('question'), turnsInPart: { summary: 0 } } })), ['question']);
  // R1: turns alone do not end the review step
  assert.deepEqual(allowedNextFor(ctx('summary', { state: { ...ask('question'), turnsInPart: { summary: 2 } } })), ['question']);
  assert.deepEqual(allowedNextFor(ctx('summary', { state: { ...ask('question'), turnsInPart: { summary: 1 }, recapReviewed: { summary: true } } })), ['close']);
  assert.deepEqual(allowedNextFor(ctx('summary', { state: { ...ask('question'), turnsInPart: { summary: 3 }, recapReviewed: { summary: true } } })), ['close']);
});
test('V3: turnStateLine recap_step + required_phrases on the summary', () => {
  const t0 = turnStateLine(ctx('summary', { state: ask('question') }));
  assert.ok(t0.includes('recap_step="review_feedback_check"'), t0);
  assert.ok(t0.includes('required_phrases="one thing you did well|the difference between"'), t0);
  const t1 = turnStateLine(ctx('summary', { state: { ...ask('question'), turnsInPart: { summary: 1 }, recapReviewed: { summary: true } } }));
  assert.ok(t1.includes('recap_step="close"'), t1);
  assert.ok(!t1.includes('required_phrases'), t1);
  const pp = turnStateLine(ctx('present-perfect'));
  assert.ok(!pp.includes('recap_step') && !pp.includes('required_phrases'), pp);
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('`recap_step=review_feedback_check`') && TYPED_TURN_INSTRUCTIONS.includes('`recap_step=close`'));
});

test('budget due', () => {
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true })), ['move']);
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true, lastPart: true })), ['close']);
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true, state: ask('question') })), ['question', 'retry', 'move']); // W9-A: retry on the first post-due turn
});

test('every state in a grid yields a non-empty set', () => {
  const kinds = ['none', 'retry', 'question', 'offer', 'menu', 'item'] as const;
  const bools = [false, true];
  let n = 0;
  for (const p of plan.segments) for (const k of kinds) for (const b of bools) for (const m of bools) for (const nu of bools)
    for (const last of bools) for (const picked of [null, 'x']) for (const asked of [0, 2]) for (const ans of [0, 2, 3]) for (const rr of [0, 2])
      for (const o of [{ made: false, accepted: false, served: false }, { made: true, accepted: false, served: false }, { made: true, accepted: true, served: false }, { made: true, accepted: true, served: true }])
        for (const its of [[], ['a']]) {
          const c = ctx(p.id, {
            budgetDue: b, studentMovedOn: m, nudge: nu, lastPart: last, studentReplied: ans > 0, items: its,
            state: { ...ask(k), answersInPart: { [p.id]: ans }, retriesInARow: rr, offerState: { [p.id]: o }, menuState: { [p.id]: { asked, picked } } },
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
    items: [], menuPick: null, budgetDue: false, nudge: false, ...rest,
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
  // C (fix wave 6) pin moved: the model card now carries the words the student did not say (machine → machines, customer → customers)
  assert.deepEqual(e, [{ kind: 'model_card', sentence: 'I sell washing machines to customers.', emphasis: ['machines', 'customers'], emphasisAt: [3, 5] }]);
});
test('D (fix wave 6, p3 1171 s): the recap board "A. | B." paints the two contrasted sentences in order; elsewhere one card', () => {
  const pair = 'I have worked here for five years. | I worked here five years ago.';
  for (const v of ['correct', 'none'] as const) {
    const st = applyField(createTypedTurnState(), { field: 'verdict', value: v });
    assert.deepEqual(effectsForField({ field: 'board', value: pair }, fctx('summary', { state: st, studentLast: 'Yes, ready.' })),
      [{ kind: 'model_card', sentence: 'I have worked here for five years.' }, { kind: 'model_card', sentence: 'I worked here five years ago.' }], v);
  }
  const ok = applyField(createTypedTurnState(), { field: 'verdict', value: 'correct' });
  const one = effectsForField({ field: 'board', value: pair }, fctx('open-conversation', { state: ok }));
  assert.ok(one.length <= 1 && one.every((e) => e.kind === 'model_card' && !('emphasis' in e)), JSON.stringify(one));
  assert.ok(!one.some((e) => e.kind === 'model_card' && e.sentence === 'I have worked here for five years.'), 'not split outside the recap');
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes("On the review question, put the two sentences you contrast in `board`, separated by ' | ', so the student sees them while you ask."));
  const r0 = TYPED_TURN_INSTRUCTIONS.indexOf('THE RECAP PART'), r1 = TYPED_TURN_INSTRUCTIONS.indexOf("separated by ' | '");
  assert.ok(r0 >= 0 && r1 > r0 && !TYPED_TURN_INSTRUCTIONS.slice(r0, r1).includes('\n\n'), 'inside THE RECAP PART block');
});
test('Y3 (fix wave 7, session 3 797 s): a recap board without " | " still cards its sentences when the verdict is not correct', () => {
  const none = applyField(createTypedTurnState(), { field: 'verdict', value: 'none' });
  const two = 'I have worked here for five years. I worked here five years ago.';
  assert.deepEqual(effectsForField({ field: 'board', value: two }, fctx('summary', { state: none, studentLast: 'Yes, ready.' })),
    [{ kind: 'model_card', sentence: 'I have worked here for five years.' }, { kind: 'model_card', sentence: 'I worked here five years ago.' }]);
  assert.deepEqual(effectsForField({ field: 'board', value: 'I have worked here for five years.' }, fctx('summary', { state: none, studentLast: 'Yes, ready.' })),
    [{ kind: 'model_card', sentence: 'I have worked here for five years.' }], 'one sentence → one card');
  assert.deepEqual(effectsForField({ field: 'board', value: two }, fctx('summary', { studentLast: 'Yes, ready.' })),
    [{ kind: 'model_card', sentence: 'I have worked here for five years.' }, { kind: 'model_card', sentence: 'I worked here five years ago.' }], 'no verdict yet (null) → cards too');
  assert.deepEqual(effectsForField({ field: 'board', value: two }, fctx('open-conversation', { state: none })), [], 'outside the recap: unchanged');
  assert.deepEqual(effectsForField({ field: 'board', value: 'I have worked here for five years. I worked here five years ago. I like it.' }, fctx('summary', { state: none })).length, 2, 'at most two');
});
test('C (fix wave 6, p3 473 s): boardEmphasis underlines what the model sentence changed', () => {
  assert.deepEqual(boardEmphasis('Uh, to talk to uh vendors uh from robotics companies in China.', 'I learned to talk with vendors from robotics companies in China.'),
    { emphasis: ['I', 'learned', 'with'], emphasisAt: [0, 1, 4] });
  assert.deepEqual(boardEmphasis('I sell washing machines to customers.', 'I sell washing machines to customers.'), { emphasis: [], emphasisAt: [] });
  assert.deepEqual(boardEmphasis('i sell washing machines to customers', 'I sell washing machines to customers.'), { emphasis: [], emphasisAt: [] }, 'case / punctuation aside');
  assert.deepEqual(boardEmphasis('', 'I sell washing machines to customers.'), { emphasis: [], emphasisAt: [] }, 'no student words: nothing to compare');
  assert.deepEqual(boardEmphasis('I go there', 'Um, I went there.'), { emphasis: ['went'], emphasisAt: [2] }, 'a filler is never underlined');
  const ok = applyField(createTypedTurnState(), { field: 'verdict', value: 'correct' });
  assert.deepEqual(effectsForField({ field: 'board', value: 'I learned to talk with vendors from robotics companies in China.' }, fctx('open-conversation', { state: ok, studentLast: 'Uh, to talk to uh vendors uh from robotics companies in China.' })),
    [{ kind: 'model_card', sentence: 'I learned to talk with vendors from robotics companies in China.', emphasis: ['I', 'learned', 'with'], emphasisAt: [0, 1, 4] }]);
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

test('W10-3a (fix wave 10, run 6 914 s): a retry stays allowed while the last item is still the subject (open ask retry, < 2 retries)', () => {
  const ms = { menuState: { pronunciation: { asked: 1, picked: 'a complete sentence' } } };
  const items = ['a', 'b'];
  // "Can you please talk in English?" after the weakest-word repeat: the brain re-asks the SAME sentence (retry), not a new item
  const r1 = allowedNextFor(ctx('pronunciation', { items, state: { ...ms, ...ask('retry'), retriesInARow: 1, practisedItems: { pronunciation: ['a'] } } }));
  assert.deepEqual(sorted(r1), ['item', 'move', 'offer', 'retry']);
  // two retries in a row: the subject moves on
  const r2 = allowedNextFor(ctx('pronunciation', { items, state: { ...ms, ...ask('retry'), retriesInARow: 2, practisedItems: { pronunciation: ['a'] } } }));
  assert.deepEqual(sorted(r2), ['item', 'move', 'offer']);
  // items used up: the repeat still rides beside the exit
  const r3 = allowedNextFor(ctx('pronunciation', { items, state: { ...ms, ...ask('retry'), retriesInARow: 1, practisedItems: { pronunciation: ['a', 'b'] } } }));
  assert.deepEqual(r3, ['retry', 'offer']);
  // the retry re-arms the last practised item's clip (W9-B3 rearm_item), also when the open ask is already a retry
  const e = effectsForField(nextEv({ kind: 'retry', say: 'Once more: a' }), fctx('pronunciation', { items, state: { ...ms, ...ask('retry'), practisedItems: { pronunciation: ['a'] } } }));
  assert.deepEqual(e.filter((x) => x.kind === 'rearm_item'), [{ kind: 'rearm_item', text: 'a' }]);
});

test('W10-3b (fix wave 10, run 6 987 s): a nudge on an open pronunciation item re-asks the SAME item (retry), never a new one', () => {
  const ms = { menuState: { pronunciation: { asked: 1, picked: 'a complete sentence' } } };
  const items = ['a', 'b'];
  const c = ctx('pronunciation', { nudge: true, items, state: { ...ms, ...ask('item'), practisedItems: { pronunciation: ['a'] } } });
  assert.deepEqual(allowedNextFor(c), ['retry', 'wait']);
  const e = effectsForField(nextEv({ kind: 'retry', say: 'Take your time. a' }), fctx('pronunciation', { nudge: true, items, state: { ...ms, ...ask('item'), practisedItems: { pronunciation: ['a'] } } }));
  assert.deepEqual(e.filter((x) => x.kind === 'rearm_item'), [{ kind: 'rearm_item', text: 'a' }]);
  // an open retry ask nudges as before; a non-pronunciation open ask is untouched
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { nudge: true, items, state: { ...ms, ...ask('retry'), practisedItems: { pronunciation: ['a'] } } })), ['retry', 'wait']);
  assert.deepEqual(allowedNextFor(ctx('past-simple', { nudge: true, state: ask('question') })), ['question', 'wait']);
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
  // R2: the last item's result is in (open ask item, no retry yet) → one weakest-word repeat or the offer
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items: sentences, state: s2 })), ['retry', 'offer']);
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
  assert.deepEqual(allowedNextFor(ctx('open-conversation', { budgetDue: true, state: pd(0) })), ['question', 'retry', 'move']); // W9-A
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
  assert.deepEqual(allowedNextFor(fresh('open-conversation', { budgetDue: true, state: ask('question') })), ['question', 'retry']); // W9-A: the first post-due turn keeps retry
  // the closing part entered by the engine: no close on the entry turn
  assert.ok(!allowedNextFor(fresh('summary', { lastPart: true })).includes('close'));
  // without engineMoved nothing changes
  assert.deepEqual(allowedNextFor(ctx('past-simple', { studentMovedOn: true })), ['move']);
});
test('W2/Y1: laterPartLabels feed moveOnRequestSpan as the prose move-on order does', () => {
  const labels = laterPartLabels(plan, 'present-perfect');
  assert.ok(labels.includes('Past simple') && labels.includes('Summary'), labels.join('|'));
  assert.ok(labels.includes('Conversation') && labels.includes('会話'), 'Y1: extension parts included (a named request may target them)');
  assert.ok(!labels.includes('Present perfect'), 'only later parts');
  assert.ok(moveOnRequestSpan('Can we go to past simple?', labels));
  assert.equal(moveOnRequestSpan('Can we go to past simple?'), null, 'without labels the span misses');
});

test('Y1: laterPartLabels(plan, past-simple) names the Conversation part', () => {
  const labels = laterPartLabels(plan, 'past-simple');
  assert.ok(labels.includes('Conversation') && labels.includes('会話'), labels.join('|'));
});

test('Y2: an explicit request on an offer part with the offer not made wins → [move]', () => {
  assert.deepEqual(allowedNextFor(ctx('present-perfect', { studentMovedOn: true, state: ask('question') })), ['move']);
  assert.deepEqual(allowedNextFor(ctx('present-perfect', { studentMovedOn: true })), ['move']);
});

test('Fix round 1 M3: a backward student jump (past-simple → present-perfect) re-enters the earlier part fresh', () => {
  const before: TypedTurnState = { ...createTypedTurnState(), openAsk: { kind: 'question', text: 'x' }, pendingVerdict: 'correct',
    turnsInPart: { 'present-perfect': 9, 'past-simple': 3 }, answersInPart: { 'present-perfect': 4, 'past-simple': 2 },
    postDueTurns: { 'present-perfect': 2 }, recapReviewed: {} };
  const back = enterPartState(before, 'present-perfect');
  assert.equal(back.turnsInPart['present-perfect'], 0);
  assert.equal(back.answersInPart?.['present-perfect'], 0);
  assert.equal(back.postDueTurns?.['present-perfect'], 0);
  assert.equal(back.answersInPart?.['past-simple'], 2, 'the part left keeps its counts');
  assert.equal(back.openAsk.kind, 'none');
  // the latch sets engineMoved: no second move this turn, the earlier part's entry row
  const row = allowedNextFor(ctx('present-perfect', { engineMoved: true, state: back }));
  assert.ok(!row.includes('move') && !row.includes('close'), row.join(','));
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
test('R3: level check — committed answers decide; the third reply may move only if it is a real answer', () => {
  const lc = (committed: number, replied: boolean) => ctx('level-check', { studentReplied: replied, state: { ...ask('question'), answersInPart: { 'level-check': committed } } });
  assert.deepEqual(allowedNextFor(lc(1, true)), ['question']);
  assert.equal(moveNeedsAnswerFor(lc(1, true)), false);
  assert.deepEqual(allowedNextFor(lc(2, false)), ['question']);
  // R5: question first — allowedNext[0] is the cut / unparseable fallback, which must re-ask, never move
  assert.deepEqual(allowedNextFor(lc(2, true)), ['question', 'move']);
  assert.equal(typedTurnRequestFor(lc(2, true)).allowedNext[0], 'question');
  assert.equal(moveNeedsAnswerFor(lc(2, true)), true);
  assert.ok(turnStateLine(lc(2, true)).includes('move_needs_answer="yes"'), turnStateLine(lc(2, true)));
  assert.equal(typedTurnRequestFor(lc(2, true)).moveNeedsAnswer, true);
  assert.deepEqual(allowedNextFor(lc(3, true)), ['move']);
  assert.equal(moveNeedsAnswerFor(lc(3, true)), false);
  for (const c of [lc(1, true), lc(3, true), lc(2, false)]) {
    assert.ok(!turnStateLine(c).includes('move_needs_answer'));
    assert.equal(typedTurnRequestFor(c).moveNeedsAnswer, undefined);
  }
  // R7: the cut / unparseable fallback in that cell is allowedNext[0] = question, spoken by the client as the part's card ask
  const fb = engineLineFor(typedTurnRequestFor(lc(2, true)).allowedNext[0], { ...fctx('level-check'), japanese: false });
  assert.equal(fb, cardAskLine(getSegmentTruth(plan.segments.find((s) => s.id === 'level-check'), plan.id)?.problemText ?? ''));
  assert.ok(fb && fb.trim().length > 0, 'a spoken re-ask');
  assert.equal(moveNeedsAnswerFor(ctx('past-simple', { studentReplied: true, state: { ...ask('question'), answersInPart: { 'past-simple': 2 } } })), false);
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('move_needs_answer'));
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('`move` only if this reply was a real answer (verdict ≠ none); a non-answer → `question`'));
});

// ---- Fix wave 2 V6: a move into a key-ideas part sees the card it previews ----
test('V6: next_card carries a concept part\'s key ideas (level-filtered, as the board shows them) when it has no question card', () => {
  const lc = turnStateLine(ctx('level-check', { state: { ...ask('question'), answersInPart: { 'level-check': 3 } } }));
  assert.ok(lc.includes('next_part="Your job"'), lc);
  const card = (lc.match(/next_card="([^"]*)"/) ?? [])[1] ?? '';
  // no level yet on a fixed-script plan → the intermediate version (effectiveBoardLevel), never the other levels
  assert.ok(/^1\. We explain responsibilities/.test(card), card);
  assert.ok(card.includes('Practice question: What are your main responsibilities at work?'), card);
  assert.ok(!card.includes('[beginner]') && !card.includes('What do you do at work?'), card);
  const adv = turnStateLine(ctx('level-check', { state: { ...ask('question'), answersInPart: { 'level-check': 3 } }, workingLevel: 'advanced' }));
  assert.ok(/next_card="[^"]*Could you describe your current responsibilities/.test(adv), adv);
  // a question card is unchanged
  assert.ok(/next_card="Have you worked for your current company for a long time\?"/.test(turnStateLine(ctx('topic-intro', { studentMovedOn: true }))));
});

// ---- Fix round 1 R1: a nudge / wait turn does not consume the summary's review step ----
test('R1: a nudge turn at the start of the summary leaves the review step; a delivered question turn ends it', () => {
  const tt = (kind: 'wait' | 'question') => ({ ack: 'Take your time.', verdict: 'none' as const, verdict_say: '', board: '', correction: null, support_ja: '', next: { kind, say: kind === 'wait' ? '' : 'Here is what we practised. One thing you did well was… What is the difference between these two sentences?', item: '', level: '' as const } });
  const s0 = { ...createTypedTurnState(), openAsk: { kind: 'question' as const, text: 'x' } };
  assert.deepEqual(createTypedTurnState().recapReviewed, {});
  // the nudge row still wins while silent
  assert.deepEqual(allowedNextFor(ctx('summary', { nudge: true, state: s0 })), ['question', 'wait']);
  const s1 = applyTypedTurn(s0, tt('wait'), fctx('summary', { state: s0 }), null);
  assert.equal(s1.turnsInPart.summary, 1, 'the wait turn counts as a turn');
  assert.equal(s1.recapReviewed.summary, undefined);
  const c = ctx('summary', { state: s1 });
  assert.deepEqual(allowedNextFor(c), ['question']);
  assert.ok(turnStateLine(c).includes('recap_step="review_feedback_check"') && turnStateLine(c).includes('required_phrases="one thing you did well|the difference between"'));
  // a delivered question is the review
  const s2 = applyTypedTurn(s0, tt('question'), fctx('summary', { state: s0 }), null);
  assert.equal(s2.recapReviewed.summary, true);
  assert.deepEqual(allowedNextFor(ctx('summary', { state: s2 })), ['close']);
  assert.ok(turnStateLine(ctx('summary', { state: s2 })).includes('recap_step="close"'));
  // R6: a nudge turn that re-asks with kind question is no review either
  const sn = applyTypedTurn(s0, tt('question'), fctx('summary', { state: s0, nudge: true }), null);
  assert.equal(sn.recapReviewed.summary, undefined, 'nudge question: not reviewed');
  const cn = ctx('summary', { state: sn });
  assert.deepEqual(allowedNextFor(cn), ['question']);
  assert.ok(turnStateLine(cn).includes('required_phrases="one thing you did well|the difference between"'));
  // R6: entering the summary by an engine move clears a stale review mark
  assert.equal(enterPartState({ ...s2 }, 'summary').recapReviewed.summary, false);
  assert.deepEqual(allowedNextFor(ctx('summary', { state: enterPartState(s2, 'summary') })), ['question']);
  // a question on another part sets nothing
  const s3 = applyTypedTurn(createTypedTurnState(), tt('question'), fctx('past-simple'), null);
  assert.deepEqual(s3.recapReviewed, {});
});

// ---- Fix round 1 R2: the weakest-word repeat on the LAST item ----
test('R2: items exhausted with the last item open — retry once, then offer / move', () => {
  const base = { menuState: { pronunciation: { asked: 1, picked: '2' } }, practisedItems: { pronunciation: ['a'] } };
  const made = { pronunciation: { made: true, accepted: true, served: false } };
  const row = (retries: number, offerMade: boolean) => allowedNextFor(ctx('pronunciation', { items: ['a'], state: { ...base, ...ask('item'), retriesInARow: retries, ...(offerMade ? { offerState: made } : {}) } }));
  assert.deepEqual(row(0, false), ['retry', 'offer']);
  assert.deepEqual(row(0, true), ['retry', 'move']);
  assert.deepEqual(row(1, false), ['offer']);
  assert.deepEqual(row(1, true), ['move']);
  // an open ask other than item: no retry
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items: ['a'], state: { ...base, ...ask('offer') } })), ['offer']);
});

// ---- Fix round 1 R4 ----
test('R4/M1: the board sentence passes the card guard — a bare "Yes." or a two-word board is no card', () => {
  const ok = applyField(createTypedTurnState(), { field: 'verdict', value: 'correct' });
  assert.deepEqual(effectsForField({ field: 'board', value: 'Yes.' }, fctx('present-perfect', { state: ok })), []);
  assert.deepEqual(effectsForField({ field: 'board', value: 'I work.' }, fctx('present-perfect', { state: ok })), []);
  assert.deepEqual(effectsForField({ field: 'board', value: 'I sell washing machines to customers.' }, fctx('present-perfect', { state: ok })),
    [{ kind: 'model_card', sentence: 'I sell washing machines to customers.' }]);
});
test('R4/M3: capCardText keeps the first line(s) and always the last (practice question) line, dropping middle lines first', () => {
  const lines = ['1. ' + 'a'.repeat(220), '2. ' + 'b'.repeat(220), '3. ' + 'c'.repeat(220), '4. ' + 'd'.repeat(220), '5. Practice question: What do you do at work?'];
  const card = lines.join('\n');
  assert.ok(card.length > 900);
  const out = capCardText(card, 700);
  assert.ok(out.length <= 700, String(out.length));
  assert.ok(out.startsWith(lines[0]), 'first line kept');
  assert.ok(out.endsWith(lines[4]), 'last line kept');
  assert.ok(!out.includes('d'.repeat(50)), 'a middle line dropped');
  assert.equal(capCardText('short\ncard', 700), 'short\ncard');
  // a first line longer than the cap alone: cut, last line still kept
  const huge = capCardText('x'.repeat(1000) + '\nQ?', 100);
  assert.ok(huge.length <= 100 && huge.endsWith('\nQ?'), huge);
});

// ---- Fix wave 3 X1: the level check honours the engine's question tracker and answer-shaped replies (r61b 34–147 s) ----
test('X1: level check with every numbered question answered (partQuestionsAnswered) moves at committed 0', () => {
  const c = ctx('level-check', { partQuestionsAnswered: true, studentReplied: true, state: ask('question') });
  assert.deepEqual(allowedNextFor(c), ['move']);
  assert.ok(turnStateLine(c).includes('questions_done="yes"'), turnStateLine(c));
  assert.ok(!moveNeedsAnswerFor(c), 'no move_needs_answer gate on the tracker\'s move');
  // without the tracker: unchanged rows
  assert.deepEqual(allowedNextFor(ctx('level-check', { studentReplied: true, state: ask('question') })), ['question']);
  assert.ok(!turnStateLine(ctx('level-check', { state: ask('question') })).includes('questions_done'), 'absent when not done');
  // F4.2: only when move is allowed (a nudge turn's row is question / wait)
  const nudged = ctx('level-check', { partQuestionsAnswered: true, nudge: true, state: ask('question') });
  assert.deepEqual(allowedNextFor(nudged), ['question', 'wait']);
  assert.ok(!turnStateLine(nudged).includes('questions_done'), turnStateLine(nudged));
  assert.deepEqual(allowedNextFor(ctx('level-check', { studentReplied: true, state: { ...ask('question'), answersInPart: { 'level-check': 2 } } })), ['question', 'move']);
  // F1: moveNeedsAnswer only in the ['question','move'] cell
  const lc = (n: number, over: Partial<AllowedNextContext> = {}) => ctx('level-check', { studentReplied: true, state: { ...ask('question'), answersInPart: { 'level-check': n } }, ...over });
  assert.equal(moveNeedsAnswerFor(lc(0, { partQuestionsAnswered: true })), false, 'tracker move, committed 0');
  assert.equal(moveNeedsAnswerFor(lc(2, { partQuestionsAnswered: true })), false, 'tracker move, committed 2');
  assert.deepEqual(allowedNextFor(lc(2, { partQuestionsAnswered: true })), ['move']);
  assert.ok(!typedTurnRequestFor(lc(2, { partQuestionsAnswered: true })).moveNeedsAnswer, 'no request flag on the tracker move');
  assert.equal(moveNeedsAnswerFor(lc(3)), false, 'committed 3');
  assert.equal(moveNeedsAnswerFor(lc(2)), true, 'committed 2 + replied');
  // other parts ignore the flag
  assert.deepEqual(sorted(allowedNextFor(ctx('open-conversation', { partQuestionsAnswered: true, state: ask('question') }))), ['question', 'retry']);
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('questions_done="yes" (only then) = every numbered question of this part has been answered — move now'), 'glossary');
});
test('X1/X1b: answerShaped — ≥ 4 English content words; a Japanese reply never counts (the brain\'s verdict decides)', () => {
  assert.equal(answerShaped("Yes, I'm ready."), false);
  assert.equal(answerShaped('OK, thank you.'), false);
  assert.equal(answerShaped('Sorry, can you say that again?'), false);
  assert.equal(answerShaped('I work in the sales department of an electronics company in Osaka.'), true);
  assert.equal(answerShaped(''), false);
  assert.equal(answerShaped('すみません、わかりません。'), false);
  assert.equal(answerShaped('営業部で働いています。'), false);
  assert.equal(answerShaped('はい。'), false);
  // F4.1: a question back / a request is no answer
  assert.equal(answerShaped("Sorry, I don't understand what you mean."), false);
  assert.equal(answerShaped('Can you say it again more slowly?'), false);
  assert.equal(answerShaped('Can we move on to the next part please?'), false);
  assert.equal(answerShaped('I was responsible for testing the new website, right?'), false, 'ends with ?');
  assert.equal(answerShaped('Excuse me, I did not catch the question.'), false);
});
test('X1: applyTypedTurn counts verdict none + an answer-shaped reply as an answer; "OK." is not', () => {
  const t = { ack: 'Thanks.', verdict: 'none' as const, verdict_say: '', board: '', correction: null, support_ja: '', next: nx({ kind: 'question' }) };
  const s0 = { ...createTypedTurnState(), openAsk: { kind: 'question' as const, text: 'x' } };
  const a = applyTypedTurn(s0, t, fctx('level-check', { state: s0, studentLast: 'I work in the sales department of an electronics company in Osaka.' }), null);
  assert.equal(a.answersInPart['level-check'], 1);
  const b = applyTypedTurn(s0, t, fctx('level-check', { state: s0, studentLast: 'OK.' }), null);
  assert.equal(b.answersInPart['level-check'] ?? 0, 0);
});

// ---- Fix wave 3 X2: the recap carries the MISSING required phrases on every turn (r61b 745 s) ----
test('X2: required_phrases lists the missing phrases on every recap turn while any is missing; omitted when none', () => {
  const closeStep = { ...ask('question'), turnsInPart: { summary: 1 }, recapReviewed: { summary: true } };
  const c1 = ctx('summary', { lastPart: true, missingRequiredPhrases: ['one thing you did well'], state: closeStep });
  assert.ok(turnStateLine(c1).includes('recap_step="close"') && turnStateLine(c1).includes('required_phrases="one thing you did well"'), turnStateLine(c1));
  const c0 = ctx('summary', { lastPart: true, missingRequiredPhrases: ['one thing you did well', 'the difference between'], state: ask('question') });
  assert.ok(turnStateLine(c0).includes('required_phrases="one thing you did well|the difference between"'), turnStateLine(c0));
  assert.ok(!turnStateLine(ctx('summary', { lastPart: true, missingRequiredPhrases: [], state: ask('question') })).includes('required_phrases'), 'none missing → omitted (review step)');
  assert.ok(!turnStateLine(ctx('summary', { lastPart: true, missingRequiredPhrases: [], state: closeStep })).includes('required_phrases'), 'none missing → omitted (close step)');
  // not on other parts
  assert.ok(!turnStateLine(ctx('overview', { missingRequiredPhrases: ['x'] })).includes('required_phrases'));
  assert.ok(TYPED_TURN_INSTRUCTIONS.includes('required_phrases (recap part only) = phrases you have not said yet in this part — your closing turn must contain each one verbatim'), 'glossary');
});
test('X2: the request carries requiredPhrases (the missing list) for the server close gate; absent when none or on a stop request', () => {
  const closeStep = { ...ask('question'), recapReviewed: { summary: true } };
  assert.deepEqual(typedTurnRequestFor(ctx('summary', { lastPart: true, missingRequiredPhrases: ['one thing you did well'], state: closeStep })).requiredPhrases, ['one thing you did well']);
  assert.equal(typedTurnRequestFor(ctx('summary', { lastPart: true, missingRequiredPhrases: [], state: closeStep })).requiredPhrases, undefined);
  assert.equal(typedTurnRequestFor(ctx('summary', { lastPart: true, state: closeStep })).requiredPhrases, undefined);
  // the prose close guard never refuses on the student's stop request; neither does the typed gate
  assert.equal(typedTurnRequestFor(ctx('summary', { lastPart: true, studentMovedOn: true, missingRequiredPhrases: ['one thing you did well'], state: closeStep })).requiredPhrases, undefined);
  // F4.3: one filtered list for both — ≤ 8 entries, an over-long entry truncated to 120 chars (not dropped)
  const long = 'a'.repeat(150);
  const many = [long, ...Array.from({ length: 9 }, (_, i) => `phrase ${i}`)];
  const cl = ctx('summary', { lastPart: true, missingRequiredPhrases: many, state: closeStep });
  const req = typedTurnRequestFor(cl).requiredPhrases ?? [];
  assert.equal(req.length, 8);
  assert.equal(req[0], 'a'.repeat(120));
  const line = turnStateLine(cl);
  const listed = (line.match(/required_phrases="([^"]*)"/) ?? [])[1] ?? '';
  assert.deepEqual(listed.split('|'), req, line);
});

// ---- Fix wave 4 Y1: the typed close's phrase guard sees the turn's own text (r62 829–833 s) ----
test('Y1: typedTurnSpokenText — released fields + next.say, in speaking order, empties dropped', () => {
  const next = nx({ kind: 'close', say: 'One thing you did well was explaining your work clearly. See you!' });
  assert.deepEqual(typedTurnSpokenText({ ack: 'Right.', verdict_say: 'That is it.', correction: { student: 'a', corrected: 'b', emphasis: [], explain: 'Use have.' }, support_ja: 'よくできました。' }, next),
    ['Right.', 'That is it.', 'Use have.', 'よくできました。', next.say]);
  assert.deepEqual(typedTurnSpokenText({ ack: '', verdict_say: '  ', correction: null }, next), [next.say]);
  assert.deepEqual(typedTurnSpokenText({}, undefined), []);
});

// ---- Fix wave 5 Z1: a correction that changes nothing reaches the client as a correct turn (p2.txt 310 s / 501 s) ----
test('Z1: the released no-change turn (verdict correct, correction null) arms no card, opens no correction, counts none', () => {
  const open = { ...createTypedTurnState(), correctionOpen: { student: 'I learn robot companies come from China.', corrected: 'I learned that robot companies come from China.' } };
  const st = applyField(open, { field: 'verdict', value: 'correct' });
  assert.deepEqual(effectsForField({ field: 'correction', value: null }, fctx('past-simple', { state: st })), [], 'no correction card');
  assert.deepEqual(effectsForField({ field: 'verdict_say', value: '' }, fctx('past-simple', { state: st })), []);
  const q = effectsForField(nextEv({ kind: 'question', say: 'What was the most interesting robot you saw?' }), fctx('past-simple', { state: st }));
  assert.ok(!kinds(q).includes('correction_card') && !kinds(q).includes('arm_item'), kinds(q).join(','));
  const out = applyTypedTurn(st, turnOf({ verdict: 'correct', verdict_say: '', correction: null, next: nx({ kind: 'question', say: 'What was the most interesting robot you saw?' }) }), fctx('past-simple', { state: st }), null);
  assert.equal(out.correctionOpen, null, 'the earlier correction is closed by the correct repeat');
  assert.equal((out.correctionsInPart ?? {})['past-simple'] ?? 0, 0, 'a dropped correction is not counted');
  assert.equal(out.openAsk.kind, 'question');
});

test('W9-A (fix wave 9, run 5 101 s): the first post-due turn keeps `retry` beside question/move so a correction gets its retry; from post_due 1 it is gone', () => {
  const pd = (n: number) => ({ ...ask('question'), postDueTurns: { 'topic-intro': n } });
  assert.deepEqual(allowedNextFor(ctx('topic-intro', { budgetDue: true, state: pd(0) })), ['question', 'retry', 'move']);
  assert.deepEqual(allowedNextFor(ctx('topic-intro', { budgetDue: true, state: pd(1) })), ['question', 'move']);
  assert.deepEqual(allowedNextFor(ctx('topic-intro', { budgetDue: true, studentMovedOn: true, state: pd(0) })), ['move'], 'a move request wins');
  assert.deepEqual(allowedNextFor(ctx('topic-intro', { budgetDue: true, state: { ...pd(0), openAsk: { kind: 'none', text: '' } } })), ['move'], 'no open ask: nothing to retry');
  assert.deepEqual(allowedNextFor(ctx('topic-intro', { budgetDue: false, state: pd(0) })), ['question', 'retry'], 'before the budget: unchanged');
});

test('W9-B3 (fix wave 9, run 5 859–927 s): an unmeasured clip note ⇒ this turn allows only `retry` of the open item (once); turn_state says repeat_due', () => {
  const items = ['I have worked with international customers for several years.', 'I was responsible for communicating with our customers.'];
  const st = { ...ask('item', 'Listen, then repeat: I have worked with international customers for several years.'), menuState: { pronunciation: { asked: 1, picked: '2' } }, practisedItems: { pronunciation: [items[0]] } };
  const due = ctx('pronunciation', { items, pronunciationRepeatDue: true, state: st });
  assert.deepEqual(allowedNextFor(due), ['retry']);
  assert.ok(turnStateLine(due).includes('repeat_due="yes"'), turnStateLine(due));
  assert.deepEqual(typedTurnRequestFor(due).allowedNext, ['retry']);
  // once: after the retry (retriesInARow 1) the normal rows return
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items, pronunciationRepeatDue: true, state: { ...st, retriesInARow: 1 } })), ['item', 'retry', 'offer', 'move']);
  // no open item (the menu is still open): nothing to repeat
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items, pronunciationRepeatDue: true, state: { ...ask('menu'), menuState: { pronunciation: { asked: 1, picked: null } } } })), ['menu']);
  // without the flag: unchanged
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items, state: st })), ['item', 'retry', 'offer', 'move']);
  assert.ok(!turnStateLine(ctx('pronunciation', { items, state: st })).includes('repeat_due'));
  // the student's move request still wins
  assert.deepEqual(allowedNextFor(ctx('pronunciation', { items, pronunciationRepeatDue: true, studentMovedOn: true, state: st })), ['move']);
});

test('W9-B3: a typed `retry` on an open pronunciation item re-arms that item (rearm_item) — the typed path skips the prose auto-arm', () => {
  const items = ['I have worked with international customers for several years.', 'I was responsible for communicating with our customers.'];
  const st = { ...ask('item', 'Listen, then repeat.'), practisedItems: { pronunciation: [items[0]] } };
  const e = effectsForField(nextEv({ kind: 'retry', say: 'Once more, please.' }), fctx('pronunciation', { items, state: st }));
  assert.deepEqual(e, [{ kind: 'rearm_item', text: items[0] }, { kind: 'open_ask', ask: { kind: 'retry', text: 'Once more, please.' } }]);
  // not on a question ask, not outside the pronunciation part
  assert.ok(!kinds(effectsForField(nextEv({ kind: 'retry', say: 'Again.' }), fctx('pronunciation', { items, state: ask('question') }))).includes('rearm_item'));
  assert.ok(!kinds(effectsForField(nextEv({ kind: 'retry', say: 'Again.' }), fctx('present-perfect', { state: ask('item') }))).includes('rearm_item'));
  // a retry does not count the item as practised twice
  const out = applyTypedTurn({ ...createTypedTurnState(), ...st }, turnOf({ verdict: 'none', verdict_say: '', correction: null, next: nx({ kind: 'retry', say: 'Once more.' }) }), fctx('pronunciation', { items, state: st }), null);
  assert.deepEqual(out.practisedItems.pronunciation, [items[0]]);
  assert.equal(out.retriesInARow, 1);
});

test('W9-C (fix wave 9, run 5 997 s): a reviewed recap with required phrases still unsaid allows question beside close; none missing ⇒ close only; post-due capped ⇒ close only', () => {
  const reviewed = { ...ask('question'), turnsInPart: { summary: 1 }, recapReviewed: { summary: true } };
  assert.deepEqual(allowedNextFor(ctx('summary', { state: reviewed, missingRequiredPhrases: ['the difference between'] })), ['close', 'question']);
  assert.deepEqual(allowedNextFor(ctx('summary', { state: reviewed, missingRequiredPhrases: [] })), ['close']);
  assert.deepEqual(allowedNextFor(ctx('summary', { state: reviewed })), ['close']);
  assert.deepEqual(allowedNextFor(ctx('summary', { lastPart: true, budgetDue: true, state: { ...reviewed, postDueTurns: { summary: 2 } }, missingRequiredPhrases: ['the difference between'] })), ['close']);
  const req = typedTurnRequestFor(ctx('summary', { state: reviewed, missingRequiredPhrases: ['the difference between'] }));
  assert.deepEqual(req.allowedNext, ['close', 'question']);
  assert.deepEqual(req.requiredPhrases, ['the difference between']);
});

if (failed) { console.log(`\n${failed} FAILED`); process.exit(1); }
console.log('\nall ok');
