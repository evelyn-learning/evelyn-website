/**
 * Deterministic unit tests for extract-social-threads (Task D2).
 * No framework — matches scripts/tutor/pedagogy-harness/student-simulator.test.ts:
 * node:assert + a tiny test() harness, PASS/FAIL counters, non-zero exit
 * on failure.
 *
 * These tests inject a STUB `complete` (opts.complete) so NO network call
 * is ever made here — run with ANTHROPIC_API_KEY unset to prove it.
 *
 * Run: npm run test:pedagogy-d2
 */

import { strict as assert } from 'node:assert';
import type { SocialThread } from '@evelyn/portal-contract/v1';
import { extractSocialThreads, type CompleteFn } from './extract-social-threads';

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

/** Stub `complete` that records every call and returns a fixed response. */
function recordingStub(response: string): {
  calls: Array<{ system: string; messages: { role: 'user' | 'assistant'; content: string }[] }>;
  complete: CompleteFn;
} {
  const calls: Array<{ system: string; messages: { role: 'user' | 'assistant'; content: string }[] }> = [];
  return {
    calls,
    complete: async (system, messages) => {
      calls.push({ system, messages });
      return response;
    },
  };
}

function thread(id: string, note: string, kind?: SocialThread['kind']): SocialThread {
  return { id, note, kind, capturedAt: '2026-07-01T00:00:00.000Z' };
}

const FOOTBALL_TRANSCRIPT: Array<{ role: 'tutor' | 'student'; text: string }> = [
  { role: 'tutor', text: 'Hey! How was your weekend?' },
  { role: 'student', text: 'Good — I played football with my cousins. Also I have a bio test on Friday.' },
  { role: 'tutor', text: 'Nice! Let\'s make sure you\'re ready for that test.' },
];

