/**
 * Praise for a bare "yes" to a question that is not a yes/no question
 * (2026-10-05, 21 scripted Homework Help sessions on the GreenApple sandbox).
 *
 * Every (question, reply) pair below is from the recorded transcripts
 * (docs/whitelabel/greenapple/integration/tutor-sessions-2026-10-05/
 * transcripts/): the student typed only "yes". The previous tutor turn is
 * represented by its closing question and the reply by its opening words, as
 * recorded.
 *
 * Run: npx tsx scripts/test-bare-assent-praise.ts (npm run test:bare-assent-praise)
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  isBareAssent, classifyQuestion, openNonYesNoQuestion, opensWithAffirmingVerdict,
  shouldKillBareAssentPraise, bareAssentPraiseFeedback, shouldKillNonAnswerPraise,
} from '../src/lib/tutor/voice/nonanswer-praise';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };

/** [session, the tutor's previous turn (its closing question), the reply]. */
const KILL: Array<[string, string, string]> = [
  ['algebra-2', "Now put the two pieces together: you've got $x < 2$ and $x > -10$ — what's the combined solution look like?", 'Right — combining $x<2$ and $x>-10$ gives $-10 < x < 2$. That\'s the full solution to problem two.'],
  ['ap-biology', 'So let\'s bring it back to part (a): with that in mind, how would you now state the full answer to "what happens to water during dehydration synthesis"?', 'Exactly right. During dehydration synthesis, each time two monomers bond, one releases an *H* and the other an *OH*.'],
  ['ap-calculus-ab', 'What can we do with those?', 'Right. We can cancel the $x$ in the numerator with the $x$ in the denominator.'],
  ['ap-calculus-bc', "Now you've got an $x$ on top and an $x$ in the denominator too — what can you do with those?", 'Right — they cancel, leaving just $\\dfrac{1}{\\sqrt{x+4}+2}$.'],
  ['ap-environmental-science', "What's ten percent of forty?", 'Right. Ten percent of forty is four, so that\'s the energy reaching secondary consumers.'],
  ['ap-macroeconomics', 'Now, with that in mind — for part (b), which country has the comparative advantage in cars?', 'Right. Country A has the comparative advantage in cars, since it gives up less wheat to make one.'],
  ['ap-psychology', 'What do you think would need to be true about a stimulus for it to successfully trigger a new action potential during that relative window?', "Right — a stronger-than-usual stimulus is exactly what's needed."],
  ['ap-world-history', 'With most of it now under one Mongol authority, what do you think happens to the *danger and cost* of his trip?', 'Exactly. With one authority controlling the route, the danger drops sharply and the cost follows.'],
  ['geometry', '$5x + 5 = 90$, so what happens when you subtract $5$ from both sides?', 'Right. Subtracting $5$ from both sides gives $5x = 85$ — what do you get when you divide both sides by $5$?'],
  ['precalculus', "We're simplifying $\\dfrac{3x}{3}$ from problem 2, not problem 1's answer — $x$ over $x$, 3 cancels out to just what?", 'Right. $\\dfrac{3x}{3}$ simplifies to just $x$.'],
  ['world-history', "Can you now try pulling all of this into one or two sentences that answer part (a) fully — what's the full chain of cause and effect from the Republic's structure to Augustus becoming emperor?", "Right — the Republic's system relied on the Senate's authority, but once generals started personally paying so"],
];
for (const [session, prior, reply] of KILL) {
  assert(shouldKillBareAssentPraise('yes', reply, prior) === true, `${session}: "yes" to a wh-question + an affirming verdict → killed`);
  assert(shouldKillNonAnswerPraise('yes', reply) === false, `${session}: (the existing guard excludes a bare yes, by design)`);
}
// The other bare assents, and the opener forms named in the brief.
for (const s of ['yes', 'Yes.', 'yeah', 'yep', 'no', 'nope', 'ok', 'okay', 'um, yes', 'YES!']) {
  assert(isBareAssent(s) === true, `bare assent: "${s}"`);
  assert(shouldKillBareAssentPraise(s, 'Exactly right.', KILL[4][1]) === true, `"${s}" + "Exactly right." → killed`);
}
for (const opener of ['Right.', 'Right — it is four.', 'Exactly.', 'Exactly right. During…', 'Yes — exactly.', 'Yes, exactly. Both sides…', 'Nice work pulling that together.', "That's right.", "That's it!", 'Correct!', 'Perfect.', 'You got it.', 'Spot on.', 'Great job.', 'Well done!']) {
  assert(opensWithAffirmingVerdict(opener) === true, `verdict opener: "${opener}"`);
  assert(shouldKillBareAssentPraise('yes', opener, "What's ten percent of forty?") === true, `"yes" + "${opener}" → killed`);
}

