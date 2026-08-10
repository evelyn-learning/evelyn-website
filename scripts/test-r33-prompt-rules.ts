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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
