/**
 * What a token-minting route may log about the provider's response.
 *
 * The realtime-token route used to print the whole OpenAI `client_secrets`
 * response — `{"value":"ek_…", …}` — so every session start wrote a live
 * ephemeral key (valid for up to 2 h) and the session's full instructions to
 * the server log (found 2026-10-04).
 *
 * An explicit ALLOW-LIST: status, model, expiry, and whether a token came
 * back at all. Nothing else from the response is read, so a field the provider
 * adds later cannot leak through, and the token value is never formatted.
 * Pure — pinned by scripts/test-token-log.ts.
 */
export function describeTokenResponse(
  status: number,
  data: unknown,
  fallbackModel?: string,
): string {
  const d = (data && typeof data === 'object' ? data : {}) as { value?: unknown; expires_at?: unknown; session?: unknown };
  const session = (d.session && typeof d.session === 'object' ? d.session : {}) as { model?: unknown };
  const model = typeof session.model === 'string' && /^[\w.:-]{1,80}$/.test(session.model) ? session.model : (fallbackModel ?? 'unknown');
  const expiresAt = typeof d.expires_at === 'number' && Number.isFinite(d.expires_at) ? String(d.expires_at) : 'unknown';
  const token = typeof d.value === 'string' && d.value.length > 0 ? 'present' : 'MISSING';
  return `status=${status} model=${model} expires_at=${expiresAt} token=${token}`;
}
