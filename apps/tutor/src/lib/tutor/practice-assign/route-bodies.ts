/** Pure body-parsing helpers for the draft/finalize practice-assign routes
 *  (Task 11). Kept out of the route handlers so they're unit-testable
 *  without a request object — see `scripts/test-practice-assign-routes.ts`. */
import type { FinalizeSource } from './store';

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
const SOURCES: FinalizeSource[] = ['close_tool', 'end', 'pagehide', 'time_cap', 'sweep'];

export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

export interface DraftBody {
  studentId: string;
  sessionId: string;
  loIds: string[];
  trigger?: string;
  locator?: string;
  lessonPlanId?: string;
  courseId?: string;
  subject?: string;
}

export function parseDraftBody(b: Record<string, unknown>): Parsed<DraftBody> {
  const studentId = str(b.studentId);
  const sessionId = str(b.sessionId);
  const loIds = Array.isArray(b.loIds) ? b.loIds.filter((x): x is string => typeof x === 'string' && x.length > 0) : [];
  if (!studentId || !sessionId || loIds.length === 0) return { ok: false, error: 'studentId, sessionId, loIds[] required' };
  return {
    ok: true,
    value: {
      studentId,
      sessionId,
      loIds,
      trigger: str(b.trigger),
      locator: str(b.locator),
      lessonPlanId: str(b.lessonPlanId),
      courseId: str(b.courseId),
      subject: str(b.subject),
    },
  };
}

export interface FinalizeBody {
  studentId: string;
  sessionId: string;
  source: FinalizeSource;
  reason?: string;
  nextTimeIntent?: string;
  locator?: string;
}

export function parseFinalizeBody(b: Record<string, unknown>): Parsed<FinalizeBody> {
  const studentId = str(b.studentId);
  const sessionId = str(b.sessionId);
  const source = str(b.source) as FinalizeSource | undefined;
  if (!studentId || !sessionId || !source || !SOURCES.includes(source)) return { ok: false, error: 'studentId, sessionId, source required' };
  return {
    ok: true,
    value: { studentId, sessionId, source, reason: str(b.reason), nextTimeIntent: str(b.nextTimeIntent), locator: str(b.locator) },
  };
}
