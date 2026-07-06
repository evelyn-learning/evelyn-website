// scripts/tutor/voice-harness/wer.ts
/** Lowercase, unify apostrophes, strip punctuation (keep intra-word ' and /), split. */
export function normalizeForWer(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/[^a-z0-9'/ ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function wordErrorRate(reference: string, hypothesis: string) {
  const ref = normalizeForWer(reference);
  const hyp = normalizeForWer(hypothesis);
  const m = ref.length, n = hyp.length;
  // Standard word-level Levenshtein with backtrace counts.
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = ref[i - 1] === hyp[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  // Backtrace to split distance into subs/ins/dels.
  let i = m, j = n, subs = 0, ins = 0, dels = 0;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] && ref[i - 1] === hyp[j - 1]) { i--; j--; continue; }
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1) { subs++; i--; j--; continue; }
    if (j > 0 && d[i][j] === d[i][j - 1] + 1) { ins++; j--; continue; }
    dels++; i--;
  }
  const wer = m === 0 ? (n === 0 ? 0 : 1) : (subs + ins + dels) / m;
  return { wer, subs, ins, dels, refLen: m };
}
