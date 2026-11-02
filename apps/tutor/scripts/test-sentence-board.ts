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
  sentenceContains, sentenceOnCurrentPage, composeSpokenText, sentenceAnchorIndex, autoCardAnchor, autoSentenceCardsToReplace,
  isCardCandidate, sentenceOnBoardPage, autoCardIdsOnCurrentPage,
  isSentenceStarter, isSaidQuote, numberWordToken, sameSentence, cardableStudentSentence, hasCorrectionCue, recastsStudentSentence,
  quoteAffirmed, isMetaOfferTurn, recastCorrectionCard, sentenceBoardBlockedByRenders,
  levelCheckAnswerCard, levelCheckRecast, isQuotedFragment, acknowledgesOption, boardOffersChoices,
  grammarRecastCard, isTranslationQuote, sameSentenceText, duplicateSentenceAction, levelCheckRestatementCard, firstPersonWriteBack, contrastAskPair,
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
// Task 18 §D rule 3: a quote made only of the student's words is an echo,
// however little of the student's sentence it covers (was 'model' before).
test('classify: a partial quote of the student (nothing changed) → echo', () => {
  assert.equal(classifyQuotedSentence('since I started work', GOLF_STUDENT).kind, 'echo');
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
// The caps stress is opt-in since GDI run 8 (TUTOR_SPOKEN_EMPHASIS_CAPS).
const CAPS = { emphasisCaps: true };
test('rewriteForTTS alone undoes the stress (why the order matters)', () => {
  assert.ok(!/TAKEN/.test(rewriteForTTS(emphasiseSpokenCorrections(LEAVE_TUTOR, LEAVE_STUDENT))));
});
test('composeSpokenText: rewrite then stress keeps TAKEN', () => {
  const out = composeSpokenText(LEAVE_TUTOR, LEAVE_STUDENT, RW, [], CAPS);
  assert.ok(/I haven't TAKEN leave from work/.test(out), out);
  assert.ok(!/"/.test(out), 'rewriteForTTS still stripped the quotes');
});
test('composeSpokenText: golf → MY inside the quoted span only', () => {
  const golf1 = `"I haven't played golf with my manager since I started work" — close.`;
  const out = composeSpokenText(golf1, GOLF_STUDENT, RW, [], CAPS);
  assert.equal(out, RW(golf1).replace('with my manager', 'with MY manager'));
});
test('composeSpokenText: no correction / no student line = plain rewrite', () => {
  assert.equal(composeSpokenText(YEARS_TUTOR, YEARS_STUDENT, RW), RW(YEARS_TUTOR));
  assert.equal(composeSpokenText(LEAVE_TUTOR, null, RW), RW(LEAVE_TUTOR));
});
test('composeSpokenText: a brain card stresses the sentence that says it', () => {
  const out = composeSpokenText('Say it like this: I have been a sales manager for four years.', null, RW,
    [{ sentence: 'I have been a sales manager for four years.', emphasis: ['been'] }], CAPS);
  assert.ok(/have BEEN a sales/.test(out), out);
});
// ── fix round 11-2 ───────────────────────────────────────────────────────
test('B: a brain card stresses at most 4 words, only inside its own sentence span', () => {
  const card = { sentence: 'She has worked in sales for many years', emphasis: ['has', 'worked', 'sales', 'for', 'many', 'years'] };
  const out = composeSpokenText('She has worked in sales for many years, and she has a team.', null, RW, [card], CAPS);
  assert.ok(/She HAS WORKED in SALES FOR many years/.test(out), out);
  assert.ok(/and she has a team/.test(out), `outside the span untouched: ${out}`);
});
test('B: 1-letter card words never count toward the cap', () => {
  const out = composeSpokenText('I have a car.', null, RW, [{ sentence: 'I have a car.', emphasis: ['a', 'car'] }], CAPS);
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
  // Task 23 §A: the call also says whether the card is the student's sentence.
  assert.ok(/await handleWhiteboardCommand\(\[cmd\], anchor !== undefined \? \{ anchorSentence: anchor, sentenceBoardAuto: true, studentSentenceCard \} : \{ sentenceBoardAuto: true, studentSentenceCard \}\)/.test(block), 'normal board path, marked as the auto card');
  assert.ok(/autoSentenceCardIdsRef\.current\.add\(id\)/.test(vtr.slice(at - 2500, at + 600)), 'auto card ids remembered');
  assert.ok(/sentenceAnchorIndex\(turnNarrationRef\.current, card\.sentence\)/.test(block), 'anchored to its spoken sentence');
  assert.ok(!/onWhiteboardCommand\(\[cmd\]\)/.test(block), 'no raw opener-fallback paint');
});
test('C: a brain show_sentence replaces the auto card of the same sentence — the card leaves WITH its replacement (Task 22 §B)', () => {
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  const at = vtr.indexOf("'sentence_board_auto_replaced'");
  assert.ok(at > 0, 'replace event');
  const block = vtr.slice(at - 5000, at + 300);
  assert.ok(/!opts\?\.sentenceBoardAuto/.test(block), 'never for the auto card itself');
  assert.ok(/autoSentenceCardsToReplace\(/.test(block), 'pure helper decides');
  assert.ok(!/action: 'removeItems', ids: replaced/.test(block), 'no immediate removal of every replaced card');
  assert.ok(/deferRemoval\(deferredRemovalsRef\.current, replacementId, priors, Date\.now\(\), \{ keepPriorOnDrop: true \}\)/.test(block), 'parked under the replacement, kept on drop');
  assert.ok(/'sentence_board_auto_replace_deferred', `\$\{priors\.join\(','\)\} leaves with \$\{replacementId\}`/.test(block), 'deferred event');
  assert.ok(/if \(immediate\.length > 0\) onWhiteboardCommandProp\(\[\{ action: 'removeItems', ids: immediate \}\]\);/.test(block), 'a replacement without an id removes at once, as before');
  assert.ok(/catalogRef\.current\.removeByIds\(replaced\)/.test(block), 'and from the catalog');
  assert.ok(at < vtr.indexOf('dispatchVisualRef.current(processed, opts?.anchorSentence,'), 'before the brain card dispatches');
});
// ── Task 22 §G (GDI run 10, 711 s / 781 s): affirmed conversational sentences ──
test('22G the 781 s turn cards the student\'s sentence (precheck none, "Your sentence is clear.")', () => {
  const st = 'The biggest challenge in that project was to convince customers to buy the washing machines.';
  const t = 'Convincing customers was the challenge, so you named the real difficulty. Your sentence is clear. Next, how did you handle that challenge? Try starting with "I…".';
  assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false, affirmFallback: true }),
    [{ sentence: st, kind: 'model', emphasis: [], source: 'affirmed' }]);
  // a deciding check / no fallback ⇒ not this path
  assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false }), []);
  // the brain's own show_sentence this turn blocks it like every card
  assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: true, affirmFallback: true }), []);
});
test('22G the 711 s turn: quotes of the student\'s own words and "that\'s a clear role" / "fits perfectly"', () => {
  const st = 'I was responsible for selling washing machines made by robots.';
  const t = 'Selling washing machines made by robots, that\'s a clear role. Now, the phrase "responsible for" is followed by a noun or an -ing verb, and "selling" fits perfectly. Could you tell me one result of that project, starting with "The project helped…"?';
  assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false, affirmFallback: true }),
    [{ sentence: st, kind: 'model', emphasis: [], source: 'affirmed' }]);
  // fillers out, capitalised, final period
  assert.deepEqual(planSentenceBoard({ tutorText: 'Your sentence is clear. What else?', studentLast: 'um, i would like to work with uh ABC Robotics in the future', renderedThisTurn: false, affirmFallback: true }).map((c) => c.sentence),
    ['I would like to work with ABC Robotics in the future.']);
});
test('22G no affirmed card when qualified, quoting other words, a question, or too short', () => {
  const st = 'The biggest challenge in that project was to convince customers to buy the washing machines.';
  assert.deepEqual(planSentenceBoard({ tutorText: 'Your sentence is clear, but "to convince" should be "convincing". Try again.', studentLast: st, renderedThisTurn: false, affirmFallback: true }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: 'Your sentence is clear. But we usually say "convincing customers" here.', studentLast: st, renderedThisTurn: false, affirmFallback: true }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: 'Good question. Yes, I do. What about you?', studentLast: 'Do you like robots?', renderedThisTurn: false, affirmFallback: true }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: 'Your sentence is clear. Remember to add "a" before "project".', studentLast: 'I worked on project to increase sales.', renderedThisTurn: false, affirmFallback: true }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: 'Your sentence is clear. What else?', studentLast: 'Sales manager.', renderedThisTurn: false, affirmFallback: true }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: 'Could you say that as one clear sentence, starting with "I talked to the customer about…"?', studentLast: 'Talk to customer about robots machines good.', renderedThisTurn: false, affirmFallback: true }), []);
});
test('22G r1 I1: implicit corrections and content acknowledgements give no affirmed card', () => {
  const g = (t: string, st: string) => planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false, affirmFallback: true });
  const st = 'I worked on project to increase sales.';
  for (const t of [
    'Your sentence is clear. Just remember the article before project.',
    'Your sentence is clear. In English we usually put an article there.',
    'Your sentence is clear. Next time, say a project.',
    'Your sentence is clear. Keep in mind we use the past here.',
  ]) assert.deepEqual(g(t, st), [], t);
  assert.deepEqual(g('That\'s right. Which company?', 'Yesterday I go to the customer office.'), []);
  assert.deepEqual(g('That\'s right. What did you do next?', 'Yesterday I go to the customer office.'), []);
  assert.deepEqual(g('That\'s a clear answer. Now ask me a question.', 'I goed to Tokyo last week for meeting.'), []);
  assert.deepEqual(g('That fits perfectly with your job. What else do you do?', 'I goed to Tokyo last week for meeting.'), []);
  assert.deepEqual(g('Selling washing machines, that\'s a clear role. What else?', 'I was responsible for sell washing machines.'), []);
  // the 781 s turn still cards
  const st781 = 'The biggest challenge in that project was to convince customers to buy the washing machines.';
  assert.deepEqual(g('Convincing customers was the challenge, so you named the real difficulty. Your sentence is clear. Next, how did you handle that challenge? Try starting with "I…".', st781).map((c) => c.source), ['affirmed']);
});
test('22G r2 I3: instructions, questions and retry asks give no affirmed card', () => {
  const g = (t: string) => planSentenceBoard({ tutorText: t, studentLast: 'Yesterday I go to the customer office for meeting.', renderedThisTurn: false, affirmFallback: true });
  for (const t of [
    'Make sure your sentence is complete. Try again.',
    'Try again, and check that the sentence is correct.',
    'Do you think your sentence is correct? Listen again.',
    'Your sentence is clear. Try once more with the past tense.',
    'Your sentence is clear. Yesterday is past, so think about the verb.',
    'Your sentence is clear. Please say it again.',
  ]) assert.deepEqual(g(t), [], t);
  const st781 = 'The biggest challenge in that project was to convince customers to buy the washing machines.';
  assert.deepEqual(planSentenceBoard({ tutorText: 'Convincing customers was the challenge, so you named the real difficulty. Your sentence is clear. Next, how did you handle that challenge? Try starting with "I…".', studentLast: st781, renderedThisTurn: false, affirmFallback: true }).map((c) => c.source), ['affirmed']);
  const st711 = 'I was responsible for selling washing machines made by robots.';
  assert.deepEqual(planSentenceBoard({ tutorText: 'Selling washing machines made by robots, that\'s a clear role. Now, the phrase "responsible for" is followed by a noun or an -ing verb, and "selling" fits perfectly. Could you tell me one result of that project, starting with "The project helped…"?', studentLast: st711, renderedThisTurn: false, affirmFallback: true }).map((c) => c.source), ['affirmed']);
});
test('22G r2 m5: a straight single-quoted student word that "fits perfectly" is praise too', () => {
  const st = 'I was responsible for selling washing machines made by robots.';
  assert.deepEqual(planSentenceBoard({ tutorText: "Good. The word 'selling' fits perfectly. What was the result?", studentLast: st, renderedThisTurn: false, affirmFallback: true }).map((c) => [c.sentence, c.source]), [[st, 'affirmed']]);
  // a single-quoted word that is NOT the student's still blocks
  assert.deepEqual(planSentenceBoard({ tutorText: "Good. 'Sales' fits perfectly. What was the result?", studentLast: st, renderedThisTurn: false, affirmFallback: true }), []);
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
  // Task 23 §A2: the sentence-batch decision then goes through the empty-segment-page keep.
  assert.ok(/const rawPageDecision = keepSentenceBatchOnPage\(decidePageForBatch\(\{/.test(VTR));
  // Task 29 §D3: then the fixed-script part-page keep.
  assert.ok(/const emptySegPageDecision = keepBatchOnEmptySegmentPage\(rawPageDecision,/.test(VTR));
  assert.ok(/const pageDecision = keepTopicShiftOnSegmentPage\(emptySegPageDecision, \{/.test(VTR));
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

// ── Task 14 §I: one hook card per session ──
test('I: sentenceOnBoardPage finds the card on any page (case/punctuation-insensitive), earliest page', () => {
  const log = [
    { action: 'showSentence', id: 's1', sentence: 'I have sold 300 machines this year.' },
    { action: 'newPage' },
    { action: 'showTable' },
    { action: 'newPage' },
    { action: 'showSentence', id: 's2', sentence: 'I sold 25 machines last month.' },
  ];
  assert.equal(sentenceOnBoardPage(log, 'i have sold 300 machines this year'), 1);
  assert.equal(sentenceOnBoardPage(log, 'I sold 25 machines last month!'), 3);
  assert.equal(sentenceOnBoardPage(log, 'I sold 25 machines.'), null, 'word-for-word equal only');
  assert.equal(sentenceOnBoardPage(log, 'I sold 25 machines last month.', new Set(['s2'])), null, 'skipped id');
  assert.equal(sentenceOnBoardPage([...log, { action: 'clear' }], 'I sold 25 machines last month.'), null, 'a clear wipes the page');
});
test('I: autoCardIdsOnCurrentPage — only auto ids after the last newPage', () => {
  const log = [
    { action: 'showSentence', id: 'a1', sentence: 'x y z' },
    { action: 'newPage' },
    { action: 'showSentence', id: 'a2', sentence: 'x y z' },
    { action: 'showSentence', id: 'b1', sentence: 'p q r' },
  ];
  assert.deepEqual([...autoCardIdsOnCurrentPage(log, new Set(['a1', 'a2']))], ['a2']);
});
test('I: VTR — duplicate show_sentence is a soft skip (note, not a rejection) with its debug event', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(VTR.includes("onDebugEvent?.('show_sentence_duplicate_skipped'"));
  assert.ok(/duplicateSentenceNotes\.push\(`show_sentence: already on the board \(page \$\{page\}\)/.test(VTR));
  assert.ok(!/rejected\.push\(\{ action: 'show_sentence'/.test(VTR));
});

// ── Task 15 §A: a CORRECT student sentence gets a card (live run-5 lines) ──
const RUN5_ECHO: Array<{ student: string; tutor: string; sentence: string }> = [
  { student: 'The robots could walk and dance.', tutor: '"The robots could walk and dance" is clear and natural.', sentence: 'The robots could walk and dance' },
  { student: 'We purchased 30 robots from that conference.', tutor: '"We purchased 30 robots from that conference" is a clear result.', sentence: 'We purchased 30 robots from that conference' },
  { student: 'The project succeeded because we purchased the robots that we wanted.', tutor: '"The project succeeded because we purchased the robots that we wanted" is a clear reason.', sentence: 'The project succeeded because we purchased the robots that we wanted' },
];
test('A: echo of a checked-correct sentence ⇒ one model card (source echo)', () => {
  for (const r of RUN5_ECHO) {
    assert.equal(classifyQuotedSentence(r.sentence, r.student).kind, 'echo');
    const cards = planSentenceBoard({ tutorText: r.tutor, studentLast: r.student, renderedThisTurn: false, studentCorrect: true, checkedSentence: r.student });
    assert.equal(cards.length, 1, r.tutor);
    assert.equal(cards[0].kind, 'model');
    assert.equal(cards[0].sentence, r.sentence);
    assert.deepEqual(cards[0].emphasis, []);
    assert.equal(cards[0].source, 'echo', 'the checked sentence is the same card — not added twice');
  }
});
test('A: same turns, not checked correct ⇒ [] (run-3 echo filter stands)', () => {
  for (const r of RUN5_ECHO) {
    assert.deepEqual(planSentenceBoard({ tutorText: r.tutor, studentLast: r.student, renderedThisTurn: false, studentCorrect: false, checkedSentence: r.student }), []);
    assert.deepEqual(planSentenceBoard({ tutorText: r.tutor, studentLast: r.student, renderedThisTurn: false }), []);
  }
});
test('A: unquoted restatement of the checked sentence ⇒ one model card (source checked)', () => {
  const student = 'Our IT manager helped us identify the right robot.';
  const tutor = 'Our IT manager helped us identify the right robot. That\'s a complete sentence, and "helped us identify" is natural.';
  const cards = planSentenceBoard({ tutorText: tutor, studentLast: student, renderedThisTurn: false, studentCorrect: true, checkedSentence: 'Our IT manager helped us identify the right robot.' });
  assert.deepEqual(cards, [{ sentence: 'Our IT manager helped us identify the right robot.', kind: 'model', emphasis: [], source: 'checked' }]);
  assert.deepEqual(planSentenceBoard({ tutorText: tutor, studentLast: student, renderedThisTurn: false, studentCorrect: false, checkedSentence: 'Our IT manager helped us identify the right robot.' }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: tutor, studentLast: student, renderedThisTurn: true, studentCorrect: true, checkedSentence: student }), []);
});
test('A: a correction turn with a wrong (studentCorrect:false) checked sentence ⇒ correction only', () => {
  const student = 'I haven\'t take leave from work.';
  const tutor = 'You said I haven\'t take leave from work. The verb needs "taken": "I haven\'t taken leave from work."';
  const cards = planSentenceBoard({ tutorText: tutor, studentLast: student, renderedThisTurn: false, studentCorrect: false, checkedSentence: student });
  assert.equal(cards.length, 1);
  assert.equal(cards[0].kind, 'correction');
  assert.equal(cards[0].sentence, 'I haven\'t taken leave from work.');
});
test('A fix round 1 (I2): a turn that corrects the student plans no echo / checked model card even when checked correct', () => {
  const student = 'I went to office yesterday.';
  const tutor = 'You said "I went to office yesterday." Add "the": "I went to the office yesterday."';
  const cards = planSentenceBoard({ tutorText: tutor, studentLast: student, renderedThisTurn: false, studentCorrect: true, checkedSentence: student });
  assert.equal(cards.length, 1);
  assert.equal(cards[0].kind, 'correction');
  assert.equal(cards[0].sentence, 'I went to the office yesterday.');
});
test('A: VTR passes the check to planSentenceBoard and tags the event source', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  const at = VTR.indexOf('const boardStudentCorrect = ');
  const block = VTR.slice(at, at + 1200);
  assert.ok(/const boardStudentCorrect = precheckDecides\(boardPc\) && boardPc\.verdict === 'correct' && boardPc\.answers !== 'other_part' && boardPc\.answers !== 'neither'/.test(block));
  assert.ok(block.includes('studentCorrect: boardStudentCorrect,'));
  assert.ok(block.includes('checkedSentence: boardPc?.proposed ?? null'));
  assert.ok(VTR.includes('const boardPc = verdictPrecheckRef.current;'));
  assert.ok(VTR.includes("`kind=${card.kind}${card.source ? ` source=${card.source}` : ''}"));
});

// ── Task 18 §D (GDI run 6, embed-1793338574787): fragments, "you said" echoes, partial echoes, number words ──
test('T18 D1: a quoted sentence starter is never a card', () => {
  const t10 = 'Right, you took him around the company and sold him a washing machine. That\'s a clear sentence. Let\'s make it past simple: can you say what you did in one sentence, starting with "Last year, I"?';
  assert.deepEqual(planSentenceBoard({ tutorText: t10, studentLast: 'Uh, I take him around company and sell washing machine to him.', renderedThisTurn: false }), []);
  const t12 = 'Good. "Last year I sold a washing machine to a customer from the USA" is correct. Sold is the past form of sell, and "last year" tells us the event is finished. Now try one more about your own work. Say a sentence starting with "Last month, I".';
  const c12 = planSentenceBoard({ tutorText: t12, studentLast: 'Last year I uh sold washing machine to customer from USA.', renderedThisTurn: false });
  assert.ok(!c12.some((c) => /^Last month, I$/.test(c.sentence)), JSON.stringify(c12));
  const t16 = 'Last month I sold nine washing machines. That\'s a clear sentence, and your past tense is right. Now let\'s keep the same tense: say one sentence starting with "Last week, I".';
  assert.deepEqual(planSentenceBoard({ tutorText: t16, studentLast: 'Last month I sold 9 washing machines.', renderedThisTurn: false, studentCorrect: true }), []);
  // dangling pronoun / article after a comma, and the Japanese starter cue
  assert.equal(isSentenceStarter('Last year, I', 'try this: ', ''), true);
  assert.equal(isSentenceStarter('Last year, I went', 'try this: ', ''), false);
  assert.equal(isSentenceStarter('Last week I went', 'say ', 'で始めてください'), true);
  assert.equal(isSentenceStarter('I went to Kyoto.', 'beginning with ', ''), true);
});
test('T18 D2: "you said …" is an echo whatever its overlap, never promoted', () => {
  const t8 = 'Good, you said "Customer from USA." That\'s a clear answer about the country. Next, could you tell me one thing you did with that customer, in one short sentence?';
  assert.deepEqual(planSentenceBoard({ tutorText: t8, studentLast: 'Customer from USA.', renderedThisTurn: false, studentCorrect: true, checkedSentence: null }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: 'You told me "I sell robots to hotels." Good.', studentLast: 'I sell many robot.', renderedThisTurn: false }), []);
  assert.equal(isSaidQuote('Nice. You said ', ''), true);
  assert.equal(isSaidQuote('', 'と言いました。'), true);
  // the ask "Can you say …" is not a report of the student's words
  assert.equal(isSaidQuote('Can you say the whole sentence once more: ', ''), false);
});
test('T18 D3: a partial echo (every quote token the student\'s) is an echo — the wrong fragment gets no card', () => {
  const student = 'Um, I once had got, I once had got sushi from home and distributed to all my friends in the team. and then they all became my friends.';
  const t66 = 'That\'s a warm story, Praveen. Sharing food is a lovely way to build friendships at work. Now let\'s check one small thing: "I once had got" is not quite right here. For a finished event with "once," the simple past is natural, so try saying: "I once brought sushi from home and shared it with my team."';
  const cards = planSentenceBoard({ tutorText: t66, studentLast: student, renderedThisTurn: false });
  assert.deepEqual(cards.map((c) => c.sentence), ['I once brought sushi from home and shared it with my team.'], JSON.stringify(cards));
  assert.equal(classifyQuotedSentence('I once had got', student).kind, 'echo');
});
test('T18 D4: digits read as number words — 3 ≡ three, 30 ≡ thirty, 1,000 ≡ 1000', () => {
  assert.equal(numberWordToken('3'), 'three');
  assert.equal(numberWordToken('30'), 'thirty');
  assert.equal(numberWordToken('25'), '25');
  assert.equal(numberWordToken('word'), 'word');
  assert.equal(sameSentence('I sold 3 machines', 'I sold three machines.'), true);
  assert.equal(sameSentence('We made 1,000 units', 'We made 1000 units'), true);
  const student = 'I have worked for Nagoya for 3 years';
  // studentCorrect, no correction ⇒ the echo is promoted: ONE model card
  const correct = planSentenceBoard({ tutorText: 'Nice. "I have worked for Nagoya for three years" is the present perfect.', studentLast: student, renderedThisTurn: false, studentCorrect: true });
  assert.deepEqual(correct, [{ sentence: 'I have worked for Nagoya for three years', kind: 'model', emphasis: [], source: 'echo' }]);
  // with a correction card in the same turn ⇒ the correction only
  const both = planSentenceBoard({ tutorText: 'Nice. "I have worked for Nagoya for three years" is fine, but say "I have worked at Nagoya Corporation for three years."', studentLast: student, renderedThisTurn: false, studentCorrect: true });
  assert.deepEqual(both.map((c) => [c.kind, c.sentence]), [['correction', 'I have worked at Nagoya Corporation for three years.']]);
  // the live turn (introduced by "You said") — the correction only
  const live = planSentenceBoard({ tutorText: 'Nice. You said "I have worked for Nagoya for three years," and that\'s the present perfect. Let\'s make it sound natural: say "I have worked at Nagoya Corporation for three years." What do you like most about working there?', studentLast: 'Yes, I have worked uh for Nagoya for 3 years.', renderedThisTurn: false, studentCorrect: true });
  assert.deepEqual(live.map((c) => [c.kind, c.sentence]), [['correction', 'I have worked at Nagoya Corporation for three years.']]);
});

// ── Task 18 fix round 2: deletion / reorder corrections (I1) and the "you said" window (I2) ──
test('T18 R2 I1: a deletion or reorder of the student\'s words is a correction card', () => {
  const cases: Array<[string, string, string]> = [
    ['I am agree with your idea.', 'Say "I agree with your idea."', 'I agree with your idea.'],
    ['We discussed about the plan.', 'Say "We discussed the plan."', 'We discussed the plan.'],
    ['I yesterday went to the office.', 'Say "Yesterday I went to the office."', 'Yesterday I went to the office.'],
  ];
  for (const [student, tutor, card] of cases) {
    const cards = planSentenceBoard({ tutorText: tutor, studentLast: student, renderedThisTurn: false });
    assert.deepEqual(cards.map((c) => [c.kind, c.sentence]), [['correction', card]], `${student} → ${JSON.stringify(cards)}`);
  }
  assert.deepEqual(classifyQuotedSentence('I agree with your idea.', 'I am agree with your idea.').emphasis, ['agree']);
});
test('T18 R2 I1: unbroken runs of the student\'s words still echo', () => {
  assert.equal(classifyQuotedSentence('I once had got', 'Um, I once had got, I once had got sushi from home and distributed to all my friends in the team.').kind, 'echo');
  assert.equal(classifyQuotedSentence('Customer from USA.', 'Customer from USA.').kind, 'echo');
  assert.equal(classifyQuotedSentence('since I started work', GOLF_STUDENT).kind, 'echo');
});
test('T18 R2 I2: "you said" counts only when it leads straight into the quote', () => {
  const a = planSentenceBoard({ tutorText: 'You said you sold nine machines, so say "I sold nine washing machines last month."', studentLast: 'I sell nine machine last month.', renderedThisTurn: false });
  assert.deepEqual(a.map((c) => c.sentence), ['I sold nine washing machines last month.']);
  const b = planSentenceBoard({ tutorText: 'As you said, the meeting was long. Try: "The meeting was very long yesterday."', studentLast: 'Meeting is long.', renderedThisTurn: false });
  assert.deepEqual(b.map((c) => c.sentence), ['The meeting was very long yesterday.']);
  assert.deepEqual(planSentenceBoard({ tutorText: 'Good, you said "Customer from USA." Next question.', studentLast: 'Customer from USA.', renderedThisTurn: false, studentCorrect: true }), []);
  assert.equal(isSaidQuote('Good, you said ', ''), true);
  assert.equal(isSaidQuote('You said: ', ''), true);
});

// ── Task 18 fix round 3 (N1): self-repairs and stutters are still the student's sentence ──
test('T18 R3 N1: a correct echo with a self-repair / stutter is an echo; with studentCorrect a promoted model card', () => {
  const cases: Array<[string, string]> = [
    ['I went to the, to the office yesterday.', 'I went to the office yesterday.'],
    ['I have worked worked here for three years.', 'I have worked here for three years.'],
    ['I like, like sushi very much.', 'I like sushi very much.'],
  ];
  for (const [student, quote] of cases) {
    assert.equal(classifyQuotedSentence(quote, student).kind, 'echo', `${student} / ${quote}`);
    const cards = planSentenceBoard({ tutorText: `Nice. "${quote}" Good sentence.`, studentLast: student, renderedThisTurn: false, studentCorrect: true });
    assert.deepEqual(cards, [{ sentence: quote, kind: 'model', emphasis: [], source: 'echo' }], `${student} → ${JSON.stringify(cards)}`);
  }
});

// ── Task 19 §D (GDI run 7): a correct sentence is carded whether or not the tutor repeats it ──
test('§D19: paraphrase turn + correct checked sentence ⇒ one model card (source checked)', () => {
  const student = 'The project was successful and it increased sales in my company.';
  const tutor = "The project was successful and it increased sales. That's a clear result, and \"increased\" is the right past simple form. What was the biggest challenge you faced during that project?";
  const cards = planSentenceBoard({ tutorText: tutor, studentLast: student, renderedThisTurn: false, studentCorrect: true, checkedSentence: student });
  assert.deepEqual(cards, [{ sentence: student, kind: 'model', emphasis: [], source: 'checked' }]);
  const para = 'Creating the slogan was the challenge, and that\'s a great point to talk about. Could you tell me how you handled it, starting with "I"?';
  const c2 = planSentenceBoard({ tutorText: para, studentLast: 'The biggest challenge in the advertisement project was to create the slogan.', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'The biggest challenge in the advertisement project was to create the slogan.' });
  assert.deepEqual(c2.map((c) => [c.sentence, c.source]), [['The biggest challenge in the advertisement project was to create the slogan.', 'checked']]);
});
test('§D19: leading fillers dropped, capitalised, full stop ensured', () => {
  const tutor = 'Good. Next, tell me about your team.';
  const cards = planSentenceBoard({ tutorText: tutor, studentLast: 'x', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'Okay. Um, I have worked with international customers for several years.' });
  assert.deepEqual(cards.map((c) => c.sentence), ['I have worked with international customers for several years.']);
  assert.equal(cardableStudentSentence('so, i worked on a project to increase sales'), 'I worked on a project to increase sales.');
  assert.equal(cardableStudentSentence('I have uh attended a sales seminar.'), 'I have attended a sales seminar.');
});
test('§D19: a 3-word checked answer ⇒ no card', () => {
  assert.deepEqual(planSentenceBoard({ tutorText: 'Good. What do you do?', studentLast: 'Yes, I attended.', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'Yes, I attended.' }), []);
  assert.equal(cardableStudentSentence('Um, I sell machines.'), null);
});
test('§D19: unchanged — correction turn, renderedThisTurn, not checked correct, a question', () => {
  const student = 'I went to office yesterday.';
  const tutor = 'You said "I went to office yesterday." Add "the": "I went to the office yesterday."';
  const cards = planSentenceBoard({ tutorText: tutor, studentLast: student, renderedThisTurn: false, studentCorrect: true, checkedSentence: student });
  assert.deepEqual(cards.map((c) => c.kind), ['correction']);
  const ok = 'The project was successful and it increased sales in my company.';
  assert.deepEqual(planSentenceBoard({ tutorText: 'Nice.', studentLast: ok, renderedThisTurn: true, studentCorrect: true, checkedSentence: ok }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: 'Nice.', studentLast: ok, renderedThisTurn: false, studentCorrect: false, checkedSentence: ok }), []);
  assert.equal(cardableStudentSentence('Can you repeat the question please?'), null);
});

// ── Task 19 fix round 2 (§D) ──
test('§D19 R2 I2: an unquoted recast or a correction cue ⇒ no checked card', () => {
  const said = 'I work in the sales department and sell washing machine.';
  const recast = 'Nice, you sell washing machines in the sales department. How long have you worked there?';
  assert.deepEqual(planSentenceBoard({ tutorText: recast, studentLast: said, renderedThisTurn: false, studentCorrect: true, checkedSentence: said }), []);
  assert.equal(recastsStudentSentence(recast, said), true);
  const cue = 'Good answer. In English we say "at work" for this. What else do you do there?';
  const ok = 'I answer emails from customers every morning.';
  assert.equal(hasCorrectionCue(cue), true);
  assert.deepEqual(planSentenceBoard({ tutorText: cue, studentLast: ok, renderedThisTurn: false, studentCorrect: true, checkedSentence: ok }), []);
  assert.equal(hasCorrectionCue('正しくは「I went」です。'), true);
  // a plain paraphrase is not a recast
  const para = "The project was successful and it increased sales. That's a clear result. What was the biggest challenge?";
  assert.equal(recastsStudentSentence(para, 'The project was successful and it increased sales in my company.'), false);
});
test('§D19 R2 I3: so / well / okay / ok strip only before punctuation', () => {
  assert.equal(cardableStudentSentence('So far, I have visited Osaka.'), 'So far, I have visited Osaka.');
  assert.equal(cardableStudentSentence('So far I have visited three countries for work.'), 'So far I have visited three countries for work.');
  assert.equal(cardableStudentSentence('Well, so far I have worked with five customers.'), 'So far I have worked with five customers.');
  assert.equal(cardableStudentSentence('So, I work in sales every day.'), 'I work in sales every day.');
  assert.equal(cardableStudentSentence('Um I work in sales every day.'), 'I work in sales every day.');
});
test('§D19 R2 I4: a truncated or multi-sentence proposed ⇒ no card', () => {
  const long = 'I have been responsible for many large projects at my company for a long time and I have worked with customers in many different countries such as China, Korea and the United States, and I have learned a lot from them and';
  assert.ok(long.length >= 195);
  assert.equal(cardableStudentSentence(long), null);
  assert.equal(cardableStudentSentence('I work in sales. I sell washing machines. I like my job.'), null);
  assert.deepEqual(planSentenceBoard({ tutorText: 'Nice.', studentLast: 'x', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'I work in sales. I sell washing machines every day.' }), []);
});
test('§D19 R2 m5: a lowercase fragment is not capitalised into a card', () => {
  assert.equal(cardableStudentSentence('in the sales department, selling washing machines'), null);
  assert.deepEqual(planSentenceBoard({ tutorText: 'Nice.', studentLast: 'x', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'in the sales department, selling washing machines' }), []);
});

// ── Task 19 fix round 3 (§D) ──
test('§D19 R3 I2: one-edit recasts block, any stem', () => {
  const blocks: Array<[string, string]> = [
    ['I go to Osaka yesterday for a meeting.', 'Oh, you went to Osaka yesterday for a meeting.'],
    ['I buyed a new laptop for work last week.', 'You bought a new laptop last week.'],
    ['He go to the office every day by train.', 'He goes to the office every day by train.'],
    ['I work in the sales department and sell washing machine.', 'Nice, you sell washing machines in the sales department.'],
    ['I work as sales manager at Nagoya Corporation.', 'So you work as a sales manager at Nagoya Corporation.'],
  ];
  for (const [said, tutor] of blocks) {
    assert.equal(recastsStudentSentence(tutor, said), true, tutor);
    // Task 21 §B2: a whole-sentence one-edit recast is now a CORRECTION card —
    // still never the checked (wrong) sentence as a model.
    const cards = planSentenceBoard({ tutorText: `${tutor} What else?`, studentLast: said, renderedThisTurn: false, studentCorrect: true, checkedSentence: said });
    assert.ok(cards.every((c) => c.kind === 'correction' && c.source === undefined), `${tutor} ${JSON.stringify(cards)}`);
  }
});
test('§D19 R3 I2: follow-ups and pronoun flips keep the card', () => {
  const keeps: Array<[string, string]> = [
    ['I worked on a project to launch a new product.', 'Launching a new product sounds exciting.'],
    ['I attended a training course last year in Tokyo.', 'Training courses in Tokyo are popular.'],
    ['My company makes parts for cars in Nagoya.', 'Your company makes car parts.'],
    ['I worked on a project to increase sales.', 'You worked on a project to increase sales.'],
  ];
  for (const [said, tutor] of keeps) {
    assert.equal(recastsStudentSentence(tutor, said), false, tutor);
    const cards = planSentenceBoard({ tutorText: `${tutor} What happened next?`, studentLast: said, renderedThisTurn: false, studentCorrect: true, checkedSentence: said });
    assert.deepEqual(cards.map((c) => c.sentence), [said], tutor);
  }
});
test('§D19 R3 m5: a question without "?" is no card', () => {
  assert.equal(cardableStudentSentence('Can you repeat the question please'), null);
  assert.equal(cardableStudentSentence('Yes, I attended a training course at Nagoya Corporation.'), 'Yes, I attended a training course at Nagoya Corporation.');
});

// ── Task 19 fix round 4 (§D) ──
test('§D19 R4 I1: we / our ↔ you / your flips keep the card', () => {
  const keeps: Array<[string, string]> = [
    ['I visited our customer in Germany last month.', 'You visited your customer in Germany last month.'],
    ['We sell our machines to hospitals.', 'You sell your machines to hospitals.'],
    ['I work in the sales department.', 'You work in the sales department.'],
  ];
  for (const [said, tutor] of keeps) {
    assert.equal(recastsStudentSentence(tutor, said), false, tutor);
    const cards = planSentenceBoard({ tutorText: `${tutor} What happened next?`, studentLast: said, renderedThisTurn: false, studentCorrect: true, checkedSentence: said });
    assert.deepEqual(cards.map((c) => c.sentence), [said], tutor);
  }
});
test('§D19 R4 I2: the "more natural way" template and a fix before the last word block', () => {
  const said = 'I was responsible to communicate with our customers.';
  const tutor = 'A more natural way to say this is: I was responsible for communicating with our customers.';
  assert.equal(hasCorrectionCue(tutor), true);
  assert.equal(hasCorrectionCue('自然な言い方は「I was responsible for communicating」です。'), true);
  // Task 21 §B1: the plan's own correction template is a presenting lead — the
  // correction card, never the checked card.
  assert.deepEqual(planSentenceBoard({ tutorText: tutor, studentLast: said, renderedThisTurn: false, studentCorrect: true, checkedSentence: said }),
    [{ sentence: 'I was responsible for communicating with our customers.', kind: 'correction', emphasis: ['for', 'communicating'] }]);
  for (const t of ['A better way to say this is: I was responsible for communicating with our customers.', 'More naturally, you could say: I was responsible for communicating with our customers.']) {
    assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: said, renderedThisTurn: false }).map((c) => c.kind), ['correction'], t);
  }
  assert.equal(recastsStudentSentence('You work in sales.', 'I work in the sales.'), true);
  assert.equal(recastsStudentSentence('You work in the sales.', 'I work in sales.'), true);
  // Task 21 §B2: the deletion recast is a correction card (nothing to mark), never the checked card.
  assert.deepEqual(planSentenceBoard({ tutorText: 'You work in sales. What else?', studentLast: 'I work in the sales.', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'I work in the sales.' }),
    // Task 23 §D2: the recast card keeps the student's person.
    [{ sentence: 'I work in sales.', kind: 'correction', emphasis: [] }]);
});
test('§D19 R4 m5: only a real question opening drops the card', () => {
  assert.equal(cardableStudentSentence('Can you repeat the question please'), null);
  assert.equal(cardableStudentSentence('What is your job'), null);
  for (const keep of ['When I was a student, I studied English in Tokyo.', 'What I like about my job is the people.', 'Where I work, we use English every day.']) {
    assert.equal(cardableStudentSentence(keep), keep, keep);
  }
});

// ── Task 20 §A (GDI run 8): no caps in the spoken text by default ────────
test('20A: the run-8 line is spoken lower-case = the rewritten display text', () => {
  const tutor = `「after attending a sales seminar」と、意味がはっきり伝わります。 The "after" works well here, and "attending" is the right form.`;
  const student = 'I have learned how to talk to customers politely after attend ing a sales seminar.';
  const out = composeSpokenText(tutor, student, RW, [{ sentence: 'after attending a sales seminar', emphasis: ['attending'] }]);
  assert.equal(out, RW(tutor));
  assert.ok(/attending/.test(out) && !/ATTENDING/.test(out), out);
});
test('20A: a correction span is not uppercased without the opt-in', () => {
  assert.equal(composeSpokenText(LEAVE_TUTOR, LEAVE_STUDENT, RW), RW(LEAVE_TUTOR));
});
test('20A: TUTOR_SPOKEN_EMPHASIS_CAPS is opt-in (=== on) and VTR passes it', () => {
  const flags = readFileSync(join(__dirname, '..', 'src/lib/tutor/orchestrator/flags.ts'), 'utf8');
  assert.ok(/TUTOR_SPOKEN_EMPHASIS_CAPS = process\.env\.NEXT_PUBLIC_TUTOR_SPOKEN_EMPHASIS_CAPS === 'on'/.test(flags));
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(vtr.includes('{ emphasisCaps: TUTOR_SPOKEN_EMPHASIS_CAPS }'));
});

// ── Task 20 §G (GDI run 8) ───────────────────────────────────────────────
const G558 = `"I attended a business event in Tokyo last year." That's a correct sentence, and the past simple fits because "last year" is a finished time. Let's keep going, since you've just used the past simple: what was the event about?`;
test('20G1: precheck silent + the tutor affirms the echo ⇒ model card source=affirmed', () => {
  const cards = planSentenceBoard({ tutorText: G558, studentLast: 'I attended a business event in Tokyo last year.', renderedThisTurn: false, affirmFallback: true });
  assert.deepEqual(cards, [{ sentence: 'I attended a business event in Tokyo last year.', kind: 'model', emphasis: [], source: 'affirmed' }]);
});
test('20G1: without the fallback the echo stays filtered (pre-fix)', () => {
  assert.deepEqual(planSentenceBoard({ tutorText: G558, studentLast: 'I attended a business event in Tokyo last year.', renderedThisTurn: false }), []);
});
test('20G1: a correction cue wins — no promotion', () => {
  const t = `"I attended a business event in Tokyo last year." That's a correct sentence, but we say "an event" here.`;
  assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: 'I attended a business event in Tokyo last year.', renderedThisTurn: false, affirmFallback: true }).filter((c) => c.source === 'affirmed'), []);
});
test('20G1: an echo with no affirmation nearby is not promoted', () => {
  const t = `"I attended a business event in Tokyo last year." Tell me more about it. What did you see?`;
  assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: 'I attended a business event in Tokyo last year.', renderedThisTurn: false, affirmFallback: true }), []);
});
test('20G1: affirmation window = the quote\'s sentence or the next one (JA too)', () => {
  const t = 'Good. "I work in sales." Then tell me more. That is a natural sentence.';
  const at = t.indexOf('"I work');
  assert.equal(quoteAffirmed(t, at, t.indexOf('." Then') + 2), false, 'two sentences on is too far');
  const ja = '「I sell washing machines.」と、きちんと言えましたね。';
  assert.equal(quoteAffirmed('"I work in sales." That\'s right!', 0, 18), true);
  assert.equal(quoteAffirmed(ja, 0, ja.indexOf('」') + 1), true);
});
const G913 = { tutorText: `"Robots can walk and talk" is a clear statement, and you used "learned" correctly. Now let's check your English: "I learned that robots can walk and talk" is a natural sentence. Could you tell me one more thing you learned at the event, starting with "I learned that…"?`, studentLast: 'I learned uh that robots can walk and talk.' };
const G1302 = { tutorText: `"The seminar was very good because it was motivational, and the result was positive." That sentence is complete and clear. Now, you asked earlier about one project you're proud of, so please tell me one thing you would do differently next time.`, studentLast: 'The seminar was very good because it was motivational and the result was positive.' };
test('20G1 fix round 1 (I6): praise of the meaning / a part never boards a wrong sentence', () => {
  for (const [t, st] of [
    ['"I working in sales department." The meaning is clear.', 'I working in sales department.'],
    ['"I working in sales department." The idea is clear. Let\'s fix the verb.', 'I working in sales department.'],
    ['"I go to Tokyo last year." 過去形が正しいですね。', 'I go to Tokyo last year.'],
    ['"I am responsible of the team." That is clear, and nice try.', 'I am responsible of the team.'],
    ['"I have worked here for five years." That\'s a good question to ask a colleague.', 'I have worked here for five years.'],
    ['"I attended a business event in Tokyo last year." That\'s a correct sentence, but let\'s add "an".', 'I attended a business event in Tokyo last year.'],
  ]) assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false, affirmFallback: true }), [], t);
});
test('20G fix round 2 (m5, m6): "but" only near the affirmation; a qualified praise is no affirmation', () => {
  const g558 = 'I attended a business event in Tokyo last year.';
  assert.equal(planSentenceBoard({ tutorText: `"${g558}" That's a correct sentence, but let's add one detail: what was it about?`, studentLast: g558, renderedThisTurn: false, affirmFallback: true }).length, 0, ', but in the affirmation sentence');
  assert.equal(planSentenceBoard({ tutorText: `"${g558}" That's a correct sentence. But we need one more detail.`, studentLast: g558, renderedThisTurn: false, affirmFallback: true }).length, 0, 'But opening the next sentence');
  assert.equal(planSentenceBoard({ tutorText: `"${g558}" That's a correct sentence. Next: tell me what you did. I liked it, but it was long. What else?`, studentLast: g558, renderedThisTurn: false, affirmFallback: true }).length, 1, 'a "but" far away does not block');
  assert.equal(planSentenceBoard({ tutorText: '"I am work in sales." That\'s a good sentence to start with. Now add "for five years".', studentLast: 'I am work in sales.', renderedThisTurn: false, affirmFallback: true }).length, 0, 'm6');
});
test('20G2: 913 s — verdict correct at MEDIUM confidence (precheckDecides false): ONE model card via the affirmation', () => {
  const cards = planSentenceBoard({ ...G913, renderedThisTurn: false, studentCorrect: false, affirmFallback: true, checkedSentence: 'I learned that robots can walk and talk.' });
  assert.deepEqual(cards.map((c) => c.sentence), ['I learned that robots can walk and talk']);
  assert.equal(cards[0]!.kind, 'model');
});
test('20G2: 1302 s — one model card', () => {
  const cards = planSentenceBoard({ ...G1302, renderedThisTurn: false, studentCorrect: false, affirmFallback: true, checkedSentence: G1302.studentLast });
  assert.equal(cards.length, 1);
  assert.equal(cards[0]!.sentence, 'The seminar was very good because it was motivational, and the result was positive.');
});
test('20G2: with a deciding check the same inputs still give one card each', () => {
  assert.equal(planSentenceBoard({ ...G913, renderedThisTurn: false, studentCorrect: true, checkedSentence: 'I learned that robots can walk and talk.' }).length, 1);
  assert.equal(planSentenceBoard({ ...G1302, renderedThisTurn: false, studentCorrect: true, checkedSentence: G1302.studentLast }).length, 1);
});
test('20G2: VTR — affirmFallback when the check is silent or correct-but-undecided', () => {
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(vtr.includes("affirmFallback: !boardStudentCorrect && (!boardPc || (boardPc.verdict === 'correct' && !precheckDecides(boardPc)))"));
  assert.ok(vtr.includes('prevTutorText: prevBoardTutorTextRef.current'));
});
test('20G3: a reply to a hint / more-time offer gets no checked card', () => {
  const prev = 'Take your time. Would you like a hint, or a little more time to think about the question?';
  const tutor = 'Of course. Here\'s a hint: use the past simple when there\'s a specific time word like "last year." So the verb changes form. Try starting with "I attended…" and tell me one event you went to last year.';
  const args = { tutorText: tutor, studentLast: 'Yes, I would like hint.', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'Yes, I would like hint.' };
  assert.ok(planSentenceBoard(args).some((c) => c.source === 'checked'), 'pre-fix: carded');
  assert.equal(planSentenceBoard({ ...args, prevTutorText: prev }).some((c) => c.source === 'checked'), false);
  assert.equal(isMetaOfferTurn('ヒントが必要ですか？'), true);
  assert.equal(isMetaOfferTurn('What did you do last weekend?'), false);
});
test('20G3 fix round 1 (m1): a turn that GIVES a hint, or "take your time" before the real question, does not block', () => {
  assert.equal(isMetaOfferTurn('Of course. Here\'s a hint: use the past simple. Try starting with "I attended…" and tell me one event you went to last year.'), false);
  assert.equal(isMetaOfferTurn('Take your time — tell me about your last project.'), false);
  assert.equal(isMetaOfferTurn('Take your time. What did you learn at the event?'), false);
  assert.equal(isMetaOfferTurn('Would you like a hint?'), true);
  assert.equal(isMetaOfferTurn('Do you need a little more time?'), true);
  // Fix round 2 (m1): a bare "time" is no offer.
  assert.equal(isMetaOfferTurn('What time do you usually start work?'), false);
  assert.equal(isMetaOfferTurn('What did you do last time you met a client?'), false);
  assert.ok(planSentenceBoard({ tutorText: 'Good.', studentLast: 'I usually start work at nine.', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'I usually start work at nine.', prevTutorText: 'What time do you usually start work?' }).some((c) => c.source === 'checked'), 'carded after "What time…?"');
  const args = { tutorText: 'Good.', studentLast: 'I attended a robotics business event in Tokyo last year.', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'I attended a robotics business event in Tokyo last year.' };
  assert.ok(planSentenceBoard({ ...args, prevTutorText: 'Of course. Here\'s a hint: use the past simple. Try starting with "I attended…".' }).some((c) => c.source === 'checked'));
});

