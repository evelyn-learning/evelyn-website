/**
 * Grade strings → a comparable ordinal, for "nearest grade" plan selection
 * (2026-10-28, demo topic choice: a grade-7 trial asking for quadratic
 * equations gets the grade-8 lesson, not the grade-9 one). Pure.
 *
 *   'Grade 7' → 7 · '7' → 7 · '6-8' → 7 (midpoint) · 'g4-math' → 4 ·
 *   'K' → 0 · 'Elementary' → 3 · 'Middle school' → 7 · 'High school' → 10 ·
 *   'AP' / 'IB' → 12 · 'College' / 'University' / 'Adult' → 13 · unknown → null
 */
export function gradeOrdinal(raw: unknown): number | null {
  if (typeof raw !== 'string') return null;
  const s = raw.trim().toLowerCase();
  if (!s) return null;
  const range = s.match(/(\d{1,2})\s*[-–to]+\s*(\d{1,2})/);
  if (range) return (Number(range[1]) + Number(range[2])) / 2;
  const num = s.match(/(?:^|[^a-z\d]|\bg)(\d{1,2})(?!\d)/); // 'g4-math' → 4
  if (num) { const n = Number(num[1]); if (n >= 0 && n <= 13) return n; }
  if (/\bk(?:indergarten)?\b/.test(s)) return 0;
  if (/elementary|primary/.test(s)) return 3;
  if (/middle/.test(s)) return 7;
  if (/high\s*school|secondary/.test(s)) return 10;
  if (/\bap\b|\bib\b|a-level/.test(s)) return 12;
  if (/college|university|adult|undergrad/.test(s)) return 13;
  return null;
}

/** |Δ| between two grade strings; Infinity when either is unknown. */
export function gradeDistance(a: unknown, b: unknown): number {
  const x = gradeOrdinal(a); const y = gradeOrdinal(b);
  if (x === null || y === null) return Number.POSITIVE_INFINITY;
  return Math.abs(x - y);
}
