/**
 * The meta-narration filter drops brain sentences that leak internal
 * reasoning. portal-704e3e01 @1027.9s spoke a whole <result>…</result>
 * block aloud because the filter matched content phrases only.
 *
 * Usage: npx tsx scripts/test-meta-narration.ts  (npm run test:meta-narration)
 */
import { IDLE_NUDGE_DIRECTIVE, idleNudgeDirective } from '../src/lib/tutor/voice/idle-nudge';
import { saysAlreadyAnswered, REPEAT_AFTER_CORRECT_REASON } from '../src/lib/tutor/voice/correct-retry';
import fs from 'node:fs';
import path from 'node:path';
import { isMetaNarration, markCorrectionNoteWorking, createCorrectionWorkingTracker, stripNudgePlanClause, stripNoteCitationClause, stripLeakedLabels, isNotePlanNarration, isThirdPersonResidue, isAdjacentDuplicate, isImperativePlanSentence, isPlanContinuationSentence, filterNarrationText, doneTurnText } from '../src/lib/tutor/voice/meta-narration';
import { isBareArithmeticRecheck } from '../src/lib/tutor/voice/arithmetic-recheck';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── the pre-existing phrase behaviour, pinned before it moved ───
check('"The student already solved this one."', isMetaNarration('The student already solved this one.'));
// 2026-10-16 (GAC v12/v16): working corrected mid-sentence is never shown; a plain admission or a pedagogical "Wait —" is.
check('mid-sentence "... wait, let me say it plainly"', isMetaNarration('Distributing gives $10y+5$, not $10y+5$... wait, let me say it plainly: $7y=-14$.'));
check('mid-sentence "/... let\'s check:"', isMetaNarration('Factoring to (2u−2)(u+1)/... let\'s check: (2u+1)(u−1)=0.'));
check('"scratch that"', isMetaNarration('Hmm, no — scratch that.'));
check('a plain admission is kept', !isMetaNarration('Wait, I made a mistake there.'));
check('a pedagogical "Wait —" question is kept', !isMetaNarration('Wait — what do you get when you subtract 5?'));
check('"Let me check — the active problem is …"', isMetaNarration('Let me check — the active problem is the dataset.'));
check('"Let me mark this segment complete."', isMetaNarration('Let me mark this segment complete.'));
check('"Since the student answered, …"', isMetaNarration('Since the student answered, we advance.'));
// 2026-09-05 live: correction-note re-check spoken aloud
check('"Let me re-derive this myself before responding."', isMetaNarration('Let me re-derive this myself before responding.'));
check('"Let me re-verify that prior problem silently: …"', isMetaNarration('Let me re-verify that prior problem silently: 2(x-3)+3x = 4(x+2)+7.'));
check('"Okay, let me double-check my earlier claim first, then answer."', isMetaNarration('Okay, let me double-check my earlier claim first, then answer.'));
check('teaching survives: "Let me verify this with you step by step."', !isMetaNarration('Let me verify this with you step by step.'));
check('teaching survives: "Let me check your work on the second line."', !isMetaNarration('Let me check your work on the second line.'));
check('teaching survives: "Let me re-derive the formula on the board so we both see it."', !isMetaNarration('Let me re-derive the formula on the board so we both see it.'));
// 2026-09-05 live: turn-classifying and third-person planning spoken aloud
check('"That\'s a request, not an attempt at this one yet."', isMetaNarration("That's a request, not an attempt at this one yet — happy to give a quick example first."));
check('"That\'s session-end, no math needed here."', isMetaNarration("That's session-end, no math needed here."));
check('"Let me support them concretely."', isMetaNarration('Let me support them concretely.'));
check('teaching survives: "That\'s a great question."', !isMetaNarration("That's a great question — let's look at it."));
check('teaching survives: "Let me support that with an example."', !isMetaNarration('Let me support that with an example.'));
check('teaching survives: "No rush at all."', !isMetaNarration('No rush at all — take your time.'));
check('"that\'s a greenlight to advance"', isMetaNarration("That's a greenlight to advance."));
check('tool_result leak', isMetaNarration('The tool_result came back empty.'));

// ─── structural leaks: the portal-704e3e01 class ───
check('portal-704e3e01 @1027.9s <result> block',
  isMetaNarration('<result>0=0, same as before — infinitely many again, so this is actually the true-statement twin, not the false one.</result>'));
check('closing tag alone', isMetaNarration('different one for variety.</result>'));
check('<span style="opacity:0"> variant (443.2s)',
  isMetaNarration('<span style="opacity:0">verdict: request, not an answer — no praise</span>'));
check('<thinking> leak', isMetaNarration('<thinking>she is stuck on denominators</thinking>'));

// ─── real teaching speech must survive ───
check('plain math sentence survives',
  !isMetaNarration('Distribute the $4$ across both terms inside those parentheses.'));
check('inequality is not markup', !isMetaNarration('So $x < 5$ and $y > 2$ together.'));
check('spoken comparison is not markup', !isMetaNarration('That means 3 < 10, which is true.'));
check('a verdict survives', !isMetaNarration('Exactly. $x = 10$ — nice work.'));
check('LaTeX survives', !isMetaNarration('Look at $\\frac{x}{2} + 3 = \\frac{x}{5} + 6$ on the board.'));

// ─── the structural rule is separable (kill switch behaviour) ───
check('structural:false leaves <result> alone',
  !isMetaNarration('<result>0=0, same as before.</result>', { structural: false }));
check('structural:false still drops phrase leaks',
  isMetaNarration('The student already solved this one.', { structural: false }));

// Regex 3 — the self-reference / non-answer classifier leak class. This is
// very likely what caught the live 1254.7s leak ("No verdict word … not an
// answer at…"), so it must survive the extraction.
check('"No verdict word" leak', isMetaNarration('No verdict word — this is a give-up and an explicit request.'));
check('"not an answer" leak', isMetaNarration('That is not an answer, so classify silently.'));
check('"automated review" leak', isMetaNarration('This came from an automated review of the turn.'));
check('"give her room" leak', isMetaNarration('Give her room to think before pushing again.'));

// Regex 4 — spoken self-audit collocations (2026-08-31 Haiku round).
check('"I need to check" leak', isMetaNarration('I need to check my prior turn before answering.'));
check('"let me compute:" leak', isMetaNarration('Let me compute: 8+8+5+5 and see.'));
check('"my prior turn" leak', isMetaNarration('So my prior turn was already correct.'));
check('"my Not quite was" leak', isMetaNarration('So my "Not quite" was right after all.'));

// The load-bearing colon: legitimate teaching must SURVIVE.
check('"let me compute the area" survives', !isMetaNarration('Let me compute the area together with you.'));

// A prose run between angle brackets is structurally tag-shaped
// ("<n and n>"), so the attribute section must contain '=' before the
// sentence is treated as markup. Without that, ordinary algebra with two
// unspaced comparisons was silently dropped from TTS and the transcript.
check('unspaced variable comparison survives 1',
  !isMetaNarration('Since 3<n and n>10 does not hold together, let us solve it directly.'));
check('unspaced variable comparison survives 2',
  !isMetaNarration('x<y is bigger, so y>2 too.'));
check('unspaced variable comparison survives 3',
  !isMetaNarration('We need a<b and later on c>d to hold.'));

// All four phrase regexes must fire regardless of the structural option.
check('regex 3 fires with structural:false',
  isMetaNarration('That is not an answer, so classify silently.', { structural: false }));
check('regex 4 fires with structural:false',
  isMetaNarration('I need to check my prior turn before answering.', { structural: false }));

// Curly quotes are the common case in generated speech, and the character
// class carrying them was lost once already in an extraction. Escapes, not
// literals: the curly characters have been mangled twice in transit already,
// and a literal here would silently become ASCII again.
check('ASCII straight quotes are matched',
  isMetaNarration('So my "Not quite" was right after all.'));
check('typographic curly quotes are matched',
  isMetaNarration(`So my “Not quite” was right after all.`));

// ═══ 2026-10-03 round: leak SHAPES (flag NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES) ═══
const drop = (name: string, s: string) => check(`drops: ${name}`, isMetaNarration(s));
const keep = (name: string, s: string) => check(`survives: ${name}`, !isMetaNarration(s));

// a. private working announced with an adverb between "let me" and the verb
drop('prod a: "Let me quietly re-derive this one first."', 'Let me quietly re-derive this one first.');
drop('a: I\'ll + adverb', "I'll just silently double-check that before answering.");
keep('a (10-04b, was drop): "myself" is not a privacy marker', 'I need to quickly work this out myself.');
keep('a (10-04b, was drop): "in my head" is thinking aloud', 'Okay, let me first compute this in my head.');
keep('a (10-04b, was drop): sentence-final "first" is not a privacy marker', 'Let me re-derive this one first.');
keep('a: "Let me show you how to verify this."', 'Let me show you how to verify this.');
keep('a: "Let\'s check that by substituting x = 2."', "Let's check that by substituting x = 2.");
keep('a: adverb but shared working', "Let me quickly compute the area so we can compare.");
keep('a: "I\'ll just check your second line with you."', "I'll just check your second line with you.");
keep('a: "Let me carefully verify this with you step by step."', 'Let me carefully verify this with you step by step.');
keep('a: "Let me re-derive the formula for you first."', 'Let me re-derive the formula for you first.');

// b. the student's turn classified aloud
drop('prod b: "Fair — asking for the exact equation is a request, not something to grade."',
  'Fair — asking for the exact equation is a request, not something to grade.');
keep('b (10-04b, was drop): "…is a question, not an attempt"', 'Asking where the two came from is a question, not an attempt.');
drop('b: "nothing to grade"', "There's nothing to grade here yet.");
keep('b (10-04b, was drop): "that isn\'t an attempt"', "Okay, that isn't an attempt at the problem.");
keep('b: "That\'s a great question."', "That's a great question.");
keep('b: "Is that a request for the next one?"', 'Is that a request for the next one?');
keep('b: "This is a question about slope, not about intercepts."', 'This is a question about slope, not about intercepts.');
keep('b: "Nice attempt."', 'Nice attempt — the setup is right.');

// c. a runtime artefact named as the thing being reacted to
drop('prod c: "Given that boredom cue, let\'s not linger."', "Given that boredom cue, let's not linger.");
keep('c (10-04b, was drop): bare "The note says to re-check."', 'The note says to re-check the last step.');
keep('c (10-04b, was drop): bare "Per the hint, …"', "Per the hint, I'll offer a harder one.");
keep('c (10-04b, was drop): "my instructions"', 'My instructions are to offer a choice here.');
keep('c (10-04b, was drop): "the validator flagged"', 'It looks like the validator flagged that step.');
drop('c: "the runtime hint"', 'Because of the runtime hint, a quick change of plan.');
keep('c: "Notice the hint in the problem: …"', "Notice the hint in the problem: the word 'at least'.");
keep('c: "Take note of the sign."', 'Take note of the sign.');
keep('c: "that one\'s already sitting on page 2 from earlier" (not this shape)', "That one's already sitting on page 2 from earlier.");
keep('c: "Use the hint button if you get stuck."', 'Use the hint button if you get stuck.');
keep('c: "Here is a hint: look at the exponent."', 'Here is a hint: look at the exponent.');
keep('c: "A calculator is a useful tool here."', 'A calculator is a useful tool here.');
// found by running the new rules over the lesson seeds: all three are lesson content
keep('c: "The note says \"chickens,\" which is the topic…" (note-taking lesson)', 'The note says "chickens," which is the topic the article covers, not its title.');
keep('c: "…the system says who decides…" (economic systems lesson)', 'Remember that the system says who decides while the place shapes what there is to decide about.');
keep('c: "…self-correction hint that…" (poetry lesson)', "The line-break and self-correction hint that the certainty isn't total.");
keep('c: "The hint says to factor first." (the card\'s own hint)', 'The hint says to factor first.');
drop('c: "The system says I should offer a choice."', 'The system says I should offer a choice.');
keep('c (10-04b, was drop): "the correction note" as an object', 'Looking at the correction note, the earlier answer was fine.');

