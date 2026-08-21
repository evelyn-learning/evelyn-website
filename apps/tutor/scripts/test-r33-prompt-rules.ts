/**
 * R33 prompt/tool-description rules (live session 2026-07-25, AP Stats):
 *  1. Standalone acknowledgment openers banned — the latency cover layer may
 *     already have spoken one ("Good question." cover + "Good question —"
 *     brain opener = double-speak).
 *  2. Multi-value summaries (5-number summary etc.) must be WRITTEN via
 *     show_equation, and boxplot concepts drawn via show_stats — a labeled
 *     number line is not a boxplot.
 *  3. show_diagram's description must warn that boxplots are NOT a diagram
 *     kind (the live session drew show_diagram(number_line) with quartile
 *     labels; only show_number_line carried the round-29 warning).
 *
 * Run: npx tsx scripts/test-r33-prompt-rules.ts
 */

import { strict as assert } from 'node:assert';
import { buildSystemPrompt, type SystemPromptContext } from '../src/lib/tutor/ai/system-prompt-builder';
import { WHITEBOARD_TOOLS } from '../src/app/tutor/hooks/toolDefinitions';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const baseCtx: SystemPromptContext = { module: null, studentName: 'Ravi' };
const prompt = buildSystemPrompt(baseCtx);

test('prompt bans standalone acknowledgment openers (cover double-speak)', () => {
  assert.ok(/standalone acknowledgment opener/i.test(prompt));
  assert.ok(prompt.includes('latency cover'));
  assert.ok(prompt.includes('"Good question."'));
});

test('prompt requires multi-value summaries written via show_equation', () => {
  assert.ok(/multi-value (results?|summar)/i.test(prompt));
  assert.ok(prompt.includes('5-number summary'));
});

test('prompt requires show_stats boxplot for boxplot concepts (not number line)', () => {
  assert.ok(/boxplot concept.*show_stats|show_stats.*boxplot/is.test(prompt));
  assert.ok(/number.?line.*is not a boxplot|not a boxplot/i.test(prompt));
});

test('show_diagram description warns boxplots are not diagram kinds', () => {
  const sd = WHITEBOARD_TOOLS.find((t) => t.name === 'show_diagram');
  assert.ok(sd, 'show_diagram tool exists');
  assert.ok(/boxplot/i.test(sd!.description), 'mentions boxplot');
  assert.ok(sd!.description.includes('show_stats'), 'points to show_stats');
});

test('R32 verdict-agreement rule includes bidirectional praise-direction check', () => {
  assert.ok(prompt.includes('Before speaking "Right." / "Yes." / "Exactly."'));
  assert.ok(!prompt.includes('✓ "Right — 5.'));
});

test('R38 Task 11: Language policy — one language per session', () => {
  assert.ok(prompt.includes('each session sticks to one language'), 'prompt must include "each session sticks to one language"');
  assert.ok(!prompt.includes('## Multilingual Support'), 'prompt must NOT contain legacy "## Multilingual Support" section');
  assert.ok(!prompt.includes('respond in the same language mix'), 'prompt must NOT contain old "respond in the same language mix" policy');
});

test('rail: curated agenda-item labels must be named naturally on entry, never the rail itself', () => {
  assert.ok(
    prompt.includes('your transition sentence must name it naturally'),
    'prompt must include the curated agenda-item naming sentence',
  );
  assert.ok(
    prompt.includes('Never read multiple labels aloud or narrate the rail itself'),
    'prompt must warn against narrating multiple labels or the rail',
  );
});

test('R40: referencing earlier board content requires a scroll first', () => {
  assert.ok(
    prompt.includes('Referencing earlier board content — scroll to it FIRST'),
    'prompt must include the R40 scroll-before-reference rule',
  );
  assert.ok(
    prompt.includes('call tutor_scroll_whiteboard targeting that item in the SAME turn'),
    'rule must name the tutor_scroll_whiteboard tool',
  );
});

test('Task 4: named agenda-item jump must call advance_lesson before content', () => {
  assert.ok(
    prompt.includes('Named agenda-item jump — advance_lesson BEFORE content'),
    'prompt must include the Task 4 hard-rule heading',
  );
  assert.ok(
    prompt.includes('narrating the move without the tool call freezes the lesson cursor and the agenda display'),
    'prompt must warn that narrating without the tool call freezes the cursor and agenda display',
  );
});

test('R46 (c-i): a named destination overrides closure phrases in the same utterance', () => {
  assert.ok(
    prompt.includes('A destination named in the same utterance OVERRIDES closure phrases'),
    'prompt must include the named-destination-overrides-closure rule',
  );
  assert.ok(
    prompt.includes('Never wrap up or advance to recap unless the student explicitly asks to end the session with no destination named'),
    'prompt must state the never-wrap-with-a-named-destination clause',
  );
});

test('R47 Task 3b: Rule 3b warns against a stray glued $ standing in for a period', () => {
  assert.ok(
    prompt.includes('never leave one stray, glued to the start of the next word as if it were a period'),
    'prompt must include the stray-$ warning sentence',
  );
  assert.ok(
    prompt.includes('a stray dollar sign stood in for the sentence\'s period'),
    'prompt must include the stray-dollar-sign-as-period clause',
  );
  assert.ok(
    prompt.includes('You choose the movie ticket.$What is the opportunity cost of that choice?'),
    'prompt must cite the live stray-$ failure example',
  );
});

