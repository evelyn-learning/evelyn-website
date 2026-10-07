/**
 * The meta-narration filter drops brain sentences that leak internal
 * reasoning. portal-704e3e01 @1027.9s spoke a whole <result>…</result>
 * block aloud because the filter matched content phrases only.
 *
 * Usage: npx tsx scripts/test-meta-narration.ts  (npm run test:meta-narration)
 */
import fs from 'node:fs';
import path from 'node:path';
import { isMetaNarration, markCorrectionNoteWorking, createCorrectionWorkingTracker } from '../src/lib/tutor/voice/meta-narration';
import { isBareArithmeticRecheck } from '../src/lib/tutor/voice/arithmetic-recheck';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── the pre-existing phrase behaviour, pinned before it moved ───
check('"The student already solved this one."', isMetaNarration('The student already solved this one.'));
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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