// d. commentary on what a tool / bank / generator returned
drop('prod d: "The bank keeps handing me the one we already did."', 'The bank keeps handing me the one we already did.');
drop('prod d: "That one\'s a repeat."', "That one's a repeat.");
drop('prod d: "That\'s also a repeat."', "That's also a repeat.");
keep('d (10-04b, was drop): one-off "The generator gave me the same problem again."', 'The generator gave me the same problem again.');
keep('d (10-04b, was drop): "the tool …" is never this rule', 'Hmm, the tool handed me a duplicate.');
keep('d: "The bank charges 5% interest."', 'The bank charges 5% interest.');
keep('d: "The bank gave me a loan of $500." (word problem)', 'The bank gave me a loan of $500 at 4% a year.');
keep('d: "That\'s a repeating decimal."', "That's a repeating decimal.");
keep('d: "Let\'s repeat that step."', "Let's repeat that step.");
keep('d: "This formula gives us the slope."', 'This formula gives us the slope.');

// e. first-person claims of an internal check. Only the BARE claim drops; a
// claim that goes on to state a result or a verdict is the correction itself.
drop('prod e: bare "I checked your move myself."', 'I checked your move myself.');
drop('prod e: "I checked your move myself…" (trailing ellipsis)', 'I checked your move myself…');
drop('e: bare "I\'ve re-derived it."', "I've re-derived it.");
drop('e: "I just verified that internally"', 'I just verified that internally.');
keep('e: claim + verdict is kept: "I checked your move myself and it holds up."', 'I checked your move myself and it holds up.');
keep('e: claim + verdict is kept: "I\'ve re-derived it and the answer stands."', "I've re-derived it and the answer stands.");
keep('e: word-problem prose "I checked the forecast…"', 'Suppose a hiker says: I checked the forecast and it showed a 30% chance of rain.');
keep('e: "I checked your work with you…" is not private', 'I see what happened once I checked your second line.');
keep('e: "You verified it yourself."', 'You verified it yourself — nicely done.');

// ═══ 2026-10-04 review: over-blocking. Every sentence below was dropped by
// the 10-03 shape rules and is ordinary teaching or a spoken correction. ═══
for (const s of [
  // e. a check claim that STATES its result / verdict, or is done for the student
  'Sorry, I recomputed it and the answer is 7, not 9.',
  'I recalculated, and your answer of 12 is correct.',
  'I re-verified your steps, and they hold.',
  "I've re-derived the formula on the board for you.",
  "I've verified the answer myself and you're right.",
  'I calculated the area in my head and got 12.',
  // d. "repeat / duplicate" as lesson content
  "That's a repeat, so the decimal is 0.333 repeating.",
  'This is a duplicate factor, so we count it twice.',
  "That's a duplicate — $x = 2$ shows up twice, so it's a double root.",
  "That's a repeat of the pattern we saw earlier.",
  'This is a repeat of the same mistake: the sign.',
  // b. "X, not Y" contrasts and "evaluate" that are not about grading the turn
  "There's nothing to evaluate inside the parentheses yet.",
  "That isn't an attempt to factor, it's expanding.",
  'This is a request, not an attempt to persuade.',
  "That's a statement, not a guess — you sound confident!",
  // c. notes / instructions / cues / validators / tools as lesson objects
  'Per the instructions, round to the nearest tenth.',
  'Follow my instructions step by step.',
  'Read my instructions on the card.',
  "Based on the context cue, what does 'arid' mean?",
  'The note says to add two cups of flour.',
  'Per the note in the margin, the author disagrees.',
  'A validator checks the input before the loop runs.',
  'Take a correction note in your notebook.',
  'The tool tells me the angle is 30 degrees.',
  // d. a source doing its ordinary job
  'The generator produces up to 5 kilowatts.',
  'The generator produces back EMF in the coil.',
  'A random number generator gives back a value between 0 and 1.',
  'The practice set comes up next.',
  'The bank served up a 3 percent rate.',
  'The bank pulled out of the deal.',
  // a. first-person working that is announced TO the student or carries content
  'I need to double-check my earlier arithmetic.',
  'Let me first calculate the area myself.',
  "I'll check this in my head: 12 times 12 is 144.",
]) keep(`review: "${s}"`, s);
// …and the frames those rules are really about still drop.
keep('c (10-04b, was drop): bare "The note tells me to slow down."', 'The note tells me to slow down.');
drop('c: "Given this frustration cue, I\'ll slow down."', "Given this frustration cue, I'll slow down.");
keep('c (10-04b, was drop): "the validator flagged my answer"', 'Hmm, the validator flagged my answer.');
keep('d (10-04b, was drop): one-off "The problem bank returned me the same question again."', 'The problem bank returned me the same question again.');
keep('d: "The tool gave me one idea for the diagram."', 'The tool gave me one idea for the diagram.');
drop('d: "This one is a duplicate."', 'This one is a duplicate.');
drop('d: "Hmm, that\'s a repeat again."', "Hmm, that's a repeat again.");
drop('b: "that\'s a question, not something for me to grade"', "Okay, that's a question, not something for me to grade.");

// ═══ 2026-10-04 second review: residual over-blocking. A rule may drop a
// sentence only when its shape is unmistakably the tutor talking about its own
// runtime; when in doubt, keep. Every sentence in REVIEW2_KEEP was dropped
// with the shapes flag ON and kept with it OFF. ═══
const REVIEW2_KEEP: string[] = [
  // a. thinking aloud is not private working
  'Let me re-check that calculation first.',
  'Let me recompute that first.',
  'Let me redo that step first.',
  'Hold on, let me re-do the subtraction first.',
  'Let me check it in my head.',
  'Let me work this out myself.',
  // b. grading words said TO the student / with content
  "That isn't an attempt at the problem yet — want to give it a go?",
  "There's nothing to grade on this one, it's just practice.",
  'This quiz has nothing to grade until you press submit.',
  'It was a comment, not an attempt.',
  // c. hint / note / cue / instructions as lesson objects
  'The hint tells me to look at the units.',
  'The note tells me to play this bar softly.',
  'Per the hint, I would start by factoring.',
  'Per the instructions, I will round at the end.',
  "Given the timing cue, let's count the beats.",
  'Given that cue, we know the narrator is unreliable.',
  'Based on that cue, I think the character is lying.',
  'My instructions are to keep it under ten steps.',
  'The note says I owe you five dollars.',
  'In the story, the note says I will return at dawn.',
  'The correction note in the margin shows the right spelling.',
  'Write that correction note down.',
  'A system note in the log shows the error.',
  // d. a source doing its ordinary job
  'The tool gave me the same answer, 42.',
  'The random number generator returned me the same number twice.',
  'The question bank gives me a new problem each time, so try another.',
  'The bank returned me the same amount.',
  'The food bank handed me the same box as last week.',
  // near misses of the narrowed shapes
  'The random number generator keeps giving me the same number.',
  'The bank keeps giving me the same amount.',
  'The bank keeps giving me the same result.',
  'The question bank keeps giving me the same answer.',
  'Is that a question, not something to grade?',
  "That's a question, not something to grade — you can ask as many as you like.",
  "There's nothing to grade here, so relax.",
];
for (const s of REVIEW2_KEEP) keep(`review2: "${s}"`, s);
{
  // "kept with the flag off" — none of them is caught by a pre-round rule.
  const prev = process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES;
  process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES = 'off';
  check('review2: all kept with the shapes flag off too', REVIEW2_KEEP.every((s) => !isMetaNarration(s)),
    REVIEW2_KEEP.filter((s) => isMetaNarration(s)).join(' | '));
  if (prev === undefined) delete process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES;
  else process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES = prev;
}
// The original production leaks, and the narrowed shapes, still drop.
for (const s of [
  'Let me quietly re-derive this one first.',
  'Fair — asking for the exact equation is a request, not something to grade.',
  "Given that boredom cue, let's not linger.",
  'The bank keeps handing me the one we already did.',
  "That one's a repeat.",
  "That's also a repeat.",
  'I checked your move myself.',
  // a. privacy adverb / phrase attached to a first-person working verb
  'Let me silently verify that.',
  "I'll check that privately.",
  'I need to work this out to myself.',
  'Let me double-check that before answering.',
  'Let me recompute that internally.',
  // b. turn classified for grading, nothing for the student
  'That is a statement, not something for me to score.',
  'Nothing to grade here.',
  'Nothing to grade there.',
  'Nothing to grade.',
  // c. qualified artefact in a reaction frame; "the correction note … me"
  'Per the pacing hint, I will move on.',
  'The validator note says the step is wrong.',
  'Given the frustration signal, a short break.',
  'According to the engagement flag, a change of pace.',
  'The correction note tells me to re-check the last step.',
  'The correction note wants me to apologise.',
  // d. the bank / generator KEEPS serving a problem already done
  'The problem bank keeps giving me the same question.',
  'The question bank kept returning me a repeat.',
  'The generator keeps handing me the same problem.',
  'The practice bank keeps serving me a duplicate.',
  'The bank kept handing me the ones we already did.',
]) drop(`review2: "${s}"`, s);

// kill switch: off restores the previous behaviour for the new shapes only
{
  const prev = process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES;
  process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES = 'off';
  check('flag off: new shape no longer dropped', !isMetaNarration('The bank keeps handing me the one we already did.'));
  check('flag off: pre-existing rule still drops', isMetaNarration('Let me re-derive this myself before responding.'));
  if (prev === undefined) delete process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES;
  else process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES = prev;
}

