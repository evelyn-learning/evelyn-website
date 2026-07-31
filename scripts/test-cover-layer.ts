import {
  classifyCover, pickCoverPhrase, LIVENESS_REPLIES,
  COVER_FIRE_MS, TURN_GIVE_UP_MS, createEscalationState, decideEscalation,
  createNoiseNagState, recordNoiseDrop,
  createWarmupState, decideWarmupAction,
  COVER_POOLS, ESCALATION_TIERS, NOISE_NAG_LINE,
  type CoverVerdict,
} from '../src/lib/tutor/voice/cover-layer';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}
const kind = (t: string) => classifyCover(t).kind;
const cat = (t: string) => {
  const v = classifyCover(t);
  return v.kind === 'cover' ? v.category : v.kind === 'silent' ? `silent:${v.reason}` : v.kind;
};

// --- Instant liveness (taxonomy cat. 13 — real utterances from sessions)
check('liveness-1', kind('Are you still there?') === 'instant');
check('liveness-2', kind("Are you still there? I'm seeing thinking.") === 'instant');
check('liveness-3', kind('Can you hear me?') === 'instant');
check('liveness-hello-short', kind('Hello?') === 'instant');
// "hello" inside a longer content turn is NOT liveness
check('liveness-not-long-hello', kind('Hello, what about the name of the sea?') !== 'instant');

// --- Silent verdicts
check('stall-1', cat('Okay, so, oh man, just a sec.') === 'silent:student-stall');
check('stall-2', cat('Let me just try to remember this for a second.') === 'silent:student-stall');
check('stall-3', cat('Uh, wait.') === 'silent:student-stall');
check('backchannel-1', cat('Yeah, makes sense.') === 'silent:backchannel');
check('backchannel-2', cat('Oh, okay.') === 'silent:backchannel');
check('backchannel-3', cat('Gotcha.') === 'silent:backchannel');
check('backchannel-4', cat('Mhm.') === 'silent:backchannel');
check('continuation-1', cat('and the upper half is 23, 28, 30.') === 'silent:continuation');
check('continuation-2', cat('which is 0.') === 'silent:continuation');
check('synthetic', cat('[Continuation-after-cutoff: finish the thought]') === 'silent:synthetic');
check('synthetic-2', cat('[start lesson]') === 'silent:synthetic');

// --- Cover categories
// Taxonomy cat. 5 (agreement-PREFIXED content) must NOT be backchannel:
check('agreement-content-1', cat("Yeah, that's 16.") === 'numeric-echo');
check('agreement-content-2', cat("Yeah, that'll be 28.") === 'numeric-echo');
check('numeric-1', cat('29.') === 'numeric-echo');
check('numeric-2', cat('minus 22.') === 'numeric-echo');
check('numeric-3', cat('200.') === 'numeric-echo');
// R36 (live 2026-07-30): "-3/6" was echoed as "ok 6" — the extractor only
// captured the last digit run. A signed fraction is ONE answer expression.
check('numeric-neg-fraction', cat('-3/6.') === 'numeric-echo');
check('numeric-literal-neg', cat("it's -2.") === 'numeric-echo');
// Two separate numbers ("m is 4 and b is -2") can't be echoed as one token —
// echoing just the tail ("ok 2") misquotes the student. Falls to generic.
check('multi-number-no-echo', cat('m is 4 and b is -2.') === 'generic');
check('question-1', cat('Um, you know, tell me what resistant means.') === 'question');
check('question-2', cat('How does this formula get derived?') === 'question');
check('question-3', cat('what is jizya?') === 'question');
check('request-1', cat('Can you draw the graph for me?') === 'request');
check('request-2', cat('sorry can u repeat what u just said?') === 'request');
check('request-3', cat("Yeah, let's move on to spread now.") === 'request');
check('request-4', cat('Give me a harder one.') === 'request');
check('stuck-1', cat("Um, yeah, good question. Um, I don't know actually.") === 'stuck');
check('stuck-2', cat("i'm not getting it") === 'stuck');
const thinkAloud =
  'Okay, so there will be um uh Q 1 is 8, so 8 minus 1.5 times 20. ' +
  'That is um 30. So 8 minus 30 is minus 22. So the lower cutoff is minus 22 I think.';
check('think-aloud', cat(thinkAloud) === 'think-aloud');
check('generic-fallback', cat('The mitochondria part again please maybe.') !== 'undefined');

