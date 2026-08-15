/**
 * Shared error → HTTP status mapper for the six mock-exam portal routes.
 * Only exact-match service/report error messages are mapped; everything
 * else (blueprint/form integrity throws like `form_module_not_in_blueprint`
 * or `Unknown mock form: ...`) falls through to a logged 500 — those are
 * data-integrity bugs, not expected client-facing conditions.
 */
import { NextResponse } from 'next/server';

export function mapMockError(e: unknown) {
  const msg = e instanceof Error ? e.message : 'internal';
  const table: Record<string, [number, string]> = {
    not_found: [404, 'not_found'],
    forbidden: [403, 'forbidden'],
    not_ready: [409, 'not_ready'],
    attempt_not_open: [409, 'attempt_not_open'],
    deadline_passed: [409, 'deadline_passed'],
    form_not_live: [404, 'not_found'],
  };
  const hit = table[msg];
  if (hit) return NextResponse.json({ error: hit[1] }, { status: hit[0] });
  console.error('[mock] unhandled', e);
  return NextResponse.json({ error: 'internal' }, { status: 500 });
}
