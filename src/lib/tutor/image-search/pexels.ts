/**
 * Pexels search provider.
 *
 * API: https://api.pexels.com/v1/search
 * Auth: `Authorization: <PEXELS_API_KEY>` (no scheme prefix)
 * Free tier: 200 req/hr.
 */

import { isRelevant } from './index';
import type { ImageSearchResult } from './types';

interface PexelsPhoto {
  id: number;
  alt: string;
  url: string;
  src: { large: string; medium: string; original: string };
  photographer: string;
  photographer_url: string;
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
}

export async function searchPexels(query: string): Promise<ImageSearchResult | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: key },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    console.warn(`[image-search] pexels HTTP ${res.status} for query="${query}"`);
    return null;
  }
  const data = (await res.json()) as PexelsSearchResponse;
  if (!Array.isArray(data.photos) || data.photos.length === 0) return null;

  for (const photo of data.photos) {
    if (!isRelevant(query, photo.alt || '')) continue;
    return {
      url: photo.src.large || photo.src.original,
      alt: photo.alt || query,
      credit: `Photo by ${photo.photographer} on Pexels`,
      source: 'pexels',
    };
  }
  return null;
}
