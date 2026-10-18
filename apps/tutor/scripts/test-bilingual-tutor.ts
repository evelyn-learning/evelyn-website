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
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { SentenceBuffer } from '../src/lib/tutor/voice/claude-brain';
import { buildBilingualClause, buildSystemPromptParts } from '../src/lib/tutor/ai/system-prompt-builder';
import { parseTutorLanguages, ttsLanguageFor } from '../src/lib/tutor/voice/tts-language';
import { isProseNotLatex } from '../src/lib/tutor/whiteboard/inline-math';
import { rewriteForTTS } from '../src/lib/tutor/voice/tts-pronunciation';
import { latexAsProse } from '../src/lib/tutor/whiteboard/prose-latex';
import { classifyTranscript, sessionAllowsNonLatin } from '../src/lib/tutor/voice/transcript-filters';
import { buildJudgeUserContent } from '../src/lib/tutor/judge-prompt';
import { isPleasantryOnly, isTutorFarewell, isSessionEndSignalJa } from '../src/lib/tutor/voice/lesson-close';
import { splitRunTogetherEnglish } from '../src/lib/tutor/voice/run-together-english';
import { hasKatakanaEnglish } from '../src/lib/tutor/voice/katakana-english';
import { saysCannotSeeScreen, VOICE_ONLY_NOTE_FIRST } from '../src/lib/tutor/voice/voice-only';
import { asksForEnglish, hasNoLatinLetters, isStudentRepeatRequest, NO_ENGLISH_REPLY_NOTE } from '../src/lib/tutor/voice/english-reply';
import { isRetryAsk, retryCapNote, RETRY_CAP_NOTE } from '../src/lib/tutor/voice/retry-cap';
import { readPacingVerdict } from '../src/lib/tutor/voice/pacing-verdict';
import { shouldClearQpinOnAnswer } from '../src/lib/tutor/qpin-behavior';
import { sentenceVerdictStance } from '../src/lib/tutor/voice/voice-judging';
import { opensWithDenial } from '../src/lib/tutor/voice/verdict-precheck-shared';
import { opensWithAffirmingVerdict } from '../src/lib/tutor/voice/nonanswer-praise';
import { refersToLearnerInThirdPerson, LEARNER_ADDRESS_NOTE } from '../src/lib/tutor/voice/learner-address';
import { overusesSuperlative, hasSuperlativePraise, PRAISE_VARIETY_NOTE, PRAISE_STICKY_AFTER_PLANTS } from '../src/lib/tutor/voice/praise-variety';
import { reAskedCheckedCorrect, CORRECT_RETRY_NOTE } from '../src/lib/tutor/voice/correct-retry';
import { decideLessonCloseAutoEnd, LESSON_CLOSE_AUTO_END_MS } from '../src/lib/tutor/voice/lesson-close';
import { TUTOR_LESSON_CLOSE_AUTO_END } from '../src/lib/tutor/orchestrator/flags';
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
import { reAskedOwnSentence, OWN_SENTENCE_RETRY_NOTE } from '../src/lib/tutor/voice/correct-retry';
import { findUnreadableWords, latinWords, unreadableWordNote } from '../src/lib/tutor/voice/unreadable-word';
import { englishInstructionSentences, romajiSentences, ENGLISH_INSTRUCTION_NOTE, ROMAJI_NOTE, LANGUAGE_KEEP_NOTE } from '../src/lib/tutor/voice/tutor-language-drift';
import { isLateTail, lateTailNote, LATE_TAIL_MAX_TUTOR_TURN_MS } from '../src/lib/tutor/voice/late-tail';
import { reAskedAnsweredQuestion, englishQuestions, REASKED_QUESTION_NOTE } from '../src/lib/tutor/voice/correct-retry';
import { recordAnsweredQuestions, reAskedEarlierQuestion, REASKED_EARLIER_QUESTION_NOTE, saysAlreadyAnswered, ALREADY_ANSWERED_NOTE } from '../src/lib/tutor/voice/correct-retry';
import { ToolMarkupFilter, stripToolMarkup, hasToolMarkup } from '../src/lib/tutor/voice/tool-markup';
import { languageTurnMaxTokens, outputBudgetNote, settleHeldTail, endsSentence, LANGUAGE_TURN_MAX_TOKENS_DEFAULT } from '../src/lib/tutor/voice/output-budget';
import { decidePostCloseUtterance, postCloseSilenceKind, POST_CLOSE_NOTE } from '../src/lib/tutor/voice/lesson-close';
import { praiseNoteIsSticky, PRAISE_SESSION_SUPERLATIVE_STICKY } from '../src/lib/tutor/voice/praise-variety';
import { hasKatakanaEnglishFromStt, KATAKANA_ECHO_NOTE } from '../src/lib/tutor/voice/katakana-english';

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
  assert.ok(embed.includes('TUTOR_THINKING_CUE && parseThinkingCue(config.thinking_cue)') && embed.includes('thinkingCue={thinkingCue}'));
  assert.ok(ts.includes('thinkingCue={thinkingCue}') && ts.includes('thinkingCueText={thinkingCueText}'));
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
  assert.ok(/cmd\.action === 'closeSessionNotes'\) \{[\s\S]{0,200}lessonClosedRef\.current = true/.test(vtr));
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
  assert.ok(vtr.includes("onDebugEvent?.('lesson_closed', 'mutual farewell"));
});

