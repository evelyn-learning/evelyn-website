/**
 * Sentence cards for language lessons (2026-10-29): the client puts quoted
 * model / corrected sentences on the board itself and stresses the corrected
 * words in the voice. Fixtures are live run-1 lines, verbatim.
 *
 * Run: npx tsx scripts/test-sentence-board.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { rewriteForTTS } from '../src/lib/tutor/voice/tts-pronunciation';
import {
  extractQuotedSentences, classifyQuotedSentence, planSentenceBoard,
  applySpokenEmphasis, emphasiseSpokenCorrections, SENTENCE_BOARD_MAX_PER_TURN,
  sentenceContains, sentenceOnCurrentPage, composeSpokenText, sentenceAnchorIndex,
} from '../src/lib/tutor/voice/sentence-board';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}

const GOLF_STUDENT = `Um, I haven't played, I haven't play golf with manager since I started work.`;
const GOLF_TUTOR = `"I haven't played golf with my manager since I started work" — close. The sentence needs "my" before "manager", and the verb is "played" after "haven't", so use the past participle, "played", but the full phrase should read "since I started working here" or "since I started work". Could you say the whole sentence once more, correctly?`;
const GOLF_SENTENCE = `I haven't played golf with my manager since I started work`;

const LEAVE_STUDENT = `I haven't take leave from work.`;
const LEAVE_TUTOR = `"I haven't taken leave" is the right structure, so you're close. The verb needs its past participle here, "taken", after "haven't". Can you say the whole sentence once more: "I haven't taken leave from work"?`;

const YEARS_STUDENT = `I have 4 year been working`;
const YEARS_TUTOR = `Good, you've been working for four years. Now let's say that in English: "I have been a sales manager for four years." Could you say that sentence yourself, starting with "I have been"?`;

const JA_TUTOR = `「次は、仕事の話です。」 Let's try: "I work in sales."`;

// ── extractQuotedSentences ───────────────────────────────────────────────
test('extract: 1–2-word quotes ignored, ≥ 3-word quotes kept in order', () => {
  assert.deepEqual(extractQuotedSentences(GOLF_TUTOR), [GOLF_SENTENCE, 'since I started working here', 'since I started work']);
});
test('extract: curly quotes, trailing punctuation kept, "…"/"..." and CJK spans ignored', () => {
  assert.deepEqual(extractQuotedSentences('Say “Where is the station?” please.'), ['Where is the station?']);
  assert.deepEqual(extractQuotedSentences('Try "I have been..." and "I have been…" first.'), []);
  assert.deepEqual(extractQuotedSentences('"仕事 is very good" ok'), []);
  assert.deepEqual(extractQuotedSentences(''), []);
});

// ── planSentenceBoard ────────────────────────────────────────────────────
test('golf: the long correction first, emphasis ["my"], at most 2 cards', () => {
  const cards = planSentenceBoard({ tutorText: GOLF_TUTOR, studentLast: GOLF_STUDENT, renderedThisTurn: false });
  assert.ok(cards.length >= 1 && cards.length <= SENTENCE_BOARD_MAX_PER_TURN, `got ${cards.length}`);
  assert.deepEqual(cards[0], { sentence: GOLF_SENTENCE, kind: 'correction', emphasis: ['my'] });
  // "since I started work" is contained in the long correction → never a card.
  assert.ok(!cards.some((c) => c.sentence === 'since I started work'));
});
test('leave: one card, the longest correction (prefix deduped), emphasis ["taken"]', () => {
  const cards = planSentenceBoard({ tutorText: LEAVE_TUTOR, studentLast: LEAVE_STUDENT, renderedThisTurn: false });
  assert.deepEqual(cards, [{ sentence: `I haven't taken leave from work`, kind: 'correction', emphasis: ['taken'] }]);
});
test('years: one model card, no emphasis', () => {
  const cards = planSentenceBoard({ tutorText: YEARS_TUTOR, studentLast: YEARS_STUDENT, renderedThisTurn: false });
  assert.deepEqual(cards, [{ sentence: 'I have been a sales manager for four years.', kind: 'model', emphasis: [] }]);
});
test('renderedThisTurn → []', () => {
  assert.deepEqual(planSentenceBoard({ tutorText: GOLF_TUTOR, studentLast: GOLF_STUDENT, renderedThisTurn: true }), []);
});
test('Japanese line: one model card from the English quote', () => {
  assert.deepEqual(planSentenceBoard({ tutorText: JA_TUTOR, studentLast: null, renderedThisTurn: false }),
    [{ sentence: 'I work in sales.', kind: 'model', emphasis: [] }]);
});
test('distinct is case-insensitive', () => {
  const cards = planSentenceBoard({ tutorText: 'Say "I work in sales." Again: "i work in sales."', studentLast: undefined, renderedThisTurn: false });
  assert.equal(cards.length, 1);
});

// ── classifyQuotedSentence ───────────────────────────────────────────────
test('classify: no student line → model', () => {
  assert.equal(classifyQuotedSentence(GOLF_SENTENCE, null).kind, 'model');
  assert.equal(classifyQuotedSentence(GOLF_SENTENCE, '  ').kind, 'model');
});
test('classify: identical to the student → model (nothing changed)', () => {
  assert.equal(classifyQuotedSentence('since I started work', GOLF_STUDENT).kind, 'model');
});

// ── spoken emphasis ──────────────────────────────────────────────────────
test('applySpokenEmphasis: whole word uppercased', () => {
  assert.equal(applySpokenEmphasis(GOLF_SENTENCE, ['my']), `I haven't played golf with MY manager since I started work`);
});
test('applySpokenEmphasis: 1-letter word ignored; no match inside another word', () => {
  assert.equal(applySpokenEmphasis(GOLF_SENTENCE, ['a']), GOLF_SENTENCE);
  assert.equal(applySpokenEmphasis(GOLF_SENTENCE, ['play']), GOLF_SENTENCE);
  assert.equal(applySpokenEmphasis(`I haven't taken leave`, ["haven't"]), `I HAVEN'T taken leave`);
});
test('emphasiseSpokenCorrections: only the long quoted span changes (MY), rest byte-identical', () => {
  const out = emphasiseSpokenCorrections(GOLF_TUTOR, GOLF_STUDENT);
  assert.equal(out, GOLF_TUTOR.replace('with my manager', 'with MY manager'));
  assert.equal(out.length, GOLF_TUTOR.length);
});
test('emphasiseSpokenCorrections: a quote left unclosed by the sentence splitter still gets stress', () => {
  assert.equal(emphasiseSpokenCorrections(`Can you say the whole sentence once more: "I haven't taken leave from work.`, LEAVE_STUDENT),
    `Can you say the whole sentence once more: "I haven't TAKEN leave from work.`);
  assert.equal(emphasiseSpokenCorrections(`" Now you try it.`, LEAVE_STUDENT), `" Now you try it.`);
});
test('emphasiseSpokenCorrections: model lines and missing student line untouched', () => {
  assert.equal(emphasiseSpokenCorrections(YEARS_TUTOR, YEARS_STUDENT), YEARS_TUTOR);
  assert.equal(emphasiseSpokenCorrections(GOLF_TUTOR, null), GOLF_TUTOR);
});

// ── helpers for the VoiceTutorRealtime wiring ─────────────────────────────
test('sentenceContains: word-for-word, case/punctuation ignored, not mid-word', () => {
  assert.equal(sentenceContains('Say it: "I work in sales." Go on.', 'i work in sales'), true);
  assert.equal(sentenceContains('I work in salesmanship', 'I work in sales'), false);
  assert.equal(sentenceContains('anything', ''), false);
});
test('sentenceOnCurrentPage: only after the last newPage/clear; showSentence + handwrite', () => {
  const cmds = [
    { action: 'showSentence', sentence: 'I work in sales.' },
    { action: 'newPage', title: 'Next' },
    { action: 'handwrite', text: "I haven't taken leave from work" },
    { action: 'showEquation', latex: 'x' },
  ];
  assert.equal(sentenceOnCurrentPage(cmds, "i haven't taken leave from work."), true);
  assert.equal(sentenceOnCurrentPage(cmds, 'I work in sales.'), false);
  assert.equal(sentenceOnCurrentPage([{ action: 'showSentence', sentence: 'I work in sales.' }], 'I WORK in sales'), true);
});

// ── order: rewriteForTTS first, stress after (fix round 10-11, item E) ───
const RW = (s: string) => rewriteForTTS(s);
test('rewriteForTTS alone undoes the stress (why the order matters)', () => {
  assert.ok(!/TAKEN/.test(rewriteForTTS(emphasiseSpokenCorrections(LEAVE_TUTOR, LEAVE_STUDENT))));
});
test('composeSpokenText: rewrite then stress keeps TAKEN', () => {
  const out = composeSpokenText(LEAVE_TUTOR, LEAVE_STUDENT, RW);
  assert.ok(/I haven't TAKEN leave from work/.test(out), out);
  assert.ok(!/"/.test(out), 'rewriteForTTS still stripped the quotes');
});
test('composeSpokenText: golf → MY inside the quoted span only', () => {
  const golf1 = `"I haven't played golf with my manager since I started work" — close.`;
  const out = composeSpokenText(golf1, GOLF_STUDENT, RW);
  assert.equal(out, RW(golf1).replace('with my manager', 'with MY manager'));
});
test('composeSpokenText: no correction / no student line = plain rewrite', () => {
  assert.equal(composeSpokenText(YEARS_TUTOR, YEARS_STUDENT, RW), RW(YEARS_TUTOR));
  assert.equal(composeSpokenText(LEAVE_TUTOR, null, RW), RW(LEAVE_TUTOR));
});
test('composeSpokenText: a brain card stresses the sentence that says it', () => {
  const out = composeSpokenText('Say it like this: I have been a sales manager for four years.', null, RW,
    [{ sentence: 'I have been a sales manager for four years.', emphasis: ['been'] }]);
  assert.ok(/have BEEN a sales/.test(out), out);
});
// ── fix round 11-2 ───────────────────────────────────────────────────────
test('B: a brain card stresses at most 4 words, only inside its own sentence span', () => {
  const card = { sentence: 'She has worked in sales for many years', emphasis: ['has', 'worked', 'sales', 'for', 'many', 'years'] };
  const out = composeSpokenText('She has worked in sales for many years, and she has a team.', null, RW, [card]);
  assert.ok(/She HAS WORKED in SALES FOR many years/.test(out), out);
  assert.ok(/and she has a team/.test(out), `outside the span untouched: ${out}`);
});
test('B: 1-letter card words never count toward the cap', () => {
  const out = composeSpokenText('I have a car.', null, RW, [{ sentence: 'I have a car.', emphasis: ['a', 'car'] }]);
  assert.ok(/I have a CAR/.test(out), out);
});
test('A: anchor = the spoken sentence that says the card (1-based), head fallback, else undefined', () => {
  const narration = ['Close.', 'Can you say the whole sentence once more: "I haven\'t taken leave from work"?'];
  assert.equal(sentenceAnchorIndex(narration, "I haven't taken leave from work"), 2);
  assert.equal(sentenceAnchorIndex(['Try: "I have been a sales', 'manager for four years."'], 'I have been a sales manager for four years.'), 1);
  assert.equal(sentenceAnchorIndex(['Hello there.'], 'I work in sales.'), undefined);
});
test('A: the auto card goes through handleWhiteboardCommand with its anchor, never a raw paint', () => {
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  const at = vtr.indexOf("'sentence_board_auto'");
  const block = vtr.slice(at - 2500, at + 200);
  assert.ok(/await handleWhiteboardCommand\(\[cmd\], anchor !== undefined \? \{ anchorSentence: anchor \} : undefined\)/.test(block), 'normal board path');
  assert.ok(/sentenceAnchorIndex\(turnNarrationRef\.current, card\.sentence\)/.test(block), 'anchored to its spoken sentence');
  assert.ok(!/onWhiteboardCommand\(\[cmd\]\)/.test(block), 'no raw opener-fallback paint');
});
test('hook pin: both Cartesia paths compose AFTER rewriteForTTS; the HTTP route skips its rewrite only for prerewritten text', () => {
  const hook = readFileSync(join(__dirname, '..', 'src/app/tutor/hooks/useOpenAIRealtime.ts'), 'utf8');
  assert.ok(/f\(trimmed, \(s\) => rewriteForTTS\(s, \{ studentName: studentNameRef\.current \}\)\)/.test(hook), 'cartesiaText composes with rewriteForTTS');
  assert.ok(/const spoken = cartesiaText\(trimmed\) \?\? rewriteForTTS\(trimmed/.test(hook), 'WS path');
  assert.equal((hook.match(/\{ prerewritten: true \}/g) ?? []).length, 2, 'HTTP whole-buffer + streamed head');
  const route = readFileSync(join(__dirname, '..', 'src/app/api/tutor/tts-cartesia/route.ts'), 'utf8');
  assert.ok(/transcript: prerewritten === true \? text : rewriteForTTS\(text, \{ studentName \}\)/.test(route));
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
