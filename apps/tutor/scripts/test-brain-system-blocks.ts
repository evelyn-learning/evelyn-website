/**
 * Every brain request must build its system blocks through buildSystemBlocks
 * (so core/session caching and the single-block fallback are uniform), and
 * the route must accept both the split and the legacy prompt fields.
 * Run: npx tsx scripts/test-brain-system-blocks.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const SRC = path.join(__dirname, '..', 'src');
const brain = fs.readFileSync(path.join(SRC, 'lib', 'tutor', 'voice', 'claude-brain.ts'), 'utf8');
const route = fs.readFileSync(path.join(SRC, 'app', 'api', 'tutor', 'brain', 'stream', 'route.ts'), 'utf8');
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;
const checks: Array<[string, boolean]> = [];

checks.push(['claude-brain: 3 request sites use buildSystemBlocks', count(brain, /system: buildSystemBlocks\(input\.systemPrompt, input\.systemPromptCore\)/g) === 3]);
checks.push(['claude-brain: no hand-built system block remains', count(brain, /text: input\.systemPrompt,/g) === 0]);
checks.push(['claude-brain: BrainTurnInput declares systemPromptCore', /systemPromptCore\?: string;/.test(brain)]);
checks.push(['route: resolves the prompt through resolveSystemPrompt', /resolveSystemPrompt\(body, process\.env\.TUTOR_SHARED_PROMPT_CACHE !== 'off'\)/.test(route)]);
checks.push(['route: no direct body.systemPrompt use remains', count(route, /body\.systemPrompt\b/g) === 0]);
checks.push(['route: passes core to the brain', /systemPromptCore: prompt\.core,/.test(route)]);
checks.push(['route: tool filter goes through allowedSubjectsForTurn', /allowedSubjectsForTurn\(/.test(route)]);
checks.push(['route: logs the cache key', /cacheKeyLine\(/.test(route)]);

let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
