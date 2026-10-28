/** buildSessionFilter: mode filter for text/voice inputMode. */
async function main() {
  const { buildSessionFilter, buildGradeUsageFilter } = await import('@/lib/tutor/recordings/filters');
  const now = new Date();
  const t = buildSessionFilter({ mode: 'text' }, now);
  const v = buildSessionFilter({ mode: 'voice' }, now);
  const none = buildSessionFilter({}, now);
  const bad = buildSessionFilter({ mode: 'video' }, now);
  const checks: Array<[string, boolean]> = [
    ['mode=text → inputMode text', t.inputMode === 'text'],
    ['mode=voice → inputMode voice', v.inputMode === 'voice'],
    ['no mode → no inputMode clause', !('inputMode' in none)],
    ['garbage mode ignored', !('inputMode' in bad)],
  ];
  // Practice grading: only partner + range apply.
  const g = buildGradeUsageFilter({ partner: 'greenapple', range: '7d' }, now);
  const gAll = buildGradeUsageFilter({}, now);
  const gBad = buildGradeUsageFilter({ range: 'forever' }, now);
  checks.push(
    ['grading: partner → partnerId', g.partnerId === 'greenapple'],
    ['grading: 7d → createdAt from now−7d', (g.createdAt as { $gte: Date }).$gte.getTime() === now.getTime() - 7 * 86_400_000],
    ['grading: no chips → no clauses', Object.keys(gAll).length === 0],
    ['grading: unknown range ignored', !('createdAt' in gBad)],
  );
  let fail = 0;
  for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
  console.log(`${checks.length - fail}/${checks.length} passed`);
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
