/**
 * Perception classifier — Stage 1 of the Voice Perception Layer.
 *
 * Pure function from (transcript + production WS state + recent TTS scripts)
 * to a verdict describing what the perception WS just heard.
 *
 * Stage 1 wires the verdicts in but does NOT enforce them; the value
 * delivered by this file is the verdict + reasoning that goes to the
 * `[CLASSIFIER]` log lines for the manual FP-rate review the design
 * gates Stage 1 → Stage 2 advancement on.
 *
 * See `memory/project_voice_perception_layer_design.md` (Q1.5, Q2) for the
 * locked specification. The 5-layer self-voice defence stack from Q1.5:
 *   1. Script-cancellation — implemented here (n-gram + jaccard).
 *   2. Timing-window suppression — implemented (per-script window via
 *      spokenStartedAt/spokenEndedAt + padding).
 *   3. Verdict-asymmetry — implemented (we raise the bar to BARGE-IN
 *      during 'speaking' via word-count gates + trigger lexicon).
 *   4. Browser AEC — out of scope; already on at getUserMedia layer.
 *   5. Cross-correlation echo detector — DEFERRED (Known Risk #1). Without
 *      it, layer 1 carries the load; if FP rate is too high in Stage 1
 *      review, the call is to add layer 5 BEFORE Stage 2 turns on
 *      cancellation behaviour.
 */

export type PerceptionVerdict =
  /** Matched a recent TTS script line — almost certainly the tutor's own
   *  voice leaking back through the speaker → mic path. Drop. */
  | 'drop_self_voice'
  /** Empty transcript or pure non-speech noise. Drop. */
  | 'noise'
  /** Short hesitation ("uh", "um") in any state, or a short ack ("okay",
   *  "mhm") while the tutor is speaking/thinking (avoids false-positive
   *  barge-ins). In 'listening' an ACK is the student's answer and
   *  classifies as new_turn instead (2026-07-11 fix — Stage 4 made
   *  perception the sole input path, so filler-in-listening = silent drop). */
  | 'filler'
  /** Real student speech during 'listening' — proceed to brain. */
  | 'new_turn'
  /** Student adds to a prior turn during 'thinking' (brain in flight). */
  | 'continuation'
  /** Substantive interrupt during 'speaking' (or 'thinking' with clear
   *  pivot signals). */
  | 'barge_in'
  /** Heuristic uncertain — escalate to Haiku. */
  | 'escalate';

export type ProductionStateForClassifier =
  | 'listening'
  | 'recording'
  | 'processing'
  | 'speaking'
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'error';

export interface RecentTtsScript {
  /** Stable per-dispatch id (V2, 2026-07-15). Correlates the audio queue's
   *  real playback-start/-end callbacks back to THIS buffer entry so the
   *  timing window reflects when the sentence actually played, not when it
   *  was dispatched. Optional so pre-V2 call sites / fixtures still typecheck. */
  id?: number;
  /** Text the tutor spoke. Ideally the post-TTS-pronunciation form so
   *  fuzzy matching aligns with what the speaker actually emitted, but
   *  the pre-TTS text is a very close approximation. */
  text: string;
  /** ms timestamp (Date.now()) when this script started playback.
   *  V2: stamped at REAL audio-playback start; 0 for an entry that was
   *  skipped (TTS fetch failure) or drained before it ever played — a
   *  zeroed window can't physically echo, so it never matches. */
  spokenStartedAt: number;
  /** ms timestamp when playback ended. May be unknown for the currently
   *  playing script — leave as null and the classifier treats the script
   *  as live (still in the speaker → mic loop). */
  spokenEndedAt: number | null;
}

export interface HeuristicInput {
  /** Raw transcript text from the perception WS. May be empty. */
  transcript: string;
  /** Production WS state at the moment the perception transcript landed. */
  productionState: ProductionStateForClassifier;
  /** Rolling buffer of TTS scripts spoken in the last ~8s. Caller is
   *  responsible for trimming the window. */
  recentTtsScripts: RecentTtsScript[];
  /** Date.now() at classification time. */
  now: number;
  /** When the perception WS first detected speech for this transcript —
   *  used by the timing-window self-voice check. ms timestamp. */
  speechStartedAt?: number;
}

export interface HeuristicResult {
  verdict: PerceptionVerdict;
  /** Short human-readable reason; included in the [CLASSIFIER] log line. */
  reason: string;
  /** Score for the self-voice match (0..1). Surfaced so the log review can
   *  spot near-misses and tune the threshold. */
  selfVoiceScore?: number;
}

// ── Lexicons ──────────────────────────────────────────────────────────

/** Hesitations — carry no meaning in ANY state; short utterances made only
 *  of these always drop as filler. */
