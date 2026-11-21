/**
 * Tutor brain v2 — the state the client sends with each turn, read back and validated (the brain-v2 turn route). Moved out of
 * the route file (final review, test gap 6) so a multi-turn walk can go through the same round trip the route makes:
 * JSON, this read, then v2ScopeCarried. Behaviour unchanged. `carry`: STATE_CARRY (state-carry.ts v2ReadCarried).
 */
import { TUTOR_V2_STATE_CARRY } from '../orchestrator/flags';
import { readHomeworkState } from './homework';
import { v2ReadWorkingLevel } from './working-level';
import { v2ReadPronunciation } from './pronunciation';
import { v2ReadCorrectedSentences } from './sentence-cards';
import { v2ReadCarried } from './state-carry';
import { v2ReadAdaptive } from './adaptive';
import { v2ReadCorrectedOlder, v2ReadCorrections } from './summary-marks';
import type { V2State } from './types';

export function v2ReadClientState(raw: unknown, carry: boolean = TUTOR_V2_STATE_CARRY): V2State | null {
  const s = raw as Partial<V2State> | null;
  if (!s || typeof s !== 'object') return null;
  if (!Array.isArray(s.history) || typeof s.note !== 'string' || typeof s.goals !== 'object' || s.goals === null) return null;
  if (!s.board || !Array.isArray(s.board.pages) || typeof s.board.current !== 'number') return null;
  if (typeof s.startedAtMs !== 'number' || !Number.isFinite(s.startedAtMs)) return null;
  const gaps = Array.isArray(s.gaps) ? s.gaps.filter((g) => g && typeof g.what === 'string' && typeof g.status === 'string').slice(-12) : undefined;
  const homework = readHomeworkState(s.homework);
  const t = s.thinking as Partial<NonNullable<V2State['thinking']>> | undefined;
  const strs = (x: unknown, n: number) => (Array.isArray(x) ? x.filter((v): v is string => typeof v === 'string').slice(-n) : []);
  const thinking = t && typeof t === 'object' ? {
    position: typeof t.position === 'string' ? t.position.slice(0, 300) : '', weighed: strs(t.weighed, 12), shifts: strs(t.shifts, 6),
    ...(typeof t.example === 'string' ? { example: t.example.slice(0, 240) } : {}),
    ...(typeof t.direction === 'string' ? { direction: t.direction.slice(0, 240) } : {}),
    ...(t.justComplicated === true ? { justComplicated: true } : {}),
    ...(t.steered === true ? { steered: true } : {}),
    ...(typeof t.theirMinutes === 'number' && Number.isFinite(t.theirMinutes) ? { theirMinutes: Math.min(60, Math.max(2, Math.round(t.theirMinutes))) } : {}),
    ...(typeof t.complications === 'number' && Number.isFinite(t.complications) ? { complications: Math.min(20, Math.max(0, Math.round(t.complications))) } : {}),
  } : undefined;
  // What the board has shown of the plan (turn.ts). Left out of this list, both were dropped between turns: the
  // phases never followed the board and a plan problem's card was never found again (AP Statistics, portal-b8ee9d0f).
  // (Merge with main, Task 8e: main's readState fields, read here since the read moved out of the route file.)
  const map = <T,>(x: unknown, ok: (v: unknown) => v is T): Record<string, T> | undefined => { if (!x || typeof x !== 'object' || Array.isArray(x)) return undefined; const out = Object.fromEntries(Object.entries(x as Record<string, unknown>).filter((e): e is [string, T] => ok(e[1])).slice(0, 60)); return Object.keys(out).length ? out : undefined; };
  const problemCards = map(s.problemCards, (v): v is string => typeof v === 'string' && v.length < 80);
  const partsSeen = map(s.partsSeen, (v): v is number => typeof v === 'number' && Number.isFinite(v));
  const ownKeys = map(s.ownKeys, (v): v is string => typeof v === 'string' && v.length <= 800);
  const ak = s.askedKey as { q?: unknown; key?: unknown } | undefined;
  const askedKey = ak && typeof ak === 'object' && typeof ak.q === 'string' && typeof ak.key === 'string' && ak.key ? { q: ak.q.slice(0, 200), key: ak.key.slice(0, 800) } : undefined;
  const workingLevel = v2ReadWorkingLevel(s.workingLevel);
  const pronunciation = v2ReadPronunciation(s.pronunciation);
  const correctedSentences = v2ReadCorrectedSentences(s.correctedSentences);
  // Task 7w (SUMMARY_MARKS): the corrections with what they said and the words changed (scope in v2ScopeCarried).
  const corrections = v2ReadCorrections(s.corrections);
  // Task 8a (CORRECTIONS_ALL_GUARDED): the older corrections, sentence only (older states have none).
  const correctedOlder = v2ReadCorrectedOlder(s.correctedOlder);
  // Task 7a (and its fix round 1): the held page, when the summary began, replies since the board, what was not painted.
  const carried = v2ReadCarried(s, carry);
  // Task 7q (SUPPORT_STEPS, RETEST_MISTAKE): the support step and the recorded corrections (adaptive.ts; scope in v2ScopeCarried).
  const adaptive = v2ReadAdaptive(s as Partial<Record<keyof V2State, unknown>>);
  return { ...(problemCards ? { problemCards } : {}), ...(partsSeen ? { partsSeen } : {}), ...(ownKeys ? { ownKeys } : {}), ...(askedKey ? { askedKey } : {}), ...carried, ...adaptive, ...(workingLevel ? { workingLevel } : {}), ...(pronunciation ? { pronunciation } : {}), ...(correctedSentences ? { correctedSentences } : {}), ...(corrections ? { corrections } : {}), ...(correctedOlder ? { correctedOlder } : {}), history: s.history, note: s.note, goals: s.goals, ...(gaps ? { gaps } : {}), ...(thinking ? { thinking } : {}), board: s.board, startedAtMs: s.startedAtMs, closed: s.closed === true, ...(typeof s.closeSummary === 'string' ? { closeSummary: s.closeSummary } : {}), ...(homework ? { homework } : {}) };
}
