/** buildSessionFilter: mode filter for text/voice inputMode. */
async function main() {
  const { buildSessionFilter } = await import('@/lib/tutor/recordings/filters');
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
  let fail = 0;
  for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
  console.log(`${checks.length - fail}/${checks.length} passed`);
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