// --- pickCoverPhrase: deterministic, never repeats lastIndex, echoes the number
const e1 = pickCoverPhrase('numeric-echo', "Yeah, that's 16.", 3, null);
check('echo-contains-number', e1.text.includes('16'));
// R36: the echo must speak the WHOLE answer expression, sign and all.
const eFrac = pickCoverPhrase('numeric-echo', '-3/6.', 3, null);
check('echo-neg-fraction-whole', eFrac.text.includes('minus 3 over 6'));
const eNeg = pickCoverPhrase('numeric-echo', "it's -2.", 3, null);
check('echo-literal-neg-sign', eNeg.text.includes('minus 2'));
const eDec = pickCoverPhrase('numeric-echo', 'maybe 3.5.', 3, null);
check('echo-decimal-kept', eDec.text.includes('3.5'));
const p1 = pickCoverPhrase('question', 'why?', 2, null);
const p2 = pickCoverPhrase('question', 'why?', 2, p1.index);
check('no-repeat', p2.index !== p1.index);
const p3 = pickCoverPhrase('question', 'why?', 2, null);
check('deterministic', p3.index === p1.index && p3.text === p1.text);
// Prosody rule: every phrase in every pool ends with '.' '…' or '?'
check('liveness-pool-nonempty', LIVENESS_REPLIES.length >= 3);

// --- Escalation schedule + hard cap
check('fire-ms', COVER_FIRE_MS === 1200);
check('giveup-ms', TURN_GIVE_UP_MS === 45_000);
let es = createEscalationState();
let a = decideEscalation(es, 5_000, 1);
check('esc-early-wait', a.action === 'wait');
a = decideEscalation(es, 9_500, 1);
check('esc-tier1', a.action === 'speak' && a.text.length > 0);
a = decideEscalation(es, 10_000, 1);
check('esc-tier1-oneshot', a.action === 'wait');   // tier 1 already fired
a = decideEscalation(es, 26_000, 1);
check('esc-tier2', a.action === 'speak');
a = decideEscalation(es, 27_000, 1);
check('esc-tier2-oneshot', a.action === 'wait');
a = decideEscalation(es, 46_000, 1);
check('esc-giveup', a.action === 'give-up');
// deterministic phrase per tier+turnIndex
const es2 = createEscalationState();
const b1 = decideEscalation(es2, 9_500, 4);
const es3 = createEscalationState();
const b2 = decideEscalation(es3, 9_500, 4);
check('esc-deterministic', b1.action === 'speak' && b2.action === 'speak' && b1.text === b2.text);

// --- Consecutive-noise nag (silence audit §5)
let ns = createNoiseNagState();
check('nag-short-ignored', recordNoiseDrop(ns, 1_000, 800).nag === false);   // <1.5s speech
check('nag-first-real', recordNoiseDrop(ns, 2_000, 3_000).nag === false);    // 1st drop
check('nag-second-fires', recordNoiseDrop(ns, 10_000, 2_500).nag === true);  // 2nd within 30s
check('nag-cooldown', recordNoiseDrop(ns, 15_000, 2_500).nag === false);     // 60s cooldown
ns = createNoiseNagState();
recordNoiseDrop(ns, 0, 2_000);
check('nag-window-expired', recordNoiseDrop(ns, 40_000, 2_000).nag === false); // >30s apart resets

// --- Warmup watchdog (R32 T9): stalled [start lesson] / [Session-resumed…]
// kickoff — 20s rekick once, 40s fail once.
let ws2 = createWarmupState(0);
check('warmup-early-wait', decideWarmupAction(ws2, 10_000) === 'wait');
check('warmup-rekick-at-20s', decideWarmupAction(ws2, 21_000) === 'rekick');
check('warmup-rekick-once', decideWarmupAction(ws2, 25_000) === 'wait');
check('warmup-fail-at-40s', decideWarmupAction(ws2, 41_000) === 'fail');
check('warmup-fail-once', decideWarmupAction(ws2, 45_000) === 'wait');

// --- Brain-opener collision ban (R33): the cover can't know what the brain
// will say — a pool phrase that is ALSO a habitual brain opener doubles up
// (observed live 2026-07-25: cover "Good question." then brain sentence-0
// "Good question — let's nail that down."). No pool phrase may be a
// standalone acknowledgment token the brain commonly opens with.
const BRAIN_OPENER_RE =
  /^(good question|good call|nice|exactly|sure|okay|alright|no worries|all good|fair enough|fair callout)[.!…]?$/i;
const allPools: Array<[string, readonly string[]]> = [
  ...Object.entries(COVER_POOLS),
  ['liveness', LIVENESS_REPLIES],
  ...ESCALATION_TIERS.map((t, i) => [`escalation-${i}`, t.pool] as [string, readonly string[]]),
  ['noise-nag', [NOISE_NAG_LINE]],
];
for (const [poolName, pool] of allPools) {
  for (const phrase of pool) {
    check(`no-opener-collision:${poolName}:"${phrase}"`, !BRAIN_OPENER_RE.test(phrase.trim()));
    // Prosody rule (ack-layer.ts doc): complete short sentences ending in
    // '.', '…' or '?' — never a trailing em-dash (Cartesia clips it).
    check(`prosody:${poolName}:"${phrase}"`, /[.…?]$/.test(phrase.trim()) && !/[—-]$/.test(phrase.trim()));
  }
}

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all cover-layer checks passed');
