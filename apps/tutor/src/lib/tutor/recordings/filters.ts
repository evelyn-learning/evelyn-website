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

/** Exact names (case-insensitive) that only ever mean a test run. */
export const TEST_EXACT_NAMES = ['test'];

/** Public IPs whose sessions are always ours (2026-11-16). Our own tests
 *  on prod hosts carry a real IP, so `Local` alone misses them; partner
 *  developers testing their integration are NOT listed — that is partner
 *  traffic. Update when the home IP changes.
 *  - 157.131.199.237: Praveen's home network (Richmond, US)
 *  - 85.239.239.134:  US prod box (scripted runs on the server) */
export const TEST_CLIENT_IPS = ['157.131.199.237', '85.239.239.134'];

/** Private / loopback clientIp prefixes — mirrors isPrivateIp(). Geo stores
 *  city 'Local' for these, but older rows may lack location. */
const PRIVATE_IP_RX = /^(::1$|localhost$|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|f[cd]|fe80)/i;

/** A session is a Test if ANY clause matches: the harness marked it, it ran
 *  on a local machine, it came from one of our IPs, or it used a test name.
 *  Students = none match (and not a showcase). */
export function testSessionClauses(): Record<string, unknown>[] {
  return [
    { source: 'test' },
    { 'location.city': 'Local' },
    { clientIp: PRIVATE_IP_RX },
    { clientIp: { $in: TEST_CLIENT_IPS } },
    { studentName: new RegExp(TEST_STUDENT_NAMES.map(escapeRegex).join('|'), 'i') },
    { studentName: new RegExp(`^\\s*(${TEST_EXACT_NAMES.map(escapeRegex).join('|')})\\s*$`, 'i') },
  ];
}

/** Same rule as testSessionClauses(), for one already-loaded row (badges). */
export function isTestSession(s: {
  source?: unknown;
  clientIp?: unknown;
  studentName?: unknown;
  location?: { city?: unknown } | null;
}): boolean {
  if (s.source === 'test') return true;
  if (s.location?.city === 'Local') return true;
  const ip = typeof s.clientIp === 'string' ? s.clientIp : '';
  if (ip && (PRIVATE_IP_RX.test(ip) || TEST_CLIENT_IPS.includes(ip))) return true;
  const name = typeof s.studentName === 'string' ? s.studentName.trim().toLowerCase() : '';
  if (name && TEST_STUDENT_NAMES.some((n) => name.includes(n))) return true;
  if (name && TEST_EXACT_NAMES.includes(name)) return true;
  return false;
}

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
  mode?: string;
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
    const window = {
      $gte: new Date(approx.getTime() - 3 * 86_400_000),
      // end of the target day + 3 days
      $lt: new Date(approx.getTime() + 4 * 86_400_000),
    };
    // Either start: when it was first opened, or when it was last picked up again (`lastStartedAt`).
    return { $or: [{ startedAt: window }, { lastStartedAt: window }] };
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
  } else if (params.src === 'test') {
    // Tests: anything testSessionClauses() flags. Wrapped in $and so the
    // search box's own $or (applied below) cannot overwrite it.
    filter.$and = [{ $or: testSessionClauses() }];
  } else if (params.src && VALID_SOURCES.has(params.src)) {
    // Website / Portal / Showcase: that source, minus test sessions.
    filter.source = params.src;
    if (params.src !== 'showcase') filter.$nor = testSessionClauses();
  } else {
    // Default: Students = not a showcase and not a test. A doc missing a
    // field never matches that field's clause, so legacy website sessions
    // and anonymous students stay visible.
    filter.$nor = [{ source: 'showcase' }, ...testSessionClauses()];
  }
  if (params.partner) filter.sourcePartnerId = params.partner;
  if (params.host) filter.sourceHost = params.host;
  if (params.mode === 'text' || params.mode === 'voice') filter.inputMode = params.mode;
  if (params.audio === '1') filter.hasAudio = true;
  const q = params.q?.trim();
  // A typed date overrides the range chip (the typed date is the more specific intent).
  if (params.range && RANGE_MS[params.range] && !(q && parseApproxDate(q, now))) {
    // A session picked up again later counts from its last sitting: one first opened in July and taken in
    // November was filed under July and left out of "today" (portal-1115afec). In $and, so the search box's
    // own $or below cannot overwrite it.
    const since = { $gte: new Date(now.getTime() - RANGE_MS[params.range]) };
    filter.$and = [...((filter.$and as unknown[] | undefined) ?? []), { $or: [{ startedAt: since }, { lastStartedAt: since }] }];
  }
  if (q) Object.assign(filter, buildSearchClause(q, lessonPlanIds, now));
  return filter;
}

/**
 * The Practice grading view (and the cost line) on the same page: grades are
 * not sessions, so only the Partner and date chips apply — source, host,
 * mode, audio and search describe sessions and are ignored.
 */
export function buildGradeUsageFilter(
  params: Pick<SessionFilterParams, 'partner' | 'range'>,
  now: Date = new Date(),
): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (params.partner) filter.partnerId = params.partner;
  if (params.range && RANGE_MS[params.range]) {
    filter.createdAt = { $gte: new Date(now.getTime() - RANGE_MS[params.range]) };
  }
  return filter;
}
