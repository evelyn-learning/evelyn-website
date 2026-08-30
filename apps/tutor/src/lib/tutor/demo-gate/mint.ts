/**
 * Shared demo-token mint — the forced-claims logic that used to live only in
 * POST /api/tutor-portal/demo-token, extracted so /api/tutor/demo-start (the
 * gated path) and the legacy route mint IDENTICALLY and cannot drift.
 *
 * Forced claims spread AFTER the client config so a spoofed partner_id /
 * student_id / exp is always overridden, never merged. `demo_gate: 1` marks
 * the token as minted by a gate-checked route — enforce.ts refuses
 * evelyn-marketing tokens without it, which is what closes the old
 * "anyone can mint an ungated demo token" hole.
 */

import { randomUUID } from 'node:crypto';
import { getPartnerSecret } from '@/lib/tutor/portal/auth';
import { signEmbedToken } from '@/lib/tutor/portal/embed-token';

export interface MintedDemoToken {
  token: string;
  studentId: string;
}

export function mintDemoEmbedToken(config: Record<string, unknown>, studentName?: string): MintedDemoToken {
  const studentId = `demo-${randomUUID().slice(0, 8)}`;
  const payload: Record<string, unknown> = {
    ...config,
    ...(studentName ? { student_name: studentName } : {}),
    partner_id: 'evelyn-marketing',
    student_id: studentId,
    demo_gate: 1,
    exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
  };

  const secret = getPartnerSecret('evelyn-marketing');
  if (!secret) {
    // Degrade path (local/dev with no marketing secret): legacy unsigned
    // base64 — the same shape verifyEmbedToken treats as a no-op in
    // off-mode deployments. UTF-8-safe.
    return { token: Buffer.from(JSON.stringify(payload), 'utf8').toString('base64'), studentId };
  }
  return { token: signEmbedToken(payload, secret), studentId };
}
