/** GET /docs/integration.md on the developer portal: the whole integration as one Markdown file, for coding
 *  assistants and curl (partner-dashboard/integration-guide.ts). */
import { integrationGuideMarkdown } from '@/lib/tutor/partner-dashboard/integration-guide';

export const dynamic = 'force-static';

export function GET() {
  return new Response(integrationGuideMarkdown(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
