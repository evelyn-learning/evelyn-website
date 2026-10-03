/**
 * The core/session split must not change a single byte of the prompt, and
 * `core` must be identical for every session (it is the shared cache entry).
 * Run: npx tsx scripts/test-system-prompt-parts.ts
 */
import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as builder from '@/lib/tutor/ai/system-prompt-builder';
import { PROMPT_MATRIX } from './fixtures/system-prompt-matrix';
import { unsetServerOnlyPromptFlags, exposesServerOnlyPromptFlags, SERVER_ONLY_PROMPT_FLAGS } from './fixtures/browser-env';

// The prompt is built in the BROWSER, where these server-only flags are
// undefined. A Node test process may have them set (dotenv, CI env); with
// them set, `core` varies by subject. Simulate a polluted env, then strip it.
for (const f of SERVER_ONLY_PROMPT_FLAGS) process.env[f] = 'true';
unsetServerOnlyPromptFlags();

const golden: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'fixtures', 'system-prompt-hashes.json'), 'utf8'),
);
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const checks: Array<[string, boolean]> = [];
const parts = (builder as unknown as {
  buildSystemPromptParts?: (c: builder.SystemPromptContext) => { core: string; session: string };
}).buildSystemPromptParts;

checks.push(['buildSystemPromptParts is exported', typeof parts === 'function']);
const cores = new Set<string>();
for (const [name, ctx] of Object.entries(PROMPT_MATRIX)) {
  checks.push([`${name}: buildSystemPrompt bytes unchanged`, sha(builder.buildSystemPrompt(ctx)) === golden[name]]);
  if (!parts) continue;
  const p = parts(ctx);
  cores.add(p.core);
  checks.push([`${name}: core + session === full prompt`, sha(p.core + p.session) === golden[name]]);
  checks.push([`${name}: session is non-empty`, p.session.trim().length > 0]);
  checks.push([`${name}: session starts at the pedagogy spine`, p.session.startsWith('\n\n## Pedagogy spine')]);
}
checks.push(['core is identical across the whole matrix', cores.size === 1]);

// Tripwire: the shared cache entry assumes the browser never sees the
// server-only prompt flags. Exposing one (next.config `env`, or a
// NEXT_PUBLIC_ rename) makes `core` vary by subject and silently splits the
// shared entry into one per subject.
const nextConfig = fs.readFileSync(path.join(__dirname, '..', 'next.config.ts'), 'utf8');
const builderSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'tutor', 'ai', 'system-prompt-builder.ts'), 'utf8');
checks.push(['next.config does not expose server-only prompt flags to the browser', !exposesServerOnlyPromptFlags(nextConfig, builderSrc)]);
checks.push(['tripwire detects a next.config env exposure', exposesServerOnlyPromptFlags("env: { TUTOR_TOOL_SUBJECT_FILTER: process.env.TUTOR_TOOL_SUBJECT_FILTER }", builderSrc)]);
checks.push(['tripwire detects a NEXT_PUBLIC_ rename in the builder', exposesServerOnlyPromptFlags('', "process.env.NEXT_PUBLIC_TUTOR_TOOL_SUBJECT_FILTER === 'true'")]);
checks.push(['core is the bulk of the prompt (> 150K chars)', [...cores][0]?.length > 150_000]);

// In-flow fields render in the SESSION part only, and absent fields change nothing (golden above).
const inflowCtx = { ...PROMPT_MATRIX.freetext_subject, inFlow: true, lessonContext: { title: 'Own a Piece?', summary: 'Two offers on the table.', question: 'Which is equity?', studentAnswer: 'the loan', correctAnswer: 'the first offer' } } as builder.SystemPromptContext;
if (parts) {
  const p = parts(inflowCtx);
  const base = parts(PROMPT_MATRIX.freetext_subject);
  checks.push(['in-flow: core unchanged', p.core === base.core]);
  checks.push(['in-flow: session has the lesson context block', p.session.includes('## Lesson context') && p.session.includes('Clip: Two offers on the table.')]);
  checks.push(['in-flow: session has the question block', p.session.includes('Question: Which is equity?')]);
  checks.push(['in-flow: session has the hand-back close clause', p.session.includes(builder.IN_FLOW_CLOSE_CLAUSE)]);
  checks.push(['in-flow blocks sit inside the session context section', p.session.indexOf('## Lesson context') > p.session.indexOf('## Current Session Context') && p.session.indexOf('## Pedagogy spine') < p.session.indexOf('## Lesson context')]);
  const onlyCtx = parts({ ...PROMPT_MATRIX.math_g8, lessonContext: { description: 'A lesson on slopes.' } } as builder.SystemPromptContext);
  checks.push(['lesson context without in-flow renders, no close clause', onlyCtx.session.includes('Description: A lesson on slopes.') && !onlyCtx.session.includes(builder.IN_FLOW_CLOSE_CLAUSE)]);
  checks.push(['prompt stays generic', !/gameclass|shark|scrub/i.test(p.session)]);
}

let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
