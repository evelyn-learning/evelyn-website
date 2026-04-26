/**
 * Semantic topic-shift detector for the voice tutor.
 *
 * Maintains a rolling EMA-weighted embedding of recent student turns —
 * the "topic signature" of what the session is currently about. When a
 * new student turn arrives, we embed it and measure cosine distance to
 * the signature. A large jump (distance > SHIFT_THRESHOLD) means the
 * student has pivoted to something semantically distant — typically a
 * new subject / topic — and the caller should emit a synthetic newPage
 * so the whiteboard starts fresh.
 *
 * This catches shifts that a regex detector misses, e.g.:
 *   ray diagrams → "can you draw a map of USA"
 *   algebra     → "what is photosynthesis"
 *   buoyancy    → "tell me about the French revolution"
 *
 * Cost is negligible: text-embedding-3-small at ~20 tokens per turn is
 * ~$0.0000004/turn. We also apply a cooldown so a single pivot doesn't
 * trigger multiple synthetic newPages in rapid succession.
 */

// Tuned again after 2026-04-24 session: wave → shark food web didn't
// trigger a newPage at 0.30. Empirically "physics topic A → physics
// topic B" lands around 0.22-0.28 with text-embedding-3-small; 0.25
// covers it. Cooldown halved so back-to-back subject jumps each fire.
const SHIFT_THRESHOLD = 0.25;  // cosine DISTANCE
const EMA_ALPHA = 0.4;         // weight of the latest turn in the signature
const COOLDOWN_MS = 15_000;    // minimum gap between consecutive shift fires

// 2026-04-24 pendulum session: short anaphoric follow-ups ("what about
// the amplitude?", "how do we calculate it?", "in terms of distance how
// much is it?") each embedded semantically far from the pendulum
// signature — every turn fired a newPage even though the student never
// left the problem. Anaphoric/referential language is a strong "staying
// on topic" signal: if the student is referring to something already on
// the board, they're not pivoting. Skip shift detection for these.
// Also skip very short utterances (< MIN_CONTENT_WORDS content words) —
// they're too brief to embed meaningfully and are almost always
// continuations, not new topics.
const ANAPHORA_PATTERN =
  /\b(?:this|that|it|its|these|those|them|their|the\s+(?:same|previous|above|same one|one above))\b|\bhow\s+(?:do|does|did|can|could)\s+(?:we|you|i)\b|\bwhat\s+about\b/i;
const MIN_CONTENT_WORDS = 3;
// Stopwords excluded from the content-word count so a short but topic-
// bearing utterance ("draw a cell") still passes while a vague pivot
// ("what about that one?") falls below the threshold and gets vetoed.
const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'about',
  'and', 'or', 'but', 'if', 'so', 'then', 'than', 'that', 'this',
  'it', 'its', 'these', 'those', 'there', 'here',
  'i', 'you', 'we', 'he', 'she', 'they', 'me', 'us', 'them',
  'do', 'does', 'did', 'done', 'can', 'could', 'will', 'would', 'should',
  'my', 'your', 'our', 'their', 'ok', 'okay', 'yes', 'no',
  'how', 'what', 'when', 'where', 'why', 'which', 'who',
  'much', 'more', 'less', 'some', 'any', 'all', 'one',
]);

function countContentWords(text: string): number {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
    .length;
}

export interface TopicShiftDetectorState {
  signature: Float32Array | null;
  lastShiftAt: number;
}

export function createTopicShiftState(): TopicShiftDetectorState {
  return { signature: null, lastShiftAt: 0 };
}

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Call the server embed endpoint. Returns null on any failure so the
 * caller's topic-shift check degrades to a no-op (no false positives,
 * just no detection on that turn). Logs failures loudly so silent
 * 500s / network errors surface in session logs.
 */
export async function fetchEmbedding(text: string): Promise<Float32Array | null> {
  try {
    const res = await fetch('/api/tutor/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      console.warn('[topic-shift] embed API returned non-OK:', res.status);
      return null;
    }
    const json = (await res.json()) as { embedding?: number[] };
    if (!json.embedding || !Array.isArray(json.embedding)) {
      console.warn('[topic-shift] embed API returned malformed payload');
      return null;
    }
    return new Float32Array(json.embedding);
  } catch (err) {
    console.warn('[topic-shift] embed API fetch failed:', err);
    return null;
  }
}

export interface TopicShiftCheckResult {
  /** True iff this turn triggers a synthetic newPage. */
  shifted: boolean;
  /** 0-1 distance from this turn to the prior signature, null on first turn. */
  distance: number | null;
  /** Updated state — caller should replace its state with this value. */
  nextState: TopicShiftDetectorState;
}

/**
 * Embed the given text and compare to the rolling signature. Updates
 * the signature (EMA of prior signature and new embedding). Returns
 * whether this turn qualifies as a topic shift.
 */
export async function checkTopicShift(
  state: TopicShiftDetectorState,
  text: string,
  now: number = Date.now(),
): Promise<TopicShiftCheckResult> {
  const embedding = await fetchEmbedding(text);
  if (!embedding) {
    return { shifted: false, distance: null, nextState: state };
  }

  // First turn — seed the signature, no shift possible.
  if (!state.signature) {
    console.log('[topic-shift] seeded signature on first turn');
    return {
      shifted: false,
      distance: null,
      nextState: { signature: embedding, lastShiftAt: state.lastShiftAt },
    };
  }

  const similarity = cosineSimilarity(state.signature, embedding);
  const distance = 1 - similarity;
  const withinCooldown = now - state.lastShiftAt < COOLDOWN_MS;
  // Anaphoric / short-utterance veto: if the student is referring back
  // to existing board content or hasn't said enough content to embed
  // meaningfully, treat the turn as a same-topic continuation regardless
  // of embedding distance.
  const hasAnaphora = ANAPHORA_PATTERN.test(text);
  const contentWords = countContentWords(text);
  const tooShort = contentWords < MIN_CONTENT_WORDS;
  const vetoed = hasAnaphora || tooShort;
  const shifted = !vetoed && !withinCooldown && distance > SHIFT_THRESHOLD;

  // Always log the distance so real sessions surface actionable data
  // for future threshold tuning. Only fires on clean turns, so the log
  // noise is bounded by how often the student is genuinely speaking.
  const reason = shifted
    ? '→ SHIFT'
    : vetoed
      ? `(veto: ${hasAnaphora ? 'anaphora' : ''}${hasAnaphora && tooShort ? '+' : ''}${tooShort ? `short(${contentWords})` : ''})`
      : withinCooldown
        ? '(cooldown)'
        : '(below threshold)';
  console.log(
    `[topic-shift] distance=${distance.toFixed(3)} threshold=${SHIFT_THRESHOLD}`,
    reason,
  );

  // On a shift, re-seed the signature to the new embedding rather than
  // EMA-blending — the student has moved; the old topic shouldn't
  // linger. On a non-shift, blend to keep the signature representative
  // of the ongoing topic.
  const nextSignature = shifted
    ? embedding
    : emaBlend(state.signature, embedding, EMA_ALPHA);

  return {
    shifted,
    distance,
    nextState: {
      signature: nextSignature,
      lastShiftAt: shifted ? now : state.lastShiftAt,
    },
  };
}

function emaBlend(prev: Float32Array, next: Float32Array, alpha: number): Float32Array {
  const out = new Float32Array(prev.length);
  const inv = 1 - alpha;
  for (let i = 0; i < prev.length; i++) {
    out[i] = prev[i] * inv + next[i] * alpha;
  }
  return out;
}
