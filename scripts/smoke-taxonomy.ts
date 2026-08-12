/**
 * Smoke test for POST /api/portal/v1/taxonomy-generate (Task 3, whitelabel
 * taxonomy slice).
 *
 * Run: `npx tsx scripts/smoke-taxonomy.ts`
 *
 * Makes ONE real LLM call (draftTaxonomyFromOutline → Anthropic). Requires
 * ANTHROPIC_API_KEY. No DB. Mirrors test-plan-generate.ts's signing/
 * invocation pattern: the route handler is invoked directly with a signed
 * Request — no HTTP server is booted.
 */

import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ portalA: 'secret-a' });

import { signPortalRequest } from '@evelyn/portal-contract/auth';
import { POST as taxonomyGeneratePOST } from '@/app/api/portal/v1/taxonomy-generate/route';
import type { NextRequest } from 'next/server';

const SECRET = 'secret-a';
const PARTNER = 'portalA';

function signedRequest(pathWithQuery: string, bodyObj: unknown): NextRequest {
  const body = JSON.stringify(bodyObj);
  const timestamp = String(Date.now());
  const sig = signPortalRequest(SECRET, { method: 'POST', path: pathWithQuery, timestamp, body });
  const headers: Record<string, string> = {
    'x-evelyn-partner': PARTNER,
    'x-evelyn-timestamp': timestamp,
    'x-evelyn-signature': sig,
  };
  return new Request(`https://engine.test${pathWithQuery}`, { method: 'POST', headers, body }) as unknown as NextRequest;
}

// A fake ~20-line published content outline for a healthcare-quality cert,
// the shape a whitelabel org operator would paste in.
const FAKE_OUTLINE = `CPHQ Content Outline (sample)

Domain I: Organizational Leadership (20%)
1. Apply quality management principles across the organization
2. Lead performance improvement initiatives
3. Facilitate change management processes
4. Align quality goals with organizational strategy

Domain II: Health Data Analytics (20%)
1. Collect and validate quality/performance data
2. Apply statistical process control methods
3. Interpret run charts and control charts
4. Report data to stakeholders and regulatory bodies

Domain III: Performance and Process Improvement (20%)
1. Apply PDSA/Six Sigma/Lean methodologies
2. Identify root causes of process failures
3. Design and test process changes
4. Sustain improvement gains over time

Domain IV: Patient Safety (20%)
1. Conduct proactive risk assessments (FMEA)
2. Conduct root cause analysis after sentinel events
3. Build a culture of safety and just-culture reporting
4. Apply human factors principles to error reduction

Domain V: Regulatory and Accreditation (20%)
1. Prepare for accreditation surveys (Joint Commission, CMS)
2. Maintain regulatory compliance documentation
3. Apply infection control and environment-of-care standards`;

async function main() {
  const body = {
    materials: [{ kind: 'text' as const, data: Buffer.from(FAKE_OUTLINE, 'utf-8').toString('base64'), name: 'cphq-outline.txt' }],
    orgKey: 'smoke-test-org',
    topicKey: 'cphq',
  };

  const req = signedRequest('/api/portal/v1/taxonomy-generate', body);
  const res = await taxonomyGeneratePOST(req, undefined);
  const json = await res.json();

  console.log(`status: ${res.status}`);
  console.log(JSON.stringify(json, null, 2));

  if (res.status !== 200) {
    console.error('\nsmoke-taxonomy: FAILED (non-200 response)');
    process.exit(1);
  }
  if (json.generatorOk !== true) {
    console.warn('\nsmoke-taxonomy: WARNING — generatorOk is false (served the fallback stub, not a real draft)');
  }
  const sectionCount = json.taxonomy?.sections?.length ?? 0;
  const loCount = json.taxonomy?.los?.length ?? 0;
  console.log(`\nsmoke-taxonomy: sections=${sectionCount} los=${loCount} generatorOk=${json.generatorOk}`);
  console.log('smoke-taxonomy: done');
}

main().catch((err) => {
  console.error('Fatal error running smoke-taxonomy:', err);
  process.exit(1);
});
