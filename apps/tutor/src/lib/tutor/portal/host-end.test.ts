/**
 * Host → embed "end" channel + student-activity throttle (GreenApple spec
 * 2026-10-02 §1). Pure helpers only — the embed page wires them.
 *
 * Run: npm run test:host-end
 */
import { strict as assert } from 'node:assert';
import {
  HOST_END_REASONS,
  parseHostEnd,
  goodbyeFor,
  isAllowedHostOrigin,
  shouldPostActivity,
  ACTIVITY_THROTTLE_MS,
} from './host-end';

let passed = 0, failed = 0;
function test(name: string, fn: () => void): void {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

test('HOST_END_REASONS is exactly the four spec reasons', () => {
  assert.deepEqual([...HOST_END_REASONS], ['finished', 'minutes_exhausted', 'no_input', 'idle']);
});

test('parseHostEnd accepts each of the four reasons', () => {
  for (const reason of HOST_END_REASONS) {
    assert.deepEqual(parseHostEnd({ type: 'evelyn:host_end', reason }), { reason });
  }
});

test('parseHostEnd ignores extra fields but returns only the reason', () => {
  assert.deepEqual(parseHostEnd({ type: 'evelyn:host_end', reason: 'idle', extra: 1 }), { reason: 'idle' });
});

test('parseHostEnd rejects unknown reasons, wrong types and garbage', () => {
  const bad: unknown[] = [
    null, undefined, 'evelyn:host_end', 42, [], {},
    { type: 'evelyn:host_end' },
    { type: 'evelyn:host_end', reason: 'time_limit' },
    { type: 'evelyn:host_end', reason: 'FINISHED' },
    { type: 'evelyn:host_end', reason: 1 },
    { type: 'evelyn:session_ended', reason: 'finished' },
    { type: 'evelyn:host-end', reason: 'finished' },
    { reason: 'finished' },
  ];
  for (const b of bad) assert.equal(parseHostEnd(b), null, JSON.stringify(b));
});

test('isAllowedHostOrigin: unset expected accepts any origin', () => {
  assert.equal(isAllowedHostOrigin('https://campus.example', undefined), true);
});

test('isAllowedHostOrigin: exact match only when expected is set', () => {
  assert.equal(isAllowedHostOrigin('https://campus.example', 'https://campus.example'), true);
  assert.equal(isAllowedHostOrigin('https://evil.example', 'https://campus.example'), false);
  assert.equal(isAllowedHostOrigin('https://campus.example:8443', 'https://campus.example'), false);
  assert.equal(isAllowedHostOrigin('http://campus.example', 'https://campus.example'), false);
  assert.equal(isAllowedHostOrigin('', 'https://campus.example'), false);
});

test('goodbyeFor: spec lines, non-empty, distinct for the three groups; idle = no_input', () => {
  assert.equal(goodbyeFor('finished'), 'Nice work today — that\'s the session.');
  assert.equal(goodbyeFor('minutes_exhausted'), 'Your program\'s tutoring minutes for this month are used up. See you next month.');
  assert.equal(goodbyeFor('no_input'), 'I\'ll stop here since it\'s gone quiet — come back any time.');
  assert.equal(goodbyeFor('idle'), goodbyeFor('no_input'));
  for (const r of HOST_END_REASONS) assert.ok(goodbyeFor(r).trim().length > 0, r);
  const groups = new Set([goodbyeFor('finished'), goodbyeFor('minutes_exhausted'), goodbyeFor('no_input')]);
  assert.equal(groups.size, 3);
});

test('shouldPostActivity: first post always allowed', () => {
  assert.equal(shouldPostActivity(null, 1_000), true);
});

test('shouldPostActivity: throttles to one per 5 s', () => {
  assert.equal(ACTIVITY_THROTTLE_MS, 5000);
  assert.equal(shouldPostActivity(10_000, 10_000), false);
  assert.equal(shouldPostActivity(10_000, 14_999), false);
  assert.equal(shouldPostActivity(10_000, 15_000), true);
  assert.equal(shouldPostActivity(10_000, 60_000), true);
});

test('shouldPostActivity: a clock that went backwards re-allows a post', () => {
  assert.equal(shouldPostActivity(10_000, 9_000), true);
});

console.log(`\nhost-end: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
