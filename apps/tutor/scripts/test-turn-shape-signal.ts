/**
 * Turn-shape facts (src/lib/tutor/voice/turn-shape-signal.ts) and the open-
 * question / ambiguous-assent additions to voice/nonanswer-praise.ts.
 *
 * The cases are the student turns and tutor questions of the 2026-10-06
 * scripted text sessions (docs/whitelabel/greenapple/integration/
 * tutor-sessions-2026-10-06). They live HERE, in the test — the prompt
 * wording itself carries no subject content (asserted below).
 *
 * Run: npx tsx scripts/test-turn-shape-signal.ts
 */
import {
  ambiguousAssentFeedback,
  ambiguousAssentKill,
  isSessionCloseReply,
  openQuestionText,
  readBareAssent,
  readOpenQuestion,
  shouldKillBareAssentPraise,
} from '../src/lib/tutor/voice/nonanswer-praise';
import {
  assentSettlesNothing,
  classifyTurnShape,
  falseArithmeticIn,
  formatTurnShapeBlock,
  hedgedProposedValue,
  textTurnShapeEnabled,
} from '../src/lib/tutor/voice/turn-shape-signal';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}${detail !== undefined ? ` — got ${JSON.stringify(detail)}` : ''}`); }
}

// ── the open question, verbatim ──
const Q_EXPAND = 'So the radical squares away. With that in mind, what do you get when you expand $(\\sqrt{x+9}-3)(\\sqrt{x+9}+3)$ yourself?';
check('open question is the last one, verbatim', openQuestionText(Q_EXPAND) === 'With that in mind, what do you get when you expand $(\\sqrt{x+9}-3)(\\sqrt{x+9}+3)$ yourself?', openQuestionText(Q_EXPAND));
check('a decimal point does not cut the question', openQuestionText('Good. So what is 400 times 0.10 for the next level?') === 'So what is 400 times 0.10 for the next level?', openQuestionText('Good. So what is 400 times 0.10 for the next level?'));
check('no question ⇒ null', openQuestionText('That wraps up both homework problems for today. Nice work getting through them.') === null);
check('text after the question keeps it open', openQuestionText('What should they add up to? Take your time.') === 'What should they add up to?');

// ── kind of question ──
const kind = (t: string) => readOpenQuestion(t)?.kind;
check('wh: "what do you get when you expand…"', kind(Q_EXPAND) === 'wh', kind(Q_EXPAND));
check('wh: "what does the bottom become at x = 0?"', kind('You said the top becomes $0$ when $x=0$ — what does the *bottom* become at $x = 0$?') === 'wh');
check('readiness: "Ready to move to problem two?"', kind('Nice work. Ready to move to problem two?') === 'readiness', kind('Nice work. Ready to move to problem two?'));
check('readiness: "Does that explanation make sense?"', kind('There just is not enough energy left. Does that explanation make sense?') === 'readiness');
check('yes_no: "is 42 still an outlier?"', kind('With that number in mind, is 42 still an outlier?') === 'yes_no', kind('With that number in mind, is 42 still an outlier?'));
const EITHER_WRAP = 'So $x+4$ has to land strictly between $-6$ and $6$. Ready to move to the next homework problem, or want to wrap here?';
check('either/or: "Ready to move to the next homework problem, or want to wrap here?"', kind(EITHER_WRAP) === 'either_or', kind(EITHER_WRAP));
check('either/or: "…make sense, or do you want to see why on a number line?"', kind('Does that reasoning make sense, or do you want to see why on a number line?') === 'either_or');
check('either/or: "is it a veto, or is it something else?"', kind('The Senate uses a two-thirds vote to override the president — is it a *veto*, or is it something else?') === 'either_or');
check('either/or: "…an and situation like problem two, or an or situation like problem one?"',
  kind('Since it is "greater than or equal to," do you think this becomes an *and* situation like problem two, or an *or* situation like problem one?') === 'either_or',
  kind('Since it is "greater than or equal to," do you think this becomes an *and* situation like problem two, or an *or* situation like problem one?'));
check('either/or: "subtract or divide first?"', kind('For $x = 2y + 6$, what do you do first to isolate $y$ — subtract or divide first?') === 'either_or');
check('either/or: "want to wrap up, or go over anything else?"', kind('Want to call it there, or go over anything else before we wrap up?') === 'either_or');
check('"or not" is yes/no, not either/or', kind('Do you want a hint or not?') !== 'either_or', kind('Do you want a hint or not?'));
check('"or" between formulas is not either/or', kind('So we get $x = 5$ or $x = -2$ — does that look right to you?') !== 'either_or', kind('So we get $x = 5$ or $x = -2$ — does that look right to you?'));
check('"or" between plain values is not either/or', kind('Does x = 5 or x = -2 check out when you plug it in?') !== 'either_or');
check('wh-led question with options stays wh', kind('Which is bigger, the first one or the second one?') === 'wh', kind('Which is bigger, the first one or the second one?'));
const MIXED = "Ready to put Problem 2's answer together fully? How would you write the complete solution to $|x + 4| < 6$?";
check('mixed turn: last question wh, earlier one yes/no', readOpenQuestion(MIXED)?.kind === 'wh' && readOpenQuestion(MIXED)?.earlierYesNo === true, readOpenQuestion(MIXED));
check('no question ⇒ null', readOpenQuestion('Nice work today.') === null);

// ── what a bare assent does to it ──
check('"yes" to a wh-question: not an answer', readBareAssent('yes', Q_EXPAND)?.reading === 'not_an_answer');
check('"yes" to an either/or question: ambiguous', readBareAssent('yes', EITHER_WRAP)?.reading === 'ambiguous');
check('"no" to an either/or question: ambiguous', readBareAssent('No.', EITHER_WRAP)?.reading === 'ambiguous');
check('"yes" to a readiness question: answers it', readBareAssent('yes', 'Ready to move to problem two?')?.reading === 'answers');
check('"yes" to the mixed turn: not an answer to the last question', readBareAssent('yes', MIXED)?.reading === 'not_an_answer');
check('"4" is not a bare assent', readBareAssent('4', Q_EXPAND) === null);

// ── session-closing replies ──
for (const s of [
  'Both homework problems are done — nice work today.',
  "Great session — you've got both problems solved. See you next time!",
  "That's it for today.",
  'Your homework is all done.',
  'Sounds good. Nice work today — both problems are wrapped up. See you next time!',
  "You're all set for today.",
]) check(`close: "${s.slice(0, 50)}"`, isSessionCloseReply(s));
for (const s of [
  "Right, let's go to the next problem.",
  'Which would you like — the next problem, or to stop here?',
  'Nice work on that step. What do you get next?',
  'Problem 1 is done. Ready for problem 2?',
]) check(`not a close: "${s.slice(0, 50)}"`, !isSessionCloseReply(s));

// ── the kill extension (the original kill is untouched) ──
check('original kill still fires on a plain wh-question', shouldKillBareAssentPraise('yes', 'Right. The $x$ cancels.', 'What can you do with that $x$ on top and bottom?', { enabled: true }));
check('original kill does not fire on the mixed turn (why the extension exists)', !shouldKillBareAssentPraise('yes', 'Right — the complete solution is $-10 < x < 2$.', MIXED, { enabled: true }));
const on = { enabled: true };
check('mixed turn + affirming verdict ⇒ kill', ambiguousAssentKill('yes', 'Right — the complete solution is $-10 < x < 2$.', MIXED, on) === 'earlier_question_verdict');
check('mixed turn + "Great, let\'s put it together" ⇒ no kill', ambiguousAssentKill('yes', "Great, let's put it together. How would you write it?", MIXED, on) === null);
check('either/or + affirming verdict ⇒ kill', ambiguousAssentKill('yes', 'Right — one connected range.', 'Does that make sense as one range, or would you rather see it on a number line?', on) === 'either_or_verdict');
check('either/or + session close ⇒ kill', ambiguousAssentKill('yes', 'Both homework problems are done — nice work today.', EITHER_WRAP, on) === 'ambiguous_close');
check('either/or + close in a later sentence ⇒ kill', ambiguousAssentKill('yes', "Sounds good. You've got both solved. See you next time!", EITHER_WRAP, on) === 'ambiguous_close');
check('wh-question + session close ⇒ kill', ambiguousAssentKill('yes', 'Nice work today. See you next time!', Q_EXPAND, on) === 'ambiguous_close');
check('either/or + asking which ⇒ no kill', ambiguousAssentKill('yes', 'Which would you like — the next problem, or to stop here?', EITHER_WRAP, on) === null);
check('readiness "ready to wrap up?" + yes + close ⇒ no kill', ambiguousAssentKill('yes', 'Nice work today. See you next time!', 'That is both problems. Ready to wrap up?', on) === null);
check('a real answer + close ⇒ no kill', ambiguousAssentKill('the next problem', 'Nice work today.', EITHER_WRAP, on) === null);
check('plain wh-question + verdict ⇒ left to the original kill', ambiguousAssentKill('yes', 'Right. The $x$ cancels.', 'What can you do with that $x$ on top and bottom?', on) === null);
check('flag off ⇒ no kill', ambiguousAssentKill('yes', 'Both homework problems are done — nice work today.', EITHER_WRAP, { enabled: false }) === null);
const fbClose = ambiguousAssentFeedback('ambiguous_close', 'yes', EITHER_WRAP);
check('close feedback: quotes the student and forbids a sign-off', fbClose.includes('"yes"') && /do NOT sign off/i.test(fbClose) && /which/i.test(fbClose));
check('either/or feedback: ask which, no verdict', /which one they mean/i.test(ambiguousAssentFeedback('either_or_verdict', 'yes', EITHER_WRAP)));
check('mixed feedback: do not answer your own question', /do NOT answer your own question/i.test(ambiguousAssentFeedback('earlier_question_verdict', 'yes', MIXED)));

// ── the shape of the student's message ──
const shape = (s: string, q = Q_EXPAND) => classifyTurnShape(s, q);
check('"yes" ⇒ bare_assent', shape('yes')?.shape === 'bare_assent');
check('"Okay." ⇒ bare_assent', shape('Okay.')?.shape === 'bare_assent');
check('"no" ⇒ bare_dissent', shape('no')?.shape === 'bare_dissent', shape('no')?.shape);
check('"Nope." ⇒ bare_dissent', shape('Nope.')?.shape === 'bare_dissent');
check('"got it" ⇒ acknowledgment', shape('got it')?.shape === 'acknowledgment');
check('"4" ⇒ bare_token "4"', shape('4')?.shape === 'bare_token' && shape('4')?.proposed === '4');
check('"5 or -2" ⇒ bare_token', shape('5 or -2')?.shape === 'bare_token', shape('5 or -2'));
check('"(x - 6)/2" ⇒ bare_token', shape('(x - 6)/2')?.shape === 'bare_token', shape('(x - 6)/2'));
check('"advice and consent" ⇒ bare_token', shape('advice and consent')?.shape === 'bare_token', shape('advice and consent'));
check('"CH2O" ⇒ bare_token', shape('CH2O')?.shape === 'bare_token');
const h = shape("I don't know, maybe 1/4?");
check('"I don\'t know, maybe 1/4?" ⇒ hedged_proposal "1/4"', h?.shape === 'hedged_proposal' && h?.proposed === '1/4', h);
check('hedged value: "30 m/s"', hedgedProposedValue("I don't know, maybe 30 m/s?") === '30 m/s', hedgedProposedValue("I don't know, maybe 30 m/s?"));
check('hedged value: "-10 < x < 2"', hedgedProposedValue("I don't know, maybe -10 < x < 2?") === '-10 < x < 2');
check('hedged value keeps the reason', hedgedProposedValue("I don't know, maybe 4 kcal/m^2/yr, because it's 10% twice?") === "4 kcal/m^2/yr, because it's 10% twice");
check('hedged value: "I think it\'s 5"', hedgedProposedValue("I think it's 5") === '5', hedgedProposedValue("I think it's 5"));
check('hedged prose proposal ⇒ hedged_proposal', shape("I don't know, maybe nominate someone else, or make a recess appointment?")?.shape === 'hedged_proposal');
const c = shape('can you check my answer x = 4');
check('"can you check my answer x = 4" ⇒ check_request "x = 4"', c?.shape === 'check_request' && c?.proposed === 'x = 4', c);
const c2 = shape('can you check my answer: NPP = GPP + respiration');
check('"can you check my answer: NPP = …" ⇒ check_request with the claim', c2?.shape === 'check_request' && c2?.proposed === 'NPP = GPP + respiration', c2);
check('"can you check my work?" ⇒ request (no value)', shape('can you check my work?')?.shape === 'request', shape('can you check my work?'));
check('"can you give me a hint" ⇒ request', shape('can you give me a hint')?.shape === 'request');
check('"why does that work?" ⇒ question', shape('why does that work?')?.shape === 'question');
check('"I don\'t know" ⇒ no_answer', shape("I don't know")?.shape === 'no_answer');
check('"i do not know fractions operations well" ⇒ no_answer', shape('i do not know fractions operations well')?.shape === 'no_answer');
check('"For (b): x + 4 < 6, so x < 2." ⇒ answer', shape('For (b): x + 4 < 6, so x < 2.')?.shape === 'answer');
check('synthetic turn ⇒ null', shape('[validator feedback — not from the student] …') === null);
check('empty ⇒ null', shape('   ') === null);

// answer-shaped: exactly the turns the pre-check runs on
for (const s of ['4', "I don't know, maybe 1/4?", 'For (b): x + 4 < 6, so x < 2.', 'can you check my answer x = 4']) {
  check(`answer-shaped: "${s.slice(0, 40)}"`, shape(s)?.answerShaped === true);
}
for (const s of ['yes', 'no', 'got it', 'why does that work?', 'can you give me a hint', "I don't know", 'can you check my work?']) {
  check(`not answer-shaped: "${s}"`, shape(s)?.answerShaped === false);
}

check('assent settles nothing: yes to wh', assentSettlesNothing(shape('yes')));
check('assent settles nothing: yes to either/or', assentSettlesNothing(shape('yes', EITHER_WRAP)));
check('assent settles it: yes to readiness', !assentSettlesNothing(shape('yes', 'Ready to move to problem two?')));
check('a value is not an assent', !assentSettlesNothing(shape('4')));

// ── the block ──
const bYes = formatTurnShapeBlock(shape('yes'));
check('block: quotes the open question verbatim', bYes.includes('"With that in mind, what do you get when you expand $(\\sqrt{x+9}-3)(\\sqrt{x+9}+3)$ yourself?"'), bYes);
check('block: bare assent to a wh-question is not an answer, no verdict, no self-answer',
  /NOT an answer to the open question/.test(bYes) && /verdict or praise word/.test(bYes) && /do not answer the question yourself/.test(bYes));
check('block: never end the session on it', /Never end or wrap up the session/.test(bYes));
const bMixed = formatTurnShapeBlock(shape('yes', MIXED));
check('block (mixed turn): agreement to the earlier question at most', /earlier yes\/no question/.test(bMixed));
const bEither = formatTurnShapeBlock(shape('yes', EITHER_WRAP));
check('block: either/or assent is ambiguous — ask which', /AMBIGUOUS/.test(bEither) && /Ask which one they mean/.test(bEither) && /Never end or wrap up the session/.test(bEither));
const bReady = formatTurnShapeBlock(shape('yes', 'Ready to move to problem two?'));
check('block: assent to a readiness question is consent', /consent, not an answer to grade/.test(bReady) && !/AMBIGUOUS|NOT an answer/.test(bReady));
const bToken = formatTurnShapeBlock(shape('4'));
check('block: a bare value is checked against the OPEN question before any verdict word', /bare value/.test(bToken) && /"4"/.test(bToken) && /against the OPEN question/.test(bToken) && /Before any verdict word/.test(bToken));
const bHedge = formatTurnShapeBlock(shape("I don't know, maybe 1/4?", 'You said the top becomes $0$ — what does the *bottom* become at $x = 0$?'));
check('block: hedged proposal names the value and both possible targets', /"1\/4"/.test(bHedge) && /It IS an answer/.test(bHedge) && /problem being worked as a whole/.test(bHedge) && /never "not quite"/.test(bHedge));
const bCheck = formatTurnShapeBlock(shape('can you check my answer x = 4'));
check('block: check request', /request to check a value/.test(bCheck) && /"x = 4"/.test(bCheck));
const bQ = formatTurnShapeBlock(shape('why does that work?'));
check('block: a question is not an answer', /not an answer: no verdict or praise word/.test(bQ));
check('block: nothing open ⇒ empty', formatTurnShapeBlock(shape('yes', 'Nice work today.')) === '');
check('block: synthetic turn ⇒ empty', formatTurnShapeBlock(null) === '');
check('block: ends with the blank line the other per-turn blocks use', bYes.endsWith('</turn_shape>\n\n') && bYes.startsWith('<turn_shape>\n'));

// Generic wording: with a neutral question and message, the block carries no
// subject content and no example values of its own.
const neutral = [
  formatTurnShapeBlock(classifyTurnShape('yes', 'Aaa. What bbb?')),
  formatTurnShapeBlock(classifyTurnShape('yes', 'Aaa. Ready, or bbb?')),
  formatTurnShapeBlock(classifyTurnShape('yes', 'Aaa. Ready?')),
  formatTurnShapeBlock(classifyTurnShape('zzz', 'Aaa. What bbb?')),
  formatTurnShapeBlock(classifyTurnShape("I don't know, maybe zzz?", 'Aaa. What bbb?')),
  formatTurnShapeBlock(classifyTurnShape('can you check my answer zzz', 'Aaa. What bbb?')),
  formatTurnShapeBlock(classifyTurnShape('why zzz?', 'Aaa. What bbb?')),
].join('\n');
check('generic: no digits anywhere in the wording', !/\d/.test(neutral), neutral.match(/[^\n]*\d[^\n]*/)?.[0]);
check('generic: no subject words', !/\b(?:equation|fraction|limit|inequality|algebra|calculus|physics|chemistry|essay|veto|energy)\b/i.test(neutral));

// ── a written calculation, checked by calculator ──
const wrong = falseArithmeticIn('For (b): CH2O is 30 g/mol and 180/30 = 3, so the molecular formula is C3H6O3.');
check('wrong quotient is found, with the true value', wrong?.claim === '180/30 = 3' && wrong?.correct === '180/30 = 6', wrong);
check('"7 x 8 = 54" is found', falseArithmeticIn('so 7 x 8 = 54')?.correct === '7 x 8 = 56', falseArithmeticIn('so 7 x 8 = 54'));
for (const ok of [
  'For (b): v = g x t / 2 = 10 x 3 / 2 = 15 m/s.',
  'For (b): yes, 42 is an outlier because 15.5 + 1.5 x 15 = 38 and 42 is bigger than 38.',
  "I don't know, maybe no, because the upper fence is 23 + 22.5 = 45.5 and 42 is below that?",
  'For (b): 2x + 10 + 3x - 5 = 180, so 5x + 5 = 180, 5x = 175, x = 35.',
  'For (a): swap x and y: x = 2y + 6, so y = (x - 6)/2.',
  'For (b): 10% of 400 is 40, so 40 kcal/m^2/yr reaches the secondary consumers.',
  '10 / 3 = 3.33',
  'it is about 10 / 3 = 3',
  '2 + 3 = 5',
  'x^2 - 4 = 0 so 2 - 2 = 0',
  '3 + 4 = 7x',
  '50% of 8 + 2 = 6',
  '1/2 + 1/3 = 5/6',
  '2 + 3 = 5 + 1',
]) check(`not flagged: "${ok.slice(0, 56)}"`, falseArithmeticIn(ok) === null, falseArithmeticIn(ok));
check('precedence: 2 + 3 x 4 = 20 is wrong (14)', falseArithmeticIn('2 + 3 x 4 = 20')?.correct === '2 + 3 x 4 = 14', falseArithmeticIn('2 + 3 x 4 = 20'));
check('division by zero is not judged', falseArithmeticIn('5 / 0 = 0') === null);
const bSum = formatTurnShapeBlock(classifyTurnShape('For (b): 180/30 = 3, so C3H6O3.', 'Ready to move to part two?'), 'For (b): 180/30 = 3, so C3H6O3.');
check('block: the calculator line and its rule', /Checked by calculator: the message states "180\/30 = 3"; in fact 180\/30 = 6\./.test(bSum) && /do not open with praise or a confirmation/.test(bSum) && /do not state its result for them/.test(bSum), bSum);
check('block: no calculator line when the working is right', !/calculator/.test(formatTurnShapeBlock(classifyTurnShape('For (b): 10 x 3 / 2 = 15 m/s.', 'Ready?'), 'For (b): 10 x 3 / 2 = 15 m/s.')));
check('block: a wrong calculation is reported even with no open question', /calculator/.test(formatTurnShapeBlock(classifyTurnShape('For (b): 180/30 = 3, so C3H6O3.', 'Nice work.'), 'For (b): 180/30 = 3, so C3H6O3.')));
check('a long prose statement is an answer', classifyTurnShape("The president can respond by overriding the Senate's rejection with a two-thirds vote of the House.", 'Aaa. What bbb?')?.shape === 'answer');

// ── the switch ──
check('text + unset ⇒ on', textTurnShapeEnabled('text', undefined));
check("text + 'off' ⇒ off", !textTurnShapeEnabled('text', 'off'));
check('voice ⇒ off whatever the flag', !textTurnShapeEnabled('voice', undefined) && !textTurnShapeEnabled(undefined, 'on'));

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} turn-shape-signal tests passed.`);
