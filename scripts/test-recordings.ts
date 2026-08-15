/**
 * Unit tests for the recordings pure modules (relative-time, timeline-events,
 * segments, filters). Run: npm run test:recordings
 * Design: docs/superpowers/specs/2026-07-04-recordings-overhaul-design.md
 */
import { formatRelativeTime } from '../apps/marketing/src/lib/tutor/recordings/relative-time';
import { categorizeEvent, curateEvents, EVENT_CATEGORIES } from '../apps/marketing/src/lib/tutor/recordings/timeline-events';
import { buildSpeakerSegments } from '../apps/marketing/src/lib/tutor/recordings/segments';
import { buildSessionFilter } from '../apps/marketing/src/lib/tutor/recordings/filters';
import { extractClientIp, isPrivateIp } from '../apps/marketing/src/lib/tutor/recordings/client-ip';

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
  // Default (no src) → Students view: excludes test/showcase sources and test-named students.
  const f = buildSessionFilter({}) as { source?: { $nin?: string[] }; studentName?: { $not?: RegExp } };
  check('no params → students source $nin', JSON.stringify(f.source?.$nin) === JSON.stringify(['test', 'showcase']));
  check('no params → students name exclusion matches Praveen', f.studentName?.$not instanceof RegExp && f.studentName.$not.test('Praveen'));
  check('no params → students name exclusion spares real names', f.studentName?.$not instanceof RegExp && !f.studentName.$not.test('mitakshra bhaskar'));
}
{
  const f = buildSessionFilter({ src: 'bogus' }) as { source?: unknown };
  check('invalid src falls back to students shape', typeof f.source === 'object' && f.source !== null);
}
check('src=all → no source clause', buildSessionFilter({ src: 'all' }).source === undefined);
check('src=all + audio still applies audio', (buildSessionFilter({ src: 'all', audio: '1' }) as { hasAudio?: boolean }).hasAudio === true);
check('src=test → source filter', (buildSessionFilter({ src: 'test' }) as { source?: string }).source === 'test');
check('src=embed unchanged', (buildSessionFilter({ src: 'embed' }) as { source?: string }).source === 'embed');
check('partner filter', (buildSessionFilter({ partner: 'acme' }) as { sourcePartnerId?: string }).sourcePartnerId === 'acme');
check('host filter', (buildSessionFilter({ host: 'https://retail.example' }) as { sourceHost?: string }).sourceHost === 'https://retail.example');
check('audio=1 → hasAudio true', (buildSessionFilter({ audio: '1' }) as { hasAudio?: boolean }).hasAudio === true);
check('audio other value ignored (defaults to students)', Object.keys(buildSessionFilter({ audio: '0' })).length === 2);
{
  const f = buildSessionFilter({ range: '7d' }, NOW) as { startedAt?: { $gte: Date } };
  check('range=7d → startedAt $gte 7 days back', f.startedAt?.$gte.getTime() === NOW.getTime() - 7 * 86_400_000);
}
{
  const f = buildSessionFilter({ range: 'today' }, NOW) as { startedAt?: { $gte: Date } };
  check('range=today → startedAt $gte 24h back', f.startedAt?.$gte.getTime() === NOW.getTime() - 86_400_000);
}
check('invalid range ignored (defaults to students)', Object.keys(buildSessionFilter({ range: 'always' })).length === 2);
{
  const f = buildSessionFilter({ src: 'embed', partner: 'acme', audio: '1' });
  check('filters compose', Object.keys(f).length === 3);
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
