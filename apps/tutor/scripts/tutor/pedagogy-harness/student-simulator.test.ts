/**
 * Deterministic unit tests for the Haiku student-simulator (Task H3).
 * No framework — matches scripts/test-conic-construction.ts /
 * scripts/tutor/pedagogy-harness/fixtures/personas/personas.test.ts:
 * node:assert + a tiny test() harness, PASS/FAIL counters, non-zero exit
 * on failure.
 *
 * These tests inject a STUB `complete` (opts.complete) so NO network call
 * is ever made here — see student-simulator.live.ts for the gated real-Haiku
 * smoke (npm run test:pedagogy-sim-live).
 *
 * Run: npm run test:pedagogy-sim
 */

import { strict as assert } from 'node:assert';
import { loadPersona } from './fixtures/personas';
import { simulateStudent, type SimTurn } from './student-simulator';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void | Promise<void>): void | Promise<void> {
  try {
    const r = fn();
    if (r instanceof Promise) {
      return r
        .then(() => { console.log(`  ✓ ${name}`); passed++; })
        .catch((err) => { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; });
    }
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}\n      ${(err as Error).message}`);
    failed++;
  }
}

/** Stub `complete` that just echoes the system prompt back as the "reply",
 *  so tests can assert on exactly what the persona prompt contains without
 *  ever hitting the network. */
function echoSystemStub(): { calls: Array<{ system: string; messages: { role: 'user' | 'assistant'; content: string }[] }>; complete: (system: string, messages: { role: 'user' | 'assistant'; content: string }[]) => Promise<string> } {
  const calls: Array<{ system: string; messages: { role: 'user' | 'assistant'; content: string }[] }> = [];
  return {
    calls,
    complete: async (system, messages) => {
      calls.push({ system, messages });
      return system;
    },
  };
}

async function main() {
  // ── (a) persona system prompt content ─────────────────────────────────
  await test('leo (bluffer): system prompt carries grade/topic/style + wrongness-per-actualLevel, no AI-reveal leak', async () => {
    const leo = loadPersona('leo');
    const stub = echoSystemStub();
    await simulateStudent(leo, 'Great, let\'s factor some quadratics!', [], { complete: stub.complete });
    assert.equal(stub.calls.length, 1);
    const sys = stub.calls[0].system;
    assert.ok(sys.includes(leo.simProfile.grade), 'mentions grade');
    assert.ok(sys.includes(leo.simProfile.topic), 'mentions topic');
    assert.ok(sys.includes(leo.simProfile.style), 'mentions style');
    assert.ok(/wrong|mistake|mis-sign|error/i.test(sys), 'instructs the bluffer to answer wrong when actually tested');
    assert.ok(sys.includes(leo.simProfile.actualLevel), 'carries the actualLevel detail that drives what the wrong answer looks like');
    assert.ok(!/you are (an ai|claude|a language model)/i.test(sys), 'no "reveal you are an AI" leak');
    assert.ok(!/\breveal\b.*\bai\b/i.test(sys), 'no explicit instruction to reveal AI-ness');
  });

  await test('aria (beginner): system prompt instructs honest underclaiming / "I don\'t know"', async () => {
    const aria = loadPersona('aria');
    const stub = echoSystemStub();
    await simulateStudent(aria, 'What do you know about fractions?', [], { complete: stub.complete });
    const sys = stub.calls[0].system;
    assert.ok(sys.includes(aria.simProfile.grade), 'mentions grade');
    assert.ok(sys.includes(aria.simProfile.topic), 'mentions topic');
    assert.ok(/don't know|do not know|honest/i.test(sys), 'instructs honest not-knowing');
  });

  await test('anon (anxious/terse): system prompt caps replies at ~8 words and instructs disengage-on-boring-opener', async () => {
    const anon = loadPersona('anon');
    const stub = echoSystemStub();
    await simulateStudent(anon, 'Today we will learn about ratios.', [], { complete: stub.complete });
    const sys = stub.calls[0].system;
    assert.ok(/8 words|eight words/i.test(sys), 'caps replies at 8 words');
    assert.ok(/\[\[END\]\]/.test(sys), 'documents the [[END]] sentinel for disengagement');
    assert.ok(/bor(e|ing)|lectur/i.test(sys), 'instructs disengage on a boring opener / long lecture');
  });

  await test('tara (parent-probing): system prompt carries the parent role override + mandatory other-teachers probe on turn 2/3 + later content question', async () => {
    const tara = loadPersona('tara');
    const stub = echoSystemStub();
    await simulateStudent(tara, 'Hi there! Ready to look at ratios together?', [], { complete: stub.complete });
    const sys = stub.calls[0].system;
    assert.ok(/ROLE OVERRIDE/.test(sys), 'parent role override present');
    assert.ok(/PARENT/.test(sys) && /on behalf of your grade 6 child/.test(sys), 'speaks as the parent of the grade-6 child');
    assert.ok(/SECOND or THIRD reply/.test(sys), 'probe pinned to turn 2 or 3');
    assert.ok(/Do you have other teachers\? How many are there\? Can we pick a different one for my kid\?/.test(sys), 'carries the canonical probe wording');
    assert.ok(/exactly once/.test(sys), 'probe fires once');
    assert.ok(/LATER in the session/.test(sys) && /NORMAL content question/.test(sys), 'later normal content question mandated');
  });

  // ── (b) [[END]] parsing ────────────────────────────────────────────────
  await test('[[END]] in the stub output yields ended:true and is stripped from text', async () => {
    const anon = loadPersona('anon');
    const stub = { complete: async () => 'k bye. [[END]]' };
    const result = await simulateStudent(anon, 'Today we will learn about ratios.', [], { complete: stub.complete });
    assert.equal(result.ended, true);
    assert.equal(result.text, 'k bye.');
    assert.ok(!result.text.includes('[[END]]'));
  });

  await test('no [[END]] in the stub output yields ended:false and text unchanged', async () => {
    const leo = loadPersona('leo');
    const stub = { complete: async () => 'sure, x^2 - 5x + 6 factors to (x+2)(x+3)' };
    const result = await simulateStudent(leo, 'Factor x^2 - 5x + 6', [], { complete: stub.complete });
    assert.equal(result.ended, false);
    assert.equal(result.text, 'sure, x^2 - 5x + 6 factors to (x+2)(x+3)');
  });

  // ── (c) history round-trips with correct role mapping ─────────────────
  await test('history is passed through as prior turns with tutor->user, student->assistant role mapping', async () => {
    const maya = loadPersona('maya');
    const stub = echoSystemStub();
    const history: SimTurn[] = [
      { role: 'tutor', text: 'Hi! Ready to start?' },
      { role: 'student', text: 'sure' },
    ];
    await simulateStudent(maya, 'Let\'s dive in.', history, { complete: stub.complete });
    const { messages } = stub.calls[0];
    assert.equal(messages.length, 3, 'two history turns + the current tutor utterance');
    assert.deepEqual(messages[0], { role: 'user', content: 'Hi! Ready to start?' });
    assert.deepEqual(messages[1], { role: 'assistant', content: 'sure' });
    assert.deepEqual(messages[2], { role: 'user', content: 'Let\'s dive in.' });
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
