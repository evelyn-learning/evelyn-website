import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';
import { signRequest } from '../dist/esm/index.js';
import { vectors } from './helpers.mjs';

const { partnerId, secret } = vectors;

for (const vector of vectors.requests) {
  test(`request signature matches the engine's: ${vector.name}`, () => {
    const headers = signRequest({ method: vector.method, path: vector.path, body: vector.body || undefined, partnerId, secret, timestamp: vector.timestamp });
    // The engine's verifier: hex HMAC-SHA256 of `${timestamp}.${METHOD}.${pathname + search}.${rawBody}` (portal/auth.ts).
    const expected = createHmac('sha256', secret).update(`${vector.timestamp}.${vector.method.toUpperCase()}.${vector.path}.${vector.body}`).digest('hex');
    assert.deepEqual(headers, { 'x-evelyn-partner': partnerId, 'x-evelyn-timestamp': String(vector.timestamp), 'x-evelyn-signature': vector.signature });
    assert.equal(headers['x-evelyn-signature'], expected);
  });
}

test('the timestamp defaults to now, in milliseconds', () => {
  const before = Date.now();
  const timestamp = Number(signRequest({ method: 'GET', path: '/api/portal/v1/usage', partnerId, secret })['x-evelyn-timestamp']);
  assert.ok(timestamp >= before && timestamp <= Date.now());
});

test('bad input is refused', () => {
  assert.throws(() => signRequest({ method: 'GET', path: 'api/portal/v1/usage', partnerId, secret }), /must start with "\/"/);
  assert.throws(() => signRequest({ method: 'GET', path: 'https://www.evelynlearning.com/api/portal/v1/usage', partnerId, secret }), /must start with "\/"/);
  assert.throws(() => signRequest({ method: 'POST', path: '/x', body: { a: 1 }, partnerId, secret }), /raw string/);
  assert.throws(() => signRequest({ method: 'GET', path: '/x', partnerId }), /secret is required/);
  assert.throws(() => signRequest({ method: 'GET', path: '/x', secret }), /partnerId is required/);
});