// ═══ "The system …" / "The runtime …" as lesson content (2026-10-03) ═══
// PHRASE_START_RE dropped every sentence opening with either phrase, which
// also dropped a system of equations and an algorithm's runtime.
keep('system: "The system of equations has one solution."', 'The system of equations has one solution.');
keep('system: "The system above has infinitely many solutions."', 'The system above has infinitely many solutions.');
keep('system: "The system of inequalities is graphed on the board."', 'The system of inequalities is graphed on the board.');
keep('system: "The system below is the one to solve."', 'The system below is the one to solve.');
keep('system: "The system has no solution."', 'The system has no solution.');
keep('system: "The system has infinitely many solutions."', 'The system has infinitely many solutions.');
keep('system: "The system has exactly one solution, at (2, 3)."', 'The system has exactly one solution, at (2, 3).');
keep('system: "The system is inconsistent."', 'The system is inconsistent.');
keep('system: "The system is consistent and independent."', 'The system is consistent and independent.');
keep('runtime: "The runtime of this loop grows linearly."', 'The runtime of this loop grows linearly.');
keep('system: "The system has a unique solution."', 'The system has a unique solution.');
keep('system: "The system has no solutions."', 'The system has no solutions.');
keep('system: "The system of linear equations has two unknowns."', 'The system of linear equations has two unknowns.');
keep('system: "The system above is inconsistent."', 'The system above is inconsistent.');
// 2026-10-04 review: the quantifier alone is not a maths context.
drop('system leak: "The system has no record of your answer."', 'The system has no record of your answer.');
drop('system leak: "The system has one more problem queued."', 'The system has one more problem queued.');
drop('system leak: "The system has exactly the same card again."', 'The system has exactly the same card again.');
drop('system leak: "The system is consistent about flagging that."', 'The system is consistent about flagging that.');
drop('system leak: "The system below the lesson flagged it."', 'The system below the lesson flagged it.');
{
  // The narrowing is part of the 10-03 round, so it sits behind the same flag:
  // off ⇒ every "The system …" / "The runtime …" opener drops, as before.
  const prev = process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES;
  process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES = 'off';
  check('flag off: "The system has no solution." drops (pre-10-03 rule)', isMetaNarration('The system has no solution.'));
  check('flag off: "The system of equations has one solution." drops (pre-10-03 rule)', isMetaNarration('The system of equations has one solution.'));
  check('flag off: "The runtime of this loop grows linearly." drops (pre-10-03 rule)', isMetaNarration('The runtime of this loop grows linearly.'));
  if (prev === undefined) delete process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES;
  else process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES = prev;
}
drop('system leak: "The system flagged that answer."', 'The system flagged that answer.');
drop('system leak: "The system has marked this segment as done."', 'The system has marked this segment as done.');
drop('system leak: "The system is asking for a different problem."', 'The system is asking for a different problem.');
drop('system leak: "The system has a note about the last answer."', 'The system has a note about the last answer.');
drop('system leak: "The system wants a new problem."', 'The system wants a new problem.');
drop('system leak: bare "The system."', 'The system.');
drop('runtime leak: "The runtime rejected that card."', 'The runtime rejected that card.');
drop('runtime leak: "The runtime is asking me to move on."', 'The runtime is asking me to move on.');
drop('system leak still caught by the reaction shape: "The system says I should offer a choice."', 'The system says I should offer a choice.');

