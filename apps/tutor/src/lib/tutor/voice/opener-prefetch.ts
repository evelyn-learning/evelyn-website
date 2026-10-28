/**
 * Opener prefetch cache — pure, server-side module.
 *
 * 2026-10-18, GDI session embed-1792338502233: the learner sat 6.5 minutes on
 * the pre-start screen, then waited 4.6 s after tapping Start for the tutor's
 * first sentence. The opener brain call ran cold: a 108K-token prompt-cache
 * write plus a hidden-thinking first attempt (sonnet-5 ignoring thinking-off)
 * that was cut and re-issued. The opener depends only on the plan, persona and
 * student, all known the moment the embed loads — so the orchestrator now runs
 * the opener's brain call pre-start (callBrainOnce `prefetchOnly`), the route
 * stores the SSE bytes here under the client's session id, and the real Start
 * call replays them. Replay also leaves the prompt cache warm for turn 2.
 *
 * Entries are single-use, expire after OPENER_PREFETCH_TTL_MS (the embed's
 * prewarm frame reloads itself at 30 min) and the map is bounded. A Start that
 * arrives while the prefetch is still running waits for it; a prefetch that
 * threw resolves null so the caller runs the brain live.
 */

export const OPENER_PREFETCH_TTL_MS = 30 * 60 * 1000;
export const OPENER_PREFETCH_MAX_ENTRIES = 64;

const KEY_RE = /^[A-Za-z0-9._:-]{1,128}$/;

/** The client's session id (`embed-<ms>` / `session-<ms>`). Anything else is refused. */
export function isValidPrefetchKey(key: unknown): key is string {
  return typeof key === 'string' && KEY_RE.test(key);
}

/** What the route writes the turn's SSE frames into instead of a ReadableStream controller. */
export interface OpenerPrefetchSink {
  enqueue(chunk: Uint8Array): void;
  /** The turn finished (the route's `finally` ran) — the entry is replayable. */
  close(): void;
  /** The turn threw before producing a complete opener — drop the entry. */
  fail(): void;
}

interface Entry {
  createdAtMs: number;
  chunks: Uint8Array[];
  done: boolean;
  waiters: Array<(chunks: Uint8Array[] | null) => void>;
}

export class OpenerPrefetchCache {
  private readonly entries = new Map<string, Entry>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;
  private readonly now: () => number;

  constructor(opts?: { ttlMs?: number; maxEntries?: number; now?: () => number }) {
    this.ttlMs = opts?.ttlMs ?? OPENER_PREFETCH_TTL_MS;
    this.maxEntries = opts?.maxEntries ?? OPENER_PREFETCH_MAX_ENTRIES;
    this.now = opts?.now ?? Date.now;
  }

  get size(): number { this.sweep(); return this.entries.size; }

  /** Start recording a prefetch. Null when an unexpired entry already exists. */
  begin(key: string): OpenerPrefetchSink | null {
    this.sweep();
    if (this.entries.has(key)) return null;
    while (this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) break;
      this.settle(oldest, null);
    }
    const entry: Entry = { createdAtMs: this.now(), chunks: [], done: false, waiters: [] };
    this.entries.set(key, entry);
    return {
      enqueue: (chunk) => { if (!entry.done) entry.chunks.push(chunk); },
      close: () => {
        if (entry.done) return;
        entry.done = true;
        if (entry.waiters.length > 0) this.settle(key, entry.chunks);
      },
      fail: () => { if (this.entries.get(key) === entry) this.settle(key, null); },
    };
  }

  has(key: string): boolean { this.sweep(); return this.entries.has(key); }

  /** Claim the entry: resolves to its chunks (immediately when done, else when
   *  the prefetch closes) and removes it. Null when there is nothing to replay
   *  (never prefetched, expired, or taken already); a promise of null when the
   *  prefetch fails after the claim. */
  take(key: string): Promise<Uint8Array[] | null> | null {
    this.sweep();
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (entry.done) {
      this.entries.delete(key);
      return Promise.resolve(entry.chunks);
    }
    return new Promise((resolve) => { entry.waiters.push(resolve); });
  }

  private settle(key: string, chunks: Uint8Array[] | null): void {
    const entry = this.entries.get(key);
    if (!entry) return;
    this.entries.delete(key);
    entry.done = true;
    const waiters = entry.waiters; entry.waiters = [];
    for (const w of waiters) w(chunks);
  }

  private sweep(): void {
    const cutoff = this.now() - this.ttlMs;
    for (const [key, entry] of this.entries) {
      if (entry.createdAtMs < cutoff) this.settle(key, null);
    }
  }
}

/** One process-wide cache for the brain route (one pm2 process per engine). */
let shared: OpenerPrefetchCache | null = null;
export function openerPrefetchCache(): OpenerPrefetchCache {
  return (shared ??= new OpenerPrefetchCache());
}