test('english-reply: an English ask answered with no Latin letters gets the note (embed-1792254012923 seq 32)', () => {
  for (const t of ['では、二つの形をまとめますね。「海外に行ったことがありますか」を英語で言ってみましょう。', 'In English, please: have you ever been abroad?', 'もう一度、I sang karaoke last week、と言ってみてください。', 'Say it once more for me.']) assert.equal(asksForEnglish(t), true, t);
  for (const t of ['いいですね。 Yes, I have. I went to Hawaii six years ago. バッチリです。', 'いつ行きましたか。', 'What did you do yesterday?']) assert.equal(asksForEnglish(t), false, t);
  assert.equal(hasNoLatinLetters('えっと、海外に行ったことがありますか?英語にするんでしたよね。でも、はい、ハワイに行きましたと答えたくなります。'), true);
  assert.equal(hasNoLatinLetters('はい、アイサンカロケラストウィーク。これでどうでしょう'), true);
  assert.equal(hasNoLatinLetters('はい。はい。Yes , I have I went to Hawaii 6 years ago .これで大丈夫でしょうか。'), false);
  assert.ok(NO_ENGLISH_REPLY_NOTE.includes('katakana'));
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('askedForEnglishRef.current = asksForEnglish(fullText);'));
  assert.ok(vtr.includes("onDebugEvent?.('no_english_reply_note'"));
  const embed = readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8');
  assert.ok(embed.includes("'no_english_reply'"));
});

// ── embed-1792261973710 (2026-10-17) ─────────────────────────────────────────

test('Ink turn-end timeout defaults to 3000 ms (was 5600; decided 2026-10-17)', () => {
  const hook = readFileSync('src/app/tutor/hooks/useCartesiaInkWS.ts', 'utf8');
  assert.ok(hook.includes('NEXT_PUBLIC_TUTOR_INK_TURN_END_TIMEOUT_MS, 3000)'));
  assert.ok(!hook.includes('NEXT_PUBLIC_TUTOR_INK_TURN_END_TIMEOUT_MS, 5600)'));
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
});

test('lesson close → quiet auto-end: 45 s, deferred while busy, re-armed by a post-close turn', () => {
  assert.equal(LESSON_CLOSE_AUTO_END_MS, 45_000);
  assert.equal(decideLessonCloseAutoEnd({ busy: true, elapsedMs: 120_000 }), 'recheck');
  assert.equal(decideLessonCloseAutoEnd({ busy: false, elapsedMs: 44_000 }), 'recheck');
  assert.equal(decideLessonCloseAutoEnd({ busy: false, elapsedMs: 45_000 }), 'end');
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.equal(vtr.split('armLessonCloseAutoEndRef.current();').length - 1, 3, 'armed at both close sites and on a post-close student turn');
  assert.ok(vtr.includes("onDebugEvent?.('lesson_closed_auto_end'"));
  assert.ok(vtr.includes("if (!TUTOR_LESSON_CLOSE_AUTO_END || sessionMode === 'text') return;"));
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

test('own-sentence re-ask: a repeat-ask quoting the sentence the student just said', () => {
  const student = 'I went to the office yesterday .';
  assert.equal(reAskedOwnSentence(student, 'Nice. 言ってみましょう。 I went to the office yesterday. — 完璧です。'), true);
  assert.equal(reAskedOwnSentence(student, 'I went to the office yesterday. — 完璧です。 では次です。'), false, 'no repeat-ask');
  assert.equal(reAskedOwnSentence(student, '言ってみましょう。 I went to the office last week.'), false, 'different sentence');
  assert.equal(reAskedOwnSentence('Yes', '言ってみましょう。Yes, I have.'), false, 'too short to count');
  assert.match(OWN_SENTENCE_RETRY_NOTE, /JUST said/);
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
  assert.equal(languageTurnMaxTokens(base), 320);
  assert.equal(languageTurnMaxTokens({ ...base, cap: 260 }), 260);
  assert.equal(languageTurnMaxTokens({ ...base, needsHeadroom: true }), undefined, 'tool-carrying turn keeps the normal cap');
  assert.equal(languageTurnMaxTokens({ ...base, voice: false }), undefined, 'text session');
  assert.equal(languageTurnMaxTokens({ ...base, languageLesson: false }), undefined, 'maths lesson');
  assert.equal(languageTurnMaxTokens({ ...base, cap: null }), undefined, 'flag off');
  assert.match(outputBudgetNote(320), /320 tokens/);
  assert.match(outputBudgetNote(320), /at most three sentences/);
  assert.match(outputBudgetNote(320), /never mention this note/);
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
  for (const s of ['ありがとうございました', 'はい、さようなら', "I'm sorry, I couldn't pull the report.", 'Thank you so much, Ryota.', 'Okay I will do that.', 'えーと、今日は楽しかったです。', 'また次回もお願いします']) {
    assert.equal(decidePostCloseUtterance(s), 'silence', s);
  }
  for (const s of ['すみません、もう一つ質問があります', 'ちょっと待ってください', '続けてもいいですか', 'kayaking は英語で何と言いますか', 'Can I ask one more question?', 'wait', 'What do you prefer?', '宿題はありますか']) {
    assert.equal(decidePostCloseUtterance(s), 'answer', s);
  }
  assert.equal(postCloseSilenceKind('ありがとうございました'), 'pleasantry');
  assert.equal(postCloseSilenceKind('Okay I will do that.'), 'chatter');
  assert.match(POST_CLOSE_NOTE, /close_session_notes/);
  assert.match(POST_CLOSE_NOTE, /one or two sentences/);
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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