// ── Task 21 §B (GDI run 9, embed-1793389442113): unquoted model / corrected sentences ──
const R9_477 = { tutorText: 'You said the word "exhibition" in pieces, and your sentence was the one I asked for. Let\'s say the full sentence once more: I attended the robotics exhibition in Tokyo last year.', studentLast: 'I attended the robotics exhibit ion in Tokyo last year.' };
const R9_527 = { tutorText: 'You met a customer yesterday, so "met" is the right past simple form for a finished event at a specific time. Let\'s say it as a full sentence: I met a customer yesterday. What did you talk about with that customer?', studentLast: 'Uh, I met a customer yesterday in person in my company.' };
const R9_571 = { tutorText: 'You told the customer how good your company is. Let\'s make that sentence in English: I talked to the customer about how good our company is. Now, what made your company stand out to that customer?', studentLast: 'I talked to the customer about how good my company is.' };
test('21B1: the three run-9 colon-introduced lines → one card each', () => {
  // 477 s: checked correct (high); the STT split "exhibit ion" makes the tutor's
  // sentence differ from the student's by one word ⇒ a correction marking it.
  const c477 = planSentenceBoard({ ...R9_477, renderedThisTurn: false, studentCorrect: true, checkedSentence: R9_477.studentLast });
  assert.deepEqual(c477, [{ sentence: 'I attended the robotics exhibition in Tokyo last year.', kind: 'correction', emphasis: ['exhibition'] }]);
  // the same line after a clean transcript is the model (echo of a correct sentence)
  assert.deepEqual(planSentenceBoard({ tutorText: R9_477.tutorText, studentLast: 'I attended the robotics exhibition in Tokyo last year.', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'I attended the robotics exhibition in Tokyo last year.' }),
    [{ sentence: 'I attended the robotics exhibition in Tokyo last year.', kind: 'model', emphasis: [], source: 'echo' }]);
  // 527 s: precheck none — the introduced echo is the sentence to say
  assert.deepEqual(planSentenceBoard({ ...R9_527, renderedThisTurn: false, affirmFallback: true }),
    [{ sentence: 'I met a customer yesterday.', kind: 'model', emphasis: [], source: 'introduced' }]);
  // 571 s: precheck none — a correction with [our]
  assert.deepEqual(planSentenceBoard({ ...R9_571, renderedThisTurn: false, affirmFallback: true }),
    [{ sentence: 'I talked to the customer about how good our company is.', kind: 'correction', emphasis: ['our'] }]);
});
test('21B1: a question / instruction / quote / short tail after a colon is no card', () => {
  const st = 'I attended the robotics exhibit ion last year.';
  for (const t of [
    'Yes, your sentence was right. Let\'s keep moving: when did you last meet a customer in person?',
    'Try this: Tell me about the last customer you met.',
    'Say it once more: I met him.',
    'Try this: "I have worked with customers for three years." Can you say one?',
    'The question was: what is one project you\'ve worked on that you\'re particularly proud of?',
    'You said: I attended the robotics exhibit ion last year.',
    'Here is my plan for today: we will practise the past simple together.',
  ]) assert.ok(!planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false, affirmFallback: true }).some((c) => c.source === 'introduced' || (c.kind === 'model' && !t.includes('"'))), t);
  // a "you said:" lead stays an echo
  assert.deepEqual(planSentenceBoard({ tutorText: 'You said: I attended the robotics exhibit ion last year. Good try.', studentLast: st, renderedThisTurn: false }), []);
});
test('21B2: 598 s unquoted recast → correction card emphasis [a]', () => {
  const t = 'Your company gives a lot of health benefits to its employees. Good, that\'s a clear reason. Could you say it once more with "lots of," since "lot" needs an "s" when it means "many"? Then tell me one thing you\'d like to try at work next year.';
  assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: 'My company gives lot of health benefits to its employees.', renderedThisTurn: false, affirmFallback: true }),
    // Task 23 §D2: written back into the student's person (Your → My).
    [{ sentence: 'My company gives a lot of health benefits to its employees.', kind: 'correction', emphasis: ['a'], emphasisAt: [3] }]);
  // substitution → the new word; leading interjection dropped
  assert.deepEqual(recastCorrectionCard('Oh, you went to Osaka yesterday for a meeting.', 'I go to Osaka yesterday for a meeting.'),
    { sentence: 'I went to Osaka yesterday for a meeting.', kind: 'correction', emphasis: ['went'], emphasisAt: [1] });
  // several edits (a local one-edit run inside a rewrite) → no recast card
  assert.equal(recastCorrectionCard('Right, you took him around the company and sold him a washing machine.', 'Uh, I take him around company and sell washing machine to him.'), null);
  // a recast question is no card
  assert.equal(recastCorrectionCard('So you went to Osaka yesterday for a meeting?', 'I go to Osaka yesterday for a meeting.'), null);
  // a quoted correction already planned ⇒ no second (recast) card
  const both = 'Your company gives a lot of health benefits to its employees. So the full sentence is "My company gives a lot of health benefits to its employees."';
  assert.ok(recastCorrectionCard(both, 'My company gives lot of health benefits to its employees.'));
  const cards = planSentenceBoard({ tutorText: both, studentLast: 'My company gives lot of health benefits to its employees.', renderedThisTurn: false });
  assert.deepEqual(cards.map((c) => c.sentence), ['My company gives a lot of health benefits to its employees.']);
});
test('21B3: 626 s quoted fragment of the checked sentence → the full sentence, fragment marked', () => {
  const t = '"Lots of health benefits" is exactly right, and the sentence is clear. Now let\'s go back to our extension question: what is one project you\'ve worked on that you\'re particularly proud of? Try starting with "I worked on a project to..."';
  const st = 'My company gives lots of health benefits to its employees.';
  assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false, studentCorrect: true, checkedSentence: st }),
    [{ sentence: st, kind: 'model', emphasis: ['lots', 'of'], source: 'checked' }]);
  // not checked correct ⇒ unchanged (the echo stays filtered)
  assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false }), []);
});
test('21B4: 693 s medium-confidence correct, the tutor neither corrects nor recasts → checked card', () => {
  const st = 'I worked on the selling with a smile project at my company which I am very proud of.';
  const t = 'Can you tell me what the project involved, and what was your part in it? Start with "My part was..."';
  assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false, affirmFallback: true, checkedMedium: true, checkedSentence: st }),
    [{ sentence: st, kind: 'model', emphasis: [], source: 'checked' }]);
  assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false, affirmFallback: true, checkedSentence: st }), [], 'without checkedMedium');
  // a correction cue / a recast ⇒ none
  assert.deepEqual(planSentenceBoard({ tutorText: 'Good. We say "proud of" here. What was your part?', studentLast: st, renderedThisTurn: false, checkedMedium: true, checkedSentence: st }), []);
  // the Task 20 I6 wrong-sentence probes still → no card, even with checkedMedium
  for (const [tt, s2] of [
    ['"I working in sales department." The meaning is clear.', 'I working in sales department.'],
    ['"I working in sales department." The idea is clear. Let\'s fix the verb.', 'I working in sales department.'],
    ['"I go to Tokyo last year." 過去形が正しいですね。', 'I go to Tokyo last year.'],
    ['"I am responsible of the team." That is clear, and nice try.', 'I am responsible of the team.'],
    ['"I have worked here for five years." That\'s a good question to ask a colleague.', 'I have worked here for five years.'],
    ['"I attended a business event in Tokyo last year." That\'s a correct sentence, but let\'s add "an".', 'I attended a business event in Tokyo last year.'],
  ]) assert.deepEqual(planSentenceBoard({ tutorText: tt, studentLast: s2, renderedThisTurn: false, affirmFallback: true, checkedMedium: true, checkedSentence: s2 }), [], tt);
});
test('21B4: VTR passes checkedMedium (correct, medium, not other_part / neither)', () => {
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(vtr.includes("checkedMedium: !boardStudentCorrect && !!boardPc && boardPc.verdict === 'correct' && boardPc.confidence === 'medium' && boardPc.answers !== 'other_part' && boardPc.answers !== 'neither',"));
});

