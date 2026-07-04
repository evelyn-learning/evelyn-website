/**
 * searchParams → TutorSession mongo filter for the admin list page.
 * Unknown/invalid values are IGNORED (fall back to All) per spec.
 */
const VALID_SOURCES = new Set(['tutor', 'embed', 'showcase', 'test']);
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
  if (params.src && VALID_SOURCES.has(params.src)) filter.source = params.src;
  if (params.partner) filter.sourcePartnerId = params.partner;
  if (params.host) filter.sourceHost = params.host;
  if (params.audio === '1') filter.hasAudio = true;
  if (params.range && RANGE_MS[params.range]) {
    filter.startedAt = { $gte: new Date(now.getTime() - RANGE_MS[params.range]) };
  }
  return filter;
}
