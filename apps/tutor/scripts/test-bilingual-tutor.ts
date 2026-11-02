/**
 * Bilingual tutor (English + Japanese, per-tenant `tutor_languages` claim).
 *
 * Guards the two promises of the feature:
 *   1. A tenant WITHOUT the claim is byte-identical: prompt, TTS language,
 *      sentence splitting.
 *   2. A tenant WITH it gets the Rule 5 override in the SESSION block only
 *      (the shared cached core stays the same for everyone), a per-sentence
 *      TTS language, and Japanese sentences split from English ones.
 *
 * Run: npx tsx scripts/test-bilingual-tutor.ts
 */
import { TRANSITION_ASK_REASON as TRANSITION_ASK_REASON_E7 } from '../src/lib/tutor/lesson-plan/transition-ask';
import { fixedScriptOfferMissingReason as fixedScriptOfferMissingReasonE7 } from '../src/lib/tutor/lesson-plan/fixed-script';
import { splitRunTogetherEnglish as splitRunTogetherEnglishR3, isKnownWordForm as isKnownWordFormR3, replaceLastStudentEntry as replaceLastStudentEntryR3, rememberStudentEntryId as rememberStudentEntryIdR4 } from '../src/lib/tutor/voice/run-together-english';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { SentenceBuffer } from '../src/lib/tutor/voice/claude-brain';
import { buildBilingualClause, buildSystemPromptParts } from '../src/lib/tutor/ai/system-prompt-builder';
import { parseTutorLanguages, ttsLanguageFor, splitSentenceForTts, keptRestRemoved } from '../src/lib/tutor/voice/tts-language';
import { isProseNotLatex } from '../src/lib/tutor/whiteboard/inline-math';
import { rewriteForTTS } from '../src/lib/tutor/voice/tts-pronunciation';
import { latexAsProse } from '../src/lib/tutor/whiteboard/prose-latex';
import { classifyTranscript, sessionAllowsNonLatin } from '../src/lib/tutor/voice/transcript-filters';
import { inkTurnEndTimeoutMs } from '../src/lib/tutor/voice/ink-turn-end';
import { buildJudgeUserContent } from '../src/lib/tutor/judge-prompt';
import { isPleasantryOnly, isTutorFarewell, isSessionEndSignalJa } from '../src/lib/tutor/voice/lesson-close';
import { splitRunTogetherEnglish } from '../src/lib/tutor/voice/run-together-english';
import { hasKatakanaEnglish } from '../src/lib/tutor/voice/katakana-english';
import { saysCannotSeeScreen, VOICE_ONLY_NOTE_FIRST } from '../src/lib/tutor/voice/voice-only';
import { asksForEnglish, hasNoLatinLetters, isStudentRepeatRequest, NO_ENGLISH_REPLY_NOTE } from '../src/lib/tutor/voice/english-reply';
import { isRetryAsk, isNegatedAsk, retryCapNote, RETRY_CAP_NOTE } from '../src/lib/tutor/voice/retry-cap';
import { readPacingVerdict } from '../src/lib/tutor/voice/pacing-verdict';
import { shouldClearQpinOnAnswer } from '../src/lib/tutor/qpin-behavior';
import { sentenceVerdictStance } from '../src/lib/tutor/voice/voice-judging';
import { opensWithDenial } from '../src/lib/tutor/voice/verdict-precheck-shared';
import { opensWithAffirmingVerdict } from '../src/lib/tutor/voice/nonanswer-praise';
import { refersToLearnerInThirdPerson, LEARNER_ADDRESS_NOTE } from '../src/lib/tutor/voice/learner-address';
import { overusesSuperlative, hasSuperlativePraise, PRAISE_VARIETY_NOTE, PRAISE_STICKY_AFTER_PLANTS } from '../src/lib/tutor/voice/praise-variety';
import { reAskedCheckedCorrect, CORRECT_RETRY_NOTE } from '../src/lib/tutor/voice/correct-retry';
import { decideLessonCloseAutoEnd, LESSON_CLOSE_AUTO_END_MS } from '../src/lib/tutor/voice/lesson-close';
import { TUTOR_LESSON_CLOSE_AUTO_END, TUTOR_LANGUAGE_TURN_MAX_TOKENS } from '../src/lib/tutor/orchestrator/flags';
import { asksReadiness } from '../src/lib/tutor/voice/readiness-ask';
import { claimsPronunciation } from '../src/lib/tutor/voice/pronunciation-claim';
import { detectHoldRequest, WAIT_REQUEST_NOTE } from '../src/lib/tutor/voice/student-hold';
import { pickLivenessReply } from '../src/lib/tutor/voice/cover-layer';
import { renderVoiceCadenceBlock } from '../src/lib/tutor/pedagogy/voice-cadence';
import { isMetaNarration, stripLeakedLabels, stripEchoedTags } from '../src/lib/tutor/voice/meta-narration';
import { parseThinkingCue, initialThinkingCue, cueTurnAccepted, cueTick, thinkingCueVisible, thinkingCueLabel, CHIME_TO_PULSE_MS, PULSE_EVERY_MS, ACCEPT_GRACE_MS } from '../src/lib/tutor/voice/thinking-cue';
import { parseSpeechRate } from '../src/lib/tutor/voice/speech-rate';
import { cannedLanguage, localizeCanned, lastTutorText, JA_CANNED } from '../src/lib/tutor/voice/bilingual-canned';
import { COVER_POOLS } from '../src/lib/tutor/voice/cover-layer';
import { turnCapPolicy, turnCapHit, cadenceNote, CADENCE_STICKY_AFTER_PLANTS } from '../src/lib/tutor/voice/turn-cap';
import { opensWithStockPraise, overusesStockPraiseOpener, PRAISE_OPENER_NOTE } from '../src/lib/tutor/voice/praise-variety';
import { reAskedOwnSentence, OWN_SENTENCE_RETRY_NOTE, reAskedModelSentence, saidModelSentence, REPEAT_AFTER_CORRECT_REASON, repeatAfterCorrectStandDown, sameQuestionThirdTime, turnAskGist, studentAnsweredAsk, SAME_QUESTION_THIRD_TIME_REASON, cleanStudentSentence, dropFillersAndRepeats, precheckCorrectness, probeCheckinDue, PROBE_CHECKIN_NOTE } from '../src/lib/tutor/voice/correct-retry';
import { findUnreadableWords, latinWords, unreadableWordNote, findUnknownNames, unknownNameNote } from '../src/lib/tutor/voice/unreadable-word';
import { englishInstructionSentences, romajiSentences, ENGLISH_INSTRUCTION_NOTE, ROMAJI_NOTE, LANGUAGE_KEEP_NOTE } from '../src/lib/tutor/voice/tutor-language-drift';
import { isLateTail, lateTailNote, LATE_TAIL_MAX_TUTOR_TURN_MS } from '../src/lib/tutor/voice/late-tail';
import { reAskedAnsweredQuestion, englishQuestions, REASKED_QUESTION_NOTE } from '../src/lib/tutor/voice/correct-retry';
import { sameQuestionThirdTimeReason, isPersonalQuestion, SAME_QUESTION_THIRD_TIME_PERSONAL_REASON, retryReasksQuestion, isStarterHint, sameQuestionMoveOnLine } from '../src/lib/tutor/voice/correct-retry';
import { recordAnsweredQuestions, reAskedEarlierQuestion, REASKED_EARLIER_QUESTION_NOTE, saysAlreadyAnswered, ALREADY_ANSWERED_NOTE } from '../src/lib/tutor/voice/correct-retry';
import { ToolMarkupFilter, stripToolMarkup, hasToolMarkup } from '../src/lib/tutor/voice/tool-markup';
import { languageTurnMaxTokens, outputBudgetNote, settleHeldTail, endsSentence, LANGUAGE_TURN_MAX_TOKENS_DEFAULT } from '../src/lib/tutor/voice/output-budget';
import { decidePostCloseUtterance, postCloseSilenceKind, POST_CLOSE_NOTE } from '../src/lib/tutor/voice/lesson-close';
import { praiseNoteIsSticky, PRAISE_SESSION_SUPERLATIVE_STICKY } from '../src/lib/tutor/voice/praise-variety';
import { hasKatakanaEnglishFromStt, KATAKANA_ECHO_NOTE } from '../src/lib/tutor/voice/katakana-english';
import { hasDottedKatakanaReading, KATAKANA_ENGLISH_NOTE_STANDING, KATAKANA_STICKY_AFTER_PLANTS } from '../src/lib/tutor/voice/katakana-english';
import { isStockPraiseOpenerOnly } from '../src/lib/tutor/voice/praise-variety';
import { isIdenticalTranscript, IDENTICAL_RETRY_NOTE } from '../src/lib/tutor/voice/english-reply';
import { isMetaNarration as isMetaNarration2 } from '../src/lib/tutor/voice/meta-narration';
import { settleCutToolUse, toolContinuationMessages, toolContinuationNote, needsHeadroomFor, requiredPhraseMissAction } from '../src/lib/tutor/voice/output-budget';
import { isPrematureCloseLine, inClosingStretch, PREMATURE_CLOSE_NOTE, prematureFarewellLine, reopensAfterClose, isStandaloneStopUtterance } from '../src/lib/tutor/voice/lesson-close';
import { stripMarkdownEmphasis, matchSentenceBoundary, splitIntoSpokenSentences } from '../src/lib/tutor/voice/sentence-spacing';
import { isPronunciationClaimSentence } from '../src/lib/tutor/voice/pronunciation-claim';
import { praisedPromptedRepeat, PROMPTED_REPEAT_NOTE } from '../src/lib/tutor/voice/praise-variety';
import { expectsEnglishReply } from '../src/lib/tutor/voice/english-reply';
import { isBoardReadAloud, asksToReadAloud, normaliseNumberTokens, repeatAskThirdVersion, isRepeatAskForThirdVersion, REPEAT_ASK_THIRD_VERSION_REASON, moveOnIgnored, moveOnRequestSpan, MOVE_ON_IGNORED_REASON,
  repeatAskAfterTwoTries, repeatAskTriesAfterStudentTurn, repeatAskTriesAfterTutorTurn, repeatAskTargetOf, REPEAT_ASK_AFTER_TWO_TRIES_REASON, type RepeatAskTries } from '../src/lib/tutor/voice/correct-retry';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

function split(text: string): string[] {
  const b = new SentenceBuffer();
  const out = b.push(text);
  const tail = b.flush();
  if (tail) out.push(tail);
  return out;
}
/** Same text streamed a few characters at a time, as the brain delivers it. */
function splitStreamed(text: string, step = 3): string[] {
  const b = new SentenceBuffer();
  const out: string[] = [];
  for (let i = 0; i < text.length; i += step) out.push(...b.push(text.slice(i, i + step)));
  const tail = b.flush();
  if (tail) out.push(tail);
  return out;
}

console.log('parseTutorLanguages');
test('absent / English-only / unsupported ⇒ null (default session)', () => {
  for (const v of [undefined, null, '', 'en', ['en'], ['xx'], 42, {}]) assert.equal(parseTutorLanguages(v), null, JSON.stringify(v));
});
test('array or comma string, any case, region tags ⇒ ["en","ja"]', () => {
  for (const v of [['en', 'ja'], ['ja'], 'en,ja', 'JA', ['ja-JP', 'en-US'], 'ja en']) {
    assert.deepEqual(parseTutorLanguages(v), ['en', 'ja'], JSON.stringify(v));
  }
});
test('same set ⇒ the same array instance (stable React prop)', () => {
  assert.equal(parseTutorLanguages(['ja']), parseTutorLanguages('en,ja'));
});

console.log('ttsLanguageFor');
test('no languages ⇒ undefined (request unchanged)', () => {
  assert.equal(ttsLanguageFor('こんにちは。', undefined), undefined);
  assert.equal(ttsLanguageFor('Hello.', null), undefined);
  assert.equal(ttsLanguageFor('こんにちは。', ['en']), undefined);
});
test('bilingual: Japanese script ⇒ ja, Latin ⇒ en', () => {
  const langs = ['en', 'ja'];
  assert.equal(ttsLanguageFor('Let’s practise the past tense.', langs), 'en');
  assert.equal(ttsLanguageFor('過去形を練習しましょう。', langs), 'ja');
  assert.equal(ttsLanguageFor('ミーティングの準備をしましょう。', langs), 'ja');
  assert.equal(ttsLanguageFor('「rearrange」は「予定を変える」という意味です。', langs), 'ja');
});

console.log('SentenceBuffer');
test('English-only text splits exactly as before (no Japanese ⇒ old path)', () => {
  const t = 'Great work on that one, Ms. Kiara! Now try the next step yourself. Ok.';
  assert.deepEqual(split(t), ['Great work on that one, Ms. Kiara!', 'Now try the next step yourself.', 'Ok.']);
});
test('Japanese sentences split on 。！？ with no space', () => {
  assert.deepEqual(split('はい、そうです。次に練習しましょう！大丈夫ですか？'),
    ['はい、そうです。', '次に練習しましょう！', '大丈夫ですか？']);
});
test('short Japanese then English: separate chunks', () => {
  assert.deepEqual(split('いいですね。 Repeat after me. I have been to Osaka.'),
    ['いいですね。', 'Repeat after me. I have been to Osaka.']);
});
test('short English then Japanese: separate chunks', () => {
  assert.deepEqual(split('Great job. 次は過去形です。'), ['Great job.', '次は過去形です。']);
  assert.deepEqual(split('Great job.次は過去形です。'), ['Great job.', '次は過去形です。']);
});
test('closing bracket stays with its sentence', () => {
  assert.deepEqual(split('「もう一度言ってください。」と言いましょう。'), ['「もう一度言ってください。」', 'と言いましょう。']);
});
test('streamed in small deltas ⇒ same chunks', () => {
  const t = 'いいですね。 Repeat after me. I have been to Osaka. 次は過去形です。わかりましたか？';
  assert.deepEqual(splitStreamed(t), split(t));
});

console.log('system prompt');
const base = { subject: 'English', topic: 'Business English', level: 'adult', sessionGoal: 'learn' } as Parameters<typeof buildSystemPromptParts>[0];
test('no tutorLanguages ⇒ prompt identical to an explicit English-only session', () => {
  const a = buildSystemPromptParts(base);
  const b = buildSystemPromptParts({ ...base, tutorLanguages: ['en'] });
  assert.equal(a.core + a.session, b.core + b.session);
  assert.equal(buildBilingualClause(undefined), null);
  assert.equal(buildBilingualClause(['en']), null);
});
test('bilingual ⇒ core unchanged (shared cache), clause in session only', () => {
  const a = buildSystemPromptParts(base);
  const b = buildSystemPromptParts({ ...base, tutorLanguages: ['en', 'ja'] });
  assert.equal(b.core, a.core, 'core must be byte-identical across tenants');
  assert.ok(b.session.includes('Session languages: English and Japanese (overrides Rule 5)'));
  assert.ok(!a.session.includes('Session languages'));
  assert.ok(b.session.startsWith(a.session.slice(0, 200)), 'existing session text keeps its place');
});
test('clause is generic: no client or product names', () => {
  const c = buildBilingualClause(['en', 'ja'])!;
  for (const banned of ['GDI', 'Gambit', 'Toyota', 'Denso', 'Nagoya']) assert.ok(!c.includes(banned), banned);
});

test('clause: stop hinting after two tries and explain in Japanese (GDI demo 10-27)', () => {
  const c = buildBilingualClause(['en', 'ja'])!;
  assert.ok(c.includes('stop hinting after two tries'));
  assert.ok(c.includes('explain it in two or three short sentences — in Japanese for a beginner'));
  assert.ok(c.includes('Never give a third hint on the same question'));
});

console.log('TTS text rewrite');
test('rewriteForTTS leaves Japanese text intact', () => {
  for (const t of ['過去形を練習しましょう。', '「I went to Osaka」は過去形です。', '火曜日の午後3時はどうですか？']) {
    const r = rewriteForTTS(t, {});
    const jp = (s: string) => s.match(/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/gu)?.join('') ?? '';
    assert.equal(jp(r), jp(t), `${t} → ${r}`);
  }
});

console.log('whiteboard');
test('Japanese in an equation field routes to the text renderer', () => {
  assert.equal(isProseNotLatex('会議の準備をしましょう'), true);
  assert.equal(isProseNotLatex('時間 = 3'), false, 'a math signal still wins');
  assert.equal(isProseNotLatex('x^2 + 1'), false);
  assert.equal(isProseNotLatex('2x'), false);
});

console.log('wiring (source scan)');
test('every Cartesia TTS request path can carry the sentence language', () => {
  const hook = readFileSync('src/app/tutor/hooks/useOpenAIRealtime.ts', 'utf8');
  assert.equal((hook.match(/ttsLanguageFor\(trimmed, tutorLanguagesRef\.current\)/g) ?? []).length >= 3, true);
  const ws = readFileSync('src/app/tutor/hooks/useCartesiaSonicWS.ts', 'utf8');
  assert.ok(ws.includes("language: opts.language ?? 'en'"));
  const route = readFileSync('src/app/api/tutor/tts-cartesia/route.ts', 'utf8');
  assert.ok(route.includes('language: ttsLanguage'));
});
test('embed claim reaches both the prompt and the TTS hook', () => {
  const embed = readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8');
  assert.ok(embed.includes('parseTutorLanguages(config.tutor_languages)'));
  assert.ok(embed.includes('tutorLanguages={tutorLanguages}'));
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.equal((vtr.match(/\.\.\.\(tutorLanguages \? \{ tutorLanguages \} : \{\}\)/g) ?? []).length, 2);
});

