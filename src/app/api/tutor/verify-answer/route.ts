/**
 * Verify-answer — blind-solve check for improvised / student-brought
 * problems (Round-17, 2026-07-17).
 *
 * The brain declares its derived `expectedAnswer` on any free-form
 * show_problem (tool contract). The client strips that field before the
 * card renders (it must never reach the board / persistence / PDF export)
 * and asks this route to independently solve the problem — the solver
 * never sees the claim — then compares with the pipeline's answersAgree
 * tolerance (1% numeric / normalized short-exact). agree:true → the client
 * pins the answer into <active_problem> exactly like pipeline problems,
 * closing the last unverified-grading gap (pipeline problems were fixed by
 * the expectedAnswer pin; authored cards are covered by <segment_truth>).
 *
 * A mismatch is NOT an error — it returns agree:false + the blind solve so
 * the client can log the divergence; nothing gets pinned (neither answer
 * is trusted on a single-solve disagreement).
 */
import { NextRequest } from 'next/server';
import { verifyClaimedAnswer } from '@/lib/tutor/voice/problem-generator';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { statement?: unknown; claimedAnswer?: unknown; choices?: unknown };
    const statement = typeof body.statement === 'string' ? body.statement.trim() : '';
    const claimedAnswer = typeof body.claimedAnswer === 'string' ? body.claimedAnswer.trim() : '';
    if (!statement || !claimedAnswer || statement.length > 4000 || claimedAnswer.length > 500) {
      return Response.json({ agree: false, error: 'bad_input' }, { status: 400 });
    }
    // Round-17b: MCQ choices — the solver must SEE them to answer with a
    // letter (it previously answered the correct choice's free text, which
    // read as a false mismatch against a claimed letter).
    const choices = Array.isArray(body.choices)
      ? (body.choices as Array<{ letter?: unknown; text?: unknown }>)
          .filter((c) => typeof c?.letter === 'string' && typeof c?.text === 'string')
          .map((c) => ({ letter: String(c.letter).slice(0, 2), text: String(c.text).slice(0, 500) }))
          .slice(0, 8)
      : undefined;
    const { agree, solved } = await verifyClaimedAnswer(statement, claimedAnswer, choices);
    console.log(`[verify-answer] agree=${agree} claimed="${claimedAnswer.slice(0, 60)}" solved="${solved.slice(0, 60)}"`);
    return Response.json({ agree, solved });
  } catch (err) {
    console.error('[verify-answer] failed:', err);
    // Distinct non-200 (mirrors the question-gist convention): an internal
    // failure must not read as a deliberate agree:false verdict.
    return Response.json({ agree: false, error: 'internal' }, { status: 502 });
  }
}