const HESITATION_TOKENS = new Set<string>([
  '', 'uh', 'um', 'umm', 'er', 'erm', 'hmm', 'hm',
  'mm', 'mmm', 'ah', 'oh',
]);

/** Acknowledgements — backchannel while the tutor is speaking/thinking
 *  (drop as filler: defence layer 3, false-barge-in protection), but a
 *  real ANSWER while the tutor is listening ("shall we move on?" →
 *  "yeah, okay"). Since Stage 4 made the perception WS the sole input
 *  authority, a filler verdict in 'listening' is a silent drop — so these
 *  must classify as new_turn there (live regression 2026-07-11: "Yeah,
 *  okay." ignored 3× in a row). */
const ACK_TOKENS = new Set<string>([
  'ok', 'okay', 'yeah', 'yep', 'yup', 'mhm', 'mhmm', 'right',
]);

function inFillerLexicon(tok: string): boolean {
  return HESITATION_TOKENS.has(tok) || ACK_TOKENS.has(tok);
}

const BARGE_IN_TRIGGERS = [
  'stop', 'wait', 'no,', 'no.', 'actually', 'hold on', 'but ', 'i mean',
  'sorry', 'pause',
];

const QUESTION_TRIGGERS = ['why', 'how', 'what', 'when', 'where', 'who'];

const CONTINUATION_LEAD_TOKENS = new Set<string>([
  'and', 'also', 'plus', 'or', 'because', 'but', 'wait', 'oh',
]);

// ── Helpers ───────────────────────────────────────────────────────────

