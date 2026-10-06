/**
 * Session times are shown in the VIEWER's time zone.
 *
 * Defect this pins (GreenApple app walk 2026-10-05, M6): the replay page is
 * server-rendered and formatted the session start (and every transcript
 * bubble's stamp) with toLocale* ON THE SERVER, so a student saw the server's
 * zone, unlabelled — "Oct 6, 2026, 1:53 AM" for a session at 6:53 PM their
 * time. `LocalTime` renders a UTC-LABELLED string on the server / first paint
 * (stable, so hydration is clean) and the viewer's local time once hydrated.
 *
 * Run: npx tsx scripts/test-local-time.tsx  (npm run test:local-time)
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { formatInstant } from '../src/lib/tutor/format-instant';
import { LocalTime } from '../src/components/session/LocalTime';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}
const src = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8');
/** Intl uses U+202F before AM/PM on newer ICU — compare with plain spaces. */
const plain = (s: string) => s.replace(/[  ]/g, ' ');

// 2026-10-05 18:53:07 in Los Angeles = 2026-10-06 01:53:07 UTC = 03:53:07 in Berlin.
const ISO = '2026-10-06T01:53:07.000Z';

function main() {
  console.log('LocalTime / formatInstant');

  test('same instant, three viewers: each sees their own wall clock (date-time)', () => {
    assert.equal(plain(formatInstant(ISO, 'datetime', 'America/Los_Angeles')), 'Oct 5, 2026, 6:53 PM');
    assert.equal(plain(formatInstant(ISO, 'datetime', 'Europe/Berlin')), 'Oct 6, 2026, 3:53 AM');
    assert.equal(plain(formatInstant(ISO, 'datetime', 'Asia/Kolkata')), 'Oct 6, 2026, 7:23 AM');
  });

  test('the server / first-paint form is UTC and says so', () => {
    assert.equal(plain(formatInstant(ISO, 'datetime', 'UTC')), 'Oct 6, 2026, 1:53 AM UTC');
    assert.equal(plain(formatInstant(ISO, 'time', 'UTC')), '01:53:07 AM UTC');
  });

  test('time-only form keeps the transcript bubble format (2-digit h:m:s)', () => {
    assert.equal(plain(formatInstant(ISO, 'time', 'America/Los_Angeles')), '06:53:07 PM');
    assert.equal(plain(formatInstant(ISO, 'time', 'Europe/Berlin')), '03:53:07 AM');
  });

  test('no zone given = the runtime\'s own zone, identical to the previous toLocale* output', () => {
    assert.equal(
      formatInstant(ISO, 'datetime'),
      new Date(ISO).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    );
    assert.equal(
      formatInstant(ISO, 'time'),
      new Date(ISO).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    );
  });

  test('a missing or unparseable instant renders nothing (never "Invalid Date")', () => {
    for (const bad of [undefined, null, '', 'not a date', {}]) {
      assert.equal(formatInstant(bad as never, 'datetime', 'UTC'), '');
      assert.equal(formatInstant(bad as never, 'time'), '');
    }
    assert.equal(renderToStaticMarkup(<LocalTime iso={undefined} kind="datetime" />), '');
  });

  test('accepts a Date and epoch milliseconds as well as an ISO string', () => {
    const want = formatInstant(ISO, 'datetime', 'UTC');
    assert.equal(formatInstant(new Date(ISO), 'datetime', 'UTC'), want);
    assert.equal(formatInstant(Date.parse(ISO), 'datetime', 'UTC'), want);
  });

  test('server render: a <time> with the machine-readable instant and the UTC-labelled text, whatever the server zone', () => {
    const before = process.env.TZ;
    try {
      for (const tz of ['Europe/Berlin', 'America/Los_Angeles', 'UTC']) {
        process.env.TZ = tz;
        const html = plain(renderToStaticMarkup(<LocalTime iso={ISO} kind="datetime" className="x" />));
        assert.equal(html, `<time dateTime="${ISO}" class="x">Oct 6, 2026, 1:53 AM UTC</time>`, tz);
      }
    } finally {
      if (before === undefined) delete process.env.TZ; else process.env.TZ = before;
    }
  });

  test('LocalTime swaps to the viewer zone only once hydrated (hydration-safe)', () => {
    const c = src('src/components/session/LocalTime.tsx');
    assert.match(c, /^'use client';/);
    assert.match(c, /useSyncExternalStore\(subscribeNever, \(\) => true, \(\) => false\)/, 'false on the server and during hydration, true after');
    assert.match(c, /formatInstant\(iso, kind, hydrated \? undefined : 'UTC'\)/);
    assert.match(c, /suppressHydrationWarning/);
  });

  test('replay page and transcript bubbles format no time on the server', () => {
    const page = src('src/app/tutor-portal/replay/page.tsx');
    assert.doesNotMatch(page, /toLocale(?:String|TimeString|DateString)\(/);
    assert.match(page, /<LocalTime iso=\{s\.startedAt\} kind="datetime" \/>/);
    const player = src('src/app/admin/tutor-sessions/components/ReplayPlayer.tsx');
    const bubble = player.slice(player.indexOf('export function TranscriptBubble'), player.indexOf('export function TranscriptBubble') + 1400);
    assert.doesNotMatch(bubble, /toLocale(?:String|TimeString|DateString)\(/);
    assert.match(bubble, /<LocalTime iso=\{entry\.timestamp\} kind="time" className="text-\[10px\] opacity-40" \/>/);
  });

  console.log(`\n${passed}/${passed + failed} passed`);
  process.exit(failed ? 1 : 0);
}
main();
