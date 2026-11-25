import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';
import { createSessionToken, createSessionUrl, sessionUrl, verifySessionToken, EvelynConfigError } from '../dist/esm/index.js';
import { vectors } from './helpers.mjs';

const { partnerId, secret } = vectors;

/** The engine's signer, written out from apps/tutor/src/lib/tutor/portal/embed-token.ts (signEmbedToken). */
function engineSign(payload, key) {
  const b64url = (input) => Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  return `${header}.${body}.${b64url(createHmac('sha256', key).update(`${header}.${body}`).digest())}`;
}

for (const vector of vectors.tokens) {
  test(`token is byte-identical to the engine's: ${vector.name}`, () => {
    const token = createSessionToken(vector.claims, { partnerId, secret, issuedAt: vector.issuedAt, expiresInSeconds: vector.expiresInSeconds });
    assert.equal(token, vector.token);
    assert.equal(token, engineSign({ partner_id: partnerId, ...vector.claims, iat: vector.issuedAt, exp: vector.issuedAt + vector.expiresInSeconds }, secret));
    assert.equal(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'), vector.payloadJson);
  });
}

test('a token round-trips through verifySessionToken', () => {
  const before = Math.floor(Date.now() / 1000);
  const token = createSessionToken({ student_id: 'stu_1', topic: 'Fractions', tutor_languages: ['ja'] }, { partnerId, secret });
  const claims = verifySessionToken(token, secret);
  assert.equal(claims.partner_id, partnerId);
  assert.equal(claims.student_id, 'stu_1');
  assert.deepEqual(claims.tutor_languages, ['ja']);
  assert.ok(claims.iat >= before && claims.iat <= before + 2);
  assert.equal(claims.exp - claims.iat, 7200);
  assert.deepEqual(JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString()), { alg: 'HS256', typ: 'JWT' });
});

test('verifySessionToken refuses a wrong secret, an expired token and a malformed one', () => {
  const token = createSessionToken({ student_id: 'stu_1' }, { partnerId, secret, issuedAt: 1000, expiresInSeconds: 60 });
  assert.throws(() => verifySessionToken(token, 'another-secret', { now: 1001 }), /Bad signature/);
  assert.throws(() => verifySessionToken(token, secret, { now: 1061 }), /expired/);
  assert.equal(verifySessionToken(token, secret, { now: 1060 }).student_id, 'stu_1');
  assert.throws(() => verifySessionToken('not-a-token', secret), /three parts/);
  const [header, payload, signature] = token.split('.');
  const forged = Buffer.from(JSON.stringify({ partner_id: partnerId, student_id: 'someone-else' })).toString('base64url');
  assert.throws(() => verifySessionToken(`${header}.${forged}.${signature}`, secret), /Bad signature/);
  assert.throws(() => verifySessionToken(`${Buffer.from('{"alg":"none"}').toString('base64url')}.${payload}.`, secret), /HS256/);
});

test('claims with obvious mistakes are refused with a message that says what to change', () => {
  const options = { partnerId, secret };
  const refuses = (claims, pattern, opts = options) => assert.throws(() => createSessionToken(claims, opts), (err) => err instanceof EvelynConfigError && pattern.test(err.message));
  refuses({}, /student_id is required/);
  refuses({ student_id: '  ' }, /student_id is required/);
  refuses(null, /must be an object/);
  refuses({ student_id: 's', tutor_languages: 'zh-TW' }, /tutor_languages must be an array/);
  refuses({ student_id: 's', tutor_languages: [] }, /tutor_languages must be an array/);
  refuses({ student_id: 's', max_duration_minutes: 0 }, /1 to 120/);
  refuses({ student_id: 's', max_duration_minutes: 121 }, /1 to 120/);
  refuses({ student_id: 's', max_duration_minutes: '30' }, /1 to 120/);
  refuses({ student_id: 's', input_mode: 'speech' }, /"voice" or "text"/);
  refuses({ student_id: 's', partner_id: 'other' }, /Leave "partner_id" out/);
  refuses({ student_id: 's', exp: 1 }, /Leave "exp" out/);
  refuses({ student_id: 's' }, /partnerId is required/, { secret });
  refuses({ student_id: 's' }, /secret is required/, { partnerId });
  refuses({ student_id: 's' }, /expiresInSeconds/, { partnerId, secret, expiresInSeconds: 0 });
  assert.ok(createSessionToken({ student_id: 's', max_duration_minutes: 1 }, options));
  assert.ok(createSessionToken({ student_id: 's', max_duration_minutes: 120 }, options));
});

test('claims left undefined are not written into the token', () => {
  const token = createSessionToken({ student_id: 's', topic: undefined }, { partnerId, secret, issuedAt: 1 });
  assert.deepEqual(Object.keys(verifySessionToken(token, secret, { now: 1 })), ['partner_id', 'student_id', 'iat', 'exp']);
});

test('sessionUrl and createSessionUrl build the embed URL', () => {
  assert.equal(sessionUrl('a.b.c'), 'https://tutor.evelynlearning.com/embed?token=a.b.c');
  assert.equal(sessionUrl('a.b.c', { host: 'http://localhost:3007/' }), 'http://localhost:3007/embed?token=a.b.c');
  const url = new URL(createSessionUrl({ student_id: 'stu_1' }, { partnerId, secret }));
  assert.equal(url.origin + url.pathname, 'https://tutor.evelynlearning.com/embed');
  assert.equal(verifySessionToken(url.searchParams.get('token'), secret).student_id, 'stu_1');
});
