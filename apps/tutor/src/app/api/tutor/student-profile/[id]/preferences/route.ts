/**
 * PATCH /api/tutor/student-profile/:id/preferences
 *
 * Partial-merge update of StudentPreferences. Used by /tutor/settings
 * and the in-session humor chip (Stage 4) to persist preference changes
 * without committing a full session.
 *
 * Body shape: a partial StudentPreferences. Keys not present are left
 * untouched. Pass `null` for a key to clear it (revert to grade default).
 *
 * Returns the saved profile.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  updateStudentPreferences,
  resolveProfileIdOrRaw,
} from '@/lib/tutor/student-profile/store';
import type { StudentPreferences } from '@/lib/tutor/student-profile/types';
import { checkEmbedAuth, partnerIdForInternalRoute, embedTokenRejectionReason } from '@/lib/tutor/portal/embed-token';

const HUMOR_LEVELS = new Set(['off', 'light', 'medium', 'heavy']);
const PACING_VALUES = new Set(['slower', 'default', 'faster']);
const MODALITY_VALUES = new Set(['visual', 'equation', 'mixed']);
const TONE_VALUES = new Set(['warm', 'peer', 'professional']);

type PatchValue = StudentPreferences[keyof StudentPreferences] | null;

function validatePatch(input: unknown): { ok: true; patch: Record<string, PatchValue> } | { ok: false; error: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, error: 'body must be a JSON object' };
  }
  const out: Record<string, PatchValue> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (v === null) {
      out[k] = null;
      continue;
    }
    if (typeof v !== 'string') {
      return { ok: false, error: `${k} must be a string or null` };
    }
    if (k === 'humorCeiling' && !HUMOR_LEVELS.has(v)) {
      return { ok: false, error: `humorCeiling must be one of: off, light, medium, heavy` };
    }
    if (k === 'pacing' && !PACING_VALUES.has(v)) {
      return { ok: false, error: `pacing must be one of: slower, default, faster` };
    }
    if (k === 'modality' && !MODALITY_VALUES.has(v)) {
      return { ok: false, error: `modality must be one of: visual, equation, mixed` };
    }
    if (k === 'tone' && !TONE_VALUES.has(v)) {
      return { ok: false, error: `tone must be one of: warm, peer, professional` };
    }
    if (!['humorCeiling', 'pacing', 'modality', 'tone'].includes(k)) {
      return { ok: false, error: `unknown preference field: ${k}` };
    }
    out[k] = v as PatchValue;
  }
  return { ok: true, patch: out };
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // M1c Task 5 (fix round 2, CRITICAL A; corrected fix round 3, CRITICAL A1;
  // corrected fix round 4, spec §4.0 refinement) — this route had NO auth
  // at all (pre-existing; reached by /tutor/settings and the in-session
  // humor chip, per the module doc above), so it had no trustworthy
  // partner id to resolve identity under. checkEmbedAuth verifies an embed
  // token when one is present; a genuinely absent token is retail
  // (/tutor/settings sends none) and must keep working, unconditionally,
  // with no 401. But a token that WAS sent and fails verification is NOT
  // retail — falling back to 'evelyn' for it would silently misattribute a
  // partner student's write, so that case rejects (401) instead — see
  // embedTokenRejectionReason's doc comment.
  const token = req.headers.get('x-embed-token');
  const auth = checkEmbedAuth({
    token,
    expectedStudentId: id,
    route: 'student-profile:preferences:PATCH',
  });
  const rejection = embedTokenRejectionReason(token, auth);
  if (rejection) {
    console.error('[student-profile/preferences] embed token present but invalid:', rejection);
    return NextResponse.json({ error: 'unauthorized', reason: rejection }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }

  const v = validatePatch(body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });

  try {
    const profileId = await resolveProfileIdOrRaw({ partnerId: partnerIdForInternalRoute(auth), externalStudentId: id });
    const saved = await updateStudentPreferences(profileId, v.patch as Partial<Record<keyof StudentPreferences, StudentPreferences[keyof StudentPreferences] | null>>);
    return NextResponse.json({ preferences: saved.preferences });
  } catch (err) {
    console.error('[student-profile/preferences] update failed:', err);
    return NextResponse.json({ error: 'update failed' }, { status: 500 });
  }
}
