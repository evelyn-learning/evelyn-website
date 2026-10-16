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
import { isPleasantryOnly } from '../src/lib/tutor/voice/lesson-close';
import { splitRunTogetherEnglish } from '../src/lib/tutor/voice/run-together-english';
import { isRetryAsk } from '../src/lib/tutor/voice/retry-cap';
import { pickLivenessReply } from '../src/lib/tutor/voice/cover-layer';
import { renderVoiceCadenceBlock } from '../src/lib/tutor/pedagogy/voice-cadence';
import { isMetaNarration, stripLeakedLabels, stripEchoedTags } from '../src/lib/tutor/voice/meta-narration';
import { parseThinkingCue, initialThinkingCue, cueTurnAccepted, cueTick, thinkingCueVisible, thinkingCueLabel, CHIME_TO_PULSE_MS, PULSE_EVERY_MS, ACCEPT_GRACE_MS } from '../src/lib/tutor/voice/thinking-cue';
import { parseSpeechRate } from '../src/lib/tutor/voice/speech-rate';
import { cannedLanguage, localizeCanned, lastTutorText, JA_CANNED } from '../src/lib/tutor/voice/bilingual-canned';
import { COVER_POOLS } from '../src/lib/tutor/voice/cover-layer';

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
  assert.ok(vtr.includes("if (!opts?.silent && lessonClosedRef.current && isPleasantryOnly(transcript))"));
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
  assert.equal(stripEchoedTags("<students_said>\nHi, today\n</students_said>\n\nLet's see this together."), "Let's see this together.");
  assert.equal(stripEchoedTags('x<y and y>z'), 'x<y and y>z');
  const src = readFileSync('src/lib/tutor/voice/claude-brain.ts', 'utf8');
  assert.ok(src.includes('const text = stripEchoedTags(raw);'));
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
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('retryAskStreakRef.current >= RETRY_CAP_TURNS'));
  assert.ok(vtr.includes('splitRunTogetherEnglish(transcript)'));
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
