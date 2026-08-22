/**
 * R51 — a posed problem whose subject matter never reached the board.
 *
 * Live miss: portal-0984e111 t=97.3. The tutor posed an entire new word
 * problem in speech while the turn's only render was the PREVIOUS problem's
 * answer, so the board showed stale content that looked current.
 *
 * ⚠ HONEST STATE OF THE EVIDENCE, because "it fires on the live case" is not
 * the same claim as "it works". Measured over 591 real claude-brain tutor
 * turns paired with the renders from their own turn window: it fires on
 * exactly ONE — and that one IS the live miss it was built from. By the
 * standing rule (a detector that only rediscovers its own seed is a
 * tautology dressed as a result) that is NOT generalisation evidence. The
 * held-out cases below are SYNTHETIC — different subjects, actors and
 * phrasings than the seed — which is weaker than corpus evidence and is
 * labelled as such. Whether the real rate is "rare" or "over-narrow" is
 * unresolved; the number to watch in prod is whether it ever fires on a turn
 * nobody wrote it for.
 *
 * Run: npx tsx scripts/test-posed-problem-unboarded.ts
 */
import { strict as assert } from 'node:assert';
import { detectPosedProblemUnboarded } from '../src/lib/tutor/voice/exercise-board-check';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}
const d = (turnText: string, renderedText: string) => detectPosedProblemUnboarded({ turnText, renderedText });

// Verbatim from prod, including the missing space after "holds 5." — that
// detail is load-bearing and is pinned deliberately (see below).
const LIVE_TURN =
  "Right — five p new cards, since each of the p packs holds 5.Sounds like this is clicking — " +
  "let's push a bit further with problem 3 then. Kris has 5 gift bags, each filled with $s$ " +
  "stickers and $t$ toys — what expression captures how many items are in just *one* bag?";
const LIVE_RENDER = '{"latex":"5p","label":"New cards from p packs","id":"showEquation-3"}';

console.log('\nR51 — posed problem not on the board');

test('the live miss fires', () => {
  const r = d(LIVE_TURN, LIVE_RENDER);
  assert.equal(r.unboarded, true);
  assert.deepEqual(r.matched, []);
});

test('the SAME turn does NOT fire once the problem is boarded', () => {
  // The single most important negative: the detector must key on whether the
  // POSED subject reached the board, not on anything else about the turn.
  const r = d(LIVE_TURN, '{"problem":{"statement":"Kris has 5 gift bags, each filled with s stickers and t toys."}}');
  assert.equal(r.unboarded, false);
  assert.ok(r.matched.includes('kris') && r.matched.includes('stickers'));
});

test('scoping to the POSED sentence is what makes it work', () => {
  // Whole-turn comparison was the first design and could not catch this: the
  // turn OPENS by wrapping up the previous problem, so "cards"/"packs"
  // legitimately matched the board and overlap was non-zero. Pinning the
  // wrap-up words as NOT considered keeps that regression from returning.
  const r = d(LIVE_TURN, LIVE_RENDER);
  assert.ok(!r.considered.includes('cards'), 'previous problem\'s words must not be considered');
  assert.ok(!r.considered.includes('packs'));
  assert.ok(r.considered.includes('kris') && r.considered.includes('toys'));
});

test('sentences run together with NO space still split (verbatim prod shape)', () => {
  // "...holds 5.Sounds like..." — requiring whitespace after the terminator
  // made the splitter a no-op on the very turn it was written for.
  assert.equal(d(LIVE_TURN, LIVE_RENDER).considered.includes('sounds'), true);
});

test('a decimal is NOT treated as a sentence end', () => {
  const turn = 'The price dropped to 10.5 dollars for each ticket that Marco bought today. ' +
               'What expression captures the cost for n tickets at that price?';
  const r = d(turn, '{"latex":"5p"}');
  assert.equal(r.unboarded, true);
  assert.ok(r.considered.includes('marco'), 'the setup sentence must survive the split');
});

// --- HELD-OUT (SYNTHETIC) — different subjects/actors/phrasings than the seed.
test('held-out: a different actor and domain fires when unboarded', () => {
  const turn = "Good work on that one. Amara plants 7 rows of tulips with b bulbs in every row. " +
               "Write an expression for the total bulbs she plants.";
  assert.equal(d(turn, '{"latex":"3x + 2","label":"Previous answer"}').unboarded, true);
});

test('held-out: the same turn does not fire when boarded', () => {
  const turn = "Good work on that one. Amara plants 7 rows of tulips with b bulbs in every row. " +
               "Write an expression for the total bulbs she plants.";
  assert.equal(d(turn, '{"problem":{"statement":"Amara plants 7 rows of tulips, b bulbs per row."}}').unboarded, false);
});

test('held-out: morphology near-misses still count as boarded', () => {
  // "sticker" on the board vs "stickers" spoken must NOT fire — firing on a
  // board that is genuinely about the right thing is the expensive direction.
  const turn = "Kris fills each party bag with s stickers and t toys. What expression gives one bag?";
  assert.equal(d(turn, '{"label":"one party bag: sticker + toy"}').unboarded, false);
});

// --- MUST NOT FIRE: the false-positive shapes a looser first draft produced
// on real turns (13/591, almost all of them conversation rather than a
// problem being set). Each is a verbatim-shaped prod turn.
test('mishear recovery does not fire', () => {
  assert.equal(d("Hmm — I couldn't quite catch that. Just to finish the thought: when someone says a country is landlocked, what do they mean?", '').unboarded, false);
});
test('session resume does not fire', () => {
  assert.equal(d("Okay, we're back — right where we left off. I'd just asked: does the account care what order the money moved in?", '').unboarded, false);
});
test('affirmation with numbers does not fire', () => {
  assert.equal(d("Right — 11.25. That's your total pushback: four fifty for the smoothie plus six seventy-five for the cab.", '').unboarded, false);
});
test('idle nudge does not fire', () => {
  assert.equal(d("Take your time. Team Plus is pulling with fifteen, Team Minus with eleven twenty-five — who wins?", '').unboarded, false);
});
test('an IMPERATIVE ask with no question mark DOES fire', () => {
  // This assertion was inverted until the held-out Amara case exposed it:
  // the first gate required a '?', because the live miss happened to have
  // one. "Write an expression for..." is an ordinary way to set a problem
  // and carries none — a gate shaped by the seed rather than by the class.
  assert.equal(d('Kris has 5 gift bags with s stickers and t toys. Write an expression for one bag.', '{"latex":"3x"}').unboarded, true);
});
test('...but a bare statement with no ask at all still never fires', () => {
  assert.equal(d('Kris has 5 gift bags, each filled with s stickers and t toys.', '').unboarded, false);
});
test('empty and junk inputs are total, never throw', () => {
  assert.equal(d('', '').unboarded, false);
  assert.equal(d('?', '').unboarded, false);
  assert.equal(detectPosedProblemUnboarded({ turnText: '', renderedText: '' }).considered.length, 0);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
