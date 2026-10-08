/**
 * Whole-lesson timeline (partner spec v1.2 §4): clamp-never-reject parsing
 * and the per-turn window the model sees.
 *
 * Run: npm run test:host-lesson-timeline
 */
import { strict as assert } from 'node:assert';
import {
  LESSON_NOW_LIMITS,
  LESSON_NOW_MAX_CHARS,
  LESSON_TIMELINE_LIMITS,
  parseLessonTimeline,
  renderLessonNow,
  type TimelineEntry,
} from '../src/lib/tutor/portal/host-lesson-timeline';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

const msg = (timeline: unknown) => ({ type: 'evelyn:lesson', timeline });

test('limits are the spec values', () => {
  assert.deepEqual(LESSON_TIMELINE_LIMITS, { entries: 5000, entryChars: 500, totalChars: 150_000 });
});

test('parse: the host transcript format passes through; kind defaults to speech', () => {
  const p = parseLessonTimeline(msg([
    { start: 0, end: 4.2, text: 'Welcome back' },
    { start: 148, kind: 'visual', text: 'Chart 3: A 45%, B 30%' },
    { start: 131.4, end: 134, text: 'Watch what happens' },
  ]));
  assert.ok(p);
  assert.deepEqual(p.entries, [
    { start: 0, end: 4.2, text: 'Welcome back', kind: 'speech' },
    { start: 131.4, end: 134, text: 'Watch what happens', kind: 'speech' },
    { start: 148, text: 'Chart 3: A 45%, B 30%', kind: 'visual' },
  ]);
  assert.equal(p.received, 3);
  assert.equal(p.cut, false);
});

test('parse: wrong type or a non-array timeline is not a lesson', () => {
  for (const d of [null, 'x', {}, { type: 'evelyn:lesson' }, { type: 'evelyn:lesson', timeline: 'abc' }, { type: 'evelyn:lesson', timeline: { 0: {} } }, { type: 'evelyn:lessons', timeline: [] }]) {
    assert.equal(parseLessonTimeline(d), null, JSON.stringify(d));
  }
  assert.deepEqual(parseLessonTimeline(msg([]))?.entries, []);
});

test('parse: malformed entries are skipped, never thrown on (Review Focus 4)', () => {
  const p = parseLessonTimeline(msg([
    null, 7, 'x', [], {}, { start: NaN, text: 'a' }, { start: -1, text: 'a' }, { start: '3', text: 'a' },
    { start: 1 }, { start: 1, text: '   ' }, { start: 1, text: 42 },
    { start: 2, end: 1, text: 'end before start' }, { start: 3, end: 'x', text: 'bad end' }, { start: 4, kind: 'banana', text: 'odd kind' },
  ]));
  assert.ok(p);
  assert.deepEqual(p.entries, [
    { start: 2, text: 'end before start', kind: 'speech' },
    { start: 3, text: 'bad end', kind: 'speech' },
    { start: 4, text: 'odd kind', kind: 'speech' },
  ]);
  assert.equal(p.received, 14);
});

test('parse: entry text over 500 characters is cut', () => {
  const p = parseLessonTimeline(msg([{ start: 0, text: 'x'.repeat(1_000_000) }]));
  assert.equal(p?.entries[0].text.length, 500);
  assert.equal(p?.cut, true);
});

test('parse: more than 5,000 entries keeps the first 5,000', () => {
  const p = parseLessonTimeline(msg(Array.from({ length: 50_000 }, (_, i) => ({ start: i, text: 'w' }))));
  assert.equal(p?.entries.length, 5000);
  assert.equal(p?.entries[4999].start, 4999);
  assert.equal(p?.cut, true);
});

test('parse: total text over 150,000 characters is cut at the limit', () => {
  const p = parseLessonTimeline(msg(Array.from({ length: 400 }, (_, i) => ({ start: i, text: 'y'.repeat(500) }))));
  assert.ok(p);
  assert.equal(p.entries.reduce((n, e) => n + e.text.length, 0), 150_000);
  assert.equal(p.entries.length, 300);
  assert.equal(p.cut, true);
});

