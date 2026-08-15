/**
 * Acknowledgment micro-turn — pure decision + phrase rotation (Phase 2,
 * humanlike-latency plan).
 *
 * A neutral, non-evaluative vocal acknowledgment ("Hmm, let me think—")
 * spoken ~450ms after turn.end IFF the brain's sentence-0 hasn't arrived
 * yet. Baseline (2026-07-22, prod): brain first-sentence median 2.7s,
 * p90 9.2s — the ack covers the head of that silence.
 *
 * Every guard traces to a mapped failure mode:
 *  - noise: never acknowledge a passing train / cough.
 *  - attempt > 0: retries re-fire the same student turn — a second ack
 *    reads as the tutor stuttering.
 *  - skipTurn / fastOpenerSpoken / brainSentence0Dispatched: something is
 *    already speaking (or deliberately silent) for this turn.
 *  - msSinceTurnEnd < 450: give a fast brain the chance to beat the ack.
 *  - turnIndex % 5 === 0: deterministic ~80% cap — humans don't
 *    backchannel every single time (resolved 2026-07-21: 80%, parity).
 *
 * Phrases are "thinking" noises ONLY: at ack time we don't know if the
 * student was right — "Okay!" before "Not quite…" reads as approval.
 * pickAck is index-based (no Math.random) so tests are exact, and never
 * repeats the previous ack's phrase on consecutive acks.
 */

// Complete short utterances with periods — NOT trailing em-dashes. The ack
// bypasses the brain-sentence TTS normalization (which strips em-dashes),
// and Cartesia renders a dangling "—" with clipped, odd prosody (live
// round 4, 2026-07-22: "the gap fillers sound a little weird"). A dangling
// connective also promises a continuation the separate next synthesis
// never delivers.
export const ACK_PHRASES = [
  'Hmm, let me think.',
  "Okay, let's see.",
  'Let me see.',
  'Mm, one moment.',
  "Let's look at that.",
  'Hold on, let me look.',
  'Mm, thinking.',
  'One moment.',
] as const;

export interface AckInput {
  classification: 'clean' | 'uncertain' | 'noise';
  /** 0 = first attempt; retries never ack. */
  attempt: number;
  skipTurn: boolean;
  fastOpenerSpoken: boolean;
  brainSentence0Dispatched: boolean;
  /** Fire window: ack only at >= 450ms after turn.end. */
  msSinceTurnEnd: number;
  /** Monotonic per-dispatch counter; index % 5 === 0 turns stay silent. */
  turnIndex: number;
  /** Round 28: the session-opening turn (synthetic [start lesson] /
   *  [start session] / [Session-resumed…] kickoff) never acks. There is
   *  no student utterance to acknowledge, and the ack raced the brain's
   *  own opener scaffolding into "Okay, let's see." + "Alright, let's
   *  dig in…" stacks (live 2026-07-24, session-1784908707278 t=18.6s).
   *  The fastOpenerSpoken / brainSentence0Dispatched guards are timing
   *  races the ack usually WINS on the slow first turn — this is the
   *  structural exclusion. */
  openingTurn?: boolean;
}

export function shouldSpeakAck(input: AckInput): boolean {
  return (
    input.classification !== 'noise' &&
    input.attempt === 0 &&
    !input.skipTurn &&
    !input.openingTurn &&
    !input.fastOpenerSpoken &&
    !input.brainSentence0Dispatched &&
    input.msSinceTurnEnd >= 450 &&
    input.turnIndex % 5 !== 0
  );
}

export function pickAck(
  turnIndex: number,
  lastAckIndex: number | null,
): { text: string; index: number } {
  const n = ACK_PHRASES.length;
  let index = ((turnIndex % n) + n) % n;
  if (index === lastAckIndex) index = (index + 1) % n;
  return { text: ACK_PHRASES[index], index };
}
