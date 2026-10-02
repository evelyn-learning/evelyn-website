/**
 * Pure helpers behind the shared prompt cache.
 * Run: npx tsx scripts/test-prompt-cache.ts
 */
import {
  buildSystemBlocks, splitPromptForWire, resolveSystemPrompt,
  nextToolScope, allowedSubjectsForTurn,
} from '@/lib/tutor/ai/prompt-cache';
import { cacheKeyLine } from '@/lib/tutor/ai/prompt-cache-log';

const checks: Array<[string, boolean]> = [];
const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const M = { type: 'ephemeral', ttl: '1h' };

// buildSystemBlocks
const two = buildSystemBlocks('COREsession', 'CORE');
checks.push(['two blocks when core is a proper prefix', two.length === 2 && two[0].text === 'CORE' && two[1].text === 'session']);
checks.push(['both blocks carry the 1h marker', two.every((b) => eq(b.cache_control, M))]);
checks.push(['blocks concatenate to the full prompt', two.map((b) => b.text).join('') === 'COREsession']);
checks.push(['one block when core is undefined', eq(buildSystemBlocks('COREsession').map((b) => b.text), ['COREsession'])]);
checks.push(['one block when core is empty', buildSystemBlocks('COREsession', '').length === 1]);
checks.push(['one block when core is not a prefix', buildSystemBlocks('COREsession', 'OTHER').length === 1]);
checks.push(['one block when session would be empty', buildSystemBlocks('CORE', 'CORE').length === 1]);
checks.push(['one block when session would be whitespace only', buildSystemBlocks('CORE \n', 'CORE').length === 1]);

// splitPromptForWire
checks.push(['wire split sends the two parts', eq(splitPromptForWire('COREsession', 'CORE'), { systemPromptCore: 'CORE', systemPromptSession: 'session' })]);
checks.push(['wire split falls back to the legacy field (no core)', eq(splitPromptForWire('COREsession', ''), { systemPrompt: 'COREsession' })]);
checks.push(['wire split falls back when core is not a prefix', eq(splitPromptForWire('COREsession', 'X'), { systemPrompt: 'COREsession' })]);
checks.push(['wire split falls back when nothing follows core', eq(splitPromptForWire('CORE', 'CORE'), { systemPrompt: 'CORE' })]);

// resolveSystemPrompt (server)
checks.push(['parts + flag on → full and core', eq(resolveSystemPrompt({ systemPromptCore: 'C', systemPromptSession: 'S' }, true), { full: 'CS', core: 'C' })]);
checks.push(['parts + flag off → full only (single block)', eq(resolveSystemPrompt({ systemPromptCore: 'C', systemPromptSession: 'S' }, false), { full: 'CS' })]);
checks.push(['legacy systemPrompt still accepted', eq(resolveSystemPrompt({ systemPrompt: 'LEGACY' }, true), { full: 'LEGACY' })]);
checks.push(['parts win over a legacy field sent alongside', eq(resolveSystemPrompt({ systemPrompt: 'L', systemPromptCore: 'C', systemPromptSession: 'S' }, true), { full: 'CS', core: 'C' })]);
checks.push(['empty session part → legacy field', eq(resolveSystemPrompt({ systemPrompt: 'L', systemPromptCore: 'C', systemPromptSession: '' }, true), { full: 'L' })]);
checks.push(['nothing usable → null', resolveSystemPrompt({ systemPromptCore: 'C' }, true) === null]);
checks.push(['non-string values → null', resolveSystemPrompt({ systemPrompt: 42, systemPromptCore: {}, systemPromptSession: [] }, true) === null]);

// nextToolScope (client latch)
const plan = { openScope: false, hasPlan: true, planId: 'evelyn.math.g8.v1' };
checks.push(['curated plan → subject', nextToolScope(null, plan) === 'subject']);
checks.push(['no plan on turn 1 → full', nextToolScope(null, { ...plan, hasPlan: false, planId: '' }) === 'full']);
checks.push(['full is sticky when the plan arrives later', nextToolScope('full', plan) === 'full']);
checks.push(['freestyle plan → full', nextToolScope(null, { ...plan, planId: 'freestyle-abc' }) === 'full']);
checks.push(['open scope → full', nextToolScope(null, { ...plan, openScope: true }) === 'full']);
checks.push(['subject widens to full when a later turn is untrusted', nextToolScope('subject', { ...plan, planId: 'freestyle-x' }) === 'full']);
checks.push(['subject stays subject on a trusted turn', nextToolScope('subject', plan) === 'subject']);

// allowedSubjectsForTurn (server)
checks.push(['scope full → null (every tool)', allowedSubjectsForTurn({ toolScope: 'full', subject: 'math', hasPlan: true, planId: 'p' }) === null]);
checks.push(['scope subject + trusted → subject set', eq(allowedSubjectsForTurn({ toolScope: 'subject', subject: 'math', hasPlan: true, planId: 'p' }), ['math'])]);
checks.push(['scope subject but no plan this turn → null', allowedSubjectsForTurn({ toolScope: 'subject', subject: 'math', hasPlan: false, planId: '' }) === null]);
checks.push(['legacy client (no scope) + trusted → subject set', eq(allowedSubjectsForTurn({ subject: 'physics', hasPlan: true, planId: 'p' }), ['physics'])]);
checks.push(['legacy client + freestyle → null', allowedSubjectsForTurn({ subject: 'physics', hasPlan: true, planId: 'freestyle-1' }) === null]);
checks.push(['unknown scope value is treated as legacy', eq(allowedSubjectsForTurn({ toolScope: 'weird', subject: 'math', hasPlan: true, planId: 'p' }), ['math'])]);
checks.push(['unknown subject → null', allowedSubjectsForTurn({ toolScope: 'subject', subject: 'Financial Literacy', hasPlan: true, planId: 'p' }) === null]);

// cacheKeyLine
const l1 = cacheKeyLine({ core: 'C', toolNames: ['a', 'b'], mode: 'filter', homework: false });
const l2 = cacheKeyLine({ core: 'C', toolNames: ['a', 'b'], mode: 'filter', homework: false });
const l3 = cacheKeyLine({ core: 'C', toolNames: ['a', 'b', 'c'], mode: 'failopen', homework: true });
checks.push(['cache key line is deterministic', l1 === l2]);
checks.push(['cache key line shape', /^\[cachekey\] core=[0-9a-f]{8} tools=[0-9a-f]{8} n=2 mode=filter hw=0$/.test(l1)]);
checks.push(['different tool set → different tools hash', l1.split(' ')[2] !== l3.split(' ')[2]]);
checks.push(['no core → core=none', cacheKeyLine({ toolNames: ['a'], mode: 'failopen', homework: false }).includes('core=none')]);

let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
