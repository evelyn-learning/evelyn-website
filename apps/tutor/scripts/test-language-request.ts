/**
 * Wave 11 (GDI run 7, 187 s "Can you please talk in English?" → the tutor moved on in English): a student's request to
 * be spoken to in a session language is a "say that again in <language>" request, sticky for the session.
 *
 * Run: npx tsx scripts/test-language-request.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { languageRequestIn, languageRequestNoteFirst, LANGUAGE_REQUEST_NOTE, languageRequestNote } from '../src/lib/tutor/voice/language-request';

let failed = 0;
const test = (name: string, fn: () => void) => {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
};
const L = ['en', 'ja'];

test('requests for English', () => {
  for (const t of ['Can you please talk in English?', 'Could you explain that in English?', 'In English, please.', 'English please', 'Please speak English.',
    'Can you say that again in English?', 'Sorry, English?', 'Talk in English.', '英語で話してください。', '英語で説明してもらえますか', '英語でお願いします']) {
    assert.equal(languageRequestIn(t, L), 'en', t);
  }
});
test('requests for Japanese', () => {
  for (const t of ['Can you explain in Japanese?', '日本語で言ってください', 'Japanese, please.', '日本語でお願いします。']) assert.equal(languageRequestIn(t, L), 'ja', t);
});
test('not requests: the student talks ABOUT English, or about themselves', () => {
  for (const t of ['I want to explain my job in English.', 'I speak English at work every day.', 'English is difficult for me.', 'I have worked in English companies.',
    'Is this correct in English?', 'My English teacher was from Canada.', 'I studied Japanese and English.', 'responsibilities', 'Individual words.', 'Yes, please.', '']) {
    assert.equal(languageRequestIn(t, L), null, t);
  }
});
test('only session languages count; an engine directive never', () => {
  assert.equal(languageRequestIn('Can you speak in French?', L), null);
  assert.equal(languageRequestIn('Can you speak in English?', ['en']), 'en');
  assert.equal(languageRequestIn('Can you speak in Japanese?', ['en']), null);
  assert.equal(languageRequestIn('[Lesson auto-advanced: in English]', L), null);
});
test('the first note carries the previous turn and the order to restate it; the sticky note is short', () => {
  const prev = 'Good question, and I\'ll give you the scores. 発音のスコアは100点満点で16点でした。 Would you like one more word, or shall we move on to the summary?';
  const n = languageRequestNoteFirst('en', prev);
  assert.ok(n.startsWith('[') && /English/.test(n) && /previous turn/i.test(n) && n.includes('16点') && /from now on/i.test(n), n);
  assert.ok(n.length < 900);
  assert.ok(languageRequestNoteFirst('en', 'x'.repeat(2000)).length < 900, 'previous turn capped');
  const sticky = languageRequestNote('en');
  assert.ok(sticky === LANGUAGE_REQUEST_NOTE('English') && /English/.test(sticky) && sticky.length < 220, sticky);
  assert.ok(/日本語|Japanese/.test(languageRequestNote('ja')));
});
test('VTR: detected per student turn, sticky ref, first note then the sticky one; typed contexts carry it', () => {
  const v = readFileSync(join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(v.includes('const explanationLanguageRef = useRef<string | null>(null);'), 'sticky ref');
  assert.ok(/const languageRequestThisTurn = [^;]*languageRequestIn\(transcript, tutorLanguages[^;]*;/.test(v), 'detected from the student transcript');
  assert.ok(v.includes("onDebugEvent?.('language_request',"), 'debug event');
  assert.ok(v.includes('languageRequestNoteFirst(languageRequestThisTurn,'), 'first note with the previous tutor turn');
  assert.ok(v.includes('languageRequestNote(explanationLanguageRef.current)'), 'sticky note on later turns');
  assert.ok(/languageRequest: typedLanguageRequestThisTurn,[\s\S]{0,12000}languageRequest: typedLanguageRequestThisTurn,/.test(v), 'both typed contexts carry it');
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall language-request tests passed');
