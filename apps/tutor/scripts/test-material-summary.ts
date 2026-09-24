/** Round 4 (E4): the material summary parser/summarizer (stub deps, no
 *  network) + route wiring. Usage: npx tsx scripts/test-material-summary.ts */
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseMaterialSummary, summarizeMaterial, SUMMARY_SAMPLE_CHARS } from '../src/lib/tutor/lesson-plan/material-summary';
import { extractMaterials } from '../src/lib/tutor/lesson-plan/material-extract';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };

(async () => {
  const ok = parseMaterialSummary({ subject: ' Algebra ', level: 'Grade 8', topic: 'Solving linear equations', summary: 'Ten equations to solve.' });
  assert(ok?.subject === 'Algebra' && ok.level === 'Grade 8' && ok.topic === 'Solving linear equations', 'parses and trims');
  assert(parseMaterialSummary({ subject: 'Algebra', level: '', topic: 't', summary: 's' })?.level === undefined, 'empty level omitted');
  assert(parseMaterialSummary({ topic: 't', summary: 's' }) === null, 'missing subject → null');
  assert(parseMaterialSummary(null) === null, 'null → null');
  assert((parseMaterialSummary({ subject: 'x'.repeat(200), topic: 'y'.repeat(300), summary: 'z'.repeat(900) })?.topic.length ?? 0) === 120, 'clips to the contract caps');

  let userLen = 0;
  const deps = { async complete(_s: string, u: string) { userLen = u.length; return 'noise ```json\n{"subject":"Biology","topic":"Cell structure","summary":"Notes on cells."}\n```'; } };
  const s = await summarizeMaterial('x'.repeat(50_000), deps);
  assert(s?.subject === 'Biology' && userLen === SUMMARY_SAMPLE_CHARS, 'fenced JSON parsed; input capped at 12k chars');
  assert((await summarizeMaterial('text', { async complete() { throw new Error('boom'); } })) === null, 'model error → null, never throws');
  let called = false;
  assert((await summarizeMaterial('   ', { async complete() { called = true; return '{}'; } })) === null && !called, 'blank text → null without a model call');

  const route = readFileSync(join(__dirname, '..', 'src/app/api/portal/v1/material-summary/route.ts'), 'utf8');
  assert(route.includes('withPortalAuth(') && route.includes('MaterialSummaryRequestSchema.safeParse('), 'wiring: HMAC + contract validation');
  assert(route.includes('extractMaterials(') && route.includes('status: 422'), 'wiring: extraction failures are 422');
  assert(route.includes("'summary_failed'") && route.includes('MaterialSummaryResponseSchema.parse('), 'wiring: 502 summary_failed; response validated');

  // Final fix wave (M1): the summary route skips the condense pass.
  assert(route.includes('extractMaterials(parsed.data.materials, { skipCondense: true })'), 'M1 wiring: material-summary extracts with skipCondense');
  const big = 'line of worksheet text. '.repeat(1000); // ~24k chars > the 8k condense threshold
  const raw = await extractMaterials([{ kind: 'text', data: Buffer.from(big).toString('base64') } as never], { skipCondense: true });
  assert(raw.ok && raw.combinedText === big, 'M1: skipCondense returns the raw combined text (no Haiku call)');
  const extractSrc = readFileSync(join(__dirname, '..', 'src/lib/tutor/lesson-plan/material-extract.ts'), 'utf8');
  assert(extractSrc.includes('opts: { skipCondense?: boolean } = {}') && extractSrc.includes('!opts.skipCondense && combinedRaw.length > DEFAULT_PIPELINE_TARGET_CHARS'), 'M1: condense stays the default for every other caller');
  console.log(`${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
