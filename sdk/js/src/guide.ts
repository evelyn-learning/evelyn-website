import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_EMBED_HOST } from './token.js';

/** The integration guide that shipped with this version of the package (docs/integration.md). */
export function bundledGuide(): string {
  return readFileSync(join(__dirname, '..', '..', 'docs', 'integration.md'), 'utf8');
}

/**
 * The integration guide: the live copy from the developer portal when it can be reached within a few
 * seconds, else the copy bundled with the package. `source` says which one was returned.
 */
export async function loadGuide(fetchImpl: typeof fetch = fetch): Promise<{ text: string; source: 'live' | 'bundled' }> {
  const host = (process.env.EVELYN_EMBED_HOST ?? DEFAULT_EMBED_HOST).replace(/\/+$/, '');
  try {
    const response = await fetchImpl(`${host}/docs/integration.md`, { signal: AbortSignal.timeout(5000) });
    const text = await response.text();
    // A sign-in page or an error page is not the guide: the guide is Markdown and opens with its title.
    if (response.ok && text.startsWith('# ')) return { text, source: 'live' };
  } catch {
    // Offline, blocked or slow: the bundled copy answers.
  }
  return { text: bundledGuide(), source: 'bundled' };
}
