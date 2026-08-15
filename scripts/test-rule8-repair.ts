/**
 * Tests for rule8-repair (Phase 4.1, humanlike-latency plan) — the pure
 * halves of the server-side Rule-8 repair pass: the detector that decides
 * a finished brain turn promised/spoke a visual it never drew, and the
 * wholesale validator over the repair model's structured output.
 *
 * Run: npx tsx scripts/test-rule8-repair.ts
 */
import {
  RULE8_PROMISE_REGEX,
  detectRepairNeed,
  parseRepairResponse,
  toToolCallFrames,
  shouldClientRequestRepair,
  parseClientRepairRequest,
} from '../apps/marketing/src/lib/tutor/voice/rule8-repair';

let passed = 0, failed = 0;
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

// ─── Promise regex (must match the stream route's RULE8_VIOLATION shape) ───
check('promise: "let me draw"', RULE8_PROMISE_REGEX.test("Let me draw the triangle for you."));
check('promise: "I\'ll show"', RULE8_PROMISE_REGEX.test("I'll show the formula on the board."));
check('promise: curly apostrophe', RULE8_PROMISE_REGEX.test("I’ll sketch the cell membrane."));
check('no promise: plain teaching', !RULE8_PROMISE_REGEX.test("The mitochondria makes energy."));

// ─── Detector ───
// (a) promised visual, zero tools → needed.
const dPromise = detectRepairNeed(["Good question.", "Let me show the quadratic formula."], 0);
check('detect: promise + 0 tools → needed', dPromise.needed);
check('detect: promise flag set', dPromise.promisedVisual);

// (b) spoken $-math, zero tools → needed, with the right 1-based sentence index.
const dMath = detectRepairNeed(
  ["Nice work.", "So the discriminant is $b^2 - 4ac$ here.", "What do you get?"],
  0,
);
check('detect: $-math + 0 tools → needed', dMath.needed);
check('detect: math sentence index is 1-based', dMath.mathSentences.length === 1 && dMath.mathSentences[0] === 2);

// (b) definition pattern, zero tools → needed.
const dDef = detectRepairNeed(
  ["The slope is defined as rise over run.", "Try one yourself."],
  0,
);
check('detect: definition + 0 tools → needed', dDef.needed);
check('detect: definition sentence index', dDef.definitionSentences[0] === 1);
check('detect: "we call this" fires', detectRepairNeed(["We call this the vertex form."], 0).needed);

// Bare ASCII latex with no $-delimiters (autoWrapLatex feeds the segmenter).
check('detect: bare x^2 latex fires', detectRepairNeed(["So x^2 + 3 is the answer."], 0).mathSentences.length === 1);

// Negative cases.
check('detect: plain prose → not needed', !detectRepairNeed(["How was your day?", "Ready to keep going?"], 0).needed);
check('detect: tools>0 suppresses everything', !detectRepairNeed(["Let me draw it.", "The formula is $E=mc^2$."], 2).needed);
check('detect: currency stays prose', !detectRepairNeed(["Maya has $50 and spends $15 at the movie."], 0).needed);
check('detect: empty turn → not needed', !detectRepairNeed([], 0).needed);

// ─── v2: posed-question narration (round-6: spoken "trap question" never boarded) ───
const dPosed = detectRepairNeed(
  ["Here's a trap question.", "What happens to the current if we double the resistance?"],
  0,
);
check('detect v2: "here\'s a trap question" fires', dPosed.needed);
check('detect v2: posed sentence index is 1-based', dPosed.posedQuestionSentences.length === 1 && dPosed.posedQuestionSentences[0] === 1);
check('detect v2: "let me give you a problem" fires',
  detectRepairNeed(["Let me give you a problem to chew on."], 0).posedQuestionSentences.length === 1);
check('detect v2: "let\'s try one more" fires',
  detectRepairNeed(["Let's try one more."], 0).posedQuestionSentences.length === 1);
check('detect v2: "I have a challenge for you" fires',
  detectRepairNeed(["I have a challenge for you."], 0).posedQuestionSentences.length === 1);
check('detect v2: posed alone makes the turn needed',
  detectRepairNeed(["Here's a quick question for you.", "Which planet is largest?"], 0).needed);
check('detect v2: praise "that\'s a great question" does NOT fire',
  detectRepairNeed(["That's a great question."], 0).posedQuestionSentences.length === 0);
check('detect v2: "do you have any questions" does NOT fire',
  !detectRepairNeed(["Do you have any questions?"], 0).needed);
check('detect v2: bare Socratic question does NOT fire (too noisy by design)',
  !detectRepairNeed(["What do you think happens next?"], 0).needed);
check('detect v2: tools>0 still suppresses posed',
  !detectRepairNeed(["Here's a trap question.", "What is $2^3$?"], 1).needed);

// ─── v2: client-initiated repair decision (net-of-client-drops) ───
// Server pass fires only at serverToolCount===0; the client pass covers the
// round-6 gap (server sent tools, client dropped them all) — the two must be
// mutually exclusive so a turn never double-repairs.
check('client-repair: N>0 sent, 0 painted → fire',
  shouldClientRequestRepair({ serverToolCount: 1, paintedCount: 0, sentenceCount: 3 }));
check('client-repair: 0 sent → server pass owns it, do NOT fire',
  !shouldClientRequestRepair({ serverToolCount: 0, paintedCount: 0, sentenceCount: 3 }));