console.log('live-session fixes (GDI starter session 2026-10-14)');
test('session clause forbids romaji openers and pronunciation judgments, asks for production', () => {
  const c = buildBilingualClause(['en', 'ja'])!;
  assert.ok(c.includes('never romaji') && c.includes('short opener'));
  assert.ok(c.includes('cannot hear pronunciation'));
  assert.ok(c.includes('only after they have tried'));
  assert.equal(buildBilingualClause(['en']), null, 'English-only tenants unchanged');
});
console.log('live-session fixes (GDI advanced session 2026-10-15)');
test('session clause: spoken items carry their cue, unambiguous instructions, short specific feedback, no math talk', () => {
  const c = buildBilingualClause(['en', 'ja'])!;
  assert.ok(c.includes('including any cue in brackets'));
  assert.ok(c.includes('Judge the answer against what you SAID'));
  assert.ok(c.includes('another reasonable reading of your instruction'));
  assert.ok(c.includes('Do not re-explain a rule'));
  assert.ok(c.includes('rules of thumb'));
  assert.ok(c.includes('never as equations'));
});
test('a sentence sent as an equation renders as prose; real math stays KaTeX', () => {
  assert.deepEqual(latexAsProse(String.raw`\text{I tried scuba diving last summer.}`), [{ text: 'I tried scuba diving last summer.', bold: false }]);
  assert.deepEqual(latexAsProse(String.raw`\text{Last month, I } \textbf{visited} \text{ Osaka.}`),
    [{ text: 'Last month, I ', bold: false }, { text: 'visited', bold: true }, { text: ' Osaka.', bold: false }]);
  for (const m of [String.raw`5\,\text{m/s}`, String.raw`x = \text{cost}`, String.raw`\frac{1}{2}\text{ of it}`, String.raw`\text{area} = \pi r^2`, 'x^2 + 1', String.raw`\text{if } x > 0`]) {
    assert.equal(latexAsProse(m), null, m);
  }
});
test('board: appended items start below notes; placed notes claim their spot first; cell ticks sit inside the cell', () => {
  const canvas = readFileSync('src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx', 'utf8');
  const overlay = readFileSync('src/app/tutor/components/whiteboard/InkNotesOverlay.tsx', 'utf8');
  assert.ok(canvas.includes('onNotesBottomChange={handleNotesBottom}') && canvas.includes('marginTop: appendPad'));
  assert.ok(overlay.includes('for (const src of placementOrder)'));
  assert.ok(canvas.includes("s.targetFeature?.startsWith('cell-')"));
});
console.log('live-session fixes (GDI meeting + starter sessions 2026-10-15)');
test('mostly-Japanese turns are speech in a bilingual session, still noise in an English-only one', () => {
  const turn = 'はい、もう一回。Iwenttothesupermarketandboatmilk .今度はボートじゃなくてボートのつもりです。あの、次の話ちょっとだけでいいです';
  assert.equal(classifyTranscript(turn, { allowNonLatin: sessionAllowsNonLatin(['en', 'ja']) }), 'clean');
  assert.equal(classifyTranscript('少々だけ時間欲しいです。その後一緒にいたいです。お願いします。', { allowNonLatin: true }), 'clean');
  assert.equal(classifyTranscript(turn), 'noise', 'English-only sessions keep the hallucination filter');
  assert.equal(sessionAllowsNonLatin(['en']), false);
  assert.equal(sessionAllowsNonLatin(undefined), false);
});
test('every noise-filter call in the runtime passes the session languages', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  const calls = vtr.match(/classifyTranscript\([^)]*\)/g) ?? [];
  assert.ok(calls.length >= 4);
  for (const c of calls) assert.ok(c.includes('allowNonLatin'), c);
  assert.ok(readFileSync('src/app/tutor/hooks/useOpenAIRealtime.ts', 'utf8').includes('allowNonLatin: sessionAllowsNonLatin('));
});
test('label equations of text read as text: "=" → ":", arrows kept', () => {
  const r = (s: string) => latexAsProse(s)?.map((x) => x.text).join('') ?? null;
  assert.equal(r(String.raw`\text{Kim's message} = \text{"Are you free Tuesday morning?"}`), `Kim's message: "Are you free Tuesday morning?"`);
  assert.equal(r(String.raw`\text{go} \rightarrow \text{went}`), 'go → went');
  assert.equal(r(String.raw`\text{speed} = 5`), null);
});
test('language-lesson clause: short turns, sound-alikes, two retries, honest about pronunciation, board the correction, role-play in character, answer a continuation once', () => {
  const c = buildBilingualClause(['en', 'ja'])!;
  for (const k of ['about 40 words', 'sound-alike', 'at most twice', 'only see their words as text', 'write the correct sentence on the board', 'speak AS the character', 'answer the whole thing once']) assert.ok(c.includes(k), k);
});
test('judge: language lessons get the learner-speech block; other subjects unchanged', () => {
  const base = { boardSummary: '', spokenText: 'Great.' };
  assert.ok(buildJudgeUserContent({ ...base, learnerSpeech: true }).startsWith('<learner_speech>'));
  assert.ok(buildJudgeUserContent(base).startsWith('<whiteboard_state>'));
  assert.ok(readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8').includes("subject === 'languages' ? { learnerSpeech: true }"));
});
test('pre-audio supersede: a final arriving before the in-flight reply spoke aborts it and answers both parts once', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  const i = vtr.indexOf('TUTOR_SUPERSEDE_PRE_AUDIO &&');
  assert.ok(i > 0);
  const branch = vtr.slice(i, i + 1600);
  for (const k of ['!inFlight.shown', '!opts?.silent', 'PRE_AUDIO_SUPERSEDE_MS', 'inFlightBrainAbortRef.current.abort()', 'queuedTranscriptsRef.current.push(combined)', 'isFuzzyDupTranscript']) assert.ok(branch.includes(k), k);
  assert.ok(vtr.indexOf('TUTOR_SUPERSEDE_PRE_AUDIO &&') < vtr.indexOf("queued (brain busy):', JSON.stringify(transcript)"), 'runs before the plain queue push');
  assert.ok(readFileSync('src/lib/tutor/orchestrator/flags.ts', 'utf8').includes("NEXT_PUBLIC_TUTOR_SUPERSEDE_PRE_AUDIO !== 'off'"));
});
console.log('thinking cue (GDI sessions 2026-10-15)');
test('thinking_cue claim: true/"true"/1/"on" ⇒ on; absent or anything else ⇒ off', () => {
  for (const v of [true, 'true', 1, '1', 'on', ' TRUE ']) assert.equal(parseThinkingCue(v), true, String(v));
  for (const v of [undefined, false, 'false', 0, 'off', '', null, {}]) assert.equal(parseThinkingCue(v), false, String(v));
});
test('cue timing: chime on accept, silent until 2 s, then a pulse every 1.2 s while thinking', () => {
  let { state, play } = cueTurnAccepted(initialThinkingCue(), 1000);
  assert.equal(play, 'chime');
  ({ state, play } = cueTick(state, 'thinking', 1000 + CHIME_TO_PULSE_MS - 1));
  assert.equal(play, null);
  ({ state, play } = cueTick(state, 'thinking', 1000 + CHIME_TO_PULSE_MS));
  assert.equal(play, 'pulse');
  ({ state, play } = cueTick(state, 'processing', 1000 + CHIME_TO_PULSE_MS + PULSE_EVERY_MS - 1));
  assert.equal(play, null);
  ({ state, play } = cueTick(state, 'thinking', 1000 + CHIME_TO_PULSE_MS + PULSE_EVERY_MS));
  assert.equal(play, 'pulse');
});
test('cue stops the moment tutor audio starts or the student speaks (after the accept grace)', () => {
  for (const leave of ['speaking', 'hearing', 'listening', 'idle', 'error']) {
    let { state } = cueTurnAccepted(initialThinkingCue(), 0);
    let play;
    ({ state, play } = cueTick(state, leave, ACCEPT_GRACE_MS - 1));
    assert.equal(state.phase, 'waiting', `${leave}: grace beat keeps waiting`);
    ({ state, play } = cueTick(state, leave, ACCEPT_GRACE_MS));
    assert.equal(state.phase, 'idle', leave);
    ({ state, play } = cueTick(state, 'thinking', 10_000));
    assert.equal(play, null, `${leave}: no pulse after stopping`);
  }
});
test('thinking pill: only when enabled, started and processing/thinking; Japanese label after a Japanese turn', () => {
  assert.equal(thinkingCueVisible(true, true, 'thinking'), true);
  assert.equal(thinkingCueVisible(true, true, 'processing'), true);
  assert.equal(thinkingCueVisible(true, true, 'speaking'), false);
  assert.equal(thinkingCueVisible(false, true, 'thinking'), false, 'off without the claim');
  assert.equal(thinkingCueVisible(true, false, 'thinking'), false);
  assert.equal(thinkingCueLabel('ja'), '考えています…');
  assert.equal(thinkingCueLabel(undefined), 'Thinking…');
});
test('thinking cue wiring: claim → TutorSession → runtime + stage; head cover skipped; events persisted', () => {
  const embed = readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8');
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  const ts = readFileSync('src/app/tutor/components/session/TutorSession.tsx', 'utf8');
  // 2026-10-29: the claim defaults ON for every tenant (resolveThinkingCueClaim).
  assert.ok(embed.includes('TUTOR_THINKING_CUE && resolveThinkingCueClaim(config.thinking_cue)') && embed.includes('thinkingCue={thinkingCue}'));
  assert.ok(ts.includes('thinkingCue={thinkingCue}') && ts.includes('thinkingCueText={stageNotice ?? thinkingCueText}') /* Task 27 §G: the mic notice shares the slot */);
  assert.ok(vtr.includes("onDebugEvent?.('thinking_cue_ack_skipped'"));
  assert.ok(vtr.includes('cueStudentTurnAccepted();\n      await callBrainOnce(transcript, opts);') || vtr.includes('cueStudentTurnAccepted();'));
  for (const ev of ['thinking_cue_chime', 'thinking_cue_ack_skipped']) assert.ok(embed.includes(`'${ev}',`), ev);
  assert.ok(readFileSync('src/lib/tutor/orchestrator/flags.ts', 'utf8').includes("NEXT_PUBLIC_TUTOR_THINKING_CUE !== 'off'"));
});
console.log('live-session fixes (GDI starter session 3, 2026-10-15)');
test('after the close: goodbyes/thanks are pleasantries; content and questions are not', () => {
  for (const t of ['はい、ありがとうございます。また次回。はい、失礼します。', 'はい、またお願いします。ありがとうございました。', 'はい、お疲れ様でした', 'はい。', 'Thank you, see you next time!']) assert.equal(isPleasantryOnly(t), true, t);
  for (const t of ['うん、こちらこそです。ありがとうございました。今日は色々練習できました。まだ難しいけど、また次回もお願いします。', 'Today was hard but fun. Thank you, see you next time.']) assert.equal(isPleasantryOnly(t), true, t);
  for (const t of ['今日は色々練習できました。もう一つ質問してもいいですか。ありがとうございました。', '難しかったです。発音を教えてください。お願いします。']) assert.equal(isPleasantryOnly(t), false, t);
  for (const t of ['はい、ありがとうございます。ちょっと自信つきました。', "No, I haven't。カヤックはまだです。", 'また質問してもいいですか？', 'Have you?']) assert.equal(isPleasantryOnly(t), false, t);
});
test('lesson-closed state: set by closeSessionNotes, silences pleasantries, stands the idle nudge down', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("if (!opts?.silent && lessonClosedRef.current && decidePostCloseUtterance(transcript) === 'silence')"));
  assert.ok(/cmd\.action === 'closeSessionNotes'\) \{[\s\S]{0,3500}lessonClosedRef\.current = true/.test(vtr));
  assert.ok(vtr.includes('if (lessonClosedRef.current) return;'));
});
test('bare Japanese short answers survive the noise filter in a bilingual session', () => {
  assert.equal(classifyTranscript('はい', { allowNonLatin: true }), 'clean');
  assert.equal(classifyTranscript('うん', { allowNonLatin: true }), 'clean');
  assert.equal(classifyTranscript('uh', { allowNonLatin: true }), 'noise');
});
test('persona directives are meta; leaked stage labels are stripped', () => {
  assert.equal(isMetaNarration("Ryota's rule applies here: no second full farewell beyond acknowledgment."), true);
  assert.equal(isMetaNarration("Ryota's style: gentle pace, one catchphrase max, no re-greeting."), true);
  assert.equal(isMetaNarration('お疲れ様でした。'), false);
  assert.equal(stripLeakedLabels('*opener* はい、ちょうど今、三つの質問が出ていますね。'), 'はい、ちょうど今、三つの質問が出ていますね。');
  assert.equal(stripLeakedLabels('*I went* is right.'), '*I went* is right.');
});
test('meta-narration (embed-1792125283926): verdict reasoning and bare fillers dropped, echoed tags stripped', () => {
  for (const s of ["Let's see this together.", "Okay, let's see.", "This matches what's on the board — \"Yes, I have.\" for Pattern 2.", "That's an attempt at this turn's open question — where you went.", "That matches Pattern 2's expected answer for the question."]) assert.equal(isMetaNarration(s), true, s);
  for (const s of ["Let's see what happens if we add two.", "Okay, let's see the next one together, shall we?", "That's a complete, correct answer to my question.", "3<n and n>10 holds."]) assert.equal(isMetaNarration(s), false, s);
  // embed-1792174263669: reworded fillers, English and Japanese.
  for (const s of ["Let's see what you've got.", "Okay, let’s hear what you've got.", "Okay, let's see where this is.", "Okay, let's see what's going on.", "Let's see this.", "はい、少し見てみましょう。", "いいですね、見てみましょう。", "はい、見てみましょう。"]) assert.equal(isMetaNarration(s), true, s);
  for (const s of ["ちょっと見てみてください。", "表を見てみましょう、一つ目はパターン1です。", "Let's see what you did last weekend.", "Let's look at the table together: Pattern 1 is for a specific time."]) assert.equal(isMetaNarration(s), false, s);
  // embed-1792185403054: tool names, plan read aloud, more fillers.
  for (const s of ['show_passage を使って、完成した文を見せます。', 'show_equationを見てください。', 'Let me give the correct form directly, kindly, then close this out and move on.', "Let's see here.", "Let's check that.", 'That matches what you said, well done on part two.']) assert.equal(isMetaNarration(s), true, s);
  for (const s of ['Show me your answer.', 'Let me give you a hint: the verb is went.', "Let's check the next sentence together."]) assert.equal(isMetaNarration(s), false, s);
  // embed-1792196208833: "let me think" opener filler.
  for (const s of ['Okay. let me think about that for a second.', 'Let me think.', 'Hmm, let me just think about this for a moment.']) assert.equal(isMetaNarration(s), true, s);
  for (const s of ['Let me think about that for a second, then we can try the next one.', 'Let me think of an example: I went to Kyoto.']) assert.equal(isMetaNarration(s), false, s);
  // embed-1792199116313: tool-use plan read aloud.
  for (const s of ['Let me verify the card is there before scribbling.', 'Let me check the card first.']) assert.equal(isMetaNarration(s), true, s);
  for (const s of ['Let me check your sentence: I ate sushi yesterday.', 'Let me make sure you know this word: went.']) assert.equal(isMetaNarration(s), false, s);
  // embed-1792201826241: English spelled out in katakana.
  assert.equal(hasKatakanaEnglish('なので「アイ・エイト・スシ・イエスタデイ」ですね。'), true);
  assert.equal(hasKatakanaEnglish('「ハブ・ユー・エバー…」から始めます。'), true);
  assert.equal(hasKatakanaEnglish('コカ・コーラを飲みました。I ate sushi yesterday.'), false);
  assert.equal(hasKatakanaEnglish('カヤックをしたことがありますか。'), false);
  assert.equal(stripEchoedTags("<students_said>\nHi, today\n</students_said>\n\nLet's see this together."), "Let's see this together.");
  assert.equal(stripEchoedTags('x<y and y>z'), 'x<y and y>z');
  // embed-1792199116313: a retro 'speaking' cut whose sound never transcribed
  // left the tutor silent 75s — the retro path must arm the no-verdict recovery.
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  const retroAt = vtr.indexOf('const executeRetroCancel = () => {');
  const retro = vtr.slice(retroAt, vtr.indexOf('realtime.markInterrupted();', retroAt));
  assert.ok(retro.includes('armNoVerdictRecoveryRef.current?.();'), 'retro-cancel arms no-verdict recovery');
  assert.ok(vtr.includes('armNoVerdictRecoveryRef.current = armNoVerdictRecovery;'));
  const src = readFileSync('src/lib/tutor/voice/claude-brain.ts', 'utf8');
  assert.ok(src.includes('const text = stripEchoedTags(markup.text);'), 'echoed tags stripped after the tool-markup filter');
});
test('clause: exercise state kept, grounded corrections, no narrated judging, one goodbye', () => {
  const c = buildBilingualClause(['en', 'ja'])!;
  for (const k of ['A question they answered correctly is finished', 'continue from the step they were on', 'check the error is really there', 'name both', 'do not praise them', 'Never narrate your own judging', 'Say goodbye only in the turn that closes the lesson']) assert.ok(c.includes(k), k);
});
test('brain: an empty max_tokens turn is re-issued once even with thinking off', () => {
  const src = readFileSync('src/lib/tutor/voice/claude-brain.ts', 'utf8');
  assert.ok(src.includes('emptyCapRetried = true') && src.includes("finalMessage.stop_reason === 'max_tokens'"));
});
test('clause: Japanese-script English, no re-teaching correct answers, name the real error, answer questions now, close once', () => {
  const c = buildBilingualClause(['en', 'ja'])!;
  for (const k of ['ラストウィーク', 'Never re-teach', 'name the actual error', 'Never postpone a question', 'without asking it in the same turn', 'close_session_notes', 'never say goodbye again']) assert.ok(c.includes(k), k);
});
console.log('turn-taking fixes (Crimsora portal sessions 2026-10-15)');
test('"can you hear me?" is answered; plain liveness keeps its lines', () => {
  assert.match(pickLivenessReply(0, 'hi can you hear me'), /^Yes, I (?:can )?hear you\.$/);
  assert.match(pickLivenessReply(1, 'Hello? Can you hear me?'), /hear you/);
  assert.doesNotMatch(pickLivenessReply(0, 'are you there?'), /hear you/);
});
test('a late-fallback barge-in over finished audio stops that audio', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  const i = vtr.indexOf("'late_fallback_barge_stopped_speech'");
  assert.ok(i > 0);
  const near = vtr.slice(i - 300, i + 200);
  assert.ok(near.includes("heur.verdict === 'barge_in' && prodState === 'speaking' && !brainBusyRef.current"));
  assert.ok(near.includes('clearSpeechQueueRef.current?.()'));
  assert.ok(readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8').includes("'late_fallback_barge_stopped_speech'"));
});
test('voice cadence: short opening, ~60-word turns, hearing check re-asks the last question, own question honoured', () => {
  const v = renderVoiceCadenceBlock();
  for (const k of ['FIRST turn of a session', 'about 60 words', 'ask your LAST question again', 'Never restart the lesson', 'their own question']) assert.ok(v.includes(k), k);
});
test('speech_rate claim: numbers/strings clamped to [0.6,1.5]; absent/1/garbage ⇒ undefined', () => {
  assert.equal(parseSpeechRate(0.85), 0.85);
  assert.equal(parseSpeechRate('0.8'), 0.8);
  assert.equal(parseSpeechRate(0.2), 0.6);
  assert.equal(parseSpeechRate(9), 1.5);
  assert.equal(parseSpeechRate(1), undefined);
  assert.equal(parseSpeechRate(undefined), undefined);
  assert.equal(parseSpeechRate('fast'), undefined);
  assert.equal(parseSpeechRate(''), undefined);
});
test('canned lines: Japanese only when bilingual AND the tutor last spoke Japanese', () => {
  const tr = [{ role: 'tutor', text: 'もう一度言ってみましょう。' }, { role: 'student', text: 'I went to school.' }];
  assert.equal(lastTutorText(tr), 'もう一度言ってみましょう。');
  assert.equal(cannedLanguage(['en', 'ja'], lastTutorText(tr)), 'ja');
  assert.equal(cannedLanguage(['en', 'ja'], 'Nice. Now try it politely.'), undefined);
  assert.equal(cannedLanguage(undefined, 'もう一度'), undefined, 'English-only session never localizes');
  assert.equal(localizeCanned('Let me see.', 'cover', undefined, 3), 'Let me see.');
  assert.ok(JA_CANNED.cover.includes(localizeCanned('Let me see.', 'cover', 'ja', 3)));
});
test('Japanese covers are fillers, not acknowledgments (no doubling with the brain opener)', () => {
  for (const line of JA_CANNED.cover) assert.ok(!/いいですね|そうですね|なるほど|大丈夫/.test(line), line);
  assert.ok(COVER_POOLS.generic.length > 0);
});
test('speech rate reaches every Cartesia request path as generation_config.speed', () => {
  const hook = readFileSync('src/app/tutor/hooks/useOpenAIRealtime.ts', 'utf8');
  assert.equal((hook.match(/rate: speechRateRef\.current/g) ?? []).length, 3);
  const ws = readFileSync('src/app/tutor/hooks/useCartesiaSonicWS.ts', 'utf8');
  assert.ok(ws.includes('generation_config: { speed: opts.rate }'));
  const route = readFileSync('src/app/api/tutor/tts-cartesia/route.ts', 'utf8');
  assert.ok(route.includes('generation_config: { speed: parseSpeechRate(rate) }'));
  const embed = readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8');
  assert.ok(embed.includes('parseSpeechRate(config.speech_rate)') && embed.includes('speechRate={speechRate}'));
});
test('every canned spoken line in the runtime goes through localizeCanned', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.equal((vtr.match(/localizeCanned\(/g) ?? []).length, 4);
});

test('run-together English from the STT is split into words (embed-1792185403054)', () => {
  assert.equal(splitRunTogetherEnglish('Haveyouevergotokaraoke ?'), 'Have you ever go to karaoke ?');
  assert.equal(splitRunTogetherEnglish('Iwenttoplaygolfyesterday .'), 'I went to play golf yesterday .');
  assert.equal(splitRunTogetherEnglish('Haveyoueverbeentocanada ?'), 'Have you ever been to canada ?');
  assert.equal(splitRunTogetherEnglish("No , Ihaven ' thaveyou ."), "No , I haven't have you .");
  // unknown pieces are kept, never "corrected" into a real word
  assert.equal(splitRunTogetherEnglish('Yes , Ihaveited sushi lastweek .'), 'Yes , I have ited sushi last week .');
  // names and ordinary text are left alone
  for (const t of ['I have been to Hokkaido last year.', 'photosynthesis', 'はい、ありがとうございます。', 'Yesterday I go Golf']) assert.equal(splitRunTogetherEnglish(t), t, t);
});

test('two repeat-asks in a row trigger the move-on note (embed-1792185403054)', () => {
  for (const t of ['もう一度言ってみましょう。', 'もう一度、ゆっくり言ってみましょうか。', 'Try saying it once more: Have you ever gone to karaoke?', 'Say it once more for me?']) assert.equal(isRetryAsk(t), true, t);
  for (const t of ['では、次に進みましょう。', 'Have you ever been to Canada?', 'もう一度読みますね。']) assert.equal(isRetryAsk(t), false, t);
  // embed-1792251169634: 'だけ' and '一緒に' between もう一度 and the verb.
  for (const t of ['もう一度だけ、ゆっくり一緒に言ってみましょうか、No, I haven\'t.', 'もう一度だけ、ゆっくり言ってみましょうか。']) assert.equal(isRetryAsk(t), true, t);
  // embed-1792251169634: 'can't see the screen' sets voice-only mode.
  for (const t of ['ゆっくりでお願いします。画面が見えないです', 'すみません、画面は見えないです。声だけでお願いします', 'ボードが見えません', "Sorry, I can't see the screen."]) assert.equal(saysCannotSeeScreen(t), true, t);
  for (const t of ['はい、なんとなくわかります。', '富士山が見えないです', 'I can see the board now.']) assert.equal(saysCannotSeeScreen(t), false, t);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('retryAskStreakRef.current >= RETRY_CAP_TURNS'));
  assert.ok(vtr.includes('splitRunTogetherEnglish(transcript)'));
});


// ── embed-1792254012923 (2026-10-17) ─────────────────────────────────────────
test('retry cap: every repeat-ask form from embed-1792254012923 is counted', () => {
  const missed = [
    'いいですね、意味はよく伝わります。 一つだけ、発音の区切りを直しましょう。 coworkerはひとつの単語で、コーワーカーと読みます。 もう一度、I went with my coworker、と言ってみてください。',
    'はい、カラオケ好きで、よく行くんですよね。  Have you ever sung karaoke? の答えは、Yes, I have. です。  もう一度、声に出して言ってみてください。 Yes, I have.',
    'カラオケ、好きでよく行くんですね。もう一度聞きますね。Have you ever sung karaoke? 声に出して言ってみてください。',
    'ですので、正しい文は I sang karaoke last week です。 もう一度、声に出して言ってみてください。',
    'いいですね、音がsangに近づいてきましたよ。 Sing の過去形はsangです。 もう一度、I sang karaoke last week、と言ってみてください。',
    'いいですね、だいぶ近づきました。 sang の音は「サング」です。 もう一度、I sang karaoke last week、と言ってみてください。',
    'Have you ever sung karaoke? もう一度、ゆっくり言ってみましょう。「サング」です。',
    'もう一回、繰り返してください。', 'もう一度お願いします。', 'Repeat after me: I went to Kyoto.', 'Once more, please: I have been to Osaka.',
  ];
  for (const t of missed) assert.equal(isRetryAsk(t), true, t);
  // The tutor doing something again is not a repeat-ask; a sentence boundary ends the search.
  for (const t of ['もう一度読みますね。', 'もう一度説明しますね。', 'もう一度、ゆっくり説明します。では言ってみましょう、ではなくて質問に答えてください。', 'では、次に進みましょう。']) assert.equal(isRetryAsk(t), false, t);
  assert.ok(retryCapNote(2).includes('twice'));
  assert.ok(retryCapNote(5).includes('5 times'));
  assert.equal(RETRY_CAP_NOTE, retryCapNote(2));
  // Task 30 §F2 (GDI run 17, 688 s): the next QUESTION, never "the next part".
  assert.equal(retryCapNote(2), "[runtime note — not from the student] You have already asked the student to repeat this sentence twice. Do not ask again. Accept their closest version warmly, say the correct sentence once, write it on the board, and go on to the next question in this turn (the lesson's parts advance on their own — do not announce a new part). Apply this silently; never mention this note.");
  assert.ok(!retryCapNote(3).includes('next part of the lesson'));
  // Task 15 §B (GDI run 5): a negated ask ("no need to repeat it") is not a repeat-ask.
  const live = 'Your earlier sentence was right too, so there\'s no need to repeat it. Next, let\'s try one about a project you worked on.';
  assert.equal(isRetryAsk(live), false, live);
  assert.equal(isNegatedAsk('Your earlier sentence was right too, so there\'s no need to repeat it.'), true);
  for (const t of ['Could you say that complete sentence once more?', 'Let\'s try again.', 'もう一度言ってみてください。']) assert.equal(isRetryAsk(t), true, t);
  for (const t of ['You don\'t have to say it again — let\'s move on.', 'もう一度言う必要はありません。', 'もう一度言ってみる必要はありません。']) assert.equal(isRetryAsk(t), false, t);
  assert.equal(isNegatedAsk('もう一度言ってみる必要はありません。'), true, 'the JA negation after the ask');
  // fix round 1: a negation in another clause, or a JA negation BEFORE the ask, does not cancel the ask
  for (const t of ['No need to worry, just try again.', 'No need to rush — try again.', 'Without the card, try again.', '心配しなくてもいいです、もう一度言ってみてください。']) assert.equal(isRetryAsk(t), true, t);
  // a negated ask in one sentence does not hide a real ask in the next
  assert.equal(isRetryAsk('No need to repeat it. Now try again with a new verb.'), true);
  assert.equal(isNegatedAsk('Let\'s try again.'), false);
  // an English model sentence with its own period inside a Japanese ask still counts
  assert.equal(isRetryAsk('もう一度、"I went to Kyoto." と言ってみてください。'), true);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('pendingRetryCapNoteRef.current = retryCapNote(retryAskStreakRef.current);'));
  assert.ok(!vtr.includes('retryAskStreakRef.current = 0;\n            onDebugEvent'), 'the streak must not be zeroed on plant');
});