// ── Task 21 fix round 1 (§B) ──
test('21B r1 I1: only an explicit presenting lead introduces a card; the tail must be declarative', () => {
  const st = 'I work in the sales department and sell washing machines.';
  // Task 22 §G: "Your sentence is correct" with nothing else carded now cards
  // the STUDENT's sentence (source 'affirmed') — never the introduced tail.
  assert.deepEqual(planSentenceBoard({ tutorText: 'Your sentence is correct: The past simple fits a finished event.', studentLast: st, renderedThisTurn: false, affirmFallback: true }),
    [{ sentence: st, kind: 'model', emphasis: [], source: 'affirmed' }]);
  for (const t of [
    'Let me explain the sentence: The verb comes after the subject.',
    "Let's look at the sentence again: The verb is in the wrong place here.",
    'Try this: When you meet a customer, smile and say hello.',
    'Try this: Next time, use the past tense for finished events.',
    'Say these words again: Apple, banana, cherry, grape.',
    'The form is: Subject plus verb plus object.',
    // explicit leads, but the tail is no declarative sentence
    'Say it like this: When you meet a customer, smile.',
    'The model is: Apple, banana, cherry, grape.',
    'Say it once more: Do you sell washing machines?',
  ]) assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false, affirmFallback: true }), [], t);
  // the run-9 lines still card (pinned above); the other explicit leads
  const g = (t: string) => planSentenceBoard({ tutorText: t, studentLast: 'I sell washing machine in my company.', renderedThisTurn: false, affirmFallback: true });
  assert.deepEqual(g('The correct sentence is: I sell washing machines in my company.').map((c) => c.kind), ['correction']);
  assert.deepEqual(g('In English, you could say: I sell washing machines in my company.').map((c) => c.kind), ['correction']);
  assert.deepEqual(g("Let's put it as a full sentence: I sell washing machines in my company.").map((c) => c.kind), ['correction']);
});
test('21B r1 I2: a medium-confidence correct cards only with no quoted span and no cue', () => {
  const st = 'I worked on project to increase sales.';
  assert.deepEqual(planSentenceBoard({ tutorText: 'Good. Remember to add "a" before "project". What was the result?', studentLast: st, renderedThisTurn: false, affirmFallback: true, checkedMedium: true, checkedSentence: st }), []);
  const st2 = 'I working in sales department every day.';
  assert.deepEqual(planSentenceBoard({ tutorText: 'The meaning is clear. What happened next?', studentLast: st2, renderedThisTurn: false, affirmFallback: true, checkedMedium: true, checkedSentence: st2 }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: "Nice. Don't forget the article. What was the result?", studentLast: st, renderedThisTurn: false, checkedMedium: true, checkedSentence: st }), []);
  assert.deepEqual(planSentenceBoard({ tutorText: 'Nice. "Project" needs an article. What was the result?', studentLast: st, renderedThisTurn: false, checkedMedium: true, checkedSentence: st }), [], 'a one-word quote blocks');
  // 693 s (a starter quote only) still → card
  const st3 = 'I worked on the selling with a smile project at my company which I am very proud of.';
  assert.equal(planSentenceBoard({ tutorText: 'Can you tell me what the project involved, and what was your part in it? Start with "My part was..."', studentLast: st3, renderedThisTurn: false, affirmFallback: true, checkedMedium: true, checkedSentence: st3 }).length, 1);
});
test('21B r1 concern 1: only the brain\'s own show_sentence blocks the client\'s cards', () => {
  assert.equal(sentenceBoardBlockedByRenders(['showProblem']), false);
  assert.equal(sentenceBoardBlockedByRenders(['show_problem', 'handwrite', 'show_table', 'tutor_scribble']), false);
  assert.equal(sentenceBoardBlockedByRenders(['showSentence']), true);
  assert.equal(sentenceBoardBlockedByRenders(['show_problem', 'show_sentence']), true);
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(vtr.includes('renderedThisTurn: sentenceBoardBlockedByRenders(totalToolNamesSeen),'));
  assert.ok(vtr.includes('...(card.emphasisAt?.length ? { emphasisAt: card.emphasisAt } : {}),'));
});
test('21B r1 m (B2): emphasis marks the edited position; reflexive / it-that flips are no edits', () => {
  assert.deepEqual(recastCorrectionCard('You have a meeting with a client every day.', 'I have meeting with a client every day.'),
    { sentence: 'I have a meeting with a client every day.', kind: 'correction', emphasis: ['a'], emphasisAt: [2] });
  assert.equal(recastCorrectionCard('You talked with him yourself about it.', 'I talked with him myself about it.'), null);
  assert.equal(recastCorrectionCard('You said that was the best part of the trip.', 'I said it was the best part of the trip.'), null);
  const canvas = readFileSync(join(__dirname, '..', 'src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx'), 'utf8');
  assert.ok(canvas.includes('(!at || at.has((i - 1) / 2))'));
});

