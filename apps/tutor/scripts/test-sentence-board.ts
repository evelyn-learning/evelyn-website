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
  sentenceContains, sentenceOnCurrentPage, composeSpokenText, sentenceAnchorIndex, autoSentenceCardsToReplace,
  isCardCandidate,
} from '../src/lib/tutor/voice/sentence-board';
import { isSentenceOnlyBatch, keepSentenceBatchOnPage } from '../src/lib/tutor/whiteboard/page-grouping';

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

test('sentenceOnCurrentPage: a showSentence matches with a trailing period / different case / either containing the other', () => {
  const page = [{ action: 'showSentence', sentence: 'I am a sales manager at my company.' }];
  assert.equal(sentenceOnCurrentPage(page, 'I am a sales manager at my company'), true);
  assert.equal(sentenceOnCurrentPage(page, 'i am a SALES manager at my company!'), true);
  assert.equal(sentenceOnCurrentPage([{ action: 'showSentence', sentence: 'I am a sales manager' }], 'I am a sales manager at my company.'), true);
  assert.equal(sentenceOnCurrentPage(page, 'I am a teacher at my school.'), false);
});
test('autoSentenceCardsToReplace: auto cards on the current page that say the brain card\'s sentence', () => {
  const cmds = [
    { action: 'showSentence', id: 'showSentence-1', sentence: 'I am a sales manager at my company' },
    { action: 'newPage', title: 'Next' },
    { action: 'showSentence', id: 'showSentence-3', sentence: 'I am a sales manager at my company' },
    { action: 'showSentence', id: 'showSentence-5', sentence: 'I have worked here for two years' },
    { action: 'showSentence', id: 'showSentence-6', sentence: 'I am a sales manager at my company' },
  ];
  const auto = new Set(['showSentence-1', 'showSentence-3', 'showSentence-5']);
  assert.deepEqual(autoSentenceCardsToReplace(cmds, auto, 'I am a sales manager at my company.'), ['showSentence-3']);
  assert.deepEqual(autoSentenceCardsToReplace(cmds, auto, 'I am a teacher.'), []);
  assert.deepEqual(autoSentenceCardsToReplace(cmds, new Set(), 'I am a sales manager at my company.'), []);
  assert.deepEqual(autoSentenceCardsToReplace([...cmds, { action: 'newPage', title: 'x' }], auto, 'I am a sales manager at my company.'), []);
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
  assert.equal(sentenceAnchorIndex(narration, "I haven't taken leave from work"), 1, 'one sentence precedes the one that says it');
  assert.equal(sentenceAnchorIndex(['Try: "I have been a sales', 'manager for four years."'], 'I have been a sales manager for four years.'), 0, 'said in the first sentence: paints at once');
  assert.equal(sentenceAnchorIndex(['Hello there.'], 'I work in sales.'), undefined);
});
test('A: the auto card goes through handleWhiteboardCommand with its anchor, never a raw paint', () => {
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  const at = vtr.indexOf("'sentence_board_auto'");
  const block = vtr.slice(at - 2500, at + 200);
  assert.ok(/await handleWhiteboardCommand\(\[cmd\], anchor !== undefined \? \{ anchorSentence: anchor, sentenceBoardAuto: true \} : \{ sentenceBoardAuto: true \}\)/.test(block), 'normal board path, marked as the auto card');
  assert.ok(/autoSentenceCardIdsRef\.current\.add\(id\)/.test(vtr.slice(at - 2500, at + 600)), 'auto card ids remembered');
  assert.ok(/sentenceAnchorIndex\(turnNarrationRef\.current, card\.sentence\)/.test(block), 'anchored to its spoken sentence');
  assert.ok(!/onWhiteboardCommand\(\[cmd\]\)/.test(block), 'no raw opener-fallback paint');
});
test('C: a brain show_sentence replaces the auto card of the same sentence before it paints', () => {
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  const at = vtr.indexOf("'sentence_board_auto_replaced'");
  assert.ok(at > 0, 'replace event');
  const block = vtr.slice(at - 2000, at + 300);
  assert.ok(/!opts\?\.sentenceBoardAuto/.test(block), 'never for the auto card itself');
  assert.ok(/autoSentenceCardsToReplace\(/.test(block), 'pure helper decides');
  assert.ok(/action: 'removeItems', ids: replaced/.test(block), 'removed from the board');
  assert.ok(/catalogRef\.current\.removeByIds\(replaced\)/.test(block), 'and from the catalog');
  assert.ok(at < vtr.indexOf('dispatchVisualRef.current(processed, opts?.anchorSentence)'), 'before the brain card dispatches');
});
test('hook pin: both Cartesia paths compose AFTER rewriteForTTS; the HTTP route skips its rewrite only for prerewritten text', () => {
  const hook = readFileSync(join(__dirname, '..', 'src/app/tutor/hooks/useOpenAIRealtime.ts'), 'utf8');
  assert.ok(/f\(trimmed, \(s\) => rewriteForTTS\(s, \{ studentName: studentNameRef\.current \}\)\)/.test(hook), 'cartesiaText composes with rewriteForTTS');
  assert.ok(/const spoken = cartesiaText\(trimmed\) \?\? rewriteForTTS\(trimmed/.test(hook), 'WS path');
  assert.equal((hook.match(/\{ prerewritten: true \}/g) ?? []).length, 2, 'HTTP whole-buffer + streamed head');
  const route = readFileSync(join(__dirname, '..', 'src/app/api/tutor/tts-cartesia/route.ts'), 'utf8');
  assert.ok(/transcript: prerewritten === true \? text : rewriteForTTS\(text, \{ studentName \}\)/.test(route));
});

// ── Task 13 §F: sentence-board filters (live run-3 lines) ──
test('F: the brain quoting the student\'s own wrong words is an echo → no card', () => {
  const student = 'Yes, I have worked current company for a long time.';
  const tutor = 'Ah, you said "I have worked current company for a long time." Nearly there. Add "for" before "your current company".';
  assert.equal(classifyQuotedSentence('I have worked current company for a long time.', student).kind, 'echo');
  assert.deepEqual(planSentenceBoard({ tutorText: tutor, studentLast: student, renderedThisTurn: false }), []);
});
test('F: a lowercase fragment is never a card', () => {
  const tutor = 'Use "for your current company," with "for" before it.';
  assert.equal(isCardCandidate('for your current company,'), false);
  assert.deepEqual(planSentenceBoard({ tutorText: tutor, studentLast: 'I have worked current company.', renderedThisTurn: false }), []);
});
test('F: a quoted question is never a card (asks belong to the pin)', () => {
  const tutor = 'Did you want to try the question I asked, "What have you been doing at your company for a long time?"';
  assert.equal(isCardCandidate('What have you been doing at your company for a long time?'), false);
  assert.deepEqual(planSentenceBoard({ tutorText: tutor, studentLast: 'Sorry, what?', renderedThisTurn: false }), []);
});
test('F: the golf correction still → card', () => {
  const cards = planSentenceBoard({ tutorText: GOLF_TUTOR, studentLast: GOLF_STUDENT, renderedThisTurn: false });
  assert.equal(cards[0]?.sentence, GOLF_SENTENCE);
  assert.equal(cards[0]?.kind, 'correction');
});
test('F: a sentence starting with a digit is not a fragment', () => {
  assert.equal(isCardCandidate('25 machines were sold last month.'), true);
});

// ── Task 13 §C: sentence cards never open a page ──
test('C: a showSentence-only batch is sentence-only; a mixed or empty batch is not', () => {
  assert.equal(isSentenceOnlyBatch([{ action: 'showSentence' }, { action: 'showSentence' }]), true);
  assert.equal(isSentenceOnlyBatch([{ action: 'showSentence' }, { action: 'showTable' }]), false);
  assert.equal(isSentenceOnlyBatch([{ action: 'newPage' }, { action: 'showSentence' }]), false);
  assert.equal(isSentenceOnlyBatch([]), false);
});
test('C: a sentence-only batch turns newPage/continuation into none; pin and others untouched', () => {
  const np = { action: 'newPage' as const, title: 'Next', reason: 'topic shift', event: 'page_grouping_topic_shift', anchorKey: null };
  assert.equal(keepSentenceBatchOnPage(np, true).action, 'none');
  assert.equal(keepSentenceBatchOnPage({ ...np, action: 'continuation' as const }, true).action, 'none');
  assert.equal(keepSentenceBatchOnPage(np, false), np);
  const pin = { action: 'pin' as const, pageId: 'p1', reason: 'kill' };
  assert.equal(keepSentenceBatchOnPage(pin, true), pin);
});
test('C: VTR — a sentence-only batch neither sees nor consumes the topic-shift mark', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(/const topicShiftPending = sentenceOnlyBatch \? null : topicShiftPendingRef\.current;/.test(VTR));
  assert.ok(/const pageDecision = keepSentenceBatchOnPage\(decidePageForBatch\(\{/.test(VTR));
  assert.ok(/if \(!sentenceOnlyBatch\) topicShiftPendingRef\.current = null;/.test(VTR));
  // the deferred segment page flush runs AFTER the decision (so a sentence
  // batch with no page of its own opens the pending segment page first)
  assert.ok(VTR.indexOf('if (!sentenceOnlyBatch) topicShiftPendingRef.current = null;') < VTR.indexOf('const deferredFlush = decideDeferredPageFlush({'));
});

// ── Task 14 §B: corner-bracket / single curly quotes ──
test('B: 「…」 correction → card, emphasis [sells, machines]', () => {
  const t = 'Let\'s fix one small thing: 「My department sells washing machines.」 The verb needs an "s" after department.';
  const cards = planSentenceBoard({ tutorText: t, studentLast: 'My department sell washing machine.', renderedThisTurn: false });
  assert.equal(cards.length, 1);
  assert.equal(cards[0].sentence, 'My department sells washing machines.');
  assert.equal(cards[0].kind, 'correction');
  assert.deepEqual(cards[0].emphasis, ['sells', 'machines']);
});
test('B: 「…」ですね correction → emphasis [sold, a, front-load]', () => {
  const t = '「I sold a front-load washing machine to Mr. Kenji last week.」ですね';
  const cards = planSentenceBoard({ tutorText: t, studentLast: 'I sell front load washing machine to Mr. Kenji last week.', renderedThisTurn: false });
  assert.equal(cards.length, 1);
  assert.equal(cards[0].kind, 'correction');
  assert.deepEqual(cards[0].emphasis, ['sold', 'a', 'front-load']);
  assert.equal(applySpokenEmphasis(cards[0].sentence, cards[0].emphasis), 'I SOLD a FRONT-LOAD washing machine to Mr. Kenji last week.'); // 1-letter words are never stressed
});
test('B: 『…』 and ‘…’ spans extracted; an apostrophe inside ‘…’ does not close it', () => {
  assert.deepEqual(extractQuotedSentences('『I have been to Osaka.』'), ['I have been to Osaka.']);
  assert.deepEqual(extractQuotedSentences('Say ‘I haven’t taken leave yet.’ please'), ['I haven’t taken leave yet.']);
});
test('B: filters still apply to 「」 spans (question, lowercase, echo, CJK)', () => {
  assert.deepEqual(planSentenceBoard({ tutorText: '「What did you sell last week?」', studentLast: null, renderedThisTurn: false }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: '「for your current company,」', studentLast: null, renderedThisTurn: false }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: '「I sell washing machines.」ですね', studentLast: 'I sell washing machines', renderedThisTurn: false }), []);
  assert.deepEqual(extractQuotedSentences('「洗濯機を売りました」'), []);
});
test('B: spoken stress inside a 「」 span (and an unclosed 「 cut by the splitter)', () => {
  const st = 'My department sell washing machine.';
  assert.equal(emphasiseSpokenCorrections('Let\'s fix it: 「My department sells washing machines.」 Good.', st), 'Let\'s fix it: 「My department SELLS washing MACHINES.」 Good.');
  assert.equal(emphasiseSpokenCorrections('Let\'s fix it: 「My department sells washing machines.', st), 'Let\'s fix it: 「My department SELLS washing MACHINES.');
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