const TL: TimelineEntry[] = [
  { start: 0, end: 4, text: 'Welcome back.', kind: 'speech' },
  { start: 20, kind: 'visual', text: 'Chart 1: the track map.' },
  { start: 131, end: 134, text: 'Watch what happens', kind: 'speech' },
  { start: 134, end: 137, text: 'when the box opens.', kind: 'speech' },
  { start: 148, kind: 'visual', text: 'Chart 3: A 45%, B 30%, C 20%, D 5%.' },
  { start: 163, end: 166, text: 'The least likely one came up.', kind: 'speech' },
  { start: 400, kind: 'visual', text: 'Chart 9: the final table.' },
  { start: 401, end: 404, text: 'Far in the future.', kind: 'speech' },
];

test('render: nothing until the host has reported a video state', () => {
  assert.equal(renderLessonNow({ timeline: TL, video: null, positionSeconds: null, resumeTool: true }), undefined);
});

test('render: state line, visuals so far, speech around the position', () => {
  const r = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: 150, resumeTool: true });
  assert.ok(r);
  assert.match(r, /The video is paused at 2:30\./);
  assert.match(r, /\[0:20\] Chart 1: the track map\./);
  assert.match(r, /\[2:28\] Chart 3: A 45%, B 30%, C 20%, D 5%\./);
  assert.ok(!r.includes('Chart 9'), 'a visual that has not appeared yet is not shown');
  assert.match(r, /\[2:11\] Watch what happens when the box opens\./);
  assert.match(r, /\[2:43\] The least likely one came up\./);
  assert.ok(!r.includes('Welcome back'), 'speech far before the position is outside the window');
  assert.ok(!r.includes('Far in the future'));
  assert.ok(r.indexOf('Chart 1') < r.indexOf('Chart 3'), 'visuals in time order');
});

test('render: resume instructions only when the tool is offered and the video can resume', () => {
  const on = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: 150, resumeTool: true }) ?? '';
  assert.match(on, /`resume_lesson`/);
  const off = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: 150, resumeTool: false }) ?? '';
  assert.ok(!off.includes('resume_lesson'));
  const ended = renderLessonNow({ timeline: TL, video: 'ended', positionSeconds: 500, resumeTool: true }) ?? '';
  assert.match(ended, /The video has finished/);
  assert.ok(!/call `resume_lesson`/.test(ended));
});

test('render: no timeline still gives the state and the rules', () => {
  const r = renderLessonNow({ timeline: null, video: 'paused', positionSeconds: 12, resumeTool: true }) ?? '';
  assert.match(r, /The video is paused at 0:12\./);
  assert.ok(!r.includes('On screen so far'));
  assert.match(r, /`resume_lesson`/);
});

test('render: unknown position shows the visuals but no speech window', () => {
  const r = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: null, resumeTool: false }) ?? '';
  assert.match(r, /The video is paused\./);
  assert.ok(!r.includes('What is said around this point'));
});

test('render: budgets hold on the largest timeline; the newest visuals and nearest speech survive', () => {
  const big: TimelineEntry[] = [];
  for (let i = 0; i < 2500; i++) big.push({ start: i, text: `s${i} ` + 'w'.repeat(400), kind: 'speech' });
  for (let i = 0; i < 2500; i++) big.push({ start: i, text: `v${i} ` + 'z'.repeat(400), kind: 'visual' });
  big.sort((a, b) => a.start - b.start);
  const r = renderLessonNow({ timeline: big, video: 'paused', positionSeconds: 2000, resumeTool: true }) ?? '';
  assert.ok(r.length <= LESSON_NOW_MAX_CHARS, `block is ${r.length} chars`);
  assert.ok(r.includes('v2000 '), 'the visual on screen now is kept');
  assert.ok(!r.includes('v100 '), 'old visuals are dropped first');
  assert.ok(r.includes('s2000 '), 'speech at the position is kept');
  assert.ok(LESSON_NOW_LIMITS.speechChars + LESSON_NOW_LIMITS.visualChars < LESSON_NOW_MAX_CHARS);
});

test('render: generic wording — no partner or game names', () => {
  const r = renderLessonNow({ timeline: [], video: 'playing', positionSeconds: 1, resumeTool: true }) ?? '';
  assert.ok(!/gameclass|mario|sonic/i.test(r));
});

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