// ── Task 21 fix round 2 (§B I2 residual): implicit-correction cues on the medium path ──
test('21B r2 I2: implicit corrections block the medium-confidence card; silent acceptance still cards', () => {
  const st = 'I worked on project to increase sales.';
  const m = (t: string, s2 = st) => planSentenceBoard({ tutorText: t, studentLast: s2, renderedThisTurn: false, affirmFallback: true, checkedMedium: true, checkedSentence: s2 });
  for (const t of [
    'Nice! Just remember the article before project. What was the result?',
    'Good. Remember the article before project next time. What was the result?',
    'Good idea. In English we usually put an article there. What was the result?',
    'Okay. Keep in mind we need an article there. What was the result?',
    'Good. Remember, an article goes before project. What was the result?',
  ]) assert.deepEqual(m(t), [], t);
  assert.deepEqual(m('I understand what you mean. What happened next?', 'I working in sales department every day.'), [], 'what you mean');
  // accepted residual: cue-free silent acceptance
  assert.equal(m('I see. What else do you do there?', 'I am responsible of the sales team.').length, 1);
  // 693 s still → card
  const st3 = 'I worked on the selling with a smile project at my company which I am very proud of.';
  assert.equal(m('Can you tell me what the project involved, and what was your part in it? Start with "My part was..."', st3).length, 1);
  // the high-confidence path is unchanged by the medium cues
  assert.equal(planSentenceBoard({ tutorText: 'Good. Remember the article before project next time.', studentLast: 'I worked on the project to increase sales.', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'I worked on the project to increase sales.' }).length, 1);
});

