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
  /** Round-6 live-test fix (portal-cca76850): was the tutor AUDIBLY SPEAKING
   *  (production state 'speaking') at this utterance's VAD onset? Derived by
   *  the component from recorded state transitions — an evidence source
   *  independent of script playback stamps, which a barge-in kill + resume
   *  splinters (the killed sentence's window is closed by transcript-arrival
   *  time, so `onsetDuringScriptPlayback` finds nothing and the echo
   *  dispatches). Optional: callers without state history omit it and the
   *  script-window check governs alone. */
  onsetDuringTutorSpeech?: boolean;
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

/** Brief-answer shapes that must never drop as "<3w" filler — the
 *  2026-07-24 incident class (session-1784908707278): a student answering
 *  a counting question with a bare "4." / "3" while the prod state was
 *  speaking/processing hit the brief-filler branches and vanished with no
 *  consumer (a filler verdict outside a cancel checkpoint is a silent
 *  drop). isNoiseTranscript gained its digit exemption in 5ab1179d
 *  (the "6." incident); this is the same exemption for this classifier.
 *  Kept narrow — bare numbers ("4", "-3", "3.5", "3/4"), number words
 *  ("three", "negative four"), single-letter multiple-choice answers —
 *  and routed to 'escalate' (Haiku discriminates), NOT straight to
 *  dispatch, so the echo/false-barge-in defences keep their say. */
const NUMBER_WORDS = new Set<string>([
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty',
  'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred',
  'thousand', 'half', 'third', 'quarter', 'negative', 'minus', 'point',
]);
// Note: '/' is not in NORMALIZE_PUNCT, so "3/4" survives as one token.
const NUMERIC_TOKEN_RE = /^-?\d+(?:\.\d+)?(?:\/\d+)?$/;

function isBriefAnswerShape(tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  if (tokens.length === 1 && /^[a-e]$/.test(tokens[0])) return true;
  return tokens.every((t) => NUMERIC_TOKEN_RE.test(t) || NUMBER_WORDS.has(t));
}

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

/** Raw word count — splits on whitespace only, so contractions ("what's")
 *  count as ONE word. Deliberately distinct from `tokenize().length`, which
 *  splits "what's" into ["what","s"] (apostrophe is punctuation to the text
 *  matcher) — that's correct for token-overlap scoring but would over-count
 *  words for the speaking-state ≤4-word gate below ("Badu, what's now
 *  Badu?" is 4 words to a human, 5 tokens after punctuation-splitting). */
