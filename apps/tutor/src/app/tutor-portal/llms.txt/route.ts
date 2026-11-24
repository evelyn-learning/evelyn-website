/** GET /llms.txt on the developer portal: where a coding assistant starts (partner-dashboard/integration-guide.ts). */
import { dashboardOrigin } from '@/lib/tutor/partner-dashboard/core';
import { llmsTxt } from '@/lib/tutor/partner-dashboard/integration-guide';

export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsTxt(dashboardOrigin()), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