test('21B r3: "remember" / "article" are cues only in a correcting frame', () => {
  const st = 'I attended the robotics exhibition in Tokyo last year.';
  const m = (t: string) => planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false, affirmFallback: true, checkedMedium: true, checkedSentence: st });
  assert.equal(m('What do you remember most about the exhibition?').length, 1);
  assert.equal(m('Did you write an article about it?').length, 1);
});

// ── Task 23 §B2: every level-check answer goes on the board ──
{
  const T81 = "Thank you, that's a useful example. Could you tell me one thing about that work, like a project or a meeting, in one or two sentences?";
  const S81 = 'Yes, I worked with an international customer. I work with customer from USA.';
  const T99 = "Thank you. You sell washing machines to a US company, so that's useful experience. Now, question 3, please answer in English: What is one skill you'd like to improve in your English, and why is it important to you?";
  const S99 = 'I sell washing machine to the USA customer for their company.';
  const base = { renderedThisTurn: false, studentCorrect: false, affirmFallback: false, checkedMedium: false };
  test('23B2: 81 s level-check answer (partly correct, unquoted) → one levelcheck card', () => {
    const cards = planSentenceBoard({ ...base, tutorText: T81, studentLast: S81, checkedSentence: S81, levelCheck: true });
    assert.equal(cards.length, 1);
    assert.equal(cards[0]!.source, 'levelcheck');
    assert.equal(cards[0]!.kind, 'model');
    assert.equal(cards[0]!.sentence, 'Yes, I worked with an international customer. I work with customer from USA.');
  });
  // Task 28 §A: T99 recasts S99 ("You sell washing machines to a US company") — the
  // uncorrected level-check card is no longer drawn under it (was one levelcheck card).
  test('23B2 / 28A / 29H: 99 s level-check answer the tutor recast → no card of the raw words; the restatement card (first person) instead', () => {
    const cards = planSentenceBoard({ ...base, tutorText: T99, studentLast: S99, checkedSentence: S99, levelCheck: true });
    assert.deepEqual(cards.map((c) => [c.kind, c.source, c.sentence]), [['correction', 'levelcheck', 'I sell washing machines to a US company.']], JSON.stringify(cards));
  });
  test('23B2: the same inputs outside the level check → no card', () => {
    assert.equal(planSentenceBoard({ ...base, tutorText: T81, studentLast: S81, checkedSentence: S81 }).length, 0);
    assert.equal(planSentenceBoard({ ...base, tutorText: T99, studentLast: S99, checkedSentence: S99 }).length, 0);
  });
  test('23B2: a question, a short reply, a Japanese reply → no levelcheck card', () => {
    assert.equal(planSentenceBoard({ ...base, tutorText: T81, studentLast: 'Can you repeat the question?', levelCheck: true }).length, 0);
    assert.equal(planSentenceBoard({ ...base, tutorText: T81, studentLast: 'Yes, I did.', levelCheck: true }).length, 0);
    assert.equal(planSentenceBoard({ ...base, tutorText: T81, studentLast: 'わかりません', levelCheck: true }).length, 0);
    assert.equal(levelCheckAnswerCard('Um, I work in sales at Nagoya.'), 'I work in sales at Nagoya.');
  });
  test('23B2: a card of the same sentence already planned ⇒ no second one', () => {
    const t = 'You said "I work as sales manager at Nagoya Corporation." That\'s a correct sentence.';
    const cards = planSentenceBoard({ renderedThisTurn: false, affirmFallback: true, tutorText: t, studentLast: 'I work as sales manager at Nagoya Corporation.', levelCheck: true });
    assert.equal(cards.length, 1);
  });
  test('23B2: VTR keys the level check on the turn-start segment\'s skipWhenLevelKnown', () => {
    const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
    assert.ok(vtr.includes('levelCheck: lessonPlanRef.current?.segments.find((sg) => sg.id === turnStartSegmentId)?.metadata?.skipWhenLevelKnown === true,'));
  });
}

