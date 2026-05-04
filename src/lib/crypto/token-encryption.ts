import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getKey(): Buffer {
  const hex = process.env.TOKEN_ENCRYPTION_KEY;
  if (!hex) {
    throw new Error('TOKEN_ENCRYPTION_KEY is not set. Run: npx ts-node scripts/generate-token-encryption-key.ts');
  }
  if (hex.length !== 64) {
    throw new Error('TOKEN_ENCRYPTION_KEY must be 64 hex characters (32 bytes).');
  }
  return Buffer.from(hex, 'hex');
}

export function encryptToken(plaintext: string): string {
  if (!plaintext) return '';
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

export function decryptToken(payload: string): string {
  if (!payload) return '';
  const key = getKey();
  const buf = Buffer.from(payload, 'base64');
  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = buf.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}
