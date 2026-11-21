/**
 * Unit tests for the recordings pure modules (relative-time, timeline-events,
 * segments, filters). Run: npm run test:recordings
 * Design: docs/superpowers/specs/2026-07-04-recordings-overhaul-design.md
 */
import { formatRelativeTime } from '../src/lib/tutor/recordings/relative-time';
import { categorizeEvent, curateEvents, EVENT_CATEGORIES } from '../src/lib/tutor/recordings/timeline-events';
import { buildSpeakerSegments } from '../src/lib/tutor/recordings/segments';
import { buildSessionFilter, isTestSession, testSessionClauses, TEST_CLIENT_IPS } from '../src/lib/tutor/recordings/filters';
import { extractClientIp, isPrivateIp } from '../src/lib/tutor/recordings/client-ip';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const NOW = new Date('2026-07-04T12:00:00Z');

// ── relative-time ─────────────────────────────────────────────────
check('34 secs ago', formatRelativeTime(new Date(NOW.getTime() - 34_000), NOW) === '34 secs ago');
check('1 sec ago (singular)', formatRelativeTime(new Date(NOW.getTime() - 1_000), NOW) === '1 sec ago');
check('34 mins ago', formatRelativeTime(new Date(NOW.getTime() - 34 * 60_000), NOW) === '34 mins ago');
check('1 min ago (singular)', formatRelativeTime(new Date(NOW.getTime() - 60_000), NOW) === '1 min ago');
check('5 hrs ago', formatRelativeTime(new Date(NOW.getTime() - 5 * 3_600_000), NOW) === '5 hrs ago');
check('3 days ago', formatRelativeTime(new Date(NOW.getTime() - 3 * 86_400_000), NOW) === '3 days ago');
check('same year past 7d → "Jul 2" style', formatRelativeTime(new Date('2026-06-01T12:00:00Z'), NOW) === 'Jun 1');
check('other year → "Jul 2, 2025" style', formatRelativeTime(new Date('2025-07-02T12:00:00Z'), NOW) === 'Jul 2, 2025');
check('accepts ISO string input', formatRelativeTime(new Date(NOW.getTime() - 120_000).toISOString(), NOW) === '2 mins ago');
check('future/clock-skew clamps to just now', formatRelativeTime(new Date(NOW.getTime() + 60_000), NOW) === '0 secs ago');

// ── timeline-events: categorization ───────────────────────────────
check('judge_kill_snapshot → kill', categorizeEvent('judge_kill_snapshot')?.key === 'kill');
check('dev_forced_kill → kill', categorizeEvent('dev_forced_kill')?.key === 'kill');
check('killed_render_rollback → kill', categorizeEvent('killed_render_rollback')?.key === 'kill');
check('contradiction_inversion_retry → kill', categorizeEvent('contradiction_inversion_retry')?.key === 'kill');
check('perception_cancel_suppressed_opening → perception', categorizeEvent('perception_cancel_suppressed_opening')?.key === 'perception');
check('mic_mute → mic', categorizeEvent('mic_mute')?.key === 'mic');
check('mic_unmute → mic', categorizeEvent('mic_unmute')?.key === 'mic');
check('image_upload → upload', categorizeEvent('image_upload')?.key === 'upload');
check('error → error', categorizeEvent('error')?.key === 'error');
check('tool_call_error → error', categorizeEvent('tool_call_error')?.key === 'error');
check('perception_error → error (error beats perception)', categorizeEvent('perception_error')?.key === 'error');
check('tool_call → hidden', categorizeEvent('tool_call') === null);
check('render_sync_buffer → hidden', categorizeEvent('render_sync_buffer') === null);
check('unknown future type → hidden', categorizeEvent('some_new_event_2027') === null);
check('EVENT_CATEGORIES has 5 legend entries', EVENT_CATEGORIES.length === 5);

// curateEvents keeps only categorized, attaches category
{
  const events = [
    { data: { type: 'tool_call' } },
    { data: { type: 'mic_mute' } },
    { data: { type: 'judge_kill_snapshot' } },
    { data: {} },
  ];
  const curated = curateEvents(events);
  check('curateEvents filters uncategorized', curated.length === 2);
  check('curateEvents attaches category', curated[0].category.key === 'mic' && curated[1].category.key === 'kill');
}