async function main() {
  // 1. New interest + event candidates flow through from the stub.
  await test('student mentions football + bio test Friday -> interest and event candidates', async () => {
    const stub = recordingStub(JSON.stringify({
      suggestedThreads: [
        { kind: 'interest', note: 'Plays football with cousins' },
        { kind: 'event', note: 'Has a bio test on Friday' },
      ],
      referencedThreadIds: [],
    }));
    const result = await extractSocialThreads(FOOTBALL_TRANSCRIPT, [], { complete: stub.complete });
    assert.equal(result.suggestedThreads.length, 2);
    assert.deepEqual(result.suggestedThreads[0], { kind: 'interest', note: 'Plays football with cousins' });
    assert.deepEqual(result.suggestedThreads[1], { kind: 'event', note: 'Has a bio test on Friday' });
    assert.deepEqual(result.referencedThreadIds, []);
    // Exactly one LLM call, transcript delivered as the user message.
    assert.equal(stub.calls.length, 1);
    assert.equal(stub.calls[0].messages.length, 1);
    assert.equal(stub.calls[0].messages[0].role, 'user');
    assert.ok(stub.calls[0].messages[0].content.includes('played football'));
  });

  // 2. Referenced existing thread id comes back.
  await test('tutor references existing Spider-Man thread -> t1 in referencedThreadIds', async () => {
    const existing = [thread('t1', 'Spider-Man movies', 'interest')];
    const stub = recordingStub(JSON.stringify({ suggestedThreads: [], referencedThreadIds: ['t1'] }));
    const result = await extractSocialThreads(FOOTBALL_TRANSCRIPT, existing, { complete: stub.complete });
    assert.deepEqual(result.referencedThreadIds, ['t1']);
  });

  // 3. Dedupe against existing threads (case-insensitive substring either way).
  await test('suggested note that substring-matches an existing thread is dropped', async () => {
    const existing = [thread('t1', 'Plays football on weekends', 'interest')];
    const stub = recordingStub(JSON.stringify({
      suggestedThreads: [
        { kind: 'interest', note: 'plays FOOTBALL' }, // substring of existing (case-insensitive)
        { kind: 'event', note: 'Has a bio test on Friday' },
      ],
      referencedThreadIds: [],
    }));
    const result = await extractSocialThreads(FOOTBALL_TRANSCRIPT, existing, { complete: stub.complete });
    assert.equal(result.suggestedThreads.length, 1);
    assert.deepEqual(result.suggestedThreads[0], { kind: 'event', note: 'Has a bio test on Friday' });
  });

  // 4. Defensive parse — garbage never throws.
  await test('non-JSON stub output -> empty results, no throw', async () => {
    const stub = recordingStub('Sorry, I cannot do that. Here are some thoughts instead...');
    const result = await extractSocialThreads(FOOTBALL_TRANSCRIPT, [], { complete: stub.complete });
    assert.deepEqual(result, { suggestedThreads: [], referencedThreadIds: [] });
  });

  await test('stub that THROWS -> empty results, no throw (session close never breaks)', async () => {
    const boom: CompleteFn = async () => { throw new Error('network down'); };
    const result = await extractSocialThreads(FOOTBALL_TRANSCRIPT, [], { complete: boom });
    assert.deepEqual(result, { suggestedThreads: [], referencedThreadIds: [] });
  });

  await test('JSON embedded in prose is still recovered', async () => {
    const stub = recordingStub(
      'Here is the extraction:\n{"suggestedThreads":[{"kind":"context","note":"Has a younger sister"}],"referencedThreadIds":[]}\nDone.',
    );
    const result = await extractSocialThreads(FOOTBALL_TRANSCRIPT, [], { complete: stub.complete });
    assert.deepEqual(result.suggestedThreads, [{ kind: 'context', note: 'Has a younger sister' }]);
  });

  // 5. Enum/length hygiene + cap at 5.
  await test('invalid kind dropped, >120-char note dropped, suggestions capped at 5', async () => {
    const longNote = 'x'.repeat(121);
    const stub = recordingStub(JSON.stringify({
      suggestedThreads: [
        { kind: 'skill_level', note: 'Is bad at fractions' },        // invalid kind -> dropped
        { kind: 'interest', note: longNote },                         // too long -> dropped
        { kind: 'interest', note: '' },                               // empty -> dropped
        { kind: 'interest', note: 'Likes chess' },
        { kind: 'interest', note: 'Likes drawing' },
        { kind: 'event', note: 'Soccer game Saturday' },
        { kind: 'context', note: 'Has a dog named Rex' },
        { kind: 'context', note: 'Takes the bus to school' },
        { kind: 'interest', note: 'Likes baking' },                   // 6th valid -> capped
      ],
      referencedThreadIds: [],
    }));
    const result = await extractSocialThreads(FOOTBALL_TRANSCRIPT, [], { complete: stub.complete });
    assert.equal(result.suggestedThreads.length, 5);
    const notes = result.suggestedThreads.map((s) => s.note);
    assert.ok(!notes.includes('Is bad at fractions'), 'invalid kind dropped');
    assert.ok(!notes.includes(longNote), 'over-length note dropped');
    assert.ok(!notes.includes(''), 'empty note dropped');
    assert.ok(!notes.includes('Likes baking'), 'capped at 5 valid suggestions');
    assert.deepEqual(notes, [
      'Likes chess', 'Likes drawing', 'Soccer game Saturday', 'Has a dog named Rex', 'Takes the bus to school',
    ]);
  });

  // 6. System prompt carries the guardrails + existing threads with ids.
  await test('system prompt contains anti-creepy + no-pedagogy constraints and existing threads with ids', async () => {
    const existing = [
      thread('t1', 'Spider-Man movies', 'interest'),
      thread('t2', 'Has a bio test coming up', 'event'),
    ];
    const stub = recordingStub(JSON.stringify({ suggestedThreads: [], referencedThreadIds: [] }));
    await extractSocialThreads(FOOTBALL_TRANSCRIPT, existing, { complete: stub.complete });
    assert.equal(stub.calls.length, 1);
    const sys = stub.calls[0].system;
    // Anti-creepy / sensitive-info constraints.
    assert.ok(/sensitive/i.test(sys), 'mentions not storing sensitive info');
    assert.ok(/health|medical/i.test(sys), 'names health/medical as off-limits');
    assert.ok(/family conflict/i.test(sys), 'names family conflict as off-limits');
    assert.ok(/creepy|invasive/i.test(sys), 'invokes the parent-review creepiness bar');
    // No-pedagogy constraints.
    assert.ok(/pedagogical/i.test(sys), 'excludes pedagogical claims');
    assert.ok(/skill level/i.test(sys), 'names skill levels as excluded');
    assert.ok(/mistake/i.test(sys), 'names mistakes as excluded');
    assert.ok(/mastery/i.test(sys), 'routes pedagogy to mastery, not social memory');
    // Student-volunteered-only + short neutral notes.
    assert.ok(/ACTUALLY SAID|actually said/i.test(sys), 'only what the student actually said');
    assert.ok(/12 words/.test(sys), 'caps notes at ~12 words');
    assert.ok(/fact.*not a judgment|not a judgment/i.test(sys), 'facts not judgments');
    // Existing threads listed with their ids.
    assert.ok(sys.includes('t1'), 'lists existing thread id t1');
    assert.ok(sys.includes('Spider-Man movies'), 'lists existing thread note');
    assert.ok(sys.includes('t2'), 'lists existing thread id t2');
    assert.ok(sys.includes('Has a bio test coming up'), 'lists second existing note');
  });

  // 7. referencedThreadIds filtered to known ids.
  await test('unknown referenced id dropped; known ids kept; duplicates collapsed', async () => {
    const existing = [thread('t1', 'Spider-Man movies', 'interest')];
    const stub = recordingStub(JSON.stringify({
      suggestedThreads: [],
      referencedThreadIds: ['t1', 'ghost-id', 't1', 42],
    }));
    const result = await extractSocialThreads(FOOTBALL_TRANSCRIPT, existing, { complete: stub.complete });
    assert.deepEqual(result.referencedThreadIds, ['t1']);
  });

  // Extra hygiene: malformed top-level shapes never throw.
  await test('non-array suggestedThreads / referencedThreadIds -> empty arrays', async () => {
    const stub = recordingStub(JSON.stringify({ suggestedThreads: 'nope', referencedThreadIds: { t1: true } }));
    const result = await extractSocialThreads(FOOTBALL_TRANSCRIPT, [], { complete: stub.complete });
    assert.deepEqual(result, { suggestedThreads: [], referencedThreadIds: [] });
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