test('katakana note: a katakana READING of an English word fires it; a loanword used as Japanese does not', () => {
  for (const t of [
    'coworkerはひとつの単語で、コーワーカーと読みます。',
    'カラオケは英語でもkaraoke、同じスペルで大丈夫ですよ。 発音だけ少し違って、カラオケよりキャリオゥキーみたいに言います。',
    'いいですね、だいぶ近づきました。 sang の音は「サング」です。',
    'Have you ever sung karaoke? もう一度、ゆっくり言ってみましょう。「サング・カラオケ」です。',
    'もう一度、ゆっくり言ってみましょう。「サング」です。',
    'なので「アイ・エイト・スシ・イエスタデイ」ですね。',
  ]) assert.equal(hasKatakanaEnglish(t), true, t);
  for (const t of [
    'カラオケをしたことがありますか。', 'ゴルフは好きですか。', 'コカ・コーラを飲みました。I ate sushi yesterday.',
    'ハワイに行ったことがあるんですね。', '「カラオケ」は日本語でもよく使います。', 'ビデオを見ました、いいですね。',
  ]) assert.equal(hasKatakanaEnglish(t), false, t);
});

test('voice-only: the first turn acknowledges aloud, later turns stay silent', () => {
  assert.ok(VOICE_ONLY_NOTE_FIRST.includes('one short sentence'));
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('voiceOnlyNote = VOICE_ONLY_NOTE_FIRST;'));
  assert.ok(vtr.includes('voiceOnlyNote = VOICE_ONLY_NOTE;'));
});

test('mutual farewell closes the lesson: tutor farewell + Japanese session-end signals', () => {
  for (const t of ['今日はゴルフにカラオケ、ハワイのお話まで、たくさん練習できましたね。 また次回、続きを一緒にやりましょう。 さようなら、Mikeさん。', 'さようなら、Mikeさん。 また次回、お待ちしていますね。', 'Great work today. See you next time!', 'Bye for now, take care.']) assert.equal(isTutorFarewell(t), true, t);
  for (const t of ['さようならは英語で goodbye です。言ってみましょう。', 'See you is a common goodbye. Can you say it?', '短く区切りますね。 もう一つ練習しましょう。 ハワイに、いつ行きましたか。', 'いいですね。 Yes, I have. バッチリです。', '']) assert.equal(isTutorFarewell(t), false, t);
  for (const t of ['今日はここまでにします。ありがとうございました。また次回もお願いします。さようなら。', 'はい、失礼します。両田先生、また次回もよろしくお願いします。さようなら。', '今日はここまでで大丈夫です', 'もう終わりにします']) assert.equal(isSessionEndSignalJa(t), true, t);
  for (const t of ['はい、Iwentwithmycoworkerこれでいいですか', 'ゆっくりでいいですか?', 'えーっと、一人で見ました。']) assert.equal(isSessionEndSignalJa(t), false, t);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('sessionEndSignalRegex.test(lower) || isSessionEndSignalJa(t)'));
  assert.ok(vtr.includes("lastStudentVerificationRef.current?.isSessionEndSignal && isTutorFarewell(fullText)"));
  // Task 29 §J1: through noteLessonClosed (which logs lesson_closed)
  assert.ok(vtr.includes("noteLessonClosed('mutual farewell"));
});

test('english-reply: an English ask answered with no Latin letters gets the note (embed-1792254012923 seq 32)', () => {
  for (const t of ['では、二つの形をまとめますね。「海外に行ったことがありますか」を英語で言ってみましょう。', 'In English, please: have you ever been abroad?', 'もう一度、I sang karaoke last week、と言ってみてください。', 'Say it once more for me.']) assert.equal(asksForEnglish(t), true, t);
  for (const t of ['いいですね。 Yes, I have. I went to Hawaii six years ago. バッチリです。', 'いつ行きましたか。', 'What did you do yesterday?']) assert.equal(asksForEnglish(t), false, t);
  assert.equal(hasNoLatinLetters('えっと、海外に行ったことがありますか?英語にするんでしたよね。でも、はい、ハワイに行きましたと答えたくなります。'), true);
  assert.equal(hasNoLatinLetters('はい、アイサンカロケラストウィーク。これでどうでしょう'), true);
  assert.equal(hasNoLatinLetters('はい。はい。Yes , I have I went to Hawaii 6 years ago .これで大丈夫でしょうか。'), false);
  assert.ok(NO_ENGLISH_REPLY_NOTE.includes('katakana'));
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('askedForEnglishRef.current = expectsEnglishReply(fullText);'), '2026-10-19: an English question also arms the note');
  assert.ok(vtr.includes("onDebugEvent?.('no_english_reply_note'"));
  const embed = readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8');
  assert.ok(embed.includes("'no_english_reply'"));
});

// ── embed-1792261973710 (2026-10-17) ─────────────────────────────────────────

test('Ink turn-end timeout: 3000 ms for a bilingual session (decided 2026-10-17), 5600 ms otherwise (merge 2026-10-27)', () => {
  // The hook no longer carries a hardcoded value: the wiring layer passes
  // inkTurnEndTimeoutMs(tutorLanguages) and the hook's default is the
  // English-only value. test:partner-session-options pins the numbers.
  const hook = readFileSync('src/app/tutor/hooks/useCartesiaInkWS.ts', 'utf8');
  assert.ok(!hook.includes('NEXT_PUBLIC_TUTOR_INK_TURN_END_TIMEOUT_MS, 3000)'));
  assert.ok(!hook.includes('NEXT_PUBLIC_TUTOR_INK_TURN_END_TIMEOUT_MS, 5600)'));
  assert.ok(hook.includes('const ENV_TURN_END_TIMEOUT_MS = inkTurnEndTimeoutMs(undefined);'));
  assert.equal(inkTurnEndTimeoutMs(['en', 'ja'], undefined), 3000);
  assert.equal(inkTurnEndTimeoutMs(undefined, undefined), 5600);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('turnEndTimeoutMs: inkTurnEndTimeoutMs(tutorLanguages),'));
});

test('Japanese affirmations read as affirmations: the question pin clears (seq 3, 01:12)', () => {
  const praise = 'なるほど。 "I played golf with my friend." ちゃんと答えられていますね。 前置詞の"with"を使って、一緒にいた人を言えましたね。';
  const read = readPacingVerdict(praise, { studentText: 'えっとはい。えー、with my friend' });
  assert.equal(read.isAffirm, true);
  assert.equal(read.isCorrection, false);
  const transcript = [
    { id: 'q', role: 'tutor', text: 'では、もう一つ聞きますね。 英語で。 "Who did you play golf with?"' },
    { id: 's', role: 'student', text: 'えっとはい。えー、with my friend' },
    { id: 'a', role: 'tutor', text: praise },
  ];
  assert.deepEqual(shouldClearQpinOnAnswer(transcript, 'q'), { clear: true, reason: 'answered' });
  // The Nagoya turn: praise first, the rejection two sentences later.
  const nagoya = 'I went to Nagoya last week. とてもいい文ですね。 "went" を正しく使えていますね。 でも、今回の問題は「岐阜」でした。 もう一度、"Gifu" を使って言ってみてください。';
  assert.equal(readPacingVerdict(nagoya).isAffirm, true);
  for (const t of ['"I went to Gifu last week." 完璧です。', '正解です。', 'はい、その通りです。', 'ばっちり使えましたね。', '合っていますよ。']) assert.equal(readPacingVerdict(t).isAffirm, true, t);
  // An acknowledgement of the move, an interjection, a correction: not affirmations.
  const ack = readPacingVerdict('いい質問ですね。 "went" は "go" の過去形です。');
  assert.equal(ack.isAffirm, false); assert.equal(ack.ackOpener, true);
  assert.equal(readPacingVerdict('なるほど。 では、次に進みましょう。').isAffirm, false);
  const miss = readPacingVerdict('惜しい！ "go" ではなく "went" です。');
  assert.equal(miss.isAffirm, false); assert.equal(miss.isCorrection, true);
});

test('Japanese verdict openers for the before-display check (deny / affirm)', () => {
  for (const t of ['惜しい！ もう一度。', 'ちょっと違いますね。', 'うーん、そうではなくて、', '正しくは "went" です。', '近いですが、少し違います。']) assert.equal(opensWithDenial(t), true, t);
  for (const t of ['"I went to Gifu last week." 完璧です。', '正解です！', 'ちゃんと言えましたね。', 'はい、合っています。']) assert.equal(opensWithAffirmingVerdict(t), true, t);
  for (const t of ['では、次の文です。', 'いい質問ですね。', '"I go to Tokyo two years ago" ですね。', 'でも、今回の問題は「岐阜」でした。']) {
    assert.equal(opensWithDenial(t), false, t);
    assert.equal(opensWithAffirmingVerdict(t), false, t);
  }
});

test("a quote the splitter cut open is not a denial; a closed quote's tail is the verdict (seq 17, 10:57 false kill)", () => {
  const said = "No, I haven't. But I want to go.";
  assert.equal(sentenceVerdictStance('"No, I haven\'t.', said), null);
  assert.equal(sentenceVerdictStance('"No, I haven\'t. But I want to go." 完璧な返事です。', said), 'affirm');
  assert.equal(sentenceVerdictStance('「No, I haven\'t. But I want to go.」 正解です。', said), 'affirm');
  assert.equal(sentenceVerdictStance('"I go to Tokyo two years ago" ですね。', 'I go to Tokyo 2 years ago'), null);
  assert.equal(sentenceVerdictStance("No, Ihaven'thaveyou — No, I haven't.", "No , Ihaven ' thaveyou ."), null);
  assert.equal(sentenceVerdictStance('Not quite — try the past tense.', 'I go to Tokyo'), 'deny');
});

test('learner-address: 学生 / "the student" said to the student gets the note; compounds do not', () => {
  for (const t of ['学生が言った内容を確認しますね。', 'ゴルフでもカラオケでも何でもいいので、学生自身の質問を一つ作ってみてください。', '今度は学生の番です。', 'Now the student will try one.']) assert.equal(refersToLearnerInThirdPerson(t), true, t);
  for (const t of ['留学生の友達はいますか。', '大学生のとき、京都に行きました。', '学生時代は何をしていましたか。', '学生証を見せてください。', 'あなたの番です。', 'Students often mix these up.']) assert.equal(refersToLearnerInThirdPerson(t), false, t);
  assert.ok(LEARNER_ADDRESS_NOTE.includes('あなた'));
  const clause = buildBilingualClause(['en', 'ja']) ?? '';
  assert.ok(clause.includes('Speak TO the student, never about them'));
});

test('praise-variety: 完璧 in 3 of the last 4 turns (latest included) plants the note', () => {
  const perfect = '"Have you ever been to Canada?" 完璧です。 三つとも全部正解できましたね。';
  const plain = '"When did you go?" これは「いつ行きましたか」という意味です。';
  assert.equal(overusesSuperlative([perfect, plain, perfect, perfect]), true);
  assert.equal(overusesSuperlative([plain, perfect, perfect, perfect]), true);
  assert.equal(overusesSuperlative([perfect, perfect, plain, plain]), false);
  assert.equal(overusesSuperlative([perfect, perfect, perfect, plain]), false, 'latest turn has none');
  assert.equal(overusesSuperlative([perfect, perfect]), false, 'too few turns');
  assert.equal(hasSuperlativePraise('Perfect! That is exactly it.'), true);
  assert.equal(hasSuperlativePraise('いいですね。 "went" が使えました。'), false);
  assert.ok(PRAISE_VARIETY_NOTE.includes('完璧'));
});

test('correct-retry: a checked-correct answer asked for again plants the note (seq 14, Nagoya → Gifu)', () => {
  const pc = { answers: 'open_question', target: 'the sentence about last week', proposed: 'I went to Nagoya last week.', verdict: 'correct', confidence: 'high' } as const;
  const reply = 'I went to Nagoya last week. とてもいい文ですね。 でも、今回の問題は「岐阜」でした。 もう一度、"Gifu" を使って言ってみてください。';
  assert.equal(reAskedCheckedCorrect(pc, reply), true);
  assert.equal(reAskedCheckedCorrect({ ...pc, answers: 'overall_problem' }, reply), true);
  assert.equal(reAskedCheckedCorrect({ ...pc, answers: 'other_part' }, reply), false);
  assert.equal(reAskedCheckedCorrect({ ...pc, answers: 'neither', verdict: 'cannot_determine' }, reply), false);
  assert.equal(reAskedCheckedCorrect({ ...pc, verdict: 'incorrect' }, reply), false, 'a wrong answer may be re-asked');
  assert.equal(reAskedCheckedCorrect(pc, 'I went to Nagoya last week. 完璧です。 では、三番目の文です。'), false, 'no retry ask');
  assert.equal(reAskedCheckedCorrect(null, reply), false);
  assert.ok(CORRECT_RETRY_NOTE.includes('do not ask for it again'));
  // Task 15 §C (GDI run 5): the note tells a rejected answer from a plain repeat drill.
  assert.equal(CORRECT_RETRY_NOTE, "[runtime note — not from the student] An independent check found the student's previous answer CORRECT for the task as you stated it aloud, yet your last turn asked them to say it again or to use a different word. The task is what you SAID, not the example on the card. In this turn: if your last turn said the answer was wrong or asked for a different word, say in one short clause that their earlier sentence was right too; if it only asked them to say it again, accept what they say now in one short clause and do not mention the repeat. Either way do not ask for it again — move to the next item. Apply this silently; never mention this note.");
  assert.ok(!CORRECT_RETRY_NOTE.includes('whatever they say now, tell them plainly'));
});

test('lesson close → quiet auto-end: 45 s, deferred while busy, re-armed by a post-close turn', () => {
  assert.equal(LESSON_CLOSE_AUTO_END_MS, 45_000);
  assert.equal(decideLessonCloseAutoEnd({ busy: true, elapsedMs: 120_000 }), 'recheck');
  assert.equal(decideLessonCloseAutoEnd({ busy: false, elapsedMs: 44_000 }), 'recheck');
  assert.equal(decideLessonCloseAutoEnd({ busy: false, elapsedMs: 45_000 }), 'end');
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.equal(vtr.split('armLessonCloseAutoEndRef.current();').length - 1, 3, 'armed at both close sites and on a post-close student turn (the fixed-script forced close ends through the farewell path instead)');
  assert.ok(vtr.includes("onDebugEvent?.('lesson_closed_auto_end'"));
  // Per partner since the 2026-10-27 merge (partner-session-options.ts,
  // default on): the prop sits beside the build-time kill switch.
  assert.ok(vtr.includes("if (!TUTOR_LESSON_CLOSE_AUTO_END || !lessonCloseAutoEnd || sessionMode === 'text') return;"));
  assert.ok(vtr.includes('void endSessionNowRef.current();\n    };\n    lessonCloseAutoEndTimerRef.current = setTimeout(check, LESSON_CLOSE_AUTO_END_MS);'));
  assert.equal(TUTOR_LESSON_CLOSE_AUTO_END, true, 'default ON');
});

test('the three new notes are planted after the turn, consumed with the next, and persisted', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  for (const ev of ['learner_address_note_planted', 'praise_variety_note_planted', 'correct_retry_note_planted', 'learner_address_note_consumed', 'praise_variety_note_consumed', 'correct_retry_note_consumed']) assert.ok(vtr.includes(`'${ev}'`), ev);
  assert.ok(vtr.includes('reAskedCheckedCorrect(verdictPrecheckRef.current, fullText)'));
  const embed = readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8');
  for (const p of ["'learner_address'", "'praise_variety'", "'correct_retry'", "'lesson_closed'"]) assert.ok(embed.includes(p), p);
});

test('embed-1792266148587: repeat requests get no English-reply note; transitions stay in the session language; praise note goes sticky', () => {
  for (const t of ['すいません。もう一度お願いします', 'はい、もう一度言います', 'Can you say that again?', 'One more time please']) assert.equal(isStudentRepeatRequest(t), true, t);
  for (const t of ['えっと、海外に行ったことがありますか?', 'はい、ハワイに行きました。じゃなくて、英語で']) assert.equal(isStudentRepeatRequest(t), false, t);
  assert.ok(NO_ENGLISH_REPLY_NOTE.includes('do not say the item or the exercise is finished'));
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('transcript.trim().length >= 2 && !isStudentRepeatRequest(transcript)'), 'a bare はい after an English ask gets the note (embed-1792276942766 15:04)');
  assert.ok(vtr.includes('Say any transition sentence in the language you are using with this student'));
  assert.equal(PRAISE_STICKY_AFTER_PLANTS, 2);
  assert.ok(vtr.includes('praiseNoteIsSticky(praiseStickyArgs)'));
  const clause = buildBilingualClause(['en', 'ja']) ?? '';
  assert.ok(clause.includes('「ここまでのポイント」'));
});

test('embed-1792276942766: readiness checks, pronunciation claims and wait requests get their notes', () => {
  for (const t of ['では次に、今日の二つ目の形を練習しましょうね。 準備はいいですか。', 'Shall we start?', 'Are you ready?']) assert.equal(asksReadiness(t), true, t);
  for (const t of ['では聞きますね。 Have you ever been to Okinawa?', '準備ができたら教えてくださいと言われました。']) assert.equal(asksReadiness(t), false, t);
  const student = 'I went the rest week';
  for (const t of ['「last week」と言いたかったんだと思いますが、「last」の音が少し変わってしまいましたね。', '「ear」ではなく「ever」の音でしたが、ちゃんと形になっていました。', 'It sounded like "rest" — try "last".']) assert.equal(claimsPronunciation(t, student), true, t);
  assert.equal(claimsPronunciation('カラオケは英語でも "karaoke" と言いますよ、発音は少し違いますが、そのまま通じます。', 'すみません、カラオケはカタカナで書きますよね。英語ではどう言いますか?'), false, 'the student asked');
  assert.equal(claimsPronunciation('I went last week、今度はしっかり言えましたね。', student), false);
  assert.deepEqual(detectHoldRequest('はい、どう、ちょっと待ってください。'), { hold: true, soft: true });
  assert.deepEqual(detectHoldRequest('Okay, can you just wait for a second?'), { hold: true, soft: true });
  assert.equal(detectHoldRequest('待ってました、この問題。').hold, false);
  assert.ok(WAIT_REQUEST_NOTE.includes('ONE short sentence'));
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  for (const ev of ['readiness_ask_note_planted', 'pronunciation_claim_note_planted', 'wait_request_note_consumed']) assert.ok(vtr.includes(`'${ev}'`), ev);
  assert.ok(vtr.includes('if (holdReq.soft) pendingWaitNoteRef.current = WAIT_REQUEST_NOTE;'));
  const embed = readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8');
  for (const p of ["'readiness_ask'", "'pronunciation_claim'", "'wait_request'"]) assert.ok(embed.includes(p), p);
});

// ── 2026-10-18 round (GDI embed-1792338502233): turn length, praise openers,
// own-sentence re-ask, unreadable words, recap cap ───────────────────────────

test('turn cap: language lessons cap at 5 sentences / 70 words; voice-only drops the tool exemption', () => {
  const defaults = { hardSentences: 8, words: 110, softSentences: 4 };
  const maths = turnCapPolicy({ languageLesson: false, voiceOnly: false, defaults });
  assert.deepEqual(maths, { hardSentences: 8, words: 110, softSentences: 4, toolTurnsExempt: true });
  const lang = turnCapPolicy({ languageLesson: true, voiceOnly: false, defaults });
  assert.equal(lang.hardSentences, 5); assert.equal(lang.softSentences, 3); assert.equal(lang.toolTurnsExempt, true);
  const langVoice = turnCapPolicy({ languageLesson: true, voiceOnly: true, defaults });
  assert.equal(langVoice.toolTurnsExempt, false);
  // the live turns: 9 sentences, no tools → hit under both; 10 sentences + show_problem in voice-only → hit only there
  assert.equal(turnCapHit({ sentences: 9, words: 90, toolCalls: 0 }, maths), 'sentences');
  assert.equal(turnCapHit({ sentences: 10, words: 95, toolCalls: 1 }, lang), null);
  assert.equal(turnCapHit({ sentences: 10, words: 95, toolCalls: 1 }, langVoice), 'sentences');
  assert.equal(turnCapHit({ sentences: 3, words: 40, toolCalls: 0 }, lang), null);
  assert.equal(turnCapHit({ sentences: 4, words: 80, toolCalls: 0 }, lang), 'words');
  assert.equal(CADENCE_STICKY_AFTER_PLANTS, 2);
});

test('cadence note: names the overrun, the soft cap, voice-only hand-back; the sticky re-plant is a standing rule', () => {
  const lang = turnCapPolicy({ languageLesson: true, voiceOnly: true, defaults: { hardSentences: 8, words: 110, softSentences: 4 } });
  const n = cadenceNote('sentences', { sentences: 9, words: 90 }, lang, { voiceOnly: true, sticky: false });
  assert.match(n, /^\[cadence note — not from the student\]/);
  assert.match(n, /ran 9 spoken sentences/); assert.match(n, /at most 3 sentences/); assert.match(n, /cannot see the board/);
  assert.doesNotMatch(n, /anchor what you are saying on the board/);
  const standing = cadenceNote(null, { sentences: 2, words: 20 }, lang, { voiceOnly: false, sticky: true });
  assert.match(standing, /Standing rule/); assert.doesNotMatch(standing, /ran 2/);
  assert.match(cadenceNote('words', { sentences: 4, words: 80 }, lang, { voiceOnly: false, sticky: true }), /applies to every turn from now on/);
});

test('praise opener: Nice / いいですね / 正解です openers count, mid-sentence praise does not', () => {
  assert.equal(opensWithStockPraise('Nice. 言ってみましょう。'), true);
  assert.equal(opensWithStockPraise('いいですね、ちゃんと言えましたね。'), true);
  assert.equal(opensWithStockPraise('正解です。「play」が「played」に変わるところ、きちんとできていますね。'), true);
  assert.equal(opensWithStockPraise('I went to Gifu last week. — 完璧ですね。'), false);
  assert.equal(opensWithStockPraise('先週は名古屋城に行ったんですね。'), false);
  assert.equal(opensWithStockPraise('はい、お待ちしますね。'), false);
  const nice = 'Nice. 言ってみましょう。'; const plain = 'I see. 「I went alone」—それが答えですね。';
  assert.equal(overusesStockPraiseOpener([nice, plain, nice, nice]), true);
  assert.equal(overusesStockPraiseOpener([nice, nice, nice, plain]), false, 'latest turn must be one');
  assert.equal(overusesStockPraiseOpener([plain, plain, nice, nice]), false);
  assert.match(PRAISE_OPENER_NOTE, /do not open with a praise word/);
});

