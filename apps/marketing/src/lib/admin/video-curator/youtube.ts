/**
 * YouTube helpers — ID extraction, oEmbed validation, transcript fetch.
 *
 * No API key required. oEmbed gives us title + author/channel, and
 * youtube-transcript pulls captions for every public video that has them
 * (AP Daily videos all do). Duration must be parsed from the embed page
 * since oEmbed doesn't return it; we use a lightweight HTML-scrape fallback.
 */

import { YoutubeTranscript } from 'youtube-transcript';
import type { VideoMeta } from './types';

const ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (ID_RE.test(trimmed)) return trimmed;
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

interface OEmbedResponse {
  title: string;
  author_name: string;
  thumbnail_url?: string;
}

/**
 * Fetch oEmbed for a YouTube video — succeeds only if the video exists,
 * is public, and is embeddable. Used as the validation pass for any
 * youtubeId we accept (LLM-proposed or admin-pasted).
 */
export async function fetchOEmbed(youtubeId: string): Promise<OEmbedResponse | null> {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) return null;
    return (await res.json()) as OEmbedResponse;
  } catch {
    return null;
  }
}

/**
 * Best-effort duration extraction. YouTube's watch page embeds a
 * `lengthSeconds` field in the player_response JSON. If we can't parse
 * it (rare), we return 0 and the UI just won't show duration — not fatal.
 */
export async function fetchDurationSec(youtubeId: string): Promise<number> {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${youtubeId}`, {
      headers: {
        // Pretend to be a browser; YouTube serves a different bundle to
        // bots that omits the player_response JSON.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) return 0;
    const html = await res.text();
    const m = html.match(/"lengthSeconds":"(\d+)"/);
    if (m) return Number(m[1]);
    return 0;
  } catch {
    return 0;
  }
}

export async function validateAndDescribe(youtubeId: string): Promise<VideoMeta | null> {
  const oembed = await fetchOEmbed(youtubeId);
  if (!oembed) return null;
  const durationSec = await fetchDurationSec(youtubeId);
  return {
    youtubeId,
    title: oembed.title,
    channel: oembed.author_name,
    durationSec,
  };
}

export interface TranscriptCue {
  text: string;
  startSec: number;
  durationSec: number;
}

function decodeText(s: string): string {
  return s
    .replace(/&amp;#39;/g, "'")
    .replace(/&amp;quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export async function fetchTranscript(youtubeId: string): Promise<TranscriptCue[]> {
  const raw = await YoutubeTranscript.fetchTranscript(youtubeId);
  if (raw.length === 0) return [];
  // youtube-transcript v1.3 returns ms for the modern srv3 format and
  // seconds for the legacy <text start dur> format. Detect by inter-cue
  // gap: realistic seconds gaps are 1-10, ms gaps are 1000-10000.
  const gap =
    raw.length >= 2 ? raw[1].offset - raw[0].offset : raw[0].duration;
  const factor = gap > 100 ? 1000 : 1;
  return raw.map((c) => ({
    text: decodeText(c.text),
    startSec: Math.round(c.offset / factor),
    durationSec: Math.round(c.duration / factor),
  }));
}
