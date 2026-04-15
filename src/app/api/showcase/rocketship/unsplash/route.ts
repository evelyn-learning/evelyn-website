import { NextRequest } from 'next/server';

const cache = new Map<string, { url: string; expires: number }>();
const TTL_MS = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase();
  if (!q) {
    return Response.json({ error: 'Missing q' }, { status: 400 });
  }

  const now = Date.now();
  const cached = cache.get(q);
  if (cached && cached.expires > now) {
    return Response.json({ url: cached.url });
  }

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return Response.json({ error: 'Unsplash not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&orientation=squarish&content_filter=high`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );
    if (!res.ok) {
      return Response.json({ error: `Unsplash ${res.status}` }, { status: 502 });
    }
    const data = (await res.json()) as {
      results?: { urls?: { thumb?: string; small?: string } }[];
    };
    const url = data.results?.[0]?.urls?.thumb || data.results?.[0]?.urls?.small;
    if (!url) {
      return Response.json({ error: 'No image found' }, { status: 404 });
    }
    cache.set(q, { url, expires: now + TTL_MS });
    return Response.json({ url });
  } catch {
    return Response.json({ error: 'Unsplash fetch failed' }, { status: 502 });
  }
}
