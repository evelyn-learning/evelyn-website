/**
 * Task D2 — session-end social-thread extraction (tutor-pedagogy initiative).
 *
 * One Haiku pass over the finished session transcript that produces the
 * material for the contract's `socialMemoryDelta`:
 *   - suggestedThreads: NEW social/rapport threads the STUDENT volunteered
 *     about themselves (interests / events / context). Candidates carry NO
 *     ids — the academy assigns ids (and capturedAt) when persisting.
 *   - referencedThreadIds: ids of EXISTING threads the TUTOR actually
 *     brought up this session (portal updates lastReferencedAt / decay).
 *
 * GUARD (enforced by the CALLER, Task D3 — documented here so no future
 * call-site forgets): extraction must ONLY run for SUBSCRIBED sessions.
 * Demo sessions have no portal student and no consent surface for stored
 * social memory — skip extraction entirely for them.
 *
 * The LLM call is injectable via `opts.complete` (same pattern as
 * scripts/tutor/pedagogy-harness/student-simulator.ts) — default is real
 * Haiku; tests inject a stub so the default suite makes NO network calls.
 *
 * This runs in the session-end path and must never break session close:
 * any LLM/parse failure yields empty results, never a throw.
 */
import Anthropic from '@anthropic-ai/sdk';
import { getModelClient, resolveModel } from '../ai/model-registry';
import type { SocialThread } from '@evelyn/portal-contract/v1';

export type CompleteFn = (
  system: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
) => Promise<string>;

/** Same Haiku id used elsewhere in this codebase (perception-classify,
 *  tutor judge, lesson-plan generate-from-text, doodler, session-summary,
 *  pedagogy-harness student simulator). */
export const SOCIAL_THREADS_MODEL_ID = resolveModel('social-threads').model;

export type SocialThreadKind = 'interest' | 'event' | 'context';

/** A new-thread suggestion WITHOUT an id — the academy assigns ids (and
 *  capturedAt) when persisting into the portal's social memory. */
export type SocialThreadCandidate = {
  kind: SocialThreadKind;
  note: string;
};

export interface ExtractSocialThreadsResult {
  suggestedThreads: SocialThreadCandidate[];
  referencedThreadIds: string[];
}

const VALID_KINDS: ReadonlySet<string> = new Set(['interest', 'event', 'context']);
const MAX_NOTE_LENGTH = 120;
const MAX_SUGGESTIONS = 5;

function getClient(): Anthropic {
  return getModelClient('social-threads').client;
}

/** Default `complete`: one real Haiku call, low temperature for stability. */
const realHaikuComplete: CompleteFn = async (system, messages) => {
  const msg = await getClient().messages.create({
    model: SOCIAL_THREADS_MODEL_ID,
    max_tokens: 600,
    temperature: 0.1,
    system,
    messages,
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
};

function buildSystemPrompt(existingThreads: SocialThread[]): string {
  const existingList = existingThreads.length
    ? existingThreads.map((t) => `- id: ${t.id} — "${t.note}"${t.kind ? ` (${t.kind})` : ''}`).join('\n')
    : '(none)';

  return [
    'You extract light social/rapport memory from a finished 1-on-1 tutoring session transcript.',
    'You have TWO jobs. Output STRICT JSON only (no prose, no markdown fences).',
    '',
    'JOB 1 — NEW threads: find things the STUDENT volunteered about THEMSELVES this session, in three kinds:',
    '- "interest": things they enjoy (hobbies, sports, shows, games).',
    '- "event": an upcoming happening in their life (a test, a game, a trip, a recital).',
    '- "context": stable personal context (a sibling, a pet, a class situation).',
    '',
    'STRICT RULES for new threads:',
    '- ONLY include what the student ACTUALLY SAID about themselves. Never infer, never include things the tutor said or guessed.',
    '- NOTHING pedagogical: no skill levels, no mistakes, no struggles, no topics covered or mastered — those belong to mastery tracking, NOT social memory. Do not store any claim about how good or bad the student is at anything.',
    '- NOTHING sensitive: no health or medical information, no family conflict, no emotional distress, nothing a parent reviewing stored notes would find creepy or invasive to see recorded. When in doubt, leave it out.',
    '- Each note must be SHORT (max 12 words), neutral in tone, and phrased as a plain fact, not a judgment (e.g. "Plays football on weekends", never "Is obsessed with football").',
    '- If nothing qualifies, return an empty suggestedThreads array. An empty result is always acceptable.',
    '',
    'JOB 2 — REFERENCED existing threads: below are the social threads already on file for this student. Return the ids of any that the TUTOR actually brought up or used during this session (e.g. mentioned the interest, asked about the event). Only ids from this list; if none were used, return an empty array.',
    '',
    'EXISTING THREADS:',
    existingList,
    '',
    'OUTPUT FORMAT — exactly this JSON shape:',
    '{"suggestedThreads":[{"kind":"interest|event|context","note":"..."}],"referencedThreadIds":["..."]}',
  ].join('\n');
}

function formatTranscript(transcript: Array<{ role: 'tutor' | 'student'; text: string }>): string {
  if (transcript.length === 0) return '(empty transcript)';
  return transcript
    .map((t) => `${t.role === 'tutor' ? 'TUTOR' : 'STUDENT'}: ${t.text}`)
    .join('\n');
}

/** Pull the first {...} JSON object out of a model response; null on failure. */
function parseJsonObject(raw: string): Record<string, unknown> | null {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1));
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // fall through
  }
  return null;
}

