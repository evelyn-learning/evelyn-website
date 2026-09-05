/**
 * Struggle ledger (holistic-pedagogy round, spec §A) — a per-LO, in-session
 * tally of behavioural struggle signals so a gap can be INFERRED without the
 * student naming it, and a RECURRENCE noticed when the same objective trips
 * them again. Pure: no React, no DOM, no I/O. The orchestrator owns one
 * LedgerState per session in a ref and feeds it events from sites it already
 * has (streak increments, cue matches, segment turn counts, brain gap calls).
 *
 * Detection = weighted score since the last detection crosses
 * LEDGER_TUNING.detectThreshold. After a detection the score resets, so the
 * next one needs fresh evidence. A second detection on the same LO is only
 * allowed in a DIFFERENT segment or after cooldownMs — one bad minute is one
 * detection, not two. detections ≥ 2 ⇒ recurrence.
 *
 * Signals map 1:1 onto EXISTING GapSignalCode values — never a new enum
 * value (the academy parses GapsRead with a closed enum).
 */
import type { GapSignalCode } from '@/lib/tutor/student-profile/types';

export type LedgerEventKind = 'wrong' | 'no_recovery' | 'stuck_cue' | 'slow_segment' | 'confusion' | 'brain_gap';
export interface LedgerEvent { kind: LedgerEventKind; loId: string; segId: string; atMs: number }
export interface LoLedger {
  score: number;
  events: LedgerEvent[];
  detections: number;
  lastDetectionAtMs?: number;
  lastDetectionSegId?: string;
  inferredPushed: boolean;
  recovered: boolean;
}
export type LedgerState = Map<string, LoLedger>;
export interface LedgerDetection {
  loId: string;
  count: number;
  recurrence: boolean;
  signals: GapSignalCode[];
  sawBrainGapThisSegment: boolean;
}

export const LEDGER_TUNING = {
  weights: { wrong: 1, no_recovery: 1, stuck_cue: 1, confusion: 1, slow_segment: 0.5, brain_gap: 2 } as Record<LedgerEventKind, number>,
  detectThreshold: 2,
  cooldownMs: 90_000,
};

/** Moved verbatim from VoiceTutorRealtime.tsx's recordGap handler so the
 *  ledger and the objective-signal stamp share one definition. */