// ── segments: gap cap ─────────────────────────────────────────────
{
  const segs = buildSpeakerSegments(
    [
      { offsetMs: 0, role: 'tutor' },
      { offsetMs: 5_000, role: 'student' },
      { offsetMs: 60_000, role: 'tutor' },
    ],
    100_000,
  );
  check('segment 1 ends at next entry', segs[0].start === 0 && segs[0].end === 5_000);
  check('segment 2 capped at 20s (silence not painted)', segs[1].start === 5_000 && segs[1].end === 25_000);
  check('last segment capped at 20s, not totalDuration', segs[2].start === 60_000 && segs[2].end === 80_000);
}
{
  const segs = buildSpeakerSegments([{ offsetMs: 95_000, role: 'tutor' }], 100_000);
  check('cap clamps to totalDuration', segs[0].end === 100_000);
  check('empty entries → empty segments', buildSpeakerSegments([], 100_000).length === 0);
}

// ── filters ───────────────────────────────────────────────────────
{
  // Default (no src) → Students view: $nor of showcase + every test clause.
  const f = buildSessionFilter({}) as { $nor?: Record<string, unknown>[]; source?: unknown };
  const nor = f.$nor ?? [];
  check('no params → students uses $nor, no source clause', nor.length > 0 && f.source === undefined);
  check('no params → students excludes showcase', nor.some((c) => c.source === 'showcase'));
  check('no params → students excludes source=test', nor.some((c) => c.source === 'test'));
  check('no params → students excludes Local rows', nor.some((c) => c['location.city'] === 'Local'));
  check('no params → students excludes our IPs', nor.some((c) => JSON.stringify(c.clientIp) === JSON.stringify({ $in: TEST_CLIENT_IPS })));
  const nameRx = nor.map((c) => c.studentName).filter((v): v is RegExp => v instanceof RegExp);
  check('students name exclusion matches Praveen', nameRx.some((r) => r.test('Praveen')));
  check('students name exclusion spares real names', !nameRx.some((r) => r.test('mitakshra bhaskar')));
  check('exact "test" name excluded, "Testa" spared', nameRx.some((r) => r.test(' Test ')) && !nameRx.some((r) => r.test('Testa')));
}
{
  const f = buildSessionFilter({ src: 'bogus' }) as { $nor?: unknown[] };
  check('invalid src falls back to students shape', Array.isArray(f.$nor));
}
{
  const f = buildSessionFilter({ src: 'test', q: 'Sam' }) as { $and?: { $or: unknown[] }[]; $or?: unknown[] };
  check('src=test → $and[$or test clauses]', Array.isArray(f.$and?.[0]?.$or) && f.$and![0].$or.length === testSessionClauses().length);
  check('src=test + search keeps both', Array.isArray(f.$or) && Array.isArray(f.$and));
}
{
  const f = buildSessionFilter({ src: 'embed' }) as { source?: string; $nor?: unknown[] };
  check('src=embed → embed minus tests', f.source === 'embed' && Array.isArray(f.$nor));
  const sc = buildSessionFilter({ src: 'showcase' }) as { source?: string; $nor?: unknown[] };
  check('src=showcase → no test exclusion', sc.source === 'showcase' && sc.$nor === undefined);
}
// isTestSession mirrors the clauses
check('isTestSession: source test', isTestSession({ source: 'test' }));
check('isTestSession: Local city', isTestSession({ source: 'embed', location: { city: 'Local' } }));
check('isTestSession: ::1 without location', isTestSession({ source: 'embed', clientIp: '::1' }));
check('isTestSession: our home IP', isTestSession({ source: 'embed', clientIp: '157.131.199.237' }));
check('isTestSession: Praveen elsewhere', isTestSession({ source: 'embed', clientIp: '71.154.176.167', studentName: 'Praveen' }));
check('isTestSession: real partner student', !isTestSession({ source: 'embed', clientIp: '107.3.160.147', studentName: 'GameClass', location: { city: 'Salinas' } }));
check('isTestSession: partner dev on localhost host, public IP', !isTestSession({ source: 'embed', clientIp: '49.36.182.81', studentName: 'Naresh' }));
check('src=all → no source clause', buildSessionFilter({ src: 'all' }).source === undefined);
check('src=all + audio still applies audio', (buildSessionFilter({ src: 'all', audio: '1' }) as { hasAudio?: boolean }).hasAudio === true);
check('partner filter', (buildSessionFilter({ partner: 'acme' }) as { sourcePartnerId?: string }).sourcePartnerId === 'acme');
check('host filter', (buildSessionFilter({ host: 'https://retail.example' }) as { sourceHost?: string }).sourceHost === 'https://retail.example');
check('audio=1 → hasAudio true', (buildSessionFilter({ audio: '1' }) as { hasAudio?: boolean }).hasAudio === true);
check('audio other value ignored (defaults to students)', Object.keys(buildSessionFilter({ audio: '0' })).length === 1);
{
  // A session picked up again months later belongs to the day it was last sat down to (portal-1115afec: first
  // opened 24 July, taken on 16 November, and missing from the list).
  const f = buildSessionFilter({ range: '7d' }, NOW) as { $and?: Array<{ $or: Array<Record<string, { $gte: Date }>> }> };
  const or = f.$and?.[f.$and.length - 1]?.$or ?? [];
  check('range=7d → started, or last picked up, in the last 7 days', or.length === 2 && or[0].startedAt?.$gte.getTime() === NOW.getTime() - 7 * 86_400_000 && or[1].lastStartedAt?.$gte.getTime() === NOW.getTime() - 7 * 86_400_000);
  const both = buildSessionFilter({ range: '7d', src: 'test' }, NOW) as { $and?: unknown[] };
  check('the range sits beside the test-session clause, not over it', both.$and?.length === 2);
  const dated = buildSessionFilter({ range: '7d', q: 'July 24' }, NOW) as { $and?: unknown[]; $or?: Array<Record<string, unknown>> };
  check('a typed date replaces the range and looks at both starts', !dated.$and && dated.$or?.length === 2 && 'startedAt' in dated.$or[0] && 'lastStartedAt' in dated.$or[1]);
}
{
  const f = buildSessionFilter({ range: 'today' }, NOW) as { $and?: Array<{ $or: Array<Record<string, { $gte: Date }>> }> };
  check('range=today → startedAt $gte 24h back', f.$and?.[0]?.$or[0].startedAt?.$gte.getTime() === NOW.getTime() - 86_400_000);
}
check('invalid range ignored (defaults to students)', Object.keys(buildSessionFilter({ range: 'always' })).length === 1);
{
  const f = buildSessionFilter({ src: 'embed', partner: 'acme', audio: '1' });
  check('filters compose', Object.keys(f).length === 4);
}

// ── client-ip ─────────────────────────────────────────────────────
check('xff first hop wins', extractClientIp(new Headers({ 'x-forwarded-for': '203.0.113.9, 10.0.0.1' })) === '203.0.113.9');
check('x-real-ip fallback', extractClientIp(new Headers({ 'x-real-ip': '198.51.100.7' })) === '198.51.100.7');
check('no headers → undefined', extractClientIp(new Headers()) === undefined);
check('ipv4-mapped prefix stripped', extractClientIp(new Headers({ 'x-forwarded-for': '::ffff:203.0.113.9' })) === '203.0.113.9');
check('loopback private', isPrivateIp('127.0.0.1') === true);
check('::1 private', isPrivateIp('::1') === true);
check('10.x private', isPrivateIp('10.1.2.3') === true);
check('192.168 private', isPrivateIp('192.168.1.5') === true);
check('172.16 private', isPrivateIp('172.16.0.1') === true);
check('172.31 private', isPrivateIp('172.31.255.1') === true);
check('172.32 public', isPrivateIp('172.32.0.1') === false);
check('public ip not private', isPrivateIp('203.0.113.9') === false);
check('fd00 unique-local private', isPrivateIp('fd12::1') === true);

console.log(`\nrecordings: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
