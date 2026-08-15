import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

const STATE_TTL_MS = 10 * 60 * 1000;

function getSecret(): string {
  const k = process.env.TOKEN_ENCRYPTION_KEY;
  if (!k) throw new Error('TOKEN_ENCRYPTION_KEY not set — required to sign OAuth state.');
  return k;
}

export function encodeOAuthState(): string {
  const payload = JSON.stringify({
    n: randomBytes(16).toString('hex'),
    t: Date.now(),
  });
  const sig = createHmac('sha256', getSecret()).update(payload).digest('hex');
  return Buffer.from(`${payload}.${sig}`).toString('base64url');
}

export function verifyOAuthState(state: string | null): { ok: true } | { ok: false; reason: string } {
  if (!state) return { ok: false, reason: 'missing' };
  try {
    const decoded = Buffer.from(state, 'base64url').toString('utf8');
    const lastDot = decoded.lastIndexOf('.');
    if (lastDot < 0) return { ok: false, reason: 'malformed' };

    const payload = decoded.slice(0, lastDot);
    const sig = decoded.slice(lastDot + 1);
    const expected = createHmac('sha256', getSecret()).update(payload).digest('hex');

    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, reason: 'bad_signature' };
    }

    const parsed = JSON.parse(payload) as { t?: number };
    if (typeof parsed.t !== 'number' || Date.now() - parsed.t > STATE_TTL_MS) {
      return { ok: false, reason: 'expired' };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: 'malformed' };
  }
}