/** True when one note is a near-duplicate of another (case-insensitive
 *  substring either way — v1 dedupe rule). */
function isNearDuplicate(a: string, b: string): boolean {
  const la = a.trim().toLowerCase();
  const lb = b.trim().toLowerCase();
  if (!la || !lb) return false;
  return la.includes(lb) || lb.includes(la);
}

function sanitizeSuggestions(
  raw: unknown,
  existingThreads: SocialThread[],
): SocialThreadCandidate[] {
  if (!Array.isArray(raw)) return [];
  const accepted: SocialThreadCandidate[] = [];
  for (const item of raw) {
    if (accepted.length >= MAX_SUGGESTIONS) break;
    if (!item || typeof item !== 'object') continue;
    const kind = (item as Record<string, unknown>).kind;
    const note = (item as Record<string, unknown>).note;
    if (typeof kind !== 'string' || !VALID_KINDS.has(kind)) continue;
    if (typeof note !== 'string') continue;
    const trimmed = note.trim();
    if (!trimmed || trimmed.length > MAX_NOTE_LENGTH) continue;
    if (existingThreads.some((t) => isNearDuplicate(trimmed, t.note))) continue;
    if (accepted.some((c) => isNearDuplicate(trimmed, c.note))) continue;
    accepted.push({ kind: kind as SocialThreadKind, note: trimmed });
  }
  return accepted;
}

function sanitizeReferencedIds(raw: unknown, existingThreads: SocialThread[]): string[] {
  if (!Array.isArray(raw)) return [];
  const known = new Set(existingThreads.map((t) => t.id));
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const id of raw) {
    if (typeof id !== 'string' || !known.has(id) || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

const EMPTY_RESULT: ExtractSocialThreadsResult = { suggestedThreads: [], referencedThreadIds: [] };

/**
 * Extract social-memory deltas from a finished session transcript.
 *
 * MUST only be called for SUBSCRIBED sessions (demo-skip lives at the
 * caller — Task D3). Never throws: any failure returns empty results so
 * session close is never broken.
 */
export async function extractSocialThreads(
  transcript: Array<{ role: 'tutor' | 'student'; text: string }>,
  existingThreads: SocialThread[],
  opts?: { complete?: CompleteFn },
): Promise<ExtractSocialThreadsResult> {
  try {
    const complete = opts?.complete ?? realHaikuComplete;
    const system = buildSystemPrompt(existingThreads);
    const raw = await complete(system, [
      { role: 'user', content: `SESSION TRANSCRIPT:\n${formatTranscript(transcript)}` },
    ]);

    const parsed = parseJsonObject(raw);
    if (!parsed) return { ...EMPTY_RESULT };

    return {
      suggestedThreads: sanitizeSuggestions(parsed.suggestedThreads, existingThreads),
      referencedThreadIds: sanitizeReferencedIds(parsed.referencedThreadIds, existingThreads),
    };
  } catch {
    // Session-end path — never break session close.
    return { ...EMPTY_RESULT };
  }
}
