/**
 * One instant, formatted for a person: the session start ("Oct 5, 2026,
 * 6:53 PM") or a transcript stamp ("06:53:07 PM").
 *
 * `timeZone` omitted ⇒ the RUNTIME's zone — in a browser, the viewer's. Pass
 * 'UTC' for text produced where the viewer's zone is unknown (a server
 * render): the result is then labelled " UTC" so it is never mistaken for
 * local time. Unparseable input ⇒ '' (never "Invalid Date").
 *
 * Pure. Client- and server-safe.
 */
export type InstantKind = 'datetime' | 'time';

const OPTIONS: Record<InstantKind, Intl.DateTimeFormatOptions> = {
  datetime: { dateStyle: 'medium', timeStyle: 'short' },
  time: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
};

export function formatInstant(
  instant: string | number | Date | null | undefined,
  kind: InstantKind,
  timeZone?: string,
): string {
  if (instant === null || instant === undefined || instant === '') return '';
  if (typeof instant !== 'string' && typeof instant !== 'number' && !(instant instanceof Date)) return '';
  const d = instant instanceof Date ? instant : new Date(instant);
  if (Number.isNaN(d.getTime())) return '';
  const text = new Intl.DateTimeFormat('en-US', { ...OPTIONS[kind], ...(timeZone ? { timeZone } : {}) }).format(d);
  return timeZone === 'UTC' ? `${text} UTC` : text;
}
