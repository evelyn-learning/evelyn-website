/**
 * Image search service for the AI tutor's show_labeled_image tool.
 *
 * The brain hallucinates Unsplash photo IDs that look real (and load,
 * because Unsplash hosts billions of photos) but are unrelated to the
 * topic. This service replaces URL-guessing with real API calls: the
 * brain emits a `query` string, the server resolves it to an actual
 * topic-relevant photo URL via Unsplash → Pixabay → Pexels.
 *
 * Provider order:
 *   1. Unsplash  — best curation, ~50 req/hr free tier (cache mitigates).
 *   2. Pixabay   — fallback when Unsplash exhausted/down. ~5000/hr free.
 *   3. Pexels    — final fallback. ~200/hr free.
 *
 * Relevance filter: each provider returns metadata (description, tags,
 * alt text). We accept a result if at least one query keyword appears
 * in the metadata; otherwise try the next result. Soft check, but it
 * dramatically improves topical fit vs taking the first result blindly.
 *
 * Cache: in-memory Map keyed by normalized query, 1-hour TTL. Avoids
 * hammering APIs across sessions teaching the same lesson.
 */

import { searchUnsplash } from './unsplash';
import { searchPixabay } from './pixabay';
import { searchPexels } from './pexels';
import type { ImageSearchResult } from './types';

export type { ImageSearchResult } from './types';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
interface CacheEntry {
  result: ImageSearchResult | null;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

function cacheGet(key: string): ImageSearchResult | null | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.result;
}

function cachePut(key: string, result: ImageSearchResult | null): void {
  cache.set(key, { result, expiresAt: Date.now() + CACHE_TTL_MS });
}

export interface SearchImageArgs {
  /** What the brain wants pictured. Short, descriptive, focused on
   *  visual content. Examples: "monarch butterfly on flower",
   *  "human heart anatomy diagram", "great wall of china". */
  query: string;
  /** Optional subject hint. Not currently used in search but kept for
   *  future biasing (e.g., prefer scientific imagery for biology). */
  subject?: string;
}

/** Search across providers in priority order. Returns the first
 *  topically-relevant result, or null if all providers failed/missed. */
export async function searchImage(args: SearchImageArgs): Promise<ImageSearchResult | null> {
  const query = normalizeQuery(args.query);
  if (!query) return null;

  // Cache hit: return the same image as last time so a lesson re-run
  // shows continuity. Includes negative cache (null) to avoid retrying
  // a query that all providers missed.
  const cached = cacheGet(query);
  if (cached !== undefined) {
    if (cached) {
      console.log(`[image-search] cache-hit query="${query}" → ${cached.source}`);
    }
    return cached;
  }

  const providers: Array<{ name: string; fn: typeof searchUnsplash }> = [
    { name: 'unsplash', fn: searchUnsplash },
    { name: 'pixabay', fn: searchPixabay },
    { name: 'pexels', fn: searchPexels },
  ];

  for (const { name, fn } of providers) {
    try {
      const result = await fn(query);
      if (result) {
        console.log(`[image-search] hit query="${query}" provider=${name}`);
        cachePut(query, result);
        return result;
      }
    } catch (err) {
      // One provider failing shouldn't kill the chain. Log and try
      // the next.
      console.warn(`[image-search] ${name} threw, trying next:`, (err as Error).message);
    }
  }

  console.log(`[image-search] miss query="${query}" — no provider returned a relevant result`);
  cachePut(query, null);
  return null;
}

/** Soft relevance filter: return true if any query keyword appears in
 *  the candidate's metadata text. Used by every provider to pick the
 *  most relevant result from the API's top-N candidates. */
export function isRelevant(query: string, candidateText: string): boolean {
  if (!candidateText) return false;
  const text = candidateText.toLowerCase();
  // Strip stop words from query so single-letter / connective tokens
  // don't pass the filter trivially.
  const STOP = new Set(['a', 'an', 'the', 'of', 'on', 'in', 'at', 'and', 'or', 'with', 'for', 'to']);
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  if (words.length === 0) return true; // pathological case — accept rather than reject everything
  return words.some((w) => text.includes(w));
}