check('client-repair: something painted → do NOT fire',
  !shouldClientRequestRepair({ serverToolCount: 2, paintedCount: 1, sentenceCount: 3 }));
check('client-repair: silent turn (no sentences) → do NOT fire',
  !shouldClientRequestRepair({ serverToolCount: 1, paintedCount: 0, sentenceCount: 0 }));

// ─── v2: endpoint body validation (bounded, fail-to-null) ───
check('parse body: valid', (() => {
  const p = parseClientRepairRequest({ sentences: ['Here is a trap question.', 'What is $2^3$?'], serverToolCount: 1, paintedCount: 0 });
  return p !== null && p.sentences.length === 2;
})());
check('parse body: non-array sentences → null', parseClientRepairRequest({ sentences: 'x', serverToolCount: 1, paintedCount: 0 }) === null);
check('parse body: non-string sentence → null', parseClientRepairRequest({ sentences: ['ok', 42], serverToolCount: 1, paintedCount: 0 }) === null);
check('parse body: too many sentences → null', parseClientRepairRequest({ sentences: Array(100).fill('s'), serverToolCount: 1, paintedCount: 0 }) === null);
check('parse body: overlong sentence → null', parseClientRepairRequest({ sentences: ['x'.repeat(1000)], serverToolCount: 1, paintedCount: 0 }) === null);
check('parse body: decision does not hold (painted>0) → null',
  parseClientRepairRequest({ sentences: ['s'], serverToolCount: 1, paintedCount: 1 }) === null);
check('parse body: missing counts → null', parseClientRepairRequest({ sentences: ['s'] }) === null);

// ─── Repair-response validation (wholesale: any bad entry → null) ───
const okEq = { repairs: [{ kind: 'show_equation', anchorSentence: 2, args: { latex: 'b^2 - 4ac', label: 'Discriminant' } }] };
const okParsed = parseRepairResponse(okEq, 3);
check('parse: valid show_equation passes', okParsed !== null && okParsed.length === 1);
check('parse: valid handwrite passes',
  parseRepairResponse({ repairs: [{ kind: 'handwrite', anchorSentence: 1, args: { text: 'slope = rise over run' } }] }, 2) !== null);
check('parse: empty repairs → []', (() => { const r = parseRepairResponse({ repairs: [] }, 3); return r !== null && r.length === 0; })());

check('parse: non-object → null', parseRepairResponse('nope', 3) === null);
check('parse: missing repairs → null', parseRepairResponse({}, 3) === null);
check('parse: >3 repairs → null', parseRepairResponse({ repairs: [okEq.repairs[0], okEq.repairs[0], okEq.repairs[0], okEq.repairs[0]] }, 9) === null);
check('parse: bad kind → null', parseRepairResponse({ repairs: [{ kind: 'show_graph', anchorSentence: 1, args: { latex: 'x' } }] }, 3) === null);
check('parse: anchorSentence 0 → null', parseRepairResponse({ repairs: [{ kind: 'show_equation', anchorSentence: 0, args: { latex: 'x' } }] }, 3) === null);
check('parse: anchorSentence float → null', parseRepairResponse({ repairs: [{ kind: 'show_equation', anchorSentence: 1.5, args: { latex: 'x' } }] }, 3) === null);
check('parse: anchorSentence out of range → null', parseRepairResponse({ repairs: [{ kind: 'show_equation', anchorSentence: 4, args: { latex: 'x' } }] }, 3) === null);
check('parse: empty latex → null', parseRepairResponse({ repairs: [{ kind: 'show_equation', anchorSentence: 1, args: { latex: '  ' } }] }, 3) === null);
check('parse: empty handwrite text → null', parseRepairResponse({ repairs: [{ kind: 'handwrite', anchorSentence: 1, args: { text: '' } }] }, 3) === null);
check('parse: overlong handwrite → null', parseRepairResponse({ repairs: [{ kind: 'handwrite', anchorSentence: 1, args: { text: 'x'.repeat(200) } }] }, 3) === null);
check('parse: unknown arg key → null', parseRepairResponse({ repairs: [{ kind: 'show_equation', anchorSentence: 1, args: { latex: 'x', color: 'red' } }] }, 3) === null);
// One bad entry poisons the whole batch (fail-to-nothing, never partial garbage).
check('parse: one bad entry poisons batch', parseRepairResponse({
  repairs: [
    { kind: 'show_equation', anchorSentence: 1, args: { latex: 'x^2' } },
    { kind: 'show_equation', anchorSentence: 2, args: { latex: '' } },
  ],
}, 3) === null);

// ─── Tool-call frame mapping ───
const frames = toToolCallFrames([
  { kind: 'show_equation', anchorSentence: 2, args: { latex: 'b^2-4ac', label: 'Discriminant' } },
  { kind: 'handwrite', anchorSentence: 1, args: { text: 'vertex form' } },
]);
check('frames: show_equation keeps its name', frames[0].name === 'show_equation' && frames[0].anchorSentence === 2);
check('frames: handwrite maps to tutor_handwrite', frames[1].name === 'tutor_handwrite' && frames[1].anchorSentence === 1);
check('frames: args pass through', (frames[0].args as { latex?: string }).latex === 'b^2-4ac');

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} rule8-repair tests passed.`);