// ── Task 23 §D: numbers, pronoun shift, starter / fragment quotes ──
{
  const T344 = 'Good, "I have worked for Nagoya for three years" is correct. You used the present perfect because you started in the past and still work there now. Could you say the complete sentence once more, with "Nagoya Corporation"?';
  const S344 = 'Yes, I have worked for uh Nagoya for 3 years.';
  test('23D1: 344 s — digits vs words on the board, "…" is correct ⇒ model card', () => {
    // run-11 precheck: correct at medium confidence ⇒ affirmFallback + checkedMedium
    const cards = planSentenceBoard({ renderedThisTurn: false, studentCorrect: false, affirmFallback: true, checkedMedium: true, tutorText: T344, studentLast: S344, checkedSentence: S344 });
    assert.deepEqual(cards.map((c) => [c.kind, c.sentence]), [['model', 'I have worked for Nagoya for three years']]);
    // the tokeniser: 35 ≡ thirty-five, 21 ≡ twenty one (normaliseNumberTokens on both sides)
    assert.equal(classifyQuotedSentence('I sold thirty-five machines this year', 'I sold 35 machines this year.').kind, 'echo');
    assert.equal(classifyQuotedSentence('I have twenty one customers now', 'I have 21 customers now.').kind, 'echo');
    assert.deepEqual(classifyQuotedSentence('I sold 35 washing machines this year', 'I sold 35 washing machine this year.').emphasis, ['machines']);
  });
  test('23D1: "…" is correct promotes; a qualified or "but" one does not', () => {
    const t = 'Good, "I have worked for Nagoya for three years" is correct, but say "Nagoya Corporation".';
    assert.equal(planSentenceBoard({ renderedThisTurn: false, affirmFallback: true, tutorText: t, studentLast: S344 }).length, 0);
  });
  const T399 = "Good, that's a clear answer. You learned how to sell washing machines, and you used the present perfect correctly. Now, can you tell me one way that skill has helped you with your customers?";
  const S399 = 'I learned how to sell washing machine at Nagoya during those 3 years.';
  test('23D2: 399 s — a clause recast of the head of the student\'s sentence ⇒ correction card in the student\'s person', () => {
    const cards = planSentenceBoard({ renderedThisTurn: false, studentCorrect: false, affirmFallback: false, tutorText: T399, studentLast: S399, checkedSentence: S399 });
    assert.deepEqual(cards, [{ sentence: 'I learned how to sell washing machines.', kind: 'correction', emphasis: ['machines'], emphasisAt: [6] }]);
    assert.equal(recastsStudentSentence(T399, S399), true);
  });
  test('23D2: am / are, I\'m / you\'re are person shifts, not edits; the card is written back', () => {
    assert.equal(recastsStudentSentence('You are the leader of a small team.', 'I am the leader of a small team.'), false);
    assert.deepEqual(recastCorrectionCard('You are the leader of a small team.', 'I am leader of a small team.'),
      { sentence: 'I am the leader of a small team.', kind: 'correction', emphasis: ['the'], emphasisAt: [2] });
    assert.deepEqual(recastCorrectionCard('Your team sells washing machines to hospitals.', 'My team sell washing machines to hospitals.'),
      { sentence: 'My team sells washing machines to hospitals.', kind: 'correction', emphasis: ['sells'], emphasisAt: [2] });
  });
  test('23D2: a rephrase / truncated echo clause is no recast', () => {
    assert.equal(recastsStudentSentence('Your company makes car parts, and that is a big market.', 'My company makes parts for cars in Nagoya.'), false);
    assert.equal(recastCorrectionCard('You learned how to sell, and that is useful.', S399), null);
    assert.equal(recastCorrectionCard('You learned how to sell washing machines, right?', S399), null);
  });
  test('23D3: 302 s / 1260 s — a quoted starter / fragment is never a card', () => {
    const T302 = 'Yes, that\'s right. You said you have worked with an international customer, and you used the present perfect, "I have worked," well. Now, can you tell me one thing about that customer, using "I have worked with..." again?';
    assert.deepEqual(planSentenceBoard({ renderedThisTurn: false, studentCorrect: true, tutorText: T302, studentLast: 'Yes, I have worked with an international customer before.', checkedSentence: 'Yes, I have worked with an international customer before.' }), []);
    const T1260 = 'You sold 35 washing machines this year, and "I have sold" is the right present perfect form. Can you say that sentence once more, starting with "I have sold"?';
    assert.deepEqual(planSentenceBoard({ renderedThisTurn: false, studentCorrect: true, tutorText: T1260, studentLast: 'I have uh sold 35 washing machines this year.', checkedSentence: 'I have uh sold 35 washing machines this year.' }), []);
    // a whole sentence still cards
    const ok1 = planSentenceBoard({ renderedThisTurn: false, studentCorrect: true, tutorText: 'Good, "I have worked at Nagoya for three years" is correct.', studentLast: 'I have worked at Nagoya for three years.', checkedSentence: 'I have worked at Nagoya for three years.' });
    assert.deepEqual(ok1.map((c) => c.sentence), ['I have worked at Nagoya for three years']);
  });
  test('23D3: isQuotedFragment shapes', () => {
    assert.equal(isQuotedFragment('I have worked,', 'the present perfect, ', ' well.'), true);
    assert.equal(isQuotedFragment('I have sold', '', ' is the right form'), true);
    // fix round 1 (m1): "using" no longer marks a fragment
    assert.equal(isQuotedFragment('I have worked with customers', 'Try using ', '.'), false);
    assert.equal(isQuotedFragment('I have worked with customers', 'Remember the form ', '.'), true);
    assert.equal(isQuotedFragment('I have worked with customers', 'Use the phrase ', '.'), true);
    assert.equal(isQuotedFragment('I have worked with customers for years', 'You said ', ' correctly.'), true);
    assert.equal(isQuotedFragment('I have worked at Nagoya for three years', 'Good, ', ' is correct.'), false);
  });
}

// ── Task 23 §E: the answer to a choice menu is no card ──
{
  const T1063 = 'Option 2, a complete sentence, let\'s do it. Please listen and repeat this one: "I have worked with international customers for several years."';
  const S1063 = 'Yes, I would like to do practice pronunciation of complete sentence.';
  const P1063 = 'Yes, practice pronunciation of a complete sentence (option 2).';
  const MENU = 'Would you like to practice your pronunciation? You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue.';
  test('23E: 1063 s — the pick is not carded; the drill sentence still is', () => {
    const cards = planSentenceBoard({ renderedThisTurn: false, studentCorrect: true, tutorText: T1063, studentLast: S1063, checkedSentence: P1063, choiceMenu: boardOffersChoices({ statement: MENU }) });
    assert.deepEqual(cards.map((c) => c.sentence), ['I have worked with international customers for several years.']);
    assert.ok(cards.every((c) => !c.source));
    // the option acknowledgement alone blocks too
    const cards2 = planSentenceBoard({ renderedThisTurn: false, studentCorrect: true, tutorText: T1063, studentLast: S1063, checkedSentence: P1063 });
    assert.ok(cards2.every((c) => c.source !== 'checked'));
  });
  test('23E: an open question with the same student sentence still cards it', () => {
    const t = 'Good. Which part of your job do you enjoy most?';
    const s1 = 'I would like to practise pronunciation of a complete sentence.';
    const cards = planSentenceBoard({ renderedThisTurn: false, studentCorrect: true, tutorText: t, studentLast: s1, checkedSentence: s1, choiceMenu: boardOffersChoices({ statement: 'What would you like to practise today?' }) });
    assert.deepEqual(cards.map((c) => [c.source, c.sentence]), [['checked', s1]]);
  });
  test('23E: menu detection — hasChoices, ≥ 2 markers, option acknowledgements', () => {
    assert.equal(boardOffersChoices({ statement: MENU }), true);
    assert.equal(boardOffersChoices({ statement: 'Pick one: A) a word B) a sentence' }), true);
    assert.equal(boardOffersChoices({ statement: 'Have you worked for your current company for a long time?' }), false);
    assert.equal(boardOffersChoices({ statement: 'Step 1) say it.' }), false);
    assert.equal(boardOffersChoices({ hasChoices: true, statement: 'x' }), true);
    assert.equal(boardOffersChoices(null), false);
    assert.equal(acknowledgesOption(T1063), true);
    assert.equal(acknowledgesOption('Great, you chose option two. Listen.'), true);
    assert.equal(acknowledgesOption('Good sentence. Option 2 is next time.'), false);
  });
  test('23E: VTR passes the board problem as choiceMenu', () => {
    const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
    assert.ok(vtr.includes('choiceMenu: boardOffersChoices(currentProblemRef.current ?? (() => {'));
  });
}

// ── Task 23 fix round 1 (I1, m2): write-back keeps agreement; a be-verb fix is an edit ──
test('23 r1 I1: a person word with no student counterpart ⇒ no write-back (never "I are")', () => {
  assert.deepEqual(planSentenceBoard({ renderedThisTurn: false, tutorText: 'Nice. You are working in sales now. What do you sell?', studentLast: 'I working in sales now.' }),
    // fix round 2 (I1): the be-verb is written back in the agreeing first-person form
    [{ sentence: 'I am working in sales now.', kind: 'correction', emphasis: ['am'], emphasisAt: [1] }]);
  assert.deepEqual(planSentenceBoard({ renderedThisTurn: false, tutorText: 'You are working in sales, and that sounds busy.', studentLast: 'I working in sales at Nagoya.' }).map((c) => c.sentence), ['I am working in sales.']);
  const t399 = "Good, that's a clear answer. You learned how to sell washing machines, and you used the present perfect correctly.";
  assert.deepEqual(planSentenceBoard({ renderedThisTurn: false, tutorText: t399, studentLast: 'I learned how to sell washing machine at Nagoya during those 3 years.' }),
    [{ sentence: 'I learned how to sell washing machines.', kind: 'correction', emphasis: ['machines'], emphasisAt: [6] }]);
  assert.deepEqual(recastCorrectionCard('You are the leader of a small team.', 'I am leader of a small team.')?.sentence, 'I am the leader of a small team.');
});
test('23 r1 m2: "I is / I are" → "I am" is a correction with [am]', () => {
  assert.deepEqual(planSentenceBoard({ renderedThisTurn: false, tutorText: 'Good. I am working on a new project. What is it about?', studentLast: 'I is working on a new project.' }),
    [{ sentence: 'I am working on a new project.', kind: 'correction', emphasis: ['am'], emphasisAt: [1] }]);
  assert.deepEqual(planSentenceBoard({ renderedThisTurn: false, tutorText: 'Good. I am a sales manager at Nagoya. What do you sell?', studentLast: 'I are a sales manager at Nagoya.' }),
    [{ sentence: 'I am a sales manager at Nagoya.', kind: 'correction', emphasis: ['am'], emphasisAt: [1] }]);
  // an agreeing I am ↔ you are is still a person shift, not an edit
  assert.equal(recastsStudentSentence('You are the leader of a small team.', 'I am the leader of a small team.'), false);
});

test('23 r1 m1: "Use "…"" and a whole sentence quoted with its comma card; a short comma starter does not', () => {
  const c1 = planSentenceBoard({ renderedThisTurn: false, tutorText: 'Close. Use "I attended a robotics exhibition in Tokyo last year." Can you say it?', studentLast: 'I attend robotics exhibition in Tokyo last year.' });
  assert.deepEqual(c1.map((c) => c.sentence), ['I attended a robotics exhibition in Tokyo last year.']);
  const T302 = 'Yes, that\'s right. You said you have worked with an international customer, and you used the present perfect, "I have worked," well.';
  assert.deepEqual(planSentenceBoard({ renderedThisTurn: false, studentCorrect: true, tutorText: T302, studentLast: 'Yes, I have worked with an international customer before.' }), []);
  const c3 = planSentenceBoard({ renderedThisTurn: false, studentCorrect: true, tutorText: 'Good, "Last month, I sold 25 machines to Toyota," is correct.', studentLast: 'Last month, I sold 25 machines to Toyota.', checkedSentence: 'Last month, I sold 25 machines to Toyota.' });
  assert.deepEqual(c3.map((c) => c.sentence), ['Last month, I sold 25 machines to Toyota.']);
});

