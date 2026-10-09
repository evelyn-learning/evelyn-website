/**
 * POST /api/portal/v1/student-erase — irreversible erase of EVERY engine-side
 * record of one of the calling partner's students (contract v1.12.0 shape,
 * widened 2026-10-08).
 *
 * Until 2026-10-08 this deleted only the learner model (evidence log,
 * projections, snapshots, per-subject Elo rows). It now also deletes the
 * student's profile, session documents (transcripts, email, IP) and their
 * recorded audio, topic notes, homework, mock attempts, generation
 * counters and review plans — see `eraseStudentData`
 * (src/lib/tutor/student-erase/erase.ts) for the full list and, above all,
 * for how every delete is scoped to the VERIFIED calling partner: a student
 * id is only unique within one partner.
 *
 * Response: `{ ok: true, deleted }` exactly as before — `deleted` is the
 * contract's open `Record<string, number>` and simply carries more keys
 * (the four learner-model keys are unchanged). `audio` and `retained` are
 * additive top-level fields a client parsing with the contract schema never
 * sees. Idempotent: erasing an already-erased or unknown student is a 200
 * with zero counts.
 *
 * The one non-200 this route adds is 500 `erase_incomplete`: a recorded
 * audio directory could not be removed. Everything else is already gone and
 * that session's document is kept, so calling again finishes the erase.
 *
 * `trial:` ids are NOT special-cased here. They are never resolved to a
 * surrogate profile id (M1c Task 5, fix round 2, IMPORTANT E), so they are
 * erased under their literal id; nothing is written to the learner model
 * for a trial student in the first place (appendEvidence drops them).
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { StudentEraseRequestSchema, StudentEraseResponseSchema } from '@evelyn/portal-contract/v1';
import { eraseStudentData } from '@/lib/tutor/student-erase/erase';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = StudentEraseRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }

  // M1c final review (A-M5) — the same guard every sibling portal route
  // carries, for consistency and as a backstop.
  //
  // Correction to the review's premise, verified against the contract
  // package: unlike `SessionEmitRequestSchema` (`studentId: z.string()`,
  // where this guard is genuinely load-bearing), `StudentEraseRequestSchema`
  // is `z.object({ studentId: z.string().min(1) })` — so `""` is ALREADY a
  // clean 400 from `safeParse` above and never reaches
  // `eraseStudentData`'s own deliberately-loud missing-id throw. This
  // line is therefore unreachable today. It stays because the alternative
  // is a route whose safety depends on a `.min(1)` in a separately-versioned
  // package, and because a reader comparing these seven routes should not
  // have to re-derive which one is different and why.
  if (!parsed.data.studentId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId required' }, { status: 400 });
  }

  // M1c Task 5 (fix round 1, CRITICAL 2) — the erase must reach the SAME id
  // the data was written under, or it silently deletes nothing while the
  // partner's actual data survives. `eraseStudentData` looks the profile up
  // by (auth.partnerId, studentId) itself, with a plain read: the previous
  // `resolveProfileIdOrRaw` call MINTED an empty profile for an unknown
  // student, which an erase must never do.
  const result = await eraseStudentData({ partnerId: auth.partnerId, externalStudentId: parsed.data.studentId });

  if (!result.complete) {
    console.error(`[student-erase] incomplete erase for partner=${auth.partnerId}: ${result.audio.failed} audio director${result.audio.failed === 1 ? 'y' : 'ies'} could not be removed`);
    return NextResponse.json(
      { error: 'erase_incomplete', reason: 'audio_not_removed', deleted: result.deleted, audio: result.audio, retained: result.retained },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ...StudentEraseResponseSchema.parse({ ok: true, deleted: result.deleted }),
    audio: result.audio,
    retained: result.retained,
  });
});
