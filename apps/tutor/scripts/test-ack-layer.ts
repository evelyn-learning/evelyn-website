import { shouldSpeakAck, pickAck, ACK_PHRASES, type AckInput } from '../src/lib/tutor/voice/ack-layer';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

const happy: AckInput = {
  classification: 'clean',
  attempt: 0,
  skipTurn: false,
  fastOpenerSpoken: false,
  brainSentence0Dispatched: false,
  msSinceTurnEnd: 450,
  turnIndex: 1,
};

// Fires on the happy path
check('happy', shouldSpeakAck(happy) === true);
// 'uncertain' is non-noise → still fires (it dispatches to the brain wrapped)
check('uncertain-ok', shouldSpeakAck({ ...happy, classification: 'uncertain' }) === true);

// Each guard refuses individually
check('noise', shouldSpeakAck({ ...happy, classification: 'noise' }) === false);
check('retry', shouldSpeakAck({ ...happy, attempt: 1 }) === false);
check('skipTurn', shouldSpeakAck({ ...happy, skipTurn: true }) === false);
check('fastOpener', shouldSpeakAck({ ...happy, fastOpenerSpoken: true }) === false);
check('sentence0', shouldSpeakAck({ ...happy, brainSentence0Dispatched: true }) === false);
check('tooEarly', shouldSpeakAck({ ...happy, msSinceTurnEnd: 449 }) === false);
// Damping: deterministic ~80% cap — every 5th turn (index % 5 === 0) is silent
check('damping', shouldSpeakAck({ ...happy, turnIndex: 5 }) === false);
check('damping10', shouldSpeakAck({ ...happy, turnIndex: 10 }) === false);
check('damping-else', [1, 2, 3, 4, 6, 7, 8, 9, 11].every((i) => shouldSpeakAck({ ...happy, turnIndex: i })));
// Round 28: the session-opening kickoff never acks (live 2026-07-24:
// "Okay, let's see." spoke over the opener scaffolding on turn 1).
check('opening-turn', shouldSpeakAck({ ...happy, openingTurn: true }) === false);
check('opening-turn-absent-defaults-open', shouldSpeakAck({ ...happy, openingTurn: false }) === true);

// pickAck: deterministic, only pool phrases, never repeats lastAckIndex
check('pool-size', ACK_PHRASES.length === 8);
const p1 = pickAck(1, null);
check('pick-in-pool', ACK_PHRASES.includes(p1.text) && p1.index === ACK_PHRASES.indexOf(p1.text));
check('pick-deterministic', pickAck(7, null).text === pickAck(7, null).text);
for (let last = 0; last < ACK_PHRASES.length; last++) {
  for (let turn = 0; turn < 12; turn++) {
    const p = pickAck(turn, last);
    if (p.index === last) { failures++; console.error(`FAIL no-repeat turn=${turn} last=${last}`); }
    if (!ACK_PHRASES.includes(p.text)) { failures++; console.error(`FAIL pool turn=${turn}`); }
  }
}
console.log('ok no-repeat/pool sweep');
// Rotation actually varies across turns
const seen = new Set(Array.from({ length: 10 }, (_, t) => pickAck(t, null).index));
check('rotates', seen.size >= 3);

// Pool phrases are judgment-free "thinking" noises: no praise/verdict words
const banned = /good|great|right|correct|exactly|nice|yes|no\b|perfect|well done/i;
check('neutral-pool', ACK_PHRASES.every((p) => !banned.test(p)));

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('test:ack-layer PASS');
