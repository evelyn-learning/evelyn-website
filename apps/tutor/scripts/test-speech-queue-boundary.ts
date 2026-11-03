/**
 * Task 17 (GDI live, embed-1793326847152 02:35:44): a repeat_after_correct /
 * required_phrase_missing kill lets the sentence in flight finish instead of
 * cutting it mid-word — speech-queue-boundary.ts + static pins on the hook
 * and the orchestrator.
 *
 * Run: npx tsx scripts/test-speech-queue-boundary.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { emptyTurnFallbackLine, EMPTY_TURN_GENERIC_TYPED, silentTurnFallbackLine, lastShowSentenceOf, SILENT_TURN_STATE_TOOLS, silentTurnFallbackDue } from '../src/lib/tutor/voice/empty-turn-fallback';
import {
  partitionQueueAtSentenceBoundary,
  shouldFinishInFlightSentence,
  resumeTailAfterBoundary,
  SENTENCE_BOUNDARY_KILL_ACTIONS,
  SENTENCE_BOUNDARY_CAP_MS,
  finishesWithinCap,
  createBoundaryDrain,
  shouldSkipRetryAfterKill,
  heardTextThroughKept,
} from '../src/lib/tutor/voice/speech-queue-boundary';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}

const A = 'Thanks for telling us.';
const B = 'Your IT manager checks the servers every day.';
const C = 'Could you say the whole sentence once more?';

console.log('partitionQueueAtSentenceBoundary');
test('three sentences, the middle one in flight: keep its remaining chunks, drop the third', () => {
  // A already played; B is playing with 2 chunks left (one may still be a
  // streamed tail); C is queued with 2 chunks.
  const p = partitionQueueAtSentenceBoundary(
    { sentences: [B, B, C, C], scriptIds: [2, 2, 3, 3] },
    { sentence: B, scriptId: 2 },
  );
  assert.equal(p.keepCount, 2);
  assert.deepEqual(p.droppedScriptIds, [3]);
});
test('only the in-flight sentence queued: keep everything, drop nothing', () => {
  const p = partitionQueueAtSentenceBoundary({ sentences: [B, B, B], scriptIds: [2, 2, 2] }, { sentence: B, scriptId: 2 });
  assert.equal(p.keepCount, 3);
  assert.deepEqual(p.droppedScriptIds, []);
});
test('empty queue (last chunk playing / tail still arriving): keep 0', () => {
  const p = partitionQueueAtSentenceBoundary({ sentences: [], scriptIds: [] }, { sentence: B, scriptId: 2 });
  assert.equal(p.keepCount, 0);
});
test('a later repeat of the same text is a different utterance: only the head run is kept', () => {
  const p = partitionQueueAtSentenceBoundary(
    { sentences: [B, C, B], scriptIds: [2, 3, 4] },
    { sentence: B, scriptId: 2 },
  );
  assert.equal(p.keepCount, 1);
  assert.deepEqual(p.droppedScriptIds, [3, 4]);
});
test('same text under a different scriptId is not the current sentence', () => {
  const p = partitionQueueAtSentenceBoundary({ sentences: [B], scriptIds: [9] }, { sentence: B, scriptId: 2 });
  assert.equal(p.keepCount, 0);
  assert.deepEqual(p.droppedScriptIds, [9]);
});
test('unlabelled scriptIds (kill bridge / greeting) match undefined and stamp nothing', () => {
  const p = partitionQueueAtSentenceBoundary(
    { sentences: [A, A, C], scriptIds: [undefined, undefined, undefined] },
    { sentence: A, scriptId: undefined },
  );
  assert.equal(p.keepCount, 2);
  assert.deepEqual(p.droppedScriptIds, []);
});

console.log('shouldFinishInFlightSentence');
test('exactly the two actions whose offending sentence is never the first', () => {
  assert.deepEqual([...SENTENCE_BOUNDARY_KILL_ACTIONS].sort(), ['repeat_after_correct', 'repeat_ask_third_version', 'required_phrase_missing']);
  assert.equal(shouldFinishInFlightSentence('repeat_after_correct', 1), true);
  assert.equal(shouldFinishInFlightSentence('required_phrase_missing', 3), true);
});
test('other actions, nothing heard, or the flag off ⇒ hard clear', () => {
  for (const a of ['judge_ungrounded', 'show_segment_card_narration_mismatch', 'dev_forced_kill', undefined]) {
    assert.equal(shouldFinishInFlightSentence(a, 3), false, String(a));
  }
  assert.equal(shouldFinishInFlightSentence('repeat_after_correct', 0), false);
  assert.equal(shouldFinishInFlightSentence('repeat_after_correct', 2, false), false);
});

console.log('resumeTailAfterBoundary');
test('the live shape: [in-flight, re-ask] ⇒ resume only the re-ask', () => {
  assert.deepEqual(resumeTailAfterBoundary([B, C], B), [C]);
});
test('in-flight only ⇒ nothing to resume', () => {
  assert.deepEqual(resumeTailAfterBoundary([B], B), []);
});
test('first entry not the kept sentence ⇒ tail unchanged', () => {
  assert.deepEqual(resumeTailAfterBoundary([C], B), [C]);
  assert.deepEqual(resumeTailAfterBoundary([B, C], null), [B, C]);
});
test('cap is 4000 ms', () => assert.equal(SENTENCE_BOUNDARY_CAP_MS, 4000));

console.log('finishesWithinCap / shouldSkipRetryAfterKill');
test('known remainder: within the cap waits, beyond it hard-clears; a live tail always waits', () => {
  assert.equal(finishesWithinCap(3.9, false), true);
  assert.equal(finishesWithinCap(4.0, false), true);
  assert.equal(finishesWithinCap(4.1, false), false);
  assert.equal(finishesWithinCap(9, true), true);
});
test('skip reasons; none ⇒ retry', () => {
  const base = { preempted: false, aborted: false, ending: false, sealed: false };
  assert.equal(shouldSkipRetryAfterKill(base), null);
  assert.equal(shouldSkipRetryAfterKill({ ...base, preempted: true }), 'preempted');
  assert.equal(shouldSkipRetryAfterKill({ ...base, aborted: true }), 'aborted');
  assert.equal(shouldSkipRetryAfterKill({ ...base, ending: true, preempted: true }), 'ending');
  assert.equal(shouldSkipRetryAfterKill({ ...base, sealed: true, aborted: true }), 'sealed');
});

console.log('heardTextThroughKept');
test('heard = dispatched up to and including the kept sentence', () => {
  assert.equal(heardTextThroughKept([A, B, C], B), `${A} ${B}`);
  assert.equal(heardTextThroughKept([B], B), B);
  assert.equal(heardTextThroughKept([A, C], B), B);
});

console.log('static pins');
const root = join(__dirname, '..');
const hook = readFileSync(join(root, 'src/app/tutor/hooks/useOpenAIRealtime.ts'), 'utf8');
const gemini = readFileSync(join(root, 'src/app/tutor/hooks/useGeminiLive.ts'), 'utf8');
const vtr = readFileSync(join(root, 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
const flags = readFileSync(join(root, 'src/lib/tutor/orchestrator/flags.ts'), 'utf8');
test('hook: clearSpeechQueue accepts { afterCurrentSentence } and falls back to the hard clear', () => {
  assert.match(hook, /clearSpeechQueue: \(opts\?: ClearSpeechQueueOptions\) => Promise<ClearSpeechQueueResult \| void>;/);
  assert.match(hook, /const clearSpeechQueue = useCallback\(\(opts\?: ClearSpeechQueueOptions\)/);
  assert.match(hook, /!opts\?\.afterCurrentSentence \|\|[\s\S]{0,700}return clearSpeechQueueHard\(\);/);
  assert.match(hook, /partitionQueueAtSentenceBoundary\(/);
  assert.match(hook, /createBoundaryDrain\(\{\s*capMs: SENTENCE_BOUNDARY_CAP_MS,\s*onCap: \(\) => \{[\s\S]{0,300}return clearSpeechQueueHard\(\);/);
});
test('hook: the sentence end settles the wait before the next-sentence advance', () => {
  const i = hook.indexOf('boundary.ended();');
  const j = hook.indexOf('speakTextQueueRef.current.length > 0\n      ) {');
  const hold = hook.indexOf('if (pendingTailRef.current && pendingTailRef.current.epoch === speakEpochRef.current) {');
  assert.ok(hold > 0 && i > hold && j > i, `hold=${hold} ended=${i} advance=${j}`);
});
test('hook: a hard clear settles a pending boundary wait', () => {
  assert.match(hook, /const clearSpeechQueueHard = useCallback\(\(\): Promise<void> => \{[\s\S]{0,300}preemptBoundaryDrain\(\);/);
});
test('gemini: accepts the option and ignores it', () => {
  assert.match(gemini, /clearSpeechQueue: \(_opts\?: \{ afterCurrentSentence\?: boolean \}\): Promise<void> =>/);
});
test('orchestrator: the option is passed only behind shouldFinishInFlightSentence(last rejection action)', () => {
  const uses = vtr.match(/afterCurrentSentence: true/g) ?? [];
  assert.equal(uses.length, 1);
  assert.match(vtr, /const killAction = rejectionsThisAttempt\[rejectionsThisAttempt\.length - 1\]\?\.action;\s*if \(shouldFinishInFlightSentence\(killAction, audibleSentenceCount, TUTOR_KILL_SENTENCE_BOUNDARY\)\) \{[\s\S]{0,200}await clearSpeechQueueRef\.current\?\.\(\{ afterCurrentSentence: true \}\)/);
  assert.match(vtr, /judge_kill_sentence_boundary', `waited=\$\{res\.waitedMs\}/);
  assert.match(vtr, /· finishing in-flight sentence`/);
  assert.match(vtr, /resumeTailAfterBoundary\(tail, res\.keptSentence\)/);
});
test('orchestrator: both kill sites push their action immediately before performKill', () => {
  assert.match(vtr, /rejectionsThisAttempt\.push\(\{ action: 'required_phrase_missing', reason \}\);\s*await performKill\(\);/);
  assert.match(vtr, /rejectionsThisAttempt\.push\(\{ action: 'repeat_after_correct', reason: REPEAT_AFTER_CORRECT_REASON \}\);\s*await performKill\(\);/);
});
test('fix round 1 (I2): the silent provider (text-only sessions) takes the hard clear', () => {
  assert.match(hook, /!opts\?\.afterCurrentSentence \|\|[\s\S]{0,600}ttsProviderRef\.current === 'silent' \|\|[\s\S]{0,120}return clearSpeechQueueHard\(\);/);
});
test('fix round 1 (m3): a remainder longer than the cap takes the hard clear at once', () => {
  assert.match(hook, /if \(!finishesWithinCap\(remainingSec, tailLive\)\) \{\s*return clearSpeechQueueHard\(\);/);
});
test('fix round 1 (m1): interrupt, pause, disconnect and reconnect preempt a pending wait', () => {
  assert.ok((hook.match(/preemptBoundaryDrain\(\); \/\/ Task 17 fix round 1 \(m1\)/g) ?? []).length >= 4);
  assert.match(hook, /const interrupt = useCallback\(\(\) => \{\s*preemptBoundaryDrain\(\);/);
});
test('fix round 1 (I1): a preempted / aborted / ending / sealed wait skips the retry', () => {
  assert.match(vtr, /shouldSkipRetryAfterKill\(\{\s*preempted: res\.preempted,\s*aborted: brainAbort\.signal\.aborted,\s*ending: endingRef\.current,\s*sealed: farewellSealedRef\.current,\s*\}\)/);
  assert.match(vtr, /'judge_kill_retry_skipped', `reason=\$\{skipReason\}`/);
  const brk = vtr.indexOf('if (retrySkippedAfterKill && rejectionsThisAttempt.length > 0) {');
  const done = vtr.indexOf("// No rejections OR we've burned the retry budget");
  const retry = vtr.indexOf("'brain_validator_retry',");
  assert.ok(brk > 0 && brk < done && done < retry, `break=${brk} done=${done} retry=${retry}`);
});
test('fix round 2 (N1): no empty-turn fallback after a skipped retry; heard text kept as the turn text', () => {
  assert.match(vtr, /if \(!fullText\.trim\(\) && totalToolNamesSeen\.length === 0 && !retrySkippedAfterKill\) \{/);
  // The guarded block holds both the spoken and the chat-only fallback (and brain-unavailable).
  const g = vtr.indexOf('&& !retrySkippedAfterKill) {');
  const spoken = vtr.indexOf("speakTextRef.current?.('Sorry, could you say that again?');");
  const chat = vtr.indexOf("Hmm, I didn't come up with anything for that");
  assert.ok(g > 0 && spoken > g && chat > g && spoken - g < 6000, `guard=${g} spoken=${spoken} chat=${chat}`);
  assert.match(vtr, /if \(res\.outcome === 'ended'\) \{\s*retrySkippedHeardText = heardTextThroughKept\(\s*turnNarrationRef\.current\.slice\(attemptNarrationStart\),\s*res\.keptSentence,/);
  assert.match(vtr, /if \(retrySkippedAfterKill && rejectionsThisAttempt\.length > 0\) \{\s*if \(retrySkippedHeardText\) \{\s*aggregatedFullText = /);
});
test('Task 38 §A: a turn with a card but zero spoken sentences speaks (card as the model, else the re-ask)', () => {
  const card = 'I went to the robotics exhibition in Tokyo last year.';
  const calls = [{ name: 'show_sentence', args: { sentence: card, emphasis: ['went'] } }];
  assert.equal(lastShowSentenceOf(calls), card);
  assert.equal(lastShowSentenceOf([{ name: 'handwrite', args: { text: 'x' } }]), null);
  assert.deepEqual(silentTurnFallbackLine({ cardSentence: card, pinGist: 'Can you say that once more?', languageLesson: true, bilingual: true }), { kind: 'card', text: `Here's the natural version: ${card} Please say it once more.` });
  assert.deepEqual(silentTurnFallbackLine({ cardSentence: 'I went there', pinGist: null, languageLesson: true, bilingual: false })?.text, "Here's the natural version: I went there. Please say it once more.");
  assert.deepEqual(silentTurnFallbackLine({ cardSentence: null, pinGist: 'Which exhibition did you go to?', languageLesson: true, bilingual: false }), { kind: 'reask', text: 'Let me ask that again: Which exhibition did you go to?' });
  assert.equal(silentTurnFallbackLine({ cardSentence: null, pinGist: '', languageLesson: true, bilingual: false }), null, 'nothing to say ⇒ null');
  assert.equal(silentTurnFallbackLine({ cardSentence: card, pinGist: 'x?', languageLesson: false, bilingual: false }), null, 'maths ⇒ off');
  assert.ok(SILENT_TURN_STATE_TOOLS.has('advance_lesson') && !SILENT_TURN_STATE_TOOLS.has('show_sentence'));
  assert.ok(vtr.includes("TUTOR_SILENT_TURN_FALLBACK && silentTurnFallbackDue({"));
  assert.ok(vtr.includes('cardSentence: lastShowSentenceOf(turnToolCallsSeen),'));
  assert.ok(vtr.includes("onDebugEvent?.('silent_turn_fallback',"));
  assert.match(flags, /export const TUTOR_SILENT_TURN_FALLBACK = process\.env\.NEXT_PUBLIC_TUTOR_SILENT_TURN_FALLBACK !== 'off';/);
});
test('Task 38 r1 I-2: the silent-turn fallback — language lessons only; never on a silent-by-purpose tool, a runtime turn or an armed clip', () => {
  const base = { languageLesson: true, transcript: 'I have been to the robotics exhibition in Tokyo last year.', keptText: '', toolsSeen: ['show_sentence'], retrySkipped: false, pronunciationArmed: false };
  assert.equal(silentTurnFallbackDue(base), true, 'GDI all-dropped text turn with a card → fallback');
  assert.equal(silentTurnFallbackDue({ ...base, languageLesson: false, toolsSeen: ['show_function_graph'] }), false, 'maths (bilingual or not) tool-only turn → none');
  for (const t of ['request_pronunciation_check', 'set_working_level', 'resume_lesson', 'advance_lesson'])
    assert.equal(silentTurnFallbackDue({ ...base, toolsSeen: ['show_sentence', t] }), false, t);
  assert.equal(silentTurnFallbackDue({ ...base, transcript: '[runtime note] continue' }), false, 'a runtime turn');
  assert.equal(silentTurnFallbackDue({ ...base, pronunciationArmed: true }), false, 'a clip armed');
  assert.equal(silentTurnFallbackDue({ ...base, keptText: 'Close.' }), false, 'something was said');
  // m-2: a card of the student's own sentence is no "natural version"
  const own = 'I went to the robotics exhibition last year.';
  assert.deepEqual(silentTurnFallbackLine({ cardSentence: own, pinGist: 'Which exhibition did you go to?', languageLesson: true, bilingual: false, studentText: 'I went to the robotics exhibition last year' }), { kind: 'reask', text: 'Let me ask that again: Which exhibition did you go to?' });
  assert.ok(vtr.includes("languageLesson: subject === 'languages' || isFixedScriptPlan(lessonPlanRef.current),\n          transcript, keptText: fullText, toolsSeen: totalToolNamesSeen, retrySkipped: !!retrySkippedAfterKill,"));
  assert.ok(vtr.includes("bilingual: sessionAllowsNonLatin(tutorLanguages) && (tutorLanguages ?? [])[0] !== 'en',"));
});
test('Task 30 fix round 8 A4: an empty turn re-asks the pending question in a language / fixed-script lesson', () => {
  const ask = 'Have you worked for your current company for a long time?';
  assert.deepEqual(emptyTurnFallbackLine({ pinGist: ask, languageLesson: true, bilingual: false }), { kind: 'reask', text: `Let me ask that again: ${ask}` });
  assert.deepEqual(emptyTurnFallbackLine({ pinGist: ask, languageLesson: true, bilingual: true }), { kind: 'reask', text: `もう一度聞きますね。 ${ask}` });
  assert.deepEqual(emptyTurnFallbackLine({ pinGist: '', languageLesson: true, bilingual: true }), { kind: 'generic', text: EMPTY_TURN_GENERIC_TYPED }, 'no pending ask ⇒ generic');
  assert.deepEqual(emptyTurnFallbackLine({ pinGist: ask, languageLesson: false, bilingual: false }), { kind: 'generic', text: EMPTY_TURN_GENERIC_TYPED }, 'other lessons ⇒ generic');
  assert.equal(EMPTY_TURN_GENERIC_TYPED, "Hmm, I didn't come up with anything for that — mind rephrasing?");
  assert.ok(vtr.includes('if (TUTOR_EMPTY_TURN_REASK && efFallback.kind === \'reask\') {'));
  assert.ok(vtr.includes('pinGist: turnAskGist(efPrevTutor),'));
  assert.match(flags, /export const TUTOR_EMPTY_TURN_REASK = process\.env\.NEXT_PUBLIC_TUTOR_EMPTY_TURN_REASK !== 'off';/);
});
test('flag declared, default ON', () => {
  assert.match(flags, /export const TUTOR_KILL_SENTENCE_BOUNDARY = process\.env\.NEXT_PUBLIC_TUTOR_KILL_SENTENCE_BOUNDARY !== 'off';/);
});

// createBoundaryDrain with a fake clock + timers (review m6).
async function drainCases() {
  console.log('createBoundaryDrain');
  const mk = () => {
    let t = 0;
    const timers: Array<{ fn: () => void; at: number; live: boolean }> = [];
    let caps = 0;
    const drain = createBoundaryDrain({
      capMs: 4000,
      onCap: () => { caps++; },
      now: () => t,
      setTimer: (fn, ms) => { const h = { fn, at: t + ms, live: true }; timers.push(h); return h; },
      clearTimer: (h) => { (h as { live: boolean }).live = false; },
    });
    const advance = (ms: number) => { t += ms; for (const h of timers) if (h.live && h.at <= t) { h.live = false; h.fn(); } };
    return { drain, advance, caps: () => caps };
  };
  const flush = () => new Promise((r) => setTimeout(r, 0));
  const cases: Array<[string, () => Promise<void>]> = [
    ['ended at 1.2 s ⇒ ended, waited 1200; a late cap does nothing', async () => {
      const m = mk(); m.advance(1200); m.drain.ended(); m.advance(5000); await flush();
      assert.deepEqual(await m.drain.promise, { outcome: 'ended', waitedMs: 1200 });
      assert.equal(m.caps(), 0);
    }],
    ['preempted then cap ⇒ preempted, no hard drain from the cap', async () => {
      const m = mk(); m.advance(500); m.drain.preempted(); m.advance(5000); await flush();
      assert.deepEqual(await m.drain.promise, { outcome: 'preempted', waitedMs: 500 });
      assert.equal(m.caps(), 0);
    }],
    ['cap ⇒ hard drain once, capped; ended / preempted during the drain are ignored', async () => {
      const m = mk(); m.advance(4000); m.drain.preempted(); m.drain.ended(); await flush();
      const r = await m.drain.promise;
      assert.equal(r.outcome, 'capped');
      assert.equal(m.caps(), 1);
    }],
    ['double ended resolves once', async () => {
      const m = mk(); m.drain.ended(); m.advance(10); m.drain.ended();
      assert.equal((await m.drain.promise).outcome, 'ended');
    }],
  ];
  for (const [name, fn] of cases) {
    try { await fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
  }
}

void drainCases().then(() => {
  if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
  console.log('\nall passed');
});