test('GDI run 3: a re-ask of the model sentence the student just said correctly', () => {
  const prev = 'Good. Now the past simple: "Last month, I sold 25 machines to Toyota." Please say that sentence.';
  const student = 'Last month I sold 25 machines to Toyota.';
  const attempt = 'Good effort. Could you say the whole sentence once more, starting with "Last month"?';
  assert.equal(reAskedModelSentence(prev, student, attempt), 'Last month, I sold 25 machines to Toyota.');
  // unquoted model sentence works too
  assert.equal(reAskedModelSentence('Try this one. Last month, I sold 25 machines to Toyota.', student, attempt), 'Last month, I sold 25 machines to Toyota.');
  // a student sentence missing a token is not a match
  assert.equal(saidModelSentence('Last month, I sold 25 machines to Toyota.', 'Last month I sold machines to Toyota.'), false);
  assert.equal(reAskedModelSentence(prev, 'Last month I sold machines to Toyota.', attempt), null);
  // no "once more"/"again" ask ⇒ not a re-ask
  assert.equal(reAskedModelSentence(prev, student, 'Perfect. Next, tell me about last week.'), null);
  // a filler riding along still matches; a much longer different sentence does not
  assert.equal(saidModelSentence('Last month, I sold 25 machines to Toyota.', 'Yes, last month I sold 25 machines to Toyota.'), true);
  assert.equal(saidModelSentence('I sold machines', 'Last month I sold 25 machines to Toyota and Honda.'), false);
  // fix round 1 (I-2): strict on the model's tokens — the missing "have" is the error being corrected
  assert.equal(saidModelSentence('I have worked for my current company for five years.', 'I worked for my current company for five years.'), false);
  assert.equal(saidModelSentence('I have worked for my current company for five years.', 'I have worked for my current company for five years.'), true);
  // multiplicity: "for … for" needs two
  assert.equal(saidModelSentence('I have worked for my company for five years.', 'I have worked at my company for five years.'), false);
  // apostrophes ignored
  assert.equal(saidModelSentence("I haven't taken leave from work.", 'I havent taken leave from work'), true);
  // fix round 1 (I-3): a re-ask must be for the SAME sentence
  assert.equal(reAskedModelSentence(prev, student, "Good. Now try again with a new one: 'Last week I visited Osaka.'"), null);
  assert.equal(reAskedModelSentence(prev, student, 'Perfect! Let\'s try again with a new one: "Last week, I met a customer." Please say it.'), null);
  assert.equal(reAskedModelSentence(prev, student, '完璧です。では、もう一度新しい文で練習しましょう。'), null, 'no reference to the same sentence');
  assert.equal(reAskedModelSentence(prev, student, 'Nice. Say "I sold 25 machines" once more for me.'), 'Last month, I sold 25 machines to Toyota.', 'quotes ≥ 3 words of the model');
  assert.equal(reAskedModelSentence(prev, student, 'Good. もう一度、その文を言ってください。'), 'Last month, I sold 25 machines to Toyota.', 'その文');
  assert.equal(reAskedModelSentence(prev, student, 'Can you say that sentence again, then "Next week I will visit Honda"?'), null, 'another quoted sentence ⇒ new item');
  assert.match(REPEAT_AFTER_CORRECT_REASON, /^The student just said that sentence correctly\. Confirm it in one short sentence and move to the next item; do not ask for it again\. Say that it is right and go on; do not explain how you judged it \(no talk of stutters, repeats, matching the model, or what counts\)\. Start directly with your reply — no opener such as Okay \/ Alright \/ Let's keep going \/ Sorry about that\. Apply this silently; never mention this note\.$/);
});

test('GDI run 3: VTR kills + retries a repeat_after_correct in a language session only', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.match(vtr, /!repeatAfterCorrectRejected && attemptText && languageSessionRef\.current/);
  assert.match(vtr, /rejectionsThisAttempt\.push\(\{ action: 'repeat_after_correct', reason: REPEAT_AFTER_CORRECT_REASON \}\);\s*await performKill\(\);/);
  // the note path stays for every session
  assert.match(vtr, /else if \(reAskedOwnSentence\(transcript, fullText, \{ studentCorrect: precheckCorrectness\(verdictPrecheckRef\.current\?\.verdict\) \}\)\) \{\s*pendingCorrectRetryNoteRef\.current = OWN_SENTENCE_RETRY_NOTE;/);
});

test('Task 19 §C (GDI run 7): a turn carrying a measured pronunciation note is not killed for repeat_after_correct', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  // the measured case is checked BEFORE the kill branch and never reaches it
  assert.match(vtr, /if \(repeated && pronunciationMeasuredThisTurn\) \{\s*repeatAfterCorrectRejected = true;\s*onDebugEvent\?\.\('repeat_after_correct_allowed', 'measured'\);\s*\} else if \(repeated && racSkip\) \{[\s\S]{0,200}?\} else if \(repeated\) \{\s*repeatAfterCorrectRejected = true;\s*rejectionsThisAttempt\.push\(\{ action: 'repeat_after_correct'/);
  // the flag is set only from the consumed measured note
  assert.match(vtr, /runTranscript = `\$\{pronunciationResultNoteRef\.current\}\\n\\n\$\{runTranscript\}`;\s*pronunciationMeasuredThisTurn = pronunciationMeasuredRef\.current;/);
});

test('own-sentence re-ask: a repeat-ask quoting the sentence the student just said', () => {
  const student = 'I went to the office yesterday .';
  assert.equal(reAskedOwnSentence(student, 'Nice. 言ってみましょう。 I went to the office yesterday. — 完璧です。'), true);
  assert.equal(reAskedOwnSentence(student, 'I went to the office yesterday. — 完璧です。 では次です。'), false, 'no repeat-ask');
  assert.equal(reAskedOwnSentence(student, '言ってみましょう。 I went to the office last week.'), false, 'different sentence');
  assert.equal(reAskedOwnSentence('Yes', '言ってみましょう。Yes, I have.'), false, 'too short to count');
  assert.match(OWN_SENTENCE_RETRY_NOTE, /JUST said/);
});

test('Task 14 §D: fillers and stutter repeats are ignored when comparing the student\'s sentence', () => {
  assert.equal(cleanStudentSentence('I showed the customer uh models of washing machines.'), 'i showed the customer models of washing machines');
  assert.equal(cleanStudentSentence('My department, my department sells washing machines.'), 'my department sells washing machines');
  assert.equal(cleanStudentSentence('えっと、 I um sold, er, sold twenty machines.'), 'i sold twenty machines');
  assert.deepEqual(dropFillersAndRepeats(['to', 'um', 'to', 'think']), ['to', 'think']);
  // live run 4: the tutor quotes the student's own (filler-free) sentence and asks for it once more ⇒ re-ask
  const live = 'Models of washing machines, ですね。 That\'s clear. Let\'s make it a clean sentence: "I showed the customer models of washing machines." Can you say that once more?';
  assert.equal(reAskedOwnSentence('I showed the customer uh models of washing machines.', live), true);
  // live run 4: the tutor's clean sentence differs (a shorter correction) ⇒ NOT a re-ask
  const student2 = 'My role in that project was uh, to um, to think of uh, good discount options.';
  const tutor2 = 'Good. Let\'s make it a clean sentence: "My role was to think of good discount options." Can you say that once more?';
  assert.equal(reAskedOwnSentence(student2, tutor2), false);
  assert.equal(reAskedModelSentence('Say this: "My role was to think of good discount options."', student2, 'Can you say that sentence once more?'), null);
  // the model path also ignores fillers
  assert.equal(saidModelSentence('Last month, I sold 25 machines to Toyota.', 'Last month, uh, I sold, um, 25 machines to to Toyota.'), true);
  // "like" is dropped on both sides, so a sentence with the verb "like" still compares
  assert.equal(reAskedOwnSentence('I like my new job a lot.', 'Nice: "I like my new job a lot." Can you say that again?'), true);
  // an "again" that is not a say-again ask is not a re-ask
  assert.equal(reAskedOwnSentence('I went to Osaka last week.', '"I went to Osaka last week." Great! Let\'s practise again with a new verb.'), false);
});

test('unreadable word: "thef" is named; sound-alikes, plan names and dictionary words are not', () => {
  const plan = latinWords('I went to Gifu last week. Have you ever been to Nagoya Castle? karaoke');
  const tutor = latinWords('「先週岐阜に行きました。」 を英語で言ってみてください。');
  assert.deepEqual(findUnreadableWords('I went thef last week .', [...plan, ...tutor]), ['thef']);
  assert.deepEqual(findUnreadableWords('I went to Nagoya , castle reast week .', plan), [], 'reast ~ last, names from the plan');
  assert.deepEqual(findUnreadableWords('Have you ever been to canada ?', latinWords('Have you ever been to Canada?')), []);
  assert.deepEqual(findUnreadableWords('I played golf yesterday .', []), []);
  assert.deepEqual(findUnreadableWords('I want to go to tokioto .', latinWords('Kyoto')), ['tokioto']);
  assert.deepEqual(findUnreadableWords('のI haven \'t', []), [], 'clipped ending is a word');
  assert.deepEqual(findUnreadableWords('はい、ハワイに行きました。', []), [], 'no Latin');
  const note = unreadableWordNote(['thef']);
  assert.match(note, /"thef"/); assert.match(note, /ask the student to say just that word once more/); assert.match(note, /do not turn it into a place/);
});

test('language clause: one mid-lesson recap at most, at a segment end', () => {
  const c = buildBilingualClause(['en', 'ja'])!;
  assert.match(c, /a mid-lesson recap happens at most once per lesson, when a segment ends, in two sentences at most/);
});

test('embed persists the new debug families (opener_prefetch, unreadable_word; ink_ covers the stale final)', () => {
  const embed = readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8');
  for (const p of ["'opener_prefetch'", "'unreadable_word'", "'ink_'"]) assert.ok(embed.includes(p), p);
});

// ── 2026-10-18 round 2 (GDI embed-1792346446334): language drift, re-asked
// questions, run-together proper nouns, late tails ─────────────────────────

test('english instruction sentences: Now let\'s… / ask me back / That\'s exactly… are caught; target phrases and questions are not', () => {
  assert.deepEqual(englishInstructionSentences('"No, I haven\'t." That\'s exactly right for Canada, and nice detail adding Hawaii. Now let\'s move to today\'s main practice. 一番目、「昨日ゴルフをしました」を英語で言ってみてください。'),
    ["That's exactly right for Canada, and nice detail adding Hawaii.", "Now let's move to today's main practice."]);
  assert.deepEqual(englishInstructionSentences('No, I haven\'t. カヤックはまだなんですね。 Have you — ask me back, with "ever" in there.'), ['Have you — ask me back, with "ever" in there.']);
  assert.deepEqual(englishInstructionSentences('では一つ聞いてみますね。 Have you ever eaten sushi? 答えてみてください。'), [], 'a question for the student is a target');
  assert.deepEqual(englishInstructionSentences('「I went to karaoke last weekend.」と言ってみてください。'), [], 'quoted model sentence');
  assert.deepEqual(englishInstructionSentences('Yes, I have. I ate sushi last weekend.'), [], 'the tutor answering in English is modelling');
  assert.match(ENGLISH_INSTRUCTION_NOTE, /English is only for the target phrases/);
});

test('romaji: "Last week ni Kyoto ni itta koto arimasu ka?" is caught; English with "no"/"to" is not', () => {
  assert.deepEqual(romajiSentences('That sushi question\'s answered twice now — let\'s move forward. Last week ni Kyoto ni itta koto arimasu ka? Have you ever been to Kyoto?'),
    ['Last week ni Kyoto ni itta koto arimasu ka?']);
  assert.deepEqual(romajiSentences('I went to Nagoya Castle last week. No, I haven\'t.'), []);
  assert.deepEqual(romajiSentences('京都に行ったことがありますか。'), []);
  assert.deepEqual(romajiSentences('Ii desu ne. Sugoi desu.'), ['Ii desu ne.', 'Sugoi desu.']);
  assert.match(ROMAJI_NOTE, /romaji/); assert.match(LANGUAGE_KEEP_NOTE, /never change the language you speak/);
});

test('re-asked answered question: the sushi loop, with and without ", too"; a new question is fine', () => {
  const prev = 'では一つ聞いてみますね。 Have you ever eaten sushi? 答えてみてください。';
  assert.equal(reAskedAnsweredQuestion(prev, 'もちろんあります。Yes , Ihave 。', '"Yes, I have." が答えられていますね。 では、Have you ever eaten sushi?'), 'have you ever eaten sushi');
  assert.equal(reAskedAnsweredQuestion('Yes, I have. I ate sushi last weekend. Have you ever eaten sushi?', 'Yes , Ihave . Have you ever ten sushi 2?', '"I ate sushi last weekend" — solid. Have you ever eaten sushi, too?'), 'have you ever eaten sushi');
  assert.equal(reAskedAnsweredQuestion(prev, 'Yes, I have.', 'いいですね。 Have you ever been to Okinawa?'), null, 'different question');
  assert.equal(reAskedAnsweredQuestion(prev, 'えっと', 'Have you ever eaten sushi?'), null, 'no answer between');
  assert.deepEqual(englishQuestions('Have you ever eaten sushi, too? 答えてみてください。 Who did you play golf with?'), ['have you ever eaten sushi', 'who did you play golf with']);
  assert.match(REASKED_QUESTION_NOTE, /also when the student asks it back/);
});

test('own-sentence re-ask now counts a three-word answer', () => {
  assert.equal(reAskedOwnSentence('Yes , I have .', 'いいですね。もう一度言ってみてください。 Yes, I have.'), true);
});

test('unreadable word: a run-together with a plan name ("toNagoya") is readable; "thef" still is not', () => {
  const plan = latinWords('I went to Gifu last week. Have you ever been to Nagoya Castle?');
  assert.deepEqual(findUnreadableWords('でも先週は名古屋城に行ったんです。I went toNagoya Castle last week .', plan), []);
  assert.deepEqual(findUnreadableWords('I went thef last week .', plan), ['thef']);
  assert.deepEqual(findUnreadableWords('I went to karaoke no strid end', latinWords('I went to karaoke last weekend.')), ['strid'], 'a lost word stays flagged');
});

test('late tail: a short continuation seconds into the tutor\'s turn is held; a question or a real new turn is not', () => {
  assert.equal(isLateTail({ verdict: 'continuation', prodState: 'speaking', tutorTurnMs: 1900, text: 'ハネムーンで行きました。' }), true);
  assert.equal(isLateTail({ verdict: 'continuation', prodState: 'speaking', tutorTurnMs: 1900, text: 'Have you ever been to Hawaii?' }), false, 'a question is a turn');
  assert.equal(isLateTail({ verdict: 'new_turn', prodState: 'speaking', tutorTurnMs: 1900, text: 'ハネムーンで行きました。' }), false);
  assert.equal(isLateTail({ verdict: 'continuation', prodState: 'speaking', tutorTurnMs: LATE_TAIL_MAX_TUTOR_TURN_MS + 1, text: 'ハネムーンで行きました。' }), false, 'too late to be a tail');
  assert.equal(isLateTail({ verdict: 'continuation', prodState: 'listening', tutorTurnMs: 0, text: 'ハネムーンで行きました。' }), false);
  assert.equal(isLateTail({ verdict: 'continuation', prodState: 'speaking', tutorTurnMs: 1000, text: 'I played golf yesterday and then I went to Nagoya Castle with my friend and we ate sushi there' }), false, 'too long');
  assert.match(lateTailNote('ハネムーンで行きました。'), /do not repeat your previous instruction/);
});


// ── 2026-10-18 round after embed-1792350642171 (Kenji v4) ─────────────────

test('tool markup: a tool call written as text is removed across sentences; prose before and after survives', () => {
  const f = new ToolMarkupFilter();
  let r = f.filter('はい、わかりました。<function_calls><function_invoke name="close_session_notes">');
  assert.equal(r.text, 'はい、わかりました。'); assert.equal(r.stripped, true); assert.equal(f.open, true);
  r = f.filter('<parameter name="reason">student said goodbye</parameter>');
  assert.equal(r.text, ''); assert.equal(r.stripped, true); assert.equal(f.open, true);
  r = f.filter('</function_invoke></function_calls>またね。');
  assert.equal(r.text, 'またね。'); assert.equal(r.stripped, true); assert.equal(f.open, false);
  r = f.filter('今日はここまでです。');
  assert.equal(r.text, '今日はここまでです。'); assert.equal(r.stripped, false);
});

test('tool markup: prefixed and bare invoke/parameter forms; a stray closing tag alone', () => {
  const pfx = 'antml:';
  assert.equal(stripToolMarkup(`OK. <function_calls><invoke name="mark_segment_complete"><parameter name="segmentId">hook</${pfx}parameter></${pfx}invoke></${pfx}function_calls> Next.`).text, 'OK. Next.');
  assert.equal(stripToolMarkup(`<${pfx}function_calls><${pfx}invoke name="x"><${pfx}parameter name="y">1</${pfx}parameter></${pfx}invoke></${pfx}function_calls>`).text, '');
  const r = stripToolMarkup('Sure. </parameter></invoke>');
  assert.equal(r.text, 'Sure.'); assert.equal(r.stripped, true);
  assert.equal(hasToolMarkup('<parameter name="x">1</parameter>'), true);
});

test('tool markup: inequalities, LaTeX and other tags are untouched', () => {
  for (const s of ['3<n and n>10', 'a<b and c>d', '$x < 5$ and $y > 2$', '<result>42</result>', 'Type <b>bold</b> here', 'いいですね。']) {
    const r = stripToolMarkup(s);
    assert.equal(r.text, s, s); assert.equal(r.stripped, false, s);
  }
  assert.equal(hasToolMarkup('3<n and n>10'), false);
});

test('output budget: a plain language voice turn is capped; the opener, a directive, a close, a recap turn and text sessions are not', () => {
  const base = { languageLesson: true, voice: true, needsHeadroom: false, cap: LANGUAGE_TURN_MAX_TOKENS_DEFAULT };
  // 2026-10-18 (embed-1792363895174): 9-sentence turns passed at out=216 — short
  // Japanese sentences are cheap, so 320 bounded words, not sentences. 220 now
  // that a cut tool call is finished by a continuation call (settleCutToolUse).
  assert.equal(LANGUAGE_TURN_MAX_TOKENS_DEFAULT, 220);
  assert.equal(TUTOR_LANGUAGE_TURN_MAX_TOKENS, 220, 'flags.ts default follows (env unset in this run)');
  assert.equal(languageTurnMaxTokens(base), 220);
  assert.equal(languageTurnMaxTokens({ ...base, cap: 260 }), 260);
  assert.equal(languageTurnMaxTokens({ ...base, needsHeadroom: true }), undefined, 'tool-carrying turn keeps the normal cap');
  assert.equal(languageTurnMaxTokens({ ...base, voice: false }), undefined, 'text session');
  assert.equal(languageTurnMaxTokens({ ...base, languageLesson: false }), undefined, 'maths lesson');
  assert.equal(languageTurnMaxTokens({ ...base, cap: null }), undefined, 'flag off');
  assert.match(outputBudgetNote(220), /220 tokens/);
  assert.match(outputBudgetNote(220), /roughly four short sentences/);
  assert.match(outputBudgetNote(220), /at most three sentences/);
  assert.match(outputBudgetNote(220), /never mention this note/);
});

test('output budget: on max_tokens the cut-off fragment is dropped, a complete last sentence is kept, and end_turn keeps everything', () => {
  assert.equal(settleHeldTail('そして次は、先週の', 'max_tokens'), 'drop');
  assert.equal(settleHeldTail('そして次は先週の話です。', 'max_tokens'), 'speak');
  assert.equal(settleHeldTail('「Have you ever been to Kyoto?」', 'max_tokens'), 'speak');
  assert.equal(settleHeldTail('そして次は、先週の', 'end_turn'), 'speak', 'a sentence without a full stop is still a sentence on a normal stop');
  assert.equal(settleHeldTail('', 'end_turn'), 'drop');
  assert.equal(endsSentence('Nice work!'), true);
  assert.equal(endsSentence('いいですね。」'), true);
  assert.equal(endsSentence('and then we'), false);
  // The streamed shape: three sentences, the model cut mid-fourth.
  const b = new SentenceBuffer();
  const spoken = [...b.push('いいですね。先週は名古屋城に行ったんですね。では次の質問です。Have you ever')];
  const fragment = b.flush();
  assert.equal(spoken.length, 3);
  assert.ok(fragment && !endsSentence(fragment));
  assert.equal(settleHeldTail(fragment!, 'max_tokens'), 'drop');
  assert.equal(settleHeldTail(fragment!, 'tool_use'), 'speak');
});

test('post-close gate: chatter and pleasantries are silenced; an explicit continue / question shape gets a turn', () => {
  for (const s of ['ありがとうございました', 'はい、さようなら', "I'm sorry, I couldn't pull the report.", 'Sorry, I could not find the report.', 'What do you prefer?', 'Thank you so much.', 'Okay I will do that.', 'えーと、今日は楽しかったです。', 'また次回もお願いします']) {
    assert.equal(decidePostCloseUtterance(s), 'silence', s);
  }
  for (const s of ['すみません、もう一つ質問があります', 'ちょっと待ってください', '続けてもいいですか', 'kayaking は英語で何と言いますか', 'Can I ask one more question?', 'wait', 'Do you have homework for me?', 'What does kayaking mean?', '宿題はありますか']) {
    assert.equal(decidePostCloseUtterance(s), 'answer', s);
  }
  assert.equal(postCloseSilenceKind('ありがとうございました'), 'pleasantry');
  assert.equal(postCloseSilenceKind('Okay I will do that.'), 'chatter');
  assert.match(POST_CLOSE_NOTE, /close_session_notes/);
  assert.match(POST_CLOSE_NOTE, /one or two sentences/);
  // Task 30 fix round 4 R3-7b
  assert.ok(POST_CLOSE_NOTE.includes('Reply with one warm goodbye line; never say the lesson is closed, ended, or that you cannot continue.'));
  assert.ok(POST_CLOSE_NOTE.endsWith('Apply this silently; never mention this note.'));
});

test('unreadable word: a run-together with a NAME ("toNagoya", "inNagoya") and a mid-sentence capitalised name are never flagged; one note per word', () => {
  const ctx = latinWords('I went to Gifu last week.');
  assert.deepEqual(findUnreadableWords('先週 I went toNagoya Castle last week .', ctx), []);
  assert.deepEqual(findUnreadableWords('I stayed inNagoya .', ctx), []);
  assert.deepEqual(findUnreadableWords('I went to Nagoya with Mike .', ctx), [], 'names mid-sentence');
  assert.deepEqual(findUnreadableWords('I went thef last week .', ctx), ['thef'], 'a lost lower-case word is still flagged');
  assert.deepEqual(findUnreadableWords('Thef is my friend .', ctx), ['Thef'], 'a sentence-initial capital is checked as a word');
  assert.deepEqual(findUnreadableWords('I went thef last week .', ctx, { skip: ['thef'] }), [], 'already asked for once');
  assert.deepEqual(findUnreadableWords('I went thef and strid .', ctx, { skip: ['thef'] }), ['strid']);
});

test('own-sentence re-ask: quoting the student\'s correct sentence and then asking for the NEXT item is not a re-ask', () => {
  const said = 'I went to Nagoya Castle last week.';
  assert.equal(reAskedOwnSentence(said, '"I went to Nagoya Castle last week." いいですね。次は "Have you ever eaten sushi?" 言ってみてください。'), false);
  assert.equal(reAskedOwnSentence(said, 'いいですね。もう一度 "I went to Nagoya Castle last week." と言ってみてください。'), true, 'the same sentence asked for again');
  assert.equal(reAskedOwnSentence('I went to the office yesterday', 'Nice. 言ってみましょう。I went to the office yesterday. — 完璧です'), true, 'the original live shape still flags');
});

test('answered-question window: a question answered earlier in the lesson and asked again plants the note; the consecutive case is left to the older rule', () => {
  const answered = new Set<string>();
  recordAnsweredQuestions(answered, 'では、What did you do last weekend?', 'I played golf.');
  assert.ok(answered.has('what did you do last weekend'));
  recordAnsweredQuestions(answered, 'Have you ever eaten sushi?', 'えーと…');
  assert.equal(answered.has('have you ever eaten sushi'), false, 'a filler is not an answer');
  assert.equal(reAskedEarlierQuestion(answered, 'Have you ever been to Kyoto?', 'いいですね。What did you do last weekend?'), 'what did you do last weekend');
  assert.equal(reAskedEarlierQuestion(answered, 'What did you do last weekend?', 'もう一度。What did you do last weekend?'), null, 'consecutive re-ask belongs to reAskedAnsweredQuestion');
  assert.equal(reAskedEarlierQuestion(new Set(), 'x', 'What did you do last weekend?'), null);
  assert.match(REASKED_EARLIER_QUESTION_NOTE, /already answered earlier/);
});

test('already-answered complaint: 「それはもう答えましたよ」 / "I already said that" are read as a complaint, not an answer', () => {
  for (const s of ['それはもう答えましたよ', 'さっきも言いましたよ', 'さっき答えました', 'I already said that.', 'You asked me that already', '二回目ですね']) assert.equal(saysAlreadyAnswered(s), true, s);
  for (const s of ['はい、ゴルフをしました', 'もう一度お願いします', 'I went to Kyoto', 'もう終わりにします']) assert.equal(saysAlreadyAnswered(s), false, s);
  assert.match(ALREADY_ANSWERED_NOTE, /do not grade these words as a new answer/);
});

test('praise note: sticky after ONE plant in a language lesson, or after four superlative turns in any lesson', () => {
  assert.equal(praiseNoteIsSticky({ plants: 1, superlativeTurns: 0, languageLesson: true }), true);
  assert.equal(praiseNoteIsSticky({ plants: 1, superlativeTurns: 0, languageLesson: false }), false);
  assert.equal(praiseNoteIsSticky({ plants: 2, superlativeTurns: 0, languageLesson: false }), true);
  assert.equal(praiseNoteIsSticky({ plants: 0, superlativeTurns: PRAISE_SESSION_SUPERLATIVE_STICKY, languageLesson: false }), true);
  assert.equal(praiseNoteIsSticky({ plants: 0, superlativeTurns: 3, languageLesson: true }), false);
});

test('katakana from STT: a long katakana run in the STUDENT\'s transcript is English to be written in Latin letters; a loanword is not', () => {
  assert.equal(hasKatakanaEnglishFromStt('アイサンカロケラストウィーク'), true);
  assert.equal(hasKatakanaEnglishFromStt('アイ・ウェント・トゥ・キョウト'), true);
  assert.equal(hasKatakanaEnglishFromStt('カラオケをしたことがあります'), false);
  assert.equal(hasKatakanaEnglishFromStt('ハネムーンで行きました'), false);
  assert.match(KATAKANA_ECHO_NOTE, /Latin letters only/);
});


// ── 2026-10-18 round after embed-1792356364051 (Kenji v5, first full run) ──

test('katakana reading sentence (「アイ・プレイド・ゴルフ・イエスタデイ」) is dropped from speech; a loanword sentence is not; note sticky after 2 plants', () => {
  assert.equal(hasDottedKatakanaReading('一緒に言ってみましょう — 「アイ・プレイド・ゴルフ・イエスタデイ」。'), true);
  assert.equal(hasDottedKatakanaReading('英語では「I played golf yesterday.」と言いますよ。'), false);
  assert.equal(hasDottedKatakanaReading('カラオケに行きましたか?'), false);
  assert.equal(hasDottedKatakanaReading('コカ・コーラを飲みました。'), false, 'a one-dot loanword');
  assert.equal(KATAKANA_STICKY_AFTER_PLANTS, 2);
  assert.match(KATAKANA_ENGLISH_NOTE_STANDING, /Standing rule/);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("onDebugEvent?.('katakana_reading_dropped'"));
  assert.ok(vtr.includes('pendingKatakanaNoteRef.current = KATAKANA_ENGLISH_NOTE_STANDING;'));
});

test('a bare stock praise opener is recognised; feedback sentences and questions are not', () => {
  for (const s of ['いいですね!', 'いいですね、', 'Nice.', 'Great!', '正解です。', 'いいですね']) assert.equal(isStockPraiseOpenerOnly(s), true, s);
  for (const s of ['いいですね、同僚と!', 'Nice work on the past tense.', 'いいですか?', 'ゴルフをしましたね。', 'Nagoya が言えましたね。']) assert.equal(isStockPraiseOpenerOnly(s), false, s);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("onDebugEvent?.('stock_opener_dropped'"));
});

test('identical transcript after a correction (embed-1792356364051: "on Honey Moon" ×3) gets the identical-retry note', () => {
  assert.equal(isIdenticalTranscript('Yes , Ihave . I went there on Honey Moon .', 'Yes, I have. I went there on Honey Moon.'), true);
  assert.equal(isIdenticalTranscript('Yes, I have. I went there on my honeymoon.', 'Yes, I have. I went there on Honey Moon.'), false);
  assert.equal(isIdenticalTranscript('はい', 'はい'), false, 'too short to mean anything');
  assert.match(IDENTICAL_RETRY_NOTE, /Do not correct it again/);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("onDebugEvent?.('identical_retry_note'"));
});

