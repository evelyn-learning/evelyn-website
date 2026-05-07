/**
 * Pixabay search provider.
 *
 * API: https://pixabay.com/api/
 * Auth: query param `key=<PIXABAY_API_KEY>`
 * Free tier: 100 req/min, ~5000 req/hr. Generous.
 *
 * Pixabay tags are comma-separated keywords on each photo — strong
 * signal for relevance, so we use those plus the description.
 */

import { isRelevant } from './index';
import type { ImageSearchResult } from './types';

interface PixabayPhoto {
  id: number;
  pageURL: string;
  tags: string;
  largeImageURL: string;
  webformatURL: string;
  user: string;
}

interface PixabaySearchResponse {
  hits: PixabayPhoto[];
}

export async function searchPixabay(query: string): Promise<ImageSearchResult | null> {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return null;

  const url =
    `https://pixabay.com/api/?key=${encodeURIComponent(key)}` +
    `&q=${encodeURIComponent(query)}` +
    `&per_page=5&safesearch=true&image_type=photo&orientation=horizontal`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  let res: Response;
  try {
    res = await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    console.warn(`[image-search] pixabay HTTP ${res.status} for query="${query}"`);
    return null;
  }
  const data = (await res.json()) as PixabaySearchResponse;
  if (!Array.isArray(data.hits) || data.hits.length === 0) return null;

  for (const photo of data.hits) {
    if (!isRelevant(query, photo.tags)) continue;
    return {
      url: photo.webformatURL || photo.largeImageURL,
      alt: photo.tags || query,
      credit: `Image by ${photo.user} on Pixabay`,
      source: 'pixabay',
    };
  }
  return null;
}
