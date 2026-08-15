/**
 * Speaker segments for the replay timeline bar. A segment runs from its
 * transcript entry to the NEXT entry or `gapCapMs`, whichever is sooner —
 * so long silences render as neutral track instead of being painted as the
 * previous speaker (the pre-2026-07-04 behavior the user flagged).
 */
export interface SpeakerSegment {
  start: number;
  end: number;
  role: string;
}

export function buildSpeakerSegments(
  entries: { offsetMs: number; role: string }[],
  totalDurationMs: number,
  gapCapMs = 20_000,
): SpeakerSegment[] {
  const segments: SpeakerSegment[] = [];
  for (let i = 0; i < entries.length; i++) {
    const start = entries[i].offsetMs;
    const nextStart = i + 1 < entries.length ? entries[i + 1].offsetMs : Infinity;
    const end = Math.min(nextStart, start + gapCapMs, totalDurationMs);
    if (end > start) segments.push({ start, end, role: entries[i].role });
  }
  return segments;
}