export const STUCK_CUE_RE = /\b(stuck|skip|don't know|dont know|i don't get|help me|can't do)\b/i;
/** Generic verbalized-confusion shapes (no subject terms). */
export const CONFUSION_RE = /\b(i don'?t get (it|this)|i'?m confused|confusing|doesn'?t make sense|makes no sense|i'?m lost|what do you mean|i don'?t understand)\b/i;

/** Explicit help-request shapes: a struggle signal wherever they land. */
const EXPLICIT_STUCK_RE = /\b(?:i'?m\s+stuck|i\s+am\s+stuck|can\s+you\s+(?:break|walk|explain|help|show\s+me)|break\s+(?:it|this)\s+down|walk\s+me\s+through|step[\s-]by[\s-]step|need\s+(?:a\s+)?(?:hint|help)|how\s+do\s+i)\b/i;
/** "don't know / understand / get" — load-bearing only when it IS the reply. */
const SOFT_STUCK_RE = /\b(?:i\s+)?(?:don'?t|do\s+not)\s+(?:know|understand|get(?:\s+it|\s+this)?)\b/i;
/** The same words as a HEDGE or discourse filler, never a struggle:
 *  "I don't know if this comes up later", "maybe they just, I don't know,
 *  study more", "you never know". */
const HEDGE_RE = /\b(?:don'?t|do\s+not)\s+know\s+(?:if|whether|how\s+(?:much|many|long|far)|why|what|when|where|which|about|exactly)\b|\byou\s+never\s+know\b|\bwho\s+knows\b/i;
const SOFT_STUCK_MAX_WORDS = 12;
const SOFT_STUCK_LEAD_WORDS = 5;
const SOFT_STUCK_LEAD_MAX_WORDS = 25;

/**
 * Is this utterance a stuck cue the LEDGER should count?
 *
 * Live session 2026-09-05 (portal-51b667f1): all four ledger detections on a
 * student who was acing the lesson came from "I don't know" used as a filler
 * or hedge inside long, correct answers — the help-request classifier matches
 * "don't know" anywhere. That classifier still drives the pedagogy (Socratic
 * breakdown); this predicate is the ledger's stricter gate:
 *   - explicit shapes ("I'm stuck", "walk me through") count anywhere;
 *   - soft shapes ("I don't know / get it") count only when they ARE the
 *     reply: a short utterance, or the cue leads a medium-length one;
 *   - hedge objects ("don't know if/whether/why …") never count.
 */
export function isLedgerStuckCue(text: string): boolean {
  const t = (text || '').trim();
  if (!t) return false;
  if (EXPLICIT_STUCK_RE.test(t)) return true;
  const m = SOFT_STUCK_RE.exec(t);
  if (!m) return false;
  // Hedge anywhere in the utterance disqualifies a soft cue — the same
  // words are doing hedging work, not asking for help.
  if (HEDGE_RE.test(t)) return false;
  const words = t.split(/\s+/).filter(Boolean).length;
  if (words <= SOFT_STUCK_MAX_WORDS) return true;
  const leadWords = t.slice(0, m.index).split(/\s+/).filter(Boolean).length;
  return leadWords <= SOFT_STUCK_LEAD_WORDS && words <= SOFT_STUCK_LEAD_MAX_WORDS;
}

export function prereqKey(conceptLabel: string): string {
  return `prereq:${conceptLabel.trim().toLowerCase()}`;
}

export function createLedger(): LedgerState {
  return new Map();
}

function signalsFor(events: LedgerEvent[]): GapSignalCode[] {
  const out = new Set<GapSignalCode>();
  const wrongs = events.filter((e) => e.kind === 'wrong').length;
  if (wrongs >= 2) out.add('INCORRECT_STREAK_2_PLUS');
  for (const e of events) {
    if (e.kind === 'no_recovery') out.add('NO_RECOVERY');
    if (e.kind === 'stuck_cue') out.add('STUCK_CUE');
    if (e.kind === 'slow_segment') out.add('SLOW_SEGMENT');
    if (e.kind === 'confusion') out.add('STUDENT_VERBALIZED_CONFUSION');
  }
  return [...out];
}

/** Apply one event. Returns a detection when the LO crosses the threshold
 *  (and is outside the cooldown), else null. Mutates `state`. */
export function applyLedgerEvent(state: LedgerState, ev: LedgerEvent): LedgerDetection | null {
  let lo = state.get(ev.loId);
  if (!lo) {
    lo = { score: 0, events: [], detections: 0, inferredPushed: false, recovered: false };
    state.set(ev.loId, lo);
  }
  lo.events.push(ev);
  lo.score += LEDGER_TUNING.weights[ev.kind];
  lo.recovered = false;
  if (lo.score < LEDGER_TUNING.detectThreshold) return null;
  // Cooldown: a repeat detection needs a new segment or ≥ cooldownMs.
  if (lo.detections > 0 && lo.lastDetectionAtMs !== undefined) {
    const sameSeg = lo.lastDetectionSegId === ev.segId;
    const soon = ev.atMs - lo.lastDetectionAtMs < LEDGER_TUNING.cooldownMs;
    if (sameSeg && soon) return null;
  }
  // Events since the last detection = the tail after the previous detection's count.
  const sinceIdx = lo.events.findIndex((e) => lo!.lastDetectionAtMs === undefined || e.atMs > lo!.lastDetectionAtMs);
  const recent = sinceIdx >= 0 ? lo.events.slice(sinceIdx) : lo.events;
  const sawBrainGapThisSegment = recent.some((e) => e.kind === 'brain_gap' && e.segId === ev.segId);
  lo.detections += 1;
  lo.lastDetectionAtMs = ev.atMs;
  lo.lastDetectionSegId = ev.segId;
  lo.score = 0;
  return {
    loId: ev.loId,
    count: lo.detections,
    recurrence: lo.detections >= 2,
    signals: signalsFor(recent),
    sawBrainGapThisSegment,
  };
}

export function markRecovered(state: LedgerState, loId: string): void {
  const lo = state.get(loId);
  if (lo) lo.recovered = true;
}
