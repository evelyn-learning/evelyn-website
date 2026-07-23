/**
 * Tests for the non-answer praise backstop (live round 5, 2026-07-23 —
 * "Oh, okay." → "Exactly.4 meters per second squared").
 *
 * Run: npx tsx scripts/test-nonanswer-praise.ts
 */
import {
  isPureAcknowledgment,
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

// Feedback message sanity.
const fb = nonAnswerPraiseFeedback('Oh, okay.');
check('feedback quotes the utterance', fb.includes('"Oh, okay."'));
check('feedback forbids reveal', /do NOT state the answer/i.test(fb));

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} nonanswer-praise tests passed.`);
