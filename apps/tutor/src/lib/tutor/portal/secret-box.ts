/**
 * Symmetric encryption for partner API secrets (M1c, D15-R1).
 *
 * D15 said "hashed secret". That is not implementable: the portal contract
 * authenticates with an HMAC over the request body, so the engine must
 * RECOMPUTE the signature and therefore needs the plaintext secret back.
 * A hash is one-way. The contract is frozen, so the scheme cannot move to a
 * hash-comparable bearer token.
 *
 * AES-256-GCM gives us confidentiality at rest plus an auth tag, so a
 * tampered ciphertext fails loudly instead of decrypting to garbage that
 * would later surface as an unexplained signature mismatch.
 *
 * The key lives in PORTAL_SECRET_ENC_KEY (base64, 32 bytes). Losing it means
 * every partner must re-key — back it up with the other production secrets.
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/** Bump when the encryption key is rotated; stored per secret. */
export const CURRENT_KEY_VERSION = 1;

const IV_BYTES = 12;   // GCM standard
const TAG_BYTES = 16;

export interface SealedSecret {
  /** base64( iv | authTag | ciphertext ) */
  ciphertext: string;
  keyVersion: number;
}

export class SecretDecryptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecretDecryptError';
  }
}

function resolveKey(explicit?: Buffer): Buffer {
  let key: Buffer;
  if (explicit) {
    key = explicit;
  } else {
    const raw = process.env.PORTAL_SECRET_ENC_KEY;
    if (!raw) {
      throw new Error(
        'PORTAL_SECRET_ENC_KEY is not set — partner secrets cannot be sealed or opened.',
      );
    }
    key = Buffer.from(raw, 'base64');
  }
  // Validated regardless of source: an explicit key that's the wrong length
  // is a programmer error, not a decrypt failure — it must throw here, before
  // createCipheriv/createDecipheriv would raise a raw, unnamed RangeError.
  if (key.length !== 32) {
    throw new Error(
      explicit
        ? `encryption key must be 32 bytes, got ${key.length}`
        : `PORTAL_SECRET_ENC_KEY must decode to 32 bytes, got ${key.length}`,
    );
  }
  return key;
}

export function encryptSecret(plaintext: string, key?: Buffer): SealedSecret {
  const k = resolveKey(key);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', k, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: Buffer.concat([iv, tag, enc]).toString('base64'),
    keyVersion: CURRENT_KEY_VERSION,
  };
}

export function decryptSecret(sealed: SealedSecret, key?: Buffer): string {
  const k = resolveKey(key);
  let buf: Buffer;
  try {
    buf = Buffer.from(sealed.ciphertext, 'base64');
  } catch {
    throw new SecretDecryptError('ciphertext is not valid base64');
  }
  if (buf.length < IV_BYTES + TAG_BYTES) {
    throw new SecretDecryptError('ciphertext is too short to contain iv + tag');
  }
  const iv = buf.subarray(0, IV_BYTES);
  const tag = buf.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const enc = buf.subarray(IV_BYTES + TAG_BYTES);
  try {
    const decipher = createDecipheriv('aes-256-gcm', k, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
  } catch {
    // Deliberately generic: "wrong key" and "tampered ciphertext" collapse to
    // the same message on purpose. Distinguishing them in the error would
    // hand an attacker a decryption oracle. Do not split this message out
    // by cause, even though it makes debugging a genuine key-rotation
    // mistake slightly less direct.
    throw new SecretDecryptError(
      `failed to open sealed secret (keyVersion=${sealed.keyVersion}) — wrong key or tampered value`,
    );
  }
}
