/**
 * searchParams → TutorSession mongo filter for the admin list page.
 * Unknown/invalid values fall back to the DEFAULT view, which is now
 * "Students": real learner sessions only (no test/showcase sources, no
 * test-account names). `src=all` is the explicit everything view.
 */
const VALID_SOURCES = new Set(['tutor', 'embed', 'showcase', 'test']);

/** Names whose sessions are internal tests regardless of source.
 *  Case-insensitive substring match against studentName. */
export const TEST_STUDENT_NAMES = ['praveen'];

const RANGE_MS: Record<string, number> = {
  today: 86_400_000,
  '7d': 7 * 86_400_000,
  '30d': 30 * 86_400_000,
};

export interface SessionFilterParams {
  src?: string;
  partner?: string;
  host?: string;
  audio?: string;
  range?: string;
  /** Free-text search: student name, subject, topic, lesson name, grade,
   *  session id, location, or an approximate date (±3 days). */
  q?: string;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Parse a date-looking search string. Returns null unless the text is
 *  unambiguously a date — we gate with explicit patterns rather than
 *  Date.parse alone, because Date.parse accepts junk ("Grade 3" → NaN is
 *  fine, but "March" parses in some engines and would hijack text search). */
export function parseApproxDate(q: string, now: Date = new Date()): Date | null {
  const s = q.trim();
  const patterns = [
    /^\d{4}-\d{1,2}-\d{1,2}$/,                                  // 2026-08-01
    /^\d{1,2}[\/.]\d{1,2}([\/.]\d{2,4})?$/,                     // 8/1, 8/1/2026, 1.8.2026
    /^[a-z]{3,9}\.? \d{1,2}(,? \d{4})?$/i,                       // Aug 1, August 1 2026
    /^\d{1,2} [a-z]{3,9}\.?(,? \d{4})?$/i,                       // 1 Aug, 1 August 2026
  ];
  if (!patterns.some((p) => p.test(s))) return null;
  let normalized = s.replace(/\./g, '/');
  // Date-only ISO strings parse as UTC; slash form parses as local. Keep local.
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)) normalized = s.replace(/-/g, '/');
  const hasYear = /\d{4}/.test(normalized);
  const d = new Date(hasYear ? normalized : `${normalized} ${now.getFullYear()}`);
  if (isNaN(d.getTime())) return null;
  // A month/day without a year that lands in the future means last year
  // (admin is searching history, not the future).
  if (!hasYear && d.getTime() > now.getTime() + 4 * 86_400_000) {
    d.setFullYear(d.getFullYear() - 1);
  }
  return d;
}

/** Build the mongo clause for the free-text search box. Date-looking input
 *  becomes a ±3-day startedAt window; anything else becomes a case-insensitive
 *  $or across the searchable text fields. `lessonPlanIds` are plan ids whose
 *  titles matched the query (resolved by the caller — title lookup is async). */
export function buildSearchClause(
  q: string,
  lessonPlanIds: string[] = [],
  now: Date = new Date(),
): Record<string, unknown> {
  const approx = parseApproxDate(q, now);
  if (approx) {
    return {
      startedAt: {
        $gte: new Date(approx.getTime() - 3 * 86_400_000),
        // end of the target day + 3 days
        $lt: new Date(approx.getTime() + 4 * 86_400_000),
      },
    };
  }
  const rx = new RegExp(escapeRegex(q.trim()), 'i');
  const or: Record<string, unknown>[] = [
    { studentName: rx },
    { subject: rx },
    { topic: rx },
    { level: rx },
    { sessionId: rx },
    { 'location.city': rx },
    { 'location.region': rx },
    { 'location.country': rx },
  ];
  if (lessonPlanIds.length > 0) {
    or.push({ 'lessonProgress.lessonPlanId': { $in: lessonPlanIds } });
  }
  return { $or: or };
}

export function buildSessionFilter(
  params: SessionFilterParams,
  now: Date = new Date(),
  lessonPlanIds: string[] = [],
): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (params.src === 'all') {
    // explicit everything view — no source clause
  } else if (params.src && VALID_SOURCES.has(params.src)) {
    filter.source = params.src;
  } else {
    // Default: Students. Missing source/studentName fields still match
    // ($nin and $not both include docs lacking the field), so legacy
    // website sessions and anonymous students stay visible.
    filter.source = { $nin: ['test', 'showcase'] };
    filter.studentName = { $not: new RegExp(TEST_STUDENT_NAMES.join('|'), 'i') };
  }
  if (params.partner) filter.sourcePartnerId = params.partner;
  if (params.host) filter.sourceHost = params.host;
  if (params.audio === '1') filter.hasAudio = true;
  if (params.range && RANGE_MS[params.range]) {
    filter.startedAt = { $gte: new Date(now.getTime() - RANGE_MS[params.range]) };
  }
  if (params.q && params.q.trim()) {
    // Applied last: an approx-date search overrides the range chip's
    // startedAt (the typed date is the more specific intent).
    Object.assign(filter, buildSearchClause(params.q, lessonPlanIds, now));
  }
  return filter;
}