test('23 r1 m3: a quoted fragment with a 21–99 number locates its emphasis (normaliseNumberTokens)', () => {
  const ch = 'I sold 35 washing machines to hospitals this year.';
  assert.deepEqual(planSentenceBoard({ renderedThisTurn: false, studentCorrect: true, tutorText: '"35 washing machines to hospitals" is a great detail. What else did you sell?', studentLast: ch, checkedSentence: ch }),
    [{ sentence: ch, kind: 'model', emphasis: ['35', 'washing'], source: 'checked' }]);
});

test('23 r2 I1: a be-verb correction is shown in the student\'s person with the agreeing form', () => {
  const c = (t: string, st: string) => planSentenceBoard({ renderedThisTurn: false, tutorText: t, studentLast: st });
  assert.deepEqual(c('Good. You are a sales manager at Nagoya. What do you sell?', 'I are a sales manager at Nagoya.'),
    [{ sentence: 'I am a sales manager at Nagoya.', kind: 'correction', emphasis: ['am'], emphasisAt: [1] }]);
  assert.deepEqual(c('Good. You are working in sales now. What do you sell?', 'I is working in sales now.').map((x) => [x.sentence, x.emphasis]), [['I am working in sales now.', ['am']]]);
  assert.deepEqual(c('Nice. You are working in sales now. What do you sell?', 'I working in sales now.').map((x) => [x.sentence, x.emphasis]), [['I am working in sales now.', ['am']]]);
  assert.deepEqual(c('Great. You are a big team. How many people?', 'We is a big team.').map((x) => [x.sentence, x.emphasis]), [['We are a big team.', ['are']]]);
  assert.deepEqual(c('Great. We are a big team. How many people?', 'We is a big team.').map((x) => [x.sentence, x.emphasis]), [['We are a big team.', ['are']]]);
  // never the tutor's "You are …" with [are]
  for (const st of ['I are a sales manager at Nagoya.', 'I is working in sales now.']) {
    assert.ok(c('Good. You are a sales manager at Nagoya. You are working in sales now.', st).every((x) => !/^You are/.test(x.sentence)));
  }
});

test('23 r2 m1: a ", right?" tag after the quote is a question tag — the card stays', () => {
  const cards = planSentenceBoard({ renderedThisTurn: false, tutorText: 'Use the past: "I went to Osaka last week," right?', studentLast: 'I go to Osaka last week.' });
  assert.deepEqual(cards.map((c) => [c.kind, c.sentence]), [['correction', 'I went to Osaka last week.']]);
  assert.equal(isQuotedFragment('I went to Osaka last week,', 'Use the past: ', ' right?'), false);
  assert.equal(isQuotedFragment('I have worked with customers', 'You used ', ' correctly.'), true);
});

test('23 r2 m4: comma-ended clause starters and questions are no cards; a complete clause gets its "."', () => {
  const c = (t: string, st: string) => planSentenceBoard({ renderedThisTurn: false, tutorText: t, studentLast: st }).map((x) => x.sentence);
  assert.deepEqual(c('Start like this: "If I have more time next year," and finish the sentence.', 'I want more time.'), []);
  assert.deepEqual(c('Try "Because I like my customers very much," then add more.', 'I like customers.'), []);
  assert.deepEqual(c('Begin your answer "After I finished the project in March," and go on.', 'I finished project.'), []);
  assert.deepEqual(c('You asked "Can you send me the price list today," and that is polite.', 'Can you send me price list today?'), []);
  assert.deepEqual(c('Use the past: "I went to Osaka last week," right?', 'I go to Osaka last week.'), ['I went to Osaka last week.']);
});

