/**
 * SERVER ONLY. The pre-check's correct value, sealed so that the browser can
 * carry it to a retry of the same turn without being able to read it
 * (2026-10-08c; see ./whole-answer-reveal.ts).
 *
 * The browser never holds the answer to the student's homework
 * (verdict-precheck-shared.ts). A retry is a new request, though, and the
 * server keeps nothing between requests — so the value rides as AES-256-GCM
 * ciphertext (portal/secret-box.ts) in the `verdict-precheck` frame and comes
 * back in the retry's body.
 *
 * Key: derived from PORTAL_SECRET_ENC_KEY when it is set (every process of a
 * deployment then opens every seal); otherwise a key made at process start —
 * a seal from another process then fails to open, and the retry runs without
 * the guard (the prompt rule still applies). Never throws.
 */
import { createHash, randomBytes } from 'node:crypto';
import { decryptSecret, encryptSecret } from '@/lib/tutor/portal/secret-box';

const PROCESS_KEY = randomBytes(32);

function key(): Buffer {
  const env = process.env.PORTAL_SECRET_ENC_KEY;
  return env ? createHash('sha256').update(`whole-answer-seal:${env}`).digest() : PROCESS_KEY;
}

export interface SealedWithheldAnswer { value: string; studentText: string }

/** '' when sealing fails. */
export function sealWithheldAnswer(a: SealedWithheldAnswer): string {
  try {
    return encryptSecret(JSON.stringify({ v: String(a.value ?? '').slice(0, 240), s: String(a.studentText ?? '').slice(0, 1000) }), key()).ciphertext;
  } catch {
    return '';
  }
}

/** Null for anything that is not a seal this deployment made. */
export function openWithheldAnswer(sealed: unknown): SealedWithheldAnswer | null {
  if (typeof sealed !== 'string' || !sealed || sealed.length > 4000) return null;
  try {
    const o = JSON.parse(decryptSecret({ ciphertext: sealed, keyVersion: 1 }, key())) as { v?: unknown; s?: unknown };
    const value = typeof o?.v === 'string' ? o.v : '';
    return value.trim() ? { value, studentText: typeof o?.s === 'string' ? o.s : '' } : null;
  } catch {
    return null;
  }
}
