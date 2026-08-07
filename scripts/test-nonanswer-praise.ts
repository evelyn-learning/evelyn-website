/**
 * Tests for the non-answer praise backstop (live round 5, 2026-07-23 —
 * "Oh, okay." → "Exactly.4 meters per second squared").
 *
 * Run: npx tsx scripts/test-nonanswer-praise.ts
 */
import {
  isPureAcknowledgment,
  classifyNonAnswer,
  shouldKillNonAnswerPraise,
  nonAnswerPraiseFeedback,
} from '../src/lib/tutor/voice/nonanswer-praise';

let passed = 0, failed = 0;
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

// ─── Pure acknowledgments (the live utterances first) ───
check('"Oh, okay." is ack', isPureAcknowledgment('Oh, okay.'));
check('"Mhm." is ack', isPureAcknowledgment('Mhm.'));
check('"All right." is ack', isPureAcknowledgment('All right.'));
check('"Um, okay" is ack (filler stripped)', isPureAcknowledgment('Um, okay'));
check('"Got it!" is ack', isPureAcknowledgment('Got it!'));
check('"That makes sense." is ack', isPureAcknowledgment('That makes sense.'));

// NOT acknowledgments — could carry answer content.
check('"Yes." not ack (yes/no answer)', !isPureAcknowledgment('Yes.'));
check('"Yeah." not ack', !isPureAcknowledgment('Yeah.'));
check('"No." not ack', !isPureAcknowledgment('No.'));
check('"Right." not ack (direction answer)', !isPureAcknowledgment('Right.'));
check('"4" not ack', !isPureAcknowledgment('4'));
check('"6." not ack', !isPureAcknowledgment('6.'));
check('"20 Newtons" not ack', !isPureAcknowledgment('20 Newtons'));
check('"the applied force" not ack', !isPureAcknowledgment('the applied force'));
check('"okay so f is 30" not ack', !isPureAcknowledgment('okay so f is 30'));
check('empty not ack', !isPureAcknowledgment(''));

// ─── Kill decision — the live failure shapes ───
check('live shape: "Oh, okay." + "Exactly.4 meters…" kills',
  shouldKillNonAnswerPraise('Oh, okay.', 'Exactly.4 meters per second squared — that\'s the full FBD workflow nailed.'));
check('spaced variant kills',
  shouldKillNonAnswerPraise('Mhm.', 'Right. 45 N up the incline.'));
check('"Correct, 20 N" kills',
  shouldKillNonAnswerPraise('All right.', 'Correct, 20 N to the right.'));
check('praise only, no value yet → no kill (waits for reveal)',
  !shouldKillNonAnswerPraise('Oh, okay.', 'Exactly.'));
check('praise then dollar-value kills',
  shouldKillNonAnswerPraise('Oh, okay.', 'Exactly. $4 \\ \\text{m/s}^2$ is the answer.'));

// Legit shapes — must NOT kill.
check('real answer + praise+value → no kill',
  !shouldKillNonAnswerPraise('It\'ll be 4.', 'Exactly.4 meters per second squared.'));
check('praise + new-problem prose → no kill',
  !shouldKillNonAnswerPraise('All right.', 'Right. Here\'s the next one: a 5 kg box is pushed with 30 N.'));
check('"Good." opener → no kill',
  !shouldKillNonAnswerPraise('All right.', 'Good. Let\'s keep the reps going — here\'s the next one.'));
check('non-praise teaching with numbers → no kill',
  !shouldKillNonAnswerPraise('Oh, okay.', 'So with 20 N and 5 kg, think about what F equals m a gives you.'));
check('direction answer "right" + praise+value → no kill',
  !shouldKillNonAnswerPraise('Right.', 'Exactly. 20 N to the right.'));

// ─── 2026-08-07 triage: "I don't know" + request classes ───
// session-1786064015703: "I don't know." ×2 → "Right, a circle!" (praise-
// phrased reveal); embed-1786076855391: "gtive another example" →
// "One eighth. Nice." (request treated as a correct answer).

// classifyNonAnswer — kinds
check('ack classifies as ack', classifyNonAnswer('Oh, okay.') === 'ack');
check('"I don\'t know." is idk', classifyNonAnswer("I don't know.") === 'idk');
check('"I dont know" is idk (no apostrophe)', classifyNonAnswer('I dont know') === 'idk');
check('"Um, I don\'t know." is idk (filler stripped)', classifyNonAnswer("Um, I don't know.") === 'idk');
check('"No idea." is idk', classifyNonAnswer('No idea.') === 'idk');
check('"I\'m not sure." is idk', classifyNonAnswer("I'm not sure.") === 'idk');
check('"dunno" is idk', classifyNonAnswer('dunno') === 'idk');
check('"give one example" is request', classifyNonAnswer('give one example') === 'request');
check('"gtive another example" is request (live STT typo)', classifyNonAnswer('gtive another example') === 'request');
check('"Can you explain that again?" is request', classifyNonAnswer('Can you explain that again?') === 'request');
check('"what do you mean?" is request', classifyNonAnswer('what do you mean?') === 'request');
check('"help" is request', classifyNonAnswer('help') === 'request');

// NOT non-answers — real attempts must classify null.
check('"an ellipse" is null (real answer)', classifyNonAnswer('an ellipse') === null);
check('"Is it 5?" is null (hedged answer)', classifyNonAnswer('Is it 5?') === null);
check('"the applied force" is null', classifyNonAnswer('the applied force') === null);
check('"Yes." is null (yes/no answer)', classifyNonAnswer('Yes.') === null);
check('"I don\'t know if that\'s the slope or the intercept" is null (too long / carries content)',
  classifyNonAnswer("I don't know if that's the slope or the intercept, maybe slope") === null);

// Kill decision extends to idk/request + praise-then-value.
check('idk + "Right. 45 N." kills',
  shouldKillNonAnswerPraise("I don't know.", 'Right. 45 N up the incline.'));
check('request + praise-then-value kills',
  shouldKillNonAnswerPraise('gtive another example', 'Exactly. $\\frac{1}{8}$ of the pizza.'));
check('idk + plain reveal (no praise) → no kill',
  !shouldKillNonAnswerPraise("I don't know.", "No worries — it's a circle. Flat slice, round shape."));
check('request + honoring the request → no kill',
  !shouldKillNonAnswerPraise('give one example', "Sure. Look at the board — that pizza's cut into four slices."));

// Feedback message sanity — per-class wording.
const fb = nonAnswerPraiseFeedback('Oh, okay.');
check('feedback quotes the utterance', fb.includes('"Oh, okay."'));
check('feedback forbids reveal', /do NOT state the answer/i.test(fb));
const fbIdk = nonAnswerPraiseFeedback("I don't know.");
check('idk feedback names the give-up', /not know|gave up|no answer/i.test(fbIdk));
check('idk feedback forbids praise-phrased reveal', /praise|verdict/i.test(fbIdk));
const fbReq = nonAnswerPraiseFeedback('give another example');
check('request feedback names the request', /request/i.test(fbReq));
check('request feedback says respond to it', /respond to (the|their) request/i.test(fbReq));

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} nonanswer-praise tests passed.`);
