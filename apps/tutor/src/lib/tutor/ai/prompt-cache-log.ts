/**
 * Shared prompt cache — server-only logging helper (uses node crypto, so it
 * lives apart from prompt-cache.ts, which the browser bundle imports).
 */
import { createHash } from 'crypto';

const sha8 = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 8);

/** One grep-able line per turn naming the shared cache entry the turn used.
 *  `tools` is hashed over the full definitions (name, description, schema) —
 *  a description-only change moves the real cache entry and must move the key. */
export function cacheKeyLine(a: { core?: string; tools: ReadonlyArray<object>; mode: string; homework: boolean }): string {
  return (
    `[cachekey] core=${a.core ? sha8(a.core) : 'none'} tools=${sha8(JSON.stringify(a.tools))} ` +
    `n=${a.tools.length} mode=${a.mode} hw=${a.homework ? 1 : 0}`
  );
}
