/**
 * The session component must send the split prompt, latch the tool scope and
 * emit the warm/cold start event; the embed page must persist that event.
 * Run: npx tsx scripts/test-client-prompt-parts.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const SRC = path.join(__dirname, '..', 'src');
const vtr = fs.readFileSync(path.join(SRC, 'app', 'tutor', 'components', 'VoiceTutorRealtime.tsx'), 'utf8');
const embed = fs.readFileSync(path.join(SRC, 'app', 'tutor-portal', 'embed', 'page.tsx'), 'utf8');
const checks: Array<[string, boolean]> = [];

checks.push(['VTR builds the prompt through buildSystemPromptParts', /buildSystemPromptParts\(\{/.test(vtr)]);
checks.push(['VTR stores core in a ref', /claudeSystemPromptCoreRef\.current = promptParts\.core;/.test(vtr)]);
checks.push(['VTR body spreads splitPromptForWire', /\.\.\.splitPromptForWire\(claudeSystemPromptRef\.current, claudeSystemPromptCoreRef\.current\),/.test(vtr)]);
checks.push(['VTR body no longer sends the single string', !/systemPrompt: claudeSystemPromptRef\.current,/.test(vtr)]);
checks.push(['VTR latches the tool scope', /toolScopeRef\.current = nextToolScope\(toolScopeRef\.current,/.test(vtr)]);
checks.push(['VTR sends toolScope', /toolScope: toolScopeRef\.current,/.test(vtr)]);
checks.push(['VTR emits cache_start once', /onDebugEvent\?\.\('cache_start'/.test(vtr) && /cacheStartLoggedRef\.current = true;/.test(vtr)]);
checks.push(['brain_turn message carries usage', /cr=\$\{lastUsage\?\.cacheReadTokens \?\? 0\} cc=\$\{lastUsage\?\.cacheCreationTokens \?\? 0\}/.test(vtr)]);
checks.push(['embed allowlist persists cache_start', /'cache_start'/.test(embed)]);

let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