test('Japanese verdict narration (「これは質問ですね — 答えではなく…」) is meta; ordinary Japanese is not', () => {
  assert.equal(isMetaNarration2('これは質問ですね — 答えではなく、もう一度同じ形を繰り返していますよ。'), true);
  assert.equal(isMetaNarration2('もう一度同じ形を繰り返していますよ。'), true);
  for (const s of ['これは過去分詞ですね。', 'それは質問の形です。使ってみましょう。', '質問ですね、いいですよ。', 'もう一度言ってみましょう。']) assert.equal(isMetaNarration2(s), false, s);
});

test('hold check-in line follows the session language; correction note never quotes garbled transcript', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("(tutorLanguages ?? []).includes('ja')\n              ? 'まだここにいますよ。準備ができたら、声をかけてくださいね。'"));
  const jn = readFileSync('src/lib/tutor/voice/judge-correction-note.ts', 'utf8');
  assert.ok(jn.includes('never quote that text back to them'));
});


test('unknown name (embed-1792361732296: "Terimachi" → 寺町): a capitalised name nobody has used gets the keep-as-spelled note; known places and names do not', () => {
  const ctx = latinWords('I went to Nagoya Castle last week. Have you ever been to Hawaii? Mike');
  assert.deepEqual(findUnknownNames('IwenttoTerimachi lastmonth .', ctx), ['Terimachi']);
  assert.deepEqual(findUnknownNames('I went to Torimachi last month.', ctx), ['Torimachi']);
  assert.deepEqual(findUnknownNames('I went to Nagoya with Mike.', ctx), [], 'both in context');
  assert.deepEqual(findUnknownNames('I went to Nagoy castle.', ctx), [], 'one edit from a context name');
  assert.deepEqual(findUnknownNames('Yesterday I played golf.', ctx), [], 'sentence-initial capital is a word');
  assert.deepEqual(findUnknownNames('I went to Torimachi.', ctx, { skip: ['torimachi'] }), [], 'one note per name');
  assert.match(unknownNameNote(['Terimachi']), /EXACTLY as spelled/);
  assert.match(unknownNameNote(['Terimachi']), /「Terimachi ですか？」/);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("onDebugEvent?.('unknown_name_note_planted'"));
});

test('English tails from embed-1792361732296: "Try saying it now." is an instruction; "That answers …" is verdict narration', () => {
  assert.deepEqual(englishInstructionSentences('もう一度言ってみましょう。 I tried some local fish, and it was delicious. Try saying it now.'), ['Try saying it now.']);
  assert.deepEqual(englishInstructionSentences('さようなら。Thanks for today — see you next time!'), ['Thanks for today — see you next time!']);
  assert.equal(isMetaNarration2('That answers "have you been there" — yes, they\'ve been.'), true);
  assert.equal(isMetaNarration2('That answers the question nicely: yes, you have.'), true);
});

test('cut tool call (embed-1792363895174 07:31: stop=max_tokens with blocks=[text,tool_use]): ONE continuation call finishes the tool; a malformed call on a normal stop is rejected', () => {
  const cut = { id: 'toolu_1', name: 'close_session_notes' };
  assert.equal(settleCutToolUse({ cut, stopReason: 'max_tokens', alreadyContinued: false }), 'continue');
  assert.equal(settleCutToolUse({ cut, stopReason: 'max_tokens', alreadyContinued: true }), 'reject', 'one continuation per turn');
  assert.equal(settleCutToolUse({ cut, stopReason: 'tool_use', alreadyContinued: false }), 'reject', 'malformed JSON on a normal stop');
  assert.equal(settleCutToolUse({ cut, stopReason: 'end_turn', alreadyContinued: false }), 'reject');
  assert.equal(settleCutToolUse({ cut: null, stopReason: 'max_tokens', alreadyContinued: false }), 'none', 'a text-only cap is the tail-drop case, not this one');
  // The continuation: the spoken text as the assistant turn, then one instruction.
  const msgs = toolContinuationMessages('今日はここまでにしましょう、お疲れ様でした。', 'close_session_notes');
  assert.equal(msgs.length, 2);
  assert.equal(msgs[0]!.role, 'assistant');
  assert.equal(msgs[0]!.content, '今日はここまでにしましょう、お疲れ様でした。');
  assert.equal(msgs[1]!.role, 'user');
  assert.equal(msgs[1]!.content, toolContinuationNote('close_session_notes'));
  assert.match(toolContinuationNote('close_session_notes'), /close_session_notes/);
  assert.match(toolContinuationNote('advance_lesson'), /not from the student/);
  assert.match(toolContinuationNote('advance_lesson'), /tool calls? only|no (?:further|new) speech/i);
  // Tool calls that already ran in the cut iteration are named, so the continuation does not repeat them.
  const withDone = toolContinuationNote('advance_lesson', ['mark_segment_complete']);
  assert.match(withDone, /mark_segment_complete/);
  assert.match(withDone, /already (?:executed|ran|been executed)|do not (?:call|repeat)/i);
  assert.equal(toolContinuationMessages('text', 'advance_lesson', ['mark_segment_complete'])[1]!.content, withDone);
  assert.equal(toolContinuationMessages('', 'advance_lesson').length, 1, 'no spoken text ⇒ no empty assistant turn');
  assert.equal(toolContinuationMessages('   ', 'advance_lesson')[0]!.role, 'user');
  // Wired: the brain stream re-issues once at the normal cap and mutes any new speech; the client records the event.
  const brain = readFileSync('src/lib/tutor/voice/claude-brain.ts', 'utf8');
  assert.ok(brain.includes('settleCutToolUse('));
  assert.ok(brain.includes('toolContinuationMessages('));
  assert.ok(brain.includes("yield { type: 'tool-call-continued'"));
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("onDebugEvent?.('tool_call_continued'"));
});

test('premature close line (embed-1792363895174 03:26: 「今日の練習はここまでにしましょう」 at a segment transition, 4 more minutes of teaching): dropped mid-lesson, kept in the closing stretch, after the student\'s end signal, or once the lesson is closed', () => {
  const open = { lessonClosed: false, studentEndSignal: false, closingStretch: false };
  assert.equal(isPrematureCloseLine('今日の練習はここまでにしましょう。', open), true);
  assert.equal(isPrematureCloseLine('今日はここまでにしましょう、お疲れ様でした。', open), true);
  assert.equal(isPrematureCloseLine('今日のレッスンはここまでです。', open), true);
  assert.equal(isPrematureCloseLine('今日はこれで終わりにしましょう。', open), true);
  assert.equal(isPrematureCloseLine('ここまでのポイントを確認しましょう。', open), false, 'a mid-lesson recap is allowed');
  assert.equal(isPrematureCloseLine('次は、過去の経験について話しましょう。', open), false, 'a transition is 次は…');
  assert.equal(isPrematureCloseLine('この練習はここまでにして、次に進みましょう。', open), false, 'closing an EXERCISE is not closing the day');
  assert.equal(isPrematureCloseLine('今日はここまでにしましょう。', { ...open, closingStretch: true }), false, 'the last segment / recap may close');
  assert.equal(isPrematureCloseLine('今日はここまでにしましょう。', { ...open, studentEndSignal: true }), false, 'the student asked to stop');
  assert.equal(isPrematureCloseLine('今日はここまでにしましょう。', { ...open, lessonClosed: true }), false);
  // Where in the plan: recap, the last segment, or one segment before it (extensions do not count).
  const plan = { segments: [
    { id: 'hook', kind: 'hook' }, { id: 'p1', kind: 'practice' }, { id: 'p2', kind: 'practice' }, { id: 'p3', kind: 'practice' },
    { id: 'recap', kind: 'recap' }, { id: 'ext', kind: 'extension' },
  ] };
  assert.equal(inClosingStretch(plan, 'hook'), false);
  assert.equal(inClosingStretch(plan, 'p1'), false);
  assert.equal(inClosingStretch(plan, 'p2'), false, 'two real segments left');
  assert.equal(inClosingStretch(plan, 'p3'), true, 'only the recap left');
  assert.equal(inClosingStretch(plan, 'recap'), true);
  assert.equal(inClosingStretch(plan, 'ext'), true);
  assert.equal(inClosingStretch(plan, 'nope'), true, 'unknown segment ⇒ never drop');
  assert.equal(inClosingStretch(null, 'p1'), true, 'no plan (freestyle) ⇒ never drop');
  assert.match(PREMATURE_CLOSE_NOTE, /not from the student/);
  assert.match(PREMATURE_CLOSE_NOTE, /次は/);
  assert.match(PREMATURE_CLOSE_NOTE, /close_session_notes/);
  // Wired in the bilingual sentence path, and the clause names the transition shape.
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("onDebugEvent?.('premature_close_line_dropped'"));
  assert.ok(vtr.includes("'premature_close_note_consumed'"));
  const clause = buildBilingualClause(['en', 'ja']) ?? '';
  assert.ok(/「次は/.test(clause) && /今日はここまで/.test(clause), 'clause: a segment transition is 「次は…」, never 「今日はここまで」');
});

test('markdown emphasis (embed-1792363895174: *「Have you ever…」* in the opener and the transcript drawer): asterisks stripped, text kept; multiplication and a leaked *opener* label untouched by this rule', () => {
  assert.equal(stripMarkdownEmphasis('今日は *「Have you ever been to Kyoto?」* を練習しましょう。'), '今日は 「Have you ever been to Kyoto?」 を練習しましょう。');
  assert.equal(stripMarkdownEmphasis('The target is **ever** here.'), 'The target is ever here.');
  assert.equal(stripMarkdownEmphasis('*I went to Nagoya.*'), 'I went to Nagoya.');
  assert.equal(stripMarkdownEmphasis('「*been*」と言います。'), '「been」と言います。');
  assert.equal(stripMarkdownEmphasis('2*3*4 = 24'), '2*3*4 = 24', 'multiplication');
  assert.equal(stripMarkdownEmphasis('3 * 4 * 5'), '3 * 4 * 5', 'spaced multiplication');
  assert.equal(stripMarkdownEmphasis('plain sentence.'), 'plain sentence.');
  // Through the sentence buffer (what TTS and the transcript receive): no asterisk survives,
  // and a leaked stage label still comes off first.
  const b = new SentenceBuffer();
  const out = [...b.push('*opener* いいですね。次は *「Have you ever eaten sushi?」* です。 Say it: *I have eaten sushi.* ')];
  const tail = b.flush();
  const all = [...out, ...(tail ? [tail] : [])];
  assert.ok(all.length >= 3, `got ${JSON.stringify(all)}`);
  assert.ok(all.every((x) => !x.includes('*')), `asterisk survived: ${JSON.stringify(all)}`);
  assert.equal(all[0], 'いいですね。');
  assert.ok(all.some((x) => x.includes('「Have you ever eaten sushi?」')));
  assert.ok(all.some((x) => x.includes('I have eaten sushi.')));
});

test('pronunciation claim SENTENCE (embed-1792363895174: 「発音は少し違って…「カリオキ」のように」 stayed after the katakana sentence was dropped): the claim sentence is dropped; a hearing check, a pronunciation exercise and an answer to the student\'s own question are kept', () => {
  assert.equal(isPronunciationClaimSentence('発音は少し違っていましたね。', 'I went to karaoke.'), true);
  assert.equal(isPronunciationClaimSentence('「last」の音が少し変わってしまいましたね。', 'the rest week'), true);
  assert.equal(isPronunciationClaimSentence('「ear」ではなく「ever」の音でしたが、意味は伝わりました。', 'ear eaten'), true);
  assert.equal(isPronunciationClaimSentence('It sounded like "bent" there.', 'I went'), true);
  assert.equal(isPronunciationClaimSentence('聞こえますか？', 'はい'), false, 'a hearing check is not a claim');
  assert.equal(isPronunciationClaimSentence('発音の練習ですね。', 'はい'), false, 'an exercise, not a claim');
  assert.equal(isPronunciationClaimSentence('発音を練習しましょう。', 'はい'), false);
  assert.equal(isPronunciationClaimSentence('発音は少し違っていましたね。', '発音はどうでしたか？'), false, 'the student asked');
  assert.equal(isPronunciationClaimSentence('いいですね。次は "Have you ever been to Kyoto?" です。', 'Yes, I have.'), false);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("onDebugEvent?.('pronunciation_claim_dropped'"));
});

test('prompted repeat praised as the student\'s own (embed-1792363895174 turn 1: 「完璧な英語の文です」 after a repeat of the modelled sentence): note planted; praise for a sentence the student built is left alone', () => {
  const prev = '今日は "Have you ever been to Kyoto?" を練習します。言ってみてください。 Have you ever been to Kyoto?';
  assert.equal(praisedPromptedRepeat('Have you ever been to Kyoto?', prev, '完璧な英語の文です！とてもいいですね。'), true);
  assert.equal(praisedPromptedRepeat('have you ever been to kyoto', prev, 'Perfect sentence! 次は…'), true);
  assert.equal(praisedPromptedRepeat('Have you ever been to Kyoto?', prev, 'そうです。では、あなたの経験を話してみましょう。'), false, 'a plain confirmation is right');
  assert.equal(praisedPromptedRepeat('Yes, I have. I went to Kyoto last year.', prev, '完璧です！'), false, 'the student built their own sentence');
  assert.equal(praisedPromptedRepeat('Have you ever been to Kyoto?', '次は自分の経験を話してみましょう。', '完璧な英語の文です！'), false, 'not modelled in the previous turn');
  assert.equal(praisedPromptedRepeat('Yes.', prev, '完璧です！'), false, 'too short to be a repeat of a sentence');
  assert.match(PROMPTED_REPEAT_NOTE, /not from the student/);
  assert.match(PROMPTED_REPEAT_NOTE, /repeat/i);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("onDebugEvent?.('prompted_repeat_note_planted'"));
  assert.ok(vtr.includes("'prompted_repeat_note_consumed'"));
});

test('embed-1792367246990 regressions: the live asterisk shapes (!*…*( and 。 *…*() are stripped; the recap\'s "continue or stop?" question is NOT a premature close', () => {
  assert.equal(stripMarkdownEmphasis('いいですね!*I played golf yesterday.*(昨日ゴルフをしました)— 完璧な文です。'), 'いいですね!I played golf yesterday.(昨日ゴルフをしました)— 完璧な文です。');
  assert.equal(stripMarkdownEmphasis('まず一つ聞きますね。 *What did you do yesterday?*(昨日何をしましたか?)'), 'まず一つ聞きますね。 What did you do yesterday?(昨日何をしましたか?)');
  assert.equal(stripMarkdownEmphasis('いいですね、*Yes, I have.*で答えられました。'), 'いいですね、Yes, I have.で答えられました。');
  assert.equal(stripMarkdownEmphasis('*I played golf yesterday.*(昨日)と *I went to Nagoya Castle last week.*(先週)— 両方とも正しい文ですよ'), 'I played golf yesterday.(昨日)と I went to Nagoya Castle last week.(先週)— 両方とも正しい文ですよ');
  assert.equal(stripMarkdownEmphasis('2*3*4 = 24'), '2*3*4 = 24');
  const open = { lessonClosed: false, studentEndSignal: false, closingStretch: false };
  assert.equal(isPrematureCloseLine('続けて大丈夫ですか、それとも今日はここまでにしましょうか?', open), false, 'the recap ends by asking whether to continue or stop');
  assert.equal(isPrematureCloseLine('今日はここまでにしますか？', open), false);
  assert.equal(isPrematureCloseLine('今日はここまでにしましょう。', open), true, 'the statement is still dropped');
});

test('false credit after an ENGLISH QUESTION (embed-1792367246990: 「はい、ハワイに行きました」 → "Yes, I have. I went to Hawaii… 完璧"; curry): any English question from the tutor expects an English reply, so the no-English note fires on a Japanese-only answer', () => {
  assert.equal(expectsEnglishReply('I ate dinner with my family at seven. 過去形は ate ですね。 Have you ever been abroad? (海外に行ったことがありますか?)'), true);
  assert.equal(expectsEnglishReply('次に行きましょう。*Have you ever cooked curry?*(カレーを作ったことがありますか?)'), true);
  assert.equal(expectsEnglishReply('家族とご飯を食べたことを英語で言ってみましょう。'), true, 'the explicit ask still counts');
  assert.equal(expectsEnglishReply('はい、お待ちしています。'), false);
  assert.equal(expectsEnglishReply('続けて大丈夫ですか、それとも今日はここまでにしましょうか?'), false, 'a Japanese question is not an English ask');
  assert.match(NO_ENGLISH_REPLY_NOTE, /asked (?:for English|a question in English)/);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('askedForEnglishRef.current = expectsEnglishReply(fullText)'));
  // The new events of this round are persisted for embed sessions (page.tsx prefix list).
  const page = readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8');
  for (const p of ["'premature_close'", "'tool_call_continued'", "'prompted_repeat'"]) assert.ok(page.includes(p), `prefix ${p} missing`);
});

