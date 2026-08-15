/**
 * Unsplash search provider.
 *
 * API: https://api.unsplash.com/search/photos
 * Auth: `Authorization: Client-ID <UNSPLASH_ACCESS_KEY>`
 * Free tier: 50 req/hour. The cache layer in index.ts keeps us well
 * under that for typical sessions.
 *
 * We pull the top 5 results and pick the first one whose description
 * or alt_description overlaps with a query keyword (per isRelevant).
 * This avoids the "first result is technically related but not the
 * obvious image" trap.
 */

import { isRelevant } from './index';
import type { ImageSearchResult } from './types';

interface UnsplashPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: { regular: string; small: string; full: string };
  user: { name: string; username: string };
  links: { html: string };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

export async function searchUnsplash(query: string): Promise<ImageSearchResult | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    console.warn(`[image-search] unsplash HTTP ${res.status} for query="${query}"`);
    return null;
  }
  const data = (await res.json()) as UnsplashSearchResponse;
  if (!Array.isArray(data.results) || data.results.length === 0) return null;

  for (const photo of data.results) {
    const meta = [photo.description, photo.alt_description].filter(Boolean).join(' ');
    if (!isRelevant(query, meta)) continue;
    return {
      url: photo.urls.regular,
      alt: photo.alt_description ?? photo.description ?? query,
      credit: `Photo by ${photo.user.name} on Unsplash`,
      source: 'unsplash',
    };
  }
  return null; // none of the top results passed the relevance filter
}
