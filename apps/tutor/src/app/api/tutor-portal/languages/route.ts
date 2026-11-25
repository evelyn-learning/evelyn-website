/**
 * GET /api/tutor-portal/languages: the languages a lesson can be taught in, for everything that offers a choice:
 * the demo pickers on the marketing site and the developer portal, the dashboard's test lesson, the docs and the
 * developer package (Praveen 2026-11-24: adding a language must not mean editing a list in each of those).
 *
 * The list is the engine's own table (voice/lesson-language.ts), rows marked ready. Public and cacheable: it
 * holds nothing about any partner. `Access-Control-Allow-Origin: *` because the developer package and partners'
 * own pages read it from other origins.
 */
import { NextResponse } from 'next/server';
import { offeredLanguages } from '@/lib/tutor/voice/lesson-language';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({ languages: offeredLanguages() }, { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300', 'Access-Control-Allow-Origin': '*' } });
}