test('R48 Task 2: Rule 3e — posed exercises with concrete parts land on the board, not just speech', () => {
  assert.ok(
    prompt.includes('A posed exercise with concrete parts lands on the board, not just in speech'),
    'prompt must include the Rule 3e header phrase',
  );
  assert.ok(
    prompt.includes('"three different sentences" / "two separate examples" / "several ways"'),
    'rule must name the concrete-parts shapes',
  );
  assert.ok(
    prompt.includes("her study of local water quality"),
    'prompt must cite the live voice-only-exercise failure example',
  );
});

// ── R49 first-turn v2 (2026-08-20) ───────────────────────────────────────
// Rule 15 and the anchor-calibration paragraph BOTH tell the brain the board
// may "sit bare through the opening sentences". True mid-lesson, ruinous on
// turn 1: embed-1787073582144 (marketing demo) bounced at 37s having watched
// an empty board for 15.5s, and portal-2d53e403 went 22.6s before its first
// paint and had to be ASKED to use the board. The carve-out withdraws that
// licence for the opener only, and is flag-gated so the default prompt is
// byte-identical.
test('first-turn v2 OFF: prompt is byte-identical to a context without the field', () => {
  assert.equal(buildSystemPrompt({ ...baseCtx, firstTurnV2: false }), prompt);
  assert.equal(buildSystemPrompt({ ...baseCtx }), prompt);
});

test('first-turn v2 ON: adds an opening-turn exception to the bare-board licence', () => {
  const p2 = buildSystemPrompt({ ...baseCtx, firstTurnV2: true });
  assert.notEqual(p2, prompt, 'flag must change the prompt');
  assert.match(p2, /FIRST turn of the session is the one exception/i);
});

test('first-turn v2 ON: names the concrete requirement — a visual inside the opening turn', () => {
  const p2 = buildSystemPrompt({ ...baseCtx, firstTurnV2: true });
  assert.match(p2, /empty board/i);
  assert.match(p2, /first two sentences/i);
});

// ── R49b: the board must not pre-reveal the answer (portal-2d53e403, 481.5s) ──
// The tutor said "let's watch it as one tug of war instead of four separate
// hops" and drew a fresh page whose payload was:
//   points:   0 "Start" (open)
//             3.75 "Wednesday: $3.75"  filled  #16a34a   <- THE ANSWER
//   segments: +12 Saturday (green), +3 Tuesday (green),
//             -4.50 Monday (red), -6.75 Wednesday (red)
// ...and then asked "Team Plus pulls with 15, Team Minus with 11.25. Since
// Plus is bigger, who wins, and by how much?" — a question whose answer was
// already sitting on the board in green. The student noticed.
//
// Not a stray leftover: the brain deliberately carried the previous method's
// result onto the new page. The judge caught the SPOKEN sibling in the same
// turn (`judge_advisory_flag: "Team Plus's total pull is fifteen."`) but
// advisory only, and nothing looks at the board for this at all.
//
// There is already a define-before-quiz guard for TERMS. This is the same
// class for ANSWERS, and it is prompt-side because the brain chose to draw
// it — no runtime check would have known 3.75 was the answer to an
// improvised question.
test('answer-reveal rule OFF: prompt byte-identical without the field', () => {
  assert.equal(buildSystemPrompt({ ...baseCtx, answerRevealGuard: false }), prompt);
  assert.equal(buildSystemPrompt({ ...baseCtx }), prompt);
});

// These assert against the ADDED text only. Asserting against the whole
// prompt is vacuous here: phrases like "same turn" and "different method"
// already occur in other rules, so a naive assert.match(p2, ...) passes
// before the feature exists and proves nothing. (First draft did exactly
// that — two of four assertions were green against an unimplemented rule.)
const addedAnswerRule = (): string => {
  const p2 = buildSystemPrompt({ ...baseCtx, answerRevealGuard: true });
  assert.ok(p2.startsWith(prompt), 'rule must be appended, so the delta is a clean suffix');
  return p2.slice(prompt.length);
};

test('answer-reveal rule ON: the added block forbids rendering the answer being asked for', () => {
  const added = addedAnswerRule();
  assert.ok(added.length > 0, 'flag must add text');
  assert.match(added, /never (?:render|write|draw|put)[^.]{0,80}answer/i);
});

test('answer-reveal rule ON: the added block covers carrying method 1 answer to method 2', () => {
  const added = addedAnswerRule();
  assert.match(added, /second method|different method|another method|re-?derive/i);
});

test('answer-reveal rule ON: the added block covers the spoken sibling the judge only flagged', () => {
  const added = addedAnswerRule();
  assert.match(added, /same breath|same turn/i);
});

test('answer-reveal rule ON: cites the live evidence so the rule is not folklore', () => {
  const added = addedAnswerRule();
  assert.match(added, /3\.75|tug of war/i);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
