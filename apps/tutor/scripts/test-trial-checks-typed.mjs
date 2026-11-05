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

test('TT2: a transcript entry 2 s after the typed_turn event still resolves (index join, correct sourceMessageIndex)', () => {
  const d = dump({ cardFirst: true }).replace('   21s   4 tutor:', '   23s   4 tutor:');
  const { lines } = runChecks(d);
  assert.ok(has(lines, 'PASS  TT2'), lines.join('\n'));
  assert.ok(has(lines, 'PASS  TT4'), lines.join('\n'));
});

test('TT2 falls back to the time window when the resolved turn has no card row', () => {
  // entry 4 lands 10 s late, so turnOf resolves entry 2; the card row (smi 4) is only reachable by the window
  const d = dump({ cardFirst: true }).replace('   21s   4 tutor:', '   32s   4 tutor:');
  assert.ok(has(runChecks(d).lines, 'PASS  TT2'), runChecks(d).lines.join('\n'));
});

test('TT4 passes on a newPage row without sourceMessageIndex inside the window', () => {
  const d = dump({ cardFirst: true }).replace(/(Part 4 · Present perfect[^\n]*"newPage"|"newPage"[^\n]*Part 4 · Present perfect[^\n]*?),"sourceMessageIndex":4/, '$1').replace('"sourceMessageIndex":4}\n   22s   5', '"sourceMessageIndex":4}\n   22s   5').replace(/\n.*auto_newpage_on_advance_flushed[^\n]*/, '');
  assert.ok(!/Part 4[^\n]*sourceMessageIndex/.test(d), 'fixture row must be index-less');
  const { lines } = runChecks(d);
  assert.ok(has(lines, 'PASS  TT4'), lines.join('\n'));
});

test('TT1 passes with retries=1 and a single brain_turn (real r52 line shapes)', () => {
  const d = [header, '=== TRANSCRIPT', '    1s   0 tutor: Hello! こんにちは。', '=== WHITEBOARD', '=== EVENTS',
    '   22s typed_turn_field: ack', '   24s typed_turn_field: next retried',
    '   24s typed_turn: verdict=none next=question ack=1 say=3 correction=no retries=1 reason=say_over_budget',
    '   25s brain_turn: Brain 4693ms · 0 tool call(s) · 4 sentence(s) · first_sentence=1819ms · in=9193 out=224 cr=144911 cc=13415'].join('\n');
  const { lines } = runChecks(d);
  assert.ok(has(lines, 'PASS  TT1'), lines.join('\n'));
  assert.ok(has(lines, 'INFO  TT6 typed retries: 1'), lines.join('\n'));
});

test('TT3 ignores a not-placed arm_item', () => {
  const { lines } = runChecks(dump({ events: ['   30s typed_turn_effect: arm_item "I have worked here."', '   50s typed_turn_effect: arm_item "I have worked here." not placed (x)'] }));
  assert.ok(has(lines, 'PASS  TT3'), lines.join('\n'));
});

test('45 §3: on a typed run an affirmed retry needs a card only when the typed verdict is correct', () => {
  const base = (verdict) => [header, '=== TRANSCRIPT',
    '    1s   0 tutor: Please try the sentence again. Say: I have worked in the sales department for five years.',
    '    9s   1 student: I have worked in the sales department for five years.',
    '   10s   2 tutor: Yes, that is right. Next question.',
    '=== WHITEBOARD', '=== EVENTS',
    `   12s typed_turn: verdict=${verdict} next=question ack=1 say=1 correction=no retries=0`,
    '   12s brain_turn: Brain 2000ms · 0 tool call(s) · 2 sentence(s)'].join('\n');
  const find = (d) => runChecks(d).lines.find((l) => /45 §3/.test(l));
  assert.ok(/^PASS/.test(find(base('none'))), find(base('none')));
  assert.ok(/^FAIL/.test(find(base('correct'))), find(base('correct')));
});

