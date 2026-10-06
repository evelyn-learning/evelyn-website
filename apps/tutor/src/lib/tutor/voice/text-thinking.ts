/**
 * "Think before judging" — model thinking for TEXT-mode brain turns.
 *
 * Why (2026-10-06, 23 scripted text sessions on the live build): the tutor's
 * verdicts on student answers were unreliable — a correct hedged answer told
 * "Not quite" in 6 sessions, a plausible wrong answer praised in 8, a bare
 * off-target token affirmed in 19, the tutor's own arithmetic wrong in 3.
 * Every brain request sends `thinking: { type: 'disabled' }` because a voice
 * turn needs its first word in about a second. A typed turn does not: the
 * student is reading, and a few more seconds is acceptable.
 *
 * Where the switch lives: SERVER-side, where the request is built
 * (claude-brain.ts). The client only reports the session's input mode
 * (`inputMode: 'text'` in the /api/tutor/brain/stream body); the route turns
 * that into `BrainTurnInput.textThinking` through `textThinkingEnabled`.
 *   TUTOR_TEXT_THINKING           unset/anything ⇒ ON · 'off' ⇒ request, user
 *                                 content and stream identical to before.
 *   TUTOR_TEXT_THINKING_EFFORT    'low' | 'medium' | 'high' (default below).
 *
 * Cache (measured 2026-10-05 on claude-sonnet-5; scripts/replay-verdict-turns.ts
 * `--cache-probe` repeats it): the thinking configuration AND the effort level
 * are part of the cache key for the WHOLE prefix, tools and system included.
 * The first `medium` request read 0 tokens and wrote 104K although `disabled`
 * and `low` requests had written the same tools+system minutes earlier; each
 * config then read its own entry in full. A request with thinking on reads
 * nothing a thinking-off request wrote, and the other way round.
 * Consequences, all deliberate:
 *   - thinking is on for EVERY turn of a text session (opener and runtime
 *     turns included), never toggled per turn — a per-turn toggle would
 *     rewrite ~120K tokens of prefix on each switch;
 *   - text sessions share one tools+core entry among themselves, separate
 *     from the voice one;
 *   - the effort level must not vary within a deployment.
 *
 * Pure module — no SDK import, no I/O. Exercised by `npm run test:text-thinking`.
 */

export type TextThinkingEffort = 'low' | 'medium' | 'high';

/** Default effort: 'low'. Offline replay of recorded verdict turns
 *  (2026-10-05, scripts/replay-verdict-turns.ts), time to first text:
 *    thinking off   p50 0.9 s · p90 1.3 s · max 2.0 s   (116 turns)
 *    low            p50 1.8 s · p90 3.8 s · max 7.0 s   (59 turns)
 *    medium         p50 4.1 s · p90 10 s  · max 17 s    (12 turns)
 *  `low` stays inside "a few more seconds"; `medium` does not on the tail.
 *  `medium` looked better on the hardest turns in that small sample — it is
 *  one env var away, but run the replay on it before switching. */
export const TEXT_THINKING_DEFAULT_EFFORT: TextThinkingEffort = 'low';

/** Extra `max_tokens` on a thinking turn. Thinking tokens count against
 *  `max_tokens`; the base cap (2000) was sized for the reply and its tool
 *  calls alone, so thinking gets its own room on top of it rather than
 *  eating into it. A ceiling, not a target: the largest whole response in
 *  the replay was 721 output tokens at `low` and 1605 at `medium`. */
export const TEXT_THINKING_HEADROOM_TOKENS = 6000;

/** A thinking iteration that has shown nothing after this long is cut and
 *  re-issued without thinking, so the student is never left waiting on a
 *  long deliberation. Sits under the client's 22 s nothing-shown abort with
 *  room for the re-issued request's own first text. Never reached at `low`
 *  in the replay (max 7.0 s); 1 of 12 `medium` turns would have hit it. The
 *  re-issued request reads the thinking-off cache entry, which a text-only
 *  deployment will usually not have warm — expect a full-price prefix
 *  (~120K tokens) on that rare turn. */
export const TEXT_THINKING_DEADLINE_MS = 14_000;

