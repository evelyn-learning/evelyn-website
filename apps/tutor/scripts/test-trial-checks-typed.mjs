// Fixture test for block 10m (typed-turn checks) of trial-text-session-checks.mjs.
import assert from 'node:assert/strict';
import { runChecks } from './trial-text-session-checks.mjs';

const header = JSON.stringify({ sessionId: 'fixture', lp: { currentSegmentId: 'present-perfect', completedSegmentIds: ['overview', 'topic-intro'] } });
const wbRow = (t, i, obj) => `   ${t}s   ${i} ${JSON.stringify(obj)}`;
const card = (t, i, smi) => wbRow(t, i, { action: 'showSentence', data: { sentence: 'I work in sales.', emphasis: ['work'], id: 'showSentence-1' }, sourceMessageIndex: smi });
const page4 = (t, i, smi) => wbRow(t, i, { action: 'newPage', data: { title: 'Part 4 · Present perfect · 現在完了' }, sourceMessageIndex: smi });
const dump = ({ cardFirst = true, events = [] } = {}) => [
  header,
  '=== TRANSCRIPT',
  '    1s   0 tutor: Hello, welcome! こんにちは。 Today we talk about work.',
  '   10s   1 student: Yes, let us start.',
  '   11s   2 tutor: Great. What is your job?',
  '   20s   3 student: I working in sales.',
  '   21s   4 tutor: Nearly. We say I work in sales. Now the present perfect. Have you worked there long?',
  '=== WHITEBOARD',
  wbRow(1, 0, { action: 'newPage', data: { title: 'Talking About Work' } }),
  wbRow(11, 1, { action: 'newPage', data: { title: 'Part 3 · Your job · 仕事について' }, sourceMessageIndex: 2 }),
  wbRow(11, 2, { action: 'showProblem', data: { problem: { statement: 'What is your job?' } }, sourceMessageIndex: 2 }),
  ...(cardFirst ? [card(22, 3, 4), page4(22, 4, 4)] : [page4(22, 3, 4), card(22, 4, 4)]),
  wbRow(22, 5, { action: 'showProblem', data: { problem: { statement: 'Have you worked for your company for a long time?' } }, sourceMessageIndex: 4 }),
  '=== EVENTS',
  '   11s typed_turn_field: next',
  '   11s typed_turn: verdict=none next=question ack=1 say=1 correction=no retries=0',
  '   11s brain_turn: Brain 2000ms · 0 tool call(s) · 2 sentence(s)',
  '   21s typed_turn_effect: correction_card',
  '   21s typed_turn_effect: advance topic-intro→present-perfect',
  '   21s auto_newpage_on_advance_flushed: present-perfect: Part 4 · Present perfect · 現在完了 (on the transition sentence 3)',
  '   21s typed_turn: verdict=incorrect next=move ack=1 say=3 correction=yes retries=0',
  '   21s brain_turn: Brain 3000ms · 0 tool call(s) · 4 sentence(s)',
  ...events,
].join('\n');

const has = (lines, prefix) => lines.some((l) => l.startsWith(prefix));
let n = 0;
const test = (name, fn) => { fn(); n++; console.log(`ok - ${name}`); };

test('TT1 passes and TT2 fails when the correction card paints after the new page', () => {
  const { lines } = runChecks(dump({ cardFirst: false }));
  assert.ok(has(lines, 'PASS  TT1'), lines.join('\n'));
  assert.ok(has(lines, 'FAIL  TT2'), lines.join('\n'));
});

test('TT2 passes when the correction card paints before the new page; TT3–TT6 pass, TT8 no warn', () => {
  const { lines } = runChecks(dump({ cardFirst: true }));
  for (const p of ['PASS  TT1', 'PASS  TT2', 'PASS  TT3', 'PASS  TT4', 'PASS  TT5', 'PASS  TT6']) assert.ok(has(lines, p), `${p}\n${lines.join('\n')}`);
  assert.ok(!has(lines, 'WARN  TT8'), lines.join('\n'));
});

test('TT1 fails on a brain turn without its typed_turn; format_rejected fallbacks are excused', () => {
  const extra = ['   40s brain_turn: Brain 3000ms · 0 tool call(s) · 2 sentence(s)'];
  assert.ok(has(runChecks(dump({ events: extra })).lines, 'FAIL  TT1'));
  const excused = runChecks(dump({ events: [...extra, '   40s typed_turn_fallback: reason=format_rejected'] })).lines;
  assert.ok(has(excused, 'PASS  TT1'), excused.join('\n'));
  assert.ok(has(excused, 'FAIL  TT6'), 'a fallback still fails TT6');
});

test('TT3 fails on a repeated pronunciation item; TT5 fails on a prose-class event', () => {
  const { lines } = runChecks(dump({ events: ['   30s typed_turn_effect: arm_item "I have worked here."', '   50s typed_turn_effect: arm_item "I have worked here."', '   50s brain_validator_retry: x'] }));
  assert.ok(has(lines, 'FAIL  TT3'), lines.join('\n'));
  assert.ok(has(lines, 'FAIL  TT5'), lines.join('\n'));
});

test('TT2: a correction card skipped as a duplicate of a card already on the page passes', () => {
  const d = dump({ cardFirst: true }).replace('typed_turn_effect: correction_card', 'typed_turn_effect: correction_card not placed\n   21s show_sentence_duplicate_skipped: page 3: "I work in sales."').replace(/\n.*"showSentence".*\n/, '\n');
  const { lines } = runChecks(d);
  assert.ok(has(lines, 'PASS  TT2'), lines.join('\n'));
});

test('TT4 fails when an advance never breaks the page', () => {
  const d = dump({ cardFirst: true }).replace(/\n.*Part 4 · Present perfect.*"newPage".*\n|\n.*"newPage".*Part 4[^\n]*\n/, '\n').replace(/\n.*auto_newpage_on_advance_flushed[^\n]*/, '');
  const { lines } = runChecks(d);
  assert.ok(has(lines, 'FAIL  TT4'), lines.join('\n'));
});

test('carry-ins: entry-note check skipped and readiness ask only warns on a typed run', () => {
  const { lines } = runChecks(dump({ events: ['   90s readiness_ask_note_planted: x'] }));
  assert.ok(has(lines, 'INFO  every part reached got its entry note — skipped'), lines.join('\n'));
  assert.ok(!lines.some((l) => /every part reached got its entry note/.test(l) && /^(?:PASS|FAIL)/.test(l)));
  assert.ok(has(lines, 'WARN  no readiness ask on a fixed-script plan'), lines.join('\n'));
  assert.ok(lines.some((l) => l.startsWith('INFO') && /typed_turn=\d+/.test(l)), 'typed_turn in the counts');
});

test('no typed_turn events → one INFO line, no TT checks; the entry-note check still runs', () => {
  const d = dump().split('\n').filter((l) => !/typed_turn/.test(l)).join('\n');
  const { lines } = runChecks(d);
  assert.ok(has(lines, 'INFO  typed turn: off (no typed_turn events)'), lines.join('\n'));
  assert.ok(!lines.some((l) => / TT\d/.test(l)));
  assert.ok(lines.some((l) => /^(?:PASS|FAIL)  every part reached got its entry note/.test(l)));
});

console.log(`${n} passed`);