// ═══ leading narrated working in a reply to a correction note ═══
{
  const stream = (list: string[], opts?: { maxRun?: number }) => {
    const tr = createCorrectionWorkingTracker(opts);
    return list.map((s) => tr.isWorking(s, true));
  };
  const noneMarked = (list: string[]) =>
    markCorrectionNoteWorking(list, true).every((m) => !m) && stream(list).every((m) => !m);

  // The production case: the private announcement and the bare derivation
  // drop; the conclusion is the correction the tutor was asked to give.
  const turn = [
    'Let me quietly re-derive this one first.',
    'Two times nine is eighteen, minus four is fourteen.',
    'So the correct answer is fourteen.',
    'You were right, and I was wrong a moment ago.',
    'So the answer stands at fourteen.',
  ];
  const marks = markCorrectionNoteWorking(turn, true);
  check('correction turn: private opener + bare derivation are marked', marks[0] && marks[1]);
  check('correction turn: the conclusion sentence is SPOKEN', !marks[2]);
  check('correction turn: nothing after the run is marked', !marks[3] && !marks[4]);
  check('not a correction turn: nothing marked', markCorrectionNoteWorking(turn, false).every((m) => !m));
  check('tracker: streaming marks the same run', stream(turn).join() === 'true,true,false,false,false');

  // 2026-10-04 review: these four turns were muted in full. A plain "let me
  // check / see / verify" is how a tutor talks; it never opens a run.
  const KEPT_TURNS: string[][] = [
    ['Actually, let me check the sign there.', 'Negative three times negative two is positive six.',
      'So the line should read x is greater than negative two.', 'I had that flipped earlier.'],
    ['Let me check that.', 'Three times four is twelve, minus five is seven.',
      'So the answer is seven, not nine.', 'The slip was in the subtraction.'],
    ['Let me see.', 'Two x plus three equals eleven.', 'Subtract three from both sides.',
      'Two x equals eight.', 'Divide both sides by two.', 'x equals four.'],
    ["I'll verify by plugging in 4.", 'Two times four plus three is eleven.', 'Eleven is less than thirteen.', 'It works.'],
  ];
  KEPT_TURNS.forEach((list, i) => {
    check(`review turn ${i + 1}: no run starts (array + streaming)`, noneMarked(list));
    for (const s of list) check(`review turn ${i + 1}: not meta-narration: "${s}"`, !isMetaNarration(s));
  });
  for (const opener of ['Let me think.', "I'm checking that now.", 'Let me verify that.', 'Hmm, let me work that out.', 'Let me re-check that.']) {
    check(`plain opener never starts a run: "${opener}"`, noneMarked([opener, 'Nine minus four is five.', 'So five is correct.']));
  }

  const direct = ['Actually, three times four is twelve, not fourteen.', 'Sorry about that.'];
  check('correction stated directly: nothing marked', noneMarked(direct));
  const addressed = ['Let me quietly check your second line with you.', 'Nine minus four is five.'];
  check('private-sounding opener addressed to the student: nothing marked', noneMarked(addressed));
  const later = ['Sorry about that.', 'Let me quietly re-derive this one first.', 'Nine minus four is five.'];
  check('a run can only open the turn', stream(later).every((m) => !m));

  // Inside a run: a conclusion / correction / address / question / apology
  // ends it and is spoken.
  // [name, sentence, released?] — released: the sentence is NOT a conclusion,
  // so the last withheld derivation line is handed back to be spoken first.
  const ENDS: Array<[string, string, boolean]> = [
    ['"so the answer is"', 'So the answer is seven.', false],
    ['"the answer is"', 'The answer is seven.', false],
    ['"should read"', 'So the line should read x is greater than negative two.', false],
    ['"should be"', 'It should be fourteen.', false],
    ['"is correct"', 'So five is correct.', false],
    ['"is wrong"', 'So nine is wrong.', false],
    ['"not <number>"', 'That gives seven, not nine.', false],
    ['"not <expression>"', 'It comes to $2x$, not $x^2$.', false],
    ['"I had that …"', 'I had that flipped earlier.', false],
    ['"the slip was"', 'The slip was in the subtraction.', false],
    ['"the mistake was"', 'The mistake was mine.', false],
    ['"the correct …"', 'The correct value is fourteen.', false],
    ['addresses the student', 'You were right about the sign.', false],
    ['a question', 'Does that match what is on the board?', true],
    ['an acknowledgement', 'Good catch.', true],
    ['an apology', 'Sorry about that.', true],
    ['plain prose that is not bare working', 'The sign flips whenever a negative is divided across.', true],
  ];
  for (const [name, s, released] of ENDS) {
    const list = ['Let me quietly re-check that.', 'Nine minus four is five.', s, 'Six plus six is twelve.'];
    const tr = createCorrectionWorkingTracker();
    const m: boolean[] = [];
    const rel: string[][] = [];
    for (const x of list) { const w = tr.isWorking(x, true); m.push(w); rel.push(w ? [] : tr.release()); }
    check(`run ends, sentence spoken: ${name}`, m.join() === 'true,true,false,false', m.join());
    check(`${released ? 'not a conclusion → last withheld line released before it' : 'a conclusion → nothing released'}: ${name}`,
      rel.map((r) => r.join('+')).join('|') === (released ? '||Nine minus four is five.|' : '|||'), JSON.stringify(rel));
    const a = markCorrectionNoteWorking(list, true).join();
    check(`array form agrees: ${name}`, a === (released ? 'true,false,false,false' : 'true,true,false,false'), a);
  }

  // Cap: opener + at most three more.
  const long = ['Let me silently re-verify that.', 'Two times three is six.', 'Six plus four is ten.',
    'Ten minus one is nine.', 'Nine times two is eighteen.', 'Eighteen minus four is fourteen.', 'x equals fourteen.'];
  check('run is capped at 4 sentences (streaming)', stream(long).join() === 'true,true,true,true,false,false,false', stream(long).join());
  // The cap ends the run on a derivation line, not a conclusion, so the line
  // before it is released too (array: un-marked).
  check('run is capped at 4 sentences (array; the line before the cap is released)',
    markCorrectionNoteWorking(long, true).join() === 'true,true,true,false,false,false,false', markCorrectionNoteWorking(long, true).join());
  check('tracker: maxRun option lowers the cap', stream(long, { maxRun: 2 }).slice(0, 3).join() === 'true,true,false');
  check('tracker: maxRun cannot raise the cap past 4', stream(long, { maxRun: 12 }).filter(Boolean).length === 4);

  // Never mute the whole turn.
  const allWorking = ['Let me quietly re-check that.', 'Nine minus four is five.', 'Five plus two is seven.'];
  check('array: a turn that is working throughout is left alone', markCorrectionNoteWorking(allWorking, true).every((m) => !m));
  {
    const tr = createCorrectionWorkingTracker();
    const m = allWorking.map((s) => tr.isWorking(s, true));
    check('tracker: streaming cannot know the turn ends there…', m.join() === 'true,true,true');
    check('tracker: …so finish() hands back the withheld derivation to speak', tr.finish().join('|') === 'Nine minus four is five.|Five plus two is seven.', tr.finish());
    const tr2 = createCorrectionWorkingTracker();
    turn.forEach((s) => { if (!tr2.isWorking(s, true)) tr2.markSpoken(); });
    check('tracker: finish() is empty when something was spoken', tr2.finish().length === 0);
    // "Passed by the tracker" is not "spoken": only markSpoken() counts.
    const tr4 = createCorrectionWorkingTracker();
    turn.forEach((s) => tr4.isWorking(s, true));
    check('tracker: finish() restores when the caller never marked anything spoken',
      tr4.finish().join('|') === 'Two times nine is eighteen, minus four is fourteen.', tr4.finish().join('|'));
    const tr5 = createCorrectionWorkingTracker();
    check('tracker: withhold() records nothing outside a run', tr5.withhold('2 times 9 is 18.') === false && tr5.finish().length === 0);
    tr5.isWorking('Let me quietly re-derive this one first.', true);
    check('tracker: withhold() records during a run', tr5.withhold('2 times 9 is 18.') === true && tr5.finish().join('|') === '2 times 9 is 18.');
    const tr6 = createCorrectionWorkingTracker();
    ['Let me quietly re-check that.', 'Nine minus four is five.', 'Sorry about that.'].forEach((s) => tr6.isWorking(s, true));
    check('tracker: release() hands the line out once', tr6.release().join('|') === 'Nine minus four is five.' && tr6.release().length === 0);
    const tr7 = createCorrectionWorkingTracker();
    ['Let me quietly re-check that.', 'Let me silently verify again.', 'Sorry about that.'].forEach((s) => tr7.isWorking(s, true));
    check('tracker: a private announcement is never released or restored', tr7.release().length === 0 && tr7.finish().length === 0);
    const tr3 = createCorrectionWorkingTracker();
    KEPT_TURNS[0].forEach((s) => tr3.isWorking(s, true));
    check('tracker: finish() is empty when no run started', tr3.finish().length === 0);
  }

  // ── 2026-10-04 second review: corrections still lost. `speakTurn` mirrors
  // the VoiceTutorRealtime sentence path in order: bare-arithmetic re-check
  // filter (first spoken sentence of a correction-note turn) → tracker →
  // release → meta filter → enqueue (markSpoken) → finish() restore at stream
  // end. Restored / released frames bypass the arithmetic filter and tracker.
  const speakTurn = (list: string[]): string[] => {
    const tr = createCorrectionWorkingTracker();
    const out: string[] = [];
    const say = (s: string) => { if (isMetaNarration(s)) return; out.push(s); tr.markSpoken(); };
    for (const s of list) {
      if (out.length === 0 && isBareArithmeticRecheck(s)) { tr.withhold(s); continue; }
      const working = tr.isWorking(s, true);
      if (!working) {
        const released = tr.release();
        if (released.length > 0) { for (const r of released) say(r); say(s); continue; }
      }
      if (isMetaNarration(s)) continue;
      if (working) continue;
      say(s);
    }
    for (const s of tr.finish()) say(s);
    return out;
  };
  const arrayTurn = (list: string[]): string[] => {
    const m = markCorrectionNoteWorking(list, true);
    return list.filter((s, i) => !m[i] && !isMetaNarration(s));
  };
  const SPOKEN: Array<[string, string[], string[]]> = [
    ['turn 1: "Let me re-check that calculation first." is thinking aloud — whole turn spoken',
      ['Let me re-check that calculation first.', 'Eighteen minus four gives fourteen.', 'Fourteen it is.', 'Does that make sense?'],
      ['Let me re-check that calculation first.', 'Eighteen minus four gives fourteen.', 'Fourteen it is.', 'Does that make sense?']],
    ['turn 2: run ends on an apology — the result is spoken before it',
      ['Let me quietly re-derive this one first.', 'Eighteen minus four gives fourteen.', 'That gives fourteen.', 'Sorry for the mix-up earlier.'],
      ['That gives fourteen.', 'Sorry for the mix-up earlier.']],
    ['turn 2b: withheld inequality + "Apologies for the confusion."',
      ['Let me quietly re-derive this one first.', 'x is greater than negative two.', 'Apologies for the confusion.'],
      ['x is greater than negative two.', 'Apologies for the confusion.']],
    ['turn 2c: run ends on a question',
      ['Let me quietly re-derive this one first.', 'Eighteen minus four gives fourteen.', 'Does that make sense?'],
      ['Eighteen minus four gives fourteen.', 'Does that make sense?']],
    ['a conclusion ends the run — nothing extra is released',
      ['Let me quietly re-derive this one first.', 'Eighteen minus four gives fourteen.', 'So the correct answer is fourteen.'],
      ['So the correct answer is fourteen.']],
    ['run ends on a sentence the meta filter drops — the derivation is restored',
      ['Let me quietly re-derive this one first.', 'Nine minus four is five.', 'The student was right.'],
      ['Nine minus four is five.']],
    ['run ends on a NON-conclusion the meta filter drops — the released line is still spoken',
      ['Let me quietly re-derive this one first.', 'Nine minus four is five.', 'Nothing to grade here.'],
      ['Nine minus four is five.']],
  ];
  for (const [name, list, expected] of SPOKEN) {
    check(`spoken (streaming): ${name}`, speakTurn(list).join('|') === expected.join('|'), speakTurn(list).join('|'));
    check(`spoken (array): ${name}`, arrayTurn(list).join('|') === expected.join('|'), arrayTurn(list).join('|'));
  }
  {
    // The arithmetic-only turn: every derivation line is eaten by the
    // bare-arithmetic filter BEFORE the tracker (the turn's first spoken
    // sentence never arrives). withhold() + finish() restore them.
    const list = ['Let me quietly re-derive this one first.', '2 times 9 is 18.', '18 minus 4 is 14.'];
    check('precondition: both lines are bare arithmetic re-checks', isBareArithmeticRecheck(list[1]) && isBareArithmeticRecheck(list[2]));
    check('spoken (streaming): arithmetic-only turn is restored, not silent',
      speakTurn(list).join('|') === '2 times 9 is 18.|18 minus 4 is 14.', speakTurn(list).join('|'));
    check('spoken (array): arithmetic-only turn is left alone', arrayTurn(list).join('|') === '2 times 9 is 18.|18 minus 4 is 14.', arrayTurn(list).join('|'));
    const withApology = [...list, 'Sorry for the mix-up earlier.'];
    check('spoken (streaming): arithmetic lines + apology — last line released before the apology',
      speakTurn(withApology).join('|') === '18 minus 4 is 14.|Sorry for the mix-up earlier.', speakTurn(withApology).join('|'));
  }
  {
    // Wiring: the VoiceTutorRealtime call sites this simulation stands for.
    const vtr = fs.readFileSync(path.join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
    // 2026-10-06c: the drop rule is arithmetic-recheck.ts `shouldDropBareRecheck`
    // (restored frames and a stripped opener are exempt there; tested in
    // scripts/test-owner-session-2026-10-06c.ts).
    check('VTR: bare-arithmetic drops are recorded with the tracker', /shouldDropBareRecheck\(\{[\s\S]{0,600}?\}\)\) \{\s*correctionWorkingTracker\.withhold\(sentence\);/.test(vtr));
    check('VTR: restored frames bypass the bare-arithmetic filter', /shouldDropBareRecheck\(\{[\s\S]{0,400}?restoredFrame: correctionWorkingRestoredFrame,/.test(vtr));
    check('VTR: restored frames bypass the tracker', /correctionWorkingRestoredFrame\s*\?\s*false\s*:\s*correctionWorkingTracker\.isWorking\(/.test(vtr));
    check('VTR: release() is consumed and re-entered ahead of the sentence', /correctionWorkingTracker\.release\(\)/.test(vtr));
    check('VTR: markSpoken() is called where the sentence is enqueued', /correctionWorkingTracker\.markSpoken\(\)/.test(vtr));
    check('VTR: finish() is called exactly once, in the synthetic tail', (vtr.match(/correctionWorkingTracker\.finish\(\)/g) ?? []).length === 1);
  }

  const t2 = createCorrectionWorkingTracker();
  check('tracker: inactive when the turn does not answer a correction note', turn.every((s) => !t2.isWorking(s, false)));
  const prev = process.env.NEXT_PUBLIC_TUTOR_CORRECTION_WORKING_DROP;
  process.env.NEXT_PUBLIC_TUTOR_CORRECTION_WORKING_DROP = 'off';
  check('flag off: nothing marked', markCorrectionNoteWorking(turn, true).every((m) => !m));
  if (prev === undefined) delete process.env.NEXT_PUBLIC_TUTOR_CORRECTION_WORKING_DROP;
  else process.env.NEXT_PUBLIC_TUTOR_CORRECTION_WORKING_DROP = prev;
}

// ─── Round 3 (Haiku 5.5, 10-27): commentary on the reply / the instruction ───
check('"Those words already ask the question, so I\'ll stop there." (portal-93b6dd9b)', isMetaNarration("Those words already ask the question, so I'll stop there."));
check('"Your words already ended with the question, so I\'ll stop here." (portal-d8c8a3f6)', isMetaNarration("Your words already ended with the question, so I'll stop here."));
check('"The equation card is up, so there\'s nothing more to add." (portal-136a30a0)', isMetaNarration("The equation card is up, so there's nothing more to add."));
check('"The card is up."', isMetaNarration('The card is up.'));
check('"That already asks the question."', isMetaNarration('That already asks the question.'));
check('"…, so I\'ll stop there."', isMetaNarration("The question is on the board, so I'll stop there."));
check('kept: "Sounds good, let\'s stop here."', !isMetaNarration("Sounds good, let's stop here."));
check('kept: "There\'s nothing more to add to the left side, so subtract 3 from both sides."', !isMetaNarration("There's nothing more to add to the left side, so subtract 3 from both sides."));
check('kept: "The problem card is up on the board — what\'s the first step?"', !isMetaNarration("The problem card is up on the board — what's the first step?"));
check('kept: "Put those words in your own sentence."', !isMetaNarration('Put those words in your own sentence.'));
check('kept: "Read the question again: what does it already ask for?"', !isMetaNarration('Read the question again: what does it already ask for?'));

// ─── GDI trial run 2 (10-29): runtime notes read aloud ───
check('dropped: "The level-check segment still needs a few more answers, …"', isMetaNarration('The level-check segment still needs a few more answers, and "I am sales manager" is missing the article "a".'));
check('dropped: "I\'ll show the corrected sentence and then ask the next question."', isMetaNarration("I'll show the corrected sentence and then ask the next question."));
check('dropped: "Let me show you one sentence card for the next step."', isMetaNarration('Let me show you one sentence card for the next step.'));
check('kept: "The red segment must be longer than the blue one."', !isMetaNarration('The red segment must be longer than the blue one.'));
check('kept: "The shaded segment should be 3 units long."', !isMetaNarration('The shaded segment should be 3 units long.'));
check('kept: "The second segment should equal the first."', !isMetaNarration('The second segment should equal the first.'));
check('kept: "Let me show you a card trick with probability."', !isMetaNarration('Let me show you a card trick with probability.'));
check('kept: "I\'ll show you a card from the deck."', !isMetaNarration("I'll show you a card from the deck."));
check('dropped: "I\'ll show the corrected sentence and then ask the next question."', isMetaNarration("I'll show the corrected sentence and then ask the next question."));
check('dropped: "This warm-up segment is done."', isMetaNarration('This warm-up segment is done.'));
check('dropped: "Per the lesson pointer, we move on."', isMetaNarration('Per the lesson pointer, we move on.'));
check('kept: "Let me show you the sentence on the board."', !isMetaNarration('Let me show you the sentence on the board.'));
check('kept: "The line segment AB is 5 cm."', !isMetaNarration('The line segment AB is 5 cm.'));
check('kept: "Each segment of the circle has the same area."', !isMetaNarration('Each segment of the circle has the same area.'));
check('kept: "This sentence needs a verb."', !isMetaNarration('This sentence needs a verb.'));

// ─── Task 14 §E (GDI run 4): runtime notes / board staging read aloud ───
check('dropped: "Those runtime notes are a mix, so let me just say it plainly."', isMetaNarration('Those runtime notes are a mix, so let me just say it plainly.'));
check('dropped: "Let me put a quick hook on the board first."', isMetaNarration('Let me put a quick hook on the board first.'));
check('dropped: "Let me put the sentence on the board." (the auto card writes it)', isMetaNarration('Let me put the sentence on the board.'));
check('dropped: "Those system notes say we move on."', isMetaNarration('Those system notes say we move on.'));
check('dropped: "These notes are mixed, so here it is."', isMetaNarration('These notes are mixed, so here it is.'));
check('kept: "Look at the sentence on the board."', !isMetaNarration('Look at the sentence on the board.'));
check('kept: "These notes are your summary for next week."', !isMetaNarration('These notes are your summary for next week.'));
check('kept: "Put the hook of the letter j below the line."', !isMetaNarration('Put the hook of the letter j below the line.'));

// ─── Task 20 §C (GDI run 8): the plan spoken on idle-nudge turns ───
const RT = { runtimeTriggered: true };
for (const t of [
  "The question was about the present perfect, so I'll ask the next present-perfect question about their work.",
  'Thanks, I heard your answer.',
  "Here is a new question, and I'll put it on the board.",
  'Here is the question on the board.',
  "So I'll acknowledge briefly and hand the question back.",
  'Thanks, I heard you.',
  'The student said they work in sales, so I’ll ask about customers.',
]) check(`dropped whole on a runtime-triggered turn (run 8): "${t}"`, isMetaNarration(t, RT) && stripNudgePlanClause(t) === '');
for (const t of [
  "I'll ask you one more question.",
  'The question was about your weekend.',
  'Thanks, I heard you say "I have learned", and that is right.',
  'Take a moment to read it, then tell me your answer.',
  "Let's keep going with the present perfect.",
  'Look at the question on the board.',
]) check(`kept: "${t}"`, !isMetaNarration(t, RT) && stripNudgePlanClause(t) === t);
// Fix round 2 (I4): the plan clause goes, the content stays.
for (const [t, want] of [
  ["So I'll keep going with fractions: what is 1/2 + 1/4?", 'What is 1/2 + 1/4?'],
  ["I'll ask the next question about area: what is 3 times 4?", 'What is 3 times 4?'],
  ["Here is the next equation, 3x - 5 = 10, and I'll put it on the board.", 'Here is the next equation, 3x - 5 = 10.'],
  ["I'll keep going with the present perfect: tell me one thing you have done this year.", 'Tell me one thing you have done this year.'],
  ['Here is the question on the board: what is 7 times 8?', 'What is 7 times 8?'],
  ['Ah, I may have missed your answer just now, so please go ahead and tell me one thing you did at work last week.', 'So please go ahead and tell me one thing you did at work last week.'],
] as const) {
  check(`I4 r2 clause stripped: "${t}" → "${want}"`, stripNudgePlanClause(t) === want);
  check(`I4 r2 not dropped whole: "${t}"`, !isMetaNarration(t, RT));
}
{
  const vtr = fs.readFileSync(path.join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('I4 r2: VTR strips the clause on runtime-triggered turns only', /if \(typeof ev\.text === 'string' && \/\^\\s\*\\\[\/\.test\(transcript\)\) \{\s*const planStripped = stripNudgePlanClause\(ev\.text\);/.test(vtr));
}
// Fix round 1 (I4): teaching sentences — kept on a runtime turn too, and the
// nudge shapes never apply to a student-triggered turn.
for (const t of [
  "I'll mark the point (2, 3) on the graph.",
  "I'll note that x cannot be zero here.",
  "I'll treat x as a constant.",
  "I'll take that as our starting value, so a = 4.",
  "I'll move on to the second step: subtract 3 from both sides.",
  "The answer is 12, so I'll write it next to the box.",
  "The question is about speed, so I'll draw a distance-time graph.",
  'Here is the question on the board: what is 7 times 8?',
  'Here is the question on the board: how long have you worked there?',
]) check(`I4 kept (runtime turn): "${t}"`, !isMetaNarration(t, RT));
for (const t of [
  "So I'll acknowledge briefly and hand the question back.",
  'Here is the question on the board.',
  "Here is a new question, and I'll put it on the board.",
  // every I4 review example, verbatim
  "I'll mark the point (2, 3) on the graph.",
  "I'll note that x cannot be zero here.",
  "I'll treat x as a constant.",
  "I'll take that as our starting value, so a = 4.",
  "I'll move on to the second step: subtract 3 from both sides.",
  "The answer is 12, so I'll write it next to the box.",
  "The question is about speed, so I'll draw a distance-time graph.",
  "Here is the next equation, 3x - 5 = 10, and I'll put it on the board.",
  'Here is the question on the board: what is 7 times 8?',
]) check(`I4 kept on a STUDENT turn: "${t}"`, !isMetaNarration(t));

// ─── Task 21 §A (GDI run 9, 88 s): runtime notes cited on a STUDENT turn ───
const RYOTA = { personaName: ['Ryota Tanaka', 'Ryota'] };
for (const t of [
  "The pace preference says to slow down, so I'll stay on this one idea and check their understanding before moving on.",
  "I'll stay on this one idea for a moment.",
  'The level note says the student is intermediate.',
  'The lesson pointers want a follow-up question next.',
  'The runtime directive tells me to move on.',
]) check(`§A dropped on a student turn: "${t}"`, isMetaNarration(t) && stripNoteCitationClause(t) === '');
// fix round 1: "<Name> here." only for the persona's own name
check('§A r1 "Ryota here." dropped with personaName Ryota', isMetaNarration('Ryota here.', RYOTA) && stripNoteCitationClause('Ryota here.', RYOTA) === '');
check('§A r1 "Ryota here." kept without a persona name (rule off)', !isMetaNarration('Ryota here.') && stripNoteCitationClause('Ryota here.') === 'Ryota here.');
for (const t of ['Careful here!', 'Same here.', 'Five here.', 'Look here.', 'Exactly here.']) {
  check(`§A r1 kept with personaName Ryota: "${t}"`, !isMetaNarration(t, RYOTA) && stripNoteCitationClause(t, RYOTA) === t);
}
for (const t of [
  'The pace of the story speeds up in chapter two.',
  'Here is the plan for today.',
  'The lesson today is about the past simple.',
  'The teacher says hello to the class every morning.',
  'Ryota here is a great salesperson.',
  "「洗濯機を売っています」と、会社での仕事を一文で言えましたね。",
  'Next I\'d like to hear your main responsibilities.',
]) check(`§A kept: "${t}"`, !isMetaNarration(t, RYOTA) && stripNoteCitationClause(t, RYOTA) === t);
check('§A colon continuation keeps its content',
  stripNoteCitationClause('The lesson note says: what do you do every day at work?') === 'What do you do every day at work?');
check('§A r1 "I\'ll stay on this one idea: what is 3 + 4?" keeps the question',
  stripNoteCitationClause("So I'll stay on this one idea: what is 3 + 4?") === 'What is 3 + 4?' && !isMetaNarration("So I'll stay on this one idea: what is 3 + 4?"));
for (const t of [
  'The lesson note says the word "because" is useful here.',
  'The plan note says "Tell me about your last project at work."',
  'The lesson note says: "Tell me about your last project at work."',
]) check(`§A r1 a continuation opening with a quote leaves the sentence unchanged: "${t}"`, stripNoteCitationClause(t) === t && !isMetaNarration(t));
check('§A a short colon tail is still citation', stripNoteCitationClause('The pace note says: slow down.') === '');
{
  const vtr = fs.readFileSync(path.join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('§A VTR strips the note citation on every turn, before the nudge clause',
    /if \(typeof ev\.text === 'string'\) \{[\s\S]{0,400}?const noteStripped = stripNoteCitationClause\(ev\.text, \{ personaName: personaNamesRef\.current \}\);/.test(vtr)
    && vtr.indexOf('stripNoteCitationClause(ev.text') < vtr.indexOf('stripNudgePlanClause(ev.text)'));
  check('§A r1 VTR passes the persona name(s) to isMetaNarration', vtr.includes('personaName: personaNamesRef.current,')
    && vtr.includes('[teacherPersona.name, teacherFirstName(teacherPersona.name)]'));
}

// ─── Task 22 §C (GDI run 10, 299 s SPOKEN): persona-name narration lead ───
check('§C 22 the 299 s line loses its "Ryota explains:" lead',
  stripNoteCitationClause('Ryota explains: "I have worked at Nagoya Corporation for three years" is the natural form when speaking.', RYOTA)
    === '"I have worked at Nagoya Corporation for three years" is the natural form when speaking.');
check('§C 22 "Ryota says: let\'s try it." → "Let\'s try it."', stripNoteCitationClause("Ryota says: let's try it.", RYOTA) === "Let's try it.");
check('§C 22 full name lead', stripNoteCitationClause('Ryota Tanaka notes, the past simple fits here.', RYOTA) === 'The past simple fits here.');
check('§C 22 a lead-only sentence → \'\' (and meta)', stripNoteCitationClause('Ryota explains:', RYOTA) === '' && isMetaNarration('Ryota explains:', RYOTA));
check('§C 22 a non-persona name untouched', stripNoteCitationClause('Ken says hello.', RYOTA) === 'Ken says hello.' && !isMetaNarration('Ken says hello.', RYOTA));
check('§C 22 no personaName → untouched', stripNoteCitationClause("Ryota says: let's try it.") === "Ryota says: let's try it.");
check('§C 22 "Ryota here." rule unchanged', stripNoteCitationClause('Ryota here.', RYOTA) === '');
check('§C 22 a name not at the start untouched', stripNoteCitationClause('Well, Ryota says the meeting is at three.', RYOTA) === 'Well, Ryota says the meeting is at three.');

// ─── Task 22 §D1 (GDI run 10, 1138 s): segment-close plan narration ───
for (const t of [
  'Let me close out the pronunciation part and move to the summary.',
  'Before I give one, the pronunciation result shows "for" and "our" as the sounds to work on, so I\'ll keep that point in mind.',
  'Let me wrap up this grammar section now, and go on to the conversation.',
  "The student found the past simple hard, so I'll keep it noted.",
]) check(`§D1 22 dropped on any turn: "${t}"`, stripNoteCitationClause(t) === '' && isMetaNarration(t));
for (const t of [
  'Let me close the window and move to the next slide.',
  'Keep that point in mind for the exam.',
  "Let me finish this sentence and move to the next one.",
]) check(`§D1 22 untouched: "${t}"`, stripNoteCitationClause(t) === t && !isMetaNarration(t));

// ─── Task 22 fix round 1 (m6, m7) ───
check('m6 "Ryota asks you to say it once more." untouched', stripNoteCitationClause('Ryota asks you to say it once more.', RYOTA) === 'Ryota asks you to say it once more.');
check('m6 "Ryota suggests that we try again." untouched', stripNoteCitationClause('Ryota suggests that we try again.', RYOTA) === 'Ryota suggests that we try again.');
check('m6 "Ryota asks: what did you sell?" → the question', stripNoteCitationClause('Ryota asks: what did you sell?', RYOTA) === 'What did you sell?');
check('m6 a quote after "asks" loses the lead', stripNoteCitationClause('Ryota asks "What did you sell?"', RYOTA) === '"What did you sell?"');
check('m7 "You prefer short sentences, so I\'ll keep that in mind." → "You prefer short sentences."',
  stripNoteCitationClause("You prefer short sentences, so I'll keep that in mind.") === 'You prefer short sentences.');
check('m7 the run-10 sentence (quoted "our" is no address) still → \'\'',
  stripNoteCitationClause('Before I give one, the pronunciation result shows "for" and "our" as the sounds to work on, so I\'ll keep that point in mind.') === '');

// ── Task 23 §H: third-person learner reference and plan tails (GDI run 11, 555 s) ──
{
  const S1 = 'Their sentence, "I met a customer from the USA last year," is correct, but the question on the board is still about business events, so I\'ll bring that back.';
  const S2 = 'The question I\'m asking now is: did you attend any business events or exhibitions last year?';
  check('23H: 555 s sentence 1 → second person, plan tail gone', stripNoteCitationClause(S1) === 'Your sentence, "I met a customer from the USA last year," is correct, but the question on the board is still about business events.', stripNoteCitationClause(S1));
  check('23H: 555 s sentence 2 → the question', stripNoteCitationClause(S2) === 'Did you attend any business events or exhibitions last year?', stripNoteCitationClause(S2));
  check('23H: neither is then dropped as meta narration', !isMetaNarration(stripNoteCitationClause(S1)) && !isMetaNarration(stripNoteCitationClause(S2)));
  check('23H1: "The student\'s answer" / "The learner\'s words" / "Their reply" → Your …',
    stripNoteCitationClause("The student's answer is clear.") === 'Your answer is clear.'
    && stripNoteCitationClause('The learner’s answer needs one more word.') === 'Your answer needs one more word.'
    && stripNoteCitationClause('Their reply sounds complete.') === 'Your reply sounds complete.');
  check('23H1: "Their manager said no." untouched (not sentence / answer / words / reply)', stripNoteCitationClause('Their manager said no.') === 'Their manager said no.');
  check('23 r1 m10: "Their answer arrived by email." stays; an evaluated / quoted one is rewritten',
    stripNoteCitationClause('Their answer arrived by email.') === 'Their answer arrived by email.'
    && stripNoteCitationClause('The student\'s reply came late.') === 'The student\'s reply came late.'
    && stripNoteCitationClause('Their sentence sounds natural.') === 'Your sentence sounds natural.');
  check('23 r2 m2: descriptive was / were stay third person', stripNoteCitationClause('Their reply was quick, so you won the contract.') === 'Their reply was quick, so you won the contract.'
    && stripNoteCitationClause('Their words were kind, and you thanked them.') === 'Their words were kind, and you thanked them.');
  check('23H1: mid-sentence "their sentence" untouched', stripNoteCitationClause('Ask them to read their sentence aloud.') === 'Ask them to read their sentence aloud.');
  check('23H2: "So the question is:" / "Now the question is:" leads go', stripNoteCitationClause('So the question is: what did you sell?') === 'What did you sell?'
    && stripNoteCitationClause('Now, the question is: where did you go?') === 'Where did you go?');
  check('23H2: a bare lead with nothing after it stays', stripNoteCitationClause('So the question is:') === 'So the question is:');
  check('23H2: "bring it back" tail on its own sentence head', stripNoteCitationClause('That is a good point, so I\'ll bring it back to the card.') === 'That is a good point.');
  check('23H2: "bring back" without the so I\'ll plan untouched', stripNoteCitationClause('Please bring that back tomorrow.') === 'Please bring that back tomorrow.');
}

// ── Task 24 §A5 / §B1 (GDI run 12) ──
{
  const A = 'The transcript shows only the sentence itself, so I can check the words but not how they sounded.';
  const B = "The last resort says the sentence wasn't captured, so I'll check the words only.";
  check('24A5: 1092 s capture narration → dropped', stripNoteCitationClause(A) === '' && isMetaNarration(A));
  check('24A5: last-resort narration → dropped', stripNoteCitationClause(B) === '' && isMetaNarration(B));
  check('24 r1 m-2: "I can hear your th sounds clearer." untouched', stripNoteCitationClause('I can hear your th sounds clearer.') === 'I can hear your th sounds clearer.' && !isMetaNarration('I can hear your th sounds clearer.'));
  check('24 r1 m-2: "I can check the words but not how they sounded." → dropped', stripNoteCitationClause('I can check the words but not how they sounded.') === '');
  check('24 r1 m-2: "I can tell the words are linked well." untouched', stripNoteCitationClause('I can tell the words are linked well.') === 'I can tell the words are linked well.');
  check("24 r1 m-2: \"I can't judge how the words sounded.\" → dropped", stripNoteCitationClause("I can't judge how the words sounded.") === '');
  check('24A5: "The sentence is clear." untouched', stripNoteCitationClause('The sentence is clear.') === 'The sentence is clear.' && !isMetaNarration('The sentence is clear.'));
  check('24A5: "Please write the transcript of the meeting." untouched', stripNoteCitationClause('Please write the transcript of the meeting.') === 'Please write the transcript of the meeting.' && !isMetaNarration('Please write the transcript of the meeting.'));
  const S = 'The student said "I have worked at Nagoya Corporation for 3 years," which is correct, with the number written as a digit.';
  const R = 'You said "I have worked at Nagoya Corporation for 3 years," which is correct, with the number written as a digit.';
  check('24B1: 352 s "The student said "…"" → "You said "…"", then spoken', stripNoteCitationClause(S) === R && !isMetaNarration(R), stripNoteCitationClause(S));
  check('24B1: "The learner said that …" → "You said that …"', stripNoteCitationClause('The learner said that it was late.') === 'You said that it was late.');
  check('24B1: "The student said nothing." still dropped', stripNoteCitationClause('The student said nothing.') === 'The student said nothing.' && isMetaNarration('The student said nothing.'));
}

// ── Task 25 §A (GDI run 13) ──
{
  const spoken = [
    'Keep it brief and use Japanese for the explanation, as the session asks.',
    "The sentence is not complete yet, so I'll ask them to finish it.",
    'The board already shows the model sentence.',
    'That sentence is already on the board.',
    'Here is the rest of the summary.',
  ];
  for (const x of spoken) check(`25A1–A4: "${x}" → dropped`, isMetaNarration(x));
  for (const x of ["I'll ask you one more question.", "Let's put it on the board.", 'Here is the next question.', 'Look at the board.', 'The board shows two sentences: one past, one present.']) {
    check(`25A1–A4: "${x}" kept`, !isMetaNarration(x));
  }
  check('25A1: "as the lesson says" anywhere → dropped', isMetaNarration('Two short sentences, as the lesson says.'));
  check('25A2: "I will help the learner" → dropped', isMetaNarration('Next I will help the learner with the past tense.'));
  for (const x of ['It already has a verb.', 'It already has the past tense, so it is correct.']) check(`25 r1 m-1: "${x}" kept`, !isMetaNarration(x));
  check('25 r1 m-1: "It already shows the model sentence." dropped', isMetaNarration('It already shows the model sentence.'));
  check('25A5: persona label stripped', stripLeakedLabels('Ryota: 「International customers」の部分', ['Ryota Tanaka', 'Ryota']) === '「International customers」の部分');
  check('25A5: persona label, full-width colon, case-insensitive', stripLeakedLabels('ryota：過去完了を使うつもりなんですね。', ['Ryota']) === '過去完了を使うつもりなんですね。');
  check('25A5: "Question: What do you do?" untouched', stripLeakedLabels('Question: What do you do?') === 'Question: What do you do?' && stripLeakedLabels('Question: What do you do?', ['Ryota']) === 'Question: What do you do?');
  check('25A5: "Ryota: hello" with no names untouched', stripLeakedLabels('Ryota: hello') === 'Ryota: hello');
  check('25 r1 I-1: with no names known nothing is stripped (persona label before a quote too)', stripLeakedLabels('Ryota: 「Great work today」です。') === 'Ryota: 「Great work today」です。');
  for (const x of ['Say: "I have worked here for five years."', 'Listen: 「I have worked here」', 'Perfect: "I went there yesterday."', 'Remember: "a" goes before a vowel.', 'Example: 「I work in sales」']) {
    check(`25 r1 I-1: "${x}" untouched (no names, and names known)`, stripLeakedLabels(x) === x && stripLeakedLabels(x, ['Ryota Tanaka', 'Ryota']) === x);
  }
  check('25 r1 I-1: persona label with a quote still stripped when names are known', stripLeakedLabels('Ryota: 「Great work today」です。', ['Ryota']) === '「Great work today」です。');
  check('25A5: "*opener*" label still stripped', stripLeakedLabels('*opener* はい、始めましょう。') === 'はい、始めましょう。');
  check('25A5: another name is not a persona label', stripLeakedLabels('Ken: hello', ['Ryota']) === 'Ken: hello');
}

{
  // Task 27 §D1 (GDI run 14, 854 / 885 s): the continuation / retry turn spoke its directive.
  const spoken = [
    "Hmm, I need to be careful: the last thing I said was a correction, so I'd like you to say the sentence again.",
    'Confirm plainly and move on: the next question is about how the project went, and it\'s a good moment to ask a short follow-up about the result.',
    'I have to be careful here.',
    'The last thing I said was a question.',
    'Acknowledge briefly: the student answered.',
    'Reply in one sentence: say it is right.',
    "The next question is about the result, so it's time to ask it.",
    "Now it's a good moment to ask about the result.",
  ];
  for (const x of spoken) check(`27D1: "${x}" → dropped`, isMetaNarration(x));
  check('27 r1 m-4: an imperative lead with a question after the colon is kept', !isMetaNarration('Reply in one sentence: what did you do?'));
  for (const x of ['Could you try it once more?', 'Now, how did people respond to your email?', 'Be careful with the article.', 'Please be careful with "the".', 'The next question is about your project.', 'Confirm your answer with a full sentence.']) {
    check(`27D1: "${x}" kept`, !isMetaNarration(x));
  }
}

{
  // Task 28 §C (GDI run 15, 374 s / 461 s): the idle-nudge turn spoke its note; a staging line before a repeat ask.
  for (const x of ['Acknowledge it briefly, then move on to the next item.', 'The board card is up.', 'The card is ready.', 'Confirm the answer in one sentence and ask the next question.', 'Then move on to the next question.'])
    check(`28C: "${x}" → dropped`, isMetaNarration(x));
  for (const x of ["Let's move on to the next part.", 'You can move on to the next question.', "Here's the next question.", 'Here is the next question.', 'Could you tell me one skill you have learned at your company?', 'We can move on to the next step now.'])
    check(`28C: "${x}" kept`, !isMetaNarration(x));
  // the nudge note's first line: silent, nothing to acknowledge (fix round 1, I-3: the action by state)
  for (const d of [IDLE_NUDGE_DIRECTIVE, idleNudgeDirective({ v2: true }), idleNudgeDirective({ v2: true, hasOpenQuestion: false })]) {
    const first = d.split(/(?<=\.)\s/)[0];
    check('28C: nudge note leads with silent + nothing to acknowledge', /student has been silent/.test(first) && /nothing to acknowledge, so no acknowledgement and no praise\./.test(first));
    check('28C r1: no bare "re-ask the open question" order', !/RE-ASK the open question/.test(d));
    check('28C r1: "earlier explanations", not "earlier content"', /Do not repeat or summarize earlier explanations/.test(d) && !/earlier content/.test(d));
    // a bracketed directive is never an already-answered complaint ("…the same question back…")
    check('28C: the nudge directive is not an already-answered complaint', !saysAlreadyAnswered(d));
  }
  check('28C r1 v1: open question → re-ask, repeat only the question; else the next small step',
    IDLE_NUDGE_DIRECTIVE.includes('If your last turn asked a question, re-ask it in ONE short sentence — repeat only the question, no new content — or softly offer a choice: a hint, or more time.')
    && IDLE_NUDGE_DIRECTIVE.includes('If it ended without a question, offer the next small step.'));
  check('28C r1 v2 default: re-ask or the hint / more-time offer',
    idleNudgeDirective({ v2: true }).includes('In ONE short sentence, re-ask it — repeat only the question, no new content — or offer a choice: more time, or a hint.'));
  check('28C r1 v2 no open question: re-offer the choice, no re-ask, no hint',
    idleNudgeDirective({ v2: true, hasOpenQuestion: false }).includes('Re-offer the choice or next step you last asked about, in different words, in one short sentence.')
    && !idleNudgeDirective({ v2: true, hasOpenQuestion: false }).includes('re-ask it') && !idleNudgeDirective({ v2: true, hasOpenQuestion: false }).includes('STILL OUTSTANDING'));
  check('28C: a real complaint still is', saysAlreadyAnswered('Same question again?') && saysAlreadyAnswered('I already said that.'));
}

{
  // Task 28 fix round 1 (I-2, m-3): the "move on" drop only takes a sentence that is nothing but the order.
  for (const x of ['Acknowledge briefly, then move on.', 'Then move on to the next question.', 'Move on to the next item.', 'Praise the answer and continue.', 'The card is up on the board.', 'The board card is up now.'])
    check(`28C r1: "${x}" → dropped`, isMetaNarration(x));
  for (const x of ['Move on to the next step and divide both sides by 2.', 'Nice work, now move on to the next part of the problem.', 'Time to move on to the next question.', 'Perfect! Time to move on to the next question.',
    'Let us move on to the next part.', 'You can move on to the next question.', 'OK, I will move on to the next question.', "Let's move on to the next part."])
    check(`28C r1: "${x}" kept`, !isMetaNarration(x));
}

// Task 29 §B (GDI run 16, 693 s): the offer note narrated — whole sentence dropped.
{
  const narrated = "Since the past simple segment is complete, I'll close it in one sentence and ask whether they want one more practice sentence or to move on.";
  check('29B: the 693 s note-state + plan sentence dropped', isMetaNarration(narrated));
  for (const x of [
    'Because this part is done, I will move to the next one.',
    'Now that the step was finished, the note is done.',
    "I'll check if the student wants another one.",
    "I'll see whether they need a hint.",
    "Next I'll give an example, since they would like one.",
  ]) check(`29B: "${x}" dropped`, isMetaNarration(x) && isNotePlanNarration(x));
  check("29B (c): I'll … they would like dropped", isMetaNarration("I'll give them an example they would like."));
  for (const x of [
    'The natural version would be "I met companies that could buy robots for Nagoya."',
    'They want to buy robots.',
    'Since you finished the first part, well done.',
    "I'll ask you one more question.",
  ]) check(`29B: "${x}" kept`, !isMetaNarration(x));
  // the board-staging line keeps its own handling (not this rule)
  check("29B: \"I'll put a sentence on the board\" is not this rule's", !isNotePlanNarration("I'll put a sentence on the board for you."));
}

// Task 29 fix round 1 (I-3): quoted model sentences and a spoken close addressed to the student are kept.
for (const x of [
  'A natural way to say it is: "I\'ll ask the customer if they need any help."',
  '"I\'ll check if they want a discount." Can you say that?',
  'Try this sentence: "When the project is done, I\'ll see if they need more support."',
  "Since this part is complete, let's move on to the past simple.",
  "Now that this part is done, let's move on to the conversation.",
]) {
  check(`29B r1: "${x}" not note narration`, !isNotePlanNarration(x));
  check(`29B r1: "${x}" kept`, !isMetaNarration(x));
}
check('29B r1: the 693 s sentence still dropped', isMetaNarration("Since the past simple segment is complete, I'll close it in one sentence and ask whether they want one more practice sentence or to move on."));

// Task 29 fix round 2 (N-3): a single-quoted model sentence is speech; apostrophes in words untouched.
check("29B r2: single-quoted model kept", !isNotePlanNarration("A natural way to say it is: 'I'll ask the customer if they need any help.'"));
check("29B r2: … and not meta narration", !isMetaNarration("A natural way to say it is: 'I'll ask the customer if they need any help.'"));
check("29B r2: an unquoted plan with apostrophes still dropped", isNotePlanNarration("I'll check if the student's ready, and I'll ask whether they want more."));
check("29B r2: a short single-quoted word is not blanked", isNotePlanNarration("I'll ask whether they know 'ago'."));

// Task 30 §E1 / §E2 (GDI run 17, 409 s / 1289 s): plan clauses, third-person residue, judging narration.
{
  const S409 = 'Your reply, "It has helped me present to my boss," is a repeat of the sentence I gave them, so the correct response here is to name what was right and move on.';
  check('30E1: the 409 s sentence (as spoken) ⇒ dropped', isMetaNarration(S409) && isNotePlanNarration(S409));
  const RAW409 = 'The student\'s reply, "It has helped me present to my boss," is a repeat of the sentence I gave them, so I will praise it.';
  check('30E1: a rewritten citation still naming "them" ⇒ third-person residue, dropped', isThirdPersonResidue(RAW409) && stripNoteCitationClause(RAW409) === '' && isMetaNarration(RAW409));
  check('30E1: a rewrite with no residue keeps its content', stripNoteCitationClause('Their sentence, "I met a customer," is correct.') === 'Your sentence, "I met a customer," is correct.' && !isThirdPersonResidue('Their sentence, "I met a customer," is correct.'));
  check('30E1: "them" inside the quote is no residue', !isThirdPersonResidue('Their sentence, "I gave them sweets," is correct.'));
  check('30E1: no rewrite ⇒ never residue ("Tell them about your project.")', !isThirdPersonResidue('Tell them about your project.') && !isMetaNarration('Tell them about your project.'));
  for (const kept of ['Your sentence is correct, and it uses the present perfect.', "Let's move on to the past simple.", 'The sentence is right.', 'You should say it with the past simple.']) {
    check(`30E: "${kept}" kept`, !isMetaNarration(kept) && !isNotePlanNarration(kept));
  }
  check('30E1: "so I should move on" ⇒ dropped', isNotePlanNarration('That answer is fine, so I should move on.'));
  check('30E1: a teaching "so I should expect" ⇒ kept', !isNotePlanNarration("When charges are alike they're repelled, so I should expect them to move apart."));
  check('30E1: "I should just acknowledge" ⇒ dropped', isNotePlanNarration('I should just acknowledge it and continue.'));
  const S1289 = 'The sentence matches the model, and the stutter at the start is only a repeat, so the sentence itself is right.';
  for (const kept of [
    'When a customer complains, the best response is to apologise first.',
    'In a meeting, the correct reply is to thank them.',
    'The right thing is to practise a little every day.',
    'For example, I should move to a bigger office.',
    'The filler "um" is only a habit.',
  ]) check(`30E r1 (I-2): "${kept}" kept`, !isNotePlanNarration(kept) && !isMetaNarration(kept));
  check('30E r1: "so the best next step is to" ⇒ dropped', isNotePlanNarration('That is fine, so the best next step is to ask one more question.'));
  check('30E r1: "I should accept their answer" ⇒ dropped', isNotePlanNarration('I should accept their answer and continue.'));
  check('30E2: the 1289 s sentence ⇒ dropped', isNotePlanNarration(S1289) && isMetaNarration(S1289));
  check('30E2: "the hesitation doesn\'t count" ⇒ dropped', isNotePlanNarration("The hesitation doesn't count, so it's correct."));
  check('30E2: the repeat_after_correct directive forbids explaining the judgement', REPEAT_AFTER_CORRECT_REASON.includes('Say that it is right and go on; do not explain how you judged it (no talk of stutters, repeats, matching the model, or what counts).'));
  const VTR30 = fs.readFileSync(path.join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('30E1: VTR logs meta_narration_dropped_third_person_residue', VTR30.includes("onDebugEvent?.('meta_narration_dropped_third_person_residue',"));
}

// Task 30 §F1 (GDI run 17, 688 s): a near-copy of the sentence just before it.
{
  check('30F1: the 688 s pair ⇒ the second dropped', isAdjacentDuplicate("Let's move on to the next part now.", "Let's go on to the next part."));
  check('30F1: "Good." / "Good job." ⇒ kept (under 3 content tokens)', !isAdjacentDuplicate('Good.', 'Good job.'));
  check('30F1: "Say it again." / "Say it once more." ⇒ kept (the normaliser does not fold again / once more)', !isAdjacentDuplicate('Say it again.', 'Say it once more.'));
  for (const [a, b] of [
    ['I have worked here for five years.', 'I worked here for five years.'],
    ['I have lived in Nagoya for three years.', 'I lived in Nagoya for three years.'],
    ['She has finished the report.', 'Has she finished the report?'],
    ['Are you a teacher?', 'You are a teacher.'],
    ['2 times 3 is 6.', '3 times 2 is 6.'],
    ['I have work at Toyota for five years.', 'I have worked at Toyota for five years.'],
    ['Listen: "I was responsible for communicating with our customers."', '"I was responsible for communicating with our customers."'],
  ]) check(`30F1 r1 (I-1): "${a}" / "${b}" ⇒ kept`, !isAdjacentDuplicate(a, b));
  check('30F1 r1: a filler-only difference ⇒ dropped', isAdjacentDuplicate('Okay, let\'s look at the board.', 'Let\'s look at the board now.'));
  check('30F1: different content ⇒ kept', !isAdjacentDuplicate("Let's move on to the next part now.", 'Tell me one more thing about a past event.'));
  check('30F1: no previous sentence ⇒ kept', !isAdjacentDuplicate('', "Let's go on to the next part."));
  const VTRF = fs.readFileSync(path.join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('30F1: VTR drops it per sentence, after the continuation duplicate check', /continuation_duplicate_dropped[\s\S]{0,300}?if \(TUTOR_ADJACENT_DUPLICATE_DROP && isAdjacentDuplicate\(adjacentPrevSentence, updatedSentence\)\) \{\s*onDebugEvent\?\.\('adjacent_duplicate_sentence_dropped',[\s\S]{0,200}?continue;\s*\}\s*adjacentPrevSentence = updatedSentence;/.test(VTRF));
}

// Task 30 fix round 1 S2 (smoke run 334 s): a spoken multi-clause plan; a plan that continues after a dropped narration.
{
  const S334 = 'Gently point that out, model the pattern, and ask for one sentence starting with "I have worked".';
  check('S2: the 334 s sentence ⇒ dropped (≥ 2 plan clauses, unaddressed)', isImperativePlanSentence(S334) && isMetaNarration(S334));
  check('S2: … and a plan continuation after a dropped sentence', isPlanContinuationSentence(S334));
  for (const kept of ['Point to the board and read the sentence.', 'Try starting with "I have worked", and tell me about your work on the product launch.', 'Good example.', "That's about the past, though, so let's use the present perfect."]) {
    check(`S2: "${kept}" kept`, !isImperativePlanSentence(kept) && !isMetaNarration(kept) && !isPlanContinuationSentence(kept));
  }
  check('S2: a single plan-verb sentence is only a continuation (not dropped alone)', !isMetaNarration('Model the pattern once.') && isPlanContinuationSentence('Model the pattern once.'));
  const VS2 = fs.readFileSync(path.join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('S2: VTR drops the continuation after a dropped narration sentence', /prevSentenceDroppedAsNarration = true;\s*continue;\s*\}[\s\S]{0,400}?if \(prevSentenceDroppedAsNarration && isPlanContinuationSentence\(updatedSentence\)\) \{\s*onDebugEvent\?\.\('meta_narration_dropped_plan_continuation'/.test(VS2));
}

// Task 30 fix round 1 S7 (smoke run 508 s): "Let me ask again simply." is dropped.
check('S7: "Let me ask again simply." ⇒ dropped', isMetaNarration('Let me ask again simply.'));
check('S7: "Let me put it another way." ⇒ dropped', isMetaNarration('Let me put it another way.'));
check('S7: "Let me say that sentence for you: "I have worked here."" ⇒ kept', !isMetaNarration('Let me say that sentence for you: "I have worked here."'));
check('S7: "Let me ask you about your job." ⇒ kept', !isMetaNarration('Let me ask you about your job.'));

// Task 30 fix round 2 (N-1): an adverb lead alone is not a plan continuation; first-person plans are.
{
  for (const kept of ['Exactly, that is right.', 'Actually, that works.', 'Then the meeting started.', 'Usually we say it this way.']) {
    check(`N-1: "${kept}" is not a plan continuation`, !isPlanContinuationSentence(kept));
  }
  check('N-1: the r1 1438 s sentence is a continuation', isPlanContinuationSentence("So I'll gently ask again, in one short question, and give a starter from the board."));
  check('N-1: the r1 616 s "I\'ll point out that one word." is a continuation', isPlanContinuationSentence("I'll point out that one word."));
  check('N-1: an addressed first-person line is not ("I\'ll give you a starter.")', !isPlanContinuationSentence("I'll give you a starter."));
  check('N-1: the 334 s plan sentence still is', isPlanContinuationSentence('Gently point that out, model the pattern, and ask for one sentence starting with "I have worked".'));
  const VN1 = fs.readFileSync(path.join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('N-1: VTR resets the flag after one dropped continuation', /'meta_narration_dropped_plan_continuation', updatedSentence\.slice\(0, 80\)\);\s*\/\/[^\n]*\n\s*prevSentenceDroppedAsNarration = false;\s*continue;/.test(VN1));
}

// Task 30 fix round 2 (E2, r1 616 s): the learner's "earlier version" named in the third person.
{
  const S616 = 'Their earlier version was "I have work", and now they say "I have work for this company for five years", which still has "work" instead of "worked".';
  check('E2: the 616 s sentence ⇒ rewritten, the "they" residue drops it whole', isThirdPersonResidue(S616) && stripNoteCitationClause(S616) === '' && isMetaNarration(S616));
  check('E2: a residue-free rewrite keeps its content', stripNoteCitationClause('The student\'s latest attempt is "I have worked here for five years."') === 'Your latest attempt is "I have worked here for five years."');
  check('E2: "They sell washing machines in Osaka." kept', !isMetaNarration('They sell washing machines in Osaka.') && !isThirdPersonResidue('They sell washing machines in Osaka.'));
  check('E2: descriptive "Their reply was quick, so you won the contract." kept', !isMetaNarration('Their reply was quick, so you won the contract.'));
}

// Task 30 fix round 2 E1 (r1 148 s): the done-frame backfill of an all-dropped attempt is filtered.
{
  const T148 = 'The student\'s latest line is mostly my own sentence read back, so I should check what they actually said. I\'ll ask them to try the full sentence again with "made" in it.';
  check('E1: the 148 s backfill ⇒ nothing survives', filterNarrationText(T148) === '');
  check('E1: real speech in the backfill survives', filterNarrationText('Ryota here. Good, that is right. Could you say it once more?', { personaName: ['Ryota'] }) === 'Good, that is right. Could you say it once more?');
  const VE1 = fs.readFileSync(path.join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('E1 / P-2: VTR leaves the done text to doneTurnText', VE1.includes('const doneText = doneTurnText({') && VE1.includes('streamSentencesThisAttempt += 1;'));
}

// Task 30 fix round 2 E4 (r1 63 s): the brain's board instruction to itself.
check('E4: "Please show this one on the board." ⇒ dropped', isMetaNarration('Please show this one on the board.'));
check('E4: "Put the sentence up on the board." ⇒ dropped', isMetaNarration('Put the sentence up on the board.'));
check('E4: "Look at the board." kept', !isMetaNarration('Look at the board.'));
check('E4: "Read the question on the board." kept', !isMetaNarration('Read the question on the board.'));

// Task 30 fix round 3 (P-2): the done text — no backfill after stream drops; the full chain otherwise.
{
  const T148 = 'The student\'s latest line is mostly my own sentence read back, so I should check what they actually said. I\'ll ask them to try the full sentence again with "made" in it.';
  check('P-2: kept sentences win', doneTurnText({ attemptText: 'Good. ', fullText: T148, streamSentences: 3, filter: true }) === 'Good.');
  check('P-2: stream sentences all dropped ⇒ nothing (no backfill)', doneTurnText({ attemptText: '', fullText: 'Exactly, that is right. Their reply is "OK", so I will praise it.', streamSentences: 2, filter: true }) === '');
  check('P-2: no stream sentence ⇒ the filtered backfill', doneTurnText({ attemptText: '', fullText: 'Good, that is right. Could you say it once more?', streamSentences: 0, filter: true }) === 'Good, that is right. Could you say it once more?');
  check('P-2: the backfill applies the plan-continuation rule', filterNarrationText("The student repeated the sentence I gave them. I'll point out that one word. Please say it once more.") === 'Please say it once more.');
  check('P-2: flag off ⇒ the old backfill', doneTurnText({ attemptText: '', fullText: T148, streamSentences: 2, filter: false }) === T148);
}

// Task 30 fix round 3 (R2-1, run r2): first-person plans wherever they stand; plan leads / tails stripped.
{
  check('R2-1: 195 s "Those notes are internal, …" ⇒ dropped', isMetaNarration("Those notes are internal, so I'll just respond to what you said."));
  check('R2-1: 172 s "I\'ll ask it again, more simply." ⇒ dropped', isMetaNarration("I'll ask it again, more simply."));
  const S259 = 'No. They only said "OK, thank you" and repeated an earlier sentence, so I\'ll ask the question again, simply.';
  check('R2-1: 259 s ⇒ dropped (learner narration), also after its plan tail is stripped', isMetaNarration(S259) && isMetaNarration(stripNoteCitationClause(S259)));
  check('R2-1: 230 s plan lead stripped, the question kept', stripNoteCitationClause('Ask again, simply: if you have given a presentation many times, which tense would you use?') === 'If you have given a presentation many times, which tense would you use?');
  check('R2-1: 852 s plan tail stripped, the head kept', stripNoteCitationClause("You said the same sentence as before, so I'll note that and ask again.") === 'You said the same sentence as before.');
  for (const kept of ["I'll give you an example.", 'They said the price was too high.', 'Let me explain.']) check(`R2-1: "${kept}" kept`, !isMetaNarration(kept) && stripNoteCitationClause(kept) === kept);
}

// Task 30 fix round 4 (Q-1): rule (a) is the PLAN SHAPE only — content after the plan verb keeps the sentence.
{
  for (const kept of [
    'Let me point out that the slope is negative.',
    "I'll point to the second term.",
    "I'll model the first step: subtract 3 from both sides.",
    "I'll model the sentence first: I went to Osaka.",
    'Let me name the angles: A, B and C.',
    "I'll accept either form.",
    'Let me respond to that: yes, it works.',
    "I'll point out the common factor.",
  ]) check(`Q-1: "${kept}" kept`, !isMetaNarration(kept) && !isMetaNarration(kept, { structural: false }));
  for (const dropped of [
    "I'll ask it again, more simply.",
    "I'll ask the question again, simply.",
    "I'll just respond to what you said.",
    "I'll note that and ask again.",
    "I'll point that out.",
  ]) check(`Q-1: "${dropped}" dropped`, isMetaNarration(dropped));
}

// Task 30 fix round 4 (Q-2): the ", so I'll …" tail is stripped only in the plan shape (anaphora only, no you / your, colon, quote, digit).
{
  for (const kept of [
    'Nice work, so I\'ll ask you something harder: what do you do on weekends?',
    'That gives x = 4, so I\'ll check it: 4 + 1 = 5.',
    'Yes, so I\'ll ask you: what is your job?',
    'Good, so I\'ll give you a hint: start with the verb.',
    'Good, so I\'ll model it for you: I went to Osaka.',
    'Great, so I\'ll note your answer: you work in sales.',
  ]) check(`Q-2: "${kept}" unchanged`, stripNoteCitationClause(kept) === kept);
  check('Q-2: the 852 s tail still stripped', stripNoteCitationClause("You said the same sentence as before, so I'll note that and ask again.") === 'You said the same sentence as before.');
}

// Task 30 fix round 4 R3-7b: the lesson's closed state is never narrated.
{
  check('R3-7b: 1354 s "I\'m sorry, but I can\'t continue the lesson now, because it has already closed." ⇒ dropped', isMetaNarration("I'm sorry, but I can't continue the lesson now, because it has already closed."));
  check('R3-7b: "The lesson has already ended." ⇒ dropped', isMetaNarration('The lesson has already ended.'));
  check('R3-7b: "We cannot go on with the lesson today." ⇒ dropped', isMetaNarration('We cannot go on with the lesson today.'));
  for (const kept of ['The meeting had already ended when I arrived.', 'The shop had already closed.', 'Thank you for practicing with me today, Haruto.']) check(`R3-7b: "${kept}" kept`, !isMetaNarration(kept));
}

// Task 30 fix round 4 R3-4 (run r3 583 s): the last message quoted back, a cited instruction, "ask the choice once more".
{
  check('R3-4a: "Your last message is "Yes." after I offered a choice." ⇒ dropped', isMetaNarration('Your last message is "Yes." after I offered a choice.'));
  check('R3-4b: "Given the earlier instruction …, I\'ll ask the choice once more." ⇒ dropped', isMetaNarration("Given the earlier instruction to keep this short and wait for their answer, I'll ask the choice once more."));
  check('R3-4b: "As per the system note, we move on." ⇒ dropped', isMetaNarration('As per the system note, we move on.'));
  check('R3-4c: "I\'ll ask the choice once more." ⇒ dropped', isMetaNarration("I'll ask the choice once more."));
  check('R3-4c: "I\'ll name the options." ⇒ dropped', isMetaNarration("I'll name the options."));
  for (const kept of ['Following the rule, we add -ed to regular verbs.', 'Your last answer used the past simple correctly.', 'Given the time, which tense fits best?', "I'll offer you two choices: one more sentence, or the next part."]) check(`R3-4: "${kept}" kept`, !isMetaNarration(kept));
}

// Task 30 fix round 4 R3-2 (run r3 372 s): the same-question retry is never narrated.
{
  check('R3-2: "The question has come up three times now." ⇒ dropped', isMetaNarration('The question has come up three times now.'));
  check('R3-2: "This question has been asked a few times." ⇒ dropped', isMetaNarration('This question has been asked a few times.'));
  check('R3-2: "The question has two parts." kept', !isMetaNarration('The question has two parts.'));
}

// Task 30 fix round 4 R3-3 (run r3 155 s): the silent level tool is never announced.
{
  check('R3-3: "Before that, I\'ll note your level so the lesson fits you." ⇒ dropped', isMetaNarration("Before that, I'll note your level so the lesson fits you."));
  check('R3-3: "I\'ll set your level now." ⇒ dropped', isMetaNarration("I'll set your level now."));
  check('R3-3: "Your level of detail is great." kept', !isMetaNarration('Your level of detail is great.'));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
