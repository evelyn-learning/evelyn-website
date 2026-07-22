import { createTurnLatencyLedger, formatTurnLatency } from '../src/lib/tutor/voice/turn-latency';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

// Happy path: all marks in order
const l1 = createTurnLatencyLedger();
l1.mark('eagerEnd', 1000);
l1.mark('turnEnd', 1400);
l1.mark('brainFetch', 1402);
l1.mark('firstSentence', 2900);
l1.mark('firstTtsFetch', 2905);
l1.mark('firstAudio', 3600);
const s1 = l1.summarize();
check('eagerToEnd', s1.eagerToEndMs === 400);
check('endToBrainFetch', s1.endToBrainFetchMs === 2);
check('brainFirstSentence', s1.brainFirstSentenceMs === 1498);
check('ttsToAudio', s1.ttsToFirstAudioMs === 695);
check('total', s1.totalMs === 2200); // turnEnd (1400) → firstAudio (3600)
check('complete', s1.complete === true);

// Missing eagerEnd (Ink can jump straight to turn.end): segments null, not NaN
const l2 = createTurnLatencyLedger();
l2.mark('turnEnd', 500);
l2.mark('brainFetch', 501);
l2.mark('firstSentence', 1700);
l2.mark('firstTtsFetch', 1701);
l2.mark('firstAudio', 2200);
const s2 = l2.summarize();
check('noEager', s2.eagerToEndMs === null && s2.totalMs === 1700 && s2.complete === true);

// Duplicate mark: first wins (turn.resume can re-fire eager_end)
const l3 = createTurnLatencyLedger();
l3.mark('eagerEnd', 100);
l3.mark('eagerEnd', 900);
l3.mark('turnEnd', 1000);
check('firstWins', l3.summarize().eagerToEndMs === 900);

// Incomplete turn (killed before audio): complete=false, no throw
const l4 = createTurnLatencyLedger();
l4.mark('turnEnd', 100);
l4.mark('brainFetch', 101);
check('incomplete', l4.summarize().complete === false && l4.summarize().totalMs === null);

// has(): stale-ledger detection for the wiring layer
check('has', l4.has('turnEnd') === true && l4.has('firstAudio') === false);

// formatter: exact rendering, nulls included
check('format', formatTurnLatency(s1) ===
  'eager→end=400ms end→fetch=2ms brain_first=1498ms tts→audio=695ms TOTAL=2200ms complete=true');
check('formatNulls', formatTurnLatency(l4.summarize()).includes('TOTAL=nullms complete=false'));

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('test:turn-latency PASS');
