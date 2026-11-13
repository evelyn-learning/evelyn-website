/**
 * Tutor brain v2 — what a session's subject and level labels mean.
 *
 * Partners and the marketing demo name these in their own words ("Precalculus", "Physics", "High school",
 * "Grade 3"), not in the engine's ("math", "sci", "9"). Read by prefix, a precalculus lesson was taken for
 * science and a "High school" lesson for a senior's, so every reader goes through here.
 */
export function isMathsSubject(subject: string | undefined): boolean {
  return /math|calc|algebra|geometr|trig|statist|arithmetic|\bstats\b/i.test(subject ?? '');
}
export function isScienceSubject(subject: string | undefined): boolean {
  return !isMathsSubject(subject) && /sci|phys|chem|bio|astronom|geolog/i.test(subject ?? '');
}
/** The school grade a level label stands for: 0 for kindergarten, undefined when it names none (AP, college,
 *  test prep) or lies above grade 12. "9-10" is 9; a band is its middle. */
export function gradeOfLevel(level: string | undefined): number | undefined {
  const text = (level ?? '').toLowerCase();
  if (/^\s*(?:k|kg|kindergarten|pre-?k)\b/.test(text)) return 0;
  const n = Number(text.match(/\d{1,2}/)?.[0] ?? NaN);
  if (Number.isFinite(n)) return n <= 12 ? n : undefined;
  if (/elementary|primary/.test(text)) return 4;
  if (/middle|junior high/.test(text)) return 7;
  if (/high school|secondary/.test(text)) return 10;
  return undefined;
}
