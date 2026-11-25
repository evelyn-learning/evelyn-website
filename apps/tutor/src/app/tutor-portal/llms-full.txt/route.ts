/** GET /llms-full.txt on the developer portal: llms.txt and the integration guide in one file (2026-11-24), for a
 *  coding assistant or a crawler that reads one document (partner-dashboard/integration-guide.ts). */
import { dashboardOrigin } from '@/lib/tutor/partner-dashboard/core';
import { llmsFullTxt } from '@/lib/tutor/partner-dashboard/integration-guide';

export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsFullTxt(dashboardOrigin()), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
