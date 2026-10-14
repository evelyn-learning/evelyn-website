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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
