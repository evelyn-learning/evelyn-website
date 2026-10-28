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
import { readFileSync } from 'node:fs';
import { detectHoldRequest, checkResume, SOFT_HOLD_CHECKIN_MS } from '../src/lib/tutor/voice/student-hold';

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

// ─── 2026-10-17 (GDI embed-1792274192055): "wait a second" hold, then "carry on" ───
for (const u of [
  'No, but like, can you carry on?',
  'What are we teaching here?',
  'Are you gonna start?',
  "Why don't you start?",
  'Okay, can you carry on, please? Like, I want to get on with the lesson.',
  'Please continue.',
  "Let's start.",
  'Go ahead.',
]) {
  check(`strict hold (no cue): "${u}" resumes`, checkResume(u).resume === true, JSON.stringify(checkResume(u)));
  check(`cue hold (candle): "${u}" resumes`, checkResume(u, 'candle').resume === true, JSON.stringify(checkResume(u, 'candle')));
}
// Overheard chatter still does not resume an explicit (cue) hold…
check('cue hold: "Look at this" does NOT resume', checkResume('Look at this', 'candle').resume === false);
check('cue hold: "can you see this?" (to a friend) does NOT resume', checkResume('can you see this?', 'candle').resume === false);
// …but a SOFT hold ("wait a second", no cue, no step-away) resumes on any speech.
check('soft hold: "Look at this" resumes', checkResume('Look at this', undefined, { soft: true }).reason === 'soft-any-speech');
check('soft hold: a one-word "Hello." does not count', checkResume('Hello.', undefined, { soft: true }).resume === false);
check('"Okay, can you just wait for a second?" is a SOFT wait request, not a step-away', (() => { const r = detectHoldRequest('Okay, can you just wait for a second?'); return r.hold === true && r.soft === true; })());
check('「ちょっと待ってください」 is a SOFT wait request', detectHoldRequest('はい、どう、ちょっと待ってください。').soft === true);
check('"ignore everything until I say candle" is NOT soft', detectHoldRequest('ignore everything I say until I say candle').soft !== true);
check('SOFT_HOLD_CHECKIN_MS is one minute', SOFT_HOLD_CHECKIN_MS === 60_000);
{
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  check('wiring: a cue-less tool hold on a non-step-away utterance is soft', vtr.includes('const soft = !cue && !detectHoldRequest(transcript).hold;'));
  check('wiring: resume check carries soft', vtr.includes('{ soft: studentHoldRef.current.soft }'));
  check('wiring: soft hold expires at its check-in', vtr.includes("onDebugEvent?.('student_hold_expired'"));
}

// embed-1792275630905: talking ABOUT listening is not a step-away.
for (const u of ['If I don\'t listen to you, then what will happen?', "Don't uh teach, then um will I get less marks?", 'People who don\'t listen fail.', 'You don\'t respond to me sometimes.']) {
  check(`"${u}" is NOT a hold request`, detectHoldRequest(u).hold === false, JSON.stringify(detectHoldRequest(u)));
}
for (const u of ["Don't listen to me for a minute.", 'Please don\'t respond, I\'m on the phone.', 'Okay, do not reply until I say banana.', "I'm not talking to you right now."]) {
  check(`"${u}" IS a hold request`, detectHoldRequest(u).hold === true, JSON.stringify(detectHoldRequest(u)));
}

// embed-1792280893534: Japanese resumes.
check('soft hold: 「はい、続けてください」 resumes', checkResume('はい、続けてください', undefined, { soft: true }).resume === true, JSON.stringify(checkResume('はい、続けてください', undefined, { soft: true })));
check('strict hold (no cue): 「はい、続けてください」 resumes (ready-intent)', checkResume('はい、続けてください').reason === 'ready-intent');
check('strict hold (cue): 「大丈夫です、どうぞ」 resumes', checkResume('大丈夫です、どうぞ', 'candle').resume === true);
check('strict hold (cue): 「先生、聞いてますか？」 resumes (direct address)', checkResume('先生、聞いてますか？', 'candle').reason === 'direct-address');
check('soft hold: a bare 「はい」 does not resume', checkResume('はい', undefined, { soft: true }).resume === false);
check('strict hold (cue): 「ちょっとこれ見て」 (to a friend) does NOT resume', checkResume('ちょっとこれ見て', 'candle').resume === false);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
