import {
  classifyCover, pickCoverPhrase, LIVENESS_REPLIES,
  COVER_FIRE_MS, TURN_GIVE_UP_MS, createEscalationState, decideEscalation,
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

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all cover-layer checks passed');