function rawWordCount(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

// ── Phonetic normalizer (echo-fix V3, 2026-07-15) ────────────────────
//
// ASR sometimes garbles the tutor's own echoed speech at the CONSONANT
// level ("Badu" transcribed for "Dadu" — the actual portal-81f2b582
// incident) rather than just dropping/duplicating whole words the way V1/V2
// already handle. Exact and n-gram TEXT matching (above) can't see past a
// misheard letter, so short ASR-garbled echoes were sailing through the
// 0.55 self-voice gate and dispatching as real turns.
//
// This is a compact, dependency-free Soundex/double-metaphone-style
// normalizer: reduce each word to a CONSONANT-CLASS SKELETON (vowels
// stripped, confusable consonants collapsed to one symbol) plus a VOWEL
// COUNT suffix, then compare skeletons for exact equality.
//
// Mapping table (consonant → class symbol):
//   b, p, d, t, g, k, c, q  →  K   (all six plain stops — see below)
//   v, f                    →  F   (labiodental fricative pair)
//   z, s, x                 →  S   (sibilant pair)
//   m, n                    →  N   (nasals)
//   l, r                    →  R   (liquids)
//   h, w, y, j (etc.)       →  themselves, uppercased (unmapped — left
//                               distinct; collapsing them further didn't
//                               help any known confusion and costs
//                               discriminating power)
//   a, e, i, o, u           →  dropped from the skeleton, but counted
//                               (see "vowel count" below)
//
// Why ALL SIX stops collapse to one class (not just the voiced/unvoiced
// pairs b/p, d/t, g/k the spec names): the incident is "Badu" heard for
// "Dadu" — a PLACE-of-articulation confusion (bilabial b vs alveolar d),
// not a voicing confusion. b/p pairing alone doesn't bridge b↔d. Since
// telling "which flavor of stop-consonant got misheard" apart doesn't help
// self-echo detection (either way it's "some stop got heard as another
// stop" in a short, coarticulated proper noun), all eight stop letters
// collapse together. This is a deliberate, documented widening beyond the
// minimal spec, justified by the actual incident data.
//
// Why a VOWEL COUNT suffix: collapsing all stops to one class is lossy
// enough that unrelated words start colliding — "about" (b,t → stops,
// 3 vowel letters a-o-u) reduces to the SAME stop-only skeleton as "Dadu"
// (d,d → stops, 2 vowel letters a-u) if vowels are simply discarded. That
// coincidence would false-positive-match ordinary vocabulary ("what about
// the Ming?") against an unrelated script line purely because both happen
// to have a stop-vowel-stop-vowel shape. Appending the vowel-letter COUNT
// (not the vowels themselves, which ASR also garbles) cheaply separates
// "badu"/"dadu" (both 2 vowels → still match) from "about" (3 vowels →
// no longer collides). Verified empirically against the incident + guard
// cases below (see `test-perception-classifier.ts`).
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
const CONSONANT_CLASS: Record<string, string> = {
  b: 'K', p: 'K', d: 'K', t: 'K', g: 'K', k: 'K', c: 'K', q: 'K',
  v: 'F', f: 'F',
  z: 'S', s: 'S', x: 'S',
  m: 'N', n: 'N',
  l: 'R', r: 'R',
};

/** Reduce one word to its phonetic skeleton + vowel-count code, e.g.
 *  phoneticCode('Dadu') === phoneticCode('Badu') === 'KK#2'. Consecutive
 *  letters of the SAME class collapse to one symbol UNLESS a vowel
 *  separates them (mirrors classic Soundex: "Badu"'s two stops are
 *  separated by a vowel and both survive; a doubled letter like "Badd"
 *  collapses to one). */
function phoneticCode(word: string): string {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return '';
  let skeleton = '';
  let prevClass = '';
  let vowelCount = 0;
  for (const ch of w) {
    if (VOWELS.has(ch)) {
      vowelCount += 1;
      prevClass = '';
      continue;
    }
    const cls = CONSONANT_CLASS[ch] ?? ch.toUpperCase();
    if (cls === prevClass) continue;
    skeleton += cls;
    prevClass = cls;
  }
  if (!skeleton) skeleton = w[0].toUpperCase(); // all-vowel word fallback
  return `${skeleton}#${vowelCount}`;
}

function phoneticTokens(tokens: string[]): string[] {
  return tokens.map(phoneticCode).filter(Boolean);
}

/** Words excluded from the speaking-state short-utterance echo check
 *  (below) — high-frequency function words are phonetically generic (any
 *  two lines of English share several), so letting them count as "content
 *  overlap" produces false positives on totally unrelated short utterances
 *  ("what about the Ming?" sharing "what"/"the" with the TTS script). Reuses
 *  the file's existing filler/question/ack lexicons rather than
 *  maintaining a parallel list. Exact matches on these words are still
 *  caught by the (unfiltered) text/phonetic mirror pass in `scoreSelfVoice`. */
const PHONETIC_STOPWORDS = new Set<string>([
  'a', 'an', 'the', 'of', 'to', 'in', 'on', 'at', 'up', 'with', 'for',
  'as', 'by', 'about', 'into', 'onto', 'from', 'over', 'under', 'off',
  'out', 'and', 'or', 'but', 'so',
  'it', 'its', 'this', 'that', 'these', 'those',
  's', 'll', 're', 've', 'd', // contraction remnants after apostrophe-strip
  ...QUESTION_TRIGGERS,
  ...HESITATION_TOKENS,
  ...ACK_TOKENS,
]);

function contentTokens(tokens: string[]): string[] {
  return tokens.filter((tok) => !PHONETIC_STOPWORDS.has(tok));
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
 *
 * Phonetic pass (defence layer 1b, echo-fix V3): alongside the literal-text
 * jaccard/n-gram/containment above, the SAME three measures are computed
 * over each line's PHONETIC-CODE tokens (`phoneticCode`, unfiltered —
 * stopwords included, mirroring the text pass exactly) and combined via
 * max. This is intentionally the CONSERVATIVE phonetic pass: it requires
 * broad multi-word agreement (containment needs every code to match,
 * jaccard/n-gram dilute over the whole line) the same way the text pass
 * already does, so a single incidentally-similar-sounding word elsewhere in
 * a long real answer can't tip it over — only a genuinely close overall
 * match (e.g. "Badu, what's now Badu?" against "...Dadu, what's now
 * Beijing", which matches on 4 of its 5 tokens) crosses 0.55. The MORE
 * aggressive single-content-word phonetic check for short utterances during
 * `state==='speaking'` is a separate function below (`scoreSpeakingEchoOverlap`)
 * — see its doc comment for why that one needs its own, narrower gate.
 */
export const TTS_PADDING_LEAD_MS = 200;
// 1500ms since introduction — sized to cover perception-transcript latency
// (the mic→ASR round trip observed for an echoed line), not a value that
// was ever widened from a smaller default. With spokenEndedAt now stamped
// at REAL playback-end (V2, 2026-07-15), a verbatim echo ("Good question.")
// whose perception transcript lands up to ~1.5s after the audio faded
// still falls inside the window and gets dropped by the matcher.
export const TTS_PADDING_TRAIL_MS = 1500;

// ── Echo anchor (Task X6, 2026-07-16) ────────────────────────────────
//
// Physical fact the anchor encodes: an echo of the tutor's own voice
// CANNOT BEGIN after the speaker stopped emitting it. So the moment the
// student's speech STARTED (`speechStartedAt`, the perception WS's VAD
// onset, reconstructed in the caller as `Date.now() - transcript.latencyMs`
// — same wall-clock domain as V2's real playback-stamped `spokenEndedAt`)
// must fall at or before playback end for a candidate to be self-voice.
// Speech that BEGINS after a script's playback ended is the student, not
// that script's echo.
//
// This anchor gates ONLY the lenient CONTAINMENT measures (text + phonetic)
// — the ones that lift a SHORT utterance to a drop purely because it sits
// entirely inside a longer line (`containment`/`containmentPhon` below).
// That containment lift is exactly the DOMINANT known false positive: the
// tutor asks "...Dadu or Karakorum?", the student answers "Dadu" a beat
// after the audio faded, and the 1-word answer trivially contains-matches.
// The broad-agreement measures (jaccard, n-gram) are deliberately NOT
// anchored: a verbatim FULL-line echo scores ~1.0 on those regardless of
// containment and legitimately still drops even when its perception
// transcript lands a fraction of a second after playback end (VAD onset lag
// + trail window) — most real answers don't reproduce a whole tutor line,
// but close partial-phrasing restatements (e.g., "the capital was Dadu") can
// still cross jaccard 0.55 in post-playback timings; this is a known
// residual FP class, deferred to follow-up echo/restatement discrimination.
//
// ε (ECHO_ANCHOR_EPSILON_MS): VAD-onset slop. The perception WS stamps
// `speech_started` only after enough energy accumulates to trip its
// detector, so the VAD-reported onset LAGS the true acoustic onset by a
// small margin (~100-200ms for server VAD). A genuine echo whose acoustic
// onset was at/just-before `spokenEndedAt` can therefore be VAD-reported up
// to ~that margin AFTER `spokenEndedAt`; ε keeps such an echo anchored-in.
// Set to 200ms — the top of the cited VAD-onset range. This value happens to
// equal TTS_PADDING_LEAD_MS by coincidence (both are VAD-slop budgets, but
// serve semantically distinct purposes: ε gates echo-anchor policy, while
// TTS_PADDING_LEAD_MS gates the TTS timing window). 200ms biases slightly
// toward preserving today's drop
// behaviour (fail toward NOT opening a new echo leak) while still fixing the
// FP: the incident answer began ≥0.4s (400ms > 200ms) after playback end.
export const ECHO_ANCHOR_EPSILON_MS = 200;

/** True when the student's speech could physically be an echo of THIS
 *  script — i.e. began (VAD onset) at or before the script's playback end,
 *  within ε. A null `spokenEndedAt` means the script is still playing at
 *  `now`, so the anchor is trivially satisfied (speech onset is always ≤
 *  now). Fail-safe: when `speechStartedAt` is unavailable (some payloads
 *  carry no onset), return true — keep today's behaviour rather than newly
 *  suppress a containment drop on missing data. */
function echoAnchorSatisfied(
  s: RecentTtsScript,
  speechStartedAt: number | undefined,
  now: number,
): boolean {
  if (speechStartedAt === undefined) return true;
  const end = s.spokenEndedAt ?? now;
  return speechStartedAt <= end + ECHO_ANCHOR_EPSILON_MS;
}

function scriptWindowContains(s: RecentTtsScript, studentT: number, now: number): boolean {
  const winStart = s.spokenStartedAt - TTS_PADDING_LEAD_MS;
  const winEnd = (s.spokenEndedAt ?? now) + TTS_PADDING_TRAIL_MS;
  return studentT >= winStart && studentT <= winEnd;
}

/**
 * Text-score and phonetic-score computed separately (fix wave, 2026-07-15,
 * review finding 3). `scoreSelfVoice` below just returns `Math.max` of the
 * two — same public behaviour as before this fix wave — but keeping the two
 * halves apart lets `classifyHeuristic` tell whether a drop verdict was
 * reached ONLY via the phonetic pass (text score stayed under threshold) so
 * the `[CLASSIFIER]` log line can say so distinctly, for the Stage-1 FP-rate
 * review to count phonetic-only drops separately from ordinary text-echo
 * drops.
 */
function scoreSelfVoiceDetailed(
  transcript: string,
  recentTtsScripts: RecentTtsScript[],
  speechStartedAt: number | undefined,
  now: number,
): { textScore: number; phonScore: number; textContainmentDominant: boolean } {
  const tTokens = tokenize(transcript);
  if (tTokens.length === 0) return { textScore: 0, phonScore: 0, textContainmentDominant: false };
  const tSet = new Set(tTokens);
  const t3 = new Set(ngrams(tTokens, Math.min(3, tTokens.length)));
  const tPhon = phoneticTokens(tTokens);
  const tPhonSet = new Set(tPhon);
  const tPhon3 = new Set(ngrams(tPhon, Math.min(3, tPhon.length)));
  // Fix wave (2026-07-15, review finding 2): how many CONTENT words (stop-
  // word-filtered) the transcript has. Used below to bound the phonetic
  // containment measure — see its comment.
  const tContentCount = contentTokens(tTokens).length;
  let bestText = 0;
  let bestPhon = 0;
  // Fix wave (2026-07-16, final review item 1): tracks whether the WINNING
  // text-score line's max came from containment alone — strictly above both
  // jaccard and n-gram for that line, not merely tied with them. This is the
  // known short-answer FP class (KNOWN PRE-EXISTING FALSE POSITIVE comment
  // above): a short transcript ("Dadu") trivially contained in a long TTS
  // line ("...Dadu or Karakorum?") where jaccard/n-gram are diluted by the
  // line's length and never approach containment's 0.9. When jaccard or
  // n-gram are ALSO ≥0.9 for the winning line (e.g. an exact full-line echo
  // like "Good question." matching "Good question."), containment isn't
  // uniquely responsible for the drop, so this stays false and the ordinary
  // "self-voice score" reason applies — only the narrow containment-only FP
  // class gets the distinct marker.
  let bestTextContainmentDominant = false;
  const studentT = speechStartedAt ?? now;
  for (const s of recentTtsScripts) {
    if (!scriptWindowContains(s, studentT, now)) continue;
    const sTokens = tokenize(s.text);
    if (sTokens.length === 0) continue;
    // Echo anchor (Task X6): the lenient containment measures below apply
    // only if the student's speech began while this script's audio could
    // still be playing (onset ≤ playback end + ε). Speech that began after
    // playback ended is a student answer, not this line's echo — so its
    // containment lift is withheld (jaccard/n-gram stay in play). See
    // `echoAnchorSatisfied` for the physical rationale + ε justification.
    const anchorOk = echoAnchorSatisfied(s, speechStartedAt, now);
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
    //
    // FORMERLY the DOMINANT known false positive (documented 2026-07-15,
    // fix-wave review finding 4), NOW REMEDIED by the echo anchor (Task X6,
    // 2026-07-16 — `anchorOk` above): this containment check used to drop a
    // student's exact-echo 1-word ANSWER when it landed in the trail window
    // right after the tutor asked about that exact word — the tutor says
    // "...Dadu or Karakorum?" and the student answers "Dadu", trivially
    // `containment=1` against the line that literally contains "Dadu". The
    // anchor now withholds the containment lift when the student's speech
    // BEGAN after playback ended (+ε) — a real post-question answer no longer
    // qualifies, while a genuine echo (which necessarily begins during, or
    // within ε of, playback) still does. The jaccard/n-gram measures stay
    // un-anchored so a verbatim full-line echo arriving just after playback
    // still drops (see `echoAnchorSatisfied`).
    const containment = anchorOk && tTokens.every((tok) => sSet.has(tok)) ? 1 : 0;

    // Phonetic mirror of the three text measures above (V3) — catches
    // ASR-garbled echoes ("Badu" for "Dadu") that share no literal text
    // but reduce to the same consonant-skeleton+vowel-count codes.
    const sPhon = phoneticTokens(sTokens);
    const sPhonSet = new Set(sPhon);
    const jPhon = jaccard(tPhonSet, sPhonSet);
    let ngramHitPhon = 0;
    if (tPhon3.size > 0) {
      const sPhon3 = new Set(ngrams(sPhon, 3));
      let hit = 0;
      for (const g of tPhon3) if (sPhon3.has(g)) hit += 1;
      ngramHitPhon = hit / Math.max(tPhon3.size, 1);
    }
    // Fix wave (2026-07-15, review finding 2): phonetic CONTAINMENT alone is
    // too aggressive for a transcript with ≤1 CONTENT word. The mega-stop-
    // class (b/p/d/t/g/k/c/q → one class, see `CONSONANT_CLASS` above)
    // deliberately collapses many short, otherwise-unrelated words to the
    // same code — "big"/"dig"/"pig"/"pick" all reduce to "KK#1" — so a bare
    // 1-content-word transcript that merely SOUNDS like a single script
    // token (in ANY production state, since scoreSelfVoice runs
    // unconditionally) would otherwise drop unconditionally on pure
    // coincidental phonetic resemblance to one word, with no other content
    // to corroborate it. Excluding containment when tContentCount<=1 fixes
    // this; jaccard/n-gram phonetic measures deliberately stay in play (they
    // dilute across the whole script line, so a single-word coincidence
    // can't dominate them the way containment lets it). Text containment is
    // UNCHANGED — an exact literal-word echo is legitimately suspicious even
    // as a single word (see the known-FP comment above, which is a separate,
    // pre-existing concern).
    const containmentPhon =
      anchorOk && tContentCount > 1 && tPhon.length > 0 && tPhon.every((code) => sPhonSet.has(code))
        ? 1
        : 0;

    const textScore = Math.max(j, ngramHit, containment * 0.9);
    const phonScore = Math.max(jPhon, ngramHitPhon, containmentPhon * 0.9);
    if (textScore > bestText) {
      bestText = textScore;
      bestTextContainmentDominant = containment === 1 && j < 0.9 && ngramHit < 0.9;
    }
    if (phonScore > bestPhon) bestPhon = phonScore;
  }
  return { textScore: bestText, phonScore: bestPhon, textContainmentDominant: bestTextContainmentDominant };
}

export function scoreSelfVoice(
  transcript: string,
  recentTtsScripts: RecentTtsScript[],
  speechStartedAt: number | undefined,
  now: number,
): number {
  const { textScore, phonScore } = scoreSelfVoiceDetailed(
    transcript, recentTtsScripts, speechStartedAt, now,
  );
  return Math.max(textScore, phonScore);
}

/** Self-voice threshold tuned conservatively. Scores ≥ this drop. Tuning
 *  lever in Stage 1 review — log all transcripts with their score, look
 *  for false positives (real student speech echoing tutor vocabulary),
 *  raise threshold if needed. */
export const SELF_VOICE_THRESHOLD = 0.55;

// ── Speaking-state asymmetry (echo-fix V3) ────────────────────────────
//
// The remaining leak after the conservative pass above: a SHORT (≤4-word)
// utterance during 'speaking' where only ONE word actually carries the
// echo signal (e.g. "actually turn" against "...the Yuan actually used the
// Mongol title" — "actually" is a verbatim/phonetic hit, "turn" is not).
// scoreSelfVoice's containment/jaccard/n-gram measures all dilute that
// single hit across the whole line and don't cross 0.55 (correctly — that
// broad-agreement requirement is what keeps scoreSelfVoice safe to run
// UNCONDITIONALLY, in every state, against real answers that legitimately
// reuse one or two tutor words).
//
// This function is deliberately MORE lenient: content-word (stopword-
// filtered) EXACT match, verbatim or phonetic, counted per transcript word
// and averaged. It is only ever consulted by `classifyHeuristic` when BOTH
// (a) the utterance is ≤4 raw words AND (b) production state is literally
// 'speaking' — i.e. exactly the high-prior-echo, low-blast-radius zone V1's
// sustained-energy gate has already filtered real sustained speech out of.
// Outside that zone this function is never called, so its extra leniency
// can't leak into misclassifying a genuine short answer during
// 'listening', for instance.
//
// Fix wave (2026-07-15, review finding 1): the gate ORIGINALLY also fired
// whenever the transcript landed in the trailing echo window of a just-
// played script (`state === 'speaking' || inTrailWindowOfAnyScript(...)`),
// even after production state had already flipped to 'listening'. That
// extended this lenient 0.5 threshold into 'listening' for up to
// TTS_PADDING_TRAIL_MS (1.5s) after the tutor stopped talking — long enough
// to swallow a genuine ≤4-word ANSWER to the question the tutor had just
// asked (probe-confirmed: student said "Dadu definitely" ~0.5s after "...was
// the capital Dadu or Karakorum?" and it was dropped with state=listening,
// reason citing the trail window, not 'speaking'). Tier 1's symmetric,
// conservative time-window scoring (`scoreSelfVoice`, which does NOT get
// more lenient post-speaking) still covers genuine post-speaking echoes, so
// the trail-window branch of this gate was pure false-positive surface with
// no compensating catch. Removed — this function is now consulted ONLY when
// `productionState === 'speaking'`, full stop.
//
// Echo-anchor audit (Task X6, 2026-07-16): the tier-1 echo anchor
// (`echoAnchorSatisfied`) is deliberately NOT applied here, and this is NOT
// an oversight. The anchor withholds a self-voice drop when the student's
// speech BEGAN after playback ended; but this function is reached ONLY while
// `productionState === 'speaking'`, i.e. the tutor's audio is by definition
// still playing (the currently-playing script's `spokenEndedAt` is null →
// anchor TRIVIALLY satisfied). The post-playback FP the anchor targets can
// only occur once production has flipped to 'listening', where this function
// is never consulted. Adding the anchor here would be redundant double-
// gating with no case it could catch that the state gate doesn't already
// exclude.
function scoreSpeakingEchoOverlap(
  transcript: string,
  recentTtsScripts: RecentTtsScript[],
  speechStartedAt: number | undefined,
  now: number,
): number {
  const tContent = contentTokens(tokenize(transcript));
  if (tContent.length === 0) return 0;
  const tPhonContent = tContent.map(phoneticCode);
  const studentT = speechStartedAt ?? now;
  let best = 0;
  for (const s of recentTtsScripts) {
    if (!scriptWindowContains(s, studentT, now)) continue;
    const sContent = contentTokens(tokenize(s.text));
    if (sContent.length === 0) continue;
    const sContentSet = new Set(sContent);
    const sPhonContentSet = new Set(sContent.map(phoneticCode));
    let matches = 0;
    for (let i = 0; i < tContent.length; i++) {
      const verbatim = sContentSet.has(tContent[i]);
      const phonetic = sPhonContentSet.has(tPhonContent[i]);
      if (verbatim || phonetic) matches += 1;
    }
    const score = matches / tContent.length;
    if (score > best) best = score;
  }
  return best;
}

/** Was the tutor AUDIBLY SPEAKING at `onsetMs` — i.e. does the onset land
 *  inside some script's actual playback span (spokenStartedAt..spokenEndedAt,
 *  ± the ε VAD-onset slop)? The 1.5s TRAIL window deliberately does NOT
 *  count: speech beginning right after the tutor stops is the documented
 *  genuine-answer zone ("Dadu definitely", 2026-07-15 finding 1), while
 *  speech beginning DURING playback is the high-prior-echo overtalk zone
 *  this predicate exists to identify. A never-stamped script
 *  (spokenEndedAt null = still playing) counts through `now`. */
function onsetDuringScriptPlayback(
  recentTtsScripts: RecentTtsScript[],
  onsetMs: number,
  now: number,
): boolean {
  return recentTtsScripts.some((s) => {
    // 0 = never actually played (skipped/drained — see RecentTtsScript doc);
    // an unplayed script can't have been audible at any onset, and its null
    // spokenEndedAt would otherwise read as "still playing" and match
    // everything.
    if (!s.spokenStartedAt) return false;
    const end = (s.spokenEndedAt ?? now) + ECHO_ANCHOR_EPSILON_MS;
    return onsetMs >= s.spokenStartedAt - ECHO_ANCHOR_EPSILON_MS && onsetMs <= end;
  });
}

/** `scoreSpeakingEchoOverlap` without the per-script window filter: best
 *  lenient content-word overlap against EVERY script in the buffer (the
 *  caller's buffer is already bounded to a 30s onset-anchored lookback).
 *  Only ever consulted by tier 1.6, which has already established the
 *  utterance's onset fell during tutor playback — inside that overtalk
 *  zone the echoed word may belong to a splinter of a killed-and-resumed
 *  turn whose own playback window is long past by transcript-arrival time,
 *  which is exactly why the window filter must not apply. */
function scoreLookbackEchoOverlap(
  transcript: string,
  recentTtsScripts: RecentTtsScript[],
): number {
  const tContent = contentTokens(tokenize(transcript));
  if (tContent.length === 0) return 0;
  const tPhonContent = tContent.map(phoneticCode);
  let best = 0;
  for (const s of recentTtsScripts) {
    // Echo can only carry words that were actually AUDIBLE — skip scripts
    // that never reached playback (spokenStartedAt 0, see RecentTtsScript).
    if (!s.spokenStartedAt) continue;
    const sContent = contentTokens(tokenize(s.text));
    if (sContent.length === 0) continue;
    const sContentSet = new Set(sContent);
    const sPhonContentSet = new Set(sContent.map(phoneticCode));
    let matches = 0;
    for (let i = 0; i < tContent.length; i++) {
      const verbatim = sContentSet.has(tContent[i]);
      const phonetic = sPhonContentSet.has(tPhonContent[i]);
      if (verbatim || phonetic) matches += 1;
    }
    const score = matches / tContent.length;
    if (score > best) best = score;
  }
  return best;
}

/** Lower bar than SELF_VOICE_THRESHOLD, deliberately: scoped narrowly (≤4
 *  words, 'speaking'/trail-window only — see `scoreSpeakingEchoOverlap`
 *  doc comment) so the extra leniency can't reach a real answer given
 *  during 'listening'. At 0.5, an utterance needs at least HALF its
 *  content words to exactly match (verbatim or phonetic) — for the typical
 *  1–2 content-word short utterance this means at least one strong,
 *  specific match, not an incidental partial resemblance. Calibrated
 *  against the incident + guard cases (see test file): drop-cases score
 *  1.0, keep-cases score 0.0 — wide margin, so the exact cutover point
 *  isn't fragile. */
export const SPEAKING_ECHO_OVERLAP_THRESHOLD = 0.5;

/** Round-6e: stricter bar for the 5-10-word onset-during-speech echo gate
 *  (tier 1.7) — longer utterances carry more evidence, so demand near-total
 *  overlap before calling them echo. See the tier 1.7 comment. */
export const MIDLENGTH_ECHO_OVERLAP_THRESHOLD = 0.8;

/**
 * Offered-option echo exemption (live round 5, 2026-07-23,
 * session-1784778855564): the tutor asked "…or should we move to free body
 * diagrams next?" and the student answered by PICKING the offered option
 * verbatim — "Free body diagrams." Containment scored sv=1.00 and the
 * answer was dropped as self-voice; the student had to repeat it.
 *
 * A short utterance is treated as an option-pick ANSWER (not echo) when ALL
 * of these hold — each one narrows the echo risk:
 *  - production state is 'listening' (the tutor is silent; live overtalk
 *    echo keeps today's drop);
 *  - the matched in-window script is a QUESTION (ends with '?') — a student
 *    only "picks" from something that was asked;
 *  - every content token of the utterance appears in that question
 *    (it IS an echo of offered words — that's the point);
 *  - the utterance does NOT contain the question's final word: a mic echo
 *    replays the contiguous TAIL ("…free body diagrams next"), while a
 *    student picking an option drops the trailing word(s);
 *  - speech ONSET is known and lands clearly AFTER the question finished
 *    playing (past the ε VAD-onset slop) — an onset during playback is the
 *    speaker in the mic, not a student answering; unknown onset fails safe
 *    to today's drop.
 */
export function isOfferedOptionEcho(
  transcript: string,
  recentTtsScripts: RecentTtsScript[],
  productionState: ProductionStateForClassifier,
  speechStartedAt: number | undefined,
  now: number,
): boolean {
  if (productionState !== 'listening') return false;
  if (speechStartedAt === undefined) return false;
  const tTokens = tokenize(transcript);
  const tContent = contentTokens(tTokens);
  if (tContent.length === 0 || tContent.length > 5) return false;
  const studentT = speechStartedAt;
  for (const s of recentTtsScripts) {
    if (!scriptWindowContains(s, studentT, now)) continue;
    if (!s.text.trim().endsWith('?')) continue;
    if (s.spokenEndedAt == null || studentT <= s.spokenEndedAt + ECHO_ANCHOR_EPSILON_MS) continue;
    const qTokens = tokenize(s.text);
    if (qTokens.length < 2) continue;
    const qSet = new Set(contentTokens(qTokens));
    if (!tContent.every((t) => qSet.has(t))) continue;
    const lastWord = qTokens[qTokens.length - 1];
    if (tTokens.includes(lastWord)) continue;
    return true;
  }
  return false;
}

// ── Heuristic ────────────────────────────────────────────────────────

export function classifyHeuristic(input: HeuristicInput): HeuristicResult {
  const text = input.transcript.trim();
  const norm = normalize(text);
  const tokens = tokenize(text);
  const wordCount = tokens.length;

  // 0. Empty → noise. Catches OpenAI's occasional empty-transcript event.
  if (wordCount === 0) return { verdict: 'noise', reason: 'empty transcript' };

  // 1. Self-voice (defence layers 1+2 — script-cancellation + timing).
  const {
    textScore: selfVoiceTextScore,
    phonScore: selfVoicePhonScore,
    textContainmentDominant,
  } = scoreSelfVoiceDetailed(
    text, input.recentTtsScripts, input.speechStartedAt, input.now,
  );
  const selfVoiceScore = Math.max(selfVoiceTextScore, selfVoicePhonScore);
  // Offered-option pick beats the echo drop (see isOfferedOptionEcho doc):
  // exemption granted → fall through to the normal state-aware
  // classification below, which lands the utterance as a real turn.
  const offeredOptionPick =
    selfVoiceScore >= SELF_VOICE_THRESHOLD &&
    isOfferedOptionEcho(
      text, input.recentTtsScripts, input.productionState, input.speechStartedAt, input.now,
    );
  if (selfVoiceScore >= SELF_VOICE_THRESHOLD && !offeredOptionPick) {
    // Fix wave (2026-07-15, review finding 3): when the drop verdict was
    // reached ONLY via the phonetic pass (text score alone stayed under
    // threshold), say so distinctly in the reason string so the Stage-1 FP
    // review can count phonetic-only drops separately from ordinary
    // text-echo drops — they're a materially different risk (a coincidental
    // sound-alike, not a literal repeated word).
    const phoneticOnly =
      selfVoicePhonScore >= SELF_VOICE_THRESHOLD && selfVoiceTextScore < SELF_VOICE_THRESHOLD;
    // Final-review fix wave (2026-07-16, item 1): when the drop was reached
    // via tier-1 TEXT CONTAINMENT specifically — not jaccard/n-gram (see
    // `textContainmentDominant`'s doc comment) and not the phonetic pass —
    // mark it distinctly too, with the transcript word count, so prod logs
    // can count the known short-answer FP class documented above (the
    // tutor asks "...Dadu or Karakorum?" and the student's exact-echo
    // 1-word ANSWER "Dadu" trivially contains-matches).
    const containmentOnly =
      !phoneticOnly && selfVoiceTextScore >= SELF_VOICE_THRESHOLD && textContainmentDominant;
    const reason = phoneticOnly
      ? `phonetic-echo overlap ${selfVoicePhonScore.toFixed(2)} ≥ ${SELF_VOICE_THRESHOLD}`
      : containmentOnly
        ? `self-voice containment (${wordCount}w) ${selfVoiceScore.toFixed(2)}`
        : `self-voice score ${selfVoiceScore.toFixed(2)} ≥ ${SELF_VOICE_THRESHOLD}`;
    return {
      verdict: 'drop_self_voice',
      reason,
      selfVoiceScore,
    };
  }

  const state = input.productionState;

  // 1.5. Speaking-state asymmetry (echo-fix V3). A SHORT (≤4 raw-word)
  // utterance landing while the tutor is 'speaking' is disproportionately
  // likely to be an ASR-garbled self-echo that didn't quite clear the
  // conservative universal bar above (single distinctive word overlap,
  // diluted by scoreSelfVoice's whole-line measures). Within this narrow,
  // high-prior-echo zone we apply a more lenient overlap check and, if it
  // fires, drop unconditionally — this MUST run before the barge-trigger/
  // question-shape checks below, because a word like "actually" is both a
  // legitimate barge trigger AND, in this exact window, the tutor's own
  // last word bouncing back (portal-81f2b582: "actually turn" against
  // "...the Yuan actually used the Mongol title").
  //
  // Fix wave (2026-07-15, review finding 1): this gate used to ALSO fire
  // when `state !== 'speaking'` but the transcript landed in the trailing
  // echo window of a just-played script. That extended the lenient 0.5
  // threshold into 'listening' for up to TTS_PADDING_TRAIL_MS after the
  // tutor stopped talking, and swallowed genuine ≤4-word ANSWERS to
  // questions the tutor had just asked (probe-confirmed: "Dadu definitely"
  // ~0.5s after "...was the capital Dadu or Karakorum?", state=listening,
  // wrongly dropped). Tier 1 (`scoreSelfVoice`, unconditional, same
  // threshold in every state) still covers genuine post-speaking echoes, so
  // the trail-window branch added FP surface with no compensating catch.
  // Gate is now `state === 'speaking'` ONLY — a student who's genuinely
  // answering right after the tutor finishes talking now dispatches as
  // new_turn instead of being silently dropped.
  //
  // Policy for the ambiguous case where the student deliberately echoes
  // the tutor to ask about it (e.g. "Dadu? what's Dadu?" — 3 raw words,
  // phonetically AND verbatim identical to the script, but arguably a
  // genuine question): we deliberately do NOT try to distinguish "echo"
  // from "echo-as-question" here and let it drop. V1's sustained-energy
  // gate already guarantees a genuinely sustained, loud real interruption
  // still barges in regardless of this classifier, the ≤4-word cap bounds
  // how much could ever be lost this way, and the student can simply
  // re-ask once the tutor stops talking — cheaper than risking the
  // opposite failure mode (the actual incident: real echoes dispatching
  // as turns).
  if (rawWordCount(text) <= 4 && state === 'speaking') {
    const echoOverlap = scoreSpeakingEchoOverlap(
      text, input.recentTtsScripts, input.speechStartedAt, input.now,
    );
    if (echoOverlap >= SPEAKING_ECHO_OVERLAP_THRESHOLD) {
      return {
        verdict: 'drop_self_voice',
        reason: `speaking-state short-utterance echo overlap ${echoOverlap.toFixed(2)} ≥ ${SPEAKING_ECHO_OVERLAP_THRESHOLD}`,
        selfVoiceScore,
      };
    }
  }

  // 1.6. Onset-during-playback echo arriving after the state flipped
  // (round-6 opener-echo fix, 2026-07-28, portal-b3838f70). The 1.5 gate
  // above keys on CURRENT state, but STT latency routinely delivers a
  // transcript 4-8s after its speech onset — by which time a barge-in kill
  // (fired by the very same echo) has already flipped production to
  // 'listening', and the branch below would dispatch it unconditionally.
  // Worse, a kill + resume splits the tutor's turn into several short
  // playback windows, so the sentence that CONTAINS the echoed word can be
  // outside its own window+trail by transcript time while a resumed
  // sentence (without the word) is the only in-window script — tier 1
  // correctly scores ~0 and misses. Observed live: opener "…Praveen — last
  // time…" echoed, killed, resumed; "Praveen," landed in 'listening',
  // classified new_turn, and the tutor answered its own echo.
  //
  // Gate: the utterance's VAD ONSET fell while tutor audio was actually
  // playing (some script's spokenStartedAt..spokenEndedAt, ± the ε onset
  // slop — the TRAIL window deliberately does NOT count, that's the "Dadu
  // definitely" genuine-answer zone). Within that overtalk-onset zone,
  // apply the same lenient ≤4-word overlap as 1.5 but against EVERY script
  // in the (already 30s-bounded) buffer, window-free — echo can only carry
  // words the tutor actually said, whichever splinter of the killed turn
  // they came from. Unknown onset → gate off (fail toward dispatching).
  if (
    rawWordCount(text) <= 4 &&
    state !== 'speaking' &&
    input.speechStartedAt !== undefined &&
    (input.onsetDuringTutorSpeech === true ||
      onsetDuringScriptPlayback(input.recentTtsScripts, input.speechStartedAt, input.now))
  ) {
    const lookbackOverlap = scoreLookbackEchoOverlap(text, input.recentTtsScripts);
    if (lookbackOverlap >= SPEAKING_ECHO_OVERLAP_THRESHOLD) {
      return {
        verdict: 'drop_self_voice',
        reason: `onset-during-playback echo overlap ${lookbackOverlap.toFixed(2)} ≥ ${SPEAKING_ECHO_OVERLAP_THRESHOLD}`,
        selfVoiceScore,
      };
    }
  }

  // 1.7. Mid-length echo splices (round-6e, portal-386d96cb). Garbled echo
  // routinely exceeds the ≤4-word cap ("x equals to before you check",
  // "3. So give us that.") — those fell through to 'escalate' and Haiku,
  // which has no echo awareness, dispatched them as barge_in. For 5-10 raw
  // words whose ONSET fell during tutor speech, apply a STRICTER lookback
  // bar: an echo splice is composed almost entirely of the tutor's own
  // (post-pronunciation) words, so ≥0.8 of its content tokens matching the
  // 30s lookback is echo; a genuine interjection brings its own words. The
  // ≤10-word cap protects the one genuine shape that can also hit 0.8 — a
  // student READING THE BOARD BACK — which in practice runs long (observed
  // genuine recitation: 20+ words). Runs in every state (the splice can
  // arrive during 'speaking' or after a state flip alike); requires ≥3
  // content tokens so stopword-heavy fragments don't reach the bar by
  // matching one word.
  {
    const rawWords = rawWordCount(text);
    if (
      rawWords >= 5 && rawWords <= 10 &&
      input.speechStartedAt !== undefined &&
      (input.onsetDuringTutorSpeech === true ||
        onsetDuringScriptPlayback(input.recentTtsScripts, input.speechStartedAt, input.now))
    ) {
      const tContentLen = contentTokens(tokenize(text)).length;
      const lookbackOverlap = scoreLookbackEchoOverlap(text, input.recentTtsScripts);
      if (tContentLen >= 3 && lookbackOverlap >= MIDLENGTH_ECHO_OVERLAP_THRESHOLD) {
        return {
          verdict: 'drop_self_voice',
          reason: `mid-length echo splice overlap ${lookbackOverlap.toFixed(2)} ≥ ${MIDLENGTH_ECHO_OVERLAP_THRESHOLD} (${rawWords}w)`,
          selfVoiceScore,
        };
      }
    }
  }

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
      if (isBriefAnswerShape(tokens)) {
        return { verdict: 'escalate', reason: 'speaking + brief numeric answer', selfVoiceScore };
      }
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
      if (isBriefAnswerShape(tokens)) {
        return { verdict: 'escalate', reason: 'thinking + brief numeric answer', selfVoiceScore };
      }
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
