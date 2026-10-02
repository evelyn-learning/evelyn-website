/**
 * Shared prompt cache — pure helpers (no SDK import; safe on client and server).
 *
 * The API caches by exact prefix in the order tools → system → messages. The
 * system prompt is sent as two blocks: `core` (same for every session of a
 * deployment) and the session tail. A marker on `core` makes tools + core one
 * cache entry that every session reads; the session block is written per
 * session. See docs/superpowers/specs/2026-10-02-tutor-token-optimization-design.md.
 */
import { resolveToolSubjects, type CatalogSubject } from '@/lib/tutor/ai/tool-subject-taxonomy';

export type SystemBlock = {
  type: 'text';
  text: string;
  cache_control: { type: 'ephemeral'; ttl: '1h' };
};

const marker = (): SystemBlock['cache_control'] => ({ type: 'ephemeral', ttl: '1h' });

/** True when `core` is a proper prefix of `full` and something non-blank follows it. */
function splittable(full: string, core: string | undefined): core is string {
  return (
    typeof core === 'string' &&
    core.length > 0 &&
    full.length > core.length &&
    full.startsWith(core) &&
    full.slice(core.length).trim().length > 0
  );
}

/**
 * Two blocks (core, session) when the split is valid, otherwise the single
 * legacy block. The API rejects a cache marker on an empty text block, so any
 * doubt collapses to one block rather than risking a 400 on a live turn.
 */
export function buildSystemBlocks(systemPrompt: string, core?: string): SystemBlock[] {
  if (splittable(systemPrompt, core)) {
    return [
      { type: 'text', text: core, cache_control: marker() },
      { type: 'text', text: systemPrompt.slice(core.length), cache_control: marker() },
    ];
  }
  return [{ type: 'text', text: systemPrompt, cache_control: marker() }];
}

/** Client → server body fields. Same bytes on the wire as before, just cut in two. */
export function splitPromptForWire(
  full: string,
  core: string,
): { systemPrompt: string } | { systemPromptCore: string; systemPromptSession: string } {
  if (splittable(full, core)) {
    return { systemPromptCore: core, systemPromptSession: full.slice(core.length) };
  }
  return { systemPrompt: full };
}

/**
 * Server: accept the two parts (new clients) or the legacy single string (old
 * tabs, scripts). `core` is returned only when the shared cache is enabled;
 * without it the caller sends one block, exactly as before.
 */
export function resolveSystemPrompt(
  body: { systemPrompt?: unknown; systemPromptCore?: unknown; systemPromptSession?: unknown },
  sharedCacheOn: boolean,
): { full: string; core?: string } | null {
  const { systemPromptCore: core, systemPromptSession: session, systemPrompt: legacy } = body;
  if (typeof core === 'string' && core.length > 0 && typeof session === 'string' && session.length > 0) {
    return sharedCacheOn ? { full: core + session, core } : { full: core + session };
  }
  if (typeof legacy === 'string' && legacy.length > 0) return { full: legacy };
  return null;
}

export type ToolScope = 'subject' | 'full';

/**
 * Client-side latch for the tool list. The tools array is the FIRST thing in
 * the cache prefix, so changing it rewrites the whole cache. A session may
 * widen from the subject-filtered list to the full list once; it never
 * narrows. A turn is untrusted (full list) when the session is open-scope,
 * has no lesson plan, or the plan is freestyle (pasted content, any subject).
 */
export function nextToolScope(
  prev: ToolScope | null,
  turn: { openScope: boolean; hasPlan: boolean; planId: string },
): ToolScope {
  if (prev === 'full') return 'full';
  const untrusted = turn.openScope || !turn.hasPlan || turn.planId.startsWith('freestyle-');
  return untrusted ? 'full' : 'subject';
}

/**
 * Server: the subject set to filter the tools array by, or null for every
 * tool. The client's latched scope can only widen the result; the server's
 * own untrusted check (no plan / freestyle) still applies on every turn, and
 * a client that sends no scope gets the pre-latch behaviour.
 */
export function allowedSubjectsForTurn(a: {
  toolScope?: unknown;
  subject?: string;
  hasPlan: boolean;
  planId: string;
}): CatalogSubject[] | null {
  if (a.toolScope === 'full') return null;
  if (!a.hasPlan || a.planId.startsWith('freestyle-')) return null;
  return resolveToolSubjects(a.subject);
}
