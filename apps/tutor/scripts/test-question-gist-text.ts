/**
 * Unit tests for the Q-pin gist text helpers (Task X8).
 *
 * Regression: the Haiku gist producer (/api/tutor/question-gist)
 * sometimes wraps part of its restated question in markdown emphasis
 * (single-star italics / double-star bold). InlineMathText — the pin's
 * renderer — only special-cases $...$ math, so unstripped emphasis showed
 * literal asterisks ("*in order to*") in the live app. stripMarkdownEmphasis()
 * fixes both the primary (LLM) gist path and the client-derived
 * lastQuestionSentence() fallback, which shares the same helper.
 *
 * Run: npx tsx scripts/test-question-gist-text.ts
 */
import { stripMarkdownEmphasis, lastQuestionSentence, parseGistReply, lastAskSentence, verbatimQuestionPin, languagePinCandidate, pinReplacedByTurn, capPinText, stripUnbalancedQuotes, gistGrounded } from '../src/lib/tutor/question-gist-text';
import { transitionAskSentence } from '../src/lib/tutor/lesson-plan/transition-ask';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let pass = 0;
let fail = 0;

function check(name: string, got: unknown, want: unknown) {
  const ok = got === want;
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${ok ? '' : `  — got: ${JSON.stringify(got)}  want: ${JSON.stringify(want)}`}`);
  if (ok) pass++; else fail++;
}

// --- stripMarkdownEmphasis --------------------------------------------
check(
  'single-asterisk italic stripped',
  stripMarkdownEmphasis('What do you need to solve *in order to* isolate x?'),
  'What do you need to solve in order to isolate x?',
);
check(
  'double-asterisk bold stripped',
  stripMarkdownEmphasis('What is the **first step** here?'),
  'What is the first step here?',
);
check(
  'multiple emphasis spans in one string',
  stripMarkdownEmphasis('Is *a* or *b* the coefficient?'),
  'Is a or b the coefficient?',
);
check(
  'bare multiplication untouched (no content between adjacent stars)',
  stripMarkdownEmphasis('2*3*4 equals 24'),
  '2*3*4 equals 24',
);
check(
  'plain text with no asterisks untouched',
  stripMarkdownEmphasis('What is the slope of this line?'),
  'What is the slope of this line?',
);

// X8 review (I2): the emphasis-strip regex ate asterisks INSIDE $...$ math
// spans — "$x*y*z$" (literal multiplication inside math delimiters) lost
// its asterisks and became "$xyz$". Fix: split on $...$ spans first, strip
// emphasis only outside them, then reassemble.
check(
  'math span with literal asterisks preserved untouched',
  stripMarkdownEmphasis('$x*y*z$'),
  '$x*y*z$',
);
check(
  'emphasis outside math still stripped',
  stripMarkdownEmphasis('*in order to* isolate the variable'),
  'in order to isolate the variable',
);
check(
  'mixed sentence: math preserved, surrounding emphasis stripped',
  stripMarkdownEmphasis('Solve $x*y*z$ using *substitution* to isolate x.'),
  'Solve $x*y*z$ using substitution to isolate x.',
);
check(
  'two math spans with an emphasis span between them',
  stripMarkdownEmphasis('Compare $a*b$ and *carefully* $c*d$ here.'),
  'Compare $a*b$ and carefully $c*d$ here.',
);

// --- lastQuestionSentence (fallback path) ------------------------------
check(
  'fallback strips emphasis before extracting the question',
  lastQuestionSentence('First we isolate x. What do you need to do *in order to* isolate x?'),
  'What do you need to do in order to isolate x?',
);
check(
  'fallback returns the LAST question sentence, complete',
  lastQuestionSentence('Is it 4? No wait, is it *actually* 9?'),
  'No wait, is it actually 9?',
);
check(
  'fallback returns null when there is no question',
  lastQuestionSentence('This turn has no question mark at all.'),
  null,
);
check(
  'fallback returns null when the only question is too long to pin',
  lastQuestionSentence(`${'x'.repeat(221)}?`),
  null,
);

// --- parseGistReply (Task Y2: route's Haiku-reply → gist decision) ----
// This is the pure seam the route handler defers to. It only sees the
// model's own text — the distinction between "deliberate NONE" (handled
// here, resolves to null) and "internal failure" (never reaches this
// function; the route returns non-200 instead) lives one layer up.
check(
  'deliberate NONE verdict resolves to null',
  parseGistReply('NONE'),
  null,
);
check(
  'ordinary question passes through trimmed',
  parseGistReply('  What is the slope of this line?  '),
  'What is the slope of this line?',
);
check(
  'over-length reply (>200 chars) resolves to null',
  parseGistReply(`${'x'.repeat(201)}?`),
  null,
);
check(
  'empty string resolves to null',
  parseGistReply(''),
  null,
);
check(
  'whitespace-only string resolves to null',
  parseGistReply('   '),
  null,
);
check(
  'choice prompt (not literal NONE) passes through',
  parseGistReply('Want another at this level, something harder, or move on?'),
  'Want another at this level, something harder, or move on?',
);

// R33 (session-1784830146734): model meta-commentary leaked into the pin.
check(
  'NONE with trailing annotation is still NONE',
  parseGistReply("NONE\n(This is a follow-up prompt asking the student to elaborate on reasoning they've already started, not a standalone question the tutor is posing.)"),
  null,
);
check(
  'parenthetical-only reply is meta → null',
  parseGistReply('(The turn poses no question.)'),
  null,
);
check(
  'self-correction keeps only the final question',
  parseGistReply('What is the first step?\nWait — let me rephrase to match the teaching context:\nIs $f(x) = \\cos(x) - x$ continuous on $[0, \\pi/2]$?'),
  'Is $f(x) = \\cos(x) - x$ continuous on $[0, \\pi/2]$?',
);
check(
  'same-line rephrase preamble cut through the colon',
  parseGistReply('Let me rephrase that: Is the function continuous on the interval?'),
  'Is the function continuous on the interval?',
);
check(
  'two-question single-line reply keeps the last',
  parseGistReply('Ready to try? What sign does $f(0.5)$ have?'),
  'What sign does $f(0.5)$ have?',
);
check(
  'clean single question still passes verbatim',
  parseGistReply('Is $f(x)$ continuous on $[0, 2]$?'),
  'Is $f(x)$ continuous on $[0, 2]$?',
);

// --- lastAskSentence (GDI run 3, 2026-10-29) ----------------------------
const LIVE_ASK = 'Great, that is right! Next, tell me one thing you have been doing at your company for a long time, starting with "I have..."';
check('live imperative ask → pinned text starts with "Tell me one thing"',
  /^Next, tell me one thing/.test(lastAskSentence(LIVE_ASK) ?? '') && (lastAskSentence(LIVE_ASK) ?? '').endsWith('"I have..."'), true);
check('the pin keeps the ask verbatim',
  lastAskSentence(LIVE_ASK), 'Next, tell me one thing you have been doing at your company for a long time, starting with "I have..."');
check('bare "Tell me one thing…" also starts the pin', /^Tell me one thing/.test(lastAskSentence('Good. Tell me one thing you did today.') ?? ''), true);
check('"Look at the board." → null', lastAskSentence('Look at the board.'), null);
check('a trailing question still wins (ask → null)', lastAskSentence('Tell me about your job. What do you do every day?'), null);
check('…and lastQuestionSentence names it', lastQuestionSentence('Tell me about your job. What do you do every day?'), 'What do you do every day?');
check('an ask after a conversational "?" is pinned', lastAskSentence('Nice, right? Now, say the whole sentence again.'), 'Now, say the whole sentence again.');
check('over-long ask capped at 220', (lastAskSentence(`Tell me ${'about your work and '.repeat(20)}more.`) ?? '').length <= 220, true);
{
  const ts = readFileSync(join(__dirname, '..', 'src/app/tutor/components/session/TutorSession.tsx'), 'utf8');
  check('TutorSession: ask pin gated on the language-session predicate',
    /const languageSession = sessionAllowsNonLatin\(tutorLanguages\) \|\| subject === 'languages';/.test(ts), true);
  check('TutorSession: gist-empty path falls back to the ask', /else if \(!askFallback\('gist empty'\)/.test(ts), true);
  check('TutorSession: qpin_set_ask event', /'qpin_set_ask'/.test(ts), true);
}

// --- Task 14 §C (GDI run 4): verbatim question pin + replace ------------
check('live miss 1 → verbatim question', verbatimQuestionPin('Nice, you sold 25 machines. Now, can you tell me one more thing you sold, or a customer you helped?'), 'Now, can you tell me one more thing you sold, or a customer you helped?');
check('live miss 2 → verbatim question', verbatimQuestionPin('Good. Now, can you tell me one thing you did with a customer last month?'), 'Now, can you tell me one thing you did with a customer last month?');
check('no question → null', verbatimQuestionPin('Look at the board.'), null);
check('long question capped at 220 with …', (() => { const v = verbatimQuestionPin(`Can you ${'tell me about your work and '.repeat(12)}more?`) ?? ''; return v.length <= 220 && v.endsWith('…'); })(), true);
check('capPinText leaves short text alone', capPinText('Tell me more.'), 'Tell me more.');
check('candidate: an ask after a conversational "?" wins', languagePinCandidate('Nice, right? Now, say the whole sentence again.'), 'Now, say the whole sentence again.');
check('candidate: a trailing question', languagePinCandidate('Tell me about your job. What do you do every day?'), 'What do you do every day?');
check('candidate: none', languagePinCandidate('Great job.'), null);
check('replace: an older pin + a new candidate → replaced', pinReplacedByTurn('t1', 't2', 'What do you do?'), true);
check('replace: same turn → kept', pinReplacedByTurn('t2', 't2', 'What do you do?'), false);
check('replace: no candidate → kept (stale sweep / answer clear own it)', pinReplacedByTurn('t1', 't2', null), false);
check('replace: no pin → nothing to replace', pinReplacedByTurn(null, 't2', 'What?'), false);
{
  const ts = readFileSync(join(__dirname, '..', 'src/app/tutor/components/session/TutorSession.tsx'), 'utf8');
  check('TutorSession: replace path gated on the language session', /if \(languageSession && pinReplacedByTurn\(questionPin\?\.turnId, entry\.id, languagePinCandidate\(entry\.text\)\)\)/.test(ts), true);
  check('TutorSession: gist-empty → ask, then verbatim question', /else if \(!askFallback\('gist empty'\) && !verbatimFallback\(\)\)/.test(ts), true);
  check('TutorSession: qpin_set_verbatim event', /'qpin_set_verbatim'/.test(ts), true);
}

// --- Task 20 §E1 (GDI run 8): asks after a lead clause, read / repeat asks ---
check('1302 s: ", so please tell me …" pinned from the ask phrase',
  lastAskSentence('"The seminar was very good because it was motivational, and the result was positive." That sentence is complete and clear. Now, you asked earlier about one project you\'re proud of, so please tell me one thing you would do differently next time.'),
  'please tell me one thing you would do differently next time.');
check('1418 s: ": please read the sentence … after me" pinned from the ask phrase',
  lastAskSentence('Your sentence was right too, so there\'s no error to fix. Let\'s move on to the next part: please read the sentence "I was responsible for communicating with our customers" after me, slowly and clearly.'),
  'please read the sentence "I was responsible for communicating with our customers" after me, slowly and clearly.');
check('"Let\'s move on to the summary." → null', lastAskSentence("Let's move on to the summary."), null);
check('"Repeat after me: …" leads', /^Repeat after me/.test(lastAskSentence('Good. Repeat after me: I work in sales.') ?? ''), true);
check('m2: "Pick any number — say 5 — and double it." → not an ask', lastAskSentence('Pick any number — say 5 — and double it.'), null);
check('m2: "Let\'s repeat the rule: say have plus the past participle." → not an inner ask', lastAskSentence("Let's repeat the rule: say have plus the past participle."), null);
check('", so you did well." is no ask', lastAskSentence('You finished early, so you did well.'), null);

// Task 29 §F (GDI run 16, 608 s / 749 s): no stray quote mark from the previous quoted sentence.
{
  const t608 = 'Good. The natural version is "I attended a robotics exhibition in Tokyo last month." Now, what was the most interesting thing you learned at that exhibition?';
  const clean = 'Now, what was the most interesting thing you learned at that exhibition?';
  check('29F: 608 s verbatim pin', verbatimQuestionPin(t608), clean);
  check('29F: 608 s last question', lastQuestionSentence(t608), clean);
  check('29F: 608 s language candidate', languagePinCandidate(t608), clean);
  const t749 = 'You said "I met companies that sell robots." Can you say that sentence once more?';
  check('29F: 749 s transition ask', transitionAskSentence(t749), 'Can you say that sentence once more?');
  check('29F: a fully quoted sentence keeps its pair', stripUnbalancedQuotes('"I have worked here for five years."'), '"I have worked here for five years."');
  check('29F: curly / Japanese pairs kept', stripUnbalancedQuotes('「次に進みますか？」'), '「次に進みますか？」');
  check('29F: a leading closer is stripped', stripUnbalancedQuotes('” Now, which one?'), 'Now, which one?');
  check('29F: a trailing opener is stripped', stripUnbalancedQuotes('Say this: “'), 'Say this:');
  check('29F: an inner quote is untouched', stripUnbalancedQuotes('Can you say "for our customers" again?'), 'Can you say "for our customers" again?');
  check('29F: an ask pin keeps its quote', lastAskSentence('Good. "Fine." Please say "I have worked here for five years."'), 'Please say "I have worked here for five years."');
}

// Task 30 fix round 1 S9 (smoke run 241 s): an invented gist is not pinned.
{
  const T241 = `Good, that's a clear sentence. Can you say one more sentence, starting with "I have worked", about a skill or project you've been doing?`;
  check('S9: the 241 s gist (an invented example answer) ⇒ ungrounded', gistGrounded('I have worked on mastering Python programming for three year', T241), false);
  check('S9: a faithful gist ⇒ grounded', gistGrounded('One more sentence starting with "I have worked" about a skill or project', T241), true);
  check('S9: a paraphrased offer ⇒ grounded', gistGrounded('Another practice sentence on present perfect, or move on to past simple?', 'The present perfect part is done, and you used it well. Would you like one more practice sentence on it, or shall we move on to the past simple?'), true);
  // Task 30 fix round 5 R4-4 (run r4 124 s)
  const T124 = 'That\'s a clear reason, Haruto. Explaining products to foreign customers is a great goal. Now I\'d like to hear your answer to question 3 in full English. What is one skill you want to improve? Try: "I want to improve..." The question card is now on the board.';
  check('R4-4: the 124 s gist (an answer, 67 % grounded) ⇒ ungrounded', gistGrounded('I want to improve my English speaking skills?', T124), false);
  check('R4-4: an answer-shaped gist fully grounded but without the ask\'s interrogative ⇒ ungrounded', gistGrounded('I want to improve one skill in English?', T124), false);
  check('R4-4: the ask kept as a question ⇒ grounded', gistGrounded('What skill do you want to improve in English?', T124), true);
  check('S9: the verbatim ask replaces it', verbatimQuestionPin(T241), `Can you say one more sentence, starting with "I have worked", about a skill or project you've been doing?`);
  const ts = readFileSync(join(__dirname, '..', 'src/app/tutor/components/session/TutorSession.tsx'), 'utf8');
  check('S9: TutorSession pins the verbatim ask for an ungrounded gist', ts.includes('if (gist && TUTOR_QPIN_GIST_GROUNDED && !gistGrounded(gist, entry.text)) {') && ts.includes("onDebugEvent?.('qpin_gist_ungrounded',"), true);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