test('embed-1792378728971: the bridge line is wired with the session languages, and the no-name directive is used when the bridge said no name', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.match(vtr, /bridgeLineFor\(\{[^}]*tutorLanguages/s, 'bridgeLineFor must receive tutorLanguages');
  assert.ok(vtr.includes('BRIDGE_SPOKEN_NO_NAME_DIRECTIVE'), 'the opening directive must use the no-name variant after a nameless bridge');
});

// ── Task 20 §B (GDI run 8) ───────────────────────────────────────────────
test('20B1: the 1543 s farewell is caught; a mid-lesson transition is not', () => {
  const line = 'Your sentence is complete and clear, so let\'s close the pronunciation practice here. 「どうもありがとうございました。 今日はここまでです。」 Thank you for the lesson today, Praveen. Goodbye!';
  assert.equal(prematureFarewellLine(line), '今日はここまでです。', 'caught (the 「」 goodbye is the tutor\'s own), and the event names the sentence');
  assert.ok(prematureFarewellLine('Thank you for the lesson today, Praveen. Goodbye!'));
  assert.ok(prematureFarewellLine('お疲れ様でした。今日はここまでです。さようなら。'));
  assert.equal(prematureFarewellLine('Good. Let\'s move on to the pronunciation part now.'), null);
  assert.equal(prematureFarewellLine('続けますか、それとも今日はここまでにしましょうか？'), null, 'a question is never a close');
  assert.equal(prematureFarewellLine('See you is a common goodbye. Can you say it?'), null);
});
test('20B1 fix round 1 (I2): farewell words as lesson content are not a close', () => {
  for (const t of [
    'Say "Have a nice day."',
    'See you next week, and practice the sentence.',
    'Please repeat after me: "Thank you for your time. Have a nice day."',
    'Great. "I said goodbye to the clients at the station." is a natural sentence.',
    'Good. Next phrase for the end of a meeting: "See you next week."',
    'In business emails we often end with "Take care."',
    'Let\'s practise: 「今日はここまでです」 means "That\'s all for today."',
    'Goodbye is a common word. Now tell me about your job.',
  ]) assert.equal(prematureFarewellLine(t), null, t);
});
test('20B1 fix round 1 (I1): the student end signal is sticky and feeds the close guard', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  // Task 33 §E: mid-lesson on a fixed script the first request asks the choice (no latch).
  // Fix round 1 (B-1): only an explicit stop while the choice is pending latches.
  assert.ok(vtr.includes('if (isStandaloneStopUtterance(t) && !(TUTOR_STOP_REQUEST_CHOICE'));
  assert.ok(vtr.includes('&& !(stopChoicePendingRef.current && isExplicitStop(t)))) studentEndSignalRef.current = true;'));
  assert.ok(vtr.includes('{ studentEndSignal: studentEndSignalRef.current }'));
  assert.ok(!/studentEndSignalRef\.current = false/.test(vtr), 'never cleared');
});
test('20B1: VTR refuses the premature close and kills the farewell', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("onDebugEvent?.('fixed_script_close_refused'"));
  assert.ok(vtr.includes('pendingCloseRefusedNoteRef.current = FIXED_SCRIPT_CLOSE_REFUSED_NOTE'));
  assert.ok(vtr.includes("rejectionsThisAttempt.push({ action: 'premature_farewell', reason: PREMATURE_FAREWELL_REASON })"));
  const at = vtr.indexOf("if (cmd.action === 'closeSessionNotes') {");
  const refuse = vtr.indexOf('fixedScriptCloseOk()', at);
  const closed = vtr.indexOf('lessonClosedRef.current = true;', at);
  assert.ok(at > 0 && refuse > at && refuse < closed, 'the refusal runs before lessonClosedRef is set');
});
test('20B fix round 2 (NEW-I1): only a standalone stop utterance latches the end signal', () => {
  for (const t of ['I usually stop working at six.', 'I said goodbye to the clients.', 'See you at the meeting.']) assert.equal(isStandaloneStopUtterance(t), false, t);
  for (const t of ["Okay, let's stop here.", 'Bye!', '今日はここまでにしましょう', 'Thank you, bye.', "Yes, that's all for today."]) assert.equal(isStandaloneStopUtterance(t), true, t);
});
test('20B fix round 2 (I2): the tutor\'s own 「」 goodbye counts; a goodbye with an encouragement tail closes', () => {
  assert.ok(prematureFarewellLine('「どうもありがとうございました。今日はここまでです。さようなら。」'));
  assert.equal(prematureFarewellLine('Thank you for the lesson today. Goodbye! Keep up the good work.'), 'Goodbye!');
  assert.ok(prematureFarewellLine('Great work today, Praveen. See you next time! Keep practising the present perfect.'));
  assert.equal(prematureFarewellLine('Goodbye! Now, what did you do yesterday at work, and who did you meet there?'), null);
});
test('20B2: a post-close turn that re-engages re-opens the lesson; a goodbye / courtesy does not', () => {
  assert.equal(reopensAfterClose('Of course, let\'s practice a little more. Here is the sentence again: "I was responsible for communicating with our customers." Please listen, then say it after me.', true), true);
  assert.equal(reopensAfterClose('Of course. Which sentence would you like to practise?', false), true, 'a real question re-opens');
  assert.equal(reopensAfterClose('Now, please say the sentence once more.', false), true, 'an ask re-opens');
  assert.equal(reopensAfterClose('Homework is the review sheet on your page.', false), false, 'a plain answer stays closed');
  assert.equal(reopensAfterClose('You are welcome. Goodbye!', true), false, 'a goodbye never re-opens');
  assert.equal(reopensAfterClose("You're welcome! Is there anything else you'd like to ask?", false), false, 'courtesy (I3)');
  assert.equal(reopensAfterClose('Of course. "Responsible for" means 担当. Any other questions?', false), false, 'courtesy (I3)');
  assert.equal(reopensAfterClose('どういたしまして。他に質問はありますか？', false), false, 'courtesy JA (I3)');
  assert.equal(reopensAfterClose("You're welcome. Please tell me if you have any other questions.", false), false, 'courtesy as an ask (fix round 2, I3)');
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("onDebugEvent?.('lesson_reopened'"));
  const at = vtr.indexOf("onDebugEvent?.('lesson_reopened'");
  assert.ok(/&& isFixedScriptPlan\(lessonPlanRef\.current\)/.test(vtr.slice(at - 900, at)), 'fixed-script only (I3)');
});

