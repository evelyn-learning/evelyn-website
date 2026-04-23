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

const SHIFT_THRESHOLD = 0.40;  // cosine DISTANCE — empirical starting point
const EMA_ALPHA = 0.4;         // weight of the latest turn in the signature
const COOLDOWN_MS = 30_000;    // minimum gap between consecutive shift fires
const MIN_TURNS_BEFORE_SHIFT = 2; // let the signature stabilise

export interface TopicShiftDetectorState {
  signature: Float32Array | null;
  lastShiftAt: number;
  turnsSinceShift: number;
}

export function createTopicShiftState(): TopicShiftDetectorState {
  return { signature: null, lastShiftAt: 0, turnsSinceShift: 0 };
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
 * just no detection on that turn).
 */
export async function fetchEmbedding(text: string): Promise<Float32Array | null> {
  try {
    const res = await fetch('/api/tutor/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { embedding?: number[] };
    if (!json.embedding || !Array.isArray(json.embedding)) return null;
    return new Float32Array(json.embedding);
  } catch {
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
    return {
      shifted: false,
      distance: null,
      nextState: { signature: embedding, lastShiftAt: state.lastShiftAt, turnsSinceShift: 1 },
    };
  }

  const similarity = cosineSimilarity(state.signature, embedding);
  const distance = 1 - similarity;
  const withinCooldown = now - state.lastShiftAt < COOLDOWN_MS;
  const hasWarmup = state.turnsSinceShift >= MIN_TURNS_BEFORE_SHIFT;
  const shifted = !withinCooldown && hasWarmup && distance > SHIFT_THRESHOLD;

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
      turnsSinceShift: shifted ? 1 : state.turnsSinceShift + 1,
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