test('23 r3 I1: past and negative be-verbs are written back in the agreeing form, or no card', () => {
  const c = (t: string, st: string) => planSentenceBoard({ renderedThisTurn: false, tutorText: t, studentLast: st });
  // "I was" ↔ "You were" is a person shift: identical ⇒ no card
  assert.deepEqual(c('Good. You were a sales manager last year. Why?', 'I was a sales manager last year.'), []);
  // "I" has no one-word negative present ("am not") ⇒ no card, never "I aren't"
  assert.deepEqual(c("Hmm. You aren't working in sales now. Why not?", 'I working in sales now.'), []);
  assert.deepEqual(c('Good. You were there last year. Why?', 'We was there last year.').map((x) => [x.sentence, x.emphasis]), [['We were there last year.', ['were']]]);
  assert.deepEqual(c('Good. You were a sales manager last year. Why?', 'I were a sales manager last year.').map((x) => [x.sentence, x.emphasis]), [['I was a sales manager last year.', ['was']]]);
  assert.deepEqual(c("OK. You weren't at the meeting yesterday. Why?", "I weren't at the meeting yesterday.").map((x) => [x.sentence, x.emphasis]), [["I wasn't at the meeting yesterday.", ["wasn't"]]]);
  for (const x of [...c('Good. You were a sales manager last year. Why?', 'I were a sales manager last year.'), ...c("Hmm. You aren't working in sales now.", 'I working in sales now.')]) {
    assert.ok(!/\bI (?:were|aren't|are)\b/.test(x.sentence), x.sentence);
  }
});

test('Task 24 §D: autoCardAnchor — the student\'s card nobody spoke paints at the start; spoken ⇒ its sentence; a model nobody spoke ⇒ live', () => {
  assert.equal(autoCardAnchor(undefined, true), 0);
  assert.equal(autoCardAnchor(1, true), 1);
  assert.equal(autoCardAnchor(undefined, false), undefined);
  assert.equal(autoCardAnchor(2, false), 2);
  const v = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(v.includes('const anchor = autoCardAnchor(narrationAnchor, studentSentenceCard);'));
  assert.ok(v.includes("const anchorLabel = narrationAnchor === undefined && anchor === 0 ? 'start' : String(anchor ?? 'live');"));
});

// ── Task 25 §C (GDI run 13) ──
test('25C1: 181 s grammar recast ⇒ correction card of the tutor\'s sentence, no checked card', () => {
  const student = 'Yes, customer buy washing machine';
  const tutor = "Yes, the customer bought the washing machine. That's a good result. Let's move on to the next part, where we look at your job in more detail. Could you tell me one thing your job involves day to day?";
  const cards = planSentenceBoard({ tutorText: tutor, studentLast: student, renderedThisTurn: false, studentCorrect: true, checkedSentence: student });
  assert.equal(cards.length, 1, JSON.stringify(cards));
  assert.equal(cards[0]!.kind, 'correction');
  assert.equal(cards[0]!.source, 'grammar-recast');
  assert.equal(cards[0]!.sentence, 'Yes, the customer bought the washing machine.');
  assert.deepEqual(cards[0]!.emphasis, ['the', 'bought', 'the']);
  // the same in a level-check part: still no levelcheck card of the wrong sentence
  const lc = planSentenceBoard({ tutorText: tutor, studentLast: student, renderedThisTurn: false, levelCheck: true });
  assert.ok(lc.every((c) => c.source !== 'levelcheck' && c.source !== 'checked'), JSON.stringify(lc));
});
test('25C1: the quoted path still wins', () => {
  const cards = planSentenceBoard({ tutorText: '"I work in the sales department of Goya Corporation" is exactly the kind of sentence we need.', studentLast: 'I work in sales department of Goya Corporation', renderedThisTurn: false });
  assert.equal(cards[0]!.kind, 'correction');
  assert.equal(cards[0]!.source, undefined);
  assert.deepEqual(cards[0]!.emphasis, ['the']);
});
test('25C1: a question / low overlap ⇒ no card from this rule', () => {
  assert.equal(grammarRecastCard('Good. Did the customer buy the washing machine?', 'I speak to him politely'), null);
  assert.equal(grammarRecastCard('Did the customer buy the washing machine?', 'customer buy washing machine'), null);
  // identical restatement (no difference) ⇒ none
  assert.equal(grammarRecastCard('The customer bought the washing machine.', 'The customer bought the washing machine'), null);
  // person shift to "you" is §D2's, never this rule
  assert.equal(grammarRecastCard('You sold washing machines to a customer from the USA.', 'I sold washing machine to customer from USA'), null);
  // a comment on the student's words (head dropped, a remark added) is praise, not a recast
  assert.equal(grammarRecastCard("Selling washing machines made by robots, that's a clear role.", 'I was responsible for selling washing machines made by robots.'), null);
  // tense + articles fixed in place ⇒ a recast
  const y = grammarRecastCard('Right, yesterday I went to the customer office for a meeting.', 'Yesterday I go to customer office for meeting');
  assert.ok(y && y.sentence === 'Right, yesterday I went to the customer office for a meeting.' && y.emphasis.join(',') === 'went,the,a', JSON.stringify(y));
  // only the first two sentences
  assert.equal(grammarRecastCard('Nice. Thanks for that. The customer bought the washing machine.', 'customer buy washing machine'), null);
});
test('25C2: 828 s a quote translating a quoted Japanese span ⇒ no card', () => {
  const tutor = 'Ah, your manager and other colleagues — that\'s a good way to solve the problem. Let\'s keep it natural: 「同僚に相談しました」 is "I asked my colleagues for help." Can you say: I talked to my manager and other colleagues?';
  const skipped: string[] = [];
  const cards = planSentenceBoard({ tutorText: tutor, studentLast: 'I spoke to other colleagues and uh my manager.', renderedThisTurn: false, onQuoteSkipped: (r, sp) => skipped.push(`${r}:${sp}`) });
  assert.deepEqual(cards, [], JSON.stringify(cards));
  assert.deepEqual(skipped, ['translation:I asked my colleagues for help.']);
});
test('25C2: an untranslated quote still cards as before', () => {
  const cards = planSentenceBoard({ tutorText: '"I asked my colleagues for help" is the natural version.', studentLast: 'I spoke to other colleagues and uh my manager.', renderedThisTurn: false });
  assert.ok(cards.length >= 1 && cards[0]!.sentence.startsWith('I asked my colleagues for help'), JSON.stringify(cards));
});
test('25C2: isTranslationQuote shapes', () => {
  const a = '営業部で働いています is, in English: "I work in the sales team." Try it.';
  const a2 = 'Now let\'s say that in English: "I have been a sales manager for four years."';
  assert.equal(isTranslationQuote(a2, a2.indexOf('"'), a2.length), false);
  assert.equal(isTranslationQuote(a, a.indexOf('"'), a.indexOf('team."') + 6), true);
  const b = '"I work in the sales team" in Japanese is 営業部で働いています.';
  assert.equal(isTranslationQuote(b, 0, b.indexOf('team"') + 5), true);
  const c = 'Good. "I work in the sales team" is right.';
  assert.equal(isTranslationQuote(c, c.indexOf('"'), c.indexOf('team"') + 5), false);
});

test('25 r1 I-3: a follow-up that changes content / a number is no grammar recast', () => {
  assert.equal(grammarRecastCard('I talked to customers yesterday too.', 'I talk to customers every day'), null);
  assert.equal(grammarRecastCard('I have worked here for three years myself.', 'I have worked here for five years'), null);
  assert.equal(grammarRecastCard('I have worked here for 3 years.', 'I have work here for five years'), null, 'number changed');
  const a = planSentenceBoard({ tutorText: 'I talked to customers yesterday too. What did you talk about?', studentLast: 'I talk to customers every day', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'I talk to customers every day' });
  assert.ok(a.every((c) => c.source !== 'grammar-recast' && c.kind !== 'correction'), JSON.stringify(a));
  const b = planSentenceBoard({ tutorText: 'I have worked here for three years myself. How about your team?', studentLast: 'I have worked here for five years', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'I have worked here for five years' });
  assert.ok(b.every((c) => c.source !== 'grammar-recast') && b.some((c) => c.source === 'checked'), JSON.stringify(b));
  // a 1:1 fix with the same number still recasts
  const y = grammarRecastCard('Yes, I have worked here for five years.', 'Yes, I work here for five years');
  assert.ok(y && y.kind === 'correction', JSON.stringify(y));
  // the 181 s pin still holds
  assert.deepEqual(grammarRecastCard('Yes, the customer bought the washing machine.', 'Yes, customer buy washing machine')?.emphasis, ['the', 'bought', 'the']);
});

test('25 r1 m-3: a grammar recast of a choice-menu pick is no card', () => {
  const cards = planSentenceBoard({ tutorText: 'Yes, practice the pronunciation of a complete sentence. Here is your sentence.', studentLast: 'Yes, practice pronunciation of complete sentence', renderedThisTurn: false, choiceMenu: true });
  assert.deepEqual(cards, [], JSON.stringify(cards));
});

// ── Task 27 §A (GDI run 14, 87 s): a correction card of the student's sentence replaces its level-check card ──
test('27A: the 87 s inputs → exactly one card, the correction (in-call and with a second plan call in either order)', () => {
  const T87 = "Good, the customer was from the USA. That's a useful detail. Now, Question 3, and please take your time: What is one skill you'd like to improve in your English, and why is it important to you?";
  const S87 = 'Uh, the customer was from USA.';
  const inp = { tutorText: T87, studentLast: S87, renderedThisTurn: false, studentCorrect: true, checkedSentence: 'the customer was from USA', levelCheck: true };
  const suppressed: string[] = [];
  const rec = new Set<string>();
  const cards = planSentenceBoard({ ...inp, cardedStudentSentence: rec, onSuppressed: (r, x) => suppressed.push(`${r}: ${x}`) });
  assert.deepEqual(cards.map((c) => [c.kind, c.sentence]), [['correction', 'The customer was from the USA.']], JSON.stringify(cards));
  assert.deepEqual(suppressed, ['corrected this turn: The customer was from USA.']);
  assert.equal(rec.size, 1, 'the correction is recorded for the turn');
  // a second plan call of the same turn that would card only the student's sentence sees the record
  const second = planSentenceBoard({ ...inp, tutorText: "That's a useful detail. Now, what is one skill you'd like to improve?", cardedStudentSentence: rec });
  assert.deepEqual(second, [], JSON.stringify(second));
  // the levelcheck plan first (fresh record), then the correction plan: both are carded — this order
  // is unreachable today (VTR has exactly ONE planSentenceBoard call per turn, at turn end), so the
  // in-call rule above is the fix; the record only covers a later call after a correction (fix round 1, m-6)
  const rec2 = new Set<string>();
  const lc = planSentenceBoard({ ...inp, tutorText: "That's a useful detail. Now, what is one skill you'd like to improve?", cardedStudentSentence: rec2 });
  assert.deepEqual(lc.map((c) => c.source), ['levelcheck']);
  const corr = planSentenceBoard({ ...inp, cardedStudentSentence: rec2 });
  assert.deepEqual(corr.map((c) => c.kind), ['correction']);
  // without a correction the level-check card stays (Task 23 §B2)
  assert.deepEqual(planSentenceBoard({ ...inp, tutorText: "Thank you, that's a useful detail. What is one skill you'd like to improve?" }).map((c) => c.source), ['levelcheck']);
  const v = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.match(v, /cardedStudentSentence: cardedStudentSentenceRef\.current,\s*onSuppressed: \(reason, sentence\) => onDebugEvent\?\.\('sentence_board_auto_suppressed', /);
  assert.match(v, /cardedStudentSentenceRef\.current = new Set\(\);/);
});

// ── Task 28 §A (GDI run 15, 94 s): no level-check card of the student's words the tutor recast ──
test('28A: the 94 s inputs → no card, sentence_board_levelcheck_skipped', () => {
  const S94 = 'Um, I sell uh washing machine to customer from USA, 35 washing machine.';
  const T94 = "Thank you, that's clear. You sold 35 washing machines to a US customer. Now, question 2: what was one difficulty you had with that customer?";
  const skipped: string[] = [];
  const cards = planSentenceBoard({ tutorText: T94, studentLast: S94, renderedThisTurn: false, checkedMedium: true, checkedSentence: 'I sell washing machine to customer from USA, 35 washing machine.', levelCheck: true, onLevelCheckSkipped: (r, x) => skipped.push(`${r}: ${x}`) });
  // Task 29 §H: the raw words stay off the board; the tutor's restatement, written back, goes up.
  assert.deepEqual(cards.map((c) => [c.kind, c.source, c.sentence, c.emphasis]), [['correction', 'levelcheck', 'I sold 35 washing machines to a US customer.', ['sold', 'machines', 'US']]], JSON.stringify(cards));
  assert.deepEqual(skipped, ['recast without card: I sell washing machine to customer from USA, 35 washing machine.']);
  assert.equal(levelCheckRecast(T94, S94), true);
  // a cut check sentence ("…customer from") carded as 'checked' is the student's words too → dropped
  const cut = planSentenceBoard({ tutorText: T94, studentLast: S94, renderedThisTurn: false, checkedMedium: true, checkedSentence: 'I sell washing machine to customer from ', levelCheck: true });
  assert.ok(cut.every((c) => c.source !== 'checked' && c.kind === 'correction'), JSON.stringify(cut));
});
test('28A: run-14 72 s (no recast) → the level-check card as today', () => {
  const S72 = 'Yes, I have worked with international customer.';
  const T72 = "Thank you, that's a good answer. Could you tell me one thing about that experience, like a project or a meeting?";
  const skipped: string[] = [];
  const cards = planSentenceBoard({ tutorText: T72, studentLast: S72, renderedThisTurn: false, levelCheck: true, onLevelCheckSkipped: (r, x) => skipped.push(`${r}: ${x}`) });
  assert.deepEqual(cards.map((c) => [c.source, c.sentence]), [['levelcheck', 'Yes, I have worked with international customer.']]);
  assert.deepEqual(skipped, []);
});
test('28A: run-14 87 s → the correction card only', () => {
  const T87 = "Good, the customer was from the USA. That's a useful detail. Now, Question 3, and please take your time: What is one skill you'd like to improve in your English, and why is it important to you?";
  const cards = planSentenceBoard({ tutorText: T87, studentLast: 'Uh, the customer was from USA.', renderedThisTurn: false, studentCorrect: true, checkedSentence: 'the customer was from USA', levelCheck: true });
  assert.deepEqual(cards.map((c) => [c.kind, c.sentence]), [['correction', 'The customer was from the USA.']]);
});
test('28A: an affirmation with no recast still cards (verbatim quote, "is correct")', () => {
  const st = 'I work as a sales manager in Nagoya.';
  assert.equal(levelCheckRecast('"I work as a sales manager in Nagoya." is correct. Next question: what do you like about it?', st), false);
  assert.equal(levelCheckRecast('That is correct. What do you like about your job?', st), false);
  const cards = planSentenceBoard({ tutorText: 'That is correct. What do you like about your job?', studentLast: st, renderedThisTurn: false, levelCheck: true });
  assert.deepEqual(cards.map((c) => c.source), ['levelcheck']);
  // a restatement with a change in second person, reordered → recast
  assert.equal(levelCheckRecast('So you are a sales manager, working in Nagoya.', st), true);
  // outside the level check nothing changes (the flag-free rule only touches levelcheck cards)
  assert.deepEqual(planSentenceBoard({ tutorText: 'That is correct. What do you like about your job?', studentLast: st, renderedThisTurn: false }), []);
  const v = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.match(v, /onLevelCheckSkipped: \(reason, sentence\) => onDebugEvent\?\.\('sentence_board_levelcheck_skipped', /);
  assert.ok(readFileSync(join(__dirname, '..', 'src/app/tutor-portal/embed/page.tsx'), 'utf8').includes("'sentence_board_levelcheck_skipped',"));
});

// ── Task 28 fix round 1 (I-1): an echo or a follow-up question is no recast — the level-check card stays ──
test('28A r1 I-1: echo / follow-up question built from the student\'s words → levelcheck card', () => {
  const st = 'I work as a sales manager at Nagoya Corporation.';
  const echo = 'A sales manager at Nagoya Corporation, thank you. Question two: what is one difficulty you had at work?';
  const follow = 'Great. What do you like about working as a sales manager at Nagoya Corporation?';
  for (const t of [echo, follow]) {
    assert.equal(levelCheckRecast(t, st), false, t);
    assert.deepEqual(planSentenceBoard({ tutorText: t, studentLast: st, renderedThisTurn: false, levelCheck: true }).map((c) => c.source), ['levelcheck'], t);
  }
  const st2 = 'I have worked with international customers.';
  const t2 = 'What did you learn from working with international customers?';
  assert.equal(levelCheckRecast(t2, st2), false);
  assert.deepEqual(planSentenceBoard({ tutorText: t2, studentLast: st2, renderedThisTurn: false, levelCheck: true }).map((c) => c.source), ['levelcheck']);
  // an imperative ask built from the student's words is no recast either
  assert.equal(levelCheckRecast('Tell me more about working as a sales manager at Nagoya Corporation.', st), false);
  // run-15 94 s still: a real change ("sold", "machines", "a", "US") → no card
  assert.equal(levelCheckRecast("Thank you, that's clear. You sold 35 washing machines to a US customer. Now, question 2: what was one difficulty you had with that customer?", 'Um, I sell uh washing machine to customer from USA, 35 washing machine.'), true);
  // the 23B2 99 s line is a true recast ("machines", "a", "US" added) — its flipped expectation stands
  assert.equal(levelCheckRecast("Thank you. You sell washing machines to a US company, so that's useful experience. Now, question 3, please answer in English: What is one skill you'd like to improve in your English, and why is it important to you?", 'I sell washing machine to the USA customer for their company.'), true);
});

test('29G: a spacing variant is the same sentence — no second card (the existing dedup action)', () => {
  const a = 'I created a PowerPoint presentation for a sales meeting last year.';
  const b = 'I created a Power Point presentation for a sales meeting last year.';
  assert.equal(sameSentence(a, b), true);
  assert.equal(sameSentenceText(a, b), true);
  assert.equal(sameSentence('I sold 3 machines.', 'I sold three machines!'), true, 'numbers normalised');
  assert.equal(sameSentence(a, 'I created a PowerPoint deck for a sales meeting last year.'), false);
  const log = [{ action: 'showSentence', id: 'showSentence-2', sentence: a }];
  const page = sentenceOnBoardPage(log, b);
  assert.equal(page, 1);
  assert.equal(duplicateSentenceAction({ page, currentPage: 1, pronunciationModel: false, onCurrentPage: true }), 'skip');
  assert.equal(sentenceOnCurrentPage(log, b), true);
});

test('29H: the 109 s level-check pair → the tutor\'s restatement carded in the first person', () => {
  const S = 'I work with customer from USA. I sold washing machine to him.';
  const T = "Good, that's a clear answer. You worked with a customer from the USA and sold him a washing machine. Next, what was one challenge in that project?";
  const card = levelCheckRestatementCard(T, S);
  assert.deepEqual(card, { sentence: 'I worked with a customer from the USA and sold him a washing machine.', kind: 'correction', emphasis: ['worked'], source: 'levelcheck' });
  const cards = planSentenceBoard({ tutorText: T, studentLast: S, renderedThisTurn: false, levelCheck: true });
  assert.deepEqual(cards.map((c) => [c.kind, c.source, c.sentence]), [['correction', 'levelcheck', 'I worked with a customer from the USA and sold him a washing machine.']]);
  // the student's own words are never carded (Task 28 §A stands)
  assert.ok(!cards.some((c) => /customer from USA/.test(c.sentence)));
});
test('29H: no "you" subject, a question, or another part → no restatement card', () => {
  const S128 = 'Uh, challenge was talk in English with customer.';
  const T128 = "Thank you, that's a clear challenge. Speaking English with the customer is a real challenge for many people. Next, how did you manage that conversation? Did you use any particular phrases?";
  assert.equal(levelCheckRestatementCard(T128, S128), null);
  assert.equal(levelCheckRestatementCard('You worked with a customer from the USA and sold him a washing machine?', 'I work with customer from USA. I sold washing machine to him.'), null, 'a question');
  assert.equal(levelCheckRestatementCard('Tell me: you worked with a customer from the USA.', 'I work with customer from USA.'), null, 'no You subject');
  assert.equal(levelCheckRestatementCard('You did well.', 'I work with customer from USA.'), null, 'too little overlap');
  // outside the level check planSentenceBoard never asks for it
  const S = 'I work with customer from USA. I sold washing machine to him.';
  const T = 'You worked with a customer from the USA and sold him a washing machine.';
  assert.ok(planSentenceBoard({ tutorText: T, studentLast: S, renderedThisTurn: false }).every((c) => c.source !== 'levelcheck'));
});
test('29H: first-person write-back', () => {
  assert.equal(firstPersonWriteBack("You're a sales manager at your company."), "I'm a sales manager at my company.");
  assert.equal(firstPersonWriteBack('You are a sales manager.'), 'I am a sales manager.');
  assert.equal(firstPersonWriteBack('You were in Tokyo, and you met them.'), 'I was in Tokyo, and I met them.');
  assert.equal(firstPersonWriteBack("You've worked with them, so they know you."), "I've worked with them, so they know me.");
});

test('29I: a contrast ask cards BOTH quoted sentences, in spoken order', () => {
  const T = `Let's go through the summary together. Today you talked about your work, your responsibilities and your past experiences. One thing you did well was describing your project clearly, for example, "I was responsible for collecting donations for a climate change project." Now, here is my question. Can you explain the difference between these two sentences? "I have worked here for five years." and "I worked here five years ago." Take your time.`;
  assert.deepEqual(contrastAskPair(T), ['I have worked here for five years.', 'I worked here five years ago.']);
  const cards = planSentenceBoard({ tutorText: T, studentLast: "Yes, I'm ready.", renderedThisTurn: false, studentCorrect: true, checkedSentence: "Yes, I'm ready." });
  const s = cards.map((c) => c.sentence);
  assert.ok(s.includes('I have worked here for five years.') && s.includes('I worked here five years ago.'), JSON.stringify(s));
  assert.ok(s.indexOf('I have worked here for five years.') < s.indexOf('I worked here five years ago.'), 'spoken order');
  // one-sentence shape, an "or" joiner, "compare"
  assert.deepEqual(contrastAskPair('Can you explain the difference between "I have worked here for five years" and "I worked here five years ago"?'), ['I have worked here for five years.', 'I worked here five years ago.']);
  assert.deepEqual(contrastAskPair('Which is right: "She has lived in Osaka since 2020" or "She lived in Osaka since 2020"?'), ['She has lived in Osaka since 2020.', 'She lived in Osaka since 2020.']);
  assert.ok(contrastAskPair('Compare these: "I have been to Tokyo twice." versus "I went to Tokyo twice."'));
  // no lead / no joiner / short quotes ⇒ none
  assert.equal(contrastAskPair('"I have worked here for five years" means they still work here, and "I worked here five years ago" means they no longer do.'), null);
  assert.equal(contrastAskPair('You said "I like it a lot." and "I want more of it."'), null);
  assert.equal(contrastAskPair('What is the difference between "have" and "had"?'), null);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
