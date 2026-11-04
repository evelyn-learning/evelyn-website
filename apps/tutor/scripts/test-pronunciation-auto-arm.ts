/**
 * Task 14 §F — pronunciation auto-arm detector (pronunciation/auto-arm.ts).
 * Run: npx tsx scripts/test-pronunciation-auto-arm.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { detectPronunciationTarget, autoArmTargetForTurn, pronunciationTargetsOf, syllablePatternFor, shouldRearmPronunciation, notAttemptedDetail, measuredPronunciationRedelivery, isStudentQuestion, voiceVerdictHoldStandsDown, pronunciationNoteForRetry, PRONUNCIATION_RETRY_INSTRUCTION, pronunciationNoteForTurn, PRONUNCIATION_UNSCORED_NOTE, colonTarget, handwriteShownSentence, looksLikeModelSentence } from '../src/lib/tutor/pronunciation/auto-arm';
import { duplicateSentenceAction, currentBoardPage, sentenceCardIdOnCurrentPage, sentenceOnBoardPage } from '../src/lib/tutor/voice/sentence-board';
import { isRetryAsk } from '../src/lib/tutor/voice/retry-cap';
import { isStrictRepeatAsk, saidModelSentence } from '../src/lib/tutor/voice/correct-retry';
import { pronunciationItemRepeat as pronunciationItemRepeat45 } from '../src/lib/tutor/pronunciation/auto-arm';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}
const T = pronunciationTargetsOf({ pronunciation: {
  words: ['responsibilities', 'international', 'communicate', 'customers', 'developed'],
  sentences: ['I have worked with international customers for several years.', 'I was responsible for communicating with our customers.'],
} })!;

test('live run 4: "responsibilities." quoted ⇒ armed with "responsibilities", gloss re-spon-si-BIL-i-ties', () => {
  const turn = 'Here\'s the first word: "responsibilities." Please listen and repeat it after me. The main stress is on the fourth syllable: re-spon-si-BIL-i-ties.';
  assert.deepEqual(detectPronunciationTarget(turn, T), { referenceText: 'responsibilities', kind: 'word', gloss: 're-spon-si-BIL-i-ties' });
});
test('a listed sentence quoted (curly / 「」) ⇒ that sentence, kind sentence, no gloss', () => {
  assert.deepEqual(
    detectPronunciationTarget('Now the sentence: “I have worked with international customers for several years.” Try it.', T),
    { referenceText: 'I have worked with international customers for several years.', kind: 'sentence' },
  );
  assert.equal(detectPronunciationTarget('「I was responsible for communicating with our customers.」 どうぞ。', T)?.kind, 'sentence');
});
test('an unlisted quote with a say/repeat ask at the end ⇒ that quote', () => {
  assert.deepEqual(detectPronunciationTarget('Good. Now say "project manager" for me.', T), { referenceText: 'project manager', kind: 'sentence' });
  assert.deepEqual(detectPronunciationTarget('Listen: "schedule." Repeat after me.', T), { referenceText: 'schedule', kind: 'word' });
});
test('no quote, or a quote without an ask and not listed ⇒ null', () => {
  assert.equal(detectPronunciationTarget('Let\'s practise some words now. Are you ready?', T), null);
  assert.equal(detectPronunciationTarget('You said "I sell machines" earlier, nice. What else do you do?', T), null);
});
test('syllable pattern must spell the word; 2-part compounds are not syllable patterns', () => {
  assert.equal(syllablePatternFor('in-ter-NA-tion-al is the stress', 'international'), 'in-ter-NA-tion-al');
  assert.equal(syllablePatternFor('com-MU-ni-cate', 'international'), undefined);
  assert.equal(syllablePatternFor('front-load', 'frontload'), undefined);
});
test('targets: none without metadata.pronunciation', () => {
  assert.equal(pronunciationTargetsOf({}), null);
  assert.equal(pronunciationTargetsOf(undefined), null);
  assert.equal(pronunciationTargetsOf({ pronunciation: { words: [] } }), null);
});
test('VTR wiring: pronunciation active, segment targets, brain tool wins, once per turn, same arm path, card with gloss', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(/if \(pronunciationActive && !opts\?\.prefetchOnly && !totalToolNamesSeen\.includes\('request_pronunciation_check'\)\)/.test(VTR), 'gate');
  assert.ok(/armPronunciationCheckRef\.current\(auto\.referenceText, auto\.kind\);/.test(VTR), 'same arm path as the tool');
  assert.ok(VTR.includes("onDebugEvent?.('pronunciation_auto_armed', `\"${auto.referenceText}\"`);"), 'debug');
  assert.ok(/action: 'showSentence',\s*sentence: auto\.referenceText,\s*\.\.\.\(auto\.gloss \? \{ gloss: auto\.gloss \} : \{\}\),/.test(VTR), 'card');
  // before the sentence board, so the card (with its gloss) is the one that stays
  assert.ok(VTR.indexOf("'pronunciation_auto_armed'") < VTR.indexOf('const cards = planSentenceBoard({'));
});

// ── Task 18 §C: re-arm on a repeat-ask, and say what the vendor heard ──
test('rearm: the live case — no quote, same part, say-it ask ⇒ re-arm the last target', () => {
  const ask = "Please say the sentence once more, and I'll check the words.";
  const last = { referenceText: 'I was responsible for communicating with our customers.', kind: 'sentence', segId: 'pronunciation' };
  const targets = { words: ['responsibilities'], sentences: [last.referenceText] };
  const detected = detectPronunciationTarget(ask, targets);
  assert.equal(detected, null);
  const isRepeatAsk = isStrictRepeatAsk(ask);
  assert.equal(isRepeatAsk, true);
  const base = { last, detected, toolCalled: false, isRepeatAsk, segId: 'pronunciation' };
  assert.equal(shouldRearmPronunciation(base), true);
  assert.equal(shouldRearmPronunciation({ ...base, detected: { referenceText: 'responsibilities', kind: 'word' } }), false, 'a detected target wins');
  assert.equal(shouldRearmPronunciation({ ...base, segId: 'summary' }), false, 'different segment');
  assert.equal(shouldRearmPronunciation({ ...base, isRepeatAsk: false }), false, 'not a repeat-ask');
  assert.equal(shouldRearmPronunciation({ ...base, toolCalled: true }), false, 'the brain called the tool');
  assert.equal(shouldRearmPronunciation({ ...base, last: null }), false, 'nothing armed yet');
});
test('not_attempted detail: recognised words and omitted count', () => {
  const r = { words: [
    { word: 'I', errorType: 'none' }, { word: 'was', errorType: 'omission' }, { word: 'responsible', errorType: 'mispronunciation' },
    { word: 'for', errorType: 'omission' }, { word: 'uh', errorType: 'insertion' },
  ] };
  assert.equal(notAttemptedDetail(r), 'recognized="I responsible uh" omitted=2/4');
  assert.equal(notAttemptedDetail(null), 'recognized="" omitted=0/0');
});
test('VTR wiring (§C): last target kept at every arm, re-arm branch, not_attempted carries the detail', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(/capture\.arm\(referenceText\);[\s\S]{0,200}lastPronunciationTargetRef\.current = \{ referenceText, kind, segId: currentSegmentIdRef\.current \?\? '' \};/.test(VTR), 'set at the arm');
  assert.ok(/\} else if \(shouldRearmPronunciation\(\{\n\s*last: lastPronunciationTargetRef\.current,\n\s*detected: auto,/.test(VTR), 're-arm branch');
  assert.ok(/isRepeatAsk: isStrictRepeatAsk\(fullText\),/.test(VTR), 'repeat-ask');
  // review m5: a bare "say it" that is not an ask does not re-arm
  assert.equal(isStrictRepeatAsk('You can say it naturally now.'), false);
  assert.ok(VTR.includes("onDebugEvent?.('pronunciation_rearmed',"), 'event');
  assert.ok(VTR.includes("onDebugEvent?.('pronunciation_unavailable', `not_attempted ${notAttemptedDetail(data.result)}`)"), 'detail');
});

// ── Task 20 §F (GDI run 8, 1395–1418 s) ──────────────────────────────────
const TARGET_A = 'I have worked with international customers for several years.';
const LAST = { note: 'Measured pronunciation of "I have worked with international customers for several years.": overall 80/100. Weakest: "for" 45.', at: 1, segmentId: 'pronunciation', referenceText: TARGET_A };
const base = { last: LAST, segmentId: 'pronunciation', inPronunciationSegment: true, studentText: 'Um, can you repeat where I was wrong?', notAttempted: true, measuredThisTurn: false, currentTarget: TARGET_A };
test('20F2: "can you repeat where I was wrong?" after a not-attempted clip gets the last measurement', () => {
  const out = measuredPronunciationRedelivery(base);
  assert.equal(out, `[pronunciation check result — not from the student] Last measurement for "${TARGET_A}" (still the current target): ${LAST.note}`);
});
test('20F2: a question alone (clip measured nothing new, not not_attempted) re-delivers', () => {
  assert.ok(measuredPronunciationRedelivery({ ...base, notAttempted: false }));
  assert.ok(measuredPronunciationRedelivery({ ...base, notAttempted: false, studentText: 'Which word was wrong' }));
});
test('20F2: no trigger / other segment / a fresh measurement / outside the part ⇒ null', () => {
  assert.equal(measuredPronunciationRedelivery({ ...base, notAttempted: false, studentText: 'I have worked with international customers.' }), null);
  assert.equal(measuredPronunciationRedelivery({ ...base, segmentId: 'summary' }), null);
  assert.equal(measuredPronunciationRedelivery({ ...base, measuredThisTurn: true }), null);
  assert.equal(measuredPronunciationRedelivery({ ...base, inPronunciationSegment: false }), null);
  assert.equal(measuredPronunciationRedelivery({ ...base, last: null }), null);
  assert.equal(measuredPronunciationRedelivery({ ...base, studentText: '[runtime note — not from the student] …' }), null);
});
test('20F2 fix round 1 (m3): re-sent only while the measured sentence is still the target', () => {
  assert.equal(measuredPronunciationRedelivery({ ...base, currentTarget: 'I was responsible for communicating with our customers.' }), null, 'a new target replaces it');
  assert.equal(measuredPronunciationRedelivery({ ...base, currentTarget: null }), null);
  assert.ok(measuredPronunciationRedelivery({ ...base, currentTarget: 'i have worked with international customers for several years' }), 'case / punctuation ignored');
});
test('20F2: question shapes', () => {
  assert.equal(isStudentQuestion('Um, can you repeat where I was wrong?'), true);
  assert.equal(isStudentQuestion('uh what was wrong'), true);
  assert.equal(isStudentQuestion('I was responsible for communicating with our customers.'), false);
});
test('20F: VTR wiring — no correct-retry note on a measured turn; redelivery event', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  const at = VTR.indexOf('// correct-retry.ts: the check said correct; this turn asked for it again.');
  const gate = VTR.indexOf('if (pronunciationMeasuredThisTurn) {', at);
  const plant = VTR.indexOf('reAskedCheckedCorrect(verdictPrecheckRef.current, fullText)', at);
  assert.ok(at > 0 && gate > at && gate < plant, 'the measured gate precedes both correct-retry plants');
  assert.ok(VTR.includes("onDebugEvent?.('pronunciation_note_redelivered'"));
  assert.ok(VTR.includes('if (measured) lastMeasuredPronunciationRef.current = {'));
});

// ── Task 21 §D (GDI run 9, embed-1793389442113) ──
test('21D1: 889 s — the model only in a show_sentence call ⇒ armed from the card (source card)', () => {
  const turn = 'Option two, a complete sentence, it is. Here is the first model. Listen and repeat after me.';
  assert.deepEqual(detectPronunciationTarget(turn, T, { shownSentence: 'I have worked with international customers for several years.' }),
    { referenceText: 'I have worked with international customers for several years.', kind: 'sentence', source: 'card' });
  assert.equal(detectPronunciationTarget(turn, T), null, 'no card, nothing to arm');
  // no listen / repeat ask ⇒ the card is not a target
  assert.equal(detectPronunciationTarget('Here is a sentence from earlier. What does it mean?', T, { shownSentence: 'I sell washing machines.' }), null);
  // a quoted target wins over the card
  assert.equal(detectPronunciationTarget('Please say "I was responsible for communicating with our customers." after me.', T, { shownSentence: 'I sell washing machines.' })?.source, undefined);
});
test('21D2: 910 s — a starter quote is never armed; a short quote only when asked for', () => {
  assert.equal(detectPronunciationTarget('You repeated it clearly. Now, can you tell me one thing you would like to say to a customer next week? Start with "I will..."', T), null);
  assert.equal(detectPronunciationTarget('Say a sentence starting with "I have worked" for me.', T), null, 'starter lead');
  assert.equal(detectPronunciationTarget('Say one sentence about it, "my plan…"', T), null, 'trailing ellipsis');
  assert.equal(detectPronunciationTarget('"Met" is the past form. Say the sentence again.', T), null, 'a 1-word quote with no ask for it');
  // 931 s: the explicit word ask stays a word target
  assert.deepEqual(detectPronunciationTarget('The measured check gave low marks for "will", especially the /l/ sound at the end, so let\'s practice that one word. Please say "will" once more, slowly.', T),
    { referenceText: 'will', kind: 'word' });
  // pre-existing: "say "project manager"" and "Listen: "schedule." Repeat after me." still arm
  assert.deepEqual(detectPronunciationTarget('Good. Now say "project manager" for me.', T), { referenceText: 'project manager', kind: 'sentence' });
  assert.deepEqual(detectPronunciationTarget('Listen: "schedule." Repeat after me.', T), { referenceText: 'schedule', kind: 'word' });
});
test('21D1/D3: VTR wiring — card source, per-turn reset, pronunciation-model cards', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(VTR.includes('detectPronunciationTarget(fullText, pronTargets, { shownSentence: turnShownSentenceRef.current, studentLast: sentenceStressRef.current.studentLast })'));
  assert.ok(VTR.includes("onDebugEvent?.('pronunciation_auto_armed', `\"${auto.referenceText}\" source=card`);"));
  assert.ok(VTR.includes('turnShownSentenceRef.current = null;'));
  assert.ok(VTR.includes('if (!opts?.sentenceBoardAuto) turnShownSentenceRef.current = c.sentence;'));
  assert.ok(VTR.includes('sentenceBoardAuto: true, pronunciationModel: true }'));
  assert.ok(VTR.includes('duplicateSentenceAction({ page, currentPage: dupCurrentPage, pronunciationModel: dupPronModel, onCurrentPage: !!existingId, inThisBatch, advancedThisTurn: dupAdvancedThisTurn, studentCard: dupStudentCard, sameTextOnCurrentPage, existingIsAuto, newBrainCardAddsMarkup, newBrainCardAddsGloss })'));
  assert.ok(VTR.includes("'show_sentence_duplicate_rehighlighted'") && VTR.includes("'show_sentence_duplicate_reshown'"));
  assert.ok(VTR.includes("target: 'item', targetId: existingId, pulse: true"));
  const embed = readFileSync(join(__dirname, '..', 'src/app/tutor-portal/embed/page.tsx'), 'utf8');
  assert.ok(embed.includes("'show_sentence_duplicate_rehighlighted', 'show_sentence_duplicate_reshown'"));
  const canvas = readFileSync(join(__dirname, '..', 'src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx'), 'utf8');
  assert.ok(canvas.includes('(cmd as any).pulse === true'));
});
test('21D3: a duplicate pronunciation model is re-highlighted on this page, re-shown from another, never skipped', () => {
  assert.equal(duplicateSentenceAction({ page: null, currentPage: 9, pronunciationModel: true }), 'draw');
  assert.equal(duplicateSentenceAction({ page: 9, currentPage: 9, pronunciationModel: true, onCurrentPage: true }), 'rehighlight');
  assert.equal(duplicateSentenceAction({ page: 7, currentPage: 9, pronunciationModel: true }), 'reshow');
  assert.equal(duplicateSentenceAction({ page: 7, currentPage: 9, pronunciationModel: false }), 'skip', 'Task 14 §I unchanged elsewhere');
  // run 9 (1014 s): the sentence on page 9 — the current page — is found by id
  const log = [
    { action: 'newPage', title: 'p2' }, { action: 'showSentence', id: 'showSentence-11', sentence: 'I have worked with international customers for several years.' },
  ];
  assert.equal(currentBoardPage(log), 2);
  assert.equal(sentenceOnBoardPage(log, 'I have worked with international customers for several years'), 2);
  assert.equal(sentenceCardIdOnCurrentPage(log, 'I have worked with international customers for several years'), 'showSentence-11');
  assert.equal(sentenceCardIdOnCurrentPage([...log, { action: 'newPage', title: 'p3' }], 'I have worked with international customers for several years'), null);
});

// ── Task 21 fix round 1 (§D) ──
test('21D r1 I3: a card on the CURRENT page ⇒ rehighlight even when the sentence is also on an earlier page', () => {
  const S = 'I have worked with international customers for several years.';
  const log = [
    { action: 'showSentence', id: 'a1', sentence: S }, { action: 'newPage', title: 'p2' }, { action: 'newPage', title: 'p3' },
    { action: 'showSentence', id: 'a2', sentence: S },
  ];
  const page = sentenceOnBoardPage(log, S);
  assert.equal(page, 1);
  assert.equal(currentBoardPage(log), 3);
  const id = sentenceCardIdOnCurrentPage(log, S);
  assert.equal(id, 'a2');
  assert.equal(duplicateSentenceAction({ page, currentPage: 3, pronunciationModel: true, onCurrentPage: !!id }), 'rehighlight');
  // only on page 1 ⇒ reshow
  assert.equal(duplicateSentenceAction({ page: 1, currentPage: 3, pronunciationModel: true, onCurrentPage: false }), 'reshow');
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(VTR.includes('duplicateSentenceAction({ page, currentPage: dupCurrentPage, pronunciationModel: dupPronModel, onCurrentPage: !!existingId, inThisBatch, advancedThisTurn: dupAdvancedThisTurn, studentCard: dupStudentCard, sameTextOnCurrentPage, existingIsAuto, newBrainCardAddsMarkup, newBrainCardAddsGloss })'));
});
test('21D r1 m: a same-batch duplicate is drawn once', () => {
  assert.equal(duplicateSentenceAction({ page: 1, currentPage: 1, pronunciationModel: true, onCurrentPage: false, inThisBatch: true }), 'skip');
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(VTR.includes('const inThisBatch = sentenceOnBoardPage(seenThisBatch, c.sentence) !== null;'));
});
test('21D r1 m (D1): the card fallback never arms a question card or the student\'s own sentence', () => {
  const turn = 'Here is the first model. Listen and repeat after me.';
  assert.equal(detectPronunciationTarget(turn, T, { shownSentence: 'What do you sell at work?' }), null);
  assert.equal(detectPronunciationTarget('Here is what you said. Listen and try again.', T, { shownSentence: 'I sell washing machine in my company.', studentLast: 'Uh, I sell washing machine in my company.' }), null);
  assert.equal(detectPronunciationTarget(turn, T, { shownSentence: 'I sell washing machines in my company.', studentLast: 'I sell washing machine in my company.' })?.source, 'card');
});
test('21D r1 m (D2): a single word with try / repeat / say in its own sentence stays a word target', () => {
  assert.deepEqual(detectPronunciationTarget('Good. Try "customer" again.', T), { referenceText: 'customer', kind: 'word' });
  assert.deepEqual(detectPronunciationTarget('Nice. Repeat after me, "schedule".', T), { referenceText: 'schedule', kind: 'word' });
  assert.equal(detectPronunciationTarget('"Met" is the past form. Say the sentence again.', T), null);
});

// ── Task 21 fix round 2 (§D I4): the verb must govern the short quote ──
test('21D r2 I4: a short quote is a word target only when the verb governs it', () => {
  assert.equal(detectPronunciationTarget('We say "with", not "wiz". Say the sentence again.', T), null);
  assert.equal(detectPronunciationTarget('We say "with", not "wiz". Say "with" again.', T)?.referenceText, 'with', '"wiz" never');
  assert.equal(detectPronunciationTarget('Good. Say the full sentence again, and try "with" carefully.', T), null);
  assert.equal(detectPronunciationTarget('Try to use "will" in your answer. Now say your sentence.', T), null);
  assert.deepEqual(detectPronunciationTarget('Please say "will" once more, slowly.', T), { referenceText: 'will', kind: 'word' });
  assert.deepEqual(detectPronunciationTarget('Nice. Repeat after me, "schedule".', T), { referenceText: 'schedule', kind: 'word' });
  assert.deepEqual(detectPronunciationTarget('Good. Try "customer" again.', T), { referenceText: 'customer', kind: 'word' });
  assert.deepEqual(detectPronunciationTarget('Please say the word "will" once more.', T), { referenceText: 'will', kind: 'word' });
  assert.equal(detectPronunciationTarget('Say it with "rather", not "wather". Try again.', T), null);
});

test('21D r3 I5: only an ASK for the whole sentence blocks a word target — praise of "your sentence" does not', () => {
  assert.deepEqual(detectPronunciationTarget('Your sentence was clear. Now say "schedule" again, slowly.', T), { referenceText: 'schedule', kind: 'word' });
  assert.equal(detectPronunciationTarget('We say "with", not "wiz". Say the sentence again.', T), null);
  assert.equal(detectPronunciationTarget('Good. Say the full sentence again, and try "with" carefully.', T), null);
});

test('21D r4 I6: "say it again" after a single introduced word is a WORD ask, not the whole sentence', () => {
  assert.deepEqual(detectPronunciationTarget('Listen: "schedule." Now say it again.', T), { referenceText: 'schedule', kind: 'word' });
  assert.deepEqual(detectPronunciationTarget('The word is "schedule". Say it again, slowly.', T), { referenceText: 'schedule', kind: 'word' });
  assert.equal(detectPronunciationTarget('We say "with", not "wiz". Say the sentence again.', T), null);
});

// ── Task 23 §G: a measured turn keeps its score through a kill ──
test('23G1: a measured turn stands the voice verdict hold down; an unmeasured one does not', () => {
  assert.equal(voiceVerdictHoldStandsDown(true), true);
  assert.equal(voiceVerdictHoldStandsDown(false), false);
  const v = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(v.includes('const voiceGateSkipMeasured = voiceGateWanted && voiceVerdictHoldStandsDown(pronunciationMeasuredThisTurn);'));
  assert.ok(v.includes("if (voiceGateSkipMeasured) onDebugEvent?.('voice_verdict_hold_skipped', 'measured');"));
  assert.ok(v.includes('enabled: voiceGateWanted && !voiceGateSkipMeasured,'));
});
test('23G2: any retry of a measured turn re-delivers the note with the score instruction', () => {
  const note = '[pronunciation check result — not from the student] Measured pronunciation of "I have worked with international customers for several years.": overall 80/100. Weakest: "for" 45, weakest sound /ɔɹ/ 39; "with" 46.';
  const r = pronunciationNoteForRetry({ measuredThisTurn: true, note, attemptCut: true });
  assert.ok(r && r.startsWith(note) && r.endsWith(PRONUNCIATION_RETRY_INSTRUCTION));
  assert.ok(/overall score/.test(PRONUNCIATION_RETRY_INSTRUCTION) && /weak words and sounds/.test(PRONUNCIATION_RETRY_INSTRUCTION));
  assert.equal(pronunciationNoteForRetry({ measuredThisTurn: false, note, attemptCut: true }), null);
  // fix round 1 (m8): a fully delivered attempt gets the note without the "not spoken" order
  assert.equal(pronunciationNoteForRetry({ measuredThisTurn: true, note, attemptCut: false }), note);
  assert.equal(pronunciationNoteForRetry({ measuredThisTurn: true, note: null, attemptCut: true }), null);
  const v = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  // in the single retry builder every kill goes through (validator / verdict cut / judge)
  const at = v.indexOf("'brain_validator_retry',");
  const block = v.slice(at, at + 4000);
  assert.ok(block.includes('const retryNote = pronunciationNoteForRetry({ measuredThisTurn: pronunciationMeasuredThisTurn, note: pronunciationNoteThisTurn, attemptCut: attemptKilled || voiceVerdictCut !== null });'));
  assert.ok(block.includes("onDebugEvent?.('pronunciation_note_redelivered', `${rejectionsThisAttempt.map((r) => r.action).join(',') || 'retry'}:"));
  assert.ok(v.includes('pronunciationNoteThisTurn = pronunciationResultNoteRef.current;'));
});

test('Task 24 §A4: 1092 s — not attempted, the transcript is the target ⇒ the unscored note', () => {
  const ref = 'I have worked with international customers for several years.';
  const NA = 'The learner did not say the target text; nothing was measured. Ask them to repeat it, or coach from your model.';
  const said = saidModelSentence(ref, 'I have worked with international customers for several years.');
  assert.equal(said, true);
  assert.equal(pronunciationNoteForTurn({ note: NA, measured: false, notAttempted: true, saidTarget: said }), PRONUNCIATION_UNSCORED_NOTE);
  assert.equal(PRONUNCIATION_UNSCORED_NOTE, 'The learner said the sentence (the words matched) but the recording could not be scored this time. Confirm the sentence in one short sentence and ask them to say it once more so you can listen. Do not mention recordings, transcripts, captures, checks or scores.');
  // a silent clip (unavailable note) with the target said ⇒ the same rewrite
  assert.equal(pronunciationNoteForTurn({ note: 'No measured result: coach stress and linking from your model; do not describe sounds.', measured: false, notAttempted: false, saidTarget: true }), PRONUNCIATION_UNSCORED_NOTE);
});
test('Task 24 §A4: a not-attempted clip whose transcript is NOT the target ⇒ the note unchanged; measured ⇒ unchanged', () => {
  const ref = 'I have worked with international customers for several years.';
  const NA = 'The learner did not say the target text; nothing was measured. Ask them to repeat it, or coach from your model.';
  const said = saidModelSentence(ref, 'Um, could you say it again?');
  assert.equal(said, false);
  assert.equal(pronunciationNoteForTurn({ note: NA, measured: false, notAttempted: true, saidTarget: said }), NA);
  assert.equal(pronunciationNoteForTurn({ note: 'Overall 82.', measured: true, notAttempted: false, saidTarget: true }), 'Overall 82.');
  const v = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(v.includes('saidTarget: !!raw.referenceText && saidModelSentence(raw.referenceText, transcript),'));
  assert.ok(v.includes("onDebugEvent?.('pronunciation_note_rewritten', 'unscored');"));
});

test('25D1 (GDI run 13, 1026–1044 s): on the turn that opens a part, the student\'s card stays on the part it answered', () => {
  assert.equal(duplicateSentenceAction({ page: 7, currentPage: 8, pronunciationModel: true, advancedThisTurn: true, studentCard: true }), 'skip');
  assert.equal(duplicateSentenceAction({ page: 7, currentPage: 8, pronunciationModel: true, advancedThisTurn: true, studentCard: false }), 'reshow', 'a listed target re-shown on the part page');
  assert.equal(duplicateSentenceAction({ page: 7, currentPage: 8, pronunciationModel: true, advancedThisTurn: false, studentCard: true }), 'reshow', 'unchanged');
  assert.equal(duplicateSentenceAction({ page: null, currentPage: 8, pronunciationModel: true, advancedThisTurn: true, studentCard: true }), 'draw', 'not a duplicate ⇒ drawn');
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(VTR.includes('const dupAdvancedThisTurn = dupPageOpening || segmentPageFlushedTurnRef.current === pageTurnRef.current;'));
  assert.ok(VTR.includes("'show_sentence_duplicate_skipped', `student card stays on the part it answered"));
  assert.ok(VTR.includes('segmentPageFlushedTurnRef.current = pageTurnRef.current;'));
});
test('25D2: no automatic arm on the turn that enters the part', () => {
  const t = { referenceText: 'I thought of other animals that I like', kind: 'sentence' as const, source: 'card' as const };
  assert.equal(autoArmTargetForTurn(t, { partEntry: true }), null);
  assert.equal(autoArmTargetForTurn(t, { partEntry: false }), t);
  assert.equal(autoArmTargetForTurn(null, { partEntry: false }), null);
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(VTR.includes('const auto = autoArmTargetForTurn(detectedAuto, { partEntry: pronPartEntry, menuPending: pronMenuPending });'), 'Task 42 §D adds menuPending');
  assert.ok(VTR.includes("onDebugEvent?.('pronunciation_auto_arm_skipped', `part entry:"));
});

// ── Task 31 §C (GDI run 18, 1203–1264 s): a measured word is a mention; the colon-led sentence is the ask ──
const T31 = { words: ['responsibilities', 'international', 'communicate', 'customers', 'developed'], sentences: ['I have worked with international customers for several years.', 'I was responsible for communicating with our customers.'] };
const S31 = 'I have worked with international customers for several years.';
test('31C: turn 100 → the sentence, not the measured word', () => {
  const t = 'Your pronunciation of "responsibilities" scored 90 out of 100, which is excellent. 全体の発音はとても良いです。 Next, let\'s try one sentence: I have worked with international customers for several years. Please listen, then repeat after me.';
  assert.deepEqual(detectPronunciationTarget(t, T31), { referenceText: S31, kind: 'sentence' });
});
test('31C: turn 102 → the sentence', () => {
  const t = 'I\'ll go with the measured result for "responsibilities": 90 out of 100 is excellent. Your sentence didn\'t come through, so please repeat it: I have worked with international customers for several years.';
  assert.deepEqual(detectPronunciationTarget(t, T31), { referenceText: S31, kind: 'sentence' });
});
test('31C: a quoted word ask is unchanged; a mention with no ask is not skipped into a target', () => {
  assert.equal(detectPronunciationTarget('Listen, then repeat after me: "responsibilities".', T31)?.referenceText, 'responsibilities');
  assert.equal(detectPronunciationTarget('Please say "international" once more.', T31)?.referenceText, 'international');
  assert.equal(colonTarget("Here's the question on the board: did you attend any events?"), null, 'a question is never a target');
  assert.equal(colonTarget('Next, the sentence: I went to Tokyo last year. Good luck with your email.'), null, 'an introduction without an ask');
});
test('31C3: a handwritten sentence is the shown sentence (VTR)', () => {
  assert.equal(handwriteShownSentence(S31), S31);
  assert.equal(handwriteShownSentence('Did you go there?'), null);
  assert.equal(handwriteShownSentence('have used'), null);
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(VTR.includes("const hwSentence = hw.action === 'handwrite' ? handwriteShownSentence(hw.text) : null;"));
  assert.ok(VTR.includes('if (hwSentence) turnShownSentenceRef.current = hwSentence;'));
});

test('31D: "Please listen, then repeat after me: responsibilities. Responsibilities." arms the word', () => {
  assert.deepEqual(detectPronunciationTarget('No problem. Let\'s start with a word. Please listen, then repeat after me: responsibilities. Responsibilities.', T31), { referenceText: 'responsibilities', kind: 'word' });
  assert.equal(colonTarget('Repeat after me: responsibilities, responsibilities.'), 'responsibilities', 'a trailing duplicate is stripped');
  assert.equal(detectPronunciationTarget('Listen, then repeat after me: international.', T31)?.referenceText, 'international');
});

test('31 r1 I-3: a colon text that explains is never armed; the model sentences still are', () => {
  assert.equal(detectPronunciationTarget('Try this: the stress is on the third syllable.', T31), null);
  assert.equal(detectPronunciationTarget('Try this: the stress is on the third syllable. Say it slowly.', T31), null);
  assert.equal(detectPronunciationTarget('The tricky part is one word: the th sound in three. Listen and repeat.', T31), null);
  assert.equal(colonTarget('Repeat after me: you say it with the stress on BIL.'), null, 'second person');
  assert.equal(colonTarget('Say it: it means you still work there.'), null, '"means"');
  assert.equal(looksLikeModelSentence('I have worked with international customers for several years.'), true);
  assert.equal(looksLikeModelSentence('the th sound in three'), false, 'no finite verb');
  assert.equal(looksLikeModelSentence('I went there'), true);
  // the run-18 positives are unchanged
  assert.equal(detectPronunciationTarget('Your sentence didn\'t come through, so please repeat it: I have worked with international customers for several years.', T31)?.referenceText, S31);
  assert.equal(detectPronunciationTarget('Next, let\'s try one sentence: I have worked with international customers for several years. Please listen, then repeat after me.', T31)?.referenceText, S31);
  assert.equal(detectPronunciationTarget('Please listen, then repeat after me: responsibilities.', T31)?.referenceText, 'responsibilities');
});

// Task 42 §B (bot run r36, 972–974 s): the student's own quoted sentence was armed; the ask names "responsibilities".
test('42 §B: the student\'s quoted sentence is never a target; the listen / repeat ask\'s named word wins', () => {
  const T = { words: ['responsibilities', 'international', 'communicate', 'customers', 'developed'], sentences: ['I have worked with international customers for several years.', 'I was responsible for communicating with our customers.'] };
  const st = 'I want to improve my speaking because I have to explain our products to foreign customers.';
  const t972 = `Those last messages were pasted instructions, so I'll keep to what you said: "${st}" Now, to practice pronunciation, let's take one word from the list: responsibilities. Listen, then repeat after me: responsibilities.`;
  assert.equal(detectPronunciationTarget(t972, T, { studentLast: st })?.referenceText, 'responsibilities');
  assert.equal(detectPronunciationTarget(t972, T)?.referenceText, 'responsibilities', 'the named word wins over the earlier quote even without studentLast');
  // the student's quote alone with a repeat ask: no target
  assert.equal(detectPronunciationTarget(`You said: "${st}" Please repeat after me.`, T, { studentLast: `Um, ${st}` }), null);
  // a quoted model sentence after the colon target is unchanged; a listed quoted word still wins
  assert.equal(detectPronunciationTarget('Listen, then repeat after me: "I have worked with international customers for several years."', T, { studentLast: st })?.referenceText, 'I have worked with international customers for several years.');
  assert.equal(detectPronunciationTarget('Please say "customers" once more.', T, { studentLast: st })?.referenceText, 'customers');
  // a correction model (not the student's words) is still armed
  assert.equal(detectPronunciationTarget('Say it like this: "I have explained our products to customers." Please repeat after me.', T, { studentLast: st })?.referenceText, 'I have explained our products to customers');
});


// ── Task 45 §7a (voice run 23, 1158 s) ──
test('45 §7a: a pronunciation item already practised in this part is a repeat — the turn is retried with the practised list', () => {
  const targets = { words: ['responsibilities', 'international'], sentences: ['I have worked with international customers for several years.', 'I was responsible for communicating with our customers.'] };
  const practised = ['I have worked with international customers for several years.', 'I was responsible for communicating with our customers.'];
  const r = pronunciationItemRepeat45({ turnText: 'はい、もう一つ練習しましょう。 Here is one more: "I have worked with international customers for several years." Please listen, then repeat after me.', targets, practised: practised.slice(0, 1) });
  assert.ok(r); assert.equal(r!.repeated, 'I have worked with international customers for several years.');
  assert.match(r!.reason, /already practised/i); assert.match(r!.reason, /I have worked with international customers/); assert.match(r!.reason, /I was responsible for communicating/);
  assert.equal(pronunciationItemRepeat45({ turnText: 'Listen, then repeat after me: "I was responsible for communicating with our customers."', targets, practised: practised.slice(0, 1) }), null, 'a new item');
  assert.equal(pronunciationItemRepeat45({ turnText: 'Here is one more: "I have worked with international customers for several years." Please listen, then repeat after me.', targets, practised: [] }), null, 'nothing practised yet');
  assert.equal(pronunciationItemRepeat45({ turnText: 'Your pronunciation of "international" scored 95. Would you like one more item, or shall we move on to the summary?', targets, practised: ['international'] }), null, 'a measured mention is no ask');
  // every listed item spent: the reason says so instead of listing remaining ones
  const all = pronunciationItemRepeat45({ turnText: 'Here is one more: "I have worked with international customers for several years." Please listen, then repeat after me.', targets, practised: [...practised, 'responsibilities', 'international'] });
  assert.ok(all); assert.match(all!.reason, /a sentence the learner said earlier in this lesson|earlier in this lesson/i);
  const vtr = readFileSync(join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.match(vtr, /pronunciationPractisedRef\.current\.set\(practisedSeg, \[\.\.\.\(pronunciationPractisedRef\.current\.get\(practisedSeg\) \?\? \[\]\), referenceText\]\);/);
  assert.match(vtr, /rejectionsThisAttempt\.push\(\{ action: 'pronunciation_item_repeated', reason: pronRepeat\.reason \}\);/);
  assert.match(vtr, /onDebugEvent\?\.\('pronunciation_item_repeated', /);
  assert.match(vtr, /pronunciationRepeatProne: /);
});


test('45 review: I-2 the repeat check reads the practised list snapshotted at attempt start (the turn\'s own tool arm is not "already practised"); M-5 the re-ask exemption is a say/try/repeat … again, not any "again"', () => {
  const vtr = readFileSync(join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.match(vtr, /const attemptPractisedPron = \[\.\.\.\(pronunciationPractisedRef\.current\.get\(currentSegmentIdRef\.current \?\? ''\) \?\? \[\]\)\];/);
  assert.match(vtr, /const prPractisedAll = attemptPractisedPron;/);
  assert.match(vtr, /const prReask = \/\\b\(\?:say\|try\|repeat\)\\b\[\^\.!\?\]\*\\bagain\\b\|\\bonce more\\b\|\\bone more time\\b\|もう一度\/i\.test\(attemptText\);/);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
