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
}

export function buildSessionFilter(
  params: SessionFilterParams,
  now: Date = new Date(),
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
  return filter;
}
