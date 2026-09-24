// Pure, mongoose-free helpers the outreach console's CLIENT components
// import directly (see the header comment in src/lib/outreach/enums.ts for
// why anything they import must not touch mongoose, and
// scripts/test-outreach-guards.ts for the guard that enforces it).
// Task 5 adds sourcePill / leadMatchesQuery / compareLeads below.

/**
 * Round 2 §2. The option list behind an open dropdown: the seed values in
 * their declared order (they carry the label maps and the product taxonomy),
 * then every other value actually present on a lead, sorted. Saving a lead
 * with a new value is what adds it — there is no options manager.
 */
export function mergeOptionValues(
  seeds: readonly string[],
  present: (string | null | undefined)[]
): string[] {
  const out: string[] = [];
  for (const s of seeds) {
    const v = s.trim();
    if (v && !out.includes(v)) out.push(v);
  }
  const extras: string[] = [];
  for (const p of present) {
    const v = (p ?? "").trim();
    if (!v || out.includes(v) || extras.includes(v)) continue;
    extras.push(v);
  }
  extras.sort((a, b) => a.localeCompare(b));
  return [...out, ...extras];
}
