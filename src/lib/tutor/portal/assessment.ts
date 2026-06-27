/**
 * Diagnostic / assessment mode (v1.1.0) — engine side.
 *
 * Course-start calibration across a set of LOs, WITHOUT teaching scaffolding
 * (this is a pure backend operation — it never invokes the live teaching
 * orchestrator / brain). Two stateless steps:
 *   1. buildAssessment  — select calibration items per LO (via the existing
 *      practice retrieval), answer-stripped for the portal.
 *   2. submitAssessment — grade responses, then commit LOW-exposure mastery +
 *      CANDIDATE gaps through the normal SessionResult machinery, so the
 *      engine's decay/promotion treats it as a preliminary read that real
 *      sessions refine or overturn. Silent: returns pedagogical state to the
 *      portal only; no student-facing score.
 *
 * Reuse: retrievePractice (question selection), emitSessionResult (commit),
 * the single-answer judge (frq/free + image responses).
 */

import { randomUUID } from 'crypto';
import { retrievePractice, type PracticeSources } from './practice';
import { emitSessionResult } from './session-result';
import type { GradeDeps } from './grade-free-response';
import type { ResolvedAssessmentKey } from './adapters';
import type {
  AssessmentRequest,
  AssessmentSet,
  AssessmentItem,
  AssessmentSubmission,
  SessionEmitRequest,
  SessionResult,
} from '@evelyn/portal-contract/v1';

export type AssessmentItemResolver = (itemId: string) => Promise<ResolvedAssessmentKey | null>;

/** Build a (stateless) calibration set: up to `maxPerLo` items per LO, drawn
 *  from existing content, with answer keys stripped. */
export async function buildAssessment(
  req: AssessmentRequest,
  sources: PracticeSources,
): Promise<AssessmentSet> {
  const items: AssessmentItem[] = [];
  const seen = new Set<string>();
  for (const loId of req.loIds) {
    const res = await retrievePractice(
      { studentId: req.studentId, courseId: req.courseId, scope: { loId }, difficulty: req.difficulty, count: req.maxPerLo },
      sources,
    );
    for (const it of res.items) {
      if (seen.has(it.id)) continue;
      seen.add(it.id);
      items.push({
        itemId: it.id,
        loId,
        cedCode: it.cedCode,
        problemText: it.problemText,
        responseFormat: it.responseFormat,
        // Strip the `correct` flag — the answer key never leaves the engine.
        choices: it.choices?.map((c) => ({ id: c.id, text: c.text })),
      });
    }
  }
  return {
    assessmentId: randomUUID(),
    studentId: req.studentId,
    courseId: req.courseId,
    loIds: req.loIds,
    items,
  };
}

function norm(s: string): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Grade a single response against its resolved key. Deterministic for
 *  numeric/mcq; the single-answer judge for frq/free and image responses. */
async function isCorrect(
  key: ResolvedAssessmentKey,
  response: AssessmentSubmission['responses'][number]['response'],
  judge: GradeDeps['judgeSingleAnswer'],
): Promise<boolean> {
  if ('imageRef' in response) {
    const j = await judge({ expectedAnswer: key.expectedAnswer ?? '', response });
    return j.correct;
  }
  const text = response.text;
  const fmt = key.responseFormat ?? 'free';

  if (fmt === 'numeric') {
    const a = parseFloat(text);
    const b = parseFloat(key.expectedAnswer ?? '');
    if (Number.isFinite(a) && Number.isFinite(b)) {
      const tol = Math.max(0.01, Math.abs(b) * 0.01);
      return Math.abs(a - b) <= tol;
    }
    return norm(text) === norm(key.expectedAnswer ?? '');
  }

  if (fmt === 'mcq') {
    const n = norm(text);
    if (key.correctChoiceId && n === norm(key.correctChoiceId)) return true;
    if (key.expectedAnswer && n === norm(key.expectedAnswer)) return true;
    const correct = key.choices?.find((c) => c.id === key.correctChoiceId);
    if (correct && n === norm(correct.text)) return true;
    return false;
  }

  if (fmt === 'frq' || fmt === 'free') {
    const j = await judge({ expectedAnswer: key.expectedAnswer ?? '', response: { text } });
    return j.correct;
  }

  return norm(text) === norm(key.expectedAnswer ?? '');
}

/**
 * Grade a submission and commit the calibration as a preliminary read:
 *  - mastery delta per LO signed by correctness fraction (fresh LO → exposures 1)
 *  - a single-signal CANDIDATE gap for each weak LO (frac < 0.5)
 * via emitSessionResult (idempotent on sessionId). Returns the SessionResult.
 */
export async function submitAssessment(
  sub: AssessmentSubmission,
  deps: GradeDeps,
  resolveItem: AssessmentItemResolver,
): Promise<SessionResult> {
  const perLo = new Map<string, { correct: number; total: number }>();
  for (const r of sub.responses) {
    const agg = perLo.get(r.loId) ?? { correct: 0, total: 0 };
    agg.total += 1;
    const key = await resolveItem(r.itemId);
    if (key && (await isCorrect(key, r.response, deps.judgeSingleAnswer))) {
      agg.correct += 1;
    }
    perLo.set(r.loId, agg);
  }

  const masteryDeltas: SessionEmitRequest['masteryDeltas'] = [];
  const gaps: SessionEmitRequest['gaps'] = [];
  for (const [loId, { correct, total }] of perLo) {
    if (total === 0) continue;
    const frac = correct / total;
    // 0 → -0.8, 0.5 → 0, 1 → +0.8. applyMasteryDeltas turns this into a
    // first-touch score at exposures 1 (deliberately low-trust).
    masteryDeltas.push({ loId, delta: (frac - 0.5) * 1.6 });
    if (frac < 0.5) {
      gaps.push({
        kind: 'lo',
        loId,
        observation: `Diagnostic calibration: ${correct}/${total} correct on ${loId} (preliminary).`,
        studentQuotes: [],
        // Single signal → confidence 0.25 → stays CANDIDATE (never auto-confirmed).
        signals: ['INCORRECT_STREAK_2_PLUS'],
      });
    }
  }

  const emitReq: SessionEmitRequest = {
    sessionId: sub.sessionId,
    studentId: sub.studentId,
    courseId: sub.courseId,
    status: 'completed',
    milestone: 'none',
    losTouched: [...perLo.keys()],
    masteryDeltas,
    gaps,
    notesTouched: [],
  };
  return emitSessionResult(emitReq);
}
