/**
 * Relative-date formatting for the recordings admin surfaces.
 * "X secs/mins/hrs/days ago" within 7 days, then "Jul 2" (same year)
 * or "Jul 2, 2025" (other years). Pure; `now` injectable for tests.
 */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatRelativeTime(date: Date | string, now: Date = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const deltaMs = Math.max(0, now.getTime() - d.getTime());
  const secs = Math.floor(deltaMs / 1000);
  if (secs < 60) return `${secs} sec${secs === 1 ? '' : 's'} ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const md = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
  return d.getUTCFullYear() === now.getUTCFullYear() ? md : `${md}, ${d.getUTCFullYear()}`;
}
