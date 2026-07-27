'use client';

/**
 * Compact session clock for the Stage header (round-5, 2026-07-27).
 *
 * WHY THIS EXISTS: on mobile the portal used to stack a whole row above the
 * iframe just to show the demo countdown ("15:00 free lesson"), and the
 * engine's own timer was hidden below 640px (`hidden sm:block` on the
 * `controls` slot in SessionStage). Between them the board lost several rows
 * on the smallest screens for information that fits in a chip. This renders
 * that chip INSIDE the existing 48px header row, so it costs no vertical space
 * at all, and the portal now contributes zero rows on mobile.
 *
 * It is NOT `SessionControls` un-hidden: that component also carries Export
 * PDF and Upload Problem, which are deliberately desktop-only. This is the
 * clock and nothing else, so it is safe to show at every width. Pair it with
 * the existing `hidden sm:block` controls slot — this one is `sm:hidden` at
 * the call site, so exactly one clock is visible at any width.
 *
 * Counts DOWN when the host set an explicit budget (the demo's 15-minute free
 * lesson — the engine already receives it as `max_duration_minutes` on the
 * embed config, so no new host→engine message was needed for this), and UP
 * otherwise, matching what an open-ended enrolled session wants.
 */

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HeaderClock({
  startedAtMs,
  maxMinutes,
  countDown,
  className = '',
}: {
  /** Wallclock ms when the voice session actually started (mic tap). Null
   *  before that — the clock shows a neutral dash rather than a live 0:00,
   *  which would imply the session is already running. */
  startedAtMs?: number | null;
  /** Session budget in minutes; only consulted when `countDown`. */
  maxMinutes: number;
  /** True when the host set an explicit budget (demo/trial). */
  countDown: boolean;
  className?: string;
}) {
  const [elapsedSec, setElapsedSec] = useState(0);

  // Derive from a fixed start timestamp rather than incrementing a counter, so
  // the clock stays accurate across a backgrounded tab (setInterval throttles
  // hard on mobile Safari — an incrementing counter drifts badly there).
  useEffect(() => {
    if (!startedAtMs) {
      setElapsedSec(0);
      return;
    }
    const tick = () => setElapsedSec(Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAtMs]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (!startedAtMs) {
    return (
      <span className={`inline-flex items-center gap-1 text-slate-400 ${className}`} aria-hidden>
        <Clock className="w-4 h-4" />
      </span>
    );
  }

  const remainingSec = maxMinutes * 60 - elapsedSec;
  // Clamp at zero: a countdown that goes negative reads as a bug to a student,
  // and the host owns what actually happens at expiry.
  const shown = countDown ? fmt(Math.max(0, remainingSec)) : fmt(elapsedSec);
  const low = countDown && remainingSec <= 300 && remainingSec > 0;
  const out = countDown && remainingSec <= 0;

  const tone = out ? 'text-red-600' : low ? 'text-amber-600' : 'text-slate-500';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-xs tabular-nums ${tone} ${className}`}
      title={countDown ? 'Time left in this lesson' : 'Time in this session'}
      aria-label={countDown ? `${shown} left` : `${shown} elapsed`}
    >
      <Clock className="w-4 h-4 shrink-0" />
      {shown}
    </span>
  );
}
