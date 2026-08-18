// apps/tutor/scripts/tutor/verdict-bank/provider.test.ts
/**
 * Scripted turn provider for the probe bank (2026-08-18 plan, Task 4). Pure
 * unit test — hand-built ctx objects, no browser, no network. Task 5 wires
 * makeProbeProvider(probe) straight into run-harness.ts's
 * opts.studentTurnProvider seam (Task 2).
 */
import { makeProbeProvider } from './provider';
import type { VerdictProbe } from './types';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.error(`  ✗ ${name}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`); }
  else console.log(`  ✓ ${name}`);
}

function baseProbe(overrides: Partial<VerdictProbe> = {}): VerdictProbe {
  return {
    id: 'test-probe',
    cell: { provenance: 'test', relation: 'test', answerType: 'test' },
    start: { subject: 'Math', level: 'Grade 8', topic: 'Order of operations' },
    kickoff: 'Can you help me with order of operations?',
    turns: [],
    expected: 'affirm',
    notes: 'unit-test fixture',
    ...overrides,
  };
}

function ctx(turnIndex: number, toolCalls: unknown[] = []) {
  return { tutorText: 'tutor said something', turnIndex, history: [], toolCalls };
}

console.log('makeProbeProvider');

// say-turn passthrough
{
  const probe = baseProbe({ turns: [{ say: 'One eighth.' }] });
  const provider = makeProbeProvider(probe);
  check('say-turn passthrough', provider(ctx(0)), { text: 'One eighth.', ended: false });
}

// compute-turn with computable latex → evaluated display, last match tried first
{
  const probe = baseProbe({
    turns: [{ compute: 'board-expression', fallbackSay: 'I got an answer, is that right?' }],
  });
  const provider = makeProbeProvider(probe);
  check(
    'compute-turn evaluates board latex',
    provider(ctx(0, [{ latex: '24 \\div 4 \\cdot 3 - 5' }])),
    { text: '13. Right?', ended: false },
  );
}

// compute-turn with prefix
{
  const probe = baseProbe({
    turns: [{ compute: 'board-expression', prefix: 'I think it is ', fallbackSay: 'fallback' }],
  });
  const provider = makeProbeProvider(probe);
  check(
    'compute-turn with prefix',
    provider(ctx(0, [{ latex: '2 + 2' }])),
    { text: 'I think it is 4. Right?', ended: false },
  );
}

// compute-turn with no latex anywhere → fallbackSay
{
  const probe = baseProbe({
    turns: [{ compute: 'board-expression', fallbackSay: 'I am not sure how to write that.' }],
  });
  const provider = makeProbeProvider(probe);
  check(
    'compute-turn no latex → fallbackSay',
    provider(ctx(0, [{ message: 'tool ran', data: { foo: 'bar' } }])),
    { text: 'I am not sure how to write that.', ended: false },
  );
}

// exhaustion → ended sentinel
{
  const probe = baseProbe({ turns: [{ say: 'only turn' }] });
  const provider = makeProbeProvider(probe);
  check(
    'exhaustion → ended sentinel',
    provider(ctx(1)),
    { text: 'thanks, that is all for now.', ended: true },
  );
}

// RULING extra #1: real captured tool-call shape — { message, data } with no
// structured latex field anywhere → falls back cleanly, exactly as every
// real run will today (no debug event currently carries structured latex).
{
  const probe = baseProbe({
    turns: [{ compute: 'board-expression', fallbackSay: 'Did I get that right?' }],
  });
  const provider = makeProbeProvider(probe);
  check(
    'real captured tool-call shape (message/data, no latex) → fallbackSay',
    provider(ctx(0, [{ message: 'Whiteboard tool: show_equation', data: undefined }])),
    { text: 'Did I get that right?', ended: false },
  );
}

// RULING extra #2: nested latex (e.g. inside a `data` payload) IS found by
// the recursive search.
{
  const probe = baseProbe({
    turns: [{ compute: 'board-expression', fallbackSay: 'fallback' }],
  });
  const provider = makeProbeProvider(probe);
  check(
    'nested latex under data.latex is found recursively',
    provider(ctx(0, [{ message: 'Whiteboard tool: show_equation', data: { latex: '2 + 2' } }])),
    { text: '4. Right?', ended: false },
  );
}

if (failures > 0) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log('\nAll verdict-provider checks passed.');