const NORMALIZE_PUNCT = /[.,!?;:"'()\[\]{}—–\-]/g;

function normalize(s: string): string {
  return s.toLowerCase().replace(NORMALIZE_PUNCT, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(s: string): string[] {
  const n = normalize(s);
  if (!n) return [];
  return n.split(' ').filter(Boolean);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  return inter / (a.size + b.size - inter);
}

function ngrams(tokens: string[], n: number): string[] {
  if (tokens.length < n) return [];
  const out: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    out.push(tokens.slice(i, i + n).join(' '));
  }
  return out;
}

// ── Self-voice scoring ───────────────────────────────────────────────

/**
 * Defence layer 1 (Q1.5 in the design). Score how likely the transcript
 * is the tutor's own voice leaking through the speaker → mic loop.
 *
 *   - 0.0 = clearly student speech (no overlap with TTS)
 *   - 1.0 = identical to a recent TTS line
 *
 * Approach: combine Jaccard token overlap with a sliding n-gram match
 * against any TTS line in the rolling buffer. The n-gram catches
 * partial echoes ("multiply zero point one five by eighty" matches the
 * tutor's "multiply 0.15 by 80"). Jaccard catches re-orderings.
 *
 * Timing window (defence layer 2): only TTS lines whose
 * [spokenStartedAt - padding, spokenEndedAt + padding] window intersects
 * the student utterance start time are considered. Lines outside the
 * window can't echo physically — they've already faded.
 */
export const TTS_PADDING_LEAD_MS = 200;
// 1500ms since introduction — sized to cover perception-transcript latency
// (the mic→ASR round trip observed for an echoed line), not a value that
// was ever widened from a smaller default. With spokenEndedAt now stamped
// at REAL playback-end (V2, 2026-07-15), a verbatim echo ("Good question.")
// whose perception transcript lands up to ~1.5s after the audio faded
// still falls inside the window and gets dropped by the matcher.
export const TTS_PADDING_TRAIL_MS = 1500;

export function scoreSelfVoice(
  transcript: string,
  recentTtsScripts: RecentTtsScript[],
  speechStartedAt: number | undefined,
  now: number,
): number {
  const tTokens = tokenize(transcript);
  if (tTokens.length === 0) return 0;
  const tSet = new Set(tTokens);
  const t3 = new Set(ngrams(tTokens, Math.min(3, tTokens.length)));
  let best = 0;
  const studentT = speechStartedAt ?? now;
  for (const s of recentTtsScripts) {
    const winStart = s.spokenStartedAt - TTS_PADDING_LEAD_MS;
    const winEnd = (s.spokenEndedAt ?? now) + TTS_PADDING_TRAIL_MS;
    if (studentT < winStart || studentT > winEnd) continue;
    const sTokens = tokenize(s.text);
    if (sTokens.length === 0) continue;
    const sSet = new Set(sTokens);
    const j = jaccard(tSet, sSet);
    let ngramHit = 0;
    if (t3.size > 0) {
      const s3 = new Set(ngrams(sTokens, 3));
      let hit = 0;
      for (const g of t3) if (s3.has(g)) hit += 1;
      ngramHit = hit / Math.max(t3.size, 1);
    }
    // Containment: short transcripts that are entirely inside a TTS line.
    const containment = tTokens.every((tok) => sSet.has(tok)) ? 1 : 0;
    const score = Math.max(j, ngramHit, containment * 0.9);
    if (score > best) best = score;
  }
  return best;
}

/** Self-voice threshold tuned conservatively. Scores ≥ this drop. Tuning
 *  lever in Stage 1 review — log all transcripts with their score, look
 *  for false positives (real student speech echoing tutor vocabulary),
 *  raise threshold if needed. */
export const SELF_VOICE_THRESHOLD = 0.55;

// ── Heuristic ────────────────────────────────────────────────────────

export function classifyHeuristic(input: HeuristicInput): HeuristicResult {
  const text = input.transcript.trim();
  const norm = normalize(text);
  const tokens = tokenize(text);
  const wordCount = tokens.length;

  // 0. Empty → noise. Catches OpenAI's occasional empty-transcript event.
  if (wordCount === 0) return { verdict: 'noise', reason: 'empty transcript' };

  // 1. Self-voice (defence layers 1+2 — script-cancellation + timing).
  const selfVoiceScore = scoreSelfVoice(
    text, input.recentTtsScripts, input.speechStartedAt, input.now,
  );
  if (selfVoiceScore >= SELF_VOICE_THRESHOLD) {
    return {
      verdict: 'drop_self_voice',
      reason: `self-voice score ${selfVoiceScore.toFixed(2)} ≥ ${SELF_VOICE_THRESHOLD}`,
      selfVoiceScore,
    };
  }

  const state = input.productionState;

  // 2. Filler tokens — state-aware (2026-07-11). While the tutor is
  // LISTENING (or 'connected'), an utterance containing an acknowledgement
  // is the student's answer and falls through to the state branch below
  // (→ new_turn, which the perception direct-dispatch path fires as a
  // brain turn). Pure hesitations drop in every state; acknowledgements
  // during speaking/processing/transient states drop as before.
  if (wordCount <= 2 && tokens.every(inFillerLexicon)) {
    const isListening = state === 'listening' || state === 'connected';
    const pureHesitation = tokens.every((t) => HESITATION_TOKENS.has(t));
    if (pureHesitation || !isListening) {
      const reason = wordCount === 1 ? `filler token "${tokens[0]}"` : 'filler bigram';
      return { verdict: 'filler', reason, selfVoiceScore };
    }
    // Listening + at least one acknowledgement token ("yeah", "um yeah",
    // "yeah okay") — a real answer; fall through to the state branch.
  }

  // 3. State-dependent verdicts.

  if (state === 'speaking') {
    // Defence layer 3 — raise the barge-in bar while TTS is playing.
    const hasBargeTrigger = BARGE_IN_TRIGGERS.some((tok) => norm.includes(tok));
    if (hasBargeTrigger) {
      return { verdict: 'barge_in', reason: 'speaking + barge trigger', selfVoiceScore };
    }
    const hasQuestionShape =
      text.includes('?') ||
      tokens.some((tok) => QUESTION_TRIGGERS.includes(tok));
    if (hasQuestionShape && wordCount >= 3) {
      return { verdict: 'barge_in', reason: 'speaking + question shape ≥3w', selfVoiceScore };
    }
    if (wordCount < 3) {
      return { verdict: 'filler', reason: 'speaking + brief (<3w)', selfVoiceScore };
    }
    return { verdict: 'escalate', reason: 'speaking + ambiguous mid-length speech', selfVoiceScore };
  }

  if (state === 'processing') {
    // Production WS 'processing' = transcription in flight OR brain in
    // flight. Q2 spec: thinking-state perception transcripts are
    // continuation/barge-in candidates; escalate to Haiku to discriminate.
    // Heuristic short-circuit for clearly-continuation leads.
    const startsWithContinuation = CONTINUATION_LEAD_TOKENS.has(tokens[0]);
    if (startsWithContinuation && wordCount <= 8) {
      return { verdict: 'continuation', reason: 'thinking + continuation lead, short', selfVoiceScore };
    }
    if (wordCount < 3) {
      return { verdict: 'filler', reason: 'thinking + brief (<3w)', selfVoiceScore };
    }
    return { verdict: 'escalate', reason: 'thinking + ambiguous (continuation vs barge)', selfVoiceScore };
  }

  if (state === 'listening' || state === 'connected') {
    // Existing path — real student turn. Heuristic doesn't need to ask.
    return { verdict: 'new_turn', reason: 'listening + non-filler', selfVoiceScore };
  }

  // connecting / disconnected / error / recording — pre-session or
  // transient. Treat as noise (no action would be taken anyway).
  return { verdict: 'noise', reason: `transient prod state "${state}"`, selfVoiceScore };
}
