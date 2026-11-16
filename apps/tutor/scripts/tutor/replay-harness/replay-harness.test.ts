/// <reference types="node" />
/**
 * Replay harness unit suite — no network, no browser.
 *   npm run test:replay-harness
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildStudentSystemPrompt, needsOpeningLine, observerLine, parseStudentReply, scriptedStudentTurn, type Fixture, type ReplayTurn } from './scripted-student';
import { averageScorecards, scoreRun, type RunBundle } from './scorecard';
import { buildPickPrompt, isShortAck, parsePick, pickClip, silentTtsBody, type AudioClip } from './audio-student';
import { parseLiveDump, wav } from './cut-clips';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};

async function main() {
  const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'calc-lhopital.json'), 'utf8')) as Fixture;

  console.log('fixture');
  check('names its source sessions', fixture.sourceSessions.length >= 1 && fixture.sourceSessions.every((s) => /^portal-|^embed-/.test(s)));
  check('carries the claims the embed needs', ['subject', 'level', 'curriculum_module', 'input_mode'].every((k) => k in fixture.claims));
  check('every reaction has a known complaint or request tag', fixture.student.reactions.every((r) => ['complaint_reask', 'complaint_ignored', 'move_on', 'verdict_only', 'recap_request', 'end_request'].includes(r.tag)));

  console.log('opening line');
  check('text mode opens with a typed line', needsOpeningLine({ input_mode: 'text' }));
  check('voice and default runs do not', !needsOpeningLine({ input_mode: 'voice' }) && !needsOpeningLine({}) && !needsOpeningLine(fixture.claims));

  console.log('student prompt');
  const prompt = buildStudentSystemPrompt(fixture.student);
  check('lists every beat and reaction', fixture.student.beats.every((b) => prompt.includes(`[${b.id}`)) && fixture.student.reactions.every((r) => prompt.includes(`tag ${r.tag}`)));
  check('asks for one line of JSON', /ONE line of JSON/.test(prompt));
  check('says a cooperative tutor gets a cooperative reply', /cooperative/.test(prompt));

  console.log('reply parsing');
  check('reads a JSON reply', JSON.stringify(parseStudentReply('{"tag":"move_on","say":"I know this, next."}')) === JSON.stringify({ tag: 'move_on', say: 'I know this, next.' }));
  check('reads JSON wrapped in prose', parseStudentReply('Sure: {"tag":"answer","say":"3"} ok').say === '3');
  check('an unknown tag falls back to answer', parseStudentReply('{"tag":"shrug","say":"hm"}').tag === 'answer');
  check('plain text becomes an answer', JSON.stringify(parseStudentReply('"It is zero."')) === JSON.stringify({ tag: 'answer', say: 'It is zero.' }));

  console.log('turn assembly');
  let seen: { role: string; content: string }[] = [];
  const history: ReplayTurn[] = [
    { role: 'tutor', text: 'Hey.' }, { role: 'tutor', text: 'What is sin 0?' },
    { role: 'student', text: 'Zero.', tag: 'answer' },
  ];
  const r = await scriptedStudentTurn(fixture.student, 'Right. And cos 0?', history, { complete: async (_s, m) => { seen = m; return '{"tag":"answer","say":"One."}'; } });
  check('returns the stubbed reply', r.say === 'One.' && r.tag === 'answer');
  check('roles alternate and start with the tutor', seen.map((m) => m.role).join(',') === 'user,assistant,user');
  check('adjacent tutor turns are merged', seen[0].content.includes('Hey.') && seen[0].content.includes('sin 0'));
  check('the student sees its own earlier tag', seen[1].content.includes('"tag":"answer"'));

  check('the latest tutor turn carries the observer facts', /\[observer\] this tutor turn: 4 words, ends with a question\. Your previous turn was: answer/.test(seen[2].content), seen[2].content);
  check('the observer counts earlier complaints', /asked to move on 1 time/.test(observerLine('Fine.', [{ role: 'student', text: 'next', tag: 'move_on' }])));
  check('the prompt quotes the real student for tone', prompt.includes('Just tell me if I got the 3 parts right'));

  console.log('scorecard');
  const bundle: RunBundle = {
    fixture: 'calc-lhopital', arm: 'v1', startedAt: '2026-11-09T00:00:00Z', minutes: 10, endedBy: 'tutor_close', estimatedCost: 0.5,
    turns: [
      { role: 'tutor', text: 'What is sin 0?' },
      { role: 'student', text: 'Zero.', tag: 'answer' },
      { role: 'tutor', text: 'Right. Why is that?' },
      { role: 'student', text: 'I know this, move on.', tag: 'move_on' },
      { role: 'tutor', text: 'Sure. Try this limit.' },
      { role: 'student', text: 'It is 3.', tag: 'answer' },
      { role: 'tutor', text: 'Let us check the working step by step one two three four five six seven eight.' },
      { role: 'student', text: 'Just tell me if I am right.', tag: 'verdict_only' },
      { role: 'tutor', text: 'Yes, 3 is right.' },
      { role: 'student', text: 'Recap please.', tag: 'recap_request' },
      { role: 'tutor', text: 'Before the recap, one more question?' },
      { role: 'student', text: 'Just the recap.', tag: 'complaint_ignored' },
      { role: 'tutor', text: 'Here is the recap. Three takeaways to hold onto.' },
    ],
    events: [
      { type: 'brain_turn', message: 'Brain 5328ms · 1 tool call(s) · first_sentence=2000ms · in=100 out=20 cr=1000 cc=5' },
      { type: 'brain_turn', message: 'Brain 4000ms · first_sentence=1000ms · in=200 out=30 cr=2000' },
      { type: 'voice_verdict_cut', message: 'praised_incorrect' },
      { type: 'meta_narration_dropped', message: 'x' },
    ],
  };
  const card = scoreRun(bundle);
  check('counts complaints by tag', card.complaints.move_on === 1 && card.complaints.verdict_only === 1 && card.complaints.complaint_ignored === 1 && card.complaintsTotal === 3, card.complaints);
  check('question after an answer: 1 of 2', card.questionAfterAnswerShare === 0.5, card.questionAfterAnswerShare);
  check('words after a verdict-only request', card.wordsAfterVerdictOnly === 4, card.wordsAfterVerdictOnly);
  check('recap arrives on the second tutor turn after the request', card.tutorTurnsAfterRecapRequest === 2, card.tutorTurnsAfterRecapRequest);
  check('reads latency and tokens from brain_turn', card.firstSentenceMsP95 === 2000 && card.inputTokens === 3305 && card.outputTokens === 50, [card.firstSentenceMsP95, card.inputTokens, card.outputTokens]);
  check('counts cuts and narration drops', card.verdictCuts === 1 && card.narrationDrops === 1);
  check('cost per minute', card.costPerMinute === 0.05);
  const avg = averageScorecards([card, { ...card, complaintsTotal: 5 }]);
  check('averages across runs', avg.runs === 2 && avg.complaintsTotal === 4, avg.complaintsTotal);

  console.log('audio student');
  const clips: AudioClip[] = [
    { n: 1, text: 'Yes.', sec: 1, words: 1, wps: 1, check: 'ok' },
    { n: 2, text: 'I am a manager at a communications company.', sec: 5, words: 8, wps: 2, check: 'ok' },
    { n: 3, text: 'I work here for eleven year.', sec: 4, words: 6, wps: 2, check: 'ok' },
    { n: 4, text: 'Okay, please stop. I would like to end the session for now.', sec: 4, words: 12, wps: 3, check: 'ok' },
  ];
  check('short acks are told apart', isShortAck('Yes.') && isShortAck("I'm ready.") && isShortAck('Oh, yes.') && !isShortAck('Yes, I have. I work with companies here.'));
  const pp = buildPickPrompt('Josh', clips, [1, 2], [{ role: 'tutor', text: 'Are you ready?' }, { role: 'student', text: 'Yes.' }], 'How long have you worked here?');
  check('the prompt marks used lines and names the earliest unused', pp.includes('#2 (USED') && pp.includes('#1 (used; a short ack') && pp.includes('the earliest unused is #3'));
  check('a fitting pick is kept', JSON.stringify(parsePick('{"n":3,"fit":"ok","why":"same question"}', clips, [1, 2])) === JSON.stringify({ n: 3, fit: 'ok', why: 'same question' }));
  check('a used long line falls back to the earliest unused, misfit', (() => { const p = parsePick('{"n":2,"fit":"ok"}', clips, [1, 2]); return 'n' in p && p.n === 3 && p.fit === 'misfit'; })());
  check('a used short ack may repeat', (() => { const p = parsePick('{"n":1,"fit":"ok"}', clips, [1, 2]); return 'n' in p && p.n === 1 && p.fit === 'ok'; })());
  check('end is read', 'end' in parsePick('{"end":true,"why":"closed"}', clips, []));
  check('garbage falls back to the earliest unused', (() => { const p = parsePick('hmm', clips, [1]); return 'n' in p && p.n === 2 && p.fit === 'misfit'; })());
  const pk = await pickClip('Josh', clips, [], [], 'Hello, are you ready?', { complete: async () => '{"n":1,"fit":"ok","why":"ready"}' });
  check('pickClip uses the injected model', 'n' in pk && pk.n === 1);
  const none = await pickClip('Josh', clips.slice(1), [2, 3, 4], [], 'Anything else?', { complete: async () => { throw new Error('must not be called'); } });
  check('no lines left ends without a model call', 'end' in none);
  check('silent TTS is zero Float32 sized by words', (() => { const b = silentTtsBody('one two three four five'); return b.length === Math.round(5 * 0.42 * 24000) * 4 && b.every((x) => x === 0); })());
  const dump = parseLiveDump('{"createdAt":"2026-11-09T06:12:49.017Z"}\n=== TRANSCRIPT\n    2s   0 tutor: Hello\n   36s   1 student: Yes.\ncontinued\n=== EVENTS\n  -57s x: y');
  check('reads a live transcript dump', dump.turns.length === 2 && dump.turns[1].t === 36 && dump.turns[1].role === 'student' && dump.turns[1].text === 'Yes. continued');
  check('wav header is 44 bytes and says 24 kHz mono', (() => { const w = wav(Buffer.alloc(480)); return w.length === 524 && w.readUInt32LE(24) === 24000 && w.readUInt16LE(22) === 1; })());

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main();
