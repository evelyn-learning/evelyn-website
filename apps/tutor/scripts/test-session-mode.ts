/** resolveSessionMode: text ONLY when the token claim is 'text' and the kill switch is not 'off'. */
async function main() {
  const { resolveSessionMode, textModeSecondsPerWord, TEXT_MODE_SECONDS_PER_WORD } =
    await import('@/lib/tutor/voice/resolve-session-mode');
  const checks: Array<[string, boolean]> = [
    ["claim 'text', switch unset → text", resolveSessionMode('text', undefined) === 'text'],
    ["claim 'text', switch 'on' → text", resolveSessionMode('text', 'on') === 'text'],
    ["claim 'text', switch 'off' → voice", resolveSessionMode('text', 'off') === 'voice'],
    ["claim 'voice' → voice", resolveSessionMode('voice', undefined) === 'voice'],
    ['claim undefined → voice', resolveSessionMode(undefined, undefined) === 'voice'],
    ['claim garbage → voice', resolveSessionMode('TEXT ', undefined) === 'voice'],
    ['spw default 0.35', textModeSecondsPerWord(undefined) === TEXT_MODE_SECONDS_PER_WORD],
    ['spw env parsed', textModeSecondsPerWord('0.5') === 0.5],
    ['spw env garbage → default', textModeSecondsPerWord('fast') === TEXT_MODE_SECONDS_PER_WORD],
    ['spw env non-positive → default', textModeSecondsPerWord('0') === TEXT_MODE_SECONDS_PER_WORD],
  ];
  let fail = 0;
  for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
  console.log(`${checks.length - fail}/${checks.length} passed`);
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
