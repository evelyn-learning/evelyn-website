/**
 * R58 — student-declared hold (student-hold.ts). Fixture utterances are
 * VERBATIM from live session portal-2f23ece4 (2026-08-28), where the
 * student declared "ignore everything I say until I say candle", the
 * tutor kept replying to every overheard utterance, and the student came
 * back WITHOUT the codeword ("cupcake cake thing. Okay, I'm ready to
 * keep going now.").
 *
 * Usage: npx tsx scripts/test-student-hold.ts  (npm run test:student-hold)
 */
import { detectHoldRequest, checkResume } from '../src/lib/tutor/voice/student-hold';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── detectHoldRequest ───
{
  const r = detectHoldRequest('Bro, this Okay, wait. Um, I just need to talk to someone real quick, so ignore everything I say until I say candle.');
  check('live fixture: "ignore everything I say until I say candle" → hold, cue=candle',
    r.hold === true && r.resumeCue === 'candle', JSON.stringify(r));
}
check('cue with "the word": "ignore me until I say the word banana" → cue=banana',
  detectHoldRequest('Ignore me until I say the word banana, okay?').resumeCue === 'banana');
check('step-away without cue: "I need to talk to my friend" → hold, no cue',
  (() => { const r = detectHoldRequest('Sorry, I need to talk to my friend for a bit.'); return r.hold && !r.resumeCue; })());
check('"don\'t listen to me for a minute" → hold',
  detectHoldRequest("Don't listen to me for a minute.").hold === true);
check('"I\'m not talking to you" → hold',
  detectHoldRequest("This is my sister — I'm not talking to you right now.").hold === true);

// Ordinary stalls / content must NOT enter hold.
check('"hold on" is a stall, NOT hold', detectHoldRequest('Uh, hold on.').hold === false);
check('"give me a sec" is a stall, NOT hold', detectHoldRequest('Just give me a sec.').hold === false);
check('"wait, let me think" NOT hold', detectHoldRequest('Wait, let me think about this.').hold === false);
check('content about ignoring in math NOT hold',
  detectHoldRequest('So we can ignore the negative root here, right?').hold === false);
check('bracketed synthetic → NOT hold', detectHoldRequest('[start lesson]').hold === false);

// ─── checkResume ───
{
  const r = checkResume("Okay, okay, um, um, um, um, uh, cupcake cake thing. Okay, I'm ready to keep going now. Um, yeah.", 'candle');
  check('live fixture: return WITHOUT the codeword resumes via ready-intent',
    r.resume === true && r.reason === 'ready-intent', JSON.stringify(r));
}
check('bare codeword resumes', checkResume('Candle!', 'candle').resume === true);
check('codeword mid-sentence resumes', checkResume('Um okay candle, I said it.', 'candle').resume === true);
check('"are you there?" always resumes (direct address)',
  checkResume('Hello? Are you there?', 'candle').resume === true);
check('"I\'m back" resumes without cue', checkResume("Okay I'm back.", undefined).resume === true);
check('overheard chatter does NOT resume',
  checkResume('Look at this.', 'candle').resume === false);
check('overheard aside does NOT resume',
  checkResume('This is my tongue and ignore that weird thing that is my tutor.', 'candle').resume === false);
check('overheard "I have to talk to a friend and stuff" does NOT resume',
  checkResume('Sorry, I am not continue. Um, um, um, I have to do, I have to talk to a friend and stuff.', 'candle').resume === false);
// Multi-word cue: majority-token match.
check('multi-word cue "purple dragon" matched by "dragon purple thing"',
  checkResume('uh the dragon purple thing', 'purple dragon').resume === true);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
