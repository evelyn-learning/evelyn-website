/**
 * Debug-event curation for the replay timeline. A small, deliberate set of
 * categories renders as labeled dots; EVERYTHING else is hidden from the bar
 * (never an anonymous gray dot) and lives in the "show all events" lane.
 * Rule order matters: error patterns are checked before kill/perception so
 * e.g. perception_error lands in 'error'.
 */
export interface EventCategory {
  key: 'kill' | 'perception' | 'mic' | 'upload' | 'error';
  label: string;
  color: string; // tailwind bg class
}

export const EVENT_CATEGORIES: EventCategory[] = [
  { key: 'kill', label: 'Kill / retry', color: 'bg-purple-500' },
  { key: 'perception', label: 'Barge-in / perception', color: 'bg-sky-500' },
  { key: 'mic', label: 'Mic event', color: 'bg-orange-400' },
  { key: 'upload', label: 'Upload', color: 'bg-green-500' },
  { key: 'error', label: 'Error', color: 'bg-red-500' },
];

const byKey = Object.fromEntries(EVENT_CATEGORIES.map((c) => [c.key, c])) as Record<EventCategory['key'], EventCategory>;

// First-match-wins rule list. Sourced from the actual onDebugEvent type
// inventory (grep onDebugEvent in VoiceTutorRealtime.tsx / page.tsx,
// 2026-07-04). Unmatched types are hidden by design.
const RULES: { pattern: RegExp; key: EventCategory['key'] }[] = [
  { pattern: /^mic_(mute|unmute)$/, key: 'mic' },
  { pattern: /^image_upload$/, key: 'upload' },
  { pattern: /(^|_)error$/, key: 'error' },
  { pattern: /^(judge_kill|dev_forced_kill|kill_|killed_render)/, key: 'kill' },
  { pattern: /_retry$/, key: 'kill' },
  { pattern: /^(perception_|bargein|barge_in)/, key: 'perception' },
];

export function categorizeEvent(type: string): EventCategory | null {
  for (const rule of RULES) {
    if (rule.pattern.test(type)) return byKey[rule.key];
  }
  return null;
}

export function curateEvents<T extends { data: { type?: string } }>(
  events: T[],
): (T & { category: EventCategory })[] {
  const out: (T & { category: EventCategory })[] = [];
  for (const ev of events) {
    const category = ev.data.type ? categorizeEvent(ev.data.type) : null;
    if (category) out.push({ ...ev, category });
  }
  return out;
}