// ─── Task 22 §E (GDI run 10, 241 s): the student reads the board question aloud ───
test('22E isBoardReadAloud: the run-10 reading is held; asked-for, short, or answered readings are not', () => {
  const board = 'Have you worked for your current company for a long time?';
  assert.equal(isBoardReadAloud({ transcript: 'Have you worked for your company for a long time?', boardQuestion: board, expectedRepeat: null }), true);
  assert.equal(isBoardReadAloud({ transcript: 'Um, have you worked for your current company for a long time?', boardQuestion: board, expectedRepeat: null }), true);
  // the tutor asked "Please read the question aloud" → the reading IS the turn
  assert.equal(isBoardReadAloud({ transcript: 'Have you worked for your company for a long time?', boardQuestion: board, expectedRepeat: board }), false);
  // a statement under 4 words
  assert.equal(isBoardReadAloud({ transcript: 'What do you do?', boardQuestion: 'What do you?', expectedRepeat: null }), false);
  // a reading plus an answer — too many extras
  assert.equal(isBoardReadAloud({ transcript: 'Have you worked for your current company for a long time — yes, three years', boardQuestion: board, expectedRepeat: null }), false);
  // an answer is not a reading
  assert.equal(isBoardReadAloud({ transcript: 'Yes, I have worked for my company for 3 years.', boardQuestion: board, expectedRepeat: null }), false);
  // no board question
  assert.equal(isBoardReadAloud({ transcript: 'Have you worked for your company for a long time?', boardQuestion: null, expectedRepeat: null }), false);
  // a multi-line card: each numbered line separately
  const card = '1. Can you tell me a little about your job?\n2. Have you ever worked with an international customer?\n3. What did you sell last month?';
  assert.equal(isBoardReadAloud({ transcript: 'Have you ever worked with an international customer?', boardQuestion: card, expectedRepeat: null }), true);
  assert.equal(isBoardReadAloud({ transcript: 'Yes, I have worked with an international customer.', boardQuestion: card, expectedRepeat: null }), false);
});
test('22E asksToReadAloud: an aloud ask, not a silent "read it through"', () => {
  assert.equal(asksToReadAloud('Please read the question aloud.'), true);
  assert.equal(asksToReadAloud('Can you read it out loud for me?'), true);
  assert.equal(asksToReadAloud('Look at the card on the board and read it through. Then tell me one sentence about your work.'), false);
});
test('22E r1 I2: an asked-for reading is not held — a quoted target one word off, or a say / repeat / ask-me ask at the card', () => {
  const board = 'Have you worked for your current company for a long time?';
  const quoted = 'Have you worked for your company for a long time?';
  assert.equal(isBoardReadAloud({ transcript: quoted, boardQuestion: board, expectedRepeat: quoted }), false);
  for (const t of [
    'Say the question on the card.',
    'Now say the question on the board once more.',
    'Repeat the question after me.',
    'Please ask me the question on the card.',
    'Try reading the question out.',
    'Please read the question on the card aloud.',
  ]) assert.equal(asksToReadAloud(t), true, t);
  // fix round 2 (I2): a quoted say-it target is tested through expectedRepeatFor + saidModelSentence, not asksToReadAloud
  assert.equal(asksToReadAloud(`Please say it after me: "${quoted}"`), false);
  // the run-10 241 s ask still holds the reading
  const t217 = 'Your sentence is correct: "I have worked as a sales manager for three years." Let\'s move on to the present perfect practice. Look at the card on the board and read it through. Then tell me one sentence about your work using "I have worked" with a time expression like "for" or "since".';
  assert.equal(asksToReadAloud(t217), false);
  assert.equal(isBoardReadAloud({ transcript: quoted, boardQuestion: board, expectedRepeat: null }), true);
});
test('22E r2 I2: only an ask whose TARGET is the question exempts the reading', () => {
  const board = 'Have you worked for your current company for a long time?';
  const read = 'Have you worked for your current company for a long time?';
  // an exempt ask makes the board line the expected repeat (VTR: asksToReadAloud ⇒ { text: boardQuestion })
  const held = (tutor: string) => isBoardReadAloud({ transcript: read, boardQuestion: board, expectedRepeat: asksToReadAloud(tutor) ? board : null });
  const t217 = 'Your sentence is correct: "I have worked as a sales manager for three years." Let\'s move on to the present perfect practice. Look at the card on the board and read it through. Then tell me one sentence about your work using "I have worked" with a time expression like "for" or "since".';
  assert.equal(held(t217), true, '217 s "read it through" ⇒ held');
  assert.equal(held('Please read the question on the card aloud.'), false);
  for (const t of [
    'Read the question on the board and answer it.',
    'Tell me your answer to the question on the board.',
    'Good. Try saying it with "since". Then look at the card and answer the question.',
    'Can you say that in a full sentence? Then look at the card on the board.',
    'Good. Say it once more: "I have worked here for three years."',
    'Please repeat after me.',
  ]) assert.equal(held(t), true, t);
});
test('22E r1 I3: held once per statement; a question asked back is a turn; a barge-in is never held', () => {
  const board = 'Have you worked for your current company for a long time?';
  const read = 'Have you worked for your company for a long time?';
  assert.equal(isBoardReadAloud({ transcript: read, boardQuestion: board, expectedRepeat: null, heldBefore: false }), true);
  assert.equal(isBoardReadAloud({ transcript: read, boardQuestion: board, expectedRepeat: null, heldBefore: true }), false);
  for (const t of [
    'And you? Have you worked for your current company for a long time?',
    'How about you? Have you worked for your current company for a long time?',
    'What about you, have you worked for your current company for a long time?',
    'You? Have you worked for your current company for a long time?',
    'Um, and you, have you worked for your company for a long time?',
  ]) assert.equal(isBoardReadAloud({ transcript: t, boardQuestion: board, expectedRepeat: null }), false, t);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(/if \(TUTOR_BOARD_READ_ALOUD_HOLD && !opts\?\.silent && !opts\?\.typed && !opts\?\.stoppedTutor && languageSessionRef\.current/.test(vtr), 'a transcript that stopped the tutor is never held');
  assert.ok(/const heldBefore = !!boardQuestion && boardReadAloudHeldRef\.current\.has\(boardQuestion\);\s*if \(isBoardReadAloud\(\{ transcript, boardQuestion, expectedRepeat: readExpected\?\.text \?\? null, heldBefore \}\)\) \{\s*\/\/[^\n]*\n\s*if \(boardQuestion\) boardReadAloudHeldRef\.current\.add\(boardQuestion\);/.test(vtr), 'once per statement');
  // the three paths where the utterance stopped the tutor pass the signal
  assert.equal((vtr.match(/queueOnMidUtterance: true,\n\s*stoppedTutor: true,/g) ?? []).length, 2, 'perception MERGE + FRESH');
  assert.ok(/void handleStudentTranscriptForBrain\(t\.text, \{ bypassPerceptionDedupe: true, \.\.\.\(heur\.verdict === 'barge_in' && prodState === 'speaking' \? \{ stoppedTutor: true \} : \{\}\) \}\);/.test(vtr), 'late-fallback barge-in');
  // fix round 2 (I1): the stage-2 lazy abort killed the in-flight turn ⇒ stoppedTutor
  const lazy = vtr.slice(vtr.indexOf('const resolveStage2LazyVerdict = '), vtr.indexOf('const resolveStage2LazyVerdict = ') + 6000);
  assert.ok(/const lazyKilledTutor = inFlightBrainAbortRef\.current !== null;\s*if \(lazyKilledTutor\) \{\s*const cancelStage[^\n]*\n\s*runPerceptionKillRef\.current\?\.\(cancelStage\);/.test(lazy), 'the kill decision is captured');
  assert.ok(/void handleStudentTranscriptForBrain\(text, \{ bypassPerceptionDedupe: true, queueOnMidUtterance: true, \.\.\.\(lazyKilledTutor \? \{ stoppedTutor: true \} : \{\}\) \}\);/.test(lazy), 'stage-2 lazy abort passes stoppedTutor');
  // fix round 2 (m1): a queued stoppedTutor dispatch keeps the flag on re-entry
  assert.equal((vtr.match(/if \(opts\?\.stoppedTutor\) queuedStoppedTutorRef\.current = true;/g) ?? []).length, 2, 'both queue push sites remember it');
  assert.equal((vtr.match(/const stuckStoppedTutor = queuedStoppedTutorRef\.current;\s*queuedStoppedTutorRef\.current = false;/g) ?? []).length, 2, 'drain timer + watchdog take it');
  assert.equal((vtr.match(/void handleStudentTranscriptForBrain\(joined, \{ bypassPerceptionDedupe: true, \.\.\.\(stuckStoppedTutor \? \{ stoppedTutor: true \} : \{\}\) \}\);/g) ?? []).length, 2, 'both re-entries pass it');
  assert.equal((vtr.match(/handleStudentTranscriptForBrain\(joined, \{ bypassPerceptionDedupe: true \}\)/g) ?? []).length, 0, 'no bare re-entry left');
});
test('22E VTR holds a read-aloud before the brain dispatch (pin)', () => {
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  const h = vtr.indexOf('const handleStudentTranscriptForBrain = useCallback(');
  const at = vtr.indexOf("'board_read_aloud_held'", h);
  assert.ok(h > 0 && at > h && at - h < 9000, 'inside handleStudentTranscriptForBrain, near its top');
  const block = vtr.slice(at - 2000, at + 200);
  assert.ok(/if \(TUTOR_BOARD_READ_ALOUD_HOLD && !opts\?\.silent && !opts\?\.typed && !opts\?\.stoppedTutor && languageSessionRef\.current && /.test(block));
  assert.ok(/isBoardReadAloud\(\{ transcript, boardQuestion, expectedRepeat: readExpected\?\.text \?\? null, heldBefore \}\)\) \{[\s\S]{0,200}?onDebugEvent\?\.\('board_read_aloud_held', `"\$\{transcript\.slice\(0, 80\)\}"`\);\s*return;/.test(block));
  assert.ok(/currentProblemRef\.current\?\.statement \?\?/.test(block));
  assert.ok(at < vtr.indexOf('recordStudentEngagement(idleNudgeStateRef.current)', h), 'before the engagement reset: the idle nudge stays armed');
  assert.ok(/export const TUTOR_BOARD_READ_ALOUD_HOLD = process\.env\.NEXT_PUBLIC_TUTOR_BOARD_READ_ALOUD_HOLD !== 'off';/.test(readFileSync('src/lib/tutor/orchestrator/flags.ts', 'utf8')));
});

// ─── Task 22 §F1 (GDI run 10, turns 23–27): digits vs number words ───
test('22F1 normaliseNumberTokens + saidModelSentence across digits and words', () => {
  assert.deepEqual(normaliseNumberTokens(['3']), ['three']);
  assert.deepEqual(normaliseNumberTokens(['21']), ['twenty', 'one']);
  assert.deepEqual(normaliseNumberTokens(['1000']), ['one', 'thousand']);
  assert.deepEqual(normaliseNumberTokens(['300', '100', '0', '40']), ['three', 'hundred', 'one', 'hundred', 'zero', 'forty']);
  assert.deepEqual(normaliseNumberTokens(['250', '2026', 'third']), ['250', '2026', 'third']);
  assert.equal(saidModelSentence('I have worked at Nagoya Corporation for three years.', 'I have worked at Nagoya Corporation for 3 years.'), true);
  assert.equal(saidModelSentence('I sold twenty-five machines.', 'I sold 25 machines'), true);
  assert.equal(saidModelSentence('I sold 25 machines.', 'I sold twenty-five machines'), true);
  assert.equal(saidModelSentence('I was the third person in the team.', 'I was the 3 person in the team.'), false);
  // the run-10 301 s re-ask now fires repeat_after_correct
  assert.equal(
    reAskedModelSentence('Your sentence has the right tense. Now, please say it once more, with "I have worked at Nagoya Corporation for three years."', 'I have worked at Nagoya Corporation for 3 years.', "Let's say the full sentence once more."),
    'I have worked at Nagoya Corporation for three years.',
  );
});

test('22F2 the language-session prompt reads digits as the spoken number words; a non-language session does not carry the line', () => {
  const line = 'Speech recognition writes numbers as digits ("3 years" is the student saying "three years"); never treat a digit as a missing or wrong word.';
  const a = buildSystemPromptParts(base);
  const b = buildSystemPromptParts({ ...base, tutorLanguages: ['en', 'ja'] });
  assert.ok(b.session.includes(line));
  assert.ok(!(a.core + a.session).includes(line));
});

test('23I verb-form errors are grammar, not mishearing: the judge block and the bilingual clause carry the lines; English-only unchanged', () => {
  // fix round 1 (m11): reworded so it no longer contradicts the sound-alike sentence
  const judgeLine = 'Sound-alike words (bought/boat) are mishearing. A difference of verb form or inflection (spoke/spoken, work/worked, machine/machines) is NOT mishearing: it is grammar, and praise that calls such a form correct IS an issue.';
  assert.ok(!buildJudgeUserContent({ boardSummary: '', spokenText: 'x', learnerSpeech: true }).includes('walked → "work"'), 'no sound-alike example that is an inflection');
  const jb = { boardSummary: '', spokenText: 'Great.' };
  assert.ok(buildJudgeUserContent({ ...jb, learnerSpeech: true }).includes(judgeLine));
  assert.ok(!buildJudgeUserContent(jb).includes(judgeLine));
  const brainLine = 'When you correct a word, say the correction plainly; never tell the student they used the corrected form.';
  // fix round 2 (I2): the brain's sound-alike example agrees with the judge (no inflection pair)
  const clause = buildBilingualClause(['en', 'ja'])!;
  assert.ok(clause.includes('(bought → "boat", walked → "woke", thirteen → "thirty")'));
  assert.ok(!clause.includes('walked → "work"'));
  assert.ok(buildBilingualClause(['en', 'ja'])!.includes(brainLine));
  const a = buildSystemPromptParts(base);
  const b = buildSystemPromptParts({ ...base, tutorLanguages: ['en', 'ja'] });
  assert.ok(b.session.includes(brainLine));
  assert.ok(!(a.core + a.session).includes(brainLine));
});

test('Task 24 §E1 (GDI run 12, 231 s): a quote inside a PRAISE sentence, the ask on the next item ⇒ not a re-ask', () => {
  const t231 = 'Good, Praveen, you said the whole sentence correctly: "I have worked with international customers." Let\'s move on. 次は現在完了形で、あなた自身の経験について話しましょう。言ってみましょう。Have you worked for your current company for a long time?';
  assert.equal(reAskedOwnSentence('I have worked with international customers.', t231), false);
  // run 4 still a re-ask (quote right before the ask, no next-item cue)
  assert.equal(reAskedOwnSentence('I showed the customer uh models of washing machines.', 'Let\'s make it a clean sentence: "I showed the customer models of washing machines." Can you say that once more?'), true);
  // fix round 1 (m-1): one praise sentence between the quote and the ask ⇒ still a re-ask
  assert.equal(reAskedOwnSentence('I showed the customer models.', 'Let\'s make it a clean sentence: "I showed the customer models." Nice work. Can you say that once more?'), true);
  assert.equal(reAskedOwnSentence('I showed the customer models of washing machines.', 'Nice: "I showed the customer models of washing machines." That is correct. Can you say that once more?'), true);
  // a quote in the ask sentence itself, but a next-item cue between ⇒ not the early re-ask
  assert.equal(reAskedOwnSentence('I like my new job a lot.', '"I like my new job a lot." Now let\'s try another one. Can you say that again?'), false);
});
test('Task 24 §E2 (GDI run 12, 1018 s): full-sentence ask with a starter that begins the student\'s correct sentence ⇒ re-ask', () => {
  const s1018 = 'The seminar took place last year.';
  const t1018 = 'The seminar took place last year, so "took place" is the right form, and the sentence is correct. Could you try saying the full sentence now, starting with "The seminar…"?';
  const ok = { studentCorrect: true };
  assert.equal(reAskedOwnSentence(s1018, t1018, ok), true);
  assert.equal(reAskedOwnSentence(s1018, t1018), false, 'fix round 1 (I-1): no verdict ⇒ no starter re-ask');
  assert.equal(reAskedOwnSentence(s1018, t1018.replace('"The seminar…"', '"Last year…"'), ok), false, 'starter is not a prefix');
  assert.equal(reAskedOwnSentence(s1018, t1018.replace('"The seminar…"', '"The seminar..."'), ok), true, 'ASCII ellipsis stripped');
  // fix round 1 (I-1): a correction drill quoting the learner's WRONG sentence, verdict incorrect ⇒ not a re-ask
  const wrong = 'The seminar take place last year.';
  const drill = 'You said "The seminar take place last year." We need "took place" here. Could you say the full sentence again, starting with "The seminar…"?';
  assert.equal(reAskedOwnSentence(wrong, drill, { studentCorrect: false }), false);
  assert.deepEqual([precheckCorrectness('correct'), precheckCorrectness('incorrect'), precheckCorrectness('unsure'), precheckCorrectness(null)], [true, false, undefined, undefined]);
  const v = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.equal((v.match(/reAskedOwnSentence\(transcript, (?:attemptText|fullText), \{ studentCorrect: precheckCorrectness\(verdictPrecheckRef\.current\?\.verdict\) \}\)/g) ?? []).length, 2, 'both callers pass the verdict');
  // 1001 s: the student's sentence was wrong ("take place") — the tutor's prose does not contain it
  const t1001 = 'The seminar took place last year, so the past simple is right. Let\'s check the verb: could you say the full sentence starting with "The seminar…" and use "took place"?';
  assert.equal(reAskedOwnSentence('The seminar take place last year.', t1001, { studentCorrect: false }), false);
});

test('Task 25 §B (GDI run 13, 889 s): a Japanese sentence quoting an English span of 3+ words ⇒ spoken as parts', () => {
  const L = ['en', 'ja'];
  assert.deepEqual(splitSentenceForTts('「My manager showed me slogans he had written earlier」ですね、具体的でいい答えです。', L), [
    { text: 'My manager showed me slogans he had written earlier.', language: 'en' },
    { text: 'ですね、具体的でいい答えです。', language: 'ja' },
  ]);
  const one = '「for」と「international」の音が少し弱かったようです。';
  assert.deepEqual(splitSentenceForTts(one, L), [{ text: one, language: 'ja' }]);
  assert.deepEqual(splitSentenceForTts("Great, let's begin.", L), [{ text: "Great, let's begin.", language: 'en' }]);
  const ja = '今日は、仕事について英語で話す練習をしましょう。';
  assert.deepEqual(splitSentenceForTts(ja, L), [{ text: ja, language: 'ja' }]);
  assert.deepEqual(splitSentenceForTts('その文、「I have worked here for five years」は現在完了です。', L), [
    { text: 'その文、', language: 'ja' },
    { text: 'I have worked here for five years.', language: 'en' },
    { text: 'は現在完了です。', language: 'ja' },
  ]);
  // English-only sessions: one part, byte-identical, language undefined
  const q = 'その文、「I have worked here for five years」は現在完了です。';
  assert.deepEqual(splitSentenceForTts(q, null), [{ text: q, language: undefined }]);
  assert.deepEqual(splitSentenceForTts(q, ['en']), [{ text: q, language: undefined }]);
  // an all-English sentence with an English quote is not split
  const en = 'You said "I work in sales," which is right.';
  assert.deepEqual(splitSentenceForTts(en, L), [{ text: en, language: 'en' }]);
  // double quotes, terminal punctuation kept, a trailing comma dropped
  assert.deepEqual(splitSentenceForTts('"Did you finish the report?" と聞きます。', L).map((p) => p.text), ['Did you finish the report?', 'と聞きます。']);
  assert.deepEqual(splitSentenceForTts('「I work in sales,」ですね。', L).map((p) => p.text), ['I work in sales.', 'ですね。']);
  // a quote with nothing spoken after it stays one part pair-free of punctuation-only frames
  assert.deepEqual(splitSentenceForTts('いい文です：「I work in the sales department」。', L).map((p) => p.language), ['ja', 'en']);
});

test('Task 25 §B: the component splits at the sentence consumer, flag-gated, caption registered with its parts', () => {
  const v = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.match(v, /const ttsParts = splitSentenceForTts\(s, ttsSplitLanguagesRef\.current\);/);
  assert.match(v, /onDebugEvent\?\.\('tts_sentence_split', `\$\{ttsParts\.length\} parts/);
  assert.match(v, /for \(const \{ text: part \} of ttsParts\) speakOnePart\(part\);/);
  assert.match(v, /registerSentence\(sentenceForSpeech, trimmedSentence, splitSentenceForTts\(sentenceForSpeech, ttsSplitLanguagesRef\.current\)\.map/);
  assert.match(v, /ttsSplitLanguagesRef\.current = TUTOR_TTS_SPLIT_QUOTED_SPANS \? tutorLanguages : undefined;/);
});

test('Task 25 §F1 (GDI run 13, 1333 s): a recap part / unsaid required phrases keep the normal cap', () => {
  assert.deepEqual(needsHeadroomFor({ segmentKind: 'recap' }), { needsHeadroom: true, reason: 'recap' });
  assert.deepEqual(needsHeadroomFor({ segmentKind: 'try_yourself', requiredPhrasesPending: false }), { needsHeadroom: false, reason: null });
  assert.deepEqual(needsHeadroomFor({ segmentKind: 'concept', requiredPhrasesPending: true }), { needsHeadroom: true, reason: 'required-phrases' });
  assert.equal(needsHeadroomFor({ directive: true, segmentKind: 'recap' }).reason, 'directive', 'the existing inputs first');
  assert.equal(languageTurnMaxTokens({ languageLesson: true, voice: true, needsHeadroom: needsHeadroomFor({ segmentKind: 'recap' }).needsHeadroom, cap: 220 }), undefined);
  assert.equal(languageTurnMaxTokens({ languageLesson: true, voice: true, needsHeadroom: needsHeadroomFor({ segmentKind: 'try_yourself' }).needsHeadroom, cap: 220 }), 220);
  const v = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.match(v, /needsHeadroom: headroom\.needsHeadroom,/);
  assert.match(v, /onDebugEvent\?\.\('output_budget_headroom', headroom\.reason\)/);
});

test('Task 25 §F2: a required-phrase miss on a max_tokens-cut turn is deferred, not killed', () => {
  assert.equal(requiredPhraseMissAction({ missing: ['one thing you did well'], stoppedOnMaxTokens: true }), 'defer');
  assert.equal(requiredPhraseMissAction({ missing: ['one thing you did well'], stoppedOnMaxTokens: false }), 'kill');
  assert.equal(requiredPhraseMissAction({ missing: [], stoppedOnMaxTokens: true }), 'none');
  const v = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.match(v, /requiredPhraseMissAction\(\{ missing, stoppedOnMaxTokens: maxTokensStopThisAttempt \}\)/);
  assert.match(v, /onDebugEvent\?\.\('required_phrase_deferred', `max_tokens:/);
  assert.match(v, /\[pendingRequiredPhraseNoteRef, 'required_phrase_note_consumed'\]/);
  assert.match(v, /if \(lastStopReason === 'max_tokens'\) maxTokensStopThisAttempt = true;/);
});

test('Task 25 §G (GDI run 13, 824 s): no third version of a model sentence', () => {
  const prev = 'Good try. In English we use "colleagues" for people at work, so let\'s say "other experienced colleagues" instead. Can you try that sentence once more?';
  const student = 'I spoke to other colleagues and uh my manager.';
  const attempt = 'Ah, your manager and other colleagues — that\'s a good way to solve the problem. Let\'s keep it natural: 「同僚に相談しました」 is "I asked my colleagues for help." Can you say: I talked to my manager and other colleagues?';
  assert.equal(repeatAskThirdVersion({ prevTutorText: prev, studentText: student, verdict: 'partly_correct', attemptText: attempt }), true);
  assert.equal(repeatAskThirdVersion({ prevTutorText: prev, studentText: student, verdict: 'incorrect', attemptText: attempt }), false, 'a wrong repeat may be asked once more');
  assert.equal(repeatAskThirdVersion({ prevTutorText: 'What did you do when the project had a problem?', studentText: student, verdict: 'partly_correct', attemptText: attempt }), false, 'a first repeat ask');
  assert.equal(repeatAskThirdVersion({ prevTutorText: prev, studentText: 'Um, sorry?', verdict: null, attemptText: attempt }), false, 'not an attempt');
  assert.equal(repeatAskThirdVersion({ prevTutorText: prev, studentText: 'Can I say it in Japanese?', verdict: null, attemptText: attempt }), false, 'a question is not an attempt');
  assert.equal(repeatAskThirdVersion({ prevTutorText: prev, studentText: student, verdict: 'partly_correct', attemptText: 'Good, that works. Next question: who helped you most?' }), false, 'moving on is fine');
  assert.ok(!isRepeatAskForThirdVersion('Can you say what you did next?'), 'a new question');
  assert.ok(isRepeatAskForThirdVersion('Can you say "I asked my manager for help"?'));
  assert.ok(isRepeatAskForThirdVersion('Please say the sentence once more.'));
  assert.ok(REPEAT_ASK_THIRD_VERSION_REASON.startsWith('The student has already tried this sentence twice.'));
  const v = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.match(v, /rejectionsThisAttempt\.push\(\{ action: 'repeat_ask_third_version', reason: REPEAT_ASK_THIRD_VERSION_REASON \}\);/);
  assert.match(v, /repeatAskThirdVersion\(\{ prevTutorText: tvPrev, studentText: transcript, verdict: verdictPrecheckRef\.current\?\.verdict, attemptText \}\)/);
});

test('Task 25 fix round 1 (I-1): scrubTutorText (SentenceBuffer) keeps a "Say: / Listen:" label — no unnamed label strip', () => {
  for (const x of ['Say: "I have worked here for five years."', 'Listen: 「I have worked here」', 'Perfect: "I went there yesterday."', 'Remember: "a" goes before a vowel.']) {
    assert.deepEqual(split(x), [x]);
  }
});

test('Task 25 fix round 1 (I-2): a sentence-boundary kill keeps the whole split sentence', () => {
  const parts = splitSentenceForTts('その文、「I have worked here for five years」は現在完了です。', ['en', 'ja']).map((p) => p.text);
  // peekSpeechQueue = [in-flight, ...queued]; resumeTailAfterBoundary drops the in-flight part
  const tailAfterKept = [parts[1]!, parts[2]!, 'Can you say it again?'];
  assert.deepEqual(keptRestRemoved(tailAfterKept, parts.slice(1)), ['Can you say it again?']);
  assert.deepEqual(keptRestRemoved(['Can you say it again?'], parts.slice(1)), ['Can you say it again?'], 'nothing queued of the sentence');
  const v = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.match(v, /const keptRest = res\.finished && res\.keptSentence \? splitLaterParts\.get\(res\.keptSentence\) : undefined;/);
  assert.match(v, /for \(const part of keptRest\) speakOnePart\(part, \{ replay: true \}\);/);
  assert.match(v, /if \(!opts\?\.replay\) turnNarrationRef\.current\.push\(s\);/);
  assert.ok(v.indexOf('resumeTail = keptRestRemoved(resumeTail, keptRest);') > v.indexOf('let resumeTail = res.finished ? resumeTailAfterBoundary(tail, res.keptSentence) : tail;'));
});

test('Task 25 fix round 1 (m-4, m-5, m-7)', () => {
  const prev = 'Right, you solved the challenge by talking with your manager and other intelligent people. The phrase "intelligent people" is a bit unusual, so let\'s say "other experienced colleagues" instead. Can you try that sentence once more?';
  const attempt = 'Okay. Can you say: I talked to my manager and other colleagues?';
  for (const st of ["I don't understand that", 'Sorry I forgot it', 'What does experienced mean']) {
    assert.equal(repeatAskThirdVersion({ prevTutorText: prev, studentText: st, verdict: null, attemptText: attempt }), false, st);
  }
  assert.equal(repeatAskThirdVersion({ prevTutorText: prev, studentText: 'I spoke to other colleagues and uh my manager.', verdict: null, attemptText: attempt }), true);
  const v = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.match(v, /pendingRequiredPhraseNoteSegRef\.current = segIdForPhrases;/);
  assert.match(v, /if \(pendingRequiredPhraseNoteRef\.current && pendingRequiredPhraseNoteSegRef\.current !== currentSegmentIdRef\.current\)/);
  // m-7 accepted: two quotes joined by a particle keep the particle as its own Japanese part
  assert.deepEqual(splitSentenceForTts('"I have worked here" と "I worked here" の違いは何ですか。', ['en', 'ja']).map((p) => [p.language, p.text]),
    [['en', 'I have worked here.'], ['ja', 'と'], ['en', 'I worked here.'], ['ja', 'の違いは何ですか。']]);
});

test('Task 27 §H (GDI run 14, 408/489 s): a bracketed quote ending with a full stop ⇒ split; the fast opener takes the split', () => {
  const L = ['en', 'ja'];
  assert.deepEqual(splitSentenceForTts('「I have learned how to make presentations.」ですね。', L), [
    { text: 'I have learned how to make presentations.', language: 'en' },
    { text: 'ですね。', language: 'ja' },
  ]);
  assert.deepEqual(splitSentenceForTts('「I gave them sweets so they could listen to me.」ですね。', L).map((p) => p.language), ['en', 'ja']);
  const ja = '「上司への発表」ですね。';
  assert.deepEqual(splitSentenceForTts(ja, L), [{ text: ja, language: 'ja' }]);
  // the stream boundary never ends a sentence inside the brackets: every
  // streamed prefix either has no boundary or one after the closing bracket
  const turn = '「I have learned how to make presentations.」ですね。 Good, that\'s a clear sentence.';
  for (let i = 1; i <= turn.length; i++) {
    const m = matchSentenceBoundary(turn.slice(0, i));
    if (m) assert.ok(!/[.!?]$/.test(m[1]) || !m[1].startsWith('「') || m[1].includes('」'), `prefix ${i}: "${m[1]}"`);
  }
  assert.deepEqual(splitIntoSpokenSentences(turn), ['「I have learned how to make presentations.」ですね。', "Good, that's a clear sentence."]);
  for (const q of ['“I gave them sweets so they could listen to me.”ですね。', '"I gave them sweets so they could listen to me."ですね。']) {
    assert.deepEqual(splitIntoSpokenSentences(q), [q], q);
    assert.deepEqual(splitSentenceForTts(q, L).map((p) => p.language), ['en', 'ja'], q);
  }
  // root cause: the turn's first sentence went out on the fast-opener path,
  // which bypassed speakOne (and its split). It now splits the same way.
  const v = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  const fo = v.indexOf('if (fastOpenerEligible) {');
  const foEnd = v.indexOf('} else if (gateState === \'gated\') {', fo);
  assert.ok(fo > 0 && foEnd > fo);
  const block = v.slice(fo, foEnd);
  assert.match(block, /const openerParts = splitSentenceForTts\(sentenceForSpeech, ttsSplitLanguagesRef\.current\);/);
  assert.match(block, /for \(const \{ text: openerPart \} of openerParts\) \{/);
  assert.doesNotMatch(block, /speakTextRef\.current\?\.\(sentenceForSpeech, /);
});

test('Task 27 §F (GDI run 14, 1093 s): "move on" is an order — move_on_ignored', () => {
  const LABELS = ['Summary', 'まとめ'];
  // 1093 s: in the pronunciation part (summary follows), no advance in the attempt
  assert.equal(moveOnIgnored({ studentText: 'Uh, let\'s do summary.', advanced: false, hasNextSegment: true, labels: LABELS }), true);
  assert.equal(moveOnIgnored({ studentText: "Let's do one more", advanced: false, hasNextSegment: true, labels: LABELS }), false);
  // in the summary part (nothing to advance to)
  assert.equal(moveOnIgnored({ studentText: 'Uh, let\'s do summary.', advanced: false, hasNextSegment: false, labels: [] }), false);
  // the attempt advanced
  assert.equal(moveOnIgnored({ studentText: 'Uh, let\'s do summary.', advanced: true, hasNextSegment: true, labels: LABELS }), false);
  for (const x of ['Skip.', 'Next part.', 'Summary.', 'Um, move on.', "Can we move on to the next part?", "I'd like to go to the summary.", 'Shall we skip to the end?', 'Please continue.', 'Could we wrap up?', 'Do summary.', "Let's go to the next part.", 'I want to start the summary.']) {
    assert.ok(moveOnRequestSpan(x, LABELS), x);
  }
  // a later part's label after do / go to / start, whole words only
  assert.ok(moveOnRequestSpan('Can we start conversation now?', ['Conversation']));
  assert.equal(moveOnRequestSpan('I had a conversation with my boss.', ['Conversation']), null);
  assert.equal(moveOnRequestSpan('Can we start conversations?', ['Conversation']), null, 'whole words');
  assert.ok(moveOnRequestSpan('まとめに進みたいです。', LABELS));
  // ordinary answers are no request
  for (const x of ['I do the summary report every Friday at work.', 'I continue to work on sales.', 'Next week I will visit the customer.']) {
    assert.equal(moveOnIgnored({ studentText: x, advanced: false, hasNextSegment: true, labels: LABELS }), false, x);
  }
  // Fix round 1 (I-1): the review's probes — in-part requests and short answers are no order
  const ALL = ['Pronunciation', 'Summary', 'まとめ', 'Conversation', 'Past simple'];
  for (const x of ["Let's do the next one.", "Let's do the next sentence.", 'Can we do the next question?', 'I do conversation at work.', 'I start conversation with customers.', "OK, let's move on to the next point.", 'I do summary every day.', 'Next.', "Let's do the next item.", 'I want to continue my English study.', 'I start work at nine.']) {
    assert.equal(moveOnIgnored({ studentText: x, advanced: false, hasNextSegment: true, labels: ALL }), false, x);
  }
  // a request plus an answer word is an answer
  assert.equal(moveOnIgnored({ studentText: "Yes, presentations. Let's move on.", advanced: false, hasNextSegment: true, labels: ALL }), false);
  assert.equal(moveOnIgnored({ studentText: "Okay, let's do the summary.", advanced: false, hasNextSegment: true, labels: ALL }), true);
  assert.equal(moveOnIgnored({ studentText: "Can we do past simple now?", advanced: false, hasNextSegment: true, labels: ALL }), true, 'a later label as a whole phrase');
  // the turn also answers the open question
  assert.equal(moveOnIgnored({ studentText: 'I have worked here for three years. Let\'s move on to the next part.', advanced: false, hasNextSegment: true, labels: LABELS }), false);
  assert.equal(MOVE_ON_IGNORED_REASON, 'The student asked to move on. Close this part in one sentence and call advance_lesson now. No practice, no repeat. Start directly with your reply — no opener such as Okay / Alright / Let\'s keep going / Sorry about that. Apply this silently; never mention this note.');
  const v = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(v.includes("rejectionsThisAttempt.push({ action: 'move_on_ignored', reason: MOVE_ON_IGNORED_REASON });"));
  assert.ok(v.includes("advanced: toolNamesThisAttempt.includes('advance_lesson') || moSegId !== turnStartSegmentId,"));
  assert.ok(v.includes("if (TUTOR_MOVE_ON_ORDER && !attemptKilled && !moveOnRejected && attemptText && !/^\\s*\\[/.test(transcript)) {"));
});

test('Task 28 §D (GDI run 15, 444–518 s): no repeat ask after two failed tries of the same sentence', () => {
  const seg = 'present-perfect';
  const T444 = 'Good, "I have learned how to make good presentations" is a natural way to say it. Can you say that once more, with "presentations" in the plural?';
  const T461 = 'The board card is up. Please say the whole sentence with "presentations" in the plural.';
  const T497 = 'Take your time. Would you like a hint, or a little more time to think about "presentations"?';
  const T503 = 'Your sentence is understandable, but the word should be "presentations," with the s on the end. Could you say the whole sentence once more: "I have learned how to make good presentations."?';
  const after = (t: RepeatAskTries | null, tutorText: string, runtimeTriggered = false) => repeatAskTriesAfterTutorTurn(t, { tutorText, segmentId: seg, runtimeTriggered });
  const said = (t: RepeatAskTries | null, studentText: string) => repeatAskTriesAfterStudentTurn(t, { studentText, segmentId: seg });
  // replay the run: ask (444) → try 1 (458, incorrect) → ask again (461) → nudge (497) → try 2 (501) → the 503 s attempt
  let tries = after(null, T444);
  assert.deepEqual(tries, { sentence: 'i have learned how to make good presentations', words: ['presentations'], segmentId: seg, attempts: 0 });
  tries = said(tries, 'I have learned how to make good presentation.');
  assert.equal(tries?.attempts, 1);
  assert.equal(repeatAskAfterTwoTries({ tries, attemptText: T461, segmentId: seg }), false, 'one prior attempt → allowed (the §G rule decides)');
  tries = after(tries, T461);
  assert.equal(tries?.attempts, 1, 'the same target (a quoted word of the tracked sentence) keeps the count');
  tries = after(tries, T497, true);
  assert.equal(tries?.attempts, 1, 'the idle nudge (runtime) keeps it');
  tries = said(tries, 'I have learned how to make good present at ions.');
  assert.equal(tries?.attempts, 2);
  assert.equal(repeatAskAfterTwoTries({ tries, attemptText: T503, segmentId: seg }), true, 'the 503 s attempt → reject');
  assert.equal(repeatAskAfterTwoTries({ tries, attemptText: T461, segmentId: seg }), true, 'a word-only re-ask of it too');
  assert.equal(repeatAskAfterTwoTries({ tries, attemptText: 'Can you say that once more?', segmentId: seg }), true, 'an ask pointing back at it too');
  // allowed after two tries: a new model sentence, moving on, another segment
  assert.equal(repeatAskAfterTwoTries({ tries, attemptText: 'Good effort. Now say this one: "This skill has helped me at work."', segmentId: seg }), false, 'a new model sentence');
  assert.equal(repeatAskAfterTwoTries({ tries, attemptText: 'Good, you have the right structure: "I have learned how to make good presentations." Let\'s move on. Can you tell me one way this skill has helped you at work?', segmentId: seg }), false, 'moving on');
  assert.equal(repeatAskAfterTwoTries({ tries, attemptText: T503, segmentId: 'past-simple' }), false, 'the segment advanced');
  // the counter resets: a new model sentence, a turn that moves on, a new segment
  assert.equal(after(tries, 'Now say this one: "This skill has helped me at work."')?.attempts, 0);
  assert.equal(after(tries, 'Good. Can you tell me one way this skill has helped you at work?'), null);
  assert.equal(repeatAskTriesAfterTutorTurn(tries, { tutorText: T503, segmentId: 'past-simple', runtimeTriggered: false })?.attempts, 0);
  assert.equal(repeatAskTriesAfterStudentTurn(tries, { studentText: 'I have learned how to make good presentations.', segmentId: 'past-simple' }), null);
  // not attempts: a question, a non-answer, a bracketed directive
  const one = said(after(null, T444), 'I have learned how to make good presentation.');
  assert.equal(said(one, 'Can I say it in Japanese?')?.attempts, 1);
  assert.equal(said(one, "Sorry, I don't understand.")?.attempts, 1);
  assert.equal(said(one, '[System note: the student has been silent.]')?.attempts, 1);
  // the target word alone is an attempt
  assert.equal(said(one, 'presentations')?.attempts, 2);
  assert.deepEqual(repeatAskTargetOf('What did you do next?'), null);
  assert.ok(REPEAT_ASK_AFTER_TWO_TRIES_REASON.startsWith('The student has tried this twice. Say the correct form once yourself, accept their effort in one sentence, and continue with the next question. Do not ask them to say it again.'));
  const v = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(v.includes("rejectionsThisAttempt.push({ action: 'repeat_ask_after_two_tries', reason: REPEAT_ASK_AFTER_TWO_TRIES_REASON });"));
  assert.ok(v.includes("repeatAskAfterTwoTries({ tries: repeatAskTriesRef.current, attemptText, segmentId: turnStartSegmentId ?? '' })"));
  assert.ok(v.includes("repeatAskTriesRef.current = repeatAskTriesAfterStudentTurn(repeatAskTriesRef.current, { studentText: transcript, segmentId: turnStartSegmentId ?? '' });"));
  assert.ok(v.includes("repeatAskTriesRef.current = repeatAskTriesAfterTutorTurn(repeatAskTriesRef.current, { tutorText: fullText, segmentId: currentSegmentIdRef.current ?? '', runtimeTriggered: /^\\s*\\[/.test(transcript) });"));
  assert.ok(readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8').includes("'repeat_ask_after_two_tries',"));
  assert.ok(readFileSync('src/lib/tutor/orchestrator/flags.ts', 'utf8').includes("export const TUTOR_REPEAT_ASK_TWO_TRIES = process.env.NEXT_PUBLIC_TUTOR_REPEAT_ASK_TWO_TRIES !== 'off';"));
});

test('Task 28 fix round 1 (m-4, m-5): a rewording keeps the count; a quoted function word is no target word', () => {
  const seg = 'present-perfect';
  let tries = repeatAskTriesAfterTutorTurn(null, { tutorText: 'Can you say that once more: "I have learned how to make good presentations."?', segmentId: seg, runtimeTriggered: false });
  tries = repeatAskTriesAfterStudentTurn(tries, { studentText: 'I have learned how to make good presentation.', segmentId: seg });
  tries = repeatAskTriesAfterStudentTurn(tries, { studentText: 'I have learn how to make good presentation.', segmentId: seg });
  assert.equal(tries?.attempts, 2);
  // a contraction rewording / one added word after two tries → still the same target → reject
  assert.equal(repeatAskAfterTwoTries({ tries, attemptText: 'Please say it again: "I\'ve learned how to make good presentations."', segmentId: seg }), true);
  assert.equal(repeatAskAfterTwoTries({ tries, attemptText: 'Please say it again: "I have learned how to make really good presentations."', segmentId: seg }), true);
  assert.equal(repeatAskTriesAfterTutorTurn(tries, { tutorText: 'Say it once more: "I\'ve learned how to make good presentations."', segmentId: seg, runtimeTriggered: false })?.attempts, 2);
  // a different sentence is still a new target
  assert.equal(repeatAskAfterTwoTries({ tries, attemptText: 'Now say this one: "This skill has helped me at work."', segmentId: seg }), false);
  // m-5: "the" quoted as the fix is no word to say — a reply holding "the" is no attempt by itself
  let t2 = repeatAskTriesAfterTutorTurn(null, { tutorText: 'Please say it again with "the" before USA: "I sell to the USA."', segmentId: seg, runtimeTriggered: false });
  assert.ok(t2);
  t2 = repeatAskTriesAfterStudentTurn(t2, { studentText: 'The weather is nice today.', segmentId: seg });
  assert.equal(t2?.attempts, 0);
});

console.log(`\n${passed} passed, ${failed} failed`);
test('Task 30 fix round 1 S8: repeat_after_correct stands down for other_part / neither / an already-affirmed sentence', () => {
  const S = 'Yes, I have worked at my company for five years.';
  const none = new Set<string>();
  assert.equal(repeatAfterCorrectStandDown({ answers: 'other_part', repeated: S, affirmedBefore: none }), 'other_part');
  assert.equal(repeatAfterCorrectStandDown({ answers: 'neither', repeated: S, affirmedBefore: none }), 'neither');
  assert.equal(repeatAfterCorrectStandDown({ answers: 'this_question', repeated: S, affirmedBefore: new Set([cleanStudentSentence(S)]) }), 'already affirmed');
  assert.equal(repeatAfterCorrectStandDown({ answers: 'this_question', repeated: S, affirmedBefore: none }), null, 'a fresh correct repeat ⇒ the kill as before');
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("onDebugEvent?.('repeat_after_correct_skipped', `${racSkip} \"${repeated.slice(0, 60)}\"`);"));
  assert.ok(vtr.includes('if (affirmedKey) affirmedStudentSentencesRef.current.add(affirmedKey);'));
});

test('Task 30 fix round 2 E7: every validator retry directive carries the no-opener style clause', () => {
  const SC = "Start directly with your reply — no opener such as Okay / Alright / Let's keep going / Sorry about that.";
  for (const [name, r] of [
    ['transition_ask_off_part', TRANSITION_ASK_REASON_E7],
    ['repeat_after_correct', REPEAT_AFTER_CORRECT_REASON],
    ['repeat_ask_third_version', REPEAT_ASK_THIRD_VERSION_REASON],
    ['move_on_ignored', MOVE_ON_IGNORED_REASON],
    ['transition_offer_missing', fixedScriptOfferMissingReasonE7(null, 'a', 'b')],
  ] as const) {
    assert.ok(r.includes(SC), name);
    assert.ok(r.endsWith('Apply this silently; never mention this note.'), name);
  }
});

test('Task 30 fix round 3 R2-2a: same_question_third_time — the same ask a third time with no answer in between', () => {
  const T230 = 'Ask again, simply: if you have given a presentation many times over your career, would you use the past simple or the present perfect? Just say which one you think, with a short reason.';
  const T259 = 'If you have given a presentation many times over your career, would you use past simple or present perfect? Tell me which one, with a short reason.';
  const T302 = "Just to make sure we're on the same page: the question is whether you'd use past simple or present perfect for a presentation you've given many times over your career. Which one would you choose?";
  const T355 = "Yes, that's a good reason. Now, which tense would you choose for a presentation you've given many times over your career, past simple or present perfect?";
  const g = (t: string) => turnAskGist(t);
  assert.equal(sameQuestionThirdTime({ askGists: [g(T230), g(T259), g(T259)], answered: [false, false] }), true);
  assert.equal(sameQuestionThirdTime({ askGists: [g(T230), g(T259), g(T259)], answered: [false, true] }), false, 'an answer in between ⇒ no kill');
  assert.equal(sameQuestionThirdTime({ askGists: [g(T230), g(T259), g('Great. Next, tell me about a project you are proud of.')], answered: [false, false] }), false, 'a different question');
  assert.equal(sameQuestionThirdTime({ askGists: ['', g(T259), g(T259)], answered: [false, false] }), false);
  void T302; void T355;
  assert.equal(studentAnsweredAsk({ verdict: 'correct', answers: 'this_question' }), true);
  assert.equal(studentAnsweredAsk({ verdict: 'correct', answers: 'other_part' }), false);
  assert.equal(studentAnsweredAsk({ verdict: 'incorrect', answers: 'this_question' }), false);
  assert.equal(studentAnsweredAsk(null, 'OK.'), false);
  assert.ok(SAME_QUESTION_THIRD_TIME_REASON.startsWith('You have asked this twice already. Give the answer yourself in one short sentence, then ask a DIFFERENT, easier question or move to the next item. Do not say that the question was asked before. Start directly with your reply'));
  assert.ok(SAME_QUESTION_THIRD_TIME_REASON.endsWith('Apply this silently; never mention this note.'));
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("const sqReason = sameQuestionThirdTimeReason({ question: sqAsk, authoredAnswer: sqAuthored, studentRecent: transcriptRef.current.filter((e) => e.role === 'student').slice(-6).map((e) => e.text), languageLesson: subject === 'languages' || isFixedScriptPlan(lessonPlanRef.current) });"));
  assert.ok(vtr.includes("rejectionsThisAttempt.push({ action: 'same_question_third_time', reason: sqReason });"));
  assert.ok(vtr.includes("onDebugEvent?.('same_question_third_time_unmade',"));
});

test('Task 30 fix round 3 R2-3: a real word is never split; a split rewrites the typed entry (one student turn)', () => {
  assert.equal(splitRunTogetherEnglishR3('Did you attend any business events or exhibitions last year?'), 'Did you attend any business events or exhibitions last year?');
  assert.equal(splitRunTogetherEnglishR3('I went there lastyear'), 'I went there last year');
  assert.equal(splitRunTogetherEnglishR3('Iwenttoplaygolfyesterday'), 'I went to play golf yesterday');
  assert.equal(isKnownWordFormR3('presentations'), true);
  const entries = [{ id: 't1', role: 'tutor', text: 'Hi' }, { id: 's1', role: 'student', text: 'I went there lastyear' }];
  const out = replaceLastStudentEntryR3(entries, 'I went there lastyear', 'I went there last year', 's1');
  assert.ok(out && out.length === 2 && out[1]!.text === 'I went there last year', 'replaced, not appended');
  assert.equal(replaceLastStudentEntryR3([{ id: 't1', role: 'tutor', text: 'Hi' }], 'a', 'b', 't1'), null);
});

test('Task 30 fix round 4 Q-3: same_question_third_time needs the SAME question and an unanswered student turn', () => {
  const g = (t: string) => turnAskGist(t);
  // different questions with a shared stem (Jaccard 0.71) ⇒ no fire
  assert.equal(sameQuestionThirdTime({ askGists: [g('Can you tell me about your last project?'), g('Can you tell me about your last holiday?'), g('Can you tell me about your last meeting?')], answered: [false, false] }), false);
  // r2 147–437 s: "… past simple or present perfect?" ×3 with "OK, thank you." / "OK." / an off-topic sentence between ⇒ fires
  const T230 = 'Ask again, simply: if you have given a presentation many times over your career, would you use the past simple or the present perfect? Just say which one you think, with a short reason.';
  const T259 = 'If you have given a presentation many times over your career, would you use past simple or present perfect? Tell me which one, with a short reason.';
  const okThanks = studentAnsweredAsk({ verdict: 'cannot_determine', answers: 'neither' }, 'OK, thank you.');
  const ok = studentAnsweredAsk(null, 'OK.');
  const iSee = studentAnsweredAsk({ verdict: 'cannot_determine', answers: 'open_question' }, 'I see.');
  const offTopic = studentAnsweredAsk({ verdict: 'incorrect', answers: 'other_part' }, 'Last month I made a presentation for a new product launch.');
  assert.deepEqual([okThanks, ok, iSee, offTopic], [false, false, false, false]);
  assert.equal(sameQuestionThirdTime({ askGists: [g(T230), g(T259), g(T259)], answered: [okThanks, ok] }), true);
  assert.equal(sameQuestionThirdTime({ askGists: [g(T259), g(T259), g(T259)], answered: [iSee, offTopic] }), true);
  // same question ×3 with a 6-word cannot_determine reply between ⇒ answered ⇒ no fire
  const sixWords = studentAnsweredAsk({ verdict: 'cannot_determine', answers: 'open_question' }, 'Because my customers are from overseas.');
  assert.equal(sixWords, true);
  assert.equal(sameQuestionThirdTime({ askGists: [g(T259), g(T259), g(T259)], answered: [ok, sixWords] }), false);
  assert.equal(studentAnsweredAsk(null, 'I think it is the present perfect.'), true, 'missing verdict with ≥ 4 words ⇒ answered');
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.equal((vtr.match(/studentAnsweredAsk\(verdictPrecheckRef\.current, transcript\)/g) ?? []).length, 2);
});

test('Task 30 fix round 4 Q-4: the rewrite replaces only the entry created in this turn (by id)', () => {
  const prev = [{ id: 'tutor-1', role: 'tutor', text: 'How many?' }, { id: 'user-1', role: 'student', text: '3' }, { id: 'tutor-2', role: 'tutor', text: 'And now?' }, { id: 'user-2', role: 'student', text: '3' }];
  // this turn's entry (user-2) ⇒ rewritten
  const ok = replaceLastStudentEntryR3(prev, '3', 'three', 'user-2');
  assert.ok(ok && ok[3]!.text === 'three' && ok[1]!.text === '3');
  // the voice path appends after dispatch: the last entry is the PREVIOUS turn's identical "3" ⇒ untouched
  const voice = prev.slice(0, 2);
  assert.equal(replaceLastStudentEntryR3(voice, '3', 'three', null), null);
  assert.equal(replaceLastStudentEntryR3(voice, '3', 'three', 'user-9'), null);
  const m = new Map<string, string>();
  rememberStudentEntryIdR4(m, '3', 'user-1');
  rememberStudentEntryIdR4(m, '3', 'user-2');
  assert.equal(m.get('3'), 'user-2', 'latest wins');
  for (let i = 0; i < 30; i++) rememberStudentEntryIdR4(m, `t${i}`, `id${i}`);
  assert.ok(m.size <= 20, 'bounded');
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('const replacedEntries = replaceLastStudentEntry(transcriptRef.current, transcript, split, turnStudentEntryId);'));
  assert.ok(vtr.includes('const replacedEntries = replaceLastStudentEntry(transcriptRef.current, transcript, spelled, turnStudentEntryId);'));
  assert.ok(vtr.includes('const turnStudentEntryId = studentEntryIdByTextRef.current.get(transcript) ?? null;'));
  assert.equal((vtr.match(/rememberStudentEntryId\(studentEntryIdByTextRef\.current, /g) ?? []).length, 2, 'voice-finalize + typed appends record their id');
});

test('Task 31 §F (GDI run 18, 979–1061 s): two answered questions on the same point ⇒ the check-in note', () => {
  const T79 = 'Sweets, that\'s a fun idea. Let\'s check the words. You said "give sweets to people to get them to pay," which is clear. Did the sweets help people decide to donate?';
  const T81 = '「people feel good when they receive sweets」ですね、わかりました。 Sweets made people feel happy, so it\'s a kind, friendly approach. Did the sweets actually help people decide to donate, yes or no?';
  const T77 = 'Convincing people to donate is a real challenge. How did you approach that, and what worked?';
  const a80 = 'Uh, people feel good when they receive sweets.';
  const a82 = 'Uh, no, but they felt good and they listened to me.';
  assert.equal(probeCheckinDue([{ tutorText: T79, studentText: a80 }, { tutorText: T81, studentText: a82 }]), true, 'two questions + two answers ⇒ note');
  assert.equal(probeCheckinDue([{ tutorText: T79, studentText: a80 }, { tutorText: T81, studentText: 'Why do you ask?' }]), false, 'a student answer that is a question ⇒ no note');
  assert.equal(probeCheckinDue([{ tutorText: T79, studentText: a80 }, { tutorText: T81, studentText: 'OK.' }]), false, 'a bare acknowledgement ⇒ no note');
  assert.equal(probeCheckinDue([{ tutorText: T79, studentText: a80 }, { tutorText: 'Good. That is a kind idea.', studentText: a82 }]), false, 'no question in the second turn');
  assert.equal(probeCheckinDue([{ tutorText: T77, studentText: 'I give sweets to people.' }, { tutorText: T79, studentText: a80 }]), false, 'different points ⇒ no note');
  assert.equal(PROBE_CHECKIN_NOTE, '[runtime note — not from the student] The student has answered your last two questions. Do not ask a third follow-up on the same point: acknowledge, give your own one-line answer or summary of the point if needed, and move to the next step of the part. Apply this silently; never mention this note.]');
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  // fix round 1 (I-4): a language lesson (subject or fixed-script plan), never languageSessionRef (bilingual maths)
  assert.ok(vtr.includes("if (TUTOR_PROBE_CHECKIN && (subject === 'languages' || isFixedScriptPlan(lessonPlanRef.current)) && !opts?.prefetchOnly && !/^\\s*\\[/.test(transcript)) {"));
  assert.ok(!vtr.includes('if (TUTOR_PROBE_CHECKIN && languageSessionRef.current'), 'not gated on the bilingual-session ref');
  assert.ok(vtr.includes('runTranscript = `${PROBE_CHECKIN_NOTE}\\n\\n${runTranscript}`;'));
  assert.ok(vtr.includes('probeExchangesRef.current = [...probeExchangesRef.current.slice(-1), { tutorText: peTutor, studentText: transcript }];'));
  assert.match(readFileSync('src/lib/tutor/orchestrator/flags.ts', 'utf8'), /export const TUTOR_PROBE_CHECKIN = process\.env\.NEXT_PUBLIC_TUTOR_PROBE_CHECKIN !== 'off';/);
});

// Task 33 §D (bot run r8, 715 s): a personal question has no answer to give.
test('33 §D: same_question_third_time — personal question with no authored answer ⇒ accept / let go, never a fact', () => {
  assert.equal(isPersonalQuestion('What was the trade show about?'), false, 'no second person and nothing the student told');
  assert.equal(isPersonalQuestion('What was the trade show about?', ['Yes, I went to a trade show in Tokyo last year.']), true, 'the student told it');
  assert.equal(sameQuestionThirdTimeReason({ question: 'What was the trade show about?', authoredAnswer: false, studentRecent: ['Yes, I went to a trade show in Tokyo last year.'], languageLesson: true }), SAME_QUESTION_THIRD_TIME_PERSONAL_REASON, 'the 715 s case');
  assert.equal(isPersonalQuestion('What did you see at the trade show?'), true);
  assert.equal(isPersonalQuestion('Did you go with your team, or alone?'), true);
  assert.equal(isPersonalQuestion('Which tense would you use with "last year"?'), false, 'a language question has an answer');
  assert.equal(sameQuestionThirdTimeReason({ question: 'What did you see at the trade show?', authoredAnswer: false, languageLesson: true }), SAME_QUESTION_THIRD_TIME_PERSONAL_REASON);
  assert.equal(sameQuestionThirdTimeReason({ question: 'What did you see at the trade show?', authoredAnswer: true, languageLesson: true }), SAME_QUESTION_THIRD_TIME_REASON);
  assert.equal(sameQuestionThirdTimeReason({ question: 'Which tense would you use with "last year"?', authoredAnswer: false, languageLesson: true }), SAME_QUESTION_THIRD_TIME_REASON);
  assert.ok(SAME_QUESTION_THIRD_TIME_PERSONAL_REASON.startsWith('This is a question about the student; there is no answer to give. Accept what they said in one sentence or let it go, and move to the next step. Never state facts about the student they did not say.'));
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('const sqAuthored = !!sqCard?.expectedAnswer && !!sqCard.statement && askGistsSame(sqAsk, turnAskGist(sqCard.statement));'));
});

test('33 r1 I-3: personal-question directive is language-lesson only; maths questions keep the answer directive', () => {
  for (const q of ['What is the slope of your line?', 'What is the slope?', 'How many apples does Sam have?', 'What did you get for the area?', 'What is your answer for part b?']) {
    assert.equal(sameQuestionThirdTimeReason({ question: q, authoredAnswer: false, studentRecent: ['the slope is two', 'Sam has apples', 'the area'], languageLesson: false }), SAME_QUESTION_THIRD_TIME_REASON, `${q} (maths session)`);
  }
  for (const q of ['What is the slope of your line?', 'What is the slope?', 'How many apples does Sam have?', 'What did you get for the area?', 'What is x if you add 3?'])
    assert.equal(sameQuestionThirdTimeReason({ question: q, authoredAnswer: false, studentRecent: ['the slope is two', 'Sam has apples', 'the area'], languageLesson: true }), SAME_QUESTION_THIRD_TIME_REASON, `${q} (maths shape)`);
  // Fix round 2: no bare "answer" / digit marker — these stay personal in a language lesson.
  for (const q of ['What was your answer?', 'What did you do in 2020?'])
    assert.equal(sameQuestionThirdTimeReason({ question: q, authoredAnswer: false, languageLesson: true }), SAME_QUESTION_THIRD_TIME_PERSONAL_REASON, q);
  assert.equal(sameQuestionThirdTimeReason({ question: 'What did you see at the trade show?', authoredAnswer: false, languageLesson: false }), SAME_QUESTION_THIRD_TIME_REASON, 'outside a language lesson');
  assert.equal(readFileSync('src/lib/tutor/voice/correct-retry.ts', 'utf8').includes('present perfect|'), false, 'no topic words in code (M-4)');
});

test('33 r1 R9-3: the personal retry never re-asks — the directive forbids it and the engine drops a re-ask', () => {
  assert.ok(SAME_QUESTION_THIRD_TIME_PERSONAL_REASON.includes('Do NOT ask that question again in any form.'));
  const pinned = 'what did you learn at that trade show?';
  assert.equal(retryReasksQuestion('Now, please answer my question in one sentence: What did you learn at that trade show?', pinned), true, 'the 688 s re-ask');
  assert.equal(retryReasksQuestion('What did you learn at the trade show?', pinned), true, 'reworded');
  assert.equal(retryReasksQuestion('Did you go there with your team?', pinned), false, 'a different question');
  assert.equal(retryReasksQuestion('You went to a trade show in Tokyo, and that is a good example.', pinned), false, 'the acknowledgement');
  assert.equal(isStarterHint('Start with "I learned…".'), true);
  assert.equal(isStarterHint('Try starting with "I learned…".'), true);
  assert.equal(isStarterHint('Good start.'), false);
  assert.equal(sameQuestionMoveOnLine(['en', 'ja']), "Let's move on.");
  assert.equal(sameQuestionMoveOnLine(['ja']), '次に進みましょう。');
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('if (sqReason === SAME_QUESTION_THIRD_TIME_PERSONAL_REASON) sqPersonalPinned = sqAsk;'));
  assert.ok(vtr.includes("if (sqPersonalPinned && (retryReasksQuestion(updatedSentence, sqPersonalPinned) || (sqReaskDroppedPrev && isStarterHint(updatedSentence)))) {"));
  assert.ok(vtr.includes("if (!attemptKilled && sqPersonalPinned && attempt > 0 && turnNarrationRef.current.length === attemptNarrationStart) {"));
});

test('33 r2 R9-3: paraphrases and statement-form re-asks of the pinned question are caught', () => {
  const pinned = 'what did you learn at that trade show?';
  for (const x of ['What did you learn there?', 'Please tell me what you learned.', 'Tell me what you learned at the trade show.', 'So what did you learn at the show?'])
    assert.equal(retryReasksQuestion(x, pinned), true, x);
  for (const x of ['What did you see there?', 'Did you go with your team?', 'You learned a lot at the trade show, I am sure.', 'Tell me about your weekend.', 'That is a good example.'])
    assert.equal(retryReasksQuestion(x, pinned), false, x);
});

if (failed) process.exit(1);
