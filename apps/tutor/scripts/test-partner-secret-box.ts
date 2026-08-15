/**
 * Partner secret encryption tests (M1c Task 1).
 *
 * Run: `npm run test:partner-secret-box`
 *
 * D15-R1: secrets are ENCRYPTED, not hashed, because HMAC verification
 * needs the plaintext back. These tests pin that round-trip and the
 * failure modes that must be distinguishable from a signature mismatch.
 *
 * Style mirrors scripts/test-portal-auth.ts.
 */
import assert from 'node:assert';
import { randomBytes } from 'node:crypto';

process.env.PORTAL_SECRET_ENC_KEY = randomBytes(32).toString('base64');

import {
  encryptSecret,
  decryptSecret,
  SecretDecryptError,
} from '@/lib/tutor/portal/secret-box';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

(async () => {

await test('round-trips a secret', () => {
  const sealed = encryptSecret('super-secret-a');
  assert.strictEqual(decryptSecret(sealed), 'super-secret-a');
});

await test('ciphertext is not the plaintext and differs per call (random IV)', () => {
  const a = encryptSecret('same-input');
  const b = encryptSecret('same-input');
  assert.ok(!a.ciphertext.includes('same-input'));
  assert.notStrictEqual(a.ciphertext, b.ciphertext, 'IV must be random per encryption');
  assert.strictEqual(decryptSecret(a), decryptSecret(b));
});

await test('records a keyVersion', () => {
  assert.strictEqual(encryptSecret('x').keyVersion, 1);
});

await test('a wrong key throws SecretDecryptError, not a generic error', () => {
  const sealed = encryptSecret('super-secret-a');
  const wrong = randomBytes(32);
  assert.throws(() => decryptSecret(sealed, wrong), SecretDecryptError);
});

await test('a tampered ciphertext throws (GCM auth tag rejects it)', () => {
  const sealed = encryptSecret('super-secret-a');
  const buf = Buffer.from(sealed.ciphertext, 'base64');
  buf[buf.length - 1] ^= 0xff;
  assert.throws(
    () => decryptSecret({ ...sealed, ciphertext: buf.toString('base64') }),
    SecretDecryptError,
  );
});

await test('a missing PORTAL_SECRET_ENC_KEY throws a clearly-named error', () => {
  const saved = process.env.PORTAL_SECRET_ENC_KEY;
  delete process.env.PORTAL_SECRET_ENC_KEY;
  try {
    assert.throws(() => encryptSecret('x'), /PORTAL_SECRET_ENC_KEY/);
  } finally {
    process.env.PORTAL_SECRET_ENC_KEY = saved;
  }
});

await test('a wrong-length explicit key throws naming the length problem, on encrypt too', () => {
  assert.throws(() => encryptSecret('x', randomBytes(16)), /32 bytes/);
});

await test('round-trips an empty-string secret', () => {
  assert.strictEqual(decryptSecret(encryptSecret('')), '');
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
