/**
 * Task 14 §F — pronunciation auto-arm detector (pronunciation/auto-arm.ts).
 * Run: npx tsx scripts/test-pronunciation-auto-arm.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { detectPronunciationTarget, pronunciationTargetsOf, syllablePatternFor, shouldRearmPronunciation, notAttemptedDetail, measuredPronunciationRedelivery, isStudentQuestion } from '../src/lib/tutor/pronunciation/auto-arm';
import { duplicateSentenceAction, currentBoardPage, sentenceCardIdOnCurrentPage, sentenceOnBoardPage } from '../src/lib/tutor/voice/sentence-board';
import { isRetryAsk } from '../src/lib/tutor/voice/retry-cap';
import { isStrictRepeatAsk } from '../src/lib/tutor/voice/correct-retry';

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
  assert.ok(VTR.includes('duplicateSentenceAction({ page, currentPage: dupCurrentPage, pronunciationModel: dupPronModel, onCurrentPage: !!existingId, inThisBatch })'));
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
  assert.ok(VTR.includes('duplicateSentenceAction({ page, currentPage: dupCurrentPage, pronunciationModel: dupPronModel, onCurrentPage: !!existingId, inThisBatch })'));
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

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