export function textThinkingEffort(env: string | undefined = process.env.TUTOR_TEXT_THINKING_EFFORT): TextThinkingEffort {
  return env === 'low' || env === 'medium' || env === 'high' ? env : TEXT_THINKING_DEFAULT_EFFORT;
}

/** Thinking is on for a turn iff the session is text mode and the flag is
 *  not 'off'. Anything else (voice, an old client that sends no mode, a
 *  malformed value) ⇒ off ⇒ the request is the pre-existing one. */
export function textThinkingEnabled(
  inputMode: unknown,
  flag: string | undefined = process.env.TUTOR_TEXT_THINKING,
): boolean {
  return inputMode === 'text' && flag !== 'off';
}

/**
 * The three request fields that differ between a thinking and a non-thinking
 * brain call. Spread in place of the old `max_tokens` + `thinking` pair, so a
 * non-thinking request keeps its exact keys, order and values.
 */
export function brainThinkingParams(
  on: boolean,
  baseMaxTokens: number,
  effort: TextThinkingEffort = textThinkingEffort(),
):
  | { max_tokens: number; thinking: { type: 'disabled' } }
  | { max_tokens: number; thinking: { type: 'adaptive' }; output_config: { effort: TextThinkingEffort } } {
  if (!on) return { max_tokens: baseMaxTokens, thinking: { type: 'disabled' } };
  return {
    max_tokens: baseMaxTokens + TEXT_THINKING_HEADROOM_TOKENS,
    thinking: { type: 'adaptive' },
    output_config: { effort },
  };
}

/**
 * A thinking iteration that ended at the token cap with nothing for the
 * student (no text, no tool call) spent its whole budget deliberating. It is
 * re-issued once without thinking rather than surfacing an empty turn.
 */
export function thinkingStarved(a: {
  thinkingOn: boolean;
  stopReason: string | null | undefined;
  textChars: number;
  toolCalls: number;
}): boolean {
  return a.thinkingOn && a.stopReason === 'max_tokens' && a.textChars === 0 && a.toolCalls === 0;
}

/**
 * Per-turn instruction for a thinking turn. Generic — no subject content.
 * Rendered directly above the verdict guard; it tells the model what to do
 * with the reasoning it now has, and the guard's rules on what the opener may
 * say are unchanged. '' when thinking is off or the turn is a runtime
 * dispatch (bracketed) rather than something the student wrote.
 */
export function formatTextThinkingBlock(
  on: boolean,
  studentTranscript: string,
  opts?: {
    /** "Work it, then match" (./work-then-match.ts): the reply opens with the
     *  working, not with a verdict. Unset/false ⇒ the block as before. */
    workThenMatch?: boolean;
  },
): string {
  const t = (studentTranscript ?? '').trim();
  if (!on || !t || t.startsWith('[')) return '';
  const step3 = opts?.workThenMatch === true
    ? '3. Only then write the reply. It does not open with a verdict or praise word: it opens with the working — one or two short sentences from the student\'s own problem, ending in the result — and then states, as a fact, whether that result matches what the student wrote. If the message does not answer the open question, do not treat it as though it did: no verdict of any kind, and do not work the open question out for them — respond to what they actually wrote, and ask what they meant if that is unclear.\n'
    : '3. Only then write the reply, and open it with a verdict that matches what you found. If the message does not answer the open question, do not treat it as though it did: no verdict or praise word — respond to what they actually wrote, and ask what they meant if that is unclear.\n';
  return '<private_reasoning>\n'
    + 'You can reason privately before this reply; the student never sees that reasoning. Use it, in this order, before you write anything:\n'
    + '1. Identify exactly which question is open right now (the last thing you asked, or the part of the problem being worked) and what the student\'s message is: an answer to that question, an answer to a different question or a different part, a question or request of their own, or not an answer at all.\n'
    + '2. If the message contains an answer or a claim, work out the correct result yourself from the student\'s own problem and data before you judge it — every step, including any intermediate value you are about to state or write on the board. Then compare their result with yours; an equivalent form is the same result.\n'
    + step3
    + '4. The reply contains only what you say to the student. Never put your plan, your sorting of their message, or any reasoning about the conversation, the turn or the lesson state into the reply.\n'
    + '</private_reasoning>\n\n';
}