test('pronunciation menu: a Japanese menu turn (next=menu) counts; no menu turn still FAILs', () => {
  const mk = (evs) => [header, '=== TRANSCRIPT', '    1s   0 tutor: 1) 単語, 2) 文, 3) 自然な話し方, 4) スキップして次へ。 Which one would you like?',
    '=== WHITEBOARD', wbRow(1, 0, { action: 'newPage', data: { title: 'Part 5 · Pronunciation · 発音' } }), '=== EVENTS', ...evs].join('\n');
  const mkEv = (nxt) => ['   10s typed_turn: verdict=none next=' + nxt + ' ack=1 say=2 correction=no retries=0', '   10s brain_turn: Brain 2000ms · 0 tool call(s) · 2 sentence(s)'];
  const find = (d) => runChecks(d).lines.find((l) => /menu asked within/.test(l));
  assert.ok(/^PASS/.test(find(mk(mkEv('menu')))), find(mk(mkEv('menu'))));
  assert.ok(/^FAIL/.test(find(mk(mkEv('question')))), find(mk(mkEv('question'))));
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

// ---- Task 9 fix round 1 (F4 + re-review) ----
test('TT9: a move into the pronunciation part passes when the same turn carries the numbered menu', () => {
  const d = dump({ cardFirst: true, events: ['   21s typed_turn_effect: advance open-conversation→pronunciation'] })
    .replace('Have you worked there long?', 'Would you like to practise? You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip.');
  const { lines } = runChecks(d);
  assert.ok(has(lines, 'PASS  TT9'), lines.join('\n'));
});

test('TT9: a move into the pronunciation part FAILs when the turn invents an item instead of the menu', () => {
  const d = dump({ cardFirst: true, events: ['   21s typed_turn_effect: advance open-conversation→pronunciation'] })
    .replace('Have you worked there long?', 'Here is the first sentence: I have worked here for three years. Please repeat it after me.');
  const { lines } = runChecks(d);
  assert.ok(has(lines, 'FAIL  TT9'), lines.join('\n'));
});

test('G3: TT9 WARNs (not FAILs) when the menu is read without numbers (r55 1069 s)', () => {
  const d = dump({ cardFirst: true, events: ['   21s typed_turn_effect: advance open-conversation→pronunciation'] })
    .replace('Have you worked there long?', "Now let's move to pronunciation. Would you like to practice individual words, a complete sentence, speaking more naturally, or skip and continue?");
  const { lines } = runChecks(d);
  assert.ok(has(lines, 'WARN  TT9'), lines.join('\n'));
  assert.ok(!has(lines, 'FAIL  TT9') && !has(lines, 'PASS  TT9'), lines.join('\n'));
});

// the correction turn (21 s) has NO card of its own; the previous turn (typed_turn 18 s) left a card at 16 s
const noOwnCard = (cardRow) => dump({ cardFirst: true })
  .replace(/\n.*showSentence-1.*"sourceMessageIndex":4\}/, '')
  .replace('\n   22s   5 {', `\n${cardRow}\n   22s   5 {`)
  .replace('   21s typed_turn_effect: correction_card', '   18s typed_turn: verdict=none next=question ack=1 say=1 correction=no retries=0\n   18s brain_turn: Brain 2000ms · 0 tool call(s) · 2 sentence(s)\n   21s typed_turn_effect: correction_card');

test('TT2 fallback: a previous turn\'s card 5 s earlier does not mask a correction turn with no card of its own', () => {
  const d = noOwnCard(wbRow(16, 3, { action: 'showSentence', data: { sentence: 'I work in sales.', emphasis: ['work'] } }));
  assert.ok(!/showSentence-1/.test(d), 'fixture: the turn\'s own card removed');
  const { lines } = runChecks(d);
  assert.ok(has(lines, 'FAIL  TT2'), lines.join('\n'));
});

test('TT2 fallback: a showSentence without emphasis inside the window is not a correction card', () => {
  const d = noOwnCard(wbRow(23, 3, { action: 'showSentence', data: { sentence: 'Have you worked there long?' } }));
  const { lines } = runChecks(d);
  assert.ok(has(lines, 'FAIL  TT2'), lines.join('\n'));
});

// W5: TT10 part overrun (the post-due cap dead on the typed path, r55–r57 open-conversation 33/27/32 turns)
const tt10Dump = (convTurns, { engine = false } = {}) => {
  const ev = ['   30s typed_turn_effect: advance present-perfect→past-simple', '   30s typed_turn: verdict=none next=move ack=1 say=2 correction=no retries=0'];
  for (let i = 0; i < 3; i++) ev.push(`   ${40 + i}s typed_turn: verdict=correct next=question ack=1 say=1 correction=no retries=0`);
  ev.push(`   50s typed_turn_effect: advance past-simple→open-conversation${engine ? ' (engine)' : ''}`);
  if (!engine) ev.push('   50s typed_turn: verdict=none next=move ack=1 say=2 correction=no retries=0');
  for (let i = 0; i < convTurns; i++) ev.push(`   ${60 + i}s typed_turn: verdict=correct next=question ack=1 say=1 correction=no retries=0`);
  ev.push('  200s typed_turn_effect: advance open-conversation→pronunciation', '  200s typed_turn: verdict=none next=move ack=1 say=3 correction=no retries=0');
  return dump({ events: ev });
};
const tt10 = (d) => runChecks(d).lines.find((l) => / TT10 /.test(l)) ?? '';
test('TT10 passes when every part stays within maxTurns + 2 (open-conversation 14 = 12 + 2)', () => {
  // the move turn counts in the part it leaves: 13 questions + the move = 14
  const line = tt10(tt10Dump(13));
  assert.ok(/^PASS  TT10/.test(line), line);
  assert.ok(/open-conversation 14\/12/.test(line), line);
});
test('TT10 FAILs on a part overrun (open-conversation 33/12, r55)', () => {
  const line = tt10(tt10Dump(32));
  assert.ok(/^FAIL  TT10/.test(line), line);
  assert.ok(/open-conversation 33\/12/.test(line), line);
});
test('TT10: an engine move\'s turn counts in the part it entered', () => {
  // past-simple: 3 questions (an engine advance has no move turn of its own); open-conversation: 13 + the move out = 14
  const line = tt10(tt10Dump(13, { engine: true }));
  assert.ok(/past-simple 3\/8/.test(line) && /open-conversation 14\/12/.test(line), line);
});

// V3 (fix wave 2): TT11 the summary closes itself (voice run embed-1793805528967: three question turns, then the backstop)
const tt11Dump = ({ phrases = true, close = true, backstop = null, reach = true } = {}) => [
  JSON.stringify({ sessionId: 'fixture', lp: { currentSegmentId: 'summary', completedSegmentIds: ['overview'] } }),
  '=== TRANSCRIPT',
  '    1s   0 tutor: Hello, welcome! こんにちは。 Let us practise pronunciation.',
  '   10s   1 student: Number two.',
  '   11s   2 tutor: Great work. Now the summary. Which sentence from today are you happy with?',
  '   20s   3 student: I have worked with customers for five years.',
  `   21s   4 tutor: Great work today! You practised two grammar points. ${phrases ? 'One thing you did well was' : 'You did well with'} your clear examples. ${phrases ? 'Can you explain the difference between' : 'Can you compare'} these two sentences?`,
  '   30s   5 student: The first one is still now, the second one is finished.',
  `   31s   6 tutor: Exactly right. Well done, see you next time!`,
  '=== WHITEBOARD',
  wbRow(1, 0, { action: 'newPage', data: { title: 'Talking About Work' } }),
  '=== EVENTS',
  '    1s typed_turn: verdict=none next=menu ack=1 say=3 correction=no retries=0',
  '    1s brain_turn: Brain 2000ms · 0 tool call(s) · 2 sentence(s)',
  ...(reach ? ['   11s typed_turn_effect: advance pronunciation→summary'] : []),
  '   11s typed_turn: verdict=correct next=move ack=1 say=2 correction=no retries=0',
  '   11s brain_turn: Brain 2000ms · 0 tool call(s) · 2 sentence(s)',
  '   21s typed_turn: verdict=correct next=question ack=1 say=6 correction=no retries=0',
  '   21s brain_turn: Brain 2000ms · 0 tool call(s) · 6 sentence(s)',
  `   31s typed_turn: verdict=correct next=${close ? 'close' : 'question'} ack=1 say=2 correction=no retries=0`,
  '   31s brain_turn: Brain 2000ms · 0 tool call(s) · 2 sentence(s)',
  ...(backstop ? [`   33s fixed_script_close_forced: "summary" — ${backstop}`] : []),
].join('\n');
const tt11 = (d) => runChecks(d).lines.find((l) => / TT11 /.test(l)) ?? '';
test('TT11 passes: review turn has both required phrases, a typed close, no backstop', () => {
  const line = tt11(tt11Dump());
  assert.ok(/^PASS  TT11/.test(line), line);
});
test('TT11 FAILs when the backstop fired (no close_session_notes / typed turn close fallback)', () => {
  assert.ok(/^FAIL  TT11/.test(tt11(tt11Dump({ backstop: '3 tutor turns after the close note, no close_session_notes' }))));
  assert.ok(/^FAIL  TT11/.test(tt11(tt11Dump({ backstop: 'typed turn close fallback' }))));
});
test('TT11 FAILs when a required phrase is missing, or no typed turn in the summary has next=close', () => {
  const p = tt11(tt11Dump({ phrases: false }));
  assert.ok(/^FAIL  TT11/.test(p) && /one thing you did well/.test(p) && /the difference between/.test(p), p);
  const c = tt11(tt11Dump({ close: false }));
  assert.ok(/^FAIL  TT11/.test(c) && /no next=close/.test(c), c);
});
test('TT11 is INFO when the run never reached the summary', () => {
  const line = tt11(tt11Dump({ reach: false }));
  assert.ok(/^INFO  TT11/.test(line), line);
});

// X3 (fix wave 3): TT12 no move language in a non-move turn (r61b 71 s / 147 s: "このレベルチェックはここまでです。 Let's move on to your work." with next=question)
const tt12Dump = ({ moveWords = false, kind = 'question' } = {}) => dump({ events: [] }).replace(
  '   21s   4 tutor: Nearly. We say I work in sales. Now the present perfect. Have you worked there long?',
  `   21s   4 tutor: Nearly. We say I work in sales. ${moveWords ? "このパートはここまでです。 Let's move on to your work." : 'Good.'} Have you worked there long?`,
).replace('   21s typed_turn: verdict=incorrect next=move', `   21s typed_turn: verdict=incorrect next=${kind}`);
const tt12 = (d) => runChecks(d).lines.find((l) => / TT12 /.test(l)) ?? '';
test('TT12 passes when no non-move turn speaks move language (a move turn may)', () => {
  assert.ok(/^PASS  TT12/.test(tt12(tt12Dump())), tt12(tt12Dump()));
  const mv = tt12(tt12Dump({ moveWords: true, kind: 'move' }));
  assert.ok(/^PASS  TT12/.test(mv), mv);
});
test('TT12: an offer\'s own "or … move on to …?" choice passes; move language outside it in an offer FAILs (r61b 391 s / 553 s)', () => {
  const offer = (text) => tt12(tt12Dump({ kind: 'offer' }).replace('Nearly. We say I work in sales. Good. Have you worked there long?', text));
  const ok1 = offer('OK. Would you like one more question like this, or shall we move on to the past simple?');
  assert.ok(/^PASS  TT12/.test(ok1), ok1);
  const bad = offer("このパートはここまでです。 Would you like one more question, or shall we move on to the past simple?");
  assert.ok(/^FAIL  TT12/.test(bad) && /next=offer/.test(bad), bad);
});
test('TT12 FAILs on move language in a question turn, with the timestamp', () => {
  const line = tt12(tt12Dump({ moveWords: true }));
  assert.ok(/^FAIL  TT12/.test(line) && /21s/.test(line), line);
  const ja = tt12(dump({ events: [] }).replace('Great. What is your job?', 'では、次に進みましょう。 What is your job?'));
  assert.ok(/^FAIL  TT12/.test(ja) && /11s/.test(ja), ja);
});

// Y4 (fix wave 7, session 1 414 s): TT14 a question turn does not dictate opening words
const tt14 = (d) => runChecks(d).lines.find((l) => / TT14 /.test(l)) ?? '';
const tt14Dump = (text, kind = 'question') => tt12Dump({ kind }).replace('Nearly. We say I work in sales. Good. Have you worked there long?', text);
test('TT14 passes when no question turn says "starting with" (a retry may)', () => {
  const line = tt14(tt14Dump('Nearly. We say I work in sales. Have you worked there long?'));
  assert.ok(/^PASS  TT14/.test(line), line);
  const retry = tt14(tt14Dump('Nearly. Please say it again, starting with: I have worked.', 'retry'));
  assert.ok(/^PASS  TT14/.test(retry), retry);
});
test('TT14 FAILs when a next=question turn dictates the opening words, with the timestamp', () => {
  const line = tt14(tt14Dump('Good. Please answer with a full sentence starting with Have you ever.'));
  assert.ok(/^FAIL  TT14/.test(line) && /21s/.test(line) && /starting with/i.test(line), line);
});

// Z2 (fix wave 5): TT13 a move turn does not board (p2.txt 926 s)
const tt13 = (d) => runChecks(d).lines.find((l) => / TT13 /.test(l)) ?? '';
test('TT13 passes when the move turn boards nothing (the fixture move turn has a correction card only)', () => {
  const line = tt13(dump());
  assert.ok(/^PASS  TT13/.test(line) && /1 brain moves/.test(line), line);
});
test('TT13 FAILs when a model_card and a brain advance share a turn, with the timestamp', () => {
  const d = dump().replace('   21s typed_turn_effect: correction_card', '   21s typed_turn_effect: model_card');
  const line = tt13(d);
  // round 3 pin move (H3): the FAIL now names the student-visible cause — no hold was logged for the boarded move
  assert.ok(/^FAIL  TT13/.test(line) && /21s topic-intro→present-perfect: model_card at 21s, no hold logged/.test(line), line);
});
test('TT13: a model card of the PREVIOUS turn, or an engine move, does not count', () => {
  const prev = dump().replace('   11s typed_turn_field: next', '   11s typed_turn_effect: model_card\n   11s typed_turn_field: next');
  assert.ok(/^PASS  TT13/.test(tt13(prev)), tt13(prev));
  const eng = dump().replace('   21s typed_turn_effect: correction_card', '   21s typed_turn_effect: model_card')
    .replace('advance topic-intro→present-perfect', 'advance topic-intro→present-perfect (engine)');
  assert.ok(/^PASS  TT13/.test(tt13(eng)), tt13(eng));
});

test('TT13 (round 1 I1): a "model_card not placed" is not a boarded card', () => {
  const d = dump().replace('   21s typed_turn_effect: correction_card', '   21s typed_turn_effect: model_card not placed (duplicate)');
  const line = tt13(d);
  assert.ok(/^PASS  TT13/.test(line), line);
});

// H3 (fix wave 5 round 3): TT13 judges the page turn the student sees, not the brain's board choice
const boarded = (extra = '', flushT = 21) => dump().replace('   21s typed_turn_effect: correction_card', '   21s typed_turn_effect: model_card')
  .replace('   21s typed_turn_effect: advance topic-intro→present-perfect', `   21s typed_turn_effect: advance topic-intro→present-perfect\n   21s typed_turn_page_turn_held_for_card: topic-intro→present-perfect: page + card after say sentence 3${extra}`)
  .replace('   21s auto_newpage_on_advance_flushed: present-perfect: Part 4 · Present perfect · 現在完了 (on the transition sentence 3)', `   ${flushT}s auto_newpage_on_advance_flushed: present-perfect: Part 4 · Present perfect · 現在完了 at turn end`);
const withNextStudent = (d) => d.replace('=== WHITEBOARD', '   40s   5 student: Yes, I have.\n=== WHITEBOARD');
test('TT13 PASS: a boarded move whose page was held and turned before the next student turn', () => {
  const line = tt13(withNextStudent(boarded('', 25)));
  assert.ok(/^PASS  TT13/.test(line), line);
});
test('TT13 WARN: the hold was released by the fallback', () => {
  const line = tt13(withNextStudent(boarded('\n   25s typed_turn_page_turn_fallback: reason=drained audio drained: say sentence 3 never finished', 25)));
  assert.ok(/^WARN  TT13/.test(line) && /21s topic-intro→present-perfect/.test(line) && /fallback/.test(line), line);
});
test('TT13 FAIL: a boarded move with no hold logged', () => {
  const d = withNextStudent(boarded('', 25)).replace(/\n   21s typed_turn_page_turn_held_for_card:[^\n]*/, '');
  const line = tt13(d);
  assert.ok(/^FAIL  TT13/.test(line) && /no hold logged/.test(line), line);
});
test('TT13 FAIL: the page turned at/after the next student turn (bot r64 109 s)', () => {
  const line = tt13(withNextStudent(boarded('', 40)));
  assert.ok(/^FAIL  TT13/.test(line) && /late flush 40s/.test(line), line);
  const never = tt13(withNextStudent(boarded('', 21)).replace(/\n   21s auto_newpage_on_advance_flushed:[^\n]*/, ''));
  assert.ok(/^FAIL  TT13/.test(never) && /no flush/.test(never), never);
});

console.log(`${n} passed`);