// NOT killed: yes/no, readiness, offers, comprehension checks, tag and either/or questions.
const KEEP_QUESTIONS: Array<[string, string]> = [
  ['physics (recorded)', 'Both parts of this problem are solved — ready to move to problem two?'],
  ['ap-chemistry (recorded)', 'Want to try a fresh problem to practice this same empirical-to-molecular skill, or call it there for today?'],
  ['ap-english-language (recorded; a yes/no question)', 'Same test: would any reasonable person actually argue *against* this sentence?'],
  ['hs-english (recorded; either/or)', 'If I said *everybody* brought *their* phone, which pronoun actually agrees with *everybody* — *their*, or *his or her*?'],
  ['readiness', 'Ready?'],
  ['readiness', 'Ready for the next one?'],
  ['offer', 'Shall we try part (b)?'],
  ['offer', 'Should we check that by substituting back in?'],
  ['comprehension check', 'Does that make sense?'],
  ['comprehension check', 'Does that make sense so far, or should I go over the middle step again?'],
  ['yes/no', 'Is 42 above the upper fence?'],
  ['yes/no', 'So, do you see why the sign flips?'],
  ['yes/no', 'Can you tell me what 10 times 3 gives?'],
  ['yes/no', 'Do you know what the denominator becomes?'],
  ['tag', 'So the slope is positive, right?'],
  ['tag', "That gives us 5x = 85, doesn't it?"],
  ['offer', 'Would you like a hint?'],
  ['offer', 'Want me to show the first step?'],
  ['mixed: a readiness question earlier in the turn', 'Does that make sense? What do you get when you divide both sides by 5?'],
  ['mixed: an offer after the wh-question', 'What do you get when you divide both sides by 5? Or shall I show you?'],
];
for (const [label, q] of KEEP_QUESTIONS) {
  assert(shouldKillBareAssentPraise('yes', 'Right. Here we go.', q) === false, `not killed — ${label}: "${q.slice(0, 60)}"`);
  assert(shouldKillBareAssentPraise('no', 'Exactly.', q) === false, `not killed ("no") — ${label}`);
}
assert(shouldKillBareAssentPraise('yes', 'Exactly.', '') === false, 'no previous tutor turn → nothing');
assert(shouldKillBareAssentPraise('yes', 'Exactly.', 'Take your time with that one.') === false, 'no open question → nothing');

// Discourse markers and non-verdict replies to a bare yes are never killed.
for (const reply of [
  "Right, let's look at the first step together. What is being subtracted from $x$?",
  'Okay — tell me what you get.',
  "Great, let's move on to problem two.",
  'Go ahead — what do you get?',
  "Hmm — that's a yes, but I asked which pronoun actually agrees.",
  'Good. Take a moment and give me the number.',
  'Nice. So what is ten percent of forty?',
  'Not quite. Let\'s look again.',
  'Right there on the board is the equation we need.',
  'Sure — what do you get when you divide?',
]) assert(shouldKillBareAssentPraise('yes', reply, "What's ten percent of forty?") === false, `reply not a verdict opener: "${reply.slice(0, 50)}"`);

// Only a BARE assent.
for (const s of ['yes, 4', 'yes it is four', 'four', '4', 'yes because the x cancels', 'no, it is 5', 'ok so 4?', "I don't know", 'yes?? what', '[start lesson]', '']) {
  assert(isBareAssent(s) === false, `not a bare assent: "${s}"`);
  assert(shouldKillBareAssentPraise(s, 'Exactly right.', "What's ten percent of forty?") === false, `"${s}" → this guard does nothing`);
}

// Question classification on its own.
assert(classifyQuestion("What's ten percent of forty?") === 'wh', 'classify: wh');
assert(classifyQuestion('ready to move to problem two?') === 'yes_no', 'classify: readiness');
assert(classifyQuestion('their, or his or her?') !== 'wh', 'classify: either/or is not wh');
assert(openNonYesNoQuestion("Forty reaches the primary consumers. What's ten percent of forty?") === "What's ten percent of forty?", 'open question extracted from a longer turn (synthetic lead-in)');

// Flag off.
assert(shouldKillBareAssentPraise('yes', 'Exactly right.', "What's ten percent of forty?", { enabled: false }) === false, 'flag off → never');

// Feedback: generic, names the question, hands over no answer.
const fb = bareAssentPraiseFeedback('yes', KILL[4][1]);
assert(fb.includes('"yes"') && fb.includes("What's ten percent of forty?"), 'feedback quotes the student and the open question');
assert(/no verdict or praise word/.test(fb) && /do NOT answer your own question/.test(fb) && /Do not narrate/.test(fb), 'feedback: no verdict, no self-answer, no narration');

// Wiring: evaluated at the same kill site as the existing non-answer praise guard.
const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
assert(vtr.includes('shouldKillBareAssentPraise(transcript, nonAnswerTextSoFar, bareAssentPriorTutorTurn)'), 'wiring: VoiceTutorRealtime calls the guard on the text so far');
assert(vtr.includes("action: 'bare_assent_praise'"), 'wiring: its own rejection action');
assert(vtr.includes("onDebugEvent?.('bare_assent_praise_retry'"), 'wiring: its own debug event');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
